require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"frame_anim":[function(require,module,exports){
"use strict";
cc._RFpush(module, '33ec9/wSxZOoLtFpzQiANsN', 'frame_anim');
// scripts\frame_anim.js

cc.Class({
    "extends": cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...

        name_prefix: {
            "default": "name_path_prefix",
            type: String
        },
        name_begin_index: 0,
        frame_count: 0,
        frame_duration: 0,
        loop: false
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.frames_sp = [];

        for (var i = 0; i < this.frame_count; i++) {
            var url = cc.url.raw(this.name_prefix + (this.name_begin_index + i) + ".png");
            var sp = new cc.SpriteFrame(url);
            this.frames_sp.push(sp);
        }

        this.sp_comp = this.node.getComponent(cc.Sprite);
        if (!this.sp_comp) {
            this.sp_comp = this.node.addComponent(cc.Sprite);
        }
        this.sp_comp.spriteFrame = this.frames_sp[0].clone();

        this.now_index = 0;
        this.pass_time = 0;
        this.anim_ended = false;
    },

    start: function start() {
        this.pass_time = 0;
    },
    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        if (this.anim_ended) {
            return;
        }
        this.pass_time += dt;
        var index = Math.floor(this.pass_time / this.frame_duration);

        if (this.loop) {
            if (this.now_index != index) {
                if (index >= this.frame_count) {
                    this.pass_time = 0;
                    this.sp_comp.spriteFrame = this.frames_sp[0].clone();
                    this.now_index = 0;
                } else {
                    this.sp_comp.spriteFrame = this.frames_sp[index].clone();
                    this.now_index = index;
                }
            }
        } else {
            if (this.now_index != index) {
                if (index >= this.frame_count) {
                    this.anim_ended = true;
                } else {
                    this.now_index = index;
                    this.sp_comp.spriteFrame = this.frames_sp[index].clone();
                }
            }
        }
    }
});

cc._RFpop();
},{}],"main_scene":[function(require,module,exports){
"use strict";
cc._RFpush(module, '7aef49m6hBLho+wm7EEmPS8', 'main_scene');
// scripts\main_scene.js

cc.Class({
    "extends": cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        bee_work_duration: 3,
        bee_recv_duration: 8,
        better_1_anim_time: 1.2,
        better_1_jiejie_anim_time: 1.2
    },

    preload_sound: function preload_sound() {
        var url = cc.url.raw("resources/sounds/bee_recv_honey.mp3");
        cc.loader.loadRes(url, function () {});

        url = cc.url.raw("resources/sounds/bee_working.mp3");
        cc.loader.loadRes(url, function () {});

        url = cc.url.raw("resources/sounds/click_bee_home.mp3");
        cc.loader.loadRes(url, function () {});

        url = cc.url.raw("resources/sounds/click_zhizhuwang.mp3");
        cc.loader.loadRes(url, function () {});

        url = cc.url.raw("resources/sounds/honey_is_full.mp3");
        cc.loader.loadRes(url, function () {});

        url = cc.url.raw("resources/sounds/one_butterfly_dance.mp3");
        cc.loader.loadRes(url, function () {});

        url = cc.url.raw("resources/sounds/two_butterflies_dance.mp3");
        cc.loader.loadRes(url, function () {});
    },

    play_sound: function play_sound(name) {
        var url_data = cc.url.raw(name);
        cc.audioEngine.stopMusic();
        cc.audioEngine.playMusic(url_data);
    },

    call_latter: function call_latter(callfunc, delay) {
        var delay_action = cc.delayTime(delay);
        var call_action = cc.callFunc(callfunc, this);
        var seq = cc.sequence([delay_action, call_action]);
        this.node.runAction(seq);
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.preload_sound();

        this.bee_home_click_lock = false;
        this.bee_work_times = 0;

        this.bee_anim_comp = cc.find("UI_ROOT/anchor-center/bee_root").getComponent(cc.Animation);
        this.ske_bee_home_comp = cc.find("UI_ROOT/anchor-center/bee_home/ske_bee_home").getComponent(sp.Skeleton);

        this.find_brother = false;

        this.better_1_comp = cc.find("UI_ROOT/anchor-center/butterfly_root/ske_butterfly1").getComponent(cc.Animation);
        this.better_2_comp = cc.find("UI_ROOT/anchor-center/butterfly_root/ske_butterfly2").getComponent(cc.Animation);
        //this.zzw_comp = cc.find("UI_ROOT/anchor-center/flow_root_2/ZZW").getcomponent(cc.Animation);
        this.call_latter((function () {
            this.play_sound("resources/sounds/one_butterfly_dance.mp3");
        }).bind(this), 0.5);
    },

    start: function start() {
        // this.ske_bee_home_comp.clearTracks();
        // this.ske_bee_home_comp.setToSetupPose();
        this.better_1_play_anim();
    },

    // 发现了同伴，播放动画
    find_brother_action: function find_brother_action() {
        this.better_1_comp.play("butterfly_fly_jiejiu");
        // this.zzw_comp.play("zzw_out");
        this.call_latter(function () {
            // 蜘蛛网破
            var zhi_zhu_wang = cc.find("UI_ROOT/anchor-center/flow_root_2/ske_zhizhuwang").getComponent(sp.Skeleton);
            zhi_zhu_wang.clearTracks();
            zhi_zhu_wang.setAnimation(0, "pzzw", false);
            this.play_sound("resources/sounds/click_zhizhuwang.mp3");

            // end
            // 两个蝴蝶一起飞走
            this.better_1_comp.play("butter1_fly_out");
            this.better_2_comp.play("butter2_fly_out");
            this.play_sound("resources/sounds/two_butterflies_dance.mp3");
            // end
        }, this.better_1_jiejie_anim_time + 0.1);
    },

    better_1_play_anim: function better_1_play_anim() {
        this.better_1_comp.play("butterfly_fly_1");
        this.call_latter(function () {
            if (this.find_brother === true) {
                // 如果发现了同伴
                this.find_brother_action();
                return;
            } else {
                this.better_1_play_anim();
            }
        }, this.better_1_anim_time + 0.1);
    },

    on_bee_home_click: function on_bee_home_click() {
        if (this.bee_home_click_lock === true) {
            return;
        }
        this.bee_home_click_lock = true;
        this.bee_work_times++;

        this.bee_anim_comp.play("bee_caimi");
        this.play_sound("resources/sounds/click_bee_home.mp3");

        this.ske_bee_home_comp.clearTracks();
        this.ske_bee_home_comp.setAnimation(0, "bee_home_click", false);

        this.call_latter((function () {
            this.play_sound("resources/sounds/bee_working.mp3");
        }).bind(this), 2);

        this.call_latter((function () {
            if (this.bee_work_times === 3) {
                this.bee_work_times = 0;

                // 播放倒蜜动画
                this.play_sound("resources/sounds/honey_is_full.mp3");

                this.call_latter((function () {
                    this.play_sound("resources/sounds/bee_recv_honey.mp3");
                }).bind(this), 3.5);

                this.ske_bee_home_comp.clearTracks();
                this.ske_bee_home_comp.setAnimation(0, "honey_recv", false);
                this.call_latter((function () {
                    this.bee_home_click_lock = false;
                }).bind(this), this.bee_recv_duration);
                // end
            } else {
                    this.bee_home_click_lock = false;
                }
        }).bind(this), this.bee_work_duration);
    },

    on_zhi_zhu_wang_click: function on_zhi_zhu_wang_click() {
        if (this.find_brother === true) {
            return;
        }

        // this.play_sound("resources/sounds/click_zhizhuwang.mp3");
        this.find_brother = true;
    }
});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"random_ske":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'e26e2QowXVCa6/oiGiwUDyk', 'random_ske');
// scripts\random_ske.js

cc.Class({
    "extends": cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        anim_name: {
            "default": "",
            type: String
        },

        click_anim: {
            "default": "",
            type: String
        },
        click_anim_time: 0.5
    },

    // use this for initialization
    onLoad: function onLoad() {},

    call_latter: function call_latter(callfunc, delay) {
        var delay_action = cc.delayTime(delay);
        var call_action = cc.callFunc(callfunc, this);
        var seq = cc.sequence([delay_action, call_action]);
        this.node.runAction(seq);
    },

    start: function start() {
        this.ske_com = this.node.getComponent(sp.Skeleton);

        var time = 0.1 + Math.random() * 0.5;
        this.call_latter((function () {
            this.ske_com.clearTracks();
            this.ske_com.setAnimation(0, this.anim_name, true);
        }).bind(this), time);
    },

    on_flow_click: function on_flow_click() {
        this.ske_com.clearTracks();
        this.ske_com.setAnimation(0, this.click_anim, false);
        this.call_latter((function () {
            this.ske_com.clearTracks();
            this.ske_com.setAnimation(0, this.anim_name, true);
        }).bind(this), this.click_anim_time);
    }
});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"start_scene":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'b0ccfI6MSlFD7H1TZTTE788', 'start_scene');
// scripts\start_scene.js

cc.Class({
    "extends": cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function onLoad() {
        // logo
        var logo = cc.find("UI_ROOT/start_layer/logo");

        logo.y += 700;
        var move1 = cc.moveBy(0.2, 0, -710);
        var move2 = cc.moveBy(0.2, 0, 20);
        var move3 = cc.moveBy(0.1, 0, -10);

        var start_button = cc.find("UI_ROOT/start_layer/start_button");
        start_button.active = false;
        var callfunc = cc.callFunc((function () {
            start_button.active = true;
            start_button.scale = 3.5;
            start_button.opacity = 0;
            var scale1 = cc.scaleTo(0.3, 0.8);
            var scale2 = cc.scaleTo(0.2, 1.2);
            var scale3 = cc.scaleTo(0.1, 1.0);
            var seq = cc.sequence([scale1, scale2, scale3]);
            start_button.runAction(seq);
            var fin = cc.fadeIn(0.5);
            start_button.runAction(fin);
        }).bind(this), this);

        var delay = cc.delayTime(0.4);
        var seq = cc.sequence([move1, move2, move3, callfunc]);
        logo.runAction(seq);

        /*var fin = cc.fadeTo(0.3, 120);
        var bg_mask = cc.find("UI_ROOT/start_layer/bg_mask"); 
        bg_mask.opacity = 0;
        bg_mask.runAction(fin);*/
        this.lock_start = false;
    },

    call_latter: function call_latter(callfunc, delay) {
        var delay_action = cc.delayTime(delay);
        var call_action = cc.callFunc(callfunc, this);
        var seq = cc.sequence([delay_action, call_action]);
        this.node.runAction(seq);
    },

    on_start_click: function on_start_click() {
        if (this.lock_start === true) {
            return;
        }
        this.lock_start = true;
        // logo
        var logo = cc.find("UI_ROOT/start_layer/logo");

        // logo.y += 400;
        var move1 = cc.moveBy(0.2, 0, 710);
        var move2 = cc.moveBy(0.2, 0, -20);
        var move3 = cc.moveBy(0.1, 0, 10);

        var seq = cc.sequence([move3, move2, move1]);
        logo.runAction(seq);

        var start_button = cc.find("UI_ROOT/start_layer/start_button");
        var callfunc = cc.callFunc((function () {
            start_button.active = true;
            start_button.scale = 1.0;
            start_button.opacity = 255;
            var scale1 = cc.scaleTo(0.3, 0.8);
            var scale3 = cc.scaleTo(0.3, 3.5);
            var seq = cc.sequence([scale1, scale3]);
            start_button.runAction(seq);
            var fout = cc.fadeOut(0.6);
            start_button.runAction(fout);
        }).bind(this), this);
        this.node.runAction(callfunc);

        var fout = cc.fadeOut(0.6);
        var bg_mask = cc.find("UI_ROOT/start_layer/bg_mask");
        bg_mask.runAction(fout);

        this.call_latter((function () {
            this.node.removeFromParent();
        }).bind(this), 0.8);
    }
});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}]},{},["frame_anim","main_scene","start_scene","random_ske"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkY6L3NvZnR3YXJlcy9Db2Nvc0NyZWF0b3JfMV8wXzEvcmVzb3VyY2VzL2FwcC5hc2FyL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvc2NyaXB0cy9mcmFtZV9hbmltLmpzIiwiYXNzZXRzL3NjcmlwdHMvbWFpbl9zY2VuZS5qcyIsImFzc2V0cy9zY3JpcHRzL3JhbmRvbV9za2UuanMiLCJhc3NldHMvc2NyaXB0cy9zdGFydF9zY2VuZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMzNlYzkvd1N4Wk9vTHRGcHpRaUFOc04nLCAnZnJhbWVfYW5pbScpO1xuLy8gc2NyaXB0c1xcZnJhbWVfYW5pbS5qc1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG5cbiAgICAgICAgbmFtZV9wcmVmaXg6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBcIm5hbWVfcGF0aF9wcmVmaXhcIixcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZ1xuICAgICAgICB9LFxuICAgICAgICBuYW1lX2JlZ2luX2luZGV4OiAwLFxuICAgICAgICBmcmFtZV9jb3VudDogMCxcbiAgICAgICAgZnJhbWVfZHVyYXRpb246IDAsXG4gICAgICAgIGxvb3A6IGZhbHNlXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLmZyYW1lc19zcCA9IFtdO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5mcmFtZV9jb3VudDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgdXJsID0gY2MudXJsLnJhdyh0aGlzLm5hbWVfcHJlZml4ICsgKHRoaXMubmFtZV9iZWdpbl9pbmRleCArIGkpICsgXCIucG5nXCIpO1xuICAgICAgICAgICAgdmFyIHNwID0gbmV3IGNjLlNwcml0ZUZyYW1lKHVybCk7XG4gICAgICAgICAgICB0aGlzLmZyYW1lc19zcC5wdXNoKHNwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3BfY29tcCA9IHRoaXMubm9kZS5nZXRDb21wb25lbnQoY2MuU3ByaXRlKTtcbiAgICAgICAgaWYgKCF0aGlzLnNwX2NvbXApIHtcbiAgICAgICAgICAgIHRoaXMuc3BfY29tcCA9IHRoaXMubm9kZS5hZGRDb21wb25lbnQoY2MuU3ByaXRlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNwX2NvbXAuc3ByaXRlRnJhbWUgPSB0aGlzLmZyYW1lc19zcFswXS5jbG9uZSgpO1xuXG4gICAgICAgIHRoaXMubm93X2luZGV4ID0gMDtcbiAgICAgICAgdGhpcy5wYXNzX3RpbWUgPSAwO1xuICAgICAgICB0aGlzLmFuaW1fZW5kZWQgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgc3RhcnQ6IGZ1bmN0aW9uIHN0YXJ0KCkge1xuICAgICAgICB0aGlzLnBhc3NfdGltZSA9IDA7XG4gICAgfSxcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG4gICAgICAgIGlmICh0aGlzLmFuaW1fZW5kZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBhc3NfdGltZSArPSBkdDtcbiAgICAgICAgdmFyIGluZGV4ID0gTWF0aC5mbG9vcih0aGlzLnBhc3NfdGltZSAvIHRoaXMuZnJhbWVfZHVyYXRpb24pO1xuXG4gICAgICAgIGlmICh0aGlzLmxvb3ApIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm5vd19pbmRleCAhPSBpbmRleCkge1xuICAgICAgICAgICAgICAgIGlmIChpbmRleCA+PSB0aGlzLmZyYW1lX2NvdW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFzc190aW1lID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zcF9jb21wLnNwcml0ZUZyYW1lID0gdGhpcy5mcmFtZXNfc3BbMF0uY2xvbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub3dfaW5kZXggPSAwO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3BfY29tcC5zcHJpdGVGcmFtZSA9IHRoaXMuZnJhbWVzX3NwW2luZGV4XS5jbG9uZSgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vd19pbmRleCA9IGluZGV4O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm5vd19pbmRleCAhPSBpbmRleCkge1xuICAgICAgICAgICAgICAgIGlmIChpbmRleCA+PSB0aGlzLmZyYW1lX2NvdW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYW5pbV9lbmRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub3dfaW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zcF9jb21wLnNwcml0ZUZyYW1lID0gdGhpcy5mcmFtZXNfc3BbaW5kZXhdLmNsb25lKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc3YWVmNDltNmhCTGhvK3dtN0VFbVBTOCcsICdtYWluX3NjZW5lJyk7XG4vLyBzY3JpcHRzXFxtYWluX3NjZW5lLmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgYmVlX3dvcmtfZHVyYXRpb246IDMsXG4gICAgICAgIGJlZV9yZWN2X2R1cmF0aW9uOiA4LFxuICAgICAgICBiZXR0ZXJfMV9hbmltX3RpbWU6IDEuMixcbiAgICAgICAgYmV0dGVyXzFfamllamllX2FuaW1fdGltZTogMS4yXG4gICAgfSxcblxuICAgIHByZWxvYWRfc291bmQ6IGZ1bmN0aW9uIHByZWxvYWRfc291bmQoKSB7XG4gICAgICAgIHZhciB1cmwgPSBjYy51cmwucmF3KFwicmVzb3VyY2VzL3NvdW5kcy9iZWVfcmVjdl9ob25leS5tcDNcIik7XG4gICAgICAgIGNjLmxvYWRlci5sb2FkUmVzKHVybCwgZnVuY3Rpb24gKCkge30pO1xuXG4gICAgICAgIHVybCA9IGNjLnVybC5yYXcoXCJyZXNvdXJjZXMvc291bmRzL2JlZV93b3JraW5nLm1wM1wiKTtcbiAgICAgICAgY2MubG9hZGVyLmxvYWRSZXModXJsLCBmdW5jdGlvbiAoKSB7fSk7XG5cbiAgICAgICAgdXJsID0gY2MudXJsLnJhdyhcInJlc291cmNlcy9zb3VuZHMvY2xpY2tfYmVlX2hvbWUubXAzXCIpO1xuICAgICAgICBjYy5sb2FkZXIubG9hZFJlcyh1cmwsIGZ1bmN0aW9uICgpIHt9KTtcblxuICAgICAgICB1cmwgPSBjYy51cmwucmF3KFwicmVzb3VyY2VzL3NvdW5kcy9jbGlja196aGl6aHV3YW5nLm1wM1wiKTtcbiAgICAgICAgY2MubG9hZGVyLmxvYWRSZXModXJsLCBmdW5jdGlvbiAoKSB7fSk7XG5cbiAgICAgICAgdXJsID0gY2MudXJsLnJhdyhcInJlc291cmNlcy9zb3VuZHMvaG9uZXlfaXNfZnVsbC5tcDNcIik7XG4gICAgICAgIGNjLmxvYWRlci5sb2FkUmVzKHVybCwgZnVuY3Rpb24gKCkge30pO1xuXG4gICAgICAgIHVybCA9IGNjLnVybC5yYXcoXCJyZXNvdXJjZXMvc291bmRzL29uZV9idXR0ZXJmbHlfZGFuY2UubXAzXCIpO1xuICAgICAgICBjYy5sb2FkZXIubG9hZFJlcyh1cmwsIGZ1bmN0aW9uICgpIHt9KTtcblxuICAgICAgICB1cmwgPSBjYy51cmwucmF3KFwicmVzb3VyY2VzL3NvdW5kcy90d29fYnV0dGVyZmxpZXNfZGFuY2UubXAzXCIpO1xuICAgICAgICBjYy5sb2FkZXIubG9hZFJlcyh1cmwsIGZ1bmN0aW9uICgpIHt9KTtcbiAgICB9LFxuXG4gICAgcGxheV9zb3VuZDogZnVuY3Rpb24gcGxheV9zb3VuZChuYW1lKSB7XG4gICAgICAgIHZhciB1cmxfZGF0YSA9IGNjLnVybC5yYXcobmFtZSk7XG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnN0b3BNdXNpYygpO1xuICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5TXVzaWModXJsX2RhdGEpO1xuICAgIH0sXG5cbiAgICBjYWxsX2xhdHRlcjogZnVuY3Rpb24gY2FsbF9sYXR0ZXIoY2FsbGZ1bmMsIGRlbGF5KSB7XG4gICAgICAgIHZhciBkZWxheV9hY3Rpb24gPSBjYy5kZWxheVRpbWUoZGVsYXkpO1xuICAgICAgICB2YXIgY2FsbF9hY3Rpb24gPSBjYy5jYWxsRnVuYyhjYWxsZnVuYywgdGhpcyk7XG4gICAgICAgIHZhciBzZXEgPSBjYy5zZXF1ZW5jZShbZGVsYXlfYWN0aW9uLCBjYWxsX2FjdGlvbl0pO1xuICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKHNlcSk7XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLnByZWxvYWRfc291bmQoKTtcblxuICAgICAgICB0aGlzLmJlZV9ob21lX2NsaWNrX2xvY2sgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5iZWVfd29ya190aW1lcyA9IDA7XG5cbiAgICAgICAgdGhpcy5iZWVfYW5pbV9jb21wID0gY2MuZmluZChcIlVJX1JPT1QvYW5jaG9yLWNlbnRlci9iZWVfcm9vdFwiKS5nZXRDb21wb25lbnQoY2MuQW5pbWF0aW9uKTtcbiAgICAgICAgdGhpcy5za2VfYmVlX2hvbWVfY29tcCA9IGNjLmZpbmQoXCJVSV9ST09UL2FuY2hvci1jZW50ZXIvYmVlX2hvbWUvc2tlX2JlZV9ob21lXCIpLmdldENvbXBvbmVudChzcC5Ta2VsZXRvbik7XG5cbiAgICAgICAgdGhpcy5maW5kX2Jyb3RoZXIgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLmJldHRlcl8xX2NvbXAgPSBjYy5maW5kKFwiVUlfUk9PVC9hbmNob3ItY2VudGVyL2J1dHRlcmZseV9yb290L3NrZV9idXR0ZXJmbHkxXCIpLmdldENvbXBvbmVudChjYy5BbmltYXRpb24pO1xuICAgICAgICB0aGlzLmJldHRlcl8yX2NvbXAgPSBjYy5maW5kKFwiVUlfUk9PVC9hbmNob3ItY2VudGVyL2J1dHRlcmZseV9yb290L3NrZV9idXR0ZXJmbHkyXCIpLmdldENvbXBvbmVudChjYy5BbmltYXRpb24pO1xuICAgICAgICAvL3RoaXMuenp3X2NvbXAgPSBjYy5maW5kKFwiVUlfUk9PVC9hbmNob3ItY2VudGVyL2Zsb3dfcm9vdF8yL1paV1wiKS5nZXRjb21wb25lbnQoY2MuQW5pbWF0aW9uKTtcbiAgICAgICAgdGhpcy5jYWxsX2xhdHRlcigoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5wbGF5X3NvdW5kKFwicmVzb3VyY2VzL3NvdW5kcy9vbmVfYnV0dGVyZmx5X2RhbmNlLm1wM1wiKTtcbiAgICAgICAgfSkuYmluZCh0aGlzKSwgMC41KTtcbiAgICB9LFxuXG4gICAgc3RhcnQ6IGZ1bmN0aW9uIHN0YXJ0KCkge1xuICAgICAgICAvLyB0aGlzLnNrZV9iZWVfaG9tZV9jb21wLmNsZWFyVHJhY2tzKCk7XG4gICAgICAgIC8vIHRoaXMuc2tlX2JlZV9ob21lX2NvbXAuc2V0VG9TZXR1cFBvc2UoKTtcbiAgICAgICAgdGhpcy5iZXR0ZXJfMV9wbGF5X2FuaW0oKTtcbiAgICB9LFxuXG4gICAgLy8g5Y+R546w5LqG5ZCM5Ly077yM5pKt5pS+5Yqo55S7XG4gICAgZmluZF9icm90aGVyX2FjdGlvbjogZnVuY3Rpb24gZmluZF9icm90aGVyX2FjdGlvbigpIHtcbiAgICAgICAgdGhpcy5iZXR0ZXJfMV9jb21wLnBsYXkoXCJidXR0ZXJmbHlfZmx5X2ppZWppdVwiKTtcbiAgICAgICAgLy8gdGhpcy56endfY29tcC5wbGF5KFwienp3X291dFwiKTtcbiAgICAgICAgdGhpcy5jYWxsX2xhdHRlcihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyDonJjom5vnvZHnoLRcbiAgICAgICAgICAgIHZhciB6aGlfemh1X3dhbmcgPSBjYy5maW5kKFwiVUlfUk9PVC9hbmNob3ItY2VudGVyL2Zsb3dfcm9vdF8yL3NrZV96aGl6aHV3YW5nXCIpLmdldENvbXBvbmVudChzcC5Ta2VsZXRvbik7XG4gICAgICAgICAgICB6aGlfemh1X3dhbmcuY2xlYXJUcmFja3MoKTtcbiAgICAgICAgICAgIHpoaV96aHVfd2FuZy5zZXRBbmltYXRpb24oMCwgXCJwenp3XCIsIGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMucGxheV9zb3VuZChcInJlc291cmNlcy9zb3VuZHMvY2xpY2tfemhpemh1d2FuZy5tcDNcIik7XG5cbiAgICAgICAgICAgIC8vIGVuZFxuICAgICAgICAgICAgLy8g5Lik5Liq6J206J225LiA6LW36aOe6LWwXG4gICAgICAgICAgICB0aGlzLmJldHRlcl8xX2NvbXAucGxheShcImJ1dHRlcjFfZmx5X291dFwiKTtcbiAgICAgICAgICAgIHRoaXMuYmV0dGVyXzJfY29tcC5wbGF5KFwiYnV0dGVyMl9mbHlfb3V0XCIpO1xuICAgICAgICAgICAgdGhpcy5wbGF5X3NvdW5kKFwicmVzb3VyY2VzL3NvdW5kcy90d29fYnV0dGVyZmxpZXNfZGFuY2UubXAzXCIpO1xuICAgICAgICAgICAgLy8gZW5kXG4gICAgICAgIH0sIHRoaXMuYmV0dGVyXzFfamllamllX2FuaW1fdGltZSArIDAuMSk7XG4gICAgfSxcblxuICAgIGJldHRlcl8xX3BsYXlfYW5pbTogZnVuY3Rpb24gYmV0dGVyXzFfcGxheV9hbmltKCkge1xuICAgICAgICB0aGlzLmJldHRlcl8xX2NvbXAucGxheShcImJ1dHRlcmZseV9mbHlfMVwiKTtcbiAgICAgICAgdGhpcy5jYWxsX2xhdHRlcihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5maW5kX2Jyb3RoZXIgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAvLyDlpoLmnpzlj5HnjrDkuoblkIzkvLRcbiAgICAgICAgICAgICAgICB0aGlzLmZpbmRfYnJvdGhlcl9hY3Rpb24oKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuYmV0dGVyXzFfcGxheV9hbmltKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMuYmV0dGVyXzFfYW5pbV90aW1lICsgMC4xKTtcbiAgICB9LFxuXG4gICAgb25fYmVlX2hvbWVfY2xpY2s6IGZ1bmN0aW9uIG9uX2JlZV9ob21lX2NsaWNrKCkge1xuICAgICAgICBpZiAodGhpcy5iZWVfaG9tZV9jbGlja19sb2NrID09PSB0cnVlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5iZWVfaG9tZV9jbGlja19sb2NrID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5iZWVfd29ya190aW1lcysrO1xuXG4gICAgICAgIHRoaXMuYmVlX2FuaW1fY29tcC5wbGF5KFwiYmVlX2NhaW1pXCIpO1xuICAgICAgICB0aGlzLnBsYXlfc291bmQoXCJyZXNvdXJjZXMvc291bmRzL2NsaWNrX2JlZV9ob21lLm1wM1wiKTtcblxuICAgICAgICB0aGlzLnNrZV9iZWVfaG9tZV9jb21wLmNsZWFyVHJhY2tzKCk7XG4gICAgICAgIHRoaXMuc2tlX2JlZV9ob21lX2NvbXAuc2V0QW5pbWF0aW9uKDAsIFwiYmVlX2hvbWVfY2xpY2tcIiwgZmFsc2UpO1xuXG4gICAgICAgIHRoaXMuY2FsbF9sYXR0ZXIoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMucGxheV9zb3VuZChcInJlc291cmNlcy9zb3VuZHMvYmVlX3dvcmtpbmcubXAzXCIpO1xuICAgICAgICB9KS5iaW5kKHRoaXMpLCAyKTtcblxuICAgICAgICB0aGlzLmNhbGxfbGF0dGVyKChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5iZWVfd29ya190aW1lcyA9PT0gMykge1xuICAgICAgICAgICAgICAgIHRoaXMuYmVlX3dvcmtfdGltZXMgPSAwO1xuXG4gICAgICAgICAgICAgICAgLy8g5pKt5pS+5YCS6Jyc5Yqo55S7XG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5X3NvdW5kKFwicmVzb3VyY2VzL3NvdW5kcy9ob25leV9pc19mdWxsLm1wM1wiKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuY2FsbF9sYXR0ZXIoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbGF5X3NvdW5kKFwicmVzb3VyY2VzL3NvdW5kcy9iZWVfcmVjdl9ob25leS5tcDNcIik7XG4gICAgICAgICAgICAgICAgfSkuYmluZCh0aGlzKSwgMy41KTtcblxuICAgICAgICAgICAgICAgIHRoaXMuc2tlX2JlZV9ob21lX2NvbXAuY2xlYXJUcmFja3MoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNrZV9iZWVfaG9tZV9jb21wLnNldEFuaW1hdGlvbigwLCBcImhvbmV5X3JlY3ZcIiwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHRoaXMuY2FsbF9sYXR0ZXIoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5iZWVfaG9tZV9jbGlja19sb2NrID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSkuYmluZCh0aGlzKSwgdGhpcy5iZWVfcmVjdl9kdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgLy8gZW5kXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJlZV9ob21lX2NsaWNrX2xvY2sgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgIH0pLmJpbmQodGhpcyksIHRoaXMuYmVlX3dvcmtfZHVyYXRpb24pO1xuICAgIH0sXG5cbiAgICBvbl96aGlfemh1X3dhbmdfY2xpY2s6IGZ1bmN0aW9uIG9uX3poaV96aHVfd2FuZ19jbGljaygpIHtcbiAgICAgICAgaWYgKHRoaXMuZmluZF9icm90aGVyID09PSB0cnVlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyB0aGlzLnBsYXlfc291bmQoXCJyZXNvdXJjZXMvc291bmRzL2NsaWNrX3poaXpodXdhbmcubXAzXCIpO1xuICAgICAgICB0aGlzLmZpbmRfYnJvdGhlciA9IHRydWU7XG4gICAgfVxufSk7XG4vLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuLy8gfSxcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2UyNmUyUW93WFZDYTYvb2lHaXdVRHlrJywgJ3JhbmRvbV9za2UnKTtcbi8vIHNjcmlwdHNcXHJhbmRvbV9za2UuanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBhbmltX25hbWU6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBcIlwiLFxuICAgICAgICAgICAgdHlwZTogU3RyaW5nXG4gICAgICAgIH0sXG5cbiAgICAgICAgY2xpY2tfYW5pbToge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IFwiXCIsXG4gICAgICAgICAgICB0eXBlOiBTdHJpbmdcbiAgICAgICAgfSxcbiAgICAgICAgY2xpY2tfYW5pbV90aW1lOiAwLjVcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7fSxcblxuICAgIGNhbGxfbGF0dGVyOiBmdW5jdGlvbiBjYWxsX2xhdHRlcihjYWxsZnVuYywgZGVsYXkpIHtcbiAgICAgICAgdmFyIGRlbGF5X2FjdGlvbiA9IGNjLmRlbGF5VGltZShkZWxheSk7XG4gICAgICAgIHZhciBjYWxsX2FjdGlvbiA9IGNjLmNhbGxGdW5jKGNhbGxmdW5jLCB0aGlzKTtcbiAgICAgICAgdmFyIHNlcSA9IGNjLnNlcXVlbmNlKFtkZWxheV9hY3Rpb24sIGNhbGxfYWN0aW9uXSk7XG4gICAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24oc2VxKTtcbiAgICB9LFxuXG4gICAgc3RhcnQ6IGZ1bmN0aW9uIHN0YXJ0KCkge1xuICAgICAgICB0aGlzLnNrZV9jb20gPSB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KHNwLlNrZWxldG9uKTtcblxuICAgICAgICB2YXIgdGltZSA9IDAuMSArIE1hdGgucmFuZG9tKCkgKiAwLjU7XG4gICAgICAgIHRoaXMuY2FsbF9sYXR0ZXIoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuc2tlX2NvbS5jbGVhclRyYWNrcygpO1xuICAgICAgICAgICAgdGhpcy5za2VfY29tLnNldEFuaW1hdGlvbigwLCB0aGlzLmFuaW1fbmFtZSwgdHJ1ZSk7XG4gICAgICAgIH0pLmJpbmQodGhpcyksIHRpbWUpO1xuICAgIH0sXG5cbiAgICBvbl9mbG93X2NsaWNrOiBmdW5jdGlvbiBvbl9mbG93X2NsaWNrKCkge1xuICAgICAgICB0aGlzLnNrZV9jb20uY2xlYXJUcmFja3MoKTtcbiAgICAgICAgdGhpcy5za2VfY29tLnNldEFuaW1hdGlvbigwLCB0aGlzLmNsaWNrX2FuaW0sIGZhbHNlKTtcbiAgICAgICAgdGhpcy5jYWxsX2xhdHRlcigoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5za2VfY29tLmNsZWFyVHJhY2tzKCk7XG4gICAgICAgICAgICB0aGlzLnNrZV9jb20uc2V0QW5pbWF0aW9uKDAsIHRoaXMuYW5pbV9uYW1lLCB0cnVlKTtcbiAgICAgICAgfSkuYmluZCh0aGlzKSwgdGhpcy5jbGlja19hbmltX3RpbWUpO1xuICAgIH1cbn0pO1xuLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbi8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbi8vIH0sXG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdiMGNjZkk2TVNsRkQ3SDFUWlRURTc4OCcsICdzdGFydF9zY2VuZScpO1xuLy8gc2NyaXB0c1xcc3RhcnRfc2NlbmUuanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgLy8gbG9nb1xuICAgICAgICB2YXIgbG9nbyA9IGNjLmZpbmQoXCJVSV9ST09UL3N0YXJ0X2xheWVyL2xvZ29cIik7XG5cbiAgICAgICAgbG9nby55ICs9IDcwMDtcbiAgICAgICAgdmFyIG1vdmUxID0gY2MubW92ZUJ5KDAuMiwgMCwgLTcxMCk7XG4gICAgICAgIHZhciBtb3ZlMiA9IGNjLm1vdmVCeSgwLjIsIDAsIDIwKTtcbiAgICAgICAgdmFyIG1vdmUzID0gY2MubW92ZUJ5KDAuMSwgMCwgLTEwKTtcblxuICAgICAgICB2YXIgc3RhcnRfYnV0dG9uID0gY2MuZmluZChcIlVJX1JPT1Qvc3RhcnRfbGF5ZXIvc3RhcnRfYnV0dG9uXCIpO1xuICAgICAgICBzdGFydF9idXR0b24uYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHZhciBjYWxsZnVuYyA9IGNjLmNhbGxGdW5jKChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzdGFydF9idXR0b24uYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIHN0YXJ0X2J1dHRvbi5zY2FsZSA9IDMuNTtcbiAgICAgICAgICAgIHN0YXJ0X2J1dHRvbi5vcGFjaXR5ID0gMDtcbiAgICAgICAgICAgIHZhciBzY2FsZTEgPSBjYy5zY2FsZVRvKDAuMywgMC44KTtcbiAgICAgICAgICAgIHZhciBzY2FsZTIgPSBjYy5zY2FsZVRvKDAuMiwgMS4yKTtcbiAgICAgICAgICAgIHZhciBzY2FsZTMgPSBjYy5zY2FsZVRvKDAuMSwgMS4wKTtcbiAgICAgICAgICAgIHZhciBzZXEgPSBjYy5zZXF1ZW5jZShbc2NhbGUxLCBzY2FsZTIsIHNjYWxlM10pO1xuICAgICAgICAgICAgc3RhcnRfYnV0dG9uLnJ1bkFjdGlvbihzZXEpO1xuICAgICAgICAgICAgdmFyIGZpbiA9IGNjLmZhZGVJbigwLjUpO1xuICAgICAgICAgICAgc3RhcnRfYnV0dG9uLnJ1bkFjdGlvbihmaW4pO1xuICAgICAgICB9KS5iaW5kKHRoaXMpLCB0aGlzKTtcblxuICAgICAgICB2YXIgZGVsYXkgPSBjYy5kZWxheVRpbWUoMC40KTtcbiAgICAgICAgdmFyIHNlcSA9IGNjLnNlcXVlbmNlKFttb3ZlMSwgbW92ZTIsIG1vdmUzLCBjYWxsZnVuY10pO1xuICAgICAgICBsb2dvLnJ1bkFjdGlvbihzZXEpO1xuXG4gICAgICAgIC8qdmFyIGZpbiA9IGNjLmZhZGVUbygwLjMsIDEyMCk7XHJcbiAgICAgICAgdmFyIGJnX21hc2sgPSBjYy5maW5kKFwiVUlfUk9PVC9zdGFydF9sYXllci9iZ19tYXNrXCIpOyBcclxuICAgICAgICBiZ19tYXNrLm9wYWNpdHkgPSAwO1xyXG4gICAgICAgIGJnX21hc2sucnVuQWN0aW9uKGZpbik7Ki9cbiAgICAgICAgdGhpcy5sb2NrX3N0YXJ0ID0gZmFsc2U7XG4gICAgfSxcblxuICAgIGNhbGxfbGF0dGVyOiBmdW5jdGlvbiBjYWxsX2xhdHRlcihjYWxsZnVuYywgZGVsYXkpIHtcbiAgICAgICAgdmFyIGRlbGF5X2FjdGlvbiA9IGNjLmRlbGF5VGltZShkZWxheSk7XG4gICAgICAgIHZhciBjYWxsX2FjdGlvbiA9IGNjLmNhbGxGdW5jKGNhbGxmdW5jLCB0aGlzKTtcbiAgICAgICAgdmFyIHNlcSA9IGNjLnNlcXVlbmNlKFtkZWxheV9hY3Rpb24sIGNhbGxfYWN0aW9uXSk7XG4gICAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24oc2VxKTtcbiAgICB9LFxuXG4gICAgb25fc3RhcnRfY2xpY2s6IGZ1bmN0aW9uIG9uX3N0YXJ0X2NsaWNrKCkge1xuICAgICAgICBpZiAodGhpcy5sb2NrX3N0YXJ0ID09PSB0cnVlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sb2NrX3N0YXJ0ID0gdHJ1ZTtcbiAgICAgICAgLy8gbG9nb1xuICAgICAgICB2YXIgbG9nbyA9IGNjLmZpbmQoXCJVSV9ST09UL3N0YXJ0X2xheWVyL2xvZ29cIik7XG5cbiAgICAgICAgLy8gbG9nby55ICs9IDQwMDtcbiAgICAgICAgdmFyIG1vdmUxID0gY2MubW92ZUJ5KDAuMiwgMCwgNzEwKTtcbiAgICAgICAgdmFyIG1vdmUyID0gY2MubW92ZUJ5KDAuMiwgMCwgLTIwKTtcbiAgICAgICAgdmFyIG1vdmUzID0gY2MubW92ZUJ5KDAuMSwgMCwgMTApO1xuXG4gICAgICAgIHZhciBzZXEgPSBjYy5zZXF1ZW5jZShbbW92ZTMsIG1vdmUyLCBtb3ZlMV0pO1xuICAgICAgICBsb2dvLnJ1bkFjdGlvbihzZXEpO1xuXG4gICAgICAgIHZhciBzdGFydF9idXR0b24gPSBjYy5maW5kKFwiVUlfUk9PVC9zdGFydF9sYXllci9zdGFydF9idXR0b25cIik7XG4gICAgICAgIHZhciBjYWxsZnVuYyA9IGNjLmNhbGxGdW5jKChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzdGFydF9idXR0b24uYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIHN0YXJ0X2J1dHRvbi5zY2FsZSA9IDEuMDtcbiAgICAgICAgICAgIHN0YXJ0X2J1dHRvbi5vcGFjaXR5ID0gMjU1O1xuICAgICAgICAgICAgdmFyIHNjYWxlMSA9IGNjLnNjYWxlVG8oMC4zLCAwLjgpO1xuICAgICAgICAgICAgdmFyIHNjYWxlMyA9IGNjLnNjYWxlVG8oMC4zLCAzLjUpO1xuICAgICAgICAgICAgdmFyIHNlcSA9IGNjLnNlcXVlbmNlKFtzY2FsZTEsIHNjYWxlM10pO1xuICAgICAgICAgICAgc3RhcnRfYnV0dG9uLnJ1bkFjdGlvbihzZXEpO1xuICAgICAgICAgICAgdmFyIGZvdXQgPSBjYy5mYWRlT3V0KDAuNik7XG4gICAgICAgICAgICBzdGFydF9idXR0b24ucnVuQWN0aW9uKGZvdXQpO1xuICAgICAgICB9KS5iaW5kKHRoaXMpLCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihjYWxsZnVuYyk7XG5cbiAgICAgICAgdmFyIGZvdXQgPSBjYy5mYWRlT3V0KDAuNik7XG4gICAgICAgIHZhciBiZ19tYXNrID0gY2MuZmluZChcIlVJX1JPT1Qvc3RhcnRfbGF5ZXIvYmdfbWFza1wiKTtcbiAgICAgICAgYmdfbWFzay5ydW5BY3Rpb24oZm91dCk7XG5cbiAgICAgICAgdGhpcy5jYWxsX2xhdHRlcigoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5ub2RlLnJlbW92ZUZyb21QYXJlbnQoKTtcbiAgICAgICAgfSkuYmluZCh0aGlzKSwgMC44KTtcbiAgICB9XG59KTtcbi8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4vLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4vLyB9LFxuXG5jYy5fUkZwb3AoKTsiXX0=
