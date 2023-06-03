/* eslint-disable prettier/prettier */

const HUFFMAN = [
  [
    [
      [
        ["w", "u"],
        [["8", ["y", ["5", ["j", []]]]], "h"],
      ],
      ["s", [["2", "n"], "x"]],
    ],
    [
      [["c", ["k", "f"]], "b"],
      [
        ["t", "m"],
        ["9", "7"],
      ],
    ],
  ],
  [
    " ",
    [
      [
        [["e", "d"], "p"],
        [
          "g",
          [
            [["z", "q"], "3"],
            ["v", "6"],
          ],
        ],
      ],
      [
        ["r", "l"],
        [
          "a",
          [
            ["1", ["4", "0"]],
            ["i", "o"],
          ],
        ],
      ],
    ],
  ],
];

const HUFFMAN_W = {}; // Keys are each character, values are the binary coding
function dotree(node, prefix) {
  if (Array.isArray(node)) {
    dotree(node[0], "0" + prefix); // Little-endian: prefix after
    dotree(node[1], "1" + prefix); // Little-endian: prefix after
  } else if (node) {
    HUFFMAN_W[node] = prefix;
  }
}
dotree(HUFFMAN, "");

const HUFFMAN_LOOKUP = {}; // Keys are each character, values are the encoded binary value & length
Object.keys(HUFFMAN_W).forEach(function (key, index) {
  HUFFMAN_LOOKUP[key] = {
    v: parseInt(HUFFMAN_W[key], 2),
    l: HUFFMAN_W[key].length,
  };
});

console.log("HUFFMAN_W:");
console.log(HUFFMAN_W);
console.log("HUFFMAN_LOOKUP:");
console.log(HUFFMAN_LOOKUP);