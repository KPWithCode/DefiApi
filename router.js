const Web3 = require('web3');
const Router = require('@koa/router');
const config = require('./config.json');
const web3 = new Web3(process.env.INFURA_URL);
const router = new Router(); 


// Web3 instances
const cTokens = {
    cBat: new web3.eth.Contract(
        config.cTokenAbi,
        config.cBatAddress
    ),
    cDai: new web3.eth.Contract(
        config.cTokenAbi,
        config.cDaiAddress
    )
};

router.get('/', ctx => {
    ctx.body = 'hello world'
})
module.exports = router;