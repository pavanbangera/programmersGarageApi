const express = require('express');
const router = express.Router();
const courses = require('../models/Course');
const tutorials = require('../models/Tutorial');


router.get('/search/:key', async (req, res) => {
    try {
        const searchRegex = new RegExp(req.params.key, 'i');
        const searchCourse = await courses.find({
            $or: [
                { title: searchRegex },
                { description: searchRegex },
            ],
        });
        const searchTutorial = await tutorials.find({
            $or: [
                { title: searchRegex },
                { content: searchRegex },
            ],
        });

        res.json({ course: searchCourse, tutorial: searchTutorial });
    } catch (error) {
        res.json(error)
    }
})

module.exports = router