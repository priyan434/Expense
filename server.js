const mongoose = require('mongoose');
const app=require('./app')
const uri="mongodb://localhost:27017/test"
mongoose.connect(uri)
    .then(() => {

        const port=3000
        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
        })
});

