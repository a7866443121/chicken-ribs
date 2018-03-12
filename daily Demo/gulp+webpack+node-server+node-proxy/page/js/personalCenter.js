//引入comom
var comom = require('../../api/comom.js');
//引入resPath
var resPath = require('../../api/respPath.js');
comom.share();
window.onload = function(){
	var pathData = comom.getPathPt();
	var openId = pathData.openId||comom.getOpenId();
	if (openId) {
		//请求页面数据
		var data = {
			openId:openId,
			signature:pathData.signature
		}
		comom.request(resPath.getResUrl()+'/zs/usr/queryUserInfo/v2_0',data,function(res){
			//头部渲染
			var organizationNameStr = res.respData.organizationName?'<div class="my-info"><font>'+res.respData.organizationName+'</font></div>':'';
			comom.slt('#header').innerHTML =' <div class="my-header"><span><img src="'+res.respData.wechatIcon+'"/></span></div>'+
											'<div class="my-name"><font>'+res.respData.realName +'</font></div>'+organizationNameStr;
			//tab
			comom.slt('#nav').innerHTML ='<div class="nav-left">我借过'+
												'<p id="borrow_money">'+(res.respData.loanAmountStr||'0.00')+'<small> 元</small></p></div>'+
											'<div class="nav-right">我赚了'+
												'<p id="make_money">'+(res.respData.brokageAmountStr||'0.00')+'<small> 元</small></p></div>';
		});
	} else{
		comom.tost('没有找到openId','3000');
	}
	//列表点击跳转
	comom.slt('#my_list').onclick = function(evevt){
		var obj = evevt.target;
		switch (obj.id){
			case 'my_borrow': location.href = 'myBorrow.html?'+comom.forLoadHref(data);
				break;
			case 'my_recommend':location.href = 'myRecommend.html?'+comom.forLoadHref(data);
				break;
			case 'my_money_detail':location.href = 'commissionPage.html?'+comom.forLoadHref(data);
				break;
			default:
				break;
		}
		console.log(obj.id);
	}
}