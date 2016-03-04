/**
*loginWin : 注册、登录弹窗
*author：wangfei
*功能：实现官网注册、登录功能。
*说明：独立构建此模块，意在便于公用。为官网废除侧边栏登录做好迁移准备
*/

define("js/g/loginWin",[],function(require,exports,module){
    var loginWinModule={},
        Component = {},
        CssCollection;
    //样式收集器，动态生成样式  
    CssCollection = {
        styleFragments:[],
        addStyle:function(styleString){
            this.styleFragments.push(styleString);
            return this;
        },
        writeToHead:function(){
            var styleEle = $('<style>').attr('id','loginWinStyle');
            styleEle.append('/*this style defined in loginWin.js*/');
            styleEle.append(this.styleFragments.join('\n'));
            $('head').eq(0).append(styleEle);
        }
    }


    //组件基类
    function BaseComponent(_constructor){
        var newCls = _constructor||function(){};
        newCls.prototype.load = load;
        newCls.prototype.setStyle = function(styleObj){
            this.el.css(styleObj);
        }
        //扩展类方法
        newCls.extend = function(methods){
            $.extend(newCls.prototype,methods);
        }
        return newCls;
    }

    function load(elements){ //载入组件函数
        var _this = this;
        if($.isArray(elements)){
           $.each(elements,function(index,component){
                _this.el.append(component.el);
           }); 
        }else{
            this.el.append(elements.el);
        }
    }

    Component.Container = new BaseComponent(function(styleObj){
        this.el = $('<div>').css(styleObj);
    });

    //按钮构造类
    Component.Btn = new BaseComponent(function(styleObj){
        this.el = $('<a>')
        .attr('href','javascript:void(0)')
        .css({display:'inline-block',position:'relative'})
        .css(styleObj);

        this.textSpan = $('<span>').css({position:'absolute',left:0,top:0,zIndex:2,width:'100%',height:'100%',textAlign:'center'});
        this.el.append(this.textSpan);
        this.text = function(text){
            this.textSpan.text(text);
        }
        this.sucCallBack = function(){};
        this.failCallBack = function(){};
    });

    //创建登陆窗口类
    Component.loginWinContainer = new BaseComponent(function(pram){
        var winContainer= $('<div>'),
        pram = pram||{},
        defaultSetting = {
            width:400,
            height:400,
            zIndex: 9999,
            boxShadow:'1px 1px 4px solid #555'
        };

        pram&&$.extend(defaultSetting,pram);
        winContainer
        .css({ //初始化样式（居中处理）
            position: 'fixed',
            left: '50%',
            top: '50%',
            marginLeft: -defaultSetting.width/2,
            marginTop: -defaultSetting.height/2,
        })
        //个性化定制
        .css(defaultSetting);

        this.masker = {
            createMasker: function(){
                $('body').append($('<div>').attr('id','loginWinMasker'));
                return $('#loginWinMasker');
            },
            setMaskerStyle: function(styleObject){
                var styleObject = styleObject||{};
                $('#loginWinMasker').css({
                    zIndex: defaultSetting.zIndex-1,
                    position:'fixed',
                    left:0,
                    top:0,
                    width:'100%',
                    height:'100%',
                    opacity:0.5,
                    background: '#000',
                    display:'none'
                }).css(styleObject);
            },
            init: function(){
                this.el = this.createMasker();
                this.setMaskerStyle();
            }
        };

        this.masker.init();

        this.el = winContainer;
    });

    Component.loginWinContainer.extend({
        show:function(){
            this.el.show();
            this.masker.el.show();
        },
        close:function(){
            this.el.hide();
            this.masker.el.hide();
        }
    })


    //验证码组件构造
    Component.verifyCode = new BaseComponent(function(){
       var codeImgUrl = 'http://account.oneplus.cn/getVerifyImage';
       this.el  = $('<div>').css({position:'relative',display:'none',overflow:'hidden',width:300,margin:'5px auto'});
       this.inputEle = new Component.textInput('text',{
            inputEle:{height:35},
            textInputContainer:{padding:0}
       });

       this.codeImg = $('<img>')
       .css({cursor: 'pointer',position:'absolute',right:0,top:0})
       .attr('alt','图片验证码')
       .attr('src',codeImgUrl);
       this.el.append(this.inputEle.el);
       this.el.append(this.codeImg);

       this.codeImg.on('click',function(){
          $(this)
          .attr('src',codeImgUrl+'?'+(+new Date()));  
       });
    });

    Component.verifyCode.extend({
        show:function(){
            this.el.show();
        },
        hide:function(){
            this.el.hide();
        }
    });

    //创建登陆窗头类
    Component.loginWinHeader = new BaseComponent(function(pram){
        var loginWinHeader = $('<h2>'),
        pram = pram||{},
        defaultSetting = {
            textAlign:'center',
            fontSize:'20px',
            padding:'20px 0'
        };

        pram&&$.extend(defaultSetting,pram);
        loginWinHeader.css(defaultSetting);
        this.el = loginWinHeader;
    });

    //创建输入框类
    Component.textInput = new BaseComponent(function(type,pram){
        pram = pram||{},_this = this;

        this.textInputContainer = $('<div>').css({
            width:300,
            padding:'5px 0',
            margin:'0 auto'
        });

        pram.textInputContainer&&this.textInputContainer.css(pram.textInputContainer);


        this.inputEleContainer = $('<div>').css({
            position:'relative'
        });
        
        pram.inputEleContainer&&this.inputEleContainer.css(pram.inputEleContainer);

        this.inputEle = $('<input>').attr('type',type).css({
            width:'100%',
            height:'40px',
            lineHeight:'40px',
            fontSize:'14px',
            textIndent:'20px',
            border:'none',
            padding:0
        });

        this.inputEle.on('focus',this.onFocus).on('blur',this.onBlur);

        pram.inputEle&&this.inputEle.css(pram.inputEle);

        this.iePlaceHolder = $('<span>').css({
            position:'absolute',
            left:0,
            top:0,
            height:'100%',
            width:'100%',
            fontSize:this.inputEle.css('fontSize'),
            lineHeight:this.inputEle.css('lineHeight'),
            textIndent:this.inputEle.css('textIndent'),
            pointerEvents:'none',
            color: '#aaa',
            display:lessThenIE9()?'block':'none'
        }).on('click',function(){
            $(this).hide();
        });

        if(lessThenIE9()){
            this.inputEle.on('blur',function(){
                 var val = $.trim($(this).val());
                 !val&&_this.iePlaceHolder.show();
            });
        }

        pram.iePlaceHolder&&this.iePlaceHolder.css(pram.iePlaceHolder);

        this.inputEleContainer
        .append(this.inputEle)
        .append(this.iePlaceHolder);


        this.textInputContainer
        .append(this.inputEleContainer);

        this.el = this.textInputContainer;

        function lessThenIE9(){
            return (navigator.userAgent.indexOf('MSIE 8.0')>-1)||(navigator.userAgent.indexOf('MSIE 9.0')>-1)
        }
    });

    Component.textInput.extend({
        setPlaceHolder:function(placeholder){
            this.inputEle.attr('placeholder',placeholder);
            this.iePlaceHolder.text(placeholder);
        },
        onFocus:function(){
            if($(this).hasClass('error')) $(this).removeClass('error');

        },
        onBlur:function(){
            var val = $.trim($(this).val());
            if(!val){
                $(this).addClass('error')   
            };
        }
    });

   //按钮类 
   Component.closeBtn = new BaseComponent(function(pram){
        var el = $('<a>').attr('href','javascript:void(0)'),
        pram = pram||{};

        el.css({
            width: 24,
            height: 24,
            lineHeight: '24px',
            textAlign: 'center',
            position: 'absolute',
            right: 10,
            top: 10
        }).css(pram);

        this.el = el;
    });

    //第三方登录
    Component.agentLogin = new BaseComponent(function(){
        this.el = $('<a>').attr('href','');
        this.masker = $('<span>').css({position:'absolute',left:0,top:0,width:'100%',height:'100%','background':'#000',opacity:0.05,zIndex:2,visibility:'hidden'});
        
        this.el.css({
            width:25,
            height:25,
            position:'relative',
            verticalAlign:'middle',
            backgroundRepeat:'no-repeat',
            backgroundPosition:'center center',
            display:'inline-block'
        });
        this.el.append(this.masker);

        this.masker
        .on('mouseover',function(){
            alert(1);
            $(this).css('visibility','visible');
        })
        .on('mouseleave',function(){
            $(this).css('visibility','hidden');
        });
    });

    Component.linkText = new BaseComponent(function(){
        this.el = $('<a>').attr('href','');
        this.el.css({
            fontSize:14,
            color:'#0083b6'
        });

        this.el
        .on('mouseover',this.mouseover)
        .on('mouseout',this.mouseout);
    });

    Component.linkText.extend({
        setUrl: function(url){
            this.el.attr('href',url);
            return this.el;
        },
        text: function(text){
            this.el.text(text);
            return this.el;           
        },
        mouseover:function(){
            $(this).css('text-decoration','underline');
        },
        mouseout:function(){
            $(this).css('text-decoration','none');  
        }
    })





    Component.agentLogin.extend({
        loadImg:function(imgSrc){
            this.el.css('background-image','url('+imgSrc+')');
        },
        setUrl:function(url){
            this.el.attr('href',url);
        }
    })


    var loginBtn = new Component.Btn({
        width:300,
        height:52,
        fontSize:'14px',
        display:'block',
        lineHeight:'52px',
        margin:'0 auto',
        background: '#eb0028',
        textAlign:'center',
        color:'#fff',
        position:'relative',
        border:'1px solid #d70226'
     });

     loginBtn.text('确 认');
     loginBtn.el.addClass('login_win_loginBtn');


     CssCollection
     .addStyle(".login_win_loginBtn:before {position:absolute;left:0;top:0;content:'';height:100%;width:1px;transition:width .15s ease 0s;-webkit-transition:width .15s ease 0s;background:#d70226}")
     .addStyle(".login_win_loginBtn:hover:before {width:100%}")

     loginBtn.el.on('click',function(){
        if(!$.trim(userName.inputEle.val())){
            userName.inputEle.addClass('error');
        };

        if(!$.trim(password.inputEle.val())){
            password.inputEle.addClass('error');
        };

        if(!$.trim(userName.inputEle.val())||!$.trim(password.inputEle.val())){
            return;
        };


        var data = {
            loginName:userName.inputEle.val(),
            passWord:password.inputEle.val(),
            source:1,
            channel:1,
            verifyCode:verifyCode&&verifyCode.inputEle.inputEle.val()
        }

        if( op.util.checkSafeSimple(data.loginName) ){
            ALERT('检测有特殊字符，请重新输入！');
            return;
        }

        //登录失败超过三次，需要验证码验证
        if( op.util.cookie.get("loginname") == data.loginName && op.util.cookie.get("loginfailed") > 3 ){
            return;
        }

        var requestUrl = op.URL.account.login; //登录请求地址
        $.post(requestUrl,data,function(d){
            if(d.ret==1){
                   loginWinModule.hide();
                   loginBtn.sucCallBack(d); 
            }else{
                errTip.echo(d.errMsg);
                   loginBtn.failCallBack(d);   
            }
        })
     });

    Component.loginWinContainer.extend({
        close: function(){
            this.el.hide();
            this.masker.el.hide();
        }
    });


    //创建登录窗口实例
    var loginWinObj = new Component.loginWinContainer({
        width:400,
        height:430,
        background:'#efefef',
        display:'none'
    });


    //创建登陆窗头实例
    var loginWinHeader = new Component.loginWinHeader();
    loginWinHeader.setStyle({
        fontSize:16,
        color:'#212121',
        padding:'45px 0 35px'
    })
    loginWinHeader.el.text('登 录');


   Component.closeBtn.extend({
        loadImg: function(imgSrc){
            this.el.css('background-image','url('+imgSrc+')')
        }
   });


    var closeBtn = new Component.closeBtn();
    closeBtn.loadImg("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAAGXcA1uAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjY2MEY4MkZGRTBGNzExRTVCMjE5QzFBRjlDRkMxMTUwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjY2MEY4MzAwRTBGNzExRTVCMjE5QzFBRjlDRkMxMTUwIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjYwRjgyRkRFMEY3MTFFNUIyMTlDMUFGOUNGQzExNTAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NjYwRjgyRkVFMEY3MTFFNUIyMTlDMUFGOUNGQzExNTAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7rOKJaAAACc0lEQVR42mJMS0tjgAEWKP0fiM8zQTmngdgQIIAYkZUxMSABFA5AAMGUgQxgRBK/AFPFiGQDCBjAJM6gKwAIIJBR2kDGVQZU4ALS8QuIFZEETwDxHpDEbSBmBmJlID4FxBbI3roDxOeAOBDd7SDLjaA6VWASIO0mUAX3oLQKQADBXHUFiNWg9uECIFMZWaBeAPlLCepxdI2noeImyI6FWQvSqApVcA4qbowzAqBgESjMgTgY6jHksEKx4RSUb4QcidBQ+A8Nx3sgG1xASQKIzdAUMyCFLTzuAAIIFEogDXsYCANwHINs6EBKBbiAKjTodZmgwcUMjXxsAOTpW0CsDsSXYaFkCHXnaSwm34PSt9CD1RwpSTBAQ+UWNCLv4IoHY6jzzkIVYSQXFixuDgLiB9CgxkhbTFg8+ABKg/x0HJ8GFagHlaGaDKHOO4NNgxLUelWktM8AjX3kgABzQCbfhSq+g8VPRsiaYJlUGYdiGABFLiso3QEEKLV8UhCEgjCur27RRkQN3GSRXaFDdaW6QF1AwkVtWhjqqlsU9B78Bh5i6qOBb+Ewzt9vRoVLZ407lG68/8SUd9JYaewVRDXzeVPKVQ6Bo0S8a3x8oN5FWSuSU7pHG8qJgSJsn9Z+boUjXV40TCqx+l10r4DFoQKbORnnVDB4YqSCDf30CWyyDECJTliSyXKNMbsrLUsYQNoWzNDtuhm7BpAeH8nyBjJ0ozNSE4cnz2sQTSWD+sHjwmJF3/BqdEtshAzhUICYu1WjD7ln1UCVFTYh79T4iO0AKae3IpuE4bUOS9Za9PbxZXymhr8PjYPGq+fXwVWE3uYTtTC+v1aqkAoJgg7UAAAAAElFTkSuQmCC");
    closeBtn.el.on('click',function(){
        loginWinObj.close();
    });


    Component.textInput.extend({
        isIE8:function(){

        }
    });

    var userName = new Component.textInput('text');
    userName.setPlaceHolder('手机、邮箱或用户名');
    userName.inputEle.addClass('login_win_input');

    var password = new Component.textInput('password');
    password.setPlaceHolder('密码');
    password.inputEle.addClass('login_win_input');

    CssCollection
    .addStyle('.login_win_input {background: #fff;}')
    .addStyle('.login_win_input.error {background: #fed9d9;}');  

    //验证码
    var verifyCode = new  Component.verifyCode();
    verifyCode.inputEle.setPlaceHolder('验证码');

    var errTipContainer = new Component.Container({
        width:300,
        margin:'0 auto',
        paddingBottom:'10px'
    });

    //错误提示组件
    var errTip = (function(){
        var component = {
            el: $('<span>'),
            setStyle:function(styleObj){
                this.el.css(styleObj);
            },
            text:function(text){
                this.el.text(text);
            },
            echo:function(errMsg){
                var _this = this;
                this.el.text(errMsg).css('opacity','1');
                if(this.st) clearTimeout(this.st);
                this.st = setTimeout(function(){
                    _this.el.css('opacity','0');
                },2000);
            },
            init:function(){
                this.setStyle({
                    height:42,
                    display:'inline-block',
                    lineHeight:'42px',
                    color:'#ff0000'
                });
                return this;
            }
        }
        return component.init();
    }());

    errTip.el.addClass('login_win_err_tip');
    CssCollection
    .addStyle(".login_win_err_tip {transition:opacity 0.5s}");

    var forgetPassword = new Component.linkText();
    forgetPassword.text('忘记密码?');
    forgetPassword.setStyle({float:'right',height:42, lineHeight:'42px'});
    forgetPassword.setUrl(op.URL.account.find);
    forgetPassword.el.attr({
        target:'_blank'        
    });

    var goRegisterContainer = new Component.Container({
        width:300,
        margin:'0 auto',
        fontSize:'14px',
        color:'#666',
        height:'40px',
        lineHeight:'40px',
    });

    var goRegisterWrapper = new Component.Container({
         padding:'5px 0 15px',
         background:'#efefef'
    });

    goRegisterWrapper.load(goRegisterContainer);

    var registerNow = new Component.linkText();
    registerNow.text('立即注册');
    registerNow.setStyle({marginLeft:'5px'});
    registerNow.setUrl(op.URL.account.regPage);
    registerNow.el.attr({
        target:'_blank'
    });

    goRegisterContainer.el.append($('<span>').text('没有一加账号?'));
    goRegisterContainer.load(registerNow);


    errTipContainer.load([errTip,forgetPassword]);

    var agentLoginContainer = new Component.Container({
        background:'#f6f6f6',
        padding:'20px 0 40px 50px'
    });

    agentLoginContainer.el.append($('<span>').text('选择快捷登录方式').css({fontSize:'14px',display:'inline-block',verticalAlign:'middle',lineHeight:'24px',color:'#666',marginRight:20}));

    var qqLogin =new Component.agentLogin();

    qqLogin.loadImg("data:image/jpg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABGAAD/4QMpaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjAtYzA2MCA2MS4xMzQ3NzcsIDIwMTAvMDIvMTItMTc6MzI6MDAgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzUgV2luZG93cyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo5MjE3M0M2NEUwRjAxMUU1QUFDMkU4MjZBNzMzMTJENiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo5MjE3M0M2NUUwRjAxMUU1QUFDMkU4MjZBNzMzMTJENiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjkyMTczQzYyRTBGMDExRTVBQUMyRTgyNkE3MzMxMkQ2IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjkyMTczQzYzRTBGMDExRTVBQUMyRTgyNkE3MzMxMkQ2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4ADkFkb2JlAGTAAAAAAf/bAIQABAMDAwMDBAMDBAYEAwQGBwUEBAUHCAYGBwYGCAoICQkJCQgKCgwMDAwMCgwMDQ0MDBERERERFBQUFBQUFBQUFAEEBQUIBwgPCgoPFA4ODhQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQU/8AAEQgAGAAYAwERAAIRAQMRAf/EAHsAAAMBAAAAAAAAAAAAAAAAAAUGBwgBAAMBAAAAAAAAAAAAAAAAAAUGBwQQAAIBAgMGBwEAAAAAAAAAAAECAxESABMEMSMUBRUGYYGRoSJSFzIRAAECAgcIAwAAAAAAAAAAAAEAAhEhMWGBEgMTBFFxkdFSkgUVQbEW/9oADAMBAAIRAxEAPwCkyyzzzuzu8k0jmpJLMzMfck4rQAAqUHc5znTmSnf8n7v6bx+5z7b+AzGz6UrTZbd4XYCe601+7OG345pk/OazLvyj0xnyikiKWeCdGR3jmjcUIJVlZT6gg4NkAipLbXOa6UiEd7J5b1Xu7lulJCok/ESE/TT7wjztpjD5DFy9M41Q4yRPxOBnatja49s1pjEzVlWZ+9uW9K7u5lpQQyPPxEZH01G9A8rqYpnj8XM0zTVDhJRry2Bk6t7a4900GXP0WsueN1eJ6SxVaNiAfkhK0IrsONhg9tNNqHC9hvmDI7rFR/2fmv8AHR4ciy23OlzK7K30r7V8cLnoMPrMdw+k4fqcWjLEIbTHipw2frdZckbs8r0iiq0jAE/FAWqTTYMMYgxtNFiTzexHyBmd9i//2Q==");    
    qqLogin.setStyle({marginRight:10});
    qqLogin.setUrl("javascript:location.href='http://account.oneplus.cn/qqlogin?state=1&jump='+location.href;");

    var weiboLogin =new Component.agentLogin();
    weiboLogin.loadImg("data:image/jpg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABGAAD/4QMpaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjAtYzA2MCA2MS4xMzQ3NzcsIDIwMTAvMDIvMTItMTc6MzI6MDAgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzUgV2luZG93cyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3NzE3RkI4MkUwRjAxMUU1QkVBRDhFNTY0RjA0MTA5QyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo3NzE3RkI4M0UwRjAxMUU1QkVBRDhFNTY0RjA0MTA5QyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjc3MTdGQjgwRTBGMDExRTVCRUFEOEU1NjRGMDQxMDlDIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjc3MTdGQjgxRTBGMDExRTVCRUFEOEU1NjRGMDQxMDlDIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4ADkFkb2JlAGTAAAAAAf/bAIQABAMDAwMDBAMDBAYEAwQGBwUEBAUHCAYGBwYGCAoICQkJCQgKCgwMDAwMCgwMDQ0MDBERERERFBQUFBQUFBQUFAEEBQUIBwgPCgoPFA4ODhQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQU/8AAEQgAGAAYAwERAAIRAQMRAf/EAHwAAAIDAQAAAAAAAAAAAAAAAAUGAQQHCAEAAQQDAAAAAAAAAAAAAAAABgMEBQcAAQgQAAICAgEEAQMFAAAAAAAAAAECAwQRBQYAIRITQTFRByJCsjMIEQACAQQBAgUFAAAAAAAAAAABAhEAIQMEBUFRMWFxgaGRsRIiBv/aAAwDAQACEQMRAD8AM2LE808s00rySuzM7sxLEk5JJPVdEkmTXSiIqqABAqK4exPFAJRH7XVPZIxVF8jjLEZwB89YLmK25CqTExRfa6Tc8ZtVJZ5UaKc+2jsaU3ugk9bYJjkX9yn6g4I6XyYnxET7EUw19rDtqwAuLMrCCJ7jz+hpx/DnCKXK99b2G1RZtXqfBmrN3Es8pbwDD5UBSSPnt0/43VGZyW8Fof8A6flX08CpjMPk69gPGPO9bnv/AMeca5Ddg2N2uy3KcBhpGBzXETBvJXHrwfJSP05yB9uiLNp48hDEXAt0qtdPmtnWQoh/VjLSJnuL9D1rnHnN3lNbZT8a5OK5tQ2o70j11GGlkrpF5hhj+xVDP2GW7noV2myhijxMz8VbfE4tV8Yz6/5QVK37BiY9jYeVVOL8s5FwPb2LOtXxdz6rlKwjGNwjHAYdiGU5wR3HSeDYya7kr7inG/x2vyOELk9VYG49Kfp/9C8ieApX0lWKwRgSvJLIoP38ML/LqTPMZIsooWT+L1w0tlYjtAHzf7Vll67tuRbiTYXjJb2l6UFyF7sxwAqqB2AGAAOoZ2fI8m5NG2LFi1sIRIVEFf/Z");
    weiboLogin.setUrl("javascript:location.href='http://account.oneplus.cn/wblogin?scope=1&jump='+location.href;");

    agentLoginContainer.load([qqLogin,weiboLogin]);

    //写入模块需要用到的样式
    CssCollection.writeToHead(); 
    //组装组件
    loginWinObj.load([loginWinHeader,closeBtn,userName,password,verifyCode,errTipContainer,loginBtn,goRegisterWrapper,agentLoginContainer]);

    $('body').append(loginWinObj.el);
    
    loginWinModule.show=function(){
        loginWinObj.show();
    };

    loginWinModule.hide = function(){
         loginWinObj.close();
    }

    loginWinModule.onLoginSuc = function(callBack){
        loginBtn.sucCallBack = callBack;
        return loginWinModule;
    }

    loginWinModule.onLoginFail = function(callBack){
        loginBtn.failCallBack = callBack;
        return loginWinModule;
    }

    loginWinModule.show();

    module.exports = loginWinModule;
    //loginWinModule.show();
});
