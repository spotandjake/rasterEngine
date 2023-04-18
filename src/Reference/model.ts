import { Face } from "./face";
import { Vec2, Vec3 } from "./math";
import { Vertex } from "./vertex";

export class Model {
  private vPositions: number[][];
  private vTexCoords: number[][];
  private vNormals: number[][];
  private indices: number[][][];
  public faces: Face[];
  constructor(vPositions: number[][], vTexCoords: number[][], vNormals: number[][], indices: number[][][]) {
    this.vPositions = vPositions;
    this.vTexCoords = vTexCoords;
    this.vNormals = vNormals;
    this.indices = indices;
    this.faces = [];

    for (let i = 0; i < this.indices.length; ++i) {
      let vFace = this.indices[i];

      const faceVert = [];
      for (let v = 0; v < 3; v++) {
        const pos = this.getPosition(vFace[v][0] - 1);
        const tex = this.getTexCoord(vFace[v][1] - 1);
        const nor = this.getNormal(vFace[v][2] - 1);
        faceVert.push(new Vertex(pos, 0xffffff, tex, nor));
      }

      const face = new Face(faceVert[0], faceVert[1], faceVert[2]);
      face.calcTangentAndBiTangent();

      this.faces.push(face);
    }
  }
  public getPosition(pos: number): Vec3 {
    return new Vec3(
      this.vPositions[pos][0],
      this.vPositions[pos][1],
      this.vPositions[pos][2]
    );
  }
  public getTexCoord(tex: number): Vec2 {
    return new Vec2(this.vTexCoords[tex][0], this.vTexCoords[tex][1]);
  }
  public getNormal(nor: number): Vec3 {
    return new Vec3(
      this.vNormals[nor][0],
      this.vNormals[nor][1],
      this.vNormals[nor][2]
    );
  }
}
