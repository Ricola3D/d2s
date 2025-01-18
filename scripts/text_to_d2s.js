/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');

function writeBits(bits, position, toWrite, numberOfBits) {
  for (let i = 0; i < numberOfBits; i++) {
    bits[position + i] = toWrite[i];
  }
}

function writeBytes(bits, position, bytes, numberOfBits = bytes.length * 8) {
  const toWrite = new Uint8Array(numberOfBits);
  bytes.reduce((acc, c) => {
    const b = c
      .toString(2)
      .padStart(8, '0')
      .split('')
      .reverse()
      .map((e) => parseInt(e, 2));
    b.forEach((bit) => (toWrite[acc++] = bit));
    return acc;
  }, 0);
  writeBits(bits, position, toWrite, numberOfBits);
}

function writeUInt32(bits, position, value, numberOfBits = 8 * 4) {
  const buffer = new Uint8Array(4);
  new DataView(buffer.buffer).setUint32(0, value, true);
  writeBytes(bits, position * 8, buffer, numberOfBits);
}

function peekBytes(bits, position, count) {
  const buffer = new Uint8Array(count);
  let byteIndex = 0;
  let bitIndex = 0;
  for (let i = 0; i < count * 8; ++i) {
    if (bits[position * 8 + i]) {
      buffer[byteIndex] |= (1 << bitIndex) & 0xff;
    }
    ++bitIndex;
    if (bitIndex >= 8) {
      ++byteIndex;
      bitIndex = 0;
    }
  }
  return buffer;
}

function fixHeader(bits) {
  let checksum = 0;
  const eof = bits.length / 8;
  writeUInt32(bits, 0x0008, eof);
  writeUInt32(bits, 0x000c, 0);
  for (let i = 0; i < eof; i++) {
    let byte = peekBytes(bits, i, 1)[0];
    if (checksum & 0x80000000) {
      byte += 1;
    }
    checksum = byte + checksum * 2;
    //hack make it a uint32
    checksum >>>= 0;
  }
  //checksum pos
  writeUInt32(bits, 0x000c, checksum);

  console.log(`size: ${eof} - checksum: ${checksum}`);
}

const input_file_path = path.join('C:/Users/Admin/Saved Games/Diablo II Resurrected/mods/ReMoDDeD', 'input.txt');
const output_file_path = path.join('C:/Users/Admin/Saved Games/Diablo II Resurrected/mods/ReMoDDeD', 'output.d2s');
if (fs.existsSync(input_file_path)) {
  const text = fs.readFileSync(input_file_path, 'utf-8');
  const bits = text
    .split('')
    .map((x) => parseInt(x))
    .reverse();
  fixHeader(bits);
  const le_binary = new Uint8Array((bits.length - 1) / 8 + 1);
  let byteIndex = 0;
  let bitIndex = 0;
  for (let i = 0; i < bits.length; ++i) {
    if (bits[i]) {
      le_binary[byteIndex] |= (1 << bitIndex) & 0xff;
    }
    ++bitIndex;
    if (bitIndex >= 8) {
      ++byteIndex;
      bitIndex = 0;
    }
  }

  fs.writeFileSync(output_file_path, le_binary);
  console.log(`File ${output_file_path} updated.`);
}
