export function num_word(value, words){
    value = Math.abs(value) % 100;
    var num = value % 10;
    if(value > 10 && value < 20) return words[2];
    if(num > 1 && num < 5) return words[1];
    if(num === 1) return words[0];
    return words[2];
}

export function extendNumber () {
    Number.prototype.toStringWithSubUnits = function (length) {

        if (!length) {
            return this;
        }

        const stringSource  = this.toString();
        const a = stringSource.slice(0, stringSource.length - 2);
        const b = stringSource.slice(stringSource.length - 2, stringSource.length);

        return parseFloat(a + "." + b);
    }
}