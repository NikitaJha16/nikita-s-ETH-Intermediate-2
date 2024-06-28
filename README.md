# Nikita's Banking System

Welcome to Nikita's Banking System! This React application allows users to interact with an Ethereum smart contract through MetaMask, enabling them to deposit and withdraw ETH.

## Features

- Connect MetaMask wallet to the application.
- View account information and ETH balance.
- Deposit and withdraw ETH from the smart contract.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14.x or later)
- [MetaMask](https://metamask.io/) browser extension

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/nikitas-banking-system.git
   cd nikitas-banking-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`.

## Usage

1. Ensure MetaMask is installed and configured in your browser.
2. Click on "Please connect your MetaMask wallet" to connect to your MetaMask account.
3. Once connected, you can view your account address and ETH balance.
4. Use the provided buttons to deposit or withdraw ETH from the smart contract.
5. Transaction status and updated balances will be displayed in real-time.

## Smart Contract

The smart contract used in this project is deployed at `0x5FbDB2315678afecb367f032d93F642f64180aa3` with the ABI available in `atm_abi`.

## Technologies Used

- React
- ethers.js
- MetaMask

## Main Source Directory

You can use Gitpod for a pre-configured development environment. Click the link below to get started:

[Open in Gitpod](https://gitpod.io/new/#https://github.com/MetacrafterChris/SCM-Starter)

## Contributing

Feel free to contribute to this project by submitting pull requests. Please follow the [Contributing Guidelines](CONTRIBUTING.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to OpenZeppelin for the ERC20 contract example.
- Inspiration from decentralized finance (DeFi) applications.

