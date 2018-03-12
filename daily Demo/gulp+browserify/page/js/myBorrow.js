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
			openId:openId,
			signature:pathData.signature
		}
		comom.request(resPath.getResUrl()+'/zs/customer/queryMyCustomerList/V2_0',data,function(res){
			//是否有数据,渲染列表
			if(res.respData.length>0){
				res.respData.forEach(function(val,index){
					var oLi = document.createElement('li');
					oLi.classList.add('my-borrow-li');
					(val.loanStatus == 1)&&oLi.classList.add('mark');
					oLi.innerHTML = '<div class="content">'+
										'<p class="f-14 f-grey">'+(val.createDateStr||'-') +'</p>'+
										'<p class="f-15">'+(val.name ||'') +'<span class="fr">'+(val.cellphone||'-') +'</span></p>'+
										'<p class="f-15">意向贷款金额(元)<span class="fr">'+(val.loanPriceStr||'-') +'</span></p>'+
										'<p class="f-15">意向贷款期限(期)<span class="fr">'+(val.loanLimit||'-') +'</span></p>'+
									'</div>';
					oLi.dataVal = JSON.stringify(val);
					comom.slt('#my_borrow').appendChild(oLi);
				});
			}else{
				comom.createDefault(comom.slt('#body'),'../img/2.0/2.png','门槛低、费用少的贷款，你居然还没申请过','goToBtn','要用钱，点这里');
				comom.slt('#goToBtn').onclick = function(event){
					location.href = 'borrowingCalc.html?openId='+openId;
				}
			}
			
		});
	}
	
	//列表点击
	comom.slt('#my_borrow').onclick = function(event){
		//事件触发节点对象
		var obj = event.target;
		if(obj.tagName.toLocaleUpperCase() == 'LI'){
			var data = (typeof obj.dataVal == 'string')?JSON.parse(obj.dataVal):obj.dataVal;
			if(data.tid){
				location.href = 'myBorrowDetail.html?openId='+openId+'&tid='+data.tid;	
			}else{
				comom.tost('找不到该订单id','3000');
			}
		}
	}
}
