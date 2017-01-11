import gulp from 'gulp'
import browserify from 'browserify'
import gutil from 'gulp-util'
import tap from 'gulp-tap'
import buffer from 'gulp-buffer'
import config from '../config'
import babel from 'babelify'
import handleErrors from '../util/handleErrors'

// ============================================
// Browserify task
// ============================================
//  Bundles all entry files found at config path
//  to a separate destination file with original naming
// ============================================

function bundler () {

  return gulp.src(config.browserify.src, {read: false}) // no need of reading file because browserify does.

      // transform file objects using gulp-tap plugin
      .pipe(tap(function (file) {

        gutil.log('bundling ' + file.path)

        // replace file contents with browserify's bundle stream
        file.contents =
          browserify(file.path, config.browserify.config)
          .transform(babel, config.browserify.babel)
          .bundle()
          .on('error', handleErrors)

      }))

      .pipe(gulp.dest(config.browserify.dest))

}

// Description
bundler.displayName = 'bundler'
bundler.description = 'Bundles JavaScript Entry files'

// Export task
module.exports = bundler
