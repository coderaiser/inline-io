(function() {
    'use strict';
    
    var cheerio     = require('cheerio'),
        path        = require('path'),
        url         = require('url'),
        Util        = require('util-io'),
        files       = require('files-io'),
        
        Template    = '<style>{{ name }}\n</style>';
    
    module.exports = function(html, base, callback) {
        var dom,
            names   = [],
            links   = [];
        
        Util.checkArgs(arguments, ['html']);
        
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
                    links.forEach(function(params) {
                        var el      = params.element,
                            name    = params.name,
                            data    = files[name],
                            style   = Util.render(Template, {
                                name: data
                            });
                        
                        
                        el.replaceWith(style);
                    });
                    
                    html = dom.html();
                }
                
                callback(error, html);
            });
    };
    
    function isStyle(el) {
        var rel = el.attr('rel'),
            is  = rel === 'stylesheet';
            
        return is;
    }
        
    function isLocal(href) {
        return href && !url.parse(href).hostname;
    }
})();
