const web3wallet = new web3walletpack(bsc);
const webutils = new webutilspack();

const provider_jib = new Web3(`https://rpc-l1.jibchain.net`);

const VALIDATEAPI = {
    address: '0xA6177AbcC7A2cac356C15aECDD177F7FeC8c082A',
    abi: [{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"callFunction","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"uint256","name":"gasUsed","type":"uint256"}],"name":"excuteTransaction","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"smartcontract","type":"address"}],"name":"grantAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"revokeAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_reactWallet","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"string","name":"role","type":"string"},{"indexed":false,"internalType":"bool","name":"flag","type":"bool"}],"name":"updateAccountRole","type":"event"},{"inputs":[{"internalType":"address","name":"_reactWallet","type":"address"}],"name":"updateReactWallet","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"string","name":"role","type":"string"},{"internalType":"bool","name":"flag","type":"bool"}],"name":"updateRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"string","name":"role","type":"string"}],"name":"checkRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getAccountGasUsed","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getAccountInfo","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getAccountTxList","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getAllowanedContract","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"messageHash","type":"bytes32"}],"name":"getEthSignedMessageHash","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"string","name":"message","type":"string"}],"name":"getMessageHash","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"ethSignedMessageHash","type":"bytes32"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"recoverSigner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"bytes","name":"sig","type":"bytes"}],"name":"splitSignature","outputs":[{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"},{"internalType":"uint8","name":"v","type":"uint8"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"transactions","outputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"gasUsed","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"uint256","name":"value","type":"uint256"}],"stateMutability":"view","type":"function"}]
}

const validateApi = new provider_jib.eth.Contract(VALIDATEAPI.abi,VALIDATEAPI.address);

async function connectWallet() {
    document.getElementById(`connectBTN`).innerHTML = `<img src="svg/wallet.svg" width="16" height="16"> Request...`;
    await web3wallet.reqChain();
    await web3wallet.reqAccount();
    const accounts = await web3wallet.getAccounts();
    document.getElementById(`connectBTN`).innerHTML = `<img src="svg/wallet.svg" width="16" height="16"> ${web3wallet.shortAddr(accounts[0])}`;
    webutils.setCookie(`connstatus`, `connected`, `365`);
    webutils.activeBTN(`disconnectBTN`, true);
    await update();
}

async function disconnectWallet() {
    document.getElementById(`connectBTN`).innerHTML = `<img src="svg/wallet.svg" width="16" height="16"> Connect Wallet`;
    webutils.setCookie(`connstatus`, `disconnected`, `365`);
    webutils.activeBTN(`disconnectBTN`, false);
}

window.onload = async function () {
    const connstatus = webutils.getCookie(`connstatus`);
    console.log("Connect (Catch) : " + connstatus);
    if (connstatus == `connected`) {
        await connectWallet(`connectBTN`);
    } else {
        await update();
    }
}

async function signMessage() {
    const account = await web3wallet.getCurrentAccount();
    const fetchLink = `https://testapijib.netlify.app/.netlify/functions/api/accountInfo/${account}`;
    await fetch(fetchLink)
    .then(response => {
        if (!response.ok) { throw new Error(`Network response was not ok: ${response.statusText}`); }
        return response.json();
    })
    .then(async result => {
        const gasPrice = await web3wallet.getGasPrice();
        const tx = {
            "description":'test send ETH',
            "from": account,
            "to":'0x0b63b7dd7f54d7b17f01d197d3c0f239f12543c7',
            "data":'0x',
            "value":2000000000000,
            "gasUsed":720000,
            "gasPrice": gasPrice,
            "nonce": result.getAccountTxList.length
        }
        //const message = `{"description":"${tx.description}","from":"${tx.from}","to":"${tx.to}","data":"${tx.data}","value":${tx.value},"gasUsed":${tx.gasUsed},"nonce":${tx.nonce}}`
        const message = `${tx.description}\n\nfrom:${tx.from}\nto:${tx.to}\nvalue:${tx.value}\ngasUsed:${tx.gasUsed}\ngasPrice:${tx.gasPrice}\nnonce:${tx.nonce}\n\ndata:${tx.data}`
        console.log(message);
        await web3.eth.personal.sign(`${message}`, account, '')
        .then(async signed => {
            console.log(signed);
            await createTx(tx,signed);
        })
        .catch(error => {
            console.error('Error On Signed Transaction:', error);
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

async function createTx(tx,signed) {
    const tx = {
        from: from,
        gas: txGas,
        gasPrice: gasPrice,
        to: VALIDATEAPI.address,
        value: value,
        data: validateApi.methods.excuteTransaction(from,to,data,gasUsed).encodeABI()
    };
    const signPromise = web3.eth.accounts.signTransaction(tx,process.env.PRIVATE_KEY);
    await signPromise.then((signedTx) => {
        const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
        sentTx.on("receipt", receipt => {
            console.log(receipt);
            res.json({'TxHash Success': receipt});
        });
        sentTx.on("error", error => {
            console.log(error);
            res.json({'TxHash Error': error});
        });
    }).catch((error) => {
        console.log(error);
        res.json({'TxHash Crash': error});
    });
    /*
    const fetchLink = `https://testapijib.netlify.app/.netlify/functions/api/tx/${tx.from}/${tx.to}/${tx.data}/${tx.value}/${tx.gasUsed}/${tx.gasPrice}/${signed}/${tx.description}`;
    await fetch(fetchLink)
    .then(response => {
        if (!response.ok) { throw new Error(`Network response was not ok: ${response.statusText}`); }
        return response.json();
    })
    .then(async result => {
        console.log(result);
    })
    .catch(error => {
        console.error('Error create tx:', error);
    });*/
}

async function update() {
    console.log("updated!");
}