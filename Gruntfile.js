module.exports = function(grunt) {

// Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

// Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);


    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
		
		watch: {
             htmlparts: {
                files: ['app/parts/*'],
                tasks: ['includereplace']
            },
            js: {
				files: ['app/js/{,*/}*.js'],
				tasks: ['jshint'],
				options: {
					livereload: true
				}
			},
			css: {
				files: ['app/css/*.less'],
				tasks: ['less']
			},
			livereload: {
				options: {
					livereload: '<%= connect.options.livereload %>'
				},
				files: [
					'app/{,*/}*.html',
					'app/css/{,*/}*.css',
					'app/js/{,*/}*.js',
					'app/img/{,*/}*.{gif,jpeg,jpg,png,svg,webp}',
				]
			}

		},
		
		
        connect: {
            options: {
                port: 9000,
                livereload: 35729,
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '.tmp',
                        'app'
                    ]
                }
            },
            test: {
                options: {
					hostname: 'localhost',
                    base: [
                        '.tmp',
                        'test',
                        'app'
                    ]
                }
            },
            dist: {
                options: {
                    open: true,
                    base: 'build',
                    livereload: false
                }
            }
        },
		
		
		clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        'build/',
                    ]
                }]
            },
            server: '.tmp'
        },
		
		
		jshint: {
            options: {
                jshintrc: '.jshintrc',
            },
            all: [
                'app/js/*.js',
            ]
        },
		
		
		// Mocha testing framework configuration options
        mocha: {
            all: {
                options: {
                    run: true,
					timeout: 5000,
                    urls: ['http://localhost/mygrunt/app/index.html']
                }
            }
        },
		

        // Automatically inject Bower components into the HTML file
        'bower-install': {
            app: {
                html: 'app/index.html',
                ignorePath: 'app/'
            }
        },

		
		// Renames files for browser caching purposes
        rev: {
            dist: {
                files: {
                    src: [
                        'build/js/{,*/}*.js',
                        'build/css/{,*/}*.css',
                        'build/img/{,*/}*.{gif,jpeg,jpg,png,webp}',
                        'build/css/fonts/{,*/}*.*'
                    ]
                }
            }
        },

		
		useminPrepare: {
            options: {
                dest: 'build',
               /* flow: {
                  steps: {'js' : ['concat'], 'css': ['concat', 'cssmin'] },
                }*/
            },

            html: 'app/index.html'
        },
		
		
        usemin: {
            options: {
                assetsDirs: ['build'],
            },
            html: ['build/{,*/}*.html'],
            css: ['build/css/{,*/}*.css']
        },

		
		
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'app/img',
                    src: '{,*/}*.{gif,jpeg,jpg,png}',
                    dest: 'build/img'
                }]
            }
        },
		
		
		htmlmin: {
            dist: {
                options: {
                    /*collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeCommentsFromCDATA: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true*/
					removeComments:true
                },
                files: [{
                    expand: true,
                    cwd: 'build',
                    src: '{,*/}*.html',
                    dest: 'build'
                }]
            }
        },
		
		
		less: {
			main: {
				files: {
				  "app/css/style.css": "app/css/style.less"
				}
			}

		},
		
		
		// Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: 'app',
                    dest: 'build',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        'img/{,*/}*.svg',
                        '*.html',
                        //'css/style.css',
                        'js/modernizr.js',
                        'fonts/*'
                    ]
                }]
            },

        },
		
		
		// Generates a custom Modernizr build that includes only the tests you
        // reference in your app
        modernizr: {
            devFile: 'app/components/modernizr/modernizr.js',
            outputFile: 'app/js/modernizr.js',

            extra: {
                'shiv' : true,
                'printshiv' : false,
                'load' : true,
                'mq' : false,
                'cssclasses' : true
            },
            extensibility: {
                'addtest': true,
                'prefixed': false,
                'teststyles': false,
                'testprops': false,
                'testallprops': false,
                'hasevents': false,
                'prefixes': false,
                'domprefixes': false
            },
            files: [
                'app/js/{,*/}*.js',
                'app/css/{,*/}*.css',
            ],
            uglify: true
        },
		
		
		'ftp-deploy': {
			build: {
				auth: {
				  host: '',
				  port: 21,
				  authKey: ''
				},
				src: 'build',
				dest: ''	
			}
		},

        includereplace: {
            dist: {
               // expand: true,
               // dot: true,
               options: {
                   //includesDir: 'app/parts/',
               },
               
               files: [{
                    expand: true,
                    dot: true,
                    cwd: 'app/parts',
                    dest: 'app/',
                    src: '*.html',
                }]
            }
        },




    });

	
   

    //Register tasks
		
		//Start serve (RUN)
		grunt.registerTask('dev', [
			'modernizr',
            'clean:server',
            'connect:livereload',
            'watch'	
		]);
		
		//Test
		//.....
		
		//Create build
		grunt.registerTask('default', [
			'clean:dist',
            'modernizr',
			'less',
			'useminPrepare',
			'concat',
			'cssmin',
			'uglify',
			'copy',
			//'rev',
			'usemin',
			//'htmlmin',
			'imagemin'
		]); 
		
		//Public
		grunt.registerTask('pub', [
			'ftp-deploy'
		]); 
	

};