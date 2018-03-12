
var position;
window.addEventListener('DOMContentLoaded',function(){
	var url = getRootPath()+'/getJsSdkconfig';
	var sCurl = location.href;
	var sCurrURL = location.href.split('#')[0];
	var data = {	
				url:sCurrURL,
				deviceType:'wx',
				signature:'1',
				edition:'1.1'	
			}
	$.post(url,data,function(res){
		//微信分享的 js  代码
		wx.config({
			debug: false,
			appId: res.respMap.appId, // 必填，公众号的唯一标识
			timestamp:res.respMap.timestamp , // 必填，生成签名的时间戳
			nonceStr: res.respMap.noncestr, // 必填，生成签名的随机串
			signature: res.respMap.signature, // 必填，签名，见附录1
			jsApiList: [
				'onMenuShareTimeline',
				'onMenuShareAppMessage',
				'getLocation',
				'openLocation'
			] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
		});	
	})
	wx.ready(function() {
		//分享到朋友圈
		wx.onMenuShareTimeline({
			title: '押金3000起,曰(yue)个车给你',
			link: sCurl,
			imgUrl: getRootPath()+'wx/2.png',
			success: function(res) {
				// alert('已分享');
				window.location.href = sCurl;
			},
			cancel: function(res) {
				// alert('已取消');
				window.location.href = sCurl;
			},
			fail: function(res) {
				window.location.href = sCurl;
				// alert(JSON.stringify(res));
			}
		});
		//分享给朋友
		wx.onMenuShareAppMessage({
			title: '押金3000起,曰(yue)个车给你', // 分享标题
			desc: '车来米是为有车一族开发的个人金融产品。只要您名下拥有自用型轿车、SUV等私家车，可以随时通过客服电话、微信、门户等申请产品，让车成为您的经济来源之一。', // 分享描述
			link: sCurl, // 分享链接
			imgUrl: getRootPath()+'wx/2.png', // 分享图标
			type: '', // 分享类型,music、video或link，不填默认为link
			dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
			success: function() {
				// 用户确认分享后执行的回调函数
				window.location.href = sCurl;
			},
			cancel: function() {
				// 用户取消分享后执行的回调函数
				window.location.href = sCurl;
			}
		});
		//获取用户当前的地理位置
		getLocation();
		// config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就>调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
	})
}) 

function getRootPath(){ 
     var pathName = window.location.pathname.substring(1); 
     console.log(pathName);
     var webName = pathName == ''?'' : pathName.substring(0, pathName.indexOf('/')); 
     console.log(webName);
     return window.location.protocol + '//' + window.location.host + '/'+ webName + '/'; 
}

//使用微信内置地图查看位置
//参数说明 见方法体
function  openLocation(latitude,longitude,name,address,scale,infoUrl){
	wx.openLocation({
	    latitude: latitude, // 纬度，浮点数，范围为90 ~ -90
	    longitude: longitude, // 经度，浮点数，范围为180 ~ -180。
	    name: name, // 位置名
	    address: address, // 地址详情说明
	    scale: scale===""?1:scale, // 地图缩放级别,整形值,范围从1~28。默认为最大
	    infoUrl: infoUrl // 在查看位置界面底部显示的超链接,可点击跳转
	});
}

//获取用户当前的地理位置
//此四参数为用户等位置信息，使用前务必进行空判断和数据类型判断
//手机GPS不开，拒绝地理位置授权都将获取不到
function getLocation(){
wx.getLocation({
    type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
    success: function (res) {
    	//latitude= res.latitude; // 纬度，浮点数，范围为90 ~ -90
        //longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
        // speed = res.speed; // 速度，以米/每秒计
        //accuracy = res.accuracy; // 位置精度
    	position =  JSON.stringify(res);
    },
    cancel: function (res) {  
        alert('用户拒绝授权获取地理位置');  
      }  
});
}