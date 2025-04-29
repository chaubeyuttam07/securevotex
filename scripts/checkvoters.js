const hre = require("hardhat");

async function main() {
    const Voting = await hre.ethers.getContractFactory("Voting");

    // Replace with your actual deployed contract address
    const contractAddress = " 0x99575Dd739E58C64194185011108fB71c0c120e4";

    const voting = Voting.attach(contractAddress);

    const votedAddresses = await voting.getVotedAddresses();
    console.log("Voted Addresses:");
    votedAddresses.forEach((addr, i) => {
        console.log(`${i + 1}. ${addr}`);
    });
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
