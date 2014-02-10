swf2js
======
swfをJavaScriptでcanvasに出力。  
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
        swf2js.load('SET SWF PATH', 'width(null = 100%)', 'height(null = 100%)');  
        swf2js.play();  
    </script>  
    </body>  
    </html>  


TODO
-------
cache  

ActionScript  
⇒StopSounds  
⇒StartDrag  
⇒EndDrag  
⇒WaitForFrame  
⇒WaitForFrame2  


MEMO
-------
動作しないswfのファイルを送って頂ければバグ改修にもなるので助かります。  
Please send the file of swf which does not operate. A bug is fixed.  


Release Notes  
-------
--[ swf2js 0.0.6 ] Release Date: 09 Feb 2014  
* [BUGFIX] ActionScript 'change the order of something'  
* [BUGFIX] '_currentframe'  
* [NEW] DefineBits  
* [NEW] AsciiToChar  
* [NEW] CharToAscii  
* [NEW] MBAsciiToChar  
* [NEW] MBCharToAscii  


--[ swf2js 0.0.5 ] Release Date: 07 Feb 2014  
* [BUGFIX] render '_alpha'  
* [NEW] loading css  

--[ swf2js 0.0.4 ] Release Date: 06 Feb 2014  
* [BUGFIX] ActionScript 'change the order of something'  
* [BUGFIX] DefineEditText '_x', '_y'  
* [BUGFIX] Button render  
* [NEWS] published(02/05) - http://www.moongift.jp/2014/02/swf2js-swf%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E3%82%92javascript%E3%81%A7%E8%A7%A3%E6%9E%90%E5%A4%89%E6%8F%9B/  


--[ swf2js 0.0.3 ] Release Date: 03 Feb 2014  
* [BUGFIX] ColorTransform  
* [BUGFIX] touchEvent  
* [BUGFIX] Property '_width', '_height'  
* [NEW] load option 'width' and 'height'  


--[ swf2js 0.0.2 ] Release Date: 21 Jan 2014  
* [BUGFIX] ActionScript 'CloneSprite', 'RemoveSprite'  
* [BUGFIX] parseDefineBitsLossLess  
* [BUGFIX] setBackgroundColor [RBG => RGB]  
* [BUGFIX] Property '_xscale', '_yscale', '_width', '_height', '_rotation'  
* [NEW] parse & render speed up  


--[ swf2js 0.0.1 ] Release Date: 01 Jan 2014  
Planned Release.
