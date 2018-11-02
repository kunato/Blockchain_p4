# How to run

```
npm install
```

# Start Server by running

```
node server.js
```

##### Hapi is used for a server

# End Point

#### GET

```
GET localhost:8080/block/20 // Get Block #20
```

```
GET localhost:8080/stars/address:142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ //GET Block where the address is 142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ
```

```
GET http://localhost:8000/stars/hash:a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f //GET Block where the hash is a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f
```

#### POST

```
POST localhost:8080/block // Add new star to the chain
```

POST body is type application/json with a payload of

```
{
  "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ", //address is a bitcoin address
  "star": {
    "dec": "-26° 29'\'' 24.9",
    "ra": "16h 29m 1.0s",
    "story": "Found star using https://www.google.com/sky/"
  }
}
```
