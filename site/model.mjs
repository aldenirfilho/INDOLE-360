import {finite,ratio,strictSum} from './core.mjs';
export function model(base){if(!finite(base)||base<=0)return null;return {product:base*.3,people:base*.3,impact:base*.3,reserve:base*.1};}
export function adherence(base,amounts){const targets=model(base);if(!targets||!amounts||!Object.keys(targets).every(k=>finite(amounts[k])&&amounts[k]>=0))return null;return Object.keys(targets).reduce((a,k)=>a+Math.min(amounts[k],targets[k]),0)/base*100;}
export function indicators(c){return {research:ratio(c.research?.value,c.revenue?.value),capex:ratio(c.capex?.value,c.revenue?.value),distribution:ratio(strictSum([c.dividends?.value,c.buybacks?.value]),c.net_income?.value)};}
export function ordered(companies,key){return [...companies].sort((a,b)=>{if(key==='name')return a.name.localeCompare(b.name,'pt-BR');if(key==='market')return a.market_rank-b.market_rank;const x=indicators(a)[key],y=indicators(b)[key];return x===null?(y===null?0:1):y===null?-1:y-x;});}
