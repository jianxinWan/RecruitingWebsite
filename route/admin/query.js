var express=require('express');
var mysql=require('mysql');

var dbSqlConfig = require("../../libs/mysql/dbConfig");
var userSql = require("../../libs/mysql/userSql");
var common = require("../../libs/encrypt/common");
var md5 = require("../../libs/encrypt/md5");
//连接池
var db=mysql.createPool(dbSqlConfig.mysql);
module.exports=function (){
    var router=express.Router();
    //检查登录状态
    router.get('/',function(req,res){
        db.query(userSql.queryAllStudent,function (err,data){
            if(err){
                res.send("database Erro!").end();
            }else{
                for(var i=0;i<data.length;i++){
                    switch(data[i].state){
                        case 0:
                            data[i].state="报名成功";
                            break;
                        case 1:
                            data[i].state="一面通过";
                            break;
                        case 2:
                            data[i].state="二面通过";
                            break;
                        case 3:
                            data[i].state="三面通过";
                            break;
                        case 4:
                            data[i].state="录取";
                            break;
                    }
                }
                res.render('./query.ejs',{usersInfo:data});
            }
        });
    });
    return router;
};

