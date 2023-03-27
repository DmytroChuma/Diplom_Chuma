function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function morph(count, array) {
    var cases = [2, 0, 1, 1, 1, 2];
    return array[(count % 100 > 4 && count % 100 < 20) ? 2 : cases[(count % 10 < 5) ? count % 10 : 5]];
}

module.exports.capitalize = capitalize;
module.exports.morph = morph;