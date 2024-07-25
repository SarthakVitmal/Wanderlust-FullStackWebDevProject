const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router();
const { isLoggedIn, validateListing, isOwner, fileValidation } = require("../middleware.js");
const multer = require('multer')
const storage = require('../cloudConfig.js')
const upload = multer({storage})


const listingController = require("../controllers/listing.js");

// Index Route
router.get("/", wrapAsync(listingController.index));

// Create New Route
router.get("/new", isLoggedIn, listingController.createNew);
router.post(
  "/",
  isLoggedIn,
  upload.single("listing[image]"),
  fileValidation,
  wrapAsync(listingController.createListing)
);

//Search Listing
router.get("/search",wrapAsync(listingController.searchListing))


// Read/Show/View Route
router.get("/:id", wrapAsync(listingController.showListing));

// Update Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.updateListing)
);

// Delete Route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.deleteListing)
);
module.exports = router;
