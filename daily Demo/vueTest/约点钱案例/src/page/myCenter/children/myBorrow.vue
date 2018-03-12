<template>
	<div class="my-borrow">
		<ul id="my_borrow">
			<li v-for="(item,index) in respData" @click='nextpage(item)' :key="index" class="my-borrow-li" :class="{mark:item.loanStatus == 1}">
				<div class="content">
					<p class="f-14">{{item.createDateStr}}</p>
					<p class="f-15">{{item.name}}<span class="fr">{{item.cellphone}}</span></p>
					<p class="f-15">意向贷款金额(元)<span class="fr">{{item.loanPriceStr}}</span></p>
					<p class="f-15">意向贷款期限(期)<span class="fr">{{item.loanLimit}}</span></p>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
	import {slt, tost,forLoadHref,getPathPt,getOpenId} from '../../../api/comom';
	import {runAsync} from '../../../api/requst';
	export default{
		data(){
			return {
				respData:[]
			}
		},
		created(){
			var pathData = getPathPt();
			var openId = pathData.openId||getOpenId();
			runAsync('/zs/customer/queryMyCustomerList/V2_0', {signature:1,openId:'oF9wRwg4afH3MWVEEtyzfQ3Qzfb0'})
			.then(res => {
				if((res.respCode == 1)&&(res.respData.length>0)){
					this.respData = res.respData;
					
				}
	           		
	       	});

		},
		methods:{
			nextpage(item){
				console.log(item.cellphone);
			}
		}
	}
	
	
</script>

<style>
.my-borrow{
	position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #fff;
    z-index: 202;
}
.my-borrow-li{
	position: relative;
	background-color: #fff;
	padding: 0 30px;	
	margin-top: 20px;
}
.my-borrow-li:first-child{
	margin-top: 0;
}
.my-borrow-li div{
	pointer-events: none;
}
.my-borrow-li .content{
	width: 100%;
	background-color: rgba(0,0,0,0);
	z-index: -1;
}
.my-borrow-li .f-14{
	padding: 11px 0;
}
.my-borrow-li .f-15{
	padding: 24px 0;
}
.my-borrow-li .f-15 .fr{
	color: #66605C;
}
.my-borrow-li.mark .content{
	background: url(../../../img/2.0/4.png) no-repeat top right;
	background-size: 160px 160px;
}
/*缺省*/
.default-msg .default-box p{
	margin-top: 60px;	
}
.default-msg .default-box .f-blue{
	display: inline-block;
	padding: 0 20px;
}
.default-msg .default-box .f-blue i{
	font-size: 0.966667rem;
}

</style>