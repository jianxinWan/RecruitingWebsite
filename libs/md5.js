//实现代码加密  防止出问题
var common = require("./common.js");
var str = common.md5(""+common.MD5_SUFFIX);
console.log(str);
