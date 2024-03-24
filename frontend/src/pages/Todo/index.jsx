import axios from 'axios';
import React, { useState } from 'react'
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { MdTaskAlt } from "react-icons/md";
import {BASE_URL} from "../../constant"
import {Toast} from "../../utils/Toast"
import { useEffect } from 'react';



const Todo = () => {


  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  
  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
     

    
    const obj = {
      todo,
      isComplete
    }
    
    const responseCreate = await axios.post(`${BASE_URL}/todo/create`,obj);
    console.log(responseCreate);
    Toast("success",responseCreate.data.message)

    setTodo("")
    } catch (error) {
      Toast("error", error.message)
    }
  }

  //Data get from database

  const getData = async ()=>{
   try {
     
    const responseRead = await axios.get(`${BASE_URL}/todo/read`);
    // console.log(responseRead.data.data)
    setTodos(responseRead.data.data)
     } catch (error) {
    
     Toast("error",error.message)
   }
  }

  //value delete

  const handleDelete = async (id)=>{
    try {

       const responseDelete = await axios.delete(`${BASE_URL}/todo/delete/${id}`);
       if(responseDelete){
         Toast("success",responseDelete.data.message);
       }  
    } catch (error) {
      
      Toast("error",error.message)
    }
  }

  //value update
  const handleUpdate = async (id)=>{
    try {

      const editValue = prompt("Enter Updated Todo");
      
          const obj = {
            todo: editValue,
          };
    

       const responseUpdated = await axios.put(`${BASE_URL}/todo/update/${id}`,obj);
       if(responseUpdated){
         Toast("success",responseUpdated.data.message);
       }  
    } catch (error) {
      
      Toast("error",error.message)
    }
  }

  const handleCompleted = async (id)=>{
    try {
      const responseDelete = await axios.delete(`${BASE_URL}/todo/delete/${id}`);
      setIsComplete(true)
     
       if(isComplete){
         Toast("success","Todo Completed");
       }  
    } catch (error) {
      
      Toast("error",error.message)
    }
  }








useEffect(() => {
  getData();
}, [todo, todos])


// console.log(todos)

  return (
    <>
      <div className='grid place-content-center p-10'>
        <div className='shadow-2xl px-20 text-center'>
          <h1 className=' text-3xl p-10 font-mono font-extrabold'>Todo Application</h1>
          <div>
            <form onSubmit={handleSubmit}>
              <div className='flex'>

                <input type="text" placeholder='Enter todo here' value={todo} onChange={(e) => setTodo(e.target.value)}
                  className='p-2 text-2xl rounded-md' />
                <button className='p-3 bg-blue-600 font-bold text-white rounded-md '>Add Todo</button>
              </div>
            </form>

            <div className='py-5'>
              {
                todos?.map((value, index) => {
                  return (
                    <li key={index} className='flex justify-between my-3 p-3 rounded-md text-2xl text-white  bg-blue-600 shadow-2xl'>
                      <div className=''>
                        {
                        value.todo    
                        }
                      </div>
                      <div className="">
                        <button className='mx-2'  onClick={()=>handleUpdate(value._id)}   >  <FaEdit /></button>
                        <button className='mx-2' onClick={()=>handleDelete(value._id)}  >   <MdDeleteForever /></button>
                        <button className='mx-2' onClick={()=>handleCompleted(value._id)}  >   <MdTaskAlt /></button>
                      </div>
                    </li>
                  )

                })
              }
            </div>
          </div>
        </div>
      </div>



    </>
  )
}

export default Todo
