const nodemailer = require('nodemailer');

const sendEmail = async options => {
    //Email Transporter setup
    const transporter = nodemailer.createTransport({
        host:process.env.EMAIL_HOST,
        port:process.env.HOST_PORT,
        auth:{
            user:process.env.EMAIL_USERNAME,
            pass:process.env.EMAIL_PASSWORD
        }
    });

    //Mail Options
    const mailOptions = {
        from:'kaushik roy <kaushik.roypara@gmail.com>',
        to:options.email,
        subject:options.subject,
        text:options.message
    };
    //Sending Email vai Transporter
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;