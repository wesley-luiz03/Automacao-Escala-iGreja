#  Automação de Escala para Equipes com Google Sheets

Este projeto contém um conjunto de **scripts para o Google Apps Script** que automatiza o processo completo de criação e gestão de escalas para equipes de voluntários, como em igrejas, eventos ou outras organizações.

O sistema transforma uma simples planilha do Google em uma poderosa ferramenta de gestão, desde a coleta de disponibilidade até a **notificação automática dos participantes**.

---

##  Funcionalidades

- **Coleta de Disponibilidade**  
  Integração com o Google Forms para coletar as datas em que cada voluntário está disponível.

- **Painel de Decisão Visual**  
  Cria automaticamente um painel formatado que mostra, para cada data, quem está disponível, além de contar:
  - total de pessoas por dia;  
  - total de dias por pessoa.  

- **Gerador de Escala Inteligente**  
  Sugere uma escala completa e equilibrada com um único clique, baseando-se em regras personalizáveis:  
  - Preenche diferentes funções por evento (ex: *"Transmissão"*, *"Multimídia"*).  
  - Evita escalar a mesma pessoa em duas funções no mesmo dia.  
  - Respeita um limite máximo de escalas por pessoa no mês para garantir um rodízio justo.

- **Notificações Automáticas**  
  - Envia convites para o Google Agenda de cada pessoa escalada.  
  - Gera links de WhatsApp com mensagem personalizada para cada voluntário.

- **Controle de Confirmação**  
  Marca visualmente quem já confirmou ou recusou a escala, colorindo as linhas para fácil identificação.

---

##  Como Usar

### 1. Configuração Inicial
1. Crie uma **Planilha Google** (central de controle).  
2. Crie um **Google Form** para coletar disponibilidade da equipe.  
3. Conecte o formulário à planilha (gerando uma aba de respostas, ex: `FORMS DISPONIBILIDADES`).

### 2. Instalação do Script
1. Abra a planilha e vá em: `Extensões > Apps Script`.  
2. Apague qualquer código de exemplo.  
3. Copie o conteúdo de `Codigo.gs` deste repositório e cole no editor.  
4. Configure as variáveis globais no topo do script:
   - `CALENDAR_ID`: ID da sua agenda do Google.  
   - `NOME_ABA_RESPOSTAS_FORM`: Nome da aba de respostas do formulário.  
   - `NOME_ABA_ESCALA_PRINCIPAL`: Nome da aba principal da escala (ex: `ESCALA DE SETEMBRO`).  
   - `ATIVIDADES_POR_CULTO`: Lista de funções a serem preenchidas.  
   - `LIMITE_DE_ESCALAS_POR_MES`: Máximo de escalas por pessoa/mês.  
5. Clique em **💾 salvar**.

### 3. Fluxo de Trabalho Mensal
1. **Envie o formulário** para a equipe no início do mês.  
2. **Crie o Painel**: Menu `Automação de Escala > Criar/Atualizar Painel de Disponibilidade`.  
3. **Gere a Escala**: Menu `Automação de Escala > Criar/Atualizar Escala Automática`.  
4. **Revise e copie** os dados da aba sugerida para a aba principal.  
5. **Notifique a equipe**: Menu `Automação de Escala > Agendar e Notificar Selecionados`.  
6. **Gerencie confirmações**: Use `Automação de Escala > Marcar Status da Confirmação`.

---

##  Configuração do Google Forms (Recomendado)

- **Pergunta 1**: Nome (Resposta curta)  
- **Pergunta 2**: E-mail (Resposta curta, validação de e-mail)  
- **Pergunta 3**: Telefone (Resposta curta, opcional)  
- **Pergunta 4**: Disponibilidade (Grade de múltipla escolha)  

  Dica:  
- Linhas → Datas dos eventos (ex: `Domingo | 07/09 (MANHÃ)`).  
- Colunas → `Sim, estou disponível` e `Não posso neste dia`.  
- Ative **"Exigir resposta em cada linha"**.  

---

## Personalização e Contribuição

- **Regras**: Edite as variáveis para ajustar limite de escalas ou funções.  
- **Novas funções**: Adicione mais atividades em `ATIVIDADES_POR_CULTO`.  
- **Algoritmo**: Melhore a lógica para incluir novas regras (ex: evitar escalar a mesma pessoa em dois fins de semana seguidos).  

Contribuições são bem-vindas! Abra um **Pull Request** para melhorias.  

---

---

## Versão
Este projeto está na versão 1.0.0.

---

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).
