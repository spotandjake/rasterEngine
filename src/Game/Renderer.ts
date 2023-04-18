// Imports
import ScreenWriter from "./ScreenWriter";
import Vertex from "./Vertex";
import Vector3 from "./Vector3";
import Mat4 from "./Mat4";
// This handles all rendering
class Renderer extends ScreenWriter {
  // =================================================
  // Internals
  // =================================================
  // Settings
  private zClipNear: number = 0.2;
  private fov: number;
  // Storage
  private zBuffer: Float32Array;
  private cameraTransform: Mat4;
  // Flags
  private renderBackground: boolean = true;
  // =================================================
  // Constructor
  // =================================================
  constructor(width: number, height: number) {
    super(width, height);
    // Set Internals
    this.fov = height / 4; // TODO: Figure out how to convert this to an angle
    this.zBuffer = new Float32Array(width * height);
    this.cameraTransform = new Mat4();
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
  private renderPixel(p: Vector3, c: number): void {
    // Make sure that its on screen
    if (p.x < 0 || p.x >= this.width || p.y < 0 || p.y >= this.height) {
      return;
    }
    // Make sure that there is not a point closer in the z buffer than this one
    if (p.z >= this.zBuffer[p.x + (this.height - 1 - p.y) * this.width]) {
      return;
    }
    this.setPixel(p.x, p.y, c);
    this.zBuffer[p.x + (this.height - 1 - p.y) * this.width] = p.z;
  }
  private drawPoint(vertex: Vertex): void {
    // Get Internals
    const { fov, width, height } = this;
    // Draw Point
    const v = this.viewTransform(vertex);
    if (v.pos.z < this.zClipNear) return;
    const sx = Math.ceil((v.pos.x / v.pos.z) * fov + width / 2.0);
    const sy = Math.ceil((v.pos.y / v.pos.z) * fov + height / 2.0);
    this.renderPixel(new Vector3(sx, sy, v.pos.z), v.color);
  }
  private drawLine(): void {}
  private drawTriangle(): void {}
  // Public Methods
  // =================================================
  public drawGameItems(): void {}
}
export default Renderer;
