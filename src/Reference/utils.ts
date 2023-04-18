import { Vec2, Vec3 } from "./math";
import { Bitmap } from "./bitmap";
import { Constants } from "./constants";

export function convertImageDataToBitmap(
  imageData: ImageData,
  width: number,
  height: number
): Bitmap {
  const res = new Bitmap(width, height);

  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      const r = imageData.data[(x + y * width) * 4];
      const g = imageData.data[(x + y * width) * 4 + 1];
      const b = imageData.data[(x + y * width) * 4 + 2];

      res.pixels[x + y * width] = (r << 16) | (g << 8) | b;
    }
  }

  return res;
}

export function convertBitmapToImageData(bitmap: Bitmap, scale = 1): ImageData {
  const res = new ImageData(bitmap.width * scale, bitmap.height * scale);

  for (let y = 0; y < bitmap.height; ++y) {
    for (let x = 0; x < bitmap.width; ++x) {
      const bitmapPixel = bitmap.pixels[x + y * bitmap.width];

      const r = (bitmapPixel >> 16) & 0xff;
      const g = (bitmapPixel >> 8) & 0xff;
      const b = bitmapPixel & 0xff;

      if (scale == 1) {
        const ptr = (x * scale + y * scale * res.width) * 4;

        res.data[ptr] = r;
        res.data[ptr + 1] = g;
        res.data[ptr + 2] = b;
        res.data[ptr + 3] = Constants.GLOBAL_ALPHA;
        continue;
      }

      for (let ys = 0; ys < scale; ++ys) {
        for (let xs = 0; xs < scale; ++xs) {
          const ptr = (x * scale + xs + (y * scale + ys) * res.width) * 4;

          res.data[ptr] = r;
          res.data[ptr + 1] = g;
          res.data[ptr + 2] = b;
          res.data[ptr + 3] = Constants.GLOBAL_ALPHA;
        }
      }
    }
  }

  return res;
}

export function int(a: number): number {
  return Math.ceil(a);
}

export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

export function lerp(a: number, b: number, per: number): number {
  return a * (1.0 - per) + b * per;
}

export function lerpVector2(a: Vec3, b: Vec3, per: number): Vec3 {
  return a.mul(1 - per).add(b.mul(per));
}

export function lerp2AttributeVec3(
  a: Vec3,
  b: Vec3,
  w0: number,
  w1: number,
  z0: number,
  z1: number,
  z: number
): Vec3 {
  const wa = a.mul((w0 / z0) * z);
  const wb = b.mul((w1 / z1) * z);

  return new Vec3(wa.x + wb.x, wa.y + wb.y, wa.z + wb.z);
}

export function lerp3AttributeVec2(
  a: Vec2,
  b: Vec2,
  c: Vec2,
  w0: number,
  w1: number,
  w2: number,
  z0: number,
  z1: number,
  z2: number,
  z: number
): Vec2 {
  const wa = a.mul((w0 / z0) * z);
  const wb = b.mul((w1 / z1) * z);
  const wc = c.mul((w2 / z2) * z);

  return new Vec2(wa.x + wb.x + wc.x, wa.y + wb.y + wc.y);
}

export function lerp3AttributeVec3(
  a: Vec3,
  b: Vec3,
  c: Vec3,
  w0: number,
  w1: number,
  w2: number,
  z0: number,
  z1: number,
  z2: number,
  z: number
): Vec3 {
  const wa = a.mul((w0 / z0) * z);
  const wb = b.mul((w1 / z1) * z);
  const wc = c.mul((w2 / z2) * z);

  return new Vec3(wa.x + wb.x + wc.x, wa.y + wb.y + wc.y, wa.z + wb.z + wc.z);
}

export const lerpColor = (pFrom:number, pTo:number, pRatio:number): number => {
  const ar = (pFrom & 0xFF0000) >> 16,
        ag = (pFrom & 0x00FF00) >> 8,
        ab = (pFrom & 0x0000FF),

        br = (pTo & 0xFF0000) >> 16,
        bg = (pTo & 0x00FF00) >> 8,
        bb = (pTo & 0x0000FF),

        rr = ar + pRatio * (br - ar),
        rg = ag + pRatio * (bg - ag),
        rb = ab + pRatio * (bb - ab);
  return (rr << 16) + (rg << 8) + (rb | 0);
};

export function convertColorToVectorRange2(hex: number): Vec3 {
  const r = ((hex >> 16) & 0xff) / 127.5 - 1.0;
  const g = ((hex >> 8) & 0xff) / 127.5 - 1.0;
  const b = (hex & 0xff) / 127.5 - 1.0;

  return new Vec3(r, g, b);
}

export function convertVectorToColorHex(vec3: Vec3): number {
  return (vec3.x << 16) | (vec3.y << 8) | vec3.z;
}

export function mulColor(hex: number, per: number): number {
  const r = clamp(((hex >> 16) & 0xff) * per, 0, 255);
  const g = clamp(((hex >> 8) & 0xff) * per, 0, 255);
  const b = clamp((hex & 0xff) * per, 0, 255);

  return int(r << 16) | int(g << 8) | int(b);
}

export function sample(texture: Bitmap, u: number, v: number): number {
  let tx = Math.floor(texture.width * u);
  let ty = Math.floor(texture.height * (1.0 - v));

  if (tx < 0) tx = 0;
  if (tx >= texture.width) tx = texture.width - 1;
  if (ty < 0) ty = 0;
  if (ty >= texture.height) ty = texture.height - 1;

  return texture.pixels[tx + ty * texture.width];
}
