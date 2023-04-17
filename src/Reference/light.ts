import { Vec3 } from "./math";

export class DirectionalLight {
  public rotation: Vec3;
  public intensity: number;
  public posRelativeToZero: Vec3;
  public dirVS: Vec3;
  public color: number;
  constructor() {
    this.rotation = new Vec3(0, 0, 0);

    this.intensity = 1.1;
    this.posRelativeToZero = new Vec3(1.0, 1.0, 0.7).normalized();
    this.dirVS = new Vec3(0.0, 0.0, 0.0); // Light direction in the view space
    this.color = 0xffffff;
  }
}
