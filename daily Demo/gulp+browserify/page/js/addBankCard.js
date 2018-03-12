//引入comom
var comom = require('../../api/comom.js');
//引入resPath
var resPath = require('../../api/respPath.js');

window.addEventListener('DOMContentLoaded', function() {
	//分享
	comom.share();
	//绑定点击保存
	$("#subbtn").bind("click", function(){		
		if($('.sure-btn').hasClass('bg-theme')){
			saveClick();	
		}
	});
	//获取姓名
	var name = localStorage.getItem('name');
	$('.data-name').html(name || '');
})

function saveClick(){
	var bank = $('#bank').val(),
		bankCard = $('#bankcard').val(),
		subBranch = $('#subbranch').val(),
		data;		
		data = {
			openId: comom.getOpenId(),
			receviceBank: bank,
			brachBank: subBranch,
			bankNo: bankCard,
			deviceType: 'wx',
			signature: '1',
			edition: '1.1'
		}	
		
	var bank = $('#bank').val(),
		bankCard = $('#bankcard').val();		
	if(!testNull(bank)) {
		comom.tost('请输入收款银行', 1000);
	}else if(!testNull(bankCard)) {
		comom.tost('请输入银行卡号', 1000);
	}else if(bankCard.length > 19){
		comom.tost('请输入正确的银行卡号', 1000);
	}else{
		//接口调用
		comom.request(resPath.getResUrl() + '/zs/usr/addBank/v2_0',data,getData);
	}
	
	
}

//获取接口数据
function getData(res){
	if(res.respCode == 1){
		comom.tost('绑定成功',1000);
		setTimeout(function(){location.href="withdrawal.html";},1000)
	}else{
		comom.createDefault(document.getElementById('body'),'../img/2.0/3.png','您已成功添加过收款信息，请勿重复操作。','goToBtn','去提现','&#xe679;');
		$('.default-box').on('click','#goToBtn',function(){
			window.location.href = 'withdrawal.html';
		})
	}
}

function testNull(obj) {
	if(obj == "" || obj == null) {
		return false;
	} else
		return true;
}

//判空
function judge() {
	var validcode = ($("#bank").val() != "" && $("#bankcard").val() != "");
	if(validcode) {
		$('.sure-btn').addClass('bg-theme');
		$('.sure-btn').removeClass("bg-grey");
	} else {
		$('.sure-btn').removeClass("bg-theme");
		$('.sure-btn').addClass('bg-grey');
	}
}

$("#bank,#bankcard").keyup(function() {
	judge();
});