// from http://jsbin.com/yoyip/edit?js

let daysThisMonth = () => {
    let date = new Date(),
        y = date.getFullYear(),
        m = date.getMonth(),
        start = new Date(y, m, 1),
        end = new Date(y, m + 1, 1);
    return (end - start) / (1000 * 60 * 60 * 24 );
};

let daysInMonth = (y, m) =>
    (new Date(y, m, 1) - new Date(y, m - 1, 1) ) / (1000 * 60 * 60 * 24 );


