
export default class Crypto {
    constructor() {
        this._crypto = window.crypto || false;

        if (!this._crypto || (!this._crypto.subtle && this._crypto.webkitSubtle)) {
            return false;
        }
    }

    get crypto() {
        return this._crypto;
    }

    createEncryptDecryptKeys() {
        return this.crypto.subtle.generateKey(
            {
                name: 'RSA-OAEP',
                modulusLength: 2048, // can be 1024, 2048, or 4096
                publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                hash: { name: 'SHA-1' },
            },
            true, // whether the key is extractable (i.e. can be used in exportKey)
            ['encrypt', 'decrypt', 'wrapKey', 'unwrapKey'], // must be ['encrypt', 'decrypt'] or ['wrapKey', 'unwrapKey']
        );
    }

    exportKey(key, format) {
        return this.crypto.subtle.exportKey(
            format || "jwk",
            key
        );
    }


}