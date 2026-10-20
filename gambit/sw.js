// Retire only the old Gambit shell. Browser drafts and personal data stay intact.
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil((async()=>{
  for(const key of await caches.keys())if(key.startsWith('spider-gambit-shell-'))await caches.delete(key);
  await self.registration.unregister();
})()));
