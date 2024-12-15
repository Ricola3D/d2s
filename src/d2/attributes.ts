import * as types from "./types";
import { BitReader } from "../binary/bitreader";
import { BitWriter } from "../binary/bitwriter";
import { getConstantData } from "./constants";

//todo use constants.magical_properties and csvBits
export function readAttributes(char: types.ID2S, reader: BitReader, mod: string): void {
  const constants = getConstantData(mod, char.header.version);

  // Stats = magical_properties with "Saved" = 1.
  // There are report that only stat ids 0 to 255 can be saved. It doesn't work for stats 256-510.
  const attributes = constants.magical_properties.filter((val, idx) => val && val.c && val.cB && idx < 256);

  // Initial values
  char.attributes = attributes.reduce((acc, curr) => {
    acc[curr.s] = 0; // Add the attribute with value 0
    return acc;
  }, {} as types.IAttributes);

  const header = reader.ReadString(2); //0x0000 [attributes header = 0x67, 0x66 "gf"]
  if (header != "gf") {
    // header is not present in first save after char is created
    if (char.header.level === 1) {
      const classData = constants.classes.find((c) => c.n === char.header.class).a;

      char.attributes = {
        strength: +classData.str,
        energy: +classData.int,
        dexterity: +classData.dex,
        vitality: +classData.vit,
        statpts: 0,
        newskills: 0,
        hitpoints: +classData.vit + +classData.hpadd,
        maxhp: +classData.vit + +classData.hpadd,
        mana: +classData.int,
        maxmana: +classData.int,
        stamina: +classData.stam,
        maxstamina: +classData.stam,
        level: 1,
        experience: 0,
        gold: 0,
        goldbank: 0,
      };

      return;
    }

    throw new Error(`Attribute header 'gf' not found at position ${reader.offset - 2 * 8}`);
  }
  //let bitOffset = 0;
  let id = reader.ReadUInt16(9);
  //read till 0x1ff end of attributes is found
  while (id != 0x1ff) {
    // bitOffset += 9;
    const field = constants.magical_properties[id];
    if (field === undefined) {
      throw new Error(`Invalid attribute id: ${id}`);
    }
    const size = field.cB;
    if (size === undefined) {
      throw new Error(`Missing CSV save bits for id: ${id}`);
    }
    char.attributes[field.s] = reader.ReadUInt32(size);
    if (field.cVS) {
      //hitpoints - maxstamina need to be bit shifted
      char.attributes[field.s] >>>= field.cVS;
    }

    // Next attribute
    // bitOffset += size;
    id = reader.ReadUInt16(9);
  }

  reader.Align();
}

export async function writeAttributes(char: types.ID2S, constants: types.IConstantData): Promise<Uint8Array> {
  const writer = new BitWriter();
  writer.WriteString("gf", 2); //0x0000 [attributes header = 0x67, 0x66 "gf"]

  // Stats = magical_properties with "Saved" = 1.
  // There are report that only stat ids 0 to 255 can be saved. It doesn't work for stats 256-510.
  const charStatDefs = constants.magical_properties.filter((val, idx) => val && val.c && idx < 256);

  for (const charStatDef of charStatDefs) {
    let value = char.attributes[charStatDef.s];
    if (!value) {
      continue; // 0 values are not saved to gain file size
    }
    const size = charStatDef.cB;
    if (size === undefined) {
      throw new Error(`Missing CSV save bits for attribute: ${charStatDef}`);
    }
    if (charStatDef.cVS) {
      value <<= charStatDef.cVS;
    }
    writer.WriteUInt16(charStatDef.id, 9);
    writer.WriteUInt32(value, size);
  }
  writer.WriteUInt16(0x1ff, 9); // Attribute 511 is reserved for end tag
  writer.Align();
  return writer.ToArray();
}
