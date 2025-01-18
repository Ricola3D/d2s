/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs');
const path = require('path');

const { readString } = require('../utils.js');

function decodeRunesFile(inputDir) {
  let items = [];
  const inputFile = path.join(inputDir, 'runes.bin');

  if (fs.existsSync(inputFile)) {
    const fileBuffer = fs.readFileSync(inputFile);

    const lineCount = fileBuffer.readUInt32LE(0);
    const lineLength = (fileBuffer.byteLength - 4) / lineCount;

    if (lineLength != 228) {
      console.log('WARNING: expected line length is 46, but actual is ' + lineLength);
    }

    let lineStart = 4; // We skip 4 first bytes
    let lineIndex = 0;
    while (lineIndex < lineCount) {
      const lineBuffer = fileBuffer.subarray(lineStart, lineStart + lineLength);

      // const lineUint8Array = new Uint8Array(lineBuffer.byteLength);
      // lineBuffer.copy(lineUint8Array, 0, 0, lineBuffer.byteLength);

      let item = {};

      //item.bytes = lineBuffer.reduce((acc, byte) => acc + " " + byte, "")

      // 0-63 Name
      item.Name = readString(lineBuffer, 0, 64);

      // 64-65 firstLadderSeason
      item.firstLadderSeason = lineBuffer.readUint16LE(64);

      // 66-67 lastLadderSeason
      item.lastLadderSeason = lineBuffer.readUint16LE(66);

      // 68 complete
      item.complete = lineBuffer.readUint8(68);

      // 69 server
      item.server = lineBuffer.readUint8(69);

      // 70-73 Padding

      // 74 - 85 itype1..6 (Uint16 each)
      {
        let offset = 74;
        for (let i = 1; i <= 6; i++) {
          item[`itype${i}`] = lineBuffer.readUint16LE(offset);
          offset += 2;
        }
      }

      // 86-91 etype1..3 (Uint16 each)
      {
        let offset = 86;
        for (let i = 1; i <= 3; i++) {
          item[`etype${i}`] = lineBuffer.readUint16LE(offset);
          offset += 2;
        }
      }

      // 92-115 Rune1..6 (Uint32 each)
      {
        let offset = 92;
        for (let i = 1; i <= 6; i++) {
          item[`Rune${i}`] = lineBuffer.readUint32LE(offset);
          offset += 4;
        }
      }

      // 116-227
      {
        let offset = 116;
        for (let i = 1; i <= 7; i++) {
          item[`vT1Code${i}`] = lineBuffer.readUint32LE(offset);
          offset += 4;
          item[`vT1Param${i}`] = lineBuffer.readUint32LE(offset);
          offset += 4;
          item[`vT1Min${i}`] = lineBuffer.readUint32LE(offset);
          offset += 4;
          item[`vT1Max${i}`] = lineBuffer.readUint32LE(offset);
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
  decodeRunesFile,
};
