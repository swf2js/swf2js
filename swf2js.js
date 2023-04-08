/*jshint bitwise: false*/
/**
 * swf2js (version 0.7.24)
 * Develop: https://github.com/ienaga/swf2js
 * ReadMe: https://github.com/ienaga/swf2js/blob/master/README.md
 * Web: https://swf2js.wordpress.com
 * Contact: ienaga@tvon.jp
 * Copyright (c) 2013 Toshiyuki Ienaga. Licensed under the MIT License.
 */
if (!("swf2js" in window)){(function(window)
{
    var _document = window.document;
    var _Math = Math;
    var _min = _Math.min;
    var _max = _Math.max;
    var _floor = _Math.floor;
    var _ceil = _Math.ceil;
    var _pow = _Math.pow;
    var _random = _Math.random;
    var _atan2 = _Math.atan2;
    var _sqrt = _Math.sqrt;
    var _cos = _Math.cos;
    var _sin = _Math.sin;
    var _log = _Math.log;
    var _abs = _Math.abs;
    var _SQRT2 = _Math.SQRT2;
    var _LN2 = _Math.LN2;
    var _LN2_2 = _LN2 / 2;
    var _LOG1P = 0.29756328478758615;
    var _PI = _Math.PI;
    var _Number = Number;
    var _fromCharCode = String.fromCharCode;
    var _isNaN = isNaN;
    var _setTimeout = setTimeout;
    var _clearTimeout = clearTimeout;
    var _setInterval = setInterval;
    var _clearInterval = clearInterval;
    var Func = Function;
    var alert = window.alert;
    var console = window.console;
    var isBtoa = ("btoa" in window);
    var isWebGL = (window.WebGLRenderingContext &&
        _document.createElement("canvas").getContext("webgl")) ? true : false;
    isWebGL = false; // TODO
    var requestAnimationFrame =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.setTimeout;

    // params
    var resizeId = 0;
    var stageId = 0;
    var stages = [];
    var loadStages = [];
    var instanceId = 0;
    var tmpContext;
    var StartDate = new Date();
    var _navigator = window.navigator;
    var ua = _navigator.userAgent;
    var isAndroid = (ua.indexOf("Android") > 0);
    var isAndroid4x = (ua.indexOf("Android 4.") > 0);
    var isiOS = (ua.indexOf("iPhone") > 0 || ua.indexOf("iPod") > 0);
    var isChrome = (ua.indexOf("Chrome") > 0);
    var isTouch = (isAndroid || isiOS);
    var xmlHttpRequest = new XMLHttpRequest();
    var isXHR2 = (typeof xmlHttpRequest.responseType !== "undefined");
    var isArrayBuffer = window.ArrayBuffer;
    var quality = (isWebGL) ? 1 : 0.8;
    var devicePixelRatio = window.devicePixelRatio || 1;
    var _devicePixelRatio = devicePixelRatio * quality;
    var _event = null;
    var _keyEvent = null;
    var startEvent = "mousedown";
    var moveEvent = "mousemove";
    var endEvent = "mouseup";
    if (isTouch) {
        startEvent = "touchstart";
        moveEvent = "touchmove";
        endEvent = "touchend";
    }

    // Alpha Bug
    var isAlphaBug = isAndroid;
    var chkCanvas = _document.createElement("canvas");
    chkCanvas.width = 1;
    chkCanvas.height = 1;
    tmpContext = chkCanvas.getContext("2d");
    if (isAndroid) {
        var imageData = tmpContext.createImageData(1, 1);
        var pixelArray = imageData.data;
        pixelArray[0] = 128;
        pixelArray[3] = 128;
        tmpContext.putImageData(imageData, 0, 0);
        imageData = tmpContext.getImageData(0, 0, 1, 1);
        pixelArray = imageData.data;
        isAlphaBug = (pixelArray[0] === 255);
        imageData = null;
        pixelArray = null;
    }

    if (typeof Object.defineProperty !== "function") {
        Object.defineProperty = function (obj, prop, desc)
        {
            if ("value" in desc) {
                obj[prop] = desc.value;
            }
            if ("get" in desc) {
                obj.__defineGetter__(prop, desc.get);
            }
            if ("set" in desc) {
                obj.__defineSetter__(prop, desc.set);
            }
            return obj;
        };
    }

    if (typeof Object.defineProperties !== "function") {
        Object.defineProperties = function (obj, descs)
        {
            for (var prop in descs) {
                if (descs.hasOwnProperty(prop)) {
                    Object.defineProperty(obj, prop, descs[prop]);
                }
            }
            return obj;
        };
    }

    if (typeof Object.getPrototypeOf !== "function") {
        Object.getPrototypeOf = function (obj)
        {
            return obj.__proto__;
        };
    }

    if (typeof Object.setPrototypeOf !== "function") {
        Object.setPrototypeOf = function (obj, proto) {
            obj.__proto__ = proto;
            return obj;
        };
    }

    // shift-jis
    var JCT11280 = new Func('var a="zKV33~jZ4zN=~ji36XazM93y!{~k2y!o~k0ZlW6zN?3Wz3W?{EKzK[33[`y|;-~j^YOTz$!~kNy|L1$353~jV3zKk3~k-4P4zK_2+~jY4y!xYHR~jlz$_~jk4z$e3X5He<0y!wy|X3[:~l|VU[F3VZ056Hy!nz/m1XD61+1XY1E1=1y|bzKiz!H034zKj~mEz#c5ZA3-3X$1~mBz$$3~lyz#,4YN5~mEz#{ZKZ3V%7Y}!J3X-YEX_J(3~mAz =V;kE0/y|F3y!}~m>z/U~mI~j_2+~mA~jp2;~m@~k32;~m>V}2u~mEX#2x~mBy+x2242(~mBy,;2242(~may->2&XkG2;~mIy-_2&NXd2;~mGz,{4<6:.:B*B:XC4>6:.>B*BBXSA+A:X]E&E<~r#z+625z s2+zN=`HXI@YMXIAXZYUM8X4K/:Q!Z&33 3YWX[~mB`{zKt4z (zV/z 3zRw2%Wd39]S11z$PAXH5Xb;ZQWU1ZgWP%3~o@{Dgl#gd}T){Uo{y5_d{e@}C(} WU9|cB{w}bzvV|)[} H|zT}d||0~{]Q|(l{|x{iv{dw}(5}[Z|kuZ }cq{{y|ij}.I{idbof%cu^d}Rj^y|-M{ESYGYfYsZslS`?ZdYO__gLYRZ&fvb4oKfhSf^d<Yeasc1f&a=hnYG{QY{D`Bsa|u,}Dl|_Q{C%xK|Aq}C>|c#ryW=}eY{L+`)][YF_Ub^h4}[X|?r|u_ex}TL@YR]j{SrXgo*|Gv|rK}B#mu{R1}hs|dP{C7|^Qt3|@P{YVV |8&}#D}ef{e/{Rl|>Hni}R1{Z#{D[}CQlQ||E}[s{SG_+i8eplY[=[|ec[$YXn#`hcm}YR|{Ci(_[ql|?8p3]-}^t{wy}4la&pc|3e{Rp{LqiJ],] `kc(]@chYnrM`O^,ZLYhZB]ywyfGY~aex!_Qww{a!|)*lHrM{N+n&YYj~Z b c#e_[hZSon|rOt`}hBXa^i{lh|<0||r{KJ{kni)|x,|0auY{D!^Sce{w;|@S|cA}Xn{C1h${E]Z-XgZ*XPbp]^_qbH^e[`YM|a||+=]!Lc}]vdBc=j-YSZD]YmyYLYKZ9Z>Xcczc2{Yh}9Fc#Z.l{}(D{G{{mRhC|L3b#|xK[Bepj#ut`H[,{E9Yr}1b{[e]{ZFk7[ZYbZ0XL]}Ye[(`d}c!|*y`Dg=b;gR]Hm=hJho}R-[n}9;{N![7k_{UbmN]rf#pTe[x8}!Qcs_rs[m`|>N}^V})7{^r|/E}),}HH{OYe2{Skx)e<_.cj.cjoMhc^d}0uYZd!^J_@g,[[[?{i@][|3S}Yl3|!1|eZ|5IYw|1D}e7|Cv{OHbnx-`wvb[6[4} =g+k:{C:}ed{S]|2M]-}WZ|/q{LF|dYu^}Gs^c{Z=}h>|/i|{W]:|ip{N:|zt|S<{DH[p_tvD{N<[8Axo{X4a.^o^X>Yfa59`#ZBYgY~_t^9`jZHZn`>G[oajZ;X,i)Z.^~YJe ZiZF^{][[#Zt^|]Fjx]&_5dddW]P0C[-]}]d|y {C_jUql] |OpaA[Z{lp|rz}:Mu#]_Yf6{Ep?f5`$[6^D][^u[$[6^.Z8]]ePc2U/=]K^_+^M{q*|9tYuZ,s(dS{i=|bNbB{uG}0jZOa:[-]dYtu3]:]<{DJ_SZIqr_`l=Yt`gkTnXb3d@kiq0a`Z{|!B|}e}Ww{Sp,^Z|0>_Z}36|]A|-t}lt{R6pi|v8hPu#{C>YOZHYmg/Z4nicK[}hF_Bg|YRZ7c|crkzYZY}_iXcZ.|)U|L5{R~qi^Uga@Y[xb}&qdbd6h5|Btw[}c<{Ds53[Y7]?Z<|e0{L[ZK]mXKZ#Z2^tavf0`PE[OSOaP`4gi`qjdYMgys/?[nc,}EEb,eL]g[n{E_b/vcvgb.{kcwi`~v%|0:|iK{Jh_vf5lb}KL|(oi=LrzhhY_^@`zgf[~g)[J_0fk_V{T)}I_{D&_/d9W/|MU[)f$xW}?$xr4<{Lb{y4}&u{XJ|cm{Iu{jQ}CMkD{CX|7A}G~{kt)nB|d5|<-}WJ}@||d@|Iy}Ts|iL|/^|no|0;}L6{Pm]7}$zf:|r2}?C_k{R(}-w|`G{Gy[g]bVje=_0|PT{^Y^yjtT[[[l!Ye_`ZN]@[n_)j3nEgMa]YtYpZy].d-Y_cjb~Y~[nc~sCi3|zg}B0}do{O^{|$`_|D{}U&|0+{J3|8*]iayx{a{xJ_9|,c{Ee]QXlYb]$[%YMc*]w[aafe]aVYi[fZEii[xq2YQZHg]Y~h#|Y:thre^@^|_F^CbTbG_1^qf7{L-`VFx Zr|@EZ;gkZ@slgko`[e}T:{Cu^pddZ_`yav^Ea+[#ZBbSbO`elQfLui}.F|txYcbQ`XehcGe~fc^RlV{D_0ZAej[l&jShxG[ipB_=u:eU}3e8[=j|{D(}dO{Do[BYUZ0/]AYE]ALYhZcYlYP/^-^{Yt_1_-;YT`P4BZG=IOZ&]H[e]YYd[9^F[1YdZxZ?Z{Z<]Ba2[5Yb[0Z4l?]d_;_)a?YGEYiYv`_XmZs4ZjY^Zb]6gqGaX^9Y}dXZr[g|]Y}K aFZp^k^F]M`^{O1Ys]ZCgCv4|E>}8eb7}l`{L5[Z_faQ|c2}Fj}hw^#|Ng|B||w2|Sh{v+[G}aB|MY}A{|8o}X~{E8paZ:]i^Njq]new)`-Z>haounWhN}c#{DfZ|fK]KqGZ=:u|fqoqcv}2ssm}.r{]{nIfV{JW)[K|,Z{Uxc|]l_KdCb%]cfobya3`p}G^|LZiSC]U|(X|kBlVg[kNo({O:g:|-N|qT}9?{MBiL}Sq{`P|3a|u.{Uaq:{_o|^S}jX{Fob0`;|#y_@[V[K|cw[<_ }KU|0F}d3|et{Q7{LuZttsmf^kYZ`Af`}$x}U`|Ww}d]| >}K,r&|XI|*e{C/a-bmr1fId4[;b>tQ_:]hk{b-pMge]gfpo.|(w[jgV{EC1Z,YhaY^q,_G[c_g[J0YX]`[h^hYK^_Yib,` {i6vf@YM^hdOKZZn(jgZ>bzSDc^Z%[[o9[2=/YHZ(_/Gu_`*|8z{DUZxYt^vuvZjhi^lc&gUd4|<UiA`z]$b/Z?l}YI^jaHxe|;F}l${sQ}5g}hA|e4}?o{ih}Uz{C)jPe4]H^J[Eg[|AMZMlc}:,{iz}#*|gc{Iq|/:|zK{l&}#u|myd{{M&v~nV};L|(g|I]ogddb0xsd7^V})$uQ{HzazsgxtsO^l}F>ZB]r|{7{j@cU^{{CbiYoHlng]f+nQ[bkTn/}<-d9q {KXadZYo+n|l[|lc}V2{[a{S4Zam~Za^`{HH{xx_SvF|ak=c^[v^7_rYT`ld@]:_ub%[$[m](Shu}G2{E.ZU_L_R{tz`vj(f?^}hswz}GdZ}{S:h`aD|?W|`dgG|if{a8|J1{N,}-Ao3{H#{mfsP|[ bzn+}_Q{MT{u4kHcj_q`eZj[8o0jy{p7}C|[}l){MuYY{|Ff!Ykn3{rT|m,^R|,R}$~Ykgx{P!]>iXh6[l[/}Jgcg{JYZ.^qYfYIZl[gZ#Xj[Pc7YyZD^+Yt;4;`e8YyZVbQ7YzZxXja.7SYl[s]2^/Ha$[6ZGYrb%XiYdf2]H]kZkZ*ZQ[ZYS^HZXcCc%Z|[(bVZ]]:OJQ_DZCg<[,]%Zaa [g{C00HY[c%[ChyZ,Z_`PbXa+eh`^&jPi0a[ggvhlekL]w{Yp^v}[e{~;k%a&k^|nR_z_Qng}[E}*Wq:{k^{FJZpXRhmh3^p>de^=_7`|ZbaAZtdhZ?n4ZL]u`9ZNc3g%[6b=e.ZVfC[ZZ^^^hD{E(9c(kyZ=bb|Sq{k`|vmr>izlH[u|e`}49}Y%}FT{[z{Rk}Bz{TCc/lMiAqkf(m$hDc;qooi[}^o:c^|Qm}a_{mrZ(pA`,}<2sY| adf_%|}`}Y5U;}/4|D>|$X{jw{C<|F.hK|*A{MRZ8Zsm?imZm_?brYWZrYx`yVZc3a@f?aK^ojEd {bN}/3ZH]/$YZhm^&j 9|(S|b]mF}UI{q&aM]LcrZ5^.|[j`T_V_Gak}9J[ ZCZD|^h{N9{~&[6Zd{}B}2O|cv]K}3s}Uy|l,fihW{EG`j_QOp~Z$F^zexS`dcISfhZBXP|.vn|_HYQ|)9|cr]<`&Z6]m_(ZhPcSg>`Z]5`~1`0Xcb4k1{O!bz|CN_T{LR|a/gFcD|j<{Z._[f)mPc:1`WtIaT1cgYkZOaVZOYFrEe[}T$}Ch}mk{K-^@]fH{Hdi`c*Z&|Kt{if[C{Q;{xYB`dYIX:ZB[}]*[{{p9|4GYRh2ao{DS|V+[zd$`F[ZXKadb*A] Ys]Maif~a/Z2bmclb8{Jro_rz|x9cHojbZ{GzZx_)]:{wAayeDlx}<=`g{H1{l#}9i|)=|lP{Qq}.({La|!Y{i2EZfp=c*}Cc{EDvVB|;g}2t{W4av^Bn=]ri,|y?|3+}T*ckZ*{Ffr5e%|sB{lx^0]eZb]9[SgAjS_D|uHZx]dive[c.YPkcq/}db{EQh&hQ|eg}G!ljil|BO]X{Qr_GkGl~YiYWu=c3eb}29v3|D|}4i||.{Mv})V{SP1{FX}CZW6{cm|vO{pS|e#}A~|1i}81|Mw}es|5[}3w{C`h9aL]o{}p[G`>i%a1Z@`Ln2bD[$_h`}ZOjhdTrH{[j_:k~kv[Sdu]CtL}41{I |[[{]Zp$]XjxjHt_eThoa#h>sSt8|gK|TVi[Y{t=}Bs|b7Zpr%{gt|Yo{CS[/{iteva|cf^hgn}($_c^wmb^Wm+|55jrbF|{9^ q6{C&c+ZKdJkq_xOYqZYSYXYl`8]-cxZAq/b%b*_Vsa[/Ybjac/OaGZ4fza|a)gY{P?| I|Y |,pi1n7}9bm9ad|=d{aV|2@[(}B`d&|Uz}B}{`q|/H|!JkM{FU|CB|.{}Az}#P|lk}K{|2rk7{^8^?`/|k>|Ka{Sq}Gz}io{DxZh[yK_#}9<{TRdgc]`~Z>JYmYJ]|`!ZKZ]gUcx|^E[rZCd`f9oQ[NcD_$ZlZ;Zr}mX|=!|$6ZPZYtIo%fj}CpcN|B,{VDw~gb}@hZg`Q{LcmA[(bo`<|@$|o1|Ss}9Z_}tC|G`{F/|9nd}i=}V-{L8aaeST]daRbujh^xlpq8|}zs4bj[S`J|]?G{P#{rD{]I`OlH{Hm]VYuSYUbRc*6[j`8]pZ[bt_/^Jc*[<Z?YE|Xb|?_Z^Vcas]h{t9|Uwd)_(=0^6Zb{Nc} E[qZAeX[a]P^|_J>e8`W^j_Y}R{{Jp__]Ee#e:iWb9q_wKbujrbR}CY`,{mJ}gz{Q^{t~N|? gSga`V_||:#mi}3t|/I`X{N*|ct|2g{km}gi|{={jC}F;|E}{ZZjYf*frmu}8Tdroi{T[|+~}HG{cJ}DM{Lp{Ctd&}$hi3|FZ| m}Kr|38}^c|m_|Tr{Qv|36}?Up>|;S{DV{k_as}BK{P}}9p|t`jR{sAm4{D=b4pWa[}Xi{EjwEkI}3S|E?u=X0{jf} S|NM|JC{qo^3cm]-|JUx/{Cj{s>{Crt[UXuv|D~|j|d{YXZR}Aq}0r}(_{pJfi_z}0b|-vi)Z mFe,{f4|q`b{}^Z{HM{rbeHZ|^x_o|XM|L%|uFXm}@C_{{Hhp%a7|0p[Xp+^K}9U{bP}: tT}B|}+$|b2|[^|~h{FAby[`{}xgygrt~h1[li`c4vz|,7p~b(|mviN}^pg[{N/|g3|^0c,gE|f%|7N{q[|tc|TKA{LU}I@|AZp(}G-sz{F |qZ{}F|f-}RGn6{Z]_5})B}UJ{FFb2]4ZI@v=k,]t_Dg5Bj]Z-]L]vrpdvdGlk|gF}G]|IW}Y0[G| /bo|Te^,_B}#n^^{QHYI[?hxg{[`]D^IYRYTb&kJ[cri[g_9]Ud~^_]<p@_e_XdNm-^/|5)|h_{J;{kacVopf!q;asqd}n)|.m|bf{QW|U)}b+{tL|w``N|to{t ZO|T]jF}CB|0Q{e5Zw|k |We}5:{HO{tPwf_uajjBfX}-V_C_{{r~gg|Ude;s+}KNXH}! `K}eW{Upwbk%ogaW}9EYN}YY|&v|SL{C3[5s.]Y]I]u{M6{pYZ`^,`ZbCYR[1mNg>rsk0Ym[jrE]RYiZTr*YJ{Ge|%-lf|y(`=[t}E6{k!|3)}Zk} ][G{E~cF{u3U.rJ|a9p#o#ZE|?|{sYc#vv{E=|LC}cu{N8`/`3`9rt[4|He{cq|iSYxY`}V |(Q|t4{C?]k_Vlvk)BZ^r<{CL}#h}R+[<|i=}X|{KAo]|W<`K{NW|Zx}#;|fe{IMr<|K~tJ_x}AyLZ?{GvbLnRgN}X&{H7|x~}Jm{]-| GpNu0}.ok>|c4{PYisrDZ|fwh9|hfo@{H~XSbO]Odv]%`N]b1Y]]|eIZ}_-ZA]aj,>eFn+j[aQ_+]h[J_m_g]%_wf.`%k1e#Z?{CvYu_B^|gk`Xfh^M3`afGZ-Z|[m{L}|k3cp[it ^>YUi~d>{T*}YJ{Q5{Jxa$hg|%4`}|LAgvb }G}{P=|<;Ux{_skR{cV|-*|s-{Mp|XP|$G|_J}c6cM{_=_D|*9^$ec{V;|4S{qO|w_|.7}d0|/D}e}|0G{Dq]Kdp{}dfDi>}B%{Gd|nl}lf{C-{y}|ANZr}#={T~|-(}c&{pI|ft{lsVP}){|@u}!W|bcmB{d?|iW|:dxj{PSkO|Hl]Li:}VYk@|2={fnWt{M3`cZ6|)}|Xj}BYa?vo{e4|L7|B7{L7|1W|lvYO}W8nJ|$Vih|{T{d*_1|:-n2dblk``fT{Ky|-%}m!|Xy|-a{Pz}[l{kFjz|iH}9N{WE{x,|jz}R {P|{D)c=nX|Kq|si}Ge{sh|[X{RF{t`|jsr*fYf,rK|/9}$}}Nf{y!1|<Std}4Wez{W${Fd_/^O[ooqaw_z[L`Nbv[;l7V[ii3_PeM}.h^viqYjZ*j1}+3{bt{DR[;UG}3Og,rS{JO{qw{d<_zbAh<R[1_r`iZTbv^^a}c{iEgQZ<exZFg.^Rb+`Uj{a+{z<[~r!]`[[|rZYR|?F|qppp]L|-d|}K}YZUM|=Y|ktm*}F]{D;g{uI|7kg^}%?Z%ca{N[_<q4xC]i|PqZC]n}.bDrnh0Wq{tr|OMn6tM|!6|T`{O`|>!]ji+]_bTeU}Tq|ds}n|{Gm{z,f)}&s{DPYJ`%{CGd5v4tvb*hUh~bf]z`jajiFqAii]bfy^U{Or|m+{I)cS|.9k:e3`^|xN}@Dnlis`B|Qo{`W|>||kA}Y}{ERYuYx`%[exd`]|OyiHtb}HofUYbFo![5|+]gD{NIZR|Go}.T{rh^4]S|C9_}xO^i`vfQ}C)bK{TL}cQ|79iu}9a];sj{P.o!f[Y]pM``Jda^Wc9ZarteBZClxtM{LW}l9|a.mU}KX}4@{I+f1}37|8u}9c|v${xGlz}jP{Dd1}e:}31}%3X$|22i<v+r@~mf{sN{C67G97855F4YL5}8f{DT|xy{sO{DXB334@55J1)4.G9A#JDYtXTYM4, YQD9;XbXm9SX]IB^4UN=Xn<5(;(F3YW@XkH-X_VM[DYM:5XP!T&Y`6|,^{IS-*D.H>:LXjYQ0I3XhAF:9:(==.F*3F1189K/7163D,:@|e2{LS36D4hq{Lw/84443@4.933:0307::6D7}&l{Mx657;89;,K5678H&93D(H<&<>0B90X^I;}Ag1{P%3A+>><975}[S{PZE453?4|T2{Q+5187;>447:81{C=hL6{Me^:=7ii{R=.=F<81;48?|h8}Uh{SE|,VxL{ST,7?9Y_5Xk3A#:$%YSYdXeKXOD8+TXh7(@>(YdXYHXl9J6X_5IXaL0N?3YK7Xh!1?XgYz9YEXhXaYPXhC3X`-YLY_XfVf[EGXZ5L8BXL9YHX]SYTXjLXdJ: YcXbQXg1PX]Yx4|Jr{Ys4.8YU+XIY`0N,<H%-H;:0@,74/:8546I=9177154870UC]d<C3HXl7ALYzXFXWP<<?E!88E5@03YYXJ?YJ@6YxX-YdXhYG|9o{`iXjY_>YVXe>AYFX[/(I@0841?):-B=14337:8=|14{c&93788|di{cW-0>0<097/A;N{FqYpugAFT%X/Yo3Yn,#=XlCYHYNX[Xk3YN:YRT4?)-YH%A5XlYF3C1=NWyY}>:74-C673<69545v {iT85YED=64=.F4..9878/D4378?48B3:7:7/1VX[f4{D,{l<5E75{dAbRB-8-@+;DBF/$ZfW8S<4YhXA.(5@*11YV8./S95C/0R-A4AXQYI7?68167B95HA1*<M3?1/@;/=54XbYP36}lc{qzSS38:19?,/39193574/66878Yw1X-87E6=;964X`T734:>86>1/=0;(I-1::7ALYGXhF+Xk[@W%TYbX7)KXdYEXi,H-XhYMRXfYK?XgXj.9HX_SX]YL1XmYJ>Y}WwIXiI-3-GXcYyXUYJ$X`Vs[7;XnYEZ;XF! 3;%8;PXX(N3Y[)Xi1YE&/ :;74YQ6X`33C;-(>Xm0(TYF/!YGXg8 9L5P01YPXO-5%C|qd{{/K/E6,=0144:361:955;6443@?B7*7:F89&F35YaX-CYf,XiFYRXE_e{}sF 0*7XRYPYfXa5YXXY8Xf8Y~XmA[9VjYj*#YMXIYOXk,HHX40YxYMXU8OXe;YFXLYuPXP?EB[QV0CXfY{:9XV[FWE0D6X^YVP*$4%OXiYQ(|xp|%c3{}V`1>Y`XH00:8/M6XhQ1:;3414|TE|&o@1*=81G8<3}6<|(f6>>>5-5:8;093B^3U*+*^*UT30XgYU&7*O1953)5@E78--F7YF*B&0:%P68W9Zn5974J9::3}Vk|-,C)=)1AJ4+<3YGXfY[XQXmT1M-XcYTYZXCYZXEYXXMYN,17>XIG*SaS|/eYJXbI?XdNZ+WRYP<F:R PXf;0Xg`$|1GX9YdXjLYxWX!ZIXGYaXNYm6X9YMX?9EXmZ&XZ#XQ>YeXRXfAY[4 ;0X!Zz0XdN$XhYL XIY^XGNXUYS/1YFXhYk.TXn4DXjB{jg|4DEX]:XcZMW=A.+QYL<LKXc[vV$+&PX*Z3XMYIXUQ:ZvW< YSXFZ,XBYeXMM)?Xa XiZ4/EXcP3%}&-|6~:1(-+YT$@XIYRBC<}&,|7aJ6}bp|8)K1|Xg|8C}[T|8Q.89;-964I38361<=/;883651467<7:>?1:.}le|:Z=39;1Y^)?:J=?XfLXbXi=Q0YVYOXaXiLXmJXO5?.SFXiCYW}-;|=u&D-X`N0X^,YzYRXO(QX_YW9`I|>hZ:N&X)DQXP@YH#XmNXi$YWX^=!G6YbYdX>XjY|XlX^XdYkX>YnXUXPYF)FXT[EVTMYmYJXmYSXmNXi#GXmT3X8HOX[ZiXN]IU2>8YdX1YbX<YfWuZ8XSXcZU%0;1XnXkZ_WTG,XZYX5YSX Yp 05G?XcYW(IXg6K/XlYP4XnI @XnO1W4Zp-9C@%QDYX+OYeX9>--YSXkD.YR%Q/Yo YUX].Xi<HYEZ2WdCE6YMXa7F)=,D>-@9/8@5=?7164;35387?N<618=6>7D+C50<6B03J0{Hj|N9$D,9I-,.KB3}m |NzE0::/81YqXjMXl7YG; [.W=Z0X4XQY]:MXiR,XgM?9$9>:?E;YE77VS[Y564760391?14941:0=:8B:;/1DXjFA-564=0B3XlH1+D85:0Q!B#:-6&N/:9<-R3/7Xn<*3J4.H:+334B.=>30H.;3833/76464665755:/83H6633:=;.>5645}&E|Y)?1/YG-,93&N3AE@5 <L1-G/8A0D858/30>8<549=@B8] V0[uVQYlXeD(P#ID&7T&7;Xi0;7T-$YE)E=1:E1GR):--0YI7=E<}n9|aT6783A>D7&4YG7=391W;Zx<5+>F#J39}o/|cc;6=A050EQXg8A1-}D-|d^5548083563695D?-.YOXd37I$@LYLWeYlX<Yd+YR A$;3-4YQ-9XmA0!9/XLY_YT(=5XdDI>YJ5XP1ZAW{9>X_6R(XhYO65&J%DA)C-!B:97#A9;@?F;&;(9=11/=657/H,<8}bz|j^5446>.L+&Y^8Xb6?(CYOXb*YF(8X`FYR(XPYVXmPQ%&DD(XmZXW??YOXZXfCYJ79,O)XnYF7K0!QXmXi4IYFRXS,6<%-:YO(+:-3Q!1E1:W,Zo}Am|n~;3580534*?3Zc4=9334361693:30C<6/717:<1/;>59&:4}6!|rS36=1?75<8}[B|s809983579I.A.>84758=108564741H*9E{L{|u%YQ<%6XfH.YUXe4YL@,>N}Tv|ve*G0X)Z;/)3@A74(4P&A1X:YVH97;,754*A66:1 D739E3553545558E4?-?K17/770843XAYf838A7K%N!YW4.$T19Z`WJ*0XdYJXTYOXNZ 1XaN1A+I&Xi.Xk3Z3GB&5%WhZ1+5#Y[X<4YMXhQYoQXVXbYQ8XSYUX4YXBXWDMG0WxZA[8V+Z8X;D],Va$%YeX?FXfX[XeYf<X:Z[WsYz8X_Y]%XmQ(!7BXIZFX]&YE3F$(1XgYgYE& +[+W!<YMYFXc;+PXCYI9YrWxGXY9DY[!GXiI7::)OC;*$.>N*HA@{C|}&k=:<TB83X`3YL+G4XiK]i}(fYK<=5$.FYE%4*5*H*6XkCYL=*6Xi6!Yi1KXR4YHXbC8Xj,B9ZbWx/XbYON#5B}Ue}+QKXnF1&YV5XmYQ0!*3IXBYb71?1B75XmF;0B976;H/RXU:YZX;BG-NXj;XjI>A#D3B636N;,*%<D:0;YRXY973H5)-4FXOYf0:0;/7759774;7;:/855:543L43<?6=E,.A4:C=L)%4YV!1(YE/4YF+ F3%;S;&JC:%/?YEXJ4GXf/YS-EXEYW,9;E}X$}547EXiK=51-?71C%?57;5>463553Zg90;6447?<>4:9.7538XgN{|!}9K/E&3-:D+YE1)YE/3;37/:05}n<}:UX8Yj4Yt864@JYK..G=.(A Q3%6K>3(P3#AYE$-6H/456*C=.XHY[#S.<780191;057C)=6HXj?955B:K1 E>-B/9,;5.!L?:0>/.@//:;7833YZ56<4:YE=/:7Z_WGC%3I6>XkC*&NA16X=Yz2$X:Y^&J48<99k8}CyB-61<18K946YO4{|N}E)YIB9K0L>4=46<1K0+R;6-=1883:478;4,S+3YJX`GJXh.Yp+Xm6MXcYpX(>7Yo,/:X=Z;Xi0YTYHXjYmXiXj;*;I-8S6N#XgY}.3XfYGO3C/$XjL$*NYX,1 6;YH&<XkK9C#I74.>}Hd`A748X[T450[n75<4439:18A107>|ET}Rf<1;14876/Yb983E<5.YNXd4149>,S=/4E/<306443G/06}0&}UkYSXFYF=44=-5095=88;63844,9E6644{PL}WA8:>)7+>763>>0/B3A545CCnT}Xm|dv}Xq1L/YNXk/H8;;.R63351YY747@15YE4J8;46;.38.>4A369.=-83,;Ye3?:3@YE.4-+N353;/;@(X[YYD>@/05-I*@.:551741Yf5>6A443<3535;.58/86=D4753442$635D1>0359NQ @73:3:>><Xn?;43C14 ?Y|X611YG1&<+,4<*,YLXl<1/AIXjF*N89A4Z576K1XbJ5YF.ZOWN.YGXO/YQ01:4G38Xl1;KI0YFXB=R<7;D/,/4>;$I,YGXm94@O35Yz66695385.>:6A#5}W7n^4336:4157597434433<3|XA}m`>=D>:4A.337370?-6Q96{`E|4A}C`|Qs{Mk|J+~r>|o,wHv>Vw}!c{H!|Gb|*Ca5}J||,U{t+{CN[!M65YXOY_*B,Y[Z9XaX[QYJYLXPYuZ%XcZ8LY[SYPYKZM<LMYG9OYqSQYM~[e{UJXmQYyZM_)>YjN1~[f3{aXFY|Yk:48YdH^NZ0|T){jVFYTZNFY^YTYN~[h{nPYMYn3I]`EYUYsYIZEYJ7Yw)YnXPQYH+Z.ZAZY]^Z1Y`YSZFZyGYHXLYG 8Yd#4~[i|+)YH9D?Y^F~Y7|-eYxZ^WHYdYfZQ~[j|3>~[k|3oYmYqY^XYYO=Z*4[]Z/OYLXhZ1YLZIXgYIHYEYK,<Y`YEXIGZI[3YOYcB4SZ!YHZ*&Y{Xi3~[l|JSY`Zz?Z,~[m|O=Yi>??XnYWXmYS617YVYIHZ(Z4[~L4/=~[n|Yu{P)|];YOHHZ}~[o33|a>~[r|aE]DH~[s|e$Zz~[t|kZFY~XhYXZB[`Y}~[u|{SZ&OYkYQYuZ2Zf8D~[v}% ~[w3},Q[X]+YGYeYPIS~[y}4aZ!YN^!6PZ*~[z}?E~[{3}CnZ=~[}}EdDZz/9A3(3S<,YR8.D=*XgYPYcXN3Z5 4)~[~}JW=$Yu.XX~] }KDX`PXdZ4XfYpTJLY[F5]X~[2Yp}U+DZJ::<446[m@~]#3}]1~]%}^LZwZQ5Z`/OT<Yh^ -~]&}jx[ ~m<z!%2+~ly4VY-~o>}p62yz!%2+Xf2+~ly4VY-zQ`z (=] 2z~o2",C={" ":0,"!":1},c=34,i=2,p,s="",u=String.fromCharCode,t=u(12539);for(;++c<127;)C[u(c)]=c^39&&c^92?i++:0;i=0;for(;0<=(c=C[a.charAt(i++)]);)if(16===c)if((c=C[a.charAt(i++)])<87){if(86===c)c=1879;for(;c--;)s+=u(++p)}else s+=s.substr(8272,360);else if(c<86)s+=u(p+=c<51?c-16:(c-55)*92+C[a.charAt(i++)]);else if((c=((c-86)*92+C[a.charAt(i++)])*92+C[a.charAt(i++)])<49152)s+=u(p=c<40960?c:c|57344);else{c&=511;for(;c--;)s+=t;p=12539}return s')();

    /**
     * resize
     */
    function resizeCanvas()
    {
        for (var i in stages) {
            if (!stages.hasOwnProperty(i)) {
                continue;
            }
            var stage = stages[i];
            if (!stage.isLoad) {
                continue;
            }
            stage.resize();
        }
    }

    /**
     * @param audio
     * @param soundInfo
     */
    function startSound(audio, soundInfo)
    {
        if (soundInfo.SyncStop) {
            audio.pause();
        } else {
            if (soundInfo.HasLoops) {
                audio.loopCount = soundInfo.LoopCount;
                var loopSound = function ()
                {
                    audio.loopCount--;
                    if (!this.loopCount) {
                        audio.removeEventListener("ended", loopSound);
                    } else {
                        audio.currentTime = 0;
                        if (soundInfo.HasInPoint) {
                            audio.currentTime = soundInfo.InPoint;
                        }
                        audio.play();
                    }
                };
                audio.addEventListener("ended", loopSound);
            }

            if (soundInfo.HasInPoint) {
                audio.addEventListener("canplay", function ()
                {
                    this.currentTime = soundInfo.InPoint;
                });
            }

            audio.play();
        }
    }

    /**
     * resize event
     */
    window.addEventListener("resize", function ()
    {
        _clearTimeout(resizeId);
        resizeId = _setTimeout(resizeCanvas, 300);
    });

    /**
     * unload event
     */
    window.addEventListener("unload", function ()
    {
        stages = void 0;
        loadStages = void 0;
    });

    /**
     * @constructor
     */
    var VectorToCanvas = function () {};

    /**
     * Function
     */
    VectorToCanvas.prototype.FUNCTION = Function;

    /**
     * @param src
     * @returns {{}}
     */
    VectorToCanvas.prototype.clone = function (src)
    {
        var execute = function (src, obj)
        {
            var prop;
            for (prop in src) {
                if (!src.hasOwnProperty(prop)) {
                    continue;
                }
                var value = src[prop];
                if (value instanceof Array) {
                    obj[prop] = [];
                    execute(value, obj[prop]);
                } else if (value instanceof Object) {
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
    };

    /**
     * @param shapes
     * @param isMorph
     * @returns {Array}
     */
    VectorToCanvas.prototype.convert = function (shapes, isMorph)
    {
        var _this = this;
        var lineStyles = shapes.lineStyles.lineStyles;
        var fillStyles = shapes.fillStyles.fillStyles;
        var records = shapes.ShapeRecords;
        var idx = 0;
        var obj = {};
        var cache = [];
        var AnchorX = 0;
        var AnchorY = 0;
        var MoveX = 0;
        var MoveY = 0;
        var LineX = 0;
        var LineY = 0;
        var FillStyle0 = 0;
        var FillStyle1 = 0;
        var LineStyle = 0;
        var fills0 = [];
        var fills1 = [];
        var lines = [];
        var stack = [];
        var depth = 0;
        var length = records.length;
        for (var i = 0; i < length; i++) {
            var record = records[i];
            if (!record) {
                stack = _this.setStack(stack, _this.fillMerge(fills0, fills1, isMorph));
                stack = _this.setStack(stack, lines);
                break;
            }

            if (record.isChange) {
                depth++;
                if (record.StateNewStyles) {
                    AnchorX = 0;
                    AnchorY = 0;
                    stack = _this.setStack(stack, _this.fillMerge(fills0, fills1, isMorph));
                    stack = _this.setStack(stack, lines);
                    fills0 = [];
                    fills1 = [];
                    lines = [];

                    if (record.NumFillBits) {
                        fillStyles = record.FillStyles.fillStyles;
                    }
                    if (record.NumLineBits) {
                        lineStyles = record.LineStyles.lineStyles;
                    }
                }

                MoveX = AnchorX;
                MoveY = AnchorY;
                if (record.StateMoveTo) {
                    MoveX = record.MoveX;
                    MoveY = record.MoveY;
                }
                LineX = MoveX;
                LineY = MoveY;

                if (record.StateFillStyle0) {
                    FillStyle0 = record.FillStyle0;
                }
                if (record.StateFillStyle1) {
                    FillStyle1 = record.FillStyle1;
                }
                if (record.StateLineStyle) {
                    LineStyle = record.LineStyle;
                }
                continue;
            }

            AnchorX = record.AnchorX;
            AnchorY = record.AnchorY;
            var ControlX = record.ControlX;
            var ControlY = record.ControlY;
            var isCurved = record.isCurved;
            if (FillStyle0) {
                idx = FillStyle0 - 1;
                if (!(idx in fills0)) {
                    fills0[idx] = [];
                }

                if (!(depth in fills0[idx])) {
                    fills0[idx][depth] = {
                        obj: fillStyles[idx],
                        startX: MoveX,
                        startY: MoveY,
                        endX: 0,
                        endY: 0,
                        cache: []
                    };
                }

                obj = fills0[idx][depth];
                cache = obj.cache;
                cache[cache.length] = _this.clone(record);
                obj.endX = AnchorX;
                obj.endY = AnchorY;
            }

            if (FillStyle1) {
                idx = FillStyle1 - 1;
                if (!(idx in fills1)) {
                    fills1[idx] = [];
                }

                if (!(depth in fills1[idx])) {
                    fills1[idx][depth] = {
                        obj: fillStyles[idx],
                        startX: MoveX,
                        startY: MoveY,
                        endX: 0,
                        endY: 0,
                        cache: []
                    };
                }

                obj = fills1[idx][depth];
                cache = obj.cache;
                cache[cache.length] = _this.clone(record);
                obj.endX = AnchorX;
                obj.endY = AnchorY;
            }

            if (LineStyle) {
                idx = LineStyle - 1;
                if (!(idx in lines)) {
                    lines[idx] = {
                        obj: lineStyles[idx],
                        cache: []
                    };
                }

                obj = lines[idx];
                cache = obj.cache;
                cache[cache.length] = [0, LineX, LineY];
                var code = [2, AnchorX, AnchorY];
                if (isCurved) {
                    code = [1, ControlX, ControlY, AnchorX, AnchorY];
                }
                cache[cache.length] = code;
            }

            LineX = AnchorX;
            LineY = AnchorY;
        }

        return stack;
    };

    /**
     * @param fills0
     * @param fills1
     * @param isMorph
     * @returns {*}
     */
    VectorToCanvas.prototype.fillMerge = function (fills0, fills1, isMorph)
    {
        var _this = this;
        fills0 = _this.fillReverse(fills0);
        if (fills0.length) {
            for (var i in fills0) {
                if (!fills0.hasOwnProperty(i)) {
                    continue;
                }
                var fills = fills0[i];
                if (i in fills1) {
                    var fill1 = fills1[i];
                    for (var depth in fills) {
                        if (!fills.hasOwnProperty(depth)) {
                            continue;
                        }
                        fill1[fill1.length] = fills[depth];
                    }
                } else {
                    fills1[i] = fills;
                }
            }
        }
        return _this.coordinateAdjustment(fills1, isMorph);
    };

    /**
     * @param fills0
     * @returns {*}
     */
    VectorToCanvas.prototype.fillReverse = function (fills0)
    {
        if (!fills0.length) {
            return fills0;
        }

        for (var i in fills0) {
            if (!fills0.hasOwnProperty(i)) {
                continue;
            }
            var fills = fills0[i];
            for (var depth in fills) {
                if (!fills.hasOwnProperty(depth)) {
                    continue;
                }
                var AnchorX = 0;
                var AnchorY = 0;
                var obj = fills[depth];
                var cacheX = obj.startX;
                var cacheY = obj.startY;
                var cache = obj.cache;
                var length = cache.length;
                if (length) {
                    for (var idx in cache) {
                        if (!cache.hasOwnProperty(idx)) {
                            continue;
                        }
                        var recode = cache[idx];
                        AnchorX = recode.AnchorX;
                        AnchorY = recode.AnchorY;
                        recode.AnchorX = cacheX;
                        recode.AnchorY = cacheY;
                        cacheX = AnchorX;
                        cacheY = AnchorY;
                    }
                    var array = [];
                    if (length > 0) {
                        while (length--) {
                            array[array.length] = cache[length];
                        }
                    }
                    obj.cache = array;
                }

                cacheX = obj.startX;
                cacheY = obj.startY;
                obj.startX = obj.endX;
                obj.startY = obj.endY;
                obj.endX = cacheX;
                obj.endY = cacheY;
            }
        }
        return fills0;
    };

    /**
     * @param fills1
     * @param isMorph
     */
    VectorToCanvas.prototype.coordinateAdjustment = function (fills1, isMorph)
    {
        for (var i in fills1) {
            if (!fills1.hasOwnProperty(i)) {
                continue;
            }
            var array = [];
            var fills = fills1[i];

            for (var depth in fills) {
                if (!fills.hasOwnProperty(depth)) {
                    continue;
                }
                array[array.length] = fills[depth];
            }

            var adjustment = [];
            if (array.length > 1 && !isMorph) {
                while (true) {
                    if (!array.length) {
                        break;
                    }

                    var fill = array.shift();
                    if (fill.startX === fill.endX && fill.startY === fill.endY) {
                        adjustment[adjustment.length] = fill;
                        continue;
                    }

                    var mLen = array.length;
                    if (mLen < 0) {
                        break;
                    }

                    var isMatch = 0;
                    while (mLen--) {
                        var comparison = array[mLen];
                        if (comparison.startX === fill.endX && comparison.startY === fill.endY) {
                            fill.endX = comparison.endX;
                            fill.endY = comparison.endY;
                            var cache0 = fill.cache;
                            var cache1 = comparison.cache;
                            var cLen = cache1.length;
                            for (var cIdx = 0; cIdx < cLen; cIdx++) {
                                cache0[cache0.length] = cache1[cIdx];
                            }
                            array.splice(mLen, 1);
                            array.unshift(fill);
                            isMatch = 1;
                            break;
                        }
                    }

                    if (!isMatch) {
                        array.unshift(fill);
                    }
                }
            } else {
                adjustment = array;
            }

            var aLen = adjustment.length;
            var cache = [];
            var obj = {};
            for (var idx = 0; idx < aLen; idx++) {
                var data = adjustment[idx];
                obj = data.obj;
                var caches = data.cache;
                var cacheLength = caches.length;
                cache[cache.length] = [0, data.startX, data.startY];
                for (var compIdx = 0; compIdx < cacheLength; compIdx++) {
                    var r = caches[compIdx];
                    var code = [2, r.AnchorX, r.AnchorY];
                    if (r.isCurved) {
                        code = [1, r.ControlX, r.ControlY, r.AnchorX, r.AnchorY];
                    }
                    cache[cache.length] = code;
                }
            }

            fills1[i] = {cache: cache, obj: obj};
        }
        return fills1;
    };

    /**
     * @param stack
     * @param array
     * @returns {*}
     */
    VectorToCanvas.prototype.setStack = function (stack, array)
    {
        var _this = this;
        var _buildCommand = _this.buildCommand;
        if (array.length) {
            for (var i in array) {
                if (!array.hasOwnProperty(i)) {
                    continue;
                }
                var data = array[i];
                stack[stack.length] = {
                    obj: data.obj,
                    cmd: _buildCommand.call(_this, data.cache)
                };
            }
        }
        return stack;
    };

    /**
     * @param cache
     * @returns {*}
     */
    VectorToCanvas.prototype.buildCommand = function (cache)
    {
        var _this = this;
        if (isWebGL) {
            return _this.toCanvas2D(cache); // TODO toWebGL
        } else {
            return _this.toCanvas2D(cache);
        }
    };

    /**
     * @param cache
     * @returns {*}
     */
    VectorToCanvas.prototype.toCanvas2D = function (cache)
    {
        var length = cache.length;
        var str = "";
        var i = 0;
        while (i < length) {
            var a = cache[i];
            switch (a[0]) {
                case 0:
                    str += "ctx.moveTo(" + a[1] + "," + a[2] + ");";
                    break;
                case 1:
                    str += "ctx.quadraticCurveTo(" + a[1] + "," + a[2] + "," + a[3] + "," + a[4] + ");";
                    break;
                case 2:
                    str += "ctx.lineTo(" + a[1] + "," + a[2] + ");";
                    break;
                case 3:
                    str += "ctx.bezierCurveTo(" + a[1] + "," + a[2] + "," + a[3] + "," + a[4] + "," + a[5] + "," + a[6] + ");";
                    break;
                case 4:
                    str += "ctx.moveTo(" + (a[1] + a[3]) + "," + a[2] + ");";
                    str += "ctx.arc(" + a[1] + "," + a[2] + "," + a[3] + ",0 , Math.PI*2, false);";
                    break;

                // Graphics
                case 5: // fillStyle
                    str += "var r = Math.max(0, Math.min(("+ a[1] +" * ct[0]) + ct[4], 255))|0;";
                    str += "var g = Math.max(0, Math.min(("+ a[2] +" * ct[1]) + ct[5], 255))|0;";
                    str += "var b = Math.max(0, Math.min(("+ a[3] +" * ct[2]) + ct[6], 255))|0;";
                    str += "var a = Math.max(0, Math.min(("+ a[4] +" * 255 * ct[3]) + ct[7], 255)) / 255;";
                    str += "ctx.fillStyle = 'rgba('+r+', '+g+', '+b+', '+a+')';";
                    break;
                case 6: // strokeStyle
                    str += "var r = Math.max(0, Math.min(("+ a[1] +" * ct[0]) + ct[4], 255))|0;";
                    str += "var g = Math.max(0, Math.min(("+ a[2] +" * ct[1]) + ct[5], 255))|0;";
                    str += "var b = Math.max(0, Math.min(("+ a[3] +" * ct[2]) + ct[6], 255))|0;";
                    str += "var a = Math.max(0, Math.min(("+ a[4] +" * 255 * ct[3]) + ct[7], 255)) / 255;";
                    str += "ctx.strokeStyle = 'rgba('+r+', '+g+', '+b+', '+a+')';";
                    break;
                case 7: // fill
                    str += "if (!isClip) { ctx.fill(); }";
                    break;
                case 8: // stroke
                    str += "if (!isClip) { ctx.stroke(); }";
                    break;
                case 9: // width
                    str += "ctx.lineWidth = "+ a[1] +";";
                    break;
                case 10: // lineCap
                    str += "ctx.lineCap = '"+ a[1] +"';";
                    break;
                case 11: // lineJoin
                    str += "ctx.lineJoin = '"+ a[1] +"';";
                    break;
                case 12: // miterLimit
                    str += "ctx.lineJoin = '"+ a[1] +"';";
                    break;
                case 13: // beginPath
                    str += "ctx.beginPath();";
                    break;
            }
            i++;
        }
        return new this.FUNCTION("ctx", "ct", "isClip", str);
    };

    /**
     * @param cache
     * @returns {*}
     */
    VectorToCanvas.prototype.toWebGL = function (cache)
    {
        var length = cache.length;
        var polygons = [];
        var curves = [];
        var polygon = [];
        var position = -1;
        var lastPosition = {x:0, y:0};
        var str = "";
        for (var i = 0; i < length; i++) {
            var a = cache[i];
            switch (a[0]) {
                case 0: // moveTo
                    if (position > 0) {
                        polygons[position] = polygon;
                    }

                    position++;
                    polygons[position + 1] = [];
                    polygon = [];
                    polygon[polygon.length] = a[1];
                    polygon[polygon.length] = a[2];
                    lastPosition.x = a[1];
                    lastPosition.y = a[2];
                    break;
                case 1: // quadraticCurveTo
                    curves[curves.length] = lastPosition.x;
                    curves[curves.length] = lastPosition.y;
                    curves[curves.length] = a[1];
                    curves[curves.length] = a[2];
                    curves[curves.length] = a[3];
                    curves[curves.length] = a[4];

                    polygon[polygon.length] = a[3];
                    polygon[polygon.length] = a[4];
                    lastPosition.x = a[3];
                    lastPosition.y = a[4];
                    break;
                case 2: // lineTo
                    polygon[polygon.length] = a[1];
                    polygon[polygon.length] = a[2];
                    lastPosition.x = a[1];
                    lastPosition.y = a[2];
                    break;
                case 3: // bezierCurveTo
                    // TODO bezierCurveTo
                    break;
                case 4: // arc
                    // TODO arc
                    break;
            }
        }

        return new this.FUNCTION("ctx", str);
    };

    var vtc = new VectorToCanvas();

    /**
     * @constructor
     */
    var CacheStore = function ()
    {
        this.store = {};
        this.pool = [];
        this.size = 73400320; // 70M
    };

    /**
     * reset
     */
    CacheStore.prototype.reset = function ()
    {
        var _this = this;
        var store = _this.store;
        for (var key in store) {
            if (!store.hasOwnProperty(key)) {
                continue;
            }
            var value = store[key];
            if (!(value instanceof CanvasRenderingContext2D)) {
                continue;
            }
            _this.destroy(value);
        }
        _this.store = {};
        _this.size = 73400320;
    };

    /**
     * @param ctx
     */
    CacheStore.prototype.destroy = function (ctx)
    {
        var pool = this.pool;
        var canvas = ctx.canvas;
        if (isWebGL) {
            ctx.clear(ctx.STENCIL_BUFFER_BIT | ctx.COLOR_BUFFER_BIT);
        } else {
            ctx.clearRect(0, 0, canvas.width + 1, canvas.height + 1);
        }
        canvas.width = canvas.height = 1;
        pool[pool.length] = canvas;
    };

    /**
     * @returns {*}
     */
    CacheStore.prototype.getCanvas = function ()
    {
        return this.pool.pop() || _document.createElement("canvas");
    };

    /**
     * @param key
     * @returns {*}
     */
    CacheStore.prototype.getCache = function (key)
    {
        return this.store[key];
    };

    /**
     * @param key
     * @param value
     */
    CacheStore.prototype.setCache = function (key, value)
    {
        var _this = this;
        if (value instanceof CanvasRenderingContext2D) {
            var canvas = value.canvas;
            _this.size -= (canvas.width * canvas.height);
        }
        this.store[key] = value;
    };

    /**
     * @param name
     * @param id
     * @param matrix
     * @param cxForm
     * @returns {string}
     */
    CacheStore.prototype.generateKey = function (name, id, matrix, cxForm)
    {
        var key = name + "_" + id;
        if (matrix instanceof Array) {
            key += "_" + matrix.join("_");
        }
        if (cxForm instanceof Array) {
            key += "_" + cxForm.join("_");
        }
        return key;
    };
    var cacheStore = new CacheStore();

    /**
     * @constructor
     */
    var BitIO = function ()
    {
        var _this = this;
        _this.data = null;
        _this.bit_offset = 0;
        _this.byte_offset = 0;
        _this.bit_buffer = null;
    };

    /**
     * @param data
     */
    BitIO.prototype.init = function (data)
    {
        var _this = this;
        var length = data.length;
        var array = _this.createArray(length);
        var i = 0;
        while (i < length) {
            array[i] = data.charCodeAt(i) & 0xff;
            i++;
        }
        _this.data = array;
    };

    /**
     * @param str
     * @returns {XML|string|void|*}
     */
    BitIO.prototype.decodeToShiftJis = function (str)
    {
        return str.replace(/%(8[1-9A-F]|[9E][0-9A-F]|F[0-9A-C])(%[4-689A-F][0-9A-F]|%7[0-9A-E]|[@-~])|%([0-7][0-9A-F]|A[1-9A-F]|[B-D][0-9A-F])/ig,
            function (s)
            {
                var c = parseInt(s.substring(1, 3), 16);
                var l = s.length;
                return 3 === l ? _fromCharCode(c < 160 ? c : c + 65216) : JCT11280.charAt((c < 160 ? c - 129 : c - 193) * 188 + (4 === l ? s.charCodeAt(3) - 64 : (c = parseInt(s.substring(4), 16)) < 127 ? c - 64 : c - 65));
            }
        );
    };

    /**
     * @param compressed
     * @returns {Array}
     */
    BitIO.prototype.unlzma = function (compressed)
    {
        return [];
    };

    /**
     * @param compressed
     * @param isDeCompress
     * @returns {Array}
     */
    BitIO.prototype.unzip = function (compressed, isDeCompress)
    {
        var _this = this;
        var sym = 0;
        var i = 0;
        var length = 0;
        var data = [];
        var bitLengths = [];
        var bitio = new BitIO();
        bitio.setData(compressed);

        var ORDER =
            [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];

        var LEXT = [
            0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2,
            3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 99, 99
        ];

        var LENS = [
            3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31,
            35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0
        ];

        var DEXT = [
            0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6,
            7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13
        ];

        var DISTS = [
            1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193,
            257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145,
            8193, 12289, 16385, 24577
        ];

        if (isArrayBuffer) {
            ORDER = new Uint8Array(ORDER);
            LEXT = new Uint8Array(LEXT);
            LENS = new Uint16Array(LENS);
            DEXT = new Uint8Array(DEXT);
            DISTS = new Uint16Array(DISTS);
        }

        var startOffset = 2;
        if (isDeCompress) {
            startOffset = 10;
        }
        bitio.setOffset(startOffset, 8);

        for (var flag = 0; !flag;) {
            flag = bitio.readUB(1);
            var type = bitio.readUB(2);
            var distTable = {};
            var litTable = {};
            var fixedDistTable = false;
            var fixedLitTable = false;

            if (type) {
                if (type === 1) {
                    distTable = fixedDistTable;
                    litTable = fixedLitTable;

                    if (!distTable) {
                        bitLengths = [];
                        for (i = 32; i--;) {
                            bitLengths[bitLengths.length] = 5;
                        }
                        distTable = fixedDistTable = _this.buildHuffTable(bitLengths);
                    }

                    if (!litTable) {
                        bitLengths = [];
                        i = 0;
                        while (i < 144) {
                            i++;
                            bitLengths[bitLengths.length] = 8;
                        }
                        while (i < 256) {
                            i++;
                            bitLengths[bitLengths.length] = 9;
                        }
                        while (i < 280) {
                            i++;
                            bitLengths[bitLengths.length] = 7;
                        }
                        while (i < 288) {
                            i++;
                            bitLengths[bitLengths.length] = 8;
                        }
                        litTable = fixedLitTable = _this.buildHuffTable(bitLengths);
                    }
                } else {
                    var numLitLengths = bitio.readUB(5) + 257;
                    var numDistLengths = bitio.readUB(5) + 1;
                    var numCodeLengths = bitio.readUB(4) + 4;
                    var codeLengths = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    if (isArrayBuffer) {
                        codeLengths = new Uint8Array(codeLengths);
                    }
                    for (i = 0; i < numCodeLengths; i++) {
                        codeLengths[ORDER[i]] = bitio.readUB(3);
                    }
                    var codeTable = _this.buildHuffTable(codeLengths);
                    codeLengths = null;

                    var litLengths = [];
                    var prevCodeLen = 0;
                    var maxLengths = numLitLengths + numDistLengths;
                    while (litLengths.length < maxLengths) {
                        sym = _this.decodeSymbol(bitio, codeTable);
                        switch (sym) {
                            case 16:
                                i = bitio.readUB(2) + 3;
                                while (i--) {
                                    litLengths[litLengths.length] = prevCodeLen;
                                }
                                break;
                            case 17:
                                i = bitio.readUB(3) + 3;
                                while (i--) {
                                    litLengths[litLengths.length] = 0;
                                }
                                break;
                            case 18:
                                i = bitio.readUB(7) + 11;
                                while (i--) {
                                    litLengths[litLengths.length] = 0;
                                }
                                break;
                            default:
                                if (sym <= 15) {
                                    litLengths[litLengths.length] = sym;
                                    prevCodeLen = sym;
                                }
                                break;
                        }
                    }
                    distTable = _this.buildHuffTable(litLengths.splice(numLitLengths, numDistLengths));
                    litTable = _this.buildHuffTable(litLengths);
                }

                sym = 0;
                while (sym !== 256) {
                    sym = _this.decodeSymbol(bitio, litTable);
                    if (sym < 256) {
                        data[data.length] = sym;
                    } else if (sym > 256) {
                        var mapIdx = sym - 257;
                        length = LENS[mapIdx] + bitio.readUB(LEXT[mapIdx]);
                        var distMap = _this.decodeSymbol(bitio, distTable);
                        var dist = DISTS[distMap] + bitio.readUB(DEXT[distMap]);
                        i = data.length - dist;
                        while (length--) {
                            data[data.length] = data[i++];
                        }
                    }
                }
            } else {
                bitio.bit_offset = 8;
                bitio.bit_buffer = null;
                length = bitio.readNumber(2);
                bitio.readNumber(2); // nlen
                while (length--) {
                    data[data.length] = bitio.readNumber(1);
                }
            }
        }
        return data;
    };

    /**
     * @param data
     * @returns {{}}
     */
    BitIO.prototype.buildHuffTable = function (data)
    {
        var length = data.length;
        var blCount = [];
        var nextCode = [];
        var table = {};
        var code = 0;
        var len = 0;
        var maxBits = 0;
        for (var i = 0; i < length; i++) {
            maxBits = _max(maxBits, data[i]);
        }
        maxBits++;

        i = length;
        while (i--) {
            len = data[i];
            blCount[len] = (blCount[len] || 0) + (len > 0);
        }

        for (i = 1; i < maxBits; i++) {
            len = i - 1;
            if (!(len in blCount)) {
                blCount[len] = 0;
            }
            code = (code + blCount[len]) << 1;
            nextCode[i] = code|0;
        }

        for (i = 0; i < length; i++) {
            len = data[i];
            if (len) {
                table[nextCode[len]] = {length: len, symbol: i};
                nextCode[len]++;
            }
        }
        return table;
    };

    /**
     * @param bitio
     * @param table
     * @returns {*}
     */
    BitIO.prototype.decodeSymbol = function (bitio, table)
    {
        var code = 0;
        var len = 0;
        while (true) {
            code = (code << 1) | bitio.readUB(1);
            len++;
            if (!(code in table)) {
                continue;
            }
            var entry = table[code];
            if (entry.length === len) {
                return entry.symbol;
            }
        }
    };

    /**
     * @param length
     * @returns {Array}
     */
    BitIO.prototype.createArray = function (length)
    {
        return (isArrayBuffer) ? new Uint8Array(length) : [];
    };

    /**
     * @param data
     */
    BitIO.prototype.setData = function (data)
    {
        this.data = data;
    };

    /**
     * @returns {string}
     */
    BitIO.prototype.getHeaderSignature = function ()
    {
        var _this = this;
        var str = "";
        var count = 3;
        while (count) {
            var code = _this.getUI8();
            switch (code) { // trim
                case 32:
                case 96:
                case 127:
                    continue;
                default:
                    break;
            }
            str += _fromCharCode(code);
            count--;
        }
        return str;
    };

    /**
     * @returns {number}
     */
    BitIO.prototype.getVersion = function ()
    {
        return this.getUI8();
    };

    /**
     * byteAlign
     */
    BitIO.prototype.byteAlign = function ()
    {
        var _this = this;
        if (!_this.bit_offset) {
            return;
        }
        _this.byte_offset += ((_this.bit_offset + 7) / 8) | 0;
        _this.bit_offset = 0;
    };

    /**
     * @param length
     * @returns {Array}
     */
    BitIO.prototype.getData = function (length)
    {
        var _this = this;
        _this.byteAlign();
        var array = _this.createArray(length);
        var key = 0;
        var data = _this.data;
        var limit = length;
        while (limit--) {
            array[key++] = data[_this.byte_offset++];
        }
        return array;
    };

    /**
     * @param value
     * @param isJis
     * @returns {string}
     */
    BitIO.prototype.getDataUntil = function (value, isJis)
    {
        var _this = this;
        var data = _this.data;

        _this.byteAlign();
        var bo = _this.byte_offset;
        var offset = 0;
        if (value === null) {
            offset = -1;
        } else {
            var length = data.length;
            while (true) {
                var val = data[bo + offset];
                offset++;
                if (val === 0 || (bo + offset) >= length) {
                    break;
                }
            }
        }

        var n = (offset === -1) ? data.length - bo : offset;
        var array = [];
        var ret = "";
        var _join = Array.prototype.join;
        var i = 0;
        if (value !== null) {
            for (i = 0; i < n; i++) {
                var code = data[bo + i];
                if (code === 10 || code === 13) {
                    array[array.length] = "\n";
                }
                if (code < 32) {
                    continue;
                }
                array[array.length] = "%" + code.toString(16);
            }

            if (array.length) {
                var str = _join.call(array, "");
                if (str.length > 5 && str.substr(-5) === "\n") {
                    str = str.slice(0, -5);
                }

                if (isJis) {
                    ret = _this.decodeToShiftJis(str);
                } else {
                    try {
                        ret = decodeURIComponent(str);
                    } catch (e) {
                        ret = _this.decodeToShiftJis(str);
                    }
                }
            }
        } else {
            for (i = 0; i < n; i++) {
                ret += _fromCharCode(data[bo + i]);
            }
        }
        _this.byte_offset = bo + n;
        return ret;
    };

    /**
     * byteCarry
     */
    BitIO.prototype.byteCarry = function ()
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
     * @param n
     * @returns {number}
     */
    BitIO.prototype.getUIBits = function (n)
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
     * @returns {number}
     */
    BitIO.prototype.getUIBit = function ()
    {
        var _this = this;
        _this.byteCarry();
        return (_this.data[_this.byte_offset] >> (7 - _this.bit_offset++)) & 0x1;
    };

    /**
     * @param n
     * @returns {number}
     */
    BitIO.prototype.getSIBits = function (n)
    {
        var _this = this;
        var value = _this.getUIBits(n);
        var msb = value & (0x1 << (n - 1));
        if (msb) {
            var bitMask = (2 * msb) - 1;
            return -(value ^ bitMask) - 1;
        }
        return value;
    };

    /**
     * @returns {number}
     */
    BitIO.prototype.getUI8 = function ()
    {
        var _this = this;
        _this.byteAlign();
        return _this.data[_this.byte_offset++];
    };

    /**
     * @returns {number}
     */
    BitIO.prototype.getUI16 = function ()
    {
        var _this = this;
        var data = _this.data;
        _this.byteAlign();
        return (data[_this.byte_offset++] | (data[_this.byte_offset++]) << 8);
    };

    /**
     * @returns {number}
     */
    BitIO.prototype.getUI24 = function ()
    {
        var _this = this;
        var data = _this.data;
        _this.byteAlign();
        return (data[_this.byte_offset++] | (data[_this.byte_offset++]
            | (data[_this.byte_offset++]) << 8) << 8);
    };

    /**
     * @returns {number}
     */
    BitIO.prototype.getUI32 = function ()
    {
        var _this = this;
        var data = _this.data;
        _this.byteAlign();
        return (data[_this.byte_offset++] | (data[_this.byte_offset++]
            | (data[_this.byte_offset++] | (data[_this.byte_offset++]) << 8) << 8) << 8);
    };

    /**
     * @returns {number}
     */
    BitIO.prototype.getUI16BE = function ()
    {
        var _this = this;
        var data = _this.data;
        _this.byteAlign();
        return (((data[_this.byte_offset++]) << 8) | (data[_this.byte_offset++]));
    };

    /**
     * @returns {*}
     */
    BitIO.prototype.getFloat16 = function ()
    {
        var data = this.getData(2);
        var float = 0;
        for (var i = 2; i--;) {
            float |= data[i] << (i * 8);
        }
        return float;
    };

    /**
     * @returns {*}
     */
    BitIO.prototype.getFloat32 = function ()
    {
        var data = this.getData(4);
        var rv = 0;
        for (var i = 4; i--;) {
            rv |= data[i] << (i * 8);
        }
        var sign = rv & 0x80000000;
        var exp = (rv >> 23) & 0xff;
        var fraction = rv & 0x7fffff;
        if (!rv || rv === 0x80000000) {
            return 0;
        }
        return (sign ? -1 : 1) * (fraction | 0x800000) * _pow(2, (exp - 127 - 23));
    };

    /**
     * @returns {number}
     */
    BitIO.prototype.getFloat64 = function ()
    {
        var _this = this;
        var upperBits = _this.getUI32();
        var lowerBits = _this.getUI32();
        var sign = upperBits >>> 31 & 0x1;
        var exp = upperBits >>> 20 & 0x7FF;
        var upperFraction = upperBits & 0xFFFFF;
        return (!upperBits && !lowerBits) ? 0 : ((sign === 0) ? 1 : -1) *
            (upperFraction / 1048576 + lowerBits / 4503599627370496 + 1) *
                _pow(2, exp - 1023);
    };

    /**
     * @returns {number}
     */
    BitIO.prototype.getFloat64LittleEndian = function ()
    {
        var _this = this;
        var signBits = 1;
        var exponentBits = 11;
        var fractionBits = 52;
        var min = -1022;
        var max = 1023;

        var data = _this.data;
        var str = "";
        for (var i = 0; i < 8; i++) {
            var bits = data[_this.byte_offset++].toString(2);
            while (bits.length < 8) {
                bits = "0" + bits;
            }
            str = bits + str;
        }

        var sign = (str.charAt(0) === "1") ? -1 : 1;
        var exponent = parseInt(str.substr(signBits, exponentBits), 2) - max;
        var significandBase = str.substr(signBits + exponentBits, fractionBits);
        var significandBin = "1"+ significandBase;

        var val = 1;
        var significand = 0;
        if (exponent === -max) {
            if (significandBase.indexOf("1") === -1) {
                return 0;
            } else {
                exponent = min;
                significandBin = "0"+ significandBase;
            }
        }

        var l = 0;
        while (l < significandBin.length) {
            var sb = significandBin.charAt(l);
            significand += val * +sb;
            val = val / 2;
            l++;
        }

        return sign * significand * _pow(2, exponent);
    };

    /**
     * @param data
     * @returns {number}
     */
    BitIO.prototype.toUI16 = function (data)
    {
        return data[0] + (data[1] << 8);
    };

    /**
     * @param data
     * @returns {number}
     */
    BitIO.prototype.toSI16LE = function (data)
    {
        var _this = this;
        var value = _this.toUI16(data);
        return (value < 0x8000) ? value : (value - 0x10000);
    };

    /**
     * @returns {number}
     */
    BitIO.prototype.getSI8 = function ()
    {
        var _this = this;
        var value = _this.getUI8();
        if (value >> 7) { // nBits = 8;
            value -= 256; // Math.pow(2, 8)
        }
        return value;
    };

    /**
     * @returns {*}
     */
    BitIO.prototype.getSI24 = function ()
    {
        var _this = this;
        var value = _this.getUI24();
        if (value >> 23) { // nBits = 24;
            value -= 16777216; // Math.pow(2, 24)
        }
        return value;
    };

    /**
     * @param byteInt
     * @param bitInt
     */
    BitIO.prototype.incrementOffset = function (byteInt, bitInt)
    {
        var _this = this;
        _this.byte_offset += byteInt;
        _this.bit_offset += bitInt;
        _this.byteCarry();
    };

    /**
     * @param byteInt
     * @param bitInt
     */
    BitIO.prototype.setOffset = function (byteInt, bitInt)
    {
        var _this = this;
        _this.byte_offset = byteInt;
        _this.bit_offset = bitInt;
    };

    /**
     * @returns {number}
     */
    BitIO.prototype.getU30 = function ()
    {
        var _this = this;
        var value = 0;
        var data = _this.data;
        for (var i = 0; i < 5; i++) {
            var num = data[_this.byte_offset++];
            value |= ((num & 0x7f) << (7 * i));
            if (!(num & 0x80)) {
                break;
            }
        }
        return value;
    };

    /**
     * @returns {number}
     */
    BitIO.prototype.getS30 = function ()
    {
        var _this = this;
        var startOffset = _this.byte_offset;
        var value = _this.getU30();
        var nBits = (_this.byte_offset - startOffset) * 8;
        if (value >> (nBits - 1)) {
            value -= _pow(2, nBits);
        }
        return value;
    };

    /**
     * @param offset
     * @returns {number}
     */
    BitIO.prototype.ReadU30 = function (offset)
    {
        var _this = this;
        var value = 0;
        var data = _this.data;
        for (var i = 0; i < 5; i++) {
            var num = data[offset++];
            value |= ((num & 0x7f) << (7 * i));
            if (!(num & 0x80)) {
                break;
            }
        }
        return value;
    };

    /**
     * @returns {string}
     */
    BitIO.prototype.AbcReadString = function ()
    {
        var _this = this;
        var offset = _this.byte_offset;
        var data = _this.data;
        var length = _this.ReadU30(offset) + 1;
        var ret = [];
        for (var i = 0; i < length; i++) {
            var code = data[_this.byte_offset++];
            if (code < 33) {
                continue;
            }

            switch (code) {
                default:
                    break;
                case 34:
                case 35:
                case 36:
                case 37:
                case 38:
                case 39:
                case 43:
                case 45:
                    continue;
            }

            ret[ret.length] = _fromCharCode(code);
        }
        return ret.join("");
    };

    /**
     * @param length
     * @returns {number}
     */
    BitIO.prototype.readUB = function (length)
    {
        var _this = this;
        var value = 0;
        for (var i = 0; i < length; i++) {
            if (_this.bit_offset === 8) {
                _this.bit_buffer = _this.readNumber(1);
                _this.bit_offset = 0;
            }
            value |= (_this.bit_buffer & (0x01 << _this.bit_offset++) ? 1 : 0) << i;
        }
        return value;
    };

    /**
     * @returns {number}
     */
    BitIO.prototype.readNumber = function (n)
    {
        var _this = this;
        var value = 0;
        var o = _this.byte_offset;
        var i = o + n;
        while (i > o) {
            value = (value << 8) | _this.data[--i];
        }
        _this.byte_offset += n;
        return value;
    };

    /**
     * @param size
     * @param mode
     */
    BitIO.prototype.deCompress = function (size, mode)
    {
        var _this = this;
        var cacheOffset = _this.byte_offset;
        _this.byte_offset = 0;

        var data = _this.getData(cacheOffset);
        var deCompress = (mode === "ZLIB") ? _this.unzip(_this.data, true) : _this.unlzma(_this.data);

        var i = 0;
        var key = 0;
        var array = _this.createArray(size);
        var length = data.length;
        while (i < length) {
            array[key++] = data[i];
            i++;
        }

        i = 0;
        length = deCompress.length;
        while (i < length) {
            array[key++] = deCompress[i];
            i++;
        }

        _this.data = array;
        _this.byte_offset = cacheOffset;
    };

    /**
     * @constructor
     */
    var PlaceObject = function ()
    {
        var _this = this;
        _this.matrix = _this.cloneArray([1, 0, 0, 1, 0, 0]);
        _this.colorTransform = _this.cloneArray([1, 1, 1, 1, 0, 0, 0, 0]);
        _this.filters = null;
        _this.blendMode = "normal";
    };

    /**
     * @param src
     * @returns {Array}
     */
    PlaceObject.prototype.cloneArray = function(src)
    {
        var arr = [];
        var length = src.length;
        for (var i = 0; i < length; i++) {
            arr[i] = src[i];
        }
        return arr;
    };

    /**
     * @param blendMode
     * @returns {String}
     */
    PlaceObject.prototype.getBlendName = function (blendMode)
    {
        var mode = null;
        switch (blendMode) {
            case 1:
            case "normal":
                mode = "normal";
                break;
            case 2:
            case "layer":
                mode = "layer";
                break;
            case 3:
            case "multiply":
                mode = "multiply";
                break;
            case 4:
            case "screen":
                mode = "screen";
                break;
            case 5:
            case "lighten":
                mode = "lighten";
                break;
            case 6:
            case "darken":
                mode = "darken";
                break;
            case 7:
            case "difference":
                mode = "difference";
                break;
            case 8:
            case "add":
                mode = "add";
                break;
            case 9:
            case "subtract":
                mode = "subtract";
                break;
            case 10:
            case "invert":
                mode = "invert";
                break;
            case 11:
            case "alpha":
                mode = "alpha";
                break;
            case 12:
            case "erase":
                mode = "erase";
                break;
            case 13:
            case "overlay":
                mode = "overlay";
                break;
            case 14:
            case "hardlight":
                mode = "hardlight";
                break;
        }
        return mode;
    };

    /**
     * @returns {PlaceObject}
     */
    PlaceObject.prototype.clone = function ()
    {
        var _this = this;
        var placeObject = new PlaceObject();
        placeObject.setMatrix(_this.getMatrix());
        placeObject.setColorTransform(_this.getColorTransform());
        placeObject.setFilters(_this.getFilters());
        placeObject.setBlendMode(_this.getBlendMode());
        return placeObject;
    };

    /**
     * @returns {*}
     */
    PlaceObject.prototype.getMatrix = function ()
    {
        return this.matrix;
    };

    /**
     * @param matrix
     */
    PlaceObject.prototype.setMatrix = function (matrix)
    {
        var _this = this;
        _this.matrix = _this.cloneArray(matrix);
    };

    /**
     * @returns {*}
     */
    PlaceObject.prototype.getColorTransform = function ()
    {
        return this.colorTransform;
    };

    /**
     * @param colorTransform
     */
    PlaceObject.prototype.setColorTransform = function (colorTransform)
    {
        var _this = this;
        _this.colorTransform = _this.cloneArray(colorTransform);
    };

    /**
     * @returns {*}
     */
    PlaceObject.prototype.getFilters = function ()
    {
        return this.filters;
    };

    /**
     * @param filters
     */
    PlaceObject.prototype.setFilters = function (filters)
    {
        this.filters = filters;
    };

    /**
     * @returns {string}
     */
    PlaceObject.prototype.getBlendMode = function ()
    {
        return this.blendMode;
    };

    /**
     * @param blendMode
     */
    PlaceObject.prototype.setBlendMode = function (blendMode)
    {
        var _this = this;
        _this.blendMode = _this.getBlendName(blendMode);
    };

    /**
     * @param stage
     * @param bitio
     * @constructor
     */
    var SwfTag = function (stage, bitio)
    {
        var _this = this;
        _this.stage = stage;
        _this.bitio = bitio;
        _this.currentPosition = {x: 0, y: 0};
        _this.jpegTables = null;
    };

    /**
     * @param mc
     * @returns {Array}
     */
    SwfTag.prototype.parse = function (mc)
    {
        var _this = this;
        var length = _this.bitio.data.length;
        return _this.parseTags(length, mc.characterId);
    };

    /**
     * @param tags
     * @param parent
     */
    SwfTag.prototype.build = function (tags, parent)
    {
        var _this = this;
        var length = tags.length;
        if (length) {
            var _showFrame = _this.showFrame;
            var originTags = [];
            for (var frame in tags) {
                if (!tags.hasOwnProperty(frame)) {
                    continue;
                }
                var tag = tags[frame];
                _showFrame.call(_this, tag, parent, originTags);
            }
        }
    };

    /**
     * @param obj
     * @param mc
     * @param originTags
     */
    SwfTag.prototype.showFrame = function (obj, mc, originTags)
    {
        var _this = this;
        var _buildTag = _this.buildTag;
        var newDepth = [];
        var i;
        var tag;
        var frame = obj.frame;
        var stage = _this.stage;

        if (!(frame in originTags)) {
            originTags[frame] = [];
        }
        mc.setTotalFrames(_max(mc.getTotalFrames(), frame));

        // add ActionScript
        var actions = obj.actionScript;
        if (actions.length) {
            for (i in actions) {
                if (!actions.hasOwnProperty(i)) {
                    continue;
                }
                mc.setActions(frame, actions[i]);
            }
        }

        // add label
        var labels = obj.labels;
        if (labels.length) {
            for (i in labels) {
                if (!labels.hasOwnProperty(i)) {
                    continue;
                }
                var label = labels[i];
                mc.addLabel(label.frame, label.name);
            }
        }

        // add sounds
        var sounds = obj.sounds;
        if (sounds.length) {
            for (i in sounds) {
                if (!sounds.hasOwnProperty(i)) {
                    continue;
                }
                mc.addSound(frame, sounds[i]);
            }
        }

        var cTags = obj.cTags;
        if (cTags.length) {
            for (i in cTags) {
                if (!cTags.hasOwnProperty(i)) {
                    continue;
                }
                tag = cTags[i];
                newDepth[tag.Depth] = true;
                _buildTag.call(_this, frame, tag, mc, originTags);
            }
        }

        // remove tag
        var tags = obj.removeTags;
        if (tags.length) {
            mc.setRemoveTag(frame, tags);
            for (i in tags) {
                if (!tags.hasOwnProperty(i)) {
                    continue;
                }
                var rTag = tags[i];
                newDepth[rTag.Depth] = true;
            }
        }

        // copy
        if (frame > 1) {
            var prevFrame = frame - 1;
            var container = mc.container;
            if (prevFrame in container) {
                var prevTags = container[prevFrame];
                if (!(frame in container)) {
                    container[frame] = [];
                }

                var length = prevTags.length;
                if (length) {
                    var parentId = mc.instanceId;
                    for (var d in prevTags) {
                        if (!prevTags.hasOwnProperty(d)) {
                            continue;
                        }
                        if (d in newDepth) {
                            continue;
                        }
                        container[frame][d] = prevTags[d];
                        stage.copyPlaceObject(parentId, d, frame);
                        originTags[frame][d] = originTags[prevFrame][d];
                    }
                }
            }
        }
    };

    /**
     * @param frame
     * @param tag
     * @param parent
     * @param originTags
     */
    SwfTag.prototype.buildTag = function (frame, tag, parent, originTags)
    {
        var _this = this;
        var container = parent.container;
        if (!(frame in container)) {
            container[frame] = [];
        }

        var isCopy = true;
        if (tag.PlaceFlagMove) {
            var oTag = originTags[frame - 1][tag.Depth];
            if (oTag !== undefined) {
                if (tag.PlaceFlagHasCharacter) {
                    if (tag.CharacterId !== oTag.CharacterId) {
                        isCopy = false;
                    }
                } else {
                    tag.PlaceFlagHasCharacter = oTag.PlaceFlagHasCharacter;
                    tag.CharacterId = oTag.CharacterId;
                }

                if (!tag.PlaceFlagHasMatrix && oTag.PlaceFlagHasMatrix) {
                    tag.PlaceFlagHasMatrix = oTag.PlaceFlagHasMatrix;
                    tag.Matrix = oTag.Matrix;
                }

                if (!tag.PlaceFlagHasColorTransform && oTag.PlaceFlagHasColorTransform) {
                    tag.PlaceFlagHasColorTransform = oTag.PlaceFlagHasColorTransform;
                    tag.ColorTransform = oTag.ColorTransform;
                }

                if (!tag.PlaceFlagHasClipDepth && oTag.PlaceFlagHasClipDepth) {
                    tag.PlaceFlagHasClipDepth = oTag.PlaceFlagHasClipDepth;
                    tag.ClipDepth = oTag.ClipDepth;
                }

                if (!tag.PlaceFlagHasClipActions && oTag.PlaceFlagHasClipActions) {
                    tag.PlaceFlagHasClipActions = oTag.PlaceFlagHasClipActions;
                    tag.ClipActionRecords = oTag.ClipActionRecords;
                }

                if (!tag.PlaceFlagHasRatio && !isCopy) {
                    tag.PlaceFlagHasRatio = 1;
                    tag.Ratio = frame - 1;
                }

                if (!tag.PlaceFlagHasFilterList && oTag.PlaceFlagHasFilterList) {
                    tag.PlaceFlagHasFilterList = oTag.PlaceFlagHasFilterList;
                    tag.SurfaceFilterList = oTag.SurfaceFilterList;
                }

                if (!tag.PlaceFlagHasBlendMode && oTag.PlaceFlagHasBlendMode) {
                    tag.PlaceFlagHasBlendMode = oTag.PlaceFlagHasBlendMode;
                    tag.BlendMode = oTag.BlendMode;
                }
            }
        }

        originTags[frame][tag.Depth] = tag;
        var buildObject = _this.buildObject(tag, parent, isCopy, frame);
        if (buildObject) {
            var stage = _this.stage;
            var placeObject = _this.buildPlaceObject(tag);
            stage.setPlaceObject(placeObject, parent.instanceId, tag.Depth, frame);
            container[frame][tag.Depth] = buildObject.instanceId;
        }
    };

    /**
     * @param tag
     * @param parent
     * @param isCopy
     * @param frame
     * @returns {*}
     */
    SwfTag.prototype.buildObject = function (tag, parent, isCopy, frame)
    {
        var _this = this;
        var stage = _this.stage;
        var char = stage.getCharacter(tag.CharacterId);
        var tagType = char.tagType;
        var isMorphShape = false;
        if (tagType === 46 || tagType === 84) {
            isMorphShape = true;
        }

        var obj = {};
        if (!isMorphShape && tag.PlaceFlagMove && isCopy) {
            var id = parent.container[frame - 1][tag.Depth];
            obj = stage.getInstance(id);
        } else {
            if (char instanceof Array) {
                obj = _this.buildMovieClip(tag, char, parent);
            } else {
                switch (tagType) {
                    case 11: // DefineText
                    case 33: // DefineText2
                        obj = _this.buildText(tag, char);
                        break;
                    case 37: // DefineEditText
                        obj = _this.buildTextField(tag, char, parent);
                        break;
                    case 2:  // DefineShape
                    case 22: // DefineShape2
                    case 32: // DefineShape3
                    case 83: // DefineShape4
                        obj = _this.buildShape(tag, char);
                        break;
                    case 46: // MorphShape
                    case 84: // MorphShape2
                        var MorphShape = _this.buildMorphShape(char, tag.Ratio);
                        MorphShape.tagType = tagType;
                        obj = _this.buildShape(tag, MorphShape);
                        break;
                    case 7: // DefineButton
                    case 34: // DefineButton2
                        obj = _this.buildButton(char, tag, parent);
                        break;
                    default:
                        return 0;
                }
            }
            obj.setParent(parent);
            obj.setStage(stage);
            obj.setCharacterId(tag.CharacterId);
            obj.setRatio(tag.Ratio || 0);
            obj.setLevel(tag.Depth);
        }

        if (tag.PlaceFlagHasClipDepth) {
            obj.isClipDepth = true;
            obj.clipDepth = tag.ClipDepth;
        }

        return obj;
    };

    /**
     * @param tag
     * @returns {PlaceObject}
     */
    SwfTag.prototype.buildPlaceObject = function (tag)
    {
        var placeObject = new PlaceObject();
        // Matrix
        if (tag.PlaceFlagHasMatrix) {
            placeObject.setMatrix(tag.Matrix);
        }
        // ColorTransform
        if (tag.PlaceFlagHasColorTransform) {
            placeObject.setColorTransform(tag.ColorTransform);
        }
        // Filter
        if (tag.PlaceFlagHasFilterList) {
            placeObject.setFilters(tag.SurfaceFilterList);
        }
        // BlendMode
        if (tag.PlaceFlagHasBlendMode) {
            placeObject.setBlendMode(tag.BlendMode);
        }
        return placeObject;
    };


    /**
     * @param tag
     * @param character
     * @param parent
     * @returns {MovieClip}
     */
    SwfTag.prototype.buildMovieClip = function (tag, character, parent)
    {
        var _this = this;
        var stage = _this.stage;
        var mc = new MovieClip();
        mc.setStage(stage);
        mc._url = parent._url;
        var target = "instance" + mc.instanceId;
        if (tag.PlaceFlagHasName) {
            mc.setName(tag.Name);
            target = tag.Name;
        }
        mc.setTarget(parent.getTarget() + "/" + target);
        _this.build(character, mc);

        if (tag.PlaceFlagHasClipActions) {
            var ClipActionRecords = tag.ClipActionRecords;
            var length = ClipActionRecords.length;
            var eventName;
            for (var i = 0; i < length; i++) {
                var actionRecord = ClipActionRecords[i];
                var eventFlag = actionRecord.EventFlags;
                for (eventName in eventFlag) {
                    if (!eventFlag.hasOwnProperty(eventName)) {
                        continue;
                    }
                    if (!eventFlag[eventName]) {
                        continue;
                    }
                    var action = mc.createActionScript(actionRecord.Actions);
                    mc.addEventListener(eventName, action);
                }
            }
        }

        return mc;
    };

    /**
     * @param tag
     * @param character
     * @param parent
     * @returns {TextField}
     */
    SwfTag.prototype.buildTextField = function (tag, character, parent)
    {
        var _this = this;
        var stage = _this.stage;

        var textField = new TextField();
        textField.setStage(stage);
        textField.setParent(parent);
        textField.setInitParams();
        textField.setTagType(character.tagType);
        textField.setBounds(character.bounds);
        var target = "instance" + textField.instanceId;
        if (tag.PlaceFlagHasName) {
            textField.setName(tag.Name);
            target = tag.Name;
        }
        textField.setTarget(parent.getTarget() + "/" + target);

        var data = character.data;
        var obj = {};
        var fontData = null;
        var fontId = data.FontID;
        if (data.HasFont) {
            fontData = stage.getCharacter(fontId);
        }

        textField.fontId = fontId;
        textField.fontScale = data.FontHeight / 1024;
        if (fontData && fontData.ZoneTable) {
            textField.fontScale /= 20;
        }
        textField.initialText = data.InitialText;
        obj.autoSize = data.AutoSize;
        obj.border = data.Border;
        if (obj.border) {
            obj.background = 1;
        }
        obj.bottomScroll = 1;
        obj.condenseWhite = 0;
        obj.embedFonts = (data.HasFont && data.UseOutlines && fontData.FontFlagsHasLayout && !data.Password) ? 1 : 0;
        obj.hscroll = 0;
        obj.maxscroll = 0;
        obj.scroll = 0;
        obj.maxhscroll = 0;
        obj.html = data.HTML;
        obj.htmlText = (data.HTML) ? data.InitialText : null;
        obj.length = 0;
        obj.maxChars = 0;
        obj.multiline = data.Multiline;
        obj.password = data.Password;
        obj.selectable = data.NoSelect;
        obj.tabEnabled = 0;
        obj.tabIndex = 0;
        obj.text = data.InitialText;
        obj.textColor = data.TextColor;
        obj.textHeight = 0;
        obj.textWidth = 0;
        obj.type = data.ReadOnly ? "dynamic" : "input";

        var variable = data.VariableName;
        obj.variable = variable;
        if (variable) {
            parent.setVariable(variable, data.InitialText);
        }

        obj.wordWrap = data.WordWrap;

        // TextFormat
        obj.blockIndent = 0;
        obj.bullet = 0;

        if (fontData) {
            obj.bold = fontData.FontFlagsBold;
            var font = textField.getVariable("font");
            obj.font = "'" + fontData.FontName + "', " + font;
            obj.italic = fontData.FontFlagsItalic;
        }

        if (data.HasLayout) {
            switch (data.Align) {
                case 1:
                    obj.align = "right";
                    break;
                case 2:
                    obj.align = "center";
                    break;
                case 3:
                    obj.align = "justify";
                    break;
            }
            obj.leftMargin = data.LeftMargin;
            obj.rightMargin = data.RightMargin;
            obj.indent = data.Indent;
            obj.leading = (14400 > data.Leading) ? data.Leading : data.Leading - 65535;
        }

        obj.size = data.FontHeight / 20;
        obj.tabStops = [];
        obj.target = null;
        obj.underline = 0;
        obj.url = null;

        for (var name in obj) {
            if (!obj.hasOwnProperty(name)) {
                continue;
            }
            textField.setProperty(name, obj[name]);
        }

        if (obj.type === "input") {
            textField.setInputElement();
        }

        return textField;
    };

    /**
     * @param tag
     * @param character
     * @returns {StaticText}
     */
    SwfTag.prototype.buildText = function (tag, character)
    {
        var _this = this;
        var stage = _this.stage;
        var staticText = new StaticText();
        staticText.setTagType(character.tagType);
        staticText.setBounds(character.bounds);

        var records = character.textRecords;
        var length = records.length;
        var offsetX = 0;
        var offsetY = 0;
        var scale = 1;
        var textHeight = 0;
        var ShapeTable = null;
        var cMatrix = character.matrix;
        var color = null;
        var isZoneTable = false;
        for (var i = 0; i < length; i++) {
            var record = records[i];
            if ("FontId" in record) {
                var fontId = record.FontId;
                var fontData = stage.getCharacter(fontId);
                ShapeTable = fontData.GlyphShapeTable;
                isZoneTable = false;
                if ("ZoneTable" in fontData) {
                    isZoneTable = true;
                }
            }
            if ("XOffset" in record) {
                offsetX = record.XOffset;
            }
            if ("YOffset" in record) {
                offsetY = record.YOffset;
            }
            if ("TextColor" in record) {
                color = record.TextColor;
            }
            if ("TextHeight" in record) {
                textHeight = record.TextHeight;
                if (isZoneTable) {
                    textHeight /= 20;
                }
            }

            var entries = record.GlyphEntries;
            var count = record.GlyphCount;
            scale = textHeight / 1024;
            for (var idx = 0; idx < count; idx++) {
                var entry = entries[idx];
                var shapes = ShapeTable[entry.GlyphIndex];
                var data = vtc.convert(shapes);
                var matrix = [scale, cMatrix[1], cMatrix[2], scale, cMatrix[4] + offsetX, cMatrix[5] + offsetY];
                var textRecode = new TextRecord();
                textRecode.setData(data);
                textRecode.setColor(color);
                textRecode.setMatrix(matrix);
                staticText.addRecord(textRecode);
                offsetX += entry.GlyphAdvance;
            }
        }

        return staticText;
    };

    /**
     * @param tag
     * @param character
     * @returns {Shape}
     */
    SwfTag.prototype.buildShape = function (tag, character)
    {
        var shape = new Shape();
        shape.setTagType(character.tagType);
        shape.setBounds(character.bounds);
        shape.setData(character.data);
        return shape;
    };

    /**
     * @param character
     * @param tag
     * @param parent
     * @returns {SimpleButton}
     */
    SwfTag.prototype.buildButton = function (character, tag, parent)
    {
        var _this = this;
        var stage = _this.stage;
        var characters = character.characters;
        var button = new SimpleButton();
        button.setStage(stage);
        button.setParent(parent);
        button.setLevel(tag.Depth);

        if ("actions" in character) {
            button.setActions(character.actions);
        }

        var target = "instance" + button.instanceId;
        if (tag.PlaceFlagHasName) {
            button.setName(tag.Name);
            target = tag.Name;
        }
        button.setTarget(parent.getTarget() + "/" + target);

        var downState = button.getSprite("down");
        if (character.ButtonStateDownSoundId) {
            downState.soundId = character.ButtonStateDownSoundId;
            downState.soundInfo = character.ButtonStateDownSoundInfo;
        }

        var hitState = button.getSprite("hit");
        if (character.ButtonStateHitTestSoundId) {
            hitState.soundId = character.ButtonStateHitTestSoundId;
            hitState.soundInfo = character.ButtonStateHitTestSoundInfo;
        }

        var overState = button.getSprite("over");
        if (character.ButtonStateOverSoundId) {
            overState.soundId = character.ButtonStateOverSoundId;
            overState.soundInfo = character.ButtonStateOverSoundInfo;
        }

        var upState = button.getSprite("up");
        if (character.ButtonStateUpSoundId) {
            upState.soundId = character.ButtonStateUpSoundId;
            upState.soundInfo = character.ButtonStateUpSoundInfo;
        }

        for (var depth in characters) {
            if (!characters.hasOwnProperty(depth)) {
                continue;
            }

            var tags = characters[depth];
            for (var idx in tags) {
                if (!tags.hasOwnProperty(idx)) {
                    continue;
                }

                var bTag = tags[idx];
                var obj = _this.buildObject(bTag, button, false, 1);
                var placeObject = _this.buildPlaceObject(bTag);
                var Depth = bTag.Depth;
                if (bTag.ButtonStateDown) {
                    downState.addTag(Depth, obj);
                    stage.setPlaceObject(placeObject, downState.instanceId, Depth, 0);
                }
                if (bTag.ButtonStateHitTest) {
                    hitState.addTag(Depth, obj);
                    stage.setPlaceObject(placeObject, hitState.instanceId, Depth, 0);
                }
                if (bTag.ButtonStateOver) {
                    overState.addTag(Depth, obj);
                    stage.setPlaceObject(placeObject, overState.instanceId, Depth, 0);
                }
                if (bTag.ButtonStateUp) {
                    upState.addTag(Depth, obj);
                    stage.setPlaceObject(placeObject, upState.instanceId, Depth, 0);
                }
            }
        }

        button.setSprite("down", downState);
        button.setSprite("hit", hitState);
        button.setSprite("over", overState);
        button.setSprite("up", upState);
        button.setTagType(character.tagType);
        return button;
    };

    /**
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
        };
    };

    /**
     * @param dataLength
     * @param characterId
     * @returns {Array}
     */
    SwfTag.prototype.parseTags = function (dataLength, characterId)
    {
        var _this = this;
        var _parseTag = _this.parseTag;
        var _addTag = _this.addTag;
        var _generateDefaultTagObj = _this.generateDefaultTagObj;
        var frame = 1;
        var tags = [];
        var tagType = 0;
        var bitio = _this.bitio;

        // default set
        tags[frame] = _generateDefaultTagObj.call(_this, frame, characterId);

        while (bitio.byte_offset < dataLength) {
            var tagStartOffset = bitio.byte_offset;
            if (tagStartOffset + 2 > dataLength) {
                break;
            }

            var tagLength = bitio.getUI16();
            tagType = tagLength >> 6;

            // long
            var length = tagLength & 0x3f;
            if (length === 0x3f) {
                if (tagStartOffset + 6 > dataLength) {
                    bitio.byte_offset = tagStartOffset;
                    bitio.bit_offset = 0;
                    break;
                }
                length = bitio.getUI32();
            }

            var tagDataStartOffset = bitio.byte_offset;
            if (tagType === 1) {
                frame++;
                if (dataLength > tagDataStartOffset + 2) {
                    tags[frame] = _generateDefaultTagObj.call(_this, frame, characterId);
                }
            }

            var tag = _parseTag.call(_this, tagType, length);

            var o = bitio.byte_offset - tagDataStartOffset;
            if (o !== length) {
                if (o < length) {
                    var eat = (length - o);
                    if (eat > 0) {
                        bitio.byte_offset += eat;
                    }
                }
            }

            if (tag) {
                tags = _addTag.call(_this, tagType, tags, tag, frame);
            }

            bitio.bit_offset = 0;
        }

        return tags;
    };

    /**
     * @param tagType
     * @param length
     * @returns {*}
     */
    SwfTag.prototype.parseTag = function (tagType, length)
    {
        var _this = this;
        var obj = null;
        var bitio = _this.bitio;
        var stage = _this.stage;

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
                    bitio.byte_offset += length;
                } else {
                    _this.parseDefineShape(tagType);
                }
                break;
            case 9: // BackgroundColor
                if (stage.bgcolor) {
                    stage.backgroundColor = stage.bgcolor;
                } else {
                    stage.setBackgroundColor(
                        bitio.getUI8(),
                        bitio.getUI8(),
                        bitio.getUI8()
                    );
                }
                break;
            case 10: // DefineFont
            case 48: // DefineFont2
            case 75: // DefineFont3
                _this.parseDefineFont(tagType, length);
                break;
            case 13: // DefineFontInfo
            case 62: // DefineFontInfo2
                _this.parseDefineFontInfo(tagType, length);
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
                obj = _this.parseRemoveObject(tagType);
                break;
            case 7: // DefineButton
            case 34: // DefineButton2
                obj = _this.parseDefineButton(tagType, length);
                break;
            case 43: // FrameLabel
                obj = _this.parseFrameLabel();
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
                _this.parseDefineBits(tagType, length, _this.jpegTables);
                _this.jpegTables = null;
                break;
            case 8: // JPEGTables
                _this.jpegTables = _this.parseJPEGTables(length);
                break;
            case 56: // ExportAssets
                _this.parseExportAssets();
                break;
            case 46: // DefineMorphShape
            case 84: // DefineMorphShape2
                _this.parseDefineMorphShape(tagType);
                break;
            case 40: // NameCharacter
                bitio.getDataUntil("\0"); // NameCharacter
                break;
            case 24: // Protect
                bitio.byteAlign();
                break;
            case 63: // DebugID
                bitio.getUI8(); // UUID
                break;
            case 64: // EnableDebugger2
                bitio.getUI16(); // Reserved
                bitio.getDataUntil("\0"); // Password
                break;
            case 65: // ScriptLimits
                bitio.getUI16(); // MaxRecursionDepth
                bitio.getUI16(); // ScriptTimeoutSeconds
                break;
            case 69: // FileAttributes
                _this.parseFileAttributes();
                break;
            case 77: // MetaData
                bitio.getDataUntil("\0"); // MetaData
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
                _this.parseDoABC(tagType, length);
                break;
            case 76: // SymbolClass
                _this.parseSymbolClass();
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
                _this.parseDefineFontAlignZones();
                break;
            case 74: // CSMTextSettings
                _this.parseCSMTextSettings(tagType);
                break;
            case 19: // SoundStreamBlock
                _this.parseSoundStreamBlock(tagType, length);
                break;
            case 60: // DefineVideoStream
                _this.parseDefineVideoStream(tagType);
                break;
            case 61: // VideoFrame
                _this.parseVideoFrame(tagType, length);
                break;
            case 78: // DefineScalingGrid
                _this.parseDefineScalingGrid();
                break;
            case 41: // ProductInfo
                bitio.getUI32(); // ProductID
                bitio.getUI32(); // Edition
                bitio.getUI8(); // MajorVersion
                bitio.getUI8(); // MinorVersion
                bitio.getUI32(); // BuildLow
                bitio.getUI32(); // BuildHigh
                bitio.getUI32(); // CompilationDate
                bitio.getUI32(); // TODO
                break;
            case 3:  // FreeCharacter
            case 16: // StopSound
            case 23: // DefineButtonCxform
            case 25: // PathsArePostScript
            case 29: // SyncFrame
            case 31: // FreeAll
            case 38: // DefineVideo
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
            case 66: // SetTabIndex
            case 71: // ImportAssets2
            case 87: // DefineBinaryData
            case 91: // DefineFont4
            case 93: // EnableTelemetry
                console.log("[base] tagType -> " + tagType);
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
     * @param tagType
     * @param tags
     * @param tag
     * @param frame
     * @returns {*}
     */
    SwfTag.prototype.addTag = function (tagType, tags, tag, frame)
    {
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
     * @param tagType
     */
    SwfTag.prototype.parseDefineShape = function (tagType)
    {
        var _this = this;
        var bitio = _this.bitio;
        var characterId = bitio.getUI16();
        var bounds = _this.rect();

        if (tagType === 83) {
            var obj = {};
            obj.EdgeBounds = _this.rect();
            bitio.getUIBits(5); // Reserved
            obj.UsesFillWindingRule = bitio.getUIBits(1);
            obj.UsesNonScalingStrokes = bitio.getUIBits(1);
            obj.UsesScalingStrokes = bitio.getUIBits(1);
        }

        var shapes = _this.shapeWithStyle(tagType);
        _this.appendShapeTag(characterId, bounds, shapes, tagType);
    };

    /**
     * @returns {{xMin: number, xMax: number, yMin: number, yMax: number}}
     */
    SwfTag.prototype.rect = function ()
    {
        var bitio = this.bitio;
        bitio.byteAlign();

        var nBits = bitio.getUIBits(5);
        return {
            xMin: bitio.getSIBits(nBits),
            xMax: bitio.getSIBits(nBits),
            yMin: bitio.getSIBits(nBits),
            yMax: bitio.getSIBits(nBits)
        };
    };

    /**
     * @param tagType
     * @returns {{}}
     */
    SwfTag.prototype.shapeWithStyle = function (tagType)
    {
        var _this = this;
        var bitio = _this.bitio;
        var fillStyles;
        var lineStyles;

        if (tagType === 46 || tagType === 84) {
            fillStyles = {fillStyleCount: 0, fillStyles: []};
            lineStyles = {lineStyleCount: 0, lineStyles: []};
        } else {
            fillStyles = _this.fillStyleArray(tagType);
            lineStyles = _this.lineStyleArray(tagType);
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
            ShapeRecords: ShapeRecords
        };
    };

    /**
     * @param tagType
     * @returns {{}}
     */
    SwfTag.prototype.fillStyleArray = function (tagType)
    {
        var _this = this;
        var bitio = _this.bitio;
        var fillStyleCount = bitio.getUI8();
        if ((tagType > 2) && (fillStyleCount === 0xff)) {
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
     * @param tagType
     * @returns {{}}
     */
    SwfTag.prototype.fillStyle = function (tagType)
    {
        var _this = this;
        var bitio = _this.bitio;
        var obj = {};
        var bitType = bitio.getUI8();
        obj.fillStyleType = bitType;
        switch (bitType) {
            case 0x00:
                if (tagType === 32 || tagType === 83) {
                    obj.Color = _this.rgba();
                } else if (tagType === 46 || tagType === 84) {
                    obj.StartColor = _this.rgba();
                    obj.EndColor = _this.rgba();
                } else {
                    obj.Color = _this.rgb();
                }
                break;
            case 0x10:
            case 0x12:
                if (tagType === 46 || tagType === 84) {
                    obj.startGradientMatrix = _this.matrix();
                    obj.endGradientMatrix = _this.matrix();
                    obj.gradient = _this.gradient(tagType);
                } else {
                    obj.gradientMatrix = _this.matrix();
                    obj.gradient = _this.gradient(tagType);
                }
                break;
            case 0x13:
                obj.gradientMatrix = _this.matrix();
                obj.gradient = _this.focalGradient(tagType);
                break;
            case 0x40:
            case 0x41:
            case 0x42:
            case 0x43:
                obj.bitmapId = bitio.getUI16();
                if (tagType === 46 || tagType === 84) {
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
     * @returns {{}}
     */
    SwfTag.prototype.rgb = function ()
    {
        var bitio = this.bitio;
        return {
            R: bitio.getUI8(),
            G: bitio.getUI8(),
            B: bitio.getUI8(),
            A: 1
        };
    };

    /**
     * @returns {{}}
     */
    SwfTag.prototype.rgba = function ()
    {
        var bitio = this.bitio;
        return {
            R: bitio.getUI8(),
            G: bitio.getUI8(),
            B: bitio.getUI8(),
            A: bitio.getUI8() / 255
        };
    };

    /**
     * @returns {Array}
     */
    SwfTag.prototype.matrix = function ()
    {
        var bitio = this.bitio;
        bitio.byteAlign();

        var result = [1, 0, 0, 1, 0, 0];
        if (bitio.getUIBit()) {
            var nScaleBits = bitio.getUIBits(5);
            result[0] = bitio.getSIBits(nScaleBits) / 0x10000;
            result[3] = bitio.getSIBits(nScaleBits) / 0x10000;
        }

        if (bitio.getUIBit()) {
            var nRotateBits = bitio.getUIBits(5);
            result[1] = bitio.getSIBits(nRotateBits) / 0x10000;
            result[2] = bitio.getSIBits(nRotateBits) / 0x10000;
        }

        var nTranslateBits = bitio.getUIBits(5);
        result[4] = bitio.getSIBits(nTranslateBits);
        result[5] = bitio.getSIBits(nTranslateBits);

        return result;
    };

    /**
     * gradient
     * @param tagType
     * @returns {{SpreadMode: number, InterpolationMode: number, GradientRecords: Array}}
     */
    SwfTag.prototype.gradient = function (tagType)
    {
        var _this = this;
        var SpreadMode = 0;
        var InterpolationMode = 0;
        var NumGradients;
        var bitio = this.bitio;

        bitio.byteAlign();

        if (tagType === 46 || tagType === 84) {
            NumGradients = bitio.getUI8();
        } else {
            SpreadMode = bitio.getUIBits(2);
            InterpolationMode = bitio.getUIBits(2);
            NumGradients = bitio.getUIBits(4);
        }

        var GradientRecords = [];
        for (var i = NumGradients; i--;) {
            GradientRecords[GradientRecords.length] = _this.gradientRecord(tagType);
        }

        return {
            SpreadMode: SpreadMode,
            InterpolationMode: InterpolationMode,
            GradientRecords: GradientRecords
        };
    };

    /**
     * @param tagType
     * @returns {{}}
     */
    SwfTag.prototype.gradientRecord = function (tagType)
    {
        var _this = this;
        var bitio = _this.bitio;
        if (tagType === 46 || tagType === 84) {
            return {
                StartRatio: bitio.getUI8() / 255,
                StartColor: _this.rgba(),
                EndRatio: bitio.getUI8() / 255,
                EndColor: _this.rgba()
            };
        } else {
            var Ratio = bitio.getUI8();
            var Color = (tagType < 32) ? _this.rgb() : _this.rgba();
            return {Ratio: Ratio / 255, Color: Color};
        }
    };

    /**
     * @param tagType
     * @returns {{SpreadMode: number, InterpolationMode: number, GradientRecords: Array, FocalPoint: number}}
     */
    SwfTag.prototype.focalGradient = function (tagType)
    {
        var bitio = this.bitio;
        bitio.byteAlign();
        var _this = this;
        var SpreadMode = bitio.getUIBits(2);
        var InterpolationMode = bitio.getUIBits(2);
        var numGradients = bitio.getUIBits(4);

        var gradientRecords = [];
        for (var i = numGradients; i--;) {
            gradientRecords[gradientRecords.length] =
                _this.gradientRecord(tagType);
        }
        var FocalPoint = bitio.getFloat16();

        return {
            SpreadMode: SpreadMode,
            InterpolationMode: InterpolationMode,
            GradientRecords: gradientRecords,
            FocalPoint: FocalPoint
        };
    };

    /**
     * @param tagType
     * @returns {{lineStyleCount: number, lineStyles: Array}}
     */
    SwfTag.prototype.lineStyleArray = function (tagType)
    {
        var _this = this;
        var bitio = _this.bitio;
        var lineStyleCount = bitio.getUI8();
        if ((tagType > 2) && (lineStyleCount === 0xff)) {
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
     * @param tagType
     * @returns {{}}
     */
    SwfTag.prototype.lineStyles = function (tagType)
    {
        var _this = this;
        var bitio = _this.bitio;
        var obj = {};

        obj.fillStyleType = 0;
        if (tagType === 46) {
            obj = {
                StartWidth: bitio.getUI16(),
                EndWidth: bitio.getUI16(),
                StartColor: _this.rgba(),
                EndColor: _this.rgba()
            };
        } else if (tagType === 84) {
            obj.StartWidth = bitio.getUI16();
            obj.EndWidth = bitio.getUI16();

            obj.StartCapStyle = bitio.getUIBits(2);
            obj.JoinStyle = bitio.getUIBits(2);
            obj.HasFillFlag = bitio.getUIBit();
            obj.NoHScaleFlag = bitio.getUIBit();
            obj.NoVScaleFlag = bitio.getUIBit();
            obj.PixelHintingFlag = bitio.getUIBit();
            bitio.getUIBits(5); // Reserved
            obj.NoClose = bitio.getUIBit();
            obj.EndCapStyle = bitio.getUIBits(2);

            if (obj.JoinStyle === 2) {
                obj.MiterLimitFactor = bitio.getUI16();
            }

            if (obj.HasFillFlag) {
                obj.FillType = _this.fillStyle(tagType);
            } else {
                obj.StartColor = _this.rgba();
                obj.EndColor = _this.rgba();
            }
        } else {
            obj.Width = bitio.getUI16();
            if (tagType === 83) {
                // DefineShape4
                obj.StartCapStyle = bitio.getUIBits(2);
                obj.JoinStyle = bitio.getUIBits(2);
                obj.HasFillFlag = bitio.getUIBit();
                obj.NoHScaleFlag = bitio.getUIBit();
                obj.NoVScaleFlag = bitio.getUIBit();
                obj.PixelHintingFlag = bitio.getUIBit();
                bitio.getUIBits(5); // Reserved
                obj.NoClose = bitio.getUIBit();
                obj.EndCapStyle = bitio.getUIBits(2);

                if (obj.JoinStyle === 2) {
                    obj.MiterLimitFactor = bitio.getUI16();
                }

                if (obj.HasFillFlag) {
                    obj.FillType = _this.fillStyle(tagType);
                } else {
                    obj.Color = _this.rgba();
                }
            } else if (tagType === 32) {
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
     * @param tagType
     * @param currentNumBits
     * @returns {Array}
     */
    SwfTag.prototype.shapeRecords = function (tagType, currentNumBits)
    {
        var _this = this;
        var bitio = _this.bitio;
        var shapeRecords = [];
        _this.currentPosition = {x: 0, y: 0};
        var _straightEdgeRecord = _this.straightEdgeRecord;
        var _curvedEdgeRecord = _this.curvedEdgeRecord;
        var _styleChangeRecord = _this.styleChangeRecord;

        while (true) {
            var first6Bits = bitio.getUIBits(6);
            var shape = 0;
            if (first6Bits & 0x20) {
                var numBits = first6Bits & 0x0f;
                if (first6Bits & 0x10) {
                    shape = _straightEdgeRecord.call(_this, tagType, numBits);
                } else {
                    shape = _curvedEdgeRecord.call(_this, tagType, numBits);
                }
            } else if (first6Bits) {
                shape =
                    _styleChangeRecord.call(_this, tagType, first6Bits, currentNumBits);
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
     * @param tagType
     * @param numBits
     * @returns {{}}
     */
    SwfTag.prototype.straightEdgeRecord = function (tagType, numBits)
    {
        var _this = this;
        var bitio = _this.bitio;
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
        if (tagType !== 46 && tagType !== 84) {
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
     * @param tagType
     * @param numBits
     * @returns {{}}
     */
    SwfTag.prototype.curvedEdgeRecord = function (tagType, numBits)
    {
        var _this = this;
        var bitio = _this.bitio;
        var controlDeltaX = bitio.getSIBits(numBits + 2);
        var controlDeltaY = bitio.getSIBits(numBits + 2);
        var anchorDeltaX = bitio.getSIBits(numBits + 2);
        var anchorDeltaY = bitio.getSIBits(numBits + 2);

        var ControlX = controlDeltaX;
        var ControlY = controlDeltaY;
        var AnchorX = anchorDeltaX;
        var AnchorY = anchorDeltaY;
        if (tagType !== 46 && tagType !== 84) {
            ControlX = _this.currentPosition.x + controlDeltaX;
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
     * @param tagType
     * @param changeFlag
     * @param currentNumBits
     * @returns {{}}
     */
    SwfTag.prototype.styleChangeRecord = function (tagType, changeFlag, currentNumBits)
    {
        var _this = this;
        var bitio = _this.bitio;
        var obj = {};
        obj.StateNewStyles = (changeFlag >> 4) & 1;
        obj.StateLineStyle = (changeFlag >> 3) & 1;
        obj.StateFillStyle1 = (changeFlag >> 2) & 1;
        obj.StateFillStyle0 = (changeFlag >> 1) & 1;
        obj.StateMoveTo = changeFlag & 1;

        if (obj.StateMoveTo) {
            var moveBits = bitio.getUIBits(5);
            obj.MoveX = bitio.getSIBits(moveBits);
            obj.MoveY = bitio.getSIBits(moveBits);
            _this.currentPosition.x = obj.MoveX;
            _this.currentPosition.y = obj.MoveY;
        }

        obj.FillStyle0 = 0;
        if (obj.StateFillStyle0) {
            obj.FillStyle0 = bitio.getUIBits(currentNumBits.FillBits);
        }

        obj.FillStyle1 = 0;
        if (obj.StateFillStyle1) {
            obj.FillStyle1 = bitio.getUIBits(currentNumBits.FillBits);
        }

        obj.LineStyle = 0;
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
     * @param characterId
     * @param bounds
     * @param shapes
     * @param tagType
     */
    SwfTag.prototype.appendShapeTag = function (characterId, bounds, shapes, tagType)
    {
        var stage = this.stage;
        stage.setCharacter(characterId, {
            tagType: tagType,
            data: vtc.convert(shapes, false),
            bounds: bounds
        });
    };

    /**
     * @param tagType
     * @param length
     */
    SwfTag.prototype.parseDefineBitsLossLess = function (tagType, length)
    {
        var _this = this;
        var bitio = _this.bitio;
        var stage = _this.stage;
        var startOffset = bitio.byte_offset;
        var CharacterId = bitio.getUI16();
        var format = bitio.getUI8();
        var width = bitio.getUI16();
        var height = bitio.getUI16();

        var isAlpha = (tagType === 36);
        var colorTableSize = 0;
        if (format === 3) {
            colorTableSize = bitio.getUI8() + 1;
        }

        // unCompress
        var sub = bitio.byte_offset - startOffset;
        var compressed = bitio.getData(length - sub);
        var data = bitio.unzip(compressed, false);

        // canvas
        var canvas = cacheStore.getCanvas();
        canvas.width = width;
        canvas.height = height;
        var imageContext = canvas.getContext("2d");
        var imgData = imageContext.createImageData(width, height);
        var pxData = imgData.data;

        var idx = 0;
        var pxIdx = 0;
        var x = width;
        var y = height;
        if (format === 5 && !isAlpha) {
            idx = 0;
            pxIdx = 0;
            for (y = height; y--;) {
                for (x = width; x--;) {
                    idx++;
                    pxData[pxIdx++] = data[idx++];
                    pxData[pxIdx++] = data[idx++];
                    pxData[pxIdx++] = data[idx++];
                    pxData[pxIdx++] = 255;
                }
            }
        } else {
            var bpp = (isAlpha) ? 4 : 3;
            var cmIdx = colorTableSize * bpp;
            var pad = 0;
            if (colorTableSize) {
                pad = ((width + 3) & ~3) - width;
            }

            for (y = height; y--;) {
                for (x = width; x--;) {
                    idx = (colorTableSize) ? data[cmIdx++] * bpp : cmIdx++ * bpp;
                    if (!isAlpha) {
                        pxData[pxIdx++] = data[idx++];
                        pxData[pxIdx++] = data[idx++];
                        pxData[pxIdx++] = data[idx++];
                        idx++;
                        pxData[pxIdx++] = 255;
                    } else {
                        var alpha = (format === 3) ? data[idx + 3] : data[idx++];
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

                        if (format === 3) {
                            idx++;
                        }
                    }
                }
                cmIdx += pad;
            }
        }

        imageContext.putImageData(imgData, 0, 0);
        stage.setCharacter(CharacterId, imageContext);
    };

    /**
     * parseExportAssets
     */
    SwfTag.prototype.parseExportAssets = function ()
    {
        var _this = this;
        var bitio = _this.bitio;
        var stage = _this.stage;
        var count = bitio.getUI16();

        var exportAssets = stage.exportAssets;
        var packages = stage.packages;
        while (count--) {
            var id = bitio.getUI16();
            var name = bitio.getDataUntil("\0");
            if (name.substr(0, 10) === "__Packages") {
                packages[id] = 1;
            }
            exportAssets[name] = id;
        }

        stage.exportAssets = exportAssets;
    };

    /**
     * @param length
     * @returns {string}
     */
    SwfTag.prototype.parseJPEGTables = function (length)
    {
        return this.bitio.getData(length);
    };

    /**
     * @param tagType
     * @param length
     * @param jpegTables
     */
    SwfTag.prototype.parseDefineBits = function (tagType, length, jpegTables)
    {
        var _this = this;
        var bitio = _this.bitio;
        var startOffset = bitio.byte_offset;
        var CharacterId = bitio.getUI16();
        var sub = bitio.byte_offset - startOffset;

        var ImageDataLen = length - sub;
        if (tagType === 35 || tagType === 90) {
            ImageDataLen = bitio.getUI32();
        }

        if (tagType === 90) {
            var DeblockParam = bitio.getUI16();
            console.log("DeblockParam", DeblockParam);
        }

        var JPEGData = bitio.getData(ImageDataLen);
        var BitmapAlphaData = false;
        if (tagType === 35 || tagType === 90) {
            BitmapAlphaData =
                bitio.getData(length - sub - ImageDataLen);
        }
        bitio.byte_offset = startOffset + length;

        // render
        var stage = _this.stage;
        stage.imgUnLoadCount++;
        var image = _document.createElement("img");
        image.addEventListener("load", function()
        {
            var width = this.width;
            var height = this.height;
            var canvas = cacheStore.getCanvas();
            canvas.width = width;
            canvas.height = height;
            var imageContext = canvas.getContext("2d");
            imageContext.drawImage(this, 0, 0, width, height);

            if (BitmapAlphaData) {
                var data = bitio.unzip(BitmapAlphaData, false);
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

            stage.setCharacter(CharacterId, imageContext);
            stage.imgUnLoadCount--;
        });

        if (jpegTables !== null && jpegTables.length > 4) {
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

        image.src = "data:image/jpeg;base64," +
            _this.base64encode(_this.parseJpegData(JPEGData));

        // for android bug
        _setTimeout(function () {}, 0);
    };

    /**
     * @param JPEGData
     * @returns {string}
     */
    SwfTag.prototype.parseJpegData = function (JPEGData)
    {
        var i = 0;
        var idx = 0;
        var str = "";
        var length = JPEGData.length;

        // erroneous
        if (JPEGData[0] === 0xFF && JPEGData[1] === 0xD9 && JPEGData[2] === 0xFF && JPEGData[3] === 0xD8) {
            for (i = 4; i < length; i++) {
                str += _fromCharCode(JPEGData[i]);
            }
        } else if (JPEGData[i++] === 0xFF && JPEGData[i++] === 0xD8) {
            for (idx = 0; idx < i; idx++) {
                str += _fromCharCode(JPEGData[idx]);
            }
            while (i < length) {
                if (JPEGData[i] === 0xFF) {
                    if (JPEGData[i + 1] === 0xD9 && JPEGData[i + 2] === 0xFF && JPEGData[i + 3] === 0xD8) {
                        i += 4;
                        for (idx = i; idx < length; idx++) {
                            str += _fromCharCode(JPEGData[idx]);
                        }
                        break;
                    } else if (JPEGData[i + 1] === 0xDA) {
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
     * @param data
     * @returns {*}
     */
    SwfTag.prototype.base64encode = function (data)
    {
        if (isBtoa) {
            return window.btoa(data);
        }

        var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var out = [];
        var i = 0;
        var len = data.length;

        while (i < len) {
            var c1 = data.charCodeAt(i++) & 0xff;
            if (i === len) {
                out[out.length] = base64EncodeChars.charAt(c1 >> 2);
                out[out.length] = base64EncodeChars.charAt((c1 & 0x3) << 4);
                out[out.length] = "==";
                break;
            }

            var c2 = data.charCodeAt(i++);
            if (i === len) {
                out[out.length] = base64EncodeChars.charAt(c1 >> 2);
                out[out.length] = base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                out[out.length] = base64EncodeChars.charAt((c2 & 0xF) << 2);
                out[out.length] = "=";
                break;
            }

            var c3 = data.charCodeAt(i++);
            out[out.length] = base64EncodeChars.charAt(c1 >> 2);
            out[out.length] = base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out[out.length] = base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
            out[out.length] = base64EncodeChars.charAt(c3 & 0x3F);
        }

        return out.join("");
    };

    /**
     * @param tagType
     * @param length
     */
    SwfTag.prototype.parseDefineFont = function (tagType, length)
    {
        var _this = this;
        var bitio = _this.bitio;
        var stage = _this.stage;
        var endOffset = bitio.byte_offset + length;
        var i = 0;
        var len = 0;
        var obj = {};
        obj.tagType = tagType;
        obj.FontId = bitio.getUI16();

        var numGlyphs = 0;
        if (tagType === 48 || tagType === 75) {
            var fontFlags = bitio.getUI8();
            obj.FontFlagsHasLayout = (fontFlags >>> 7) & 1;
            obj.FontFlagsShiftJIS = (fontFlags >>> 6) & 1;
            obj.FontFlagsSmallText = (fontFlags >>> 5) & 1;
            obj.FontFlagsANSI = (fontFlags >>> 4) & 1;
            obj.FontFlagsWideOffsets = (fontFlags >>> 3) & 1;
            obj.FontFlagsWideCodes = (fontFlags >>> 2) & 1;
            obj.FontFlagsItalic = (fontFlags >>> 1) & 1;
            obj.FontFlagsBold = (fontFlags) & 1;
            bitio.byteAlign();

            obj.LanguageCode = bitio.getUI8();
            obj.FontNameLen = bitio.getUI8();
            if (obj.FontNameLen) {
                var startOffset = bitio.byte_offset;
                var data = bitio.getData(obj.FontNameLen);
                var str = "";
                len = obj.FontNameLen;
                for (i = 0; i < len; i++) {
                    if (data[i] > 127) {
                        continue;
                    }
                    str += _fromCharCode(data[i]);
                }

                var fontName;
                if (obj.FontFlagsShiftJIS || obj.LanguageCode === 2) {
                    fontName = bitio.decodeToShiftJis(str);
                } else {
                    fontName = decodeURIComponent(str);
                }

                obj.FontName = _this.getFontName(fontName);
                bitio.byte_offset = startOffset + obj.FontNameLen;
            }

            numGlyphs = bitio.getUI16();
            obj.NumGlyphs = numGlyphs;
        }

        // offset
        var offset = bitio.byte_offset;
        if (tagType === 10) {
            numGlyphs = bitio.getUI16();
        }

        if (numGlyphs) {
            var OffsetTable = [];
            if (tagType === 10) {
                OffsetTable[0] = numGlyphs;
                numGlyphs /= 2;
                numGlyphs--;
            }

            if (obj.FontFlagsWideOffsets) {
                for (i = numGlyphs; i--;) {
                    OffsetTable[OffsetTable.length] = bitio.getUI32();
                }
                if (tagType !== 10) {
                    obj.CodeTableOffset = bitio.getUI32();
                }
            } else {
                for (i = numGlyphs; i--;) {
                    OffsetTable[OffsetTable.length] = bitio.getUI16();
                }
                if (tagType !== 10) {
                    obj.CodeTableOffset = bitio.getUI16();
                }
            }

            // Shape
            var GlyphShapeTable = [];
            if (tagType === 10) {
                numGlyphs++;
            }

            for (i = 0; i < numGlyphs; i++) {
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
                        Color: {R: 0, G: 0, B: 0, A: 1},
                        lineStyleType: 0
                    }]
                };
                shapes.fillStyles = {
                    fillStyles: [{
                        Color: {R: 0, G: 0, B: 0, A: 1},
                        fillStyleType: 0
                    }]
                };

                GlyphShapeTable[GlyphShapeTable.length] = shapes;
            }
            obj.GlyphShapeTable = GlyphShapeTable;

            if (tagType === 48 || tagType === 75) {
                bitio.setOffset(obj.CodeTableOffset + offset, 0);
                var CodeTable = [];
                if (obj.FontFlagsWideCodes) {
                    for (i = numGlyphs; i--;) {
                        CodeTable[CodeTable.length] = bitio.getUI16();
                    }
                } else {
                    for (i = numGlyphs; i--;) {
                        CodeTable[CodeTable.length] = bitio.getUI8();
                    }
                }
                obj.CodeTable = CodeTable;

                if (obj.FontFlagsHasLayout) {
                    obj.FontAscent = bitio.getUI16();
                    obj.FontDescent = bitio.getUI16();
                    obj.FontLeading = bitio.getUI16();

                    var FontAdvanceTable = [];
                    for (i = numGlyphs; i--;) {
                        FontAdvanceTable[FontAdvanceTable.length] = bitio.getUI16();
                    }
                    obj.FontAdvanceTable = FontAdvanceTable;

                    var FontBoundsTable = [];
                    for (i = numGlyphs; i--;) {
                        FontBoundsTable[FontBoundsTable.length] = _this.rect();
                    }
                    obj.FontBoundsTable = FontBoundsTable;

                    if (tagType === 75) {
                        obj.KerningCount = bitio.getUI16();
                        obj.KerningRecord = [];
                        for (i = obj.KerningCount; i--;) {
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

        bitio.byte_offset = endOffset;
        stage.setCharacter(obj.FontId, obj);
        stage.fonts[obj.FontName] = obj;
    };

    /**
     * @param tagType
     * @param length
     */
    SwfTag.prototype.parseDefineFontInfo = function (tagType, length)
    {
        var _this = this;
        var bitio = _this.bitio;
        var endOffset = bitio.byte_offset + length;

        var obj = {};
        obj.tagType = tagType;
        obj.FontId = bitio.getUI16();
        var len = bitio.getUI8();
        var data = bitio.getData(len);
        var str = "";
        for (var i = 0; i < len; i++) {
            if (data[i] > 127) {
                continue;
            }
            str += _fromCharCode(data[i]);
        }

        obj.FontFlagsReserved = bitio.getUIBits(2);
        obj.FontFlagsSmallText = bitio.getUIBits(1);
        obj.FontFlagsShiftJIS = bitio.getUIBits(1);
        obj.FontFlagsANSI = bitio.getUIBits(1);
        obj.FontFlagsItalic = bitio.getUIBits(1);
        obj.FontFlagsBold = bitio.getUIBits(1);
        obj.FontFlagsWideCodes = bitio.getUIBits(1);
        if (tagType === 62) {
            obj.LanguageCode = bitio.getUI8();
        }

        var fontName;
        if (obj.FontFlagsShiftJIS || obj.LanguageCode === 2) {
            fontName = bitio.decodeToShiftJis(str);
        } else {
            fontName = decodeURIComponent(str);
        }
        obj.FontName = _this.getFontName(fontName);

        var CodeTable = [];
        bitio.byteAlign();
        var tLen = endOffset - bitio.byte_offset;
        if (obj.FontFlagsWideCodes || tagType === 62) {
            while (tLen) {
                CodeTable[CodeTable.length] = bitio.getUI16();
                tLen -= 2;
            }
        } else {
            while (tLen) {
                CodeTable[CodeTable.length] = bitio.getUI8();
                tLen--;
            }
        }
        obj.CodeTable = CodeTable;
    };

    /**
     * @param fontName
     * @returns {string}
     */
    SwfTag.prototype.getFontName = function (fontName)
    {
        var length = fontName.length;
        var str = fontName.substr(length - 1);
        if (str.charCodeAt(0) === 0) {
            fontName = fontName.slice(0, -1);
        }

        switch (fontName) {
            case "_sans":
                return "sans-serif";
            case "_serif":
                return "serif";
            case "_typewriter":
                return "monospace";
            default:
                var ander = fontName.substr(0, 1);
                if (ander === "_") {
                    return "sans-serif";
                }
                return fontName;
        }
    };

    /**
     * parseDefineFontName
     */
    SwfTag.prototype.parseDefineFontName = function ()
    {
        var bitio = this.bitio;
        bitio.getUI16(); // FontId
        bitio.getDataUntil("\0"); // FontName
        bitio.getDataUntil("\0"); // FontCopyright
    };

    /**
     * @param tagType
     */
    SwfTag.prototype.parseDefineText = function (tagType)
    {
        var _this = this;
        var bitio = _this.bitio;
        var stage = _this.stage;
        var obj = {};
        var characterId = bitio.getUI16();
        obj.tagType = tagType;
        obj.bounds = _this.rect();
        obj.matrix = _this.matrix();
        var GlyphBits = bitio.getUI8();
        var AdvanceBits = bitio.getUI8();
        obj.textRecords = _this.getTextRecords(tagType, GlyphBits, AdvanceBits);
        stage.setCharacter(characterId, obj);
    };

    /**
     * @param tagType
     * @param GlyphBits
     * @param AdvanceBits
     * @returns {Array}
     */
    SwfTag.prototype.getTextRecords = function (tagType, GlyphBits, AdvanceBits)
    {
        var _this = this;
        var bitio = _this.bitio;
        var array = [];
        while (bitio.getUI8() !== 0) {
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
                if (tagType === 11) {
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
     * @param count
     * @param GlyphBits
     * @param AdvanceBits
     * @returns {Array}
     */
    SwfTag.prototype.getGlyphEntries = function (count, GlyphBits, AdvanceBits)
    {
        var bitio = this.bitio;
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
     * @param tagType
     */
    SwfTag.prototype.parseDefineEditText = function (tagType)
    {
        var _this = this;
        var bitio = _this.bitio;
        var stage = _this.stage;
        var obj = {};
        var isJis = false;

        obj.CharacterId = bitio.getUI16();
        var bounds = _this.rect();

        var flag1 = bitio.getUI8();
        obj.HasText = (flag1 >>> 7) & 1;
        obj.WordWrap = (flag1 >>> 6) & 1;
        obj.Multiline = (flag1 >>> 5) & 1;
        obj.Password = (flag1 >>> 4) & 1;
        obj.ReadOnly = (flag1 >>> 3) & 1;
        obj.HasTextColor = (flag1 >>> 2) & 1;
        obj.HasMaxLength = (flag1 >>> 1) & 1;
        obj.HasFont = flag1 & 1;

        var flag2 = bitio.getUI8();
        obj.HasFontClass = (flag2 >>> 7) & 1;
        obj.AutoSize = (flag2 >>> 6) & 1;
        obj.HasLayout = (flag2 >>> 5) & 1;
        obj.NoSelect = (flag2 >>> 4) & 1;
        obj.Border = (flag2 >>> 3) & 1;
        obj.WasStatic = (flag2 >>> 2) & 1;
        obj.HTML = (flag2 >>> 1) & 1;
        obj.UseOutlines = flag2 & 1;

        if (obj.HasFont) {
            obj.FontID = bitio.getUI16();
            var fontData = stage.getCharacter(obj.FontID);
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
            obj.LeftMargin = bitio.getUI16();
            obj.RightMargin = bitio.getUI16();
            obj.Indent = bitio.getUI16();
            obj.Leading = bitio.getUI16();
        }

        var VariableName = bitio.getDataUntil("\0", isJis) + "";
        obj.VariableName = (VariableName === "") ? null : VariableName;
        obj.InitialText = "";
        if (obj.HasText) {
            var text = bitio.getDataUntil("\0", isJis);
            if (obj.HTML) {
                if (text.indexOf("<sbr />") !== -1) {
                    text = text.replace(new RegExp("<sbr />", "gi"), "\n");
                }
                if (text.indexOf("<b>") !== -1) {
                    text = text.replace(new RegExp("<b>", "gi"), "");
                    text = text.replace(new RegExp("</b>", "gi"), "");
                }

                var span = _document.createElement("span");
                span.innerHTML = text;

                var tags = span.getElementsByTagName("p");
                var length = tags.length;
                var tagData = [];
                for (var i = 0; i < length; i++) {
                    tagData[i] = tags[i];
                }
                obj.InitialText = tagData;
            } else {
                obj.InitialText = text;
            }
        }

        stage.setCharacter(obj.CharacterId, {
            data: obj,
            bounds: bounds,
            tagType: tagType
        });
    };

    /**
     * @param tagType
     */
    SwfTag.prototype.parseDefineMorphShape = function (tagType)
    {
        var _this = this;
        var bitio = _this.bitio;
        var stage = _this.stage;
        var obj = {};
        obj.tagType = tagType;
        obj.CharacterId = bitio.getUI16();

        obj.StartBounds = _this.rect();
        obj.EndBounds = _this.rect();

        if (tagType === 84) {
            obj.StartEdgeBounds = _this.rect();
            obj.EndEdgeBounds = _this.rect();
            bitio.getUIBits(6); // Reserved
            obj.UsesNonScalingStrokes = bitio.getUIBits(1);
            obj.UsesScalingStrokes = bitio.getUIBits(1);
        }

        var offset = bitio.getUI32();
        var endOffset = bitio.byte_offset + offset;

        obj.MorphFillStyles = _this.fillStyleArray(tagType);
        obj.MorphLineStyles = _this.lineStyleArray(tagType);

        obj.StartEdges = _this.shapeWithStyle(tagType);
        if (bitio.byte_offset !== endOffset) {
            bitio.byte_offset = endOffset;
        }

        obj.EndEdges = _this.shapeWithStyle(tagType);

        // fill1 control
        var startPosition = {x: 0, y: 0};
        var endPosition = {x: 0, y: 0};
        var StartRecords = obj.StartEdges.ShapeRecords;
        var EndRecords = obj.EndEdges.ShapeRecords;
        var StartRecordLength = StartRecords.length;
        var EndRecordLength = EndRecords.length;
        var length = _max(StartRecordLength, EndRecordLength);
        for (var i = 0; i < length; i++) {
            var addRecode = {};
            var StartRecord = StartRecords[i];
            var EndRecord = EndRecords[i];
            if (!StartRecord && !EndRecord) {
                continue;
            }

            if (!StartRecord.isChange && !EndRecord.isChange) {
                if (StartRecord.isCurved) {
                    startPosition.x += StartRecord.ControlX + StartRecord.AnchorX;
                    startPosition.y += StartRecord.ControlY + StartRecord.AnchorY;
                } else {
                    startPosition.x += StartRecord.AnchorX;
                    startPosition.y += StartRecord.AnchorY;
                }

                if (EndRecord.isCurved) {
                    endPosition.x += EndRecord.ControlX + EndRecord.AnchorX;
                    endPosition.y += EndRecord.ControlY + EndRecord.AnchorY;
                } else {
                    endPosition.x += EndRecord.AnchorX;
                    endPosition.y += EndRecord.AnchorY;
                }
                continue;
            }

            if (StartRecord.isChange && !EndRecord.isChange) {
                addRecode = {
                    FillStyle0: StartRecord.FillStyle0,
                    FillStyle1: StartRecord.FillStyle1,
                    LineStyle: StartRecord.LineStyle,
                    StateFillStyle0: StartRecord.StateFillStyle0,
                    StateFillStyle1: StartRecord.StateFillStyle1,
                    StateLineStyle: StartRecord.StateLineStyle,
                    StateMoveTo: StartRecord.StateMoveTo,
                    StateNewStyles: StartRecord.StateNewStyles,
                    isChange: true
                };

                if (StartRecord.StateMoveTo) {
                    addRecode.MoveX = endPosition.x;
                    addRecode.MoveY = endPosition.y;
                    startPosition.x = StartRecord.MoveX;
                    startPosition.y = StartRecord.MoveY;
                }

                EndRecords.splice(i, 0, addRecode);
            } else if (!StartRecord.isChange && EndRecord.isChange) {
                addRecode = {
                    FillStyle0: EndRecord.FillStyle0,
                    FillStyle1: EndRecord.FillStyle1,
                    LineStyle: EndRecord.LineStyle,
                    StateFillStyle0: EndRecord.StateFillStyle0,
                    StateFillStyle1: EndRecord.StateFillStyle1,
                    StateLineStyle: EndRecord.StateLineStyle,
                    StateMoveTo: EndRecord.StateMoveTo,
                    StateNewStyles: EndRecord.StateNewStyles,
                    isChange: true
                };

                if (EndRecord.StateMoveTo) {
                    addRecode.MoveX = startPosition.x;
                    addRecode.MoveY = startPosition.y;
                    endPosition.x = EndRecord.MoveX;
                    endPosition.y = EndRecord.MoveY;
                }

                StartRecords.splice(i, 0, addRecode);
            } else {
                if (StartRecord.StateMoveTo) {
                    startPosition.x = StartRecord.MoveX;
                    startPosition.y = StartRecord.MoveY;
                }

                if (EndRecord.StateMoveTo) {
                    endPosition.x = EndRecord.MoveX;
                    endPosition.y = EndRecord.MoveY;
                }
            }
        }

        var FillType = 0;
        var FillStyle = 0;
        length = obj.StartEdges.ShapeRecords.length;
        for (i = 0; i < length; i++) {
            var record = StartRecords[i];
            if (!record.isChange) {
                continue;
            }
            if (record.StateFillStyle0) {
                FillStyle = record.FillStyle0;
            }

            if (FillStyle) {
                record.StateFillStyle0 = 1;
                record.StateFillStyle1 = 1;
                if (FillType) {
                    record.FillStyle0 = 0;
                    record.FillStyle1 = FillStyle;
                } else {
                    record.FillStyle0 = FillStyle;
                    record.FillStyle1 = 0;
                }
            } else {
                record.StateFillStyle1 = 1;
                record.FillStyle1 = 0;
            }

            FillType = (FillType) ? 0 : 1;
        }

        stage.setCharacter(obj.CharacterId, obj);
    };

    /**
     * @param char
     * @param ratio
     * @returns {{data: Array, bounds: {xMax: number, xMin: number, yMax: number, yMin: number}}}
     */
    SwfTag.prototype.buildMorphShape = function (char, ratio)
    {
        var per = (ratio === undefined) ? 0 : ratio / 65535;
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

        var shapes = {
            lineStyles: {
                lineStyleCount: lineStyleCount,
                lineStyles: []
            },
            fillStyles: {
                fillStyleCount: fillStyleCount,
                fillStyles: []
            },
            ShapeRecords: []
        };

        var position = {x: 0, y: 0};
        var len = StartShapeRecords.length;
        for (var i = 0; i < len; i++) {
            var StartRecord = StartShapeRecords[i];
            if (!StartRecord) {
                continue;
            }

            var newRecord = {};
            var EndRecord = EndShapeRecords[i];
            if (StartRecord.isChange) {
                var MoveX = 0;
                var MoveY = 0;

                if (StartRecord.StateMoveTo === 1) {
                    MoveX = StartRecord.MoveX * startPer + EndRecord.MoveX * per;
                    MoveY = StartRecord.MoveY * startPer + EndRecord.MoveY * per;
                    position.x = MoveX;
                    position.y = MoveY;
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

                if (per > 0 && per < 1 && StartRecord.isCurved !== EndRecord.isCurved) {
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
        newShapeRecords[newShapeRecords.length] = 0;
        shapes.ShapeRecords = newShapeRecords;

        var EndColor;
        var StartColor;
        var color;
        for (i = 0; i < lineStyleCount; i++) {
            var lineStyle = lineStyles[i];
            EndColor = lineStyle.EndColor;
            StartColor = lineStyle.StartColor;
            color = {
                R: _floor(StartColor.R * startPer + EndColor.R * per),
                G: _floor(StartColor.G * startPer + EndColor.G * per),
                B: _floor(StartColor.B * startPer + EndColor.B * per),
                A: StartColor.A * startPer + EndColor.A * per
            };

            var EndWidth = lineStyles[i].EndWidth;
            var StartWidth = lineStyles[i].StartWidth;
            shapes.lineStyles.lineStyles[i] = {
                Width: _floor(StartWidth * startPer + EndWidth * per),
                Color: color,
                fillStyleType: 0
            };
        }

        for (i = 0; i < fillStyleCount; i++) {
            var fillStyle = fillStyles[i];
            var fillStyleType = fillStyle.fillStyleType;

            if (fillStyleType === 0x00) {
                EndColor = fillStyle.EndColor;
                StartColor = fillStyle.StartColor;
                color = {
                    R: _floor(StartColor.R * startPer + EndColor.R * per),
                    G: _floor(StartColor.G * startPer + EndColor.G * per),
                    B: _floor(StartColor.B * startPer + EndColor.B * per),
                    A: StartColor.A * startPer + EndColor.A * per
                };

                shapes.fillStyles.fillStyles[i] = {
                    Color: color,
                    fillStyleType: fillStyleType
                };
            } else {
                var EndGradientMatrix = fillStyle.endGradientMatrix;
                var StartGradientMatrix = fillStyle.startGradientMatrix;
                var matrix = [
                    StartGradientMatrix[0] * startPer + EndGradientMatrix[0] * per,
                    StartGradientMatrix[1] * startPer + EndGradientMatrix[1] * per,
                    StartGradientMatrix[2] * startPer + EndGradientMatrix[2] * per,
                    StartGradientMatrix[3] * startPer + EndGradientMatrix[3] * per,
                    StartGradientMatrix[4] * startPer + EndGradientMatrix[4] * per,
                    StartGradientMatrix[5] * startPer + EndGradientMatrix[5] * per
                ];

                var gRecords = [];
                var gradient = fillStyle.gradient;
                var GradientRecords = gradient.GradientRecords;
                var gLen = GradientRecords.length;
                for (var gIdx = 0; gIdx < gLen; gIdx++) {
                    var gRecord = GradientRecords[gIdx];
                    EndColor = gRecord.EndColor;
                    StartColor = gRecord.StartColor;
                    color = {
                        R: _floor(StartColor.R * startPer + EndColor.R * per),
                        G: _floor(StartColor.G * startPer + EndColor.G * per),
                        B: _floor(StartColor.B * startPer + EndColor.B * per),
                        A: StartColor.A * startPer + EndColor.A * per
                    };

                    gRecords[gIdx] = {
                        Color: color,
                        Ratio: gRecord.StartRatio * startPer + gRecord.EndRatio * per
                    };
                }

                shapes.fillStyles.fillStyles[i] = {
                    gradient: {GradientRecords: gRecords},
                    gradientMatrix: matrix,
                    fillStyleType: fillStyleType
                };
            }
        }

        var EndBounds = char.EndBounds;
        var StartBounds = char.StartBounds;
        var bounds = {
            xMax: StartBounds.xMax * startPer + EndBounds.xMax * per,
            xMin: StartBounds.xMin * startPer + EndBounds.xMin * per,
            yMax: StartBounds.yMax * startPer + EndBounds.yMax * per,
            yMin: StartBounds.yMin * startPer + EndBounds.yMin * per
        };

        return {
            data: vtc.convert(shapes, true),
            bounds: bounds
        };
    };

    /**
     * @returns {{}}
     */
    SwfTag.prototype.parseFrameLabel = function ()
    {
        return {
            name: this.bitio.getDataUntil("\0"),
            frame: 0
        };
    };

    /**
     * @param tagType
     * @returns {*}
     */
    SwfTag.prototype.parseRemoveObject = function (tagType)
    {
        var bitio = this.bitio;
        if (tagType === 5) {
            console.log("RemoveObject");
            return {
                CharacterId: bitio.getUI16(),
                Depth: bitio.getUI16()
            };
        }
        return {Depth: bitio.getUI16()};
    };

    /**
     * @param tagType
     * @param length
     * @returns {{}}
     */
    SwfTag.prototype.parseDefineButton = function (tagType, length)
    {
        var obj = {};
        obj.tagType = tagType;

        var _this = this;
        var bitio = _this.bitio;
        var stage = _this.stage;
        var endOffset = bitio.byte_offset + length;
        obj.ButtonId = bitio.getUI16();

        var ActionOffset = 0;
        if (tagType !== 7) {
            obj.ReservedFlags = bitio.getUIBits(7);
            obj.TrackAsMenu = bitio.getUIBits(1);
            ActionOffset = bitio.getUI16();
        }

        obj.characters = _this.buttonCharacters();

        // actionScript
        if (tagType === 7) {
            obj.actions = _this.parseDoAction(endOffset - bitio.byte_offset);
        } else if (ActionOffset > 0) {
            obj.actions = _this.buttonActions(endOffset);
        }

        // set layer
        stage.setCharacter(obj.ButtonId, obj);
        if (bitio.byte_offset !== endOffset) {
            bitio.byte_offset = endOffset;
        }

        return obj;
    };

    /**
     * @returns {Array}
     */
    SwfTag.prototype.buttonCharacters = function ()
    {
        var characters = [];
        var _this = this;
        var bitio = _this.bitio;
        while (bitio.getUI8() !== 0) {
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
     * @returns {{}}
     */
    SwfTag.prototype.buttonRecord = function ()
    {
        var _this = this;
        var bitio = _this.bitio;
        var obj = {};

        bitio.getUIBits(2); // Reserved
        obj.PlaceFlagHasBlendMode = bitio.getUIBits(1);
        obj.PlaceFlagHasFilterList = bitio.getUIBits(1);
        obj.ButtonStateHitTest = bitio.getUIBits(1);
        obj.ButtonStateDown = bitio.getUIBits(1);
        obj.ButtonStateOver = bitio.getUIBits(1);
        obj.ButtonStateUp = bitio.getUIBits(1);
        obj.CharacterId = bitio.getUI16();
        obj.Depth = bitio.getUI16();
        obj.PlaceFlagHasMatrix = 1;
        obj.Matrix = _this.matrix();
        obj.ColorTransform = _this.colorTransform();
        obj.PlaceFlagHasColorTransform = (obj.ColorTransform === undefined) ? 0 : 1;
        if (obj.PlaceFlagHasBlendMode) {
            obj.BlendMode = bitio.getUI8();
        }
        if (obj.PlaceFlagHasFilterList) {
            obj.SurfaceFilterList = _this.getFilterList();
        }
        obj.PlaceFlagHasRatio = 0;
        obj.PlaceFlagHasClipDepth = 0;
        obj.Sound = null;
        return obj;
    };

    /**
     * @param endOffset
     * @returns {Array}
     */
    SwfTag.prototype.buttonActions = function (endOffset)
    {
        var _this = this;
        var bitio = _this.bitio;
        var results = [];

        while (true) {
            var obj = {};
            var startOffset = bitio.byte_offset;
            var CondActionSize = bitio.getUI16();
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
            var length = endOffset - bitio.byte_offset + 1;
            obj.ActionScript = _this.parseDoAction(length);
            results[results.length] = obj;

            if (!CondActionSize) {
                break;
            }
            bitio.byte_offset = startOffset + CondActionSize;
        }

        return results;
    };

    /**
     * @param tagType
     * @param length
     * @returns {{}}
     */
    SwfTag.prototype.parsePlaceObject = function (tagType, length)
    {
        var _this = this;
        var bitio = _this.bitio;
        var stage = _this.stage;
        var obj = {};
        obj.tagType = tagType;
        var startOffset = bitio.byte_offset;

        if (tagType === 4) {
            obj.CharacterId = bitio.getUI16();
            obj.Depth = bitio.getUI16();
            obj.Matrix = _this.matrix();
            obj.PlaceFlagHasMatrix = 1;

            bitio.byteAlign();
            if ((bitio.byte_offset - startOffset) < length) {
                obj.ColorTransform = _this.colorTransform();
                obj.PlaceFlagHasColorTransform = 1;
            }
        } else {
            obj.PlaceFlagHasClipActions = bitio.getUIBits(1);
            if (stage.getVersion() < 5) {
                obj.PlaceFlagHasClipActions = 0;
            }
            obj.PlaceFlagHasClipDepth = bitio.getUIBits(1);
            obj.PlaceFlagHasName = bitio.getUIBits(1);
            obj.PlaceFlagHasRatio = bitio.getUIBits(1);
            obj.PlaceFlagHasColorTransform = bitio.getUIBits(1);
            obj.PlaceFlagHasMatrix = bitio.getUIBits(1);
            obj.PlaceFlagHasCharacter = bitio.getUIBits(1);
            obj.PlaceFlagMove = bitio.getUIBits(1);

            // PlaceObject3
            if (tagType === 70) {
                bitio.getUIBits(1); // Reserved
                obj.PlaceFlagOpaqueBackground = bitio.getUIBits(1);
                obj.PlaceFlagHasVisible = bitio.getUIBits(1);
                obj.PlaceFlagHasImage = bitio.getUIBits(1);
                obj.PlaceFlagHasClassName = bitio.getUIBits(1);
                obj.PlaceFlagHasCacheAsBitmap = bitio.getUIBits(1);
                obj.PlaceFlagHasBlendMode = bitio.getUIBits(1);
                obj.PlaceFlagHasFilterList = bitio.getUIBits(1);
            }

            obj.Depth = bitio.getUI16();

            if (obj.PlaceFlagHasClassName ||
                (obj.PlaceFlagHasImage && obj.PlaceFlagHasCharacter)
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

            if (tagType === 70) {
                if (obj.PlaceFlagHasFilterList) {
                    obj.SurfaceFilterList = _this.getFilterList();
                }
                if (obj.PlaceFlagHasBlendMode) {
                    obj.BlendMode = bitio.getUI8();
                }
                if (obj.PlaceFlagHasCacheAsBitmap) {
                    obj.BitmapCache = bitio.getUI8();
                }
                if (obj.PlaceFlagHasVisible) {
                    obj.Visible = bitio.getUI8();
                    obj.BackgroundColor = _this.rgba();
                }
            }

            if (obj.PlaceFlagHasClipActions) {
                bitio.getUI16(); // Reserved
                obj.AllEventFlags = _this.parseClipEventFlags();

                var endLength = startOffset + length;
                var actionRecords = [];
                while (bitio.byte_offset < endLength) {
                    var clipActionRecord = _this.parseClipActionRecord(endLength);
                    actionRecords[actionRecords.length] = clipActionRecord;
                    if (endLength <= bitio.byte_offset) {
                        break;
                    }
                    var endFlag = (stage.getVersion() <= 5) ? bitio.getUI16() : bitio.getUI32();
                    if (!endFlag) {
                        break;
                    }
                    if (stage.getVersion() <= 5) {
                        bitio.byte_offset -= 2;
                    } else {
                        bitio.byte_offset -= 4;
                    }

                    if (clipActionRecord.KeyCode) {
                        bitio.byte_offset -= 1;
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
     * @returns {{}}
     */
    SwfTag.prototype.parseClipActionRecord = function (endLength)
    {
        var _this = this;
        var bitio = _this.bitio;
        var obj = {};
        var EventFlags = _this.parseClipEventFlags();
        if (endLength > bitio.byte_offset) {
            var ActionRecordSize = bitio.getUI32();
            if (EventFlags.keyPress) {
                obj.KeyCode = bitio.getUI8();
            }
            obj.EventFlags = EventFlags;
            obj.Actions = _this.parseDoAction(ActionRecordSize);
        }
        return obj;
    };

    /**
     * @returns {{}}
     */
    SwfTag.prototype.parseClipEventFlags = function ()
    {
        var _this = this;
        var obj = {};
        var bitio = _this.bitio;
        var stage = _this.stage;

        obj.keyUp = bitio.getUIBits(1);
        obj.keyDown = bitio.getUIBits(1);
        obj.mouseUp = bitio.getUIBits(1);
        obj.mouseDown = bitio.getUIBits(1);
        obj.mouseMove = bitio.getUIBits(1);
        obj.unload = bitio.getUIBits(1);
        obj.enterFrame = bitio.getUIBits(1);
        obj.load = bitio.getUIBits(1);

        if (stage.getVersion() >= 6) {
            obj.dragOver = bitio.getUIBits(1);
            obj.rollOut = bitio.getUIBits(1);
            obj.rollOver = bitio.getUIBits(1);
            obj.releaseOutside = bitio.getUIBits(1);
            obj.release = bitio.getUIBits(1);
            obj.press = bitio.getUIBits(1);
            obj.initialize = bitio.getUIBits(1);
        }

        obj.data = bitio.getUIBits(1);

        if (stage.getVersion() >= 6) {
            bitio.getUIBits(5); // Reserved
            obj.construct = bitio.getUIBits(1);
            obj.keyPress = bitio.getUIBits(1);
            obj.dragOut = bitio.getUIBits(1);
            bitio.getUIBits(8); // Reserved
        }

        bitio.byteAlign();

        return obj;
    };

    /**
     * @returns {Array}
     */
    SwfTag.prototype.getFilterList = function ()
    {
        var _this = this;
        var bitio = _this.bitio;
        var result = [];
        var _getFilter = _this.getFilter;
        var NumberOfFilters = bitio.getUI8();
        for (var i = 0; i < NumberOfFilters; i++) {
            var filter = _getFilter.call(_this);
            if (filter) {
                result[result.length] = filter;
            }
        }
        return (result.length) ? result : null;
    };

    /**
     * @return {{}}
     */
    SwfTag.prototype.getFilter = function ()
    {
        var _this = this;
        var bitio = _this.bitio;
        var filterId = bitio.getUI8();
        var filter;
        switch (filterId) {
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
        return filter;
    };

    /**
     * @returns {DropShadowFilter}
     */
    SwfTag.prototype.dropShadowFilter = function ()
    {
        var _this = this;
        var bitio = _this.bitio;
        var rgba = _this.rgba();
        var alpha = rgba.A;
        var color = rgba.R << 16 | rgba.G << 8 | rgba.B;
        var blurX = bitio.getUI32() / 0x10000;
        var blurY = bitio.getUI32() / 0x10000;
        var angle = bitio.getUI32() / 0x10000 * 180 / _PI;
        var distance = bitio.getUI32() / 0x10000;
        var strength = bitio.getFloat16() / 256;
        var inner = (bitio.getUIBits(1)) ? true : false;
        var knockout = (bitio.getUIBits(1)) ? true : false;
        var hideObject = (bitio.getUIBits(1)) ? false : true;
        var quality = bitio.getUIBits(5);

        if (!strength) {
            return null;
        }

        return new DropShadowFilter(
            distance, angle, color, alpha, blurX, blurY,
            strength, quality, inner, knockout, hideObject
        );
    };

    /**
     * @returns {BlurFilter}
     */
    SwfTag.prototype.blurFilter = function ()
    {
        var bitio = this.bitio;
        var blurX = bitio.getUI32() / 0x10000;
        var blurY = bitio.getUI32() / 0x10000;
        var quality = bitio.getUIBits(5);
        bitio.getUIBits(3); // Reserved

        return new BlurFilter(blurX, blurY, quality);
    };

    /**
     * @returns {GlowFilter}
     */
    SwfTag.prototype.glowFilter = function ()
    {
        var _this = this;
        var bitio = _this.bitio;
        var rgba = _this.rgba();
        var alpha = rgba.A;
        var color = rgba.R << 16 | rgba.G << 8 | rgba.B;
        var blurX = bitio.getUI32() / 0x10000;
        var blurY = bitio.getUI32() / 0x10000;
        var strength = bitio.getFloat16() / 256;
        var inner = (bitio.getUIBits(1)) ? true : false;
        var knockout = (bitio.getUIBits(1)) ? true : false;
        bitio.getUIBits(1); // CompositeSource
        var quality = bitio.getUIBits(5);

        if (!strength) {
            return null;
        }

        return new GlowFilter(
            color, alpha, blurX, blurY,
            strength, quality, inner, knockout
        );
    };

    /**
     * @returns {BevelFilter}
     */
    SwfTag.prototype.bevelFilter = function ()
    {
        var _this = this;
        var bitio = _this.bitio;
        var rgba;
        rgba = _this.rgba();
        var highlightAlpha = rgba.A;
        var highlightColor = rgba.R << 16 | rgba.G << 8 | rgba.B;

        rgba = _this.rgba();
        var shadowAlpha = rgba.A;
        var shadowColor = rgba.R << 16 | rgba.G << 8 | rgba.B;

        var blurX = bitio.getUI32() / 0x10000;
        var blurY = bitio.getUI32() / 0x10000;
        var angle = bitio.getUI32() / 0x10000 * 180 / _PI;
        var distance = bitio.getUI32() / 0x10000;
        var strength = bitio.getFloat16() / 256;
        var inner = (bitio.getUIBits(1)) ? true : false;
        var knockout = (bitio.getUIBits(1)) ? true : false;
        bitio.getUIBits(1); // CompositeSource
        var OnTop = bitio.getUIBits(1);
        var quality = bitio.getUIBits(4);

        var type = "inner";
        if (!inner) {
            if (OnTop) {
                type = "full";
            } else {
                type = "outer";
            }
        }

        if (!strength) {
            return null;
        }

        return new BevelFilter(
            distance, angle, highlightColor, highlightAlpha,
            shadowColor, shadowAlpha, blurX, blurY,
            strength, quality, type, knockout
        );
    };

    /**
     * @returns {GradientGlowFilter}
     */
    SwfTag.prototype.gradientGlowFilter = function ()
    {
        var _this = this;
        var bitio = _this.bitio;
        var i;
        var NumColors = bitio.getUI8();

        var colors = [];
        var alphas = [];
        for (i = 0; i < NumColors; i++) {
            var rgba = _this.rgba();
            alphas[alphas.length] = rgba.A;
            colors[colors.length] = rgba.R << 16 | rgba.G << 8 | rgba.B;
        }

        var ratios = [];
        for (i = 0; i < NumColors; i++) {
            ratios[ratios.length] = bitio.getUI8();
        }

        var blurX = bitio.getUI32() / 0x10000;
        var blurY = bitio.getUI32() / 0x10000;
        var angle = bitio.getUI32() / 0x10000 * 180 / _PI;
        var distance = bitio.getUI32() / 0x10000;
        var strength = bitio.getFloat16() / 256;
        var inner = (bitio.getUIBits(1)) ? true : false;
        var knockout = (bitio.getUIBits(1)) ? true : false;
        bitio.getUIBits(1); // CompositeSource
        var OnTop = bitio.getUIBits(1);
        var quality = bitio.getUIBits(4);

        var type = "inner";
        if (!inner) {
            if (OnTop) {
                type = "full";
            } else {
                type = "outer";
            }
        }

        if (!strength) {
            return null;
        }

        return new GradientGlowFilter(
            distance, angle, colors, alphas, ratios,
            blurX, blurY, strength, quality, type, knockout
        );
    };

    /**
     * @returns {ConvolutionFilter}
     */
    SwfTag.prototype.convolutionFilter = function ()
    {
        var _this = this;
        var bitio = _this.bitio;
        var obj = {};

        obj.MatrixX = bitio.getUI8();
        obj.MatrixY = bitio.getUI8();
        obj.Divisor = bitio.getFloat16() | bitio.getFloat16();
        obj.Bias = bitio.getFloat16() | bitio.getFloat16();

        var count = obj.MatrixX * obj.MatrixY;
        var MatrixArr = [];
        while (count--) {
            MatrixArr[MatrixArr.length] = bitio.getUI32();
        }
        obj.DefaultColor = _this.rgba();
        bitio.getUIBits(6); // Reserved
        obj.Clamp = bitio.getUIBits(1);
        obj.PreserveAlpha = bitio.getUIBits(1);

        return new ConvolutionFilter(
        );
    };

    /**
     * @returns {GradientBevelFilter}
     */
    SwfTag.prototype.gradientBevelFilter = function ()
    {
        var _this = this;
        var bitio = _this.bitio;
        var NumColors = bitio.getUI8();

        var i;
        var colors = [];
        var alphas = [];
        for (i = 0; i < NumColors; i++) {
            var rgba = _this.rgba();
            alphas[alphas.length] = rgba.A;
            colors[colors.length] = rgba.R << 16 | rgba.G << 8 | rgba.B;
        }

        var ratios = [];
        for (i = 0; i < NumColors; i++) {
            ratios[ratios.length] = bitio.getUI8();
        }

        var blurX = bitio.getUI32() / 0x10000;
        var blurY = bitio.getUI32() / 0x10000;
        var angle = bitio.getUI32() / 0x10000 * 180 / _PI;
        var distance = bitio.getUI32() / 0x10000;
        var strength = bitio.getFloat16() / 256;

        var inner = (bitio.getUIBits(1)) ? true : false;
        var knockout = (bitio.getUIBits(1)) ? true : false;
        bitio.getUIBits(1); // CompositeSource
        var OnTop = bitio.getUIBits(1);
        var quality = bitio.getUIBits(4);

        var type = "inner";
        if (!inner) {
            if (OnTop) {
                type = "full";
            } else {
                type = "outer";
            }
        }

        if (!strength) {
            return null;
        }

        return new GradientBevelFilter(
            distance, angle, colors, alphas, ratios,
            blurX, blurY, strength, quality, type, knockout
        );
    };

    /**
     * @returns {ColorMatrixFilter}
     */
    SwfTag.prototype.colorMatrixFilter = function ()
    {
        var bitio = this.bitio;
        var MatrixArr = [];
        for (var i = 0; i < 20; i++) {
            MatrixArr[MatrixArr.length] = bitio.getUI32();
        }

        return new ColorMatrixFilter(
        );
    };

    /**
     * @returns {Array}
     */
    SwfTag.prototype.colorTransform = function ()
    {
        var bitio = this.bitio;
        bitio.byteAlign();

        var result = [1, 1, 1, 1, 0, 0, 0, 0];
        var first6bits = bitio.getUIBits(6);
        var HasAddTerms = first6bits >> 5;
        var HasMultiTerms = (first6bits >> 4) & 1;
        var nbits = first6bits & 0x0f;

        if (HasMultiTerms) {
            result[0] = bitio.getSIBits(nbits) / 256;
            result[1] = bitio.getSIBits(nbits) / 256;
            result[2] = bitio.getSIBits(nbits) / 256;
            result[3] = bitio.getSIBits(nbits) / 256;
        }

        if (HasAddTerms) {
            result[4] = bitio.getSIBits(nbits);
            result[5] = bitio.getSIBits(nbits);
            result[6] = bitio.getSIBits(nbits);
            result[7] = bitio.getSIBits(nbits);
        }

        return result;
    };

    /**
     * @param dataLength
     */
    SwfTag.prototype.parseDefineSprite = function (dataLength)
    {
        var _this = this;
        var bitio = _this.bitio;
        var characterId = bitio.getUI16();
        bitio.getUI16(); // FrameCount
        var stage = _this.stage;
        stage.setCharacter(characterId, _this.parseTags(dataLength, characterId));
    };

    /**
     * @param length
     * @returns {ActionScript}
     */
    SwfTag.prototype.parseDoAction = function (length)
    {
        var _this = this;
        var bitio = _this.bitio;
        var data = bitio.getData(length);
        return new ActionScript(data);
    };

    /**
     * @param length
     */
    SwfTag.prototype.parseDoInitAction = function (length)
    {
        var _this = this;
        var bitio = _this.bitio;
        var stage = _this.stage;
        var spriteId = bitio.getUI16();

        var as = new ActionScript(bitio.getData(length - 2), undefined, undefined, true);
        var mc = stage.getParent();
        mc.variables = {};
        var action = mc.createActionScript2(as);
        var packages = stage.packages;
        if (spriteId in packages) {
            mc.active = true;
            action.apply(mc);
            mc.active = false;
        }
        stage.initActions[spriteId] = action;
    };

    /**
     * @returns {{}}
     */
    SwfTag.prototype.parseDefineSceneAndFrameLabelData = function ()
    {
        var i;
        var bitio = this.bitio;
        var obj = {};
        obj.SceneCount = bitio.getU30();
        obj.sceneInfo = [];
        for (i = 0; i < obj.SceneCount; i++) {
            obj.sceneInfo[i] = {
                offset: bitio.getU30(),
                name: decodeURIComponent(bitio.getDataUntil("\0"))
            };
        }

        obj.FrameLabelCount = bitio.getU30();
        obj.frameInfo = [];
        for (i = 0; i < obj.FrameLabelCount; i++) {
            obj.frameInfo[i] = {
                num: bitio.getU30(),
                label: decodeURIComponent(bitio.getDataUntil("\0"))
            };
        }
        return obj;
    };

    /**
     * @param tagType
     * @returns {{}}
     */
    SwfTag.prototype.parseSoundStreamHead = function (tagType)
    {
        var obj = {};
        obj.tagType = tagType;
        var bitio = this.bitio;

        bitio.getUIBits(4); // Reserved

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

        if (obj.StreamSoundCompression === 2) {
            obj.LatencySeek = bitio.getSIBits(2);
        }

        return obj;
    };

    /**
     * @param tagType
     * @param length
     */
    SwfTag.prototype.parseDoABC = function (tagType, length)
    {
        var _this = this;
        var bitio = _this.bitio;
        var stage = _this.stage;
        stage.abcFlag = true;
        var startOffset = bitio.byte_offset;

        var obj = {};
        obj.tagType = tagType;
        obj.Flags = bitio.getUI32();
        obj.Name = bitio.getDataUntil("\0");
        var offset = length - (bitio.byte_offset - startOffset);
        var ABCData = bitio.getData(offset);
        var ABCBitIO = new BitIO();
        ABCBitIO.setData(ABCData);

        // version
        obj.minorVersion = ABCBitIO.getUI16();
        obj.majorVersion = ABCBitIO.getUI16();

        // integer
        obj.integer = _this.ABCInteger(ABCBitIO);

        // uinteger
        obj.uinteger = _this.ABCUinteger(ABCBitIO);

        // double
        obj.double = _this.ABCDouble(ABCBitIO);

        // string_info
        obj.string = _this.ABCStringInfo(ABCBitIO);

        // namespace_info
        obj.namespace = _this.ABCNameSpaceInfo(ABCBitIO);

        // ns_set_info
        obj.nsSet = _this.ABCNsSetInfo(ABCBitIO);

        // multiname_info;
        obj.multiname_info = _this.ABCMultiNameInfo(ABCBitIO);

        var i = 0;

        // method_info
        obj.method = [];
        var methodCount = ABCBitIO.getU30();
        if (methodCount) {
            var method = [];
            for (i = 0; i < methodCount; i++) {
                method[i] = _this.ABCMethodInfo(ABCBitIO);
            }
            obj.method = method;
        }

        // metadata_info
        obj.metadata = [];
        var metadataCount = ABCBitIO.getU30();
        if (metadataCount) {
            var metadataInfo = [];
            for (i = 0; i < metadataCount; i++) {
                metadataInfo[i] = _this.ABCMetadataInfo(ABCBitIO);
            }
            obj.metadata = metadataInfo;
        }

        var classCount = ABCBitIO.getU30();
        obj.instance = [];
        obj.class = [];
        if (classCount) {
            // instance_info
            var instance = [];
            for (i = 0; i < classCount; i++) {
                instance[i] = _this.ABCInstanceInfo(ABCBitIO);
            }
            obj.instance = instance;

            // class_info
            var classInfo = [];
            for (i = 0; i < classCount; i++) {
                classInfo[i] = _this.ABCClassInfo(ABCBitIO);
            }
            obj.class = classInfo;
        }

        // script_info
        obj.script = [];
        var scriptCount = ABCBitIO.getU30();
        if (scriptCount) {
            var script = [];
            for (i = 0; i < scriptCount; i++) {
                script[i] = _this.ABCScriptInfo(ABCBitIO);
            }
            obj.script = script;
        }

        // method_body_info
        obj.methodBody = [];
        var methodBodyCount  = ABCBitIO.getU30();
        if (methodBodyCount) {
            var methodBody = [];
            for (i = 0; i < methodBodyCount; i++) {
                var mBody = _this.ABCMethodBodyInfo(ABCBitIO);
                methodBody[mBody.method] = mBody;
            }
            obj.methodBody = methodBody;
        }

        // build names
        obj = _this.ABCMultinameToString(obj);

        // build instance
        _this.ABCBuildInstance(obj);
    };

    /**
     * @param obj
     */
    SwfTag.prototype.ABCBuildInstance = function (obj)
    {
        var _this = this;
        var instances = obj.instance;
        var length = instances.length;
        var namespaces = obj.namespace;
        var string = obj.string;
        var stage = _this.stage;
        var names = obj.names;
        for (var i = 0; i < length; i++) {
            var instance = instances[i];
            var flag = instance.flags;

            var nsIndex = null;
            if (flag & 0x08) {
                nsIndex = instance.protectedNs;
            }

            var object = {};
            if (nsIndex) {
                var nObj = namespaces[nsIndex];
                object = string[nObj.name];
            } else {
                object = names[instance.name];
            }

            var values = object.split(":");
            var className = values.pop();
            var ns = values.pop();

            // build parent
            var AVM2 = function (mc) { this["__swf2js__::builder"] = mc; };
            var prop = AVM2.prototype;

            // constructor
            prop[className] = _this.ABCCreateActionScript3(obj, instance.iinit, object);

            // prototype
            var traits = instance.trait;
            var tLength = traits.length;
            var register = [];
            var rCount = 1;
            if (tLength) {
                for (var idx = 0; idx < tLength; idx++) {
                    var trait = traits[idx];
                    var tName = names[trait.name];
                    var tNames = tName.split("::");
                    var pName =  tNames.pop();
                    var kind = trait.kind;

                    var val = undefined;
                    switch (kind) {
                        case 0: // Slot
                            register[rCount++] = pName;
                            break;
                        case 1: // Method
                        case 2: // Getter
                        case 3: // Setter
                            val = _this.ABCCreateActionScript3(obj, trait.data.info, object);
                            break;
                        case 4: // Class
                            console.log("build: Class");
                            break;
                        case 5: // Function
                            console.log("build: Function");
                            break;
                        case 6: // Const
                            console.log("build: Const");
                            break;
                    }
                    prop[pName] = val;
                }
            }

            var localName = "__swf2js__:"+ object;
            prop[localName] = {};

            // extends
            var superName = instance.superName;
            prop[localName].extends = names[superName];

            // register
            prop[localName].register = register;

            // build
            var abc = stage.abc;
            var classObj = stage.avm2;
            if (ns) {
                var nss = ns.split(".");
                var nLen = nss.length;
                for (var nIdx = 0; nIdx < nLen; nIdx++) {
                    if (!(nss[nIdx] in classObj)) {
                        classObj[nss[nIdx]] = {};
                        abc[nss[nIdx]] = {};
                    }
                    classObj = classObj[nss[nIdx]];
                    abc = abc[nss[nIdx]];
                }
            }

            abc[className] = AVM2;
            classObj[className] = new AVM2();
        }
    };

    /**
     * @param obj
     * @param methodId
     * @param abcKey
     */
    SwfTag.prototype.ABCCreateActionScript3 = function (obj, methodId, abcKey)
    {
        var stage = this.stage;
        return (function (data, id, ns, stage)
        {
            return function ()
            {
                var as3 = new ActionScript3(data, id, ns, stage);
                as3.caller = this;
                as3.args = arguments;
                return as3.execute();
            };
        })(obj, methodId, abcKey, stage);
    };

    /**
     * @param obj
     * @returns {*}
     */
    SwfTag.prototype.ABCMultinameToString = function (obj)
    {
        var multinames = obj.multiname_info;
        var length = multinames.length;
        var string = obj.string;
        var ns = obj.namespace;
        var names = [];
        for (var i = 1; i < length; i++) {
            var info = multinames[i];
            var str = "";

            switch (info.kind) {
                case 0x07: // QName
                case 0x0D: // QNameA
                    var namespace_info = ns[info.ns];
                    switch (namespace_info.kind) {
                        default:
                            str += string[namespace_info.name];
                            break;
                        case 0x05:
                            str += "private";
                            break;
                    }

                    if (str !== "") {
                        str += "::";
                    }

                    str += string[info.name];
                    break;
                case 0x0F: // RTQName
                case 0x10: // RTQNameA
                    console.log("RTQName", i, info);
                    break;
                case 0x09: // Multiname
                case 0x0E: // MultinameA
                    str = string[info.name];
                    break;
                case 0x1B: // MultinameL
                case 0x1C: // MultinameLA
                    str = null;
                    break;
                case 0x11: // RTQNameL
                case 0x12: // RTQNameLA
                    console.log("RTQNameL", i, info);

                    break;
            }
            names[i] = str;
        }
        obj.names = names;
        return obj;
    };

    /**
     * @param ABCBitIO
     * @returns {Array}
     */
    SwfTag.prototype.ABCInteger = function (ABCBitIO)
    {
        var array = [];
        var count = ABCBitIO.getU30();
        if (count) {
            for (var i = 1; i < count; i++) {
                array[i] = ABCBitIO.getS30();
            }
        }
        return array;
    };

    /**
     * @param ABCBitIO
     * @returns {Array}
     */
    SwfTag.prototype.ABCUinteger = function (ABCBitIO)
    {
        var array = [];
        var count = ABCBitIO.getU30();
        if (count) {
            for (var i = 1; i < count; i++) {
                array[i] = ABCBitIO.getU30();
            }
        }
        return array;
    };

    /**
     * @param ABCBitIO
     * @returns {Array}
     */
    SwfTag.prototype.ABCDouble = function (ABCBitIO)
    {
        var array = [];
        var count = ABCBitIO.getU30();
        if (count) {
            for (var i = 1; i < count; i++) {
                array[i] = ABCBitIO.getFloat64LittleEndian();
            }
        }
        return array;
    };

    /**
     * @param ABCBitIO
     * @returns {Array}
     */
    SwfTag.prototype.ABCStringInfo = function (ABCBitIO)
    {
        var array = [];
        var count = ABCBitIO.getU30();
        if (count) {
            for (var i = 1; i < count; i++) {
                array[i] = ABCBitIO.AbcReadString();
            }
        }
        return array;
    };

    /**
     * @param ABCBitIO
     * @returns {Array}
     */
    SwfTag.prototype.ABCNameSpaceInfo = function (ABCBitIO)
    {
        var array = [];
        var count = ABCBitIO.getU30();
        if (count) {
            for (var i = 1; i < count; i++) {
                array[i] =
                {
                    kind: ABCBitIO.getUI8(),
                    name: ABCBitIO.getU30()
                };
            }
        }
        return array;
    };

    /**
     * @param ABCBitIO
     * @returns {Array}
     */
    SwfTag.prototype.ABCNsSetInfo = function (ABCBitIO)
    {
        var array = [];
        var count = ABCBitIO.getU30();
        if (count) {
            for (var i = 1; i < count; i++) {
                var nsCount = ABCBitIO.getU30();
                var ns = [];
                if (nsCount) {
                    for (var j = 0; j < nsCount; j++) {
                        ns[j] = ABCBitIO.getU30();
                    }
                }
                array[i] = ns;
            }
        }
        return array;
    };

    /**
     * @param ABCBitIO
     * @returns {Array}
     */
    SwfTag.prototype.ABCMultiNameInfo = function (ABCBitIO)
    {
        var array = [];
        var count = ABCBitIO.getU30();
        if (count) {
            for (var i = 1; i < count; i++) {
                var obj = {};
                obj.kind = ABCBitIO.getUI8();
                switch (obj.kind) {
                    case 0x07: // QName
                    case 0x0D: // QNameA
                        obj.ns = ABCBitIO.getU30();
                        obj.name = ABCBitIO.getU30();
                        break;
                    case 0x0F: // RTQName
                    case 0x10: // RTQNameA
                        obj.name = ABCBitIO.getU30();
                        break;
                    case 0x09: // Multiname
                    case 0x0E: // MultinameA
                        obj.name = ABCBitIO.getU30();
                        obj.ns_set = ABCBitIO.getU30();
                        break;
                    case 0x1B: // MultinameL
                    case 0x1C: // MultinameLA
                        obj.ns_set = ABCBitIO.getU30();
                        break;
                    case 0x11: // RTQNameL
                    case 0x12: // RTQNameLA
                        break;
                }
                array[i] = obj;
            }
        }
        return array;
    };

    /**
     * @param ABCBitIO
     * @returns {{}}
     */
    SwfTag.prototype.ABCMethodInfo = function (ABCBitIO)
    {
        var obj = {};
        var i;
        var count = ABCBitIO.getU30();
        obj.paramCount = count;
        obj.returnType = ABCBitIO.getU30();
        obj.paramType = [];
        if (count) {
            var paramType = [];
            for (i = 0; i < count; i++) {
                paramType[paramType.length] = ABCBitIO.getU30();
            }
            obj.paramType = paramType;
        }

        obj.name = ABCBitIO.getU30();
        obj.flags = ABCBitIO.getUI8();

        obj.options = [];
        if (obj.flags === 0x08) {
            var options = [];
            var optionCount = ABCBitIO.getU30();
            if (optionCount) {
                for (i = 0; i < optionCount; i++) {
                    options[options.length] = {
                        val: ABCBitIO.getU30(),
                        kind: ABCBitIO.getUI8()
                    };
                }
            }
            obj.options = options;
        }

        obj.paramName = [];
        if (obj.flags === 0x80) {
            var paramName = [];
            if (count) {
                for (i = 0; i < count; i++) {
                    paramName[paramName.length] = ABCBitIO.getU30();
                }
            }
            obj.paramName = paramName;
        }

        return obj;
    };

    /**
     * @param ABCBitIO
     * @returns {{}}
     */
    SwfTag.prototype.ABCMetadataInfo = function (ABCBitIO)
    {
        var obj = {};
        obj.name = ABCBitIO.getU30();
        obj.items = [];

        var count = ABCBitIO.getU30();
        if (count) {
            var items = [];
            for (var i = 0; i < count; i++) {
                items[items.length] = {
                    key: ABCBitIO.getU30(),
                    value: ABCBitIO.getU30()
                };
            }
            obj.items = items;
        }

        return obj;
    };

    /**
     * @param ABCBitIO
     * @returns {{}}
     */
    SwfTag.prototype.ABCInstanceInfo = function (ABCBitIO)
    {
        var obj = {};
        obj.name = ABCBitIO.getU30();
        obj.superName = ABCBitIO.getU30();
        obj.flags = ABCBitIO.getUI8();
        if (obj.flags & 0x08) {
            obj.protectedNs = ABCBitIO.getU30();
        }

        var count = ABCBitIO.getU30();
        obj.interfaces = [];
        if (count) {
            var interfaces = [];
            for (var i = 0; i < count; i++) {
                interfaces[interfaces.length] = ABCBitIO.getU30();
            }
            obj.interfaces = interfaces;
        }

        obj.iinit = ABCBitIO.getU30();
        obj.trait = this.ABCTrait(ABCBitIO);

        return obj;
    };

    /**
     * @param ABCBitIO
     * @returns {{}}
     */
    SwfTag.prototype.ABCClassInfo = function (ABCBitIO)
    {
        var obj = {};
        obj.cinit = ABCBitIO.getU30();
        obj.trait = this.ABCTrait(ABCBitIO);
        return obj;
    };

    /**
     * @param ABCBitIO
     */
    SwfTag.prototype.ABCScriptInfo = function (ABCBitIO)
    {
        var obj = {};
        obj.init = ABCBitIO.getU30();
        obj.trait = this.ABCTrait(ABCBitIO);
        return obj;
    };

    /**
     * @param ABCBitIO
     * @returns {{}}
     */
    SwfTag.prototype.ABCMethodBodyInfo = function (ABCBitIO)
    {
        var _this = this;
        var obj = {};
        obj.method = ABCBitIO.getU30();
        obj.maxStack = ABCBitIO.getU30();
        obj.localCount = ABCBitIO.getU30();
        obj.initScopeDepth = ABCBitIO.getU30();
        obj.maxScopeDepth = ABCBitIO.getU30();
        var i;
        var count = ABCBitIO.getU30();
        var codes = [];
        if (count) {
            codes = _this.ABCBuildCode(ABCBitIO, count);
        }
        obj.codes = codes;

        count = ABCBitIO.getU30();
        var exceptions = [];
        if (count) {
            for (i = 0; i < count; i++) {
                exceptions[exceptions.length] = _this.ABCException(ABCBitIO);
            }
        }
        obj.exceptions = exceptions;
        obj.trait = _this.ABCTrait(ABCBitIO);
        return obj;
    };

    /**
     * @param ABCBitIO
     * @param count
     * @returns {Array}
     */
    SwfTag.prototype.ABCBuildCode = function (ABCBitIO, count)
    {
        var array = [];
        var cacheOffset;
        for (var i = 0; i < count; i++) {
            var obj = {};
            var offset = 0;

            var code = ABCBitIO.getUI8();
            obj.code = code;
            switch (code) {
                case 0x86: // astype
                case 0x41: // call
                case 0x80: // coerce
                case 0x42: // construct
                case 0x49: // constructsuper
                case 0xf1: // debugfile
                case 0xf0: // debugline
                case 0x94: // declocal
                case 0xc3: // declocal_i
                case 0x6a: // deleteproperty
                case 0x06: // dxns
                case 0x5e: // findproperty
                case 0x5d: // findpropstrict
                case 0x59: // getdescendants
                case 0x6e: // getglobalslot
                case 0x60: // getlex
                case 0x62: // getlocal
                case 0x66: // getproperty
                case 0x6c: // getslot
                case 0x04: // getsuper
                case 0x92: // inclocal
                case 0xc2: // inclocal_i
                case 0x68: // initproperty
                case 0xb2: // istype
                case 0x08: // kill
                case 0x56: // newarray
                case 0x5a: // newcatch
                case 0x58: // newclass
                case 0x40: // newfunction
                case 0x55: // newobject
                case 0x2f: // pushdouble
                case 0x2d: // pushint
                case 0x31: // pushnamespace
                case 0x25: // pushshort
                case 0x2c: // pushstring
                case 0x2e: // pushuint
                case 0x63: // setlocal
                case 0x6f: // setglobalslot
                case 0x61: // setproperty
                case 0x6d: // setslot
                case 0x05: // setsuper
                    cacheOffset = ABCBitIO.byte_offset;
                    obj.value1 = ABCBitIO.getU30();
                    offset += (ABCBitIO.byte_offset - cacheOffset);
                    break;
                case 0x1b: // lookupswitch
                    obj.value1 = ABCBitIO.getSI24();
                    offset += 3;
                    cacheOffset = ABCBitIO.byte_offset;
                    obj.value2 = ABCBitIO.getSI24();
                    offset += (ABCBitIO.byte_offset - cacheOffset);
                    obj.value3 = ABCBitIO.getSI24();
                    offset += 3;
                    break;
                case 0x65: // getscopeobject
                case 0x24: // pushbyte
                    obj.value1 = ABCBitIO.getSI8();
                    offset += 1;
                    break;
                case 0x32: // hasnext2
                    obj.value1 = ABCBitIO.getSI8();
                    obj.value2 = ABCBitIO.getSI8();
                    offset += 2;
                    break;
                case 0x13: // ifeq
                case 0x12: // iffalse
                case 0x18: // ifge
                case 0x17: // ifgt
                case 0x16: // ifle
                case 0x15: // iflt
                case 0x0f: // ifnge
                case 0x0e: // ifngt
                case 0x0d: // ifnle
                case 0x0c: // ifnlt
                case 0x14: // ifne
                case 0x19: // ifstricteq
                case 0x1a: // ifstrictne
                case 0x11: // iftrue
                case 0x10: // jump
                    obj.value1 = ABCBitIO.getSI24();
                    offset += 3;
                    break;
                case 0x43: // callmethod
                case 0x46: // callproperty
                case 0x4c: // callproplex
                case 0x4f: // callpropvoid
                case 0x44: // callstatic
                case 0x45: // callsuper
                case 0x4e: // callsupervoid
                case 0x4a: // constructprop
                case 0xef: // debug
                    cacheOffset = ABCBitIO.byte_offset;
                    obj.value1 = ABCBitIO.getU30();
                    obj.value2 = ABCBitIO.getU30();
                    offset += (ABCBitIO.byte_offset - cacheOffset);
                    break;
            }

            obj.offset = offset;
            array[i] = obj;

            i += offset;
        }
        return array;
    };

    /**
     * @param ABCBitIO
     * @returns {{}}
     */
    SwfTag.prototype.ABCException = function (ABCBitIO)
    {
        var obj = {};
        obj.from = ABCBitIO.getU30();
        obj.to = ABCBitIO.getU30();
        obj.target = ABCBitIO.getU30();
        obj.excType = ABCBitIO.getU30();
        obj.varName = ABCBitIO.getU30();
        return obj;
    };

    /**
     * @param ABCBitIO
     * @returns {Array}
     */
    SwfTag.prototype.ABCTrait = function (ABCBitIO)
    {
        var count = ABCBitIO.getU30();
        var trait = [];
        if (count) {
            for (var i = 0; i < count; i++) {
                var tObj = {};
                tObj.name = ABCBitIO.getU30();
                var tag = ABCBitIO.getUI8();
                var kind = tag & 0x0f;
                var attributes = (kind >> 4) & 0x0f;

                var data = {};
                switch (kind) {
                    default:
                        console.log("ERROR:"+ kind);
                        break;
                    case 0: // Trait_Slot
                    case 6: // Trait_Const
                        data.id = ABCBitIO.getU30();
                        data.name = ABCBitIO.getU30();
                        data.index = ABCBitIO.getU30();
                        data.kind = null;
                        if (data.index !== 0) {
                            data.kind = ABCBitIO.getUI8();
                        }
                        break;
                    case 1: // Trait_Method
                    case 2: // Trait_Getter
                    case 3: // Trait_Setter
                        data.id = ABCBitIO.getU30();
                        data.info = ABCBitIO.getU30();
                        break;
                    case 4: // Trait_Class
                        data.id = ABCBitIO.getU30();
                        data.info = ABCBitIO.getU30();
                        break;
                    case 5: // Trait_Function
                        data.id = ABCBitIO.getU30();
                        data.info = ABCBitIO.getU30();
                        break;
                }
                tObj.kind = kind;
                tObj.data = data;

                if (attributes & 0x04) {
                    var metadataCount = ABCBitIO.getU30();
                    var metadata = [];
                    if (metadataCount) {
                        for (var j = 0; j < metadataCount; j++) {
                            metadata[metadata.length] = ABCBitIO.getU30();
                        }
                    }
                    tObj.metadata = metadata;
                }

                trait[trait.length] = tObj;
            }
        }

        return trait;
    };

    /**
     * parseSymbolClass
     */
    SwfTag.prototype.parseSymbolClass = function ()
    {
        var bitio = this.bitio;
        var stage = this.stage;
        var symbols = stage.symbols;
        var count = bitio.getUI16();
        if (count) {
            while (count--) {
                var tagId = bitio.getUI16();
                symbols[tagId] = bitio.getDataUntil("\0");
            }
        }
    };

    /**
     * @param tagType
     * @param length
     */
    SwfTag.prototype.parseDefineSound = function (tagType, length)
    {
        var obj = {};
        var _this = this;
        var bitio = _this.bitio;
        var stage = _this.stage;
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
        var SoundData = "";
        for (var i = 0; i < dataLength; i++) {
            SoundData += _fromCharCode(data[i]);
        }
        bitio.byte_offset = startOffset + length;

        var mimeType = "";
        switch (obj.SoundFormat) {
            case 0: // Uncompressed native-endian
            case 3: // Uncompressed little-endian
                mimeType = "wave";
                break;
            case 1: // ADPCM ? 32KADPCM
                mimeType = "wave";
                break;
            case 2: // MP3
                mimeType = "mpeg";
                break;
            case 4: // Nellymoser 16
            case 5: // Nellymoser 8
            case 6: //
                mimeType = "nellymoser";
                break;
            case 11: // Speex
                mimeType = "speex";
                break;
            case 15:
                mimeType = "x-aiff";
                break;
        }

        obj.base64 = "data:audio/" + mimeType + ";base64," + window.btoa(SoundData);
        stage.sounds[obj.SoundId] = obj;
    };

    /**
     * @param tagType
     */
    SwfTag.prototype.parseStartSound = function (tagType)
    {
        var _this = this;
        var bitio = _this.bitio;
        var obj = {};
        var stage = _this.stage;

        obj.tagType = tagType;
        obj.SoundId = bitio.getUI16();
        if (tagType === 89) {
            obj.SoundClassName = bitio.getDataUntil("\0");
        }

        obj.SoundInfo = _this.parseSoundInfo();
        stage.setCharacter(obj.SoundId, obj);

        var sound = stage.sounds[obj.SoundId];
        var audio = _document.createElement("audio");
        audio.onload = function ()
        {
            this.load();
            this.preload = "auto";
            this.autoplay = false;
            this.loop = false;
        };
        audio.src = sound.base64;

        var loadSounds = stage.loadSounds;
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
    SwfTag.prototype.parseDefineButtonSound = function ()
    {
        var _this = this;
        var bitio = _this.bitio;
        var stage = _this.stage;
        var buttonId = bitio.getUI16();
        var btnObj = stage.getCharacter(buttonId);
        for (var i = 0; i < 4; i++) {
            var soundId = bitio.getUI16();
            if (soundId) {
                var soundInfo = _this.parseSoundInfo();
                switch (i) {
                    case 0:
                        btnObj.ButtonStateUpSoundInfo = soundInfo;
                        btnObj.ButtonStateUpSoundId = soundId;
                        break;
                    case 1:
                        btnObj.ButtonStateOverSoundInfo = soundInfo;
                        btnObj.ButtonStateOverSoundId = soundId;
                        break;
                    case 2:
                        btnObj.ButtonStateDownSoundInfo = soundInfo;
                        btnObj.ButtonStateDownSoundId = soundId;
                        break;
                    case 3:
                        btnObj.ButtonStateHitTestSoundInfo = soundInfo;
                        btnObj.ButtonStateHitTestSoundId = soundId;
                        break;
                }
            }
        }
        stage.setCharacter(buttonId, btnObj);
    };

    /**
     * @returns {{}}
     */
    SwfTag.prototype.parseSoundInfo = function ()
    {
        var obj = {};
        var bitio = this.bitio;
        bitio.getUIBits(2); // Reserved
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
     */
    SwfTag.prototype.parseDefineFontAlignZones = function ()
    {
        var _this = this;
        var bitio = _this.bitio;
        var stage = _this.stage;
        var FontId = bitio.getUI16();
        var tag = stage.getCharacter(FontId);
        tag.CSMTableHint = bitio.getUIBits(2);
        bitio.getUIBits(6); // Reserved
        var NumGlyphs = tag.NumGlyphs;
        var ZoneTable = [];
        for (var i = 0; i < NumGlyphs; i++) {
            var NumZoneData = bitio.getUI8();
            var ZoneData = [];
            for (var idx = 0; idx < NumZoneData; idx++) {
                ZoneData[idx] = bitio.getUI32();
            }
            ZoneTable[i] = {
                ZoneData: ZoneData,
                Mask: bitio.getUI8()
            };
        }

        bitio.byteAlign();
        tag.ZoneTable = ZoneTable;
        stage.setCharacter(FontId, tag);
    };

    /**
     * @param tagType
     */
    SwfTag.prototype.parseCSMTextSettings = function (tagType)
    {
        var _this = this;
        var obj = {};
        var bitio = _this.bitio;
        obj.tagType = tagType;
        obj.TextID = bitio.getUI16();
        obj.UseFlashType = bitio.getUIBits(2);
        obj.GridFit = bitio.getUIBits(3);
        bitio.getUIBits(3); // Reserved
        obj.Thickness = bitio.getUI32();
        obj.Sharpness = bitio.getUI32();
        bitio.getUI8(); // Reserved
    };

    /**
     * @param tagType
     * @param length
     */
    SwfTag.prototype.parseSoundStreamBlock = function (tagType, length)
    {
        var _this = this;
        var bitio = _this.bitio;
        var obj = {};
        obj.tagType = tagType;
        obj.compressed = bitio.getData(length);
    };

    /**
     * @param tagType
     */
    SwfTag.prototype.parseDefineVideoStream = function (tagType)
    {
        var _this = this;
        var bitio = _this.bitio;
        var stage = _this.stage;
        var obj = {};
        obj.tagType = tagType;
        obj.CharacterId = bitio.getUI16();
        obj.NumFrames = bitio.getUI16();
        obj.Width = bitio.getUI16();
        obj.Height = bitio.getUI16();
        bitio.getUIBits(4); // Reserved
        obj.VideoFlagsDeblocking = bitio.getUIBits(3);
        obj.VideoFlagsSmoothing = bitio.getUIBits(1);
        obj.CodecID = bitio.getUI8();
        stage.setCharacter(obj.CharacterId, obj);
        console.log(obj);
    };

    /**
     *
     * @param tagType
     * @param length
     */
    SwfTag.prototype.parseVideoFrame = function (tagType, length)
    {
        var _this = this;
        var bitio = _this.bitio;
        var stage = _this.stage;
        var startOffset = bitio.byte_offset;
        var obj = {};
        obj.tagType = tagType;
        obj.StreamID = bitio.getUI16();
        obj.FrameNum = bitio.getUI16();
        var StreamData = stage.getCharacter(obj.StreamID);
        var sub = bitio.byte_offset - startOffset;
        var dataLength = length - sub;
        var VideoData;
        switch (StreamData.CodecID) {
            case 4:
                VideoData = _this.parseVp6SwfVideoPacket(dataLength);
                break;
        }

        bitio.byte_offset = startOffset + length;

        // obj.base64 = 'data:image/jpeg;base64,' + window.btoa(VideoData);
        stage.videos[obj.StreamID] = obj;
    };

    /**
     * @param length
     * @returns {string}
     */
    SwfTag.prototype.parseVp6SwfVideoPacket = function (length)
    {
        var _this = this;
        var bitio = _this.bitio;
        var VideoData = "";
        var data = bitio.getData(length);

        console.log(data);

        return VideoData;
    };

    /**
     * parseFileAttributes
     */
    SwfTag.prototype.parseFileAttributes = function ()
    {
        var _this = this;
        var bitio = _this.bitio;
        var obj = {};
        bitio.getUIBit(); // Reserved
        obj.UseDirectBlit = bitio.getUIBit();
        obj.UseGPU = bitio.getUIBit();
        obj.HasMetadata = bitio.getUIBit();
        obj.ActionScript3 = bitio.getUIBit();
        obj.Reserved2 = bitio.getUIBits(3);
        obj.UseNetwork = bitio.getUIBit();
        obj.Reserved3 = bitio.getUIBits(24);
    };

    /**
     * parseDefineScalingGrid
     */
    SwfTag.prototype.parseDefineScalingGrid = function ()
    {
        var _this = this;
        var bitio = _this.bitio;
        var obj = {};
        obj.CharacterId = bitio.getUI16();
        obj.Splitter = _this.rect();
    };

    /**
     * @constructor
     */
    var Activation = function () {};


    /**
     * @param data
     * @param id
     * @param ns
     * @param stage
     * @constructor
     */
    var ActionScript3 = function (data, id, ns, stage)
    {
        var _this = this;

        // params
        _this.id = id;
        _this.caller = null;
        _this.parent = null;
        _this.activation = null;
        _this.scopeStack = [];
        _this.currentIndex = 0;
        _this.stage = stage;
        _this.args = [];
        _this.variables = {};

        // ABC code and info
        var methodBody = data.methodBody[id];
        _this.body = methodBody;
        _this.codes = methodBody.codes;
        _this.info = data.method[methodBody.method];

        // pool and data
        _this.names = data.names;
        _this.data = data;

        // ns
        _this.ns = ns;

        // register
        _this.AVM2 = _this.getAVM2();
        _this.register = _this.AVM2["__swf2js__:"+ns].register;
        _this.register[0] = _this.AVM2;

        // trait
        var trait = methodBody.trait;
        var length = trait.length;
        for (var i = 0; i < length; i++) {
            var obj = trait[i];
            var kind = obj.kind;
            switch (kind) {
                case 0:
                    // var key = _this.names[obj.name];

                    break;
            }
        }
    };

    /**
     * @type {{}}
     */
    ActionScript3.prototype.methods = {
        gotoAndStop: 1,
        gotoAndPlay: 1,
        play: 1,
        stop: 1,
        duplicateMovieClip: 1,
        getProperty: 1,
        removeMovieClip: 1,
        setProperty: 1,
        startDrag: 1,
        stopDrag: 1,
        targetPath: 1,
        updateAfterEvent: 1,
        nextFrame: 1,
        nextScene: 1,
        prevFrame: 1,
        prevScene: 1,
        stopAllSounds: 1,
        setMask: 1,
        getURL: 1,
        loadMovie: 1,
        loadMovieNum: 1,
        loadVariables: 1,
        loadVariablesNum: 1,
        unloadMovie: 1,
        unloadMovieNum: 1,
        swapDepths: 1,
        getInstanceAtDepth: 1,
        attachMovie: 1,
        attachAudio: 1,
        attachBitmap: 1,
        getNextHighestDepth: 1,
        getBytesLoaded: 1,
        getBytesTotal: 1,
        ASSetPropFlags: 1,
        lineStyle: 1,
        lineGradientStyle: 1,
        beginFill: 1,
        beginGradientFill: 1,
        beginBitmapFill: 1,
        graphics: 1,
        buttonMode: 1,
        clear: 1,
        moveTo: 1,
        lineTo: 1,
        curveTo: 1,
        endFill: 1,
        hitTest: 1,
        getDepth: 1,
        createEmptyMovieClip: 1,
        createTextField: 1,
        getBounds: 1,
        getRect: 1,
        getSWFVersion: 1,
        getTextSnapshot: 1,
        globalToLocal: 1,
        localToGlobal: 1,
        addFrameScript: 1,
        trace: 1,
        addEventListener: 1,
        removeEventListener: 1,
        x: 1,
        y: 1,
        alpha: 1,
        name: 1,
        blendMode: 1,
        filters: 1,
        visible: 1,
        rotation: 1,
        height: 1,
        width: 1,
        scaleX: 1,
        scaleY: 1,
        mouseX: 1,
        mouseY: 1,
        mask: 1,
        mouseEnabled: 1
    };

    /**
     * @returns {*}
     */
    ActionScript3.prototype.getAVM2 = function ()
    {
        var _this = this;
        var ns = _this.ns;
        var stage = _this.stage;
        var values = ns.split(":");
        var className = values.pop();
        var nLen = values.length;
        var classObj = stage.avm2;
        for (var i = 0; i < nLen; i++) {
            classObj = classObj[values[i]];
        }
        return classObj[className];
    };

    /**
     * @returns {*}
     */
    ActionScript3.prototype.getBuilder = function ()
    {
        return this.AVM2["__swf2js__::builder"];
    };

    /**
     * @returns {*}
     */
    ActionScript3.prototype.getSuperClass = function ()
    {
        var _this = this;
        return _this.AVM2["__swf2js__:"+_this.ns].superClass;
    };

    /**
     * @param superClass
     */
    ActionScript3.prototype.setSuperClass = function (superClass)
    {
        var _this = this;
        _this.AVM2["__swf2js__:"+_this.ns].superClass = superClass;
    };

    /**
     * @returns {*}
     */
    ActionScript3.prototype.getParent = function ()
    {
        return this.parent;
    };

    /**
     * @param name
     * @returns {*}
     */
    ActionScript3.prototype.getProperty = function (name)
    {
        var _this = this;
        var stage = _this.stage;
        var value;

        // local1
        if (_this.activation) {
            value = _this.activation[name];
        }

        // parent
        if (value === undefined) {
            var parent = _this.getParent();
            if (parent) {
                value = parent.getProperty(name);
            }
        }

        // property
        if (value === undefined) {
            var builder = _this.getBuilder();
            if (builder) {
                if (name in _this.methods) {
                    value = builder[name];
                }
                if (value === undefined) {
                    value = builder.getProperty(name);
                }
            }
        }

        // local2
        if (value === undefined && name.indexOf("::") !== -1) {
            var values = name.split("::");
            var className = values.pop();
            var path = values.pop();
            if (path !== "private") {
                var pathArr = path.split(".");
                var pLen = pathArr.length;
                var classObj = stage.avm2;
                for (var pIdx = 0; pIdx < pLen; pIdx++) {
                    classObj = classObj[pathArr[pIdx]];
                }
                value = classObj[className];

                if (value === undefined) {
                    value = _this.AVM2[className];
                }
            } else {
                value = _this.AVM2["private::"+ className];
            }
        }

        // global
        if (value === undefined) {
            value = stage.avm2[name];
        }

        return value;
    };

    /**
     * setOptions
     */
    ActionScript3.prototype.setOptions = function ()
    {
        var _this = this;
        var info = _this.info;
        var paramCount = info.paramCount;
        if (paramCount) {
            var data = _this.data;
            var options = info.options;
            var paramType = info.paramType;
            var stage = _this.stage;

            for (var i = 0; i < paramCount; i++) {
                var value = undefined;

                if (i in options) {
                    var option = options[i];
                    var val = option.val;
                    switch (option.kind) {
                        case 0x01: // string
                            value = data.string[val];
                            break;
                        default:
                            console.log("options", option);
                            break;
                    }
                }

                if (i in paramType) {
                    var pType = paramType[i];
                    if (pType) {
                        var mName = data.multiname_info[pType];
                        var className = null;
                        var path = "";
                        switch (mName.kind) {
                            case 0x07: // QName
                                var ns = data.namespace[mName.ns];
                                switch (ns.kind) {
                                    case 0x16:
                                        path = data.string[ns.name];
                                        break;
                                    default:
                                        console.log("SetOptions", ns);
                                        break;
                                }

                                className = data.string[mName.name];
                                break;
                        }

                        if (path) {
                            var values = path.split(".");
                            var pLen = values.length;
                            var classObj = stage.avm2;
                            for (var idx = 0; idx < pLen; idx++) {
                                classObj = classObj[values[idx]];
                            }
                            value = classObj[className];
                        }
                    }
                }

                if (_this.args[i] === undefined) {
                    _this.args[i] = value;
                }
            }
        }
    };

    /**
     * execute
     */
    ActionScript3.prototype.execute = function ()
    {
        var _this = this;
        var stack = [];
        _this.scopeStack = [];

        var i = 0;
        var offset = 0;
        var codes = _this.codes;
        var length = codes.length;

        _this.setOptions();

        while(i < length) {
            var obj = codes[i];
            switch (obj.code) {
                case 0xa0:
                    _this.ActionAdd(stack);
                    break;
                case 0xc5:
                    _this.ActionAddI(stack);
                    break;
                case 0x86:
                    _this.ActionAsType(stack, obj.value1);
                    break;
                case 0x87:
                    _this.ActionAsTypeLate(stack);
                    break;
                case 0xa8:
                    _this.ActionBitAnd(stack);
                    break;
                case 0x97:
                    _this.ActionBitNot(stack);
                    break;
                case 0xa9:
                    _this.ActionBitOr(stack);
                    break;
                case 0xaa:
                    _this.ActionBitXOr(stack);
                    break;
                case 0x41:
                    _this.ActionCall(stack, obj.value1);
                    break;
                case 0x43:
                    _this.ActionCallMethod(stack, obj.value1, obj.value2);
                    break;
                case 0x46:
                    _this.ActionCallProperty(stack, obj.value1, obj.value2);
                    break;
                case 0x4c:
                    _this.ActionCallPropLex(stack, obj.value1, obj.value2);
                    break;
                case 0x4f:
                    _this.ActionCallPropVoid(stack, obj.value1, obj.value2);
                    break;
                case 0x44:
                    _this.ActionCallStatic(stack, obj.value1, obj.value2);
                    break;
                case 0x45:
                    _this.ActionCallSuper(stack, obj.value1, obj.value2);
                    break;
                case 0x4e:
                    _this.ActionCallSuperVoid(stack, obj.value1, obj.value2);
                    break;
                case 0x78:
                    _this.ActionCheckFilter(stack);
                    break;
                case 0x80:
                    _this.ActionCoerce(stack, obj.value1);
                    break;
                case 0x82:
                    _this.ActionCoerceA(stack);
                    break;
                case 0x85:
                    _this.ActionCoerceS(stack);
                    break;
                case 0x42:
                    _this.ActionConstruct(stack, obj.value1);
                    break;
                case 0x4a:
                    _this.ActionConstructProp(stack, obj.value1, obj.value2);
                    break;
                case 0x49:
                    _this.ActionConstructSuper(stack, obj.value1);
                    break;
                case 0x76:
                    _this.ActionConvertB(stack);
                    break;
                case 0x73:
                    _this.ActionConvertI(stack);
                    break;
                case 0x75:
                    _this.ActionConvertD(stack);
                    break;
                case 0x77:
                    _this.ActionConvertO(stack);
                    break;
                case 0x74:
                    _this.ActionConvertU(stack);
                    break;
                case 0x70:
                    _this.ActionConvertS(stack);
                    break;
                case 0xef:
                    _this.ActionDebug(stack, obj.value1, obj.value2, obj.value3, obj.value4);
                    break;
                case 0xf1:
                    _this.ActionDebugFile(stack, obj.value1);
                    break;
                case 0xf0:
                    _this.ActionDebugLine(stack);
                    break;
                case 0x94:
                    _this.ActionDecLocal(stack, obj.value1);
                    break;
                case 0xc3:
                    _this.ActionDecLocalI(stack, obj.value1);
                    break;
                case 0x93:
                    _this.ActionDecrement(stack);
                    break;
                case 0xc1:
                    _this.ActionDecrementI(stack);
                    break;
                case 0x6a:
                    _this.ActionDeleteProperty(stack, obj.value1);
                    break;
                case 0xa3:
                    _this.ActionDivide(stack);
                    break;
                case 0x2a:
                    _this.ActionDup(stack);
                    break;
                case 0x06:
                    _this.ActionDxns(stack, obj.value1);
                    break;
                case 0x07:
                    _this.ActionDxnsLate(stack);
                    break;
                case 0xab:
                    _this.ActionEquals(stack);
                    break;
                case 0x72:
                    _this.ActionEscXAttr(stack);
                    break;
                case 0x71:
                    _this.ActionEscXElem(stack);
                    break;
                case 0x5e:
                    _this.ActionFindProperty(stack, obj.value1);
                    break;
                case 0x5d:
                    _this.ActionFindPropStrict(stack, obj.value1);
                    break;
                case 0x59:
                    _this.ActionGetDescendAnts(stack, obj.value1);
                    break;
                case 0x64:
                    _this.ActionGetGlobalScope(stack);
                    break;
                case 0x6e:
                    _this.ActionGetGlobalsLot(stack, obj.value1);
                    break;
                case 0x60:
                    _this.ActionGetLex(stack, obj.value1);
                    break;
                case 0x62:
                    _this.ActionGetLocal(stack, obj.value1);
                    break;
                case 0xd0:
                    _this.ActionGetLocal0(stack);
                    break;
                case 0xd1:
                    _this.ActionGetLocal1(stack);
                    break;
                case 0xd2:
                    _this.ActionGetLocal2(stack);
                    break;
                case 0xd3:
                    _this.ActionGetLocal3(stack);
                    break;
                case 0x66:
                    _this.ActionGetProperty(stack, obj.value1);
                    break;
                case 0x65:
                    _this.ActionGetScopeObject(stack, obj.value1);
                    break;
                case 0x6c:
                    _this.ActionGetSlot(stack, obj.value1);
                    break;
                case 0x04:
                    _this.ActionGetSuper(stack, obj.value1);
                    break;
                case 0xb0:
                    _this.ActionGreaterEquals(stack);
                    break;
                case 0xaf:
                    _this.ActionGreaterThan(stack);
                    break;
                case 0x1f:
                    _this.ActionHasNext(stack);
                    break;
                case 0x32:
                    _this.ActionHasNext2(stack, obj.value1, obj.value2);
                    break;
                case 0x12:
                    offset = _this.ActionIfFalse(stack, obj.value1);
                    i += offset;
                    break;
                case 0x18:
                    offset = _this.ActionIfGe(stack, obj.value1);
                    i += offset;
                    break;
                case 0x17:
                    offset = _this.ActionIfGt(stack, obj.value1);
                    i += offset;
                    break;
                case 0x16:
                    offset = _this.ActionIfLe(stack, obj.value1);
                    i += offset;
                    break;
                case 0x15:
                    offset = _this.ActionIfLt(stack, obj.value1);
                    i += offset;
                    break;
                case 0x0f:
                    offset = _this.ActionIfNge(stack, obj.value1);
                    i += offset;
                    break;
                case 0x0e:
                    offset = _this.ActionIfNgt(stack, obj.value1);
                    i += offset;
                    break;
                case 0x0d:
                    offset = _this.ActionIfNle(stack, obj.value1);
                    i += offset;
                    break;
                case 0x0c:
                    offset = _this.ActionIfNlt(stack, obj.value1);
                    i += offset;
                    break;
                case 0x14:
                    offset = _this.ActionIfNe(stack, obj.value1);
                    i += offset;
                    break;
                case 0x19:
                    offset = _this.ActionIfStrictEq(stack, obj.value1);
                    i += offset;
                    break;
                case 0x1a:
                    offset = _this.ActionIfStrictNe(stack, obj.value1);
                    i += offset;
                    break;
                case 0x11:
                    offset = _this.ActionIfTrue(stack, obj.value1);
                    i += offset;
                    break;
                case 0xb4:
                    _this.ActionIn(stack, obj.value1);
                    break;
                case 0x92:
                    _this.ActionIncLocal(stack, obj.value1);
                    break;
                case 0xc2:
                    _this.ActionIncLocalI(stack, obj.value1);
                    break;
                case 0x91:
                    _this.ActionIncrement(stack);
                    break;
                case 0xc0:
                    _this.ActionIncrementI(stack);
                    break;
                case 0x68:
                    _this.ActionInitProperty(stack, obj.value1);
                    break;
                case 0xb1:
                    _this.ActionInstanceOf(stack);
                    break;
                case 0xb2:
                    _this.ActionIsType(stack, obj.value1);
                    break;
                case 0xb3:
                    _this.ActionIsTypeLate(stack);
                    break;
                case 0x10: // ActionJump
                    offset = obj.value1;
                    i += offset;
                    break;
                case 0x08:
                    _this.ActionKill(stack, obj.value1);
                    break;
                case 0x09:
                    _this.ActionLabel(stack);
                    break;
                case 0xae:
                    _this.ActionLessEquals(stack);
                    break;
                case 0xad:
                    _this.ActionLessThan(stack);
                    break;
                case 0x1b:
                    _this.ActionLookupSwitch(stack, obj.value1, obj.value1, obj.value3);
                    break;
                case 0xa5:
                    _this.ActionLShift(stack);
                    break;
                case 0xa4:
                    _this.ActionModulo(stack);
                    break;
                case 0xa2:
                    _this.ActionMultiply(stack);
                    break;
                case 0xc7:
                    _this.ActionMultiplyI(stack);
                    break;
                case 0x90:
                    _this.ActionNeGate(stack);
                    break;
                case 0xc4:
                    _this.ActionNeGateI(stack);
                    break;
                case 0x57:
                    _this.ActionNewActivation(stack);
                    break;
                case 0x56:
                    _this.ActionNewArray(stack, obj.value1);
                    break;
                case 0x5a:
                    _this.ActionNewCatch(stack, obj.value1);
                    break;
                case 0x58:
                    _this.ActionNewClass(stack, obj.value1);
                    break;
                case 0x40:
                    _this.ActionNewFunction(stack, obj.value1);
                    break;
                case 0x55:
                    _this.ActionNewObject(stack, obj.value1);
                    break;
                case 0x1e:
                    _this.ActionNextName(stack);
                    break;
                case 0x23:
                    _this.ActionNextValue(stack);
                    break;
                case 0x02:
                    _this.ActionNop(stack);
                    break;
                case 0x96:
                    _this.ActionNot(stack);
                    break;
                case 0x29:
                    _this.ActionPop(stack);
                    break;
                case 0x1d:
                    _this.ActionPopScope();
                    break;
                case 0x24:
                    _this.ActionPushByte(stack, obj.value1);
                    break;
                case 0x2f:
                    _this.ActionPushDouble(stack, obj.value1);
                    break;
                case 0x27:
                    _this.ActionPushFalse(stack, obj.value1);
                    break;
                case 0x2d:
                    _this.ActionPushInt(stack, obj.value1);
                    break;
                case 0x31:
                    _this.ActionPushNameSpace(stack, obj.value1);
                    break;
                case 0x28:
                    _this.ActionPushNan(stack);
                    break;
                case 0x20:
                    _this.ActionPushNull(stack);
                    break;
                case 0x30:
                    _this.ActionPushScope(stack);
                    break;
                case 0x25:
                    _this.ActionPushShort(stack, obj.value1);
                    break;
                case 0x2c:
                    _this.ActionPushString(stack, obj.value1);
                    break;
                case 0x26:
                    _this.ActionPushTrue(stack);
                    break;
                case 0x2e:
                    _this.ActionPushUInt(stack, obj.value1);
                    break;
                case 0x21:
                    _this.ActionPushUndefined(stack);
                    break;
                case 0x1c:
                    _this.ActionPushWith(stack);
                    break;
                case 0x48: // ActionReturnValue
                    return stack.pop();
                case 0x47: // ReturnVoid
                    return undefined;
                case 0xa6:
                    _this.ActionRShift(stack);
                    break;
                case 0x63:
                    _this.ActionSetLocal(stack, obj.value1);
                    break;
                case 0xd4:
                    _this.ActionSetLocal0(stack);
                    break;
                case 0xd5:
                    _this.ActionSetLocal1(stack);
                    break;
                case 0xd6:
                    _this.ActionSetLocal2(stack);
                    break;
                case 0xd7:
                    _this.ActionSetLocal3(stack);
                    break;
                case 0x6f:
                    _this.ActionSetGlobalSlot(stack, obj.value1);
                    break;
                case 0x61:
                    _this.ActionSetProperty(stack, obj.value1);
                    break;
                case 0x6d:
                    _this.ActionSetSlot(stack, obj.value1);
                    break;
                case 0x05:
                    _this.ActionSetSuper(stack, obj.value1);
                    break;
                case 0xac:
                    _this.ActionStrictEquals(stack);
                    break;
                case 0xa1:
                    _this.ActionSubtract(stack);
                    break;
                case 0xc6:
                    _this.ActionSubtractI(stack);
                    break;
                case 0x2b:
                    _this.ActionSwap(stack);
                    break;
                case 0x03:
                    _this.ActionThrow(stack);
                    break;
                case 0x95:
                    _this.ActionTypeof(stack);
                    break;
                case 0xa7:
                    _this.ActionURShift(stack);
                    break;
            }

            i += obj.offset;
            i += 1;
        }
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionAdd = function (stack)
    {
        var value2 = stack.pop();
        var value1 = stack.pop();
        stack[stack.length] = value1 + value2;
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionAddI = function (stack)
    {
        var value2 = +stack.pop();
        var value1 = +stack.pop();
        stack[stack.length] = value1 + value2;
    };

    /**
     * @param stack
     * @param index
     */
    ActionScript3.prototype.ActionAsType = function (stack, index)
    {
        var type = this.names[index];
        var value = stack.pop();
        stack[stack.length] = (typeof value === type) ? true : null;
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionAsTypeLate = function (stack)
    {
        var cValue = stack.pop(); // class
        var value = stack.pop();
        stack[stack.length] = (typeof cValue === value) ? true : null;
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionBitAnd = function (stack)
    {
        var value2 = stack.pop();
        var value1 = stack.pop();
        stack[stack.length] = value1 & value2;
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionBitNot = function (stack)
    {
        var value = stack.pop();
        stack[stack.length] = ~value;
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionBitOr = function (stack)
    {
        var value2 = stack.pop();
        var value1 = stack.pop();
        stack[stack.length] = value1 | value2;
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionBitXOr = function (stack)
    {
        var value2 = stack.pop();
        var value1 = stack.pop();
        stack[stack.length] = value1 ^ value2;
    };

    /**
     * @param stack
     * @param argCount
     */
    ActionScript3.prototype.ActionCall = function (stack, argCount)
    {
        var params = [];
        for (var i = argCount; i--;) {
            params[i] = stack.pop();
        }
        var receiver = stack.pop();
        var func = stack.pop();

        var value;
        if (typeof func === "function") {
            value = func.apply(receiver, params);
        }
        stack[stack.length] = value;
    };

    /**
     * @param stack
     * @param index
     * @param argCount
     */
    ActionScript3.prototype.ActionCallMethod = function (stack, index, argCount)
    {
        var params = [];
        for (var i = 0; i < argCount; i++) {
            params[params.length] = stack.pop();
        }
        var receiver = stack.pop();
        var value;
        if (typeof receiver === "function") {
            value = receiver.apply(this.caller, params);
        }
        stack[stack.length] = value;
    };

    /**
     * @param stack
     * @param index
     * @param argCount
     */
    ActionScript3.prototype.ActionCallProperty = function (stack, index, argCount)
    {
        var _this = this;
        var params = [];
        for (var i = argCount; i--;) {
            params[params.length] = stack.pop();
        }
        var prop = _this.names[index];
        var obj = stack.pop();

        var value;
        if (obj) {
            var func = null;
            if (obj instanceof DisplayObject) {
                if (prop in _this.methods) {
                    func = obj[prop];
                }

                if (!func) {
                    func = obj.getProperty(prop);
                }
            } else {
                func = obj[prop];
            }

            if (func) {
                value = func.apply(_this.caller, params);
            }
        }

        stack[stack.length] = value;
    };

    /**
     * @param stack
     * @param index
     * @param argCount
     */
    ActionScript3.prototype.ActionCallPropLex = function (stack, index, argCount)
    {
        var _this = this;
        var params = [];
        for (var i = argCount; i--;) {
            params[params.length] = stack.pop();
        }

        var prop = _this.names[index];
        var obj = stack.pop();

        var value;
        if (obj) {
            value = obj[prop].apply(_this.getBuilder(), params);
        }
        stack[stack.length] = value;
    };

    /**
     * @param stack
     * @param index
     * @param argCount
     */
    ActionScript3.prototype.ActionCallPropVoid = function (stack, index, argCount)
    {
        var _this = this;
        var params = [];
        for (var i = argCount; i--;) {
            params[i] = stack.pop();
        }

        var obj = stack.pop();
        var name = _this.names[index];

        var values = name.split("::"); // implements
        var prop = values.pop();
        var ns = values.pop();
        if (ns) {
            // console.log(ns, obj, prop);
        }

        var func = obj[prop];
        if (!func && obj instanceof MovieClip) {
            var stage = obj.getStage();
            var symbol = stage.symbols[obj.getCharacterId()];
            if (symbol) {
                var names = symbol.split(".");
                var classMethod = names.pop();
                var length = names.length;
                var classObj = stage.avm2;
                for (i = 0; i < length; i++) {
                    classObj = classObj[names[i]];
                }

                if (classObj) {
                    var AVM2 = classObj[classMethod];
                    while (true) {
                        func = AVM2[prop];
                        if (func) {
                            break;
                        }
                        AVM2 = AVM2.super;
                        if (!AVM2 || AVM2 instanceof MovieClip) {
                            break;
                        }
                    }
                }
            }
        }

        if (!func) {
            while (true) {
                var SuperClass = obj.super;
                if (!SuperClass) {
                    break;
                }

                if (SuperClass instanceof MovieClip) {
                    obj = _this.caller;
                    func = obj[prop];
                    break;
                }

                func = SuperClass[prop];
                if (func) {
                    break;
                }

                obj = SuperClass;
            }
        }

        // fscommand
        if (prop === "fscommand") {
            obj = _this.stage;
        }

        if (func) {
            func.apply(obj, params);
        }
    };

    /**
     * @param stack
     * @param index
     * @param argCount
     */
    ActionScript3.prototype.ActionCallStatic = function (stack, index, argCount)
    {
        console.log("ActionCallStatic");
        var params = [];
        for (var i = argCount; i--;) {
            params[params.length] = stack.pop();
        }
        var receiver = stack.pop();
        var value;
        stack[stack.length] = value;
    };

    /**
     * @param stack
     * @param index
     * @param argCount
     */
    ActionScript3.prototype.ActionCallSuper = function (stack, index, argCount)
    {
        var params = [];
        for (var i = argCount; i--;) {
            params[params.length] = stack.pop();
        }
        var porp = this.names[index];
        var receiver = stack.pop();

    };

    /**
     * @param stack
     * @param index
     * @param argCount
     */
    ActionScript3.prototype.ActionCallSuperVoid = function (stack, index, argCount)
    {
        var params = [];
        for (var i = argCount; i--;) {
            params[params.length] = stack.pop();
        }
        var porp = this.names[index];
        var receiver = stack.pop();
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionCheckFilter = function (stack)
    {
        var value = stack.pop();
        stack[stack.length] = value;
    };

    /**
     * @param stack
     * @param index
     */
    ActionScript3.prototype.ActionCoerce = function (stack, index)
    {
        var value = stack.pop();
        var str = this.names[index];
        stack[stack.length] = str;
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionCoerceA = function(stack)
    {
        var value = stack.pop();
        stack[stack.length] = value;
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionCoerceS = function (stack)
    {
        var value = stack.pop();
        stack[stack.length] = String(value);
    };

    /**
     * @param stack
     * @param argCount
     */
    ActionScript3.prototype.ActionConstruct = function (stack, argCount)
    {
        var params = [];
        for (var i = argCount; i--;) {
            params[params.length] = stack.pop();
        }
        var obj = stack.pop();
        stack[stack.length] = obj.construct.apply(obj, params);
    };

    /**
     * @param stack
     * @param index
     * @param argCount
     */
    ActionScript3.prototype.ActionConstructProp = function (stack, index, argCount)
    {
        var _this = this;
        var params = [];
        for (var i = argCount; i--;) {
            params[params.length] = stack.pop();
        }

        var prop = _this.names[index];
        var obj = stack.pop();

        var value;
        var stage = _this.stage;
        var DoABC = stage.abc[prop];
        if (DoABC) {
            var builder = _this.getBuilder();
            var AVM2 = new DoABC(builder);
            stage.avm2[prop] = AVM2;
            AVM2[prop].apply(builder, params);
            value = AVM2;
        } else {
            value = new (Function.prototype.bind.apply(obj[prop], params))();
        }

        stack[stack.length] = value;
    };

    /**
     * @param stack
     * @param argCount
     */
    ActionScript3.prototype.ActionConstructSuper = function (stack, argCount)
    {
        var _this = this;
        var params = [];
        for (var i = argCount; i--;) {
            params[i] = stack.pop();
        }

        var obj = stack.pop();
        var SuperClassName = obj["__swf2js__:"+_this.ns].extends;
        var values = SuperClassName.split("::");
        var prop = values.pop();
        var ns = values.pop();
        var stage = _this.stage;
        var abcObj = stage.abc;
        var avmObj = stage.avm2;

        if (ns) {
            var names = ns.split(".");
            var length = names.length;
            for (i = 0; i < length; i++) {
                abcObj = abcObj[names[i]];
                avmObj = avmObj[names[i]];
            }
        }

        var sClass = null;
        var SuperClass = abcObj[prop];
        var builder = _this.getBuilder();
        switch (SuperClass) {
            case MovieClip:
                sClass = new MovieClip();
                sClass.setStage(stage);
                sClass._extend = true;
                break;
            case Sound:
                sClass = new Sound();
                sClass.movieClip = builder;
                break;
            default:
                if (SuperClass in window) { // Object
                    sClass = new (Function.prototype.bind.apply(window[SuperClassName], params))();
                } else {
                    sClass = new SuperClass(builder);
                    avmObj[prop] = sClass;
                    sClass[prop].apply(builder, params);
                }
                break;
        }

        obj["super"] = sClass;
        obj["__swf2js__:"+_this.ns].superClass = sClass;
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionConvertB = function (stack)
    {
        var value = stack.pop();
        stack[stack.length] = (value) ? true : false;
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionConvertI = function (stack)
    {
        var value = stack.pop();
        stack[stack.length] = value|0;
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionConvertD = function (stack)
    {
        var value = stack.pop();
        stack[stack.length] = +value;
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionConvertO = function (stack)
    {
        var value = stack.pop();
        stack[stack.length] = (typeof value === "object") ? value : null;
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionConvertU = function (stack)
    {
        var value = stack.pop();
        value = value|0;
        if (value < 0) {
            value *= -1;
        }
        stack[stack.length] = value;
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionConvertS = function (stack)
    {
        var value = stack.pop();
        stack[stack.length] = String(value);
    };

    /**
     * @param stack
     * @param type
     * @param index
     * @param reg
     * @param extra
     */
    ActionScript3.prototype.ActionDebug = function (stack, type, index, reg, extra)
    {


    };

    /**
     * @param stack
     * @param index
     */
    ActionScript3.prototype.ActionDebugFile = function (stack, index)
    {


    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionDebugLine = function (stack)
    {


    };

    /**
     * @param stack
     * @param index
     */
    ActionScript3.prototype.ActionDecLocal = function (stack, index)
    {

    };

    /**
     * @param stack
     * @param index
     */
    ActionScript3.prototype.ActionDecLocalI = function (stack, index)
    {

    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionDecrement = function (stack)
    {
        var value = stack.pop();
        value -= 1;
        stack[stack.length] = value;
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionDecrementI = function (stack)
    {
        var value = stack.pop();
        value -= 1;
        stack[stack.length] = value;
    };

    /**
     * @param stack
     * @param index
     */
    ActionScript3.prototype.ActionDeleteProperty = function (stack, index)
    {
        var prop = this.name[index];
        var obj = stack.pop();
        if (obj) {
            if (prop in obj) {
                delete obj[prop];
            } else {
                // TODO
                console.log("ActionDeleteProperty");
            }
        }
        stack[stack.length] = true;
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionDivide = function (stack)
    {
        var value2 = stack.pop();
        var value1 = stack.pop();
        stack[stack.length] = value1 / value2;
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionDup = function (stack)
    {
        var value = stack.pop();
        stack[stack.length] = value;
        stack[stack.length] = value;
    };

    /**
     * @param stack
     * @param index
     */
    ActionScript3.prototype.ActionDxns = function (stack, index)
    {

    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionDxnsLate = function (stack)
    {
        var value = stack.pop();
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionEquals = function (stack)
    {
        var value2 = stack.pop();
        var value1 = stack.pop();
        stack[stack.length] = (value1 == value2);
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionEscXAttr = function (stack)
    {
        var value = stack.pop();
        stack[stack.length] = String(value);
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionEscXElem = function (stack)
    {
        var value = stack.pop();
        stack[stack.length] = String(value);
    };

    /**
     * @param stack
     * @param index
     */
    ActionScript3.prototype.ActionFindProperty = function (stack, index)
    {
        var prop = this.names[index];
        var obj;
        stack[stack.length] = obj;
    };

    /**
     * @param stack
     * @param index
     */
    ActionScript3.prototype.ActionFindPropStrict = function (stack, index)
    {
        var _this = this;
        var name = _this.names[index];
        var values = name.split("::");
        var prop = values.pop();
        var ns = values.pop();
        var obj = null;

        // caller
        var caller = _this.caller;
        if (caller && !(caller instanceof MovieClip)) {
            if (name in caller) {
                obj = caller;
            }
        }

        if (!obj) {
            var AVM2 = _this.AVM2;
            if (ns) {
                var names = ns.split(".");
                var length = names.length;
                if (length > 1) {
                    var avmObj = _this.stage.avm2;
                    for (var i = 0; i < length; i++) {
                        avmObj = avmObj[names[i]];
                    }
                    AVM2 = avmObj;
                }
            }

            // local
            if (prop in AVM2) {
                obj = AVM2;
            }
        }

        // find avm
        if (!obj) {
            var avm2s = _this.stage.avm2;
            if (prop in avm2s) {
                obj = avm2s[prop];
            }
        }

        // builder
        if (!obj) {
            var builder = _this.getBuilder();
            if (builder) {
                if (builder instanceof MovieClip) {
                    if (prop in _this.methods) {
                        obj = builder;
                    }

                    if (builder.getProperty() !== undefined) {
                        obj = builder;
                    }
                }
            }
        }

        if (!obj) {
            // console.log("ActionFindPropStrict::ERROR", name, AVM2, this);
        }

        stack[stack.length] = obj;
    };

    /**
     * @param stack
     * @param index
     */
    ActionScript3.prototype.ActionGetDescendAnts = function (stack, index)
    {
        console.log("ActionGetDescendAnts");
        var porp = this.names[index];
        var obj;
        stack[stack.length] = obj;
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionGetGlobalScope = function (stack)
    {
        var _this = this;
        var scopeStack = _this.scopeStack;
        stack[stack.length] = scopeStack[scopeStack.length - 1];
    };

    /**
     * @param stack
     * @param index
     */
    ActionScript3.prototype.ActionGetGlobalsLot = function (stack, index)
    {
        console.log("ActionGetGlobalsLot");
        var value;
        stack[stack.length] = value;
    };

    /**
     * @param stack
     * @param index
     */
    ActionScript3.prototype.ActionGetLex = function (stack, index)
    {
        var _this = this;
        var name = _this.names[index];
        stack[stack.length] = _this.getProperty(name);
    };

    /**
     * @param stack
     * @param index
     */
    ActionScript3.prototype.ActionGetLocal = function (stack, index)
    {
        var _this = this;
        var value = _this.args[index - 1];
        if (value === undefined) {
            value = _this.register[index];
        }
        stack[stack.length] = value;
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionGetLocal0 = function (stack)
    {
        stack[stack.length] = this.register[0];
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionGetLocal1 = function (stack)
    {
        var _this = this;
        var value = _this.args[0];
        if (value === undefined) {
            value = _this.register[1];
        }
        stack[stack.length] = value;
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionGetLocal2 = function (stack)
    {
        var _this = this;
        var value = _this.args[1];
        if (value === undefined) {
            value = _this.register[2];
        }
        stack[stack.length] = value;
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionGetLocal3 = function (stack)
    {
        var _this = this;
        var value = _this.args[2];
        if (value === undefined) {
            value = _this.register[3];
        }
        stack[stack.length] = value;
    };

    /**
     * @param stack
     * @param index
     */
    ActionScript3.prototype.ActionGetProperty = function (stack, index)
    {
        var _this = this;
        var prop = _this.names[index];
        if (prop === null) {
            prop = stack.pop();
        }
        var obj = stack.pop();

        var value;
        if (obj && prop) {
            if (obj instanceof DisplayObject) {
                if (prop in _this.methods) {
                    value = obj[prop];
                }
                if (!value && prop === "parent") {
                    value = obj;
                }
                if (!value) {
                    value = obj.getProperty(prop);
                }
            } else {
                value = obj[prop];
            }

            if (value === undefined) {
                value = _this.getProperty(prop);
            }
        }
        stack[stack.length] = value;
    };

    /**
     * @param stack
     * @param index
     */
    ActionScript3.prototype.ActionGetScopeObject = function (stack, index)
    {
        var activation = this.activation;
        if (!index) {
            stack[stack.length] = activation;
        } else {
            stack[stack.length] = (index in activation) ? activation : null;
        }
    };

    /**
     * @param stack
     * @param index
     */
    ActionScript3.prototype.ActionGetSlot = function (stack, index)
    {
        var obj = stack.pop();
        var name = obj[index];
        stack[stack.length] = this.activation[name];
    };

    /**
     * @param stack
     * @param index
     */
    ActionScript3.prototype.ActionGetSuper = function (stack, index)
    {
        var prop = this.prop;
        var obj = stack.pop();
        var value;
        stack[stack.length] = value;
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionGreaterEquals = function (stack)
    {
        var value2 = stack.pop();
        var value1 = stack.pop();
        stack[stack.length] = (value1 >= value2);
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionGreaterThan = function (stack)
    {
        var value2 = stack.pop();
        var value1 = stack.pop();
        stack[stack.length] = (value1 > value2);
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionHasNext = function (stack)
    {
        var currentIndex = stack.pop();
        var obj = stack.pop();

        currentIndex++;
        var result = 0;
        if (obj) {
            var index = 0;
            for (var key in obj) {
                if (!obj.hasOwnProperty(key)) {
                    continue;
                }

                if (index === currentIndex) {
                    result = currentIndex;
                    break;
                }
                index++;
            }
        }

        stack[stack.length] = result;
    };

    /**
     * @param stack
     * @param objectReg
     * @param indexReg
     */
    ActionScript3.prototype.ActionHasNext2 = function (stack, objectReg, indexReg)
    {
        var _this = this;
        var obj = _this.register[objectReg];
        var currentIndex = _this.currentIndex;

        var value = false;
        var index = 0;
        if (obj) {
            for (var key in obj) {
                if (!obj.hasOwnProperty(key)) {
                    continue;
                }

                if (index === currentIndex) {
                    value = true;
                    currentIndex++;
                    break;
                }

                index++;
            }
        }

        if (!value) {
            currentIndex = 0;
        }

        _this.currentIndex = currentIndex;
        _this.register[indexReg] = index;
        stack[stack.length] = value;
    };

    /**
     * @param stack
     * @param index
     * @returns {number}
     */
    ActionScript3.prototype.ActionIfFalse = function (stack, index)
    {
        var value = stack.pop();
        return (value === false) ? index : 0;
    };

    /**
     * @param stack
     * @param index
     * @returns {number}
     */
    ActionScript3.prototype.ActionIfGe = function (stack, index)
    {
        var value2 = stack.pop();
        var value1 = stack.pop();
        return (value1 < value2) ? index : 0;
    };

    /**
     * @param stack
     * @param index
     * @returns {number}
     */
    ActionScript3.prototype.ActionIfGt = function (stack, index)
    {
        var value2 = stack.pop();
        var value1 = stack.pop();
        return (value1 > value2) ? index : 0;
    };

    /**
     * @param stack
     * @param index
     * @returns {number}
     */
    ActionScript3.prototype.ActionIfLe = function (stack, index)
    {
        var value2 = stack.pop();
        var value1 = stack.pop();
        return (value2 < value1) ? index : 0;
    };

    /**
     * @param stack
     * @param index
     * @returns {number}
     */
    ActionScript3.prototype.ActionIfLt = function (stack, index)
    {
        var value2 = stack.pop();
        var value1 = stack.pop();
        return (value1 < value2) ? index : 0;
    };

    /**
     * @param stack
     * @param index
     * @returns {number}
     */
    ActionScript3.prototype.ActionIfNge = function (stack, index)
    {
        var value2 = stack.pop();
        var value1 = stack.pop();
        return (value1 < value2) ? index : 0;
    };

    /**
     * @param stack
     * @param index
     * @returns {number}
     */
    ActionScript3.prototype.ActionIfNgt = function (stack, index)
    {
        var value2 = stack.pop();
        var value1 = stack.pop();
        return (value2 < value1) ? index : 0;
    };

    /**
     * @param stack
     * @param index
     * @returns {number}
     */
    ActionScript3.prototype.ActionIfNle = function (stack, index)
    {
        var value2 = stack.pop();
        var value1 = stack.pop();
        return (value2 < value1) ? index : 0;
    };

    /**
     * @param stack
     * @param index
     * @returns {number}
     */
    ActionScript3.prototype.ActionIfNlt = function (stack, index)
    {
        var value2 = stack.pop();
        var value1 = stack.pop();
        return (value1 < value2) ? index : 0;
    };

    /**
     * @param stack
     * @param index
     * @returns {number}
     */
    ActionScript3.prototype.ActionIfNe = function (stack, index)
    {
        var value2 = stack.pop();
        var value1 = stack.pop();
        return (value1 == value2) ? 0 : index;
    };

    /**
     * @param stack
     * @param index
     * @returns {number}
     */
    ActionScript3.prototype.ActionIfStrictEq  = function (stack, index)
    {
        var value2 = stack.pop();
        var value1 = stack.pop();
        return (value1 === value2) ? index : 0;
    };

    /**
     * @param stack
     * @param index
     * @returns {number}
     */
    ActionScript3.prototype.ActionIfStrictNe  = function (stack, index)
    {
        var value2 = stack.pop();
        var value1 = stack.pop();
        return (value1 === value2) ? 0 : index;
    };

    /**
     * @param stack
     * @param index
     * @returns {number}
     */
    ActionScript3.prototype.ActionIfTrue = function (stack, index)
    {
        var value = stack.pop();
        return (value === true) ? index : 0;
    };


    /**
     * @param stack
     */
    ActionScript3.prototype.ActionIn = function (stack)
    {
        var obj = stack.pop();
        var name = stack.pop();
        stack[stack.length] = (name in obj);
    };

    /**
     * @param stack
     * @param index
     */
    ActionScript3.prototype.ActionIncLocal = function (stack, index)
    {
        this.register[index]+=1;
    };

    /**
     * @param stack
     * @param index
     */
    ActionScript3.prototype.ActionIncLocalI = function (stack, index)
    {
        this.register[index]+=1;
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionIncrement = function (stack)
    {
        var value = stack.pop();
        value++;
        stack[stack.length] = value;
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionIncrementI = function (stack)
    {
        var value = stack.pop();
        value++;
        stack[stack.length] = value;
    };

    /**
     * @param stack
     * @param index
     */
    ActionScript3.prototype.ActionInitProperty = function (stack, index)
    {
        var value = stack.pop();
        var prop = this.names[index];
        var obj = stack.pop();
        if (obj) {
            if (obj instanceof DisplayObject) {
                obj.setProperty(prop, value);
            } else {
                obj[prop] = value;
            }
        }
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionInstanceOf = function (stack)
    {
        var type = stack.pop();
        var value = stack.pop();
        stack[stack.length] = (value instanceof type);
    };

    /**
     * @param stack
     * @param index
     */
    ActionScript3.prototype.ActionIsType = function (stack, index)
    {
        var value = stack.pop();
        var type = this.name[index];
        stack[stack.length] = (value == type);
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionIsTypeLate = function (stack)
    {
        var type = stack.pop();
        var value = stack.pop();
        stack[stack.length] = (value == type);
    };

    /**
     * @param stack
     * @param index
     */
    ActionScript3.prototype.ActionKill = function (stack, index)
    {
        delete this.register[index];
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionLabel = function (stack)
    {

    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionLessEquals = function (stack)
    {
        var value2 = stack.pop();
        var value1 = stack.pop();
        stack[stack.length] =  (value1 <= value2);
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionLessThan = function (stack)
    {
        var value2 = stack.pop();
        var value1 = stack.pop();
        stack[stack.length] =  (value1 < value2);
    };

    /**
     * @param stack
     * @param offset
     * @param count
     * @param array
     */
    ActionScript3.prototype.ActionLookupSwitch = function (stack, offset, count, array)
    {
        var index = stack.pop();
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionLShift = function (stack)
    {
        var value2 = stack.pop();
        var value1 = stack.pop();
        stack[stack.length] = value1 << value2;
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionModulo = function (stack)
    {
        var value2 = stack.pop();
        var value1 = stack.pop();
        stack[stack.length] = value1 % value2;
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionMultiply = function (stack)
    {
        var value2 = stack.pop();
        var value1 = stack.pop();
        stack[stack.length] = value1 * value2;
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionMultiplyI = function (stack)
    {
        var value2 = stack.pop();
        var value1 = stack.pop();
        stack[stack.length] = value1 * value2;
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionNeGate = function (stack)
    {
        var value = stack.pop();
        stack[stack.length] = -value;
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionNeGateI = function (stack)
    {
        var value = stack.pop();
        stack[stack.length] = -value;
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionNewActivation = function (stack)
    {
        var _this = this;
        var trait = _this.body.trait;
        var length = trait.length;
        var activation = new Activation();
        for (var i = 0; i < length; i++) {
            var obj = trait[i];
            var kind = obj.kind;
            switch (kind) {
                case 0:
                    activation[i + 1] = _this.names[obj.name];
                    break;
            }
        }

        _this.activation = activation;
        stack[stack.length] = activation;
    };

    /**
     * @param stack
     * @param argCount
     */
    ActionScript3.prototype.ActionNewArray = function (stack, argCount)
    {
        var array = [];
        for (var i = argCount; i--;) {
            array[i] = stack.pop();
        }
        stack[stack.length] = array;
    };

    /**
     * @param stack
     * @param index
     */
    ActionScript3.prototype.ActionNewCatch = function (stack, index)
    {
        var catchScope;
        stack[stack.length] = catchScope;
    };

    /**
     * @param stack
     * @param index
     */
    ActionScript3.prototype.ActionNewClass = function (stack, index)
    {
        var basetype = stack.pop();
        var data = this.data;
        var classInfo = data.class[index];
        var id = classInfo.cinit;

        stack[stack.length] = basetype;
    };

    /**
     * @param stack
     * @param index
     */
    ActionScript3.prototype.ActionNewFunction = function (stack, index)
    {
        stack[stack.length] = (function (self, id)
        {
            return function ()
            {
                var as3 = new ActionScript3(self.data, id, self.ns, self.stage);
                as3.caller = this;
                as3.parent = self;
                as3.args = arguments;
                return as3.execute();
            };
        })(this, index);
    };

    /**
     * @param stack
     * @param argCount
     */
    ActionScript3.prototype.ActionNewObject = function (stack, argCount)
    {
        var obj = {};
        for (var i = argCount; i--;) {
            var value = stack.pop();
            var prop = stack.pop();
            obj[prop] = value;
        }
        stack[stack.length] = obj;
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionNextName = function (stack)
    {
        var index = +stack.pop();
        var obj = stack.pop();

        var name;
        if (obj) {
            var count = 0;
            for (var prop in obj) {
                if (!obj.hasOwnProperty(prop)) {
                    continue;
                }

                if (count === index) {
                    name = prop;
                    break;
                }
                count++;
            }
        }
        stack[stack.length] = name;
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionNextValue = function (stack)
    {
        var index = stack.pop();
        var obj = stack.pop();
        var value;
        stack[stack.length] = value;
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionNop = function (stack)
    {


    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionNot = function (stack)
    {
        var value = stack.pop();
        stack[stack.length] = (!value);
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionPop = function (stack)
    {
        stack.pop();
    };

    /**
     *
     */
    ActionScript3.prototype.ActionPopScope = function ()
    {
        this.scopeStack.pop();
    };

    /**
     * @param stack
     * @param value
     */
    ActionScript3.prototype.ActionPushByte = function (stack, value)
    {
        stack[stack.length] = value|0;
    };

    /**
     * @param stack
     * @param index
     */
    ActionScript3.prototype.ActionPushDouble = function (stack, index)
    {
        var data = this.data;
        var double = data.double;
        var value = double[index];
        stack[stack.length] = +value;
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionPushFalse = function (stack)
    {
        stack[stack.length] = false;
    };

    /**
     * @param stack
     * @param index
     */
    ActionScript3.prototype.ActionPushInt = function (stack, index)
    {
        var data = this.data;
        var integer = data.integer;
        var value = integer[index];
        stack[stack.length] = +value;
    };

    /**
     * @param stack
     * @param index
     */
    ActionScript3.prototype.ActionPushNameSpace = function (stack, index)
    {
        var data = this.data;
        var names = data.names;
        var value = names[index];
        stack[stack.length] = +value;
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionPushNan = function (stack)
    {
        stack[stack.length] = NaN;
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionPushNull = function (stack)
    {
        stack[stack.length] = null;
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionPushScope = function (stack)
    {
        var scope = stack.pop();
        if (scope) {
            var scopeStack = this.scopeStack;
            scopeStack[scopeStack.length] = scope;
        }
    };

    /**
     * @param stack
     * @param value
     */
    ActionScript3.prototype.ActionPushShort = function (stack, value)
    {
        stack[stack.length] = value;
    };

    /**
     * @param stack
     * @param index
     */
    ActionScript3.prototype.ActionPushString = function (stack, index)
    {
        var data = this.data;
        var string = data.string;
        stack[stack.length] = ""+string[index];
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionPushTrue = function (stack)
    {
        stack[stack.length] = true;
    };

    /**
     * @param stack
     * @param index
     */
    ActionScript3.prototype.ActionPushUInt = function (stack, index)
    {
        var data = this.data;
        var uinteger = data.uinteger;
        stack[stack.length] = uinteger[index];
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionPushUndefined = function (stack)
    {
        stack[stack.length] = undefined;
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionPushWith = function (stack)
    {
        var obj = stack.pop();
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionRShift = function (stack)
    {
        var value2 = stack.pop();
        var value1 = stack.pop();
        stack[stack.length] = value1 >> value2;
    };

    /**
     * @param stack
     * @param index
     */
    ActionScript3.prototype.ActionSetLocal = function (stack, index)
    {
        this.register[index] = stack.pop();
    };


        /**
     * @param stack
     */
    ActionScript3.prototype.ActionSetLocal0 = function (stack)
    {
        this.register[0] = stack.pop();
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionSetLocal1 = function (stack)
    {
        this.register[1] = stack.pop();
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionSetLocal2 = function (stack)
    {
        this.register[2] = stack.pop();
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionSetLocal3 = function (stack)
    {
        this.register[3] = stack.pop();
    };

    /**
     * @param stack
     * @param index
     */
    ActionScript3.prototype.ActionSetGlobalSlot = function (stack, index)
    {
        var value = stack.pop();
    };

    /**
     * @param stack
     * @param index
     */
    ActionScript3.prototype.ActionSetProperty = function (stack, index)
    {
        var _this = this;
        var value = stack.pop();
        var prop = _this.names[index];
        var obj = stack.pop();

        if (obj) {
            if (obj instanceof DisplayObject) {
                if (prop in _this.methods) {
                    obj[prop] = value;
                } else {
                    console.log("ActionSetProperty", prop);
                }
            } else if (prop in obj) {
                obj[prop] = value;
            } else {
                var builder = _this.getBuilder();
                var caller = _this.caller;
                if (caller instanceof MovieClip) {
                    builder = caller;
                }

                if (builder instanceof DisplayObject) {
                    if (prop in _this.methods) {
                        builder[prop] = value;
                    } else {
                        obj[prop] = value;
                    }
                }
            }
        }
    };

    /**
     * @param stack
     * @param index
     */
    ActionScript3.prototype.ActionSetSlot = function (stack, index)
    {
        var value = stack.pop();
        var obj = stack.pop();
        var name = obj[index];
        this.activation[name] = value;
    };

    /**
     * @param stack
     * @param index
     */
    ActionScript3.prototype.ActionSetSuper = function (stack, index)
    {
        var value = stack.pop();
        var prop = this.names[index];
        var obj = stack.pop();

    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionStrictEquals = function (stack)
    {
        var value2 = stack.pop();
        var value1 = stack.pop();
        stack[stack.length] = (value1 === value2);
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionSubtract = function (stack)
    {
        var value2 = stack.pop();
        var value1 = stack.pop();
        stack[stack.length] = value1 - value2;
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionSubtractI = function (stack)
    {
        var value2 = +stack.pop();
        var value1 = +stack.pop();
        stack[stack.length] = value1 - value2;
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionSwap = function (stack)
    {
        var value2 = stack.pop();
        var value1 = stack.pop();
        stack[stack.length] = value2;
        stack[stack.length] = value1;
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionThrow = function (stack)
    {
        var value = stack.pop();
        console.log(value);
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionTypeof = function (stack)
    {
        var value = stack.pop();
        stack[stack.length] = typeof value;
    };

    /**
     * @param stack
     */
    ActionScript3.prototype.ActionURShift = function (stack)
    {
        var value2 = stack.pop();
        var value1 = stack.pop();
        stack[stack.length] = value2 >> value1;
    };

    /**
     * @param data
     * @param constantPool
     * @param register
     * @param initAction
     * @constructor
     */
    var ActionScript = function (data, constantPool, register, initAction)
    {
        var _this = this;
        _this.cache = [];
        _this.params = [];
        _this.constantPool = constantPool || [];
        _this.register = register || [];
        _this.variables = {};
        _this.initAction = (initAction) ? true : false;
        _this.scope = null;
        _this.parent = null;
        _this.arg = null;
        _this.version = 7;
        _this.superClass = null;
        if (data.length) {
            _this.initialize(data);
        }
        _this.initParam();
    };

    /**
     * reset
     */
    ActionScript.prototype.reset = function ()
    {
        var _this = this;
        _this.arg = null;
        _this.variables = {};
        _this.initParam();
    };

    /**
     * initParam
     */
    ActionScript.prototype.initParam = function ()
    {
        var _this = this;
        var register = _this.register;
        var length = register.length;
        var params = [];
        for (var i = 0; i < length; i++) {
            var obj = register[i];
            if (obj.name === null) {
                params[obj.register] = obj.value;
            } else {
                params[obj.register] = obj.name;
            }
        }
        _this.params = params;
    };

    /**
     * @param values
     */
    ActionScript.prototype.initVariable = function (values)
    {
        var _this = this;
        _this.arg = values;
        var register = _this.register;
        var length = register.length;
        var variables = _this.variables;
        var key = 0;
        for (var i = 0; i < length; i++) {
            var obj = register[i];
            if (obj.name === null) {
                continue;
            }
            variables[obj.name] = values[key++];
        }
        _this.variables = variables;
        _this.initParam();
    };

    /**
     * @returns {{}}
     */
    ActionScript.prototype.getSuperClass = function ()
    {
        var _this = this;
        var superClass = _this.superClass;
        if (!superClass) {
            var parent = _this.parent;
            if (parent) {
                superClass = parent.getSuperClass();
            }
        }
        return superClass;
    };

    /**
     * @param name
     * @param value
     */
    ActionScript.prototype.setVariable = function (name, value)
    {
        var _this = this;
        var finish = false;
        if (name in _this.variables) {
            _this.variables[name] = value;
            finish = true;
        }
        if (!finish) {
            var parent = _this.parent;
            if (parent) {
                finish = parent.setVariable(name, value);
            }
        }
        return finish;
    };

    /**
     * @param name
     * @returns {*}
     */
    ActionScript.prototype.getVariable = function (name)
    {
        var _this = this;
        var value, parent;
        switch (name) {
            case "this":
                value = _this.variables["this"];
                break;
            case "arguments":
                value = _this.arg;
                break;
            default:
                value = _this.variables[name];
                if (value === undefined) {
                    parent = _this.parent;
                    if (parent) {
                        value = parent.getVariable(name);
                    }
                }
                break;
        }
        return value;
    };

    /**
     * @param value
     * @returns {string}
     */
    ActionScript.prototype.valueToString = function (value)
    {
        if (typeof value !== "string") {
            value += "";
        }
        return value;
    };

    /**
     * @param str
     * @param mc
     * @returns {*}
     */
    ActionScript.prototype.stringToObject = function(str, mc)
    {
        var object = this.getVariable(str);
        if (object === undefined) {
            object = mc.getProperty(str);
        }
        return object;
    };

    /**
     * @param data
     */
    ActionScript.prototype.initialize = function (data)
    {
        var _this = this;
        var isEnd = false;
        var obj = {};
        var i = 0;
        var idx = 0;
        var cache = [];
        var indexes = [];
        var asData;
        var register;
        var values;
        var NumParams;
        var payloadLength;
        var withEndPoint = 0;
        var bitio = new BitIO();
        bitio.setData(data);

        var pBitio = new BitIO();
        var endPoint = data.length;

        _this.initParam();
        while (bitio.byte_offset < endPoint) {
            var startOffset = bitio.byte_offset;
            obj = {};

            if (withEndPoint && withEndPoint === bitio.byte_offset) {
                withEndPoint = 0;
                obj.actionCode = 0x94;
                obj.Size = 0;
                cache[cache.length] = obj;
                continue;
            }

            var actionCode = bitio.getUI8();
            obj.actionCode = actionCode;

            var payload = null;
            if (actionCode >= 0x80) {
                payloadLength = bitio.getUI16();
                payload = bitio.getData(payloadLength);
                pBitio.setData(payload);
                pBitio.setOffset(0, 0);
            }

            switch (actionCode) {
                // GotoFrame
                case 0x81:
                    obj.frame = (pBitio.getUI16()|0) + 1;
                    break;
                // WaitForFrame
                case 0x8A:
                    obj.frame = pBitio.getUI16();
                    obj.skipCount = pBitio.getUI8();
                    break;
                // SetTarget
                case 0x8B:
                    obj.targetName = pBitio.getDataUntil("\0");
                    break;
                // GoToLabel
                case 0x8C:
                    obj.label = pBitio.getDataUntil("\0");
                    break;
                case 0x83:
                    var len = payload.length - 1;
                    var urls = [[]];
                    idx = 0;
                    for (i = 0; i < len; i++) {
                        var str = _fromCharCode(payload[i]);
                        if (payload[i] === 0) {
                            idx++;
                            urls[idx] = [];
                            continue;
                        }
                        urls[idx] += str;
                    }

                    var urlString = urls[0];
                    if (typeof urlString === "string") {
                        var splitUrl = urlString.split("?");
                        if (2 in splitUrl) {
                            urlString = splitUrl[0];
                            urlString += "?" + splitUrl[1];
                            var paramLength = splitUrl.length;
                            for (i = 2; i < paramLength; i++) {
                                urlString += "&" + splitUrl[i];
                            }
                        }
                    }

                    obj.url = urlString;
                    obj.target = urls[1];
                    break;
                // Push
                case 0x96:
                    values = [];
                    while (pBitio.byte_offset < payloadLength) {
                        var type = pBitio.getUI8();
                        switch (type) {
                            case 0: // String
                                values[values.length] = String(pBitio.getDataUntil("\0"));
                                break;
                            case 1: // Float
                                values[values.length] = pBitio.getFloat32();
                                break;
                            case 2: // null
                                values[values.length] = null;
                                break;
                            case 3: // undefined
                                values[values.length] = undefined;
                                break;
                            case 4: // RegisterNumber
                                values[values.length] = {"key": pBitio.getUI8()};
                                break;
                            case 5: // Boolean
                                values[values.length] = (pBitio.getUI8()) ? true : false;
                                break;
                            case 6: // Double
                                values[values.length] = pBitio.getFloat64();
                                break;
                            case 7: // Integer
                                values[values.length] = pBitio.getUI32();
                                break;
                            case 8: // Constant8
                                values[values.length] = _this.constantPool[pBitio.getUI8()];
                                break;
                            case 9: // Constant16
                                values[values.length] = _this.constantPool[pBitio.getUI16()];
                                break;
                            default:
                                break;
                        }
                    }
                    obj.values = values;
                    break;
                // If
                case 0x9D:
                    obj.offset = bitio.byte_offset + bitio.toSI16LE(payload);
                    break;
                // Jump
                case 0x99:
                    obj.offset = bitio.byte_offset + bitio.toSI16LE(payload);
                    break;
                // GetURL2
                case 0x9A:
                    obj.LoadVariablesFlag = pBitio.getUIBits(1); // 0=none, 1=LoadVariables
                    obj.LoadTargetFlag = pBitio.getUIBits(1);// 0=web, 1=Sprite
                    pBitio.getUIBits(4); // Reserved
                    obj.SendVarsMethod = pBitio.getUIBits(2);// 0=NONE, 1=GET, 2=POST
                    break;
                // GoToFrame2
                case 0x9F:
                    pBitio.getUIBits(6); // Reserved
                    obj.SceneBiasFlag = pBitio.getUIBit();
                    obj.PlayFlag = pBitio.getUIBit();// 0=stop, 1=play
                    if (obj.SceneBiasFlag === 1) {
                        obj.SceneBias = pBitio.getUI16();
                    }
                    break;
                // WaitForFrame2
                case 0x8D:
                    obj.skipCount = pBitio.getUI8();
                    break;
                // ConstantPool
                case 0x88:
                    var count = pBitio.getUI16();
                    var constantPool = [];
                    if (count > 0) {
                        while (count--) {
                            constantPool[constantPool.length] = pBitio.getDataUntil("\0");
                        }
                    }
                    obj.constantPool = constantPool;
                    _this.constantPool = constantPool;
                    break;
                // ActionDefineFunction
                case 0x9b:
                    obj.FunctionName = pBitio.getDataUntil("\0");
                    NumParams = pBitio.getUI16();
                    register = [];
                    if (NumParams > 0) {
                        idx = 1;
                        while (NumParams--) {
                            register[register.length] = {
                                register: idx,
                                name: pBitio.getDataUntil("\0"),
                                value: null
                            };
                        }
                    }

                    asData = bitio.getData(pBitio.getUI16());
                    obj.ActionScript = new ActionScript(asData, _this.constantPool, register, _this.initAction);

                    break;
                // ActionWith
                case 0x94:
                    obj.Size = pBitio.getUI16();
                    withEndPoint = obj.Size + bitio.byte_offset;
                    break;
                // ActionStoreRegister
                case 0x87:
                    obj.RegisterNumber = pBitio.getUI8();
                    break;
                // SWF 7 ***********************************
                // ActionDefineFunction2
                case 0x8e:
                    register = [];
                    values = [];

                    obj.FunctionName = pBitio.getDataUntil("\0");
                    NumParams = pBitio.getUI16();
                    var RegisterCount = pBitio.getUI8();
                    obj.PreloadParentFlag = pBitio.getUIBits(1);
                    obj.PreloadRootFlag = pBitio.getUIBits(1);
                    obj.SuppressSuperFlag = pBitio.getUIBits(1);
                    obj.PreloadSuperFlag = pBitio.getUIBits(1);
                    obj.SuppressArgumentsFlag = pBitio.getUIBits(1);
                    obj.PreloadArgumentsFlag = pBitio.getUIBits(1);
                    obj.SuppressThisFlag = pBitio.getUIBits(1);
                    obj.PreloadThisFlag = pBitio.getUIBits(1);
                    pBitio.getUIBits(7); // Reserved
                    obj.PreloadGlobalFlag = pBitio.getUIBits(1);

                    if (obj.PreloadThisFlag) {
                        values[values.length] = "this";
                    }
                    if (obj.PreloadArgumentsFlag) {
                        values[values.length] = "arguments";
                    }
                    if (obj.PreloadSuperFlag) {
                        values[values.length] = "super";
                    }
                    if (obj.PreloadRootFlag) {
                        values[values.length] = "_root";
                    }
                    if (obj.PreloadParentFlag) {
                        values[values.length] = "_parent";
                    }
                    if (obj.PreloadGlobalFlag) {
                        values[values.length] = "_global";
                    }
                    for (idx = 1; idx < RegisterCount; idx++) {
                        var rIdx = idx - 1;
                        if (!(rIdx in values)) {
                            continue;
                        }
                        register[register.length] = {
                            register: idx,
                            name: null,
                            value: values[rIdx]
                        };
                    }

                    if (NumParams > 0) {
                        while (NumParams--) {
                            var Register = pBitio.getUI8();
                            var ParamName = pBitio.getDataUntil("\0");
                            register[register.length] = {
                                register: Register,
                                name: ParamName,
                                value: null
                            };
                        }
                    }

                    asData = bitio.getData(pBitio.getUI16());
                    obj.ActionScript = new ActionScript(asData, _this.constantPool, register, _this.initAction);
                    break;
                // ActionTry
                case 0x8f:
                    pBitio.getUIBits(5); // Reserved
                    var CatchInRegisterFlag = pBitio.getUIBits(1);
                    obj.FinallyBlockFlag = pBitio.getUIBits(1);
                    obj.CatchBlockFlag = pBitio.getUIBits(1);
                    var TrySize = pBitio.getUI16();
                    var CatchSize = pBitio.getUI16();
                    var FinallySize = pBitio.getUI16();

                    var CatchName;
                    if (!CatchInRegisterFlag) {
                        CatchName = pBitio.getDataUntil("\0");
                    } else {
                        CatchName = pBitio.getUI8();
                    }

                    i = 0;
                    var TryBody = [];
                    if (TrySize) {
                        while (TrySize) {
                            TryBody[TryBody.length] = bitio.getUI8();
                            TrySize--;
                        }
                    }

                    obj.try = (function (data)
                    {
                        var as = new ActionScript(data);
                        return function ()
                        {
                            as.reset();
                            as.variables["this"] = this;
                            return as.execute(this);
                        };
                    })(TryBody);

                    if (obj.CatchBlockFlag) {
                        var CatchBody = [];
                        if (CatchSize) {
                            while (CatchSize) {
                                CatchBody[CatchBody.length] = bitio.getUI8();
                                CatchSize--;
                            }
                        }

                        obj.catch = (function (data, catchName)
                        {
                            var as = new ActionScript(data);
                            return function ()
                            {
                                as.reset();
                                as.variables["this"] = this;
                                as.variables[catchName] = arguments[0];
                                return as.execute(this);
                            };
                        })(CatchBody, CatchName);
                    }

                    if (obj.FinallyBlockFlag) {
                        var FinallyBody = [];
                        if (FinallySize) {
                            while (FinallySize) {
                                FinallyBody[FinallyBody.length] = bitio.getUI8();
                                FinallySize--;
                            }
                        }

                        obj.finally = (function (data)
                        {
                            var as = new ActionScript(data);
                            return function ()
                            {
                                as.reset();
                                as.variables["this"] = this;
                                return as.execute(this);
                            };
                        })(FinallyBody);
                    }

                    break;
                case 0x00:
                    isEnd = true;
                    break;
            }

            indexes[startOffset] = cache.length;
            cache[cache.length] = obj;

            if (isEnd) {
                break;
            }
        }

        // If and Jump
        var length = cache.length;
        for (i = 0; i < length; i++) {
            obj = cache[i];
            var code = obj.actionCode;
            if (code === 0x9D || code === 0x99) {
                var index = indexes[obj.offset];
                if (index !== undefined) {
                    obj.offset = index - 1;
                } else {
                    obj.offset = cache.length - 1;
                }
            }
        }
        _this.cache = cache;
    };

    /**
     * @param value
     * @returns {*}
     */
    ActionScript.prototype.calc = function (value)
    {
        var calc;
        switch (typeof value) {
            case "boolean":
                calc = (value) ? 1 : 0;
                break;
            case "object":
                if (value === null) {
                    calc = 0;
                } else if (value instanceof Array) {
                    calc = value.length;
                } else if (value instanceof Object) {
                    calc = 1;
                }
                break;
            default:
                calc = +value;
                break;
        }

        if (_isNaN(calc)) {
            calc = 0;
        }

        return calc;
    };

    /**
     * @param value
     * @returns {*}
     */
    ActionScript.prototype.logicValue = function (value)
    {
        var calc;
        switch (typeof value) {
            case "boolean":
                calc = (value) ? 1 : 0;
                break;
            case "object":
                if (value === null) {
                    calc = 0;
                } else if (value instanceof Array) {
                    calc = value.length;
                } else if (value instanceof Object) {
                    calc = 1;
                }
                break;
            case "string":
                if (value === "") {
                    calc = 0;
                } else {
                    calc = 1;
                }
                break;
            case "function":
                calc = 1;
                break;
            default:
                calc = +value;
                if (_isNaN(calc)) {
                    calc = 0;
                }
                break;
        }
        return calc;
    };

    /**
     * @param stack
     * @returns {Number}
     */
    ActionScript.prototype.operationValue = function (stack)
    {
        var value = +stack.pop();
        if (_isNaN(value)) {
            value = 0;
        }
        return value;
    };

    /**
     * @param mc
     * @returns {*}
     */
    ActionScript.prototype.execute = function (mc)
    {
        var _this = this;
        var scope = _this.scope;
        var movieClip = (scope instanceof MovieClip) ? scope : mc;
        if (!movieClip.active) {
            return undefined;
        }
        var stage = movieClip.getStage();
        if (stage) {
            _this.version = stage.getVersion();
        }

        var stack = [];
        var cache = _this.cache;
        var cLength = cache.length;
        var cIdx = 0;
        while(cIdx < cLength) {
            if (!(cIdx in cache)) {
                cIdx++;
                continue;
            }

            var aScript = cache[cIdx];
            var actionCode = aScript.actionCode;
            if (actionCode === 0) {
                break;
            }

            switch (actionCode) {
                // ********************************************
                // SWF 3
                // ********************************************
                case 0x81:
                    _this.ActionGotoFrame(movieClip, aScript.frame);
                    break;
                case 0x04:
                    _this.ActionNextFrame(movieClip);
                    break;
                case 0x05:
                    _this.ActionPreviousFrame(movieClip);
                    break;
                case 0x06:
                    _this.ActionPlay(movieClip);
                    break;
                case 0x07:
                    _this.ActionStop(movieClip);
                    break;
                case 0x08: // ActionToggleQuality
                case 0x8A: // ActionWaitForFrame
                    break;
                case 0x09:
                    _this.ActionStopSounds(movieClip);
                    break;
                case 0x8B:
                    movieClip = _this.ActionSetTarget(movieClip, mc, aScript.targetName);
                    break;
                case 0x8C:
                    _this.ActionGoToLabel(movieClip, aScript.label);
                    break;
                case 0x83:
                    _this.ActionGetURL(movieClip, aScript.url, aScript.target);
                    break;

                // ********************************************
                // SWF 4
                // ********************************************
                case 0x0A: // ActionAdd
                    _this.ActionOperation(stack, 0);
                    break;
                case 0x0B: // ActionSubtract
                    _this.ActionOperation(stack, 1);
                    break;
                case 0x0C: // ActionMultiply
                    _this.ActionOperation(stack, 2);
                    break;
                case 0x0D: // ActionDivide
                    _this.ActionOperation(stack, 3);
                    break;
                case 0x0E:
                    _this.ActionEquals(stack);
                    break;
                case 0x0F:
                    _this.ActionLess(stack);
                    break;
                case 0x10:
                    _this.ActionAnd(stack);
                    break;
                case 0x11:
                    _this.ActionOr(stack);
                    break;
                case 0x12:
                    _this.ActionNot(stack);
                    break;
                case 0x13:
                    _this.ActionStringEquals(stack);
                    break;
                case 0x14: // ActionStringLength
                case 0x31: // ActionMBStringLength
                    _this.ActionStringLength(stack);
                    break;
                case 0x21:
                    _this.ActionStringAdd(stack);
                    break;
                case 0x15:// ActionStringExtract
                case 0x35:// ActionMBStringExtract
                    _this.ActionStringExtract(stack);
                    break;
                case 0x29:
                    _this.ActionStringLess(stack);
                    break;
                case 0x17: // ActionPop
                    stack.pop();
                    break;
                case 0x96:
                    _this.ActionPush(stack, movieClip, aScript.values);
                    break;
                case 0x33: // ActionAsciiToChar
                case 0x37: // ActionMBAsciiToChar
                    _this.ActionAsciiToChar(stack);
                    break;
                case 0x36: // ActionMBCharToAscii
                case 0x32: // ActionCharToAscii
                    _this.ActionCharToAscii(stack);
                    break;
                case 0x18:
                    _this.ActionToInteger(stack);
                    break;
                case 0x9E:
                    _this.ActionCall(stack, movieClip);
                    break;
                case 0x9D:
                    cIdx = _this.ActionIf(stack, aScript.offset, cIdx);
                    break;
                case 0x99: // ActionJump
                    cIdx = aScript.offset;
                    break;
                case 0x1C:
                    _this.ActionGetVariable(stack, movieClip);
                    break;
                case 0x1D:
                    _this.ActionSetVariable(stack, movieClip);
                    break;
                case 0x9A:
                    _this.ActionGetURL2(stack, aScript, movieClip);
                    break;
                case 0x22:
                    _this.ActionGetProperty(stack, movieClip);
                    break;
                case 0x9F:
                    _this.ActionGoToFrame2(stack, aScript, movieClip);
                    break;
                case 0x20:
                    movieClip = _this.ActionSetTarget2(stack, movieClip, mc);
                    break;
                case 0x23:
                    _this.ActionSetProperty(stack, movieClip);
                    break;
                case 0x27:
                    _this.ActionStartDrag(stack, movieClip);
                    break;
                case 0x8D: // ActionWaitForFrame2
                    stack.pop();
                    break;
                case 0x24:
                    _this.ActionCloneSprite(stack, movieClip);
                    break;
                case 0x25:
                    _this.ActionRemoveSprite(stack, movieClip);
                    break;
                case 0x28:
                    _this.ActionEndDrag(movieClip);
                    break;
                case 0x34:
                    _this.ActionGetTime(stack);
                    break;
                case 0x30:
                    _this.ActionRandomNumber(stack);
                    break;
                case 0x26:
                    _this.ActionTrace(stack);
                    break;
                case 0x00:
                    break;
                case 0x2D:
                    _this.ActionFsCommand2(stack, movieClip);
                    break;

                // ********************************************
                // SWF 5
                // ********************************************
                case 0x52:
                    _this.ActionCallMethod(stack, movieClip);
                    break;
                case 0x88: // ActionConstantPool
                    _this.constantPool = aScript.constantPool;
                    break;
                case 0x3d:
                    _this.ActionCallFunction(stack, movieClip);
                    break;
                case 0x9b:
                    _this.ActionDefineFunction(stack, aScript, movieClip);
                    break;
                case 0x3c:
                    _this.ActionDefineLocal(stack, movieClip);
                    break;
                case 0x41:
                    _this.ActionDefineLocal2(stack, movieClip);
                    break;
                case 0x3a:
                    _this.ActionDelete(stack, movieClip);
                    break;
                case 0x3b:
                    _this.ActionDelete2(stack, movieClip);
                    break;
                case 0x46:
                    _this.ActionEnumerate(stack, movieClip);
                    break;
                case 0x49:
                    _this.ActionEquals2(stack);
                    break;
                case 0x4e:
                    _this.ActionGetMember(stack, movieClip);
                    break;
                case 0x42:
                    _this.ActionInitArray(stack);
                    break;
                case 0x43:
                    _this.ActionInitObject(stack);
                    break;
                case 0x53:
                    _this.ActionNewMethod(stack, movieClip);
                    break;
                case 0x40:
                    _this.ActionNewObject(stack, movieClip);
                    break;
                case 0x4f:
                    _this.ActionSetMember(stack, movieClip);
                    break;
                case 0x45:
                    _this.ActionTargetPath(stack);
                    break;
                case 0x94:
                    movieClip = _this.ActionWith(stack, aScript.Size, mc);
                    break;
                case 0x4a:
                    _this.ActionToNumber(stack);
                    break;
                case 0x4b:
                    _this.ActionToString(stack);
                    break;
                case 0x44:
                    _this.ActionTypeOf(stack);
                    break;
                case 0x47:
                    _this.ActionAdd2(stack);
                    break;
                case 0x48:
                    _this.ActionLess2(stack);
                    break;
                case 0x3f:
                    _this.ActionModulo(stack);
                    break;
                case 0x60:
                    _this.ActionBitAnd(stack);
                    break;
                case 0x63:
                    _this.ActionBitLShift(stack);
                    break;
                case 0x61:
                    _this.ActionBitOr(stack);
                    break;
                case 0x64:
                    _this.ActionBitRShift(stack);
                    break;
                case 0x65:
                    _this.ActionBitURShift(stack);
                    break;
                case 0x62:
                    _this.ActionBitXor(stack);
                    break;
                case 0x51:
                    _this.ActionDecrement(stack);
                    break;
                case 0x50:
                    _this.ActionIncrement(stack);
                    break;
                case 0x4c:
                    _this.ActionPushDuplicate(stack);
                    break;
                case 0x3e: // ActionReturn
                    return stack.pop();
                case 0x4d:
                    _this.ActionStackSwap(stack);
                    break;
                case 0x87:
                    _this.ActionStoreRegister(stack, aScript.RegisterNumber);
                    break;

                // ********************************************
                // SWF 6
                // ********************************************
                case 0x54:
                    _this.ActionInstanceOf(stack);
                    break;
                case 0x55:
                    _this.ActionEnumerate(stack, movieClip);
                    break;
                case 0x66:
                    _this.ActionStrictEquals(stack);
                    break;
                case 0x67: // ActionGreater
                case 0x68: // ActionStringGreater
                    _this.ActionGreater(stack);
                    break;

                // ********************************************
                // SWF 7
                // ********************************************
                case 0x8e: // ActionDefineFunction2
                    _this.ActionDefineFunction(stack, aScript, movieClip);
                    break;
                case 0x69:
                    _this.ActionExtends(stack);
                    break;
                case 0x2b:
                    _this.ActionCastOp(stack);
                    break;
                case 0x2c:
                    _this.ActionImplementsOp(stack);
                    break;
                case 0x8f:
                    _this.ActionTry(aScript, movieClip);
                    break;
                case 0x2a:
                    _this.ActionThrow(stack);
                    break;

                default:
                    console.log("[ActionScript Error] Code: " + actionCode);
                    break;
            }
            cIdx++;
        }
    };

    /**
     * @type {{}}
     */
    ActionScript.prototype.methods = {
        gotoandstop: "gotoAndStop",
        gotoandplay: "gotoAndPlay",
        play: "play",
        stop: "stop",
        duplicatemovieclip: "duplicateMovieClip",
        getproperty: "getProperty",
        removemovieclip: "removeMovieClip",
        setproperty: "setProperty",
        startdrag: "startDrag",
        stopdrag: "stopDrag",
        targetpath: "targetPath",
        updateafterevent: "updateAfterEvent",
        nextframe: "nextFrame",
        nextscene: "nextScene",
        prevframe: "prevFrame",
        prevscene: "prevScene",
        stopallsounds: "stopAllSounds",
        setmask: "setMask",
        geturl: "getURL",
        loadmovie: "loadMovie",
        loadmovienum: "loadMovieNum",
        loadvariables: "loadVariables",
        loadvariablesnum: "loadVariablesNum",
        unloadmovie: "unloadMovie",
        unloadmovienum: "unloadMovieNum",
        swapdepths: "swapDepths",
        getinstanceatdepth: "getInstanceAtDepth",
        attachmovie: "attachMovie",
        attachaudio: "attachAudio",
        attachbitmap: "attachBitmap",
        getnexthighestdepth: "getNextHighestDepth",
        getbytesloaded: "getBytesLoaded",
        getbytestotal: "getBytesTotal",
        assetpropflags: "ASSetPropFlags",
        linestyle: "lineStyle",
        linegradientstyle: "lineGradientStyle",
        beginfill: "beginFill",
        begingradientfill: "beginGradientFill",
        beginbitmapfill: "beginBitmapFill",
        clear: "clear",
        moveto: "moveTo",
        lineto: "lineTo",
        curveto: "curveTo",
        endfill: "endFill",
        hittest: "hitTest",
        getdepth: "getDepth",
        createemptymovieclip: "createEmptyMovieClip",
        createtextfield: "createTextField",
        getbounds: "getBounds",
        getrect: "getRect",
        getswfversion: "getSWFVersion",
        gettextsnapshot: "getTextSnapshot",
        globaltolocal: "globalToLocal",
        localtoglobal: "localToGlobal"
    };

    /**
     * @param method
     * @returns {*}
     */
    ActionScript.prototype.checkMethod = function (method)
    {
        if (!method || typeof method !== "string") {
            return method;
        }
        var lowerMethod = method.toLowerCase();
        return this.methods[lowerMethod] || null;
    };

    /**
     * @param mc
     * @param frame
     */
    ActionScript.prototype.ActionGotoFrame = function (mc, frame)
    {
        if (mc instanceof MovieClip) {
            mc.stop();
            mc.setNextFrame(frame);
        }
    };

    /**
     * @param mc
     */
    ActionScript.prototype.ActionNextFrame = function (mc)
    {
        if (mc instanceof MovieClip) {
            mc.nextFrame();
        }
    };

    /**
     * @param mc
     */
    ActionScript.prototype.ActionPreviousFrame = function (mc)
    {
        if (mc instanceof MovieClip) {
            mc.prevFrame();
        }
    };

    /**
     * @param mc
     */
    ActionScript.prototype.ActionPlay = function (mc)
    {
        if (mc instanceof MovieClip) {
            mc.play();
        }
    };

    /**
     * @param mc
     */
    ActionScript.prototype.ActionStop = function (mc)
    {
        if (mc instanceof MovieClip) {
            mc.stop();
        }
    };

    /**
     * @param mc
     */
    ActionScript.prototype.ActionStopSounds = function (mc)
    {
        if (mc instanceof MovieClip) {
            mc.stopAllSounds();
        }
    };

    /**
     * @param movieClip
     * @param mc
     * @param target
     * @returns {*}
     */
    ActionScript.prototype.ActionSetTarget = function (movieClip, mc, target)
    {
        if (target !== "") {
            var targetMc = movieClip;
            if (!targetMc) {
                targetMc = mc;
            }
            return targetMc.getDisplayObject(target);
        } else {
            if (mc.active) {
                return mc;
            } else {
                return undefined;
            }
        }
    };

    /**
     * @param mc
     * @param label
     */
    ActionScript.prototype.ActionGoToLabel = function (mc, label)
    {
        if (mc instanceof MovieClip) {
            var frame = mc.getLabel(label);
            mc.stop();
            if (typeof frame === "number" && frame) {
                mc.setNextFrame(frame);
            }
        }
    };

    /**
     * @param mc
     * @param url
     * @param target
     */
    ActionScript.prototype.ActionGetURL = function (mc, url, target)
    {
        if (mc instanceof MovieClip) {
            mc.getURL(url, target);
        }
    };

    /**
     * @param stack
     * @param operation
     */
    ActionScript.prototype.ActionOperation = function (stack, operation)
    {
        var _this = this;
        var a = _this.operationValue(stack);
        var b = _this.operationValue(stack);
        var value;
        switch (operation) {
            case 0:
                value = b + a;
                break;
            case 1:
                value = b - a;
                break;
            case 2:
                value = b * a;
                break;
            case 3:
                value = b / a;
                break;
        }
        stack[stack.length] = value;
    };

    /**
     * @param stack
     */
    ActionScript.prototype.ActionEquals = function (stack)
    {
        var _this = this;
        var a = _this.calc(stack.pop());
        var b = _this.calc(stack.pop());
        if (_this.version > 4) {
            stack[stack.length] = (a === b);
        } else {
            stack[stack.length] = (a === b) ? 1 : 0;
        }
    };

    /**
     * @param stack
     */
    ActionScript.prototype.ActionLess = function (stack)
    {
        var _this = this;
        var a = _this.calc(stack.pop());
        var b = _this.calc(stack.pop());
        if (_this.version > 4) {
            stack[stack.length] = (b < a);
        } else {
            stack[stack.length] = (b < a) ? 1 : 0;
        }
    };

    /**
     * @param stack
     */
    ActionScript.prototype.ActionAnd = function (stack)
    {
        var _this = this;
        var a = stack.pop();
        var b = stack.pop();
        if (_this.version > 4) {
            a = _this.logicValue(a);
            b = _this.logicValue(b);
            stack[stack.length] = (a !== 0 && b !== 0);
        } else {
            a = _this.calc(a);
            b = _this.calc(b);
            stack[stack.length] = (a !== 0 && b !== 0) ? 1 : 0;
        }
    };

    /**
     * @param stack
     */
    ActionScript.prototype.ActionOr = function (stack)
    {
        var _this = this;
        var a = stack.pop();
        var b = stack.pop();
        if (_this.version > 4) {
            a = _this.logicValue(a);
            b = _this.logicValue(b);
            stack[stack.length] = (a !== 0 || b !== 0);
        } else {
            a = _this.calc(a);
            b = _this.calc(b);
            stack[stack.length] = (a !== 0 || b !== 0) ? 1 : 0;
        }
    };

    /**
     * @param stack
     */
    ActionScript.prototype.ActionNot = function (stack)
    {
        var _this = this;
        var a = stack.pop();
        if (_this.version > 4) {
            a = _this.logicValue(a);
            stack[stack.length] = (a === 0);
        } else {
            a = _this.calc(a);
            stack[stack.length] = (a === 0) ? 1 : 0;
        }
    };

    /**
     * @param stack
     */
    ActionScript.prototype.ActionStringEquals = function (stack)
    {
        var a = stack.pop();
        var b = stack.pop();

        if (a instanceof MovieClip) {
            a = a.getTarget();
        } else {
            a += "";
        }

        if (b instanceof MovieClip) {
            b = b.getTarget();
        } else {
            b += "";
        }

        if (this.version > 4) {
            stack[stack.length] = (b === a);
        } else {
            stack[stack.length] = (b === a) ? 1 : 0;
        }
    };

    /**
     * @param stack
     */
    ActionScript.prototype.ActionStringLength = function (stack)
    {
        var value = stack.pop();
        value = this.valueToString(value);
        var length = 0;
        var sLen = value.length;
        for (var i = 0; i < sLen; i++, length++) {
            var code = value.charCodeAt(i);
            if (code < 255) {
                continue;
            }
            length++;
        }
        stack[stack.length] = length;
    };

    /**
     * @param stack
     */
    ActionScript.prototype.ActionStringAdd = function (stack)
    {
        var a = stack.pop();
        var b = stack.pop();
        if (a === null || a === undefined) {
            a = "";
        }
        if (b === null || b === undefined) {
            b = "";
        }
        stack[stack.length] = b + "" + a;
    };

    /**
     * @param stack
     */
    ActionScript.prototype.ActionStringExtract = function (stack)
    {
        var count = stack.pop();
        var index = stack.pop();
        var string = stack.pop();
        string = this.valueToString(string);
        index--;
        if (index < 0) {
            index = 0;
        }
        stack[stack.length] = (count < 0) ? string.substr(index) : string.substr(index, count);
    };

    /**
     * @param stack
     */
    ActionScript.prototype.ActionStringLess = function (stack)
    {
        var a = stack.pop();
        var b = stack.pop();
        if (this.version > 4) {
            stack[stack.length] = (b < a);
        } else {
            stack[stack.length] = (b < a) ? 1 : 0;
        }
    };

    /**
     * @param stack
     * @param mc
     * @param values
     */
    ActionScript.prototype.ActionPush = function (stack, mc, values)
    {
        var _this = this;
        var length = values.length;
        var params = _this.params;
        for (var i = 0; i < length; i++) {
            var value = values[i];
            if (value instanceof Object) {
                var key = value.key;
                value = undefined;
                if (key in params) {
                    var name = params[key];
                    if (typeof name === "string") {
                        value = _this.getVariable(name);
                        if (value === undefined && !(name in _this.variables)) {
                            value = name;
                        }
                    } else {
                        value = name;
                    }
                }
            }
            stack[stack.length] = value;
        }
    };

    /**
     * @param stack
     */
    ActionScript.prototype.ActionAsciiToChar = function (stack)
    {
        var value = stack.pop();
        stack[stack.length] = _fromCharCode(value);
    };

    /**
     * @param stack
     */
    ActionScript.prototype.ActionCharToAscii = function (stack)
    {
        var value = stack.pop();
        value = this.valueToString(value);
        stack[stack.length] = value.charCodeAt(0);
    };

    /**
     * @param stack
     */
    ActionScript.prototype.ActionToInteger = function (stack)
    {
        var value = stack.pop();
        stack[stack.length] = value|0;
    };

    /**
     * @param stack
     * @param mc
     */
    ActionScript.prototype.ActionCall = function (stack, mc)
    {
        var value = stack.pop();
        if (mc) {
            value = this.valueToString(value);
            var splitData = value.split(":");
            var frame;
            var label = splitData[0];
            var targetMc = mc;
            if (splitData.length > 1) {
                targetMc = mc.getDisplayObject(splitData[0]);
                label = splitData[1];
            }
            if (targetMc instanceof MovieClip) {
                frame = (typeof label === "number") ? label : targetMc.getLabel(label);
                targetMc.executeActions(frame);
            }
        }
    };

    /**
     * @param stack
     * @param offset
     * @param index
     * @returns {*}
     */
    ActionScript.prototype.ActionIf = function (stack, offset, index)
    {
        var condition = stack.pop();
        switch (typeof condition) {
            case "boolean":
                break;
            case "string":
                if (!_isNaN(condition)) {
                    condition = +condition;
                }
                break;
        }
        if (condition) {
            return offset;
        }
        return index;
    };

    /**
     * @param stack
     * @param mc
     * @returns {undefined}
     */
    ActionScript.prototype.ActionGetVariable = function (stack, mc)
    {
        var _this = this;
        var name = stack.pop();
        var value;
        if (name instanceof MovieClip) {
            value = name;
        } else {
            value = _this.getNativeClass(name);
            if (value === undefined) {
                value = _this.getVariable(name);
                if (value === undefined && mc) {
                    value = mc.getProperty(name);
                }
            }
        }
        stack[stack.length] = value;
    };

    /**
     * @param stack
     * @param mc
     */
    ActionScript.prototype.ActionSetVariable = function (stack, mc)
    {
        var value = stack.pop();
        var name = stack.pop();
        if (!this.setVariable(name, value)) {
            mc.setProperty(name, value);
        }
    };

    /**
     * @param stack
     * @param aScript
     * @param mc
     */
    ActionScript.prototype.ActionGetURL2 = function (stack, aScript, mc)
    {
        var target = stack.pop();
        var value = stack.pop();
        var LoadVariablesFlag = aScript.LoadVariablesFlag; // 0=none, 1=LoadVariables
        var LoadTargetFlag = aScript.LoadTargetFlag; // 0=web, 1=Sprite
        var SendVarsMethod = aScript.SendVarsMethod; // 0=NONE, 1=GET, 2=POST
        var method = "GET";
        if (SendVarsMethod === 2) {
            method = "POST";
        }

        var url;
        if (mc instanceof MovieClip) {
            if (value) {
                value = this.valueToString(value);
                var urls = value.split("?");
                var uLen = urls.length;
                var query = "";
                if (uLen === 1) {
                    query = "?";
                }

                if (uLen > 2) {
                    url = urls[0] + "?";
                    url = url + urls[1];
                    for (var u = 2; u < uLen; u++) {
                        var params = urls[u];
                        url = url + "&" + params;
                    }
                } else {
                    url = value;
                }

                // local variables
                if (SendVarsMethod) {
                    var variables = mc.variables;
                    var queryString = "";
                    for (var key in variables) {
                        if (!variables.hasOwnProperty(key)) {
                            continue;
                        }
                        var val = variables[key];
                        if (val === null) {
                            val = "";
                        }
                        if (typeof val !== "string") {
                            var typeText = typeof val;
                            typeText = typeText.replace(/^[a-z]/g, function (str)
                            {
                                return str.toUpperCase();
                            });
                            val = "%5Btype+" + typeText + "%5D";
                        }
                        queryString += "&" + key + "=" + val;
                    }

                    if (query !== "" && queryString !== "") {
                        queryString = query + queryString.slice(1);
                    }
                    url += queryString;
                }

                if (LoadVariablesFlag) {
                    mc.loadVariables(url, target, method);
                } else if (LoadTargetFlag) {
                    if (target instanceof MovieClip) {
                        target.loadMovie(url, null, SendVarsMethod);
                    } else {
                        mc.loadMovie(url, target, SendVarsMethod);
                    }
                } else {
                    mc.getURL(url, target, method);
                }
            } else {
                mc.unloadMovie(target);
            }
        }
    };

    /**
     * @param stack
     * @param mc
     * @returns {*}
     */
    ActionScript.prototype.ActionGetProperty = function (stack, mc)
    {
        var index = stack.pop();
        var target = stack.pop();
        if (!_isNaN(index)) {
            index = _floor(index);
        }

        var _this = this;
        var value = _this.getVariable(index);
        if (value === undefined && mc) {
            var targetMc = mc;
            if (target) {
                if (typeof target !== "string") {
                    target += "";
                }
                targetMc = mc.getDisplayObject(target);
            }
            if (targetMc instanceof MovieClip) {
                value = targetMc.getProperty(index);
            }
        }
        stack[stack.length] = value;
    };

    /**
     * @param stack
     * @param aScript
     * @param mc
     */
    ActionScript.prototype.ActionGoToFrame2 = function (stack, aScript, mc)
    {
        var SceneBiasFlag = aScript.SceneBiasFlag;
        var PlayFlag = aScript.PlayFlag; // 0=stop, 1=play
        if (SceneBiasFlag === 1) {
            var SceneBias = aScript.SceneBias;
            console.log("SceneBias", SceneBias);
        }

        var frame = stack.pop();
        if (frame && mc) {
            if (_isNaN(frame)) {
                var splitData = frame.split(":");
                if (splitData.length > 1) {
                    var targetMc = mc.getDisplayObject(splitData[0]);
                    if (targetMc) {
                        frame = targetMc.getLabel(splitData[1]);
                    }
                } else {
                    frame = mc.getLabel(splitData[0]);
                }
            }

            if (typeof frame === "string") {
                frame |= 0;
            }

            if (typeof frame === "number" && frame > 0) {
                mc.setNextFrame(frame);
                if (PlayFlag) {
                    mc.play();
                } else {
                    mc.stop();
                }
            }
        }
    };

    /**
     * @param stack
     * @param movieClip
     * @param mc
     * @returns {*}
     */
    ActionScript.prototype.ActionSetTarget2 = function (stack, movieClip, mc)
    {
        var target = stack.pop();
        if (!movieClip) {
            movieClip = mc;
        }
        return movieClip.getDisplayObject(target);
    };

    /**
     * @param stack
     * @param mc
     */
    ActionScript.prototype.ActionSetProperty = function (stack, mc)
    {
        var value = stack.pop();
        var index = stack.pop();
        var target = stack.pop();
        if (!_isNaN(index)) {
            index = _floor(index);
        }

        if (mc) {
            var targetMc = mc;
            if (target !== undefined) {
                targetMc = mc.getDisplayObject(target);
            }
            if (targetMc instanceof MovieClip) {
                targetMc.setProperty(index, value);
            }
        }
    };

    /**
     * @param stack
     * @param mc
     */
    ActionScript.prototype.ActionStartDrag = function (stack, mc)
    {
        var target = stack.pop();
        var lock = stack.pop();
        var constrain = stack.pop();
        var y2 = null;
        var x2 = null;
        var y1 = null;
        var x1 = null;
        if (constrain) {
            y2 = stack.pop();
            x2 = stack.pop();
            y1 = stack.pop();
            x1 = stack.pop();
        }

        var targetMc = mc;
        if (target instanceof MovieClip) {
            targetMc = target;
        }

        if (typeof target === "string" && target) {
            targetMc = mc.getDisplayObject(target);
        }

        if (targetMc instanceof MovieClip) {
            targetMc.startDrag(lock, x1, y1, x2, y2);
        }
    };

    /**
     * @param stack
     * @param mc
     */
    ActionScript.prototype.ActionCloneSprite = function (stack, mc)
    {
        var depth = +stack.pop();
        var target = stack.pop();
        var source = stack.pop();
        if (mc) {
            mc.duplicateMovieClip(target, source, depth);
        }
    };

    /**
     * @param stack
     * @param mc
     */
    ActionScript.prototype.ActionRemoveSprite = function (stack, mc)
    {
        var target = stack.pop();
        if (mc) {
            mc.removeMovieClip(target);
        }
    };

    /**
     * @param mc
     */
    ActionScript.prototype.ActionEndDrag = function (mc)
    {
        if (mc) {
            mc.stopDrag();
        }
    };

    /**
     * @param stack
     */
    ActionScript.prototype.ActionGetTime = function (stack)
    {
        var now = new Date();
        stack[stack.length] = now.getTime() - StartDate.getTime();
    };

    /**
     * @param stack
     */
    ActionScript.prototype.ActionRandomNumber = function (stack)
    {
        var maximum = stack.pop();
        stack[stack.length] = _floor(_random() * maximum);
    };

    /**
     * @param stack
     */
    ActionScript.prototype.ActionTrace = function (stack)
    {
        var value = stack.pop();
        if (value instanceof DisplayObject && value.removeFlag) {
            value = "";
        }
        if (value && typeof value === "object") {
            if ("callee" in value) {
                value = Array.prototype.slice.call(value);
            }
            value = value.toString();
        }
        console.log("[trace] " + value);
    };

    /**
     * @param stack
     * @param mc
     */
    ActionScript.prototype.ActionFsCommand2 = function (stack, mc)
    {
        stack.pop(); // count
        var method = stack.pop();
        var now = new Date();
        switch (method.toLowerCase()) {
            case "getdateyear":
                stack[stack.length] = now.getFullYear();
                break;
            case "getdatemonth":
                stack[stack.length] = now.getMonth() + 1;
                break;
            case "getdateday":
                stack[stack.length] = now.getDate();
                break;
            case "getdateweekday":
                stack[stack.length] = now.getDay();
                break;
            case "gettimehours":
                stack[stack.length] = now.getHours();
                break;
            case "gettimeminutes":
                stack[stack.length] = now.getMinutes();
                break;
            case "gettimeseconds":
                stack[stack.length] = now.getSeconds();
                break;
            case "startvibrate":
                stack.pop();
                stack.pop();
                stack.pop();
                stack[stack.length] = -1;
                break;
            case "gettimezoneoffset":
                mc.setVariable(stack.pop(), now.toUTCString());
                mc.setVariable(stack.pop(), 0);
                break;
            case "getlocalelongdate":
                mc.setVariable(stack.pop(), now.toLocaleDateString());
                mc.setVariable(stack.pop(), 0);
                break;
            case "getlocaleshortdate":
                mc.setVariable(stack.pop(), now.toDateString());
                mc.setVariable(stack.pop(), 0);
                break;
            case "getlocaletime":
                mc.setVariable(stack.pop(), now.toLocaleTimeString());
                mc.setVariable(stack.pop(), 0);
                break;
            case "getnetworkname":
            case "getdevice":
            case "getdeviceid":
                mc.setVariable(stack.pop(), "");
                mc.setVariable(stack.pop(), -1);
                break;
            case "getlanguage":
                var language = _navigator.userLanguage ||
                    _navigator.language ||
                    _navigator.browserLanguage ||
                    "ja-JP";
                mc.setVariable(stack.pop(), language);
                mc.setVariable(stack.pop(), 0);
                break;
            case "setsoftkeys":
                stack.pop();
                stack.pop();
                stack[stack.length] = -1;
                break;
            case "fullscreen":
                stack.pop(); // bool
                stack[stack.length] = -1;
                break;
            case "setquality":
            case "getfreestagememory":
            case "gettotalstagememory":
                stack.pop();
                stack[stack.length] = -1;
                break;
            default:
                stack[stack.length] = -1;
                break;
        }
    };

    /**
     * @param stack
     * @param mc
     */
    ActionScript.prototype.ActionCallMethod = function (stack, mc)
    {
        var _this = this;
        var method = stack.pop();
        var object = stack.pop();
        var count = +stack.pop();
        var params = [];
        if (count > 0) {
            while (count) {
                count--;
                var param = stack.pop();
                if (param && typeof param === "object" && "callee" in param) {
                    param = Array.prototype.slice.call(param);
                }
                params[params.length] = param;
            }
        }

        if (typeof object === "string" && object[method] === undefined) {
            var target = _this.stringToObject(object, mc);
            if (target) {
                object = target;
            }

            if (object === "super") {
                var caller = _this.variables["this"];
                var SuperClass = _this.getSuperClass();
                if (!method && SuperClass) {
                    var sc = new SuperClass();
                    switch (SuperClass) {
                        case MovieClip:
                            var loadStage = mc.getStage();
                            sc.setStage(loadStage);
                            sc.setParent(mc);
                            sc._extend = true;
                            break;
                    }

                    var proto = Object.getPrototypeOf(caller);
                    proto.constructor = SuperClass;
                    Object.setPrototypeOf(proto, sc);
                    Object.setPrototypeOf(caller, proto);
                } else {
                    object = caller;
                }
            }
        }

        var value;
        if (object && method) {
            var func;
            if (typeof object === "object") {
                var variables = object.variables;
                if (variables) {
                    func = variables[method];
                    if (!func && variables.registerClass) {
                        func = variables.registerClass[method];
                    }
                }
            }

            if (!func) {
                var originMethod = _this.checkMethod(method);
                if (originMethod) {
                    func = object[originMethod];
                }
            }

            if (!func) {
                func = object[method];
            }

            if (!func && object instanceof MovieClip) {
                func = object.getVariable(method);
            }

            if (!func && object instanceof Global) {
                func = window[method];
                if (func) {
                    params = _this.ActionNativeFunction(params, mc);
                    object = window;
                }
            }

            if (method === "call" || method === "apply") {
                func = object;
                object = params.shift();
                if (method === "apply") {
                    var args = params.shift();
                    params = [];
                    if (args) {
                        params = Array.prototype.slice.call(args);
                    }
                }
            }

            if (func && typeof func === "function") {
                switch (true) {
                    case object instanceof MovieClipLoader:
                        if (method === "loadClip" && typeof params[1] === "string") {
                            var targetStr = params[1];
                            params[1] = mc.getDisplayObject(targetStr);
                        }
                        break;
                }
                value = func.apply(object, params);
            }

            if (!func && object instanceof Object && typeof method === "string") {
                switch (method.toLowerCase()) {
                    case "registerclass":
                        value = false;
                        var _root = mc.getDisplayObject("_root");
                        var stage = _root.getStage();
                        var characterId = stage.exportAssets[params[0]];
                        if (characterId) {
                            stage.registerClass[characterId] = params[1];
                            value = true;
                        }
                        break;
                    case "addproperty":
                        _this.addProperty(object, params);
                        break;
                }
            }
        } else {
            if (!method && typeof object === "function") {
                value = object.apply(_this.variables["this"], params);
            }
        }

        stack[stack.length] = value;
    };

    /**
     * @param target
     * @param params
     * @returns {boolean}
     */
    ActionScript.prototype.addProperty = function (target, params)
    {
        var property = params[0];
        if (typeof property !== "string" || property === "") {
            return false;
        }

        var getter = params[1];
        if (!getter) {
            getter = function () {};
        }
        var setter = params[2];
        if (!setter) {
            setter = function () {};
        }

        if (typeof getter !== "function" || typeof setter !== "function") {
            return false;
        }

        Object.defineProperty(target, property,
        {
            get: getter,
            set: setter
        });

        return true;
    };

    /**
     * @param args
     * @param mc
     * @returns {Array}
     */
    ActionScript.prototype.ActionNativeFunction = function (args, mc)
    {
        var targetMc = mc;
        var params = args;
        if (args[0] instanceof MovieClip) {
            // setInterval, setTimeout
            targetMc = args.shift();
            if (args.length > 0) {
                var obj = args.shift();
                var as;
                if (typeof obj === "string") {
                    as = this.getVariable(obj);
                    if (typeof as !== "function") {
                        as = targetMc.getVariable(obj);
                    }
                }
                if (typeof as === "function") {
                    var time = args.shift();
                    var action = (function (script, mc, args)
                    {
                        return function ()
                        {
                            script.apply(mc, args);
                        };
                    })(as, targetMc, args);
                    params = [];
                    params[params.length] = action;
                    params[params.length] = time;
                } else {
                    console.log("DEBUG: ", params);
                    args.unshift(obj);
                    params = args;
                }
            }
        }
        return params;
    };

    /**
     * @param stack
     * @param mc
     */
    ActionScript.prototype.ActionCallFunction = function (stack, mc)
    {
        var _this = this;
        var name = stack.pop();
        var count = +stack.pop();
        var params = [];
        if (count > 0) {
            while (count) {
                count--;
                var param = stack.pop();
                if (param && typeof param === "object" && "callee" in param) {
                    param = Array.prototype.slice.call(param);
                }
                params[params.length] = param;
            }
        }

        if (mc) {
            var caller = mc;
            var func;
            var method = _this.checkMethod(name);
            if (method) {
                func = mc[method];
            } else {
                func = mc.variables[name];
                if (!func) {
                    var registerClass = mc.variables.registerClass;
                    if (registerClass && typeof registerClass === "object") {
                        func = registerClass[name];
                    }

                    if (!func) {
                        if (window[name]) {
                            caller = window;
                            params = _this.ActionNativeFunction(params, mc);
                            func = window[name];
                        } else {
                            func = mc.getVariable(name);
                        }
                    }
                }
            }
            stack[stack.length] = (func) ? func.apply(caller, params) : undefined;
        }
    };

    /**
     * @param stack
     * @param aScript
     * @param mc
     */
    ActionScript.prototype.ActionDefineFunction = function (stack, aScript, mc)
    {
        var action = mc.createActionScript2(aScript.ActionScript, this);
        var name = aScript.FunctionName;
        if (name !== "") {
            mc.setVariable(name, action);
        } else {
            stack[stack.length] = action;
        }
    };

    /**
     * @param stack
     * @param mc
     */
    ActionScript.prototype.ActionDefineLocal = function (stack, mc)
    {
        var _this = this;
        var value = stack.pop();
        var name = stack.pop();
        if (_this.parent) {
            _this.variables[name] = value;
        } else {
            mc.setVariable(name, value);
        }
    };

    /**
     * @param stack
     * @param mc
     */
    ActionScript.prototype.ActionDefineLocal2 = function (stack, mc)
    {
        var _this = this;
        var name = stack.pop();
        if (_this.parent) {
            _this.variables[name] = undefined;
        } else {
            mc.setVariable(name, undefined);
        }
    };

    /**
     * @param stack
     * @param mc
     */
    ActionScript.prototype.ActionDelete = function (stack, mc)
    {
        var name = stack.pop();
        var object = stack.pop();

        if (typeof object === "string") {
            var target = this.stringToObject(object, mc);
            if (target) {
                object = target;
            }
        }

        if (object instanceof MovieClip) {
            object.setVariable(name, undefined);
        }
    };

    /**
     * @param stack
     * @param mc
     */
    ActionScript.prototype.ActionDelete2 = function (stack, mc)
    {
        var name = stack.pop();
        if (mc) {
            mc.setVariable(name, undefined);
        }
    };

    /**
     * @param stack
     * @param mc
     */
    ActionScript.prototype.ActionEnumerate = function (stack, mc)
    {
        var object = stack.pop();
        stack[stack.length] = null;

        if (typeof object === "string") {
            object = this.stringToObject(object, mc);
        }

        if (object instanceof Object) {
            var name;
            switch (true) {
                case object instanceof DisplayObject:
                    var container = object.getTags();
                    var stage = object.getStage();
                    for (name in container) {
                        if (!container.hasOwnProperty(name)) {
                            continue;
                        }
                        var id = container[name];
                        var instance = stage.getInstance(id);
                        var prop = "instance" + id;
                        if (instance.getName()) {
                            prop = instance.getName();
                        }
                        stack[stack.length] = prop;
                    }
                    var variables = object.variables;
                    for (name in variables) {
                        if (!variables.hasOwnProperty(name)) {
                            continue;
                        }
                        stack[stack.length] = name;
                    }
                    break;
                default:
                    for (name in object) {
                        if (!object.hasOwnProperty(name)) {
                            continue;
                        }
                        stack[stack.length] = name;
                    }
                    break;
            }
        }
    };

    /**
     * @param stack
     */
    ActionScript.prototype.ActionEquals2 = function (stack)
    {
        var a = stack.pop();
        var b = stack.pop();
        var A = a;
        var B = b;
        if (a instanceof MovieClip) {
            A = a.getTarget();
        }
        if (b instanceof MovieClip) {
            B = b.getTarget();
        }
        stack[stack.length] = (B == A);
    };

    /**
     * @param stack
     * @param mc
     */
    ActionScript.prototype.ActionGetMember = function (stack, mc)
    {
        var _this = this;
        var property;
        var name = stack.pop();
        var object = stack.pop();
        if (typeof object === "string") {
            var target = _this.stringToObject(object, mc);
            if (target ) {
                object = target;
            }
        }

        if (object) {
            switch (true) {
                default:
                    property = object[name];
                    break;
                case object instanceof DisplayObject:
                case object instanceof Global:
                    if (!object._extend) {
                        property = object.getProperty(name, false);
                        if (property === undefined &&
                            typeof name === "string" &&
                            name.substr(0, 8) === "instance"
                        ) {
                            var stage = object.getStage();
                            var id = name.split("instance")[1];
                            property = stage.getInstance(id);
                        }

                        if (property === undefined && _this.checkMethod(name)) {
                            property = object[name];
                        }

                    } else {
                        property = object[name];
                    }
                    break;
                case object instanceof Element && name === "childNodes":
                    var childNodes = object[name];
                    var length = childNodes.length;
                    property = [];
                    if (length) {
                        for (var i = 0; i < length; i++) {
                            var node = childNodes[i];
                            if (node.nodeType !== 1) {
                                continue;
                            }
                            property[property.length] = node;
                        }
                    }
                    break;
                case object instanceof window.NamedNodeMap:
                    var item = object.getNamedItem(name);
                    property = item.value;
                    break;
            }
        }
        stack[stack.length] = property;
    };

    /**
     * @param stack
     */
    ActionScript.prototype.ActionInitArray = function (stack)
    {
        var number = stack.pop();
        var array = [];
        if (number > 0) {
            while (number--) {
                array[array.length] = stack.pop();
            }
        }
        stack[stack.length] = array;
    };

    /**
     * @param stack
     */
    ActionScript.prototype.ActionInitObject = function (stack)
    {
        var number = stack.pop();
        var object = {};
        if (number > 0) {
            while (number--) {
                var value = stack.pop();
                var property = stack.pop();
                object[property] = value;
            }
        }
        stack[stack.length] = object;
    };

    /**
     * @param stack
     * @param mc
     */
    ActionScript.prototype.ActionNewMethod = function (stack, mc)
    {
        var method = stack.pop();
        var object = stack.pop();
        var number = stack.pop();
        var params = [];
        if (number > 0) {
            while (number--) {
                var param = stack.pop();
                if (param && typeof param === "object" && "callee" in param) {
                    param = Array.prototype.slice.call(param);
                }
                params[params.length] = param;
            }
        }

        var constructor;
        if (method === "") {
            constructor = object.apply(object, params);
        }
        if (!constructor && method in object) {
            constructor = this.CreateNewActionScript(object[method], mc, params);
        }
        if (!constructor && method in window) {
            if (method === "CSSStyleDeclaration") {
                constructor = undefined;
            } else {
                constructor = this.CreateNewActionScript(window[method], mc, params);
            }
        }
        stack[stack.length] = constructor;
    };

    /**
     * @param stack
     * @param mc
     */
    ActionScript.prototype.ActionNewObject = function (stack, mc)
    {
        var object = stack.pop();
        var numArgs = +stack.pop();
        var params = [];
        if (numArgs > 0) {
            while (numArgs) {
                numArgs--;
                var param = stack.pop();
                if (param && typeof param === "object" && "callee" in param) {
                    param = Array.prototype.slice.call(param);
                }
                params[params.length] = param;
            }
        }

        var obj = {};
        if (object in window) {
            params.unshift(window[object]);
            obj = new (Function.prototype.bind.apply(window[object], params))();
        } else {
            switch (object) {
                case "Object":
                    obj = {};
                    break;
                case "MovieClip":
                    obj = new MovieClip();
                    var stage = mc.getStage();
                    obj.setStage(stage);
                    obj.setParent(mc);
                    break;
                case "Sound":
                    obj = new Sound(mc);
                    obj.movieClip = mc;
                    break;
                case "XML":
                    obj = new Xml();
                    break;
                case "LoadVars":
                    obj = new LoadVars();
                    break;
                case "Color":
                    obj = new Color(params[0]);
                    break;
                case "TextFormat":
                    obj = new TextFormat();
                    break;
                case "MovieClipLoader":
                    obj = new MovieClipLoader();
                    break;
                default:
                    if (mc) {
                        var _this = this;
                        var func = _this.getVariable(object) || mc.getVariable(object);
                        obj = _this.CreateNewActionScript(func, mc, params);
                    }
                    break;
            }
        }
        stack[stack.length] = obj;
    };

    /**
     * @param name
     * @returns {*}
     */
    ActionScript.prototype.getNativeClass = function (name)
    {
        var value;
        switch (name) {
            case "MovieClip":
                value = MovieClip;
                break;
            case "Sprite":
                value = Sprite;
                break;
            case "SimpleButton":
                value = SimpleButton;
                break;
            case "TextField":
                value = TextField;
                break;
            case "Shape":
                value = Shape;
                break;
            case "Sound":
                value = Sound;
                break;
            case "XML":
                value = Xml;
                break;
            case "LoadVars":
                value = LoadVars;
                break;
            case "Color":
                value = Color;
                break;
            case "TextFormat":
                value = TextFormat;
                break;
            case "MovieClipLoader":
                value = MovieClipLoader;
                break;
        }
        return value;
    };

    /**
     * @param Constr
     * @param mc
     * @param params
     * @returns {*}
     */
    ActionScript.prototype.CreateNewActionScript = function (Constr, mc, params)
    {
        if (Constr) {
            params.unshift(Constr);
            return new (Function.prototype.bind.apply(Constr, params))();
        }
        return undefined;
    };

    /**
     * @param stack
     * @param mc
     */
    ActionScript.prototype.ActionSetMember = function (stack, mc)
    {
        var value = stack.pop();
        var name = stack.pop();
        var object = stack.pop();
        if (object) {
            if (typeof object === "string") {
                var target = this.stringToObject(object, mc);
                if (target) {
                    object = target;
                }
            }

            if (typeof object === "object" || typeof object === "function") {
                switch (true) {
                    default:
                    case object === MovieClip.prototype:
                    case object === TextField.prototype:
                    case object === SimpleButton.prototype:
                    case object === Sprite.prototype:
                    case object === Shape.prototype:
                        object[name] = value;
                        break;
                    case object instanceof DisplayObject:
                    case object instanceof Global:
                        if (!object._extend) {
                            object.setProperty(name, value, false);
                        } else {
                            object[name] = value;
                        }
                        break;
                }
            }
        }
    };

    /**
     * @param stack
     */
    ActionScript.prototype.ActionTargetPath = function (stack)
    {
        console.log("ActionTargetPath");
        var object = stack.pop();
        var path = null;
        if (object instanceof MovieClip) {
            path = object.getName();
            if (path !== null) {
                while (true) {
                    var parent = object.getParent();
                    if (parent === null) {
                        path = "/" + path;
                        break;
                    }

                    var name = parent.getName();
                    if (name === null) {
                        path = null;
                        break;
                    }

                    path = name + "/" + path;
                }
            }
        }
        stack[stack.length] = path;
    };

    /**
     * @param stack
     * @param size
     * @param mc
     * @returns {*}
     */
    ActionScript.prototype.ActionWith = function (stack, size, mc)
    {
        var object = mc;
        if (size) {
            object = stack.pop();
        }
        return object;
    };

    /**
     * @param stack
     */
    ActionScript.prototype.ActionToNumber = function (stack)
    {
        var object = +stack.pop();
        stack[stack.length] = object;
    };

    /**
     * @param stack
     */
    ActionScript.prototype.ActionToString = function (stack)
    {
        var object = stack.pop();
        stack[stack.length] = this.valueToString(object);
    };

    /**
     * @param stack
     */
    ActionScript.prototype.ActionTypeOf = function (stack)
    {
        var object = stack.pop();
        var str = "";
        switch (true) {
            case object instanceof MovieClip:
                str = "movieclip";
                break;
            default:
                str = typeof object;
                break;
        }
        stack[stack.length] = str;
    };

    /**
     * @param stack
     */
    ActionScript.prototype.ActionAdd2 = function (stack)
    {
        var a = stack.pop();
        var b = stack.pop();
        stack[stack.length] = b + a;
    };

    /**
     * @param stack
     */
    ActionScript.prototype.ActionLess2 = function (stack)
    {
        var a = stack.pop();
        var b = stack.pop();
        stack[stack.length] = (b < a);
    };

    /**
     * @param stack
     */
    ActionScript.prototype.ActionModulo = function (stack)
    {
        var y = stack.pop();
        var x = stack.pop();
        stack[stack.length] = x % y;
    };

    /**
     * @param stack
     */
    ActionScript.prototype.ActionBitAnd = function (stack)
    {
        var a = stack.pop();
        var b = stack.pop();
        stack[stack.length] = b & a;
    };

    /**
     * @param stack
     */
    ActionScript.prototype.ActionBitLShift = function (stack)
    {
        var a = stack.pop();
        var b = stack.pop();
        stack[stack.length] = b << a;
    };

    /**
     * @param stack
     */
    ActionScript.prototype.ActionBitOr = function (stack)
    {
        var a = stack.pop();
        var b = stack.pop();
        stack[stack.length] = b | a;
    };

    /**
     * @param stack
     */
    ActionScript.prototype.ActionBitRShift = function (stack)
    {
        var a = stack.pop();
        var b = stack.pop();
        stack[stack.length] = b >> a;
    };

    /**
     * @param stack
     */
    ActionScript.prototype.ActionBitURShift = function (stack)
    {
        var a = stack.pop();
        var b = stack.pop();
        stack[stack.length] = b >> a;
    };

    /**
     * @param stack
     */
    ActionScript.prototype.ActionBitXor = function (stack)
    {
        var a = stack.pop();
        var b = stack.pop();
        stack[stack.length] = a ^ b;
    };

    /**
     * @param stack
     */
    ActionScript.prototype.ActionDecrement = function (stack)
    {
        var value = +stack.pop();
        value--;
        stack[stack.length] = value;
    };

    /**
     * @param stack
     */
    ActionScript.prototype.ActionIncrement = function (stack)
    {
        var value = +stack.pop();
        value++;
        stack[stack.length] = value;
    };

    /**
     * @param stack
     */
    ActionScript.prototype.ActionPushDuplicate = function (stack)
    {
        var length = stack.length;
        stack[length] = stack[length - 1];
    };

    /**
     * @param stack
     */
    ActionScript.prototype.ActionStackSwap = function (stack)
    {
        var a = stack.pop();
        var b = stack.pop();
        stack[stack.length] = a;
        stack[stack.length] = b;
    };

    /**
     * @param stack
     * @param number
     */
    ActionScript.prototype.ActionStoreRegister = function (stack, number)
    {
        this.params[number] = stack[stack.length - 1];
    };

    /**
     * @param stack
     */
    ActionScript.prototype.ActionInstanceOf = function (stack)
    {
        var constr = stack.pop();
        var object = stack.pop();
        stack[stack.length] = (object instanceof constr);
    };

    /**
     * @param stack
     */
    ActionScript.prototype.ActionStrictEquals = function (stack)
    {
        var a = stack.pop();
        var b = stack.pop();
        stack[stack.length] = (b === a);
    };

    /**
     * @param stack
     */
    ActionScript.prototype.ActionGreater = function (stack)
    {
        var a = stack.pop();
        var b = stack.pop();
        stack[stack.length] = (b > a);
    };

    /**
     * @param stack
     */
    ActionScript.prototype.ActionExtends = function (stack)
    {
        var SuperClass = stack.pop();
        var SubClass = stack.pop();
        if (SuperClass && SubClass) {
            this.superClass = SuperClass;
        }
    };

    /**
     * @param stack
     */
    ActionScript.prototype.ActionCastOp = function (stack)
    {
        var object = stack.pop();
        var func = stack.pop();
        stack[stack.length] = (typeof func === "function" &&
            object instanceof func.prototype.constructor) ? object : null;
    };

    /**
     * @param stack
     */
    ActionScript.prototype.ActionImplementsOp = function (stack)
    {
        console.log("ActionImplementsOp");
        var func = stack.pop();
        console.log(func);
        var count = stack.pop();
        var params = [];
        if (count > 0) {
            while (count--) {
                params[params.length] = stack.pop();
            }
        }
        stack[stack.length] = null;
    };

    /**
     * @param script
     * @param mc
     */
    ActionScript.prototype.ActionTry = function (script, mc)
    {

        try {
            script.try.apply(mc);
        } catch (e) {
            if (script.CatchBlockFlag) {
                script.catch.apply(mc,[e]);
            }
        } finally {
            if (script.FinallyBlockFlag) {
                script.finally.apply(mc);
            }
        }
    };

    /**
     * ActionThrow
     */
    ActionScript.prototype.ActionThrow = function (stack)
    {
        var value = stack.pop();
        throw value.message;
    };


    /**
     *
     * @constructor
     */
    var BitmapFilter = function () {};

    /**
     * @param color
     * @param data
     * @returns {{R: number, G: number, B: number, A: number}}
     */
    BitmapFilter.prototype.generateColorTransform = function (color, data)
    {
        return {
            R: _max(0, _min((color.R * data[0]) + data[4], 255))|0,
            G: _max(0, _min((color.G * data[1]) + data[5], 255))|0,
            B: _max(0, _min((color.B * data[2]) + data[6], 255))|0,
            A: _max(0, _min((color.A * 255 * data[3]) + data[7], 255)) / 255
        };
    };

    /**
     * @param int
     * @param alpha
     * @returns {{R: number, G: number, B: number, A: number}}
     */
    BitmapFilter.prototype.intToRGBA = function (int, alpha)
    {
        alpha = alpha || 100;
        return {
            R: (int & 0xff0000) >> 16,
            G: (int & 0x00ff00) >> 8,
            B: (int & 0x0000ff),
            A: (alpha / 100)
        };
    };

    /**
     * @param inner
     * @param knockout
     * @param hideObject
     * @returns {*}
     */
    BitmapFilter.prototype.filterOperation = function (inner, knockout, hideObject)
    {
        var operation = "source-over";
        if (knockout === true) {
            if (inner) {
                operation = "source-in";
            } else {
                operation = "source-out";
            }
        } else {
            if (hideObject === true) {
                if (inner) {
                    operation = "source-in";
                } else {
                    operation = "copy";
                }
            } else {
                if (inner) {
                    operation = "source-atop";
                } else {
                    operation = "destination-over";
                }
            }
        }
        return operation;
    };

    /**
     * @param ctx
     * @param color
     * @param inner
     * @param strength
     * @returns {*}
     */
    BitmapFilter.prototype.coatOfColor = function (ctx, color, inner, strength)
    {
        var canvas = ctx.canvas;
        var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        var i = 0;
        var pxData = imgData.data;
        var R = color.R;
        var G = color.G;
        var B = color.B;
        var length = pxData.length;
        for (; i < length; i += 4) {
            var aKey = i + 3;
            var alpha = pxData[aKey];
            if (!inner) {
                if (alpha !== 0) {
                    pxData[i] = R|0;
                    pxData[i + 1] = G|0;
                    pxData[i + 2] = B|0;
                    pxData[aKey] = alpha|0;
                }
            } else {
                if (alpha !== 255) {
                    pxData[i] = R|0;
                    pxData[i + 1] = G|0;
                    pxData[i + 2] = B|0;
                    pxData[aKey] = 255 - (alpha|0);
                }
            }
        }

        ctx.putImageData(imgData, 0, 0);
        if (strength > 0) {
            for (i = 1; i < strength; i++) {
                ctx.drawImage(ctx.canvas, 0, 0);
            }
        }
        return ctx;
    };

    /**
     * clone
     */
    BitmapFilter.prototype.clone = function ()
    {
        var _this = this;
        var args = [];
        for (var prop in _this) {
            if (!_this.hasOwnProperty(prop)) {
                continue;
            }
            args[args.length] = _this[prop];
        }

        var type = _this.filterId;
        var filter = _this;
        switch (type) {
            case 0: // DropShadowFilter
                filter = new (Function.prototype.bind.apply(DropShadowFilter, args))();
                break;
            case 1: // BlurFilter
                filter = new (Function.prototype.bind.apply(BlurFilter, args))();
                break;
            case 2: // GlowFilter
                filter = new (Function.prototype.bind.apply(GlowFilter, args))();
                break;
            case 3: // BevelFilter
                filter = new (Function.prototype.bind.apply(BevelFilter, args))();
                break;
            case 4: // GradientGlowFilter
                filter = new (Function.prototype.bind.apply(GradientGlowFilter, args))();
                break;
            case 5: // ConvolutionFilter
                filter = new (Function.prototype.bind.apply(ConvolutionFilter, args))();
                break;
            case 6: // ColorMatrixFilter
                filter = new (Function.prototype.bind.apply(ColorMatrixFilter, args))();
                break;
            case 7: // GradientBevelFilter
                filter = new (Function.prototype.bind.apply(GradientBevelFilter, args))();
                break;
        }
        return filter;
    };

    /**
     * @param rgb
     * @returns {Number}
     */
    BitmapFilter.prototype.toColorInt = function (rgb)
    {
        if (typeof rgb === "string") {
            var canvas = cacheStore.getCanvas();
            canvas.width = 1;
            canvas.height = 1;
            var ctx = canvas.getContext("2d");
            ctx.fillStyle = rgb;
            rgb = "0x" + ctx.fillStyle.substr(1);
            cacheStore.destroy(ctx);
        }
        return rgb;
    };

    /**
     * @constructor
     */
    var BlurFilter = function ()
    {
        var _this = this;
        BitmapFilter.call(_this);

        _this.filterId = 1;
        _this.blurX = 4;
        _this.blurY = 4;
        _this.quality = 1;

        var arg = arguments;
        var blurX = arg[0]|0;
        if (!_isNaN(blurX) && 0 <= blurX && 255 >= blurX) {
            _this.blurX = blurX;
        }

        var blurY = arg[1]|0;
        if (!_isNaN(blurY) && 0 <= blurY && 255 >= blurY) {
            _this.blurY = blurY;
        }

        var quality = arg[2]|0;
        if (!_isNaN(quality) && 1 <= quality && 15 >= quality) {
            _this.quality = quality;
        }
    };

    /**
     * extends
     * @type {BitmapFilter}
     */
    BlurFilter.prototype = Object.create(BitmapFilter.prototype);
    BlurFilter.prototype.constructor = BlurFilter;

    /**
     * @param cache
     * @param matrix
     * @param colorTransform
     * @param stage
     * @returns {*}
     */
    BlurFilter.prototype.render = function (cache, matrix, colorTransform, stage)
    {
        var cacheCanvas = cache.canvas;
        var canvas = cacheStore.getCanvas();
        canvas.width = cacheCanvas.width;
        canvas.height = cacheCanvas.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(cacheCanvas, 0, 0);
        ctx._offsetX = cache._offsetX;
        ctx._offsetY = cache._offsetY;
        return this.executeFilter(ctx, stage);
    };

    /**
     * @param ctx
     * @param stage
     * @returns {*}
     */
    BlurFilter.prototype.executeFilter = function (ctx, stage)
    {
        var _this = this;

        var _blurX = _this.blurX;
        var _blurY = _this.blurY;
        if (_blurX === 0 && _blurY === 0) {
            return ctx;
        }

        if (_blurX === 0) {
            _blurX = 4;
        }

        if (_blurY === 0) {
            _blurY = 4;
        }

        var _quality = _this.quality;
        var scale = stage.getScale();

        var STEP = [0.5, 1.05, 1.35, 1.55, 1.75, 1.9, 2, 2.1, 2.2, 2.3, 2.5, 3, 3, 3.5, 3.5];
        var stepNo = STEP[_quality - 1];
        var blurX = _ceil(_blurX * stepNo * scale * devicePixelRatio);
        var blurY = _ceil(_blurY * stepNo * scale * devicePixelRatio);

        var canvas = ctx.canvas;
        var width = _ceil(canvas.width + (blurX * 2) + 1);
        var height = _ceil(canvas.height + (blurY * 2) + 1);

        var blurCanvas = cacheStore.getCanvas();
        blurCanvas.width = width;
        blurCanvas.height = height;
        var blurCtx = blurCanvas.getContext("2d");
        var offsetX = blurX;
        var offsetY = blurY;

        blurCtx._offsetX = blurX + ctx._offsetX;
        blurCtx._offsetY = blurY + ctx._offsetY;
        blurCtx.drawImage(canvas, offsetX, offsetY);

        var imgData = blurCtx.getImageData(0, 0, width, height);
        var px = imgData.data;

        var radiusX = (offsetX) >> 1;
        var radiusY = (offsetY) >> 1;

        var MUL = [1, 171, 205, 293, 57, 373, 79, 137, 241, 27, 391, 357, 41, 19, 283, 265, 497, 469, 443, 421, 25, 191, 365, 349, 335, 161, 155, 149, 9, 278, 269, 261, 505, 245, 475, 231, 449, 437, 213, 415, 405, 395, 193, 377, 369, 361, 353, 345, 169, 331, 325, 319, 313, 307, 301, 37, 145, 285, 281, 69, 271, 267, 263, 259, 509, 501, 493, 243, 479, 118, 465, 459, 113, 446, 55, 435, 429, 423, 209, 413, 51, 403, 199, 393, 97, 3, 379, 375, 371, 367, 363, 359, 355, 351, 347, 43, 85, 337, 333, 165, 327, 323, 5, 317, 157, 311, 77, 305, 303, 75, 297, 294, 73, 289, 287, 71, 141, 279, 277, 275, 68, 135, 67, 133, 33, 262, 260, 129, 511, 507, 503, 499, 495, 491, 61, 121, 481, 477, 237, 235, 467, 232, 115, 457, 227, 451, 7, 445, 221, 439, 218, 433, 215, 427, 425, 211, 419, 417, 207, 411, 409, 203, 202, 401, 399, 396, 197, 49, 389, 387, 385, 383, 95, 189, 47, 187, 93, 185, 23, 183, 91, 181, 45, 179, 89, 177, 11, 175, 87, 173, 345, 343, 341, 339, 337, 21, 167, 83, 331, 329, 327, 163, 81, 323, 321, 319, 159, 79, 315, 313, 39, 155, 309, 307, 153, 305, 303, 151, 75, 299, 149, 37, 295, 147, 73, 291, 145, 289, 287, 143, 285, 71, 141, 281, 35, 279, 139, 69, 275, 137, 273, 17, 271, 135, 269, 267, 133, 265, 33, 263, 131, 261, 130, 259, 129, 257, 1];

        var SHG = [0, 9, 10, 11, 9, 12, 10, 11, 12, 9, 13, 13, 10, 9, 13, 13, 14, 14, 14, 14, 10, 13, 14, 14, 14, 13, 13, 13, 9, 14, 14, 14, 15, 14, 15, 14, 15, 15, 14, 15, 15, 15, 14, 15, 15, 15, 15, 15, 14, 15, 15, 15, 15, 15, 15, 12, 14, 15, 15, 13, 15, 15, 15, 15, 16, 16, 16, 15, 16, 14, 16, 16, 14, 16, 13, 16, 16, 16, 15, 16, 13, 16, 15, 16, 14, 9, 16, 16, 16, 16, 16, 16, 16, 16, 16, 13, 14, 16, 16, 15, 16, 16, 10, 16, 15, 16, 14, 16, 16, 14, 16, 16, 14, 16, 16, 14, 15, 16, 16, 16, 14, 15, 14, 15, 13, 16, 16, 15, 17, 17, 17, 17, 17, 17, 14, 15, 17, 17, 16, 16, 17, 16, 15, 17, 16, 17, 11, 17, 16, 17, 16, 17, 16, 17, 17, 16, 17, 17, 16, 17, 17, 16, 16, 17, 17, 17, 16, 14, 17, 17, 17, 17, 15, 16, 14, 16, 15, 16, 13, 16, 15, 16, 14, 16, 15, 16, 12, 16, 15, 16, 17, 17, 17, 17, 17, 13, 16, 15, 17, 17, 17, 16, 15, 17, 17, 17, 16, 15, 17, 17, 14, 16, 17, 17, 16, 17, 17, 16, 15, 17, 16, 14, 17, 16, 15, 17, 16, 17, 17, 16, 17, 15, 16, 17, 14, 17, 16, 15, 17, 16, 17, 13, 17, 16, 17, 17, 16, 17, 14, 17, 16, 17, 16, 17, 16, 17, 9];

        var mtx = MUL[radiusX];
        var stx = SHG[radiusX];
        var mty = MUL[radiusY];
        var sty = SHG[radiusY];

        var x = 0;
        var y = 0;
        var p = 0;
        var yp = 0;
        var yi = 0;
        var yw = 0;
        var r = 0;
        var g = 0;
        var b = 0;
        var a = 0;
        var pr = 0;
        var pg = 0;
        var pb = 0;
        var pa = 0;

        var divx = radiusX + radiusX + 1;
        var divy = radiusY + radiusY + 1;
        var w = imgData.width;
        var h = imgData.height;

        var w1 = w - 1;
        var h1 = h - 1;
        var rxp1 = radiusX + 1;
        var ryp1 = radiusY + 1;

        var ssx = {r: 0, b: 0, g: 0, a: 0};
        var sx = ssx;
        for (var i = 1; i < divx; i++) {
            sx = sx.n = {r: 0, b: 0, g: 0, a: 0};
        }
        sx.n = ssx;

        var ssy = {r: 0, b: 0, g: 0, a: 0};
        var sy = ssy;
        for (i = 1; i < divy; i++) {
            sy = sy.n = {r: 0, b: 0, g: 0, a: 0};
        }
        sy.n = ssy;

        var si = null;
        while (_quality-- > 0) {

            yw = yi = 0;
            var ms = mtx | 0;
            var ss = stx | 0;
            for (y = h; --y > -1;) {
                pr = px[yi];
                pg = px[yi + 1];
                pb = px[yi + 2];
                pa = px[yi + 3];
                r = rxp1 * pr;
                g = rxp1 * pg;
                b = rxp1 * pb;
                a = rxp1 * pa;

                sx = ssx;

                for (i = rxp1; --i > -1;) {
                    sx.r = pr;
                    sx.g = pg;
                    sx.b = pb;
                    sx.a = pa;
                    sx = sx.n;
                }

                for (i = 1; i < rxp1; i++) {
                    p = (yi + ((w1 < i ? w1 : i) << 2)) | 0;
                    r += (sx.r = px[p]);
                    g += (sx.g = px[p + 1]);
                    b += (sx.b = px[p + 2]);
                    a += (sx.a = px[p + 3]);
                    sx = sx.n;
                }

                si = ssx;
                for (x = 0; x < w; x++) {
                    px[yi++] = (r * ms) >>> ss;
                    px[yi++] = (g * ms) >>> ss;
                    px[yi++] = (b * ms) >>> ss;
                    px[yi++] = (a * ms) >>> ss;

                    p = ((yw + ((p = x + radiusX + 1) < w1 ? p : w1)) << 2);

                    r -= si.r - (si.r = px[p]);
                    g -= si.g - (si.g = px[p + 1]);
                    b -= si.b - (si.b = px[p + 2]);
                    a -= si.a - (si.a = px[p + 3]);

                    si = si.n;

                }
                yw += w;
            }

            ms = mty;
            ss = sty;
            for (x = 0; x < w; x++) {
                yi = (x << 2) | 0;

                r = (ryp1 * (pr = px[yi])) | 0;
                g = (ryp1 * (pg = px[(yi + 1) | 0])) | 0;
                b = (ryp1 * (pb = px[(yi + 2) | 0])) | 0;
                a = (ryp1 * (pa = px[(yi + 3) | 0])) | 0;

                sy = ssy;
                for (i = 0; i < ryp1; i++) {
                    sy.r = pr;
                    sy.g = pg;
                    sy.b = pb;
                    sy.a = pa;
                    sy = sy.n;
                }

                yp = w;

                for (i = 1; i <= radiusY; i++) {
                    yi = (yp + x) << 2;

                    r += (sy.r = px[yi]);
                    g += (sy.g = px[yi + 1]);
                    b += (sy.b = px[yi + 2]);
                    a += (sy.a = px[yi + 3]);

                    sy = sy.n;
                    if (i < h1) {
                        yp += w;
                    }
                }

                yi = x;
                si = ssy;
                if (_quality > 0) {
                    for (y = 0; y < h; y++) {
                        p = yi << 2;
                        px[p + 3] = pa = (a * ms) >>> ss;
                        if (pa > 0) {
                            px[p] = ((r * ms) >>> ss );
                            px[p + 1] = ((g * ms) >>> ss);
                            px[p + 2] = ((b * ms) >>> ss);
                        } else {
                            px[p] = px[p + 1] = px[p + 2] = 0;
                        }

                        p = (x + (((p = y + ryp1) < h1 ? p : h1) * w)) << 2;

                        r -= si.r - (si.r = px[p]);
                        g -= si.g - (si.g = px[p + 1]);
                        b -= si.b - (si.b = px[p + 2]);
                        a -= si.a - (si.a = px[p + 3]);

                        si = si.n;

                        yi += w;
                    }
                } else {
                    for (y = 0; y < h; y++) {
                        p = yi << 2;
                        px[p + 3] = pa = (a * ms) >>> ss;
                        if (pa > 0) {
                            pa = 255 / pa;
                            px[p] = ((r * ms) >>> ss) * pa;
                            px[p + 1] = ((g * ms) >>> ss) * pa;
                            px[p + 2] = ((b * ms) >>> ss) * pa;
                        } else {
                            px[p] = px[p + 1] = px[p + 2] = 0;
                        }

                        p = (x + (((p = y + ryp1) < h1 ? p : h1) * w)) << 2;

                        r -= si.r - (si.r = px[p]);
                        g -= si.g - (si.g = px[p + 1]);
                        b -= si.b - (si.b = px[p + 2]);
                        a -= si.a - (si.a = px[p + 3]);

                        si = si.n;

                        yi += w;
                    }
                }
            }
        }

        blurCtx.putImageData(imgData, 0, 0);
        cacheStore.destroy(ctx);

        return blurCtx;
    };

    /**
     * @constructor
     */
    var DropShadowFilter = function ()
    {
        var _this = this;
        BitmapFilter.call(_this);

        _this.filterId = 0;
        _this.distance = 4;
        _this.angle = 45;
        _this.color = 0;
        _this.alpha = 1;
        _this.blurX = 4;
        _this.blurY = 4;
        _this.strength = 1;
        _this.quality = 1;
        _this.inner = false;
        _this.knockout = false;
        _this.hideObject = false;

        var arg = arguments;
        var distance = arg[0]|0;
        if (!_isNaN(distance)) {
            _this.distance = distance;
        }

        var angle = +arg[1];
        if (!_isNaN(angle) && 0 <= angle && 360 >= angle) {
            _this.angle = angle;
        }

        var color = _this.toColorInt(arg[2]);
        if (!_isNaN(color)) {
            _this.color = color;
        }

        var alpha = +arg[3];
        if (!_isNaN(alpha) && 0 <= alpha && 1 >= alpha) {
            _this.alpha = alpha;
        }

        var blurX = arg[4]|0;
        if (!_isNaN(blurX) && 0 <= blurX && 255 >= blurX) {
            _this.blurX = blurX;
        }

        var blurY = arg[5]|0;
        if (!_isNaN(blurY) && 0 <= blurY && 255 >= blurY) {
            _this.blurY = blurY;
        }

        var strength = +arg[6];
        if (!_isNaN(strength) && 0 <= strength && 255 >= strength) {
            _this.strength = strength;
        }

        var quality = arg[7]|0;
        if (!_isNaN(quality) && 1 <= quality && 15 >= quality) {
            _this.quality = quality;
        }

        var inner = arg[8];
        if (typeof inner === "boolean") {
            _this.inner = inner;
        }

        var knockout = arg[9];
        if (typeof knockout === "boolean") {
            _this.knockout = knockout;
        }

        var hideObject = arg[10];
        if (typeof hideObject === "boolean") {
            _this.hideObject = hideObject;
        }
    };

    /**
     * extends
     * @type {BitmapFilter}
     */
    DropShadowFilter.prototype = Object.create(BitmapFilter.prototype);
    DropShadowFilter.prototype.constructor = DropShadowFilter;

    /**
     * @param cache
     * @param matrix
     * @param colorTransform
     * @param stage
     */
    DropShadowFilter.prototype.render = function (cache, matrix, colorTransform, stage)
    {
        var _this = this;
        var strength = _this.strength;
        if (strength === 0) {
            return cache;
        }

        var quality = _this.quality;
        var inner = _this.inner;
        var r = _this.angle * _PI / 180;
        var blurX = _this.blurX;
        var blurY = _this.blurY;

        // blur
        var blurFilter = new BlurFilter(blurX, blurY, quality);
        var ctx = blurFilter.render(cache, matrix, colorTransform, stage);

        // dropShadow
        var intColor = _this.toColorInt(_this.color);
        var filterColor = _this.intToRGBA(intColor);
        var color = _this.generateColorTransform(filterColor, colorTransform);
        ctx = _this.coatOfColor(ctx, color, inner, strength);

        // synthesis
        var cacheOffsetX = cache._offsetX;
        var cacheOffsetY = cache._offsetY;
        var _offsetX = ctx._offsetX;
        var _offsetY = ctx._offsetY;

        var canvas = ctx.canvas;
        var synCanvas = cacheStore.getCanvas();
        var width = canvas.width + cacheOffsetX;
        var height = canvas.height + cacheOffsetY;
        var ox = 0;
        var oy = 0;
        var dx = 0;
        var dy = 0;

        var distance = _this.distance;
        var scale = stage.getScale();
        var x = _ceil(_cos(r) * distance * scale);
        var y = _ceil(_sin(r) * distance * scale);

        if (x !== 0) {
            width += _abs(x);
            if (x < 0) {
                ox -= x;
            } else {
                dx = x;
            }
        }

        if (y !== 0) {
            height += _abs(y);
            if (y < 0) {
                oy -= y;
            } else {
                dy = y;
            }
        }

        synCanvas.width = width;
        synCanvas.height = height;
        var synCtx = synCanvas.getContext("2d");
        synCtx.drawImage(cache.canvas, _offsetX + ox, _offsetY + oy);
        synCtx.globalAlpha = _this.alpha;
        if (strength < 1) {
            synCtx.globalAlpha *= strength;
        }

        var knockout = _this.knockout;
        var hideObject = _this.hideObject;
        synCtx.globalCompositeOperation = _this.filterOperation(inner, knockout, hideObject);
        synCtx.drawImage(canvas, cacheOffsetX + dx, cacheOffsetY + dy);

        synCtx._offsetX = cacheOffsetX + _offsetX;
        synCtx._offsetY = cacheOffsetY + _offsetY;

        cacheStore.destroy(ctx);

        return synCtx;
    };

    /**
     * @constructor
     */
    var GlowFilter = function ()
    {
        var _this = this;
        BitmapFilter.call(_this);

        _this.filterId = 2;
        _this.color = 0xFF0000;
        _this.alpha = 1;
        _this.blurX = 6;
        _this.blurY = 6;
        _this.strength = 2;
        _this.quality = 1;
        _this.inner = false;
        _this.knockout = false;

        var arg = arguments;
        var color = _this.toColorInt(arg[0]);
        if (!_isNaN(color)) {
            _this.color = color;
        }

        var alpha = +arg[1];
        if (!_isNaN(alpha) && 0 <= alpha && 1 >= alpha) {
            _this.alpha = alpha;
        }

        var blurX = arg[2]|0;
        if (!_isNaN(blurX) && 0 <= blurX && 255 >= blurX) {
            _this.blurX = blurX;
        }

        var blurY = arg[3]|0;
        if (!_isNaN(blurY) && 0 <= blurY && 255 >= blurY) {
            _this.blurY = blurY;
        }

        var strength = +arg[4];
        if (!_isNaN(strength) && 0 <= strength && 255 >= strength) {
            _this.strength = strength;
        }

        var quality = arg[5]|0;
        if (!_isNaN(quality) && 1 <= quality && 15 >= quality) {
            _this.quality = quality;
        }

        var inner = arg[6];
        if (typeof inner === "boolean") {
            _this.inner = inner;
        }

        var knockout = arg[7];
        if (typeof knockout === "boolean") {
            _this.knockout = knockout;
        }
    };

    /**
     * extends
     * @type {BitmapFilter}
     */
    GlowFilter.prototype = Object.create(BitmapFilter.prototype);
    GlowFilter.prototype.constructor = GlowFilter;

    /**
     * @param cache
     * @param matrix
     * @param colorTransform
     * @param stage
     * @returns {*}
     */
    GlowFilter.prototype.render = function (cache, matrix, colorTransform, stage)
    {
        var _this = this;
        var strength = _this.strength;
        if (strength === 0) {
            return cache;
        }

        var inner = _this.inner;
        var blurX = _this.blurX;
        var blurY = _this.blurY;

        var blurFilter = new BlurFilter(blurX, blurY, _this.quality);
        var ctx = blurFilter.render(cache, matrix, colorTransform, stage);

        var width = ctx.canvas.width + cache._offsetX;
        var height = ctx.canvas.height + cache._offsetY;

        var intColor = _this.toColorInt(_this.color);
        var filterColor = _this.intToRGBA(intColor);
        var color = _this.generateColorTransform(filterColor, colorTransform);
        ctx = _this.coatOfColor(ctx, color, inner, strength);

        var synCanvas = cacheStore.getCanvas();
        synCanvas.width = width;
        synCanvas.height = height;
        var synCtx = synCanvas.getContext("2d");

        synCtx.drawImage(cache.canvas, ctx._offsetX, ctx._offsetY);
        synCtx.globalAlpha = _this.alpha;
        if (strength < 1) {
            synCtx.globalAlpha *= strength;
        }

        var operation = "source-over";
        if (_this.knockout) {
            if (inner) {
                operation = "source-in";
            } else {
                operation = "source-out";
            }
        } else {
            if (inner) {
                operation = "source-atop";
            } else {
                operation = "destination-over";
            }
        }

        synCtx.globalCompositeOperation = operation;
        synCtx.drawImage(ctx.canvas, cache._offsetX, cache._offsetY);
        synCtx._offsetX = cache._offsetX + ctx._offsetX;
        synCtx._offsetY = cache._offsetY + ctx._offsetY;

        cacheStore.destroy(ctx);

        return synCtx;
    };

    /**
     * @constructor
     */
    var BevelFilter = function ()
    {
        var _this = this;
        BitmapFilter.call(_this);

        _this.filterId = 3;
        _this.distance = 4;
        _this.angle = 45;
        _this.highlightColor = 0xffffff;
        _this.highlightAlpha = 1;
        _this.shadowColor = 0x000000;
        _this.shadowAlpha = 1;
        _this.blurX = 4;
        _this.blurY = 4;
        _this.strength = 1;
        _this.quality = 1;
        _this.type = "inner";
        _this.knockout = false;

        var arg = arguments;

        var distance = arg[0]|0;
        if (!_isNaN(distance)) {
            _this.distance = distance;
        }

        var angle = +arg[1];
        if (!_isNaN(angle) && 0 <= angle && 360 >= angle) {
            _this.angle = angle;
        }

        var highlightColor = _this.toColorInt(arg[2]);
        if (!_isNaN(highlightColor)) {
            _this.highlightColor = highlightColor;
        }

        var highlightAlpha = +arg[3];
        if (!_isNaN(highlightAlpha) && 0 <= highlightAlpha && 1 >= highlightAlpha) {
            _this.highlightAlpha = highlightAlpha;
        }

        var shadowColor = _this.toColorInt(arg[4]);
        if (!_isNaN(shadowColor)) {
            _this.shadowColor = shadowColor;
        }

        var shadowAlpha = +arg[5];
        if (!_isNaN(shadowAlpha) && 0 <= shadowAlpha && 1 >= shadowAlpha) {
            _this.shadowAlpha = shadowAlpha;
        }

        var blurX = arg[6]|0;
        if (!_isNaN(blurX) && 0 <= blurX && 255 >= blurX) {
            _this.blurX = blurX;
        }

        var blurY = arg[7]|0;
        if (!_isNaN(blurY) && 0 <= blurY && 255 >= blurY) {
            _this.blurY = blurY;
        }

        var strength = +arg[8];
        if (!_isNaN(strength) && 0 <= strength && 255 >= strength) {
            _this.strength = strength;
        }

        var quality = arg[9]|0;
        if (!_isNaN(quality) && 1 <= quality && 15 >= quality) {
            _this.quality = quality;
        }

        var type = arg[10];
        if (typeof type === "string") {
            _this.type = type;
        }

        var knockout = arg[11];
        if (typeof knockout === "boolean") {
            _this.knockout = knockout;
        }
    };

    /**
     * extends
     * @type {BitmapFilter}
     */
    BevelFilter.prototype = Object.create(BitmapFilter.prototype);
    BevelFilter.prototype.constructor = BevelFilter;

    /**
     * @param cache
     * @param matrix
     * @param colorTransform
     * @param stage
     * @returns {*}
     */
    BevelFilter.prototype.render = function (cache, matrix, colorTransform, stage)
    {
        var _this = this;
        var distance = _this.distance;
        var angle = _this.angle;
        var shadowColor = _this.shadowColor;
        var shadowAlpha = _this.shadowAlpha;
        var highlightColor = _this.highlightColor;
        var highlightAlpha = _this.highlightAlpha;
        var blurX = _this.blurX;
        var blurY = _this.blurY;
        var strength = _this.strength;
        var quality = _this.quality;
        var knockout = _this.knockout;
        var r = angle * _PI / 180;
        var filterColor, color;
        var type = _this.type;

        // blur
        var blurFilter = new BlurFilter(blurX, blurY, quality);
        var ctx = blurFilter.render(cache, matrix, colorTransform, stage);
        var canvas = ctx.canvas;
        var _offsetX = ctx._offsetX;
        var _offsetY = ctx._offsetY;

        // shadow
        var shadowCanvas = cacheStore.getCanvas();
        shadowCanvas.width = canvas.width;
        shadowCanvas.height = canvas.height;
        var shadowCtx = shadowCanvas.getContext("2d");
        shadowCtx.drawImage(canvas, 0, 0);
        var intShadowColor = _this.toColorInt(shadowColor);
        filterColor = _this.intToRGBA(intShadowColor);
        color = _this.generateColorTransform(filterColor, colorTransform);
        shadowCtx = _this.coatOfColor(shadowCtx, color, false, strength);

        // shadow
        var highlightCanvas = cacheStore.getCanvas();
        highlightCanvas.width = canvas.width;
        highlightCanvas.height = canvas.height;
        var highlightCtx = highlightCanvas.getContext("2d");
        highlightCtx.drawImage(canvas, 0, 0);
        var intHighlightColor = _this.toColorInt(highlightColor);
        filterColor = _this.intToRGBA(intHighlightColor);
        color = _this.generateColorTransform(filterColor, colorTransform);
        highlightCtx = _this.coatOfColor(highlightCtx, color, false, strength);

        var isInner = (type === "inner" || type === "full");
        var isOuter = (type === "outer" || type === "full");

        var cacheOffsetX = cache._offsetX;
        var cacheOffsetY = cache._offsetY;
        var synCanvas = cacheStore.getCanvas();
        var width = canvas.width + cacheOffsetX;
        var height = canvas.height + cacheOffsetY;
        var ox = 0;
        var oy = 0;

        var scale = stage.getScale();
        var x = _ceil(_cos(r) * distance * scale);
        var y = _ceil(_sin(r) * distance * scale);

        if (x !== 0) {
            width += _abs(x);
            if (x < 0) {
                ox -= x;
            }
        }

        if (y !== 0) {
            height += _abs(y);
            if (y < 0) {
                oy -= y;
            }
        }

        synCanvas.width = width;
        synCanvas.height = height;
        var synCtx = synCanvas.getContext("2d");
        if (!knockout) {
            synCtx.drawImage(cache.canvas, _offsetX + ox, _offsetY + oy);
        }
        if (strength < 1) {
            synCtx.globalAlpha *= strength;
        }
        synCtx._offsetX = cacheOffsetX + _offsetX;
        synCtx._offsetY = cacheOffsetY + _offsetY;

        var xorCanvas = cacheStore.getCanvas();
        xorCanvas.width = width + _offsetX;
        xorCanvas.height = height + _offsetY;
        var xorCtx = xorCanvas.getContext("2d");

        xorCtx.globalCompositeOperation = "xor";
        xorCtx.globalAlpha = highlightAlpha;
        xorCtx.drawImage(highlightCtx.canvas, -x + ox, -y + oy);
        xorCtx.globalAlpha = shadowAlpha;
        xorCtx.drawImage(shadowCtx.canvas, x, y);

        var operation;
        if (isInner && isOuter) {
            operation = "source-over";
        } else if (isInner) {
            synCtx.drawImage(cache.canvas, _offsetX + ox, _offsetY + oy);
            operation = _this.filterOperation(true, knockout);
        } else if (isOuter) {
            operation = "destination-over";
        }

        synCtx.globalCompositeOperation = operation;
        synCtx.drawImage(xorCtx.canvas, 0, 0);
        if (!isInner && isOuter && knockout) {
            synCtx.globalCompositeOperation = "destination-out";
            synCtx.drawImage(cache.canvas, _offsetX + ox, _offsetY + oy);
        }

        cacheStore.destroy(ctx);
        cacheStore.destroy(highlightCtx);
        cacheStore.destroy(shadowCtx);
        cacheStore.destroy(xorCtx);

        return synCtx;
    };

    /**
     * @constructor
     */
    var GradientGlowFilter = function ()
    {
        var _this = this;
        BitmapFilter.call(_this);

        _this.filterId = 4;
        _this.distance = 4;
        _this.angle = 45;
        _this.colors = null;
        _this.alphas = null;
        _this.ratios = null;
        _this.blurX = 4;
        _this.blurY = 4;
        _this.strength = 1;
        _this.quality = 1;
        _this.type = "inner";
        _this.knockout = false;

        var arg = arguments;

        var distance = arg[0]|0;
        if (!_isNaN(distance)) {
            _this.distance = distance;
        }

        var angle = +arg[1];
        if (!_isNaN(angle) && 0 <= angle && 360 >= angle) {
            _this.angle = angle;
        }

        _this.colors = arg[2];
        _this.alphas = arg[3];
        _this.ratios = arg[4];

        var blurX = arg[5]|0;
        if (!_isNaN(blurX) && 0 <= blurX && 255 >= blurX) {
            _this.blurX = blurX;
        }

        var blurY = arg[6]|0;
        if (!_isNaN(blurY) && 0 <= blurY && 255 >= blurY) {
            _this.blurY = blurY;
        }

        var strength = +arg[7];
        if (!_isNaN(strength) && 0 <= strength && 255 >= strength) {
            _this.strength = strength;
        }

        var quality = arg[8]|0;
        if (!_isNaN(quality) && 1 <= quality && 15 >= quality) {
            _this.quality = quality;
        }

        var type = arg[9];
        if (typeof type === "string") {
            _this.type = type;
        }

        var knockout = arg[10];
        if (typeof knockout === "boolean") {
            _this.knockout = knockout;
        }
    };

    /**
     * extends
     * @type {BitmapFilter}
     */
    GradientGlowFilter.prototype = Object.create(BitmapFilter.prototype);
    GradientGlowFilter.prototype.constructor = GradientGlowFilter;

    /**
     * @param cache
     * @param matrix
     * @param colorTransform
     * @param stage
     * @returns {*}
     */
    GradientGlowFilter.prototype.render = function (cache, matrix, colorTransform, stage)
    {
        var _this = this;
        var strength = _this.strength;
        if (strength === 0) {
            return cache;
        }

        var type = _this.type;
        var blurX = _this.blurX;
        var blurY = _this.blurY;
        var isInner = (type === "inner" || type === "full");
        var isOuter = (type === "outer" || type === "full");
        var knockout = _this.knockout;
        var angle = _this.angle;
        var r = angle * _PI / 180;

        var blurFilter = new BlurFilter(blurX, blurY, _this.quality);
        var ctx = blurFilter.render(cache, matrix, colorTransform, stage);

        // synthesis
        var cacheOffsetX = cache._offsetX;
        var cacheOffsetY = cache._offsetY;
        var _offsetX = ctx._offsetX;
        var _offsetY = ctx._offsetY;

        var canvas = ctx.canvas;
        var synCanvas = cacheStore.getCanvas();
        var width = canvas.width + cacheOffsetX;
        var height = canvas.height + cacheOffsetY;
        var ox = 0;
        var oy = 0;
        var dx = 0;
        var dy = 0;

        var distance = _this.distance;
        var scale = stage.getScale();
        var x = _ceil(_cos(r) * distance * scale);
        var y = _ceil(_sin(r) * distance * scale);

        if (x !== 0) {
            width += _abs(x);
            if (x < 0) {
                ox -= x;
            } else {
                dx = x;
            }
        }

        if (y !== 0) {
            height += _abs(y);
            if (y < 0) {
                oy -= y;
            } else {
                dy = y;
            }
        }

        synCanvas.width = width;
        synCanvas.height = height;
        var synCtx = synCanvas.getContext("2d");
        if (!knockout) {
            synCtx.drawImage(cache.canvas, _offsetX + ox, _offsetY + oy);
        }

        if (strength < 1) {
            synCtx.globalAlpha *= strength;
        }

        var operation;
        if (isInner && isOuter) {
            operation = "source-over";
        } else {
            if (knockout) {
                synCtx.drawImage(cache.canvas, _offsetX + ox, _offsetY + oy);
            }
            operation = _this.filterOperation(isInner, knockout);
        }

        synCtx.globalCompositeOperation = operation;
        synCtx.drawImage(canvas, cacheOffsetX + dx, cacheOffsetY + dy);

        synCtx._offsetX = cacheOffsetX + _offsetX;
        synCtx._offsetY = cacheOffsetY + _offsetY;

        cacheStore.destroy(ctx);

        return synCtx;
    };

    /**
     * @constructor
     */
    var ConvolutionFilter = function ()
    {
        var _this = this;
        BitmapFilter.call(_this);

        _this.filterId = 5;
    };

    /**
     * extends
     * @type {BitmapFilter}
     */
    ConvolutionFilter.prototype = Object.create(BitmapFilter.prototype);
    ConvolutionFilter.prototype.constructor = ConvolutionFilter;

    /**
     * @param cache
     * @param matrix
     * @param colorTransform
     * @param stage
     * @returns {*}
     */
    ConvolutionFilter.prototype.render = function (cache, matrix, colorTransform, stage)
    {
        return cache;
    };

    /**
     * @constructor
     */
    var ColorMatrixFilter = function ()
    {
        var _this = this;
        BitmapFilter.call(_this);

        _this.filterId = 6;


    };

    /**
     * extends
     * @type {BitmapFilter}
     */
    ColorMatrixFilter.prototype = Object.create(BitmapFilter.prototype);
    ColorMatrixFilter.prototype.constructor = ColorMatrixFilter;

    /**
     * @param cache
     * @param matrix
     * @param colorTransform
     * @param stage
     * @returns {*}
     */
    ColorMatrixFilter.prototype.render = function (cache, matrix, colorTransform, stage)
    {
        return cache;
    };

    /**
     * @constructor
     */
    var GradientBevelFilter = function ()
    {
        var _this = this;
        BitmapFilter.call(_this);

        _this.filterId = 7;


    };

    /**
     * extends
     * @type {BitmapFilter}
     */
    GradientBevelFilter.prototype = Object.create(BitmapFilter.prototype);
    GradientBevelFilter.prototype.constructor = GradientBevelFilter;


    /**
     * @param cache
     * @param matrix
     * @param colorTransform
     * @param stage
     * @returns {*}
     */
    GradientBevelFilter.prototype.render = function (cache, matrix, colorTransform, stage)
    {
        return cache;
    };

    /**
     * @constructor
     */
    var Graphics = function ()
    {
        this.clear();
    };

    /**
     * @type {number}
     */
    Graphics.prototype.MOVE_TO = 0;

    /**
     * @type {number}
     */
    Graphics.prototype.CURVE_TO = 1;

    /**
     * @type {number}
     */
    Graphics.prototype.LINE_TO = 2;

    /**
     * @type {number}
     */
    Graphics.prototype.CUBIC = 3;

    /**
     * @type {number}
     */
    Graphics.prototype.ARC = 4;

    /**
     * @type {number}
     */
    Graphics.prototype.FILL_STYLE = 5;

    /**
     * @type {number}
     */
    Graphics.prototype.STROKE_STYLE = 6;

    /**
     * @type {number}
     */
    Graphics.prototype.FILL = 7;

    /**
     * @type {number}
     */
    Graphics.prototype.STROKE = 8;

    /**
     * @type {number}
     */
    Graphics.prototype.LINE_WIDTH = 9;

    /**
     * @type {number}
     */
    Graphics.prototype.LINE_CAP = 10;

    /**
     * @type {number}
     */
    Graphics.prototype.LINE_JOIN = 11;

    /**
     * @type {number}
     */
    Graphics.prototype.MITER_LIMIT = 12;

    /**
     * @type {number}
     */
    Graphics.prototype.BEGIN_PATH = 13;

    /**
     * @param a
     * @param b
     * @returns []
     */
    Graphics.prototype.multiplicationMatrix = function(a, b)
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
     * @param color
     * @param data
     * @returns {{R: number, G: number, B: number, A: number}}
     */
    Graphics.prototype.generateColorTransform = function (color, data)
    {
        return {
            R: _max(0, _min((color.R * data[0]) + data[4], 255))|0,
            G: _max(0, _min((color.G * data[1]) + data[5], 255))|0,
            B: _max(0, _min((color.B * data[2]) + data[6], 255))|0,
            A: _max(0, _min((color.A * 255 * data[3]) + data[7], 255)) / 255
        };
    };

    /**
     * @param int
     * @param alpha
     * @returns {{R: number, G: number, B: number, A: number}}
     */
    Graphics.prototype.intToRGBA = function (int, alpha)
    {
        alpha = alpha || 100;
        return {
            R: (int & 0xff0000) >> 16,
            G: (int & 0x00ff00) >> 8,
            B: (int & 0x0000ff),
            A: (alpha / 100)
        };
    };

    /**
     * @returns {Graphics}
     */
    Graphics.prototype.clear = function ()
    {
        var _this = this;
        var no = _Number.MAX_VALUE;
        _this.bounds = {xMin: no, xMax: -no, yMin: no, yMax: -no};
        _this.maxWidth = 0;
        _this.cmd = null;
        _this.isDraw = false;
        _this.isFillDraw = false;
        _this.isLineDraw = false;
        _this.cacheKey = "";
        _this.recodes = [];
        _this.lineRecodes = [];
        return _this;
    };

    /**
     * @returns {string}
     */
    Graphics.prototype.getCacheKey = function ()
    {
        return this.cacheKey;
    };

    /**
     * @returns {string}
     */
    Graphics.prototype.addCacheKey = function ()
    {
        var args = arguments;
        var cacheKey = "";
        var length = args.length;
        if (length) {
            for (var i = 0; i < length; i++) {
                var value = args[i];
                cacheKey += "_" + value;
            }
        }
        this.cacheKey += cacheKey;
    };

    /**
     * @returns {*}
     */
    Graphics.prototype.getBounds = function ()
    {
        return this.bounds;
    };

    /**
     * @param x
     * @param y
     */
    Graphics.prototype.setBounds = function (x, y)
    {
        var bounds = this.bounds;
        bounds.xMin = _min(bounds.xMin, x);
        bounds.xMax = _max(bounds.xMax, x);
        bounds.yMin = _min(bounds.yMin, y);
        bounds.yMax = _max(bounds.yMax, y);
    };

    /**
     * @param str
     * @returns {string}
     */
    Graphics.prototype.colorStringToInt = function(str)
    {
        var canvas = cacheStore.getCanvas();
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = str;
        var color = "0x" + ctx.fillStyle.substr(1);
        cacheStore.destroy(ctx);
        return color;
    };

    /**
     * @param rgb
     * @param alpha
     * @returns {Graphics}
     */
    Graphics.prototype.beginFill = function (rgb, alpha)
    {
        var _this = this;
        if (typeof rgb === "string") {
            rgb = _this.colorStringToInt(rgb);
        }

        rgb |= 0;
        alpha = +alpha;
        if (_isNaN(alpha)) {
            alpha = 100;
        } else {
            alpha *= 100;
        }

        var color = _this.intToRGBA(rgb, alpha);
        var recodes = _this.recodes;
        if (!_this.isFillDraw) {
            recodes[recodes.length] = [_this.BEGIN_PATH];
        }
        recodes[recodes.length] = [_this.FILL_STYLE, color.R, color.G, color.B, color.A];

        _this.addCacheKey(rgb, alpha);
        _this.isFillDraw = true;
        _this.isDraw = true;
        return _this;
    };

    /**
     * @param width
     * @param rgb
     * @param alpha
     * @param pixelHinting
     * @param noScale
     * @param capsStyle
     * @param jointStyle
     * @param miterLimit
     * @returns {Graphics}
     */
    Graphics.prototype.lineStyle = function (width, rgb, alpha, pixelHinting, noScale, capsStyle, jointStyle, miterLimit)
    {
        var _this = this;
        var lineRecodes = _this.lineRecodes;

        width = +width;
        if (!_isNaN(width)) {
            if (rgb === undefined) {
                rgb = 0;
            }

            if (typeof rgb === "string") {
                rgb = _this.colorStringToInt(rgb);
            }

            if (!capsStyle) {
                capsStyle = "round";
            }
            if (!jointStyle) {
                jointStyle = "round";
            }

            rgb |= 0;
            alpha = +alpha;
            if (_isNaN(alpha)) {
                alpha = 100;
            } else {
                alpha *= 100;
            }

            var color = _this.intToRGBA(rgb, alpha);
            if (width < 0.5) {
                width += 0.2;
            }

            width *= 20;
            _this.maxWidth = _max(_this.maxWidth, width);

            if (_this.isLineDraw) {
                lineRecodes[lineRecodes.length] = [_this.STROKE];
            }
            lineRecodes[lineRecodes.length] = [_this.BEGIN_PATH];
            lineRecodes[lineRecodes.length] = [_this.STROKE_STYLE, color.R, color.G, color.B, color.A];
            lineRecodes[lineRecodes.length] = [_this.LINE_WIDTH, width];
            lineRecodes[lineRecodes.length] = [_this.LINE_CAP, capsStyle];
            lineRecodes[lineRecodes.length] = [_this.LINE_JOIN, jointStyle];
            _this.addCacheKey(rgb, alpha);
            _this.isLineDraw = true;
            _this.isDraw = true;
        } else if (_this.isLineDraw) {
            _this.isLineDraw = false;
            lineRecodes[lineRecodes.length] = [_this.STROKE];
            var length = lineRecodes.length;
            var recodes = _this.recodes;
            for (var i = 0; i < length; i++) {
                recodes[recodes.length] = lineRecodes[i];
            }
            _this.lineRecodes = [];
        }
        return _this;
    };

    /**
     * @param x
     * @param y
     * @returns {Graphics}
     */
    Graphics.prototype.moveTo = function (x, y)
    {
        var _this = this;
        var recodes = _this.recodes;
        x *= 20;
        y *= 20;

        if (_this.isFillDraw) {
            recodes[recodes.length] = [_this.MOVE_TO, x, y];
        }

        if (_this.isLineDraw) {
            var lineRecodes = _this.lineRecodes;
            lineRecodes[lineRecodes.length] = [_this.MOVE_TO, x, y];
        }

        if (_this.isFillDraw || _this.isLineDraw) {
            _this.setBounds(x, y);
            _this.addCacheKey(x, y);
        }
        return _this;
    };

    /**
     * @param x
     * @param y
     * @returns {Graphics}
     */
    Graphics.prototype.lineTo = function (x, y)
    {
        var _this = this;
        var recodes = _this.recodes;
        x *= 20;
        y *= 20;

        if (_this.isFillDraw) {
            recodes[recodes.length] = [_this.LINE_TO, x, y];
        }

        if (_this.isLineDraw) {
            var lineRecodes = _this.lineRecodes;
            lineRecodes[lineRecodes.length] = [_this.LINE_TO, x, y];
        }

        if (_this.isFillDraw || _this.isLineDraw) {
            _this.setBounds(x, y);
            _this.addCacheKey(x, y);
        }
        return _this;
    };

    /**
     * @param cx
     * @param cy
     * @param dx
     * @param dy
     * @returns {Graphics}
     */
    Graphics.prototype.curveTo = function (cx, cy, dx, dy)
    {
        var _this = this;
        var recodes = _this.recodes;
        cx *= 20;
        cy *= 20;
        dx *= 20;
        dy *= 20;

        if (_this.isFillDraw) {
            recodes[recodes.length] = [_this.CURVE_TO, cx, cy, dx, dy];
        }

        if (_this.isLineDraw) {
            var lineRecodes = _this.lineRecodes;
            lineRecodes[lineRecodes.length] = [_this.CURVE_TO, cx, cy, dx, dy];
        }

        if (_this.isFillDraw || _this.isLineDraw) {
            _this.setBounds(cx, cy);
            _this.setBounds(dx, dy);
            _this.addCacheKey(cx, cy, dx, dy);
        }
        return _this;
    };

    /**
     * @param cp1x
     * @param cp1y
     * @param cp2x
     * @param cp2y
     * @param x
     * @param y
     * @returns {Graphics}
     */
    Graphics.prototype.cubicCurveTo = function (cp1x, cp1y, cp2x, cp2y, x, y)
    {
        var _this = this;
        var recodes = _this.recodes;
        cp1x *= 20;
        cp1y *= 20;
        cp2x *= 20;
        cp2y *= 20;
        x *= 20;
        y *= 20;

        if (_this.isFillDraw) {
            recodes[recodes.length] = [_this.CUBIC, cp1x, cp1y, cp2x, cp2y, x, y];
        }

        if (_this.isLineDraw) {
            var lineRecodes = _this.lineRecodes;
            lineRecodes[lineRecodes.length] = [_this.CUBIC, cp1x, cp1y, cp2x, cp2y, x, y];
        }

        if (_this.isFillDraw || _this.isLineDraw) {
            _this.setBounds(x, y);
            _this.setBounds(cp1x, cp1y);
            _this.setBounds(cp2x, cp2y);
            _this.addCacheKey(cp1x, cp1y, cp2x, cp2y, x, y);
        }
        return _this;
    };

    /**
     * @param x
     * @param y
     * @param radius
     * @returns {Graphics}
     */
    Graphics.prototype.drawCircle = function (x, y, radius)
    {
        var _this = this;
        var recodes = _this.recodes;
        x *= 20;
        y *= 20;
        radius *= 20;

        if (_this.isFillDraw) {
            recodes[recodes.length] = [_this.ARC, x, y, radius];
        }

        if (_this.isLineDraw) {
            var lineRecodes = _this.lineRecodes;
            lineRecodes[lineRecodes.length] = [_this.ARC, x, y, radius];
        }

        if (_this.isFillDraw || _this.isLineDraw) {
            _this.setBounds(x - radius, y - radius);
            _this.setBounds(x + radius, y + radius);
            _this.addCacheKey(x, y, radius);
        }
        return _this;
    };

    /**
     * @param x
     * @param y
     * @param width
     * @param height
     * @returns {Graphics}
     */
    Graphics.prototype.drawEllipse = function (x, y, width, height)
    {
        var _this = this;
        var hw = width / 2;
        var hh = height / 2;
        var x0 = x + hw;
        var x1 = x + width;
        var y0 = y + hh;
        var y1 = y + height;
        var cw = 4 / 3 * (_SQRT2 - 1) * hw;
        var ch = 4 / 3 * (_SQRT2 - 1) * hh;
        _this.moveTo(x0, y);
        _this.cubicCurveTo(x0 + cw, y, x1, y0 - ch, x1, y0);
        _this.cubicCurveTo(x1, y0 + ch, x0 + cw, y1, x0, y1);
        _this.cubicCurveTo(x0 - cw, y1, x, y0 + ch, x, y0);
        _this.cubicCurveTo(x, y0 - ch, x0 - cw, y, x0, y);
        return _this;
    };

    /**
     * @param x
     * @param y
     * @param width
     * @param height
     * @returns {Graphics}
     */
    Graphics.prototype.drawRect = function (x, y, width, height)
    {
        var _this = this;
        _this.moveTo(x, y);
        _this.lineTo(x + width, y);
        _this.lineTo(x + width, y + height);
        _this.lineTo(x, y + height);
        _this.lineTo(x, y);
        return _this;
    };

    /**
     * @param x
     * @param y
     * @param width
     * @param height
     * @param ellipseWidth
     * @param ellipseHeight
     * @returns {Graphics}
     */
    Graphics.prototype.drawRoundRect = function (x, y, width, height, ellipseWidth, ellipseHeight)
    {
        var _this = this;
        var hew = ellipseWidth / 2;
        var heh = ellipseHeight / 2;
        var cw = 4 / 3 * (_SQRT2 - 1) * hew;
        var ch = 4 / 3 * (_SQRT2 - 1) * heh;

        var dx0 = x + hew;
        var dx1 = x + width;
        var dx2 = dx1 - hew;

        var dy0 = y + heh;
        var dy1 = y + height;
        var dy2 = dy1 - heh;

        _this.moveTo(dx0, y);
        _this.lineTo(dx2, y);
        _this.cubicCurveTo(dx2 + cw, y, dx1, dy0 - ch, dx1, dy0);
        _this.lineTo(dx1, dy2);
        _this.cubicCurveTo(dx1, dy2 + ch, dx2 + cw, dy1, dx2, dy1);
        _this.lineTo(dx0, dy1);
        _this.cubicCurveTo(dx0 - cw, dy1, x, dy2 + ch, x, dy2);
        _this.lineTo(x, dy0);
        _this.cubicCurveTo(x, dy0 - ch, dx0 - cw, y, dx0, y);

        return _this;
    };

    /**
     * @param vertices
     * @param indices
     * @param uvtData
     * @param culling
     * @returns {Graphics}
     */
    Graphics.prototype.drawTriangles = function (vertices, indices, uvtData, culling)
    {
        var _this = this;
        var length = vertices.length;
        if (length && length % 3 === 0) {
            var i = 0;
            var count = 0;
            if (indices) {
                length = indices.length;
                if (length && length % 3 === 0) {
                    for (i = 0; i < length; i++) {
                        var idx = indices[i];
                        if (count === 0) {
                            _this.moveTo(vertices[idx], vertices[idx + 1]);
                        } else {
                            _this.lineTo(vertices[idx], vertices[idx + 1]);
                        }
                        count++;
                        if (count % 3 === 0) {
                            count = 0;
                        }
                    }
                }
            } else {
                for (i = 0; i < length; i++) {
                    if (count === 0) {
                        _this.moveTo(vertices[i++], vertices[i]);
                    } else {
                        _this.lineTo(vertices[i++], vertices[i]);
                    }
                    count++;
                    if (count % 3 === 0) {
                        count = 0;
                    }
                }
            }
        }
        return _this;
    };

    /**
     * @returns {Graphics}
     */
    Graphics.prototype.endFill = function ()
    {
        var _this = this;
        if (_this.isFillDraw) {
            var recodes = _this.recodes;
            recodes[recodes.length] = [_this.FILL];
        }
        _this.isFillDraw = false;
        return _this;
    };

    /**
     * @param ctx
     * @param matrix
     * @param colorTransform
     * @param stage
     * @returns {*}
     */
    Graphics.prototype.render = function (ctx, matrix, colorTransform, stage)
    {
        var _this = this;
        var cacheKey = "";
        var alpha = colorTransform[3] + (colorTransform[7] / 255);
        if (!alpha) {
            return cacheKey;
        }

        var rMatrix = _this.multiplicationMatrix(stage.getMatrix(), matrix);
        var xScale = _sqrt(rMatrix[0] * rMatrix[0] + rMatrix[1] * rMatrix[1]);
        var yScale = _sqrt(rMatrix[2] * rMatrix[2] + rMatrix[3] * rMatrix[3]);
        xScale = _pow(_SQRT2, _ceil(_log(xScale) / _LN2_2 - _LOG1P));
        yScale = _pow(_SQRT2, _ceil(_log(yScale) / _LN2_2 - _LOG1P));

        var maxWidth = _this.maxWidth;
        var halfWidth = maxWidth / 2;
        var bounds = _this.getBounds();
        var xMax = bounds.xMax;
        var xMin = bounds.xMin;
        var yMax = bounds.yMax;
        var yMin = bounds.yMin;

        var W = _abs(_ceil((xMax - xMin + maxWidth) * xScale));
        var H = _abs(_ceil((yMax - yMin + maxWidth) * yScale));
        if (W <= 0 || H <= 0) {
            return cacheKey;
        }

        var cache;
        var canvas;
        var isClipDepth = stage.clipMc || _this.isClipDepth;
        if (!isClipDepth) {
            cacheKey = cacheStore.generateKey("Graphics", 0, [xScale, yScale], colorTransform);
            cacheKey += _this.getCacheKey();
            cache = cacheStore.getCache(cacheKey);
            if (!cache && stage.getWidth() > W && stage.getHeight() > H && cacheStore.size > (W * H)) {
                canvas = cacheStore.getCanvas();
                canvas.width = W;
                canvas.height = H;
                cache = canvas.getContext("2d");
                var cMatrix = [xScale, 0, 0, yScale, (-xMin + halfWidth) * xScale, (-yMin + halfWidth) * yScale];
                cache.setTransform(cMatrix[0], cMatrix[1], cMatrix[2], cMatrix[3], cMatrix[4], cMatrix[5]);
                cache = _this.executeRender(cache, _min(xScale, yScale), colorTransform, false);
                cacheStore.setCache(cacheKey, cache);
            }
        }

        if (cache) {
            canvas = cache.canvas;
            var sMatrix = [1 / xScale, 0, 0, 1 / yScale, xMin - halfWidth, yMin - halfWidth];
            var m2 = _this.multiplicationMatrix(rMatrix, sMatrix);
            ctx.setTransform(m2[0],m2[1],m2[2],m2[3],m2[4],m2[5]);
            if (isAndroid4x && !isChrome) {
                ctx.fillStyle = stage.context.createPattern(cache.canvas, "no-repeat");
                ctx.fillRect(0, 0, W, H);
            } else {
                ctx.drawImage(canvas, 0, 0, W, H);
            }
        } else {
            ctx.setTransform(rMatrix[0],rMatrix[1],rMatrix[2],rMatrix[3],rMatrix[4],rMatrix[5]);
            _this.executeRender(ctx, _min(rMatrix[0], rMatrix[3]), colorTransform, isClipDepth);
        }

        return cacheKey + "_" + rMatrix[4] + "_" + rMatrix[5];
    };

    /**
     * @param ctx
     * @param minScale
     * @param colorTransform
     * @param isClip
     */
    Graphics.prototype.executeRender = function (ctx, minScale, colorTransform, isClip)
    {
        var _this = this;
        var recodes = _this.recodes;
        var length = recodes.length;
        var lineRecodes = _this.lineRecodes;

        if (length || lineRecodes) {
            var cmd = _this.cmd;
            if (!cmd) {
                var lLen = lineRecodes.length;
                if (lLen) {
                    for (var i = 0; i < lLen; i++) {
                        recodes[recodes.length] = lineRecodes[i];
                    }
                    _this.lineRecodes = [];
                }
                cmd = vtc.buildCommand(recodes);
                _this.cmd = cmd;
            }

            ctx.beginPath();
            cmd(ctx, colorTransform, isClip);
            if (isClip) {
                ctx.clip();
            } else {
                if (_this.isFillDraw) {
                    ctx.fill();
                }
                if (_this.isLineDraw) {
                    ctx.stroke();
                }
            }
        }

        var resetCss = "rgba(0,0,0,1)";
        ctx.strokeStyle = resetCss;
        ctx.fillStyle = resetCss;
        ctx.globalAlpha = 1;

        return ctx;
    };

    /**
     * @param ctx
     * @param matrix
     * @param stage
     * @param x
     * @param y
     * @returns {boolean}
     */
    Graphics.prototype.renderHitTest = function (ctx, matrix, stage, x, y)
    {
        var _this = this;

        var cmd = _this.cmd;
        if (!cmd) {
            var recodes = _this.recodes;
            cmd = vtc.buildCommand(recodes);
            _this.cmd = cmd;
        }

        var rMatrix = _this.multiplicationMatrix(stage.getMatrix(), matrix);
        ctx.setTransform(rMatrix[0],rMatrix[1],rMatrix[2],rMatrix[3],rMatrix[4],rMatrix[5]);

        ctx.beginPath();
        cmd(ctx, [1,1,1,1,0,0,0,0], true);

        var hit = ctx.isPointInPath(x, y);
        if (hit) {
            return hit;
        }

        if ("isPointInStroke" in ctx) {
            hit = ctx.isPointInStroke(x, y);
            if (hit) {
                return hit;
            }
        }

        return hit;
    };

    /**
     * @constructor
     */
    var SoundTransform = function ()
    {
        var _this = this;
        _this._leftToLeft = 0;
        _this._leftToRight = 1;
        _this._pan = 0;
        _this._rightToLeft = 0;
        _this._rightToRight = 1;
        _this._volume = 1;
    };

    /**
     * properties
     */
    Object.defineProperties(SoundTransform.prototype,
    {
        leftToLeft: {
            get: function () {
                return this.getLeftToLeft();
            },
            set: function (leftToLeft) {
                this.setLeftToLeft(leftToLeft);
            }
        },
        leftToRight: {
            get: function () {
                return this.getLeftToRight();
            },
            set: function (leftToRight) {
                this.setLeftToRight(leftToRight);
            }
        },
        pan: {
            get: function () {
                return this.getPan();
            },
            set: function (pan) {
                this.setPan(pan);
            }
        },
        rightToLeft: {
            get: function () {
                return this.getRightToLeft();
            },
            set: function (rightToLeft) {
                this.setRightToLeft(rightToLeft);
            }
        },
        rightToRight: {
            get: function () {
                return this.getRightToRight();
            },
            set: function (rightToRight) {
                this.setRightToRight(rightToRight);
            }
        },
        volume: {
            get: function () {
                return this.getVolume();
            },
            set: function (volume) {
                this.setVolume(volume);
            }
        }
    });

    /**
     * @returns {number}
     */
    SoundTransform.prototype.getLeftToLeft = function ()
    {
        return this._leftToLeft;
    };

    /**
     * @param leftToLeft
     */
    SoundTransform.prototype.setLeftToLeft = function (leftToLeft)
    {
        this._leftToLeft = leftToLeft | 0;
    };

    /**
     * @returns {number}
     */
    SoundTransform.prototype.getLeftToRight = function ()
    {
        return this._leftToRight;
    };

    /**
     * @param leftToRight
     */
    SoundTransform.prototype.setLeftToRight = function (leftToRight)
    {
        this._leftToRight = leftToRight | 0;
    };

    /**
     * @returns {number}
     */
    SoundTransform.prototype.getPan = function ()
    {
        return this._pan;
    };

    /**
     * @param pan
     */
    SoundTransform.prototype.setPan = function (pan)
    {
        this._pan = pan | 0;
    };

    /**
     * @returns {number}
     */
    SoundTransform.prototype.getRightToLeft = function ()
    {
        return this._rightToLeft;
    };

    /**
     * @param rightToLeft
     */
    SoundTransform.prototype.setRightToLeft = function (rightToLeft)
    {
        this._rightToLeft = rightToLeft | 0;
    };

    /**
     * @returns {number}
     */
    SoundTransform.prototype.getRightToRight = function ()
    {
        return this._rightToRight;
    };

    /**
     * @param rightToRight
     */
    SoundTransform.prototype.setRightToRight = function (rightToRight)
    {
        this._rightToRight = rightToRight | 0;
    };

    /**
     * @returns {number}
     */
    SoundTransform.prototype.getVolume = function ()
    {
        return this._volume;
    };

    /**
     * @param volume
     */
    SoundTransform.prototype.setVolume = function (volume)
    {
        this._volume = volume | 0;
    };

    /**
     * @param vol
     * @param panning
     */
    SoundTransform.prototype.SoundTransform = function (vol, panning)
    {
        var _this = this;
        _this.volume = vol | 0;
        _this.pan = panning | 0;
    };

    /**
     * @constructor
     */
    var Swf2jsEvent = function ()
    {
        var _this = this;
        _this.target = {};
        _this.bubbles = true;
        _this.cancelable = true;
        _this.currentTarget = {};
        _this.eventPhase = 0;
    };

    /**
     * @type {string}
     */
    Swf2jsEvent.prototype.ACTIVATE = "activate";
    Swf2jsEvent.prototype.CLICK = "press";
    Swf2jsEvent.prototype.CONTEXT_MENU = "contextMenu";
    Swf2jsEvent.prototype.DOUBLE_CLICK = "doubleClick";
    Swf2jsEvent.prototype.MIDDLE_CLICK = "middleClick";
    Swf2jsEvent.prototype.MIDDLE_MOUSE_DOWN = "middleMouseDown";
    Swf2jsEvent.prototype.MIDDLE_MOUSE_UP = "middleMouseUp";
    Swf2jsEvent.prototype.MOUSE_DOWN = "mouseDown";
    Swf2jsEvent.prototype.MOUSE_MOVE = "mouseMove";
    Swf2jsEvent.prototype.MOUSE_OUT = "rollOut"; // mouseOut
    Swf2jsEvent.prototype.MOUSE_OVER = "rollOver"; // mouseOver
    Swf2jsEvent.prototype.MOUSE_UP = "mouseUp";
    Swf2jsEvent.prototype.MOUSE_WHEEL = "mouseWheel";
    Swf2jsEvent.prototype.RIGHT_CLICK = "rightClick";
    Swf2jsEvent.prototype.RIGHT_MOUSE_DOWN = "rightMouseDown";
    Swf2jsEvent.prototype.RIGHT_MOUSE_UP = "rightMouseUp";
    Swf2jsEvent.prototype.ROLL_OUT = "rollOut";
    Swf2jsEvent.prototype.ROLL_OVER = "rollOver";

    /**
     * @param type
     * @param target
     * @constructor
     */
    var ClipEvent = function (type)
    {
        var _this = this;
        _this.type = type;
        _this.target = null;
        Swf2jsEvent.call(this);
    };

    /**
     * extends
     * @type {EventDispatcher}
     */
    ClipEvent.prototype = Object.create(Swf2jsEvent.prototype);
    ClipEvent.prototype.constructor = ClipEvent;

    var clipEvent = new ClipEvent();

    /**
     * @constructor
     */
    var EventDispatcher = function ()
    {
        var _this = this;
        _this.events = {};
        _this.isLoad = false;
        _this.active = false;
    };

    /**
     * properties
     */
    Object.defineProperties(EventDispatcher.prototype,
    {
        onEnterFrame: {
            get: function () {
                return this.getOnEvent("onEnterFrame");
            },
            set: function (onEnterFrame) {
                this.setOnEvent("onEnterFrame", onEnterFrame);
            }
        },
        onPress: {
            get: function () {
                return this.getOnEvent("onPress");
            },
            set: function (onPress) {
                this.setOnEvent("onPress", onPress);
            }
        },
        onRelease: {
            get: function () {
                return this.getOnEvent("onRelease");
            },
            set: function (onRelease) {
                this.setOnEvent("onRelease", onRelease);
            }
        },
        onReleaseOutside: {
            get: function () {
                return this.getOnEvent("onReleaseOutside");
            },
            set: function (onReleaseOutside) {
                this.setOnEvent("onReleaseOutside", onReleaseOutside);
            }
        },
        onRollOver: {
            get: function () {
                return this.getOnEvent("onRollOver");
            },
            set: function (onRollOver) {
                this.setOnEvent("onRollOver", onRollOver);
            }
        },
        onRollOut: {
            get: function () {
                return this.getOnEvent("onRollOut");
            },
            set: function (onRollOut) {
                this.setOnEvent("onRollOut", onRollOut);
            }
        },
        onData: {
            get: function () {
                return this.getOnEvent("onData");
            },
            set: function (onData) {
                this.setOnEvent("onData", onData);
            }
        },
        onMouseDown: {
            get: function () {
                return this.getOnEvent("onMouseDown");
            },
            set: function (onMouseDown) {
                this.setOnEvent("onMouseDown", onMouseDown);
            }
        },
        onMouseUp: {
            get: function () {
                return this.getOnEvent("onMouseUp");
            },
            set: function (onMouseUp) {
                this.setOnEvent("onMouseUp", onMouseUp);
            }
        },
        onMouseMove: {
            get: function () {
                return this.getOnEvent("onMouseMove");
            },
            set: function (onMouseMove) {
                this.setOnEvent("onMouseMove", onMouseMove);
            }
        },
        onDragOut: {
            get: function () {
                return this.getOnEvent("onDragOut");
            },
            set: function (onDragOut) {
                this.setOnEvent("onDragOut", onDragOut);
            }
        },
        onDragOver: {
            get: function () {
                return this.getOnEvent("onDragOver");
            },
            set: function (onDragOver) {
                this.setOnEvent("onDragOver", onDragOver);
            }
        },
        onKeyDown: {
            get: function () {
                return this.getOnEvent("onKeyDown");
            },
            set: function (onKeyDown) {
                this.setOnEvent("onKeyDown", onKeyDown);
            }
        },
        onKeyUp: {
            get: function () {
                return this.getOnEvent("onKeyUp");
            },
            set: function (onKeyUp) {
                this.setOnEvent("onKeyUp", onKeyUp);
            }
        },
        onLoad: {
            get: function () {
                return this.getOnEvent("onLoad");
            },
            set: function (onLoad) {
                this.setOnEvent("onLoad", onLoad);
            }
        },
        onUnLoad: {
            get: function () {
                return this.getOnEvent("onUnLoad");
            },
            set: function (onUnLoad) {
                this.setOnEvent("onUnLoad", onUnLoad);
            }
        }
    });

    /**
     * @param type
     * @returns {*}
     */
    EventDispatcher.prototype.getOnEvent = function (type)
    {
        return this.variables[type];
    };

    /**
     * @param type
     * @param as
     */
    EventDispatcher.prototype.setOnEvent = function (type, as)
    {
        this.variables[type] = as;
    };

    /**
     * @param type
     * @param listener
     * @param useCapture
     * @param priority
     * @param useWeakReference
     */
    EventDispatcher.prototype.addEventListener = function (type, listener, useCapture, priority, useWeakReference)
    {
        var events = this.events;
        if (!(type in events)) {
            events[type] = [];
        }
        var event = events[type];
        event[event.length] = listener;
    };

    /**
     * @param event
     * @param stage
     */
    EventDispatcher.prototype.dispatchEvent = function (event, stage)
    {
        var _this = this;
        var type = event.type;
        if (_this.hasEventListener(type)) {
            var events = _this.events[type];
            var cEvent = new ClipEvent();
            cEvent.type = type;
            cEvent.target = this;
            var args = [cEvent];
            _this.setActionQueue(events, stage, args);
        }
    };

    /**
     * @param type
     * @returns {boolean}
     */
    EventDispatcher.prototype.hasEventListener = function (type)
    {
        return (type in this.events);
    };

    /**
     * @param type
     * @param listener
     * @param useCapture
     */
    EventDispatcher.prototype.removeEventListener = function (type, listener, useCapture)
    {
        var _this = this;
        if (_this.hasEventListener(type)) {
            var events = _this.events;
            var listeners = events[type];
            var length = listeners.length;
            for (var i = 0; i < length; i++) {
                if (listeners[i] !== listener) {
                    continue;
                }
                listeners.slice(i, 0);
                break;
            }
        }
    };

    /**
     * @param type
     */
    EventDispatcher.prototype.willTrigger = function (type)
    {
        return this.hasEventListener(type);
    };

    /**
     * @param as
     * @param stage
     * @param args
     */
    EventDispatcher.prototype.setActionQueue = function (as, stage, args)
    {
        var actions = stage.actions;
        actions[actions.length] = {as: as, mc: this, args: args};
    };

    /**
     * @constructor
     */
    var AccessibilityProperties = function () {};

    /**
     * @constructor
     */
    var DisplayObject = function ()
    {
        var _this = this;
        EventDispatcher.call(_this);
        _this.initialize();
    };

    /**
     * extends
     * @type {EventDispatcher}
     */
    DisplayObject.prototype = Object.create(EventDispatcher.prototype);
    DisplayObject.prototype.constructor = DisplayObject;

    /**
     * properties
     */
    Object.defineProperties(DisplayObject.prototype,
    {
        accessibilityProperties: {
            value: new AccessibilityProperties()
        },
        alpha: {
            get: function () {
                return this.getAlpha() / 100;
            },
            set: function (alpha) {
                this.setAlpha(alpha * 100);
            }
        },
        _alpha: {
            get: function () {
                return this.getAlpha();
            },
            set: function (alpha) {
                this.setAlpha(alpha);
            }
        },
        name: {
            get: function () {
                return this.getName();
            },
            set: function (name) {
                this.setName(name);
            }
        },
        _name: {
            get: function () {
                return this.getName();
            },
            set: function (name) {
                this.setName(name);
            }
        },
        blendMode: {
            get: function () {
                return this.getBlendMode();
            },
            set: function (blendMode) {
                this.setBlendMode(blendMode);
            }
        },
        filters: {
            get: function () {
                return this.getFilters();
            },
            set: function (filters) {
                this.setFilters(filters);
            }
        },
        _visible: {
            get: function () {
                return this.getVisible();
            },
            set: function (visible) {
                this.setVisible(visible);
            }
        },
        visible: {
            get: function () {
                return this.getVisible();
            },
            set: function (visible) {
                this.setVisible(visible);
            }
        },
        _rotation: {
            get: function () {
                return this.getRotation();
            },
            set: function (rotation) {
                this.setRotation(rotation);
            }
        },
        rotation: {
            get: function () {
                return this.getRotation();
            },
            set: function (rotation) {
                this.setRotation(rotation);
            }
        },
        _height: {
            get: function () {
                return this.getHeight();
            },
            set: function (height) {
                this.setHeight(height);
            }
        },
        height: {
            get: function () {
                return this.getHeight();
            },
            set: function (height) {
                this.setHeight(height);
            }
        },
        _width: {
            get: function () {
                return this.getWidth();
            },
            set: function (width) {
                this.setWidth(width);
            }
        },
        width: {
            get: function () {
                return this.getWidth();
            },
            set: function (width) {
                this.setWidth(width);
            }
        },
        _x: {
            get: function () {
                return this.getX();
            },
            set: function (x) {
                this.setX(x);
            }
        },
        x: {
            get: function () {
                return this.getX();
            },
            set: function (x) {
                this.setX(x);
            }
        },
        _y: {
            get: function () {
                return this.getY();
            },
            set: function (y) {
                this.setY(y);
            }
        },
        y: {
            get: function () {
                return this.getY();
            },
            set: function (y) {
                this.setY(y);
            }
        },
        _xscale: {
            get: function () {
                return this.getXScale();
            },
            set: function (xscale) {
                this.setXScale(xscale);
            }
        },
        scaleX: {
            get: function () {
                return this.getXScale();
            },
            set: function (xscale) {
                this.setXScale(xscale);
            }
        },
        _yscale: {
            get: function () {
                return this.getYScale();
            },
            set: function (yscale) {
                this.setYScale(yscale);
            }
        },
        scaleY: {
            get: function () {
                return this.getYScale();
            },
            set: function (yscale) {
                this.setYScale(yscale);
            }
        },
        _xmouse: {
            get: function () {
                return this.getXMouse();
            },
            set: function () {
            }
        },
        mouseX: {
            get: function () {
                return this.getXMouse();
            },
            set: function () {
            }
        },
        _ymouse: {
            get: function () {
                return this.getYMouse();
            },
            set: function () {
            }
        },
        mouseY: {
            get: function () {
                return this.getYMouse();
            },
            set: function () {
            }
        },
        mask: {
            get: function () {
                return this.getMask();
            },
            set: function (obj) {
                this.setMask(obj);
            }
        },
        enabled: {
            get: function () {
                return this.getEnabled();
            },
            set: function (enabled) {
                this.setEnabled(enabled);
            }
        },
        _parent: {
            get: function () {
                return this.getParent();
            },
            set: function (parent) {
                this.setParent(parent);
            }
        },
        parent: {
            get: function () {
                return this.getParent();
            },
            set: function (parent) {
                this.setParent(parent);
            }
        }
    });

    /**
     * initialize
     */
    DisplayObject.prototype.initialize = function ()
    {
        var _this = this;

        // common
        _this.instanceId = instanceId++;
        _this.characterId = 0;
        _this.tagType = 0;
        _this.ratio = 0;
        _this.isMask = false;
        _this.clipDepth = 0;
        _this.isClipDepth = false;
        _this.stageId = null;
        _this.loadStageId = null;
        _this.variables = {};
        _this.buttonStatus = "up";
        _this.removeFlag = false;
        _this.parentId = null;

        // properties
        _this.__visible = true;
        _this.__name = null;
        _this._url = null;
        _this._highquality = 1;
        _this._focusrect = 1;
        _this._soundbuftime = null;
        _this._totalframes = 1;
        _this._level = 0;
        _this._depth = null;
        _this._framesloaded = 0;
        _this._target = "";
        _this._lockroot = undefined;
        _this._enabled = true;
        _this._blendMode = null;
        _this._filters = null;
        _this._filterCacheKey = null;
        _this._parentPlace = null;
        _this._mask = null;
        _this._matrix = null;
        _this._colorTransform = null;
        _this._extend = false;
        _this._viewRotation = null;
        _this._viewXScale = null;
        _this._viewYScale = null;

        // avm2
        _this.avm2 = null;
    };

    // filters
    DisplayObject.prototype.flash = {
        filters: {
            DropShadowFilter: DropShadowFilter,
            BlurFilter: BlurFilter,
            GlowFilter: GlowFilter,
            BevelFilter: BevelFilter,
            GradientGlowFilter: GradientGlowFilter,
            ConvolutionFilter: ConvolutionFilter,
            ColorMatrixFilter: ColorMatrixFilter,
            GradientBevelFilter: GradientBevelFilter,
            BitmapFilter: BitmapFilter
        }
    };

    /**
     * @returns {string}
     */
    DisplayObject.prototype.toString = function ()
    {
        var target = this.getTarget();
        var str = "_level0";
        var array = target.split("/");
        str += array.join(".");
        return str;
    };

    DisplayObject.prototype.invert = function (matrix)
    {
        const newMatrix = [];
        let a, b, c, d ,tx, ty, det;

        a  = matrix[0];
        b  = matrix[1];
        c  = matrix[2];
        d  = matrix[3];
        tx = matrix[4] / 20;
        ty = matrix[5] / 20;

        switch (true) {

            case (b === 0 && c === 0):

                newMatrix[0]  = 1 / a;
                newMatrix[1]  = 0;
                newMatrix[2]  = 0;
                newMatrix[3]  = 1 / d;
                newMatrix[4] = -newMatrix[0] * tx;
                newMatrix[5] = -newMatrix[3] * ty;

                break;

            default:

                det = a * d - b * c;

                switch (true) {

                    case det === 0:
                        this.identity();
                        break;

                    default:

                        const rdet = 1 / det;

                        newMatrix[0]  = d  * rdet;
                        newMatrix[1]  = -b * rdet;
                        newMatrix[2]  = -c * rdet;
                        newMatrix[3]  = a  * rdet;
                        newMatrix[4] = -(newMatrix[0] * tx + newMatrix[2] * ty);
                        newMatrix[5] = -(newMatrix[1] * tx + newMatrix[3] * ty);
                        break;

                }

                break;

        }

        return newMatrix;
    };

    DisplayObject.prototype.globalToLocal = function (point)
    {
        let matrix = this.getMatrix();

        let parent = this._parent;
        while (parent) {

            matrix = this.multiplicationMatrix(
                parent.getMatrix(),
                matrix
            );

            parent = parent._parent;
        }

        matrix = this.invert(matrix);

        const x = point.x * matrix[0] + point.y * matrix[2] + matrix[4];
        const y = point.x * matrix[1] + point.y * matrix[3] + matrix[5];

        point.x = x;
        point.y = y;
    };

    DisplayObject.prototype.localToGlobal = function (point)
    {
        let matrix = this.getMatrix();

        let parent = this._parent;
        while (parent) {

            matrix = this.multiplicationMatrix(
                parent.getMatrix(),
                matrix
            );

            parent = parent._parent;
        }

        matrix[4] /= 20;
        matrix[5] /= 20;

        const x = point.x * matrix[0] + point.y * matrix[2] + matrix[4];
        const y = point.x * matrix[1] + point.y * matrix[3] + matrix[5];

        point.x = x;
        point.y = y;
    };

    /**
     * @param a
     * @param b
     * @returns []
     */
    DisplayObject.prototype.multiplicationMatrix = function(a, b)
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
     * @param a
     * @param b
     * @returns []
     */
    DisplayObject.prototype.multiplicationColor = function(a, b)
    {
        return [
            a[0] * b[0], a[1] * b[1],
            a[2] * b[2], a[3] * b[3],
            a[0] * b[4] + a[4], a[1] * b[5] + a[5],
            a[2] * b[6] + a[6], a[3] * b[7] + a[7]
        ];
    };

    /**
     * @param bounds
     * @param matrix
     * @param object
     * @returns {{xMin: Number, xMax: number, yMin: Number, yMax: number}}
     */
    DisplayObject.prototype.boundsMatrix = function (bounds, matrix, object)
    {
        var no = _Number.MAX_VALUE;
        var xMax = -no;
        var yMax = -no;
        var xMin = no;
        var yMin = no;

        if (object) {
            xMin = object.xMin;
            xMax = object.xMax;
            yMin = object.yMin;
            yMax = object.yMax;
        }

        var x0 = bounds.xMax * matrix[0] + bounds.yMax * matrix[2] + matrix[4];
        var x1 = bounds.xMax * matrix[0] + bounds.yMin * matrix[2] + matrix[4];
        var x2 = bounds.xMin * matrix[0] + bounds.yMax * matrix[2] + matrix[4];
        var x3 = bounds.xMin * matrix[0] + bounds.yMin * matrix[2] + matrix[4];
        var y0 = bounds.xMax * matrix[1] + bounds.yMax * matrix[3] + matrix[5];
        var y1 = bounds.xMax * matrix[1] + bounds.yMin * matrix[3] + matrix[5];
        var y2 = bounds.xMin * matrix[1] + bounds.yMax * matrix[3] + matrix[5];
        var y3 = bounds.xMin * matrix[1] + bounds.yMin * matrix[3] + matrix[5];

        xMax = _max(_max(_max(_max(xMax, x0), x1), x2), x3);
        xMin = _min(_min(_min(_min(xMin, x0), x1), x2), x3);
        yMax = _max(_max(_max(_max(yMax, y0), y1), y2), y3);
        yMin = _min(_min(_min(_min(yMin, y0), y1), y2), y3);

        return {xMin: xMin, xMax: xMax, yMin: yMin, yMax: yMax};
    };

    /**
     * @param color
     * @param data
     * @returns {{R: number, G: number, B: number, A: number}}
     */
    DisplayObject.prototype.generateColorTransform = function (color, data)
    {
        return {
            R: _max(0, _min((color.R * data[0]) + data[4], 255))|0,
            G: _max(0, _min((color.G * data[1]) + data[5], 255))|0,
            B: _max(0, _min((color.B * data[2]) + data[6], 255))|0,
            A: _max(0, _min((color.A * 255 * data[3]) + data[7], 255)) / 255
        };
    };

    /**
     * @param src
     * @returns {Array}
     */
    DisplayObject.prototype.cloneArray = function(src)
    {
        var arr = [];
        var length = src.length;
        for (var i = 0; i < length; i++) {
            arr[i] = src[i];
        }
        return arr;
    };

    /**
     * @param blendMode
     * @returns {String}
     */
    DisplayObject.prototype.getBlendName = function (blendMode)
    {
        var mode = null;
        switch (blendMode) {
            case 1:
            case "normal":
                mode = "normal";
                break;
            case 2:
            case "layer":
                mode = "layer";
                break;
            case 3:
            case "multiply":
                mode = "multiply";
                break;
            case 4:
            case "screen":
                mode = "screen";
                break;
            case 5:
            case "lighten":
                mode = "lighten";
                break;
            case 6:
            case "darken":
                mode = "darken";
                break;
            case 7:
            case "difference":
                mode = "difference";
                break;
            case 8:
            case "add":
                mode = "add";
                break;
            case 9:
            case "subtract":
                mode = "subtract";
                break;
            case 10:
            case "invert":
                mode = "invert";
                break;
            case 11:
            case "alpha":
                mode = "alpha";
                break;
            case 12:
            case "erase":
                mode = "erase";
                break;
            case 13:
            case "overlay":
                mode = "overlay";
                break;
            case 14:
            case "hardlight":
                mode = "hardlight";
                break;
        }
        return mode;
    };

    /**
     * @param stage
     */
    DisplayObject.prototype.setStage = function (stage)
    {
        var _this = this;
        _this.stageId = stage.getId();
        if (_this instanceof SimpleButton) {
            var upState = _this.getSprite("up");
            upState.setStage(stage);
            var downState = _this.getSprite("down");
            downState.setStage(stage);
            var hitState = _this.getSprite("hit");
            hitState.setStage(stage);
            var overState = _this.getSprite("over");
            overState.setStage(stage);
        }
        stage.setInstance(_this);
    };

    /**
     * @returns {*}
     */
    DisplayObject.prototype.getStage = function ()
    {
        var _this = this;
        var stage = _this.getLoadStage();
        if (!stage) {
            stage = _this.getParentStage();
        }
        return stage;
    };

    /**
     * @returns {*}
     */
    DisplayObject.prototype.getParentStage = function ()
    {
        var stageId = this.stageId;
        if (stageId !== null) {
            if (stageId in stages) {
                return stages[stageId];
            } else {
                return loadStages[stageId];
            }
        }
    };

    /**
     * @returns {*}
     */
    DisplayObject.prototype.getLoadStage = function ()
    {
        var loadStageId = this.loadStageId;
        if (loadStageId !== null) {
            if (loadStageId in stages) {
                return stages[loadStageId];
            } else {
                return loadStages[loadStageId];
            }
        }
    };

    /**
     * @param stage
     */
    DisplayObject.prototype.setLoadStage = function (stage)
    {
        var _this = this;
        _this.loadStageId = null;
        if (stage !== null) {
            stage.setInstance(_this);
            _this.loadStageId = stage.getId();
        }
    };

    /**
     * @returns {number}
     */
    DisplayObject.prototype.getCharacterId = function ()
    {
        return this.characterId;
    };

    /**
     * @param characterId
     */
    DisplayObject.prototype.setCharacterId = function (characterId)
    {
        this.characterId = characterId;
    };

    /**
     * @returns {number}
     */
    DisplayObject.prototype.getTagType = function ()
    {
        return this.tagType;
    };

    /**
     * @param tagType
     */
    DisplayObject.prototype.setTagType = function (tagType)
    {
        this.tagType = tagType;
    };

    /**
     * @returns {number}
     */
    DisplayObject.prototype.getRatio = function ()
    {
        return this.ratio;
    };

    /**
     * @param ratio
     */
    DisplayObject.prototype.setRatio = function (ratio)
    {
        this.ratio = ratio;
    };

    /**
     * @returns {*}
     */
    DisplayObject.prototype.getParent = function ()
    {
        var _this = this;
        var stage = _this.getLoadStage();
        var parent;
        var pId = _this.parentId;
        if (stage) {
            parent = stage.getInstance(pId);
        }
        if (!parent) {
            stage = _this.getParentStage();
            parent = stage.getInstance(pId);
        }
        return parent;
    };

    /**
     * @param parent
     */
    DisplayObject.prototype.setParent = function (parent)
    {
        var _this = this;
        if (parent instanceof DisplayObjectContainer) {
            parent.setInstance(_this);
        }
        _this.parentId = parent.instanceId;
    };

    /**
     * @returns {*}
     */
    DisplayObject.prototype.getParentSprite = function ()
    {
        var _this = this;
        var stage = _this.getStage();
        return stage.getInstance(_this._sprite);
    };

    /**
     * @param sprite
     */
    DisplayObject.prototype.setParentSprite = function (sprite)
    {
        this._sprite = sprite.instanceId;
    };

    /**
     * @returns {*}
     */
    DisplayObject.prototype.getButtonStatus = function ()
    {
        return this.buttonStatus;
    };

    /**
     * @param status
     */
    DisplayObject.prototype.setButtonStatus = function (status)
    {
        this.buttonStatus = status;
    };

    /**
     * @returns {*}
     */
    DisplayObject.prototype.getMask = function ()
    {
        return this._mask;
    };

    /**
     * @param obj
     */
    DisplayObject.prototype.setMask = function (obj)
    {
        var _this = this;
        var maskMc = _this._mask;
        if (maskMc) {
            maskMc.isMask = false;
        }
        obj.isMask = true;
        _this._mask = obj;
    };

    /**
     * @returns {*}
     */
    DisplayObject.prototype.getEnabled = function ()
    {
        return this._enabled;
    };

    /**
     * @param enabled
     */
    DisplayObject.prototype.setEnabled = function (enabled)
    {
        this._enabled = enabled;
    };

    /**
     * @returns {boolean}
     */
    DisplayObject.prototype.getButtonMode = function ()
    {
        return this._buttonMode;
    };

    /**
     * @param buttonMode
     */
    DisplayObject.prototype.setButtonMode = function (buttonMode)
    {
        this._buttonMode = buttonMode;
    };

    /**
     * @returns {string}
     */
    DisplayObject.prototype.getTarget = function ()
    {
        return this._target;
    };

    /**
     * @param target
     */
    DisplayObject.prototype.setTarget = function (target)
    {
        this._target = target;
    };

    /**
     * @param path
     * @returns {{scope: DisplayObject, target: *}}
     */
    DisplayObject.prototype.splitPath = function (path)
    {
        var _this = this;
        var scope = _this;
        var target = path;
        var split;
        var targetPath = "";
        if (typeof path === "string") {
            if (path.indexOf("::") !== -1) {
                scope = _this;
                target = path;
            } else if (path.indexOf(":") !== -1) {
                split = path.split(":");
                targetPath = split[0];
                target = split[1];
            } else if (path.indexOf(".") !== -1) {
                split = path.split(".");
                target = split.pop();
                targetPath += split.join(".");
            }

            if (targetPath !== "") {
                var mc = _this.getDisplayObject(targetPath);
                if (mc) {
                    scope = mc;
                }
            }
        }

        return {
            "scope": scope,
            "target": target
        };
    };

    /**
     * @param name
     * @param parse
     * @returns {undefined}
     */
    DisplayObject.prototype.getProperty = function (name, parse)
    {
        var _this = this;
        var target = name;
        if (parse !== false) {
            var obj = _this.splitPath(name);
            _this = obj.scope;
            target = obj.target;
        }

        if (_this.removeFlag) {
            return undefined;
        }

        var value;
        var prop = (typeof target === "string") ? target.toLowerCase() : target;
        switch (prop) {
            case 0:
            case "_x":
                value = _this.getX();
                break;
            case 1:
            case "_y":
                value = _this.getY();
                break;
            case 2:
            case "_xscale":
                value = _this.getXScale();
                break;
            case 3:
            case "_yscale":
                value = _this.getYScale();
                break;
            case 4:
            case "_currentframe":
                if (_this instanceof MovieClip) {
                    value = _this.getCurrentFrame();
                }
                break;
            case 5:
            case "_totalframes":
                if (_this instanceof MovieClip) {
                    value = _this.getTotalFrames();
                }
                break;
            case 6:
            case "_alpha":
                value = _this.getAlpha();
                break;
            case 7:
            case "_visible":
                value = _this.getVisible();
                break;
            case 8:
            case "_width":
                value = _this.getWidth();
                break;
            case 9:
            case "_height":
                value = _this.getHeight();
                break;
            case 10:
            case "_rotation":
                value = _this.getRotation();
                break;
            case 11:
            case "_target":
                value = _this.getTarget();
                break;
            case 12:
            case "_framesloaded":
                value = _this._framesloaded;
                break;
            case 13:
            case "_name":
                value = _this.getName();
                break;
            case 14:
            case "_droptarget":
                if (_this instanceof MovieClip) {
                    value = _this.getDropTarget();
                }
                break;
            case 15:
            case "_url":
                value = _this._url;
                break;
            case 16:
            case "_highquality":
                value = _this._highquality;
                break;
            case 17:
            case "_focusrect":
                value = _this._focusrect;
                break;
            case 18:
            case "_soundbuftime":
                value = _this._soundbuftime;
                break;
            case 19:
            case "_quality":
                value = _this._quality;
                break;
            case 20:
            case "_xmouse":
                value = _this.getXMouse();
                break;
            case 21:
            case "_ymouse":
                value = _this.getYMouse();
                break;
            case "text":
            case "htmltext":
                if (_this instanceof TextField) {
                    var variable = _this.getVariable("variable");
                    if (variable) {
                        var mc = _this.getParent();
                        value = mc.getProperty(variable);
                    } else {
                        value = _this.getVariable("text");
                    }
                } else {
                    value = _this.getVariable(target);
                }
                break;
            case "$version":
                value = "swf2js 8,0,0";
                break;
            case "enabled":
                value = _this.getEnabled();
                break;
            case "blendmode":
                value = _this.getBlendMode();
                break;
            case "sharedobject":
                value = new SharedObject();
                break;
            case "key":
                value = keyClass;
                break;
            case "mouse":
                var _root = _this.getDisplayObject("_root");
                var rootStage = _root.getStage();
                value = rootStage.mouse;
                break;
            default:
                value = _this.getVariable(target, parse);
                if (value === undefined && target !== name) {
                    value = _this.getGlobalVariable(name);
                }
                break;
        }

        return value;
    };

    /**
     * @param name
     * @param value
     * @param parse
     */
    DisplayObject.prototype.setProperty = function (name, value, parse)
    {
        var _this = this;
        var target = name;
        if (parse !== false) {
            var obj = _this.splitPath(name);
            _this = obj.scope;
            target = obj.target;
        }

        var prop = (typeof target === "string") ? target.toLowerCase() : target;
        switch (prop) {
            case 0:
            case "_x":
                _this.setX(value);
                break;
            case 1:
            case "_y":
                _this.setY(value);
                break;
            case 2:
            case "_xscale":
                _this.setXScale(value);
                break;
            case 3:
            case "_yscale":
                _this.setYScale(value);
                break;
            case 4:
            case "_currentframe":
            case 5:
            case "_totalframes":
            case 15:
            case "_url":
            case 20:
            case "_xmouse":
            case 21:
            case "_ymouse":
            case 11:
            case "_target":
            case 12:
            case "_framesloaded":
            case 14:
            case "_droptarget":
                // readonly
                break;
            case 6:
            case "_alpha":
                _this.setAlpha(value);
                break;
            case 7:
            case "_visible":
                _this.setVisible(value);
                break;
            case 8:
            case "_width":
                _this.setWidth(value);
                break;
            case 9:
            case "_height":
                _this.setHeight(value);
                break;
            case 10:
            case "_rotation":
                _this.setRotation(value);
                break;
            case 13:
            case "_name":
                _this.setName(value);
                break;
            case 16:
            case "_highquality":
                _this._highquality = value;
                break;
            case 17:
            case "_focusrect":
                _this._focusrect = value;
                break;
            case 18:
            case "_soundbuftime":
                _this._soundbuftime = value;
                break;
            case 19:
            case "_quality":
                _this._quality = value;
                break;
            case "text":
            case "htmltext":
                if (_this instanceof TextField) {
                    var variable = _this.getVariable("variable");
                    if (variable) {
                        var mc = _this.getParent();
                        mc.setProperty(variable, value);
                    } else {
                        _this.setVariable("text", value);
                    }
                    var input = _this.input;
                    if (input) {
                        input.value = value;
                    }
                } else {
                    _this.setVariable(target, value);
                }
                break;
            case "blendmode":
                _this.setBlendMode(value);
                break;
            case "enabled":
                _this.setEnabled(value);
                break;
            case "filters":
                _this.setFilters(value);
                break;
            default:
                _this.setVariable(target, value);
                break;
        }
    };

    /**
     * @returns {number}
     */
    DisplayObject.prototype.getDepth = function ()
    {
        var _this = this;
        var _depth = _this._depth;
        var depth = (_depth !== null) ? _depth : _this.getLevel();
        return depth - 16384;
    };

    /**
     * @param depth
     * @param swapDepth
     * @param swapMc
     */
    DisplayObject.prototype.setDepth = function (depth, swapDepth, swapMc)
    {
        var _this = this;
        var parent = _this.getParent();
        var _depth = _this._depth;
        var level = (_depth !== null) ? _depth : _this.getLevel();
        var totalFrame = parent.getTotalFrames() + 1;

        if (!swapMc) {
            _this._depth = depth;
        } else {
            _this._depth = swapDepth;
            swapMc._depth = depth;
        }

        var container = parent.container;
        var instanceId = _this.instanceId;
        for (var frame = 1; frame < totalFrame; frame++) {
            if (!(frame in container)) {
                container[frame] = [];
            }

            var tags = container[frame];
            if (swapMc) {
                if (level in tags && tags[level] === instanceId) {
                    tags[depth] = swapMc.instanceId;
                }

                if (swapDepth in tags && tags[swapDepth] === swapMc.instanceId) {
                    tags[swapDepth] = instanceId;
                }
            } else {
                if (!(level in tags) || level in tags && tags[level] === instanceId) {
                    delete tags[level];
                    tags[depth] = instanceId;
                }
            }

            container[frame] = tags;
        }
        _this.setController(false, false, false, false);
        if (swapMc) {
            swapMc.setController(false, false, false, false);
        }
    };

    /**
     * @returns {number}
     */
    DisplayObject.prototype.getX = function ()
    {
        var matrix = this.getMatrix();
        return (matrix) ? matrix[4] / 20 : undefined;
    };

    /**
     * @param x
     */
    DisplayObject.prototype.setX = function (x)
    {
        x = +x;
        if (!_isNaN(x)) {
            var _this = this;
            var _matrix = _this.getMatrix();
            var matrix = _this.cloneArray(_matrix);
            matrix[4] = x * 20;
            _this.setMatrix(matrix);
        }
    };

    /**
     * @returns {*}
     */
    DisplayObject.prototype.getY = function ()
    {
        var matrix = this.getMatrix();
        return (matrix) ? matrix[5] / 20 : undefined;
    };

    /**
     * @param y
     */
    DisplayObject.prototype.setY = function (y)
    {
        y = +y;
        if (!_isNaN(y)) {
            var _this = this;
            var _matrix = _this.getMatrix();
            var matrix = _this.cloneArray(_matrix);
            matrix[5] = y * 20;
            _this.setMatrix(matrix);
        }
    };

    /**
     * @returns {*}
     */
    DisplayObject.prototype.getXScale = function ()
    {
        if (this._viewXScale !== null) {
            return this._viewXScale;
        }

        var matrix = this.getMatrix();
        var xScale = _sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]) * 100;
        if (0 > matrix[0]) {
            xScale *= -1;
        }
        return xScale;
    };

    /**
     * @param xscale
     */
    DisplayObject.prototype.setXScale = function (xscale)
    {
        xscale = +xscale;
        if (!_isNaN(xscale) && this._viewXScale !== xscale) {
            var _this = this;
            var _matrix = _this.getMatrix();
            var matrix = _this.cloneArray(_matrix);
            var radianX = _atan2(matrix[1], matrix[0]);
            if (radianX === -_PI) {
                radianX = 0;
            }
            this._viewXScale = xscale;
            xscale /= 100;
            matrix[0] = xscale * _cos(radianX);
            matrix[1] = xscale * _sin(radianX);
            _this.setMatrix(matrix);
        }
    };

    /**
     * @returns {*}
     */
    DisplayObject.prototype.getYScale = function ()
    {
        if (this._viewYScale !== null) {
            return this._viewYScale;
        }

        var matrix = this.getMatrix();
        var yScale = _sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3]) * 100;
        if (0 > matrix[3]) {
            yScale *= -1;
        }
        return yScale;
    };

    /**
     * @param yscale
     */
    DisplayObject.prototype.setYScale = function (yscale)
    {
        yscale = +yscale;
        if (!_isNaN(yscale) && this._viewYScale !== yscale) {
            var _this = this;
            var _matrix = _this.getMatrix();
            var matrix = _this.cloneArray(_matrix);
            var radianY = _atan2(-matrix[2], matrix[3]);
            if (radianY === -_PI) {
                radianY = 0;
            }
            this._viewYScale = yscale;
            yscale /= 100;
            matrix[2] = -yscale * _sin(radianY);
            matrix[3] = yscale * _cos(radianY);
            _this.setMatrix(matrix);
        }
    };

    /**
     * @returns {number}
     */
    DisplayObject.prototype.getAlpha = function ()
    {
        var colorTransform = this.getColorTransform();
        var alpha = colorTransform[3] + (colorTransform[7] / 255);
        return alpha * 100;
    };

    /**
     * @param alpha
     */
    DisplayObject.prototype.setAlpha = function (alpha)
    {
        alpha = +alpha;
        if (!_isNaN(alpha)) {
            var _this = this;
            var _colorTransform = _this.getColorTransform();
            var colorTransform = _this.cloneArray(_colorTransform);
            colorTransform[3] = alpha / 100;
            colorTransform[7] = 0;
            _this.setColorTransform(colorTransform);
        }
    };

    /**
     * @returns {number}
     */
    DisplayObject.prototype.getVisible = function ()
    {
        var _this = this;
        var stage = _this.getStage();
        var version = stage.getVersion();
        if (version > 4) {
            return _this.__visible;
        }
        return (_this.__visible) ? 1 : 0;
    };

    /**
     * @param visible
     */
    DisplayObject.prototype.setVisible = function (visible)
    {
        var _this = this;
        if (typeof visible === "boolean") {
            _this.__visible = visible;
        } else {
            visible = +visible;
            if (!_isNaN(visible)) {
                _this.__visible = (visible) ? true : false;
            }
        }
    };

    /**
     * @returns {number}
     */
    DisplayObject.prototype.getLevel = function ()
    {
        return this._level;
    };

    /**
     * @param level
     */
    DisplayObject.prototype.setLevel = function (level)
    {
        this._level = level;
    };

    /**
     * @returns {null}
     */
    DisplayObject.prototype.getName = function ()
    {
        return this.__name;
    };

    /**
     * @param name
     */
    DisplayObject.prototype.setName = function (name)
    {
        this.__name = name;
    };

    /**
     * @returns {number}
     */
    DisplayObject.prototype.getRotation = function ()
    {
        if (this._viewRotation !== null) {
            return this._viewRotation * 180 / _PI;
        }

        var matrix = this.getMatrix();
        var rotation = _atan2(matrix[1], matrix[0]) * 180 / _PI;
        switch (rotation) {
            case -90.00000000000001:
                rotation = -90;
                break;
            case 90.00000000000001:
                rotation = 90;
                break;
        }
        return rotation;
    };

    /**
     * @param rotation
     */
    DisplayObject.prototype.setRotation = function (rotation)
    {
        rotation = +rotation;
        if (!_isNaN(rotation)) {
            var _this = this;
            var _matrix = _this.getMatrix();
            var matrix = _this.cloneArray(_matrix);
            var radianX = _atan2(matrix[1], matrix[0]);
            var radianY = _atan2(-matrix[2], matrix[3]);
            var ScaleX = _sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
            var ScaleY = _sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3]);
            rotation *= _PI / 180;
            radianY += rotation - radianX;
            radianX = rotation;
            matrix[0] = ScaleX * _cos(radianX);
            matrix[1] = ScaleX * _sin(radianX);
            matrix[2] = -ScaleY * _sin(radianY);
            matrix[3] = ScaleY * _cos(radianY);

            _this.setMatrix(matrix);
            this._viewRotation = rotation;
        }
    };

    /**
     * @returns {number}
     */
    DisplayObject.prototype.getWidth = function ()
    {
        var _this = this;
        var matrix = _this.getMatrix();
        var bounds = _this.getBounds(matrix);
        return _abs(bounds.xMax - bounds.xMin);
    };

    /**
     * @param width
     */
    DisplayObject.prototype.setWidth = function (width)
    {
        width = +width;
        if (!_isNaN(width)) {
            var _this = this;
            var _matrix = _this.getOriginMatrix();
            var bounds = _this.getBounds(_matrix);
            var _width = _abs(bounds.xMax - bounds.xMin);
            var xScale = width * _matrix[0] / _width;
            if (_isNaN(xScale)) {
                xScale = 0;
            }
            _matrix = _this.getMatrix();
            var matrix = _this.cloneArray(_matrix);
            matrix[0] = xScale;
            _this.setMatrix(matrix);
        }
    };

    /**
     * @returns {number}
     */
    DisplayObject.prototype.getHeight = function ()
    {
        var _this = this;
        var matrix = _this.getMatrix();
        var bounds = _this.getBounds(matrix);
        return _abs(bounds.yMax - bounds.yMin);
    };

    /**
     * @param height
     */
    DisplayObject.prototype.setHeight = function (height)
    {
        height = +height;
        if (!_isNaN(height)) {
            var _this = this;
            var _matrix = _this.getOriginMatrix();
            var bounds = _this.getBounds(_matrix);
            var _height = _abs(bounds.yMax - bounds.yMin);
            var yScale = height * _matrix[3] / _height;
            if (_isNaN(yScale)) {
                yScale = 0;
            }
            _matrix = _this.getMatrix();
            var matrix = _this.cloneArray(_matrix);
            matrix[3] = yScale;
            _this.setMatrix(matrix);
        }
    };

    /**
     * @returns {*}
     */
    DisplayObject.prototype.getXMouse = function ()
    {
        if (!_event) {
            return null;
        }
        var _this = this;
        var _root = _this.getDisplayObject("_root");
        var stage = _root.getStage();
        var div = _document.getElementById(stage.getName());
        var bounds = div.getBoundingClientRect();
        var x = window.pageXOffset + bounds.left;
        var touchX = 0;
        if (isTouch) {
            var changedTouche = _event.changedTouches[0];
            touchX = changedTouche.pageX;
        } else {
            touchX = _event.pageX;
        }

        var mc = _this;
        var matrix = _this.getMatrix();
        while (true) {
            var parent = mc.getParent();
            if (!parent) {
                break;
            }
            matrix = _this.multiplicationMatrix(parent.getMatrix(), matrix);
            mc = parent;
        }

        var scale = stage.getScale();
        touchX -= x;
        touchX /= scale;
        touchX -= matrix[4] / 20;
        return touchX;
    };

    /**
     * @returns {*}
     */
    DisplayObject.prototype.getYMouse = function ()
    {
        if (!_event) {
            return null;
        }
        var _this = this;
        var _root = _this.getDisplayObject("_root");
        var stage = _root.getStage();
        var div = _document.getElementById(stage.getName());
        var bounds = div.getBoundingClientRect();
        var y = window.pageYOffset + bounds.top;
        var touchY = 0;
        if (isTouch) {
            var changedTouche = _event.changedTouches[0];
            touchY = changedTouche.pageY;
        } else {
            touchY = _event.pageY;
        }

        var mc = _this;
        var matrix = _this.getMatrix();
        while (true) {
            var parent = mc.getParent();
            if (!parent) {
                break;
            }
            matrix = _this.multiplicationMatrix(parent.getMatrix(), matrix);
            mc = parent;
        }

        var scale = stage.getScale();
        touchY -= y;
        touchY /= scale;
        touchY -= matrix[5] / 20;
        return touchY;
    };

    /**
     * @param name
     * @param parse
     * @returns {*}
     */
    DisplayObject.prototype.getVariable = function (name, parse)
    {
        var _this = this;
        if (name === undefined) {
            return name;
        }

        var variables = _this.variables;
        if (!variables) {
            return undefined;
        }

        if (name in variables) {
            return variables[name];
        }

        var stage = _this.getStage();
        var version = stage.getVersion();
        if (version < 7) {
            for (var key in variables) {
                if (!variables.hasOwnProperty(key)) {
                    continue;
                }
                if (key.toLowerCase() === name.toLowerCase()) {
                    return variables[key];
                }
            }
        }

        var value;
        if (version > 4) {
            var registerClass = variables.registerClass;
            if (registerClass &&
                typeof registerClass === "object" &&
                name in registerClass
            ) {
                return registerClass[name];
            }

            if (_this instanceof MovieClip) {
                value = _this.getDisplayObject(name, parse);
                if (value) {
                    return value;
                }
            }

            // avm2
            var cId = _this.getCharacterId();
            var symbol = stage.symbols[cId];
            if (symbol) {
                var symbols = symbol.split(".");
                var classMethod = symbols.pop();
                var sLen = symbols.length;
                var classObj = stage.avm2;
                for (var sIdx = 0; sIdx < sLen; sIdx++) {
                    classObj = classObj[symbols[sIdx]];
                }

                var AVM2 = classObj[classMethod];
                value = AVM2[name];
                if (value) {
                    return value;
                }
            }

            var _global = stage.getGlobal();
            value = _global.getVariable(name);
            if (value) {
                return value;
            }
            if (_this instanceof MovieClip && name === "flash") {
                return _this.flash;
            }
            if (name in window) {
                return window[name];
            }
        }
        return undefined;
    };

    /**
     * @param name
     * @param value
     */
    DisplayObject.prototype.setVariable = function (name, value)
    {
        var _this = this;
        var variables = _this.variables;
        var stage = _this.getStage();
        if (typeof name !== "string") {
            name += "";
        }

        if (stage.getVersion() < 7) {
            for (var key in variables) {
                if (!variables.hasOwnProperty(key)) {
                    continue;
                }
                if (key.toLowerCase() !== name.toLowerCase()) {
                    continue;
                }
                _this.variables[key] = value;
                return 0;
            }
        }
        _this.variables[name] = value;
    };

    /**
     * @param path
     * @returns {*}
     */
    DisplayObject.prototype.getGlobalVariable = function (path)
    {
        var _this = this;
        var stage = _this.getStage();
        var version = stage.getVersion();
        if (version < 5) {
            return undefined;
        }

        var splitData = null;
        if (path.indexOf(".") !== -1) {
            splitData = path.split(".");
        }

        var value;
        if (splitData) {
            var _global = stage.getGlobal();
            var variables = _global.variables;
            var length = splitData.length;
            for (var i = 0; i < length; i++) {
                var name = splitData[i];
                if (version < 7) {
                    for (var key in variables) {
                        if (!variables.hasOwnProperty(key)) {
                            continue;
                        }
                        if (key.toLowerCase() === name.toLowerCase()) {
                            value = variables[key];
                            break;
                        }
                    }
                } else {
                    value = variables[name];
                }

                if (!value) {
                    break;
                }
                variables = value;
            }
        }

        return value;
    };

    /**
     * @param path
     * @param parse
     * @returns {*}
     */
    DisplayObject.prototype.getDisplayObject = function (path, parse)
    {
        var _this = this;
        var mc = _this;
        var _root = mc;
        var tags, tag, stage, parent;

        if (!_this._lockroot) {
            while (true) {
                parent = _root.getParent();
                if (!parent) {
                    break;
                }
                _root = parent;
            }
        } else {
            stage = _this.getStage();
            _root = stage.getParent();
        }

        if (typeof path !== "string") {
            path += "";
        }
        if (path === "_root") {
            return _root;
        }
        if (path === "this") {
            return this;
        }
        stage = _root.getStage();
        if (path === "_global") {
            return stage.getGlobal();
        }

        parent = mc.getParent();
        if (path === "_parent") {
            return (parent !== null) ? parent : undefined;
        }

        var len = 1;
        var splitData = [path];
        if (parse !== false) {
            if (path.indexOf("/") !== -1) {
                splitData = path.split("/");
                len = splitData.length;
                if (splitData[0] === "") {
                    mc = _root;
                }
            } else if (path.indexOf(".") !== -1) {
                splitData = path.split(".");
                len = splitData.length;
                if (splitData[0] === "_root") {
                    mc = _root;
                }
            } else if (path.substr(0, 6) === "_level") {
                var level = path.substr(6);
                level = +level;
                if (level === 0) {
                    return _root;
                }
                if (!parent) {
                    parent = stage.getParent();
                }
                tags = parent.getTags();
                if (level in tags) {
                    var tId = tags[level];
                    tag = stage.getInstance(tId);
                    if (tag instanceof MovieClip) {
                        return tag;
                    }
                }
                return undefined;
            }
        }

        var version = stage.getVersion();
        for (var i = 0; i < len; i++) {
            var name = splitData[i];
            if (name === "") {
                continue;
            }
            if (name === "_root") {
                mc = _root;
                continue;
            }
            if (name === "this") {
                mc = _this;
                continue;
            }
            if (name === "_parent") {
                parent = mc.getParent();
                if (!parent) {
                    return undefined;
                }
                mc = parent;
                continue;
            }
            if (name === "..") {
                mc = mc.getParent();

                if (!mc) {
                    return undefined;
                }
                continue;
            }

            tags = mc.getTags();
            if (tags === undefined) {
                return undefined;
            }

            var tagLength = tags.length;
            var setTarget = false;
            if (tagLength > 0) {
                for (var idx in tags) {
                    if (!tags.hasOwnProperty(idx)) {
                        continue;
                    }

                    var instanceId = tags[idx];
                    var loadStage = mc.getStage();
                    tag = loadStage.getInstance(instanceId);
                    if (!tag || tag.removeFlag) {
                        continue;
                    }

                    var tagName = tag.getName();
                    if (!tagName) {
                        continue;
                    }

                    if (version < 7) {
                        if (tagName.toLowerCase() === name.toLowerCase()) {
                            mc = tag;
                            setTarget = true;
                            break;
                        }
                    } else {
                        if (tagName === name) {
                            mc = tag;
                            setTarget = true;
                            break;
                        }
                    }
                }
            }

            if (!setTarget) {
                return undefined;
            }
        }
        return mc;
    };

    /**
     * @param ctx
     * @param matrix
     * @param colorTransform
     * @param stage
     * @param visible
     */
    DisplayObject.prototype.preRender = function (ctx, matrix, colorTransform, stage, visible)
    {
        var _this = this;
        _this.isLoad = true;

        var cacheKey = "";
        var preCtx = ctx;
        var preMatrix = matrix;

        var isFilter = false;
        var isBlend = false;
        var cache, rMatrix, xScale, yScale, xMin, yMin, xMax, yMax;

        // mask
        var maskObj = _this.getMask();
        if (maskObj) {
            _this.renderMask(ctx, stage);
        }

        // filter
        if (visible && !stage.clipMc) {
            var filters = _this.getFilters();
            if (filters !== null && filters.length) {
                isFilter = true;
            }

            // blend
            var blendMode = _this.getBlendMode();
            if (blendMode !== null && blendMode !== "normal") {
                isBlend = true;
            }
        }

        // filter or blend
        if (isFilter || isBlend) {
            rMatrix = _this.multiplicationMatrix(stage.getMatrix(), matrix);

            var bounds;
            var twips = 1;
            if (_this instanceof Shape || _this instanceof StaticText) {
                bounds = _this.getBounds();
                xScale = _sqrt(rMatrix[0] * rMatrix[0] + rMatrix[1] * rMatrix[1]);
                yScale = _sqrt(rMatrix[2] * rMatrix[2] + rMatrix[3] * rMatrix[3]);
            } else {
                twips = 20;
                bounds = _this.getBounds(matrix);
                xScale = stage.getScale() * _devicePixelRatio;
                yScale = stage.getScale() * _devicePixelRatio;
            }

            xMin = bounds.xMin;
            yMin = bounds.yMin;
            xMax = bounds.xMax;
            yMax = bounds.yMax;

            var width = _abs(_ceil((xMax - xMin) * xScale));
            var height = _abs(_ceil((yMax - yMin) * yScale));

            var canvas = cacheStore.getCanvas();
            canvas.width = width;
            canvas.height = height;
            cache = canvas.getContext("2d");
            cache._offsetX = 0;
            cache._offsetY = 0;

            var m2 = [1, 0, 0, 1, -xMin * twips, -yMin * twips];
            var m3 = [matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]];
            if (_this instanceof Shape) {
                m3[4] = 0;
                m3[5] = 0;
            }
            preCtx = cache;
            preMatrix = _this.multiplicationMatrix(m2, m3);
        }

        // graphics
        if (visible) {
            cacheKey += _this.renderGraphics(preCtx, preMatrix, colorTransform, stage);
        }

        return {
            preCtx: preCtx,
            preMatrix: preMatrix,
            isFilter: isFilter,
            isBlend: isBlend,
            rMatrix: rMatrix,
            cacheKey: cacheKey,
            xMin: xMin * xScale,
            yMin: yMin * yScale
        };
    };

    /**
     * @param ctx
     * @param matrix
     * @param colorTransform
     * @param stage
     * @param obj
     */
    DisplayObject.prototype.postRender = function(ctx, matrix, colorTransform, stage, obj)
    {
        var _this = this;
        var cache = obj.preCtx;
        var isFilter = obj.isFilter;
        var cacheKey = obj.cacheKey;
        if (isFilter && cacheKey !== "") {
            cache = _this.renderFilter(cache, matrix, colorTransform, stage, cacheKey);
        }

        var xMin = obj.xMin;
        var yMin = obj.yMin;
        if (_this instanceof Shape) {
            xMin += obj.rMatrix[4];
            yMin += obj.rMatrix[5];
        }
        if (cache) {
            xMin -= cache._offsetX;
            yMin -= cache._offsetY;
        }

        _this.renderBlend(ctx, cache, xMin, yMin, isFilter);
    };


        /**
     * @param ctx
     * @param matrix
     * @param colorTransform
     * @param stage
     * @returns {string}
     */
    DisplayObject.prototype.renderGraphics = function (ctx, matrix, colorTransform, stage)
    {
        var graphics = this.graphics;
        var cacheKey = "";
        if (graphics && graphics.isDraw) {
            cacheKey = graphics.render(ctx, matrix, colorTransform, stage);
        }
        return cacheKey;
    };

    /**
     * @param ctx
     * @param stage
     */
    DisplayObject.prototype.renderMask = function (ctx, stage)
    {
        var _this = this;
        var maskObj = _this.getMask();
        if (maskObj) {
            ctx.save();
            ctx.beginPath();
            stage.clipMc = true;

            var mc = maskObj;
            var matrix = [1,0,0,1,0,0];
            var _multiplicationMatrix = _this.multiplicationMatrix;
            while (true) {
                var parent = mc.getParent();
                if (!parent.getParent()) {
                    break;
                }
                matrix = _multiplicationMatrix(parent.getMatrix(), matrix);
                mc = parent;
            }
            maskObj.render(ctx, matrix, [1,1,1,1,0,0,0,0], stage, true);
            ctx.clip();
            stage.clipMc = false;
        }
    };

    /**
     * @param filters
     * @returns {string}
     */
    DisplayObject.prototype.getFilterKey = function (filters)
    {
        var keys = [];
        var length = filters.length;
        for (var i = 0; i < length; i++) {
            var filter = filters[i];
            for (var prop in filter) {
                if (!filter.hasOwnProperty(prop)) {
                    continue;
                }
                keys[keys.length] = filter[prop];
            }
        }
        return keys.join("_");
    };

    /**
     * @param ctx
     * @param matrix
     * @param colorTransform
     * @param stage
     * @param cacheKey
     * @returns {*}
     */
    DisplayObject.prototype.renderFilter = function (ctx, matrix, colorTransform, stage, cacheKey)
    {
        var _this = this;
        var filters = _this.getFilters();
        if (stage.clipMc || !filters || !filters.length) {
            return ctx;
        }

        cacheKey += "_" + _this.getFilterKey(filters);
        var cacheStoreKey = "Filter_" + _this.instanceId;

        var cache;
        if (_this._filterCacheKey === cacheKey) {
            cache = cacheStore.getCache(cacheStoreKey);
        }

        if (!cache) {
            var fLength = filters.length;
            for (var i = 0; i < fLength; i++) {
                var filter = filters[i];
                cache = filter.render(ctx, matrix, colorTransform, stage);
            }
            _this._filterCacheKey = cacheKey;
            cacheStore.setCache(cacheStoreKey, cache);
        }

        cacheStore.destroy(ctx);

        return cache;
    };

    /**
     * @param ctx
     * @param cache
     * @param xMin
     * @param yMin
     * @param isFilter
     */
    DisplayObject.prototype.renderBlend = function (ctx, cache, xMin, yMin, isFilter)
    {
        var _this = this;
        var mode = _this.getBlendMode();
        var operation = "source-over";
        var canvas = cache.canvas;
        var width = canvas.width;
        var height = canvas.height;
        if (!width || !height) {
            return ;
        }

        cache.setTransform(1, 0, 0, 1, 0, 0);

        switch (mode) {
            case "multiply":
                operation = "multiply";
                break;
            case "screen":
                operation = "screen";
                break;
            case "lighten":
                operation = "lighten";
                break;
            case "darken":
                operation = "darken";
                break;
            case "difference":
                operation = "difference";
                break;
            case "add":
                operation = "lighter";
                break;
            case "subtract":
                cache.globalCompositeOperation = "difference";
                cache.fillStyle = "rgb(255,255,255)";
                cache.fillRect(0, 0, width, height);
                cache.globalCompositeOperation = "darken";
                cache.fillStyle = "rgb(255,255,255)";
                cache.fillRect(0, 0, width, height);
                operation = "color-burn";
                break;
            case "invert":
                cache.globalCompositeOperation = "difference";
                cache.fillStyle = "rgb(255,255,255)";
                cache.fillRect(0, 0, width, height);
                cache.globalCompositeOperation = "lighter";
                cache.fillStyle = "rgb(255,255,255)";
                cache.fillRect(0, 0, width, height);
                operation = "difference";
                break;
            case "alpha":
                operation = "source-over";
                break;
            case "erase":
                operation = "destination-out";
                break;
            case "overlay":
                operation = "overlay";
                break;
            case "hardlight":
                operation = "hard-light";
                break;
        }

        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = operation;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(canvas, xMin, yMin, canvas.width, canvas.height);
        ctx.globalCompositeOperation = "source-over";
        if (!isFilter) {
            cacheStore.destroy(cache);
        }
    };

    /**
     * @returns {*}
     */
    DisplayObject.prototype.getOriginMatrix = function ()
    {
        var _this = this;
        var controller = _this.getController();
        return controller.getMatrix();
    };

    /**
     * @returns []
     */
    DisplayObject.prototype.getMatrix = function ()
    {
        return this._matrix || this.getOriginMatrix();
    };

    /**
     * @param matrix
     */
    DisplayObject.prototype.setMatrix = function (matrix)
    {
        var _this = this;
        _this._matrix = matrix;
        _this.setController(true, false, false, false);
    };

    /**
     * @returns {*}
     */
    DisplayObject.prototype.getOriginColorTransform = function ()
    {
        var _this = this;
        var controller = _this.getController();
        return controller.getColorTransform();
    };

    /**
     * @returns []
     */
    DisplayObject.prototype.getColorTransform = function ()
    {
        return this._colorTransform || this.getOriginColorTransform();
    };

    /**
     * @param colorTransform
     */
    DisplayObject.prototype.setColorTransform = function (colorTransform)
    {
        var _this = this;
        _this._colorTransform = colorTransform;
        _this.setController(false, true, false, false);
    };

    /**
     * @returns {string}
     */
    DisplayObject.prototype.getOriginBlendMode = function ()
    {
        var _this = this;
        var controller = _this.getController();
        return controller.getBlendMode();
    };

    /**
     * @returns {string}
     */
    DisplayObject.prototype.getBlendMode = function ()
    {
        return this._blendMode || this.getOriginBlendMode();
    };

    /**
     * @param blendMode
     */
    DisplayObject.prototype.setBlendMode = function (blendMode)
    {
        var _this = this;
        var mode = _this.getBlendName(blendMode);
        if (mode !== null) {
            _this._blendMode = mode;
            _this.setController(false, false, false, true);
        }
    };

    /**
     * @returns {Array}
     */
    DisplayObject.prototype.getOriginFilters = function ()
    {
        var _this = this;
        var controller = _this.getController();
        return controller.getFilters();
    };

    /**
     * @returns {Array}
     */
    DisplayObject.prototype.getFilters = function ()
    {
        return this._filters || this.getOriginFilters();
    };

    /**
     * @param filters
     */
    DisplayObject.prototype.setFilters = function (filters)
    {
        var _this = this;
        _this._filterCacheKey = null;
        _this._filters = filters;
        _this.setController(false, false, true, false);
    };

    /**
     * @param isMatrix
     * @param isColorTransform
     * @param isFilters
     * @param isBlend
     */
    DisplayObject.prototype.setController = function (isMatrix, isColorTransform, isFilters, isBlend)
    {
        var _this = this;

        if (!isMatrix) {
            var _matrix = _this._matrix;
            if (_matrix === null) {
                _matrix = _this.getMatrix();
                _this._matrix = _this.cloneArray(_matrix);
            }
        }

        if (!isColorTransform) {
            var _colorTransform = _this._colorTransform;
            if (_colorTransform === null) {
                _colorTransform = _this.getColorTransform();
                _this._colorTransform = _this.cloneArray(_colorTransform);
            }
        }

        if (!isFilters) {
            var _filters = _this._filters;
            if (_filters === null) {
                _filters = _this.getFilters();
                if (_filters === null) {
                    _filters = [];
                }
                _this._filters = _filters;
            }
        }

        if (!isBlend) {
            var _blendMode = _this._blendMode;
            if (_blendMode === null) {
                _blendMode = _this.getBlendMode();
                _this._blendMode = _blendMode;
            }
        }
    };

    /**
     * @returns {PlaceObject}
     */
    DisplayObject.prototype.getController = function ()
    {
        var _this = this;
        var frame = 0;
        var depth = _this.getLevel();
        var stage = _this.getParentStage();
        if (!stage) {
            return new PlaceObject();
        }

        var parent = _this.getParentSprite();
        if (!parent) {
            parent = _this.getParent();
        }
        if (!parent) {
            return new PlaceObject();
        }

        if (parent instanceof MovieClip) {
            frame = parent.getCurrentFrame();
        }
        var placeObject = stage.getPlaceObject(parent.instanceId, depth, frame);
        if (!placeObject) {
            stage = _this.getLoadStage();
            if (stage) {
                placeObject = stage.getPlaceObject(parent.instanceId, depth, frame);
            }
        }

        return placeObject || new PlaceObject();
    };

    /**
     * reset
     */
    DisplayObject.prototype.reset = function ()
    {
        var _this = this;
        _this.active = false;
        _this.isMask = false;
        _this._matrix = null;
        _this._colorTransform = null;
        _this._filters = null;
        _this._blendMode = null;
        _this._depth = null;
        _this.setVisible(true);
        _this.setEnabled(true);
        _this.setButtonStatus("up");

        if (_this instanceof TextField) {
            var input = _this.input;
            if (_this.inputActive) {
                _this.inputActive = false;
                input.onchange = null;
                var stage = _this.getStage();
                var div = _document.getElementById(stage.getName());
                if (div) {
                    var el = _document.getElementById(_this.getTagName());
                    if (el) {
                        try {
                            div.removeChild(el);
                        } catch (e) {

                        }
                    }
                }
            }
            _this.variables.text = _this.initialText;
        }
    };

    /**
     * trace
     */
    DisplayObject.prototype.trace = function ()
    {
        var params = ["[trace]"];
        var length = arguments.length;
        for (var i = 0; i < length; i++) {
            params[params.length] = arguments[i];
        }
        console.log.apply(window, params);
    };

    /**
     * @constructor
     */
    var InteractiveObject = function ()
    {
        var _this = this;
        _this._mouseEnabled = true;
        DisplayObject.call(_this);
    };

    /**
     * extends
     * @type {DisplayObject}
     */
    InteractiveObject.prototype = Object.create(DisplayObject.prototype);
    InteractiveObject.prototype.constructor = InteractiveObject;

    /**
     * properties
     */
    Object.defineProperties(DisplayObject.prototype,
    {
        mouseEnabled: {
            get: function () {
                return this.getMouseEnabled();
            },
            set: function (mouseEnabled) {
                this.setMouseEnabled(mouseEnabled);
            }
        }
    });

    /**
     * @returns {boolean}
     */
    InteractiveObject.prototype.getMouseEnabled = function ()
    {
        return this._mouseEnabled;
    };

    /**
     * @param mouseEnabled
     */
    InteractiveObject.prototype.setMouseEnabled = function (mouseEnabled)
    {
        this._mouseEnabled = mouseEnabled;
    };

    /**
     * @constructor
     */
    var TextSnapshot = function ()
    {
        this.charCount = 0;
    };

    /**
     * @param beginIndex
     * @param textToFind
     * @param caseSensitive
     */
    TextSnapshot.prototype.findText = function (beginIndex, textToFind, caseSensitive)
    {

    };

    /**
     * @param beginIndex
     * @param endIndex
     */
    TextSnapshot.prototype.getSelected = function (beginIndex, endIndex)
    {

    };

    /**
     * @param includeLineEndings
     */
    TextSnapshot.prototype.getSelectedText = function (includeLineEndings)
    {

    };

    TextSnapshot.prototype.getText = function (beginIndex, endIndex, includeLineEndings)
    {

    };

    /**
     * @param beginIndex
     * @param endIndex
     */
    TextSnapshot.prototype.getTextRunInfo = function (beginIndex, endIndex)
    {

    };

    /**
     * @param x
     * @param y
     * @param maxDistance
     */
    TextSnapshot.prototype.hitTestTextNearPos = function (x, y, maxDistance)
    {

    };

    /**
     * @param hexColor
     */
    TextSnapshot.prototype.setSelectColor = function (hexColor)
    {

    };

    /**
     * @param beginIndex
     * @param endIndex
     * @param select
     */
    TextSnapshot.prototype.setSelected = function (beginIndex, endIndex, select)
    {

    };

    /**
     * @constructor
     */
    var DisplayObjectContainer = function ()
    {
        var _this = this;
        InteractiveObject.call(_this);

        _this._mouseChildren = true;
        _this._tabChildren = true;
        _this._textSnapshot = new TextSnapshot();
        _this._numChildren = 0;
        _this.soundId = null;
        _this.soundInfo = null;
        _this.container = [];
        if (_this instanceof MovieClip) {
            var totalFrames = _this.getTotalFrames() + 1;
            var frame = 1;
            while (frame < totalFrames) {
                _this.container[frame++] = [];
            }
        }
        _this.instances = [];
        _this.isSwap = false;
    };

    /**
     * extends
     * @type {InteractiveObject}
     */
    DisplayObjectContainer.prototype = Object.create(InteractiveObject.prototype);
    DisplayObjectContainer.prototype.constructor = DisplayObjectContainer;

    /**
     * properties
     */
    Object.defineProperties(DisplayObjectContainer.prototype,
    {
        mouseChildren: {
            get: function () {
                return this.getMouseChildren();
            },
            set: function (mouseChildren) {
                this.setMouseChildren(mouseChildren);
            }
        },
        textSnapshot: {
            get: function () {
                return this.getTextSnapshot();
            },
            set: function () {
            }
        },
        numChildren: {
            get: function () {
                return this.getNumChildren();
            },
            set: function () {
            }
        },
        tabChildren: {
            get: function () {
                return this.getTabChildren();
            },
            set: function (tabChildren) {
                this.setTabChildren(tabChildren);
            }
        }
    });

    /**
     * @returns {boolean}
     */
    DisplayObjectContainer.prototype.getMouseChildren = function ()
    {
        return this._mouseChildren;
    };

    /**
     * @param mouseChildren
     */
    DisplayObjectContainer.prototype.setMouseChildren = function (mouseChildren)
    {
        this._mouseChildren = mouseChildren;
    };

    /**
     * @returns {TextSnapshot}
     */
    DisplayObjectContainer.prototype.getTextSnapshot = function ()
    {
        return this._textSnapshot;
    };

    /**
     * @returns {number}
     */
    DisplayObjectContainer.prototype.getNumChildren = function ()
    {
        return this._numChildren;
    };

    /**
     * @returns {boolean}
     */
    DisplayObjectContainer.prototype.getTabChildren = function ()
    {
        return this._tabChildren;
    };

    /**
     * @param tabChildren
     */
    DisplayObjectContainer.prototype.setTabChildren = function (tabChildren)
    {
        this._tabChildren = tabChildren;
    };

    /**
     * @returns {Array}
     */
    DisplayObjectContainer.prototype.getContainer = function ()
    {
        return this.container;
    };

    /**
     * @returns {Array}
     */
    DisplayObjectContainer.prototype.getInstances = function ()
    {
        return this.instances;
    };

    /**
     * @param instance
     */
    DisplayObjectContainer.prototype.setInstance = function (instance)
    {
        var instances = this.instances;
        var instanceId = instance.instanceId;
        if (!(instanceId in instances)) {
            instances[instanceId] = 1;
        }
    };

    /**
     * @param instance
     */
    DisplayObjectContainer.prototype.deleteInstance = function (instance)
    {
        delete this.instances[instance.instanceId];
    };

    /**
     * @param child
     * @param depth
     * @returns {DisplayObject}
     */
    DisplayObjectContainer.prototype.addChild = function (child, depth)
    {
        if (child instanceof DisplayObject) {
            var _this = this;

            if (depth === undefined) {
                depth = _this._numChildren;
            }

            var stage = _this.getStage();
            child.setParent(_this);
            child.setStage(stage);
            child.setLevel(depth);

            var container = _this.getContainer();
            var frame = 1;
            var placeObject = new PlaceObject();
            var instanceId = _this.instanceId;
            if (_this instanceof MovieClip) {
                var totalFrames = _this.getTotalFrames() + 1;
                for (; frame < totalFrames; frame++) {
                    if (!(frame in container)) {
                        container[frame] = [];
                    }
                    stage.setPlaceObject(placeObject, instanceId, depth, frame);
                    container[frame][depth] = child.instanceId;
                }
            } else {
                stage.setPlaceObject(placeObject, instanceId, depth, frame);
                container[depth] = child.instanceId;
            }

            _this._numChildren++;
        }
        return child;
    };

    /**
     * @param child
     * @param depth
     * @returns {DisplayObject}
     */
    DisplayObjectContainer.prototype.addChildAt = function (child, depth)
    {
        return this.addChild(child, depth);
    };

    /**
     *
     * @param depth
     * @returns {DisplayObject}
     */
    DisplayObjectContainer.prototype.getChildAt = function (depth)
    {
        var _this = this;
        var container = _this.getContainer();
        var children = container;

        if (16384 > depth) {
            depth += 16384;
        }

        if (_this instanceof MovieClip) {
            var frame = _this.getCurrentFrame();
            children = container[frame];
        }
        return children[depth];
    };

    /**
     * @param name
     * @return {DisplayObject}
     */
    DisplayObjectContainer.prototype.getChildByName = function (name)
    {
        var _this = this;
        var container = _this.getContainer();
        var children = container;
        if (_this instanceof MovieClip) {
            var frame = _this.getCurrentFrame();
            children = container[frame];
        }

        var obj;
        for (var depth in children) {
            if (!children.hasOwnProperty(depth)) {
                continue;
            }

            var child = children[depth];
            if (child.getName() !== name) {
                continue;
            }
            obj = child;
            break;
        }
        return obj;
    };

    /**
     * @param child
     * @returns {number}
     */
    DisplayObjectContainer.prototype.getChildIndex = function (child)
    {
        var index;
        if (child instanceof DisplayObject) {
            index = child.getLevel() - 16384;
        }
        return index;
    };

    /**
     * @param child
     * @return {DisplayObject}
     */
    DisplayObjectContainer.prototype.removeChild = function (child)
    {
        var _this = this;
        var container = _this.getContainer();
        var depth, obj;
        if (_this instanceof MovieClip) {
            var totalFrames = _this.getTotalFrames() + 1;
            for (var frame = 1; frame < totalFrames; frame++) {
                if (!(frame in container)) {
                    continue;
                }
                var children = container[frame];
                for (depth in children) {
                    if (!children.hasOwnProperty(depth)) {
                        continue;
                    }
                    var instanceId = children[depth];
                    if (instanceId !== child.instanceId) {
                        continue;
                    }
                    delete container[frame][depth];
                    break;
                }
            }
        } else {
            for (depth in container) {
                if (!container.hasOwnProperty(depth)) {
                    continue;
                }
                obj = container[depth];
                if (obj.instanceId !== child.instanceId) {
                    continue;
                }
                delete container[depth];
                break;
            }
        }

        if (child) {
            _this.deleteInstance(child);
            _this._numChildren--;
        }

        return child;
    };

    /**
     * @param depth
     * @returns {*}
     */
    DisplayObjectContainer.prototype.removeChildAt = function (depth)
    {
        var _this = this;
        var container = _this.getContainer();
        var children = container;

        if (16384 > depth) {
            depth += 16384;
        }

        var child;
        if (_this instanceof MovieClip) {
            var totalFrames = _this.getTotalFrames();
            for (var frame = 1; frame < totalFrames; frame++) {
                if (!(frame in container)) {
                    continue;
                }

                children = container[frame];
                if (!(depth in children)) {
                    continue;
                }

                child = children[depth];
                delete container[frame][depth];
            }
        } else {
            child = children[depth];
            delete children[depth];
        }

        if (child) {
            _this._numChildren--;
        }

        return child;
    };

    /**
     * @param depth
     * @param obj
     */
    DisplayObjectContainer.prototype.addTag = function (depth, obj)
    {
        var _this = this;
        _this.container[depth] = obj.instanceId;
        _this._numChildren++;
    };

    /**
     * startSound
     */
    DisplayObjectContainer.prototype.startSound = function ()
    {
        var _this = this;
        var soundId = _this.soundId;
        if (soundId) {
            var stage = _this.getStage();
            var sound = stage.sounds[soundId];
            if (sound) {
                var audio = _document.createElement("audio");
                audio.onload = function ()
                {
                    this.load();
                    this.preload = "auto";
                    this.autoplay = false;
                    this.loop = false;
                };
                audio.src = sound.base64;
                startSound(audio, _this.soundInfo);
            }
        }
    };

    /**
     * reset
     */
    DisplayObjectContainer.prototype.reset = function ()
    {
        var _this = this;
        var container = _this.container;
        var length = container.length;
        if (length) {
            var stage = _this.getStage();
            for (var depth in container) {
                if (!container.hasOwnProperty(depth)) {
                    continue;
                }

                var instanceId = container[depth];
                var obj = stage.getInstance(instanceId);
                obj.reset();
            }
        }

        _this.isMask = false;
        _this._depth = null;
        _this._matrix = null;
        _this._colorTransform = null;
        _this._filters = null;
        _this._blendMode = null;
        _this.mouseEnabled = true;
    };

    /**
     * @param matrix
     * @param stage
     * @param visible
     * @param mask
     */
    DisplayObjectContainer.prototype.setHitRange = function (matrix, stage, visible, mask)
    {
        var _this = this;
        var isVisible = _min(_this.getVisible(), visible);
        if (_this.getEnabled() && isVisible) {
            var buttonHits = stage.buttonHits;
            var variables = _this.variables;
            var events = _this.events;
            if (events.press !== undefined ||
                events.release !== undefined ||
                events.releaseOutside !== undefined ||
                events.rollOver !== undefined ||
                events.rollOut !== undefined ||
                events.dragOver !== undefined ||
                events.dragOut !== undefined ||
                variables.onPress !== undefined ||
                variables.onRelease !== undefined ||
                variables.onRollOver !== undefined ||
                variables.onReleaseOutside !== undefined ||
                variables.onRollOut !== undefined ||
                variables.onDragOver !== undefined ||
                variables.onDragOut !== undefined
            ) {
                var rMatrix = _this.multiplicationMatrix(matrix, _this.getMatrix());
                var bounds = _this.getBounds(rMatrix);
                buttonHits[buttonHits.length] = {
                    xMax: bounds.xMax,
                    xMin: bounds.xMin,
                    yMax: bounds.yMax,
                    yMin: bounds.yMin,
                    parent: _this,
                    matrix: _this.cloneArray(matrix)
                };
            }
        }
    };

    /**
     *
     * @param name
     * @param depth
     * @returns {MovieClip}
     */
    DisplayObjectContainer.prototype.createMovieClip = function (name, depth)
    {
        var movieClip = new MovieClip();
        movieClip = this.addChild(movieClip, depth);
        if (name) {
            movieClip.setName(name);
        }
        return movieClip;
    };

    /**
     * @param name
     * @param depth
     * @returns {Sprite}
     */
    DisplayObjectContainer.prototype.createSprite = function (name, depth)
    {
        var sprite = new Sprite();
        sprite = this.addChild(sprite, depth);
        if (name) {
            sprite.setName(name);
        }
        return sprite;
    };

    /**
     * @param name
     * @param depth
     * @returns {SimpleButton}
     */
    DisplayObjectContainer.prototype.createButton = function (name, depth)
    {
        var button = new SimpleButton();
        button = this.addChild(button, depth);
        if (name) {
            button.setName(name);
        }
        return button;
    };

    /**
     * @param name
     * @param width
     * @param height
     * @param depth
     * @returns {TextField}
     */
    DisplayObjectContainer.prototype.createText = function (name, width, height, depth)
    {
        var textField = new TextField(name, depth, width, height);
        textField = this.addChild(textField, depth);
        textField.setInitParams();
        if (name) {
            textField.setName(name);
        }
        textField.size = 12;
        return textField;
    };

    /**
     * @returns {Shape}
     */
    DisplayObjectContainer.prototype.createShape = function (depth)
    {
        var shape = new Shape();
        this.addChild(shape, depth);
        return shape;
    };

    /**
     * @constructor
     */
    var Sprite = function ()
    {
        var _this = this;
        DisplayObjectContainer.call(_this);

        _this.touchPointID = 0;
        _this._buttonMode = false;
        _this._useHandCursor = false;
        _this._dropTarget = null;
        _this._hitArea = null;
        _this._graphics = new Graphics();
        _this._soundTransform = new SoundTransform();
    };

    /**
     * extends
     * @type {DisplayObjectContainer}
     */
    Sprite.prototype = Object.create(DisplayObjectContainer.prototype);
    Sprite.prototype.constructor = Sprite;

    /**
     * properties
     */
    Object.defineProperties(Sprite.prototype,
    {
        graphics: {
            get: function () {
                return this.getGraphics();
            },
            set: function () {
            }
        },
        hitArea: {
            get: function () {
                return this.getHitArea();
            },
            set: function (sprite) {
                this.setHitArea(sprite);
            }
        },
        buttonMode: {
            get: function () {
                return this.getButtonMode();
            },
            set: function (buttonMode) {
                this.setButtonMode(buttonMode);
            }
        },
        soundTransform: {
            get: function () {
                return this._soundTransform;
            },
            set: function () {
            }
        },
        useHandCursor: {
            get: function () {
                return this.getUseHandCursor();
            },
            set: function (useHandCursor) {
                this.setUseHandCursor(useHandCursor);
            }
        },
        dropTarget: {
            get: function () {
                return this.getDropTarget();
            },
            set: function () {
                this.setDropTarget();
            }
        }
    });

    /**
     * @returns {Graphics}
     */
    Sprite.prototype.getGraphics = function ()
    {
        return this._graphics;
    };

    /**
     * @returns {DisplayObject}
     */
    Sprite.prototype.getHitArea = function ()
    {
        return this._hitArea;
    };

    /**
     * @param displayObject
     */
    Sprite.prototype.setHitArea = function (displayObject)
    {
        this._hitArea = displayObject;
    };

    /**
     * @returns {boolean}
     */
    Sprite.prototype.getUseHandCursor = function ()
    {
        return this._useHandCursor;
    };

    /**
     * @param useHandCursor
     */
    Sprite.prototype.setUseHandCursor = function (useHandCursor)
    {
        this._useHandCursor = useHandCursor;
    };

    /**
     * startTouchDrag
     */
    Sprite.prototype.startTouchDrag = function (touchPointID, lock, bounds)
    {
        this.startDrag(lock);
    };

    /**
     * @param touchPointID
     */
    Sprite.prototype.stopTouchDrag = function (touchPointID)
    {
        this.stopDrag();
    };

    /**
     * startDrag
     */
    Sprite.prototype.startDrag = function ()
    {
        var args = arguments;
        var lock = args[0];
        var left = args[1];
        var top = args[2];
        var right = args[3];
        var bottom = args[4];

        var _this = this;
        var _root = _this.getDisplayObject("_root");
        var stage = _root.getStage();
        var startX = 0;
        var startY = 0;
        if (!lock) {
            startX = _this.getXMouse();
            startY = _this.getYMouse();
        }

        stage.dragMc = _this;
        stage.dragRules = {
            startX: startX,
            startY: startY,
            left: left,
            top: top,
            right: right,
            bottom: bottom
        };

        _this.setDropTarget();
    };

    /**
     * stopDrag
     */
    Sprite.prototype.stopDrag = function ()
    {
        var _this = this;
        var _root = _this.getDisplayObject("_root");
        var stage = _root.getStage();
        stage.dragMc = null;
        stage.dragRules = null;
        _this.setDropTarget();
    };

    /**
     * executeDrag
     */
    Sprite.prototype.executeDrag = function ()
    {
        var _this = this;
        var _root = _this.getDisplayObject("_root");
        var stage = _root.getStage();
        var dragRules = stage.dragRules;
        var startX = dragRules.startX;
        var startY = dragRules.startY;
        var left = dragRules.left;
        var top = dragRules.top;
        var right = dragRules.right;
        var bottom = dragRules.bottom;
        var x = _this.getX();
        var y = _this.getY();
        var xmouse = _this.getXMouse();
        var ymouse = _this.getYMouse();

        xmouse -= startX;
        ymouse -= startY;

        var moveX = x + xmouse;
        var moveY = y + ymouse;

        if (left === null || left === undefined) {
            _this.setX(moveX);
            _this.setY(moveY);
        } else {
            left = +left;
            top = +top;
            right = +right;
            bottom = +bottom;

            // x
            if (right < moveX) {
                _this.setX(right);
            } else if (moveX < left) {
                _this.setX(left);
            } else {
                _this.setX(moveX);
            }

            // y
            if (bottom < moveY) {
                _this.setY(bottom);
            } else if (moveY < top) {
                _this.setY(top);
            } else {
                _this.setY(moveY);
            }
        }
    };

    /**
     *
     * @returns {null|*}
     */
    Sprite.prototype.getDropTarget = function ()
    {
        return this._droptarget;
    };

    /**
     * setDropTarget
     */
    Sprite.prototype.setDropTarget = function ()
    {
        var _this = this;
        _this._droptarget = null;
        var _root = _this.getDisplayObject("_root");
        var stage = _root.getStage();
        var parent = _this.getParent();
        if (!parent) {
            parent = stage.getParent();
        }

        var x = _root.getXMouse();
        var y = _root.getYMouse();

        var tags = parent.getTags();
        for (var depth in tags) {
            if (!tags.hasOwnProperty(depth)) {
                continue;
            }

            var id = tags[depth];
            if (id === _this.instanceId) {
                continue;
            }

            var instance = stage.getInstance(id);
            if (!(instance instanceof MovieClip)) {
                continue;
            }

            var hit = instance.hitTest(x, y);
            if (hit) {
                _this._droptarget = instance;
                break;
            }
        }
    };

    /**
     * @returns {Array}
     */
    Sprite.prototype.getTags = function ()
    {
        return this.getContainer();
    };

    /**
     * @param ctx
     * @param matrix
     * @param colorTransform
     * @param stage
     * @param visible
     */
    Sprite.prototype.render = function (ctx, matrix, colorTransform, stage, visible)
    {
        var _this = this;
        if (_this.removeFlag) {
            return "";
        }

        _this.isLoad = true;
        stage.doneTags.unshift(_this);

        // sound
        if (_this instanceof MovieClip && !_this.soundStopFlag) {
            var sounds = _this.getSounds();
            if (sounds !== undefined) {
                var sLen = sounds.length;
                for (var idx = 0; idx < sLen; idx++) {
                    if (!(idx in sounds)) {
                        continue;
                    }
                    var sound = sounds[idx];
                    _this.startSound(sound);
                }
            }
        }

        // matrix & colorTransform
        var _multiplicationMatrix = _this.multiplicationMatrix;
        var rMatrix = _multiplicationMatrix(matrix, _this.getMatrix());
        var _multiplicationColor = _this.multiplicationColor;
        var rColorTransform = _multiplicationColor(colorTransform, _this.getColorTransform());
        var isVisible = _min(_this.getVisible(), visible);

        // pre render
        var obj = _this.preRender(ctx, rMatrix, rColorTransform, stage, visible);
        var cacheKey = obj.cacheKey;
        var preCtx = obj.preCtx;
        var preMatrix = obj.preMatrix;

        // render
        var clips = [];
        var container = _this.getTags();
        var length = container.length;
        var maskObj = _this.getMask();

        if (length) {
            var myStage = _this.getStage();
            for (var depth in container) {
                if (!container.hasOwnProperty(depth)) {
                    continue;
                }

                var instanceId = container[depth];
                var instance = myStage.getInstance(instanceId);
                if (!instance) {
                    continue;
                }

                // mask end
                var cLen = clips.length;
                for (var cIdx = 0; cIdx < cLen; cIdx++) {
                    var cDepth = clips[cIdx];
                    if (depth > cDepth) {
                        clips.splice(cIdx, 1);
                        ctx.restore();
                        break;
                    }
                }

                // mask start
                if (instance.isClipDepth) {
                    ctx.save();
                    ctx.beginPath();
                    clips[clips.length] = instance.clipDepth;
                    if (instance instanceof MovieClip) {
                        stage.isClipDepth = true;
                    }
                }

                if (isVisible) {
                    switch (true) {
                        case instance instanceof TextField:
                        case instance instanceof DisplayObjectContainer:
                            instance.setHitRange(rMatrix, stage, visible, cLen);
                            break;
                        case instance instanceof SimpleButton:
                            if (!instance.clipDepth) {
                                instance.setHitRange(rMatrix, stage, visible, cLen);
                            }
                            break;
                        default:
                            break;
                    }
                }

                // mask
                if (instance.isMask) {
                    continue;
                }

                if (instance.isClipDepth) {
                    if (preMatrix[0] === 0) {
                        preMatrix[0] = 0.00000000000001;
                    }
                    if (preMatrix[3] === 0) {
                        preMatrix[3] = 0.00000000000001;
                    }
                }

                cacheKey += instance.render(preCtx, preMatrix, rColorTransform, stage, isVisible);
                if (stage.isClipDepth) {
                    preCtx.clip();
                    stage.isClipDepth = false;
                }
            }
        }

        if (clips.length || maskObj) {
            ctx.restore();
        }

        // post render
        if (obj.isFilter || obj.isBlend) {
            obj.cacheKey = cacheKey;
            _this.postRender(ctx, rMatrix, rColorTransform, stage, obj);
        }

        return cacheKey;
    };

    /**
     * initFrame
     */
    Sprite.prototype.initFrame = function () {};

    /**
     * @param stage
     * @param clipEvent
     */
    Sprite.prototype.putFrame = function (stage, clipEvent)
    {
        var _this = this;
        _this.active = true;
        _this.dispatchEvent(clipEvent, stage);
    };

    /**
     * @param stage
     */
    Sprite.prototype.addActions = function (stage)
    {
        var _this = this;
        var myStage = _this.getStage();
        var tags = _this.getTags();
        var length = tags.length;
        if (length) {
            for (var depth in tags) {
                if (!tags.hasOwnProperty(depth)) {
                    continue;
                }
                var instanceId = tags[depth];
                var instance = myStage.getInstance(instanceId);
                if (!instance) {
                    continue;
                }
                instance.addActions(stage);
            }
        }
    };

    /**
     * @param ctx
     * @param matrix
     * @param stage
     * @param x
     * @param y
     * @returns {boolean}
     */
    Sprite.prototype.renderHitTest = function (ctx, matrix, stage, x, y)
    {
        var _this = this;
        var loadStage = _this.getStage();
        var tags = _this.getTags();
        var length = tags.length;
        var hit = false;
        var rMatrix = _this.multiplicationMatrix(matrix, _this.getMatrix());

        if (length) {
            for (var depth in tags) {
                if (!tags.hasOwnProperty(depth)) {
                    continue;
                }

                var instanceId = tags[depth];
                var obj = loadStage.getInstance(instanceId);
                hit = obj.renderHitTest(ctx, rMatrix, stage, x, y);
                if (hit) {
                    return hit;
                }
            }
        }

        var graphics = _this.graphics;
        if (graphics.isDraw) {
            return graphics.renderHitTest(ctx, rMatrix, stage, x, y);
        }

        return hit;
    };

    /**
     * @param mc
     * @returns {{xMin: *, xMax: number, yMin: *, yMax: number}}
     */
    Sprite.prototype.getRect = function (mc)
    {
        var _this = this;
        if (!mc) {
            mc = _this;
        }
        var bounds = mc.getBounds(mc.getOriginMatrix());
        var graphics = _this.graphics;
        var twips = 20;
        var maxWidth = graphics.maxWidth / twips;
        var halfWidth = maxWidth / 2;
        var xMin = bounds.xMin + halfWidth;
        var xMax = bounds.xMax - halfWidth;
        var yMin = bounds.yMin + halfWidth;
        var yMax = bounds.yMax - halfWidth;
        return {xMin: xMin, xMax: xMax, yMin: yMin, yMax: yMax};
    };

    /**
     * @param matrix
     * @returns {{}}
     */
    Sprite.prototype.getBounds = function (matrix)
    {
        if (matrix instanceof MovieClip) {
            return matrix.getBounds(matrix.getOriginMatrix());
        }

        var _this = this;
        var tags = _this.getTags();
        var xMax = 0;
        var yMax = 0;
        var xMin = 0;
        var yMin = 0;
        var graphics = _this.graphics;
        var isDraw = graphics.isDraw;
        if (isDraw) {
            var maxWidth = graphics.maxWidth;
            var halfWidth = maxWidth / 2;
            var gBounds = _this.boundsMatrix(graphics.bounds, matrix);
            var twips = (matrix) ? 20 : 1;
            xMin = (gBounds.xMin - halfWidth) / twips;
            xMax = (gBounds.xMax + halfWidth) / twips;
            yMin = (gBounds.yMin - halfWidth) / twips;
            yMax = (gBounds.yMax + halfWidth) / twips;
        }

        var length = tags.length;
        var stage = _this.getStage();
        if (length) {
            if (!isDraw) {
                var no = _Number.MAX_VALUE;
                xMax = -no;
                yMax = -no;
                xMin = no;
                yMin = no;
            }

            var _multiplicationMatrix = _this.multiplicationMatrix;
            for (var depth in tags) {
                if (!tags.hasOwnProperty(depth)) {
                    continue;
                }
                var instanceId = tags[depth];
                var tag = stage.getInstance(instanceId);
                if (!tag || tag.isClipDepth) {
                    continue;
                }

                var matrix2 = (matrix) ? _multiplicationMatrix(matrix, tag.getMatrix()) : tag.getMatrix();
                var bounds = tag.getBounds(matrix2);
                if (!bounds) {
                    continue;
                }

                xMin = _min(xMin, bounds.xMin);
                xMax = _max(xMax, bounds.xMax);
                yMin = _min(yMin, bounds.yMin);
                yMax = _max(yMax, bounds.yMax);
            }
        }

        return {xMin: xMin, xMax: xMax, yMin: yMin, yMax: yMax};
    };

    /**
     * @param ctx
     * @param matrix
     * @param stage
     * @param x
     * @param y
     * @returns {*}
     */
    Sprite.prototype.hitCheck = function (ctx, matrix, stage, x, y)
    {
        var _this = this;
        if (!_this.getEnabled() ||
            !_this.getVisible() ||
            !_this.getMouseEnabled()
        ) {
            return false;
        }

        var hitObj;
        var hit = false;
        var tags = _this.getTags();
        var length = tags.length;
        var matrix2 = _this.multiplicationMatrix(matrix, _this.getMatrix());
        if (length) {
            var loadStage = _this.getStage();
            tags.reverse();
            for (var depth in tags) {
                if (!tags.hasOwnProperty(depth)) {
                    continue;
                }

                var tagId = tags[depth];
                var instance = loadStage.getInstance(tagId);
                if (instance instanceof Shape ||
                    instance instanceof StaticText ||
                    instance instanceof TextField
                ) {
                    hit = instance.renderHitTest(ctx, matrix2, stage, x, y);
                } else {
                    hit = instance.hitCheck(ctx, matrix2, stage, x, y);
                }

                if (hit) {
                    hitObj = hit;
                    if (typeof hit !== "object") {
                        var events = _this.events;
                        if (events.press !== undefined ||
                            events.release !== undefined ||
                            events.releaseOutside !== undefined ||
                            events.rollOver !== undefined ||
                            events.rollOut !== undefined ||
                            events.dragOver !== undefined ||
                            events.dragOut !== undefined
                        ) {
                            stage.isHit = hit;
                            hitObj = {parent : _this};
                        }
                    }

                    tags.reverse();
                    return hitObj;
                }
            }
            tags.reverse();
        }

        var graphics = _this.graphics;
        if (graphics.isDraw) {
            hit = graphics.renderHitTest(ctx, matrix2, stage, x, y);
            if (hit) {
                hitObj = {parent : _this};
            }
        }

        return hitObj;
    };

    /**
     * @constructor
     */
    var Shape = function ()
    {
        var _this = this;
        DisplayObject.call(_this);

        _this.data = null;
        _this._graphics = new Graphics();

        var no = _Number.MAX_VALUE;
        _this.setBounds({xMin: no, xMax: -no, yMin: no, yMax: -no});
    };

    /**
     * extends
     * @type {DisplayObject}
     */
    Shape.prototype = Object.create(DisplayObject.prototype);
    Shape.prototype.constructor = Shape;

    /**
     * properties
     */
    Object.defineProperties(Shape.prototype,
    {
        graphics: {
            get: function () {
                return this.getGraphics();
            },
            set: function () {
            }
        }
    });

    /**
     * dummy
     */
    Shape.prototype.addActions = function () {};
    Shape.prototype.initFrame = function () {};

    /**
     * @param stage
     * @param clipEvent
     */
    Shape.prototype.putFrame = function (stage, clipEvent)
    {
        var _this = this;
        _this.active = true;
        _this.dispatchEvent(clipEvent, stage);
    };

    /**
     * @returns {Graphics}
     */
    Shape.prototype.getGraphics = function ()
    {
        return this._graphics;
    };

    /**
     * @returns []
     */
    Shape.prototype.getData = function ()
    {
        return this.data;
    };

    /**
     * @param data
     */
    Shape.prototype.setData = function (data)
    {
        this.data = data;
    };

    /**
     * @returns {{}}
     */
    Shape.prototype.getBounds = function (matrix)
    {
        var _this = this;
        var bounds, gBounds;
        var graphics = _this.graphics;
        var isDraw = graphics.isDraw;

        if (matrix) {
            bounds = _this.boundsMatrix(_this.bounds, matrix);
            if (isDraw) {
                gBounds = _this.boundsMatrix(graphics.getBounds(), matrix);
                bounds.xMin = _min(gBounds.xMin, bounds.xMin);
                bounds.xMax = _max(gBounds.xMax, bounds.xMax);
                bounds.yMin = _min(gBounds.yMin, bounds.yMin);
                bounds.yMax = _max(gBounds.yMax, bounds.yMax);
            }

            for (var name in bounds) {
                if (!bounds.hasOwnProperty(name)) {
                    continue;
                }
                bounds[name] /= 20;
            }
            return bounds;
        } else {
            bounds = _this.bounds;
            if (isDraw) {
                gBounds = graphics.getBounds();
                bounds.xMin = _min(gBounds.xMin, bounds.xMin);
                bounds.xMax = _max(gBounds.xMax, bounds.xMax);
                bounds.yMin = _min(gBounds.yMin, bounds.yMin);
                bounds.yMax = _max(gBounds.yMax, bounds.yMax);
            }
            return this.bounds;
        }
    };

    /**
     * @param bounds
     */
    Shape.prototype.setBounds = function (bounds)
    {
        this.bounds = bounds;
    };

    /**
     * @returns {boolean}
     */
    Shape.prototype.isMorphing = function ()
    {
        var tagType = this.getTagType();
        return (tagType === 46 || tagType === 84);
    };

    /**
     * @param ctx
     * @param matrix
     * @param colorTransform
     * @param stage
     * @param visible
     * @returns {*}
     */
    Shape.prototype.render = function (ctx, matrix, colorTransform, stage, visible)
    {
        var _this = this;
        stage.doneTags.unshift(_this);

        // colorTransform
        var _multiplicationColor = _this.multiplicationColor;
        var rColorTransform = _multiplicationColor(colorTransform, _this.getColorTransform());
        var isVisible = _min(_this.getVisible(), visible);
        var alpha = rColorTransform[3] + (rColorTransform[7] / 255);
        var stageClip = stage.clipMc || stage.isClipDepth;
        if (!stageClip && (!alpha || !isVisible)) {
            return "";
        }

        // matrix
        var _multiplicationMatrix = _this.multiplicationMatrix;
        var m2 = _multiplicationMatrix(matrix, _this.getMatrix());

        // pre render
        var obj = _this.preRender(ctx, m2, rColorTransform, stage, isVisible);
        var cacheKey = obj.cacheKey;
        var cache = null;

        // render
        var m3 = _multiplicationMatrix(stage.getMatrix(), obj.preMatrix);
        var isClipDepth = _this.isClipDepth || stageClip;
        if (isClipDepth) {
            if (m3[0]===0) {
                m3[0] = 0.00000000000001;
            }
            if (m3[3]===0) {
                m3[3] = 0.00000000000001;
            }
            ctx.setTransform(m3[0],m3[1],m3[2],m3[3],m3[4],m3[5]);
            _this.executeRender(ctx, _min(m3[0], m3[3]), rColorTransform, isClipDepth, stage);
        } else {
            var xScale = _sqrt(m3[0] * m3[0] + m3[1] * m3[1]);
            var yScale = _sqrt(m3[2] * m3[2] + m3[3] * m3[3]);
            xScale = _pow(_SQRT2, _ceil(_log(xScale) / _LN2_2 - _LOG1P));
            yScale = _pow(_SQRT2, _ceil(_log(yScale) / _LN2_2 - _LOG1P));

            var bounds = _this.getBounds();
            var xMax = bounds.xMax;
            var xMin = bounds.xMin;
            var yMax = bounds.yMax;
            var yMin = bounds.yMin;

            var W = _abs(_ceil((xMax - xMin) * xScale));
            var H = _abs(_ceil((yMax - yMin) * yScale));
            if (W <= 0 || H <= 0) {
                return cacheKey;
            }

            var canvas;
            var loadStage = _this.getStage();
            var cacheId = _this.getCharacterId() + "_" + loadStage.getId();
            if (_this.isMorphing()) {
                cacheId += "_" + _this.getRatio();
            }

            cacheKey = cacheStore.generateKey("Shape", cacheId, [xScale, yScale], rColorTransform);
            cache = cacheStore.getCache(cacheKey);
            if (!cache &&
                stage.getWidth() > W &&
                stage.getHeight() > H &&
                cacheStore.size > (W * H)
            ) {
                canvas = cacheStore.getCanvas();
                canvas.width = W;
                canvas.height = H;
                cache = canvas.getContext("2d");
                var cMatrix = [xScale, 0, 0, yScale, -xMin * xScale, -yMin * yScale];
                cache.setTransform(cMatrix[0],cMatrix[1],cMatrix[2],cMatrix[3],cMatrix[4],cMatrix[5]);
                cache = _this.executeRender(
                    cache, _min(xScale, yScale), rColorTransform, isClipDepth, stage
                );
                cacheStore.setCache(cacheKey, cache);
            }

            var preCtx = obj.preCtx;
            if (cache) {
                canvas = cache.canvas;
                var sMatrix = [1 / xScale, 0, 0, 1 / yScale, xMin, yMin];
                var m4 = _multiplicationMatrix(m3, sMatrix);
                preCtx.setTransform(m4[0],m4[1],m4[2],m4[3],m4[4],m4[5]);
                if (isAndroid4x && !isChrome) {
                    preCtx.fillStyle = stage.context.createPattern(cache.canvas, "no-repeat");
                    preCtx.fillRect(0, 0, W, H);
                } else {
                    preCtx.drawImage(canvas, 0, 0, W, H);
                }
            } else {
                preCtx.setTransform(m3[0],m3[1],m3[2],m3[3],m3[4],m3[5]);
                _this.executeRender(preCtx, _min(m3[0], m3[3]), rColorTransform, isClipDepth, stage);
            }
        }

        // post render
        cacheKey += "_" + m3[4] + "_" + m3[5];
        if (obj.isFilter || obj.isBlend) {
            obj.cacheKey = cacheKey;
            _this.postRender(ctx, matrix, rColorTransform, stage, obj);
        }

        return cacheKey;
    };

    /**
     * @param ctx
     * @param matrix
     * @param stage
     * @param x
     * @param y
     * @returns {boolean}
     */
    Shape.prototype.renderHitTest = function (ctx, matrix, stage, x, y)
    {
        var _this = this;
        var _multiplicationMatrix = _this.multiplicationMatrix;
        var m2 = _multiplicationMatrix(matrix, _this.getMatrix());

        var graphics = _this.graphics;
        if (graphics.isDraw) {
            return graphics.renderHitTest(ctx, m2, stage, x, y);
        }

        if (!_this.getData()) {
            return false;
        }

        var m3 = _multiplicationMatrix(stage.getMatrix(), m2);
        ctx.setTransform(m3[0],m3[1],m3[2],m3[3],m3[4],m3[5]);

        var minScale = _min(m3[0], m3[3]);
        var shapes = _this.getData();
        var length = shapes.length;
        var hit = false;
        for (var idx = 0; idx < length; idx++) {
            var data = shapes[idx];
            var obj = data.obj;
            var isStroke = (obj.Width !== undefined);

            ctx.beginPath();
            var cmd = data.cmd;
            cmd(ctx);

            if (isStroke) {
                ctx.lineWidth = _max(obj.Width, 1 / minScale);
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
            }

            hit = ctx.isPointInPath(x, y);
            if (hit) {
                return hit;
            }

            if ("isPointInStroke" in ctx) {
                hit = ctx.isPointInStroke(x, y);
                if (hit) {
                    return hit;
                }
            }
        }

        return hit;
    };

    /**
     * @param ctx
     * @param minScale
     * @param colorTransform
     * @param isClipDepth
     * @param stage
     * @returns {*}
     */
    Shape.prototype.executeRender = function (ctx, minScale, colorTransform, isClipDepth, stage)
    {
        var _this = this;
        var shapes = _this.getData();
        if (!shapes) {
            return ctx;
        }

        var stageClip = stage.clipMc || stage.isClipDepth;
        var length = shapes.length;
        var color;
        var css;
        var canvas;
        for (var idx = 0; idx < length; idx++) {
            var data = shapes[idx];
            var obj = data.obj;
            var styleObj = (!obj.HasFillFlag) ? obj : obj.FillType;
            var cmd = data.cmd;
            var isStroke = (obj.Width !== undefined);

            if (isClipDepth) {
                if (isStroke) {
                    continue;
                }
                cmd(ctx);
                continue;
            }

            ctx.beginPath();
            cmd(ctx);

            var styleType = styleObj.fillStyleType;
            switch (styleType) {
                case 0x00:
                    color = styleObj.Color;
                    color = _this.generateColorTransform(color, colorTransform);
                    css = "rgba(" + color.R + "," + color.G + "," + color.B + "," + color.A + ")";
                    if (isStroke) {
                        ctx.strokeStyle = css;
                        ctx.lineWidth = _max(obj.Width, 1 / minScale);
                        ctx.lineCap = "round";
                        ctx.lineJoin = "round";
                        ctx.stroke();
                    } else {
                        ctx.fillStyle = css;
                        ctx.fill();
                    }

                    break;

                // gradient
                case 0x10:
                case 0x12:
                case 0x13:
                    var m = styleObj.gradientMatrix;
                    var type = styleObj.fillStyleType;
                    if (type !== 16) {
                        ctx.save();
                        ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
                        css = ctx.createRadialGradient(0, 0, 0, 0, 0, 16384);
                    } else {
                        var xy = _this.linearGradientXY(m);
                        css = ctx.createLinearGradient(xy[0], xy[1], xy[2], xy[3]);
                    }

                    var records = styleObj.gradient.GradientRecords;
                    var rLength = records.length;
                    for (var rIdx = 0; rIdx < rLength; rIdx++) {
                        var record = records[rIdx];
                        color = record.Color;
                        color = _this.generateColorTransform(color, colorTransform);
                        var rgba = "rgba(" + color.R + "," + color.G + "," + color.B + "," + color.A + ")";
                        css.addColorStop(record.Ratio, rgba);
                    }

                    if (isStroke) {
                        ctx.strokeStyle = css;
                        ctx.lineWidth = _max(obj.Width, 1 / minScale);
                        ctx.lineCap = "round";
                        ctx.lineJoin = "round";
                        ctx.stroke();
                    } else {
                        ctx.fillStyle = css;
                        ctx.fill();
                    }

                    if (type !== 16) {
                        ctx.restore();
                    }

                    break;

                // bitmap
                case 0x40:
                case 0x41:
                case 0x42:
                case 0x43:
                    var width;
                    var height;
                    var loadStage = _this.getStage();
                    var bitmapId = styleObj.bitmapId;
                    var bMatrix = styleObj.bitmapMatrix;
                    var repeat = (styleType === 0x40 || styleType === 0x42) ? "repeat" : "no-repeat";
                    var bitmapCacheKey = cacheStore.generateKey(
                        "Bitmap",
                        bitmapId + "_" + loadStage.getId() + "_" + repeat,
                        undefined,
                        colorTransform
                    );

                    var image = cacheStore.getCache(bitmapCacheKey);
                    if (image === undefined) {
                        image = loadStage.getCharacter(bitmapId);
                        if (!image) {
                            break;
                        }

                        if (colorTransform[0] !== 1 ||
                            colorTransform[1] !== 1 ||
                            colorTransform[2] !== 1 ||
                            colorTransform[4] ||
                            colorTransform[5] ||
                            colorTransform[6]
                        ) {
                            var imgCanvas = image.canvas;
                            width = imgCanvas.width;
                            height = imgCanvas.height;
                            if (width > 0 && height > 0) {
                                canvas = cacheStore.getCanvas();
                                canvas.width = width;
                                canvas.height = height;
                                var imageContext = canvas.getContext("2d");
                                imageContext.drawImage(image.canvas, 0, 0, width, height);
                                image = _this.generateImageTransform.call(_this, imageContext, colorTransform);
                                cacheStore.setCache(bitmapCacheKey, image);
                            }
                        } else {
                            ctx.globalAlpha = _max(0, _min((255 * colorTransform[3]) + colorTransform[7], 255)) / 255;
                        }
                    }

                    if (image) {
                        ctx.save();
                        canvas = image.canvas;
                        width = canvas.width;
                        height = canvas.height;
                        if (width > 0 && height > 0) {
                            if (styleType === 0x41 || styleType === 0x43) {
                                ctx.clip();
                                ctx.transform(bMatrix[0], bMatrix[1], bMatrix[2], bMatrix[3], bMatrix[4], bMatrix[5]);
                                ctx.drawImage(canvas, 0, 0, width, height);
                            } else {
                                ctx.fillStyle = stage.context.createPattern(canvas, repeat);
                                ctx.transform(bMatrix[0], bMatrix[1], bMatrix[2], bMatrix[3], bMatrix[4], bMatrix[5]);
                                ctx.fill();
                            }
                        }
                        ctx.restore();
                    }

                    break;
            }
        }

        if (isClipDepth && !stageClip) {
            ctx.clip();

            if (isAndroid && isChrome) {
                if (!canvas) {
                    canvas = ctx.canvas;
                }

                var cWidth = canvas.width;
                var cHeight = canvas.height;

                var tmpCanvas = tmpContext.canvas;
                canvas = ctx.canvas;
                tmpCanvas.width = cWidth;
                tmpCanvas.height = cHeight;
                tmpContext.drawImage(canvas, 0, 0);

                ctx.save();
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.beginPath();
                ctx.clearRect(0, 0, cWidth + 1, cHeight + 1);
                ctx.drawImage(tmpCanvas, 0, 0);
                ctx.restore();

                tmpContext.setTransform(1,0,0,1,0,0);
                tmpContext.clearRect(0, 0, cWidth + 1, cHeight + 1);
            }
        }

        var resetCss = "rgba(0,0,0,1)";
        ctx.strokeStyle = resetCss;
        ctx.fillStyle = resetCss;
        ctx.globalAlpha = 1;

        return ctx;
    };

    /**
     * @param ctx
     * @param color
     * @returns {*}
     */
    Shape.prototype.generateImageTransform = function (ctx, color)
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
        if (length > 0) {
            while (length--) {
                var R = pxData[idx++];
                var G = pxData[idx++];
                var B = pxData[idx++];
                var A = pxData[idx++];
                pxData[idx - 4] = _max(0, _min((R * RedMultiTerm) + RedAddTerm, 255))|0;
                pxData[idx - 3] = _max(0, _min((G * GreenMultiTerm) + GreenAddTerm, 255))|0;
                pxData[idx - 2] = _max(0, _min((B * BlueMultiTerm) + BlueAddTerm, 255))|0;
                pxData[idx - 1] = _max(0, _min((A * AlphaMultiTerm) + AlphaAddTerm, 255));
            }
        }
        ctx.putImageData(imgData, 0, 0);
        return ctx;
    };

    /**
     * @param m
     * @returns {*[]}
     */
    Shape.prototype.linearGradientXY = function (m)
    {
        var x0 = -16384 * m[0] - 16384 * m[2] + m[4];
        var x1 =  16384 * m[0] - 16384 * m[2] + m[4];
        var x2 = -16384 * m[0] + 16384 * m[2] + m[4];
        var y0 = -16384 * m[1] - 16384 * m[3] + m[5];
        var y1 =  16384 * m[1] - 16384 * m[3] + m[5];
        var y2 = -16384 * m[1] + 16384 * m[3] + m[5];
        var vx2 = x2 - x0;
        var vy2 = y2 - y0;
        var r1 = _sqrt(vx2 * vx2 + vy2 * vy2);
        vx2 /= r1;
        vy2 /= r1;
        var r2 = (x1 - x0) * vx2 + (y1 - y0) * vy2;
        return [x0 + r2 * vx2, y0 + r2 * vy2, x1, y1];
    };

    /**
     * @constructor
     */
    var TextRecord = function ()
    {
        var _this = this;
        _this.color = null;
        _this.matrix = null;
    };

    /**
     * @returns {*}
     */
    TextRecord.prototype.getColor = function ()
    {
        return this.color;
    };

    /**
     * @param color
     */
    TextRecord.prototype.setColor = function (color)
    {
        this.color = color;
    };

    /**
     * @returns {*}
     */
    TextRecord.prototype.getMatrix = function ()
    {
        return this.matrix;
    };

    /**
     * @param matrix
     */
    TextRecord.prototype.setMatrix = function (matrix)
    {
        this.matrix = matrix;
    };

    /**
     * @returns {Array}
     */
    TextRecord.prototype.getData = function ()
    {
        return this.data;
    };

    /**
     * @param data
     */
    TextRecord.prototype.setData = function (data)
    {
        this.data = data;
    };

    /**
     * @constructor
     */
    var StaticText = function ()
    {
        var _this = this;
        DisplayObject.call(_this);

        _this.data = null;
        _this.records = [];
    };

    /**
     * extends
     * @type {DisplayObject}
     */
    StaticText.prototype = Object.create(DisplayObject.prototype);
    StaticText.prototype.constructor = StaticText;

    /**
     * dummy
     */
    StaticText.prototype.initFrame = function () {};
    StaticText.prototype.addActions = function () {};

    /**
     * @returns {{}}
     */
    StaticText.prototype.getBounds = function (matrix)
    {
        var _this = this;
        if (matrix) {
            var bounds = _this.boundsMatrix(_this.bounds, matrix);
            for (var name in bounds) {
                if (!bounds.hasOwnProperty(name)) {
                    continue;
                }
                bounds[name] /= 20;
            }
            return bounds;
        } else {
            return _this.bounds;
        }
    };

    /**
     * @param bounds
     */
    StaticText.prototype.setBounds = function (bounds)
    {
        this.bounds = bounds;
    };

    /**
     * @returns {Array|*}
     */
    StaticText.prototype.getRecords = function ()
    {
        return this.records;
    };

    /**
     * @param record
     */
    StaticText.prototype.addRecord = function (record)
    {
        var records = this.getRecords();
        records[records.length] = record;
    };

    /**
     * @param ctx
     * @param matrix
     * @param colorTransform
     * @param stage
     * @param visible
     * @return {*}
     */
    StaticText.prototype.render = function (ctx, matrix, colorTransform, stage, visible)
    {
        var _this = this;

        // colorTransform
        var _multiplicationColor = _this.multiplicationColor;
        var rColorTransform = _multiplicationColor(colorTransform, _this.getColorTransform());
        var isVisible = _min(_this.getVisible(), visible);
        var alpha = rColorTransform[3] + (rColorTransform[7] / 255);
        var stageClip = stage.clipMc || stage.isClipDepth;
        if (!stageClip && (!alpha || !isVisible)) {
            return 0;
        }

        // matrix
        var _multiplicationMatrix = _this.multiplicationMatrix;
        var m2 = _multiplicationMatrix(matrix, _this.getMatrix());

        // pre render
        var obj = _this.preRender(ctx, m2, rColorTransform, stage, visible);
        var m3 = _multiplicationMatrix(stage.getMatrix(), obj.preMatrix);
        var xScale = _sqrt(m3[0] * m3[0] + m3[1] * m3[1]);
        var yScale = _sqrt(m3[2] * m3[2] + m3[3] * m3[3]);
        xScale = _pow(_SQRT2, _ceil(_log(xScale) / _LN2_2 - _LOG1P));
        yScale = _pow(_SQRT2, _ceil(_log(yScale) / _LN2_2 - _LOG1P));

        // render
        var bounds = _this.getBounds();
        var xMax = bounds.xMax;
        var xMin = bounds.xMin;
        var yMax = bounds.yMax;
        var yMin = bounds.yMin;
        var W = _abs(_ceil((xMax - xMin) * xScale));
        var H = _abs(_ceil((yMax - yMin) * yScale));
        var isClipDepth = _this.isClipDepth || stageClip;
        if (W > 0 && H > 0) {
            var cacheId = _this.getCharacterId() + "_" + _this.getStage().getId();
            var cacheKey = cacheStore.generateKey("Text", cacheId, [xScale, yScale], rColorTransform);
            var cache = cacheStore.getCache(cacheKey);
            var canvas;
            if (!cache && !isClipDepth) {
                if (stage.getWidth() > W && stage.getHeight() > H && cacheStore.size > W * H) {
                    canvas = cacheStore.getCanvas();
                    canvas.width = W;
                    canvas.height = H;
                    cache = canvas.getContext("2d");
                    var cMatrix = [xScale, 0, 0, yScale, -xMin * xScale, -yMin * yScale];
                    cache.setTransform(cMatrix[0],cMatrix[1],cMatrix[2],cMatrix[3],cMatrix[4],cMatrix[5]);
                    cache = _this.executeRender(cache, cMatrix, rColorTransform, false, false);
                    cacheStore.setCache(cacheKey, cache);
                }
            }
            if (cache) {
                canvas = cache.canvas;
                var m4 = _multiplicationMatrix(m3, [1 / xScale, 0, 0, 1 / yScale, xMin, yMin]);
                ctx.setTransform(m4[0],m4[1],m4[2],m4[3],m4[4],m4[5]);
                if (isAndroid4x && !isChrome) {
                    ctx.fillStyle = stage.context.createPattern(cache.canvas, "no-repeat");
                    ctx.fillRect(0, 0, W, H);
                } else {
                    ctx.drawImage(canvas, 0, 0, W, H);
                }
            } else {
                ctx.setTransform(m3[0],m3[1],m3[2],m3[3],m3[4],m3[5]);
                _this.executeRender(ctx, m3, rColorTransform, isClipDepth, stageClip);
            }

            cacheKey += "_" + m3[4] + "_" + m3[5];
            if (obj.isFilter || obj.isBlend) {
                obj.cacheKey = cacheKey;
                _this.postRender(ctx, matrix, rColorTransform, stage, obj);
            }

            return cacheKey;
        }

        return null;
    };

    /**
     * @param ctx
     * @param matrix
     * @param colorTransform
     * @param isClipDepth
     * @param stageClip
     * @returns {*}
     */
    StaticText.prototype.executeRender = function (ctx, matrix, colorTransform, isClipDepth, stageClip)
    {
        var _this = this;
        var records = _this.getRecords();
        var length = records.length;
        if (!length) {
            return ctx;
        }

        var _multiplicationMatrix = _this.multiplicationMatrix;
        var _generateColorTransform = _this.generateColorTransform;
        for (var i = 0; i < length; i++) {
            var record = records[i];
            var shapes = record.getData();
            var shapeLength = shapes.length;
            if (!shapeLength) {
                continue;
            }

            var m2 = _multiplicationMatrix(matrix, record.getMatrix());
            ctx.setTransform(m2[0],m2[1],m2[2],m2[3],m2[4],m2[5]);
            var color = record.getColor();
            color = _generateColorTransform(color, colorTransform);
            ctx.fillStyle = "rgba(" + color.R + "," + color.G + "," + color.B + "," + color.A + ")";
            for (var idx = 0; idx < shapeLength; idx++) {
                var styleObj = shapes[idx];
                var cmd = styleObj.cmd;
                if (!isClipDepth) {
                    ctx.beginPath();
                    cmd(ctx);
                    ctx.fill();
                } else {
                    cmd(ctx);
                }
            }
        }

        if (isClipDepth && !stageClip) {
            ctx.clip();
        }

        ctx.globalAlpha = 1;
        return ctx;
    };

    /**
     * @param ctx
     * @param matrix
     * @param stage
     * @param x
     * @param y
     * @returns {boolean}
     */
    StaticText.prototype.renderHitTest = function (ctx, matrix, stage, x, y)
    {
        var _this = this;
        var records = _this.getRecords();
        var length = records.length;
        if (!length) {
            return false;
        }

        var hit = false;
        var _multiplicationMatrix = _this.multiplicationMatrix;
        var m2 = _multiplicationMatrix(matrix, _this.getMatrix());
        var m3 = _multiplicationMatrix(stage.getMatrix(), m2);
        for (var i = 0; i < length; i++) {
            var record = records[i];
            var shapes = record.getData();
            var shapeLength = shapes.length;
            if (!shapeLength) {
                continue;
            }

            var m4 = _multiplicationMatrix(m3, record.getMatrix());
            ctx.setTransform(m4[0],m4[1],m4[2],m4[3],m4[4],m4[5]);
            for (var idx = 0; idx < shapeLength; idx++) {
                var styleObj = shapes[idx];
                var cmd = styleObj.cmd;
                ctx.beginPath();
                cmd(ctx);

                hit = ctx.isPointInPath(x, y);
                if (hit) {
                    return hit;
                }
            }
        }

        return hit;
    };

    /**
     * @constructor
     */
    var TextFormat = function ()
    {
        var _this = this;
        _this.align = "left";
        _this.font = "'HiraKakuProN-W3', 'sans-serif'";
        _this.size = 8;
        _this.color = {R: 0, G: 0, B: 0, A: 1};
        _this.bold = 0;
        _this.italic = 0;
        _this.underline = 0;
        _this.bullet = 0;
        _this.kerning = 0;
        _this.blockIndent = 0;
        _this.indent = 0;
        _this.leading = 80;
        _this.leftMargin = 0;
        _this.rightMargin = 0;
        _this.letterSpacing = 0;
        _this.tabStops = [];
        _this.url = null;
        _this.target = null;
    };

    /**
     * @param name
     * @param depth
     * @param width
     * @param height
     * @constructor
     */
    var TextField = function (name, depth, width, height)
    {
        var _this = this;
        InteractiveObject.call(_this);

        if (name) {
            _this.setName(name);
        }

        if (depth) {
            _this.setLevel(depth);
        }

        if (!width) {
            width = 0;
        }
        width *= 20;

        if (!height) {
            height = 0;
        }
        height *= 20;

        _this.fontId = 0;
        _this.bounds = {xMin: 0, xMax: width, yMin: 0, yMax: height};
        _this.input = null;
        _this.inputActive = false;
        _this.span = null;
    };

    /**
     * extends
     * @type {InteractiveObject}
     */
    TextField.prototype = Object.create(InteractiveObject.prototype);
    TextField.prototype.constructor = TextField;

    /**
     * properties
     */
    Object.defineProperties(TextField.prototype,
    {
        text: {
            get: function () {
                return this.variables.text;
            },
            set: function (text) {
                this.variables.text = text;
            }
        },
        htmlText: {
            get: function () {
                return this.variables.text;
            },
            set: function (text) {
                this.variables.text = text;
            }
        },
        size: {
            get: function () {
                return this.variables.size;
            },
            set: function (size) {
                this.variables.size = size;
            }
        },
        font: {
            get: function () {
                return this.variables.font;
            },
            set: function (font) {
                this.variables.font = font;
            }
        },
        type: {
            get: function () {
                return this.variables.type;
            },
            set: function (type) {
                this.variables.type = type;
                if (type === "input") {
                    this.setInputElement();
                }
            }
        },
        multiline: {
            get: function () {
                return this.variables.multiline;
            },
            set: function (multiline) {
                this.variables.multiline = multiline;
                if (multiline) {
                    this.wordWrap = multiline;
                }
                if (this.type === "input") {
                    this.setInputElement();
                }
            }
        },
        wordWrap: {
            get: function () {
                return this.variables.wordWrap;
            },
            set: function (wordWrap) {
                this.variables.wordWrap = wordWrap;
                if (this.type === "input") {
                    this.setInputElement();
                }
            }
        },
        border: {
            get: function () {
                return this.variables.border;
            },
            set: function (border) {
                this.variables.border = border;
            }
        },
        borderColor: {
            get: function () {
                return this.variables.borderColor;
            },
            set: function (color) {
                if (typeof color === "string") {
                    color = this.colorStringToInt(color);
                }
                color = this.intToRGBA(color);
                this.variables.borderColor = color;
            }
        },
        background: {
            get: function () {
                return this.variables.background;
            },
            set: function (background) {
                this.variables.background = background;
            }
        },
        backgroundColor: {
            get: function () {
                return this.variables.backgroundColor;
            },
            set: function (color) {
                if (typeof color === "string") {
                    color = this.colorStringToInt(color);
                }
                color = this.intToRGBA(color);
                this.variables.backgroundColor = color;
            }
        },
        textColor: {
            get: function () {
                return this.variables.textColor;
            },
            set: function (color) {
                if (typeof color === "string") {
                    color = this.colorStringToInt(color);
                }
                color = this.intToRGBA(color);
                this.variables.textColor = color;
            }
        },
        align: {
            get: function () {
                return this.variables.align;
            },
            set: function (align) {
                this.variables.align = align;
            }
        },
        autoSize: {
            get: function () {
                return this.variables.autoSize;
            },
            set: function (autoSize) {
                this.variables.autoSize = autoSize;
            }
        },
        onChanged: {
            get: function () {
                return this.variables.onChanged;
            },
            set: function (onChanged) {
                this.variables.onChanged = onChanged;
            }
        }
    });

    /**
     * @param int
     * @param alpha
     * @returns {{R: number, G: number, B: number, A: number}}
     */
    TextField.prototype.intToRGBA = function (int, alpha)
    {
        alpha = alpha || 100;
        return {
            R: (int & 0xff0000) >> 16,
            G: (int & 0x00ff00) >> 8,
            B: (int & 0x0000ff),
            A: (alpha / 100)
        };
    };

    /**
     * @param str
     * @returns {string}
     */
    TextField.prototype.colorStringToInt = function (str)
    {
        var canvas = cacheStore.getCanvas();
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = str;
        var color = "0x" + ctx.fillStyle.substr(1);
        cacheStore.destroy(ctx);
        return color;
    };

    /**
     * setInitParams
     */
    TextField.prototype.setInitParams = function ()
    {
        var _this = this;
        var obj = {};
        obj.antiAliasType = null;
        obj.autoSize = "none";
        obj.background = 0;
        obj.backgroundColor = {R: 255, G: 255, B: 255, A: 1};
        obj.border = 0;
        obj.borderColor = {R: 0, G: 0, B: 0, A: 1};
        obj.condenseWhite = 0;
        obj.html = 0;
        obj.password = 0;
        obj.embedFonts = 0;
        obj.gridFitType = "none";
        obj.maxChars = null;
        obj.mouseWheelEnabled = 0;
        obj.multiline = 0;
        obj.selectable = 0;
        obj.sharpness = 0;
        obj.textColor = 0;
        obj.thickness = 0;
        obj.type = "dynamic";
        obj.wordWrap = 0;
        obj.text = "";
        for (var key in obj) {
            if (!obj.hasOwnProperty(key)) {
                continue;
            }
            _this.setProperty(key, obj[key]);
        }
        _this.setTextFormat(new TextFormat());
    };

    /**
     * @returns {string}
     */
    TextField.prototype.getTagName = function ()
    {
        return "__swf2js_input_element_" + this.instanceId;
    };

    /**
     * @param format
     */
    TextField.prototype.setTextFormat = function (format)
    {
        var _this = this;
        for (var name in format) {
            if (!format.hasOwnProperty(name)) {
                continue;
            }
            _this.setProperty(name, format[name]);
        }
    };

    /**
     * @returns {*}
     */
    TextField.prototype.getBounds = function (matrix)
    {
        var _this = this;
        if (matrix) {
            var bounds = _this.boundsMatrix(_this.bounds, matrix);
            for (var name in bounds) {
                if (!bounds.hasOwnProperty(name)) {
                    continue;
                }
                bounds[name] /= 20;
            }
            return bounds;
        } else {
            return _this.bounds;
        }
    };

    /**
     * @param bounds
     */
    TextField.prototype.setBounds = function (bounds)
    {
        this.bounds = bounds;
    };

    /**
     * InputElemen
     */
    TextField.prototype.setInputElement = function ()
    {
        var _this = this;
        var variables = _this.variables;
        var _root = _this.getDisplayObject("_root");
        var stage = _root.getParentStage();
        var element = _document.createElement("textarea");
        var multiline = variables.multiline;
        var align = variables.align;
        var text = _this.initialText;
        if (!text) {
            text = variables.text;
        }

        element.onkeypress = null;
        if (!multiline) {
            element.onkeypress = function (e)
            {
                if (e.keyCode === 13) {
                    return false;
                }
            };
        }

        element.style.position = "absolute";
        element.style.webkitBorderRadius = "0px";
        element.style.padding = "1px";
        element.style.margin = "0px";
        element.style.webkitAppearance = "none";
        element.style.resize = "none";
        element.style.border = "none";
        element.style.overflow = "hidden";
        element.style.backgroundColor = "transparent";
        element.style.zIndex = 0x7fffffff;
        element.style.textAlign = align;

        element.value = text;
        if (typeof text !== "string") {
            var str = "";
            var length = text.length;
            for (var i = 0; i < length; i++) {
                var txt = text[i];
                str += txt.innerText;
                if ((i + 1) !== length) {
                    str += "\n";
                }
            }
            element.value = str;
        }

        element.id = _this.getTagName();
        var onBlur = function (stage, textField, el)
        {
            return function ()
            {
                textField.setProperty("text", el.value);
                textField.inputActive = false;
                var div = _document.getElementById(stage.getName());
                if (div) {
                    var element = _document.getElementById(textField.getTagName());
                    if (element) {
                        try {
                            div.removeChild(element);
                        } catch (e) {}
                    }
                }
            };
        };

        element.onblur = onBlur(stage, _this, element);
        _this.input = element;
    };

    /**
     * @param matrix
     * @param stage
     * @param visible
     * @param mask
     */
    TextField.prototype.setHitRange = function (matrix, stage, visible, mask)
    {
        var _this = this;
        var type = _this.variables.type;
        var isVisible = _min(_this.getVisible(), visible);
        if (type === "input" && isVisible) {
            var buttonHits = stage.buttonHits;
            var m2 = _this.multiplicationMatrix(matrix, _this.getMatrix());
            var bounds = _this.getBounds(m2);
            buttonHits[buttonHits.length] = {
                xMax: bounds.xMax,
                xMin: bounds.xMin,
                yMax: bounds.yMax,
                yMin: bounds.yMin,
                parent: _this
            };
        }
    };

    /**
     * @param ctx
     * @param matrix
     * @param colorTransform
     * @param stage
     * @param visible
     */
    TextField.prototype.render = function (ctx, matrix, colorTransform, stage, visible)
    {
        var _this = this;
        stage.doneTags.unshift(_this);

        // colorTransform
        var _multiplicationColor = _this.multiplicationColor;
        var rColorTransform = _multiplicationColor(colorTransform, _this.getColorTransform());
        var isVisible = _min(_this.getVisible(), visible);
        var stageClip = stage.clipMc || stage.isClipDepth;
        var alpha = rColorTransform[3] + (rColorTransform[7] / 255);
        if (!stageClip && (!alpha || !isVisible)) {
            return 0;
        }

        // matrix
        var _multiplicationMatrix = _this.multiplicationMatrix;
        var m2 = _multiplicationMatrix(matrix, _this.getMatrix());

        // pre render
        var obj = _this.preRender(ctx, m2, rColorTransform, stage, visible);
        var preCtx = obj.preCtx;
        var preMatrix = obj.preMatrix;
        var m3 = _multiplicationMatrix(stage.getMatrix(), preMatrix);
        preCtx.setTransform(m3[0],m3[1],m3[2],m3[3],m3[4],m3[5]);

        var textCacheKey = ["TextField"];
        var variables = _this.variables;
        var text = variables.text;
        var variable = variables.variable;
        if (variable) {
            var parent = _this.getParent();
            text = parent.getProperty(variable);
            if (text === undefined) {
                text = variables.text;
            }
        }

        if (typeof text === "number") {
            text += "";
        }

        var html = variables.html;
        if (html && typeof text === "string") {
            if (text.indexOf("<sbr />") !== -1) {
                text = text.replace(new RegExp("<sbr />", "gi"), "\n");
            }
            if (text.indexOf("<b>") !== -1) {
                text = text.replace(new RegExp("<b>", "gi"), "");
                text = text.replace(new RegExp("</b>", "gi"), "");
            }

            var span = _document.createElement("span");
            span.innerHTML = text;

            var tags = span.getElementsByTagName("p");
            var domLength = tags.length;
            if (domLength) {
                var tagData = [];
                for (var d = 0; d < domLength; d++) {
                    tagData[d] = tags[d];
                }
                text = tagData;
            } else {
                text = span.innerText;
            }
        }
        preCtx.textBaseline = "top";
        if (text === undefined) {
            text = "";
        }

        var bounds = _this.getBounds();
        var xMax = bounds.xMax;
        var xMin = bounds.xMin;
        var yMax = bounds.yMax;
        var yMin = bounds.yMin;
        var W = _abs(_ceil(xMax - xMin));
        var H = _abs(_ceil(yMax - yMin));

        // auto size
        var scale = stage.getScale();
        var autoSize = variables.autoSize;
        var wordWrap = variables.wordWrap;
        var splitData = (typeof text === "string") ? text.split("\n") : text;
        var length = splitData.length;
        var i, txtObj, measureText;
        var txtTotalWidth = 0;
        var txtTotalHeight = 0;
        var isAutoSize = false;
        var autoMode = (typeof autoSize === "string") ? autoSize.toLowerCase() : autoSize;
        switch (autoMode) {
            default:
            case "none":
            case false:
            case 0:
                txtTotalWidth = W;
                txtTotalHeight = H;
                break;
            case true:
            case 1:
            case "left":
            case "center":
            case "right":
                isAutoSize = true;
                break;
        }

        var fontData = _this.getStage().getCharacter(_this.fontId);
        if (isAutoSize) {
            if (variables.embedFonts) {
                var CodeTable = fontData.CodeTable;
                var FontAdvanceTable = fontData.FontAdvanceTable;
                var fontScale = _this.fontScale;
                txtTotalWidth = 0;
                txtTotalHeight = (fontData.FontAscent * fontScale) + variables.leading;
                for (i = 0; i < length; i++) {
                    txtObj = splitData[i];
                    if (typeof txtObj !== "string") {
                        var firstChild = txtObj.firstChild;
                        txtTotalWidth = _this.getDomWidth(firstChild, CodeTable, FontAdvanceTable);
                    } else {
                        var txtLength = txtObj.length;
                        for (var idx = 0; idx < txtLength; idx++) {
                            var index = CodeTable.indexOf(txtObj[idx].charCodeAt(0));
                            if (index === -1) {
                                continue;
                            }
                            txtTotalWidth += (FontAdvanceTable[index] * fontScale);
                        }
                    }
                }
            } else {
                var addH = (variables.size * 20) + variables.leading;
                txtTotalHeight = (bounds.yMin + 80);
                if (wordWrap) {
                    txtTotalWidth = W;
                    for (i = 0; i < length; i++) {
                        txtObj = splitData[i];
                        if (typeof txtObj === "string") {
                            measureText = preCtx.measureText(txtObj);
                            var checkW = _ceil(measureText.width * 20);
                            if (checkW > W) {
                                txtTotalHeight += _ceil(_ceil(checkW / W) * addH);
                            }
                        }
                    }
                } else {
                    for (i = 0; i < length; i++) {
                        txtObj = splitData[i];
                        if (typeof txtObj === "string") {
                            measureText = preCtx.measureText(txtObj);
                            txtTotalWidth = _max(txtTotalWidth, _ceil(measureText.width * 20));
                            txtTotalHeight += addH;
                        }
                    }
                }
                txtTotalWidth += 80;
            }
        }

        var offsetX = 40;
        switch (autoMode) {
            case "center":
                offsetX = _ceil((_max(txtTotalWidth, W) - _min(txtTotalWidth, W)) / 2);
                break;
            case "right":
                offsetX = _ceil(_max(txtTotalWidth, W) - _min(txtTotalWidth, W));
                break;
        }

        W = txtTotalWidth;
        H = txtTotalHeight;

        if (W > 0 && H > 0) {
            var isClipDepth = _this.isClipDepth || stageClip;
            var color;
            var rx = xMin;
            var ry = yMin;
            var m = _this._matrix;
            if (m) {
                rx = -xMin;
                ry = -yMin;
                var m4 = _multiplicationMatrix(preMatrix, [1, 0, 0, 1, xMin, yMin]);
                m3 = _multiplicationMatrix(stage.getMatrix(), m4);
                preCtx.setTransform(m3[0],m3[1],m3[2],m3[3],m3[4],m3[5]);
            }

            // border
            var border = variables.border;
            if (border && !isClipDepth) {
                preCtx.beginPath();
                preCtx.rect(rx - offsetX, ry, W, H);
                color = _this.generateColorTransform(variables.borderColor, rColorTransform);
                textCacheKey[textCacheKey.length] = color;
                preCtx.strokeStyle = "rgba(" + color.R + "," + color.G + "," + color.B + "," + color.A + ")";
                preCtx.lineWidth = _min(20, 1 / _min(m3[0], m3[3]));
                preCtx.globalAlpha = 1;
                preCtx.fillStyle = "rgba(0,0,0,0)";
                if (variables.background) {
                    color = _this.generateColorTransform(variables.backgroundColor, rColorTransform);
                    textCacheKey[textCacheKey.length] = color;
                    preCtx.fillStyle = "rgba(" + color.R + "," + color.G + "," + color.B + "," + color.A + ")";
                }
                preCtx.fill();
                preCtx.stroke();
            }

            var textColor = variables.textColor;
            var objRGBA = textColor;
            if (typeof  textColor === "number") {
                objRGBA = _this.intToRGBA(textColor, 100);
            }

            color = _this.generateColorTransform(objRGBA, rColorTransform);
            var fillStyle = "rgba(" + color.R + "," + color.G + "," + color.B + "," + color.A + ")";
            textCacheKey[textCacheKey.length] = fillStyle;
            preCtx.fillStyle = fillStyle;

            // font type
            var fontType = "";
            if (variables.italic) {
                fontType += "italic ";
            }
            if (variables.bold) {
                fontType += "bold ";
            }

            var fontStyle = fontType + variables.size + "px " + variables.font;
            textCacheKey[textCacheKey.length] = fontStyle;
            preCtx.font = fontStyle;

            if (_this.input !== null) {
                var input = _this.input;
                var fontSize = _ceil(variables.size * scale * _min(preMatrix[0], preMatrix[3]));
                input.style.font = fontType + fontSize + "px " + variables.font;
                input.style.color = "rgba(" + color.R + "," + color.G + "," + color.B + "," + color.A + ")";
                var as = variables.onChanged;
                if (as && !input.onchange) {
                    var onChanged = function (stage, origin, clip, el)
                    {
                        return function ()
                        {
                            if (clip.active) {
                                clip.setProperty("text", el.value);
                                origin.apply(clip, arguments);
                                stage.executeAction();
                            }
                        };
                    };
                    input.onchange = onChanged(stage, as, _this, input);
                }
            }

            if (text && !isClipDepth) {
                preCtx.save();
                preCtx.beginPath();
                preCtx.rect(rx - offsetX, ry, W, (H-40));
                preCtx.clip();

                if (_this.inputActive === false) {
                    if (variables.embedFonts) {
                        _this.renderOutLine(preCtx, fontData, splitData, m3, rx - offsetX, W, fillStyle);
                    } else {
                        _this.renderText(preCtx, splitData, m3, fontType, fillStyle);
                    }
                }

                preCtx.restore();
                preCtx.globalAlpha = 1;
            }

            textCacheKey[textCacheKey.length] = text;
            var cacheKey = cacheStore.generateKey(
                textCacheKey.join("_"), _this.getCharacterId(), m3, rColorTransform);
            obj.cacheKey = cacheKey;
            if (obj.isFilter || obj.isBlend) {
                _this.postRender(ctx, matrix, rColorTransform, stage, obj);
            }
            return cacheKey;
        }

        return null;
    };

    /**
     * @param ctx
     * @param fontData
     * @param splitData
     * @param matrix
     * @param offset
     * @param width
     * @param fillStyle
     */
    TextField.prototype.renderOutLine = function (ctx, fontData, splitData, matrix, offset, width, fillStyle)
    {
        var _this = this;
        var variables = _this.variables;
        var fontScale = _this.fontScale;
        var leading = (fontData.FontAscent + fontData.FontDescent) * fontScale;
        var rightMargin = variables.rightMargin * fontScale;
        var leftMargin = variables.leftMargin * fontScale;
        var indent = variables.indent * fontScale;
        var align = variables.align;
        var txt = "";
        var CodeTable = fontData.CodeTable;
        var GlyphShapeTable = fontData.GlyphShapeTable;
        var FontAdvanceTable = fontData.FontAdvanceTable;
        var YOffset = (fontData.FontAscent * fontScale);
        var cacheYOffset = YOffset;
        var wordWrap = variables.wordWrap;
        var multiline = variables.multiline;
        var bounds = _this.getBounds();
        var areaWidth = (_ceil((bounds.xMax) - (bounds.xMin)) - leftMargin - rightMargin);
        var idx;
        var index;
        var length = splitData.length;
        var _multiplicationMatrix = _this.multiplicationMatrix;
        for (var i = 0; i < length; i++) {
            var XOffset = offset;
            var textWidth = 0;
            var txtLength = 0;
            var obj = splitData[i];
            var firstChild;
            if (typeof obj !== "string") {
                firstChild = obj.firstChild;
                if (!firstChild) {
                    continue;
                }
                textWidth = _this.getDomWidth(firstChild, CodeTable, FontAdvanceTable);
                txt = obj.innerText;
                align = variables.align;
                if (obj.align) {
                    align = obj.align;
                }
            } else {
                txt = obj;
                txtLength = txt.length;
                for (idx = 0; idx < txtLength; idx++) {
                    index = CodeTable.indexOf(txt[idx].charCodeAt(0));
                    if (index === -1) {
                        continue;
                    }
                    textWidth += (FontAdvanceTable[index] * fontScale);
                }
            }

            if (align === "right") {
                XOffset += width - rightMargin - textWidth - 40;
            } else if (align === "center") {
                XOffset += indent + leftMargin + 40 + ((width - indent - leftMargin - rightMargin - textWidth) / 2);
            } else {
                XOffset += indent + leftMargin + 40;
            }

            var cacheXOffset = XOffset;
            var wordWidth = 0;
            if (typeof obj !== "string") {
                var gridData = {
                    XOffset: XOffset,
                    YOffset: YOffset,
                    cacheXOffset: cacheXOffset,
                    cacheYOffset: cacheYOffset,
                    wordWidth: wordWidth,
                    addXOffset: 0,
                    size: firstChild.size,
                    areaWidth: areaWidth,
                    matrix: matrix
                };

                _this.renderDomOutLine(
                    ctx, firstChild, gridData, fillStyle,
                    CodeTable, FontAdvanceTable, GlyphShapeTable
                );
            } else {
                for (idx = 0; idx < txtLength; idx++) {
                    index = CodeTable.indexOf(txt[idx].charCodeAt(0));
                    if (index === -1) {
                        continue;
                    }

                    var addXOffset = FontAdvanceTable[index] * fontScale;
                    if (wordWrap && multiline) {
                        if (wordWidth + addXOffset > areaWidth) {
                            XOffset = cacheXOffset;
                            YOffset += cacheYOffset;
                            wordWidth = 0;
                        }
                    }

                    var m2 = _multiplicationMatrix(matrix, [fontScale, 0, 0, fontScale, XOffset, YOffset]);
                    ctx.setTransform(m2[0],m2[1],m2[2],m2[3],m2[4],m2[5]);
                    _this.renderGlyph(GlyphShapeTable[index], ctx);
                    XOffset += addXOffset;
                    wordWidth += addXOffset;
                }
            }

            YOffset += leading;
        }
    };

    /**
     * @param ctx
     * @param child
     * @param gridData
     * @param fillStyle
     * @param CodeTable
     * @param FontAdvanceTable
     * @param GlyphShapeTable
     */
    TextField.prototype.renderDomOutLine = function (
        ctx, child, gridData, fillStyle,
        CodeTable, FontAdvanceTable, GlyphShapeTable
    ) {
        var _this = this;
        var variables = _this.variables;
        var wordWrap = variables.wordWrap;
        var multiline = variables.multiline;
        var _multiplicationMatrix = _this.multiplicationMatrix;
        var stage = _this.getStage();
        var fonts = stage.fonts;
        var face = child.face;
        var fontData = fonts[face];
        var codeTable = CodeTable;
        var faTable = FontAdvanceTable;
        var shapeTable = GlyphShapeTable;
        var color = fillStyle;
        if (fontData) {
            codeTable = fontData.CodeTable;
            faTable = fontData.FontAdvanceTable;
            shapeTable = fontData.GlyphShapeTable;
        }

        if (child.color) {
            color = child.color;
        }

        if (child.size) {
            gridData.size = child.size;
        }

        var childNodes = child.childNodes;
        var length = childNodes.length;
        for (var i = 0; i < length; i++) {
            var node = childNodes[i];
            if (node instanceof HTMLFontElement) {
                _this.renderDomOutLine(
                    ctx, node, gridData, color,
                    codeTable, faTable, shapeTable
                );
            } else {
                var size = gridData.size;
                var fontScale = size / 1024;
                var sTable;
                var values = node.nodeValue;
                if (!values) {
                    continue;
                }
                var vLength = values.length;
                for (var idx = 0; idx < vLength; idx++) {
                    var txt = values[idx];
                    var index = codeTable.indexOf(txt.charCodeAt(0));
                    if (index === -1) {
                        index = CodeTable.indexOf(txt.charCodeAt(0));
                        if (index === -1) {
                            continue;
                        }
                        color = fillStyle;
                        gridData.addXOffset = FontAdvanceTable[index] * fontScale;
                        sTable = GlyphShapeTable;
                    } else  {
                        gridData.addXOffset = faTable[index] * fontScale;
                        sTable = shapeTable;
                    }

                    if (wordWrap && multiline) {
                        if (gridData.wordWidth + gridData.addXOffset > gridData.areaWidth) {
                            gridData.XOffset = gridData.cacheXOffset;
                            gridData.YOffset += gridData.cacheYOffset;
                            gridData.wordWidth = 0;
                        }
                    }

                    var m2 = [fontScale, 0, 0, fontScale, gridData.XOffset, gridData.YOffset];
                    var m3 = _multiplicationMatrix(gridData.matrix, m2);
                    ctx.setTransform(m3[0], m3[1], m3[2], m3[3], m3[4], m3[5]);
                    ctx.fillStyle = color;
                    _this.renderGlyph(sTable[index], ctx);
                    gridData.XOffset += gridData.addXOffset;
                    gridData.wordWidth += gridData.addXOffset;
                }
            }
        }
    };

    /**
     * @param child
     * @param CodeTable
     * @param FontAdvanceTable
     * @returns {number}
     */
    TextField.prototype.getDomWidth = function (child, CodeTable, FontAdvanceTable)
    {
        var _this = this;
        var fontScale = _this.fontScale;
        var stage = _this.getStage();
        var fonts = stage.fonts;
        var width = 0;
        var face = child.face;
        var fontData = fonts[face];
        var codeTable = CodeTable;
        var faTable = FontAdvanceTable;
        if (fontData) {
            codeTable = fontData.CodeTable;
            faTable = fontData.FontAdvanceTable;
        }

        var childNodes = child.childNodes;
        var length = childNodes.length;
        for (var i = 0; i < length; i++) {
            var node = childNodes[i];
            if (node instanceof HTMLFontElement) {
                width += _this.getDomWidth(node, codeTable, faTable);
            } else {
                var values = node.nodeValue;
                if (!values) {
                    continue;
                }
                var vLength = values.length;
                for (var idx = 0; idx < vLength; idx++) {
                    var txt = values[idx];
                    var index = codeTable.indexOf(txt.charCodeAt(0));
                    if (index === -1) {
                        index = CodeTable.indexOf(txt.charCodeAt(0));
                        if (index === -1) {
                            continue;
                        }
                        width += (FontAdvanceTable[index] * fontScale);
                    } else  {
                        width += (faTable[index] * fontScale);
                    }
                }
            }
        }
        return width;
    };

    /**
     * @param records
     * @param ctx
     */
    TextField.prototype.renderGlyph = function (records, ctx)
    {
        if (!records.data) {
            records.data = vtc.convert(records);
        }

        var shapes = records.data;
        var shapeLength = shapes.length;
        for (var idx = 0; idx < shapeLength; idx++) {
            var styleObj = shapes[idx];
            var cmd = styleObj.cmd;
            ctx.beginPath();
            cmd(ctx);
            ctx.fill();
        }
    };

    /**
     * @param ctx
     * @param splitData
     * @param matrix
     * @param fontType
     * @param fillStyle
     */
    TextField.prototype.renderText = function (ctx, splitData, matrix, fontType, fillStyle, _x)
    {
        var _this = this;
        var variables = _this.variables;
        var wordWrap = variables.wordWrap;
        var multiline = variables.multiline;
        var leading = variables.leading / 20;
        var rightMargin = variables.rightMargin / 20;
        var leftMargin = variables.leftMargin / 20;
        var indent = variables.indent / 20;
        var align = variables.align;
        var bounds = _this.getBounds();
        var xMax = bounds.xMax / 20;
        var xMin = bounds.xMin / 20;
        var width = _ceil(xMax - xMin);

        var m2 = [matrix[0] * 20, matrix[1] * 20, matrix[2] * 20, matrix[3] * 20, matrix[4], matrix[5]];
        var xScale = _sqrt(m2[0] * m2[0] + m2[1] * m2[1]);
        var yScale = _sqrt(m2[2] * m2[2] + m2[3] * m2[3]);
        var scale = _max(xScale, yScale);
        ctx.setTransform(scale,m2[1],m2[2],scale,m2[4],m2[5]);

        var dx = xMin;
        var dy = (bounds.yMin / 20) + 2;
        if (align === "right") {
            ctx.textAlign = "end";
            dx += width - rightMargin - 2;
        } else if (align === "center") {
            ctx.textAlign = "center";
            dx += leftMargin + indent + ((width - leftMargin - indent - rightMargin) / 2);
        } else {
            dx += 2 + leftMargin + indent;
        }

        bounds = _this.getBounds(m2);
        var areaWidth = (bounds.xMax - bounds.xMin) - ((leftMargin - rightMargin) * xScale);
        areaWidth /= scale;

        var size = variables.size;
        var length = splitData.length;
        for (var i = 0; i < length; i++) {
            var txt = "";
            var obj = splitData[i];
            if (typeof obj !== "string") {
                txt = obj.innerText;
            } else {
                txt = obj;
            }

            if (txt === "") {
                dy += leading + size;
                continue;
            }

            var measureText = ctx.measureText(txt);
            var txtTotalWidth = measureText.width;
            if (typeof obj === "string") {
                if (wordWrap || multiline) {
                    if (txtTotalWidth > areaWidth) {
                        var txtLength = txt.length;
                        var joinTxt = "";
                        var joinWidth = 2 * scale;
                        for (var t = 0; t < txtLength; t++) {
                            var txtOne = txt[t];
                            var textOne = ctx.measureText(txtOne);
                            joinWidth += textOne.width;
                            joinTxt += txtOne;
                            var nextOne = txt[t+1];
                            if (nextOne) {
                                textOne = ctx.measureText(nextOne);
                                joinWidth += textOne.width;
                            }
                            if (joinWidth > areaWidth || (t + 1) === txtLength) {
                                ctx.fillText(joinTxt, dx, dy, _ceil(joinWidth));
                                joinWidth = 2 * scale;
                                joinTxt = "";
                                dy += leading + size;
                            } else if (nextOne) {
                                joinWidth -= textOne.width;
                            }
                        }
                    } else {
                        ctx.fillText(txt, dx, dy, txtTotalWidth);
                        dy += leading + size;
                    }
                } else {
                    ctx.fillText(txt, dx, dy, txtTotalWidth);
                    dy += leading + size;
                }
            } else {
                var firstChild = obj.firstChild;
                var gridData = {
                    startDx: dx,
                    dx: dx,
                    cloneDy: dy,
                    dy: dy,
                    color: fillStyle,
                    fontType: fontType,
                    fillStyle: fillStyle,
                    size: size,
                    scale: scale,
                    originSize: size,
                    txtTotalWidth: txtTotalWidth,
                    areaWidth: areaWidth,
                    joinWidth: 0,
                    joinTxt: "",
                    offset: 0,
                    offsetArray: []
                };

                if (gridData.offsetArray.length === 0) {
                    _this.offsetDomText(ctx, firstChild, gridData);
                }

                // reset
                gridData.dx = dx;
                gridData.dy = dy;
                gridData.cloneDy = dy;
                gridData.size = size;
                gridData.joinWidth = 0;
                gridData.joinTxt = "";
                gridData.offset = 0;
                if (gridData.offsetArray.length > 0) {
                    var offsetY = gridData.offsetArray[0];
                    if (offsetY) {
                        gridData.dy += offsetY;
                        gridData.cloneDy = gridData.dy;
                    }
                }

                _this.renderDomText(ctx, firstChild, gridData);

                dy = gridData.dy;
            }
        }
    };

    /**
     * @param ctx
     * @param child
     * @param gridData
     */
    TextField.prototype.offsetDomText = function(ctx, child, gridData)
    {
        var _this = this;
        var variables = _this.variables;
        var wordWrap = variables.wordWrap;
        var multiline = variables.multiline;
        var leading = variables.leading / 20;
        if (child.face) {
            gridData.face = child.face;
        }

        if (child.size) {
            var size = child.size|0;
            var changeSize = gridData.originSize - size;
            if (changeSize) {
                gridData.dy += changeSize;
                if (changeSize > 0) {
                    gridData.dy -= 4;
                } else {
                    var offsetArray = gridData.offsetArray;
                    var offset = gridData.offset;
                    var offsetSize = offsetArray[offset];
                    if (offsetSize) {
                        offsetArray[offset] = _max(offsetSize, ~changeSize);
                    } else {
                        offsetArray[offset] = ~changeSize;
                    }
                    gridData.dy += 6;
                }
            }
            gridData.size = size;
        }

        var childNodes = child.childNodes;
        var length = childNodes.length;
        for (var i = 0; i < length; i++) {
            var node = childNodes[i];
            if (node instanceof HTMLFontElement) {
                _this.offsetDomText(ctx, node, gridData);
            } else {
                var txt = node.nodeValue;
                if (wordWrap && multiline) {
                    if (gridData.txtTotalWidth > gridData.areaWidth) {
                        var txtLength = txt.length;
                        for (var t = 0; t < txtLength; t++) {
                            var textOne = ctx.measureText(txt[t]);
                            gridData.joinWidth += textOne.width;
                            gridData.joinTxt += txt[t];
                            var isOver = (gridData.joinWidth > gridData.areaWidth);
                            if (isOver || (t + 1) === txtLength) {
                                if ((gridData.dx + textOne.width) > gridData.areaWidth) {
                                    gridData.dx = gridData.startDx;
                                    gridData.dy += leading + gridData.size;
                                    gridData.cloneDy = gridData.dy;
                                    gridData.joinWidth = 2 * gridData.scale;
                                    isOver = false;
                                    gridData.offset++;
                                }

                                gridData.joinTxt = "";
                                if (isOver) {
                                    gridData.dx = gridData.startDx;
                                    gridData.joinWidth = 22 * gridData.scale;
                                    gridData.dy += leading + gridData.size;
                                    gridData.cloneDy = gridData.dy;
                                    gridData.offset++;
                                }
                            }
                        }
                    } else {
                        gridData.dy += leading + gridData.size;
                        gridData.cloneDy = gridData.dy;
                        gridData.offset++;
                    }
                } else {
                    gridData.dy += leading + gridData.size;
                    gridData.cloneDy = gridData.dy;
                    gridData.offset++;
                }

                var mText = ctx.measureText(txt);
                gridData.dx += mText.width;
                gridData.size = gridData.originSize;
                gridData.dy = gridData.cloneDy;
            }
        }
    };

    /**
     * @param ctx
     * @param child
     * @param gridData
     */
    TextField.prototype.renderDomText = function(ctx, child, gridData)
    {
        var _this = this;
        var variables = _this.variables;
        var wordWrap = variables.wordWrap;
        var multiline = variables.multiline;
        var leading = variables.leading / 20;

        if (child.face) {
            gridData.face = child.face;
        }

        if (child.color) {
            gridData.color = child.color;
        }

        if (child.size) {
            var size = child.size|0;
            var changeSize = gridData.originSize - size;
            if (changeSize) {
                gridData.dy += changeSize;
                if (changeSize > 0) {
                    gridData.dy -= 4;
                } else {
                    gridData.dy += 8;
                }
            }
            gridData.size = size;
        }

        var offsetY;
        var childNodes = child.childNodes;
        var length = childNodes.length;
        for (var i = 0; i < length; i++) {
            var node = childNodes[i];
            if (node instanceof HTMLFontElement) {
                _this.renderDomText(ctx, node, gridData);
            } else {
                ctx.fillStyle = gridData.color;
                ctx.font = gridData.fontType + gridData.size + "px " + gridData.face;

                var text = node.nodeValue;
                var splits = text.split("\n");
                var sLen= splits.length;
                for (var idx = 0; idx < sLen; idx++) {
                    gridData.dx = gridData.startDx;
                    var txt = splits[idx];

                    if (wordWrap && multiline) {
                        if (gridData.txtTotalWidth > gridData.areaWidth) {
                            var txtLength = txt.length;
                            for (var t = 0; t < txtLength; t++) {
                                var textOne = ctx.measureText(txt[t]);
                                gridData.joinWidth += textOne.width;
                                gridData.joinTxt += txt[t];
                                var isOver = (gridData.joinWidth > gridData.areaWidth);
                                if (isOver || (t + 1) === txtLength) {
                                    if ((gridData.dx + textOne.width) > gridData.areaWidth) {
                                        isOver = 0;
                                        gridData.joinWidth = gridData.size;
                                        gridData.dx = gridData.startDx;
                                        gridData.offset++;
                                        gridData.dy += leading + gridData.size;
                                        if (gridData.offsetArray.length > 0) {
                                            offsetY = gridData.offsetArray[gridData.offset];
                                            if (offsetY) {
                                                gridData.dy += offsetY;
                                            }
                                        }
                                        gridData.cloneDy = gridData.dy;
                                    }

                                    ctx.fillText(gridData.joinTxt, gridData.dx, gridData.dy, _ceil(gridData.joinWidth));
                                    gridData.joinTxt = "";
                                    if (isOver) {
                                        gridData.dx = gridData.startDx;
                                        gridData.joinWidth = gridData.size;
                                        gridData.offset++;
                                        gridData.dy += leading + gridData.size;
                                        if (gridData.offsetArray.length > 0) {
                                            offsetY = gridData.offsetArray[gridData.offset];
                                            if (offsetY) {
                                                gridData.dy += offsetY;
                                            }
                                        }
                                        gridData.cloneDy = gridData.dy;
                                    }
                                }
                            }
                        } else {
                            ctx.fillText(txt, gridData.dx, gridData.dy, _ceil(gridData.txtTotalWidth));
                            gridData.offset++;
                            gridData.dy += leading + gridData.size;
                            if (gridData.offsetArray.length > 0) {
                                offsetY = gridData.offsetArray[gridData.offset];
                                if (offsetY) {
                                    gridData.dy += offsetY;
                                }
                            }
                            gridData.cloneDy = gridData.dy;
                        }
                    } else {
                        ctx.fillText(txt, gridData.dx, gridData.dy, _ceil(gridData.txtTotalWidth));
                        gridData.offset++;
                        gridData.dy += leading + gridData.size;
                        if (gridData.offsetArray.length > 0) {
                            offsetY = gridData.offsetArray[gridData.offset];
                            if (offsetY) {
                                gridData.dy += offsetY;
                            }
                        }
                        gridData.cloneDy = gridData.dy;
                    }

                    var mText = ctx.measureText(txt);
                    gridData.dx += mText.width;
                    gridData.color = gridData.fillStyle;
                    gridData.size = gridData.originSize;
                    gridData.dy = gridData.cloneDy;
                }
            }
        }
    };

    /**
     * @param stage
     * @param clipEvent
     */
    TextField.prototype.putFrame = function (stage, clipEvent)
    {
        var _this = this;
        _this.active = true;
        if (_this.inputActive === false) {
            _this.dispatchEvent(clipEvent, stage);
        }
    };

    /**
     * @param ctx
     * @param matrix
     * @param stage
     * @param x
     * @param y
     * @returns {boolean}
     */
    TextField.prototype.renderHitTest = function (ctx, matrix, stage, x, y)
    {
        var _this = this;
        var bounds = _this.getBounds();
        var xMax = bounds.xMax;
        var xMin = bounds.xMin;
        var yMax = bounds.yMax;
        var yMin = bounds.yMin;
        var width = _ceil(xMax - xMin);
        var height = _ceil(yMax - yMin);

        var _multiplicationMatrix = _this.multiplicationMatrix;
        var m2 = _multiplicationMatrix(matrix, _this.getMatrix());
        var m3 = _multiplicationMatrix(stage.getMatrix(), m2);
        ctx.setTransform(m3[0],m3[1],m3[2],m3[3],m3[4],m3[5]);

        var m = _this._matrix;
        if (m) {
            xMin = -xMin;
            yMin = -yMin;
            var m4 = _multiplicationMatrix(m2, [1, 0, 0, 1, xMin, yMin]);
            var m5 = _multiplicationMatrix(stage.getMatrix(), m4);
            ctx.setTransform(m5[0],m5[1],m5[2],m5[3],m5[4],m5[5]);
        }

        ctx.beginPath();
        ctx.rect(xMin, yMin, width, height);
        return ctx.isPointInPath(x, y);
    };

    // dummy
    TextField.prototype.initFrame = function () {};
    TextField.prototype.addActions = function () {};
    TextField.prototype.getTags = function () { return undefined; };

    /**
     * @constructor
     */
    var SimpleButton = function ()
    {
        var _this = this;
        InteractiveObject.call(_this);

        _this.actions = [];
        _this._downState = new Sprite();
        _this._hitState = new Sprite();
        _this._overState = new Sprite();
        _this._upState = new Sprite();
    };

    /**
     * extends
     * @type {InteractiveObject}
     */
    SimpleButton.prototype = Object.create(InteractiveObject.prototype);
    SimpleButton.prototype.constructor = SimpleButton;

    /**
     * properties
     */
    Object.defineProperties(SimpleButton.prototype,
    {
        downState: {
            get: function () {
                return this.getSprite("down");
            },
            set: function (sprite) {
                this.setSprite("down", sprite);
            }
        },
        hitState: {
            get: function () {
                return this.getSprite("hit");
            },
            set: function (sprite) {
                this.setSprite("hit", sprite);
            }
        },
        overState: {
            get: function () {
                return this.getSprite("over");
            },
            set: function (sprite) {
                this.setSprite("over", sprite);
            }
        },
        upState: {
            get: function () {
                return this.getSprite("up");
            },
            set: function (sprite) {
                this.setSprite("up", sprite);
            }
        }
    });

    /**
     *
     * @returns {Array|ActionScript|*|actions}
     */
    SimpleButton.prototype.getActions = function ()
    {
        return this.actions;
    };

    /**
     * @param actions
     */
    SimpleButton.prototype.setActions = function (actions)
    {
        this.actions = actions;
    };

    /**
     * @param status
     */
    SimpleButton.prototype.setButtonStatus = function (status)
    {
        var _this = this;
        if (_this.getButtonStatus() !== status) {
            _this.buttonReset(status);
        }
        _this.buttonStatus = status;
    };

    /**
     * @param status
     * @returns {*}
     */
    SimpleButton.prototype.getSprite = function (status)
    {
        var _this = this;
        if (!status) {
            status = _this.buttonStatus;
        }
        status += "State";
        return _this["_" + status];
    };

    /**
     * @param status
     * @param sprite
     */
    SimpleButton.prototype.setSprite = function (status, sprite)
    {
        var _this = this;
        var stage = _this.getStage();

        var level = 0;
        switch (status) {
            case "down":
                level = 1;
                break;
            case "hit":
                level = 2;
                break;
            case "over":
                level = 3;
                break;
            case "up":
                level = 4;
                break;
        }

        stage.setPlaceObject(new PlaceObject(), _this.instanceId, level, 0);
        sprite.setParent(_this);
        sprite.setLevel(level);
        sprite.setStage(stage);
        var container = sprite.getContainer();
        for (var depth in container) {
            if (!container.hasOwnProperty(depth)) {
                continue;
            }

            var instanceId = container[depth];
            var obj = stage.getInstance(instanceId);
            obj.setParentSprite(sprite);
        }

        status += "State";
        _this["_" + status] = sprite;
    };

    /**
     * @param matrix
     * @param status
     * @returns {{xMin: number, xMax: number, yMin: number, yMax: number}}
     */
    SimpleButton.prototype.getBounds = function (matrix, status)
    {
        var _this = this;
        var xMax = 0;
        var yMax = 0;
        var xMin = 0;
        var yMin = 0;

        var sprite = _this.getSprite(status);
        var tags = sprite.getContainer();
        var length = tags.length;
        if (length) {
            var stage = _this.getStage();
            var no = _Number.MAX_VALUE;
            xMax = -no;
            yMax = -no;
            xMin = no;
            yMin = no;

            var _multiplicationMatrix = _this.multiplicationMatrix;
            for (var depth in tags) {
                if (!tags.hasOwnProperty(depth)) {
                    continue;
                }

                var instanceId = tags[depth];
                var tag = stage.getInstance(instanceId);
                if (!tag || tag.isClipDepth) {
                    continue;
                }

                var matrix2 = (matrix) ? _multiplicationMatrix(matrix, tag.getMatrix()) : tag.getMatrix();
                var bounds = tag.getBounds(matrix2, status);
                if (!bounds) {
                    continue;
                }
                xMin = _min(xMin, bounds.xMin);
                xMax = _max(xMax, bounds.xMax);
                yMin = _min(yMin, bounds.yMin);
                yMax = _max(yMax, bounds.yMax);
            }
        }
        return {xMin: xMin, xMax: xMax, yMin: yMin, yMax: yMax};
    };

    /**
     * @param status
     */
    SimpleButton.prototype.buttonReset = function (status)
    {
        var _this = this;
        var sprite = _this.getSprite();
        var container = sprite.getContainer();
        var nextSprite = _this.getSprite(status);
        var nextContainer = nextSprite.getContainer();
        var stage = _this.getStage();
        for (var depth in container) {
            if (!container.hasOwnProperty(depth)) {
                continue;
            }
            var instanceId = container[depth];
            if (depth in nextContainer && instanceId === nextContainer[depth]) {
                continue;
            }
            var instance = stage.getInstance(instanceId);
            if (!instance) {
                continue;
            }
            instance.reset();
        }
    };

    /**
     * @param matrix
     * @param stage
     * @param visible
     * @param mask
     */
    SimpleButton.prototype.setHitRange = function (matrix, stage, visible, mask)
    {
        var _this = this;
        var isVisible = _min(_this.getVisible(), visible);
        if (_this.getEnabled() && isVisible) {
            var buttonHits = stage.buttonHits;

            // enter
            if (isTouch) {
                var actions = _this.getActions();
                var aLen = actions.length;
                if (aLen) {
                    for (var idx = 0; idx < aLen; idx++) {
                        var cond = actions[idx];
                        if (cond.CondKeyPress === 13) {
                            buttonHits[buttonHits.length] = {
                                button: _this,
                                xMin: 0,
                                xMax: stage.getWidth(),
                                yMin: 0,
                                yMax: stage.getHeight(),
                                CondKeyPress: cond.CondKeyPress,
                                parent: _this.getParent()
                            };
                        }
                    }
                }
            }

            var status = "hit";
            var hitTest = _this.getSprite(status);
            var hitTags = hitTest.getContainer();
            if (!hitTags.length) {
                status = "up";
                hitTest = _this.getSprite(status);
                hitTags = hitTest.getContainer();
            }

            if (hitTags.length) {
                var m2 = _this.multiplicationMatrix(matrix, _this.getMatrix());
                var bounds = _this.getBounds(m2, status);
                if (bounds) {
                    buttonHits[buttonHits.length] = {
                        button: _this,
                        xMin: bounds.xMin,
                        xMax: bounds.xMax,
                        yMin: bounds.yMin,
                        yMax: bounds.yMax,
                        CondKeyPress: 0,
                        parent: _this.getParent(),
                        matrix: _this.cloneArray(matrix)
                    };
                }
            }
        }
    };

    /**
     * @param ctx
     * @param matrix
     * @param colorTransform
     * @param stage
     * @param visible
     */
    SimpleButton.prototype.render = function (ctx, matrix, colorTransform, stage, visible)
    {
        var _this = this;

        // colorTransform
        var _multiplicationColor = _this.multiplicationColor;
        var rColorTransform = _multiplicationColor(colorTransform, _this.getColorTransform());

        // matrix
        var _multiplicationMatrix = _this.multiplicationMatrix;
        var m2 = _multiplicationMatrix(matrix, _this.getMatrix());

        // pre render
        var isVisible = _min(_this.getVisible(), visible);
        var obj = _this.preRender(ctx, m2, rColorTransform, stage, isVisible);

        // render
        var sprite = _this.getSprite();
        var rMatrix = _multiplicationMatrix(obj.preMatrix, sprite.getMatrix());
        var rColorTransform2 = _multiplicationColor(rColorTransform, sprite.getColorTransform());
        isVisible = _min(sprite.getVisible(), visible);
        var cacheKey = obj.cacheKey;
        cacheKey += sprite.render(obj.preCtx, rMatrix, rColorTransform2, stage, isVisible);

        // post render
        if (obj.isFilter || obj.isBlend) {
            obj.cacheKey = cacheKey;
            _this.postRender(ctx, matrix, colorTransform, stage, obj);
        }
        return cacheKey;
    };

    /**
     * @param ctx
     * @param matrix
     * @param stage
     * @param x
     * @param y
     * @returns {boolean}
     */
    SimpleButton.prototype.renderHitTest = function (ctx, matrix, stage, x, y)
    {
        var _this = this;

        var sprite = _this.getSprite("hit");
        var tags = sprite.getContainer();
        var length = tags.length;
        if (!length) {
            return false;
        }

        var _multiplicationMatrix = _this.multiplicationMatrix;
        var m2 = _multiplicationMatrix(matrix, _this.getMatrix());
        var m3 = _multiplicationMatrix(m2, sprite.getMatrix());

        if (length) {
            var loadStage = _this.getStage();
            for (var depth in tags) {
                if (!tags.hasOwnProperty(depth)) {
                    continue;
                }

                var instanceId = tags[depth];
                var tag = loadStage.getInstance(instanceId);
                if (!tag) {
                    continue;
                }

                var hit = tag.renderHitTest(ctx, m3, stage, x, y);
                if (hit) {
                    return hit;
                }
            }
        }

        return false;
    };

    /**
     * @param ctx
     * @param matrix
     * @param stage
     * @param x
     * @param y
     * @returns {*}
     */
    SimpleButton.prototype.hitCheck = function (ctx, matrix, stage, x, y)
    {
        var _this = this;

        var sprite = _this.getSprite("hit");
        var tags = sprite.getContainer();
        var length = tags.length;
        if (!length) {
            return false;
        }

        var _multiplicationMatrix = _this.multiplicationMatrix;
        var m2 = _multiplicationMatrix(matrix, _this.getMatrix());
        var m3 = _multiplicationMatrix(m2, sprite.getMatrix());

        var hitObj = false;
        var hit = false;
        if (length) {
            var loadStage = _this.getStage();
            tags.reverse();
            for (var depth in tags) {
                if (!tags.hasOwnProperty(depth)) {
                    continue;
                }

                var tagId = tags[depth];
                var instance = loadStage.getInstance(tagId);
                if (instance instanceof Shape ||
                    instance instanceof StaticText ||
                    instance instanceof TextField
                ) {
                    hit = instance.renderHitTest(ctx, m3, stage, x, y);
                } else {
                    hit = instance.hitCheck(ctx, m3, stage, x, y);
                }

                if (hit) {
                    hitObj = hit;
                    if (typeof hit !== "object") {
                        var events = _this.events;
                        if (events.press !== undefined ||
                            events.release !== undefined ||
                            events.releaseOutside !== undefined ||
                            events.rollOver !== undefined ||
                            events.rollOut !== undefined ||
                            events.dragOver !== undefined ||
                            events.dragOut !== undefined
                        ) {
                            stage.isHit = hit;
                            hitObj = {
                                parent : _this.getParent(),
                                button : _this
                            };
                        }
                    }

                    tags.reverse();
                    return hitObj;
                }
            }
            tags.reverse();
        }

        return false;
    };

    /**
     * @see MovieClip.addActions
     */
    SimpleButton.prototype.addActions = function (stage)
    {
        var _this = this;
        var sprite = _this.getSprite();
        var tags = sprite.getContainer();
        var length = tags.length;
        if (length) {
            var myStage = _this.getStage();
            for (var depth in tags) {
                if (!tags.hasOwnProperty(depth)) {
                    continue;
                }
                var instanceId = tags[depth];
                var tag = myStage.getInstance(instanceId);
                if (!tag) {
                    continue;
                }
                tag.addActions(stage);
            }
        }
    };

    /**
     * Dummy
     * @returns {undefined}
     */
    SimpleButton.prototype.getTags = function () { return undefined; };
    SimpleButton.prototype.initFrame = function () {};

    /**
     * @constructor
     */
    var MovieClip = function ()
    {
        var _this = this;
        Sprite.call(_this);

        _this._currentframe = 1;
        _this.removeTags = [];
        _this.actions = [];
        _this.labels = [];

        // flag
        _this.stopFlag = false;
        _this.isAction = true;

        // clip
        _this.isClipDepth = false;
        _this.clipDepth = 0;

        // sound
        _this.sounds = [];
        _this.soundStopFlag = false;
    };

    /**
     * extends
     * @type {Sprite}
     */
    MovieClip.prototype = Object.create(Sprite.prototype);
    MovieClip.prototype.constructor = MovieClip;

    /**
     * @param name
     * @param stage
     */
    MovieClip.prototype.dispatchOnEvent = function (name, stage)
    {
        var _this = this;
        var as = _this.variables[name];
        if (as) {
            _this.setActionQueue(as, stage);
        }
    };

    /**
     * @param name
     * @param depth
     * @returns {MovieClip}
     */
    MovieClip.prototype.createEmptyMovieClip = function (name, depth)
    {
        var _this = this;
        var stage = _this.getStage();

        if (name === undefined) {
            return undefined;
        }

        var mc = _this.getDisplayObject(name);
        if (!mc) {
            mc = new MovieClip();
        }

        depth += 16384;

        mc.setName(name);
        mc.setLevel(depth);
        mc.setParent(_this);
        mc.setStage(stage);

        var container = _this.getContainer();
        var totalFrames = _this.getTotalFrames() + 1;
        var placeObject = new PlaceObject();
        var instanceId = _this.instanceId;
        for (var frame = 1; frame < totalFrames; frame++) {
            if (!(frame in container)) {
                container[frame] = [];
            }
            container[frame][depth] = mc.instanceId;
            stage.setPlaceObject(placeObject, instanceId, depth, frame);
        }
        return mc;
    };

    /**
     * @param name
     * @param depth
     * @param x
     * @param y
     * @param width
     * @param height
     * @returns {TextField}
     */
    MovieClip.prototype.createTextField = function (name, depth, x, y, width, height)
    {
        if (16384 > depth) {
            depth += 16384;
        }
        var _this = this;
        var textField = new TextField(name, depth, width, height);
        textField.setX(x);
        textField.setY(y);
        textField.setParent(_this);
        textField.setStage(_this.getStage());
        textField.setInitParams();
        var container = _this.getContainer();
        for (var frame in container) {
            if (!container.hasOwnProperty(frame)) {
                continue;
            }
            container[frame][depth] = textField.instanceId;
        }
        return textField;
    };

    /**
     * @param r
     * @param g
     * @param b
     */
    MovieClip.prototype.setBackgroundColor = function (r, g, b)
    {
        var _this = this;
        var stage = _this.getStage();
        stage.setBackgroundColor(r, g, b);
    };

    /**
     * play
     */
    MovieClip.prototype.play = function ()
    {
        this.stopFlag = false;
    };

    /**
     * stop
     */
    MovieClip.prototype.stop = function ()
    {
        this.stopFlag = true;
    };

    /**
     * @param frame
     */
    MovieClip.prototype.gotoAndPlay = function (frame)
    {
        var _this = this;
        if (!_isNaN(frame)) {
            frame = +frame;
        } else if (typeof frame === "string") {
            frame = _this.getLabel(frame);
        }

        if (typeof frame === "number" && frame > 0) {
            _this.setNextFrame(frame);
            _this.play();
        }
    };

    /**
     * @param frame
     */
    MovieClip.prototype.gotoAndStop = function (frame)
    {
        var _this = this;
        if (typeof frame === "string") {
            frame = _this.getLabel(frame);
        }
        frame |= 0;
        if (typeof frame === "number" && frame > _this.getTotalFrames()) {
            frame = _this.getTotalFrames();
            _this.isAction = false;
        }
        if (frame > 0) {
            _this.setNextFrame(frame);
            _this.stop();
        }
    };

    /**
     * stopAllSounds
     */
    MovieClip.prototype.stopAllSounds = function ()
    {
        var stage = this.getStage();
        var loadSounds = stage.loadSounds;
        var sLen = loadSounds.length;
        var stopSound = function () {
            this.removeEventListener("pause", stopSound);
            this.currentTime = 0;
            this.loop = false;
        };

        if (sLen > 0) {
            while (sLen--) {
                if (!(sLen in loadSounds)) {
                    continue;
                }
                var audio = loadSounds[sLen];
                audio.addEventListener("pause", stopSound);
                audio.pause();
            }
        }
        stage.loadSounds = [];
    };

    /**
     * @param url
     * @param target
     * @param SendVarsMethod
     * @returns {number}
     */
    MovieClip.prototype.loadMovie = function (url, target, SendVarsMethod)
    {
        var _this = this;
        var stage = _this.getStage();
        var targetMc = null;

        if (!target) {
            target = _this.getName();
            targetMc = _this;
        }

        if (!targetMc) {
            if (typeof target === "string") {
                var _level = target.substr(0, 6);
                if (_level === "_level") {
                    target = +target.substr(6);
                }
            }
            if (typeof target === "number") {
                var parent = stage.getParent();
                if (!parent) {
                    parent = stage.getParent();
                }
                var tags = parent.getTags();
                targetMc = tags[target];
            } else {
                targetMc = _this.getDisplayObject(target);
            }
        }

        if (targetMc) {
            _this.unloadMovie(targetMc);

            var xmlHttpRequest = new XMLHttpRequest();
            var targetUrl = url;
            var body = null;
            if (SendVarsMethod === 2) {
                var urls = url.split("?");
                if (urls[1] !== undefined) {
                    body = urls[1];
                }
                targetUrl = urls[0];
                xmlHttpRequest.open("POST", targetUrl, true);
                xmlHttpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            } else {
                xmlHttpRequest.open("GET", targetUrl, true);
            }

            if (isXHR2) {
                xmlHttpRequest.responseType = "arraybuffer";
            } else {
                xmlHttpRequest.overrideMimeType("text/plain; charset=x-user-defined");
            }

            xmlHttpRequest.onreadystatechange = function ()
            {
                var readyState = xmlHttpRequest.readyState;
                var status = xmlHttpRequest.status;
                if (readyState === 4) {
                    switch (status) {
                        case 200:
                        case 304:
                            var _root = _this.getDisplayObject("_root");
                            var rootStage = _root.getStage();
                            var data = isXHR2 ? xmlHttpRequest.response : xmlHttpRequest.responseText;
                            var loadStage = new Stage();
                            loadStages[loadStage.getId()] = loadStage;
                            targetMc._url = url;
                            targetMc.reset();
                            loadStage.setParent(targetMc);
                            targetMc.setLoadStage(loadStage);
                            loadStage.parse(data, targetUrl);
                            loadStage.stop();

                            if (target === 0 || (typeof target !== "number" && !targetMc.getParent())) {
                                stage.stop();
                                loadStage.setId(stage.getId());
                                loadStage.setName(stage.getName());
                                loadStage.backgroundColor = stage.backgroundColor;
                                loadStage.initCanvas();
                                loadStage.loadStatus = 2;
                                loadStage.loadEvent();
                                delete loadStages[loadStage.getId()];
                                stages[stage.getId()] = loadStage;
                                stage = null;
                            }

                            var onData = targetMc.variables.onData;
                            if (typeof onData === "function") {
                                loadStage.executeEventAction(onData, targetMc);
                            }

                            clipEvent.type = "data";
                            targetMc.dispatchEvent(clipEvent, rootStage);

                            targetMc.addActions(rootStage);
                            break;
                    }
                }
            };
            xmlHttpRequest.send(body);
        }
    };

    /**
     * @param target
     * @returns {number}
     */
    MovieClip.prototype.unloadMovie = function (target)
    {
        var _this = this;
        var targetMc = null;
        if (target instanceof MovieClip) {
            targetMc = target;
        } else {
            targetMc = _this.getDisplayObject(target);
            if (!targetMc) {
                return 0;
            }
        }

        // delete
        targetMc.reset();
        targetMc.setLoadStage(null);
        targetMc.setStage(_this.getStage());
        targetMc.container = [];
        targetMc.actions = [];
        targetMc.instances = [];
        targetMc.labels = [];
        targetMc.sounds = [];
        targetMc.removeTags = [];
        targetMc._totalframes = 1;
        targetMc._url = null;
        targetMc._lockroot = undefined;

        var loadStage = targetMc.getStage();
        delete loadStages[loadStage.getId()];
    };

    /**
     * @param url
     * @param target
     * @param method
     * @returns {*}
     */
    MovieClip.prototype.getURL = function (url, target, method)
    {
        var _this = this;
        if (typeof url === "string") {
            var cmd = url.substr(0, 9);
            if (cmd === "FSCommand") {
                var values = url.split(":");
                cmd = values.pop();
                var str = arguments[1];
                if (str === undefined) {
                    str = "";
                }

                var stage = _this.getStage();
                var FSCommand = stage.abc.flash.system.fscommand;
                return FSCommand.apply(stage, [cmd, str]);
            }
        }

        if (target && typeof target === "string") {
            switch (target.toLowerCase()) {
                case "_self":
                case "_blank":
                case "_parent":
                case "_top":
                    break;
                case "post":
                    target = "_self";
                    method = "GET";
                    break;
                case "get":
                    target = "_self";
                    method = "GET";
                    break;
                default:
                    if (!method) {
                        method = "GET";
                    }
                    _this.loadMovie(url, target, method);
                    return 0;
            }
        }

        // form
        if (method === "POST") {
            var form = _document.createElement("form");
            form.action = url;
            form.method = method;
            if (target) {
                form.target = target;
            }

            var urls = url.split("?");
            if (urls.length > 1) {
                var pears = urls[1].split("&");
                var pLen = pears.length;
                var _encodeURI = encodeURI;
                for (var pIdx = 0; pIdx < pLen; pIdx++) {
                    var pear = pears[pIdx].split("=");
                    var input = _document.createElement("input");
                    input.type = "hidden";
                    input.name = pear[0];
                    input.value = _encodeURI(pear[1] || "");
                    form.appendChild(input);
                }
            }
            _document.body.appendChild(form);
            form.submit();
        } else {
            var a = _document.createElement("a");
            a.href = url;
            a.target = target;
            a.click();
        }
    };

    /**
     * @param url
     * @param target
     * @param method
     */
    MovieClip.prototype.loadVariables = function (url, target, method)
    {
        var _this = this;
        var targetMc = _this;
        if (target) {
            targetMc = _this.getDisplayObject(target);
        }

        if (targetMc) {
            var xmlHttpRequest = new XMLHttpRequest();
            var body = null;
            if (method === "POST") {
                var urls = url.split("?");
                if (urls[1] !== undefined) {
                    body = urls[1];
                }
                xmlHttpRequest.open(method, urls[0], true);
                xmlHttpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            } else {
                xmlHttpRequest.open("GET", url, true);
            }

            xmlHttpRequest.onreadystatechange = function ()
            {
                var readyState = xmlHttpRequest.readyState;
                if (readyState === 4) {
                    var status = xmlHttpRequest.status;
                    switch (status) {
                        case 200:
                        case 304:
                            var responseText = decodeURIComponent(xmlHttpRequest.responseText);
                            var pairs = responseText.split("&");
                            var length = pairs.length;
                            for (var idx = 0; idx < length; idx++) {
                                var pair = pairs[idx];
                                var values = pair.split("=");
                                targetMc.setVariable(values[0], values[1]);
                            }

                            var _root = _this.getDisplayObject();
                            var rootStage = _root.getStage();
                            var stage = _this.getStage();
                            var onData = targetMc.variables.onData;
                            if (typeof onData === "function") {
                                stage.executeEventAction(onData, targetMc);
                            }

                            clipEvent.type = "data";
                            targetMc.dispatchEvent(clipEvent, rootStage);

                            break;
                    }
                }
            };
            xmlHttpRequest.send(body);
        }
    };

    /**
     * @returns {boolean}
     */
    MovieClip.prototype.hitTest = function ()
    {
        var _this = this;
        var targetMc = arguments[0];
        var x = 0;
        var y = 0;
        var bool = false;
        if (!(targetMc instanceof MovieClip)) {
            x = arguments[0];
            y = arguments[1];
            bool = arguments[2];
            if (!x || !y) {
                return false;
            }
        }

        var bounds = _this.getHitBounds();
        var xMax = bounds.xMax;
        var xMin = bounds.xMin;
        var yMax = bounds.yMax;
        var yMin = bounds.yMin;

        if (targetMc instanceof MovieClip) {
            var targetBounds = targetMc.getHitBounds();
            var txMax = targetBounds.xMax;
            var txMin = targetBounds.xMin;
            var tyMax = targetBounds.yMax;
            var tyMin = targetBounds.yMin;
            return (txMax > xMin && tyMax > yMin && xMax > txMin && yMax > tyMin);
        } else {
            if (x >= xMin && x <= xMax && y >= yMin && y <= yMax) {
                if (bool) {
                    var matrix = [1,0,0,1,0,0];
                    var mc = _this;
                    var _multiplicationMatrix = _this.multiplicationMatrix;
                    while (true) {
                        var parent = mc.getParent();
                        if (!parent.getParent()) {
                            break;
                        }
                        matrix = _multiplicationMatrix(parent.getMatrix(), matrix);
                        mc = parent;
                    }
                    var _root = _this.getDisplayObject("_root");
                    var stage = _root.getStage();
                    var ctx = stage.hitContext;
                    var scale = stage.getScale();
                    x *= scale;
                    y *= scale;
                    y *= _devicePixelRatio;
                    x *= _devicePixelRatio;

                    return _this.renderHitTest(ctx, matrix, stage, x, y);
                } else {
                    return true;
                }
            }
            return false;
        }
    };

    /**
     * @returns {{xMin: *, xMax: *, yMin: *, yMax: *}}
     * @returns {*}
     */
    MovieClip.prototype.getHitBounds = function ()
    {
        var _this = this;
        var mc = _this;
        var matrix = _this.getMatrix();
        var _multiplicationMatrix = _this.multiplicationMatrix;
        while (true) {
            var parent = mc.getParent();
            if (!parent.getParent()) {
                break;
            }
            matrix = _multiplicationMatrix(parent.getMatrix(), matrix);
            mc = parent;
        }
        return _this.getBounds(matrix);
    };

    /**
     * @param depth
     * @returns {*}
     */
    MovieClip.prototype.getInstanceAtDepth = function (depth)
    {
        var _this = this;
        var parent = _this.getParent();
        if (!parent) {
            parent = _this.getDisplayObject("_root");
        }
        var tags = parent.getTags();
        depth += 16384;
        return tags[depth];
    };

    /**
     * swapDepths
     */
    MovieClip.prototype.swapDepths = function ()
    {
        var _this = this;
        var mc = arguments[0];
        var depth = 0;
        var parent = _this.getParent();
        if (parent) {
            var tags = parent.getTags();
            if (mc instanceof MovieClip) {
                if (parent === mc.getParent()) {
                    depth = _this.getDepth() + 16384;
                    var swapDepth = mc.getDepth() + 16384;
                    _this.setDepth(depth, swapDepth, mc);
                }
            } else {
                depth = arguments[0];
                if (_isNaN(depth)) {
                    depth = parent.getNextHighestDepth();
                }
                if (16384 > depth) {
                    depth += 16384;
                }
                if (depth in tags) {
                    var id = tags[depth];
                    if (id !== _this.instanceId) {
                        var stage = _this.getStage();
                        var instance = stage.getInstance(id);
                        _this.swapDepths(instance);
                    }
                } else {
                    _this.setDepth(depth, null, null);
                }
            }
        }
    };

    /**
     * @param id
     * @param name
     * @param depth
     * @param object
     * @returns {*}
     */
    MovieClip.prototype.attachMovie = function (id, name, depth, object)
    {
        var movieClip = null;
        var _this = this;
        if (_isNaN(depth)) {
            depth = _this.getNextHighestDepth();
        }
        if (depth < 16384) {
            depth += 16384;
        }

        var mc = _this.getDisplayObject(name);
        if (mc) {
            mc.removeMovieClip();
        }

        var stage = _this.getStage();
        var exportAssets = stage.exportAssets;
        if (id in exportAssets) {
            var characterId = exportAssets[id];
            var tag = stage.getCharacter(characterId);
            if (tag) {
                movieClip = new MovieClip();
                movieClip.setStage(stage);
                movieClip.setParent(_this);
                movieClip.setCharacterId(characterId);
                movieClip.setLevel(depth);
                movieClip.setName(name);
                movieClip.setTarget(_this.getTarget() + "/" + name);

                // init action
                var initAction = stage.initActions[characterId];
                if (typeof initAction === "function") {
                    movieClip.active = true;
                    initAction.apply(movieClip);
                    movieClip.reset();
                }

                // registerClass
                var RegClass = stage.registerClass[characterId];
                if (RegClass) {
                    movieClip.variables.registerClass = new RegClass();
                }

                var swfTag = new SwfTag(stage, null);
                swfTag.build(tag, movieClip);

                var placeObject = new PlaceObject();
                var instanceId = _this.instanceId;
                var totalFrame = _this.getTotalFrames() + 1;
                var container = _this.getContainer();
                for (var frame = 1; frame < totalFrame; frame++) {
                    if (!(frame in container)) {
                        container[frame] = [];
                    }
                    container[frame][depth] = movieClip.instanceId;
                    stage.setPlaceObject(placeObject, instanceId, depth, frame);
                }

                if (object) {
                    for (var prop in object) {
                        if (!object.hasOwnProperty(prop)) {
                            continue;
                        }
                        movieClip.setProperty(prop, object[prop]);
                    }
                }

                var _root = _this.getDisplayObject("_root");
                var rootStage = _root.getStage();
                movieClip.addActions(rootStage);
            }
        }
        return movieClip;
    };

    /**
     * @returns {number}
     */
    MovieClip.prototype.getNextHighestDepth = function ()
    {
        var depth = 0;
        var _this = this;
        var container = _this.getContainer();
        for (var idx in container) {
            if (!container.hasOwnProperty(idx)) {
                continue;
            }
            var children = container[idx];
            depth = _max(depth, children.length);
        }
        if (16384 > depth) {
            depth = 0;
        }
        return depth;
    };

    /**
     * @returns {*}
     */
    MovieClip.prototype.getBytesLoaded = function ()
    {
        var _this = this;
        var stage = _this.getStage();
        var bitio = stage.bitio;
        return (!bitio) ? stage.fileSize : bitio.byte_offset;
    };

    /**
     * @returns {number|*|fileLength}
     */
    MovieClip.prototype.getBytesTotal = function ()
    {
        var _this = this;
        var stage = _this.getStage();
        return stage.fileSize;
    };

    /**
     * updateAfterEvent
     */
    MovieClip.prototype.updateAfterEvent = function ()
    {
        var _this = this;
        var _root = _this.getDisplayObject("_root");
        var stage = _root.getStage();
        stage.touchRender();
    };

    /**
     * @returns {*}
     */
    MovieClip.prototype.duplicateMovieClip = function ()
    {
        var _this = this;
        var _root = _this.getDisplayObject("_root");
        var stage = _root.getStage();
        var target = arguments[0];
        var name = arguments[1];
        var depth = arguments[2];

        var targetMc = _this.getDisplayObject(name);
        var parent;
        var object;
        if (!targetMc && stage.getVersion() > 4) {
            target = arguments[0];
            depth = arguments[1];
            if (_isNaN(depth)) {
                parent = _this.getParent();
                if (!parent) {
                    parent = stage.getParent();
                }
                depth = parent.getNextHighestDepth();
            }
            object = arguments[2];
            targetMc = _this;
        }

        if (16384 > depth) {
            depth += 16384;
        }

        var cloneMc;
        if (targetMc !== undefined && targetMc.getCharacterId() !== 0) {
            stage = targetMc.getStage();
            parent = targetMc.getParent();
            if (!parent) {
                parent = stage.getParent();
            }

            var char = stage.getCharacter(targetMc.characterId);
            var swftag = new SwfTag(stage);
            if (char instanceof Array) {
                cloneMc = new MovieClip();
                cloneMc.setStage(stage);
                cloneMc.setParent(parent);
                cloneMc.setLevel(depth);
                cloneMc.setTotalFrames(targetMc.getTotalFrames());
                cloneMc.setCharacterId(targetMc.characterId);
                swftag.build(char, cloneMc);
            } else {
                var tag = {
                    CharacterId: targetMc.characterId,
                    Ratio: 0,
                    Depth: depth
                };
                cloneMc = swftag.buildObject(tag, parent);
            }

            cloneMc.setName(target);
            if (targetMc._matrix) {
                cloneMc._blendMode = targetMc._blendMode;
                cloneMc._filters = targetMc._filters;
                cloneMc._matrix = _this.cloneArray(targetMc._matrix);
                cloneMc._colorTransform = _this.cloneArray(targetMc._colorTransform);
            }

            var totalFrame = parent.getTotalFrames() + 1;
            var container = parent.getContainer();
            var instanceId = parent.instanceId;
            var placeObjects = stage.placeObjects[instanceId];
            var level = targetMc.getLevel();
            for (var frame = 1; frame < totalFrame; frame++) {
                if (!(frame in container)) {
                    container[frame] = [];
                }
                container[frame][depth] = cloneMc.instanceId;

                if (frame in placeObjects) {
                    var placeObject = placeObjects[frame][level];
                    if (placeObject) {
                        if (!(frame in placeObjects)) {
                            placeObjects[frame] = [];
                        }
                        placeObjects[frame][depth] = placeObject.clone();
                    }
                }
            }

            if (object) {
                for (var prop in object) {
                    if (!object.hasOwnProperty(prop)) {
                        continue;
                    }
                    cloneMc.setProperty(prop, object[prop]);
                }
            }

            cloneMc.addActions(stage);
        }

        return cloneMc;
    };

    /**
     * @param name
     */
    MovieClip.prototype.removeMovieClip = function (name)
    {
        var _this = this;
        var targetMc = _this;
        if (typeof name === "string") {
            var target = _this.getDisplayObject(name);
            if (target) {
                targetMc = target;
            }
        }

        var depth = targetMc.getDepth() + 16384;
        var level = targetMc.getLevel();
        if (targetMc instanceof MovieClip && depth >= 16384) {
            targetMc.reset();
            targetMc.removeFlag = true;
            var parent = targetMc.getParent();
            var container = parent.getContainer();
            var instanceId = targetMc.instanceId;
            var tagId;
            for (var frame = parent.getTotalFrames() + 1; --frame;) {
                if (!(frame in container)) {
                    continue;
                }

                var tags = container[frame];
                if (depth in tags) {
                    tagId = tags[depth];
                    if (tagId === instanceId) {
                        delete container[frame][depth];
                    }
                }

                if (depth !== level && 16384 > level) {
                    if (!(level in tags)) {
                        tags[level] = instanceId;
                    }
                }
            }
        }
    };

    /**
     * initFrame
     */
    MovieClip.prototype.initFrame = function ()
    {
        var _this = this;
        _this.active = true;

        var stage = _this.getStage();
        var tags = _this.getTags();
        var length = tags.length;
        if (length) {
            tags.reverse();
            for (var depth in tags) {
                if (!tags.hasOwnProperty(depth)) {
                    continue;
                }

                var instanceId = tags[depth];
                var instance = stage.getInstance(instanceId);
                if (!instance) {
                    continue;
                }
                instance.initFrame();
            }
            tags.reverse();
        }

        var initAction = stage.initActions[_this.getCharacterId()];
        if (typeof initAction === "function") {
            initAction.apply(_this);
        }
    };

    /**
     * @param stage
     * @param clipEvent
     */
    MovieClip.prototype.putFrame = function (stage, clipEvent)
    {
        var _this = this;
        var myStage = _this.getStage();
        var prevTags;
        var stopFlag = _this.stopFlag;
        if (!stopFlag && _this.active) {
            var frame = _this.getCurrentFrame();
            var totalFrames = _this.getTotalFrames();
            if (totalFrames > 1) {
                if (_this.isLoad) {
                    prevTags = _this.getTags();
                    frame++;
                }
                if (frame > totalFrames) {
                    frame = 1;
                    _this.resetCheck();
                }

                _this.setCurrentFrame(frame);
                _this.remove(stage);
                _this.isAction = true;
                _this.soundStopFlag = false;
            }
        }

        if (_this.removeFlag) {
            return 0;
        }

        _this.active = true;
        if (prevTags !== undefined) {
            if (_this.isSwap) {
                _this.resetSwap();
            }

            var tags = _this.getTags();
            var length = tags.length;
            if (length && tags.toString() !== prevTags.toString()) {
                for (var depth in tags) {
                    if (!tags.hasOwnProperty(depth)) {
                        continue;
                    }

                    var instanceId = tags[depth];
                    if (depth in prevTags && instanceId === prevTags[depth]) {
                        continue;
                    }

                    var instance = myStage.getInstance(instanceId);
                    if (instance && instance instanceof MovieClip) {
                        stage.newTags.unshift(instance);
                    }
                }
            }
        }

        if (_this.isLoad) {
            clipEvent.type = "enterFrame";
            _this.dispatchEvent(clipEvent, stage);
            _this.dispatchOnEvent("onEnterFrame", stage);
            _this.addTouchEvent(stage);
            if (_this.isAction) {
                _this.isAction = false;
                var as = _this.getActions(_this.getCurrentFrame());
                if (as) {
                    _this.setActionQueue(as, stage);
                }
            }
        } else {
            // init action
            var initAction = myStage.initActions[_this.getCharacterId()];
            if (typeof initAction === "function") {
                initAction.apply(_this);
            }
        }
    };

    /**
     * nextFrame
     */
    MovieClip.prototype.nextFrame = function ()
    {
        var _this = this;
        var frame = _this.getCurrentFrame();
        frame++;
        _this.setNextFrame(frame);
        _this.stop();
    };

    /**
     * prevFrame
     */
    MovieClip.prototype.prevFrame = function ()
    {
        var _this = this;
        var frame = _this.getCurrentFrame();
        frame--;
        _this.setNextFrame(frame);
        _this.stop();
    };

    /**
     * @returns {number}
     */
    MovieClip.prototype.getCurrentFrame = function ()
    {
        return this._currentframe;
    };

    /**
     * @param frame
     */
    MovieClip.prototype.setCurrentFrame = function (frame)
    {
        this._currentframe = frame;
    };

    /**
     * @param frame
     */
    MovieClip.prototype.setNextFrame = function (frame)
    {
        var _this = this;
        if (frame > 0 && _this.getCurrentFrame() !== frame) {
            _this.isAction = true;

            if (frame > _this.getTotalFrames()) {
                frame = _this.getTotalFrames();
                _this.isAction = false;
            }

            var maxFrame = _max(frame, _this.getCurrentFrame()) + 1;
            var minFrame = _min(frame, _this.getCurrentFrame());

            var stage = _this.getStage();
            var tags = _this.getTags();
            var checked = [];
            var nextTags = _this.getTags(frame);
            var tag, tagId, depth, nextTag, nextTagId;
            var length = _max(tags.length, nextTags.length);
            if (length) {
                for (depth = 0; depth < length; depth++) {
                    if (!(depth in tags) && !(depth in nextTags)) {
                        continue;
                    }

                    tagId = tags[depth];
                    nextTagId = nextTags[depth];
                    if (!tagId && !nextTagId) {
                        continue;
                    }

                    tag = stage.getInstance(tagId);
                    nextTag = stage.getInstance(nextTagId);
                    if (tagId && nextTagId) {
                        if (tagId === nextTagId) {
                            checked[tagId] = true;
                            continue;
                        }

                        tag.reset();
                        nextTag.reset();
                        checked[tagId] = true;
                        checked[nextTagId] = true;
                    } else if (tag) {
                        tag.reset();
                        checked[tagId] = true;
                    } else if (nextTag) {
                        nextTag.reset();
                        checked[nextTagId] = true;
                    }
                }
            }

            if (checked.length) {
                for (var chkFrame = minFrame; chkFrame < maxFrame; chkFrame++) {
                    var container = _this.getTags(chkFrame);
                    if (!container.length) {
                        continue;
                    }

                    for (depth in container) {
                        if (!container.hasOwnProperty(depth)) {
                            continue;
                        }
                        tagId = container[depth];
                        if (tagId in checked) {
                            continue;
                        }

                        checked[tagId] = true;
                        tag = stage.getInstance(tagId);
                        tag.reset();
                    }
                }
            }

            _this.setCurrentFrame(frame);
            _this.soundStopFlag = false;

            var _root = _this.getDisplayObject("_root");
            var rootStage = _root.getStage();
            _this.addActions(rootStage);
        }
    };

    /**
     * @returns {number}
     */
    MovieClip.prototype.getTotalFrames = function ()
    {
        return this._totalframes;
    };

    /**
     * @param frame
     */
    MovieClip.prototype.setTotalFrames = function (frame)
    {
        this._totalframes = frame;
        this._framesloaded = frame;
    };

    /**
     * addLabel
     * @param frame
     * @param name
     */
    MovieClip.prototype.addLabel = function (frame, name)
    {
        if (typeof name !== "string") {
            name += "";
        }
        this.labels[name.toLowerCase()] = frame|0;
    };

    /**
     * @param name
     * @returns {*}
     */
    MovieClip.prototype.getLabel = function (name)
    {
        if (typeof name !== "string") {
            name += "";
        }
        return this.labels[name.toLowerCase()];
    };

    /**
     * @param frame
     * @param obj
     */
    MovieClip.prototype.addSound = function (frame, obj)
    {
        var _this = this;
        if (!(frame in _this.sounds)) {
            _this.sounds[frame] = [];
        }
        _this.sounds[frame].push(obj);
    };

    /**
     * @returns {*}
     */
    MovieClip.prototype.getSounds = function ()
    {
        var _this = this;
        return _this.sounds[_this.getCurrentFrame()];
    };

    /**
     * @param sound
     */
    MovieClip.prototype.startSound = function (sound)
    {
        var _this = this;
        var stage = _this.getStage();
        var soundId = sound.SoundId;
        var tag = stage.getCharacter(soundId);
        if (!tag) {
            return 0;
        }

        var soundInfo = tag.SoundInfo;
        startSound(sound.Audio, soundInfo);
        _this.soundStopFlag = true;
    };

    /**
     * @param frame
     * @returns {*}
     */
    MovieClip.prototype.getTags = function (frame)
    {
        var _this = this;
        var key = frame || _this.getCurrentFrame();
        return _this.container[key] || [];
    };

    /**
     * @param frame
     * @param tags
     */
    MovieClip.prototype.setRemoveTag = function (frame, tags)
    {
        var rTags = this.removeTags;
        rTags[frame] = [];
        var length = tags.length;
        for (var i = 0; i < length; i++) {
            var tag = tags[i];
            rTags[frame][tag.Depth] = 1;
        }
    };

    /**
     * @param frame
     * @returns {*}
     */
    MovieClip.prototype.getRemoveTags = function (frame)
    {
        return this.removeTags[frame];
    };

    /**
     * @param stage
     */
    MovieClip.prototype.remove = function (stage)
    {
        var _this = this;
        var removeTags = _this.getRemoveTags(_this.getCurrentFrame());
        if (removeTags) {
            var myStage = _this.getStage();
            var frame = _this.getCurrentFrame() - 1;
            var tags = _this.getTags(frame);
            for (var idx in tags) {
                if (!tags.hasOwnProperty(idx)) {
                    continue;
                }

                var instanceId = tags[idx];
                var tag = myStage.getInstance(instanceId);
                if (!tag) {
                    continue;
                }

                if (tag instanceof MovieClip) {
                    var depth = tag.getDepth() + 16384;
                    if (!(depth in removeTags)) {
                        continue;
                    }

                    clipEvent.type = "unload";
                    _this.dispatchEvent(clipEvent, stage);
                    tag.reset();
                } else {
                    if (!(idx in removeTags)) {
                        continue;
                    }
                    tag.reset();
                }
            }
        }
    };

    /**
     * resetCheck
     */
    MovieClip.prototype.resetCheck = function ()
    {
        var _this = this;
        var instances = _this.getInstances();
        var stage = _this.getStage();
        for (var id in instances) {
            if (!instances.hasOwnProperty(id)) {
                continue;
            }

            var instance = stage.getInstance(id);
            if (!instance || (!instance.getRatio() && !instance.removeFlag)) {
                continue;
            }
            instance.reset();
        }
    };

    /**
     * resetSwap
     */
    MovieClip.prototype.resetSwap = function ()
    {
        var _this = this;
        var stage = _this.getStage();
        var currentTags = _this.getTags();
        var totalFrames = _this.getTotalFrames() + 1;
        for (var frame = 1; frame < totalFrames; frame++) {
            var tags = _this.getTags(frame);
            var length = tags.length;
            if (length) {
                var resetTags = [];
                for (var depth in tags) {
                    if (!tags.hasOwnProperty(depth)) {
                        continue;
                    }

                    depth |= 0;
                    var tagId = tags[depth];
                    var instance = stage.getInstance(tagId);
                    if (!instance) {
                        delete tags[depth];
                        continue;
                    }

                    if (instance.active) {
                        continue;
                    }

                    if (instance.getLevel() !== depth) {
                        if (!(instance.getLevel() in currentTags)) {
                            instance._depth = null;
                            resetTags[instance.getLevel()] = tagId;
                        }
                        delete tags[depth];
                    }
                }

                length = resetTags.length;
                if (length) {
                    for (var level in resetTags) {
                        if (!resetTags.hasOwnProperty(level)) {
                            continue;
                        }
                        tags[level] = resetTags[level];
                    }
                }
            }
        }
        _this.isSwap = false;
    };

    /**
     * reset
     */
    MovieClip.prototype.reset = function ()
    {
        var _this = this;
        var stage = _this.getStage();
        var instances = _this.getInstances();
        for (var id in instances) {
            if (!instances.hasOwnProperty(id)) {
                continue;
            }
            var instance = stage.getInstance(id);
            if (instance instanceof MovieClip && instance.getDepth() >= 0) {
                instance.removeMovieClip();
                if (instance.getDepth() < 0) {
                    instance.removeFlag = false;
                }
            } else {
                instance.reset();
            }
        }

        var parent = _this.getParent();
        if (parent && _this.getLevel() !== _this.getDepth()+16384) {
            parent.isSwap = true;
        }

        _this.play();
        _this.setCurrentFrame(1);
        _this.clear();
        _this.initParams();
        _this.variables = {};
    };

    /**
     * init
     */
    MovieClip.prototype.initParams = function ()
    {
        var _this = this;
        _this.active = false;
        _this.removeFlag = false;
        _this.isLoad = false;
        _this.isMask = false;
        _this.isAction = true;
        _this.soundStopFlag = false;
        _this._droptarget = null;
        _this._depth = null;
        _this._mask = null;
        _this._matrix = null;
        _this._colorTransform = null;
        _this._filters = null;
        _this._blendMode = null;
        _this.buttonStatus = "up";
        _this.mouseEnabled = true;
        _this.setVisible(true);
        _this.setEnabled(true);
    };

    /**
     * @param stage
     */
    MovieClip.prototype.addTouchEvent = function (stage)
    {
        var _this = this;
        var events = _this.events;
        var moveEventHits = stage.moveEventHits;
        var downEventHits = stage.downEventHits;
        var upEventHits = stage.upEventHits;
        var keyDownEventHits = stage.keyDownEventHits;
        for (var name in events) {
            if (!events.hasOwnProperty(name)) {
                continue;
            }
            var as = events[name];
            switch (name) {
                case "mouseDown":
                    downEventHits[downEventHits.length] = {as: as, mc: _this};
                    break;
                case "mouseMove":
                    moveEventHits[moveEventHits.length] = {as: as, mc: _this};
                    break;
                case "mouseUp":
                    upEventHits[upEventHits.length] = {as: as, mc: _this};
                    break;
                case "keyDown":
                    if (isTouch) {
                        downEventHits[downEventHits.length] = {
                            as: as,
                            mc: _this
                        };
                    } else {
                        keyDownEventHits[keyDownEventHits.length] = {
                            as: as,
                            mc: _this
                        };
                    }
                    break;
                case "keyUp":
                    upEventHits[upEventHits.length] = {as: as, mc: _this};
                    break;
            }
        }

        var variables = _this.variables;
        var onMouseDown = variables.onMouseDown;
        if (onMouseDown) {
            downEventHits[downEventHits.length] = {mc: _this};
        }
        var onMouseMove = variables.onMouseMove;
        if (onMouseMove) {
            moveEventHits[moveEventHits.length] = {mc: _this};
        }
        var onMouseUp = variables.onMouseUp;
        if (onMouseUp) {
            upEventHits[upEventHits.length] = {mc: _this};
        }
    };

    /**
     * @param script
     * @returns {*}
     */
    MovieClip.prototype.createActionScript = function (script)
    {
        return (function (clip, origin)
        {
            var as = new ActionScript([], origin.constantPool, origin.register, origin.initAction);
            as.cache = origin.cache;
            as.scope = clip;
            return function ()
            {
                as.reset();
                as.variables["this"] = this;
                return as.execute(clip);
            };
        })(this, script);
    };

    /**
     * @param script
     * @param parent
     */
    MovieClip.prototype.createActionScript2 = function (script, parent)
    {
        return (function (clip, origin, chain)
        {
            return function ()
            {
                var as = new ActionScript([], origin.constantPool, origin.register, origin.initAction);
                as.parentId = origin.id; // todo
                as.cache = origin.cache;
                as.scope = clip;
                as.parent = (chain) ? chain : null;
                if (as.register.length) {
                    as.initVariable(arguments);
                }
                as.variables["this"] = this;
                return as.execute(clip);
            };
        })(this, script, parent);
    };

    /**
     * addFrameScript
     */
    MovieClip.prototype.addFrameScript = function ()
    {
        var _this = this;
        var args = arguments;
        var length = args.length;
        for (var i = 0; i < length; i++) {
            var frame = args[i++];
            var script = args[i];
            if (typeof frame === "string") {
                frame = _this.getLabel(frame);
            } else {
                frame += 1;
            }

            frame = frame|0;
            if (frame > 0 && _this.getTotalFrames() >= frame) {
                var actions = _this.actions;
                if (!(frame in actions)) {
                    actions[frame] = [];
                }

                if (script === null) {
                    actions[frame] = [];
                } else {
                    var aLen = actions[frame].length;
                    actions[frame][aLen] = script;
                }
            }
        }
    };

    /**
     * @param stage
     */
    MovieClip.prototype.addActions = function (stage)
    {
        var _this = this;
        _this.active = true;
        var myStage = _this.getStage();

        if (_this.isAction) {
            _this.isAction = false;
            if (!_this.isLoad) {
                // as3
                _this.buildAVM2();

                // registerClass
                var RegClass = myStage.registerClass[_this.getCharacterId()];
                if (typeof RegClass === "function") {
                    _this.variables.registerClass = new RegClass();
                }

                // clipEvent
                clipEvent.type = "initialize";
                _this.dispatchEvent(clipEvent, stage);
                clipEvent.type = "construct";
                _this.dispatchEvent(clipEvent, stage);
                clipEvent.type = "load";
                _this.dispatchEvent(clipEvent, stage);

                var onLoad = _this.variables.onLoad;
                if (typeof onLoad === "function") {
                    _this.setActionQueue(onLoad, stage);
                }
                _this.addTouchEvent(stage);
            }

            var action = _this.getActions(_this.getCurrentFrame());
            if (action) {
                _this.setActionQueue(action, stage);
            }
        }

        var tags = _this.getTags();
        var length = tags.length;
        if (length) {
            for (var depth in tags) {
                if (!tags.hasOwnProperty(depth)) {
                    continue;
                }
                var instanceId = tags[depth];
                var instance = myStage.getInstance(instanceId);
                if (!instance) {
                    continue;
                }
                instance.addActions(stage);
            }
        }
    };

    /**
     * @param frame
     * @returns {*}
     */
    MovieClip.prototype.getActions = function (frame)
    {
        return this.actions[frame];
    };

    /**
     * @param frame
     * @param actionScript
     */
    MovieClip.prototype.setActions = function (frame, actionScript)
    {
        var _this = this;
        var actions = _this.actions;
        if (!(frame in actions)) {
            actions[frame] = [];
        }
        var length = actions[frame].length;
        actions[frame][length] = _this.createActionScript(actionScript);
    };

    /**
     * @param frame
     * @param action
     */
    MovieClip.prototype.overWriteAction = function (frame, action)
    {
        var _this = this;
        if (typeof frame === "string") {
            frame = _this.getLabel(frame);
        }
        frame = frame|0;
        if (frame > 0 && _this.getTotalFrames() >= frame) {
            _this.actions[frame] = [action];
        }
    };

    /**
     * @param frame
     * @param action
     */
    MovieClip.prototype.addAction = function (frame, action)
    {
        var _this = this;
        if (typeof frame === "string") {
            frame = _this.getLabel(frame);
        }
        frame = frame|0;
        if (frame > 0 && _this.getTotalFrames() >= frame) {
            var actions = _this.actions;
            if (!(frame in actions)) {
                actions[frame] = [];
            }
            var length = actions[frame].length;
            actions[frame][length] = action;
        }
    };

    /**
     * @param frame
     */
    MovieClip.prototype.executeActions = function (frame)
    {
        var _this = this;
        var actions = _this.getActions(frame);
        if (actions !== undefined) {
            var length = actions.length;
            for (var i = 0; i < length; i++) {
                actions[i].apply(_this);
            }
        }
    };

    /**
     * ASSetPropFlags
     */
    MovieClip.prototype.ASSetPropFlags = function ()
    {
        // object, properties, n, allowFalse
    };

    /**
     * @param rgb
     * @param alpha
     */
    MovieClip.prototype.beginFill = function (rgb, alpha)
    {
        var graphics = this.getGraphics();
        graphics.beginFill(rgb, alpha);
    };

    /**
     * @param width
     * @param rgb
     * @param alpha
     * @param pixelHinting
     * @param noScale
     * @param capsStyle
     * @param jointStyle
     * @param miterLimit
     */
    MovieClip.prototype.lineStyle = function (width, rgb, alpha, pixelHinting, noScale, capsStyle, jointStyle, miterLimit)
    {
        var graphics = this.getGraphics();
        graphics.lineStyle(width, rgb, alpha, pixelHinting, noScale, capsStyle, jointStyle, miterLimit);
    };

    /**
     * @param dx
     * @param dy
     */
    MovieClip.prototype.moveTo = function (dx, dy)
    {
        var graphics = this.getGraphics();
        graphics.moveTo(dx, dy);
    };

    /**
     * @param dx
     * @param dy
     */
    MovieClip.prototype.lineTo = function (dx, dy)
    {
        var graphics = this.getGraphics();
        graphics.lineTo(dx, dy);
    };

    /**
     * @param cx
     * @param cy
     * @param dx
     * @param dy
     */
    MovieClip.prototype.curveTo = function (cx, cy, dx, dy)
    {
        var graphics = this.getGraphics();
        graphics.curveTo(cx, cy, dx, dy);
    };

    /**
     * clear
     */
    MovieClip.prototype.clear = function ()
    {
        var graphics = this.getGraphics();
        graphics.clear();
    };

    /**
     * endFill
     */
    MovieClip.prototype.endFill = function ()
    {
        var graphics = this.getGraphics();
        graphics.endFill();
    };

    /**
     * buildAVM2
     */
    MovieClip.prototype.buildAVM2 = function ()
    {
        var _this = this;
        var stage = _this.getStage();
        var symbol = stage.symbols[_this.getCharacterId()];
        if (symbol) {
            var symbols = symbol.split(".");
            var classMethod = symbols.pop();
            var length = symbols.length;
            var classObj = stage.avm2;
            var abcObj = stage.abc;
            for (var i = 0; i < length; i++) {
                classObj = classObj[symbols[i]];
                abcObj = abcObj[symbols[i]];
            }

            // build abc
            var DoABC = abcObj[classMethod];
            var ABCObj = new DoABC(_this);
            classObj[classMethod] = ABCObj;
            _this.avm2 = ABCObj;
            // AVM2 init
            var AVM2 = ABCObj[classMethod];
            if (typeof AVM2 === "function") {
                _this.actions = [];
                AVM2.apply(_this);
            }
        }
    };

    /**
     * @constructor
     */
    var MovieClipLoader = function ()
    {
        var _this = this;
        _this.events = {
            onLoadStart: undefined,
            onLoadProgress: undefined,
            onLoadComplete: undefined,
            onLoadInit: undefined,
            onLoadError: undefined
        };
    };

    /**
     * @param url
     * @param target
     * @returns {boolean}
     */
    MovieClipLoader.prototype.loadClip = function (url, target)
    {
        if (!url || !target) {
            return false;
        }

        var _this = this;
        var events = _this.events;

        var xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.open("GET", url, true);

        if (isXHR2) {
            xmlHttpRequest.responseType = "arraybuffer";
        } else {
            xmlHttpRequest.overrideMimeType("text/plain; charset=x-user-defined");
        }

        var onLoadProgress = events.onLoadProgress;
        if (!onLoadProgress) {
            onLoadProgress = _this.onLoadProgress;
        }
        if (typeof onLoadProgress === "function") {
            xmlHttpRequest.onprogress = function (e) {
                onLoadProgress.apply(_this, [target, e.loaded, e.total]);
            };
        }

        var onLoadComplete = events.onLoadComplete;
        if (!onLoadComplete) {
            onLoadComplete = _this.onLoadComplete;
        }
        if (typeof onLoadComplete === "function") {
            xmlHttpRequest.onloadend = function (e) {
                var eventStatus = e.currentTarget.status;
                if (eventStatus === 200) {
                    onLoadComplete.apply(_this, [target, eventStatus]);
                }
            };
        }

        xmlHttpRequest.onreadystatechange = function ()
        {
            var readyState = xmlHttpRequest.readyState;
            if (readyState === 4) {
                var status = xmlHttpRequest.status;

                var onLoadStart = events.onLoadStart;
                if (!onLoadStart) {
                    onLoadStart = _this.onLoadStart;
                }
                if (typeof onLoadStart === "function") {
                    xmlHttpRequest.onloadstart = function ()
                    {
                        onLoadStart.apply(_this, [target]);
                    };
                }

                switch (status) {
                    case 200:
                    case 304:
                        var _root = target.getDisplayObject("_root");
                        var rootStage = _root.getStage();
                        var data = isXHR2 ? xmlHttpRequest.response : xmlHttpRequest.responseText;

                        var loadStage = new Stage();
                        loadStages[loadStage.getId()] = loadStage;
                        target._url = url;
                        target.reset();
                        target.setLoadStage(loadStage);

                        loadStage.setParent(target);
                        loadStage.parse(data, url);
                        loadStage.stop();

                        // onLoadInit
                        var onLoadInit = events.onLoadInit;
                        if (!onLoadInit) {
                            onLoadInit = _this.onLoadInit;
                        }
                        if (typeof onLoadInit === "function") {
                            var queue = (function (as, loader, mc) {
                                return function () {
                                    return as.apply(loader, [mc]);
                                };
                            })(onLoadInit, _this, target);
                            target.events.load = [queue];
                        }

                        target.addActions(rootStage);

                        break;
                    default:
                        var onLoadError = events.onLoadError;
                        if (!onLoadError) {
                            onLoadError = _this.onLoadError;
                        }
                        if (typeof onLoadError === "function") {
                            onLoadError.apply(_this, [target, "error", status]);
                        }
                        break;
                }
            }
        };
        xmlHttpRequest.send(null);

        return true;
    };

    /**
     * @param listener
     * @returns {boolean}
     */
    MovieClipLoader.prototype.addListener = function (listener)
    {
        var _this = this;
        if (listener && typeof listener === "object") {
            var events = ["onLoadStart", "onLoadProgress", "onLoadComplete", "onLoadInit", "onLoadError"];
            var variables = listener.variables;
            for (var i = 0; i < 5; i++) {
                var event = events[i];
                if (typeof listener[event] === "function") {
                    _this.events[event] = listener[event];
                } else if (variables && typeof variables[event] === "function") {
                    _this.events[event] = variables[event];
                }
            }
        }
        return true;
    };

    /**
     * @param listener
     * @returns {boolean}
     */
    MovieClipLoader.prototype.removeListener = function (listener)
    {
        var _this = this;
        if (listener && typeof listener === "object") {
            var events = ["onLoadStart", "onLoadProgress", "onLoadComplete", "onLoadInit", "onLoadError"];
            for (var i = 0; i < 5; i++) {
                var event = events[i];
                var variables = listener.variables;
                if (typeof listener[event] === "function" ||
                    (variables && typeof variables[event] === "function")
                ) {
                    _this.events[event] = undefined;
                }
            }
        }
        return true;
    };

    /**
     * @param target
     * @returns {{bytesLoaded: number, bytesTotal: number}}
     */
    MovieClipLoader.prototype.getProgress = function (target)
    {
        return {
            bytesLoaded: 0,
            bytesTotal: 0
        };
    };

    /**
     * @constructor
     */
    var LoadVars = function ()
    {
        var _this = this;
        _this.xmlHttpRequest = new XMLHttpRequest();
        _this.variables = {};
        _this.target = _this;
        _this.events = {
            onData: undefined,
            onLoad: undefined
        };
    };

    /**
     * properties
     */
    Object.defineProperties(LoadVars.prototype,
    {
        onData: {
            get: function () {
                return this.getProperty("onData");
            },
            set: function (onData) {
                this.setProperty("onData", onData);
            }
        },
        onLoad: {
            get: function () {
                return this.getProperty("onLoad");
            },
            set: function (onLoad) {
                this.setProperty("onLoad", onLoad);
            }
        }
    });

    /**
     * @param name
     * @returns {*}
     */
    LoadVars.prototype.getProperty = function (name)
    {
        return this.variables[name];
    };

    /**
     * @param name
     * @param value
     */
    LoadVars.prototype.setProperty = function (name, value)
    {
        this.variables[String(name)] = value;
    };

    /**
     * @param url
     * @returns {boolean}
     */
    LoadVars.prototype.load = function (url)
    {
        var _this = this;
        var xmlHttpRequest = _this.xmlHttpRequest;
        xmlHttpRequest.open("GET", url, true);
        xmlHttpRequest.onreadystatechange = function ()
        {
            var readyState = xmlHttpRequest.readyState;
            if (readyState === 4) {
                var src = decodeURIComponent(xmlHttpRequest.responseText);
                _this.decode(src);
                var onData = _this.onData;
                if (typeof onData === "function") {
                    onData.apply(src, [src]);
                }

                var onLoad;
                var status = xmlHttpRequest.status;
                switch (status) {
                    case 200:
                    case 304:
                        onLoad = _this.onLoad;
                        if (typeof onLoad === "function") {
                            onLoad.apply(src, [true]);
                        }
                        return true;
                    default:
                        onLoad = _this.onLoad;
                        if (typeof onLoad === "function") {
                            onLoad.apply(src, [false]);
                        }
                        return false;
                }
            }
        };
        xmlHttpRequest.send(null);
    };

    /**
     * @param url
     * @param target
     * @param method
     * @returns {boolean}
     */
    LoadVars.prototype.send = function (url, target, method)
    {
        var _this = this;
        var xmlHttpRequest = _this.xmlHttpRequest;
        var sendMethod = method ? method.toUpperCase() : "GET";
        xmlHttpRequest.open(sendMethod, url, true);
        if (sendMethod === "POST") {
            xmlHttpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        }
        if (target instanceof LoadVars) {
            _this.target = target;
        }
        xmlHttpRequest.send(_this.toString());
        return true;
    };

    /**
     * @param url
     * @param target
     * @param method
     * @returns {boolean}
     */
    LoadVars.prototype.sendAndLoad = function (url, target, method)
    {
        var _this = this;
        _this.send(url, target, method);
        return _this.load(url);
    };

    /**
     * @param header
     * @param headerValue
     */
    LoadVars.prototype.addRequestHeader = function (header, headerValue)
    {
        var xmlHttpRequest = this.xmlHttpRequest;
        if (header instanceof Array) {
            var length = header.length;
            for (var i = 0; i < length;) {
                xmlHttpRequest.setRequestHeader(header[i++], headerValue[i++]);
            }
        } else {
            xmlHttpRequest.setRequestHeader(header, headerValue);
        }
    };

    /**
     * @param queryString
     */
    LoadVars.prototype.decode = function (queryString)
    {
        var variables = this.variables;
        var array = queryString.split("&");
        var length = array.length;
        for (var i = 0; i < length; i++) {
            var values = array[i];
            var splitData = values.split("=");
            if (splitData.length < 1) {
                continue;
            }
            variables[String(splitData[0])] = splitData[1];
        }
    };

    /**
     * @returns {number}
     */
    LoadVars.prototype.getBytesLoaded = function ()
    {
        return 1;
    };

    /**
     * @returns {number}
     */
    LoadVars.prototype.getBytesTotal = function ()
    {
        return 1;
    };

    /**
     * @returns {string}
     */
    LoadVars.prototype.toString = function ()
    {
        var variables = this.variables;
        var array = [];
        for (var prop in variables) {
            if (!variables.hasOwnProperty(prop)) {
                continue;
            }
            array[array.length] = prop + "=" + variables[prop];
        }
        return array.join("&");
    };

    /**
     * @constructor
     */
    var Xml = function ()
    {
        var _this = this;
        _this.ignoreWhite = false;
        _this.loaded = false;
        _this.status = 0;
        _this.variables = {};
    };

    /**
     * properties
     */
    Object.defineProperties(Xml.prototype,
    {
        onData: {
            get: function () {
                return this.getProperty("onData");
            },
            set: function (onData) {
                this.setProperty("onData", onData);
            }
        },
        onLoad: {
            get: function () {
                return this.getProperty("onLoad");
            },
            set: function (onLoad) {
                this.setProperty("onLoad", onLoad);
            }
        }
    });

    /**
     * @param name
     * @returns {*}
     */
    Xml.prototype.getProperty = function (name)
    {
        return this.variables[name];
    };

    /**
     * @param name
     * @param value
     */
    Xml.prototype.setProperty = function (name, value)
    {
        this.variables[String(name)] = value;
    };


    /**
     * @param url
     */
    Xml.prototype.load = function (url)
    {
        var _this = this;
        url = "" + url;
        var xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.open("GET", url, true);
        xmlHttpRequest.onreadystatechange = function ()
        {
            var readyState = xmlHttpRequest.readyState;
            if (readyState === 4) {
                var src = xmlHttpRequest.responseXML;
                var onData = _this.onData;
                if (typeof onData === "function") {
                    onData.apply(src, [src]);
                }

                var onLoad;
                var status = xmlHttpRequest.status;
                switch (status) {
                    case 200:
                    case 304:
                        onLoad = _this.onLoad;
                        if (typeof onLoad === "function") {
                            onLoad.apply(src, [true]);
                        }
                        return true;
                    default:
                        onLoad = _this.onLoad;
                        if (typeof onLoad === "function") {
                            onLoad.apply(src, [false]);
                        }
                        return false;
                }
            }
        };
        xmlHttpRequest.send(null);
    };

    /**
     * @param url
     * @param target
     * @param method
     */
    Xml.prototype.send = function (url, target, method)
    {
        var sendMethod = method ? method.toUpperCase() : "GET";
        if (target) {
            console.log(target);
        }
        var xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.open(sendMethod, url, true);
        xmlHttpRequest.send(null);
        return true;
    };

    /**
     * @param url
     * @param resultXML
     */
    Xml.prototype.sendAndLoad = function (url, resultXML)
    {
        var _this = this;
        _this.send(url);
        return _this.load(resultXML);
    };

    /**
     * @constructor
     */
    var Sound = function (target)
    {
        var _this = this;
        _this.target = target;
        _this.variables = {};
        _this.sounds = [];
        _this.volume = 100;
        _this.pan = 0;
        _this.transform = {ll: 100, lr: 100, rl: 100, rr: 100};
        _this.isStreamin = false;
        _this.movieClip = null;
    };

    /**
     * properties
     */
    Object.defineProperties(Sound.prototype,
    {
        onLoad: {
            get: function () {
                return this.getProperty("onLoad");
            },
            set: function (onLoad) {
                this.setProperty("onLoad", onLoad);
            }
        },
        onSoundComplete: {
            get: function () {
                return this.getProperty("onSoundComplete");
            },
            set: function (onSoundComplete) {
                this.setProperty("onSoundComplete", onSoundComplete);
            }
        }
    });

    /**
     * @param name
     * @returns {*}
     */
    Sound.prototype.getProperty = function (name)
    {
        return this.variables[name];
    };

    /**
     * @param name
     * @param value
     */
    Sound.prototype.setProperty = function (name, value)
    {
        this.variables[String(name)] = value;
    };

    /**
     * @param currentTime
     * @param loopCount
     */
    Sound.prototype.start = function (currentTime, loopCount)
    {
        var _this = this;
        var sounds = _this.sounds;

        var init = function (audio, time)
        {
            return function ()
            {
                audio.currentTime = time;
            };
        };

        var end = function (audio, sound)
        {
            return function ()
            {
                var volume = sound.volume;
                audio.loopCount--;
                if (audio.loopCount > 0) {
                    audio.volume = volume / 100;
                    audio.currentTime = 0;
                    audio.play();
                }

                var onSoundComplete = sound.onSoundComplete;
                if (onSoundComplete) {
                    onSoundComplete.apply(sound, [true]);
                }
            };
        };

        var audio;
        for (var id in sounds) {
            if (!sounds.hasOwnProperty(id)) {
                continue;
            }
            audio = sounds[id];
            audio.load();

            if (currentTime) {
                audio.addEventListener("canplay", init(audio, currentTime));
            }
            if (typeof loopCount === "number" && loopCount > 0) {
                audio.loopCount = loopCount;
                audio.addEventListener("ended", end(audio, _this));
            }

            audio.play();
        }
    };

    /**
     * stop
     */
    Sound.prototype.stop = function (id)
    {
        var sounds = this.sounds;
        var audio;
        if (id) {
            audio = sounds[id];
            if (audio) {
                audio.pause();
            }
        } else {
            for (var key in sounds) {
                if (!sounds.hasOwnProperty(key)) {
                    continue;
                }
                audio = sounds[key];
                audio.pause();
            }
        }
    };

    /**
     * @param url
     * @param bool
     */
    Sound.prototype.loadSound = function (url, bool)
    {
        var _this = this;
        _this.isStreamin = bool;

        var sounds = _this.sounds;
        var audio = _document.createElement("audio");
        audio.src = url;
        sounds[0] = audio;

        var onLoad = (function (audio, sound)
        {
            return function() {
                audio.load();
                audio.preload = "auto";
                audio.autoplay = false;
                audio.loop = false;
                var onLoad = sound.onLoad;
                if (typeof onLoad === "function") {
                    onLoad.apply(sound, [true]);
                }
            };
        })(audio, _this);
        audio.addEventListener("canplaythrough", onLoad);

        var onError = (function (audio, sound)
        {
            return function() {
                var onLoad = sound.onLoad;
                if (typeof onLoad === "function") {
                    onLoad.apply(sound, [false]);
                }
            };
        })(audio, _this);
        audio.addEventListener("error", onError);
    };

    /**
     * @param id
     */
    Sound.prototype.attachSound = function (id)
    {
        var _this = this;
        var sounds = [];
        var movieClip = _this.movieClip;
        var stage = movieClip.getStage();
        var exportAssets = stage.exportAssets;
        if (id in exportAssets) {
            var characterId = exportAssets[id];
            var tag = stage.sounds[characterId];
            if (tag) {
                var audio = _document.createElement("audio");
                audio.onload = function ()
                {
                    this.load();
                    this.preload = "auto";
                    this.autoplay = false;
                    this.loop = false;
                };
                audio.src = tag.base64;
                sounds[id] = audio;
            }
        }

        _this.sounds = sounds;
    };

    /**
     *
     * @returns {number}
     */
    Sound.prototype.getVolume = function ()
    {
        return this.volume;
    };

    /**
     *
     * @param volume
     */
    Sound.prototype.setVolume = function (volume)
    {
        var _this = this;
        var sounds = _this.sounds;
        _this.volume = volume;
        for (var id in sounds) {
            if (!sounds.hasOwnProperty(id)) {
                continue;
            }
            var audio = sounds[id];
            audio.volume = _max(0, _min(1, volume / 100));
        }
    };

    /**
     * @returns {number|*}
     */
    Sound.prototype.getPan = function ()
    {
        return this.pan;
    };

    /**
     * @param pan
     */
    Sound.prototype.setPan = function (pan)
    {
        this.pan = pan;
    };

    /**
     * @param object
     */
    Sound.prototype.setTransform = function (object)
    {
        var transform = this.transform;
        for (var name in object) {
            if (!object.hasOwnProperty(name)) {
                continue;
            }
            switch (name) {
                case "ll":
                case "lr":
                case "rl":
                case "rr":
                    transform[name] = object[name];
                    break;
            }
        }
    };

    /**
     * @returns {{ll: number, lr: number, rl: number, rr: number}|*}
     */
    Sound.prototype.getTransform = function ()
    {
        return this.transform;
    };

    /**
     * @returns {number}
     */
    Sound.prototype.getBytesLoaded = function ()
    {
        return 1;
    };

    /**
     * @returns {number}
     */
    Sound.prototype.getBytesTotal = function ()
    {
        return 1;
    };

    /**
     * @constructor
     */
    var SharedObject = function ()
    {
        var _this = this;
        _this.data = null;
        _this.name = null;
    };

    /**
     * @param name
     * @returns {SharedObject}
     */
    SharedObject.prototype.getLocal = function (name)
    {
        var _this = this;
        _this.name = name;
        var data = window.localStorage.getItem(name);
        if (!data) {
            data = {};
        } else {
            data = JSON.parse(data);
        }
        _this.data = data;
        return _this;
    };

    /**
     * flush
     */
    SharedObject.prototype.flush = function ()
    {
        var _this = this;
        window.localStorage.setItem(_this.name, JSON.stringify(_this.data));
        return true;
    };

    /**
     * @param mc
     * @constructor
     */
    var Color = function (mc)
    {
        var _this = this;
        _this.movieClip = mc;
        _this.variables = {};
    };

    /**
     *
     * @param name
     * @returns {*}
     */
    Color.prototype.getProperty = function (name)
    {
        return this.variables[name];
    };

    /**
     * @param name
     * @param value
     */
    Color.prototype.setProperty = function (name, value)
    {
        this.variables[String(name)] = value;
    };

    /**
     * @param int
     * @param alpha
     * @returns {{R: number, G: number, B: number, A: number}}
     */
    Color.prototype.intToRGBA = function (int, alpha)
    {
        alpha = alpha || 100;
        return {
            R: (int & 0xff0000) >> 16,
            G: (int & 0x00ff00) >> 8,
            B: (int & 0x0000ff),
            A: (alpha / 100)
        };
    };

    /**
     * @param offset
     */
    Color.prototype.setRGB = function (offset)
    {
        var _this = this;
        var mc = _this.movieClip;
        if (mc instanceof MovieClip) {
            offset |= 0;
            var obj = _this.intToRGBA(offset);
            var colorTransform = mc.getOriginColorTransform();
            if (colorTransform) {
                var transform = [obj.R, obj.G, obj.B, obj.A * 255, 0, 0, 0, 0];
                var multiColor = mc.cloneArray(transform);
                var color = mc.multiplicationColor(colorTransform, multiColor);
                mc.setColorTransform(color);
            }
        }
    };

    /**
     * @returns {*[]|*}
     */
    Color.prototype.getTransform = function ()
    {
        var _this = this;
        var mc = _this.movieClip;
        if (mc instanceof MovieClip) {
            return mc.getColorTransform();
        }
        return undefined;
    };

    /**
     * @param obj
     */
    Color.prototype.setTransform = function (obj)
    {
        var _this = this;
        var mc = _this.movieClip;
        if (mc instanceof MovieClip) {
            var colorTransform = mc.getOriginColorTransform();
            var transform = [
                obj.rb, obj.gb, obj.bb, obj.ab,
                obj.ra, obj.ga, obj.ba, obj.aa
            ];
            var multiColor = mc.cloneArray(transform);
            var color = mc.multiplicationColor(colorTransform, multiColor);
            mc.setColorTransform(color);
        }
    };

    /**
     * @constructor
     */
    var Mouse = function ()
    {
        this.events = {};
    };

    /**
     * @returns {undefined}
     */
    Mouse.prototype.show = function ()
    {
        return undefined;
    };

    /**
     * @returns {undefined}
     */
    Mouse.prototype.hide = function ()
    {
        return undefined;
    };

    /**
     * @param listener
     */
    Mouse.prototype.addListener = function (listener)
    {
        var _this = this;
        if (listener && typeof listener === "object") {
            var events = ["onMouseDown", "onMouseMove", "onMouseUp"];
            var variables = listener.variables;
            for (var i = 0; i < 5; i++) {
                var event = events[i];
                if (typeof listener[event] === "function") {
                    _this.events[event] = listener[event];
                } else if (variables && typeof variables[event] === "function") {
                    _this.events[event] = variables[event];
                }
            }
        }
        return true;
    };

    /**
     * @param listener
     */
    Mouse.prototype.removeListener = function (listener)
    {
        var _this = this;
        if (listener && typeof listener === "object") {
            var events = ["onMouseDown", "onMouseMove", "onMouseUp"];
            for (var i = 0; i < 5; i++) {
                var event = events[i];
                var variables = listener.variables;
                if (typeof listener[event] === "function" ||
                    (variables && typeof variables[event] === "function")
                ) {
                    _this.events[event] = undefined;
                }
            }
        }
        return true;
    };

    /**
     * @constructor
     */
    var Key = function ()
    {
        var _this = this;
        _this.variables = {};
        _this.codes = [];
        _this._listeners = [];
    };

    /**
     * properties
     */
    Object.defineProperties(Key.prototype,
    {
        onKeyDown: {
            get: function () {
                return this.getProperty("onKeyDown");
            },
            set: function (onKeyDown) {
                this.setProperty("onKeyDown", onKeyDown);
            }
        },
        onKeyUp: {
            get: function () {
                return this.getProperty("onKeyUp");
            },
            set: function (onKeyUp) {
                this.setProperty("onKeyUp", onKeyUp);
            }
        }
    });

    /**
     * @type {number}
     */
    Key.prototype.BACKSPACE = 8;
    Key.prototype.CAPSLOCK = 20;
    Key.prototype.CONTROL = 17;
    Key.prototype.DELETEKEY = 46;
    Key.prototype.DOWN = 40;
    Key.prototype.END = 35;
    Key.prototype.ENTER = 13;
    Key.prototype.ESCAPE = 27;
    Key.prototype.HOME = 36;
    Key.prototype.INSERT = 45;
    Key.prototype.LEFT = 37;
    Key.prototype.PGDN = 34;
    Key.prototype.PGDN = 34;
    Key.prototype.PGUP = 33;
    Key.prototype.RIGHT = 39;
    Key.prototype.SHIFT = 16;
    Key.prototype.SPACE = 32;
    Key.prototype.TAB = 9;
    Key.prototype.UP = 38;
    Key.prototype.codes = [];

    /**
     * @param name
     * @returns {*}
     */
    Key.prototype.getProperty = function (name)
    {
        return this.variables[name];
    };

    /**
     * @param name
     * @param value
     */
    Key.prototype.setProperty = function (name, value)
    {
        this.variables[String(name)] = value;
    };

    /**
     *
     * @param listener
     * @returns {boolean}
     */
    Key.prototype.addListener = function (listener)
    {
        var _this = this;
        var onKeyDown = listener.onKeyDown;
        if (onKeyDown) {
            _this.onKeyDown = onKeyDown;
        }
        var onKeyUp = listener.onKeyUp;
        if (onKeyUp) {
            _this.onKeyUp = onKeyUp;
        }
        return true;
    };

    /**
     * @param code
     * @returns {boolean}
     */
    Key.prototype.isDown = function (code)
    {
        var codes = keyClass.codes;
        for (var idx = 0; idx < codes.length; ++idx) {
            if (codes[idx] !== code) {
                continue;
            }
            if (_keyEvent) {
                _keyEvent.preventDefault();
            }
            return true;
        }
    };

    /**
     * @returns {*}
     */
    Key.prototype.getCode = function ()
    {
        var keyCode = (_keyEvent) ? _keyEvent.keyCode : null;
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
        return keyCode;
    };
    var keyClass = new Key();

    /**
     * @param event
     */
    function keyUpAction(event)
    {
        _keyEvent = event;
        var onKeyUp = keyClass.onKeyUp;
        if (typeof onKeyUp === "function") {
            onKeyUp.apply(keyClass, [event]);
        }

        var keyCode = keyClass.getCode();
        var index = keyClass.codes.indexOf(keyCode);
        if (index > -1) {
            keyClass.codes.splice(index, 1);
        }
    }

    /**
     * @param event
     */
    function keyDownAction(event)
    {
        _keyEvent = event;
        var keyCode = keyClass.getCode();
        if (keyClass.codes.indexOf(keyCode) === -1) {
            keyClass.codes.push(keyCode);
        }

        var keyHit = false;
        var i;
        var length;
        var obj;
        var onKeyDown = keyClass.onKeyDown;
        if (typeof onKeyDown === "function") {
            keyHit = true;
            onKeyDown.apply(keyClass, [event]);
        }

        var idx;
        length = stages.length;
        for (var pIdx = 0; pIdx < length; pIdx++) {
            if (!(pIdx in stages)) {
                continue;
            }

            var stage = stages[pIdx];
            var keyDownEventHits = stage.keyDownEventHits;
            var kLen = keyDownEventHits.length;
            if (kLen) {
                keyHit = true;
                for (idx = 0; idx < kLen; idx++) {
                    obj = keyDownEventHits[idx];
                    stage.executeEventAction(obj.as, obj.mc);
                }
            }

            var buttonHits = stage.buttonHits;
            var len = buttonHits.length;
            var isEnd = false;
            for (i = len; i--;) {
                if (!(i in buttonHits)) {
                    continue;
                }

                var hitObj = buttonHits[i];
                if (!hitObj) {
                    continue;
                }

                var button = hitObj.button;
                if (!button) {
                    continue;
                }

                var actions = button.getActions();
                if (!actions) {
                    continue;
                }

                var aLen = actions.length;
                for (idx = 0; idx < aLen; idx++) {
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

                    if (CondKeyPress !== keyCode) {
                        continue;
                    }

                    stage.buttonAction(hitObj.parent, cond.ActionScript);
                    stage.touchRender();
                    isEnd = true;
                    keyHit = true;
                    break;
                }

                if (isEnd) {
                    keyHit = true;
                    break;
                }
            }
        }

        if (keyHit || typeof onKeyDown === "function") {
            event.preventDefault();
            return false;
        }
    }

    /**
     * @constructor
     */
    var Global = function ()
    {
        this.variables = {};
    };

    /**
     *
     * @param name
     * @returns {*}
     */
    Global.prototype.getVariable = function (name)
    {
        return this.variables[name];
    };

    /**
     * @param name
     * @param value
     * @returns {*}
     */
    Global.prototype.setVariable = function (name, value)
    {
        this.variables[name] = value;
    };

    /**
     * @param name
     * @returns {*}
     */
    Global.prototype.getProperty = function (name)
    {
        return this.variables[name];
    };

    /**
     * @param name
     * @param value
     */
    Global.prototype.setProperty = function (name, value)
    {
        this.variables[name] = value;
    };

    /**
     * @constructor
     * @param stage
     */
    var packages = function (stage)
    {
        this.stage = stage;

    };

    /**
     * @type {*}
     */
    packages.prototype =
    {
        "flash": {
            "display": {
                "MovieClip": MovieClip,
                "Sprite": Sprite,
                "DisplayObjectContainer": DisplayObjectContainer,
                "InteractiveObject": InteractiveObject,
                "DisplayObject": DisplayObject,
                "Graphics": Graphics
            },
            "events": {
                "EventDispatcher": EventDispatcher,
                "MouseEvent": clipEvent
            },
            "text": {
                "StaticText": StaticText
            },
            "media": {
                "Sound": Sound
            },
            "system": {
                "fscommand": function ()
                {
                    var command = arguments[0];
                    var args = arguments[1];
                    if (args === undefined) {
                        args = "";
                    }

                    switch (command) {
                        case "quit":
                        case "fullscreen":
                        case "allowscale":
                        case "showmenu":
                        case "exec":
                        case "trapallkeys":
                            break;
                        default:
                            if (command) {
                                var _this = this;
                                var method = (_this.tagId) ? _this.tagId : _this.getName();
                                var body = method +"_DoFSCommand(command, args);";
                                var fscommand = new Func("command", "args", body);
                                fscommand(command, args);
                            }
                            break;
                    }

                    return true;
                }
            }
        }
    };

    /**
     * @constructor
     */
    var Stage = function ()
    {
        var _this = this;
        _this.id = stageId++;
        _this.name = "swf2js_" + _this.id;
        _this.intervalId = 0;

        _this.frameRate = 0;
        _this.fileSize = 0;
        _this.stopFlag = true;

        // options
        _this.optionWidth = 0;
        _this.optionHeight = 0;
        _this.callback = null;
        _this.renderMode = isWebGL;
        _this.tagId = null;
        _this.FlashVars = {};
        _this.quality = "medium"; // low = 0.25, medium = 0.8, high = 1.0
        _this.bgcolor = null;

        // event
        _this.mouse = new Mouse();

        // params
        _this.context = null;
        _this.canvas = null;
        _this.preContext = null;
        _this.hitContext = null;
        _this.matrix = [1,0,0,1,0,0];
        _this._matrix = [1,0,0,1,0,0];
        _this._colorTransform = [1,1,1,1,0,0,0,0];
        _this.characters = [];
        _this.initActions = [];
        _this.exportAssets = [];
        _this.packages = [];
        _this.registerClass = [];
        _this.buttonHits = [];
        _this.downEventHits = [];
        _this.moveEventHits = [];
        _this.upEventHits = [];
        _this.keyDownEventHits = [];
        _this.keyUpEventHits = [];
        _this.sounds = [];
        _this.loadSounds = [];
        _this.videos = [];
        _this.actions = [];
        _this.instances = [];
        _this.placeObjects = [];
        _this.fonts = [];
        _this.isAction = true;
        _this._global = new Global();
        _this.touchObj = null;
        _this.touchStatus = "up";
        _this.overObj = null;
        _this.touchEndAction = null;
        _this.imgUnLoadCount = 0;
        _this.scale = 1;
        _this.baseWidth = 0;
        _this.baseHeight = 0;
        _this.width = 0;
        _this.height = 0;
        _this.isHit = false;
        _this.isTouchEvent = false;
        _this.isLoad = false;
        _this.jpegTables = null;
        _this.backgroundColor = "transparent";
        _this.version = 8;
        _this.loadStatus = 0;
        _this.isClipDepth = false;
        _this.clipDepth = 0;
        _this.clipMc = false;
        _this.dragMc = null;
        _this.dragRules = null;
        _this.scaleMode = "showAll";
        _this.align = "";
        _this.avm2 = new packages(_this);
        _this.abc = new packages(_this);
        _this.symbols = [];
        _this.abcFlag = false;

        // render
        _this.doneTags = [];
        _this.newTags = [];

        // init
        var mc = new MovieClip();
        mc.setStage(_this);
        _this.setParent(mc);
    };

    /**
     * @returns {number|*}
     */
    Stage.prototype.getId = function ()
    {
        return this.id;
    };

    /**
     * @param id
     */
    Stage.prototype.setId = function (id)
    {
        this.id = id;
    };

    /**
     * @returns {*}
     */
    Stage.prototype.getParent = function ()
    {
        return this.parent;
    };

    /**
     * @param parent
     */
    Stage.prototype.setParent = function (parent)
    {
        this.parent = parent;
    };

    /**
     * @returns {number|*}
     */
    Stage.prototype.getVersion = function ()
    {
        return this.version;
    };

    /**
     * @param version
     */
    Stage.prototype.setVersion = function (version)
    {
        this.version = version;
    };

    /**
     *
     * @returns {string}
     */
    Stage.prototype.getBackgroundColor = function ()
    {
        return this.backgroundColor;
    };

    /**
     * @param r
     * @param g
     * @param b
     */
    Stage.prototype.setBackgroundColor = function (r, g, b)
    {
        this.backgroundColor = "rgb(" + r + "," + g + "," + b + ")";
    };

    /**
     * @returns {Array}
     */
    Stage.prototype.getGlobal = function ()
    {
        return this._global;
    };

    /**
     * play
     */
    Stage.prototype.play = function ()
    {
        var _this = this;
        _this.stopFlag = false;

        var enterFrame = function (stage) {
            return function () {
                requestAnimationFrame(function () {
                    if (stage.isLoad && !stage.stopFlag) {
                        stage.nextFrame();
                    }
                }, 0);
            };
        };
        _this.intervalId = _setInterval(enterFrame(_this), _this.getFrameRate());
    };

    /**
     * stop
     */
    Stage.prototype.stop = function ()
    {
        var _this = this;
        _this.stopFlag = true;
        _clearInterval(_this.intervalId);
    };

    /**
     * @returns {*}
     */
    Stage.prototype.getName = function ()
    {
        return this.name;
    };

    /**
     * @param name
     */
    Stage.prototype.setName = function (name)
    {
        this.name = name;
    };

    /**
     * @param options
     */
    Stage.prototype.setOptions = function (options)
    {
        if (options !== undefined) {
            var _this = this;
            _this.optionWidth = options.width || _this.optionWidth;
            _this.optionHeight = options.height || _this.optionHeight;
            _this.callback = options.callback || _this.callback;
            _this.tagId = options.tagId || _this.tagId;
            _this.renderMode = options.renderMode || _this.renderMode;
            _this.FlashVars = options.FlashVars || _this.FlashVars;
            _this.quality = options.quality || _this.quality;
            _this.bgcolor = options.bgcolor || _this.bgcolor;

            // quality
            switch (_this.quality) {
                case "low":
                    _devicePixelRatio = devicePixelRatio * 0.5;
                    break;
                case "high":
                    _devicePixelRatio = devicePixelRatio;
                    break;
            }
        }
    };

    /**
     * @returns {number}
     */
    Stage.prototype.getBaseWidth = function ()
    {
        return this.baseWidth;
    };

    /**
     * @param baseWidth
     */
    Stage.prototype.setBaseWidth = function (baseWidth)
    {
        this.baseWidth = baseWidth;
    };

    /**
     *
     * @returns {number}
     */
    Stage.prototype.getBaseHeight = function ()
    {
        return this.baseHeight;
    };

    /**
     * @param baseHeight
     */
    Stage.prototype.setBaseHeight = function (baseHeight)
    {
        this.baseHeight = baseHeight;
    };

    /**
     *
     * @returns {number}
     */
    Stage.prototype.getWidth = function ()
    {
        return this.width;
    };

    /**
     * @param width
     */
    Stage.prototype.setWidth = function (width)
    {
        if (width < 0) {
            width *= -1;
        }
        this.width = width;
    };

    /**
     * @returns {number}
     */
    Stage.prototype.getHeight = function ()
    {
        return this.height;
    };

    /**
     * @param height
     */
    Stage.prototype.setHeight = function (height)
    {
        if (height < 0) {
            height *= -1;
        }
        this.height = height;
    };

    /**
     * @returns {number}
     */
    Stage.prototype.getScale = function ()
    {
        return this.scale;
    };

    /**
     * @param scale
     */
    Stage.prototype.setScale = function (scale)
    {
        this.scale = scale;
    };

    /**
     * @returns {*}
     */
    Stage.prototype.getMatrix = function ()
    {
        return this.matrix;
    };

    /**
     * @param matrix
     */
    Stage.prototype.setMatrix = function (matrix)
    {
        this.matrix = matrix;
    };

    /**
     * @param id
     * @returns {*}
     */
    Stage.prototype.getCharacter = function (id)
    {
        return this.characters[id];
    };

    /**
     * @param id
     * @param obj
     */
    Stage.prototype.setCharacter = function (id, obj)
    {
        this.characters[id] = obj;
    };

    /**
     * @param id
     * @returns {*}
     */
    Stage.prototype.getInstance = function (id)
    {
        return this.instances[id];
    };

    /**
     * @param instance
     */
    Stage.prototype.setInstance = function (instance)
    {
        this.instances[instance.instanceId] = instance;
    };

    /**
     * @param instanceId
     * @param depth
     * @param frame
     * @returns {*}
     */
    Stage.prototype.getPlaceObject = function (instanceId, depth, frame)
    {
        var placeObjects = this.placeObjects;
        if (!(instanceId in placeObjects)) {
            return null;
        }
        var placeObject = placeObjects[instanceId];
        if (!(frame in placeObject)) {
            return null;
        }
        var tags = placeObject[frame];
        if (!(depth in tags)) {
            return null;
        }
        return tags[depth];
    };

    /**
     * @param placeObject
     * @param instanceId
     * @param depth
     * @param frame
     */
    Stage.prototype.setPlaceObject = function (placeObject, instanceId, depth, frame)
    {
        var _this = this;
        var placeObjects = _this.placeObjects;
        if (!(instanceId in placeObjects)) {
            placeObjects[instanceId] = [];
        }
        if (!(frame in placeObjects[instanceId])) {
            placeObjects[instanceId][frame] = [];
        }
        placeObjects[instanceId][frame][depth] = placeObject;
    };

    /**
     * @param instanceId
     * @param depth
     * @param frame
     */
    Stage.prototype.copyPlaceObject = function (instanceId, depth, frame)
    {
        var _this = this;
        var placeObject = _this.getPlaceObject(instanceId, depth, frame - 1);
        _this.setPlaceObject(placeObject, instanceId, depth, frame);
    };

    /**
     * @param instanceId
     */
    Stage.prototype.removePlaceObject = function (instanceId)
    {
        delete this.placeObjects[instanceId];
        // delete this.instances[instanceId];
    };

    /**
     * @returns {number}
     */
    Stage.prototype.getFrameRate = function ()
    {
        return this.frameRate;
    };

    /**
     * @param fps
     */
    Stage.prototype.setFrameRate = function (fps)
    {
        this.frameRate = (1000 / fps) | 0;
    };

    /**
     * loadStatus CountUp
     */
    Stage.prototype.loadEvent = function ()
    {
        var _this = this;
        switch (_this.loadStatus) {
            case 2:
                _this.resize();
                _this.loadStatus++;
                break;
            case 3:
                if (!_this.isLoad || !_this.stopFlag || _this.imgUnLoadCount > 0) {
                    break;
                }
                _this.loadStatus++;
                _this.loaded();
                break;
        }
        if (_this.loadStatus !== 4) {
            _setTimeout(function () { _this.loadEvent(); }, 0);
        }
    };

    /**
     * @param data
     * @param url
     */
    Stage.prototype.parse = function (data, url)
    {
        var _this = this;
        _this.isLoad = false;
        var bitio = new BitIO();
        var swftag = new SwfTag(_this, bitio);

        if (isXHR2) {
            bitio.setData(new Uint8Array(data));
        } else {
            bitio.init(data);
        }

        if (_this.setSwfHeader(bitio, swftag)) {
            var mc = _this.getParent();
            mc._url = location.href;

            // parse
            var tags = swftag.parse(mc);

            // mc reset
            mc.container = [];
            var frame = 1;
            var totalFrames = mc.getTotalFrames() + 1;
            while (frame < totalFrames) {
                mc.container[frame++] = [];
            }
            mc.instances = [];

            // build
            swftag.build(tags, mc);

            var query = url.split("?")[1];
            if (query) {
                var values = query.split("&");
                var length = values.length;
                while (length--) {
                    var value = values[length];
                    var pair = value.split("=");
                    if (pair.length > 1) {
                        mc.setVariable(pair[0], pair[1]);
                    }
                }
            }

            // FlashVars
            var vars = _this.FlashVars;
            for (var key in vars) {
                if (!vars.hasOwnProperty(key)) {
                    continue;
                }
                mc.setVariable(key, vars[key]);
            }
        }

        _this.isLoad = true;
    };

    /**
     * @param bitio
     * @param swftag
     * @returns {boolean}
     */
    Stage.prototype.setSwfHeader = function (bitio, swftag)
    {
        var _this = this;

        var data = bitio.data;
        if (data[0] === 0xff && data[1] === 0xd8) {
            _this.parseJPEG(data, swftag);
            return false;
        }

        // signature
        var signature = bitio.getHeaderSignature();

        // version
        var version = bitio.getVersion();
        _this.setVersion(version);

        // file size
        var fileLength = bitio.getUI32();
        _this.fileSize = fileLength;

        switch (signature) {
            case "FWS": // No ZIP
                break;
            case "CWS": // ZLIB
                bitio.deCompress(fileLength, "ZLIB");
                break;
            case "ZWS": // TODO LZMA
                alert("not support LZMA");
                //bitio.deCompress(fileLength, "LZMA");
                return false;
        }

        var bounds = swftag.rect();
        var frameRate = bitio.getUI16() / 0x100;
        bitio.getUI16(); // frameCount

        _this.setBaseWidth(_ceil((bounds.xMax - bounds.xMin) / 20));
        _this.setBaseHeight(_ceil((bounds.yMax - bounds.yMin) / 20));
        _this.setFrameRate(frameRate);

        _this.loadStatus++;

        return true;
    };

    /**
     * @param data
     * @param swftag
     */
    Stage.prototype.parseJPEG = function (data, swftag)
    {
        var _this = this;
        var image = _document.createElement("img");
        image.addEventListener("load", function ()
        {
            var width = this.width;
            var height = this.height;

            var canvas = cacheStore.getCanvas();
            canvas.width = width;
            canvas.height = height;
            var imageContext = canvas.getContext("2d");
            imageContext.drawImage(this, 0, 0, width, height);
            _this.setCharacter(1, imageContext);

            var shapeWidth = width * 20;
            var shapeHeight = height * 20;

            _this.setBaseWidth(width);
            _this.setBaseHeight(height);

            var shape = {
                ShapeRecords: [
                    {
                        FillStyle1: 1,
                        StateFillStyle0: 0,
                        StateFillStyle1: 1,
                        StateLineStyle: 0,
                        StateMoveTo: 0,
                        StateNewStyles: 0,
                        isChange: true
                    },
                    {
                        AnchorX: shapeWidth,
                        AnchorY: 0,
                        ControlX: 0,
                        ControlY: 0,
                        isChange: false,
                        isCurved: false
                    },
                    {
                        AnchorX: shapeWidth,
                        AnchorY: shapeHeight,
                        ControlX: 0,
                        ControlY: 0,
                        isChange: false,
                        isCurved: false
                    },
                    {
                        AnchorX: 0,
                        AnchorY: shapeHeight,
                        ControlX: 0,
                        ControlY: 0,
                        isChange: false,
                        isCurved: false
                    },
                    {
                        AnchorX: 0,
                        AnchorY: 0,
                        ControlX: 0,
                        ControlY: 0,
                        isChange: false,
                        isCurved: false
                    },
                    0
                ],
                fillStyles: {
                    fillStyleCount: 1,
                    fillStyles: [{
                        bitmapId: 1,
                        bitmapMatrix: [20, 0, 0, 20, 0, 0],
                        fillStyleType: 65
                    }]
                },
                lineStyles: {
                    lineStyleCount: 0,
                    lineStyles: []
                }
            };

            var bounds = {
                xMin: 0,
                xMax: shapeWidth,
                yMin: 0,
                yMax: shapeHeight
            };
            var data = vtc.convert(shape);

            _this.setCharacter(2, {
                tagType: 22,
                data: data,
                bounds: bounds
            });

            var parent = _this.getParent();
            var obj = new Shape();
            obj.setParent(parent);
            obj.setStage(_this);
            obj.setData(data);
            obj.setTagType(22);
            obj.setCharacterId(2);
            obj.setBounds(bounds);
            obj.setLevel(1);

            parent.container[1] = [];
            parent.container[1][1] = obj.instanceId;

            var placeObject = new PlaceObject();
            _this.setPlaceObject(placeObject, obj.instanceId, 1, 1);

            _this.init();
        });


        var length = data.length;
        var src = "";
        for (var i = 0; i < length; i++) {
            src += _fromCharCode(data[i]);
        }

        var jpegData = swftag.parseJpegData(data);
        image.src = "data:image/jpeg;base64," + swftag.base64encode(jpegData);
    };

    /**
     * resize
     */
    Stage.prototype.resize = function ()
    {
        var _this = this;
        var div = _document.getElementById(_this.getName());
        if (!div) {
            return 0;
        }

        var oWidth = _this.optionWidth;
        var oHeight = _this.optionHeight;

        var element = _document.documentElement;
        var innerWidth = _max(element.clientWidth, window.innerWidth || 0);
        var innerHeight = _max(element.clientHeight, window.innerHeight || 0);

        var parent = div.parentNode;
        if (parent.tagName !== "BODY") {
            innerWidth = parent.offsetWidth;
            innerHeight = parent.offsetHeight;
        }
        var screenWidth = (oWidth > 0) ? oWidth : innerWidth;
        var screenHeight = (oHeight > 0) ? oHeight : innerHeight;

        var baseWidth = _this.getBaseWidth();
        var baseHeight = _this.getBaseHeight();
        var scale = _min((screenWidth / baseWidth), (screenHeight / baseHeight));
        var width = baseWidth * scale;
        var height = baseHeight * scale;

        if (width !== _this.getWidth() || height !== _this.getHeight()) {
            // div
            var style = div.style;
            style.width = width + "px";
            style.height = height + "px";
            style.top = 0;
            style.left = ((screenWidth / 2) - (width / 2)) + "px";

            width *= devicePixelRatio;
            height *= devicePixelRatio;

            _this.setScale(scale);
            _this.setWidth(width);
            _this.setHeight(height);

            // main
            var canvas = _this.context.canvas;
            canvas.width = width;
            canvas.height = height;

            // pre
            var preCanvas = _this.preContext.canvas;
            preCanvas.width = width;
            preCanvas.height = height;

            var hitCanvas = _this.hitContext.canvas;
            hitCanvas.width = width;
            hitCanvas.height = height;

            // tmp
            if (isAndroid && isChrome) {
                var tmpCanvas = tmpContext.canvas;
                tmpCanvas.width = width;
                tmpCanvas.height = height;
            }

            var mc = _this.getParent();
            var mScale = scale * _devicePixelRatio / 20;
            _this.setMatrix(mc.cloneArray([mScale, 0, 0, mScale, 0, 0]));
        }
    };

    /**
     * loaded
     */
    Stage.prototype.loaded = function ()
    {
        // reset
        var _this = this;
        _this.buttonHits = [];
        _this.downEventHits = [];
        _this.moveEventHits = [];
        _this.upEventHits = [];
        _this.keyDownEventHits = [];
        _this.keyUpEventHits = [];
        _this.actions = [];

        // DOM
        _this.deleteNode();
        var div = _document.getElementById(_this.getName());
        if (div) {
            var mc = _this.getParent();
            mc.initFrame();
            mc.addActions(_this);
            _this.executeAction();

            // callback
            var callback = _this.callback;
            if (typeof callback === "function") {
                callback.call(window, mc);
            }

            _this.render();
            _this.renderMain();

            var ctx = _this.context;
            var canvas = ctx.canvas;

            // load sound
            if (isTouch) {
                var loadSounds = _this.loadSounds;
                var sLen = loadSounds.length;
                if (sLen) {
                    var loadSound = function ()
                    {
                        canvas.removeEventListener(startEvent, loadSound);
                        for (var i = sLen; i--;) {
                            if (!(i in loadSounds)) {
                                continue;
                            }
                            var audio = loadSounds[i];
                            audio.load();
                        }
                    };
                    canvas.addEventListener(startEvent, loadSound);
                }
            }

            canvas.addEventListener(startEvent, function (event)
            {
                _event = event;
                _this.touchStart(event);
            });

            canvas.addEventListener(moveEvent, function (event)
            {
                _event = event;
                _this.touchMove(event);
            });

            canvas.addEventListener(endEvent, function (event)
            {
                _event = event;
                _this.touchEnd(event);
            });

            div.appendChild(canvas);

            _this.play();
        }
    };

    /**
     * deleteNode
     */
    Stage.prototype.deleteNode = function (tagId)
    {
        var div = _document.getElementById(tagId ? tagId : this.getName());
        if (div) {
            var childNodes = div.childNodes;
            var length = childNodes.length;
            if (length) {
                while (length--) {
                    div.removeChild(childNodes[length]);
                }
            }
        }
    };

    /**
     * nextFrame
     */
    Stage.prototype.nextFrame = function ()
    {
        var _this = this;
        _this.downEventHits = [];
        _this.moveEventHits = [];
        _this.upEventHits = [];
        _this.keyDownEventHits = [];
        _this.keyUpEventHits = [];

        // mouse event
        var parent = _this.getParent();
        var mouse = _this.mouse;
        var mouseEvents = mouse.events;
        var onMouseDown = mouseEvents.onMouseDown;
        if (onMouseDown) {
            _this.downEventHits[_this.downEventHits.length] = {as: onMouseDown, mc: parent};
        }
        var onMouseMove = mouseEvents.onMouseMove;
        if (onMouseMove) {
            _this.moveEventHits[_this.moveEventHits.length] = {as: onMouseMove, mc: parent};
        }
        var onMouseUp = mouseEvents.onMouseUp;
        if (onMouseUp) {
            _this.upEventHits[_this.upEventHits.length] = {as: onMouseUp, mc: parent};
        }

        _this.putFrame();
        _this.addActions();
        _this.executeAction();
        _this.render();
        _this.renderMain();
    };

    /**
     * putFrame
     */
    Stage.prototype.putFrame = function ()
    {
        var _this = this;
        _this.newTags = [];
        var doneTags = _this.doneTags;
        var length = doneTags.length;
        if (length) {
            clipEvent.type = "enterFrame";
            var i = 0;
            while (i < length) {
                var tag = doneTags[i];
                tag.putFrame(_this, clipEvent);
                i++;
            }
        }
    };

    /**
     * addActions
     */
    Stage.prototype.addActions = function ()
    {
        var _this = this;
        var newTags = _this.newTags;
        var length = newTags.length;
        if (length) {
            var i = 0;
            while (i < length) {
                var tag = newTags[i];
                tag.addActions(_this);
                i++;
            }
        }
    };

    /**
     * render
     */
    Stage.prototype.render = function ()
    {
        var _this = this;
        _this.buttonHits = [];
        _this.doneTags = [];

        var ctx = _this.preContext;
        ctx.globalCompositeOperation = "source-over";
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        var backgroundColor = _this.getBackgroundColor();
        if (!backgroundColor || backgroundColor === "transparent") {
            // pre clear
            var canvas = ctx.canvas;
            ctx.clearRect(0, 0, canvas.width + 1, canvas.height + 1);
            // main clear
            var mainCtx = _this.context;
            mainCtx.clearRect(0, 0, canvas.width + 1, canvas.height + 1);
        } else {
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, _this.getWidth() + 1, _this.getHeight() + 1);
        }

        var mc = _this.getParent();
        mc.render(ctx, _this._matrix, _this._colorTransform, _this, true);
    };

    /**
     * executeAction
     */
    Stage.prototype.executeAction = function ()
    {
        var _this = this;
        if (_this.isAction && _this.actions.length) {
            _this.isAction = false;
            var i = 0;
            while (i < _this.actions.length) {
                var obj = _this.actions[i];
                i++;

                var mc = obj.mc;
                var args = obj.args || [];
                if (!mc.active) {
                    continue;
                }

                var actions = obj.as;
                if (typeof actions === "function") {
                    actions.apply(mc, args);
                } else {
                    var length = actions.length;
                    if (!length) {
                        continue;
                    }
                    var idx = 0;
                    while (idx < length) {
                        if (!(idx in actions)) {
                            continue;
                        }
                        var action = actions[idx];
                        if (typeof action === "function") {
                            action.apply(mc, args);
                        }
                        idx++;
                    }
                }
            }
        }
        _this.actions = [];
        _this.isAction = true;
    };

    /**
     * @param mc
     * @param as
     */
    Stage.prototype.buttonAction = function (mc, as)
    {
        var _this = this;
        _this.downEventHits = [];
        _this.moveEventHits = [];
        _this.upEventHits = [];
        _this.keyDownEventHits = [];
        _this.keyUpEventHits = [];
        as.execute(mc);
        _this.executeAction();
    };

    /*
     * main canvas
     */
    Stage.prototype.renderMain = function ()
    {
        var _this = this;
        var preContext = _this.preContext;
        var preCanvas = preContext.canvas;
        var width = preCanvas.width;
        var height = preCanvas.height;
        if (width > 0 && height > 0) {
            var ctx = _this.context;
            ctx.setTransform(1,0,0,1,0,0);
            ctx.drawImage(preCanvas, 0, 0, width, height);
        }
    };

    /**
     * reset
     */
    Stage.prototype.reset = function ()
    {
        var _this = this;
        _this.instanceId = 0;
        var mc = new MovieClip();
        mc.reset();
        mc.setStage(_this);
        _this.parent = mc;
        _this.characters = [];
        _this.instances = [];
        _this.buttonHits = [];
        _this.downEventHits = [];
        _this.moveEventHits = [];
        _this.upEventHits = [];
        _this.keyDownEventHits = [];
        _this.keyUpEventHits = [];
        _this.sounds = [];
        _this.loadSounds = [];
        _this.actions = [];
    };

    /**
     * init
     */
    Stage.prototype.init = function ()
    {
        var _this = this;
        var tagId = _this.tagId;
        var div;
        if (_this.getId() in stages) {
            if (tagId) {
                if (_document.readyState === "loading") {
                    var reTry = function ()
                    {
                        window.removeEventListener("DOMContentLoaded", reTry);
                        _this.init();
                    };
                    window.addEventListener("DOMContentLoaded", reTry);
                    return 0;
                }

                var container = _document.getElementById(tagId);
                if (!container) {
                    alert("Not Found Tag ID:" + tagId);
                    return 0;
                }

                div = _document.getElementById(_this.getName());
                if (div) {
                    _this.deleteNode();
                } else {
                    div = _document.createElement("div");
                    div.id = _this.getName();
                    container.appendChild(div);
                }
            } else {
                _document.body.insertAdjacentHTML("beforeend", "<div id='" + _this.getName() + "'></div>");
            }
        }

        div = _document.getElementById(_this.getName());
        if (div) {
            _this.initStyle(div);
            _this.loading();
        }

        if (!_this.canvas) {
            _this.initCanvas();
        }

        _this.loadStatus++;
        _this.loadEvent();
    };

    /**
     * @param div
     */
    Stage.prototype.initStyle = function (div)
    {
        var style;
        var _this = this;

        style = div.style;
        style.position = "relative";
        style.top = "0";
        style.backgroundColor = "transparent";
        style.overflow = "hidden";
        style["-webkit-backface-visibility"] = "hidden";

        var parent = div.parentNode;
        var oWidth = _this.optionWidth;
        var oHeight = _this.optionHeight;
        var width;
        var height;
        if (parent.tagName === "BODY") {
            width = (oWidth > 0) ? oWidth : window.innerWidth;
            height = (oHeight > 0) ? oHeight : window.innerHeight;
        } else {
            width = (oWidth > 0) ? oWidth : parent.offsetWidth;
            height = (oHeight > 0) ? oHeight : parent.offsetHeight;
        }

        style.width = width + "px";
        style.height = height + "px";
        style['-webkit-user-select'] = "none";
    };

    /**
     * init canvas
     */
    Stage.prototype.initCanvas = function ()
    {
        var _this = this;
        var style;
        var canvas = _document.createElement("canvas");
        canvas.width = 1;
        canvas.height = 1;

        style = canvas.style;
        style.zIndex = 0;
        style.position = "absolute";
        style.top = 0;
        style.left = 0;
        style.zoom = 100 / _devicePixelRatio + "%";
        style["-webkit-tap-highlight-color"] = "rgba(0,0,0,0)";

        style.MozTransformOrigin = "0 0";
        style.MozTransform = "scale(" + 1 / _devicePixelRatio + ")";

        if (isAndroid) {
            canvas.addEventListener("touchcancel", function ()
            {
                _this.touchEnd(_event);
            });
        }

        if (!isTouch) {
            window.addEventListener("keydown", keyDownAction);
            window.addEventListener("keyup", keyUpAction);
            window.addEventListener("keyup", function (event)
            {
                _keyEvent = event;
                _this.touchEnd(event);
            });
        }

        _this.context = canvas.getContext("2d");
        _this.canvas = canvas;

        var preCanvas = _document.createElement("canvas");
        preCanvas.width = 1;
        preCanvas.height = 1;
        _this.preContext = preCanvas.getContext("2d");

        var hitCanvas = _document.createElement("canvas");
        hitCanvas.width = 1;
        hitCanvas.height = 1;
        _this.hitContext = hitCanvas.getContext("2d");
    };

    /**
     * loading
     */
    Stage.prototype.loading = function ()
    {
        var _this = this;
        var div = _document.getElementById(_this.getName());
        var loadingId = _this.getName() + "_loading";
        var css = "<style>";
        css += "#" + loadingId + " {\n";
        // css += "z-index: 999;\n";
        css += "position: absolute;\n";
        css += "top: 50%;\n";
        css += "left: 50%;\n";
        css += "margin: -24px 0 0 -24px;\n";
        css += "width: 50px;\n";
        css += "height: 50px;\n";
        css += "border-radius: 50px;\n";
        css += "border: 8px solid #dcdcdc;\n";
        css += "border-right-color: transparent;\n";
        css += "box-sizing: border-box;\n";
        css += "-webkit-animation: " + loadingId + " 0.8s infinite linear;\n";
        css += "animation: " + loadingId + " 0.8s infinite linear;\n";
        css += "} \n";
        css += "@-webkit-keyframes " + loadingId + " {\n";
        css += "0% {-webkit-transform: rotate(0deg);}\n";
        css += "100% {-webkit-transform: rotate(360deg);}\n";
        css += "} \n";
        css += "@keyframes " + loadingId + " {\n";
        css += "0% {transform: rotate(0deg);}\n";
        css += "100% {transform: rotate(360deg);}\n";
        css += "} \n";
        css += "</style>";
        div.innerHTML = css;
        var loadingDiv = _document.createElement("div");
        loadingDiv.id = loadingId;
        div.appendChild(loadingDiv);
    };

    /**
     * @param url
     * @param options
     */
    Stage.prototype.reload = function (url, options)
    {
        var _this = this;
        _this.stop();

        if (_this.loadStatus === 4) {
            _this.deleteNode();
        }

        _this.loadStatus = 0;
        _this.isLoad = false;
        _this.reset();

        var swf2js = window.swf2js;
        return swf2js.load(url, {
            optionWidth: options.optionWidth || _this.optionWidth,
            optionHeight: options.optionHeight || _this.optionHeight,
            callback: options.callback || _this.callback,
            tagId: options.tagId || _this.tagId,
            renderMode: options.renderMode || _this.renderMode,
            FlashVars: options.FlashVars || _this.FlashVars,
            quality: options.quality || _this.quality,
            bgcolor: options.bgcolor || _this.bgcolor,
            stage: _this
        });
    };

    /**
     * @param url
     * @param frame
     * @param width
     * @param height
     * @returns {*}
     */
    Stage.prototype.output = function (url, frame, width, height)
    {
        var _this = this;
        if (!_this.isLoad || _this.stopFlag) {
            _setTimeout(function ()
            {
                _this.output(url, frame, width, height);
            }, 500);
            return 0;
        }

        _this.stop();
        frame = frame || 1;
        width = width || _this.getWidth();
        height = height || _this.getHeight();

        // resize
        var mc = _this.getParent();
        mc.reset();
        mc.gotoAndStop(frame);
        if (width !== _this.getWidth() || height !== _this.getHeight()) {
            _this.optionWidth = width;
            _this.optionHeight = height;
            _this.resize();
        }

        // action
        mc.addActions();

        // backgroundColor
        var canvas = _this.preContext.canvas;
        var style = canvas.style;
        style.backgroundColor = _this.backgroundColor;

        // render
        _this.render();

        // output
        var xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.open("POST", url, true);
        xmlHttpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xmlHttpRequest.onreadystatechange = function ()
        {
            var readyState = xmlHttpRequest.readyState;
            if (readyState === 4) {
                var status = xmlHttpRequest.status;
                switch (status) {
                    case 200:
                    case 304:
                        console.log("OUTPUT SUCCESS");
                        break;
                    default :
                        alert(xmlHttpRequest.statusText);
                        break;
                }
            }
        };
        var base64 = canvas.toDataURL();
        xmlHttpRequest.send("data=" + encodeURIComponent(base64));
    };

    /**
     * @param event
     */
    Stage.prototype.hitCheck = function (event)
    {
        var _this = this;
        _this.isHit = false;
        var buttonHits = _this.buttonHits;
        var length = buttonHits.length;
        if (!length) {
            return 0;
        }

        var div = _document.getElementById(_this.getName());
        var bounds = div.getBoundingClientRect();
        var x = window.pageXOffset + bounds.left;
        var y = window.pageYOffset + bounds.top;
        var touchX = 0;
        var touchY = 0;

        if (isTouch) {
            var changedTouche = event.changedTouches[0];
            touchX = changedTouche.pageX;
            touchY = changedTouche.pageY;
        } else {
            touchX = event.pageX;
            touchY = event.pageY;
        }

        touchX -= x;
        touchY -= y;
        var scale = _this.getScale();

        touchX /= scale;
        touchY /= scale;

        var ctx = _this.hitContext;
        var hitCanvas = ctx.canvas;
        var hitWidth = hitCanvas.width;
        var hitHeight = hitCanvas.height;
        var chkX = touchX * scale * _devicePixelRatio;
        var chkY = touchY * scale * _devicePixelRatio;

        if (_this.abcFlag) {
            var parent = _this.getParent();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, hitWidth, hitHeight);
            var ret = parent.hitCheck(ctx, [1,0,0,1,0,0], _this, chkX, chkY);
            return (typeof ret === "object") ? ret : false;
        }

        for (var i = length; i--;) {
            if (!(i in buttonHits)) {
                continue;
            }

            var hitObj = buttonHits[i];
            if (hitObj === undefined) {
                continue;
            }

            var hit = false;
            if (touchX >= hitObj.xMin && touchX <= hitObj.xMax &&
                touchY >= hitObj.yMin && touchY <= hitObj.yMax
            ) {
                var matrix = hitObj.matrix;
                if (matrix) {
                    var mc = hitObj.parent;
                    var button = hitObj.button;

                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                    ctx.clearRect(0, 0, hitWidth, hitHeight);
                    if (button) {
                        hit = button.renderHitTest(ctx, matrix, _this, chkX, chkY);
                    } else {
                        hit = mc.renderHitTest(ctx, matrix, _this, chkX, chkY);
                    }
                } else {
                    hit = true;
                }
            }

            if (hit) {
                event.preventDefault();
                _this.isHit = true;
                return hitObj;
            }
        }

        return 0;
    };

    /**
     * @param actions
     * @param caller
     * @param event
     */
    Stage.prototype.executeEventAction = function (actions, caller, event)
    {
        var args = event || [];
        if (actions) {
            if (typeof actions === "function") {
                actions.apply(caller, args);
            } else {
                var length = actions.length;
                if (length) {
                    var i = 0;
                    while (i < length) {
                        var action = actions[i];
                        if (typeof action === "function") {
                            action.apply(caller, args);
                        }
                        i++;
                    }
                }
            }
            this.executeAction();
        }
    };

    /**
     * @param event
     */
    Stage.prototype.touchStart = function (event)
    {
        var _this = this;
        if (_this.touchStatus === "up") {
            _this.touchStatus = "down";
            _this.isHit = false;
            _this.isTouchEvent = true;
            _this.touchEndAction = null;
            var downEventHits = _this.downEventHits;
            var length = downEventHits.length;
            var mc, as;
            if (length) {
                event.preventDefault();
                for (var i = 0; i < length; i++) {
                    var obj = downEventHits[i];
                    mc = obj.mc;
                    as = obj.as;
                    if (!as) {
                        as = mc.variables.onMouseDown;
                    }
                    _this.executeEventAction(as, obj.mc);
                }
                _this.downEventHits = [];
            }

            var hitObj = _this.hitCheck(event);
            if (_this.isHit) {
                mc = hitObj.parent;
                if (mc.active) {
                    mc.setButtonStatus("down");
                    if (mc instanceof TextField) {
                        _this.appendTextArea(mc, hitObj);
                    } else {
                        _this.executePress(mc, hitObj);
                    }
                }
                if (_this.touchObj === null) {
                    _this.touchObj = hitObj;
                }
            }
        }
    };

    /**
     * @param mc
     * @param hitObj
     */
    Stage.prototype.executePress = function (mc, hitObj)
    {
        var _this = this;
        var isRender = false;
        var events;
        var press;
        var onPress;
        var rollOver;
        var onRollOver;
        var cEvent = new ClipEvent();

        events = mc.events;
        if (isTouch) {
            rollOver = events.rollOver;
            if (rollOver) {
                cEvent.type = "rollOver";
                cEvent.target = mc;
                _this.executeEventAction(rollOver, mc, [cEvent]);
                isRender = true;
            }

            onRollOver = mc.variables.onRollOver;
            if (typeof onRollOver === "function") {
                _this.executeEventAction(onRollOver, mc);
                isRender = true;
            }
        }

        events = mc.events;
        press = events.press;
        if (press) {
            cEvent.type = "press";
            cEvent.target = mc;
            _this.executeEventAction(press, mc, [cEvent]);
            isRender = true;
        }
        onPress = mc.variables.onPress;
        if (typeof onPress === "function") {
            _this.executeEventAction(onPress, mc);
            isRender = true;
        }

        var button = hitObj.button;
        if (button) {
            events = button.events;

            if (isTouch) {
                rollOver = events.rollOver;
                if (rollOver) {
                    cEvent.type = "rollOver";
                    cEvent.target = button;
                    _this.executeEventAction(rollOver, button, [cEvent]);
                }

                onRollOver = button.variables.onRollOver;
                if (typeof onRollOver === "function") {
                    _this.executeEventAction(onRollOver, button);
                }
            }

            button.setButtonStatus("down");
            if (isTouch) {
                _this.executeButtonAction(button, mc, "CondIdleToOverUp");
            }

            var actions = button.getActions();
            var length = actions.length;
            if (length) {
                var touchObj = _this.touchObj;

                for (var idx = 0; idx < length; idx++) {
                    if (!(idx in actions)) {
                        continue;
                    }

                    var cond = actions[idx];
                    if (cond.CondOverDownToOverUp && touchObj === null) {
                        _this.touchEndAction = cond.ActionScript;
                        continue;
                    }

                    // enter
                    var keyPress = cond.CondKeyPress;
                    if (hitObj.CondKeyPress === 13 && hitObj.CondKeyPress !== keyPress) {
                        continue;
                    }

                    if (isTouch) {
                        if (keyPress === 13 ||
                            (keyPress >= 48 && keyPress <= 57) ||
                            cond.CondOverUpToOverDown
                        ) {
                            _this.buttonAction(mc, cond.ActionScript);
                        }
                    } else {
                        if (cond.CondOverUpToOverDown) {
                            _this.buttonAction(mc, cond.ActionScript);
                        }
                    }
                }
            }

            press = events.press;
            if (press) {
                cEvent.type = "press";
                cEvent.target = button;
                _this.executeEventAction(press, button, [cEvent]);
            }

            onPress = button.variables.onPress;
            if (typeof onPress === "function") {
                _this.executeEventAction(onPress, button);
            }

            var sprite = button.getSprite();
            sprite.startSound();

            button.addActions(_this);
            _this.executeAction();

            isRender = true;
        }

        if (isRender) {
            _this.touchRender();
        }

    };

    /**
     * @param textField
     * @param hitObj
     */
    Stage.prototype.appendTextArea = function (textField, hitObj)
    {
        var _this = this;
        textField.inputActive = true;
        var element = _document.getElementById(textField.getTagName());
        if (!element) {
            element = textField.input;
            var variable = textField.getProperty("variable");
            var text;
            if (variable) {
                var mc = textField.getParent();
                text = mc.getProperty(variable);
                if (text === undefined) {
                    text = textField.getVariable("text");
                }
            }
            if (text !== undefined) {
                element.value = text;
            }

            var maxLength = textField.getVariable("maxChars");
            if (maxLength) {
                element.maxLength = maxLength;
            }
            var border = textField.getVariable("border");
            if (border) {
                element.style.border = "1px solid black";
                var color = textField.getVariable("backgroundColor");
                element.style.backgroundColor = "rgba(" + color.R + "," + color.G + "," + color.B + "," + color.A + ")";
            }

            var scale = _this.getScale();
            var left = hitObj.xMin;
            var top = hitObj.yMin;
            var width = hitObj.xMax - left;
            var height = hitObj.yMax - top;
            element.style.left = _ceil(left * scale) - 3 + "px";
            element.style.top = _ceil(top * scale) - 3 + "px";
            element.style.width = _ceil(width * scale) + 6 + "px";
            element.style.height = _ceil(height * scale) + 6 + "px";

            var div = _document.getElementById(_this.getName());
            if (div) {
                div.appendChild(element);
                element.focus();
                var focus = function (el)
                {
                    return function ()
                    {
                        el.focus();
                    };
                };
                _setTimeout(focus(element), 10);
            }
        }
    };

    /**
     * @param event
     */
    Stage.prototype.touchMove = function (event)
    {
        var _this = this;
        var overObj = _this.overObj;
        var moveEventHits = _this.moveEventHits;
        var length = moveEventHits.length;
        var mc, as, button, events;
        var dragOver, onDragOver, dragOut, onDragOut, rollOver, onRollOver, rollOut, onRollOut;
        var cEvent = new ClipEvent();

        if (length) {
            event.preventDefault();
            for (var i = 0; i < length; i++) {
                var obj = moveEventHits[i];
                mc = obj.mc;
                as = obj.as;
                if (!as) {
                    as = mc.variables.onMouseMove;
                }
                _this.executeEventAction(as, mc);
            }
            _this.moveEventHits = [];
        }

        if (!isTouch || (isTouch && _this.isTouchEvent)) {
            var hitObj = null;
            var touchObj = _this.touchObj;
            if (touchObj || _this.touchStatus === "up") {
                hitObj = _this.hitCheck(event);
            }

            var sprite;
            var isRender = false;
            if (!isTouch) {
                var canvas = _this.canvas;
                if (_this.isHit || touchObj) {
                    if (hitObj) {
                        canvas.style.cursor = "pointer";
                    } else {
                        canvas.style.cursor = "auto";
                    }
                } else {
                    canvas.style.cursor = "auto";
                }
            }

            if (touchObj) {
                button = touchObj.button;
                mc = touchObj.parent;

                if (mc.active) {
                    _this.overObj = hitObj;
                    if (hitObj &&
                        hitObj.parent.instanceId === mc.instanceId &&
                        hitObj.button === button
                    ) {
                        if (mc.getButtonStatus() === "up") {
                            mc.setButtonStatus("down");
                            events = mc.events;
                            dragOver = events.dragOver;
                            if (dragOver) {
                                cEvent.type = "dragOver";
                                cEvent.target = mc;
                                isRender = true;
                                _this.executeEventAction(dragOver, mc, [cEvent]);
                            }
                            onDragOver = mc.variables.onDragOver;
                            if (typeof onDragOver === "function") {
                                isRender = true;
                                _this.executeEventAction(onDragOver, mc);
                            }
                        }

                        if (button && button.getButtonStatus() === "up") {
                            button.setButtonStatus("down");
                            sprite = button.getSprite();
                            sprite.startSound();

                            events = button.events;
                            dragOver = events.dragOver;
                            if (dragOver) {
                                cEvent.type = "dragOver";
                                cEvent.target = button;
                                isRender = true;
                                _this.executeEventAction(dragOver, button, [cEvent]);
                            }
                            onDragOver = button.variables.onDragOver;
                            if (typeof onDragOver === "function") {
                                isRender = true;
                                _this.executeEventAction(onDragOver, button);
                            }
                            button.addActions(_this);
                            _this.executeAction();
                        }
                    } else {
                        if (mc.getButtonStatus() === "down") {
                            events = mc.events;
                            dragOut = events.dragOut;
                            if (dragOut) {
                                cEvent.type = "dragOut";
                                cEvent.target = mc;
                                isRender = true;
                                _this.executeEventAction(dragOut, mc, [cEvent]);
                            }
                            onDragOut = mc.variables.onDragOut;
                            if (typeof onDragOut === "function") {
                                isRender = true;
                                _this.executeEventAction(onDragOut, mc);
                            }
                        }
                        mc.setButtonStatus("up");

                        if (button) {
                            if (button.getButtonStatus() === "down") {
                                button.setButtonStatus("up");

                                events = button.events;
                                dragOut = events.dragOut;
                                if (dragOut) {
                                    cEvent.type = "dragOut";
                                    cEvent.target = button;
                                    isRender = true;
                                    _this.executeEventAction(dragOut, button, [cEvent]);
                                }
                                onDragOut = button.variables.onDragOut;
                                if (typeof onDragOut === "function") {
                                    isRender = true;
                                    _this.executeEventAction(onDragOut, button);
                                }
                                button.addActions(_this);
                                _this.executeAction();
                            }
                        }
                    }
                }
            } else if (hitObj) {

                if (overObj) {
                    button = overObj.button;
                    if (button && button !== hitObj.button) {
                        mc = overObj.parent;
                        if (mc.active) {
                            button.setButtonStatus("up");
                            _this.executeButtonAction(button, mc, "CondOverUpToIdle");
                        }
                    }
                }

                button = hitObj.button;
                mc = hitObj.parent;
                if (!isTouch && mc.active) {
                    if (!overObj || overObj.parent !== mc) {
                        events = mc.events;
                        rollOver = events.rollOver;
                        if (rollOver) {
                            cEvent.type = "rollOver";
                            cEvent.target = mc;
                            isRender = true;
                            _this.executeEventAction(rollOver, mc, [cEvent]);
                        }

                        onRollOver = mc.variables.onRollOver;
                        if (typeof onRollOver === "function") {
                            isRender = true;
                            _this.executeEventAction(onRollOver, mc);
                        }
                    }
                }

                if (button) {
                    button.setButtonStatus("over");
                    sprite = button.getSprite();
                    sprite.startSound();
                    if (!isTouch) {
                        if (!overObj || overObj.button !== button) {
                            isRender = true;
                            _this.executeButtonAction(button, mc, "CondIdleToOverUp");

                            events = button.events;
                            rollOver = events.rollOver;
                            if (rollOver) {
                                cEvent.type = "rollOver";
                                cEvent.target = button;
                                isRender = true;
                                _this.executeEventAction(rollOver, button, [cEvent]);
                            }
                            onRollOver = button.variables.onRollOver;
                            if (typeof onRollOver === "function") {
                                _this.executeEventAction(onRollOver, button);
                            }
                        }
                    }
                    button.addActions(_this);
                    _this.executeAction();
                }

                _this.overObj = hitObj;
            } else if (_this.touchStatus === "up") {
                _this.overObj = null;
            }

            // RollOut
            if (!touchObj && overObj) {
                button = overObj.button;
                mc = overObj.parent;
                if (mc.active) {
                    if (!hitObj || hitObj.parent !== mc) {
                        mc.setButtonStatus("up");

                        events = mc.events;
                        rollOut = events.rollOut;
                        if (rollOut) {
                            cEvent.type = "rollOut";
                            cEvent.target = mc;
                            isRender = true;
                            _this.executeEventAction(rollOut, mc, [cEvent]);
                        }

                        onRollOut = mc.variables.onRollOut;
                        if (typeof onRollOut === "function") {
                            isRender = true;
                            _this.executeEventAction(onRollOut, mc);
                        }
                    }

                    if (button && (!hitObj || hitObj.button !== button)) {
                        button.setButtonStatus("up");
                        _this.executeButtonAction(button, mc, "CondOverUpToIdle");

                        events = button.events;
                        rollOut = events.rollOut;
                        if (rollOut) {
                            cEvent.type = "rollOut";
                            cEvent.target = button;
                            isRender = true;
                            _this.executeEventAction(rollOut, button, [cEvent]);
                        }

                        onRollOut = button.variables.onRollOut;
                        if (typeof onRollOut === "function") {
                            isRender = true;
                            _this.executeEventAction(onRollOut, button);
                        }
                        button.addActions(_this);
                        _this.executeAction();
                    }
                }
            }

            if (isRender) {
                _this.touchRender();
            }
        }

        var dragMc = _this.dragMc;
        if (dragMc) {
            event.preventDefault();
            dragMc.executeDrag();
            _this.isHit = true;
        }
    };

    /**
     * @param event
     */
    Stage.prototype.touchEnd = function (event)
    {
        var _this = this;
        var cEvent = new ClipEvent();
        var button, mc, as, events, release, onRelease, releaseOutside, onReleaseOutside;
        var touchObj = _this.touchObj;
        if (touchObj) {
            button = touchObj.button;
            if (button) {
                button.setButtonStatus("up");
            }
        }

        var upEventHits = _this.upEventHits;
        var length = upEventHits.length;
        if (length) {
            event.preventDefault();
            for (var i = 0; i < length; i++) {
                var obj = upEventHits[i];
                mc = obj.mc;
                as = obj.as;
                if (!as) {
                    as = mc.variables.onMouseUp;
                }
                _this.executeEventAction(as, obj.mc);
            }
            _this.upEventHits = [];
        }

        var hitObj = _this.hitCheck(event);
        var dragMc = _this.dragMc;
        if (dragMc) {
            hitObj = touchObj;
            _this.isHit = true;
        }

        var isRender = false;
        if (touchObj) {
            mc = touchObj.parent;
            mc.setButtonStatus("up");
            button = touchObj.button;

            if (_this.isHit) {
                var touchEndAction = _this.touchEndAction;
                if (mc.active) {
                    if (mc === hitObj.parent) {
                        if (touchEndAction !== null) {
                            _this.buttonAction(mc, touchEndAction);
                            isRender = true;
                        }

                        events = mc.events;
                        release = events.release;
                        if (release) {
                            cEvent.type = "release";
                            cEvent.target = mc;
                            _this.executeEventAction(release, mc, [cEvent]);
                            isRender = true;
                        }
                        onRelease = mc.variables.onRelease;
                        if (typeof onRelease === "function") {
                            _this.executeEventAction(onRelease, mc);
                            isRender = true;
                        }
                    }

                    if (button) {
                        if (button === hitObj.button) {
                            events = button.events;
                            release = events.release;
                            if (release) {
                                cEvent.type = "release";
                                cEvent.target = button;
                                _this.executeEventAction(release, button, [cEvent]);
                            }

                            onRelease = button.variables.onRelease;
                            if (typeof onRelease === "function") {
                                _this.executeEventAction(onRelease, button);
                            }
                        }

                        var status = "up";
                        if (!isTouch) {
                            if (hitObj && hitObj.button === button) {
                                status = "over";
                            }
                        }

                        button.setButtonStatus(status);

                        var sprite = button.getSprite("hit");
                        sprite.startSound();

                        button.addActions(_this);
                        _this.executeAction();

                        isRender = true;
                    }
                }
            }

            if (mc.active && (!hitObj || mc !== hitObj.parent)) {
                events = mc.events;
                releaseOutside = events.releaseOutside;
                if (releaseOutside) {
                    cEvent.type = "releaseOutside";
                    cEvent.target = mc;
                    _this.executeEventAction(releaseOutside, mc, [cEvent]);
                    isRender = true;
                }
                onReleaseOutside = mc.variables.onReleaseOutside;
                if (typeof onReleaseOutside === "function") {
                    _this.executeEventAction(onReleaseOutside, mc);
                    isRender = true;
                }
            }

            if (button && (!hitObj || button !== hitObj.button)) {
                isRender = true;

                events = button.events;
                releaseOutside = events.releaseOutside;
                if (releaseOutside) {
                    cEvent.type = "releaseOutside";
                    cEvent.target = button;
                    _this.executeEventAction(releaseOutside, button, [cEvent]);
                    isRender = true;
                }

                onReleaseOutside = button.variables.onReleaseOutside;
                if (typeof onReleaseOutside === "function") {
                    _this.executeEventAction(onReleaseOutside, button);
                }
                button.setButtonStatus("up");
                button.addActions(_this);
                _this.executeAction();
            }
        }

        _this.isHit = false;
        _this.isTouchEvent = false;
        _this.touchObj = null;
        _this.touchStatus = "up";

        if (!isTouch) {
            _this.hitCheck(event);
            var canvas = _this.canvas;
            if (_this.isHit) {
                canvas.style.cursor = "pointer";
            } else {
                canvas.style.cursor = "auto";
            }
        }

        if (hitObj) {
            var rollOver, onRollOver;
            mc = hitObj.parent;
            if (!touchObj || mc !== touchObj.parent) {
                events = mc.events;
                rollOver = events.rollOver;
                if (rollOver) {
                    isRender = true;
                    cEvent.type = "rollOver";
                    cEvent.target = mc;
                    _this.executeEventAction(rollOver, mc, [cEvent]);
                }

                onRollOver = mc.variables.onRollOver;
                if (typeof onRollOver === "function") {
                    isRender = true;
                    _this.executeEventAction(onRollOver, mc);
                }
            }

            button = hitObj.button;
            if (button) {
                if (!touchObj || button !== touchObj.button) {
                    events = button.events;
                    rollOver = events.rollOver;
                    if (rollOver) {
                        isRender = true;
                        cEvent.type = "rollOver";
                        cEvent.target = button;
                        _this.executeEventAction(rollOver, button, [cEvent]);
                    }

                    onRollOver = button.variables.onRollOver;
                    if (typeof onRollOver === "function") {
                        isRender = true;
                        _this.executeEventAction(onRollOver, button);
                    }
                }
            }
        }

        if (isRender) {
            event.preventDefault();
            _this.touchRender();
        }

        _keyEvent = null;
    };

    /**
     * @param button
     * @param mc
     * @param status
     */
    Stage.prototype.executeButtonAction = function (button, mc, status)
    {
        var _this = this;
        var actions = button.getActions();
        var length = actions.length;
        if (length) {
            for (var idx = 0; idx < length; idx++) {
                if (!(idx in actions)) {
                    continue;
                }

                var cond = actions[idx];
                if (!cond[status]) {
                    continue;
                }

                _this.buttonAction(mc, cond.ActionScript);
            }
        }
    };

    /**
     * touchRender
     */
    Stage.prototype.touchRender = function ()
    {
        var _this = this;
        _this.render();
        _this.renderMain();
    };

    /**
     * @constructor
     */
    var Swf2js = function () {};

    /**
     * @type {DropShadowFilter}
     */
    Swf2js.prototype.DropShadowFilter = DropShadowFilter;

    /**
     * @type {BlurFilter}
     */
    Swf2js.prototype.BlurFilter = BlurFilter;

    /**
     * @type {GlowFilter}
     */
    Swf2js.prototype.GlowFilter = GlowFilter;

    /**
     * @type {BevelFilter}
     */
    Swf2js.prototype.BevelFilter = BevelFilter;

    /**
     * @type {GradientGlowFilter}
     */
    Swf2js.prototype.GradientGlowFilter = GradientGlowFilter;

    /**
     * @type {ConvolutionFilter}
     */
    Swf2js.prototype.ConvolutionFilter = ConvolutionFilter;

    /**
     * @type {ColorMatrixFilter}
     */
    Swf2js.prototype.ColorMatrixFilter = ColorMatrixFilter;

    /**
     * @type {GradientBevelFilter}
     */
    Swf2js.prototype.GradientBevelFilter = GradientBevelFilter;

    /**
     * @type {BitmapFilter}
     */
    Swf2js.prototype.BitmapFilter = BitmapFilter;

    /**
     * @type {LoadVars}
     */
    Swf2js.prototype.LoadVars = LoadVars;

    /**
     * @param url
     * @param options
     */
    Swf2js.prototype.load = function (url, options)
    {
        // develop only
        if (url === "develop") {
            url = location.search.substr(1).split("&")[0];
        }

        if (url) {
            var stage = (options && options.stage instanceof Stage) ? options.stage : new Stage();
            stage.setOptions(options);
            stages[stage.getId()] = stage;
            stage.init();

            var xmlHttpRequest = new XMLHttpRequest();
            xmlHttpRequest.open("GET", url, true);
            if (isXHR2) {
                xmlHttpRequest.responseType = "arraybuffer";
            } else {
                xmlHttpRequest.overrideMimeType("text/plain; charset=x-user-defined");
            }

            xmlHttpRequest.onreadystatechange = function ()
            {
                var readyState = xmlHttpRequest.readyState;
                if (readyState === 4) {
                    var status = xmlHttpRequest.status;
                    switch (status) {
                        case 200:
                        case 304:
                            var data = (isXHR2) ? xmlHttpRequest.response : xmlHttpRequest.responseText;
                            stage.parse(data, url);
                            cacheStore.reset();
                            break;
                        default :
                            alert(xmlHttpRequest.statusText);
                            break;
                    }
                }
            };
            xmlHttpRequest.send(null);
        } else {
            alert("please set swf url");
        }
    };

    /**
     * @param url
     * @param options
     * @returns {*}
     */
    Swf2js.prototype.reload = function(url, options)
    {
        if (!stageId) {
            return this.load(url, options);
        }
        var stage = stages[0];
        for (var i in stages) {
            if (!stages.hasOwnProperty(i)) {
                continue;
            }
            var target = stages[i];
            target.stop();
            if (i) {
                target.deleteNode(target.tagId);
                target = void 0;
            }
        }

        stageId = 1;
        stages = [];
        loadStages = [];
        stages[0] = stage;
        stage.reload(url, options);
    };

    /**
     * @param width
     * @param height
     * @param fps
     * @param options
     * @returns {MovieClip}
     */
    Swf2js.prototype.createRootMovieClip = function(width, height, fps, options)
    {
        var stage = new Stage();
        width = width || 240;
        height = height || 240;
        fps = fps || 60;

        stage.setBaseWidth(width);
        stage.setBaseHeight(height);
        stage.setFrameRate(fps);
        stage.setOptions(options);
        stages[stage.getId()] = stage;
        stage.init();
        stage.isLoad = true;

        if (_document.readyState === "loading") {
            var reLoad = function()
            {
                window.removeEventListener("DOMContentLoaded", reLoad, false);
                stage.resize();
                stage.loaded();
            };
            window.addEventListener("DOMContentLoaded", reLoad, false);
        }
        return stage.getParent();
    };

    window.swf2js = new Swf2js();
})(window);}
