import http from 'node:http';
import { DatabaseSync } from 'node:sqlite';
import { randomBytes, randomUUID, createHash, timingSafeEqual } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { readFile, writeFile, unlink } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root=path.dirname(fileURLToPath(import.meta.url));
const hash=value=>createHash('sha256').update(String(value)).digest('hex');
class HttpError extends Error { constructor(status,message){super(message);this.status=status;} }
const requireValue=(condition,status,message)=>{if(!condition)throw new HttpError(status,message);};
const text=(value,max=100)=>typeof value==='string'?value.trim().slice(0,max):'';
const secretsEqual=(a,b)=>timingSafeEqual(Buffer.from(hash(a),'hex'),Buffer.from(hash(b),'hex'));

export function createApplication({dataDir=process.env.DATA_DIR||path.join(root,'data'),adminKey=process.env.ADMIN_KEY||randomBytes(32).toString('hex')}={}){
  dataDir=path.resolve(dataDir);mkdirSync(dataDir,{recursive:true});const uploadDir=path.join(dataDir,'uploads');mkdirSync(uploadDir,{recursive:true});
  const db=new DatabaseSync(path.join(dataDir,'atividade.sqlite'),{timeout:5000});
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;
    CREATE TABLE IF NOT EXISTS sessions(id TEXT PRIMARY KEY,code TEXT UNIQUE NOT NULL,title TEXT NOT NULL,phase TEXT NOT NULL DEFAULT 'collect',created INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS groups(id TEXT PRIMARY KEY,session_id TEXT NOT NULL REFERENCES sessions(id),name TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS participants(id TEXT PRIMARY KEY,session_id TEXT NOT NULL REFERENCES sessions(id),label TEXT NOT NULL,role TEXT NOT NULL,access_hash TEXT UNIQUE NOT NULL,token_hash TEXT UNIQUE,group_id TEXT REFERENCES groups(id));
    CREATE TABLE IF NOT EXISTS submissions(id TEXT PRIMARY KEY,session_id TEXT NOT NULL REFERENCES sessions(id),group_id TEXT UNIQUE NOT NULL REFERENCES groups(id),title TEXT NOT NULL,filename TEXT NOT NULL,mime TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'pending',created INTEGER NOT NULL);
    CREATE INDEX IF NOT EXISTS participants_session ON participants(session_id);
    CREATE INDEX IF NOT EXISTS submissions_session ON submissions(session_id);`);
  db.exec("UPDATE sessions SET phase='results' WHERE phase='vote'");
  const getSession=id=>db.prepare('SELECT * FROM sessions WHERE id=? OR code=?').get(id,id);
  function identity(req){
    const token=String(req.headers.authorization||'').replace(/^Bearer /,'');
    requireValue(token.length>0,401,'Entre com seu código para continuar.');
    if(secretsEqual(token,adminKey))return {role:'admin'};
    const participant=db.prepare('SELECT id,session_id,label,role,group_id FROM participants WHERE token_hash=?').get(hash(token));
    requireValue(participant,401,'Seu acesso expirou. Entre novamente com seu código.');return participant;
  }
  const requireAdmin=req=>{const user=identity(req);requireValue(user.role==='admin',403,'Esta ação é do professor.');return user;};
  async function body(req){
    requireValue(String(req.headers['content-type']||'').startsWith('application/json'),415,'Envie os dados em JSON.');
    let size=0;const parts=[];
    for await(const chunk of req){size+=chunk.length;requireValue(size<=12*1024*1024,413,'A imagem é muito grande. Exporte uma cópia menor.');parts.push(chunk);}
    try{return JSON.parse(Buffer.concat(parts).toString('utf8'));}catch{throw new HttpError(400,'Não foi possível ler os dados enviados.');}
  }
  function json(res,status,value){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(value));}
  function state(sessionId,user){
    const session=getSession(sessionId);requireValue(session,404,'Sessão não encontrada.');
    requireValue(user.role==='admin'||user.session_id===session.id,403,'Seu código pertence a outra sessão.');
    const groups=db.prepare('SELECT id,name FROM groups WHERE session_id=? ORDER BY rowid').all(session.id);
    let photos=db.prepare(`SELECT s.id,s.title,s.group_id,s.status,g.name as group_name,s.created FROM submissions s JOIN groups g ON g.id=s.group_id WHERE s.session_id=? ORDER BY s.created`).all(session.id);
    if(user.role!=='admin')photos=photos.filter(p=>p.group_id===user.group_id||(session.phase!=='collect'&&p.status==='approved'));
    const participants=user.role==='admin'?db.prepare('SELECT id,label,role,group_id,token_hash IS NOT NULL as joined FROM participants WHERE session_id=? ORDER BY rowid').all(session.id):undefined;
    return {session,groups,photos,participants,user};
  }
  const attempts=new Map();
  function rateLimit(req,key,limit){const now=Date.now();if(attempts.size>2000)for(const [k,v]of attempts)if(v.until<now)attempts.delete(k);const k=`${req.socket.remoteAddress}:${key}`,entry=attempts.get(k)||{count:0,until:now+60000};if(now>entry.until){entry.count=0;entry.until=now+60000;}entry.count++;attempts.set(k,entry);requireValue(entry.count<=limit,429,'Muitas tentativas. Aguarde um minuto e tente novamente.');}
  const server=http.createServer(async(req,res)=>{
    res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');
    res.setHeader('Content-Security-Policy',"default-src 'self'; img-src 'self' blob: data:; font-src 'self'; style-src 'self'; script-src 'self'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'");
    try{
      const url=new URL(req.url,'http://localhost');const route=url.pathname,method=req.method;
      if(method==='GET'&&route==='/health'){json(res,200,{ok:true});return;}
      if(method==='GET'&&route==='/api/admin/sessions'){
        requireAdmin(req);json(res,200,{sessions:db.prepare('SELECT * FROM sessions ORDER BY created DESC').all()});return;
      }
      if(method==='POST'&&route==='/api/admin/sessions'){
        requireAdmin(req);const input=await body(req);const title=text(input.title,100);requireValue(title,400,'Dê um título à sessão.');
        const id=randomUUID(),code=randomBytes(3).toString('hex').toUpperCase();db.prepare('INSERT INTO sessions(id,code,title,created) VALUES(?,?,?,?)').run(id,code,title,Date.now());json(res,201,{session:getSession(id)});return;
      }
      let match=route.match(/^\/api\/session\/([^/]+)$/);
      if(method==='GET'&&match){
        const session=getSession(decodeURIComponent(match[1]).toUpperCase());requireValue(session,404,'Confira o código da sessão.');
        json(res,200,{session:{id:session.id,code:session.code,title:session.title,phase:session.phase},groups:db.prepare('SELECT id,name FROM groups WHERE session_id=? ORDER BY rowid').all(session.id)});return;
      }
      if(method==='POST'&&route==='/api/join'){
        rateLimit(req,'join',300);const input=await body(req);const session=getSession(text(input.sessionCode,40).toUpperCase());requireValue(session,404,'Confira o código da sessão.');
        const participant=db.prepare('SELECT * FROM participants WHERE session_id=? AND access_hash=?').get(session.id,hash(text(input.accessCode,60).toUpperCase()));requireValue(participant,401,'Código individual inválido. Peça ajuda ao professor.');
        let group=participant.group_id;
        if(participant.role==='student'&&!group){const choice=db.prepare('SELECT id FROM groups WHERE id=? AND session_id=?').get(text(input.groupId,50),session.id);requireValue(choice,400,'Escolha o seu grupo.');group=choice.id;}
        const token=randomBytes(32).toString('hex');db.prepare('UPDATE participants SET token_hash=?,group_id=? WHERE id=?').run(hash(token),group,participant.id);
        json(res,200,{token,...state(session.id,{id:participant.id,session_id:session.id,label:participant.label,role:participant.role,group_id:group})});return;
      }
      match=route.match(/^\/api\/state\/([^/]+)$/);
      if(method==='GET'&&match){json(res,200,state(decodeURIComponent(match[1]),identity(req)));return;}
      match=route.match(/^\/api\/admin\/session\/([^/]+)\/(groups|codes|phase)$/);
      if(method==='POST'&&match){
        requireAdmin(req);const session=getSession(match[1]);requireValue(session,404,'Sessão não encontrada.');const input=await body(req);
        if(match[2]==='groups'){
          requireValue(session.phase==='collect',409,'Os grupos são criados antes de encerrar os envios.');const count=Number(input.count||1);requireValue(Number.isInteger(count)&&count>=1&&count<=50,400,'Crie entre 1 e 50 grupos por vez.');
          const existing=db.prepare('SELECT COUNT(*) as n FROM groups WHERE session_id=?').get(session.id).n;
          for(let i=0;i<count;i++)db.prepare('INSERT INTO groups(id,session_id,name) VALUES(?,?,?)').run(randomUUID(),session.id,count===1&&text(input.name,60)?text(input.name,60):`Grupo ${existing+i+1}`);
          json(res,201,state(session.id,{role:'admin'}));return;
        }
        if(match[2]==='codes'){
          const count=Number(input.count),role='student';requireValue(Number.isInteger(count)&&count>=1&&count<=300,400,'Escolha uma quantidade entre 1 e 300.');
          const existing=db.prepare('SELECT COUNT(*) as n FROM participants WHERE session_id=? AND role=?').get(session.id,role).n;
          const codes=[];const insert=db.prepare('INSERT INTO participants(id,session_id,label,role,access_hash) VALUES(?,?,?,?,?)');
          db.exec('BEGIN');try{for(let i=0;i<count;i++){const code=`P-${randomBytes(5).toString('hex').toUpperCase()}`,label=`Participante ${existing+i+1}`;insert.run(randomUUID(),session.id,label,role,hash(code));codes.push({label,code,role});}db.exec('COMMIT');}catch(error){db.exec('ROLLBACK');throw error;}
          json(res,201,{codes});return;
        }
        const next=input.phase;requireValue(session.phase==='collect'&&next==='results',409,'Encerre os envios para liberar a mostra.');
        const approved=db.prepare("SELECT COUNT(*) as n FROM submissions WHERE session_id=? AND status='approved'").get(session.id).n;requireValue(approved>=1,409,'Aprove pelo menos uma foto antes de abrir a mostra.');
        db.prepare('UPDATE sessions SET phase=? WHERE id=?').run(next,session.id);json(res,200,state(session.id,{role:'admin'}));return;
      }
      if(method==='POST'&&route==='/api/submissions'){
        const user=identity(req);requireValue(user.role==='student'&&user.group_id,403,'A entrega é feita por um participante do grupo.');rateLimit(req,`upload:${user.id}`,15);
        const session=getSession(user.session_id);requireValue(session.phase==='collect',409,'As entregas desta sessão já foram encerradas.');
        const input=await body(req),title=text(input.title,80);requireValue(title.length>=1,400,'Dê um título à foto.');
        const image=String(input.image||'').match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/);requireValue(image,400,'Envie uma imagem JPEG, PNG ou WebP.');
        const buffer=Buffer.from(image[2],'base64');requireValue(buffer.length>16&&buffer.length<=8*1024*1024,413,'A imagem precisa ter até 8 MB.');
        const valid=image[1]==='image/jpeg'?buffer.subarray(0,3).equals(Buffer.from([255,216,255])):image[1]==='image/png'?buffer.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])):buffer.subarray(0,4).toString()==='RIFF'&&buffer.subarray(8,12).toString()==='WEBP';
        requireValue(valid,400,'O arquivo não corresponde ao formato da imagem. Exporte uma nova cópia.');
        const old=db.prepare('SELECT * FROM submissions WHERE group_id=?').get(user.group_id),id=old?.id||randomUUID(),extension=image[1].split('/')[1],filename=`${randomUUID()}.${extension}`;
        await writeFile(path.join(uploadDir,filename),buffer,{flag:'wx'});
        if(getSession(user.session_id).phase!=='collect'){await unlink(path.join(uploadDir,filename)).catch(()=>{});throw new HttpError(409,'As entregas foram encerradas durante o envio. Peça ajuda ao professor.');}
        db.prepare(`INSERT INTO submissions(id,session_id,group_id,title,filename,mime,status,created) VALUES(?,?,?,?,?,?,'pending',?) ON CONFLICT(group_id) DO UPDATE SET title=excluded.title,filename=excluded.filename,mime=excluded.mime,status='pending',created=excluded.created`).run(id,user.session_id,user.group_id,title,filename,image[1],Date.now());
        if(old)await unlink(path.join(uploadDir,old.filename)).catch(()=>{});json(res,201,state(user.session_id,user));return;
      }
      match=route.match(/^\/api\/admin\/photos\/([^/]+)$/);
      if(method==='POST'&&match){
        requireAdmin(req);const input=await body(req);requireValue(['approved','rejected','pending'].includes(input.status),400,'Escolha um estado de revisão válido.');
        const photo=db.prepare('SELECT * FROM submissions WHERE id=?').get(match[1]);requireValue(photo,404,'Foto não encontrada.');requireValue(getSession(photo.session_id).phase==='collect',409,'Revise as fotos antes de abrir a mostra.');
        db.prepare('UPDATE submissions SET status=? WHERE id=?').run(input.status,photo.id);json(res,200,{ok:true});return;
      }
      match=route.match(/^\/api\/images\/([^/]+)$/);
      if(method==='GET'&&match){
        const user=identity(req),photo=db.prepare('SELECT * FROM submissions WHERE id=?').get(match[1]);requireValue(photo,404,'Foto não encontrada.');const session=getSession(photo.session_id);
        requireValue(user.role==='admin'||(user.session_id===session.id&&(user.group_id===photo.group_id||(session.phase!=='collect'&&photo.status==='approved'))),403,'Esta foto ainda não está disponível na galeria.');
        const buffer=await readFile(path.join(uploadDir,photo.filename));res.writeHead(200,{'Content-Type':photo.mime,'Cache-Control':'private, no-store','Content-Length':buffer.length});res.end(buffer);return;
      }
      const files={'/':'index.html','/admin':'index.html','/app.js':'app.js','/style.css':'style.css','/image-loading.svg':'image-loading.svg'};
      if(method==='GET'&&route==='/font.woff2'){const font=await readFile(path.join(root,'public/font.woff2'));res.writeHead(200,{'Content-Type':'font/woff2','Cache-Control':'public, max-age=86400'});res.end(font);return;}
      if(method==='GET'&&files[route]){const name=files[route],buffer=await readFile(path.join(root,'public',name));res.writeHead(200,{'Content-Type':name.endsWith('.js')?'text/javascript; charset=utf-8':name.endsWith('.css')?'text/css; charset=utf-8':name.endsWith('.svg')?'image/svg+xml':'text/html; charset=utf-8','Cache-Control':'no-cache'});res.end(buffer);return;}
      json(res,404,{error:'Endereço não encontrado.'});
    }catch(error){if(!res.headersSent)json(res,error.status||500,{error:error.status?error.message:'Não foi possível concluir a operação. Tente novamente.'});else res.end();}
  });
  server.requestTimeout=30000;server.headersTimeout=15000;
  return {server,db,adminKey,close:()=>new Promise(resolve=>{server.close(()=>{db.close();resolve();});server.closeIdleConnections();})};
}

if(process.argv[1]&&pathToFileURL(path.resolve(process.argv[1])).href===import.meta.url){
  const app=createApplication();const port=Number(process.env.PORT||3001),host=process.env.HOST||'127.0.0.1';
  app.server.listen(port,host,()=>{console.log(`Atividade: http://${host}:${port}\nPainel: http://${host}:${port}/admin`);if(!process.env.ADMIN_KEY)console.log(`Chave temporária do professor: ${app.adminKey}\nDefina ADMIN_KEY no ambiente para conservar a chave entre reinícios.`);});
  process.on('SIGINT',()=>void app.close().then(()=>process.exit()));process.on('SIGTERM',()=>void app.close().then(()=>process.exit()));
}
