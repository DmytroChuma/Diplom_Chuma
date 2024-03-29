const con = require('../config/db_connector');

class Area{
    constructor(square, unit, relief, soil, river, lake, info) {
        this.square = square;
        this.unit = unit;
        this.relief = relief;
        this.soil = soil;
        this.river = river;
        this.lake = lake;
        this.info = info;
    }
    
    async create(){
        let result = await con.execute(`SELECT relief.id as relief, soil.id as soil FROM relief, soil WHERE relief.name = "${this.relief}" AND soil.name = "${this.soil}"`);
        const { relief, soil } = result[0];
        
        let sql = `
        INSERT INTO area(
            square,
            unit,
            relief,
            soil,
            river,
            lake,
            info
        )
        VALUES(
            '${this.square}',
            '${this.unit}',
            "${relief}",
            "${soil}",
            '${this.river}',
            '${this.lake}',
            '${this.info}'
        ) 
        `;
            
        con.execute(sql);
    }

    static async update(square, unit, reliefName, soilName, river, lake, info){
        let result = await con.execute(`SELECT relief.id as relief, soil.id as soil FROM relief, soil WHERE relief.name = "${reliefName}" AND soil.name = "${soilName}"`);
        const { relief, soil } = result[0];

        let sql = `
            UPDATE area SET square = '${square}',
            unit = '${unit}',
            relief = '${relief}',
            soil = '${soil}',
            river = '${river}',
            lake = '${lake}'
            WHERE info = '${info}'
        `
        con.execute(sql)
    }
}
module.exports = Area;