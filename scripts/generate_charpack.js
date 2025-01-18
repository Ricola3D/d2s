/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs');
const path = require('path');
// 'jsdom' so that utility methods like arrayBufferToBase64String don't need a version when window is undefined;

const utils = require('../lib/d2/utils'); // It's a ts, use the built js instead

// const dom = new JSDOM(minHtml);

// global.window = dom.window;
// global.document = dom.window.document;

const versions = [
  {
    path: 'C:/Users/Admin/Saved Games/Diablo II Resurrected/mods/ReMoDDeD',
    mod: 'remodded',
    version: 99,
  },
  {
    path: 'C:/Users/Admin/Saved Games/Diablo II Resurrected/mods/RMD-MP',
    mod: 'remodded',
    version: 98,
  },
];

const classes = ['Amazon', 'Sorceress', 'Necromancer', 'Paladin', 'Barbarian', 'Druid', 'Assassin'];

const output = [];
for (const v of versions) {
  for (const [cIdx, c] of classes.entries()) {
    const input_file_path = path.join(v.path, `${c}.d2s`);
    if (fs.existsSync(input_file_path)) {
      //file exists
      const fileBuffer = fs.readFileSync(input_file_path);
      // const fileUint8Array = new Uint8Array(fileBuffer.byteLength);
      // fileBuffer.copy(fileUint8Array, 0, 0, fileBuffer.byteLength);

      const b64string = utils.arrayBufferToBase64String(fileBuffer);
      output.push({
        mod: v.mod,
        version: v.version,
        class: cIdx,
        base64: b64string,
      });
    }
  }
}

const output_file_path = path.join('C:/Users/Admin/Saved Games/Diablo II Resurrected/mods', 'charpack.txt');
fs.writeFileSync(output_file_path, JSON.stringify(output, null, 4));
