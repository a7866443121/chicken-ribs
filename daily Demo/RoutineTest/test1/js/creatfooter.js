window.onload=function(){
	var bod = document.getElementsByTagName("body");
	var wid = window.innerWidth;
	if(wid>1024){
		bod.width=1024+"px";
	}else if(wid<280){
		bodwidth=280+"px";
	}else{
		bod.width=wid+"px";
	}
	//创建div容器,添加类名
	var div = document.createElement("div");
	div.setAttribute("class", "footer"); 
	document.body.appendChild(div);
	//创建ul添加到div
	var ul = document.createElement("ul");
	ul.setAttribute("class", "icon_lists  clear");
	div.appendChild(ul);
	//创建五个li
	for (var j = 0;j<5;j++) {
		var li = document.createElement("li");
		ul.appendChild(li);
		var a= document.createElement("a");
		var i= document.createElement("i");
		i.setAttribute("class", "icon iconfont myicon");
		var div1= document.createElement("div");
		//switch匹配添加每一个li的元素
		switch (j){
			case 0:
			create("href","index.html","&#xe602;","主页");
				break;
			case 1:
			create("href","weidian.html","&#xe600;","优选");
				break;
			case 2:
			create("href","classInfo.html","&#xe604;","分类");
				break;
			case 3:
			create("href","wd_manage.html","&#xe603;","微店");
				break;
			case 4:
			create("href","grzx.html","&#xe601;","我的");
				break;
			default:
				break;						
		}				
	}		
	//封装一个复用高的函数
	function create(href,html,coding,inne){
			a.setAttribute(href,html);
			i.innerHTML=coding;
			div1.innerHTML=inne;
			ul.appendChild(li);
			li.appendChild(a);
			a.appendChild(i);
			a.appendChild(div1);
	}
}