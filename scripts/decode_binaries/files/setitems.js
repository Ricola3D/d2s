/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs');
const path = require('path');

const { readString } = require('../utils.js');

function decodeSetItemsFile(inputDir) {
  let items = [];
  const inputFile = path.join(inputDir, 'setitems.bin');

  if (fs.existsSync(inputFile)) {
    const fileBuffer = fs.readFileSync(inputFile);

    const lineCount = fileBuffer.readUInt32LE(0);
    const lineLength = (fileBuffer.byteLength - 4) / lineCount;

    if (lineLength != 444) {
      console.log('WARNING: expected line length is 444, but actual is ' + lineLength);
    }

    let lineStart = 4; // We skip 4 first bytes
    let lineIndex = 0;
    while (lineIndex < lineCount) {
      const lineBuffer = fileBuffer.subarray(lineStart, lineStart + lineLength);

      // const lineUint8Array = new Uint8Array(lineBuffer.byteLength);
      // lineBuffer.copy(lineUint8Array, 0, 0, lineBuffer.byteLength);

      let item = { '*ID': lineIndex, '*ItemName': '', '*eol': '' };

      //item.bytes = lineBuffer.reduce((acc, byte) => acc + " " + byte, "")

      // 0-1 SetItemId
      item.SetItemId = lineBuffer.readUint16LE(0);

      // 2-33 index
      item.index = readString(lineBuffer, 2, 32);

      // 34-35 Padding
      item.padding34 = lineBuffer.readUint16LE(34);

      // 36-39 Padding
      item.padding36 = lineBuffer.readUint32LE(36);

      // 40-43 item
      item.item = readString(lineBuffer, 40, 4);

      // 44-47
      item.set = lineBuffer.readUint32LE(44);

      // 48-49 Padding
      item.lvl = lineBuffer.readUint16LE(48);

      // 50-51 Padding
      item['level req'] = lineBuffer.readUint16LE(50);

      // 52-55
      item.rarity = lineBuffer.readUint32LE(52);

      // 56-59
      item['cost mult'] = lineBuffer.readUint32LE(56);

      // 60-63
      item['cost add'] = lineBuffer.readUint32LE(60);

      // 64 chrtransform
      item.chrtransform = lineBuffer.readUint8(64);

      // 65 chrtransform
      item.invtransform = lineBuffer.readUint8(65);

      // 66-97 flippyfile
      item.flippyfile = readString(lineBuffer, 66, 32);

      // 98-129 invfile
      item.invfile = readString(lineBuffer, 98, 32);

      // 130-131 dropsound
      item.dropsound = lineBuffer.readUint16LE(130);

      // 132-133 dropsound
      item.usesound = lineBuffer.readUint16LE(132);

      // 134 dropsfxframe
      item.dropsfxframe = lineBuffer.readUint8(134);

      // 135 add func
      item['add func'] = lineBuffer.readUint8(135);

      // 136-279 prop1..9
      {
        let offset = 136;
        for (let i = 1; i <= 9; i++) {
          item[`propertyDef${1}`] = lineBuffer.readUint32LE(offset);
          offset += 4;
          item[`par${1}`] = lineBuffer.readUint32LE(offset);
          offset += 4;
          item[`min${1}`] = lineBuffer.readUint32LE(offset);
          offset += 4;
          item[`max${1}`] = lineBuffer.readUint32LE(offset);
          offset += 4;
        }
      }

      // 280-439
      {
        let offset = 280;
        for (let i = 1; i <= 5; i++) {
          item[`aprop${1}a`] = lineBuffer.readUint32LE(offset);
          offset += 4;
          item[`apar${1}a`] = lineBuffer.readUint32LE(offset);
          offset += 4;
          item[`amin${1}a`] = lineBuffer.readUint32LE(offset);
          offset += 4;
          item[`amax${1}a`] = lineBuffer.readUint32LE(offset);
          offset += 4;
          item[`aprop${1}b`] = lineBuffer.readUint32LE(offset);
          offset += 4;
          item[`apar${1}b`] = lineBuffer.readUint32LE(offset);
          offset += 4;
          item[`amin${1}b`] = lineBuffer.readUint32LE(offset);
          offset += 4;
          item[`amax${1}b`] = lineBuffer.readUint32LE(offset);
          offset += 4;
        }
      }

      // diablocloneweight
      item.diablocloneweight = lineBuffer.readUint8(440);

      // 441-443 Padding

      lineStart += lineLength;
      lineIndex++;
      items.push(item);
    }
  }
  return items;
}

module.exports = {
  decodeSetItemsFile,
};
