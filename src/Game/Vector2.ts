// Vector2 Definition
class Vector2 {
  // Properties
  public x: number;
  public y: number;
  // Constructor
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  // Private Methods
  // Public Methods
  public normalize(): number {
    let length = this.getLength();
    let invLength = 1.0 / length;
    this.x *= invLength;
    this.y *= invLength;
    return length;
  }
  public normalized(): Vector2 {
    let invLength = 1.0 / this.getLength();
    return new Vector2(this.x * invLength, this.y * invLength);
  }
  public getLength(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  public dot(v: Vector2): number {
    return this.x * v.x + this.y * v.y;
  }
  public cross(v: Vector2): number {
    return this.y * v.x - this.x * v.y;
  }
  public add(v: Vector2): Vector2 {
    return new Vector2(this.x + v.x, this.y + v.y);
  }
  public addScalar(v: number): Vector2 {
    return new Vector2(this.x + v, this.y + v);
  }
  public addXY(x: number, y: number): Vector2 {
    return new Vector2(this.x + x, this.y + y);
  }
  public sub(v: Vector2): Vector2 {
    return new Vector2(this.x - v.x, this.y - v.y);
  }
  public subScalar(v: number): Vector2 {
    return new Vector2(this.x - v, this.y - v);
  }
  public subXY(x: number, y: number): Vector2 {
    return new Vector2(this.x - x, this.y - y);
  }
  public div(v: Vector2): Vector2 {
    return new Vector2(this.x / v.x, this.y / v.y);
  }
  public divScalar(v: number): Vector2 {
    return new Vector2(this.x / v, this.y / v);
  }
  public divXY(x: number, y: number): Vector2 {
    return new Vector2(this.x / x, this.y / y);
  }
  public mul(v: Vector2): Vector2 {
    return new Vector2(this.x * v.x, this.y * v.y);
  }
  public mulScalar(v: number): Vector2 {
    return new Vector2(this.x * v, this.y * v);
  }
  public mulXY(x: number, y: number): Vector2 {
    return new Vector2(this.x * x, this.y * y);
  }
  public equals(v: Vector2): boolean {
    return this.x == v.x && this.y == v.y;
  }
}
export default Vector2;
