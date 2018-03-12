/*
 * jQuery Ajax封装通用类 (st-lj) 
 * Copyright 2011-2016 .
 */
$(function() {
	/*
	 * ajax封装 url 发送请求的地址 data 发送到服务器的数据，数组存储，如：{"date": new Date().getTime(),
	 * "state": 1} async 默认值: true。默认设置下，所有请求均为异步请求。如果需要发送同步请求，请将此选项设置为 false。
	 * 注意，同步请求将锁住浏览器，用户其它操作必须等待请求完成才可以执行。 type 请求方式("POST" 或 "GET")， 默认为 "GET"
	 * dataType 预期服务器返回的数据类型，常用的如：xml、html、json、text successfn 成功回调函数 errorfn
	 * 失败回调函数
	 */
	jQuery.ax = function(url, data, async, type, dataType, contentType,successfn, errorfn) {
		async = (async == null || async == "" || typeof (async) == "undefined") ? "true"
				: async;
		type = (type == null || type == "" || typeof (type) == "undefined") ? "post"
				: type;
		contentType = (contentType == null || contentType == "" || typeof (contentType) == "undefined") ? "application/x-www-form-urlencoded"
				: contentType;
		dataType = (dataType == null || dataType == "" || typeof (dataType) == "undefined") ? "json"
				: dataType;
		data = (data == null || data == "" || typeof (data) == "undefined") ? {
			"date" : new Date().getTime()
		} : data;
		$.ajax({
			type : type,
			async : async,
			data : data,
			url : url,
			timeout:10000,
			dataType : dataType,
			contentType : contentType,
			success : function(d) {
				loadingDone();
				if(successfn){
					if(d.respCode==1){
						successfn(d);
					}else{
						callPop(0,d.respMsg);return;
					}
				}else{
					console.log(d);
					callPop(0,"请求成功！");return;
				}
			},
			complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
				if(status=='timeout'){//超时,status还有success,error等值的情况
					ajaxTimeoutTest.abort();
//					loadingDone();
//					callPop(0,"超时");
					goto404();
					return;
				}
			},
			error : function(e) {
				if(!errorfn){
					callPop(0,e.respMsg);
					goto404();
				}
			}
		});
	};
	/**
	 * ajax封装 url 发送请求的地址 data 发送到服务器的数据，数组存储，如：{"date": new Date().getTime(),
	 * "state": 1} successfn 成功回调函数
	 */
	jQuery.axpost = function(url, data, successfn) {
		loading();
		data = (data == null || data == "" || typeof (data) == "undefined") ? {
			"date" : new Date().getTime()
		} : data;
		var ajaxTimeoutTest=$.ajax({
			type : "post",
			data : data,
			url : url,
			async:false,
			timeout:10000,
			dataType : "json",
//			contentType : "application/json",
			success : function(d) {
				loadingDone();
				if(successfn){					
					if(d.respCode==1){
						successfn(d);
					}else{
						successfn(d);
						callPop(0,d.respMsg);return;
					}
				}else{
					callPop(0,"请求成功！");return;
				}
			},
			complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
				if(status=='timeout'){//超时,status还有success,error等值的情况
					ajaxTimeoutTest.abort();
					loadingDone();
//					callPop(0,"超时");
					goto404();
					return;
				}
			}
		});
	};
	/**
	 * ajax封装 url 发送请求的地址 data 发送到服务器的数据，数组存储，如：{"date": new Date().getTime(),
	 * "state": 1} dataType 预期服务器返回的数据类型，常用的如：xml、html、json、text successfn
	 * 成功回调函数 errorfn 失败回调函数
	 */
	jQuery.axspost = function(url, data, successfn, errorfn) {
		loading();
		data = (data == null || data == "" || typeof (data) == "undefined") ? {
			"date" : new Date().getTime()
		} : data;
		$.ajax({
			type : "post",
			data : data,
			url : url,
			timeout:10000,
			dataType : "json",
			success : function(d) {
				loadingDone();
				if(successfn){					
					if(d.respCode==1){
						//console.log("success...")
						successfn(d);
					}else{
						successfn(d);
						//console.log("success...")
						callPop(1,d.respMsg);return;
					}
				}else{
					console.log(d);
					callPop(0,"请求成功！");return;
				}
			},
			error : function(e) {
						//console.log("error...")
				loadingDone();
				if(errorfn){					
					errorfn(e);
				}else{
					callPop(0,"请求失败！请检查代码。");return;
				}
			}
		});
	};
	/**
	 * ajax封装 url 发送请求的地址 data 发送到服务器的数据，数组存储，如：{"date": new Date().getTime(),
	 * "state": 1} dataType 预期服务器返回的数据类型，常用的如：xml、html、json、text successfn
	 * 成功回调函数 errorfn 失败回调函数
	 */
	jQuery.axsget = function(url, successfn, errorfn) {
		$.ajax({
			type : "get",
			url : url,
			timeout:10000,
			dataType : "json",
			success : function(d) {
			},
			error : function(e) {
			}
		});
	};
	
	/**
	 * ajax封装 url 发送请求的地址 data 发送到服务器的数据，数组存储，如：{"date": new Date().getTime(),
	 * "state": 1} successfn 成功回调函数
	 */
	jQuery.axpostJosn = function(url, data, successfn) {
		data = (data == null || data == "" || typeof (data) == "undefined") ? {
			"date" : new Date().getTime()
		} : data;
		var ajaxTimeoutTest=$.ajax({
			type : "post",
			data : JSON.stringify(data),
			url : url,
			timeout:10000,
			dataType : "json",
			contentType : "application/json",
			success : function(d) {
				loadingDone();
				if(successfn){					
					if(d.respCode==1){
//						callPop(1,d.respMsg);
						successfn(d);
					}else{
						alert(d.respMsg);
					}
				}else{
					console.log(d);
					alert("请求成功！");
				}
			},
			complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
				if(status=='timeout'){//超时,status还有success,error等值的情况
					ajaxTimeoutTest.abort();
					alert("超时");
				}
			}
		});
	};
});