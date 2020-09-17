let WebCrypto;
if(typeof(window.crypto) != 'undefined'){
  WebCrypto = window.crypto;
}
else{
  let { Crypto } = require("@peculiar/webcrypto");
  WebCrypto = new Crypto();
}


export class Convert {

  constructor(){

  }


  stringToArrayBuffer(string,format){
    if(typeof(format) == 'undefined'){
      format='utf8';
    }
  let encryptedSecretBuffer = string;
  let encryptedSecretBinaryString = Buffer.from(encryptedSecretBuffer, format).toString('binary');
  let encryptedSecretArrayBuffer = new Uint8Array(encryptedSecretBinaryString.length)
   for (var i = 0; i < encryptedSecretBinaryString.length; i++) {
     encryptedSecretArrayBuffer[i] = encryptedSecretBinaryString.charCodeAt(i)
   }
   return encryptedSecretArrayBuffer;
  }




  bufferToArrayBuffer(buf) {
      var ab = new ArrayBuffer(buf.length);
      var view = new Uint8Array(ab);
      for (var i = 0; i < buf.length; ++i) {
          view[i] = buf[i];
      }
      return ab;
  }



  async importKey(alg,format,keyenc,key){
    if(format == 'jwk'){
      key = JSON.parse(Buffer.from(key,keyenc).toString('utf8'));
    }
    //else if(format == 'pkcs8'){
    //   key = Buffer.from(key,keyenc).toString('base64');
    // }
    else{
      let keyBuf = Buffer.from(key,keyenc);
      key = this.bufferToArrayBuffer(keyBuf);
    }
      let action;
      if(alg == "RSA-OAEP" && format == 'pkcs8'){
        action = ["decrypt"];
      }
      else if(alg == "RSA-OAEP" && format == 'spki'){
        action = ["encrypt"];
      }
      else if(alg == "ECDSA" && format == 'jwk'){
        action = key['key_ops'];
      }
      let keyConfig = {   //these are the algorithm options
          name: alg,
          hash: {name: "SHA-512"}, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
      }
      if(alg == "ECDSA"){
        keyConfig['namedCurve'] = "P-521";
      }

      // console.log(key);
      // console.log(key);
      let importedKey = await WebCrypto.subtle.importKey(
            format, //can be "jwk" (public or private), "spki" (public only), or "pkcs8" (private only)
            key,
            keyConfig,
            true, //whether the key is extractable (i.e. can be used in exportKey)
            action //"encrypt" or "wrapKey" for public key import or
                        //"decrypt" or "unwrapKey" for private key imports
      );
      return importedKey;
  }



}
