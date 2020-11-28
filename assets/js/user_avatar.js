$(function() {
    //获取裁剪区域的DOM元素
    var $image = $("#image")
        //配置选项
    const options = {
        //横纵比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    //创建裁剪区
    $image.cropper(options)


    // 给上传按钮添加点击事件
    $("#btnChooseImage").on("click", function() {
        $("#file").click()
    })

    /* 图片 */
    $("#file").on("change", function(e) {
        var filelist = e.target.files
        if (filelist.length === 0) {
            return layer.msg("请选择照片")
        }
        //1.获取上传图片的文件对象
        var file = e.target.files[0]
            //2.将文件转化为路径
        var imgURL = URL.createObjectURL(file)
            //3.重新初始化裁剪区域
        $image
            .cropper('destroy') //销毁旧的裁剪区域
            .attr('src', imgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // var dataURL = $image
    $('#btnAvatar').on('click', function() {
        alert('123')
            // 要拿到用户裁剪之后的头像
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

        $.ajax({
            type: 'post',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('图片上传失败')
                }
                layer.msg('图片上传成功')
                window.parent.getUserInfo()
            }
        })
    })
})