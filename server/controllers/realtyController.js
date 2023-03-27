const con = require('../config/db_connector');

exports.loadHouseInfo = async (req, res) => {
    let rows = await con.execute("SELECT '1' as type, name  FROM wall_type UNION SELECT '2' as type, name FROM roof UNION SELECT '3' as type, name FROM realty_state UNION SELECT '4' as type, name FROM communication");
    let walls = [];
    let roof = [];
    let state = [];
    let comm = [];
    rows.forEach(row => {
      switch(row.type){
        case '1':
          walls.push(row.name);
          break;
        case '2':
          roof.push(row.name);
          break;
        case '3':
          state.push(row.name);
          break;
        case '4':
          comm.push(row.name);
          break;
      }
    })
  
    res.json(JSON.stringify({wall: walls,
              roof: roof,
              state: state,
              comm: comm}));
} 

exports.loadAreaInfo = async (req, res) => {
    let rows = await con.execute("SELECT '1' as type, name  FROM soil UNION SELECT '2' as type, name FROM relief");
    let soil = [];
    let relief = [];
    rows.forEach(row => {
        switch(row.type){
        case '1':
            soil.push(row.name);
            break;
        case '2':
            relief.push(row.name);
            break;
        }
    });
    res.json(JSON.stringify({
        soil: soil,
        relief: relief}));
}

exports.loadGarageInfo = async (req, res) => {
    let rows = await con.execute("SELECT '1' as type, name  FROM garage_wall UNION SELECT '2' as type, name FROM garage_roof UNION SELECT '3' as type, name FROM realty_state UNION SELECT '4' as type, name FROM communication UNION SELECT '5' as type, name FROM garage_type UNION SELECT '6' as type, name FROM garage_floor");
    let walls = [];
    let roof = [];
    let floor = [];
    let type = [];
    let state = [];
    let comm = [];
    rows.forEach(row => {
      switch(row.type){
        case '1':
          walls.push(row.name);
          break;
        case '2':
          roof.push(row.name);
          break;
        case '3':
          state.push(row.name);
          break;
        case '4':
          comm.push(row.name);
          break;
        case '5':
          type.push(row.name);
          break;
        case '6':
          floor.push(row.name);
          break;
      }
    });
    res.json(JSON.stringify({wall: walls,
                            roof: roof,
                            state: state,
                            comm: comm,
                            floor: floor,
                            type: type}));
}

exports.loadRegion = async (req, res) =>{
    let rows = await con.execute("SELECT city FROM region WHERE region ='"+req.params.reg.substring(1)+"'");
    res.json({cities: rows[0].city.split(",")});
}