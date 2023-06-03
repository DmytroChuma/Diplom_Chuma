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
        console.log(this.logo)
        if (this.logo) {
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

    static async update(id, logo, name, region, city, description, phones, emails, oldLogo) {
        let regionId = await con.execute(`SELECT id FROM region WHERE region = '${region}'`);

        const fs = require('fs');
        let image = '';
        if (logo) {
            fs.rename('./public/'+logo, `./public/images/agency/${logo.split('/')[1]}`, function (err) {
                if (err) {
                    console.log(err)
                }  
            })
            image = `logo = '${logo.split('/')[1]}',` 
        }
        else {
            image = '';
        }
 
        if (oldLogo !== '') {
            try {
                fs.unlinkSync('./public/images/agency/'+oldLogo);
            }catch(error){console.log(error)}
        }

        let phonesArr = [];
        let phoneArr = JSON.parse(phones);
        for (let phone of phoneArr) {
            phonesArr.push(phone.phone)
        }

        let emailsArr = [];
        let emailArr = JSON.parse(emails);
        for (let email of emailArr) {
            emailsArr.push(email.email)
        }

        let sql = `
            UPDATE agency SET name = '${name}', region = '${regionId[0].id}', ${image} city = '${city}', phones = '${phonesArr.join(',')}', emails = '${emailsArr.join(',')}', description = '${description}'
            WHERE id = '${id}'
        `
   
        con.execute(sql)
    }

    static delete (id) {
        let sql = `
            DELETE FROM agency WHERE id = '${id}'
        `
        con.execute(sql)
    }

    static async getRandomAgency () {
        let sql = `
            SELECT id, name, logo FROM agency ORDER BY RAND() LIMIT 4
        `
        return await con.execute(sql)
    }

    static async getAgencies (page) {
        let limit = (page-1)*10;
        if (isNaN(limit)){
            limit = 0;
        }
        let sql = `
            SELECT agency.id, agency.name, agency.logo, region.region, agency.city, agency.description FROM agency, region WHERE agency.region = region.id ORDER BY agency.id LIMIT ${limit}, 10
        `
        let count = `
            SELECT COUNT(*) as count FROM agency
        `
        return {agencies: await con.execute(sql), count: await con.execute(count)}
    }

    static async checkOwner (id) {
        let sql = `
            SELECT id FROM user WHERE id = '${id}' AND permission = '2' 
        `
        return await con.execute(sql)
    }
}

module.exports = Agency;