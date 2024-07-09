const express = require("express");
const app = express();
app.set('view engine', "ejs");
app.use(express.static("public"));
app.get('/', (req,res)=>{
    res.render('home');
})
const PORT = 3000
app.listen(PORT, ()=>{console.log(`runnng on port : ${PORT}`)})