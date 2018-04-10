/*
 * 获取列表排序数据
 */
function getTableParams(data){
	var result = {};
	result.draw = data.draw;
	result.page = data.start / data.length + 1;
	result.rows = data.length;
	var orderArr = data.order;
	if(orderArr && orderArr.length > 0){
		var order = orderArr[0];
		// result.sortName = data.columns[order.column].data;
		// result.sortOrder = order.dir;
		/* add by qihao
			如果设置了描述性的名称，则使用描述性的名称字段，例如名称一般是中文，但是会按照拼音码排序，所以这里使用name字段值为pym；
			如果没设置，则使用data字段
		*/
		if(data.columns[order.column].name){
            result.sort = data.columns[order.column].name;
		}else{
            result.sort = data.columns[order.column].data;
		}
		result.order = order.dir;
	}
	return result;
}

/*
 * dataTable后台分页数据请求函数
 */
function getTabdata (data,callback,setting,argument){
	var params = getTableParams(data);
	params = $.extend(params,argument.query);
	$.ajax({
		type: argument.type || 'post',
		url: argument.url,
		cache : false,	//禁用缓存
		data: params,	//传入已封装的参数
		dataType: "json",
		success: function(result) {
			//异常判断与处理
			if (result.code == 2) {
				alert("查询失败。错误码：" + result.msg);
				return;
			}
			//封装返回数据
			var returnData = {};
			returnData.draw = data.draw;//这里直接自行返回了draw计数器,应该由后台返回
			returnData.recordsTotal = result.data.total;
			returnData.recordsFiltered = result.data.total;//后台不实现过滤功能，每次查询均视作全部结果
			returnData.data = result.data.rows;
			//调用DataTables提供的callback方法
			callback(returnData);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			alert("查询失败");
		}
	})
}