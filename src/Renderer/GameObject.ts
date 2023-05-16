// Imports
import Vec3 from "../XNA/Vec3";
// GameObject
export default abstract class GameObject {
  // Internals
  // TODO: Figure out how we want to represent our textures
  private pos: Vec3;
  private rot: Vec3;
  // Externals
  // Constructor
  constructor(pos: Vec3, rot: Vec3) {
    this.pos = pos; // PORT: Use the setter here when moving to c#
    this.rot = rot; // PORT: Use the setter here when moving to c#
  }
  // Getters & Setters
  public setPos(pos: Vec3): void {
    this.pos = pos;
  }
  public getPos(): Vec3 {
    return this.pos;
  }
  public setRot(rot: Vec3): void {
    this.rot = rot;
  }
  public getRot(): Vec3 {
    return this.rot;
  }
  // Methods
}
