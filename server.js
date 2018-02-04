var  express=require('express');            //调用express模块
var static=require('express-static');       //读取静态文件
var cookieParser=require('cookie-parser');  //解析cookie时使用
var cookieSession=require('cookie-session');//调用session模块，方便向前台发送cookie
var bodyParser=require('body-parser');      //解析返回的请求体
var mysql=require('mysql');                 //调用数据库模块
var urlLib = require("url");                //解析url时使用


var dbSqlConfig = require("./libs/mysql/dbConfig");
var userSql = require("./libs/mysql/userSql");
var getVcode = require("./libs/user/getVcode");
var login = require("./libs/user/loginTo");
//连接池
var db=mysql.createPool(dbSqlConfig.mysql);

var server=express();
server.listen(3000);


//2.cookie、session
server.use(cookieParser());
(function (){
    var keys=[];
    for(var i=0;i<100000;i++){
        keys[i]='a_'+Math.random();
    }
    server.use(cookieSession({
        name: 'sess_id',
        keys: keys,
        maxAge: 20*60*1000  //20min
    }));
})();

server.use('/getVcode',function (req,res) {
    getVcode(function(err, result){
        if(err){
            res.json('{"ok": "false","result":"null"}');
        }else{
            var vcodeInfo ={
                session:result.session,
                imgbuf:result.verCode
            }
            res.json(vcodeInfo);
        }
    });
});
server.use('/loginTo',function (req,res) {
    if(JSON.stringify(req.query)=='{}')
    {
        if(req.jsonp){
            res.json({err:true,errtype:'get info no params'}); //获取信息没有参数
        }
        else{
            res.json({err:true,errtype:'get info no params'});
        }
    }else{
        var username = req.query.username;
        var password = req.query.password;
        var session = req.query.session;
        var verCode = req.query.vcode;
        if(username){
            res.json({err:false});
            login(username, password, verCode, session, function(obj){
                if(obj.err){
                    res.json(obj.err);
                }else{
                    console.log(obj);
                }
            });
        }else{
            res.json({err:true});
        }
    }
});
server.use(static('./www'));
//登陆注册

