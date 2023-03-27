function transliterate(text) {
    let map = {'а' : 'a', 'б' : 'b', 'в' : 'v', 'г' : 'g', 'ґ' : 'g', 'д' : 'd', 'е' : 'e', 'є' : 'ye', 
    'ж' : 'zh', 'з' : 'z', 'и' : 'y', 'і' : 'i', 'ї' : 'yi', 'й' : 'y', 'к' : 'k', 'л' : 'l', 'м' : 'm',
    'н' : 'n', 'о' : 'o', 'п' : 'p', 'р' : 'r', 'с' : 's', 'т' : 't', 'у' : 'u', 'ф' : 'f', 'х' : 'h',
    'ц' : 'ts', 'ч' : 'ch', 'ш' : 'sh', 'щ' : 'sht', 'ю' : 'yu', 'я' : 'ya'};

    var replacechars = function(c){
        return map[c] || c;
    };

    text = text.toLowerCase().replace('ь', '').replace("'", '').replace("\\", '');
    let slug = text.split('').map(replacechars).join('').replace(/[\W_]+/g,"-");
    return slug;
}

module.exports.transliterate = transliterate;