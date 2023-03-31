const mongoose = require("mongoose");

// Define the Emedded Schema (NOT MODEL)
const reviewSchema = new mongoose.Schema(
    {
        content: String,
        rating: { type: Number, min: 1, max: 5, default: 5 },
        // a review belongs to a user, One user has many reviews
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        username: String,
        userAvatar: String
    },
    {
        timestamps: true,
    }
);

// Schema is a guard on our collection that says
// everytime we want to add a document (object) to our collection
// in mongodb, it must have this shape,
// keys must be the same name, and the values must be of the type Specified below (String, Number, Boolean, etc)
const trailSchema = new mongoose.Schema(
    {
        // All this code is
        // mongoose Schema code,
        // Field types in Mongoose Schemas? google
        title: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true
        },
        businessHours: String,
        reviews: [reviewSchema], // One Movie HAS MANY reviews, Using embedding in Mongoose
        distance: String,
        difficultyLevel: String,


    },
    


);

module.exports = mongoose.model("Trail", trailSchema);
// mongoose.model method does two things
// 1. Creates a collection (The bucket) in mongodb named movies, and it says that all the movie Documents
// that we create need to have the shape of our schema

// 2. Returns an object which is our "Model", which we will use in our controller to perform CRUD operations
// on our database, when our server recieves an http request