const {Sequelize}=require("sequelize");
const database= new Sequelize("newversion","root","root",{
    host:"localhost",
    dialect:"mysql",
})
module.exports= database;
