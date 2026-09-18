import json,shutil,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
RAW=ROOT/'research'
RAW.mkdir(exist_ok=True)
# Os dados-fonte acompanham o projeto; nenhuma dependência de diretório temporário.
selection=[('nvidia','NVIDIA',5.296,'Semicondutores'),('apple','Apple',4.918,'Dispositivos e serviços'),('alphabet','Alphabet',4.203,'Plataformas e publicidade'),('microsoft','Microsoft',3.696,'Software e nuvem'),('amazon','Amazon',2.709,'Varejo e nuvem'),('tsmc','TSMC',2.231,'Semicondutores'),('spacex','SpaceX',2.040,'Espaço conectividade e IA'),('meta','Meta',1.738,'Plataformas e publicidade'),('broadcom','Broadcom',1.657,'Semicondutores'),('saudi-aramco','Saudi Aramco',1.646,'Energia')]
summaries={
'nvidia':'Há investimento em pesquisa e evidências corporativas de iniciativas ambientais e sociais. A contribuição própria precisa ser separada das doações dos empregados, e impacto e valorização do trabalho ainda exigem verificação.',
'apple':'A documentação permite examinar inovação e distribuição expressiva aos acionistas. A avaliação de conduta depende também de reparabilidade, acesso, cadeia de fornecedores e evolução dos casos regulatórios; o volume distribuído isolado não decide o julgamento.',
'alphabet':'Pesquisa e infraestrutura coexistem com aplicações financeiras e questões concorrenciais documentadas. Acesso, efeitos da publicidade, trabalho e resultados sociais precisam de análise conjunta antes de uma nota.',
'microsoft':'Pesquisa e infraestrutura têm escala relevante; há iniciativas declaradas de qualificação e ambiente. Períodos ambientais e financeiros diferem, e os efeitos da expansão de IA sobre emprego e recursos naturais precisam de métricas comparáveis.',
'amazon':'O exercício não apresentou dividendos nem recompras, mas isso não demonstra por si boa conduta. Segurança no trabalho, consumo, emissões absolutas e cumprimento de acordos são pontos essenciais da avaliação.',
'tsmc':'O negócio intensivo em fabricação apresenta investimento em ativos e remuneração variável documentados. O percentual de respostas à pesquisa de pessoal não é satisfação; água, cadeia e execução dos projetos ainda precisam de verificação.',
'spacex':'O perímetro financeiro ampliado teve prejuízo, tornando inaplicável a alocação sobre lucro positivo no exercício. Resultados tecnológicos não dispensam avaliação de segurança, impactos locais, condições de trabalho e reparações.',
'meta':'Pesquisa e infraestrutura coexistem com retorno a acionistas e investimentos em participações. Segurança de usuários, privacidade, condições de trabalho e impactos locais são indispensáveis; a asseguração ambiental localizada cobre métricas e período limitados.',
'broadcom':'Pesquisa e modelo de produção terceirizada exigem leitura além do CAPEX. Licenciamento, consumidores, integração de trabalhadores e cumprimento de compromissos concorrenciais devem completar a avaliação.',
'saudi-aramco':'Lucro e dividendos elevados exigem análise proporcional dos impactos, inclusive climáticos. Indicadores de pessoas e sustentabilidade têm perímetro diferente do consolidado; não é possível inferir uma nota global a partir deles.'}
english={
'nvidia':['Separate corporate community spending from employee donations and reconcile the amounts to financial reporting.','Publish independently reviewable learning, career progression and shared productivity indicators across wage bands and suppliers.','Report absolute life cycle energy and emissions alongside measurable outcomes of AI projects that expand human capabilities.'],
'apple':['Publish comparable repairability, service life and total cost indicators for products serving different income groups.','Disclose independently reviewable worker training, progression and supplier remediation outcomes.','Provide a clear bridge between earnings, cash, productive investment, shareholder distributions and corporate social spending.'],
'alphabet':['Expand understandable information on advertising, user choice and implementation of competition remedies.','Disclose worker transition, paid learning and internal mobility outcomes associated with AI adoption.','Reconcile infrastructure expansion with local water, absolute emissions and independently measured community outcomes.'],
'microsoft':['Publish worker transition and internal mobility outcomes alongside AI investment, including paid training.','Align financial and environmental reporting periods and disclose local water and absolute emissions impacts.','Offer simpler accessible product choices and a reconciled breakdown of corporate social spending, grants and in kind support.'],
'amazon':['Publish independently reviewable safety indicators by site and employment arrangement, with worker participation.','Separate recurring operating costs, additional worker investment, remediation, philanthropy and treasury activities.','Continue simplifying subscriptions and cancellation, retaining accessible human support, and report absolute environmental outcomes.'],
'tsmc':['Provide auditable worker experience and internal progression indicators distinct from survey response rates.','Publish local water and contractor safety outcomes with independently reviewed project spending.','Explain how profit sharing, capital investment and community commitments are reconciled without double counting.'],
'spacex':['Publish comparable consolidated workforce, safety and career development data after changes to the group perimeter.','Disclose progress and independent verification of environmental remediation and local community commitments.','Explore affordable connectivity and human capability pilots with measurable beneficiaries; assess allocations only when there is a positive eligible earnings base.'],
'meta':['Expand independently reviewable user safety, appeals and accessible human support indicators.','Disclose paid learning, worker transition and internal mobility outcomes from AI deployment.','Align financial and environmental periods and connect local infrastructure impacts with verified community outcomes.'],
'broadcom':['Make licensing options, renewal costs and migration paths clearer for smaller organizations.','Report employee integration, paid learning, internal progression and job quality after acquisitions.','Publish a reconciled corporate social budget and independently reviewable educational and supply chain outcomes.'],
'saudi-aramco':['Report absolute emissions and local environmental remediation alongside production and investment decisions.','Clarify workforce and contractor reporting boundaries, safety indicators, career progression and paid learning.','Reconcile social and community spending to financial accounts and publish independent outcome evaluations.']}
def source(x):return x.get('source') or x.get('url')
def metric(x):
 if not isinstance(x,dict):return {'value':None}
 y=dict(x);y['source']=source(x);return y
def ev(x):
 if isinstance(x,str):return {'claim':x,'verification':'Interpretação documental','source':None}
 claim=x.get('claim') or x.get('title') or x.get('note') or x.get('reason') or x.get('metric') or x.get('subject') or 'Dado não confirmado'
 if x.get('value') is not None:
  value=x['value'];value=f"{value:,.3f}".rstrip('0').rstrip('.').replace(',','X').replace('.',',').replace('X','.') if isinstance(value,(int,float)) else value
  unit={'million':'milhões','hours_per_employee':'horas por empregado','employees':'empregados','percent':'%'}.get(x.get('unit'),x.get('unit',''))
  claim+=f" Valor: {x.get('currency') or ''} {value} {unit}."
 return {'claim':claim,'text':x.get('text'),'period':x.get('period'),'source':source(x),'verification':x.get('verification') or x.get('type') or 'Documento da empresa; escopo de verificação consultar fonte','limitation':x.get('limitation') or x.get('limitations') or x.get('limits') or x.get('caution')}
def many(x):
 if isinstance(x,list):return [ev(t) for t in x]
 if isinstance(x,dict):
  if 'evidence_status' in x and not any(isinstance(v,dict) for v in x.values()):return [ev({'claim':x['evidence_status'],'source':x.get('source_url'),'verification':'Lacuna de dados comparáveis'})]
  if 'findings' in x:return [ev(t) for t in x['findings']]
  if 'evidence' in x:return [ev(t) for t in x['evidence']]
  if 'text' in x:return [ev({'claim':x['text'],**{k:v for k,v in x.items() if k!='text'}})]
  return [ev(v) for k,v in x.items() if isinstance(v,dict)]
 return []
allc={c['id']:c for n in ['tech','plataformas','industria'] for c in json.loads((RAW/(n+'.json')).read_text())['companies']}
companies=[]
for rank,(id,short,cap,sector) in enumerate(selection,1):
 c=json.loads(json.dumps(allc[id]));raw=json.loads(json.dumps(c))
 c.update(short_name=short,market_rank=rank,market_cap_trillion=cap,sector=sector,assessment_summary=summaries[id],ratings={},review={'status':'partial','criticalIssuesResolved':False,'date':'2026-09-18'},honor_score=None,adherence_score=None)
 if isinstance(c['business_model'],dict):c['business_model_source']=source(c['business_model']);c['business_model']=c['business_model']['text']
 for k in ['revenue','net_income','capex','research','dividends','buybacks','employees']:c[k]=metric(c.get(k))
 for t in c['tickers']:t['source']=source(t)
 c['ceo']['source']=source(c['ceo']);c['ceo']['as_of']=c['ceo'].get('as_of') or c['ceo'].get('verified_as_of') or '2026-09-17'
 c['fiscal_label']='FY'+str(c.get('fiscal_year',2025)).removeprefix('FY') if isinstance(c.get('fiscal_year',2025),(int,str)) else 'FY2025'
 c['social_environment']=many(c.get('social_environment'));c['worker']=many(c.get('worker'))
 fi=c.get('financial_investments',{});c['investment_evidence']=many(fi)
 for k in ['interpretation','classification','contradictory_review']:
  if fi.get(k):c['investment_evidence'].append(ev({'claim':fi[k],'source':fi.get('policy_url') or c['net_income']['source'],'verification':'Interpretação documental'}))
 c['cases']=[]
 for e in c.get('legal_cases',[]):c['cases'].append({'claim':e.get('case') or e.get('subject') or 'Caso selecionado','text':e.get('status'),'period':e.get('event_date') or e.get('status_date'),'source':source(e),'verification':e.get('authority') or e.get('regulator') or e.get('agency'),'limitation':e.get('limitation') or e.get('limits') or e.get('caution')})
 c['gaps']=c.get('gaps') or c.get('assessment',{}).get('remaining_gaps') or c.get('critical_limits') or []
 if isinstance(c['gaps'],str):c['gaps']=[c['gaps']]
 c['gaps']+=['Série financeira de cinco a dez anos e avaliações histórica e atual completas.','Onze dimensões e aderência 30/30/30/10 ainda sem conciliação e revisão integral.']
 pc=c['public_contact'];pc['source']=source(pc);pc['type']=pc.get('type') or pc.get('channel')
 titles={'Annual':'Relatório anual','ESG':'Relatório socioambiental','Giving':'Relatório de doações e fundação','Legal':'Documento da autoridade competente','Ceo':'Liderança executiva','Workers':'Cadeia de fornecedores e trabalhadores','Education':'Programa educacional','Contact':'Contato institucional','CeoChange':'Transição da liderança','ESGBlog':'Apresentação do relatório ambiental','LegalNew':'Nova decisão da autoridade competente','Recent':'Resultados recentes','Release':'Comunicado de resultados','ESGHome':'Relatórios de sustentabilidade','Earnings':'Resultados financeiros','Sust':'Sustentabilidade','Safety':'Segurança no trabalho','FTC':'Documento da FTC','OSHA':'Documento de segurança ocupacional','Assurance':'Relatório de asseguração independente','EU':'Decisão da Comissão Europeia','Community':'Comunidades','Environment':'Ambiente','FTCOrder':'Ordem final da FTC'}
 for s in c['sources']:
  s['accessed_at']='2026-09-18'
  suffix=re.sub(r'^(nvda|apple|goog|msft|amazon|meta|broadcom)','',s['id'])
  if not s.get('title'):s['title']=titles.get(suffix,'Documento primário')+' — '+short
 (ROOT/'site/data'/f'{id}.json').write_text(json.dumps({'normalized':c,'research_original':raw},ensure_ascii=False,indent=2))
 companies.append(c)
 # Portuguese review copy and an English transmission copy.
 addressed=f"À liderança executiva e às equipes de pessoas, sustentabilidade e relações institucionais de {short}"
 pt=f"ÍNDOLE 360 — Carta de recomendações a {short}\n18 de setembro de 2026\n\n{addressed}\n\nApresento o ÍNDOLE 360, iniciativa de Aldenir Rocha para organizar evidências públicas sobre produtos, trabalho, ambiente e uso dos recursos empresariais. Gostaria de contribuir com sugestões e ouvir a documentação e a perspectiva da empresa.\n\nNossa referência autoral propõe 30% para melhoria do produto e capacidade produtiva, 30% para pessoas, 30% para impacto social, ambiental e humanitário e 10% para reserva sem busca de rendimento. É uma proposta para discussão e teste, não uma obrigação legal universal ou conclusão sobre a sua organização. Sua aplicação exige conciliação de caixa e obrigações, sem contar despesas anteriores ao lucro duas vezes.\n\nPropostas para consideração:\n"+'\n'.join(f'{i}. {x}' for i,x in enumerate(c['improvements'],1))+"\n\nSolicito, se possível, informações sobre recursos próprios efetivamente executados, benefícios fiscais, participação de terceiros, resultados dos projetos, satisfação e progressão dos trabalhadores, incluindo método e verificação independente. Nenhuma nota geral de conduta foi atribuída nesta rodada. A empresa pode corrigir dados e apresentar evidências adicionais.\n\nPeço o encaminhamento desta carta às lideranças responsáveis. Não se trata de proposta comercial nem solicitação de pagamento. Agradeço a consideração e o diálogo.\n\nAtenciosamente,\nAldenir Rocha de Oliveira Filho\nIdealizador do ÍNDOLE 360\n"
 en=f"Dear {short} executive leadership and sustainability / people teams,\n\nI am Aldenir Rocha de Oliveira Filho, founder of INDOLE 360, an independent initiative organizing public evidence on products, workers, environmental impacts and the use of corporate resources. Please forward this constructive feedback to the appropriate leadership team.\n\nI propose discussing a voluntary planning framework: 30% for product improvement, 30% for people, 30% for social, environmental and humanitarian impact, and 10% held as a reserve without seeking investment returns. This is my normative proposal, not a universal legal requirement or an allegation about your company. Any pilot would need reconciliation of cash, obligations and accounting treatment, without counting pre-profit expenses twice.\n\nSuggestions for consideration:\n"+'\n'.join(f'{i}. {x}' for i,x in enumerate(english[id],1))+"\n\nWe would welcome documentation on company-funded spending, actual project outcomes, tax incentives, third-party contributions and representative worker satisfaction and progression data. No overall conduct score has been assigned in this initial review. Corrections and supporting evidence are welcome.\n\nThis is not a sales proposal or a request for payment. Thank you for considering these suggestions.\n\nKind regards,\nAldenir Rocha de Oliveira Filho\nINDOLE 360\n"
 en+='\nPublic documents consulted:\n'+'\n'.join(s['url'] for s in c['sources'][:2])+'\n'
 (ROOT/'site/cartas'/f'{id}.txt').write_text(pt)
 (ROOT/'site/cartas'/f'{id}-en.txt').write_text(en)
data={'version':'2.0.0','updated_at':'2026-09-18','research_cutoff':'2026-09-17','selection':{'criterion':'Dez maiores empresas por capitalização no provedor consultado; não é ranking de índole','source':'https://companiesmarketcap.com/','consulted_at':'2026-09-18','market_date':'2026-09-17','limitation':'Fotografia do provedor; valores podem divergir por horário, ações em circulação e universo de cobertura. Nenhum valor de mercado foi usado na nota de conduta.'},'companies':companies}
(ROOT/'site/data/catalogo.json').write_text(json.dumps(data,ensure_ascii=False,indent=2))
(ROOT/'site/agentes').mkdir(exist_ok=True)
for p in (ROOT/'agentes').glob('*.md'):shutil.copy2(p,ROOT/'site/agentes'/p.name)
print('Companies:',len(companies),'Sources:',len({s['url'] for c in companies for s in c['sources']}))
