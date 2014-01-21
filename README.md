swf2js
======
swfをJavaScriptに変換。  
※swf(flash lite1.1)をJavaScriptでバイナリ分解してcanvasで出力。  
output in the canvas with swf(flash lite1.1) binary decomposition in JavaScript.  

html
------
    <!DOCTYPE html>  
    <html lang="ja">  
    <head>  
    <meta charset="UTF-8"/>  
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0" />  
    <title>swf2js</title>  
    <script type="text/javascript" src="swf2js.js"></script>  
    </head>  
    <body>  
    <div id="swf2js"></div>  
    <script type="text/javascript">  
        swf2js.load('SET SWF PATH');  
        swf2js.play();  
    </script>  
    </body>  
    </html>  

TODO
-------
cache  

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


Release Notes  
-------
--[ swf2js 0.0.2 ] Release Date: 21 Jan 2014  
* [BUGFIX] ActionScript 'CloneSprite', 'RemoveSprite'  
* [BUGFIX] parseDefineBitsLossLess  
* [BUGFIX] setBackgroundColor [RBG => RGB]  
* [BUGFIX] Property '_xscale', '_yscale', '_width', '_height', '_rotation'  
* [NEW] parse & render speed up  


--[ swf2js 0.0.1 ] Release Date: 01 Jan 2014  
Planned Release.
