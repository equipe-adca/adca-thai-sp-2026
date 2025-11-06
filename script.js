// ------------------------------------
// FUNÇÕES DE NAVEGAÇÃO E ERRO
// ------------------------------------

function mostrarSecao(id) {
    document.querySelectorAll('section').forEach(secao => secao.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

// Mostra a mensagem de erro inline
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorSpan = document.getElementById('error-' + fieldId);
    if (field) field.classList.add('error-border');
    if (errorSpan) {
        errorSpan.textContent = message;
        errorSpan.classList.add('active');
    }
}

// Esconde a mensagem de erro
function hideError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorSpan = document.getElementById('error-' + fieldId);
    if (field) field.classList.remove('error-border');
    if (errorSpan) {
        errorSpan.textContent = '';
        errorSpan.classList.remove('active');
    }
}

// Limpa todos os erros de um formulário específico
function hideAllErrors(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.querySelectorAll('.error-message').forEach(span => span.classList.remove('active'));
    form.querySelectorAll('.error-border').forEach(input => input.classList.remove('error-border'));
}


// ------------------------------------
// LÓGICA DE IDADE (TELA INICIAL)
// ------------------------------------
function verificarIdade() {
    hideError('nome');
    hideError('idade');

    const nomeAluno = document.getElementById("nome").value.trim();
    const idadeInput = document.getElementById("idade");
    const idade = parseInt(idadeInput.value);
    
    let isValid = true;

    if (!nomeAluno) {
        showError('nome', 'Por favor, preencha o nome completo.');
        isValid = false;
    }
    
    if (isNaN(idade) || idade <= 0) {
        showError('idade', 'Por favor, digite uma idade válida.');
        isValid = false;
    } else if (idade < 12) {
        showError('idade', 'Idade mínima para inscrição é 12 anos.');
        isValid = false;
    } else if (idade > 80) {
        showError('idade', 'Idade máxima para inscrição é 80 anos.');
        isValid = false;
    }
    
    if (!isValid) return; 

    if (idade < 18) {
        mostrarSecao('ficha-menor');
        document.getElementById("aluno-menor").value = nomeAluno;
        atualizarTermo();
    } else {
        mostrarSecao('ficha-adulto');
        document.getElementById("nome-adulto").value = nomeAluno;
        atualizarTermoAdulto(); 
    }
}

// ------------------------------------
// FUNÇÕES AUXILIARES DE VALIDAÇÃO
// ------------------------------------
function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function validarTelefoneCompleto(telefone) {
    const telLimpo = telefone.replace(/\D/g, '');
    return telLimpo.length >= 10 && telLimpo.length <= 11; 
}

function getFormattedDate() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); 
    const yyyy = today.getFullYear();
    return dd + '/' + mm + '/' + yyyy;
}

function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false; 
    let soma = 0, resto;
    for (let i = 1; i <= 9; i++) soma = soma + parseInt(cpf.substring(i-1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    soma = 0;
    for (let i = 1; i <= 10; i++) soma = soma + parseInt(cpf.substring(i-1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    return true;
}

function validarNumero(numeroStr) {
    const numero = numeroStr.trim();
    if (numero.length === 0) return false; 
    if (numero.toLowerCase() === 's/n') return true;
    return /\d/.test(numero);
}

function validarDataNascimento() {
    const input = document.getElementById("dataNascimento");
    if (!input.value) return "Por favor, preencha a data de nascimento.";

    const dataNascimento = new Date(input.value);
    const hoje = new Date();
    let idade = hoje.getFullYear() - dataNascimento.getFullYear();
    const mes = hoje.getMonth() - dataNascimento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoje.getDate() < dataNascimento.getDate())) {
        idade--;
    }
    
    if (idade < 18 || idade > 80) {
        return "A data de nascimento deve indicar que você tem entre 18 e 80 anos.";
    }
    return null; // Sem erros
}

function validarMenor() {
    const input = document.getElementById("data-menor");
    if (!input.value) return "Por favor, preencha a data de nascimento.";

    const dataNascimento = new Date(input.value);
    const hoje = new Date();
    let idade = hoje.getFullYear() - dataNascimento.getFullYear();
    const mes = hoje.getMonth() - dataNascimento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoje.getDate() < dataNascimento.getDate())) {
        idade--;
    }
    
    if (idade < 12 || idade >= 18) {
        return "Somente menores entre 12 e 17 anos podem preencher esta ficha.";
    }
    return null; // Sem erros
}


// ------------------------------------
// VALIDAÇÕES DE FORMULÁRIO COMPLETAS
// ------------------------------------

function validarFichaAdulto() {
    let isValid = true;
    hideAllErrors('ficha-adulto'); 

    if (document.getElementById('horario-adulto').value === "") {
        showError('horario-adulto', 'Por favor, selecione um horário.');
        isValid = false;
    }
    if (!validarEmail(document.getElementById('email-adulto').value)) {
        showError('email-adulto', 'E-mail inválido.');
        isValid = false;
    }
    if (!validarTelefoneCompleto(document.getElementById('tel-aluno-adulto').value)) {
        showError('tel-aluno-adulto', 'Telefone incompleto (Ex: (11) 98888-7777).');
        isValid = false;
    }
    const erroData = validarDataNascimento();
    if (erroData) {
        showError('dataNascimento', erroData);
        isValid = false;
    }
    if (document.getElementById('rg-adulto').value.replace(/\D/g, '').length < 9) {
        showError('rg-adulto', 'RG incompleto.');
        isValid = false;
    }
    if (!validarCPF(document.getElementById('cpf-adulto').value)) {
        showError('cpf-adulto', 'CPF inválido. Verifique os dígitos.');
        isValid = false;
    }
    if (document.getElementById('cep-adulto').value.length < 9) {
         showError('cep-adulto', 'CEP incompleto.');
         isValid = false;
    }
    if (!validarNumero(document.getElementById('numero-adulto').value)) {
        showError('numero-adulto', "Número inválido (use 's/n' se não houver).");
        isValid = false;
    }
    if (!validarTelefoneCompleto(document.getElementById('tel-emergencia-adulto').value)) {
        showError('tel-emergencia-adulto', 'Telefone de emergência incompleto.');
        isValid = false;
    }
    
    // Validação de reCAPTCHA (agora verificada pelo Formspree no servidor, mas 
    // podemos checar se o usuário *clicou* para evitar um envio desnecessário)
    if (grecaptcha.getResponse(0).length === 0) { 
        showError('recaptcha-adulto', 'Por favor, marque "Não sou um robô".');
        isValid = false;
    }

    if (!isValid) {
        const firstError = document.querySelector('#ficha-adulto .error-message.active');
        if (firstError) {
            firstError.previousElementSibling.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    return isValid; 
}

function validarFichaMenor() {
    let isValid = true;
    hideAllErrors('ficha-menor'); 

    if (!validarCPF(document.getElementById('cpf-aluno').value)) {
        showError('cpf-aluno', 'CPF do aluno inválido.');
        isValid = false;
    }
    if (document.getElementById('rg-aluno').value.replace(/\D/g, '').length < 9) {
        showError('rg-aluno', 'RG do aluno incompleto.');
        isValid = false;
    }
    const erroData = validarMenor();
    if (erroData) {
        showError('data-menor', erroData);
        isValid = false;
    }
    if (document.getElementById('cep-menor').value.length < 9) {
         showError('cep-menor', 'CEP incompleto.');
         isValid = false;
    }
    if (!validarNumero(document.getElementById('numero-menor').value)) {
        showError('numero-menor', "Número inválido (use 's/n' se não houver).");
        isValid = false;
    }

     if (!validarEmail(document.getElementById('email-resp').value)) {
        showError('email-resp', 'E-mail do responsável inválido.');
        isValid = false;
    }
    if (!validarTelefoneCompleto(document.getElementById('tel-resp').value)) {
        showError('tel-resp', 'Telefone do responsável incompleto.');
        isValid = false;
    }
    if (document.getElementById('rg-resp').value.replace(/\D/g, '').length < 9) {
        showError('rg-resp', 'RG do responsável incompleto.');
        isValid = false;
    }
    if (!validarCPF(document.getElementById('cpf-resp').value)) {
        showError('cpf-resp', 'CPF do responsável inválido.');
        isValid = false;
    }

    // Validação de reCAPTCHA (agora verificada pelo Formspree no servidor)
    if (grecaptcha.getResponse(1).length === 0) { 
        showError('recaptcha-menor', 'Por favor, marque "Não sou um robô".');
        isValid = false;
    }
    
    if (!isValid) {
        const firstError = document.querySelector('#ficha-menor .error-message.active');
        if (firstError) {
            firstError.previousElementSibling.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    return isValid; 
}


// ------------------------------------
// API DE ENDEREÇO (VIA CEP)
// ------------------------------------
function buscarEndereco(tipo) {
    const cepInput = document.getElementById(`cep-${tipo}`);
    hideError(`cep-${tipo}`); 
    const cep = cepInput.value.replace(/\D/g, '');
    if (cep.length !== 8) return;
    
    document.getElementById(`rua-${tipo}`).value = 'Buscando...';
    document.getElementById(`bairro-${tipo}`).value = '';
    document.getElementById(`cidade-${tipo}`).value = '';
    document.getElementById(`estado-${tipo}`).value = '';

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
            if (!data.erro) {
                if (data.uf && data.uf.toUpperCase() !== 'SP') {
                    showError(`cep-${tipo}`, "CEP fora de São Paulo. Apenas CEPs de SP são permitidos.");
                    cepInput.value = ''; 
                    document.getElementById(`rua-${tipo}`).value = '';
                    document.getElementById(`bairro-${tipo}`).value = '';
                    document.getElementById(`cidade-${tipo}`).value = '';
                    document.getElementById(`estado-${tipo}`).value = '';
                    return; 
                }

                document.getElementById(`rua-${tipo}`).value = data.logradouro; 
                document.getElementById(`bairro-${tipo}`).value = data.bairro;
                document.getElementById(`cidade-${tipo}`).value = data.localidade;
                document.getElementById(`estado-${tipo}`).value = data.uf;

                if (tipo === 'adulto') {
                    atualizarTermoAdulto();
                } else if (tipo === 'menor') {
                    atualizarTermo();
                }
            } else {
                showError(`cep-${tipo}`, "CEP não encontrado.");
                document.getElementById(`rua-${tipo}`).value = '';
            }
        })
        .catch(error => {
             console.error('Erro ao buscar CEP:', error);
             showError(`cep-${tipo}`, "Erro ao consultar CEP. Tente novamente.");
             document.getElementById(`rua-${tipo}`).value = '';
        });
}

// ------------------------------------
// MÁSCARAS DE INPUT
// ------------------------------------
function mascaraCPF(campo) {
    campo.value = campo.value.replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}
function mascaraRG(campo) {
    campo.value = campo.value.replace(/\D/g, '')
        .replace(/^(\d{2})(\d{3})(\d{3})(\d{1}).*/, "$1.$2.$3-$4");
}
function mascaraTelefone(campo) {
    campo.a.value = campo.value.replace(/\D/g, '');
    if (campo.value.length > 10) {
        campo.value = campo.value.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
    } else {
        campo.value = campo.value.replace(/^(\d{2})(\d{4})(\d{4}).*/, "($1) $2-$3");
    }
}
function mascaraCEP(campo) {
    campo.value = campo.value.replace(/\D/g, '')
        .replace(/(\d{5})(\d)/, "$1-$2");
}

// ------------------------------------
// ATUALIZAR TERMOS DE RESPONSABILIDADE
// ------------------------------------
function atualizarTermoAdulto() {
    const nome = document.getElementById("nome-adulto")?.value.trim() || "[NOME COMPLETO]";
    const cidade = document.getElementById("cidade-adulto")?.value.trim() || "[CIDADE]";
    const data = getFormattedDate(); 
    const rg = document.getElementById("rg-adulto")?.value.trim() || "[SEU RG]";
    const cpf = document.getElementById("cpf-adulto")?.value.trim() || "[SEU CPF]";

    const termoAdulto = document.getElementById("termo-adulto");
    if (termoAdulto) {
        termoAdulto.value = 
`Eu, ${nome}, RG: ${rg}, CPF: ${cpf}, declaro estar ciente e de acordo com os termos de responsabilidade para participação nas aulas de Muay Thai na ADCA. 

Declaro também estar apto(a) para a prática de atividades físicas e autorizo a vinculação de minha imagem e voz produzidas durante as atividades, sem fins lucrativos, em quaisquer meios de comunicação.

Local: ${cidade}, Data: ${data}. 
Assinatura: ${nome}`;
    }
}

function atualizarTermo() {
    const nomeResp = document.getElementById("nome-resp")?.value.trim() || "[NOME DO RESPONSÁVEL]";
    const rgResp = document.getElementById("rg-resp")?.value || "_____";
    const cpfResp = document.getElementById("cpf-resp")?.value || "_____";
    const aluno = document.getElementById("aluno-menor")?.value || "_____";
    const rgAluno = document.getElementById("rg-aluno")?.value || "_____";
    const parentesco = document.getElementById("parentesco-resp")?.value.trim() || "Responsável"; 
    const cidade = document.getElementById("cidade-menor")?.value.trim() || "_______________";
    const data = getFormattedDate(); 

    const termo = document.getElementById("termo");
    if (termo) {
        termo.value = 
`Eu, ${nomeResp} (${parentesco}), do RG ${rgResp}, sob o CPF ${cpfResp}, autorizo o menor ${aluno}, sob o RG ${rgAluno}, a participar das atividades esportivas, declarando que o(a) mesmo(a) encontra-se apto(a) para a prática de atividades físicas. Autorizo também a vinculação de imagens e voz produzidas nas atividades, sem fins lucrativos, em quaisquer meios de comunicação.

Local: ${cidade}  Data: ${data}

Assinatura do Responsável: ${nomeResp}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    atualizarTermo(); 
    atualizarTermoAdulto(); 
});