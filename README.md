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

## User Registeration

```
POST localhost:8000/requestValidation
```

with a payload of
to get the validation request

```
{
	"address":"1KC1C3HB8c9Cs2iTAKyscNShNjq5esYJss"
}
```

### Then

```
POST localhost:8000/message-signature/validate
```

with a payload of

```
{
	"address":"1KC1C3HB8c9Cs2iTAKyscNShNjq5esYJss",
	"signature":"G79pPJGAxfm2dEG3UY52YIyJbyCQsuk4GJ9LXJ1jja7jey+6PJgSfOg/Slud3hhIjEgQAUpbtz62uTTEVGo54m8="
}
```

to validate message signature

## Star Chain

#### GET

```
GET localhost:8000/block/20 // Get Block #20
```

```
GET localhost:8000/stars/address:1KC1C3HB8c9Cs2iTAKyscNShNjq5esYJss //GET Block where the address is 1KC1C3HB8c9Cs2iTAKyscNShNjq5esYJss
```

```
GET localhost:8000/stars/hash:a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f //GET Block where the hash is a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f
```

#### POST

```
POST localhost:8000/block // Add new star to the chain
```

POST body is type application/json with a payload of

```
{
    "address": "1KC1C3HB8c9Cs2iTAKyscNShNjq5esYJss", //address is a bitcoin address
    "star": {
        "dec": "-26° 29 24.9",
        "ra": "16h 29m 1.0s",
        "story": "Found star using https://www.google.com/sky/"
    }
}
```
