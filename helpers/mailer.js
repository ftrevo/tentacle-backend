// ----------------- Import de dependências ----------------- //
const mailTemplates = require('./mail-templates');
const nodemailer = require('nodemailer');

// ------------------- Funções Exportadas ------------------- //
const forgotPwd = async function (request, response, next) {
    try {
        await send(request.body.email, 'Recuperação de senha', mailTemplates.forgotPwd(request.body.token));
        next();
    } catch (error) {
        next(error);
    }
};

// --------------------- Funções Locais --------------------- //
function send(to, subject, html) {
    let transporter = getTransporter();

    let mailOptions = {
        'from': `Tentacle 🐙 <${process.env.EMAIL_SENDER}>`,
        'to': to,
        'subject': subject,
        'html': html
    };

    return transporter.sendMail(mailOptions);
};

function getTransporter() {
    return nodemailer.createTransport({
        host: process.env.EMAIL_SMTP,
        port: process.env.EMAIL_PORT,
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        }
    });
};

// --------------------- Module Exports --------------------- //
module.exports = {
    'forgotPwd': forgotPwd
};
