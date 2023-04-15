// Vector3 class
// When moving to c# this should be a struct
class Vector3 {
  public x: number;
  public y: number;
  public z: number;
  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  } 
  // Methods
  public clone(): Vector3 {
    return new Vector3(this.x, this.y, this.z);
  }
  public crossProduct(v: Vector3): Vector3 {
    return new Vector3(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  }
}
// Export Default
export default Vector3;