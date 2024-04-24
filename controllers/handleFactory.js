
const AppError = require("../utils/AppError.js");
const CatchAsync = require("../utils/CatchAsync.js");
const ApiFeatures = require("../utils/ApiFreatures.js");

module.exports.deleteOne = Model => CatchAsync(async(req,res,next)=>{
    const doc =await Model.findByIdAndDelete(req.params.id);

    if(!doc){
        return next(new AppError('No document found with this ID',404));
    }
    if(req.originalUrl.startsWith('/api')){
        return res.status(204).json({
            status:"success",
            data:null
        })
    }
    req.flash("success","Document deleted successfully");
    res.redirect("/listings");
});

module.exports.updateOne =Model=>CatchAsync(async(req,res,next)=>{
    // console.log(req.body);
    const doc = await Model.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
    if(!doc){
        return next(new AppError('No document found with this ID',404));
    }
    if(req.originalUrl.startsWith('/api')){
        return res.status(200).json({
            status:"success",
            data:{
                doc
            }
        });
    }
    req.flash("success","Document Updated successfully");
    res.redirect("/listings");

});

module.exports.getOne = (Model,popOptions) =>CatchAsync(async(req,res,next)=>{
    let query =  Model.findById(req.params.id);

    if(popOptions){
        query=query.populate(popOptions);
    }

    const doc = await query;
    if(!doc){
        return next(new AppError('No document found with this ID',404));
    }
    res.status(200).json({
        status:"success",
        data:{
            doc
        }
    })
});

module.exports.createOne = Model=>CatchAsync(async(req,res,next)=>{
    // console.log(req.body);
    const doc = await Model.create(req.body);
    if(req.originalUrl.startsWith('/api')){
        return res.status(200).json({
            status:"success",
            data:doc
        })
    }
    req.flash("success","Document added  successfully");
    res.redirect("/listings");
});

module.exports.getAll =Model =>CatchAsync(async(req,res,next)=>{
    // To allow for nested GET reviews on tour (hack)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    let features = new ApiFeatures(Model.find(filter), req.query).filter().sort().limitFields().Paginate();
      
    const documents = await features.query;
    
    res.status(200).json({
        status:"success",
        results:documents.length,
        data:{
            documents
        }
    })
});