const gulp = require('gulp');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const shell = require('gulp-shell');
const minifyHTML = require('gulp-minify-html');
const importCss = require('gulp-import-css');
const autoprefixer = require('gulp-autoprefixer');
const uncss = require('gulp-uncss');
const cleanCss = require('gulp-clean-css');
const rename = require('gulp-rename');
const glob = require('glob');
const replace = require('gulp-replace');
const fs = require('fs');
const download = require('gulp-download');

const sassFiles = '_assets/sass/**/*.scss';
const cssFiles = '_assets/css/**/*.css';

gulp.task('default', ['download', 'sass', 'css', 'include-css']);

gulp.task('jekyll', function() {
  return gulp.src('index.html', { read: false })
    .pipe(shell('ruby')
    .pipe(shell('bundle exec jekyll b')));
});

gulp.task('css', () => {
  gulp.src(cssFiles)
    .pipe(concat('main.min.css'))
    .pipe(importCss())
    .pipe(autoprefixer())
    .pipe(uncss({
           html: glob.sync("_site/**/*.html"),
        }))
    .pipe(cleanCss({keepBreaks:false}))
    .pipe(gulp.dest('_assets/'))
});

gulp.task('sass', function() {
   return gulp.src(sassFiles)
       .pipe(sass())
       .pipe(rename('main.css'))
       .pipe(gulp.dest('_assets/css'));
});

gulp.task('download', function() {
  return download('https://fonts.googleapis.com/css?family=Oswald:300,400,700|Inconsolata|Open+Sans:300,700.css')
    .pipe(gulp.dest('_assets/css'));
});

gulp.task('include-css', function() {
  return gulp.src('_site/**/*.html')
    .pipe(replace(/<!--css-->/, function(s) {
      var style = fs.readFileSync('_assets/main.min.css', 'utf8');
      return '<style>\n' + style + '\n</style>';
    }))
    .pipe(gulp.dest('_site/'));
});