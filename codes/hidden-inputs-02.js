// from http://jsbin.com/yoyip/edit?js

let daysThisMonth = () => {
    let date = new Date(),
        y = date.getFullYear(),
        m = date.getMonth(),
        start = new Date(y, m, 1),
        end = new Date(y, m + 1, 1);
    return (end - start) / (1000 * 60 * 60 * 24 );
};

const kalendae = (year, month) => new Date(year, month, 1);

const daysInMonth = (year, month) =>( kalendae(year, month) - kalendae(year, month - 1) ) / ( 1000 * 60 * 60 * 24 );


console.log(daysThisMonth(), daysInMonth( (new Date()).getFullYear()));
