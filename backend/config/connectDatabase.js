const mongoose = require('mongoose')
const connectDatabase = () => {
    mongoose.connect(process.env.ATLAS_URL).then(() => {
        console.log("DB Connected Successfully")
    })
        .catch((error) => {
            console.log("ERROR in DB Connection:", error);
        })

}
module.exports = connectDatabase;