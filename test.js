let obj={
    exp_id:"",
    amount:"",
    user_id:"",
    expense:""
}
let fields=Object.keys(obj)
console.log(fields);
let updates=fields.map((ele)=> `${ele}=?`).join(',')
let values=fields.map(ele=>obj[ele])
console.log(updates);
values.push(1)
console.log(values);
