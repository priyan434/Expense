const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
    'expensetracker',
    'root',
    'root',
     {
       host: 'localhost',
       dialect: 'mysql'
     }
   );
   
   
   sequelize.authenticate().then(() => {
      console.log('Connection has been established successfully.');
   }).catch((error) => {
      console.error('Unable to connect to the database: ', error);
   });

const Book = sequelize.define("books", {
   title: {
     type: DataTypes.STRING,
     allowNull: false
   },
   author: {
     type: DataTypes.STRING,
     allowNull: false
   },
   release_date: {
     type: DataTypes.DATEONLY,
   },
   subject: {
     type: DataTypes.INTEGER,
   }
});


sequelize.sync().then(() => {
   console.log('Book table created successfully!');
   Book.create({
    title: "Clean Code2",
    author: "Robert Cecil Martin2",
    release_date: "2022-12-14",
    subject: 4
}).then(res => {
    console.log(res)
}).catch((error) => {
    console.error('Failed to create a new record : ', error);
});
Book.findAll().then(res => {
    console.log(res)
}).catch((error) => {
    console.error('Failed to retrieve data : ', error);
});

}).catch((error) => {
   console.error('Unable to create table : ', error);
});