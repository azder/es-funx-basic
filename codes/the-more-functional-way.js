/**
 * Created by azder on 2015-12-27.
 */


'use strict'; // ALWAYS

/// run by using:
// node --harmony_rest_parameters

/////////////// functional setup

let slice = Function.prototype.call.bind(Array.prototype.slice);
let concat = Function.prototype.call.bind(Array.prototype.concat);

let nil = value=> null === value || void 0 === value;

let either = (left, right) => nil(left) ? right : left;

let curry = (fn, ...args) =>
    args.length >= fn.length
        ? fn(...args)
        : curry.bind(null, fn, ...args);

let map = curry((fn, obj)=>obj.map(fn));

let first = a => nil(a) ? void 0 : (Array.isArray(a) ? a[0] : a);
let last = a => nil(a) ? void 0 : (Array.isArray(a) ? a[a.length - 1] : a);

let rcomp = (...args) => arg => args.reduceRight((x, fn) => fn(x), arg);
let lcomp = (...args) => arg => args.reduce((x, fn) => fn(x), arg);

let prop = curry((key, object) => object[key]);

let assign = curry((key, value, object) => {
    object[key] = value;
    return object;
});

let zipWith = curry((fn, array1, array2) =>
    array1.length < array2.length
        ? reduce(
        [],
        (memo, a1item, index)=>concat(memo, fn(a1item, array2[index])),
        array1
    )
        : reduce(
        [],
        (memo, a2item, index)=>concat(memo, fn(a2item, array1[index])),
        array2
    )
);

/////////////////// specific functions

let dclone = data => JSON.parse(JSON.stringify(data));
let o2a = (keys, object) => keys.map(key=>object[key]);
let tkeys = object => Object.keys(object).filter(key=>!!object[key]);
let idxof = curry((test, array) => array.findIndex(test));
let fromidxof = curry((test, start, array) => start + array.slice(start).findIndex(test));
let ahas = curry((test, array) => -1 < idxof(test, array));
let eq = curry((v1, v2) => v1 === v2);
let gte = curry((v1, v2)=> v1 >= v2);
let reduce = curry((init, fn, array) => array.reduce(fn, init));
let elem = curry((index, array)=>array[index]);

let push = (array, item) => {
    let a = dclone(array);
    a.push(item);
    return a;
};

////////////// inputs

// List of all fragments in order
let
    fragmentIds = [
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'g',
        'h',
        'i',
        'j'
    ];

// A map of fragment data
let fragments = {
    a: {id: 'a', type: 'heading', level: 1},
    b: {id: 'b', type: 'paragraph'},
    c: {id: 'c', type: 'paragraph'},
    d: {id: 'd', type: 'heading', level: 1},
    e: {id: 'e', type: 'paragraph'},
    f: {id: 'f', type: 'paragraph'},
    g: {id: 'g', type: 'heading', level: 2},
    h: {id: 'h', type: 'paragraph'},
    i: {id: 'i', type: 'heading', level: 1},
    j: {id: 'j', type: 'paragraph'}
};

// A list of chunks of fragments to be rendered at once
let chunks = [{
    id:    'a', // ID of first fragment in chunk
    index: 0, // Index of first fragment in chunk
    size:  4, // Number of fragments in chunk
    skip:  [] // A list of ranges of fragments to NOT render
}, {
    id:    'e',
    index: 4,
    size:  6,
    skip:  []
}];

// A map of collapsed headings
let collapsed = {
    d: true // Heading d is collapsed
};


let calcSkipped = (chunks, ids, fragments, collapsed) => {

    const frags = reduce(
        dclone(o2a(ids, fragments)),

        (frags, id) => {

            const index = idxof(eq(id), map(prop('id'), frags));
            const level = prop('level', elem(index, frags));
            const end = fromidxof(gte(level), index + 1, map(prop('level'), frags));

            // with mutation
            //return slice(frags,index, end).map(assign('hidden', true));

            // without mutation (at lest to the originals)
            return concat(
                slice(frags, 0, index + 1),
                dclone(slice(frags, index + 1, end)).map(assign('hidden', true)),
                slice(frags, end)
            );

        },

        tkeys(collapsed)
    );

    return zipWith(
        assign('skip'),
        dclone(chunks),
        map(
            map(s => s.length ? [first(s), last(s)] : []),

            map(chunk=> {

                const start = prop('index', chunk);
                const size = prop('size', chunk);

                return reduce(
                    [],
                    (memo, item, index)=>
                        item.hidden
                            ?
                            push(
                                slice(memo, 0, -1),
                                push(either(last(memo), []), index)
                            )
                            :
                            memo
                    ,
                    dclone(slice(frags, start, start + size))
                );

            }, dclone(chunks))
        )
    );

};

// calculate
const result = calcSkipped(chunks, fragmentIds, fragments, collapsed);

// display in JSON
console.log(JSON.stringify(result, null, 4));

/////////// Should return
[{
    id:    'a',
    index: 0,
    size:  4,
    skip:  []
}, {
    id:    'e',
    index: 4,
    size:  6,
    skip:  [[0, 4]]
}];

/////////// But returns

[
    {
        "id":    "a",
        "index": 0,
        "size":  4,
        "skip":  []
    },
    {
        "id":    "e",
        "index": 4,
        "size":  6,
        "skip":  [
            [
                0,
                3
            ]
        ]
    }
];

