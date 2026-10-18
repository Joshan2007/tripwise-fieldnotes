// Use repository-provided attribution, never insert external HTML into the UI.
function plain(value=''){
  const doc=new DOMParser().parseFromString(String(value),'text/html');
  return (doc.body.textContent||'').replace(/\s+/g,' ').trim();
}
function https(value){try{const url=new URL(value);return url.protocol==='https:'?url.href:'';}catch{return '';}}
export async function attachCredits(places,signal){
  const names=[...new Set(places.filter(p=>p.image&&p.imageName).map(p=>`File:${p.imageName}`))];
  if(!names.length)return places;
  try{
    const params=new URLSearchParams({action:'query',format:'json',origin:'*',prop:'imageinfo',iiprop:'extmetadata|url',iiextmetadatafilter:'Artist|LicenseShortName|LicenseUrl',titles:names.join('|')});
    const response=await fetch(`https://en.wikipedia.org/w/api.php?${params}`,{signal});
    if(!response.ok)throw new Error('Photo credits unavailable');
    const result=await response.json();
    const credits=new Map(Object.values(result.query?.pages||{}).map(page=>{
      const info=page.imageinfo?.[0],meta=info?.extmetadata||{};
      return [page.title.replaceAll('_',' '),{artist:plain(meta.Artist?.value),license:plain(meta.LicenseShortName?.value),licenseUrl:https(meta.LicenseUrl?.value),source:https(info?.descriptionurl)}];
    }));
    return places.map(place=>{
      const credit=credits.get(`File:${place.imageName}`.replaceAll('_',' '));
      // If attribution cannot be identified, keep the destination and omit its photo.
      return credit?.license&&(credit.artist||/public domain|cc0/i.test(credit.license))?{...place,photoCredit:credit}:{...place,image:'',photoCredit:null};
    });
  }catch{
    return places.map(place=>({...place,image:'',photoCredit:null}));
  }
}
