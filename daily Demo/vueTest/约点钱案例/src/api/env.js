/**
 * 配置编译环境和线上环境之间的切换
 * 
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 * 
 */
let baseUrl; 
let routerMode;
const imgBaseUrl = 'https://img.moneytocar.com/';

if (process.env.NODE_ENV == 'development') {
	baseUrl = 'http://192.168.1.104:18192/yuedianqian-wap';
	routerMode = 'hash'
}else{
	baseUrl = 'https://loan.moneytocar.com/yuedianqian-wap';
	routerMode = 'hash'
}

export {
	baseUrl,
	routerMode,
	imgBaseUrl
}