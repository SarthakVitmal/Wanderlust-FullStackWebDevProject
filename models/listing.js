const mongoose = require('mongoose');
const Review = require('./review');
const { ref } = require('joi');
const listingSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
        maxLength : 200
    },
    description : {
        type : String,
        required : true
    },
    image : {
        url: String,
        filename: String,
    },
    price : {
        type : Number,
        required : true
    },
    location : {
        type : String,
        required : true
    },
    country : {
        type : String,
        required : true
    },
    reviews : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Review"
        },
    ],
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    geometry : {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
          },
          coordinates: {
            type: [Number],
            required: true
          }
    }
});

//If a listing is deleted and its associated reviews should also delete from 'reviews' collections
//Middleware
listingSchema.post("findOneAndDelete",async(listing) => {
    if(listing){
    await Review.deleteMany({_id : {$in : listing.reviews}})
    }
})
const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;