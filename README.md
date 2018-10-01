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

#### POST

```
POST localhost:8080/block/ // Add new block to the chain
```

POST body is type application/json with a payload of

```
{
    "body": "Testing block with test string data"
}
```
