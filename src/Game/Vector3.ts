// Vector3 class
// When moving to c# this should be a struct
class Vector3 {
  public readonly x: number;
  public readonly y: number;
  public readonly z: number;
  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  } 
}
// Export Default
export default Vector3;