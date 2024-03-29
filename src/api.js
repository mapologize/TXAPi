const express = require("express");
const serverless = require("serverless-http");
//const thirdweb = require('web3');
import Web3 from "web3";

const app = express();
const router = express.Router();

const web3jib = new Web3(`https://rpc-l1.jibchain.net`);

const VALIDATEAPI = {
    address: '0xA6177AbcC7A2cac356C15aECDD177F7FeC8c082A',
    abi: [{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"callFunction","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"uint256","name":"gasUsed","type":"uint256"}],"name":"excuteTransaction","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"smartcontract","type":"address"}],"name":"grantAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"revokeAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_reactWallet","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"string","name":"role","type":"string"},{"indexed":false,"internalType":"bool","name":"flag","type":"bool"}],"name":"updateAccountRole","type":"event"},{"inputs":[{"internalType":"address","name":"_reactWallet","type":"address"}],"name":"updateReactWallet","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"string","name":"role","type":"string"},{"internalType":"bool","name":"flag","type":"bool"}],"name":"updateRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"string","name":"role","type":"string"}],"name":"checkRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getAccountGasUsed","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getAccountInfo","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getAccountTxList","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getAllowanedContract","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"messageHash","type":"bytes32"}],"name":"getEthSignedMessageHash","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"string","name":"message","type":"string"}],"name":"getMessageHash","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"ethSignedMessageHash","type":"bytes32"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"recoverSigner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"bytes","name":"sig","type":"bytes"}],"name":"splitSignature","outputs":[{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"},{"internalType":"uint8","name":"v","type":"uint8"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"transactions","outputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"gasUsed","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"uint256","name":"value","type":"uint256"}],"stateMutability":"view","type":"function"}]
}

const privateKey = process.env.PRIVATE_KEY;

const validateApi = new web3jib.eth.Contract(VALIDATEAPI.abi,VALIDATEAPI.address);

router.get('/', (req,res) => {
    res.json({
        'Ok!': 'welcome to API'
    });
});

router.get('/accountInfo/:account', async (req, res) => {
    const account = req.params.account;
    const getAccountInfo = await validateApi.methods.getAccountInfo(account).call();
    res.json({
        'getAccountGasUsed': Number(getAccountInfo[0]),
        'getAccountTxList': getAccountInfo[1],
    });
});

router.get('/tx/:from/:to/:data/:value/:gasUsed/:gasPrice/:signature/:description', async (req, res) => {
    const from = req.params.from;
    const to = req.params.to;
    const data = req.params.data;
    const value = req.params.value;
    const gasUsed = req.params.gasUsed;
    const gasPrice = req.params.gasPrice;
    const signature = req.params.signature;
    const description = req.params.description;

    let txGas = -1;
    try{
        txGas = await validateApi.methods.excuteTransaction(from,to,data,gasUsed).estimateGas({ from: from, value: value });
    }catch{}

    if(txGas>0){
        const getAccountInfo = await validateApi.methods.getAccountInfo(from).call();
        const nonce = Number(getAccountInfo[1].length);
        //const message = `{"description":"${description}","from":"${from}","to":"${to}","data":"${data}","value":${value},"gasUsed":${gasUsed},"nonce":${nonce}}`
        const message = `${description}\n\nfrom:${from}\nto:${to}\nvalue:${value}\ngasUsed:${gasUsed}\ngasPrice:${gasPrice}\nnonce:${nonce}\n\ndata:${data}`
        const recovered = web3jib.eth.accounts.recover(message,signature);
        if(recovered==from){
            const rawTransaction = {
                gasPrice: gasPrice,
                gasLimit: txGas,
                to: VALIDATEAPI.address,
                value: value,
                data: '0x',
            };
            console.log(rawTransaction);
            res.json({
                'success': 'tx was ok!'
            });
            /*const signedTransaction = web3jib.eth.accounts.signTransaction(rawTransaction, privateKey);
            signedTransaction.then(
               res.json({
                    'receipt': 'signedTransaction'
                })
            );
            const receipt = await thirdweb.eth.sendSignedTransaction(signedTransaction.rawTransaction);
            console.log("receipt");*/
        }else{
            res.json({
                'revert': 'failed to verify signature!'
            });
        }
    }else{
        res.json({
            'revert': 'excute function call error!'
        });
    }
});

app.use('/.netlify/functions/api', router);

module.exports = app;
module.exports.handler = serverless(app);