const { DataTypes } = require("sequelize");
const sequelize = require("./db");

const Currency = sequelize.define("Currency", {
  currency_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  currency_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  currency_code: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

const Users = sequelize.define("User", {
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  baseCurrency: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Currencies',
      key: 'currency_id'
    }
  },
  profile_url: {
    type: DataTypes.STRING
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

const Expenses = sequelize.define("Expense", {
  exp_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: 'user_id'
    }
  },
  date: {
    type: DataTypes.DATE,
  },
  expense: {
    type: DataTypes.STRING,
  },
  currency_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Currencies',
      key: 'currency_id'
    }
  },
  amount: {
    type: DataTypes.INTEGER
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
 

});

const SplitExpense = sequelize.define('SplitExpense', {
  split_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  exp_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Expenses',
      key: 'exp_id'
    }
  },
  to_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'user_id'
    }
  },
  split_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  isActive:{
    type:DataTypes.BOOLEAN,
    defaultValue:true
  }
}, {
  tableName: 'SplitExpenses'
});

// const UserExpenses = sequelize.define('UserExpenses', {
//   id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   exp_id: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     references: {
//       model: 'Expenses',
//       key: 'exp_id',
//     },
//   },
//   user_id: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     references: {
//       model: 'Users',
//       key: 'user_id',
//     },
//   },
//   borrowed_amount: {
//     type: DataTypes.DECIMAL(10, 2),
//     defaultValue: 0,
//   },
//   lent_amount: {
//     type: DataTypes.DECIMAL(10, 2),
//     defaultValue: 0,
//   },
//   isActive: {
//     type: DataTypes.BOOLEAN,
//     defaultValue: true,
//   },
// }, {
//   tableName: 'UserExpenses',
// });



sequelize.sync().then(() => {

  
}).then(() => {
  console.log('synced connected');
}).catch((error) => {
  console.error('not synced ', error);
});


// const deleteCount =  Expenses.destroy({
//   where: {
//     user_id: 243560,
    
//   }
// });

module.exports = { Users, Currency, Expenses, sequelize,SplitExpense }