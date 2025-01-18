import * as types from './types';
import { readHeader, readHeaderData, writeHeader, writeHeaderData, fixHeader } from './header';
import { readAttributes, writeAttributes } from './attributes';
import { BitReader } from '../binary/bitreader';
import { BitWriter } from '../binary/bitwriter';
import { readSkills, writeSkills } from './skills';
import * as items from './items';
import { getConstantData } from './constants';
import { enhanceAttributes, enhanceItems } from './attribute_enhancer';

const defaultConfig = {
  extendedStash: false,
  sortProperties: true,
} as types.IConfig;

function reader(buffer: Uint8Array) {
  return new BitReader(buffer);
}

async function read(buffer: Uint8Array, mod: string, userConfig?: types.IConfig): Promise<types.ID2S> {
  const char = {} as types.ID2S;
  const reader = new BitReader(buffer);
  const config = Object.assign(defaultConfig, userConfig);
  await readHeader(char, reader);
  //could load constants based on version here
  await readHeaderData(char, reader, mod);
  await readAttributes(char, reader, mod);
  await readSkills(char, reader, mod);
  await items.readCharItems(char, reader, mod, config);
  await items.readCorpseItems(char, reader, mod, config);
  if (char.header.status.expansion) {
    await items.readMercItems(char, reader, mod, config);
    await items.readGolemItems(char, reader, mod, config);
  }
  await enhanceAttributes(char, mod, char.header.version, config);
  return char;
}

async function readItem(buffer: ArrayBuffer, mod: string, version: number, userConfig?: types.IConfig): Promise<types.IItem> {
  const reader = new BitReader(buffer);
  const config = Object.assign(defaultConfig, userConfig);
  const item = await items.readItem(reader, mod, version, config);
  await enhanceItems([item], mod, version);
  return item;
}

async function write(data: types.ID2S, mod: string, version: number, userConfig?: types.IConfig): Promise<Uint8Array> {
  const config = Object.assign(defaultConfig, userConfig);
  const writer = new BitWriter();
  data.header.version = version;
  writer.WriteArray(await writeHeader(data));
  const constants = getConstantData(mod, data.header.version);
  writer.WriteArray(await writeHeaderData(data, constants));
  writer.WriteArray(await writeAttributes(data, constants));
  writer.WriteArray(await writeSkills(data));
  writer.WriteArray(await items.writeCharItems(data, mod, version, config));
  writer.WriteArray(await items.writeCorpseItem(data, mod, version, config));
  if (data.header.status.expansion) {
    writer.WriteArray(await items.writeMercItems(data, mod, version, config));
    writer.WriteArray(await items.writeGolemItems(data, mod, version, config));
  }
  await fixHeader(writer);
  return writer.ToArray();
}

async function writeItem(item: types.IItem, mod: string, version: number, userConfig?: types.IConfig): Promise<Uint8Array> {
  const config = Object.assign(defaultConfig, userConfig);
  const writer = new BitWriter();
  writer.WriteArray(await items.writeItem(item, mod, version, config));
  return writer.ToArray();
}

export { reader, read, write, readItem, writeItem };
