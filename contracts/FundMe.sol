// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";


contract FundMe{

    mapping(address => uint256) public fundToAmount;

    uint constant MIN_AMOUNT = 1 * 10 ** 16;  // 10^18 wei = 1 ether

    AggregatorV3Interface internal dataFeed;

    uint256 constant TARGET = 2 * 10 ** 16; 

    address public owner;

    uint256 deploymentTimestamp;

    uint256 locktime;

    address erc20Addr;

    bool public getFundSuccess = false;

    constructor(uint _locktime){
        dataFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
        owner = msg.sender;
        deploymentTimestamp = block.timestamp; // 时间戳 单位为s
        locktime = _locktime;
    }

    // payable 表示一个可以支付的函数
    function fundMe() external payable {
        require(convertEthToUSD(msg.value) >= MIN_AMOUNT,"send more eth");
        // require(block.timestamp < deploymentTimestamp + locktime, "windows is close");
        fundToAmount[msg.sender] = msg.value;
    }

    /**
     * Returns the latest answer.
     */
    function getChainlinkDataFeedLatestAnswer() public view returns (int) {
        // prettier-ignore
        (
            /* uint80 roundId */,
            int256 answer,
            /*uint256 startedAt*/,
            /*uint256 updatedAt*/,
            /*uint80 answeredInRound*/
        ) = dataFeed.latestRoundData();
        return answer;
    }

    // ethamount的单位是wei   ethPrice的单位是10^8 USD / ETH
    // (wei * 10^8 USD / ETH )  / (10 ^ 18 wei / ETH)   单位是 10^8 usd / 10 ^ 18
    // 10 ^ 8 是chainlink在设计时会扩大这个倍数满足精度需求，所以要除以这个数得到真实值
    // 分母的10 ^ 18 在这个过程中没有计算所以相当于扩大了10 ^ 18，因此在比较时右边也需要扩大相应倍数才对，所以最小值 目标值都乘以这个数
    function convertEthToUSD(uint ethAmount) internal  view returns (uint256){
        uint256 ethPrice = uint256(getChainlinkDataFeedLatestAnswer());
        return ethAmount * ethPrice / (10 ** 8);
    }

    // owner的转换
    function transferOwnership(address newOwner) public ownership{
        owner = newOwner;
    }

    // 转账的三种方式
    // transfer 纯转账 转账如果失败就会回滚 transfer eth and revert if tx failed
    // send  纯转账  成功return true 失败return false
    // call  转账过程中调用函数或写数据，也可以纯转账 transfer eth with data return value of function and bool
    // function getFund() external windowClosed ownership{
    function getFund() external {
        // require(convertEthToUSD(address(this).balance) >= TARGET, "Target is not reached");
        // payable (msg.sender).transfer(address(this).balance); 
        //bool success = payable (msg.sender).send(address(this).balance);
        bool success;
        (success,) = payable (msg.sender).call{value:address(this).balance}("");
        require(success, "transfer tx failed");
        fundToAmount[msg.sender] = 0;
        getFundSuccess = true; // flag
    }

    function refund() external windowClosed{
        require(convertEthToUSD(address(this).balance) < TARGET, "Target is reached");
        require(fundToAmount[msg.sender] != 0, "there is no fund for you");
        bool success;
        (success, ) = payable(msg.sender).call{value: fundToAmount[msg.sender]}("");
        require(success, "transfer tx failed");
        fundToAmount[msg.sender] = 0;
    }

    
    //暴露方法给外部去修改mapping 这个方法只能ERC20通证合约去调用
    function setNameAndSymbol(address funder, uint amountToUpdate) external{
        require(msg.sender == owner,"only owner can do this");
        fundToAmount[funder] = amountToUpdate;  
    }

    function setErc20Address(address _erc20Addr ) public ownership{
        erc20Addr = _erc20Addr ;
    } 

    //修改器
    modifier windowClosed(){
        require(block.timestamp >= deploymentTimestamp + locktime, "windows is close");
        _; // 指的是函数体的执行顺序 若放在require则先执行方法体
    }

    modifier ownership(){
        require (msg.sender == owner, "this function can only be called by owner");
        _; // 指的是函数体的执行顺序 若放在require则先执行方法体
    }

}