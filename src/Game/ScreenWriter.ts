// This file contains all logic for drawing to the canvas.
class ScreenWriter {
  // Internals
  private offScreenCanvas: HTMLCanvasElement;
  private offScreenContext: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private frameBuffer: ImageData = new ImageData(1, 1);
  private width: number = 0;
  private height: number = 0;
  // Constructor
  constructor(width: number, height: number) {
    // Create The Canvas
    this.canvas = document.createElement("canvas");
    // Get The Context
    this.ctx = this.canvas.getContext("2d")!;
    // Set The Size
    this.setSize(width, height);
    // Add The Canvas to The Screen
    document.querySelector<HTMLDivElement>("#app")!.appendChild(this.canvas);
    // Create Off Screen Item
    this.offScreenCanvas = document.createElement("canvas");
    this.offScreenContext = this.offScreenCanvas.getContext("2d")!;
  }
  // Internal Methods
  private setSize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    // Set The Canvas Size
    this.canvas.width = width;
    this.canvas.height = height;
    // Create Our FrameBuffer
    this.frameBuffer = this.ctx.createImageData(width, height);
  }
  // Public Methods
  // TODO: Expose onResize
  public getWidth(): number {
    return this.width;
  }
  public getHeight(): number {
    return this.height;
  }
  public clearBackground(color: number): void {
    const { width, height } = this;
    // Set The Background Color
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        this.setPixel(x, y, color);
      }
    }
  }
  public setPixel(x: number, y: number, color: number): void {
    const { frameBuffer, width } = this;
    // Calculate the pixel index
    const index = 4 * (x + y * width);
    // Set Our Color
    frameBuffer.data[index + 0] = ((color >> 16) & 0xff) / 127.5 - 1.0;
    frameBuffer.data[index + 1] = ((color >> 8) & 0xff) / 127.5 - 1.0;
    frameBuffer.data[index + 2] = (color & 0xff) / 127.5 - 1.0;
    // We don't really have a need for alpha as of now so we just set it to 255
    frameBuffer.data[index + 3] = 255;
  }
  public getPixel(x: number, y: number): number {
    const { frameBuffer, width } = this;
    // Calculate the pixel index
    const index = 4 * (x + y * width);
    const r = frameBuffer.data[index + 0];
    const g = frameBuffer.data[index + 1];
    const b = frameBuffer.data[index + 2];
    return (r << 16) | (g << 8) | b;
  }
  public drawFrame(scale: number): void {
    // We do not always want to render at full size so we scale it
    if (scale > 1) {
      // Resize the imagedata using off-screen rendering
      this.offScreenContext.putImageData(this.frameBuffer, 0, 0);
      this.ctx.save();
      this.ctx.imageSmoothingEnabled = false;
      this.ctx.scale(scale, scale);
      this.ctx.drawImage(this.offScreenCanvas, 0, 0);
      this.ctx.restore();
    } else {
      this.ctx.putImageData(this.frameBuffer, 0, 0);
    }
  }
  // Helpers
  public drawLine(x0: number, y0: number, x1: number, y1: number): void {
    const { frameBuffer, width } = this;
    // Convert all coordinates to ints
    x0 |= 0;
    y0 |= 0;
    x1 |= 0;
    y1 |= 0;
    // Get The Binary Pixel Data
    const frameData = frameBuffer.data;
    // Perform the algorithm
    const steep = Math.abs(y1 - y0) > Math.abs(x1 - x0);
    if (steep) {
      // Flip Our X's and Y's
      let tmp;
      tmp = x0;
      x0 = y0;
      y0 = tmp;
      tmp = x1;
      x1 = y1;
      y1 = tmp;
    }
    if (x0 > x1) {
      // Flip Our X's and Y's
      let tmp;
      tmp = x0;
      x0 = x1;
      x1 = tmp;
      tmp = y0;
      y0 = y1;
      y1 = tmp;
    }
    let yStep = y0 < y1 ? 1 : -1;
    let deltaX = x1 - x0;
    let deltaY = Math.abs(y1 - y0);
    let error = 0;
    let index = 0;
    let y = y0;
    for (let x = x0; x <= x1; x++) {
      // index is vertical coordinate times width, plus horizontal coordinate,
      // times 4 because every pixel consists of 4 bytes
      if (steep) {
        index = (x * width + y) * 4; // y, x
      } else {
        index = (y * width + x) * 4; // x, y
      }
      // set RGBA values to 255 producing opaque white pixel
      frameData[index] = 255;
      frameData[index + 1] = 255;
      frameData[index + 2] = 255;
      frameData[index + 3] = 255;
      error += deltaY;
      if (error << 1 >= deltaX) {
        y += yStep;
        error -= deltaX;
      }
    }
  }
}

// Default Export
export default ScreenWriter;
