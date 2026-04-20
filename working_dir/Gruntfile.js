module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  // if some scripts depend upon eachother,
  // make sure to list them here in order
  // rather than just using the '*' wildcard.

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    dirs: {
      dist: 'dist/',
      src: 'src/',
    },

    clean: {
      dist: '<%= dirs.dist %>'
    },

    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: {
          'dist/css/styles.css': 'src/scss/styles.scss'
        }
      },
      dev: {
        options: {
          style: 'expanded'
        },
        files: {
          'dist/css/styles.css': 'src/scss/styles.scss'
        }
      }
    },

    autoprefixer: {
      options: {
        browsers: ['last 2 version', '> 2%', 'ie 10', 'ie 9'],
        map: true
      },
      dist: {
        src: '<%= dirs.src %>css/styles.css',
        dest: '<%= dirs.src %>css/styles.css'
      },
      dev: {
        src: '<%= dirs.dist %>css/styles.css',
        dest: '<%= dirs.dist %>css/styles.css'
      }

    },

    useminPrepare: {
      html: '<%= dirs.src %>/index.html',
      options: {
        dest: '<%= dirs.dist %>'
      }
    },

    concurrent: {
      dist: [
        // 'imagemin',
        // 'svgmin',
        'htmlmin:dist'
      ]
    },

    // imagemin: {
    //   dist: {
    //     files: [{
    //       expand: true,
    //       cwd: '<%= dirs.src %>images',
    //       src: '**/*.{png,jpg,jpeg}',
    //       dest: '<%= dirs.dist %>images/',
    //     }]
    //   }
    // },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= dirs.src %>images',
          src: '{,*/}*.svg',
          dest: '<%= dirs.dist %>images/',
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {},
        files: [{
          expand: true,
          cwd: '<%= dirs.src %>',
          src: ['**/*.html'],
          dest: '<%= dirs.dist %>'
        }]
      },
      done: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: [{
          expand: true,
          cwd: '<%= dirs.dist %>',
          src: ['*.html'],
          dest: '<%= dirs.dist %>'
        }]
      }
    },

    concat: {
      // options: {
      //   sourceMap: true
      // }
    },

    copy: {
      dist: {
        expand: true,
        cwd: '<%= dirs.src %>',
        dest: '<%= dirs.dist %>',
        src: [
          'fonts/**/*',
        ]
      },
      dev: {
        expand: true,
        cwd: '<%= dirs.src %>',
        dest: '<%= dirs.dist %>',
        src: [
          '**',
          '!**/js/scripts.js',
          '!**/scss/**/*',
          // '!**/images/**/*',
          // '!**/images/**/*.gif',
          // '!**/*.html'
        ]
      }
    },

    sync: {
      main: {
        files: [{
          cwd: '<%= dirs.src %>',
          src: [
            '**', /* Include everything */
            '!**/*.html', /* but exclude html files */
            '!js/scripts.js',
            '!less/**',
            '!scss/**',
            '!images/**'
          ],
          dest: '<%= dirs.dist %>',
        }],
        pretend: true, // Don't do any IO. Before you run the task with `updateAndDelete` PLEASE MAKE SURE it doesn't remove too much.
        verbose: true // Display log messages when copying files
      }
    },

    cssmin: {
      options: {
        // sourceMap: true
      }
    },

    uglify: {
      dist: {
        options: {
          sourceMap: true,
          sourceMapIncludeSources: true,
          sourceMapRoot: '<%= dirs.src %>',
          preserveComments: 'some'
        }
      },
      dev: {
        options: {
          sourceMap: true,
          sourceMapIncludeSources: true,
          sourceMapRoot: '<%= dirs.src %>'
        },
        files: {
          '<%= dirs.dist %>js/scripts.js': '<%= dirs.src %>js/scripts.js'
        }
      }
    },

    rev: {
      dist: {
        files: {
          src: [
            '<%= dirs.dist %>js/**/*.js',
            '<%= dirs.dist %>css/**/*.css',
            '<%= dirs.dist %>images/**/*.{png,jpg,jpeg,gif,webp,svg}'
          ]
        }
      }
    },

    usemin: {
      html: ['<%= dirs.dist %>{,*/}*.html'],
      css: ['<%= dirs.dist %>css/{,*/}*.css'],
      options: {
        dirs: ['<%= dirs.dist %>']
      }
    },

    connect: {
      server: {
        options: {
          port: 9001,
          base: 'dist/'
        }
      }
    },

    watch: {
      stylesheets: {
        files: ['<%= dirs.src %>scss/**/*.scss'],
        tasks: [
          'sass:dev',
          'newer:autoprefixer:dev'
        ]
      },
      html: {
        files: ['<%= dirs.src %>**/*.html'],
        tasks: ['htmlmin:dist']
      },
      js: {
        files: ['<%= dirs.src %>js/scripts.js'],
        tasks: ['uglify:dev']
      },
      // images: {
      //   files: ['<%= dirs.src %>images/**/*'],
      //   tasks: [
      //     'newer:imagemin',
      //     'newer:svgmin'
      //   ]
      // },
      sync: {
        files: [
          '<%= dirs.src %>css/**/*',
          '<%= dirs.src %>fonts/**/*',
          '<%= dirs.src %>js/**/*',
          '!<%= dirs.src %>/js/scripts.js'
        ],
        tasks: ['sync']
      },
      livereload: {
        options: {
          livereload: true,
        },
        files: [
        '<%= dirs.dist %>**/*',
        '!<%= dirs.src %>css/**/*'
        ],
      },
    }
  });


  grunt.registerTask('dist', [
    'clean:dist',
    'sass:dist',
    'autoprefixer:dist',
    'useminPrepare',
    'concurrent:dist',
    'concat',
    'copy:dist',
    'cssmin',
    'uglify:dist',
    'rev',
    'usemin',
    'htmlmin:done'
  ]);

  grunt.registerTask('dev', [
    'clean:dist',
    'copy:dev',
    'concurrent:dist',
    'sass:dev',
    'autoprefixer:dev',
    'uglify:dev',
  ]);

  grunt.registerTask('alert',
    'Watch all js and css files for changes and rebuld appropriatly', [
      'dev',
      'connect:server',
      'watch'
    ]);
};



// module.exports = function(grunt) {
//     require('load-grunt-tasks')(grunt);

//     // if some scripts depend upon eachother,
//     // make sure to list them here in order
//     // rather than just using the '*' wildcard.

//     grunt.initConfig({
//         pkg: grunt.file.readJSON('package.json'),

//         dirs: {
//             dist: 'dist/',
//             src: 'src/',
//         },

//         files: {
//             srcHtml: '<%= dirs.src %>*.html',
//             srcScss: '<%= dirs.src %>scss/styles.scss',
//             srcJs: '<%= dirs.src %>js/scripts.js',

//             distHtml: '<%= dirs.dist %>*.html',
//             distCss: '<%= dirs.dist %>css/styles.css',
//             distJs: '<%= dirs.dist %>js/scripts.js',
//         },

//         clean: {
//             html: {
//                 expand: true,
//                 cwd: '<%= dirs.dist %>',
//                 src: ['*.html', ]
//             },
//             all: {
//                 expand: true,
//                 cwd: '<%= dirs.dist %>',
//                 src: ['**', '!**/js/scripts.js', '!**/css/styles.css', '!**/images/']
//             }
//         },

//         copy: {
//             html: {
//                 expand: true,
//                 cwd: '<%= dirs.src %>',
//                 src: ['*'],
//                 dest: '<%= dirs.dist %>',
//                 filter: 'isFile'
//             },
//             all: {
//                 expand: true,
//                 cwd: '<%= dirs.src %>',
//                 src: ['**', '!**/less/**', '!**/scss/**', '!**/js/scripts.js', '!**/images/'],
//                 dest: '<%= dirs.dist %>'
//             }
//         },

//         sass: {
//             dist: {
//                 options: {
//                     style: 'expanded'
//                 },
//                 files: {
//                     '<%= files.distCss %>': '<%= files.srcScss %>'
//                 }
//             }
//         },

//         autoprefixer: {
//             options: {
//                 browsers: ['last 2 version', '> 2%', 'ie 10', 'ie 9']
//             },
//             build: {
//                 src: '<%= files.distCss %>',
//                 dest: '<%= files.distCss %>'
//             }

//         },

//         uglify: {
//             target: {
//                 options: {
//                     sourceMap: true,
//                     sourceMapIncludeSources: true,
//                     sourceMapRoot: '<%= dirs.src %>'
//                 },
//                 files: {
//                     '<%= files.distJs %>': '<%= files.srcJs %>'
//                 }
//             },
//         },

//         imagemin: {
//             png: {
//                 options: {
//                     optimizationLevel: 7
//                 },
//                 files: [{
//                     expand: true,
//                     cwd: 'src/images/',
//                     src: ['**/*.png'],
//                     dest: 'dist/images/',
//                     ext: '.png'
//                 }]
//             },
//             jpg: {
//                 options: {
//                     progressive: true
//                 },
//                 files: [{
//                     expand: true,
//                     cwd: 'src/images/',
//                     src: ['**/*.jpg'],
//                     dest: 'dist/images/',
//                     ext: '.jpg'
//                 }]
//             }
//         },

//         connect: {
//             server: {
//                 options: {
//                     port: 9001,
//                     base: 'dist/'
//                 }
//             }
//         },

//         watch: {
//             stylesheets: {
//                 files: ['src/scss/**/*.scss'],
//                 tasks: ['sass']
//             },
//             html: {
//                 files: ['<%= files.srcHtml %>'],
//                 tasks: ['clean:html', 'copy:html']
//             },
//             js: {
//                 files: ['src/js/**/*.js'],
//                 tasks: ['uglify']
//             },
//             livereload: {
//                 options: {
//                     livereload: true,
//                 },
//                 files: ['<%= files.distHtml %>', 'dist/css/*.css', '<%= files.distJs %>'],
//             },
//         },
//     });
//     grunt.registerTask('default', 'Clean the build directory + minify js file', ['newer:clean:all', 'newer:copy:all', 'newer:sass', 'autoprefixer:dist', 'newer:uglify']);
//     grunt.registerTask('alert', 'Watch all js and css files for changes and rebuld appropriatly', ['default', 'connect:server', 'watch']);
//     grunt.registerTask('prod', 'Post-process css file and minify it, compress images', ['newer:autoprefixer:dist', 'newer:imagemin']);
// };
