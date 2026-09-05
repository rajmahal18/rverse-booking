const { chromium } = require('C:/Users/user/AppData/Local/npm-cache/_npx/a8a7eec953f1f314/node_modules/playwright');
(async()=>{
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({reducedMotion:'reduce'});
await page.addInitScript(()=>sessionStorage.setItem('picklerverse-demo-role-v1','player'));
for(const width of [1440,390,320,768]){
await page.setViewportSize({width,height:1000});await page.goto('http://127.0.0.1:5173/demo');await page.waitForTimeout(1000);
console.log(width,await page.evaluate(()=>{const h=document.querySelector('.scenic-court-hero'),i=h.querySelector('img');return {overflow:document.documentElement.scrollWidth>innerWidth,image:i.currentSrc,loaded:i.complete&&i.naturalWidth>0,hero:h.getBoundingClientRect().toJSON(),copy:h.querySelector('.scenic-hero-copy').getBoundingClientRect().toJSON(),overlay:getComputedStyle(h,'::before').content}}));
await page.screenshot({path:'.tmp-hero/'+width+'.png'});
const before=await page.locator('.scenic-hero-media').evaluate(e=>e.getBoundingClientRect().top);await page.evaluate(()=>window.scrollBy(0,400));const after=await page.locator('.scenic-hero-media').evaluate(e=>e.getBoundingClientRect().top);console.log('scroll delta',after-before);
}
await page.locator('.scenic-hero-copy .court-main-cta').click();await page.waitForTimeout(600);console.log('booking',page.url());await browser.close();
})();
