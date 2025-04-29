import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractAbi, contractAddress } from "./Constant/constant";
import Login from "./Components/Login";
import Finished from "./Components/Finished";
import Connected from "./Components/Connected";
import "./App.css";

function App() {
    const [provider, setProvider] = useState(null);
    const [account, setAccount] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [votingStatus, setVotingStatus] = useState(true);
    const [remainingTime, setremainingTime] = useState("");
    const [candidates, setCandidates] = useState([]);
    const [number, setNumber] = useState("");
    const [CanVote, setCanVote] = useState(true);

    useEffect(() => {
        getCandidates();
        getRemainingTime();
        getCurrentStatus();
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", handleAccountsChanged);
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener(
                    "accountsChanged",
                    handleAccountsChanged
                );
            }
        };
    }, []);

    async function vote() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(
            contractAddress,
            contractAbi,
            signer
        );

        const tx = await contractInstance.vote(number);
        await tx.wait();
        canVote();
        getCandidates();
    }

    async function canVote() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(
            contractAddress,
            contractAbi,
            signer
        );
        const hasVoted = await contractInstance.voters(
            await signer.getAddress()
        );
        setCanVote(!hasVoted); // Invert the value - if hasVoted is true, then CanVote should be false
        console.log(
            "Voter status for account",
            await signer.getAddress(),
            ":",
            "Has voted:",
            hasVoted,
            "Can vote:",
            !hasVoted
        );
    }

    async function getCandidates() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(
            contractAddress,
            contractAbi,
            signer
        );
        console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%:", contractInstance);
        const candidatesList = await contractInstance.getAllVotesOfCandiates();
        console.log("Raw candidates from contract:$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$", candidatesList);
        const formattedCandidates = candidatesList.map((candidate, index) => {
            return {
                index: index,
                name: candidate.name,
                voteCount: candidate.voteCount.toNumber(),
            };
        });
        console.log("Formatted candidates:", formattedCandidates);
        setCandidates(formattedCandidates);
    }
    console.log(candidates, "candidates in App.js");

    async function getCurrentStatus() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(
            contractAddress,
            contractAbi,
            signer
        );
        const status = await contractInstance.getVotingStatus();
        console.log(status);
        setVotingStatus(status);
    }

    async function getRemainingTime() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(
            contractAddress,
            contractAbi,
            signer
        );
        const time = await contractInstance.getRemainingTime();
        console.log("Remaining time:", time.toNumber());
        setremainingTime(time.toNumber());
    }

    function handleAccountsChanged(accounts) {
        if (accounts.length > 0) {
            const newAccount = accounts[0];
            if (account !== newAccount) {
                setAccount(newAccount); // Update the account state
                canVote(); // Check if the new account can vote
            }
        } else {
            setIsConnected(false);
            setAccount(null);
        }
    }

    async function connectToMetamask() {
        if (window.ethereum) {
            try {
                const provider = new ethers.providers.Web3Provider(
                    window.ethereum
                );
                setProvider(provider);
                await provider.send("eth_requestAccounts", []);
                const signer = provider.getSigner();
                const address = await signer.getAddress();
                setAccount(address);
                console.log("Metamask Connected : " + address);
                setIsConnected(true);
                canVote();
            } catch (err) {
                console.error(err);
            }
        } else {
            console.error("Metamask is not detected in the browser");
        }
    }

    async function handleNumberChange(e) {
        setNumber(e.target.value);
    }
    console.log(candidates, "candidates in App.js");
    return (
        <div className="App">
            {votingStatus ? (
                isConnected ? (
                    <Connected
                        account={account}
                        candidates={candidates}
                        remainingTime={remainingTime}
                        number={number}
                        handleNumberChange={handleNumberChange}
                        voteFunction={vote}
                        showButton={CanVote}
                    />
                ) : (
                    <Login connectWallet={connectToMetamask} />
                )
            ) : (
                <Finished />
            )}
        </div>
    );
}

export default App;
