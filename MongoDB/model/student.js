const express=require('express');
const mongoose=require('mongoose');
const Joi=require("joi");


const stdSchema=new mongoose.Schema({
    name:String,
    mobile:String,
    email:String,
    city:String
});

const Student=mongoose.model('Student',stdSchema);

function validateStudent(std){
    const schema=Joi.object({
        name:Joi.string().required().regex(/^[a-z A-Z]*$/, 'Only alphabates allowed' ),
        mobile:Joi.string().regex(/^[0-9]{10}$/).messages({'string.pattern.base': `Phone number must have 10 digits.`}).required(),
        email:Joi.string().email(),
        city:Joi.string().required()
    });
    return schema.validate(std);
}

exports.Student=Student;
exports.validateStudent=validateStudent;


