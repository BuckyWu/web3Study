const { task } = require("hardhat/config")


// 名称 ， 描述
task("interact-fundme","interact contract")
    .addParam("addr","fundMe contract address")
    .setAction(async(taskArgs,hre) => {
        const fundMeFactory = await ethers.getContractFactory("FundMe")
        const fundMe = fundMeFactory.attach(taskArgs.addr)  //把合约地址贴到这个地方

        // 合约交互
        // init 2 accounts
        const [firstAccount, secondAccount] = await ethers.getSigners()  //获取绑定的账户                 
        
        // fund contract with first account
        const fundTx = await fundMe.fundMe({value: ethers.parseEther("0.5")})  //默认使用的是第一个账户
        await fundTx.wait()
                                                                                                                                                                                                                                                                                                                                                                                                                                                 
        console.log(`2 accounts are ${firstAccount.address} and ${secondAccount.address}`)
        
        // check balance of contract
        const balanceOfContract = await ethers.provider.getBalance(fundMe.target)
        console.log(`Balance of the contract is ${balanceOfContract}`)
    
        // fund contract with second account
        const fundTxWithSecondAccount = await fundMe.connect(secondAccount).fundMe({value: ethers.parseEther("0.5")})
        await fundTxWithSecondAccount.wait()
    
        // check balance of contract
        const balanceOfContractAfterSecondFund = await ethers.provider.getBalance(fundMe.target)
        console.log(`Balance of the contract is ${balanceOfContractAfterSecondFund}`)
    
        // check mapping 
        const firstAccountbalanceInFundMe = await fundMe.fundToAmount(firstAccount.address)
        const secondAccountbalanceInFundMe = await fundMe.fundToAmount(secondAccount.address)
        console.log(`Balance of first account ${firstAccount.address} is ${firstAccountbalanceInFundMe}`)
        console.log(`Balance of second account ${secondAccount.address} is ${secondAccountbalanceInFundMe}`)
    
        // 提取
        const lalal = await fundMe.getFund()
        console.log(lalal)
})

module.exports = {}
