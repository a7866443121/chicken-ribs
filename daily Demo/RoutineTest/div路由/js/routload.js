;(function(){
	var routConfig = {
		'test1':'./test1.html',
		'test2':'./test2.html',
		'test3':'./test3.html'
	}
	//一个路由对象
	var route = window.route = {};
	//初始化这个路由
	window.onload = function(e){
		route.init(e);
	} 
	window.onhashchange = function(e){
		route.init(e);
	}
	route.init = function(event){
		var obj = this;
		var shash = location.hash;
		if (shash.indexOf('#/') != -1) {
			obj.hashKey = (shash.indexOf('?') != -1) ? (shash.match(/#\/.*\?/ig)[0].slice(2).split('?')[0]) : (shash.split('#/')[1]);
		} else{
			obj.hashKey = shash.split('#/')[1]||'home';
		}
		route.link(event);		
	}
	route.onBefore = function (c) {this.gobefore = c;return this;};
	route.onEnd = function (c) {this.goend = c;return this;};
	route.go = function(){
		var obj = this;
		//是否是首页	
		var srcVal = (arguments.length > 1 ? '?'+arguments[1] : '');
		location.hash = (arguments.length > 0 ? '/'+arguments[0] : location.hash)+srcVal;
		obj.hashKey = arguments.length > 0 ? arguments[0] : location.hash.split('#/')[1];		
		return this;
	}
	route.link = function (event){
		var obj = this;
		//获取路由容器
		var routMain = document.getElementById('app');
		//设置路由的key
		//路由跳转前的执行函数
		obj.gobefore&&obj.gobefore();
		//script标签匹配正则
		var regEx_script= /<script.*?>.*?<\/script>/ig;
		//删除上一次的js外联
		var scripts = document.querySelectorAll('head script');
		scripts.forEach(function(val,index){
			if(!val.hasAttribute('data-type')){
				document.head.contains(val) && document.head.removeChild(val);
			}			
		});
		
		//获取html字符转
		getcontent(routConfig[obj.hashKey],'',function(res){
			//去除html字符串中外联js标签
			var htmlInner = res.replace(regEx_script,'');
			//渲染新的路由内容仅页面
			var routeHTML = document.createElement('div');
			routeHTML.id = 'routeHTML';
			routeHTML.className = 'routeHTML';
			routeHTML.innerHTML = htmlInner;
			routMain.innerHTML = '';
			var routeVal = routMain.appendChild(routeHTML);
			//外联js执行
			var scriptArr = res.match(regEx_script)||[];
			scriptArr.forEach(function(val,index){
				var newScript = document.createElement('script');
				newScript.type = 'text/javascript';
				newScript.src = val.match(/<script .*?src=\"(.+?)\"/)[1];
				document.head.appendChild(newScript);
				if(index == scriptArr.length - 1){
					newScript.onload = function(){
						//内联js执行
						if(document.getElementById('script')){
							var inlineScript = document.getElementById('script').innerHTML;
							eval(inlineScript);		
						}
					}	
				}
			});	
			obj.goend && obj.goend();
			
		},function(){
			
		});
		
	}
	//简易选择器
	route.slt = function(s){
		return /^#(\w)+$/.test(s) ? document.querySelector(s):document.querySelectorAll(s);
	}
	//扩展数组对象
	Array.prototype.indexOf = function(val) {
		for (var i = 0; i < this.length; i++) {
			if (this[i] == val) return i;
		}
		return -1;
	};
	Array.prototype.remove = function(val) {
		var index = this.indexOf(val);
		(index > -1) && this.splice(index, 1);
	};
	Array.prototype.forEach = function(c) {	
		for (var i = 0; i < this.length; i++) {
			c(this[i],i);
		}		
	};
	NodeList.prototype.forEach = function(c) {		
		for (var i = 0; i < this.length; i++) {
			c(this[i],i);
		}		
	};
	HTMLCollection.prototype.forEach = function(c) {
		for (var i = 0; i < this.length; i++) {
			c(this[i],i);
		}		
	};
	//封装一个请求
	function getcontent(url, data, callBack, erroCallBack, Type, contentType) {
		var ajaxData = {
			type: "get",
			url: url || "",
			async: "true",
			data: data || null
		}
		var xhr = new XMLHttpRequest();
		Type && (xhr.responseType = ajaxData.dataType);
		xhr.open(ajaxData.type, ajaxData.url, ajaxData.async);
		xhr.setRequestHeader("Content-Type", 'application/x-www-form-urlencoded');
		xhr.send(convertData(ajaxData.data));
		xhr.onreadystatechange = function() {
			(xhr.readyState == 4)&&((xhr.status == 200)?callBack(xhr.response):erroCallBack());				
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
	}
})();
