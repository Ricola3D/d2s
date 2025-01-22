import { expect /*, should*/ } from 'chai';
import { read, write } from '../../src/d2/stash';
import * as path from 'path';
import * as fs from 'fs';

describe('stash', () => {
  it('should read D2R shared stash file', async () => {
    const inputBuffer = fs.readFileSync(path.join(__dirname, `../../examples/stash/SharedStashSoftCoreV2.d2i`));
    const inputJson = await read(inputBuffer, 'vanilla');
    expect(inputJson.pageCount, 'pageCount').to.eq(3);
    expect(inputJson.sharedGold, 'sharedGold').to.eq(2500000);
    expect(inputJson.version, 'version').to.eq('98');
  });

  it('should write D2R shared stash file', async () => {
    const inputBuffer = fs.readFileSync(path.join(__dirname, `../../examples/stash/SharedStashSoftCoreV2.d2i`));
    const jsonData = await read(inputBuffer, 'vanilla');

    const outputBuffer = await write(jsonData, 'vanilla', 0x62);
    expect(inputBuffer.compare(outputBuffer)).to.eq(0);
  });

  it('should read D2R shared stash file, with version autodetection', async () => {
    const inputBuffer = fs.readFileSync(path.join(__dirname, `../../examples/stash/SharedStashSoftCoreV2_0x63.d2i`));
    const inputJson = await read(inputBuffer, 'vanilla'); // Should read as version 99
    const savedBytes = await write(inputJson, 'vanilla', 0x63);
    const savedJsonData = await read(savedBytes, 'vanilla'); // Should read as version 99
    //fs.writeFile("jsonData.txt", JSON.stringify(jsonData, null, 4), (err) => console.error(err));
    //fs.writeFile("savedJsonData.txt", JSON.stringify(savedJsonData, null, 4), (err) => console.error(err));
    expect(inputJson).to.deep.eq(savedJsonData);
  });

  it('should read plugy shared stash file', async () => {
    const inputBuffer = fs.readFileSync(path.join(__dirname, `../../examples/stash/_LOD_SharedStashSave.sss`));
    const inputJson = await read(inputBuffer, 'vanilla');

    expect(inputJson.pageCount, 'pageCount').to.eq(145);
    expect(inputJson.sharedGold, 'sharedGold').to.eq(5912844);
    expect(inputJson.version, 'version').to.eq('02');
  });

  it('should provide read and write consistency for plugy shared stash file', async () => {
    const inputBuffer = fs.readFileSync(path.join(__dirname, `../../examples/stash/_LOD_SharedStashSave.sss`));
    const inputJson = await read(inputBuffer, 'vanilla');
    await fs.writeFileSync(path.join(__dirname, `../../examples/stash/_LOD_SharedStashSave_in.json`), JSON.stringify(inputJson, null, 2));
    const outputBuffer = await write(inputJson, 'vanilla', 0x60);
    await fs.writeFileSync(path.join(__dirname, `../../examples/stash/_LOD_SharedStashSave_out.sss`), outputBuffer);
    const outputJson = await read(outputBuffer, 'vanilla');
    await fs.writeFileSync(path.join(__dirname, `../../examples/stash/_LOD_SharedStashSave_out.json`), JSON.stringify(outputJson, null, 2));

    expect(inputBuffer.length, 'file size').to.eq(outputBuffer.length);
    expect(outputJson, 'json').to.deep.eq(inputJson);
  });

  it('should read plugy private stash file', async () => {
    const inputBuffer = fs.readFileSync(path.join(__dirname, `../../examples/stash/PrivateStash.d2x`));
    const inputJson = await read(inputBuffer, 'vanilla');
    expect(inputJson.pageCount, 'pageCount').to.eq(56);
    expect(inputJson.sharedGold, 'sharedGold').to.eq(0);
    expect(inputJson.version, 'version').to.eq('01');
  });

  it('should provide read and write consistency for plugy private stash file', async () => {
    const inputBuffer = fs.readFileSync(path.join(__dirname, `../../examples/stash/PrivateStash.d2x`));
    const inputJson = await read(inputBuffer, 'vanilla');
    const outputBuffer = await write(inputJson, 'vanilla', 0x60);
    const outputJson = await read(outputBuffer, 'vanilla');

    expect(inputBuffer.length, 'file size').to.eq(outputBuffer.length);
    expect(outputJson, 'json').to.deep.eq(inputJson);
  });
});
