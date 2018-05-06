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
    router.get('/', function(req, res){
        res.render('./login.ejs',{});
    });
    router.post('/',function(req, res){
        var username=req.body.username;
        var password=common.md5(req.body.password+common.MD5_SUFFIX);
        console.log(password);
        db.query(`SELECT * FROM adminlogin WHERE id = '${username}'`, function(err, data){
            if(err){
                res.status(500).send('database error').end();
            }else{
                if(data.length==0){
                    res.status(400).send('no this admin').end();
                }else{
                    if(data[0].password==password){
                        //成功
                        req.session['admin_id']=data[0].id;
                        res.redirect('/admin/');
                    }else{
                        res.status(400).send('this password is incorrect').end();
                    }
                }
            }
        });
    });
    return router;
};

