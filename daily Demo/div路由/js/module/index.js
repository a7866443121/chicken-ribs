$(function() {
	$("#leftMenu").on("click", "dt", function() {
		$("#leftMenu dd").stop();
		$(this).parent("dl").toggleClass("active");
		$(this).parent("dl").find("dd").slideToggle();
		$(this).parent("dl").siblings().removeClass("active");
		$(this).parent("dl").siblings().find("dd").slideUp();
	});
	/*$("#leftMenu").on("click", "dd a", function() {
		$("#leftMenu").find("dd .active").removeClass("active");
		$(this).addClass("active");
	});*/
	
	/*
	 * 右侧局部刷新
	 */
	$('#leftMenu').on("click", ".href-btn", function() {
		if($(this).hasClass("active")){
			return false;
		}
		$("#leftMenu").find(".active").removeClass("active");
		$(this).addClass("active");
		var href = $(this).attr('_href'),
			mainContent = $("#mainContent");
		if ($(this).attr('data-src')) {
			mainContent.empty();
			mainContent.hide();
			$('#iframe_box').show();
			$('#iframe_box').find('iframe').attr('src',$(this).attr('data-src'))
		} else{
			if($(this).attr('_href')) {
				mainContent.show();
				$.ajax({
					url: href,
					success: function(result) {
						mainContent.empty();
						mainContent.append(result);
					}
				});
			}	
		}
	})

	/*
	 * 内容容器最小高度限制
	 */
	function minHeigth() {
		var screenHeight = $(window).height();
		var headerHeight = $("#header").height();
		var spacing = 0;
		var computedHeight = screenHeight - headerHeight - spacing;
		$("#mainContent").css("min-height", computedHeight);
	}
	minHeigth();
	
});