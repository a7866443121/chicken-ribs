<template>
	<div class="index">
		<img src="../img/yuedianqian.png" width="100%" height="100%" style="margin-bottom: 160px;" />
		<a class="tel" href="tel:400-901-9688"></a>
		<router-link to="infoUpload"  class="btn">立即申请</router-link>
	</div>
</template>

<script>
	;(function(){
	})();
</script>

<style>
	html,
	body {
		padding: 0;
		margin: 0;
		overflow-x: hidden;
		background: #FFFFFF;
	}
	.index{
		position: relative;
	}			
	.btn {
		position: fixed;
		background: #2E59FF;
		box-shadow: 0 4px 16px 0 rgba(46, 89, 255, 0.40);
		border-radius: 6px;
		color: #fff;
		text-align: center;
		width: 92%;
		height: 88px;
		line-height: 88px;
		margin: 40px 30px;
		bottom: 0;
		display: block;
		font-size: 1rem;
	}
	a{
		text-decoration: none;
	}
	.body{
		position: relative;
	}
	.tel{
		display: inline-block;
		width: 100%;
		height: 88px;
		position: absolute;
		bottom: 160px;
	}
</style>