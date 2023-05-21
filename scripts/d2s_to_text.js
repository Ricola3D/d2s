/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");

const input_file_path = path.join("C:/Users/Admin/Saved Games/Diablo II Resurrected/mods/ReMoDDeD", "input.d2s");
const output_file_path = path.join("C:/Users/Admin/Saved Games/Diablo II Resurrected/mods/ReMoDDeD", "output.txt");
if (fs.existsSync(input_file_path)) {
  const le_binary = fs.readFileSync(input_file_path);

  // Reach checksum
  const uint8Array = new Uint8Array(le_binary.byteLength);
  le_binary.copy(uint8Array, 0, 0, le_binary.byteLength);
  const dv = new DataView(uint8Array.buffer);
  const size = dv.getUint32(0x0008, true);
  const checksum = dv.getUint32(0x000c, true);
  console.log(`size: ${size} - checksum: ${checksum}`);

  // Transform to an array of bits (0, 1)
  const bits = new Uint8Array(le_binary.length * 8);
  le_binary.reduce((acc, c) => {
    const b = c // c is a char/uint8/octet (hexa)
      .toString(2) // to a string of 0s and 1s
      .padStart(8, "0") // completed by leading 0s to a length of 8
      .split("") // Split to an array or "0"s and "1"s
      .reverse() // reverse the octet (=to big endian hexa)
      .map((e) => parseInt(e, 2)); // Transform each element from a string to a number
    b.forEach((bit) => (bits[acc++] = bit)); // Push front the bits
    return acc;
  }, 0);

  const text = bits.map(v => v.toString()).reduce((acc, c) => c + acc, ""); // Push front the bits

  fs.writeFileSync(output_file_path, text);
  console.log(`File ${output_file_path} updated.`);
}