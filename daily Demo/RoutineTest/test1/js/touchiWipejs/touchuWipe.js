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
	var startX, startY, endX, endY;
	obj.addEventListener("touchstart", function(e) {
		startX = e.targetTouches[0].pageX;
		startY = e.targetTouches[0].pageY;
		if(config.preventEvents) {
			e.preventDefault();
			e.stopPropagation()
		}
	});
	obj.addEventListener("touchmove", function(e) {
		if(config.preventEvents) {
			e.stopPropagation()
		}
	});
	obj.addEventListener("touchend", function(e) {
		endX = e.changedTouches[0].pageX;
		endY = e.changedTouches[0].pageY;
		console.log(startX + "-" + endX);
		if(Math.abs(endX - startX) > Math.abs(endY - startY)) {
			if(endX - startX > 0 && Math.abs(endX - startX) > config.minWipeDistance) {
				config.wipeRight()
			}
			if(endX - startX < 0 && Math.abs(endX - startX) > config.minWipeDistance) {
				config.wipeLeft()
			}
		} else {
			if(endY - startY > 0 && Math.abs(endY - startY) > config.minWipeDistance) {
				config.wipeDown()
			}
			if(endY - startY < 0 && Math.abs(endY - startY) > config.minWipeDistance) {
				config.wipeUp()
			}
		}
		if((Math.abs(endX - startX) == 0) && (Math.abs(endY - startY) == 0)) {
			config.control()
		}
		if(config.preventEvents) {
			e.preventDefault();
			e.stopPropagation()
		}
	})
};