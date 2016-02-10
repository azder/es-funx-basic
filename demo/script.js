/**
 * Created by azder on 2016-02-09.
 */

jQuery($ => {

    'use strict'; // ALWAYS


    const $ol = $('<ol></ol>').insertAfter('#jquery');

    $.get('data.json')

     .then(people => {
         for (let person of people) {
             $ol.append(`<li>${person.firstName} ${person.lastName}: ${person.theme}</li>`);
         }
         return people;
     })

     .then(people => {
         $ol.after(`<p> count: ${people.length}</p>`)
     });

});


jQuery($ => {

    'use strict'; // ALWAYS

    const litem = a => `<li>${a.firstName} ${a.lastName}: ${a.theme}</li>`;
    const len = xs => xs.length;
    const paragraph = xs => `<p> count: ${len(xs)}</p>`;

    const $ol = $('<ol></ol>').insertAfter('#lodash');

    $.get('data.json')

     .then(people =>
         _.map(people, _.flowRight($ol.append.bind($ol), litem)) // _.compose() in underscore.js
     )

     .then(people =>
         $ol.after(paragraph(people))
     );

});


jQuery($ => {

    'use strict'; // ALWAYS

    const { map, compose } = R;

    const litem = a => `<li>${a.firstName} ${a.lastName}: ${a.theme}</li>`;
    const len = xs => xs.length;
    const paragraph = c => `<p> count: ${c}</p>`;

    const $ol = $('<ol></ol>').insertAfter('#ramda');


    $.get('data.json')
     .then(map(compose($ol.append.bind($ol), litem)))
     .then(compose($ol.after.bind($ol), paragraph, len))
    ;

});

jQuery($ => {

    'use strict'; // ALWAYS

    const curry = (fn, ...args) =>
            args.length >= fn.length
                ? fn(...args) // jshint ignore:line
                : curry.bind(null, fn, ...args)
        ;

    const map = curry((fn, obj)=>obj.map(fn));
    const compose = (...args) => arg => args.reduceRight((x, fn) => fn(x), arg);
    const len = xs => xs.length;

    const apply = curry((f, args) => f.apply(void 0, args));
    const litem = curry((firstName, lastName, theme) => `<li>${firstName} ${lastName}: ${theme}</li>`);

    const val = curry((object, key) => object[key]);
    const pick = curry((keys, object) => map(val(object), keys));

    const paragraph = c => `<p> count: ${c}</p>`;

    const $ol = $('<ol></ol>').insertAfter('#vanilla');
    const append$ = item => $ol.append(item);
    const after$ = item => $ol.after(item);

    $.get('data.json')
     .then(map(compose(apply(litem), pick(['firstName', 'lastName', 'theme']))))
     .then(map(append$))
     .then(compose(paragraph, len))
     .then(after$)
    ;


});


jQuery($ => {

    'use strict'; // ALWAYS

    ///// generic functions

    const { map, compose, flow, apply, pick, len } = window.L;

    ///// business logic

    const litems = map(compose(
        apply((first, last, theme) => `<li>${first} ${last}: ${theme}</li>`),
        pick(['firstName', 'lastName', 'theme'])
    ));

    const total = compose(c => `<p> count: ${c}</p>`, len);

    const $el = (() => { // this can be refactored into a class
        const $ol = $('<ol></ol>');
        return {
            insertAfter$: selector => $ol.insertAfter(selector),
            append$:      item => $ol.append(item),
            after$:       item => $ol.after(item)
        }
    })();


    ///// side effects

    $el.insertAfter$('#library');

    $.get('data.json').then(flow(
        litems,
        map($el.append$),
        total,
        $el.after$
    ));

});
