"use strict";
let gulp = require('gulp');
let uglify = require('gulp-uglify');
let concat = require('gulp-concat');
let minifyCSS = require('gulp-minify-css');
let react = require('gulp-react');
let browserify = require('browserify');
let babelify = require('babelify');
let source = require('vinyl-source-stream');

gulp.task('build-admin', function () {
    return browserify({entries: `./static/dev/js/app.js`, extensions: ['.js'], debug: true})
        .transform(babelify.configure({stage: 0}))
        .bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest(`./static/js`));
});
gulp.task('compress', ['build-admin'], function() {
    return gulp.src('./static/js/app.js')
        .pipe(uglify())
        .pipe(gulp.dest('./static/js'));
});

gulp.task('minify', function () {
    gulp.src(`./static/dev/css/**.css`)
        .pipe(minifyCSS())
        .pipe(concat('app.css'))
        .pipe(gulp.dest('./static/css'))
});

gulp.task('watch', function () {
    gulp.watch(['./static/dev/js/**'], ['compress']);
    gulp.watch(['./static/dev/css/**'], ["minify"]);
});

gulp.task('default', ['watch']);