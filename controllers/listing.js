const Listing = require('../models/listing.js');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res, next) => {
    const allListings = await Listing.find({});
    res.render("index.ejs", { allListings });
}

module.exports.createNew = async(req, res) => {
    res.render("new.ejs");
}

module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const viewlisting = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!viewlisting) {
        req.flash("error", "Listing Not Found!");
        return res.redirect('/listings');
    }
    if (viewlisting) {
        res.render("viewListings", { viewlisting });
    }
}

module.exports.createListing = async (req, res) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
    .send()
    const url = req.file.path;
    const filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.image = {url,filename};
    newListing.owner = req.user._id;
    newListing.geometry = response.body.features[0].geometry;
    await newListing.save();
    req.flash('success', "New Listing Created!")
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing Not Found!");
        return res.redirect('/listings');
    }
    let originalImageUrl = listing.image.url;
    lowerQualityImage = originalImageUrl.replace("/upload","/upload/h_300,w_250")
    res.render("edit.ejs", { listing , lowerQualityImage });
}

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const { title, description, image, price, location, country } = req.body.listing;
    const updateData = {title,description,price,location,country} 
    if(req.file){
        const url = req.file.path;
        const filename = req.file.filename;
        updateData.image = {url,filename};
    }
    await Listing.findByIdAndUpdate(
        id,
        updateData,
        { runValidators: true, new: true }
    );
    req.flash("success", "Listing details updated successfully");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req, res, next) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', "Listing deleted successfully");
    res.redirect("/listings");
}

module.exports.searchListing = async (req, res) => {
    const searchTerm = req.query.q;
    console.log("Search Term:", searchTerm);

    if (!searchTerm) {
        req.flash('error', "Please provide what you want to search");
        return res.redirect('/listings');
    }
    try {
        const regex = new RegExp(searchTerm, 'i'); 
        const resultListings = await Listing.find({
            $or: [
                { name: regex },
                { description: regex },
                { country : regex }
            ]
        });
        if (resultListings.length === 0) {
            req.flash('error', `No Listings Found with ${searchTerm}`);
            return res.redirect('/listings');
        }
        res.render('searchListings', { resultListings ,searchTerm});
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};
