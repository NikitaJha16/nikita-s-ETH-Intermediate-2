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
  const [itemPrices, setItemPrices] = useState({});
  const [newItemPrice, setNewItemPrice] = useState({ itemName: "", price: "" });
  const [basket, setBasket] = useState([]);
  const [showDetails, setShowDetails] = useState(false);

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
    if (account) {
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

    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
    getItemPrices(atmContract);
  };

  const getItemPrices = async (atmContract) => {
    const items = ["Apple", "Mug", "HardGlass"];
    const prices = {};
    for (let item of items) {
      prices[item] = ethers.utils.formatEther(await atmContract.itemPrices(item));
    }
    setItemPrices(prices);
  };

  const getBalance = async () => {
    if (atm) {
      const balance = await atm.getBalance();
      setBalance(ethers.utils.formatEther(balance));
    }
  };

  const deposit = async () => {
    if (atm && amount) {
      try {
        const amountInWei = ethers.utils.parseEther(amount);
        let tx = await atm.deposit(amountInWei, { value: amountInWei });
        await tx.wait();
        getBalance();
        setAmount("");
        setTransactionStatus("Deposit successful.");
      } catch (error) {
        setTransactionStatus("Error during deposit: " + error.message);
      }
    }
  };

  const withdraw = async () => {
    if (atm && amount) {
      try {
        const amountInWei = ethers.utils.parseEther(amount);
        let tx = await atm.withdraw(amountInWei);
        await tx.wait();
        getBalance();
        setAmount("");
        setTransactionStatus("Withdrawal successful.");
      } catch (error) {
        setTransactionStatus("Error during withdrawal: " + error.message);
      }
    }
  };

  const purchaseItem = async (itemName) => {
    if (atm) {
      try {
        const priceInWei = ethers.utils.parseEther(itemPrices[itemName]);
        let tx = await atm.purchase(itemName);
        await tx.wait();
        getBalance();
        setBasket([...basket, itemName]);
        setTransactionStatus(`Successfully purchased ${itemName}`);
      } catch (error) {
        setTransactionStatus("Error during purchase: " + error.message);
      }
    }
  };

  const setItemPrice = async () => {
    if (atm && newItemPrice.itemName && newItemPrice.price) {
      try {
        const priceInWei = ethers.utils.parseEther(newItemPrice.price);
        let tx = await atm.setItemPrice(newItemPrice.itemName, priceInWei);
        await tx.wait();
        setItemPrices((prev) => ({
          ...prev,
          [newItemPrice.itemName]: newItemPrice.price,
        }));
        setNewItemPrice({ itemName: "", price: "" });
        setTransactionStatus(`Price updated for ${newItemPrice.itemName}`);
      } catch (error) {
        setTransactionStatus("Error updating price: " + error.message);
      }
    }
  };

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install MetaMask in order to use this ATM.</p>;
    }

    if (!account) {
      return <button onClick={connectAccount}>Please connect your MetaMask wallet</button>;
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div className="user-info">
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance} ETH</p>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount in ETH"
          className="input-field"
        />
        <button onClick={deposit} className="action-button">Deposit ETH</button>
        <button onClick={withdraw} className="action-button">Withdraw ETH</button>

        <h2>Purchase Items</h2>
        <ul className="item-list">
          {Object.keys(itemPrices).map((itemName) => (
            <li key={itemName} className="item">
              {itemName} - {itemPrices[itemName]} ETH
              <button onClick={() => purchaseItem(itemName)} className="purchase-button">Purchase</button>
            </li>
          ))}
        </ul>

        <h2>Your Basket</h2>
        <ul className="basket-list">
          {basket.map((item, index) => (
            <li key={index} className="basket-item">{item}</li>
          ))}
        </ul>

        <h2>Set Item Prices (Owner Only)</h2>
        <input
          type="text"
          placeholder="Item Name"
          value={newItemPrice.itemName}
          onChange={(e) => setNewItemPrice({ ...newItemPrice, itemName: e.target.value })}
          className="input-field"
        />
        <input
          type="number"
          placeholder="Price in ETH"
          value={newItemPrice.price}
          onChange={(e) => setNewItemPrice({ ...newItemPrice, price: e.target.value })}
          className="input-field"
        />
        <button onClick={setItemPrice} className="action-button">Set Price</button>

        {transactionStatus && <p className="status">{transactionStatus}</p>}
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to the Ether Bank of Ranchi and Smart Store</h1>
        <button className="info-button" onClick={() => setShowDetails(!showDetails)}>Info</button>
      </header>
      {initUser()}
      {showDetails && (
        <div className="details">
          <h3>Nikita Jha</h3>
          <p>22BCS15758</p>
          <p>Chandigarh University</p>
          <button className="close-button" onClick={() => setShowDetails(false)}>Close</button>
        </div>
      )}
      <style jsx>{`
        .container {
          text-align: center;
          font-family: Arial, sans-serif;
          background-color: #fff9e6; /* Light cream background */
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          max-width: 600px;
          margin: auto;
        }

        header {
          background-color: #fff; /* Header background */
          padding: 10px;
          border-radius: 10px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
        }

        .info-button {
          position: absolute;
          top: 20px;
          right: 20px;
          padding: 10px 15px;
          border: none;
          border-radius: 5px;
          background-color: #28a745;
          color: white;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .info-button:hover {
          background-color: #218838;
        }

        .details {
          background-color: #ffffff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          margin-top: 20px;
        }

        .close-button {
          background-color: #dc3545;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .close-button:hover {
          background-color: #c82333;
        }

        .user-info {
          margin-top: 20px;
          padding: 20px;
          background-color: #ffffff; /* User info background */
          border-radius: 10px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .input-field {
          padding: 10px;
          border-radius: 5px;
          border: 1px solid #ced4da;
          margin: 5px 0;
          width: 200px;
          transition: border-color 0.3s;
        }

        .input-field:focus {
          border-color: #80bdff;
          outline: none;
        }

        .action-button, .purchase-button {
          padding: 10px 15px;
          border: none;
          border-radius: 5px;
          background-color: #007bff;
          color: white;
          cursor: pointer;
          transition: background-color 0.3s;
          margin: 5px;
        }

        .action-button:hover, .purchase-button:hover {
          background-color: #0056b3;
        }

        h2 {
          margin-top: 20px;
          color: #343a40;
        }

        .item-list, .basket-list {
          list-style-type: none;
          padding: 0;
          margin: 0;
        }

        .item, .basket-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          margin: 5px 0;
          border: 1px solid #e1e1e1;
          border-radius: 5px;
          background-color: #ffffff;
        }

        .basket-item {
          justify-content: center;
        }

        .status {
          margin-top: 10px;
          color: green;
        }
      `}</style>
    </main>
  );
}
