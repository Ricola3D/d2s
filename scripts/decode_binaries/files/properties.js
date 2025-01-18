/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs');
const path = require('path');

function decodePropertiesFile(inputDir) {
  let items = [];
  const inputFile = path.join(inputDir, 'properties.bin');

  if (fs.existsSync(inputFile)) {
    const fileBuffer = fs.readFileSync(inputFile);

    const lineCount = fileBuffer.readUInt32LE(0);
    const lineLength = (fileBuffer.byteLength - 4) / lineCount;

    if (lineLength != 46) {
      console.log('WARNING: expected line length is 46, but actual is ' + lineLength);
    }

    let lineStart = 4; // We skip 4 first bytes
    let lineIndex = 0;
    while (lineIndex < lineCount) {
      const lineBuffer = fileBuffer.subarray(lineStart, lineStart + lineLength);

      // const lineUint8Array = new Uint8Array(lineBuffer.byteLength);
      // lineBuffer.copy(lineUint8Array, 0, 0, lineBuffer.byteLength);

      let item = {
        '*Enabled': 1,
        '*Tooltip': '',
        '*Parameter': '',
        '*Min': '',
        '*Max': '',
        '*Notes': '',
        '*eol': '',
      };

      //item.bytes = lineBuffer.reduce((acc, byte) => acc + " " + byte, "")

      // 0-1 code
      item.code = lineBuffer.readUint16LE(0);

      // 2-8 set1-7 (Uint8 each)
      {
        let offset = 2;
        for (let i = 1; i <= 7; i++) {
          item[`set${i}`] = lineBuffer.readUint8(offset);
          offset += 1;
        }
      }

      // 9 Padding

      // 10-23 val1-7 (Uint16 each)
      {
        let offset = 10;
        for (let i = 1; i <= 7; i++) {
          item[`val${i}`] = lineBuffer.readUint16LE(offset);
          offset += 2;
        }
      }

      // 24-30 func1-7 (Uint8 each)
      {
        let offset = 24;
        for (let i = 1; i <= 7; i++) {
          item[`func${i}`] = lineBuffer.readUint8(offset);
          offset += 1;
        }
      }

      // 31 Padding

      // 32-45 stat1-7 (Uint16 each)
      {
        let offset = 32;
        for (let i = 1; i <= 7; i++) {
          item[`stat${i}`] = lineBuffer.readUint16LE(offset);
          offset += 2;
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
  decodePropertiesFile,
};
