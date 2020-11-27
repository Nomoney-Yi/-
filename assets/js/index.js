$(function() {
    //获取用户信息
    getUserInfo()


    // 退出功能
    $('#logout').on('click', function() {
        // alert('123')
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            //清除token
            localStorage.removeItem('token');
            // 跳转到登录页
            location.href = 'login.html';

            // 关闭 confirm 询问框
            layer.close(index)

        })

    })
})

function getUserInfo() {
    $.ajax({
        type: 'get',
        url: '/my/userinfo ',
        //请求头,配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ""
        // },
        success: function(res) {
            console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg("获取用户信息失败")
            }
            //渲染用户信息
            renderAvatar(res.data)
        },

        complete: function(res) {
            console.log(res);

            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                localStorage.removeItem('token')
                location.href = '/login.html'
            }
        }
    })
}

//渲染用户的头像   
function renderAvatar(userinfo) {
    //获取用户的名称
    var name = userinfo.nickname || userinfo.username;
    //设置欢迎的文本
    $('#welcome').html("欢迎&nbsp;&nbsp;" + name);
    //按需渲染用户的头像
    // if (userinfo.user_pro !== null) {
    //     $(".layui-nav.img").hide();
    //     $("text-avatar").show().html(name[0].toUpperCase());
    // } else {
    //     $(".layui-nav-img").show();
    //     $(".text-avatar").hide();
    // }
    if (userinfo.user_pic !== null) {
        // 3.1 渲染图片头像
        $('.layui-nav-img')
            .attr('src', userinfo.user_pic)
            .show()
        $('.text-avatar').hide()
    } else {
        // 3.2 渲染文本头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar')
            .html(first)
            .show()
    }
}