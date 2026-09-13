import {DatabaseSync,backup} from 'node:sqlite';
import {openSync,closeSync,mkdirSync,rmSync,chmodSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {SharedRealm} from './authority.mjs';

// SQLite's online backup API snapshots committed pages, including active WAL data.
// A raw copy of only the .sqlite file while the server runs does not do that.
export async function backupRealm(sourcePath,destinationPath) {
  if(!sourcePath||!destinationPath||sourcePath===':memory:')throw Error('Supply an existing realm database path and a new backup path.');
  const source=resolve(sourcePath),destination=resolve(destinationPath);if(source===destination)throw Error('The backup destination must differ from its source.');
  const db=new DatabaseSync(source,{readOnly:true});let reserved=false;
  try {
    mkdirSync(dirname(destination),{recursive:true,mode:0o700});closeSync(openSync(destination,'wx',0o600));reserved=true;
    await backup(db,destination);
    const checked=new SharedRealm({path:destination});let summary;try{const state=checked.read();summary={path:destination,realmId:state.realmId,revision:state.revision,players:Object.keys(state.players).length,openOffers:state.offers.filter(o=>o.status==='open').length};}finally{checked.close();}
    chmodSync(destination,0o600);return summary;
  }catch(error){if(reserved)for(const suffix of ['','-wal','-shm'])rmSync(destination+suffix,{force:true});throw error;}finally{db.close();}
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const [source,destination,...extra]=process.argv.slice(2);if(extra.length||!source||!destination)throw Error('Usage: node server/backup.mjs SOURCE.sqlite NEW-BACKUP.sqlite');
  const result=await backupRealm(source,destination);process.stdout.write(JSON.stringify(result)+'\n');
}
