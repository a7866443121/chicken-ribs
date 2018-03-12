//引入comom
var comom = require('../../api/comom.js');
//引入resPath
var resPath = require('../../api/respPath.js');


//取出session
var carInfo = JSON.parse(sessionStorage.getItem("carInfo"));

var param = comom.getPathPt();

$(function() {

	comom.share();
	
	//获取城市
	if(decodeURI(param.selectCity) != 'undefined'){
		document.getElementById('data-city').innerHTML = decodeURI(param.selectCity);
	}	
	//返回车型
	if(carInfo) {
		$('#chooseCar .data-carinfo').html(decodeURIComponent(carInfo.model));
		//时间选择控件绑定
		var dataPicker = require('./picker.js');
		//控制车辆名称字段长度
		if(parseInt($('.data-carinfo').css('width')) > '250') {
			$('.data-carinfo').css('width', '40%');
		}
	}

	//提示点击
	var mo = function(e) {
		e.preventDefault();
	};
	$('#item-time .iconfont.alert').click(function() {
		$('.eq,.layer').fadeIn();
		document.body.style.overflow = 'hidden';
		document.addEventListener("touchmove", mo, false); //禁止页面滑动
	})

	//点击遮罩层
	$('.layer,.i-konw').click(function() {
		$('.eq,.layer').fadeOut();
		document.body.style.overflow = ''; //出现滚动条
		document.removeEventListener("touchmove", mo, false);
	})

	mileAlert();

	//点击选择车辆
	$('#chooseCar').click(function() {
		location.href = 'carChose.html';
	})

	//点击选择时间
	$('.data-time').click(function() {
		if($('.data-carinfo').html() == '请选择'){
			comom.tost('请选择车辆',1000);
		}
	})

	//点击选择城市
	$('#chooseCity').click(function() {
		location.href = 'cityChose.html?scource=calcu';
	})

	//点击试算
	$('.plan').click(function() {		
		checkNull();
	})
})

//公里数限制与提示
function mileAlert() {
	//限制为数字
	$('.data-mile').keyup(function() {
		this.value = this.value.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
		this.value = this.value.replace(/^\./g, ""); //验证第一个字符是数字
		this.value = this.value.replace(/\.{2,}/g, "."); //只保留第一个, 清除多余的
		this.value = this.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
		this.value = this.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
		if(isNaN(parseInt(this.value))) {
			comom.tost('请输入数字', 1000);
			this.value = '';
		} else if(this.value >= 99.99) {
			$(this).val(99.99);
		}
	})

}

function checkNull() {
	var type = parseInt($('.data-mile').val());
	if($('.data-carinfo').html() == '请选择' || $('.data-mile').val() == '请输入' || $('.data-time').html() == '请选择') {
		comom.tost('请输入所有信息', 1000);
	} else if(isNaN(type)){
		comom.tost('公里数请输入数字', 1000);
	}else{
		carInfo.dateStr = $('.data-time').html();
		carInfo.regDate = $('.data-time').attr('getcarddate');
		carInfo.mileage = $('.data-mile').val();
		carInfo.selectCity = $('#data-city').html();
		carInfo.selectCityId = (param.selectCityId || '184');
		sessionStorage.setItem("carInfo", JSON.stringify(carInfo));
		location.href = 'loanScheme.html?';
	}
}