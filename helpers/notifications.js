// ----------------- Import de dependências ----------------- //
const requestPromise = require('request-promise');
const nodemailer = require('nodemailer');
const mailTemplates = require('./mail-templates');

// ------------------- Funções Exportadas ------------------- //
const forgotPwd = async function (request, response, next) {
    try {
        await send(response.locals.data.email, 'Recuperação de senha', mailTemplates.forgotPwd(request.body.token), true);
        next();
    } catch (error) {
        next(error);
    }
};

const loanReminder = async function (request, response, next) {
    try {
        let notificationSent = false;

        if (response.locals.notificationTo.token) {

            notificationSent = await sendNotification(
                response.locals.notificationTo.token.deviceToken,
                'Empréstimo solicitado',
                `O seu jogo ${response.locals.data.game.name} para a plataforma ${response.locals.data.media.platform} ` +
                `foi solicitado por ${response.locals.data.requestedBy.name}. Ao entregar o jogo não esqueça de registrar na aba 'Meus Jogos'.`
            );
        }

        if (!notificationSent) {
            await send(
                response.locals.data.mediaOwner.email,
                'Empréstimo solicitado',
                mailTemplates.mediaRequested(
                    response.locals.data.game.name,
                    response.locals.data.media.platform,
                    response.locals.data.requestedBy.name
                )
            );
        }

        next();
    } catch (error) {
        next();
    }
};

const rememberDelivery = async function (request, response, next) {
    try {
        let notificationSent = false;

        if (response.locals.notificationTo.token) {
            notificationSent = await sendNotification(
                response.locals.notificationTo.token.deviceToken,
                'Lembrete de devolução',
                `${response.locals._USER.name} está solicitando a devolução do jogo ` +
                `${response.locals.data.game.name} para a plataforma ${response.locals.data.media.platform} que você pegou emprestado.`
            );
        }

        if (!notificationSent) {
            await send(
                response.locals.data.requestedBy.email,
                'Lembrete de devolução de jogo',
                mailTemplates.rememberDelivery(
                    response.locals.data.game.name,
                    response.locals.data.media.platform,
                    response.locals._USER.name
                )
            );
        }

        next();
    } catch (error) {
        next(error);
    }
};

const mediaRemoved = async function (request, response, next) {
    try {
        if (request.body.loanId) {
            let notificationSent = false;

            if (response.locals.notificationTo.token) {
                notificationSent = await sendNotification(
                    response.locals.notificationTo.token.deviceToken,
                    'Indisponibilização de jogo',
                    `O jogo ${response.locals.data.game.name} para a plataforma ${response.locals.data.platform} ` +
                    `que você solicitou foi indisponibilizado por ${response.locals._USER.name}. ` +
                    `Para pesquisar a disponibilidade de outras mídias para este jogo olhe a aba 'Biblioteca'.`
                );
            }

            if (!notificationSent) {
                await send(
                    request.body.loanRequestedByEmail,
                    'Indisponibilização de jogo',
                    mailTemplates.mediaRemoved(
                        response.locals.data.game.name,
                        response.locals.data.platform,
                        response.locals._USER.name
                    )
                );
            }
        }

        next();
    } catch (error) {
        next();
    }
};

const loanChanged = async function (request, response, next) {
    try {

        if (response.locals.notificationTo.token) {
            let titleComplement = 'entregue';

            if (response.locals.data.returnDate) {
                titleComplement = 'devolvido'
            }

            notificationSent = await sendNotification(
                response.locals.notificationTo.token.deviceToken,
                'Jogo ' + titleComplement,
                `O jogo ${response.locals.data.game.name} para a plataforma ${response.locals.data.media.platform} ` +
                `que você solicitou foi marcado como ${titleComplement} por ${response.locals._USER.name}.`
            );
        }

        next();
    } catch (error) {
        next();
    }
};

// ------------------- Funções Notificação ------------------ //
async function sendNotification(userToken, title, body) {
    let response = await requestPromise(getOptions(userToken, title, body));

    if (response.statusCode !== 200) {
        return false;
    }

    let bodyObject = JSON.parse(response.body);

    return bodyObject.success === 1;
};

function getOptions(userTokens, title, body) {
    return {
        method: 'POST',
        uri: process.env.FIREBASE_NOTIFICATION_ENDPOINT,
        simple: false,
        resolveWithFullResponse: true,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'key=' + process.env.FIREBASE_SERVER_KEY
        },
        body: JSON.stringify({
            'notification': {
                'title': title,
                'body': body
            },
            'to': userTokens
        })
    };
};

// --------------------- Funções E-mail --------------------- //
function send(to, subject, html, isForgotPwd) {
    let transporter = getTransporter();

    let mailOptions = {
        'from': `Tentacle 🐙 <${process.env.SMTP_USER}>`,
        'to': to,
        'subject': subject,
        'html': html
    };

    if (isForgotPwd || process.env.ENABLE_EMAIL === 'true') {
        return transporter.sendMail(mailOptions);
    }
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
    'rememberDelivery': rememberDelivery,
    'mediaRemoved': mediaRemoved,
    'loanChanged': loanChanged
};
