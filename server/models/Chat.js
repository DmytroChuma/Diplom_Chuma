const con = require('../config/db_connector');

class Chat{
    static async generateInboxRoom(id, user){
        let inbox = await con.execute(`
            SELECT inbox.inbox_id, inbox_participants.user_id
            FROM inbox_participants,  inbox
            WHERE inbox_participants.user_id != '${id}' AND inbox.id = inbox_participants.inbox_id
            GROUP BY inbox_participants.inbox_id 
            HAVING COUNT(*) = 1;`)
        if (inbox.length > 0) {
            for (let i = 0; i < inbox.length; i++) {
                if (inbox[i].user_id === user) {
                    return inbox[i].inbox_id
                }
            }
        }

        let sql = `
            INSERT INTO inbox (inbox_id) VALUES (UUID());
        `;
        let result = con.execute(sql);
        const inboxId  = await result.then(result => result.insertId);

        sql = `
        INSERT INTO inbox_participants (inbox_id, user_id) VALUES ('${inboxId}', '${id}'), ('${inboxId}', '${user}')
        `;

        con.execute(sql);
        let inb = await con.execute(`SELECT inbox_id FROM inbox WHERE id = '${inboxId}'`)
 
        return inb[0].inbox_id
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
        return await con.execute(sql);
    }

    static async getMessages(inbox_id) {
        let sql = `
            SELECT messages.id, messages.message, messages.date, messages.file, messages.user_id, messages.answear, m1.message as answear_message, user.avatar 
            FROM inbox, user, messages
            LEFT JOIN messages as m1 ON m1.id = messages.answear
            WHERE user.id = messages.user_id AND inbox.id = messages.inbox_id AND inbox.inbox_id = '${inbox_id}'
            ORDER BY messages.date ASC;
        `;
        return await con.execute(sql);
    }

    static async createMessage(user, message, inbox, answear, file = ''){
        let sql = `
            INSERT INTO messages 
            (inbox_id, user_id, message, date, answear, file) 
            VALUES 
            (
                (SELECT id FROM inbox WHERE inbox_id = '${inbox}'), 
                '${user}', 
                '${message.replace("'", '\'')}', 
                NOW(),
                ${answear},
                '${file}'
            )
        `;
        let result = con.execute(sql);
        const id  = await result.then(result => result.insertId);
        return id;
    }

    static deleteMessage(id, file) {
        if (file && file !== '') {
            const fs = require('fs');
            fs.unlinkSync('./public/files/' + file);
        }

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