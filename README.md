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

### aes

#### generatePassphrase(length)

Returns a new secure AES passphrase.
```javascript
let pwd = <os>.crypto.aes.generatePassphrase(length);
```

#### hashSecret(message,newSecret, rounds = 10)

Hashes a secret for the specified amount of rounds, anything below 5000 rounds will default to 5000.
```javascript
let hashed = <os>.crypto.aes.hashSecret(message,newSecret, rounds = 10);
```

#### encrypt(utf8OrObject, whistle = undefined)

Encrypts an object or utf8 string either with the whistle supplied or with a generated new whistle.
Returns Base64.
```javascript
let { secret, aesEncryptedB64 } = <os>.crypto.aes.encrypt('test');
```

#### decryptB64(aesEncryptedB64, secret, format = 'utf8')

Decrypts a B64 string with the whistle
Returns Base64.
```javascript
let { secret, aesEncryptedB64 } = <os>.crypto.aes.decryptB64(aesEncryptedB64, secret, format = 'utf8')
```



### qr

#### utilities.qr.generate()

Returns a DataUrl containing generated QR Code.
```javascript
let qrDataUrl = <os>.utilities.qr.generate(text);
```



## Support Us
Please consider supporting us, so that we can build a non-profit for this project (ツ)

| Ethereum| Bitcoin |
|---|---|
| `0xBC2A050E7B87610Bc29657e7e7901DdBA6f2D34E` | `bc1qujrqa3s34r5h0exgmmcuf8ejhyydm8wwja4fmq`   |
|  <img src="https://github.com/QuestNetwork/qDesk/raw/master/doc/images/eth-qr.png" >   | <img src="https://github.com/QuestNetwork/qDesk/raw/master/doc/images/btc-qr.png" > |

## License

GNU AGPLv3
