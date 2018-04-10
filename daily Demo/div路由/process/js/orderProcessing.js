$(function(){
	
	
	 

	//表格点击操作
	$('#profile_tbody').on('click','td',function(){
		var obj = $(this);		
		$('#prompt_input').val('');
		$('#pop_prompt').show();
		$('#prompt_input').val(obj.html());
		$('#prompt_sure').off().on('click',function(){
			obj.html($('#prompt_input').val());
			obj.attr('class','');
			$('#pop_prompt').hide();
		});
		$('#prompt_no').off().on('click',function(){
			$('#pop_prompt').hide();
			$('#prompt_input').val('');
		});

	});
	/*table初始化*/
	var orderTab = $('#projiectList_success').DataTable({
		searching: false, //禁止搜索
		lengthChange: true, //条数显示选择
		ordering: false, //允许点击表头排序
		paging: true,
		info: true,
		autowidth:true
	});
	
	/*table初始化*/
	var orderTab = $('#projiectList_profile').DataTable({
		searching: false, //禁止搜索
		lengthChange: true, //条数显示选择
		ordering: false, //允许点击表头排序
		paging: true,
		info: true,
		autowidth:true
	});
	
//	$('#file_btn').Huploadify({
//       auto:true,
//       fileTypeExts:'*.*;',
//       multi:true,
//       formData:{key:123456,key2:'vvvv'},
//       fileSizeLimit:9999,
//       showUploadedPercent:true,//是否实时显示上传的百分比，如20%
//       showUploadedSize:true,
//       removeTimeout:9999999,
//       uploader:'../handler/HandlerMeetingMaterial.ashx?MeetMaterialFlag=Add',
//       onUploadStart:function(){
//           //alert('开始上传');
//           },
//       onInit:function(){
//           //alert('初始化');
//           },
//       onUploadComplete:function(){
//           //alert('上传完成');
//          },
//       onDelete:function(file){
//           console.log('删除的文件：'+file);
//          console.log(file);
//      }
//  });
	
	//tab切页
	$('#myTab a').click(function (e) {
	  e.preventDefault();
	  $(this).tab('show');
	});
	
});