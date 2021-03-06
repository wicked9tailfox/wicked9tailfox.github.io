(function($) {

    var Controller = {
        container: function() {
            var container_html = '<div class="mm-c-wrap"><div class="mm-c-item-box"></div></div>';
            $('body').append(container_html);
        },
        oMirror: {
            el: null,
            oMirror_html: function() {
                var html = '<a href="javascript:;" class="mm-c-item mm-c-item-mirror"><span></span><em>Stage</em></a>';
                $('.mm-c-item-box').append(html);
                this.el = $('.mm-c-item-mirror');
            },
            pagew_html: function() {
                var page_w_html = '<div class="mm-c-pagew trans-all"><input class="trans-all" type="text" placeholder="输入页面宽度，如980"><a href="javascript:;" class="mm-g-ok">OK</a></div>';
                $('.mm-c-wrap').append(page_w_html);
            },
            pagew_display: function() {
                var oMirror = this;
                oPageSetting = $('.mm-c-pagew'),
                pageInput = oPageSetting.find('input'),
                okBtn = oPageSetting.find('.mm-g-ok'),
                placeholder = pageInput.attr('placeholder');
                pageInput.data('placeholder', placeholder);
                showOrHide('show');
                okBtn.bind('click', function() {
                    var val = pageInput.val();
                    if (oMirror.save_pagew(val)) {
                        showOrHide('hide');
                        oMirror.launch('start');
                    } else {
                        pageInput.trigger('hide');
                    }
                });
                function showOrHide(flag) {
                    switch (flag) {
                    case "show":
                        oPageSetting.stop(false, true).animate({
                            left: -156,
                            width: 156
                        }, 400);
                        break;
                    case "hide":
                        oPageSetting.stop(false, true).animate({
                            left: 0,
                            width: 58
                        }, 200);
                        break;
                    }
                    ;
                }
                ;pageInput.bind('focus', function() {
                    $(this).attr('placeholder', '');
                    oPageSetting.addClass('focus').css({
                        left: -92,
                        width: 92
                    });
                }).bind('hide', function() {
                    var placeholder = $(this).data('placeholder');
                    oPageSetting.removeClass('focus').css({
                        left: -156,
                        width: 156
                    });
                    $(this).val("").attr('placeholder', placeholder);
                }).bind('blur', function() {
                    if ($(this).val() == "")
                        $(this).trigger('hide');
                });
            },
            save_pagew: function(val) {
                if (parseInt(val)>0 || val === 'auto') {
                    Storage.save('stage.stageWidth', val);
                    Booter.inited = true;
                    return true;
                }
                ;return false;
            },
            launch: function(flag) {
                var _this = this
                  , mirror_btn = this.el;
                if (flag == 'start') {
                    animation(function() {
                        $('.mirror-lead-block').remove();
                        Stage.initialize();
                        Stage.show_hide_stage('show');
                        Storage.save('stage.created', true);
                    });
                    return;
                }
                mirror_btn.click(function() {
                    if ($(this).is('.selected')) {
                        Storage.save('stage.on', false);
                        $(this).removeClass('selected');
                        Stage.show_hide_stage('hide');
                    } else {
                        Storage.save('stage.on', true);
                        $(this).addClass('selected');
                        if (!Storage.stage_data.created) {
                            _this.pagew_html();
                            _this.pagew_display('show');
                            return;
                        }
                        ;animation(function() {
                            if (Stage.exsit) {
                                $('.mirror-lead-block').length && $('.mirror-lead-block').remove();
                                Stage.show_hide_stage('show');
                                return;
                            }
                            Stage.initialize();
                        });
                    }
                });
                function animation(callback) {
                    var block = '<div class="mirror-lead-block" style="bottom:156px;right:35px;"></div>'
                      , body_h = $(window).height();
                    $('body').css('min-height', body_h + 'px').append(block);
                    $('.mirror-lead-block').animate({
                        right: '48%',
                        bottom: '48%',
                        width: 30,
                        height: 30,
                        opacity: .6
                    }, 400).animate({
                        width: 300,
                        height: 300,
                        right: '-=150',
                        bottom: '-=150',
                        opacity: 0
                    }, 500, callback);
                }
                ;
            },
            init: function() {
                this.oMirror_html();
                this.launch();
                if (Storage.stage_data.on) {
                    this.el.addClass('selected');
                    Stage.initialize();
                }
            }
        },
        oRuler: {
            el: null,
            used: true,
            current_el: null,
            collection: [],
            oRuler_html: function() {
                var html = '<a href="javascript:;" class="mm-c-item mm-c-item-ruler"><span></span><em>Ruler</em></a>';
                $('.mm-c-item-box').append(html);
                this.el = $('.mm-c-item-ruler');
            },
            fnShade: function(flag) {
                switch (flag) {
                case "show":
                    if ($('#ruler-shade').length) {
                        $('#ruler-shade').show();
                    } else {
                        var html = '<div id="ruler-shade" style="z-index:9998;position:fixed;width:100%;height:100%;left:0;top:0;background:#fff;opacity:0.1"></div>';
                        $('body').append(html);
                    }
                    break;
                case "hide":
                    $('#ruler-shade').hide();
                    break;
                }
            },
            fnRulerBox: function(flag) {
                switch (flag) {
                case "show":
                    if ($('#ruler-box').length) {
                        $('#ruler-box').show();
                    } else {
                        var html = '<div id="ruler-box" style="z-index:9998;position:absolute;width:100%;height:100%;left:0;top:0;"></div>';
                        $('body').append(html);
                    }
                    break;
                case "hide":
                    $('#ruler-box').hide();
                    break;
                }
                ;
            },
            fnDrawRuler: function(x, y) {
                if (!this.used)
                    return;
                var index = this.collection.length + 1
                  , id = 'ruler-box-' + index;
                var html = '<div id="' + id + '"  class="m-ruler"  style="left:' + x + 'px;top:' + y + 'px;"><span></span><em  style="display:inline-block;text-align:center;position:absolute;bottom:0;right:0;opacity:0.5;width:12px;height:12px;margin-left:2px;display:none;background:#8598B9;color:#fff;line-height:12px;border-radius: 12px;font-family:arial;">x</em></div>';
                $('#ruler-box').append(html);
                this.current_el = $('#' + id);
            },
            delRuler: function() {
                $('.m-ruler').mouseenter(function() {
                    $(this).css({
                        opacity: .8
                    }).find('em').show();
                }).mouseleave(function() {
                    $(this).css({
                        opacity: 1
                    }).find('em').hide();
                }).mousedown(function(e) {
                    e.stopPropagation();
                    $(this).remove();
                });
            },
            mouse_ev_binding: function(arg) {
                var _this = this
                  , body_h = $(document).height();
                if (arg) {
                    $('#ruler-cross-y').height(body_h);
                    $('#ruler-cross-y,#ruler-cross-x').show();
                    $(window).bind('mousedown', function(e) {
                        var x = e.clientX
                          , y = e.clientY + $(window).scrollTop();
                        _this.fnDrawRuler(x, y - 12);
                        _this.footPrint[0] = x,
                        _this.footPrint[1] = y;
                    }).bind('mousemove', function(e) {
                        e.preventDefault();
                        var x = e.clientX
                          , y = e.clientY + $(window).scrollTop();
                        $('#ruler-cross-x').css({
                            top: y
                        });
                        $('#ruler-cross-y').css({
                            left: x - 1
                        });
                        if (_this.current_el) {
                            var oText = _this.current_el.find('span');
                            $('#ruler-shade').addClass('move');
                            var deltaX = x - _this.footPrint[0] < 0 ? 0 : (x - _this.footPrint[0])
                              , deltaY = y - _this.footPrint[1] < 0 ? 0 : (y - _this.footPrint[1]);
                            if (deltaY > deltaX) {
                                _this.current_el.addClass('m-ruler-y').height(deltaY).css({
                                    lineHeight: deltaY + 'px',
                                    width: 12,
                                    top: _this.footPrint[1]
                                });
                                oText.text(deltaY + 2 + 'px');
                                $('#ruler-shade').removeClass('move-x').addClass('move-y');
                            } else {
                                _this.current_el.removeClass('m-ruler-y').css({
                                    height: 12,
                                    lineHeight: '12px',
                                    top: _this.footPrint[1] - 12
                                }).width(deltaX);
                                oText.text(deltaX + 2 + 'px');
                                $('#ruler-shade').removeClass('move-y').addClass('move-x');
                            }
                        }
                    }).bind('mouseup', function(e) {
                        e.preventDefault();
                        var x = e.clientX
                          , y = e.clientY + $(window).scrollTop()
                          , deltaX = Math.abs(x - _this.footPrint[0])
                          , deltaY = Math.abs(y - _this.footPrint[1]);
                        if (deltaX < 5 && deltaY < 5) {
                            _this.current_el.remove();
                        } else {
                            _this.collection.push(_this.current_el);
                            _this.current_el = null;
                            _this.delRuler();
                            _this.save_ruler_data();
                        }
                        ;$('#ruler-shade').removeClass('move-x move-y');
                    });
                } else {
                    $(window).unbind('mousedown mouseup mousemove');
                }
            },
            ruler_init: function() {
                this.footPrint = [];
                this.delRuler();
                var html = '<div id="ruler-cross-x"></div><div id="ruler-cross-y"></div>';
                $('body').append(html);
            },
            save_ruler_data: function() {
                var data = $('#ruler-box').html();
                Storage.save('ruler.data', data);
            },
            launch: function() {
                var oRuler_btn = this.el
                  , _this = this;
                oRuler_btn.bind('click', function(e) {
                    if ($(this).is('.selected')) {
                        $(this).removeClass('selected');
                        switch_state('off');
                    } else {
                        $(this).addClass('selected');
                        switch_state('on');
                    }
                });
                var switch_state = function(flag) {
                    switch (flag) {
                    case "on":
                        _this.fnShade("show");
                        _this.fnRulerBox("show");
                        _this.mouse_ev_binding(true);
                        Storage.save('ruler.on', true);
                        break;
                    case "off":
                        _this.fnShade("hide");
                        _this.fnRulerBox("hide");
                        Storage.save('ruler.on', false);
                        _this.mouse_ev_binding(false);
                        $('#ruler-cross-y,#ruler-cross-x').hide();
                        break;
                    }
                };
            },
            init: function() {
                var oRulerData = Storage.get('ruler');
                this.oRuler_html();
                this.ruler_init();
                this.launch();
                if (oRulerData.on) {
                    this.el.trigger('click');
                    $('#ruler-box').html(oRulerData['data']);
                    this.delRuler();
                }
            }
        },
        oSprite: {
            el: null,
            oSprite_html: function() {
                var html = '<a href="javascript:;" class="mm-c-item mm-c-item-sprite"><span></span><em>Sprite</em></a>';
                $('.mm-c-item-box').append(html);
                this.el = $('.mm-c-item-sprite');
            },
            sprite_container: {
                el: null,
                showed: false,
                zoom_num: 1,
                img_data: {},
                sprite_data: {},
                sprite_croods: {},
                init_stage_size: 180,
                sprite_container_html: function() {
                    var sprite_box = '<div class="mm-sprite-stage" style="display:none;"><div class="sprite-add-tips">拖入sprite图片</div><div class="zoom-times" style="display:none;"></div></div>';
                    $('.mm-c-wrap').append(sprite_box);
                    this.el = $('.mm-sprite-stage');
                    this.zoom_el = $('.zoom-times');
                },
                fill_img: function(data, drawLatter) {
                    var _this = this
                      , oImg = document.createElement('img')
                      , file_name = data.fileName
                      , img = data.data
                      , width = data.width
                      , height = data.height
                      , bg_canvas = !$('#bg-canvas').length ? document.createElement('canvas') : $('#bg-canvas')[0]
                      , zb_canvas = !$('#zb-canvas').length ? document.createElement('canvas') : $('#zb-canvas')[0]
                      , bg_context = bg_canvas.getContext('2d')
                      , zb_context = zb_canvas.getContext('2d');
                    bg_canvas.id = 'bg-canvas';
                    zb_canvas.id = 'zb-canvas';
                    _this.current_sprite = file_name;
                    _this.img_data[file_name] = [width, height, width, height];
                    _this.sprite_data[file_name] = img;
                    _this.sprite_croods[file_name] = [];
                    Controller.oSprite.oSprite_records_list.add_sprite_item(file_name);
                    if (!drawLatter) {
                        oImg.src = img;
                        zb_canvas.width = bg_canvas.width = width;
                        zb_canvas.height = bg_canvas.height = height;
                        oImg.onload = function() {
                            bg_context.clearRect(0, 0, width, height);
                            bg_context.drawImage(this, 0, 0);
                            _this.el.append(bg_canvas);
                            _this.el.append(zb_canvas);
                            $('.sprite-add-tips').hide();
                            _this.el.width(width);
                            _this.el.height(height);
                            _this.fnZoom();
                        }
                    }
                },
                fnZoom: function(bind_flag) {
                    var target = this.el, _this = this, cur_sprite = _this.current_sprite, cur_sprite_data = _this.img_data[cur_sprite], cur_sprite_croods = _this.sprite_croods[cur_sprite], origin_w = cur_sprite_data[0], origin_h = cur_sprite_data[1], window_h = $(window).height(), canvas = $('#zb-canvas')[0], ctx = canvas.getContext('2d'), time_out, delta_h;
                    if (bind_flag == false) {
                        target.unbind('mousewheel');
                        return;
                    }
                    $('#target_body').css({
                        position: 'relative',
                        minHeight: window_h
                    });
                    $('.mm-c-wrap').addClass('switch-position');
                    _this.draw_coords.setCtx(ctx);
                    target.unbind('mousewheel').bind('mousewheel', function(e, delta) {
                        e.preventDefault();
                        clearTimeout(time_out);
                        var w = cur_sprite_data[2]
                          , h = cur_sprite_data[3];
                        if (delta == 1) {
                            if (_this.zoom_num >= 8)
                                return;
                            _this.zoom_num *= 2;
                            w = w * 2;
                            h = h * 2;
                        } else {
                            w = w / 2 < origin_w ? origin_w : (w / 2);
                            h = h / 2 < origin_h ? origin_h : (h / 2);
                            _this.zoom_num = _this.zoom_num / 2 < 1 ? 1 : _this.zoom_num / 2;
                        }
                        ;delta_h = (_this.zoom_num > 1 ? _this.zoom_num : 0) * cur_sprite_data[1];
                        if ($('.sprite-set-block').length) {
                            $('.sprite-set-block').height(delta_h);
                        } else {
                            var html = '<div class="sprite-set-block"></div>';
                            $('#target_body').append(html);
                            $('.sprite-set-block').height(delta_h);
                        }
                        ;_this.img_data[cur_sprite][2] = w;
                        _this.img_data[cur_sprite][3] = h;
                        $(this).css({
                            width: w,
                            height: h
                        });
                        $('#bg-canvas').css({
                            width: w,
                            height: h
                        });
                        $('#zb-canvas')[0].width = w;
                        $('#zb-canvas')[0].height = h;
                        if (_this.zoom_num == 1) {
                            $('.zoom-times').hide();
                            return;
                        }
                        ;$('.zoom-times').text(_this.zoom_num + "x").stop().fadeIn(300);
                        time_out = setTimeout(function() {
                            $(window).scrollTop(99999);
                        }, 1);
                    }).bind('mouseenter', function() {
                        cur_sprite = _this.current_sprite;
                        cur_sprite_data = _this.img_data[cur_sprite];
                        cur_sprite_croods = _this.sprite_croods[cur_sprite];
                    }).bind('mouseleave', function() {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        if (_this.sprite_croods[cur_sprite]) {
                            cur_sprite_croods = _this.sprite_croods[cur_sprite];
                        }
                        _this.redrawCanvas(ctx, cur_sprite_croods);
                    }).bind('mousemove', function(e) {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        if (_this.sprite_croods[cur_sprite]) {
                            cur_sprite_croods = _this.sprite_croods[cur_sprite];
                        }
                        _this.redrawCanvas(ctx, cur_sprite_croods);
                        var coord = _this.draw_coords.localCoord(canvas, e.pageX, e.pageY)
                          , scroll_top = $(window).scrollTop()
                          , x = coord.x
                          , y = coord.y - scroll_top;
                        _this.draw_coords.drawCroodsText(x, y, _this, ctx);
                        _this.draw_coords.crossLine(x, y, canvas.width, canvas.height);
                    }).bind('mouseup', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        var coord = _this.localCoord(canvas, e.pageX, e.pageY)
                          , scroll_top = $(window).scrollTop()
                          , x = coord.x
                          , y = coord.y - scroll_top
                          , g_x = parseInt(x / _this.zoom_num)
                          , g_y = parseInt(y / _this.zoom_num);
                        if (_this.delCoords(g_x, g_y, cur_sprite)) {
                            var sprite_croods = _this.sprite_croods[cur_sprite];
                            _this.redrawCanvas(ctx, sprite_croods);
                            return;
                        }
                        var croods = {
                            x: g_x,
                            y: g_y
                        };
                        if (!_this.sprite_croods[cur_sprite].length) {
                            _this.sprite_croods[cur_sprite] = [];
                        }
                        _this.sprite_croods[cur_sprite].push(croods);
                        _this.drawCroods(ctx, croods.x, croods.y);
                    });
                },
                re_init_stage: function() {
                    var _this = this
                      , bg_canvas = $('#bg-canvas')[0]
                      , zb_canvas = $('#zb-canvas')[0]
                      , bg_context = bg_canvas.getContext('2d')
                      , zb_context = zb_canvas.getContext('2d');
                    bg_context.clearRect(0, 0, bg_canvas.width, bg_canvas.height);
                    zb_context.clearRect(0, 0, zb_canvas.width, zb_canvas.height);
                    zb_canvas.width = bg_canvas.width = _this.init_stage_size;
                    zb_canvas.height = bg_canvas.height = _this.init_stage_size;
                    $('.sprite-add-tips').show();
                    $('.mm-sprite-stage').css({
                        width: _this.init_stage_size,
                        height: _this.init_stage_size,
                        borderStyle: 'dashed'
                    }).unbind('mouseup mousemove mouseleave mousedown');
                },
                select_sprite: function(spriteName) {
                    var _this = this;
                    if (spriteName == this.current_sprite)
                        return;
                    this.current_sprite = spriteName;
                    Storage.save('sprite.curSprite', spriteName);
                    var sprite_data = this.sprite_data[spriteName]
                      , box_info = this.img_data[spriteName]
                      , oImg = document.createElement('img')
                      , ctx = $('#bg-canvas')[0].getContext('2d');
                    oImg.src = sprite_data;
                    oImg.onload = function() {
                        $('#bg-canvas')[0].setAttribute('style', '');
                        $('#bg-canvas')[0].width = box_info[0];
                        $('#bg-canvas')[0].height = box_info[1];
                        $('#zb-canvas')[0].width = box_info[0];
                        $('#zb-canvas')[0].height = box_info[1];
                        $('.mm-sprite-stage').css({
                            width: box_info[0],
                            height: box_info[1]
                        });
                        $('.sprite-add-tips').hide();
                        ctx.drawImage(this, 0, 0);
                        _this.fnZoom();
                    }
                },
                delete_sprite: function(spriteName) {
                    var _this = this
                      , cur_sprite = this.current_sprite
                      , sprite_croods = this.sprite_croods;
                    delete this.sprite_data[spriteName];
                    delete this.img_data[spriteName];
                    if (this.sprite_croods[spriteName]) {
                        delete this.sprite_croods[spriteName];
                    }
                    if (spriteName == cur_sprite) {
                        this.re_init_stage();
                    }
                },
                localCoord: function(canvas, x, y) {
                    var bbox = canvas.getBoundingClientRect();
                    return {
                        x: x - bbox.left,
                        y: y - bbox.top
                    };
                },
                drawCroods: function(ctx, x, y) {
                    var _this = this;
                    var text = '(' + x + ',' + y + ')';
                    var x = _this.zoom_num * x + 2
                      , y = _this.zoom_num * y + 2;
                    var text_width = ctx.measureText(text).width;
                    ctx.save();
                    ctx.fillStyle = '#FFBF00';
                    ctx.fillRect(x, y - 16, text_width + 8, 16);
                    ctx.font = '12px Helvetica';
                    ctx.fillStyle = '#fff';
                    ctx.fillText(text, x + 4, y - 4);
                    _this.drawPoint(ctx, x, y, 2);
                    ctx.restore();
                },
                redrawCanvas: function(ctx, data) {
                    var _this = this;
                    ctx.clearRect(0, 0, ctx.width, ctx.height);
                    $.each(data, function(index, coords) {
                        _this.drawCroods(ctx, coords.x, coords.y);
                    });
                },
                drawPoint: function(ctx, x, y, r) {
                    ctx.beginPath();
                    ctx.arc(x, y, r, 0, Math.PI * 2);
                    ctx.fillStyle = '#FFC926';
                    ctx.fill();
                    ctx.closePath();
                },
                delCoords: function(x, y, cur_sprite) {
                    var del_flag = false
                      , _this = this
                      , cur_sprite_croods = _this.sprite_croods[cur_sprite];
                    $.each(cur_sprite_croods, function(index, val) {
                        var coord_x = val.x
                          , coord_y = val.y;
                        if (x > coord_x && x < (coord_x + 54) && y > (coord_y - 14) && y < coord_y) {
                            _this.sprite_croods[cur_sprite].splice(index, 1);
                            del_flag = true;
                            return false;
                        }
                        return;
                    });
                    return del_flag;
                },
                draw_coords: {
                    setCtx: function(ctx) {
                        this.ctx = ctx;
                    },
                    crossLine: function(x, y, w, h) {
                        this.drawLine('v', x, h);
                        this.drawLine('h', y, w);
                    },
                    localCoord: function(canvas, x, y) {
                        var bbox = canvas.getBoundingClientRect();
                        return {
                            x: x - bbox.left,
                            y: y - bbox.top
                        };
                    },
                    drawLine: function(direction, start, end) {
                        var ctx = this.ctx;
                        ctx.strokeStyle = '#4CA6FF';
                        start += 0.5;
                        end += 0.5;
                        ctx.beginPath();
                        if (direction == 'v') {
                            ctx.moveTo(start, 0);
                            ctx.lineTo(start, end);
                        } else {
                            ctx.moveTo(0, start);
                            ctx.lineTo(end, start);
                        }
                        ctx.stroke();
                    },
                    redrawCanvas: function(ctx, data) {
                        var _this = this;
                        ctx.clearRect(0, 0, ctx.width, ctx.height);
                        $.each(data, function(index, coords) {
                            _this.drawCroods(ctx, coords.x, coords.y);
                        });
                    },
                    drawCroods: function(ctx, x, y) {
                        var text = '(' + x + ',' + y + ')';
                        var x = _this.zoom_num * x
                          , y = _this.zoom_num * y;
                        var text_width = ctx.measureText(text).width;
                        ctx.save();
                        ctx.fillStyle = '#FFBF00';
                        ctx.fillRect(x, y - 16, text_width + 8, 16);
                        ctx.font = '12px Helvetica';
                        ctx.fillStyle = '#fff';
                        ctx.fillText(text, x + 4, y - 4);
                        drawPoint(x, y, 2);
                        ctx.restore();
                    },
                    drawPoint: function(ctx, x, y, r) {
                        ctx.beginPath();
                        ctx.arc(x, y, r, 0, Math.PI * 2);
                        ctx.fillStyle = '#FFC926';
                        ctx.fill();
                        ctx.closePath();
                    },
                    markPoint: function(canvas) {
                        canvas.onmouseup = function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            var coord = localCoord(canvas, e.pageX, e.pageY)
                              , x = coord.x
                              , y = coord.y;
                            var g_x = parseInt(x / _this.zoom_num)
                              , g_y = parseInt(y / _this.zoom_num);
                            if (delCoords(g_x, g_y)) {
                                redrawCanvas(sprite_croods);
                                return;
                            }
                            var croods = {
                                x: g_x,
                                y: g_y
                            };
                            sprite_croods.push(croods);
                            drawCroods(croods.x, croods.y);
                        }
                    },
                    drawCroodsText: function(x, y, ocontainer, ctx) {
                        var g_x = parseInt(x / ocontainer.zoom_num)
                          , g_y = parseInt(y / ocontainer.zoom_num);
                        var text = '(' + g_x + ',' + g_y + ')';
                        var text_w = ctx.measureText(text).width;
                        ctx.save();
                        ctx.fillStyle = 'rgba(255,255,255,0.7)';
                        ctx.fillRect(x, y - 18, text_w + 10, 18);
                        ctx.restore();
                        ctx.font = '12px Helvetica';
                        ctx.fillText(text, x + 5, y - 5);
                    },
                    delCoords: function(x, y) {
                        var del_flag = false;
                        $.each(sprite_croods, function(index, val) {
                            var coord_x = val.x
                              , coord_y = val.y;
                            if (x > coord_x && x < (coord_x + 54) && y > (coord_y - 14) && y < coord_y) {
                                sprite_croods.splice(index, 1);
                                del_flag = true;
                                return false;
                            }
                            return;
                        });
                        return del_flag;
                    }
                },
                save_sprite_data: function(data) {
                    var filename = data.fileName;
                    Storage.save('sprite.curSprite', filename);
                    var storeData = Storage.sprite_data.img_data;
                    storeData[filename] = data;
                    Storage.save('sprite.img_data', storeData);
                },
                start: function() {
                    var _this = this;
                    _this.sprite_container_html();
                    Helper.getDragImg(this.el, function(data) {
                        _this.save_sprite_data(data);
                        _this.fill_img(data);
                    }, function() {
                        _this.el.addClass('solid-border');
                    });
                }
            },
            oDisplay_records: {
                el: null,
                btn_html: function() {
                    var btn = '<a href="javascript:;" class="sprite-records-btn">查看列表<em></em></a>';
                    $('.mm-sprite-stage').append(btn);
                    this.el = $('.sprite-records-btn');
                },
                listen_btn: function() {
                    var btn = this.el;
                    btn.bind('click', function() {
                        $(this).hide();
                        var sprite_records = $('.sprite-records-box');
                        sprite_records.show();
                        Storage.save('sprite.listOn', true);
                    });
                },
                start: function() {
                    this.btn_html();
                    this.listen_btn();
                    this.el.bind('mouseenter mousemove mouseup', function(e) {
                        e.stopPropagation();
                    });
                }
            },
            oSprite_records_list: {
                el: null,
                hide_btn: null,
                sprite_collection: [],
                sprite_records_html: function() {
                    var sprite_list = '<div class="sprite-records-box" style="display:none;"><ul></ul><a class="hide-sprite-list" href="javascript:;">隐藏列表</a></div>';
                    $('.mm-sprite-stage').append(sprite_list);
                    this.el = $('.sprite-records-box');
                    this.hide_btn = $('.hide-sprite-list');
                },
                listen_hide_btn: function() {
                    var sprite_records = this.el;
                    this.hide_btn.bind('click', function(e) {
                        e.stopPropagation();
                        sprite_records.hide();
                        Storage.save('sprite.listOn', false);
                        var record_btn = $('.sprite-records-btn');
                        record_btn.show();
                    });
                },
                add_sprite_item: function(name) {
                    var container = this.el.find('ul')
                      , _this = this;
                    var item = '<li class="sprite-item" data-name="' + name + '"><span class="sprite-name" title="' + name + '">' + name + '</span><a href="javascript:;" title="清除该sprite数据" class="remove fr">x</a></li>';
                    container.find('li.sprite-item').removeClass('selected');
                    container.append(item);
                    $('li.sprite-item[data-name="' + name + '"]').addClass('selected');
                    this.save_sprite_item(name);
                    this.listeners();
                },
                listeners: function() {
                    var _this = this;
                    $('li.sprite-item').on('mouseenter', function() {
                        $(this).addClass('on');
                    }).on('mouseleave', function() {
                        $(this).removeClass('on');
                    }).on('click', function() {
                        $('li.sprite-item').removeClass('selected');
                        $(this).addClass('selected');
                        var sprite_container = Controller.oSprite.sprite_container
                          , sprite_name = $(this).find('.sprite-name').text();
                        sprite_container.select_sprite(sprite_name);
                    });
                    $('li.sprite-item .remove').on('click', function(e) {
                        e.stopPropagation();
                        var sprite_name = $(this).prev().text()
                          , collection = _this.sprite_collection;
                        $(this).parent().remove();
                        $.each(collection, function(index, val) {
                            if (val == sprite_name)
                                collection.splice(index, 1);
                        });
                        _this.sprite_collection = collection;
                        var sprite_container = Controller.oSprite.sprite_container;
                        sprite_container.delete_sprite(sprite_name);
                    });
                },
                save_sprite_item: function(sprite_name) {
                    this.sprite_collection.push(sprite_name);
                },
                del_sprite_item: function() {
                    var remove_btn = this.el.find('.remove')
                      , _this = this;
                    remove_btn.live('click', function() {
                        var sprite_name = $(this).prev().text()
                          , collection = _this.sprite_collection;
                        $(this).parent().remove();
                        $.each(collection, function(index, val) {
                            if (val == sprite_name)
                                collection.splice(index, 1);
                        });
                        _this.sprite_collection = collection;
                        var sprite_container = Controller.oSprite.sprite_container;
                        sprite_container.delete_sprite(sprite_name);
                    });
                },
                start: function() {
                    this.sprite_records_html();
                    this.listen_hide_btn();
                    this.el.bind('mousemove mouseup', function(e) {
                        e.stopPropagation();
                    }).bind('mouseenter', function(e) {
                        e.stopPropagation();
                        $('.mm-sprite-stage').trigger('mouseleave');
                    });
                }
            },
            launch: function() {
                var _this = this;
                this.el.bind('click', function() {
                    if (_this.sprite_container.showed) {
                        $(this).removeClass('selected');
                        _this.sprite_container.showed = false;
                        _this.sprite_container.el.hide();
                        Storage.save('sprite.on', false);
                    } else {
                        $(this).addClass('selected');
                        _this.sprite_container.showed = true;
                        _this.sprite_container.el.show();
                        Storage.save('sprite.on', true);
                    }
                });
            },
            init: function() {
                var _this = this, window_h = $(window).height(), curSprite = Storage.get('sprite.curSprite'), onFlag = Storage.get('sprite.on'), listOnFlag = Storage.get('sprite.listOn'), allSpriteData = Storage.get('sprite.img_data'), curData;
                this.oSprite_html();
                this.sprite_container.start();
                this.oDisplay_records.start();
                this.oSprite_records_list.start();
                this.launch();
                if (onFlag) {
                    this.el.trigger('click');
                }
                if (allSpriteData) {
                    $.each(allSpriteData, function(filename, data) {
                        if (curSprite == filename) {
                            _this.sprite_container.fill_img(data);
                        } else {
                            _this.sprite_container.fill_img(data, true);
                        }
                    });
                    this.sprite_container.el.addClass('solid-border');
                }
                if (listOnFlag) {
                    this.oDisplay_records.el.trigger('click');
                }
            }
        },
        oOrders:{
          resetImgPosition:function() {},
          resetApplication:function(){},

        },
        initialize: function() {
            this.container();
            this.oMirror.init();
            this.oRuler.init();
            this.oSprite.init();
        }
    };

    var Stage = {
        el_wrap: null,
        el: null,
        stage_width: 980,
        exist: false,
        controllers: {
            controllers_html: function() {
                var controllers_html = '';
                controllers_html += '<div class="mm-stage-c-box">';
                controllers_html += '<ul class="mm-stage-c-list">';
                controllers_html += '<li><a href="javascript:;" id="contr-move" title="移动参考图"></a></li>';
                controllers_html += '<li><a href="javascript:;" id="contr-color" title="获取颜色"></a></li>';
                controllers_html += '<li style="position:relative;"><a  id="contr-switch"  href="javascript:;" title="交换位置"></a><span id="switch-code" style="display:none;">c</span></li>';
                controllers_html += '<li><a  id="contr-code-opac"  href="javascript:;" title="HTML层透明度"></a></li>';
                controllers_html += '<li><a href="javascript:;" id="contr-stage-opac" title="参考图透明度"></a></li>';
                controllers_html += '<li><a href="javascript:;" id="contr-set" title="设置"></a></li></ul>';
                controllers_html += '<div class="mm-stage-c-setting mirror-layer"><label class="fr" for="">50</label><input type="range" min="0" max="100"></div>';
                controllers_html += '<div class="mm-stage-c-setting code-layer"><label class="fr" for="">50</label><input type="range" min="0" max="100" value="100"></div>';
                controllers_html += '<div class="setting-layer"><input type="text" placeholder="页面宽度"><a href="javascript:;" class="mm-g-ok fr">OK</a></div>';
                controllers_html += '</div>';
                $('body').append(controllers_html);
            },
            hide: function() {
                $('.mm-stage-c-box').hide();
            },
            oMove: {
                el: null,
                available: true,
                on_use: null,
                turn_use_state: function() {
                    var _this = this;
                    this.el.bind('click', function() {
                        if (!_this.available)
                            return;
                        _this.on_use = !_this.on_use;
                        Storage.save('stage.oMove', [true, _this.on_use]);
                        if (_this.on_use) {
                            if (Stage.controllers.oSwitch.code_top) {
                                Stage.controllers.oSwitch.el.trigger('mouseup');
                            }
                            _this.el.addClass('using');
                            Stage.move_stage_canvas();
                        } else {
                            _this.el.removeClass('using');
                            Stage.move_stage_canvas('unbind');
                        }
                        ;
                    });
                },
                set_use_state: function(on_use_state) {
                    this.on_use = on_use_state;
                    if (this.on_use) {
                        this.el.addClass('using');
                        Stage.move_stage_canvas();
                    } else {
                        this.el.removeClass('using');
                        Stage.move_stage_canvas('unbind');
                    }
                    ;
                },
                init: function() {
                    this.el = $('#contr-move');
                    this.turn_use_state();
                    var oMoveData = Storage.get('stage.oMove');
                    if (oMoveData[1])
                        this.el.trigger('click');
                }
            },
            oColor: {
                el: null,
                available: false,
                on_use: false,
                targetCanvas: null,
                turn_use_state: function() {
                    var _this = this;
                    this.el.bind('click', function() {
                        if (!_this.available)
                            return;
                        _this.on_use = !_this.on_use;
                        Storage.save('stage.oColor', [true, _this.on_use]);
                        if (_this.on_use) {
                            if (Stage.controllers.oSwitch.code_top) {
                                Stage.controllers.oSwitch.el.trigger('mouseup');
                            }
                            _this.el.addClass('using');
                            _this.on_use = true;
                            _this.handlers();
                            Stage.controllers.oStageOpacity.set_stage_opacity(100);
                        } else {
                            _this.el.removeClass('using');
                            _this.on_use = false;
                            _this.handlers('unbind');
                            var opacity_val = Stage.controllers.oStageOpacity.stage_opacity;
                            Stage.controllers.oStageOpacity.set_stage_opacity(opacity_val);
                        }
                    });
                },
                get_targetCanvas: function() {
                    this.targetCanvas = $('#mm-stage-canvas')[0];
                },
                localCoords: function() {
                    var coordsArr = this.targetCanvas.getBoundingClientRect();
                    var borders = {
                        left: parseInt($(this.targetCanvas).css('border-left-width')) || 0,
                        top: parseInt($(this.targetCanvas).css('border-top-width')) || 0
                    };
                    return {
                        left: coordsArr.left + borders.left,
                        top: coordsArr.top + borders.top
                    }
                },
                drawCuted: function(x, y) {
                    var myctx = $('#mm-stage-canvas')[0].getContext('2d');
                    var pointData = myctx.getImageData(x, y, 1, 1).data
                      , hexVal = "#";
                    for (var i = 0; i < 3; i++) {
                        hexVal += toHex(pointData[i]);
                    }
                    $('#show-hex').val(hexVal);
                    var c_x = x - 4
                      , c_y = y - 4;
                    var imgdata = myctx.getImageData(c_x, c_y, 10, 10);
                    this.colorCtx.putImageData(imgdata, 0, 0);
                    function toHex(num) {
                        var erCode = num.toString(2)
                          , arr = erCode.split("")
                          , arr_len = arr.length
                          , char1 = 0
                          , char2 = 0
                          , cArr = ['A', 'B', 'C', 'D', 'E', 'F'];
                        if (arr_len < 8) {
                            for (var i = 8 - arr_len; i > 0; i--) {
                                arr.unshift(0);
                            }
                        }
                        $.each(arr, function(index, val) {
                            if (index < 4) {
                                var pow_num = 3 - index;
                                char1 += parseInt(val) * Math.pow(2, pow_num);
                                if (index == 3) {
                                    if (char1 < 9) {
                                        char1 = char1.toString();
                                    } else {
                                        var num = char1 - 10;
                                        char1 = cArr[num];
                                    }
                                }
                            } else {
                                var pow_num = 7 - index;
                                char2 += parseInt(val) * Math.pow(2, pow_num);
                                if (index == 7) {
                                    if (char2 <= 9) {
                                        char2 = char2.toString();
                                    } else {
                                        var num2 = char2 - 10;
                                        char2 = cArr[num2];
                                    }
                                }
                            }
                        });
                        return char1 + char2;
                    }
                    ;
                },
                colorCanvas: function() {
                    var html = '<div id="colorCanvasWrap" style="width:50px;height:50px;display:none"><div class="colorCanvas-x"></div><div class="colorCanvas-y"></div>';
                    html += '<canvas id="colorCanvas" width="10" height="10" style="width:50px;height:50px;"></canvas>';
                    html += '<textarea id="show-hex"></textarea></div>';
                    $('body').append(html);
                    this.cCanvas = $('#colorCanvas');
                    this.cCanvas_wrap = $('#colorCanvasWrap');
                    this.colorCtx = $('#colorCanvas')[0].getContext('2d');
                },
                handlers: function(flag) {
                    var _this = this
                      , footPrint = []
                      , localCoords = this.localCoords();
                    color_canvas = $(this.targetCanvas);
                    if (flag == 'unbind') {
                        color_canvas.unbind('mousedown mousemove mouseup mouseleave');
                        return;
                    }
                    color_canvas.bind('mousedown', function(e) {
                        if (!_this.available)
                            return;
                        var x = e.clientX - localCoords.left
                          , y = e.clientY + $(window).scrollTop() - localCoords.top;
                        footPrint[0] = x,
                        footPrint[1] = y;
                    }).bind('mousemove', function(e) {
                        if (!_this.available)
                            return;
                        var o_x = e.clientX
                          , o_y = e.clientY;
                        x = e.clientX - localCoords.left,
                        y = e.clientY - localCoords.top + $(window).scrollTop();
                        if (!footPrint.length) {
                            _this.cCanvas_wrap.show().css({
                                left: o_x + 10,
                                top: o_y + $(window).scrollTop() + 20
                            });
                            _this.drawCuted(x, y);
                        }
                        ;
                    }).bind('mouseup', function(e) {
                        if (!_this.available)
                            return;
                        var x = e.clientX - localCoords.left
                          , y = e.clientY + $(window).scrollTop() - localCoords.top;
                        if (footPrint[0] == x && footPrint[1] == y) {
                            footPrint = [];
                            var hex = $('#show-hex').val();
                            $('#show-hex').select();
                        }
                    }).bind('mouseleave', function() {
                        _this.cCanvas_wrap.hide();
                    });
                },
                init: function() {
                    var oColorData = Storage.get('stage.oColor');
                    this.el = $('#contr-color');
                    this.get_targetCanvas();
                    this.colorCanvas();
                    this.turn_use_state();
                    if (oColorData[1]) {
                        this.on_use = true;
                        this.el.addClass('using');
                        this.handlers();
                    }
                }
            },
            oSwitch: {
                el: null,
                available: true,
                code_top: false,
                switch_code_level: function() {
                    var _this = this;
                    this.el.bind('mousedown', function() {
                        $(this).addClass('using');
                    }).bind('mouseup', function() {
                        $(this).removeClass('using');
                        _this.code_top = !_this.code_top;
                        if (_this.code_top) {
                            Storage.save('stage.oSwitch', [true, true, 'top']);
                            $('#target_body').addClass('top');
                            $('#switch-code').show();
                        } else {
                            Storage.save('stage.oSwitch', [true, true, 'down']);
                            $('#target_body').removeClass('top');
                            $('#switch-code').hide();
                        }
                    });
                },
                init: function() {
                    this.el = $('#contr-switch');
                    this.switch_code_level();
                    var oSwitchData = Storage.get('stage.oSwitch');
                    if (oSwitchData[2] == 'top')
                        this.el.trigger('mouseup');
                }
            },
            oCodeOpacity: {
                el: null,
                set_box: null,
                code_opacity: 100,
                available: true,
                on_use: false,
                set_code_opacity: function() {
                    var _this = this;
                    this.el.bind('click', function() {
                        if (!_this.available)
                            return;
                        _this.on_use = !_this.on_use;
                        Storage.save('stage.oCode', [true, _this.on_use]);
                        if (_this.on_use) {
                            $(this).addClass('using');
                            _this.set_box.stop().fadeIn();
                            _this.set_box.find('label').text(_this.code_opacity);
                            _this.set_box.find('input').val(_this.code_opacity).bind('change', function() {
                                var val = $(this).val()
                                  , val_percent = val / 100;
                                val_percent = val_percent.toFixed(2);
                                $(this).prev().text(val);
                                Storage.save('stage.codeOpacity', val_percent);
                                _this.code_opacity = val;
                                $('#target_body').css({
                                    opacity: val_percent
                                });
                            });
                        } else {
                            $(this).removeClass('using');
                            _this.set_box.stop().fadeOut();
                        }
                    });
                },
                init: function() {
                    this.el = $('#contr-code-opac');
                    this.set_box = $('.mm-stage-c-setting.code-layer');
                    var code_opacity = Storage.get('stage.codeOpacity')
                      , codeOpacityData = Storage.get('stage.oCode');
                    Stage.set_code_opacity(code_opacity);
                    this.code_opacity = parseInt(code_opacity * 100);
                    this.set_code_opacity();
                    if (codeOpacityData[1]) {
                        this.el.trigger('click');
                    }
                }
            },
            oStageOpacity: {
                el: null,
                set_box: null,
                available: true,
                on_use: false,
                stage_opacity: 50,
                set_stage_opacity: function(num) {
                    var _this = this;
                    if (num) {
                        $('#mm-stage-canvas').css({
                            opacity: num / 100
                        });
                        return;
                    }
                    this.el.bind('click', function() {
                        if (!_this.available)
                            return;
                        _this.on_use = !_this.on_use;
                        Storage.save('stage.oBg', [true, _this.on_use]);
                        if (_this.on_use) {
                            $(this).addClass('using');
                            _this.set_box.stop().fadeIn();
                            _this.set_box.find('label').text(_this.stage_opacity);
                            _this.set_box.find('input').val(_this.stage_opacity).bind('change', function() {
                                var val = $(this).val()
                                  , val_percent = val / 100;
                                $(this).prev().text(val);
                                _this.stage_opacity = val;
                                Storage.save('stage.stageOpacity', val_percent);
                                $('#mm-stage-canvas').css({
                                    opacity: val_percent
                                });
                            });
                        } else {
                            $(this).removeClass('using');
                            _this.set_box.stop().fadeOut();
                        }
                    });
                },
                init: function() {
                    var stage_opacity = Storage.get('stage.stageOpacity')
                      , stageOpacityData = Storage.get('stage.oBg');
                    this.stage_opacity = parseInt(stage_opacity * 100);
                    this.el = $('#contr-stage-opac');
                    this.set_box = $('.mm-stage-c-setting.mirror-layer');
                    if (Stage.controllers.oColor.on_use) {
                        Stage.set_stage_canvas_opacity(1);
                    } else {
                        Stage.set_stage_canvas_opacity(stage_opacity);
                    }
                    this.set_stage_opacity();
                    if (stageOpacityData[1]) {
                        this.el.trigger('click');
                    }
                }
            },
            oSet: {
                el: null,
                set_box: null,
                available: true,
                on_use: false,
                set_stage_layer_w: function() {
                    var _this = this;
                    if (!_this.available)
                        return;
                    this.el.bind('click', function() {
                        if (!_this.available)
                            return;
                        _this.on_use = !_this.on_use;
                        Storage.save('stage.oSet', [true, _this.on_use]);
                        if (_this.on_use) {
                            $(this).addClass('using');
                            _this.set_box.stop().fadeIn();
                        } else {
                            $(this).removeClass('using');
                            _this.set_box.stop().fadeOut();
                        }
                    });
                },
                change_layer_w: function() {
                    var _this = this
                      , oInput = $('.setting-layer input')
                      , submit_btn = $('.setting-layer .mm-g-ok');
                    submit_btn.bind('click', function() {
                        var val = oInput.val(),stage_width;

                        if(!parseInt(val)&&val!=='auto'){
                            try{
                               throw new Error('输入了非法字符。请输入数字、百分比、auto');
                               return; 
                            }catch(e){
                                console.log(e);
                            }
                        }

                        if((val.indexOf('%')>-1&&parseInt(val)>0)||val==='auto'){
                            stage_width =  val;
                        }

                        if(Number(val)>0){
                            stage_width =  parseInt(val);
                        }

                        Stage.stage_width = stage_width;
                        Storage.save('stage.stageWidth', Stage.stage_width);
                        $('#mm-stage').css({
                            width: stage_width
                        });
                        _this.on_use = !_this.on_use;
                        _this.el.removeClass('using');
                        _this.set_box.hide();
                    });
                },
                init: function() {
                    var oSetData = Storage.get('stage.oSet');
                    this.el = $('#contr-set');
                    this.set_box = $('.setting-layer');
                    this.set_stage_layer_w();
                    this.change_layer_w();
                    if (oSetData[1]) {
                        this.el.trigger('click');
                    }
                }
            },
            set_control_available: function(obj, flag) {
                this[obj].available = flag;
                flag ? this[obj].el.removeClass('unuse') : this[obj].el.addClass('unuse');
            },
            set_control_use_state: function(obj, flag) {
                this[obj].on_use = flag;
                flag ? this[obj].el.addClass('using') : this[obj].el.removeClass('using');
            },
            init: function() {
                this.controllers_html();
                this.oMove.init();
                this.oColor.init();
                this.oSwitch.init();
                this.oCodeOpacity.init();
                this.oStageOpacity.init();
                this.oSet.init();
                var oMoveData = Storage.get('stage.oMove')
                  , oColorData = Storage.get('stage.oColor')
                  , oStageOpacityData = Storage.get('stage.oBg');
                this.set_control_available('oMove', oMoveData[0]);
                this.set_control_available('oColor', oColorData[0]);
                this.set_control_available('oStageOpacity', oStageOpacityData[0]);
            }
        },
        stage_html: function() {
            var body_h = $(window).height(),stage_width;
            this.stage_width = Storage.get('stage.stageWidth') || this.stage_width;
            stage_width = this.stage_width.indexOf('%')>-1||this.stage_width === 'auto' ? this.stage_width : (this.stage_width+'px');
            var html = '<div id="mm-stage-layer" style="display:none;"><div id="mm-stage" style="width:' + stage_width + ';min-height:' + body_h + 'px"><div class="drag-pic-tips">拖入您需要参考的图片，建议是整张效果图</div></div></div>';
            $('body').append(html);
            this.el_wrap = $('#mm-stage-layer');
            this.el = $('#mm-stage');
            this.exsit = true;
            $('#mm-stage-layer').stop().fadeIn();
            this.load_reference();
        },
        load_reference: function() {
            if (Storage.stage_data.imgData) {
                var img_data = Storage.get('stage.imgData')
                  , pos = Storage.get('stage.position')
                  , opacity = Storage.get('stage.stageOpacity') * 100;
                this.put_img_into_canvas(img_data[2], img_data[0], img_data[1]);
                $('#mm-stage-canvas').css({
                    left: pos[0],
                    top: pos[1]
                });
                return;
            }
            ;var _this = this
              , container = this.el[0];
            if (!this.el.length)
                return;
            container.ondragover = function(e) {
                e.preventDefault();
            }
            ;
            container.ondrop = function(e) {
                e.preventDefault();
                var fileList = e.dataTransfer.files;
                if (fileList.length == 0) {
                    return;
                }
                ;if (fileList[0].type.indexOf('image') === -1) {
                    return;
                }
                if (window.URL.createObjectURL) {
                    var img_src = window.URL.createObjectURL(fileList[0]);
                    _this.get_img_data(img_src);
                } else if (window.webkitURL.createObjectURL) {} else {
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        img.src = this.result;
                        container.appendChild(img);
                    }
                    reader.readAsDataURL(fileList[0]);
                }
            }
        },
        get_img_data: function(img_src) {
            var _this = this, blackImg = document.createElement('img'), canvas = document.createElement('canvas'), ctx = canvas.getContext('2d'), img_data;
            blackImg.src = img_src;
            blackImg.onload = function() {
                var img_width = this.width
                  , img_height = this.height;
                canvas.width = img_width;
                canvas.height = img_height;
                ctx.drawImage(this, 0, 0);
                img_data = canvas.toDataURL();
                Storage.save('stage.imgData', [img_width, img_height, img_data]);
                _this.put_img_into_canvas(img_data, img_width, img_height);
            }
            ;
        },
        put_img_into_canvas: function(imgdata, img_w, img_h) {
            var _this = this, oCanvas, ctx, img = document.createElement('img');
            if (!$('#mm-stage-canvas').length) {
                var canvas_html = '<canvas id="mm-stage-canvas" draggable="true"></canvas>';
                this.el.append(canvas_html);
            }
            ;oCanvas = $('#mm-stage-canvas')[0];
            ctx = oCanvas.getContext('2d');
            oCanvas.width = img_w;
            oCanvas.height = img_h;
            img.src = imgdata;
            $('#mm-stage').css('height', img_h);
            img.onload = function() {
                finish_init();
                ctx.drawImage(this, 0, 0);
                if (!Storage.get('stage.oColor')[1]) {
                    _this.set_stage_canvas_opacity(.5);
                }
                _this.controllers.set_control_available('oMove', true);
                _this.controllers.set_control_available('oColor', true);
                _this.controllers.set_control_available('oStageOpacity', true);
                _this.controllers.oColor.get_targetCanvas();
            }
            function finish_init() {
                $('.drag-pic-tips').hide();
                _this.el.addClass('loaded');
            }
        },
        set_stage_canvas_opacity: function(val) {
            var canvas = $('#mm-stage-canvas');
            canvas.css({
                opacity: val
            });
        },
        set_code_opacity: function(num) {
            $('#target_body').css({
                opacity: num
            });
        },
        move_stage_canvas: function(flag) {
            if (flag == 'unbind') {
                $('body').unbind('keydown keyup');
            }
            var _this = this
              , keys = {
                shift: false
            }
              , oCanvas = $('#mm-stage-canvas')[0]
              , pos = [];
            oCanvas.ondragstart = function(e) {
                if (!_this.controllers.oMove.on_use)
                    return;
                pos[0] = e.clientX;
                pos[1] = e.clientY;
                $(this).addClass('canvas-shadow');
            }
            ;
            oCanvas.ondragend = function(e) {
                if (!_this.controllers.oMove.on_use)
                    return;
                pos[0] = e.clientX - pos[0];
                pos[1] = e.clientY - pos[1];
                var v_left = parseInt($(this).css('left')) + pos[0];
                var v_top = parseInt($(this).css('top')) + pos[1];
                Storage.save('stage.position', [v_left, v_top]);
                $(this).removeClass('canvas-shadow');
                $(this).css({
                    left: v_left,
                    top: v_top
                });
            }
            ;
            $('body').bind('keydown', function(e) {
                if (_this.controllers.oMove.on_use) {
                    if (e.shiftKey) {
                        keys.shift = true;
                    }
                    var keycode = e.keyCode
                      , scroll_top = $(window).scrollTop();
                    switch (keycode) {
                    case 37:
                        move('left', -1);
                        break;
                    case 38:
                        move('top', -1);
                        break;
                    case 39:
                        move('left', 1);
                        break;
                    case 40:
                        move('top', 1);
                        break;
                    }
                }
            }).bind('keyup', function(e) {
                if (_this.controllers.oMove.on_use && e.shiftKey) {
                    keys.shift = false;
                }
            });
            function move(direction, mount) {
                var obj = $('#mm-stage-canvas'), v_left, v_top;
                if (keys.shift) {
                    mount = mount * 10;
                }
                if (direction == 'left') {
                    v_left = parseInt(obj.css('left')) + mount;
                    v_top = parseInt(obj.css('top'));
                } else {
                    v_left = parseInt(obj.css('left'));
                    v_top = parseInt(obj.css('top')) + mount;
                }
                Storage.save('stage.position', [v_left, v_top]);
                obj.css({
                    left: v_left,
                    top: v_top
                });
            }
            ;
        },
        show_hide_stage: function(action) {
            switch (action) {
            case "show":
                $('#mm-stage').stop().fadeIn();
                $('.mm-stage-c-box').stop().fadeIn();
                break;
            case "hide":
                $('#mm-stage').stop().fadeOut();
                $('.mm-stage-c-box').stop().fadeOut();
                break;
            }
        },
        initialize: function() {
            this.stage_html();
            this.controllers.init();
        }
    };


    var Storage = {
        storeName: '',
        prefix:'mm_data_',
        stage_data: {
            on: false,
            created: false,
            position: [0, 0],
            stageWidth: null,
            stageOpacity: 0.5,
            oMove: [false, false],
            oColor: [false, false],
            oSwitch: [true, true, 'down'],
            oCode: [true, false],
            codeOpacity: 1,
            oBg: [false, false],
            oSet: [true, false],
            imgData: null
        },
        sprite_data: {
            on: false,
            curSprite: '',
            listOn: false,
            img_data: {},
            sprite_data: {},
            coords_data: {}
        },
        ruler_data: {
            on: false,
            data: ''
        },
        save: function(stroageItem, val_obj) {
            var _this = this
              , input_item = stroageItem.split('.')
              , last = input_item.length - 1
              , dataName = input_item[0] + '_data'
              , localstorage_item = this.storeName + '_' + input_item[0]
              , origin_data = {};
            $.each(input_item, function(index, val) {
                var fill_val = val;
                if (index == 0) {
                    origin_data[val + '_data'] = {};
                } else {
                    $.each(origin_data, function(key, value) {
                        if (key == (input_item[0] + '_data') || key == input_item[index - 1]) {
                            if (index == last) {
                                origin_data[key][input_item[index]] = val_obj;
                            } else {
                                origin_data[key][input_item[index]] = {};
                            }
                        }
                        ;
                    });
                }
            });

            _this[dataName] = $.extend(_this[dataName], origin_data[dataName]);
            localStorage[localstorage_item] = JSON.stringify(_this[dataName]);
        },
        get: function(stroageItem) {
            var _this = this
              , input_item = stroageItem.split('.')
              , dataName = input_item.shift() + '_data'
              , targetData = _this[dataName];
            if (input_item.length == 0)
                return targetData;
            $.each(input_item, function(index, value) {
                targetData = targetData[value];
            });
            return targetData;
        },
        update: function(stroageItem) {
            var stroageName = this.storeName + '_' + stroageItem;
            this[stroageItem + '_data'] = JSON.parse(localStorage[stroageName]);
        },
        //清除应用记录的所有数据
        clearAll: function(){
            var keys = Object.keys(localStorage);
            var prefix = Storage.prefix;
            keys.forEach(function(item){
                if(item.indexOf(prefix) === 0) {
                   localStorage.removeItem(item);
                }  
            });
        },
        clear: function(){

        },
        initialize: function() {
            var _this = this
              , file_name = Helper.getFileName()
              , store_name = this.prefix + file_name;

            this.storeName = store_name;
            if (!localStorage[store_name]) {
                var stage = store_name + '_stage'
                  , sprite = store_name + '_sprite'
                  , ruler = store_name + '_ruler';
                localStorage[store_name] = "welcome to use magic-mirror";
                var stage_data = JSON.stringify(_this.stage_data);
                localStorage[stage] = stage_data;
                var sprite_data = JSON.stringify(_this.sprite_data);
                localStorage[sprite] = sprite_data;
                var ruler_data = JSON.stringify(_this.ruler_data);
                localStorage[ruler] = ruler_data;
            } else {
                this.storeCreated = true;
                this.update('stage');
                this.update('sprite');
                this.update('ruler');
            }
            ;
        }
    };


    var Booter = {
        inited: true,
        initialize: function() {}
    };


    var Helper = {
        getDragImg: function(target, callback, overFn) {
            var helper = this;
            var oTarget = target[0], img;
            oTarget.ondragover = function(e) {
                e.preventDefault();
                if (overFn)
                    overFn();
            }
            ;
            oTarget.ondrop = function(e) {
                e.preventDefault();
                var fileList = e.dataTransfer.files, fileName;
                if (fileList.length == 0) {
                    return;
                }
                ;if (fileList[0].type.indexOf('image') === -1) {
                    return;
                }
                fileName = fileList[0].name;
                if (window.URL.createObjectURL) {
                    img = window.URL.createObjectURL(fileList[0]);
                } else if (window.webkitURL.createObjectURL) {
                    img = window.webkitURL.createObjectURL(fileList[0]);
                }
                ;helper.transImgData(img, fileName, callback);
            }
            ;
        },
        transImgData: function(img_src, name, callback) {
            var oImg = document.createElement('img'), offCanvas = document.createElement('canvas'), context, imgW, imgH, outputImgData;
            oImg.src = img_src;
            oImg.onload = function() {
                imgW = this.width;
                imgH = this.height;
                offCanvas.width = imgW;
                offCanvas.height = imgH;
                context = offCanvas.getContext('2d');
                context.drawImage(this, 0, 0);
                outputImgData = {
                    data: offCanvas.toDataURL(),
                    fileName: name,
                    width: imgW,
                    height: imgH,
                };
                if (callback)
                    callback(outputImgData);
            }
        },
        getFileName: function() {
            var path_arr = window.location.pathname.toLowerCase().split('/');
            var fileFullName = path_arr.pop();
            var folderName = path_arr.pop();
            var fileName = fileFullName.substring(0, fileFullName.indexOf('.'));
            return folderName + '_' + fileName;
        }
    };

    var Detecter = {
        getUserAgent:function(){
            return navigator.userAgent.toLowerCase();
        },
        isInDevice:function(){
            var us = this.getUserAgent();
            return ['iphone','android','mobile'].every(function(item){
                us.indexOf(item) === -1
            });
        }
    }

    var ShortCuts = {

    }

    //pc外壳与移动端外壳
    var SHELL_TYPE = ['pc','phone','pad'];
    var Shell = {

    }

    $.mirror = function() {
        Storage.initialize();
        Booter.initialize();
        Controller.initialize();
    };

    window.mm = {
        constroller: Controller,
        stage: Stage,
        storage: Storage,
        booter: Booter,
        helper: Helper
    };
})(jQuery)

$(function() {
    $('body').wrapInner('<div id="target_body"></div>');
    $.mirror();
})
