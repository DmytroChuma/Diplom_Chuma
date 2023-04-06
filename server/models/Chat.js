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
            SELECT inbox.inbox_id, user.first_name, user.last_name, user.avatar, (SELECT CONCAT_WS(',',messages.message,messages.date,messages.file ) as message 
                                                                                FROM messages 
                                                                                WHERE messages.inbox_id = inbox.id 
                                                                                ORDER BY messages.date DESC 
                                                                                LIMIT 0, 1 ) as message
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
            SELECT messages.id, messages.message, messages.date, messages.file, messages.user_id, messages.answear, m1.message as answear_message, user.avatar 
            FROM inbox, user, messages
            LEFT JOIN messages as m1 ON m1.id = messages.answear
            WHERE user.id = messages.user_id AND inbox.id = messages.inbox_id AND inbox.inbox_id = '${inbox_id}'
            ORDER BY messages.date ASC;
        `;
        let result = await con.execute(sql);
        return result;
    }

    static async createMessage(user, message, inbox, answear){
        let sql = `
            INSERT INTO messages 
            (inbox_id, user_id, message, date, answear) 
            VALUES 
            (
                (SELECT id FROM inbox WHERE inbox_id = '${inbox}'), 
                '${user}', 
                '${message.replace("'", '\'')}', 
                NOW(),
                ${answear}
            )
        `;
        let result = con.execute(sql);
        const id  = await result.then(result => result.insertId);
        return id;
    }

    static deleteMessage(id) {
        let sql = `
            DELETE FROM messages WHERE id = '${id}'
        `;
        con.execute(sql);
    }

    static updateMessage(message, id) {
        let sql = `
            UPDATE messages SET message = '${message.replace("'", '\'')}' WHERE id = '${id}'
        `;
        con.execute(sql);
    }
}

module.exports = Chat;