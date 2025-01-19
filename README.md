### TODO
- Unsocket all: move socketed items to inv instead of deleting it? or other button ?
- When editing socketed jewel, socket stats is not updated properly
- Editor for shared stash ?
- Button to paste 5x or 10x ?
- Consistency check: Can't paste a 2nd time same unique misc item
- Skipped bytes: rewrite same value as read
- replace const constants = window[`${window.work_mod}_constants_${window.work_version}`] by calls to getConstantData with version string/number attention
- On setting a quest, enabling town wp for this act?
- On complete all act quests set introduced/complete too
- char.item_bonuses: filter out misc/inventory except charms. Check socketed attributes are properly considered.
- Skill sorting, grouping per tree
- Char & merc: display the complete/merged list of stats, enhancePlayerAttributes
- Update versions. With later node version minimatch can be replaced by path.MatchesGlob
- To convert sp to mp: handle exception item by item, so just erase the impossible items from save (not editor)
- Holiday Barrage skill ID in SP.
- Char read: do not skip/loose data on read, just copy/paste it on write
- Drag&drop: often can't drop at a position
- Grouping min&max properly
- Paste in socketed
- Double click on cube & not all grids = opens cube grid ?
- Matriarchal javelins quantity issue?
- HC: add dead edit button
- If not a runeword, buttons to unsocket 1 only.
- Drag to socket in ?
- Drag to swap items
- When selecting an inv item, then a socketed equipped item, then reclicking it, it goes back to the inv item?
- According to this site, there is a "Broken" field in unknown item data (https://github.com/WalterCouto/D2CE/blob/main/d2s_File_Format.md#single-item-layout)
- Ear: fill tooltip, add edit inputs
- Organs/herbs/flags: if timestamp, display edit input for time/timestamp
- HeroEditor: add buttons reset all stats / reset all skills
- Drag issue when socketed
- Base options: 2 groups (norm/excep/elite, others). Maybe add precision of difficulty for each option ?
- Weapon dmg in tooltip: doesn't reflex %ed, +min, +max, +flat, etc..
- Consistency: runewords can't get customized ? (only in old d2 versions?)
- ItemStatEditor: min/max values, check encode cases
- ItemEditor: ethereal checkbox not visible for misc
- Make a ReMoDDeD item pack for item creation
- Waypoints per game mod
- Complete all Q: do not use Larzuk Q, reset stats/skills Q, imbue Q, personalize Q
- Button to add an item in socket
- d2s update dependencies but careful mocha & chai & esm/commonjs
- store vuex + move window.work_mod there for watching
- Selected item: color it like on hover.
- memoize
- Editor: create new chars from v99, not 97
- Attribute 270 - cheatcheck
- Item tooltip not always properly updated, displays 1 as attr value
- in constants get full set magical_attributes, add set items in \_allAttributes, finish enhancePlayerAttributes
- quests: better states management. Readme, D:\Games\Diablo II\D2Bot-with-Kolbot\Basic-Blizzhacker-and-Autosmurf-plugin\trunk\d2bs\kolbot\D2BotBlank.dbj
- Select classskill update choices on class change
- drag&drop between item UIs & for merc
- In the constant data "properties" (used to group attributes), remove/fix changed attributes

### d2s

![](https://github.com/Ricola3D/d2s/workflows/.github/workflows/release.yml/badge.svg)

The goal of this project is to create an es6 compliant reader/writer of Diablo II save files. Additionally, the library should be able to consume files generated by nokka's Go implementation [d2s](https://github.com/nokka/d2s), therefore the output of reading a save will closely mirror the Go's output.

##### Examples

- [Viewer](https://Ricola3D.github.io/d2s/) [[Source](public/index.html)]
- [Editor](https://d2s.Ricola3D.dev/) [[Source](https://github.com/Ricola3D/d2s-editor)]

Using [d2s-ui](https://github.com/Ricola3D/d2s-ui) for a frontend:

- https://diablo.dannyschumacher.com/#/
- https://resurgence.dannyschumacher.com/#/

##### API/General Usage

```typescript
/**
 * @see constants.bundle.min.js for an already parsed version of 1.13c data
 * @param buffers: object of ALL txt files. example: {
 *  "ItemStatCost.txt": "Stat\tIDt\Send...",
 *  "string.txt": "WarrivAct1IntroGossip1\t45}Greetings,...",
 *  ...
 * }
 * @return constants: constant data required for parsing built from the txt files.
 **/
function readConstantData(buffers: any): types.IConstantData;

/**
 * @param buffer: Uint8Array representation of the file
 * @param mod: the mod of the input file. Currently only support "vanilla" and "remodded".
 * @param userConfig: optional configuration. used for if there is a dll edit to allow larger stash sizes. example: {
 *  extendedStash: true
 * }
 * @return d2s: the parsed save information
 **/
function read(buffer: Uint8Array, mod: string, userConfig?: types.IConfig): Promise<types.ID2S>;

/**
 * @param d2s: the parsed save information
 * @param mod: the mod of the input file. Currently only support "vanilla" and "remodded".
 * @param version: the version to export. 99 is currently the latest D2R, and 96 is the latest D2LOD. ReMoDDeD only supports 99 for now.
 * @param userConfig: optional configuration. used for if there is a dll edit to allow larger stash sizes. example: {
 *  extendedStash: true
 * }
 * @return buffer: Uint8Array representation of the file
 **/
function write(data: types.ID2S, mod: string, version: number, userConfig?: types.IConfig): Promise<Uint8Array>;
```

##### Useful Links:

- https://github.com/WalterCouto/D2CE/blob/main/d2s_File_Format.md#versions
- https://github.com/d07RiV/d07riv.github.io/blob/master/d2r.html (credits to d07riv for reversing the item code on D2R)
- https://github.com/Ricola3D/D2SLib (c# version of this library)
- https://github.com/nokka/d2s (go d2s parser)
- https://github.com/krisives/d2s-format
- http://paul.siramy.free.fr/d2ref/eng/
- http://user.xmission.com/~trevin/DiabloIIv1.09_File_Format.shtml
- https://github.com/nickshanks/Alkor
- https://github.com/HarpyWar/d2s-character-editor
