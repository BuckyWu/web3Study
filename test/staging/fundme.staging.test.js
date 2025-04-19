const { ethers, getNamedAccounts, network } = require("hardhat")
const { assert, expect } = require("chai")
const helpers = require("@nomicfoundation/hardhat-network-helpers")
const {developmentChains} = require("../../helper-hardhat-config")

//主要是写一些单元测试中无法覆盖到的测试场景
developmentChains.includes(network.name)
? describe.skip
: describe("test fundme contract",async function(){
    let firstAccount
    let fundMe 

    beforeEach(async function() {
        await deployments.fixture(["all"])
        firstAccount = (await getNamedAccounts()).firstAccount
        const fundMeDeployment = await deployments.get("FundMe")
        fundMe = await ethers.getContractAt("FundMe",fundMeDeployment.address)
    })

    it("fundMe and getFund successfully",async function () {
        // make sure target reached
        await fundMe.fundMe({value : ethers.parseEther("0.1")});
        // make sure window close, in sepolia net,we can not promise the time with helpers anymore
        // so we need write a 定时器
        await new Promise(resolve => setTimeout(resolve, 21 * 1000))
        
        const withdraw = await fundMe.getFund();
        const getFundReceipt = await withdraw.wait(); // 等待交易回执
        //这样只能保证请求发送成功 而不能保证写入块
        // await expect(fundMe.getFund())
        await expect(getFundReceipt)
        .to.be.emit(fundMe,"FundWithdrawByOwner")
        .withArgs(ethers.parseEther("0.1"));
    })
})