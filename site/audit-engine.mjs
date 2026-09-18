/** ÍNDOLE 360 v2.3 — local research drafts, not authenticated public ratings. */
import {DIMENSIONS, finite, validScore, safeURL, score} from './core.mjs';
export {DIMENSIONS};
export const SCHEMA = 'indole-draft/2.3';
const text = (v,max=2000) => typeof v==='string' ? v.slice(0,max).trim() : '';
export function validDate(v) {
 if(typeof v!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(v))return false;
 const d=new Date(v+'T00:00:00Z');
 return !Number.isNaN(d.getTime())&&d.toISOString().slice(0,10)===v;
}
export function blankDraft(name='',today=new Date().toISOString().slice(0,10)) {
 return {schemaVersion:SCHEMA,organization:{name:text(name,160),registry:'',sector:'',country:''},
 purpose:{statement:'',source:''},provenance:{product:'',brand:'',manufacturer:'',seller:'',country:'',source:''},
 period:{start:'',end:''},consultedAt:today,criticalStatus:'not-reviewed',
 ratings:Object.fromEntries(DIMENSIONS.map(d=>[d.id,{value:null,source:'',rationale:'',sourceType:'not-classified'}])),
 publication:{status:'draft',publicScore:null}};
}
export function sanitizeDraft(input) {
 if(!input||typeof input!=='object'||Array.isArray(input)||input.schemaVersion!==SCHEMA)throw new Error('Formato incompatível. Use um rascunho ÍNDOLE 2.3.');
 const out=blankDraft();
 for(const group of ['organization','purpose','provenance','period'])for(const k of Object.keys(out[group]))out[group][k]=text(input[group]?.[k],k==='name'?160:2000);
 out.consultedAt=text(input.consultedAt,10);
 out.criticalStatus=['not-reviewed','pending','clear'].includes(input.criticalStatus)?input.criticalStatus:'not-reviewed';
 for(const d of DIMENSIONS){const r=input.ratings?.[d.id];if(!r)continue;
  if(r.value!==null&&r.value!==undefined&&!validScore(r.value))throw new Error('Nota inválida em '+d.id+'. Use número entre 0 e 10 ou null.');
  out.ratings[d.id]={value:r.value??null,source:text(r.source),rationale:text(r.rationale),sourceType:['company','official','independent','other'].includes(r.sourceType)?r.sourceType:'not-classified'};
 }
 // Imported claims of approval are deliberately discarded: this browser cannot authenticate reviewers.
 out.publication={status:'draft',publicScore:null};return out;
}
export function assessDraft(input,today=new Date().toISOString().slice(0,10)) {
 const d=sanitizeDraft(input),validToday=validDate(today);
 const dated=validToday&&validDate(d.consultedAt)&&d.consultedAt<=today&&validDate(d.period.start)&&validDate(d.period.end)&&d.period.start<=d.period.end&&d.period.end<=d.consultedAt;
 const documented=DIMENSIONS.filter(x=>{const r=d.ratings[x.id];return validScore(r.value)&&safeURL(r.source)&&r.rationale&&r.sourceType!=='not-classified';});
 const numeric=DIMENSIONS.filter(x=>validScore(d.ratings[x.id].value)).length;
 const blocked=[];
 if(!d.organization.name)blocked.push('Identifique a organização.');
 if(!dated)blocked.push('Informe período e consulta válidos, sem datas futuras.');
 if(documented.length!==DIMENSIONS.length)blocked.push('Complete nota, justificativa, tipo e URL da evidência nas 11 dimensões.');
 if(d.criticalStatus!=='clear')blocked.push(d.criticalStatus==='pending'?'Há pendência crítica: não emitir classificação favorável.':'A revisão de pendências críticas não foi declarada.');
 const calculation=blocked.length?null:score(Object.fromEntries(DIMENSIONS.map(x=>[x.id,d.ratings[x.id].value])));
 return {documented:documented.length,numeric,totalDimensions:DIMENSIONS.length,calculation,blocked,publication:'draft',publicScore:null,
 notice:'Cobertura mede preenchimento documental, não veracidade. A declaração do pesquisador não substitui revisão independente.'};
}
export function compatibleRatio(numerator,denominator) {
 if(!numerator||!denominator||!finite(numerator.value)||numerator.value<0||!finite(denominator.value)||denominator.value<=0)return null;
 if(!['currency','unit','period'].every(k=>typeof numerator[k]==='string'&&numerator[k].trim()&&numerator[k]===denominator[k]))return null;
 if((numerator.scope||denominator.scope)&&numerator.scope!==denominator.scope)return null;
 return numerator.value/denominator.value*100;
}
export function cashBridge(row,tolerance=0.01) {
 const keys=['opening','operating','investing','financing','fx','closing'];
 if(!row||!keys.every(k=>finite(row[k]))||!finite(tolerance)||tolerance<0)return {expected:null,residual:null,reconciled:false};
 const expected=row.opening+row.operating+row.investing+row.financing+row.fx,residual=row.closing-expected;
 return {expected,residual,reconciled:Math.abs(residual)<=tolerance};
}
export function fundingOrigin({spent,incentive,thirdParty}={}) {
 if(![spent,incentive,thirdParty].every(v=>finite(v)&&v>=0)||incentive+thirdParty>spent)return null;
 return {own:spent-incentive-thirdParty,incentive,thirdParty};
}
export function historicalProfit(rows,expectedYears) {
 const invalid={total:null,known:0,complete:false};
 if(!Array.isArray(rows)||!rows.length||!Array.isArray(expectedYears)||!expectedYears.length||!expectedYears.every(Number.isInteger)||new Set(expectedYears).size!==expectedYears.length)return invalid;
 if(!rows.every(r=>r&&Number.isInteger(r.year)&&expectedYears.includes(r.year))||new Set(rows.map(r=>r.year)).size!==rows.length)return invalid;
 if(!['currency','unit','scope'].every(k=>rows.every(r=>typeof r[k]==='string'&&r[k].trim()&&r[k]===rows[0][k])))return invalid;
 if(!rows.every(r=>validDate(r.start)&&validDate(r.end)&&r.start<=r.end))return invalid;
 if(!rows.every(r=>{const days=(Date.parse(r.end)-Date.parse(r.start))/86400000+1;return days>=330&&days<=380;}))return invalid;
 const ordered=[...rows].sort((a,b)=>a.start.localeCompare(b.start));
 if(ordered.some((r,i)=>i>0&&ordered[i-1].end>=r.start))return invalid;
 const known=rows.filter(r=>finite(r.profit));
 return {total:known.length?known.reduce((s,r)=>s+r.profit,0):null,known:known.length,complete:known.length===expectedYears.length&&rows.length===expectedYears.length};
}
export function temporalDelta(current,baseline) {
 if(!current||!baseline||![current.score,baseline.score].every(v=>finite(v)&&v>=0&&v<=100))return null;
 if(!['scope','methodology'].every(k=>typeof current[k]==='string'&&current[k].trim()&&current[k]===baseline[k]))return null;
 if(![current.start,current.end,baseline.start,baseline.end].every(validDate)||current.start>current.end||baseline.start>baseline.end||baseline.end>=current.start)return null;
 return current.score-baseline.score;
}
