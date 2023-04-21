const con = require('../config/db_connector');

exports.create = (user, text, agency = 0) => {
    let sql = `
        INSERT INTO user_message (user, text, agency, accepted) VALUE ('${user}', '${text}', ${agency}, '0')
    `
    con.execute(sql)
}

exports.createMulti = (users, text, ignoreUser) => {
    let arr = [];
    for (let user of users) {
        if (ignoreUser === user.id) continue;
        let a = [];
        a.push(user.id);
        a.push(text);
        a.push('0');
        a.push('0');
        arr.push(a);
    }
    if (arr.length === 0) return
    let sql = `
    INSERT INTO user_message (user, text, agency, accepted) VALUE ?
`
con.query(sql, [arr])
}

exports.delete = (message) => {
    let sql = `
        DELETE FROM user_message WHERE id = '${message}'
    `
    con.execute(sql)
}

exports.reject = (message) => {
    let sql = `
        UPDATE user_message SET accepted = '2' WHERE id = '${message}'
    `
    con.execute(sql)
}

exports.accept = (message) => {
    let sql = `
        UPDATE user_message SET accepted = '1' WHERE id = '${message}'
    `
    con.execute(sql)
}