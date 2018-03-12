const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const through2 = require('through2');
const minimist = require('minimist');
const pngquant = require('imagemin-pngquant');
const gutil = require('gulp-util');

//路径对象, 方便统一管理
var jPath = {
	page:'./page/',
	pageJsDir:'./page/js',
	pageHtml:'./page/html/*.html',
	pageJs:'./page/js/*.js',
	pageCss:'./page/css/*.css',
	pageImg:'./page/img/*.*',
	bund:'./bund/',
	bundHtml:'./bund/html/',
	bundJs:'./bund/js/',
	bundCss:'./bund/css/',
	bundImg:'./bund/img/',
	revPath:'./rev/**/*.json',
	revCss:'./rev/css_rev',
	revJs:'./rev/js_rev',
	node_modules_js:'./node_modules/**/*.js',
　　	node_modules_css:'./node_modules/**/*.css'
}
//根据路径获取项目路径
var projectPath = '../gulp+browserify/';
//根据路径获取项目名
var	projectName = projectPath.split('../')[1];
//根据路径获取存放编译文件的目录名
var	distName = jPath.bund.split('/');
	distName = distName[distName.length - 1];

gulp.task('dev',function(){
	plugins.runSequence(
		'constants',
		['destHtml','devMiniCSS','devMiniJS'],
		'watch'
	)
});
//测试
gulp.task('test',function(){
	plugins.runSequence(
		'constants',
		['update','minImg']
	)
});
//预生产||正式
gulp.task('build',function(){
	plugins.runSequence(
		'constants',
		['update','minImg']
	)

});
gulp.task('default',function(){
	plugins.runSequence(
		'constants',
		['miniJS','miniCSS']
	)
});
// 监视文件变化，自动执行任务
gulp.task('watch', function(){
  gulp.watch(jPath.pageJs,['devMiniJS']);
  gulp.watch(jPath.pageCss, ['devMiniCSS']);
  gulp.watch(jPath.pageHtml,['destHtml']);
  gulp.watch(jPath.pageImg,['minImg']);
})

/*
 * 多环境配置,
 * 默认dev环境
 */
var knowOptions = {
  string: 'env',
  default: {
    env: process.env.NODE_ENV || 'dev'
  }
};
var options = minimist(process.argv.slice(2), knowOptions);

//生成filename文件，存入string内容
function string_src(filename, string) {
  var src = require('stream').Readable({ objectMode: true })
  src._read = function () {
    this.push(new gutil.File({ cwd: "", base: "", path: filename, contents: new Buffer(string) }))
    this.push(null)
  }
  return src
}
//生成环境地址.js文件
gulp.task('constants', function() {
  //读入config.json文件
  var myPath = require('./respPath.js');
  //取出对应的配置信息
  //命令行传回来的参数 
  var envConfig = myPath[options.env];
  var conConfig = 'module.exports = ' + JSON.stringify(envConfig);
  console.log(projectPath)
  //生成config.js文件
  return string_src("./respPath.js", conConfig)
      .pipe(gulp.dest('./api/'))
});


//browserify打包
gulp.task('devMiniJS',function(){
		gulp.src(jPath.pageJs,{read:false})
		.pipe(plugins.browserify({
            insertGlobals: true,
            debug: !gulp.env.production
        }))
		//最终这里再把js文件中所有的es6语法编译成es5语法
        .pipe(plugins.babel({
            babelrc: false,
            presets: ['es2015', 'es2016', 'es2017'],
            plugins: ['transform-es2015-modules-commonjs']
        })) 
		//输出文件
		.pipe(gulp.dest(jPath.bundJs))
})
//输出html
gulp.task('destHtml',function(){
	return gulp.src(jPath.pageHtml,{read:true})
		.pipe(gulp.dest(jPath.bundHtml))//输出压缩后的HTML
});

gulp.task('devMiniCSS',function(){
	return gulp.src(jPath.pageCss,{read:true})
	.pipe(gulp.dest(jPath.bundCss))
});

gulp.task('miniJS',function(){
	return gulp.src(jPath.pageJs,{read:false})
		.pipe(plugins.browserify({
            insertGlobals: true,
            debug: !gulp.env.production
        }))
		//最终这里再把js文件中所有的es6语法编译成es5语法
        .pipe(plugins.babel({
            babelrc: false,
            presets: ['es2015', 'es2016', 'es2017'],
            plugins: ['transform-es2015-modules-commonjs']
        })) 
		//压缩js文件
		.pipe(plugins.uglify())
		//输出文件
		.pipe(gulp.dest(jPath.bundJs))
		//生成md5
		.pipe(plugins.rev())
		//生成md5的json文件
		.pipe(plugins.rev.manifest({merge:true}))
		//替换
		.pipe(replaceSuffix())
		//输出该文件
		.pipe(gulp.dest(jPath.revJs))
});

gulp.task('miniCSS',function(){
	return gulp.src(jPath.pageCss)
	//压缩
	.pipe(plugins.minifyCss())
	//输出
	.pipe(gulp.dest(jPath.bundCss))
	//生成md5
	.pipe(plugins.rev())
	//生成md5的json文件
	.pipe(plugins.rev.manifest({merge:true}))
	.pipe(replaceSuffix())
	//输出该文件
	.pipe(gulp.dest(jPath.revCss))
	
});

//图片压缩
gulp.task('minImg',function(){
	return gulp.src(jPath.pageImg)
	    .pipe(plugins.imagemin({
	        progressive: true,
	        svgoPlugins: [{removeViewBox: false}],
	        use: [pngquant()]
	    }))
	    .pipe(gulp.dest(jPath.bundImg));
});

//输出文件名更换
gulp.task("update",['miniCSS','miniJS'],function (cb) {
    gulp.src([jPath.revPath,jPath.pageHtml]) 
    	//利用revCollector的可配置，去满足我们需要的模式；
        .pipe(plugins.revCollector({ 
            revSuffix: '\\?v=[0-9a-f]{8,10}-?' 
        }))                  
        .pipe(gulp.dest(jPath.bundHtml))
});

/*
 * 更换版本号
 * replaceSuffix把替content-bf1194aded.css换成content.css?v=bf1194aded
 */
function replaceSuffix() {
	//匹配出-7ef5d9ee29.css，用于后面做文章
    var pattern =/-[0-9a-f]{8,10}-?\.[^"]*/gmi; 
    return through2.obj(function(file, encoding, done) {
        var content =String(file.contents).replace(pattern,function(match,pos,origin){
        	//匹配出7ef5d9ee29，用于后面拼接
        var pat=/[0-9a-f]{8,10}-?/g;  
        if(pat.test(match)){
        	//如果$'和$&这句话看不懂，红宝书第五章正则表达式部分该复习了；
            return  RegExp["$'"].concat("?v=", RegExp["$&"]);
        }else{
            return match;
        }   
        });  
        file.contents = new Buffer(content);
        this.push(file);
        done();
    });
}

//获取各项流数据
function handle(file) {
	//获取路径
	try {
		var srcPath = file.path || file.history[0];
	} catch (e) {
		console.log('获取路径失败');
		return;
	}
	if (!srcPath) return;
	//获取 : 文件类型 (js||css||html||...), 文件名 , 编译后的存放路径
	var taskType = tools.getType(srcPath),
		fileName = tools.getName(srcPath),
		distPath = tools.getDistPath(srcPath, fileName);
}
var tools = {
	//根据路径获取文件类型
	getType: function(path) {
		var typeTemp = path.split('.');
		return typeTemp[typeTemp.length - 1];
	},
	//根据路径获取文件名
	getName: function(path) {
		var nameTemp = path.split('\\');
		return nameTemp[nameTemp.length - 1];
	},
	//根据路径&文件名获取编译后文件的存放路径
	getDistPath: function(path, name) {
		//匹配一个反斜杠需要在字符串里写4个反斜杠
		return path.replace(
			//替换scr为存放编译文件的目录名
			new RegExp(projectName + '\\\\src', 'g'),
			projectName + '\\' + distName
		).replace(
			//删除路径中的文件名
			new RegExp(name, 'g'),''
		);
	}
};									
	