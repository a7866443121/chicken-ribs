





function loadRout(s){
	//获取路由容器
	var routMain = document.getElementById('routing');
	//script标签匹配正则
	var regEx_script= /<script.*?>.*?<\/script>/ig;
	//删除上一次的js外联
	var headNodes = document.head.childNodes;
	headNodes.forEach(function(val,index){
		(val.nodeName.toLowerCase() == 'script') && (document.head.removeChild(val));
	});
	//获取html字符转
	request(s,'',function(res){
		//渲染新的路由内容仅页面
		var scriptArr = res.match(regEx_script)||[];
		scriptArr.forEach(function(val,index){
			var newScript = document.createElement('script');
			newScript.type = 'text/javascript';
			newScript.src = val.;
			cont.appendChild(newScript);
			
		})
		
		var sScript = (res.match(regEx_script)||[]).join('');
		document.head.innerHTML +=sScript;
		var htmlInner = res.replace(regEx_script,'');
		routMain.innerHTML = htmlInner;
		var inlineScript = document.getElementById('script').innerHTML;
		eval(inlineScript);
	},function(){
		
	});
}



//简易选择器
function slt(s){
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
function request(url, data, callBack, erroCallBack, Type, contentType) {
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

