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
        con.execute(sql);
    }
    
    static async login(login, password){
        let sql = `
            SELECT id, first_name, last_name, password, avatar, select_post, permission, agency FROM user WHERE phone = '${login}' OR email = '${login}'
        `;

        let res = await con.execute(sql)

        if (res.length > 0) {
            if (bcrypt.compareSync(password, res[0].password)) {
                return {status: 1,
                        id: res[0].id,
                        name: res[0].first_name + " " + res[0].last_name,
                        avatar: res[0].avatar,
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
            SELECT id, first_name, last_name, avatar, select_post, permission, agency FROM user WHERE remember_token = '${token}'
        `;
        let res = await con.execute(sql)
        if (res.length > 0) {
            return {status: 1,
                id: res[0].id,
                name: res[0].first_name + " " + res[0].last_name,
                avatar: res[0].avatar,
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
}

module.exports = User;