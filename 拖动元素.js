/*
* 进度条可以拖动的话，也不错啊
* */
drag(document.querySelector('.progress'));

function drag(obj){

	var left = parseInt(getstyle(obj,'marginLeft'));
	var top = parseInt(getstyle(obj,'marginTop'));

	//获取元素实际渲染出来的样式
	function getstyle(obj,styleName){
		return obj.currentStyle ? obj.currentStyle[styleName] : obj.ownerDocument.defaultView.getComputedStyle(obj, null)[styleName];
	}
	obj.onmousedown = function(e){
		if(e.button!=0)return;
		//首先获取点击的时候，鼠标的位置
		var clientX = e.clientX;
		var clientY = e.clientY;

		//记录一下left和top的初始值
		var _left = left;
		var _top = top;

		document.body.onmousemove = function(e){
			e.preventDefault();//阻止默认事件，取消文字选中
			//点击之后，鼠标移动
			left = e.clientX - clientX+_left;
			top = e.clientY - clientY+_top;
			obj.style.marginLeft = left+'px';
			obj.style.marginTop = top +'px';
		};
	};
	obj.onmouseup = function(e){
		document.body.onmousemove = null;
	};
}
