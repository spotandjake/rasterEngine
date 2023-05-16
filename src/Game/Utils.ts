class Utils {
  public static lerp(a: number, b: number, per: number): number {
    return a * (1.0 - per) + b * per;
  }
  // Color stuff
  public static lerpColor(pFrom: number, pTo: number, pRatio: number): number {
    const ar = (pFrom & 0xff0000) >> 16,
      ag = (pFrom & 0x00ff00) >> 8,
      ab = pFrom & 0x0000ff,
      br = (pTo & 0xff0000) >> 16,
      bg = (pTo & 0x00ff00) >> 8,
      bb = pTo & 0x0000ff,
      rr = ar + pRatio * (br - ar),
      rg = ag + pRatio * (bg - ag),
      rb = ab + pRatio * (bb - ab);
    return (rr << 16) + (rg << 8) + (rb | 0);
  }

  public static lerpColorComponent(
    a: number,
    b: number,
    w0: number,
    w1: number,
    z0: number,
    z1: number,
    z: number
  ): number {
    // TODO: Find a more efficent way todo this
    // Break Apart
    let rA = (a >> 16) & 0xff;
    let gA = (a >> 8) & 0xff;
    let bA = a & 0xff;
    let rB = (b >> 16) & 0xff;
    let gB = (b >> 8) & 0xff;
    let bB = b & 0xff;
    // lerp
    const perA = (w0 / z0) * z;
    rA *= perA;
    gA *= perA;
    bA *= perA;
    const perB = (w1 / z1) * z;
    rB *= perB;
    gB *= perB;
    bB *= perB;
    // Assemble
    const cr = rA + rB;
    const cg = gA + gB;
    const cb = bA + bB;
    // Return
    return (cr << 16) | (cg << 8) | cb;
  }
}
export default Utils;
