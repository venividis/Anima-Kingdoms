"""Independent numerical comparison; Swiss Ephemeris is not a game dependency.
Usage: python scripts/compare-sky.py [directory containing pyswisseph]
Uses Moshier explicitly, and reports both same-UT and controlled same-TT output.
"""
import json, pathlib, subprocess, sys
if len(sys.argv)>1: sys.path.insert(0,sys.argv[1])
import swisseph as swe

root=pathlib.Path(__file__).resolve().parents[1]
script="""
import {calculateSky,horizonAngles} from './public/sky-model.js';
const dates=['1800-01-01T12:00:00Z','1900-01-01T12:00:00Z','2000-01-01T12:00:00Z','2024-04-08T18:00:00Z','2026-09-11T12:00:00Z','2100-01-01T12:00:00Z','2200-01-01T12:00:00Z'];
const rows=dates.map(date=>{const sky=calculateSky(date,{latitude:51.4779,longitude:0,elevation:0});return {date,time:sky.time,bodies:sky.bodies.map(b=>({name:b.name,longitude:b.longitude})),angles:[-75,-66,-38,0,38,51.4779,66,75].flatMap(latitude=>[-120,0,150].map(longitude=>({latitude,longitude,...horizonAngles(new Date(date),{latitude,longitude,elevation:0})})))};});
console.log(JSON.stringify(rows));
"""
samples=json.loads(subprocess.check_output(['node','--input-type=module','-e',script],cwd=root,text=True))
signed=lambda x:(x+180)%360-180
body_rows,angle_rows=[],[]
for sample in samples:
    ut,tt=sample['time']['julianUT'],sample['time']['julianTT']
    for body in sample['bodies']:
        code=getattr(swe,body['name'].upper())
        value,flags=swe.calc_ut(ut,code,swe.FLG_MOSEPH)
        controlled,flags_tt=swe.calc(tt,code,swe.FLG_MOSEPH)
        assert flags & swe.FLG_MOSEPH and flags_tt & swe.FLG_MOSEPH
        body_rows.append({'date':sample['date'],'body':body['name'],'modelDegrees':body['longitude'],'swissSameUT':value[0],'swissSameTT':controlled[0],
            'sameUTDifferenceArcmin':abs(signed(body['longitude']-value[0]))*60,'sameTTDifferenceArcmin':abs(signed(body['longitude']-controlled[0]))*60})
    for loc in sample['angles']:
        _,angles=swe.houses_ex(ut,loc['latitude'],loc['longitude'],b'W',0)
        angle_rows.append({'date':sample['date'],**loc,'swissAscendant':angles[0],'swissMidheaven':angles[1],
            'ascendantDifferenceArcsec':abs(signed(loc['ascendant']-angles[0]))*3600,'midheavenDifferenceArcsec':abs(signed(loc['midheaven']-angles[1]))*3600})
summary={'bodyCases':len(body_rows),'angleCases':len(angle_rows),
    'maxSameUTLongitudeArcmin':max(r['sameUTDifferenceArcmin'] for r in body_rows),
    'maxSameTTLongitudeArcmin':max(r['sameTTDifferenceArcmin'] for r in body_rows),
    'maxAscendantArcsec':max(r['ascendantDifferenceArcsec'] for r in angle_rows),
    'maxMidheavenArcsec':max(r['midheavenDifferenceArcsec'] for r in angle_rows)}
report={'reference':'Swiss Ephemeris '+swe.version,'pythonBinding':swe.__version__,'flags':'FLG_MOSEPH; houses_ex whole-sign convention; tropical',
    'scope':'Model comparison, not observational certification. Same-UT results retain time-model disagreement. Controlled TT isolates position-model differences. Swiss software is not bundled or served.',
    'documentation':'https://www.astro.com/swisseph/swephprg.htm','summary':summary,'samples':samples,'bodies':body_rows,'angles':angle_rows}
out=root/'docs/audit/sky';out.mkdir(parents=True,exist_ok=True);(out/'swiss-comparison.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(summary,indent=2))
