const con = require('../config/db_connector');

class Flat{
    constructor(dwelling_type, rooms, floor, wall, heating, plan, multi, furniture, mansard, square, l_square, state, electricity, gas, water, info) {
        this.dwelling_type = dwelling_type;
        this.rooms = rooms;
        this.floor = floor;
        this.wall = wall;
        this.heating = heating;
        this.plan = plan;
        this.multi = multi;
        this.furniture = furniture;
        this.mansard = mansard;
        this.square = square;
        this.l_square = l_square;
        this.state = state;
        this.electricity = electricity;
        this.gas = gas;
        this.water = water;
        this.info = info
    }   
    
    async create(){
        let result = await con.execute(`
        SELECT wall_type.id as wall, realty_state.id as state, communication.id as electricity,
        (SELECT id FROM communication WHERE name = '${this.gas}') as gas,
        (SELECT id FROM communication WHERE name = '${this.water}')as water 
        FROM wall_type, realty_state, communication
        WHERE wall_type.name = '${this.wall}' AND realty_state.name = '${this.state}' AND communication.name = '${this.electricity}' `);
        const { wall, state, electricity, gas, water } = result[0];

        let sql = `
            INSERT INTO flat(
                type,
                rooms_count,
                floor_count,
                wall,
                heating,
                plan,
                multi,
                furniture,
                mansard,
                general_square,
                living_square,
                state,
                electricity,
                gas,
                water,
                info
            )
            VALUES (
                '${this.dwelling_type}',
                '${this.rooms}',
                '${this.floor}',
                '${wall}',
                '${this.heating}',
                '${this.plan}',
                '${this.multi}',
                '${this.furniture}',
                '${this.mansard}',
                '${this.square}',
                '${this.l_square}',
                '${state}',
                '${electricity}',
                '${gas}',
                '${water}',
                '${this.info}'
            )
        `;

        con.execute(sql);
    }

    static async update(dwelling_type, rooms, floor, wallName, heating, plan, multi, furniture, mansard, square, l_square, stateName, electricityName, gasName, waterName, info){

        let result = await con.execute(`
        SELECT wall_type.id as wall, realty_state.id as state, communication.id as electricity,
        (SELECT id FROM communication WHERE name = '${gasName}') as gas,
        (SELECT id FROM communication WHERE name = '${waterName}')as water 
        FROM wall_type, realty_state, communication
        WHERE wall_type.name = '${wallName}' AND realty_state.name = '${stateName}' AND communication.name = '${electricityName}' `);
        const { wall, state, electricity, gas, water } = result[0];

        let sql = `
            UPDATE flat SET type = '${dwelling_type}',
            rooms_count = '${rooms}',
            floor_count = '${floor}',
            wall = '${wall}',
            heating = '${heating}',
            plan = '${plan}',
            multi = '${multi}',
            furniture = '${furniture}',
            mansard = '${mansard}',
            general_square = '${square}',
            living_square = '${l_square}',
            state = '${state}',
            electricity = '${electricity}',
            gas = '${gas}',
            water = '${water}'
            WHERE info = '${info}'
        `
        con.execute(sql);
    }
}

module.exports = Flat;