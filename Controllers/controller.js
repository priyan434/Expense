const User=require('../Model/model')

exports.addExpense =async (req, res) => {

    try {
        const {date,amount,expense}=req.body
     const user=  await User.findById("668682a3dcf89404ea161e49");
        if (!user) return res.status(400).json({ error: 'User not found' });

        const newExpense = {
            amount,
            expense,
            date:date?date:new Date()
        };

        user.expenses.push(newExpense);
        const data=await user.save();
        res.status(201).json({ message: 'expense added successfully',data:data});

    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }

};
exports.updateExpense=async(req,res)=>{
    try{
        const {date,amount,expense}=req.body
        // const user = await User.findById(req.user);
        const user=  await User.findById("668682a3dcf89404ea161e49");

        if (!user) return res.status(404).json({ error: 'User not found' });
        const Uexpense=user.expenses.id(req.params.id)
        Uexpense.amount=amount
        Uexpense.date=date
        Uexpense.expense=expense
        await user.save()
        res.status(201).json({"msg":"updated  successfully"})

    }catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
}
exports.deleteExpense=async(req,res)=>{
    try{
        const expenseId=req.params.id;
        const updatedUser = await User.findOneAndUpdate(
            { _id:"668682a3dcf89404ea161e49"  },
            { $pull: { expenses: { _id: expenseId} } },
            { new: true }
        )
        if(!updatedUser) res.status(404).json({ error: 'User not found or expense not found' });
        await updatedUser.save()
        res.status(200).json({'msg':"deleted expense successfully"});
    }catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
}

exports.getAllExpense=async(req,res)=>{
    try{
        const user = await User.findById("668682a3dcf89404ea161e49");
        if (!user) return res.status(404).json({ error: 'User not found' });
        const allExpense =user.expenses
        res.status(201).json({allExpense})
        
    }catch (e) {
        res.status(500).send({ error: 'Server error' });
    }
}