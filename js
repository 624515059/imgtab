/**
 * 
 * @authors LL
 * @date    2016-04-06 13:53:27
 * @version $Id$
 */
 
;(function($){

    var ImgTab = (function(){

        function ImgTab(element,options){
            this.settings= $.extend(true,$.fn.ImgTab.defaults, options|| {});  //合并参数  默认配置、用户传递的参数
            this.element=element;
            this.init();//初始化插件
        }

        ImgTab.prototype = {

            init:function(){

                var me = this;//this指向实例 函数本身，但是缓存了下，this应该指向方法本身  init 对象吧...
                //调用这个插件的html代码
                el = me.element;
                me.settings = me.settings;
                //获取元素、设置样式
                ul = el.find(me.settings.items);
                li = el.find(me.settings.item);
                me.i = 0;
                me.max = [el.outerWidth()||0,el.outerHeight()||0];
                li.each(function(){
                    width = $(this).outerWidth();
                    height= $(this).outerHeight();
                    if(width > me.max[0]) me.max[0] = width;
                    if(height > me.max[1]) me.max[1] = height;
                })
                el.css({width: me.max[0], height: li.first().outerHeight(), overflow: 'hidden'});  
                ul.css({position: 'relative', left: 0, width: ( li.outerWidth() * li.length ) + 'px'});
                li.css({'float': 'left', width: (me.max[0]) + 'px'});

                //轮播
                me.settings.autoplay && setTimeout(function(){
                    //调轮播方法
                    me.play();
                    //  判断是否鼠标停留暂停
                    if (me.settings.pause) {
                        me.element.on('mouseover mouseout', function(e) {
                            me.stop();
                            e.type === 'mouseout' && me.play();
                        });
                    };
                },me.settings.init);

                //下方点导航
                me.settings.dots && me.nav('dot');

                //左右箭头
                me.settings.arrows && me.nav('arrow');

            },

            //自动执行动画
            play:function() {
                var me = this;
                me.t = setInterval(function() {
                    me.to(me.i + 1);
                }, me.settings.delay);
            },

            //停止执行动画
            stop:function() {
                var me = this;
                me.t = clearInterval(me.t);
                return me;
            },

            //动画逻辑
            to:function(index){
                var me = this;
                el = me.element;
                ul = el.find(me.settings.items);

                if(me.t) {//定时器标记
                    me.stop();
                    me.play();
                };
                current = me.i;//当前动画
                target  = li.eq(index);//当前点击

                //  判断无限循环是否true 和  target是否取到   判断是否越界
                if ((!target.length || index < 0) &&  me.settings.loop === false) return;
                if (!target.length) index = 0;
                if (index < 0) index = li.length - 1;
                
                var speed = me.settings.speed,//速度
                    easing = me.settings.easing;//轮播样式

                if (!ul.queue('fx').length) {//队列控制
                    el.find('.dot').eq(index).addClass('active').siblings().removeClass('active');
                    ul.animate({left: '-' + (index*me.max[0]) + 'px'}, speed, easing, function() {
                        me.i = index;
                    });
                };
            },

            //创建导航
            nav:function (name, html) {
                var me = this;
                if (name == 'dot') {
                    html = '<ol class="dots">';
                        $.each(li, function(index) {
                            html += '<li class="' + (index === me.i ? name + ' active' : name) + '">' + ++index + '</li>';
                        });
                    html += '</ol>';
                } else {
                    html = '<div class="';
                    html = html + name + 's">' + html + name + ' prev">' + me.settings.prev + '</div>' + html + name + ' next">' + me.settings.next + '</div></div>';
                };

                el.addClass('has-' + name + 's').append(html).find('.' + name).click(function() {
                    $(this).hasClass('dot') ? me.stop().to($(this).index()) : $(this).hasClass('prev') ? me.prev() : me.next();
                    //如有有dot先停止支然后再运动并传个当前的索引      否则  有左 则右 或者左
                });
            },

            //左箭头
            prev:function(){
                var me = this;
                return me.to(me.i - 1);
            },

            //右箭头
            next:function(){
                var me = this;
                return me.to(me.i + 1);
            }

        }

        return ImgTab;

    })();


    $.fn.ImgTab=function(options){

        return this.each(function () {//这里的this 就是 jQuery对象。这里return 为了支持链式调用
            var me = $(this),   //获取当前dom 的 jQuery对象，这里的this是当前循环的dom
                instance = me.data("ImgTab");//存放这个插件的实例
            if(!instance){//如果实例为空，则创建这个实例
                instance = new ImgTab(me,options);//$(this),用户配置的参数
                me.data("ImgTab",instance);//将这个实例存放在ImgTab
            }
            if($.type(options) ==="string") return instance[options]();//如果返回的字符串,返回实例.实现插件的调用
        })

    };

    $.fn.ImgTab.defaults={
        speed: 500,     // 点击滚动速度
        delay: 3000,    // 滚动间隔
        pause: true,    //鼠标停留暂停    
        loop: true,     //无线循环      
        dots: true,    // 点导航   
        arrows: false,  // 左右箭头导航 
        item: 'li',    // 布局元素
        items: 'ul',   // 布局元素
        easing: 'swing',//滚动方式
        autoplay: true,  //自动滚动
        init: 0,         // 默认多久后开始轮播(毫秒为单位)
        prev:"<",       //左侧内容
        next:">"        //右侧内容
    };

})(jQuery);
