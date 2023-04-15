// TODO: Figure out if this should become a class or what
import { type Model } from './Game/GameObject';
import Vector3 from "./Game/Vector3";
// This handles parsing obj files
const parseObj = (rawObj: string): Model => {
  const verts = [];
  const faces = [];
  // split the text into lines
  const lines = rawObj.replace('\r', '').split('\n');
  for (const line of lines) {
    if (line[0] == 'v') {
      // lines that start with 'v' are vertices
      const tokens = line.split(' ');
      verts.push(new Vector3(
        parseFloat(tokens[1]), 
        parseFloat(tokens[2]), 
        parseFloat(tokens[3])
      ));
    } else if (line[0] == 'f') {
      // lines that start with 'f' are faces
      const tokens = line.split(' ');
      const face = [
        parseInt(tokens[1], 10),
        parseInt(tokens[2], 10),
        parseInt(tokens[3], 10)
      ];
      if (face[0] < 0) {
        face[0] = verts.length + face[0];
      }
      if (face[1] < 0) {
        face[1] = verts.length + face[1];
      }
      if (face[2] < 0) {
        face[2] = verts.length + face[2];
      }
      face[0] -= 1;
      face[1] -= 1;
      face[2] -= 1;
      faces.push(face);
    }
  }
  // return an object containing our vertices and faces
  return {
    verts: verts,
    faces: faces
  };
}

export default parseObj;