function carousel(j){
	var i = j.num||0;
	//内部变量
	var variable = {
		//计数器
		num : 0,
		//轮播频率
		times : j.times||3000,
		//轮播方向
		direction : j.direction||'right-left',
		//定时器
		stv : {},
		//上一张
		previousClass : '',
		//下一张
		nextClass : '',
		//每次轮播的回调
		onSlide : j.onSlide||function(){},
		//手指在屏幕中的移动的距离分别占slide宽高的百分比
		touchPlace:{
			x : '',
			y : '',
		},
		slideWith :  0,
		slideHeight : 0,
		slideLength : 0,
	}
	//内部常量
	var constant = {
		slide : document.getElementById('slide'),
		slideList : document.querySelector('#slide .slide-list'),
		liArr : document.querySelectorAll('#slide .slide-itme'),
		activeEL: document.querySelector('#slide .active'),
		upEL: document.querySelector('#slide .up'),
		downEL: document.querySelector('#slide .down'),
		leftEL: document.querySelector('#slide .left'),
		rightEL: document.querySelector('#slide .right'),
		spotbox: document.getElementById('slide_sopt'),
		soptArr : document.querySelectorAll('#slide_sopt .slide-spot-itme'),
	};
	//对外暴露的方法
	var obj = {
		run : function(){
			//先清除
			clearInterval(variable.stv);
			//再运行
			variable.stv = setInterval(run,variable.times);
		},
		stop : function(){
			//清除定时器
			clearInterval(variable.stv);
		},
	};
	
	//slideinit方法不暴露
	function slideinit(){
		//设置轮播方向
		switch (variable.direction){
			case 'right-left':
				setDirectionClass('left','right');
				break;
			case 'left-right':
				setDirectionClass('right','left');
				break;
			case 'up-down':
				setDirectionClass('down','up');
				break;
			case 'down-up':
				setDirectionClass('up','down');
				break;
			default:
				setDirectionClass('right','left');
				break;
		}
		function setDirectionClass(previousClass,nextClass){
			variable.previousClass = previousClass;
			variable.nextClass = nextClass;
		}
		//定时轮播
		variable.stv = setInterval(run,variable.times);	
		//设置占位内容,把盒子撑开,
		var seize = document.createElement(constant.liArr[0].nodeName); 
		seize.className = 'seize';
		seize.innerHTML = constant.liArr[0].innerHTML;
		constant.slideList.appendChild(seize);
		//轮播长度
		variable.slideLength = constant.liArr.length;
		//天机计数点
		var str = '';
		for (var a = 0; a < variable.slideLength; a++) {
			str += '<li class="slide-spot-itme"></li>';
		}
		constant.spotbox.innerHTML = str;
		constant.soptArr = document.querySelectorAll('#slide_sopt .slide-spot-itme');
		//初始化运行一遍
		run();
		//添加触屏操作
		swipe();
	}

	//定时轮播
	function run(n){
		i =  (n == 0 || n) ? n : (i >= variable.slideLength - 1 ? 0 : i + 1);
		variable.num = i;	
	}
	function back(n){
		i = n || (i < 0 ? variable.slideLength - 1 : 0);
		variable.num = i;
	}
	//监测index的变化,并驱动轮播运行
	watch(variable,'num',function(s){
		//每次变化调用onSlide并把值传出去
		variable.onSlide(s);
		//清除所有active previousClass = left||up,nextClass = right||down
		for(var len = 0;len < variable.slideLength; len++){
			var reg = /active|left|right|up|down/ig;
			constant.liArr[len].className = constant.liArr[len].className.replace(reg,'');
			constant.soptArr[len].classList.remove('active');
		}
		constant.soptArr[s].classList.add('active');
		//当前页
		constant.liArr[s].classList.add('active');
		//下一页
		constant.liArr[s].nextElementSibling.classList.contains('slide-itme') ? 
			constant.liArr[s].nextElementSibling.classList.add(variable.nextClass) : 
			constant.liArr[0].classList.add(variable.nextClass);
		//上一页
		constant.liArr[s].previousElementSibling ? 
			constant.liArr[s].previousElementSibling.classList.add(variable.previousClass) : 
			constant.liArr[variable.slideLength - 1].classList.add(variable.previousClass);
	});		
	//监听对象值的变化
	function watch(obj,key,fc){
		Object.defineProperty( obj, key, {
		  	set : function(newVal){
		  		fc(newVal);
		  	},
		});
	}
	//触屏逻辑
	function swipe(){
		var swipeVar = {
			startX : 0,
			startY : 0,
			endX : 0,
			endY : 0,
			moveX : 0,
			moveY : 0,
			xELArr: [],
			yELArr: []
		}  
		 //获取滑动开始时的坐标位置
	 	slide.addEventListener("touchstart",function(e){  
            swipeVar.startX = e.targetTouches[0].pageX;  
            swipeVar.startY = e.targetTouches[0].pageY;
            //删除动画类名
	 		setTransition('add');
            //清除定时器
            obj.stop();
            //阻止默认事件和事件冒泡
			e.stopPropagation();
			variable.slideHeight = document.getElementById('slide').offsetHeight;
			variable.slideWith = document.getElementById('slide').offsetWidth;
			//el重新赋值
			constant.slideList = document.querySelector('#slide .slide-list');
			constant.liArr = document.querySelectorAll('#slide .slide-itme');
			constant.activeEL= document.querySelector('#slide .active');
			constant.upEL= document.querySelector('#slide .up');
			constant.downEL= document.querySelector('#slide .down');
			constant.leftEL= document.querySelector('#slide .left');
			constant.rightEL= document.querySelector('#slide .right');
        });
        //阻止滑动中的事件冒泡
	 	slide.addEventListener("touchmove",function(e){
	 		swipeVar.moveX= e.changedTouches[0].pageX;
            swipeVar.moveY= e.changedTouches[0].pageY;
            //是否左右滑动,左滑为负数,右滑为正数
            if (/left/ig.test(variable.direction)) {
            	var x = swipeVar.moveX - swipeVar.startX >= 0 ? (swipeVar.moveX - swipeVar.startX)/variable.slideWith*100: - (Math.abs((swipeVar.moveX - swipeVar.startX))/variable.slideWith*100);
            	x = x > 100 ? 100 : (x < -100 ? -100 : x);
            	variable.touchPlace.x = x;
            	setPlace('x');
            } else{
            	var y = swipeVar.moveY - swipeVar.startY >= 0 ? (swipeVar.moveY - swipeVar.startY)/variable.slideHeight*100 : - (Math.abs((swipeVar.moveY - swipeVar.startY))/variable.slideHeight*100);
            	y = y > 100 ? 100 : (y < -100 ? -100 : y);
            	variable.touchPlace.y = y;
            	setPlace('y');
            }
    		e.stopPropagation();
	 	});
	 	//获取滑动结束时候的坐标
	 	slide.addEventListener("touchend",function(e){
	 		removeStyle();
	 		//删除动画类名
	 		setTransition('remove');
            swipeVar.endX= e.changedTouches[0].pageX;
            swipeVar.endY= e.changedTouches[0].pageY;
            //取X轴与Y轴的绝对值,哪个值大就是在哪个轴移动
            if(Math.abs(swipeVar.endX-swipeVar.startX) > Math.abs(swipeVar.endY-swipeVar.startY) ){
            	if (/left/ig.test(variable.direction)) {
	    			//结束的值大于开始的值(右移动),并且绝对值大于30,  左右轮播
		        	if (swipeVar.endX - swipeVar.startX > 0 && Math.abs(swipeVar.endX - swipeVar.startX) > 50) {
		        		if(variable.direction== 'left-right'){
		        			//下一张
		        			i = i >= variable.slideLength - 1 ? 0 : i + 1;
		        			run(i);	
		        		}else{
		        			//上一张
		        			i = i < 1 ? variable.slideLength -1 : i - 1;
		        			back(i);
		        		}
		            } 
		            //结束的值小于开始的值(左移动),并且绝对值大于30,
		            if(swipeVar.endX - swipeVar.startX < 0 && Math.abs(swipeVar.endX - swipeVar.startX) > 50){
		            	if(variable.direction== 'left-right'){
		            		//上一张
		            		i = i < 1 ? variable.slideLength -1 : i - 1;
		            		back(i);
		        		}else{
		        			//下一张
		        			i = i >= variable.slideLength - 1 ? 0 : i + 1;
		        			run(i);	
		        		}
		            } 
	            }
            }else{
            	if (/up/ig.test(variable.direction)) {
	            	//上下轮播
		            if(swipeVar.endY - swipeVar.startY > 0 && Math.abs(swipeVar.endY - swipeVar.startY) > 50){
		            	if(variable.direction== 'up-down'){
							i = i >= variable.slideLength - 1 ? 0 : i + 1;
							//下一张
							run(i);	
		        		}else{
		            		i = i < 1 ? variable.slideLength -1 : i - 1;
							back(i);
		        		}
		            	
		            }
		            if(swipeVar.endY - swipeVar.startY < 0 && Math.abs(swipeVar.endY - swipeVar.startY) > 50){
	      				if(variable.direction== 'up-down'){
		            		i = i < 1 ? variable.slideLength -1 : i - 1;
							back(i);
		        		}else{
		        			i = i >= variable.slideLength - 1 ? 0 : i + 1;
		        			//下一张
		        			run(i);	
		        		}
		            } 
	            }
            }
    		//运行自动轮播
			obj.run();
            
        });
        //清除位移style
        function removeStyle(){
        	for(var len = 0;len < variable.slideLength; len++){
				var reg = /active|left|right|up|down/ig;
				constant.liArr[len].setAttribute('style','');
			}
        }
       /*	设置位移对象的数组
			swipeVar.xELArr = [constant.activeEL,constant.downEL,constant.upEL];
			swipeVar.yELArr = [constant.activeEL,constant.leftEL,constant.rightEL];
        * */
        function setPlace(s){
        	if (s != 'x') {
        		setTop(constant.activeEL,0,variable.touchPlace.y);
        		setTop(constant.upEL,-100,variable.touchPlace.y);
        		setTop(constant.downEL,100,variable.touchPlace.y);
        	} else{
        		setLeft(constant.activeEL,0,variable.touchPlace.x);
        		setLeft(constant.leftEL,-100,variable.touchPlace.x);
        		setLeft(constant.rightEL,100,variable.touchPlace.x);
        	}
        }
        function setTop(obj,initVal,varVal){
        	obj.style.top = initVal + varVal + '%';
        }
        function setLeft(obj,initVal,varVal){
        	obj.style.left = initVal + varVal + '%';
        }
        //过渡动画控制
        function setTransition(s){
            s =='add' ? constant.slide.classList.add('touch') : constant.slide.classList.remove('touch');
        }
	}
	//初始化轮播
	slideinit();
	//对外暴露的两个方法
	return obj;
}