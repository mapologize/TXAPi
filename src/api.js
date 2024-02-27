const express = require('express');
const serverless = require('serverless-http');
const Web3 = require('web3');

const app = express();
const router = express.Router();

router.get('/', (req,res) => {
    res.json({
        'Hello!': 'welcome to API'
    });
});

router.get('/pkey', async (req, res) => {
    try {
        const web3 = new Web3('https://bsc-dataseed.binance.org/');
        const networkId = await web3.eth.net.getId();
        const PKEY = process.env.PRIVATE_KEY;

        res.json({
            'Hello!': 'Welcome to PKEY',
            'PKEY': PKEY,
            'Web3': {
                networkId: networkId
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