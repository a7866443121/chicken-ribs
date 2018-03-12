import {baseUrl} from './env';
export const runAsync = (url,data,errBack,type) =>{
	url = baseUrl + url;
    var p = new Promise(function(resolve, reject){
        //做一些异步操作
        ((type||'') == 'file')?requestFile(url,data,function(res){resolve(res);},errBack):request(url,data,function(res){resolve(res);},errBack);	
    });
    return p;            
}
const request = (url, data, callBack, erroCallBack) =>{
	var xhr = new XMLHttpRequest();
	xhr.open('POST', url, 'true');
	xhr.setRequestHeader("Content-Type", 'application/x-www-form-urlencoded');
	xhr.send(convertData(data));
	console.log('请求参数:');
	console.log(data);
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4) {
			if(xhr.status == 200) {
				(typeof xhr.response == 'string') ? callBack(JSON.parse(xhr.response)): callBack(xhr.response);
				console.log('接口返回参数:');
				console.log(xhr.response);
			} else {
				erroCallBack();
			}
		}
	}

	function convertData (data){
		if(typeof data === 'object') {
			var convertResult = "";
			for(var c in data) {
				convertResult += c + "=" + data[c] + "&";
			}
			convertResult = convertResult.substring(0, convertResult.length - 1);
			return convertResult;
		} else {
			return data;
		}
	}
}
const requestFile = (url, data, callBack, erroCallBack) => {
	var xhr = new XMLHttpRequest();
	xhr.open('POST', url, 'true');
	xhr.send(data);
	console.log('请求参数:');
	console.log(data);
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4) {
			if(xhr.status == 200) {
				(typeof xhr.response == 'string') ? callBack(JSON.parse(xhr.response)): callBack(xhr.response);
				console.log('接口返回参数:');
				console.log(xhr.response);
			} else {
				erroCallBack();
			}
		}
	}
}
