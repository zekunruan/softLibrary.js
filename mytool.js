//浏览器检测
(function () {
    window.sys = {};
    var ua = navigator.userAgent.toLowerCase();
    var s;
    (s = ua.match(/msie ([\d.]+)/)) ? sys.ie = s[1] :
    (s = ua.match(/firefox\/([\d.]+)/)) ? sys.firefox = s[1] :
    (s = ua.match(/chrome\/([\d.]+)/)) ? sys.chrome = s[1] :
    (s = ua.match(/opera\/.*version\/([\d.]+)/)) ? sys.opera = s[1] :
    (s = ua.match(/version\/([\d.]+).*safari/)) ? sys.safari = s[1] : 0;

    if (/webkit/.test(ua)) sys.webkit = ua.match(/webkit\/([\d.]+)/)[1];
})();
//dom加载
function addDomLoaded(fn) {
    var isReady = false;
    var timer = null;
    function doReady() {
        if (timer) clearInterval(timer);
        if (isReady) return;
        isReady = true;
        fn();
    }

    if ((sys.opera && sys.opera < 9) || (sys.firefox && sys.firefox < 3) || (sys.webkit && sys.webkit < 525)) {
        //无论采用哪种，基本上用不着了
        /*timer = setInterval(function () {
            if (/loaded|complete/.test(document.readyState)) {  //loaded是部分加载，有可能只是DOM加载完毕，complete是完全加载，类似于onload
                doReady();
            }
        }, 1);*/

        timer = setInterval(function () {
            if (document && document.getElementById && document.getElementsByTagName && document.body) {
                doReady();
            }
        }, 1);
    } else if (document.addEventListener) {//W3C
        addEvent(document, 'DOMContentLoaded', function () {
            fn();
            removeEvent(document, 'DOMContentLoaded', arguments.callee);
        });
    } else if (sys.ie && sys.ie < 9){
        var timer = null;
        timer = setInterval(function () {
            try {
                document.documentElement.doScroll('left');
                doReady();
            } catch (e) {};
        }, 1);
    }
}
//滚动条固定
function fixedScroll() {
    window.scrollTo(fixedScroll.left, fixedScroll.top);
}
//获取滚动条位置
function getScroll(){
    return{
        top: document.documentElement.scrollTop||document.body.scrollTop,
        left:document.documentElement.scrollLeft||document.body.scrollLeft
    }
}
function addEvent  (obj,type,fn){              //跨浏览器事件绑定
    if(obj.addEventListener!=undefined){
        obj.addEventListener(type,fn,false);
    } else {
        if(!obj.events)obj.events={};//创建一个存放事件哈希表
        if(!obj.events[type]){         //第一次创建时 创建一个存放事件的数组
            obj.events[type]=[];
            if(obj["on"+type])obj.events[type][0]=fn; //把第一次创建的事件存放在第一个位置
        }else{
            if(addEvent.contrast(obj.events[type],fn))return false;
        }
        obj.events[type][addEvent.id++]=fn;
        obj["on"+type]=addEvent.exec;
        }
};
//为每个事件分配计数器
addEvent.id=1;
//执行事件函数
addEvent.exec=function(event){
    var e=event||addEvent.fixEvent(window.event);
    var es=this.events[e.type];
     for(var i in es){
            es[i].call(this,e);}
};
//比较是否有重复注册函数并屏蔽
addEvent.contrast=function(es,fn){
    for(var i in es){
       if(es[i]==fn)return true;
    };
    return false;
};
//将IE中的常用Event对象匹配到w3cEvent对象中去
addEvent.fixEvent=function(event){
    event.preventDefault=addEvetn.fixEvent.preventDefault;
    event.stopPropagation=addEvent.fixEvent.stopPropagation;
    return event;
};
//IE取消默认行为
addEvent.fixEvent.preventDefault=function(){
    this.returnValue=false;
};
//IE取消冒泡
addEvent.fixEvent.stopPropagation=function(){
    this.cancelBubble=true;
};
function removeEvent(obj,type,fn){
    if(typeof obj.removeEventListener!=undefined){
        obj.removeEventListener(type,fn,false)
    }else{
        if(obj.events[type]){
        for (var i in obj.events[type]){
            if(obj.events[type][i]==fn){
                delete obj.events[type][i];
            }
        }}
    }
};
//跨浏览器获取style
function getStyle(element, attr) {
    var value;
    if (typeof window.getComputedStyle != 'undefined') {//W3C
        value = window.getComputedStyle(element, null)[attr];
    } else if (typeof element.currentStyle != 'undeinfed') {//IE
        value = elemenStylet.currentStyle[attr];
    }
    return value;
}
function getInner(){                //跨浏览器获取视窗
    if(document.documentElement.clientWidth){
        return {
            width: document.documentElement.clientWidth,

            height: document.documentElement.clientHeight
        }
    } else{
        return {
            width: window.innerWidth,
            height:window.innerHeight
        }
    }
};
//删除左右空格
function trim(str){
    return str.replace(/(^\s*)|(\s*$)/g,"");
}
//查询css








