const { ethers, getNamedAccounts } = require("hardhat")
const { assert, expect } = require("chai")
const helpers = require("@nomicfoundation/hardhat-network-helpers")
const {developmentChains} = require("../../helper-hardhat-config")


!developmentChains.includes(network.name)
? describe.skip
: describe("test fundme contract",async function(){
    let firstAccount
    let fundMe 
    let mockV3Aggregator

    beforeEach(async function() {
        await deployments.fixture(["all"])
        firstAccount = (await getNamedAccounts()).firstAccount
        const fundMeDeployment = await deployments.get("FundMe")
        mockV3Aggregator = await deployments.get("MockV3Aggregator")
        fundMe = await ethers.getContractAt("FundMe",fundMeDeployment.address)
    })

    // 单元测试
    it("test if owner is msg.sender"),async function(){
        // // 获取配置中的owner地址
        // const [ firstAccount] = await ethers.getSigners()
        // const fundMeFactory = await ethers.getContractFactory("FundMe")
        
        // // 这行代码只表示部署合约的请求发送完成
        // const fundMe = await fundMeFactory.deploy(10)

        // //等待几个区块
        // await fundMe.waitForDeployment()

        assert.equal((await fundMe.owner()),firstAccount)
    }

    it("test if the datafeed is assigned correctly", async function(){
        // const fundMeFactory = await ethers.getContractFactory("FundMe")
        // const fundMe = await fundMeFactory.deploy(10)
        // await fundMe.waitForDeployment()
        assert.equal(mockV3Aggregator.address,await fundMe.dataFeed())
    })

    it("window closed,value greater than minimum,fund failed",
        async function(){
            await helpers.time.increase(200)
            await helpers.mine()
            expect(fundMe.fundMe({value:ethers.parseEther("0.1")}))
                .to.be.revertedWith("window is closed")
        }
    )
})