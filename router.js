const Web3 = require('web3');
const Router = require('@koa/router');
const config = require('./config.json');
const web3 = new Web3(process.env.INFURA_URL);
web3.eth.accounts.wallet.add(process.env.PRIVATE_KEY)
const adminAddress = web3.eth.accounts.wallet[0];
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
router.get('/tokenBalance/:cToken/:address', async (ctx) => {
    const cToken = cTokens[ctx.params.cToken];
    if(typeof cToken === 'undefined') {
      ctx.status = 400;
      ctx.body = {
        error: `cToken ${ctx.params.cToken} does not exist`
      };
      return;
    }
  
    try {
      const tokenBalance = await cToken
        .methods
        .balanceOfUnderlying(ctx.params.address)
        .call();
      ctx.body = {
        cToken: ctx.params.cToken,
        address: ctx.params.address,
        tokenBalance
      };
    } catch(e) {
      console.log(e);
      ctx.status = 500;
      ctx.body = {
        error: 'internal server error'
      };
    }
  });
  router.get('/ctokenBalance/:cToken/:address', async (ctx) => {
    const cToken = cTokens[ctx.params.cToken];
    if(typeof cToken === 'undefined') {
      ctx.status = 400;
      ctx.body = {
        error: `cToken ${ctx.params.cToken} does not exist`
      };
      return;
    }
  
    try {
      const ctokenBalance = await cToken
        .methods
        .balanceOf(ctx.params.address)
        .call();
      ctx.body = {
        cToken: ctx.params.cToken,
        address: ctx.params.address,
        ctokenBalance
      };
    } catch(e) {
      console.log(e);
      ctx.status = 500;
      ctx.body = {
        error  : 'internal server error'
      };
    }
  });

  router.post('/mint/:cToken/:amount', async (ctx) => {
    const cToken = cTokens[ctx.params.cToken];
    if(typeof cToken === 'undefined') {
      ctx.status = 400;
      ctx.body = {
        error: `cToken ${ctx.params.cToken} does not exist`
      };
      return;
    }

    // get address of erc20 token 
    const tokenAdress = await cToken
        .methods
        .underlying()
        .call();
        const token = new web3.eth.Contract(
            config.ERC20Abi,
            tokenAdress
        )
        await token
            .methods
            .approve(cToken.options.address, ctx.params.amount)
            .send({from: adminAddress});
  
    try {
        await cToken
        .methods
        .mint(ctx.params.amount)
        .send({from: adminAddress});
      ctx.body = {
        cToken: ctx.params.cToken,
        address: adminAddress,
        amountMinted: ctx.params.amount
      };
    } catch(e) {
      console.log(e);
      ctx.status = 500;
      ctx.body = {
        error: 'internal server error'
      };
    }
  });

  router.post('/redeem/:cToken/:amount', async (ctx) => {
    const cToken = cTokens[ctx.params.cToken];
    if(typeof cToken === 'undefined') {
      ctx.status = 400;
      ctx.body = {
        error: `cToken ${ctx.params.cToken} does not exist`
      };
      return;
    }
    try {
        await cToken
        .methods
        .redeem(ctx.params.amount)
        .send({from: adminAddress});
      ctx.body = {
        cToken: ctx.params.cToken,
        address: adminAddress,
        amountRedeemed: ctx.params.amount
      };
    } catch(e) {
      console.log(e);
      ctx.status = 500;
      ctx.body = {
        error: 'internal server error'
      };
    }
  });

router.get('/', ctx => {
    ctx.body = 'hello world, feel free to connect a front end on this api if you would like'
})


module.exports = router;