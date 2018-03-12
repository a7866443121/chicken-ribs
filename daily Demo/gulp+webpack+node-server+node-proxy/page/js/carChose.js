//引入comom
var comom = require('../../api/comom.js');
//引入resPath
var resPath = require('../../api/respPath.js');
var liUrl;
var carInfoObj;


$(document).ready(function() {
	//获取车品牌
	var carBrandObj = {
		type: "che300",
		deviceType: "wx",
		signature: "1",
		edition: "1.0",
		openId: comom.getOpenId()
	};
	carInfoObj = {
		brand: '',
		model: '',
		year: '',
		modelId: ''
	};
	comom.request(resPath.getResUrl() + '/zs/v1/base/brand/get', carBrandObj, brandBoxOpen, erroCallback);
	
	liUrl = $('.brandBox .list-group-item');
	$('#content_A').html("");
	var brandCell = ".searchCell .content li";
	//	点击品牌列表
	$("#brandBox").on('click', brandCell, function() {
		var tid = $(this).attr("tid"),
			imgSrc = $(this).find("img").attr("src"),
			brandTxt = $(this).find("a").html(),
			carBrandObj = {
				type: "che300",
				brandId: tid,
				signature: '1',
				openId: comom.getOpenId()
			};
		carInfoObj.brand = brandTxt;
		carInfoObj.brandId = tid;
		sessionStorage.setItem("carInfo", JSON.stringify(carInfoObj));
		comom.request(resPath.getResUrl() + '/zs/v1/base/series/get', carBrandObj, seriesBoxOpen, erroCallback);
	});
	//点击车系遮罩层
	$(document).on('click', ".seriesLayer", function() {
		closeMsg("seriesBox", "seriesLayer");
	});
	//点击车系列表
	$(document).on('click', '.seriesBox .searchCell .content li', function() {
		closeMsg("seriesBox", "seriesLayer");
		var seriesId = $(this).find("a").attr("seriesId"),
			seriesName = $(this).find("a").html(),
			carModalObj = {
				signature: "1",
				deviceType: "wx",
				edition: "1.0",
				type: "che300",
				seriesId: seriesId,
				openId: comom.getOpenId()
			};
		carInfoObj.seriesId = seriesId;
		carInfoObj.series = seriesName;
		sessionStorage.setItem("carInfo", JSON.stringify(carInfoObj));
		comom.request(resPath.getResUrl() + '/zs/v1/base/model/get', carModalObj, carModalBoxOpen, erroCallback);
	});

	//点击车型列表
	$(document).on('click', '.carModalBox .searchCell .content li', function() {
		closeMsg("carModalBox", "carModalLayer");
		var modelName = $(this).find("a").html(),
			modelId = $(this).find("a").attr("modelId"),
			year = $(this).find("a").attr("year");
		carInfoObj.model = modelName;
		carInfoObj.modelId = modelId;
		if(year == '' || year == null || year == 'undefind') {
			carInfoObj.year = 2007;
		} else {
			carInfoObj.year = year;
		}
		sessionStorage.setItem("carInfo", JSON.stringify(carInfoObj));
		window.location.href = document.referrer;
	});
})

function checkOn(dad, obj) {
	dad.find("a.on").removeClass("on");
	obj.addClass("on");
}

/**弹出框**/
function closeMsg(box, layer) {
	$("." + layer).fadeOut();
	$("." + box).removeClass("fadeInRight").addClass("fadeOutRight");
	$("." + box).fadeOut();
}

function openMsg(box, layer) {
	$("." + layer).fadeIn();
	$("." + box).removeClass("fadeOutRight").addClass("fadeInRight");
	$("." + box).fadeIn();
};

function brandBoxOpen(res) {
	if(res.respData) {
		if(res.respData.length > 0) {
			var respData = JSON.parse(res.respData);
			if($(".searchCell .data-name").length <= 1) {
				$.each(respData, function(key, value) {
					var first = value.first,
						name = value.name,
						tid = value.tid,
						icon = resPath.getImgSRC() + value.icon,
						clone = liUrl.clone(),
						h4Txt = $("#brand" + first + " h4").html();
					if(first == h4Txt) {
						clone.attr("tid", tid);
						clone.find(".data-name").append(name);
						clone.find(".data-icon").attr("src", icon);
						$("#content_" + first).append(clone);
						clone.bind("click", seriesBoxOpen);
					}
				});	
				$('.searchCell').removeClass('hidden');
			}
		}
	}
}

//获取车系数据
function seriesBoxOpen(res) {
	liUrl1 = $('.seriesBox .seriesBoxInfo').eq(0),
		liUrl2 = $('.seriesBox .list-group-item').eq(0);
	console.log(res.respData);
	if(res.respData) {
		openMsg("seriesBox", "seriesLayer");
		$(".seriesLayer").on("touchmove", function(event) {
			event.stopPropagation();
			event.preventDefault();
		})
		$(".seriesBox .data-history").remove();
		$(".seriesBox .searchCell .seriesBoxInfo").eq(0).removeClass("hidden");
		var respData = JSON.parse(res.respData),
			str = [],
			str1 = [];
		for(var j = 0; j < respData.length; j++) {
			var type = respData[j].type,
				seriesName = respData[j].seriesName,
				seriesId = respData[j].seriesId,
				brandName = respData[j].brandName,
				clone1 = liUrl1.clone().addClass("data-history"),
				clone2 = liUrl2.clone().addClass("data-history");
			str1.length = respData.length;
			str1[str1.length] = seriesId;
			if(str.length == 0) {
				str[str.length] = type;
				clone1.find('.data-seriesName').attr("seriesId", seriesId);
				clone1.find('.data-type').html(type);
				clone1.find('.data-seriesName').html(seriesName).attr("brandName", brandName);
				$(".seriesBox .searchCell").append(clone1);
			} else {
				var hasit = false,
					indexStr;
				for(var i = 0; i < str.length; i++) {
					if(str[i] == type) {
						hasit = true;
						indexStr = i;
						break;
					}
				}
				if(hasit == true) {
					clone2.find('a').html(seriesName);
					clone2.find('.data-seriesName').attr("seriesId", seriesId);
					$(".seriesBox .searchCell .seriesBoxInfo").eq(indexStr + 1).find("ul").append(clone2);
				} else {
					str[str.length] = type;
					clone1.find('.data-seriesName').attr("seriesId", seriesId);
					clone1.find(".data-type").html(type);
					clone1.find('a').html(seriesName);
					$(".seriesBox .searchCell").append(clone1);
				}
			}
		}
		if($('.seriesBox ').eq(0).height() > $('.seriesBox .searchCell ').eq(0).height()) {
			$(".seriesBox").on("touchmove", function(event) {
				event.stopPropagation();
				event.preventDefault();
			})
		} else {
			$(".seriesBox").unbind("touchmove");
		}
		$(".seriesBox .searchCell .content li").bind("click", carModalBoxOpen);
		$(".seriesBox .searchCell .seriesBoxInfo").eq(0).addClass("hidden");
	}
}

//获取车型
function carModalBoxOpen(res) {
	var liUrl1 = $('.carModalBox .carModalBoxInfo').eq(0),
		liUrl2 = $('.carModalBox .list-group-item').eq(0);
	if(res.respData) {
		openMsg("carModalBox", "carModalLayer");
		$(".carModalBox .searchCell .carModalBoxInfo").eq(0).removeClass("hide");
		var respData = JSON.parse(res.respData),
			str = [];
		for(var j = 0; j < respData.length; j++) {
			var year = respData[j].year,
				modelName = respData[j].modelName,
				modelId = respData[j].modelServId,
				minRegYear = respData[j].minRegYear,
				clone1 = liUrl1.clone().addClass("data-history"),
				clone2 = liUrl2.clone().addClass("data-history");
			if(str.length == 0) {
				str[str.length] = year;
				clone1.find('.data-year').html(year);
				clone1.find('.data-modelName').html(modelName).attr("year", minRegYear)
				clone1.find('.data-modelName').attr("modelId", modelId);
				$(".carModalBox .searchCell").append(clone1);
			} else {
				var hasit = false,
					indexStr;
				for(var i = 0; i < str.length; i++) {
					if(str[i] == year) {
						hasit = true;
						indexStr = i;
						break;
					}
				}

				if(hasit == true) {
					clone2.find('a').html(modelName)
					clone2.find('.data-modelName').attr("year", minRegYear)
					clone2.find('.data-modelName').attr("modelId", modelId);
					$(".carModalBox .searchCell .carModalBoxInfo").eq(indexStr + 1).find("ul").append(clone2);
				} else {
					str[str.length] = year;
					clone1.find(".data-year").html(year);
					clone1.find('.data-modelName').html(modelName).attr("year", minRegYear)
					clone1.find('.data-modelName').attr("modelId", modelId);
					$(".carModalBox .searchCell").append(clone1);
				}
			}
		}
		$(".carModalBox .searchCell .carModalBoxInfo").eq(0).addClass("hidden");
	}
}

function erroCallback() {

}


