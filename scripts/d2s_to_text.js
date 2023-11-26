/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */
/*
How to edit binary of a D2 item
1 - Create a char "input".
2 - Open the char, empty everything (weapon, shield, inventory, belt).
3 - Move the item to the char. Save and return to menus.
4 - run "npm run d2t"
5 - open "output.txt", copy it's content to a word doc.
6 - search and strike through "0100110101001010"/"MJ". It appears just before (reverse order) char items & body items.
7 - On the right of first "0100110101001010" occurence, strike through the few 000s followed by 111111111.
8 - Use the vault, or d2s-editor error to know the prop id to search.
9 - Use internet to convert decimal to binary, and search the id on 9 bits.
*/
const fs = require("fs");
const path = require("path");

const input_file_path = path.join("C:/Users/Admin/Saved Games/Diablo II Resurrected/mods/ReMoDDeD", "input.d2s");
const output_file_path = path.join("C:/Users/Admin/Saved Games/Diablo II Resurrected/mods/ReMoDDeD", "output.txt");
if (fs.existsSync(input_file_path)) {
  const fileBuffer = fs.readFileSync(input_file_path);

  // Reach checksum
  const fileUint8Array = new Uint8Array(fileBuffer.byteLength);
  fileBuffer.copy(fileUint8Array, 0, 0, fileBuffer.byteLength);
  const fileDataView = new DataView(fileUint8Array.buffer);
  const size = fileDataView.getUint32(0x0008, true);
  const checksum = fileDataView.getUint32(0x000c, true);
  console.log(`size: ${size} - checksum: ${checksum}`);

  // Transform to an array of bits (0, 1)
  const bits = new Uint8Array(fileBuffer.length * 8);
  fileBuffer.reduce((acc, c) => {
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