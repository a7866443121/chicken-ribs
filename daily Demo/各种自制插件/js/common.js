/**
 * xulian
 */
var scright;
$(document).ready(function() {
	loadSelect();
	// $(document).on("click",".loader-box",function(){loadingDone()});
	$(document).on("click",".navbar li.menu dt",function() {
		swichMenu($(this).closest("li"));
	});
	$(document).on("click",".navbar li.menu dd",function() {
		swichItem($(this));
	});
	$(".userInfo a.openMsg").click(openMsg);
	$(".black_layer,.iMsgBox .closeBtn").click(closeMsg);
	loadSwitchTag();

	// $(document).on("click",".table-list th .checkboxFive input",checkboxAll);
	// $(document).on("click",".table-list td .checkboxFive input",checkboxTr);
	// $(document).on("click",".table-list td:not('.cktd')",checkboxTr);
	$(document).on("click","a.iframeLink",changeIframe);
		
	bindFloatTableBtn();
	$(".table-scroll-box").scroll(function(){
		scright = $(".table-scroll-box .table").width() - $(".table-scroll-box").width() - $(".table-scroll-box").scrollLeft();
		$(".table-scroll-box td> .btn-tr-edit,.table-scroll-box td> .btn-tr-check,.table-scroll-box td> .btn-tr-rmb,.table-scroll-box td> .btn-tr-del,.table-scroll-box .table-opr-btn").css("right",scright+10);
	});

});
function loading() {
	$("body").append("<div class=\'loader-box\'><div class=\'loaders\'><div class=\'loader\'><div class=\'loader-inner ball-pulse-rise\'><div></div><div></div><div></div><div></div><div></div></div></div></div></div>");
}
function loadingDone() {
	$(".loader-box").remove();
}
function changeIframe() {
	$("#ti_panel_frame").attr("src",$(this).attr("data-target"));
}
function swichMenu($clickLi) {

	if(!$clickLi.hasClass("active")) {
		$("#contentNav .menu.active").find("dd").slideUp(function(){$("#contentNav .menu.active").removeClass("active")});
		$clickLi.find("dd").slideDown(function(){$clickLi.addClass("active")});
		if($clickLi.hasClass("todolist")) $clickLi.addClass("active");
	}else {
		$(".todolist").removeClass("active");
		$clickLi.find("dd").slideUp(function(){$clickLi.removeClass("active")});
	}
	setTimeout(function(){$("#contentNav").mCustomScrollbar("update")},500) ;
}
function swichItem($clickDd) {
	if(!$clickDd.hasClass("on")) {
		$(".navbar li.menu dd.on").removeClass("on");
		$clickDd.addClass("on");
	}
}
function closeMsg() {
	var animateNum = "";
	if($(".iMsgBox").hasClass("msgCenterShow")) animateNum = "2";
	$(".black_layer").fadeOut();
	$(".iMsgBox").removeClass("fadeInRight"+animateNum).addClass("fadeOutRight"+animateNum);
	$(".iMsgBox").fadeOut();
}
function openMsg() {
	var animateNum = "";
	if($(".iMsgBox").hasClass("msgCenterShow")) animateNum = "2";
	$(".black_layer").fadeIn();
	$(".iMsgBox").removeClass("fadeOutRight"+animateNum).addClass("fadeInRight"+animateNum);
	$(".iMsgBox").show();
	// $("#msgContent").mCustomScrollbar("update");
}
function loadSelect() {
	$(".dropdown .dropdown-menu").each(function() {
		$parent = $(this).closest(".dropdown");
		$btn = $parent.find("button.dropdown-toggle");
		$menuUl = $parent.find(".dropdown-menu");
		if($btn.hasClass("default-option")) {
			if(!$menuUl.find("li.default").length>0) {
				$menuUl.prepend("<li class='default' role='presentation' tabindex='-1' href='javascript:'><a role='menuitem'>"+$btn.attr("data-default")+"</a></li>");
			}
		}
		var $sltli = $(this).find("a.on");
		valSelect($sltli);
	});
	$(document).on("click",".dropdown .dropdown-menu li.default a",function(){
		resetSelect($(this).closest(".dropdown").find("button.dropdown-toggle").attr("id"));
	});
	$(document).on("click",".dropdown .dropdown-menu li:not('.default') a",function(){
		checkSelect($(this));
	});
}
function valSelect($sltli) {
	var btn = $sltli.closest(".dropdown").find("button.dropdown-toggle");
	var ipt = $sltli.closest(".dropdown").find("input");
	btn.attr("data-id", $sltli.attr("data-id"));
	ipt.attr("data-id", $sltli.attr("data-id"));
	btn.find("i").html($sltli.html());
	ipt.val($sltli.html()).change();
	btn.addClass("wrote");
}
function checkSelect($obj) {
	$parent = $obj.closest(".dropdown-menu");
	if(!$obj.hasClass("on")) {
		$parent.find("a.on").removeClass("on");
		$obj.addClass("on");
		$parent.closest(".dropdown").find("i").html($obj.html());
	}
	valSelect($obj);
}
function resetSelect(sltid) {
	$("ul[aria-labelledby='"+sltid+"']").find(".on").removeClass("on");
	$("#"+sltid).find("i").html($("#"+sltid).attr("data-default"));
	$("#"+sltid+"_ip").attr("data-id","").val("");
	$("#"+sltid).attr("data-id","").val("");//Ò»ÆðÖÃ¿Õ
	$("#"+sltid).removeClass("wrote");
}
function setSelect(sltid,dataid) {
	var $obj = $("ul[aria-labelledby='"+sltid+"']").find("a[data-id='"+dataid+"']");
	checkSelect($obj);
}
function initSelect() {
	$(".dropdown .dropdown-menu").each(function() {
		$parent = $(this).closest(".dropdown");
		$btn = $parent.find("button.dropdown-toggle");
		$menuUl = $parent.find(".dropdown-menu");
		var ipt = $parent.find("input");
		var selectData=ipt.attr("data-id");//数据库返回的数据（数据展示时应该写入此处）
		if(selectData&&null!=selectData&&""!=selectData){//
			var $obj = $menuUl.find("a[data-id='"+selectData+"']");
			checkSelect($obj);
		}
	});
}
function loadSwitchTag() {
	$(document).on("click",".tag-box .tag-item", function(){
		var $parent = $(this).closest(".tag-box");
		if(!$(this).hasClass("on")) {
			$parent.find(".on").removeClass("on");
			$(this).addClass("on");

			var tagId = $(this).attr("data-tag");

			if(tagId == "#msgUnread") {
				$(".panel-title small").css("display","inline-block");
			}else 
				$(".panel-title small").css("display","none");
			$(tagId).siblings(".on").removeClass("on");
			$(tagId).addClass("on");
			$(tagId).mCustomScrollbar("update");
		}
	});
}
function checkboxAll() {
	$ck = $(this).closest(".table").find(".cktd input")
	if($(this).prop('checked')) {
		$ck.each(function(){
			if(!$(this).prop('checked')) $(this).click();
		});		
	}else {
		$ck.each(function(){
			$(this).removeAttr("checked");
			$(this).closest("tr").removeClass("checked");
		});
	}
}
function checkboxTr() {
	var $tr,$ck;
	if($(this).is("td")) {
		console.log("td")
		$tr = $(this).closest("tr");
		$ck = $tr.find(".checkboxFive input");
			$ck.click()
	}else if($(this).is("input")) {
		$ck = $(this);
		$tr = $ck.closest("tr");
		if(!$ck.prop('checked')) {
			$tr.removeClass("checked");
		}else $tr.addClass("checked");
	}
}

//闪现泡泡（弹出一秒消失）callPop(状态码,要显示的字符串)
//状态码说明 0:失败 1:成功

var popTal;
function callPop(status,txt) {
	if(popTal) popTal.fadeOut(function(){
		popTal.remove();
	});
	$("body").append("<div class='popWin'><div class='txt'><i class='glyphicon glyphicon-remove-circle'></i><i class='glyphicon glyphicon-ok-circle'></i><span>"+txt+"</span></div></div>");
	popTal = $("body").find(".popWin");
	switch(status){
		case 0:
			$(".popWin").addClass("failure");
			break;
		case 1:
			$(".popWin").addClass("success");
			break;
	}
	$(".popWin").fadeIn(function() {
		setTimeout(function(){
			$(".popWin").remove();
		},700);
	});
}
function bindFloatTableBtn() {
	scright = $(".table-scroll-box .table").width() - $(".table-scroll-box").width();
	$(document).on("mouseover",".table-scroll-box tr",function(){
		$("td> .btn-tr-edit, td> .btn-tr-check, td> .btn-tr-rmb, td> .btn-tr-del, .table-opr-btn").css("right",scright+10);
	});
}

/* 
 * post方式提交数据 
 * PARAMS为参数，如var param = {query:_jsonFilter}，一个json对象
 * */
function jsPost(URL, PARAMS) {        
    var temp = document.createElement("form");        
    temp.action = URL;        
    temp.method = "post";        
    temp.style.display = "none";        
    for (var x in PARAMS) {        
        var opt = document.createElement("textarea");        
        opt.name = x;        
        opt.value = PARAMS[x];        
        temp.appendChild(opt);        
    }        
    document.body.appendChild(temp);        
    temp.submit();        
    return temp;        
}
/** 切换标签frame **/
$(document).on("click",".tagFrameTop li", function() {
	$(".tagFrameContent").attr("src",$(this).attr("data-src"));
	$(".tagFrameTop li").removeClass("active");
	$(this).addClass("active");
});

