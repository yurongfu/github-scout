export function parseRepoUrl(value){
 if(typeof value!=='string')return null;
 try{const url=new URL(value);if(url.protocol!=='https:'||url.hostname.toLowerCase()!=='github.com')return null;const bits=url.pathname.split('/').filter(Boolean);if(bits.length<2||!bits.slice(0,2).every(s=>/^[A-Za-z0-9_.-]+$/.test(s)))return null;return `${bits[0]}/${bits[1].replace(/\.git$/,'')}`;}catch{return null;}
}
export function feedUrl(owner,repo){if(!/^[\w.-]+$/.test(owner)||!/^[\w.-]+$/.test(repo))throw new Error('Invalid owner or repo');return `https://raw.githubusercontent.com/${owner}/${repo}/main/data/feed.json`;}
export function normalizeFeed(json){if(!json||json.schema_version!==1||!Array.isArray(json.repos))throw new Error('Unsupported feed format');return {date:String(json.date||''),repos:json.repos.filter(r=>r&&/^[\w.-]+\/[\w.-]+$/.test(r.full_name||'')&&r.html_url===`https://github.com/${r.full_name}`).slice(0,30)};}
