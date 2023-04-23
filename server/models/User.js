const con = require('../config/db_connector');
const stringHandler = require('../handlers/StringHandler');
const bcrypt = require("bcrypt");
 

class User{
    constructor(first, last, number, password, email) {
        this.first = stringHandler.capitalize(first.toLowerCase());
        this.last = stringHandler.capitalize(last.toLowerCase());
        this.number = number;
        this.password = password;
        this.email = email;
    }

    async create() {
        let pass = bcrypt.hashSync(this.password, 10);

        let sql = `
            INSERT INTO user(
                first_name,
                last_name,
                phone,
                email,
                password
            )
            VALUES (
                '${this.first}',
                '${this.last}',
                '${this.number}',
                '${this.email}',
                '${pass}'
            )
        `;
        return await con.execute(sql).then(result => result.insertId);
    }
    
    static async login(login, password){
        let sql = `
            SELECT id, first_name, last_name, email, password, avatar, select_post, permission, agency FROM user WHERE phone = '${login}' OR email = '${login}'
        `;

        let res = await con.execute(sql)

        if (res.length > 0) {
            if (bcrypt.compareSync(password, res[0].password)) {
                return {status: 1,
                        id: res[0].id,
                        name: res[0].first_name + " " + res[0].last_name,
                        avatar: res[0].avatar,
                        email: res[0].email,
                        select: res[0].select_post,
                        permission: res[0].permission,
                        agency: res[0].agency
                        };
            }
        }
        return {status: 0};
    }

    static async loginAuth (token) {
        let sql = `
            SELECT id, first_name, last_name, email, avatar, select_post, permission, agency FROM user WHERE remember_token = '${token}'
        `;
        let res = await con.execute(sql)
        if (res.length > 0) {
            return {status: 1,
                id: res[0].id,
                name: res[0].first_name + " " + res[0].last_name,
                avatar: res[0].avatar,
                email: res[0].email,
                select: res[0].select_post,
                permission: res[0].permission,
                agency: res[0].agency
                };
        }
        return {status: 0};
    }

    static setToken(id, token){
        let sql = `
            UPDATE user SET remember_token = '${token}' WHERE id = '${id}'
        `;
        con.execute(sql);
    }

    static setSelect (id, select) {
        let sql = `
            UPDATE user SET select_post = '${select}' WHERE id = '${id}'
        `;
        con.execute(sql);
    }

    static setPermission (id, permission) {
        let sql = `
            UPDATE user SET permission = '${permission}' WHERE id = '${id}'
        `
        con.execute(sql);
    }

    static async getInfo (id) {
        let sql = `
            SELECT first_name, last_name, phone, email, avatar, permission, region, city, description FROM user WHERE id = '${id}' 
        `;
        let res = await con.execute(sql)
        if (res[0]) {
            return {
                name: res[0].first_name,
                surname: res[0].last_name,
                phone: res[0].phone,
                email: res[0].email,
                avatar: res[0].avatar,
                permission: res[0].permission,
                region: res[0].region,
                city: res[0].city,
                description: res[0].description
            }
        }
        return false;
    }

    static setAgency (user, agency) {
        let sql = `
            UPDATE user SET agency = '${agency}' WHERE id = '${user}'
        `;
        con.execute(sql)
    }

    static async getRealtors (agencyId) {
        let sql = `
            SELECT id, first_name, last_name, phone, avatar, description
            FROM user
            WHERE agency = '${agencyId}'
        `;
        return await con.execute(sql)
    }

    static async getRealtor (id) {
        let sql = `
            SELECT user.first_name, user.last_name, user.phone, user.email, user.avatar, user.region, user.city, user.description, user.likes, user.dislikes, agency.id, agency.name, agency.logo,
            (SELECT count(*) from user as u WHERE u.agency = user.agency) as count 
            FROM user, agency
            WHERE user.agency = agency.id AND user.id = '${id}' AND user.permission > 0
        `;
        return await con.execute(sql)
    }

    static updateUser(id, fName, lName, phone, email, avatar, region, city, description, oldAvatar, defaultAvatar){
        const fs = require('fs');
        let image = '';
        if (avatar) {
            fs.rename('./public/'+avatar, `./public/users/${avatar.split('/')[1]}`, function (err) {
                if (err) {
                    console.log(err)
                }  
            })
            image = `avatar = '${avatar.split('/')[1]}',` 
        }
        else {
            image = '';
        }
        if (defaultAvatar) {
            image = `avatar = '',`
        }
 
        if (oldAvatar !== '') {
            try {
                fs.unlinkSync('./public/users/'+oldAvatar);
            }catch(error){}
        }

        let sql = `
            UPDATE user SET first_name = '${fName}', last_name = '${lName}', phone = '${phone}',
            email = '${email}', ${image} region = '${region}', city = '${city}', description = '${description}'
            WHERE id = '${id}'
        `;
        con.execute(sql)
    }

    static async getCards (id) {
        let sql = `
        SELECT DISTINCT agency.id, agency.logo, agency.name, 
        (SELECT COUNT(*) FROM info WHERE user = user.id AND archive = 0) as publicated, 
        (SELECT COUNT(*) FROM info WHERE user = user.id AND archive = 1) as archivated 
        FROM info, user LEFT JOIN agency ON agency.id = user.agency 
        WHERE user.id = '${id}'
        `
        return await con.execute(sql)
    }

    static change(id, pass) {
        let password = bcrypt.hashSync(pass, 10);
        let sql = `
            UPDATE user SET password = '${password}' WHERE id = '${id}'
        `
        con.execute(sql)
    }

    static changePass (email, pass) {
        let password = bcrypt.hashSync(pass, 10);
        let sql = `
            UPDATE user SET password = '${password}' WHERE email = '${email}'
        `
        con.execute(sql)
    }

    static leave(id){
        let sql = `
            UPDATE user SET permission = '0', agency = '0' WHERE id = '${id}'
        `
        con.execute(sql)
    }

    static deleteAgency (id) {
        let sql = `
            UPDATE user SET agency = '0', permission = '0' WHERE agency = '${id}'
        `
        con.execute(sql);
    }

    static async getUserForInvite (data) {
        let sql = `
            SELECT id, first_name, last_name, email FROM user WHERE email = '${data}' OR phone = '${data}'
        `
        return await con.execute(sql)
    }

    static async checkUserInAgency (id) {
        let sql = `SELECT id FROM user WHERE id = ${id} AND agency != 0`
        return await con.execute(sql)
    }

    static async checkInvite (id, agency) {
        let sql = `SELECT id FROM user_message WHERE user = '${id}' AND agency = '${agency}' AND accepted = '0'`
        return await con.execute(sql)
    }

    static async getMessage (id) {
        let sql = `SELECT id, text, agency, accepted, user FROM user_message WHERE user = '${id}' ORDER BY id DESC`
        return await con.execute(sql)
    }

    static async accept (id, agency) {
        let sql = `UPDATE user SET permission = '1', agency = '${agency}' WHERE id = '${id}'`
        return await con.execute(sql)
    }

    static async find (phone) {
        let sql = `
            SELECT id FROM user WHERE phone = '${phone}'
        `
        return await con.execute(sql)
    }
}

module.exports = User;