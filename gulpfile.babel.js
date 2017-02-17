import gulp from 'gulp';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import header from 'gulp-header';
import pkg from './package.json';

pkg.date = new Date().toISOString().replace(/\.\d{3}/, "");
pkg._name = pkg.name.replace('.js', '');

// Header
const banner = ['/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * Date <%= pkg.date %>',
    ' * ',
    ' * @author <%= pkg.author %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' */',
    '', ''
].join('\n');


gulp.task("default", function () {
  return gulp.src(["src/polyfill_fixed.js", "src/main.js", "src/**/*.js"])
    .pipe(concat(pkg._name + '.js'))
    .pipe(babel())
    .pipe(header(banner, {
        pkg: pkg
    }))
    .pipe(gulp.dest("dist"))

    //Minify
    .pipe(uglify())
    .pipe(rename(pkg._name + '.min.js'))
    .pipe(header(banner, {
        pkg: pkg
    }))
    .pipe(gulp.dest("dist"));
});
