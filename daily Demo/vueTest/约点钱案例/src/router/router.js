import App from '../App'

const Index = r => require.ensure([], () => r(require('../page/index')), 'index');

const InfoUpload = r => require.ensure([], () => r(require('../page/infoUpload')), 'infoUpload');

const myCenter = r => require.ensure([], () => r(require('../page/myCenter/myCenter')), 'myCenter');

const myBorrow = r => require.ensure([], () => r(require('../page/myCenter/children/myBorrow')), 'myBorrow');

export default [{
  path: '/',
  component: App, //顶层路由，对应index.html
  children:[
  	//地址栏为空时默认跳转首页
    {
	  path: '/',
	  redirect: '/index'
    },
    //首页
    {
	  path: '/index',
	  component: Index
    },
    //申请贷款
  	{
	  path: '/infoUpload',
	  component: InfoUpload,   	
	},
	 //个人中心
	{
      path: '/myCenter',
      component: myCenter,
      children:[
      	{
	      path: 'myBorrow',
	      component: myBorrow
	    }
      ]
	}
  ]  	  
}]
