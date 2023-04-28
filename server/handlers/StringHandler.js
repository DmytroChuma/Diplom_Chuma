function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function morph(count, array) {
    if (count % 100 >= 5 && count %100 <= 20) {
        return array[2]
    }
    else if (count % 10 === 1){
        return array[0]
    }
    else {
        return array[1]
    }
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