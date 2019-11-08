"use strict";

let gulp = require("gulp");
let plumber = require("gulp-plumber");
let sourcemap = require("gulp-sourcemaps");
let rename = require("gulp-rename");
let sass = require("gulp-sass");
let postcss = require("gulp-postcss");
let autoprefixer = require("autoprefixer");
let csso = require("gulp-csso");
let server = require("browser-sync").create();
let del = require("del");
let pug = require("gulp-pug");
let htmlmin = require("gulp-htmlmin");

gulp.task("css", () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("source/css"))
    .pipe(gulp.dest("build/css"))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("source/css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("html", () => {
  return gulp.src("source/*.pug")
    .pipe(pug())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"))
});

gulp.task("server", () => {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.scss", gulp.series("css"));
  gulp.watch("source/js/*.js", gulp.series("copy", "refresh"));
  gulp.watch("source/**/*.pug", gulp.series("html", "refresh"));
  gulp.watch(("source/*.html"), gulp.series("copy", "refresh"));
});

gulp.task("copy", () => {
  return gulp.src([
    "source/js/*.js",
    "source/css/*.css",
    "source/*.html",
    "source/webfonts/**"
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"));
});

gulp.task("clean", () => del("build"));

gulp.task("build", gulp.series(
  "clean",
  "copy",
  'html',
  "css"
));

gulp.task("refresh", done => {
  server.reload();
  done();
});

gulp.task("start", gulp.series(
  "build",
  "server"
));
