// ------------------- Funções Exportadas ------------------- //
const forgotPwd = function (token) {
    return `<p><strong>Prezado</strong>,` +
        `</p><p>Voc&ecirc; est&aacute; recebendo este e-mail pois foi solicitada a recupera&ccedil;&atilde;o da sua senha no Tentacle.</p>` +
        `<p>Para alterar sua senha acesse a aba "Recuperação de senha" do seu aplicativo e utilize o token abaixo:</p>` +
        `<p>${token}</p>` +
        `<p>Caso voc&ecirc; n&atilde;o tenha solicitado esta a&ccedil;&atilde;o, favor desconsidere este e-mail.</p>` +
        `<p>&nbsp;</p>` +
        `<p>Atenciosamente,</p>` +
        `<p><span style="text-decoration: underline;"><em><strong>Equipe Tentacle</strong></em></span></p>`
};

const mediaRequested = function (gameName, mediaPlatform, requestedBy) {
    return `<p><strong>Prezado</strong>,` +
        `</p><p>Voc&ecirc; est&aacute; recebendo este e-mail pois ${requestedBy} solicitou o empr&eacute;stimo do jogo` +
        `${gameName} para a plataforma ${mediaPlatform}</p>` +
        `<p>Ao emprestar o jogo lembre-se de entrar na plataforma Tentacle e sinalizar seu jogo como emprestado aba "Meus Jogos".</p>` +
        `<p>&nbsp;</p>` +
        `<p>Atenciosamente,</p>` +
        `<p><span style="text-decoration: underline;"><em><strong>Equipe Tentacle</strong></em></span></p>`
};

const mediaLended = function (gameName, mediaPlatform, mediaOwnerName, estimatedReturnDate) {
    return `<p><strong>Prezado</strong>,` +
        `</p><p>Voc&ecirc; est&aacute; recebendo este e-mail pois ${mediaOwnerName} marcou o jogo que você solicitou como entregue assim iniciando o ` +
        `empr&eacute;stimo do mesmo.</p>` +
        `<p>&nbsp;</p>` +
        `<p>Jogo: ${gameName}</p>` +
        `<p>Plataforma: ${mediaPlatform}</p>` +
        `<p>&nbsp;</p>` +
        `<p>A data de devolu&ccedil;&atilde;o: ${estimatedReturnDate}.</p>` +
        `<p>&nbsp;</p>` +
        `<p>Atenciosamente,</p>` +
        `<p><span style="text-decoration: underline;"><em><strong>Equipe Tentacle</strong></em></span></p>`
};

const mediaReturned = function (gameName, mediaPlatform, mediaOwnerName) {
    return `<p><strong>Prezado</strong>,` +
        `</p><p>Voc&ecirc; est&aacute; recebendo este e-mail pois ${mediaOwnerName} marcou o jogo que você pegou emprestado como devolvido.</p>` +
        `<p>&nbsp;</p>` +
        `<p>Jogo: ${gameName}</p>` +
        `<p>Plataforma: ${mediaPlatform}</p>` +
        `<p>&nbsp;</p>` +
        `<p>Atenciosamente,</p>` +
        `<p><span style="text-decoration: underline;"><em><strong>Equipe Tentacle</strong></em></span></p>`
};

const askForRetur = function (gameName, mediaPlatform, mediaOwnerName) {
    return `<p><strong>Prezado</strong>,` +
        `</p><p>Voc&ecirc; est&aacute; recebendo este e-mail pois ${mediaOwnerName} está solicitando a devolução do jogo que você pegou emprestado.</p>` +
        `<p>&nbsp;</p>` +
        `<p>Jogo: ${gameName}</p>` +
        `<p>Plataforma: ${mediaPlatform}</p>` +
        `<p>&nbsp;</p>` +
        `<p>Atenciosamente,</p>` +
        `<p><span style="text-decoration: underline;"><em><strong>Equipe Tentacle</strong></em></span></p>`
};

// --------------------- Module Exports --------------------- //
module.exports = {
    'forgotPwd': forgotPwd,
    'mediaRequested': mediaRequested,
    'mediaLended': mediaLended,
    'mediaReturned': mediaReturned,
    'askForRetur': askForRetur
};
