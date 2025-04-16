// 方式一
// function deployFunction(){
//     console.log("this is a deploy function")
// }

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

    // 部署合约
    await deploy("FundMe",{
        from : firstAccount,
        args:[20],
        log:true
    })
}

module.exports.tags = ["all","fundMe"]


