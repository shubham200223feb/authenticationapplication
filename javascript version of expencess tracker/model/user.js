const {DataTypes, INTEGER}= require("sequelize");
const database=require("../utile/database");
const { emitWarning } = require("process");
const user=database.define('user',{
    id:{
        autoIncrement:true,
        type:DataTypes.INTEGER,
        allowNull:false,
        primaryKey:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    email:{
    type:DataTypes.STRING,
    allowNull:false,
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    }
});
module.exports=user;