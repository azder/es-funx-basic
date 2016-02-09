'use strict'; // ALWAYS

const updatesDOM = () => {


    const teaser = (size, elements) => setText(elements, substring(0, size, text(elements)));
    map(teaser(50), select('p'));
    //    ^ mutation

};

const merelyCalculates = ()=> {


    const teaser = substring(0);
    map(compose(setText, teaser(50), text), select('p'));
    //            ^ mutation

};


function compose() {
}
function select() {
}
function text() {
}
function substring() {
}
function setText() {
}
