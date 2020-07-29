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
    res.sendFile(__dirname + "/public/exercise.html")
});

app.get("/stats", (req, res) => {
    res.sendFile(__dirname + "/public/stats.html")
});

app.get("/api/workouts", (req, res) => {
    db.Workout.find({}).populate("exercises")

    .then(workout => {
        // psuedo code
        console.log(workout);
        console.log(res);

        let newWorkoutArray = [];
        for(let i = 0; i < workout.length; i++) {
            let newWorkoutObject;
            // let duration;
            for (let j = 0; workout[i].exercises.length; j++) {
                totalDuration += workout[i].exercises[j].duration;
            }
            newWorkoutObject = { day: workout[i].day, exercise: workout[i].exercises, duration: duration }

            newWorkoutArray.push(newWorkoutObject);
        }
        res.json(workout);

    })
    .catch(err => {
        res.json(err);
    });
});

app.put("/api/workouts/:id", (req, res) => {
    db.Exercise.create(req.body) 
        .then((exerciseData) => {
            db.Workout.findOneAndUpdate({ _id: req.params.id }, {exercises: exerciseData._id }, { new: true })
                .then(data => {
                    res.json(data);
                })
                    .catch(err => {
                        res.json(err);
                    });

            // res.json(exerciseData)
        });
});

app.post("/api/workouts", (req, res) => {
    db.Workout.create(req.body)
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