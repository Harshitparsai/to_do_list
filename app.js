//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
app.set("view engine", 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
mongoose.connect('mongodb+srv://Harshit:Harshit@cluster0-izvef.mongodb.net/todoListDB', {useNewUrlParser: true});
const todoListSchema = new mongoose.Schema({
  name: String
});
const Item = mongoose.model("Item",todoListSchema);

var item1 = new Item({
  name:"Welcome to this awesome app"
});
var item2 = new Item({
  name:"Press + to add the item"
});
var item3 = new Item({
  name:"<-- press here to delete the item"
});



app.get("/", function(req, res) {
  var today = new Date();
  var options = { weekday: 'long',  day: 'numeric' , month: 'long' };

  var day = today.toLocaleDateString("en-US",options);
  Item.find({},function(err,ListItems){
    if(ListItems.length == 0 )
    {
      const defaultItem = [item1,item2,item3];
      Item.insertMany(defaultItem,function(err)
      {
        if(err)
        {
          console.log(err);
        }
        else{
          console.log("successfully inserted the data");
        }
      });
      res.redirect("/");
    }else{
    res.render('list', {
      kindOfDay: day,
      newList:ListItems
    });}

  });


});
app.post("/",function(req,res)
{  const item = req.body.item;
  const newitem = new Item({
    name:item
  });
  newitem.save();
  res.redirect("/");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function() {
  console.log("Server started on port 3000.");
});

app.post("/delete",function(req,res){
  const checkedId = req.body.checkbox;
  Item.deleteOne({_id:checkedId},function(err){
    if(err)
    {
      console.log(err);
    }
    else{
      console.log("successfully deleted");
    }
  });
  res.redirect("/");
});
