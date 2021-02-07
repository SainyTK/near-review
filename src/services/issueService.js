import ipfs from "../ipfs";
import axios from 'axios';
import getConfig from '../config';
import { utils } from 'near-api-js';
import { msToNs, nsToMs } from "../common/format";

const nearConfig = getConfig(process.env.NODE_ENV || 'development');

const openIssue = (orderId, targetId, deadline, maxVote, ipfsHash, additionalReward, value) => {
    const account = window.walletConnection.account();
    const args = { order_id: orderId, target_id: targetId, deadline: msToNs(deadline), max_vote: utils.format.parseNearAmount(maxVote.toString()), ipfs_hash: ipfsHash, additional_reward: additionalReward }
    return account.functionCall(nearConfig.contractName, 'open_issue', args, null, utils.format.parseNearAmount(value.toString()));
}

const vote = (issueId, orderId, agree, ipfsHash, value) => {
    const account = window.walletConnection.account();
    const args = { issue_id: issueId, order_id: orderId, agree: Boolean(agree), ipfs_hash: ipfsHash }
    return account.functionCall(nearConfig.contractName, 'vote', args, null, utils.format.parseNearAmount(value.toString()));
}

const getReward = (issueId) => {
    return window.contract.get_reward({ issue_id, issueId })
}

const getIssues = async () => {
    try {
        const contractData = await window.contract.get_issues();
        const promises = contractData.map(async (data, index) => {
            const [issuer, targetId, createdAt, deadline, maxVote, additionalReward, voteYes, voteNo] = data;
            const getVoteYesList = voteYes.map(async (vote) => {
                const [voter, value, gotReward, ipfsHash] = vote;
                const res = await axios.get(ipfs.hashToUrl(ipfsHash)).then(res => res.data).catch(() => ({}));
                return { voter, value: +utils.format.formatNearAmount(value), gotReward, ...res }
            })
            const getVoteNoList = voteNo.map(async (vote) => {
                const [voter, value, gotReward, ipfsHash] = vote;
                const res = await axios.get(ipfs.hashToUrl(ipfsHash)).then(res => res.data).catch(() => ({}));
                return { voter, value: +utils.format.formatNearAmount(value), gotReward, ...res }
            })
            const [voteYesList, voteNoList] = await Promise.all([
                Promise.all(getVoteYesList),
                Promise.all(getVoteNoList)
            ])
            return {
                issueId: index,
                issuer,
                targetId,
                createdAt: nsToMs(createdAt),
                deadline: nsToMs(deadline),
                maxVote: +utils.format.formatNearAmount(maxVote),
                additionalReward,
                voteYesMap: voteYesList.reduce((prev, cur) => ({...prev, [cur.voter]: cur}), {}),
                voteNoMap: voteNoList.reduce((prev, cur) => ({...prev, [cur.voter]: cur}), {})
            }
        });
        return Promise.all(promises);
    } catch (e) {
        console.error('error', e);
        throw e;
    }
}

export default {
    openIssue,
    vote,
    getReward,
    getIssues
}