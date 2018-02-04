var request  = require("request");
var iconv = require('iconv-lite');
var cheerio = require('cheerio');


 function getInfo(username,name,session,callback){
     if(name&&username){
         request({
             url: "http://222.24.62.120/xsgrxx.aspx?xh=" + username + "&xm=" +encodeURI(name)+ '&gnmkdm=N121501',
             method: "GET",
             encoding: null,
             headers: {
                 'Referer':'http://222.24.62.120/xs_main.aspx?xh=' +username,
                 Cookie: session
             }
         },function(err,res,body){
            if(err){
                callback({
                    err:true,
                    errInfo:"can get info by this url"
                });
            }else{
                var newbody = iconv.decode(body, "GB2312").toString();
                var $ = cheerio.load(newbody);
                obj={
                    username: $("#xh").text(),
                    name: $("#xm").text(),
                    sex: $("#lbl_xb").text(),
                    college:$("#lbl_xy").text(),
                    class: $("#lbl_xzb").text()
                }
                callback(obj);
            }
         });
     }else{
         callback("the param is  error!");
     }
 }
 module.exports=getInfo;