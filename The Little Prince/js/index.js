$(function() {
	//设置进度条
	$("#progressBar").css("width", "70%");
	//申明基本变量
	var $section = $(".section"),
		$page = $(".page"),
		$nav = $(".asideNav"),
		$aside = $(".aside"),
		$open = $(".asideOpen"),
		$music = $(".music"),
		$sectionABox = $(".sectionABox"),
		height = window.innerHeight,
		pageNow = 1,
		pageAll = $section.length;
		smallScreen = false;
	//基本UI设置
	$section.css("height", height + "px");
	$nav[0].style.marginTop = -$nav[0].offsetHeight / 2 + "px";
	$open[0].style.marginTop = -$nav[0].offsetHeight / 2 - 50 + "px";
	$music[0].style.top = $nav[0].offsetHeight / 2 + height / 2+ 50 +"px";
	$page.append($section.find(".fullScreen"))
		.append($section.first().clone(true));
	if (window.innerWidth < 950) {
		smallScreen	= true;
	}

	//页面滚动对象
	var wheel = {
		$liPointer:$(".liPointer"),
		scrolling: false,
		backCalling:false,
		touchClientY: 0,
		touchTime: null,
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
				wheel.$liPointer.css("transition-duration", "0s").css("top", (pageNow - 1) * 30 + "px");
				wheel.scrolling = false;
			} else {
				wheel.$liPointer.css("transition-duration", "1s");
				$page.css("transition-duration", "1s").css("transform", "translateY(" + step + ")");
				if (pageNow > pageAll) {
					wheel.$liPointer.css("top", "0px");
				} else {
					wheel.$liPointer.css("top", (pageNow - 1) * 30 + "px");
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
				wheel.backCallFn(pageNow);
			}
		},
		backCallFn:function(pageNow){
			switch(pageNow){
					case 1:
						break;
					case 2:
						var $btnNext = $(".sectionBBtnNext")
						$(".sectionBBoxA .sectionBText").animate({marginTop:"10%",opacity:"1"},800,function(){
							//仅第一次载入时有效
							if ($btnNext.attr("data-ok") != "ok") {
								$btnNext.animate({right:"3%",opacity:"1"}).attr("data-ok","ok");
							}	
						});
						break;
					case 3:
						$(".sectionCBtn").addClass("rollIn");
						$(".sectionCBoxA .sectionCText").delay(300).animate({opacity:"1"},500)
						break;
					case 4:
						$(".sectionDBoxA .sectionDText").animate({opacity:"1",marginTop:"25%"},500)
						break;
					case 5:
						break;
				}
		},
		//鼠标滚轮事件
		mousewheelEvent:function(event){
			if (wheel.scrolling) return false;
			var delta = event.wheelDelta || -event.detail;
			if (delta > 0) {
				wheel.up()
			} else if (delta < 0) {
				wheel.down()
			}
		},
		//键盘事件
		keyboardEvent : function(event) {
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
		},
		//手机端触摸事件
		touchstartEvent:function(event){
			wheel.touchClientY = event.touches[0].clientY;
			wheel.touchTime = new Date();
			event.preventDefault();
		},
		touchendEvent:function(event){
			var moveY = event.changedTouches[0].clientY - wheel.touchClientY,
				touchEndTime = new Date(),
				moveTime = touchEndTime.getTime() - wheel.touchTime.getTime();
			if (moveY > 70 && moveTime < 700) {
				wheel.up();

			} else if (moveY < -70 && moveTime < 700) {
				wheel.down();
			}
			wheel.touchClientY = 0;
			wheel.touchTime = null;
			event.preventDefault();
		},
		//指示器点击事件
		liClickEvent:function(){
			pageNow = parseInt(this.getAttribute("data-index"));
			wheel.move(pageNow);
		},
		//窗口改变大小事件（自适应）
		resizeEvent:function(){
			$(".music")[0].style.top = $nav[0].offsetHeight / 2 + window.innerHeight / 2+ 50 +"px";
			if (height != window.innerHeight) {
				height = window.innerHeight;
				$(".section").css("height", height + "px")
				wheel.move(pageNow, true);
			}
			$(".sectionALine").css("right", "15%").css("top", "10%");
		},
		//检测是否为火狐浏览器
		isFirefox:function(){
			var userAgent = navigator.userAgent;
			if (userAgent.indexOf("Firefox") > -1) {
				return true;
			} else {
				return false;
			}
		}
	};
	
	//wheel事件绑定
	if (wheel.isFirefox()) {
		document.addEventListener("DOMMouseScroll", wheel.mousewheelEvent);
	} else {
		document.addEventListener("mousewheel", wheel.mousewheelEvent);
	};
	$("li").click(wheel.liClickEvent)
	$page[0].addEventListener("touchstart", wheel.touchstartEvent);
	$page[0].addEventListener("touchend",wheel.touchendEvent);
	$(window).keydown(wheel.keyboardEvent);
	$page[0].addEventListener("webkitTransitionEnd", wheel.moveEnd);
	window.addEventListener("resize", wheel.resizeEvent);

	
	//aside固定
	var asideOpen = {
		transitting: false,
		$box:$(".textBox"),
		$point:$(".textBox .point"),
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
				$music.addClass("asideMusicCenter")
				$(".textBox").addClass("textBoxShow").removeClass("textBoxHide")
				asideOpen.mainTextChange();

			} else {
				$(".textBox").addClass("textBoxHide").removeClass("textBoxShow")
				$open.css("transform", "rotate(0deg)").html("☆")
				$aside.removeClass("asideFixed")
				$(".aside ul,.asideOpen").removeClass("asideColorFixed")
				$(".asideTitle").removeClass("asideTitleFixed")
				$music.removeClass("asideMusicCenter")
				asideOpen.mainTextBack();
			}
		},
		mainTextChange:function(){
			$(".sectionBText,.sectionCText,.sectionDText").each(function(){
				if (parseInt($(this).css("marginLeft")) < 300) {
					$(this).addClass("whenAsideOpen1");
				}
			})
			$(".sectionE .box").addClass("whenAsideOpen2");
		},
		mainTextBack:function(){
			$(".sectionBText,.sectionCText,.sectionDText").removeClass("whenAsideOpen1");
			$(".sectionE .box").removeClass("whenAsideOpen2");
		},
		transitEnd: function() {
			asideOpen.transitting = false;
		},
		//动画
		pointClick:function(){
			var btn = $(this).attr("data-index"),
				pos = $(".aside .textBox").attr("data-index");
				if (pos == "A") {
					if (btn == "A") {
						asideOpen.$box.attr("class","textBox textBoxShow Aup").attr("data-index","B");
					} else{
						if (asideOpen.$box.hasClass("Ashake")) {
							asideOpen.$box.attr("class","textBox textBoxShow AshakeToo")
						}else{
							asideOpen.$box.attr("class","textBox textBoxShow Ashake")
						}
					}
				} else if (pos == "B") {
					if (btn == "A") {
						asideOpen.$box.attr("class","textBox textBoxShow Adown").attr("data-index","A");
					} else if (btn == "B") {
						if (asideOpen.$box.hasClass("Bshake")) {
							asideOpen.$box.attr("class","textBox textBoxShow BshakeToo")
						}else{
							asideOpen.$box.attr("class","textBox textBoxShow Bshake")
						}
					} else if(btn == "C"){
						asideOpen.$box.attr("class","textBox textBoxShow Cdown").attr("data-index","C");
					}
					
				} else if (pos == "C"){
					if (btn == "C") {
						asideOpen.$box.attr("class","textBox textBoxShow Cup").attr("data-index","B");
					}else{
						if (asideOpen.$box.hasClass("Cshake")) {
							asideOpen.$box.attr("class","textBox textBoxShow CshakeToo")
						}else{
							asideOpen.$box.attr("class","textBox textBoxShow Cshake")
						}
					}
				}
				btn = $(this).attr("data-index");
				pos = $(".aside .textBox").attr("data-index");
		}
	}
	//事件绑定
	$open.click(asideOpen.transit)
	$open[0].addEventListener("webkitTransitionEnd", asideOpen.transitEnd);
	asideOpen.$point.click(asideOpen.pointClick)


	//全屏对象
	var full = {
		isFullScreen : false,
		//全屏
		fullScreen:function(){
			full.isFullScreen = true;
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
		},
		//退出全屏  
		fullExit:function(){
			full.isFullScreen = false;
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
		},
		//全屏事件
		fullClickEvent:function(){
			if (full.isFullScreen) {
				full.fullExit();
				$(this).html("<span>☒</span>全屏浏览");
			} else {
				full.fullScreen();
				$(this).html("<span>×</span>退出全屏");
			}
		}
	}
	// 全屏事件绑定
	$(".fullScreen p").click(full.fullClickEvent);
	
	//首页
	var sectionA = {
		$Line : $(".sectionALine"),
		//首页加载动画
		active:function(){
			sectionA.$Line.animate({top: "10%"}, 500, function() {
				$(".sectionATitle").addClass("translateIn");
				$(".sectionAText").addClass("translateIn");
			});
		},
		//首页抖动
		mousemoveEvent:function(){
			var width = window.innerWidth,
				height = window.innerHeight,
				boxValueX = -(event.pageX - width / 2) * 10 / width - 0.02 * width,
				boxValueY = -(event.pageY - height / 2) * 10 / height - 0.02 * height;
			$sectionABox.css("left", boxValueX + "px")
				.css("top", boxValueY + "px");
			var lineValueX = -(event.pageX - width / 2) * 20 / width + 0.15 * width,
				lineValueY = -(event.pageY - height / 2) * 15 / height + 0.1 * height;
			sectionA.$Line.css("right", lineValueX + "px")
				.css("top", lineValueY + "px");
			event.preventDefault()
		}
	};
	// 页面加载后直接执行
	sectionA.active();
	//首页抖动
	$sectionABox.mousemove(sectionA.mousemoveEvent);
	//音乐播放器
	var music = {
		$btn:$(".music .button"),
		playing : false,
		click:function(){
			if (music.playing) {
				music.stop()
			} else {
				music.play()
			}
		},
		play:function(){
			music.$btn.addClass("buttonPlay");
			$(".music .musicImg").addClass("play").css("animation-play-state", "running")
			$(".music .ball-scale").fadeIn(1000);
			$(".playing").fadeIn(1000);
			$(".music audio")[0].play();
			if (smallScreen) {
				setTimeout(function(){
					music.in();
				},600)
			}
			music.playing = true;
		},
		stop:function(){
			music.$btn.removeClass("buttonPlay");
			$(".music .musicImg").removeClass("play").css("animation-play-state", "paused");
			$(".music .ball-scale").fadeOut();
			$(".playing").fadeOut();
			$(".music audio")[0].pause();
			if (smallScreen) {
				setTimeout(function(){
					music.in();
				},600)
			}
			music.playing = false;
		},
		loading:function(){
			$("audio").html("<source src='music/Preparation.ogg' type='audio/ogg'><source src='music/Preparation.mp3' type='audio/mpeg'>")
		},
		out:function(){
			$music.animate({left:"0"},200);
			// console.log($(".music .button")[0])
			// $(".music .button").addClass("block");
			music.$btn.addClass("block");

		},
		in:function(){
			$music.animate({left:"-75px"},500,function(){
				music.$btn.removeClass("block")
			})
		}
	};
	// 加载音乐资源
	music.loading();
	//播放事件绑定
	music.$btn.click(music.click);
	// music.$btn[0].addEventListener("touchstart", music.click);
	if (smallScreen) {
		$music.click(music.out)
		// $music[0].addEventListener("touchstart", music.out);
	}

	// 第二页
	var sectionB = {
		$text:$(".sectionBText"),
		$pageA : $(".sectionBBoxA"),
		$pageB : $(".sectionBBoxB"),
		$pageC : $(".sectionBBoxC"),
		$btnNext : $(".sectionBBtnNext"),
		$btnBefore : $(".sectionBBtnBefore"),
		$btnNextPage : $(".sectionBBtnNextPage"),
		index:1,
		changeing:false,
		pageChangeing:false,
		textChange:function(){
			if (!sectionB.changeing) {
				sectionB.changeing = true;
				var	$node = $(this),
					$chs = $node.find(".chs"),
					$en = $node.find(".en"),
					height = $chs[0].offsetHeight;
				if ($chs[0].style.opacity !== "0" ) {
					$chs.animate({top: - height/2 +"px",opacity:"0.3"},700)
					$en.animate({top:height/2 +"px",opacity:"0.3"},700,function(){
						$chs.animate({top:"0px",opacity:"0"},700)
						$en.animate({top:"0px",opacity:"1"},700,function(){
							sectionB.changeing = false;
						})
					})
				} else {
					$en.animate({top: - height/2 +"px",opacity:"0.3"},700)
					$chs.animate({top: height/2 +"px",opacity:"0.3"},700,function(){
						$en.animate({top:"0px",opacity:"0"},700)
						$chs.animate({top:"0px",opacity:"1"},700,function(){
							sectionB.changeing = false;
						})
					})
				}
			}
		},
		clickNext:function(){
			if (!sectionB.pageChangeing) {
					if (sectionB.index ==1) {
					sectionB.index = 2;
					sectionB.change(sectionB.$pageA,sectionB.$pageB,true);
					sectionB.$btnBefore.delay(800).animate({right:"3%",opacity:"1"},function(){
						$(".sectionBBoxB .sectionBText ").animate({opacity:"1",marginTop:"7%"},800)
					})
				} else if (sectionB.index ==2) {
					sectionB.index = 3;
					sectionB.change(sectionB.$pageB,sectionB.$pageC,true);
					sectionB.$btnNext.delay(1000).animate({right:"-80px",opacity:"0"},function(){
						$(".sectionBBoxC .sectionBText ").animate({opacity:"1",marginTop:"4%"},800)
					})
					sectionB.$btnBefore.delay(1000).animate({top:"-=70px"})
					sectionB.$btnNextPage.delay(1000).animate({right:"3%",opacity:"1"})
				}
			}
		},
		clickBefore:function(){
			if (!sectionB.pageChangeing) {
				if (sectionB.index ==3) {
					sectionB.index = 2;
					sectionB.change(sectionB.$pageC,sectionB.$pageB,false);
					sectionB.$btnNext.delay(1000).animate({right:"3%",opacity:"1"})
					sectionB.$btnBefore.delay(1000).animate({top:"+=70px"})
					sectionB.$btnNextPage.delay(1000).animate({right:"-80px",opacity:"0"})
				} else if (sectionB.index ==2) {
					sectionB.index = 1;
					sectionB.change(sectionB.$pageB,sectionB.$pageA,false);
					sectionB.$btnBefore.delay(1000).animate({right:"-80px",opacity:"0"})
				}
			}
		},
		change:function(hidePage,showPage,next){
			sectionB.pageChangeing = true;
			var times = setInterval(function(){
				if (sectionB.check(showPage)) {
					sectionB.pageChangeing = false;
					clearInterval(times)
				}
			},200)
			if (next) {
				hidePage.removeClass("boxLeftIn").removeClass("boxRightIn").addClass("boxLeftOut");
				showPage.removeClass("boxLeftOut").removeClass("boxRightOut").addClass("boxRightIn");
			} else {
				hidePage.removeClass("boxLeftIn").removeClass("boxRightIn").addClass("boxRightOut");
				showPage.removeClass("boxLeftOut").removeClass("boxRightOut").addClass("boxLeftIn");
			}

		},
		check:function(showPage){
			if (showPage.css("z-index") == "900") {
				return true
			}else{
				return false
			}
		}
	}

	// 第二页事件绑定
	sectionB.$text.click(sectionB.textChange);
	var sectionBtext = document.querySelectorAll(".sectionBText");
	for (var i = 0; i < sectionBtext.length; i++) {
		sectionBtext[i].addEventListener("touchstart",sectionB.textChange);
	}
	sectionB.$btnNext.click(sectionB.clickNext);
	sectionB.$btnNext[0].addEventListener("touchstart",sectionB.clickNext);
	sectionB.$btnBefore.click(sectionB.clickBefore);
	sectionB.$btnBefore[0].addEventListener("touchstart",sectionB.clickBefore);
	sectionB.$btnNextPage.click(wheel.down);
	sectionB.$btnNextPage[0].addEventListener("touchstart",wheel.down);

	//第三页
	var sectionC={
		$text:$(".sectionCText"),
		$btnNext : $(".sectionCBtnNext"),
		$btnBack : $(".sectionCBtnBack"),
		index:1,
		arr:["A","B","C","D","E","F"],
		changeing:false,
		textChange:function(){
			var $chs = $(this).find(".chs"),
				$en =  $(this).find(".en");
			if ($chs.attr("data-hide") !== "0") {
				$chs.addClass("opacityHide").removeClass("opacityShow").attr("data-hide","0");
				$en.addClass("opacityShow").removeClass("opacityHide");
			} else {
				$chs.addClass("opacityShow").removeClass("opacityHide").attr("data-hide","1");
				$en.addClass("opacityHide").removeClass("opacityShow");
			}
		},
		next:function(){
			if (!sectionC.changeing) {
				if (sectionC.index + 1 <= 6) {
					sectionC.index += 1;
					sectionC.move(sectionC.index,true);
				}else{
					wheel.down();
				}
			}
		},
		before:function(){
			if (!sectionC.changeing) {
				if (sectionC.index - 1 >= 1) {
					sectionC.index -= 1;
					sectionC.move(sectionC.index,false);
				}
			}
		},
		move:function(index,next){
			sectionC.changeing = true;
			var $showPage = $(".sectionCBox"+sectionC.arr[index-1]);
			var times = setInterval(function(){
				if (sectionC.check($showPage)) {
					sectionC.changeing = false;
					clearInterval(times)
				}
			},200);
			if (next) {
				$(".sectionCBox"+sectionC.arr[index-2]).addClass("scaleLeftOut").removeClass("scaleLeftIn").removeClass("scaleRightIn");
				$showPage.addClass("scaleRightIn").removeClass("scaleLeftOut").removeClass("scaleRightOut").children().delay(800).animate({opacity:"1"},500);
				if (index == 2) {
					sectionC.$btnBack.addClass("backShow").removeClass("backHide").removeClass("hide")
				} else if (index == 6) {
					sectionC.$btnNext.addClass("nextHide").removeClass("nextShow")
				} 
			} else {
				$(".sectionCBox"+sectionC.arr[index]).addClass("scaleRightOut").removeClass("scaleLeftIn").removeClass("scaleRightIn");
				$showPage.addClass("scaleLeftIn").removeClass("scaleLeftOut").removeClass("scaleRightOut");
				if (index == 5) {
					sectionC.$btnNext.addClass("nextShow").removeClass("nextHide")
				} else if (index == 1){
					sectionC.$btnBack.addClass("backHide").removeClass("backShow")
				}
			}
		},
		check:function(showPage){
			if (showPage.css("z-index") == "auto") {
				return true
			}else{
				return false
			}
		}

	}
	// 第三页事件绑定
	sectionC.$text.click(sectionC.textChange);
	var sectionCtext = document.querySelectorAll(".sectionCText");
	for (var i = 0; i < sectionCtext.length; i++) {
		sectionCtext[i].addEventListener("touchstart",sectionC.textChange);
	}
	sectionC.$btnNext.click(sectionC.next);
	sectionC.$btnNext[0].addEventListener("touchstart",sectionC.next);
	sectionC.$btnBack.click(sectionC.before);
	sectionC.$btnBack[0].addEventListener("touchstart",sectionC.before);

	//第四页
	var sectionD= {
		$btnNext : $(".sectionDBtnNext"),
		$btnBack : $(".sectionDBtnBack"),
		index:1,
		arr:["A","B","C","D","E"],
		changeing:false,
		textChange:function(){
			var $chs = $(this).find(".chs"),
				$en =  $(this).find(".en");
			if ($chs.attr("data-hide") !== "0") {
				$chs.addClass("rotateTranslateHide").removeClass("rotateTranslateShow").attr("data-hide","0")
				$en.addClass("rotateTranslateShow").removeClass("rotateTranslateHide")
			} else {

				$en.addClass("rotateTranslateHide").removeClass("rotateTranslateShow")
				$chs.addClass("rotateTranslateShow").removeClass("rotateTranslateHide").attr("data-hide","1")
			}
		},
		next:function(){
			if (!sectionD.changeing) {
				if (sectionD.index + 1 <= 5) {
					sectionD.index += 1;
					sectionD.move(sectionD.index,true);
				}
			}
		},
		before:function(){
			if (!sectionD.changeing) {
				if ( sectionD.index - 1 >= 1) {
					sectionD.index -= 1;
					sectionD.move(sectionD.index,false);
				}
			}
		},
		move:function(index,next){
			sectionD.changeing = true;
			var $showPage = $(".sectionDBox"+sectionD.arr[index-1]);
			var times = setInterval(function(){
				if (sectionD.check($showPage)) {
					sectionD.changeing = false;
					clearInterval(times);
				}
			},200);
			if (next) {
				$(".sectionDBox"+sectionD.arr[index-2]).addClass("shrinkHide").removeClass("shrinkShow");
				$showPage.addClass("shrinkShow").removeClass("shrinkHide");
				sectionD.textShow($showPage);
				if (index == 2) {
					 sectionD.$btnBack.addClass("shake").animate({opacity:1},800,function(){
					 	$(this).delay(1000).removeClass("shake")
					 })
				} else if (index == 5) {
					sectionD.$btnNext.addClass("shake").delay(600).animate({opacity:0},800,function(){
					 	$(this).removeClass("shake")
					 })
				} 
			} else {
				var $showPage = $(".sectionDBox"+sectionD.arr[index-1]);
				$(".sectionDBox"+sectionD.arr[index]).addClass("shrinkHide").removeClass("shrinkShow");
				$showPage.addClass("shrinkShow").removeClass("shrinkHide");
				sectionD.textShow($showPage);
				if (index == 4) {
					sectionD.$btnNext.addClass("shake").animate({opacity:1},800,function(){
					 	$(this).delay(1000).removeClass("shake")
					 })
				} else if (index == 1){
					sectionD.$btnBack.addClass("shake").delay(600).animate({opacity:0},800,function(){
					 	$(this).removeClass("shake")
					 })
				}
			}
		},
		check:function(showPage){
			if (showPage.css("z-index") == "auto") {
				return true
			}else{
				return false
			}
		},
		textShow:function(node){//node父节点
			node.children().css("opacity","0").delay(2000).addClass("scaleRotate").animate({opacity:1},800,function(){
					$(this).delay(1000).removeClass("scaleRotate")
				});
		}
	}
	// 第四页事件绑定
	sectionD.$btnNext.click(sectionD.next);
	sectionD.$btnNext[0].addEventListener("touchstart",sectionD.next);
	sectionD.$btnBack.click(sectionD.before);
	sectionD.$btnBack[0].addEventListener("touchstart",sectionD.before);
	var sectionDText = document.querySelectorAll(".sectionDText");
	for (var i = 0; i < sectionDText.length; i++) {
		sectionDText[i].addEventListener("touchstart",sectionD.textChange);
		sectionDText[i].addEventListener("click",sectionD.textChange);
	}


	//微信二维码事件
	$(".wechat").click(function(){
		$(".QR").fadeToggle();
	});

	//小屏幕事件处理
	if (window.innerWidth < 950) {
		// var music = {
		// 	$music:$(".music"),
		// 	out:function(){
		// 		music.$music.animate({left:"0"})
		// 	},
		// 	in:function(){
		// 		music.$music.animate({left:"-75px"})
		// 	}
		// }
		// music.$music.click(music.out)
		// music.$music[0].addEventListener("touchstart", music.out);
		// 	// music.$btn[0].addEventListener("touchstart", wheel.touchstartEvent);
	}



	$("#progressBar").css("width", "100%");
	$("#progressMask").fadeOut(200);
})

