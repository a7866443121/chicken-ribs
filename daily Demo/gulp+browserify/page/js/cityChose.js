//引入comom
var comom = require('../../api/comom.js');
//引入resPath
var resPath = require('../../api/respPath.js');

var param = comom.getPathPt();
window.addEventListener('DOMContentLoaded',function(){
	//获取城市参数
	var cityParam = {
		provinceID:'19',
	    deviceType:'1',	
	    signature:'1',	
	    edition:'v1.1',
	    openId:comom.getOpenId()
	}
	comom.request(resPath.getResUrl() + '/zs/v1/base/citys',cityParam,cityCallBack);
})

function cityCallBack(res){
    $(".list-group-citys .list-group-item").each(function(){
    	if(!$(this).hasClass("hidden")){
    		$(this).remove();
    	}
    })
	for(var i in res.respData){
		 cloneCity(res.respData[i].cityName,res.respData[i].cityId)
	}
	
	function cloneCity(cityinfo,cityid){
		var cityli = $(".list-group-citys").find(".list-group-item").eq(0).clone().removeClass("hidden");
		cityli.find("a").html(cityinfo);
		cityli.find("a").attr('cityid',cityid);
		$(".list-group-citys").append(cityli);
	}
	if( $('.cityBox ').eq(0).height() > $('.cityBox .list-group').eq(0).height()){
		$(".cityBox").on("touchmove",function(event){
			event.stopPropagation();
			event.preventDefault();
		})
	}else{
		$(".cityBox").unbind("touchmove");
	}
	//点击城市名字
	$(document).on('click','.list-group-citys .list-group-item',function(){
		var selectCity = $(this).find("a").html(),
			selectCityId = $(this).find("a").attr('cityid');
		 //跳到首页
		var city={
			selectCity:selectCity,
			selectCityId:selectCityId
		}
		if(param.scource=='calcu'){
			window.location.href="loanCalculate.html?"+comom.forLoadHref(city);
		}else{
			window.location.href="infoUpload.html?"+comom.forLoadHref(city);
		}		
	});
}
