var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var bs = require('browser-sync').create();
var cleancss = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rev = require('gulp-rev-append');
var rigger = require('gulp-rigger');
var rename = require('gulp-rename');
var plumber = require('gulp-plumber');
var imagemin = require('gulp-imagemin');
var clean = require('gulp-clean');
var rimraf = require('rimraf');


gulp.task('bs', ['rig', 'sass'], function () {
    bs.init({
        server: {
            baseDir: "./src/"
        },
        host: 'localhost',
        port: 3001,
        logPrefix: "localhost",
        logConnections : true,
        online         : true
    });
});

gulp.task('rig', function () {
    gulp.src('./src/template/pages/*.html',)
        .pipe(plumber())
        .pipe(rigger())
        .pipe(gulp.dest('./src/'))
        .pipe(bs.reload({stream: true}));
});

gulp.task('sass', function () {
    gulp.src('./src/sass/*.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('style.css'))
        .pipe(autoprefixer('last 4 versions', 'true'))
        .pipe(gulp.dest('./src/css'))
        .pipe(cleancss({level: {1: {specialComments: 0}}}))
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./src/css'))
        .pipe(bs.reload({stream: true}));
});

gulp.task('script', function () {
    gulp.src('./src/scripts/*.js')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(concat('script.js'))
        .pipe(gulp.dest('./src/js/'))
        .pipe(uglify().on('error', function (e) {console.log(e);}))
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./src/js/'))
        .pipe(bs.reload({stream: true}));
});

gulp.task('rev', function() {
    gulp.src('./src/*.html')
        .pipe(rev())
        .pipe(gulp.dest('./build/'))
        .pipe(bs.reload({stream: true}));
});

gulp.task('imgmin', function() {
    gulp.src('./src/img/**/*.*')
        // .pipe(imagemin([
        //     imagemin.gifsicle({interlaced: true}),
        //     imagemin.jpegtran({progressive: true}),
        //     imagemin.optipng({optimizationLevel: 1}),
        //     imagemin.svgo({
        //         plugins: [
        //             {removeViewBox: true},
        //             {cleanupIDs: false}
        //         ]
        //     })
        // ]))
        .pipe(gulp.dest('./build/img/'))
});

gulp.task('clean', ['delete','rev', 'imgmin'], function () {
    gulp.src('./src/fonts/**/*.*')
        .pipe(gulp.dest('./build/fonts'));
    gulp.src('./src/css/**/*.*')
        .pipe(gulp.dest('./build/css/'));
    gulp.src('./src/js/**/*.*')
        .pipe(gulp.dest('./build/js/'));
    gulp.src('./src/*.*')
        .pipe(gulp.dest('./build/'));
});

gulp.task('cleanbuild', function (callback) {
    rimraf('./build/**/*.map', callback);
});

gulp.task('delete', function (callback) {
    rimraf('./build/*', callback);
});

gulp.task('watch', ['bs', 'rig', 'sass', 'script'], function () {
    gulp.watch("./src/sass/**/*.scss", ['sass'], bs.reload);
    gulp.watch(['./src/scripts/*.js'], ['script'], bs.reload);
    gulp.watch('./src/template/**/*.html', ['rig'], bs.reload);
    gulp.watch('./src/*.html', bs.reload)
});

gulp.task('build', ['clean']);
gulp.task('default', ['watch']);