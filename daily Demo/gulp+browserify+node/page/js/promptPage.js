//引入comom
var comom = require('../../api/comom.js');
//引入resPath
var resPath = require('../../api/respPath.js');
	urlParam = comom.getPathPt();

$(function() {
	comom.share();
	var str = '<div class="prombox text-center"><img src="../img/submit.png"/><p class="f-theme">您的借款申请提交成功！</p><p class="f-666">您的融资顾问将尽快与您联系，请保持手机通畅。</p><div class="btn">好的</div></div>',
		str1 = '<div class="prombox text-center repet"><img src="../img/apply_succeed.png"/><p class="f-theme">我们已收到您的申请。</p><p class="f-666 text-left">系统已收到您3天内的多次申请，我们将优先为您安排融资顾问。请勿重复提交，谢谢。如您需求紧急,建议直接致电 <a tel="400-901-9688" class="f-theme">400-901-9688</a>咨询。</p><div class="btn">好的</div></div>',
		str2 = '<div class="prombox text-center failure"><img src="../img/no_Internet_concatenon.png"/><p class="f-666">系统开小差啦，请重试一下。</p><a class="f-theme back">重新提交</a></div>';

	if(urlParam) {
		type = urlParam.type;
		if(type == 'failure') { //失败
			$('title').html('提交失败');
			$('#content').html('').append(str2);
		} else if(type == 'repet') { //重复
			$('title').html('重复提交');
			$('#content').html('').append(str1);
		} else {
			$('#content').html('').append(str);
		}
	}
	$('.btn').click(function() {
		wx.closeWindow();
	});
	$('.back').click(function() {
		window.location.href = document.referrer;
	});
	comom.loadingDone();
})