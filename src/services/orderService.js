import ipfs from "../ipfs";
import axios from 'axios';
import getConfig from '../config';
import { utils } from 'near-api-js';

const nearConfig = getConfig(process.env.NODE_ENV || 'development')

const createOrder = async (productId, customer, price, ipfsHash) => {
    return window.contract.create_order({ product_id: productId, customer, price, ipfs_hash: ipfsHash });
}

const purchase = (order) => {
    const { orderId, price } = order;
    const account = window.walletConnection.account();
    const args = { order_id: orderId }
    return account.functionCall(nearConfig.contractName, 'purchase', args, null, utils.format.parseNearAmount(price.toString()));
}

const getOrders = async () => {
    try {
        const contractData = await window.contract.get_orders();
        const promises = contractData.map(async data => {
            const [orderId, seller, productId, customer, price, reviewValue, ipfsHash, purchasedAt, reviewedAt, gaveHelpfulAt] = data;
            console.log(ipfsHash);
            const ipfsData = await axios.get(ipfs.hashToUrl(ipfsHash)).then(res => res.data).catch(() => ({}))
            return { orderId, seller, productId, customer, price: price / 1e+24, reviewValue, ipfsHash, purchasedAt, reviewedAt, gaveHelpfulAt, ...ipfsData }
        });
        return Promise.all(promises);
    } catch (e) {
        throw e;
    }
}

export default {
    createOrder,
    getOrders,
    purchase
}