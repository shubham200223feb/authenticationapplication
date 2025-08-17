const express= require("express");
const emailfile = require("../utile/email");
const fs= require("fs");
const path= require("path");
const bcrypt= require("bcrypt");
const user = require("../model/user")
const jwt=require("jsonwebtoken");
const sendResetEmail = require("../utile/email");
const router= express.Router();
router.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"../public/login.html"))
})
router.get("/login",(req,res)=>{
    res.sendFile(path.join(__dirname,"../public/login.html"))
})
router.get("/signup",(req,res)=>{
  res.sendFile(path.join(__dirname,"../public/signup.html"));
})
router.get("/forgetpassword",(req,res)=>{
    res.sendFile(path.join(__dirname,"../public/forgetpassword.html"));
})
router.get("/reset-password/:id",(req,res)=>{
const tokenId = req.params.id;

  // reset-password.html padh le
  let filePath = path.join(__dirname, "../public/reset-password.html");
  let html = fs.readFileSync(filePath, "utf-8");

  // placeholder replace kar de
  html = html.replace("{{tokenId}}", tokenId);
  res.send(html);
})
router.post("/reset-password/:id",async(req,res)=>{
    const {newpassword}= req.body;
    try{
        const token=req.params.id;
    console.log(token);
    const data= await user.findOne({where:{id:token}});
    const hashpassword = await bcrypt.hash(newpassword,10)
    data.password=hashpassword;
    await data.save();
    res.sendFile(path.join(__dirname,"../public/login.html"))

    }catch(error){
console.log("error while reset password");
console.log(error);
res.send("error while rest password");
    }
})
router.post("/forgetpassword",async(req,res)=>{
    const{email}=req.body;
    const data = await user.findOne({where:{email:email}});
    const id=data.id;
    try{
        if(!data){
            return res.sendFile(path.join(__dirname,"../public/signup.html"));
        }
        else{

            const link =`https://zvpdx0xj-3000.inc1.devtunnels.ms/reset-password/${id}`
         sendResetEmail(email,link)
           res.sendFile(path.join(__dirname,"../public/login.html"));
        }

    }catch(error){
        console.log("error while sending resetlink to user");
        console.log(error);
    }
})

router.post('/login',async(req,res)=>{
    const{email,password}=req.body;
    try{
    const data= await user.findOne({where:{email:email}});
    if(!data){
return res.sendFile(path.join(__dirname,"../public/signup.html"));
    }
    else{
        const comparepassword = await bcrypt.compare(password,data.password);
        if(!comparepassword){
           return res.sendFile(path.join(__dirname,"../public/login.html"));
        }
        else{
            const token = jwt.sign({id:data.id},process.env.jwt_secretecode)
            res.cookie("token", token);
            res.status(200).send("welcome dear")
        }

    }
}catch(error){
    console.log("error while login the user");
    console.log(error);
}
})
router.post("/signup",async(req,res)=>{
    try{
    const{name,email,password}=req.body;
    const data= await user.findOne({where:{email:email}});
    if(data){
        return res.sendFile(path.join(__dirname,"../public/login.html"));
    }
    console.log(name);
    const newpassword= await bcrypt.hash(password,10);
    await user.create({name,email,password : newpassword});
    const token = jwt.sign({id:data.id},process.env.jwt_secretecode)
    res.cookie("token", token);
    res.sendFile(path.join(__dirname,"../public/login.html"))
}catch(error){
    console.log("error while signup the user ");
    console.log(error)
}

})
module.exports=router;