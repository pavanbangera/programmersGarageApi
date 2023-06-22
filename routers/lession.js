const express = require('express')
const router = express.Router();
const lession = require('../models/Lession')
const comment = require('../models/Comment')
const fetchUserData = require('../midleware/fetchUserData')
const course = require('../models/Course')

router.post("/addLession", async (req, res) => {
    const { courseId, title, description, link } = req.body;
    try {
        const saveLession = await lession.create({
            courseId,
            title,
            description,
            link
        })
        if (saveLession)
            return res.status(200).send(saveLession)
        else {
            return res.status(400).send(saveLession)
        }
    }
    catch (err) {
        console.log("Some error occures")
        return res.status(500).send("somthing happend")
    }
})
router.get("/getLessionList/:courseId", async (req, res) => {
    const courseId = req.params.courseId
    try {
        const saveLessionList = await lession.find({ courseId });
        const saveCourse = await course.findOne({ _id: courseId });
        if (!saveCourse) {
            saveCourse = await course.find({ _id: courseId })
        }
        if (!saveLessionList) { return res.status(404).send("Not Found") }
        res.status(200).send({ lessonlist: saveLessionList, course: saveCourse })
    }
    catch (err) {
        console.log("Some error occures")
        return res.status(500).send("somthing happend")
    }
})

router.get("/getLession/:courseId/:lessonId", async (req, res) => {
    const courseId = req.params.courseId
    const lessonId = req.params.lessonId
    try {
        const saveCourse = await lession.find({ courseId, _id: lessonId });
        const saveLessionList = await lession.find({ courseId });
        if (!saveCourse) { return res.status(404).send("Not Found") }
        if (!saveLessionList) { return res.status(404).send("Not Found") }

        res.status(200).send({ lessionList: saveLessionList, course: saveCourse })
    }
    catch (err) {
        console.log("Some error occures")
        return res.status(500).send("somthing happend")
    }
})

router.put('/updateLession/:id', async (req, res) => {
    const { title, description, link } = req.body;
    // Create a newNote object
    const newItem = {};
    if (title) { newItem.title = title };
    if (description) { newItem.description = description };
    if (link) { newItem.link = link };

    // Find the note to be updated and update it
    try {
        let Item = await lession.findById(req.params.id);
        if (!Item) { return res.status(404).send("Not Found") }


        Item = await lession.findByIdAndUpdate(req.params.id, { $set: newItem }, { new: true })
        res.json({ Item });

    } catch (error) {
        res.json("Internal server error")
    }
})

router.delete('/deleteLession/:id', async (req, res) => {

    // Find the note to be updated and update it
    try {
        let Item = await lession.findById(req.params.id);
        if (!Item) { return res.status(404).send("Not Found") }

        Item = await lession.findByIdAndDelete(req.params.id)
        res.json({ Item });

    } catch (error) {
        res.json("Internal server error")
    }
})


router.post('/addcomment', fetchUserData,
    async (req, res) => {
        try {
            const { lession, content } = req.body

            const newComment = await comment({
                lession: lession,
                content: content,
                user: req.user.id
            })
            const saveComment = await newComment.save();
            const comments = await comment.findById({ _id: saveComment._id }).populate('user', 'name email');
            res.status(200).json(comments)
        } catch (error) {
            res.status(500).json("Internal server error");
        }
    });
router.post('/getcomment',
    async (req, res) => {
        try {
            const { lession } = req.body
            const comments = await comment.find({ lession }).populate('user', 'name email').sort({ date: -1 });
            res.status(200).json(comments)
        } catch (error) {
            res.status(500).json("Internal server error");
        }
    });

router.delete('/deletecomment/:id', async (req, res) => {

    // Find the note to be updated and update it
    try {
        let Item = await comment.findById(req.params.id);
        if (!Item) { return res.status(404).send({ success: false }) }

        Item = await comment.findByIdAndDelete(req.params.id)
        res.status(200).json({ success: true });

    } catch (error) {
        res.json("Internal server error")
    }
})

module.exports = router