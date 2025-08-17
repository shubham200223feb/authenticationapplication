const express=require("express");
require("dotenv").config();
const app=express();
const database= require("./utile/database");
const loginrouter= require("./router/login");
const path = require("path");
const port =3000;
(async()=>{
    try{
    await database.sync({alter:true})
    console.log("sucesfully conected with database");
}catch(error){
    console.log("error while conecting with database ");
    console.log(error);

}

})();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(loginrouter);

app.listen(port,()=>{
    console.log(`server is listening in port 3000`);
})