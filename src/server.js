const express = require('express');
const bodyParser = require('body-parser')

const app = express();

//express has a concept of middleware
app.use(bodyParser.json())

const hotels = []

app.get('/api/hotel',(req, res)=> {
    return res.send(hotels)
});

app.post('/api/hotel', (req, res)=> {
    const hotel = req.body;
    hotels.push(hotel)
    return res.status(201).send({
        "msg": "succes hotel created"
    });
})

app.listen(3000, ()=> {
    console.log("Server has started on port 3000")
})