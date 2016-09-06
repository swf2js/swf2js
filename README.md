JavaScript製FlashPlayer「swf2js」Flash(swf)をHTML5に変換してiPhone、Androidで再生可能に!
======

[![Join the chat at https://gitter.im/ienaga/swf2js](https://badges.gitter.im/ienaga/swf2js.svg)](https://gitter.im/ienaga/swf2js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

swfをJavaScriptで直接バイナリ分解してcanvasに出力  
分解と変換をリアルタイムで行っているので動的なswfも再生可能。  
対応バージョン: 
* FlashLite 1.x, 2.x
* ActionScript 1.0, 2.0
* ActionScript 3.0 (prototype)


output in the canvas with swf binary decomposition in JavaScript.  
play the swf on the iPhone.  
An open source Flash™ runtime written in pure JavaScript.

Supports: 
* FlashLite 1.x, 2.x
* ActionScript 1.0, 2.0
* ActionScript 3.0 (prototype)


## Latest Version *0.7.4*  

-- Release Date: 06 Sep 2016  

* [ReleaseNotes](https://github.com/ienaga/swf2js/wiki/Release-Notes)    


## HTML - SAMPLE CODE

```JavaScript
<script type="text/javascript" src="swf2js.js"></script>
<script type="text/javascript">
    swf2js.load('SET SWF PATH');
</script>  
```


## Demonstration Site  

https://swf2js.wordpress.com/  


## API  

https://swf2js.wordpress.com/api/   


## Game Using  

[覇者もん for GREE and Mobage]  
http://gamebiz.jp/?p=131364  


## SNS  

Facebook: https://www.facebook.com/swf2js  
Twitter: https://twitter.com/swf2js  


## License  

MIT License.


## State


### ActionScript

* ActionScript 1.x - ◯
* ActionScript 2.x - ◯
* ActionScript 3.x - built-in function


### Compression

* ZLIB : ◯
* LZMA : × (0.7.x TBR)


### WebGL

* WebGL : × (0.8 TBR)



### Filter

* DropShadow : ◯
* Blur : ◯
* Glow : ◯
* Bevel : ◯
* GradientGlow : × (0.8.x TBR)
* Convolution : × (0.8.x TBR)
* ColorMatrix : × (0.8.x TBR)
* GradientBevel : × (0.8.x TBR)


### Blend Mode

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
* WAV(ADPCM) : × (0.9.x TBR)


### Video

* Flv : × (0.9.x TBR)
* H.264 : × (0.9.x TBR)



### Browser

* Chrome : ◯
* FireFox : ◯
* Safari : ◯
* Edge : ◯
* Android : ◯
* iPhone : ◯

