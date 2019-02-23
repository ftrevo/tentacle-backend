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

const loanReminder = async function (request, response, next) {
    try {
        await send(
            response.locals.data.mediaOwner.email,
            'Empréstimo de jogo',
            mailTemplates.mediaRequested(
                response.locals.data.game.name,
                response.locals.data.media.platform,
                response.locals.data.requestedBy.name
            )
        );
        next();
    } catch (error) {
        //TODO Ver com Letícia como notificar o não envio de e-mail.
        console.log(error);
        next();
    }
};

const rememberDelivery = async function (request, response, next) {
    try {
        await send(
            response.locals.data.requestedBy.email,
            'Lembrete de devolução de jogo',
            mailTemplates.rememberDelivery(
                response.locals.data.game.name,
                response.locals.data.media.platform,
                response.locals._USER.name)
        );

        next();
    } catch (error) {
        next(error);
    }
};

// --------------------- Funções Locais --------------------- //
function send(to, subject, html) {
    let transporter = getTransporter();

    let mailOptions = {
        'from': `Tentacle 🐙 <${process.env.SMTP_USER}>`,
        'to': to,
        'subject': subject,
        'html': html
    };

    return transporter.sendMail(mailOptions);
};

function getTransporter() {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        }
    });
};

// --------------------- Module Exports --------------------- //
module.exports = {
    'forgotPwd': forgotPwd,
    'loanReminder': loanReminder,
    'rememberDelivery': rememberDelivery
};
