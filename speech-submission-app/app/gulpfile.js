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

gulp.task('build:local', ['build'], function () {
    let emptyCdn = {
        starttag: '<!-- inject:content:cdn -->',
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
        relative: true,
        transform: function () {
            return '';
        }
    };
    return gulp.src('./dist/index.html')
        .pipe(gulpInject(gulp.src('./dist/index.html'), emptyLocal))
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