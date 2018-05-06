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
    router.get('/',function(req,res){
        switch(req.query.act){
            case 'mod':
                db.query(`SELECT * FROM studentinfo WHERE username=${req.query.username}`,function(err,data){
                    if(err){
                        console.error(err);
                        res.status(500).send('database error').end();
                    }else if(data.length==0){
                        res.status(404).send('data not found').end();
                    }else{
                        //渲染修改页面
                        res.render('./amend.ejs',{amendInfo:data[0]});
                    }
                 });
                break;
            case 'del':
                db.query(`DELETE FROM studentinfo WHERE username=${req.query.username}`,function(err,data){
                    if(err){
                        console.error(err);
                        res.status(500).send('database error').end();
                    }else{
                        res.redirect('/admin/query');
                    }
                });
                break;
            default:
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
                                    data[i].state="面试通过";
                                    break;
                            }
                        }
                        res.render('./delate.ejs',{usersInfo:data});
                    }
                });
        }
    });
    return router;
};

