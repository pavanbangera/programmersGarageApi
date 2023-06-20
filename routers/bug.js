const express = require('express')
const router = express.Router();
const bug = require('../models/Bug')
const comment = require('../models/Comment')
const fetchUserData = require('../midleware/fetchUserData')


router.post('/addbug', fetchUserData,
    async (req, res) => {
        try {
            const { title, description } = req.body

            const newBug = await bug({
                title,
                description,
                user: req.user.id
            })
            const saveBug = await newBug.save()
            const userBugs = await bug.findById({ _id: saveBug._id }).populate('user', 'name email');

            res.status(200).json(userBugs)
        } catch (error) {
            res.status(500).json("Internal server error");
        }
    });
router.get('/getbug', fetchUserData,
    async (req, res) => {
        try {
            const userBugs = await bug.find({ user: req.user.id }).populate('user', 'name email').sort({ date: -1 });
            const otherBugs = await bug.find({ user: { $ne: req.user.id } }).populate('user', 'name email').sort({ date: -1 });
            if (userBugs.length > 0 || otherBugs.length > 0) {
                res.status(200).json({ userBugs, otherBugs })
            } else {
                res.status(404).send("No data found");
            }
        } catch (error) {
            console.log("Internal server error:", error);
            res.status(500).json("Internal server error");
        }
    });

router.get("/getBugDetail/:id", async (req, res) => {

    try {
        const saveBug = await bug.find({ _id: req.params.id }).populate('user', 'name email');
        if (saveBug.length > 0) {
            res.status(200).send(saveBug);
        } else {
            res.status(404).send("No data found");
        }
    }
    catch (err) {
        console.log("Some error occures")
        return res.status(500).send("somthing happend")
    }
})

router.delete('/deletebug/:id', async (req, res) => {

    // Find the note to be updated and update it
    try {
        let Item = await bug.findById(req.params.id);
        if (!Item) { return res.status(404).send({ success: true }) }

        Item = await bug.findByIdAndDelete(req.params.id)
        res.status(200).json({ success: true });

    } catch (error) {
        res.json("Internal server error")
    }
})



router.post('/addcomment', fetchUserData,
    async (req, res) => {
        try {
            const { bug, content } = req.body

            const newComment = await comment({
                bug: bug,
                content: content,
                user: req.user.id
            })
            const saveComment = await newComment.save()

            res.status(200).json(saveComment)
        } catch (error) {
            console.log("Internal server error:", error);
            res.status(500).json("Internal server error");
        }
    });
router.post('/getcomment',
    async (req, res) => {
        try {
            const { bug } = req.body
            const comments = await comment.find({ bug }).populate('user', 'name email').sort({ date: -1 });
            if (comments.length >= 0) {

                res.status(200).json(comments)
            } else {
                res.status(404).send("No data found");
            }
        } catch (error) {
            console.log("Internal server error:", error);
            res.status(500).json("Internal server error");
        }
    });

router.delete('/deletecomment/:id', async (req, res) => {

    // Find the note to be updated and update it
    try {
        let Item = await comment.findById(req.params.id);
        if (!Item) { return res.status(404).send({ success: true }) }

        Item = await comment.findByIdAndDelete(req.params.id)
        res.status(200).json({ success: true });

    } catch (error) {
        res.json("Internal server error")
    }
})

module.exports = router