<template>
	 <transition name="fade">
	<div class="infoUpload" id="infoUpload">
		<div class="header-prompt f-12">目前仅支持在长沙办理业务，其他地区暂未开放</div>
		<div class="rows mt10">
			业务办理城市
			<span class="fr" id="">长沙</span>
		</div>
		<!--信息-->
		<div class="tel-name mt10">
			<div class="input-rows">
				<label class="f-15">姓名</label>
				<input class="f-15 text-right" id="name_btn" type="text"  placeholder="请输入姓名"/>
			</div>
			<div class="input-rows">
				<label class="f-15">手机号码</label>
				<input class="f-15 text-right" id="tel_btn" type="tel"  placeholder="请输入手机号码"/>
			</div>
		</div>
		<!--图片上传-->
		<div class="img-upload mt10">
			<div class="img-upload-content f-15">
				行驶证照片
				<p class="mt10 f-12">拍摄行驶证照片，方便业务经理为您初步评估</p>
			</div>
			<ul class="img-ul" id="img_ul" @click="addPhoto($event)">
				<div class="upload-btn" id="upload_btn">
					<img id="upload_btn_img" src="../img/driving_permit_image.png" />
					<input id="file_btn" type="file" class="file-btn" accept="image/*" value="" @change="preview($event)" />
				</div>
				<!--<li><i class="icon iconfont">&#xe617;</i><img src="../../buildPage/img/driving_permit.png"/></li>
				<li></li>-->
			</ul>
		</div>
		<div class="submit-box"><a class="submit-btn f-15" id="submit_btn" @click="submit('bbb',$event)">提交</a></div>
	</div>
	 </transition>
</template>

<script>
	import {slt, tost,forLoadHref} from '../api/comom';
	import {runAsync} from '../api/requst';
	export default{
		data(){
			return {
				city: '长沙',
				cityId: '19',
				name: '',
				cellphone: ''
			}
		},
		created(){
			
		},
		methods:{
			async preview(event) {
				var el = event.target;
				var formData = new FormData();
				var file = el.files[0];
				//上传数据
				formData.append('uid', 'aa');
				formData.append('deviceType', 'ios');
				formData.append('signature', '1');
				formData.append('multipartFile', file);
				var results = await runAsync('/zs/v1/zimgOpr/upload ', formData, function() {}, 'file');
				console.log(results);
				if(results){
					var reader = new FileReader();
					reader.readAsDataURL(file);
					//预览图片
					reader.onload = function(e) {
						var oUl = document.getElementById('img_ul');
						var oLi = document.createElement('li');
						oLi.dataVal = results.respData.url;
						oLi.innerHTML = '<i class="icon iconfont">&#xe617;</i><img src="' + e.target.result + '"/>';
						oUl.insertBefore(oLi,slt('#upload_btn'));
						(slt('#img_ul li').length >= 5) ? slt('#upload_btn').classList.add('hidden'): slt('#upload_btn').classList.remove('hidden');
					}
				}
			},
			submit(a,event) {
//				this.$router.go(-1);
				var dataName = slt('#name_btn').value;
				var dataTel = slt('#tel_btn').value;
				var aImgSrc = [];
				var parameter = {
					openId: 'getOpenId()',
					city: '长沙',
					cityId: '19',
					name: dataName,
					cellphone: dataTel,
					province: '湖南',
					provinceId: '19',
					photos: aImgSrc,
					signature: '1',
					edition: '1',
					deviceType: 'ios'
				}
				this.name = dataName;
				this.cellphone = dataTel;
				for(var i = 0, leng = slt('#img_ul li').length; i < leng; i++) {
					parameter.photos.push(slt('#img_ul li')[i].dataVal);
				}
				console.log(parameter.photos);
				console.log(dtValue());
				if(dtValue()) {
					this.$router.push('/myCenter?name='+forLoadHref(parameter));
					this.requst.request('http://192.168.1.104:18192/yuedianqian-wap/zs/customer/v1.0/addCustomer', parameter, function(res) {
						var code = res.respCode,
							mes = res.respMsg;
						if(code == 1) {
							this.$router.push('/index'+forLoadHref(parameter));
						} else if((code == 0) && (mes == 'repet')) {
							this.$router.push('/myCenter'+this.name);
						} else {
							this.$router.push('/myCenter'+this.name);
						}
					}, function() {
		
					});
				}
				function dtValue() {
					var dataName = slt('#name_btn').value || null;
					var dataTel = slt('#tel_btn').value || null;
					var nameReg = /\d/g;
					var phoneReg = /^1[3|4|5|7|8|9]\d{9}$/;
					if(dataName && dataTel) {
						if((nameReg.test(dataName) == true) || (dataName.length > 20)) {
							tost('请输入您的真实姓名，不超过20个汉字', 3000);
							return false;
						} else if(!phoneReg.test(dataTel) == true) {
							tost('请输入正确的手机号码', 3000);
							return false;
						} else {
							return true;
						}
					} else {
						tost('用户名与手机号码不能为空!', 3000);
						return false;
					}
				}
			},
			addPhoto(e) {
				(e.target.tagName == 'I') && (e.target.parentElement.outerHTML = '');
				//上传按钮显示隐藏
				(slt('#img_ul li').length >= 5) ? slt('#upload_btn').classList.add('hidden'): slt('#upload_btn').classList.remove('hidden');
			}
		}
	}
</script>

<style>
body{	
	width: 750px;
	background-color: #F1F4F8;
}
.rows{
	border-bottom: 1px solid #E6E6E6;
	border-top: 1px solid #E6E6E6;
}
.header-prompt{
	position: relative;
	background-color: #FF9000;
	color: #fff;
	padding: 14px 30px;
}
.tel-name{
	border-bottom: 1px solid #E6E6E6;
	border-top: 1px solid #E6E6E6;
	background-color: #fff;
	padding: 0 30px;
}
.tel-name .input-rows:first-child{
	border-bottom: 1px solid #E6E6E6;
}
.input-rows{
	display: flex;
	align-items: center;
	justify-content: center;
}
.input-rows label{
	flex: 2;
}
.input-rows input{
	flex: 5;
	border: 0;
	height: 87px;
}
.input-rows input::-webkit-input-placeholder{
	text-align: right;
}
/*图片上传*/
.img-upload{
	border-bottom: 1px solid #E6E6E6;
	border-top: 1px solid #E6E6E6;
	padding: 0 30px;
	background-color: #fff;
}
.img-upload-content{
	padding: 30px 0;
}
.img-upload-content p{
	color: #66605C;
}
.img-ul{
	width: 100%;
	position: relative;
	font-size: 0;
	padding: 0 0 30px;
	overflow: hidden;
	clear: both;
}
.img-ul .upload-btn{
	position: relative;
	display: inline-block;
	width: 50%;
}
.img-ul .upload-btn img{
	width: 100%;
	height: 220px;
}
.file-btn{
	position: absolute;
	top: 0;
	left: 0;
	display: inline-block;
	width: 100%;
	height: 100%;
	opacity: 0;
}
.img-ul li{
	position: relative;
	width: 49%;
	height:220px;
	overflow: hidden;
}
.img-ul li:nth-child(even){
	float: right;
}
.img-ul li:nth-child(odd){
	float: left;
}
.img-ul li img{
	width: 100%;
}
.img-ul li .icon{
	position: absolute;
	right: 0;
	font-size: 32px;
	padding: 2.5px 4px;
	background-color: rgba(0,0,0,0.6);
	color: #fff;
}
.submit-box{
	width: 100%;
	text-align: center;
}
.submit-btn{
	display: inline-block;
	width: 690px;
	padding: 24px 0;
	background-color: #2E59FF;
	box-shadow: 0 2px 8px 0 rgba(46,89,255,0.40);
	border-radius: 6px;	
	color: #fff;
	text-align: center;
	margin: 40px auto;
}
</style>