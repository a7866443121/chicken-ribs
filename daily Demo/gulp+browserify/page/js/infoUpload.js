//引入comom
var comom = require('../../api/comom.js');
//引入resPath
var resPath = require('../../api/respPath.js');
console.log(resPath);
//获取地址栏参数
var param = comom.getPathPt();
//微信分享
//comom.share();

function submitData() {
	//获取城市
	if(decodeURI(param.selectCity) != 'undefined'){
		comom.slt('#data_city').innerHTML = decodeURI(param.selectCity);
	}	
	//进入选择城市
	comom.slt('#city').addEventListener('click',function(){		
		window.location.href="cityChose.html";
	})
	function preview() {
		comom.slt('#file_btn').onchange = function() {
			var formData = new FormData();
			var file = this.files[0];
			//上传数据
			formData.append('uid', 'aa');
			formData.append('deviceType', 'ios');
			formData.append('signature', '1');
			formData.append('multipartFile', file);
			comom.requestFile(resPath.path + '/zs/v1/zimgOpr/upload ', formData, function(res) {
				var reader = new FileReader();
				reader.readAsDataURL(file);
				//预览图片
				reader.onload = function(e) {
					var oUl = document.getElementById('img_ul');
					var oLi = document.createElement('li');
					oLi.dataVal = res.respData.url;
					oLi.innerHTML = '<i class="icon iconfont">&#xe685;</i><img src="' + e.target.result + '"/>';
					oUl.insertBefore(oLi, comom.slt('#upload_btn'));
					//上传按钮显示||隐藏
					(comom.slt('#img_ul li').length >= 5) ? comom.slt('#upload_btn').classList.add('hidden'): comom.slt('#upload_btn').classList.remove('hidden');
				}
			}, function() {

			})
		}
	}
	preview();
	//提交数据
	comom.slt('#submit_btn').addEventListener('click', function() {
		var dataName = comom.slt('#name_btn').value;
		var dataTel = comom.slt('#tel_btn').value;
		//接口的必要参数
		var parameter = {
			openId: comom.getOpenId(),
			city: document.getElementById('data_city').innerHTML,
			cityId: (param.selectCityId || '184'),
			name: dataName,
			cellphone: dataTel,
			province: '湖南',
			provinceId: '19',
			photos: [],
			signature: '1'
		}
		//遍历图片栏,获取该元素上的dataVal属性,添加进photos
		//该元素上的dataVal属性即为该图片在数据库的唯一标识
		for(var i = 0, leng = comom.slt('#img_ul li').length; i < leng; i++) {
			parameter.photos.push(comom.slt('#img_ul li')[i].dataVal);
		}
		console.log(parameter.photos);
		//验证参数
		if(dtValue()) {
			comom.request(resPath.path + '/zs/customer/addCustomer/V1_0', parameter, function(res) {
				var code = res.respCode,
					mes = res.respMsg;
				if(code == 1) {
					comom.createDefaultBtn(document.getElementById('body'), '../img/2.0/3.png', '您的借款申请提交成功！', '您的融资顾问将尽快与您联系，请保持手机通畅。', 'goToBtn', '好的', '&#xe6df;');
					comom.slt('#goToBtn').onclick = function() {
//						wx.closeWindow();
					}
				} else if((code == 0) && (mes == 'repet')) {
					comom.createDefaultBtn(document.getElementById('body'), '../img/apply_succeed.png', '我们已收到您的申请。', '系统已收到您3天内的多次申请，我们将优先为您安排融资顾问。请勿重复提交，谢谢。如您需求紧急,建议直接致电 <a tel="400-901-9688" class="f-theme">400-901-9688</a>咨询。', 'goToBtn', '好的');
					comom.slt('#goToBtn').onclick = function() {
//						wx.closeWindow();
					}
				} else {
					comom.createDefault(document.getElementById('body'), '../img/no_Internet_concatenon.png', '系统开小差啦，请重试一下', 'goToBtn', '重新提交');
					comom.slt('#goToBtn').onclick = function() {
						window.location.href = window.location.href;
					}
				}
			}, function() {

			});
		}
	});

	function dtValue() {
		var dataName = comom.slt('#name_btn').value || null;
		var dataTel = comom.slt('#tel_btn').value || null;
		var nameReg = /\d/g;
		var phoneReg = /^1[3|4|5|7|8|9]\d{9}$/;
		if(dataName && dataTel) {
			if((nameReg.test(dataName) == true) || (dataName.length > 20)) {
				comom.tost('请输入您的真实姓名，不超过20个汉字', 3000);
				return false;
			} else if(!phoneReg.test(dataTel) == true) {
				comom.tost('请输入正确的手机号码', 3000);
				return false;
			} else {
				return true;
			}
		} else {
			comom.tost('姓名与手机号码不能为空!', 3000);
			return false;
		}
	}
	//点击操作
	comom.slt('#img_ul').onclick = function(e) {
		(e.target.tagName == 'I') && (e.target.parentElement.outerHTML = '');
		//上传按钮显示隐藏
		(comom.slt('#img_ul li').length >= 5) ? comom.slt('#upload_btn').classList.add('hidden'): comom.slt('#upload_btn').classList.remove('hidden');
	}
}
submitData();