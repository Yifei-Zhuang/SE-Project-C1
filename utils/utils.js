const a = {
    addPrefix0: (totalsize = 10, number) => {
        let a = toString(number);
        a.padStart(totalsize, 0);
        return a;
    }
}
module.exports = a;