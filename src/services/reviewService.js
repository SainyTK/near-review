import ipfs from "../ipfs";
import axios from 'axios';
import { nsToMs } from "../common/format";

const postReview = (orderId, ipfsHash) => {
    return window.contract.post_review({ order_id: orderId, ipfs_hash: ipfsHash });
}

const createComment = (targetId, ipfsHash) => {
    return window.contract.create_comment({ target_id: targetId, ipfs_hash: ipfsHash })
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
            const [orderId, versions, likes, comments] = data;
            const promises = await versions.map(async version => {
                const [ipfsHash, updatedAt, deletedAt, blockId] = version;
                let ipfsData = {};
                if (deletedAt === 0)
                    ipfsData = await axios.get(ipfs.hashToUrl(ipfsHash))
                        .then(res => res.data)
                        .catch((e) => {
                            console.error('getReviews: content', e);
                            return {}
                        });
                return { ...ipfsData, updatedAt: nsToMs(updatedAt), deletedAt: nsToMs(deletedAt), blockId }
            });
            const promises2 = await comments.map(async comment => {
                const [owner, ipfsHash, createdAt] = comment;
                const ipfsData = await axios.get(ipfs.hashToUrl(ipfsHash))
                    .then(res => res.data)
                    .catch(e => {
                        console.error('getReviews: comment', e)
                    });
                return { ...ipfsData, createdAt: nsToMs(createdAt), owner }
            })
            const dataList = await Promise.all([
                Promise.all(promises),
                Promise.all(promises2)
            ]);
            return { orderId, likes, versions: dataList[0], comments: dataList[1] }
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
    createComment,
    getReviews,
    giveHelpful,
    updateReview,
    deleteReview
}