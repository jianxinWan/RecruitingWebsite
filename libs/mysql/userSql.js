var UserSQL = {
    //admin
    insertUser:'INSERT INTO adminLogin(username,password) VALUES(?,?)',//插入
    getAdminById:'SELECT * FROM adminLogin WHERE password = ? AND WHERE id = ? ',//查询id
    deleteAllInfo:'DELETE FROM adminLogin',//删除所有
    queryAll:'SELECT * FROM adminLogin', //查询所有
    //users
    queryAllStudent:'SELECT * FROM studentinfo',//查询所有
    queryInfoById:'SELECT * FROM studentinfo WHERE username = ？',
    deleteByUsername:'SELECT * FROM studentinfo WHERE username=?',//根据学号删除
    insertStudent:'INSERT INTO studentinfo(username,name,class,phone,email,leaveWord,state,direction) VALUES(?,?,?,?,?,?,?,?)'
};
module.exports = UserSQL;