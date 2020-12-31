import ipfs from "../ipfs";
import axios from 'axios';

const getProfile = async (account) => {
    try {
        const ipfsHash = await window.contract.getProfile({ account })
        const ipfsData = await axios.get(ipfs.hashToUrl(ipfsHash)).then(res => res.data);
        return { ...ipfsData, ipfsHash }
    } catch (e) {
        throw e;
    }
}

const updateProfile = async (ipfsHash) => {
    return window.contract.updateProfile({ ipfsHash });
}

export default {
    getProfile,
    updateProfile
}