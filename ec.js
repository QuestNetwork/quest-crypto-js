let WebCrypto;
if(typeof window != 'undefined' && typeof window.crypto != 'undefined'){
  WebCrypto = window.crypto;
}
else{
  let { Crypto } = require("@peculiar/webcrypto");
  WebCrypto = new Crypto();
}

import { Convert } from "./convert.js";



export class Ec {

  constructor(){
    this.convert = new Convert();
  }

async  digest(algo,data){
   return await WebCrypto.subtle.digest(algo, data)
  }

  async generateKeyPair(){
    let keyPair =  await WebCrypto.subtle.generateKey({
      name: 'ECDSA',
      namedCurve: 'P-521'
    },
    true,
    ["sign","verify"]);


    let channelPubKeyJWK =  await WebCrypto.subtle.exportKey('jwk',keyPair.publicKey);
    let channelPrivKeyJWK = await WebCrypto.subtle.exportKey('jwk',keyPair.privateKey);

    let channelPubKeyStringify =  JSON.stringify(channelPubKeyJWK);
    let channelPrivKeyStringify = JSON.stringify(channelPrivKeyJWK);
    let channelPubKey = Buffer.from(channelPubKeyStringify,'utf8').toString('hex');
    let channelPrivKey =  Buffer.from(channelPrivKeyStringify,'utf8').toString('hex');

    let keys = {};
    keys['pubKey'] = channelPubKey;
    keys['privKey'] = channelPrivKey;
    return keys;
  }

    async sign(obj, keyHex){
      // console.log('signing!');
      // console.log(obj['channel']);
      let key = await this.convert.importKey('ECDSA','jwk','hex',keyHex);
      let string = JSON.stringify(obj);
      let encoded = new TextEncoder().encode(string);
      let sigArrayBuffer = await WebCrypto.subtle.sign(
       {
         name: "ECDSA",
         namedCurve: "P-521",
         hash: {name: "SHA-512"},
       },
       key,
       encoded
      );
      obj['sig'] = Buffer.from(sigArrayBuffer).toString('hex');
      return obj;
    }

    async verify(obj, keyHex){
      let key = await this.convert.importKey('ECDSA','jwk','hex',keyHex);
      let sig = this.convert.bufferToArrayBuffer(Buffer.from(obj['sig'], 'hex'));
      //remove
      delete obj['sig'];
      let encoded = new TextEncoder().encode(JSON.stringify(obj));
      return await WebCrypto.subtle.verify(
        {
          name: "ECDSA",
          hash: {name: "SHA-512"},
        },
        key,
        sig,
        encoded
      );
    }

}
