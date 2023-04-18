// Imports
import Vector3 from "./Vector3";
import Vector2 from "./Vector2";
// Vertex Class
class Vertex {
  // Internals
  public pos: Vector3;
  public color: number;
  public texCoord: Vector2;
  public normal: Vector3;
  public tangent: Vector3;
  public biTangent: Vector3;
  // Constructor
  constructor(
    pos: Vector3,
    color: number,
    texCoord: Vector2 = new Vector2(0.0, 0.0),
    normal: Vector3 = new Vector3(0, 0, 0),
    tangent: Vector3 = new Vector3(0, 0, 0),
    biTangent: Vector3 = new Vector3(0, 0, 0)
  ) {
    this.pos = pos;
    this.color = color;
    this.texCoord = texCoord;
    this.normal = normal;
    this.tangent = tangent;
    this.biTangent = biTangent;
  }
}
export default Vertex;
