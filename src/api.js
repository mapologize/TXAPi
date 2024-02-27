const express = require("express");
const serverless = require("serverless-http");
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed.binance.org/"));

const app = express();
const router = express.Router();

const PRIVATE_KEY = process.env.PRIVATE_KEY;

router.get('/', (req,res) => {
    res.json({
        'Hello!': 'welcome to API'
    });
});

router.get('/pkey', async (req, res) => {
    try {
        res.json({
            'Hello!': 'Welcome to PKEY : ' + PRIVATE_KEY,
            'Web3': {
                version: web3.version
            }
        });
    } catch (error) {
        console.error('Error in /pkey route:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.use('/.netlify/functions/api', router);

module.exports = app;
module.exports.handler = serverless(app);