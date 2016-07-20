var $ = function(args) { //new新对象 防止重复
    return new Base(args);
};

function Base(args) { // Base对象
    this.elements = [];
    //模拟Css选择器选择
    if (typeof args == "string") {
        if (args.indexOf(" ") != -1) {
            var temp = args.split(" ");
            var node = []; //存放父节点
            var childElement = []; //临时数组
            for (var i = 0; i < temp.length; i++) {
                if (node.length == 0) node.push(document);
                switch (temp[i].charAt(0)) {
                    case '#':
                        childElement = [];
                        childElement.push(this.$id(temp[i].substring(1)));
                        node = childElement;
                        break;
                    case '.':
                        childElement = [];
                        for (var j = 0; j < node.length; j++) {
                            var element = this.$class(temp[i].substring(1), node[j]);
                            for (var k = 0; k < element.length; k++) {
                                childElement.push(element[k]);
                            }
                        }
                        node = childElement;
                        break;
                    default:
                        childElement = [];
                        for (var j = 0; j < node.length; j++) {
                            var element = this.$tag(temp[i], node[j]);
                            for (var k = 0; k < element.length; k++) {
                                childElement.push(element[k]);
                            }
                        }
                        node = childElement;
                }
                this.elements = childElement;
            }
        } else {
            switch (args.charAt(0)) {
                case '#':
                    this.elements.push(this.$id(args.substring(1)));
                    break;
                case '.':
                    this.elements = this.$class(args.substring(1));
                    break;
                default:
                    this.elements = this.$tag(args);
            }
        }
    } else if (typeof args == "object") {
        if (args != undefined) {
            this.elements[0] = args;
        }
    } else if (typeof args == "function") {
        this.ready(args);
    }
};
//dom加载
Base.prototype.ready = function(fn) {
    addDomLoaded(fn);
};
//
Base.prototype.next=function(){
    for(var i=0;i<this.elements.length;i++){
        this.elements[i]=this.elements[i].nextSibling;
        if(this.elements[i].nodeType==3){
            this.next();
        }
    }
    return this;
}
// 动画
Base.prototype.animate = function(obj) {
        for (var i = 0; i < this.elements.length; i++) {
            var element = this.elements[i];
            var attr = obj.attr == "x" && "left" || obj.attr == "y" && "top" || obj.attr == "h" && "height" || obj.attr == "w" && width || obj.attr == "o" && "opacity" || !!obj.attr && obj.attr || "left";
            var start = obj.start!=undefined?obj.start:
                                        attr=='opacity'?parseFloat(getStyle(element,attr))*100:parseInt(getStyle(element,attr));
            var step = obj.step;
            var alter = obj.alter;
            var target = obj.target;
            var n = 1;
            var t=obj.t||30;
            var mul = obj['mul'];
            if (mul == undefined) {
                mul = {};
                mul[attr] = target;
            }
            var speed = obj.speed || 6;
            if (start > target) {
                step = -step;
            }
            if (attr == 'opacity' ) {
                element.style.opacity = parseInt(start) / 100;
                element.style.filter = 'alpha(opacity=' + parseInt(start) + ')';
            }
            if (alter != undefined && target == undefined) {
                target = alter + start;
            } else if (alter == undefined && target == undefined && mul == undefined) {
                throw new Error('alter增量或target目标量必须传一个！');
            }
            var type = obj.type == 0 && "constant" || obj.type == 1 && "buffer" || 'buffer';
            /*var E = function() {
                throw new Error('alter增量或target目标量必须传一个！')
            };
            target || alter || start || E();*/
            //目标量 增量 开始值中至少有一个存在 不然报错
            clearInterval(element.timer);
            element.timer = setInterval(function() {
                var flag = true;
                var style = getStyle(element, attr);
                for (var i in mul) {
                    attr = i == 'x' ? 'left' : i == 'y' ? 'top' : i == 'w' ? 'width' : i == 'h' ? 'height' : i == 'o' ? 'opacity' : i != undefined ? i : 'left';
                    target = parseInt(mul[i]);
                    if (type == "buffer") {
                        step = attr == 'opacity' ? (target - parseFloat(getStyle(element, attr)) * 100) / speed : (target - parseInt(getStyle(element, attr))) / speed;
                        step = step > 0 ? Math.ceil(step) : Math.floor(step);
                    }
                    if (attr == "opacity") {
                        /*                        $().$id("A").innerHTML +=target +"</br>"+ step+"</br>"+(start + step) / 100+"</br>";
                         */
                        if (step == 0) {
                        setOpacity();
                    } else if (step > 0 && Math.abs(parseFloat(getStyle(element, attr)) * 100 - target) <= step) {
                        setOpacity();
                    } else if (step < 0 && (parseFloat(getStyle(element, attr)) * 100 - target) <= Math.abs(step)) {
                        setOpacity();
                    } else {
                        var temp = parseFloat(getStyle(element, attr)) * 100;
                        element.style.opacity = parseInt(temp + step) / 100;
                        element.style.filter = 'alpha(opacity=' + parseInt(temp + step) + ')';
                    }
                        /*                         $().$id("A").innerHTML +="</br>"+parseInt(target) +"-"+parseInt(parseFloat(getStyle(element, attr)) * 100)+"</br>";
                         */
                        if (parseInt(target) != parseInt(parseFloat(getStyle(element, attr)) * 100)) flag = false;
                    } else {
                        /*  element.style[attr] = parseInt(style) + step + "px";
                          if (step > 0 && parseInt(element.style[attr]) >= parseInt(target)) {
                              clearInterval(element.timer); $("#explore").css("display","none")
                          } else if (step < 0 && parseInt(element.style[attr]) <= parseInt(target)) {
                              clearInterval(element.timer);
                          }*/
                        if (step == 0) {
                            setTarget();
                        } else if (step > 0 && Math.abs(parseInt(getStyle(element, attr)) - target) <= step) {
                            setTarget();
                            $().$id("A").innerHTML += "最后计算1" + "</br>";
                        } else if (step < 0 && Math.abs(parseInt(getStyle(element, attr)) - target) <= Math.abs(step)) {
                            setTarget();
                            $().$id("A").innerHTML += "最后计算2" + "</br>";
                        } else {
                            element.style[attr] = parseInt(getStyle(element, attr)) + step + 'px';
                        }
                        if (parseInt(target) != parseInt(getStyle(element, attr))) flag = false;
                        /*                                                 $().$id("A").innerHTML +="</br>"+attr+parseInt(target) +"-"+parseInt(parseFloat(style))+"</br>";
                         */
                    }
                    /*                $().$id("A").innerHTML += "属性值" + attr + "为：" + parseFloat(element.style[attr])+"-"+target+"--步长"+step +"--"+flag+ "</br>";
                     */
                }
                if (flag) {
                    clearInterval(element.timer);
                    if (obj.fn != undefined) obj.fn();
                }
            }, t);
        }

        function setTarget() {
            element.style[attr] = target + 'px';
        }

        function setOpacity() {
            element.style.opacity = parseInt(target) / 100;
            element.style.filter = 'alpha(opacity=' + parseInt(target) + ')';
        }
        return this;
    }
//切换
Base.prototype.toggle=function(){

    for(var i=0;i<this.elements.length;i++){
       (function(element,args){
        var count=0;
        var last=args[args.length-1];
        var event=typeof last=="string"?last:"click";
        addEvent(element,event,function(){
           args[count++ % args.length].call(this);
        })
       })(this.elements[i],arguments);
        }
    return this;
}
    //查找

Base.prototype.find = function(str) {
    var childElements = [];
    for (var i = 0; i < this.elements.length; i++) {
        switch (str.charAt(0)) {
            case '#':
                childElements.push(this.$id(str.substring(1)));
                break;
            case '.':
                var temps = this.$class(str.substring(1), this.elements[i]);
                for (var j = 0; j < temps.length; j++) {
                    childElements.push(temps[j]); //这里数组的赋值用循环添加至另一数组的方法以免在外部循环时被覆盖
                }
                break;
            default:
                var temps = this.$tag(str, this.elements[i]);
                for (var j = 0; j < temps.length; j++) {
                    childElements.push(temps[j]);
                }
        }
    }
    this.elements = childElements;
    return this;
}
Base.prototype.$id = function(id) { //id选择器
    return document.getElementById(id);
};
Base.prototype.$tag = function(tag, parentNode) { //标签选择器
    var node = null;
    var temp = [];
    if (parentNode != undefined) {
        node = parentNode;
    } else {
        node = document;
    }
    temp = node.getElementsByTagName(tag);
    return temp;
};
Base.prototype.$class = function(className, parentNode) { //class选择器
    var node = null;
    var temps = [];
    if (parentNode != undefined) {
        node = parentNode;
    } else {
        node = document;
    }
    var all = node.getElementsByTagName('*');
    for (var i = 0; i < all.length; i++) {
        if ((new RegExp('(\\s|^)' + className + '(\\s|$)')).test(all[i].className)) {
            temps.push(all[i]);
        }
    }
    return temps;
};
/*Base.prototype.GetElementss=function(num){
    var element=this.elements[num];
    this.elements=[];
    this.elements[0]=element;
    return this;
  };*/
Base.prototype.getElement = function(num) { //获取某个节点 返回节点对象
    return this.elements[num];
}
Base.prototype.eq = function(num) { // 获取单个节点返回Base对象
    var element = this.elements[num - 1];
    this.elements = [];
    this.elements[0] = element;
    return this;
};
Base.prototype.css = function(attr, value) { //设置获取css
    for (var i = 0; i < this.elements.length; i++) {
        if (arguments.length == 1) {
            if (typeof window.getComputedStyle != "undefined") //外联获取兼容
            {
                return window.getComputedStyle(this.elements[i], null)[attr];
            } else if (typeof this.elements[i].currentStyle != "undefined") {
                return this.elements[i].currentStyle[attr];
            }
        }
        this.elements[i].style[attr] = value;
    }
    return this;
};
Base.prototype.html = function(str) { //设置 获取innerhtml
    for (var i = 0; i < this.elements.length; i++) {
        if (arguments.length == 0) {
            return this.elements[i].innerHTML;
        }
        this.elements[i].innerHTML = str;
    }
    return this;
};
Base.prototype.addClass = function(className) { //添加classname
    for (var i = 0; i < this.elements.length; i++) {
        if (!this.elements[i].className.match(new RegExp("(\\s|^)" + className + "(\\s|$)"))) {
            this.elements[i].className += " " + className
        }
    }
    return this;
};
Base.prototype.removeClass = function(className) { //移除classname
    for (var i = 0; i < this.elements.length; i++) {
        if (this.elements[i].className.match(new RegExp("(\\s|^)" + className + "(\\s|$)"))) {
            this.elements[i].className = this.elements[i].className.replace(new RegExp("(\\s|^)" + className + "(\\s|$)", ""), "")
        }
    }
    return this;
};
Base.prototype.addRule = function(num, selectorText, cssText, position) { //添加外联css属性
    var sheet = document.styleSheets[num];
    if (typeof sheet.insertRule != "undefined") {
        sheet.insertRule(selectorText + "{" + cssText + "}", position);
    } else if (typeof sheet.addRule != "undefined") {
        sheet.addRule(selectorText, cssText, position);
    }
    return this;
};
Base.prototype.hover = function(over, out) { //鼠标hover事件
    for (var i = 0; i < this.elements.length; i++) {
        this.elements[i].onmouseover = over;
        this.elements[i].onmouseout = out;
    }
    return this;
};
Base.prototype.click = function(fn) { //鼠标点击事件
    for (var i = 0; i < this.elements.length; i++) {
        this.elements[i].onclick = fn;
    }
    return this;
};
Base.prototype.center = function(height, width) { //屏幕中心
    var top = (document.documentElement.clientHeight - height) / 2;
    var left = (document.documentElement.clientWidth - width) / 2;
    for (var i = 0; i < this.elements.length; i++) {
        this.elements[i].style.top = top + "px";
        this.elements[i].style.left = left + "px";
    }
    return this;
};
Base.prototype.lock = function() { //锁屏
    for (var i = 0; i < this.elements.length; i++) {
        this.elements[i].style.height = getInner().height + "px";
        this.elements[i].style.width = getInner().width + "px";
        this.elements[i].style.display = "block";
        document.documentElement.style.overflow = 'hidden';
        addEvent(window, 'scroll', fixedScroll);
    }
    return this;
};
Base.prototype.unlock = function() {
    for (var i = 0; i < this.elements.length; i++) {
        this.elements[i].style.display = 'none';
        document.documentElement.style.overflow = 'auto';
    }
    return this;
};
//设置显示
Base.prototype.show = function() {
    for (var i = 0; i < this.elements.length; i++) {
        this.elements[i].style.display = 'block';
    }
    return this;
};
//设置隐藏
Base.prototype.hide = function() {
    for (var i = 0; i < this.elements.length; i++) {
        this.elements[i].style.display = 'none';
    }
    return this;
};

//触发浏览器窗口事件
Base.prototype.resize = function(fn) {
    for (var i = 0; i < this.elements.length; i++) {
        var element = this.elements[i];
        window.onresize = function() {
            fn();
            if (element.offsetLeft > getInner().width - element.offsetWidth) {
                element.style.left = getInner().width - element.offsetWidth + 'px';
            }
            if (element.offsetTop > getInner().height - element.offsetHeight) {
                element.style.top = getInner().height - element.offsetHeight + 'px';
            }
        };
    }
    return this;
};
//插件入口
Base.prototype.extend = function(name, fn) {
    Base.prototype[name] = fn;
};
