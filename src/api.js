const express = require("express");
const serverless = require("serverless-http");
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("https://polygon-rpc.com"));

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
    try {
        res.json({
            'from': from,
            'data': data,
            'privatekey': PRIVATE_KEY
        });
    } catch (error) {
        console.error('Error in /pkey route:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.use('/.netlify/functions/api', router);

module.exports = app;
module.exports.handler = serverless(app);