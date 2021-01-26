import ipfs from "../ipfs";
import axios from 'axios';

const postReview = (orderId, ipfsHash) => {
    return window.contract.post_review({ order_id: orderId, ipfs_hash: ipfsHash });
}

const getReviews = async () => {
    try {
        const contractData = await window.contract.get_reviews();
        const promises = contractData.map(async data => {
            const [orderId, ipfsHash, likes] = data;
            const ipfsData = await axios.get(ipfs.hashToUrl(ipfsHash)).then(res => res.data).catch(() => ({}));
            return { orderId, likes, ...ipfsData }
        })
        return Promise.all(promises);
    } catch (e) {
        throw e;
    }
}

const giveHelpful = async (order_id, target_id) => {
    return window.contract.give_helpful({order_id, target_id});
}

export default {
    postReview,
    getReviews,
    giveHelpful
}