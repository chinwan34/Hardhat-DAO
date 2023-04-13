import {HardhatRuntimeEnvironment} from "hardhat/types";
import {DeployFunction} from "hardhat-deploy/types";
import {ethers} from "hardhat";

const deployBox: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const {getNamedAccounts, deployments} = hre;
    // Deploy function and log function
    const {deploy, log, get} = deployments;
    // From the hardhat.config
    const {deployer} = await getNamedAccounts();
    log("Deploying contract...");
    const box = await deploy("Box", {
        from: deployer,
        args: [],
        log: true,
    });

    const timeLock = await ethers.getContract("TimeLock");
    const boxContract = await ethers.getContractAt("Box", box.address);
    const transferOwnerTx = await boxContract.transferOwnership(
        timeLock.address
    );

    await transferOwnerTx.wait(1);
    log("Deployed.");
}

export default deployBox;