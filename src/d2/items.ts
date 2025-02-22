import * as types from './types';
import { BitReader } from '../binary/bitreader';
import { BitWriter } from '../binary/bitwriter';
import { getConstantData } from './constants';
import { ETypeId, EQuality } from './types';
import { swapObjectKeyValue, getItemTypeDef } from './utils';

// Right now I'm missing characters (case sensitive) E, F, I, J, L, M, Q, U, X.
// prettier-ignore
//huffman tree
const HUFFMAN = [
  /*0*/ [
    /*00*/ [
      /*000*/ [
        /*0000*/ [
          /*00000*/ "w",
          /*10000*/ "u"
        ],
        /*1000*/ [
          /*01000*/ [
            /*001000*/ "8",
            /*101000*/ [
              /*0101000*/ "y",
              /*1101000*/ [
                /*01101000*/ "5",
                /*11101000*/ [
                  /*011101000*/ "j",
                  /*111101000*/ [
                    /*ReMoDDeD adds - caps - begin*/
                    /*0 111101000*/ [
                      /*00 111101000*/ [
                        /*000 111101000*/ [
                          /*0000 111101000*/ [
                            /*00000 111101000*/ [
                              /*000000 111101000*/ [
                                /*0000000 111101000*/ [
                                ],
                                /*1000000 111101000*/ []
                              ],
                              /*100000 111101000*/ [
                                /*0100000 111101000*/ "N",
                                /*1100000 111101000*/ []
                              ]
                            ],
                            /*10000 111101000*/ [
                              /*010000 111101000*/ [
                                /*0010000 111101000*/ [],
                                /*1010000 111101000*/ []
                              ],
                              /*110000 111101000*/ [
                                /*0110000 111101000*/ [],
                                /*1110000 111101000*/ []
                              ]
                            ]
                          ],
                          /*1000 111101000*/ [
                            /*01000 111101000*/ [
                              /*001000 111101000*/ [
                                /*0001000 111101000*/ [],
                                /*1001000 111101000*/ []
                              ],
                              /*101000 111101000*/ [
                                /*0101000 111101000*/ [],
                                /*1101000 111101000*/ []
                              ]
                            ],
                            /*11000 111101000*/ [
                              /*011000 111101000*/ [
                                /*0011000 111101000*/ [],
                                /*1011000 111101000*/ []
                              ],
                              /*111000 111101000*/ [
                                /*0111000 111101000*/ [],
                                /*1111000 111101000*/ []
                              ]
                            ]
                          ]
                        ],
                        /*100 111101000*/ [
                          /*0100 111101000*/ [
                            /*00100 111101000*/ [
                              /*000100 111101000*/ [
                                /*0000100 111101000*/ [],
                                /*1000100 111101000*/ []
                              ],
                              /*100100 111101000*/ [
                                /*0100100 111101000*/ [],
                                /*1100100 111101000*/ []
                              ]
                            ],
                            /*10100 111101000*/ [
                              /*010100 111101000*/ [
                                /*0010100 111101000*/ [],
                                /*1010100 111101000*/ []
                              ],
                              /*110100 111101000*/ [
                                /*0110100 111101000*/ [],
                                /*1110100 111101000*/ []
                              ]
                            ]
                          ],
                          /*1100 111101000*/ [
                            /*01100 111101000*/ [
                              /*011000 111101000*/ [
                                /*0011000 111101000*/ [],
                                /*1011000 111101000*/ []
                              ],
                              /*111000 111101000*/ [
                                /*0111000 111101000*/ [],
                                /*1111000 111101000*/ []
                              ]
                            ],
                            /*11100 111101000*/ [
                              /*011100 111101000*/ [
                                /*0011100 111101000*/ [],
                                /*1011100 111101000*/ []
                              ],
                              /*111100 111101000*/ [
                                /*0111100 111101000*/ [],
                                /*1111100 111101000*/ []
                              ]
                            ]
                          ]
                        ]
                      ],
                      /*10 111101000*/ [
                        /*010 111101000*/ [
                          /*0010 111101000*/ [
                            /*00010 111101000*/ [
                              /*000010 111101000*/ [
                                /*0000010 111101000*/ [],
                                /*1000010 111101000*/ []
                              ],
                              /*100010 111101000*/ [
                                /*0100010 111101000*/ [],
                                /*1100010 111101000*/ []
                              ]
                            ],
                            /*10010 111101000*/ [
                              /*010010 111101000*/ [
                                /*0010010 111101000*/ [],
                                /*1010010 111101000*/ []
                              ],
                              /*110010 111101000*/ [
                                /*0110010 111101000*/ [],
                                /*1110010 111101000*/ []
                              ]
                            ]
                          ],
                          /*1010 111101000*/ [
                            /*01010 111101000*/ [
                              /*001010 111101000*/ [
                                /*0001010 111101000*/ [],
                                /*1001010 111101000*/ []
                              ],
                              /*101010 111101000*/ [
                                /*0101010 111101000*/ [],
                                /*1101010 111101000*/ []
                              ]
                            ],
                            /*11010 111101000*/ [
                              /*011010 111101000*/ [
                                /*0011010 111101000*/ [],
                                /*1011010 111101000*/ []
                              ],
                              /*111010 111101000*/ [
                                /*0111010 111101000*/ [
                                  /*00111010 111101000*/ "A",
                                  /*10111010 111101000*/ []
                                ],
                                /*1111010 111101000*/ []
                              ]
                            ]
                          ]
                        ],
                        /*110 111101000*/ [
                          /*0110 111101000*/ [
                            /*00110 111101000*/ [
                              /*000110 111101000*/ [
                                /*0000110 111101000*/ [],
                                /*1000110 111101000*/ []
                              ],
                              /*100110 111101000*/ [
                                /*0100110 111101000*/ [],
                                /*1100110 111101000*/ []
                              ]
                            ],
                            /*10110 111101000*/ [
                              /*010110 111101000*/ [
                                /*0010110 111101000*/ [],
                                /*1010110 111101000*/ [
                                  /*01010110 111101000*/ "S",
                                  /*11010110 111101000*/  []
                                ]
                              ],
                              /*110110 111101000*/ [
                                /*0110110 111101000*/ [],
                                /*1110110 111101000*/ []
                              ]
                            ]
                          ],
                          /*1110 111101000*/ [
                            /*01110 111101000*/ [
                              /*001110 111101000*/ [
                                /*0001110 111101000*/ [],
                                /*1001110 111101000*/ []
                              ],
                              /*101110 111101000*/ [
                                /*0101110 111101000*/ [],
                                /*1101110 111101000*/ []
                              ]
                            ],
                            /*11110 111101000*/ [
                              /*011110 111101000*/ [
                                /*0011110 111101000*/ [
                                  /*00011110 111101000*/ "E",
                                  /*10011110 111101000*/ []
                                ],
                                /*1011110 111101000*/ []
                              ],
                              /*111110 111101000*/ [
                                /*0111110 111101000*/ [],
                                /*1111110 111101000*/ []
                              ]
                            ]
                          ]
                        ]
                      ]
                    ],
                    /*1 111101000*/ [
                      /*01 111101000*/ [
                        /*001 111101000*/ [
                          /*0001 111101000*/ [
                            /*00001 111101000*/ [
                              /*000001 111101000*/ [
                                /*0000001 111101000*/ [],
                                /*1000001 111101000*/ []
                              ],
                              /*100001 111101000*/ [
                                /*0100001 111101000*/ [
                                  /*00100001 111101000*/ "Z",
                                  /*10100001 111101000*/ []
                                ],
                                /*1100001 111101000*/ []
                              ]
                            ],
                            /*10001 111101000*/ [
                              /*010001 111101000*/ [
                                /*0010001 111101000*/ [],
                                /*1010001 111101000*/ [
                                  /*01010001 111101000*/ "T",
                                  /*11010001 111101000*/ []
                                ]
                              ],
                              /*110001 111101000*/ [
                                /*0110001 111101000*/ [],
                                /*1110001 111101000*/ []
                              ]
                            ]
                          ],
                          /*1001 111101000*/ [
                            /*01001 111101000*/ [
                              /*001001 111101000*/ [
                                /*0001001 111101000*/ [
                                  /*00001001 111101000*/ [],
                                  /*10001001 111101000*/ "V"
                                ],
                                /*1001001 111101000*/ [
                                  /*01001001 111101000*/ "L",
                                  /*11001001 111101000*/ []
                                ]
                              ],
                              /*101001 111101000*/ [
                                /*0101001 111101000*/ [],
                                /*1101001 111101000*/ []
                              ]
                            ],
                            /*11001 111101000*/ [
                              /*011001 111101000*/ [
                                /*0011001 111101000*/ [],
                                /*1011001 111101000*/ []
                              ],
                              /*111001 111101000*/ [
                                /*0111001 111101000*/ [],
                                /*1111001 111101000*/ [
                                  undefined,
                                  "D"
                                ]
                              ]
                            ]
                          ]
                        ],
                        /*101 111101000*/ [
                          /*0101 111101000*/ [
                            /*00101 111101000*/ [
                              /*000101 111101000*/ [
                                /*0000101 111101000*/ [],
                                /*1000101 111101000*/ []
                              ],
                              /*100101 111101000*/ [
                                /*0100101 111101000*/ [
                                  /*00100101 111101000*/ "K",
                                  /*10100101 111101000*/ [] 
                                ],
                                /*1100101 111101000*/ [
                                  /*01100101 111101000*/ [],
                                  /*11100101 111101000*/  "P"
                                ]
                              ]
                            ],
                            /*10101 111101000*/ [
                              /*010101 111101000*/ [
                                /*0010101 111101000*/ [],
                                /*1010101 111101000*/ [
                                  /*01010101 111101000*/ [],
                                  /*11010101 111101000*/ "G"
                                ]
                              ],
                              /*110101 111101000*/ [
                                /*0110101 111101000*/ [],
                                /*1110101 111101000*/ []
                              ]
                            ]
                          ],
                          /*1101 111101000*/ [
                            /*01101 111101000*/ [
                              /*001101 111101000*/ [
                                /*0001101 111101000*/ [],
                                /*1001101 111101000*/ []
                              ],
                              /*101101 111101000*/ [
                                /*0101101 111101000*/ [],
                                /*1101101 111101000*/ []
                              ]
                            ],
                            /*11101 111101000*/ [
                              /*011101 111101000*/ [
                                /*0011101 111101000*/ [
                                  /*0011101 111101000*/ [],
                                  /*1011101 111101000*/ "H"
                                ],
                                /*1011101 111101000*/ []
                              ],
                              /*111101 111101000*/ [
                                /*0111101 111101000*/ [],
                                /*1111101 111101000*/ []
                              ]
                            ]
                          ]
                        ]
                      ],
                      /*11 111101000*/ [
                        /*011 111101000*/ [
                          /*0011 111101000*/ [
                            /*00011 111101000*/ [
                              /*000011 111101000*/ [
                                /*0000011 111101000*/ [],
                                /*1000011 111101000*/ []
                              ],
                              /*100011 111101000*/ [
                                /*0100011 111101000*/ [],
                                /*1100011 111101000*/ []
                              ]
                            ],
                            /*10011 111101000*/ [
                              /*010011 111101000*/ [
                                /*0010011 111101000*/ [],
                                /*1010011 111101000*/ []
                              ],
                              /*110011 111101000*/ [
                                /*0110011 111101000*/ [],
                                /*1110011 111101000*/ [
                                  /*01110011 111101000*/ "B",
                                  /*11110011 111101000*/ []
                                ]
                              ]
                            ]
                          ],
                          /*1011 111101000*/ [
                            /*01011 111101000*/ [
                              /*001011 111101000*/ [
                                /*0001011 111101000*/ [],
                                /*1001011 111101000*/ []
                              ],
                              /*101011 111101000*/ [
                                /*0101011 111101000*/ [],
                                /*1101011 111101000*/ []
                              ]
                            ],
                            /*11011 111101000*/ [
                              /*011011 111101000*/ [
                                /*0011011 111101000*/ [
                                  /*00011011 111101000*/ [],
                                  /*10011011 111101000*/ "C"
                                ],
                                /*1011011 111101000*/ []
                              ],
                              /*111011 111101000*/ [
                                /*0111011 111101000*/ [],
                                /*1111011 111101000*/ []
                              ]
                            ]
                          ]
                        ],
                        /*111 111101000*/ [
                          /*0111 111101000*/ [
                            /*00111 111101000*/ [
                              /*000111 111101000*/ [
                                /*0000111 111101000*/ [],
                                /*1000111 111101000*/ []
                              ],
                              /*100111 111101000*/ [
                                /*0100111 111101000*/ [],
                                /*1100111 111101000*/ [
                                  /*01100111 111101000*/ [],
                                  /*11100111 111101000*/ "R"
                                ]
                              ]
                            ],
                            /*10111 111101000*/ [
                              /*010111 111101000*/ [
                                /*0010111 111101000*/ [],
                                /*1010111 111101000*/ [
                                  /*01010111 111101000*/ [],
                                  /*11010111 111101000*/ "O"
                                ]
                              ],
                              /*110111 111101000*/ [
                                /*0110111 111101000*/ [],
                                /*1110111 111101000*/ [
                                  /*01110111 111101000*/ "W",
                                  /*11110111 111101000*/ []
                                ]
                              ]
                            ]
                          ],
                          /*1111 111101000*/ [
                            /*01111 111101000*/ [
                              /*001111 111101000*/ [
                                /*0001111 111101000*/ [],
                                /*1001111 111101000*/ []
                              ],
                              /*101111 111101000*/ [
                                /*0101111 111101000*/ [],
                                /*1101111 111101000*/ []
                              ]
                            ],
                            /*11111 111101000*/ [
                              /*011111 111101000*/ [
                                /*0011111 111101000*/ [],
                                /*1011111 111101000*/ []
                              ],
                              /*111111 111101000*/ [
                                /*0111111 111101000*/ [
                                  /*00111111 111101000*/ [],
                                  /*10111111 111101000*/ "Y"
                                ],
                                /*1111111 111101000*/ []
                              ]
                            ]
                          ]
                        ]
                      ]
                    ]
                    /*ReMoDDeD adds - end*/
                  ]
                ]
              ]
            ]
          ]
          ,
          /*11000*/ "h"
        ]
      ]
      ,
      /*100*/ [
        /*0100*/ "s",
        /*1100*/ [
          /*01100*/ [
            /*001100*/ "2",
            /*101100*/ "n"
          ],
          /*11100*/ "x"
        ]
      ]
    ]
    ,
    /*10*/ [
      /*010*/ [
        /*0010*/ [
          /*00010*/ "c",
          /*10010*/ [
            /*010010*/ "k",
            /*110010*/ "f"
          ]
        ],
        /*1010*/ "b"
      ],
      /*110*/ [
        /*0110*/ [
          /*00110*/ "t",
          /*10110*/ "m"
        ],
        /*1110*/ [
          /*01110*/ "9",
          /*11110*/ "7"
        ]
      ]
    ]
  ]
  ,
  /*1*/ [
    /*01*/ " ",
    /*11*/ [
      /*011*/ [
        /*0011*/ [
          /*00011*/ [
            /*000011*/ "e",
            /*100011*/ "d"
          ],
          /*10011*/ "p"
        ],
        /*1011*/ [
          /*01011*/ "g",
          /*11011*/ [
            /*011011*/ [
              /*0011011*/ [
                /*00011011*/ "z",
                /*10011011*/ "q"
              ],
              /*1011011*/ "3"
            ],
            /*111011*/ [
              /*0111011*/ "v",
              /*1111011*/ "6"
            ]
          ]
        ]
      ]
      ,
      /*111*/ [
        /*0111*/ [
          /*00111*/ "r",
          /*10111*/ "l"
        ],
        /*1111*/ [
          /*01111*/ "a",
          /*11111*/ [
            /*011111*/ [
              /*0011111*/ "1",
              /*1011111*/ [
                /*01011111*/ "4",
                /*11011111*/ "0"
              ]
            ],
            /*111111*/ [
              /*0111111*/ "i",
              /*1111111*/ "o"
            ]
          ]
        ]
      ]
    ]
  ]
];

// prettier-ignore
const HUFFMAN_LOOKUP: { [key: string]: { v: number, l: number } } = {
  "0": { "v": 223, "l": 8 }, /*11011111*/
  "1": { "v": 31, "l": 7 }, /*0011111*/
  "2": { "v": 12, "l": 6 }, /*001100*/
  "3": { "v": 91, "l": 7 }, /*1011011*/
  "4": { "v": 95, "l": 8 }, /*01011111*/
  "5": { "v": 104, "l": 8 }, /*01101000*/
  "6": { "v": 123, "l": 7 }, /*1111011*/
  "7": { "v": 30, "l": 5 }, /*11110*/
  "8": { "v": 8, "l": 6 }, /*001000*/
  "9": { "v": 14, "l": 5 }, /*01110*/
  " ": { "v": 1, "l": 2 }, /*01*/
  "a": { "v": 15, "l": 5 }, /*01111*/
  "b": { "v": 10, "l": 4 }, /*1010*/
  "c": { "v": 2, "l": 5 }, /*00010*/
  "d": { "v": 35, "l": 6 }, /*100011*/
  "e": { "v": 3, "l": 6 }, /*000011*/
  "f": { "v": 50, "l": 6 }, /*110010*/
  "g": { "v": 11, "l": 5 }, /*01011*/
  "h": { "v": 24, "l": 5 }, /*11000*/
  "i": { "v": 63, "l": 7 }, /*0111111*/
  "j": { "v": 232, "l": 9 }, /*011101000*/
  "k": { "v": 18, "l": 6 }, /*010010*/
  "l": { "v": 23, "l": 5 }, /*10111*/
  "m": { "v": 22, "l": 5 }, /*10110*/
  "n": { "v": 44, "l": 6 }, /*101100*/
  "o": { "v": 127, "l": 7 }, /*1111111*/
  "p": { "v": 19, "l": 5 }, /*10011*/
  "q": { "v": 155, "l": 8 }, /*10011011*/
  "r": { "v": 7, "l": 5 }, /*00111*/
  "s": { "v": 4, "l": 4 }, /*0100*/
  "t": { "v": 6, "l": 5 }, /*00110*/
  "u": { "v": 16, "l": 5 }, /*10000*/
  "v": { "v": 59, "l": 7 }, /*0111011*/
  "w": { "v": 0, "l": 5 }, /*00000*/
  "x": { "v": 28, "l": 5 }, /*11100*/
  "y": { "v": 40, "l": 7 }, /*0101000*/
  "z": { "v": 27, "l": 8 }, /*00011011*/
  "A": { "v": 30184, "l": 17 }, /*00111010111101000*/
  "B": { "v": 59368, "l": 17 }, /*01110011111101000*/
  "C": { "v": 79848, "l": 17 }, /*10011011111101000*/
  "D": { "v": 127976, "l": 17 }, /*11111001111101000*/
  "E": { "v": 15848, "l": 17 }, /*00011110111101000*/
  //"F": { "v": 0, "l": 0 }, /**/
  "G": { "v": 109544, "l": 17 }, /*11010101111101000*/
  "H": { "v": 80872, "l": 17 }, /**/
  //"I": { "v": 0, "l": 0 }, /**/
  //"J": { "v": 0, "l": 0 }, /**/
  "K": { "v": 19432, "l": 17 }, /*00100101111101000*/
  "L": { "v": 37864, "l": 17 }, /*01001001111101000*/
  //"M": { "v": 0, "l": 0 }, /**/
  "N": { "v": 16872, "l": 16 }, /*0100000111101000*/
  "O": { "v": 110568, "l": 17 }, /*11010111111101000*/
  "P": { "v": 117736, "l": 17 }, /*11100101111101000*/
  //"Q": { "v": 0, "l": 0 }, /**/
  "R": { "v": 118760, "l": 17 }, /*11100111111101000*/
  "S": { "v": 44520, "l": 17 }, /*01010110111101000*/
  "T": { "v": 41960, "l": 17 }, /*01010001111101000*/
  //"U": { "v": 0, "l": 0 }, /**/
  "V": { "v": 70632, "l": 17 }, /*10001001111101000*/
  "W": { "v": 61416, "l": 17 }, /*01110111111101000*/
  //"X": { "v": 0, "l": 0 }, /**/
  "Y": { "v": 98280, "l": 17 }, /*10111111111101000*/
  "Z": { "v": 17384, "l": 17 } /*00100001111101000*/
};

export function newItem(): types.IItem {
  return {
    // Default values
    identified: false,
    socketed: false,
    max_sockets: 0,
    new: false,
    is_ear: false,
    starter_item: false,
    simple_item: false,
    ethereal: false,
    personalized: false,
    personalized_name: '',
    given_runeword: false,
    version: '101',
    location_id: 0,
    equipped_id: 0,
    position_x: 0,
    position_y: 0,
    alt_position_id: types.EAltPositionId.Inventory,
    type: '',
    type_id: types.ETypeId.Other,
    type_name: '',
    quest_difficulty: 0,
    nr_of_items_in_sockets: 0,
    id: 0,
    level: 0,
    quality: types.EQuality.Normal,
    multiple_pictures: false,
    picture_id: 0,
    class_specific: false,
    low_quality_id: 0,
    timestamp: false, // true for returned body piece, false otherwise
    time: 0, // for body pieces
    ear_attributes: {
      class: 0,
      level: 0,
      name: '',
    },
    defense_rating: 0,
    max_durability: 0,
    current_durability: 0,
    total_nr_of_sockets: 0,
    quantity: 0,
    magic_prefix: 0,
    magic_suffix: 0,
    runeword_id: 0,
    runeword_name: '',
    runeword_attributes: [],
    set_id: 0,
    set_name: '',
    set_list_count: 0,
    set_attributes: [],
    set_attributes_num_req: 0,
    set_attributes_ids_req: 0,
    rare_name: '',
    rare_name2: '',
    magical_name_ids: [0, 0, 0, 0, 0, 0],
    unique_id: 0,
    unique_name: '',
    magic_attributes: [],
    combined_magic_attributes: [],
    socketed_items: [],
    socketed_attributes: [], // read-only
    base_damage: {
      mindam: 0,
      maxdam: 0,
      twohandmindam: 0,
      twohandmaxdam: 0,
    },
    reqstr: 0,
    reqdex: 0,
    inv_width: 0,
    inv_height: 0,
    inv_file: '',
    hd_inv_file: '',
    inv_transform: 0,
    transform_color: '',
    item_quality: 0,
    categories: [],
    file_index: 0,
    auto_affix_id: 0,
    _unknown_data: {},
    rare_name_id: 0,
    rare_name_id2: 0,
    displayed_magic_attributes: [], // Read-only
    displayed_runeword_attributes: [], // Read-only
    displayed_socketed_attributes: [], // Read-only
    displayed_combined_magic_attributes: [], // Read-only
  };
}

export async function readCharItems(char: types.ID2S, reader: BitReader, mod: string, config: types.IConfig): Promise<void> {
  char.items = await readItems(reader, mod, char.header.version, config, char);
}

export async function writeCharItems(char: types.ID2S, mod: string, version: number, config: types.IConfig): Promise<Uint8Array> {
  const writer = new BitWriter();
  writer.WriteArray(await writeItems(char.items, mod, version, config));
  return writer.ToArray();
}

export async function readMercItems(char: types.ID2S, reader: BitReader, mod: string, config: types.IConfig): Promise<void> {
  char.merc_items = [] as types.IItem[];
  const header = reader.ReadString(2); //0x0000 [merc item list header = "jf"]
  if (header !== 'jf') {
    // header is not present in first save after char is created
    if (char?.header.level === 1) {
      return;
    }

    throw new Error(`Mercenary header 'jf' not found at position ${reader.offset - 2 * 8}`);
  }
  if (char.header.merc_id && parseInt(char.header.merc_id, 16) !== 0) {
    char.merc_items = await readItems(reader, mod, char.header.version, config, char);
  }
}

export async function writeMercItems(char: types.ID2S, mod: string, version: number, config: types.IConfig): Promise<Uint8Array> {
  const writer = new BitWriter();
  writer.WriteString('jf', 2);
  if (char.header.merc_id && parseInt(char.header.merc_id, 16) !== 0) {
    char.merc_items = char.merc_items || [];
    writer.WriteArray(await writeItems(char.merc_items, mod, version, config));
  }
  return writer.ToArray();
}

export async function readGolemItems(char: types.ID2S, reader: BitReader, mod: string, config: types.IConfig): Promise<void> {
  const header = reader.ReadString(2); //0x0000 [golem item list header = "kf"]
  if (header !== 'kf') {
    // header is not present in first save after char is created
    if (char?.header.level === 1) {
      return;
    }

    throw new Error(`Golem header 'kf' not found at position ${reader.offset - 2 * 8}`);
  }
  const has_golem = reader.ReadUInt8();
  if (has_golem === 1) {
    char.golem_item = await readItem(reader, mod, char.header.version, config);
  }
}

export async function writeGolemItems(char: types.ID2S, mod: string, version: number, config: types.IConfig): Promise<Uint8Array> {
  const writer = new BitWriter();
  writer.WriteString('kf', 2);
  if (char.golem_item) {
    writer.WriteUInt8(1);
    writer.WriteArray(await writeItem(char.golem_item, mod, version, config));
  } else {
    writer.WriteUInt8(0);
  }
  return writer.ToArray();
}

export async function readCorpseItems(char: types.ID2S, reader: BitReader, mod: string, config: types.IConfig): Promise<void> {
  char.corpse_items = [] as types.IItem[];
  const header = reader.ReadString(2); //0x0000 [item list header = 0x4a, 0x4d "JM"]
  if (header !== 'JM') {
    // header is not present in first save after char is created
    if (char.header.level === 1) {
      char.is_dead = 0;
      return;
    }

    throw new Error(`Corpse header 'JM' not found at position ${reader.offset - 2 * 8}`);
  }
  char.is_dead = reader.ReadUInt16(); //0x0002 [corpse count]
  for (let i = 0; i < char.is_dead; i++) {
    char.corpse_unk004 = reader.ReadArray(12);
    // reader.SkipBytes(12); //0x0004 [b4_entered_area, x_pos, y_pos]
    char.corpse_items = char.corpse_items.concat(await readItems(reader, mod, char.header.version, config, char));
  }
}

export async function writeCorpseItem(char: types.ID2S, mod: string, version: number, config: types.IConfig): Promise<Uint8Array> {
  const writer = new BitWriter();
  writer.WriteString('JM', 2);
  writer.WriteUInt16(char.is_dead);
  //json struct doesnt support multiple corpses without modifying it
  if (char.is_dead) {
    writer.WriteArray(new Uint8Array(12));
    char.corpse_items = char.corpse_items || [];
    writer.WriteArray(await writeItems(char.corpse_items, mod, version, config));
  }
  return writer.ToArray();
}

export async function readItems(
  reader: BitReader,
  mod: string,
  version: number,
  config: types.IConfig,
  char?: types.ID2S,
): Promise<types.IItem[]> {
  const items = [] as types.IItem[];
  const header = reader.ReadString(2); //0x0000 [item list header = 0x4a, 0x4d "JM"]
  if (header !== 'JM') {
    // header is not present in first save after char is created
    if (char?.header.level === 1) {
      return []; // TODO: return starter items based on class
    }

    throw new Error(`Item list header 'JM' not found at position ${reader.offset - 2 * 8}`);
  }
  const count = reader.ReadUInt16(); //0x0002

  for (let i = 0; i < count; i++) {
    items.push(await readItem(reader, mod, version, config));
  }
  return items;
}

export async function writeItems(items: types.IItem[], mod: string, version: number, config: types.IConfig): Promise<Uint8Array> {
  const writer = new BitWriter();
  writer.WriteString('JM', 2);
  writer.WriteUInt16(items.length);
  for (let i = 0; i < items.length; i++) {
    writer.WriteArray(await writeItem(items[i], mod, version, config));
  }
  return writer.ToArray();
}

export async function readItem(reader: BitReader, mod: string, version: number, config: types.IConfig): Promise<types.IItem> {
  if (version <= 0x60) {
    const header = reader.ReadString(2); //0x0000 [item header = 0x4a, 0x4d "JM"]
    if (header !== 'JM') {
      throw new Error(`Item header 'JM' not found at position ${reader.offset - 2 * 8}`);
    }
  }
  const constants = getConstantData(mod, version);
  const item = newItem();

  _readSimpleBits(item, reader, version, constants /*, config*/);
  if (!item.simple_item) {
    item.id = reader.ReadUInt32(32);
    item.level = reader.ReadUInt8(7);
    item.quality = reader.ReadUInt8(4);
    item.multiple_pictures = reader.ReadBit() == 1;
    if (item.multiple_pictures) {
      item.picture_id = reader.ReadUInt8(3);
    }
    item.class_specific = reader.ReadBit() == 1;
    if (item.class_specific) {
      item.auto_affix_id = reader.ReadUInt16(11);
    }
    switch (item.quality) {
      case EQuality.Low:
        item.low_quality_id = reader.ReadUInt8(3);
        break;
      case EQuality.Normal:
        break;
      case EQuality.Superior:
        item.file_index = reader.ReadUInt8(3);
        break;
      case EQuality.Magic:
        item.magic_prefix = reader.ReadUInt16(11);
        item.magic_suffix = reader.ReadUInt16(11);
        break;
      case EQuality.Set:
        item.set_id = reader.ReadUInt16(12);
        item.set_name = constants.set_items[item.set_id] ? constants.set_items[item.set_id].n : '';
        break;
      case EQuality.Unique:
        item.unique_id = reader.ReadUInt16(12);
        item.unique_name = constants.unq_items[item.unique_id] ? constants.unq_items[item.unique_id].n : '';
        break;
      case EQuality.Rare:
      case EQuality.Crafted:
        item.rare_name_id = reader.ReadUInt8(8);
        if (item.rare_name_id) item.rare_name = constants.rare_names[item.rare_name_id] ? constants.rare_names[item.rare_name_id].n : '';
        item.rare_name_id2 = reader.ReadUInt8(8);
        if (item.rare_name_id2)
          item.rare_name2 = constants.rare_names[item.rare_name_id2] ? constants.rare_names[item.rare_name_id2].n : '';
        for (let i = 0; i < 6; i++) {
          const prefix = reader.ReadBit();
          if (prefix === 1) {
            item.magical_name_ids[i] = reader.ReadUInt16(11);
          } else {
            item.magical_name_ids[i] = 0;
          }
        }
        break;
      case EQuality.DemonTempered:
        item.rare_name_id = reader.ReadUInt8(8);
        if (item.rare_name_id) item.rare_name = constants.rare_names[item.rare_name_id] ? constants.rare_names[item.rare_name_id].n : '';
        item.rare_name_id2 = reader.ReadUInt8(8);
        if (item.rare_name_id2)
          item.rare_name2 = constants.rare_names[item.rare_name_id2] ? constants.rare_names[item.rare_name_id2].n : '';
        break;
      default:
        break;
    }
    if (item.given_runeword) {
      item.runeword_id = reader.ReadUInt16(12) - 26;

      if (constants.runeword_fixes) {
        const reverse_runeword_fixes = swapObjectKeyValue(constants.runeword_fixes);
        if (reverse_runeword_fixes[item.runeword_id]) {
          item.runeword_id = reverse_runeword_fixes[item.runeword_id];
        }
      }

      if (constants.runewords[item.runeword_id]) {
        item.runeword_name = constants.runewords[item.runeword_id]!.n!;
      }
      reader.ReadUInt8(4);
    }

    if (item.personalized) {
      const arr = new Uint8Array(16);
      for (let i = 0; i < arr.length; i++) {
        if (version > 0x61) {
          arr[i] = reader.ReadUInt8(8);
        } else {
          arr[i] = reader.ReadUInt8(7);
        }
        if (arr[i] === 0x00) {
          break;
        }
      }
      item.personalized_name = new BitReader(arr).ReadString(16).trim().replace(/\0/g, '');
    }

    //tomes
    if (item.type === 'tbk' || item.type == 'ibk') {
      reader.ReadUInt8(5);
    }

    //realm data
    item.timestamp = reader.ReadUInt8(1) == 1;
    if (item.timestamp || item.categories.includes('Body Part')) {
      item.time = reader.ReadUInt32(30);
    }

    if (item.type_id === ETypeId.Armor) {
      item.defense_rating = reader.ReadUInt16(constants.magical_properties[31].sB) - (constants.magical_properties[31].sA || 0);
    }
    if (item.type_id === ETypeId.Armor || item.type_id === ETypeId.Weapon) {
      item.max_durability = reader.ReadUInt16(constants.magical_properties[73].sB) - (constants.magical_properties[73].sA || 0);
      if (item.max_durability > 0) {
        item.current_durability = reader.ReadUInt16(constants.magical_properties[72].sB) - (constants.magical_properties[72].sA || 0);
      }
    }

    if (constants.stackables[item.type]) {
      item.quantity = reader.ReadUInt16(9);
    }

    if (item.socketed) {
      item.total_nr_of_sockets = reader.ReadUInt8(4);
    } else {
      item.total_nr_of_sockets = 0;
    }

    /**
     * 5 bits. any of the 5 bits can be set. if a bit is set that means
     * means +1 to the set_list_count
     */
    let plist_flag = 0;
    if (item.quality === EQuality.Set) {
      plist_flag = reader.ReadUInt8(5);
      item.set_list_count = 0;
      item._unknown_data.plist_flag = plist_flag;
    }

    //magical properties
    let magic_attributes = _readMagicAttributes(reader, constants);
    item.magic_attributes = magic_attributes;

    while (plist_flag > 0) {
      if (plist_flag & 1) {
        item.set_list_count += 1;
        magic_attributes = _readMagicAttributes(reader, constants);
        if (item.set_attributes) {
          item.set_attributes.push(magic_attributes);
        } else {
          item.set_attributes = [magic_attributes];
        }
      }
      plist_flag >>>= 1;
    }

    if (item.given_runeword) {
      magic_attributes = _readMagicAttributes(reader, constants);
      if (magic_attributes && magic_attributes.length > 0) {
        item.runeword_attributes = magic_attributes;
      }
    }
  }
  reader.Align();

  if (item.nr_of_items_in_sockets > 0 && !item.simple_item) {
    for (let i = 0; i < item.nr_of_items_in_sockets; i++) {
      item.socketed_items.push(await readItem(reader, mod, version, config));
    }
  }
  //console.log(JSON.stringify(item));
  return item;
}

export async function writeItem(item: types.IItem, mod: string, version: number, config: types.IConfig): Promise<Uint8Array> {
  const constants = getConstantData(mod, version);
  const itemTypeDef = getItemTypeDef(item, constants);
  if (item._unknown_data === undefined) {
    item._unknown_data = {};
  }
  if (item.categories === undefined) {
    item.categories = itemTypeDef.c;
  }

  const writer = new BitWriter();
  if (version <= 0x60) {
    writer.WriteString('JM', 2);
  }
  _writeSimpleBits(writer, mod, version, item);
  if (!item.simple_item) {
    writer.WriteUInt32(item.id, 32);
    writer.WriteUInt8(item.level, 7);
    writer.WriteUInt8(item.quality, 4);
    writer.WriteBit(item.multiple_pictures ? 1 : 0);
    if (item.multiple_pictures) {
      writer.WriteUInt8(item.picture_id, 3);
    }
    writer.WriteUInt8(item.class_specific ? 1 : 0, 1);
    if (item.class_specific) {
      writer.WriteUInt16(item.auto_affix_id || 0, 11);
    }
    switch (item.quality) {
      case EQuality.Low:
        writer.WriteUInt8(item.low_quality_id, 3);
        break;
      case EQuality.Normal:
        break;
      case EQuality.Superior:
        writer.WriteUInt8(item.file_index || 0, 3);
        break;
      case EQuality.Magic:
        writer.WriteUInt16(item.magic_prefix, 11);
        writer.WriteUInt16(item.magic_suffix, 11);
        break;
      case EQuality.Set:
        writer.WriteUInt16(item.set_id, 12);
        break;
      case EQuality.Unique:
        writer.WriteUInt16(item.unique_id, 12);
        break;
      case EQuality.Rare:
      case EQuality.Crafted:
        writer.WriteUInt8(item.rare_name_id !== undefined ? item.rare_name_id : _lookupRareId(item.rare_name, constants), 8);
        writer.WriteUInt8(item.rare_name_id2 !== undefined ? item.rare_name_id2 : _lookupRareId(item.rare_name2, constants), 8);
        for (let i = 0; i < 6; i++) {
          const magical_name_id = item.magical_name_ids !== undefined ? item.magical_name_ids[i] : 0;
          if (magical_name_id) {
            writer.WriteBit(1);
            writer.WriteUInt16(magical_name_id, 11);
          } else {
            writer.WriteBit(0);
          }
        }
        break;
      case EQuality.DemonTempered:
        writer.WriteUInt8(item.rare_name_id !== undefined ? item.rare_name_id : _lookupRareId(item.rare_name, constants), 8);
        writer.WriteUInt8(item.rare_name_id2 !== undefined ? item.rare_name_id2 : _lookupRareId(item.rare_name2, constants), 8);
        break;
      default:
        break;
    }

    if (item.given_runeword) {
      let runeword_id = item.runeword_id; // It's important to modify a copy, not the actual attribute

      if (constants.runeword_fixes && constants.runeword_fixes[runeword_id]) {
        runeword_id = constants.runeword_fixes[runeword_id];
      }

      writer.WriteUInt16(runeword_id + 26, 12);
      writer.WriteUInt8(5, 4); //always 5?
    }

    if (item.personalized) {
      const name = item.personalized_name.substring(0, 16);
      for (let i = 0; i < name.length; i++) {
        if (version > 0x61) {
          writer.WriteUInt8(name.charCodeAt(i), 8);
        } else {
          writer.WriteUInt8(name.charCodeAt(i) & 0x7f, 7);
        }
      }
      writer.WriteUInt8(0x00, version > 0x61 ? 8 : 7);
    }

    if (item.type === 'tbk') {
      writer.WriteUInt8(0, 5);
    } else if (item.type === 'ibk') {
      writer.WriteUInt8(1, 5);
    }

    writer.WriteUInt8(item.timestamp ? 1 : 0, 1);
    if (item.timestamp || item.categories.includes('Body Part')) {
      writer.WriteUInt32(item.time, 30);
    }

    if (item.type_id === ETypeId.Armor || item.type_id === ETypeId.Shield) {
      writer.WriteUInt16(item.defense_rating + (constants.magical_properties[31].sA || 0), constants.magical_properties[31].sB);
    }

    if (item.type_id === ETypeId.Armor || item.type_id === ETypeId.Shield || item.type_id === ETypeId.Weapon) {
      writer.WriteUInt16(item.max_durability || 0, constants.magical_properties[73].sB);
      if (item.max_durability > 0) {
        writer.WriteUInt16(item.current_durability, constants.magical_properties[72].sB);
      }
    }

    if (constants.stackables[item.type]) {
      writer.WriteUInt16(item.quantity, 9);
    }

    if (item.socketed) {
      writer.WriteUInt8(item.total_nr_of_sockets, 4);
    }

    if (item.quality === EQuality.Set) {
      const set_attribute_count = item.set_attributes != null ? item.set_attributes.length : 0;
      //reduced by -1 removed as this seems to be wrong
      const plist_flag = (1 << set_attribute_count) - 1;
      writer.WriteUInt8(item._unknown_data.plist_flag || plist_flag, 5);
    }

    if (itemTypeDef.m) {
      // Dynamic attributes are not written (anyway D2 will erase them)
      _writeMagicAttributes(writer, [], constants);
    } else {
      _writeMagicAttributes(writer, item.magic_attributes, constants);
    }

    if (item.set_attributes && item.set_attributes.length > 0) {
      for (let i = 0; i < item.set_attributes.length; i++) {
        _writeMagicAttributes(writer, item.set_attributes[i], constants);
      }
    }

    if (item.given_runeword) {
      _writeMagicAttributes(writer, item.runeword_attributes, constants);
    }
  }

  writer.Align();

  if (item.nr_of_items_in_sockets > 0 && !item.simple_item) {
    for (let i = 0; i < item.nr_of_items_in_sockets; i++) {
      writer.WriteArray(await writeItem(item.socketed_items[i], mod, version, config));
    }
  }
  return writer.ToArray();
}

function _readSimpleBits(
  item: types.IItem,
  reader: BitReader,
  version: number,
  constants: types.IConstantData /*, config: types.IConfig*/,
) {
  //init so we do not have npe's
  item._unknown_data = {};
  //1.10-1.14d
  //[flags:32][version:10][mode:3]([invloc:4][x:4][y:4][page:3])([itemcode:32])([sockets:3])
  //1.15
  //[flags:32][version:3][mode:3]([invloc:4][x:4][y:4][page:3])([itemcode:variable])([sockets:3])
  item._unknown_data.b0_3 = reader.ReadBitArray(4);
  item.identified = reader.ReadBit() == 1;
  item._unknown_data.b5_10 = reader.ReadBitArray(6); // 3b>unk, 1b>broken, 2b>unk
  item.socketed = reader.ReadBit() == 1;
  item._unknown_data.b12 = reader.ReadBitArray(1); // ? 0x00
  item.new = reader.ReadBit() == 1;
  item._unknown_data.b14_15 = reader.ReadBitArray(2); // ? 0x00
  item.is_ear = reader.ReadBit() == 1;
  item.starter_item = reader.ReadBit() == 1;
  item._unknown_data.b18_20 = reader.ReadBitArray(3); // 1b>unk, 2b>? 0x03 for version 71 with 15, 26 or 31 bytes, otherwise 0x00
  item.simple_item = reader.ReadBit() == 1; // compact
  item.ethereal = reader.ReadBit() == 1;
  item._unknown_data.b23 = reader.ReadBitArray(1); // ? 0x01 for versions 87+, otherwise 0x00
  item.personalized = reader.ReadBit() == 1;
  item._unknown_data.b25 = reader.ReadBitArray(1); // ? 0x00
  item.given_runeword = reader.ReadBit() == 1;
  item._unknown_data.b27_31 = reader.ReadBitArray(5); // ? 0x00

  if (version <= 0x60) {
    item.version = reader.ReadUInt16(10).toString(10); // I don't know the values
  } else if (version >= 0x61) {
    item.version = reader.ReadUInt16(3).toString(2);
  }
  if (['0', '000', ' ', '   ', ''].includes(item.version)) item.version = '101'; // Just in case

  item.location_id = reader.ReadUInt8(3);
  item.equipped_id = reader.ReadUInt8(4);
  item.position_x = reader.ReadUInt8(4);
  item.position_y = reader.ReadUInt8(4);
  item.alt_position_id = reader.ReadUInt8(3);
  if (item.is_ear) {
    item.type = 'ear';
    const clazz = reader.ReadUInt8(3);
    const level = reader.ReadUInt8(7);
    const arr = new Uint8Array(15);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = reader.ReadUInt8(7);
      if (arr[i] === 0x00) {
        break;
      }
    }
    const name = new BitReader(arr).ReadString(15).trim().replace(/\0/g, '');
    item.ear_attributes = {
      class: clazz,
      level: level,
      name: name,
    } as types.IEarAttributes;
  } else {
    if (version <= 0x60) {
      item.type = reader.ReadString(4);
    } else if (version >= 0x61) {
      item.type = '';
      //props to d07riv
      //https://github.com/d07RiV/d07riv.github.io/blob/master/d2r.html#L11-L20
      for (let i = 0; i < 4; i++) {
        let node = HUFFMAN as any;
        let bits = '';
        do {
          const bit = reader.ReadBit();
          bits += bit;
          node = node[bit];
          if (node === undefined) {
            console.log('Huffman value starting by ' + bits.split('').reverse().join('') + '... is undefined.');
          }
        } while (Array.isArray(node));
        item.type += node;
      }
    }
    item.type = item.type.trim().replace(/\0/g, '');
    let details = getItemTypeDef(item, constants);
    if (details) {
      if (details.c) {
        item.categories = details.c;
        if (item?.categories.includes('Any Armor')) {
          item.type_id = ETypeId.Armor;
        } else if (item?.categories.includes('Weapon')) {
          item.type_id = ETypeId.Weapon;
          details = constants.weapon_items[item.type];
        } else {
          item.type_id = ETypeId.Other;
        }
      } else {
        throw new Error(`Cannot find categories for type ${item.type} does not exist`);
      }
    } else {
      throw new Error(`Cannot find details for type ${item.type} does not exist`);
    }

    let bits = item.simple_item ? 1 : 3;
    if (item.categories?.includes('Quest')) {
      item.quest_difficulty = reader.ReadUInt16(constants.magical_properties[356].sB) - (constants.magical_properties[356].sA || 0);
      bits = 1;
    }
    item.nr_of_items_in_sockets = reader.ReadUInt8(bits);
  }
}

function _lookupRareId(name: string, constants: types.IConstantData): number {
  //some inconsistencies with txt data and nokka. so have to hack it with startsWith
  return constants.rare_names.findIndex(
    (k) => k && k.n && (k.n.toLowerCase().startsWith(name.toLowerCase()) || name.toLowerCase().startsWith(k.n.toLowerCase())),
  );
}

function _writeSimpleBits(writer: BitWriter, mod: string, version: number, item: types.IItem) {
  const constants = getConstantData(mod, version);
  writer.WriteBits(item._unknown_data.b0_3 || new Uint8Array(4), 4);
  writer.WriteBit(item.identified ? 1 : 0);
  writer.WriteBits(item._unknown_data.b5_10 || new Uint8Array(6), 6);
  writer.WriteBit(item.socketed ? 1 : 0);
  writer.WriteBits(item._unknown_data.b12 || new Uint8Array(1), 1);
  writer.WriteBit(item.new ? 1 : 0);
  writer.WriteBits(item._unknown_data.b14_15 || new Uint8Array(2), 2);
  writer.WriteBit(item.is_ear ? 1 : 0);
  writer.WriteBit(item.starter_item ? 1 : 0);
  writer.WriteBits(item._unknown_data.b18_20 || new Uint8Array(3), 3);
  writer.WriteBit(item.simple_item ? 1 : 0);
  writer.WriteBit(item.ethereal ? 1 : 0);
  writer.WriteBits(item._unknown_data.b23 || new Uint8Array([1]), 1); //always 1? IFLAG_JUSTSAVED
  writer.WriteBit(item.personalized ? 1 : 0);
  writer.WriteBits(item._unknown_data.b25 || new Uint8Array(1), 1); //IFLAG_LOWQUALITY
  writer.WriteBit(item.given_runeword ? 1 : 0);
  writer.WriteBits(item._unknown_data.b27_31 || new Uint8Array(5), 5);

  const itemVersion = !!item.version ? item.version : '101';
  if (version <= 0x60) {
    // 0 = pre-1.08; 1 = 1.08/1.09 normal; 2 = 1.10 normal; 100 = 1.08/1.09 expansion; 101 = 1.10 expansion
    writer.WriteUInt16(parseInt(itemVersion, 10), 10);
  } else if (version >= 0x61) {
    writer.WriteUInt16(parseInt(itemVersion, 2), 3);
  }
  writer.WriteUInt8(item.location_id, 3);
  writer.WriteUInt8(item.equipped_id, 4);
  writer.WriteUInt8(item.position_x, 4);
  writer.WriteUInt8(item.position_y, 4);
  writer.WriteUInt8(item.alt_position_id, 3);
  if (item.is_ear) {
    writer.WriteUInt8(item.ear_attributes.class, 3);
    writer.WriteUInt8(item.ear_attributes.level, 7);
    const name = item.ear_attributes.name.substring(0, 15);
    for (let i = 0; i < name.length; i++) {
      writer.WriteUInt8(name.charCodeAt(i) & 0x7f, 7);
    }
    writer.WriteUInt8(0x00, 7);
  } else {
    const t = item.type.padEnd(4, ' ');
    if (version <= 0x60) {
      writer.WriteString(t, 4);
    } else {
      for (const c of t) {
        const n = HUFFMAN_LOOKUP[c];
        writer.WriteUInt32(n.v, n.l); // Change from Uint16 to Uint32 because in ReMoDDeD caps letters are on 17bits.
      }
    }

    let bits = item.simple_item ? 1 : 3;
    if (item.categories?.includes('Quest')) {
      const difficulty = item.quest_difficulty || 0;
      writer.WriteUInt16(difficulty + (constants.magical_properties[356].sA || 0), constants.magical_properties[356].sB);
      bits = 1;
    }
    writer.WriteUInt8(item.nr_of_items_in_sockets, bits);
  }
}

export function _readMagicAttributes(reader: BitReader, constants: types.IConstantData): types.IMagicProperty[] {
  let id = reader.ReadUInt16(9);
  const magic_attributes = [];
  while (id != 0x1ff) {
    const values = [];
    if (!constants.magical_properties[id]) {
      throw new Error(`Invalid magic attribute Id: ${id} at position ${reader.offset - 9}`);
    }
    const num_of_properties = constants.magical_properties[id].np || 1;
    for (let i = 0; i < num_of_properties; i++) {
      const itemStatDef = constants.magical_properties[id + i];
      if (itemStatDef == null) {
        throw new Error(`Cannot find Magical Property for id: ${id} at position ${reader.offset}`);
      }
      if (itemStatDef.sP) {
        let param = reader.ReadUInt32(itemStatDef.sP);
        switch (itemStatDef.dF) {
          case 14: //+skill to skilltab
            values.push(param & 0x7);
            param = (param >> 3) & 0x1fff;
            break;
          default:
            break;
        }
        //encode
        switch (itemStatDef.e) {
          case 1:
            //throw new Error(`Unimplemented encoding: ${propertyDef.encode}`);
            break;
          case 2: //chance to cast: 10bits skill id - 6bits skill level
          case 3: //charges
            values.push(param & 0x3f); //skill level
            param = (param >> 6) & 0x3ff; //skll id
            break;
          default:
            break;
        }
        values.push(param);
      }
      if (!itemStatDef.sB) {
        throw new Error(`Save Bits is undefined for stat: ${id}:${itemStatDef.s} at position ${reader.offset}`);
      }
      let v = reader.ReadUInt32(itemStatDef.sB);
      if (itemStatDef.sA) {
        v -= itemStatDef.sA;
      }
      switch (itemStatDef.e) {
        case 3:
          values.push(v & 0xff); // current charges
          values.push((v >> 8) & 0xff); //max charges
          break;
        default:
          values.push(v);
          break;
      }
    }
    magic_attributes.push({
      id: id,
      values: values,
      name: constants.magical_properties[id].s,
    } as types.IMagicProperty);
    id = reader.ReadUInt16(9);
  }
  return magic_attributes;
}

export function _writeMagicAttributes(writer: BitWriter, magic_attributes: types.IMagicProperty[], constants: types.IConstantData): void {
  if (magic_attributes) {
    for (let i = 0; i < magic_attributes.length; i++) {
      const magical_attribute = magic_attributes[i];
      let valueIdx = 0;
      writer.WriteUInt16(magical_attribute.id, 9);
      const num_of_properties = constants.magical_properties[magical_attribute!.id].np || 1;
      for (let j = 0; j < num_of_properties; j++) {
        const itemStatDef = constants.magical_properties[magical_attribute!.id + j];
        if (itemStatDef == null) {
          throw new Error(`Cannot find Magical Property for id: ${magical_attribute.id}`);
        }
        if (itemStatDef.sP) {
          let param = magical_attribute.values[valueIdx++]!;
          switch (itemStatDef.dF) {
            case 14: //+skill to skilltab
              param |= (magical_attribute.values[valueIdx++]! & 0x1fff) << 3;
              break;
            default:
              break;
          }
          //encode
          switch (itemStatDef.e) {
            case 1:
              //throw new Error(`Unimplemented encoding: ${propertyDef.encode}`);
              break;
            case 2: //chance to cast
            case 3: //charges
              param |= (magical_attribute.values[valueIdx++]! & 0x3ff) << 6;
              break;
            default:
              break;
          }
          writer.WriteUInt32(param, itemStatDef.sP);
        }
        let v = magical_attribute.values[valueIdx++]!;
        if (itemStatDef.sA) {
          v += itemStatDef.sA;
        }
        switch (itemStatDef.e) {
          case 3:
            v |= (magical_attribute.values[valueIdx++]! & 0xff) << 8;
            break;
          default:
            break;
        }
        if (!itemStatDef.sB) {
          throw new Error(`Save Bits is undefined for stat: ${magical_attribute.id}:${itemStatDef.s}`);
        }
        writer.WriteUInt32(v, itemStatDef.sB);
      }
    }
  }
  writer.WriteUInt16(0x1ff, 9);
}
