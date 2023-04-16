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
  public add(v: Vector3): Vector3 {
    return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
  }
  public sub(v: Vector3): Vector3 {
    return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
  }
  public mul(v: Vector3): Vector3 {
    return new Vector3(this.x * v.x, this.y * v.y, this.z * v.z);
  }
  public mulXYZ(x: number, y: number, z: number): Vector3 {
    return new Vector3(this.x * x, this.y * y, this.z * z);
  }
  public mulScalar(v: number): Vector3 {
    return new Vector3(this.x * v, this.y * v, this.z * v);
  }
  public div(v: Vector3): Vector3 {
    return new Vector3(this.x / v.x, this.y / v.y, this.z / v.z);
  }
  public magSq(): number {
    const x = this.x;
    const y = this.y;
    const z = this.z;
    return x * x + y * y + z * z;
  }
  public mag(): number { 
    return Math.sqrt(this.magSq());
  }
  public normalize(): Vector3 {
    const len = this.mag();
    // here we multiply by the reciprocal instead of calling 'div()'
    // since div duplicates this zero check.
    if (len !== 0) this.mulScalar(1 / len);
    return this;
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