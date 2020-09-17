let WebCrypto;
if(typeof(window.crypto) != 'undefined'){
  WebCrypto = window.crypto;
}
else{
  let { Crypto } = require("@peculiar/webcrypto");
  WebCrypto = new Crypto();
}

import { Convert } from "./convert.js";


export class Rsa {

  constructor(){
    this.convert = new Convert();
  }
  async generateKeyPair(){

    let oaepKeyPair = await WebCrypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-512"
      },
      true,
      ["encrypt", "decrypt"]
    );

    let pubKeyArrayBuffer =  await WebCrypto.subtle.exportKey('spki',oaepKeyPair.publicKey);
    let pubKey = Buffer.from(pubKeyArrayBuffer).toString('hex');
    let privKeyArrayBuffer = await WebCrypto.subtle.exportKey('pkcs8',oaepKeyPair.privateKey);
    let privKey = Buffer.from(privKeyArrayBuffer).toString('hex');
    let keys = {};
    keys['pubKey'] = pubKey;
    keys['privKey'] = privKey;
    return keys;
  }

  async fullEncrypt(plain,pubKey){
    // console.log('encrypting');
    let key = await this.convert.importKey('RSA-OAEP','spki','hex',pubKey);
    // console.log(key);
       let rsaEncrypted;
      try{
        rsaEncrypted = await WebCrypto.subtle.encrypt(
        {
          name: "RSA-OAEP"
        },
        key,
        Buffer.from(plain, 'utf8')
        );
        return Buffer.from(rsaEncrypted).toString('hex');
      }
      catch(error){
        throw(error);
      }
  }

  async fullDecrypt(enc,pk){
    // console.log('dencrypting',enc);
    let key = await this.convert.importKey('RSA-OAEP','pkcs8','hex',pk);
    let messageBuf = Buffer.from(enc,'hex');
    let messageBufArray = this.convert.bufferToArrayBuffer(messageBuf);
    return await this.decrypt(key,messageBufArray);
  }

  async decrypt(importedKey,encryptedSecretArrayBuffer ){
    let decryptedMessage;
   // try{
     decryptedMessage = await WebCrypto.subtle.decrypt(
     {
       name: "RSA-OAEP"
     },
     importedKey,
     encryptedSecretArrayBuffer
     );
     // DEVMODE && console.log(decryptedMessage);

      var bufView = new Uint8Array(decryptedMessage);
      var length = bufView.length;
      var rsaDecrypted = '';
      var addition = Math.pow(2,16)-1;

    for(var i = 0;i<length;i+=addition){
        if(i + addition > length){
            addition = length - i;
        }
        rsaDecrypted += String.fromCharCode.apply(null, bufView.subarray(i,i+addition));
    }
    // DEVMODE &&  console.log('decryptedMessage:'+rsaDecrypted);
    return rsaDecrypted;

  }





}
