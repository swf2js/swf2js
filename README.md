swf2js
======
swfをjsに変換。  
※swf(flash lite1.1)をJavaScriptでバイナリ分解してcanvasで出力。   
output in the canvas with swf(flash lite1.1) binary decomposition in JavaScript.
html
------
    <!DOCTYPE html>  
    <html lang="ja">  
    <head>  
    <meta charset="UTF-8"/>  
    <title>swf2js</title>  
    <script type="text/javascript" src="swf2js.js"></script>  
    </head>  
    <body>  
    <script type="text/javascript">  
        var swf2js = new Swf2Js();  
        swf2js.load('swf_path');  
        swf2js.play();  
    </script>  
    <div id="swf2js"></div>  
    </body>  
    </html>  

TODO
-------
DefineEditText  
DefineBits  

ActionScript  
⇒EndDrag  
⇒WaitForFrame2  
⇒StartDrag  
⇒CharToAscii  
⇒MBAsciiToChar  
⇒MBCharToAscii  
⇒AsciiToChar  
⇒WaitForFrame  
⇒StopSounds  
⇒ToggleQuality  

cache  
