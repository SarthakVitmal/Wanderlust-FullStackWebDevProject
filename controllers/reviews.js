const Listing = require('../models/listing')
const Review = require('../models/review')

module.exports.createReview = async(req,res) => {
    let listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New Review added")
    res.redirect(`/listings/${listing._id}`)
}

module.exports.deleteReview = async(req,res) => {
    const {id, reviewId} = req.params;
    //pull operator removes an existing array all instances of a value that matches a specified condition.
    await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}})
    const deleteReview = await Review.findById(reviewId);
    await Review.deleteOne({comment : deleteReview.comment})
    req.flash("success","Review deleted successfully")
    res.redirect(`/listings/${id}`)
}