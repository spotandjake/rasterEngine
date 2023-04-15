// Imports
import Vector3 from './Vector3';
// Types
export interface Model {
  verts: Vector3[];
  faces: number[][];
}
// Game Model
class GameModel {
  // Internals
  public readonly position: Vector3;
  public readonly rotation: Vector3;
  public readonly scale: Vector3;
  public readonly model: Model;
  // Constructor
  constructor(position: Vector3, rotation: Vector3, scale: Vector3, model: Model) {
    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
    this.model = model;
  }
  // Externals
  public getModel() {
    return this.model;
  }
}
// Export default
export default GameModel;