# ÍNDOLE 360°

Catálogo documental empresarial de Aldenir Rocha. Versão 2.0.0, 18/09/2026. Base de pesquisa: 17/09/2026.

[Abrir site](https://aldenirfilho.github.io/INDOLE-360/) · [Metodologia](docs/METODOLOGIA.md) · [Piloto preservado](https://aldenirfilho.github.io/NEXUS-BRASIL/indole360/)

## O que funciona

- Dez fichas: NVIDIA, Apple, Alphabet, Microsoft, Amazon, TSMC, SpaceX, Meta, Broadcom e Saudi Aramco.
- 63 URLs de fontes primárias registradas; seleção da amostra por capitalização no CompaniesMarketCap.
- Busca, filtros setoriais, comparações financeiras, simulador 30/30/30/10, cartas e três documentos Word editáveis.
- Dois roteiros de revisão: contraditório financeiro/integridade e acreditação documental/impacto.

**Não há nota geral de índole concluída nesta versão.** A série histórica, as onze dimensões e a conciliação dos recursos precisam ser completadas. Ausência não vale zero. Aderência ao modelo autoral não equivale à honestidade, e aplicação financeira não prova corrupção. Os agentes são roteiros sob comando; não existe monitoramento automático ativado.

O modelo 30% produto / 30% pessoas / 30% impacto / 10% reserva sem rendimento é uma proposta normativa do autor, não regra legal universal nem proporção ótima demonstrada. Lucro não equivale a caixa e despesas anteriores não devem ser contadas novamente.

## Usar no Mac Pro ou Mac Air

A pasta é autocontida. O site publicado dispensa instalação. Para prévia local, na pasta do projeto execute:

```sh
python3 -m http.server 8796 --directory site
```

Abra http://localhost:8796. Abrir index.html diretamente como arquivo não carrega os dados via fetch. Testar fisicamente em cada Mac; cópia de arquivos não comprova funcionamento em outro equipamento.

## Atualizar

1. Preserve a versão atual em Git ou ZIP.
2. Edite os dados-fonte em research/*.json, mantendo fonte primária, período, moeda, unidade, escopo e lacunas.
3. Execute `python3 scripts/integrate.py`. A seleção das dez empresas desta edição está explicitamente definida nesse script; revisar antes de ampliar a amostra.
4. Para gerar Word: Python com python-docx e Pillow, `python3 scripts/make_documents.py`. O gráfico usa Arial no macOS. Renderize e inspecione todas as páginas após alterações.
5. Execute `node --test tests/*.test.mjs`; confira filtros, fichas, fontes, simulador e celular.
6. Publique via commit na branch main. GitHub Actions testa e envia somente site/ ao Pages. Um push não prova publicação: confira o workflow e a URL.

## Estrutura

- site/: publicação estática, dados normalizados, documentos e cartas.
- research/: dados-fonte e notas de pesquisa que acompanham esta edição.
- docs/: metodologia, continuidade, humanização e estratégia de adoção.
- agentes/: roteiros reutilizáveis.
- tests/: proteção contra notas sem evidência e erros de denominador.

Correspondência enviada, recibos e prompt original ficam fora deste repositório público. Cartas públicas não comprovam envio, entrega ou leitura. Fontes e marcas pertencem aos respectivos titulares. Não há filiação às empresas analisadas.

## Retomar

Prioridade: concluir uma avaliação setorial com séries comparáveis, verificação independente de impacto e respostas das empresas. Depois ampliar para bancos e organizações com denominadores próprios. [Registrar correção documentada](https://github.com/aldenirfilho/INDOLE-360/issues/new).

## Reversão

Localize o último commit aprovado; reverta a alteração por um novo commit (`git revert <commit>`) e acompanhe o Pages. Preserve os dados anteriores e publique explicação de correções materiais.
