const express = require('express')
const cors = require("cors");
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express()
const port = 3000

app.use(cors({origin: '*'}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const con = mysql.createConnection({
  host: "localhost",
  user: "",
  password: "",
  database : 'hotel-management'
});

app.get("/", (req, res)=>{ 
  console.log(req.query);
  res.send(req.query);
});

// app.post("/", (req, res)  => {
//   console.log("post req")
// })

app.post("/user/login", (req,res)=>{
  let sql = `select * from users where phone_no = "${req.body.phone}" and user_password = "${req.body.password}"`;
  console.log(sql);
  con.query(sql, (err,result)=>{
  
    if(err){
      console.log(err)
      res.send("server error");
    } 
    
    if(result.length === 0){
      res.status(404).send({msg: "User not found"});
    } else {
      res.status(200).send({data: result, msg: "Login successful!"});
    }
  }) 
})

app.get('/user/:id', (req, res) => {
  console.log(req.params);
  
    let id = req.params.id;
    let sql = "SELECT * FROM users WHERE user_id = "+ id;
    con.query(sql, function (err, result) {
    if (err) {
      console.log(err);
      res.status(500).send("Server error");
    };
    res.send(result);
    });
});

//    /user/delete/:id

app.delete("/user/delete/:id",(request, response)=>{
  let id = request.params.id;
  let sql = "delete from users where user_id =" + id;
  con.query(sql, (err, result)=> {
    if (err) {
      response.send("server error")
    };
    if(result.affectedRows === 0){
      response.status(404).send("User doesn't exist");
    } else {
    response.send(result);

    }
  });
});


app.post("/user/register", (req, res) => {
  const {first_name, last_name, phone_no, email, password} = req.body;

  let sql = `insert into users(first_name, last_name, phone_no, email, user_password) values("${first_name}", "${last_name}", "${phone_no}", "${email}", "${password}")`;

  con.query(sql, (err, result)=>{
    if (err) {
      console.log(err)
      res.send("server error")
    };
    console.log(result)
    if (result.affectedRows === 0){
      res.status(404).send("something went wrong");
    }
    res.send({
      data: { 
        msg: "Registration successful"
      }
    });
  })
});


app.put("/user/update", (req, res)=>{
  const {id, first_name, last_name, phone_no, email} = req.body;

  let sql = `update users set first_name = "${first_name}", last_name = "${last_name}", phone_no = "${phone_no}", email = "${email}"
   where user_id = ${id}`
  con.query(sql, (err, result)=>{
    if (err){
      console.log(err)
      res.send("server error")
    };

    if(result && result.affectedRows === 0){
      res.status(404).send("something went wrong");
    }
    if(result){
      res.send({
        msg:"updation successful",
        data: result
    });
    }
  })
});

app.get("/booking", (req, res)=>{
  let query = "select * from booking";
  con.query(query, (err, result)=>{
     if(err){
       console.log(err);
       res.status(500).send("Server error")
     }
     else{
       res.send(result);
     }
  })
});

app.delete("/booking/delete/:id",(req, res)=>{
  let id = req.params.id;
  let sql = "delete from booking where user_id = " + id;
  con.query(sql, (err, result)=>{
    if(err){
      console.log(err);
      res.status(500).send("server error")
    }
    else{
      res.send(result);
    }
  })
})

app.put("/booking/update", (req, res)=>{
  const {bid ,room_type,check_in,check_out, id, amount} =req.body;
  let sql = `update booking set room_type ="${room_type}", check_in = "${check_in}", check_out = "${check_out}",id ="${id}",amount = "${amount}"
  where bid ="${bid}"`
  con.query(sql, (err, result)=>{
    if(err){
      console.log(err);
      res.status(500).send("server error")
    }
    else{
      res.send(result);
    }
  })

})

app.post("/booking", (req,res)=>{
  const {room_type, id, check_in,check_out, amount} =req.body;
  let sql = `insert into booking (room_type, id, check_in, check_out, amount) 
              values ("${room_type}", "${id}", "${check_in}", "${check_out}", "${amount}")` 
  con.query(sql, (err, result)=>{
    if(err){
      console.log(err);
      res.status(500).send("server error")
    }
    else{
      res.send(result);
    }
  })
})

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

