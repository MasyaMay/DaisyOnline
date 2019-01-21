var gulp = require('gulp'), // Подключаем Gulp
    watch = require('gulp-watch'),
    autoprefixer = require('gulp-autoprefixer'),
    less = require('gulp-less'); //Подключаем Sass пакет
    fileinclude = require('gulp-file-include'),
    pagebuilder = require('gulp-pagebuilder');

gulp.task('less', function(){ // Создаем таск "less"
    return gulp.src('app/less/main.less') // Берем источник
        .pipe(less()) // Преобразуем Less в CSS посредством gulp-less
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('dist/css')) // Выгружаем результат в папку dist/css
});

gulp.task('template', function () {
    return gulp.src('app/*.html')
        .pipe(fileinclude({
        	prefix:'@@',
        	basepath: '@file'
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('watch', function() {
    gulp.watch('app/less/main.less', gulp.series('less')); // Наблюдение за less файлами
    gulp.watch('app/*.html', gulp.series('template')); 
});
