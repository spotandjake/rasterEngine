import { Vec3, Mat4 } from "./math";

export class Camera {
  public pos: Vec3;
  public rot: Vec3;
  public cameraTransform: Mat4;
  constructor() {
    this.pos = new Vec3(0.0, 0.0, 0.0);
    this.rot = new Vec3(0.0, 0.0, 0.0);
    this.cameraTransform = new Mat4();
  }
}
