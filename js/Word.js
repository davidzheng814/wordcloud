(function (wc, $) {
    'use strict';
    
    // frequency of 1 corresponds to least frequent word, standardize all other frequencies in terms of this quantity
    
    wc.Word = function(text, frequency) {
        this.id = text.replace(/\W+/g, "_");
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
    
    _.render = function(id) {
        var randomColor = '#' + Math.floor(Math.random() *(1<<24) ).toString(16);
        $('#' + id).append('<div style="color:' + randomColor + '; align-content:space-around; position:relative; padding: 0em 0.05em 0em 0.05em; display:inline-block; width:' + this.width + '; height:' + this.height + '"id=' + this.id + '>' + this.text + '</div>');
    }
    
    _.animate = function(leastFrequency) {
        var denominator = 1 + Math.exp(1.5 - Math.log(this.frequency / leastFrequency));
        var scale = 3 / denominator;
        $('#' + this.id).animate({width: scale * this.width + 'px', height: scale * this.height + 'px', fontSize: scale + 'em', opacity: 1 / denominator}, {duration: 1000});
    }
    
    _.animateOut = function() {
        $('#' + this.id).animate({left: -this.width, top: -this.height, fontSize: '2em', opacity: 0}, {duration: 500});
    }

})(wc, jQuery);