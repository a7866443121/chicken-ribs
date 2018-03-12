/*
 * new touchWipe({
			wipeObj: "demo", //调用对象的ID,必传
			minWipeDistance: 30, //最小滑动距离
			touchTimes:10,//10=1秒;
			wipeLeft: function() {
				alert("此处写左滑后的执行代码 left");
			},
			wipeRight: function() {
				alert("此处写右滑后的执行代码right");
			},
			wipeUp: function() {
				alert("此处写上滑后的执行代码up");
			},
			wipeDown: function() {
				alert("此处写下滑后的执行代码down");
			},
			control: function() {
				alert("此处写按压的执行代码down");
			},
			preventEvents: true //阻止事件冒泡和默认事件
		});
 */



Object.prototype.touchWipe = function(settings) {
	function isTouchDevice() {
		try {
			document.createEvent("TouchEvent")
		} catch(e) {
			return
		}
	}
	isTouchDevice();
	var config = {
		wipeObj: null,
		touchTimes:10,
		minWipeDistance: 30,
		wipeLeft: function() {},
		wipeRight: function() {},
		wipeUp: function() {},
		wipeDown: function() {},
		preventDefaultEvents: true
	};
	if(settings) {
		config = settings
	}
	var obj = document.getElementById(config.wipeObj);
	var startX, startY, endX, endY,times = 0,sto;
	obj.addEventListener("touchstart", function(e) {
		startX = e.targetTouches[0].pageX;
		startY = e.targetTouches[0].pageY;
		if(config.preventEvents) {
			e.preventDefault();
			e.stopPropagation()
		}
		sto = setInterval(function() {
			times++;
		}, 100)
	});
	obj.addEventListener("touchmove", function(e) {
		if(config.preventEvents) {
			e.stopPropagation()
		}
	});
	obj.addEventListener("touchend", function(e) {
		endX = e.changedTouches[0].pageX;
		endY = e.changedTouches[0].pageY;
		if(Math.abs(endX - startX) > Math.abs(endY - startY)) {
			if(endX - startX > 0 && Math.abs(endX - startX) > config.minWipeDistance) {
				config.wipeRight();
			}
			if(endX - startX < 0 && Math.abs(endX - startX) > config.minWipeDistance) {
				config.wipeLeft();
			}
		} else {
			if(endY - startY > 0 && Math.abs(endY - startY) > config.minWipeDistance) {
				config.wipeDown();
			}
			if(endY - startY < 0 && Math.abs(endY - startY) > config.minWipeDistance) {
				config.wipeUp();
			}
		}
		if((Math.abs(endX - startX) == 0) && (Math.abs(endY - startY) == 0)) {
			clearTimeout(sto);
			console.log(times);
			if(times >= config.touchTimes){
				config.control();
			}
				times = 0;
		}
		if(config.preventEvents) {
			e.preventDefault();
			e.stopPropagation();
		}
	})
};