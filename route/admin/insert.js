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
        res.render('./insert.ejs',{});
    });
    router.post('/',function(req,res){
        var username = req.body.username;
        var classInfo = req.body.class;
        var name = req.body.name;
        var phone = req.body.phone;
        var email = req.body.email;
        var leaveWord = req.body.leaveWord;
        var direction = req.body.direction;
        var state = 0;
        if(username&&phone&&name&&email&&leaveWord&&direction&&classInfo){
            db.query(userSql.insertStudent,[username,name,classInfo,phone,email,leaveWord,state,direction],function (err){
                if(err){
                    console.log(err);
                    res.send(err).end();
                }else{
                    res.redirect('/admin/query');
                }
            })
        }else{
            res.send("the paragm is null or paragm is not enough!").end();
        }
    });
    return router;
};

