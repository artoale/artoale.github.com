/*jslint node:true*/
module.exports = function (grunt) {
    'use strict';
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jekyll');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.initConfig({
        watch: {
            options: {
                livereload: true
            },
            compass: {
                files: ['app/sass/*.{sass,scss}'],
                tasks: ['compass:dev']
            },
            jekyll: {
                files: ['app/**.{html,md}'],
                tasks: ['jekyll:dev']
            }
        },
        compass: {
            build: {
                options: {
                    sassDir: 'build/sass',
                    cssDir: 'build/css',
                    force: true //                   raw: 'preferred_syntax = :sass\n' // Use `raw` since it's not directly available
                }
            },
            dev: {
                options: {
                    sassDir: 'app/sass',
                    cssDir: '.tmp_style/css'
                }
            }
        },
        jekyll: {
            dev: {
                options: {
                    src: 'app',
                    dest: '.tmp',
                    raw: "exclude: ['sass']\n"
                }
            },
            build: {
                options: {}
            }
        },
        connect: {
            livereload: {
                options: {
                    port: 5000,
                    base: ['.tmp', '.tmp_style']
                }
            },
            build: {
                options: {
                    port: 5000,
                    base: ['_site'],
                    keepalive: true
                }
            }
        },
        clean: {
            dev: ['.tmp', '.tmp_style'],
            build: ['_site', 'build']
        },
        copy: {
            build: {
                files: [
                    {
                        expand: true,
                        cwd: 'app/',
                        src: ['**'],
                        dest: 'build/'
                    }
                ]
            }
        }


    });

    grunt.registerTask('server', [
        'clean:dev',
        'jekyll:dev',
        'compass:dev',
        'connect:livereload',
        'watch'
    ]);
    
    grunt.registerTask('build', [
        'clean:build',
        'copy:build',
        'compass:build'
    ]);
    
    grunt.registerTask('all', [
        'build',
        'jekyll:build',
        'connect:build'
    ]);

};