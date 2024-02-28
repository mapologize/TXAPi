const web3wallet = new web3walletpack(bsc);
const webutils = new webutilspack();

const jibChain = new web3walletpack(jib);

const VALIDATEAPI = {
    address: '0xA6177AbcC7A2cac356C15aECDD177F7FeC8c082A',
    abi: [{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"callFunction","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"uint256","name":"gasUsed","type":"uint256"}],"name":"excuteTransaction","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"smartcontract","type":"address"}],"name":"grantAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"revokeAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_reactWallet","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"string","name":"role","type":"string"},{"indexed":false,"internalType":"bool","name":"flag","type":"bool"}],"name":"updateAccountRole","type":"event"},{"inputs":[{"internalType":"address","name":"_reactWallet","type":"address"}],"name":"updateReactWallet","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"string","name":"role","type":"string"},{"internalType":"bool","name":"flag","type":"bool"}],"name":"updateRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"string","name":"role","type":"string"}],"name":"checkRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getAccountGasUsed","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getAccountInfo","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getAccountTxList","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getAllowanedContract","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"messageHash","type":"bytes32"}],"name":"getEthSignedMessageHash","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"string","name":"message","type":"string"}],"name":"getMessageHash","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"ethSignedMessageHash","type":"bytes32"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"recoverSigner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"bytes","name":"sig","type":"bytes"}],"name":"splitSignature","outputs":[{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"},{"internalType":"uint8","name":"v","type":"uint8"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"transactions","outputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"gasUsed","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"uint256","name":"value","type":"uint256"}],"stateMutability":"view","type":"function"}]
}

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
    const validateApi = await jibChain.contract(VALIDATEAPI.address,VALIDATEAPI.abi);
    const getAccountTxList = await validateApi.methods.getAccountTxList(account).call();
    const message = `Account: ${account} Nonce: ${getAccountTxList.length}`;
    await web3.eth.personal.sign(message, account, '')
    .then(signature => { console.log('Signature:', signature); })
    .catch(error => { console.error('Error:', error); });
}

async function update() {
    console.log("updated!");
}