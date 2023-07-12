// ==UserScript== 
// @name        Flash Player
// @namespace   com.swf2js
// @description Play flash (.swf) files
// @homepageURL https://openuserjs.org/scripts/sjehuda/Flash_Player
// @supportURL  https://openuserjs.org/scripts/sjehuda/Flash_Player/issues
// @updateURL   https://openuserjs.org/meta/sjehuda/Flash_Player.meta.js
// @copyright   2023, Schimon Jehudah (http://schimon.i2p)
// @license     MIT; https://opensource.org/licenses/MIT
// @require     https://raw.githubusercontent.com/swf2js/swf2js/4619a7e06d2863bd24ae89b11b2218f00fb32771/swf2js.js
// @include     *
// @version     23.05
// @icon        data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48dGV4dCB5PSIuOWVtIiBmb250LXNpemU9IjkwIj7imqE8L3RleHQ+PC9zdmc+Cg==
// ==/UserScript==

for (const element of document.querySelectorAll('embed[src$=".swf"]')) {
  
  let divElement = document.createElement('div');
  divElement.textContent = 'Play ⚡';// ▶️ Click to Play
  divElement.setAttribute('swf-data', element.src);
  divElement.style.height = element.closest('object').height;
  divElement.style.width = element.closest('object').width;
  divElement.style.fontSize = element.closest('object').height / 10;
  divElement.style.fontStyle = 'italic';
  divElement.style.display = 'table-cell';
  divElement.style.verticalAlign = 'middle';
  divElement.style.background = 'DarkRed';
  divElement.style.color = 'WhiteSmoke';
  divElement.style.textAlign = 'center';
  divElement.style.fontWeight = 'bold';
  divElement.style.userSelect = 'none';

  divElement.addEventListener ("click", function() {
    swf2js.load(element.src);
    let swfElement = document.querySelector('div[id*="swf2js_"]:last-child');
    swfElement.style.height = divElement.style.height;
    swfElement.style.width = divElement.style.width;
    divElement.parentNode.replaceChild(swfElement, divElement);
  });

  let orgElement = element.closest('object');
  insertAfter(orgElement, divElement);
  orgElement.remove();

}

// /questions/4793604/how-to-insert-an-element-after-another-element-in-javascript-without-using-a-lib
function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
