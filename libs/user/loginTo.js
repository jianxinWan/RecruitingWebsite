var  request = require('request');
var cheerio = require('cheerio');   //爬虫分析
var async = require('async');       //流程控制
var gbk = require('gbk');           //转编码
var iconv = require('iconv-lite');

//自定义模块
var getInfo = require('./getInfo');

function login(username, password, verCode, session, callback) {
    if (!username&&!password&&!verCode&&!session) {
        callback({
            err: true,
            errtInfo:"don't  hava param"
        })
    }
    else {
        request({
            encoding: null,
            url: 'http://222.24.62.120/default2.aspx',
            method: 'post',
            headers: {
                'Referer': 'http://222.24.62.120/default2.aspx',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'Accept-Encoding': 'gzip,deflate',
                'Accept-Language': 'zh-CN,zh;q=0.9',
                'Cache-Control': 'max-age=0',
                'Connection': 'keep-alive',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Host': '222.24.62.120',
                'Origin': 'http://222.24.62.120',
                'Upgrade-Insecure-Requests': '1',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
                'Cookie': session
            },
            form: {
                '__VIEWSTATE': 'dDwxNTMxMDk5Mzc0Ozs+lYSKnsl/mKGQ7CKkWFJpv0btUa8=',
                'txtUserName':username,
                'Textbox1': '',
                'TextBox2': password,
                'txtSecretCode':verCode,
                'RadioButtonList1': '%D1%A7%C9%FA',
                'Button1': '',
                'lbLanguage': '',
                'hidPdrs': '',
                'hidsc': ''
            }
        }, function (err, res, body) {
            if (err) {
                callback({
                    err: true,
                    errtype: "don't get info by default2.aspx"
                })
            }
            else if (!err && res.statusCode == 200) {
                var newbody = iconv.decode(body, "GB2312").toString();
                var $ = cheerio.load(newbody);
                if (!$("#form1").html()) {
                    var name = $("#xhxm").text().split('同学')[0];
                    console.log(name);
                    getInfo(username,name,session,function(obj){
                        if(obj.err){
                            console.log(obj.errInfo);
                        }else{
                            callback(obj);
                        }
                    });
                }
            }else{
                //处理其他情况
                callback({
                    err: true,
                    errtype: "severs error"
                });
            }
        });
    }
}
module.exports = login;