(function() {
    'use strict';
    
    var cheerio     = require('cheerio'),
        path        = require('path'),
        url         = require('url'),
        check       = require('checkup'),
        files       = require('files-io');
    
    module.exports = function(html, base, callback) {
        var dom,
            names   = [],
            links   = [];
        
        check(arguments, ['html', 'callback']);
        
        if (!callback) {
            callback    = base;
            base        = null;
        }
        
        dom = cheerio.load(html);
        
        if (!base)
            base    = process.cwd();
        
        dom('link').each(function(idx, element) {
            var el          = dom(element),
                href        = el.attr('href'),
                name        = path.join(base, href),
                itsStyle    = isStyle(el),
                itLocal     = isLocal(href);
            
            if (itsStyle && itLocal) {
                links.push({
                    name    : name,
                    element : el
                });
                
                names.push(name);
            }
        });
        
        if (!names.length)
            callback(null, html);
        else
            files.read(names, 'utf8', function(error, files) {
                var html;
                
                if (!error) {
                    changelinks(links, files);
                    html = dom.html();
                }
                
                callback(error, html);
            });
    };
    
    function changelinks(links, files) {
        links.forEach(function(params) {
            var el      = params.element,
                name    = params.name,
                data    = files[name],
                style   = '<style>' + data + '\n</style>';
            
            el.replaceWith(style);
        });
    }
    
    function isStyle(el) {
        var rel = el.attr('rel'),
            is  = rel === 'stylesheet';
            
        return is;
    }
        
    function isLocal(href) {
        return href && !url.parse(href).hostname;
    }
})();
