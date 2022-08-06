const express = require('express')
const router = express.Router()
const Joi = require('joi')
blog = []

router.get('/',(req,res)=>{
    res.send(blog)

})

router.post('/',(req,res)=>{
    const post = req.body
    
    const {error} = validate(post)
    if (error){
        res.status(400).send(error.details[0].message)
        return
    }
    
    post.createdAt = new Date()
    post.viewed = 0
    post.id = blog.length+1
    blog.push(post)
    
  
    res.send(post)


})

router.get('/:id',(req,res)=>{
    const id = req.params.id
    const post = blog.find(c => c.id === parseInt(id))
    if (!post) return res.status(400).send(`The blog with the id of ${id} not found `)
    post.viewed +=1 
    res.json(post)


})

router.put('/:id',(req,res)=>{
    const updatedPostId = req.params.id
    const body = req.body
    const post = blog.find(c => c.id === parseInt(updatedPostId))
    if (!post) return res.status(404).send(`The blog with the id of ${id} not found `)
    const {error} = validate(body)
    if (error){
        res.status(400).send(error.details[0].message)
        return;
    }
    post.title = body.title
    post.content = body.content
    post.status = body.status
    post.author= body.author
    post.updatedAt = new Date()

    res.json(post)


})
router.delete('/:id',(req,res)=>{
    const id = req.params.id
    const post = blog.find(c => c.id === parseInt(req.params.id))
    if (!post) return res.status(404).send("The blog with the given id not found ")
    blog = blog.filter(e => e.id != id)
    res.send("Deleted")

})

function validate(blog){
    const schema = Joi.object({
        title : Joi.string().min(5).required(),
        content : Joi.string().min(10).required(),
        status :Joi.number().max(1).required(),
        author : Joi.string().required(),
    })
    return schema.validate(blog)
}

module.exports = router