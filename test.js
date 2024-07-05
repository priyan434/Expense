const dateString = "2024-07-04T09:39:58.703Z";
const date = new Date(dateString);


const day = date.getDate().toString()
const mth = (date.getMonth() )
const year = date.getFullYear().toString()
const month=mth+1

const formattedDate = `${day}/${month}/${year}`;
console.log(formattedDate)
const fort=new Date(year,mth,day)
console.log(fort)


