//引入comom
var comom = require('../../api/comom.js');
//引入routes
var routes = require('../../api/routes.js');
//引入resPath
var resPath = require('../../api/respPath.js');
window.addEventListener('DOMContentLoaded', function() {
//	comom.slt('#btn').onclick = function(){
//		console.log(routes);
//		var iframe = window.parent.document.getElementById('routes');
//		iframe.src = 'infoUpload.html';
//		console.log(iframe)
//	}
	comom.slt('#btn').onclick = function(){
		var parameter = {
			username:'张三',
			password:'23'
		}	
		comom.request(resPath.path + '/zs/login', parameter, function(res) {
			
		}, function() {

		});
	}
})
