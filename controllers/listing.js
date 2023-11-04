const { response } = require("express");
const Listing = require("../Model/Listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken =  process.env.MAP_TOKEN;

const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.Index=async(req,res)=>{
    let data = await Listing.find({});
    res.render("listings/index.ejs",{data});
}

module.exports.Search = async(req,res)=>{
    let term = req.query.searchWord;
    let data =  await Listing.find({$text:{$search: `"${term}"` }});
    res.render("listings/index.ejs",{data});
}

module.exports.renderNewListing =(req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.Filter = async(req,res)=>{
    let category_type = req.params.id;
    let data = await Listing.find({category: category_type});
    res.render("listings/index.ejs",{data});
};

module.exports.addListing =async(req,res,next)=>{

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send();


    let url = req.file.path;
    let filename =req.file.filename;
    let newlisting =  new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image={url,filename};

    newlisting.geometry=response.body.features[0].geometry;

    let savedListing= await newlisting.save();
    console.log(savedListing);
    req.flash("success","New listing is added");
    res.redirect("/listings");
};

module.exports.updateListing= async(req,res)=>{
    let {id}= req.params;
    let listing= await Listing.findByIdAndUpdate(id,{...req.body.listing});
    
    if( typeof req.file != "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }

    req.flash("success"," Listing is updated");
    res.redirect(`/listings/${id}`);
};


module.exports.editListing = async(req,res)=>{
    let {id}= req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exit");
        res.redirect("/listings");
    }

    let originalImageUrl  = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/h_200");
    res.render("listings/edit.ejs",{listing, originalImageUrl});
};

module.exports.showListing=async(req,res)=>{
    let {id} = req.params;
    let data = await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:({
            path:"author",
        })
    })
    .populate("owner");
    if(!data){
        req.flash("error","Listing you requested for does not exit");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{data});
};

module.exports.destroyListing=async(req,res)=>{
    let {id}= req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success"," Listing is Deleted");
    res.redirect("/listings");
};