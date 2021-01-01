import ipfs from "../ipfs";
import axios from 'axios';

const getAllProducts = async () => {
    try {
        const contractData = await window.contract.get_all_products();
        const promises = contractData.map(async data => {
            const [productId, owner, ipfsHash, price, reviewValue, allowSelfPurchase] = data;
            const ipfsData = await axios.get(ipfs.hashToUrl(ipfsHash)).then(res => res.data).catch(() => ({}));
            return { productId, owner, ipfsHash, price, reviewValue, allowSelfPurchase, ...ipfsData }
        })
        return Promise.all(promises);
    } catch (e) {
        throw e;
    }
}

const getProductsOf = async (account) => {
    try {
        const contractData = await window.contract.get_products_of({ account_id: account }) || []
        const promises = contractData.map(async data => {
            const [productId, owner, ipfsHash, price, reviewValue, allowSelfPurchase] = data;
            const ipfsData = await axios.get(ipfs.hashToUrl(ipfsHash)).then(res => res.data).catch(() => ({}));
            return { productId, owner, ipfsHash, price, reviewValue, allowSelfPurchase, ...ipfsData }
        })
        return Promise.all(promises);
    } catch (e) {
        throw e;
    }
}

const getProductOf = async (account, productId) => {
    try {
        const data = await window.contract.get_product_of({ account_id: account, product_id: +productId });
        const [pid, owner, ipfsHash, price, reviewValue, allowSelfPurchase] = data;
        const ipfsData = await axios.get(ipfs.hashToUrl(ipfsHash)).then(res => res.data).catch(() => ({}));
        return { productId: pid, owner, ipfsHash, price, reviewValue, allowSelfPurchase, ...ipfsData }
    } catch (e) {
        throw e;
    }
}

const updateProduct = (productId, ipfsHash, price, reviewValue, allowSelfPurchase) => {
    return window.contract.update_product({
        product_id: productId,
        ipfs_hash: ipfsHash,
        price,
        review_value: reviewValue,
        allow_self_purchase: allowSelfPurchase
    });
}

const createProduct = (ipfs_hash, price, review_value, allow_self_purchase) => {
    return window.contract.create_product({ ipfs_hash, price, review_value, allow_self_purchase });
}

export default {
    getAllProducts,
    getProductsOf,
    getProductOf,
    createProduct,
    updateProduct
}