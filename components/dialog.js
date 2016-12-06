/*
 * 对话框组件
 * 使用方法 :
 * dialog({content:'',innerHTML:'',layoutId:'',type:''}) 自定义innerHTML等选项
 * dialog(document.getElementById('...')) 直接丢一个元素进去
 */
var dialog = function(option){
	option = option instanceof Object?option:{};
	if(option.nodeName){
		option.layoutId = option.getAttribute('layoutId');
		option.type = option.getAttribute('type');
		option.cssText = option.style.cssText;
	}
	this.DOM = {
		//获取或新建对话框layout元素
		layout:document.getElementById(option.layoutId)||document.getElementById('dialog')||document.createElement('div')
	}

	var _temp_dom = this.DOM.layout,
		_dialog_layout_style = document.getElementById('__dialog_style__'),
		_this = this;

	if(!_dialog_layout_style){
		_dialog_layout_style = document.createElement('style');
		_dialog_layout_style.id = '__dialog_style__';
		_dialog_layout_style.innerHTML = '#xiaoyi-close-a{position:absolute;top:10px;right:10px;display:block;font-weight:700;color:#DDD;text-decoration:none;}#xiaoyi-close-a:hover{color:#CC7070 }';
		document.head.appendChild(_dialog_layout_style);
	}

	//设置对话框layout样式
	_temp_dom.style.cssText = 'padding-bottom:30px;display:none;transition:opacity 0.3s;opacity:0;font-family:\'微软雅黑\';width:300px;position:fixed;top:38.2%;left:50%;background-color:#333;border-radius:5px;box-shadow:5px 5px 10px #666;margin-left:-150px;margin-top:-56px;'
	_temp_dom.style.cssText += ';'+option.cssText;

	//设置对话框innerHTML
	_temp_dom.innerHTML = '<a href="javascript:;" id="xiaoyi-close-a" title="关闭对话框">×</a>';
	_temp_dom.innerHTML += option.innerHTML||'<div style="padding:20px;color:#FFF;text-align: center;"><div style="font-size:16px;font-weight:700;margin-top:10px;">'+(option.title?option.title:"温馨提示")+'</div><p style="font-size:12px">'+(option.content?option.content:'您确定吗？')+'</p></div>';

	//判断对话框的种类 & 插入额外的HTML
	switch(option.type){

		//询问 : 确定&取消 ?
		case 'confirm':
			_temp_dom.innerHTML += '<style>.xiaoyi-dialog a{text-decoration:none;color:#FFF;padding:10px 20px;border-radius:4px;text-shadow:1px 1px 2px #333;box-shadow:2px 2px 5px #111}.xiaoyi-dialog-a-1{margin-right:20px;background-color:#74B0D2;background:linear-gradient(#74B0D2,#8CBEDA 45%,#76ADCA 55%,#70ADCC 100%);}.xiaoyi-dialog-a-2{background-color:#A3A3A3;background:linear-gradient(#A3A3A3,#B3B0B0 45%,#9C9797 55%,#9E9E9E 100%);}.xiaoyi-dialog a:hover{background-color:#D27474;background:linear-gradient(#D27474,#DA8C8C 45%,#CA7676 55%,#CC7070 100%);}</style><div style="text-align:center;font-size:12px;" class="xiaoyi-dialog"><a href="javascript:;" class="xiaoyi-dialog-a-1">确定</a><a href="javascript:;" class="xiaoyi-dialog-a-2">取消</a>';
			var A = _temp_dom.getElementsByTagName('a');

			//点击确定
			A[1].onclick = function(){
				_this.ok();
			};

			//点击取消
			A[2].onclick = function(){
				_this.cancel();
			};
			break;

		//输入&提交
		case 'prompt':
			_temp_dom.innerHTML += '';
			break;

		//仅显示文本 & 自定义
		default:break;
	}

	//关闭按钮点击事件
	_temp_dom.getElementsByTagName('a')[0].onclick = this.hide.bind(this);
};

//显示对话框
dialog.prototype.show = function(){
	var DOM = this.DOM.layout;

	//如果对话框是js新建的 , 那么它没有id , 而且需要添加进body里
	if(!DOM.id){
		document.body.appendChild(DOM);
	}
	DOM.style.display = 'block';
	setTimeout(function(){
		DOM.style.opacity = 1;
	},0);
};

//隐藏对话框
dialog.prototype.hide = function(){
	var DOM = this.DOM.layout;
	DOM.style.opacity = 0;
	setTimeout(function(){
		document.body.removeChild(DOM);
	},300);
};

//点击确定按钮
dialog.prototype.ok = function(){console.log('请自定义「确定」事件')};

//点击取消按钮
dialog.prototype.cancel = function(){this.hide()};

try{
	//webpack打包
	module.exports = dialog;
}catch(e){}
