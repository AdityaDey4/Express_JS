const express=require('express');
const mongoose=require('mongoose');
const {Student, validateStudent}=require('../model/student');

const router=express.Router();

router.get('/', async(req,res)=>{
    const students= await Student.find();
    res.send(students);
})

router.post('/',async(req,res)=>{
    const {error}=validateStudent(req.body);
    if(error) return res.status(401).send(error.details[0].message)
    student=new Student(req.body);
    try{
        student.save()
        res.send(student);
    }catch(err){
        res.send(err)
    }
});

module.exports=router;