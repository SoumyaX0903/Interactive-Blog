const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _=require("lodash");
const mongoose=require("mongoose");
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
const app = express();
mongoose.connect("mongodb://localhost:27017/BlogDB",{useNewUrlParser:true,useUnifiedTopology: true });
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
const blogschema={
  title:{
    type:String,
    required:[1,"No Title Specified"]
  },
  post:String
}
const blogmodel=mongoose.model("Post",blogschema);
const def=new blogmodel({
  title:"Home",
  post:homeStartingContent
})
const defaultitem=[def];
app.get("/",(req,res)=>{
  blogmodel.find((err,found)=>{
    if(err)console.log(err)
    else
    {
      if(found.length===0)
      {
        blogmodel.insertMany(defaultitem,(err)=>{
          if(err)console.log(err)
          else
          console.log("Successfully inserted default content")
        })
        res.redirect("/")
      }
      else
      {
        res.render("home",{content:found})
      }
    }
  })
})
app.get("/about",(req,res)=>{
  res.render("about",{about:aboutContent});
})
app.get("/contact",(req,res)=>{
  res.render("contact",{contact:contactContent});
})
app.get("/compose",(req,res)=>{
  res.render("compose");
})
app.post("/compose",(req,res)=>{
  let post=new blogmodel({
    title:req.body.mytitle,
    post:req.body.mypost
  })
  post.save();
  res.redirect("/");
})
app.get("/post/:source",(req,res)=>{
let x=req.params.source;
blogmodel.findOne({title:x},(err,found)=>{
  if(!err)
  {
    res.render("post",{Title:found.title,Post:found.post})
  }
})
})
app.post("/delete",(req,res)=>{
  let t=req.body.blogtitle;
  blogmodel.deleteMany({title:t},(err)=>{
    if(!err)
    res.redirect("/");
  })
})
app.listen(8080, function() {
  console.log("Server started on port 8080");
});
