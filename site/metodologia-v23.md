# ÍNDOLE 360° — Auditoria do modelo Claude 1.0 e módulo de pesquisa 2.3

**18/09/2026 · Idealização: Aldenir Rocha · Natureza: instrumento editorial experimental.**

[Explorar empresas e preparar avaliação](avaliar.html) · [Catálogo preexistente](index.html)

## O que esta entrega faz — e o que não faz

Acrescenta uma porta de entrada para consumidores, pesquisa por empresa/atividade/ticker, fichas com fontes, formulário de procedência e propósito, rascunhos com 11 dimensões, exportação/importação JSON, roteiro de pesquisa e conferência aritmética de caixa. Os dados do catálogo 2.2 foram preservados, não reauditados. Nenhuma nova nota pública, certificação ou recomendação de investimento foi criada.

A página não executa agentes autônomos, não faz pesquisa na internet, não atualiza cotações e não envia formulários. O botão de copiar produz um roteiro para pesquisa externa sob comando. Dados preenchidos não são automaticamente verdadeiros; um endereço HTTPS válido apenas passa pela checagem de formato.

O site público é um catálogo documental em desenvolvimento, não um sistema universal de rastreabilidade de qualquer compra. País da sede, país da fabricação e origem de insumos são informações diferentes. O formulário registra hipóteses/documentos, mas não autentica produtos, fornecedores, revisores ou cadeias.

## Achados da auditoria

| Achado no prompt 1.0 | Risco | Correção editorial / técnica |
|---|---|---|
| IDL soma dividendos, CAPEX, P&D, despesas e caixa como se fossem partições do lucro | Dupla contagem e falsa conciliação | Separar demonstração do resultado, fluxo de caixa e patrimônio; não usar uma pizza para essas rubricas. Parte já corrigida no 2.2. [1] |
| IRent adiciona resultado financeiro a pagamentos a acionistas | Numerador mistura ganho contábil e saída de recursos | Usar indicadores descritivos separados. Juros operacionais de bancos exigem lente própria; não medir desonestidade por aplicações. |
| IRP soma CAPEX, P&D, pessoas e expansão | Categorias podem se sobrepor | Discriminar despesas e itens capitalizados; conciliar cada rubrica antes de somar. |
| Lucro anual acumulado é apresentado sem distinguir saldo patrimonial | Confusão entre fluxo acumulado e estoque | Nomear “soma dos lucros/prejuízos dos exercícios disponíveis”, informar completude e não equiparar ao patrimônio ou ao caixa. |
| ITrab escrito como ações ÷ 1.000 funcionários | Escala ambígua e comparações injustas | Usar ações × 1.000 / empregados. Separar estoque de ações ativas de incidência de novos processos; exigir mesmo período, território e perímetro. |
| Acordo = admissão + reparação para TAC, DPA, ANPC e leniência indistintamente | Inferência jurídica indevida | Identificar instrumento e jurisdição, ler cláusulas e registrar defesa, pagamentos, recurso e situação. Leniência federal brasileira possui requisitos específicos; não extrapolar para todos os acordos. [2] |
| “25% é o mínimo legal” para todas as sociedades por ações | Generalização incorreta | O art. 202 remete ao estatuto; a regra de 50% opera na omissão, e a regra de 25% tem hipótese específica no §2º. Examinar caso e legislação vigente. [3] |
| 0 para ausência de investimento social localizado | Pune empresas com dados incompletos | Ausência é null/não encontrado. Zero exige uma observação documentada de valor zero. |
| Fonte primária tratada como verificação independente | Relato corporativo vira certificação | Separar origem da fonte, documentação, asseguração e efeito comprovado. O tipo da fonte não decide sozinho sua confiabilidade. |
| Projeto incentivado recebe avaliação pior apenas pela origem | Confunde financiamento e eficácia | Classificar origem e resultado em eixos distintos; mensurar benefício fiscal efetivo, terceiros e recursos próprios líquidos quando conhecidos. |
| Histórico de 10 anos inclui os 24 meses do painel atual | Comparação sobreposta | Preservar histórico total como contexto; para tendência, comparar janelas não sobrepostas com mesmo escopo e método. |
| A dimensão T usa Δ, e o próprio Δ inclui T | Circularidade | T deve ser baseada em atos documentados, não no próprio resultado do índice. Não conceder selo por um formulário ou pela simples melhora da nota. |
| Médias podem compensar dano grave com doações | Falsa compensação ética | Pendências críticas não revisadas ou materiais impedem conclusão no novo motor. Isso não é declaração de culpa. |
| Confiança A–D depende apenas da quantidade de fontes primárias | Confunde cobertura com qualidade | Exibir cobertura documental de preenchimento; avaliar qualidade, independência, atualidade e comparabilidade separadamente. [4] |
| Faixa de “capital acumulado” mistura receita e valor de mercado | Porte e expectativas incompatíveis | Identificar separadamente receita, ativos, patrimônio, orçamento e valor de mercado. Faixas T2–T4 e pisos sociais são convenções do projeto, não obrigações legais. |
| Sede da organização usada como procedência do produto | Rastreabilidade aparente | Documentar produto, marca, fabricante, vendedor, controladora e cadeia; não inferir origem específica a partir de informação consolidada. |
| Valor anunciado, pago e efetivamente reparado se confundem | Superestima ação e redenção | Registrar devido, desembolsado, recebido e resultado constatado; não contar promessa como execução. |
| Validade fixa de 90 dias | Falsa garantia de atualidade | Tratar 90 dias como revisão sugerida, antecipada por fato material; manter data do documento e da consulta. |
| “Todos os processos” e “12 agentes” sem execução real | Exaustividade e independência não demonstradas | Declarar universo buscado e limitações. No texto 1.0 há A0 + 13 papéis (A7a e A7b); são roteiros de análise, não prova de trabalho de agentes independentes. |
| Quadrantes com rótulos de caráter definitivo | Estigmatização e falsa certeza | Preferir linguagem de desempenho/documentação/pendências. “Índole” é a marca do projeto, não diagnóstico de caráter. |

As correções de lucro versus caixa, dados ausentes, acordos, dupla contagem e cautela com notas já estavam parcialmente contempladas no código/metodologia 2.2. Esta entrega não reivindica tê-las criado: amplia a experiência pública e acrescenta verificações e testes específicos.

## Fórmulas e fronteiras de interpretação

### HONRA e MÉRITO

HONRA = média(H1…H5). MÉRITO = média(M1…M6). Índice = (HONRA + MÉRITO) × 5.

Os eixos têm peso 50/50; as 11 dimensões não têm o mesmo peso individual: 10% para cada dimensão de HONRA e 1/12 do total, aproximadamente 8,33%, para cada dimensão de MÉRITO. A régua é uma escolha normativa ajustável; suas notas não são medidas naturais de caráter. Pesquisa de concordância entre revisores, análise de sensibilidade e validação de conteúdo permanecem necessárias antes de alegar validade científica. [4]

O novo módulo só calcula o total preliminar quando todas as dimensões têm número válido, justificativa, URL HTTPS e tipo de fonte; identidade e período devem estar preenchidos e datas não podem ser futuras. A existência/qualidade das fontes não é verificada pelo navegador. O usuário declarar que revisou pendências não equivale a revisão editorial independente.

**Todo resultado da área de pesquisa permanece rascunho.** O campo publicScore permanece null, inclusive após importação de um arquivo que alegue conter aprovação. A página não possui endpoint de publicação ou autoridade certificadora.

### Dinheiro

- Payout: dividendos e JCP de mesma base / lucro correspondente. Verificar se JCP já está incluído nos dividendos.
- Distribuição ampliada: dividendos + JCP + recompras de mesma definição / lucro correspondente. Acima de 100% não prova, isoladamente, endividamento para distribuir.
- Intensidade de pesquisa: P&D / receita, com base e período comuns.
- Esforço social: recursos próprios líquidos / lucro, somente com denominador positivo e origem conciliada. Não há piso universal demonstrado.
- Ponte de caixa: caixa inicial + fluxo operacional + fluxo de investimento + fluxo de financiamento + efeitos cambiais e outros ajustes documentados = caixa final. [1]

Na interface 2.3, as razões automáticas são P&D/receita, CAPEX/receita e dividendos/lucro. Não pressupõem JCP zero e não representam a distribuição completa. Campos faltantes ou bases incompatíveis geram “não comparável”. Recompras por programa e recompras totais no fluxo de caixa não são necessariamente a mesma rubrica.

Os campos da ponte usam valores com sinal. Sua tolerância numérica de 0,01 corresponde à unidade escolhida pelo usuário; não é um teste de materialidade de auditoria. Conciliação aritmética não demonstra legitimidade de uma transação.

**Não é possível concluir que “de cada R$100 desta compra, R$X vão para doações” a partir das contas consolidadas.** São necessários margem, canal de venda, tributos, custos, escopo e rastreabilidade específicos. Do mesmo modo, receita, lucro e fluxo de caixa são conceitos distintos.

### Origem e impacto social

Se todas as parcelas forem conhecidas e comparáveis: desembolso total − benefício fiscal efetivo − aporte de terceiros = recurso próprio líquido. Não estimar benefício fiscal desconhecido por uma alíquota genérica. Dedução de despesa tributável, crédito ou destinação de imposto têm mecânicas distintas. O indicador descreve financiamento, não a eficácia do projeto.

### Trajetória

Para uma comparação antes/depois: período anterior termina antes do início do atual; entidade/perímetro e versão do método são iguais. Δ = nota atual − nota anterior. Se qualquer requisito falhar, o novo helper não calcula Δ. Mesmo válido aritmeticamente, Δ não prova causalidade, reparação integral ou ausência de reincidência.

## Protocolo editorial antes de publicar uma avaliação de empresa

1. Identificar a entidade, suas marcas, produtos e vínculos relevantes; registrar fonte, data e escopo.
2. Conferir dados financeiros e contribuições nas demonstrações e notas, evitando duplicidades.
3. Ler os documentos de casos materiais, registrar contraditório e distinguir cada situação processual.
4. Analisar impacto demonstrado, lacunas, materialidade, limitações e pendências de reparação.
5. Usar revisão humana documentada, preferencialmente por segundo revisor sem conflito, com versão e trilha de alterações.
6. Só então publicar o dossiê, as fontes e eventual nota editorial, com canal de correção. Corrigir fatos novos sem apagar o histórico.

Sem os requisitos, publicar apenas o que está documentado e as lacunas. A análise não orienta compra/venda de ações e não substitui aconselhamento profissional quando necessário.

## Privacidade e operação

O rascunho é salvo no localStorage apenas após clicar em salvar. A chave é indole360-draft-v23. Importar/exportar JSON não altera o repositório. Importações têm limite de 200 KB, aceitam somente o esquema esperado e não são executadas como código. HTML é escapado nas fichas; links devem usar HTTPS sem credenciais. O catálogo público e os links externos continuam sujeitos à infraestrutura e às políticas de seus provedores.

O botão de correção abre o GitHub: enviar uma issue é uma ação separada do usuário e seu conteúdo será público. Não inserir informações médicas, bancárias, familiares, credenciais, dados de crianças ou documentos sigilosos.

## Fontes normativas e metodológicas consultadas nesta revisão

[1] IFRS Foundation — IAS 7, Statement of Cash Flows. Consultado em 18/09/2026. https://www.ifrs.org/issued-standards/list-of-standards/ias-7-statement-of-cash-flows/

[2] CGU — Como fazer um acordo de leniência. Consultado em 18/09/2026; requisitos específicos da leniência federal, não regra universal sobre acordos. https://www.gov.br/cgu/pt-br/assuntos/integridade-privada/acordo-leniencia/como-fazer-um-acordo

[3] CVM — Lei 6.404/1976, art. 202. Consultado em 18/09/2026. A página histórica não substitui a conferência do texto vigente aplicável a um caso concreto. https://sistemas.cvm.gov.br/port/atos/leis/6404.asp

[4] OECD/JRC — Handbook on Constructing Composite Indicators. Referência metodológica geral, sem endosso ao projeto ou validação desta régua. Consultado em 18/09/2026. https://www.oecd.org/en/publications/handbook-on-constructing-composite-indicators_533411815016.html

## Estado da entrega e continuidade

Preservados os dados, documentos, simuladores, dossiê Microsoft e páginas anteriores. Adicionados testes unitários para ausência versus zero, intervalos, fontes, importação, conciliação, origem de recursos e soma histórica. A validação visual e funcional do navegador deve ser registrada no relatório técnico desta versão.

**Próximo marco:** concluir uma empresa-piloto com 11 dimensões, série anual comparável, identidade societária verificada e contraditório, antes de ampliar rankings. Não foi ativado monitoramento automático.
