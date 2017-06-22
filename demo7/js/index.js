//网页wheel
$(function() {
	$("#progressBar").css("width", "70%");
	var $section = $(".section"),
		height = window.innerHeight,
		pageNow = 1,
		pageAll = $section.length;
	$section.css("height", height + "px");
	$("body").css("margin", "0").css("padding", "0")
		.append("<div class='container'><div class='page'></div>");
	var $page = $(".page"),
		$liPointer = $(".liPointer"),
		$aside = $(".aside");
	$nav = $(".asideNav");
	$page.append($section)
		.append($section.find(".fullScreen"))
		.append($section.first().clone(true));
	$("container").append(".aside");
	$nav[0].style.marginTop = -$nav[0].offsetHeight / 2 + "px";
	$(".asideOpen")[0].style.marginTop = -$nav[0].offsetHeight / 2 - 50 + "px";
	$(".music")[0].style.top = $nav[0].offsetHeight / 2 + height / 2+ 50 +"px";

	var wheel = {
		scrolling: false,
		backCalling:false,
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
			wheel.backCalling = true,
			wheel.scrolling = true;
			var step = -(pageNow - 1) * height + "px";
			if (fromResize) {
				$page.css("transition-duration", "0s").css("transform", "translateY(" + step + ")");
				$liPointer.css("transition-duration", "0s").css("top", (pageNow - 1) * 30 + "px");
				wheel.scrolling = false;
			} else {
				$liPointer.css("transition-duration", "1s");
				$page.css("transition-duration", "1s").css("transform", "translateY(" + step + ")");
				if (pageNow > pageAll) {
					$liPointer.css("top", "0px");
				} else {
					$liPointer.css("top", (pageNow - 1) * 30 + "px");
				}
			}
		},
		moveEnd: function() {
			if (pageNow > pageAll) {
				$page.css("transition-duration", "0s").css("transform", "translateY(0px)");
				pageNow = 1;
			}
			wheel.scrolling = false;
			wheel.backCall();
		},
		backCall:function(){
			if (wheel.backCalling) {
				wheel.backCalling = false;
				switch(pageNow){
					case 1:
						backCallFn.section1();
						break;
					case 2:
						backCallFn.section2();
						break;
					case 3:
						backCallFn.section3();
						break;
					case 4:
						backCallFn.section4();
						break;
					case 5:
						backCallFn.section5();
						break;
				}
			}
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
			case 32:
				music.click();
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
		$(".music")[0].style.top = $nav[0].offsetHeight / 2 + window.innerHeight / 2+ 50 +"px";
		if (height != window.innerHeight) {
			height = window.innerHeight;
			$(".section").css("height", height + "px")
			wheel.move(pageNow, true);
		}
		resizeIndex()
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
		changeStyle: function() {
			if ($open.html() == "☆") {
				$open.css("transform", "rotate(360deg)").html("★");
				$aside.addClass("asideFixed")
				$(".aside ul,.asideOpen").addClass("asideColorFixed")
				$(".asideTitle").addClass("asideTitleFixed")
				$(".music").addClass("asideMusicCenter")
				
			} else {
				$open.css("transform", "rotate(0deg)").html("☆")
				$aside.removeClass("asideFixed")
				$(".aside ul,.asideOpen").removeClass("asideColorFixed")
				$(".asideTitle").removeClass("asideTitleFixed")
				$(".music").removeClass("asideMusicCenter")

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
	$(".fullScreen p").click(function(event) {
		if (isFullScreen) {
			fullExit();
			$(this).html("<span>☒</span>全屏浏览");
		} else {
			fullScreen();
			$(this).html("<span>×</span>退出全屏");
		}
	});
	//重置index窗口位置
	function resizeIndex() {
		$(".sectionALine").css("right", "15%").css("top", "10%");
	}
	//首页
	var $sectionABox = $(".sectionABox");
	var $sectionALine = $(".sectionALine");
	if (window.innerWidth < 950) {
		$(".sectionAText").html("<p>我会住在其中的一颗星星上面，</p><p>在某一颗星星上微笑着，</p><p>每当夜晚你仰望星空的时候，</p><p>就会像是看到所有的星星都在微笑一般。</p><p>I will live in one of the stars, </p><p>in a star on a smile, </p><p>every time you look at the sky at night time, </p><p>would like to see all the stars are smiling general.</p>")
	}
	$sectionALine.animate({top: "10%"}, 500, function() {
		$sectionALine.children().animate({"right": "0"}, 1000, function() {
			$(".sectionAText").addClass("sectionATextBackground");
		})
		$(".sectionATitle").animate({"margin-right": "0"}, 800)
	});
	//首页抖动
	$sectionABox.mousemove(function(event) {
		var width = window.innerWidth,
			height = window.innerHeight,
			boxValueX = -(event.pageX - width / 2) * 10 / width - 0.02 * width,
			boxValueY = -(event.pageY - height / 2) * 10 / height - 0.02 * height;
		$sectionABox.css("left", boxValueX + "px")
			.css("top", boxValueY + "px");
		var lineValueX = -(event.pageX - width / 2) * 20 / width + 0.15 * width,
			lineValueY = -(event.pageY - height / 2) * 15 / height + 0.1 * height;
		$sectionALine.css("right", lineValueX + "px")
			.css("top", lineValueY + "px");
		event.preventDefault()
	})
	//页面backCall
	var backCallFn = {
		section1:function(){
			console.log("页面1")
		},
		section2:function(){
			$(".sectionBBoxA .sectionBText").animate({marginTop:"10%",opacity:"1"},800,function(){
				$(".sectionBBtnNext").animate({right:"3%",opacity:"1"})
			});
		},
		section3:function(){
			$(".sectionCBtn").addClass("rollIn");
			$(".sectionCBoxA .sectionCText").delay(300).animate({opacity:"1"},500)
		},
		section4:function(){
			$(".sectionDBoxA .sectionDText").animate({opacity:"1",marginTop:"35%"},500)
		},
		section5:function(){
			console.log("页面5")
		}
	}
	//音乐播放器
	var music = {
		playing : false,
		click:function(){
			if (music.playing) {
				music.stop()
			} else {
				music.play()
			}
		},
		play:function(){
			$(".music .button").addClass("buttonPlay");
			$(".music .musicImg").addClass("play").css("animation-play-state", "running")
			// $(".music .ball-scale").show()
			$(".music .ball-scale").fadeIn(1000);
			// $(".playing").show()
			$(".playing").fadeIn(1000);
			$(".music audio")[0].play();

			music.playing = true;
		},
		stop:function(){
			$(".music .button").removeClass("buttonPlay");
			$(".music .musicImg").removeClass("play").css("animation-play-state", "paused");
			// $(".music .ball-scale").hide()
			$(".music .ball-scale").fadeOut();
			$(".playing").fadeOut();
			$(".music audio")[0].pause();
			music.playing = false;
		}

	};
	$(".music .button").click(music.click);
	$(".sectionBText").click(textChange);
	var changeing = false;
	function textChange(){
		if (!changeing) {
			changeing = true;
			var	speed = 700,
				opa = "0.3",
				$node = $(this),
				$chs = $node.find(".chs"),
				$en = $node.find(".en"),
				height = $chs[0].offsetHeight;
			if ($chs[0].style.opacity !== "0" ) {
				$chs.animate({top: - height/2 +"px",opacity:opa},speed)
				$en.animate({top:height/2 +"px",opacity:opa},speed,function(){
					$chs.animate({top:"0px",opacity:"0"},speed)
					$en.animate({top:"0px",opacity:"1"},speed,function(){
						changeing = false;
					})
				})
			} else {
				$en.animate({top: - height/2 +"px",opacity:opa},speed)
				$chs.animate({top: height/2 +"px",opacity:opa},speed,function(){
					$en.animate({top:"0px",opacity:"0"},speed)
					$chs.animate({top:"0px",opacity:"1"},speed,function(){
						changeing = false;
					})
				})
			}
		}
	}
	var $bPageA = $(".sectionBBoxA"),
		$bPageB = $(".sectionBBoxB"),
		$bPageC = $(".sectionBBoxC"),
		$bBtnNext = $(".sectionBBtnNext"),
		$bBtnBefore = $(".sectionBBtnBefore"),
		$bBtnNextPage = $(".sectionBBtnNextPage"),
		sectionBpage = {
			index:1,
			clickNext:function(){
				if (sectionBpage.index ==1) {
					sectionBpage.index = 2;
					sectionBpage.next($bPageA,$bPageB);
					$bBtnBefore.delay(800).animate({right:"3%",opacity:"1"},function(){
						$(".sectionBBoxB .sectionBText ").animate({opacity:"1",marginTop:"7%"},800)
					})
				} else if (sectionBpage.index ==2) {
					sectionBpage.index = 3;
					sectionBpage.next($bPageB,$bPageC);
					$bBtnNext.delay(1000).animate({right:"-80px",opacity:"0"},function(){
						$(".sectionBBoxC .sectionBText ").animate({opacity:"1",marginTop:"4%"},800)
					})
					$bBtnBefore.delay(1000).animate({top:"-=70px"})
					$bBtnNextPage.delay(1000).animate({right:"3%",opacity:"1"})
				}
			},
			clickBefore:function(){
				if (sectionBpage.index ==3) {
					sectionBpage.index = 2;
					sectionBpage.before($bPageC,$bPageB);
					$bBtnNext.delay(1000).animate({right:"3%",opacity:"1"})
					$bBtnBefore.delay(1000).animate({top:"+=70px"})
					$bBtnNextPage.delay(1000).animate({right:"-80px",opacity:"0"})
				} else if (sectionBpage.index ==2) {
					sectionBpage.index = 1;
					sectionBpage.before($bPageB,$bPageA);
					$bBtnBefore.delay(1000).animate({right:"-80px",opacity:"0"})
				}
			},
			next:function(hidePage,showPage){
				hidePage.removeClass("boxLeftIn").removeClass("boxRightIn").addClass("boxLeftOut");
				showPage.removeClass("boxLeftOut").removeClass("boxRightOut").addClass("boxRightIn");
			},
			before:function(hidePage,showPage){
				hidePage.removeClass("boxLeftIn").removeClass("boxRightIn").addClass("boxRightOut");
				showPage.removeClass("boxLeftOut").removeClass("boxRightOut").addClass("boxLeftIn");
			}

	}

	
	$bBtnNext.click(sectionBpage.clickNext);
	$bBtnBefore.click(sectionBpage.clickBefore);
	$bBtnNextPage.click(wheel.down);

//第三页
	$(".sectionCText").click(function(){
		var $chs = $(this).find(".chs"),
			$en =  $(this).find(".en");
		if ($chs[0].style.opacity !== "0") {
			$chs.css("opacity","1").css("left","0").animate({opacity:"0",left:"-50%"},600);
			$en.css("opacity","0").css("left","-50%").animate({opacity:"1",left:"0"},600);
		} else {
			$chs.css("opacity","0").css("left","-50%").animate({opacity:"1",left:"0"},600);
			$en.css("opacity","1").css("left","0").animate({opacity:"0",left:"-50%"},600);
		}
	})
	var cPage = {
		index:1,
		arr:["A","B","C","D","E","F"],
		next:function(){
			if (cPage.index + 1 <= 6) {
				cPage.index += 1;
				cPage.move(cPage.index,true);
			}else{
				wheel.down();
			}
		},
		before:function(){
			if ( cPage.index - 1 >= 1) {
				cPage.index -= 1;
				cPage.move(cPage.index,false);
			}
		},
		move:function(index,next){
			if (next) {
				console.log("next: Out:" + cPage.arr[index-2] +"&In:"+ cPage.arr[index-1])
				$(".sectionCBox"+cPage.arr[index-2]).addClass("scaleLeftOut").removeClass("scaleLeftIn").removeClass("scaleRightIn");
				$(".sectionCBox"+cPage.arr[index-1]).addClass("scaleRightIn").removeClass("scaleLeftOut").removeClass("scaleRightOut").children().delay(800).animate({opacity:"1"},500);
				console.log($(".sectionCBox"+cPage.arr[index-1]).children()[0])
				if (index == 2) {
					$(".sectionCBtnBack").addClass("backShow").removeClass("backHide").removeClass("hide")
				} else if (index == 6) {
					$(".sectionCBtnNext").addClass("nextHide").removeClass("nextShow")
				} 
			} else {
				console.log("before: Out:" + cPage.arr[index] +"&In:"+ cPage.arr[index-1])
				$(".sectionCBox"+cPage.arr[index]).addClass("scaleRightOut").removeClass("scaleLeftIn").removeClass("scaleRightIn");
				$(".sectionCBox"+cPage.arr[index-1]).addClass("scaleLeftIn").removeClass("scaleLeftOut").removeClass("scaleRightOut");
				if (index == 5) {
					$(".sectionCBtnNext").addClass("nextShow").removeClass("nextHide")
				} else if (index == 1){
					$(".sectionCBtnBack").addClass("backHide").removeClass("backShow")
				}
			}
		}
	}

	$(".sectionCBtnNext").click(cPage.next);
	$(".sectionCBtnBack").click(cPage.before);

var dPage = {
		index:1,
		arr:["A","B","C","D","E"],
		next:function(){
			if (dPage.index + 1 <= 5) {
				dPage.index += 1;
				dPage.move(dPage.index,true);
			}
		},
		before:function(){
			if ( dPage.index - 1 >= 1) {
				dPage.index -= 1;
				dPage.move(dPage.index,false);
			}
		},
		move:function(index,next){
			var $indexNow = $(".sectionDBox"+cPage.arr[index-1]),
				$btnNext = $(".sectionDBtnNext"),
				$btnBack = $(".sectionDBtnBack");
			if (next) {
				$(".sectionDBox"+cPage.arr[index-2]).addClass("shrinkHide").removeClass("shrinkShow");
				$indexNow.addClass("shrinkShow").removeClass("shrinkHide");
				dPage.textShow($indexNow);
				if (index == 2) {
					 $btnBack.addClass("shake").animate({opacity:1},800,function(){
					 	$(this).delay(1000).removeClass("shake")
					 })
				} else if (index == 5) {
					$btnNext.addClass("shake").delay(600).animate({opacity:0},800,function(){
					 	$(this).removeClass("shake")
					 })
				} 
			} else {
				var $indexNow = $(".sectionDBox"+cPage.arr[index-1]);
				$(".sectionDBox"+cPage.arr[index]).addClass("shrinkHide").removeClass("shrinkShow");
				$indexNow.addClass("shrinkShow").removeClass("shrinkHide");
				dPage.textShow($indexNow);
				if (index == 4) {
					$btnNext.addClass("shake").animate({opacity:1},800,function(){
					 	$(this).delay(1000).removeClass("shake")
					 })
				} else if (index == 1){
					$btnBack.addClass("shake").delay(600).animate({opacity:0},800,function(){
					 	$(this).removeClass("shake")
					 })
				}
			}
		},
		textShow:function(node){//node父节点
			node.children().css("opacity","0").delay(2000).addClass("scaleRotate").animate({opacity:1},800,function(){
					$(this).delay(1000).removeClass("scaleRotate")
				});
		}
	}
	$(".sectionDBtnNext").click(dPage.next)
	$(".sectionDBtnBack").click(dPage.before)





	wheel.down();

	$("#progressBar").css("width", "100%");
	$("#progressMask").fadeOut(200);


})

