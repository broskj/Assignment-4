/**
 * Created by Gavin on 1/22/16.
 */
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var nodemon = require('gulp-nodemon');
var jsFiles = ['*.js', 'client/*.js', 'client/js/*.js'];

//checks javascript syntax and styling to make sure everything is uniform
gulp.task('style', function() {
    return gulp.src(jsFiles)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish', {
            verbose: true
        }))
        .pipe(jscs())
        .pipe(jscs.reporter());
});

//add html links in index.html to all javascript and css files
gulp.task('inject', function() {
    var wiredep = require('wiredep').stream;
    var inject = require('gulp-inject');

    var injectSrc = gulp.src(['./client/styles/*.css',
        './client/js/*.js',
        './client/js/factories/*.js',
        './client/js/controllers/*.js'],
        {read: false});

    var injectOptions = {
        ignorePath: '/client'
    };

    var options = {
        bowerJson: require('./bower.json'),
        directory: './client/lib',
        ignorePath: '../'
    };

    return gulp.src('./client/views/*.html')
        .pipe(wiredep(options))
        .pipe(inject(injectSrc, injectOptions))
        .pipe(gulp.dest('./client/views'));
});

//runs style and inject asynchronously
gulp.task('serve', ['style', 'inject'], function() {
    var options = {
        script: 'server.js',
        delayTime: 1,
        env: {
            'PORT': 8080
        },
        watch: jsFiles
    };

    return nodemon(options)
        .on('restart', function(ev) {
            console.log('Restarting...');
        });
});