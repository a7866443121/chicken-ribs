(function(){
	/*
	1:获取用户进入与离开时的毫秒值,
	2:获取地址栏全链接
	3:获取屏幕的宽高
	4:获取浏览器版本
	5:获取点击事件的源(从body开始)
	6:获取所有的cookie
	7:生成进入应用的唯一id(每次重新载入该埋点都会重新生成)
	*/
	var BurialPoint = {
		startTime: new Date().getTime(),
		endTime: 0,
		BOMPoint:{},
		LocaltionPoint: {},
		DOMPoint:[],
		pageTitle: document.title.innerText,
		cookie:'',
		id: gethashcode(),
	};
	window.addEventListener('click',function(event){
		var obj = event.target;
		var path = getDomPath(obj);
		var ePath = event.path;
		var arr =[];
		BurialPoint.DOMPoint = path;
		BurialPoint.cookie = document.cookie;
		console.log(BurialPoint)
		$.ajax({
			type:"post",
			data: BurialPoint,
			url:"http://192.168.0.218:3000/submitBurialPoint",
			async:true,
			success: function(res){
				console.log(res);
			}
		});
	});
	//获取元素的dom树路径
	function getDomPath(el) {
	  var stack = [];
	  while ( el.parentNode != null ) {
	    var sibCount = 0;
	    var sibIndex = 0;
	    for ( var i = 0; i < el.parentNode.childNodes.length; i++ ) {
	      var sib = el.parentNode.childNodes[i];
	      if ( sib.nodeName == el.nodeName ) {
	        if ( sib === el ) {
	          sibIndex = sibCount;
	        }
	        sibCount++;
	      }
	    }
	    if ( el.hasAttribute('id') && el.id != '' ) {
	      stack.unshift(el.nodeName.toLowerCase() + '#' + el.id);
	    } else if ( sibCount > 1 ) {
	      stack.unshift(el.nodeName.toLowerCase() + ':eq(' + sibIndex + ')');
	    } else {
	      stack.unshift(el.nodeName.toLowerCase());
	    }
	    el = el.parentNode;
	  }
	
	  return stack.slice(1);
	}
	window.addEventListener('popstate',function(e){
		BurialPoint.BOMPoint = getBOMPoint();
		BurialPoint.LocaltionPoint = getLocaltionPoint();
		BurialPoint.pageTitle = document.title.innerText;
	});
	window.addEventListener('load',function(e){
		BurialPoint.BOMPoint = getBOMPoint();
		BurialPoint.LocaltionPoint = getLocaltionPoint();
	});
	
	window.addEventListener('beforeunload',function(e){
		e = e || window.event;
		BurialPoint.BOMPoint = getBOMPoint();
		BurialPoint.LocaltionPoint = getLocaltionPoint();
		BurialPoint.endTime = new Date().getTime();
		$.ajax({
			type:"post",
			data: BurialPoint,
			url:"http://192.168.0.218:3000/submitBurialPoint",
			async:true,
			success: function(res){
				console.log(res);
			}
		});
		e.returnValue = '本页面要求您确认您要离开';
		return '本页面要求您确认您要离开';
	});
	
	//获取浏览器,屏幕信息
	function getBOMPoint(){
		//bom埋点
		return {
			navigator: {
				appVersion: navigator.appVersion 
			},
			screen: {
				availHeight: screen.availHeight,
				availWidth: screen.availWidth,
			}
		};
	}
	//获取页面地址
	function getLocaltionPoint(){
		return {
			url: location.href,	
		}
	}
	//生成hash值作为id
	function gethashcode() {
		//定义一个时间戳，计算与1970年相差的毫秒数  用来获得唯一时间
		var timestamp = (new Date()).valueOf();
		var myRandom = randomWord(false, 6);
		function hashCode(str) {
			var h = 0;
			var len = str.length;
			var t = 2147483648;
			for(var i = 0; i < len; i++) {
				h = 31 * h + str.charCodeAt(i);
				if(h > 2147483647) h %= t; 
			}
			return h;
		}

		function randomWord(randomFlag, min, max) {
			var str = "";
			var range = min;
			var arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
			// 随机产生
			if(randomFlag) {
				range = Math.round(Math.random() * (max - min)) + min;
			}
			for(var i = 0; i < range; i++) {
				pos = Math.round(Math.random() * (arr.length - 1));
				str += arr[pos];
			}
			return str;
		}
		return hashCode(myRandom + timestamp.toString());
	}
})()
