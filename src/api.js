const express = require('express');
const serverless = require('serverless-http');
const Web3 = require('web3');

const app = express();
const router = express.Router();

const PKEY = process.env.PRIVATE_KEY;

router.get('/', (req,res) => {
    res.json({
        'Hello!': 'welcome to API'
    });
});

router.get('/pkey', (req,res) => {
    const web3 = new Web3(`https://bsc-dataseed.binance.org/`);
    res.json({
        'Hello!': 'welcome to PKEY is ' + PKEY,
        'Web3' : web3
    });
});

app.use('/.netlify/functions/api', router);

module.exports = app;
module.exports.handler = serverless(app);