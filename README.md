#  Advanced Gas Tracker (Backend)

A Node.js service that monitors Ethereum gas prices in real-time, with historical data and email alerts. Built with **Ethers.js**, **Alchemy API**, and **Express**.

## Features
- **Real-time gas prices** (in Gwei) via `/gas` endpoint.
- **Historical gas data** (last 5 blocks) via `/gas/history`.
- **Automated email alerts** when gas exceeds a threshold (e.g., 30 Gwei).
- **Multi-chain ready** (configured for Sepolia testnet, extendable to Mainnet/Polygon).

##  Tech Stack
- BACKEND: Node.js, Express
- BLOCKCHAIN: Ethers.js, Alchemy API
- UTILITIES: Cron jobs, Nodemailer (alerts), Axios

## Installation
1. Clone the repo:
   ```bash
   git clone https://github.com/ameerabdulaleem/advanced-gas-tracker.git
   npm install

2. Add your .env files:
   
ALCHEMY_SEPOLIA_URL="https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY"

EMAIL_USER="your@gmail.com"

EMAIL_PASS="your_app_password"

3. Run: node index.js

🌟 Learning Outcomes

Ethers.js Providers: Interacting with Ethereum via Alchemy.

Cron Jobs: Scheduled tasks for gas monitoring.

API Design: Clean endpoints with error handling.

Security: Environment variables and .gitignore best practices.

🤝 Contribute
Found a bug? Want to improve alerts? Open an Issue or submit a PR!
