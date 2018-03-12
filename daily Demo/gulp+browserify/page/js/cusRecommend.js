//引入comom
var comom = require('../../api/comom.js');
//引入resPath
var resPath = require('../../api/respPath.js');
var carInfoObj;
window.addEventListener('DOMContentLoaded', function() {
	//从地址栏获取openid
	comom.getPathPt();
	//分享
	comom.share();
	//点击获取车辆信息
	$("#carinfo").on("click", getCarInfo);
	//获取缓存数据
	var friendInfo = sessionStorage.getItem('friendInfo');
		carInfoObj = sessionStorage.getItem('carInfo');
	if(friendInfo) {
		friendInfo = JSON.parse(friendInfo);
		if(testNull(friendInfo.name)){
			$('.data-name').val(friendInfo.name);
		}
		if(testNull(friendInfo.phoneNum)){
			$('.data-phoneNum').val(friendInfo.phoneNum);
		}		
	}
	if(carInfoObj){
		carInfoObj = JSON.parse(carInfoObj);
		$('.data-carinfo').html(testNull(carInfoObj.model)?decodeURIComponent(carInfoObj.model):"请选择");
		//控制车辆名称字段长度
		if(parseInt($('.data-carinfo').css('width')) > '250') {
			$('.data-carinfo').css('width', '40%');
		}
	}
	//调用判空方法
	judge();	
	//绑定点击
	$(".btn").bind("click", function(){		
		if($('.sure-btn').hasClass('bg-theme')){
			submitData();	
		}
	});
	$('.data-phoneNum').keyup(function(){	
		var num = $('.data-phoneNum').val();
		if(!num.match(/^[0-9]*[1-9][0-9]*$/)){
			comom.tost('请输入数字', 1000);
		}
	})
})

//跳转选取车辆
function getCarInfo() {
	var name = $('.data-name').val(),
		phoneNum = $('.data-phoneNum').val();
	friendInfo = {
		name: name,
		phoneNum: phoneNum
	}
	sessionStorage.setItem('friendInfo', JSON.stringify(friendInfo));
	location.href = "carChose.html";
}

//调取推荐接口
function submitData() {
	var telephone = $('.data-phoneNum').val(),
		name = $('.data-name').val(),
		carInfo = $('.data-carinfo').html(),
		data;
	if(!testNull(name)) {
		comom.tost('请输入姓名', 1000);
	} else if(!testNull(telephone)) {
		comom.tost('请输入手机号', 1000);
	} else if(!telephone.match(/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(14[0-9]{1})|(17[0-9]{1}))+\d{8})$/)) {
		comom.tost('请输入正确手机号', 1000);
	} else if(carInfo == "请选择") {
		comom.tost('请选择车辆', 1000);
	} else {
		data = {
			name: name,
			cellphone: telephone,
			openId: comom.getOpenId(), //openId
			province: '湖南', //业务办理省份
			provinceId: '19', //业务办理省份ID
			city: '长沙', //业务办理地区
			cityId: '19', //业务办理地区ID
			provinceCar: '湖南', //车辆所在省份
			provinceIdCar: '19', //车辆所在省份ID
			cityCar: '长沙', //车辆所在地区
			cityIdCar: '19', //车辆所在地区ID
			brandId: carInfoObj.brandId, //品牌id
			brandName: carInfoObj.brand, //品牌名称
			seriesId: carInfoObj.seriesId, //车系id
			seriesName: carInfoObj.series, //车系名称
			modelId: carInfoObj.modelId, //车款id
			modelName: carInfoObj.model, //车款名称
			signature:"1"
		}
		comom.request(resPath.getResUrl() + '/zs/customer/addCommendCustInfo/V2_0', data, getData);
	}
}

//获取接口参数
function getData(res){
	var respCode = res.respCode,
		respMsg = res.respMsg;
		console.log(respCode+'------'+respMsg);
		if(respCode == 1){			
			sessionStorage.removeItem('friendInfo');
			sessionStorage.removeItem('carInfo');
			$('title').html('推荐成功');
			comom.createDefaultBtn(document.getElementById('body'),'../img/2.0/3.png','推荐信息提交成功。','被推荐人的贷款申请成功放款后，您即可获得本次推荐佣金。','goToBtn','好的','&#xe6df;');	
			//点击缺省页按钮
			$('#goToBtn').click(function(){
				wx.closeWindow();
			})
		}else{
			$('title').html('推荐失败');
			comom.createDefaultBtn(document.getElementById('body'),'../img/2.0/3.png','推荐信息提交失败。',respMsg,'goToBtn','好的','&#xe679;');
			//点击缺省页按钮
			$('#goToBtn').click(function(){
				$('title').html('推荐客户');
				window.location.href = window.location.href;
			})	
		}
}

//判空
function judge() {
	var validcode = ($(".data-name").val() != "" && $(".data-carinfo").html() != "请选择" && $(".data-phoneNum").val() != "");
	if(validcode) {
		$('.sure-btn').addClass('bg-theme');
		$('.sure-btn').removeClass("bg-grey");
	} else {
		$('.sure-btn').removeClass("bg-theme");
		$('.sure-btn').addClass('bg-grey');
	}
}

$(".data-name,.data-phoneNum").keyup(function() {
	judge();
});

//验证手机号格式
function testPhone(obj) {
	if(testNull(obj.val())) {
		if(!obj.val().match(/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(14[0-9]{1})|(17[0-9]{1}))+\d{8})$/)) {
			comom.tost('请输入正确手机号', 1000);
			return false;
		} else {
			return true;
		}
	} else {
		comom.tost('请输入手机号', 1000);
		return false;
	}
}

function testNull(obj) {
	if(obj == "" || obj == null) {
		return false;
	} else
		return true;
}
