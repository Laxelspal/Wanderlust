const { response } = require("express");
const Listing = require("../Model/Listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken =  process.env.MAP_TOKEN;

const geocodingClient = mbxGeocoding({ accessToken: mapToken });
const cloudinary =require("../cloudConfig.js");

module.exports.Index=async(req,res)=>{
    let data = await Listing.find({});
    let currUser =res.locals.currUser;
    console.log(currUser);
    res.render("listings/index.ejs",{data,currUser});
}

module.exports.Search = async(req,res)=>{
    let term = req.query.searchWord;
    console.log(term);
    let response = await geocodingClient.forwardGeocode({
        query: term,
        limit: 1
      })
        .send();

    let  term_geometry=response.body.features[0].geometry;   

    let data =  await Listing.find({$text: {$search : term}});
    console.log(data);
    res.render("listings/search.ejs",{data,term,term_geometry});
    
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

    let newlisting =  new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.geometry=response.body.features[0].geometry;
    
           
    let fileslist =[];
    for(let i=0;i<req.files.length;i++){
        let {path} = req.files[i];
        let newPath = await cloudinary.uploads(path);
        fileslist.push(newPath.url);
    }
    newlisting.Images =fileslist;
    let savedListing= await newlisting.save();
    console.log(savedListing);
    req.flash("success","New listing is added");
    res.redirect("/listings");
};

module.exports.updateListing= async(req,res)=>{
    let {id}= req.params;
    let listing= await Listing.findByIdAndUpdate(id,{...req.body.listing});
    
    if( typeof req.files != "undefined"){
        let fileslist =[];
        for(let i=0;i<req.files.length;i++){
            let {path} = req.files[i];
            let newPath = await cloudinary.uploads(path);
            fileslist.push(newPath.url);
        }
        listing.Images = fileslist;
    }
    await listing.save();

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

    let returnUrl  = listing.Images;
    let originalUrl =[];
    for(let url of returnUrl) {
       originalUrl.push(url.replace("/upload","/upload/h_200"));
    }
    res.render("listings/edit.ejs",{listing, originalUrl});
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