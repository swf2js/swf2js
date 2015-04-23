/**
 * swf2js (version 0.2.26)
 * Develop: https://github.com/ienaga/swf2js
 * ReadMe: https://github.com/ienaga/swf2js/blob/master/README.md
 *
 * Facebook: https://www.facebook.com/swf2js
 * Twitter: @swf2js
 * Contact: ienagatoshiyuki@facebook.com
 *
 * Copyright (c) 2013 Toshiyuki Ienaga. Licensed under the MIT License.
 * コピーも改変もご自由にどうぞ。
 */
(function(window) {
    'use strict';
    var _document = window.document;
    var _min = Math.min;
    var _max = Math.max;
    var _floor = Math.floor;
    var _ceil = Math.ceil;
    var _pow = Math.pow;
    var _random = Math.random;
    var _atan2 = Math.atan2;
    var _sqrt = Math.sqrt;
    var _cos = Math.cos;
    var _sin = Math.sin;
    var _PI = Math.PI;
    var _Number = Number;
    var _fromCharCode = String.fromCharCode;
    var _parseInt = parseInt;
    var _parseFloat = parseFloat;
    var _isNaN = isNaN;
    var _Audio = Audio;
    var _setInterval = setInterval;
    var _clearInterval = clearInterval;
    var _setTimeout = setTimeout;
    var _clearTimeout = clearTimeout;
    var _Date = Date;
    var _escape = escape;
    var _unescape = unescape;
    var _decodeURIComponent = decodeURIComponent;

    // options
    var optionWidth = 0;
    var optionHeight = 0;
    var isSpriteSheet = false;
    var cacheSize = 73400320; // 70M
    var controllerMode = false;
    var renderMode = window.WebGLRenderingContext && _document.createElement('canvas').getContext('webgl') ? 'webgl' : '2d';
    var tagId = null;

    /**
     * CacheStore
     * @constructor
     */
    var CacheStore = function ()
    {
        this.store = {};
        this.pool = [];
        this.size = cacheSize;
    };

    /**
     * reset
     */
    CacheStore.prototype.reset = function()
    {
        var _this = this;
        var _destroy = _this.destroy;
        for (var cacheKey in _this.store) {
            var index = cacheKey.indexOf('Bitmap');
            if (index != -1) {
                continue;
            }

            var deleteCtx = _this.store[cacheKey];
            if (!(deleteCtx instanceof CanvasRenderingContext2D)) {
                continue;
            }
            var deleteCanvas = deleteCtx.canvas;
            _destroy.call(_this, deleteCanvas);
        }
        this.store = {};
        this.size = cacheSize;
    };

    /**
     * destroy
     * @param canvas
     */
    CacheStore.prototype.destroy = function(canvas)
    {
        var pool = this.pool;
        canvas.width = canvas.width; // clear
        canvas.width = 0;
        canvas.height = 0;
        pool[pool.length] = canvas;
    };

    /**
     * getCanvas
     * @returns {*}
     */
    CacheStore.prototype.getCanvas = function()
    {
        return this.pool.pop() || _document.createElement('canvas');
    };

    /**
     * get
     * @param key
     * @returns {*}
     */
    CacheStore.prototype.get = function(key)
    {
        return this.store[key];
    };

    /**
     * set
     * @param key
     * @param value
     */
    CacheStore.prototype.set = function(key, value)
    {
        var _this = this;
        var canvas = value.canvas;
        _this.size -= (canvas.width * canvas.height);

        // reset
        if (_this.size < 0) {
            var _destroy = _this.destroy;
            for (var cacheKey in _this.store) {
                var index = cacheKey.indexOf('Bitmap');
                if (index != -1) {
                    continue;
                }

                var deleteCtx = _this.store[cacheKey];
                if (!(deleteCtx instanceof CanvasRenderingContext2D)) {
                    continue;
                }

                var deleteCanvas = deleteCtx.canvas;
                _this.size += (deleteCanvas.width * deleteCanvas.height);
                _destroy.call(_this, deleteCanvas);

                delete _this.store[cacheKey];
                if (_this.size > 0) {
                    break;
                }
            }
        }

        this.store[key] = value;
    };

    /**
     * generateKey
     * @param name
     * @param id
     * @param matrix
     * @param colorTransform
     * @returns {string}
     */
    CacheStore.prototype.generateKey = function(name, id, matrix, cxForm)
    {
        var key = name +"_"+ id;
        if (matrix != undefined) {
            key += "_"+ matrix[0] +"_"+ matrix[1] +"_"+ matrix[2] +"_"+ matrix[3];
        }

        if (cxForm != undefined) {
            key += "_"+ cxForm[0] +"_"+ cxForm[1] +"_"+ cxForm[2] +"_"+ cxForm[3]
                +"_"+ cxForm[4] +"_"+ cxForm[5] +"_"+ cxForm[6] +"_"+ cxForm[7];
        }
        return key;
    };
    var cacheStore = new CacheStore();

    // params
    var context, preContext, tmpContext;
    var swftag, bitio;
    var intervalId = 0;
    var timeoutId = 0;
    var character = [];
    var buttonHits = [];
    var sounds = [];
    var loadSounds = [];
    var actions = [];
    var touchActions = [];
    var initActions = [];
    var touchObj = null;
    var touchEndAction = null;
    var imgUnLoadCount = 0;
    var devicePixelRatio = window.devicePixelRatio || 1;
    var scale = 1;
    var width = 0;
    var height = 0;
    var startDate = new _Date();
    var _navigator = window.navigator;
    var ua = _navigator.userAgent;
    var isAndroid = (ua.indexOf('Android') > 0);
    var isiOS = (ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0);
    var isChrome = (ua.indexOf('Chrome') > 0);
    var isTouch = (isAndroid || isiOS);
    var isTouchEvent = false;
    var isLoad = false;
    var jpegTables = null;
    var signature = '';
    var backgroundColor = null;
    var version = 0;
    var totalFrame = 0;
    var instanceId = 0;
    var cacheMode = false;
    var shapeCount = 0;

    // Alpha Bug
    var isAlphaBug = isAndroid;
    if (isAndroid) {
        var chkCanvas = cacheStore.getCanvas();
        chkCanvas.width = 1;
        chkCanvas.height = 1;
        var chkCtx = chkCanvas.getContext('2d');
        var imageData = chkCtx.createImageData(1, 1);
        var pixelArray = imageData.data;
        pixelArray[0] = 128;
        pixelArray[3] = 128;

        chkCtx.putImageData(imageData, 0, 0);
        imageData = chkCtx.getImageData(0, 0, 1, 1);
        pixelArray = imageData.data;
        isAlphaBug = (pixelArray[0] == 255);
        chkCtx = null;
        imageData = null;
        pixelArray = null;
        cacheStore.destroy(chkCanvas);
    }

    // shift-jis
    var JCT11280 = new Function('var a="zKV33~jZ4zN=~ji36XazM93y!{~k2y!o~k0ZlW6zN?3Wz3W?{EKzK[33[`y|;-~j^YOTz$!~kNy|L1$353~jV3zKk3~k-4P4zK_2+~jY4y!xYHR~jlz$_~jk4z$e3X5He<0y!wy|X3[:~l|VU[F3VZ056Hy!nz/m1XD61+1XY1E1=1y|bzKiz!H034zKj~mEz#c5ZA3-3X$1~mBz$$3~lyz#,4YN5~mEz#{ZKZ3V%7Y}!J3X-YEX_J(3~mAz =V;kE0/y|F3y!}~m>z/U~mI~j_2+~mA~jp2;~m@~k32;~m>V}2u~mEX#2x~mBy+x2242(~mBy,;2242(~may->2&XkG2;~mIy-_2&NXd2;~mGz,{4<6:.:B*B:XC4>6:.>B*BBXSA+A:X]E&E<~r#z+625z s2+zN=`HXI@YMXIAXZYUM8X4K/:Q!Z&33 3YWX[~mB`{zKt4z (zV/z 3zRw2%Wd39]S11z$PAXH5Xb;ZQWU1ZgWP%3~o@{Dgl#gd}T){Uo{y5_d{e@}C(} WU9|cB{w}bzvV|)[} H|zT}d||0~{]Q|(l{|x{iv{dw}(5}[Z|kuZ }cq{{y|ij}.I{idbof%cu^d}Rj^y|-M{ESYGYfYsZslS`?ZdYO__gLYRZ&fvb4oKfhSf^d<Yeasc1f&a=hnYG{QY{D`Bsa|u,}Dl|_Q{C%xK|Aq}C>|c#ryW=}eY{L+`)][YF_Ub^h4}[X|?r|u_ex}TL@YR]j{SrXgo*|Gv|rK}B#mu{R1}hs|dP{C7|^Qt3|@P{YVV |8&}#D}ef{e/{Rl|>Hni}R1{Z#{D[}CQlQ||E}[s{SG_+i8eplY[=[|ec[$YXn#`hcm}YR|{Ci(_[ql|?8p3]-}^t{wy}4la&pc|3e{Rp{LqiJ],] `kc(]@chYnrM`O^,ZLYhZB]ywyfGY~aex!_Qww{a!|)*lHrM{N+n&YYj~Z b c#e_[hZSon|rOt`}hBXa^i{lh|<0||r{KJ{kni)|x,|0auY{D!^Sce{w;|@S|cA}Xn{C1h${E]Z-XgZ*XPbp]^_qbH^e[`YM|a||+=]!Lc}]vdBc=j-YSZD]YmyYLYKZ9Z>Xcczc2{Yh}9Fc#Z.l{}(D{G{{mRhC|L3b#|xK[Bepj#ut`H[,{E9Yr}1b{[e]{ZFk7[ZYbZ0XL]}Ye[(`d}c!|*y`Dg=b;gR]Hm=hJho}R-[n}9;{N![7k_{UbmN]rf#pTe[x8}!Qcs_rs[m`|>N}^V})7{^r|/E}),}HH{OYe2{Skx)e<_.cj.cjoMhc^d}0uYZd!^J_@g,[[[?{i@][|3S}Yl3|!1|eZ|5IYw|1D}e7|Cv{OHbnx-`wvb[6[4} =g+k:{C:}ed{S]|2M]-}WZ|/q{LF|dYu^}Gs^c{Z=}h>|/i|{W]:|ip{N:|zt|S<{DH[p_tvD{N<[8Axo{X4a.^o^X>Yfa59`#ZBYgY~_t^9`jZHZn`>G[oajZ;X,i)Z.^~YJe ZiZF^{][[#Zt^|]Fjx]&_5dddW]P0C[-]}]d|y {C_jUql] |OpaA[Z{lp|rz}:Mu#]_Yf6{Ep?f5`$[6^D][^u[$[6^.Z8]]ePc2U/=]K^_+^M{q*|9tYuZ,s(dS{i=|bNbB{uG}0jZOa:[-]dYtu3]:]<{DJ_SZIqr_`l=Yt`gkTnXb3d@kiq0a`Z{|!B|}e}Ww{Sp,^Z|0>_Z}36|]A|-t}lt{R6pi|v8hPu#{C>YOZHYmg/Z4nicK[}hF_Bg|YRZ7c|crkzYZY}_iXcZ.|)U|L5{R~qi^Uga@Y[xb}&qdbd6h5|Btw[}c<{Ds53[Y7]?Z<|e0{L[ZK]mXKZ#Z2^tavf0`PE[OSOaP`4gi`qjdYMgys/?[nc,}EEb,eL]g[n{E_b/vcvgb.{kcwi`~v%|0:|iK{Jh_vf5lb}KL|(oi=LrzhhY_^@`zgf[~g)[J_0fk_V{T)}I_{D&_/d9W/|MU[)f$xW}?$xr4<{Lb{y4}&u{XJ|cm{Iu{jQ}CMkD{CX|7A}G~{kt)nB|d5|<-}WJ}@||d@|Iy}Ts|iL|/^|no|0;}L6{Pm]7}$zf:|r2}?C_k{R(}-w|`G{Gy[g]bVje=_0|PT{^Y^yjtT[[[l!Ye_`ZN]@[n_)j3nEgMa]YtYpZy].d-Y_cjb~Y~[nc~sCi3|zg}B0}do{O^{|$`_|D{}U&|0+{J3|8*]iayx{a{xJ_9|,c{Ee]QXlYb]$[%YMc*]w[aafe]aVYi[fZEii[xq2YQZHg]Y~h#|Y:thre^@^|_F^CbTbG_1^qf7{L-`VFx Zr|@EZ;gkZ@slgko`[e}T:{Cu^pddZ_`yav^Ea+[#ZBbSbO`elQfLui}.F|txYcbQ`XehcGe~fc^RlV{D_0ZAej[l&jShxG[ipB_=u:eU}3e8[=j|{D(}dO{Do[BYUZ0/]AYE]ALYhZcYlYP/^-^{Yt_1_-;YT`P4BZG=IOZ&]H[e]YYd[9^F[1YdZxZ?Z{Z<]Ba2[5Yb[0Z4l?]d_;_)a?YGEYiYv`_XmZs4ZjY^Zb]6gqGaX^9Y}dXZr[g|]Y}K aFZp^k^F]M`^{O1Ys]ZCgCv4|E>}8eb7}l`{L5[Z_faQ|c2}Fj}hw^#|Ng|B||w2|Sh{v+[G}aB|MY}A{|8o}X~{E8paZ:]i^Njq]new)`-Z>haounWhN}c#{DfZ|fK]KqGZ=:u|fqoqcv}2ssm}.r{]{nIfV{JW)[K|,Z{Uxc|]l_KdCb%]cfobya3`p}G^|LZiSC]U|(X|kBlVg[kNo({O:g:|-N|qT}9?{MBiL}Sq{`P|3a|u.{Uaq:{_o|^S}jX{Fob0`;|#y_@[V[K|cw[<_ }KU|0F}d3|et{Q7{LuZttsmf^kYZ`Af`}$x}U`|Ww}d]| >}K,r&|XI|*e{C/a-bmr1fId4[;b>tQ_:]hk{b-pMge]gfpo.|(w[jgV{EC1Z,YhaY^q,_G[c_g[J0YX]`[h^hYK^_Yib,` {i6vf@YM^hdOKZZn(jgZ>bzSDc^Z%[[o9[2=/YHZ(_/Gu_`*|8z{DUZxYt^vuvZjhi^lc&gUd4|<UiA`z]$b/Z?l}YI^jaHxe|;F}l${sQ}5g}hA|e4}?o{ih}Uz{C)jPe4]H^J[Eg[|AMZMlc}:,{iz}#*|gc{Iq|/:|zK{l&}#u|myd{{M&v~nV};L|(g|I]ogddb0xsd7^V})$uQ{HzazsgxtsO^l}F>ZB]r|{7{j@cU^{{CbiYoHlng]f+nQ[bkTn/}<-d9q {KXadZYo+n|l[|lc}V2{[a{S4Zam~Za^`{HH{xx_SvF|ak=c^[v^7_rYT`ld@]:_ub%[$[m](Shu}G2{E.ZU_L_R{tz`vj(f?^}hswz}GdZ}{S:h`aD|?W|`dgG|if{a8|J1{N,}-Ao3{H#{mfsP|[ bzn+}_Q{MT{u4kHcj_q`eZj[8o0jy{p7}C|[}l){MuYY{|Ff!Ykn3{rT|m,^R|,R}$~Ykgx{P!]>iXh6[l[/}Jgcg{JYZ.^qYfYIZl[gZ#Xj[Pc7YyZD^+Yt;4;`e8YyZVbQ7YzZxXja.7SYl[s]2^/Ha$[6ZGYrb%XiYdf2]H]kZkZ*ZQ[ZYS^HZXcCc%Z|[(bVZ]]:OJQ_DZCg<[,]%Zaa [g{C00HY[c%[ChyZ,Z_`PbXa+eh`^&jPi0a[ggvhlekL]w{Yp^v}[e{~;k%a&k^|nR_z_Qng}[E}*Wq:{k^{FJZpXRhmh3^p>de^=_7`|ZbaAZtdhZ?n4ZL]u`9ZNc3g%[6b=e.ZVfC[ZZ^^^hD{E(9c(kyZ=bb|Sq{k`|vmr>izlH[u|e`}49}Y%}FT{[z{Rk}Bz{TCc/lMiAqkf(m$hDc;qooi[}^o:c^|Qm}a_{mrZ(pA`,}<2sY| adf_%|}`}Y5U;}/4|D>|$X{jw{C<|F.hK|*A{MRZ8Zsm?imZm_?brYWZrYx`yVZc3a@f?aK^ojEd {bN}/3ZH]/$YZhm^&j 9|(S|b]mF}UI{q&aM]LcrZ5^.|[j`T_V_Gak}9J[ ZCZD|^h{N9{~&[6Zd{}B}2O|cv]K}3s}Uy|l,fihW{EG`j_QOp~Z$F^zexS`dcISfhZBXP|.vn|_HYQ|)9|cr]<`&Z6]m_(ZhPcSg>`Z]5`~1`0Xcb4k1{O!bz|CN_T{LR|a/gFcD|j<{Z._[f)mPc:1`WtIaT1cgYkZOaVZOYFrEe[}T$}Ch}mk{K-^@]fH{Hdi`c*Z&|Kt{if[C{Q;{xYB`dYIX:ZB[}]*[{{p9|4GYRh2ao{DS|V+[zd$`F[ZXKadb*A] Ys]Maif~a/Z2bmclb8{Jro_rz|x9cHojbZ{GzZx_)]:{wAayeDlx}<=`g{H1{l#}9i|)=|lP{Qq}.({La|!Y{i2EZfp=c*}Cc{EDvVB|;g}2t{W4av^Bn=]ri,|y?|3+}T*ckZ*{Ffr5e%|sB{lx^0]eZb]9[SgAjS_D|uHZx]dive[c.YPkcq/}db{EQh&hQ|eg}G!ljil|BO]X{Qr_GkGl~YiYWu=c3eb}29v3|D|}4i||.{Mv})V{SP1{FX}CZW6{cm|vO{pS|e#}A~|1i}81|Mw}es|5[}3w{C`h9aL]o{}p[G`>i%a1Z@`Ln2bD[$_h`}ZOjhdTrH{[j_:k~kv[Sdu]CtL}41{I |[[{]Zp$]XjxjHt_eThoa#h>sSt8|gK|TVi[Y{t=}Bs|b7Zpr%{gt|Yo{CS[/{iteva|cf^hgn}($_c^wmb^Wm+|55jrbF|{9^ q6{C&c+ZKdJkq_xOYqZYSYXYl`8]-cxZAq/b%b*_Vsa[/Ybjac/OaGZ4fza|a)gY{P?| I|Y |,pi1n7}9bm9ad|=d{aV|2@[(}B`d&|Uz}B}{`q|/H|!JkM{FU|CB|.{}Az}#P|lk}K{|2rk7{^8^?`/|k>|Ka{Sq}Gz}io{DxZh[yK_#}9<{TRdgc]`~Z>JYmYJ]|`!ZKZ]gUcx|^E[rZCd`f9oQ[NcD_$ZlZ;Zr}mX|=!|$6ZPZYtIo%fj}CpcN|B,{VDw~gb}@hZg`Q{LcmA[(bo`<|@$|o1|Ss}9Z_}tC|G`{F/|9nd}i=}V-{L8aaeST]daRbujh^xlpq8|}zs4bj[S`J|]?G{P#{rD{]I`OlH{Hm]VYuSYUbRc*6[j`8]pZ[bt_/^Jc*[<Z?YE|Xb|?_Z^Vcas]h{t9|Uwd)_(=0^6Zb{Nc} E[qZAeX[a]P^|_J>e8`W^j_Y}R{{Jp__]Ee#e:iWb9q_wKbujrbR}CY`,{mJ}gz{Q^{t~N|? gSga`V_||:#mi}3t|/I`X{N*|ct|2g{km}gi|{={jC}F;|E}{ZZjYf*frmu}8Tdroi{T[|+~}HG{cJ}DM{Lp{Ctd&}$hi3|FZ| m}Kr|38}^c|m_|Tr{Qv|36}?Up>|;S{DV{k_as}BK{P}}9p|t`jR{sAm4{D=b4pWa[}Xi{EjwEkI}3S|E?u=X0{jf} S|NM|JC{qo^3cm]-|JUx/{Cj{s>{Crt[UXuv|D~|j|d{YXZR}Aq}0r}(_{pJfi_z}0b|-vi)Z mFe,{f4|q`b{}^Z{HM{rbeHZ|^x_o|XM|L%|uFXm}@C_{{Hhp%a7|0p[Xp+^K}9U{bP}: tT}B|}+$|b2|[^|~h{FAby[`{}xgygrt~h1[li`c4vz|,7p~b(|mviN}^pg[{N/|g3|^0c,gE|f%|7N{q[|tc|TKA{LU}I@|AZp(}G-sz{F |qZ{}F|f-}RGn6{Z]_5})B}UJ{FFb2]4ZI@v=k,]t_Dg5Bj]Z-]L]vrpdvdGlk|gF}G]|IW}Y0[G| /bo|Te^,_B}#n^^{QHYI[?hxg{[`]D^IYRYTb&kJ[cri[g_9]Ud~^_]<p@_e_XdNm-^/|5)|h_{J;{kacVopf!q;asqd}n)|.m|bf{QW|U)}b+{tL|w``N|to{t ZO|T]jF}CB|0Q{e5Zw|k |We}5:{HO{tPwf_uajjBfX}-V_C_{{r~gg|Ude;s+}KNXH}! `K}eW{Upwbk%ogaW}9EYN}YY|&v|SL{C3[5s.]Y]I]u{M6{pYZ`^,`ZbCYR[1mNg>rsk0Ym[jrE]RYiZTr*YJ{Ge|%-lf|y(`=[t}E6{k!|3)}Zk} ][G{E~cF{u3U.rJ|a9p#o#ZE|?|{sYc#vv{E=|LC}cu{N8`/`3`9rt[4|He{cq|iSYxY`}V |(Q|t4{C?]k_Vlvk)BZ^r<{CL}#h}R+[<|i=}X|{KAo]|W<`K{NW|Zx}#;|fe{IMr<|K~tJ_x}AyLZ?{GvbLnRgN}X&{H7|x~}Jm{]-| GpNu0}.ok>|c4{PYisrDZ|fwh9|hfo@{H~XSbO]Odv]%`N]b1Y]]|eIZ}_-ZA]aj,>eFn+j[aQ_+]h[J_m_g]%_wf.`%k1e#Z?{CvYu_B^|gk`Xfh^M3`afGZ-Z|[m{L}|k3cp[it ^>YUi~d>{T*}YJ{Q5{Jxa$hg|%4`}|LAgvb }G}{P=|<;Ux{_skR{cV|-*|s-{Mp|XP|$G|_J}c6cM{_=_D|*9^$ec{V;|4S{qO|w_|.7}d0|/D}e}|0G{Dq]Kdp{}dfDi>}B%{Gd|nl}lf{C-{y}|ANZr}#={T~|-(}c&{pI|ft{lsVP}){|@u}!W|bcmB{d?|iW|:dxj{PSkO|Hl]Li:}VYk@|2={fnWt{M3`cZ6|)}|Xj}BYa?vo{e4|L7|B7{L7|1W|lvYO}W8nJ|$Vih|{T{d*_1|:-n2dblk``fT{Ky|-%}m!|Xy|-a{Pz}[l{kFjz|iH}9N{WE{x,|jz}R {P|{D)c=nX|Kq|si}Ge{sh|[X{RF{t`|jsr*fYf,rK|/9}$}}Nf{y!1|<Std}4Wez{W${Fd_/^O[ooqaw_z[L`Nbv[;l7V[ii3_PeM}.h^viqYjZ*j1}+3{bt{DR[;UG}3Og,rS{JO{qw{d<_zbAh<R[1_r`iZTbv^^a}c{iEgQZ<exZFg.^Rb+`Uj{a+{z<[~r!]`[[|rZYR|?F|qppp]L|-d|}K}YZUM|=Y|ktm*}F]{D;g{uI|7kg^}%?Z%ca{N[_<q4xC]i|PqZC]n}.bDrnh0Wq{tr|OMn6tM|!6|T`{O`|>!]ji+]_bTeU}Tq|ds}n|{Gm{z,f)}&s{DPYJ`%{CGd5v4tvb*hUh~bf]z`jajiFqAii]bfy^U{Or|m+{I)cS|.9k:e3`^|xN}@Dnlis`B|Qo{`W|>||kA}Y}{ERYuYx`%[exd`]|OyiHtb}HofUYbFo![5|+]gD{NIZR|Go}.T{rh^4]S|C9_}xO^i`vfQ}C)bK{TL}cQ|79iu}9a];sj{P.o!f[Y]pM``Jda^Wc9ZarteBZClxtM{LW}l9|a.mU}KX}4@{I+f1}37|8u}9c|v${xGlz}jP{Dd1}e:}31}%3X$|22i<v+r@~mf{sN{C67G97855F4YL5}8f{DT|xy{sO{DXB334@55J1)4.G9A#JDYtXTYM4, YQD9;XbXm9SX]IB^4UN=Xn<5(;(F3YW@XkH-X_VM[DYM:5XP!T&Y`6|,^{IS-*D.H>:LXjYQ0I3XhAF:9:(==.F*3F1189K/7163D,:@|e2{LS36D4hq{Lw/84443@4.933:0307::6D7}&l{Mx657;89;,K5678H&93D(H<&<>0B90X^I;}Ag1{P%3A+>><975}[S{PZE453?4|T2{Q+5187;>447:81{C=hL6{Me^:=7ii{R=.=F<81;48?|h8}Uh{SE|,VxL{ST,7?9Y_5Xk3A#:$%YSYdXeKXOD8+TXh7(@>(YdXYHXl9J6X_5IXaL0N?3YK7Xh!1?XgYz9YEXhXaYPXhC3X`-YLY_XfVf[EGXZ5L8BXL9YHX]SYTXjLXdJ: YcXbQXg1PX]Yx4|Jr{Ys4.8YU+XIY`0N,<H%-H;:0@,74/:8546I=9177154870UC]d<C3HXl7ALYzXFXWP<<?E!88E5@03YYXJ?YJ@6YxX-YdXhYG|9o{`iXjY_>YVXe>AYFX[/(I@0841?):-B=14337:8=|14{c&93788|di{cW-0>0<097/A;N{FqYpugAFT%X/Yo3Yn,#=XlCYHYNX[Xk3YN:YRT4?)-YH%A5XlYF3C1=NWyY}>:74-C673<69545v {iT85YED=64=.F4..9878/D4378?48B3:7:7/1VX[f4{D,{l<5E75{dAbRB-8-@+;DBF/$ZfW8S<4YhXA.(5@*11YV8./S95C/0R-A4AXQYI7?68167B95HA1*<M3?1/@;/=54XbYP36}lc{qzSS38:19?,/39193574/66878Yw1X-87E6=;964X`T734:>86>1/=0;(I-1::7ALYGXhF+Xk[@W%TYbX7)KXdYEXi,H-XhYMRXfYK?XgXj.9HX_SX]YL1XmYJ>Y}WwIXiI-3-GXcYyXUYJ$X`Vs[7;XnYEZ;XF! 3;%8;PXX(N3Y[)Xi1YE&/ :;74YQ6X`33C;-(>Xm0(TYF/!YGXg8 9L5P01YPXO-5%C|qd{{/K/E6,=0144:361:955;6443@?B7*7:F89&F35YaX-CYf,XiFYRXE_e{}sF 0*7XRYPYfXa5YXXY8Xf8Y~XmA[9VjYj*#YMXIYOXk,HHX40YxYMXU8OXe;YFXLYuPXP?EB[QV0CXfY{:9XV[FWE0D6X^YVP*$4%OXiYQ(|xp|%c3{}V`1>Y`XH00:8/M6XhQ1:;3414|TE|&o@1*=81G8<3}6<|(f6>>>5-5:8;093B^3U*+*^*UT30XgYU&7*O1953)5@E78--F7YF*B&0:%P68W9Zn5974J9::3}Vk|-,C)=)1AJ4+<3YGXfY[XQXmT1M-XcYTYZXCYZXEYXXMYN,17>XIG*SaS|/eYJXbI?XdNZ+WRYP<F:R PXf;0Xg`$|1GX9YdXjLYxWX!ZIXGYaXNYm6X9YMX?9EXmZ&XZ#XQ>YeXRXfAY[4 ;0X!Zz0XdN$XhYL XIY^XGNXUYS/1YFXhYk.TXn4DXjB{jg|4DEX]:XcZMW=A.+QYL<LKXc[vV$+&PX*Z3XMYIXUQ:ZvW< YSXFZ,XBYeXMM)?Xa XiZ4/EXcP3%}&-|6~:1(-+YT$@XIYRBC<}&,|7aJ6}bp|8)K1|Xg|8C}[T|8Q.89;-964I38361<=/;883651467<7:>?1:.}le|:Z=39;1Y^)?:J=?XfLXbXi=Q0YVYOXaXiLXmJXO5?.SFXiCYW}-;|=u&D-X`N0X^,YzYRXO(QX_YW9`I|>hZ:N&X)DQXP@YH#XmNXi$YWX^=!G6YbYdX>XjY|XlX^XdYkX>YnXUXPYF)FXT[EVTMYmYJXmYSXmNXi#GXmT3X8HOX[ZiXN]IU2>8YdX1YbX<YfWuZ8XSXcZU%0;1XnXkZ_WTG,XZYX5YSX Yp 05G?XcYW(IXg6K/XlYP4XnI @XnO1W4Zp-9C@%QDYX+OYeX9>--YSXkD.YR%Q/Yo YUX].Xi<HYEZ2WdCE6YMXa7F)=,D>-@9/8@5=?7164;35387?N<618=6>7D+C50<6B03J0{Hj|N9$D,9I-,.KB3}m |NzE0::/81YqXjMXl7YG; [.W=Z0X4XQY]:MXiR,XgM?9$9>:?E;YE77VS[Y564760391?14941:0=:8B:;/1DXjFA-564=0B3XlH1+D85:0Q!B#:-6&N/:9<-R3/7Xn<*3J4.H:+334B.=>30H.;3833/76464665755:/83H6633:=;.>5645}&E|Y)?1/YG-,93&N3AE@5 <L1-G/8A0D858/30>8<549=@B8] V0[uVQYlXeD(P#ID&7T&7;Xi0;7T-$YE)E=1:E1GR):--0YI7=E<}n9|aT6783A>D7&4YG7=391W;Zx<5+>F#J39}o/|cc;6=A050EQXg8A1-}D-|d^5548083563695D?-.YOXd37I$@LYLWeYlX<Yd+YR A$;3-4YQ-9XmA0!9/XLY_YT(=5XdDI>YJ5XP1ZAW{9>X_6R(XhYO65&J%DA)C-!B:97#A9;@?F;&;(9=11/=657/H,<8}bz|j^5446>.L+&Y^8Xb6?(CYOXb*YF(8X`FYR(XPYVXmPQ%&DD(XmZXW??YOXZXfCYJ79,O)XnYF7K0!QXmXi4IYFRXS,6<%-:YO(+:-3Q!1E1:W,Zo}Am|n~;3580534*?3Zc4=9334361693:30C<6/717:<1/;>59&:4}6!|rS36=1?75<8}[B|s809983579I.A.>84758=108564741H*9E{L{|u%YQ<%6XfH.YUXe4YL@,>N}Tv|ve*G0X)Z;/)3@A74(4P&A1X:YVH97;,754*A66:1 D739E3553545558E4?-?K17/770843XAYf838A7K%N!YW4.$T19Z`WJ*0XdYJXTYOXNZ 1XaN1A+I&Xi.Xk3Z3GB&5%WhZ1+5#Y[X<4YMXhQYoQXVXbYQ8XSYUX4YXBXWDMG0WxZA[8V+Z8X;D],Va$%YeX?FXfX[XeYf<X:Z[WsYz8X_Y]%XmQ(!7BXIZFX]&YE3F$(1XgYgYE& +[+W!<YMYFXc;+PXCYI9YrWxGXY9DY[!GXiI7::)OC;*$.>N*HA@{C|}&k=:<TB83X`3YL+G4XiK]i}(fYK<=5$.FYE%4*5*H*6XkCYL=*6Xi6!Yi1KXR4YHXbC8Xj,B9ZbWx/XbYON#5B}Ue}+QKXnF1&YV5XmYQ0!*3IXBYb71?1B75XmF;0B976;H/RXU:YZX;BG-NXj;XjI>A#D3B636N;,*%<D:0;YRXY973H5)-4FXOYf0:0;/7759774;7;:/855:543L43<?6=E,.A4:C=L)%4YV!1(YE/4YF+ F3%;S;&JC:%/?YEXJ4GXf/YS-EXEYW,9;E}X$}547EXiK=51-?71C%?57;5>463553Zg90;6447?<>4:9.7538XgN{|!}9K/E&3-:D+YE1)YE/3;37/:05}n<}:UX8Yj4Yt864@JYK..G=.(A Q3%6K>3(P3#AYE$-6H/456*C=.XHY[#S.<780191;057C)=6HXj?955B:K1 E>-B/9,;5.!L?:0>/.@//:;7833YZ56<4:YE=/:7Z_WGC%3I6>XkC*&NA16X=Yz2$X:Y^&J48<99k8}CyB-61<18K946YO4{|N}E)YIB9K0L>4=46<1K0+R;6-=1883:478;4,S+3YJX`GJXh.Yp+Xm6MXcYpX(>7Yo,/:X=Z;Xi0YTYHXjYmXiXj;*;I-8S6N#XgY}.3XfYGO3C/$XjL$*NYX,1 6;YH&<XkK9C#I74.>}Hd`A748X[T450[n75<4439:18A107>|ET}Rf<1;14876/Yb983E<5.YNXd4149>,S=/4E/<306443G/06}0&}UkYSXFYF=44=-5095=88;63844,9E6644{PL}WA8:>)7+>763>>0/B3A545CCnT}Xm|dv}Xq1L/YNXk/H8;;.R63351YY747@15YE4J8;46;.38.>4A369.=-83,;Ye3?:3@YE.4-+N353;/;@(X[YYD>@/05-I*@.:551741Yf5>6A443<3535;.58/86=D4753442$635D1>0359NQ @73:3:>><Xn?;43C14 ?Y|X611YG1&<+,4<*,YLXl<1/AIXjF*N89A4Z576K1XbJ5YF.ZOWN.YGXO/YQ01:4G38Xl1;KI0YFXB=R<7;D/,/4>;$I,YGXm94@O35Yz66695385.>:6A#5}W7n^4336:4157597434433<3|XA}m`>=D>:4A.337370?-6Q96{`E|4A}C`|Qs{Mk|J+~r>|o,wHv>Vw}!c{H!|Gb|*Ca5}J||,U{t+{CN[!M65YXOY_*B,Y[Z9XaX[QYJYLXPYuZ%XcZ8LY[SYPYKZM<LMYG9OYqSQYM~[e{UJXmQYyZM_)>YjN1~[f3{aXFY|Yk:48YdH^NZ0|T){jVFYTZNFY^YTYN~[h{nPYMYn3I]`EYUYsYIZEYJ7Yw)YnXPQYH+Z.ZAZY]^Z1Y`YSZFZyGYHXLYG 8Yd#4~[i|+)YH9D?Y^F~Y7|-eYxZ^WHYdYfZQ~[j|3>~[k|3oYmYqY^XYYO=Z*4[]Z/OYLXhZ1YLZIXgYIHYEYK,<Y`YEXIGZI[3YOYcB4SZ!YHZ*&Y{Xi3~[l|JSY`Zz?Z,~[m|O=Yi>??XnYWXmYS617YVYIHZ(Z4[~L4/=~[n|Yu{P)|];YOHHZ}~[o33|a>~[r|aE]DH~[s|e$Zz~[t|kZFY~XhYXZB[`Y}~[u|{SZ&OYkYQYuZ2Zf8D~[v}% ~[w3},Q[X]+YGYeYPIS~[y}4aZ!YN^!6PZ*~[z}?E~[{3}CnZ=~[}}EdDZz/9A3(3S<,YR8.D=*XgYPYcXN3Z5 4)~[~}JW=$Yu.XX~] }KDX`PXdZ4XfYpTJLY[F5]X~[2Yp}U+DZJ::<446[m@~]#3}]1~]%}^LZwZQ5Z`/OT<Yh^ -~]&}jx[ ~m<z!%2+~ly4VY-~o>}p62yz!%2+Xf2+~ly4VY-zQ`z (=] 2z~o2",C={" ":0,"!":1},c=34,i=2,p,s="",u=String.fromCharCode,t=u(12539);while(++c<127)C[u(c)]=c^39&&c^92?i++:0;i=0;while(0<=(c=C[a.charAt(i++)]))if(16==c)if((c=C[a.charAt(i++)])<87){if(86==c)c=1879;while(c--)s+=u(++p)}else s+=s.substr(8272,360);else if(c<86)s+=u(p+=c<51?c-16:(c-55)*92+C[a.charAt(i++)]);else if((c=((c-86)*92+C[a.charAt(i++)])*92+C[a.charAt(i++)])<49152)s+=u(p=c<40960?c:c|57344);else{c&=511;while(c--)s+=t;p=12539}return s')();
    function decodeToShiftJis(str)
    {
        return str.replace(/%(8[1-9A-F]|[9E][0-9A-F]|F[0-9A-C])(%[4-689A-F][0-9A-F]|%7[0-9A-E]|[@-~])|%([0-7][0-9A-F]|A[1-9A-F]|[B-D][0-9A-F])/ig,
            function(s)
            {
                var c = _parseInt(s.substring(1, 3), 16);
                var l = s.length;
                return 3==l?_fromCharCode(c<160?c:c+65216):JCT11280.charAt((c<160?c-129:c-193)*188+(4==l?s.charCodeAt(3)-64:(c=_parseInt(s.substring(4),16))<127?c-64:c-65));
            }
        );
    }

    /**
     * onresize
     */
    window.onresize = function()
    {
        if (!isSpriteSheet && isLoad) {
            _clearInterval(intervalId);
            changeScreenSize();
            loaded();
        }
    };

    /**
     * init
     */
    function init()
    {
        window.removeEventListener("DOMContentLoaded", init, false);

        var div = _document.getElementById('swf2js');

        // 場所指定
        var containerDom = null;
        if (tagId != null) {
            containerDom = _document.getElementById(tagId);
            if (!containerDom) {
                alert('Not Found Tag Id');
                return 0;
            }
            div = _document.createElement('div');
            div.id = 'swf2js';
            containerDom.appendChild(div);
        }

        var parent = div.parentNode;
        if (parent.tagName == 'BODY') {
            width  = (optionWidth > 0) ? optionWidth : window.innerWidth;
            height = (optionHeight > 0) ? optionHeight : window.innerHeight;
        } else {
            width  = (optionWidth > 0) ? optionWidth : parent.clientWidth;
            height = (optionHeight > 0) ? optionHeight : parent.clientHeight;
        }

        var minSize = _min(width, height);
        var style = div.style;
        style.position = 'relative';
        style.top = '0';
        style.left = _floor((width / 2) - (minSize / 2)) +'px';
        style.width = minSize + 'px';
        style.height = minSize + 'px';
        style.backgroundColor = '#000000';
        style.overflow = 'hidden';
        style['-webkit-user-select'] = 'none';

        // loading
        loading();

        // main canvasをセット
        var canvas = _document.createElement('canvas');
        canvas.width = (width * devicePixelRatio);
        canvas.height = (height * devicePixelRatio);
        style = canvas.style;
        style.zIndex = 0;
        style.position = 'absolute';
        style.zoom = 100 / devicePixelRatio + '%';
        style['-webkit-tap-highlight-color'] = 'rgba(0,0,0,0)';
        context = canvas.getContext('2d');

        var preCanvas = _document.createElement('canvas');
        preCanvas.width = canvas.width;
        preCanvas.height = canvas.height;
        preContext = preCanvas.getContext('2d');

        if (isAndroid && isChrome) {
            var tmpCanvas = _document.createElement('canvas');
            tmpCanvas.width = canvas.width;
            tmpCanvas.height = canvas.height;
            tmpContext = tmpCanvas.getContext('2d');
        }

        if (isTouch) {
            var startEvent = 'touchstart';
            var moveEvent  = 'touchmove';
            var endEvent   = 'touchend';
        } else {
            var startEvent = 'mousedown';
            var moveEvent  = 'mousemove';
            var endEvent   = 'mouseup';
        }

        canvas.addEventListener(startEvent, touchStart, false);
        canvas.addEventListener(moveEvent, touchMove, false);
        canvas.addEventListener(endEvent, touchEnd, false);

        if (!isTouch) {
            window.addEventListener("keydown", keyAction, false);
        }

        if (!intervalId && isLoad && imgUnLoadCount == 0) {
            loaded();
        }
    }

    /**
     * loading
     */
    function loading()
    {
        var div = _document.getElementById('swf2js');
        var css = '<style>';
        css += '#swf2js_loading {\n';
        css += 'z-index: 999;\n';
        css += 'position: absolute;\n';
        css += 'top: 50%;\n';
        css += 'left: 50%;\n';
        css += 'margin: -24px 0 0 -24px;\n';
        css += 'width: 50px;\n';
        css += 'height: 50px;\n';
        css += 'border-radius: 50px;\n';
        css += 'border: 8px solid #dcdcdc;\n';
        css += 'border-right-color: transparent;\n';
        css += 'box-sizing: border-box;\n';
        css += '-webkit-animation: swf2js_loading 1s infinite linear;\n';
        css += '} \n';

        css += '@-webkit-keyframes swf2js_loading {\n';
        css += '0% {-webkit-transform: rotate(0deg); opacity: 0.4;}\n';
        css += '50% {-webkit-transform: rotate(180deg); opacity: 1;}\n';
        css += '100% {-webkit-transform: rotate(360deg); opacity: 0.4;}\n';
        css += '} \n';

        css += '</style>';
        div.innerHTML = css;

        var loadingDiv = _document.createElement('div');
        loadingDiv.id = 'swf2js_loading';
        div.appendChild(loadingDiv);
    }

    /**
     * changeScreenSize
     */
    function changeScreenSize()
    {
        var div = _document.getElementById('swf2js');
        var parent = div.parentNode;
        if (parent.tagName == 'BODY') {
            var screenWidth  = (optionWidth > 0) ? optionWidth : window.innerWidth;
            var screenHeight = (optionHeight > 0) ? optionHeight : window.innerHeight;
        } else {
            var screenWidth  = (optionWidth > 0) ? optionWidth : parent.clientWidth;
            var screenHeight = (optionHeight > 0) ? optionHeight : parent.clientHeight;
        }

        var canvasWidth  = player.width;
        var canvasHeight = player.height;
        var minSize = _min(screenWidth, screenHeight);

        // 条件に合わせてリサイズ
        if(canvasWidth > canvasHeight){
            scale = screenWidth / canvasWidth * devicePixelRatio;
            width  = canvasWidth * scale;
            height = canvasHeight * scale;
        } else if (canvasWidth == canvasHeight) {
            scale  = minSize / canvasWidth * devicePixelRatio;
            width  = canvasWidth  * scale;
            height = canvasHeight * scale;
        } else {
            scale = _min(
                (screenWidth / canvasWidth) * devicePixelRatio,
                (screenHeight / canvasHeight) * devicePixelRatio
            );
            width  = canvasWidth * scale;
            height = canvasHeight * scale;
        }

        // divの設定
        var style = div.style;
        style.width = (width / devicePixelRatio) + 'px';
        style.height = (height / devicePixelRatio) + 'px';
        style.top = 0;
        style.left =  ((screenWidth / 2) - ((width / devicePixelRatio) / 2)) + 'px';

        // main
        var canvas = context.canvas;
        canvas.width = width;
        canvas.height = height;

        // pre
        var preCanvas = preContext.canvas;
        preCanvas.width = width;
        preCanvas.height = height;

        // tmp
        if (isAndroid && isChrome) {
            var tmpCanvas = tmpContext.canvas;
            tmpCanvas.width = width;
            tmpCanvas.height = height;
        }
    }

    /**
     * BitIO
     * @constructor
     */
    var BitIO = function()
    {
        this.data = null;
        this.bit_offset = 0;
        this.byte_offset = 0;
        this.bit_buffer = null;
    };

    /**
     * init
     * @param binary
     */
    BitIO.prototype.init = function(binary)
    {
        var _this = this;
        var length = binary.length;
        var array = _this.createArray(length);
        var key = 0;
        for (; length--;) {
            array[key] = binary.charCodeAt(key++) & 0xff;
        }
        this.data = array;
    };

    /**
     * createArray
     * @param length
     * @returns {Array}
     */
    BitIO.prototype.createArray = function(length)
    {
        return (window.ArrayBuffer) ? new Uint8Array(length) : [];
    };

    /**
     * @param data
     */
    BitIO.prototype.setData = function(data)
    {
        this.data = data;
    };

    /**
     * Signature
     * @returns {string}
     */
    BitIO.prototype.getHeaderSignature = function()
    {
        var _this = this;
        var str = '';
        str += _fromCharCode(_this.getUI8());
        str += _fromCharCode(_this.getUI8());
        str += _fromCharCode(_this.getUI8());
        return str;
    };

    /**
     * バージョン情報
     * @returns {number}
     */
    BitIO.prototype.setVersion = function()
    {
        version = this.getUI8();
    };

    /**
     * byte_offsetをカウントアップしてbit_offsetを初期化
     */
    BitIO.prototype.byteAlign = function()
    {
        var _this = this;
        if (_this.bit_offset) {
            _this.byte_offset += ((_this.bit_offset + 7) / 8) | 0;
            _this.bit_offset = 0;
        }
    };

    /**
     * getData
     * @param length
     * @returns {Array}
     */
    BitIO.prototype.getData = function(length)
    {
        var _this = this;
        _this.byteAlign();
        var array = _this.createArray(length);
        var key = 0;
        var data = _this.data;
        while (length) {
            array[key++] = data[_this.byte_offset++];
            length--;
        }

        return array;
    };

    /**
     * DataUntil
     * @param value
     * @param isJis
     * @returns {string}
     */
    BitIO.prototype.getDataUntil = function(value, isJis)
    {
        var _this = this;
        var data = _this.data;

        _this.byteAlign();
        var bo = _this.byte_offset;
        var offset = 0;
        if (value == null) {
            offset = -1;
        } else {
            var length = data.length;
            while (true) {
                var value = data[bo + offset];
                offset++;
                if (value == 0 || (bo + offset) >= length) {
                    break;
                }
            }
        }

        var n = 0;
        if (offset == -1) {
            n = data.length - bo;
        } else {
            n = offset;
        }

        var array = [];
        var ret = '';
        var _join = Array.prototype.join;
        if (value != null) {
            for (var i = 0; i < n; i++) {
                var code = data[bo + i];
                if (code == 10 || code == 13) {
                    array[array.length] = '@LFCR';
                } else if (code < 32) {
                    continue;
                } else {
                    array[array.length] = '%' + code.toString(16);
                }
            }

            var str = _join.call(array, '');
            if (isJis == false) {
                ret = _decodeURIComponent(_escape(_unescape(str)));
            } else {
                ret = decodeToShiftJis(str);
            }

            if (ret.length > 5 && ret.substr(-5) == '@LFCR') {
                ret = ret.slice(0, -5);
            }
        } else {
            for (var i = 0; i < n; i++) {
                ret += _fromCharCode(data[bo + i]);
            }
        }

        _this.byte_offset = bo + n;
        return ret;
    };

    /**
     * byte_offsetのカウントアップ調整
     */
    BitIO.prototype.byteCarry = function()
    {
        var _this = this;
        if (_this.bit_offset > 7) {
            _this.byte_offset += ((_this.bit_offset + 7) / 8) | 0;
            _this.bit_offset &= 0x07;
        } else {
            while (_this.bit_offset < 0) {
                _this.byte_offset--;
                _this.bit_offset += 8;
            }
        }
    };

    /**
     * 次以降のフィールドで使われるビット長を取得
     * @param n
     * @returns {number}
     */
    BitIO.prototype.getUIBits = function(n)
    {
        var value = 0;
        var _this = this;
        var _getUIBit = _this.getUIBit;
        while (n--) {
            value <<= 1;
            value |= _getUIBit.call(_this);
        }
        return value;
    };

    /**
     * getUIBitsで指定されたbitの個別取得
     * @returns {number}
     */
    BitIO.prototype.getUIBit = function()
    {
        var _this = this;
        _this.byteCarry();
        return (_this.data[_this.byte_offset]
            >> (7 - _this.bit_offset++)) & 0x1;
    };

    /**
     * 符号付き整数
     * @param n
     * @returns {number}
     */
    BitIO.prototype.getSIBits = function(n)
    {
        var _this = this;
        var value = _this.getUIBits(n);
        var msb = value & (0x1 << (n-1));
        if (msb) {
            var bitMask = (2 * msb) - 1;
            return  - (value ^ bitMask) - 1;
        }
        return value;
    };

    /**
     * 符号無し 8-bit 整数
     * @returns {number}
     */
    BitIO.prototype.getUI8 = function()
    {
        var _this = this;
        _this.byteAlign();
        return _this.data[_this.byte_offset++];
    };

    /**
     * 符号無し 16-bit 整数
     * @returns {number}
     */
    BitIO.prototype.getUI16 = function()
    {
        var _this = this;
        _this.byteAlign();
        var data = _this.data;
        return (data[_this.byte_offset++] |
                (data[_this.byte_offset++]) << 8);
    };

    /**
     *
     * @returns {number}
     */
    BitIO.prototype.getUI16BE = function()
    {
        var _this = this;
        _this.byteAlign();
        var data = _this.data;
        return (((data[_this.byte_offset++]) << 8) |
                (data[_this.byte_offset++]));
    };

    /**
     * 符号無し 32-bit 整数
     * @returns {number}
     */
    BitIO.prototype.getUI32 = function()
    {
        var _this = this;
        _this.byteAlign();
        var data = _this.data;
        return (data[_this.byte_offset++] |
                (data[_this.byte_offset++] |
                 (data[_this.byte_offset++] |
                  (data[_this.byte_offset++])
                  << 8) << 8) << 8);
    };

    /**
     * getFloat16
     * @returns {*}
     */
    BitIO.prototype.getFloat16 = function()
    {
        var data = this.getData(2);
        var float = 0;
        for (var i = 2; i--;) {
            float |= data[i] << (i * 8);
        }

        return _parseFloat(float);
    };

    /**
     * getFloat32
     * @returns {*}
     */
    BitIO.prototype.getFloat32 = function()
    {
        var data = this.getData(4);
        var rv = 0;
        var i = 0;
        for (i = 4; i--;) {
            rv |= data[i] << (i * 8);
        }

        var sign = rv & 0x80000000;
        var exp  = (rv >> 23) & 0xff;
        var fraction = rv & 0x7fffff;

        var float = 0;
        if (!rv || rv == 0x80000000) {
            float = 0;
        } else {
            float = (sign ? -1 : 1)
                * (fraction | 0x800000)
                    *  _pow(2, (exp - 127 - 23));
        }

        return _parseFloat(float);
    };

    /**
     * getFloat64(Double)
     * @returns {number}
     */
    BitIO.prototype.getFloat64 = function()
    {
        var i = 4;
        var _this = this;

        var upperData = _this.getData(4);
        var upperBits = 0;
        for (i = 4; i--;) {
            upperBits |= upperData[i] << (i * 8);
        }

        var lowerData = _this.getData(4);
        var lowerBits = 0;
        for (i = 4; i--;) {
            lowerBits |= lowerData[i] << (i * 8);
        }

        var sign = upperBits >>> 31 & 0x1;
        var exp = upperBits >>> 20 & 0x7FF;
        var upperFraction = upperBits & 0xFFFFF;
        var lowerFraction = lowerBits;

        return ((sign == 0) ? 1 : -1)
            * (upperFraction / _pow(2, 20) + lowerFraction / (_pow(2, 52) + 1))
                * _pow(2, exp - 1023);
    };

    /**
     * 符号無し 16-bit 整数
     * @param data
     * @returns {number}
     */
    BitIO.prototype.toUI16 = function(data)
    {
        return data[0] + (data[1] << 8);
    };

    /**
     * toSI16LE
     * @param data
     * @returns {number}
     */
    BitIO.prototype.toSI16LE = function(data)
    {
        var _this = this;
        var value = _this.toUI16(data);
        if (value < 0x8000) {
            return value;
        }
        return value - 0x10000;
    };

    /**
     * increment
     * @param byteInt
     * @param bitInt
     */
    BitIO.prototype.incrementOffset = function(byteInt, bitInt)
    {
        var _this = this;
        _this.byte_offset += byteInt;
        _this.bit_offset += bitInt;
        _this.byteCarry();
    };

    /**
     * setOffset
     * @param byteInt
     * @param bitInt
     */
    BitIO.prototype.setOffset = function(byteInt, bitInt)
    {
        var _this = this;
        _this.byte_offset = byteInt;
        _this.bit_offset = bitInt;
    };

    /**
     * getEncodedU32
     * @returns {number}
     */
    BitIO.prototype.getEncodedU32 = function()
    {
        var _this = this;
        var value = 0;
        var data = _this.data;
        for (var i = 0; i < 5; i++) {
            var num = data[_this.byte_offset++];
            value = value | ((num & 0x7f) << (7 * i));
            if (!(num & 0x80)) {
                break;
            }
        }
        return value;
    };

    /**
     * readUB
     * @param length
     * @returns {number}
     */
    BitIO.prototype.readUB = function(length)
    {
        var _this = this;
        var value = 0;
        var _readNumber = _this.readNumber;
        for (var i = 0; i < length; i++) {
            if (_this.bit_offset == 8) {
                _this.bit_buffer = _readNumber.call(_this, 1);
                _this.bit_offset = 0;
            }

            value |= (_this.bit_buffer
                & (0x01 << _this.bit_offset++) ? 1 : 0) << i;
        }

        return value;
    };

    /**
     * readNumber
     * @returns {number}
     */
    BitIO.prototype.readNumber = function(n)
    {
        var _this = this;
        var value = 0;
        var o = _this.byte_offset;
        var i = o + n;
        while(i > o){
            value = (value << 8) | _this.data[--i];
        }

        _this.byte_offset += n;
        return value;
    };

    /**
     * 圧縮swf対応
     * @returns {*}
     */
    BitIO.prototype.deCompress = function(length)
    {
        var _this = bitio;
        var key = 0;
        var i = 0;
        var bo = _this.byte_offset;
        var data = _this.getData(bo);

        var deCompress = unzip(_this.data, true);
        var array = _this.createArray(length);

        // header
        var dataLength = data.length;
        for (i = 0; i < dataLength; i++) {
            array[key++] = data[i];
        }

        // deCompress
        var compLength = deCompress.length;
        for (i = 0; i < compLength; i++) {
            array[key++] = deCompress[i];
        }

        _this.data = array;
        _this.byte_offset = bo;
    };

    /**
     * SwfTag
     */
    var SwfTag = function()
    {
        this.currentPosition = {x:0, y:0};
    };

    /**
     * parse
     * @returns {Array}
     */
    SwfTag.prototype.parse = function(mc)
    {
        var _this = swftag;

        // parse tag
        var tags = _this.parseTags(
            bitio.data.length,
            mc.CharacterId
        );

        // load sound
        if (isTouch) {
            var sLen = loadSounds.length;
            if (sLen) {
                var canvas = context.canvas;
                var loadSound = function ()
                {
                    canvas.removeEventListener('touchstart', loadSound, false);
                    for (var i = sLen; i--;) {
                        if (!(i in loadSounds)) {
                            continue;
                        }
                        var audio = loadSounds[i];
                        audio.load();
                    }
                };
                canvas.addEventListener('touchstart', loadSound, false);
            }
        }

        return tags;
    };

    /**
     * build
     * @param tags
     * @param parent
     */
    SwfTag.prototype.build = function(tags, parent)
    {
        var len = tags.length;
        var _showFrame = swftag.showFrame;
        for (var frame = 1; frame < len; frame++) {
            if (!(frame in tags)) {
                continue;
            }
            _showFrame(tags[frame], parent);
        }
    };

    /**
     * showFrame
     * @param obj
     * @param mc
     */
    SwfTag.prototype.showFrame = function(obj, mc)
    {
        var _this = swftag;
        var _buildTag = _this.buildTag;

        var newDepth = [];
        var length = 0;
        var frame = obj.frame;
        totalFrame = _max(mc.getTotalFrames(), frame);
        mc.setTotalFrames(_max(mc.getTotalFrames(), frame));

        // add ActionScript
        var actions = obj.actionScript;
        length = actions.length;
        if (length) {
            for (; length--;) {
                if (!(length in actions)) {
                    continue;
                }
                mc.setActions(frame, actions[length]);
            }
        }

        // add label
        var labels = obj.labels;
        length = labels.length;
        if (length) {
            for (; length--;) {
                if (!(length in labels)) {
                    continue;
                }
                var label = labels[length];
                mc.addLabel(label.frame, label.name);
            }
        }

        // add sounds
        var sounds = obj.sounds;
        length = sounds.length;
        if (length) {
            for (; length--;) {
                if (!(length in sounds)) {
                    continue;
                }
                mc.addSound(frame, sounds[length]);
            }
        }

        var cTags = obj.cTags;
        length = cTags.length;
        if (length) {
            for (var i = 0; i < length; i++) {
                if (!(i in cTags)) {
                    continue;
                }

                var tag = cTags[i];
                newDepth[tag.Depth] = true;
                _buildTag(frame, tag, mc);
            }
        }

        // remove tag
        var tags = obj.removeTags;
        length = tags.length;
        if (length) {
            for (; length--;) {
                if (!(length in tags)) {
                    continue;
                }

                var rTag = tags[length];
                newDepth[rTag.Depth] = true;
                mc.addRemoveTag(frame, rTag);
            }
        }

        // 前回のコピー
        if (frame > 1) {
            var prevFrame = frame - 1;
            if (prevFrame in mc.addTags) {
                var prevTags = mc.addTags[prevFrame];
                if (mc.addTags[frame] == undefined) {
                    mc.addTags[frame] = [];
                }

                var prevOriginTags = mc.originTags[prevFrame];
                if (mc.originTags[frame] == undefined) {
                    mc.originTags[frame] = [];
                }

                length = prevTags.length;
                for (; length--;) {
                    if (!(length in prevTags)) {
                        continue;
                    }

                    if (length in newDepth) {
                        continue;
                    }

                    var prevTag = prevTags[length];
                    var prevOriginTag = prevOriginTags[length];
                    mc.addTags[frame][length] = prevTag;
                    mc.originTags[frame][length] = prevOriginTag;
                }
            }
        }
    };

    /**
     * buildTag
     * @param frame
     * @param tag
     * @param parent
     */
    SwfTag.prototype.buildTag = function(frame, tag, parent)
    {
        var _this = swftag;
        var _build = _this.build;
        var obj = {};
        var _clone = clone;

        if (parent.addTags[frame] == undefined) {
            parent.addTags[frame] = [];
        }

        if (parent.originTags[frame] == undefined) {
            parent.originTags[frame] = [];
        }

        if (parent.controlTags[frame] == undefined) {
            parent.controlTags[frame] = [];
        }

        var isCopy = true;
        if (tag.PlaceFlagMove) {
            var oTag = parent.originTags[frame - 1][tag.Depth];
            if (oTag != undefined) {
                if (tag.PlaceFlagHasCharacter) {
                    if (tag.CharacterId != oTag.CharacterId) {
                        isCopy = false;
                    }
                } else {
                    tag.PlaceFlagHasCharacter = oTag.PlaceFlagHasCharacter;
                    tag.CharacterId = oTag.CharacterId;
                }

                if (!tag.PlaceFlagHasMatrix
                    && oTag.PlaceFlagHasMatrix
                ) {
                    tag.PlaceFlagHasMatrix = oTag.PlaceFlagHasMatrix;
                    tag.Matrix = oTag.Matrix;
                }

                if (!tag.PlaceFlagHasColorTransform
                    && oTag.PlaceFlagHasColorTransform
                ) {
                    tag.PlaceFlagHasColorTransform = oTag.PlaceFlagHasColorTransform;
                    tag.ColorTransform = oTag.ColorTransform;
                }

                if (!tag.PlaceFlagHasClipDepth
                    && oTag.PlaceFlagHasClipDepth
                ) {
                    tag.PlaceFlagHasClipDepth = oTag.PlaceFlagHasClipDepth;
                    tag.ClipDepth = oTag.ClipDepth;
                }

                if (!tag.PlaceFlagHasRatio && !isCopy) {
                    tag.PlaceFlagHasRatio = 1;
                    tag.Ratio = frame - 1;
                }
            }
        }

        var char = character[tag.CharacterId];
        if (char instanceof Array) {
            if (tag.PlaceFlagMove && isCopy) {
                var mc = parent.addTags[frame - 1][tag.Depth];
            } else {
                var mc = new MovieClip();
                mc.setParent(parent);
                mc.characterId = tag.CharacterId;
                mc.setLevel(tag.Depth);
                if (tag.PlaceFlagHasName) {
                    mc._name = tag.Name;
                }
                _build(char, mc);
            }

            obj = mc;
        } else {
            switch (char.tagType) {
                default:
                    break;
                case 7: // DefineButton
                case 34: // DefineButton2
                    var btnCharacters = char.characters;
                    var characters = [];
                    var bLength = btnCharacters.length;
                    for (var d = 1; d < bLength; d++) {
                        if (!(d in btnCharacters)) {
                            continue;
                        }

                        if (!(d in characters)) {
                            characters[d] = [];
                        }

                        var btnTags = btnCharacters[d];
                        var bTagLength = btnTags.length;
                        for (var i = 0; i < bTagLength; i++) {
                            if (!(i in btnTags)) {
                                continue;
                            }

                            var bTag = btnTags[i];
                            var btnChar = character[bTag.CharacterId];
                            if (btnChar instanceof Array) {
                                var mc = new MovieClip();
                                mc.setParent(parent);
                                mc.characterId = tag.CharacterId;
                                mc.setLevel(tag.Depth);
                                if (tag.PlaceFlagHasName) {
                                    mc._name = tag.Name;
                                }
                                _build(btnChar, mc);
                                characters[d].push(mc);
                            } else {
                                characters[d].push({
                                    characterId: bTag.CharacterId,
                                    matrix:  _clone(bTag.Matrix),
                                    colorTransform: _clone(bTag.ColorTransform)
                                });
                            }
                        }
                    }

                    obj.characters = characters;
                    break;
                case 46: // MorphShape
                case 84: // MorphShape2
                    obj = _this.buildMorphShape(char, tag.Ratio);
                    break;
            }

            obj.characterId = tag.CharacterId;
        }

        // Matrix ColorTransform Object
        var controlTag = {};

        // 初期値設定
        if (obj instanceof MovieClip) {
            if (!tag.PlaceFlagHasMatrix) {
                tag.Matrix = [1,0,0,1,0,0];
            }

            if (!tag.PlaceFlagHasColorTransform) {
                tag.ColorTransform = [1,1,1,1,0,0,0,0];
            }

            controlTag._Matrix = _clone(tag.Matrix);
            controlTag._ColorTransform = _clone(tag.ColorTransform);
        }

        if (tag.PlaceFlagHasMatrix) {
            obj.matrix = _clone(tag.Matrix);
        }

        if (tag.PlaceFlagHasColorTransform) {
            obj.colorTransform = _clone(tag.ColorTransform);
        }

        if (tag.PlaceFlagHasRatio) {
            controlTag.Ratio = tag.Ratio;
        }

        if (tag.PlaceFlagHasClipDepth) {
            obj.isClipDepth = 1;
            obj.clipDepth = tag.ClipDepth;
        }

        parent.originTags[frame][tag.Depth] = _clone(tag);
        parent.controlTags[frame][tag.Depth] = controlTag;
        parent.addTags[frame][tag.Depth] = obj;
    };

    /**
     * generateDefaultTagObj
     * @param frame
     * @param characterId
     * @returns {{ }}
     */
    SwfTag.prototype.generateDefaultTagObj = function (frame, characterId)
    {
        return {
            frame: frame,
            characterId: characterId,
            cTags: [],
            removeTags: [],
            actionScript: [],
            labels: [],
            sounds: []
        }
    };

    /**
     * parseTags
     * @param dataLength
     * @param characterId
     * @returns {Array}
     */
    SwfTag.prototype.parseTags = function(dataLength, characterId)
    {
        var _this = swftag;
        var _parseTag = _this.parseTag;
        var _addTag = _this.addTag;
        var _generateDefaultTagObj = _this.generateDefaultTagObj;
        var frame = 1;
        var tags = [];
        var tagType = 0;

        // default set
        tags[frame] = _generateDefaultTagObj(
            frame,
            characterId
        );

        while (bitio.byte_offset < dataLength) {
            var tagStartOffset = bitio.byte_offset;
            if (tagStartOffset + 2 > dataLength) {
                break;
            }

            var tagLength = bitio.getUI16();
            tagType = tagLength >> 6;

            // long形式
            var length = tagLength & 0x3f;
            if (length == 0x3f) {
                if (tagStartOffset + 6 > dataLength) {
                    bitio.byte_offset = tagStartOffset;
                    bitio.bit_offset = 0;
                    break;
                }
                length = bitio.getUI32();
            }

            var tagDataStartOffset = bitio.byte_offset;
            if (tagType == 1) {
                frame++;
                if (dataLength > tagDataStartOffset + 2) {
                    tags[frame] = _generateDefaultTagObj(
                        frame,
                        characterId
                    );
                }
            }

            var tag = _parseTag(tagType, length);
            var o = bitio.byte_offset - tagDataStartOffset;
            if (o != length) {
                if (o < length) {
                    var eat = (length - o);
                    if (eat > 0) {
                        bitio.byte_offset += eat;
                    }
                }
            }

            if (tag != null) {
                tags = _addTag(tagType, tags, tag, frame);
            }
            bitio.bit_offset = 0;
        }

        return tags;
    };

    /**
     * parseTag
     * @param tagType
     * @param length
     * @returns {*}
     */
    SwfTag.prototype.parseTag = function(tagType, length)
    {
        var _this = swftag;
        var obj = null;

        switch (tagType) {
            case 0: // End
                break;
            case 1: // ShowFrame
                break;
            case 2:  // DefineShape
            case 22: // DefineShape2
            case 32: // DefineShape3
            case 83: // DefineShape4
                if (length < 10) {
                    bitio.byte_offset + length;
                } else {
                    _this.parseDefineShape(tagType);
                }
                shapeCount++;
                break;
            case 9: // BackgroundColor
                var color = "rgb("
                    + bitio.getUI8() +","
                    + bitio.getUI8() +","
                    + bitio.getUI8() +")";
                if (backgroundColor == null) {
                    var canvas = context.canvas;
                    var style = canvas.style;
                    style.backgroundColor = color;
                    backgroundColor = color;
                }
                break;
            case 10: // DefineFont
            case 48: // DefineFont2
            case 75: // DefineFont3
                _this.parseDefineFont(tagType);
                break;
            case 11: // DefineText
            case 33: // DefineText2
                _this.parseDefineText(tagType);
                break;
            case 4: // PlaceObject
            case 26: // PlaceObject2
            case 70: //PlaceObject3
                obj = _this.parsePlaceObject(tagType, length);
                break;
            case 37: // DefineEditText
                _this.parseDefineEditText(tagType);
                break;
            case 39: // DefineSprite
                _this.parseDefineSprite(bitio.byte_offset + length);
                break;
            case 12: // DoAction
                obj = _this.parseDoAction(length);
                break;
            case 59: // DoInitAction
                _this.parseDoInitAction(length);
                break;
            case 5: // RemoveObject
            case 28: // RemoveObject2
                obj =  _this.parseRemoveObject(tagType);
                break;
            case 7: // DefineButton
            case 34: // DefineButton2
                obj =  _this.parseDefineButton(tagType, length);
                break;
            case 43: // FrameLabel
                obj =  _this.parseFrameLabel();
                break;
            case 88: // DefineFontName
                _this.parseDefineFontName();
                break;
            case 20: // DefineBitsLossless
            case 36: // DefineBitsLossless2
                _this.parseDefineBitsLossLess(tagType, length);
                break;
            case 6: // DefineBits
            case 21: // DefineBitsJPEG2
            case 35: // DefineBitsJPEG3
            case 90: // DefineBitsJPEG4
                _this.parseDefineBits(tagType, length, jpegTables);
                jpegTables = null;
                break;
            case 8: // JPEGTables
                jpegTables = _this.parseJPEGTables(length);
                break;
            case 56: // ExportAssets
                _this.parseExportAssets();
                break;
            case 46: // DefineMorphShape
            case 84: // DefineMorphShape2
                _this.parseDefineMorphShape(tagType);
                break;
            case 40: // NameCharacter
                var NameCharacterValue = bitio.getDataUntil("\0");
                break;
            case 24: // Protect
                bitio.byteAlign();
                break;
            case 64: // EnableDebugger2
                var Reserved = bitio.getUI16();
                var Password = bitio.getDataUntil('\0');
                break;
            case 69: // FileAttributes
                var Reserved = bitio.getUIBit();
                var UseDirectBlit = bitio.getUIBit();
                var UseGPU = bitio.getUIBit();
                var HasMetadata = bitio.getUIBit();
                var ActionScript3 = bitio.getUIBit();
                var Reserved2 = bitio.getUIBits(3);
                var UseNetwork = bitio.getUIBit();
                var Reserved3 = bitio.getUIBits(24);
                break;
            case 77: // MetaData
                var MetaData = bitio.getDataUntil('\0');
                break;
            case 86: // DefineSceneAndFrameLabelData
                obj = _this.parseDefineSceneAndFrameLabelData();
                break;
            case 18: // SoundStreamHead
            case 45: // SoundStreamHead2
                obj = _this.parseSoundStreamHead(tagType);
                break;
            case 72: // DoABC
            case 82: // DoABC2
                obj = _this.parseDoABC(tagType, length);
                break;
            case 76: // SymbolClass
                obj = _this.parseSymbolClass();
                break;
            case 14: // DefineSound
                _this.parseDefineSound(tagType, length);
                break;
            case 15: // StartSound
            case 89: // StartSound2
                obj = _this.parseStartSound(tagType);
                break;
            case 17: // DefineButtonSound
                _this.parseDefineButtonSound();
                break;
            case 73: // DefineFontAlignZones
                _this.parseDefineFontAlignZones(tagType, length);
                break;
            case 74: // CSMTextSettings
                _this.parseCSMTextSettings(tagType, length);
                break;
            // TODO 未実装
            case 3:  // FreeCharacter
            case 13: // DefineFontInfo
            case 16: // StopSound
            case 19: // SoundStreamBlock
            case 23: // DefineButtonCxform
            case 25: // PathsArePostScript
            case 29: // SyncFrame
            case 31: // FreeAll
            case 38: // DefineVideo
            case 41: // ProductInfo
            case 42: // DefineTextFormat
            case 44: // DefineBehavior
            case 47: // FrameTag
            case 49: // GeProSet
            case 52: // FontRef
            case 53: // DefineFunction
            case 54: // PlaceFunction
            case 55: // GenTagObject
            case 57: // ImportAssets
            case 58: // EnableDebugger
            case 60: // DefineVideoStream
            case 61: // VideoFrame
            case 62: // DefineFontInfo2
            case 63: // DebugID
            case 65: // ScriptLimits
            case 66: // SetTabIndex
            case 71: // ImportAssets2
            case 78: // DefineScalingGrid
            case 87: // DefineBinaryData
            case 91: // DefineFont4
            case 93: // EnableTelemetry
                console.log('[base]未対応tagType -> ' + tagType);
                break;
            case 27: // 27 (invalid)
            case 30: // 30 (invalid)
            case 67: // 67 (invalid)
            case 68: // 68 (invalid)
            case 79: // 79 (invalid)
            case 80: // 80 (invalid)
            case 81: // 81 (invalid)
            case 85: // 85 (invalid)
            case 92: // 92 (invalid)
                break;
            default: // null
                break;
        }

        return obj;
    };

    /**
     * addTag
     * @param tagType
     * @param tags
     * @param tag
     * @param frame
     * @returns {*}
     */
    SwfTag.prototype.addTag = function (tagType, tags, tag, frame) {
        var tagsArray = tags[frame];
        switch (tagType) {
            case 4:  // PlaceObject
            case 26: // PlaceObject2
            case 70: // PlaceObject3
                var cTags = tagsArray.cTags;
                tagsArray.cTags[cTags.length] = tag;
                break;
            case 12: // DoAction
                var as = tagsArray.actionScript;
                tagsArray.actionScript[as.length] = tag;
                break;
            case 5: // RemoveObject
            case 28: // RemoveObject2
                var removeTags = tagsArray.removeTags;
                tagsArray.removeTags[removeTags.length] = tag;
                break;
            case 43: // FrameLabel
                var labels = tagsArray.labels;
                tag.frame = frame;
                tagsArray.labels[labels.length] = tag;
                break;
            case 15: // StartSound
            case 89: // StartSound2
                var sounds = tagsArray.sounds;
                tagsArray.sounds[sounds.length] = tag;
                break;
        }

        return tags;
    };

    /**
     * parseDefineShape
     * @param tagType
     */
    SwfTag.prototype.parseDefineShape = function(tagType)
    {
        var _this = swftag;
        var characterId = bitio.getUI16();
        var shapeBounds = _this.rect();

        if (tagType == 83) {
            var EdgeBounds = _this.rect();
            var Reserved = bitio.getUIBits(5);
            var UsesFillWindingRule = bitio.getUIBit();
            var UsesNonScalingStrokes = bitio.getUIBit(1);
            var UsesScalingStrokes = bitio.getUIBit(1);
        }

        var shapes = _this.shapeWithStyle(tagType);
        _this.appendShapeTag(characterId, shapeBounds, shapes, tagType);
    };

    /**
     * rect
     * @returns {{Xmin: number, Xmax: number, Ymin: number, Ymax: number}}
     */
    SwfTag.prototype.rect = function()
    {
        bitio.byteAlign();
        var nBits = bitio.getUIBits(5);
        return {
            Xmin: bitio.getSIBits(nBits),
            Xmax: bitio.getSIBits(nBits),
            Ymin: bitio.getSIBits(nBits),
            Ymax: bitio.getSIBits(nBits)
        };
    };

    /**
     * shapeWithStyle
     * @param tagType
     * @returns {{fillStyles: {fillStyleCount: number, fillStyles: Array}, lineStyles: {lineStyleCount: number, lineStyles: Array}, NumFillBits: number, NumLineBits: number, ShapeRecords: Array}}
     */
    SwfTag.prototype.shapeWithStyle = function(tagType)
    {
        var _this = swftag;

        if (tagType == 46 || tagType == 84) {
            var fillStyles = null;
            var lineStyles = null;
        } else {
            var fillStyles = _this.fillStyleArray(tagType);
            var lineStyles = _this.lineStyleArray(tagType);
        }

        var numBits = bitio.getUI8();
        var NumFillBits = numBits >> 4;
        var NumLineBits = numBits & 0x0f;
        var ShapeRecords = _this.shapeRecords(tagType, {
            FillBits: NumFillBits,
            LineBits: NumLineBits
        });

        return {
            fillStyles: fillStyles,
            lineStyles: lineStyles,
            NumFillBits: NumFillBits,
            NumLineBits: NumLineBits,
            ShapeRecords: ShapeRecords
        };
    };

    /**
     * fillStyleArray
     * @param tagType
     * @returns {{fillStyleCount: number, fillStyles: Array}}
     */
    SwfTag.prototype.fillStyleArray = function(tagType)
    {
        var _this = swftag;
        var fillStyleCount = bitio.getUI8();
        if ((tagType > 2) && (fillStyleCount == 0xff)) {
            fillStyleCount = bitio.getUI16();
        }

        var fillStyles = [];
        for (var i = fillStyleCount; i--;) {
            fillStyles[fillStyles.length] = _this.fillStyle(tagType);
        }

        return {
            fillStyleCount: fillStyleCount,
            fillStyles: fillStyles
        };
    };

    /**
     * fillStyle
     * @param tagType
     * @returns {{}}
     */
    SwfTag.prototype.fillStyle = function(tagType)
    {
        var _this = swftag;
        var obj = {};
        var bitType = bitio.getUI8();
        obj.fillStyleType = bitType;

        switch (bitType) {
            case 0x00: // 単色塗り
                if (tagType == 32 || tagType == 83) {
                    // DefineShape3
                    obj.Color = _this.rgba();
                } else if (tagType == 46 || tagType == 84) {
                    // DefineMorphShape
                    obj.StartColor = _this.rgba();
                    obj.EndColor = _this.rgba();
                } else {
                    // DefineShape1or2
                    obj.Color = _this.rgb();
                }
                break;
            case 0x10: // 線形グラデーション塗り
            case 0x12: // 円形グラデーション塗り
                if (tagType == 46 || tagType == 84) {
                    obj.startGradientMatrix = _this.matrix();
                    obj.endGradientMatrix = _this.matrix();
                    obj.gradient = _this.gradient(tagType);
                } else {
                    obj.gradientMatrix = _this.matrix();
                    obj.gradient = _this.gradient(tagType);
                }
                break;
            case 0x13: // 焦点付き円形グラデーション塗り (SWF 8 以降のみ)
                obj.gradientMatrix = _this.matrix();
                obj.gradient = _this.focalGradient(tagType);
                break;
            case 0x40: // 繰り返しビットマップ塗り
            case 0x41: // クリッピングビットマップ塗り
            case 0x42: // スムーズでない繰り返しビットマップ塗り
            case 0x43: // スムーズでないクリッピングビットマップ塗り
                obj.bitmapId = bitio.getUI16();
                if (tagType == 46 || tagType == 84) {
                    obj.startBitmapMatrix = _this.matrix();
                    obj.endBitmapMatrix = _this.matrix();
                } else {
                    obj.bitmapMatrix = _this.matrix();
                }
                break;
        }
        return obj;
    };

    /**
     * rgb
     * @returns {{R: number, G: number, B: number, A: number}}
     */
    SwfTag.prototype.rgb = function()
    {
        return {
            R: bitio.getUI8(),
            G: bitio.getUI8(),
            B: bitio.getUI8(),
            A: 1
        };
    };

    /**
     * rgba
     * @returns {{R: number, G: number, B: number, A: number}}
     */
    SwfTag.prototype.rgba = function()
    {
        return {
            R: bitio.getUI8(),
            G: bitio.getUI8(),
            B: bitio.getUI8(),
            A: bitio.getUI8() / 255
        };
    };

    /**
     * matrix
     * @returns {Array}
     */
    SwfTag.prototype.matrix = function()
    {
        bitio.byteAlign();
        var HasScale = bitio.getUIBit();
        var ScaleX = 1;
        var ScaleY = 1;
        if (HasScale) {
            var nScaleBits = bitio.getUIBits(5);
            ScaleX = bitio.getSIBits(nScaleBits) / 0x10000;
            ScaleY = bitio.getSIBits(nScaleBits) / 0x10000;
        }

        var HasRotate = bitio.getUIBit();
        var RotateSkew0 = 0;
        var RotateSkew1 = 0;
        if (HasRotate) {
            var nRotateBits = bitio.getUIBits(5);
            RotateSkew0 = bitio.getSIBits(nRotateBits) / 0x10000;
            RotateSkew1 = bitio.getSIBits(nRotateBits) / 0x10000;
        }

        var nTranslateBits = bitio.getUIBits(5);
        var TranslateX = bitio.getSIBits(nTranslateBits);
        var TranslateY = bitio.getSIBits(nTranslateBits);

        return [
            ScaleX,
            RotateSkew0,
            RotateSkew1,
            ScaleY,
            TranslateX,
            TranslateY
        ];
    };

    /**
     * gradient
     * @param tagType
     * @returns {{SpreadMode: number, InterpolationMode: number, GradientRecords: Array}}
     */
    SwfTag.prototype.gradient = function(tagType)
    {
        bitio.byteAlign();
        var _this = swftag;
        var SpreadMode = bitio.getUIBits(2);
        var InterpolationMode = bitio.getUIBits(2);
        var NumGradients = bitio.getUIBits(4);

        var GradientRecords = [];
        for (var i = NumGradients; i--;) {
            GradientRecords[GradientRecords.length] =
                _this.gradientRecord(tagType);
        }

        return {
            SpreadMode: SpreadMode,
            InterpolationMode: InterpolationMode,
            GradientRecords: GradientRecords
        };
    };

    /**
     * gradientRecord
     * @param tagType
     * @returns {{Ratio: number, Color: *}}
     */
    SwfTag.prototype.gradientRecord = function(tagType)
    {
        var _this = swftag;
        var Ratio = bitio.getUI8();
        if (tagType < 32) {
            // DefineShape1or2
            var Color = _this.rgb();
        } else {
            // DefineShape3or4
            var Color = _this.rgba();
        }

        return {
            Ratio: Ratio / 255,
            Color: Color
        };
    };

    /**
     * focalGradient
     * @param tagType
     * @returns {{SpreadMode: number, InterpolationMode: number, GradientRecords: Array, FocalPoint: number}}
     */
    SwfTag.prototype.focalGradient = function(tagType)
    {
        bitio.byteAlign();
        var _this = swftag;
        var SpreadMode = bitio.getUIBits(2);
        var InterpolationMode = bitio.getUIBits(2);
        var numGradients = bitio.getUIBits(4);

        var gradientRecords = [];
        for (var i = numGradients; i--;) {
            gradientRecords[gradientRecords.length] =
                _this.gradientRecord(tagType);
        }
        var FocalPoint = bitio.getUI8();

        return {
            SpreadMode: SpreadMode,
            InterpolationMode: InterpolationMode,
            GradientRecords: gradientRecords,
            FocalPoint: FocalPoint
        };
    };

    /**
     * lineStyleArray
     * @param tagType
     * @returns {{lineStyleCount: number, lineStyles: Array}}
     */
    SwfTag.prototype.lineStyleArray = function(tagType)
    {
        var _this = swftag;
        var lineStyleCount = bitio.getUI8();
        if ((tagType > 2) && (lineStyleCount == 0xff)) {
            lineStyleCount = bitio.getUI16();
        }

        var array = [];
        for (var i = lineStyleCount; i--;) {
            array[array.length] = _this.lineStyles(tagType);
        }

        return {
            lineStyleCount: lineStyleCount,
            lineStyles: array
        };
    };

    /**
     * lineStyles
     * @param tagType
     * @returns {{}}
     */
    SwfTag.prototype.lineStyles = function(tagType)
    {
        var _this = swftag;
        var obj = {};
        if (tagType == 46) {
            obj = {
                StartWidth: bitio.getUI16(),
                EndWidth: bitio.getUI16(),
                StartColor: _this.rgba(),
                EndColor: _this.rgba()
            };
        } else if (tagType == 84) {
            obj.StartWidth = bitio.getUI16();
            obj.EndWidth = bitio.getUI16();

            obj.StartCapStyle = bitio.getUIBits(2);
            obj.JoinStyle = bitio.getUIBits(2);
            obj.HasFillFlag = bitio.getUIBit();
            obj.NoHScaleFlag = bitio.getUIBit();
            obj.NoVScaleFlag = bitio.getUIBit();
            obj.PixelHintingFlag = bitio.getUIBit();
            obj.Reserved = bitio.getUIBits(5);
            obj.NoClose = bitio.getUIBit();
            obj.EndCapStyle = bitio.getUIBits(2);

            if (obj.JoinStyle == 2) {
                obj.MiterLimitFactor = bitio.getUI16();
            }

            if (obj.HasFillFlag) {
                obj.FillType = _this.fillStyle(tagType);
            } else {
                obj.StartColor = _this.rgba();
                obj.EndColor =  _this.rgba();
            }
        } else {
            obj.Width = bitio.getUI16();
            if (tagType == 83) {
                // DefineShape4
                obj.StartCapStyle = bitio.getUIBits(2);
                obj.JoinStyle = bitio.getUIBits(2);
                obj.HasFillFlag = bitio.getUIBit();
                obj.NoHScaleFlag = bitio.getUIBit();
                obj.NoVScaleFlag = bitio.getUIBit();
                obj.PixelHintingFlag = bitio.getUIBit();
                obj.Reserved = bitio.getUIBits(5);
                obj.NoClose = bitio.getUIBit();
                obj.EndCapStyle = bitio.getUIBits(2);

                if (obj.JoinStyle == 2) {
                    obj.MiterLimitFactor = bitio.getUI16();
                }

                if (obj.HasFillFlag) {
                    obj.FillType = _this.fillStyle(tagType);
                } else {
                    obj.Color = _this.rgba();
                }
            } else if (tagType == 32) {
                // DefineShape3
                obj.Color = _this.rgba();
            } else {
                // DefineShape1or2
                obj.Color = _this.rgb();

            }
        }

        return obj;
    };

    /**
     * shapeRecords
     * @param tagType
     * @param currentNumBits
     * @returns {Array}
     */
    SwfTag.prototype.shapeRecords = function(tagType, currentNumBits)
    {
        var _this = swftag;
        var shapeRecords = [];
        _this.currentPosition = {x:0, y:0};
        var _straightEdgeRecord = _this.straightEdgeRecord;
        var _curvedEdgeRecord = _this.curvedEdgeRecord;
        var _styleChangeRecord = _this.styleChangeRecord;

        while (true) {
            var first6Bits = bitio.getUIBits(6);
            var shape = 0;

            if (first6Bits & 0x20) {
                // Edge
                var numBits = first6Bits & 0x0f;
                if (first6Bits & 0x10) {
                    // StraigtEdge (11XXXX)
                    shape = _straightEdgeRecord(tagType, numBits);
                } else {
                    // CurvedEdge (10XXXX)
                    shape = _curvedEdgeRecord(tagType, numBits);
                }
            } else if (first6Bits) {
                // ChangeStyle (0XXXXX)
                shape =
                    _styleChangeRecord(tagType, first6Bits, currentNumBits);
            }

            shapeRecords[shapeRecords.length] = shape;
            if (!shape) {
                bitio.byteAlign();
                break;
            }
        }
        return shapeRecords;
    };

    /**
     * straightEdgeRecord
     * @param tagType
     * @param numBits
     * @returns {{ControlX: number, ControlY: number, AnchorX: number, AnchorY: number, isCurved: boolean, isChange: boolean}}
     */
    SwfTag.prototype.straightEdgeRecord = function(tagType, numBits)
    {
        var _this = swftag;
        var deltaX = 0;
        var deltaY = 0;
        var GeneralLineFlag = bitio.getUIBit();
        if (GeneralLineFlag) {
            deltaX = bitio.getSIBits(numBits + 2);
            deltaY = bitio.getSIBits(numBits + 2);
        } else {
            var VertLineFlag = bitio.getUIBit();
            if (VertLineFlag) {
                deltaX = 0;
                deltaY = bitio.getSIBits(numBits + 2);
            } else {
                deltaX = bitio.getSIBits(numBits + 2);
                deltaY = 0;
            }
        }

        var AnchorX = deltaX;
        var AnchorY = deltaY;
        if (tagType != 46 && tagType != 84) {
            AnchorX = _this.currentPosition.x + deltaX;
            AnchorY = _this.currentPosition.y + deltaY;
            _this.currentPosition.x = AnchorX;
            _this.currentPosition.y = AnchorY;
        }

        return {
            ControlX: 0,
            ControlY: 0,
            AnchorX: AnchorX,
            AnchorY: AnchorY,
            isCurved: false,
            isChange: false
        };
    };

    /**
     * curvedEdgeRecord
     * @param tagType
     * @param numBits
     * @returns {{ControlX: number, ControlY: number, AnchorX: number, AnchorY: number, isCurved: boolean, isChange: boolean}}
     */
    SwfTag.prototype.curvedEdgeRecord = function(tagType, numBits)
    {
        var _this = swftag;
        var controlDeltaX = bitio.getSIBits(numBits + 2);
        var controlDeltaY = bitio.getSIBits(numBits + 2);
        var anchorDeltaX = bitio.getSIBits(numBits + 2);
        var anchorDeltaY = bitio.getSIBits(numBits + 2);

        var ControlX  = controlDeltaX;
        var ControlY = controlDeltaY;
        var AnchorX = anchorDeltaX;
        var AnchorY = anchorDeltaY;
        if (tagType != 46 && tagType != 84) {
            ControlX  = _this.currentPosition.x + controlDeltaX;
            ControlY = _this.currentPosition.y + controlDeltaY;
            AnchorX = ControlX + anchorDeltaX;
            AnchorY = ControlY + anchorDeltaY;

            _this.currentPosition.x = AnchorX;
            _this.currentPosition.y = AnchorY;
        }

        return {
            ControlX: ControlX,
            ControlY: ControlY,
            AnchorX: AnchorX,
            AnchorY: AnchorY,
            isCurved: true,
            isChange: false
        };
    };

    /**
     * styleChangeRecord
     * @param tagType
     * @param changeFlag
     * @param currentNumBits
     * @returns {{}}
     */
    SwfTag.prototype.styleChangeRecord = function(tagType, changeFlag, currentNumBits)
    {
        var _this = swftag;
        var obj = {};
        obj.StateNewStyles = (changeFlag >> 4) & 1;
        obj.StateLineStyle = (changeFlag >> 3) & 1;
        obj.StateFillStyle1 = (changeFlag >> 2) & 1;
        obj.StateFillStyle0 = (changeFlag >> 1) & 1;
        obj.StateMoveTo =  changeFlag & 1;
        if (obj.StateMoveTo) {
            var moveBits = bitio.getUIBits(5);
            obj.MoveX = bitio.getSIBits(moveBits);
            obj.MoveY = bitio.getSIBits(moveBits);
            _this.currentPosition.x = obj.MoveX;
            _this.currentPosition.y = obj.MoveY;
        }

        if (obj.StateFillStyle0) {
            obj.FillStyle0 = bitio.getUIBits(currentNumBits.FillBits);
        }
        if (obj.StateFillStyle1) {
            obj.FillStyle1 = bitio.getUIBits(currentNumBits.FillBits);
        }
        if (obj.StateLineStyle) {
            obj.LineStyle = bitio.getUIBits(currentNumBits.LineBits);
        }
        if (obj.StateNewStyles) {
            obj.FillStyles = _this.fillStyleArray(tagType);
            obj.LineStyles = _this.lineStyleArray(tagType);
            var numBits = bitio.getUI8();
            currentNumBits.FillBits = obj.NumFillBits = numBits >> 4;
            currentNumBits.LineBits = obj.NumLineBits = numBits & 0x0f;
        }
        obj.isChange = true;
        return obj;
    };

    /**
     * appendShapeTag
     * @param characterId
     * @param shapeBounds
     * @param shapes
     * @param tagType
     */
    SwfTag.prototype.appendShapeTag = function(characterId, shapeBounds, shapes, tagType)
    {
        // フレームをセット
        character[characterId] = {
            tagType: tagType,
            data: swftag.vectorToCanvas(shapes),
            Xmax: shapeBounds.Xmax,
            Xmin: shapeBounds.Xmin,
            Ymax: shapeBounds.Ymax,
            Ymin: shapeBounds.Ymin
        };
    };

    /**
     * vectorToCanvas
     * @param shapes
     * @returns {*}
     */
    SwfTag.prototype.vectorToCanvas = function(shapes)
    {
        var _this = swftag;
        var i = 0;
        var depth = 0;
        var lineStyle = shapes.lineStyles.lineStyles;
        var fillStyle = shapes.fillStyles.fillStyles;
        var records = shapes.ShapeRecords;
        var AnchorX = 0;
        var AnchorY = 0;
        var ControlX = 0;
        var ControlY = 0;

        var canvasF0Array = [[]];
        var canvasF1Array = [[]];
        var canvasLArray = [[]];

        var fillFlag0 = false;
        var fillFlag1 = false;
        var lineFlag = false;

        var f0Idx = 0;
        var f1Idx = 0;

        var StartX = 0;
        var StartY = 0;

        // 重なり番号
        var stack = 0;

        while (true) {
            var record = records[i];
            if (records[i] == 0) {
                break;
            }

            if (record.isChange) {
                // 移動判定
                if (record.StateMoveTo) {
                    StartX = record.MoveX;
                    StartY = record.MoveY;
                } else {
                    StartX = AnchorX;
                    StartY = AnchorY;
                }

                // 新しい色をセット
                var StateFillStyle0 = record.StateFillStyle0;
                var FillStyle0 = record.FillStyle0;
                var StateFillStyle1 = record.StateFillStyle1;
                var FillStyle1 = record.FillStyle1;
                var StateLineStyle = record.StateLineStyle;
                var LineStyle = record.LineStyle;

                if (record.StateNewStyles == 1) {
                    // fillStyle
                    if (record.NumFillBits > 0) {
                        var FillStyles = record.FillStyles;
                        fillStyle = FillStyles.fillStyles;
                    }

                    // lineStyle
                    if (record.NumLineBits > 0) {
                        var LineStyles = record.LineStyles;
                        lineStyle = LineStyles.lineStyles;
                    }

                    // fillFlag0
                    if (StateFillStyle0 == 1 && FillStyle0 == 0) {
                        fillFlag0 = false;
                    }

                    // fillFlag1
                    if (StateFillStyle1 == 1 && FillStyle1 == 0) {
                        fillFlag1 = false;
                    }

                    // lineFlag
                    if (StateLineStyle == 1 && LineStyle == 0) {
                        lineFlag = false;
                    }

                    // 上に加算
                    stack++;
                    canvasF0Array[stack] = [];
                    canvasF1Array[stack] = [];
                    canvasLArray[stack] = [];

                    AnchorX = 0;
                    AnchorY = 0;

                    i++;
                    continue;
                }

                // 深度
                depth++;

                // fill0
                fillFlag0 = ((StateFillStyle0 > 0 && FillStyle0 > 0)
                    || (fillFlag0 && StateFillStyle0 == 0)
                );
                if (fillFlag0) {
                    // 色の算出
                    if (FillStyle0) {
                        f0Idx = (FillStyle0 - 1);
                        var f0ColorObj = fillStyle[f0Idx];
                        var fillStyleType = f0ColorObj.fillStyleType;
                    }

                    // 初期設定
                    var f0Base = canvasF0Array[stack];
                    if (!(depth in f0Base)) {
                        f0Base[depth] = {
                            StartX: StartX,
                            StartY: StartY,
                            Depth: depth,
                            Color: (fillStyleType == 0x00) ? f0ColorObj.Color : f0ColorObj,
                            ColorIdx: f0Idx,
                            styleType: fillStyleType,
                            cArray: [],
                            fArray: []
                        };

                        var f0cArray = f0Base[depth].fArray;
                        var aLen = f0cArray.length;
                        f0cArray[aLen++] = 'moveTo';
                        f0cArray[aLen++] = StartX;
                        f0cArray[aLen] = StartY;
                    }
                }

                // fill1
                fillFlag1 = ((StateFillStyle1 > 0 && FillStyle1 > 0)
                    || (fillFlag1 && StateFillStyle1 == 0)
                );
                if (fillFlag1) {
                    // 色の算出
                    if (FillStyle1) {
                        f1Idx = (FillStyle1 - 1);
                        var f1ColorObj = fillStyle[f1Idx];
                        var fillStyleType = f1ColorObj.fillStyleType;
                    }

                    // 初期設定
                    var f1Base = canvasF1Array[stack];
                    if (!(depth in f1Base)) {
                        f1Base[depth] = {
                            StartX: StartX,
                            StartY: StartY,
                            Depth: depth,
                            Color: (fillStyleType == 0x00) ? f1ColorObj.Color : f1ColorObj,
                            ColorIdx: f1Idx,
                            styleType: fillStyleType,
                            cArray: [],
                            fArray: []
                        };

                        var f1cArray = f1Base[depth].fArray;
                        var aLen = f1cArray.length;
                        f1cArray[aLen++] = 'moveTo';
                        f1cArray[aLen++] = StartX;
                        f1cArray[aLen] = StartY;
                    }
                }

                // line
                lineFlag  = ((StateLineStyle > 0 && LineStyle > 0)
                    || (lineFlag && StateLineStyle == 0)
                );
                if (lineFlag) {
                    if (LineStyle) {
                        var nKey   = (LineStyle - 1);
                        var colorObj = lineStyle[nKey];
                        var Width  = lineStyle[nKey].Width;
                    }

                    // 初期設定
                    if (Width > 0) {
                        var lBase = canvasLArray[stack];
                        if (!(depth in lBase)) {
                            lBase[depth] = {
                                StartX: StartX,
                                StartY: StartY,
                                Depth: depth,
                                Width:  Width,
                                merge: false,
                                Color: colorObj.Color,
                                styleType: 0,
                                cArray: [],
                                fArray: []
                            };

                            var lcArray = lBase[depth].fArray;
                            var aLen = lcArray.length;
                            lcArray[aLen++] = 'moveTo';
                            lcArray[aLen++] = StartX;
                            lcArray[aLen] = StartY;
                        }
                    } else {
                        lineFlag = false;
                    }
                }
            } else {
                AnchorX  = record.AnchorX;
                AnchorY  = record.AnchorY;
                ControlX = record.ControlX;
                ControlY = record.ControlY;

                // 描画データ
                var isCurved = record.isCurved;

                // fill0
                if (fillFlag0) {
                    var obj = canvasF0Array[stack][depth];
                    obj.EndX = AnchorX;
                    obj.EndY = AnchorY;
                    obj.cArray[obj.cArray.length] = {
                        isCurved: isCurved,
                        AnchorX:  AnchorX,
                        AnchorY:  AnchorY,
                        ControlX: ControlX,
                        ControlY: ControlY
                    };

                    var fArray = obj.fArray;
                    var aLen = fArray.length;
                    if (isCurved) {
                        fArray[aLen++] = 'quadraticCurveTo';
                        fArray[aLen++] = ControlX;
                        fArray[aLen++] = ControlY;
                        fArray[aLen++] = AnchorX;
                        fArray[aLen] = AnchorY;
                    } else {
                        fArray[aLen++] = 'lineTo';
                        fArray[aLen++] = AnchorX;
                        fArray[aLen] = AnchorY;
                    }
                }

                // fill1
                if (fillFlag1) {
                    var obj = canvasF1Array[stack][depth];
                    obj.EndX = AnchorX;
                    obj.EndY = AnchorY;
                    obj.cArray[obj.cArray.length] = {
                        isCurved: isCurved,
                        AnchorX:  AnchorX,
                        AnchorY:  AnchorY,
                        ControlX: ControlX,
                        ControlY: ControlY
                    };

                    var fArray = obj.fArray;
                    var aLen = fArray.length;
                    if (isCurved) {
                        fArray[aLen++] = 'quadraticCurveTo';
                        fArray[aLen++] = ControlX;
                        fArray[aLen++] = ControlY;
                        fArray[aLen++] = AnchorX;
                        fArray[aLen] = AnchorY;
                    } else {
                        fArray[aLen++] = 'lineTo';
                        fArray[aLen++] = AnchorX;
                        fArray[aLen] = AnchorY;
                    }
                }

                // line
                if (lineFlag) {
                    var obj = canvasLArray[stack][depth];
                    obj.EndX = AnchorX;
                    obj.EndY = AnchorY;
                    obj.cArray[obj.cArray.length] = {
                        isCurved: isCurved,
                        AnchorX:  AnchorX,
                        AnchorY:  AnchorY,
                        ControlX: ControlX,
                        ControlY: ControlY
                    };

                    var fArray = obj.fArray;
                    var aLen = fArray.length;
                    if (isCurved) {
                        fArray[aLen++] = 'quadraticCurveTo';
                        fArray[aLen++] = ControlX;
                        fArray[aLen++] = ControlY;
                        fArray[aLen++] = AnchorX;
                        fArray[aLen] = AnchorY;
                    } else {
                        fArray[aLen++] = 'lineTo';
                        fArray[aLen++] = AnchorX;
                        fArray[aLen] = AnchorY;
                    }
                }
            }

            i++;
        }

        // 色でまとめる
        var F0Array = _this.generateForColor(canvasF0Array);
        var F1Array = _this.generateForColor(canvasF1Array);

        // 反転してマージ
        var len = F0Array.length;
        var _fillReverse = _this.fillReverse;
        if (len) {
            for (var s = len; s--;) {
                if (!(s in F1Array)) {
                    continue;
                }

                var f1ColorArray = F1Array[s];
                var colorArray = F0Array[s];
                var cLen = colorArray.length;
                for (var c = cLen; c--;) {
                    if (!(c in f1ColorArray)) {
                        continue;
                    }

                    if (!(c in colorArray)) {
                        continue;
                    }

                    var f1Colors = f1ColorArray[c];
                    var array = colorArray[c];
                    var aLen = array.length;
                    for (var d = aLen; d--;) {
                        if (!(d in array)) {
                            continue;
                        }

                        var obj = array[d];
                        if (!(d in f1Colors)) {
                            f1Colors[d] = _fillReverse.call(_this, obj);
                            delete F0Array[s][c][d];
                        } else {
                            delete F1Array[s][c][d];
                            delete F0Array[s][c][d];
                        }
                    }
                }
            }
        }

        // 座標調整
        _this.fillMerge(F0Array, canvasLArray);
        _this.fillMerge(F1Array, canvasLArray);

        // 色で集約
        var canvasArray = _this.bundle(F0Array, F1Array);

        // line
        var len = canvasLArray.length;
        var _buildCommand = _this.buildCommand;
        for (var s = 0; s < len; s++) {
            var array = canvasLArray[s];
            var aLen = array.length;
            for (var d = 0; d < aLen; d++) {
                if (!(d in array)) {
                    continue;
                }

                var obj = array[d];
                if (obj == null || obj.cArray == null || obj.fArray == null) {
                    continue;
                }

                if (!(d in canvasArray)) {
                    canvasArray[d] = [];
                }

                var l = canvasArray[d].length;
                canvasArray[d][l] = {
                    Color: obj.Color,
                    Width: obj.Width,
                    styleType: obj.styleType,
                    cmd: _buildCommand.call(_this, obj.fArray)
                };

                obj = null;
            }
        }

        return canvasArray;
    };

    /**
     * buildCommand
     * @param array
     * @returns {Array}
     */
    SwfTag.prototype.buildCommand = function(array)
    {
        var length = array.length;
        var str = '';
        for (var i = 0; i < length; i++) {
            if (!(i in array)) {
                continue;
            }

            var value = array[i];
            switch (value) {
                case 'lineTo':
                    str += 'ctx.lineTo('+ array[++i] +', '+ array[++i] +');';
                    break;
                case 'quadraticCurveTo':
                    str += 'ctx.quadraticCurveTo('+ array[++i] +', '+ array[++i] +', '+ array[++i] +', '+ array[++i] +');';
                    break;
                case 'moveTo':
                    str += 'ctx.moveTo('+ array[++i] +', '+ array[++i] +');';
                    break;
            }
        }

        return new Function('ctx', str);
    };

    /**
     * bundle
     * @param fill0Array
     * @param fill1Array
     * @returns {Array}
     */
    SwfTag.prototype.bundle = function(fill0Array, fill1Array)
    {
        var _this = swftag;
        for (var r = 0; r < 2; r++) {
            if (r == 0) {
                var fArray = fill0Array;
            } else {
                var fArray = fill1Array;
            }

            var sLen = fArray.length;
            for (var s = 0; s < sLen; s++) {
                if (!(s in fArray)) {
                    continue;
                }

                var colorArray = fArray[s];
                var cLen = colorArray.length;
                for (var key = 0; key < cLen; key++) {
                    if (!(key in colorArray)) {
                        continue;
                    }

                    var array = colorArray[key];
                    var depth = null;
                    var dLen = array.length;
                    for (var d = 0; d < dLen; d++) {
                        if (!(d in array)) {
                            continue;
                        }

                        var obj = array[d];
                        if (obj == null || obj.cArray == null) {
                            delete fArray[s][key][d];
                            continue;
                        }

                        if (depth == null) {
                            depth = obj.Depth;
                            continue;
                        }

                        var cArray = obj.cArray;
                        var length = cArray.length;
                        for (var i = 0; i < length; i++) {
                            if (!(i in cArray)) {
                                continue;
                            }
                            var value = cArray[i];
                            var len = array[depth].cArray.length;
                            array[depth].cArray[len] = value;
                        }

                        var fCArray = obj.fArray;
                        var length = fCArray.length;
                        for (var i = 0; i < length; i++) {
                            if (!(i in fCArray)) {
                                continue;
                            }

                            var baseArray = array[depth].fArray;
                            baseArray[baseArray.length] = fCArray[i];
                        }

                        // 使ったので削除
                        fArray[s][key][d] = null;
                    }
                }
            }
        }

        var results = [];
        var _buildCommand = _this.buildCommand;
        for (var r = 0; r < 2; r++) {
            if (r == 0) {
                var fArray = fill0Array;
            } else {
                var fArray = fill1Array;
            }

            var sLen = fArray.length;
            for (var s = 0; s < sLen; s++) {
                if (!(s in fArray)) {
                    continue;
                }
                var stackArray = fArray[s];

                if (!(s in results)) {
                    results[s] = [];
                }

                var cLen = stackArray.length;
                for (var c = 0; c < cLen; c++) {
                    if (!(c in stackArray)) {
                        continue;
                    }
                    var array = stackArray[c];

                    var aLen = array.length;
                    depth = 0;
                    for (var key = 0; key < aLen; key++) {
                        if (!(key in array)) {
                            continue;
                        }

                        var obj = array[key];
                        if (obj == null) {
                            continue;
                        }

                        var Depth = obj.Depth;
                        if (!(Depth in results[s])) {
                            results[s][Depth] = [];
                        }

                        var len = results[s][Depth].length;
                        results[s][Depth][len] = {
                            Color: obj.Color,
                            styleType: obj.styleType,
                            cmd: _buildCommand.call(_this, obj.fArray)
                        };

                        obj = null;
                    }
                }
            }
        }

        var hash = [];
        var length = results.length;
        for (var s = 0; s < length; s++) {
            if (!(s in results)) {
                continue;
            }

            var result = results[s];
            var len = result.length;
            for (var d = 0; d < len; d++) {
                if (!(d in result)) {
                    continue;
                }

                hash[d] = null;
                hash[d] = result[d];
            }
        }

        results = null;
        return hash;
    };

    /**
     * generateForColor
     * @param fillArray
     * @returns {Array}
     */
    SwfTag.prototype.generateForColor = function(fillArray)
    {
        var array = [];
        var len = fillArray.length;
        for (var i = len; i--;) {
            var stackArray = fillArray[i];
            if (array[i] == undefined) {
                array[i] = [];
            }

            var sLen = stackArray.length;
            for (var s = sLen; s--;) {
                var obj = stackArray[s];
                if (obj == undefined) {
                    continue;
                }

                var idx = obj.ColorIdx;
                if (array[i][idx] == undefined) {
                    array[i][idx] = [];
                }
                array[i][idx][s] = obj;
            }
        }
        return array;
    };

    /**
     * fillMerge
     * @param fillArray
     * @param canvasLArray
     */
    SwfTag.prototype.fillMerge = function(fillArray, canvasLArray)
    {
        var _this = swftag;
        var sLen = fillArray.length;
        for (var s = 0; s < sLen; s++) {
            var colorArray = fillArray[s];
            var lineArray = canvasLArray[s];

            var cLen = colorArray.length;
            for (var c = 0; c < cLen; c++) {
                var array = colorArray[c];
                if (array == undefined) {
                    continue;
                }

                var preFill = [];
                var aLen = array.length;
                for (var key = 0; key < aLen; key++) {
                    var obj = array[key];
                    if (obj == undefined
                        || obj == null
                        || obj.cArray == null
                        || (obj.StartX == obj.EndX
                            && obj.StartY == obj.EndY)
                    ) {
                       continue;
                    }

                    preFill[preFill.length] = obj;
                }

                // preLine
                var preLine = [];
                if (lineArray != undefined) {
                    var len = lineArray.length;
                    for (var i = 0; i < len; i++) {
                        if (!(i in lineArray)) {
                            continue;
                        }

                        var obj = lineArray[i];
                        preLine[preLine.length] = obj;
                    }
                }
                var lineLength = preLine.length;

                var cArray = [];
                var lArray = [];
                var cfArray = [];
                var cflArray = [];
                var preCount = preFill.length;
                if (preCount > 1) {
                    var base  = null;
                    var copy  = null;
                    var total = 0;
                    var count = 0;
                    var limit = 0;
                    var limitCount = 0;

                    while (true) {
                        count++;

                        // 判定元のobject
                        if (base == null) {
                            base  = preFill.shift();
                            total = preFill.length;

                            var sX = base.StartX;
                            var sY = base.StartY;
                            var eX = base.EndX;
                            var eY = base.EndY;

                            // 次が無ければ終了
                            if (total == 0) {
                                break;
                            }
                        }

                        // 判定するobject
                        copy = preFill.shift();

                        // 開始・終了地点からそれぞれ判定してマージ
                        if (eX == copy.StartX && eY == copy.StartY) {
                            eX = copy.EndX;
                            eY = copy.EndY;

                            var copyArray = copy.cArray;
                            var len = copyArray.length;
                            for (var i = 0; i < len; i++) {
                                cArray[cArray.length] = copyArray[i];
                            }

                            var copyFArray = copy.fArray;
                            copyFArray.shift();
                            copyFArray.shift();
                            copyFArray.shift();
                            var len = copyFArray.length;
                            for (var i = 0; i < len; i++) {
                                cfArray[cfArray.length] = copyFArray[i];
                            }

                            // lineがあればマージ
                            var depth = copy.Depth;
                            if (lineLength > 0 && depth in lineArray) {
                                var lObj = lineArray[depth];
                                lObj.merge = true;

                                var lineCArray = lObj.cArray;
                                var len = lineCArray.length;
                                for (var i = 0; i < len; i++) {
                                    lArray[lArray.length] = lineCArray[i];
                                }

                                var lineFArray = lObj.fArray;
                                var len = lineFArray.length;
                                for (var i = 0; i < len; i++) {
                                    cflArray[cflArray.length] = lineFArray[i];
                                }
                            }

                            copy.cArray = null;
                            copy.fArray = null;
                            limit = 0;
                            count = 0;
                        } else if (total <= count &&
                            (eX == copy.EndX && eY == copy.EndY
                            || sX == copy.StartX && sY == copy.StartY)
                        ) {
                            eX = copy.StartX;
                            eY = copy.StartY;

                            _this.fillReverse(copy);
                            var copyArray = copy.cArray;
                            var len = copyArray.length;
                            for (var i = 0; i < len; i++) {
                                cArray[cArray.length] = copyArray[i];
                            }

                            var copyFArray = copy.fArray;
                            copyFArray.shift();
                            copyFArray.shift();
                            copyFArray.shift();
                            var len = copyFArray.length;
                            for (var i = 0; i < len; i++) {
                                cfArray[cfArray.length] = copyFArray[i];
                            }

                            // lineがあればマージ
                            var depth = copy.Depth;
                            if (lineLength > 0
                                && lineArray[depth] != undefined
                            ) {
                                var lObj = lineArray[depth];
                                lObj.merge = true;
                                _this.fillReverse(lObj);

                                var lineCArray = lObj.cArray;
                                var len = lineCArray.length;
                                for (var i = 0; i < len; i++) {
                                    lArray[lArray.length] = lineCArray[i];
                                }

                                var lineFArray = lObj.fArray;
                                var len = lineFArray.length;
                                for (var i = 0; i < len; i++) {
                                    cflArray[cflArray.length] = lineFArray[i];
                                }
                            }

                            copy.cArray = null;
                            copy.fArray = null;
                            limit = 0;
                            count = 0;
                        } else {
                            limit++;
                            if (limit > preCount) {
                                limitCount++;
                                preFill[preFill.length] = base;

                                base = copy;
                                sX = base.StartX;
                                sY = base.StartY;
                                eX = base.EndX;
                                eY = base.EndY;
                                limit = 0;
                                count = 0;

                                // limit
                                if (limitCount > preCount) {
                                    break;
                                }
                            } else {
                                preFill[preFill.length] = copy;
                            }

                            copy = null;
                        }

                        // 判定が終了したらセットして初期化
                        if (sX == eX && sY == eY) {
                            var bCArray = base.cArray;
                            var len = cArray.length;
                            for (var i = 0; i < len; i++) {
                                bCArray[bCArray.length] = cArray[i];
                            }

                            var bFArray = base.fArray;
                            var len = cfArray.length;
                            for (var i = 0; i < len; i++) {
                                bFArray[bFArray.length] = cfArray[i];
                            }

                            // line
                            var len = lArray.length;
                            if (len) {
                                var lObj = lineArray[base.Depth];
                                if (lObj == undefined) {
                                    lObj = preLine.shift();
                                    lObj.merge = false;
                                }

                                var lCArray = lObj.cArray;
                                for (var i = 0; i < len; i++) {
                                    lCArray[lCArray.length] = lArray[i];
                                }

                                var lFArray = lObj.fArray;
                                var len = cflArray.length;
                                for (var i = 0; i < len; i++) {
                                    lFArray[lFArray.length] = cflArray[i];
                                }
                            }

                            // fill
                            cArray = [];
                            cfArray = [];

                            // line
                            lArray = [];
                            cflArray = [];

                            // params
                            count = 0;
                            limit = 0;
                            limitCount = 0;
                            base  = null;
                        }

                        // 終了
                        if (!preFill.length) {
                            break;
                        }
                    }
                }
            }
        }
    };

    /**
     * fillReverse
     * @param obj
     * @returns {*}
     */
    SwfTag.prototype.fillReverse = function(obj)
    {
        var rsX = 0;
        var rsY = 0;
        var copyObj = obj;
        var rnX = copyObj.StartX;
        var rnY = copyObj.StartY;
        var cArray = copyObj.cArray;
        var len = cArray.length;
        var count = len;

        while (count--) {
            var shiftObj = cArray.shift();
            if (shiftObj == null) {
                continue;
            }

            rsX = shiftObj.AnchorX;
            rsY = shiftObj.AnchorY;
            shiftObj.AnchorX = rnX;
            shiftObj.AnchorY = rnY;
            rnX = rsX;
            rnY = rsY;

            // set
            cArray[cArray.length] = shiftObj;
        }

        // 開始と終了地点を入れ替える
        var StartX = obj.StartX;
        var StartY = obj.StartY;
        var EndX   = obj.EndX;
        var EndY   = obj.EndY;

        obj.StartX = EndX;
        obj.StartY = EndY;
        obj.EndX   = StartX;
        obj.EndY   = StartY;

        // 描画の入れ替え
        var fCArray = [];
        var fLen = 0;
        fCArray[fLen++] = 'moveTo';
        fCArray[fLen++] = obj.StartX;
        fCArray[fLen++] = obj.StartY;

        // 並べ替え
        for (var i = len; i--;) {
            var data = cArray[i];
            if (data.isCurved) {
                fCArray[fLen++] = 'quadraticCurveTo';
                fCArray[fLen++] = data.ControlX;
                fCArray[fLen++] = data.ControlY;
                fCArray[fLen++] = data.AnchorX;
                fCArray[fLen++] = data.AnchorY;
            } else {
                fCArray[fLen++] = 'lineTo';
                fCArray[fLen++] = data.AnchorX;
                fCArray[fLen++] = data.AnchorY;
            }
        }
        obj.fArray = fCArray;

        return obj;
    };

    /**
     * parseDefineBitsLossLess
     * @param tagType
     * @param length
     */
    SwfTag.prototype.parseDefineBitsLossLess = function(tagType, length)
    {
        var startOffset = bitio.byte_offset;
        var CharacterId = bitio.getUI16();
        var format = bitio.getUI8();
        var width = bitio.getUI16();
        var height = bitio.getUI16();

        var isAlpha = (tagType == 36);
        var colorTableSize = 0;
        if (format == 3) {
            colorTableSize = bitio.getUI8() + 1;
        }

        // unCompress
        var sub = bitio.byte_offset - startOffset;
        var compressed = bitio.getData(length - sub);
        var data = unzip(compressed, false);

        // canvas
        var canvas = cacheStore.getCanvas();
        canvas.width = width;
        canvas.height = height;
        var imageContext = canvas.getContext('2d');
        var imgData = imageContext.createImageData(width, height);
        var pxData = imgData.data;
        if (format == 5 && !isAlpha) {
            var idx = 0;
            var pxIdx = 0;
            for (var y = height; y--;) {
                for (var x = width; x--;) {
                    idx++;
                    pxData[pxIdx++] = data[idx++];
                    pxData[pxIdx++] = data[idx++];
                    pxData[pxIdx++] = data[idx++];
                    pxData[pxIdx++] = 255;
                }
            }
        } else {
            var bpp = (isAlpha) ? 4 : 3;
            var pxIdx = 0;
            var cmIdx = colorTableSize * bpp;
            var pad = (colorTableSize)
                ? ((width + 3) & ~3) - width
                : 0;

            for (var y = height; y--;) {
                for (var x = width; x--;) {
                    var idx = (colorTableSize)
                        ? data[cmIdx++] * bpp
                        : cmIdx++ * bpp;

                    if(!isAlpha){
                        pxData[pxIdx++] = data[idx++];
                        pxData[pxIdx++] = data[idx++];
                        pxData[pxIdx++] = data[idx++];
                        idx++;
                        pxData[pxIdx++] = 255;
                    } else {
                        var alpha = (format == 3)
                            ? data[idx+3]
                            : data[idx++];

                        if (!isAlphaBug) {
                            pxData[pxIdx++] = data[idx++] * 255 / alpha;
                            pxData[pxIdx++] = data[idx++] * 255 / alpha;
                            pxData[pxIdx++] = data[idx++] * 255 / alpha;
                        } else {
                            pxData[pxIdx++] = data[idx++];
                            pxData[pxIdx++] = data[idx++];
                            pxData[pxIdx++] = data[idx++];
                        }
                        pxData[pxIdx++] = alpha;

                        if (format == 3) {
                            idx++;
                        }
                    }
                }
                cmIdx += pad;
            }
        }

        imageContext.putImageData(imgData, 0, 0);
        character[CharacterId] = imageContext;
    };

    /**
     * parseExportAssets
     * @returns {{}}
     */
    SwfTag.prototype.parseExportAssets = function()
    {
        var obj = {};
        var count = bitio.getUI16();

        obj.Tag = [];
        obj.Name = [];
        for (; count--;) {
            obj.Tag[obj.Tag.length] = bitio.getUI16();
            obj.Name[obj.Name.length] = bitio.getDataUntil("\0");
        }
        return obj;
    };

    /**
     * parseJPEGTables
     * @param length
     * @returns {string}
     */
    SwfTag.prototype.parseJPEGTables = function(length)
    {
        return bitio.getData(length);
    };

    /**
     * parseDefineBits
     * @param tagType
     * @param length
     * @param jpegTables
     */
    SwfTag.prototype.parseDefineBits = function(tagType, length, jpegTables)
    {
        var startOffset = bitio.byte_offset;
        var CharacterId = bitio.getUI16();
        var sub = bitio.byte_offset - startOffset;

        var ImageDataLen = length - sub;
        if (tagType == 35 || tagType == 90) {
            ImageDataLen = bitio.getUI32();
        }

        if (tagType == 90) {
            var DeblockParam = bitio.getUI16();
        }

        var JPEGData = bitio.getData(ImageDataLen);
        var BitmapAlphaData = false;
        if (tagType == 35 || tagType == 90) {
            BitmapAlphaData =
                bitio.getData(length - sub - ImageDataLen);
        }
        bitio.byte_offset = startOffset + length;

        // render
        imgUnLoadCount++;
        var image = _document.createElement('img');
        image.onload = function()
        {
            var width = this.width;
            var height = this.height;

            var canvas = cacheStore.getCanvas();
            canvas.width = width;
            canvas.height = height;
            var imageContext = canvas.getContext("2d");
            var _drawImage = imageContext.drawImage;
            _drawImage.call(imageContext, this, 0, 0);

            // 半透明対応
            if (BitmapAlphaData) {
                var data = unzip(BitmapAlphaData, false);
                var imgData = imageContext.getImageData(0, 0, width, height);
                var pxData = imgData.data;
                var pxIdx = 3;
                var len = width * height;
                for (var i = 0; i < len; i++) {
                    pxData[pxIdx] = data[i];
                    pxIdx += 4;
                }
                imageContext.putImageData(imgData, 0, 0);
            }

            character[CharacterId] = imageContext;

            // 読み完了
            imgUnLoadCount--;
            if (!intervalId && isLoad && imgUnLoadCount == 0) {
                loaded();
            }
        };

        if (jpegTables != null && jpegTables.length > 4) {
            var margeData = [];
            var len = jpegTables.length - 2;
            for (var idx = 0; idx < len; idx++) {
                margeData[margeData.length] = jpegTables[idx];
            }

            len = JPEGData.length;
            for (idx = 2; idx < len; idx++) {
                margeData[margeData.length] = JPEGData[idx];
            }

            JPEGData = margeData;
        }

        image.src = "data:image/jpeg;base64,"
            + swftag.base64encode(swftag.parseJpegData(JPEGData));

        _setTimeout(function() {}, 0);
    };

    /**
     * parseJpegData
     * @param JPEGData
     * @returns {string}
     */
    SwfTag.prototype.parseJpegData = function(JPEGData)
    {
        var i = 0;
        var idx = 0;
        var str = '';
        var length = JPEGData.length;

        // erroneous
        if (JPEGData[0] == 0xFF && JPEGData[1] == 0xD9
            && JPEGData[2] == 0xFF && JPEGData[3] == 0xD8
        ) {
            for (i = 4; i < length; i++) {
                str += _fromCharCode(JPEGData[i]);
            }
        } else if (JPEGData[i++] == 0xFF && JPEGData[i++] == 0xD8) {
            for (idx = 0; idx < i; idx++) {
                str += _fromCharCode(JPEGData[idx]);
            }

            while (i < length) {
                if (JPEGData[i] == 0xFF) {
                    if (JPEGData[i + 1] == 0xD9 && JPEGData[i + 2] == 0xFF && JPEGData[i + 3] == 0xD8) {
                        i += 4;
                        for (idx = i; idx < length; idx++) {
                            str += _fromCharCode(JPEGData[idx]);
                        }
                        break;
                    } else if(JPEGData[i+1] == 0xDA) {
                        for (idx = i; idx < length; idx++) {
                            str += _fromCharCode(JPEGData[idx]);
                        }
                        break;
                    } else {
                        var segmentLength = (JPEGData[i + 2] << 8) + JPEGData[i + 3] + i + 2;
                        for (idx = i; idx < segmentLength; idx++) {
                            str += _fromCharCode(JPEGData[idx]);
                        }
                        i += segmentLength - i;
                    }
                }
            }
        }

        return str;
    };

    /**
     * base64encode
     * @param data
     * @returns {*}
     */
    SwfTag.prototype.base64encode = function(data)
    {
        if ('btoa' in window) {
            return window.btoa(data);
        }

        var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var out = [];
        var i = 0;
        var len = data.length;

        while (i < len) {
            var c1 = data.charCodeAt(i++) & 0xff;
            if (i == len) {
                out[out.length] = base64EncodeChars.charAt(c1 >> 2);
                out[out.length] = base64EncodeChars.charAt((c1 & 0x3) << 4);
                out[out.length] = '==';
                break;
            }

            var c2 = data.charCodeAt(i++);
            if (i == len) {
                out[out.length] = base64EncodeChars.charAt(c1 >> 2);
                out[out.length] = base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
                out[out.length] = base64EncodeChars.charAt((c2 & 0xF) << 2);
                out[out.length] = '=';
                break;
            }

            var c3 = data.charCodeAt(i++);
            out[out.length] = base64EncodeChars.charAt(c1 >> 2);
            out[out.length] = base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
            out[out.length] = base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6));
            out[out.length] = base64EncodeChars.charAt(c3 & 0x3F);
        }

        return out.join('');
    };

    /**
     * parseDefineFont
     */
    SwfTag.prototype.parseDefineFont = function(tagType)
    {
        var _this = swftag;
        var obj = {};
        obj.FontId = bitio.getUI16();

        var numGlyphs = 0;
        if (tagType == 48 || tagType == 75) {
            var fontFlags = bitio.getUI8();
            obj.FontFlagsHasLayout = (fontFlags >>> 7) & 1;
            obj.FontFlagsShiftJIS = (fontFlags >>> 6) & 1;
            obj.FontFlagsSmallText = (fontFlags >>> 5) & 1;
            obj.FontFlagsANSI = (fontFlags >>> 4) & 1;
            obj.FontFlagsWideOffsets = (fontFlags >>> 3) & 1;
            obj.FontFlagsWideCodes = (fontFlags >>> 2) & 1;
            obj.FontFlagsItalic = (fontFlags >>> 1) & 1;
            obj.FontFlagsBold  = (fontFlags) & 1;

            obj.LanguageCode = bitio.getUI8();

            obj.FontNameLen = bitio.getUI8();
            if (obj.FontNameLen) {
                var startOffset = bitio.byte_offset;
                var data = bitio.getData(obj.FontNameLen);
                var str = '';
                for (var i = 0; i < obj.FontNameLen; i++) {
                    str += _fromCharCode(data[i]);
                }

                if (!obj.FontFlagsShiftJIS) {
                    str = _unescape(str);
                    str = str.replace(/%(?:25)+([0-9A-F][0-9A-F])/g, function(whole, m1)
                    {
                        return "%"+m1;
                    });
                    var utf8uri = new RegExp(
                        "%[0-7][0-9A-F]|"+
                        "%C[2-9A-F]%[89AB][0-9A-F]|%D[0-9A-F]%[89AB][0-9A-F]|"+
                        "%E[0-F](?:%[89AB][0-9A-F]){2}|"+
                        "%F[0-7](?:%[89AB][0-9A-F]){3}|"+
                        "%F[89AB](?:%[89AB][0-9A-F]){4}|"+
                        "%F[CD](?:%[89AB][0-9A-F]){5}","ig"
                    );

                    var fontName = str.replace(utf8uri, function(whole)
                    {
                        return _decodeURIComponent(str);
                    });
                } else {
                    var fontName = decodeToShiftJis(str)
                }

                var switchName = fontName.substr(0, fontName.length - 1);
                switch (switchName) {
                    case '_sans':
                        obj.FontName = 'sans-serif';
                        break;
                    case '_serif':
                        obj.FontName = 'serif';
                        break;
                    case '_typewriter':
                        obj.FontName = 'monospace';
                        break;
                    default:
                        obj.FontName = switchName;
                        break;
                }
                bitio.byte_offset = startOffset + obj.FontNameLen;
            }

            var numGlyphs = bitio.getUI16();
            obj.NumGlyphs = numGlyphs;
        }

        if (numGlyphs) {
            // offset
            var offset = bitio.byte_offset;

            var OffsetTable = [];
            if (obj.FontFlagsWideOffsets) {
                for (var i = numGlyphs; i--;) {
                    var len = OffsetTable.length;
                    OffsetTable[len] = bitio.getUI32();
                }
                obj.CodeTableOffset = bitio.getUI32();
            } else {
                for (var i = numGlyphs; i--;) {
                    var len = OffsetTable.length;
                    OffsetTable[len] = bitio.getUI16();
                }
                obj.CodeTableOffset = bitio.getUI16();
            }

            // Shape
            obj.GlyphShapeTable = [];
            for (var i = 0; i < numGlyphs; i++) {
                bitio.setOffset(OffsetTable[i] + offset, 0);

                var numBits = bitio.getUI8();
                var NumFillBits = numBits >> 4;
                var NumLineBits = numBits & 0x0f;

                var currentNumBits = {
                    FillBits: NumFillBits,
                    LineBits: NumLineBits
                };

                var shapes = {};
                shapes.ShapeRecords = _this.shapeRecords(tagType, currentNumBits);
                shapes.lineStyles = {
                    lineStyles: [{
                        Color: {R: 0, G: 0,B: 0, A: 1},
                        lineStyleType:0
                    }]
                };
                shapes.fillStyles = {
                    fillStyles: [{
                        Color: {R: 0, G: 0,B: 0, A: 1},
                        fillStyleType:0
                    }]
                };

                var len = obj.GlyphShapeTable.length;
                obj.GlyphShapeTable[len] = shapes;
            }

            if (tagType == 48 || tagType == 75) {
                // 文字情報
                bitio.setOffset(obj.CodeTableOffset + offset, 0);
                obj.CodeTable = [];
                if (obj.FontFlagsWideCodes) {
                    for (var i = numGlyphs; i--;) {
                        var len = obj.CodeTable.length;
                        obj.CodeTable[len] = bitio.getUI16();
                    }
                } else {
                    for (var i = numGlyphs; i--;) {
                        var len = obj.CodeTable.length;
                        obj.CodeTable[len] = bitio.getUI8();
                    }
                }

                if (obj.FontFlagsHasLayout) {
                    obj.FontAscent = bitio.getUI16();
                    obj.FontDescent = bitio.getUI16();
                    obj.FontLeading = bitio.getUI16();

                    obj.FontAdvanceTable = [];
                    for (var i = numGlyphs; i--;) {
                        var len = obj.FontAdvanceTable.length;
                        obj.FontAdvanceTable[len] = bitio.getUI16();
                    }

                    obj.FontBoundsTable = [];
                    for (var i = numGlyphs; i--;) {
                        var len = obj.FontBoundsTable.length;
                        obj.FontBoundsTable[len] = _this.rect();
                    }

                    if (tagType == 75) {
                        obj.KerningCount = bitio.getUI16();
                        obj.KerningRecord = [];
                        for (var i = obj.KerningCount; i--;) {
                            var FontKerningCode1 = (obj.FontFlagsWideCodes) ? bitio.getUI16() : bitio.getUI8();
                            var FontKerningCode2 = (obj.FontFlagsWideCodes) ? bitio.getUI16() : bitio.getUI8();
                            var FontKerningAdjustment = bitio.getSIBits(16);
                            obj.KerningRecord[obj.KerningRecord.length] = {
                                FontKerningCode1: FontKerningCode1,
                                FontKerningCode2: FontKerningCode2,
                                FontKerningAdjustment: FontKerningAdjustment
                            };
                        }
                    }
                }
            }
        }

        character[obj.FontId] = obj;
    };

    /**
     * parseDefineFontName
     */
    SwfTag.prototype.parseDefineFontName = function()
    {
        var FontId = bitio.getUI16();
        var FontName = bitio.getDataUntil("\0");
        var FontCopyright = bitio.getDataUntil("\0");
    };

    /**
     * parseDefineText
     * @param tagType
     */
    SwfTag.prototype.parseDefineText = function(tagType)
    {
        var _this = swftag;
        var obj = {};
        obj.tagType = tagType;

        var characterId = bitio.getUI16();
        obj.Bounds = _this.rect();
        obj.Matrix = _this.matrix();
        var GlyphBits = bitio.getUI8();
        var AdvanceBits = bitio.getUI8();
        obj.TextRecords = _this.getTextRecords(
            tagType, GlyphBits, AdvanceBits
        );
        character[characterId] = obj;
    };

    /**
     * @param tagType
     * @param GlyphBits
     * @param AdvanceBits
     * @returns {Array}
     */
    SwfTag.prototype.getTextRecords = function(tagType, GlyphBits, AdvanceBits)
    {
        var _this = swftag;
        var array = [];
        while (bitio.getUI8() != 0) {
            // 1 byte back
            bitio.incrementOffset(-1, 0);

            var obj = {};
            obj.TextRecordType = bitio.getUIBits(1);
            obj.StyleFlagsReserved = bitio.getUIBits(3);
            obj.StyleFlagsHasFont = bitio.getUIBits(1);
            obj.StyleFlagsHasColor = bitio.getUIBits(1);
            obj.StyleFlagsHasYOffset = bitio.getUIBits(1);
            obj.StyleFlagsHasXOffset = bitio.getUIBits(1);
            if (obj.StyleFlagsHasFont) {
                obj.FontId = bitio.getUI16();
            }

            if (obj.StyleFlagsHasColor) {
                if (tagType == 11) {
                    obj.TextColor = _this.rgb();
                } else {
                    obj.TextColor = _this.rgba();
                }
            }

            if (obj.StyleFlagsHasXOffset) {
                obj.XOffset = bitio.getUI16();
            }

            if (obj.StyleFlagsHasYOffset) {
                obj.YOffset = bitio.getUI16();
            }

            if (obj.StyleFlagsHasFont) {
                obj.TextHeight = bitio.getUI16();
            }

            obj.GlyphCount = bitio.getUI8();
            obj.GlyphEntries = _this.getGlyphEntries(
                obj.GlyphCount, GlyphBits, AdvanceBits
            );

            array[array.length] = obj;
        }

        return array;
    };

    /**
     * getGlyphEntries
     * @param count
     * @param GlyphBits
     * @param AdvanceBits
     * @returns {Array}
     */
    SwfTag.prototype.getGlyphEntries = function(count, GlyphBits, AdvanceBits)
    {
        var array = [];
        for (var i = count; i--;) {
            array[array.length] = {
                GlyphIndex: bitio.getUIBits(GlyphBits),
                GlyphAdvance: bitio.getSIBits(AdvanceBits)
            };
        }
        return array;
    };

    /**
     * parseDefineEditText
     * @param tagType
     */
    SwfTag.prototype.parseDefineEditText = function(tagType)
    {
        var _this = swftag;
        var obj = {};
        var isJis = true;

        obj.CharacterId = bitio.getUI16();
        obj.Bound = _this.rect();

        var flag1 = bitio.getUI8();
        obj.HasText = (flag1 >>> 7) & 1;
        obj.WordWrap = (flag1 >>> 6) & 1;
        obj.Multiline = (flag1 >>> 5) & 1;
        obj.Password = (flag1 >>> 4) & 1;
        obj.ReadOnly = (flag1 >>> 3) & 1;
        obj.HasTextColor = (flag1 >>> 2) & 1;
        obj.HasMaxLength = (flag1 >>> 1) & 1;
        obj.HasFont =  flag1 & 1;

        var flag2 = bitio.getUI8();
        obj.HasFontClass = (flag2 >>> 7) & 1;
        obj.AutoSize = (flag2 >>> 6) & 1;
        obj.HasLayout = (flag2 >>> 5) & 1;
        obj.NoSelect = (flag2 >>> 4) & 1;
        obj.Border = (flag2 >>> 3) & 1;
        obj.WasStatic = (flag2 >>> 2) & 1;
        obj.HTML = (flag2 >>> 1) & 1;
        obj.UseOutlines =  flag2 & 1;

        if (obj.HasFont) {
            obj.FontID = bitio.getUI16();
            var fontData = character[obj.FontID];
            isJis = (fontData.FontFlagsShiftJIS) ? true : false;

            if (obj.HasFontClass) {
                obj.FontClass = bitio.getDataUntil("\0");
            }
            obj.FontHeight = bitio.getUI16();
        }

        if (obj.HasTextColor) {
            obj.TextColor = _this.rgba();
        }

        if (obj.HasMaxLength) {
            obj.MaxLength = bitio.getUI16();
        }

        if (obj.HasLayout) {
            obj.Align = bitio.getUI8();
            obj.LeftMargin  = bitio.getUI16();
            obj.RightMargin = bitio.getUI16();
            obj.Indent = bitio.getUI16();
            obj.Leading = bitio.getUI16();
        }

        obj.VariableName = bitio.getDataUntil("\0", isJis) + '';
        obj.InitialText = '';
        if (obj.HasText) {
            var text = bitio.getDataUntil("\0", isJis);
            if (obj.HTML) {
                var span = _document.createElement('span');
                span.innerHTML = text;
                var tags = span.getElementsByTagName('font');
                if (tags.length) {
                    obj.InitialText = tags[0].innerHTML;
                }
            } else {
                obj.InitialText = text;
            }
        }

        character[obj.CharacterId] = {
            data: obj,
            tagType: tagType
        };
    };

    /**
     * parseDefineMorphShape
     * @param tagType
     */
    SwfTag.prototype.parseDefineMorphShape = function(tagType)
    {
        var _this = swftag;
        var obj = {};
        obj.tagType = tagType;
        obj.CharacterId = bitio.getUI16();

        obj.StartBounds = _this.rect();
        obj.EndBounds = _this.rect();

        if (tagType == 84) {
            obj.StartEdgeBounds = _this.rect();
            obj.EndEdgeBounds = _this.rect();
            obj.Reserved = bitio.getUIBits(6); // Must be 0
            obj.UsesNonScalingStrokes = bitio.getUIBits(1);
            obj.UsesScalingStrokes = bitio.getUIBits(1);
        }

        var offset = bitio.getUI32();
        var endOffset = bitio.byte_offset + offset;

        obj.MorphFillStyles = _this.fillStyleArray(tagType);
        obj.MorphLineStyles = _this.lineStyleArray(tagType);
        obj.StartEdges = _this.shapeWithStyle(tagType);

        if (bitio.byte_offset != endOffset) {
            bitio.byte_offset = endOffset;
        }
        obj.EndEdges = _this.shapeWithStyle(tagType);

        // fill1 control
        var records = obj.StartEdges.ShapeRecords;
        var EndRecords = obj.EndEdges.ShapeRecords;
        var length = records.length;
        var fillStart = false;
        var fillType = 0;
        var isFill1 = false;
        var isFill0 = false;
        var MoveX = 0;
        var MoveY = 0;
        var EndMoveX = 0;
        var EndMoveY = 0;
        var fillColorKey = 0;
        var diff = 0;
        var count = 0;
        var addRecodes = [];
        for (var i = 0; i < length; i++) {
            var endKey = i - diff;
            var EndRecord = EndRecords[endKey];
            if (EndRecord.StateMoveTo == 1) {
                EndMoveX = EndRecord.MoveX;
                EndMoveY = EndRecord.MoveY;
            }

            var recode = records[i];
            if (!recode.isChange && EndRecord.isChange) {
                diff--;
            }

            if (recode == 0 || recode.isChange == false) {
                continue;
            }

            // key set
            if (recode.StateFillStyle0 == 1 && recode.FillStyle0 > 0) {
                fillColorKey = recode.FillStyle0;
            }

            if (fillStart) {
                if (fillType == 0) {
                    fillType = 1;
                    if (recode.StateFillStyle0 == 0) {
                        recode.StateFillStyle1 = 1;
                        recode.FillStyle1 = fillColorKey;
                    }

                    recode.StateFillStyle0 = 1;
                    recode.FillStyle0 = 0;
                } else {
                    fillType = 0;
                    if (recode.StateFillStyle0 == 0) {
                        recode.StateFillStyle0 = 1;
                        recode.FillStyle0 = fillColorKey;
                    }

                    recode.StateFillStyle1 = 1;
                    recode.FillStyle1 = 0;
                }
            }

            if (isFill1) {
                fillType = 0;
                isFill1 = false;
            }

            if (recode.isChange && !EndRecord.isChange) {
                // add end
                if (recode.StateMoveTo == 1) {
                    addRecodes[endKey] = {
                        MoveX: EndMoveX,
                        MoveY: EndMoveY
                    };
                }
                diff++;
            }

            if (recode.StateMoveTo == 1) {
                MoveX = recode.MoveX;
                MoveY = recode.MoveY;
            }

            if (isFill0
                && recode.StateFillStyle0 == 1
                && recode.FillStyle0 > 0
            ) {
                isFill0 = false;
            }

            if (!isFill0
                && recode.StateFillStyle0 == 1
                && recode.FillStyle0 == 0
                && recode.StateMoveTo == 0
            ) {
                if (count == 2) {
                    fillType = 0;
                }

                if (fillType == 1 && count > 2) {
                    recode.MoveX = MoveX;
                    recode.MoveY = MoveY;
                    recode.StateMoveTo = 1;

                    recode.StateFillStyle1 = 1;
                    recode.FillStyle1 = fillColorKey;

                    // add end
                    addRecodes[endKey] = {
                        MoveX: EndMoveX,
                        MoveY: EndMoveY
                    };

                    isFill0 = true;
                } else {
                    recode.StateFillStyle1 = 1;
                    recode.FillStyle1 = 0;
                }
            }

            if (recode.StateLineStyle == 1 && recode.LineStyle > 0) {
                var key = recode.LineStyle - 1;
                var lineStyle = obj.MorphLineStyles.lineStyles[key];
                if (lineStyle.StartWidth == 0 && lineStyle.EndWidth == 0) {
                    recode.StateLineStyle = 1;
                    recode.LineStyle = 0;

                    if (recode.StateFillStyle0 == 0) {
                        recode.StateFillStyle1 = 1;
                        recode.FillStyle1 = fillColorKey;

                        recode.StateFillStyle0 = 1;
                        recode.FillStyle0 = 0;

                        fillType = 1;
                    }

                    isFill1 = true;
                    fillStart = true;
                } else {
                    fillStart = false;
                }
            }

            count++;
        }

        length = addRecodes.length;
        diff = 0;
        for (i = 0; i < length; i++) {
            if (!(i in addRecodes)) {
                continue;
            }

            var addRecode = addRecodes[i];
            EndRecords.splice(i + diff, 0, {
                MoveX: addRecode.MoveX,
                MoveY: addRecode.MoveY,
                StateFillStyle0: 0,
                StateFillStyle1: 0,
                StateLineStyle: 0,
                StateMoveTo: 1,
                StateNewStyles: 0,
                isChange: true
            });
            diff++;
        }

        character[obj.CharacterId] = obj;
    };

    /**
     * buildMorphShape
     * @param char
     * @param ratio
     * @returns {{data: *, Xmax: number, Xmin: number, Ymax: number, Ymin: number}}
     */
    SwfTag.prototype.buildMorphShape = function(char, ratio)
    {
        var _this = swftag;
        var per = (ratio == undefined) ? 0 : ratio / 65535;
        var startPer = 1 - per;
        var newShapeRecords = [];

        var morphLineStyles = char.MorphLineStyles;
        var lineStyles = morphLineStyles.lineStyles;
        var lineStyleCount = morphLineStyles.lineStyleCount;

        var morphFillStyles = char.MorphFillStyles;
        var fillStyles = morphFillStyles.fillStyles;
        var fillStyleCount = morphFillStyles.fillStyleCount;

        var StartEdges = char.StartEdges;
        var StartShapeRecords = StartEdges.ShapeRecords;

        var EndEdges = char.EndEdges;
        var EndShapeRecords = EndEdges.ShapeRecords;

        // 型
        var shapes = {
            NumFillBits: StartEdges.NumFillBits,
            NumLineBits: StartEdges.NumLineBits,
            ShapeRecords: [],
            lineStyles: {
                lineStyleCount: lineStyleCount,
                lineStyles: []
            },
            fillStyles: {
                fillStyleCount: fillStyleCount,
                fillStyles: []
            }
        };

        var position = {x:0, y:0};
        var len = StartShapeRecords.length;
        var diffStr = 0;
        var diffEnd = 0;
        for (var i = 0; i < len; i++) {
            if ((i+1) == len) {
                newShapeRecords[i] = 0;
                continue;
            }

            var newRecord = {};
            var StartRecord = StartShapeRecords[i - diffEnd];
            var EndRecord = EndShapeRecords[i - diffStr];
            if (StartRecord.isChange || EndRecord.isChange) {
                var MoveX = 0;
                var MoveY = 0;

                if (StartRecord.StateMoveTo == 1
                    && EndRecord.StateMoveTo == 1
                ) {
                    MoveX = StartRecord.MoveX * startPer + EndRecord.MoveX * per;
                    MoveY = StartRecord.MoveY * startPer + EndRecord.MoveY * per;
                    position.x = MoveX;
                    position.y = MoveY;
                } else if (!StartRecord.isChange) {
                    if (EndRecord.StateMoveTo == 1) {
                        MoveX = EndRecord.MoveX;
                        MoveY = EndRecord.MoveY;
                        position.x = MoveX;
                        position.y = MoveY;
                    }
                    diffEnd++;
                } else if (!EndRecord.isChange) {
                    if (StartRecord.StateMoveTo == 1) {
                        MoveX = StartRecord.MoveX;
                        MoveY = StartRecord.MoveY;
                        position.x = MoveX;
                        position.y = MoveY;
                    }
                    diffStr++;
                }

                newRecord = {
                    FillStyle0: StartRecord.FillStyle0,
                    FillStyle1: StartRecord.FillStyle1,
                    LineStyle: StartRecord.LineStyle,
                    MoveX: MoveX,
                    MoveY: MoveY,
                    StateFillStyle0: StartRecord.StateFillStyle0,
                    StateFillStyle1: StartRecord.StateFillStyle1,
                    StateLineStyle: StartRecord.StateLineStyle,
                    StateMoveTo: StartRecord.StateMoveTo,
                    StateNewStyles: StartRecord.StateNewStyles,
                    isChange: true
                };
            } else {
                var AnchorX = 0;
                var AnchorY = 0;
                var ControlX = 0;
                var ControlY = 0;

                var startAnchorX = StartRecord.AnchorX;
                var startAnchorY = StartRecord.AnchorY;
                var endAnchorX = EndRecord.AnchorX;
                var endAnchorY = EndRecord.AnchorY;

                var startControlX = StartRecord.ControlX;
                var startControlY = StartRecord.ControlY;
                var endControlX = EndRecord.ControlX;
                var endControlY = EndRecord.ControlY;

                if (per > 0 && per < 1
                    && StartRecord.isCurved != EndRecord.isCurved
                ) {
                    if (!StartRecord.isCurved) {
                        startAnchorX = StartRecord.AnchorX / 2;
                        startAnchorY = StartRecord.AnchorY / 2;
                        startControlX = startAnchorX;
                        startControlY = startAnchorY;
                    }

                    if (!EndRecord.isCurved) {
                        endAnchorX = EndRecord.AnchorX / 2;
                        endAnchorY = EndRecord.AnchorY / 2;
                        endControlX = endAnchorX;
                        endControlY = endAnchorY;
                    }
                }

                ControlX = startControlX * startPer + endControlX * per + position.x;
                ControlY = startControlY * startPer + endControlY * per + position.y;
                AnchorX = startAnchorX * startPer + endAnchorX * per + ControlX;
                AnchorY = startAnchorY * startPer + endAnchorY * per + ControlY;

                position.x = AnchorX;
                position.y = AnchorY;

                newRecord = {
                    AnchorX: AnchorX,
                    AnchorY: AnchorY,
                    ControlX: ControlX,
                    ControlY: ControlY,
                    isChange: false,
                    isCurved: (StartRecord.isCurved || EndRecord.isCurved)
                };
            }

            newShapeRecords[i] = newRecord;
        }
        shapes.ShapeRecords = newShapeRecords;
        for (var i = 0; i < lineStyleCount; i++) {
            var EndColor = lineStyles[i].EndColor;
            var StartColor = lineStyles[i].StartColor;
            var color = {
                R: _floor(StartColor.R * startPer + EndColor.R * per),
                G: _floor(StartColor.G * startPer + EndColor.G * per),
                B: _floor(StartColor.B * startPer + EndColor.B * per),
                A: StartColor.A * startPer + EndColor.A * per
            };

            var EndWidth = lineStyles[i].EndWidth;
            var StartWidth = lineStyles[i].StartWidth;
            shapes.lineStyles.lineStyles[i] = {
                Width: _floor(StartWidth * startPer + EndWidth * per),
                Color: color
            };
        }

        for (var i = 0; i < fillStyleCount; i++) {
            var EndColor = fillStyles[i].EndColor;
            var StartColor = fillStyles[i].StartColor;
            var color = {
                R: _floor(StartColor.R * startPer + EndColor.R * per),
                G: _floor(StartColor.G * startPer + EndColor.G * per),
                B: _floor(StartColor.B * startPer + EndColor.B * per),
                A: StartColor.A * startPer + EndColor.A * per
            };

            shapes.fillStyles.fillStyles[i] = {
                Color: color,
                fillStyleType: fillStyles[i].fillStyleType
            }
        }

        var EndBounds = char.EndBounds;
        var StartBounds = char.StartBounds;
        var bounds = {
            Xmax: StartBounds.Xmax * startPer + EndBounds.Xmax * per,
            Xmin: StartBounds.Xmin * startPer + EndBounds.Xmin * per,
            Ymax: StartBounds.Ymax * startPer + EndBounds.Ymax * per,
            Ymin: StartBounds.Ymin * startPer + EndBounds.Ymin * per
        };

        return {
            data: _this.vectorToCanvas(shapes),
            Xmax: bounds.Xmax,
            Xmin: bounds.Xmin,
            Ymax: bounds.Ymax,
            Ymin: bounds.Ymin
        };
    };

    /**
     * parseFrameLabel
     * @returns {{name: string, frame: number}}
     */
    SwfTag.prototype.parseFrameLabel = function()
    {
        return {
            name: bitio.getDataUntil("\0"),
            frame: 0
        };
    };

    /**
     * parseRemoveObject
     * @param tagType
     * @returns {*}
     */
    SwfTag.prototype.parseRemoveObject = function(tagType)
    {
        // RemoveObject
        if (tagType == 5) {
            return {
                CharacterId: bitio.getUI16(),
                Depth: bitio.getUI16()
            }
        }

        // RemoveObject2
        return {Depth: bitio.getUI16()}
    };

    /**
     * parseDefineButton
     * @param tagType
     * @param length
     * @returns {{}}
     */
    SwfTag.prototype.parseDefineButton = function(tagType, length)
    {
        var obj = {};
        obj.tagType = tagType;

        var _this = swftag;
        var endOffset = bitio.byte_offset + length;
        obj.ButtonId = bitio.getUI16();

        var ActionOffset = 0;
        if (tagType != 7) {
            var ReservedFlags = bitio.getUIBits(7);
            var TrackAsMenu = bitio.getUIBits(1);
            ActionOffset = bitio.getUI16();
        }

        obj.characters = _this.buttonCharacters();

        // actionScript
        if (tagType == 7) {
            obj.actions = _this.parseDoAction(length - bitio.byte_offset);
        } else if (ActionOffset > 0) {
            obj.actions = _this.buttonActions(length);
        }

        // set layer
        character[obj.ButtonId] = obj;
        if (bitio.byte_offset != endOffset) {
            bitio.byte_offset = endOffset;
        }

        return obj;
    };

    /**
     * buttonCharacters
     * @returns {Array}
     */
    SwfTag.prototype.buttonCharacters = function()
    {
        var characters = [];
        var _this = swftag;
        while (bitio.getUI8() != 0) {
            // 1 byte back
            bitio.incrementOffset(-1, 0);
            var record = _this.buttonRecord();
            var depth = record.Depth;
            if (!(record.Depth in characters)) {
                characters[depth] = [];
            }
            characters[depth].push(record);
        }

        return characters;
    };

    /**
     *
     * @returns {{}}
     */
    SwfTag.prototype.buttonRecord = function()
    {
        var _this = swftag;
        var obj = {};

        obj.ButtonReserved = bitio.getUIBits(2);
        obj.ButtonHasBlendMode = bitio.getUIBits(1);
        obj.ButtonHasFilterList = bitio.getUIBits(1);
        obj.ButtonStateHitTest = bitio.getUIBits(1);
        obj.ButtonStateDown = bitio.getUIBits(1);
        obj.ButtonStateOver = bitio.getUIBits(1);
        obj.ButtonStateUp = bitio.getUIBits(1);

        obj.CharacterId = bitio.getUI16();
        obj.Depth = bitio.getUI16();

        obj.PlaceFlagHasMatrix = 1;
        obj.Matrix = _this.matrix();

        obj.ColorTransform = _this.colorTransform();
        obj.PlaceFlagHasColorTransform
            = (obj.ColorTransform == undefined) ? 0 : 1;

        if (obj.ButtonHasBlendMode) {
            obj.BlendMode = bitio.getUI8();
        }
        if (obj.ButtonHasFilterList) {
            obj.FilterList = null;
        }

        obj.PlaceFlagHasRatio = 0;
        obj.PlaceFlagHasClipDepth = 0;

        obj.Sound = null;

        return obj;
    };

    /**
     * buttonActions
     * @param length
     * @returns {Array}
     */
    SwfTag.prototype.buttonActions = function(length)
    {
        var _this = swftag;
        var array = [];
        while (true) {
            var obj = {};
            var startOffset = bitio.byte_offset;

            obj.CondActionSize = bitio.getUI16();
            obj.CondIdleToOverDown = bitio.getUIBits(1);
            obj.CondOutDownToIdle = bitio.getUIBits(1);
            obj.CondOutDownToOverDown = bitio.getUIBits(1);
            obj.CondOverDownToOutDown = bitio.getUIBits(1);
            obj.CondOverDownToOverUp = bitio.getUIBits(1);
            obj.CondOverUpToOverDown = bitio.getUIBits(1);
            obj.CondOverUpToIdle = bitio.getUIBits(1);
            obj.CondIdleToOverUp = bitio.getUIBits(1);
            obj.CondKeyPress = bitio.getUIBits(7);
            obj.CondOverDownToIdle = bitio.getUIBits(1);

            // ActionScript
            var cacheOffset = bitio.byte_offset + 1;
            while (true) {
                var actionCode = bitio.getUI8();
                if (actionCode == 0) {
                    break;
                }

                var payload = null;
                if (actionCode >= 0x80) {
                    var payloadLength = bitio.getUI16();
                    payload = bitio.getData(payloadLength);
                }
            }

            var actionLength = bitio.byte_offset - cacheOffset;
            bitio.byte_offset = cacheOffset;
            obj.ActionScript = _this.parseDoAction(actionLength);

            array[array.length] = obj;
            if (obj.CondActionSize == 0) {
                break;
            }

            var o = bitio.byte_offset - obj.CondActionSize;
            if (startOffset != o) {
                bitio.byte_offset = o;
            }
        }

        return array;
    };

    /**
     * parsePlaceObject
     * @param tagType
     * @returns {{}}
     */
    SwfTag.prototype.parsePlaceObject = function(tagType, length)
    {
        var _this = swftag;
        var obj = {};
        obj.tagType = tagType;
        var startOffset = bitio.byte_offset;

        if (tagType == 4) {
            obj.CharacterId = bitio.getUI16();
            obj.Depth = bitio.getUI16();
            obj.Matrix = _this.matrix();
            obj.ColorTransform = _this.colorTransform();
        } else {
            var placeFlag = bitio.getUI8();
            obj.PlaceFlagHasClipActions = (placeFlag >> 7) & 0x01;
            obj.PlaceFlagHasClipDepth = (placeFlag >> 6) & 0x01;
            obj.PlaceFlagHasName = (placeFlag >> 5) & 0x01;
            obj.PlaceFlagHasRatio = (placeFlag >> 4) & 0x01;
            obj.PlaceFlagHasColorTransform = (placeFlag >> 3) & 0x01;
            obj.PlaceFlagHasMatrix = (placeFlag >> 2) & 0x01;
            obj.PlaceFlagHasCharacter = (placeFlag >> 1) & 0x01;
            obj.PlaceFlagMove =  placeFlag & 0x01;

            // PlaceObject3
            if (tagType == 70) {
                var Reserved = bitio.getUIBits(3);
                obj.PlaceFlagHasImage = bitio.getUIBits(1);
                obj.PlaceFlagHasClassName = bitio.getUIBits(1);
                obj.PlaceFlagHasCacheAsBitmap = bitio.getUIBits(1);
                obj.PlaceFlagHasBlendMode = bitio.getUIBits(1);
                obj.PlaceFlagHasFilterList = bitio.getUIBits(1);
            }

            obj.Depth = bitio.getUI16();

            if (obj.PlaceFlagHasClassName
                || (obj.PlaceFlagHasImage && obj.PlaceFlagHasCharacter)
            ) {
                obj.ClassName = bitio.getDataUntil("\0");
            }
            if (obj.PlaceFlagHasCharacter) {
                obj.CharacterId = bitio.getUI16();
            }
            if (obj.PlaceFlagHasMatrix) {
                obj.Matrix = _this.matrix();
            }
            if (obj.PlaceFlagHasColorTransform) {
                obj.ColorTransform = _this.colorTransform();
            }
            if (obj.PlaceFlagHasRatio) {
                obj.Ratio = bitio.getUI16();
            }
            if (obj.PlaceFlagHasName) {
                obj.Name = bitio.getDataUntil("\0");
            }
            if (obj.PlaceFlagHasClipDepth) {
                obj.ClipDepth = bitio.getUI16();
            }

            if (tagType == 70) {
                if (obj.PlaceFlagHasFilterList) {
                    obj.SurfaceFilterList = _this.getFilterList();
                }
                if (obj.PlaceFlagHasBlendMode) {
                    obj.BlendMode = bitio.getUI8();
                }
                if (obj.PlaceFlagHasCacheAsBitmap) {
                    obj.BitmapCache = bitio.getUI8();
                }
            }

            if (obj.PlaceFlagHasClipActions) {
                var Reserved = bitio.getUI16();
                obj.AllEventFlags = _this.parseClipEventFlags();

                var endLength = startOffset + length;
                var actionRecords = [];
                var endFlag;
                while (bitio.byte_offset <= endLength) {
                    actionRecords[actionRecords.length] =
                        _this.parseClipActionRecord(tagType);

                    if (version <= 5) {
                        endFlag = bitio.getUI16();
                    } else {
                        endFlag = bitio.getUI32();
                    }

                    if (endFlag == 0) {
                        break;
                    }
                }
                obj.ClipActionRecords = actionRecords;
            }
        }

        bitio.byteAlign();
        bitio.byte_offset = startOffset + length;
        return obj;
    };

    /**
     * parseClipActionRecord
     * @returns {{}}
     */
    SwfTag.prototype.parseClipActionRecord = function(tagType)
    {
        var _this = swftag;
        var obj = {};
        obj.EventFlags = _this.parseClipEventFlags();
        var ActionRecordSize = bitio.getUI32();
        if (obj.EventFlags.ClipEventKeyPress) {
            obj.KeyCode = bitio.getUI8();
        }
        obj.Actions = _this.parseDoAction(ActionRecordSize);
        return obj;
    };

    /**
     * parseClipEventFlags
     * @returns {{}}
     */
    SwfTag.prototype.parseClipEventFlags = function()
    {
        var obj = {};
        obj.ClipEventKeyUp = bitio.getUIBits(1);
        obj.ClipEventKeyDown = bitio.getUIBits(1);
        obj.ClipEventMouseUp = bitio.getUIBits(1);
        obj.ClipEventMouseDown = bitio.getUIBits(1);
        obj.ClipEventMouseMove = bitio.getUIBits(1);
        obj.ClipEventUnload = bitio.getUIBits(1);
        obj.ClipEventEnterFrame = bitio.getUIBits(1);
        obj.ClipEventLoad = bitio.getUIBits(1);
        obj.ClipEventDragOver = bitio.getUIBits(1);
        obj.ClipEventRollOut = bitio.getUIBits(1);
        obj.ClipEventRollOver = bitio.getUIBits(1);
        obj.ClipEventReleaseOutside = bitio.getUIBits(1);
        obj.ClipEventRelease = bitio.getUIBits(1);
        obj.ClipEventPress = bitio.getUIBits(1);
        obj.ClipEventInitialize = bitio.getUIBits(1);
        obj.ClipEventData = bitio.getUIBits(1);
        if (version >= 6) {
            var Reserved = bitio.getUIBits(5);
            obj.ClipEventConstruct = bitio.getUIBits(1);
            obj.ClipEventKeyPress = bitio.getUIBits(1);
            obj.ClipEventDragOut = bitio.getUIBits(1);
            Reserved = bitio.getUIBits(8);
        }
        return obj;
    };

    /**
     * getFilterList
     * @returns {Array}
     */
    SwfTag.prototype.getFilterList = function()
    {
        var _this = swftag;
        var result = [];
        var _getFilter = _this.getFilter;
        var NumberOfFilters = bitio.getUI8();
        for (var i = 0; i < NumberOfFilters; i++) {
            result[i] = _getFilter();
        }
        return result;
    };

    /**
     * getFilter
     */
    SwfTag.prototype.getFilter = function()
    {
        var _this = swftag;
        var obj = {};
        obj.FilterID = bitio.getUI8();
        var filter;
        switch (obj.FilterID) {
            case 0:
                filter = _this.dropShadowFilter();
                break;
            case 1:
                filter = _this.blurFilter();
                break;
            case 2:
                filter = _this.glowFilter();
                break;
            case 3:
                filter = _this.bevelFilter();
                break;
            case 4:
                filter = _this.gradientGlowFilter();
                break;
            case 5:
                filter = _this.convolutionFilter();
                break;
            case 6:
                filter = _this.colorMatrixFilter();
                break;
            case 7:
                filter = _this.gradientBevelFilter();
                break;
        }
        obj.Filter = filter;
        return obj;
    };

    /**
     * dropShadowFilter
     * @returns {{}}
     */
    SwfTag.prototype.dropShadowFilter = function()
    {
        var _this = swftag;
        var obj = {};
        obj.color = _this.rgba();
        obj.BlurX = bitio.getUI32();
        obj.BlurY = bitio.getUI32();
        obj.Angle = bitio.getUI32();
        obj.Distance = bitio.getUI32();
        obj.Strength = bitio.getUI8();
        obj.InnerShadow = bitio.getUIBits(1);
        obj.Knockout = bitio.getUIBits(1);
        obj.CompositeSource = bitio.getUIBits(1);
        obj.Passes = bitio.getUIBits(5);
        return obj;
    };

    /**
     * blurFilter
     * @returns {{}}
     */
    SwfTag.prototype.blurFilter = function()
    {
        var obj = {};
        obj.BlurX = bitio.getUI32();
        obj.BlurY = bitio.getUI32();
        obj.Passes = bitio.getUIBits(5);
        var Reserved = bitio.getUIBits(3);
        return obj
    };

    /**
     * glowFilter
     * @returns {{}}
     */
    SwfTag.prototype.glowFilter = function()
    {
        var _this = swftag;
        var obj = {};
        obj.color = _this.rgba();
        obj.BlurX = bitio.getUI32();
        obj.BlurY = bitio.getUI32();
        obj.Strength = bitio.getUI8();
        obj.InnerGlow = bitio.getUIBits(1);
        obj.Knockout = bitio.getUIBits(1);
        obj.CompositeSource = bitio.getUIBits(1);
        obj.Passes = bitio.getUIBits(5);
        return obj;
    };

    /**
     * bevelFilter
     * @returns {{}}
     */
    SwfTag.prototype.bevelFilter = function()
    {
        var _this = swftag;
        var obj = {};
        obj.ShadowColor = _this.rgba();
        obj.HighlightColor = _this.rgba();
        obj.BlurX = bitio.getUI32();
        obj.BlurY = bitio.getUI32();
        obj.Angle = bitio.getUI32();
        obj.Distance = bitio.getUI32();
        obj.Strength = bitio.getUI8();
        obj.InnerShadow = bitio.getUIBits(1);
        obj.Knockout = bitio.getUIBits(1);
        obj.CompositeSource = bitio.getUIBits(1);
        obj.OnTop = bitio.getUIBits(1);
        obj.Passes = bitio.getUIBits(4);
        return obj;
    };

    /**
     * gradientGlowFilter
     * @returns {{}}
     */
    SwfTag.prototype.gradientGlowFilter = function()
    {
        var _this = swftag;
        var obj = {};
        var NumColors = bitio.getUI8();

        var colors = [];
        for (; NumColors--;) {
            colors[colors.length] = {
                GradientColors: _this.rgba(),
                GradientRatio: bitio.getUI8()
            };
        }

        obj.Colors = colors;
        obj.BlurX = bitio.getUI32();
        obj.BlurY = bitio.getUI32();
        obj.Angle = bitio.getUI32();
        obj.Distance = bitio.getUI32();
        obj.Strength = bitio.getUI8();
        obj.InnerShadow = bitio.getUIBits(1);
        obj.Knockout = bitio.getUIBits(1);
        obj.CompositeSource = bitio.getUIBits(1);
        obj.OnTop = bitio.getUIBits(1);
        obj.Passes = bitio.getUIBits(4);
        return obj;
    };

    /**
     * convolutionFilter
     * @returns {{}}
     */
    SwfTag.prototype.convolutionFilter = function()
    {
        var _this = swftag;
        var obj = {};
        obj.MatrixX = bitio.getUI8();
        obj.MatrixY = bitio.getUI8();
        obj.Divisor = bitio.getUI32();
        obj.Bias = bitio.getUI32();

        var count = obj.MatrixX * obj.MatrixY;
        var MatrixArr = [];
        for (; count--;) {
            MatrixArr[MatrixArr.length] = bitio.getUI32();
        }
        obj.DefaultColor = _this.rgba();
        var Reserved = bitio.getUIBits(6);
        obj.Clamp = bitio.getUIBits(1);
        obj.PreserveAlpha = bitio.getUIBits(1);

        return obj;
    };

    /**
     * colorMatrixFilter
     * @returns {{}}
     */
    SwfTag.prototype.colorMatrixFilter = function()
    {
        var obj = {};
        var MatrixArr = [];
        for (var i = 0; i < 20; i++) {
            MatrixArr[MatrixArr.length] = bitio.getUI32();
        }
        return obj;
    };

    /**
     * gradientBevelFilter
     * @returns {{}}
     */
    SwfTag.prototype.gradientBevelFilter = function()
    {
        var _this = swftag;
        var obj = {};
        var NumColors = bitio.getUI8();
        var colors = [];
        for (; NumColors--;) {
            colors[colors.length] = {
                GradientColors: _this.rgba(),
                GradientRatio: bitio.getUI8()
            };
        }

        obj.Colors = colors;
        obj.BlurX = bitio.getUI32();
        obj.BlurY = bitio.getUI32();
        obj.Angle = bitio.getUI32();
        obj.Distance = bitio.getUI32();
        obj.Strength = bitio.getUI8();
        obj.InnerShadow = bitio.getUIBits(1);
        obj.Knockout = bitio.getUIBits(1);
        obj.CompositeSource = bitio.getUIBits(1);
        obj.OnTop = bitio.getUIBits(1);
        obj.Passes = bitio.getUIBits(4);

        return obj;
    };

    /**
     * colorTransform
     * @returns {Array}
     */
    SwfTag.prototype.colorTransform = function()
    {
        var obj = {};
        bitio.byteAlign();
        var first6bits = bitio.getUIBits(6);
        var HasAddTerms = first6bits >> 5;
        var HasMultiTerms = (first6bits >> 4) & 1;
        var nbits = first6bits & 0x0f;

        var RedMultiTerm = 1;
        var GreenMultiTerm = 1;
        var BlueMultiTerm = 1;
        var AlphaMultiTerm = 1;
        if (HasMultiTerms) {
            RedMultiTerm = bitio.getSIBits(nbits) / 256;
            GreenMultiTerm = bitio.getSIBits(nbits) / 256;
            BlueMultiTerm = bitio.getSIBits(nbits) / 256;
            AlphaMultiTerm = bitio.getSIBits(nbits) / 256;
        }

        var RedAddTerm = 0;
        var GreenAddTerm = 0;
        var BlueAddTerm = 0;
        var AlphaAddTerm = 0;
        if (HasAddTerms) {
            RedAddTerm = bitio.getSIBits(nbits);
            GreenAddTerm = bitio.getSIBits(nbits);
            BlueAddTerm = bitio.getSIBits(nbits);
            AlphaAddTerm = bitio.getSIBits(nbits);
        }
        return [
            RedMultiTerm,
            GreenMultiTerm,
            BlueMultiTerm,
            AlphaMultiTerm,
            RedAddTerm,
            GreenAddTerm,
            BlueAddTerm,
            AlphaAddTerm
        ];
    };

    /**
     * parseDefineSprite
     * @param dataLength
     */
    SwfTag.prototype.parseDefineSprite = function(dataLength)
    {
        var _this = swftag;
        var characterId = bitio.getUI16();
        var FrameCount = bitio.getUI16();
        character[characterId] = _this.parseTags(dataLength, characterId);
    };

    /**
     * parseDoAction
     * @param length
     * @returns {ActionScript}
     */
    SwfTag.prototype.parseDoAction = function(length)
    {
        return new ActionScript(bitio.getData(length));
    };

    /**
     * parseDoInitAction
     * @param length
     */
    SwfTag.prototype.parseDoInitAction = function(length)
    {
        var spriteId = bitio.getUI16();
        initActions[spriteId] = this.parseDoAction(length - 2);
    };

    /**
     * parseDefineSceneAndFrameLabelData
     * @returns {{}}
     */
    SwfTag.prototype.parseDefineSceneAndFrameLabelData = function ()
    {
        var obj = {};
        obj.SceneCount = bitio.getEncodedU32();

        obj.sceneInfo = [];
        for (var i = 0; i < obj.SceneCount; i++) {
            obj.sceneInfo[i] = {
                offset: bitio.getEncodedU32(),
                name: _decodeURIComponent(bitio.getDataUntil('\0'))
            };
        }

        obj.FrameLabelCount = bitio.getEncodedU32();

        obj.frameInfo = [];
        for (var i = 0; i < obj.FrameLabelCount; i++) {
            obj.frameInfo[i] = {
                num: bitio.getEncodedU32(),
                label: _decodeURIComponent(bitio.getDataUntil('\0'))
            };
        }

        return obj;
    };

    /**
     * parseSoundStreamHead
     * @param tagType
     * @returns {{}}
     */
    SwfTag.prototype.parseSoundStreamHead = function(tagType)
    {
        var obj = {};
        obj.Reserved = bitio.getUIBits(4);

        // 0 = 5.5kHz, 1 = 11kHz, 2 = 22kHz, 3 = 44kHz
        obj.PlaybackSoundRate = bitio.getUIBits(2);

        // 0 = 8-bit, 1 = 16-bit
        obj.PlaybackSoundSize = bitio.getUIBits(1);

        // 0 = Mono, 1 = Stereo
        obj.PlaybackSoundType = bitio.getUIBits(1);

        // 0 = Uncompressed(native-endian)
        // 1 = ADPCM
        // 2 = MP3
        // 3 = Uncompressed(little-endian)
        // 4 = Nellymoser 16 kHz
        // 5 = Nellymoser 8 kHz
        // 6 = Nellymoser
        // 11 = Speex
        obj.StreamSoundCompression = bitio.getUIBits(4);

        // 0 = 5.5kHz, 1 = 11kHz, 2 = 22kHz, 3 = 44kHz
        obj.StreamSoundRate = bitio.getUIBits(2);

        // 0 = 8-bit, 1 = 16-bit
        obj.StreamSoundSize = bitio.getUIBits(1);

        // 0 = Mono, 1 = Stereo
        obj.StreamSoundType = bitio.getUIBits(1);

        obj.StreamSoundSampleCount = bitio.getUI16();

        if (obj.StreamSoundCompression == 2) {
            obj.LatencySeek = bitio.getSIBits(2);
        }

        return obj;
    };

    /**
     * parseDoABC
     * @param tagType
     * @param length
     * @returns {{}}
     */
    SwfTag.prototype.parseDoABC = function(tagType, length)
    {
        var obj = {};
        obj.Flags = bitio.getUI32();
        obj.Name = bitio.getDataUntil('\0');
        obj.ABCData = null;
        return obj;
    };

    /**
     * parseSymbolClass
     * @returns {{}}
     */
    SwfTag.prototype.parseSymbolClass = function()
    {
        var obj = {};
        obj.NumSymbols = bitio.getUI16();

        obj.class2tag = {
            symbols: []
        };
        for (var i = 0; i < obj.NumSymbols; i++) {
            var tagId = bitio.getUI16();
            var name = bitio.getDataUntil('\0');
            obj.class2tag.symbols[i] = {
                tag: tagId,
                name: name
            }

            if (tagId == 0) {
                obj.class2tag.topLevelClass = name;
                continue;
            }
        }

        return obj;
    };

    /**
     * parseDefineSound
     * @param tagType
     * @param length
     */
    SwfTag.prototype.parseDefineSound = function (tagType, length)
    {
        var obj = {};
        var startOffset = bitio.byte_offset;
        obj.tagType = tagType;
        obj.SoundId = bitio.getUI16();
        obj.SoundFormat = bitio.getUIBits(4);
        obj.SoundRate = bitio.getUIBits(2);
        obj.SoundSize = bitio.getUIBit();
        obj.SoundType = bitio.getUIBit();
        obj.SoundSampleCount = bitio.getUI32();

        var sub = bitio.byte_offset - startOffset;
        var dataLength = length - sub;
        var data = bitio.getData(dataLength);
        var SoundData = '';
        for (var i = 0; i < dataLength; i++) {
            SoundData += _fromCharCode(data[i]);
        }
        bitio.byte_offset = startOffset + length;

        var mimeType = '';
        switch (obj.SoundFormat) {
            case 0:
            case 3:
                mimeType = 'wav';
                break;
            case 1:
                mimeType = 'adpcm';
                break;
            case 2:
                mimeType = 'mp3';
                break;
            case 4:
            case 5:
            case 6:
                mimeType = 'nellymoser';
                break;
            case 11:
                mimeType = 'speex';
                break;
        }

        obj.base64 = 'data:audio/'+ mimeType +';base64,' + window.btoa(SoundData);
        sounds[obj.SoundId] = obj;
    };

    /**
     * parseStartSound
     * @param tagType
     */
    SwfTag.prototype.parseStartSound = function(tagType)
    {
        var _this = swftag;
        var obj = {};
        obj.tagType = tagType;
        obj.SoundId = bitio.getUI16();
        if (tagType == 89) {
            obj.SoundClassName = bitio.getDataUntil('\0');
        }

        obj.SoundInfo = _this.parseSoundInfo();
        character[obj.SoundId] = obj;

        var sound = sounds[obj.SoundId];
        var audio = new _Audio();
        audio.onload = function()
        {
            this.load();
            this.preload = 'auto';
            this.autoplay = false;
            this.loop = false;
        };
        audio.src = sound.base64;

        loadSounds[loadSounds.length] = audio;

        return {
            SoundId: obj.SoundId,
            Audio: audio,
            tagType: tagType
        };
    };

    /**
     * parseDefineButtonSound
     */
    SwfTag.prototype.parseDefineButtonSound = function()
    {
        var buttonId = bitio.getUI16();
        var ButtonSoundChar0 = bitio.getUI16();
        var ButtonSoundChar1 = bitio.getUI16();
        var ButtonSoundChar2 = bitio.getUI16();
        var ButtonSoundChar3 = bitio.getUI16();

        var btnObj = character[buttonId];
        if (btnObj != undefined) {
            var characters = btnObj.characters;
            var length = characters.length;
            for (var depth = 1; depth < length; depth++) {
                if (!(depth in characters)) {
                    continue;
                }

                var tags = characters[depth];
                var tLen = tags.length;
                for (var idx = 0; idx < tLen; idx++) {
                    if (!(idx in tags)) {
                        continue;
                    }

                    var tag = tags[idx];
                    if (tag.ButtonStateHitTest && ButtonSoundChar3) {
                        var sound = sounds[ButtonSoundChar3];
                        var audio = new _Audio();
                        audio.onload = function()
                        {
                            this.load();
                            this.preload = 'auto';
                            this.autoplay = false;
                            this.loop = false;
                        };
                        audio.src = sound.base64;
                        loadSounds[loadSounds.length] = audio;
                        tag.Sound = audio;
                    }
                }
            }
        }
    };

    /**
     * parseSoundInfo
     * @returns {{}}
     */
    SwfTag.prototype.parseSoundInfo = function()
    {
        var obj = {};
        obj.Reserved = bitio.getUIBits(2);
        obj.SyncStop = bitio.getUIBit();
        obj.SyncNoMultiple = bitio.getUIBit();
        obj.HasEnvelope = bitio.getUIBit();
        obj.HasLoops = bitio.getUIBit();
        obj.HasOutPoint = bitio.getUIBit();
        obj.HasInPoint = bitio.getUIBit();

        if (obj.HasInPoint) {
            obj.InPoint = bitio.getUI32();
        }

        if (obj.HasOutPoint) {
            obj.OutPoint = bitio.getUI32();
        }

        if (obj.HasLoops) {
            obj.LoopCount = bitio.getUI16();
        }

        if (obj.HasEnvelope) {
            obj.EnvPoints = bitio.getUI8();
            obj.EnvelopeRecords = [];
            for (var i = 0; i < obj.EnvPoints; i++) {
                obj.EnvelopeRecords[i] = {
                    Pos44: bitio.getUI32(),
                    LeftLevel: bitio.getUI16(),
                    RightLevel: bitio.getUI16()
                };
            }
        }

        return obj;
    };

    /**
     * parseDefineFontAlignZones
     * @param tagType
     * @param length
     */
    SwfTag.prototype.parseDefineFontAlignZones = function(tagType, length)
    {
        var obj = {};
        obj.FontId = bitio.getUI16();
        obj.CSMTableHint = bitio.getUIBits(2);
        var Reserved = bitio.getUIBits(6);

        var tag = character[obj.FontId];
        var NumGlyphs = tag.NumGlyphs;
        var ZoneTable = [];
        for (var i = 0; i < NumGlyphs; i++) {
            var NumZoneData  = bitio.getUI8();
            var ZoneData = [];
            for (var idx = 0; idx < NumZoneData; idx++) {
                ZoneData[idx] = {
                    AlignmentCoordinate: bitio.getFloat16(),
                    Range: bitio.getFloat16()
                }
            }

            Reserved = bitio.getUIBits(6);
            ZoneTable[i] = {
                ZoneData: ZoneData,
                ZoneMaskY: bitio.getUIBits(1),
                ZoneMaskX: bitio.getUIBits(1)
            }
        }

        bitio.byteAlign();
        obj.ZoneTable = ZoneTable;
        console.log(obj);
    };

    /**
     *
     * @param tagType
     * @param length
     */
    SwfTag.prototype.parseCSMTextSettings = function(tagType, length)
    {
        var obj = {};
        obj.tagType = tagType;
        obj.TextID = bitio.getUI16();
        obj.UseFlashType = bitio.getUIBits(2);
        obj.GridFit = bitio.getUIBits(3);
        var Reserved = bitio.getUIBits(3);
        obj.Thickness = bitio.getUI32();
        obj.Sharpness = bitio.getUI32();
        Reserved = bitio.getUI8();
        character[obj.TextID] = obj;
    };

    /**
     * ActionScript
     * @param data
     * @constructor
     */
    var ActionScript = function (data)
    {
        this.length = data.length;
        this.bitio = new BitIO();
        this.bitio.setData(data);
        this.constantPool = [];
        this.register = [];
        this.params = [];
        this.pBitio = new BitIO();
    };

    /**
     * execute
     * @param mc
     * @returns {*}
     */
    ActionScript.prototype.execute = function(mc)
    {
        // init action
        var characterId = mc.characterId;
        var _this = this;
        var isEnd = false;
        var stack = [];
        var bitio = _this.bitio;
        var movieClip = mc;
        var _execute = _this.execute;

        var pBitio = _this.pBitio;
        pBitio.setOffset(0, 0);

        if (characterId in initActions) {
            var initAction = initActions[characterId];
            _execute.call(initAction, mc);
        }

        // 開始
        bitio.setOffset(0, 0);
        while (bitio.byte_offset < _this.length) {
            var actionCode = _this.bitio.getUI8();
            var payload = null;
            if (actionCode >= 0x80) {
                var payloadLength = bitio.getUI16();
                payload = bitio.getData(payloadLength);
            }

            switch (actionCode) {
                // ********************************************
                // SWF 3
                // ********************************************
                // GotoFrame
                case 0x81:
                    if (movieClip != null) {
                        pBitio.setData(payload);
                        pBitio.setOffset(0, 0);

                        var frame = _floor(pBitio.getUI16()) + 1;
                        movieClip.stop();
                        movieClip.setNextFrame(frame);
                    }

                    break;
                // NextFrame
                case 0x04:
                    if (movieClip != null) {
                        movieClip.nextFrame();
                    }

                    break;
                // PreviousFrame
                case 0x05:
                    if (movieClip != null) {
                        movieClip.previousFrame();
                    }

                    break;
                // Play
                case 0x06:
                    if (movieClip != null) {
                        movieClip.play();
                    }

                    break;
                // Stop
                case 0x07:
                    if (movieClip != null) {
                        movieClip.stop();
                    }

                    break;
                // ToggleQuality
                case 0x08:
                    // JavaScriptなので使わない
                    break;
                // StopSounds
                case 0x09:
                    if (movieClip != null) {
                        movieClip.stopAllSounds();
                    }

                    break;
                // WaitForFrame
                case 0x8A:
                    console.log('WaitForFrame');
                    if (movieClip != null) {
                        pBitio.setData(payload);
                        pBitio.setOffset(0, 0);

                        var frame = pBitio.getUI16();
                        var skipCount = pBitio.getUI8();
                        if (movieClip.getFrame() == frame) {
                            movieClip.stop();
                        } else {

                        }
                    }

                    break;
                case 0x8B: // SetTarget
                    pBitio.setData(payload);
                    pBitio.setOffset(0, 0);

                    var targetName = pBitio.getDataUntil("\0");
                    if (targetName != '') {
                        if (movieClip == null) {
                            movieClip = mc;
                        }
                        movieClip = movieClip.getMovieClip(targetName);
                    } else {
                        movieClip = mc;
                    }

                    break;
                // GoToLabel
                case 0x8C:
                    pBitio.setData(payload);
                    pBitio.setOffset(0, 0);

                    if (movieClip != null) {
                        var label = pBitio.getDataUntil("\0");
                        var frame = movieClip.getLabel(label);

                        movieClip.stop();
                        if (typeof frame == 'number') {
                            movieClip.setNextFrame(frame);
                        }
                    }

                    break;
                // GetUrl
                case 0x83:
                    var len = payload.length - 1;
                    var urls = [[]];
                    var idx = 0;
                    for (var i = 0; i < len; i++) {
                        var str = _fromCharCode(payload[i]);
                        if (payload[i] == 0) {
                            idx++;
                            urls[idx] = [];
                        }
                        urls[idx] += str;
                    }

                    var urlString = urls[0];
                    var splitUrl = urlString.split('?');
                    var query = '';

                    // 分解してチェック
                    if (2 in splitUrl) {
                        var urlString = splitUrl[0];
                        urlString += '?' + splitUrl[1];
                        var paramLength = splitUrl.length;
                        for (var i = 2; i < paramLength; i++) {
                            urlString += '&' + splitUrl[i];
                        }
                    }

                    if (urls.length > 1) {
                        var level = _parseFloat(urls[1].substr(7));
                        var xmlHttpRequest = new XMLHttpRequest();
                        xmlHttpRequest.open('GET', urlString);
                        xmlHttpRequest.overrideMimeType(
                            'text/plain; charset=x-user-defined'
                        );
                        xmlHttpRequest.send(null);
                        xmlHttpRequest.onreadystatechange = function()
                        {
                            var readyState = xmlHttpRequest.readyState;
                            if (readyState == 4) {
                                var status = xmlHttpRequest.status;
                                if (status == 200) {
                                    var mc = new MovieClip();
                                    mc.characterId = '';
                                    if (level == 0) {
                                        mc.characterId = 0;
                                    }

                                    parse(xmlHttpRequest.responseText, mc);

                                    // 入れ替え
                                    if (level == 0) {
                                        player.parent = mc;
                                        loaded();
                                    } else {
                                        var parent = movieClip.getParent();
                                        if (parent == null) {
                                            parent = player.parent;
                                        }
                                        mc.setParent(parent);
                                        mc.setLevel(level);
                                        var addTags = movieClip.getAddTags();
                                        addTags[level] = mc;
                                    }

                                    cacheStore.reset();
                                } else {
                                    return 0;
                                }
                            }
                        }
                    } else {
                        var func = new Function(
                            "location.href = '"+ urlString +"';"
                        );
                        func();
                    }

                    break;

                // ********************************************
                // SWF 4
                // ********************************************

                // 算術演算 ***********************************
                // Add
                case 0x0A:
                    var a = _parseFloat(stack.pop());
                    var b = _parseFloat(stack.pop());

                    // 整数に置き換え
                    if (_isNaN(a)) {
                        a = 0;
                    }
                    if (_isNaN(b)) {
                        b = 0;
                    }

                    stack[stack.length] = a+b;

                    break;
                // Subtract
                case 0x0B:
                    var a = _parseFloat(stack.pop());
                    var b = _parseFloat(stack.pop());
                    // 整数に置き換え
                    if (_isNaN(a)) {
                        a = 0;
                    }
                    if (_isNaN(b)) {
                        b = 0;
                    }
                    stack[stack.length] = b-a;

                    break;
                // Multiply
                case 0x0C:
                    var a = _parseFloat(stack.pop());
                    var b = _parseFloat(stack.pop());
                    // 整数に置き換え
                    if (_isNaN(a)) {
                        a = 0;
                    }
                    if (_isNaN(b)) {
                        b = 0;
                    }

                    stack[stack.length] = a*b;

                    break;
                // Divide
                case 0x0D:
                    var a = _parseFloat(stack.pop());
                    var b = _parseFloat(stack.pop());
                    // 整数に置き換え
                    if (_isNaN(a)) {
                        a = 0;
                    }
                    if (_isNaN(b)) {
                        b = 0;
                    }

                    stack[stack.length] = b/a;

                    break;

                // 数値比較 ***********************************
                // Equals
                case 0x0E:
                    var a = _parseFloat(stack.pop());
                    var b = _parseFloat(stack.pop());

                    // 整数に置き換え
                    if (_isNaN(a)) {
                        a = 0;
                    }
                    if (_isNaN(b)) {
                        b = 0;
                    }

                    stack[stack.length] = (a == b) ? 1 : 0;

                    break;
                // Less
                case 0x0F:
                    var a = _parseFloat(stack.pop());
                    var b = _parseFloat(stack.pop());

                    // 整数に置き換え
                    if (_isNaN(a)) {
                        a = 0;
                    }
                    if (_isNaN(b)) {
                        b = 0;
                    }

                    stack[stack.length] = (b < a) ? 1 : 0;

                    break;

                // 論理演算 ***********************************
                // And
                case 0x10:
                    var a = _parseFloat(stack.pop());
                    var b = _parseFloat(stack.pop());


                    // 整数に置き換え
                    if (_isNaN(a)) {
                        a = 0;
                    }
                    if (_isNaN(b)) {
                        b = 0;
                    }

                    var boolInt = (a != 0 && b != 0) ? 1 : 0;
                    stack[stack.length] = boolInt;

                    break;
                // Or
                case 0x11:
                    var a = _parseFloat(stack.pop());
                    var b = _parseFloat(stack.pop());

                    // 整数に置き換え
                    if (_isNaN(a)) {
                        a = 0;
                    }
                    if (_isNaN(b)) {
                        b = 0;
                    }

                    stack[stack.length] = (a != 0 || b != 0) ? 1 : 0;

                    break;
                // Not
                case 0x12:
                    var value = _parseFloat(stack.pop());
                    // 整数に置き換え
                    if (_isNaN(value)) {
                        value = 0;
                    }

                    stack[stack.length] = (value == 0) ? 1 : 0;
                    break;

                // 文字列操作 ***********************************
                // StringEquals
                case 0x13:
                    var a = stack.pop();
                    var b = stack.pop();
                    stack[stack.length] = (b == a) ? 1 : 0;

                    break;
                case 0x14: // StringLength
                case 0x31: // MBStringLength
                    var string = stack.pop() + '';
                    var src = _escape(string.toString());
                    var length = 0;
                    var sLen = src.length;
                    for(i = 0; i < sLen; i++, length++){
                        if(src.charAt(i) == "%"){
                            if(src.charAt(++i) == "u"){
                                i += 3;
                                length++;
                            }
                            i++;
                        }
                    }
                    stack[stack.length] = length;

                    break;
                // StringAdd
                case 0x21:
                    var a = stack.pop();
                    if (a == null) {
                        a = '';
                    }

                    var b = stack.pop();
                    if (b == null) {
                        b = '';
                    }

                    stack[stack.length] = b +''+ a;

                    break;
                case 0x15:// StringExtract
                case 0x35:// MBStringExtract
                    var count = stack.pop();
                    var index = stack.pop() - 1;
                    if (index < 0) {
                        index = 0;
                    }

                    var string = stack.pop() + '';
                    if (count < 0) {
                        var str = string.substr(index);
                    } else {
                        var str = string.substr(index, count);
                    }

                    stack[stack.length] = str;

                    break;
                // StringLess
                case 0x29:
                    var a = stack.pop();
                    var b = stack.pop();
                    stack[stack.length] = (b < a) ? 1 : 0;
                    break;

                // スタック操作 ***********************************
                // Pop
                case 0x17:
                    stack.pop();
                    break;
                // Push
                case 0x96:
                    pBitio.setData(payload);
                    pBitio.setOffset(0, 0);

                    while (pBitio.byte_offset < payloadLength) {
                        var type = pBitio.getUI8();
                        switch (type) {
                            // String
                            case 0:
                                var string = pBitio.getDataUntil("\0");
                                if (string == '') {
                                    string = null;
                                }
                                stack[stack.length] = string;
                                break;
                            // Float
                            case 1:
                                stack[stack.length] = pBitio.getFloat32();
                                break;
                            // null
                            case 2:
                                stack[stack.length] = null;
                                break;
                            // undefined
                            case 3:
                                stack[stack.length] = undefined;
                                break;
                            // RegisterNumber
                            case 4:
                                stack[stack.length] = this.params[pBitio.getUI8()];
                                break;
                            // Boolean
                            case 5:
                                stack[stack.length] = (pBitio.getUI8());
                                break;
                            // Double
                            case 6:
                                stack[stack.length] = pBitio.getFloat64();
                                break;
                            // Integer
                            case 7:
                                stack[stack.length] = pBitio.getUI32();
                                break;
                            // Constant8
                            case 8:
                                stack[stack.length] = this.constantPool[pBitio.getUI8()];
                                break;
                            // Constant16
                            case 9:
                                stack[stack.length] = this.constantPool[pBitio.getUI16()];
                                break;
                            default:
                                break;
                        }
                    }

                    break;

                // 型変換 ***********************************
                // AsciiToChar
                case 0x33:
                    var value = stack.pop();
                    stack[stack.length] = _fromCharCode(value);
                    break;
                // MBCharToAscii
                case 0x36:
                    var value = stack.pop() + "";
                    stack[stack.length] = value.charCodeAt(0);
                    break;
                // MBAsciiToChar
                case 0x37:
                    var value = stack.pop();
                    stack[stack.length] = _fromCharCode(value);
                    break;
                // ToInteger
                case 0x18:
                    var value = _floor(stack.pop());
                    stack[stack.length] = value;
                    break;
                // CharToAscii
                case 0x32:
                    var value = stack.pop() + "";
                    stack[stack.length] = value.charCodeAt(0);
                    break;

                // フロー制御 ***********************************
                // Call
                case 0x9E:
                    var value = stack.pop() + '';
                    var splitData = value.split(':');
                    if (splitData.length > 1) {
                        var targetMc = movieClip.getMovieClip(splitData[0]);
                        if (targetMc != null) {
                            if (typeof splitData[1] == 'number') {
                                var frame = splitData[1];
                            } else {
                                var frame = targetMc.getLabel(splitData[1]);
                            }

                            var as = targetMc.getActions(frame);
                            if (as != undefined) {
                                var len = as.length;
                                for (var i = 0; i < len; i++) {
                                    _execute.call(as[i], targetMc);
                                }
                            }
                        }
                    } else {
                        if (typeof splitData[0] == 'number') {
                            var frame = splitData[0];
                        } else {
                            var frame = movieClip.getLabel(splitData[0]);
                        }

                        var as = movieClip.getActions(frame);
                        if (as != undefined) {
                            var len = as.length;
                            for (var i = 0; i < len; i++) {
                                _execute.call(as[i], movieClip);
                            }
                        }
                    }

                    break;
                // If
                case 0x9D:
                    var condition = _parseFloat(stack.pop());
                    var offset = bitio.toSI16LE(payload);
                    if (condition) {
                        bitio.bit_offset = 0;
                        bitio.incrementOffset(offset, 0);
                    }

                    break;
                // Jump
                case 0x99:
                    var offset = bitio.toSI16LE(payload);
                    bitio.bit_offset = 0;
                    bitio.incrementOffset(offset, 0);
                    break;

                // 変数 ***********************************
                // GetVariable
                case 0x1C:
                    var name = stack.pop() + '';
                    var splitData = name.split(':');
                    var value = '';

                    if (movieClip != null) {
                        if (splitData.length > 1) {
                            var targetMc = movieClip.getMovieClip(splitData[0]);
                            if (targetMc != null) {
                                value = targetMc.getVariable(splitData[1]);
                            }
                        } else {
                            value = movieClip.getVariable(name);
                        }
                    }

                    stack[stack.length] = value;

                    break;
                // SetVariable
                case 0x1D:
                    var value = stack.pop();
                    var name = stack.pop() + '';
                    var splitData = name.split(':');

                    if (movieClip != null) {
                        if (splitData.length > 1) {
                            var targetMc = movieClip.getMovieClip(splitData[0]);
                            if (targetMc != null) {
                                targetMc.setVariable(splitData[1], value);
                            }
                        } else {
                            movieClip.setVariable(name, value);
                        }
                    }

                    break;

                // ムービー制御 ***********************************
                // GetURL2
                case 0x9A:
                    pBitio.setData(payload);
                    pBitio.setOffset(0, 0);

                    var LoadTargetFlag = pBitio.getUIBits(1);// 0=web, 1=スプライト
                    var LoadVariablesFlag = pBitio.getUIBits(1); // 0=none, 1=LoadVariables

                    var Reserved = pBitio.getUIBits(4);
                    var SendVarsMethod = pBitio.getUIBits(2);// 0=NONE, 1=GET, 2=POST

                    var target = stack.pop();
                    var urlString = stack.pop();

                    if (urlString) {
                        // 分解してチェック
                        var urls = urlString.split('?');
                        var uLen = urls.length;

                        var query = '';
                        if (uLen == 1) {
                            query = '?';
                        }

                        if (uLen > 2) {
                            var url = urls[0] + '?';
                            url = url + urls[1];
                            for (var u = 2; u < uLen; u++) {
                                var params = urls[u];
                                url = url +'&'+ params
                            }
                        } else {
                            var url = urlString;
                        }

                        // local variables
                        if (SendVarsMethod) {
                            var variables = movieClip.variables;
                            var queryString = '';
                            for (var key in variables) {
                                var value = variables[key];
                                if (value == null) {
                                    value = '';
                                }
                                queryString += '&'+ key +'='+ value;
                            }

                            if (query != '' && queryString != '') {
                                queryString = query + queryString.slice(1);
                            }
                            url += queryString;
                        }

                        if (LoadVariablesFlag && LoadTargetFlag) {
                            var xmlHttpRequest = new XMLHttpRequest();
                            var method = 'GET';
                            var body = null;
                            var targetUrl = url;
                            var path = target;
                            if (SendVarsMethod == 2) {
                                method = 'POST';
                                xmlHttpRequest.setRequestHeader(
                                    'Content-Type',
                                    'application/x-www-form-urlencoded'
                                );

                                urls = url.split('?');
                                if (urls[1] != undefined) {
                                    body = urls[1];
                                }
                                targetUrl =  urls[0];
                            }

                            xmlHttpRequest.open(method, targetUrl);
                            xmlHttpRequest.send(body);
                            xmlHttpRequest.onreadystatechange = function()
                            {
                                var readyState = xmlHttpRequest.readyState;
                                if (readyState == 4) {
                                    var status = xmlHttpRequest.status;
                                    if (status == 200) {
                                        var responseText = decodeURIComponent(xmlHttpRequest.responseText);
                                        var pairs = responseText.split('&');
                                        var length = pairs.length;
                                        var targetMc = movieClip;
                                        if (LoadTargetFlag) {
                                            targetMc = movieClip.getMovieClip(path);
                                        }

                                        for (var idx = 0; idx < length; idx++) {
                                            var pair = pairs[idx];
                                            var values = pair.split('=');
                                            targetMc.setVariable(values[0], values[1]);
                                        }
                                    }
                                }
                            }
                        } else if (LoadVariablesFlag && !LoadTargetFlag) {
                            var targetMc = movieClip.getMovieClip(target);
                            if (targetMc == null) {
                                break;
                            }

                            var method = 'GET';
                            var targetUrl = url;
                            var body = null;
                            if (SendVarsMethod == 2) {
                                method = 'POST';
                                xmlHttpRequest.setRequestHeader(
                                    'Content-Type',
                                    'application/x-www-form-urlencoded'
                                );

                                urls = url.split('?');
                                if (urls[1] != undefined) {
                                    body = urls[1];
                                }
                                targetUrl =  urls[0];
                            }

                            var xmlHttpRequest = new XMLHttpRequest();
                            xmlHttpRequest.open(method, targetUrl);
                            xmlHttpRequest.overrideMimeType(
                                'text/plain; charset=x-user-defined'
                            );
                            xmlHttpRequest.send(body);
                            xmlHttpRequest.onreadystatechange = function()
                            {
                                var readyState = xmlHttpRequest.readyState;
                                if (readyState == 4) {
                                    var status = xmlHttpRequest.status;
                                    if (status == 200) {
                                        var mc = new MovieClip();
                                        mc.characterId = targetMc.characterId;
                                        mc.instanceId = targetMc.instanceId;
                                        parse(xmlHttpRequest.responseText, mc);

                                        // 入れ替え
                                        if (targetMc.characterId == 0) {
                                            player.parent = mc;
                                        } else {
                                            var parent = targetMc.getParent();
                                            mc.setParent(parent);
                                            mc.setName(targetMc.getName());
                                            mc.setLevel(targetMc.getLevel());
                                            var addTags = parent.getAddTags();
                                            addTags[targetMc.getLevel()] = mc;
                                        }

                                        cacheStore.reset();
                                    } else {
                                        return 0;
                                    }
                                }
                            }
                        } else {
                            if (SendVarsMethod == 2) {
                                // form
                                var form = _document.createElement('form');
                                form.action = url;
                                form.method = 'POST';

                                urls = url.split('?');
                                if (urls.length > 1) {
                                    var pears = urls[1].split('&');
                                    var pLen = pears.length;
                                    for (var pIdx = 0; pIdx < pLen; pIdx++) {
                                        var pear = pears[pIdx].split('=');
                                        var input = _document.createElement('input');
                                        input.type = 'hidden';
                                        input.name = pear[0];
                                        input.value = encodeURI(pear[1]||'');
                                        form.appendChild(input);
                                    }
                                }
                                _document.body.appendChild(form);

                                form.submit();
                            } else {
                                func = new Function(
                                    "location.href = '"+ url +"';"
                                );
                                func();
                            }
                        }
                    }

                    break;
                // GetProperty
                case 0x22:
                    var index  = _floor(stack.pop());
                    var target = stack.pop();
                    var value = null;

                    var targetMc = movieClip;
                    if (target != null) {
                        targetMc = movieClip.getMovieClip(target);
                        if (targetMc == null) {
                            break;
                        }
                    }

                    stack[stack.length] = targetMc.getProperty(index);

                    break;
                // GoToFrame2
                case 0x9F:
                    pBitio.setData(payload);
                    pBitio.setOffset(0, 0);

                    var Reserved = pBitio.getUIBits(6);
                    var SceneBiasFlag = pBitio.getUIBit();
                    var PlayFlag = pBitio.getUIBit();// 0=stop, 1=play
                    if (SceneBiasFlag == 1) {
                        var SceneBias = pBitio.getUI16();
                    }

                    var frame = stack.pop();
                    if (frame == null || frame == undefined || movieClip == null) {
                        break;
                    }

                    if (typeof frame != 'number') {
                        var splitData = frame.split(':');
                        if (splitData.length > 1) {
                            var targetMc = movieClip.getMovieClip(splitData[0]);
                            if (targetMc != null) {
                                frame = targetMc.getLabel(splitData[1]);
                                if (typeof frame == 'number') {
                                    mc.setNextFrame(frame);
                                    if (PlayFlag) {
                                        mc.play();
                                    } else {
                                        mc.stop();
                                    }
                                }
                            }
                        } else {
                            frame = movieClip.getLabel(splitData[0]);
                            movieClip.setNextFrame(frame);
                            if (PlayFlag) {
                                movieClip.play();
                            } else {
                                movieClip.stop();
                            }
                        }
                    } else {
                        movieClip.setNextFrame(frame);
                        if (PlayFlag) {
                            movieClip.play();
                        } else {
                            movieClip.stop();
                        }
                    }

                    break;
                case 0x20: // SetTarget2
                    var target = stack.pop() + '';
                    if (movieClip == null) {
                        movieClip = mc;
                    }
                    movieClip = movieClip.getMovieClip(target);
                    break;
                // SetProperty
                case  0x23:
                    var value  = stack.pop();
                    var index  = _floor(stack.pop());
                    var target = stack.pop();

                    var targetMc = movieClip;
                    if (target != null) {
                        targetMc = movieClip.getMovieClip(target);
                        if (targetMc == null) {
                            break;
                        }
                    }

                    targetMc.setProperty(index, value);

                    break;
                // StartDrag
                case 0x27:
                    console.log('StartDrag');
                    var target = stack.pop();
                    var lockcenter = stack.pop();
                    if (lockcenter) {

                    }

                    var constrain = stack.pop();
                    if (constrain) {
                        var y2 = stack.pop();
                        var x2 = stack.pop();
                        var y1 = stack.pop();
                        var x1 = stack.pop();
                    }

                    break;
                // WaitForFrame2
                case 0x8D:
                    console.log('WaitForFrame2');
                    var frame = stack.pop();
                    pBitio.setData(payload);
                    pBitio.setOffset(0, 0);

                    var skipCount = pBitio.getUI8();
                    if (obj.getFrame() == frame) {

                    }

                    break;
                // CloneSprite
                case 0x24:
                    var depth = _parseFloat(stack.pop());
                    var target = stack.pop() + '';
                    var source = stack.pop() + '';

                    // clone
                    var targetMc = movieClip.getMovieClip(source);
                    if (targetMc != null && targetMc.characterId != 0) {
                        var cloneMc = new MovieClip();
                        var parent = targetMc.getParent();
                        if (parent == null) {
                            parent = player.parent;
                        }
                        cloneMc.characterId = targetMc.characterId;
                        cloneMc.setParent(parent);
                        cloneMc.setName(target);
                        cloneMc.setLevel(depth);
                        cloneMc.setTotalFrames(targetMc.getTotalFrames());

                        var char = character[targetMc.characterId];
                        swftag.build(char, cloneMc);

                        var level = targetMc.getLevel();
                        var totalFrame = parent.getTotalFrames() + 1;
                        var addTags = parent.addTags;
                        for (var frame = 1; frame < totalFrame; frame++) {
                            if (!(frame in addTags)) {
                                addTags[frame] = [];
                            }
                            addTags[frame][depth] = cloneMc;
                        }

                        var cTags = parent.controlTags;
                        var oTags = parent.originTags;
                        totalFrame = parent.getTotalFrames();

                        var _clone = clone;
                        for (frame = 1; frame < totalFrame; frame++) {
                            if (!(frame in cTags)
                                || !(level in cTags[frame])
                            ) {
                                if (frame in oTags) {
                                    oTags[frame][depth] =
                                        oTags[frame - 1][depth];
                                }
                                continue;
                            }

                            var tags = cTags[frame];
                            oTags[frame][depth] = _clone(oTags[frame][level]);
                            tags[depth] = {
                                _Matrix: _clone(tags[level]._Matrix),
                                _ColorTransform: _clone(tags[level]._ColorTransform)
                            }
                        }

                        cloneMc.setNextFrame(1);
                    }

                    break;
                // RemoveSprite
                case 0x25:
                    var target = stack.pop() + '';
                    var targetMc = movieClip.getMovieClip(target);
                    if (targetMc != null) {
                        var depth = targetMc.getLevel();
                        var parent = targetMc.getParent();
                        var addTags = parent.addTags;
                        for (var frame = parent.getTotalFrames() + 1; --frame;) {
                            delete addTags[frame][depth];
                        }

                        var cTags = parent.controlTags;
                        var oTags = parent.originTags;
                        for (frame = parent.getTotalFrames(); --frame;) {
                            if (frame in oTags && depth in oTags[frame]) {
                                delete oTags[frame][depth];
                            }

                            if (frame in cTags && depth in cTags[frame]) {
                                delete cTags[frame][depth];
                            }
                        }
                    }

                    break;
                // EndDrag
                case 0x28:
                    console.log('EndDrag');
                    break;

                // ユーティリティ ***********************************
                // GetTime
                case 0x34:
                    var now = new _Date();
                    stack[stack.length] =
                        now.getTime() - startDate.getTime();
                    break;
                // RandomNumber
                case 0x30:
                    var maximum = stack.pop();
                    var randomNumber = _floor(_random() * maximum);
                    stack[stack.length] = randomNumber;
                    break;
                // Trace
                case 0x26:
                    var value = stack.pop();
                    if (typeof value == 'string') {
                        value = value.split('@LFCR').join('\n');
                    }
                    console.log('[trace] ' + value);
                    break;
                case 0x00:
                    isEnd = true;
                    break;
                case 0x2D: // fscommand2
                    var count = _parseFloat(stack.pop());
                    var method = stack.pop();

                    var now = new _Date();
                    switch (method.toLowerCase()) {
                        case 'getdateyear':
                            stack[stack.length] = now.getFullYear();
                            break;
                        case 'getdatemonth':
                            stack[stack.length] = now.getMonth() + 1;
                            break;
                        case 'getdateday':
                            stack[stack.length] = now.getDate();
                            break;
                        case 'getdateweekday':
                            stack[stack.length] = now.getDay();
                            break;
                        case 'gettimehours':
                            stack[stack.length] = now.getHours();
                            break;
                        case 'gettimeminutes':
                            stack[stack.length] = now.getMinutes();
                            break;
                        case 'gettimeseconds':
                            stack[stack.length] = now.getSeconds();
                            break;
                        case 'startvibrate':
                            stack.pop();
                            stack.pop();
                            stack.pop();
                            stack[stack.length] = -1;
                            break;
                        case 'gettimezoneoffset':
                            movieClip.setVariable(stack.pop(), now.toUTCString());
                            movieClip.setVariable(stack.pop(), 0);
                            break;
                        case 'getlocalelongdate':
                            movieClip.setVariable(stack.pop(), now.toLocaleDateString());
                            movieClip.setVariable(stack.pop(), 0);
                            break;
                        case 'getlocaleshortdate':
                            movieClip.setVariable(stack.pop(), now.toDateString());
                            movieClip.setVariable(stack.pop(), 0);
                            break;
                        case 'getlocaletime':
                            movieClip.setVariable(stack.pop(), now.toLocaleTimeString());
                            movieClip.setVariable(stack.pop(), 0);
                            break;
                        case 'getnetworkname':
                        case 'getdevice':
                        case 'getdeviceid':
                            movieClip.setVariable(stack.pop(), '');
                            movieClip.setVariable(stack.pop(), -1);
                            break;
                        case 'getlanguage':
                            var language = _navigator.userLanguage || _navigator.language || _navigator.browserLanguage || '';
                            movieClip.setVariable(stack.pop(), language);
                            movieClip.setVariable(stack.pop(), 0);
                            break;
                        case 'setsoftkeys':
                            stack.pop();
                            stack.pop();
                            stack[stack.length] = -1;
                            break;
                        case 'fullscreen':
                            var bool = stack.pop();
                            stack[stack.length] = -1;
                            break;
                        case 'setquality':
                        case 'getfreeplayermemory':
                        case 'gettotalplayermemory':
                            stack.pop();
                            stack[stack.length] = -1;
                            break;
                        default:
                            stack[stack.length] = -1;
                            break;
                    }

                    break;

                // SWF 5 ***********************************
                // CallMethod
                case 0x52:
                    var method = stack.pop();
                    var object = stack.pop();
                    var count = _parseFloat(stack.pop());

                    var params = [];
                    for (; count--;) {
                        params[params.length] = stack.pop();
                    }

                    var value = null;
                    if (object != null && object[method] != undefined) {
                        value = object[method].apply(object, params);
                    }

                    stack[stack.length] = value;
                    break;
                // ConstantPool
                case 0x88:
                    pBitio.setData(payload);
                    pBitio.setOffset(0, 0);

                    var _this = this;
                    var count = pBitio.getUI16();
                    _this.constantPool = [];
                    for (; count--;) {
                        _this.constantPool[_this.constantPool.length] =
                            pBitio.getDataUntil("\0");
                    }

                    break;
                // ActionCallFunction
                case 0x3d:
                    var FunctionName = stack.pop() + '';
                    var numArgs = _parseFloat(stack.pop());
                    var params = [];
                    for (; numArgs--;) {
                        params[params.length] = stack.pop();
                    }

                    if (movieClip != null) {
                        if (window[FunctionName]) {
                            targetMc = movieClip;
                            if (params[0] instanceof MovieClip) {
                                targetMc = params.shift();
                            }

                            if (params[0] instanceof ActionScript) {
                                var as = params.shift();
                            } else {
                                var method = params.shift();
                                var as = targetMc.getVariable(method);
                            }

                            params.unshift(function()
                            {
                                // set
                                var register = as.register;
                                for (var idx = arguments.length; idx--;) {
                                    if (!(idx in register)) {
                                        continue;
                                    }
                                    register[idx].value = arguments[idx];
                                }

                                // build
                                for (var idx = register.length; idx--;) {
                                    var obj = register[idx];
                                    as.params[obj.register] = obj.value;
                                }

                                _execute.call(as, targetMc);
                            });

                            var ret = window[FunctionName].apply(window, params);
                            stack[stack.length] = ret;

                        } else {
                            var as = movieClip.getVariable(FunctionName);
                            if (as != undefined) {
                                var register = as.register;
                                // set
                                for (var idx = params.length; idx--;) {
                                    if (!(idx in register)) {
                                        continue;
                                    }
                                    register[idx].value = params[idx];
                                }

                                // build
                                for (var idx = register.length; idx--;) {
                                    var obj = register[idx];
                                    as.params[obj.register] = obj.value;
                                }

                                _execute.call(as, movieClip);
                            }
                        }
                    }

                    break;
                // ActionDefineFunction
                case 0x9b:
                    pBitio.setData(payload);
                    pBitio.setOffset(0, 0);

                    var FunctionName = pBitio.getDataUntil("\0");
                    var NumParams = pBitio.getUI16();
                    var params = [];
                    for (; NumParams--;) {
                        params[params.length] = pBitio.getDataUntil("\0");
                    }

                    var codeSize  = pBitio.getUI16();
                    var as = new ActionScript(bitio.getData(codeSize));
                    as.constantPool = clone(this.constantPool);
                    movieClip.setVariable(FunctionName, as);

                    stack[stack.length] = as;

                    break;
                // ActionDefineLocal
                case 0x3c:
                    var value = stack.pop() + '';
                    var name = stack.pop();
                    if (movieClip != null) {
                        movieClip.setVariable(name, value);
                    }

                    break;
                // ActionDefineLocal2
                case 0x41:
                    var name = stack.pop();
                    movieClip.setVariable(name, '');

                    break;
                // ActionDelete
                case 0x3a:
                    var name = stack.pop();
                    var object = stack.pop();

                    if (object instanceof MovieClip) {
                        object.deleteVariable(name);
                    }

                    break;
                // ActionDelete2
                case 0x3b:
                    var name = stack.pop();
                    if (movieClip != null) {
                        movieClip.deleteVariable(name);
                    }

                    break;
                // ActionEnumerate
                case 0x46:
                    var path = stack.pop();
                    stack[stack.length] = null;

                    if (movieClip != null) {
                        var targetMc = movieClip.getMovieClip(path);
                        if (targetMc != null) {
                            var variables = targetMc.variables;
                            for (var slotName in variables) {
                                stack[stack.length] = slotName;
                            }
                        }
                    }

                    break;
                // ActionEquals2
                case 0x49:
                    var a = stack.pop();
                    var b = stack.pop();

                    var boolInt = (b === a) ? 1 : 0;
                    stack[stack.length] = boolInt;

                    break;
                // ActionGetMember
                case 0x4e:
                    var name = stack.pop();
                    var object = stack.pop();

                    var property = null;
                    if (object instanceof MovieClip) {
                        property = object.getProperty(name);
                    } else if (object instanceof Object) {
                        property = object[name];
                    }

                    stack[stack.length] = property;

                    break;
                // ActionInitArray
                case 0x42:
                    var number = stack.pop();
                    var array = [];
                    for (;number--;) {
                        array[array.length] = stack.pop();
                    }
                    stack[stack.length] = array;
                    break;
                // ActionInitObject
                case 0x43:
                    var number = stack.pop();
                    var object = {};
                    for (;number--;) {
                        var value = stack.pop();
                        var property = stack.pop();
                        object[property] = value;
                    }
                    stack[stack.length] = object;
                    break;
                // ActionNewMethod
                case 0x53:
                    var method = stack.pop();
                    var object = stack.pop();
                    var number = stack.pop();

                    var params = [];
                    for (;number--;) {
                        params[params.length] = stack.pop();
                    }

                    if (method == '') {
                        stack[stack.length] = object.apply(object, params);
                    } else {
                        stack[stack.length] = new (Function.prototype.bind.apply(object[method], params));
                    }

                    break;
                // ActionNewObject
                case 0x40:
                    var object = stack.pop() + '';
                    var numArgs = _parseFloat(stack.pop());

                    var params = [];
                    for (; numArgs--;) {
                        params[params.length] = stack.pop();
                    }

                    if (object == 'MovieClip') {
                        stack[stack.length] = new MovieClip();
                    } else if (window[object]) {
                        stack[stack.length] = new window[object](); //(Function.prototype.bind.apply(window[object], params));
                    } else {
                        var func = movieClip.getVariable(object);
                        if (func instanceof Function) {
                            stack[stack.length] = new func();
                        }
                    }

                    break;
                // ActionSetMember
                case 0x4f:
                    var value = stack.pop();
                    var name = stack.pop();
                    var object = stack.pop();
                    if (object instanceof MovieClip) {
                        object.setProperty(name, value);
                    } else {
                        object[name] = value;
                    }

                    break;
                // ActionTargetPath
                case 0x45:
                    console.log('ActionTargetPath');
                    var object = stack.pop();
                    var path = null;
                    if (object instanceof MovieClip) {
                        path = object.getName();
                        if (path != null) {
                            while (true) {
                                var parent = object.getParent();
                                if (parent == null) {
                                    path = '/'+ path;
                                    break;
                                }

                                var name = parent.getName();
                                if (name == null) {
                                    path = null;
                                    break;
                                }

                                path = name +'/'+ path;
                            }
                        }
                    }

                    stack[stack.length] = path;
                    break;
                // ActionWith
                case 0x94:
                    console.log('ActionWith');
                    pBitio.setData(payload);
                    pBitio.setOffset(0, 0);
                    var Size = pBitio.getUI16();
                    var object = stack.pop();

                    break;
                // ActionToNumber
                case 0x4a:
                    var object = stack.pop();
                    stack[stack.length] = _parseFloat(object);
                    break;
                // ActionToString
                case 0x4b:
                    var object = stack.pop();
                    stack[stack.length] = object + '';
                    break;
                // ActionTypeOf
                case 0x44:
                    console.log('ActionTypeOf');
                    var object = stack.pop();
                    if (object instanceof MovieClip) {
                        return 'movieclip';
                    } else {
                        return typeof object;
                    }

                    break;
                // ActionAdd2
                case 0x47:
                    var a = stack.pop();
                    var b = stack.pop();
                    stack[stack.length] = b+a;
                    break;
                // ActionLess2
                case 0x48:
                    var a = stack.pop();
                    var b = stack.pop();
                    var boolInt = (b < a) ? 1 : 0;
                    stack[stack.length] = boolInt;
                    break;
                // ActionModule
                case 0x3f:
                    var x = stack.pop();
                    var y = stack.pop();
                    stack[stack.length] = x % y;
                    break;
                // ActionBitAnd
                case 0x60:
                    var a = stack.pop();
                    var b = stack.pop();
                    stack[stack.length] = x & y;
                    break;
                // ActionBitLShift
                case 0x63:
                    var a = stack.pop();
                    var b = stack.pop();
                    stack[stack.length] = b << a;
                    break;
                // ActionBitOr
                case 0x61:
                    var a = stack.pop();
                    var b = stack.pop();
                    stack[stack.length] = b | a;
                    break;
                // ActionBitRShift
                case 0x64:
                    var a = stack.pop();
                    var b = stack.pop();
                    stack[stack.length] = b >> a;
                    break;
                // ActionBitURShift
                case 0x65:
                    var a = stack.pop();
                    var b = stack.pop();
                    stack[stack.length] = b >> a;
                    break;
                // ActionBitXor
                case 0x62:
                    var a = stack.pop();
                    var b = stack.pop();
                    stack[stack.length] = a ^ b;
                    break;
                // ActionDecrement
                case 0x51:
                    var value = _parseFloat(stack.pop());
                    value--;
                    stack[stack.length] = value;
                    break;
                // ActionIncrement
                case 0x50:
                    var value = _parseFloat(stack.pop());
                    value++;
                    stack[stack.length] = value;
                    break;
                // ActionPushDuplicate
                case 0x4c:
                    var value = stack[0];
                    stack[stack.length] = value;
                    break;
                // ActionReturn
                case 0x3e:
                    var value = stack.pop();
                    break;
                // ActionStackSwap
                case 0x4d:
                    var a = stack.pop();
                    var b = stack.pop();

                    stack[stack.length] = b;
                    stack[stack.length] = a;
                    break;
                // ActionStoreRegister
                case 0x87:
                    pBitio.setData(payload);
                    pBitio.setOffset(0, 0);
                    var RegisterNumber = pBitio.getUI8();
                    break;

                // SWF 6 ***********************************
                // ActionInstanceOf
                case 0x54:
                    var constr = stack.pop();
                    var obj = stack.pop();
                    var boolInt = (obj instanceof constr) ? 1 : 0;
                    stack[stack.length] = boolInt;
                    break;
                // ActionEnumerate2
                case 0x55:
                    var obj = stack.pop();
                    stack[stack.length] = null;

                    if (typeof obj == Object) {
                        if (obj instanceof MovieClip) {
                            obj = obj.variables;
                        }

                        for (var slotName in obj) {
                            stack[stack.length] = slotName + '';
                        }
                    }

                    break;
                // ActionStrictEquals
                case 0x66:
                    var a = stack.pop();
                    var b = stack.pop();
                    var boolInt = (a === b) ? 1 : 0;
                    stack[stack.length] = boolInt;
                    break;
                // ActionGreater
                case 0x67:
                    var a = stack.pop();
                    var b = stack.pop();
                    var boolInt = (b > a) ? 1 : 0;
                    stack[stack.length] = boolInt;
                    break;
                // ActionStringGreater
                case 0x68:
                    var a = stack.pop();
                    var b = stack.pop();
                    var boolInt = (b > a) ? 1 : 0;
                    stack[stack.length] = boolInt;
                    break;

                // SWF 7 ***********************************
                // ActionDefineFunction2
                case 0x8e:
                    console.log('ActionDefineFunction2');

                    pBitio.setData(payload);
                    pBitio.setOffset(0, 0);

                    var FunctionName = pBitio.getDataUntil("\0");
                    var NumParams = pBitio.getUI16();
                    var RegisterCount = pBitio.getUI8();
                    var PreloadParentFlag = pBitio.getUIBits(1);
                    var PreloadRootFlag = pBitio.getUIBits(1);
                    var SuppressSuperFlag = pBitio.getUIBits(1);
                    var PreloadSuperFlag = pBitio.getUIBits(1);
                    var SuppressArgumentsFlag = pBitio.getUIBits(1);
                    var PreloadArgumentsFlag = pBitio.getUIBits(1);
                    var SuppressThisFlag = pBitio.getUIBits(1);
                    var PreloadThisFlag = pBitio.getUIBits(1);
                    var Reserved = pBitio.getUIBits(7);
                    var PreloadGlobalFlag = pBitio.getUIBits(1);

                    var params = [];
                    for (; NumParams--;) {
                        var Register = pBitio.getUI8();
                        var ParamName = pBitio.getDataUntil("\0");
                        params[params.length] = {
                            register: Register,
                            name: ParamName,
                            value: null
                        };
                    }

                    var codeSize = pBitio.getUI16();
                    var as = new ActionScript(bitio.getData(codeSize));
                    as.constantPool = clone(this.constantPool);
                    as.register = params;
                    stack[stack.length] = as;

                    break;
                // ActionExtends
                case 0x69:
                    console.log('ActionExtends');
                    var superClass = stack.pop();
                    var subClass = stack.pop();
                    subClass.prototype = {};
                    subClass.prototype.__proto__ = superClass.prototype;
                    subClass.prototype.__constructor__ = superClass;
                    break;
                // ActionCastOp
                case 0x2b:
                    console.log('ActionCastOp');
                    var object = stack.pop();
                    var func = stack.pop();
                    if (object == '') {
                        stack[stack.length] = null;
                    } else {
                        stack[stack.length] = null;
                    }

                    break;
                // ActionImplementsOp
                case 0x2c:
                    console.log('ActionImplementsOp');
                    var func = stack.pop();
                    var count = stack.pop();
                    var params = [];
                    for (; count--;) {
                        params[params.length] = stack.pop();
                    }
                    stack[stack.length] = null;

                    break;
                // ActionTry
                case 0x8f:
                    console.log('ActionTry');
                    pBitio.setData(payload);
                    pBitio.setOffset(0, 0);

                    var Reserved = pBitio.getUIBits(5);
                    var CatchInRegisterFlag = pBitio.getUIBits(1);
                    var FinallyBlockFlag = pBitio.getUIBits(1);
                    var CatchBlockFlag = pBitio.getUIBits(1);
                    var TrySize = pBitio.getUI16();
                    var CatchSize = pBitio.getUI16();
                    var FinallySize = pBitio.getUI16();
                    var CatchName = pBitio.getDataUntil("\0");

                    if (CatchInRegisterFlag) {
                        var CatchRegister = pBitio.getUI8();
                    }

                    var TryBody = [];
                    if (TrySize) {
                        for (var i = TrySize; i--;) {
                            TryBody[TryBody.length] = pBitio.getUI8();
                        }
                    }
                    var CatchBody = [];
                    if (CatchSize) {
                        for (var i = CatchSize; i--;) {
                            CatchBody[CatchBody.length] = pBitio.getUI8();
                        }
                    }
                    var FinallyBody = [];
                    if (FinallySize) {
                        for (var i = FinallySize; i--;) {
                            FinallyBody[FinallyBody.length] = pBitio.getUI8();
                        }
                    }

                    break;
                // ActionThrow
                case 0x2a:
                    throw new Error(stack.pop());
                    break;

                // SWF 9 ***********************************
                // DoABC
                case 0x82:
                    console.log('DoABC');
                    pBitio.setData(payload);
                    pBitio.setOffset(0, 0);
                    var flags = pBitio.getUI32();
                    var Name = pBitio.getDataUntil("\0");
                    var ABCData = pBitio.getData(payload.length - pBitio.byte_offset);
                    break;

                default:
                    console.log('[actionScript] '+actionCode);
                    break;
            }

            if (isEnd) {
                break;
            }
        }
    };
    var cacheAS = new ActionScript([]);

    /**
     * MovieClip
     * @constructor
     */
    var MovieClip = function()
    {
        // param
        this.characterId = 0;
        this.instanceId = instanceId++;
        this.parent = null;
        this.matrix = null;
        this.colorTransform = null;
        this.originTags = [];
        this.controlTags = [];
        this.addTags = [];
        this.frameTags = null;
        this.removeTags = [];
        this.actions = [];
        this.labels = [];
        this.sounds = [];
        this.variables = [];

        // 判定用
        this.stopFlag = false;
        this.isAction = true;
        this.isButtonRemove = false;
        this._nextFrame = 0;

        // clip
        this.isClipDepth = false;
        this.clipDepth = 0;

        // sound
        this.soundStopFlag = false;

        // Property
        this._currentframe = 1;
        this._visible = 1;
        this._target = 0;
        this._droptarget = 0;
        this._url = null;
        this._highquality = 1;
        this._focusrect = 1;
        this._soundbuftime = null;
        this._totalframes = 1;
        this._level = 0;
        this._name = null;
        this._framesloaded = 0;

        // event
        this.event = {};
    };

    /**
     * addEvent
     * @param name
     * @param as
     */
    MovieClip.prototype.addEvent = function(name, as)
    {
        var _this = this;
        var event = _this.event;
        if(!(name in event)) {
            event[name] = [];
        } else {
            _this.delEvent(name, as);
        }
        event[name].push(as);
    };

    /**
     * delEvent
     * @param name
     * @param as
     */
    MovieClip.prototype.delEvent = function(name, as)
    {
        var _this = this;
        var event = _this.event;
        if (name in event) {
            var length = event[name].length;
            for (var i = length; i--;) {
                var obj = event[name][i];
                if (obj == as) {
                    event[name].splice(i, 1);
                    break;
                }
            }
        }
    };

    /**
     * dispatchEvent
     * @param name
     */
    MovieClip.prototype.dispatchEvent = function(name)
    {
        var _this = this;
        var event = _this.event;
        var _execute = cacheAS.execute;
        for (name in event) {
            var length = event[name].length;
            for (var i = length; i--;) {
                var as = event[name][i];
                if (!(as instanceof ActionScript)) {
                    if (controllerMode) {
                        as[name].apply();
                    }
                    continue;
                }
                _execute.call(as, _this);
            }
        }
    };

    /**
     * getMovieClip
     * @param path
     * @returns {*}
     */
    MovieClip.prototype.getMovieClip = function(path)
    {
        var _path = path + '';
        var splitData = _path.split('/');
        var len = splitData.length;

        var mc = this;
        if (splitData[0] == '') {
            mc = player.parent;
        }

        var _getAddTags = mc.getAddTags;
        var _getParent = mc.getParent;
        var _getName = mc.getName;
        for (var i = 0; i < len; i++) {
            var name = splitData[i];
            if (name == '') {
                continue;
            }

            if (name == '_root') {
                mc = player.parent;
                continue;
            }

            if (name == '..') {
                mc = _getParent.call(mc);
                continue;
            }

            var tags = _getAddTags.call(mc);
            if (tags == undefined) {
                mc = null;
                break;
            }

            var tagLength = tags.length;
            var setTarget = false;
            for (var idx = 0; idx < tagLength; idx++) {
                if (!(idx in tags)) {
                    continue;
                }

                var tag = tags[idx];
                if (!(tag instanceof MovieClip)) {
                    continue;
                }

                if (_getName.call(tag) == name) {
                    mc = tag;
                    setTarget = true;
                    break;
                }
            }

            if (!setTarget) {
                mc = null;
                break;
            }
        }

        return mc;
    };

    /**
     * play
     */
    MovieClip.prototype.play = function()
    {
        this.stopFlag = false;
    };

    /**
     * stop
     */
    MovieClip.prototype.stop = function()
    {
        this.stopFlag = true;
    };

    /**
     * gotoAndPlay
     */
    MovieClip.prototype.gotoAndPlay = function(frame)
    {
        var _this = this;
        if (typeof frame != 'number') {
            frame = _this.getLabel(frame);
        }
        _this.setNextFrame(frame);
        _this.play();
    };

    /**
     * gotoAndStop
     */
    MovieClip.prototype.gotoAndStop = function(frame)
    {
        var _this = this;
        if (typeof frame != 'number') {
            frame = _this.getLabel(frame);
        }
        _this.setNextFrame(frame);
        _this.stop();
    };

    /**
     * stopAllSounds
     */
    MovieClip.prototype.stopAllSounds = function()
    {
        var sLen = loadSounds.length;
        for (; sLen--;) {
            if (!(sLen in loadSounds)) {
                continue;
            }

            var audio = loadSounds[sLen];
            audio.pause();
            audio.currentTime = 0;
        }
    };

    /**
     * btnCallback
     * @param obj
     * @param callback
     */
    MovieClip.prototype.btnCallback = function(obj, callback)
    {
        var characters = obj.characters;
        var btnTag = character[obj.characterId];
        var tagCharacters = btnTag.characters;
        var length = characters.length;
        for (var depth = 1; depth < length; depth++) {
            if (!(depth in characters)) {
                continue;
            }

            var tags = characters[depth];
            var tLen = tags.length;
            for (var idx = 0; idx < tLen; idx++) {
                if (!(idx in tags)) {
                    continue;
                }

                var tag = tags[idx];
                if (!(tag instanceof MovieClip)) {
                    continue;
                }

                var cTag = tagCharacters[depth][idx];
                if (touchObj != null
                    && touchObj.characterId == tag.characterId
                ) {
                    if (!cTag.ButtonStateDown) {
                        continue;
                    }
                    callback.call(tag);
                } else if (cTag.ButtonStateUp) {
                    callback.call(tag);
                }
            }
        }
    };

    /**
     * putFrame
     */
    MovieClip.prototype.putFrame = function()
    {
        var _this = this;
        if (!_this.stopFlag || _this.getNextFrame() > 0) {
            var frame = (_this.getNextFrame() > 0)
                ? _this.getNextFrame()
                : _this.getFrame() + 1;
            var frameCount = _this.getTotalFrames();

            if (frame > frameCount || frame <= 0) {
                frame = 1;
                if (frameCount > 1) {
                    _this.reset(false, frame);
                }
            } else {
                _this.isAction = true;
                _this.soundStopFlag = false;
            }

            _this.setFrame(frame);
            if (_this.getNextFrame() > 0) {
                _this._nextFrame = 0;
            }

            // remove
            _this.remove();
        }
    };

    /**
     * nextFrame
     */
    MovieClip.prototype.nextFrame = function()
    {
        var _this = this;
        var frame = _this.getFrame();
        frame++;
        _this.setNextFrame(frame);
        _this.stop();
    };

    /**
     * previousFrame
     */
    MovieClip.prototype.previousFrame = function()
    {
        var _this = this;
        var frame = _this.getFrame();
        frame--;
        _this.setNextFrame(frame);
        _this.stop();
    };

    /**
     * getFrame
     * @returns {number}
     */
    MovieClip.prototype.getFrame = function()
    {
        return this._currentframe;
    };

    /**
     * setFrame
     * @param frame
     */
    MovieClip.prototype.setFrame = function(frame)
    {
        this.frameTags = null;
        this._currentframe = frame;
    };

    /**
     * getNextFrame
     * @returns {number}
     */
    MovieClip.prototype.getNextFrame = function()
    {
        return this._nextFrame;
    };

    /**
     * setNextFrame
     * @param frame
     */
    MovieClip.prototype.setNextFrame = function(frame)
    {
        var _this = this;
        if (_this.getFrame() != frame) {
            _this.isAction = true;
            if (frame > _this.getTotalFrames()) {
                frame = _this.getTotalFrames();
                _this.isAction = false;
            }

            var addTags = _this.getAddTags();
            var _reset = _this.reset;
            if (frame in _this.addTags) {
                var nextAddTags = _this.addTags[frame];
                var length = _max(addTags.length, nextAddTags.length);

                for (var depth = 1; depth < length; depth++) {
                    if (!(depth in addTags) && !(depth in nextAddTags)) {
                        continue;
                    }

                    var obj = addTags[depth];
                    if (!(obj instanceof MovieClip)) {
                        continue;
                    }

                    if (depth in nextAddTags) {
                        var nextObj = nextAddTags[depth];
                        if (!(nextObj instanceof MovieClip)) {
                            _reset.call(obj, true, 1);
                        } else if (nextObj.instanceId != obj.instanceId) {
                            _reset.call(obj, true, 1);
                        }
                    } else {
                        _reset.call(obj, true, 1);
                    }
                }
            }

            _this._nextFrame = frame;
            _this.setFrame(frame);
            _this.remove();

            if (_this.instanceId in actions) {
                actions[_this.instanceId] = null;
            }
        }
    };

    /**
     * getTotalFrames
     * @returns {number}
     */
    MovieClip.prototype.getTotalFrames = function()
    {
        return this._totalframes;
    };

    /**
     * setTotalFrames
     * @param frame
     */
    MovieClip.prototype.setTotalFrames = function(frame)
    {
        this._totalframes = frame;
    };

    /**
     * getProperty
     * @param name
     * @returns {null}
     */
    MovieClip.prototype.getProperty = function(name)
    {
        var value = null;
        switch (name) {
            case 0:
            case '_x':
                value = this.getX();
                break;
            case 1:
            case '_y':
                value = this.getY();
                break;
            case 2:
            case '_xscale':
                value = this.getXScale();
                break;
            case 3:
            case '_yscale':
                value = this.getYScale();
                break;
            case 4:
            case '_currentframe':
                value = this.getFrame();
                break;
            case 5:
            case '_totalframes':
                value = this.getTotalFrames();
                break;
            case 6:
            case '_alpha':
                value = this.getAlpha();
                break;
            case 7:
            case '_visible':
                value = this.getVisible();
                break;
            case 8:
            case '_width':
                value = this.getWidth();
                break;
            case 9:
            case '_height':
                value = this.getHeight();
                break;
            case 10:
            case '_rotation':
                value = this.getRotation();
                break;
            case 11:
            case '_target':
                value = this._target;
                break;
            case 12:
            case '_framesloaded':
                value = this._framesloaded;
                break;
            case 13:
            case '_name':
                value = this.getName();
                break;
            case 14:
            case '_droptarget':
                value = this._droptarget;
                break;
            case 15:
            case '_url':
                value = this._url;
                break;
            case 16:
            case '_highquality':
                value = this._highquality;
                break;
            case 17:
            case '_focusrect':
                value = this._focusrect;
                break;
            case 18:
            case '_soundbuftime':
                value = this._soundbuftime;
                break;
            case 19:
            case '_quality':
                value = this._quality;
                break;
            case 20:
            case '_xmouse':
                value = this._xmouse;
                break;
            case 21:
            case '_ymouse':
                value = this._ymouse;
                break;
            default:
                value = this.getVariable(name);
                if (value == undefined) {
                    value = this.getMovieClip(name);
                }
                break;
        }

        return value;
    };

    /**
     * setProperty
     * @param name
     * @param value
     */
    MovieClip.prototype.setProperty = function(name, value)
    {
        switch (name) {
            case 0:
            case '_x':
                value = _parseFloat(value);
                if (!_isNaN(value)) {
                    this.setX(value);
                }
                break;
            case 1:
            case '_y':
                value = _parseFloat(value);
                if (!_isNaN(value)) {
                    this.setY(value);
                }
                break;
            case 2:
            case '_xscale':
                value = _parseFloat(value);
                if (!_isNaN(value)) {
                    this.setXScale(value);
                }
                break;
            case 3:
            case '_yscale':
                value = _parseFloat(value);
                if (!_isNaN(value)) {
                    this.setYScale(value);
                }
                break;
            case 4:
            case '_currentframe':
                value = _parseFloat(value);
                if (!_isNaN(value)) {
                    this.setNextFrame(value);
                }
                break;
            case 5:
            case '_totalframes':
                value = _parseFloat(value);
                if (!_isNaN(value)) {
                    this.setTotalFrames(value);
                }
                break;
            case 6:
            case '_alpha':
                value = _parseFloat(value);
                if (!_isNaN(value)) {
                    this.setAlpha(value);
                }
                break;
            case 7:
            case '_visible':
                value = _parseFloat(value);
                if (!_isNaN(value)) {
                    this.setVisible(value);
                }
                break;
            case 8:
            case '_width':
                value = _parseFloat(value);
                if (!_isNaN(value)) {
                    this.setWidth(value);
                }
                break;
            case 9:
            case '_height':
                value = _parseFloat(value);
                if (!_isNaN(value)) {
                    this.setHeight(value);
                }
                break;
            case 10:
            case '_rotation':
                value = _parseFloat(value);
                if (!_isNaN(value)) {
                    this.setRotation(value);
                }
                break;
            case 11:
            case '_target':
                this._target = value;
                break;
            case 12:
            case '_framesloaded':
                this._framesloaded = value;
                break;
            case 13:
            case '_name':
                this.setName(value);
                break;
            case 14:
            case '_droptarget':
                this._droptarget = value;
                break;
            case 15:
            case '_url':
                this._url = value;
                break;
            case 16:
            case '_highquality':
                this._highquality = value;
                break;
            case 17:
            case '_focusrect':
                this._focusrect = value;
                break;
            case 18:
            case '_soundbuftime':
                this._soundbuftime = value;
                break;
            case 19:
            case '_quality':
                this._quality = value;
                break;
            case 20:
            case '_xmouse':
                this._xmouse = value;
                break;
            case 21:
            case '_ymouse':
                this._ymouse = value;
                break;
            case 'onEnterFrame':
                this.addEvent(name, value);
                break;
            default:
                value = this.setVariable(name, value);
                break;
        }
    };

    /**
     * setVariable
     * @param name
     * @param value
     */
    MovieClip.prototype.setVariable = function(name, value)
    {
        var variables = this.variables;
        if (version < 7 && typeof name == 'string') {
            for (var key in variables) {
                if (key.toLowerCase() == name.toLowerCase()) {
                    this.variables[key] = value;
                    return 0;
                }
            }
        }

        this.variables[name] = value;
    };

    /**
     * getVariable
     * @param name
     * @returns {*}
     */
    MovieClip.prototype.getVariable = function(name)
    {
        var variables = this.variables;
        var value;

        if (name in variables) {
            return variables[name];
        }

        if (version < 7) {
            for (var key in variables) {
                if (typeof key != 'string') {
                    continue;
                }

                if (key.toLowerCase() == name.toLowerCase()) {
                    return variables[key];
                }
            }
        }

        if (version > 4) {
            if (name in window) {
                return window[name];
            } else {
                return this.getMovieClip(name);
            }
        }

        return value;
    };

    /**
     * deleteVariable
     * @param name
     */
    MovieClip.prototype.deleteVariable = function(name)
    {
        if (name in this.variables) {
            delete this.variables[name];
        }
    };

    /**
     * getLevel
     * @returns {number}
     */
    MovieClip.prototype.getLevel = function()
    {
        return this._level;
    };

    /**
     * setLevel
     * @param level
     */
    MovieClip.prototype.setLevel = function(level)
    {
        this._level = level;
    };

    /**
     *
     * @returns {number}
     */
    MovieClip.prototype.getAlpha = function()
    {
        var _this = this;
        var colorTransform = _this.getColorTransform();
        var alpha = colorTransform[3] + (colorTransform[7] / 255);
        return alpha * 100;
    };

    /**
     *
     * @param alpha
     */
    MovieClip.prototype.setAlpha = function(alpha)
    {
        var _this = this;
        var colorTransform = _this.getColorTransform();
        colorTransform[3] = alpha / 100;
        colorTransform[7] = 0;
    };

    /**
     *
     * @returns {number}
     */
    MovieClip.prototype.getVisible = function()
    {
        return this._visible;
    };

    /**
     *
     * @param visible
     */
    MovieClip.prototype.setVisible = function(visible)
    {
        this._visible = visible;
    };

    /**
     * addLabel
     * @param frame
     * @param name
     */
    MovieClip.prototype.addLabel = function(frame, name)
    {
        this.labels[name] = frame;
    };

    /**
     * getLabel
     * @param name
     * @returns {*}
     */
    MovieClip.prototype.getLabel = function(name)
    {
        return this.labels[name];
    };

    /**
     * addSound
     * @param frame
     * @param obj
     */
    MovieClip.prototype.addSound = function(frame, obj)
    {
        if (!(frame in this.sounds)) {
            this.sounds[frame] = [];
        }
        this.sounds[frame].push(obj);
    };

    /**
     * getSounds
     * @returns {*}
     */
    MovieClip.prototype.getSounds = function()
    {
        var _this = this;
        return _this.sounds[_this.getFrame()];
    };

    /**
     * executeSound
     * @param sound
     */
    MovieClip.prototype.executeSound = function(sound)
    {
        var soundId = sound.SoundId;
        if (!(soundId in character)) {
            return 0;
        }
        
        var tag = character[soundId];
        var soundInfo = tag.SoundInfo;
        var audio = sound.Audio;
        if (soundInfo.SyncStop) {
            audio.stop();
        } else {
            if (soundInfo.HasLoops) {
                audio.loopCount = soundInfo.LoopCount;
                var loopSound = function()
                {
                    this.loopCount--;
                    if (!this.loopCount) {
                        this.removeEventListener('ended', loopSound, false);
                    } else {
                        this.currentTime = 0;
                        this.play();
                    }
                };
                audio.addEventListener('ended', loopSound, false);
            }

            if (soundInfo.HasInPoint) {
                audio.currentTime = soundInfo.InPoint;
            }

            audio.currentTime = 0;
            audio.play();
            this.soundStopFlag = true;
        }
    };

    /**
     * addTags
     * @param frame
     * @param tag
     */
    MovieClip.prototype.addTag = function(frame, tag)
    {
        var tags = this.addTags;
        if (!(frame in tags)) {
            tags[frame] = [];
        }
        tags[frame][tag.Depth] = tag;
    };

    /**
     * getAddTags
     * @returns {*}
     */
    MovieClip.prototype.getAddTags = function()
    {
        var _this = this;
        if (_this.frameTags == null) {
            _this.setAddTags();
        }
        return _this.frameTags;
    };

    /**
     *
     * @returns {*}
     */
    MovieClip.prototype.setAddTags = function()
    {
        var _this = this;
        var frame = _this.getFrame();
        _this.frameTags = (frame in _this.addTags)
            ? _this.addTags[frame]
            : [];
    };

    /**
     * addRemoveTag
     * @param frame
     * @param tag
     */
    MovieClip.prototype.addRemoveTag = function(frame, tag)
    {
        var tags = this.removeTags;
        if (!(frame in tags)) {
            tags[frame] = [];
        }
        tags[frame][tags[frame].length] = tag.Depth;
    };

    /**
     * getRemoveTags
     * @returns {*}
     */
    MovieClip.prototype.getRemoveTags = function()
    {
        var _this = this;
        return _this.removeTags[_this.getFrame()];
    };

    /**
     * remove
     */
    MovieClip.prototype.remove = function()
    {
        var _this = this;
        var tags = _this.getRemoveTags();
        var removeFrame = _this.getFrame() - 1;
        if (tags != undefined) {
            for (var i = tags.length; i--;) {
                if (!(i in tags)) {
                    continue;
                }

                if (!(removeFrame in _this.addTags)) {
                    continue;
                }

                var depth = tags[i];
                var addTags = _this.addTags[removeFrame];
                if (!(depth in addTags)) {
                    continue;
                }

                var obj = addTags[depth];
                if (obj instanceof MovieClip) {
                    obj.reset(true, 1);
                }
            }
        }
    };

    /**
     * reset
     * @param isRemove
     * @param resetFrame
     */
    MovieClip.prototype.reset = function(isRemove, resetFrame)
    {
        var _this = this;
        var _clone = clone;
        var controlTags = _this.controlTags;
        var originTags = _this.originTags;
        if (controlTags != undefined) {
            var frame = controlTags.length;
            if (frame > 1) {
                for (; --frame;) {
                    if (!(frame in controlTags)) {
                        continue;
                    }

                    var cTags = controlTags[frame];
                    for (var depth = cTags.length; --depth;) {
                        if (!(depth in cTags)) {
                            continue;
                        }

                        var tag = cTags[depth];
                        var obj = null;
                        if (frame in _this.addTags
                            && depth in _this.addTags[frame]
                        ) {
                            obj = _this.addTags[frame][depth];
                            if (obj instanceof MovieClip) {
                                // loopは無視
                                if ((!isRemove && tag.Ratio == undefined)
                                    || tag.Ratio < resetFrame
                                ) {
                                    continue;
                                }

                                originTags[frame][depth].Matrix = _clone(tag._Matrix);
                                originTags[frame][depth].ColorTransform = _clone(tag._ColorTransform);
                                obj.reset(true, 1);
                            }
                        }
                    }
                }
            }
        }

        if (isRemove) {
            _this.play();
            _this.setVisible(1);
        }

        _this.setFrame(resetFrame);
        _this.isAction = true;
        _this.soundStopFlag = false;
    };

    /**
     * eventDispatcher
     */
    MovieClip.prototype.eventDispatcher = function()
    {
        var _this = this;
        _this.dispatchEvent('onEnterFrame');

        var addTags = _this.getAddTags();
        var _eventDispatcher = _this.eventDispatcher;
        var _btnCallback = _this.btnCallback;
        var length = addTags.length;
        for (;length--;) {
            if (!(length in addTags)) {
                continue;
            }

            var obj = addTags[length];
            if (obj instanceof MovieClip) {
                _eventDispatcher.call(obj);
            } else if (obj.characters instanceof Array) {
                _btnCallback.call(_this, obj, _eventDispatcher);
            }
        }
    };

    /**
     * addActions
     */
    MovieClip.prototype.addActions = function()
    {
        var _this = this;
        var frameTags = _this.getAddTags();
        var _addActions = _this.addActions;
        var _btnCallback = _this.btnCallback;
        var length = frameTags.length;
        for (var depth = 1; depth < length; depth++) {
            if (!(depth in frameTags)) {
                continue;
            }

            var tag = frameTags[depth];
            if (tag instanceof MovieClip) {
                _addActions.call(tag);
            } else if (tag.characters instanceof Array) {
                _btnCallback.call(_this, tag, _addActions);
            }
        }

        if (_this.isAction) {
            var as = _this.getActions(_this.getFrame());
            if (as != undefined) {
                actions[_this.instanceId] = {as: as, mc: _this};
            }
            _this.isAction = false;
        }
    };

    /**
     * getName
     * @returns {*}
     */
    MovieClip.prototype.getName = function()
    {
        return this._name;
    };

    /**
     * setName
     * @param name
     */
    MovieClip.prototype.setName = function(name)
    {
        this._name = name;
    };

    /**
     * getParent
     * @returns {*}
     */
    MovieClip.prototype.getParent = function()
    {
        return this.parent;
    };

    /**
     * setParent
     * @param parent
     */
    MovieClip.prototype.setParent = function(parent)
    {
        this.parent = parent;
    };

    /**
     * getControlTag
     * @returns {*}
     */
    MovieClip.prototype.getControlTag = function()
    {
        var _this = this;
        return _this.controlTags[_this.getFrame()];
    };

    /**
     * getOriginTag
     * @returns {*}
     */
    MovieClip.prototype.getOriginTag = function()
    {
        var _this = this;
        return _this.originTags[_this.getFrame()];
    };

    /**
     * getMatrix
     * @returns {*}
     */
    MovieClip.prototype.getMatrix = function()
    {
        var _this = this;
        if (_this.instanceId == 0) {
            return [scale,0,0,scale,0,0];
        }

        _this.setMatrix();
        return _this.matrix;
    };

    /**
     * setMatrix
     */
    MovieClip.prototype.setMatrix = function()
    {
        var _this = this;
        var parent = _this.getParent();
        var oTags = parent.getOriginTag();
        if (oTags != undefined) {
            var level = _this.getLevel();
            if (level in oTags) {
                var oTag = oTags[level];
                _this.matrix = oTag.Matrix;
            }
        }

        if (_this.matrix == undefined) {
            _this.matrix = [1,0,0,1,0,0];
        }
    };

    /**
     * getColorTransform
     * @returns {*}
     */
    MovieClip.prototype.getColorTransform = function()
    {
        var _this = this;
        if (_this.instanceId == 0) {
            return [1,1,1,1,0,0,0,0];
        }

        _this.setColorTransform();
        return _this.colorTransform;
    };

    /**
     * setColorTransform
     */
    MovieClip.prototype.setColorTransform = function()
    {
        var _this = this;
        var parent = _this.getParent();
        var oTags = parent.getOriginTag();
        if (oTags != undefined) {
            var level = _this.getLevel();
            if (level in oTags) {
                var oTag = oTags[level];
                _this.colorTransform = oTag.ColorTransform;
            }
        }

        if (_this.colorTransform == undefined) {
            _this.colorTransform = [1,1,1,1,0,0,0,0];
        }
    };

    /**
     * getX
     * @returns {*}
     */
    MovieClip.prototype.getX = function()
    {
        var _this = this;
        var Matrix = _this.getMatrix();
        return Matrix[4]/20;
    };

    /**
     * setX
     * @param x
     */
    MovieClip.prototype.setX = function(x)
    {
        var _this = this;
        var Matrix = _this.getMatrix();
        Matrix[4] = x*20;
    };

    /**
     * getY
     * @returns {*}
     */
    MovieClip.prototype.getY = function()
    {
        var _this = this;
        var Matrix = _this.getMatrix();
        return Matrix[5]/20;
    };

    /**
     * setY
     * @param y
     */
    MovieClip.prototype.setY = function(y)
    {
        var _this = this;
        var Matrix = _this.getMatrix();
        Matrix[5] = y*20;
    };

    /**
     * getBounds
     * @param parentMatrix
     * @returns {{Xmax: number, Xmin: number, Ymax: number, Ymin: number}}
     */
    MovieClip.prototype.getBounds = function(parentMatrix)
    {
        var _this = this;
        var _multiplicationMatrix = _this.multiplicationMatrix;
        var no = _Number.MAX_VALUE;
        var Xmax = -no;
        var Ymax = -no;
        var Xmin = no;
        var Ymin = no;

        var tags = _this.getAddTags();
        var _getBounds = _this.getBounds;
        var _getMatrix = _this.getMatrix;
        for (var i = tags.length; i--;) {
            if (!(i in tags)) {
                continue;
            }

            var tag = tags[i];
            if (tag.clipDepth) {
                continue;
            }

            var Matrix = (tag instanceof MovieClip)
                ? _getMatrix.call(tag)
                : tag.matrix;

            var matrix = (parentMatrix != undefined)
                ? _multiplicationMatrix.call(tag, parentMatrix, Matrix)
                : Matrix;

            if (tag instanceof MovieClip) {
                var bounds = _getBounds.call(tag, matrix);
                if (bounds) {
                    Xmax = _max(Xmax, bounds.Xmax);
                    Xmin = _min(Xmin, bounds.Xmin);
                    Ymax = _max(Ymax, bounds.Ymax);
                    Ymin = _min(Ymin, bounds.Ymin);
                }
                continue;
            } else {
                bounds = character[tag.characterId];
            }

            if (bounds) {
                var x0 = bounds.Xmax * matrix[0] + bounds.Ymax * matrix[2] + matrix[4];
                var x1 = bounds.Xmax * matrix[0] + bounds.Ymin * matrix[2] + matrix[4];
                var x2 = bounds.Xmin * matrix[0] + bounds.Ymax * matrix[2] + matrix[4];
                var x3 = bounds.Xmin * matrix[0] + bounds.Ymin * matrix[2] + matrix[4];
                var y0 = bounds.Xmax * matrix[1] + bounds.Ymax * matrix[3] + matrix[5];
                var y1 = bounds.Xmax * matrix[1] + bounds.Ymin * matrix[3] + matrix[5];
                var y2 = bounds.Xmin * matrix[1] + bounds.Ymax * matrix[3] + matrix[5];
                var y3 = bounds.Xmin * matrix[1] + bounds.Ymin * matrix[3] + matrix[5];

                Xmax = _max(_max(_max(_max(Xmax, x0), x1), x2), x3);
                Xmin = _min(_min(_min(_min(Xmin, x0), x1), x2), x3);
                Ymax = _max(_max(_max(_max(Ymax, y0), y1), y2), y3);
                Ymin = _min(_min(_min(_min(Ymin, y0), y1), y2), y3);
            }
        }

        return {Xmax: Xmax, Xmin: Xmin, Ymax: Ymax, Ymin: Ymin};
    };

    /**
     * getWidth
     * @returns {number}
     */
    MovieClip.prototype.getWidth = function()
    {
        var _this = this;
        var bounds = _this.getBounds(_this.getMatrix());
        var width = bounds.Xmax - bounds.Xmin;
        if (width < 0) {
            width *= -1;
        }
        return width/20;
    };

    /**
     * setWidth
     * @param width
     */
    MovieClip.prototype.setWidth = function(width)
    {
        var _this = this;
        var Matrix = _this.getMatrix();
        Matrix[0] = width * Matrix[0] / _this.getWidth();
    };

    /**
     * getHeight
     * @returns {number}
     */
    MovieClip.prototype.getHeight = function()
    {
        var _this = this;
        var bounds = _this.getBounds(_this.getMatrix());
        var height = bounds.Ymax - bounds.Ymin;
        if (height < 0) {
            height *= -1;
        }
        return height/20;
    };

    /**
     * setHeight
     * @param height
     */
    MovieClip.prototype.setHeight = function(height)
    {
        var _this = this;
        var Matrix = _this.getMatrix();
        Matrix[3] = height * Matrix[3] / _this.getHeight();
    };

    /**
     * getXScale
     * @returns {*}
     */
    MovieClip.prototype.getXScale = function()
    {
        var _this = this;
        var Matrix = _this.getMatrix();
        return _sqrt(Matrix[0] * Matrix[0] + Matrix[1] * Matrix[1]) * 100;
    };

    /**
     * setXScale
     * @param xscale
     */
    MovieClip.prototype.setXScale = function(xscale)
    {
        var _this = this;
        var Matrix = _this.getMatrix();
        var radianX = _atan2(Matrix[1], Matrix[0]);

        xscale /= 100;
        Matrix[0] = xscale * _cos(radianX);
        Matrix[1] = xscale * _sin(radianX);
    };

    /**
     * getYScale
     * @returns {*}
     */
    MovieClip.prototype.getYScale = function()
    {
        var _this = this;
        var Matrix = _this.getMatrix();
        return _sqrt(Matrix[2] * Matrix[2] + Matrix[3] * Matrix[3]) * 100;
    };

    /**
     * setScale
     * @param yscale
     */
    MovieClip.prototype.setYScale = function(yscale)
    {
        var _this = this;
        var Matrix = _this.getMatrix();
        var radianY = _atan2(-Matrix[2], Matrix[3]);

        yscale /= 100;
        Matrix[2] = -yscale * _sin(radianY);
        Matrix[3] = yscale * _cos(radianY);
    };

    /**
     * getRotation
     * @returns {number}
     */
    MovieClip.prototype.getRotation = function()
    {
        var _this = this;
        var Matrix = _this.getMatrix();
        return _atan2(Matrix[1], Matrix[0]) * 180 / _PI;
    };

    /**
     * setRotation
     * @param rotation
     */
    MovieClip.prototype.setRotation = function(rotation)
    {
        var _this = this;
        var Matrix = _this.getMatrix();
        var radianX = _atan2(Matrix[1], Matrix[0]);
        var radianY = _atan2(-Matrix[2], Matrix[3]);
        var ScaleX = _sqrt(Matrix[0] * Matrix[0] + Matrix[1] * Matrix[1]);
        var ScaleY = _sqrt(Matrix[2] * Matrix[2] + Matrix[3] * Matrix[3]);

        rotation *= _PI / 180;
        radianY += rotation - radianX;
        radianX = rotation;

        Matrix[0] = ScaleX * _cos(radianX);
        Matrix[1] = ScaleX * _sin(radianX);
        Matrix[2] = -ScaleY * _sin(radianY);
        Matrix[3] = ScaleY * _cos(radianY);
    };

    /**
     * getActions
     * @param frame
     * @returns {*}
     */
    MovieClip.prototype.getActions = function(frame)
    {
        return this.actions[frame];
    };

    /**
     * setActions
     * @param frame
     * @param actionScript
     */
    MovieClip.prototype.setActions = function(frame, actionScript)
    {
        var actions = this.actions;
        if (!(frame in actions)) {
            actions[frame] = [];
        }

        var len = actions[frame].length;
        actions[frame][len] = actionScript;
    };

    /**
     * render
     * @param ctx
     * @param matrix
     * @param colorTransform
     */
    MovieClip.prototype.render = function(ctx, matrix, colorTransform)
    {
        var _this = this;
        var frameTags = _this.getAddTags();
        var length = frameTags.length;

        // sound
        if (!_this.soundStopFlag) {
            var sounds = _this.getSounds();
            if (sounds != undefined) {
                var sLen = sounds.length;
                for (var idx = 0; idx < sLen; idx++) {
                    if (!(idx in sounds)) {
                        continue;
                    }

                    var sound = sounds[idx];
                    _this.executeSound(sound);
                }
            }
        }

        var _render = _this.render;
        var _renderMorphShape = _this.renderMorphShape;
        var _renderShape = _this.renderShape;
        var _renderButton = _this.renderButton;
        var _renderText = _this.renderText;
        var _renderEditText = _this.renderEditText;
        var _getMatrix = _this.getMatrix;
        var _getColorTransform = _this.getColorTransform;
        var _multiplicationMatrix = _this.multiplicationMatrix;
        var _multiplicationColor = _this.multiplicationColor;
        var _drawImage = ctx.drawImage;
        var _setTransform = ctx.setTransform;
        for (var depth = 1; depth < length; depth++) {
            if (!(depth in frameTags)) {
                continue;
            }

            var obj = frameTags[depth];

            // mask 終了
            if (_this.isClipDepth && depth > _this.clipDepth) {
                _this.isClipDepth = false;
                _this.clipDepth = 0;
                ctx.restore();
            }

            // mask 開始
            if (obj.isClipDepth) {
                _this.isClipDepth = true;
                _this.clipDepth = obj.clipDepth;
                ctx.save();
                ctx.beginPath();
            }

            if (obj instanceof MovieClip) {
                var renderMatrix = _multiplicationMatrix.call(
                    obj,
                    matrix,
                    _getMatrix.call(obj)
                );

                var renderColorTransform = _multiplicationColor.call(
                    obj,
                    colorTransform,
                    _getColorTransform.call(obj)
                );

                // _alpha or _visible
                if (obj.getAlpha() == 0 || obj.getVisible() == 0) {
                    continue;
                }

                _render.call(obj, ctx, renderMatrix, renderColorTransform);
            } else {
                if (!(obj.characterId in character)) {
                    continue;
                }

                var char = character[obj.characterId];
                var renderMatrix = matrix;
                if (obj.matrix != undefined) {
                    renderMatrix = _multiplicationMatrix.call(
                        _this,
                        matrix,
                        obj.matrix
                    );
                }

                var renderColorTransform = colorTransform;
                if (obj.colorTransform != undefined) {
                    renderColorTransform = _multiplicationColor.call(
                        _this,
                        colorTransform,
                        obj.colorTransform
                    );
                }

                var cache = null;
                switch (char.tagType) {
                    case 46: // MorphShape
                    case 84: // MorphShape2
                        var controlTag = _this.getControlTag();
                        var cTag = controlTag[depth];
                        cache = _renderMorphShape.call(_this, ctx, renderMatrix, renderColorTransform, obj, cTag.Ratio);
                        break;
                    case 2:  // DefineShape
                    case 22: // DefineShape2
                    case 32: // DefineShape3
                    case 83: // DefineShape4
                        cache = _renderShape.call(_this, ctx, renderMatrix, renderColorTransform, obj);
                        break;
                    case 7: // DefineButton
                    case 34: // DefineButton2
                        _renderButton.call(_this, ctx, renderMatrix, renderColorTransform, obj, depth);
                        continue;
                    case 11: // DefineText
                    case 33: // DefineText2
                        _renderText.call(_this, ctx, renderMatrix, renderColorTransform, obj);
                        continue;
                    case 37: // DefineEditText
                        _renderEditText.call(_this, ctx, renderMatrix, renderColorTransform, obj);
                        continue;
                } //  switch

                if (cache instanceof CanvasRenderingContext2D) {
                    var canvas = cache.canvas;
                    if (canvas.width > 0 && canvas.height > 0) {
                        var x = _ceil(cache.offsetX + renderMatrix[4] - 0.5);
                        var y = _ceil(cache.offsetY + renderMatrix[5] - 0.5);
                        _setTransform.call(ctx, 1, 0, 0, 1, x, y);
                        _drawImage.call(ctx, canvas, 0, 0);
                    }
                }
            }
        }

        // mask 終了
        if (_this.isClipDepth) {
            _this.isClipDepth = false;
            _this.clipDepth = 0;
            ctx.restore();
        }

        _this._nextFrame = 0;
        _this.putFrame();
    };

    /**
     * renderShape
     * @param ctx
     * @param matrix
     * @param colorTransform
     * @param tag
     * @returns {*}
     */
    MovieClip.prototype.renderShape = function(ctx, matrix, colorTransform, tag)
    {
        var _this = this;
        var cacheKey = cacheStore.generateKey(
            'Shape',
            tag.characterId,
            matrix,
            colorTransform
        );

        var cache = cacheStore.get(cacheKey);
        if (!cache || tag.isClipDepth) {
            var char = character[tag.characterId];
            var _executeRenderShape = _this.executeRenderShape;
            var _setTransform = ctx.setTransform;

            var isCache = false;

            cache = ctx;
            _setTransform.call(
                cache,
                matrix[0],
                matrix[1],
                matrix[2],
                matrix[3],
                matrix[4],
                matrix[5]
            );

            if (cacheMode && !tag.isClipDepth) {
                var _renderBoundMatrix = _this.renderBoundMatrix;
                var rBound = _renderBoundMatrix.call(_this, char, matrix);
                var W = _ceil(rBound[2]);
                var H = _ceil(rBound[3]);

                if (width > W && height > H) {
                    isCache = true;

                    var canvas = cacheStore.getCanvas();
                    canvas.width = W;
                    canvas.height = H;
                    cache = canvas.getContext("2d");
                    cache.offsetX = rBound[0];
                    cache.offsetY = rBound[1];
                    _setTransform.call(
                        cache,
                        matrix[0],
                        matrix[1],
                        matrix[2],
                        matrix[3],
                        -rBound[0],
                        -rBound[1]
                    );
                }
            }

            // 実行
            cache = _executeRenderShape.call(_this, cache, matrix, colorTransform, char.data, tag.isClipDepth);

            // cache
            if (!tag.isClipDepth && isCache) {
                cacheStore.set(cacheKey, cache);
            } else {
                cache = null;
            }
        }

        return cache;
    };

    /**
     * executeRenderShape
     * @param ctx
     * @param matrix
     * @param colorTransform
     * @param shapes
     * @param isClipDepth
     * @returns {*}
     */
    MovieClip.prototype.executeRenderShape = function(ctx, matrix, colorTransform, shapes, isClipDepth)
    {
        var _this = this;
        var shapeLength = shapes.length;
        var _generateColorTransform = _this.generateColorTransform;
        var _generateImageTransform = _this.generateImageTransform;
        var _transform = ctx.transform;
        var _drawImage = ctx.drawImage;

        for (var idx = 0; idx < shapeLength; idx++) {
            if (!(idx in shapes)) {
                continue;
            }

            var styles = shapes[idx];
            var styleLength = styles.length;
            for (var sKey = 0; sKey < styleLength; sKey++) {
                if (!(sKey in styles)) {
                    continue;
                }

                var styleObj = styles[sKey];
                var cmd = styleObj.cmd;

                if (isClipDepth) {
                    cmd(ctx);
                    continue;
                }

                var styleType = styleObj.styleType;
                var isStroke = (styleObj.Width != undefined);

                ctx.beginPath();
                cmd(ctx);
                switch (styleType) {
                    case 0x00:
                        var color = styleObj.Color;
                        color = _generateColorTransform.call(_this, color, colorTransform);
                        var css = "rgba("
                            + color.R
                            +", "+ color.G
                            +", "+ color.B
                            +", "+ color.A
                        +")";

                        if (isStroke) {
                            ctx.strokeStyle = css;
                            var xScale = _sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
                            var yScale = _sqrt(matrix[3] * matrix[3] + matrix[2] * matrix[2]);
                            var lineWidth = _max(styleObj.Width, 1 / _min(xScale, yScale));
                            ctx.lineWidth = lineWidth;
                            ctx.lineCap = "round";
                            ctx.lineJoin = "round";
                            ctx.stroke();
                        } else {
                            ctx.fillStyle = css;
                            ctx.fill();
                        }

                        break;

                    // グラデーション
                    case 0x10:
                    case 0x12:
                    case 0x13:
                        var gradientObj = styleObj.Color;
                        var gradientMatrix = gradientObj.gradientMatrix;

                        ctx.save();
                        _transform.call(
                            ctx,
                            gradientMatrix[0],
                            gradientMatrix[1],
                            gradientMatrix[2],
                            gradientMatrix[3],
                            gradientMatrix[4],
                            gradientMatrix[5]
                        );

                        var type = gradientObj.fillStyleType;
                        if (type == 18 || type == 19) {
                            var css = ctx.createRadialGradient(0, 0, 0, 0, 0, 16384);
                        } else if (type == 16) {
                            var css = ctx.createLinearGradient(-16384, 0, 16384, 0);
                        }

                        var records = gradientObj.gradient.GradientRecords;
                        var rLength = records.length;
                        for (var rIdx = 0; rIdx < rLength; rIdx++) {
                            var record = records[rIdx];
                            var color = record.Color;
                            color = _generateColorTransform.call(_this, color, colorTransform);
                            css.addColorStop(
                                record.Ratio,
                                'rgba('
                                    + color.R +', '
                                    + color.G +', '
                                    + color.B +', '
                                    + color.A +')'
                            );
                        }

                        if (isStroke) {
                            ctx.strokeStyle = css;
                            var xScale = _sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
                            var yScale = _sqrt(matrix[3] * matrix[3] + matrix[2] * matrix[2]);
                            var lineWidth = _max(styleObj.Width, 1 / _min(xScale, yScale));
                            ctx.lineWidth = lineWidth;
                            ctx.lineCap = "round";
                            ctx.lineJoin = "round";
                            ctx.stroke();
                        } else {
                            ctx.fillStyle = css;
                            ctx.fill();
                        }

                        ctx.restore();
                        break;

                    // bitmap
                    case 0x40:
                    case 0x41:
                    case 0x42:
                    case 0x43:
                        var bitmapObj = styleObj.Color;
                        var bitmapId = bitmapObj.bitmapId;
                        var bitmapMatrix = bitmapObj.bitmapMatrix;
                        var repeat = (styleType == 0x40 || styleType == 0x42) ? 'repeat' : 'no-repeat';

                        var bitmapCacheKey = cacheStore.generateKey(
                            'Bitmap',
                            bitmapId + "_" + repeat,
                            undefined,
                            colorTransform
                        );

                        var image = cacheStore.get(bitmapCacheKey);
                        if (image == undefined) {
                            image = character[bitmapId];

                            if (colorTransform[0] != 1
                                || colorTransform[1] != 1
                                || colorTransform[2] != 1
                                || colorTransform[4] != 0
                                || colorTransform[5] != 0
                                || colorTransform[6] != 0
                            ) {
                                var canvas = cacheStore.getCanvas();
                                canvas.width = image.canvas.width;
                                canvas.height = image.canvas.height;
                                var imageContext = canvas.getContext("2d");
                                _drawImage.call(imageContext, image.canvas, 0, 0);

                                image = _generateImageTransform.call(_this, imageContext, colorTransform);
                                cacheStore.set(bitmapCacheKey, image);
                            } else {
                                var alpha = _max(0, _min((255 * colorTransform[3]) + colorTransform[7], 255)) / 255;
                                ctx.globalAlpha = alpha;
                            }
                        }

                        ctx.save();
                        if (styleType == 0x41 || styleType == 0x43) {
                            ctx.clip();
                            _transform.call(
                                ctx,
                                bitmapMatrix[0],
                                bitmapMatrix[1],
                                bitmapMatrix[2],
                                bitmapMatrix[3],
                                bitmapMatrix[4],
                                bitmapMatrix[5]
                            );
                            _drawImage.call(ctx, image.canvas, 0, 0);
                        } else {
                            ctx.fillStyle = context.createPattern(image.canvas, repeat);
                            _transform.call(
                                ctx,
                                bitmapMatrix[0],
                                bitmapMatrix[1],
                                bitmapMatrix[2],
                                bitmapMatrix[3],
                                bitmapMatrix[4],
                                bitmapMatrix[5]
                            );
                            ctx.fill();
                        }
                        ctx.restore();

                        break;
                }
            }
        }

        if (isClipDepth) {
            ctx.clip();

            if (isAndroid && isChrome) {
                _drawImage.call(tmpContext, ctx.canvas, 0, 0);
                ctx.save();
                ctx.setTransform(1,0,0,1,0,0);
                ctx.beginPath();
                ctx.clearRect(0, 0, ctx.canvas.width+1, ctx.canvas.height);
                _drawImage.call(ctx, tmpContext.canvas, 0, 0);
                ctx.restore();
                clearTmp();
            }
        }

        var resetCss = 'rgba(0,0,0,1)';
        ctx.strokeStyle = resetCss;
        ctx.fillStyle = resetCss;
        ctx.globalAlpha = 1;

        return ctx;
    };

    /**
     * renderMorphShape
     * @param ctx
     * @param matrix
     * @param colorTransform
     * @param tag
     * @param ratio
     * @returns {*}
     */
    MovieClip.prototype.renderMorphShape = function(ctx, matrix, colorTransform, tag, ratio)
    {
        var _this = this;
        ratio = ratio | 0;
        var cacheKey = cacheStore.generateKey(
            'MorphShape',
            tag.characterId +"_"+ ratio,
            matrix,
            colorTransform
        );

        var cache = cacheStore.get(cacheKey);
        if (cache == undefined) {
            var isCache = false;
            var _executeRenderShape = _this.executeRenderShape;
            var _setTransform = ctx.setTransform;

            cache = ctx;
            _setTransform.call(
                cache,
                matrix[0],
                matrix[1],
                matrix[2],
                matrix[3],
                matrix[4],
                matrix[5]
            );

            if (cacheMode) {
                var _renderBoundMatrix = _this.renderBoundMatrix;
                var rBound = _renderBoundMatrix.call(_this, tag, matrix);
                var W = _ceil(rBound[2]);
                var H = _ceil(rBound[3]);
                if (width > W && height > H) {
                    isCache = true;

                    var canvas = cacheStore.getCanvas();
                    canvas.width = _ceil(rBound[2]);
                    canvas.height = _ceil(rBound[3]);
                    cache = canvas.getContext("2d");
                    cache.offsetX = rBound[0];
                    cache.offsetY = rBound[1];
                    _setTransform.call(
                        cache,
                        matrix[0],
                        matrix[1],
                        matrix[2],
                        matrix[3],
                        -rBound[0],
                        -rBound[1]
                    );
                }
            }

            // 実行
            cache = _executeRenderShape.call(_this, cache, matrix, colorTransform, tag.data, false);

            if (isCache) {
                cacheStore.set(cacheKey, cache);
            } else {
                cache = null;
            }

            ctx.globalAlpha = 1;
        }

        return cache;
    };

    /**
     * renderText
     * @param ctx
     * @param matrix
     * @param colorTransform
     * @param tag
     */
    MovieClip.prototype.renderText = function(ctx, matrix, colorTransform, tag)
    {
        var _this = this;
        var char = character[tag.characterId];
        var Matrix = char.Matrix;
        var TextRecords = char.TextRecords;
        var len = TextRecords.length;
        var defineFont = {};
        var textHeight = 0;
        var YOffset = 0;
        var XOffset = 0;

        var _generateColorTransform = _this.generateColorTransform;
        var _renderGlyph = _this.renderGlyph;
        var _setTransform = ctx.setTransform;
        var _transform = ctx.transform;
        for (var i = 0; i < len; i++) {
            _setTransform.call(
                ctx,
                matrix[0],
                matrix[1],
                matrix[2],
                matrix[3],
                matrix[4],
                matrix[5]
            );

            var textRecord = TextRecords[i];

            // font master
            if (textRecord.FontId != undefined) {
                defineFont = character[textRecord.FontId];
            }

            // text color
            if (textRecord.TextColor != undefined) {
                var color = textRecord.TextColor;
                color = _generateColorTransform.call(_this, color, colorTransform);
                ctx.fillStyle = 'rgb('+color.R+','+color.G+','+color.B+')';
                ctx.globalAlpha = color.A;
            }

            // text height
            if (textRecord.TextHeight != undefined) {
                textHeight = textRecord.TextHeight;
            }

            var glyphEntries = textRecord.GlyphEntries;
            var count = textRecord.GlyphCount;

            if (textRecord.StyleFlagsHasXOffset) {
                XOffset = textRecord.XOffset;
            }

            if (textRecord.StyleFlagsHasYOffset) {
                YOffset = textRecord.YOffset;
            }

            var scale = textHeight / 1024;
            for (var g = 0; g < count; g++) {
                var glyphEntry = glyphEntries[g];
                var idx = glyphEntry.GlyphIndex;
                var records = defineFont.GlyphShapeTable[idx];

                ctx.save();
                _transform.call(
                    ctx,
                    scale,
                    Matrix[1],
                    Matrix[2],
                    scale,
                    (Matrix[4] + XOffset),
                    (Matrix[5] + YOffset)
                );
                ctx = _renderGlyph.call(_this, records, ctx);
                ctx.restore();

                XOffset += glyphEntry.GlyphAdvance;
            }
        }

        ctx.globalAlpha = 1;
    };

    /**
     * renderGlyph
     * @param records
     * @param ctx
     */
    MovieClip.prototype.renderGlyph = function (records, ctx)
    {
        if (records.data == undefined) {
            records.data = swftag.vectorToCanvas(records);
        }

        var shapes = records.data;
        var shapeLength = shapes.length;
        for (var idx = 0; idx < shapeLength; idx++) {
            if (!(idx in shapes)) {
                continue;
            }

            var styles = shapes[idx];
            var styleLength = styles.length;
            for (var sKey = 0; sKey < styleLength; sKey++) {
                var styleObj = styles[sKey];
                var cmd = styleObj.cmd;
                ctx.beginPath();
                cmd(ctx);
                ctx.fill();
            }
        }

        return ctx;
    };

    /**
     * renderEditText
     * @param ctx
     * @param matrix
     * @param colorTransform
     * @param tag
     */
    MovieClip.prototype.renderEditText = function(ctx, matrix, colorTransform, tag)
    {
        var _this = this;
        var char = character[tag.characterId];
        var data = char.data;
        var _setTransform = ctx.setTransform;

        var inText = data.InitialText;
        if (data.VariableName != '') {
            var variableName = data.VariableName;
            var splitData = variableName.split(':');
            if (splitData.length == 1) {
                var key = splitData[0];
                var mc = _this;
            } else {
                var key = splitData[1];
                var mc = _this.getMovieClip(splitData[0]);
            }

            if (mc != null) {
                inText = mc.getVariable(key);
                if (inText == undefined) {
                    inText = data.InitialText;
                } else if (inText == null) {
                    inText = '';
                }
            }
        }
        inText += '';

        if (inText == '') {
            return undefined;
        }

        _setTransform.call(
            ctx,
            matrix[0]*20,
            matrix[1]*20,
            matrix[2]*20,
            matrix[3]*20,
            matrix[4],
            matrix[5]
        );
        ctx.textBaseline = "top";

        // border
        var XMax = data.Bound.Xmax / 20;
        var XMin = data.Bound.Xmin / 20;
        var YMax = data.Bound.Ymax / 20;
        var YMin = data.Bound.Ymin / 20;
        var W = _ceil(XMax - XMin);
        var H = _ceil(YMax - YMin);

        if (data.Border) {
            ctx.beginPath();
            ctx.rect(XMin, YMin, W, H);
            ctx.fillStyle = "#fff";
            ctx.strokeStyle = "#000";
            ctx.lineWidth = 1;
            ctx.globalAlpha = 1;
            ctx.fill();
            ctx.stroke();
        }

        ctx.save();
        ctx.beginPath();
        ctx.rect(XMin, YMin, W, H);
        ctx.clip();

        // 文字色
        var color = {R: 0, G: 0, B: 0, A: 1};
        if (data.HasTextColor) {
            color = data.TextColor;
        }

        color = _this.generateColorTransform(color, colorTransform);
        ctx.fillStyle = 'rgb('
            + color.R +','
            + color.G +','
            + color.B +
        ')';
        ctx.globalAlpha = color.A;

        // font type
        var fontHeight = 0;
        var fontName = '';
        var fontType = '';
        var useOutlines = false;
        if (data.HasFont) {
            var fontData = character[data.FontID];
            useOutlines = (
                fontData.FontFlagsHasLayout
                && data.UseOutlines
                && !data.Password
            );

            fontHeight = data.FontHeight / 20;
            fontName = "'"+ fontData.FontName +"', 'HiraKakuProN-W3', 'sans-serif'";
            if (fontData.FontFlagsItalic) {
                fontType += 'italic ';
            }

            if (fontData.FontFlagsBold) {
                fontType += 'bold ';
            }
        }
        ctx.font = fontType + fontHeight +'px '+ fontName;

        // 座標
        var leading = 0;
        var indent = 0;
        var leftMargin = 0;
        var rightMargin = 0;
        var dx = 0;
        var dy = 0;

        var txt = '';
        var wordWrap = data.WordWrap;
        var multiLine = data.Multiline;
        var splitData = inText.split('@LFCR');
        var textLength = splitData.length;

        // アウトラインフォント
        if (useOutlines) {
            var CodeTable = fontData.CodeTable;
            var GlyphShapeTable = fontData.GlyphShapeTable;
            var FontAdvanceTable = fontData.FontAdvanceTable;
            var fontScale = data.FontHeight / 1024;

            leading += (fontData.FontAscent + fontData.FontDescent)
                * fontScale;

            var YOffset = (fontData.FontAscent * fontScale);
            var _renderGlyph = _this.renderGlyph;
            var _transform = ctx.transform;
            for (var i = 0; i < textLength; i++) {
                txt = splitData[i];

                // 埋め込まれてないもの対応の為に一回全体のサイズを取得
                var XOffset = XMin*20;
                var txtLength = txt.length;
                var textWidth = 0;
                for (var idx = 0; idx < txtLength; idx++) {
                    var str = txt[idx];
                    var key = CodeTable.indexOf(str.charCodeAt(0));
                    if (key < 0) {
                        continue;
                    }
                    textWidth += FontAdvanceTable[key] * fontScale;
                }

                // レイアウトに合わせてレンダリング
                if (data.HasLayout) {
                    if (data.Align == 1) {
                        XOffset += W*20 - rightMargin - textWidth - 2;
                    } else if (data.Align == 2) {
                        XOffset += (indent + leftMargin)
                            + ((W*20 - indent - leftMargin - rightMargin - textWidth) / 2);
                    } else {
                        XOffset += indent + leftMargin + 2;
                    }
                }

                for (var idx = 0; idx < txtLength; idx++) {
                    var str = txt[idx];
                    var key = CodeTable.indexOf(str.charCodeAt(0));
                    if (key < 0) {
                        continue;
                    }

                    _setTransform.call(
                        ctx,
                        matrix[0],
                        matrix[1],
                        matrix[2],
                        matrix[3],
                        matrix[4],
                        matrix[5]
                    );
                    _transform.call(
                        ctx,
                        fontScale,
                        0,
                        0,
                        fontScale,
                        XOffset,
                        YOffset
                    );
                    ctx = _renderGlyph.call(_this, GlyphShapeTable[key], ctx);

                    XOffset += FontAdvanceTable[key] * fontScale;
                }

                YOffset += leading;
            }
        } else {
            if (data.HasLayout) {
                leading = data.Leading / 20;
                rightMargin = data.RightMargin / 20;
                leftMargin = data.LeftMargin / 20;
                indent = data.Indent / 20;

                if (data.Align == 1) {
                    ctx.textAlign = "end";
                    dx += (XMax + XMin) - rightMargin;
                } else if (data.Align == 2) {
                    ctx.textAlign = "center";
                    dx += (indent + leftMargin)
                        + (((XMax + XMin) - indent - leftMargin - rightMargin) / 2);
                } else {
                    dx += indent + leftMargin;
                }
            }

            var areaWidth = (XMax + XMin)
                - indent - leftMargin - rightMargin;
            for (var i = 0; i < textLength; i++) {
                txt = splitData[i];
                if (wordWrap && multiLine) {
                    var measureText = ctx.measureText(txt);
                    var txtTotalWidth = measureText.width;
                    if (txtTotalWidth > areaWidth) {
                        var txtLength = txt.length;
                        var joinTxt = '';
                        var joinWidth = fontHeight;
                        for (var t = 0; t < txtLength; t++) {
                            var textOne = ctx.measureText(txt[t]);
                            joinWidth += textOne.width;
                            joinTxt += txt[t];
                            if (joinWidth >= areaWidth || (t + 1) == txtLength) {
                                ctx.fillText(joinTxt, dx, dy, W);
                                joinWidth = fontHeight;
                                joinTxt = '';
                                dy += leading + fontHeight;
                            }
                        }
                    } else {
                        ctx.fillText(txt, dx, dy, W);
                    }
                } else {
                    ctx.fillText(txt, dx, dy, W);
                }
                dy += leading + fontHeight;
            }
        }

        ctx.restore();
        ctx.globalAlpha = 1;
    };

    /**
     * renderButton
     * @param ctx
     * @param matrix
     * @param colorTransform
     * @param tag
     * @param depth
     */
    MovieClip.prototype.renderButton = function(ctx, matrix, colorTransform, tag, depth)
    {
        var _this = this;
        var char = character[tag.characterId];
        var characters = char.characters;

        // enter
        var actions = char.actions;
        if (actions != undefined) {
            for (var length = actions.length; length--;) {
                if (!(length in actions)) {
                    continue;
                }

                var cond = actions[length];
                if (cond.CondKeyPress == 13) {
                    buttonHits[buttonHits.length] = {
                        characterId: tag.characterId,
                        Xmax: width,
                        Xmin: 0,
                        Ymax: height,
                        Ymin: 0,
                        CondKeyPress: cond.CondKeyPress,
                        parent: _this
                    };
                }
            }
        }

        var _render = _this.render;
        var _renderMorphShape = _this.renderMorphShape;
        var _renderShape = _this.renderShape;
        var _renderButton = _this.renderButton;
        var _renderText = _this.renderText;
        var _renderEditText = _this.renderEditText;
        var _getBounds = _this.getBounds;
        var _multiplicationMatrix = _this.multiplicationMatrix;
        var _multiplicationColor = _this.multiplicationColor;
        var _drawImage = ctx.drawImage;
        var _setTransform = ctx.setTransform;

        var length = characters.length;
        for (var d = 1; d < length; d++) {
            if (!(d in characters)) {
                continue;
            }

            var cTags = characters[d];
            var tagLength = cTags.length;
            for (var i = 0; i < tagLength; i++) {
                if (!(i in cTags)) {
                    continue;
                }

                var cache = null;
                var btnChar = cTags[i];
                var tagChar = tag.characters[d][i];

                var renderMatrix = _multiplicationMatrix.call(
                    _this,
                    matrix,
                    btnChar.Matrix
                );

                var renderColorTransform = _multiplicationColor.call(
                    _this,
                    colorTransform,
                    btnChar.ColorTransform
                );

                if (actions != undefined
                    && btnChar.ButtonStateHitTest
                ) {
                    var cacheKey = cacheStore.generateKey(
                        'ButtonHit',
                        tag.characterId,
                        renderMatrix,
                        renderColorTransform
                    );

                    var hitObj = cacheStore.get(cacheKey);
                    if (hitObj == undefined) {
                        if (tagChar instanceof MovieClip) {
                            var bounds = _getBounds.call(tagChar, renderMatrix);
                        } else {
                            var bounds = character[tagChar.characterId];
                        }

                        var no = _Number.MAX_VALUE;
                        var Xmax = -no;
                        var Ymax = -no;
                        var Xmin = no;
                        var Ymin = no;

                        var x0 = bounds.Xmax * renderMatrix[0] + bounds.Ymax * renderMatrix[2] + renderMatrix[4];
                        var x1 = bounds.Xmax * renderMatrix[0] + bounds.Ymin * renderMatrix[2] + renderMatrix[4];
                        var x2 = bounds.Xmin * renderMatrix[0] + bounds.Ymax * renderMatrix[2] + renderMatrix[4];
                        var x3 = bounds.Xmin * renderMatrix[0] + bounds.Ymin * renderMatrix[2] + renderMatrix[4];
                        var y0 = bounds.Xmax * renderMatrix[1] + bounds.Ymax * renderMatrix[3] + renderMatrix[5];
                        var y1 = bounds.Xmax * renderMatrix[1] + bounds.Ymin * renderMatrix[3] + renderMatrix[5];
                        var y2 = bounds.Xmin * renderMatrix[1] + bounds.Ymax * renderMatrix[3] + renderMatrix[5];
                        var y3 = bounds.Xmin * renderMatrix[1] + bounds.Ymin * renderMatrix[3] + renderMatrix[5];

                        Xmax = _max(_max(_max(_max(Xmax, x0), x1), x2), x3);
                        Xmin = _min(_min(_min(_min(Xmin, x0), x1), x2), x3);
                        Ymax = _max(_max(_max(_max(Ymax, y0), y1), y2), y3);
                        Ymin = _min(_min(_min(_min(Ymin, y0), y1), y2), y3);

                        cacheStore.store[cacheKey] = {
                            characterId: tag.characterId,
                            Xmax: Xmax,
                            Xmin: Xmin,
                            Ymax: Ymax,
                            Ymin: Ymin,
                            CondKeyPress: 0,
                            Sound: btnChar.Sound,
                            parent: _this
                        };
                    }
                    buttonHits[buttonHits.length] = hitObj;
                }

                if (touchObj != null
                    && touchObj.characterId == tag.characterId
                ) {
                    if (!btnChar.ButtonStateDown) {
                        continue;
                    }

                    if (tagChar instanceof MovieClip) {
                        tagChar.isButtonRemove = true;
                        tagChar._nextFrame = 0;
                        _render.call(tagChar, ctx, renderMatrix, renderColorTransform);
                    } else {
                        var obj = character[tagChar.characterId];
                        switch (obj.tagType) {
                            case 46: // MorphShape
                            case 84: // MorphShape2
                                var controlTag = _this.getControlTag();
                                var cTag = controlTag[depth];
                                cache = _renderMorphShape.call(_this, ctx, renderMatrix, renderColorTransform, tagChar, cTag.Ratio);
                                break;
                            case 2:  // DefineShape
                            case 22: // DefineShape2
                            case 32: // DefineShape3
                            case 83: // DefineShape4
                                cache = _renderShape.call(_this, ctx, renderMatrix, renderColorTransform, tagChar);
                                if (obj.isClipDepth) {
                                    continue;
                                }
                                break;
                            case 7: // DefineButton
                            case 34: // DefineButton2
                                _renderButton.call(_this, ctx, renderMatrix, renderColorTransform, tagChar);
                                continue;
                            case 11: // DefineText
                            case 33: // DefineText2
                                cache = _renderText.call(_this, ctx, renderMatrix, renderColorTransform, tagChar);
                                break;
                            case 37: // DefineEditText
                                _renderEditText.call(_this, ctx, renderMatrix, renderColorTransform, tagChar);
                                continue;
                                break;
                        } //  switch
                    }
                } else if (btnChar.ButtonStateUp) {
                    if (tagChar instanceof MovieClip) {
                        tagChar._nextFrame = 0;
                        _render.call(tagChar, ctx, renderMatrix, renderColorTransform);
                    } else {
                        var obj = character[tagChar.characterId];
                        switch (obj.tagType) {
                            case 46: // MorphShape
                            case 84: // MorphShape2
                                var controlTag = _this.getControlTag();
                                var cTag = controlTag[depth];
                                cache = _renderMorphShape.call(_this, ctx, renderMatrix, renderColorTransform, tagChar, cTag.Ratio);
                                break;
                            case 2:  // DefineShape
                            case 22: // DefineShape2
                            case 32: // DefineShape3
                            case 83: // DefineShape4
                                cache = _renderShape.call(_this, ctx, renderMatrix, renderColorTransform, tagChar);
                                if (obj.isClipDepth) {
                                    continue;
                                }
                                break;
                            case 7: // DefineButton
                            case 34: // DefineButton2
                                _renderButton.call(_this, ctx, renderMatrix, renderColorTransform, tagChar);
                                continue
                                break;
                            case 11: // DefineText
                            case 33: // DefineText2
                                cache = _renderText.call(_this, ctx, renderMatrix, renderColorTransform, tagChar);
                                break;
                            case 37: // DefineEditText
                                _renderEditText.call(_this, ctx, renderMatrix, renderColorTransform, tagChar);
                                continue;
                                break;
                        } //  switch
                    }
                }

                // reset
                if (touchObj == null
                    && tagChar instanceof MovieClip
                    && tagChar.isButtonRemove
                ) {
                    tagChar.isButtonRemove = false;
                    tagChar.reset(false, 1);
                }

                if (cache instanceof CanvasRenderingContext2D) {
                    var canvas = cache.canvas;
                    if (canvas.width > 0 && canvas.height > 0) {
                        var x = _ceil(cache.offsetX + renderMatrix[4] - 0.5);
                        var y = _ceil(cache.offsetY + renderMatrix[5] - 0.5);
                        _setTransform.call(ctx, 1, 0, 0, 1, x, y);
                        _drawImage.call(ctx,canvas, 0, 0);
                    }
                }
            }
        }
    };

    /**
     * renderBoundMatrix
     * @param bound
     * @param matrix
     * @returns {Array}
     */
    MovieClip.prototype.renderBoundMatrix = function(bound, matrix)
    {
        var no = _Number.MAX_VALUE;
        var Xmax = -no;
        var Ymax = -no;
        var Xmin = no;
        var Ymin = no;

        var x0 = bound.Xmax * matrix[0] + bound.Ymax * matrix[2];
        var x1 = bound.Xmax * matrix[0] + bound.Ymin * matrix[2];
        var x2 = bound.Xmin * matrix[0] + bound.Ymax * matrix[2];
        var x3 = bound.Xmin * matrix[0] + bound.Ymin * matrix[2];
        var y0 = bound.Xmax * matrix[1] + bound.Ymax * matrix[3];
        var y1 = bound.Xmax * matrix[1] + bound.Ymin * matrix[3];
        var y2 = bound.Xmin * matrix[1] + bound.Ymax * matrix[3];
        var y3 = bound.Xmin * matrix[1] + bound.Ymin * matrix[3];

        Xmax = _max(_max(_max(_max(Xmax, x0), x1), x2), x3);
        Xmin = _min(_min(_min(_min(Xmin, x0), x1), x2), x3);
        Ymax = _max(_max(_max(_max(Ymax, y0), y1), y2), y3);
        Ymin = _min(_min(_min(_min(Ymin, y0), y1), y2), y3);

        var x = Xmin;
        var w = Xmax - x;
        if (w < 0) {
            w *= -1;
        }

        var y = Ymin;
        var h = Ymax - y;
        if (h < 0) {
            h *= -1;
        }

        return [x, y, w, h];
    };

    /**
     * generateColorTransform
     * @param color
     * @param data
     * @returns {{R: *, G: *, B: *, A: *}}
     */
    MovieClip.prototype.generateColorTransform = function(color, data)
    {
        var R = color.R;
        var G = color.G;
        var B = color.B;
        var A = color.A * 255;

        return {
            R : _floor(_max(0, _min((R * data[0]) + data[4], 255))),
            G : _floor(_max(0, _min((G * data[1]) + data[5], 255))),
            B : _floor(_max(0, _min((B * data[2]) + data[6], 255))),
            A : _max(0, _min((A * data[3]) + data[7], 255)) / 255
        }
    };

    /**
     * multiplicationMatrix
     * @param a
     * @param b
     * @returns {Array}
     */
    MovieClip.prototype.multiplicationMatrix = function(a, b)
    {
        return [
            a[0] * b[0] + a[2] * b[1],
            a[1] * b[0] + a[3] * b[1],
            a[0] * b[2] + a[2] * b[3],
            a[1] * b[2] + a[3] * b[3],
            a[0] * b[4] + a[2] * b[5] + a[4],
            a[1] * b[4] + a[3] * b[5] + a[5]
        ];
    };

    /**
     *
     * @param a
     * @param b
     * @returns {Array}
     */
    MovieClip.prototype.multiplicationColor = function(a, b)
    {
        return [
            a[0] * b[0],
            a[1] * b[1],
            a[2] * b[2],
            a[3] * b[3],
            a[0] * b[4] + a[4],
            a[1] * b[5] + a[5],
            a[2] * b[6] + a[6],
            a[3] * b[7] + a[7]
        ];
    };

    /**
     * generateImageTransform
     * @param ctx
     * @param color
     * @returns {*}
     */
    MovieClip.prototype.generateImageTransform = function(ctx, color)
    {
        var canvas = ctx.canvas;
        var width = canvas.width;
        var height = canvas.height;
        var imgData = ctx.getImageData(0, 0, width, height);
        var pxData = imgData.data;
        var idx = 0;

        var RedMultiTerm = color[0];
        var GreenMultiTerm = color[1];
        var BlueMultiTerm = color[2];
        var AlphaMultiTerm = color[3];
        var RedAddTerm = color[4];
        var GreenAddTerm = color[5];
        var BlueAddTerm = color[6];
        var AlphaAddTerm = color[7];
        var length = width * height;
        for (; length--;) {
            var R = pxData[idx++];
            var G = pxData[idx++];
            var B = pxData[idx++];
            var A = pxData[idx++];
            pxData[idx - 4] = _floor(_max(0, _min((R * RedMultiTerm) + RedAddTerm, 255)));
            pxData[idx - 3] = _floor(_max(0, _min((G * GreenMultiTerm) + GreenAddTerm, 255)));
            pxData[idx - 2] = _floor(_max(0, _min((B * BlueMultiTerm) + BlueAddTerm, 255)));
            pxData[idx - 1] = _max(0, _min((A * AlphaMultiTerm) + AlphaAddTerm, 255));
        }

        ctx.putImageData(imgData, 0, 0);
        return ctx;
    };

    /**
     * parse
     * @param swf
     * @param mc
     */
    function parse(swf, mc)
    {
        swftag = new SwfTag();
        bitio = new BitIO();

        // swfデータをセット
        bitio.init(swf);

        // Header
        setSwfHeader(mc);

        // swfを分解してbuild
        var tags = swftag.parse(mc);
        swftag.build(tags, mc);
        cacheMode = (shapeCount > 250);

        // clear
        bitio = null;
    }

    /**
     * setSwfHeader
     * @param mc
     * @returns {number}
     */
    function setSwfHeader(mc)
    {
        // signature
        signature = bitio.getHeaderSignature();

        // version
        bitio.setVersion();

        // ファイルサイズ
        var fileLength = bitio.getUI32();
        if (signature == 'CWS') {
            bitio.deCompress(fileLength); // ZLIB
        } else if (signature == 'ZWS') {
            alert('not supported by LZMA');
            return 0;
        }

        // フレームサイズ
        var frameSize = swftag.rect();

        // フレーム
        var frameRate  = bitio.getUI16() / 0x100;
        var frameCount = bitio.getUI16();
        if (mc.characterId == 0) {
            player.width = _ceil(frameSize.Xmax - frameSize.Xmin);
            player.height = _ceil(frameSize.Ymax - frameSize.Ymin);
            player.fps = _floor(1000 / frameRate);
            changeScreenSize();
        }
    }

    /**
     * loaded
     */
    function loaded()
    {
        // reset
        _clearInterval(intervalId);
        cacheStore.reset();
        buttonHits = [];
        touchActions = [];
        actions = [];

        // _root
        var mc = player.parent;

        // action
        var _executeAction = executeAction;
        _executeAction(mc);
        mc.eventDispatcher();
        _executeAction(mc);

        // render
        mc.render(preContext, mc.getMatrix(), mc.getColorTransform());

        // DOM
        deleteNode();
        var div = _document.getElementById('swf2js');
        div.appendChild(context.canvas);

        var canvas = preContext.canvas;
        var _drawImage = context.drawImage;
        _drawImage.call(context, canvas, 0, 0);

        // start
        swf2js.play();
        intervalId = _setInterval(onEnterFrame, player.fps);

        if (controllerMode) {
            swf2js$controller.call(window, player.parent);
        }
    }

    /**
     * buffer
     */
    function buffer()
    {
        // _root
        var mc = player.parent;

        // action
        buttonAction(mc);

        var _executeAction = executeAction;
        _executeAction(mc);
        mc.eventDispatcher();
        _executeAction(mc);

        // clear
        clearPre();
        buttonHits = [];

        // render
        mc.render(preContext, mc.getMatrix(), mc.getColorTransform());
    }

    /**
     * executeAction
     * @param mc
     */
    function executeAction(mc)
    {
        var _action = action;
        var _addActions = mc.addActions;
        _addActions.call(mc);
        while (actions.length) {
            _action();
            _addActions.call(mc);
        }
    }

    /**
     * action
     */
    function action()
    {
        var length = actions.length;
        var _execute = cacheAS.execute;
        for (var i = 0; i < length; i++) {
            if (!(i in actions)) {
                continue;
            }

            var obj = actions[i];
            if (obj == null) {
                continue;
            }

            var as = obj.as;
            var mc = obj.mc;
            var aLen = as.length;
            for (var idx = 0; idx < aLen; idx++) {
                if (!(idx in as)) {
                    continue;
                }
                _execute.call(as[idx], mc);
            }
        }
        actions  = [];
    }

    /**
     * buttonAction
     * @param mc
     */
    function buttonAction(mc)
    {
        var length = touchActions.length;
        var _execute = cacheAS.execute;
        for (var i = 0; i < length; i++) {
            if (!(i in touchActions)) {
                continue;
            }

            var obj = touchActions[i];
            var as = obj.as;
            _execute.call(as, obj.mc);
        }
        touchActions = [];

        if (length) {
            executeAction(mc);
        }
    }

    /*
     * main canvas clear
     */
    function clearMain()
    {
        var canvas = context.canvas;
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvas.width + 1, canvas.height);
    }

    /*
     * pre canvas clear
     */
    function clearPre()
    {
        var canvas = preContext.canvas;
        preContext.setTransform(1, 0, 0, 1, 0, 0);
        preContext.clearRect(0, 0, canvas.width + 1, canvas.height);
    }

    /**
     * tmp canvas clear
     */
    function clearTmp()
    {
        var canvas = tmpContext.canvas;
        tmpContext.setTransform(1, 0, 0, 1, 0, 0);
        tmpContext.clearRect(0, 0, canvas.width + 1, canvas.height);
    }

    /**
     * keyAction
     * @param event
     */
    function keyAction(event)
    {
        var keyCode = event.keyCode;
        var len = buttonHits.length;
        var isEnd = false;

        if (96 <= keyCode && keyCode <= 105) {
            var n = keyCode - 96;
            switch (n) {
                case 0:
                    keyCode = 48;
                    break;
                case 1:
                    keyCode = 49;
                    break;
                case 2:
                    keyCode = 50;
                    break;
                case 3:
                    keyCode = 51;
                    break;
                case 4:
                    keyCode = 52;
                    break;
                case 5:
                    keyCode = 53;
                    break;
                case 6:
                    keyCode = 54;
                    break;
                case 7:
                    keyCode = 55;
                    break;
                case 8:
                    keyCode = 56;
                    break;
                case 9:
                    keyCode = 57;
                    break;
            }
        }

        for (var i = len; i--;) {
            if (!(i in buttonHits)) {
                continue;
            }

            var hitObj = buttonHits[i];
            if (hitObj == null) {
                continue;
            }

            var char = character[hitObj.characterId];
            if (char.actions == undefined) {
                continue;
            }

            var actions = char.actions;
            var aLen = actions.length;
            for (var idx = 0; idx < aLen; idx++) {
                if (!(idx in actions)) {
                    continue;
                }

                var cond = actions[idx];
                var CondKeyPress = cond.CondKeyPress;
                switch (CondKeyPress) {
                    case 1: // left arrow
                        CondKeyPress = 37;
                        break;
                    case 2: // right arrow
                        CondKeyPress = 39;
                        break;
                    case 3: // home
                        CondKeyPress = 36;
                        break;
                    case 4: // end
                        CondKeyPress = 35;
                        break;
                    case 5: // insert
                        CondKeyPress = 45;
                        break;
                    case 6: // delete
                        CondKeyPress = 46;
                        break;
                    case 14: // up arrow
                        CondKeyPress = 38;
                        break;
                    case 15: // down arrow
                        CondKeyPress = 40;
                        break;
                    case 16: // page up
                        CondKeyPress = 33;
                        break;
                    case 17: // page down
                        CondKeyPress = 34;
                        break;
                    case 18: // tab
                        CondKeyPress = 9;
                        break;
                    case 19: // escape
                        CondKeyPress = 27;
                        break;
                }

                if (CondKeyPress != keyCode) {
                    continue;
                }

                var mc = hitObj.parent;
                var as = cond.ActionScript;
                touchActions[touchActions.length] = {as: as, mc: mc};
                isEnd = true;
                break;
            }

            if (isEnd) {
                break;
            }
        }
    }

    /**
     * タッチイベント
     * @param event
     */
    function touchStart(event)
    {
        var len = buttonHits.length;
        if (!len) {
            return 0;
        }

        var div = _document.getElementById('swf2js');
        var bounds = div.getBoundingClientRect();
        var x = bounds.left;
        var y = bounds.top;

        var touchX = 0;
        var touchY = 0;
        if (isTouch) {
            var changedTouche = event.targetTouches[0];
            touchX = changedTouche.pageX - x;
            touchY = changedTouche.pageY - y;
        } else {
            touchX = event.pageX - x;
            touchY = event.pageY - y;
        }

        touchX *= devicePixelRatio;
        touchY *= devicePixelRatio;

        touchObj = null;
        touchEndAction = null;
        for (var i = len; i--;) {
            if (!(i in buttonHits)) {
                continue;
            }

            var hitObj = buttonHits[i];
            if (hitObj == undefined) {
                continue;
            }

            var char = character[hitObj.characterId];
            if (char.actions == undefined) {
                continue;
            }

            if (touchX >= hitObj.Xmin && touchX <= hitObj.Xmax
                && touchY >= hitObj.Ymin && touchY <= hitObj.Ymax
            ){
                touchObj = hitObj;
                var actions = char.actions;
                var aLen = actions.length
                for (var idx = 0; idx < aLen; idx++) {
                    if (!(idx in actions)) {
                        continue;
                    }

                    var cond = actions[idx];
                    if (cond.CondOverDownToOverUp) {
                        touchEndAction = cond.ActionScript;
                        continue;
                    }

                    // enter
                    if (hitObj.CondKeyPress == 13
                        && hitObj.CondKeyPress != cond.CondKeyPress
                    ) {
                        continue;
                    }

                    var keyPress = cond.CondKeyPress;
                    if (keyPress == 0 || keyPress == 13
                        || (keyPress >= 48 && keyPress <= 57)
                    ) {
                        var sound = hitObj.Sound;
                        if (sound != null) {
                            sound.currentTime = 0;
                            sound.play();
                        }

                        touchObj.ActionScript = cond.ActionScript;
                        if (cond.CondOverUpToOverDown || (isTouch && keyPress)) {
                            touchEvent(event);
                            break;
                        }
                    }
                }
            }

            if (touchObj != null) {
                break;
            }
        }
    }

    /**
     * 移動イベント
     * @param event
     */
    function touchMove(event)
    {
        if (!isTouchEvent && touchObj != null) {
            event.preventDefault();
            touchStart(event);
        }
    }

    /**
     * タッチイベント終了
     * @param event
     */
    function touchEnd(event)
    {
        if (touchObj != null && touchEndAction != null) {
            event.preventDefault();
            touchActions[touchActions.length] = {
                as: touchEndAction,
                mc: touchObj.parent
            };
        }

        isTouchEvent = false;
        touchObj = null;
    }

    /**
     * イベント実行
     * @param event
     */
    function touchEvent(event)
    {
        event.preventDefault();
        if (touchObj != null) {
            isTouchEvent = true;
            touchActions[touchActions.length] = {
                as: touchObj.ActionScript,
                mc: touchObj.parent
            };
        }
    }

    /**
     * unzip
     * @param compressed
     * @param isDeCompress
     * @returns {Array}
     */
    function unzip(compressed, isDeCompress)
    {
        /**
         * decodeSymbol
         * @param b
         * @param table
         * @returns {*}
         */
        var _decodeSymbol = function (b, table)
        {
            var code = 0;
            var len = 0;
            while (true) {
                code = (code << 1) | b.readUB(1);
                len++;
                if (!(code in table)) {
                    continue;
                }

                var entry = table[code];
                if (entry.length == len) {
                    return entry.symbol;
                }
            }
        };

        /**
         * buildHuffTable
         * @param bitLengths
         * @returns {{}}
         */
        var _buildHuffTable = function(bitLengths)
        {
            var numLengths = bitLengths.length;
            var blCount = [];
            var maxBits = _max.apply(Math, bitLengths) + 1;
            var nextCode = [];
            var code = 0;
            var table = {};
            var i = numLengths;

            while (i--) {
                var len = bitLengths[i];
                blCount[len] = (blCount[len] || 0) + (len > 0);
            }

            for (i = 1; i < maxBits; i++) {
                len = i - 1;
                if (!(len in blCount)) {
                    blCount[len] = 0;
                }

                code = (code + blCount[len]) << 1;
                nextCode[i] = code;
            }

            for (i = 0; i < numLengths; i++) {
                len = bitLengths[i];
                if (len) {
                    table[nextCode[len]] = {
                        length: len,
                        symbol: i
                    };
                    nextCode[len]++;
                }
            }
            return table;
        };

        var sym = 0;
        var i = 0;
        var buff = [];
        var bitLengths = [];

        var DEFLATE_CODE_LENGTH_ORDER =
            [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
        var DEFLATE_CODE_LENGTH_MAP = [
            [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [0, 9], [0, 10],
            [1, 11], [1, 13], [1, 15], [1, 17], [2, 19], [2, 23], [2, 27],
            [2, 31], [3, 35], [3, 43], [3, 51], [3, 59], [4, 67], [4, 83],
            [4, 99], [4, 115], [5, 131], [5, 163], [5, 195], [5, 227], [0, 258]
        ];
        var DEFLATE_DISTANCE_MAP = [
            [0, 1], [0, 2], [0, 3], [0, 4], [1, 5], [1, 7], [2, 9], [2, 13],
            [3, 17], [3, 25], [4, 33], [4, 49], [5, 65], [5, 97], [6, 129],
            [6, 193], [7, 257], [7, 385], [8, 513], [8, 769], [9, 1025],
            [9, 1537], [10, 2049], [10, 3073], [11, 4097], [11, 6145],
            [12, 8193], [12, 12289], [13, 16385], [13, 24577]
        ];

        var zBitio = new BitIO();
        zBitio.setData(compressed);

        if (isDeCompress) {
            zBitio.setOffset(10, 8);
        } else {
            zBitio.setOffset(2, 8);
        }

        while (!done) {
            var done = zBitio.readUB(1);
            var type = zBitio.readUB(2);

            var distTable = {};
            var litTable = {};
            var fixedDistTable = false;
            var fixedLitTable = false;

            if (type) {
                if (type == 1) {
                    distTable = fixedDistTable;
                    litTable = fixedLitTable;

                    if (!distTable) {
                        bitLengths = [];
                        for(i = 32; i--;){
                            bitLengths[bitLengths.length] = 5;
                        }
                        distTable = fixedDistTable = _buildHuffTable(bitLengths);
                    }

                    if (!litTable) {
                        bitLengths = [];
                        i = 0;

                        for(; i < 144; i++){
                            bitLengths[bitLengths.length] = 8;
                        }

                        for(; i < 256; i++){
                            bitLengths[bitLengths.length] = 9;
                        }

                        for(; i < 280; i++){
                            bitLengths[bitLengths.length] = 7;
                        }

                        for(; i < 288; i++){
                            bitLengths[bitLengths.length] = 8;
                        }

                        litTable = fixedLitTable = _buildHuffTable(bitLengths);
                    }
                } else {
                    var numLitLengths = zBitio.readUB(5) + 257;
                    var numDistLengths = zBitio.readUB(5) + 1;
                    var numCodeLengths = zBitio.readUB(4) + 4;
                    var codeLengths = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    for(i = 0; i < numCodeLengths; i++){
                        codeLengths[DEFLATE_CODE_LENGTH_ORDER[i]] = zBitio.readUB(3);
                    }

                    var codeTable = _buildHuffTable(codeLengths);
                    var litLengths = [];
                    var prevCodeLen = 0;
                    var maxLengths = numLitLengths + numDistLengths;
                    while (litLengths.length < maxLengths) {
                        sym = _decodeSymbol(zBitio, codeTable);
                        switch (sym) {
                            case 16:
                                i = zBitio.readUB(2) + 3;
                                while (i--) {
                                    litLengths[litLengths.length] = prevCodeLen;
                                }
                                break;
                            case 17:
                                i = zBitio.readUB(3) + 3;
                                while (i--) {
                                    litLengths[litLengths.length] = 0;
                                }
                                break;
                            case 18:
                                i = zBitio.readUB(7) + 11;
                                while (i--) {
                                    litLengths[litLengths.length] = 0;
                                }
                                break;
                            default:
                                if(sym <= 15){
                                    litLengths[litLengths.length] = sym;
                                    prevCodeLen = sym;
                                }
                                break;
                        }
                    }
                    distTable = _buildHuffTable(
                        litLengths.splice(numLitLengths, numDistLengths)
                    );
                    litTable = _buildHuffTable(litLengths);
                }

                while (sym != 256) {
                    sym = _decodeSymbol(zBitio, litTable);

                    if (sym < 256) {
                        buff[buff.length] = sym;
                    } else if(sym > 256){
                        var lengthMap = DEFLATE_CODE_LENGTH_MAP[sym - 257];
                        var len = lengthMap[1] + zBitio.readUB(lengthMap[0]);
                        var distMap = DEFLATE_DISTANCE_MAP[_decodeSymbol(zBitio, distTable)];
                        var dist = distMap[1] + zBitio.readUB(distMap[0]);
                        i = buff.length - dist;
                        while (len--) {
                            buff[buff.length] = buff[i++];
                        }
                    }
                }
            } else {
                zBitio.bit_offset = 8;
                var len = zBitio.readNumber(2);
                var nlen = zBitio.readNumber(2);
                while (len--) {
                    buff[buff.length] = zBitio.readNumber(1);
                }
            }
        }

        return buff;
    }

    /**
     * deleteNode
     */
    function deleteNode()
    {
        var div = _document.getElementById('swf2js');
        if (div) {
            var childNodes = div.childNodes;
            var len = childNodes.length;
            if (len) {
                for (var i = len; i--;) {
                    div.removeChild(childNodes[i]);
                }
            }
        }
    }

    /**
     * onEnterFrame
     */
    function onEnterFrame()
    {
        if (isLoad && !player.stopFlag) {
            clearMain();
            context.drawImage(preContext.canvas, 0, 0);
            _setTimeout(buffer, 0);
        }
    }

    /**
     * clone
     * @param src
     * @returns {{}}
     */
    function clone(src)
    {
        var execute = function(src, obj)
        {
            for(var prop in src) {
                var value = src[prop];
                if(value instanceof Array) {
                    obj[prop] = [];
                    execute(value, obj[prop]);
                } else if(value instanceof Object) {
                    obj[prop] = {};
                    execute(value, obj[prop]);
                } else {
                    obj[prop] = value;
                }
            }
        };

        var obj = {};
        execute(src, obj);
        return obj;
    }

    /**
     * player
     * @type {{stopFlag: boolean, parent: MovieClip, fps: number}}
     */
    var player = {
        stopFlag: true,
        parent: new MovieClip(),
        fps: 0
    };

    // swf2js
    if (window['swf2js'] == undefined) {
        /**
         * swf2js
         * @type {{}}
         */
        var swf2js = {};

        /**
         * load
         * @param url
         * @param options
         */
        swf2js.load = function(url, options)
        {
            if (options != undefined) {
                optionWidth = options.width || 0;
                optionHeight = options.height || 0;
                renderMode = options.mode || renderMode;
                tagId = options.tagId || null;
                cacheSize = options.cacheSize || cacheSize;
                isSpriteSheet = options.isSpriteSheet || false;
                controllerMode = options.controllerMode || false;
            }

            // TODO 開発用
            if (url == 'develop') {
                url = location.search.substr(1).split('&')[0];
            }

            if (url) {
                if (!tagId) {
                    _document.open();
                    _document.write('<div id="swf2js"></div>');
                    _document.close();
                }

                var xmlHttpRequest = new XMLHttpRequest();
                xmlHttpRequest.open('GET', url);
                xmlHttpRequest.overrideMimeType(
                    'text/plain; charset=x-user-defined'
                );
                xmlHttpRequest.send(null);
                xmlHttpRequest.onreadystatechange = function()
                {
                    var readyState = xmlHttpRequest.readyState;
                    if (readyState == 4) {
                        var status = xmlHttpRequest.status;
                        switch (status) {
                            case 200:
                                parse(xmlHttpRequest.responseText, player.parent);
                                isLoad = true;
                                if (intervalId == 0 && imgUnLoadCount == 0) {
                                    loaded();
                                }
                                break;
                            case 404:
                                alert('Swf Data Not Found');
                                break;
                            case 500:
                                alert('Internal Server Error');
                                break;
                        }
                    }
                }
            } else {
                alert('please set swf url');
            }

            if (_document.readyState != 'complete') {
                window.addEventListener("DOMContentLoaded", init, false);
            } else {
                init();
            }
        };

        /**
         * play
         */
        swf2js.play = function()
        {
            player.stopFlag = false;
        };

        /**
         * stop
         */
        swf2js.stop = function()
        {
            player.stopFlag = true;
        };

        /**
         * reload
         * @param url
         * @param options
         */
        swf2js.reload = function(url, options)
        {
            // stop
            _clearInterval(intervalId);
            swf2js.stop();

            // reset
            isLoad = false;
            intervalId = 0;
            instanceId = 0;
            backgroundColor = null;
            optionWidth = 0;
            optionHeight = 0;
            player.parent = new MovieClip();
            deleteNode();

            // execute
            swf2js.load(url, options);
        };

        /**
         * output
         * @param path
         */
        swf2js.output = function(path)
        {
            if (!isLoad) {
                _setTimeout(swf2js.output, 1000, path);
                return false;
            }

            // stop
            _clearInterval(intervalId);
            isLoad = false;
            swf2js.stop();

            var mc = player.parent;
            mc.reset(true, 1);
            loaded();

            var xmlHttpRequest = new XMLHttpRequest();
            xmlHttpRequest.open('POST', path);
            xmlHttpRequest.setRequestHeader(
                'Content-Type',
                'application/x-www-form-urlencoded'
            );
            xmlHttpRequest.send('data='+ encodeURIComponent(
                context.canvas.toDataURL())
            );

            // alert
            xmlHttpRequest.onreadystatechange = function()
            {
                var readyState = xmlHttpRequest.readyState;
                if (readyState == 4) {
                    var status = xmlHttpRequest.status;
                    if (status == 200) {
                        alert('OUTPUT SUCCESS');
                        return true;
                    } else {
                        alert('[ERROR] HTTP STATUS: '+ status);
                    }
                }
            }
        };

        window.swf2js = swf2js;
    }
})(this);