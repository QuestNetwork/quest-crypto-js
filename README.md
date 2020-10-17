# Quest Crypto JS
> Shared Crypto Interface For The Quest Network

## Lead Maintainer

[StationedInTheField](https://github.com/StationedInTheField)

## Description

The Crypto class for the [Quest Network Operating System](https://github.com/QuestNetwork/quest-os-js) offers shared crypto functionality.

## Installation & Usage
```
npm install @questnetwork/quest-utilities-js@0.9.4
```

## API

### aes.generatePassphrase(length)

Returns a new secure AES passphrase.
```javascript
let pwd = <os>.crypto.aes.generatePassphrase(length);
```

### aes.hashSecret(message,newSecret, rounds = 10)

Hashes a secret for the specified amount of rounds, anything below 5000 rounds will default to 5000.
```javascript
let hashed = <os>.crypto.aes.hashSecret(message,newSecret, rounds = 10);
```

### aes.encrypt(utf8OrObject, whistle = undefined)

Encrypts an object or utf8 string either with the whistle supplied or with a generated new whistle.
Returns Base64.
```javascript
let { secret, aesEncryptedB64 } = <os>.crypto.aes.encrypt('test');
```

### aes.decryptB64(aesEncryptedB64, secret, format = 'utf8')

Decrypts a B64 string with the whistle
Returns String or Object.
```javascript
let { secret, aesEncryptedB64 } = <os>.crypto.aes.decryptB64(aesEncryptedB64, secret, format = 'utf8')
```

### aes.decryptHex(enc,secret, format = 'utf8'

Decrypts a Hex string with the whistle
Returns String or Object.
```javascript
let { secret, aesEncryptedB64 } = <os>.crypto.aes.decryptHex(aesEncryptedHex, secret, format = 'utf8')
```

### convert.stringToArrayBuffer(string,format)

Returns an ArrayBuffer of the input string.
```javascript
let aB = <os>.crypto.convert.stringToArrayBuffer(string,'utf8');
```

### convert.bufferToArrayBuffer(buf)

Returns an ArrayBuffer of the input butter
```javascript
let hashed = <os>.crypto.convert.bufferToArrayBuffer(buf);
```

### async convert.importKey(alg,format,keyenc,key)

Imports a key for WebCrypto.
```javascript
await <os>.crypto.convert.importKey(alg,format,keyenc,key);
```

### async ec.digest(algo,data)

Digests data using the supplied algorithm.
```javascript
let digest = await <os>.crypto.ec.digest('SHA-256',data);
```

### async ec.generateKeyPair()

Generates an EC keypair with maximum security according to the Quest Network protocol.
```javascript
let keys = await <os>.crypto.ec.generateKeyPair();
```

### async ec.sign(obj, keyHex)
Signs an object with an EC private Hex key according to the Quest Network protocol.
```javascript
let signedObject = await <os>.crypto.ec.sign(obj,keyHex);
```

### async ec.verify(obj, keyHex)
Verifies a signed object with an EC public Hex key according to the Quest Network protocol.
```javascript
if(await <os>.crypto.ec.verify(obj,keyHex)){
  console.log('Signature Checks Out!');
}
```

### async rsa.generateKeyPair()

Generates an RSA keypair with maximum security according to the Quest Network protocol.
```javascript
let keys = await <os>.crypto.rsa.generateKeyPair();
```

### async rsa.fullEncrypt(plain,pubKey)

Encrypts a string with an RSA private key
```javascript
let encrypted = await <os>.crypto.rsa.fullEncrypt(plain,pubKey);
```


### async rsa.fullDecrypt(enc,pk)
Decrypts a string with an RSA public key
```javascript
let decrypted = await <os>.crypto.rsa.fullDecrypt(encrypted,pk);
```


## Support Us
Please consider supporting us, so that we can build a non-profit for this project (ツ)

| Ethereum| Bitcoin |
|---|---|
| `0xBC2A050E7B87610Bc29657e7e7901DdBA6f2D34E` | `bc1qujrqa3s34r5h0exgmmcuf8ejhyydm8wwja4fmq`   |
|  <img src="https://github.com/QuestNetwork/qDesk/raw/master/doc/images/eth-qr.png" >   | <img src="https://github.com/QuestNetwork/qDesk/raw/master/doc/images/btc-qr.png" > |

## License

GNU AGPLv3
