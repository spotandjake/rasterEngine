import { Model } from './Reference/model';
// Handle Parsing Models
class ModelParser {
  // Constructor
  constructor() {}
  // ObjParser
  public ObjParser(obj: string): Model {
    const lines = obj.split("\n");
    const positions = [];
    const texCoords = [];
    const normals = [];
    const indices = [];
    for (const line of lines) {
      const tokens = line.split(' ');
      switch (tokens[0]) {
        case 'v':
          const v = [];
          for (let i = 0; i < 3; ++i) {
            v.push(parseFloat(tokens[i + 1]));
          }
          positions.push(v);
          break;
        case 'vt':
          const tc = [];
          for (let i = 0; i < 2; ++i) {
            tc.push(parseFloat(tokens[i + 1]));
          }
          texCoords.push(tc);
          break;
        case 'vn':
          const vn = [];
          for (let i = 0; i < 3; ++i) {
            vn.push(parseFloat(tokens[i + 1]));
          }
          normals.push(vn);
          break;
        case 'f':
          const f = [];
          for (let i = 0; i < 3; ++i) {
            const v = [];
            for (let j = 0; j < 3; j++) {
              v.push(parseInt(tokens[i + 1].split('/')[j]));
            }
            f.push(v);
          }
          indices.push(f);
          break;
      }
    }
    return new Model(positions, texCoords, normals, indices);
  }
}
export default ModelParser;