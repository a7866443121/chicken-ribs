//引入comom
var comom = require('../../api/comom.js');
//引入resPath
var resPath = require('../../api/respPath.js');

window.addEventListener('DOMContentLoaded', function() {
	//分享
	comom.share();
	//获取银行卡信息
	comom.request(resPath.getResUrl() + '/zs/usr/queryBank/v2_0',{	
		openId: comom.getOpenId(),
		signature: '1',
		deviceType: 'wx',
		edition:'1.1'
	},getBankData);
	//点击提现
	$('#subbtn').click(clickBtn);
	//限制输入数字
	justNumber('cash');
})

function getBankData(res){
	var res = res.respData;
	$('.bank').html(res.receviceBank);
	$('.num').html(res.bankNo);
	$('.count').html(res.availableAmountNl);
	avaliMoney = res.availableAmountNl;
}
var avaliMoney;
function clickBtn(){
	var cash = $('#cash').val();
	if((cash == null) || (cash == 'undefind') || (cash == '')){
		comom.tost('请填写提现金额',1000);
	}else if(!cash.match(/^[0-9]*[1-9][0-9]*$/)){
		comom.tost('请填写大于零的整数',1000);
	}else if(cash <= avaliMoney){
		var cardNo = $('.num').html();
			cardNo = cardNo.substring(15);
		comom.request(resPath.getResUrl() + '/zs/usr/enchashmentc/v2_0',{
			openId: comom.getOpenId(),
			signature: '1',
			deviceType: 'wx',
			edition:'1.1',
			amount: cash,
			cardNo: cardNo
		},moneyGet);
	}else{
		comom.tost('输入金额超过可提现佣金余额',1000);
	}	
}

function moneyGet(res){
	if(res.respCode == 1){
			comom.createDefaultBtn(document.getElementById('body'),'../img/2.0/3.png','您的提现申请已提交。','预计3个工作日到账，请您耐心等待。','goToBtn','完成','&#xe6df;');
			//点击缺省页按钮
			$('.default-box').on('click','#goToBtn',function(){
				window.location.href = 'commissionPage.html';
			})
	}else{
			comom.createDefaultBtn(document.getElementById('body'),'../img/2.0/3.png','提现申请未能成功提交','可能由于网络问题，或者您在多个设备上操作的原因。请返回重新操作。','goToBtn','重新提交','&#xe679;');
			//点击缺省页按钮
			$('.default-box').on('click','#goToBtn',function(){
				window.location.href = window.location.href;
			})	
	}
}

function justNumber(obj){
	$('#'+obj).keyup(function(){		
		this.value = this.value.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
		this.value = this.value.replace(/^\./g, ""); //验证第一个字符是数字
		this.value = this.value.replace(/\.{2,}/g, "."); //只保留第一个, 清除多余的
		this.value = this.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
		this.value = this.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
	})
}
