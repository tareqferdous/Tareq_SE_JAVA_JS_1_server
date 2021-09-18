const express = require('express')
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId =  require('mongodb').ObjectId
require('dotenv').config()


const app = express()
const port = 5000

app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
  res.send('Hello tech ecommerce Server!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qnprp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("techEcommerce").collection("productCollection");
  const orderCollection = client.db("techEcommerce").collection("orderCollection");

  app.post('/addProduct', (req, res) => {
    const newProduct = req.body;
    console.log('adding a new service', newProduct);
    productCollection.insertOne(newProduct)
    .then(result => {
      console.log('inserted count', result);
      res.send(result.insertedCount > 0);
    })
  });

  app.get('/productList', (req, res) => {
    productCollection.find()
    .toArray((err, result) => {
      console.log(err);
      console.log(result);
      res.send(result);
    })
  });

  app.get('/productList/:id', (req, res) => {
    const serviceId = req.params.id
    productCollection.find({_id:ObjectId(serviceId)})
    .toArray((err, result) => {
      console.log(result)
      res.send(result);
    })
  });

  app.delete('/delete/:id', (req, res) =>{
    const serviceId = req.params.id
    productCollection.deleteOne({_id:ObjectId(serviceId)})
    .then(response => {
      console.log(response)
      res.send(response.deletedCount > 0)
    })
  });

  app.post('/placeOrder', (req, res) => {
    const info = req.body;
    orderCollection.insertOne(info)
    .then(result => {
      console.log(result);
      res.send(result.insertedCount > 0)
    })
  });

  app.get('/orderList', (req, res) => {
    orderCollection.find()
    .toArray((err, result) => {
      console.log(err);
      console.log(result);
      res.send(result);
    })
  });

   console.log('database connected');
});


app.listen(process.env.PORT || port)