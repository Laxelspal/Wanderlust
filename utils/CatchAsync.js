module.exports= (fu)=>{
    return (req,res,next)=>{
        fu(req,res,next).catch(next);
    }
}