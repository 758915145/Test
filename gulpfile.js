//npm install gulp -g
//npm install gulp --save-dev


//引入之前需要安装相应的模块 , 如安装 gulp-sass : npm install gulp-sass --save-dev
var gulp = require('gulp'),
	sass = require('gulp-sass'),
	cssnano = require('gulp-cssnano'),
	uglify = require('gulp-uglify'),
	clean = require('gulp-clean'),
	rename = require('gulp-rename'),
	webpack = require("gulp-webpack"),
	babel = require('gulp-babel'),
	

	//项目路径
	project_path = '../APICloud',//震革智能充电桩app

	//路径 : src &amp; build 必须在同一目录下 ( 应该找个时间优化一下这个地方 , 使之能在不同目录下 )
	path = {
		//原始代码路径 & 项目下src目录中的所有文件 & 排除 src 目录中 components 文件下里的所有文件
		//src: [project_path + '/src/**/*.*','!'+project_path+'/src/components/**/*.*'],
		src:project_path+'/**/*.*',

		//编译后代码路径 &amp; 路径可以但不要以'/'结尾 , 因为下面代码用到了一个.split('/')来获取编译后的目录名
		build: project_path + '/build'
	},

	//根据路径获取项目名
	project_name = project_path.split('../')[1],

	//根据路径获取存放编译文件的目录名
	dist_name = path.build.split('/'),
	dist_name = dist_name[dist_name.length - 1],

	//工具
	tools = {

		//根据路径获取文件类型
		getType: function(path) {
			var _type_temp = path.split('.');
			return _type_temp[_type_temp.length - 1];
		},

		//根据路径获取文件名
		getName: function(path) {
			var _name_temp = path.split('\\');
			return _name_temp[_name_temp.length - 1];
		},

		//根据路径&amp;文件名获取编译后文件的存放路径
		getDistPath: function(path, name) {
			
			//假如匹配结果不唯一或没有 , 则直接返回并报错
			if(path.match(new RegExp(project_name + '\\\\src', 'g')).length!==1){
				console.log('无法根据该路径获取编译后文件的存放路径');
				return false;
			}
			
			//匹配一个反斜杠需要在字符串里写4个反斜杠
			return path.replace(
				//替换scr为存放编译文件的目录名
				new RegExp(project_name + '\\\\src', 'g'),
				project_name + '\\' + dist_name
			).replace(
				//删除路径中的文件名
				new RegExp(name, 'g'),
				''
			);
		}
	};
//默认任务 &amp; 监控文件变动
//gulp.task('default', function() {
//	gulp.watch(path.src, function(e) {
//		//type , path
//		handle(e);
//	});
//});

//直接执行任务 , 不监控
gulp.task('run', function() {
	gulp.src(path.src)

	//每一个文件都会执行一次on &amp; .on('data'可以获取匹配到的文件路径 &amp; rename模块也可以获取到
	.on('data', function(file) {
		handle(file);
	});
});

//处理文件流
function handle(file) {

	//获取路径
	try {
		//watch : event.type &amp; event.path
		//on data : file.history...
		var _path = file.path || file.history[0],
			_event_type = file.type || 0;
	} catch (e) {
		console.log('获取路径失败');
		return;
	}
	if (!_path) return;

	//获取 : 文件类型 , 文件名 , 编译后的存放路径
	var _type = tools.getType(_path),
		_name = tools.getName(_path),
		_dist_path = tools.getDistPath(_path, _name);
		
	if (!_dist_path) return;

	if (_event_type === 'deleted') {
		//删除文件
		gulp.src(_path, {
			read: false
		}).pipe(clean({
			force: true
		}));
		gulp.src(_dist_path, {
			read: false
		}).pipe(clean({
			force: true
		}));
		//关于read:false ( 添加这个可以提高处理速度 )
		// 原文 : Option read:false prevents gulp from reading the contents of the file and makes this task a lot faster.
		//If you need the file and its contents after cleaning in the same stream, do not set the read option to false.

		//关于force:true ( 添加这个才有权限删除../**目录下的文件 )
		// 原文 : For safety files and folders outside the current working directory can be removed only with option force set to true.
	} else {
		changed(_path, _type, _dist_path);
	}
}

//处理文件 : 添加、修改、编译、移动
function changed(_path, _type, _dist_path) {
	switch (_type) {
		case 'css':
			console.log('css');
			//gulp.src(_path).pipe(cssnano()).pipe(gulp.dest(_dist_path));
			break;

		case 'js':
			console.log('js');
			//gulp.src(_path).pipe(uglify()).pipe(gulp.dest(_dist_path));
			break;

		case 'html':
			console.log('html');
			break;

		case 'sass':
			console.log('sass');
			//gulp.src(_path).pipe(sass()).pipe(cssnano()).pipe(gulp.dest(_dist_path));
			break;
			
		case 'jsx':
			gulp.src(_path)
			.pipe(
				babel({
					//因为我写的项目路径不在gulpfile.js的同一目录下 , 所以这个presets的需要这样写
					presets: [__dirname+'/node_modules/babel-preset-react']
				})
			).pipe(gulp.dest(project_path+'/js'));

		default:
			console.log('default');
			//gulp.src(_path).pipe(gulp.dest(_dist_path));
			break;
	}
}

//重命名任务
//gulp.task('rename',function(){
// gulp.src('../test/src/*')
// .pipe(rename(function(path){
// console.log(path);
// }))
// .pipe(gulp.dest(path.build));
//});

//webpack任务
gulp.task('webpack',function(){
	gulp.src('../gulp-test/*.js')
		.pipe(
			webpack({
				
				// externals: 外部的; 外面的( external的名词复数 )
				// externals里的参数将不会被webpack打包 , 比如下面jquery不会被打包
				// 参数中key ( 比如 jquery ) 的含义: 模块中使用类似 require('jquery') 引入jquery时 , webpack不会将其打包
				// 参数中值 ( 比如 $ ) 的含义: 用<script>单独引入jquery之后 , 使用它只能用$或者jQuery , 打包后的build.js里面是以 module.exports = $; 的形式供其他模块使用的 , 所以这里只能写 $ 或者 jQuery
				externals:{
					'jquery':'$',
					
					//同理
					'react':'React',
					'react-dom':'ReactDOM'
				}
			})
		).pipe(rename('build2.js'))
		.pipe(gulp.dest('../gulp-test/build/'));
});

//babel任务
gulp.task('default',function(){
	gulp.src(project_path+'/智能充电桩test/*.jsx')
		.pipe(
			babel({
				//因为我写的项目路径不在gulpfile.js的同一目录下 , 所以这个presets的需要这样写
				presets: [__dirname+'/node_modules/babel-preset-react']
			})
		).pipe(gulp.dest(project_path+'/智能充电桩/html/pages'));
});

//参考资料 :
// 基础 : http://www.cnblogs.com/2050/p/4198792.html
// gulp-clean : https://www.npmjs.com/package/gulp-clean
// .on('data',fn) : https://segmentfault.com/a/1190000000711469