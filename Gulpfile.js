var gulp = require('gulp');
var gulpsync = require('gulp-sync')(gulp);
var babel = require('gulp-babel');
var eslint = require('gulp-eslint');
var rimraf = require('rimraf');
var mocha = require('gulp-mocha');

var DEST_DIR = './lib';
var SRC_GLOB_PATTERN = 'src/**/*.js';
var TEST_GLOB_PATTERN = './src/**/*-test.js';
var TEST_INIT_FILE = './src/__tests__/init';

gulp.task('babel', ['lint'], function() {
	return gulp.src(SRC_GLOB_PATTERN)
		.pipe(babel())
		.pipe(gulp.dest(DEST_DIR));
});

gulp.task('js', ['babel']);

gulp.task('test-no-exit', ['lint'], function() {
	return gulp.src(TEST_GLOB_PATTERN)
		.pipe(mocha({
			require: [TEST_INIT_FILE]
		}))
});

gulp.task('build', gulpsync.sync['clean', 'js']);

gulp.task('test', ['lint'], function() {
	return gulp.src(TEST_GLOB_PATTERN)
		.pipe(mocha({
			require: [TEST_INIT_FILE]
		}))
		.once('error', function() {
			process.exit(1);
		})
		.once('end', function() {
			process.exit();
		});
});

gulp.task('clean', function(cb) {
	return rimraf(DEST_DIR, cb);
});

gulp.task('watch', ['build'], function(cb){
	console.log('Watching ' + SRC_GLOB_PATTERN);
	gulp.watch(SRC_GLOB_PATTERN, ['js'])
});

gulp.task('test-watch', ['test-no-exit'], function() {
	console.log('Watching ' + TEST_GLOB_PATTERN);
	gulp.watch(TEST_GLOB_PATTERN, ['test-no-exit']);
});

gulp.task('lint', function() {
	return gulp.src(['src/**/*.js'])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failOnError());
});

gulp.task('default', ['build']);

require('babel/register')();