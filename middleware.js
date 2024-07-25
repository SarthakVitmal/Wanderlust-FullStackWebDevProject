const { listingSchema, reviewSchema } = require('./schema');
const ExpressError = require("./utils/ExpressError");
const Listing = require('./models/listing');
const Review = require('./models/review');


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', "Please login!");
        return res.redirect('/login');
    }
    next();
};

module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.details.map(el => el.message).join(', '));
    } else {
        next();
    }
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    const currentUser = req.user;
    if (currentUser && !listing.owner.equals(currentUser._id)) {
        req.flash('error', "You don't have permission to edit");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.details.map(el => el.message).join(', '));
    } else {
        next();
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currentUser._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.fileValidation = async(req,res,next) => {
    if(req.file && req.file.size > 400 * 1024){
        req.flash("error","Image size should be less than 400KB");
        return res.redirect("/listings/new");
    }
    next();
}