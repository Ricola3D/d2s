/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs');
const path = require('path');

const { readString } = require('../utils.js');

function decodeRareAffixFile(inputDir, prefixOrSuffix) {
  let items = [];
  const inputFile = path.join(inputDir, `rare${prefixOrSuffix}.bin`);

  if (fs.existsSync(inputFile)) {
    const fileBuffer = fs.readFileSync(inputFile);

    const lineCount = fileBuffer.readUInt32LE(0);
    const lineLength = (fileBuffer.byteLength - 4) / lineCount;

    if (lineLength != 72) {
      console.log('WARNING: expected line length is 72, but actual is ' + lineLength);
    }

    let lineStart = 4; // We skip 4 first bytes
    let lineIndex = 0;
    while (lineIndex < lineCount) {
      const lineBuffer = fileBuffer.subarray(lineStart, lineStart + lineLength);

      // const lineUint8Array = new Uint8Array(lineBuffer.byteLength);
      // lineBuffer.copy(lineUint8Array, 0, 0, lineBuffer.byteLength);

      let item = {};

      //item.bytes = lineBuffer.reduce((acc, byte) => acc + " " + byte, "")

      // 0-13 Padding

      // 14-15 version
      item.version = lineBuffer.readUint16LE(14);

      // 16-29 itype1..7 (Uint16 each)
      {
        let offset = 16;
        for (let i = 1; i <= 7; i++) {
          item[`itype${i}`] = lineBuffer.readUint16LE(offset);
          offset += 2;
        }
      }

      // 30-37 etype (Uint16 each)
      {
        let offset = 30;
        for (let i = 1; i <= 4; i++) {
          item[`etype${i}`] = lineBuffer.readUint16LE(offset);
          offset += 2;
        }
      }

      // 38-69 name
      item.name = readString(lineBuffer, 38, 32);

      // 70-71 Padding

      lineStart += lineLength;
      lineIndex++;
      items.push(item);
    }
  }
  return items;
}

module.exports = {
  decodeRareAffixFile,
};
