export class Vec2 {
  public x: number;
  public y: number;
  constructor(x = 0.0, y = 0.0) {
    this.x = x;
    this.y = y;
  }
  public normalize() {
    let length = this.getLength();
    let invLength = 1.0 / length;
    this.x *= invLength;
    this.y *= invLength;
    return length;
  }
  public normalized(): Vec2 {
    let invLength = 1.0 / this.getLength();
    return new Vec2(this.x * invLength, this.y * invLength);
  }
  public getLength(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  public dot(v: Vec2): number {
    return this.x * v.x + this.y * v.y;
  }
  public cross(v: Vec2): number {
    return this.y * v.x - this.x * v.y;
  }
  public add(v: Vec2): Vec2 {
    return new Vec2(this.x + v.x, this.y + v.y);
  }
  public sub(v: Vec2): Vec2 {
    return new Vec2(this.x - v.x, this.y - v.y);
  }
  public div(v: number): Vec2 {
    return new Vec2(this.x / v, this.y / v);
  }
  public mul(v: number): Vec2 {
    return new Vec2(this.x * v, this.y * v);
  }
  public equals(v: Vec2): boolean {
    return this.x == v.x && this.y == v.y;
  }
}

export class Vec3 {
  public x: number;
  public y: number;
  public z: number;
  constructor(x = 0.0, y = 0.0, z = 0.0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  public normalize(): number {
    let length = this.getLength();
    let invLength = 1.0 / length;
    this.x *= invLength;
    this.y *= invLength;
    this.z *= invLength;
    return length;
  }
  public normalized(): Vec3 {
    let invLength = 1.0 / this.getLength();
    return new Vec3(this.x * invLength, this.y * invLength, this.z * invLength);
  }
  public getLength(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
  public dot(v: Vec3): number {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }
  public cross(v: Vec3): Vec3 {
    return new Vec3(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  }
  public add(v: Vec3): Vec3 {
    return new Vec3(this.x + v.x, this.y + v.y, this.z + v.z);
  }
  public sub(v: Vec3): Vec3 {
    return new Vec3(this.x - v.x, this.y - v.y, this.z - v.z);
  }
  public div(v: number): Vec3 {
    return new Vec3(this.x / v, this.y / v, this.z / v);
  }
  public divXYZ(x: number, y: number, z: number): Vec3 {
    return new Vec3(this.x / x, this.y / y, this.z / z);
  }
  public mul(v: number): Vec3 {
    return new Vec3(this.x * v, this.y * v, this.z * v);
  }
  public mulXYZ(x: number, y: number, z: number): Vec3 {
    return new Vec3(this.x * x, this.y * y, this.z * z);
  }
  public equals(v: Vec3): boolean {
    return this.x == v.x && this.y == v.y && this.z == v.z;
  }
}

export class Mat4 {
  // Values
  public m00: number = 1;
  public m01: number = 0;
  public m02: number = 0;
  public m03: number = 0;
  public m10: number = 0;
  public m11: number = 1;
  public m12: number = 0;
  public m13: number = 0;
  public m20: number = 0;
  public m21: number = 0;
  public m22: number = 1;
  public m23: number = 0;
  public m30: number = 0;
  public m31: number = 0;
  public m32: number = 0;
  public m33: number = 1;
  // Constructor
  constructor() {}
  public fromAxis(vx: Vec3, vy: Vec3, vz: Vec3): Mat4 {
    let res = new Mat4();

    res.m00 = vx.x;
    res.m01 = vy.x;
    res.m02 = vz.x;
    res.m10 = vx.y;
    res.m11 = vy.y;
    res.m12 = vz.y;
    res.m20 = vx.z;
    res.m21 = vy.z;
    res.m22 = vz.z;

    return res;
  }
  public mulMatrix(right: Mat4): Mat4 {
    let res = new Mat4();

    res.m00 =
      this.m00 * right.m00 +
      this.m01 * right.m10 +
      this.m02 * right.m20 +
      this.m03 * right.m30;
    res.m01 =
      this.m00 * right.m01 +
      this.m01 * right.m11 +
      this.m02 * right.m21 +
      this.m03 * right.m31;
    res.m02 =
      this.m00 * right.m02 +
      this.m01 * right.m12 +
      this.m02 * right.m22 +
      this.m03 * right.m32;
    res.m03 =
      this.m00 * right.m03 +
      this.m01 * right.m13 +
      this.m02 * right.m23 +
      this.m03 * right.m33;

    res.m10 =
      this.m10 * right.m00 +
      this.m11 * right.m10 +
      this.m12 * right.m20 +
      this.m13 * right.m30;
    res.m11 =
      this.m10 * right.m01 +
      this.m11 * right.m11 +
      this.m12 * right.m21 +
      this.m13 * right.m31;
    res.m12 =
      this.m10 * right.m02 +
      this.m11 * right.m12 +
      this.m12 * right.m22 +
      this.m13 * right.m32;
    res.m13 =
      this.m10 * right.m03 +
      this.m11 * right.m13 +
      this.m12 * right.m23 +
      this.m13 * right.m33;

    res.m20 =
      this.m20 * right.m00 +
      this.m21 * right.m10 +
      this.m22 * right.m20 +
      this.m23 * right.m30;
    res.m21 =
      this.m20 * right.m01 +
      this.m21 * right.m11 +
      this.m22 * right.m21 +
      this.m23 * right.m31;
    res.m22 =
      this.m20 * right.m02 +
      this.m21 * right.m12 +
      this.m22 * right.m22 +
      this.m23 * right.m32;
    res.m23 =
      this.m20 * right.m03 +
      this.m21 * right.m13 +
      this.m22 * right.m23 +
      this.m23 * right.m33;

    res.m30 =
      this.m30 * right.m00 +
      this.m31 * right.m10 +
      this.m32 * right.m20 +
      this.m33 * right.m30;
    res.m31 =
      this.m30 * right.m01 +
      this.m31 * right.m11 +
      this.m32 * right.m21 +
      this.m33 * right.m31;
    res.m32 =
      this.m30 * right.m02 +
      this.m31 * right.m12 +
      this.m32 * right.m22 +
      this.m33 * right.m32;
    res.m33 =
      this.m30 * right.m03 +
      this.m31 * right.m13 +
      this.m32 * right.m23 +
      this.m33 * right.m33;

    return res;
  }
  public mulVector(right: Vec3, w: number = 1): Vec3 {
    let res = new Vec3(0, 0, 0);

    res.x =
      this.m00 * right.x +
      this.m01 * right.y +
      this.m02 * right.z +
      this.m03 * w;
    res.y =
      this.m10 * right.x +
      this.m11 * right.y +
      this.m12 * right.z +
      this.m13 * w;
    res.z =
      this.m20 * right.x +
      this.m21 * right.y +
      this.m22 * right.z +
      this.m23 * w;

    return res;
  }
  public scale(x: number, y: number = x, z: number = x): Mat4 {
    let scale = new Mat4();
    scale.m00 = x;
    scale.m11 = y;
    scale.m22 = z;

    return this.mulMatrix(scale);
  }
  public rotate(x: number, y: number, z: number): Mat4 {
    const sinX = Math.sin(x);
    const cosX = Math.cos(x);
    const sinY = Math.sin(y);
    const cosY = Math.cos(y);
    const sinZ = Math.sin(z);
    const cosZ = Math.cos(z);

    let res = new Mat4();

    res.m00 = cosY * cosZ;
    res.m01 = -cosY * sinZ;
    res.m02 = sinY;
    res.m03 = 0;
    res.m10 = sinX * sinY * cosZ + cosX * sinZ;
    res.m11 = -sinX * sinY * sinZ + cosX * cosZ;
    res.m12 = -sinX * cosY;
    res.m13 = 0;
    res.m20 = -cosX * sinY * cosZ + sinX * sinZ;
    res.m21 = cosX * sinY * sinZ + sinX * cosZ;
    res.m22 = cosX * cosY;
    res.m23 = 0;
    res.m30 = 0;
    res.m31 = 0;
    res.m32 = 0;
    res.m33 = 1;

    return this.mulMatrix(res);
  }
  public translate(x: number, y: number, z: number): Mat4 {
    let res = new Mat4();

    res.m03 = x;
    res.m13 = y;
    res.m23 = z;

    return this.mulMatrix(res);
  }
}
