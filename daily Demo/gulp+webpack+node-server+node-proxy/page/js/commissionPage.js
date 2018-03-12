//引入comom
var comom = require('../../api/comom.js');
//引入resPath
var resPath = require('../../api/respPath.js');
window.addEventListener('DOMContentLoaded', function() {
	//分享
	comom.share();
	var data = {
		openId: comom.getOpenId(),
		signature: '1',
		deviceType: 'wx',
		edition:'1.1'
	};
	//获取佣金
	comom.request(resPath.getResUrl() + '/zs/customer/queryLoanAmountDetail/V2_0',data,getData);
})
var ifBank;
//佣金明细数据渲染
function getData(res){
	var respData = res.respData ,
		incomeListVos = respData.incomeListVos,
		withdrawListVos = respData.withdrawListVos,
		getListStr,cashListStr;
		ifBank = respData.ifBank;
	//可提现余额
	if(respData.availableAmount != 0){
		$(".data-nowMoney").html(respData.availableAmount);
		$('#body').append('<div class="border-top btnBox"><div class="btn">去提现</div></div>');
		//点击提现
		$('.btnBox').on('click',getBankData);
		$('.content').height((document.body.clientHeight) - ($('.btn').outerHeight(true)));
	}
	//冻结资金
	if(respData.freezeAmount != 0){
		$('#topMoney').append('<p class="f-13 mt10 op-5">当前有<span class="data-iceMoney">'+ respData.freezeAmount +'</span>元佣金提现申请正在处理中。</p>')
	}
	//切换
	tabChange();
	//收入记录
	if(incomeListVos.length>0){
		for(var j = 0; j < incomeListVos.length; j++) {
			getListStr = '<li>'+
				'<div class="text-left">'+
					'<span class="data-getTime f-grey f-13">' + (incomeListVos[j].amountDate || ' ') + '</span>'+
					'<p class="mt10 f-14">推荐 <span class="data-rcommName">' + (incomeListVos[j].customer  || ' ') + '</span>（<span class="data-rcommPhone">' + (incomeListVos[j].custPhone  || ' ') + '</span>）</p>'+
				'</div>'+
				'<div class="text-right data-getMoney f-theme f-15">+' + (incomeListVos[j].amount || ' ') + '元</div>'+
			'</li>';
			$('.tab-content .tab1').append(getListStr);
		}
	}else{
		comom.createDefaultBtn(document.getElementById('getMoney'),'../img/2.0/3.png','您还没有佣金哦，快去推荐朋友吧');
	}
	//提现记录
	if(withdrawListVos.length>0){
		for(var i = 0; i < withdrawListVos.length; i++) {								  
			var status;
			if(withdrawListVos[i].status == 1){
				status = 'hidden';
			}
			cashListStr = '<li>'+
				'<div class="text-left">'+
					'<span class="data-reduceTime f-grey f-13">' + (withdrawListVos[i].amountDate  || ' ') + '</span>'+
					'<p class="mt10 f-14">提现</p>'+
				'</div>'+
				'<div class="text-right">'+
					'<span class="data-reduceMoney f-15">-' + (withdrawListVos[i].amount  || ' ') + '元</span>'+
					'<span class="tag f-theme f-13 ' + (status || ' ') + '">处理中</span>'+
				'</div>'+	
			'</li>';
			$('.tab-content .tab2').append(cashListStr);
		}
	}else{
		comom.createDefaultBtn(document.getElementById('reduceMoney'),'../img/2.0/3.png','您还没有提现过哦');	
	}
}

//银行卡信息
function getBankData(){
	if(ifBank == 1){
		location.href = 'withdrawal.html';
	}else{
		location.href = 'addBankcard.html';
	}
}

//滑动--点击切换
var lefTap = 0;

function tabChange() {
	//设置滑动区域
	var bodyHeight = $('.content').height(),
		topHeight = $('.top').innerHeight(),
		tabHeight = $('.tab').height();
		console.log(bodyHeight + '----' + topHeight + '----' + tabHeight)
		$('.tab-content ul').height(bodyHeight - (topHeight + tabHeight));
	//点击切换
	$('.tab li').click(function() {
		$('.tab li,.tab-content ul').removeClass('active');
		$(this).addClass('active');
		var index = $('.tab li').index($(this));
		$('.tab-content ul').eq(index).addClass('active');
	})
	//滑动切换
	var startX, startY;
	$('body').on('touchstart', '.tab-content', function(e) {
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
			selectorPrev('.tab-content ul');
			selectorPrev('.tab li');
			$(this).off('touchmove');
		} else if(((touch.pageX - startX) < -30) && ((touch.pageX - startX) < (touch.pageY - startY))) { //向右
			lefTap = lefTap - 1;
			selectorNext('.tab-content ul');
			selectorNext('.tab li');
			$(this).off('touchmove');
		};
	});
	//左滑
	function selectorNext(e) {
		$(e + '.active').next(e).addClass('active');
		$(e + '.active').prev(e).removeClass('active');
	}
	//右滑
	function selectorPrev(e) {
		$(e + '.active').prev(e).addClass('active');
		$(e + '.active').next(e).removeClass('active');
	}
}
