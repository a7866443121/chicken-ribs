/*******
	by Xulian
*******/
/**
	*** 图片预览 ***
	此插件依赖bootstrap	
	需要预览的图片 添加class：preview
	
<div class="modal fade text-center viewPictureModel" id="imgPreviewModal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" >
  <div class="modal-dialog">
	<div class="modal-content">
		<div class="layer"></div>
		<div id="carousel-example-generic2" class="carousel slide" data-interval="false" data-ride="carousel">
			<div class="carousel-inner">
				<div class="item active">
					<img src="../img/pictureView/head1.jpg" />
				</div>
				<div class="item">
					<img src="../img/pictureView/head2.jpg" />
				</div>
				<div class="item">
					<img src="../img/pictureView/head3.jpg" />
				</div>
			</div>
		
			<a class="left carousel-control" href="#carousel-example-generic2" data-slide="prev">
				<span class="glyphicon glyphicon-chevron-left"></span>
			</a>
			<a class="right carousel-control" href="#carousel-example-generic2" data-slide="next">
				<span class="glyphicon glyphicon-chevron-right"></span>
			</a>
			
			放大预览
			<ul class="previewBtns">
			  <li><div><i class="glyphicon glyphicon-zoom-in"></i></div></li>
			  <li><div><i class="glyphicon glyphicon-zoom-out"></i></div></li>
			  <li><div><i class="glyphicon glyphicon-repeat"></i></div></li>
			<ul>
		</div>
	</div>
  </div>
</div>
	
**/ 
	$(".preview.previewDetail").each(function(){
		$(this).attr("data-width",$(this)[0].naturalWidth);
		$(this).attr("data-height",$(this)[0].naturalHeight);
	});

var	$carousellInner,
	$items,
	$modal,
	previewType = 0, //0：普通预览   1：放大旋转等
	winWidth = $(window).width()-40,
	winHeight = $(window).height()-40,
	imgWidth = 0,
	imgHeight = 0,
	scale;
function showBigImgList(imgList) {
	writeImgModal();
	$modal = $("#imgPreviewModal");
	$carousellInner = $modal.find(".carousel-inner");
	$items = $("#imgPreviewModal .item");
	$items.remove();
	for(var i=0;i<imgList.length;i++) {
		var status ="";
		if(imgList[i].active) {status = "active";}
		$carousellInner.append("<div class=\"item "+status+"\"><img src=\""+imgList[i].src+"\" /></div>");
	}
	/*$("#imgPreviewModal .item:not(.active)").remove();
	$("#imgPreviewModal .item.active img").attr("src",imgSrc);*/
	
	$("#imgPreviewModal .item>img").click(function() {
		$('#imgPreviewModal').remove();
		$('.modal-backdrop').remove();
	});
	$modal.modal('show');	
}

function showBigImg(obj) {
	writeImgModal();
	$modal = $("#imgPreviewModal");
	$carousellInner = $modal.find(".carousel");
	$("#imgPreviewModal .item.active img").attr("src",obj.attr("src"));
	
	resizeCarousel();
	$(".previewBtns div.rotate").click(rotateImg);
	$(".previewBtns div.smaller").click(smallerImg);
	$(".previewBtns div.bigger").click(biggerImg);
	
	$modal.modal('show');
}

function writeImgModal() {
	rotateState=0;
	if(previewType==0) {
		$("body").append("<div class=\"modal fade text-center viewPictureModel\" id=\"imgPreviewModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myLargeModalLabel\" ><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"layer\"></div><div id=\"carousel-example-generic2\" class=\"carousel slide\" data-interval=\"false\" data-ride=\"carousel\"><div class=\"carousel-inner\"><div class=\"item active\">                            <img src=\"\" /></div><div class=\"item\"><img src=\"\" /></div><div class=\"item\"><img src=\"\" /></div></div><a class=\"left carousel-control\" href=\"#carousel-example-generic2\" data-slide=\"prev\"><span class=\"glyphicon glyphicon-chevron-left\"></span></a><a class=\"right carousel-control\" href=\"#carousel-example-generic2\" data-slide=\"next\"><span class=\"glyphicon glyphicon-chevron-right\"></span></a></div></div></div></div>");
	}else if(previewType==1) {
		$("body").append("<div class=\'modal fade text-center viewPictureModel detail\'id=\'imgPreviewModal\'tabindex=\'-1\'role=\'dialog\'aria-labelledby=\'myLargeModalLabel\'><div class=\'modal-dialog\'><div class=\'modal-content\'><div class=\'layer\'></div><div id=\'carousel-example-generic2\'class=\'carousel slide\'data-interval=\'false\'data-ride=\'carousel\'><div class=\'carousel-inner\'><div class=\'item active\'><img src=\'../img/pictureView/head1.jpg\'/></div></div></div></div></div><ul class=\'previewBtns\'><li><div class='bigger'><i class=\'glyphicon glyphicon-zoom-in\'></i></div></li><li><div class='smaller'><i class=\'glyphicon glyphicon-zoom-out\'></i></div></li><li><div class='rotate'><i class=\'glyphicon glyphicon-repeat\'></i></div></li><ul></div>")
	}
	
	$("#imgPreviewModal .layer, #imgPreviewModal .item>img").click(function() {
		$('#imgPreviewModal').remove();
		$('.modal-backdrop').remove();
	});
}

function bindPictureListView(obj) {
	if(obj.hasClass("previewDetail")) {
		previewType = 1;
		imgWidth = obj.attr("data-width"),
		imgHeight = obj.attr("data-height");
		scale = parseInt(imgWidth)/parseInt(imgHeight); //scale>1 则是宽图，反之长图
		showBigImg(obj);
	}
	else {
		previewType = 0;
		
		var $activeOjb = obj,
			imgList = $activeOjb.closest(".previewGroup").find("img.preview"),
			jsonImg = [];
				   
		$(imgList).each(function(index, element) {        
			jsonImg[index] = {"src": $(this).attr("src"), "active": false};
			if(index==$(imgList).index($activeOjb))
				jsonImg[index].active = true;
			//console.log("jsonImg["+index+"]: "+jsonImg[index].active);
		});
		showBigImgList(jsonImg);
	}
	
}
var isBigger = false;
function biggerImg() {
	if(!$(".previewBtns div.bigger").hasClass("disable")) {
		var newWid,newHei;
		if($carousellInner.hasClass("ro1")||$carousellInner.hasClass("ro3")) {
			if(winWidth>imgHeight) {
				newWid=imgHeight*scale;
				newHei=imgHeight;
				$carousellInner.css("margin-left","-"+((imgHeight*scale-newHei)/2-40)+"px");
			}else {
				//console.log("habuubububub")
				newWid=winWidth*scale;
				newHei=winWidth;
				$carousellInner.css("margin-left","-"+((winWidth*scale-newHei)/2-20)+"px");
			}
			
		}else {
			if(winWidth>imgWidth) {
				newWid=imgWidth;
				newHei=imgWidth/scale;
			}else {
				newWid=winWidth;
				newHei=winWidth/scale;
			}
			$carousellInner.css("margin-left","auto")
		}
		setCarousel(newWid,newHei);
		$(".previewBtns div.smaller").removeClass("disable");
		$(".previewBtns div.bigger").addClass("disable");
		isBigger = true;
	}
}
function smallerImg() {
	if(!$(".previewBtns div.smaller").hasClass("disable")) {
		$carousellInner.css("margin-left",0);
		setCarousel($carousellInner.attr("preWidth"),$carousellInner.attr("preHeight"));
		$(".previewBtns div.bigger").removeClass("disable");
		$(".previewBtns div.smaller").addClass("disable");
		isBigger = false;
	}
}
var rotateState=0;
function rotateImg() {
	if(isBigger) smallerImg();
	//console.log("rotate")
	switch(rotateState) {
		case 0:
		case 2:
			rotateState++;
			if(scale>1) {
				setCarousel(initHeight,initHeight/scale);
				$(".previewBtns div.bigger").removeClass("disable");
			}else
				setCarousel(initHeight,initHeight/scale);
			break;
		case 1:
			rotateState++;
			setCarousel(initWidth,initHeight);
			break;
		case 3:
			setCarousel(initWidth,initHeight);
		default:
			rotateState=0;
			break;
	}
	$carousellInner.removeClass("ro0 ro1 ro2 ro3").addClass("ro"+rotateState);
	resetImgBtns();
	//resizeCarousel();
}
var initWidth,initHeight;
function resizeCarousel() {
	//	winWidth   winHeight   imgWidth  imgHeight  scale
	// console.log(winWidth +"  "+  winHeight +"  "+  imgWidth +"  "+ imgHeight +"  "+ scale)
	if(winHeight > imgHeight&&winWidth > imgWidth) {
			initHeight = imgHeight;
			initWidth = imgWidth;
	}else if(winWidth < imgWidth||winHeight < imgHeight) {
		if(winWidth < imgWidth && winHeight < imgHeight) {
			if(winWidth/winHeight > scale) {
				if(scale>1) {
					initHeight = winHeight;
					initWidth = initHeight*scale;
				}else {
					initHeight = winHeight;
					initWidth = initHeight*scale;
				}
			}else {
				if(scale>1) {
					initWidth = winWidth;
					initHeight = initWidth/scale;
				}else {
					initHeight = winHeight;
					initWidth = initHeight*scale;
				}
			}
		}else {
			if(scale>1) {
				initWidth = winHeight < imgHeight? winHeight*scale : winWidth ;
				initHeight = initWidth/scale;
			}else {
				initHeight = winWidth < imgWidth? winWidth*scale : winHeight;
				initWidth = initHeight*scale;
			}
		}
	}
	setCarousel(initWidth,initHeight);
	resetImgBtns();
}
function resetImgBtns() {
	$(".viewPictureModel .bigger, .viewPictureModel .smaller").addClass("disable");
	if(imgWidth>initWidth && winWidth>initWidth) $(".viewPictureModel .bigger").removeClass("disable");
	if($carousellInner.hasClass("ro1")||$carousellInner.hasClass("ro3")) {
		if(winWidth>$carousellInner.height()&&imgHeight>$carousellInner.height()) {
			$(".viewPictureModel .bigger").removeClass("disable");
		}
	}
}
function setCarousel(w,h) {
	$carousellInner.attr("preWidth",$carousellInner.width());
	$carousellInner.attr("preHeight",$carousellInner.height());
	$carousellInner.width(w);
	$carousellInner.height(h);
}

// $(document).on("click",".imgbox > a.del",function(){
// 	$(this).closest(".imgbox").fadeOut();
// });