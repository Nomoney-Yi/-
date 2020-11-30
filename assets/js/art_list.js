$(function() {
    var form = layui.form
    var laypage = layui.laypage


    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: "",
        state: "",
    }

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }


    initTable()
    initCate()

    //获取文章渲染数据的方法
    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg('获取文章失败')
                }
                //渲染模板
                var html = template('tpl-table', res)
                $('tbody').html(html)
                    //调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    //初始化文章分类
    function initCate() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status != 0) {
                    return layer.msg('获取文章分类失败')
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)

                form.render()
            }
        })
    }

    //筛选功能
    $('#form-search').on('submit', function(e) {
        e.preventDefault()
        var cate_id = $('[name=cate_id]');
        var state = $('[name=state]');

        q.cate_id = cate_id
        q.state = state
        initCate()
    })

    // 分页功能
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'next', 'skip'],
            limits: [2, 4, 6, 8, 10],
            // 分页发生切换的时候，触发 jump 回调
            // 触发 jump 回调的方式有两种：
            // 1. 点击页码的时候，会触发 jump 回调
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
            jump: function(obj, first) {
                // console.log(obj, curr);
                //把最新的页码值赋值到q这个查询参数对象中
                q.pagenum = obj.curr
                    //把最新的条目数赋值到q这个查询参数中
                q.pagesize = obj.limit
                if (!first) {
                    initTable()
                }
            }
        })
    }

    // 给删除按钮绑定点击事件
    $('tbody').on('click', '.btn-dalete', function() {
        //获取删除按钮的个数
        var len = $('.btn-dalete').length
        var id = $(this).attr('data-id')
            // console.log(id);
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something

            $.ajax({
                type: 'get',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败 ')
                    }
                    layer.msg('删除成功')
                        // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                        // 如果没有剩余的数据了,则让页码值 -1 之后,
                        // 再重新调用 initTable 方法
                    if (len === 1) {
                        //如果len的值为1，那么页面就没有数据了
                        //页脚数最小为1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index);
        })
    })
})