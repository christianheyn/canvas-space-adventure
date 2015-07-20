/*jslint node: true, unparam: true, todo: true */
/*globals module */
module.exports = function (grunt) {
    'use strict';

    /**
     * List of files grunt should copy from bower_components in vendor-directorys
     *
     * @type {Array}
     */
    var getVendorFiles = function (targetFile) {
        var jsonObj,
            vendor,
            key,
            value,
            componentDir,
            src,
            result = {
                js: [],
                css: []
            },
            i = 0,
            /**
             * Push files in array by extension
             * 
             * @param {String} filename
             */
            pushByType = function (filename) {
                if (filename.search(/\.css|\.less|\.sass|\.scss$/) >= 0) {
                    result.css.push(filename);
                } else if (filename.search(/\.js$/) >= 0) {
                    result.js.push(filename);
                }
            };
        if (grunt.file.exists(targetFile)) {
            jsonObj = grunt.file.readJSON(targetFile);
            if (jsonObj && jsonObj.vendor) {
                vendor = jsonObj.vendor;
                for (key in vendor) {
                    if (vendor.hasOwnProperty(key)) {
                        value = vendor[key];
                        componentDir = 'bower_components/' + key + '/';
                        if (grunt.file.exists(componentDir)) {
                            if (typeof value === 'string') {
                                // Copy one file
                                src = componentDir + value;
                                if (grunt.file.isFile(src)) {
                                    pushByType(src);
                                }
                            } else if (Array.isArray(value)) {
                                // Copy files by given array
                                for (i = value.length - 1; i >= 0; i -= 1) {
                                    src = componentDir + value[i];
                                    if (grunt.file.isFile(src)) {
                                        pushByType(src);
                                    }
                                }
                            }
                        } else {
                            grunt.log.writeln().error('The bower folder ' + componentDir + ' was not found!');
                        }
                    }
                }
            }
        }
        return result;
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            development: {
                options: {
                    paths: ['style']
                },
                files: {
                    'style/style.css': [
                        'style/vendor/*.css',
                        'style/main.less'
                    ]
                }
            }
        },
        cssmin: {
            combine: {
                files: {
                    'style/style.css': [
                        'style/style.css'
                    ]
                }
            }
        },
        concat: {
            options: {
                separator: ';',
            },
            dist: {
                src: [
                    'js/vendor/*.js',
                    'js/*.js',
                    'js/**/*.js',
                    '!js/script.min.js'
                ],
                dest: 'js/script.min.js',
            },
        },
        uglify: {
            'js/script.min.js': {
                files: {
                    'js/script.min.js': [
                        'js/vendor/*.js',
                        'js/partials/*.js',
                        'js/vendor/**/*.js',
                        'js/partials/**/*.js',
                        '!js/script.min.js'
                    ]
                }
            }
        },
        bower: {
            // both options to prevent another lib folder
            install: {
                options: {
                    copy: false
                }
            },
            update: {
                options: {
                    copy: false
                }
            }
        },
        watch: {
            scripts: {
                files: [
                    'js/*.js',
                    'js/**/*.js',
                    '!js/script.min.js'
                ],
                tasks: ['concat'],
                options: {
                    spawn: false
                }
            },
            stylesheets: {
                files: ['style/*.less', 'style/**/*.less'],
                tasks: ['less'],
                options: {
                    spawn: false
                }
            }
        }
    });

    // Load npm tasks
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-concat');

    // Register tasks
    grunt.task.registerTask('createBowerJson', 'create bower.json', function () {
        var packageJson = grunt.file.readJSON('package.json'),
            bowerJson = packageJson['bower.json'];
        grunt.file.write('bower.json', JSON.stringify(bowerJson));
    });
    grunt.task.registerTask('vendor', 'Copy files from "bower_components" to vendor-folders.', function () {
        var vendorFiles = getVendorFiles('bower.json'),
            i = vendorFiles.css.length - 1,
            j = vendorFiles.js.length - 1,
            filename;
        // Create vendor-folder if not exist
        if (!grunt.file.isDir('style/vendor')) {
            grunt.file.mkdir('style/vendor');
        }
        if (!grunt.file.isDir('js/vendor')) {
            grunt.file.mkdir('js/vendor');
        }
        // copy files to vendor
        for (i; i >= 0; i -= 1) {
            filename = vendorFiles.css[i].split('/').pop();
            grunt.file.copy(vendorFiles.css[i], 'style/vendor/' + filename);
            grunt.log.writeln().ok('succesfully integrated ' + filename + ' to style/vendor.');
        }
        for (j; j >= 0; j -= 1) {
            filename = vendorFiles.js[j].split('/').pop();
            grunt.file.copy(vendorFiles.js[j], 'js/vendor/' + filename);
            grunt.log.writeln().ok('succesfully integrated ' + filename + ' to js/vendor.');
        }
    });
    grunt.registerTask('default', ['createBowerJson', 'bower:install', 'vendor', 'less']);
    grunt.registerTask('update', ['createBowerJson', 'bower:update', 'vendor', 'less', 'concat']);
    grunt.registerTask('build', ['createBowerJson', 'bower:update', 'vendor', 'less', 'cssmin', 'concat', 'uglify']);
};