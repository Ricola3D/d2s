//todo define types for these
export interface IConfig {
  extendedStash?: boolean;
  sortProperties?: boolean;
}

export interface IConstantData {
  classes: any[];
  skills: any[];
  magic_prefixes: any[];
  magic_suffixes: any[];
  rare_names: any[];
  armor_items: any;
  weapon_items: any;
  other_items: any;
  stackables: any;
  properties: any;
  magical_properties: any[];
  runewords: any[];
  set_items: any[];
  unq_items: any[];
}

export interface ID2S {
  header: IHeader;
  attributes: IAttributes;
  item_bonuses: IMagicProperty[];
  displayed_item_bonuses: IMagicProperty[];
  skills: ISkill[]; //Skill
  items: IItem[]; //Item
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

export interface IActIQuests {
  introduced: boolean;
  den_of_evil: IQuest;
  sisters_burial_grounds: IQuest;
  tools_of_the_trade: IQuest;
  the_search_for_cain: IQuest;
  the_forgotten_tower: IQuest;
  sisters_to_the_slaughter: IQuest;
  completed: boolean;
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

export interface IActIIQuests {
  introduced: boolean;
  radaments_lair: IQuest;
  the_horadric_staff: IQuest;
  tainted_sun: IQuest;
  arcane_sanctuary: IQuest;
  the_summoner: IQuest;
  the_seven_tombs: IQuest;
  completed: boolean;
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

export interface IActIIIQuests {
  introduced: boolean;
  lam_esens_tome: IQuest;
  khalims_will: IQuest;
  blade_of_the_old_religion: IQuest;
  the_golden_bird: IQuest;
  the_blackened_temple: IQuest;
  the_guardian: IQuest;
  completed: boolean;
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

export interface IActIVQuests {
  introduced: boolean;
  the_fallen_angel: IQuest;
  terrors_end: IQuest;
  hellforge: IQuest;
  completed: boolean;
}

export interface IActIVWaypoints {
  the_pandemonium_fortress: boolean;
  city_of_the_damned: boolean;
  river_of_flame: boolean;
}

export interface IActVQuests {
  introduced: boolean;
  siege_on_harrogath: IQuest;
  rescue_on_mount_arreat: IQuest;
  prison_of_ice: IQuest;
  betrayal_of_harrogath: IQuest;
  rite_of_passage: IQuest;
  eve_of_destruction: IQuest;
  completed: boolean;
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
}

export interface IWaypoints {
  act_i: IActIWaypoints;
  act_ii: IActIIWaypoints;
  act_iii: IActIIIWaypoints;
  act_iv: IActIVWaypoints;
  act_v: IActVWaypoints;
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
  checksum: string;
  name: string;
  status: IStatus;
  class: string;
  created: number;
  last_played: number;
  menu_appearance: ICharMenuAppearance;
  left_skill: string;
  right_skill: string;
  left_swap_skill: string;
  right_swap_skill: string;
  merc_id: string;
  assigned_skills: string[];
  quests_normal: IQuests;
  quests_nm: IQuests;
  quests_hell: IQuests;
  waypoints: IWaypointData;
  npcs: INPCData;
  version: number;
  filesize: number;
  active_arms: number;
  progression: number;
  level: number;
  difficulty: IDifficulty;
  map_id: number;
  dead_merc: number;
  merc_name_id: number;
  merc_type: number;
  merc_experience: number;
}

export interface IStatus {
  expansion: boolean;
  died: boolean;
  hardcore: boolean;
  ladder: boolean;
}

export interface ISkill {
  id: number;
  points: number;
  name: string;
}

export interface IItem {
  identified: number;
  socketed: number; // 1: has sockets
  max_sockets: number;
  new: number;
  is_ear: number;
  starter_item: number;
  simple_item: number;
  ethereal: number; //1: ethereal
  personalized: number;
  personalized_name: string;
  given_runeword: number; // 1: is a runeword
  version: string;
  location_id: number; // 0: stored, 1: equipped, 2: belt, 4: cursor, 6: socketed
  equipped_id: number; // 0: stored, 1: helm, 2: amulet, 3: armor, 4: right-hand, 5: left-hand, 6: right ring, 7: left ring, 8: belt, 9: boots, 10: gloves, 11: right-hand switch, 12: left-hand switch
  position_x: number; // 0-indexed column, from left to right
  position_y: number; // 0-indexed row, from top to bottom
  alt_position_id: number; // 1: inventory, 4: cube, 5: stash
  type: string; // 4 characters code
  type_id: number; // 0:undefined, 1: armor, 2: shield, 3: weapon, 4: other
  type_name: string; // Type en-US name
  quest_difficulty: number;
  nr_of_items_in_sockets: number; // Number of socketed items
  id: number; // Uint32 identifier
  level: number;
  quality: number; // 0:undefined, 1: low, 2: normal, 3: superior, 4: magic, 5: set, 6: rare, 7: unique, 8: crafted
  multiple_pictures: number; // 1: has multiple skins
  picture_id: number; // current skin index
  class_specific: number;
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
  op_stats: string[];
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

export enum IItemAltPosition {
  Inventory = 1,
  Cube = 4,
  Stash = 5,
}

export enum EItemLocation {
  Stored = 0,
  Equipped = 1,
  Belt = 2,
  Cursor = 4,
  Socketed = 6,
}

export enum EItemEquipPosition {
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
}

export enum ItemType {
  Armor = 0x01,
  Shield = 0x02, //treated the same as armor... only here to be able to parse nokkas jsons
  Weapon = 0x03,
  Other = 0x04,
}

export enum Quality { // TODO naming convention EQuality
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
  Weapon = "weapon",
  Helm = "helm",
  Shield = "shield",
}

export interface IGemMod {
  code: string; // Gem identifier
  type: EGemPosition;
  m: string; // Property identifier
  p: number; // Additional param besides min & max (usually cold/poison length)
  min: number;
  max: number;
}

export type GemModList = Array<IGemMod>;

export type GemMods = [GemModList, GemModList, GemModList];
