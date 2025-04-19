const { network } = require("hardhat")
const {DECIMAL,INITIAL_ANSWER, developmentChains} = require("../helper-hardhat-config")

module.exports = async({getNamedAccounts,deployments}) => {
    if (developmentChains.includes(network.name)){
        const {firstAccount} = await getNamedAccounts()

        // 两种方式等价
        // const {deploy} = deployments
        const deploy = deployments.deploy

        // 部署合约
        await deploy("MockV3Aggregator",{
            from : firstAccount,
            args:[DECIMAL,INITIAL_ANSWER],
            log:true
        })
    }else{
        console.log("network is sepolia,deploy datafeed skipped...")  
    } 
}
module.exports.tags = ["all","mock"]


