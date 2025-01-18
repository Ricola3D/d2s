/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs');
const path = require('path');

function decodeItemStatCostFile(inputDir) {
  let items = [];
  const inputFile = path.join(inputDir, 'itemstatcost.bin');

  if (fs.existsSync(inputFile)) {
    const fileBuffer = fs.readFileSync(inputFile);

    const lineCount = fileBuffer.readUInt32LE(0);
    const lineLength = (fileBuffer.byteLength - 4) / lineCount;

    if (lineLength != 324) {
      console.log('WARNING: expected line length is 324, but actual is ' + lineLength);
    }

    let lineStart = 4; // We skip 4 first bytes
    let lineIndex = 0;
    while (lineIndex < lineCount) {
      const lineBuffer = fileBuffer.subarray(lineStart, lineStart + lineLength);

      // const lineUint8Array = new Uint8Array(lineBuffer.byteLength);
      // lineBuffer.copy(lineUint8Array, 0, 0, lineBuffer.byteLength);

      let item = { advdisplay: '', '*eol': 0 };

      //item.bytes = lineBuffer.reduce((acc, byte) => acc + " " + byte, "")

      // 0-3 *ID
      item['*ID'] = lineBuffer.readUint32LE(0);

      // 4 - 5 Combined bits
      let bits = lineBuffer.readUint16LE(4);
      /* b0 - padding */
      /* b1 - padding */
      /* b2 - padding */
      /* b3 - direct */ item.direct = !!(bits & (1 << 4));
      /* b4 - itemspecific */ item.itemspecific = !!(bits & (1 << 3));
      /* b5 - damagerelated */ item.damagerelated = !!(bits & (1 << 2));
      /* b6 - Signed */ item.Signed = !!(bits & (1 << 1));
      /* b7 - Send Other */ item['Send Other'] = !!(bits & 1);

      /* b8 - padding */
      /* b9 - UpdateAnimRate */ item.UpdateAnimRate = !!(bits & (1 << 8));
      /* b10 - fMin */ item.fMin = !!(bits & (1 << 9));
      /* b11 - fCallback */ item.fCallback = !!(bits & (1 << 10));
      /* b12 - Saved */ item.Saved = !!(bits & (1 << 11));
      /* b13 - CSvSigned */ item.CSvSigned = !!(bits & (1 << 12));
      /* b14 - padding */
      /* b15 - padding */

      // 6-7 Padding

      // 8 Send Bits
      item['Send Bits'] = lineBuffer.readUint8(8);

      // 9 Send Param Bits
      item['Send Param Bits'] = lineBuffer.readUint8(9);

      // 10 CSvBits
      item.CSvBits = lineBuffer.readUint8(10);

      // 11 CSvParam
      item.CSvParam = lineBuffer.readUint8(11);

      // 12-15 Multiply
      item.Multiply = lineBuffer.readInt32LE(12);

      // 16-19 Add
      item.Add = lineBuffer.readUint32LE(16);

      // 20 ValShift
      item.ValShift = lineBuffer.readUint8(20);

      // 21 Save Bits
      item['Save Bits'] = lineBuffer.readUint8(21);

      // 22 1.09-Save Bits
      item['1.09-Save Bits'] = lineBuffer.readUint8(22);

      // 23 Unknown
      item.unknown23 = lineBuffer.readUint8(23);

      // 24-27 Save Add
      item['Save Add'] = lineBuffer.readInt32LE(24);

      // 28-31 1.09-Save Add
      item['1.09-Save Add'] = lineBuffer.readInt32LE(28);

      // 32-35 Save Param Bits
      item['Save Param Bits'] = lineBuffer.readUint32LE(32);

      // 36-39 Padding

      // 40-43
      item.MinAccr = lineBuffer.readUint32LE(40);

      // 44 Encode
      item.Encode = lineBuffer.readUint8(44);

      // 45 Unknown
      item.unknown45 = lineBuffer.readUint8(45);

      // 46-47 maxstat
      item.maxstat = lineBuffer.readUint16LE(46);

      // 48-49 descpriority
      item.descpriority = lineBuffer.readUint16LE(48);

      // 50 descfunc
      item.descfunc = lineBuffer.readUint8(50);

      // 51 descfunc
      item.descval = lineBuffer.readUint8(51);

      // 52-53 descstrpos
      item.descstrpos = lineBuffer.readUint16LE(52);

      // 54-55 descstrneg
      item.descstrneg = lineBuffer.readUint16LE(54);

      // 56-57 descstr2
      item.descstr2 = lineBuffer.readUint16LE(56);

      // 58-59 dgrp
      item.dgrp = lineBuffer.readUint16LE(58);

      // 60 dgrpfunc
      item.dgrpfunc = lineBuffer.readUint8(60);

      // 61 dgrpval
      item.dgrpval = lineBuffer.readUint8(60);

      // 62-63 dgrpstrpos
      item.dgrpstrpos = lineBuffer.readUint16LE(62);

      // 64-65 dgrpstrneg
      item.dgrpstrneg = lineBuffer.readUint16LE(64);

      // 66-67 dgrpstr2
      item.dgrpstr2 = lineBuffer.readUint16LE(66);

      // 68-69 itemevent1
      item.itemevent1 = lineBuffer.readUint16LE(68);

      // 70-71 itemevent2
      item.itemevent2 = lineBuffer.readUint16LE(70);

      // 72-73 itemeventfunc1
      item.itemeventfunc1 = lineBuffer.readUint16LE(72);

      // 74-75 itemeventfunc2
      item.itemeventfunc2 = lineBuffer.readUint16LE(74);

      // 76-79 keepzero
      item.keepzero = lineBuffer.readUint32LE(76);

      // 80 op
      item.op = lineBuffer.readUint8(80);

      // 81 op param
      item['op param'] = lineBuffer.readUint8(81);

      // 82-83 op param
      item['op base'] = lineBuffer.readUint16LE(82);

      // 84-85 op param
      item['op stat1'] = lineBuffer.readUint16LE(84);

      // 86-87 op param
      item['op stat2'] = lineBuffer.readUint16LE(86);

      // 88-89 op param
      item['op stat3'] = lineBuffer.readUint16LE(88);

      // 90-314 Padding

      // 316-319 stuff
      item.stuff = lineBuffer.readUint32LE(316);

      // 320-323 Padding

      lineStart += lineLength;
      lineIndex++;
      items.push(item);
    }
  }
  return items;
}

module.exports = {
  decodeItemStatCostFile,
};
