(function (wc, $) {
    'use strict';
    
    // frequency of 1 corresponds to least frequent word
    
    wc.Word = function(text, frequency) {
        this.text = text;
        this.width = wc.WordCloud.getWidth(text);
        this.height = wc.WordCloud.getHeight(text);
        this.frequency = frequency;
    }

    var _ = wc.Word.prototype;
    
    _.getFrequency = function(f) {
        return this.frequency;
    }
    
    _.setFrequency = function(f) {
        this.frequency = f;
    }
    
    _.render = function() {
        $('#temp').append('<div style="align-content:space-around; position:relative; padding: 0px 3px 0px 3px; display:inline-block; width:' + this.width + '; height:' + this.height + '"id=' + this.text + '>' + this.text + '</div>');
    }
    
    _.animate = function() {
        var denominator = 1 + Math.exp(1.5 - Math.log(this.frequency));
        var scale = 3 / denominator;
        $('#' + this.text).animate({width: scale * this.width + 'px', height: scale * this.height + 'px', fontSize: scale + 'em', opacity: 1 / denominator}, {duration: 2000});
    }

})(wc, jQuery);