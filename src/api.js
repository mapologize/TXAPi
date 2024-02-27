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

app.use('/.netlify/functions/api', router);

module.exports = app;
module.exports.handler = serverless(app);