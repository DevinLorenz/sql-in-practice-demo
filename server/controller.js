const { DATABASE_URL } = process.env

const Sequelize = require('sequelize')

const sequelize = new Sequelize(DATABASE_URL,{
    dialect:'postgres',
    dialectOptions : {
        ssl: {
            rejectUnauthorized:false
        }
    }
});


const userId = 11
const clientId = 5


module.exports = {
    getUserInfo: (req,res) => {
        sequelize.query(`
          select * from cc_users cu
          join cc_clients cc
          on cu.user_id = cc.user_id
          where cu.user_id = ${userId}
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))
    },

    updateUserInfo: (req,res) => {
        let { firstName, lastName, phoneNumber, email, address, city, state, zipCode } = req.body
        sequelize.query(`
            update cc_users set first_name = '${firstName}', last_name = '${lastName}', phone_number = ${phoneNumber}, email = '${email}', address = '${address}', city = '${city}', state = '${state}', zip_code = ${zipCode}
            where user_id = ${userId};

            update cc_clients set address = '${address}', 
            city = '${city}', 
            state = '${state}', 
            zip_code = ${zipCode}
            where client_id = ${clientId};
        `)
        .then(dbRes => console.log(dbRes))
        .catch(err => console.log(err))
    },

    getUserAppt: (req,res) => {
        sequelize.query(`
            select * from cc_appointments
            where client_id = ${clientId}
            order by date desc
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))
    },

    requestAppointment: (req,res) => {
        const { date, service } = req.body
        sequelize.query(`
            insert into cc_appointments (client_id, date, service_type, notes, approved, completed)
            values (${clientId}, '${date}', '${service}', '', false, false)
            returning *        
        `)
        
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))
    }

}


