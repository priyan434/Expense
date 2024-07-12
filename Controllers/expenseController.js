const Joi = require("joi");
const { Expenses, SplitExpense, UserExpenses } = require("../database/user.model");
const { GET_ALL_EXPENSE, INVALID_INPUT, ADD_EXPENSE, ADD_EXPENSE_ERROR, UPDATE_EXPENSE, UPDATE_EXPENSE_ERROR, DELETE_EXPENSE, DELETE_EXPENSE_ERROR, EXPENSE_NOT_FOUND } = require("../ErrorCode");
const { Op } = require("sequelize");

exports.getAllExpense = async (req, res) => {
  const user_id = req.user;
  try {
    if (!user_id) {
      return res.status(400).send("User id invalid");
    }

    const expenses = await Expenses.findAll({
      where: { user_id: user_id, isActive: true }
    });


    return res.status(200).json({ message: GET_ALL_EXPENSE.message, sucess: true, code: GET_ALL_EXPENSE.code, data: expenses });

  } catch (err) {
    console.error('Error fetching expenses:', err);
    return res.status(500).send("Internal server error");
  }
};

// exports.addExpense = async (req, res) => {
//   const user_id = req.user
//   const addExpenseSchema = Joi.object({

//     date: Joi.date().required(),
//     expense: Joi.string().required(),
//     currency_id: Joi.number().required(),
//     amount: Joi.number().required(),

//   });

//   const { date, amount, expense, currency_id } = req.body

//   try {
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
//     })
//   console.log("created expense id",newExpense.id);
//     if (!newExpense) res.status(400).send({ msg: ADD_EXPENSE_ERROR.message, success: false, code: ADD_EXPENSE_ERROR.code })

//     const allExpenses = await Expenses.findAll({
//       where: {
//         user_id: user_id,
//         isActive: true
//       }
//     })
//     return res.status(200).json({ msg: ADD_EXPENSE.message, success: true, code: ADD_EXPENSE.code, data: allExpenses })
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send("server error")
//   }

// };


exports.addExpense= async (req, res) => {
  const user_id = req.user;
  // const { userIds } = req.body;
  const addExpenseSchema = Joi.object({
    date: Joi.date().required(),
    expense: Joi.string().required(),
    currency_id: Joi.number().required(),
    amount: Joi.number().required(),
    userIds:Joi.array().items(Joi.number()).optional()
  });

 

  try {
    const { date, amount, expense, currency_id,userIds=[] } = req.body;
    const { error, value } = addExpenseSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ msg: error.details[0].message, code: INVALID_INPUT.code });
    }
    if (!user_id) {
      return res.status(400).send("User id invalid");
    }
    
    const newExpense = await Expenses.create({
      user_id: user_id,
      date: date,
      amount,
      expense,
      currency_id,
    });

    // console.log("created expense id", newExpense.exp_id);
    
    if (!newExpense) {
      return res.status(400).send({ msg: ADD_EXPENSE_ERROR.message, success: false, code: ADD_EXPENSE_ERROR.code });
    }
    

    const allExpenses = await Expenses.findAll({
      where: {
        user_id: user_id,
        isActive: true,
      },
    });

    if(userIds.length>0){

      const exp_id=newExpense.exp_id;
      const expo = await Expenses.findOne({
        where: {
          exp_id,
          user_id,
          isActive: true,
        },
      });
      if (!expo) {
        return res.status(400).send("Expense not found");
      }
      const numberOfSplits = userIds.length + 1;
      const splitAmount = expo.amount / numberOfSplits;
      const splitPromises = userIds.map((userId) => {
        return SplitExpense.create({
          exp_id: exp_id,
          to_user_id: userId,
          split_amount: splitAmount,
          isActive: true
        });
      });
      if (!userIds.includes(user_id)) {
      
        splitPromises.push(
          SplitExpense.create({
            exp_id: exp_id,
            to_user_id: user_id,
            split_amount: splitAmount,
            isActive: true
          })
        );
      }
      await Promise.all(splitPromises);
      
         
      await new Promise(resolve => setTimeout(resolve, 100));
      const splitExpenses = await SplitExpense.findAll({
        where: {
          exp_id: exp_id,
          isActive: true,
          to_user_id: {
            [Op.ne]: user_id,
          },
        }
      });
      const totalMoneyLent = await SplitExpense.sum('split_amount', {
        where: {
          exp_id: exp_id,
          to_user_id: {
            [Op.ne]: user_id,
          },
          isActive: true,
        },
      });
      
      const expen=await Expenses.update(
        {
          moneyLent: totalMoneyLent || 0
         
        },
        {
          where: { exp_id: exp_id,isActive:true }
        }
      );
      return res.status(200).json({
        splitExpenses: splitExpenses,
        totalAmount: expo.amount,
        
      });




    }
    else{
      return res.status(200).json({ 
      msg: ADD_EXPENSE.message, 
      success: true, 
      code: ADD_EXPENSE.code, 
      data: allExpenses,
      
    });
    }

    
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Server error");
  }
};
// return res.status(200).json({ 
    //   msg: ADD_EXPENSE.message, 
    //   success: true, 
    //   code: ADD_EXPENSE.code, 
    //   data: allExpenses,
      
    // });
    
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send("server error");
//   }
// };
exports.updateExpense = async (req, res) => {
  const id = req.params.id;
  const fieldsToUpdate = req.body;
  const user_id = req.user;
  const updateExpenseSchema = Joi.object({
    date: Joi.date(),
    expense: Joi.string(),
    currency_id: Joi.number(),
    amount: Joi.number(),
  });
  if (!user_id) {
    return res.status(400).send("Invalid user ID");
  }

  if (!id) {
    return res.status(400).send({ message: "invalid id" });
  }

  if (Object.keys(fieldsToUpdate).length === 0) {
    return res.status(400).send({ message: "No fields to update" });
  }


  try {
    const { error, value } = updateExpenseSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ msg: error.details[0].message, code: INVALID_INPUT.code });
    }
    const expense = await Expenses.findOne({
      where: {
        user_id,
        exp_id: id,
        isActive: true
      }
    })
    if (!expense) {
      return res.status(400).send({ msg: EXPENSE_NOT_FOUND.message, code: EXPENSE_NOT_FOUND.code, success: false })
    }

    const updatedExpense = await expense.update(fieldsToUpdate)
    if (updatedExpense) {
      return res.status(200).json({ msg: "expense updated successfully", success: true, code: UPDATE_EXPENSE.code, data: updatedExpense })

    }
    else {
      return res.status(400).send({ msg: UPDATE_EXPENSE_ERROR.message, code: UPDATE_EXPENSE_ERROR.code, success: false })
    }
  } catch (error) {
    console.error("Error updating expense:", error);
    return res.status(500).send({ message: "server error" });
  }
};

exports.deleteExpense = async (req, res) => {
  const id = req.params.id;
  const user_id = req.user;

  if (!user_id) {
    return res.status(400).send("Invalid user ID");
  }

  if (!id) {
    return res.status(400).send("Invalid expense ID");
  }

  try {
    const expense = await Expenses.findOne({
      where: {
        user_id,
        exp_id: id,
        isActive: true
      }
    });

    if (!expense) {
      return res.status(400).send({ msg: "Expense not found", code: EXPENSE_NOT_FOUND.code });
    }

    const updatedExpense = await expense.update({ isActive: false });

    if (updatedExpense) {
      const allExpenses = await Expenses.findAll({
        where: {
          user_id: user_id,
          isActive: true
        }
      });
      return res.status(200).send({
        msg: DELETE_EXPENSE.message,
        success: true,
        code: DELETE_EXPENSE.code,
        data: allExpenses
      });
    } else {
      return res.status(400).send({
        msg: DELETE_EXPENSE_ERROR.message,
        success: false,
        code: DELETE_EXPENSE_ERROR.code
      });
    }
  } catch (error) {
    console.error("Error updating expense:", error);
    return res.status(500).send({
      message: "server error",
      error: error.message,
    });
  }
};

// exports.splitExpenses = async (req, res) => {
//   const exp_id = Number(req.params.id);
//   const user_id = 243560;
//   const { userIds } = req.body;

//   try {
//     const expense = await Expenses.findOne({
//       where: {
//         exp_id,
//         user_id,
//         isActive: true,
//       },
//     });

//     if (!expense) {
//       return res.status(400).send("Expense not found");
//     }

//     // console.log(expense.amount);
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

//     if (!userIds.includes(user_id)) {

//       splitPromises.push(
//         SplitExpense.create({
//           exp_id: exp_id,
//           to_user_id: user_id,
//           split_amount: splitAmount,
//           isActive: true
//         })
//       );
//     }

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

//   } catch (error) {
//     console.error("Error:", error);
//     return res.status(500).send("Server error");
//   }
// };
// exports.splitExpenses = async (req, res) => {
//   const exp_id = Number(req.params.id);
//   const user_id = 243560;
//   const { userIds } = req.body;

//   try {
//     const expense = await Expenses.findOne({
//       where: {
//         exp_id,
//         user_id,
//         isActive: true,
//       },
//     });

//     if (!expense) {
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
//       }).then(() => {
//         return UserExpenses.upsert({
//           exp_id: exp_id,
//           user_id: userId,
//           borrowed_amount: splitAmount,
//           lent_amount: 0,
//         });
//       });
//     });

//     if (!userIds.includes(user_id)) {
//       splitPromises.push(
//         SplitExpense.create({
//           exp_id: exp_id,
//           to_user_id: user_id,
//           split_amount: splitAmount,
//           isActive: true
//         })
        
//       );
//     }

//     await Promise.all(splitPromises);

//     const splitExpenses = await SplitExpense.findAll({
//       where: {
//         exp_id: exp_id,
//         isActive: true,
//       }
//     });
    
//     const totalMoneyLent = await SplitExpense.sum('split_amount', {
//             where: {
//               exp_id: exp_id,
//               to_user_id: {
//                 [Op.ne]: user_id,
//               },
//               isActive: true,
//             },
//           });
//     // const totalMoneyLent = await UserExpenses.sum('borrowed_amount', {
//     //   where: {
//     //     exp_id: exp_id,
//     //     user_id:{
//     //       [Op.ne]: user_id,
//     //     },
//     //     isActive: true,
//     //   },
//     // });
//     // where: {
//     //   //         exp_id: exp_id,
//     //   //         to_user_id: {
//     //   //           [Op.ne]: user_id,
//     //   //         },
//     //   //         isActive: true,
//     //   //       },

//     // const totalMoneyBorrowed = await UserExpenses.sum('borrowed_amount', {
//     //   where: {
//     //     exp_id: exp_id,
//     //     isActive: true,
//     //   },
//     // });

//     return res.status(200).json({
//       splitExpenses: splitExpenses,
//       totalAmount: expense.amount,
//       moneyLent: totalMoneyLent || 0,
    
//     });

//   } catch (error) {
//     console.error("Error:", error);
//     return res.status(500).send("Server error");
//   }
// };


// exports.splitExpenses = async (req, res) => {
//   const exp_id = Number(req.params.id);
//   const user_id = 243560;
//   const { userIds } = req.body;

//   try {
//     const expense = await Expenses.findOne({
//       where: {
//         exp_id,
//         user_id,
//         isActive: true,
//       },
//     });

//     if (!expense) {
//       return res.status(400).send("Expense not found");
//     }

//     const numberOfSplits = userIds.length + 1;
//     const splitAmount = expense.amount / numberOfSplits;


//     const splitPromises = userIds.map(async (userId) => {
//       await SplitExpense.create({
//         exp_id: exp_id,
//         to_user_id: userId,
//         split_amount: splitAmount,
//         isActive: true
//       });


//       return UserExpenses.upsert({
//         exp_id: exp_id,
//         user_id: userId,
//         borrowed_amount: splitAmount,
//         lent_amount: 0,
//       });
//     });

//     if (!userIds.includes(user_id)) {
      
//       splitPromises.push(
//         SplitExpense.create({
//           exp_id: exp_id,
//           to_user_id: user_id,
//           split_amount: splitAmount,
//           isActive: true,
//         }).then(() => {
          
//           return UserExpenses.findOne({
//             where: {
//               exp_id: exp_id,
//               user_id: user_id,
//               isActive: true,
//             }
//           }).then(() => {
            
//             return UserExpenses.upsert({
//               exp_id: exp_id,
//               user_id: user_id,
//               borrowed_amount: 0,
//               lent_amount: (userIds.length)*splitAmount,
//             });
//           });
//         })
//       );
//     }

//     await Promise.all(splitPromises);


//     await new Promise(resolve => setTimeout(resolve, 100));


//     const splitExpenses = await SplitExpense.findAll({
//       where: {
//         exp_id: exp_id,
//         isActive: true,
//       },
//     });

  
//     const totalMoneyLent = await UserExpenses.sum('borrowed_amount', {
//       where: {
//         exp_id: exp_id,
//         isActive: true,
//       },
//     });

   
//     return res.status(200).json({
//       splitExpenses: splitExpenses,
//       totalAmount: expense.amount,
//       moneyLent: totalMoneyLent || 0,
     
//     });

//   } catch (error) {
//     console.error("Error:", error);
//     return res.status(500).send("Server error");
//   }
// };
