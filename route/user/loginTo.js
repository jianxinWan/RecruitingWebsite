var  request = require('request');
var cheerio = require('cheerio');
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
                console.log(newbody);
                var $ = cheerio.load(newbody);
                if (!$("#form1").html()) {
                    var name = $("#xhxm").text().split('同学')[0];
                    if(name){
                        getInfo(username,name,session,function(obj){
                            if(obj.err){
                                callback({err:true,errInfo:obj.errInfo,result:null});
                            }else{
                                callback({err:false,errInfo:null,result:obj.result});
                            }
                        });
                    }else{
                        callback({err:true,errInfo:"getInfo have an erro!",result:null});
                    }
                }else{
                    var errInfo = $("#form1").html().split("alert('")[1].split("');")[0];
                    if (errInfo == '验证码不正确！！') {
                        callback({
                            err: true,
                            errInfo: 'vCode err',
                            result:null
                        });
                    }
                    if (errInfo == '密码错误！！') {
                        callback({
                            err: true,
                            errInfo: 'password err',
                            result:null
                        });
                    }
                    if (errInfo == '用户名不存在或未按照要求参加教学活动！！') {
                        callback({
                            err: true,
                            errInfo: "username err",
                            result:null
                        });
                    }
                }
            }else{
                //处理其他情况，服务器错误
                callback({
                    err: true,
                    errtype: "severs error"
                });
            }
        });
    }
}
module.exports = login;