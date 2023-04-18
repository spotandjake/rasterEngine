// Vector3 Definition
class Vector3 {
  // Properties
  public x: number;
  public y: number;
  public z: number;
  // Constructor
  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  // Private Methods
  // Public Methods
  public normalized(): Vector3 {
    let invLength = 1.0 / this.getLength();
    return new Vector3(this.x * invLength, this.y * invLength, this.z * invLength);
  }
  public getLength(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
  public dot(v: Vector3): number {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }
  public cross(v: Vector3): Vector3 {
    return new Vector3(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  }
  public add(v: Vector3): Vector3 {
    return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
  }
  public addScalar(v: number): Vector3 {
    return new Vector3(this.x + v, this.y + v, this.z + v);
  }
  public addXYZ(x: number, y: number, z: number): Vector3 {
    return new Vector3(this.x + x, this.y + y, this.z + z);
  }
  public sub(v: Vector3): Vector3 {
    return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
  }
  public subScalar(v: number): Vector3 {
    return new Vector3(this.x - v, this.y - v, this.z - v);
  }
  public subXYZ(x: number, y: number, z: number): Vector3 {
    return new Vector3(this.x - x, this.y - y, this.z - z);
  }
  public div(v: Vector3): Vector3 {
    return new Vector3(this.x / v.x, this.y / v.y, this.z / v.z);
  }
  public divScalar(v: number): Vector3 {
    return new Vector3(this.x / v, this.y / v, this.z / v);
  }
  public divXYZ(x: number, y: number, z: number): Vector3 {
    return new Vector3(this.x / x, this.y / y, this.z / z);
  }
  public mul(v: Vector3): Vector3 {
    return new Vector3(this.x * v.x, this.y * v.y, this.z * v.z);
  }
  public mulScalar(v: number): Vector3 {
    return new Vector3(this.x * v, this.y * v, this.z * v);
  }
  public mulXYZ(x: number, y: number, z: number): Vector3 {
    return new Vector3(this.x * x, this.y * y, this.z * z);
  }
  public equals(v: Vector3): boolean {
    return this.x == v.x && this.y == v.y && this.z == v.z;
  }
}
export default Vector3;