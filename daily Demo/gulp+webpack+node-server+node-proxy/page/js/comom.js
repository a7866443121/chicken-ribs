module.exports = {
	//简易选择器
	slt: function(s) {
		return /^#(\w)+$/.test(s) ? document.querySelector(s) : document.querySelectorAll(s);
	},
	//获取缓存openid
	getOpenId: function() {
		return localStorage.getItem('openId')||false;
	},
	//返回公共参数
	publicData: function() {
		var id =this.getOpenId();
		return {
			signature:'1',
			openId:id
		}
	},
	//地址栏 参数跳转
	forLoadHref: function(jStr) {
		var jsonStr = ''
		if(typeof jStr == 'string') {
			return jsonStr;
		} else {
			for(var key in jStr) {
				jsonStr += (jStr[key] instanceof Array) ? (key + '=[' + jStr[key].join(',') + ']') : (key + '=' + jStr[key] + '&');
			}
			return jsonStr;
		}
	},
	//获取地址栏参数
	getPathPt: function() {
		//地址栏是否有openId?有返回''没有就去缓存取
		var openIdStr = (location.href.indexOf('openId') != -1)?'':('&openId=' + this.getOpenId());
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
		(j.openId)&&((localStorage.getItem('openId')!=j.openId)&&(localStorage.setItem('openId',j.openId)));
		console.log('地址栏参数:');
		console.log(j);
		return j;
	},
	//缺省页创建
	createDefault: function(obj, src, ms, goTo,btnContent,icofont) {
		var innerSTR;
		if(icofont) {
			innerSTR = '<div class="default-msg"><i class="half"></i><div class="default-box">' +
				'<i class="iconfont f-theme">' + (icofont || ' ') + '</i><p class="f-666">' + ms + '</p>' +
				'<p class="f-blue" id="' + (goTo || ' ') + '">' + (btnContent || ' ') + '<i class="icon iconfont f-15">&#xe676;</i></p>'+
				'</div></div>';
		} else if(goTo) {
			innerSTR = '<div class="default-msg"><i class="half"></i><div class="default-box">' +
				'<img src="' + src + '" /><p class="f-666">' + ms + '</p>' +
				'<p class="f-blue" id="' + (goTo || ' ') + '">' + (btnContent || ' ') + '<i class="icon iconfont f-15">&#xe676;</i></p>'+
				'</div></div>';
		} else {
			innerSTR = '<div class="default-msg"><i class="half"></i><div class="default-box">' +
				'<img src="' + src + '" /><p class="fcA3">' + ms + '</p>' +
				'</div></div>';
		}
		obj.innerHTML = innerSTR;
	},
	//缺省页创建按钮
	createDefaultBtn: function(obj, src, ms, context, goTo,btnContent,icofont) {
		var innerSTR;
		if(icofont) {
			innerSTR = '<div class="default-msg"><i class="half"></i><div class="default-box">' +
				'<i class="iconfont f-theme">' + (icofont || ' ') + '</i><p class="f-theme">' + ms + '</p><p class="f-666 mt10">' + context + '</p>' +
				'<p class="f-blue-btn" id="' + (goTo || ' ') + '">' + (btnContent || ' ') + '</p>'+
				'</div></div>';
		} else if(goTo){
			innerSTR = '<div class="default-msg blue-btn"><i class="half"></i><div class="default-box">' +				
				'<img src="' + src + '" /><p class="f-theme">' + ms + '</p><p class="f-666 mt10">' + context + '</p>' +
				'<p class="f-blue-btn" id="' + (goTo || ' ') + '">' + (btnContent || ' ') + '</p>'+
				'</div></div>';
		} else {
			innerSTR = '<div class="default-msg"><i class="half"></i><div class="default-box">' +
				'<img src="' + src + '" /><p class="f-666">' + ms + '</p>' +
				'</div></div>';
		}
		obj.innerHTML = innerSTR;
	},
	//请求封装
	request: function(url, data, callBack, erroCallBack, Type, contentType) {
		var ajaxData = {
			type: "POST",
			url: url || "",
			async: "true",
			data: data || null
		}
		var xhr = new XMLHttpRequest();
		Type && (xhr.responseType = ajaxData.dataType);
		xhr.open(ajaxData.type, ajaxData.url, ajaxData.async);
		xhr.setRequestHeader("Content-Type", 'application/x-www-form-urlencoded');
		xhr.send(convertData(ajaxData.data));
		console.log('接口需求参数:');
		console.log(ajaxData.data);
		xhr.onreadystatechange = function() {
			if(xhr.readyState == 4) {
				if(xhr.status == 200) {
					(typeof xhr.response == 'string') ? callBack(JSON.parse(xhr.response)): callBack(xhr.response);
					console.log('接口返回参数:');
					console.log(xhr.response);
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
	requestFile: function(url, data, callBack, erroCallBack, Type, contentType) {
		var xhr = new XMLHttpRequest();
		Type && (xhr.responseType = dataType);
		xhr.open('POST', url, 'true');
		contentType && (xhr.setRequestHeader("Content-Type", contentType));
		xhr.send(data);
		xhr.onreadystatechange = function() {
			if(xhr.readyState == 4) {
				if(xhr.status == 200) {
					(typeof xhr.response == 'string') ? callBack(JSON.parse(xhr.response)): callBack(xhr.response);
					console.log('接口返回参数:');
					console.log(xhr.response);
				} else {
					erroCallBack();
				}
			}
		}
	},
	//去除加载动画
	loadingDone: function() {
		(document.getElementById("loader_box")) && (document.getElementById("loader_box").outerHTML = ' ');
	},
	//当前节点渐变显示
	hideShow: function(obj) {
		obj = obj || document.body;
		obj.classList.remove('transition-hide');
		obj.classList.add('transition-show');
	},
	//默认执行方法
	winload: function() {
		//禁止微信浏览器调整字体大小
		function banFsize() {
			if(typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") {
				handleFontSize();
			} else {
				if(document.addEventListener) {
					document.addEventListener("WeixinJSBridgeReady", handleFontSize, false);
				} else if(document.attachEvent) {
					document.attachEvent("WeixinJSBridgeReady", handleFontSize);
					document.attachEvent("onWeixinJSBridgeReady", handleFontSize);
				}
			}

			function handleFontSize() {
				WeixinJSBridge.invoke('setFontSizeCallback', {
					'fontSize': 0
				});
				WeixinJSBridge.on('menu:setfont', function() {
					WeixinJSBridge.invoke('setFontSizeCallback', {
						'fontSize': 0
					});
				});
			}
		}
		banFsize();

		function selfAdaption() {
			var oDocEl = document.documentElement;
			var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
			var recalc = function() {
				var nClientWidth = oDocEl.clientWidth;
				if(!nClientWidth) return;
				if(nClientWidth >= 750) {
					oDocEl.style.fontSize = '100px';
				} else {
					oDocEl.style.fontSize = 100 * (nClientWidth / 750) + 'px';
				}
			};
			if(!document.addEventListener) return;
			window.addEventListener(resizeEvt, recalc, false);
			document.addEventListener('DOMContentLoaded', recalc, false);
		}
		//selfAdaption();
		//layer阻止事件冒泡
		function stopLayerEvent(){
			var aLayer = document.getElementsByClassName('layer');
			for (var i = 0,len = aLayer.length;i<len;i++) {
				aLayer[i].addEventListener('touchmove',function(event){
					event.stopPropagation();
				});
			}
		}
		stopLayerEvent();
	}(),
	//判断是否为微信浏览器打开
	is_weixin: function() {
		var ua = navigator.userAgent.toLowerCase();
		console.log(ua);
		if(ua.match(/MicroMessenger/i) == "micromessenger") {
			return true;
		} else {
			return false;
		}
	},
	//tost
	tost: function(content, times) {
		//获取页面原有的tost
		var oTost = document.getElementById('tost_');
		var controll = document.getElementById('tost_').firstElementChild;
		//创建一个tost
		var oSpan = document.createElement('span');
		oSpan.innerHTML = content;
		oTost.appendChild(oSpan)
		if(!controll) {
			oTost.classList.remove('mui-hidden');
			oTost.classList.add('mui-block');
			setTimeout(function() {
				oTost.classList.add('mui-hidden');
				oTost.classList.remove('mui-block');
			}, times);
		} else {
			oTost.removeChild(controll);
			oTost.appendChild(oSpan);
			oTost.classList.remove('mui-hidden');
			oTost.classList.add('mui-block');
			setTimeout(function() {
				oTost.classList.add('mui-hidden');
				oTost.classList.remove('mui-block');
			}, times);
		}
	},
	//页面分享
	share: function() {
		var myurl = "https://loan.moneytocar.com/yuedianqian-wap/getJsSdkconfig";
		var sCurrURL = location.href.split('#')[0];
		var data = {
			//因二次分享微信会在连接后加上标签，所以需要编码链接
			url: encodeURIComponent(sCurrURL)
		};
		
		this.request(myurl, data, callbackfunction, erroCallback);

		function erroCallback() {}
		
		function callbackfunction(res) {
			//获取签名
			wx.config({
				debug: false,
				appId: res.respMap.appId, // 必填，公众号的唯一标识
				timestamp: res.respMap.timestamp, // 必填，生成签名的时间戳
				nonceStr: res.respMap.noncestr, // 必填，生成签名的随机串
				signature: res.respMap.signature, // 必填，签名，见附录1
				jsApiList: [
					'checkJsApi',
					'onMenuShareTimeline',
					'onMenuShareAppMessage',
					'hideMenuItems'
				] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
			});
		}

		wx.ready(function() {
			wx.hideMenuItems({
				menuList: [
					'menuItem:share:qq',
					"menuItem:share:weiboApp",
					"menuItem:favorite",
					"menuItem:share:facebook",
					'menuItem:share:QZone'
				], // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
				success: function(res) {

				}

			});
			wx.onMenuShareTimeline({
				title: '曰点钱——更值得信赖的车辆抵押贷款', // 分享标题  
				link: location.origin + '/yuedianqian/html/borrowingDemand.html', // 分享链接,以便于发展下线  
				imgUrl: location.origin + '/yuedianqian/img/logo.png', // 分享图标  
				success: function() {},
				cancel: function() {

				}
			});

			wx.onMenuShareAppMessage({
				title: '曰点钱——更值得信赖的车辆抵押贷款', // 分享标题  
				desc: '你的车比你想象的更值钱', // 分享描述
				link: location.origin + '/yuedianqian/html/borrowingDemand.html', // 分享链接,以便于发展下线  
				imgUrl: location.origin + '/yuedianqian/img/logo.png', // 分享图标  
				type: 'link' // 分享类型,music、video或link，不填默认为link
			});

			wx.error(function(res) {

			});
		});
	}
}
