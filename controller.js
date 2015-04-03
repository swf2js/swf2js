/**
 * API
 *********************
 * ¡MovieClip
 *********************
 * žgetMovieClip
 * @param string path
 * @return MovieClip | null
 * var mc = _root.getMovieClip(path);
 *
 *********************
 * ¡Property
 *********************
 * žgetProperty
 * @param string _property
 * @return mixed | undefined
 * mc.getProperty(_property);
 *
 * žsetProperty
 * @param string _property
 * @param mixed value
 * mc.setProperty(_property, value);
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
 * mc.getVariable(key);
 *
 * žsetVariable
 * @param mixed key
 * @param mixed value
 * mc.setVariable(key, value);
 *
 *********************
 * ¡Action
 *********************
 * žplay
 * mc.play();
 *
 * žstop
 * mc.stop();
 *
 * žstopAllSounds
 * mc.stopAllSounds();
 *
 * žgotoAndPlay
 * @param int | string(label) value
 * mc.gotoAndPlay(value):
 *
 * žgotoAndStop
 * @param int | string(label) value
 * mc.gotoAndStop(value):
 *
 * žnextFrame
 * mc.nextFrame();
 *
 * žpreviousFrame
 * mc.previousFrame();
 *
 * @param MovieClip _root
 * @constructor
 */
swf2js$Controller = function(_root)
{
//    // sample code
//    var mc = _root.getMovieClip('/');
//    if (mc) {
//        if (mc.getProperty('_currentframe') > 3) {
//            mc.gotoAndStop('end');
//        } else {
//            mc.gotoAndPlay(1);
//        }
//    }
}