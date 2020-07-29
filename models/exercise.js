const mongoose = require("mongoose");
const { StringDecoder } = require("string_decoder");
const Schema = mongoose.Schema;

let ExerciseSchema = new Schema ({
    name: {
        type: String
    },
    
    type: {
        type: String
    },

    weight: {
        type: Number
    },

    sets: {
        type: Number
    },

    reps: {
        type: Number
    },

    duration: {
        type: Number
    },

    distance: {
        type: Number
    }

});

const Exercise = mongoose.model("Exercise", ExerciseSchema);
module.exports = Exercise;