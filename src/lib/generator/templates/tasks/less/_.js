var gulp    = require('gulp');
var concat  = require('gulp-concat');
var less    = require('gulp-less');
var plumber = require('gulp-plumber');
var minifyCss = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');

var environmentTask = process.env.PROJECT_ENV === 'production' ? ['less-prod'] : ['less-dev'];

var paths = {
    src: 'styles/index.less'
  , all: 'styles/**/*.less'
  , output: 'dist/styles.css'
};

gulp.task('less-prod', function(){
  return gulp.src(paths.src)
    .pipe(less())
    .pipe(concat('styles.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest(paths.output));
});

gulp.task('less-dev', function(){
  return gulp.src(paths.src)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(concat('styles.css'))
    .pipe(sourcemaps.write())
    .pipe(plumber.stop())
    .pipe(gulp.dest(paths.output));
});

gulp.task('less', environmentTask);
