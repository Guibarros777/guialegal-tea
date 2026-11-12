import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createSolidPng(width, height, r, g, b, a = 255) {
  // Simple uncompressed/deflated RGBA PNG generator
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // bit depth 8
  ihdr.writeUInt8(6, 9); // color type 6: RGBA
  ihdr.writeUInt8(0, 10); // compression
  ihdr.writeUInt8(0, 11); // filter
  ihdr.writeUInt8(0, 12); // interlace

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type);
    const toCrc = Buffer.concat([typeBuf, data]);
    const crc = crc32(toCrc);
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeInt32BE(crc, 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  // Scanlines: 1 filter byte (0) + width * 4 bytes
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowSize);

  // Draw background and a branded inner motif (navy #0F233D with teal/cyan & amber accents)
  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.42;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Default Navy background: rgb(15, 35, 61)
      let pr = 15, pg = 35, pb = 61, pa = 255;

      // Outer brand ring
      if (dist < radius && dist > radius - width * 0.04) {
        // Teal/Cyan gradient
        pr = 14; pg = 165; pb = 233;
      } else if (dist <= radius - width * 0.04) {
        // Inner circle
        pr = 18; pg = 45; pb = 75;

        // Draw scale / infinity / motif approximation
        const inLeftLoop = Math.hypot(x - (cx - width * 0.18), y - (cy - height * 0.05)) < width * 0.14;
        const inRightLoop = Math.hypot(x - (cx + width * 0.18), y - (cy - height * 0.05)) < width * 0.14;
        const inCenterPiece = Math.hypot(x - cx, y - cy) < width * 0.10;
        const inHands = y > cy + height * 0.16 && Math.abs(x - cx) < width * 0.32;

        if (inHands) {
          pr = 255; pg = 255; pb = 255; // White cradling hands
        } else if (inCenterPiece) {
          pr = 20; pg = 184; pb = 166; // Mint/teal puzzle
        } else if (inLeftLoop) {
          pr = 2; pg = 132; pb = 199; // Ocean blue scale
        } else if (inRightLoop) {
          pr = 245; pg = 158; pb = 11; // Amber/warm loop
        }
      }

      rawData[pxOffset] = pr;
      rawData[pxOffset + 1] = pg;
      rawData[pxOffset + 2] = pb;
      rawData[pxOffset + 3] = pa;
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressed);
  const ihdrChunk = makeChunk('IHDR', ihdr);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Simple CRC32 implementation
function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c = c ^ buf[i];
    for (let k = 0; k < 8; k++) {
      c = (c >>> 1) ^ (0xEDB88320 & -(c & 1));
    }
  }
  return ~c;
}

const publicDir = path.resolve('public');
fs.writeFileSync(path.join(publicDir, 'icon-192.png'), createSolidPng(192, 192));
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), createSolidPng(512, 512));
fs.writeFileSync(path.join(publicDir, 'icon-maskable-512.png'), createSolidPng(512, 512));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createSolidPng(180, 180));
console.log('Icons generated successfully!');
