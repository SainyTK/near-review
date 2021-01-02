import ipfs from "../ipfs";
import axios from 'axios';

const postReview = (orderId, ipfsHash) => {
    return window.contract.post_review({ order_id: orderId, ipfs_hash: ipfsHash });
}

const getReviews = async () => {
    try {
        const contractData = await window.contract.get_reviews();
        const promises = contractData.map(async data => {
            const [orderId, ipfsHash] = data;
            const ipfsData = await axios.get(ipfs.hashToUrl(ipfsHash)).then(res => res.data).catch(() => ({}));
            return { orderId, ...ipfsData }
        })
        return Promise.all(promises);
    } catch (e) {
        throw e;
    }
}

export default {
    postReview,
    getReviews
}