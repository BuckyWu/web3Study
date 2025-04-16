// import ether.js;
// create main function:获取合约进行部署
// 执行函数
require("dotenv").config()
const {ethers} = require("hardhat")

async function main() {
    //create factory
    const fundMeFactory = await ethers.getContractFactory("FundMe")

    console.log("contract deploying")
    //deploye contract from factory 
    const fundMe = await fundMeFactory.deploy(100)

    // 等待部署的结果
    await fundMe.waitForDeployment() 
                                                                                                                                                                                                                                                                                                                                          
    console.log(`contract has been deployed successfully, contract address is ${fundMe.target}`)

    if(hre.network.config.chainId == 11155111 && process.env.API_KEY){
        //部署脚本时对合约进行验证
        console.log("waiting for 5 confirmations")
        await fundMe.deploymentTransaction().wait(5);
        await hre.run("verify:verify", {
        address: fundMe.target,
        constructorArguments: [10],
      });
    }else{
        console.log("skip verify")
    }
                                                                                                                                                           
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
}

main().then().catch((error) => {
    console.error(error)
    process.exit(0)
})