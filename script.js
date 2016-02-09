/**
 * Created by azder on 2016-02-06.
 */


(function (W) {

    'use strict'; // ALWAYS

    var config = {

        // Synchronous XMLHttpRequest on the main thread is deprecated because of its detrimental effects
        // to the end user's experience. For more help http://xhr.spec.whatwg.org/

        // this one causes a synchronous ajax
        // sourceUrl: 'presentation.md',

        ratio: '16:10',

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

    };

    // workaround for syncronous script loading

    jQuery(function onLoad($) {

        $.get('README.md').then(function then(data) {
            $('#source').html(data);
            W.slideshow = W.remark.create(config);
        });

    });

}(window));
