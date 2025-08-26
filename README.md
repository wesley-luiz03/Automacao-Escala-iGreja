Automação de Escala para Equipes com Google Sheets
Este projeto contém um conjunto de scripts para o Google Apps Script que automatiza o processo completo de criação e gestão de escalas para equipes de voluntários, como em igrejas, eventos ou outras organizações.

O sistema transforma uma simples planilha do Google em uma poderosa ferramenta de gestão, desde a coleta de disponibilidade até a notificação automática dos participantes.

Funcionalidades
Coleta de Disponibilidade: Integração com o Google Forms para coletar as datas em que cada voluntário está disponível.

Painel de Decisão Visual: Cria automaticamente um painel formatado que mostra, para cada data, quem está disponível, além de contar o total de pessoas por dia e o total de dias por pessoa.

Gerador de Escala Inteligente: Sugere uma escala completa e equilibrada com um único clique, baseando-se em regras personalizáveis:

Preenche diferentes funções por evento (ex: "Transmissão", "Multimídia").

Evita escalar a mesma pessoa para duas funções no mesmo dia.

Respeita um limite máximo de escalas por pessoa no mês para garantir um rodízio justo.

Notificações Automáticas:

Envia convites para o Google Agenda de cada pessoa escalada.

Gera links de WhatsApp "Clique para Conversar" com uma mensagem personalizada para cada voluntário.

Controle de Confirmação: Permite marcar visualmente na planilha quem já confirmou ou recusou a escala, colorindo as linhas para fácil identificação.

Como Usar
1. Configuração Inicial
Crie uma Planilha Google: Crie uma nova planilha no Google Sheets. Esta será a sua central de controle.

Crie um Google Form: Crie um formulário para coletar a disponibilidade da sua equipe (veja o guia de configuração do formulário abaixo).

Conecte o Form à Planilha: Na aba "Respostas" do seu formulário, clique no ícone do Sheets e vincule-o à sua planilha. Isso criará uma nova aba (ex: "FORMS DISPONIBILIDADES").

2. Instalação do Script
Na sua planilha, vá em Extensões > Apps Script.

Apague qualquer código de exemplo que aparecer.

Copie todo o conteúdo do arquivo Codigo.gs deste repositório e cole no editor.

Configure as Variáveis Globais: No topo do script, ajuste as 4 variáveis para corresponderem à sua configuração:

CALENDAR_ID: O ID da sua agenda do Google.

NOME_ABA_RESPOSTAS_FORM: O nome exato da aba que recebe as respostas do formulário.

NOME_ABA_ESCALA_PRINCIPAL: O nome que você quer dar à sua aba de escala principal (ex: "ESCALA DE SETEMBRO").

ATIVIDADES_POR_CULTO: A lista de funções a serem preenchidas.

LIMITE_DE_ESCALAS_POR_MES: O número máximo de vezes que uma pessoa pode ser escalada.

Clique no ícone de disquete (💾) para salvar o projeto.

3. Fluxo de Trabalho Mensal
Envie o Formulário: No início do mês, envie o link do Google Forms para a sua equipe.

Crie o Painel: Assim que as respostas chegarem, vá para a planilha, recarregue a página e use o menu Automação de Escala > 1. Criar/Atualizar Painel de Disponibilidade.

Gere a Escala: Em seguida, use o menu Automação de Escala > 2. Criar/Atualizar Escala Automática. Uma aba "Escala Sugerida" será criada.

Revise e Copie: Revise a sugestão, faça os ajustes que desejar e copie as linhas da escala final.

Cole na Aba Principal: Cole os dados na sua aba de escala principal.

Notifique a Equipe: Com os dados na aba principal, use o menu Automação de Escala > 3. Agendar e Notificar Selecionados.

Gerencie as Confirmações: Conforme as respostas chegam, selecione as linhas correspondentes e use o menu Automação de Escala > 4. Marcar Status da Confirmação para manter tudo organizado.

Configuração do Google Forms (Recomendado)
Pergunta 1: "Nome" (Resposta curta)

Pergunta 2: "E-mail" (Resposta curta, com validação de e-mail)

Pergunta 3: "Telefone" (Resposta curta, opcional)

Pergunta 4: "Disponibilidade" (Grade de múltipla escolha)

Linhas: Coloque as datas dos cultos (ex: "Domingo | 07/09 (MANHÃ)").

Colunas: Coloque as opções Sim, estou disponível e Não posso neste dia.

Ative a opção "Exigir uma resposta em cada linha".



Personalização e Contribuição
Este projeto foi desenhado para ser flexível. Sinta-se à vontade para o adaptar:

Alterar as Regras: Modifique as variáveis no topo do script para alterar o número de pessoas por culto ou o limite de escalas por mês.

Novas Funções: Adicione mais nomes de atividades na lista ATIVIDADES_POR_CULTO.

Melhorar o Algoritmo: O algoritmo de sugestão de escala pode ser melhorado para incluir novas regras, como evitar que uma pessoa seja escalada em dois fins de semana seguidos.

Contribuições são bem-vindas! Se tiver melhorias, sinta-se à vontade para abrir um Pull Request.

Licença
Este projeto está licenciado sob a Licença MIT. Veja o arquivo LICENSE para mais detalhes.
