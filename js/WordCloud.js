(function (wc) {
    'use strict';
    
    wc.WordCloud = function(words, frequencies, leastFrequency, maxWords, wordsPerRow) {
        this.words = [];
        for (var i = 0, ii = words.length; i < ii; i++) {
            this.words.push(new wc.Word(words[i], frequencies[i]));
        }
        this.leastFrequency = leastFrequency;
        this.maxWords = maxWords;
        this.wordsPerRow = wordsPerRow;
        
    };
    
    var _ = wc.WordCloud.prototype;
    
    _.update = function(newFrequencies) {
        if (words.length == 0) {
            // first batch of data coming in
            var first = wc.WordCloud.getMaxNElementsInDictionary(newFrequencies, this.maxWords);
            first = wc.WordCloud.shuffle(first);
            var leastFrequency = first[0][1];
            for (var i = 0, ii = first.length; i < ii; i++) {
                var frequency = first[i][1];
                this.words.push(new wc.Word(first[i][0], frequency));
                if (frequency < leastFrequency) {
                    leastFrequency = frequency;
                }
            }
            this.render();
            this.animate();
        } else {
            // need to update most frequent words
            for (var i = 0, ii = this.words.length; i < ii; i++) {
                var existingWord = words[i].text;
                var existingFrequency = frequencies[i];
                existingFrequency--; // older words need to expire at some point
                
                // merge
                if (existingWord in newFrequencies) {
                    newFrequencies[existingWord] = newFrequencies[existingWord] + existingFrequency;
                } else {
                    newFrequencies[existingWord] = existingFrequency;
                }
                
                // get new words
                var next =  wc.WordCloud.getMaxNElementsInDictionary(newFrequencies, this.maxWords);
                next = wc.WordCloud.shuffle(next);
                
                var allIndices = [];
                var updatedIndices = [];
                var unupdatedIndicesInNext = [];
                var leastFrequency = next[0][1];
                for (var i = next.length - 1; i >= 0; i--) {
                    var word = next[i][0];
                    var frequency = next[i][1];
                    var index = this.words.indexOf(word);
                    if (index != -1) {
                        this.words[i].setFrequency(frequency);
                        updatedIndices.push(index);
                    } else {
                        unupdatedIndicesInNext.push(index);
                    }
                    
                    if (frequency < leastFrequency) {
                        leastFrequency = frequency;
                    }
                    allIndices.push(i);
                }
                
                // need to replace indices [0..this.words.length] - [updatedIndices]
                var indicesToBeReplaced = $(allIndices).not(updatedIndices).get();
                for (var i = 0, ii = indicesToBeReplaced.length; i < ii; i++) {
                    var word = unupdatedIndicesInNext[i][0];
                    var frequency = unupdatedIndicesInNext[i][1];
                    this.replace(indicesToBeReplaced[i], word, frequency);
                }
                this.animate();
            }
        }
    }
    
    _.render = function() {
        var width = $(window).innerWidth();
        var height = $(window).innerHeight();
        var lineHeight = wc.WordCloud.getHeight('A');
        var numRows = 0;
        for (var i = 0, ii = this.words.length; i < ii; i++) {
            if (i % wordsPerRow == 0) {
                numRows++;
                wc.WordCloud.addTempTag('temp_wordcloud_' + numRows, width / 4, numRows * lineHeight);
            }
            this.words[i].render('temp_wordcloud_' + numRows);
        }
    }
    
    _.replace = function(index, newWordText, newFrequency) {
        var oldWord = this.words[index];
        var newWord = new wc.Word(newWordText, newFrequency);
        this.words[index] = newWord;
        
        $('#' + oldWord.id).fadeOut('slow', function() {
            var randomColor = '#' + Math.floor(Math.random() *(1<<24) ).toString(16);
            
            // two jerky moments - one when the old word settles down to fade out, the other when the old word gets replaced and everything shifts over
            console.log(wc.WordCloud.getWidth(oldWord.text));
            $('#' + oldWord.id).replaceWith('<div style="opacity:0; color:' + randomColor + '; align-content:space-around; position:relative; padding: 0px 3px 0px 3px; display:inline-block; width:' + wc.WordCloud.getWidth(newWord.text) + '; height:' + wc.WordCloud.getHeight(newWord.text) + '"id=' + newWord.id + '>' + newWord.text + '</div>');
            var initialOpacity = 1 / (1 + Math.exp(1.5 - Math.log(newFrequency / this.leastFrequency)));
            $('#' + newWord.id).fadeTo('slow', initialOpacity);
        });
    }
    
    _.animate = function() {
        for (var i = 0, ii = this.words.length; i < ii; i++) {
            this.words[i].animate(this.leastFrequency);
        }
    }
    
    wc.WordCloud.addTempTag = function(id, x, y) {
        var width = $(window).innerWidth();
        var height = $(window).innerHeight();
        var lineHeight = wc.WordCloud.getHeight('A');
        $('body').append('<div id = "' + id + '" style = "position:relative; display:block; padding: 0.045em 0em 0.045em 0em; white-space:nowrap; width:' + width / 2 + '; height:' + lineHeight + '; left:' + x + '; top:' + y + '"></div>');
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
    
    wc.WordCloud.getMaxNElementsInDictionary = function(dict, N) {
        var items = Object.keys(dict).map(function(key) {
            return [key, dict[key]];
        });

        items.sort(function(first, second) {
            return second[1] - first[1];
        });
        
        return items.slice(0, N);
    }
    
    wc.WordCloud.shuffle = function(array) {
        var currentIndex = array.length, temp, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            temp = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temp;
        }
        return array;
    }
})(wc);