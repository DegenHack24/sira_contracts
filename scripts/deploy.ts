import { ethers, upgrades } from "hardhat";

async function main() {
    const [owner, otherAccount] = await ethers.getSigners();

    const StableCoin = await ethers.getContractFactory("StableCoin");
    const AllowedList = await ethers.getContractFactory("AllowedList");
    const EquityToken = await ethers.getContractFactory(
      "EquityToken"
    );
  
    const TOK = await ethers.getContractFactory("TOK");
  
    const stableCoin = await upgrades.deployProxy(
      StableCoin,
      ["StableCoin", "PL"],
      { initializer: "initialize"}
  );
    const allowedList = await upgrades.deployProxy(AllowedList, {
      initializer: "initialize"});
    const equityToken = await upgrades.deployProxy(
      EquityToken,
      ["BlockyDevs", "BD", "URI",allowedList.address],
      { initializer: "initialize"}
    );
    const equityToken2 = await upgrades.deployProxy(
      EquityToken,
      ["DegenHouse", "DH", "URI",allowedList.address],
      { initializer: "initialize"}
    );
    const tok = await upgrades.deployProxy(TOK, [stableCoin.address], {
      initializer: "initialize"});
  

    console.log("StableCoin deployed to:", stableCoin.address);
    console.log("AllowedList deployed to:", allowedList.address);
    console.log("EquityToken deployed to:", equityToken.address);
    console.log("EquityToken2 deployed to:", equityToken2.address);
    console.log("TOK deployed to:", tok.address);  
    return { allowedList, stableCoin, equityToken, owner, tok, otherAccount };
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });