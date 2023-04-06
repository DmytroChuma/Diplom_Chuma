const con = require('../config/db_connector');

class Chat{
    static async generateInboxRoom(data){
        let sql = `
            INSERT INTO inbox (inbox_id) VALUES (UUID());
        `;
        let result = con.execute(sql);
        const id  = await result.then(result => result.insertId);

        let values = [];
        /* 
            for (data.users) {
                let arr = [];
                arr.push(id)
                arr.push(user.id)
                values.push(arr)
            }
        */

        sql = `
        INSERT INTO inbox_participants (inbox_id, user_id) VALUES ?
        `;

        con.execute(sql, [values]);

    }

    static async getChats(user_id) {
        let sql = `
            SELECT inbox.inbox_id, user.first_name, user.last_name, user.avatar
            FROM inbox_participants, user, inbox
            WHERE inbox_participants.user_id != '${user_id}' AND user.id = inbox_participants.user_id AND inbox.id = inbox_participants.inbox_id
            GROUP BY inbox_participants.inbox_id 
            HAVING COUNT(*) = 1;
        `;
        let result = await con.execute(sql);
        return result;
    }

    static async getMessages(inbox_id) {
        let sql = `
            SELECT messages.id, messages.message, messages.date, messages.file, messages.user_id, user.avatar 
            FROM messages, inbox, user 
            WHERE user.id = messages.user_id AND inbox.id = messages.inbox_id AND inbox.inbox_id = '${inbox_id}';
        `;
        let result = await con.execute(sql);
        return result;
    }
}

module.exports = Chat;