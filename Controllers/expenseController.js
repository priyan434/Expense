const pool=require("../database/database")
const { v4: uuidv4 } = require("uuid");
exports.addExpense =async (req, res) => {
  const user_id=req.user
    let conn
    const {date,amount,expense,curr_id}=req.body
    const exp_id=uuidv4()
try {
  conn=await pool.getConnection()
  let sql=`INSERT INTO expenses (exp_id, user_id, date, amount, expense, curr_id, isActive) VALUES (?,?,?,?,?,?,?)`
  const [results,fields]=await pool.query(sql,[exp_id,user_id,date,amount,expense,curr_id,true])
 
  if(results.affectedRows===1){
    res.status(200).send("expense added successfully")
  }
  else{
    res.status(400).send("error while adding expense")
  }
} catch (error) {
  console.log(error);
  res.status(400).send("server error")
}finally{
  if(conn){
    conn.release()
  }
}
 
};
exports.updateExpense = async (req, res) => {
  const id = req.params.id;
  const fieldsToUpdate = req.body;
  const user_id = req.user;

  if (!user_id) {
    return res.status(400).send("Invalid user ID");
  }

  if (!id) {
    return res.status(400).send("Invalid expense ID");
  }

  if (Object.keys(fieldsToUpdate).length === 0) {
    return res.status(400).send({ message: "No fields to update" });
  }

  let conn;
  try {
    conn = await pool.getConnection();

    const fields = Object.keys(fieldsToUpdate);
    const updates = fields.map(field => `${field} = ?`).join(",");
    const values = fields.map(field => fieldsToUpdate[field]);
    values.push(id);

    const sql = `UPDATE expenses SET ${updates} WHERE exp_id = ? AND isActive = 1 AND user_id = ?`;
    const [results] = await conn.query(sql, values.concat(user_id));

    if (results.affectedRows === 0) {
      return res.status(404).send({ message: "Expense not found or already deleted" });
    }

    res.status(200).send({ message: "Expense updated successfully" });
  } catch (error) {
    console.error("Error updating expense:", error);
    res.status(500).send({ message: "An error occurred while updating the expense", error: error.message });
  } finally {
    if (conn) {
      conn.release();
    }
  }
};



exports.deleteExpense=async(req,res)=>{
const id=req.params.id
const user_id=req.user
console.log(id);
  try {
    conn=await pool.getConnection();
    let sql='update expenses set isActive=0 where user_id=? AND exp_id=?'
    const [results,feilds]=await conn.query(sql,[user_id,id])
    if(results.affectedRows===0){
      res.status(404).send("expense not found")
    }else{
      res.status(200).send("deleted successfully")
    }
  
  } catch (error) {
    console.log(error);
    res.status(500).send("error")
  }finally{
    if(conn){
      conn.release()
    }
  }

}

exports.getAllExpense=async(req,res)=>{
  const user_id=req.user
    let connection;
    try {
      connection = await pool.getConnection();
      const [results, fields] = await connection.query(
        'SELECT exp_id,user_id,date,amount,expense,curr_id FROM expenses WHERE user_id=? AND isActive=?',[user_id,1]
      );
     if(results.length>0){
      res.status(200).send(results)
     }
else{
  res.status(400).send("couldn't fetch details")
}
    } catch (err) {
      console.error('Error fetching expenses:', err);
           
 res.status(500).send("error")
    } finally {
      if (connection) {
        connection.release();
      }
    }


}