import { expect /*, should*/ } from "chai";
import { read, write } from "../../src/d2/stash";
import * as path from "path";
import * as fs from "fs";

describe("stash", () => {
  it("should read D2R shared stash file", async () => {
    const buffer = fs.readFileSync(path.join(__dirname, `../../examples/stash/SharedStashSoftCoreV2.d2i`));
    const jsonData = await read(buffer, "vanilla");
    expect(jsonData.pageCount, "pageCount").to.eq(3);
    expect(jsonData.sharedGold, "sharedGold").to.eq(2500000);
    expect(jsonData.version, "version").to.eq("98");
  });

  it("should write D2R shared stash file", async () => {
    const buffer = fs.readFileSync(path.join(__dirname, `../../examples/stash/SharedStashSoftCoreV2.d2i`));
    const jsonData = await read(buffer, "vanilla");

    const savedBytes = await write(jsonData, "vanilla", 0x62);

    expect(buffer.compare(savedBytes)).to.eq(0);
  });

  it("should read D2R shared stash file, with version autodetection", async () => {
    const buffer = fs.readFileSync(path.join(__dirname, `../../examples/stash/SharedStashSoftCoreV2_0x63.d2i`));
    const jsonData = await read(buffer, "vanilla"); // Should read as version 99
    const savedBytes = await write(jsonData, "vanilla", 0x63);
    const savedJsonData = await read(savedBytes, "vanilla"); // Should read as version 99
    //fs.writeFile("jsonData.txt", JSON.stringify(jsonData, null, 4), (err) => console.error(err));
    //fs.writeFile("savedJsonData.txt", JSON.stringify(savedJsonData, null, 4), (err) => console.error(err));
    expect(jsonData).to.deep.eq(savedJsonData);
  });

  it("should read plugy shared stash file", async () => {
    const buffer = fs.readFileSync(path.join(__dirname, `../../examples/stash/_LOD_SharedStashSave.sss`));
    const jsonData = await read(buffer, "vanilla");

    expect(jsonData.pageCount, "pageCount").to.eq(145);
    expect(jsonData.sharedGold, "sharedGold").to.eq(5912844);
    expect(jsonData.version, "version").to.eq("02");
  });

  it("should provide read and write consistency for plugy shared stash file", async () => {
    const buffer = fs.readFileSync(path.join(__dirname, `../../examples/stash/_LOD_SharedStashSave.sss`));
    const jsonData = await read(buffer, "vanilla");
    const newBuffer = await write(jsonData, "vanilla", 0x60);
    const newJson = await read(newBuffer, "vanilla");

    expect(buffer.length, "file size").to.eq(newBuffer.length);
    expect(newJson, "json").to.deep.eq(jsonData);
  });

  it("should read plugy private stash file", async () => {
    const buffer = fs.readFileSync(path.join(__dirname, `../../examples/stash/PrivateStash.d2x`));
    const jsonData = await read(buffer, "vanilla");
    expect(jsonData.pageCount, "pageCount").to.eq(56);
    expect(jsonData.sharedGold, "sharedGold").to.eq(0);
    expect(jsonData.version, "version").to.eq("01");
  });

  it("should provide read and write consistency for plugy private stash file", async () => {
    const buffer = fs.readFileSync(path.join(__dirname, `../../examples/stash/PrivateStash.d2x`));
    const jsonData = await read(buffer, "vanilla");
    const newBuffer = await write(jsonData, "vanilla", 0x60);
    const newJson = await read(newBuffer, "vanilla");

    expect(buffer.length, "file size").to.eq(newBuffer.length);
    expect(newJson, "json").to.deep.eq(jsonData);
  });
});
