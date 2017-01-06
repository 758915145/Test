;(function($) {
	//addScrollBar是自定义的插件名
	$.fn.addScrollBar = function(options) {
		
		//自定义的默认参数
		var defaults = {
			container: "body",
			box: "",
			method: "touch",
			scrollBarColor: "black",
			direction: "vertical"
		};
		
		//合并options和default
		var params = $.extend({}, defaults, options || {});
		
	};
})(jQuery);