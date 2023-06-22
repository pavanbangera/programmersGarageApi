const express = require('express')
const router = express.Router();
const course = require('../models/Course')
const lession = require('../models/Lession')


router.post("/addCourse", async (req, res) => {
    const { title, description, files } = req.body;
    try {
        const saveCourse = await course.create({
            title,
            description,
            cover: files
        })
        if (saveCourse)
            return res.status(200).send(saveCourse)
        else {
            return res.status(400).send(saveCourse)
        }
    }
    catch (err) {
        console.log("Some error occures")
        return res.status(500).send("somthing happend")
    }
})
router.get("/getCourse", async (req, res) => {
    try {
        const saveCourse = await course.find();
        if (saveCourse.length > 0) {
            res.status(200).send(saveCourse);
        } else {
            res.status(404).send("No courses found");
        }
    } catch (err) {
        console.log("Some error occurred");
        return res.status(500).send("Something happened");
    }
});


router.put('/updateCourse/:id', async (req, res) => {
    const { title, description, files } = req.body;
    // Create a newNote object
    const newItem = {};
    if (title) { newItem.title = title };
    if (description) { newItem.description = description };
    if (files) { newItem.cover = files };

    // Find the note to be updated and update it
    try {
        let Item = await course.findById(req.params.id);
        if (!Item) { return res.status(404).send("Not Found") }


        Item = await course.findByIdAndUpdate(req.params.id, { $set: newItem }, { new: true })
        res.json({ Item });

    } catch (error) {
        res.json("Internal server error")
    }
})


router.delete('/deleteCourse/:id', async (req, res) => {

    // Find the note to be updated and update it
    try {
        let Item = await course.findById(req.params.id);
        if (!Item) { return res.status(404).send("Not Found") }

        Item = await course.findByIdAndDelete(req.params.id)
        Item = await lession.deleteMany({ courseId: req.params.id })

        res.json({ Item });

    } catch (error) {
        res.json("Internal server error")
    }
})

router.get("/countCourse", async (req, res) => {
    try {
        const count = await course.countDocuments();
        res.send(count.toString());
    } catch (err) {
        console.log("Some error occurred");
        return res.status(500).send("Something happened");
    }
});

module.exports = router