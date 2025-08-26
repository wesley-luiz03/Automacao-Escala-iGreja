
// ID da agenda do Google onde os eventos serão criados.
const CALENDAR_ID = "ead1e499c585dfd51825975fe73d52d7c69a76fe5e6ea7f763b27db5d7ce9426@group.calendar.google.com";
// Nome exato da aba da planilha que recebe as respostas do seu Google Form.
const NOME_ABA_RESPOSTAS_FORM = "FORMS DISPONIBILIDADES";
// Nome da sua aba de escala principal. Se não existir, será criada automaticamente.
const NOME_ABA_ESCALA_PRINCIPAL = "ESCALA MULTIMÍDIA | OFICIAL";
// Lista de funções/atividades que precisam ser preenchidas em cada culto/evento.
const ATIVIDADES_POR_CULTO = ["Transmissão", "Multimídia"];
// Número máximo de vezes que uma pessoa pode ser escalada no mesmo mês.
const LIMITE_DE_ESCALAS_POR_MES = 2;


function onOpen() {
  SpreadsheetApp.getUi()
      .createMenu('Automação de Escala')
      .addItem('1. Criar/Atualizar Painel de Disponibilidade', 'criarPainelDisponibilidade')
      .addItem('2. Criar/Atualizar Escala Automática', 'gerarEscalaAutomatica')
      .addSeparator()
      .addItem('3. Agendar e Notificar Selecionados', 'processarEscala')
      .addSeparator()
      .addSubMenu(SpreadsheetApp.getUi().createMenu('4. Marcar Status da Confirmação')
          .addItem('Confirmado (Verde)', 'marcarComoConfirmado')
          .addItem('Recusado (Vermelho)', 'marcarComoRecusado')
          .addItem('Limpar Cor e Status', 'limparStatus'))
      .addToUi();
}

function criarPainelDisponibilidade() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const abaRespostas = ss.getSheetByName(NOME_ABA_RESPOSTAS_FORM);
  if (!abaRespostas) {
    SpreadsheetApp.getUi().alert(`Aba "${NOME_ABA_RESPOSTAS_FORM}" não encontrada! Verifique o nome.`);
    return;
  }
  
  const dadosRespostas = abaRespostas.getDataRange().getValues();
  const cabecalhos = dadosRespostas[0];
  const respostas = dadosRespostas.slice(1);

  const disponibilidade = {};
  const todasAsDatas = cabecalhos.slice(4).map(header => {
    const parts = header.split(':');
    return parts.length > 1 ? parts[1].trim() : header;
  });

  respostas.forEach(linha => {
    const nome = linha[2];
    if (!nome) return;
    disponibilidade[nome] = {};
    linha.slice(4).forEach((resposta, index) => {
      const dataLimpa = todasAsDatas[index];
      if (resposta.toLowerCase().includes('sim')) {
        disponibilidade[nome][dataLimpa] = 'SIM';
      }
    });
  });

  let abaPainel = ss.getSheetByName("Painel de Disponibilidade");
  if (abaPainel) { abaPainel.clear(); } 
  else { abaPainel = ss.insertSheet("Painel de Disponibilidade"); }

  const nomesVoluntarios = Object.keys(disponibilidade);
  const output = [["Datas"].concat(todasAsDatas)];
  nomesVoluntarios.forEach(nome => {
    const linhaPessoa = [nome];
    todasAsDatas.forEach(data => {
      linhaPessoa.push(disponibilidade[nome][data] || '');
    });
    output.push(linhaPessoa);
  });

  const linhaContadorPessoas = ["PESSOAS DISPONÍVEIS"];
  for (let i = 1; i <= todasAsDatas.length; i++) {
    linhaContadorPessoas.push(`=COUNTIF(R[${-nomesVoluntarios.length}]C:R[-1]C, "SIM")`);
  }
  output.push(linhaContadorPessoas);
  
  const colunaContadorDatas = [["DATAS DISPONÍVEIS"]];
  for (let i = 0; i < nomesVoluntarios.length; i++) {
    colunaContadorDatas.push([`=COUNTIF(R[0]C[1]:R[0]C[${todasAsDatas.length}], "SIM")`]);
  }
  
  abaPainel.getRange(1, 1, output.length, output[0].length).setValues(output);
  abaPainel.getRange(2, todasAsDatas.length + 2, colunaContadorDatas.length, 1).setFormulas(colunaContadorDatas);

  // Formatação do Painel
  abaPainel.setFrozenRows(1);
  abaPainel.setFrozenColumns(1);
  abaPainel.setColumnWidth(1, 180);
  if (nomesVoluntarios.length > 0) {
    abaPainel.setRowHeights(2, nomesVoluntarios.length, 21);
  }
  abaPainel.getRange(1, 1, output.length, todasAsDatas.length + 2).setVerticalAlignment("middle").setHorizontalAlignment("center");
  const cabecalhoRange = abaPainel.getRange(1, 1, 1, todasAsDatas.length + 1);
  cabecalhoRange.setBackground("#4a86e8").setFontColor("white").setFontWeight("bold");
  const contadorPessoasRange = abaPainel.getRange(nomesVoluntarios.length + 2, 1, 1, todasAsDatas.length + 1);
  contadorPessoasRange.setBackground("#efefef").setFontWeight("bold");
  const contadorDatasRange = abaPainel.getRange(1, todasAsDatas.length + 2, nomesVoluntarios.length + 1, 1);
  contadorDatasRange.setBackground("#efefef").setFontWeight("bold");
  if (nomesVoluntarios.length > 0) {
    const dataRange = abaPainel.getRange(2, 1, nomesVoluntarios.length, todasAsDatas.length + 1);
    dataRange.applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY).setHeaderRowColor(null);
    const rangeDadosDisponibilidade = abaPainel.getRange(2, 2, nomesVoluntarios.length, todasAsDatas.length);
    const rule = SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("SIM").setBackground("#b6d7a8").setBold(true).setRanges([rangeDadosDisponibilidade]).build();
    const rules = abaPainel.getConditionalFormatRules();
    rules.push(rule);
    abaPainel.setConditionalFormatRules(rules);
  }
  
  SpreadsheetApp.getUi().alert('Painel de Disponibilidade criado/atualizado com sucesso!');
}


//Geração de planilha sugestiva
function gerarEscalaAutomatica() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const abaPainel = ss.getSheetByName("Painel de Disponibilidade");
  let abaEscalaPrincipal = ss.getSheetByName(NOME_ABA_ESCALA_PRINCIPAL);
  const abaRespostas = ss.getSheetByName(NOME_ABA_RESPOSTAS_FORM);

  if (!abaPainel || !abaRespostas) {
    SpreadsheetApp.getUi().alert("Para gerar a escala, as abas 'Painel de Disponibilidade' e '" + NOME_ABA_RESPOSTAS_FORM + "' devem existir.");
    return;
  }

  if (!abaEscalaPrincipal) {
    abaEscalaPrincipal = ss.insertSheet(NOME_ABA_ESCALA_PRINCIPAL);
    const cabecalhoPadrao = ["Atividade", "Data", "Início", "Fim", "Nome do Responsável", "E-mail do Responsável", "Telefone", "Link WhatsApp", "Status do Agendamento", "Confirmação"];
    abaEscalaPrincipal.getRange(1, 1, 1, cabecalhoPadrao.length).setValues([cabecalhoPadrao]).setFontWeight("bold").setHorizontalAlignment("center");
    abaEscalaPrincipal.setFrozenRows(1);
  }

  const dadosRespostas = abaRespostas.getDataRange().getValues();
  const cabecalhosRespostas = dadosRespostas[0];
  const mapaContatos = {};
  const indexTelefone = cabecalhosRespostas.findIndex(h => h.toLowerCase().includes("telefone"));
  dadosRespostas.slice(1).forEach(linha => {
    const nome = linha[2];
    const email = linha[3];
    const telefone = (indexTelefone !== -1) ? linha[indexTelefone] : "";
    if (nome) {
      mapaContatos[nome] = { email: email, telefone: telefone };
    }
  });

  const dadosPainel = abaPainel.getDataRange().getValues();
  const datasComDuplicados = dadosPainel[0].slice(1, -1);
  const voluntarios = dadosPainel.slice(1, -1);
  const datasUnicas = [...new Set(datasComDuplicados)];
  const contagemEscalados = {};
  voluntarios.forEach(vol => contagemEscalados[vol[0]] = 0);
  const dadosEscalaPrincipal = abaEscalaPrincipal.getDataRange().getValues();
  dadosEscalaPrincipal.slice(1).forEach(linha => {
    const nome = linha[4];
    if (contagemEscalados.hasOwnProperty(nome)) {
      contagemEscalados[nome]++;
    }
  });

  const escalaSugerida = [];
  datasUnicas.forEach(dataUnica => {
    let jaEscaladosHoje = [];
    const indicesDaData = [];
    datasComDuplicados.forEach((d, i) => { if (d === dataUnica) indicesDaData.push(i + 1); });
    const disponiveisConsolidados = [...new Set(voluntarios.flatMap(vol => indicesDaData.some(indexColuna => vol[indexColuna] === 'SIM') ? vol[0] : []))];

    ATIVIDADES_POR_CULTO.forEach(atividade => {
      let disponiveis = disponiveisConsolidados.filter(nomeVoluntario => !jaEscaladosHoje.includes(nomeVoluntario) && contagemEscalados[nomeVoluntario] < LIMITE_DE_ESCALAS_POR_MES);
      disponiveis.sort((a, b) => contagemEscalados[a] - contagemEscalados[b]);
      
      let escalado = "--- VAGA ABERTA ---";
      let email = "";
      let telefone = "";

      if (disponiveis.length > 0) {
        escalado = disponiveis[0];
        if (mapaContatos[escalado]) {
          email = mapaContatos[escalado].email;
          telefone = mapaContatos[escalado].telefone;
        }
        contagemEscalados[escalado]++; 
        jaEscaladosHoje.push(escalado);
      }
      
      escalaSugerida.push([atividade, dataUnica, "19:00", "21:00", escalado, email, telefone, "", "", ""]);
    });
  });

  let abaSugestao = ss.getSheetByName("Escala Sugerida");
  if (abaSugestao) { abaSugestao.clear(); } 
  else { abaSugestao = ss.insertSheet("Escala Sugerida"); }
  
  const cabecalhoEscala = dadosEscalaPrincipal[0];
  abaSugestao.getRange(1, 1, 1, cabecalhoEscala.length).setValues([cabecalhoEscala]);
  
  if (escalaSugerida.length > 0) {
    abaSugestao.getRange(2, 1, escalaSugerida.length, escalaSugerida[0].length).setValues(escalaSugerida);
    
    // Formatação visual da escala sugerida
    const numAtividades = ATIVIDADES_POR_CULTO.length;
    for (let i = numAtividades; i < escalaSugerida.length; i += numAtividades) {
      const rangeLinha = abaSugestao.getRange(i + 1, 1, 1, cabecalhoEscala.length);
      rangeLinha.setBorder(null, null, true, null, null, null, "#b7b7b7", SpreadsheetApp.BorderStyle.SOLID);
    }
  }
  
  SpreadsheetApp.getUi().alert("'Escala Sugerida' foi criada com os contatos preenchidos! Verifique e copie para a sua escala principal.");
}

function processarEscala() {
  const planilha = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const intervalo = planilha.getRange(2, 1, planilha.getLastRow() - 1, 9);
  const dados = intervalo.getValues();
  const agenda = CalendarApp.getCalendarById(CALENDAR_ID);

  dados.forEach(function(linha, index) {
    const nomeResponsavel = linha[4];
    const emailResponsavel = linha[5];
    const telefone = linha[6];
    const status = linha[8];

    if (status === "" && nomeResponsavel && nomeResponsavel !== "--- VAGA ABERTA ---") {
      if (!emailResponsavel) {
        planilha.getRange(index + 2, 9).setValue("ERRO: E-mail não encontrado");
        return;
      }

      try {
        let dataObj;
        if (Object.prototype.toString.call(linha[1]) === '[object Date]') { dataObj = linha[1]; } 
        else { const p = linha[1].toString().split('/'); dataObj = new Date(p[2], p[1] - 1, p[0]); }
        
        let horaIni, minIni, horaFim, minFim;
        if (Object.prototype.toString.call(linha[2]) === '[object Date]') { horaIni = linha[2].getHours(); minIni = linha[2].getMinutes(); } 
        else { const p = linha[2].toString().split(':'); horaIni = parseInt(p[0], 10); minIni = parseInt(p[1], 10); }
        if (Object.prototype.toString.call(linha[3]) === '[object Date]') { horaFim = linha[3].getHours(); minFim = linha[3].getMinutes(); } 
        else { const p = linha[3].toString().split(':'); horaFim = parseInt(p[0], 10); minFim = parseInt(p[1], 10); }
        
        const dataHoraInicio = new Date(dataObj.getFullYear(), dataObj.getMonth(), dataObj.getDate(), horaIni, minIni);
        const dataHoraFim = new Date(dataObj.getFullYear(), dataObj.getMonth(), dataObj.getDate(), horaFim, minFim);
        
        if (isNaN(dataHoraInicio.getTime())) { throw new Error("Data de início inválida."); }
        
        const tituloEvento = `Escala: ${linha[0]}`;
        const options = { guests: emailResponsavel, sendInvites: true };
        agenda.createEvent(tituloEvento, dataHoraInicio, dataHoraFim, options);
        
        if (telefone) {
          const diaFormatado = dataObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
          const horaFormatada = linha[2].toString().substr(0, 5);
          let mensagem = `Olá, ${nomeResponsavel}! Tudo bem?\n\nVocê foi escalado(a) para a atividade *${linha[0]}* no dia *${diaFormatado}* às *${horaFormatada}*.\n\nPor favor, confirme sua disponibilidade. Obrigado!`;
          let mensagemCodificada = encodeURIComponent(mensagem);
          let numeroTelefone = telefone.toString().replace(/\D/g, '');
          let linkWhatsapp = `https://wa.me/${numeroTelefone}?text=${mensagemCodificada}`;
          planilha.getRange(index + 2, 8).setValue(linkWhatsapp);
        }
        
        planilha.getRange(index + 2, 9).setValue("Notificado");
      } catch (e) {
        planilha.getRange(index + 2, 9).setValue(`ERRO: ${e.message}`);
      }
    }
  });
  
  SpreadsheetApp.getUi().alert('Processo finalizado! Eventos criados e links de WhatsApp gerados.');
}

function marcarComoConfirmado() {
  const range = SpreadsheetApp.getActiveRange();
  if (range) {
    range.getSheet().getRange(range.getRow(), 10, range.getNumRows(), 1).setValue('Confirmado');
    range.getSheet().getRange(range.getRow(), 1, range.getNumRows(), 10).setBackground('#d9ead3');
  }
}

function marcarComoRecusado() {
  const range = SpreadsheetApp.getActiveRange();
  if (range) {
    range.getSheet().getRange(range.getRow(), 10, range.getNumRows(), 1).setValue('Recusado');
    range.getSheet().getRange(range.getRow(), 1, range.getNumRows(), 10).setBackground('#f4cccc');
  }
}

function limparStatus() {
    const range = SpreadsheetApp.getActiveRange();
    if (range) {
        range.getSheet().getRange(range.getRow(), 10, range.getNumRows(), 1).clearContent();
        range.getSheet().getRange(range.getRow(), 1, range.getNumRows(), 10).setBackground(null);
    }
}
