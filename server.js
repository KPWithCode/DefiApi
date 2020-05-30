require('dotenv').config();
process.env.INFURA_URL
const Koa = require('koa');
const app = new Koa();
const router = require('./router.js')

app.use(router.routes())

app.listen(3000);