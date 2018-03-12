//引入comom
var comom = require('../../api/comom.js');
//引入resPath
var resPath = require('../../api/respPath.js');

//取出session
var carInfo = JSON.parse(sessionStorage.getItem("carInfo"));

var name = '',
	cellphone = '',
	cusInfo = {
		name: name, //姓名
		cellphone: cellphone, //手机号
		openId: comom.getOpenId(), //openId
		province: '湖南', //业务办理省份
		provinceId: '19', //业务办理省份ID
		city: carInfo.selectCity, //业务办理地区
		cityId: carInfo.selectCityId, //业务办理地区ID
		provinceCar: '湖南', //车辆所在省份
		provinceIdCar: '19', //车辆所在省份ID
		cityCar: carInfo.selectCity, //车辆所在地区
		cityIdCar: carInfo.selectCityId, //车辆所在地区ID
		brandId: carInfo.brandId, //品牌id
		brandName: carInfo.brand, //品牌名称
		seriesId: carInfo.seriesId, //车系id
		seriesName: carInfo.series, //车系名称
		modelId: carInfo.modelId, //车款id
		modelName: carInfo.model, //车款名称
		regDate: carInfo.regDate, //上牌日期
		mileage: carInfo.mileage, //行驶公里数
		loanLimit: 12, //期限
		loanPrice: '', //贷款金额
		evalPrice: '', //选择的评估价
		monthlyPay: '', //月供
		sumAmount: '', //本息合计
		signature: '1'
	}
$(function() {
	$('.data-city').html(carInfo.selectCity);
	$('.content').height($('body').height() - $('.btnBox ').outerHeight(true));
	$('.tab-content').height($('.content').height() - ($('.group ').outerHeight(true) + $('.tab-list').outerHeight(true)));
	//分享
	comom.share();
	//展示所需数据
	showInfo();

	//tab 切换
	$('.tabli').click(function() {
		$('.tabli,.tab').removeClass('active');
		$(this).addClass('active');
		var index = $('.tabli').index($(this));
		$('.tab').eq(index).addClass('active');
	})

	//勾选框显示变换
	$('.instalPlan .iconfont').click(function() {
		$(this).closest('.tab').find('.instalPlan .iconfont').removeClass('f-theme').html('&#xe6e1;');
		$(this).addClass('f-theme').html('&#xe6df;');
		cusInfo.loanLimit = $(this).attr('plan');
	})

	//实时计算分期金额
	$('.data-money').keyup(function() {
		this.value = this.value.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
		this.value = this.value.replace(/^\./g, ""); //验证第一个字符是数字
		this.value = this.value.replace(/\.{2,}/g, "."); //只保留第一个, 清除多余的
		this.value = this.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
		this.value = this.value.replace(/^(\-)*(\d+)\.(\d).*$/, '$1$2.$3'); //只能输入一个小数
		var type = parseInt(this.value);
		if(isNaN(type)) {
			comom.tost('请输入数字', 1000);
			this.value = '';
		} else {
			//调取计算
			calculator(this.value);
		}
		if((this.value) == '' || (this.value) == null){
			$('.tab.active').find('.data-monthPay').html('--');
			$('.tab.active').find('.data-sum span').html('--');
		}
	})

	//点击立即申请
	var mo = function(e) {
		e.preventDefault();
	};
	$('#btn').click(function() {
		var evaluPrice = $('.tab.active .data-evaluPrice').html();
		evaluPrice = parseFloat(evaluPrice); //评估价
		cusInfo.loanPrice = $('.tab.active').find('.data-money').val();
		cusInfo.evalPrice = evaluPrice;
		cusInfo.monthlyPay = parseFloat($('.tab.active').find('.iconfont.f-theme').prev().find('.data-monthPay').html()); //月供
		cusInfo.sumAmount = $('.tab.active').find('.iconfont.f-theme').prev().find('.data-sum span').html(); //本息合计
		
		if(isNaN(parseInt(cusInfo.loanPrice))){
			comom.tost('请输入数字', 1000);
			$('.data-money').val('');
		}else if(cusInfo.loanPrice > evaluPrice) {
			comom.tost('想借金额不可大于评估价', 1000);
		} else if(cusInfo.loanPrice != '' && cusInfo.loanPrice != 'undefind' && cusInfo.loanPrice != null) {
			$('.personalInfor,.layer').css('display', 'block');
			document.body.style.overflow = 'hidden';
			document.addEventListener("touchmove", mo, false); //禁止页面滑动
		} else {
			comom.tost('请填写想借金额', 1000)
		}
	});
	
	$('#btn').on('touchmove',function(event) {
		event.stopPropagation();
		event.preventDefault();
	});

	//点击遮罩层
	$('.layer').click(function() {
		$('.personalInfor,.layer').css('display', 'none');
		document.body.style.overflow = ''; //出现滚动条
		document.removeEventListener("touchmove", mo, false);
	});

//	//手机号码限制为数字
//	$('.data-phoneNum').keyup(function() {
//		this.value = this.value.replace(/[^\d]/g, '').replace(/(\d{4})(?=\d)/g, "$1");
//	});

	//点击提交申请
	$('.personalInfor .btn').click(function() {
		var telephone = $('.data-phoneNum').val();
		if(!telephone) {
			comom.tost('请输入手机号', 1000)
		} else if(!telephone.match(/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(14[0-9]{1})|(17[0-9]{1}))+\d{8})$/)) {
			comom.tost('请输入正确的手机号', 1000)
		}else{
			cusInfo.name = $('.data-name').val();
			cusInfo.cellphone = telephone;
			comom.request(resPath.getResUrl() + '/zs/customer/addCustomerAll/V1_0', cusInfo, upCusInfo, erroCallback);
			console.log(cusInfo);			
		}
	});
})

//展示所需数据
function showInfo() {
	$('.data-brand').html((carInfo.brand));
	$('.data-model').html(carInfo.model);
	$('.data-date').html(carInfo.dateStr);
	$('.data-mile').html(carInfo.mileage + '万公里');
	//请求所需数据
	var inforObj = {
		modelId: carInfo.modelId,
		regDate: carInfo.regDate,
		mileage: carInfo.mileage,
		cityId: carInfo.selectCityId,
		deviceType: 'wx',
		signature: '1',
		edition: 'v1.0',
		openId: comom.getOpenId()
	}
	comom.request(resPath.getResUrl() + '/zs/ydqLoanAmount/queryChe300PgPrice/v1_0', inforObj, getPrice, erroCallback);
}

//获取评估价
function getPrice(res) {
	if(res.respData) {
		var res = res.respData;
		$('.goodPrice').html(res.goodPrice + '万元');
		$('.highPrice').html(res.highPrice + '万元');
		$('.lowPrice').html(res.lowPrice + '万元');
	}
}

//提交客户信息
function upCusInfo(res) {
	var code = res.respCode,
		mes = res.respMsg;
	if(code == 1) {
		comom.createDefaultBtn(document.getElementById('body'),'../img/2.0/3.png','您的借款申请提交成功！','您的融资顾问将尽快与您联系，请保持手机通畅。','goToBtn','好的','&#xe6df;');	
		$('#goToBtn').click(function(){
			wx.closeWindow();
		})
		sessionStorage.removeItem('carInfo');
	} else if((code == 0) && (mes == 'repet')) {
		comom.createDefaultBtn(document.getElementById('body'),'../img/apply_succeed.png','我们已收到您的申请。','系统已收到您3天内的多次申请，我们将优先为您安排融资顾问。请勿重复提交，谢谢。如您需求紧急,建议直接致电 <a tel="400-901-9688" class="f-theme">400-901-9688</a>咨询。','goToBtn','好的');	
		$('#goToBtn').click(function(){
			wx.closeWindow();
		})
	} else {
		comom.createDefault(document.getElementById('body'),'../img/no_Internet_concatenon.png','系统开小差啦，请重试一下','goToBtn','重新提交');	
		$('#goToBtn').click(function(){
			window.location.href = window.location.href;
		})
	}
}

//滑动--点击切换
var lefTap = 0;

function tabChange() {
	var startX, startY;
	$('.tab-box').on('touchstart', '.tab-content', function(e) {
		var clientWidth = document.body.clientWidth;
		var touch = e.originalEvent;
		startX = touch.changedTouches[0].pageX,
			startY = touch.changedTouches[0].pageY;
		$(this).on('touchmove', function(e) {});

		// Return false to prevent image
		// highlighting on Android
		//return false;

	}).on('touchend', function(e) {
		//		e.preventDefault();
		touch = e.originalEvent.touches[0] ||
			e.originalEvent.changedTouches[0];
		if(lefTap > 1) {
			lefTap = 1;
		} else if(lefTap < -1) {
			lefTap = -1;
		}
		if(((touch.pageX - startX) > 30) && ((touch.pageX - startX) > (touch.pageY - startY))) { //向左
			lefTap = lefTap + 1;
			selectorPrev('.tab');
			selectorPrev('.tabli');
			$(this).off('touchmove');
		} else if(((touch.pageX - startX) < -30) && ((touch.pageX - startX) < (touch.pageY - startY))) { //向右
			lefTap = lefTap - 1;
			selectorNext('.tab');
			selectorNext('.tabli');
			$(this).off('touchmove');
		};
	});

	function selectorNext(e) {
		$(e + '.active').next(e).addClass('active');
		$(e + '.active').prev(e).removeClass('active');
	}

	function selectorPrev(e) {
		$(e + '.active').prev(e).addClass('active');
		$(e + '.active').next(e).removeClass('active');
	}
}

//分期计算

function calculator(num) {
	//12期 —— 本息合计=【想借金额】*【1+5.22%】 ||| 月供=【本息合计】/12
	//24期 —— 本息合计=【想借金额】*【1+10.43%】 ||| 月供=【本息合计】/24
	//36期 —— 本息合计=【想借金额】*【1+15.64%】 ||| 月供=【本息合计】/36
	var num = num * 10000,
		tab = $('.tab.active'),
		sum1 = num + num / 100 * 5.22,
		sum2 = num + num / 100 * 10.43,
		sum3 = num + num / 100 * 15.64;

	tab.find('.firstPlan .data-sum span').html(sum1);
	tab.find('.firstPlan .data-monthPay').html(parseFloat(sum1 / 12).toFixed(2) + '元');
	tab.find('.secPlan .data-sum span').html(sum2);
	tab.find('.secPlan .data-monthPay').html(parseFloat(sum2 / 24).toFixed(2) + '元');
	tab.find('.thirPlan .data-sum span').html(sum3);
	tab.find('.thirPlan .data-monthPay').html(parseFloat(sum3 / 36).toFixed(2) + '元');
}

function erroCallback() {

}