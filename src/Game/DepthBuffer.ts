// Contains Our Depth Buffer
class DepthBuffer {
  // Internals
  // use Uint16 because we only need a little precision and we save 2 bytes per pixel this way
  private depthBuffer: Uint16Array;
  private width: number;
  // Constructor
  constructor(width: number, height: number) {
    this.depthBuffer = new Uint16Array(width * height);
    this.width = width;
    this.clear();
  }
  // Public Methods
  public clear() {
    this.depthBuffer.fill(65535);
  }
  public getDepth(x: number, y: number): number {
    return this.depthBuffer[y * this.width + x] / 65535.0;
  }
  public setDepth(x: number, y: number, d: number): void {
    this.depthBuffer[y * this.width + x] = (d * 65535) | 0;
  }
  public testDepth(x: number, y: number, d: number) {
    const value = (d * 65535) | 0;
    if (value < 0 || value > 65535) return false;
    const index = y * this.width + x;
    if (value < this.depthBuffer[index]) {
      this.depthBuffer[index] = value;
      return true;
    }
    return false;
  }
}
// export
export default DepthBuffer;