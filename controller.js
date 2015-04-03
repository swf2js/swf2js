/**
 * API
 *********************
 * ¡MovieClip
 *********************
 * žgetMovieClip
 * @param string path
 * @return MovieClip | null
 * var movieClip = _root.getMovieClip(path);
 *
 *********************
 * ¡Property
 *********************
 * žgetProperty
 * @param string _property
 * @return mixed | undefined
 * var movieClip = _root.getMovieClip(path);
 * var value = movieClip.getProperty(_property);
 *
 * žsetProperty
 * @param string _property
 * @param mixed value
 * var movieClip = _root.getMovieClip(path);
 * movieClip.setProperty(_property, value);
 *
 * ¥_property List
 * _x
 * _y
 * _xscale
 * _yscale
 * _currentframe
 * _totalframes
 * _alpha
 * _visible
 * _width
 * _height
 * _rotation
 *
 *********************
 * ¡Variable
 *********************
 * žgetVariable
 * @param mixed key
 * var movieClip = _root.getMovieClip(path);
 * var value = movieClip.getVariable(key);
 *
 * žsetVariable
 * @param mixed key
 * @param mixed value
 * var movieClip = _root.getMovieClip(path);
 * movieClip.setVariable(key, value);
 *
 *********************
 * ¡Action
 *********************
 * žplay
 * var movieClip = _root.getMovieClip(path);
 * movieClip.play();
 *
 * žstop
 * var movieClip = _root.getMovieClip(path);
 * movieClip.stop();
 *
 * žstopAllSounds
 * var movieClip = _root.getMovieClip(path);
 * movieClip.stopAllSounds();
 *
 * žgotoAndPlay
 * @param int | string(label) value
 * var movieClip = _root.getMovieClip(path);
 * movieClip.gotoAndPlay(value):
 *
 * žgotoAndStop
 * @param int | string(label) value
 * var movieClip = _root.getMovieClip(path);
 * movieClip.gotoAndStop(value):
 *
 * žnextFrame
 * var movieClip = _root.getMovieClip(path);
 * movieClip.nextFrame();
 *
 * žpreviousFrame
 * var movieClip = _root.getMovieClip(path);
 * movieClip.previousFrame();
 *
 *********************
 * ¡Event Dispatch
 *********************
 * žaddEvent
 * @param string event name
 * @param object this
 * var movieClip = _root.getMovieClip(path);
 * movieClip.addEvent(name, this);
 *
 * ždelEvent
 * @param string event name
 * @param object this
 * var movieClip = _root.getMovieClip(path);
 * movieClip.delEvent(name, this);
 *
 * @param MovieClip _root
 * @constructor
 */
swf2js$controller = function(_root)
{
    // sample code
//    var mc = _root.getMovieClip('/');
//    if (mc) {
//        if (mc.getProperty('_currentframe') > 3) {
//            mc.gotoAndStop('end');
//        } else {
//            mc.gotoAndPlay(1);
//        }
//    }

//    mc.addEvent('onEnterFrame', this);
//    this.onEnterFrame = function()
//    {
//        mc.delEvent('onEnterFrame', this);
//        mc.gotoAndPlay(3);
//    }

//    var mc = _root.getMovieClip('/c0');
//    mc.addEvent('originFunction', this);
//    this.originFunction = function()
//    {
//        mc.delEvent('originFunction', this);
//        mc.gotoAndStop(3);
//    }

}