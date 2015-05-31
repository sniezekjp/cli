var gulp    = require('gulp');
var concat  = require('gulp-concat');
var plumber = require('gulp-plumber');
var minifyCss = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');

var environmentTask = process.env.PROJECT_ENV === 'production' ? ['css-prod'] : ['css-dev'];

var paths = {
    src: 'styles/index.css'
  , all: 'styles/**/*.css'
  , output: 'dist/styles.css'
};

gulp.task('css-prod', function(){
  return gulp.src(paths.all)
    .pipe(concat('styles.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest(paths.output));
});

gulp.task('css-dev', function(){
  return gulp.src(paths.all)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat('styles.css'))
    .pipe(sourcemaps.write())
    .pipe(plumber.stop())
    .pipe(gulp.dest(paths.output));
});

gulp.task('css', environmentTask);
