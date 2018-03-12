//引入comom
var comom = require('../../api/comom.js');
//引入resPath
var resPath = require('../../api/respPath.js');
//分享
comom.share();
//主函数
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
			//是否有数据,渲染列表
			if(res.respCode == 1){
				//推荐信息
				comom.slt('#user_info').innerHTML = '<div class="list-head">推荐信息</div>'+
													'<li>申请时间<span class="fr">'+(res.respData.createDateStr||'')+'</span></li>'+
													'<li>姓名<span class="fr">'+(res.respData.name||'')+'</span></li>'+
													'<li>手机号<span class="fr">'+(res.respData.cellphone||'')+'</span></li>'+
													'<li>车辆名称<span class="fr">'+(res.respData.vmodel||'')+'</span></li>';
				//佣金信息
				var sCommissionStr = '';
				if(res.respData.prePkgAmountStr != '-'){
					if(res.respData.actPkgAmountStr != '-'){
						sCommissionStr = '推荐佣金(元)<span class="fr">'+(res.respData.actPkgAmountStr||'')+'</span>'+
										'<p class="text-right hidden">预计可获得 '+(res.respData.prePkgAmountStr||'') +'元，请等待业务完成后确认</p>';
					}else{
						sCommissionStr = '推荐佣金(元)<span class="fr">还没计算出来哦</span>'+
										'<p class="text-right f-grey mt10">预计可获得 '+(res.respData.prePkgAmountStr||'') +'元，请等待业务完成后确认</p>';	
					}
				}else{
					sCommissionStr = '推荐佣金(元)<span class="fr f-grey">还没计算出来哦</span>'+
									'<p class="text-right f-grey mt10">预计可获得 '+(res.respData.prePkgAmountStr||'') +'元，请等待业务完成后确认</p>';
				}
				comom.slt('#commission').innerHTML = sCommissionStr;
				
				//业务进展
				if(res.respData.ydqCustRecords instanceof Array && res.respData.ydqCustRecords.length > 0){
					//遍历渲染
					res.respData.ydqCustRecords.forEach(function(val,index){
						var oLi = document.createElement('li');
						oLi.innerHTML = '<i class="point"></i>'+(val.orderState || '')+'<span class="fr f-grey">'+(val.recordDate || '')+'</span>';
						comom.slt('#business_info').appendChild(oLi);
					});
				}else{
					comom.slt('#business_info').innerHTML = '<div class="list-head">业务进展</div><li><i class="point"></i>目前尚无业务进度信息<span class="fr f-grey"></span></li>';
				}
				
			}else{
				comom.tost('数据请求错误,请稍后再试');
			}
			
		});
	}
}
