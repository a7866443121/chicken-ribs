//引入comom
var comom = require('../../api/comom.js');
//引入resPath
var resPath = require('../../api/respPath.js');
//
comom.share();
window.onload = function(){
	var pathData = comom.getPathPt();
	var openId = pathData.openId||comom.getOpenId();
	if (openId) {
		//请求页面数据
		var data = {
			tid:pathData.tid,
			openId:openId,
			signature:pathData.signature
		}
		comom.request(resPath.getResUrl()+'/zs/customer/queryCustLoanDetail/V2_0',data,function(res){
			if (res.respCode == 1) {
				//头部
				var recordStr = (res.respData.orderState=='待业务接洽')?'':'<span class="record f-14" id="record">审批记录</span>';
				comom.slt('#header').innerHTML = '<i class="icon iconfont">&#xe604;</i>'+
												'<p class="f-14">'+(res.respData.orderState||'目前没有状态')+'</p>'+recordStr;
												
				//意向信息
				comom.slt('#user_info').innerHTML = '<div class="list-head">意向信息</div>'+
													'<li>申请时间<span class="fr">'+(res.respData.createDateStr||'-')+'</span></li>'+
													'<li>姓名<span class="fr">'+(res.respData.name||'-')+'</span></li>'+
													'<li>手机号<span class="fr">'+(res.respData.cellphone||'-')+'</span></li>';
				//是否有车辆信息?渲染:为空;
				if(res.respData.vmodel){
					comom.slt('#car_info').innerHTML = '<li>车辆名称<span class="fr">'+(res.respData.vmodel||'-')+'</span></li>'+
														'<li>首次上牌时间<span class="fr">'+(res.respData.firstcardDate||'-')+'</span></li>'+
														'<li>行驶里程(万公里)<span class="fr">'+(res.respData.mileage||'-')+'万公里</span></li>'+
														'<li>意向贷款金额(元)<span class="fr">'+(res.respData.loanPriceStr||'-')+'</span></li>'+
														'<li>意向贷款期限(期)<span class="fr">'+(res.respData.loanLimit||'-')+'</span></li>';					
				}else{
					comom.slt('#car_info').outerHTML = '';
				}
				//业务信息
				comom.slt('#business_info').innerHTML = '<div class="list-head">业务信息</div>'+
														'<li>订单流水号<span class="fr">'+(res.respData.orderNo||'-')+'</span></li>'+
														'<li>业务员<span class="fr">'+(res.respData.apply||'-')+(res.respData.applyPhone?'('+res.respData.applyPhone+')':'')+'</span></li>'+
														'<li>实际放款金额(元)<span class="fr">'+(res.respData.actLoanAmountStr||'-')+'</span></li>'+
														'<li>贷款期数(期)<span class="fr">'+(res.respData.actLoanLimit||'-')+'</span></li>'+
														'<li>执行利率(%)<span class="fr">'+(res.respData.actRate||'-')+'</span></li>'+
														'<li>还款计划<span class="fr f-grey" id="toView">'+((res.respData.repaymentPlanList&&res.respData.repaymentPlanList.length>0)?'查看':'暂未生成')+'<i class="icon iconfont">&#xe676;</i></span></li>';
				//审批记录弹窗 	
				//是否存在这个数组.
				if(res.respData.ydqCustRecords instanceof Array){
					var recordLayer = comom.slt('#recordLayer');
					res.respData.ydqCustRecords.forEach(function(val,index){
						var recordLi = document.createElement('li');
						recordLi.innerHTML = '<i class="point"></i>'+(val.orderState||'') +'<span class="fr f-grey">'+(val.recordDate||'')+'</span>';
						comom.slt('#examines_progress').appendChild(recordLi);
					});	
					//审批记录显示
					if(res.respData.orderState!='待业务接洽'){ 
						comom.slt('#record').onclick = function(){	
							if(res.respData.ydqCustRecords.length>0){
								recordLayer.classList.contains('hidden')?(recordLayer.classList.remove('hidden'),recordLayer.classList.add('block')):recordLayer.classList.add('block');
							}else{
								comom.tost('暂时没有审批记录','3000');
							}
						};
						//审批记录隐藏
						comom.slt('#close_recordLayer').onclick = function(){
							recordLayer.classList.contains('block')?(recordLayer.classList.remove('block'),recordLayer.classList.add('hidden')):recordLayer.classList.add('hidden');
						};
					}
				}
				//还款计划弹窗
				//是否存在这个数组
				if(res.respData.repaymentPlanList instanceof Array){
				//还款计划弹窗遮罩层
					var backPlan = comom.slt('#backPlan');			
					res.respData.repaymentPlanList.forEach(function(val,index){
						var recordLi = document.createElement('li');
						recordLi.innerHTML = (val.payDate||'')+'<span class="fr f-grey">'+(val.monthlyPay||'')+'元</span>';
						comom.slt('#backPlan_content').appendChild(recordLi);
					});				
					//还款计划显示
					comom.slt('#toView').onclick = function(){
						if(res.respData.repaymentPlanList.length>0){
							backPlan.classList.contains('hidden')?(backPlan.classList.remove('hidden'),backPlan.classList.add('block')):backPlan.classList.add('block');
						}else{
							comom.tost('暂时没有还款计划','3000');
						}
					};
					//还款计划隐藏
					comom.slt('#close_backPlan').onclick = function(){
						backPlan.classList.contains('block')?(backPlan.classList.remove('block'),backPlan.classList.add('hidden')):backPlan.classList.add('hidden');
					};
				}
			} else{
				comom.tost('接口请求失败,请稍后重试','30000');
			}
		});
	}else{
		comom.tost('找不到openId','3000');
	}	
}
