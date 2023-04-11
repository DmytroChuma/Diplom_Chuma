const con = require('../config/db_connector');

class Agency{
    constructor(logo, name, region, city, description, phones, emails, user) {
        this.logo = logo;
        this.name = name;
        this.region = region;
        this.city = city;
        this.description = description;
        this.phones = phones;
        this.emails = emails;
        this.user = user;
    }

    async create () {
        const fs = require('fs');
        let region = await con.execute(`SELECT id FROM region WHERE region = '${this.region}'`);
 
        if (this.logo !== 'null') {
            fs.rename('./public/'+this.logo, `./public/images/agency/${this.logo.split('/')[1]}`, function (err) {
                if (err) throw err
            })
            this.logo = this.logo.split('/')[1]
        }
        else {
            this.logo = '';
        }

        let phones = [];
        let phoneArr = JSON.parse(this.phones);
        for (let phone of phoneArr) {
            phones.push(phone.phone)
        }

        let emails = [];
        let emailsArr = JSON.parse(this.emails);
        for (let email of emailsArr) {
            emails.push(email.email)
        }
        
        let sql = `
            INSERT INTO agency
            (
                owner,
                name,
                region,
                city,
                phones,
                emails,
                description,
                logo
            )
            VALUES
            (
                '${this.user}',
                '${this.name}',
                '${region[0].id}',
                '${this.city}',
                '${phones.join(',')}',
                '${emails.join(',')}',
                '${this.description}',
                '${this.logo}'
            )
        `;
        let result = con.execute(sql);
        const id  = await result.then(result => result.insertId);
 
        return id;
    }

    static async getInfo(id) {
        let sql = `
            SELECT agency.name, region.region, agency.city, agency.phones, agency.emails, agency.description, agency.logo
            FROM agency, region
            WHERE agency.region = region.id AND agency.id = ${id}
        `;

        let result = await con.execute(sql)
        if (!result[0])
            return false;
        return result[0]
    }
}

module.exports = Agency;