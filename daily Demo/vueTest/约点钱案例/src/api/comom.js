//简易选择器
export const slt = s => {
	return /^#(\w)+$/.test(s) ? document.querySelector(s) : document.querySelectorAll(s);
}
//获取缓存openid
export const getOpenId = () => getId();
//返回公共参数
export const publicData = () => {return {signature:'1',openId:getId()}};
//tost
export const tost = (content, times) => {
	//获取页面原有的tost
	var oTost = document.getElementById('tost_');
	var controll = document.getElementById('tost_').firstElementChild;
	//创建一个tost
	var oSpan = document.createElement('span');
	oSpan.innerHTML = content;
	oTost.appendChild(oSpan)
	if(!controll) {
		oTost.classList.remove('hidden');
		oTost.classList.add('show');
		setTimeout(function() {
			oTost.classList.add('hidden');
			oTost.classList.remove('show');
		}, times);
	} else {
		oTost.removeChild(controll);
		oTost.appendChild(oSpan);
		oTost.classList.remove('hidden');
		oTost.classList.add('show');
		setTimeout(function() {
			oTost.classList.add('hidden');
			oTost.classList.remove('show');
		}, times);
	}	
}

//地址栏 参数跳转www.xxx.com?name=张三&age=23
export const forLoadHref = s =>{
	var jsonStr = ''
	if(typeof s == 'string') {
		return jsonStr;
	} else {
		for(var key in s) {
			jsonStr += (s[key] instanceof Array) ? (key + '=[' + s[key].join(',') + ']') : (key + '=' + s[key] + '&');
		}
		return jsonStr;
	}
}
//获取地址栏参数
export const getPathPt = function() {
	//地址栏是否有openId?有返回''没有就去缓存取
	var openIdStr = (location.href.indexOf('openId') != -1)?'':('&openId=' + getId());
	var str = '';
	var j = '';
	if(location.href.indexOf('?') != -1) {
		str = location.href + '&signature=1' + openIdStr + '';
	} else {
		str = location.href + '?signature=1' + openIdStr;
	}
	if(str.indexOf('?') != -1) {
		var aParameter = str.split('?')[1].split('&');
		var jstr = '';
		aParameter.forEach(function(val, index) {
			var key = val.split('=')[0];
			var value = val.split('=')[1];
			jstr += '"' + key + '"' + ":" + '"' + value + '"' + ",";
		});
		jstr = jstr.slice(0, jstr.length - 1);
		jstr = "{" + jstr + "}";
		j = JSON.parse(jstr);
	}
	//地址栏参数有openId,与缓存中的openId不一致,以地址栏的未准重新缓存起来
	(j.openId)&&((getId()!=j.openId)&&(localStorage.setItem('openId',j.openId)));
	console.log('地址栏参数:');
	console.log(j);
	return j;
}
//获取缓存openId
const getId = () =>{return localStorage.getItem('openId')||false;}
