var gulp    = require('gulp');
var concat  = require('gulp-concat');
var stylus  = require('gulp-stylus');
var plumber = require('gulp-plumber');
var minifyCss = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');

var environmentTask = process.env.PROJECT_ENV === 'production' ? ['stylus-prod'] : ['stylus-dev'];

var paths = {
    src: 'styles/index.styl'
  , all: 'styles/**/*.styl'
  , output: 'dist/styles.css'
};

gulp.task('stylus-prod', function(){
  return gulp.src(paths.src)
    .pipe(stylus())
    .pipe(concat('styles.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest(paths.output));
});

gulp.task('stylus-dev', function(){
  return gulp.src(paths.src)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(stylus())
    .pipe(concat('styles.css'))
    .pipe(sourcemaps.write())
    .pipe(plumber.stop())
    .pipe(gulp.dest(paths.output));
});

gulp.task('stylus', environmentTask);
