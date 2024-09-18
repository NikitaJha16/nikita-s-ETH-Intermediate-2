import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [amount, setAmount] = useState("");
  const [transactionStatus, setTransactionStatus] = useState(null);

  const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const atmABI = atm_abi.abi;

  const groceryItems = [
    { name: "Apples", price: 0.001 },
    { name: "Bread", price: 0.002 },
    { name: "Milk", price: 0.003 },
    { name: "Eggs", price: 0.002 },
  ];

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }
    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account[0]);
    } else {
      console.log("No account found");
    }
  }

  const connectAccount = async () => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
 
    setATM(atmContract);
  }

  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toString());
    }
  }

  const handleTransaction = async (type) => {
    if (atm && amount) {
      try {
        setTransactionStatus("Processing...");
        const amountInWei = ethers.utils.parseEther(amount);
        let tx;
        if (type === 'deposit') {
          tx = await atm.deposit({ value: amountInWei });
        } else {
          tx = await atm.withdraw(amountInWei);
        }
        await tx.wait();
        getBalance();
        setTransactionStatus(`Successfully ${type === 'deposit' ? 'deposited' : 'withdrawn'} ${amount} ETH`);
        setAmount("");
      } catch (error) {
        console.error(`${type} error:`, error);
        setTransactionStatus(`Error: ${error.message}`);
      }
    } else {
      setTransactionStatus("Please enter an amount and ensure your wallet is connected.");
    }
  }

  const purchaseItem = async (item) => {
    if (atm) {
      try {
        setTransactionStatus("Processing purchase...");
        const amountInWei = ethers.utils.parseEther(item.price.toString());
        let tx = await atm.withdraw(amountInWei);
        await tx.wait();
        getBalance();
        setTransactionStatus(`Successfully purchased ${item.name} for ${item.price} ETH`);
      } catch (error) {
        console.error("Purchase error:", error);
        setTransactionStatus(`Error: ${error.message}`);
      }
    }
  }

  const initUser = () => {
    if (!ethWallet) {
      return <p className="error">Please install MetaMask to use this ATM and Store.</p>
    }

    if (!account) {
      return <button onClick={connectAccount} className="connect-button">Connect Your MetaMask Wallet</button>
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div className="user-info">
        <p><strong>Your Account:</strong> {account}</p>
        <p><strong>Your Balance:</strong> {ethers.utils.formatEther(balance || '0')} ETH</p>
        <div className="transaction-area">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount in ETH"
            className="amount-input"
          />
          <div className="button-group">
            <button onClick={() => handleTransaction('deposit')} className="action-button deposit">Deposit</button>
            <button onClick={() => handleTransaction('withdraw')} className="action-button withdraw">Withdraw</button>
          </div>
        </div>
        {transactionStatus && <p className="transaction-status">{transactionStatus}</p>}
        <div className="grocery-store">
          <h2>Grocery Store</h2>
          <div className="grocery-items">
            {groceryItems.map((item, index) => (
              <div key={index} className="grocery-item">
                <span>{item.name} - {item.price} ETH</span>
                <button onClick={() => purchaseItem(item)} className="purchase-button">Buy</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  useEffect(() => { getWallet(); }, []);

  return (
    <main className="container">
      <header>
        <h1>Raashi ATM & Grocery Store</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-family: 'Arial', sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f0f0f0;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        header {
          background-color: #3498db;
          color: white;
          padding: 20px;
          border-radius: 10px 10px 0 0;
          width: 100%;
          text-align: center;
        }
        h1 {
          margin: 0;
        }
        .user-info {
          background-color: white;
          padding: 20px;
          border-radius: 10px;
          width: 100%;
          box-shadow: 0 0 5px rgba(0,0,0,0.1);
        }
        .transaction-area {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 20px;
        }
        .amount-input {
          padding: 10px;
          font-size: 16px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
        .button-group {
          display: flex;
          gap: 10px;
        }
        .action-button {
          flex: 1;
          padding: 10px;
          font-size: 16px;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .deposit {
          background-color: #2ecc71;
        }
        .deposit:hover {
          background-color: #27ae60;
        }
        .withdraw {
          background-color: #e74c3c;
        }
        .withdraw:hover {
          background-color: #c0392b;
        }
        .connect-button {
          background-color: #3498db;
          color: white;
          border: none;
          padding: 10px 20px;
          font-size: 16px;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .connect-button:hover {
          background-color: #2980b9;
        }
        .transaction-status {
          margin-top: 20px;
          padding: 10px;
          border-radius: 5px;
          background-color: #f8f9fa;
          border: 1px solid #dee2e6;
        }
        .error {
          color: #e74c3c;
        }
        .grocery-store {
          margin-top: 30px;
          background-color: #ecf0f1;
          padding: 20px;
          border-radius: 10px;
        }
        .grocery-items {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }
        .grocery-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: white;
          padding: 10px;
          border-radius: 5px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .purchase-button {
          background-color: #f39c12;
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 3px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .purchase-button:hover {
          background-color: #d35400;
        }
      `}</style>
    </main>
  )
}
