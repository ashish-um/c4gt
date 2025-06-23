const crypto = require('crypto');
const nacl = require('tweetnacl');
const { decodeBase64, encodeBase64 } = require('tweetnacl-util');
const dotenv = require('dotenv');
dotenv.config()

const SUBSCRIBER_ID = process.env.BPP_SUBSCRIBER_ID;
const UNIQUE_KEY_ID = process.env.BPP_UNIQUE_KEY_ID;
const PRIVATE_KEY = process.env.BPP_PRIVATE_KEY;

const createAuthorizationHeader = (body) => {
    const created = Math.floor(Date.now() / 1000);
    // Signature is valid for 1 minute
    const expires = created + 60; 

    const digest = crypto.createHash('sha256')
                         .update(JSON.stringify(body))
                         .digest('base64');

    const signingString = `(created): ${created}\n(expires): ${expires}\ndigest: SHA-256=${digest}`;

    const signingKey = decodeBase64(PRIVATE_KEY);
    const messageBytes = Buffer.from(signingString);
    const signatureBytes = nacl.sign.detached(messageBytes, signingKey);
    const signature = encodeBase64(signatureBytes);

    const keyId = `${SUBSCRIBER_ID}|${UNIQUE_KEY_ID}|ed25519`;
    
    const header = `Signature keyId="${keyId}",algorithm="ed25519",created="${created}",expires="${expires}",headers="(created) (expires) digest",signature="${signature}"`;

    return header;
};

module.exports = {
    createAuthorizationHeader
};