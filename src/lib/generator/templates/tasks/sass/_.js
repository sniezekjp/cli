var gulp    = require('gulp');
var concat  = require('gulp-concat');
var sass    = require('gulp-sass');
var plumber = require('gulp-plumber');
var minifyCss = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');

var environmentTask = process.env.PROJECT_ENV === 'production' ? ['sass-prod'] : ['sass-dev'];

var paths = {
    src: 'styles/index.sass'
  , all: 'styles/**/*.sass'
  , output: 'dist/styles.css'
};

gulp.task('sass-prod', function(){
  return gulp.src(paths.src)
    .pipe(sass())
    .pipe(concat('styles.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest(paths.output));
});

gulp.task('sass-dev', function(){
  return gulp.src(paths.src)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(concat('styles.css'))
    .pipe(sourcemaps.write())
    .pipe(plumber.stop())
    .pipe(gulp.dest(paths.output));
});

gulp.task('sass', environmentTask);
