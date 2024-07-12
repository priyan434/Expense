// let obj={
//     exp_id:"",
//     amount:"",
//     user_id:"",
//     expense:""
// }
// let fields=Object.keys(obj)
// console.log(fields);
// let updates=fields.map((ele)=> `${ele}=?`).join(',')
// let values=fields.map(ele=>obj[ele])
// console.log(updates);
// values.push(1)
// console.log(values);

const { v4: uuidv4 } = require('uuid');
const { sequelize, Users } = require('./database/user.model');

// const uuid=uuidv4()
// console.log(uuid.length);

exports.register = async (req, res) => {
    console.log("register");
    const { username, email, password, basecurrency, profile_url } = req.body;
    const user_id = "243554";
  
    try {
      const existingUser = await Users.findOne({ where: { email: email, isActive: 1 } });
  
      if (existingUser) {
        return res.status(400).send("User with this email already exists");
      }
  
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      const newUser = await Users.create({
        user_id: user_id,
        username: username,
        email: email,
        password: hashedPassword,
        b_curr_id: basecurrency,
        profile_url: profile_url,
        isActive: true,
      });
  
      if (newUser) {
        const payload = {
          userId: user_id,
          username,
          email,
          basecurrency,
          profile_url,
        };
        const token = genAuthtoken(payload);
  
        return res.status(200).json({ message: "User registered successfully", token });
      } else {
        return res.status(400).send("Registration failed");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).send("Server error");
    }
  };
  
// sequelize.sync().then(() => {
//   console.log('Tables created!');
//   return Expenses.bulkCreate([
//     {  user_id: 12442, date:"2024/07/10", expense:"movies",amount:100,currency_id:1},
//     { user_id: 12442, date:"2024/07/10", expense:"movies",amount:100,currency_id:1},
//   ]);
// }).then(() => {
//   console.log('Dummy data inserted into  expeneses table!');
// }).catch((error) => {
//   console.error('Unable to create table or insert data: ', error);
// });
// const SplitExpenses = sequelize.define("splitExpenses", {
//   split_id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     primaryKey: true
//   },
//   exp_id: {
//     type: DataTypes.INTEGER,
//     references: {
//       model: 'expenses',
//       key: "exp_id",
//     }
//   },
//   user_id: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     references: {
//       model: "users",
//       key: 'user_id'
//     }
//   },
//   amount: {
//     type: DataTypes.INTEGER
//   },
//   isActive: {
//     type: DataTypes.BOOLEAN,
//     defaultValue: true
//   }
// });


// async function createExpenseSplits(expenseId, paidUserId=243560, totalAmount) {
//   try {
    
//     const expense = await Expenses.findByPk(expenseId);
//     if (!expense) {
//       throw new Error('Expense not found');
//     }

    
//     const numUsersToSplit = 2; 


//     const splitAmount = totalAmount / numUsersToSplit;

    
//     await SplitExpenses.create({
//       exp_id: expenseId,
//       from_user_id: paidUserId,
//       to_user_id: 12432, // Replace with actual user ID
//       split_amount: splitAmount
//     });

//     // If paid user contributes, create a split for them as well
//     if (paidUserId !== 12432) { // Replace 4567 with actual user ID for paid user
//       await SplitExpense.create({
//         exp_id: expenseId,
//         from_user_id: paidUserId,
//         to_user_id: paidUserId,
//         split_amount: totalAmount - splitAmount // Paid user covers remaining amount
//       });
//     }

//     console.log('Expense splits created successfully!');
//   } catch (error) {
//     console.error('Error creating splits:', error);
//   }
// }
// createExpenseSplits(28,243560,500).then((res)=>console.log(res)).catch((err)=>console.log(err))

// async function createSplitExpense(expenseId, fromUserId, toUserIds, splitAmounts) {
//   try {
//     // Validate input data (e.g., expense exists, user IDs are valid)

//     // Check if number of user IDs and split amounts match
//     if (toUserIds.length !== splitAmounts.length) {
//       throw new Error('Number of users and split amounts must match');
//     }

//     const expense = await Expense.findByPk(expenseId);
//     if (!expense) {
//       throw new Error('Expense not found');
//     }

//     const totalSplitAmount = splitAmounts.reduce((acc, curr) => acc + curr, 0);

//     // Validate that total split amount matches expense amount
//     if (totalSplitAmount !== expense.amount) {
//       throw new Error('Total split amount must equal expense amount');
//     }

//     const splitRecords = [];
//     for (let i = 0; i < toUserIds.length; i++) {
//       const splitRecord = {
//         expId: expenseId,
//         fromUserId: fromUserId,
//         toUserId: toUserIds[i],
//         splitAmount: splitAmounts[i]
//       };
//       splitRecords.push(splitRecord);
//     }

//     // Insert all split records in a single transaction
//     await sequelize.transaction(async (transaction) => {
//       await SplitExpense.bulkCreate(splitRecords, { transaction });
//     });

//     console.log('Split expense created successfully!');
//   } catch (error) {
//     console.error('Error creating split expense:', error);
//   }
// }
// createSplitExpense()

// Users.hasMany(Expenses, { foreignKey: 'user_id' });
// Expenses.belongsTo(Users, { foreignKey: 'user_id' });

// Currency.hasMany(Expenses, { foreignKey: 'currency_id' });
// Expenses.belongsTo(Currency, { foreignKey: 'currency_id' });

// Currency.hasMany(Users, { foreignKey: 'basecurrency' ,sourceKey:'currency_id'});
// Users.belongsTo(Currency, { foreignKey: 'basecurrency',sourceKey:"currency_id" });



sequelize.sync().then(() => {

  // return Users.bulkCreate([
  //   { user_id: "12432", username: 'two', email: 'two@gmail.com',password:"password123" ,basecurrency:1,profile_url:"string"},
  //   { user_id: "12442", username: 'three', email: 'three@gmail.com',password:"password123" ,basecurrency:2,profile_url:"string"},
  //   { user_id: "12452", username: 'four', email: 'four@gmail.com',password:"password123" ,basecurrency:3,profile_url:"string"},
  // ]);
}).then(() => {
  console.log('Dummy data inserted into users table!');
}).catch((error) => {
  console.error('Unable to create table or insert data: ', error);
});



// exports.addExpense= async (req, res) => {
//   const user_id = req.user;
//   const { userIds } = req.body;
//   const addExpenseSchema = Joi.object({
//     date: Joi.date().required(),
//     expense: Joi.string().required(),
//     currency_id: Joi.number().required(),
//     amount: Joi.number().required(),
//   });

 

//   try {
//     const { date, amount, expense, currency_id } = req.body;
//     const { error, value } = addExpenseSchema.validate(req.body);
//     if (error) {
//       return res.status(400).send({ msg: error.details[0].message, code: INVALID_INPUT.code });
//     }
//     if (!user_id) {
//       return res.status(400).send("User id invalid");
//     }
    
//     const newExpense = await Expenses.create({
//       user_id: user_id,
//       date: date,
//       amount,
//       expense,
//       currency_id,
//     });

//     console.log("created expense id", newExpense.exp_id);
    
//     if (!newExpense) {
//       return res.status(400).send({ msg: ADD_EXPENSE_ERROR.message, success: false, code: ADD_EXPENSE_ERROR.code });
//     }
    

//     const allExpenses = await Expenses.findAll({
//       where: {
//         user_id: user_id,
//         isActive: true,
//       },
//     });
//     const exp_id=newExpense.exp_id
//     const exp = await Expenses.findOne({
//       where: {
//         exp_id,
//         user_id,
//         isActive: true,
//       },
//     });
//     if (!exp) {
//       return res.status(400).send("Expense not found");
//     }
//     const numberOfSplits = userIds.length + 1;
//     const splitAmount = expense.amount / numberOfSplits;
//     const splitPromises = userIds.map((userId) => {
//       return SplitExpense.create({
//         exp_id: exp_id,
//         to_user_id: userId,
//         split_amount: splitAmount,
//         isActive: true
//       });
//     });

//     await Promise.all(splitPromises);
//     await new Promise(resolve => setTimeout(resolve, 100));
//     const splitExpenses = await SplitExpense.findAll({
//       where: {
//         exp_id: exp_id,
//         isActive: true,
//         to_user_id: {
//           [Op.ne]: user_id,
//         },
//       }
//     });
//     const totalMoneyLent = await SplitExpense.sum('split_amount', {
//       where: {
//         exp_id: exp_id,
//         to_user_id: {
//           [Op.ne]: user_id,
//         },
//         isActive: true,
//       },
//     });
//     const expo=await Expenses.update(
//       {
//         moneyLent: totalMoneyLent || 0
       
//       },
//       {
//         where: { exp_id: exp_id,isActive:true }
//       }
//     );
//     return res.status(200).json({
//       splitExpenses: splitExpenses,
//       totalAmount: expense.amount,
//       moneyLent: totalMoneyLent || 0,
//       expo
//     });
//     // return res.status(200).json({ 
//     //   msg: ADD_EXPENSE.message, 
//     //   success: true, 
//     //   code: ADD_EXPENSE.code, 
//     //   data: allExpenses,
      
//     // });
//   } catch (error) {
//     console.error("Error:", error);
//     return res.status(500).send("Server error");
//   }
// };