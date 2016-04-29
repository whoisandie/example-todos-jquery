var gulp = require('gulp');
var wiredep = require('wiredep').stream;
var browserSync = require('browser-sync').create();
var runSequence = require('run-sequence');
var $ = require('gulp-load-plugins')();

// Paths
var paths = {
  main: 'app/index.html',
  images: 'app/assets/images/**',
  fonts: 'app/assets/fonts/**',
  styles: 'app/styles/*.scss',
  scripts: 'app/scripts/*.js'
};


// Server task
gulp.task('serve', ['compile'], function() {
  browserSync.init({
    server: {
      baseDir: ['.tmp'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  // Watchers
  gulp.watch(paths.main, ['html']);
  gulp.watch(paths.styles, ['styles']);
  gulp.watch(paths.scripts, ['scripts']);
});


// Compile task
gulp.task('compile', function(cb) {
  runSequence(['styles', 'scripts'], 'wiredep', cb);
})


// Html task
gulp.task('html', function() {
  return gulp.src(paths.main)
    .pipe(gulp.dest('.tmp'))
    .pipe(browserSync.stream());
});


// Styles task
gulp.task('styles', function() {
  return gulp.src(paths.styles)
    .pipe($.plumber())
    .pipe($.sass.sync({
      includePaths: ['.']
    }))
    .on('error', $.sass.logError)
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(browserSync.stream());
});

// Scripts task
gulp.task('scripts', function(){
  return gulp.src(paths.scripts)
    .pipe($.plumber())
    .pipe(gulp.dest('.tmp/scripts'))
    .pipe(browserSync.stream());
});

// Wiredep
gulp.task('wiredep', function() {
  var sources = gulp.src(['.tmp/styles/*.css', '.tmp/scripts/*.js'], { read: false });
  gulp.src(paths.styles)
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('app/styles'));

  gulp.src(paths.main)
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./,
      exclude: ['bootstrap-sass'],
      exclude: ['bootstrap.js']
    }))
    .pipe($.inject(sources, {
      ignorePath: '/.tmp/'
    }))
    .pipe(gulp.dest('.tmp'));
});

// Default task
gulp.task('default', ['serve']);
