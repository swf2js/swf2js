FlashをiPhoneで再生可能にする「swf2js」
======

swfをJavaScriptでバイナリ分解してcanvasで出力してiPhoneでswfを再生  
対応バージョン：Flash Lite 1.1(swf4)以下  
  
output in the canvas with swf binary decomposition in JavaScript.  
play the swf on the iPhone.  
※Supports Flash Lite 1.1(swf4) or lower.  


Demonstration Site
------
http://ienaga.github.io/swf2js/  


Game using swf2js
------
[覇者もん for GREE]  
http://jp.apps.gree.net/ja/60428  

[覇者もん for Mobage]  
http://www.mbga.jp/_game_intro?game_id=12017896  


html
------
    <script type="text/javascript" src="swf2js.js"></script>  
    <div id="swf2js"></div>  
    <script type="text/javascript">  
        swf2js.load('SET SWF PATH', 'width(null = 100%)', 'height(null = 100%)');  
    </script>  


MEMO
-------
動作しないswfのファイルを送って頂ければバグ改修にもなるので助かります。  
Please send the file of swf which does not operate. A bug is fixed.  


TODO
-------
▼ActionScript  
SWF 5  
SWF 6  
SWF 7  
SWF 8  
SWF 9  
SWF 10  


▼TAG  
FreeCharacter  
DefineFontInfo  
DefineSound  
StartSound  
StopSound  
DefineButtonSound  
SoundStreamHead  
SoundStreamBlock  
DefineButtonCxform  
PathsArePostScript  
SyncFrame  
FreeAll  
DefineVideo  
ProductInfo  
DefineTextFormat  
DefineBehavior  
SoundStreamHead2  
FrameTag  
GenCommand  
DefineCommandObj  
CharacterSet  
FontRef  
DefineFunction  
PlaceFunction  
GenTagObject  
ImportAssets  
EnableDebugger  
DoInitAction  
DefineVideoStream  
VideoFrame  
DefineFontInfo2  
DebugID  
ScriptLimits  
SetTabIndex  
DefineShape4_hmm  
FileAttributes  
PlaceObject3  
ImportAssets2  
DoABC  
DefineFontAlignZones  
CSMTextSettings  
DefineFont3  
SymbolClass  
MetaData  
DefineScalingGrid  
DoABC2  
DefineShape4  
DefineSceneAndFrameLabelData  
DefineBinaryData  
StartSound2  
DefineFont4  
EnableTelemetry  


▼UN ZIP TYPE  
ZLIB  
LZMA  


Release Notes  
-------
--[ swf2js 0.1.2 ] Release Date: 28 Aug 2014  
* [BUGFIX] Tag 'DefineSprite'  
* [BUGFIX] Tag 'DefineShape'  
* [BUGFIX] Tag 'DefineBitsLossLess'  
* [BUGFIX] Tag 'DefineBits'  
* [BUGFIX] render 'colorTransform'  


--[ swf2js 0.1.1 ] Release Date: 25 Aug 2014  
* [BUGFIX] Tag 'PlaceObject'  
* [BUGFIX] Tag 'DefineSprite'  


--[ swf2js 0.1.0 ] Release Date: 28 Jul 2014  
* [NEWS] Game using swf2js [覇者もん for Mobage] http://www.mbga.jp/_game_intro?game_id=12017896  


--[ swf2js 0.1.0 ] Release Date: 12 Jun 2014  
* [NEWS] Game using swf2js [覇者もん for GREE] http://jp.apps.gree.net/ja/60428  
* [BUGFIX] Tag 'DefineEditText'  
* [NEW] parse & render speed up  


--[ swf2js 0.0.12 ] Release Date: 21 Apr 2014  
* [BUGFIX] function 'play'  
* [BUGFIX] ActionScript 'stop'  
* [BUGFIX] Tag 'PlaceObject'  
* [BUGFIX] Tag 'DefineBitsLossless'  


--[ swf2js 0.0.11 ] Release Date: 18 Apr 2014  
* [BUGFIX] DefineBits  
* [BUGFIX] ActionScript 'CloneSprite'  
* [BUGFIX] Tag 'DefineEditText'  
* [UPDATE] Demonstration Site [SAMPLE SWF UPDATE] -> model.swf by http://msto.jp/


--[ swf2js 0.0.10 ] Release Date: 21 Mar 2014  
* [BUGFIX] ActionScript 'change the order of something'  


--[ swf2js 0.0.9 ] Release Date: 05 Mar 2014  
* [BUGFIX] parse - StateNewStyles  
* [BUGFIX] render - mask  


--[ swf2js 0.0.8 ] Release Date: 17 Feb 2014  
* [BUGFIX] DefineBits ColorTransform  
* [BUGFIX] DefineBits render  


--[ swf2js 0.0.7 ] Release Date: 12 Feb 2014  
* [BUGFIX] Button render  


--[ swf2js 0.0.6 ] Release Date: 10 Feb 2014  
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
