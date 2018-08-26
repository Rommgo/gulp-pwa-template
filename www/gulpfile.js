var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var bs = require('browser-sync').create();
var cleancss = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rev = require('gulp-rev-append');
var imagemin = require('gulp-imagemin');
var clean = require('gulp-clean');
var rigger = require('gulp-rigger');

gulp.task('bs', ['sass'], function () {
    bs.init({
        server: {
            baseDir: "./app/"
        },
        notify: false
    });
});

gulp.task('rig', function () {
    gulp.src('src/*.html') 
        .pipe(rigger()) 
        .pipe(gulp.dest('./app/')) 
        .pipe(bs.reload({stream: true}));
    });

gulp.task('sass', function () {
    var style = [
        'libs/css/**/*.css',
        'libs/css/**/*.sass',
        'libs/css/**/*.scss',
        './sass/*.scss'
    ];
    gulp.src(style)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('style.css'))
        .pipe(autoprefixer('last 4 versions', 'true'))
        .pipe(cleancss({level: {1: {specialComments: 0}}}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./app/css'))
        .pipe(bs.reload({stream: true}));
});

gulp.task('script', function () {
    gulp.src('js/script.js')
        .pipe(sourcemaps.init())
        .pipe(uglify().on('error', function (e) {
            console.log(e);
        }))
        .pipe(concat('script.min.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./app/js/'))
        .pipe(bs.reload({stream: true}));
});

gulp.task('rev', function() {
    gulp.src('./app/*.html')
        .pipe(rev())
        .pipe(gulp.dest('./app/'))
        .pipe(bs.reload({stream: true}));
});

gulp.task('imgmin', function() {
    gulp.src('./app/img/*')
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 3}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(gulp.dest('./app/img/'))
});

gulp.task('clean', function () {
    return gulp.src(['./app/js/script.min.js.map', './app/css/style.css.map'], {read: false})
        .pipe(clean());
});

gulp.task('watch', ['bs', 'sass', 'script', 'rig'], function () {
    gulp.watch("./sass/**/*.scss", ['sass'], bs.reload);
    gulp.watch(['./js/script.js'], ['script'], bs.reload);
    gulp.watch('./app/*.html', bs.reload)
});

gulp.task('rel', ['imgmin', 'clean', 'rev']);

gulp.task('default', ['watch']);