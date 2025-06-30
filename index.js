const express = require('express');
const cors = require('cors');
const {ethers} = require('ethers');
const axios = require('axios');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(cors());

const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_SEPOLIA_URL, {
    name: "sepolia",
    chainId: 11155111
});

//Root route
app.get('/', (req , res) => {
    res.send('Gas Tracker API running! Use /gas or /gas/history');
});


app.get('/gas', async (req, res) => {
    try{
    const [feeData, blockNumber] = await Promise.all ([
        provider.getFeeData(), //.then(data => data.gasPrice),
        provider.getBlockNumber()
    ]);

    res.json ({
       gasPrice : ethers.formatUnits(feeData.gasPrice, 'gwei'),
       maxFee: ethers.formatUnits(feeData.maxFeePerGas, 'gwei'),
       maxPriority: ethers.formatUnits(feeData.maxPriorityFeePerGas, 'gwei'),
       blockNumber,
       timestamp: new Date().toISOString()
    }); 
}   catch (error) {
    res.status(500).json({error: error.message});
}
});

app.get('/gas/history', async (req, res) => {
    try {
    const response = await axios.post(process.env.ALCHEMY_SEPOLIA_URL, {
        jsonrpc: "2.0", 
        method: "eth_feeHistory",
        params: ["0x5", "latest", [10, 20, 30]],
        id: 1
    });

    const rawData = response.data.result;

    //converting hex values to human readable numbers
    const formattedData = {
        baseFeePerGas: rawData.baseFeePerGas.map(hex=> parseInt(hex, 16)),
        gasUsedRatio: rawData.gasUsedRatio,
        rewards: rawData.reward.map(blockRewards => 
            blockRewards.map(hex => parseInt(hex, 16))
        )};

    res.json({
        status :"success",
        data: formattedData,
        metadata: {
            description: "Gas history for last 5 blocks",
            units: {
                fees: "wei",
                ratios: "0-1 scale"
            }
        }
    });

}
   catch (error) {
    res.status(500).json({
        status: "error",
        message: error.message
   }); 
 } 
});

cron.schedule('*/5 * * * *', async() => {
    try{
   const feeData = await provider.getFeeData();
   const gasInGwei = ethers.utils.formatUnits(feeData.gasPrice,  'gwei');

   if (gasInGwei > 30) {
    sendEmailAlert(`High Gas Alert: ${gasInGwei} gwei`);
   }
}  catch (error) {
    console.error('Cron job error:', error);
}
});

async function sendEmailAlert(message) {
    try{
    const transporter = nodemailer.createTransport({
        service : 'gmail',
        auth: {user : process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS
        }
    });

    await transporter.sendMail({
        to: 'ameerabdulaleem564@gmail.com',
        subject: 'Gas Price Alert',
        text: message
    });
}   catch (error) {
    console.error('Email failed:', error);
}
}

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Gas Tracker running on http://localhost:${PORT}`);
});