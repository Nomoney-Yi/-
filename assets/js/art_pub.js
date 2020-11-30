$(function() {
    var form = layui.form


    initCate()

    function initCate() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg('初始化文章失败')
                }
                var htmlStr = template('cate_id', res)
                $('[name="cate_id"]').html(htmlStr)
                form.render()
            }
        })
    }


    // 调用富文本编辑器
    initEditor()




    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 给选择封面的按钮添加点击事件
    $('#btnChooseImage').on('click', function() {
        //点击了选择封面按钮就点击了隐藏的文件选择框
        $('#coverFile').click()
    })


    // 监听 coverFile 的 change 事件，获取用户选择的文件列表
    $('#coverFile').on('change', function(e) {
        // 获取到文件的列表数组
        var files = e.target.files
            // 判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])
            // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })


    //定义文章的发布状态
    var stat = "已发布";
    //为存为草稿绑定点击事件
    $("btnSave2").on('click', function() {
        stat = "草稿"
    })

    $('.layui-form').on("submit", function(e) {
        e.preventDefault();

        var fd = new FormData(this);

        fd.append("state", stat);

        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                    // 6. 发起 ajax 数据请求
                artAdd(fd)
            })

        function artAdd(fd) {
            $.ajax({
                type: "post",
                url: '/my/article/add',
                data: fd,
                //如果向服务器提交的是FormData的数据格式，必须添加以下两个方法
                contentType: false,
                processData: false,
                success: function(res) {
                    if (res.status != 0) {
                        return layer.msg('发表文章失败')
                    }
                    layer.msg('发表文章成功')
                    location.href = 'art_list.html'
                }
            })
        }
    })
})