const {loadFixture} = require("@nomicfoundation/hardhat-network-helpers");
const { assert } = require("chai");
const { ethers } = require("hardhat");

describe("Proxy", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    const Proxy = await ethers.getContractFactory("Proxy");
    const proxy = await Proxy.deploy();

    const Logic1 = await ethers.getContractFactory("Logic1");
    const logic1 = await Logic1.deploy();

    const Logic2 = await ethers.getContractFactory("Logic2");
    const logic2 = await Logic2.deploy();

    const proxyAsLogic1 = await ethers.getContractAt("Logic1" ,proxy.address );
    const proxyAsLogic2 = await ethers.getContractAt("Logic2" , proxy.address );

    return { proxy, logic1, logic2, proxyAsLogic1, proxyAsLogic2 };
  }
  /*   
  it("Should work with the logic 1", async function () {
        const { proxy, logic1 } = await loadFixture(deployFixture);

        await proxy.changeImplementation(logic1.address);
        assert.equal(await logic1.x(), 0);

        await proxy.changeX(52);
        assert.equal(await logic1.x(), 53);
      });
      
     it("Should work with upgrades", async function () {
      const { proxy, logic1, logic2 } = await loadFixture(deployFixture);

      await proxy.changeImplementation(logic1.address);
      assert.equal(await logic1.x(), 0);
      await proxy.changeX(52);
      assert.equal(await logic1.x(), 53);

      await proxy.changeImplementation(logic2.address);
      assert.equal(await logic2.x(), 0);
      await proxy.changeX(52);
      assert.equal(await logic2.x(), 55);
      }); 
      */

      async function lookUpUint( contracAddr, slot){
        return parseInt(await ethers.provider.getStorageAt(contracAddr,slot)); 
      }

      it("Should work with the logic 1", async function () {
        const { proxy, proxyAsLogic1, logic1 } = await loadFixture(deployFixture);

        await proxy.changeImplementation(logic1.address);
        assert.equal(await lookUpUint(proxy.address, "0x0"), 0);

        await proxyAsLogic1.changeX(52);
        assert.equal(await lookUpUint(proxy.address, "0x0"), 53);
      });

     it("Should work with upgrades", async function () {
      const { proxy, proxyAsLogic1, proxyAsLogic2, logic1, logic2 } = await loadFixture(deployFixture);

      await proxy.changeImplementation(logic1.address);
      assert.equal(await lookUpUint(proxy.address, "0x0"), 0);
      await proxyAsLogic1.changeX(52);
      assert.equal(await lookUpUint(proxy.address, "0x0"), 53);

      await proxy.changeImplementation(logic2.address);
      await proxyAsLogic2.changeX(52);
      assert.equal(await lookUpUint(proxy.address, "0x0"), 55);
      await proxyAsLogic2.tripleX();
      assert.equal(await lookUpUint(proxy.address, "0x0"), 165);
      }); 
});

