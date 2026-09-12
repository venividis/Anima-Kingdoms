import {getCommonsDatabase} from '../../../db/commons';
import {handleCommons} from '../../../server/hosted-http.mjs';
export const dynamic='force-dynamic';
export async function GET(request:Request){return handleCommons(request,getCommonsDatabase());}
export async function POST(request:Request){return handleCommons(request,getCommonsDatabase());}
