/*
 *action:输入框自能匹配搜索
 *author:王小华
 *time:2017-3-10
 *params: {
 * 	data: sourceData.data.rows,//数据源
 * 	filterArray: ['mc','pym'],//搜索匹配的字段
 * 	name: 'mc',//显示的字段
 * 	multi: true,//是否多选
 *  key: 'id'//唯一标识
 *  focusdown: 'true'//获焦之后下拉列表是否展开
 *  backname: 'mc'//回写显示字段
 * }
 * fun:dataBack//数据回显供外部使用
 * fun:clear//清空数据
 *
 */

(function($, window) {
    // 初始态定义
    var setting = {};

    // 插件定义
    $.fn.Selector = function(config) {
        // 默认参数，可被重写
        var defaults = {
            key: 'id',
            multi: false,
            width: 'auto',
            focusdown: true,
            name: 'mc',
            backname: null,
            filterArray: ['mc'],
            result: [], //数据搜索结果集
            num: -1 //数据搜索结果选项序号
        };

        // dom对象定义
        var self = this,
            container = $(this[0]),
            $p = container.find('p'),
            $input = container.find('.selector-enter'),
            $data = container.find('.selector-data'),
            $ul = null,
            attr = null; //标识属性
        // 参数合并
        this.params = $.extend(defaults, config);

        /*初始化函数*/
        var init = function() {
            initData();
            loadEvent();
        }

        /*数据初始化*/
        var initData = function() {
            if(!self.params.data) {
                alert('没有数据源');
                return;
            }
            attr = (self.params.key == 'id') ? ' data-id' : ' data-dm';
            slideContent();
        }

        /*数据过滤*/
        var dataFilter = function(val) {
            var data = self.params.data;
            var cond = self.params.filterArray;
            self.params.result = [];
            if(val == '') {
                self.params.result = data;
                return;
            }
            //字母忽略大小写
            val = val.toLowerCase();
            $.each(data, function(i, v) {
                for(var n = 0; n < cond.length; n++) {
                    //匹配条件
                    if((v[cond[n]] || '').toLowerCase().indexOf(val) != -1) {
                        self.params.result.push(v);
                    }
                }
            })
            //结果去重
            self.params.result = unique(self.params.result);
        }

        /*数组去重*/
        var unique = function(arr) {
            var n = [];
            for(var i = 0; i < arr.length; i++) {
                if(n.indexOf(arr[i]) == -1) n.push(arr[i]);
            }
            return n;
        }

        /*单选下拉内容初始化*/
        var slideContent = function() {
            var width, top, left, heigth;
            $ul = $('<ul class="option-list"><ul>');
            width = (self.params.width === 'auto') ? container.outerWidth() : self.params.width;
            top = container.offset().top;
            left = container.offset().left;
            heigth = container.height();
            //$ul.css({ 'top': top + heigth + 'px', 'left': left + 'px', 'width': width + 'px' });
            $.each(self.params.data, function(i, v) {
                $ul.append('<li' + attr + '="' + v[self.params.key] + '">' + v[self.params.name] + '</li>');
            });
            $ul.appendTo(container);
        }

        var reslideUl = function() {
            $ul.html('');
            self.params.num = -1;
            var arr = self.params.result;
            if(arr.length <= 0) return;
            $.each(arr, function(i, v) {
                $ul.append('<li' + attr + '="' + v[self.params.key] + '">' + v[self.params.name] + '</li>');
            })
        }

        /*项选取*/
        var choosed = function() {
            if(self.params.multi === false) {
                $input.val($('.active-li').text());
                $input.data(self.params.key, $('.active-li').data(self.params.key));
                $ul.hide();
            } else {
                $p.append('<span' + attr + '="' + $('.active-li').data(self.params.key) + '">' + $('.active-li').text() + '</span>')
                $('.active-li').remove();
            }
            var list = $ul.children('li');
            if(self.params.num > list.length - 1) {
                self.params.num = 0;
            }
            $ul.children('li').eq(self.params.num).addClass('active-li');
            reposition();
        }

        /*存储选择值*/
        var storageData = function() {
            var idArr = [];
            var data = [];
            if(self.params.multi === false) {
                idArr.push($input.data(self.params.key));
            } else {
                $p.children('span').each(function() {
                    idArr.push($(this).data(self.params.key));
                })
            }
            for(var n = 0; n < idArr.length; n++) {
                for(var i = 0; i < self.params.data.length; i++) {
                    if(self.params.data[i][self.params.key] == idArr[n]) {
                        data.push(self.params.data[i]);
                    }
                }
            }
            $data.val(JSON.stringify(data));
        }

        var reposition = function() {
            //$input.width(container.width() - $p.width() - 10);
            //$ul.css('top', container.height() + container.offset().top + 'px');
        }

        this.dataBack = function(data) {
            self.clear();
            for(var i = 0; i < data.length; i++) {
                if(self.params.multi === true) {
                    $p.append('<span' + attr + '="' + data[i][self.params.key] + '">' + (self.params.backname ? data[i][self.params.backname] : data[i][self.params.name]) + '</span>');
                } else {
                    $input.val(data[0][self.params.name]);
                    $input.data(self.params.key, data[0][self.params.key]);
                }
            }
            reposition();
            storageData();
        }

        this.clear = function(data) {
            $input.val('');
            $input.data(self.params.key, '');
            $p.html('');
            $data.val('');
        }

        /*事件绑定*/
        var loadEvent = function() {
            /*输入框获取焦点*/
            if(self.params.focusdown === true) {
                $input.on('focus', function() {
                    $ul.show();
                })
            }
            /*输入框keyup*/
            $input.on('keyup', function(e) {
                var keyCode = e.keyCode || e.which;
                if(e.keyCode == 13 || e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40) {
                    return;
                }
                var val = $.trim($(this).val());
                dataFilter(val);
                reslideUl();
            })

            /*下拉列表点击*/
            $ul.on('click', 'li', function(e) {
                e.stopPropagation();
                choosed();
                storageData();
            })
            /*下拉列表hover*/
            $ul.on('mouseenter', 'li', function() {
                $ul.children('li').removeClass('active-li');
                $(this).addClass('active-li');
                self.params.num = $(this).index() - 1;
            })
            /*容器点击*/
            container.on('click', function(e) {
                e.stopPropagation();
                $input.focus();
            })
            $(document).on('click', function() {
                $ul.hide();
            })

            /*回车事件*/
            $input.on('keydown', function(e) {
                var keyCode = e.keyCode || e.which;
                var list = $ul.children('li');
                //回车
                if(e.keyCode == 13 && $('.active-li').length > 0) {
                    choosed();
                    storageData();
                }
                //方向键向下
                if(e.keyCode == 40) {
                    self.params.num++;
                    if(self.params.num > list.length - 1) {
                        self.params.num = 0;
                    }
                    $ul.children('li').removeClass('active-li');
                    $ul.children('li').eq(self.params.num).addClass('active-li');
                }
                //方向键向上
                if(e.keyCode == 38) {
                    self.params.num--;
                    if(self.params.num < 0) {
                        self.params.num = list.length - 1;
                    }
                    $ul.children('li').removeClass('active-li');
                    $ul.children('li').eq(self.params.num).addClass('active-li');
                }
            })

            /*已选项目点击*/
            $p.on('click', 'span', function() {
                $(this).remove();
                storageData();
                reposition();
            })
        }

        // 启动插件
        init();

        // 链式调用
        return this;
    }
    // 插件结束
})(jQuery, window);