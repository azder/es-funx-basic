/**
 * Created by azder on 2016-02-09.
 */

window.L = (() => {

    'use strict'; // ALWAYS

    const curry = (fn, ...args) =>
            args.length >= fn.length
                ? fn(...args) // jshint ignore:line
                : curry.bind(null, fn, ...args)
        ;

    const map = curry((fn, obj)=>obj.map(fn));
    const compose = (...args) => arg => args.reduceRight((x, fn) => fn(x), arg);
    const flow = (...args) => arg => args.reduce((x, fn) => fn(x), arg);
    const len = xs => xs.length;

    const apply = curry((f, args) => f.apply(void 0, args));

    const val = curry((object, key) => object[key]);
    const pick = curry((keys, object) => map(val(object), keys));

    return {
        curry,
        map,
        compose,
        flow,
        len,
        apply,
        val,
        pick
    };


})();
