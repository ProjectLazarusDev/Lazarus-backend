const express = require('express')
const router = express.Router()
const ethers = require('ethers');

const installationCoreChamberABI = require('../ABI/CoreChamber.json');
const installationCoreChamberAddress = '0xC26A7567714f20947D2dF56564EB8C9e3e6fF141';
//TODO: should put it somewhere else
const abitrumOneURL = 'https://arb1.arbitrum.io/rpc';
const walletPrivateKey = '07d1b7bec062e1e47365e4092ae10551592b19323a41706713e8d8c1056021df';

router.get('/:id', async (req, res) => {

    const provider = new ethers.providers.JsonRpcProvider(abitrumOneURL);
    const wallet = new ethers.Wallet(walletPrivateKey, provider);
    const signer = wallet.provider.getSigner(wallet.address);
    const contract = new ethers.Contract(installationCoreChamberAddress, installationCoreChamberABI.output.abi, signer);
    const bobotId = parseInt(`${req.params.id}`);
    const isStaked = await contract.isAtCoreChamberGenesis(bobotId);

    const stakeStatusData = {
        is_staked: isStaked,
    };

    const data = JSON.stringify(stakeStatusData);
    res.send(data);
})

module.exports = router