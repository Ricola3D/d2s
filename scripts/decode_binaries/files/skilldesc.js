/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs');
const path = require('path');

function decodeSkillDescFile(inputDir) {
  let items = [];
  const inputFile = path.join(inputDir, 'skilldesc.bin');

  if (fs.existsSync(inputFile)) {
    const fileBuffer = fs.readFileSync(inputFile);

    const lineCount = fileBuffer.readUInt32LE(0);
    const lineLength = (fileBuffer.byteLength - 4) / lineCount;

    if (lineLength != 300) {
      console.log('WARNING: expected line length is 444, but actual is ' + lineLength);
    }

    let lineStart = 4; // We skip 4 first bytes
    let lineIndex = 0;
    while (lineIndex < lineCount) {
      const lineBuffer = fileBuffer.subarray(lineStart, lineStart + lineLength);

      // const lineUint8Array = new Uint8Array(lineBuffer.byteLength);
      // lineBuffer.copy(lineUint8Array, 0, 0, lineBuffer.byteLength);

      let item = { '*eol': 0 };

      item.bytes = lineBuffer.reduce((acc, byte) => acc + ' ' + byte, '');

      // 0-1 SkillDesc
      item.SkillDesc = lineBuffer.readUint16LE(0);

      // 2 SkillPage
      item.SkillPage = lineBuffer.readUint8(2);

      // 3 SkillRow
      item.SkillRow = lineBuffer.readUint8(3);

      // 4 SkillColumn
      item.SkillColumn = lineBuffer.readUint8(4);

      // 5 ListRow
      item.ListRow = lineBuffer.readUint8(5);

      // 6 IconCel
      item.IconCel = lineBuffer.readUint8(6);

      // 7 HireableIconCel
      item.HireableIconCel = lineBuffer.readUint8(7);

      // 8-9 str name
      //0-9999 string.txt 10000-19999 patchstring.txt 20000- expansionstring.txt
      item['str name'] = lineBuffer.readUint16LE(8);

      // 10-11 str short
      item['str short'] = lineBuffer.readUint16LE(10);

      // 12-13 str long
      item['str long'] = lineBuffer.readUint16LE(12);

      // 14-15 str alt
      item['str alt'] = lineBuffer.readUint16LE(14);

      // 16-17 descdam
      item.descdam = lineBuffer.readUint16LE(16);

      // 18-19 descatt
      item.descatt = lineBuffer.readUint16LE(18);

      // 20-23 ddam calc1 (skilldesccode)
      item['ddam calc1'] = lineBuffer.readUint32LE(20);

      // 24-27 ddam calc2 (skilldesccode)
      item['ddam calc2'] = lineBuffer.readUint32LE(24);

      // 28 p1dmelem
      item.p1dmelem = lineBuffer.readUint8(28);

      // 29 p2dmelem
      item.p2dmelem = lineBuffer.readUint8(29);

      // 30 p3dmelem
      item.p3dmelem = lineBuffer.readUint8(30);

      // 31 Padding

      // 32-35 p1dmmin
      item.p1dmmin = lineBuffer.readUint32LE(32);

      // 36-39 p2dmmin
      item.p2dmmin = lineBuffer.readUint32LE(36);

      // 40-43 p3dmmin
      item.p3dmmin = lineBuffer.readUint32LE(40);

      // 44-47 p1dmmax
      item.p1dmmax = lineBuffer.readUint32LE(44);

      // 48-51 p2dmmax
      item.p2dmmax = lineBuffer.readUint32LE(48);

      // 52-55 p3dmmax
      item.p3dmmax = lineBuffer.readUint32LE(52);

      // 56-57 descmissile1
      item.descmissile1 = lineBuffer.readUint16LE(56);

      // 58-59 descmissile2
      item.descmissile2 = lineBuffer.readUint16LE(58);

      // 60-61 descmissile3
      item.descmissile3 = lineBuffer.readUint16LE(60);

      // 62-67 descline1..6
      {
        let offset = 62;
        for (let i = 1; i <= 6; i++) {
          item[`descline${i}`] = lineBuffer.readUint8(offset);
          offset++;
        }
      }

      // 68-72 dsc2line1..5
      {
        let offset = 68;
        for (let i = 1; i <= 5; i++) {
          item[`dsc2line${i}`] = lineBuffer.readUint8(offset);
          offset++;
        }
      }

      // 73-79 dsc3line1..7
      {
        let offset = 73;
        for (let i = 1; i <= 7; i++) {
          item[`dsc3line${i}`] = lineBuffer.readUint8(offset);
          offset++;
        }
      }

      // 80-91 desctexta1..6
      {
        let offset = 80;
        for (let i = 1; i <= 6; i++) {
          item[`desctexta${i}`] = lineBuffer.readUint16LE(offset);
          offset += 2;
        }
      }

      // 92-99 dsc2texta1..5
      {
        let offset = 92;
        for (let i = 1; i <= 5; i++) {
          item[`dsc2texta${i}`] = lineBuffer.readUint16LE(offset);
          offset += 2;
        }
      }

      // 102-115 dsc3texta1..7
      {
        let offset = 102;
        for (let i = 1; i <= 7; i++) {
          item[`dsc3texta${i}`] = lineBuffer.readUint16LE(offset);
          offset += 2;
        }
      }

      // 116-127 desctextb1..6
      {
        let offset = 116;
        for (let i = 1; i <= 6; i++) {
          item[`desctextb${i}`] = lineBuffer.readUint16LE(offset);
          offset += 2;
        }
      }

      // 128-137 dsc2textb1..5
      {
        let offset = 128;
        for (let i = 1; i <= 5; i++) {
          item[`dsc2textb${i}`] = lineBuffer.readUint16LE(offset);
          offset += 2;
        }
      }

      // 138-151 dsc3textb1..7
      {
        let offset = 138;
        for (let i = 1; i <= 7; i++) {
          item[`dsc3textb${i}`] = lineBuffer.readUint16LE(offset);
          offset += 2;
        }
      }

      // 152-175 desccalca1..6
      {
        let offset = 152;
        for (let i = 1; i <= 6; i++) {
          item[`desccalca${i}`] = lineBuffer.readUint32LE(offset);
          offset += 4;
        }
      }

      // 176-195 dsc2calca1..5
      {
        let offset = 176;
        for (let i = 1; i <= 5; i++) {
          item[`dsc2calca${i}`] = lineBuffer.readUint32LE(offset);
          offset += 4;
        }
      }

      // 196-223 dsc3calca1..7
      {
        let offset = 196;
        for (let i = 1; i <= 7; i++) {
          item[`dsc3calca1${i}`] = lineBuffer.readUint32LE(offset);
          offset += 4;
        }
      }

      // 224-247 desccalcb1..6
      {
        let offset = 224;
        for (let i = 1; i <= 6; i++) {
          item[`desccalcb${i}`] = lineBuffer.readUint32LE(offset);
          offset += 4;
        }
      }

      // 248-267 dsc2calcb1..5
      {
        let offset = 248;
        for (let i = 1; i <= 5; i++) {
          item[`dsc2calcb${i}`] = lineBuffer.readUint32LE(offset);
          offset += 4;
        }
      }

      // 268-295 dsc3calcb1..7
      {
        let offset = 268;
        for (let i = 1; i <= 7; i++) {
          item[`dsc3calcb${i}`] = lineBuffer.readUint32LE(offset);
          offset += 4;
        }
      }

      // 296-297 item proc text
      item['item proc text'] = lineBuffer.readUint16LE(296);

      // 298 item proc descline count
      item['item proc descline count'] = lineBuffer.readUint8(298);

      // 299 Padding

      lineStart += lineLength;
      lineIndex++;
      items.push(item);
    }
  }
  return items;
}

module.exports = {
  decodeSkillDescFile,
};
