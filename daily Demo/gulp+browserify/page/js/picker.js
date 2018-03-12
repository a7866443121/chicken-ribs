var data1 = [],
	myDate = new Date(),
	itemTime, initDateslt;
var data2 = [{
	text: "1月",
	value: "1"
}, {
	text: "2月",
	value: "2"
}, {
	text: "3月",
	value: "3"
}, {
	text: "4月",
	value: "4"
}, {
	text: "5月",
	value: "5"
}, {
	text: "6月",
	value: "6"
}, {
	text: "7月",
	value: "7"
}, {
	text: "8月",
	value: "8"
}, {
	text: "9月",
	value: "9"
}, {
	text: "10月",
	value: "10"
}, {
	text: "11月",
	value: "11"
}, {
	text: "12月",
	value: "12"
}, ];

//取出session
var carInfo = JSON.parse(sessionStorage.getItem("carInfo"));

$(document).ready(function() {
	var plateYear;
	if(carInfo) {
		plateYear = carInfo.year;
	} else {
		plateYear = 2007;
	}
	var numYear = plateYear;
	data1 = [];
	for(var i = myDate.getFullYear() - plateYear; i >= 0; i--) {
		data1[i] = {};
		data1[i].text = numYear + "年";
		data1[i].value = i;
		numYear++;
	}
	/**时间**/
	$('#picker').click(function() {
		$('.picker').fadeIn();
	});
	$('body').on('click', '.picker .cancel,.picker .confirm ', function() {
		$('.picker').fadeOut();
	})
	var picker4El = document.getElementById('picker');
	var itemTime = document.getElementById('item-time');
	var picker4 = new Picker({
		data: [data1, data2]
	});
	picker4.on('picker.select', function(selectedVal, selectedIndex) {
		picker4El.innerText = data1[selectedIndex[0]].text + data2[selectedIndex[1]].text;
		//		picker4El.style.color="#404040";
		var getCardDate;
		if(data2[selectedIndex[1]].text.length <= 2) {
			getCardDate = parseInt(data1[selectedIndex[0]].text) + '-0' + parseInt(data2[selectedIndex[1]].text);
		} else {
			getCardDate = parseInt(data1[selectedIndex[0]].text) + '-' + parseInt(data2[selectedIndex[1]].text);
		}
		console.log(getCardDate);
		picker4El.setAttribute("getCardDate", getCardDate);
	});
	picker4El.addEventListener('click', showPicker4, false);

	function showPicker4() {
		picker4.show(function() {
			picker4.refill([data1, data2]);
		});
	}

	/**时间end**/
})