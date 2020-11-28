$(function() {

    var layer = layui.layer
    var form = layui.form

    initArtCateList()

    //获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                if (res.status != 0) {
                    return layui.layer.msg('获取文章分类列表失败');
                }
                var htmlStr = template("tpl-table", res)
                $('tbody').html(htmlStr)
            }
        })
    }

    // 给添加类别绑定点击事件
    var indexAdd = null
    $('#btnAddCate').on('click', function() {
        //弹出层
        indexAdd = layer.open({
            type: 1,
            area: ["500px", "250px"],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    })

    // 为添加表单添加submit事件
    $('body').on("submit", "#form-add", function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                initArtCateList()
                layer.msg('新增分类成功！')
                    // 根据索引，关闭对应的弹出层
                layer.close(indexAdd)
            }
        })
    })

    //为编辑按钮添加绑定事件
    var indexEdit = null
    $('body').on('click', '.btn-edit', function() {
        indexEdit = layer.open({
            type: 1,
            area: ["500px", "250px"],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })

        //获取Id  在编辑表单中渲染出对应的文本
        var id = $(this).attr('date-id')
            // 发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                form.val('form-edit', res.data)
                    // console.log(id);
            }
        })
    })


    //为修改表单添加submit事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新数据失败')
                }
                initArtCateList()
                layer.msg('更新数据成功！')
                    // 根据索引，关闭对应的弹出层
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    //给删除按钮绑定点击事件
    $('body').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id')
            //弹出询问框
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status != 0) {
                        return layer.msg('删除失败')
                    }
                    layer.msg('删除成功')
                    layer.close(index);
                    initArtCateList()
                }
            })
        })
    })
})