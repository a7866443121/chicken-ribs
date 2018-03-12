$(function(){
	//cookie操作页面返回是的位置
	$(function(){
		var str = window.location.href;
		str = str.substring(str.lastIndexOf("/") + 1);
		if ($.cookie(str)){
			$("html,body").animate({ scrollTop: $.cookie(str) }, 300);
		}
	})
	$(window).scroll(function () {
		var str = window.location.href;
		str = str.substring(str.lastIndexOf("/") + 1);
		var top = $(document).scrollTop();
		$.cookie(str, top, { path: '/' });
		return $.cookie(str);
	})
//点击弹出遮罩层,点击任意位置隐藏
	$("#id").click(function(e){					
		var height = $(window).height();
		//判断是否隐藏
			if($("#shade").is(":hidden")){
				for (var i = 0;i < $("#nav_list li").length;i++) {
					$("#nav_list li").eq(i).children().eq(0).removeClass("list-click");
					$("#nav_list li").eq($(this).index()).children().eq(0).addClass("list-click");
				}
				$("#shade").css("height",height);
				//是:就显示
				$("#shade").show();	
				$("body").css("height",height);
				$("body").css("overflow","hidden");	
		//否:就隐藏
			}else{
		    	$("#shade").hide();
		    	comp();
		    	$("body").css("overflow-y","auto");
		    	$("html").css("overflow-y","auto");
		   }
		//给Dom对象绑定只执行一次的点击事件	
		$(document).one("click", function(){
        	$("#shade").hide();
        	comp();
        	$("body").css("overflow-y","auto");
	    	$("html").css("overflow-y","auto");
  		});			
	    e.stopPropagation();	    
	    $("body").css("overflow-y","hidden");
	    $("html").css("overflow-y","hidden");
	})
	//阻止事件冒泡
		$("#nav_list").on("click", function(e){
		    e.stopPropagation();
		});


})
//图片懒加载
(function(a, b) {
	$window = a(b), a.fn.lazyload = function(c) {
		function f() {
			var b = 0;
			d.each(function() {
				var c = a(this);
				if(e.skip_invisible && !c.is(":visible")) return;
				if(!a.abovethetop(this, e) && !a.leftofbegin(this, e))
					if(!a.belowthefold(this, e) && !a.rightoffold(this, e)) c.trigger("appear");
					else if(++b > e.failure_limit) return !1
			})
		}
		var d = this,
			e = {
				threshold: 0,
				failure_limit: 0,
				event: "scroll",
				effect: "show",
				container: b,
				data_attribute: "original",
				skip_invisible: !0,
				appear: null,
				load: null
			};
		return c && (undefined !== c.failurelimit && (c.failure_limit = c.failurelimit, delete c.failurelimit), undefined !== c.effectspeed && (c.effect_speed = c.effectspeed, delete c.effectspeed), a.extend(e, c)), $container = e.container === undefined || e.container === b ? $window : a(e.container), 0 === e.event.indexOf("scroll") && $container.bind(e.event, function(a) {
			return f()
		}), this.each(function() {
			var b = this,
				c = a(b);
			b.loaded = !1, c.one("appear", function() {
				if(!this.loaded) {
					if(e.appear) {
						var f = d.length;
						e.appear.call(b, f, e)
					}
					a("<img />").bind("load", function() {
						c.hide().attr("src", c.data(e.data_attribute))[e.effect](e.effect_speed), b.loaded = !0;
						var f = a.grep(d, function(a) {
							return !a.loaded
						});
						d = a(f);
						if(e.load) {
							var g = d.length;
							e.load.call(b, g, e)
						}
					}).attr("src", c.data(e.data_attribute))
				}
			}), 0 !== e.event.indexOf("scroll") && c.bind(e.event, function(a) {
				b.loaded || c.trigger("appear")
			})
		}), $window.bind("resize", function(a) {
			f()
		}), f(), this
	}, a.belowthefold = function(c, d) {
		var e;
		return d.container === undefined || d.container === b ? e = $window.height() + $window.scrollTop() : e = $container.offset().top + $container.height(), e <= a(c).offset().top - d.threshold
	}, a.rightoffold = function(c, d) {
		var e;
		return d.container === undefined || d.container === b ? e = $window.width() + $window.scrollLeft() : e = $container.offset().left + $container.width(), e <= a(c).offset().left - d.threshold
	}, a.abovethetop = function(c, d) {
		var e;
		return d.container === undefined || d.container === b ? e = $window.scrollTop() : e = $container.offset().top, e >= a(c).offset().top + d.threshold + a(c).height()
	}, a.leftofbegin = function(c, d) {
		var e;
		return d.container === undefined || d.container === b ? e = $window.scrollLeft() : e = $container.offset().left, e >= a(c).offset().left + d.threshold + a(c).width()
	}, a.inviewport = function(b, c) {
		return !a.rightofscreen(b, c) && !a.leftofscreen(b, c) && !a.belowthefold(b, c) && !a.abovethetop(b, c)
	}, a.extend(a.expr[":"], {
		"below-the-fold": function(c) {
			return a.belowthefold(c, {
				threshold: 0,
				container: b
			})
		},
		"above-the-top": function(c) {
			return !a.belowthefold(c, {
				threshold: 0,
				container: b
			})
		},
		"right-of-screen": function(c) {
			return a.rightoffold(c, {
				threshold: 0,
				container: b
			})
		},
		"left-of-screen": function(c) {
			return !a.rightoffold(c, {
				threshold: 0,
				container: b
			})
		},
		"in-viewport": function(c) {
			return !a.inviewport(c, {
				threshold: 0,
				container: b
			})
		},
		"above-the-fold": function(c) {
			return !a.belowthefold(c, {
				threshold: 0,
				container: b
			})
		},
		"right-of-fold": function(c) {
			return a.rightoffold(c, {
				threshold: 0,
				container: b
			})
		},
		"left-of-fold": function(c) {
			return !a.rightoffold(c, {
				threshold: 0,
				container: b
			})
		}
	})
})(jQuery, window)
/*
将真实图片地址写在 data-original 属性中，而 src 属性中的图片换成占位符的图片（例如 1x1 像素的灰色图片或者 loading 的 gif 图片）
添加 class="lazy" 用于区别哪些图片需要延时加载，当然你也可以换成别的关键词，修改的同时记得修改调用时的 jQuery 选择器
添加 width 和 height 属性有助于在图片未加载时占满所需要的空间
<img class="lazy" src="grey.gif" data-original="example.jpg" width="640" heigh="480">
*/
//
/*js调用
$('img.lazy').lazyload(); 
 */