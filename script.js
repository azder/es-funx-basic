/**
 * Created by azder on 2016-02-06.
 */


(function (W) {

    'use strict'; // ALWAYS

    W.slideshow = W.remark.create({

        ratio: '16:9',

        navigation: {
            scroll: false,
            touch:  false,
            click:  false
        },

        slideNumberFormat: '%current%',// of %total%',

        // Enable or disable counting of incremental slides in the slide counting
        countIncrementalSlides: false,
        highlightLanguage:      'javascript',
        highlightStyle:         'idea',
        highlightLines:         true,
        highlightSpans:         false

    });

}(window));
