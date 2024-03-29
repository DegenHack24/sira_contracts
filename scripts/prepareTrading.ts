import { ethers } from "hardhat";

async function main() {
    const accounts = await ethers.getSigners();
    const adminWallet = accounts[0];
    const wallet1 = accounts[1];
    const wallet2 = accounts[2];
    const wallet3 = accounts[3];
    const allowListAddress = process.env.ALLOW_LIST_ADDRESS;
    const equityTokenAddress = process.env.EQUITY_TOKEN_ADDRESS;
    const stableCoinAddress = process.env.STABLE_COIN_ADDRESS;
    const tokAddress = process.env.TOK_ADDRESS;

    console.log("Admin wallet address: ", adminWallet.address);
    console.log("Wallet 1 address: ", wallet1.address);
    console.log("Wallet 2 address: ", wallet2.address);
    console.log("Wallet 3 address: ", wallet3.address);
    console.log("Allow list address: ", allowListAddress);
    console.log("Equity token address: ", equityTokenAddress);
    console.log("Stable coin address: ", stableCoinAddress);
    console.log("TOK address: ", tokAddress);

    const stableCoin = await ethers.getContractAt("StableCoin", stableCoinAddress, adminWallet);
    const allowedList = await ethers.getContractAt("AllowedList", allowListAddress, adminWallet);
    const equityToken = await ethers.getContractAt("EquityToken", equityTokenAddress, adminWallet);
    const tok = await ethers.getContractAt("TOK", tokAddress, adminWallet);

    console.log("Adding to allow list...");
    const allowListTx1 = await allowedList.addToAllowedList(wallet1.address);
    const allowListTx2 = await allowedList.addToAllowedList(wallet2.address);
    const allowListTx3 = await allowedList.addToAllowedList(wallet3.address);
    const allowListTx4 = await allowedList.addToAllowedList(tokAddress);

    await allowListTx1.wait();
    await allowListTx2.wait();
    await allowListTx3.wait();
    await allowListTx4.wait();

    console.log("Adding to allow list done");

    console.log("Distributing tokens...");
    const equityTokenTx1 = await equityToken.creatItem(wallet1.address, 100);
    const equityTokenTx2 = await equityToken.creatItem(wallet2.address, 100);
    const equityTokenTx3 = await equityToken.creatItem(wallet3.address, 100);
    const stableCoinTx1 = await stableCoin.transfer(wallet1.address, 1000);
    const stableCoinTx2 = await stableCoin.transfer(wallet2.address, 1000);
    const stableCoinTx3 = await stableCoin.transfer(wallet3.address, 1000);

    await equityTokenTx1.wait();
    await equityTokenTx2.wait();
    await equityTokenTx3.wait();
    await stableCoinTx1.wait();
    await stableCoinTx2.wait();
    await stableCoinTx3.wait();
    console.log("Distributing tokens done");

    console.log("Approving tokens...");
    const stableCoinApproveTx1 = await stableCoin.connect(wallet1).approve(tok.address, 1000);
    const stableCoinApproveTx2 = await stableCoin.connect(wallet2).approve(tok.address, 1000);
    const stableCoinApproveTx3 = await stableCoin.connect(wallet3).approve(tok.address, 1000);
    const equityTokenApproveTx1 = await equityToken.connect(wallet1).approve(tok.address, 1000);
    const equityTokenApproveTx2 = await equityToken.connect(wallet2).approve(tok.address, 1000);
    const equityTokenApproveTx3 = await equityToken.connect(wallet3).approve(tok.address, 1000);

    await stableCoinApproveTx1.wait();
    await stableCoinApproveTx2.wait();
    await stableCoinApproveTx3.wait();
    await equityTokenApproveTx1.wait();
    await equityTokenApproveTx2.wait();
    await equityTokenApproveTx3.wait();
    console.log("Approving tokens done");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });