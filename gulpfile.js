var gulp = require("gulp");
var ts = require("gulp-typescript");
var sourcemaps = require("gulp-sourcemaps");
var merge = require("merge2");

var tsProject = ts.createProject("tsconfig.json", {declaration: true});

gulp.task("default", function() {
    var tsResult = gulp
        .src(["./src/**/*.ts", "index.ts"])
        .pipe(tsProject());

    return merge([
        tsResult.dts.pipe(gulp.dest("release")),
        tsResult.js
            .pipe(sourcemaps.write())
            .pipe(gulp.dest("release"))
    ]);
});
