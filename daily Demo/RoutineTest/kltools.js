
/**
 * @description 把两个值相加,并返回结果
 * @param {Number} a
 * @param {Number} b
 */
Math.add = function(a, b){
	var aLength, bLength, longest;
	try {
		aLength = a.toString().split(".")[1].length;
	} catch(f) {
		aLength = 0;
	}
	try {
		bLength = b.toString().split(".")[1].length;
	} catch(f) {
		bLength = 0;
	}
	longest = Math.pow(10, Math.max(aLength, bLength));				
	return(this.mul(a, longest) + this.mul(b, longest)) / longest;
}
/**
 * @description 把两个值相减,并返回结果
 * @param {Number} a
 * @param {Number} b
 */
Math.sub = function(a,b){
	var aLength, bLength, longest;
	try {
		aLength = a.toString().split(".")[1].length;
	} catch(f) {
		aLength = 0;
	}
	try {
		bLength = b.toString().split(".")[1].length;
	} catch(f) {
		bLength = 0;
	}
	longest = Math.pow(10, Math.max(aLength, bLength));
	return(this.mul(a, longest) - this.mul(b, longest)) / longest;
}
/**
 * @description 把两个值相乘,并返回结果
 * @param {Number} a
 * @param {Number} b
 */
Math.mul = function(a,b){
	var astr = a.toString(),
		bstr = b.toString(),
		abLength = 0;
	try {
		abLength += astr.split(".")[1].length;
	} catch(f) {}
	try {
		abLength += bstr.split(".")[1].length;
	} catch(f) {}
	return Number(astr.replace(".", "")) * Number(bstr.replace(".", "")) / Math.pow(10,abLength);
}
/**
 * @description 把两个值相除,并返回结果
 * @param {Number} a
 * @param {Number} b
 */
Math.div = function(a,b){
	var inta, 
		intb, 
		alength = 0,
		blength = 0;
	try {
		alength = a.toString().split(".")[1].length;
	} catch(g) {}
	try {
		blength = b.toString().split(".")[1].length;
	} catch(g) {}
	inta = Number(a.toString().replace(".", ""));
	intb = Number(b.toString().replace(".", ""));
	return this.mul(inta / intb, Math.pow(10, blength- alength));
}

var tools = {
	/**
	* @description 获取当前页面的IP地址和端口,(域名) 并返回;
	* @example var loca =  tools.getRootPath();
	*/
	 getRootPath : function() {
	    var pathName = window.location.pathname.substring(1);
	    var webName = pathName === '' ? '' : pathName.substring(0, pathName.indexOf('/'));
	    return window.location.protocol + '//' + window.location.host + '/' + webName + '/';
	},
	/**
	 * @description 把JSON字符串转为key=value&key=value;
	 * @param {JSON} s 如果是strin则直接返回,如果是JSON则处理后返回
	 * @example location.href = 'www.w3school.com'+forLoadHref(JSON);
	 * @return {JSON}
	 */
	forLoadHref : function(s){
		var jsonStr = ''
		if(typeof s == 'string') {
			return jsonStr;
		} else {
			for(var key in s) {
				jsonStr += (s[key] instanceof Array) ? (key + '=[' + s[key].join(',') + ']') : (key + '=' + s[key] + '&');
			}
			return jsonStr;
		}
	},
	/**
	 * @description 获取地址栏参数,传两个个或不传参数;key在前,value在后
	 * @param {String} endow = ['='] 根据该字符来切割key和value,
	 * @param {String} ident = ['&'] 根据该字符来切割每个键值对,
	 * @example var data = tools.getPathPt();
	 * @return {JSON}
	 */
	getPathPt : function(endow,ident) {
		var str = location.search;
		var j = '';
		endow = endow || '=';
		ident = ident || '&';
		
		var aParameter = str.split(ident);
		var jstr = '';
		aParameter.forEach(function(val, index) {
			var key = val.split('=')[0];
			var value = val.split('=')[1];
			jstr += '"' + key + '"' + ":" + '"' + value + '"' + ",";
		});
		jstr = jstr.slice(0, jstr.length - 1);
		jstr = "{" + jstr + "}";
		j = JSON.parse(jstr);
		return j;
	},
	/**
	 * @description 获取设备类型,'android'|| 'ios';
	 * @return {String}
	 */
	getDeviceType :function(){
		var u = navigator.userAgent;
		var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
		var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
		var deviceType = isAndroid ? 'android' : 'ios';
		return deviceType;
	},
	/**
	 * @description 一个异步请求
	 * @param {String} url = 'string',完整的请求地址;
	 * @param {JSON} data = [JSON|string]; 请求参数
	 * @param {String} type = ['POST'|'GET'] 请求方式;
	 * @param {Function} callBack = function(res){};
	 * @param {Function} errBack = function(err){};
	 * @param {Boolean} async = [true|false];
	 * @param {String} setHeader = 'srting'
	 */
	request: function(url,data,type,callBack,errBack,async,setHeader) {
		var config = {
			url:url||'',
			data:data||{},
			type:type||'POST',
			callBack:callBack||function(){},
			errBack:errBack||function(){},
			async:async||true,
			setHeader:requestHeader||'application/x-www-form-urlencoded'
		}
		var xhr = new XMLHttpRequest();
		xhr.responseType = config.dataType;
		xhr.open(config.type, config.url, config.async);
		xhr.setRequestHeader("Content-Type", config.setHeader);
		xhr.send(convertData(config.data));
		xhr.onreadystatechange = function() {
			if(xhr.readyState == 4) {
				if(xhr.status == 200) {
					(typeof xhr.response == 'string') ? config.callBack(JSON.parse(xhr.response)): config.callBack(xhr.response);
				} else {
					erroCallBack();
				}
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
	},
	/**
	 * @description Array数组去重复
	 * @param {Object} arr = [] arr 一个Array对象
	 * @return Array数组去重复
	 */
	removeArrRepeat : function(arr){
		var ret = [];
		for(var i = 0, j = ar.length; i < j; i++) {
			(ret.indexOf(ar[i]) === -1) && ret.push(ar[i]);
		}
		return ret;
	},
	/**
	 * @description 毫秒值转年-月-日  当参数为空时返回当前时间的年-月 日
	 * @param {Number} ns = new Date().getTime(); 毫秒值
	 * @param {String} ns = [-|.];分隔符
	 * @return {String} 2017-02-20
	 */
	getLocalDate : function (ns,sign) {
		var ns = ns = arguments.length >= 1 ? ns : new Date().getTime();
		var sign = sign = arguments.length == 2 ? sign : '-';
		var time =new Date(parseInt(nS));
	 	var month = (time.getMonth()+1)<10?'0'+(time.getMonth()+1):(time.getMonth()+1);
	 	var day = time.getDate()<10?'0'+time.getDate():time.getDate();
	    return time.getFullYear() + sign + month + sign + day;
	}
	/**
	 * @description 数据双向绑定
	 * @param {Object} obj = new Object();
	 * @param {String} 需要监测的属性
	 * @param {Function} 属性改变后的回调函数,传回改编后的值
	 */
	watch:function(obj,property,fc){
		Object.defineProperty(obj,val, {
		  	set : function(newVal){
		  		fc(newVal);
		  	},
		});
	}
}