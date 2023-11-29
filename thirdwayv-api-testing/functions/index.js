const functions = require("firebase-functions");
const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey1.json");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


const express = require("express");
const cors = require("cors");
// const {QuerySnapshot} = require("firebase-admin/firestore");

// MAin App
const app = express();
app.use(cors({origin: true}));

// Main database reference
const db = admin.firestore();

// Routes
app.get("/home", (req, res) => {
  return res.status(200).send("Hello Gegzo");
});

// Create
// POST
app.post("/api/create", (req, res)=>{
  (async () =>{
    try {
      await db.collection("products").doc("/"+ req.body.id +"/")
          .create({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
          });
      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});
// Read a specific product based on specific id
// GET
app.get("/api/read/:id", (req, res)=>{
  (async () =>{
    try {
      const document =db.collection("products").doc(req.params.id);
      const product = await document.get();
      const response = product.data();

      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});
// Read all product
// GET
app.get("/api/read", (req, res)=>{
  (async () =>{
    try {
      const query =db.collection("products");

      const response = [];
      await query.get().then((QuerySnapshot)=>{
        const docs = QuerySnapshot.docs; // the results of the query

        for (const doc of docs) {
          const selectedItem = {
            id: doc.id,
            name: doc.data().name,
            description: doc.data().description,
            price: doc.data().price,
          };
          response.push(selectedItem);
        }
        return response; // each then should return a value
      });
      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// Update
// PUT
app.put("/api/update/:id", (req, res)=>{
  (async () =>{
    try {
      const document = db.collection("products").doc(req.params.id);

      await document.update({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
      });

      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// Delete
// DELETE
app.delete("/api/delete/:id", (req, res)=>{
  (async () =>{
    try {
      const document = db.collection("products").doc(req.params.id);

      await document.delete();

      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});


// exports the api to firebase cloud functions
exports.app = functions.https.onRequest(app);
