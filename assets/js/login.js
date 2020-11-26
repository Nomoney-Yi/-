$(function() {
    //点击去注册的链接
    $("#link_reg").on('click', function() {
            $('.reg-box').show();
            $('.login-box').hide();
        })
        //点击去登录的链接
    $('#link_login').on('click', function() {
        $('.reg-box').hide();
        $('.login-box').show();
    })

    //给表单添加自定义验证规则
    layui.form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        //验证用户两次输入的密码是不是相同
        repwd: function(value) {
            var pwd = $('.reg-box [name=password]').val();
            if (value != pwd) {
                return "两次密码不一致"
            }
        }
    })

    //监听注册表单的提交事件
    $('#regForm').on('submit', function(e) {
        //阻止表单的默认提交行为
        e.preventDefault();
        console.log($(this).serialize());
        //发送ajax的post请求
        $.ajax({
            type: 'post',
            url: '/api/reguser',
            data: {
                username: $("#regForm [name=username]").val(),
                password: $("#regForm [name=password]").val()
            },
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('注册成功，请登录！')
                    //注册成功后自动跳转到登录页面
                    // 模拟人的点击行为
                $('#link_login').click()
            }
        })
    })

    //监听登录表单的提交事件
    $('#loginForm').on('submit', function(e) {
        //阻止表单的默认提交行为
        e.preventDefault();
        console.log(123);
        //发送ajax的post请求
        $.ajax({
            url: '/api/login',
            type: 'post',
            //快速获取表单中的数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败')
                }
                layer.msg('登录成功')
                    // 将登录成功得到的 token 字符串，保存到 localStorage 中
                localStorage.setItem('token', res.token)
                    // 跳转到后台主页
                location.href = 'index.html'
            }
        })
    })
})