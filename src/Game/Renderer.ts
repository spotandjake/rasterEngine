// Imports
import ScreenWriter from "./ScreenWriter";
import Vertex from "./Vertex";
import Vector2 from "./Vector2";
import Mat4 from "./Mat4";
import Utils from "./Utils";
// This handles all rendering
class Renderer extends ScreenWriter {
  // =================================================
  // Internals
  // =================================================
  // Settings
  private zClipNear: number = 0.2;
  private normalLength: number = 0.1;
  private fov: number;
  // Storage
  private zBuffer: Float32Array;
  private cameraTransform: Mat4;
  private transform: Mat4;
  private tbn: Mat4;
  // TODO: Store halfWidth and halfHeight, these are calculated a lot and they are constant values, division is slow
  // Flags
  private renderBackground: boolean = true;
  private renderCCW: boolean = true;
  private renderFaceNormal: boolean = false;
  private renderTangentNormal: boolean = false;
  private renderVertexNormal: boolean = false;
  private renderTangentSpace: boolean = false;
  private renderCalcLight: boolean = true;
  private renderFlipNormalY: boolean = false;
  // =================================================
  // Constructor
  // =================================================
  constructor(width: number, height: number) {
    super(width, height);
    // Set Internals
    this.fov = height / 4; // TODO: Figure out how to convert this to an angle
    this.zBuffer = new Float32Array(width * height);
    this.cameraTransform = new Mat4();
    this.transform = new Mat4();
    this.tbn = new Mat4(); // Tangent Matrix
    // Clear The Background
    this.clearBackground(0x6495ed);
  }
  // Private Methods
  // =================================================
  private viewTransform(v: Vertex): Vertex {
    // Get Internals
    const { cameraTransform } = this;
    // Calculations
    const newPos = cameraTransform.mulVector(v.pos);
    newPos.z *= -1.0;

    const newNor =
      v.normal != undefined
        ? cameraTransform.mulVector(v.normal, 0.0).normalized()
        : undefined;
    const newTan =
      v.tangent != undefined
        ? cameraTransform.mulVector(v.tangent, 0.0).normalized()
        : undefined;
    const newBiTan =
      v.biTangent != undefined
        ? cameraTransform.mulVector(v.biTangent, 0.0).normalized()
        : undefined;

    return new Vertex(newPos, v.color, v.texCoord, newNor, newTan, newBiTan);
  }
  // Local space -> World space
  private modelTransform(v: Vertex): Vertex {
    // Get Cached Values
    const { transform } = this;
    // Transform Model
    const newPos = transform.mulVector(v.pos, 1.0);
    const newNor =
      v.normal != undefined
        ? transform.mulVector(v.normal, 0.0).normalized()
        : undefined;
    const newTan =
      v.tangent != undefined
        ? transform.mulVector(v.tangent, 0.0).normalized()
        : undefined;
    const newBiTan =
      v.biTangent != undefined
        ? transform.mulVector(v.biTangent, 0.0).normalized()
        : undefined;

    return new Vertex(newPos, v.color, v.texCoord, newNor, newTan, newBiTan);
  }
  private renderPixel(x: number, y: number, z: number, c: number): void {
    // Get cached Vars
    const { width, height } = this;
    // Make sure that its on screen
    if (x < 0 || x >= width || y < 0 || y >= height) {
      return;
    }
    // Make sure that there is not a point closer in the z buffer than this one
    if (z >= this.zBuffer[x + (height - 1 - y) * width]) {
      return;
    }
    this.setPixel(x, y, c);
    this.zBuffer[x + (height - 1 - y) * width] = z;
  }
  // Expect the input vertices to be in the camera space(view space)
  private drawTriangleViewSpace(vp0: Vertex, vp1: Vertex, vp2: Vertex): void {
    // Get Cached Vars
    const { renderCalcLight, renderBackground, fov, width, height } = this;
    // Draw
    const z0 = vp0.pos.z;
    const z1 = vp1.pos.z;
    const z2 = vp2.pos.z;
    // Transform a vertices in camera space to viewport space at one time (Avoid heavy matrix multiplication)
    // Projection transform + viewport transform
    const p0 = new Vector2(
      (vp0.pos.x / vp0.pos.z) * fov + width / 2.0 - 0.5,
      (vp0.pos.y / vp0.pos.z) * fov + height / 2.0 - 0.5
    );
    const p1 = new Vector2(
      (vp1.pos.x / vp1.pos.z) * fov + width / 2.0 - 0.5,
      (vp1.pos.y / vp1.pos.z) * fov + height / 2.0 - 0.5
    );
    const p2 = new Vector2(
      (vp2.pos.x / vp2.pos.z) * fov + width / 2.0 - 0.5,
      (vp2.pos.y / vp2.pos.z) * fov + height / 2.0 - 0.5
    );

    let minX = Math.ceil(Math.min(p0.x, p1.x, p2.x));
    let maxX = Math.ceil(Math.max(p0.x, p1.x, p2.x));
    let minY = Math.ceil(Math.min(p0.y, p1.y, p2.y));
    let maxY = Math.ceil(Math.max(p0.y, p1.y, p2.y));

    if (minX < 0) minX = 0;
    if (minY < 0) minY = 0;
    if (maxX > this.width) maxX = this.width;
    if (maxY > this.height) maxY = this.height;

    const v10 = new Vector2(p1.x - p0.x, p1.y - p0.y);
    const v21 = new Vector2(p2.x - p1.x, p2.y - p1.y);
    const v02 = new Vector2(p0.x - p2.x, p0.y - p2.y);
    const v20 = new Vector2(p2.x - p0.x, p2.y - p0.y);

    const area = v10.cross(v20);

    // Culling back faces
    if (area < 0) return;

    let depthMin = renderBackground ? 9999 : 0;
    let calcLight = renderCalcLight;

    for (let y = minY; y < maxY; ++y) {
      for (let x = minX; x < maxX; ++x) {
        let p = new Vector2(x, y);

        let w0 = v21.cross(p.sub(p1));
        let w1 = v02.cross(p.sub(p2));
        let w2 = v10.cross(p.sub(p0));

        // Render Clock wise
        if (w0 < 0 || w1 < 0 || w2 < 0) continue;

        w0 /= area;
        w1 /= area;
        w2 /= area;

        // Z value of current fragment(pixel)
        const z = 1.0 / (w0 / z0 + w1 / z1 + w2 / z2);
        let color = 0;

        // Fragment(Pixel) Shader Begin
        {
          const uv = Util.lerp3AttributeVec2(
            vp0.texCoord,
            vp1.texCoord,
            vp2.texCoord,
            w0,
            w1,
            w2,
            z0,
            z1,
            z2,
            z
          );
          const pixelPos = vp0.pos
            .mulScalar(w0)
            .add(vp1.pos.mulScalar(w1))
            .add(vp2.pos.mulScalar(w2))
            .mulXYZ(1, 1, -1);

          let pixelNormal = undefined;
          if (this.normalMap != undefined) {
            const _sampledNormal = Util.sample(this.normalMap, uv.x, uv.y);
            let sampledNormal =
              Util.convertColorToVectorRange2(_sampledNormal).normalized();

            if (!this.renderFlipNormalY) {
              sampledNormal.y *= -1;
            }

            sampledNormal = this.tbn.mulVector(sampledNormal, 0);
            pixelNormal = sampledNormal.normalized();
          } else {
            pixelNormal = Util.lerp3AttributeVec3(
              vp0.normal,
              vp1.normal,
              vp2.normal,
              w0,
              w1,
              w2,
              z0,
              z1,
              z2,
              z
            );
          }

          if (this.difuseMap == undefined) {
            color = Util.convertVectorToColorHex(
              Util.lerp3AttributeVec3(
                vp0.color,
                vp1.color,
                vp2.color,
                w0,
                w1,
                w2,
                z0,
                z1,
                z2,
                z
              )
            );
          } else {
            color = Util.sample(this.difuseMap, uv.x, uv.y);
          }

          if (calcLight) {
            const toLight = this.sun.dirVS.mul(-1).normalized();

            let diffuse = toLight.dot(pixelNormal) * this.sun.intensity;
            diffuse = Util.clamp(diffuse, this.ambient, 1.0);

            let specular = 0;

            // Phong specular reflection
            if (this.specularIntensity != undefined) {
              const toView = pixelPos.mul(-1).normalized();

              let reflection = pixelNormal
                .mul(2 * toLight.dot(pixelNormal))
                .sub(toLight)
                .normalized();
              specular = Math.pow(
                Math.max(0, toView.dot(reflection)),
                this.specularIntensity
              );
            }

            color = Util.mulColor(color, diffuse + specular);
          }
        }
        // Fragment(Pixel) Shader End
        this.renderPixel(x, y, z + depthMin, color);
      }
    }
  }
  private drawPoint(vertex: Vertex): void {
    // Get Internals
    const { fov, width, height, zClipNear } = this;
    // Draw Point
    const v = this.viewTransform(vertex);
    if (v.pos.z < zClipNear) return;
    const sx = Math.ceil((v.pos.x / v.pos.z) * fov + width / 2.0);
    const sy = Math.ceil((v.pos.y / v.pos.z) * fov + height / 2.0);
    this.renderPixel(sx, sy, v.pos.z, v.color);
  }
  private drawLine(v0: Vertex, v1: Vertex): void {
    // Get Internal Vars
    const { zClipNear, fov, width, height } = this;
    // Draw Line
    v0 = this.viewTransform(v0);
    v1 = this.viewTransform(v1);
    // z-Near clipping
    if (v0.pos.z < zClipNear && v1.pos.z < zClipNear) return;
    if (v0.pos.z < zClipNear) {
      const per = (zClipNear - v0.pos.z) / (v1.pos.z - v0.pos.z);
      v0.pos = v0.pos.add(v1.pos.sub(v0.pos).mulScalar(per));
      // TODO: Look into if we need todo a color lerp, i.e each component separately
      v0.color = Utils.lerpColor(v0.color, v1.color, per);
    }
    if (v1.pos.z < zClipNear) {
      const per = (zClipNear - v1.pos.z) / (v0.pos.z - v1.pos.z);
      v1.pos = v1.pos.add(v0.pos.sub(v1.pos).mulScalar(per));
      // TODO: Look into if we need todo a color lerp, i.e each component seperatly
      v1.color = Utils.lerpColor(v1.color, v0.color, per);
    }
    // Transform a vertices in camera space to viewport space at one time (Avoid heavy matrix multiplication)
    // Projection transform + viewport transform
    let p0 = new Vector2(
      (v0.pos.x / v0.pos.z) * fov + width / 2.0 - 0.5,
      (v0.pos.y / v0.pos.z) * fov + height / 2.0 - 0.5
    );
    let p1 = new Vector2(
      (v1.pos.x / v1.pos.z) * fov + width / 2.0 - 0.5,
      (v1.pos.y / v1.pos.z) * fov + height / 2.0 - 0.5
    );
    // Render left to right
    if (p1.x < p0.x) {
      const tmpP = p0;
      p0 = p1;
      p1 = tmpP;
      const tmpV = v0;
      v0 = v1;
      v1 = tmpV;
    }
    let x0 = Math.ceil(p0.x);
    let y0 = Math.ceil(p0.y);
    let x1 = Math.ceil(p1.x);
    let y1 = Math.ceil(p1.y);
    // Clip to screen space
    if (x0 < 0) x0 = 0;
    if (x1 > width) x1 = width;
    if (y0 < 0) y0 = 0;
    if (y1 > height) y1 = height;

    const dx = p1.x - p0.x;
    const dy = p1.y - p0.y;

    const m = Math.abs(dy / dx);

    if (m <= 1) {
      // perCache
      const perCache = p1.x - p0.x;
      // Fill X
      for (let x = x0; x < x1; ++x) {
        const per = (x - p0.x) / perCache;

        const y = p0.y + (p1.y - p0.y) * per;
        const z = 1 / ((1 - per) / v0.pos.z + per / v1.pos.z);

        const c = Utils.lerpColorComponent(
          v0.color,
          v1.color,
          1 - per,
          per,
          v0.pos.z,
          v1.pos.z,
          z
        );

        this.renderPixel(Math.ceil(x), Math.ceil(y), z, c);
      }
    }
  }

  private drawTriangle(
    v0: Vertex,
    v1: Vertex,
    v2: Vertex,
    normalMap?: ImageData
  ): void {
    // Get Internal Vars
    const {
      zClipNear,
      renderCCW,
      normalLength,
      renderFaceNormal,
      renderTangentNormal,
      renderVertexNormal,
      renderTangentSpace,
    } = this;
    // Render CCW
    if (renderCCW) {
      const tmp = v0;
      v0 = v1;
      v1 = tmp;
    }
    // Calculate Surface Normal
    if (
      v0.normal == undefined ||
      v1.normal == undefined ||
      v2.normal == undefined
    ) {
      const normal = v2.pos.sub(v0.pos).cross(v1.pos.sub(v0.pos)).normalized();
      v0.normal = normal;
      v1.normal = normal;
      v2.normal = normal;
    }
    v0 = this.modelTransform(v0);
    v1 = this.modelTransform(v1);
    v2 = this.modelTransform(v2);
    // Render Face normal
    if (renderFaceNormal && !renderTangentNormal) {
      const center = v0.pos.add(v1.pos.add(v2.pos)).divScalar(3.0);
      this.drawLine(
        new Vertex(center, 0xffffff),
        new Vertex(
          center.add(
            v0.normal
              .add(v1.normal)
              .add(v2.normal)
              .normalized()
              .mulScalar(normalLength)
          ),
          0xff00ff
        )
      );
    }
    // Render Vertex normal
    if (renderVertexNormal) {
      const pos = v0.pos;
      this.drawLine(
        new Vertex(pos, 0xffffff),
        new Vertex(pos.add(v0.normal.mulScalar(normalLength)), 0x0000ff)
      );
    }
    // Render Tangent space
    if (renderTangentSpace && v0.tangent != undefined) {
      const pos = v0.pos.add(v1.pos).add(v2.pos).divScalar(3);
      this.drawLine(
        new Vertex(pos, 0xffffff),
        new Vertex(pos.add(v0.tangent.mulScalar(normalLength)), 0xff0000)
      );
      this.drawLine(
        new Vertex(pos, 0xffffff),
        new Vertex(pos.add(v0.biTangent.mulScalar(normalLength)), 0x00ff00)
      );
      this.drawLine(
        new Vertex(pos, 0xffffff),
        new Vertex(pos.add(v0.normal.mulScalar(normalLength)), 0x0000ff)
      );
    }
    v0 = this.viewTransform(v0);
    v1 = this.viewTransform(v1);
    v2 = this.viewTransform(v2);
    // Vertex Shader + Geometry Shader Begin
    if (normalMap != undefined) {
      this.tbn = this.tbn.fromAxis(
        v0.tangent,
        v0.biTangent,
        v0.normal.add(v1.normal).add(v2.normal).normalized()
      );
    }
    // Vertex Shader + Geometry Shader End

    // z-Near clipping for triangle (my own algorithm used)
    if (v0.pos.z < zClipNear && v1.pos.z < zClipNear && v2.pos.z < zClipNear) {
      return;
    } else if (
      v0.pos.z > zClipNear &&
      v1.pos.z > zClipNear &&
      v2.pos.z > zClipNear
    ) {
      this.drawTriangleViewSpace(v0, v1, v2);
      return;
    }

    const vps = [v0, v1, v2, v0];
    const drawVertices = [];

    for (let i = 0; i < 3; ++i) {
      const cv = vps[i];
      const nv = vps[i + 1];

      const cvToNear = cv.pos.z - zClipNear;
      const nvToNear = nv.pos.z - zClipNear;

      if (cvToNear < 0 && nvToNear < 0) continue;

      // If the edge intersects with z-Near plane
      if (cvToNear * nvToNear < 0) {
        const per = (zClipNear - cv.pos.z) / (nv.pos.z - cv.pos.z);

        const clippedPos = cv.pos.add(nv.pos.sub(cv.pos).mulScalar(per));
        const clippedCol = cv.color.add(nv.color.sub(cv.color).mulScalar(per));
        const clippedTxC = cv.texCoord.add(
          nv.texCoord.sub(cv.texCoord).mulScalar(per)
        );

        if (cvToNear > 0) drawVertices.push(cv);

        drawVertices.push(
          new Vertex(clippedPos, clippedCol, clippedTxC, cv.normal)
        );
      } else {
        drawVertices.push(cv);
      }
    }
    switch (drawVertices.length) {
      case 3:
        this.drawTriangleViewSpace(
          drawVertices[0],
          drawVertices[1],
          drawVertices[2]
        );
        break;
      case 4:
        this.drawTriangleViewSpace(
          drawVertices[0],
          drawVertices[1],
          drawVertices[2]
        );
        this.drawTriangleViewSpace(
          drawVertices[0],
          drawVertices[2],
          drawVertices[3]
        );
        break;
    }
  }
  // Public Methods
  // =================================================
  // TODO: Replace any
  public drawGameItems(gameItems: any[]): void {
    // Get GameObject Variables
    // Set Game Item Material
    // Draw Model
  }
}
export default Renderer;
