import { proposalsFile, VOTING_DELAY, developmentChains } from "../helper-hardhat-config";
import * as fs from "fs";
import {network, ethers} from "hardhat";
import {moveBlocks} from "../utils/move-blocks";


const index = 0;
async function main(proposalIndex: number) {
    const proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf-8"));
    const proposalId = proposals[network.config.chainId!][proposalIndex];

    // Cast a vote. 0 : against / 1: for, / 2: abstain
    const voteWay = 1;
    const governor = await ethers.getContract("GovernorContract");
    const reason = "Hi";
    const voteTxResponse = await governor.castVoteWithReason(
        proposalId,
        voteWay,
        reason
    );
    await voteTxResponse.wait(1);
    await moveBlocks(VOTING_DELAY + 1);
    if (developmentChains.includes(network.name)) {
        await moveBlocks(VOTING_DELAY + 1);
    }
    console.log("Successfully voted.")
}

main(index)
    .then(()=>process.exit(0))
    .catch((error)=> {
        console.error(error); process.exit(1);
    });