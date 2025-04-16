const { ethers, getNamedAccounts } = require("hardhat")
const { assert } = require("chai")

describe("test fundme contract",async function(){
    let firstAccount
    let fundMe 

    beforeEach(async function() {
        await deployments.fixture(["all"])
        firstAccount = (await getNamedAccounts()).firstAccount
        const fundMeDeployment = await deployments.get("FundMe")
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
        assert.equal("0x694AA1769357215DE4FAC081bf1f309aDC325306",await fundMe.dataFeed())
    })
})