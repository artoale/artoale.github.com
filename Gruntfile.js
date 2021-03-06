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
                files: ['sass/*.{sass,scss}'],
                tasks: ['compass:dev']
            },
            jekyll: {
                files: ['**/*.{html,md,markdown}'],
                tasks: ['jekyll:dev']
            }
        },
        compass: {
            build: {
                options: {
                    sassDir: 'sass',
                    cssDir: 'css',
                    force: true //                   raw: 'preferred_syntax = :sass\n' // Use `raw` since it's not directly available
                }
            },
            dev: {
                options: {
                    sassDir: 'sass',
                    cssDir: '.tmp_style/css',
//                    config: 'compass.rb',
//                    raw: 'sass_options = {:sourcemap => true}',
                    force: true
                }
            }
        },
        jekyll: {
            dev: {
                options: {
                    src: '.',
                    dest: '.tmp',
                    drafts: true,
                    raw: ['permalink: pretty', 'markdown: redcarpet', 'pygments: true', 'redcarpet:', '    extensions: ["no_intra_emphasis", "fenced_code_blocks", "autolink", "tables",     "with_toc_data"]'].join('\n')
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
                    hostname : '*',
                    base: ['.tmp', '.tmp_style', 'static']
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
            build: ['css', 'fonts', 'img']
        },
        copy: {
            build: {
                files: [
                    {
                        expand: true,
                        cwd: 'static/',
                        src: ['**'],
                        dest: './'
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
