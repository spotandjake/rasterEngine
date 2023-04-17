import { Vec2, Vec3 } from "./math";

export class Vertex {
  public pos: Vec3;
  public color: Vec3;
  public texCoord: Vec2;
  public normal: Vec3;
  public tangent: Vec3;
  public biTangent: Vec3;
  constructor(
    pos: Vec3,
    color: Vec3 | number | undefined,
    texCoord: Vec2 | undefined = undefined,
    normal: Vec3 = new Vec3(0, 0, 0),
    tangent: Vec3 = new Vec3(0, 0, 0),
    biTangent: Vec3 = new Vec3(0, 0, 0)
  ) {
    this.pos = pos;
    if (typeof color == "number") {
      this.color = new Vec3(
        (color >> 16) & 0xff,
        (color >> 8) & 0xff,
        color & 0xff
      );
    } else if (color == undefined) {
      this.color = new Vec3(255, 0, 255);
    } else {
      this.color = color;
    }
    if (texCoord == undefined) {
      this.texCoord = new Vec2(0.0, 0.0);
    } else {
      this.texCoord = texCoord;
    }
    this.normal = normal;
    this.tangent = tangent;
    this.biTangent = biTangent;
  }
}
