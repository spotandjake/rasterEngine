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
  private position: Vector3;
  private rotation: Vector3;
  private scale: Vector3;
  private model: Model;
  // Constructor
  constructor(position: Vector3, rotation: Vector3, scale: Vector3, model: Model) {
    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
    this.model = model;
  }
  // Externals
  public setModel(model: Model) {
    this.model = model;
  }
  public setPosition(position: Vector3) {
    this.position = position;
  }
  public setRotation(rotation: Vector3) {
    this.rotation = rotation;
  }
  public setScale(scale: Vector3) {
    this.scale = scale;
  }
  public getModel() {
    return this.model;
  }
  public getPosition() {
    return this.position;
  }
  public getRotation() {
    return this.rotation;
  }
  public getScale() {
    return this.scale;
  }
}
// Export default
export default GameModel;