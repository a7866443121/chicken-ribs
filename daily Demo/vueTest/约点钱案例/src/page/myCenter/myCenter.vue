<template>
	<div class="body" id="myCenter">
		<!--头部-->
		<header id="header">
			<div class="my-header"><span><img :src="wechatIcon"/></span></div>
			<div class="my-name"><font>{{realName}}</font></div>
			<div class="my-info" v-if="this.organizationName"><font>{{organizationName}}</font></div>
		</header>
		<!--nav-->
		<nav id="nav">
			<div class="nav-left">我借过<p id="borrow_money">&nbsp;<small>{{loanAmountStr}} 元</small></p></div>
			<div class="nav-right">我赚了<p id="make_money">&nbsp;<small> {{brokageAmountStr}} 元</small></p></div>
		</nav>
		<!--列表-->
		<ul class="my-list" id="my_list">
			<router-link to="myCenter/myBorrow" tag="li" class="my-list-item">
				<i class="icon iconfont f-blue">&#xe616;</i> 我的推荐
				<i class="icon iconfont fr f-grey">&#xe676;</i>
			</router-link>
			<router-link to="myCenter/myBorrow" tag="li" class="my-list-item">
				<i class="icon iconfont f-blue">&#xe616;</i> 我的推荐
				<i class="icon iconfont fr f-grey">&#xe676;</i>
			</router-link>
			<router-link to="myCenter/myBorrow" tag="li" class="my-list-item">
				<i class="icon iconfont f-blue">&#xe616;</i> 我的推荐
				<i class="icon iconfont fr f-grey">&#xe676;</i>
			</router-link>
		</ul>
		<transition name="router-slid">
            <router-view></router-view>
        </transition>
	</div>
</template>

<script>	
	import {slt, tost,forLoadHref,getPathPt,getOpenId} from '../../api/comom';
	import {runAsync} from '../../api/requst';
	export default{
		data(){
			return {
				realName: '',//显示姓名 
				wechatIcon : '',//微信头像  
				organizationName : '',//组织名称
				loanAmountStr : '',// 借款总额str（元） ,
				brokageAmountStr:'',//佣金总额str（元） ,
				bankNo:'',// 银行卡号 
				availableAmountNl:'',//当前可提现金额（元） ,
				brachBank:''//收款支行 ,
			}
		},
		created(){
			var pathData = getPathPt();
			var openId = pathData.openId||getOpenId();
			runAsync('/zs/usr/queryUserInfo/v2_0', {signature:1,openId:'oF9wRwg4afH3MWVEEtyzfQ3Qzfb0'})
			.then(res => {
				let resData = res.respData;
	           		console.log(res);
	           		//姓名
	           		this.realName = resData.realName;
	           		//头像
	           		this.wechatIcon = resData.wechatIcon;
	           		//组织名称
	           		this.organizationName = resData.organizationName;
	           		//借款总额str
	           		this.loanAmountStr = resData.loanAmountStr||'0.00';
	           		//佣金总额str
	           		this.brokageAmountStr = resData.brokageAmountStr||'0.00';
	       	});

		},
		methods:{
			
		}
	}
</script>

<style>
/*头部*/
header{
	background-color: #2E59FF;
	text-align: center;
	color: #fff;
	padding: 30px 0;
}
.my-header{
	margin-bottom: 20px;
}
.my-header span{
	display: inline-block;
	width: 130px;
	height: 130px;
	border-radius: 50%;	
	overflow: hidden;
}
.my-header span img{
	width: 100%;
}
.my-name{
	font-size: 1.06666rem;
}
.my-info{
	font-size: 0.93333rem;
	margin-top: 20px;
}
/*nav*/
nav{
	background-color: #fff;
	padding: 28px;
	text-align: center;
	display: flex;
	display: -webkit-flex;
	flex-flow: row;
	-webkit-flex-flow: row;
}
nav div{
	display: inline-block;
	flex: 1;
	-webkit-flex: 1;
	color: #A3A09D;
	font-size: 1rem;
}
nav div:first-child{
	border-right: thin solid #E6E6E6;
}
nav div p{
	font-size: 1.66667rem;
	color: #2E59FF;
}
nav div p small{
	font-size: 1.0666rem;
}
/*列表*/
.my-list{
	background-color: #fff;
	margin-top: 20px;
	border-top: thin solid #E6E6E6;
	border-bottom: thin solid #E6E6E6;
	padding-left: 20px;
}
.my-list .my-list-item{
	/*display: inline-block;*/
	padding: 24px 20px 24px 0;
	font-size: 1rem;
	border-bottom: thin solid #E6E6E6;
}
.my-list li:last-child{
	border-bottom:  0;
}
.my-list li i{
	pointer-events: none;
}
.router-slid-enter-active, .router-slid-leave-active {
    transition: all .4s;
}
.router-slid-enter, .router-slid-leave-active {
    transform: translateX(100%);
}
</style>