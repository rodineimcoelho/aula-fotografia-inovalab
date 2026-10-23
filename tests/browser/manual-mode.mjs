export async function useManualMode(page){
  await page.addInitScript(()=>{
    let saved={};try{saved=JSON.parse(localStorage.getItem('foto-settings')??'{}');}catch{}
    localStorage.setItem('foto-settings',JSON.stringify({view:innerWidth<=700?'study':'screen',guides:false,activity:'',...saved,guided:false}));
  });
}
