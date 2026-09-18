# Validação técnica da extensão 2.3

Data: 18/09/2026. Base preservada: 6f7b64d6400a7ac8412a3297202336ec56125ecb.

## Executado antes da publicação

26 testes unitários passaram com `node --test tests/audit-v23.test.mjs`: notas ausentes/zero, cobertura, datas, pendências críticas, URLs, importação, denominadores, moedas/unidades/períodos, origem dos aportes, ponte de caixa, perdas, exercícios duplicados, períodos anuais/intermediários e comparabilidade temporal.

17 verificações de interface passaram em Chromium com conteúdo local: dez cartões e dez fichas; pesquisa por ticker; resultado vazio; filtro; escolha de empresa; foco; onze dimensões e cálculo preliminar; bloqueio crítico; controles de salvar/retomar; exportação; importação malformada e aprovação adulterada; geração de roteiro; conciliação de caixa; destinos locais; comportamento em 390 px; falha de carregamento. Agrupamentos constam no roteiro de teste. Nenhum erro JavaScript não tratado foi observado nesse ambiente.

## Limitação do ambiente de interface

O navegador gerenciado bloqueou navegação HTTP e file://. A validação visual usou conteúdo local injetado no DOM; carregamento do catálogo, armazenamento e download foram explicitamente simulados. Isso NÃO comprova rede real, persistência real do navegador, download no aparelho ou funcionamento físico em iPhone, Android ou Mac. Os testes unitários executaram os arquivos reais do motor. Imagens desktop (1440 px) e mobile (390 px) foram inspecionadas; o documento não apresentou transbordamento horizontal em 390 px.

## Não incluído

Não houve nova auditoria integral das fontes empresariais, validação estatística do índice, revisão jurídica profissional, teste de penetração completo ou teste em todos os navegadores. A contagem de 63 URLs significa cadastro, não autenticação de fontes. O módulo não publica rascunhos nem envia dados a uma API.

## Publicação e reversão

O workflow existente do repositório executa `node --test tests/*.test.mjs` antes de enviar site/ ao GitHub Pages. Verificar a conclusão do workflow e o conteúdo público após o commit; este documento, preparado antes do envio, não certifica por si a publicação.

A branch `backup/pre-v23-2026-09-18` preserva a base. Reverter por novo commit, sem reset forçado, mantendo o histórico e documentando a correção.
