import {env} from 'cloudflare:workers';
export function getCommonsDatabase(){return env.DB;}
