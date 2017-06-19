$(function() {
	$("#progressBar").css("width", "70%");
	var $section = $(".section"),
		height = innerHeight,
		pageNow = 1,
		pageAll = $section.length;
	$section.css("height", height + "px");
	$("body").css("margin", "0").css("padding", "0")
		.append("<div class='container' style='position:fixed;top:0;right:0;bottom:0;left:0;'><div class='page' style='transition:all ease 1s;'></div><div class='aside' style='position:fixed;top:50%;right:0;z-index:99;width:0px;'><ul style='margin:0;position:relative;'><li class='liPointer' style='position:absolute;color:#fff;font-size:35px;line-height:30px;top:0;cursor:pointer;transition:top ease 1s;'></li></ul></div></div>");
	var $page = $(".page"),
		$liPointer = $(".liPointer"),
		$aside = $(".aside");
	$page.append($section);
	$page.append($section.first().clone(true));
	for (var i = 0; i < $section.length; i++) {
		$(".aside ul").append("<li class='li' style='color:#fff;list-style-type:circle;font-size:35px;line-height:30px;cursor:pointer;' data-index='" + (i + 1) + "'>&nbsp;</li>");
	}
	$aside[0].style.marginTop = -$aside[0].offsetHeight / 2 + "px";
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
	var u = navigator.userAgent,
		isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
		touchClientY = 0,
		touchTime,
		refresh;
	$page[0].addEventListener("touchstart", function(event) {
		refresh = false;
		touchClientY = event.touches[0].clientY;
		touchTime = new Date();
		if (pageNow = 1 && !isiOS) {
			refresh = true;
		} else {
			event.preventDefault();
		}
	});
	$page[0].addEventListener("touchend", function(event) {
		var moveY = event.changedTouches[0].clientY - touchClientY;
		var touchEndTime = new Date();
		var moveTime = touchEndTime.getTime() - touchTime.getTime();
		if (moveY > 70 && moveTime < 700) {
			wheel.up();
			event.preventDefault();
		} else if (moveY < -70 && moveTime < 700) {
			wheel.down();
			if (!refresh) {
				event.preventDefault();
			}
		}
		touchClientY = 0;
		touchTime = null;

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
	$("#progressBar").css("width", "100%");
	$("#progressMask").fadeOut(200);
})