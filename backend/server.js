import express from "express"
import mongoose from "mongoose";
import bcrypt from "bcryptjs"
import cors from "cors"
import {User} from "./models/user.model.js"
import {Todo} from "./models/todo.model.js"
const app = express()
const port = process.env.PORT || 3000


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors())
const URI = "mongodb+srv://janisar:janisar110@jmdbpractice.6a4p5uw.mongodb.net"

mongoose.connect(URI);

mongoose.connection.on("connected", () => console.log("MongoDB Connected"));
mongoose.connection.on("error", (err) => console.log("MongoDB Error", err));


//Sign Up
app.post("/api/signup", async (req, res)=>{
    try {
        const { firstName, lastName, email, password } = req.body;
        // console.log(firstName, lastName, email, password)

    if(!firstName  || !lastName || !email || !password){
        res.status(400).json({
            message: "All fields are required",
            data: null
        })
        return
    }

    const emailExists = await User.findOne({email});
    if(emailExists){
        res.status(400).json({
            message: "Already email exist"
        })
        return;
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const obj = {
        firstName,
        lastName,
        email,
        password:hashPassword
    }        
    // console.log(obj)

    const resData = await User.create(obj);
    // console.log(resData)

    res.status(200).json({
        message:"signup successfully",
        data: resData
    })

    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }

})

//Login
app.post("/api/", async (req, res)=>{
    try {
        const { email, password } = req.body;
        // console.log(email, password)

    if(!email || !password){
        res.status(400).json({
            message: "All fields are required",
            data: null
        })
        return
    }

    const emailExists = await User.findOne({email});
    if(!emailExists){
        res.status(400).json({
            message: "User not found"
        })
        return;
    }

    const comparePassword = await bcrypt.compare(password, emailExists.password);
    // console.log(comparePassword)
    
    if(!comparePassword){
        res.status(400).json({
            message: "Invalid password"
        })
        return
    }

    res.status(200).json({
        message: "Login successfully!",
        data: emailExists
    })

    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }

})


//for todo crud

//Create Todo
app.post("/api/todo/create", async (req, res) => {
    try {
        const { todo , isComplete } = req.body;
        if (!todo || isComplete) {
            res.status(400).json({
                message: "Empty input",
                data:null
            })
            return;
        }

        const obj = {
            todo,
            isComplete
        }

        const response = await Todo.create(obj);
        // console.log(response);
        res.json({
            message: "Todo added successfully",
            data: response
        })


    }
    catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
})


// Read Todo
app.get("/api/todo/read", async (req, res) => {
    try {
        const response = await Todo.find();
        console.log(response);
        res.status(200).json({
            data: response
               })
    }
    catch (error) {
        res.status(400).json({
            message: error.message,
        })
    }
})

//Update Todo
app.put("/api/todo/update/:id", async (req, res) => {
    try {
        const { todo, isComplete } = req.body;
        if (!todo) {
            res.json({
                message: "Empty input",
                status: false
            })
            return;
        }
        const id = req.params.id
        const obj  = {
            todo,
            isComplete
        }
        const response = await Todo.findByIdAndUpdate(id, obj);
        
        console.log(response)
        res.status(200).json({
            message: "Todo updated successfully",
            data: response
        })

    }
    catch (error) {
        res.status(400).json({
            message: error.message,
        })
    }
})

// Delete Todo
app.delete("/api/todo/delete/:id", async (req, res) => {
    try {
        
        const id = req.params.id

       const response = await Todo.findByIdAndDelete(id);
       res.status(200).json({
        message: "Todo deleted successfully",
       })
    }
    catch (error) {
        res.status(400).json({
            message: error.message,
        })
    }})






app.get('/', (req, res) => res.send('Server UP!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))