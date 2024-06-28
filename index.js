import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account.length > 0) {
      console.log("Account connected: ", account);
      setAccount(account[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      const balanceBN = await atm.getBalance();
      const balanceInEth = ethers.utils.formatEther(balanceBN);
      const formattedBalance = parseFloat(balanceInEth).toFixed(4);
      setBalance(formattedBalance);
    }
  };

  const depositFiveEth = async () => {
    if (atm) {
      const tx = await atm.deposit(ethers.utils.parseEther("5.0"));
      await tx.wait();
      getBalance();
    }
  };

  const withdrawFiveEth = async () => {
    if (atm) {
      const tx = await atm.withdraw(ethers.utils.parseEther("5.0"));
      await tx.wait();
      getBalance();
    }
  };

  const depositTenEth = async () => {
    if (atm) {
      const tx = await atm.deposit(ethers.utils.parseEther("10.0"));
      await tx.wait();
      getBalance();
    }
  };

  const withdrawTenEth = async () => {
    if (atm) {
      const tx = await atm.withdraw(ethers.utils.parseEther("10.0"));
      await tx.wait();
      getBalance();
    }
  };

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>;
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>;
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Your Account Address : {account}</p>
        <p>Your Account Balance : {balance} ETH</p>
        <button onClick={depositFiveEth}>Deposit 5 ETH</button>
        <button onClick={withdrawFiveEth}>Withdraw 5 ETH</button>
        <button onClick={depositTenEth}>Deposit 10 ETH</button>
        <button onClick={withdrawTenEth}>Withdraw 10 ETH</button>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header><h1>Digital Decentralized Banking Service</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
          background-color: yellow; /* Changed background color to yellow */
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: relative; /* Ensure relative positioning for absolute children */
        }
      `}
      </style>
    </main>
  );
}
