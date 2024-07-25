const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router({ mergeParams: true });
const { isLoggedIn, validateReview,isReviewAuthor } = require("../middleware.js");
const reviewsController = require("../controllers/reviews.js");

//Review Route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewsController.createReview)
);

//Review Delete Route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewsController.deleteReview)
);
module.exports = router;
