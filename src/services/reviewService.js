import ipfs from "../ipfs";
import axios from 'axios';
import { nsToMs } from "../common/format";

const postReview = (orderId, ipfsHash) => {
    return window.contract.post_review({ order_id: orderId, ipfs_hash: ipfsHash });
}

const updateReview = (orderId, ipfsHash) => {
    return window.contract.update_review({ order_id: orderId, ipfs_hash: ipfsHash });
}

const deleteReview = (orderId) => {
    return window.contract.delete_review({ order_id: orderId });
}

const getReviews = async () => {
    try {
        const contractData = await window.contract.get_reviews();
        const promises = contractData.map(async data => {
            const [orderId, versions, likes] = data;
            const promises = await versions.map(async version => {
                const [ipfsHash, updatedAt, deletedAt, blockId] = version;
                let ipfsData = {};
                if (deletedAt === 0)
                    ipfsData = await axios.get(ipfs.hashToUrl(ipfsHash)).then(res => res.data).catch((e) => {
                        console.error('getReviews', e);
                        return {}
                    });
                return { ...ipfsData, updatedAt: nsToMs(updatedAt), deletedAt: nsToMs(deletedAt), blockId }
            });
            const dataList = await Promise.all(promises);
            return { orderId, likes, versions: dataList }
        })
        return Promise.all(promises);
    } catch (e) {
        throw e;
    }
}

const giveHelpful = async (order_id, target_id) => {
    return window.contract.give_helpful({ order_id, target_id });
}

export default {
    postReview,
    getReviews,
    giveHelpful,
    updateReview,
    deleteReview
}