const express = require('express')
const router = express.Router();
const blog = require('../models/Blog')

router.post("/addBlog", async (req, res) => {
    const { title, content } = req.body;
    try {
        const saveBlog = await blog.create({
            title,
            content
        })
        res.send(saveBlog)
    }
    catch (err) {
        console.log("Some error occures")
        return res.status(500).send("somthing happend")
    }
})

router.get("/getBlog", async (req, res) => {
    try {
        const saveBlog = await blog.find();
        res.send(saveBlog)
    }
    catch (err) {
        console.log("Some error occures")
        return res.status(500).send("somthing happend")
    }
})

router.get("/getBlogDetail/:id", async (req, res) => {

    try {
        const saveBlog = await blog.find({ _id: req.params.id });
        if (saveBlog.length > 0) {
            res.status(200).send(saveBlog);
        } else {
            res.status(404).send("No data found");
        }
    }
    catch (err) {
        console.log("Some error occures")
        return res.status(500).send("somthing happend")
    }
})

router.delete('/deleteBlog/:id', async (req, res) => {

    // Find the note to be updated and update it
    try {
        let Item = await blog.findById(req.params.id);
        if (!Item) { return res.status(404).send("Not Found") }

        Item = await blog.findByIdAndDelete(req.params.id)
        res.json({ Item });

    } catch (error) {
        res.json("Internal server error")
    }
})

router.put('/updateBlog/:id', async (req, res) => {
    const { title, content } = req.body;
    // Create a newNote object
    const newItem = {};
    if (title) { newItem.title = title };

    if (content) { newItem.content = content };

    // Find the note to be updated and update it
    try {
        let Item = await blog.findById(req.params.id);
        if (!Item) { return res.status(404).send("Not Found") }


        Item = await blog.findByIdAndUpdate(req.params.id, { $set: newItem }, { new: true })
        res.json({ Item });

    } catch (error) {
        res.json("Internal server error")
    }
})

router.get("/countBlog", async (req, res) => {
    try {
        const count = await blog.countDocuments();
        res.send(count.toString());
    } catch (err) {
        console.log("Some error occurred");
        return res.status(500).send("Something happened");
    }
});



module.exports = router