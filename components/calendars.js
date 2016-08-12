/*
 * 日历组件
 * 使用方法 :
 * var calendars = new calendars({id:'calendars'});
 * calendars.show('2016/4');
 * calendars.hide();
 * calendars.DOM
 * calendars.DOM.day[0].timestamp
 * 自定义html，如添加左右按钮
 * <div id="calendars">
		<a href="javascript:;" class="left"><</a>
		<a href="javascript:;" class="right">></a>
 * </div>
 */
var calendars = function(option){
	
	option = option instanceof Object?option:{};
	
	this.DOM = {
		layout:document.getElementById(option.id) || document.getElementById('calendars')||document.createElement('div')
	};
	this.data = {};
	var _style = document.getElementById('__calendars_style__'),
		_temp_dom = this.DOM.layout;
	this.data.layout_html = _temp_dom.innerHTML;
	
	if(!_style){
		_style = document.createElement('style');
		_style.id = '__calendars_style__';
		_style.innerHTML = '#calendars{display:none;opacity:0;transition:opacity 0.3s;background-color:#29323f;font-family:"微软雅黑","console";color:#fff;width:315px;padding:20px;position:absolute;top:50%;left:50%;transform:translateY(-50%) translateX(-50%);box-shadow:5px 10px 20px rgba(0,0,0,.6);border-radius:5px;}#calendars .title{text-align:center;color:#fcee6d;margin:0 0 30px 0}#calendars ul{list-style-type:none;padding-left:0;overflow:hidden}#calendars li{line-height:44px;height:44px;text-align:center;float:left;width:14.28571428571429%;overflow:hidden}#calendars .weekday li{color:#999}#calendars .day a{text-decoration:none;color:#FFF;display:block;width:100%;height:44px;line-height:44px}#calendars a.today,#calendars .day a:hover{background-color:#fcee6d;color:#29323f}';
		document.head.appendChild(_style);
	}
	_temp_dom.innerHTML = '<h3 class="title"></h3><ul class="weekday"><li>日</li><li>一</li><li>二</li><li>三</li><li>四</li><li>五</li><li>六</li></ul><ul class="day"></ul>'+this.data.layout_html;
	_temp_dom.style.cssText = option.cssText;
}

//一些函数
calendars.prototype.fn = {
	
	//获取当月天数
	MaxDay : function(Y,M){
		return new Date(new Date(Y,M).setHours(-1)).getDate();
	},
	
	//获取当月1日时是星期几
	oneWeekDay : function(Y,M){
		return new Date(Y,M-1,1).getDay();
	},
	
	//根据日期制作日历
	create : function(time){
		//获取当前时间
		var nowDate = time ? new Date(time) : new Date(),
			DOM = this.DOM.layout,
			timestamp = nowDate.getTime(),
			Y = nowDate.getFullYear(),
			M = nowDate.getMonth() + 1,
			W = nowDate.getDay(), //0是星期日
			D = nowDate.getDate(),
			e_dayUl = DOM.getElementsByTagName('UL')[1],
	
			//插入li
			str_day = '',
	
			//li ( 天 ) 的列表
			arr_li = [],
	
			//获取当月天数
			MD = this.fn.MaxDay(Y, M),
	
			//获取当月1日是星期几
			OW = this.fn.oneWeekDay(Y, M),
	
			MdOw = MD + OW,
	
			//日期
			day = 0;
	
		//插入列表
		for (var i = 0; i < MdOw; i++) {
			str_day += i < OW ? '<li></li>' : '<li><a href="javascript:;">' + (++day) + '</a></li>';
		}
		e_dayUl.innerHTML = str_day;
		DOM.getElementsByTagName('H3')[0].innerHTML = Y + '年' + M + '月';
		
		var e_day = e_dayUl.getElementsByTagName('A'),
			len = e_day.length;
		e_day[D-1].className = 'today';
		for(var i=0;i<len;i++){
			e_day[i].timestamp = new Date(Y+"/"+M+"/"+(i+1)).getTime();
		}
		
		//储存每一天的a标签元素
		this.DOM.day = e_day;
		
		//如果外壳元素是js新建的 , 那么它没有id , 而且需要添加进body里
		if(!DOM.id){
			DOM.id = 'calendars';
			document.body.appendChild(DOM);
		}
	}
};

//对外提供的api接口
calendars.prototype.show = function(time){
	var DOM = this.DOM.layout;
	this.fn.create.call(this,time);
	DOM.style.display = 'block';
	setTimeout(function(){
		DOM.style.opacity = 1;
	},0);
}
calendars.prototype.hide = function(){
	var DOM = calendars.DOM.layout;
	DOM.style.opacity = 0;
	setTimeout(function(){
		DOM.style.display = 'none';
	},300);
}

try{
	//webpack打包
	module.exports = calendars;
}catch(e){}