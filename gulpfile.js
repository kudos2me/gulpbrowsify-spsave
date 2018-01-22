var gulp = require('gulp'); // Require gulp

// Sass dependencies
var sass = require('gulp-sass'); // Compile Sass into CSS
var minifyCSS = require('gulp-clean-css'); // Minify the CSS

// Minification dependencies
// var minifyHTML = require('gulp-minify-html'); // Minify HTML
var concat = require('gulp-concat'); // Join all JS files together to save space
var stripDebug = require('gulp-strip-debug'); // Remove debugging stuffs
var uglify = require('gulp-uglify'); // Minify JavaScript
var imagemin = require('gulp-imagemin'); // Minify images
var rename = require('gulp-rename'); // rename to .min.
//let babel = require('gulp-babel');

// Other dependencies
var size = require('gulp-size'); // Get the size of the project
var browserSync = require('browser-sync').create(); // Reload the browser on file changes
//var eslint = require('gulp-eslint');
// var jshint = require("gulp-jshint"); // Debug JS files
// var stylish = require("jshint-stylish"); // More stylish debugging
var gutil = require('gulp-util');

// SPSave 
var spsave = require('gulp-spsave');  // upload to sharepoint


// Tasks -------------------------------------------------------------------- >

// Task to compile Sass file into CSS, and minify CSS into build directory
gulp.task('styles', function() {
    gulp
        .src('./sass/style.scss')
		.pipe(sass().on('error', sass.logError))
		//.pipe(gulp.dest('.'))
		.pipe(minifyCSS())
		.pipe(concat('styles.css'))
		.pipe(rename({
            suffix: '.min'
        }))
		.pipe(gulp.dest('./dist/css'))
		.pipe(
			browserSync.reload({
				stream: true
			})
		);
});

// Task to concat, strip debugging and minify JS files
gulp.task('scripts', function() {
	gulp
		.src('./js/*.js')
		//.pipe(
		//	babel({
		//		presets: ['env']
		//	})
		//)
		.pipe(uglify())
		.on('error', function(err) {
			gutil.log(gutil.colors.red('[Error]'), err.toString());
		})
		.pipe(concat('bundle.js'))
		.pipe(rename({
            suffix: '.min'
        }))
		.pipe(gulp.dest('./dist/js/'));
});

// Task to minify images into build
gulp.task('images', function() {
	gulp
		.src('./dist/img/*')
		.pipe(
			imagemin({
				progressive: true
			})
		)
		.pipe(gulp.dest('./dist/img/'));
});

// Task to get the size of the app project
gulp.task('size', function() {
	gulp.src('./**').pipe(
		size({
			showFiles: true
		})
	);
});

// Task to get the size of the build project
gulp.task('build-size', function() {
	gulp.src('./**').pipe(
		size({
			showFiles: true
		})
	);
});

// gulp.task('lint', function() {
// 	gulp
// 		.src('./js/my.js')
// 		.pipe(eslint())
// 		.pipe(eslint.format());
// });

// Serve application
gulp.task('serve', ['styles', 'scripts', 'images', 'size'], function() {
	browserSync.init({
        //proxy: 'accseswp.dev'
        server: "."
	});
});

// Run all Gulp tasks and serve application
gulp.task('default', ['serve', 'styles', 'scripts'], function() {
	gulp.watch('sass/**/*.scss', ['styles']);
	gulp.watch('js/**/*.js', ['scripts']);
    //gulp.watch('**/*.html', browserSync.reload);
	gulp.watch("**/*.html").on('change', browserSync.reload);
});
// Taken from https://gist.github.com/danielbarbarito/77d76333c2adc2af65cc6798e883f17c
// Forked from https://gist.github.com/danielgynn/50d9546e9163c11e799c


// Push dist/minified files to SharePoint using SPSave
// Credentials and SP-save actions 
var coreOptions = {  
    siteUrl: "https://corehero.sharepoint.com/sites/isha",
    notification: true,
    // path to document library or in this case the master pages gallery
    folder: "/Style Library/CORE-BZ", 
    flatten: false, 
    checkin: true,
    checkinType: 1,
    checkinMessage: "Published using Gulp"
};
var creds = {  
    username: "isha@corehero.onmicrosoft.com",
    password: "Pass@word1"
};

gulp.task('spdefault', function(){
	//return gulp.src(["dist/**/*.*"])
	return gulp.src(["dist/css/*.css"])	
		.pipe(spsave(coreOptions, creds));
});



