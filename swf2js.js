/**
 * swf2js (version 0.5.2)
 * Develop: https://github.com/ienaga/swf2js
 * ReadMe: https://github.com/ienaga/swf2js/blob/master/README.md
 *
 * Web: https://swf2js.wordpress.com/
 * Contact: ienaga@tvon.jp
 *
 * Copyright (c) 2013 Toshiyuki Ienaga. Licensed under the MIT License.
 * コピーも改変もご自由にどうぞ。
 */
if (window['swf2js'] == undefined) { (function(window)
{
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
    var _log = Math.log;
    var _SQRT2 = Math.SQRT2;
    var _LN2 = Math.LN2;
    var _PI = Math.PI;
    var _Number = Number;
    var _fromCharCode = String.fromCharCode;
    var _parseInt = parseInt;
    var _parseFloat = parseFloat;
    var _isNaN = isNaN;
    var resizeId = 0;
    var _setTimeout = setTimeout;
    var _clearTimeout = clearTimeout;
    var _setInterval = setInterval;
    var _clearInterval = clearInterval;
    var _Date = Date;
    var _escape = escape;
    var _unescape = unescape;
    var _decodeURIComponent = decodeURIComponent;
    var isWebGL = (window.WebGLRenderingContext
    && _document.createElement('canvas').getContext('webgl')) ? true : false;
    var requestAnimationFrame = window.requestAnimationFrame
        || window.webkitRequestAnimationFrame
        || window.mozRequestAnimationFrame
        || window.setTimeout;

    // params
    var playerId = 0;
    var players = [];
    var instanceId = 0;
    var tmpContext;
    var startDate = new _Date();
    var _navigator = window.navigator;
    var ua = _navigator.userAgent;
    var isAndroid = (ua.indexOf('Android') > 0);
    var isAndroid4x =(ua.indexOf('Android 4.') > 0);
    var isiOS = (ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0);
    var isChrome = (ua.indexOf('Chrome') > 0);
    var isTouch = (isAndroid || isiOS);
    var isXHR2 = false;
    var isArrayBuffer = window.ArrayBuffer;
    var devicePixelRatio = window.devicePixelRatio || 1;
    var _devicePixelRatio = devicePixelRatio * 0.75;
    var _event = null;
    var startEvent = 'mousedown';
    var moveEvent  = 'mousemove';
    var endEvent   = 'mouseup';
    if (isTouch) {
        startEvent = 'touchstart';
        moveEvent  = 'touchmove';
        endEvent   = 'touchend';
    }

    // Alpha Bug
    var isAlphaBug = isAndroid;
    if (isAndroid) {
        var chkCanvas = _document.createElement('canvas');
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
    }

    if (isAndroid && isChrome) {
        tmpContext = chkCanvas.getContext('2d')
    }

    // shift-jis
    var JCT11280 = new Function('var a="zKV33~jZ4zN=~ji36XazM93y!{~k2y!o~k0ZlW6zN?3Wz3W?{EKzK[33[`y|;-~j^YOTz$!~kNy|L1$353~jV3zKk3~k-4P4zK_2+~jY4y!xYHR~jlz$_~jk4z$e3X5He<0y!wy|X3[:~l|VU[F3VZ056Hy!nz/m1XD61+1XY1E1=1y|bzKiz!H034zKj~mEz#c5ZA3-3X$1~mBz$$3~lyz#,4YN5~mEz#{ZKZ3V%7Y}!J3X-YEX_J(3~mAz =V;kE0/y|F3y!}~m>z/U~mI~j_2+~mA~jp2;~m@~k32;~m>V}2u~mEX#2x~mBy+x2242(~mBy,;2242(~may->2&XkG2;~mIy-_2&NXd2;~mGz,{4<6:.:B*B:XC4>6:.>B*BBXSA+A:X]E&E<~r#z+625z s2+zN=`HXI@YMXIAXZYUM8X4K/:Q!Z&33 3YWX[~mB`{zKt4z (zV/z 3zRw2%Wd39]S11z$PAXH5Xb;ZQWU1ZgWP%3~o@{Dgl#gd}T){Uo{y5_d{e@}C(} WU9|cB{w}bzvV|)[} H|zT}d||0~{]Q|(l{|x{iv{dw}(5}[Z|kuZ }cq{{y|ij}.I{idbof%cu^d}Rj^y|-M{ESYGYfYsZslS`?ZdYO__gLYRZ&fvb4oKfhSf^d<Yeasc1f&a=hnYG{QY{D`Bsa|u,}Dl|_Q{C%xK|Aq}C>|c#ryW=}eY{L+`)][YF_Ub^h4}[X|?r|u_ex}TL@YR]j{SrXgo*|Gv|rK}B#mu{R1}hs|dP{C7|^Qt3|@P{YVV |8&}#D}ef{e/{Rl|>Hni}R1{Z#{D[}CQlQ||E}[s{SG_+i8eplY[=[|ec[$YXn#`hcm}YR|{Ci(_[ql|?8p3]-}^t{wy}4la&pc|3e{Rp{LqiJ],] `kc(]@chYnrM`O^,ZLYhZB]ywyfGY~aex!_Qww{a!|)*lHrM{N+n&YYj~Z b c#e_[hZSon|rOt`}hBXa^i{lh|<0||r{KJ{kni)|x,|0auY{D!^Sce{w;|@S|cA}Xn{C1h${E]Z-XgZ*XPbp]^_qbH^e[`YM|a||+=]!Lc}]vdBc=j-YSZD]YmyYLYKZ9Z>Xcczc2{Yh}9Fc#Z.l{}(D{G{{mRhC|L3b#|xK[Bepj#ut`H[,{E9Yr}1b{[e]{ZFk7[ZYbZ0XL]}Ye[(`d}c!|*y`Dg=b;gR]Hm=hJho}R-[n}9;{N![7k_{UbmN]rf#pTe[x8}!Qcs_rs[m`|>N}^V})7{^r|/E}),}HH{OYe2{Skx)e<_.cj.cjoMhc^d}0uYZd!^J_@g,[[[?{i@][|3S}Yl3|!1|eZ|5IYw|1D}e7|Cv{OHbnx-`wvb[6[4} =g+k:{C:}ed{S]|2M]-}WZ|/q{LF|dYu^}Gs^c{Z=}h>|/i|{W]:|ip{N:|zt|S<{DH[p_tvD{N<[8Axo{X4a.^o^X>Yfa59`#ZBYgY~_t^9`jZHZn`>G[oajZ;X,i)Z.^~YJe ZiZF^{][[#Zt^|]Fjx]&_5dddW]P0C[-]}]d|y {C_jUql] |OpaA[Z{lp|rz}:Mu#]_Yf6{Ep?f5`$[6^D][^u[$[6^.Z8]]ePc2U/=]K^_+^M{q*|9tYuZ,s(dS{i=|bNbB{uG}0jZOa:[-]dYtu3]:]<{DJ_SZIqr_`l=Yt`gkTnXb3d@kiq0a`Z{|!B|}e}Ww{Sp,^Z|0>_Z}36|]A|-t}lt{R6pi|v8hPu#{C>YOZHYmg/Z4nicK[}hF_Bg|YRZ7c|crkzYZY}_iXcZ.|)U|L5{R~qi^Uga@Y[xb}&qdbd6h5|Btw[}c<{Ds53[Y7]?Z<|e0{L[ZK]mXKZ#Z2^tavf0`PE[OSOaP`4gi`qjdYMgys/?[nc,}EEb,eL]g[n{E_b/vcvgb.{kcwi`~v%|0:|iK{Jh_vf5lb}KL|(oi=LrzhhY_^@`zgf[~g)[J_0fk_V{T)}I_{D&_/d9W/|MU[)f$xW}?$xr4<{Lb{y4}&u{XJ|cm{Iu{jQ}CMkD{CX|7A}G~{kt)nB|d5|<-}WJ}@||d@|Iy}Ts|iL|/^|no|0;}L6{Pm]7}$zf:|r2}?C_k{R(}-w|`G{Gy[g]bVje=_0|PT{^Y^yjtT[[[l!Ye_`ZN]@[n_)j3nEgMa]YtYpZy].d-Y_cjb~Y~[nc~sCi3|zg}B0}do{O^{|$`_|D{}U&|0+{J3|8*]iayx{a{xJ_9|,c{Ee]QXlYb]$[%YMc*]w[aafe]aVYi[fZEii[xq2YQZHg]Y~h#|Y:thre^@^|_F^CbTbG_1^qf7{L-`VFx Zr|@EZ;gkZ@slgko`[e}T:{Cu^pddZ_`yav^Ea+[#ZBbSbO`elQfLui}.F|txYcbQ`XehcGe~fc^RlV{D_0ZAej[l&jShxG[ipB_=u:eU}3e8[=j|{D(}dO{Do[BYUZ0/]AYE]ALYhZcYlYP/^-^{Yt_1_-;YT`P4BZG=IOZ&]H[e]YYd[9^F[1YdZxZ?Z{Z<]Ba2[5Yb[0Z4l?]d_;_)a?YGEYiYv`_XmZs4ZjY^Zb]6gqGaX^9Y}dXZr[g|]Y}K aFZp^k^F]M`^{O1Ys]ZCgCv4|E>}8eb7}l`{L5[Z_faQ|c2}Fj}hw^#|Ng|B||w2|Sh{v+[G}aB|MY}A{|8o}X~{E8paZ:]i^Njq]new)`-Z>haounWhN}c#{DfZ|fK]KqGZ=:u|fqoqcv}2ssm}.r{]{nIfV{JW)[K|,Z{Uxc|]l_KdCb%]cfobya3`p}G^|LZiSC]U|(X|kBlVg[kNo({O:g:|-N|qT}9?{MBiL}Sq{`P|3a|u.{Uaq:{_o|^S}jX{Fob0`;|#y_@[V[K|cw[<_ }KU|0F}d3|et{Q7{LuZttsmf^kYZ`Af`}$x}U`|Ww}d]| >}K,r&|XI|*e{C/a-bmr1fId4[;b>tQ_:]hk{b-pMge]gfpo.|(w[jgV{EC1Z,YhaY^q,_G[c_g[J0YX]`[h^hYK^_Yib,` {i6vf@YM^hdOKZZn(jgZ>bzSDc^Z%[[o9[2=/YHZ(_/Gu_`*|8z{DUZxYt^vuvZjhi^lc&gUd4|<UiA`z]$b/Z?l}YI^jaHxe|;F}l${sQ}5g}hA|e4}?o{ih}Uz{C)jPe4]H^J[Eg[|AMZMlc}:,{iz}#*|gc{Iq|/:|zK{l&}#u|myd{{M&v~nV};L|(g|I]ogddb0xsd7^V})$uQ{HzazsgxtsO^l}F>ZB]r|{7{j@cU^{{CbiYoHlng]f+nQ[bkTn/}<-d9q {KXadZYo+n|l[|lc}V2{[a{S4Zam~Za^`{HH{xx_SvF|ak=c^[v^7_rYT`ld@]:_ub%[$[m](Shu}G2{E.ZU_L_R{tz`vj(f?^}hswz}GdZ}{S:h`aD|?W|`dgG|if{a8|J1{N,}-Ao3{H#{mfsP|[ bzn+}_Q{MT{u4kHcj_q`eZj[8o0jy{p7}C|[}l){MuYY{|Ff!Ykn3{rT|m,^R|,R}$~Ykgx{P!]>iXh6[l[/}Jgcg{JYZ.^qYfYIZl[gZ#Xj[Pc7YyZD^+Yt;4;`e8YyZVbQ7YzZxXja.7SYl[s]2^/Ha$[6ZGYrb%XiYdf2]H]kZkZ*ZQ[ZYS^HZXcCc%Z|[(bVZ]]:OJQ_DZCg<[,]%Zaa [g{C00HY[c%[ChyZ,Z_`PbXa+eh`^&jPi0a[ggvhlekL]w{Yp^v}[e{~;k%a&k^|nR_z_Qng}[E}*Wq:{k^{FJZpXRhmh3^p>de^=_7`|ZbaAZtdhZ?n4ZL]u`9ZNc3g%[6b=e.ZVfC[ZZ^^^hD{E(9c(kyZ=bb|Sq{k`|vmr>izlH[u|e`}49}Y%}FT{[z{Rk}Bz{TCc/lMiAqkf(m$hDc;qooi[}^o:c^|Qm}a_{mrZ(pA`,}<2sY| adf_%|}`}Y5U;}/4|D>|$X{jw{C<|F.hK|*A{MRZ8Zsm?imZm_?brYWZrYx`yVZc3a@f?aK^ojEd {bN}/3ZH]/$YZhm^&j 9|(S|b]mF}UI{q&aM]LcrZ5^.|[j`T_V_Gak}9J[ ZCZD|^h{N9{~&[6Zd{}B}2O|cv]K}3s}Uy|l,fihW{EG`j_QOp~Z$F^zexS`dcISfhZBXP|.vn|_HYQ|)9|cr]<`&Z6]m_(ZhPcSg>`Z]5`~1`0Xcb4k1{O!bz|CN_T{LR|a/gFcD|j<{Z._[f)mPc:1`WtIaT1cgYkZOaVZOYFrEe[}T$}Ch}mk{K-^@]fH{Hdi`c*Z&|Kt{if[C{Q;{xYB`dYIX:ZB[}]*[{{p9|4GYRh2ao{DS|V+[zd$`F[ZXKadb*A] Ys]Maif~a/Z2bmclb8{Jro_rz|x9cHojbZ{GzZx_)]:{wAayeDlx}<=`g{H1{l#}9i|)=|lP{Qq}.({La|!Y{i2EZfp=c*}Cc{EDvVB|;g}2t{W4av^Bn=]ri,|y?|3+}T*ckZ*{Ffr5e%|sB{lx^0]eZb]9[SgAjS_D|uHZx]dive[c.YPkcq/}db{EQh&hQ|eg}G!ljil|BO]X{Qr_GkGl~YiYWu=c3eb}29v3|D|}4i||.{Mv})V{SP1{FX}CZW6{cm|vO{pS|e#}A~|1i}81|Mw}es|5[}3w{C`h9aL]o{}p[G`>i%a1Z@`Ln2bD[$_h`}ZOjhdTrH{[j_:k~kv[Sdu]CtL}41{I |[[{]Zp$]XjxjHt_eThoa#h>sSt8|gK|TVi[Y{t=}Bs|b7Zpr%{gt|Yo{CS[/{iteva|cf^hgn}($_c^wmb^Wm+|55jrbF|{9^ q6{C&c+ZKdJkq_xOYqZYSYXYl`8]-cxZAq/b%b*_Vsa[/Ybjac/OaGZ4fza|a)gY{P?| I|Y |,pi1n7}9bm9ad|=d{aV|2@[(}B`d&|Uz}B}{`q|/H|!JkM{FU|CB|.{}Az}#P|lk}K{|2rk7{^8^?`/|k>|Ka{Sq}Gz}io{DxZh[yK_#}9<{TRdgc]`~Z>JYmYJ]|`!ZKZ]gUcx|^E[rZCd`f9oQ[NcD_$ZlZ;Zr}mX|=!|$6ZPZYtIo%fj}CpcN|B,{VDw~gb}@hZg`Q{LcmA[(bo`<|@$|o1|Ss}9Z_}tC|G`{F/|9nd}i=}V-{L8aaeST]daRbujh^xlpq8|}zs4bj[S`J|]?G{P#{rD{]I`OlH{Hm]VYuSYUbRc*6[j`8]pZ[bt_/^Jc*[<Z?YE|Xb|?_Z^Vcas]h{t9|Uwd)_(=0^6Zb{Nc} E[qZAeX[a]P^|_J>e8`W^j_Y}R{{Jp__]Ee#e:iWb9q_wKbujrbR}CY`,{mJ}gz{Q^{t~N|? gSga`V_||:#mi}3t|/I`X{N*|ct|2g{km}gi|{={jC}F;|E}{ZZjYf*frmu}8Tdroi{T[|+~}HG{cJ}DM{Lp{Ctd&}$hi3|FZ| m}Kr|38}^c|m_|Tr{Qv|36}?Up>|;S{DV{k_as}BK{P}}9p|t`jR{sAm4{D=b4pWa[}Xi{EjwEkI}3S|E?u=X0{jf} S|NM|JC{qo^3cm]-|JUx/{Cj{s>{Crt[UXuv|D~|j|d{YXZR}Aq}0r}(_{pJfi_z}0b|-vi)Z mFe,{f4|q`b{}^Z{HM{rbeHZ|^x_o|XM|L%|uFXm}@C_{{Hhp%a7|0p[Xp+^K}9U{bP}: tT}B|}+$|b2|[^|~h{FAby[`{}xgygrt~h1[li`c4vz|,7p~b(|mviN}^pg[{N/|g3|^0c,gE|f%|7N{q[|tc|TKA{LU}I@|AZp(}G-sz{F |qZ{}F|f-}RGn6{Z]_5})B}UJ{FFb2]4ZI@v=k,]t_Dg5Bj]Z-]L]vrpdvdGlk|gF}G]|IW}Y0[G| /bo|Te^,_B}#n^^{QHYI[?hxg{[`]D^IYRYTb&kJ[cri[g_9]Ud~^_]<p@_e_XdNm-^/|5)|h_{J;{kacVopf!q;asqd}n)|.m|bf{QW|U)}b+{tL|w``N|to{t ZO|T]jF}CB|0Q{e5Zw|k |We}5:{HO{tPwf_uajjBfX}-V_C_{{r~gg|Ude;s+}KNXH}! `K}eW{Upwbk%ogaW}9EYN}YY|&v|SL{C3[5s.]Y]I]u{M6{pYZ`^,`ZbCYR[1mNg>rsk0Ym[jrE]RYiZTr*YJ{Ge|%-lf|y(`=[t}E6{k!|3)}Zk} ][G{E~cF{u3U.rJ|a9p#o#ZE|?|{sYc#vv{E=|LC}cu{N8`/`3`9rt[4|He{cq|iSYxY`}V |(Q|t4{C?]k_Vlvk)BZ^r<{CL}#h}R+[<|i=}X|{KAo]|W<`K{NW|Zx}#;|fe{IMr<|K~tJ_x}AyLZ?{GvbLnRgN}X&{H7|x~}Jm{]-| GpNu0}.ok>|c4{PYisrDZ|fwh9|hfo@{H~XSbO]Odv]%`N]b1Y]]|eIZ}_-ZA]aj,>eFn+j[aQ_+]h[J_m_g]%_wf.`%k1e#Z?{CvYu_B^|gk`Xfh^M3`afGZ-Z|[m{L}|k3cp[it ^>YUi~d>{T*}YJ{Q5{Jxa$hg|%4`}|LAgvb }G}{P=|<;Ux{_skR{cV|-*|s-{Mp|XP|$G|_J}c6cM{_=_D|*9^$ec{V;|4S{qO|w_|.7}d0|/D}e}|0G{Dq]Kdp{}dfDi>}B%{Gd|nl}lf{C-{y}|ANZr}#={T~|-(}c&{pI|ft{lsVP}){|@u}!W|bcmB{d?|iW|:dxj{PSkO|Hl]Li:}VYk@|2={fnWt{M3`cZ6|)}|Xj}BYa?vo{e4|L7|B7{L7|1W|lvYO}W8nJ|$Vih|{T{d*_1|:-n2dblk``fT{Ky|-%}m!|Xy|-a{Pz}[l{kFjz|iH}9N{WE{x,|jz}R {P|{D)c=nX|Kq|si}Ge{sh|[X{RF{t`|jsr*fYf,rK|/9}$}}Nf{y!1|<Std}4Wez{W${Fd_/^O[ooqaw_z[L`Nbv[;l7V[ii3_PeM}.h^viqYjZ*j1}+3{bt{DR[;UG}3Og,rS{JO{qw{d<_zbAh<R[1_r`iZTbv^^a}c{iEgQZ<exZFg.^Rb+`Uj{a+{z<[~r!]`[[|rZYR|?F|qppp]L|-d|}K}YZUM|=Y|ktm*}F]{D;g{uI|7kg^}%?Z%ca{N[_<q4xC]i|PqZC]n}.bDrnh0Wq{tr|OMn6tM|!6|T`{O`|>!]ji+]_bTeU}Tq|ds}n|{Gm{z,f)}&s{DPYJ`%{CGd5v4tvb*hUh~bf]z`jajiFqAii]bfy^U{Or|m+{I)cS|.9k:e3`^|xN}@Dnlis`B|Qo{`W|>||kA}Y}{ERYuYx`%[exd`]|OyiHtb}HofUYbFo![5|+]gD{NIZR|Go}.T{rh^4]S|C9_}xO^i`vfQ}C)bK{TL}cQ|79iu}9a];sj{P.o!f[Y]pM``Jda^Wc9ZarteBZClxtM{LW}l9|a.mU}KX}4@{I+f1}37|8u}9c|v${xGlz}jP{Dd1}e:}31}%3X$|22i<v+r@~mf{sN{C67G97855F4YL5}8f{DT|xy{sO{DXB334@55J1)4.G9A#JDYtXTYM4, YQD9;XbXm9SX]IB^4UN=Xn<5(;(F3YW@XkH-X_VM[DYM:5XP!T&Y`6|,^{IS-*D.H>:LXjYQ0I3XhAF:9:(==.F*3F1189K/7163D,:@|e2{LS36D4hq{Lw/84443@4.933:0307::6D7}&l{Mx657;89;,K5678H&93D(H<&<>0B90X^I;}Ag1{P%3A+>><975}[S{PZE453?4|T2{Q+5187;>447:81{C=hL6{Me^:=7ii{R=.=F<81;48?|h8}Uh{SE|,VxL{ST,7?9Y_5Xk3A#:$%YSYdXeKXOD8+TXh7(@>(YdXYHXl9J6X_5IXaL0N?3YK7Xh!1?XgYz9YEXhXaYPXhC3X`-YLY_XfVf[EGXZ5L8BXL9YHX]SYTXjLXdJ: YcXbQXg1PX]Yx4|Jr{Ys4.8YU+XIY`0N,<H%-H;:0@,74/:8546I=9177154870UC]d<C3HXl7ALYzXFXWP<<?E!88E5@03YYXJ?YJ@6YxX-YdXhYG|9o{`iXjY_>YVXe>AYFX[/(I@0841?):-B=14337:8=|14{c&93788|di{cW-0>0<097/A;N{FqYpugAFT%X/Yo3Yn,#=XlCYHYNX[Xk3YN:YRT4?)-YH%A5XlYF3C1=NWyY}>:74-C673<69545v {iT85YED=64=.F4..9878/D4378?48B3:7:7/1VX[f4{D,{l<5E75{dAbRB-8-@+;DBF/$ZfW8S<4YhXA.(5@*11YV8./S95C/0R-A4AXQYI7?68167B95HA1*<M3?1/@;/=54XbYP36}lc{qzSS38:19?,/39193574/66878Yw1X-87E6=;964X`T734:>86>1/=0;(I-1::7ALYGXhF+Xk[@W%TYbX7)KXdYEXi,H-XhYMRXfYK?XgXj.9HX_SX]YL1XmYJ>Y}WwIXiI-3-GXcYyXUYJ$X`Vs[7;XnYEZ;XF! 3;%8;PXX(N3Y[)Xi1YE&/ :;74YQ6X`33C;-(>Xm0(TYF/!YGXg8 9L5P01YPXO-5%C|qd{{/K/E6,=0144:361:955;6443@?B7*7:F89&F35YaX-CYf,XiFYRXE_e{}sF 0*7XRYPYfXa5YXXY8Xf8Y~XmA[9VjYj*#YMXIYOXk,HHX40YxYMXU8OXe;YFXLYuPXP?EB[QV0CXfY{:9XV[FWE0D6X^YVP*$4%OXiYQ(|xp|%c3{}V`1>Y`XH00:8/M6XhQ1:;3414|TE|&o@1*=81G8<3}6<|(f6>>>5-5:8;093B^3U*+*^*UT30XgYU&7*O1953)5@E78--F7YF*B&0:%P68W9Zn5974J9::3}Vk|-,C)=)1AJ4+<3YGXfY[XQXmT1M-XcYTYZXCYZXEYXXMYN,17>XIG*SaS|/eYJXbI?XdNZ+WRYP<F:R PXf;0Xg`$|1GX9YdXjLYxWX!ZIXGYaXNYm6X9YMX?9EXmZ&XZ#XQ>YeXRXfAY[4 ;0X!Zz0XdN$XhYL XIY^XGNXUYS/1YFXhYk.TXn4DXjB{jg|4DEX]:XcZMW=A.+QYL<LKXc[vV$+&PX*Z3XMYIXUQ:ZvW< YSXFZ,XBYeXMM)?Xa XiZ4/EXcP3%}&-|6~:1(-+YT$@XIYRBC<}&,|7aJ6}bp|8)K1|Xg|8C}[T|8Q.89;-964I38361<=/;883651467<7:>?1:.}le|:Z=39;1Y^)?:J=?XfLXbXi=Q0YVYOXaXiLXmJXO5?.SFXiCYW}-;|=u&D-X`N0X^,YzYRXO(QX_YW9`I|>hZ:N&X)DQXP@YH#XmNXi$YWX^=!G6YbYdX>XjY|XlX^XdYkX>YnXUXPYF)FXT[EVTMYmYJXmYSXmNXi#GXmT3X8HOX[ZiXN]IU2>8YdX1YbX<YfWuZ8XSXcZU%0;1XnXkZ_WTG,XZYX5YSX Yp 05G?XcYW(IXg6K/XlYP4XnI @XnO1W4Zp-9C@%QDYX+OYeX9>--YSXkD.YR%Q/Yo YUX].Xi<HYEZ2WdCE6YMXa7F)=,D>-@9/8@5=?7164;35387?N<618=6>7D+C50<6B03J0{Hj|N9$D,9I-,.KB3}m |NzE0::/81YqXjMXl7YG; [.W=Z0X4XQY]:MXiR,XgM?9$9>:?E;YE77VS[Y564760391?14941:0=:8B:;/1DXjFA-564=0B3XlH1+D85:0Q!B#:-6&N/:9<-R3/7Xn<*3J4.H:+334B.=>30H.;3833/76464665755:/83H6633:=;.>5645}&E|Y)?1/YG-,93&N3AE@5 <L1-G/8A0D858/30>8<549=@B8] V0[uVQYlXeD(P#ID&7T&7;Xi0;7T-$YE)E=1:E1GR):--0YI7=E<}n9|aT6783A>D7&4YG7=391W;Zx<5+>F#J39}o/|cc;6=A050EQXg8A1-}D-|d^5548083563695D?-.YOXd37I$@LYLWeYlX<Yd+YR A$;3-4YQ-9XmA0!9/XLY_YT(=5XdDI>YJ5XP1ZAW{9>X_6R(XhYO65&J%DA)C-!B:97#A9;@?F;&;(9=11/=657/H,<8}bz|j^5446>.L+&Y^8Xb6?(CYOXb*YF(8X`FYR(XPYVXmPQ%&DD(XmZXW??YOXZXfCYJ79,O)XnYF7K0!QXmXi4IYFRXS,6<%-:YO(+:-3Q!1E1:W,Zo}Am|n~;3580534*?3Zc4=9334361693:30C<6/717:<1/;>59&:4}6!|rS36=1?75<8}[B|s809983579I.A.>84758=108564741H*9E{L{|u%YQ<%6XfH.YUXe4YL@,>N}Tv|ve*G0X)Z;/)3@A74(4P&A1X:YVH97;,754*A66:1 D739E3553545558E4?-?K17/770843XAYf838A7K%N!YW4.$T19Z`WJ*0XdYJXTYOXNZ 1XaN1A+I&Xi.Xk3Z3GB&5%WhZ1+5#Y[X<4YMXhQYoQXVXbYQ8XSYUX4YXBXWDMG0WxZA[8V+Z8X;D],Va$%YeX?FXfX[XeYf<X:Z[WsYz8X_Y]%XmQ(!7BXIZFX]&YE3F$(1XgYgYE& +[+W!<YMYFXc;+PXCYI9YrWxGXY9DY[!GXiI7::)OC;*$.>N*HA@{C|}&k=:<TB83X`3YL+G4XiK]i}(fYK<=5$.FYE%4*5*H*6XkCYL=*6Xi6!Yi1KXR4YHXbC8Xj,B9ZbWx/XbYON#5B}Ue}+QKXnF1&YV5XmYQ0!*3IXBYb71?1B75XmF;0B976;H/RXU:YZX;BG-NXj;XjI>A#D3B636N;,*%<D:0;YRXY973H5)-4FXOYf0:0;/7759774;7;:/855:543L43<?6=E,.A4:C=L)%4YV!1(YE/4YF+ F3%;S;&JC:%/?YEXJ4GXf/YS-EXEYW,9;E}X$}547EXiK=51-?71C%?57;5>463553Zg90;6447?<>4:9.7538XgN{|!}9K/E&3-:D+YE1)YE/3;37/:05}n<}:UX8Yj4Yt864@JYK..G=.(A Q3%6K>3(P3#AYE$-6H/456*C=.XHY[#S.<780191;057C)=6HXj?955B:K1 E>-B/9,;5.!L?:0>/.@//:;7833YZ56<4:YE=/:7Z_WGC%3I6>XkC*&NA16X=Yz2$X:Y^&J48<99k8}CyB-61<18K946YO4{|N}E)YIB9K0L>4=46<1K0+R;6-=1883:478;4,S+3YJX`GJXh.Yp+Xm6MXcYpX(>7Yo,/:X=Z;Xi0YTYHXjYmXiXj;*;I-8S6N#XgY}.3XfYGO3C/$XjL$*NYX,1 6;YH&<XkK9C#I74.>}Hd`A748X[T450[n75<4439:18A107>|ET}Rf<1;14876/Yb983E<5.YNXd4149>,S=/4E/<306443G/06}0&}UkYSXFYF=44=-5095=88;63844,9E6644{PL}WA8:>)7+>763>>0/B3A545CCnT}Xm|dv}Xq1L/YNXk/H8;;.R63351YY747@15YE4J8;46;.38.>4A369.=-83,;Ye3?:3@YE.4-+N353;/;@(X[YYD>@/05-I*@.:551741Yf5>6A443<3535;.58/86=D4753442$635D1>0359NQ @73:3:>><Xn?;43C14 ?Y|X611YG1&<+,4<*,YLXl<1/AIXjF*N89A4Z576K1XbJ5YF.ZOWN.YGXO/YQ01:4G38Xl1;KI0YFXB=R<7;D/,/4>;$I,YGXm94@O35Yz66695385.>:6A#5}W7n^4336:4157597434433<3|XA}m`>=D>:4A.337370?-6Q96{`E|4A}C`|Qs{Mk|J+~r>|o,wHv>Vw}!c{H!|Gb|*Ca5}J||,U{t+{CN[!M65YXOY_*B,Y[Z9XaX[QYJYLXPYuZ%XcZ8LY[SYPYKZM<LMYG9OYqSQYM~[e{UJXmQYyZM_)>YjN1~[f3{aXFY|Yk:48YdH^NZ0|T){jVFYTZNFY^YTYN~[h{nPYMYn3I]`EYUYsYIZEYJ7Yw)YnXPQYH+Z.ZAZY]^Z1Y`YSZFZyGYHXLYG 8Yd#4~[i|+)YH9D?Y^F~Y7|-eYxZ^WHYdYfZQ~[j|3>~[k|3oYmYqY^XYYO=Z*4[]Z/OYLXhZ1YLZIXgYIHYEYK,<Y`YEXIGZI[3YOYcB4SZ!YHZ*&Y{Xi3~[l|JSY`Zz?Z,~[m|O=Yi>??XnYWXmYS617YVYIHZ(Z4[~L4/=~[n|Yu{P)|];YOHHZ}~[o33|a>~[r|aE]DH~[s|e$Zz~[t|kZFY~XhYXZB[`Y}~[u|{SZ&OYkYQYuZ2Zf8D~[v}% ~[w3},Q[X]+YGYeYPIS~[y}4aZ!YN^!6PZ*~[z}?E~[{3}CnZ=~[}}EdDZz/9A3(3S<,YR8.D=*XgYPYcXN3Z5 4)~[~}JW=$Yu.XX~] }KDX`PXdZ4XfYpTJLY[F5]X~[2Yp}U+DZJ::<446[m@~]#3}]1~]%}^LZwZQ5Z`/OT<Yh^ -~]&}jx[ ~m<z!%2+~ly4VY-~o>}p62yz!%2+Xf2+~ly4VY-zQ`z (=] 2z~o2",C={" ":0,"!":1},c=34,i=2,p,s="",u=String.fromCharCode,t=u(12539);for(;++c<127;)C[u(c)]=c^39&&c^92?i++:0;i=0;for(;0<=(c=C[a.charAt(i++)]);)if(16==c)if((c=C[a.charAt(i++)])<87){if(86==c)c=1879;for(;c--;)s+=u(++p)}else s+=s.substr(8272,360);else if(c<86)s+=u(p+=c<51?c-16:(c-55)*92+C[a.charAt(i++)]);else if((c=((c-86)*92+C[a.charAt(i++)])*92+C[a.charAt(i++)])<49152)s+=u(p=c<40960?c:c|57344);else{c&=511;for(;c--;)s+=t;p=12539}return s')();

    /**
     * @param str
     * @returns {XML|string|void|*}
     */
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

    var utf8uri = new RegExp(
        "%[0-7][0-9A-F]|"+
        "%C[2-9A-F]%[89AB][0-9A-F]|%D[0-9A-F]%[89AB][0-9A-F]|"+
        "%E[0-F](?:%[89AB][0-9A-F]){2}|"+
        "%F[0-7](?:%[89AB][0-9A-F]){3}|"+
        "%F[89AB](?:%[89AB][0-9A-F]){4}|"+
        "%F[CD](?:%[89AB][0-9A-F]){5}","ig"
    );

    /**
     * @param src
     * @returns {{}}
     */
    function clone(src)
    {
        var execute = function(src, obj)
        {
            var _cloneArray = cloneArray;
            for(var prop in src) {
                var value = src[prop];
                if (prop == 'Matrix' || prop == 'ColorTransform') {
                    obj[prop] = _cloneArray(value);
                } else if(value instanceof Array) {
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
     * @param src
     * @returns {number[]}
     */
    function cloneArray(src)
    {
        var clone = [];
        var length = src.length;
        if (isArrayBuffer)
            clone = new Float32Array(length);
        for (var i = 0; i < length; i++)
            clone[i] = src[i];
        return clone;
    }

    /**
     * リサイズ
     */
    function onResizeCanvas()
    {
        var length = players.length;
        for (var i = 0; i < length; i++) {
            if (!(i in players))
                continue;
            var player = players[i];
            if (player.isLoad) {
                player.resize();
            }
        }
    }

    /**
     * @param a
     * @param b
     * @returns {Array}
     */
    function multiplicationMatrix(a, b)
    {
        return [
            a[0] * b[0] + a[2] * b[1],
            a[1] * b[0] + a[3] * b[1],
            a[0] * b[2] + a[2] * b[3],
            a[1] * b[2] + a[3] * b[3],
            a[0] * b[4] + a[2] * b[5] + a[4],
            a[1] * b[4] + a[3] * b[5] + a[5]
        ];
    }

    /**
     * @param a
     * @param b
     * @returns {Array}
     */
    function multiplicationColor(a, b)
    {
        return [
            a[0] * b[0], a[1] * b[1],
            a[2] * b[2], a[3] * b[3],
            a[0] * b[4] + a[4], a[1] * b[5] + a[5],
            a[2] * b[6] + a[6], a[3] * b[7] + a[7]
        ];
    }

    /**
     * @param bounds
     * @param matrix
     * @param object
     * @returns {{xMin: Number, xMax: number, yMin: Number, yMax: number}}
     */
    function boundsMatrix(bounds, matrix, object)
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
    }

    /**
     * @param color
     * @param data
     * @returns {{R: number, G: number, B: number, A: number}}
     */
    function generateColorTransform(color, data)
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
    }

    /**
     * @param audio
     * @param soundInfo
     */
    function startSound(audio, soundInfo)
    {
        if (soundInfo.SyncStop) {
            audio.stop();
        } else {
            if (soundInfo.HasLoops) {
                audio.loopCount = soundInfo.LoopCount;
                var loopSound = function()
                {
                    audio.loopCount--;
                    if (!this.loopCount) {
                        audio.removeEventListener('ended', loopSound);
                    } else {
                        audio.currentTime = 0;
                        if (soundInfo.HasInPoint)
                            audio.currentTime = soundInfo.InPoint;
                        audio.play();
                    }
                };
                audio.addEventListener('ended', loopSound);
            }

            audio.currentTime = 0;
            if (soundInfo.HasInPoint)
                audio.currentTime = soundInfo.InPoint;

            audio.play();
        }
    }

    /**
     * @param method
     * @returns {*}
     */
    function checkMethod(method)
    {
        var methods = {
            gotoandstop: 'gotoAndStop',
            gotoandplay: 'gotoAndPlay',
            play: 'play',
            stop: 'stop',
            duplicatemovieclip: 'duplicateMovieClip',
            getproperty: 'getProperty',
            onclipevent: 'onClipEvent',
            removemovieclip: 'removeMovieClip',
            setproperty: 'setProperty',
            startdrag: 'startDrag',
            stopdrag: 'stopDrag',
            targetpath: 'targetPath',
            updateafterevent: 'updateAfterEvent',
            nextframe: 'nextFrame',
            nextscene: 'nextScene',
            prevframe: 'prevFrame',
            prevscene: 'prevScene',
            stopallsounds: 'stopAllSounds',
            setmask: 'setMask',
            geturl: 'getURL',
            loadmovie: 'loadMovie',
            loadmovienum: 'loadMovieNum',
            loadvariables : 'loadVariables',
            loadvariablesnum: 'loadVariablesNum',
            unloadmovie: 'unloadMovie',
            unloadmovienum: 'unloadMovieNum',
            swapdepths: 'swapDepths',
            attachmovie: 'attachMovie',
            getnexthighestdepth: 'getNextHighestDepth',
            getbytesloaded: 'getBytesLoaded',
            getbytestotal: 'getBytesTotal'
        };

        var lowerMethod = method.toLowerCase();
        return (lowerMethod in methods) ? methods[lowerMethod] : method;
    }

    /**
     * @param compressed
     * @param isDeCompress
     * @returns {Array}
     */
    function unzip(compressed, isDeCompress)
    {
        var sym = 0;
        var i = 0;
        var buff = [];
        var bitLengths = [];
        var _buildHuffTable = buildHuffTable;
        var _decodeSymbol = decodeSymbol;

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

        if (isDeCompress) {
            bitio.setOffset(10, 8);
        } else {
            bitio.setOffset(2, 8);
        }

        for (; !done; ) {
            var done = bitio.readUB(1);
            var type = bitio.readUB(2);

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
                        for(i = 32; i--;)
                            bitLengths[bitLengths.length] = 5;
                        distTable = fixedDistTable = _buildHuffTable(bitLengths);
                    }

                    if (!litTable) {
                        bitLengths = [];
                        i = 0;
                        for(; i < 144; i++)
                            bitLengths[bitLengths.length] = 8;
                        for(; i < 256; i++)
                            bitLengths[bitLengths.length] = 9;
                        for(; i < 280; i++)
                            bitLengths[bitLengths.length] = 7;
                        for(; i < 288; i++)
                            bitLengths[bitLengths.length] = 8;
                        litTable = fixedLitTable = _buildHuffTable(bitLengths);
                    }
                } else {
                    var numLitLengths = bitio.readUB(5) + 257;
                    var numDistLengths = bitio.readUB(5) + 1;
                    var numCodeLengths = bitio.readUB(4) + 4;
                    var codeLengths = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    if (isArrayBuffer)
                        codeLengths = new Uint8Array(codeLengths);

                    for(i = 0; i < numCodeLengths; i++)
                        codeLengths[ORDER[i]] = bitio.readUB(3);

                    var codeTable = _buildHuffTable(codeLengths);
                    codeLengths = null;

                    var litLengths = [];
                    var prevCodeLen = 0;
                    var maxLengths = numLitLengths + numDistLengths;
                    for (; litLengths.length < maxLengths; ) {
                        sym = _decodeSymbol(bitio, codeTable);
                        switch (sym) {
                            case 16:
                                i = bitio.readUB(2) + 3;
                                for (; i--; )
                                    litLengths[litLengths.length] = prevCodeLen;
                                break;
                            case 17:
                                i = bitio.readUB(3) + 3;
                                for (; i--; )
                                    litLengths[litLengths.length] = 0;
                                break;
                            case 18:
                                i = bitio.readUB(7) + 11;
                                for (; i--; )
                                    litLengths[litLengths.length] = 0;
                                break;
                            default:
                                if(sym <= 15){
                                    litLengths[litLengths.length] = sym;
                                    prevCodeLen = sym;
                                }
                                break;
                        }
                    }
                    distTable = _buildHuffTable(litLengths.splice(numLitLengths, numDistLengths));
                    litTable = _buildHuffTable(litLengths);
                }

                sym = 0;
                for (; sym != 256; ) {
                    sym = _decodeSymbol(bitio, litTable);

                    if (sym < 256) {
                        buff[buff.length] = sym;
                    } else if (sym > 256) {
                        var mapIdx = sym - 257;
                        var len = LENS[mapIdx] + bitio.readUB(LEXT[mapIdx]);
                        var distMap = _decodeSymbol(bitio, distTable);
                        var dist = DISTS[distMap] + bitio.readUB(DEXT[distMap]);
                        i = buff.length - dist;
                        for (; len--; )
                            buff[buff.length] = buff[i++];
                    }
                }
            } else {
                bitio.bit_offset = 8;
                bitio.bit_buffer = null;
                var len = bitio.readNumber(2);
                var nlen = bitio.readNumber(2);
                for (; len--; )
                    buff[buff.length] = bitio.readNumber(1);
            }
        }
        return buff;
    }

    /**
     * @param bitLengths
     * @returns {{}}
     */
    function buildHuffTable(bitLengths)
    {
        var numLengths = bitLengths.length;
        var blCount = [];
        var maxBits = _max.apply(Math, bitLengths) + 1;
        var nextCode = [];
        var code = 0;
        var table = {};
        var i = numLengths;
        var len = 0;

        for (; i--; ) {
            len = bitLengths[i];
            blCount[len] = (blCount[len] || 0) + (len > 0);
        }

        for (i = 1; i < maxBits; i++) {
            len = i - 1;
            if (!(len in blCount))
                blCount[len] = 0;
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
    }

    /**
     * @param bitio
     * @param table
     * @returns {*}
     */
    function decodeSymbol(bitio, table)
    {
        var code = 0;
        var len = 0;
        for (;;) {
            code = (code << 1) | bitio.readUB(1);
            len++;
            if (!(code in table))
                continue;
            var entry = table[code];
            if (entry.length == len)
                return entry.symbol;
        }
    }

    /**
     * addEventListener
     */
    window.addEventListener('resize', function(event)
    {
        _clearTimeout(resizeId);
        resizeId = _setTimeout(onResizeCanvas, 300);
    });

    /**
     * unload
     */
    function unload()
    {
        players = null;
        window.removeEventListener('unload', unload);
    }
    window.addEventListener('unload', unload);

    /**
     * tmp canvas clear
     */
    function clearTmp()
    {
        var canvas = tmpContext.canvas;
        tmpContext.setTransform(1, 0, 0, 1, 0, 0);
        tmpContext.clearRect(0, 0, canvas.width + 1, canvas.height + 1);
    }

    /**
     * @constructor
     */
    var VectorToCanvas = function(){};

    /**
     * @param shapes
     * @param isMorph
     * @returns {Array}
     */
    VectorToCanvas.prototype.execute = function(shapes, isMorph)
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
        var _clone = clone;
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
                    stack = _this.setStack(stack, _this.fillMerge(fills0, fills1, isMorph));
                    stack = _this.setStack(stack, lines);
                    fills0 = [];
                    fills1 = [];
                    lines = [];

                    if (record.NumFillBits)
                        fillStyles = record.FillStyles.fillStyles;

                    if (record.NumLineBits)
                        lineStyles = record.LineStyles.lineStyles;
                }

                MoveX = AnchorX;
                MoveY = AnchorY;
                if (record.StateMoveTo) {
                    MoveX = record.MoveX;
                    MoveY = record.MoveY;
                }
                LineX = MoveX;
                LineY = MoveY;

                if (record.StateFillStyle0)
                    FillStyle0 = record.FillStyle0;

                if (record.StateFillStyle1)
                    FillStyle1 = record.FillStyle1;

                if (record.StateLineStyle)
                    LineStyle = record.LineStyle;

                continue;
            }

            AnchorX = record.AnchorX;
            AnchorY = record.AnchorY;
            var ControlX = record.ControlX;
            var ControlY = record.ControlY;
            var isCurved = record.isCurved;
            if (FillStyle0) {
                idx = FillStyle0 - 1;
                if (!(idx in fills0))
                    fills0[idx] = [];

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
                cache[cache.length] = _clone(record);
                obj.endX = AnchorX;
                obj.endY = AnchorY;
            }

            if (FillStyle1) {
                idx = FillStyle1 - 1;
                if (!(idx in fills1))
                    fills1[idx] = [];

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
                cache[cache.length] = _clone(record);
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
                cache[cache.length] = (isCurved)
                    ? [1, ControlX, ControlY, AnchorX, AnchorY]
                    : [2, AnchorX, AnchorY];
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
    VectorToCanvas.prototype.fillMerge = function(fills0, fills1, isMorph)
    {
        var _this = this;
        fills0 = _this.fillReverse(fills0);
        var length = fills0.length;
        for (var i = 0; i < length; i++) {
            if (!(i in fills0))
                continue;
            var fills = fills0[i];
            if (i in fills1) {
                var fill1 = fills1[i];
                var fLen = fills.length;
                for (var depth = 1; depth < fLen; depth++) {
                    if (!(depth in fills))
                        continue;
                    fill1[fill1.length] = fills[depth];
                }
            } else {
                fills1[i] = fills;
            }
        }

        return _this.coordinateAdjustment(fills1, isMorph);
    };

    /**
     * @param fills0
     * @returns {*}
     */
    VectorToCanvas.prototype.fillReverse = function(fills0)
    {
        var length = fills0.length;
        for (var i = 0; i < length; i++) {
            if (!(i in fills0))
                continue;
            var fills = fills0[i];
            var fLen = fills.length;
            for (var depth = 1; depth < fLen; depth++) {
                if (!(depth in fills))
                    continue;
                var AnchorX = 0;
                var AnchorY = 0;
                var obj = fills[depth];
                var cacheX = obj.startX;
                var cacheY = obj.startY;
                var cache = obj.cache;
                var cLen = cache.length;
                if (cLen) {
                    for (var idx = 0; idx < cLen; idx++) {
                        var recode = cache[idx];
                        AnchorX = recode.AnchorX;
                        AnchorY = recode.AnchorY;
                        recode.AnchorX = cacheX;
                        recode.AnchorY = cacheY;
                        cacheX = AnchorX;
                        cacheY = AnchorY;
                    }
                    var array = [];
                    for (; cLen--;)
                        array[array.length] = cache[cLen];
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
     * 座標調整
     * @param fills1
     * @param isMorph
     */
    VectorToCanvas.prototype.coordinateAdjustment = function(fills1, isMorph)
    {
        var length = fills1.length;
        for (var i = 0; i < length; i++) {
            if (!(i in fills1))
                continue;
            var array = [];
            var fills = fills1[i];
            var fLen = fills.length;
            for (var depth = 1; depth < fLen; depth++) {
                if (!(depth in fills))
                    continue;
                array[array.length] = fills[depth];
            }

            var adjustment = [];
            if (array.length > 1 && !isMorph) {
                for (;;) {
                    if (!array.length)
                        break;
                    var fill = array.shift();

                    if (fill.startX == fill.endX && fill.startY == fill.endY) {
                        adjustment[adjustment.length] = fill;
                        continue;
                    }

                    var comparison = array.shift();
                    if (!comparison)
                        break;

                    if (comparison.startX == fill.endX && comparison.startY == fill.endY) {
                        fill.endX = comparison.endX;
                        fill.endY = comparison.endY;
                        var cache0 = fill.cache;
                        var cache1 = comparison.cache;
                        var cLen = cache1.length;
                        for (var cIdx = 0; cIdx < cLen; cIdx++)
                            cache0[cache0.length] = cache1[cIdx];

                        array.unshift(fill);
                        continue;
                    }

                    array.unshift(fill);
                    array[array.length] = comparison;
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
                    cache[cache.length] = (r.isCurved)
                        ? [1, r.ControlX, r.ControlY, r.AnchorX, r.AnchorY]
                        : [2, r.AnchorX, r.AnchorY];
                }
            }

            fills1[i] = { cache: cache, obj: obj };
        }
        return fills1;
    };

    /**
     * @param stack
     * @param array
     * @returns {*}
     */
    VectorToCanvas.prototype.setStack = function(stack, array)
    {
        var _this = this;
        var length = array.length;
        var _buildCommand = _this.buildCommand;
        for (var i = 0; i < length; i++) {
            if (!(i in array))
                continue;
            var data = array[i];
            stack[stack.length] = {
                obj: data.obj,
                cmd: _buildCommand.call(_this, data.cache)
            };
        }
        return stack;
    };

    /**
     * @param cache
     * @returns {*}
     */
    VectorToCanvas.prototype.buildCommand = function(cache)
    {
        var length = cache.length;
        var str = '';
        for (var i = 0; i < length; i++) {
            var a = cache[i];
            switch (a[0]) {
                case 0:
                    str += 'ctx.moveTo('+a[1]+','+a[2]+');';
                    break;
                case 1:
                    str += 'ctx.quadraticCurveTo('+a[1]+','+a[2]+','+a[3]+','+a[4]+');';
                    break;
                case 2:
                    str += 'ctx.lineTo('+a[1]+','+a[2]+');';
                    break;
            }
        }
        cache.str = str;
        return new Function('ctx', str);
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
    CacheStore.prototype.reset = function()
    {
        var _this = this;
        var _destroy = _this.destroy;
        var store = _this.store;
        for (var cacheKey in store) {
            var deleteCtx = store[cacheKey];
            if (!(deleteCtx instanceof CanvasRenderingContext2D))
                continue;
            _destroy.call(_this, deleteCtx);
        }
        _this.store = {};
        _this.size = 73400320;
    };

    /**
     * @param ctx
     */
    CacheStore.prototype.destroy = function(ctx)
    {
        var pool = this.pool;
        var canvas = ctx.canvas;
        ctx.clearRect(0, 0, canvas.width+1, canvas.height+1);
        canvas.width = 0;
        canvas.height = 0;
        pool[pool.length] = canvas;
    };

    /**
     * @returns {*}
     */
    CacheStore.prototype.getCanvas = function()
    {
        return this.pool.pop() || _document.createElement('canvas');
    };

    /**
     * @param key
     * @returns {*}
     */
    CacheStore.prototype.get = function(key)
    {
        return this.store[key];
    };

    /**
     * @param key
     * @param value
     */
    CacheStore.prototype.set = function(key, value)
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
    CacheStore.prototype.generateKey = function(name, id, matrix, cxForm)
    {
        var key = name +"_"+ id;
        if (matrix != undefined) {
            for (var i in matrix)
                key += "_"+ matrix[i];
        }
        if (cxForm != undefined) {
            for (var i in cxForm)
                key += "_"+ cxForm[i]
        }
        return key;
    };
    var cacheStore = new CacheStore();

    /**
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
     * @param binary
     */
    BitIO.prototype.init = function(binary)
    {
        var length = binary.length;
        var array = this.createArray(length);
        for (var key = 0; length--; key++)
            array[key] = binary.charCodeAt(key) & 0xff;
        this.data = array;
    };

    /**
     * @param length
     * @returns {Array}
     */
    BitIO.prototype.createArray = function(length)
    {
        return (isArrayBuffer) ? new Uint8Array(length) : [];
    };

    /**
     * @param data
     */
    BitIO.prototype.setData = function(data)
    {
        this.data = data;
    };

    /**
     * @returns {string}
     */
    BitIO.prototype.getHeaderSignature = function()
    {
        var _this = this;
        var str = '';
        var count = 3;
        for (; count; ) {
            var code = _this.getUI8();
            // trim
            switch (code) {
                case 32:
                case 96:
                case 127:
                    continue;
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
    BitIO.prototype.getVersion = function()
    {
        return this.getUI8();
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
        for (; length; ) {
            array[key++] = data[_this.byte_offset++];
            length--;
        }
        return array;
    };

    /**
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
            for (;;) {
                var val = data[bo + offset];
                offset++;
                if (val == 0 || (bo + offset) >= length)
                    break;
            }
        }

        var n = (offset == -1) ? data.length - bo : offset;
        var array = [];
        var ret = '';
        var _join = Array.prototype.join;
        var i = 0;
        if (value != null) {
            for (i = 0; i < n; i++) {
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
            ret = (isJis == false)
                ? _decodeURIComponent(_escape(_unescape(str)))
                : decodeToShiftJis(str);

            if (ret.length > 5 && ret.substr(-5) == '@LFCR')
                ret = ret.slice(0, -5);
        } else {
            for (i = 0; i < n; i++)
                ret += _fromCharCode(data[bo + i]);
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
            for (; _this.bit_offset < 0; ) {
                _this.byte_offset--;
                _this.bit_offset += 8;
            }
        }
    };

    /**
     * @param n
     * @returns {number}
     */
    BitIO.prototype.getUIBits = function(n)
    {
        var value = 0;
        var _this = this;
        var _getUIBit = _this.getUIBit;
        for (; n--; ) {
            value <<= 1;
            value |= _getUIBit.call(_this);
        }
        return value;
    };

    /**
     * @returns {number}
     */
    BitIO.prototype.getUIBit = function()
    {
        var _this = this;
        _this.byteCarry();
        return (_this.data[_this.byte_offset] >> (7 - _this.bit_offset++)) & 0x1;
    };

    /**
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
     * @returns {number}
     */
    BitIO.prototype.getUI8 = function()
    {
        var _this = this;
        _this.byteAlign();
        return _this.data[_this.byte_offset++];
    };

    /**
     * @returns {number}
     */
    BitIO.prototype.getUI16 = function()
    {
        var _this = this;
        _this.byteAlign();
        var data = _this.data;
        return (data[_this.byte_offset++] | (data[_this.byte_offset++]) << 8);
    };

    /**
     * @returns {number}
     */
    BitIO.prototype.getUI16BE = function()
    {
        var _this = this;
        _this.byteAlign();
        var data = _this.data;
        return (((data[_this.byte_offset++]) << 8) | (data[_this.byte_offset++]));
    };

    /**
     * @returns {number}
     */
    BitIO.prototype.getUI32 = function()
    {
        var _this = this;
        _this.byteAlign();
        var data = _this.data;
        return (data[_this.byte_offset++] | (data[_this.byte_offset++]
            | (data[_this.byte_offset++] | (data[_this.byte_offset++]) << 8) << 8) << 8);
    };

    /**
     * @returns {*}
     */
    BitIO.prototype.getFloat16 = function()
    {
        var data = this.getData(2);
        var float = 0;
        for (var i = 2; i--;)
            float |= data[i] << (i * 8);
        return _parseFloat(float);
    };

    /**
     * @returns {*}
     */
    BitIO.prototype.getFloat32 = function()
    {
        var data = this.getData(4);
        var rv = 0;
        for (var i = 4; i--;)
            rv |= data[i] << (i * 8);
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
     * @returns {number}
     */
    BitIO.prototype.getFloat64 = function()
    {
        var _this = this;
        var upperData = _this.getData(4);
        var upperBits = 0;
        for (i = 4; i--;)
            upperBits |= upperData[i] << (i * 8);
        var lowerData = _this.getData(4);
        var lowerBits = 0;
        for (var i = 4; i--;)
            lowerBits |= lowerData[i] << (i * 8);
        var sign = upperBits >>> 31 & 0x1;
        var exp = upperBits >>> 20 & 0x7FF;
        var upperFraction = upperBits & 0xFFFFF;
        var lowerFraction = lowerBits;
        return ((sign == 0) ? 1 : -1)
            * (upperFraction / _pow(2, 20) + lowerFraction / (_pow(2, 52) + 1))
            * _pow(2, exp - 1023);
    };

    /**
     * @param data
     * @returns {number}
     */
    BitIO.prototype.toUI16 = function(data)
    {
        return data[0] + (data[1] << 8);
    };

    /**
     * @param data
     * @returns {number}
     */
    BitIO.prototype.toSI16LE = function(data)
    {
        var _this = this;
        var value = _this.toUI16(data);
        if (value < 0x8000)
            return value;
        return value - 0x10000;
    };

    /**
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
            if (!(num & 0x80))
                break;
        }
        return value;
    };

    /**
     * @param length
     * @returns {number}
     */
    BitIO.prototype.readUB = function(length)
    {
        var _this = this;
        var value = 0;
        for (var i = 0; i < length; i++) {
            if (_this.bit_offset == 8) {
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
    BitIO.prototype.readNumber = function(n)
    {
        var _this = this;
        var value = 0;
        var o = _this.byte_offset;
        var i = o + n;
        for(; i > o;)
            value = (value << 8) | _this.data[--i];
        _this.byte_offset += n;
        return value;
    };

    /**
     * @returns {*}
     */
    BitIO.prototype.deCompress = function(length)
    {
        var _this = this;
        var key = 0;
        var bo = _this.byte_offset;
        var data = _this.getData(bo);
        var deCompress = unzip(_this.data, true);
        var array = _this.createArray(length);
        _this.data = null;

        var dataLength = data.length;
        for (var i = 0; i < dataLength; i++)
            array[key++] = data[i];

        var compLength = deCompress.length;
        for (i = 0; i < compLength; i++)
            array[key++] = deCompress[i];

        _this.data = array;
        _this.byte_offset = bo;
    };

    /**
     * @param player
     * @param bitio
     * @constructor
     */
    var SwfTag = function(player, bitio)
    {
        this.player = player;
        this.bitio = bitio;
        this.currentPosition = {x:0, y:0};
        this.jpegTables = null;
    };

    /**
     * @returns {Array}
     */
    SwfTag.prototype.parse = function(mc)
    {
        var _this = this;
        var length = _this.bitio.data.length;
        return _this.parseTags(length, mc.characterId);
    };

    /**
     * @param tags
     * @param parent
     */
    SwfTag.prototype.build = function(tags, parent)
    {
        var _this = this;
        var len = tags.length;
        var _showFrame = _this.showFrame;
        var originTags = [];
        for (var frame = 1; frame < len; frame++) {
            if (!(frame in tags))
                continue;
            _showFrame.call(_this, tags[frame], parent, originTags);
        }
    };

    /**
     * @param obj
     * @param mc
     * @param originTags
     */
    SwfTag.prototype.showFrame = function(obj, mc, originTags)
    {
        var _this = this;
        var _buildTag = _this.buildTag;
        var newDepth = [];
        var length = 0;
        var frame = obj.frame;

        if (!(frame in originTags))
            originTags[frame] = [];

        mc.setTotalFrames(_max(mc.getTotalFrames(), frame));

        // add ActionScript
        var actions = obj.actionScript;
        length = actions.length;
        if (length) {
            for (var i = 0; i < length; i++) {
                if (!(i in actions))
                    continue;
                mc.setActions(frame, actions[i]);
            }
        }

        // add label
        var labels = obj.labels;
        length = labels.length;
        if (length) {
            for (; length--;) {
                if (!(length in labels))
                    continue;
                var label = labels[length];
                mc.addLabel(label.frame, label.name);
            }
        }

        // add sounds
        var sounds = obj.sounds;
        length = sounds.length;
        if (length) {
            for (; length--;) {
                if (!(length in sounds))
                    continue;
                mc.addSound(frame, sounds[length]);
            }
        }

        var cTags = obj.cTags;
        length = cTags.length;
        if (length) {
            for (var i = 0; i < length; i++) {
                if (!(i in cTags))
                    continue;
                var tag = cTags[i];
                newDepth[tag.Depth] = true;
                _buildTag.call(_this, frame, tag, mc, originTags);
            }
        }

        // remove tag
        var tags = obj.removeTags;
        length = tags.length;
        if (length) {
            mc.setRemoveTag(frame, tags);
            for (; length--;) {
                if (!(length in tags))
                    continue;
                var rTag = tags[length];
                newDepth[rTag.Depth] = true;
            }
        }

        // 前回のコピー
        if (frame > 1) {
            var prevFrame = frame - 1;
            var addTags = mc.addTags;
            var controller = mc.controller;
            if (prevFrame in addTags) {
                var prevTags = addTags[prevFrame];
                if (!(frame in addTags))
                    addTags[frame] = [];

                length = prevTags.length;
                for (; length--;) {
                    if (!(length in prevTags) || length in newDepth)
                        continue;

                    addTags[frame][length] = prevTags[length];
                    var tag = prevTags[length];
                    if (tag instanceof MovieClip) {
                        var prevController = controller[prevFrame];
                        if (!(frame in controller))
                            controller[frame] = [];
                        controller[frame][length] = prevController[length];
                    }
                    originTags[frame][length] = originTags[prevFrame][length];
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
    SwfTag.prototype.buildTag = function(frame, tag, parent, originTags)
    {
        var _this = this;
        var _clone = clone;

        var addTags = parent.addTags;
        if (!(frame in addTags))
            addTags[frame] = [];

        var isCopy = true;
        if (tag.PlaceFlagMove) {
            var oTag = originTags[frame - 1][tag.Depth];
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

                if (!tag.PlaceFlagHasClipActions
                    && oTag.PlaceFlagHasClipActions
                ) {
                    tag.PlaceFlagHasClipActions = oTag.PlaceFlagHasClipActions;
                    tag.ClipActionRecords = oTag.ClipActionRecords;
                }

                if (!tag.PlaceFlagHasRatio && !isCopy) {
                    tag.PlaceFlagHasRatio = 1;
                    tag.Ratio = frame - 1;
                }

                if (!tag.PlaceFlagHasFilterList
                    && oTag.PlaceFlagHasFilterList
                ) {
                    tag.PlaceFlagHasFilterList = oTag.PlaceFlagHasFilterList;
                    tag.SurfaceFilterList = oTag.SurfaceFilterList;
                }
            }
        }

        originTags[frame][tag.Depth] = _clone(tag);
        addTags[frame][tag.Depth] = _this.buildObject(tag, parent, isCopy, frame);
    };

    /**
     *
     * @param tag
     * @param parent
     * @param copy
     * @param frame
     * @returns {{}}
     */
    SwfTag.prototype.buildObject = function(tag, parent, copy, frame)
    {
        var _this = this;
        var _cloneArray = cloneArray;
        var player = _this.player;
        var char = player.getCharacter(tag.CharacterId);

        var obj = {};
        if (char instanceof Array) {
            obj = (tag.PlaceFlagMove && copy)
                ? parent.addTags[frame - 1][tag.Depth]
                : _this.buildMovieClip(tag, char, parent);

            if (obj.isStatic && obj.getTotalFrames() > 1)
                obj.isStatic = false;

            if (parent.isStatic)
                parent.isStatic = _min(obj.isStatic, parent.isStatic);
        } else {
            var tagType = char.tagType;
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
                case 84: //
                    var MorphShape = _this.buildMorphShape(char, tag.Ratio);
                    obj = _this.buildShape(tag, MorphShape);
                    break;
                case 7: // DefineButton
                case 34: // DefineButton2
                    obj = _this.buildButton(char, tag, parent);
                    break;
            }
        }

        if (tag.PlaceFlagHasClipDepth) {
            obj.isClipDepth = true;
            obj.clipDepth = tag.ClipDepth;
        }

        // 初期値設定
        var controller = parent.controller;
        if (!(frame in controller))
            controller[frame] = [];

        var _controller = parent._controller;
        if (!(frame in _controller))
            _controller[frame] = [];

        var matrix = [1,0,0,1,0,0];
        if (tag.PlaceFlagHasMatrix)
            matrix = tag.Matrix;

        var colorTransform = [1,1,1,1,0,0,0,0];
        if (tag.PlaceFlagHasColorTransform)
            colorTransform = tag.ColorTransform;

        if (obj instanceof MovieClip) {
            var controlTag = {};
            controlTag.matrix = _cloneArray(matrix);
            controlTag.colorTransform = _cloneArray(colorTransform);
            controller[frame][tag.Depth] = controlTag;

            var _controlTag = {};
            _controlTag._matrix = _cloneArray(matrix);
            _controlTag._colorTransform = _cloneArray(colorTransform);
            _controller[frame][tag.Depth] = _controlTag;
        } else {
            obj.setMatrix(_cloneArray(matrix));
            obj.setColorTransform(_cloneArray(colorTransform));
        }

        return obj;
    };

    /**
     * @param tag
     * @param character
     * @param parent
     * @returns {MovieClip}
     */
    SwfTag.prototype.buildMovieClip = function(tag, character, parent)
    {
        var _this = this;
        var mc = new MovieClip();
        mc.player = _this.player;
        mc.setParent(parent);
        mc.setCharacterId(tag.CharacterId);
        mc.setRatio(tag.Ratio || 0);
        mc.setLevel(tag.Depth);
        var target = "instance" + mc.instanceId;
        if (tag.PlaceFlagHasName) {
            mc.setName(tag.Name);
            mc.isStatic = false;
            target = tag.Name;
        }
        mc.setTarget(parent.getTarget()+"/"+target);

        _this.build(character, mc);

        if (tag.PlaceFlagHasClipActions) {
            var ClipActionRecords = tag.ClipActionRecords;
            var rLength = ClipActionRecords.length;
            var eventArray = [];
            for (var i = 0; i < rLength; i++) {
                var actionRecord = ClipActionRecords[i];
                var eventFlag = actionRecord.EventFlags;
                for (var eventName in eventFlag) {
                    if (eventFlag[eventName] == 0)
                        continue;
                    if (!(eventName in eventArray))
                        eventArray[eventName] = [];
                    eventArray[eventName].push(actionRecord.Actions);
                }
            }
            for (eventName in eventArray)
                mc.clipEvent[eventName] = eventArray[eventName];
        }

        // Filter
        if (tag.PlaceFlagHasFilterList) {
            console.log(tag.SurfaceFilterList)
            mc.setFilters(tag.SurfaceFilterList);
        }

        return mc;
    };


    SwfTag.prototype.buildTextField = function(tag, character, parent)
    {
        var _this = this;

        var textField = new TextField(parent);
        textField.setCharacterId(tag.CharacterId);
        textField.setRatio(tag.Ratio || 0);
        textField.setTagType(character.tagType);
        textField.setBounds(character.bounds);
        if (tag.PlaceFlagHasName)
            textField.setName(tag.Name);

        var data = character.data;
        var obj = {};

        var fontData = null;
        var fontId = data.FontID;
        if (data.HasFont) {
            var player = _this.player;
            fontData = player.getCharacter(fontId);
        }

        textField.fontId = fontId;
        textField.fontScale = data.FontHeight / 1024;
        textField.initialText = data.InitialText;
        obj.autoSize = data.AutoSize;
        obj.border = data.Border;
        obj.bottomScroll = 1;
        obj.condenseWhite = 0;
        obj.embedFonts = (data.HasFont && data.UseOutlines && fontData.FontFlagsHasLayout && !data.Password) ? 1 : 0;
        obj.hscroll = 0;
        obj.html = data.HTML;
        obj.htmlText = null;
        obj.length = 0;
        obj.maxChars = 0;
        obj.maxhscroll = 0;
        obj.maxscroll = 0;
        obj.multiline = data.Multiline;
        obj.password  = data.Password;
        obj.scroll = 0;
        obj.selectable = data.NoSelect;
        obj.tabEnabled = 0;
        obj.tabIndex = 0;
        obj.text = data.InitialText;
        obj.textColor = data.TextColor;
        obj.textHeight = 0;
        obj.textWidth = 0;
        obj.type = data.ReadOnly ? "dynamic" : "input";
        obj.variable = data.VariableName;
        obj.wordWrap = data.WordWrap;

        // TextFormat
        obj.blockIndent = 0;
        obj.bullet = 0;
        obj.color = data.TextColor;

        if (fontData) {
            obj.bold = fontData.FontFlagsBold;
            var font = textField.getVariable('font');
            obj.font = "'"+ fontData.FontName +"', "+ font;
            obj.italic = fontData.FontFlagsItalic;
        }

        if (data.HasLayout) {
            switch (data.Align) {
                case 1:
                    obj.align = 'right';
                    break;
                case 2:
                    obj.align = 'center';
                    break;
                case 3:
                    obj.align = 'justify';
                    break;
            }
            obj.leftMargin = data.LeftMargin;
            obj.rightMargin = data.RightMargin;
            obj.indent = data.Indent;
            obj.leading = data.Leading;
        }

        obj.size = data.FontHeight / 20;
        obj.tabStops = [];
        obj.target = null;
        obj.underline = 0;
        obj.url = null;

        for (var name in obj)
            textField.setProperty(name, obj[name]);

        return textField;
    };

    /**
     *
     * @param tag
     * @param character
     * @returns {Text}
     */
    SwfTag.prototype.buildText = function(tag, character)
    {
        var _this = this;
        var player = _this.player;
        var text = new DefineText();
        text.setCharacterId(tag.CharacterId);
        text.setRatio(tag.Ratio || 0);
        text.setTagType(character.tagType);
        text.setBounds(character.bounds);

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
            if ('FontId' in record) {
                var fontId = record.FontId;
                var fontData = player.getCharacter(fontId);
                ShapeTable = fontData.GlyphShapeTable;
                isZoneTable = false;
                if (fontData.ZoneTable)
                    isZoneTable = true;
            }
            if ('XOffset' in record)
                offsetX = record.XOffset;
            if ('YOffset' in record)
                offsetY = record.YOffset;
            if ('TextColor' in record)
                color = record.TextColor;
            if ('TextHeight' in record) {
                textHeight = record.TextHeight;
                if (isZoneTable)
                    textHeight /= 20;
            }

            var entries = record.GlyphEntries;
            var count = record.GlyphCount;
            scale = textHeight / 1024;
            for (var idx = 0; idx < count; idx++) {
                var entry = entries[idx];
                var shapes = ShapeTable[entry.GlyphIndex];
                var data = vtc.execute(shapes);
                var matrix = [scale, cMatrix[1], cMatrix[2], scale, cMatrix[4]+offsetX, cMatrix[5]+offsetY];
                var textRecode = new TextRecord();
                textRecode.setData(data);
                textRecode.setColor(color);
                textRecode.setMatrix(matrix);
                text.addRecord(textRecode);
                offsetX += entry.GlyphAdvance;
            }
        }

        return text;
    };

    /**
     * @param tag
     * @param character
     * @returns {Shape}
     */
    SwfTag.prototype.buildShape = function(tag, character)
    {
        var shape = new Shape();
        shape.setCharacterId(tag.CharacterId);
        shape.setRatio(tag.Ratio || 0);
        shape.setTagType(character.tagType);
        shape.setBounds(character.bounds);
        shape.setData(character.data);
        return shape;
    };

    /**
     * @param character
     * @param tag
     * @param parent
     * @returns {Button}
     */
    SwfTag.prototype.buildButton = function(character, tag, parent)
    {
        var _this = this;
        var characters = character.characters;
        var length = characters.length;
        var button = new Button();
        button.setParent(parent);
        button.setPlayer(_this.player);
        if ('actions' in character)
            button.setActions(character.actions);
        if (tag.PlaceFlagHasName)
            button.setName(tag.Name);

        var down = button.down;
        if (character.ButtonStateDownSoundId) {
            down.soundId = character.ButtonStateDownSoundId;
            down.soundInfo = character.ButtonStateDownSoundInfo;
        }

        var hitTest = button.hit;
        if (character.ButtonStateHitTestSoundId) {
            hitTest.soundId = character.ButtonStateHitTestSoundId;
            hitTest.soundInfo = character.ButtonStateHitTestSoundInfo;
        }

        var over = button.over;
        if (character.ButtonStateOverSoundId) {
            over.soundId = character.ButtonStateOverSoundId;
            over.soundInfo = character.ButtonStateOverSoundInfo;
        }

        var up = button.up;
        if (character.ButtonStateUpSoundId) {
            up.soundId = character.ButtonStateUpSoundId;
            up.soundInfo = character.ButtonStateUpSoundInfo;
        }

        for (var depth = 1; depth < length; depth++) {
            if (!(depth in characters))
                continue;

            var tags = characters[depth];
            var tLen = tags.length;
            for (var idx = 0; idx < tLen; idx++) {
                if (!(idx in tags))
                    continue;
                var bTag = tags[idx];
                var obj = _this.buildObject(bTag, parent, false, 1);
                var Depth = bTag.Depth;

                if (bTag.ButtonStateDown)
                    down.addTag(Depth, obj, bTag);
                if (bTag.ButtonStateHitTest)
                    hitTest.addTag(Depth, obj, bTag);
                if (bTag.ButtonStateOver)
                    over.addTag(Depth, obj, bTag);
                if (bTag.ButtonStateUp)
                    up.addTag(Depth, obj, bTag);
            }
        }

        button.setCharacterId(tag.CharacterId);
        button.setRatio(tag.Ratio || 0);
        button.setTagType(character.tagType);

        return button;
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
            sounds: [],
        }
    };

    /**
     * @param dataLength
     * @param characterId
     * @returns {Array}
     */
    SwfTag.prototype.parseTags = function(dataLength, characterId)
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

        for (; bitio.byte_offset < dataLength; ) {
            var tagStartOffset = bitio.byte_offset;
            if (tagStartOffset + 2 > dataLength)
                break;

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
                    tags[frame] = _generateDefaultTagObj.call(_this, frame, characterId);
                }
            }

            var tag = _parseTag.call(_this, tagType, length);

            var o = bitio.byte_offset - tagDataStartOffset;
            if (o != length) {
                if (o < length) {
                    var eat = (length - o);
                    if (eat > 0) {
                        bitio.byte_offset += eat;
                    }
                }
            }

            if (tag != null)
                tags = _addTag.call(_this, tagType, tags, tag, frame);

            bitio.bit_offset = 0;
        }

        return tags;
    };

    /**
     * @param tagType
     * @param length
     * @returns {*}
     */
    SwfTag.prototype.parseTag = function(tagType, length)
    {
        var _this = this;
        var obj = null;
        var bitio = _this.bitio;
        var player = _this.player;

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
                break;
            case 9: // BackgroundColor
                player.setBackgroundColor(
                    bitio.getUI8(),
                    bitio.getUI8(),
                    bitio.getUI8()
                );
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
            case 19: // SoundStreamBlock
                _this.parseSoundStreamBlock(tagType, length);
                break;
            // TODO 未実装
            case 3:  // FreeCharacter
            case 16: // StopSound
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
    SwfTag.prototype.parseDefineShape = function(tagType)
    {
        var _this = this;
        var bitio = _this.bitio;
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
     * @returns {{xMin: number, xMax: number, yMin: number, yMax: number}}
     */
    SwfTag.prototype.rect = function()
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
    SwfTag.prototype.shapeWithStyle = function(tagType)
    {
        var _this = this;
        var bitio = _this.bitio;

        if (tagType == 46 || tagType == 84) {
            var fillStyles = {fillStyleCount:0, fillStyles:[]};
            var lineStyles = {lineStyleCount:0, lineStyles:[]};
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
            ShapeRecords: ShapeRecords
        };
    };

    /**
     * @param tagType
     * @returns {{}}
     */
    SwfTag.prototype.fillStyleArray = function(tagType)
    {
        var _this = this;
        var bitio = _this.bitio;
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
     * @param tagType
     * @returns {{}}
     */
    SwfTag.prototype.fillStyle = function(tagType)
    {
        var _this = this;
        var bitio = _this.bitio;
        var obj = {};
        var bitType = bitio.getUI8();
        obj.fillStyleType = bitType;

        switch (bitType) {
            case 0x00: // 単色塗り
                if (tagType == 32 || tagType == 83) {
                    obj.Color = _this.rgba();
                } else if (tagType == 46 || tagType == 84) {
                    obj.StartColor = _this.rgba();
                    obj.EndColor = _this.rgba();
                } else {
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
                console.log('焦点付き円形グラデーション塗り');
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
     * @returns {{}}
     */
    SwfTag.prototype.rgb = function()
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
    SwfTag.prototype.rgba = function()
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
    SwfTag.prototype.matrix = function()
    {
        var bitio = this.bitio;
        bitio.byteAlign();

        var result = [1,0,0,1,0,0];
        if (isArrayBuffer)
            result = new Float32Array(result);

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
    SwfTag.prototype.gradient = function(tagType)
    {
        var bitio = this.bitio;
        bitio.byteAlign();
        var _this = this;
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
     * @param tagType
     * @returns {{Ratio: number, Color: *}}
     */
    SwfTag.prototype.gradientRecord = function(tagType)
    {
        var _this = this;
        var bitio = _this.bitio;
        var Ratio = bitio.getUI8();
        var Color = (tagType < 32) ? _this.rgb() : _this.rgba();
        return { Ratio: Ratio / 255, Color: Color };
    };

    /**
     * @param tagType
     * @returns {{SpreadMode: number, InterpolationMode: number, GradientRecords: Array, FocalPoint: number}}
     */
    SwfTag.prototype.focalGradient = function(tagType)
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
        var FocalPoint = bitio.getUI8();

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
    SwfTag.prototype.lineStyleArray = function(tagType)
    {
        var _this = this;
        var bitio = _this.bitio;
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
     * @param tagType
     * @returns {{}}
     */
    SwfTag.prototype.lineStyles = function(tagType)
    {
        var _this = this;
        var bitio = _this.bitio;
        var obj = {};
        obj.fillStyleType = 0;
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
            var Reserved = bitio.getUIBits(5);
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
                var Reserved = bitio.getUIBits(5);
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
     * @param tagType
     * @param currentNumBits
     * @returns {Array}
     */
    SwfTag.prototype.shapeRecords = function(tagType, currentNumBits)
    {
        var _this = this;
        var bitio = _this.bitio;
        var shapeRecords = [];
        _this.currentPosition = {x:0, y:0};
        var _straightEdgeRecord = _this.straightEdgeRecord;
        var _curvedEdgeRecord = _this.curvedEdgeRecord;
        var _styleChangeRecord = _this.styleChangeRecord;

        for (;;) {
            var first6Bits = bitio.getUIBits(6);
            var shape = 0;

            if (first6Bits & 0x20) {
                // Edge
                var numBits = first6Bits & 0x0f;
                if (first6Bits & 0x10) {
                    // StraigtEdge (11XXXX)
                    shape = _straightEdgeRecord.call(_this, tagType, numBits);
                } else {
                    // CurvedEdge (10XXXX)
                    shape = _curvedEdgeRecord.call(_this, tagType, numBits);
                }
            } else if (first6Bits) {
                // ChangeStyle (0XXXXX)
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
    SwfTag.prototype.straightEdgeRecord = function(tagType, numBits)
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
     * @param tagType
     * @param numBits
     * @returns {{}}
     */
    SwfTag.prototype.curvedEdgeRecord = function(tagType, numBits)
    {
        var _this = this;
        var bitio = _this.bitio;
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
     * @param tagType
     * @param changeFlag
     * @param currentNumBits
     * @returns {{}}
     */
    SwfTag.prototype.styleChangeRecord = function(tagType, changeFlag, currentNumBits)
    {
        var _this = this;
        var bitio = _this.bitio;
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
     * @param shapeBounds
     * @param shapes
     * @param tagType
     */
    SwfTag.prototype.appendShapeTag = function(characterId, shapeBounds, shapes, tagType)
    {

        this.player.setCharacter(characterId, {
            tagType: tagType,
            data: vtc.execute(shapes),
            bounds: shapeBounds
        });
    };

    /**
     * @param tagType
     * @param length
     */
    SwfTag.prototype.parseDefineBitsLossLess = function(tagType, length)
    {
        var _this = this;
        var bitio = _this.bitio;
        var player = _this.player;
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

        var idx = 0;
        var pxIdx = 0;
        var x = width;
        var y = height;
        if (format == 5 && !isAlpha) {
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
            var pad = (colorTableSize)
                ? ((width + 3) & ~3) - width
                : 0;

            for (y = height; y--;) {
                for (x = width; x--;) {
                    idx = (colorTableSize)
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

        player.setCharacter(CharacterId, imageContext);
    };

    /**
     * parseExportAssets
     */
    SwfTag.prototype.parseExportAssets = function()
    {
        var _this = this;
        var bitio = _this.bitio;
        var player = _this.player;
        var count = bitio.getUI16();

        var exportAssets = player.exportAssets;
        for (; count--;) {
            var id = bitio.getUI16();
            var name = bitio.getDataUntil("\0");
            exportAssets[name] = id;
        }

        player.exportAssets = exportAssets;
    };

    /**
     * @param length
     * @returns {string}
     */
    SwfTag.prototype.parseJPEGTables = function(length)
    {
        return this.bitio.getData(length);
    };

    /**
     * @param tagType
     * @param length
     * @param jpegTables
     */
    SwfTag.prototype.parseDefineBits = function(tagType, length, jpegTables)
    {
        var _this = this;
        var bitio = _this.bitio;
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
        var player = _this.player;
        player.imgUnLoadCount++;
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

            player.setCharacter(CharacterId, imageContext);

            // 読み完了
            player.imgUnLoadCount--;
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
        + _this.base64encode(_this.parseJpegData(JPEGData));

        _setTimeout(function() {}, 0);
    };

    /**
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

            for (; i < length; ) {
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

        for (; i < len; ) {
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
            out[out.length] = base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out[out.length] = base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6));
            out[out.length] = base64EncodeChars.charAt(c3 & 0x3F);
        }

        return out.join('');
    };

    /**
     * @param tagType
     * @param length
     */
    SwfTag.prototype.parseDefineFont = function(tagType, length)
    {
        var _this = this;
        var bitio = _this.bitio;
        var player = _this.player;
        var endOffset = bitio.byte_offset + length;

        var obj = {};
        obj.tagType = tagType;
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
            bitio.byteAlign();

            obj.LanguageCode = bitio.getUI8();
            obj.FontNameLen = bitio.getUI8();
            if (obj.FontNameLen) {
                var startOffset = bitio.byte_offset;
                var data = bitio.getData(obj.FontNameLen);
                var str = '';
                for (var i = 0; i < obj.FontNameLen; i++) {
                    if (data[i] > 127)
                        continue;
                    str += _fromCharCode(data[i]);
                }

                if (obj.FontFlagsShiftJIS || obj.LanguageCode == 1) {
                    var fontName = decodeToShiftJis(str);
                } else {
                    var fontName = _this.encodeToUtf8(str);
                }

                obj.FontName = _this.getFontName(fontName);
                bitio.byte_offset = startOffset + obj.FontNameLen;
            }

            numGlyphs = bitio.getUI16();
            obj.NumGlyphs = numGlyphs;
        }

        // offset
        var offset = bitio.byte_offset;

        if (tagType == 10)
            numGlyphs = bitio.getUI16();

        if (numGlyphs) {
            var OffsetTable = [];
            if (tagType == 10) {
                OffsetTable[0] = numGlyphs;
                numGlyphs /= 2;
                numGlyphs--;
            }

            if (obj.FontFlagsWideOffsets) {
                for (var i = numGlyphs; i--;) {
                    var len = OffsetTable.length;
                    OffsetTable[len] = bitio.getUI32();
                }
                if (tagType != 10)
                    obj.CodeTableOffset = bitio.getUI32();
            } else {
                for (var i = numGlyphs; i--;) {
                    var len = OffsetTable.length;
                    OffsetTable[len] = bitio.getUI16();
                }
                if (tagType != 10)
                    obj.CodeTableOffset = bitio.getUI16();
            }

            // Shape
            var GlyphShapeTable = [];
            if (tagType == 10)
                numGlyphs++;
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

                var len = GlyphShapeTable.length;
                GlyphShapeTable[len] = shapes;
            }
            obj.GlyphShapeTable = GlyphShapeTable;

            if (tagType == 48 || tagType == 75) {
                // 文字情報
                bitio.setOffset(obj.CodeTableOffset + offset, 0);
                var CodeTable = [];
                if (obj.FontFlagsWideCodes) {
                    for (var i = numGlyphs; i--;) {
                        CodeTable[CodeTable.length] = bitio.getUI16();
                    }
                } else {
                    for (var i = numGlyphs; i--;) {
                        CodeTable[CodeTable.length] = bitio.getUI8();
                    }
                }
                obj.CodeTable = CodeTable;

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

        bitio.byte_offset = endOffset;
        player.setCharacter(obj.FontId, obj);
    };

    /**
     * @param str
     * @returns {string}
     */
    SwfTag.prototype.encodeToUtf8 = function(str)
    {
        str = _unescape(str);
        str = str.replace(/%(?:25)+([0-9A-F][0-9A-F])/g, function(whole, m1)
        {
            return "%"+m1;
        });

        return str.replace(utf8uri, function(whole)
        {
            return _decodeURIComponent(str);
        });
    };

    /**
     * @param tagType
     * @param length
     */
    SwfTag.prototype.parseDefineFontInfo = function(tagType, length)
    {
        var _this = this;
        var bitio = _this.bitio;
        var player = _this.player;
        var endOffset = bitio.byte_offset + length;

        var obj = {};
        obj.tagType = tagType;
        obj.FontId = bitio.getUI16();
        var len = bitio.getUI8();
        var data = bitio.getData(len);
        var str = '';
        for (var i = 0; i < len; i++) {
            if (data[i] > 127)
                continue;
            str += _fromCharCode(data[i]);
        }

        obj.FontFlagsReserved = bitio.getUIBits(2);
        obj.FontFlagsSmallText = bitio.getUIBits(1);
        obj.FontFlagsShiftJIS = bitio.getUIBits(1);
        obj.FontFlagsANSI = bitio.getUIBits(1);
        obj.FontFlagsItalic = bitio.getUIBits(1);
        obj.FontFlagsBold = bitio.getUIBits(1);
        obj.FontFlagsWideCodes = bitio.getUIBits(1);

        if (tagType == 62)
            obj.LanguageCode = bitio.getUI8();

        if (obj.FontFlagsShiftJIS || obj.LanguageCode == 1) {
            var fontName = decodeToShiftJis(str);
        } else {
            var fontName = _this.encodeToUtf8(str);
        }
        obj.FontName = _this.getFontName(fontName);

        var CodeTable = [];
        var tLen = endOffset - bitio.byte_offset;
        if (obj.FontFlagsWideCodes) {
            for (; tLen;) {
                CodeTable[CodeTable.length] = bitio.getUI16();
                tLen--;
                tLen--;
            }
        } else {
            for (; tLen;) {
                CodeTable[CodeTable.length] = bitio.getUI8();
                tLen--;
            }
        }
        obj.CodeTable = CodeTable;

        //player.setCharacter(obj.FontId, obj);
    };

    /**
     * @param fontName
     * @returns {string}
     */
    SwfTag.prototype.getFontName = function(fontName)
    {
        switch (fontName) {
            case '_sans':
                return 'sans-serif';
                break;
            case '_serif':
                return 'serif';
                break;
            case '_typewriter':
                return 'monospace';
                break;
            default:
                var ander = fontName.substr(0,1);
                if (ander == '_')
                    return 'sans-serif';
                return fontName;
                break;
        }
    };

    /**
     * parseDefineFontName
     */
    SwfTag.prototype.parseDefineFontName = function()
    {
        var bitio = this.bitio;
        var FontId = bitio.getUI16();
        var FontName = bitio.getDataUntil("\0");
        var FontCopyright = bitio.getDataUntil("\0");
    };

    /**
     * @param tagType
     */
    SwfTag.prototype.parseDefineText = function(tagType)
    {
        var _this = this;
        var bitio = _this.bitio;
        var player = _this.player;
        var obj = {};
        var characterId = bitio.getUI16();
        obj.tagType = tagType;
        obj.bounds = _this.rect();
        obj.matrix = _this.matrix();
        var GlyphBits = bitio.getUI8();
        var AdvanceBits = bitio.getUI8();
        obj.textRecords = _this.getTextRecords(tagType, GlyphBits, AdvanceBits);
        player.setCharacter(characterId, obj);
    };

    /**
     * @param tagType
     * @param GlyphBits
     * @param AdvanceBits
     * @returns {Array}
     */
    SwfTag.prototype.getTextRecords = function(tagType, GlyphBits, AdvanceBits)
    {
        var _this = this;
        var bitio = _this.bitio;
        var array = [];
        for (; bitio.getUI8() != 0; ) {
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
     * @param count
     * @param GlyphBits
     * @param AdvanceBits
     * @returns {Array}
     */
    SwfTag.prototype.getGlyphEntries = function(count, GlyphBits, AdvanceBits)
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
    SwfTag.prototype.parseDefineEditText = function(tagType)
    {
        var _this = this;
        var bitio = _this.bitio;
        var player = _this.player;
        var obj = {};
        var isJis = true;

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
            var fontData = player.getCharacter(obj.FontID);
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

        var VariableName = bitio.getDataUntil("\0", isJis) + '';
        obj.VariableName = (VariableName == '') ? null : VariableName;
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

        player.setCharacter(obj.CharacterId, {
            data: obj,
            bounds: bounds,
            tagType: tagType
        });
    };

    /**
     * @param tagType
     */
    SwfTag.prototype.parseDefineMorphShape = function(tagType)
    {
        var _this = this;
        var bitio = _this.bitio;
        var player = _this.player;
        var obj = {};
        obj.tagType = tagType;
        obj.CharacterId = bitio.getUI16();

        obj.StartBounds = _this.rect();
        obj.EndBounds = _this.rect();

        if (tagType == 84) {
            obj.StartEdgeBounds = _this.rect();
            obj.EndEdgeBounds = _this.rect();
            var Reserved = bitio.getUIBits(6); // Must be 0
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
        var startPosition = {x:0, y:0};
        var endPosition = {x:0, y:0};
        var StartRecords = obj.StartEdges.ShapeRecords;
        var EndRecords = obj.EndEdges.ShapeRecords;
        var StartRecordLength = StartRecords.length;
        var EndRecordLength = EndRecords.length;

        var length = _max(StartRecordLength, EndRecordLength);
        for (var i = 0; i < length; i++) {
            var addRecode = {};
            var StartRecord = StartRecords[i];
            var EndRecord = EndRecords[i];
            if (!StartRecord && !EndRecord)
                continue;

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
            var StartRecord = StartRecords[i];
            if (!StartRecord.isChange)
                continue;

            if (StartRecord.StateFillStyle0)
                FillStyle = StartRecord.FillStyle0;

            if (FillStyle) {
                StartRecord.StateFillStyle0 = 1;
                StartRecord.StateFillStyle1 = 1;
                if (FillType) {
                    StartRecord.FillStyle0 = 0;
                    StartRecord.FillStyle1 = FillStyle;
                } else {
                    StartRecord.FillStyle0 = FillStyle;
                    StartRecord.FillStyle1 = 0;
                }
            } else {
                StartRecord.StateFillStyle1 = 1;
                StartRecord.FillStyle1 = 0;
            }

            FillType = (FillType) ? 0 : 1;
        }

        player.setCharacter(obj.CharacterId, obj);
    };

    /**
     * @param char
     * @param ratio
     * @returns {{data: Array, bounds: {xMax: number, xMin: number, yMax: number, yMin: number}}}
     */
    SwfTag.prototype.buildMorphShape = function(char, ratio)
    {
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

        var position = {x:0, y:0};
        var len = StartShapeRecords.length;
        for (var i = 0; i < len; i++) {
            var StartRecord = StartShapeRecords[i];
            if (!StartRecord)
                continue;

            var newRecord = {};
            var EndRecord = EndShapeRecords[i];
            if (StartRecord.isChange) {
                var MoveX = 0;
                var MoveY = 0;

                if (StartRecord.StateMoveTo == 1) {
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
        newShapeRecords[newShapeRecords.length] = 0;
        shapes.ShapeRecords = newShapeRecords;


        for (i = 0; i < lineStyleCount; i++) {
            var lineStyle = lineStyles[i];
            var EndColor = lineStyle.EndColor;
            var StartColor = lineStyle.StartColor;
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
                Color: color,
                fillStyleType: 0
            };
        }

        for (i = 0; i < fillStyleCount; i++) {
            var fillStyle = fillStyles[i];
            var fillStyleType = fillStyle.fillStyleType;

            if (fillStyleType == 0x00) {
                var EndColor = fillStyle.EndColor;
                var StartColor = fillStyle.StartColor;

                var color = {
                    R: _floor(StartColor.R * startPer + EndColor.R * per),
                    G: _floor(StartColor.G * startPer + EndColor.G * per),
                    B: _floor(StartColor.B * startPer + EndColor.B * per),
                    A: StartColor.A * startPer + EndColor.A * per
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

                var color = {
                    gradient: fillStyle.gradient,
                    gradientMatrix: cloneArray(matrix)
                };
            }

            shapes.fillStyles.fillStyles[i] = {
                Color: color,
                fillStyleType: fillStyleType
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
            data: vtc.execute(shapes, true),
            bounds: bounds
        };
    };

    /**
     * @returns {{}}
     */
    SwfTag.prototype.parseFrameLabel = function()
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
    SwfTag.prototype.parseRemoveObject = function(tagType)
    {
        var bitio = this.bitio;
        if (tagType == 5) {
            console.log('RemoveObject');
            return {
                CharacterId: bitio.getUI16(),
                Depth: bitio.getUI16()
            }
        }
        return { Depth: bitio.getUI16() };
    };

    /**
     * @param tagType
     * @param length
     * @returns {{}}
     */
    SwfTag.prototype.parseDefineButton = function(tagType, length)
    {
        var obj = {};
        obj.tagType = tagType;

        var _this = this;
        var bitio = _this.bitio;
        var player = _this.player;
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
            obj.actions = _this.parseDoAction(endOffset - bitio.byte_offset);
        } else if (ActionOffset > 0) {
            obj.actions = _this.buttonActions(endOffset);
        }

        // set layer
        player.setCharacter(obj.ButtonId, obj);
        if (bitio.byte_offset != endOffset) {
            bitio.byte_offset = endOffset;
        }

        return obj;
    };

    /**
     * @returns {Array}
     */
    SwfTag.prototype.buttonCharacters = function()
    {
        var characters = [];
        var _this = this;
        var bitio = _this.bitio;
        for (; bitio.getUI8() != 0; ) {
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
    SwfTag.prototype.buttonRecord = function()
    {
        var _this = this;
        var bitio = _this.bitio;
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
            obj.FilterList = _this.getFilterList();
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
    SwfTag.prototype.buttonActions = function(endOffset)
    {
        var _this = this;
        var bitio = _this.bitio;
        var results = [];

        for (;;) {
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

            if (!CondActionSize)
                break;

            bitio.byte_offset = startOffset + CondActionSize;
        }

        return results;
    };

    /**
     * @param tagType
     * @param length
     * @returns {{}}
     */
    SwfTag.prototype.parsePlaceObject = function(tagType, length)
    {
        var _this = this;
        var bitio = _this.bitio;
        var player = _this.player;
        var obj = {};
        obj.tagType = tagType;
        var startOffset = bitio.byte_offset;

        if (tagType == 4) {
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
                var endFlag = 0;
                for (; bitio.byte_offset < endLength; ) {
                    actionRecords[actionRecords.length] =
                        _this.parseClipActionRecord();

                    endFlag = (player.getVersion() <= 5)
                        ? bitio.getUI16()
                        : bitio.getUI32();

                    if (!endFlag)
                        break;

                    if (player.getVersion() <= 5) {
                        bitio.byte_offset -= 2;
                    } else {
                        bitio.byte_offset -= 4;
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
    SwfTag.prototype.parseClipActionRecord = function()
    {
        var _this = this;
        var bitio = _this.bitio;
        var obj = {};

        obj.EventFlags = _this.parseClipEventFlags();
        var ActionRecordSize = bitio.getUI32();
        if (obj.EventFlags.ClipEventKeyPress)
            obj.KeyCode = bitio.getUI8();

        obj.Actions = _this.parseDoAction(ActionRecordSize);

        return obj;
    };

    /**
     * @returns {{}}
     */
    SwfTag.prototype.parseClipEventFlags = function()
    {
        var _this = this;
        var obj = {};
        var bitio = _this.bitio;
        var player = _this.player;

        obj.keyUp = bitio.getUIBits(1);
        obj.keyDown = bitio.getUIBits(1);
        obj.mouseUp = bitio.getUIBits(1);
        obj.mouseDown = bitio.getUIBits(1);
        obj.mouseMove = bitio.getUIBits(1);
        obj.unload = bitio.getUIBits(1);
        obj.enterFrame = bitio.getUIBits(1);
        obj.load = bitio.getUIBits(1);

        if (player.getVersion() >= 6) {
            obj.dragOver = bitio.getUIBits(1);
            obj.rollOut = bitio.getUIBits(1);
            obj.rollOver = bitio.getUIBits(1);
            obj.releaseOutside = bitio.getUIBits(1);
            obj.release = bitio.getUIBits(1);
            obj.press = bitio.getUIBits(1);
            obj.initialize = bitio.getUIBits(1);
        }

        obj.ClipEventData = bitio.getUIBits(1);
        if (player.getVersion() >= 6) {
            var Reserved = bitio.getUIBits(5);
            obj.construct = bitio.getUIBits(1);
            obj.keyPress = bitio.getUIBits(1);
            obj.dragOut = bitio.getUIBits(1);
            Reserved = bitio.getUIBits(8);
        }

        bitio.byteAlign();

        return obj;
    };

    /**
     * @returns {{}}
     */
    SwfTag.prototype.getFilterList = function()
    {
        var _this = this;
        var bitio = _this.bitio;
        var result = [];
        var _getFilter = _this.getFilter;
        var NumberOfFilters = bitio.getUI8();
        for (var i = 0; i < NumberOfFilters; i++) {
            result[i] = _getFilter.call(_this);
        }
        return result;
    };

    /**
     * @return {{}}
     */
    SwfTag.prototype.getFilter = function()
    {
        var _this = this;
        var bitio = _this.bitio;
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
     * @returns {{}}
     */
    SwfTag.prototype.dropShadowFilter = function()
    {
        var _this = this;
        var bitio = _this.bitio;
        var obj = {};
        obj.color = _this.rgba();
        obj.BlurX = bitio.getFloat16() | bitio.getFloat16();
        obj.BlurY = bitio.getFloat16() | bitio.getFloat16();
        obj.Angle = [bitio.getFloat16(), bitio.getFloat16()];
        obj.Distance = bitio.getFloat16() | bitio.getFloat16();
        obj.Strength = bitio.getFloat16() / 256;
        obj.InnerShadow = bitio.getUIBits(1);
        obj.Knockout = bitio.getUIBits(1);
        var CompositeSource = bitio.getUIBits(1);
        obj.Passes = bitio.getUIBits(5);
        return obj;
    };

    /**
     * @returns {{}}
     */
    SwfTag.prototype.blurFilter = function()
    {
        var obj = {};
        var bitio = this.bitio;
        obj.BlurX = bitio.getFloat16() | bitio.getFloat16();
        obj.BlurY = bitio.getFloat16() | bitio.getFloat16();
        obj.Passes = bitio.getUIBits(5);
        var Reserved = bitio.getUIBits(3);
        return obj
    };

    /**
     * @returns {{}}
     */
    SwfTag.prototype.glowFilter = function()
    {
        var _this = this;
        var bitio = _this.bitio;
        var obj = {};
        obj.color = _this.rgba();
        obj.BlurX = bitio.getFloat16() | bitio.getFloat16();
        obj.BlurY = bitio.getFloat16() | bitio.getFloat16();
        obj.Strength = bitio.getFloat16() / 256;
        obj.InnerGlow = bitio.getUIBits(1);
        obj.Knockout = bitio.getUIBits(1);
        obj.CompositeSource = bitio.getUIBits(1);
        obj.Passes = bitio.getUIBits(5);
        return obj;
    };

    /**
     * @returns {{}}
     */
    SwfTag.prototype.bevelFilter = function()
    {
        var _this = this;
        var bitio = _this.bitio;
        var obj = {};
        obj.ShadowColor = _this.rgba();
        obj.HighlightColor = _this.rgba();
        obj.BlurX = bitio.getFloat16() | bitio.getFloat16();
        obj.BlurY = bitio.getFloat16() | bitio.getFloat16();
        obj.Angle = bitio.getFloat16() | bitio.getFloat16();
        obj.Distance = bitio.getFloat16() | bitio.getFloat16();
        obj.Strength = bitio.getFloat16() / 256;
        obj.InnerShadow = bitio.getUIBits(1);
        obj.Knockout = bitio.getUIBits(1);
        var CompositeSource = bitio.getUIBits(1);
        obj.OnTop = bitio.getUIBits(1);
        obj.Passes = bitio.getUIBits(4);
        return obj;
    };

    /**
     * @returns {{}}
     */
    SwfTag.prototype.gradientGlowFilter = function()
    {
        var _this = this;
        var bitio = _this.bitio;
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
        obj.BlurX = bitio.getFloat16() | bitio.getFloat16();
        obj.BlurY = bitio.getFloat16() | bitio.getFloat16();
        obj.Angle = bitio.getFloat16() | bitio.getFloat16();
        obj.Distance = bitio.getFloat16() | bitio.getFloat16();
        obj.Strength = bitio.getFloat16() / 256;
        obj.InnerShadow = bitio.getUIBits(1);
        obj.Knockout = bitio.getUIBits(1);
        var CompositeSource = bitio.getUIBits(1);
        obj.OnTop = bitio.getUIBits(1);
        obj.Passes = bitio.getUIBits(4);
        return obj;
    };

    /**
     * @returns {{}}
     */
    SwfTag.prototype.convolutionFilter = function()
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
     * @returns {{}}
     */
    SwfTag.prototype.colorMatrixFilter = function()
    {
        var obj = {};
        var bitio = this.bitio;
        var MatrixArr = [];
        for (var i = 0; i < 20; i++) {
            MatrixArr[MatrixArr.length] = bitio.getUI32();
        }
        return obj;
    };

    /**
     * @returns {{}}
     */
    SwfTag.prototype.gradientBevelFilter = function()
    {
        var _this = this;
        var bitio = _this.bitio;
        var NumColors = bitio.getUI8();
        var colors = [];
        for (; NumColors--;) {
            colors[colors.length] = {
                GradientColors: _this.rgba(),
                GradientRatio: bitio.getUI8()
            };
        }

        var obj = {};
        obj.Colors = colors;
        obj.BlurX = bitio.getFloat16() | bitio.getFloat16();
        obj.BlurY = bitio.getFloat16() | bitio.getFloat16();
        obj.Angle = bitio.getFloat16() | bitio.getFloat16();
        obj.Distance = bitio.getFloat16() | bitio.getFloat16();
        obj.Strength = bitio.getFloat16() / 256;
        obj.InnerShadow = bitio.getUIBits(1);
        obj.Knockout = bitio.getUIBits(1);
        var CompositeSource = bitio.getUIBits(1);
        obj.OnTop = bitio.getUIBits(1);
        obj.Passes = bitio.getUIBits(4);

        return obj;
    };

    /**
     * @returns {Array}
     */
    SwfTag.prototype.colorTransform = function()
    {
        var bitio = this.bitio;
        bitio.byteAlign();

        var result = [1,1,1,1,0,0,0,0];
        if (isArrayBuffer)
            result = new Float32Array(result);

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
    SwfTag.prototype.parseDefineSprite = function(dataLength)
    {
        var _this = this;
        var bitio = _this.bitio;
        var characterId = bitio.getUI16();
        var FrameCount = bitio.getUI16();
        var player = _this.player;
        player.setCharacter(characterId, _this.parseTags(dataLength, characterId));
    };

    /**
     * @param length
     * @returns {ActionScript}
     */
    SwfTag.prototype.parseDoAction = function(length)
    {
        var _this = this;
        var bitio = _this.bitio;
        var data = bitio.getData(length);
        return new ActionScript(data);
    };

    /**
     * @param length
     */
    SwfTag.prototype.parseDoInitAction = function(length)
    {

        var _this = this;
        var spriteId = _this.bitio.getUI16();
        console.log('DoInitAction: '+spriteId);
        _this.player.initActions[spriteId] = _this.parseDoAction(length - 2);
    };

    /**
     * @returns {{}}
     */
    SwfTag.prototype.parseDefineSceneAndFrameLabelData = function ()
    {
        var bitio = this.bitio;

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
     * @param tagType
     * @returns {{}}
     */
    SwfTag.prototype.parseSoundStreamHead = function(tagType)
    {
        var obj = {};
        var bitio = this.bitio;

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
     * @param tagType
     * @param length
     * @returns {{}}
     */
    SwfTag.prototype.parseDoABC = function(tagType, length)
    {
        var obj = {};
        var bitio = this.bitio;
        obj.Flags = bitio.getUI32();
        obj.Name = bitio.getDataUntil('\0');
        obj.ABCData = null;
        return obj;
    };

    /**
     * @returns {{}}
     */
    SwfTag.prototype.parseSymbolClass = function()
    {
        var obj = {};
        var bitio = this.bitio;

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
            };

            if (tagId == 0) {
                obj.class2tag.topLevelClass = name;
                continue;
            }
        }

        return obj;
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
        var player = _this.player;
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
            case 0: // Uncompressed native-endian
            case 3: // Uncompressed little-endian
                mimeType = 'wav';
                break;
            case 1: // ADPCM ? 32KADPCM
                mimeType = 'wav';
                break;
            case 2: // MP3
                mimeType = 'mpeg';
                break;
            case 4: // Nellymoser 16
            case 5: // Nellymoser 8
            case 6: //
                mimeType = 'nellymoser';
                break;
            case 11: // Speex
                mimeType = 'speex';
                break;
            case 15:
                mimeType = 'x-aiff';
                break;
        }

        obj.base64 = 'data:audio/'+ mimeType +';base64,' + window.btoa(SoundData);
        player.sounds[obj.SoundId] = obj;
    };

    /**
     * @param tagType
     */
    SwfTag.prototype.parseStartSound = function(tagType)
    {
        var _this = this;
        var bitio = _this.bitio;
        var obj = {};
        var player = _this.player;

        obj.tagType = tagType;
        obj.SoundId = bitio.getUI16();
        if (tagType == 89) {
            obj.SoundClassName = bitio.getDataUntil('\0');
        }

        obj.SoundInfo = _this.parseSoundInfo();
        player.setCharacter(obj.SoundId, obj);

        var sound = player.sounds[obj.SoundId];
        var audio = _document.createElement('audio');
        audio.onload = function()
        {
            this.load();
            this.preload = 'auto';
            this.autoplay = false;
            this.loop = false;
        };
        audio.src = sound.base64;

        var loadSounds = player.loadSounds;
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
        var _this = this;
        var bitio = _this.bitio;
        var player = _this.player;
        var buttonId = bitio.getUI16();
        var btnObj = player.getCharacter(buttonId);
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
        player.setCharacter(buttonId, btnObj);
    };

    /**
     * @returns {{}}
     */
    SwfTag.prototype.parseSoundInfo = function()
    {
        var obj = {};
        var bitio = this.bitio;
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
     * @param tagType
     * @param length
     */
    SwfTag.prototype.parseDefineFontAlignZones = function(tagType, length)
    {
        var _this = this;
        var bitio = _this.bitio;
        var player = _this.player;

        var FontId = bitio.getUI16();
        var tag = player.getCharacter(FontId);

        tag.CSMTableHint = bitio.getUIBits(2);
        var Reserved = bitio.getUIBits(6);

        var NumGlyphs = tag.NumGlyphs;
        var ZoneTable = [];
        for (var i = 0; i < NumGlyphs; i++) {
            var NumZoneData  = bitio.getUI8();
            var ZoneData = [];
            for (var idx = 0; idx < NumZoneData; idx++) {
                ZoneData[idx] = bitio.getUI32();
                //{
                //    AlignmentCoordinate: bitio.getFloat16(),
                //    Range: bitio.getFloat16()
                //}
            }

            //Reserved = bitio.getUIBits(6);
            ZoneTable[i] =
            {
                ZoneData: ZoneData,
                Mask: bitio.getUI8()
                //    ZoneMaskY: bitio.getUIBits(1),
                //    ZoneMaskX: bitio.getUIBits(1)
            }
        }

        bitio.byteAlign();
        tag.ZoneTable = ZoneTable;

        player.setCharacter(FontId, tag);
    };

    /**
     * @param tagType
     * @param length
     */
    SwfTag.prototype.parseCSMTextSettings = function(tagType, length)
    {
        var _this = this;
        var obj = {};
        var bitio = _this.bitio;
        var player = _this.player;
        obj.tagType = tagType;
        obj.TextID = bitio.getUI16();
        obj.UseFlashType = bitio.getUIBits(2);
        obj.GridFit = bitio.getUIBits(3);
        var Reserved = bitio.getUIBits(3);
        obj.Thickness = bitio.getUI32();
        obj.Sharpness = bitio.getUI32();
        Reserved = bitio.getUI8();
        //player.setCharacter(obj.TextID, obj);
    };

    /**
     * @param tagType
     * @param length
     */
    SwfTag.prototype.parseSoundStreamBlock = function(tagType, length)
    {
        var _this = this;
        var bitio = _this.bitio;

        var obj = {};
        obj.tagType = tagType;
        var compressed = bitio.getData(length);
    };

    // TODO けす
    var asId = 0;
    /**
     * @param data
     * @param constantPool
     * @param register
     * @constructor
     */
    var ActionScript = function (data, constantPool, register)
    {
        this.id = asId++; // TODO けす
        this.constantPool = constantPool == undefined ? [] : constantPool;
        this.params = [];
        this.register = register == undefined ? [] : register;
        this.cache = [];
        this.registerNumbers = [];
        this.init(data);
    };

    /**
     * @param values
     */
    ActionScript.prototype.setParam = function(values)
    {
        var _this = this;
        var params = _this.params;
        var length = params.length;
        var registerNumbers = this.registerNumbers;
        var key = 0;

        for (var i = 0; i < length; i++) {
            if (!values.length)
                break;
            if (!(i in params) || registerNumbers[i] === true)
                continue;
            params[i] = values[key++];
        }
    };

    /**
     * clearParam
     */
    ActionScript.prototype.clearParam = function()
    {
        var _this = this;
        _this.params = [];
        var register = _this.register;
        var length = register.length;
        var registerNumbers = this.registerNumbers;
        if (length) {
            for (var i = 0; i < length; i++) {
                var obj = register[i];
                var key = obj.register;
                _this.params[key] = obj.value;
                if (obj.name == null)
                    registerNumbers[key] = true;
            }
        }
    };

    /**
     * init
     */
    ActionScript.prototype.init = function(data)
    {
        var _this = this;
        var isEnd = false;
        var cache = [];
        var indexes = [];
        _this.clearParam();

        var bitio = new BitIO();
        bitio.setData(data);

        var pBitio = new BitIO();
        var endPoint = data.length;

        for (; bitio.byte_offset < endPoint; ) {
            var startOffset = bitio.byte_offset;
            var obj = {};

            var actionCode = bitio.getUI8();
            obj.actionCode = actionCode;

            var payload = null;
            if (actionCode >= 0x80) {
                var payloadLength = bitio.getUI16();
                payload = bitio.getData(payloadLength);
                pBitio.setData(payload);
                pBitio.setOffset(0, 0);
            }

            switch (actionCode) {
                // GotoFrame
                case 0x81:
                    obj.frame = _floor(pBitio.getUI16()) + 1;
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
                    var idx = 0;
                    for (var i = 0; i < len; i++) {
                        var str = _fromCharCode(payload[i]);
                        if (payload[i] == 0) {
                            idx++;
                            urls[idx] = [];
                            continue;
                        }

                        urls[idx] += str;
                    }

                    var urlString = urls[0];
                    if (typeof urlString == 'string') {
                        var splitUrl = urlString.split('?');

                        // ?が2個あった場合は&に変更
                        if (2 in splitUrl) {
                            urlString = splitUrl[0];
                            urlString += '?' + splitUrl[1];
                            var paramLength = splitUrl.length;
                            for (var i = 2; i < paramLength; i++) {
                                urlString += '&' + splitUrl[i];
                            }
                        }
                    }

                    obj.url = urlString;
                    obj.target = urls[1];

                    break;
                // Push
                case 0x96:
                    var values = [];
                    for (; pBitio.byte_offset < payloadLength; ) {
                        var type = pBitio.getUI8();
                        switch (type) {
                            // String
                            case 0:
                                values[values.length] = String(pBitio.getDataUntil("\0"));
                                break;
                            // Float
                            case 1:
                                values[values.length] = pBitio.getFloat32();
                                break;
                            // null
                            case 2:
                                values[values.length] = null;
                                break;
                            // undefined
                            case 3:
                                values[values.length] = undefined;
                                break;
                            // RegisterNumber
                            case 4:
                                values[values.length] = {"key": pBitio.getUI8()};
                                break;
                            // Boolean
                            case 5:
                                values[values.length] = (pBitio.getUI8()) ? true : false;
                                break;
                            // Double
                            case 6:
                                values[values.length] = pBitio.getFloat64();
                                break;
                            // Integer
                            case 7:
                                values[values.length] = pBitio.getUI32();
                                break;
                            // Constant8
                            case 8:
                                values[values.length] = this.constantPool[pBitio.getUI8()];
                                break;
                            // Constant16
                            case 9:
                                values[values.length] = this.constantPool[pBitio.getUI16()];
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
                    obj.LoadTargetFlag = pBitio.getUIBits(1);// 0=web, 1=スプライト
                    var Reserved = pBitio.getUIBits(4);
                    obj.SendVarsMethod = pBitio.getUIBits(2);// 0=NONE, 1=GET, 2=POST
                    break;
                // GoToFrame2
                case 0x9F:
                    var Reserved = pBitio.getUIBits(6);
                    obj.SceneBiasFlag = pBitio.getUIBit();
                    obj.PlayFlag = pBitio.getUIBit();// 0=stop, 1=play
                    if (obj.SceneBiasFlag == 1)
                        obj.SceneBias = pBitio.getUI16();
                    break;
                // WaitForFrame2
                case 0x8D:
                    console.log('WaitForFrame2');
                    obj.skipCount = pBitio.getUI8();
                    break;
                // ConstantPool
                case 0x88:
                    var count = pBitio.getUI16();
                    var constantPool = [];
                    for (; count--;) {
                        constantPool[constantPool.length] = pBitio.getDataUntil("\0");
                    }
                    obj.constantPool = constantPool;
                    this.constantPool = constantPool;
                    break;
                // ActionDefineFunction
                case 0x9b:
                    obj.FunctionName = pBitio.getDataUntil("\0");
                    var NumParams = pBitio.getUI16();
                    var params = [];
                    for (; NumParams--;) {
                        params[params.length] = pBitio.getDataUntil("\0");
                    }
                    var codeSize  = pBitio.getUI16();
                    obj.as = new ActionScript(bitio.getData(codeSize), this.constantPool);
                    obj.as.params = params;
                    break;
                // ActionWith
                case 0x94:
                    console.log('ActionWith');
                    obj.Size = pBitio.getUI16();
                    break;
                // ActionStoreRegister
                case 0x87:
                    obj.RegisterNumber = pBitio.getUI8();
                    break;
                // SWF 7 ***********************************
                // ActionDefineFunction2
                case 0x8e:
                    //console.log('ActionDefineFunction2');
                    var register = [];
                    var values = [];

                    obj.FunctionName = pBitio.getDataUntil("\0");
                    var NumParams = pBitio.getUI16();
                    var RegisterCount = pBitio.getUI8();
                    obj.PreloadParentFlag = pBitio.getUIBits(1);
                    obj.PreloadRootFlag = pBitio.getUIBits(1);
                    obj.SuppressSuperFlag = pBitio.getUIBits(1);
                    obj.PreloadSuperFlag = pBitio.getUIBits(1);
                    obj.SuppressArgumentsFlag = pBitio.getUIBits(1);
                    obj.PreloadArgumentsFlag = pBitio.getUIBits(1);
                    obj.SuppressThisFlag = pBitio.getUIBits(1);
                    obj.PreloadThisFlag = pBitio.getUIBits(1);
                    var Reserved = pBitio.getUIBits(7);
                    obj.PreloadGlobalFlag = pBitio.getUIBits(1);

                    if (obj.PreloadThisFlag)
                        values[values.length] = 'this';

                    if (obj.PreloadArgumentsFlag)
                        values[values.length] = 'arguments';

                    if (obj.PreloadSuperFlag)
                        values[values.length] = 'super';

                    if (obj.PreloadGlobalFlag)
                        values[values.length] = '_global';

                    if (obj.PreloadRootFlag)
                        values[values.length] = '_root';

                    if (obj.PreloadParentFlag)
                        values[values.length] = '_parent';

                    // 固定の変数
                    for (var idx = 1; idx < RegisterCount; idx++) {
                        var rIdx = idx-1;
                        if (!(rIdx in values))
                            continue;

                        register[register.length] = {
                            register: idx,
                            name: null,
                            value: values[rIdx]
                        };
                    }

                    // 可変の変数
                    for (; NumParams--;) {
                        var Register = pBitio.getUI8();
                        var ParamName = pBitio.getDataUntil("\0");
                        register[register.length] = {
                            register: Register,
                            name: ParamName,
                            value: null
                        };
                    }

                    var codeSize = pBitio.getUI16();
                    obj.as = new ActionScript(bitio.getData(codeSize), constantPool, register);

                    break;
                // ActionTry
                case 0x8f:
                    console.log('ActionTry');
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
                // SWF 9 ***********************************
                // DoABC
                case 0x82:
                    console.log('DoABC');
                    obj.flags = pBitio.getUI32();
                    obj.Name = pBitio.getDataUntil("\0");
                    obj.ABCData = pBitio.getData(payload.length - pBitio.byte_offset);
                    break;
                case 0x00:
                    isEnd = true;
                    break;
            }

            indexes[startOffset] = cache.length;
            cache[cache.length] = obj;

            if (isEnd)
                break;
        }

        // If and Jump
        var length = cache.length;
        for (var i = 0; i < length; i++) {
            var obj = cache[i];
            var code = obj.actionCode;
            if (code == 0x9D || code == 0x99) {
                var index = indexes[obj.offset];
                if (index != undefined) {
                    obj.offset = index - 1;
                } else {
                    obj.offset = cache.length - 1;
                }
            }
        }

        this.cache = cache;
    };

    /**
     * @param value
     * @returns {*}
     */
    ActionScript.prototype.calc = function(value)
    {
        switch (typeof value) {
            case "boolean":
                break;
            case "string":
                if (value == "") {
                    value = 0;
                } else {
                    value = _parseFloat(value);
                    if (_isNaN(value))
                        value = 1;
                }

                break;
            case "object":
                if (value == null) {
                    value = 0;
                } else if (value instanceof Array) {
                    value = value.length;
                } else if (value instanceof Object) {
                    value = 1;
                }
                break;
            default:
                value = _parseFloat(value);
                if (_isNaN(value))
                    value = 0;
                break;
        }
        return value;
    };

    /**
     * @param mc
     * @returns {*}
     */
    ActionScript.prototype.execute = function(mc)
    {
        // init action
        var _this = this;
        var stack = [];
        var arg = [];
        var movieClip = mc;
        var player = mc.getPlayer();
        var version = player.getVersion();

        // 開始
        var cache = _this.cache;
        var cLength = cache.length;
        for (var cIdx = 0; cIdx < cLength; cIdx++) {
            if (!(cIdx in cache))
                continue;
            var aScript = cache[cIdx];
            var actionCode = aScript.actionCode;
            if (!actionCode)
                break;

            switch (actionCode) {
                // ********************************************
                // SWF 3
                // ********************************************
                // GotoFrame
                case 0x81:
                    if (movieClip) {
                        movieClip.stop();
                        movieClip.setNextFrame(aScript.frame);
                    }
                    break;
                // NextFrame
                case 0x04:
                    if (movieClip)
                        movieClip.nextFrame();
                    break;
                // PreviousFrame
                case 0x05:
                    if (movieClip)
                        movieClip.prevFrame();
                    break;
                // Play
                case 0x06:
                    if (movieClip)
                        movieClip.play();
                    break;
                // Stop
                case 0x07:
                    if (movieClip)
                        movieClip.stop();
                    break;
                // ToggleQuality
                case 0x08:
                    // JavaScriptなので使わない
                    break;
                // StopSounds
                case 0x09:
                    if (movieClip)
                        movieClip.stopAllSounds();
                    break;
                // WaitForFrame
                case 0x8A:
                    console.log('WaitForFrame');
                    if (movieClip) {
                        var frame = aScript.frame;
                        var skipCount = aScript.skipCount;
                        if (movieClip.getFrame() == frame) {
                            movieClip.stop();
                        } else {

                        }
                    }
                    break;

                // SetTarget
                case 0x8B:
                    var targetName = aScript.targetName;
                    if (targetName != '') {
                        if (movieClip == null)
                            movieClip = mc;
                        movieClip = movieClip.getMovieClip(targetName);
                    } else {
                        movieClip = null;
                        if (mc.active)
                            movieClip = mc;
                    }
                    break;

                // GoToLabel
                case 0x8C:
                    if (movieClip) {
                        var frame = movieClip.getLabel(aScript.label);
                        movieClip.stop();
                        if (typeof frame == 'number')
                            movieClip.setNextFrame(frame);
                    }
                    break;

                // GetUrl
                case 0x83:
                    if (movieClip)
                        movieClip.getURL(aScript.url, aScript.target);
                    break;

                // ********************************************
                // SWF 4
                // ********************************************

                // 算術演算 ***********************************
                // Add
                case 0x0A:
                    var a = _parseFloat(stack.pop());
                    var b = _parseFloat(stack.pop());
                    if (_isNaN(a)) { a = 0; }
                    if (_isNaN(b)) { b = 0; }
                    stack[stack.length] = a+b;
                    break;
                // Subtract
                case 0x0B:
                    var a = _parseFloat(stack.pop());
                    var b = _parseFloat(stack.pop());
                    if (_isNaN(a)) { a = 0; }
                    if (_isNaN(b)) { b = 0; }
                    stack[stack.length] = b-a;
                    break;
                // Multiply
                case 0x0C:
                    var a = _parseFloat(stack.pop());
                    var b = _parseFloat(stack.pop());
                    if (_isNaN(a)) { a = 0; }
                    if (_isNaN(b)) { b = 0; }
                    stack[stack.length] = a*b;
                    break;
                // Divide
                case 0x0D:
                    var a = _parseFloat(stack.pop());
                    var b = _parseFloat(stack.pop());
                    if (_isNaN(a)) { a = 0; }
                    if (_isNaN(b)) { b = 0; }
                    stack[stack.length] = b/a;
                    break;

                // 数値比較 ***********************************
                // Equals
                case 0x0E:
                    var a = _this.calc(stack.pop());
                    var b = _this.calc(stack.pop());
                    if (version > 4) {
                        stack[stack.length] = (a == b);
                    } else {
                        stack[stack.length] = (a == b) ? 1 : 0;
                    }
                    break;

                // Less
                case 0x0F:
                    var a = _this.calc(stack.pop());
                    var b = _this.calc(stack.pop());
                    if (version > 4) {
                        stack[stack.length] = (b < a);
                    } else {
                        stack[stack.length] = (b < a) ? 1 : 0;
                    }
                    break;

                // 論理演算 ***********************************
                // And
                case 0x10:
                    var a = _this.calc(stack.pop());
                    var b = _this.calc(stack.pop());
                    if (version > 4) {
                        stack[stack.length] = (a != 0 && b != 0);
                    } else {
                        stack[stack.length] = (a != 0 && b != 0) ? 1 : 0;
                    }
                    break;

                // Or
                case 0x11:
                    var a = _this.calc(stack.pop());
                    var b = _this.calc(stack.pop());
                    if (version > 4) {
                        stack[stack.length] = (a != 0 || b != 0);
                    } else {
                        stack[stack.length] = (a != 0 || b != 0) ? 1 : 0;
                    }
                    break;

                // Not
                case 0x12:
                    var value = _this.calc(stack.pop());
                    if (version > 4) {
                        stack[stack.length] = (value == 0);
                    } else {
                        stack[stack.length] = (value == 0) ? 1 : 0;
                    }
                    break;

                // 文字列操作 ***********************************
                // StringEquals
                case 0x13:
                    var a = stack.pop();
                    var b = stack.pop();
                    if (version > 4) {
                        stack[stack.length] = (b == a);
                    } else {
                        stack[stack.length] = (b == a) ? 1 : 0;
                    }
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
                    var b = stack.pop();
                    if (a == null) { a = ''; }
                    if (b == null) { b = ''; }
                    stack[stack.length] = b +''+ a;
                    break;

                case 0x15:// StringExtract
                case 0x35:// MBStringExtract
                    var count = stack.pop();
                    var index = stack.pop() - 1;
                    if (index < 0)
                        index = 0;
                    var string = stack.pop() + '';
                    stack[stack.length]= (count < 0)
                        ? string.substr(index)
                        : string.substr(index, count);
                    break;

                // StringLess
                case 0x29:
                    var a = stack.pop();
                    var b = stack.pop();
                    if (version > 4) {
                        stack[stack.length] = (b < a);
                    } else {
                        stack[stack.length] = (b < a) ? 1 : 0;
                    }
                    break;

                // スタック操作 ***********************************
                // Pop
                case 0x17:
                    stack.pop();
                    break;
                // Push
                case 0x96:
                    var values = aScript.values;
                    var vLen = values.length;
                    for (var i = 0; i < vLen; i++) {
                        var value = values[i];
                        if (value instanceof Object) {
                            var key = value.key;
                            if (key in _this.params) {
                                value = _this.params[key];
                            } else if (key in arg) {
                                value = arg[key];
                            } else {
                                value = undefined;
                            }
                        }
                        stack[stack.length] = value;
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
                    if (movieClip == null)
                        break;

                    if (splitData.length > 1) {
                        var targetMc = movieClip.getMovieClip(splitData[0]);
                        if (targetMc != null) {
                            var frame = (typeof splitData[1] == 'number')
                                ? frame = splitData[1]
                                : frame = targetMc.getLabel(splitData[1]);
                            targetMc.executeActions(frame);
                        }
                    } else {
                        var frame = (typeof splitData[0] == 'number')
                            ? splitData[0]
                            : movieClip.getLabel(splitData[0]);
                        movieClip.executeActions(frame);
                    }
                    break;

                // If
                case 0x9D:
                    var condition = stack.pop();
                    switch (typeof condition) {
                        case 'boolean':
                            break;
                        case 'string':
                            if (!_isNaN(condition))
                                condition = _parseFloat(condition);
                            break;
                    }
                    if (condition)
                        cIdx = aScript.offset;
                    break;
                
                // Jump
                case 0x99:
                    cIdx = aScript.offset;
                    break;

                // 変数 ***********************************
                // GetVariable
                case 0x1C:
                    var name = stack.pop();
                    var value = undefined;
                    if (name instanceof MovieClip) {
                        value = name;
                    } else {
                        if (movieClip)
                            value = movieClip.getProperty(name);
                    }
                    stack[stack.length] = value;

                    break;
                // SetVariable
                case 0x1D:
                    var value = stack.pop();
                    var name = stack.pop() + '';
                    if (movieClip)
                        movieClip.setProperty(name, value);
                    break;

                // ムービー制御 ***********************************
                // GetURL2
                case 0x9A:
                    var target = stack.pop();
                    var urlString = stack.pop();

                    var LoadVariablesFlag = aScript.LoadVariablesFlag; // 0=none, 1=LoadVariables
                    var LoadTargetFlag = aScript.LoadTargetFlag; // 0=web, 1=スプライト
                    var Reserved = aScript.Reserved;
                    var SendVarsMethod = aScript.SendVarsMethod; // 0=NONE, 1=GET, 2=POST

                    var method = 'GET';
                    if (SendVarsMethod == 2)
                        method = 'POST';

                    if (movieClip instanceof MovieClip) {
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
                                    url = url + '&' + params
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
                                    queryString += '&' + key + '=' + value;
                                }

                                if (query != '' && queryString != '') {
                                    queryString = query + queryString.slice(1);
                                }
                                url += queryString;
                            }

                            if (LoadVariablesFlag) {
                                movieClip.loadVariables(url, target, method);
                            } else if (LoadTargetFlag) {
                                movieClip.loadMovie(url, target, SendVarsMethod);
                            } else {
                                movieClip.getURL(url, target, method);
                            }
                        } else {
                            movieClip.unloadMovie(target);
                        }
                    }

                    break;
                // GetProperty
                case 0x22:
                    var index = stack.pop();
                    if (!_isNaN(index))
                        index = _floor(index);
                    var target = stack.pop();
                    var value = undefined;

                    if (movieClip) {
                        targetMc = movieClip;
                        if (target != null) {
                            targetMc = movieClip.getMovieClip(target);
                            if (!targetMc)
                                break;
                        }
                        value = targetMc.getProperty(index);
                    }

                    stack[stack.length] = value;
                    break;
                // GoToFrame2
                case 0x9F:
                    var SceneBiasFlag = aScript.SceneBiasFlag;
                    var PlayFlag = aScript.PlayFlag; // 0=stop, 1=play
                    if (SceneBiasFlag == 1)
                        var SceneBias = aScript.SceneBias;

                    var frame = stack.pop();
                    if (frame == null || frame == undefined || movieClip == null) {
                        break;
                    }

                    if (_isNaN(frame)) {
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
                    var target = stack.pop();
                    if (movieClip == null)
                        movieClip = mc;
                    movieClip = movieClip.getMovieClip(target);
                    break;
                // SetProperty
                case  0x23:
                    var value = stack.pop();
                    var index = stack.pop();
                    if (!_isNaN(index))
                        index = _floor(index);
                    var target = stack.pop();

                    if (movieClip) {
                        var targetMc = movieClip;
                        if (target != null) {
                            targetMc = movieClip.getMovieClip(target);
                            if (targetMc == null) {
                                break;
                            }
                        }
                        targetMc.setProperty(index, value);
                    }

                    break;
                // StartDrag
                case 0x27:
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

                    var targetMc = movieClip;
                    if (target instanceof MovieClip)
                        targetMc = target;

                    if (typeof target == "string")
                        console.log('StartDrag:String');

                    if (targetMc != null)
                        targetMc.startDrag(lock, x1, y1, x2, y2);

                    break;
                // WaitForFrame2
                case 0x8D:
                    console.log('WaitForFrame2');
                    var frame = stack.pop();
                    var skipCount = aScript.skipCount;
                    if (movieClip.getFrame() == frame) {

                    }

                    break;
                // CloneSprite
                case 0x24:
                    var depth = _parseFloat(stack.pop());
                    var target = stack.pop() + '';
                    var source = stack.pop() + '';
                    if (movieClip)
                        movieClip.duplicateMovieClip(target, source, depth);
                    break;

                // RemoveSprite
                case 0x25:
                    var target = stack.pop() + '';
                    if (movieClip)
                        movieClip.removeMovieClip(target);
                    break;

                // EndDrag
                case 0x28:
                    if (movieClip)
                        movieClip.stopDrag();
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
                    } else if (value instanceof MovieClip) {
                        value = value.getTarget();
                    }
                    console.log('[trace] ' + value);
                    break;
                case 0x00:
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
                    for (; count--;)
                        params[params.length] = stack.pop();

                    value = undefined;
                    if (object) {
                        method = mc.checkMethod(method);
                        if (object instanceof MovieClip || mc[method] != undefined) {
                            if (typeof object == 'string')
                                object = movieClip.getMovieClip(object);

                            if (object[method] != undefined) {
                                value = object[method].apply(object, params);
                            } else {

                                var as = object.getVariable(method);
                                if (as instanceof ActionScript) {
                                    as.setParam(params);
                                    value = as.execute(object);
                                    as.clearParam();
                                } else {
                                    console.log('TODO:'+method);
                                }
                            }
                        } else {
                            value = object[method].apply(object, params);
                        }
                    }

                    stack[stack.length] = value;

                    break;
                // ConstantPool
                case 0x88:
                    _this.constantPool = aScript.constantPool;

                    break;
                // ActionCallFunction
                case 0x3d:
                    var FunctionName = stack.pop();
                    var numArgs = _parseFloat(stack.pop());
                    var params = [];
                    for (; numArgs--;) {
                        params[params.length] = stack.pop();
                    }

                    var ret = null;
                    if (movieClip) {
                        var FunctionName = movieClip.checkMethod(FunctionName);
                        if (window[FunctionName]) {
                            targetMc = movieClip;
                            if (params[0] instanceof MovieClip)
                                targetMc = params.shift();

                            var method = params.shift();
                            if (method instanceof ActionScript) {
                                var as = method;
                            } else {
                                var as = targetMc.getVariable(method);
                            }

                            params.unshift(function()
                            {
                                if (as instanceof ActionScript) {
                                    as.setParam(arguments);
                                    as.execute(movieClip);
                                    as.clearParam();
                                }
                            });

                            ret = window[FunctionName].apply(window, params);
                        } else if (movieClip[FunctionName]) {
                            movieClip[FunctionName].apply(movieClip, params);
                        } else {
                            var as = movieClip.getVariable(FunctionName);
                            if (as instanceof ActionScript) {
                                as.setParam(params);
                                ret = as.execute(movieClip);
                                as.clearParam();
                            } else {
                                console.log(as);
                            }
                        }

                        stack[stack.length] = ret;
                    }

                    break;
                // ActionDefineFunction
                case 0x9b:
                    var as = aScript.as;
                    as.constantPool = clone(_this.constantPool);

                    var FunctionName = aScript.FunctionName;
                    if (FunctionName != '')
                        movieClip.setVariable(FunctionName, as);

                    stack[stack.length] = as;

                    break;
                // ActionDefineLocal
                case 0x3c:
                    var value = stack.pop();
                    var name = stack.pop();
                    if (movieClip)
                        movieClip.setVariable(name, value);
                    break;
                // ActionDefineLocal2
                case 0x41:
                    var name = stack.pop();
                    if (movieClip)
                        movieClip.setVariable(name, undefined);
                    break;
                // ActionDelete
                case 0x3a:
                    var name = stack.pop();
                    var object = stack.pop();
                    if (object instanceof MovieClip)
                        object.setVariable(name, undefined);
                    break;
                // ActionDelete2
                case 0x3b:
                    var name = stack.pop();
                    if (movieClip)
                        movieClip.setVariable(name, undefined);
                    break;
                // ActionEnumerate
                case 0x46:
                    var path = stack.pop();
                    stack[stack.length] = null;

                    if (movieClip) {
                        var targetMc = movieClip.getMovieClip(path);
                        if (targetMc != null) {
                            var variables = targetMc.variables;
                            for (var name in variables) {
                                stack[stack.length] = name;
                            }
                        }
                    }

                    break;
                // ActionEquals2
                case 0x49:
                    var a = stack.pop();
                    var b = stack.pop();

                    var aString = a;
                    if (a instanceof MovieClip)
                        aString = a.getTarget();

                    var bString = b;
                    if (b instanceof MovieClip)
                        bString = b.getTarget();

                    arg[1] = a;
                    arg[2] = b;

                    stack[stack.length] = (bString === aString);
                    break;
                // ActionGetMember
                case 0x4e:
                    var name = stack.pop();
                    var object = stack.pop();

                    if (typeof object == 'string')
                        object = movieClip.getMovieClip(object);

                    var property = undefined;
                    if (object instanceof Object) {
                        if ('getProperty' in object) {
                            property = object.getProperty(name);
                        } else {
                            property = object[name];
                        }
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
                    for (;number--;)
                        params[params.length] = stack.pop();

                    if (method == '') {
                        stack[stack.length] = object.apply(object, params);
                    } else {
                        function construct(constructor, args)
                        {
                            function newFunc() {
                                return constructor.apply(this, args);
                            }
                            newFunc.prototype = constructor.prototype;
                            return new newFunc();
                        }
                        stack[stack.length] = construct(object[method], params);
                    }

                    break;
                // ActionNewObject
                case 0x40:
                    var object = stack.pop() + '';
                    var numArgs = _parseFloat(stack.pop());
                    var params = [];
                    for (; numArgs--;)
                        params[params.length] = stack.pop();

                    if (object == 'MovieClip') {
                        stack[stack.length] = new MovieClip();
                    } else if (object == 'Sound') {
                        var sound = new Sound(params[0]);
                        sound.movieClip = movieClip;
                        stack[stack.length] = sound;
                    } else if (window[object]) {
                        stack[stack.length] = new window[object]();
                    } else {
                        if (movieClip) {
                            var func = movieClip.getVariable(object);
                            if (func instanceof ActionScript) {
                                var length = params.length;
                                for (var i = 0; i < length; i++)
                                    func.params[i+1] = params[i];

                                stack[stack.length] = func.execute(movieClip);
                                func.clearParam();
                            } else if (func instanceof Function) {
                                stack[stack.length] = new func();
                            }
                        }
                    }

                    break;
                // ActionSetMember
                case 0x4f:
                    var value = stack.pop();
                    var name = stack.pop();
                    var object = stack.pop();

                    if (object == null)
                        break;

                    if (typeof object == 'string')
                        object = movieClip.getMovieClip(object);

                    if (!object)
                        object = movieClip;

                    if ('setProperty' in object) {
                        object.setProperty(name, value);
                    } else if (object instanceof Object) {
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
                            for (;;) {
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
                    var Size = aScript.Size;
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
                    var object = stack.pop();
                    stack[stack.length] = (object instanceof MovieClip) ? 'movieclip' : typeof object;
                    break;
                // ActionAdd2
                case 0x47:
                    var a = stack.pop();
                    var b = stack.pop();

                    arg[1] = a;
                    arg[2] = b;

                    stack[stack.length] = b+a;
                    break;
                // ActionLess2
                case 0x48:
                    var a = stack.pop();
                    var b = stack.pop();

                    arg[1] = a;
                    arg[2] = b;

                    stack[stack.length] = (b < a);
                    break;
                // ActionModulo
                case 0x3f:
                    var y = stack.pop();
                    var x = stack.pop();
                    stack[stack.length] = x % y;
                    break;

                // ActionBitAnd
                case 0x60:
                    var a = stack.pop();
                    var b = stack.pop();

                    arg[1] = a;
                    arg[2] = b;

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

                    arg[1] = a;
                    arg[2] = b;

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

                    arg[1] = a;
                    arg[2] = b;

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
                // ActionReturnActionReturn
                case 0x3e:
                    return stack.pop();
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
                    var RegisterNumber = aScript.RegisterNumber;
                    var value = stack[stack.length-1];
                    arg[RegisterNumber] = value;
                    break;

                // SWF 6 ***********************************
                // ActionInstanceOf
                case 0x54:
                    var constr = stack.pop();
                    var object = stack.pop();
                    stack[stack.length] = (object instanceof constr) ? 1 : 0;
                    break;
                // ActionEnumerate2
                case 0x55:
                    var object = stack.pop();
                    stack[stack.length] = null;

                    if (object instanceof MovieClip)
                        object = object.variables;

                    if (typeof object == "object") {
                        for (var name in object) {
                            stack[stack.length] = name;
                        }
                    }
                    break;
                // ActionStrictEquals
                case 0x66:
                    var a = stack.pop();
                    var b = stack.pop();

                    arg[1] = a;
                    arg[2] = b;

                    stack[stack.length] = (a === b);
                    break;
                // ActionGreater
                case 0x67:
                    var a = stack.pop();
                    var b = stack.pop();

                    arg[1] = a;
                    arg[2] = b;

                    stack[stack.length] = (b > a);
                    break;
                // ActionStringGreater
                case 0x68:
                    var a = stack.pop();
                    var b = stack.pop();

                    arg[1] = a;
                    arg[2] = b;

                    stack[stack.length] = (b > a);
                    break;

                // SWF 7 ***********************************
                // ActionDefineFunction2
                case 0x8e:
                    var as = aScript.as;
                    as.constantPool = clone(_this.constantPool);

                    var FunctionName = aScript.FunctionName;
                    if (FunctionName != '')
                        movieClip.setVariable(FunctionName, as);

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

                    break;
                // ActionThrow
                case 0x2a:
                    throw new Error(stack.pop());
                    break;

                // SWF 9 ***********************************
                // DoABC
                case 0x82:
                    console.log('DoABC');
                    var flags = pBitio.getUI32();
                    var Name = pBitio.getDataUntil("\0");
                    var ABCData = pBitio.getData(payload.length - pBitio.byte_offset);
                    break;

                default:
                    console.log('[actionScript] '+actionCode);
                    break;
            }
        }
    };

    /**
     * @constructor
     */
    var Property = function(caller)
    {
        var _this = this;
        caller.getProperty = _this.getProperty;
        caller.setProperty = _this.setProperty;
        caller.getX = _this.getX;
        caller.setX = _this.setX;
        caller.getY = _this.getY;
        caller.setY = _this.setY;
        caller.getXScale = _this.getXScale;
        caller.setXScale = _this.setXScale;
        caller.getYScale = _this.getYScale;
        caller.setYScale = _this.setYScale;
        caller.getAlpha = _this.getAlpha;
        caller.setAlpha = _this.setAlpha;
        caller.getVisible = _this.getVisible;
        caller.setVisible = _this.setVisible;
        caller.getWidth = _this.getWidth;
        caller.setWidth = _this.setWidth;
        caller.getHeight = _this.getHeight;
        caller.setHeight = _this.setHeight;
        caller.getRotation = _this.getRotation;
        caller.setRotation = _this.setRotation;
        caller.getTarget = _this.getTarget;
        caller.setTarget = _this.setTarget;
        caller.getName = _this.getName;
        caller.setName = _this.setName;
        caller.getXMouse = _this.getXMouse;
        caller.getYMouse = _this.getYMouse;
        caller.getVariable = _this.getVariable;
        caller.setVariable = _this.setVariable;
        caller.getMovieClip = _this.getMovieClip;

        caller.variables = [];
        caller._currentframe = 1;
        caller._visible = true;
        caller._droptarget = null;
        caller._url = null;
        caller._highquality = 1;
        caller._focusrect = 1;
        caller._soundbuftime = null;
        caller._totalframes = 1;
        caller._level = 0;
        caller._depth = 0;
        caller._name = null;
        caller._framesloaded = 0;
        caller._target = '';
    };

    /**
     * @param name
     * @returns {*}
     */
    Property.prototype.getProperty = function(name)
    {
        var value = undefined;
        var _this = this;
        if (typeof name == 'string') {
            if (name.indexOf(':') != -1) {
                var split = name.split(':');
                var mc = _this.getMovieClip(split[0]);
                if (mc)
                    _this = mc;
                name = split[1];
            } else if (name.indexOf('.') != -1) {
                var split = name.split('.');
                name = split.pop();
                var path = "";
                var length = split.length;
                for (var i = 0; i < length; i++) {
                    path += split[i];
                }
                var mc = _this.getMovieClip(path);
                if (mc)
                    _this = mc;
            }
        }

        switch (name) {
            case 0:
            case '_x':
                value = _this.getX();
                break;
            case 1:
            case '_y':
                value = _this.getY();
                break;
            case 2:
            case '_xscale':
                value = _this.getXScale();
                break;
            case 3:
            case '_yscale':
                value = _this.getYScale();
                break;
            case 4:
            case '_currentframe':
                if (_this instanceof MovieClip)
                    value = _this.getFrame();
                break;
            case 5:
            case '_totalframes':
                if (_this instanceof MovieClip)
                    value = _this.getTotalFrames();
                break;
            case 6:
            case '_alpha':
                value = _this.getAlpha();
                break;
            case 7:
            case '_visible':
                value = _this.getVisible();
                break;
            case 8:
            case '_width':
                value = _this.getWidth();
                break;
            case 9:
            case '_height':
                value = _this.getHeight();
                break;
            case 10:
            case '_rotation':
                value = _this.getRotation();
                break;
            case 11:
            case '_target':
                value = _this.getTarget();
                break;
            case 12:
            case '_framesloaded':
                value = _this._framesloaded;
                break;
            case 13:
            case '_name':
                value = _this.getName();
                break;
            case 14:
            case '_droptarget':
                if (_this instanceof MovieClip)
                    value = _this.getDropTarget();
                break;
            case 15:
            case '_url':
                value = _this._url;
                break;
            case 16:
            case '_highquality':
                value = _this._highquality;
                break;
            case 17:
            case '_focusrect':
                value = _this._focusrect;
                break;
            case 18:
            case '_soundbuftime':
                value = _this._soundbuftime;
                break;
            case 19:
            case '_quality':
                value = _this._quality;
                break;
            case 20:
            case '_xmouse':
                value = _this.getXMouse();
                break;
            case 21:
            case '_ymouse':
                value = _this.getYMouse();
                break;
            case 'text':
                var variable = _this.getVariable('variable');
                if (variable) {
                    value = _this.getVariable(variable);
                } else {
                    value = _this.getVariable('text');
                }

                break;
            case 'Key':
                value = keyClass;
                break;
            default:
                value = _this.getVariable(name);
                break;
        }

        return value;
    };

    /**
     * @param name
     * @param value
     */
    Property.prototype.setProperty = function(name, value)
    {
        var _this = this;
        if (typeof name == 'string') {
            if (name.indexOf(':') != -1) {
                var split = name.split(':');
                var mc = _this.getMovieClip(split[0]);
                if (mc)
                    _this = mc;
                name = split[1];
            } else if (name.indexOf('.') != -1) {
                var split = name.split('.');
                name = split.pop();
                var path = "";
                var length = split.length;
                for (var i = 0; i < length; i++) {
                    path += split[i];
                }
                var mc = _this.getMovieClip(path);
                if (mc)
                    _this = mc;
            }
        }

        switch (name) {
            case 0:
            case '_x':
                value = _parseFloat(value);
                if (!_isNaN(value))
                    _this.setX(value);
                break;
            case 1:
            case '_y':
                value = _parseFloat(value);
                if (!_isNaN(value))
                    _this.setY(value);
                break;
            case 2:
            case '_xscale':
                value = _parseFloat(value);
                if (!_isNaN(value))
                    _this.setXScale(value);
                break;
            case 3:
            case '_yscale':
                value = _parseFloat(value);
                if (!_isNaN(value))
                    _this.setYScale(value);
                break;
            case 4:
            case '_currentframe':
                if (_this instanceof MovieClip) {
                    value = _parseFloat(value);
                    if (!_isNaN(value))
                        _this.setNextFrame(value);
                    break;
                }
            case 5:
            case '_totalframes':
                if (_this instanceof MovieClip) {
                    value = _parseFloat(value);
                    if (!_isNaN(value))
                        _this.setTotalFrames(value);
                    break;
                }
            case 6:
            case '_alpha':
                value = _parseFloat(value);
                if (!_isNaN(value))
                    _this.setAlpha(value);
                break;
            case 7:
            case '_visible':
                _this.setVisible(value);
                break;
            case 8:
            case '_width':
                value = _parseFloat(value);
                if (!_isNaN(value))
                    _this.setWidth(value);
                break;
            case 9:
            case '_height':
                value = _parseFloat(value);
                if (!_isNaN(value))
                    _this.setHeight(value);
                break;
            case 10:
            case '_rotation':
                value = _parseFloat(value);
                if (!_isNaN(value))
                    _this.setRotation(value);
                break;
            case 11:
            case '_target':
                break;
            case 12:
            case '_framesloaded':
                break;
            case 13:
            case '_name':
                _this.setName(value);
                break;
            case 14:
            case '_droptarget':
                break;
            case 15:
            case '_url':
                break;
            case 16:
            case '_highquality':
                _this._highquality = value;
                break;
            case 17:
            case '_focusrect':
                _this._focusrect = value;
                break;
            case 18:
            case '_soundbuftime':
                _this._soundbuftime = value;
                break;
            case 19:
            case '_quality':
                _this._quality = value;
                break;
            case 20:
            case '_xmouse':
                break;
            case 21:
            case '_ymouse':
                break;
            case 'text':
                var variable = _this.getVariable('variable');
                if (variable) {
                    _this.setVariable(variable, value);
                } else {
                    _this.setVariable('text', value);
                }
                break;
            default:
                _this.setVariable(name, value);
                break;
        }
    };

    /**
     * @returns {number}
     */
    Property.prototype.getX = function()
    {
        var matrix = this.getMatrix();
        return matrix[4]/20;
    };

    /**
     * @param x
     */
    Property.prototype.setX = function(x)
    {
        var matrix = this.getMatrix();
        matrix[4] = x*20;
    };

    /**
     * @returns {*}
     */
    Property.prototype.getY = function()
    {
        var matrix = this.getMatrix();
        return matrix[5]/20;
    };

    /**
     * @param y
     */
    Property.prototype.setY = function(y)
    {
        var matrix = this.getMatrix();
        matrix[5] = y*20;
    };
    /**
     * @returns {*}
     */
    Property.prototype.getXScale = function()
    {
        var matrix = this.getMatrix();
        return _sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]) * 100;
    };

    /**
     * @param xscale
     */
    Property.prototype.setXScale = function(xscale)
    {
        var matrix = this.getMatrix();
        var radianX = _atan2(matrix[1], matrix[0]);
        xscale /= 100;
        matrix[0] = xscale * _cos(radianX);
        matrix[1] = xscale * _sin(radianX);
    };

    /**
     * @returns {*}
     */
    Property.prototype.getYScale = function()
    {
        var matrix = this.getMatrix();
        return _sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3]) * 100;
    };

    /**
     * @param yscale
     */
    Property.prototype.setYScale = function(yscale)
    {
        var matrix = this.getMatrix();
        var radianY = _atan2(-matrix[2], matrix[3]);
        yscale /= 100;
        matrix[2] = -yscale * _sin(radianY);
        matrix[3] = yscale * _cos(radianY);
    };

    /**
     * @returns {number}
     */
    Property.prototype.getAlpha = function()
    {
        var colorTransform = this.getColorTransform();
        var alpha = colorTransform[3] + (colorTransform[7] / 255);
        return alpha * 100;
    };

    /**
     * @param alpha
     */
    Property.prototype.setAlpha = function(alpha)
    {
        var colorTransform = this.getColorTransform();
        colorTransform[3] = alpha / 100;
        colorTransform[7] = 0;
    };

    /**
     * @returns {number}
     */
    Property.prototype.getVisible = function()
    {
        var _this = this;
        var player = _this.getPlayer();
        var version = player.getVersion();
        if (version > 4)
            return _this._visible;
        return (_this._visible) ? 1 : 0;
    };

    /**
     * @param visible
     */
    Property.prototype.setVisible = function(visible)
    {
        var _this = this;
        if (typeof visible == "boolean") {
            _this._visible = visible;
        } else {
            visible = _parseFloat(visible);
            if (!_isNaN(visible))
                _this._visible = (visible) ? true : false;
        }
    };

    /**
     * @returns {number}
     */
    Property.prototype.getWidth = function()
    {
        var _this = this;
        var matrix = _this.getMatrix();
        var bounds = _this.getBounds(matrix);
        var width = bounds.xMax - bounds.xMin;
        if (width < 0)
            width *= -1;
        return width;
    };

    /**
     * @param width
     */
    Property.prototype.setWidth = function(width)
    {
        var _this = this;
        var matrix = _this.getMatrix();
        matrix[0] = width * matrix[0] / _this.getWidth();
    };

    /**
     * @returns {number}
     */
    Property.prototype.getHeight = function()
    {
        var _this = this;
        var matrix = _this.getMatrix();
        var bounds = _this.getBounds(matrix);
        var height = bounds.yMax - bounds.yMin;
        if (height < 0)
            height *= -1;
        return height;
    };

    /**
     * @param height
     */
    Property.prototype.setHeight = function(height)
    {
        var _this = this;
        var matrix = _this.getMatrix();
        matrix[3] = height * matrix[3] / _this.getHeight();
    };

    /**
     * @returns {number}
     */
    Property.prototype.getRotation = function()
    {
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
    Property.prototype.setRotation = function(rotation)
    {
        var matrix = this.getMatrix();
        var radianX = _atan2(matrix[1], matrix[0]);
        var radianY = _atan2(-matrix[2], matrix[3]);
        var ScaleX = _sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
        var ScaleY = _sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3]);
        rotation *= _PI / 180;
        radianY += rotation - radianX;
        radianX = rotation;
        matrix[0] = ScaleX  * _cos(radianX);
        matrix[1] = ScaleX  * _sin(radianX);
        matrix[2] = -ScaleY * _sin(radianY);
        matrix[3] = ScaleY  * _cos(radianY);
    };

    /**
     * @returns {string}
     */
    Property.prototype.getTarget = function()
    {
        return this._target;
    };

    /**
     * @param target
     */
    Property.prototype.setTarget = function(target)
    {
        this._target = target;
    };

    /**
     * @returns {null}
     */
    Property.prototype.getName = function()
    {
        return this._name;
    };

    /**
     * @param name
     */
    Property.prototype.setName = function(name)
    {
        this._name = name;
    };

    /**
     * @returns {*}
     */
    Property.prototype.getXMouse = function()
    {
        if (!_event)
            return null;

        var _this = this;
        var _root = _this.getMovieClip('_root');
        var player = _root.getPlayer();
        var div = _document.getElementById(player.getName());
        var bounds = div.getBoundingClientRect();
        var docBody = _document.body;
        var x = docBody.scrollLeft + bounds.left;
        var touchX = 0;


        if (isTouch) {
            var changedTouche = _event.changedTouches[0];
            touchX = changedTouche.pageX;
        } else {
            touchX = _event.pageX;
        }

        var mc = _this;
        var matrix = _this.getMatrix();
        var _multiplicationMatrix = multiplicationMatrix;
        for (;;) {
            var parent = mc.getParent();
            if (!parent || parent.characterId == 0)
                break;
            matrix = _multiplicationMatrix(parent.getMatrix(), matrix);
            mc = parent;
        }

        var scale = player.getScale();
        touchX -= x;
        touchX /= scale;
        touchX -= matrix[4]/20;

        return touchX;
    };

    /**
     * @returns {*}
     */
    Property.prototype.getYMouse = function()
    {
        if (!_event)
            return null;

        var _this = this;
        var _root = _this.getMovieClip('_root');
        var player = _root.getPlayer();
        var div = _document.getElementById(player.getName());
        var bounds = div.getBoundingClientRect();
        var docBody = _document.body;
        var y = docBody.scrollTop + bounds.top;
        var touchY = 0;

        if (isTouch) {
            var changedTouche = _event.changedTouches[0];
            touchY = changedTouche.pageY;
        } else {
            touchY = _event.pageY;
        }

        var mc = _this;
        var matrix = _this.getMatrix();
        var _multiplicationMatrix = multiplicationMatrix;
        for (;;) {
            var parent = mc.getParent();
            if (!parent || parent.characterId == 0)
                break;
            matrix = _multiplicationMatrix(parent.getMatrix(), matrix);
            mc = parent;
        }

        var scale = player.getScale();
        touchY -= y;
        touchY /= scale;
        touchY -= matrix[5]/20;

        return touchY;
    };

    /**
     * @param name
     * @returns {*}
     */
    Property.prototype.getVariable = function(name)
    {
        var _this = this;
        var variables = _this.variables;
        if (name in variables)
            return variables[name];

        var player = _this.getPlayer();
        var version = player.getVersion();
        if (version < 7) {
            for (var key in variables) {
                if (typeof key != 'string')
                    continue;

                if (key.toLowerCase() == name.toLowerCase())
                    return variables[key];
            }
        }

        if (version > 4) {
            if (name in window)
                return window[name];
            return _this.getMovieClip(name);
        }
        return undefined;
    };

    /**
     * @param name
     * @param value
     */
    Property.prototype.setVariable = function(name, value)
    {
        var _this = this;
        var variables = _this.variables;
        var player = _this.getPlayer();

        if (player.getVersion() < 7 && typeof name == 'string') {
            for (var key in variables) {
                if (key.toLowerCase() != name.toLowerCase())
                    continue;
                _this.variables[key] = value;
                return 0;
            }
        }
        _this.variables[String(name)] = value;
    };

    /**
     * @param path
     * @returns {*}
     */
    Property.prototype.getMovieClip = function(path)
    {
        var _this = this;
        var mc = _this;
        var _root = mc;
        for (;;) {
            var parent = _root.getParent();
            if (!parent)
                break;
            _root = parent;
        }

        var _path = path + '';
        if (_path == '_root')
            return _root;

        if (_path == 'this')
            return this;

        var player = _root.getPlayer();
        var parent = mc.getParent();
        if (!parent)
            parent = player.getParent();

        if (_path == '_parent')
            return parent;

        if (_path.substr(0, 6) == '_level') {
            var level = _path.substr(6);
            if (level == 0)
                return _root;

            var tags = parent.getTags();
            var tag = tags[level];
            if (tag instanceof MovieClip)
                return tag;
            return undefined;
        }

        var len = 1;
        var splitData = [_path];
        if (_path.indexOf('/') != -1) {
            splitData = _path.split('/');
            len = splitData.length;
            if (splitData[0] == '')
                mc = _root;
        } else if (_path.indexOf('.') != -1) {
            splitData = _path.split('.');
            len = splitData.length;
            if (splitData[0] == '_root')
                mc = _root;
        }

        for (var i = 0; i < len; i++) {
            var name = splitData[i];
            if (name == '') {
                continue;
            }

            if (name == '_root') {
                mc = _root;
                continue;
            }

            if (name == 'this') {
                mc = _this;
                continue;
            }

            if (name == '_parent') {
                parent = mc.getParent();
                if (!parent)
                    parent = player.getParent();
                mc = parent;
                continue;
            }

            if (name == '..') {
                mc = mc.getParent();
                continue;
            }

            var tags = mc.getTags();
            if (tags == undefined) {
                mc = undefined;
                break;
            }

            var tagLength = tags.length;
            var setTarget = false;
            for (var idx = 0; idx < tagLength; idx++) {
                if (!(idx in tags))
                    continue;

                var tag = tags[idx];
                var tagName = tag.getName();
                if (!tagName)
                    continue;

                if (tagName == name) {
                    mc = tag;
                    setTarget = true;
                    break;
                }
            }

            if (!setTarget)
                return undefined;
        }
        return mc;
    };

    /**
     * @param caller
     * @constructor
     */
    var Common = function(caller)
    {
        var _this = this;
        caller.characterId = 0;
        caller.tagType = 0;
        caller.ratio = 0;
        caller.clipDepth = 0;
        caller.isClipDepth = false;
        caller.getCharacterId = _this.getCharacterId;
        caller.setCharacterId = _this.setCharacterId;
        caller.getTagType = _this.getTagType;
        caller.setTagType = _this.setTagType;
        caller.getRatio = _this.getRatio;
        caller.setRatio = _this.setRatio;
    };

    /**
     * @returns {number}
     */
    Common.prototype.getCharacterId = function()
    {
        return this.characterId;
    };

    /**
     * @param characterId
     */
    Common.prototype.setCharacterId = function(characterId)
    {
        this.characterId = characterId;
    };

    /**
     * @returns {number}
     */
    Common.prototype.getTagType = function()
    {
        return this.tagType;
    };

    /**
     * @param tagType
     */
    Common.prototype.setTagType = function(tagType)
    {
        this.tagType = tagType;
    };

    /**
     * @returns {number}
     */
    Common.prototype.getRatio = function()
    {
        return this.ratio;
    };

    /**
     * @param ratio
     */
    Common.prototype.setRatio = function(ratio)
    {
        this.ratio = ratio;
    };

    /**
     * @param caller
     * @constructor
     */
    var ShapeAndText = function(caller)
    {
        var _this = this;
        caller.bounds = null;
        caller.matrix = null;
        caller.colorTransform = null;
        caller.getBounds = _this.getBounds;
        caller.setBounds = _this.setBounds;
        caller.getMatrix = _this.getMatrix;
        caller.setMatrix = _this.setMatrix;
        caller.getColorTransform = _this.getColorTransform;
        caller.setColorTransform = _this.setColorTransform;
    };

    /**
     * @returns {{}}
     */
    ShapeAndText.prototype.getBounds = function(matrix)
    {
        if (matrix) {
            var bounds = boundsMatrix(this.bounds, matrix);
            for (var name in bounds)
                bounds[name] /= 20;
            return bounds
        } else {
            return this.bounds;
        }
    };

    /**
     * @param bounds
     */
    ShapeAndText.prototype.setBounds = function(bounds)
    {
        this.bounds = bounds;
    };

    /**
     * @returns []
     */
    ShapeAndText.prototype.getMatrix = function()
    {
        return this.matrix;
    };

    /**
     * @param matrix
     */
    ShapeAndText.prototype.setMatrix = function(matrix)
    {
        this.matrix = matrix;
    };

    /**
     * @returns []
     */
    ShapeAndText.prototype.getColorTransform = function()
    {
        return this.colorTransform;
    };

    /**
     * @param colorTransform
     */
    ShapeAndText.prototype.setColorTransform = function(colorTransform)
    {
        this.colorTransform = colorTransform;
    };

    /**
     * @param caller
     * @constructor
     */
    var Dummy = function(caller)
    {
        var _this = this;
        caller.getName = _this.getName;
        caller.getVisible = _this.getVisible;
        caller.reset = _this.reset;
        caller.addActions = _this.addActions;
        caller.putFrame = _this.putFrame;
    };

    Dummy.prototype.getName = function(){return null;};
    Dummy.prototype.getVisible = function(){return true;};
    Dummy.prototype.reset = function(){};
    Dummy.prototype.putFrame = function(){};
    Dummy.prototype.addActions = function(){};

    /**
     * @constructor
     */
    var Shape = function()
    {
        var _this = this;
        new Common(_this);
        new ShapeAndText(_this);
        new Dummy(_this);
        _this.data = null;
    };

    /**
     * @returns []
     */
    Shape.prototype.getData = function()
    {
        return this.data;
    };

    /**
     * @param data
     */
    Shape.prototype.setData = function(data)
    {
        this.data = data;
    };

    /**
     * @returns {boolean}
     */
    Shape.prototype.isMorphing = function()
    {
        var tagType = this.getTagType();
        return (tagType == 46 || tagType == 84);
    };

    /**
     * @param ctx
     * @param matrix
     * @param colorTransform
     * @param player
     * @param visible
     * @param localPlayer
     * @returns {number}
     */
    Shape.prototype.render = function(ctx, matrix, colorTransform, player, visible, localPlayer)
    {
        var _this = this;
        var cache = null;
        var alpha = colorTransform[3] + (colorTransform[7] / 255);
        if (!alpha || !visible)
            return 0;

        var _multiplicationMatrix = multiplicationMatrix;
        var rMatrix = _multiplicationMatrix(player.getMatrix(), matrix);
        var isClipDepth = _this.isClipDepth || player.isClipDepth;
        if (isClipDepth) {
            ctx.setTransform(rMatrix[0], rMatrix[1], rMatrix[2], rMatrix[3], rMatrix[4], rMatrix[5]);
            _this.executeRender(ctx, _min(rMatrix[0], rMatrix[3]), colorTransform, isClipDepth, player, localPlayer);
        } else {
            var xScale = _sqrt(rMatrix[0] * rMatrix[0] + rMatrix[1] * rMatrix[1]);
            var yScale = _sqrt(rMatrix[2] * rMatrix[2] + rMatrix[3] * rMatrix[3]);
            xScale = _pow(_SQRT2, _ceil(_log(xScale) / (_LN2 / 2)));
            yScale = _pow(_SQRT2, _ceil(_log(yScale) / (_LN2 / 2)));
            var bounds = _this.getBounds();
            var xMax = bounds.xMax;
            var xMin = bounds.xMin;
            var yMax = bounds.yMax;
            var yMin = bounds.yMin;
            var W = _ceil((xMax - xMin) * xScale);
            var H = _ceil((yMax - yMin) * yScale);

            var cacheId = _this.getCharacterId() +"_"+ localPlayer.getId();
            if (_this.isMorphing)
                cacheId += "_"+ _this.getRatio();

            var cacheKey = cacheStore.generateKey('Shape', cacheId, [xScale, yScale], colorTransform);
            cache = cacheStore.get(cacheKey);
            if (!cache) {
                if (player.width > W && player.height > H && cacheStore.size > W*H) {
                    var canvas = cacheStore.getCanvas();
                    canvas.width = W;
                    canvas.height = H;
                    cache = canvas.getContext("2d");
                    cache.setTransform(xScale, 0, 0, yScale, -xMin * xScale, -yMin * yScale);
                    cache = _this.executeRender(cache, _min(xScale, yScale), colorTransform, isClipDepth, player, localPlayer);
                    cacheStore.set(cacheKey, cache);
                }
            }

            if (cache) {
                var m2 = _multiplicationMatrix(rMatrix, [1 / xScale, 0, 0, 1 / yScale, xMin, yMin]);
                ctx.setTransform(m2[0], m2[1], m2[2], m2[3], m2[4], m2[5]);
                if (isAndroid4x && !isChrome) {
                    ctx.fillStyle = player.context.createPattern(cache.canvas, 'no-repeat');
                    ctx.fillRect(0, 0, W, H);
                } else {
                    ctx.drawImage(cache.canvas, 0, 0);
                }
            } else {
                ctx.setTransform(rMatrix[0], rMatrix[1], rMatrix[2], rMatrix[3], rMatrix[4], rMatrix[5]);
                _this.executeRender(ctx, _min(rMatrix[0], rMatrix[3]), colorTransform, isClipDepth, player, localPlayer);
            }
        }
    };

    /**
     * @param ctx
     * @param minScale
     * @param colorTransform
     * @param isClipDepth
     * @param player
     * @param localPlayer
     * @returns {*}
     */
    Shape.prototype.executeRender = function(ctx, minScale, colorTransform, isClipDepth, player, localPlayer)
    {
        var _this = this;
        var shapes = _this.getData();
        var length = shapes.length;
        var _generateColorTransform = generateColorTransform;
        var _generateImageTransform = _this.generateImageTransform;

        for (var idx = 0; idx < length; idx++) {
            var data = shapes[idx];
            var obj = data.obj;
            var styleObj = (!obj.HasFillFlag) ? obj : obj.FillType;
            var cmd = data.cmd;
            var isStroke = (obj.Width != undefined);

            if (isClipDepth) {
                if (isStroke)
                    continue;
                cmd(ctx);
                continue;
            }

            var styleType = styleObj.fillStyleType;

            ctx.beginPath();
            cmd(ctx);
            switch (styleType) {
                case 0x00:
                    var color = styleObj.Color;
                    color = _generateColorTransform(color, colorTransform);
                    var css = "rgba("
                        + color.R
                        +", "+ color.G
                        +", "+ color.B
                        +", "+ color.A
                        +")";

                    if (isStroke) {
                        ctx.strokeStyle = css;
                        var lineWidth = _max(obj.Width, 1 / minScale);
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
                    var gMatrix = styleObj.gradientMatrix;
                    ctx.save();
                    ctx.transform(gMatrix[0], gMatrix[1], gMatrix[2], gMatrix[3], gMatrix[4], gMatrix[5]);

                    var type = styleObj.fillStyleType;
                    var css = (type == 18 || type == 19)
                        ? ctx.createRadialGradient(0, 0, 0, 0, 0, 16384)
                        : ctx.createLinearGradient(-16384, 0, 16384, 0);

                    var records = styleObj.gradient.GradientRecords;
                    var rLength = records.length;
                    for (var rIdx = 0; rIdx < rLength; rIdx++) {
                        var record = records[rIdx];
                        var color = record.Color;
                        color = _generateColorTransform(color, colorTransform);
                        css.addColorStop(record.Ratio, 'rgba(' + color.R + ', ' + color.G + ', ' + color.B + ', ' + color.A + ')');
                    }

                    if (isStroke) {
                        ctx.strokeStyle = css;
                        var lineWidth = _max(obj.Width, 1 / minScale);
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
                    var bitmapId = styleObj.bitmapId;
                    var bMatrix = styleObj.bitmapMatrix;
                    var repeat = (styleType == 0x40 || styleType == 0x42) ? 'repeat' : 'no-repeat';
                    var bitmapCacheKey = cacheStore.generateKey(
                        'Bitmap',
                        bitmapId +"_"+ localPlayer.getId() +"_"+ repeat,
                        undefined,
                        colorTransform
                    );

                    var image = cacheStore.get(bitmapCacheKey);
                    if (image == undefined) {
                        image = localPlayer.getCharacter(bitmapId);
                        if (!image)
                            break;

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
                            imageContext.drawImage(image.canvas, 0, 0);

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
                        ctx.transform(bMatrix[0], bMatrix[1], bMatrix[2], bMatrix[3], bMatrix[4], bMatrix[5]);
                        ctx.drawImage(image.canvas, 0, 0);
                    } else {
                        ctx.fillStyle = player.context.createPattern(image.canvas, repeat);
                        ctx.transform(bMatrix[0], bMatrix[1], bMatrix[2], bMatrix[3], bMatrix[4], bMatrix[5]);
                        ctx.fill();
                    }
                    ctx.restore();

                    break;
            }

        }

        if (isClipDepth) {
            ctx.clip();

            if (isAndroid && isChrome) {
                var tmpCanvas = tmpContext.canvas;
                var canvas = ctx.canvas;

                tmpCanvas.width = canvas.width;
                tmpCanvas.height = canvas.height;
                tmpContext.drawImage(canvas, 0, 0);

                ctx.save();
                ctx.setTransform(1,0,0,1,0,0);
                ctx.beginPath();
                ctx.clearRect(0, 0, canvas.width+1, canvas.height+1);
                ctx.drawImage(tmpCanvas, 0, 0);
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
     * @param ctx
     * @param color
     * @returns {*}
     */
    Shape.prototype.generateImageTransform = function(ctx, color)
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
     * @constructor
     */
    var TextRecord = function()
    {
        var _this = this;
        _this.color = null;
        _this.matrix = null;
    };

    /**
     * @returns {*}
     */
    TextRecord.prototype.getColor = function()
    {
        return this.color;
    };

    /**
     * @param color
     */
    TextRecord.prototype.setColor = function(color)
    {
        this.color = color;
    };

    /**
     * @returns {*}
     */
    TextRecord.prototype.getMatrix = function()
    {
        return this.matrix;
    };

    /**
     * @param matrix
     */
    TextRecord.prototype.setMatrix = function(matrix)
    {
        this.matrix = matrix;
    };

    /**
     * @returns {Array}
     */
    TextRecord.prototype.getData = function()
    {
        return this.data;
    };

    /**
     * @param data
     */
    TextRecord.prototype.setData = function(data)
    {
        this.data = data;
    };

    /**
     * @constructor
     */
    var DefineText = function()
    {
        var _this = this;
        new Common(_this);
        new ShapeAndText(_this);
        new Dummy(_this);
        _this.data = null;
        _this.records = [];
    };

    /**
     * @returns {Array|*}
     */
    DefineText.prototype.getRecords = function()
    {
        return this.records;
    };

    /**
     * @param record
     */
    DefineText.prototype.addRecord = function(record)
    {
        var records = this.getRecords();
        records[records.length] = record;
    };

    /**
     * @param ctx
     * @param matrix
     * @param colorTransform
     * @param player
     * @param visible
     * @param localPlayer
     */
    DefineText.prototype.render = function(ctx, matrix, colorTransform, player, visible, localPlayer)
    {
        var _this = this;
        var alpha = colorTransform[3] + (colorTransform[7] / 255);
        if (!alpha || !visible)
            return 0;

        var _multiplicationMatrix = multiplicationMatrix;
        var rMatrix = _multiplicationMatrix(player.getMatrix(), matrix);
        var xScale = _sqrt(rMatrix[0] * rMatrix[0] + rMatrix[1] * rMatrix[1]);
        var yScale = _sqrt(rMatrix[2] * rMatrix[2] + rMatrix[3] * rMatrix[3]);
        xScale = _pow(_SQRT2, _ceil(_log(xScale) / (_LN2 / 2)));
        yScale = _pow(_SQRT2, _ceil(_log(yScale) / (_LN2 / 2)));
        var bounds = _this.getBounds();
        var xMax = bounds.xMax;
        var xMin = bounds.xMin;
        var yMax = bounds.yMax;
        var yMin = bounds.yMin;
        var W = _ceil((xMax - xMin) * xScale);
        var H = _ceil((yMax - yMin) * yScale);

        var cacheId = _this.getCharacterId() +"_"+ localPlayer.getId();
        var cacheKey = cacheStore.generateKey('Text', cacheId, [xScale, yScale], colorTransform);
        var cache = cacheStore.get(cacheKey);
        if (!cache) {
            if (player.width > W && player.height > H && cacheStore.size > W*H) {
                var canvas = cacheStore.getCanvas();
                canvas.width = W;
                canvas.height = H;
                cache = canvas.getContext("2d");
                var cMatrix = [xScale, 0, 0, yScale, -xMin * xScale, -yMin * yScale];
                cache.setTransform(xScale, 0, 0, yScale, -xMin * xScale, -yMin * yScale);
                cache = _this.executeRender(cache, cMatrix, colorTransform);
                cacheStore.set(cacheKey, cache);
            }
        }

        if (cache) {
            var m2 = _multiplicationMatrix(rMatrix, [1 / xScale, 0, 0, 1 / yScale, xMin, yMin]);
            ctx.setTransform(m2[0], m2[1], m2[2], m2[3], m2[4], m2[5]);
            if (isAndroid4x && !isChrome) {
                ctx.fillStyle = player.context.createPattern(cache.canvas, 'no-repeat');
                ctx.fillRect(0, 0, W, H);
            } else {
                ctx.drawImage(cache.canvas, 0, 0);
            }
        } else {
            ctx.setTransform(rMatrix[0], rMatrix[1], rMatrix[2], rMatrix[3], rMatrix[4], rMatrix[5]);
            _this.executeRender(ctx, rMatrix, colorTransform);
        }
    };

    /**
     * @param ctx
     * @param matrix
     * @param colorTransform
     * @returns {*}
     */
    DefineText.prototype.executeRender = function(ctx, matrix, colorTransform)
    {
        var _this = this;
        var records = _this.getRecords();
        var length = records.length;
        if (!length)
            return ctx;

        var _generateColorTransform = generateColorTransform;
        var _multiplicationMatrix = multiplicationMatrix;
        for (var i = 0; i < length; i++) {
            var record = records[i];
            var shapes = record.getData();
            var shapeLength = shapes.length;
            if (!shapeLength)
                continue;

            var matrix2 = _multiplicationMatrix(matrix, record.getMatrix());
            ctx.setTransform(matrix2[0], matrix2[1], matrix2[2], matrix2[3], matrix2[4], matrix2[5]);
            var color = record.getColor();
            color = _generateColorTransform(color, colorTransform);
            var css = "rgb("
                + color.R +", "
                + color.G +", "
                + color.B
                +")";
            ctx.fillStyle = css;
            ctx.globalAlpha = color.A;

            for (var idx = 0; idx < shapeLength; idx++) {
                var styleObj = shapes[idx];
                var cmd = styleObj.cmd;
                ctx.beginPath();
                cmd(ctx);
                ctx.fill();
            }
        }
        ctx.globalAlpha = 1;
        return ctx;
    };

    /**
     * @constructor
     */
    var TextFormat = function()
    {
        var _this = this;
        _this.align = 'left';
        _this.font = "'HiraKakuProN-W3', 'sans-serif'";;
        _this.size = 0;
        _this.color = {R:0, G:0, B:0, A:1};
        _this.bold = 0;
        _this.italic = 0;
        _this.underline = 0;
        _this.bullet = 0;
        _this.kerning = 0;
        _this.blockIndent = 0;
        _this.indent = 0;
        _this.leading = 0;
        _this.leftMargin = 0;
        _this.rightMargin = 0;
        _this.letterSpacing = 0;
        _this.tabStops = [];
        _this.url = null;
        _this.target = null;
    };

    /**
     * @param mc
     * @param name
     * @param depth
     * @param x
     * @param y
     * @param width
     * @param height
     * @constructor
     */
    var TextField = function(mc, name, depth, x, y, width, height)
    {
        var _this = this;
        var _cloneArray = cloneArray;
        new Common(_this);
        new Property(_this);

        _this.fontId = 0;
        _this.parent = mc;
        _this.matrix = _cloneArray([1,0,0,1,x,y]);
        _this._matrix = _cloneArray([1,0,0,1,x,y]);
        _this.colorTransform = _cloneArray([1,1,1,1,0,0,0,0]);
        _this._colorTransform = _cloneArray([1,1,1,1,0,0,0,0]);
        _this.bounds = {xMin: 0, xMax: width, yMin: 0, yMax: height};

        var obj = {};
        obj.antiAliasType = null;
        obj.autoSize = "none";
        obj.background = 0;
        obj.backgroundColor = {R:255, G:255, B:255, A:1};
        obj.border = 0;
        obj.borderColor = {R:0, G:0, B:0, A:1};
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
        obj.textColor = {R:255,G:255,B:255,A:1};
        obj.thickness = 0;
        obj.type = 'dynamic';
        obj.wordWrap = 0;
        obj.text = null;
        for (var name in obj)
            _this.setProperty(name, obj[name]);

        _this.setNewTextFormat(new TextFormat());
    };

    /**
     * @param format
     */
    TextField.prototype.setNewTextFormat = function(format)
    {
        var _this = this;
        for (var name in format)
            _this.setProperty(name, format[name]);
    };

    /**
     * @returns {*}
     */
    TextField.prototype.getParent = function()
    {
        return this.parent;
    };

    /**
     *
     * @param parent
     */
    TextField.prototype.setParent = function(parent)
    {
        this.parent = parent;
    };

    /**
     * @returns {*}
     */
    TextField.prototype.getPlayer = function()
    {
        var parent = this.getParent();
        return parent.getPlayer();
    };

    /**
     * @returns {*}
     */
    TextField.prototype.getBounds = function(matrix)
    {
        if (matrix) {
            var bounds = boundsMatrix(this.bounds, matrix);
            for (var name in bounds)
                bounds[name] /= 20;
            return bounds;
        } else {
            return this.bounds;
        }
    };

    /**
     * @param bounds
     */
    TextField.prototype.setBounds = function(bounds)
    {
        this.bounds = bounds;
    };

    /**
     * @returns []
     */
    TextField.prototype.getMatrix = function()
    {
        return this.matrix;
    };

    /**
     * @param matrix
     */
    TextField.prototype.setMatrix = function(matrix)
    {
        var _this = this;
        _this.matrix = matrix;
        _this._matrix = cloneArray(matrix);
    };

    /**
     * @returns []
     */
    TextField.prototype.getColorTransform = function()
    {
        return this.colorTransform;
    };

    /**
     * @param colorTransform
     */
    TextField.prototype.setColorTransform = function(colorTransform)
    {
        var _this = this;
        _this.colorTransform = colorTransform;
        _this._colorTransform = cloneArray(colorTransform);
    };

    /**
     * reset
     */
    TextField.prototype.reset = function()
    {
        var _this = this;
        _this.setMatrix(_this._matrix);
        _this.setColorTransform(_this._colorTransform);
    };

    /**
     * @param ctx
     * @param matrix
     * @param colorTransform
     * @param player
     * @param visible
     * @param localPlayer
     */
    TextField.prototype.render = function(ctx, matrix, colorTransform, player, visible, localPlayer)
    {
        var alpha = colorTransform[3] + (colorTransform[7] / 255);
        if (!alpha || !visible)
            return 0;

        var _this = this;
        var _multiplicationMatrix = multiplicationMatrix;
        var _generateColorTransform = generateColorTransform;
        var variables = _this.variables;
        var text = variables['text'];
        var variable = variables['variable'];
        if (variable) {
            var parent = _this.getParent();
            text = parent.getProperty(variable);
            if (text == undefined)
                text = variables['text'];
        }

        if (typeof text == 'number')
            text += '';

        if (!text)
            return 0;

        ctx.textBaseline = "top";
        var rMatrix = _multiplicationMatrix(player.getMatrix(), matrix);
        ctx.setTransform(rMatrix[0], rMatrix[1], rMatrix[2], rMatrix[3], rMatrix[4], rMatrix[5]);

        var bounds = _this.getBounds();
        var xMax = bounds.xMax - 2;
        var xMin = bounds.xMin + 2;
        var yMax = bounds.yMax - 2;
        var yMin = bounds.yMin + 2;
        var W = _ceil(xMax - xMin);
        var H = _ceil(yMax - yMin);

        // border
        var border = variables['border'];
        if (border) {
            ctx.beginPath();
            ctx.rect(xMin, yMin, W, H);
            var backgroundColor = _generateColorTransform(variables['backgroundColor'], colorTransform);
            ctx.fillStyle = 'rgba('
                + backgroundColor.R +','
                + backgroundColor.G +','
                + backgroundColor.B +','
                + backgroundColor.A +
                ')';
            var borderColor = _generateColorTransform(variables['borderColor'], colorTransform);
            ctx.strokeStyle = 'rgba('
                + borderColor.R +','
                + borderColor.G +','
                + borderColor.B +','
                + borderColor.A +
                ')';
            ctx.lineWidth = _min(20, 1 / _min(rMatrix[0], rMatrix[3]));
            ctx.globalAlpha = 1;
            ctx.fill();
            ctx.stroke();
        }

        ctx.save();
        ctx.beginPath();
        ctx.rect(xMin, yMin, W, H);
        ctx.clip();

        // 文字色
        var color = _generateColorTransform(variables['color'], colorTransform);
        ctx.fillStyle = 'rgb('
            + color.R +','
            + color.G +','
            + color.B +
        ')';
        ctx.globalAlpha = color.A;

        // font type
        var fontType = '';
        if (variables['italic'])
            fontType += 'italic ';

        if (variables['bold'])
            fontType += 'bold ';

        ctx.font = fontType + variables['size'] +'px '+ variables['font'];

        // 座標
        var leading = 0;
        var indent = 0;
        var leftMargin = 0;
        var rightMargin = 0;
        var dx = 0;
        var dy = 0;

        var txt = '';
        var wordWrap = variables['wordWrap'];
        var multiline = variables['multiline'];
        var splitData = text.split('@LFCR');
        var textLength = splitData.length;
        var align = variables['align'];

        // アウトラインフォント
        if (variables['embedFonts']) {
            var fontData = localPlayer.getCharacter(_this.fontId);
            var CodeTable = fontData.CodeTable;
            var GlyphShapeTable = fontData.GlyphShapeTable;
            var FontAdvanceTable = fontData.FontAdvanceTable;
            var fontScale = _this.fontScale;

            leading += (fontData.FontAscent + fontData.FontDescent) * fontScale;
            var YOffset = (fontData.FontAscent * fontScale);

            for (var i = 0; i < textLength; i++) {
                txt = splitData[i];

                // 埋め込まれてないもの対応の為に一回全体のサイズを取得
                var XOffset = xMin;
                var txtLength = txt.length;
                var textWidth = 0;
                for (var idx = 0; idx < txtLength; idx++) {
                    var str = txt[idx];
                    var key = CodeTable.indexOf(str.charCodeAt(0));
                    if (key < 0) {
                        continue;
                    }
                    textWidth += (FontAdvanceTable[key] * fontScale);
                }

                // レイアウトに合わせてレンダリング
                if (align == 'right') {
                    XOffset += W - rightMargin - textWidth - 2;
                } else if (align == 'center') {
                    XOffset += (indent + leftMargin)
                        + ((W - indent - leftMargin - rightMargin - textWidth) / 2);
                } else {
                    XOffset += indent + leftMargin + 2;
                }

                for (var idx = 0; idx < txtLength; idx++) {
                    var str = txt[idx];
                    var key = CodeTable.indexOf(str.charCodeAt(0));
                    if (key < 0)
                        continue;

                    var m2 = _multiplicationMatrix(rMatrix, [fontScale, 0, 0, fontScale, XOffset, YOffset]);
                    ctx.setTransform(m2[0], m2[1], m2[2], m2[3], m2[4], m2[5]);
                    _this.renderGlyph(GlyphShapeTable[key], ctx);

                    XOffset += FontAdvanceTable[key] * fontScale;
                }

                YOffset += leading;
            }
        } else {

            ctx.setTransform(rMatrix[0] * 20, rMatrix[1] * 20, rMatrix[2] * 20, rMatrix[3] * 20, rMatrix[4], rMatrix[5]);

            bounds = _this.getBounds();
            xMax = bounds.xMax / 20 - 2;
            xMin = bounds.xMin / 20 + 2;
            W = _ceil(xMax - xMin);

            leading = variables['leading'] / 20;
            rightMargin = variables['rightMargin'] / 20;
            leftMargin = variables['leftMargin'] / 20;
            indent = variables['indent'] / 20;

            if (align == 'right') {
                ctx.textAlign = "end";
                dx += (xMax + xMin) - rightMargin;
            } else if (align == 'center') {
                ctx.textAlign = "center";
                dx += (indent + leftMargin)
                    + (((xMax + xMin) - indent - leftMargin - rightMargin) / 2);
            } else {
                dx += xMin + indent + leftMargin;
            }

            var areaWidth = W - indent - leftMargin - rightMargin;
            var size = variables['size'];
            var context = player.context;
            context.setTransform(1,0,0,1,0,0);
            for (var i = 0; i < textLength; i++) {
                txt = splitData[i];
                if (wordWrap && multiline) {
                    var measureText = context.measureText(txt);
                    var txtTotalWidth = measureText.width;
                    if (txtTotalWidth > areaWidth) {
                        var txtLength = txt.length;
                        var joinTxt = '';
                        var joinWidth = size;
                        for (var t = 0; t < txtLength; t++) {
                            var textOne = ctx.measureText(txt[t]);
                            joinWidth += textOne.width;
                            joinTxt += txt[t];
                            if (joinWidth > areaWidth || (t + 1) == txtLength) {
                                ctx.fillText(joinTxt, dx, dy, W);
                                joinWidth = size;
                                joinTxt = '';
                                dy += leading + size;
                            }
                        }
                    } else {
                        ctx.fillText(txt, dx, dy, W);
                    }
                } else {
                    ctx.fillText(txt, dx, dy, W);
                }
                dy += leading + size;
            }
        }
        ctx.restore();
        ctx.globalAlpha = 1;
    };

    /**
     * @param records
     * @param ctx
     */
    TextField.prototype.renderGlyph = function (records, ctx)
    {
        if (records.data == undefined)
            records.data = vtc.execute(records);

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

    // dummy
    TextField.prototype.addActions = function(){};
    TextField.prototype.putFrame = function(){};
    TextField.prototype.getTags = function(){return null;};

    /**
     * @param parent
     * @constructor
     */
    var ButtonCharacter = function(parent)
    {
        var _this = this;
        _this.soundId = 0;
        _this.soundInfo = null;
        _this.parent = parent;
        _this.matrix = [];
        _this.colorTransform = [];
        _this.tags = [];
    };

    /**
     * @returns Button
     */
    ButtonCharacter.prototype.getParent = function()
    {
        return this.parent;
    };

    /**
     * @param depth
     * @param obj
     * @param tag
     */
    ButtonCharacter.prototype.addTag = function(depth, obj, tag)
    {
        var _this = this;
        var _cloneArray = cloneArray;
        var tags = _this.tags;
        tags[depth] = obj;

        var matrix = tag.Matrix;
        var colorTransform = tag.ColorTransform;
        _this.setMatrix(depth, _cloneArray(matrix));
        _this.setColorTransform(depth, _cloneArray(colorTransform));
    };

    /**
     *
     * @returns {Array}
     */
    ButtonCharacter.prototype.getTags = function()
    {
        return this.tags;
    };

    /**
     * @param depth
     * @returns {*}
     */
    ButtonCharacter.prototype.getMatrix = function(depth)
    {
        return this.matrix[depth];
    };

    /**
     * @param depth
     * @param matrix
     * @returns {*}
     */
    ButtonCharacter.prototype.setMatrix = function(depth, matrix)
    {
        this.matrix[depth] = matrix;
    };

    /**
     * @param depth
     * @returns {*}
     */
    ButtonCharacter.prototype.getColorTransform = function(depth)
    {
        return this.colorTransform[depth];
    };

    /**
     * @param depth
     * @param matrix
     * @returns {*}
     */
    ButtonCharacter.prototype.setColorTransform = function(depth, matrix)
    {
        this.colorTransform[depth] = matrix;
    };

    /**
     * startSound
     */
    ButtonCharacter.prototype.startSound = function()
    {
        var _this = this;
        var soundId = _this.soundId;
        if (soundId) {
            var parent = _this.getParent();
            var player = parent.getPlayer();
            var sound = player.sounds[soundId];
            var audio = _document.createElement('audio');
            audio.onload = function () {
                this.load();
                this.preload = 'auto';
                this.autoplay = false;
                this.loop = false;
            };
            audio.src = sound.base64;
            startSound(audio, _this.soundInfo);
        }
    };

    /**
     * @constructor
     */
    var Button = function()
    {
        var _this = this;
        new Common(_this);
        new Property(_this);
        _this.parent = null;
        _this.player = null;
        _this.down = new ButtonCharacter(_this);
        _this.hit = new ButtonCharacter(_this);
        _this.over = new ButtonCharacter(_this);
        _this.up = new ButtonCharacter(_this);
        _this.actions = [];
        _this.buttonStatus = 'up';
        _this.renderMatrix = null;
    };

    /**
     * @returns MovieClip
     */
    Button.prototype.getParent = function()
    {
        return this.parent;
    };

    /**
     * @param parent
     */
    Button.prototype.setParent = function(parent)
    {
        this.parent = parent;
    };

    /**
     * @returns Player
     */
    Button.prototype.getPlayer = function()
    {
        return this.player;
    };

    /**
     * @param player
     */
    Button.prototype.setPlayer = function(player)
    {
        this.player = player;
    };

    /**
     *
     * @returns {Array|ActionScript|*|actions}
     */
    Button.prototype.getActions = function()
    {
        return this.actions;
    };

    /**
     * @param actions
     */
    Button.prototype.setActions = function(actions)
    {
        this.actions = actions;
    };

    /**
     * @returns {string}
     */
    Button.prototype.getButtonStatus = function()
    {
        return this.buttonStatus;
    };

    /**
     * @param status
     */
    Button.prototype.setButtonStatus = function(status)
    {
        var _this = this;
        if (_this.getButtonStatus() != status)
            _this.reset();
        _this.buttonStatus = status;
    };

    /**
     * @param status
     * @returns {*}
     */
    Button.prototype.getButtonCharacter = function(status)
    {
        var _this = this;
        if (!status)
            status = _this.buttonStatus;
        return _this[status];
    };

    /**
     * @param matrix
     * @param status
     * @returns {{xMin: number, xMax: number, yMin: number, yMax: number}}
     */
    Button.prototype.getBounds = function(matrix, status)
    {
        var _this = this;
        var xMax = 0;
        var yMax = 0;
        var xMin = 0;
        var yMin = 0;

        var _multiplicationMatrix = multiplicationMatrix;
        var buttonCharacter = _this.getButtonCharacter(status);
        var tags = buttonCharacter.getTags();
        var length = tags.length;
        if (length) {
            var no = _Number.MAX_VALUE;
            xMax = -no;
            yMax = -no;
            xMin = no;
            yMin = no;

            for (var depth = 1; depth < length; depth++) {
                if (!(depth in tags))
                    continue;

                var tag = tags[depth];
                if (tag.isClipDepth)
                    continue;

                var bMatrix = buttonCharacter.getMatrix(depth);
                var matrix2 = (matrix)
                    ? _multiplicationMatrix(matrix, bMatrix)
                    : bMatrix;

                var bounds = tag.getBounds(matrix2, status);
                if (!bounds)
                    continue;

                xMin = _min(xMin, bounds.xMin);
                xMax = _max(xMax, bounds.xMax);
                yMin = _min(yMin, bounds.yMin);
                yMax = _max(yMax, bounds.yMax);
            }
        }
        return {xMin: xMin, xMax: xMax, yMin: yMin, yMax: yMax};
    };

    /**
     * @returns []
     */
    Button.prototype.getMatrix = function()
    {
        return this.matrix;
    };

    /**
     * @param matrix
     */
    Button.prototype.setMatrix = function(matrix)
    {
        var _this = this;
        _this.matrix = matrix;
        _this._matrix = cloneArray(matrix);
    };

    /**
     * @returns []
     */
    Button.prototype.getColorTransform = function()
    {
        return this.colorTransform;
    };

    /**
     * @param colorTransform
     */
    Button.prototype.setColorTransform = function(colorTransform)
    {
        var _this = this;
        _this.colorTransform = colorTransform;
        _this._colorTransform = cloneArray(colorTransform);
    };

    /**
     * reset
     */
    Button.prototype.reset = function()
    {
        var _this = this;
        _this.setMatrix(cloneArray(_this._matrix));
        _this.setColorTransform(cloneArray(_this._colorTransform));
        var buttonCharacter = _this.getButtonCharacter();
        var tags = buttonCharacter.getTags();
        var length = tags.length;
        if (length) {
            length++;
            for (var depth = 1; depth < length; depth++) {
                if (!(depth in tags))
                    continue;
                var tag = tags[depth];
                tag.reset();
            }
        }
    };

    /**
     * @param ctx
     * @param matrix
     * @param colorTransform
     * @param player
     * @param visible
     * @param localPlayer
     */
    Button.prototype.render = function(ctx, matrix, colorTransform, player, visible, localPlayer)
    {
        var _this = this;
        var buttonHits = player.buttonHits;
        var _multiplicationMatrix = multiplicationMatrix;
        var _multiplicationColor = multiplicationColor;

        // enter
        var actions = _this.getActions();
        var aLen = actions.length;
        if (aLen) {
            for (var idx = 0; idx < aLen; idx++) {
                var cond = actions[idx];
                if (cond.CondKeyPress == 13) {
                    buttonHits[buttonHits.length] = {
                        button: _this,
                        xMin: 0,
                        xMax: player.getWidth(),
                        yMin: 0,
                        yMax: player.getHeight(),
                        CondKeyPress: cond.CondKeyPress,
                        parent: _this.getParent()
                    };
                }
            }
        }

        if (visible) {
            var status = 'hit';
            var hitTest = _this.getButtonCharacter(status);
            var hitTags = hitTest.getTags();
            if (!hitTags.length) {
                status = 'up';
                hitTest = _this.getButtonCharacter(status);
                hitTags = hitTest.getTags();
            }

            if (hitTags.length) {
                var bounds = _this.getBounds(matrix, status);
                if (bounds) {
                    buttonHits[buttonHits.length] = {
                        button: _this,
                        xMin: bounds.xMin,
                        xMax: bounds.xMax,
                        yMin: bounds.yMin,
                        yMax: bounds.yMax,
                        CondKeyPress: 0,
                        parent: _this.getParent()
                    };
                }
            }
        }

        var buttonCharacter = _this.getButtonCharacter();
        var tags = buttonCharacter.getTags();
        var length = tags.length;
        if (length) {
            for (var depth = 1; depth < length; depth++) {
                if (!(depth in tags))
                    continue;
                var tag = tags[depth];
                var renderMatrix = _multiplicationMatrix(matrix, buttonCharacter.getMatrix(depth));
                var renderColorTransform = _multiplicationColor(colorTransform, buttonCharacter.getColorTransform(depth));
                var isVisible = _min(tag.getVisible(), visible);
                tag.render(ctx, renderMatrix, renderColorTransform, player, isVisible, localPlayer);
            }
        }
    };

    /**
     * @see MovieClip.addActions
     */
    Button.prototype.addActions = function()
    {
        var buttonCharacter = this.getButtonCharacter();
        var tags = buttonCharacter.getTags();
        var length = tags.length;
        if (length) {
            for (var depth = 1; depth < length; depth++) {
                if (!(depth in tags))
                    continue;
                var tag = tags[depth];
                tag.addActions();
            }
        }
    };

    /**
     *
     */
    Button.prototype.putFrame = function()
    {
        var buttonCharacter = this.getButtonCharacter();
        var tags = buttonCharacter.getTags();
        var depth = tags.length;
        if (depth) {
            for (; depth--;) {
                if (!(depth in tags))
                    continue;
                var tag = tags[depth];
                tag.putFrame();
            }
        }
    };

    /**
     * @param mc
     * @constructor
     */
    var Sound = function(mc)
    {
        var _this = this;
        _this.sounds = [];
        _this.volume = 100;
        _this.pan = 0;
        _this.transform = {ll:100, lr:100, rl:100,rr:100};
        _this.isStreamin = false;
        _this.movieClip = null;
        if (mc instanceof MovieClip)
            _this.movieClip = mc;
    };

    /**
     * @param currentTime
     * @param loopCount
     */
    Sound.prototype.start = function(currentTime, loopCount)
    {
        var _this = this;
        var sounds = _this.sounds;
        for (var id in sounds) {
            var audio = sounds[id];
            if (typeof loopCount == 'number' && loopCount > 0) {
                audio.loopCount = loopCount;
                var loopSound = function () {
                    audio.loopCount--;
                    if (!this.loopCount) {
                        audio.removeEventListener('ended', loopSound);
                    } else {
                        audio.volume = _this.volume / 100;
                        audio.currentTime = 0;
                        audio.play();
                    }

                    if (!_this.isStreamin && 'onSoundComplete' in _this) {
                        var as = _this['onSoundComplete'];
                        if (as instanceof ActionScript) {
                            as.params[1] = true;
                            as.execute(_this.movieClip);
                        }
                    }

                };
                audio.addEventListener('ended', loopSound);
            }
            audio.currentTime = currentTime || 0;
            audio.play();
        }
    };

    /**
     * stop
     */
    Sound.prototype.stop = function(id)
    {
        var sounds = this.sounds;
        if (id) {
            var audio = sounds[id];
            if (audio)
                audio.stop();
        } else {
            for (var id in sounds) {
                var audio = sounds[id];
                audio.stop();
            }
        }
    };

    /**
     * @param url
     * @param bool
     */
    Sound.prototype.loadSound = function(url, bool)
    {
        var _this = this;
        var sounds = _this.sounds;
        var audio = _document.createElement('audio');
        audio.onload = function () {
            this.load();
            this.preload = 'auto';
            this.autoplay = false;
            this.loop = false;
        };

        var onLoad = function ()
        {
            audio.removeEventListener('canplaythrough', onLoad);
            if ('onLoad' in _this) {
                var as = _this['onLoad'];
                if (as instanceof ActionScript) {
                    as.params[1] = true;
                    as.execute(_this.movieClip);
                }
            }
        };
        audio.addEventListener('canplaythrough', onLoad);

        var onError = function()
        {
            audio.removeEventListener('error', onLoad);
            if ('onLoad' in _this) {
                var as = _this['onLoad'];
                if (as instanceof ActionScript) {
                    as.params[1] = false;
                    as.execute(_this.movieClip);
                }
            }
        };
        audio.addEventListener('error', onError);

        audio.src = url;
        sounds[0] = audio;

        _this.isStreamin = bool;
    };

    /**
     * @param id
     */
    Sound.prototype.attachSound = function(id)
    {
        var _this = this;
        var sounds = _this.sounds;
        if (!(id in sounds)) {
            var movieClip = _this.movieClip;
            var player = movieClip.getPlayer();
            var exportAssets = player.exportAssets;
            if (id in exportAssets) {
                var characterId = exportAssets[id];
                var tag = player.sounds[characterId];
                if (tag) {
                    var audio = _document.createElement('audio');
                    audio.onload = function () {
                        this.load();
                        this.preload = 'auto';
                        this.autoplay = false;
                        this.loop = false;
                    };
                    audio.src = tag.base64;
                    sounds[id] = audio;
                }
            }
        }
    };

    /**
     *
     * @returns {number}
     */
    Sound.prototype.getVolume = function()
    {
        return this.volume;
    };

    /**
     *
     * @param volume
     */
    Sound.prototype.setVolume = function(volume)
    {
        var _this = this;
        var sounds = _this.sounds;
        _this.volume = volume;
        for (var id in sounds) {
            var audio = sounds[id];
            audio.volume = volume / 100;
        }
    };

    /**
     * @returns {number|*}
     */
    Sound.prototype.getPan = function()
    {
        return this.pan;
    };

    /**
     * @param pan
     */
    Sound.prototype.setPan = function(pan)
    {
        this.pan = pan;
    };

    /**
     * @param object
     */
    Sound.prototype.setTransform = function(object)
    {
        var transform = this.transform;
        for (var name in object) {
            switch (name) {
                case 'll':
                case 'lr':
                case 'rl':
                case 'rr':
                    transform[name] = object[name];
                    break;
            }
        }
    };

    /**
     * @returns {{ll: number, lr: number, rl: number, rr: number}|*}
     */
    Sound.prototype.getTransform = function()
    {
        return this.transform;
    };

    /**
     * @returns {number}
     */
    Sound.prototype.getBytesLoaded = function()
    {
        return 1;
    };

    /**
     * @returns {number}
     */
    Sound.prototype.getBytesTotal = function()
    {
        return 1;
    };


    /**
     * @constructor
     */
    var MovieClip = function()
    {
        var _this = this;
        new Common(_this);
        new Property(_this);

        // param
        _this.instanceId = instanceId++;
        _this.player = null;
        _this.loadPlayer = null;
        _this.parent = null;
        _this.matrix = cloneArray([1,0,0,1,0,0]);
        _this.colorTransform = cloneArray([1,1,1,1,0,0,0,0]);
        _this.controller = [];
        _this._controller = [];
        _this.addTags = [];
        _this.removeTags = [];
        _this.actions = [];
        _this.labels = [];
        _this.sounds = [];
        _this.filters = [];
        _this.buttonStatus = 'up';

        // 判定用
        _this.stopFlag = false;
        _this.isAction = true;
        _this.isLoad = false;
        _this.isEnterFrame = false;
        _this.active = false;
        _this.isStatic = true;
        _this.removable = false;

        // clip
        _this.isClipDepth = false;
        _this.clipDepth = 0;

        // sound
        _this.soundStopFlag = false;

        // event
        _this.clipEvent = {};
    };

    /**
     * @returns {*}
     */
    MovieClip.prototype.getPlayer = function()
    {
        var _this = this;
        return (!_this.loadPlayer)
            ? _this.player
            : _this.loadPlayer;
    };

    /**
     * @param name
     * @param as
     */
    MovieClip.prototype.addEvent = function(name, as)
    {
        this.variables[name] = as;
    };

    /**
     * @param name
     */
    MovieClip.prototype.delEvent = function(name)
    {
        var variables = this.variables;
        if (name in variables) delete variables[name];
    };

    /**
     * @param name
     */
    MovieClip.prototype.dispatchEvent = function(name)
    {
        var _this = this;
        var variables = _this.variables;
        if (name in variables)
            _this.setActionQueue([variables[name]]);
    };

    /**
     * @param name
     */
    MovieClip.prototype.dispatchClipEvent = function(name)
    {
        var _this = this;
        var clipEvent = _this.clipEvent;
        if (name in clipEvent)
            _this.setActionQueue(clipEvent[name]);
    };

    /**
     * @param name
     * @param depth
     * @returns {MovieClip}
     */
    MovieClip.prototype.createEmptyMovieClip = function(name, depth)
    {
        var _this = this;
        var _cloneArray = cloneArray;
        var player = _this.getPlayer();

        var mc = _this.getMovieClip(name);
        if (!mc)
            mc = new MovieClip();
        mc.setName(name);
        mc.setLevel(depth);
        mc.setParent(_this);
        mc.player = player;
        mc.removable = true;

        var frame = _this.getFrame();
        var tags = _this.addTags;
        if (!(frame in tags))
            tags[frame] = [];

        tags[frame][depth] = mc;

        var controller = _this.controller;
        if (!(frame in controller))
            controller[frame] = [];

        controller[frame][depth] = {
            colorTransform: _cloneArray([1,1,1,1,0,0,0,0]),
            matrix: _cloneArray([1,0,0,1,0,0])
        };

        var _controller = _this._controller;
        if (!(frame in _controller))
            _controller[frame] = [];

        _controller[frame][depth] = {
            _colorTransform: _cloneArray([1,1,1,1,0,0,0,0]),
            _matrix: _cloneArray([1,0,0,1,0,0])
        };

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
    MovieClip.prototype.createTextField = function(name, depth, x, y, width, height)
    {
        console.log("createTextField");
        return new TextField(name, depth, x, y, width, height);
    };

    /**
     * @param r
     * @param g
     * @param b
     */
    MovieClip.prototype.setBackgroundColor = function(r, g, b)
    {
        var _this = this;
        var player = _this.getPlayer();
        player.setBackgroundColor(r, g, b);
    };

    /**
     * @returns {Array}
     */
    MovieClip.prototype.getFilters = function()
    {
        return this.filters;
    };

    /**
     *
     * @param filters
     */
    MovieClip.prototype.setFilters = function(filters)
    {
        var _this = this;
        var length = filters.length;
        for (var i = 0; i < length; i++) {
            var filter = filters[i];
            _this.filters[filter.FilterID] = filter.Filter;
        }
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
     * @param frame
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
     * @param frame
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
        var player = this.getPlayer();
        var loadSounds = player.loadSounds;
        var sLen = loadSounds.length;
        for (; sLen--;) {
            if (!(sLen in loadSounds))
                continue;
            var audio = loadSounds[sLen];
            audio.pause();
            audio.currentTime = 0;
        }
    };

    /**
     * @param event
     * @param actionScript
     */
    MovieClip.prototype.onClipEvent = function(event, actionScript)
    {
        var _this = this;
        var clipEvents = _this.clipEvent;
        if (!(event in clipEvents))
            clipEvents[event] = [];

        var clipEvent = clipEvents[event];
        clipEvent[clipEvent.length] = actionScript;
    };

    /**
     * @param url
     * @param target
     * @param SendVarsMethod
     * @returns {number}
     */
    MovieClip.prototype.loadMovie = function(url, target, SendVarsMethod)
    {
        var _this = this;
        var player = _this.getPlayer();
        var targetMc = null;

        if (!target) {
            target = _this.getName();
            targetMc = _this;
        }

        if (!targetMc) {
            if (typeof target == 'string') {
                var _level = target.substr(0, 6);
                if (_level == "_level")
                    target = _parseFloat(target.substr(6));
            }

            if (typeof target == 'number') {
                var parent = player.getParent();
                if (!parent)
                    parent = player.getParent();

                var tags = parent.getTags();
                targetMc = tags[target];
            } else {
                targetMc = _this.getMovieClip(target);
            }
        }

        if (targetMc == null)
            return 0;

        _this.unloadMovie(targetMc);

        var xmlHttpRequest = new XMLHttpRequest();
        var method = 'GET';
        var targetUrl = url;
        var body = null;
        if (SendVarsMethod == 2) {
            method = 'POST';
            var urls = url.split('?');
            if (urls[1] != undefined) {
                body = urls[1];
            }
            targetUrl =  urls[0];
            xmlHttpRequest.open(method, targetUrl);
            xmlHttpRequest.setRequestHeader(
                'Content-Type',
                'application/x-www-form-urlencoded'
            );
        } else {
            xmlHttpRequest.open(method, targetUrl);
        }

        if (isXHR2) {
            xmlHttpRequest.responseType = 'arraybuffer';
        } else {
            xmlHttpRequest.overrideMimeType(
                'text/plain; charset=x-user-defined'
            );
        }

        xmlHttpRequest.onreadystatechange = function()
        {
            var readyState = xmlHttpRequest.readyState;
            if (readyState == 4) {
                var status = xmlHttpRequest.status;

                if (status == 200) {
                    var loadPlayer = new Player();
                    targetMc.removable = true;
                    targetMc.loadPlayer = loadPlayer;
                    loadPlayer.parent = targetMc;
                    loadPlayer.parse(isXHR2 ? xmlHttpRequest.response : xmlHttpRequest.responseText);

                    // 入れ替え
                    if (target == 0 || (typeof target != 'number' && targetMc.instanceId == 0)) {
                        loadPlayer.setId(player.getId());
                        loadPlayer.setName(player.getName());
                        loadPlayer.backgroundColor = player.backgroundColor;
                        loadPlayer.loadEvent();
                        players[player.getId()] = loadPlayer;
                    } else {
                        targetMc.reset();
                    }
                }
            }
        };
        xmlHttpRequest.send(body);
    };

    /**
     * @param target
     * @returns {number}
     */
    MovieClip.prototype.unloadMovie = function(target)
    {
        var _this = this;
        var targetMc = null;

        if (target instanceof MovieClip) {
            targetMc = target;
        } else {
            targetMc = _this.getMovieClip(target);
        }

        if (!targetMc || !targetMc.removable)
            return 0;

        // 削除
        targetMc.loadPlayer = null;
        targetMc.player = _this.getPlayer();
        targetMc.addTags = [];
        targetMc.actions = [];
        targetMc.labels = [];
        targetMc.sounds = [];
        targetMc.clipEvent = {};
        targetMc.filters = [];
        targetMc.controller = [];
        targetMc._controller = [];
        targetMc.removeTags = [];
        targetMc.variables = [];
        targetMc.colorTransform = null;
        targetMc.matrix = null;
        targetMc._currentframe = 1;
        targetMc._totalframes = 1;
        targetMc.reset();
        cacheStore.reset();
    };

    /**
     * @param url
     * @param target
     * @param method
     * @returns {number}
     */
    MovieClip.prototype.getURL = function(url, target, method)
    {
        if (url == 'FSCommand:fullscreen' || url == 'FSCommand:allowscale')
            return true;

        var _this = this;
        if (target instanceof String) {
            switch (target.toLowerCase()) {
                case '_self':
                case '_blank':
                case '_parent':
                case '_top':
                    break;
                case 'post':
                    target = '_self';
                    method = 'GET';
                    break;
                case 'get':
                    target = '_self';
                    method = 'GET';
                    break;
                default:
                    if (!method)
                        method = 'GET';

                    _this.loadMovie(url, target, method);
                    return 0;
                    break;
            }
        }

        // form
        if (method == 'POST') {
            var form = _document.createElement('form');
            form.action = url;
            form.method = method;
            form.target = target;

            var urls = url.split('?');
            if (urls.length > 1) {
                var pears = urls[1].split('&');
                var pLen = pears.length;
                var _encodeURI = encodeURI;
                for (var pIdx = 0; pIdx < pLen; pIdx++) {
                    var pear = pears[pIdx].split('=');
                    var input = _document.createElement('input');
                    input.type = 'hidden';
                    input.name = pear[0];
                    input.value = _encodeURI(pear[1]||'');
                    form.appendChild(input);
                }
            }
            _document.body.appendChild(form);
            form.submit();
        } else {
            var func = new Function("location.href = '"+ url +"';");
            func();
        }
    };

    /**
     * @param url
     * @param target
     * @param method
     */
    MovieClip.prototype.loadVariables = function(url, target, method)
    {
        var _this = this;
        var xmlHttpRequest = new XMLHttpRequest();
        var body = null;
        if (method == 'POST') {
            var urls = url.split('?');
            if (urls[1] != undefined) {
                body = urls[1];
            }

            xmlHttpRequest.open(method, urls[0]);
            xmlHttpRequest.setRequestHeader(
                'Content-Type',
                'application/x-www-form-urlencoded'
            );
        } else {
            xmlHttpRequest.open(method, url);
        }

        xmlHttpRequest.send(body);
        xmlHttpRequest.onreadystatechange = function()
        {
            var readyState = xmlHttpRequest.readyState;
            if (readyState == 4) {
                var status = xmlHttpRequest.status;
                if (status == 200) {
                    var responseText = _decodeURIComponent(xmlHttpRequest.responseText);
                    var pairs = responseText.split('&');
                    var length = pairs.length;
                    var targetMc = _this.getMovieClip(target);
                    if (targetMc != null) {
                        for (var idx = 0; idx < length; idx++) {
                            var pair = pairs[idx];
                            var values = pair.split('=');
                            targetMc.setVariable(values[0], values[1]);
                        }
                    }
                }
            }
        }
    };

    /**
     * @param method
     * @returns {string}
     */
    MovieClip.prototype.checkMethod = function(method)
    {
        var methods = {
            gotoandstop: 'gotoAndStop',
            gotoandplay: 'gotoAndPlay',
            play: 'play',
            stop: 'stop',
            duplicatemovieclip: 'duplicateMovieClip',
            getproperty: 'getProperty',
            onclipevent: 'onClipEvent',
            removemovieclip: 'removeMovieClip',
            setproperty: 'setProperty',
            startdrag: 'startDrag',
            stopdrag: 'stopDrag',
            targetpath: 'targetPath',
            updateafterevent: 'updateAfterEvent',
            nextframe: 'nextFrame',
            nextscene: 'nextScene',
            prevframe: 'prevFrame',
            prevscene: 'prevScene',
            stopallsounds: 'stopAllSounds',
            setmask: 'setMask',
            geturl: 'getURL',
            loadmovie: 'loadMovie',
            loadmovienum: 'loadMovieNum',
            loadvariables : 'loadVariables',
            loadvariablesnum: 'loadVariablesNum',
            unloadmovie: 'unloadMovie',
            unloadmovienum: 'unloadMovieNum',
            swapdepths: 'swapDepths',
            attachmovie: 'attachMovie',
            getnexthighestdepth: 'getNextHighestDepth',
            getbytesloaded: 'getBytesLoaded',
            getbytestotal: 'getBytesTotal'
        };

        var lowerMethod = method.toLowerCase();
        return (lowerMethod in methods) ? methods[lowerMethod] : method;
    };

    /**
     * @returns {boolean}
     */
    MovieClip.prototype.hitTest = function()
    {
        var _this = this;
        var targetMc = arguments[0];
        if (!(targetMc instanceof MovieClip)) {
            var x = arguments[0];
            var y = arguments[1];
            var bool = arguments[2];
            if (!x || !y)
                return false;
        }

        var bounds = _this.getHitBounds();
        var xMax = bounds.xMax;
        var xMin = bounds.xMin;
        var yMax = bounds.yMax;
        var yMin = bounds.yMin;

        if (targetMc instanceof MovieClip) {
            var bounds = targetMc.getHitBounds();
            var txMax = bounds.xMax;
            var txMin = bounds.xMin;
            var tyMax = bounds.yMax;
            var tyMin = bounds.yMin;

            if(txMax > xMin && tyMax > yMin && xMax > txMin && yMax > tyMin)
                return true;
        } else {
            if (x >= xMin && x <= xMax && y >= yMin && y <= yMax)
                return true;
        }

        return false;
    };

    /**
     * @returns {{xMin: *, xMax: *, yMin: *, yMax: *}}
     * @private
     */
    MovieClip.prototype.getHitBounds = function()
    {
        var _this = this;
        var mc = _this;
        var matrix = _this.getMatrix();
        var _multiplicationMatrix = multiplicationMatrix;
        for (;;) {
            var parent = mc.getParent();
            if (!parent.getParent())
                break;
            matrix = _multiplicationMatrix(parent.getMatrix(), matrix);
            mc = parent;
        }
        return _this.getBounds(matrix);
    };

    /**
     * @param lock
     * @param left
     * @param top
     * @param right
     * @param bottom
     */
    MovieClip.prototype.startDrag = function(lock, left, top, right, bottom)
    {
        var _this = this;
        var _root = _this.getMovieClip('_root');
        var player = _root.getPlayer();

        var startX = 0;
        var startY = 0;
        if (!lock) {
            startX = _this.getXMouse();
            startY = _this.getYMouse();
        }

        player.dragMc = _this;
        player.dragRules = {
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
    MovieClip.prototype.stopDrag = function()
    {
        var _this = this;
        var _root = _this.getMovieClip('_root');
        var player = _root.getPlayer();
        player.dragMc = null;
        player.dragRules = null;
        _this.setDropTarget();
    };

    /**
     * executeDrag
     */
    MovieClip.prototype.executeDrag = function()
    {
        var _this = this;
        var _root = _this.getMovieClip('_root');
        var player = _root.getPlayer();

        var dragRules = player.dragRules;
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

        var moveX = x+xmouse;
        var moveY = y+ymouse;

        if (left) {
            if (!top)
                top = 0;

            if (!right)
                right = 0;

            if (!bottom)
                bottom = 0;

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
        } else {
            _this.setX(moveX);
            _this.setY(moveY);
        }
    };

    /**
     *
     */
    MovieClip.prototype.swapDepths = function()
    {
        var _this = this;
        var mc = arguments[0];
        var depth = 0;
        var swapMc = null;
        var swapDepth = null;
        var parent = _this.getParent();
        if (parent) {
            if (mc instanceof MovieClip) {
                if (_this.getParent() == mc.getParent()) {
                    depth = mc.getLevel();
                    swapDepth = _this.getLevel();
                    swapMc = mc;
                    _this.setDepth(depth, swapDepth, swapMc);
                }
            } else {
                depth = mc;
                if (_isNaN(depth)) {
                    depth = parent.getNextHighestDepth();
                    if (16384 > depth)
                        depth = 16384;
                } else {
                    depth += 16384;
                }

                var tags = parent.getTags();
                if (depth in tags) {
                    var tag = tags[depth];
                    if (tag.instanceId != _this.instanceId) {
                        swapMc = tag;
                        swapDepth = (_this._depth) ? _this._depth : _this.getLevel();
                        if (swapDepth == depth) {
                            var length = tags.length;
                            if (length) {
                                for (; length--;) {
                                    if (!(length in tags) || _this != tags[length])
                                        continue;
                                    swapDepth = length;
                                    break;
                                }
                            }
                        }
                    }
                }
                _this.setDepth(depth, swapDepth, swapMc);
            }
        }
    };

    /**
     * @param movieClip
     */
    MovieClip.prototype.setMask = function(movieClip)
    {
        var _this = this;
        var tags = _this.getTags();
        movieClip.isClipDepth = true;
        movieClip.clipDepth = tags.length - 1;
    };

    /**
     * @param id
     * @param name
     * @param depth
     * @param object
     * @returns {*}
     */
    MovieClip.prototype.attachMovie = function(id, name, depth, object)
    {
        var movieClip = null;
        var _this = this;
        if (_isNaN(depth)) {
            depth = _this.getNextHighestDepth();
            if (16384 > depth)
                depth = 16384;
        } else {
            depth += 16384;
        }

        var player = _this.getPlayer();
        var exportAssets = player.exportAssets;

        if (id in exportAssets) {
            var characterId = exportAssets[id];
            var tag = player.getCharacter(characterId);
            if (tag) {
                var swfTag = new SwfTag(player, null);
                var parent = _this.getParent();
                if (!parent)
                    parent = player.getParent();

                movieClip = new MovieClip();
                movieClip.player = player;
                movieClip.setCharacterId(characterId);
                movieClip.setParent(parent);
                movieClip.setLevel(depth);
                movieClip.setName(name);
                movieClip.setTarget(_this.getTarget()+"/"+name);
                movieClip.removable = true;
                swfTag.build(tag, movieClip);
                swfTag = null;

                var _cloneArray = cloneArray;
                var obj = {
                    colorTransform: _cloneArray([1,1,1,1,0,0,0,0]),
                    matrix: _cloneArray([1,0,0,1,0,0])
                };

                var totalFrame = parent.getTotalFrames() + 1;
                var addTags = parent.addTags;
                var controller = parent.controller;
                for (var frame = 1; frame < totalFrame; frame++) {
                    if (!(frame in addTags)) {
                        addTags[frame] = [];
                    }
                    if (!(frame in controller)) {
                        controller[frame] = [];
                    }

                    addTags[frame][depth] = movieClip;
                    controller[frame][depth] = obj;
                }

                var _controller = parent._controller;
                if (!(1 in _controller))
                    _controller[1] = [];

                _controller[1][depth] = {
                    _colorTransform: _cloneArray([1,1,1,1,0,0,0,0]),
                    _matrix: _cloneArray([1,0,0,1,0,0])
                };

                if (object) {
                    for (var prop in object)
                        movieClip.setProperty(prop, object[prop]);
                }

                movieClip.addActions();
            }
        }

        return movieClip;
    };

    /**
     * @returns {number}
     */
    MovieClip.prototype.getNextHighestDepth = function()
    {
        var depth = 0;
        var _this = this;
        var tags = _this.addTags;
        for (var length = tags.length; length--;) {
            if (!(length in tags))
                continue;
            var tag = tags[length];
            depth = _max(depth, tag.length);
        }
        return depth;
    };

    /**
     * @returns {*}
     */
    MovieClip.prototype.getBytesLoaded = function()
    {
        var _this = this;
        var player = _this.getPlayer();
        var bitio = player.bitio;
        return (!bitio) ? player.fileSize : bitio.byte_offset;
    };

    /**
     * @returns {number|*|fileLength}
     */
    MovieClip.prototype.getBytesTotal = function()
    {
        var _this = this;
        var player = _this.getPlayer();
        return player.fileSize;
    };

    /**
     * updateAfterEvent
     */
    MovieClip.prototype.updateAfterEvent = function()
    {
        var _this = this;
        var _root = _this.getMovieClip('_root');
        var player = _root.getPlayer();
        player.touchRender();
    };

    /**
     * @param target
     * @param name
     * @param depth
     */
    MovieClip.prototype.duplicateMovieClip = function(target, name, depth)
    {
        var targetMc = this.getMovieClip(name);
        if (targetMc != null && targetMc.getCharacterId() != 0) {
            var player = targetMc.getPlayer();
            var cloneMc = new MovieClip();
            cloneMc.player = player;

            var char = player.getCharacter(targetMc.characterId);
            var swftag = new SwfTag(player);
            swftag.build(char, cloneMc);
            swftag = null;

            var parent = targetMc.getParent();
            if (!parent)
                parent = player.getParent();

            cloneMc.setParent(parent);
            cloneMc.setName(target);
            cloneMc.setLevel(depth);
            cloneMc.setTotalFrames(targetMc.getTotalFrames());
            cloneMc.setCharacterId(targetMc.characterId);
            cloneMc.isStatic = targetMc.isStatic;
            cloneMc.variables = targetMc.variables;
            cloneMc.clipEvent = targetMc.clipEvent;
            cloneMc.filters = targetMc.filters;
            cloneMc.removable = true;

            var _cloneArray = cloneArray;
            var totalFrame = parent.getTotalFrames() + 1;
            var addTags = parent.addTags;
            var _controller = parent._controller;
            var controller = parent.controller;
            var matrix = targetMc.getMatrix();
            var colorTransform = targetMc.getColorTransform();
            var frame = 1;
            if (!(frame in controller))
                controller[frame] = [];
            controller[frame][depth] = {
                matrix: _cloneArray(matrix),
                colorTransform: _cloneArray(colorTransform)
            };

            if (!(frame in _controller))
                _controller[frame] = [];
            _controller[frame][depth] = {
                _matrix: _cloneArray(matrix),
                _colorTransform: _cloneArray(colorTransform)
            };

            for (frame = 1; frame < totalFrame; frame++) {
                if (!(frame in addTags))
                    addTags[frame] = [];
                addTags[frame][depth] = cloneMc;

                if (frame > 1) {
                    if (!(frame in controller))
                        controller[frame] = [];
                    controller[frame][depth] = controller[frame-1][depth];
                }
            }

            cloneMc.reset();
            cloneMc.addActions();
        }
    };

    /**
     * @param name
     */
    MovieClip.prototype.removeMovieClip = function(name)
    {
        var targetMc = this;
        if (name)
            targetMc = this.getMovieClip(name);

        if (targetMc != null && targetMc.removable) {
            var depth = targetMc.getLevel();
            var parent = targetMc.getParent();
            var addTags = parent.addTags;
            for (var frame = parent.getTotalFrames() + 1; --frame;) {
                delete addTags[frame][depth];
            }

            var controller = parent.controller;
            var _controller = parent._controller;
            for (frame = parent.getTotalFrames(); --frame;) {
                if (frame in _controller && depth in _controller[frame])
                    delete _controller[frame][depth];
                if (frame in controller && depth in controller[frame])
                    delete controller[frame][depth];
            }
        }
    };

    /**
     * putFrame
     */
    MovieClip.prototype.putFrame = function()
    {
        var _this = this;
        _this.active = true;
        var stopFlag = _this.stopFlag;
        var frame = _this.getFrame();
        if (!stopFlag) {
            var totalFrames = _this.getTotalFrames();
            if (totalFrames > 1) {
                if (_this.isLoad)
                    frame++;

                if (frame > totalFrames) {
                    frame = 1;
                    _this.resetCheck();
                }

                _this.setFrame(frame);
                _this.remove();
                _this.isAction = true;
                _this.soundStopFlag = false;
            }
        }

        var tags = _this.getTags();
        var depth = tags.length;
        if (depth) {
            for (;depth--;) {
                if (!(depth in tags))
                    continue;
                var tag = tags[depth];
                tag.putFrame();
            }
        }

        if (_this.isLoad) {
            _this.dispatchClipEvent('enterFrame');
            _this.dispatchEvent('onEnterFrame');
            _this.addTouchEvent();
            if (_this.isAction) {
                _this.isAction = false;
                var as = _this.getActions(_this.getFrame());
                if (as)
                    _this.setActionQueue(as);
            }
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
     * prevFrame
     */
    MovieClip.prototype.prevFrame = function()
    {
        var _this = this;
        var frame = _this.getFrame();
        frame--;
        _this.setNextFrame(frame);
        _this.stop();
    };

    /**
     * @returns {number}
     */
    MovieClip.prototype.getFrame = function()
    {
        return this._currentframe;
    };

    /**
     * @param frame
     */
    MovieClip.prototype.setFrame = function(frame)
    {
        this._currentframe = frame;
    };

    /**
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

            var maxFrame = _max(frame, _this.getFrame()) + 1;
            var minFrame = _min(frame, _this.getFrame());

            var tags = _this.getTags();
            var checked = [];
            var _reset = _this.reset;

            var nextTags = _this.getTags(frame);
            if (nextTags.length) {
                var length = _max(tags.length, nextTags.length);

                for (var depth = 1; depth < length; depth++) {
                    if (!(depth in tags) && !(depth in nextTags))
                        continue;

                    var tag = tags[depth];
                    var nextTag = nextTags[depth];
                    if (!(tag instanceof MovieClip) && !(nextTag instanceof MovieClip))
                        continue;

                    if (tag instanceof MovieClip && nextTag instanceof MovieClip) {
                        if (tag.instanceId == nextTag.instanceId) {
                            checked[tag.instanceId] = true;
                            continue;
                        }

                        _reset.call(tag, true, 1);
                        _reset.call(nextTag, true, 1);
                        checked[tag.instanceId] = tag;
                        checked[nextTag.instanceId] = nextTag;
                    } else if (tag instanceof MovieClip) {
                        _reset.call(tag, true, 1);
                        checked[tag.instanceId] = tag;
                    } else if (nextTag instanceof MovieClip) {
                        _reset.call(nextTag, true, 1);
                        checked[nextTag.instanceId] = nextTag;
                    }
                }
            }

            if (checked.length) {
                for (var chkFrame = minFrame; chkFrame < maxFrame; chkFrame++) {
                    var addTags = _this.getTags(chkFrame);
                    if (!addTags.length)
                        continue;

                    var aLen = addTags.length;
                    for (var depth = 1; depth < aLen; depth++) {
                        if (!(depth in addTags))
                            continue;

                        var tag = addTags[depth];
                        if (!(tag instanceof MovieClip))
                            continue;

                        var instanceId = tag.instanceId;
                        if (instanceId in checked)
                            continue;

                        checked[instanceId] = tag;
                        _reset.call(tag, true, 1);
                    }
                }
            }

            _this.setFrame(frame);
            _this.soundStopFlag = false;
            _this.addActions();
        }
    };

    /**
     * @returns {number}
     */
    MovieClip.prototype.getTotalFrames = function()
    {
        return this._totalframes;
    };

    /**
     * @param frame
     */
    MovieClip.prototype.setTotalFrames = function(frame)
    {
        this._totalframes = frame;
    };

    /**
     * @param name
     */
    MovieClip.prototype.deleteVariable = function(name)
    {
        var variables = this.variables;
        if (name in variables)
            delete variables[name];
    };

    /**
     * @returns {number}
     */
    MovieClip.prototype.getLevel = function()
    {
        return this._level;
    };

    /**
     * @param level
     */
    MovieClip.prototype.setLevel = function(level)
    {
        this._level = level;
    };

    /**
     * @returns {number}
     */
    MovieClip.prototype.getDepth = function()
    {
        var _this = this;
        var depth = (_this._depth)
            ? _this._depth
            : _this.getLevel();
        return depth - 16384;
    };

    /**
     * @param depth
     * @param swapDepth
     * @param swapMc
     */
    MovieClip.prototype.setDepth = function(depth, swapDepth, swapMc)
    {
        var _this = this;
        var player = _this.getPlayer();
        var parent = _this.getParent();
        var level  = (_this._depth)
            ? _this._depth
            : _this.getLevel();

        var tags = parent.getTags();
        if (!swapMc) {
            delete tags[level];
        } else {
            tags[swapDepth] = swapMc;
        }

        tags[depth] = _this;

        _this._depth = 0;
        if (depth >= 16384)
            _this._depth = depth;
    };

    /**
     * addLabel
     * @param frame
     * @param name
     */
    MovieClip.prototype.addLabel = function(frame, name)
    {
        this.labels[name] = _parseFloat(frame);
    };

    /**
     * @param name
     * @returns {*}
     */
    MovieClip.prototype.getLabel = function(name)
    {
        return this.labels[name];
    };

    /**
     * @param frame
     * @param obj
     */
    MovieClip.prototype.addSound = function(frame, obj)
    {
        if (!(frame in this.sounds))
            this.sounds[frame] = [];
        this.sounds[frame].push(obj);
    };

    /**
     * @returns {*}
     */
    MovieClip.prototype.getSounds = function()
    {
        var _this = this;
        return _this.sounds[_this.getFrame()];
    };

    /**
     * @param sound
     */
    MovieClip.prototype.startSound = function(sound)
    {
        var _this = this;
        var player = _this.getPlayer();
        var soundId = sound.SoundId;
        var tag = player.getCharacter(soundId);
        if (!tag) return 0;

        var soundInfo = tag.SoundInfo;
        startSound(sound.Audio, soundInfo);

        _this.soundStopFlag = true;
    };

    /**
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
     * @returns {*}
     */
    MovieClip.prototype.getTags = function(frame)
    {
        var _this = this;
        var addFrame = (!frame) ? _this.getFrame() : frame;
        return (addFrame in _this.addTags) ? _this.addTags[addFrame] : [];
    };

    /**
     * @param frame
     * @param tags
     */
    MovieClip.prototype.setRemoveTag = function(frame, tags)
    {
        var rTags = this.removeTags;
        rTags[frame] = [];

        var length = tags.length;
        for (var i = 0; i < length; i++) {
            var tag = tags[i];
            rTags[frame][i] = tag.Depth;
        }
    };

    /**
     * @param frame
     * @returns {*}
     */
    MovieClip.prototype.getRemoveTags = function(frame)
    {
        return this.removeTags[frame];
    };

    /**
     * remove
     */
    MovieClip.prototype.remove = function()
    {
        var _this = this;
        var removeTags = _this.getRemoveTags(_this.getFrame());
        if (removeTags) {
            var tags = _this.getTags(_this.getFrame() - 1);
            for (var length = removeTags.length; length--;) {
                var depth = removeTags[length];
                if (!(depth in tags))
                    continue;
                var tag = tags[depth];
                _this.dispatchClipEvent('unload');
                tag.reset();
            }
        }
    };

    /**
     * resetCheck
     */
    MovieClip.prototype.resetCheck = function()
    {
        var _this = this;
        var isReset = false;
        var _controller = _this._controller;
        var totalFrames = _controller.length;
        if (totalFrames) {
            for (var frame = 1; frame < totalFrames; frame++) {
                if (!(frame in _controller))
                    continue;

                var _cTags = _controller[frame];
                var length = _cTags.length;
                if (!length)
                    continue;

                for (var depth = 1; depth < length; depth++) {
                    if (!(depth in _cTags))
                        continue;
                    var addTags = _this.getTags(frame);
                    var obj = addTags[depth];
                    if (!obj.getRatio())
                        continue;
                    isReset = true;
                    obj.reset();
                }
            }
        }
        return isReset;
    };

    /**
     * reset
     */
    MovieClip.prototype.reset = function()
    {
        var _this = this;
        var _cloneArray = cloneArray;
        var _controller = _this._controller;
        var controller = _this.controller;
        var totalFrames = _controller.length;

        for (var frame = 1; frame < totalFrames; frame++) {
            if (!(frame in _controller))
                continue;

            var tags = _this.getTags(frame);
            var length = tags.length;
            if (length) {
                var isMoveDepth = false;
                var resetTags = [];
                for (var depth = 1; depth < length; depth++) {
                    if (!(depth in tags))
                        continue;

                    var tag = tags[depth];
                    if (!(tag instanceof MovieClip)) {
                        resetTags[depth] = tag;
                        continue;
                    }

                    var level = tag.getLevel();
                    if (level == depth) {
                        resetTags[depth] = tag;
                        continue;
                    }

                    isMoveDepth = true;
                    delete tags[depth];
                    resetTags[level] = tag;
                }

                if (isMoveDepth) {
                    for (var length = resetTags.length; length--;) {
                        if (!(length in resetTags))
                            continue;
                        tags[length] = resetTags[length];
                    }
                }
            }

            var _cTags = _controller[frame];
            var length = _cTags.length;
            if (!length)
                continue;

            for (var depth = 1; depth < length; depth++) {
                if (!(depth in _cTags))
                    continue;

                var _cTag = _cTags[depth];
                var cTag = controller[frame][depth];
                cTag.matrix = _cloneArray(_cTag._matrix);
                cTag.colorTransform = _cloneArray(_cTag._colorTransform);

                var obj = tags[depth];
                obj.reset();
            }
        }

        _this.play();
        _this.setVisible(true);
        _this.setFrame(1);

        _this.active = false;
        _this.isLoad = false;
        _this.isEnterFrame = false;
        _this.isAction = true;
        _this.soundStopFlag = false;
        _this._droptarget = null;
        _this._depth = 0;
    };

    /**
     * addTouchEvent
     */
    MovieClip.prototype.addTouchEvent = function()
    {
        var _this = this;
        var clipEvent = _this.clipEvent;
        var player = _this.getPlayer();
        var moveEventHits = player.moveEventHits;
        var downEventHits = player.downEventHits;
        var upEventHits = player.upEventHits;
        var keyDownEventHits = player.keyDownEventHits;

        for (var name in clipEvent) {
            var as = clipEvent[name];
            switch (name) {
                case 'mouseDown':
                    downEventHits[downEventHits.length] = {as: as, mc: _this};
                    break;
                case 'mouseMove':
                    moveEventHits[moveEventHits.length] = {as: as, mc: _this};
                    break;
                case 'mouseUp':
                    upEventHits[upEventHits.length] = {as: as, mc: _this};
                    break;
                case 'keyDown':
                    if(isTouch) {
                        downEventHits[downEventHits.length] = {as: as, mc: _this};
                    } else {
                        keyDownEventHits[keyDownEventHits.length] = {as: as, mc: _this};
                    }
                    break;
                case 'keyUp':
                    upEventHits[upEventHits.length] = {as: as, mc: _this};
                    break;
            }
        }

        var variables =_this.variables;
        var as = variables['onMouseDown'];
        if (as)
            downEventHits[downEventHits.length] = {as: [as], mc: _this};
        var as = variables['onPress'];
        if (as)
            downEventHits[downEventHits.length] = {as: [as], mc: _this};

        var as = variables['onMouseMove'];
        if (as)
            moveEventHits[moveEventHits.length] = {as: [as], mc: _this};

        var as = variables['onMouseUp'];
        if (as)
            upEventHits[upEventHits.length] = {as: [as], mc: _this};
        var as = variables['onRelease'];
        if (as)
            upEventHits[upEventHits.length] = {as: [as], mc: _this};
    };

    /**
     * addActions
     */
    MovieClip.prototype.addActions = function()
    {
        var _this = this;
        _this.active = true;

        if (_this.isAction) {
            _this.isAction = false;
            if (!_this.isLoad) {
                _this.dispatchClipEvent('load');

                var variables = _this.variables;
                var as = variables['onLoad'];
                if (as)
                    _this.setActionQueue([as]);

                _this.addTouchEvent();

                var player = _this.getPlayer();
                var initActions = player.initActions;
                var characterId = _this.getCharacterId();
                if (characterId in initActions) {
                    console.log('TODO initActions');
                    var initAction = initActions[characterId];
                    _this.setActionQueue([initAction]);
                }
            }

            var as = _this.getActions(_this.getFrame());
            if (as)
                _this.setActionQueue(as);
        }

        var tags = _this.getTags();
        var length = tags.length;
        if (length) {
            for (var depth = 1; depth < length; depth++) {
                if (!(depth in tags))
                    continue;
                var tag = tags[depth];
                tag.addActions();
            }
        }
    };

    /**
     * setActionQueue
     */
    MovieClip.prototype.setActionQueue = function(as)
    {
        var _this = this;
        var _root = _this.getMovieClip('_root');
        var player = _root.getPlayer();
        var actions = player.actions;
        actions[actions.length] = {mc:_this, as: as};
    };

    /**
     * @returns {*}
     */
    MovieClip.prototype.getParent = function()
    {
        return this.parent;
    };

    /**
     * @param parent
     */
    MovieClip.prototype.setParent = function(parent)
    {
        this.parent = parent;
    };

    /**
     * @returns {*}
     */
    MovieClip.prototype.getController = function()
    {
        var _this = this;
        var parent = _this.getParent();
        if (!parent)
            return _this;
        var controllers = parent.controller[parent.getFrame()];
        return controllers[_this.getLevel()];
    };

    /**
     * @returns {*}
     */
    MovieClip.prototype.getMatrix = function()
    {
        var _this = this;
        var controller = _this.getController();
        return controller.matrix;
    };

    /**
     * @returns {*}
     */
    MovieClip.prototype.getColorTransform = function()
    {
        var _this = this;
        var controller = _this.getController();
        return controller.colorTransform;
    };

    /**
     * @param matrix
     * @returns {{}}
     */
    MovieClip.prototype.getBounds = function(matrix)
    {
        var _this = this;
        var xMax = 0;
        var yMax = 0;
        var xMin = 0;
        var yMin = 0;

        var tags = _this.getTags();
        var length = tags.length;
        if (length) {
            var no = _Number.MAX_VALUE;
            xMax = -no;
            yMax = -no;
            xMin = no;
            yMin = no;

            var _multiplicationMatrix = multiplicationMatrix;
            for (var depth = 1; depth < length; depth++) {
                if (!(depth in tags))
                    continue;

                var tag = tags[depth];
                if (tag.isClipDepth)
                    continue;

                var matrix2 = (matrix)
                    ? _multiplicationMatrix(matrix, tag.getMatrix())
                    : tag.getMatrix();

                var bounds = tag.getBounds(matrix2);
                if (!bounds)
                    continue;

                xMin = _min(xMin, bounds.xMin);
                xMax = _max(xMax, bounds.xMax);
                yMin = _min(yMin, bounds.yMin);
                yMax = _max(yMax, bounds.yMax);
            }
        }

        return {xMin: xMin, xMax: xMax, yMin: yMin, yMax: yMax};
    };

    /**
     * @returns {null}
     */
    MovieClip.prototype.getDropTarget = function()
    {
        return this._droptarget;
    };

    /**
     * setDropTarget
     */
    MovieClip.prototype.setDropTarget = function()
    {
        var _this = this;
        _this._droptarget = null;
        var _root = _this.getMovieClip('_root');
        var player = _root.getPlayer();
        var parent = _this.getParent();
        if (!parent)
            parent = player.getParent();

        var x = _root.getXMouse();
        var y = _root.getYMouse();

        var tags = parent.getTags();
        var length = tags.length + 1;
        for (var depth = 1; depth < length; depth++) {
            if (!(depth in tags))
                continue;

            var tag = tags[depth];
            if (tag.instanceId == _this.instanceId)
                continue;

            if (!(tag instanceof MovieClip))
                continue;

            var hit = tag.hitTest(x, y);
            if (hit) {
                _this._droptarget = tag;
                break;
            }

        }
    };

    /**
     * @param frame
     * @returns {*}
     */
    MovieClip.prototype.getActions = function(frame)
    {
        return this.actions[frame];
    };

    /**
     * @param frame
     * @param actionScript
     */
    MovieClip.prototype.setActions = function(frame, actionScript)
    {
        var _this = this;
        _this.isStatic = false;

        var actions = _this.actions;
        if (!(frame in actions))
            actions[frame] = [];

        var len = actions[frame].length;
        actions[frame][len] = actionScript;
    };

    /**
     * @param frame
     */
    MovieClip.prototype.executeActions = function(frame)
    {
        var _this = this;
        var actions = _this.getActions(frame);
        if (actions != undefined) {
            var length = actions.length;
            for (var i = 0; i < length; i++) {
                var as = actions[i];
                if (as instanceof ActionScript) {
                    as.execute(_this);
                } else {
                    as.apply(_this);
                }
            }
        }
    };

    /**
     * @param ctx
     * @param matrix
     * @param colorTransform
     * @param player
     * @param visible
     */
    MovieClip.prototype.render = function(ctx, matrix, colorTransform, player, visible)
    {
        var _this = this;
        _this.isLoad = true;
        _this.isEnterFrame = true;
        var tags = _this.getTags();
        var length = tags.length;
        var clips = [];
        var _multiplicationMatrix = multiplicationMatrix;
        var _multiplicationColor = multiplicationColor;

        // sound
        if (!_this.soundStopFlag) {
            var sounds = _this.getSounds();
            if (sounds != undefined) {
                var sLen = sounds.length;
                for (var idx = 0; idx < sLen; idx++) {
                    if (!(idx in sounds))
                        continue;
                    var sound = sounds[idx];
                    _this.startSound(sound);
                }
            }
        }

        var lastDepth = 0;
        if (length) {
            for (var depth = 1; depth < length; depth++) {
                if (!(depth in tags))
                    continue;

                lastDepth = _max(depth, lastDepth);
                var obj = tags[depth];

                // mask 終了
                var cLen = clips.length;
                for (var cIdx = 0; cIdx < cLen; cIdx++) {
                    var cDepth = clips[cIdx];
                    if (depth > cDepth) {
                        clips.splice(cIdx, 1);
                        ctx.restore();
                        break;
                    }
                }

                // mask 開始
                if (obj.isClipDepth) {
                    ctx.save();
                    ctx.beginPath();
                    clips[clips.length] = obj.clipDepth;
                    if (obj instanceof MovieClip)
                        player.isClipDepth = true;
                }

                var renderMatrix = _multiplicationMatrix(matrix, obj.getMatrix());
                var renderColorTransform = _multiplicationColor(colorTransform, obj.getColorTransform());
                var isVisible = _min(obj.getVisible(), visible);

                var isFilter = false;
                if (obj instanceof MovieClip) {
                    var buttonStatus = obj.getButtonStatus();
                    var clipEvent = obj.clipEvent;
                    if (isVisible && 'press' in clipEvent && buttonStatus == 'up') {
                        var bounds = obj.getBounds(renderMatrix);
                        var buttonHits = player.buttonHits;
                        buttonHits[buttonHits.length] = {
                            xMax: bounds.xMax,
                            xMin: bounds.xMin,
                            yMax: bounds.yMax,
                            yMin: bounds.yMin,
                            parent: obj
                        };
                    }

                    var filters = obj.getFilters();
                    if (filters.length) {
                        isFilter = true;
                        obj.preFilter(ctx, matrix, renderColorTransform, player, isVisible);
                    }
                }

                if (player.moveFrame)
                    break;

                obj.render(ctx, renderMatrix, renderColorTransform, player, isVisible, _this.getPlayer());
                if (player.isClipDepth)
                    player.isClipDepth = false;

                if (isFilter) {
                    obj.postFilter(ctx, renderMatrix, renderColorTransform, player, isVisible);
                }
            }
        }

        lastDepth++;
        if (length && length != lastDepth) {
            tags.length = lastDepth;
        }

        if (clips.length)
            ctx.restore();
    };

    /**
     * @param ctx
     * @param matrix
     * @param colorTransform
     * @param player
     * @param visible
     */
    MovieClip.prototype.preFilter = function(ctx, matrix, colorTransform, player, visible)
    {
        var _this = this;
        var filters = _this.filters;
        var length = filters.length;
        if (length) {
            var _generateColorTransform = generateColorTransform;
            for (var id = 0; id < length; id++) {
                if (!(id in filters))
                    continue;

                var filter = filters[id];
                switch (id) {
                    case 0:
                        var color = _generateColorTransform(filter.color, colorTransform);
                        var css = "rgba("
                            + color.R
                            +", "+ color.G
                            +", "+ color.B
                            +", "+ color.A
                            +")";
                        ctx.shadowColor = css;

                        //var point = filter.Angle / 20 * _PI / 180;
                        var r = 45 * _PI / 180;
                        var bounds = _this.getBounds(matrix);
                        var x = bounds.xMin/20 + _cos(r) * filter.Distance;
                        var y = bounds.yMin/20 + _sin(r) * filter.Distance;

                        ctx.shadowBlur = filter.Strength * 3.5 * filter.Passes;
                        ctx.shadowOffsetX = x;
                        ctx.shadowOffsetY = y;

                        break;
                    case 1:
                        ctx.shadowBlur = 3.5 * filter.Passes;
                        ctx.shadowOffsetX = filter.BlurX;
                        ctx.shadowOffsetY = filter.BlurY;
                        break;
                    case 2:
                        var color = _generateColorTransform(filter.color, colorTransform);
                        var css = "rgba("
                            + color.R
                            +", "+ color.G
                            +", "+ color.B
                            +", "+ color.A
                            +")";
                        ctx.shadowColor = css;
                        ctx.shadowBlur = filter.Strength * 3.5 * filter.Passes;
                        //ctx.shadowOffsetX = filter.BlurX;
                        //ctx.shadowOffsetY = filter.BlurY;
                        break;
                }
            }
        }
    };

    /**
     * @param ctx
     */
    MovieClip.prototype.postFilter = function(ctx, matrix, colorTransform, player, visible)
    {
        var _this = this;
        var filters = _this.filters;
        var length = filters.length;
        if (length) {
            var _generateColorTransform = generateColorTransform;
            for (var id = 0; id < length; id++) {
                if (!(id in filters))
                    continue;

                var filter = filters[id];
                switch (id) {
                    case 0:
                        ctx.globalCompositeOperation = 'source-over';
                        ctx.shadowBlur = 0;
                        ctx.shadowColor = "rgba(0, 0, 0, 0)";
                        ctx.shadowOffsetX = 0;
                        ctx.shadowOffsetY = 0;
                        break;
                    case 1:
                        ctx.shadowBlur = 0;
                        ctx.shadowOffsetX = 0;
                        ctx.shadowOffsetY = 0;
                        break;
                    case 2:
                        ctx.shadowBlur = 0;
                        ctx.shadowColor = "rgba(0, 0, 0, 0)";
                        ctx.shadowOffsetX = 0;
                        ctx.shadowOffsetY = 0;
                        break;
                }
            }
        }

    };

    /**
     * @returns {*}
     */
    MovieClip.prototype.getButtonStatus = function()
    {
        return this.buttonStatus;
    };

    /**
     * @param status
     */
    MovieClip.prototype.setButtonStatus = function(status)
    {
        this.buttonStatus = status;
    };

    /**
     *
     * @constructor
     */
    var Key = function(){};

    /**
     * @param code
     * @returns {boolean}
     */
    Key.prototype.isDown = function(code)
    {
        return (this.getCode() == code) ? true : false;
    };

    /**
     * @returns {*}
     */
    Key.prototype.getCode = function()
    {
        var keyCode = (_event) ? _event.keyCode : null;
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
    function keyAction(event)
    {
        _event = event;
        var keyCode = keyClass.getCode();
        var length = players.length;
        for (var pIdx = 0; pIdx < length; pIdx++) {
            if (!(pIdx in players))
                continue;

            var player = players[pIdx];
            var keyDownEventHits = player.keyDownEventHits;
            var kLen = keyDownEventHits.length;
            if (kLen) {
                var _executeEventAction = player.executeEventAction;
                for (var idx = 0; idx < kLen; idx++) {
                    var obj = keyDownEventHits[idx];
                    _executeEventAction.call(player, obj);
                }
                player.executeAction();
            }

            var buttonHits = player.buttonHits;
            var len = buttonHits.length;
            var isEnd = false;

            for (var i = len; i--;) {
                if (!(i in buttonHits))
                    continue;

                var hitObj = buttonHits[i];
                if (!hitObj == null)
                    continue;

                var button = hitObj.button;
                if (!button)
                    continue;

                var actions = button.getActions();
                if (!actions)
                    continue;

                var aLen = actions.length;
                for (var idx = 0; idx < aLen; idx++) {
                    if (!(idx in actions))
                        continue;

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

                    if (CondKeyPress != keyCode)
                        continue;

                    player.buttonAction(hitObj.parent, cond.ActionScript);
                    player.touchRender();
                    isEnd = true;
                    break;
                }

                if (isEnd)
                    break;
            }
        }
    }

    /**
     * @constructor
     */
    var Player = function()
    {
        var _this = this;
        _this.id = playerId++;
        _this.name = 'swf2js_'+this.id;
        _this.intervalId = 0;

        var mc = new MovieClip();
        mc.matrix = cloneArray([1,0,0,1,0,0]);
        mc.colorTransform = cloneArray([1,1,1,1,0,0,0,0]);
        _this.parent = mc;
        _this.parent.player = this;
        _this.fps = 0;
        _this.fileSize = 0;
        _this.stopFlag = true;
        _this.moveFrame = false;

        // options
        _this.optionWidth = 0;
        _this.optionHeight = 0;
        _this.isSpriteSheet = false;
        _this.cacheMode = true;
        _this.callback = null;
        _this.renderMode = isWebGL;
        _this.tagId = null;

        // params
        _this.context = null;
        _this.canvas = null;
        _this.preContext = null;
        _this.matrix = [];
        _this.characters = [];
        _this.exportAssets = [];
        _this.buttonHits = [];
        _this.downEventHits = [];
        _this.moveEventHits = [];
        _this.upEventHits = [];
        _this.keyDownEventHits = [];
        _this.keyUpEventHits = [];
        _this.sounds = [];
        _this.loadSounds = [];
        _this.actions = [];
        _this.queue = null;
        _this.initActions = [];
        _this.touchObj = null;
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
        _this.backgroundColor = "rgb(255,255,255)";
        _this.version = 8;
        _this.loadStatus = 0;
        _this.isClipDepth = false;
        _this.clipDepth = 0;
        _this.clipMc = null;
        _this.dragMc = null;
        _this.dragRules = null;

        // parse
        _this.swftag = null;
        _this.bitio = null;
    };

    /**
     * @returns {number|*}
     */
    Player.prototype.getId = function()
    {
        return this.id;
    };

    /**
     * @param id
     */
    Player.prototype.setId = function(id)
    {
        this.id = id;
    };

    /**
     * @returns {*}
     */
    Player.prototype.getParent = function()
    {
        return this.parent;
    };

    /**
     * @param parent
     */
    Player.prototype.setParent = function(parent)
    {
        this.parent = parent;
    };

    /**
     * @returns {number|*}
     */
    Player.prototype.getVersion = function()
    {
        return this.version;
    };

    /**
     * @param version
     */
    Player.prototype.setVersion = function(version)
    {
        this.version = version;
    };

    /**
     *
     * @returns {string}
     */
    Player.prototype.getBackgroundColor = function()
    {
        return this.backgroundColor;
    };

    /**
     * @param r
     * @param g
     * @param b
     */
    Player.prototype.setBackgroundColor = function(r, g, b)
    {
        this.backgroundColor = "rgb("+ r +","+ g +","+ b +")";
    };

    /**
     * play
     */
    Player.prototype.play = function()
    {
        var _this = this;
        _this.stopFlag = false;
        var enterFrame = function(){ requestAnimationFrame(function(){ _this.onEnterFrame(); }, 0); };
        _this.intervalId = _setInterval(enterFrame, _this.getFps());
    };

    /**
     * stop
     */
    Player.prototype.stop = function()
    {
        var _this = this;
        _this.stopFlag = true;
        _clearInterval(_this.intervalId);
    };

    /**
     * @returns {*}
     */
    Player.prototype.getName = function()
    {
        return this.name;
    };

    /**
     * @param name
     */
    Player.prototype.setName = function(name)
    {
        this.name = name;
    };

    /**
     * @param options
     */
    Player.prototype.setOptions = function(options)
    {
        if (options != undefined) {
            var _this = this;
            _this.optionWidth = options.width || _this.optionWidth;
            _this.optionHeight = options.height || _this.optionHeight;
            _this.callback = options.callback || _this.callback;
            _this.tagId = options.tagId || _this.tagId;
            _this.renderMode = options.renderMode || _this.renderMode;
            _this.cacheMode = options.cacheMode || _this.cacheMode;
            _this.isSpriteSheet = options.isSpriteSheet || _this.isSpriteSheet;
        }
    };

    /**
     * @returns {number}
     */
    Player.prototype.getBaseWidth = function()
    {
        return this.baseWidth;
    };

    /**
     * @param baseWidth
     */
    Player.prototype.setBaseWidth = function(baseWidth)
    {
        this.baseWidth = baseWidth;
    };

    /**
     *
     * @returns {number}
     */
    Player.prototype.getBaseHeight = function()
    {
        return this.baseHeight;
    };

    /**
     * @param baseHeight
     */
    Player.prototype.setBaseHeight = function(baseHeight)
    {
        this.baseHeight = baseHeight;
    };

    /**
     *
     * @returns {number}
     */
    Player.prototype.getWidth = function()
    {
        return this.width;
    };

    /**
     * @param width
     */
    Player.prototype.setWidth = function(width)
    {
        if (width < 0)
            width *= -1;
        this.width = width;
    };

    /**
     * @returns {number}
     */
    Player.prototype.getHeight = function()
    {
        return this.height;
    };

    /**
     * @param height
     */
    Player.prototype.setHeight = function(height)
    {
        if (height < 0)
            height *= -1;
        this.height = height;
    };

    /**
     * @returns {number}
     */
    Player.prototype.getScale = function()
    {
        return this.scale;
    };

    /**
     * @param scale
     */
    Player.prototype.setScale = function(scale)
    {
        this.scale = scale;
    };

    /**
     * @returns {number}
     */
    Player.prototype.getMatrix = function()
    {
        return this.matrix;
    };

    /**
     * @param matrix
     */
    Player.prototype.setMatrix = function(matrix)
    {
        this.matrix = matrix;
    };

    /**
     * @param id
     * @returns {*}
     */
    Player.prototype.getCharacter = function(id)
    {
        return this.characters[id];
    };

    /**
     * @param id
     * @param obj
     */
    Player.prototype.setCharacter = function(id, obj)
    {
        this.characters[id] = obj;
    };

    /**
     * @returns {*}
     */
    Player.prototype.getFps = function()
    {
        return this.fps;
    };

    /**
     * @param fps
     */
    Player.prototype.setFps = function(fps)
    {
        this.fps = _floor(1000 / fps);
    };

    /**
     * loadStatus CountUp
     */
    Player.prototype.loadEvent = function()
    {
        var _this = this;
        switch (_this.loadStatus) {
            case 2:
                _this.resize();
                _this.loadStatus++;
                break;
            case 3:
                if (!_this.isLoad || !_this.stopFlag || _this.imgUnLoadCount > 0)
                    break;
                _this.loadStatus++;
                _this.loaded();
                break;
        }
        if (_this.loadStatus != 4)
            _setTimeout(function (){ _this.loadEvent(); }, 0);
    };

    /**
     * @param swf
     */
    Player.prototype.parse = function(swf)
    {
        var _this = this;
        _this.isLoad = false;
        _this.bitio = new BitIO();
        _this.swftag = new SwfTag(_this, _this.bitio);

        if (isXHR2) {
            _this.bitio.setData(new Uint8Array(swf));
        } else {
            _this.bitio.init(swf);
        }

        // Header
        if (_this.setSwfHeader()) {
            var swftag = _this.swftag;
            var mc = _this.getParent();
            var tags = swftag.parse(mc);
            swftag.build(tags, mc);
        }

        _this.bitio = null;
        _this.swftag = null;
        _this.isLoad = true;
    };

    /**
     * @returns {boolean}
     */
    Player.prototype.setSwfHeader = function()
    {
        var _this = this;
        var bitio = _this.bitio;
        var swftag = _this.swftag;

        var data = bitio.data;
        if (data[0] == 0xff && data[1] == 0xd8) {
            _this.parseJPEG(data);
            return false;
        }

        // signature
        var signature = bitio.getHeaderSignature();

        // version
        var version = bitio.getVersion();
        _this.setVersion(version);

        // ファイルサイズ
        var fileLength = bitio.getUI32();
        _this.fileSize = fileLength;

        // 圧縮データを解凍
        switch (signature) {
            case 'FWS': // No ZIP
                break;
            case 'CWS': // ZLIB
                bitio.deCompress(fileLength);
                break;
            case 'ZWS': // LZMA
                alert('not supported by LZMA');
                return false;
                break;
        }

        // フレームサイズ
        var bounds = swftag.rect();

        // フレーム
        var frameRate  = bitio.getUI16() / 0x100;
        var frameCount = bitio.getUI16();

        _this.setBaseWidth(_ceil((bounds.xMax - bounds.xMin) / 20));
        _this.setBaseHeight(_ceil((bounds.yMax - bounds.yMin) / 20));
        _this.setFps(frameRate);

        _this.loadStatus++;

        return true;
    };

    /**
     * @param data
     */
    Player.prototype.parseJPEG = function(data)
    {
        var _this = this;
        var swftag = _this.swftag;
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
            _this.setCharacter(2, imageContext);

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
                        bitmapId: 2,
                        bitmapMatrix: [20, 0, 0, 20, 0, 0],
                        fillStyleType: 65
                    }]
                },
                lineStyles: {
                    lineStyleCount: 0,
                    lineStyles: []
                }
            };

            var bounds = {xMin: 0, xMax: shapeWidth, yMin: 0, yMax: shapeHeight};

            _this.setCharacter(1, {
                tagType: 22,
                data: vtc.execute(shape),
                bounds: bounds
            });

            var obj = new Shape();
            obj.setData(vtc.execute(shape));
            obj.setTagType(22);
            obj.setCharacterId(1);
            obj.setBounds(bounds);
            obj.setMatrix(cloneArray([1,0,0,1,0,0]));
            obj.setColorTransform(cloneArray([1,1,1,1,0,0,0,0]));

            var mc = _this.getParent();
            mc.addTags[1] = [];
            mc.addTags[1][1] = obj;

            _this.init();
            cacheStore.reset();
        };

        image.src = "data:image/jpeg;base64,"
            + swftag.base64encode(swftag.parseJpegData(data));
    };

    /**
     * resize
     */
    Player.prototype.resize = function()
    {
        var _this = this;
        var div = _document.getElementById(_this.getName());
        if (!div)
            return 0;

        var oWidth = _this.optionWidth;
        var oHeight = _this.optionHeight;

        var screenWidth = 0;
        var screenHeight = 0;
        var scale = 1;
        var width = 0;
        var height = 0;

        var parent = div.parentNode;
        if (parent.tagName == 'BODY') {
            screenWidth  = (oWidth > 0) ? oWidth : window.innerWidth;
            screenHeight = (oHeight > 0) ? oHeight : window.innerHeight;
        } else {
            screenWidth  = (oWidth > 0) ? oWidth : parent.offsetWidth;
            screenHeight = (oHeight > 0) ? oHeight : parent.offsetHeight;
        }

        var baseWidth  = _this.getBaseWidth();
        var baseHeight = _this.getBaseHeight();
        var minSize = _min(screenWidth, screenHeight);

        // 条件に合わせてリサイズ
        if(baseWidth > baseHeight){
            scale = (screenWidth / baseWidth);
            width  = baseWidth * scale;
            height = baseHeight * scale;
        } else if (baseWidth == baseHeight) {
            scale  = minSize / baseWidth;
            width  = baseWidth * scale;
            height = baseHeight * scale;
        } else {
            scale = _min((screenWidth / baseWidth), (screenHeight / baseHeight));
            width  = baseWidth * scale;
            height = baseHeight * scale;
        }

        _this.setScale(scale);
        _this.setWidth(width * devicePixelRatio);
        _this.setHeight(height * devicePixelRatio);

        // divの設定
        var style = div.style;
        style.width = width + 'px';
        style.height = height + 'px';
        style.top = 0;
        style.left =  ((screenWidth / 2) - (width / 2)) + 'px';

        width *= devicePixelRatio;
        height *= devicePixelRatio;

        // main
        var canvas = _this.context.canvas;
        canvas.width = width;
        canvas.height = height;

        // pre
        var preCanvas = _this.preContext.canvas;
        preCanvas.width = width;
        preCanvas.height = height;

        // tmp
        if (isAndroid && isChrome) {
            var tmpCanvas = tmpContext.canvas;
            tmpCanvas.width = width;
            tmpCanvas.height = height;
        }

        var mScale = scale * _devicePixelRatio / 20;
        _this.setMatrix(cloneArray([mScale, 0, 0, mScale, 0, 0]));
    };

    /**
     * loaded
     */
    Player.prototype.loaded = function()
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
            // backgroundColor
            var style = div.style;
            style.backgroundColor = _this.getBackgroundColor();

            var ctx = _this.context;
            var canvas = ctx.canvas;

            // load sound
            if (isTouch) {
                var loadSounds = _this.loadSounds;
                var sLen = loadSounds.length;
                if (sLen) {
                    var loadSound = function () {
                        canvas.removeEventListener(startEvent, loadSound);
                        for (var i = sLen; i--;) {
                            if (!(i in loadSounds))
                                continue;
                            var audio = loadSounds[i];
                            audio.load();
                        }
                        _this.loadSounds = [];
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

            // _root
            var mc = _this.getParent();

            // action
            mc.addActions();
            _this.executeAction();

            // API
            if (typeof _this.callback == 'function') {
                _this.callback.call(window, mc);
            }

            // render
            _this.render();
            _this.renderMain();

            // start
            _this.play();
        }
    };

    /**
     * deleteNode
     */
    Player.prototype.deleteNode = function(tagId)
    {
        var div = _document.getElementById(tagId ? tagId : this.getName());
        if (div) {
            var childNodes = div.childNodes;
            var len = childNodes.length;
            if (len) {
                for (var i = len; i--;) {
                    div.removeChild(childNodes[i]);
                }
            }
        }
    };

    /**
     * onEnterFrame
     */
    Player.prototype.onEnterFrame = function()
    {
        var _this = this;
        if (_this.isLoad && !_this.stopFlag)
            _this.nextFrame();
    };

    /**
     * nextFrame
     */
    Player.prototype.nextFrame = function()
    {
        var _this = this;
        _this.downEventHits = [];
        _this.moveEventHits = [];
        _this.upEventHits = [];
        _this.keyDownEventHits = [];
        _this.keyUpEventHits = [];

        var mc = _this.getParent();
        mc.putFrame();
        mc.addActions();
        _this.executeAction();
        _this.render();
        _this.renderMain();
    };

    /**
     * render
     */
    Player.prototype.render = function()
    {
        var _this = this;
        _this.buttonHits = [];
        var mc = _this.getParent();
        var ctx = _this.preContext;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, _this.width + 1, _this.height + 1);
        mc.render(ctx, mc.getMatrix(), mc.getColorTransform(), _this, mc.getVisible());
    };

    /**
     * executeAction
     */
    Player.prototype.executeAction = function()
    {
        var _this = this;
        if (_this.actions.length) {
            for (var i = 0; i < _this.actions.length; i++) {
                var obj = _this.actions[i];
                var mc = obj.mc;
                if (mc.active) {
                    var as = obj.as;
                    var length = as.length;
                    for (var idx = 0; idx < length; idx++) {
                        var action = as[idx];
                        if (action instanceof ActionScript) {
                            action.execute(mc);
                        } else {
                            action.apply(mc);
                        }
                    }
                }
            }
        }
        _this.actions = [];
    };

    /**
     * @param mc
     * @param as
     */
    Player.prototype.buttonAction = function(mc, as)
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
    Player.prototype.renderMain = function()
    {
        var _this = this;
        var preContext = _this.preContext;
        var preCanvas = preContext.canvas;
        var ctx = _this.context;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, _this.width + 1, _this.height + 1);
        ctx.drawImage(preCanvas, 0, 0);
    };

    /**
     * reset
     */
    Player.prototype.reset = function()
    {
        var _this = this;
        _this.instanceId = 0;
        _this.parent = new MovieClip();
        _this.parent.player = _this;
        _this.swftag = null;
        _this.bitio = null;
        _this.characters = [];
        _this.buttonHits = [];
        _this.downEventHits = [];
        _this.moveEventHits = [];
        _this.upEventHits = [];
        _this.keyDownEventHits = [];
        _this.keyUpEventHits = [];
        _this.sounds = [];
        _this.loadSounds = [];
        _this.actions = [];
        _this.initActions = [];
    };

    /**
     * init
     */
    Player.prototype.init = function()
    {
        var _this = this;
        var tagId = _this.tagId;

        if (_this.getId() in players) {
            if (tagId) {
                if (_document.readyState == 'loading') {
                    var reStart = function () {
                        window.removeEventListener("DOMContentLoaded", reStart, false);
                        _this.init();
                    };

                    window.addEventListener("DOMContentLoaded", reStart, false);

                    return 0;
                }

                var container = _document.getElementById(tagId);
                if (!container) {
                    alert('Not Found Tag ID:' + tagId);
                    return 0;
                }

                var div = _document.getElementById(_this.getName());
                if (div) {
                    _this.deleteNode();
                } else {
                    div = _document.createElement('div');
                    div.id = _this.getName();
                    container.appendChild(div);
                }
            } else {
                _document.open();
                _document.write('<div id="' + _this.getName() + '"></div>');
                _document.close();
            }
        }

        var div = _document.getElementById(_this.getName());
        if (div) {
            var style = div.style;
            style.position = 'relative';
            style.top = '0';
            style.backgroundColor = '#000000';
            style.overflow = 'hidden';
            style["-webkit-backface-visibility"] = "hidden";

            var parent = div.parentNode;
            var oWidth = _this.optionWidth;
            var oHeight = _this.optionHeight;
            if (parent.tagName == 'BODY') {
                var width = (oWidth > 0) ? oWidth : window.innerWidth;
                var height = (oHeight > 0) ? oHeight :window.innerHeight;
            } else {
                var width  = (oWidth > 0) ? oWidth : parent.offsetWidth;
                var height = (oHeight > 0) ? oHeight : parent.offsetHeight;
            }

            style.width = width + 'px';
            style.height = height + 'px';
            style['-webkit-user-select'] = 'none';

            // loading
            _this.loading();
        }

        if (!_this.canvas) {
            var canvas = _document.createElement('canvas');
            canvas.width = 1;
            canvas.height = 1;

            var style = canvas.style;
            style.zIndex = 0;
            style.position = 'absolute';
            style.zoom = 100 / _devicePixelRatio + '%';
            style['-webkit-tap-highlight-color'] = 'rgba(0,0,0,0)';

            style.MozTransformOrigin = '0 0';
            style.MozTransform = 'scale(' + 1 / _devicePixelRatio + ')';

            if (isAndroid) {
                canvas.addEventListener('touchcancel', function (event)
                {
                    _this.touchEnd(_event);
                });
            }

            if (!isTouch) {
                window.addEventListener("keydown", keyAction);
                window.addEventListener("keyup", function (event)
                {
                    _event = event;
                    _this.touchEnd(event);
                });
            }

            _this.context = canvas.getContext('2d');
            _this.canvas = canvas;

            var preCanvas = _document.createElement('canvas');
            preCanvas.width = 1;
            preCanvas.height = 1;
            _this.preContext = preCanvas.getContext('2d');
        }

        _this.loadStatus++;
        _this.loadEvent();
    };

    /**
     * loading
     */
    Player.prototype.loading = function()
    {
        var _this = this;
        var div = _document.getElementById(_this.getName());
        var loadingId = _this.getName() + '_loading';
        var css = '<style>';
        css += '#'+ loadingId +' {\n';
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
        css += '-webkit-animation: '+ loadingId +' 1s infinite linear;\n';
        css += '} \n';
        css += '@-webkit-keyframes '+ loadingId +' {\n';
        css += '0% {-webkit-transform: rotate(0deg); opacity: 0.4;}\n';
        css += '50% {-webkit-transform: rotate(180deg); opacity: 1;}\n';
        css += '100% {-webkit-transform: rotate(360deg); opacity: 0.4;}\n';
        css += '} \n';
        css += '</style>';
        div.innerHTML = css;
        var loadingDiv = _document.createElement('div');
        loadingDiv.id = loadingId;
        div.appendChild(loadingDiv);
    };

    /**
     * @param url
     * @param options
     */
    Player.prototype.reload = function(url, options)
    {
        var _this = this;
        _this.stop();

        if (_this.loadStatus == 4)
            _this.deleteNode();

        _this.loadStatus = 0;
        _this.isLoad = false;
        _this.reset();

        return swf2js.load(url, {
            optionWidth: options.optionWidth | _this.optionWidth,
            optionHeight: options.optionHeight | _this.optionHeight,
            callback: options.callback | _this.callback,
            tagId: options.tagId | _this.tagId,
            renderMode: options.renderMode | _this.renderMode,
            cacheMode: options.cacheMode | _this.cacheMode,
            isSpriteSheet: options.isSpriteSheet | _this.isSpriteSheet,
            player: _this
        });
    };

    /**
     * @param outputPath
     * @param frame
     * @param width
     * @param height
     * @returns {boolean}
     */
    Player.prototype.output = function(outputPath, frame, width, height)
    {
        var _this = this;
        if (!_this.isLoad || _this.stopFlag) {
            _setTimeout(function ()
            {
                _this.output(outputPath, frame, width, height);
            }, 500);
            return 0;
        }

        _this.stop();

        if (!frame) {
            frame = 1;
        }

        if (!width) {
            width = _this.getWidth();
        }

        if (!height) {
            height = _this.getHeight();
        }

        // resize
        var mc = _this.getParent();
        mc.reset();
        mc.gotoAndStop(frame);
        if (width != _this.getWidth() || height != _this.getHeight()) {
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

        // base64
        var base64 = canvas.toDataURL();

        var xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.open('POST', outputPath);
        xmlHttpRequest.setRequestHeader(
            'Content-Type',
            'application/x-www-form-urlencoded'
        );

        // alert
        xmlHttpRequest.onreadystatechange = function()
        {
            var readyState = xmlHttpRequest.readyState;
            if (readyState == 4) {
                var status = xmlHttpRequest.status;
                if (status == 200) {
                    console.log('OUTPUT SUCCESS');
                    return true;
                } else {
                    alert('[ERROR] HTTP STATUS: '+ status);
                }
            }
        };

        xmlHttpRequest.send('data='+ encodeURIComponent(base64));
    };

    /**
     * @param event
     */
    Player.prototype.hitCheck = function(event)
    {
        var _this = this;
        var buttonHits = _this.buttonHits;
        var len = buttonHits.length;
        if (!len) return 0;

        var div = _document.getElementById(_this.getName());
        var bounds = div.getBoundingClientRect();
        var docBody = _document.body;
        var x = docBody.scrollLeft + bounds.left;
        var y = docBody.scrollTop + bounds.top;
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

        // reset
        _this.isHit = false;
        _this.touchEndAction = null;
        for (var i = len; i--;) {
            if (!(i in buttonHits))
                continue;

            var hitObj = buttonHits[i];
            if (hitObj == undefined)
                continue;

            if (touchX >= hitObj.xMin && touchX <= hitObj.xMax
                && touchY >= hitObj.yMin && touchY <= hitObj.yMax
            ){
                event.preventDefault();
                _this.isHit = true;

                var mc = hitObj.parent;
                if (event.type == startEvent && mc.getButtonStatus() == 'up') {
                    mc.setButtonStatus('down');
                    var clipEvent = mc.clipEvent;
                    if ('press' in clipEvent) {
                        _this.executeEventAction({as:clipEvent['press'], mc: mc});
                    }
                }

                if (event.type == startEvent)
                    _this.touchObj = hitObj;

                if (!_this.touchObj)
                    break;

                var button = hitObj.button;
                if (!button)
                    break;

                var parent = null;
                if (_this.touchObj != null)
                    parent = _this.touchObj.parent;
                var hitButton = _this.touchObj.button;
                if (hitButton && button == hitButton)
                    button.setButtonStatus('down');

                var actions = button.getActions();
                var aLen = actions.length;

                for (var idx = 0; idx < aLen; idx++) {
                    if (!(idx in actions))
                        continue;

                    var cond = actions[idx];
                    if (cond.CondOverDownToOverUp) {
                        if (event.type == startEvent || parent == mc)
                            _this.touchEndAction = cond.ActionScript;
                        continue;
                    }

                    if (event.type != startEvent)
                        continue;

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
                        _this.touchObj.ActionScript = cond.ActionScript;
                        if (cond.CondOverUpToOverDown || (isTouch && keyPress)) {
                            var as = cond.ActionScript;
                            _this.buttonAction(mc, as);
                        }
                    }
                }

                if (event.type == startEvent) {
                    _this.touchRender();
                    var buttonCharacter = button.getButtonCharacter();
                    buttonCharacter.startSound();
                }

                break;
            }
        }
    };

    /**
     * @param obj
     */
    Player.prototype.executeEventAction = function(obj)
    {
        var actions = obj.as;
        var mc = obj.mc;
        var length = actions.length;
        for (var i = 0; i < length; i++) {
            var as = actions[i];
            if (as instanceof ActionScript) {
                as.execute(mc);
            } else {
                as.apply(mc);
            }

        }
    };

    /**
     * @param event
     */
    Player.prototype.touchStart = function(event)
    {
        var _this = this;
        _this.isTouchEvent = true;
        _this.touchObj = null;
        _this.touchEndAction = null;

        var downEventHits = _this.downEventHits;
        var length = downEventHits.length;
        if (length) {
            event.preventDefault();
            var _executeEventAction = _this.executeEventAction;
            for (var i = 0; i < length; i++) {
                var obj = downEventHits[i];
                _executeEventAction.call(_this, obj);
            }
            _this.executeAction();
        }

        _this.hitCheck(event);
    };

    /**
     * @param event
     */
    Player.prototype.touchMove = function(event)
    {
        var _this = this;
        var moveEventHits = _this.moveEventHits;
        var length = moveEventHits.length;
        if (length) {
            event.preventDefault();
            var _executeEventAction = _this.executeEventAction;
            for (var i = 0; i < length; i++) {
                var obj = moveEventHits[i];
                _executeEventAction.call(_this, obj);
            }
            _this.executeAction();
        }

        if (_this.isTouchEvent) {
            var isHit = _this.isHit;
            _this.hitCheck(event);

            if (isHit && !_this.isHit || !isHit && _this.isHit) {
                var touchObj = _this.touchObj;
                if (touchObj) {
                    var mc = touchObj.parent;
                    if (mc.getButtonStatus() == 'down')
                        mc.setButtonStatus('up');

                    var button = touchObj.button;
                    if (button) {
                        if (button.getButtonStatus() == 'down') {
                            button.setButtonStatus('up');
                            var buttonCharacter = button.getButtonCharacter();
                            buttonCharacter.startSound();
                            _this.touchRender();
                        }

                        if (!isHit && _this.isHit) {
                            var buttonCharacter = button.getButtonCharacter('over');
                            buttonCharacter.startSound();
                        }
                    }
                }
            }

            var dragMc = _this.dragMc;
            if (dragMc) {
                event.preventDefault();
                dragMc.executeDrag();
                _this.isHit = true;
            }
        }
    };

    /**
     * @param event
     */
    Player.prototype.touchEnd = function(event)
    {
        var _this = this;
        var touchObj = _this.touchObj;
        var upEventHits = _this.upEventHits;
        var length = upEventHits.length;
        if (length) {
            event.preventDefault();
            var _executeEventAction = _this.executeEventAction;
            for (var i = 0; i < length; i++) {
                var obj = upEventHits[i];
                _executeEventAction.call(_this, obj);
            }
            _this.executeAction();
        }

        if (_this.isHit && touchObj) {
            var isRender = false;
            var touchEndAction = _this.touchEndAction;
            var mc = touchObj.parent;
            if (touchEndAction != null) {
                event.preventDefault();
                _this.buttonAction(mc, touchEndAction);
                isRender = true;
            }

            var clipEvent = mc.clipEvent;
            if ('release' in clipEvent) {
                _this.executeEventAction({as:clipEvent['release'], mc:mc});
                isRender = true;
            }
            mc.setButtonStatus('up');

            var button = touchObj.button;
            if (button) {
                button.setButtonStatus('up');
                var buttonCharacter = button.getButtonCharacter('hit');
                buttonCharacter.startSound();
                isRender = true;
            }

            if (isRender)
                _this.touchRender();
        }

        _this.isHit = false;
        _this.isTouchEvent = false;
        _this.touchObj = null;
        _event = null;
    };

    /**
     * touchRender
     */
    Player.prototype.touchRender = function()
    {
        var _this = this;
        _this.render();
        _this.renderMain();
    };

    /**
     * @type {{}}
     */
    var swf2js = {};

    /**
     * @param url
     * @param options
     */
    swf2js.load = function(url, options)
    {
        // TODO 開発用
        if (url == 'develop') {
            url = location.search.substr(1).split('&')[0];
        }

        if (url) {
            var player = (options && options.player instanceof Player)
                ? options.player
                : new Player();

            player.setOptions(options);
            players[player.getId()] = player;
            player.init();

            var xmlHttpRequest = new XMLHttpRequest();
            xmlHttpRequest.open('GET', url, true);
            isXHR2 = typeof xmlHttpRequest.responseType != 'undefined';

            if (isXHR2) {
                xmlHttpRequest.responseType = 'arraybuffer';
            } else {
                xmlHttpRequest.overrideMimeType(
                    'text/plain; charset=x-user-defined'
                );
            }

            xmlHttpRequest.onreadystatechange = function()
            {
                var readyState = xmlHttpRequest.readyState;
                if (readyState == 4) {
                    var status = xmlHttpRequest.status;
                    switch (status) {
                        case 200:
                            player.parse(isXHR2 ? xmlHttpRequest.response : xmlHttpRequest.responseText);
                            cacheStore.reset();
                            break;
                        case 404:
                            alert('Not Found Swf');
                            break;
                        case 500:
                            alert('Internal Server Error');
                            break;
                    }
                }
            };

            xmlHttpRequest.send(null);
        } else {
            alert('please set swf url');
        }

        return player;
    };

    /**
     * @param url
     * @param options
     * @returns {*}
     */
    swf2js.reload = function(url, options)
    {
        if (!playerId)
            return swf2js.load(url, options);

        var player = players[0];
        for (var i = 0; i < playerId; i++) {
            if (!(i in players))
                continue;
            var p = players[i];
            if (i)
                p.deleteNode(p.tagId);
            _clearInterval(p.intervalId);
        }

        playerId = 1;
        players = [];
        players[0] = player;

        return player.reload(url, options);
    };

    /**
     * @param width
     * @param height
     * @param fps
     * @param options
     * @returns {MovieClip}
     */
    swf2js.createRootMovieClip = function(width, height, fps, options)
    {
        var player = new Player();
        player.setBaseWidth(width);
        player.setBaseHeight(height);
        player.setFps(fps);
        player.setOptions(options);
        players[player.getId()] = player;

        player.init();
        player.isLoad = true;

        var mc = new MovieClip();
        mc.player = player;
        player.parent = mc;

        if (_document.readyState == 'loading') {
            var reLoad = function()
            {
                window.removeEventListener("DOMContentLoaded", reLoad, false);
                player.resize();
                player.loaded();
            };
            window.addEventListener("DOMContentLoaded", reLoad, false);
        }
        return mc;
    };

    window.swf2js = swf2js;
})(window);}