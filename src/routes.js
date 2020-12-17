import express from 'express'
import jsonwebtoken from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import fileHandler from './fileHandler.js'
import users from '../data/users'
import bcrypt from 'bcrypt'
import jwtMiddleware from 'express-jwt-middleware'

var jwtCheck = jwtMiddleware('BIG_SECRET')

const router = express.Router(); 


function emailIsValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }


let errors = [];


 //// User Registration ////

 router.post("/users",async function(request, response){
    const code = uuidv4();

    const code1 = {
        id: code
    }

    let error = {
        message: 'validation error',
        invalid: [],
    };

    const item = request.body;


    if(item.name==null){
        error.invalid.push("name");
    }
    if(item.password==null){
        error.invalid.push("password");
    }
    if(item.email==null){
        error.invalid.push("email");    
        console.log("Errors: " + errors);
        response.status(400).send(error);
    }    
    else if(emailIsValid(item.email)!==true){
        response.status(400).send("Invalid email");
    }
    else if(item.password.length<=8){
        response.status(400).send("Password must be minimum 8 characters")
    }
    else{
        const object3 = {...code1,...item};

        

        object3.password = await bcrypt.hash(object3.password, 10)
        const {id,name,email} = object3;
        const responseObject = {id,name,email};
        fileHandler.addEntry(object3);
        response.status(201).send(responseObject);
    }
 });


//// User Authentication ////


router.post("/auth", function(request,response){
    const email = request.body.email;
    const password = request.body.password;
    

    const token = jsonwebtoken.sign({email},"BIG_SECRET")

    for(var i = 0; i < users.length; i++) {
        var obj = users[i];

        if((email == obj.email) && (bcrypt.compareSync(password, obj.password))){

        return response.send({token})        
        }
    }

    return response.status(401).send({error:"Invalid Credentials"})
});


//// Global Error Handler ////


 router.use((request, response, next) => {
    response.status(500);
    response.send({
        message: "not found"
    });
 });


//////////////////////////////


 export default router;
