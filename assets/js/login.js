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
})