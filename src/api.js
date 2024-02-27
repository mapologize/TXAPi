const express = require('express');
const serverless = require('serverless-http');

const app = express();
const router = express.Router();

router.get('/', (req,res) => {
    //res.setHeader('Access-Control-Allow-Origin', 'https://moomooh.io');
    //res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.json({
        'Hello!': 'welcome to API'
    });
});

router.get('/pkey', (req,res) => {
    //res.setHeader('Access-Control-Allow-Origin', 'https://moomooh.io');
    //res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.json({
        'Hello!': 'welcome to PKEY is' + process.env.PRIVATE_KEY
    });
});

app.use('/.netlify/functions/api', router);

module.exports = app;
module.exports.handler = serverless(app);