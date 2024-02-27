const express = require("express");
const serverless = require("serverless-http");
const thirdweb = require('web3');
const rcp = `https://bsc-dataseed.binance.org/`;

const app = express();
const router = express.Router();

const PRIVATE_KEY = process.env.PRIVATE_KEY;

router.get('/', (req,res) => {
    res.json({
        'Hello!': 'welcome to API'
    });
});

router.get('/createtx/:from/:data', async (req, res) => {
    const from = req.params.from;
    const data = req.params.data;
    let web3string = '';

    try {
        let web3 = new thirdweb.Web3(rcp);
        await web3.eth.net.isListening();
        web3string = 'connected';
    } catch (error) {
        web3string = 'error:' + error;
    }

    res.json({
        'from': from,
        'data': data,
        'privatekey': PRIVATE_KEY,
        'rcp': rcp,
        'web3': web3string
    });
});

app.use('/.netlify/functions/api', router);

module.exports = app;
module.exports.handler = serverless(app);