import { create } from "ipfs-http-client";



const ipfsClient = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        // authorization: 'Bearer ' + "6a5fd39831c349fcd4524899cd0efa16"
    },
    apiPath: "/api/v0"
});



export default ipfsClient;