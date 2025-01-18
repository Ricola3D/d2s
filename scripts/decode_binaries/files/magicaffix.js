/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs');
const path = require('path');

const { readString } = require('../utils.js');

function decodeMagicAffixFile(inputDir, prefixOrSuffix) {
  let items = [];
  const inputFile = path.join(inputDir, `magic${prefixOrSuffix}.bin`);

  if (fs.existsSync(inputFile)) {
    const fileBuffer = fs.readFileSync(inputFile);

    const lineCount = fileBuffer.readUInt32LE(0);
    const lineLength = (fileBuffer.byteLength - 4) / lineCount;

    if (lineLength != 140) {
      console.log('WARNING: expected line length is 140, but actual is ' + lineLength);
    }

    let lineStart = 4; // We skip 4 first bytes
    let lineIndex = 0;
    while (lineIndex < lineCount) {
      const lineBuffer = fileBuffer.subarray(lineStart, lineStart + lineLength);

      // const lineUint8Array = new Uint8Array(lineBuffer.byteLength);
      // lineBuffer.copy(lineUint8Array, 0, 0, lineBuffer.byteLength);

      let item = {};

      // item.bytes = lineUint8Array.reduce((acc, byte) => acc + " " + byte, "")

      // 0-31 Name (CHAR[32])
      item.Name = readString(lineBuffer, 0, 32);

      // 32-33 padding (Uint16)

      // 34-35 version (Uint16)
      item.version = lineBuffer.readUint16LE(34);

      // 36-83 mod1..3 (Uint32 + Int32 + Int32 + Int32 each)
      {
        let offset = 36;
        for (let i = 1; i <= 3; i++) {
          item[`mod${i}code`] = lineBuffer.readUint32LE(offset);
          offset += 4;
          item[`mod${i}param`] = lineBuffer.readInt32LE(offset);
          offset += 4;
          item[`mod${i}min`] = lineBuffer.readInt32LE(offset);
          offset += 4;
          item[`mod${i}max`] = lineBuffer.readInt32LE(offset);
          offset += 4;
        }
      }

      // 84-85 spawnable (Uin16)
      item.spawnable = lineBuffer.readUint16LE(84);

      // 86-87 transformcolor
      item.transformcolor = lineBuffer.readUint16LE(86);

      // 88-89 level
      item.level = lineBuffer.readUint16LE(88);

      // 90-91 paddin90
      //item.paddin90 = lineBuffer.readUint16LE(88)

      // 92-95 group
      item.group = lineBuffer.readUint32LE(92);

      // 96-99 maxlevel
      item.maxlevel = lineBuffer.readUint32LE(96);

      // 100 rare (Uint8)
      item.rare = lineBuffer.readUint8(100);

      // 101 levelreq
      item.levelreq = lineBuffer.readUint8(101);

      // 102 classspecific
      item.classspecific = lineBuffer.readUint8(102);

      // 103 class
      item.class = lineBuffer.readUint8(103);

      // 104 Class Level Req
      item.classlevelreq = lineBuffer.readUint16LE(104);

      // 106-119 itype1..7
      {
        let offset = 106;
        for (let i = 1; i <= 7; i++) {
          item[`itype${i}`] = lineBuffer.readUint16LE(offset);
          offset += 2;
        }
      }

      // 120-129 etype1..5
      {
        let offset = 120;
        for (let i = 1; i <= 5; i++) {
          item[`etype${i}`] = lineBuffer.readUint16LE(offset);
          offset += 2;
        }
      }

      // 130-131 frequency
      item.frequency = lineBuffer.readUint16LE(130);

      // 132-135 multiply
      item.multiply = lineBuffer.readUint32LE(132);

      // 136-139 add
      item.add = lineBuffer.readUint32LE(136);

      lineStart += lineLength;
      lineIndex++;
      items.push(item);
    }
  }
  return items;
}

module.exports = {
  decodeMagicAffixFile,
};
