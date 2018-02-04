window.onload=function () {
    var loginBtn = document.getElementById("submit");
    getVcode = function () {
        $.ajax({
            url: 'http://localhost:3000/getVcode',
            type: 'get',
            success: function (data) {
                if (!data.err) {
                    $('#vcode').attr({ 'src': data.imgbuf });
                    window.session = data.session;
                }
                else {
                    console.log(data);
                }
            },
            error: function () {
                alert('通信错误！');
            }
        })
    }
    getVcode();//执行一次
    $('#vcode').click(getVcode);

    loginBtn.onclick = function (){
        console.log($('#username').val(),$('#password').val(),window.session,$('#vcodeText').val());
        $.ajax({
            url: 'http://localhost:3000/loginTo',
            type: 'get',
            data:{
              username:$('#username').val(),
              password:$('#password').val(),
              vcode:$('#vcodeText').val(),
              session:window.session,
            },
            success: function (json) {
                if (!json.err) {
                    console.log(json);
                }
                else {
                    console.log(json.err);
                }
            },
            error: function () {
                alert('通信错误！');
            }
        })
    };
};