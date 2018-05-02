let gulp = require('gulp');
let gulpInject = require('gulp-inject');
let uglify = require('uglify-js');
let server = require('gulp-server-livereload');
let watch = require('gulp-watch');
let batch = require('gulp-batch');
let htmlMinify = require('gulp-html-minifier');
let jsonminify = require("jsonminify");

gulp.task('build', function () {
    let sourcesJs = gulp.src(['./app.js']);
    let injectJsContent = {
        starttag: '<!-- inject:content:js:{{path}} -->',
        removeTags: true,
        relative: true,
        transform: function (filePath, file) {
            let content = file.contents.toString('utf8');
            let js = uglify.minify(content);

            if (js.error) {
                throw js.error;
            } else {
                content = js.code;
            }

            return '<script>' + content + '</script>'
        }
    };

    let sourcesJson = gulp.src(['./config.json']);
    let injectJsonContent = {
        starttag: '// inject:content:json:{{path}}',
        endtag: '// endinject',
        removeTags: true,
        relative: true,
        transform: function (filePath, file) {
            return jsonminify(file.contents.toString('utf8'))
        }
    };

    let sourcesHtml = gulp.src(['./view/*.html']);
    let injectHtmlContent = {
        starttag: '<!-- inject:content:html:{{path}} -->',
        removeTags: true,
        relative: true,
        transform: function (filePath, file) {
            return file.contents.toString('utf8')
        }
    };

    let sourcesCss = gulp.src(['./styles/*.css']);
    let injectCssContent = {
        starttag: '<!-- inject:content:css:{{path}} -->',
        removeTags: true,
        relative: true,
        transform: function (filePath, file) {
            return '<style>' + file.contents.toString('utf8') + '</style>'
        }
    };

	let sourcesJpeg = gulp.src(['./img/*.jpeg']);
	let injectJpegContent = {
		starttag: '<!-- inject:content:jpeg:{{path}} -->',
        removeTags: true,
		relative: true,
		transform: function (filePath, file) {
			return '<img class="img-responsive" src="data:image/jpeg;base64,' + file.contents.toString('base64') + '"/>'
		}
	};

    return gulp.src('./index.html')
        .pipe(gulpInject(sourcesJs, injectJsContent))
        .pipe(gulpInject(sourcesJson, injectJsonContent))
        .pipe(gulpInject(sourcesHtml, injectHtmlContent))
        .pipe(gulpInject(sourcesCss, injectCssContent))
	    .pipe(gulpInject(sourcesJpeg, injectJpegContent))
        .pipe(gulp.dest('./dist'))
});

gulp.task('build:local', ['build'], function () {
    let emptyCdn = {
        starttag: '<!-- inject:content:cdn -->',
        removeTags: true,
        relative: true,
        transform: function () {
            return '';
        }
    };
    return gulp.src('./dist/index.html')
        .pipe(gulpInject(gulp.src('./dist/index.html'), emptyCdn))
        .pipe(gulp.dest('./dist'));
});

gulp.task('build:cdn', ['build'], function () {
    let emptyLocal = {
        starttag: '<!-- inject:content:local -->',
        removeTags: true,
        relative: true,
        transform: function () {
            return '';
        }
    };

	let htmlMinifyOptions = {
		collapseInlineTagWhitespace: true,
		collapseWhitespace: true,
		minifyCSS: true,
		minifyJS: true,
		removeComments: true,
		removeEmptyAttributes: true,
		removeRedundantAttributes: true
	};

    return gulp.src('./dist/index.html')
        .pipe(gulpInject(gulp.src('./dist/index.html'), emptyLocal))
	    .pipe(htmlMinify(htmlMinifyOptions))
        .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function() {
    let appFiles = ['./index.html', './app.js', './view/*.html'];
    watch(appFiles, batch(function (events, done) {
        gulp.start('build:local', done);
    }))
});

gulp.task('serve', ['build:local', 'watch'], function () {
    gulp.src('.')
        .pipe(server({
            livereload: {
                enable: true,
                clientConsole: true
            },
            defaultFile: './dist/index.html'
        }));
});