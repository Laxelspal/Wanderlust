const nodemailer = require("nodemailer");

const sendEmail = async(options)=>{

    //1) Create a transproter
    let transporter;
    // transporter= nodemailer.createTransport({
    //           service: 'gmail',
    //           auth: {
    //             user: process.env.GAMIL_NAME,
    //             pass: process.env.GMAIL_PASSWORD
    //           }
    // });
    if (process.env.NODE_ENV === 'production') {
        // Sendgrid
        transporter= nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.GAMIL_NAME,
            pass: process.env.GMAIL_PASSWORD
          }
        });
    }
    else{
        transporter = nodemailer.createTransport({
            host:process.env.MAILTRAP_EMAIL_HOST,
            port:process.env.MAILTRAP_EMAIL_PASSWORD,
            auth:{
                user:process.env.MAILTRAP_EMAIL_USERNAME,
                pass:process.env.MAILTRAP_EMAIL_PASSWORD,
            }
        });
    }

    //2) Define the email options
    const mailOptions={
        from:"Laxmi Pal <hellow@laxmi.io>",
        to:options.email,
        subject:options.subject,
        text:options.message
        //html
    };
   
    //Actually send Email
    await transporter.sendMail(mailOptions);
}

module.exports=sendEmail;