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
	// function touchStartEvent(event) {
	// 	event.preventDefault();
	// 	var pageY = event.targetTouches[0].pageY;
	// 	$page[0].addEventListener("touchmove", function(event) {
	// 		$(".test").html($(".test").html() + "move:[touches:pageY] = " + event.touches[0].pageY + "<br>");

	// 	});
	// 	$page[0].addEventListener("touchend", function(event) {
	// 		$(".test").html($(".test").html() + "end:[touches:pageY] = " + event.touches[0].pageY + "<br>");
	// 		$(".test").html($(".test").html() + "start=pageY = " + pageY + "<br>");
	// 		$page[0].ontouchend = null;
	// 	});
	// 	$page[0].addEventListener("mouseup", function(event) {
	// 		$(".test").html($(".test").html() + "mouseup:[touches:pageY] = " + event.clientY + "<br>");
	// 		$(".test").html($(".test").html() + "start=pageY = " + pageY + "<br>");
	// 		$page[0].ontouchend = null;
	// 	});
	// }
	var touchClientY = 0,
		touchTime;
	$page[0].addEventListener("touchstart", function(event) {
		touchClientY = event.touches[0].clientY;
		touchTime = new Date();
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

	// 	$(".test").html($(".test").html()+"[B]start:[clientY] = " + event.targetTouches[0].clientY + "<br>");
	// 	$(".test").html($(".test").html()+"start:[targetTouches:pageY] = " + event.targetTouches[0].pageY + "<br>");
	// 	// event.preventDefault();
	// 	event.preventDefault();

	// }
	// function touchMoveEvent(event){
	// 	$(".test").html($(".test").html()+"[B]move:[targetTouches:clientY] = " + event.targetTouches[0].clientY + "<br>");
	// 	$(".test").html($(".test").html()+"move:[touches:pageY] = " + event.touches[0].pageY + "<br>");
	// 	// event.preventDefault();
	// }

	// function touchEndEvent(event){
	// 	$(".test").html($(".test").html()+"[B]end:[clientY] = " + event.targetTouches[0].clientY + "<br>");
	// 	$(".test").html($(".test").html()+"end:[changedTouches:pageY] = " + event.changedTouches[0].pageY + "<br>");
	// 	// event.preventDefault();
	// }
	// function touchCancelEvent(event){
	// 	$(".test").html($(".test").html()+"[B]Cancel:[clientY] = " + event.targetTouches[0].clientY + "<br>");
	// 	$(".test").html($(".test").html()+"Cancel:[changedTouches:pageY] = " + event.changedTouches[0].pageY + "<br>");
	// 	// event.preventDefault();
	// }



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
	// $page[0].addEventListener("touchstart", touchStartEvent);
	// $page[0].addEventListener("touchmove", touchMoveEvent);
	// $page[0].addEventListener("touchend", touchEndEvent);
	// $page[0].addEventListener("touchcancel", touchCancelEvent);

	$("#progressBar").css("width", "100%");
	$("#progressMask").fadeOut(200);
})