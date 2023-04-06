function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function morph(count, array) {
    var cases = [2, 0, 1, 1, 1, 2];
    return array[(count % 100 > 4 && count % 100 < 20) ? 2 : cases[(count % 10 < 5) ? count % 10 : 5]];
}

function formatDate (date) {
    date = new Date(Date.parse(date));
    const yyyy = date.getFullYear();
    let mm = date.getMonth() + 1;
    let dd = date.getDate();
        
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
        
    return dd + '.' + mm + '.' + yyyy;
  }

module.exports.capitalize = capitalize;
module.exports.morph = morph;
module.exports.formatDate = formatDate;