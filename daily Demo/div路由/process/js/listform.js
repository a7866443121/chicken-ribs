$(function() {
	
	
	
	
	
	
	var name = [
		{name:'长沙微康'},
		{name:'长沙微微'},
		{name:'长微微康'},
		{name:'长沙微康'},
		{name:'长沙微康'},
		{name:'长沙微康'},
		{name:'长沙微康'},
		{name:'长沙微康'},
		{name:'长沙微康'},
		{name:'长沙微康'},
		{name:'长沙微康'},
	]
	
//	列表渲染
function drawList(arr){
	var val = $('#search_input').val();
	$('#list_ul').html('');
	var len = arr.length/5;
	$('#seach_result').html('找到相关'+arr.length+'个');
	for (i in arr) {
		var str ='<li>'+ arr[i].name+'</li>';
		str = str.replace(val,'<span>' + val +'</span>')
		$('#list_ul').append(str);
	}
	//分页
	$("#pagination").pagination({
		currentPage: 1,
		totalPage: len,
		isShow: false,
		count: 5,
		prevPageText: "上一页",
		nextPageText: "下一页 ",
		callback: function(page) {
			var firstLi = $('#list_ul li').first();
			firstLi.css('margin-top',-(page*225)+'px');
		}
	});
	
	
}
	//列表点击
	$('#list_ul').on('click','li',function(){
		$('#list_ul').find('li').removeClass('list-active');
		$(this).addClass('list-active');
	});
	
	//搜索提交
	$('#search_btn').on('click',function(){
		drawList(name);
		//搜索提交结果,有/没有
		if ($('#search_input').val()) {
			$('#search_box').addClass('are');
			$('#form_box').show();
			$('#search_result').show();
			$('#seach_default').hide();
			//三级联动
		$("#distpicker1").distpicker({
		    province: "湖南省",
		    city: "长沙市",
		    district: "岳麓区"
		});
		} else{
			$('#search_box').removeClass('are')
			$('#search_result').hide();
			$('#seach_default').show();
		}
	});
	//模态显示和隐藏
	$('#addinfo').on('click',function(){
		$('#myModal').modal('show');
		//三级联动
		$("#distpicker").distpicker({
		    province: "湖南省",
		    city: "长沙市",
		    district: "岳麓区"
		});
	});
	$('#close_modal').on('click',function(){
		$('#myModal').modal('hide');
	});
	
	
	
	//表单提交验证
	function dtValue(){
		if (!$('#inputName').val()) {
			return false;
		}else if(!/^\d{5,10}$/.test($('#inputCode').val())){
			return false;
		}else if(/^\d$/.test($('#inputUser').val())){
			return false;
		}else if(!/^1[345789]\d{9}$/.test($('#inputTel').val())){
			return false;
		}else {
			return true;
		}
	}
	//表单格式验证
	$('#inputName').on('blur',function(){
		dtEvent($(this),'请输入单位名称',!$('#inputName').val());
	});
	$('#inputCode').on('blur',function(){
		dtEvent($(this),'企业信用代码格式输入有误，请重新输入',!/^\d{5,10}$/.test($('#inputCode').val()));
	});
	$('#inputUser').on('blur',function(){
		dtEvent($(this),'名字输入有误，请重新输入',/^\d$/.test($('#inputUser').val()));
	});
	$('#inputTel').on('blur',function(){
		dtEvent($(this),'手机号码输入有误，请重新输入',!/^1[345789]\d{9}$/.test($('#inputTel').val()));
	});
	function dtEvent(obj,text,reg){
		var errobj = obj.siblings('p');
		(reg)?(errobj.html(text),errobj.show()):(errobj.html(''),errobj.hide());
	}
			

});