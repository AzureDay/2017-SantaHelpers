let gulp = require('gulp');
let gulpInject = require('gulp-inject');
let server = require('gulp-server-livereload');
let watch = require('gulp-watch');
let batch = require('gulp-batch');

gulp.task('build', function () {
    let sourcesJs = gulp.src(['./app.js']);
    let injectJsContent = {
        starttag: '<!-- inject:content:js:{{path}} -->',
        relative: true,
        transform: function (filePath, file) {
            return '<script>' + file.contents.toString('utf8') + '</script>'
        }
    };

    let sourcesHtml = gulp.src(['./view/*.html']);
    let injectHtmlContent = {
        starttag: '<!-- inject:content:html:{{path}} -->',
        relative: true,
        transform: function (filePath, file) {
            return file.contents.toString('utf8')
        }
    };

    return gulp.src('./index.html')
        .pipe(gulpInject(sourcesJs, injectJsContent))
        .pipe(gulpInject(sourcesHtml, injectHtmlContent))
        .pipe(gulp.dest('./dist'))
});

gulp.task('watch', function() {
    let appFiles = ['./index.html', './app.js', './view/*.html'];
    watch(appFiles, batch(function (events, done) {
        gulp.start('build', done);
    }))
});

gulp.task('serve', ['build', 'watch'], function () {
    gulp.src('./dist')
        .pipe(server({
            livereload: {
                enable: true,
                clientConsole: true
            }
        }));
});