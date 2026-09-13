import {Astronomy as A} from './luma/astronomy.js';
import {CATALOG_ROWS,CATALOG_META} from './sky-catalog.js';
import {DEG,wrap,unit,rotate} from './sky-model.js';
export {CATALOG_META};
const ARCSEC=DEG/3600;
export const CATALOG=CATALOG_ROWS.map(row=>{
  const [hr,designation,ra,dec,mag,bv,pmRA,pmDec,spectral,names]=row,a=ra*DEG,d=dec*DEG;
  const direction=[Math.cos(d)*Math.cos(a),Math.cos(d)*Math.sin(a),Math.sin(d)];
  const east=[-Math.sin(a),Math.cos(a),0],north=[-Math.sin(d)*Math.cos(a),-Math.sin(d)*Math.sin(a),Math.cos(d)];
  const motion=east.map((x,i)=>ARCSEC*(x*(pmRA??0)+north[i]*(pmDec??0)));
  return {id:'HR '+hr,hr,designation,ra,dec,mag,bv,pmRA,pmDec,spectral,names,name:names[0]||designation||'HR '+hr,direction,motion,
    constellation:A.Constellation(ra/15,dec).name,constellationSymbol:A.Constellation(ra/15,dec).symbol};
});
export const CONSTELLATIONS=[...new Set(CATALOG.map(s=>s.constellation))].sort();
export function starDirection(star,year){return unit(star.direction.map((v,i)=>v+(year-2000)*star.motion[i]));}
const cache=new Map();
export function stellarField(sky){
  const key=JSON.stringify([sky.utc,sky.observer]);if(cache.has(key))return cache.get(key);
  const date=new Date(sky.utc),time=A.MakeTime(date),observer=new A.Observer(sky.observer.latitude,sky.observer.longitude,sky.observer.elevation);
  const rotation=A.Rotation_EQJ_HOR(time,observer),year=2000+time.tt/365.25;
  const rows=CATALOG.map(star=>{
    const v=starDirection(star,year),h=A.HorizonFromVector(new A.Vector(...rotate(rotation,v,time),time),'normal');
    return {star,...h,azimuth:h.lon,altitude:h.lat};
  });
  if(cache.size>=2)cache.delete(cache.keys().next().value);cache.set(key,rows);return rows;
}
export function domePoint(azimuth,altitude,cx,cy,r,below=false){
  const alt=below?-altitude:altitude;if(alt<0||alt>90.000001)return null;
  const radius=r*(90-alt)/90,a=azimuth*DEG;
  return [cx-radius*Math.sin(a),cy-radius*Math.cos(a)];
}
const guideCache=new Map();
export function skyGuides(sky){
  const key=JSON.stringify([sky.utc,sky.observer]);if(guideCache.has(key))return guideCache.get(key);
  const date=new Date(sky.utc),observer=new A.Observer(sky.observer.latitude,sky.observer.longitude,sky.observer.elevation);
  const hor=A.Rotation_EQJ_HOR(date,observer),ecl=A.Rotation_ECT_EQJ(date),eqd=A.Rotation_EQD_EQJ(date),gal=A.Rotation_GAL_EQJ();
  const result=[['Ecliptic',ecl],['Celestial equator',eqd],['Galactic equator',gal]].map(([name,rotation])=>({name,points:Array.from({length:181},(_,i)=>{
    const a=i*2*DEG,v=rotate(rotation,[Math.cos(a),Math.sin(a),0],date),h=A.HorizonFromVector(new A.Vector(...rotate(hor,v,date),A.MakeTime(date)), 'normal');
    return {azimuth:h.lon,altitude:h.lat};
  })}));
  if(guideCache.size>=2)guideCache.delete(guideCache.keys().next().value);guideCache.set(key,result);return result;
}
export function starColor(bv){
  if(bv===null)return '#e4eaf0';
  return bv<0?'#b0cbff':bv<.4?'#d4e2ff':bv<.8?'#fff2d5':bv<1.25?'#ffd3a4':'#ffad86';
}
export function selectedStarRecord(field){
  const s=field.star;return {catalog:CATALOG_META.id,id:s.id,name:s.name,names:s.names,designation:s.designation,
    sourceCoordinates:{raDegrees:s.ra,decDegrees:s.dec,frame:CATALOG_META.frame},properMotion:{raCosDec:s.pmRA,dec:s.pmDec,units:'arcsec/year'},
    Vmag:s.mag,BminusV:s.bv,spectral:s.spectral,constellation:s.constellation,altitude:field.altitude,azimuth:wrap(field.azimuth)};
}
