const con = require('../config/db_connector');

class Advertisement {
    constructor(realty_type, advert_type, region, city, district, street,
                position, description, price, currency, auction, proposition, files) {
        this.realty_type = realty_type;
        this.advert_type = advert_type;
        this.region = region.replace("'", "\\'");
        this.city = city.replace("'", "\\'");
        this.district = district.replace("'", "\\'");
        this.street = street.replace("'", "\\'");
        this.position = position;
        this.description = description.replace("'", "\\'");
        this.price = price;
        this.currency = currency;
        this.auction = auction;
        this.proposition = proposition;
        this.files = files;
    }
    
    async addNewAdvertisement() {
        const fs = require('fs');
        let region = await con.execute(`SELECT id FROM region WHERE region = '${this.region}'`);
         
        let Slug = require("../handlers/Slug");
        let slug = Slug.transliterate(`${this.realty_type} ${this.advert_type} ${this.street} ${this.city}`);
        
        let res = await con.execute(`SELECT slug FROM info WHERE slug LIKE '${slug}%'`);
        if (res.length > 0) {
            slug = slug + '-' + res.length;
        }

        fs.mkdir(`./public/${slug}`, (err) => {
            if (err) {
                return console.error(err);
            }
            else {
                this.files.forEach(element => {
                    fs.rename('./public/'+element, `./public/${slug}/${element.split('/')[1]}`, function (err) {
                        if (err) throw err
                    })
                });
            }
        });

        let sql = `
        INSERT INTO info(
            realtyType,
            advertisementType,
            region,
            city,
            district,
            street,
            position,
            description,
            price,
            currency,
            auction,
            proposition,
            date,
            slug
        )
        VALUES(
            '${this.realty_type}',
            '${this.advert_type}',
            '${region[0].id}',
            '${this.city}',
            '${this.district}',
            '${this.street}',
            '${this.position}',
            '${this.description}',
            '${this.price}',
            '${this.currency}',
            '${this.auction}',
            '${this.proposition}',
            NOW(),
            '${slug}'
        )
        `;

        let result = con.execute(sql);
        const id  = await result.then(result => result.insertId);
 
        return id;
    }

    static addToArchive(slug) {
        let sql = `
            UPDATE info SET archive = '1' WHERE slug = '${slug}'
        `;

        con.execute(sql);
    }

    static publicate(slug) {
        let sql = `
            UPDATE info SET archive = '0' WHERE slug = '${slug}'
        `;

        con.execute(sql);
    }

    static delete(slug) {
        let sql = `
            DELETE FROM info WHERE slug = '${slug}'
        `;

        con.execute(sql);
    }

    static addView(id) {
        let sql = `
            UPDATE info SET views = views + 1 WHERE id = '${id}'
        `;
        con.execute(sql)
    }

    static addPhone(id) {
        let sql = `
            UPDATE info SET phones = phones + 1 WHERE id = '${id}'
        `;
        con.execute(sql)
    }

    static addSelect (id, type) {
        let operation = 'info.select + 1';
        if (type === 0){
            operation = 'info.select - 1'
        }
        let sql = `
            UPDATE info SET info.select = ${operation} WHERE id = '${id}'
        `;
        con.execute(sql)
    }
}

module.exports = Advertisement;