const {grade, date} = require('../../lib/utils')
const Student = require('../models/Student')

module.exports = {
    index(req, res){
        Student.all(function(students){
            for(student of students){
                student.education_level = grade(student.education_level)
            }
            return res.render("students/index", {students})
        })
    },

    create(req, res){
        Student.teacherSelectOptions(function(options){
            return res.render('students/create', {teacherOptions: options})
        })
    },

    post(req, res){
        const keys = Object.keys(req.body)
        for(key of keys){
            if(req.body[key]==""){
                return res.send("Por favor, preencha todos os campos.")
            }
        }

        Student.create(req.body, function(student){
            return res.redirect(`/students/${student.id}`)
        })
    },

    show(req, res){
        Student.find(req.params.id, function(student){
            if(!student) return res.send("Student not found!")

            student.birth_date = date(student.birth_date).birthDay
            student.education_level = grade(student.education_level)

            return res.render("students/show", {student})
        })
    },

    edit(req, res){
        Student.find(req.params.id, function(student){
            if(!student) return res.send("Student not found!")

            student.birth_date = date(student.birth_date).iso

            Student.teacherSelectOptions(function(options){
                return res.render('students/create', {student, teacherOptions: options})
            })
 
        })
    },

    put(req, res){
        const keys = Object.keys(req.body)
        for(key of keys){
            if(req.body[key]==""){
                return res.send("Por favor, preencha todos os campos.")
            }
        }
        
        Student.update(req.body, function(){
            return res.redirect(`students/${req.body.id}`)
        })
    },

    delete(req, res){
        Student.delete(req.body.id, function(){
            return res.redirect('/students')
        })
    }
}

