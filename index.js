const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


app.use(express.json());
app.use(cors());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gfz3k0z.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const userCollection = client.db("taskManagement").collection('users');
    const taskCollection = client.db("taskManagement").collection('tasks');
    // const allProductsCollection = client.db("taskManagement").collection('allProducts');





    app.get('/tasks' , async(req, res) => {
      let query = {};
      if(req.query?.email){
        query = { email : req.query.email}
      }
      const result = await taskCollection.find(query).toArray();
      res.send(result);
    })


    app.put('/tasks/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)};
      const updatedData = req.body;
      const updatedDoc = {
        $set : {
          userName: updatedData.userName,
          title: updatedData.title,
          deadline: updatedData.deadline,
          priority: updatedData.priority,
          taskDescription: updatedData.taskDescription,
        }
      }
      const result = await taskCollection.updateOne(query, updatedDoc);
      res.send(result);
    })


    app.patch('/tasks/completed/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id)};
      const updatedDoc = {
        $set : {
          status: 'Completed'
        }
      }
      const result = await taskCollection.updateOne(query, updatedDoc);
      res.send(result)
    });


    app.patch('/tasks/ongoing/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id)};
      const updatedDoc = {
        $set : {
          status: 'On-going'
        }
      }
      const result = await taskCollection.updateOne(query, updatedDoc);
      res.send(result)
    });


    app.delete('/tasks/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id)};
      const result = await taskCollection.deleteOne(query);
      res.send(result);
    });



    // app.get('/allProducts', async(req, res) => {
    //   const result = await allProductsCollection.find().toArray();
    //   res.send(result);
    // })



    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send("Task Is Running")
})

app.listen(port, () => {
    console.log(`Task Management server is running ${port}`);
})