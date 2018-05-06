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
    router.use(function(req, res, next){
        if(!req.session['admin_id'] && req.url!='/login'){ //没有登录
            res.redirect('/admin/login');
        }else{
            next();
        }
    });
    router.get('/', function(req, res){
        res.render('./admin.ejs',{});
    });
    router.use('/login',require('./login')());
    router.use('/query',require('./query')());
    router.use('/insert',require('./insert')());
    router.use('/delate',require('./delate')());
    router.use('/amend',function(req,res){
        if(req.body.username){
            db.query(`UPDATE studentinfo SET state = ${req.body.state} WHERE username = ${req.body.username}`,function(err){
                if(err){
                    console.log(err);
                    res.send("err!").end();
                }else{
                    res.redirect('/admin/delate');
                }
            });
        }else{
            res.send("pagam  is null!");
        }
    });
    router.use('/quit',function(req,res){
        req.session['admin_id']=null;
        res.redirect('/admin/login');
    });
    return router;
};

