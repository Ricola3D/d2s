//todo define types for these

export type Index = number | string | symbol;

export type ReversibleDictionary<TKey extends Index, TValue extends Index> = {
  [key in TKey]: TValue;
};

export type IntegerBoolean = 0 | 1;

export interface IConfig {
  extendedStash?: boolean;
  sortProperties?: boolean;
}

export enum EGemSocketType {
  WeaponGloves, // 0
  ArmorBootsHelmBelt, // 1
  ShieldJewelry, // 2
}

export interface IMagicPropertyDef {
  id: number; // Id
  s?: string; // name
  c?: IntegerBoolean; // Is CSV (character class)
  cB?: number; // CSV save bits
  cS?: IntegerBoolean; // Signed or not in CSV
  cVS?: number; // CSV value shift
  sB: number; // Save bits in binary files (d2s, d2i, ...)
  sA?: number; // Save add (mainly used to define a different min value than zero)
  sP?: number; // Additional bits used to encode parameters
  e?: number; // Transform from sB & sP bits to value array
  np?: number; // Stats count. Sometimes a stat is actually coded as a few concomitant stats
  so: number; // Desc Priority (show order in tooltip/char window)
  dF: number; // Desc function (determines how to format stat as string)
  dP: string; // Template string for positive values
  dN?: string; // Template string for negative values (sometimes used for grouping where all stats of the group are present and identical)
  dV?: number; // Desc value
  d2?: string; // Desc string 2
  dg?: number; // Desc group id
  dgF?: number; // Desc group function
  dgP?: string; // Desc group template string for positive values
  dgN?: string; // Desc group template string for positive values
  dgV?: number; // Group desc value
  dg2?: string; // Group desc string 2
  dR?: string; // Template string for min/max values where min!=max
  dE?: string; // Template string for min/max values where min==max
  o?: number; // Operator to transform value
  os?: string[]; // Stats for the operator
  op?: number; // A param for the operator
  ob?: number; // A base value used to use in the operator (ex: radix, bit shift, ...)
}

export interface ICommonItemTypeDef {
  nc?: string; // Normal version code.
  exc?: string; // Exceptional version code
  elc?: string; // Elite version code
  iq: EItemQuality;
  n?: string; // Name - Backward compatibility: missing from v96-97 vanilla constants
  hi?: IntegerBoolean; // Can have sockets - missing means 0/no
  gs?: number; // Max sockets - Backward compatibility: missing from v96-97 vanilla constants
  gt: EGemSocketType;
  i: string; // inventory picture file
  ui?: string; // inventory picture file for unique version
  si?: string; // inventory picture file for set version
  iw: number; // Width in inventory
  ih: number; // Height in inventory
  it: number; // Inv Transform for colors
  ig: string[]; // Multiple inventory picture files
  eq1n?: string; // Equivalent type 1
  eq2n?: string; // Equivalent type 2
  c: string[]; // Categories
  hdi?: string; // HD inventory picture file
  hdig?: string[]; // Multiple HD inventory picture files
}

export interface IWeaponTypeDef extends ICommonItemTypeDef {
  durability?: number; // Backward compatibility: missing from v96-97 vanilla constants
  mind?: number;
  maxd?: number;
  min2d?: number;
  max2d?: number;
  rs?: number; // Required strength
  rd?: number; // Required dexterity
}

export interface IArmorTypeDef extends ICommonItemTypeDef {
  durability?: number; // Backward compatibility: missing from v96-97 vanilla constants
  minac?: number; // Min def - Backward compatibility: missing from v96-97 vanilla constants
  maxac?: number; // Max def - Backward compatibility: missing from v96-97 vanilla constants
  rs?: number; // Required strength
}

export interface IMiscTypeDef extends ICommonItemTypeDef {
  m?: GemMods; // Gem mods
}

export interface IConstantData {
  classes: any[];
  skills: any[];
  magic_prefixes: any[];
  magic_suffixes: any[];
  rare_names: any[];
  armor_items: { [key: string]: IArmorTypeDef };
  weapon_items: { [key: string]: IWeaponTypeDef };
  other_items: { [key: string]: IMiscTypeDef };
  stackables: any;
  properties: any;
  magical_properties: IMagicPropertyDef[];
  runewords: any[];
  runeword_fixes?: { [key: number]: number };
  set_items: any[];
  unq_items: any[];
  gold?: {
    perCharLevel: number;
    bank: number;
  };
}

export interface ID2S {
  header: IHeader;
  attributes: IAttributes;
  unk_after_attr: Uint8Array;
  item_bonuses: IMagicProperty[];
  displayed_item_bonuses: IMagicProperty[];
  skills: ISkill[]; //Skill
  items: IItem[]; //Item
  corpse_unk004: Uint8Array;
  corpse_items: IItem[];
  merc_items: IItem[];
  golem_item: IItem;
  is_dead: number;
}

export interface IAttributes {
  [key: string]: number;
}

export interface IMenuAppearance {
  graphic: number;
  tint: number;
}
export interface ICharMenuAppearance {
  //composite.txt
  head: IMenuAppearance;
  torso: IMenuAppearance;
  legs: IMenuAppearance;
  right_arm: IMenuAppearance;
  left_arm: IMenuAppearance;
  right_hand: IMenuAppearance;
  left_hand: IMenuAppearance;
  shield: IMenuAppearance;
  special1: IMenuAppearance; //right shoulder
  special2: IMenuAppearance; //left shoulder
  special3: IMenuAppearance;
  special4: IMenuAppearance;
  special5: IMenuAppearance;
  special6: IMenuAppearance;
  special7: IMenuAppearance;
  special8: IMenuAppearance;
}

export interface IDifficulty {
  Normal: number;
  Nightmare: number;
  Hell: number;
}

export interface INPC {
  intro: boolean;
  congrats: boolean;
}

export interface INPCS {
  warriv_act_ii: INPC;
  charsi: INPC;
  warriv_act_i: INPC;
  kashya: INPC;
  akara: INPC;
  gheed: INPC;
  greiz: INPC;
  jerhyn: INPC;
  meshif_act_ii: INPC;
  geglash: INPC;
  lysnader: INPC;
  fara: INPC;
  drogan: INPC;
  alkor: INPC;
  hratli: INPC;
  ashera: INPC;
  cain_act_iii: INPC;
  elzix: INPC;
  malah: INPC;
  anya: INPC;
  natalya: INPC;
  meshif_act_iii: INPC;
  ormus: INPC;
  cain_act_v: INPC;
  qualkehk: INPC;
  nihlathak: INPC;
}

export interface IQuest {
  b15_completed_before: boolean;
  b14_completed_now: boolean;
  b13_done_recently: boolean; //13
  b12_closed: boolean; //12
  b11_custom7: boolean;
  b10_custom6: boolean;
  b9_custom5: boolean;
  b8_custom4: boolean;
  b7_custom3: boolean; //7
  b6_custom2: boolean;
  b5_custom1: boolean;
  b4_entered_area: boolean;
  b3_left_town: boolean;
  b2_is_received: boolean; //2
  b0_is_completed: boolean; //1
  b1_is_requirement_completed: boolean; //0
}

export interface IActQuests {
  introduced: boolean;
  completed: boolean;
}

export interface IActIQuests extends IActQuests {
  den_of_evil: IQuest;
  sisters_burial_grounds: IQuest;
  tools_of_the_trade: IQuest;
  the_search_for_cain: IQuest;
  the_forgotten_tower: IQuest;
  sisters_to_the_slaughter: IQuest;
}

export interface IActIWaypoints {
  rogue_encampement: boolean;
  cold_plains: boolean;
  stony_field: boolean;
  dark_woods: boolean;
  black_marsh: boolean;
  outer_cloister: boolean;
  jail_lvl_1: boolean;
  inner_cloister: boolean;
  catacombs_lvl_2: boolean;
}

export interface IActIIQuests extends IActQuests {
  radaments_lair: IQuest;
  the_horadric_staff: IQuest;
  tainted_sun: IQuest;
  arcane_sanctuary: IQuest;
  the_summoner: IQuest;
  the_seven_tombs: IQuest;
}

export interface IActIIWaypoints {
  lut_gholein: boolean;
  sewers_lvl_2: boolean;
  dry_hills: boolean;
  halls_of_the_dead_lvl_2: boolean;
  far_oasis: boolean;
  lost_city: boolean;
  palace_cellar_lvl_1: boolean;
  arcane_sanctuary: boolean;
  canyon_of_the_magi: boolean;
}

export interface IActIIIQuests extends IActQuests {
  lam_esens_tome: IQuest;
  khalims_will: IQuest;
  blade_of_the_old_religion: IQuest;
  the_golden_bird: IQuest;
  the_blackened_temple: IQuest;
  the_guardian: IQuest;
}

export interface IActIIIWaypoints {
  kurast_docks: boolean;
  spider_forest: boolean;
  great_marsh: boolean;
  flayer_jungle: boolean;
  lower_kurast: boolean;
  kurast_bazaar: boolean;
  upper_kurast: boolean;
  travincal: boolean;
  durance_of_hate_lvl_2: boolean;
}

export interface IActIVQuests extends IActQuests {
  the_fallen_angel: IQuest;
  terrors_end: IQuest;
  hellforge: IQuest;
}

export interface IActIVWaypoints {
  the_pandemonium_fortress: boolean;
  city_of_the_damned: boolean;
  river_of_flame: boolean;
}

export interface IActVQuests extends IActQuests {
  siege_on_harrogath: IQuest;
  rescue_on_mount_arreat: IQuest;
  prison_of_ice: IQuest;
  betrayal_of_harrogath: IQuest;
  rite_of_passage: IQuest;
  eve_of_destruction: IQuest;
  reset_consumed: boolean;
}

export interface IActVWaypoints {
  harrogath: boolean;
  frigid_highlands: boolean;
  arreat_plateau: boolean;
  crystalline_passage: boolean;
  halls_of_pain: boolean;
  glacial_trail: boolean;
  frozen_tundra: boolean;
  the_ancients_way: boolean;
  worldstone_keep_lvl_2: boolean;
}

export interface IQuests {
  act_i: IActIQuests;
  act_ii: IActIIQuests;
  act_iii: IActIIIQuests;
  act_iv: IActIVQuests;
  act_v: IActVQuests;
  unk058: Uint8Array;
  unk084: Uint8Array;
}

export interface IWaypoints {
  act_i: IActIWaypoints;
  act_ii: IActIIWaypoints;
  act_iii: IActIIIWaypoints;
  act_iv: IActIVWaypoints;
  act_v: IActVWaypoints;
  unk_align: Uint8Array;
  unk_last: Uint8Array;
}

export interface INPCData {
  normal: INPCS;
  nm: INPCS;
  hell: INPCS;
}

export interface IWaypointData {
  normal: IWaypoints;
  nm: IWaypoints;
  hell: IWaypoints;
}

export interface IHeader {
  identifier: string;
  version: number;
  filesize: number;
  checksum: string;
  unk0016: Uint8Array;
  unk0020: Uint8Array;
  name: string;
  status: IStatus;
  progression: number;
  active_arms: number;
  class: string;
  unk0041: Uint8Array;
  level: number;
  created: number;
  last_played: number;
  unk0052: Uint8Array;
  assigned_skills: string[];
  left_skill: string;
  right_skill: string;
  left_swap_skill: string;
  right_swap_skill: string;
  menu_appearance: ICharMenuAppearance;
  difficulty: IDifficulty;
  map_id: number;
  unk0175: Uint8Array;
  dead_merc: number;
  merc_id: string;
  merc_name_id: number;
  merc_type: number;
  merc_experience: number;
  unk0191: Uint8Array;
  unk0335: Uint8Array;
  unk0339: Uint8Array;
  unk0343: Uint8Array;
  quests_normal: IQuests;
  quests_nm: IQuests;
  quests_hell: IQuests;
  unk0633: Uint8Array;
  unk0635: Uint8Array;
  unk0639: Uint8Array;
  waypoints: IWaypointData;
  unk0713: Uint8Array;
  unk0715: Uint8Array;
  raw_npcs: Uint8Array;
  npcs: INPCData;
}

export interface IStatus {
  unk0: boolean;
  unk1: boolean;
  expansion: boolean;
  died: boolean;
  hardcore: boolean;
  ladder: boolean;
  unk7: boolean;
}

export interface ISkill {
  id: number;
  points: number;
  name: string;
}

export interface IItem {
  identified: boolean;
  socketed: boolean;
  max_sockets: number;
  new: boolean;
  is_ear: boolean;
  starter_item: boolean;
  simple_item: boolean;
  ethereal: boolean;
  personalized: boolean;
  personalized_name: string;
  given_runeword: boolean;
  version: string;
  location_id: ELocationId; // 0: stored, 1: equipped, 2: belt, 4: cursor, 6: socketed
  equipped_id: EEquippedId; // 0: stored, 1: helm, 2: amulet, 3: armor, 4: right-hand, 5: left-hand, 6: right ring, 7: left ring, 8: belt, 9: boots, 10: gloves, 11: right-hand switch, 12: left-hand switch
  position_x: number; // 0-indexed column, from left to right
  position_y: number; // 0-indexed row, from top to bottom
  alt_position_id: EAltPositionId; // 1: inventory, 4: cube, 5: stash
  type: string; // 4 characters code
  type_id: ETypeId; // 0:undefined, 1: armor, 2: shield, 3: weapon, 4: other
  type_name: string; // Type en-US name
  quest_difficulty: number;
  nr_of_items_in_sockets: number; // Number of socketed items
  id: number; // Uint32 identifier
  level: number;
  quality: EQuality; // 0:undefined, 1: low, 2: normal, 3: superior, 4: magic, 5: set, 6: rare, 7: unique, 8: crafted
  multiple_pictures: boolean; // 1: has multiple skins
  picture_id: number; // current skin index
  class_specific: boolean;
  low_quality_id: number;
  timestamp: number;
  time: number;
  ear_attributes: IEarAttributes;
  defense_rating: number;
  max_durability: number;
  current_durability: number;
  total_nr_of_sockets: number;
  quantity: number;
  magic_prefix: number;
  magic_suffix: number;
  runeword_id: number;
  runeword_name: string;
  runeword_attributes: IMagicProperty[];
  set_id: number;
  set_name: string;
  set_list_count: number;
  set_attributes: IMagicProperty[][];
  set_attributes_num_req: number;
  set_attributes_ids_req: number;
  rare_name: string;
  rare_name2: string;
  magical_name_ids: [number, number, number, number, number, number];
  unique_id: number;
  unique_name: string;
  magic_attributes: IMagicProperty[];
  combined_magic_attributes: IMagicProperty[]; // Read-only
  socketed_items: IItem[];
  socketed_attributes: IMagicProperty[];
  base_damage: IWeaponDamage;
  reqstr: number;
  reqdex: number;
  inv_width: number;
  inv_height: number;
  inv_file: string;
  hd_inv_file: string;
  inv_transform: number;
  transform_color: string;
  item_quality: EItemQuality; // 0:normal, 1: exceptional or NA, 2: elite
  categories: string[];
  file_index: number;
  auto_affix_id: number;
  _unknown_data: {
    b0_3?: Uint8Array;
    b5_10?: Uint8Array;
    b12?: Uint8Array;
    b14_15?: Uint8Array;
    b18_20?: Uint8Array;
    b23?: Uint8Array;
    b25?: Uint8Array;
    b27_31?: Uint8Array;
    plist_flag?: number;
  };
  rare_name_id: number;
  rare_name_id2: number;
  displayed_magic_attributes: IMagicProperty[];
  displayed_runeword_attributes: IMagicProperty[];
  displayed_socketed_attributes: IMagicProperty[];
  displayed_combined_magic_attributes: IMagicProperty[];
}

export interface IWeaponDamage {
  mindam: number;
  maxdam: number;
  twohandmindam: number;
  twohandmaxdam: number;
}

export interface IEarAttributes {
  class: number;
  level: number;
  name: string;
}

export interface IMagicProperty {
  id: number;
  name: string;
  values: number[];
  description: string;
  visible: boolean;
  op_value: number;
  op_stats?: string[];
  condition?: string; // Used for socketable to tell which base gives which property
}

export enum EStashType {
  shared,
  private,
}

export interface IStash {
  version: string;
  type: EStashType;
  pageCount: number;
  sharedGold: number;
  hardcore: boolean;
  pages: IStashPage[];
}

export interface IStashPage {
  name: string;
  type: number;
  items: IItem[];
}

export enum EItemQuality {
  normal,
  exceptional,
  elite,
}

export enum EAltPositionId {
  Inventory = 1,
  Cube = 4,
  Stash = 5,
}

export enum ELocationId {
  Stored = 0,
  Equipped = 1,
  Belt = 2,
  Cursor = 4,
  Socketed = 6,
}

export enum EEquippedId {
  Stored = 0,
  Helm = 1,
  Amulet = 2,
  Armor = 3,
  RightHand = 4,
  LeftHand = 5,
  RightRing = 6,
  LeftRing = 7,
  Belt = 8,
  Boots = 9,
  Gloves = 10,
  RightHandSwitch = 11,
  LeftHandSwitch = 12,
  Unknown1 = 13,
  Unknown2 = 14,
}

export enum ETypeId {
  Armor = 0x01,
  Shield = 0x02, //treated the same as armor... only here to be able to parse nokkas jsons
  Weapon = 0x03,
  Other = 0x04,
}

export enum EQuality { // TODO naming convention EQuality
  Low = 0x01,
  Normal = 0x02,
  Superior = 0x03,
  Magic = 0x04,
  Set = 0x05,
  Rare = 0x06,
  Unique = 0x07,
  Crafted = 0x08,
}

export enum EGemPosition {
  Weapon = 'weapon',
  Helm = 'helm',
  Shield = 'shield',
}

export interface IGemMod {
  code?: string; // Gem identifier - Backward compatibility: missing from v96-97 vanilla constants
  type?: EGemPosition; // Backward compatibility: missing from v96-97 vanilla constants
  m: string; // Property identifier
  p: number; // Additional param besides min & max (usually cold/poison length)
  min: number;
  max: number;
}

export type GemModList = IGemMod[];

export type GemMods = [GemModList, GemModList, GemModList];
