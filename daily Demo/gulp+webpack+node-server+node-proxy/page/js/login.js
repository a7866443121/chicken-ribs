//引入comom
var comom = require('../../api/comom.js');
//引入resPath
var resPath = require('../../api/respPath.js');

window.addEventListener('DOMContentLoaded', function() {
	//从地址栏获取openid
	comom.getPathPt();
	$(".getcode").on("click", getCode);//点击获取验证码
	$(".sure-btn").on("click", validCode);//点击绑定
});

//判空
function judge() {
	var validcode = ($(".data-realName").val() != "" && $(".data-code").val() != "" && $(".data-phoneNum").val() != "");
	if(validcode) {
		$('.sure-btn').addClass('bg-theme');
		$('.sure-btn').removeClass("bg-grey");
	} else {
		$('.sure-btn').removeClass("bg-theme");
		$('.sure-btn').addClass('bg-grey');
	}
}

$(".data-realName,.data-code").keyup(function() {
	judge();
});

function testNull(obj) {
	if(obj == "" || obj == null) {
		return false;
	} else
		return true;
}

var tt_timming;
function timming(time) {
	tt_timming = setInterval(function(){
		time--;
		if(time>1) {
			$(".getcode").addClass("disable").html("倒计时"+time+"秒");
		}else {
			clearInterval(tt_timming);
			$(".getcode").removeClass("disable").html("获取验证码");
			$(".getcode").css('pointer-events','auto');
		}
	},1000)
}


var telephone;
function getCode(){
	telephone = $(".data-phoneNum").val();
	if(!testNull(telephone)) {
     	comom.tost('请输入手机号',1000); 
	}else if(!telephone.match(/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(14[0-9]{1})|(17[0-9]{1}))+\d{8})$/)){
        comom.tost('请输入正确手机号',1000);
    }else if(!$(".getcode").hasClass("disable")) {
		if(testPhone($(".data-phoneNum"))) {
			$(".getcode").css('pointer-events','none');
			timming(60);
			var codeParam = {
				cellphone:telephone,
				deviceType:"wx",	
				signature:"1",	
			    edition:"1.1",
			    openId:comom.getOpenId()
			}
			comom.request(resPath.getResUrl() + '/zs/usr/getValidCode/v2_0', codeParam, codeBack);
		}
	}
}

 
function codeBack(res){
	var code = res.respCode;
	if(code == 0){
		clearInterval(tt_timming);
		$(".getcode").html("发送验证码");
		$(".getcode").css('pointer-events','auto');
	}	
}


function validCode() {
   $(".data-realName,.data-code").blur();
   if($('.sure-btn').hasClass('bg-theme')) {
	    var code = $(".data-code").val(),
		telephone = $(".data-phoneNum").val(),
		name = $('.data-realName').val(),
		validParam ={
			realName:name,
			phone:telephone,	
			code:code,
			deviceType:"wx",	
		    signature:"1",	
		    edition:"1.1",
		    openId:comom.getOpenId()
		}
        
	     if(!testNull(telephone)) {
	     	 comom.tost('请输入手机号',1000); 
	     }else if(!telephone.match(/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(14[0-9]{1})|(17[0-9]{1}))+\d{8})$/)){
	         comom.tost('请输入正确手机号',1000);
	     }else if(!testNull(code)){
	     	 comom.tost('请输入验证码',1000); 
	     }else if(!code.match(/^\d{4}$/)){
	     	comom.tost('请输入正确验证码',1000);
	     }else{
	     	comom.request(resPath.getResUrl() + '/zs/usr/phoneBinding/v2_0', validParam, validBack);
	     }	
   }
}

function validBack(res){	
	if(res.respCode == 0){
		clearInterval(tt_timming);
		$(".getcode ").removeClass("disable").val("发送验证码");
	    $(".getcode ").css('pointer-events','auto');
		comom.tost(res.respMsg,1000);
	}else{
		localStorage.setItem('telephone',telephone);
		localStorage.setItem('name',$('.data-realName').val());
		comom.tost('登录成功',1000);		
		setTimeout(function(){location.href="cusRecommend.html";},1000);
	}
}

function testPhone(obj) {
	if(testNull(obj.val())) {
		if(!obj.val().match(/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(14[0-9]{1})|(17[0-9]{1}))+\d{8})$/)) {
		    comom.tost('请输入正确手机号',1000);	    
			return false;
		} else {
			return true;
		}
	} else {
		comom.tost('请输入手机号',1000);
		return false;
	}
}


function testCode(obj) {
	if(testNull(obj.val())) {
		if(!obj.val().match(/^\d{4}$/)) {
			comom.tost('请输入正确验证码',1000);
			return false;
		} else {
			return true;
		}
	} else {
		comom.tost('请输入验证码',1000);
		return false;
	}
}






