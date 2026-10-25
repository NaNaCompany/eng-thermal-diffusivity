import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {evaluate,constants} from '../engine.js';import {units,fromSI,toSI} from '../units.js';
const tool=JSON.parse(fs.readFileSync(new URL('../tool.json',import.meta.url),'utf8'));
const reference=JSON.parse(fs.readFileSync(new URL('./reference.json',import.meta.url),'utf8'));
const raw=()=>Object.fromEntries(tool.fields.map(f=>[f.key,{value:String(f.example),unit:units[f.dimension][0].id}]));
const run=(values=raw(),confirmed=true)=>evaluate(tool,values,confirmed);
const close=(a,b)=>assert.ok(Math.abs(a-b)<=Math.max(Math.abs(b)*2e-12,Number.MIN_VALUE*20),`${tool.id}: ${a} != ${b}`);
function changed(key,value,unit){const values=raw();values[key]={value:String(value),unit:unit||units[tool.fields.find(f=>f.key===key).dimension][0].id};return values;}
test('independent 70-digit Decimal reference example',()=>close(run().value,reference.value));
test('every supported input unit preserves the same physical result',()=>{for(const f of tool.fields)for(const u of units[f.dimension]){const values=raw();values[f.key]={value:String(fromSI(f.example,f.dimension,u.id)),unit:u.id};close(run(values).value,reference.value);}});
test('every result unit preserves the same quantity on SI round trip',()=>{for(const u of units[tool.result_dimension])close(toSI(String(fromSI(reference.value,tool.result_dimension,u.id)),tool.result_dimension,u.id),reference.value);});
test('empty malformed nonfinite and underflow inputs are rejected',()=>{for(const field of tool.fields)for(const value of ['',' ','NaN','Infinity','0x10','1,000','2foo','1e999','1e-999'])assert.throws(()=>run(changed(field.key,value)));});
test('all declared domain constraints are enforced in SI',()=>{for(const f of tool.fields){const bad={positive:[0,-1],nonnegative:[-1],nonzero:[0],integer:[0,1.5,9007199254740992],unitInterval:[-1,1.01],openInterval:[0,1,-1],quarterTurn:[-.01,1.58],incidentAngle:[-.01,1.58]}[f.constraint]||[];for(const value of bad)assert.throws(()=>run(changed(f.key,value)));}});
test('units from another dimension are rejected',()=>{const value=raw();value[tool.fields[0].key].unit='__unknown__';assert.throws(()=>run(value));});
test('absolute temperatures and differences use separate conversions',()=>{close(toSI('0','temperature','C'),273.15);close(toSI('32','temperature','F'),273.15);close(toSI('18','deltaT','Fdiff'),10);for(const f of tool.fields.filter(f=>f.dimension==='temperature'))assert.throws(()=>run(changed(f.key,-273.15,'C')));});
test('explicit approximation checkboxes are required only when defined',()=>{if(tool.condition)assert.throws(()=>run(raw(),false));else close(run(raw(),false).value,reference.value);});
test('model-specific physical boundaries and absent diffraction orders',()=>{
 const id=tool.id;
 if(['E051','E052'].includes(id))assert.throws(()=>run(changed('r',1e-30)));
 if(['E057','E058'].includes(id)){assert.throws(()=>run(changed('v',constants.c)));assert.throws(()=>run(changed('v',constants.c*2)));}
 // Fixed independent 70-digit Decimal references use the exact binary64 inputs.
 if(id==='E053'){
  close(run(changed('r2',7e6+1e-6)).value,5.391334072802901934311490097065668e-10);
  close(run(changed('r2',7e6+2**-30)).value,5.019864127377541134234069006641817e-13);
  const reverse=raw();reverse.r1.value=String(7e6+2**-30);reverse.r2.value='7000000';
  close(run(reverse).value,5.019864127377541134234069006641817e-13);
 }
 if(id==='E057'){
  close(run(changed('v',constants.c-1e-6)).value,12162723.69728016493898978171723763);
  close(run(changed('v',constants.c-2**-24)).value,50148194.49908903998526976032857561);
 }
 if(id==='E058'){
  close(run(changed('v',constants.c-1e-6)).value,1.093131001172038338939552595661424e24);
  close(run(changed('v',constants.c-2**-24)).value,4.507094861160228655407236941393841e24);
 }
 if(id==='E065'){
  const disparate=raw();disparate.m1.value='1e308';disparate.m2.value='1e-308';disparate.x1.value='1';
  assert.throws(()=>run(disparate));
  disparate.m1.value='1e-308';disparate.m2.value='1e308';assert.throws(()=>run(disparate));
 }
 if(id==='E069')assert.throws(()=>run(changed('inner',.1)));
 if(id==='E071')assert.throws(()=>run(changed('dt',1000)));
 if(id==='E076'){
  close(run(changed('v2',.01+2**-59)).value,4.326988048152603328703228275050121e-13);
  const compression=raw();compression.v1.value=String(.01+2**-59);compression.v2.value='.01';
  close(run(compression).value,-4.326988048152603328703228275050121e-13);
 }
 if(id==='E077')assert.throws(()=>run(changed('gamma',1)));
 if(id==='E078')close(run(changed('b',20)).value,20);
 if(id==='E080'){assert.throws(()=>run(changed('theta',181,'deg')));assert.ok(run(changed('theta',120,'deg')).value<0);}
 if(id==='E084'){assert.throws(()=>run(changed('phase',181,'deg')));assert.ok(run(changed('phase',180,'deg')).value<0);}
 if(id==='E090')assert.equal(run(changed('order',3)).kind,'absent-order');
 if(id==='E091'){
  close(run(changed('p',20e-6+2**-68)).value,1.471446939931162948842623639656882e-15);
  const below=raw();below.p.value=String(20e-6);below.pref.value=String(20e-6+2**-68);
  close(run(below).value,-1.471446939931162948842623639656882e-15);
 }
 if(id==='E092'){assert.throws(()=>run(changed('vs',340)));assert.throws(()=>run(changed('vo',-340)));}
 if(id==='E093'){close(run(changed('h',1000)).value,0);assert.ok(run(changed('h',10000)).value<0);}
 if(id==='E095')assert.throws(()=>run(changed('t',1e100)));
 if(id==='E097'){assert.throws(()=>run(changed('d',.01)));assert.ok(run(changed('rhop',500)).value<0);}
 if(id==='E100'){
  assert.throws(()=>run(changed('x2',.02)));
  const peaks=raw();peaks.x1.value=String(.01+2**-59);peaks.x2.value='.01';
  close(run(peaks).value,1.734723475976806907837461118878458e-16);
  peaks.n.value='10';close(run(peaks).value,1.734723475976806907837461118878458e-17);
 }
});
test('legitimate exact zeros and limiting cases are not rejected',()=>{
 const zeros={E058:['v',0],E061:['h',0],E062:['theta',Math.PI/2],E063:['f',0],E066:['v',0],E067:['mu',0],E068:['x',0],E070:['f',0],E075:['dt',0],E076:['v2',.01],E079:['v',0],E080:['theta',Math.PI/2],E081:['q',0],E082:['v',0],E084:['phase',Math.PI/2],E088:['n2',1],E091:['p',20e-6],E093:['h',1000],E094:['q',1],E095:['a',0],E096:['p',0],E097:['rhop',1000],E098:['dp',0],E100:['x2',.01]};
 if(zeros[tool.id])close(run(changed(...zeros[tool.id])).value,0);
 if(tool.id==='E053')close(run(changed('r2',7e6)).value,0);
 if(tool.id==='E057')close(run(changed('v',0)).value,1);
 if(tool.id==='E087')close(run(changed('freq',0)).value,1);
 if(tool.id==='E099'){const v=raw();v.u1.value='0';v.u2.value='0';close(run(v).value,0);}
});
test('extreme magnitudes never silently yield NaN or infinity',()=>{const v=raw(),f=tool.fields.find(f=>f.constraint==='positive');if(f)v[f.key].value='1e308';try{const result=run(v);if(result.kind==='number')assert.ok(Number.isFinite(result.value));}catch(e){assert.ok(e.message.length>0);}});
test('publisher tags original assets and adopted physical constants are present',()=>{const text=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');for(const v of ['GTM-NV2WWQXB','G-2ZYSF0173P','ca-pub-9767176956440077','cloudflareinsights.com/beacon.min.js','More Apps','https://nanalab.kr/apps/',tool.site])assert.ok(text.includes(v));assert.ok(fs.existsSync(new URL('../og.png',import.meta.url)));assert.equal(constants.G,6.67430e-11);assert.equal(constants.c,299792458);assert.equal(constants.mu0,1.25663706127e-6);});
