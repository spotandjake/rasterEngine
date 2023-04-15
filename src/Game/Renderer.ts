// Imports
import ScreenWriter from './ScreenWriter';
import DepthBuffer from './DepthBuffer';
import GameObject from './GameObject';
import Color from './Color';
import Vector3 from './Vector3';
// Note: This should be changed to a struct in c#
class Vertex {
  public point: Vector3;
  public color: Color;
  constructor(point: Vector3, color: Color) {
    this.point = point;
    this.color = color;
  }
}
// This is our renderer
class Renderer {
  // Constants
  private readonly zFar = -2.5;
  private readonly zNear = 2.5;
  // Internals
  private screenWriter: ScreenWriter;
  // use Uint16 because we only need a little precision and we save 2 bytes per pixel this way
  private depthBuffer: DepthBuffer;
  // Constructor
  constructor() {
    // Create The screenWriter
    this.screenWriter = new ScreenWriter();
    this.screenWriter.clearBackground(new Color(100, 149, 237));
    this.screenWriter.drawFrame();
    // Create Our Depth Buffer
    // TODO: Throw this into an on resize function
    this.depthBuffer = new DepthBuffer(this.screenWriter.getWidth(), this.screenWriter.getHeight());
  }
  // Internal Method
  private cross(a: Vector3, b: Vector3, c: Vector3): number {
    return (b.x - a.x) * -(c.y - a.y) - -(b.y - a.y) * (c.x - a.x);
  }
  private fillTriangle(vertex0: Vertex, vertex1: Vertex, vertex2: Vertex): void {
    const { screenWriter, depthBuffer } = this;
    // Get Vectors
    const v0 = vertex0.point;
    const v1 = vertex1.point;
    const v2 = vertex2.point;
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
        pos.x = (w0 * v0.x + w1 * v1.x + w2 * v2.x) / area;
        pos.y = (w0 * v0.y + w1 * v1.y + w2 * v2.y) / area;
        pos.z = (w0 * v0.z + w1 * v1.z + w2 * v2.z) / area;
        color.r = (w0 * vertex0.color.r + w1 * vertex1.color.r + w2 * vertex2.color.r) / area * 256;
        color.g = (w0 * vertex0.color.g + w1 * vertex1.color.g + w2 * vertex2.color.g) / area * 256;
        color.b = (w0 * vertex0.color.b + w1 * vertex1.color.b + w2 * vertex2.color.b) / area * 256;
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
    const { screenWriter, zFar, zNear } = this;
    // Render The Object
    const centerX = screenWriter.getWidth() / 2.0;
    const centerY = screenWriter.getHeight() / 2.0 + 300;  
    const scale = 200;
    // draw our model
    for (let i = 0; i < gameObj.getModel().faces.length; i++) {
      const model = gameObj.getModel();
      const face = model.faces[i];
      const v0 = model.verts[face[0] - 1];
      const v1 = model.verts[face[1] - 1];
      const v2 = model.verts[face[2] - 1];
      if (v0 && v1 && v2) {
        if (this.isCounterClockWise(v0, v1, v2)) {
          // create some greyscale values from the model's Z values
          // TODO: We really should not be setting the vertex colors here
          const v0value = v0.z / 4.5 + 0.5;
          const v1value = v1.z / 4.5 + 0.5;
          const v2value = v2.z / 4.5 + 0.5;
          // TODO: Apply world transformations
          // TODO: I do not feel like here is the right place to make vertex's
          this.fillTriangle(
            new Vertex(
              new Vector3(
                centerX + v0.x * scale,
                centerY - v0.y * scale,
                (v0.z - zNear) / (zFar - zNear)
              ),
              new Color(
                v0value,
                v0value,
                v0value
              )
            ),
            new Vertex(
              new Vector3(
                centerX + v1.x * scale,
                centerY - v1.y * scale,
                (v1.z - zNear) / (zFar - zNear)
              ),
              new Color(
                v1value,
                v1value,
                v1value
              )
            ),
            new Vertex(
              new Vector3(
                centerX + v2.x * scale,
                centerY - v2.y * scale,
                (v2.z - zNear) / (zFar - zNear)
              ),
              new Color(
                v2value,
                v2value,
                v2value
              )
            )
          );
          // TODO: Add The Ability to toggle wireFrame
          // screenWriter.drawLine(centerX + v0.x * scale, centerY - v0.y * scale, centerX + v1.x * scale, centerY - v1.y * scale);
          // screenWriter.drawLine(centerX + v1.x * scale, centerY - v1.y * scale, centerX + v2.x * scale, centerY - v2.y * scale);
          // screenWriter.drawLine(centerX + v2.x * scale, centerY - v2.y * scale, centerX + v0.x * scale, centerY - v0.y * scale);
        }
      } else {
        if (!v0) { console.log("Vertice " + (face[0] - 1) + " not found!"); }
        if (!v1) { console.log("Vertice " + (face[1] - 1) + " not found!"); }
        if (!v2) { console.log("Vertice " + (face[2] - 1) + " not found!"); }
      }
    }
  }
  // Public Methods
  // TODO: This should not directly take a game object
  public drawObjects(gameObject: GameObject[]): void {
    const { depthBuffer } = this;
    // Clear Depth Buffer
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