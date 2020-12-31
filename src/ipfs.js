import IPFS from 'ipfs-api';

const gatewayUrl = 'https://gateway.ipfs.io/ipfs';

const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

const hashToUrl = (hash) => gatewayUrl + `/${hash}`;

const addData = (data) => ipfs.add(data);

const uploadObject = (object) => addData(Buffer.from(JSON.stringify(object)))

const uploadImage = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async e => {
        try {
            const res = await addData(Buffer.from(e.target.result));
            resolve(res[0].hash);
        } catch (error) {
            reject(error);
        }

    }

    reader.readAsArrayBuffer(file);
})

export default {
    hashToUrl,
    addData,
    uploadObject,
    uploadImage
}