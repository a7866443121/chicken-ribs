$(function(){
	
	//筛选条件
	$("#filterBox .filter-item").on("click", "span", function() {
		$(this).parent().find("span.active").removeClass("active");
		$(this).addClass("active");
		if($(this).hasClass("custom")){
			$(this).next(".custom-box").show();
		} else {
			$(this).nextAll(".custom-box").hide();
		}
	});
	
	//全选
	$("#che0").on("click",function(){
		if($(this).is(':checked')) {
			$("#salesTab").find('.for-label').prop("checked", true);
		}else{
			$("#salesTab").find('.for-label').removeAttr("checked");
		}
	})
	//tab切页
	$('#myTab a').click(function (e) {
	  e.preventDefault();
	  $(this).tab('show');
	});
	//企业订单
	/*table初始化*/
	var orderTab = $('#projiectList_enterprise').DataTable({
		searching: false, //禁止搜索
		lengthChange: true, //条数显示选择
		ordering: false, //允许点击表头排序
		paging: true,
		info: true,
		autowidth:true
	});
	//个人订单
	/*table初始化*/
	var orderTab = $('#projiectList_personal').DataTable({
		searching: false, //禁止搜索
		lengthChange: true, //条数显示选择
		ordering: false, //允许点击表头排序
		paging: true,
		info: true,
		autowidth:true
	});
	//团体订单
	/*table初始化*/
	var orderTab = $('#projiectList_group').DataTable({
		searching: false, //禁止搜索
		lengthChange: true, //条数显示选择
		ordering: false, //允许点击表头排序
		paging: true,
		info: true,
		autowidth:true
	});
	//vip订单
	/*table初始化*/
	var orderTab = $('#projiectList_vip').DataTable({
		searching: false, //禁止搜索
		lengthChange: true, //条数显示选择
		ordering: false, //允许点击表头排序
		paging: true,
		info: true,
		autowidth:true
	});
});
