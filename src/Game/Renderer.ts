// Imports
import ScreenWriter from './ScreenWriter';
import DepthBuffer from './DepthBuffer';
import GameObject from './GameObject';
import Color from './Color';
import Vector3 from './Vector3';
// Render Mode
export enum RenderMode {
  WireFrame,
  Solid
}
// This is our renderer
class Renderer {
  // Constants
  private readonly zFar = -1;
  private readonly zNear = 1024;
  // Internals
  private screenWriter: ScreenWriter;
  // use Uint16 because we only need a little precision and we save 2 bytes per pixel this way
  private depthBuffer: DepthBuffer;
  // Render Mode
  private renderMode: RenderMode;
  // Constructor
  constructor() {
    // Create The screenWriter
    this.screenWriter = new ScreenWriter();
    this.screenWriter.clearBackground(new Color(100, 149, 237));
    this.screenWriter.drawFrame();
    // SetRenderMode
    this.renderMode = RenderMode.Solid;
    // Create Our Depth Buffer
    // TODO: Throw this into an on resize function
    this.depthBuffer = new DepthBuffer(this.screenWriter.getWidth(), this.screenWriter.getHeight());
  }
  // Internal Method
  private cross(a: Vector3, b: Vector3, c: Vector3): number {
    return (b.x - a.x) * -(c.y - a.y) - -(b.y - a.y) * (c.x - a.x);
  }
  private fillTriangle(v0: Vector3, v1: Vector3, v2: Vector3, c0: Color, c1: Color, c2: Color): void {
    const { screenWriter, depthBuffer } = this;
    // Calc The Bounding Box
    const minX = Math.floor(Math.min(v0.x, v1.x, v2.x));
    const maxX = Math.ceil(Math.max(v0.x, v1.x, v2.x));
    const minY = Math.floor(Math.min(v0.y, v1.y, v2.y));
    const maxY = Math.ceil(Math.max(v0.y, v1.y, v2.y));
    // precalculate the area of the parallelogram defined by our triangle
    const area = this.cross(v0, v1, v2);
    // p is our 2D pixel location point
    const p = new Vector3(0, 0, 0); 
    // fragment is the resulting pixel with all the vertex attributes interpolated
    const pos = new Vector3(0, 0, 0);
    const color = new Color(0, 0, 0);
    for (let y = minY; y < maxY; y++) {
      for (let x = minX; x < maxX; x++) {
        // sample from the center of the pixel, not the top-left corner
        // This gives us a primitive form of anti-aliasing as well
        p.x = x + 0.5;
        p.y = y + 0.5;
        // calculate vertex weights
        // should divide these by area, but we do that later
        // so we divide once, not three times
        const w0 = this.cross(v1, v2, p);
        const w1 = this.cross(v2, v0, p);
        const w2 = this.cross(v0, v1, p);
        // if the point is not inside our polygon, skip fragment
        if (w0 < 0 || w1 < 0 || w2 < 0) continue;
        // Interpolate Color
        // pos.x = (w0 * v0.x + w1 * v1.x + w2 * v2.x) / area;
        // pos.y = (w0 * v0.y + w1 * v1.y + w2 * v2.y) / area;
        pos.z = (w0 * v0.z + w1 * v1.z + w2 * v2.z) / area;
        // This is a basic form of anti-aliasing
        color.r = (w0 * c0.r + w1 * c1.r + w2 * c2.r) / area * 256;
        color.g = (w0 * c0.g + w1 * c1.g + w2 * c2.g) / area * 256;
        color.b = (w0 * c0.b + w1 * c1.b + w2 * c2.b) / area * 256;
        // TODO: Support proper texture mapping
        // set pixel
        if (depthBuffer.testDepth(x, y, pos.z)) {
          screenWriter.setPixel(x, y, color);
        }
      }
    }
  }
  private isCounterClockWise(v0: Vector3, v1: Vector3, v2: Vector3): boolean {
    return (v1.x - v0.x) * (v2.y - v0.y) - (v1.y - v0.y) * (v2.x - v0.x) >= 0;
  }
  private renderModel(gameObj: GameObject): void {
    const { screenWriter, renderMode, zFar, zNear } = this;
    // Get Model Data
    const { faces, verts } = gameObj.getModel();
    const position = gameObj.getPosition();
    const rotation = gameObj.getRotation();
    const scale = gameObj.getScale();
    // Render The Object
    const centerX = screenWriter.getWidth() / 2.0;
    const centerY = screenWriter.getHeight() / 2.0;  
    // draw our model
    for (let i = 0; i < faces.length; i++) {
      const face = faces[i];
      let v0 = verts[face[0]];
      let v1 = verts[face[1]];
      let v2 = verts[face[2]];
      if (v0 && v1 && v2) {
        if (this.isCounterClockWise(v0, v1, v2)) {
          // Apply model transformations
          v0 = v0.add(position);
          v1 = v1.add(position);
          v2 = v2.add(position);
          // Apply model scale
          v0 = v0.mul(scale);
          v1 = v1.mul(scale);
          v2 = v2.mul(scale);
          // TODO: Apply model rotation
          // TODO: Apply model translation
          // TODO: Apply world transformations
          // TODO: Apply cam rotation
          // TODO: Apply cam translation
          // create some grey scale values from the model's Z values
          // TODO: We really should not be setting the vertex colors here
          const v0value = v0.z / scale.z / 4.5 + 0.5;
          const v1value = v1.z / scale.z / 4.5 + 0.5;
          const v2value = v2.z / scale.z / 4.5 + 0.5;
          // Draw Triangle
          switch (renderMode) {
            case RenderMode.Solid:
              // TODO: Separate screenSpace rendering
              this.fillTriangle(
                new Vector3(
                  centerX + v0.x,
                  centerY - v0.y,
                  (v0.z - zNear) / (zFar - zNear)
                ),
                new Vector3(
                  centerX + v1.x,
                  centerY - v1.y,
                  (v1.z - zNear) / (zFar - zNear)
                ),
                new Vector3(
                  centerX + v2.x,
                  centerY - v2.y,
                  (v2.z - zNear) / (zFar - zNear)
                ),
                new Color(v0value * 1, v0value * 0, v0value* 0 ),
                new Color(v1value * 0, v1value * 1, v1value * 0),
                new Color(v2value * 0, v2value * 0, v2value * 1)
              );
              break;
            case RenderMode.WireFrame:
              // TODO: Support proper screenSpace, take into account z
              screenWriter.drawLine(centerX + v0.x, centerY - v0.y, centerX + v1.x, centerY - v1.y);
              screenWriter.drawLine(centerX + v1.x, centerY - v1.y, centerX + v2.x, centerY - v2.y);
              screenWriter.drawLine(centerX + v2.x, centerY - v2.y, centerX + v0.x, centerY - v0.y);
              break;
          }
        }
      }
    }
  }
  // Public Methods
  public setRenderMode(renderMode: RenderMode) {
    this.renderMode = renderMode;
  }
  public drawObjects(gameObject: GameObject[]): void {
    const { depthBuffer } = this;
    // Clear Depth Buffer
    this.screenWriter.clearBackground(new Color(100, 149, 237));
    depthBuffer.clear();
    // Render the Objects
    for (const gameObj of gameObject) {
      this.renderModel(gameObj);
    }
    // Draw The Pixels To The Screen
    this.screenWriter.drawFrame();
  }
}

// Default Export
export default Renderer;