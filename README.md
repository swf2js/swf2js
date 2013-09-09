swf2js
======

swf(flash lite1.1)をJavaScriptでばバイナリ分解後canvasにして出力。

# path
http://URL/?swfのURL

# html
<canvas id="swf2canvas" width="240" height="240"></canvas>
<script type="text/javascript">
    var canvas_id = "swf2canvas";
    var url = location.search.substr(1).split("&")[0];
    var swfpl = new SwfPlayer(canvas_id);
    swfpl.load(url);
    swfpl.play();
</script>

