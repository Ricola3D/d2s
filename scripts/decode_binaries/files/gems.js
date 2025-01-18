/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs');
const path = require('path');

const { readString } = require('../utils.js');

function decodeGemsFile(inputDir) {
  let items = [];
  const inputFile = path.join(inputDir, 'gems.bin');

  if (fs.existsSync(inputFile)) {
    const fileBuffer = fs.readFileSync(inputFile);

    const lineCount = fileBuffer.readUInt32LE(0);
    const lineLength = (fileBuffer.byteLength - 4) / lineCount;

    if (lineLength != 192) {
      console.log('WARNING: expected line length is 192, but actual is ' + lineLength);
    }

    let lineStart = 4; // We skip 4 first bytes
    let lineIndex = 0;
    while (lineIndex < lineCount) {
      const lineBuffer = fileBuffer.subarray(lineStart, lineStart + lineLength);

      // const lineUint8Array = new Uint8Array(lineBuffer.byteLength);
      // lineBuffer.copy(lineUint8Array, 0, 0, lineBuffer.byteLength);

      let item = {};

      // 0-31 name
      item.name = readString(lineBuffer, 0, 32);

      // 32-39 letter
      item.letter = readString(lineBuffer, 0, 8);

      // 40-43 letter
      item.code = lineBuffer.readUint32LE(40);

      // 44-45 letter
      item.code = lineBuffer.readUint16LE(44);

      // 46 nummods
      item.nummods = lineBuffer.readUint8(46);

      // 47 transform
      item.transform = lineBuffer.readUint8(47);

      // 48-95 weaponMod1..3 (Uint32 + Uint32 + Int32 + Int32 each)
      {
        for (let i = 1; i <= 3; i++) {
          let offset = 48;
          item[`weaponMod${i}Code`] = lineBuffer.readUint32LE(offset);
          offset += 4;

          item[`weaponMod${i}Param`] = lineBuffer.readUint32LE(offset);
          offset += 4;

          item[`weaponMod${i}Min`] = lineBuffer.readInt32LE(offset);
          offset += 4;

          item[`weaponMod${i}Max`] = lineBuffer.readInt32LE(offset);
          offset += 4;
        }
      }

      // 96-143 helmMod1..3 (Uint32 + Uint32 + Int32 + Int32 each)
      {
        for (let i = 1; i <= 3; i++) {
          let offset = 96;
          item[`helmMod${i}Code`] = lineBuffer.readUint32LE(offset);
          offset += 4;

          item[`helmMod${i}Param`] = lineBuffer.readUint32LE(offset);
          offset += 4;

          item[`helmMod${i}Min`] = lineBuffer.readInt32LE(offset);
          offset += 4;

          item[`helmMod${i}Max`] = lineBuffer.readInt32LE(offset);
          offset += 4;
        }
      }

      // 144-191 shieldMod1..3 (Uint32 + Uint32 + Int32 + Int32 each)
      {
        for (let i = 1; i <= 3; i++) {
          let offset = 96;
          item[`shieldMod${i}Code`] = lineBuffer.readUint32LE(offset);
          offset += 4;

          item[`shieldMod${i}Param`] = lineBuffer.readUint32LE(offset);
          offset += 4;

          item[`shieldMod${i}Min`] = lineBuffer.readInt32LE(offset);
          offset += 4;

          item[`shieldMod${i}Max`] = lineBuffer.readInt32LE(offset);
          offset += 4;
        }
      }

      lineStart += lineLength;
      lineIndex++;
      items.push(item);
    }
  }
  return items;
}

module.exports = {
  decodeGemsFile,
};
