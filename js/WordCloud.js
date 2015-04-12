(function (wc) {
    'use strict';
    
    wc.WordCloud = function(words, frequencies) {
        this.words = [];
        for (var i = 0, ii = words.length; i < ii; i++) {
            this.words.push(new wc.Word(words[i], frequencies[i]));
        }
    };
    
    var _ = wc.WordCloud.prototype;
    
    _.render = function() {
        var width = $(window).innerWidth();
        var height = $(window).innerHeight();
        for (var i = 0, ii = this.words.length; i < ii; i++) {
            this.words[i].render();
        }
    }
    
    _.animate = function() {
        for (var i = 0, ii = this.words.length; i < ii; i++) {
            this.words[i].animate();
        }
    }
    
    wc.WordCloud.addTempTag = function() {
        var width = $(window).innerWidth();
        var height = $(window).innerHeight();
        $('body').append('<div id = "temp" style = "position:relative; display:block; white-space:pre-line; width:' + width / 2 + '; height:' + height / 2 + '; left:' + width / 4 + '; top:' + height / 4 + '"></div>');
    }

    wc.WordCloud.calculateWordDimensions = function(text) {
        var div = document.createElement('div');
        div.setAttribute('class', 'textDimensionCalculation');
        $(div).text(text);
        document.body.appendChild(div);

        var dimensions = {width: jQuery(div).outerWidth(), height: jQuery(div).outerHeight()};

        div.parentNode.removeChild(div);
        return dimensions;
    }

    wc.WordCloud.getWidth = function(text) {
        return wc.WordCloud.calculateWordDimensions(text).width;
    }

    wc.WordCloud.getHeight = function(text) {
        return wc.WordCloud.calculateWordDimensions(text).height;
    }
})(wc);