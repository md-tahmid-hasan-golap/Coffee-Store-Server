const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u8prwai.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    //  "Connect the client to the server	(optional starting in v4.7)"
    await client.connect();

    // coffees collaction
     const coffeeCollaction = client.db("coffee-store").collection("coffees")
     const orderCollaction = client.db("coffee-store").collection("orders")

     // coffee post mathord
     app.post('/coffees', async(req, res) => {
        const newCoffee = req.body;
        const quantity = newCoffee.quantity
        newCoffee.quantity = parent(quantity)
        const result = await coffeeCollaction.insertOne(newCoffee)
        res.send(result)
     })

     // orders post mathord
     app.post('/orders/:coffeeId', async(req, res) => {
        const id = req.params.coffeeId;
        const newOrders = req.body;
        const result = await orderCollaction.insertOne(newOrders)
        if(result.acknowledged){
            // update quantity form coffee collaction
            await coffeeCollaction.updateOne({_id: new ObjectId(id)},
             {$inc: {
                quantity: - 1,
             }

             }
        )
        }
        res.send(result)
     })


     // coffee get limit oparation
     app.get('/coffee-limit', async(req, res) => {
        const result = await coffeeCollaction.find().limit(3).toArray()
        res.send(result)
     })

     // All coffee get  oparation
     app.get('/allCoffees', async(req, res) => {
        const result = await coffeeCollaction.find().toArray()
        res.send(result)
     })

      // coffee details get oparation
      app.get('/coffees-details/:id', async(req, res) => {
        const id = req.params.id;
        const queary = {_id: new ObjectId(id)}
        const result = await coffeeCollaction.findOne(queary)
        res.send(result)
      })

      // My added coffees get oparation
      app.get('/myAdded-coffee/:email', async(req, res) => {
        const email = req.params.email;
        const queary =  {email}
        const result = await coffeeCollaction.find(queary).toArray()
        res.send(result)
      })


          // coffee details get oparation
      app.delete('/coffeeDelete/:id', async(req, res) => {
        const id = req.params.id;
        const queary = {_id: new ObjectId(id)}
        const result = await coffeeCollaction.deleteOne(queary)
        res.send(result)
      })

          // cof get oparation
      app.put('/updadedCoffee/:id', async(req, res) => {
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)}
         const options = {upsert: true}
          const updadedCoffee = req.body
           const updadedDoc = {
                    $set: updadedCoffee
         }
         const result = await coffeeCollaction.updateOne(filter,updadedDoc,options)
        res.send(result)
      })











    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);















app.get('/', (req, res) => {
  res.send('Welcome to my coffee store project!')
})

app.listen(port, () => {
  console.log(`Welcome to my coffee store project listening on port ${port}`)
})
