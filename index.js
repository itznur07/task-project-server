const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

/** Middlewares */
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@todos.ukwfq5e.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const usersDataCollection = client.db("hkdb").collection("userdata");
    const sectorDataCollecion = client.db("hkdb").collection("selectdata");

    /** Sector Data Get Api */
    app.get("/sectordata", async (req, res) => {
      const result = await sectorDataCollecion.find().toArray();
      res.send(result);
    });

    /** User Enterd Data Get Api */
    app.get("/userdata", async (req, res) => {
      const result = await usersDataCollection.find().toArray();
      res.send(result);
    });

    /** User Enterd Data Save Api */
    app.post("/userdata", async (req, res) => {
      const data = req.body;
      const existData = await usersDataCollection.findOne(data);
      if (!existData) {
        const result = await usersDataCollection.insertOne(data);
        res.send(result);
      }
    });

    /** User Enterd Data Delete Api */
    app.delete("/userdata/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersDataCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
