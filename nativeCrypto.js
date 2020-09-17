import { Aes } from "./aes.js";
import { Ec } from "./ec.js";
import { Rsa } from "./rsa.js";
import { Convert } from "./convert.js";


export class NativeCrypto {

  constructor(){

    this.ec = new Ec();
    this.rsa = new Rsa();
    this.aes = new Aes();
    this.convert = new Convert();

  }

  async generateKeyPair(format = "OAEP"){

    if(format == "OAEP"){
      return await this.rsa.generateKeyPair();
    }
    else if(format == 'EC'){
      return await this.ec.generateKeyPair();
    }

  }



}
