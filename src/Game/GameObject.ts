// Imports
import Vector3 from './Vector3';
// GameObject
class GameObject {
  // Internal Properties
  private position: Vector3;
  private rotation: Vector3;
  private scale: Vector3;
  // TODO: replace Texture with a material class
  // Constructor
  constructor(position: Vector3, rotation: Vector3, scale: Vector3) {
    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
    
  }
  // Private Methods
  // Public Methods
  public getPosition(): Vector3 {
    return this.position;
  }
  public setPosition(position: Vector3): void {
    this.position = position;
  }
  public getRotation(): Vector3 {
    return this.rotation;
  }
  public setRotation(rotation: Vector3): void {
    this.rotation = rotation;
  }
  public getScale(): Vector3 {
    return this.scale;
  }
  public setScale(scale: Vector3): void {
    this.scale = scale;
  }
}
export default GameObject;