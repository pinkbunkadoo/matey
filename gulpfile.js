var gulp = require('gulp');
var less = require('gulp-less');

gulp.task('css', function() {
  // console.log('Hello gulp.js');
  return gulp.src(['app/css/less/*.less', '!app/css/less/theme.less'])
  .pipe(less())
  .pipe(gulp.dest('app/css'))
});

gulp.task('watch', function() {
  gulp.watch(['app/css/less/*.less'], ['css']);
});
