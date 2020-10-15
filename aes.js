const CryptoJS = require('crypto-js')
import { Convert } from "./convert.js";
const { v4: uuidv4 } = require('uuid');


export class Aes {

  constructor(){
    this.convert = new Convert();
  }


  generatePassphrase(length) {
     length = length - 36;
     var result           = '';
     var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789-!#?';
     var charactersLength = characters.length;
     for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
     }

     //combine with uuid
     result = uuidv4() + result;

     return result;
  }
  encrypt(utf8OrObject, whistle = undefined){
    let utf8;
    if(typeof utf8OrObject == 'object'){
      utf8 = JSON.stringify(utf8OrObject);
    }
    else{
      utf8 = utf8OrObject;
    }
    //string to array buffer
    let wordArray = CryptoJS.lib.WordArray.create(this.convert.stringToArrayBuffer(utf8,'utf8'));
    return this.encryptWordArray(wordArray,whistle);
  }
  encryptB64(b64, whistle = undefined){
    //string to array buffer
    console.log('about to create word array');
    let wordArray = CryptoJS.lib.WordArray.create(this.convert.stringToArrayBuffer(b64,'base64'));
    return this.encryptWordArray(wordArray,whistle);
  }
  encryptUtf8(utf8, whistle = undefined){
    //string to array buffer
    let wordArray = CryptoJS.lib.WordArray.create(this.convert.stringToArrayBuffer(utf8,'utf8'));
    return this.encryptWordArray(wordArray,whistle);
  }
  encryptWordArray(wordArray, whistle = undefined){
    let secret;
    if(whistle == undefined || typeof(whistle) == 'undefined' || whistle.length == 0 ){
        secret = this.generatePassphrase(256);
    }
    else{
      secret = whistle;
    }
    // console.log('encryption start...');

    // KEYS FROM SECRET
    var key = CryptoJS.enc.Utf8.parse(secret.slice(0,64));         // Key: Use a WordArray-object instead of a UTF8-string / NodeJS-buffer
    var iv = CryptoJS.enc.Utf8.parse(secret.substr(secret.length-16));
    // ENCRYPT
    let aesEncryptedB64 = CryptoJS.AES.encrypt(wordArray, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }).toString();

    // RESULT
    // console.log(aesEncryptedB64);
    // console.log('encryption complete!');
    return { secret, aesEncryptedB64 }
  }
  decryptHex(enc,secret, format = 'utf8'){
    let msgB64 = Buffer.from(enc,'hex').toString('base64');
    let decr = this.decryptB64(msgB64, secret, format);
    // console.log(decr);
    try{
        if(typeof decr == 'string'){
            return JSON.parse(decr)
          }
    }
    catch(e){ return decr; }
  }
  decryptB64(encryptedQuestFileB64, secret, format = 'utf8'){
    let decryptedQuestFileWordArray;
    try{
      //aes decrypt this file
      let key = CryptoJS.enc.Utf8.parse(secret.slice(0,64));         // Key: Use a WordArray-object instead of a UTF8-string / NodeJS-buffer
      let iv = CryptoJS.enc.Utf8.parse(secret.substr(secret.length-16));
      decryptedQuestFileWordArray = CryptoJS.AES.decrypt(encryptedQuestFileB64, key, {
         iv: iv,
         mode: CryptoJS.mode.CBC,
         padding: CryptoJS.pad.Pkcs7
      });
      if(decryptedQuestFileWordArray['sigBytes'] < 1){
        throw('bad key! tell user!');
      }
    }
    catch(error){
      console.log(error);
      throw('decryption failed');
    }
    if(format == 'hex'){
      return decryptedQuestFileWordArray.toString(CryptoJS.enc.Hex);
    }
    else if(format == 'base64'){
      return decryptedQuestFileWordArray.toString(CryptoJS.enc.Base64);
    }
    else if(format == 'utf8'){
      let toHex = decryptedQuestFileWordArray.toString(CryptoJS.enc.Hex);
      return Buffer.from(toHex,'hex').toString('utf8');
    }
    // return "123";
  }



}
