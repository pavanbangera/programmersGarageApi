const express = require('express')
const router = express.Router();
const tutorial = require('../models/Tutorial')

router.post("/addtutorial", async (req, res) => {
    const { title, image, content } = req.body;
    try {
        const saveTutorial = await tutorial.create({
            title,
            image,
            content
        })
        if (saveTutorial)
            return res.status(200).send(saveTutorial)
        else {
            return res.status(400).send(saveTutorial)
        }
    }
    catch (err) {
        console.log("Some error occures")
        return res.status(500).send("somthing happend")
    }
})

router.get("/getTutorial", async (req, res) => {
    try {
        const saveTutorial = await tutorial.find();
        if (saveTutorial.length > 0) {
            res.status(200).send(saveTutorial);
        } else {
            res.status(404).send("No tutorial found");
        }
    }
    catch (err) {
        console.log("Some error occures")
        return res.status(500).send("somthing happend")
    }
})
router.get("/getTutorialDetail/:id", async (req, res) => {

    try {
        const saveTutorial = await tutorial.find({ _id: req.params.id });
        if (saveTutorial.length > 0) {
            res.status(200).send(saveTutorial);
        } else {
            res.status(404).send("No data found");
        }
    }
    catch (err) {
        console.log("Some error occures")
        return res.status(500).send("somthing happend")
    }
})

router.delete('/deleteTutorial/:id', async (req, res) => {

    // Find the note to be updated and update it
    try {
        let Item = await tutorial.findById(req.params.id);
        if (!Item) { return res.status(404).send("Not Found") }

        Item = await tutorial.findByIdAndDelete(req.params.id)
        res.json({ Item });

    } catch (error) {
        res.json("Internal server error")
    }
})

router.put('/updateTutorial/:id', async (req, res) => {
    const { title, image, content } = req.body;
    // Create a newNote object
    const newItem = {};
    if (title) { newItem.title = title };
    if (image) { newItem.image = image };
    if (content) { newItem.content = content };

    // Find the note to be updated and update it
    try {
        let Item = await tutorial.findById(req.params.id);
        if (!Item) { return res.status(404).send("Not Found") }


        Item = await tutorial.findByIdAndUpdate(req.params.id, { $set: newItem }, { new: true })
        res.json({ Item });

    } catch (error) {
        res.json("Internal server error")
    }
})

router.get("/countTutorial", async (req, res) => {
    try {
        const count = await tutorial.countDocuments();
        res.send(count.toString());
    } catch (err) {
        console.log("Some error occurred");
        return res.status(500).send("Something happened");
    }
});

module.exports = router