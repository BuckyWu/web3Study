// 方式一
// function deployFunction(){
//     console.log("this is a deploy function")
// }

const { network } = require("hardhat");
const {developmentChains,networkConfig,LOCK_TIME,CONFIRMATION} = require("../helper-hardhat-config")

// module.exports.default = deployFunction

//方式二：匿名函数
// module.exports.default = async () => {
//     console.log("this is a deploy function")
// }


// module.exports = async (hre) => {
//     const getNamedAccounts = hre.getNamedAccounts
//     const deployments = hre.deployments
//     console.log(getNamedAccounts)
//     console.log(deployments)
// }

module.exports = async({getNamedAccounts,deployments}) => {
    const {firstAccount} = await getNamedAccounts()
    // 两种方式等价
    // const {deploy} = deployments
    const deploy = deployments.deploy

    // const feedbackAddr = await deployments.get("MockV3Aggregator")
    let feedbackAddr;
    let confirmation;

    if(developmentChains.includes(network.name)){
        const mock3 = await deployments.get("MockV3Aggregator")
        feedbackAddr = mock3.address
        confirmation = 0;
    }else{
        feedbackAddr = networkConfig[network.config.chainId].ethUsdDataFeed
        confirmation = CONFIRMATION
    }
    console.log(`datafeedaddr is ${feedbackAddr}`)

    // 部署合约
    const fundMe = await deploy("FundMe",{
        from : firstAccount,
        args:[LOCK_TIME,feedbackAddr],
        log:true,
        waitConfirmations:confirmation
    })

    if(hre.network.config.chainId == 11155111 && process.env.API_KEY){
        //部署脚本时对合约进行验证
        await hre.run("verify:verify", {
            address: fundMe.address,
            constructorArguments: [LOCK_TIME,feedbackAddr]
        });
    }else{
        console.log("network is not sepolia,verification skipped....")
    }
}

module.exports.tags = ["all","fundMe"]


