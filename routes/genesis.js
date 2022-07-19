if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const router = express.Router()
const ethers = require('ethers');

const maxGenesisCount = 4040;
const installationCoreChamberABI = require('../ABI/CoreChamber.json');
const installationCoreChamberAddress = '0xC26A7567714f20947D2dF56564EB8C9e3e6fF141';
const bobotGenesisAddressABI = require('../ABI/BobotGenesis.json');
const bobotGenesisAddress = '0x5656360984F487AABBe5f6153E15C9f9768d09d9';

router.get('/:id', async (req, res) => {
    const provider = new ethers.providers.JsonRpcProvider(process.env.ARBITRUM_URL);
    const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);
    const signer = wallet.provider.getSigner(wallet.address);
    const bobotId = parseInt(`${req.params.id}`);

    if (bobotId <= maxGenesisCount) {
        const icc_contract = new ethers.Contract(installationCoreChamberAddress, installationCoreChamberABI.output.abi, signer);
        const isStaked = await icc_contract.isAtCoreChamberGenesis(bobotId);

        const bg_contract = new ethers.Contract(bobotGenesisAddress, bobotGenesisAddressABI.abi, signer);
        const bobotLevelResponse = await bg_contract.getCurrentBobotLevel(bobotId);
        const level = ethers.BigNumber.from(bobotLevelResponse?._hex).toNumber();

        const genesisData = {
            dynamic_attributes: {
                trait_type: 'level',
                value: level
            },  
            is_staked: isStaked
        };

        const data = JSON.stringify(genesisData);
        res.send(data);
    }
})

module.exports = router