const express = require("express");
const app = express();
const mongoose = require("mongoose");
const logger = require("morgan");

var PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", { useNewUrlParser: true });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const path = require("path");
const db = require("./models");


app.get("/exercise", function (req, res) {
    res.sendFile(path.join(__dirname + "/public/exercise.html"))
});

app.get("/stats", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/stats.html"))
});

app.get("/api/workouts", (req, res) => {
    db.Workout.find({}).populate("exercises")

    .then(workout => {
        // psuedo code
        // console.log(workout);
        // console.log(res);

        let newWorkoutArray = [];
        for(let i = 0; i < workout.length; i++) {
            let newWorkoutObject;
            let totalDuration = 0;

            for (let j = 0; j < workout[i].exercises.length; j++) {
                totalDuration += workout[i].exercises[j].duration;
            }
            newWorkoutObject = { day: workout[i].day, exercises: workout[i].exercises, totalDuration: totalDuration, _id: workout[i]._id }
            // console.log(newWorkoutObject);
            newWorkoutArray.push(newWorkoutObject);
        }
        console.log(newWorkoutArray);
        res.json(newWorkoutArray);

    })
    .catch(err => {
        // console.log(err);
        res.json(err);
    });
});

app.put("/api/workouts/:id", (req, res) => {
    db.Exercise.create(req.body) 
        .then((data) => {
            console.log(data);
            db.Workout.findOneAndUpdate({ _id: req.params.id }, {$push: {exercises: mongoose.Types.ObjectId(data._id)}}, { new: true })
                .then(exerciseData => {
                    console.log(exerciseData);
                    res.json(exerciseData);
                })
                    .catch(err => {
                        console.log(err);
                        res.json(err);
                    });

            // res.json(exerciseData)
        });
});

app.post("/api/workouts", (req, res) => {
    db.Workout.create({})
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        })
});

app.get("/api/workouts/range", (req, res) => {
    db.Workout.find({}).limit(7).populate("exercises")
        .then(data => {
            res.json(data);
            console.log(data);
        })
            .catch(err => {
                res.json(err);
                console.log(err);
            })
});



app.listen(PORT, () => {
    console.log(`The server is listening on port ${PORT}...`);
});