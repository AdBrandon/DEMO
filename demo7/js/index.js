//网页wheel
$(function() {
	$("#progressBar").css("width", "70%");
	var $section = $(".section"),
		height = innerHeight,
		pageNow = 1,
		pageAll = $section.length;
	$section.css("height", height + "px");
	$("body").css("margin", "0").css("padding", "0")
		.append("<div class='container'><div class='page'></div>");
	var $page = $(".page"),
		$liPointer = $(".liPointer"),
		$aside = $(".aside");
	$nav = $(".asideNav");
	$page.append($section);
	$page.append($section.first().clone(true));
	$("container").append(".aside");
	$nav[0].style.marginTop = -$nav[0].offsetHeight / 2 + "px";
	$(".asideOpen")[0].style.marginTop = -$nav[0].offsetHeight / 2 - 50 + "px";
	var wheel = {
		scrolling: false,
		down: function() {
			pageNow += 1;
			wheel.move(pageNow);
		},
		up: function() {
			if ((pageNow - 1) > 0) {
				pageNow -= 1;
				wheel.move(pageNow);
			}
		},
		move: function(pageNow, fromResize) {
			wheel.scrolling = true;
			var step = -(pageNow - 1) * height + "px";
			if (fromResize) {
				$page.css("transition-duration", "0s");
				$liPointer.css("transition-duration", "0s");
				$page.css("transform", "translateY(" + step + ")");
				$liPointer.css("top", (pageNow - 1) * 30 + "px");
				wheel.scrolling = false;
			} else {
				$page.css("transition-duration", "1s");
				$liPointer.css("transition-duration", "1s");
				$page.css("transform", "translateY(" + step + ")");
				if (pageNow > pageAll) {
					$liPointer.css("top", "0px");
				} else {
					$liPointer.css("top", (pageNow - 1) * 30 + "px");
				}
			}
		},
		moveEnd: function() {
			if (pageNow > pageAll) {
				$page.css("transition-duration", "0s");
				$page.css("transform", "translateY(0px)");
				pageNow = 1;
			}
			wheel.scrolling = false;
		}

	};
	//鼠标滚轮事件
	var mousewheelEvent = function(event) {
		if (wheel.scrolling) return false;
		var delta = event.wheelDelta || -event.detail;
		if (delta > 0) {
			wheel.up()
		} else if (delta < 0) {
			wheel.down()
		}
	};
	//键盘事件
	var keyboardEvent = function(event) {
		var key = event.keyCode;
		switch (key) {
			case 37:
				wheel.up();
				break;
			case 38:
				wheel.up();
				break;
			case 39:
				wheel.down();
				break;
			case 40:
				wheel.down();
				break;
		}
	};
	//手机端触摸事件
	var touchClientY = 0,
		touchTime;
	$page[0].addEventListener("touchstart", function(event) {
		touchClientY = event.touches[0].clientY;
		touchTime = new Date();
		event.preventDefault();
	});
	$page[0].addEventListener("touchend", function(event) {
		var moveY = event.changedTouches[0].clientY - touchClientY;
		var touchEndTime = new Date();
		var moveTime = touchEndTime.getTime() - touchTime.getTime();
		if (moveY > 70 && moveTime < 700) {
			wheel.up();

		} else if (moveY < -70 && moveTime < 700) {
			wheel.down();
		}
		touchClientY = 0;
		touchTime = null;
		event.preventDefault();

	});
	//窗口改变大小事件（自适应）
	var resizeEvent = function() {
		var width = window.innerWidth;
		if (width < 500) {
			$aside[0].style.display = "none";
		} else {
			$aside[0].style.display = "block";
		};
		if (height != innerHeight) {
			height = innerHeight;
			$(".section").css("height", height + "px")
			wheel.move(pageNow, true);
		}
	};
	//检测是否为火狐浏览器
	function isFirefox() {
		var userAgent = navigator.userAgent;
		if (userAgent.indexOf("Firefox") > -1) {
			return true;
		} else {
			return false;
		}
	};
	$(window).keydown(keyboardEvent);
	$("li").click(function() {
		pageNow = parseInt(this.getAttribute("data-index"));
		wheel.move(pageNow);
	})
	$page[0].addEventListener("webkitTransitionEnd", wheel.moveEnd);
	window.addEventListener("resize", resizeEvent);
	if (isFirefox()) {
		document.addEventListener("DOMMouseScroll", mousewheelEvent);
	} else {
		document.addEventListener("mousewheel", mousewheelEvent);
	};
	//aside固定
	var $open = $(".asideOpen");
	var asideOpen = {
		transitting: false,
		transit: function() {
			if (asideOpen.transitting) {
				return false
			}
			asideOpen.transitting = true;
			$open.css("transition", "all ease 0.5s")
			asideOpen.changeStyle();
		},
		changeStyle:function(){
			if ($open.html() == "☆") {
				$open.css("transform", "rotate(360deg)");
				$open.html("★");
				$aside.addClass("asideFixed")
				$(".aside ul,.asideOpen").addClass("asideColorFixed")
				$(".asideTitle").addClass("asideTitleFixed")
			} else {
				$open.css("transform", "rotate(0deg)");
				$open.html("☆") 
				$aside.removeClass("asideFixed")
				$(".aside ul,.asideOpen").removeClass("asideColorFixed")
				$(".asideTitle").removeClass("asideTitleFixed")
				
			}
		},
		transitEnd: function() {
			asideOpen.transitting = false;
		}
	}

	$open.click(function() {
		asideOpen.transit()
	})
	$open[0].addEventListener("webkitTransitionEnd", asideOpen.transitEnd);



	$("#progressBar").css("width", "100%");
	$("#progressMask").fadeOut(200);
})

//全屏
$(function() {
	var isFullScreen = false;
	//全屏  
	function fullScreen() {
		isFullScreen = true;
		var element = document.documentElement;
		if (window.ActiveXObject) {
			var WsShell = new ActiveXObject('WScript.Shell')
			WsShell.SendKeys('{F11}');
		} else if (element.requestFullScreen) {
			element.requestFullScreen();
		} else if (element.msRequestFullscreen) {
			element.msRequestFullscreen();
		} else if (element.webkitRequestFullScreen) {
			element.webkitRequestFullScreen();
		} else if (element.mozRequestFullScreen) {
			element.mozRequestFullScreen();
		}
	};
	//退出全屏  
	function fullExit() {
		isFullScreen = false;
		var element = document.documentElement;
		if (window.ActiveXObject) {
			var WsShell = new ActiveXObject('WScript.Shell')
			WsShell.SendKeys('{F11}');
		} else if (element.requestFullScreen) {
			document.exitFullscreen();
		} else if (element.msRequestFullscreen) {
			document.msExitFullscreen();
		} else if (element.webkitRequestFullScreen) {
			document.webkitCancelFullScreen();
		} else if (element.mozRequestFullScreen) {
			document.mozCancelFullScreen();
		}
	};
	$(".fullScreen p").click(function() {
		if (isFullScreen) {
			fullExit();
			$(this).html("<span>☒</span>全屏浏览");
		} else {
			fullScreen();
			$(this).html("<span>×</span>退出全屏");
		}
	});

})