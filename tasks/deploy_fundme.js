// 导入task
const { task } = require("hardhat/config")

//定义task名称和task逻辑
task("deploy-fundme","deploy and verify contract").setAction(async (taskArgs,hre) => {
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
        constructorArguments: [100],
    });
    }else{
        console.log("skip verify")
    }
})


//导出task
module.exports = {}