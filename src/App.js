// // import { Alchemy, Network } from "alchemy-sdk";
// // import { useEffect, useState } from "react";

// // import "./App.css";

// // // Refer to the README doc for more information about using API
// // // keys in client-side code. You should never do this in production
// // // level code.
// // const settings = {
// //   apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
// //   network: Network.ETH_MAINNET,
// // };

// // // In this week's lessons we used ethers.js. Here we are using the
// // // Alchemy SDK is an umbrella library with several different packages.
// // //
// // // You can read more about the packages here:
// // //   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
// // const alchemy = new Alchemy(settings);

// // function App() {
// //   const [blockNumber, setBlockNumber] = useState();

// //   useEffect(() => {
// //     async function getBlockNumber() {
// //       setBlockNumber(await alchemy.core.getBlockNumber());
// //     }

// //     getBlockNumber();
// //   });

// //   return <div className="App">Block Number: {blockNumber}</div>;
// // }

// // export default App;

// import { Alchemy, Network } from "alchemy-sdk";
// import { useEffect, useState } from "react";

// import "./App.css";

// const settings = {
//   apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
//   network: Network.ETH_MAINNET,
// };

// const alchemy = new Alchemy(settings);

// function App() {
//   const [blockNumber, setBlockNumber] = useState();
//   const [blockDetails, setBlockDetails] = useState();
//   const [transactions, setTransactions] = useState([]);

//   useEffect(() => {
//     async function getBlockDetails() {
//       const blockNumber = await alchemy.core.getBlockNumber();
//       setBlockNumber(blockNumber);

//       const blockDetails = await alchemy.core.getBlock(blockNumber);
//       setBlockDetails(blockDetails);

//       const blockWithTransactions = await alchemy.core.getBlockWithTransactions(
//         blockNumber
//       );
//       setTransactions(blockWithTransactions.transactions);
//     }

//     getBlockDetails();
//   }, []);

//   return (
//     <div className="App">
//       <h1>Block Number: {blockNumber}</h1>
//       <h1>Block Details: {JSON.stringify(blockDetails)}</h1>
//       <h2>Transactions: {JSON.stringify(transactions)}</h2>
//     </div>
//   );
// }

// export default App;

import { Alchemy, Network } from "alchemy-sdk";
import { useState } from "react";

import "./App.css";

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();

  return (
    <div className="App">
      <Block blockNumber={blockNumber} setBlockNumber={setBlockNumber} />
      <Transaction />
      <Account />
    </div>
  );
}

function Block({ blockNumber, setBlockNumber }) {
  const [blockDetails, setBlockDetails] = useState(null);

  const handleClick = async () => {
    const blockDetails = await alchemy.core.getBlock(blockNumber);
    setBlockDetails(blockDetails);
  };

  return (
    <div onClick={handleClick}>
      Block Number: {blockNumber}
      {blockDetails && (
        <div>
          Hash: {blockDetails.hash}, Timestamp: {blockDetails.timestamp}
        </div>
      )}
    </div>
  );
}

function Transaction() {
  const [transactionHash, setTransactionHash] = useState("");
  const [transactionReceipt, setTransactionReceipt] = useState(null);

  const handleClick = async () => {
    if (transactionHash !== "") {
      const receipt = await alchemy.core.getTransactionReceipt(transactionHash);
      setTransactionReceipt(receipt);
    } else {
      console.log("Please enter a valid transaction hash.");
    }
  };

  return (
    <div>
      <input
        type="text"
        value={transactionHash}
        onChange={(e) => setTransactionHash(e.target.value)}
        placeholder="Enter transaction hash"
      />
      <button onClick={handleClick}>Get Transaction Receipt</button>
      {transactionReceipt && <div>{JSON.stringify(transactionReceipt)}</div>}
    </div>
  );
}

function Account() {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const balance = await alchemy.core.getBalance(address);
      console.log("Balance fetched:", balance);
      setBalance(balance.toString()); // Convert balance to string
    } catch (err) {
      console.error("Error fetching balance:", err);
      setError(err.toString());
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={address} onChange={(e) => setAddress(e.target.value)} />
      <button type="submit">Get Balance</button>
      {balance && <div>Balance: {balance}</div>}
      {error && <div>Error: {error}</div>}
    </form>
  );
}
export default App;
