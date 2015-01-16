#!/usr/bin/env node

(function() {
    'use strict';
    
    var inline      = require('..'),
        
        fs          = require('fs'),
        path        = require('path'),
        
        argv        = process.argv.slice(2),
        arg         = argv[0];
    
    if (/^(-v|--version)$/.test(arg))
        version();
    else if (!arg || /^(-h|--help)$/.test(arg))
        help();
    else
        main(arg);
    
    function main(name) {
        fs.readFile(name, 'utf8', function(error, data) {
            var dir = path.dirname(name);
            
            e(error) || inline(data, dir, function(error, data) {
                e(error) || console.log(data);
            });
        });
    }
    
    function e(error) {
        if (error)
            console.error(error.message);
        
        return error;
    }
    
    function version() {
        console.log('v' + info().version);
    }
    
    function info() {
        return require('../package');
    }
    
    function help() {
        var usage       = 'Usage: ' + info().name + ' <file>';
            
        console.log(usage);
    }
})();
