const app = require('express')();
const express = require('express')
const { v4 } = require('uuid');
const { MongoClient, ServerApiVersion } = require('mongodb');
const bcrypt = require('bcrypt')

const url = process.env.MONGODB_URI
const db = new MongoClient(url, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

try {
    db.connect()
    db.db("admin").command({ ping: 1 });
    console.log("DB Connected. 🥳");
} catch(e) {
    // Ensures that the client will close when you finish/error
    console.error(e)
    db.close();
}
// hash the password
function generateHash(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

/* checking if password is valid
accountSchema.methods.validPassword = function(password, input) {
  return bcrypt.compareSync(input,password );
};*/
app.use(express.json())
app.get('/api', (req, res) => {
  const path = `/api/item/${v4()}`;
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
});

app.get('/api/item/:slug', (req, res) => {
  const { slug } = req.params;
  
  res.end(`Item: ${slug}`);
});
app.post('/api/new/account', async (req,res)=>{
  if (!req.body.password || !req.body.username){
    res.status(400).json({message: "Bad payload", type: "error"})
  } else {
    var users = db.db('users')
   

   try {
   users.collection("accounts").insertOne({
       uid: Math.floor(Math.random() * (5000 - 20)) + 20,
       username: req.body.username,
       password: generateHash(req.body.password),
       level: "new_member"
   }, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
  });
  users.collection("accounts").find({username: req.body.username}).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    res.json(result)
    db.close();
  });
   } catch(e){
    res.status(500).json({message: "Query exited with error.", type: "error"})
    console.error(e)
    db.close()
   }
  }
  
  
  
})
module.exports = app;