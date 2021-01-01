import ipfs from "../ipfs";
import axios from 'axios';

const getProfile = async (account) => {
    try {
        const ipfsHash = await window.contract.get_profile_of({ account_id: account })
        const ipfsData = await axios.get(ipfs.hashToUrl(ipfsHash)).then(res => res.data).catch(() => ({}));
        return { ...ipfsData, ipfsHash }
    } catch (e) {
        throw e;
    }
}

const updateProfile = async (ipfsHash) => {
    return window.contract.update_profile({ ipfs_hash: ipfsHash });
}

export default {
    getProfile,
    updateProfile
}