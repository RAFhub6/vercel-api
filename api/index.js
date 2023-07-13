const app = require('express')();
const { v4 } = require('uuid');
const mongoose = require('mongoose'); // include mongodb package
const bcrypt = require('bcrypt')

mongoose.set('strictQuery', true);
const url = process.env.MONGODB_URI
mongoose.connect(url)
const db = mongoose.connection;
db.on("error",(error)=>console.log(error));
db.once("open",()=>console.log("DB Connected"));
let accountSchema = new mongoose.Schema({
  uid: Number,
  username: String,
  password: String
});
// hash the password
accountSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
accountSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};
var User = mongoose.model('user', accountSchema);
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
app.post('/api/new/account', (req,res)=>{
  var new_user = new User({
    uid: Math.floor(Math.random() * (5000 - 20)) + 20,
    username: req.body.username,
    level: "new_member"
  });

  new_user.password = new_user.generateHash(req.body.password);
  new_user.save();
})
module.exports = app;