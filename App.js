import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Web3 from "web3";
import "bootstrap/dist/css/bootstrap.min.css";


function App() {
  // State variables
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [agreementNumber, setAgreementNumber] = useState(null);
  const [agreementCount, setAgreementCount] = useState(null);
  const [agreement, setAgreement] = useState(null);
  const [buyerScore, setBuyerScore] = useState(null);
	const [sellerScore, setSellerScore] = useState(null);
const [lawyerScore, setLawyerScore] = useState(null);
const [totalFees, setTotalFees] = useState(null);


  // Define the contract address
  const contract_address = "0x2b2481f2f59cffd1d41db8190e0e4e5c49a1c7e1";

  // Function to fetch the contract ABI
  async function fetchContractAbi(address) {
    const etherscanApiKey = "YourApiKey";
    const response = await fetch(
      `https://api-goerli.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${etherscanApiKey}`
    );
    const data = await response.json();

    if (data.status === "1") {
      return JSON.parse(data.result);
    } else {
      throw new Error(data.result);
    }
  }

  // Button click handler
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Requesting user accounts from MetaMask
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        const account = accounts[0];
        setAddress(account);

        // Fetching contract ABI
        const contractAbi = await fetchContractAbi(contract_address);
        console.log(contractAbi);

        const web3 = new Web3(window.ethereum);
        // Creating a contract instance
        const contract = new web3.eth.Contract(
          contractAbi,
          contract_address
        );
		setContract(contract);


      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Please install MetaMask extension!");
    }
  };

  const selectAgreementNumber = async (e) => {
    setAgreementNumber(e.target.value);
    // Fetching agreement
    contract.methods
      .agreements(e.target.value)
      .call()
      .then((result) => {
        setAgreement(result);
      });
  };

  const fetchAgreementCount = async () => {
	contract.methods
		.agreementCount().call()
		.then((result) => {
			setAgreementCount(result);
		});
	};

  const fetchBuyerScore = async (buyerAddress) => {
  contract.methods
    .buyerScores(buyerAddress.target.value)
    .call()
    .then((result) => {
      setBuyerScore(result);
    });
};

const fetchSellerScore = async (sellerAddress) => {
  contract.methods
    .sellerScores(sellerAddress)
    .call()
    .then((result) => {
      setSellerScore(result);
    });
};

const fetchLawyerScore = async (lawyerAddress) => {
  contract.methods
    .lawyerScores(lawyerAddress)
    .call()
    .then((result) => {
      setLawyerScore(result);
    });
};

const fetchTotalFees = async () => {
  contract.methods
    .totalFeesCollected()
    .call()
    .then((result) => {
      setTotalFees(result);
    });
};

  useEffect(() => {
    // ...
  }, []);

  return (
<div className="container mt-4">
  <div className="card mb-4">
    <div className="card-header">
        Wallet
    </div>
    <div className="card-body">
      <ul>
        <li><strong>Address:</strong> {address}</li>
        <li><strong>Balance:</strong> {balance}</li>
      </ul>
      <button
        onClick={connectWallet}
        className="btn btn-primary mt-2"
        disabled={address !== ""}
      >
        {address ? "Wallet Connected" : "Connect to Wallet"}
      </button>
    </div>
  </div>

  {address && (
    <div className="card mb-4">
      <div className="card-header">
        Agreements
      </div>
      <div className="card-body">
        <p>
          <strong>Agreement Count:</strong> {agreementCount}
          <br />
          Select an Agreement Number between 1 and {agreementCount}
        </p>
        <input type="number" onChange={selectAgreementNumber} min="0" max={agreementCount-1} className="mt-2"/>
      </div>
    </div>
  )}
  {totalFees && (
				<div className="card mb-4">
					<div className="card-header">
						Total Fees
						</div>
						<div className="card-body">
							<p className="card-text">{totalFees}</p>
						</div>
					</div>
				)}
  {agreement && (
    <div className="row">
      <div className="col-md-4">
        <div className="card mb-4">
          <div className="card-header">
            Seller Account
          </div>
          <div className="card-body">
            <p className="card-text">{agreement.seller}</p>

		  </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card mb-4">
          <div className="card-header">
            Buyer Account
          </div>
          <div className="card-body">
            <p className="card-text">{agreement.buyer}</p>

          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card mb-4">
          <div className="card-header">Lawyer Agreement</div>
          <div className="card-body">
            <p className="card-text">{agreement.lawyer}</p>
          </div>
        </div>
      </div>
    </div>
  )}
</div>

  );
}

export default App;
