JavaScript製FlashPlayer「swf2js」Flash(swf)をHTML5に変換してiPhone、Androidで再生可能に!
======

[![Join the chat at https://gitter.im/ienaga/swf2js](https://badges.gitter.im/ienaga/swf2js.svg)](https://gitter.im/ienaga/swf2js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

swfをJavaScriptで直接バイナリ分解してcanvasに出力  
分解と変換をリアルタイムで行っているので動的なswfも再生可能。  
対応バージョン: 
* FlashLite 1.x, 2.x, 3.x, 4,x
* ActionScript 1.0, 2.0
* ActionScript 3.0 (prototype)


Swf2Js is an open source Flash™ runtime written in pure JavaScript.
It reads binary code from an SWF file, and outputs the result in a web canvas.

Swf2Js allows flash apps to run on the iphone !

It supports: 
* FlashLite 1.x, 2.x, 3.x, 4,x
* ActionScript 1.0, 2.0
* ActionScript 3.0 (prototype)


## Latest Version *0.7.7*  

-- Release Date: 23 Sep 2016  

* [Release Notes](https://github.com/ienaga/swf2js/wiki/Release-Notes)    


## HTML - SAMPLE CODE

```JavaScript
<script type="text/javascript" src="swf2js.js"></script>
<script type="text/javascript">
    swf2js.load('SET SWF PATH');
</script>  
```


## Examples
Action Script 3
* [AS3 Tiger](http://ienaga.github.io/swf2js/sample.html?sample/tiger.swf)

Action Script 2
* [Kanji test (typing game)](http://ienaga.github.io/swf2js/sample.html?sample/yomi.swf)
* [3Lines game](http://ienaga.github.io/swf2js/sample.html?sample/lines.swf)

Flash Lite2.x
* [A Clock](http://ienaga.github.io/swf2js/sample.html?sample/analog20.swf)

Flash Lite1.x
* [Girl Model](http://ienaga.github.io/swf2js/sample.html?sample/model.swf)
* [Whack-A-Mole game](http://ienaga.github.io/swf2js/sample.html?sample/mogura.swf)


## API  

https://swf2js.wordpress.com/api/   


## Games using it  

[覇者もん for GREE and Mobage]  
http://gamebiz.jp/?p=131364  


## SNS  

Facebook: https://www.facebook.com/swf2js  
Twitter: https://twitter.com/swf2js  



## Project status


### ActionScript

* ActionScript 1.x - ◯
* ActionScript 2.x - ◯
* ActionScript 3.x - built-in function


### Compression

* ZLIB : ◯
* LZMA : × (0.7.x TBR)


### WebGL

* WebGL : × (0.8 TBR)



### Filters

* DropShadow : ◯
* Blur : ◯
* Glow : ◯
* Bevel : ◯
* GradientGlow : × (0.8.x TBR)
* Convolution : × (0.8.x TBR)
* ColorMatrix : × (0.8.x TBR)
* GradientBevel : × (0.8.x TBR)


### Blend Modes

* Layer : × (0.8.x TBR)
* Multiply : ◯
* Screen : ◯
* Lighten : ◯
* Darken : ◯
* Difference : ◯
* Add : ◯
* Subtract : ◯
* Invert : ◯
* Alpha : ◯
* Erase : ◯
* Overlay : ◯
* Hardlight : ◯


### Audio

* MP3 : ◯
* WAV : ◯
* WAV(ADPCM) : × (0.9 TBR)


### Video

* Flv : × (0.9 TBR)
* H.264 : × (0.9 TBR)



### Browser support

* Chrome : ◯
* FireFox : ◯
* Safari : ◯
* Edge : ◯
* Android : ◯
* iPhone : ◯
* Internet Explorer 10,11 : ◯

