'use strict';

import gulp from 'gulp'
import autoprefixer from 'autoprefixer'
import browserSync from 'browser-sync'
import gulpSass from 'gulp-sass'
import postcss from 'gulp-postcss'
import sourcemaps from 'gulp-sourcemaps'
import handleErrors from '../util/handleErrors'
import config from '../config'

// ============================================
// Sass task
// ============================================
//  Sass compilation via node sass and autoprefixer
// ============================================

var processors = [
  autoprefixer({ browsers: config.sass.prefix })
]

function sass () {
  return gulp.src(config.sass.src)
    .pipe(sourcemaps.init())
    .pipe(gulpSass(config.sass.settings))
    .on('error', handleErrors)
    .pipe(postcss(processors))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.sass.dest))
    .pipe(browserSync.reload({stream: true}))
}

// Description
sass.displayName = 'sass'
sass.description = 'Compiles sass and docks autoprefixer'

// Export
export default sass
