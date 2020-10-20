const CryptoJS = require('crypto-js')
import { Convert } from "./convert.js";
const { v4: uuidv4 } = require('uuid');


export class Aes {

  constructor(){
    this.convert = new Convert();
  }



     reverseString(str) {
      if (str === "")
        return "";
      else
        return this.reverseString(str.substr(1)) + str.charAt(0);
    }


  generatePassphrase(length) {
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


  hashSecret(message,newSecret, rounds = 10){
    if(rounds < 5000){
      rounds = 5000;
    }
    //rounds = 5000;
        let key;
          let iv;

          if(newSecret == undefined || typeof newSecret == 'undefined' || newSecret.length == 0 ){
            newSecret = this.generatePassphrase(128+16);
          }



        // KEYS FROM newSecret
        if(newSecret.length > 128+15){
          key = CryptoJS.enc.Utf8.parse(newSecret.slice(0,64));         // Key: Use a WordArray-object instead of a UTF8-string / NodeJS-buffer
          iv = CryptoJS.enc.Utf8.parse(newSecret.slice(newSecret.length-64-16,newSecret.length-16));
        }
        else if(newSecret.length > 91+128+16){
          key = CryptoJS.enc.Utf8.parse(newSecret.slice(91,91+64));         // Key: Use a WordArray-object instead of a UTF8-string / NodeJS-buffer
          iv = CryptoJS.enc.Utf8.parse(newSecret.slice(newSecret.length-64-16,newSecret.length-16));
        }
        else{
          if(message == undefined || typeof message == 'undefined' || message.length == 0 ){
            message = this.generatePassphrase(128+16);
          }

          let i = 0;
          let hashedNewSecret;
          let aesSecret = newSecret;
          while(i<rounds){
            if(i > 0){
              aesSecret = hashedNewSecret;
            }

            hashedNewSecret = CryptoJS.HmacSHA512(String(message),this.reverseString(String(aesSecret))).toString();
            // console.log(hashedNewSecret);
            i++;
          }


          key = CryptoJS.enc.Utf8.parse(hashedNewSecret.slice(0,64));         // Key: Use a WordArray-object instead of a UTF8-string / NodeJS-buffer
          iv = CryptoJS.enc.Utf8.parse(hashedNewSecret.substr(newSecret.length-64));

        }

        return { newSecret, key, iv};
  }

  encrypt(utf8OrObject, whistle = undefined, salt = undefined){
    let utf8;
    if(typeof utf8OrObject == 'object'){
      utf8 = JSON.stringify(utf8OrObject);
    }
    else{
      utf8 = utf8OrObject;
    }
    //string to array buffer
    let wordArray = CryptoJS.lib.WordArray.create(this.convert.stringToArrayBuffer(utf8,'utf8'));
    return this.encryptWordArray(wordArray,whistle, salt);
  }
  encryptB64(b64, whistle = undefined){
    //string to array buffer
    // console.log('about to create word array');
    let wordArray = CryptoJS.lib.WordArray.create(this.convert.stringToArrayBuffer(b64,'base64'));
    return this.encryptWordArray(wordArray,whistle);
  }
  encryptUtf8(utf8, whistle = undefined){
    //string to array buffer
    let wordArray = CryptoJS.lib.WordArray.create(this.convert.stringToArrayBuffer(utf8,'utf8'));
    return this.encryptWordArray(wordArray,whistle);
  }
  encryptWordArray(wordArray, secret = undefined, salt = undefined){
    // console.log('encryption start...');

    let newSecret0 = "";
    let key0 = "";
    let iv0 = "";

    if(salt != undefined){
      let { newSecret, key, iv } = this.hashSecret(secret,salt);
      newSecret0 = newSecret;
      key0 = key;
      iv0 = iv;
    }
    else{
      let { newSecret, key, iv } = this.hashSecret(secret,secret);
      newSecret0 = newSecret;
      key0 = key;
      iv0 = iv;
    }

    let newSecret = newSecret0;
    let key = key0;
    let iv = iv0;

     secret = newSecret;
    // console.log('aeskey:'+key);

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
  decryptHex(enc,secret, format = 'utf8', salt = undefined ){
    let msgB64 = Buffer.from(enc,'hex').toString('base64');
    let decr = this.decryptB64(msgB64, secret, format, salt);
    // console.log(decr);
    try{
        if(typeof decr == 'string'){
            return JSON.parse(decr)
          }
    }
    catch(e){ return decr; }
  }
  decryptB64(encryptedQuestFileB64, secret, format = 'utf8', salt = undefined){


    let decryptedQuestFileWordArray;
    try{
      //aes decrypt this file
      let key = "";
      let iv = "";
      let key0 = "";
      let iv0 = "";
      if(salt != undefined){
       let  {newSecret, key, iv} = this.hashSecret(secret,salt);
       key0 = key;
       iv0 = iv;
      }
      else{
        let {newSecret, key, iv} = this.hashSecret(secret,secret);
        key0 = key;
        iv0 = iv;
      }

      key = key0;
      iv = iv0;


          // console.log('iv:'+iv);

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
