var  express=require('express');            //调用express模块
var static=require('express-static');       //读取静态文件
var cookieParser=require('cookie-parser');  //解析cookie时使用
var cookieSession=require('cookie-session');//调用session模块，方便向前台发送cookie
var bodyParser=require('body-parser');      //解析返回的请求体
var mysql=require('mysql');                 //调用数据库模块
var urlLib = require("url");                //解析url时使用
//var RedisStore = require('connect-redis')(session); //使用redis存储session
var consolidate=require('consolidate');

//调用自定义模块
var dbSqlConfig = require('./libs/mysql/dbConfig');
var userSql = require('./libs/mysql/userSql');
var getVcode = require("./route/user/getVcode");
var login = require("./route/user/loginTo");
//连接池
var db=mysql.createPool(dbSqlConfig.mysql);

var server=express();
server.listen(3000);

//1.获取请求数据
//get自带
server.use(bodyParser.urlencoded({extended:true}));
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

// 创建Redis客户端
// var redisClient = redis.createClient(6379, '127.0.0.1', {auth_pass: '520956wjx'});
// 设置Express的Session存储中间件
// app.use(expressSession({store:new RedisStore({client: redisClient}), secret:'520956wjx', resave:false, saveUninitialized:false}));
// server.use(session({
//     store: new RedisStore({
//         host: "127.0.0.1",
//         port: 3000,
//         db: "admin_session"
//     }),
//     secret: 'keyboard cat'
// }));
//设置跨域server
server.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
server.use('/user/getVcode',function (req,res) {
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
server.post('/user/loginTo',function (req,res) {
    var username = req.body.username;
    var password = req.body.password;
    var session = req.body.session;
    var verCode = req.body.vcode;
    if(!username&&!password&&!session&&!verCode)
    {
        if(req.jsonp){
            res.json({err:true,errtype:'get info no params or params not enough!'}); //获取信息没有参数
        }
        else{
            res.json({err:true,errtype:'get info no params or params not enough!'});
        }
    }else{
        if(username){
            login(username, password, verCode, session, function(obj){
                if(obj.result!=null){
                    db.query(`SELECT * FROM studentinfo WHERE username = '${username}'`,function (err,data) {
                        if(err){
                            res.json({
                                err:true,
                                errInfo:'login succeed！ but database is err!',
                                result: obj.result
                            });
                        }else{
                            //如果从数据库查询不到数据，发送未注册
                            if(data.length==0){
                                res.json({
                                    err:false,
                                    result: obj.result,
                                    message:'Not Registered'
                                });
                            }else{
                                //查询到信息，发送信息以及状态
                                var message=null;
                                switch (data[0].state){
                                    case 0:
                                        message='registered successfully';
                                        break;
                                    case 1:
                                        message='Side by';
                                        break;
                                    case 2:
                                        message='Second interview through';
                                        break;
                                    case 3:
                                        message='On three sides by';
                                        break;
                                    case 4:
                                        message='On three sides by';
                                        break;
                                }
                                res.json({
                                    err:false,
                                    result: obj.result,
                                    message:message
                                });
                            }
                        }
                    })
                }else{
                    res.json({err:true,errInfo:obj.errInfo});
                }
            });
        }else{
            res.json({err:true,errType:"the param is null!!"});
        }
    }
});
server.post('/user/regist',function(req,res){
    var username = req.body.username;
    var classInfo = req.body.class;
    var name = req.body.name;
    var phone = req.body.phone;
    var email = req.body.email;
    var leaveWord = req.body.leaveWord;
    var direction = req.body.direction;
    var state = 0;
    console.log(username,classInfo,name,phone,email,leaveWord,direction);
    if(username&&phone&&name&&email&&leaveWord&&direction&&classInfo){
        db.query(userSql.insertStudent,[username,name,classInfo,phone,email,leaveWord,state,direction],function (err){
            if(err){
                console.log(err);
                res.json({
                    err:true,
                    errInfo:'insert is err!'+err,
                    message:"regist faild"
                });
            }else{
                res.json({
                    err:false,
                    message:"regist succeed!"
                });
            }
        })
    }else{
        res.json({
           err:true,
           errInfo:"the paragm is null or paragm is not enough!"
        });
    }
});

//后台采用模板引擎
//3.模板
server.engine('html', consolidate.ejs);
server.set('views', 'views');
server.set('view engine', 'html');

server.use('/admin/', require('./route/admin/admin.js')());
//静态文件位置,便于
server.use(static('./www'));
