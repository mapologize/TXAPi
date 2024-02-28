const web3wallet = new web3walletpack(bsc);
const webutils = new webutilspack();

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
    const message = 'Hello, World!';
    await web3.eth.personal.sign(message, account, '')
    .then(signature => { console.log('Signature:', signature); })
    .catch(error => { console.error('Error:', error); });
}

async function update() {
    console.log("updated!");
}