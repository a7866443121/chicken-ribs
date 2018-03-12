/**
 * 高仿jq选择器
 * 节点选择器
 * 匹配节点并返回一个包装过的对象
 * @version 0.0.1
 * @link https://github.com/latel/cook.js/blob/master/core/fizzle.js
 */
$ = fizzle = function(selector, context) {
	//申明fizzle对象中的属性
	//1. 以[0]开始的数组，存储匹配到的元素（隐藏）
	//2. 匹配到的元素的长度
	var length = 0,
		i, j, crumbs, nodes = [],
		node, selectorEl, offset = 0,
		rets = [];
	//我们先定义一些常用的正则检测
	//1.是否是个形如"#id"的简单字符串
	var exprId = /^#(\w)+$/;

	function isWindow(obj) {
		return obj != null && obj.window == window;
	}

	function isArray(obj) {
		return Object.prototype.toString.call(obj) == "[object Array]";
	}

	function isFunction(obj) {
		return Object.prototype.toString.call(obj) == "[object Function]";
	}

	function makeArray(iterable) {
		var ret = [],
			len = iterable.length;
		//String、window和function也有length属性
		if(len == null || typeof iterable === "string" || isFunction(iterable) || isWindow(iterable))
			ret[0] = iterable;
		else
			while(len)
				ret[--len] = iterable[len];
		return ret;
	}
	/其次定义一个重要的函数
	//函数负责对单个选择器的解析并按其提取节点
	//@param {String} crumb  xuanze器文本，如:
	//    "div#nerd.is ul.happy li p"
	//@param {DOM Object} context 上下文限定，过滤器以此开始向下搜索
	//@return {Array} 匹配到的DOM节点组成的数组
	//function matchEl (filter, context) {
	function matchEl(crumb, context) {
		var i, j, len, len2, rets = [],
			ret, tagName, id, clazz, child, pattern, type, attr, val, dice, queue;
		//handle context to make sure that it is an array
		context = isArray(context) ? context : [context];

		//标签选择器
		tagName = crumb.match(/^\w+/) !== null && crumb.match(/^\w+/)[0] || "*";
		for(i = 0, len = context.length; i < len; i++) {
			rets = rets.concat(
				makeArray(
					context[i].getElementsByTagName(tagName.toUpperCase())));
		}
		if(tagName !== "*") {
			crumb = crumb.replace(new RegExp("^" + tagName, ""), "");
		}
		//loop the left crumbs char to specialfy the ones
		//id选择器
		if(/^#/.test(crumb)) {
			id = crumb.match(/^#\w+/)[0].replace("#", "");
			crumb = crumb.replace(new RegExp("^#" + id, ""), "");
			for(j = 0, len = rets.length; j < len; j++) {
				//shortcut
				ret = rets[j];
				if(ret.id != id) {
					rets.splice(j, 1);
					len--;
					--j;
				}
			}
		}
		//类名选择器
		if(/^\./.test(crumb)) {
			clazz = crumb.match(/^\.\w+/)[0].replace(".", "");
			crumb = crumb.replace(new RegExp("^\." + clazz, ""), "");
			for(j = 0, len = rets.length; j < len; j++) {
				//shortcut
				ret = rets[j];
				className = " " + ret.className + " ";
				pattern = new RegExp(clazz, "");
				if(!pattern.test(className)) {
					rets.splice(j, 1);
					len--;
					--j;
				}
			}
		}
		//child([attr=?])子集属性选择器
		if(/^\[[^\]]*\]/.test(crumb)) {
			seed = crumb.match(/^\[[^\]]*\]/)[0].replace("[", "").replace("]", "");
			crumb = crumb.replace("[" + seed + "]", "");
			attr = seed.match(/^\w+/)[0];
			seed = seed.replace(new RegExp("^" + attr, ""), "");
			expr = seed.match(/^(!=|=)/)[0];
			seed = seed.replace(new RegExp("^" + expr, ""), "");
			val = seed;
			if(expr === "!=") {
				for(j = 0, len = rets.length; j < len; j++) {
					//shortcut
					ret = rets[j];
					if(css.attr(ret, attr) == val) {
						rets.splice(j, 1);
						len--;
						--j;
					}
				}
			} else {
				for(j = 0, len = rets.length; j < len; j++) {
					//shortcut
					ret = rets[j];
					if(css.attr(ret, attr) != val) {
						rets.splice(j, 1);
						len--;
						--j;
					}
				}
			}
		}
		//child(:odd,:even,:random)子集伪类选择器
		if(/^:/.test(crumb)) {
			seed = crumb.match(/^:\w+/)[0].replace(":", "");
			crumb = crumb.replace(new RegExp("^:" + seed, ""), "");
			type = seed.match(/^\w+/)[0];
			seed = seed.replace(type, "");
			switch(type) {
				case "odd":
					for(len = rets.length, j = rets.length - 1; j >= 0; j--) {
						//shortcut
						ret = rets[j];
						if(j % 2 == 1) {
							rets.splice(j, 1);
							len--;
							--j;
						}
					}
					break;
				case "even":
					for(len = rets.length, j = rets.length - 1; j >= 0; j--) {
						//shortcut
						ret = rets[j];
						if(j % 2 == 0) {
							rets.splice(j, 1);
							len--;
							--j;
						}
					}
					break;
				case "random":
					//如果小于1则视为百分比的几率选取
					//如果大于等于1则视为随机保留的个数
					seed = seed || 1;
					if(seed < 1) {
						for(j = 0, len = rets.length; j < len; j++) {
							//shortcut
							dice = Math.random();
							ret = rets[j];
							if(dice > seed) {
								rets.splice(j, 1);
								len--;
								--j;
							}
						}
					} else {
						queue = [];
						seed = rets.length - parseInt(seed);
						while(queue.length < seed) {
							dice = Math.round(Math.random() * (rets.length - 1));
							queue[queue.length] = rets[dice];
							rets.splice(dice, 1);
						}
					}
					break;
			}
		}
		//peal blank at head
		crumb = crumb.replace(/^\s+/, "");
		//is it nessesary to continue
		if(crumb)
			return matchEl(crumb, rets);
		else {
			//去除重复的元素
			return rets;
		}
	}
	//保证集合中至少有一个元素
	selector = selector || document;
	//保证有初始上下文，默认亦为document
	context = context && context.nodeType === 1 ? context : document;
	//根据给定的selector类型，可能有以下几种类型
	//1. 本身是Windoow等其他对象
	//2. 本身就是个DOM元素
	//3. 字符串类型
	//现在我们依次对每个情况做出处理
	//1..
	//如果是对象就直接返回
	if(typeof selector === document || isWindow(selector))
		return selector;
	//2..
	//DOM元素的nodeType值均为1
	if(selector.nodeType === 1) {
		return selector;
	}
	//3..
	//解析字符串
	if(typeof selector == "string") {
		//首先去除首尾的空白
		selector = selector.replace(/^\s+|\s+$/g, "");
		//如果选择器为类似#id的简单形式，则调用原生的方法以提升效率
		if(exprId.test(selector)) {
			return document.getElementById(selector.replace("#", ""));
		} else {
			//运行到这里意味着选择器是个比较复杂的形式
			//@var {String} selectorEl 选择器的单个元素，如：
			//    $("div#nerd.is ul.happy li p, input.me");
			//    将会被视为
			//        div#nerd.is ul.happy li p,
			//        input.me
			//    2个xuanzeqi suo pipei daode yuansu de组合
			//@var {Array} nodes 临时存储匹配到的节点
			selectorEl = selector.split(",");
			for(i = 0, len = selectorEl.length; i < len; i++) {
				j = 0;
				//空白的节点不应该被检测，写错了？
				if(selectorEl[i] && !/^\s+$/.test(selectorEl[i])) {
					nodes = matchEl(selectorEl[i], context);
					rets = rets.concat(nodes);
				}
			}
		}
	}
	return isArray(rets) ? rets[0] : rets;
};
//隐藏hide() 
Object.prototype.hide = function() {
	this.style.display = "none";
	return this;
}
//显示show()
Object.prototype.show = function() {
	this.style.display = "block";
	return this;
}
//attr()属性,可传两个参数,(一个为获取,两个为替换) 
Object.prototype.attr = function() {
	if(arguments.length == 1) {
		return eval("this." + arguments[0]);
	} else if(arguments.length == 2) {
		eval("this." + arguments[0] + "=" + arguments[1]);
		return this;
	}
}
//val()获取值
Object.prototype.val = function() {
	if(arguments.length == 0) {
		return this.value;
	} else if(arguments.length == 1) {
		this.value = arguments[0];
		return this;
	}
}
//html()设置inner
Object.prototype.html = function() {
	if(arguments.length == 0) {
		return this.innerHTML;
	} else if(arguments.length == 1) {
		this.innerHTML = arguments[0];
		return this;
	}
}
//css()设置css样式,传两个值第一个是样式名称,第二个样式值 
Object.prototype.css = function() {
	if(arguments.length == 1) {
		return eval("this.style." + arguments[0]);
	} else if(arguments.length == 2) {
		eval("this.style." + arguments[0] + "='" + arguments[1] + "'");
		return this;
	}
}
//append()在当前节点尾部追加为当前节点的子节点
Object.prototype.append = function(newElem) {
	this.innerHTML += newElem;
	return this;
}
//prepend()在当前节点内的最前面增加内容
Object.prototype.prepend = function(newElem) {
	this.innerHTML = arguments[0] + this.innerHTML;
	return this;
}
//after()在当前节点后面追加与当前节点同一父节点
Object.prototype.after = function(newElem) {
	this.outerHTML += arguments[0];
	return this;
}
//before()在当前节点前面追加与当前节点同一父节点
Object.prototype.before = function(newElem) {
	this.outerHTML = arguments[0] + this.outerHTML;
	return this;
}

//empty()清空当前节点内的所有内容
Object.prototype.empty = function() { 
	this.innerHTML = "";
	return this;
}
//replace()替换当前节点
Object.prototype.replace = function(newElem) {
	this.outerHTML = arguments[0];
	return this;
}
//是否包含此类名
//hasClass()
Object.prototype.hasClass = function(cName) {
	return !!this.className.match(new RegExp("(\\s|^)" + cName + "(\\s|$)"));
}
//addClass()添加类名
Object.prototype.addClass = function(cName) {
	if(!this.hasClass(cName)) {
		this.className += " " + cName;
	}
	return this;
}
//removeClass()删除此类名
Object.prototype.removeClass = function(cName) {
	if(this.hasClass(cName)) {
		this.className = this.className.replace(new RegExp("(\\s|^)" + cName + "(\\s|$)"), " ");
	}
	return this;
}

//ajax部分
//调用方式
/*
 * ajax({
 * 		type:"POST",
 * 		url:"ajax.php",
 * 		dataType:"json",//发送给后台的数据类型
 * 		data:{"val1":"abc","val2":123,"val3":"456"},//发送给后台的数据
 * 		beforeSend:function(){
 *			//发送前的js代码(可以不写)   
 * 		},   
 * 		success:function(msg){
 * 			//返回数据后的操作
 * 			console.log(msg)   
 * 		},   
 * 		error:function(){
 *			//报错的操作(请求不成功) 	
 * 			console.log("error")   
 * 		} 
 * })
 */
function ajax() {
	var ajaxData = {
		type: arguments[0].type || "GET",
		url: arguments[0].url || "",
		async: arguments[0].async || "true",
		data: arguments[0].data || null,
		dataType: arguments[0].dataType || "text",
		contentType: arguments[0].contentType || "application/x-www-form-urlencoded",
		beforeSend: arguments[0].beforeSend || function() {},
		success: arguments[0].success || function() {},
		error: arguments[0].error || function() {}
	}
	ajaxData.beforeSend() 
	var xhr = createxmlHttpRequest();
	xhr.responseType = ajaxData.dataType;
	xhr.open(ajaxData.type, ajaxData.url, ajaxData.async);
	xhr.setRequestHeader("Content-Type", ajaxData.contentType);
	xhr.send(convertData(ajaxData.data));
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4) {
			if(xhr.status == 200) {
				ajaxData.success(xhr.response)
			} else {
				ajaxData.error()
			}
		}
	}
}

function createxmlHttpRequest() {
	if(window.ActiveXObject) {
		return new ActiveXObject("Microsoft.XMLHTTP");
	} else if(window.XMLHttpRequest) {
		return new XMLHttpRequest();
	}
}

function convertData(data) {
	if(typeof data === 'object') {
		var convertResult = "";
		for(var c in data) {
			convertResult += c + "=" + data[c] + "&";
		}
		convertResult = convertResult.substring(0, convertResult.length - 1); 
		return convertResult;
	} else {
		return data;
	}
}
/*
 * 移动端触屏滑动事件
 * 调用方式
 *	new touchWipe({
 *	    wipeObj:"demo",//调用对象的ID,必传
 *	    minWipeDistance: 30, //最小滑动距离
 *	    wipeLeft: function() { 
 *     	alert("此处写左滑后的执行代码 left"); 
 *    	},
 *	    wipeRight: function(){ 
 *   		alert("此处写右滑后的执行代码right");
 *   	},
 *	    wipeUp: function() {
 *    		alert("此处写上滑后的执行代码up"); 
 *    	},
 *	    wipeDown: function() { 
 *    		alert("此处写下滑后的执行代码down"); 
 *    	},
 *    	control: function(){
 *    		alert("此处写按压的执行代码down"); 
 *    	},
 *	    preventEvents: true //阻止事件冒泡和默认事件
 *	});
 */
Object.prototype.touchWipe = function(settings){
	//创建事件
	function isTouchDevice() {               
        try { 
            document.createEvent("TouchEvent");                 
        } catch (e) { 
       		return;
        }
    }    
    isTouchDevice();
    //申明变量    
	var config = {
		wipeObj:null,
		minWipeDistance: 30,
		wipeLeft: function() { },
		wipeRight: function() { },
		wipeUp: function() { },
		wipeDown: function() { },
		preventDefaultEvents: true
 	};
 	//重新赋值
 	if (settings){
 		config = settings;
 	}
 	//获取调用对象
 	var obj=document.getElementById(config.wipeObj);  	        
    var startX,startY,endX,endY; 
    //获取滑动开始时的坐标位置
 	obj.addEventListener("touchstart",function(e){  
        startX=e.targetTouches[0].pageX;  
        startY=e.targetTouches[0].pageY;
        //阻止默认事件和事件冒泡
        if(config.preventEvents){
        	e.preventDefault();
			e.stopPropagation();
        }
    });
    //阻止滑动中的事件冒泡
 	obj.addEventListener("touchmove",function(e){    
    	if(config.preventEvents) {
			 e.stopPropagation();
		 }
 	});
 	//获取滑动结束时候的坐标
 	obj.addEventListener("touchend",function(e){    
        endX= e.changedTouches[0].pageX;
        endY= e.changedTouches[0].pageY;
        //取X轴与Y轴的绝对值,哪个值大就是在哪个轴移动
        if(Math.abs(endX-startX) > Math.abs(endY-startY) ){
			//结束的值大于开始的值(右移动),并且绝对值大于30,     
        	if (endX - startX > 0 && Math.abs(endX-startX) > config. minWipeDistance) {
        		config.wipeRight();
            } 
            //结束的值小于开始的值(左移动),并且绝对值大于30,
            if(endX - startX < 0 && Math.abs(endX-startX) > config. minWipeDistance){
            	config.wipeLeft();
            } 	      
        }else{
            if(endY - startY > 0 && Math.abs(endY-startY) > config. minWipeDistance){
            	config.wipeDown();
            }
            if(endY - startY < 0 && Math.abs(endY-startY) > config. minWipeDistance){
				config.wipeUp();            	
            }            	
        }
        //按压事件
        if((Math.abs(endX-startX) == 0)&&(Math.abs(endY-startY) == 0)){  
           config.control(); 
        }
        if(config.preventEvents){
            e.preventDefault();
    		e.stopPropagation();		            	
        }
    });      	 	
}

/*
 * js判断是否是移动端,及内核
 */
var browser = { 
    versions: function() { 
        var u = navigator.userAgent; 
        return { 
            trident: u.indexOf('Trident') > -1, //IE内核 
            presto: u.indexOf('Presto') > -1, //opera内核 
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核 
            gecko: u.indexOf('Firefox') > -1, //火狐内核Gecko 
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端 
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios 
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android 
            iPhone: u.indexOf('iPhone') > -1 , //iPhone 
            iPad: u.indexOf('iPad') > -1, //iPad 
            webApp: u.indexOf('Safari') > -1 //Safari 
        }; 
    }
} 

if (browser.versions.mobile() || browser.versions.ios() || browser.versions.android() || browser.versions.iPhone() || browser.versions.iPad()) { 
    alert('移动端'); 
}