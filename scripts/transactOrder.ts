import { ethers } from "hardhat";

async function main() {
    const accounts = await ethers.getSigners();
    const adminWallet = accounts[0];
    const tokAddress = process.env.TOK_ADDRESS;

    console.log("Admin wallet address: ", adminWallet.address);
    console.log("TOK address: ", tokAddress);

    const tok = await ethers.getContractAt("TOK", tokAddress, adminWallet);
    const orderId = 2;
    console.log("Locking transaction...");
    const lockTransactionTx = await tok.lockTransaction(orderId, false, {gasLimit: 300000});
    await lockTransactionTx.wait();
    console.log("Locking transaction done");

    console.log("Calling transact on TOK...");
    (await tok.transact(orderId, {gasLimit: 300000})).wait();
    console.log("Transact done");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });