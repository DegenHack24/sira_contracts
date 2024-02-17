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
    console.log("Allow list address: ", allowListAddress);
    console.log("Equity token address: ", equityTokenAddress);
    console.log("Stable coin address: ", stableCoinAddress);
    console.log("TOK address: ", tokAddress);

    const equityToken = await ethers.getContractAt("EquityToken", equityTokenAddress, adminWallet);
    const tok = await ethers.getContractAt("TOK", tokAddress, adminWallet);

    //create 5 random orders
    for (let i = 0; i < 5; i++) {
        console.log("Creating order...")
        //random value between 2 and 8
        const stableCoinPrice = Math.floor(Math.random() * 7) + 2;
        //random value between 1 and 5
        const equityTokenAmount = Math.floor(Math.random() * 5) + 1;
        //random wallet from wallet1, wallet2, wallet3
        const buyer = [wallet1, wallet2, wallet3][Math.floor(Math.random() * 3)];
        //random wallet from wallet1, wallet2, wallet3 excluding buyer
        const seller = [wallet1, wallet2, wallet3].filter(wallet => wallet !== buyer)[Math.floor(Math.random() * 2)];
        console.log("Buyer: ", buyer.address);
        console.log("Seller: ", seller.address);

        const txResult = (await tok.connect(buyer).createOrder(stableCoinPrice, equityToken.address, equityTokenAmount)).wait();
        let orderId;
        (await txResult).events?.forEach((event: any) => {
            if (event.event === "NewOrderEvent") {
                orderId = event.args[0];
                console.log("Order created with ID: ", orderId);
            }
        });
        console.log("Order created");

        //50% chance to break the loop after creation
        if (Math.random() < 0.5) {
            console.log("Finished after order creation");
            continue;
        }

        //50% chance to settle order
        console.log("Depositing equity token...");
        const depositEquityTokenTx = await tok.connect(seller).depositEquityToken(orderId, equityTokenAmount);
        await depositEquityTokenTx.wait();
        console.log("Depositing equity token done");

        console.log("Locking transaction...");
        const lockTransactionTx = await tok.lockTransaction(orderId, false);
        await lockTransactionTx.wait();
        console.log("Locking transaction done");

        console.log("Transacting order...");
        const transactTx = await tok.transact(orderId);
        await transactTx.wait();
        console.log("Transacting order done");
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });