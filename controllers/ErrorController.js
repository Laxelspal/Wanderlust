const AppError = require("../utils/AppError");

const sendErrorDev =(err,req,res)=>{

    // A) API
    // console.log(req);
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    }

    // B) RENDERED WEBSITE
    console.error('ERROR 💥', err);
    let message =  err.message || "something went wrong! Please try again later."
    return res.status(err.statusCode).render("error.ejs", { message });
}

const sendErrorProd =(err,req,res)=>{
      // A) API
    if (req.originalUrl.startsWith('/api')) {

        // A) Operational, trusted error: send message to client
        if (err.isOperational) {
            return res.status(err.statusCode).json({
               status: err.status,
               message: err.message
            });
        }

        // B) Programming or other unknown error: don't leak error details
        // 1) Log error
        console.error('ERROR 💥', err);

        // 2) Send generic message
        return res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!'
        });
    }

    // B) RENDERED WEBSITE
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
        console.log(err);
        let message =err.message;
        return res.status(err.statusCode).render("error.ejs", { message });
    }

    // B) Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error('ERROR 💥', err);
    // 2) Send generic message

    let message ="something went wrong! Please try again later."
    return res.status(err.statusCode).render("error.ejs", { message });
}

const handleCastErrorDB = err=>{
    const message = `Invalid ${err.path} :${err.value} `;
    return new AppError(message,400);
}

const handleDuplicateFieldsDB =err=>{
    let value = err.message.match(/{([^}]*)}/)[0];
    const message = `Duplicate field value for ${value}. Please use another one.`;
    return new AppError(message,400);
}
  
const handleValidationErrorDB =err =>{
     const errors =  Object.values(err.errors).map(el=>el.message);
     const message = `Invalid input data. ${errors.join('. ')}`;
     return new AppError(message,400);
}
  
const handleJwtTokenError =()=>{
    return new AppError("Invalid Token. Please login again !",401);
}
const handleJwtExpireError=()=>{
    return new AppError("Token has been expired. Please login again!",401)
}


module.exports =(err,req,res,next)=>{
    err.statusCode = err.statusCode|| 500;
    err.status=err.status|| "error";

    if(process.env.NODE_ENV==='development'){
       return sendErrorDev(err,req,res);
    }

    else if(process.env.NODE_ENV==='production'){
        let message =err.stack.split('\n')[0]; 
        let error = {...err};
        error.message = error.message || message;
        
        if(err.name==='CastError'){
            error =handleCastErrorDB(error);
        }
        if(err.code ===11000){
            error = handleDuplicateFieldsDB(error);
        }
        if(err.name==="ValidationError"){
            error = handleValidationErrorDB(error);
        }
        if(err.name === "JsonWebTokenError"){
            error = handleJwtTokenError();
        }
        if(err.name === "TokenExpiredError"){
            error = handleJwtExpireError();
        }
    
        sendErrorProd(error,req,res);
    }
}