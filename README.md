swf2js
======
swfをjsに変換。  
※swf(flash lite1.1)をJavaScriptでバイナリ分解してcanvasで出力。   
output in the canvas with swf(flash lite1.1) binary decomposition in JavaScript.


path
------
http://your_domain/?swf_path

html
------
`<!DOCTYPE html>`  
`<html lang="ja">`  
`<head>`  
`<meta charset="UTF-8"/>`  
`<title>swf2js</title>`  
`<script type="text/javascript" src="swf2js.js"></script>`  
`</head>`  
`<body style="background-color: #000000; padding: 0; margin: 0; text-align: center; width: 100%; height: 100%;">`  
`<canvas id="swf2js" width="240" height="240"></canvas>`  
`<script type="text/javascript">`  
`    var swf2js = new Swf2Js();`  
`    /**`  
`     * load`  
`     *`  
`     * @param string type ["url" or "binary"]`  
`     * @param mixed  option [path or binary data]`  
`     */`  
`    swf2js.load('url');`  
`    swf2js.play();`  
`</script>`  
`</body>`  
`</html>`

TODO
-------
mask  
ActionScript
