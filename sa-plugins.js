/*
* @Author: Sanagi
* @Date:   2017-12-01 15:49:58
* @Last Modified by:   Marte
* @Last Modified time: 2017-12-18 10:50:33
*/

// 公共方法


//之所以要用个函数设置 css 而不是用 dom.styleText 是为了防止 style样式冲突或异常覆盖问题
//虽然没遇到过╮(╯_╰)╭

//随机颜色
function randomColor(){
  var colorStr="";
  //字符串的每一字符的范围
  var randomArr=['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];
  //产生一个六位的字符串
  for(var i=0;i<6;i++){
      //15是范围上限，0是范围下限，两个函数保证产生出来的随机数是整数
      colorStr+=randomArr[Math.ceil(Math.random()*(15-0)+0)];
  }
  return "#"+colorStr;
}

//转换css key
function transCssKey(key){
  return key.replace(/_/g,"-")
}

//转换css value
function tranCssValue(v){
  if(typeof v == "string"){
    v = parseFloat(v.replace("/\%|px|em/g",""))
  }
  return v
}

//判断数组对象[{}] 的key 值是否存在
function checkObjValue(list,key,value){
  for(var i=0;i<list.length;i++){
    if(list[i][key] == value) return true;
  }
  return false;
}

//判断mac 是否合法
function checkMac(text){
  var pattern = /[0-9a-fA-F]{2}\:[0-9a-fA-F]{2}\:[0-9a-fA-F]{2}\:[0-9a-fA-F]{2}\:[0-9a-fA-F]{2}\:[0-9a-fA-F]{2}/
  return pattern.test(text)
}
//判断email是否合法
function checkEmail(text){
  var pattern = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
      res = pattern.test(text)
  return res
}

//判断手机号码是否合法
function checkPhoneNum(text){
  var pattern = /[^0-9]/;
  if(pattern.test(text))
    return "手机号码只能是数字哟~"

  if(!text || text.split("").length != 11)
    return "手机号码必须是11位的数字哟~"

  return 0;
}

//获取对象的值
//list 为数组，key 为需要去除的key ， type 为最终获取的值的类型
function getObjValue(list,key,type){

  var result = [];
  for(var i =0;i<list.length;i++){
    //如果key 是数组，则返回多个对象【数组形式】
    if(typeof key != "string"){
      var obj = {};
      //取出每个key 列表的值，并且付给 obj[key]
      for(var j=0;j<key.length;j++){
        obj[key[j]] = list[i][key[j]];
      }
      result.push(obj);
    }else{
      var v = list[i][key]
      if(type == "int")
        v = parseInt(v);

      result.push(v)
    }
  }
  return result;
}

//读取或保存JSON
function localSave(key,value){
  if(arguments.length == 1){
    return $.parseJSON(localStorage.getItem(key));
  }else if(arguments.length == 2){
    localStorage.setItem(key,JSON.stringify(value));
  }
}

//批量设置 element 的CSS
function setStyle($ele,list){
  if(!$ele || ! list) return ;
  if(list instanceof Array){
    for(var i=0;i<list.length;i++){
      var l = list[i].split(":");
      $ele.css(l[0],l[1]);
    }
  }else if(typeof list == "object"){
    for(var key in list){
      $ele.css(transCssKey(key) , list[key])
    }
  }
}

//数字滚动插件 2.0
//可以个性化配置
 ;(function($){
  $.fn.numberScroll = function(){
    var option = {
        number:0,
        formatNum:"",
        numList:[],
        limit:3,    //分隔符的边界设置
        hasDot:true,
        Dot:",",
        width:"20px",
        height:"54px",
        speed:1000,
        style:{
            list_style:"none",
            overflow: "hidden",
            display:"block",
            height:"100%",
            line_height:"52px",
            font_size:"36px",
            position:"relative",
            left:"0px",
            right:"0px",
            top:"0px",
            bottom:"0px",
            margin: "auto",
            padding:"0",
            font_family: 'Microsoft YaHei',
            text_align:"center",
            color:"#ffd323",
            opacity:1,
            background_color:"rgba(0,0,0,0.6)",
        }},
        options = {},
        //当前的 numberScroll option
        selfOpt,that,limit;

    var init = function(n,that,selfOpt){
      var num =  n || selfOpt.number;
      selfOpt.numList = num.toString().split(""),
      selfOpt.formatNumList = numFormat(num,selfOpt),
      formatNumLen = selfOpt.formatNumList.length;

      buildHtml(that,selfOpt);
    }

    //num format 加逗号
    function numFormat(n,selfOpt){
      var numList = arguments.length >0?n.toString().split(""): selfOpt.numList.slice(),
          numLen = numList.length,
          limit = selfOpt.limit,
          firstPos = numLen % limit,
          count = parseInt(firstPos % limit >0?numLen / limit: numLen / limit -1);  //如果 numlen % limit 大于0 则 分隔符数量 == numLen / limit

      //如果firstPos 为0 则需要多计算一次
      if(firstPos == 0) count ++;
      //至少达到分割符的限制
      if(numLen > limit){
        //从中插入 dot
        for(var i=0,dotCount=0;i<count;i++){
          if(firstPos + i * limit +dotCount >0){
            // firstPos + i*limit + dotCount == 当前分隔符的位置
            numList.splice(firstPos + i * limit +dotCount ,0,selfOpt.Dot);
            dotCount ++;
          }
        }
      }

      return numList;
    }

    //生成html
    var buildHtml = function(that,selfOpt){
      var li="",
          div="",
          w = tranCssValue(selfOpt.width),
          h = tranCssValue(selfOpt.height),
          numList = selfOpt.formatNumList;
          //数字 bar
      var liHtml = '<li class="num" style="left:{{l}}px;width:{{w}}px; height:1000%;position:absolute;">{{div}}</li>'
              .replace("{{w}}",w  ),

          //分隔符
          liDotHtml = '<li class="dot" style="left:{{l}}px;width:{{w}}px; height:100%;position:absolute;">&#44;</li>'
              .replace("{{w}}",w),

          //单个数字
          divHtml = '<div style="width:{{w}}px;height:10%">{{num}}</div>'
              .replace("{{w}}",w ).replace("{{h}}",h );


      for(var j=0;j<10;j++){
        div += divHtml.replace("{{num}}",j)
      }

      for(var i=0;i<formatNumLen;i++){
        if(numList[i] === ","){
          li+= liDotHtml.replace("{{l}}",i * w).replace("{{w}}",w);
        }
        else{
          li += liHtml.replace("{{l}}",i * w).replace("{{w}}",w).replace("{{div}}",div);
        }
      }

      that.html("");
      that.append(li);
      setStyle(that,selfOpt.style);
      that.css({height:h})
      that.css({width:formatNumLen*w + "px"})
      that.fadeIn(1000,function(){
        move(that,selfOpt);
      });
    }

    //设置数字
    var setNum = function(num,that,selfOpt){
      var num = parseInt(num),
          nList =  numFormat(num,selfOpt),
          formatNumLen = nList.length;

      selfOpt.number = num;
      selfOpt.numList = num.toString().split("");
      selfOpt.formatNumList = nList;

      if(that.find(">li").length != formatNumLen){
        that.fadeOut(1000,function(){
            init(num,that,selfOpt);
        })
      }else{
        move(that,selfOpt);
      }

    }

    //移动
    var move = function(that,selfOpt){
      var speed = selfOpt.speed || 1000,
          numList = selfOpt.formatNumList,
          that = that,
          h = tranCssValue(selfOpt.height);

      for(var i=0;i<formatNumLen;i++){
        var n = parseInt(numList[i]);

        if(n == NaN) continue ;
        that.find(">li").eq(i).animate({"top":-n* h +"px"});
      }
    }

    var main = function(command,arg){
      //初始化该插件的配置（不同插件可存储不同配置）
      //_style 配置需要将新旧组合起来
      //id 用来标识插件的ID 和配置
      that = this,selfOpt;
      var id = that.attr("id"),
          formatNumLen;
          console.log(id)
      //将当前的配置取出，方便操作
      if(!options[id])
        selfOpt = options[id] = $.extend(true,{},option);
      else
        selfOpt = options[id];

      if(command == "init" || arguments.length ==0){
        //配置
        var config = arg;
        for(var key in config){
          if(key != "style"){
            selfOpt[key] = config[key];

          }else{
            //配置style
            for(var k in config.style)
              selfOpt.style[k] = config.style[k];

          }
        }
        init(parseInt(arg),that,selfOpt);

      }
      if(command == "set"){
        setNum(parseInt(arg),that,selfOpt);

      }
      return that;
    }

    return main;
  }();
})($);

//滚动广告栏
;(function($){
  $.fn.sa_carousel = function(){
    var style = [
          "width:100%",
          "height:100%",
          "overflow:hidden",
          "position:relative",
        ],
        item_style = [
          "position:absolute",
          "height:100%",
        ],
        item_inner_style = [
          "position:relative",
          "padding-left:10px",
          "padding-right:10px",
          "margin:0 auto",
          "height:100%",
          "float:left",
        ],


        styleList = {},
        item_StyleList = {},
        item_InnerStyleList = {},
        innerLimit = {},
        w = {},     //各个 carousel box 的宽度
        index = {}, // carousel 标识
        intervalTime = {},
        direct = {},  //移动方向
        interv = {}; //自动翻滚的计时器

    //html 样式
    var carHtml = '<div class="sa-carousel"></div>',
        carItemHtml = '<div class="sa-carousel-item"></div>',
        carItemInnerHtml = '<div class="sa-carousel-item-inner"></div>';

    //插件主函数
    function main(command,args){
      var that = this,
          id = that.attr("id");

      w[id] = that.width();
      innerLimit[id] = 3;

      function init(option){
        var $carousel = $(carHtml);

        if(!id && id!=0) {
          console.log("sa-carousel id 不存在")
          return ;
        }
        styleList[id]  = [].concat(style);
        item_StyleList[id] = [].concat(item_style);
        item_InnerStyleList[id] = [].concat(item_inner_style);
        index[id] = 0;
        intervalTime[id] = 6000;
        direct[id] = "left";


        if(option){
          for(key in option){
            if("style" == key){
              $(styleList[id],option.style);
            }
            else if("item_style" == key){
              $(item_StyleList,option["item_style"]);
            }
            else if("item_inner_style" == key){
              $(item_InnerStyleList[id],option["item_inner_style"]);
            }
            //调用编译器，查看key 是否属于可用参数
            else if(eval(key) != "undefined"){
              eval(key)[id] = option[key];
            }else{
              console.log("sa-carousel 未能识别参数> "+key);
            }
          }
        }

        that.html(" ");
        setStyle($carousel,styleList[id])
        that.append($carousel);
        interv[id] = setInterval(autoMove,intervalTime[id])
      }

      //移动，并清除空inner
      function autoMove(){
        clearEmptyInner() //每次移动先把空的 inner 清除
        var $item = $(".sa-carousel-item"),
              $itemInner = $item.find(".sa-carousel-item-inner")
          //只有当内容大于一页的时候才翻转
          if($itemInner.length > innerLimit[id]){
            //往左边移动，并且判断是否到达边界
            //如果到达边界则会跳转到另一边
            if(direct[id] == "left"){
              index[id]++;
              if(index[id] >= Math.ceil($itemInner.length /innerLimit[id]) ){
                index[id] = 0;
              }
            }else if(direct[id] == "right"){
              index[id]--;
              if(index[id] < 0){
                index[id] = $item.length - 1;
              }
            }
            $item.animate({"left":-index[id] *w[id] + "px"})
          }
      }

      //清除空的 inner
      //清除空 inner 的同时会重新定位到 left:0px;
      //这是为了防止删除多个inner 时 ，卡住
      function clearEmptyInner(){
        $inners = that.find(".sa-carousel-item-inner");
        for(var i=0;i<$inners.length;i++){
          if($inners.eq(i).find(">*").length == 0){
            $inners.eq(i).remove();
            that.find(".sa-carousel-item").css("left","0px");
          }
        }
      }

      //添加 元素，并给元素套上 inner标签
      function add($el,i){
        var $carousel = that.find(".sa-carousel"),
            $item = $carousel.find(".sa-carousel-item"),
            $inner = $(carItemInnerHtml);

        if($carousel.length < 1) return ;
        //取得i对应的item
        if($item.length == 0){
          $item = $(carItemHtml);
          setStyle($item,item_StyleList[id]);
          $carousel.append($item);
        }


        $inner.append($el);
        $item.append($inner);
        setStyle($inner,item_InnerStyleList[id]);

        $inner.css("width",w[id] / innerLimit[id]);
        $item.css("width",that.find(".sa-carousel-item-inner").length*w[id]);
      }

      function remove(i){
        that.find(".sa-carousel-item-inner").eq(i).remove();
      }

    if(command == "add" ){
        add(args);
      }else if(command == "remove"){
        remove(args);
      }else if(command == "init"){
        init();
      }
      return that;
    }

    return main;
  }();
})($);
