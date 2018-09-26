require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"frame_anim":[function(require,module,exports){
"use strict";
cc._RFpush(module, '40265n6H+RHlK87oXpRte6W', 'frame_anim');
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
cc._RFpush(module, 'ab84f2cAqJHs5L5znPpGmnA', 'main_scene');
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
        ant_food_duration: 3.5,
        ant_food_anim_time: 10,
        move_ground_time: 1
    },

    call_latter: function call_latter(callfunc, delay) {
        var delay_action = cc.delayTime(delay);
        var call_action = cc.callFunc(callfunc, this);
        var seq = cc.sequence([delay_action, call_action]);
        this.node.runAction(seq);
    },

    preload_sound: function preload_sound() {
        var url = cc.url.raw("resources/sounds/ant_is_home.mp3");
        cc.loader.loadRes(url, function () {});

        url = cc.url.raw("resources/sounds/ant_is_strong.mp3");
        cc.loader.loadRes(url, function () {});

        url = cc.url.raw("resources/sounds/click_coff.mp3");
        cc.loader.loadRes(url, function () {});

        url = cc.url.raw("resources/sounds/click_lingdang.mp3");
        cc.loader.loadRes(url, function () {});

        url = cc.url.raw("resources/sounds/wator_fengzhang.mp3");
        cc.loader.loadRes(url, function () {});

        url = cc.url.raw("resources/sounds/ant01_chef_click.mp3");
        cc.loader.loadRes(url, function () {});

        url = cc.url.raw("resources/sounds/ant02_chef_click.mp3");
        cc.loader.loadRes(url, function () {});

        url = cc.url.raw("resources/sounds/ant03_chef_click.mp3");
        cc.loader.loadRes(url, function () {});
    },

    play_sound: function play_sound(name) {
        var url_data = cc.url.raw(name);
        cc.audioEngine.stopMusic();
        cc.audioEngine.playMusic(url_data);
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.preload_sound();

        this.ant_chef_sound = ["resources/sounds/ant01_chef_click.mp3", "resources/sounds/ant02_chef_click.mp3", "resources/sounds/ant03_chef_click.mp3"];
        this.ant_sound_index = 0;

        this.ske_coff = cc.find("UI_ROOT/moving_root/anchor-center/coff_click_node/ske_coffcap");
        this.is_coff_clicking = false;

        this.is_ant_rescued = false;
        this.ske_ant = cc.find("UI_ROOT/moving_root/anchor-center/ant_root/ske_ant_coff");

        this.is_call_ant_qeue = false;

        this.water_dot_playing_state = 0;
        this.water_anim_com = cc.find("UI_ROOT/moving_root/anchor-center/castle_root/ske_dropletszfc").getComponent(sp.Skeleton);
        this.fengche_com = cc.find("UI_ROOT/moving_root/anchor-center/castle_root/ske_fengche").getComponent(sp.Skeleton);
        this.call_latter((function () {
            this.start_wator_anim();
        }).bind(this), 0.5);

        this.lock_fengche_click = false;
        this.lock_fengche_click2 = false;

        this.chef_ant_comp = cc.find("UI_ROOT/moving_root/anchor-center/ant_root/ant_under/ant_chef").getComponent(cc.Animation);

        this.lock_click_left_yezi = false;
        this.is_move_down = false;
        // 测试
        // this.move_to_ground_down();

        // this.ant_u01_comp = cc.find("UI_ROOT/moving_root/anchor-center/ant_root/ant_under/ant_u01").getComponent(cc.Animation);
        // this.ant_u02_comp = cc.find("UI_ROOT/moving_root/anchor-center/ant_root/ant_under/ant_u02").getComponent(cc.Animation);
        // this.ant_u03_comp = cc.find("UI_ROOT/moving_root/anchor-center/ant_root/ant_under/ant_u03").getComponent(cc.Animation);

        /*this.call_latter(function() {
            this.play_under_ground_ant1_anim();
            this.play_under_ground_ant2_anim();
            this.play_under_ground_ant3_anim();
        }.bind(this), 1);*/
    },

    on_click_left_shuye: function on_click_left_shuye() {
        if (this.is_move_down === false || this.lock_click_left_yezi === true) {
            return;
        }

        this.lock_click_left_yezi = true;
        var left_tree_comp = cc.find("UI_ROOT/moving_root/anchor-center/mask_shuye/tree_2").getComponent(cc.Animation);
        left_tree_comp.play("left_yezi_move1");

        var click_node = cc.find("UI_ROOT/moving_root/anchor-center/mask_shuye/tree_click");
        if (click_node) {
            click_node.removeFromParent(true);
        }
    },

    play_under_ground_ant1_anim: function play_under_ground_ant1_anim() {

        // var r_time = 2 + 4 * Math.random();
        // r_time = Math.floor(r_time);
        var r_time = 1;
        this.call_latter((function () {
            var comp = cc.find("UI_ROOT/moving_root/anchor-center/ant_root/ant_under/ant_u01").getComponent(cc.Animation);
            comp.play("ant_under_move01");
        }).bind(this), r_time);

        this.call_latter((function () {
            this.play_under_ground_ant1_anim();
        }).bind(this), r_time + 8);
    },

    play_under_ground_ant2_anim: function play_under_ground_ant2_anim() {
        // var r_time = 2 + 4 * Math.random();
        // r_time = Math.floor(r_time);
        var r_time = 1.7;
        this.call_latter((function () {
            var comp = cc.find("UI_ROOT/moving_root/anchor-center/ant_root/ant_under/ant_u02").getComponent(cc.Animation);
            comp.play("ant_under_move02");
        }).bind(this), r_time);

        this.call_latter((function () {
            this.play_under_ground_ant2_anim();
        }).bind(this), r_time + 8);
    },

    play_under_ground_ant3_anim: function play_under_ground_ant3_anim() {
        // var r_time = 2 + 4 * Math.random();
        // r_time = Math.floor(r_time);
        var r_time = 2.4;
        this.call_latter((function () {
            var comp = cc.find("UI_ROOT/moving_root/anchor-center/ant_root/ant_under/ant_u03").getComponent(cc.Animation);
            comp.play("ant_under_move03");
        }).bind(this), r_time);

        this.call_latter((function () {
            this.play_under_ground_ant3_anim();
        }).bind(this), r_time + 10);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    start_ant_food_anim: function start_ant_food_anim() {
        var time = 0.1;

        var ant_no1 = cc.find("UI_ROOT/moving_root/anchor-center/ant_root/ant_qeque/ant_no1");
        var ant_no1_com = ant_no1.getComponent(cc.Animation);
        ant_no1_com.play("ant_food");

        time = this.ant_food_duration;
        this.call_latter((function () {
            var ant_no2 = cc.find("UI_ROOT/moving_root/anchor-center/ant_root/ant_qeque/ant_no2");
            var ant_no2_com = ant_no2.getComponent(cc.Animation);
            ant_no2_com.play("ant_food");
            this.play_sound("resources/sounds/ant_is_strong.mp3");
        }).bind(this), time);

        time = time + this.ant_food_duration;
        this.call_latter((function () {
            var ant_no3 = cc.find("UI_ROOT/moving_root/anchor-center/ant_root/ant_qeque/ant_no3");
            var ant_no3_com = ant_no3.getComponent(cc.Animation);
            ant_no3_com.play("ant_food");
        }).bind(this), time);

        time = time + this.ant_food_duration;
        this.call_latter((function () {
            var ant_no4 = cc.find("UI_ROOT/moving_root/anchor-center/ant_root/ant_qeque/ant_no4");
            var ant_no4_com = ant_no4.getComponent(cc.Animation);
            ant_no4_com.play("ant_food");
        }).bind(this), time);

        time = time + this.ant_food_duration;
        this.call_latter((function () {
            var ant_no5 = cc.find("UI_ROOT/moving_root/anchor-center/ant_root/ant_qeque/ant_no5");
            var ant_no5_com = ant_no5.getComponent(cc.Animation);
            ant_no5_com.play("ant_food");
        }).bind(this), time);

        time = time + this.ant_food_anim_time;
        this.call_latter((function () {
            // 切换到地下
            this.move_to_ground_down();
        }).bind(this), time);
    },

    move_to_ground_down: function move_to_ground_down() {
        var left_tree_comp = cc.find("UI_ROOT/moving_root/anchor-center/mask_shuye/tree_2").getComponent(cc.Animation);
        left_tree_comp.play("left_yezi_move0");

        var tree_1 = cc.find("UI_ROOT/moving_root/anchor-center/mask_shuye/tree_1").getComponent(cc.Animation);
        tree_1.play("tree_1_move");

        var tre_3 = cc.find("UI_ROOT/moving_root/anchor-center/mask_shuye/tree_3").getComponent(cc.Animation);
        tre_3.play("tree_3_move");

        var move_by = cc.moveBy(1, 0, 270 * 2);
        var moving_root = cc.find("UI_ROOT/moving_root");
        moving_root.runAction(move_by);
        this.play_sound("resources/sounds/ant_is_home.mp3");
        this.is_move_down = true;
    },

    on_coff_click: function on_coff_click() {
        if (this.is_coff_clicking === true) {
            return;
        }
        this.play_sound("resources/sounds/click_coff.mp3");
        this.is_coff_clicking = true;
        var ske_comp = this.ske_coff.getComponent(sp.Skeleton);
        ske_comp.clearTracks();
        ske_comp.setAnimation(0, "coffcap_open", false);

        this.call_latter((function () {
            ske_comp.clearTracks();
            // ske_comp.setAnimation(0, "coffcap_doudong", true);
            // ske_comp.clearTracks();
            ske_comp.setToSetupPose();

            this.is_coff_clicking = false;
        }).bind(this), 3);

        if (this.is_ant_rescued === false) {
            this.is_ant_rescued = true;
            var anim = this.ske_ant.getComponent(cc.Animation);
            anim.play("coff_ant_move");
        }
    },

    on_call_ant_qeue_click: function on_call_ant_qeue_click() {
        if (this.is_call_ant_qeue === true) {
            return;
        }

        this.is_call_ant_qeue = true;
        this.play_sound("resources/sounds/click_lingdang.mp3");

        var bell_comp = cc.find("UI_ROOT/moving_root/anchor-center/ske_DflowDLHa").getComponent(sp.Skeleton);
        bell_comp.clearTracks();
        bell_comp.setAnimation(0, "dianjidoudong", false);
        this.scheduleOnce((function () {
            bell_comp.clearTracks();
            bell_comp.setAnimation(0, "Lingdanghuayaobai", true);
        }).bind(this), 1);

        // 播放蚂蚁动画
        this.start_ant_food_anim();
        // end
    },

    start_wator_anim: function start_wator_anim() {
        this.water_anim_com.clearTracks();
        this.water_anim_com.setAnimation(0, "shuizhuchuxian", false);
        this.call_latter((function () {
            this.water_anim_com.clearTracks();
            this.water_anim_com.setAnimation(0, "shuizhu", true);
            this.water_dot_playing_state = 1;
        }).bind(this), 1);
    },

    on_call_water_dot_click: function on_call_water_dot_click() {
        if (this.water_dot_playing_state != 1) {
            return;
        }

        this.water_dot_playing_state = 2;
        this.water_anim_com.clearTracks();
        this.water_anim_com.setAnimation(0, "drople_shuizhufengche", false);

        this.lock_fengche_click = true;

        this.call_latter((function () {
            this.fengche_com.clearTracks();
            this.fengche_com.setAnimation(0, "fengchezhuandong", false);
            this.play_sound("resources/sounds/wator_fengzhang.mp3");
        }).bind(this), 2.8);

        this.call_latter((function () {
            this.lock_fengche_click = false;
        }).bind(this), 2.8 + 3);

        this.call_latter((function () {
            this.start_wator_anim();
        }).bind(this), 10);
    },

    on_fengche_click: function on_fengche_click() {
        if (this.lock_fengche_click2) {
            return;
        }

        if (this.lock_fengche_click) {
            return;
        }
        this.lock_fengche_click2 = true;
        this.fengche_com.clearTracks();
        this.fengche_com.setAnimation(0, "fengchezhuandong", false);
        this.call_latter((function () {
            this.lock_fengche_click2 = false;
        }).bind(this), 3);
    },

    // 必须加锁，时间关系，暂时不加
    on_chef_ant_click: function on_chef_ant_click() {
        this.chef_ant_comp.play("ant_chef_hello");
        this.call_latter((function () {
            this.chef_ant_comp.play("ant_chef_idle");
        }).bind(this), 1.2);

        this.play_sound(this.ant_chef_sound[this.ant_sound_index]);
        this.ant_sound_index++;
        if (this.ant_sound_index >= 3) {
            this.ant_sound_index = 0;
        }
    }
});

cc._RFpop();
},{}],"random_ske":[function(require,module,exports){
"use strict";
cc._RFpush(module, '534a6bMmMZJlLP6PW8pn/Ze', 'random_ske');
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
cc._RFpush(module, '01bfaf/rixObbHdfVX8KCh+', 'start_scene');
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
},{}]},{},["start_scene","frame_anim","random_ske","main_scene"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkY6L3NvZnR3YXJlcy9Db2Nvc0NyZWF0b3JfMV8wXzEvcmVzb3VyY2VzL2FwcC5hc2FyL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvc2NyaXB0cy9mcmFtZV9hbmltLmpzIiwiYXNzZXRzL3NjcmlwdHMvbWFpbl9zY2VuZS5qcyIsImFzc2V0cy9zY3JpcHRzL3JhbmRvbV9za2UuanMiLCJhc3NldHMvc2NyaXB0cy9zdGFydF9zY2VuZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDclZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc0MDI2NW42SCtSSGxLODdvWHBSdGU2VycsICdmcmFtZV9hbmltJyk7XG4vLyBzY3JpcHRzXFxmcmFtZV9hbmltLmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cblxuICAgICAgICBuYW1lX3ByZWZpeDoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IFwibmFtZV9wYXRoX3ByZWZpeFwiLFxuICAgICAgICAgICAgdHlwZTogU3RyaW5nXG4gICAgICAgIH0sXG4gICAgICAgIG5hbWVfYmVnaW5faW5kZXg6IDAsXG4gICAgICAgIGZyYW1lX2NvdW50OiAwLFxuICAgICAgICBmcmFtZV9kdXJhdGlvbjogMCxcbiAgICAgICAgbG9vcDogZmFsc2VcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuZnJhbWVzX3NwID0gW107XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmZyYW1lX2NvdW50OyBpKyspIHtcbiAgICAgICAgICAgIHZhciB1cmwgPSBjYy51cmwucmF3KHRoaXMubmFtZV9wcmVmaXggKyAodGhpcy5uYW1lX2JlZ2luX2luZGV4ICsgaSkgKyBcIi5wbmdcIik7XG4gICAgICAgICAgICB2YXIgc3AgPSBuZXcgY2MuU3ByaXRlRnJhbWUodXJsKTtcbiAgICAgICAgICAgIHRoaXMuZnJhbWVzX3NwLnB1c2goc3ApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zcF9jb21wID0gdGhpcy5ub2RlLmdldENvbXBvbmVudChjYy5TcHJpdGUpO1xuICAgICAgICBpZiAoIXRoaXMuc3BfY29tcCkge1xuICAgICAgICAgICAgdGhpcy5zcF9jb21wID0gdGhpcy5ub2RlLmFkZENvbXBvbmVudChjYy5TcHJpdGUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3BfY29tcC5zcHJpdGVGcmFtZSA9IHRoaXMuZnJhbWVzX3NwWzBdLmNsb25lKCk7XG5cbiAgICAgICAgdGhpcy5ub3dfaW5kZXggPSAwO1xuICAgICAgICB0aGlzLnBhc3NfdGltZSA9IDA7XG4gICAgICAgIHRoaXMuYW5pbV9lbmRlZCA9IGZhbHNlO1xuICAgIH0sXG5cbiAgICBzdGFydDogZnVuY3Rpb24gc3RhcnQoKSB7XG4gICAgICAgIHRoaXMucGFzc190aW1lID0gMDtcbiAgICB9LFxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcbiAgICAgICAgaWYgKHRoaXMuYW5pbV9lbmRlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucGFzc190aW1lICs9IGR0O1xuICAgICAgICB2YXIgaW5kZXggPSBNYXRoLmZsb29yKHRoaXMucGFzc190aW1lIC8gdGhpcy5mcmFtZV9kdXJhdGlvbik7XG5cbiAgICAgICAgaWYgKHRoaXMubG9vcCkge1xuICAgICAgICAgICAgaWYgKHRoaXMubm93X2luZGV4ICE9IGluZGV4KSB7XG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID49IHRoaXMuZnJhbWVfY291bnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXNzX3RpbWUgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNwX2NvbXAuc3ByaXRlRnJhbWUgPSB0aGlzLmZyYW1lc19zcFswXS5jbG9uZSgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vd19pbmRleCA9IDA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zcF9jb21wLnNwcml0ZUZyYW1lID0gdGhpcy5mcmFtZXNfc3BbaW5kZXhdLmNsb25lKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm93X2luZGV4ID0gaW5kZXg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMubm93X2luZGV4ICE9IGluZGV4KSB7XG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID49IHRoaXMuZnJhbWVfY291bnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hbmltX2VuZGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vd19pbmRleCA9IGluZGV4O1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNwX2NvbXAuc3ByaXRlRnJhbWUgPSB0aGlzLmZyYW1lc19zcFtpbmRleF0uY2xvbmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2FiODRmMmNBcUpIczVMNXpuUHBHbW5BJywgJ21haW5fc2NlbmUnKTtcbi8vIHNjcmlwdHNcXG1haW5fc2NlbmUuanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBhbnRfZm9vZF9kdXJhdGlvbjogMy41LFxuICAgICAgICBhbnRfZm9vZF9hbmltX3RpbWU6IDEwLFxuICAgICAgICBtb3ZlX2dyb3VuZF90aW1lOiAxXG4gICAgfSxcblxuICAgIGNhbGxfbGF0dGVyOiBmdW5jdGlvbiBjYWxsX2xhdHRlcihjYWxsZnVuYywgZGVsYXkpIHtcbiAgICAgICAgdmFyIGRlbGF5X2FjdGlvbiA9IGNjLmRlbGF5VGltZShkZWxheSk7XG4gICAgICAgIHZhciBjYWxsX2FjdGlvbiA9IGNjLmNhbGxGdW5jKGNhbGxmdW5jLCB0aGlzKTtcbiAgICAgICAgdmFyIHNlcSA9IGNjLnNlcXVlbmNlKFtkZWxheV9hY3Rpb24sIGNhbGxfYWN0aW9uXSk7XG4gICAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24oc2VxKTtcbiAgICB9LFxuXG4gICAgcHJlbG9hZF9zb3VuZDogZnVuY3Rpb24gcHJlbG9hZF9zb3VuZCgpIHtcbiAgICAgICAgdmFyIHVybCA9IGNjLnVybC5yYXcoXCJyZXNvdXJjZXMvc291bmRzL2FudF9pc19ob21lLm1wM1wiKTtcbiAgICAgICAgY2MubG9hZGVyLmxvYWRSZXModXJsLCBmdW5jdGlvbiAoKSB7fSk7XG5cbiAgICAgICAgdXJsID0gY2MudXJsLnJhdyhcInJlc291cmNlcy9zb3VuZHMvYW50X2lzX3N0cm9uZy5tcDNcIik7XG4gICAgICAgIGNjLmxvYWRlci5sb2FkUmVzKHVybCwgZnVuY3Rpb24gKCkge30pO1xuXG4gICAgICAgIHVybCA9IGNjLnVybC5yYXcoXCJyZXNvdXJjZXMvc291bmRzL2NsaWNrX2NvZmYubXAzXCIpO1xuICAgICAgICBjYy5sb2FkZXIubG9hZFJlcyh1cmwsIGZ1bmN0aW9uICgpIHt9KTtcblxuICAgICAgICB1cmwgPSBjYy51cmwucmF3KFwicmVzb3VyY2VzL3NvdW5kcy9jbGlja19saW5nZGFuZy5tcDNcIik7XG4gICAgICAgIGNjLmxvYWRlci5sb2FkUmVzKHVybCwgZnVuY3Rpb24gKCkge30pO1xuXG4gICAgICAgIHVybCA9IGNjLnVybC5yYXcoXCJyZXNvdXJjZXMvc291bmRzL3dhdG9yX2Zlbmd6aGFuZy5tcDNcIik7XG4gICAgICAgIGNjLmxvYWRlci5sb2FkUmVzKHVybCwgZnVuY3Rpb24gKCkge30pO1xuXG4gICAgICAgIHVybCA9IGNjLnVybC5yYXcoXCJyZXNvdXJjZXMvc291bmRzL2FudDAxX2NoZWZfY2xpY2subXAzXCIpO1xuICAgICAgICBjYy5sb2FkZXIubG9hZFJlcyh1cmwsIGZ1bmN0aW9uICgpIHt9KTtcblxuICAgICAgICB1cmwgPSBjYy51cmwucmF3KFwicmVzb3VyY2VzL3NvdW5kcy9hbnQwMl9jaGVmX2NsaWNrLm1wM1wiKTtcbiAgICAgICAgY2MubG9hZGVyLmxvYWRSZXModXJsLCBmdW5jdGlvbiAoKSB7fSk7XG5cbiAgICAgICAgdXJsID0gY2MudXJsLnJhdyhcInJlc291cmNlcy9zb3VuZHMvYW50MDNfY2hlZl9jbGljay5tcDNcIik7XG4gICAgICAgIGNjLmxvYWRlci5sb2FkUmVzKHVybCwgZnVuY3Rpb24gKCkge30pO1xuICAgIH0sXG5cbiAgICBwbGF5X3NvdW5kOiBmdW5jdGlvbiBwbGF5X3NvdW5kKG5hbWUpIHtcbiAgICAgICAgdmFyIHVybF9kYXRhID0gY2MudXJsLnJhdyhuYW1lKTtcbiAgICAgICAgY2MuYXVkaW9FbmdpbmUuc3RvcE11c2ljKCk7XG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlNdXNpYyh1cmxfZGF0YSk7XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLnByZWxvYWRfc291bmQoKTtcblxuICAgICAgICB0aGlzLmFudF9jaGVmX3NvdW5kID0gW1wicmVzb3VyY2VzL3NvdW5kcy9hbnQwMV9jaGVmX2NsaWNrLm1wM1wiLCBcInJlc291cmNlcy9zb3VuZHMvYW50MDJfY2hlZl9jbGljay5tcDNcIiwgXCJyZXNvdXJjZXMvc291bmRzL2FudDAzX2NoZWZfY2xpY2subXAzXCJdO1xuICAgICAgICB0aGlzLmFudF9zb3VuZF9pbmRleCA9IDA7XG5cbiAgICAgICAgdGhpcy5za2VfY29mZiA9IGNjLmZpbmQoXCJVSV9ST09UL21vdmluZ19yb290L2FuY2hvci1jZW50ZXIvY29mZl9jbGlja19ub2RlL3NrZV9jb2ZmY2FwXCIpO1xuICAgICAgICB0aGlzLmlzX2NvZmZfY2xpY2tpbmcgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLmlzX2FudF9yZXNjdWVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc2tlX2FudCA9IGNjLmZpbmQoXCJVSV9ST09UL21vdmluZ19yb290L2FuY2hvci1jZW50ZXIvYW50X3Jvb3Qvc2tlX2FudF9jb2ZmXCIpO1xuXG4gICAgICAgIHRoaXMuaXNfY2FsbF9hbnRfcWV1ZSA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMud2F0ZXJfZG90X3BsYXlpbmdfc3RhdGUgPSAwO1xuICAgICAgICB0aGlzLndhdGVyX2FuaW1fY29tID0gY2MuZmluZChcIlVJX1JPT1QvbW92aW5nX3Jvb3QvYW5jaG9yLWNlbnRlci9jYXN0bGVfcm9vdC9za2VfZHJvcGxldHN6ZmNcIikuZ2V0Q29tcG9uZW50KHNwLlNrZWxldG9uKTtcbiAgICAgICAgdGhpcy5mZW5nY2hlX2NvbSA9IGNjLmZpbmQoXCJVSV9ST09UL21vdmluZ19yb290L2FuY2hvci1jZW50ZXIvY2FzdGxlX3Jvb3Qvc2tlX2ZlbmdjaGVcIikuZ2V0Q29tcG9uZW50KHNwLlNrZWxldG9uKTtcbiAgICAgICAgdGhpcy5jYWxsX2xhdHRlcigoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5zdGFydF93YXRvcl9hbmltKCk7XG4gICAgICAgIH0pLmJpbmQodGhpcyksIDAuNSk7XG5cbiAgICAgICAgdGhpcy5sb2NrX2ZlbmdjaGVfY2xpY2sgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5sb2NrX2ZlbmdjaGVfY2xpY2syID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5jaGVmX2FudF9jb21wID0gY2MuZmluZChcIlVJX1JPT1QvbW92aW5nX3Jvb3QvYW5jaG9yLWNlbnRlci9hbnRfcm9vdC9hbnRfdW5kZXIvYW50X2NoZWZcIikuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbik7XG5cbiAgICAgICAgdGhpcy5sb2NrX2NsaWNrX2xlZnRfeWV6aSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmlzX21vdmVfZG93biA9IGZhbHNlO1xuICAgICAgICAvLyDmtYvor5VcbiAgICAgICAgLy8gdGhpcy5tb3ZlX3RvX2dyb3VuZF9kb3duKCk7XG5cbiAgICAgICAgLy8gdGhpcy5hbnRfdTAxX2NvbXAgPSBjYy5maW5kKFwiVUlfUk9PVC9tb3Zpbmdfcm9vdC9hbmNob3ItY2VudGVyL2FudF9yb290L2FudF91bmRlci9hbnRfdTAxXCIpLmdldENvbXBvbmVudChjYy5BbmltYXRpb24pO1xuICAgICAgICAvLyB0aGlzLmFudF91MDJfY29tcCA9IGNjLmZpbmQoXCJVSV9ST09UL21vdmluZ19yb290L2FuY2hvci1jZW50ZXIvYW50X3Jvb3QvYW50X3VuZGVyL2FudF91MDJcIikuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbik7XG4gICAgICAgIC8vIHRoaXMuYW50X3UwM19jb21wID0gY2MuZmluZChcIlVJX1JPT1QvbW92aW5nX3Jvb3QvYW5jaG9yLWNlbnRlci9hbnRfcm9vdC9hbnRfdW5kZXIvYW50X3UwM1wiKS5nZXRDb21wb25lbnQoY2MuQW5pbWF0aW9uKTtcblxuICAgICAgICAvKnRoaXMuY2FsbF9sYXR0ZXIoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGxheV91bmRlcl9ncm91bmRfYW50MV9hbmltKCk7XHJcbiAgICAgICAgICAgIHRoaXMucGxheV91bmRlcl9ncm91bmRfYW50Ml9hbmltKCk7XHJcbiAgICAgICAgICAgIHRoaXMucGxheV91bmRlcl9ncm91bmRfYW50M19hbmltKCk7XHJcbiAgICAgICAgfS5iaW5kKHRoaXMpLCAxKTsqL1xuICAgIH0sXG5cbiAgICBvbl9jbGlja19sZWZ0X3NodXllOiBmdW5jdGlvbiBvbl9jbGlja19sZWZ0X3NodXllKCkge1xuICAgICAgICBpZiAodGhpcy5pc19tb3ZlX2Rvd24gPT09IGZhbHNlIHx8IHRoaXMubG9ja19jbGlja19sZWZ0X3llemkgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubG9ja19jbGlja19sZWZ0X3llemkgPSB0cnVlO1xuICAgICAgICB2YXIgbGVmdF90cmVlX2NvbXAgPSBjYy5maW5kKFwiVUlfUk9PVC9tb3Zpbmdfcm9vdC9hbmNob3ItY2VudGVyL21hc2tfc2h1eWUvdHJlZV8yXCIpLmdldENvbXBvbmVudChjYy5BbmltYXRpb24pO1xuICAgICAgICBsZWZ0X3RyZWVfY29tcC5wbGF5KFwibGVmdF95ZXppX21vdmUxXCIpO1xuXG4gICAgICAgIHZhciBjbGlja19ub2RlID0gY2MuZmluZChcIlVJX1JPT1QvbW92aW5nX3Jvb3QvYW5jaG9yLWNlbnRlci9tYXNrX3NodXllL3RyZWVfY2xpY2tcIik7XG4gICAgICAgIGlmIChjbGlja19ub2RlKSB7XG4gICAgICAgICAgICBjbGlja19ub2RlLnJlbW92ZUZyb21QYXJlbnQodHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcGxheV91bmRlcl9ncm91bmRfYW50MV9hbmltOiBmdW5jdGlvbiBwbGF5X3VuZGVyX2dyb3VuZF9hbnQxX2FuaW0oKSB7XG5cbiAgICAgICAgLy8gdmFyIHJfdGltZSA9IDIgKyA0ICogTWF0aC5yYW5kb20oKTtcbiAgICAgICAgLy8gcl90aW1lID0gTWF0aC5mbG9vcihyX3RpbWUpO1xuICAgICAgICB2YXIgcl90aW1lID0gMTtcbiAgICAgICAgdGhpcy5jYWxsX2xhdHRlcigoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGNvbXAgPSBjYy5maW5kKFwiVUlfUk9PVC9tb3Zpbmdfcm9vdC9hbmNob3ItY2VudGVyL2FudF9yb290L2FudF91bmRlci9hbnRfdTAxXCIpLmdldENvbXBvbmVudChjYy5BbmltYXRpb24pO1xuICAgICAgICAgICAgY29tcC5wbGF5KFwiYW50X3VuZGVyX21vdmUwMVwiKTtcbiAgICAgICAgfSkuYmluZCh0aGlzKSwgcl90aW1lKTtcblxuICAgICAgICB0aGlzLmNhbGxfbGF0dGVyKChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnBsYXlfdW5kZXJfZ3JvdW5kX2FudDFfYW5pbSgpO1xuICAgICAgICB9KS5iaW5kKHRoaXMpLCByX3RpbWUgKyA4KTtcbiAgICB9LFxuXG4gICAgcGxheV91bmRlcl9ncm91bmRfYW50Ml9hbmltOiBmdW5jdGlvbiBwbGF5X3VuZGVyX2dyb3VuZF9hbnQyX2FuaW0oKSB7XG4gICAgICAgIC8vIHZhciByX3RpbWUgPSAyICsgNCAqIE1hdGgucmFuZG9tKCk7XG4gICAgICAgIC8vIHJfdGltZSA9IE1hdGguZmxvb3Iocl90aW1lKTtcbiAgICAgICAgdmFyIHJfdGltZSA9IDEuNztcbiAgICAgICAgdGhpcy5jYWxsX2xhdHRlcigoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGNvbXAgPSBjYy5maW5kKFwiVUlfUk9PVC9tb3Zpbmdfcm9vdC9hbmNob3ItY2VudGVyL2FudF9yb290L2FudF91bmRlci9hbnRfdTAyXCIpLmdldENvbXBvbmVudChjYy5BbmltYXRpb24pO1xuICAgICAgICAgICAgY29tcC5wbGF5KFwiYW50X3VuZGVyX21vdmUwMlwiKTtcbiAgICAgICAgfSkuYmluZCh0aGlzKSwgcl90aW1lKTtcblxuICAgICAgICB0aGlzLmNhbGxfbGF0dGVyKChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnBsYXlfdW5kZXJfZ3JvdW5kX2FudDJfYW5pbSgpO1xuICAgICAgICB9KS5iaW5kKHRoaXMpLCByX3RpbWUgKyA4KTtcbiAgICB9LFxuXG4gICAgcGxheV91bmRlcl9ncm91bmRfYW50M19hbmltOiBmdW5jdGlvbiBwbGF5X3VuZGVyX2dyb3VuZF9hbnQzX2FuaW0oKSB7XG4gICAgICAgIC8vIHZhciByX3RpbWUgPSAyICsgNCAqIE1hdGgucmFuZG9tKCk7XG4gICAgICAgIC8vIHJfdGltZSA9IE1hdGguZmxvb3Iocl90aW1lKTtcbiAgICAgICAgdmFyIHJfdGltZSA9IDIuNDtcbiAgICAgICAgdGhpcy5jYWxsX2xhdHRlcigoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGNvbXAgPSBjYy5maW5kKFwiVUlfUk9PVC9tb3Zpbmdfcm9vdC9hbmNob3ItY2VudGVyL2FudF9yb290L2FudF91bmRlci9hbnRfdTAzXCIpLmdldENvbXBvbmVudChjYy5BbmltYXRpb24pO1xuICAgICAgICAgICAgY29tcC5wbGF5KFwiYW50X3VuZGVyX21vdmUwM1wiKTtcbiAgICAgICAgfSkuYmluZCh0aGlzKSwgcl90aW1lKTtcblxuICAgICAgICB0aGlzLmNhbGxfbGF0dGVyKChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnBsYXlfdW5kZXJfZ3JvdW5kX2FudDNfYW5pbSgpO1xuICAgICAgICB9KS5iaW5kKHRoaXMpLCByX3RpbWUgKyAxMCk7XG4gICAgfSxcblxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG5cbiAgICBzdGFydF9hbnRfZm9vZF9hbmltOiBmdW5jdGlvbiBzdGFydF9hbnRfZm9vZF9hbmltKCkge1xuICAgICAgICB2YXIgdGltZSA9IDAuMTtcblxuICAgICAgICB2YXIgYW50X25vMSA9IGNjLmZpbmQoXCJVSV9ST09UL21vdmluZ19yb290L2FuY2hvci1jZW50ZXIvYW50X3Jvb3QvYW50X3FlcXVlL2FudF9ubzFcIik7XG4gICAgICAgIHZhciBhbnRfbm8xX2NvbSA9IGFudF9ubzEuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbik7XG4gICAgICAgIGFudF9ubzFfY29tLnBsYXkoXCJhbnRfZm9vZFwiKTtcblxuICAgICAgICB0aW1lID0gdGhpcy5hbnRfZm9vZF9kdXJhdGlvbjtcbiAgICAgICAgdGhpcy5jYWxsX2xhdHRlcigoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGFudF9ubzIgPSBjYy5maW5kKFwiVUlfUk9PVC9tb3Zpbmdfcm9vdC9hbmNob3ItY2VudGVyL2FudF9yb290L2FudF9xZXF1ZS9hbnRfbm8yXCIpO1xuICAgICAgICAgICAgdmFyIGFudF9ubzJfY29tID0gYW50X25vMi5nZXRDb21wb25lbnQoY2MuQW5pbWF0aW9uKTtcbiAgICAgICAgICAgIGFudF9ubzJfY29tLnBsYXkoXCJhbnRfZm9vZFwiKTtcbiAgICAgICAgICAgIHRoaXMucGxheV9zb3VuZChcInJlc291cmNlcy9zb3VuZHMvYW50X2lzX3N0cm9uZy5tcDNcIik7XG4gICAgICAgIH0pLmJpbmQodGhpcyksIHRpbWUpO1xuXG4gICAgICAgIHRpbWUgPSB0aW1lICsgdGhpcy5hbnRfZm9vZF9kdXJhdGlvbjtcbiAgICAgICAgdGhpcy5jYWxsX2xhdHRlcigoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGFudF9ubzMgPSBjYy5maW5kKFwiVUlfUk9PVC9tb3Zpbmdfcm9vdC9hbmNob3ItY2VudGVyL2FudF9yb290L2FudF9xZXF1ZS9hbnRfbm8zXCIpO1xuICAgICAgICAgICAgdmFyIGFudF9ubzNfY29tID0gYW50X25vMy5nZXRDb21wb25lbnQoY2MuQW5pbWF0aW9uKTtcbiAgICAgICAgICAgIGFudF9ubzNfY29tLnBsYXkoXCJhbnRfZm9vZFwiKTtcbiAgICAgICAgfSkuYmluZCh0aGlzKSwgdGltZSk7XG5cbiAgICAgICAgdGltZSA9IHRpbWUgKyB0aGlzLmFudF9mb29kX2R1cmF0aW9uO1xuICAgICAgICB0aGlzLmNhbGxfbGF0dGVyKChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgYW50X25vNCA9IGNjLmZpbmQoXCJVSV9ST09UL21vdmluZ19yb290L2FuY2hvci1jZW50ZXIvYW50X3Jvb3QvYW50X3FlcXVlL2FudF9ubzRcIik7XG4gICAgICAgICAgICB2YXIgYW50X25vNF9jb20gPSBhbnRfbm80LmdldENvbXBvbmVudChjYy5BbmltYXRpb24pO1xuICAgICAgICAgICAgYW50X25vNF9jb20ucGxheShcImFudF9mb29kXCIpO1xuICAgICAgICB9KS5iaW5kKHRoaXMpLCB0aW1lKTtcblxuICAgICAgICB0aW1lID0gdGltZSArIHRoaXMuYW50X2Zvb2RfZHVyYXRpb247XG4gICAgICAgIHRoaXMuY2FsbF9sYXR0ZXIoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBhbnRfbm81ID0gY2MuZmluZChcIlVJX1JPT1QvbW92aW5nX3Jvb3QvYW5jaG9yLWNlbnRlci9hbnRfcm9vdC9hbnRfcWVxdWUvYW50X25vNVwiKTtcbiAgICAgICAgICAgIHZhciBhbnRfbm81X2NvbSA9IGFudF9ubzUuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbik7XG4gICAgICAgICAgICBhbnRfbm81X2NvbS5wbGF5KFwiYW50X2Zvb2RcIik7XG4gICAgICAgIH0pLmJpbmQodGhpcyksIHRpbWUpO1xuXG4gICAgICAgIHRpbWUgPSB0aW1lICsgdGhpcy5hbnRfZm9vZF9hbmltX3RpbWU7XG4gICAgICAgIHRoaXMuY2FsbF9sYXR0ZXIoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIOWIh+aNouWIsOWcsOS4i1xuICAgICAgICAgICAgdGhpcy5tb3ZlX3RvX2dyb3VuZF9kb3duKCk7XG4gICAgICAgIH0pLmJpbmQodGhpcyksIHRpbWUpO1xuICAgIH0sXG5cbiAgICBtb3ZlX3RvX2dyb3VuZF9kb3duOiBmdW5jdGlvbiBtb3ZlX3RvX2dyb3VuZF9kb3duKCkge1xuICAgICAgICB2YXIgbGVmdF90cmVlX2NvbXAgPSBjYy5maW5kKFwiVUlfUk9PVC9tb3Zpbmdfcm9vdC9hbmNob3ItY2VudGVyL21hc2tfc2h1eWUvdHJlZV8yXCIpLmdldENvbXBvbmVudChjYy5BbmltYXRpb24pO1xuICAgICAgICBsZWZ0X3RyZWVfY29tcC5wbGF5KFwibGVmdF95ZXppX21vdmUwXCIpO1xuXG4gICAgICAgIHZhciB0cmVlXzEgPSBjYy5maW5kKFwiVUlfUk9PVC9tb3Zpbmdfcm9vdC9hbmNob3ItY2VudGVyL21hc2tfc2h1eWUvdHJlZV8xXCIpLmdldENvbXBvbmVudChjYy5BbmltYXRpb24pO1xuICAgICAgICB0cmVlXzEucGxheShcInRyZWVfMV9tb3ZlXCIpO1xuXG4gICAgICAgIHZhciB0cmVfMyA9IGNjLmZpbmQoXCJVSV9ST09UL21vdmluZ19yb290L2FuY2hvci1jZW50ZXIvbWFza19zaHV5ZS90cmVlXzNcIikuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbik7XG4gICAgICAgIHRyZV8zLnBsYXkoXCJ0cmVlXzNfbW92ZVwiKTtcblxuICAgICAgICB2YXIgbW92ZV9ieSA9IGNjLm1vdmVCeSgxLCAwLCAyNzAgKiAyKTtcbiAgICAgICAgdmFyIG1vdmluZ19yb290ID0gY2MuZmluZChcIlVJX1JPT1QvbW92aW5nX3Jvb3RcIik7XG4gICAgICAgIG1vdmluZ19yb290LnJ1bkFjdGlvbihtb3ZlX2J5KTtcbiAgICAgICAgdGhpcy5wbGF5X3NvdW5kKFwicmVzb3VyY2VzL3NvdW5kcy9hbnRfaXNfaG9tZS5tcDNcIik7XG4gICAgICAgIHRoaXMuaXNfbW92ZV9kb3duID0gdHJ1ZTtcbiAgICB9LFxuXG4gICAgb25fY29mZl9jbGljazogZnVuY3Rpb24gb25fY29mZl9jbGljaygpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNfY29mZl9jbGlja2luZyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucGxheV9zb3VuZChcInJlc291cmNlcy9zb3VuZHMvY2xpY2tfY29mZi5tcDNcIik7XG4gICAgICAgIHRoaXMuaXNfY29mZl9jbGlja2luZyA9IHRydWU7XG4gICAgICAgIHZhciBza2VfY29tcCA9IHRoaXMuc2tlX2NvZmYuZ2V0Q29tcG9uZW50KHNwLlNrZWxldG9uKTtcbiAgICAgICAgc2tlX2NvbXAuY2xlYXJUcmFja3MoKTtcbiAgICAgICAgc2tlX2NvbXAuc2V0QW5pbWF0aW9uKDAsIFwiY29mZmNhcF9vcGVuXCIsIGZhbHNlKTtcblxuICAgICAgICB0aGlzLmNhbGxfbGF0dGVyKChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBza2VfY29tcC5jbGVhclRyYWNrcygpO1xuICAgICAgICAgICAgLy8gc2tlX2NvbXAuc2V0QW5pbWF0aW9uKDAsIFwiY29mZmNhcF9kb3Vkb25nXCIsIHRydWUpO1xuICAgICAgICAgICAgLy8gc2tlX2NvbXAuY2xlYXJUcmFja3MoKTtcbiAgICAgICAgICAgIHNrZV9jb21wLnNldFRvU2V0dXBQb3NlKCk7XG5cbiAgICAgICAgICAgIHRoaXMuaXNfY29mZl9jbGlja2luZyA9IGZhbHNlO1xuICAgICAgICB9KS5iaW5kKHRoaXMpLCAzKTtcblxuICAgICAgICBpZiAodGhpcy5pc19hbnRfcmVzY3VlZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHRoaXMuaXNfYW50X3Jlc2N1ZWQgPSB0cnVlO1xuICAgICAgICAgICAgdmFyIGFuaW0gPSB0aGlzLnNrZV9hbnQuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbik7XG4gICAgICAgICAgICBhbmltLnBsYXkoXCJjb2ZmX2FudF9tb3ZlXCIpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uX2NhbGxfYW50X3FldWVfY2xpY2s6IGZ1bmN0aW9uIG9uX2NhbGxfYW50X3FldWVfY2xpY2soKSB7XG4gICAgICAgIGlmICh0aGlzLmlzX2NhbGxfYW50X3FldWUgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaXNfY2FsbF9hbnRfcWV1ZSA9IHRydWU7XG4gICAgICAgIHRoaXMucGxheV9zb3VuZChcInJlc291cmNlcy9zb3VuZHMvY2xpY2tfbGluZ2RhbmcubXAzXCIpO1xuXG4gICAgICAgIHZhciBiZWxsX2NvbXAgPSBjYy5maW5kKFwiVUlfUk9PVC9tb3Zpbmdfcm9vdC9hbmNob3ItY2VudGVyL3NrZV9EZmxvd0RMSGFcIikuZ2V0Q29tcG9uZW50KHNwLlNrZWxldG9uKTtcbiAgICAgICAgYmVsbF9jb21wLmNsZWFyVHJhY2tzKCk7XG4gICAgICAgIGJlbGxfY29tcC5zZXRBbmltYXRpb24oMCwgXCJkaWFuamlkb3Vkb25nXCIsIGZhbHNlKTtcbiAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGJlbGxfY29tcC5jbGVhclRyYWNrcygpO1xuICAgICAgICAgICAgYmVsbF9jb21wLnNldEFuaW1hdGlvbigwLCBcIkxpbmdkYW5naHVheWFvYmFpXCIsIHRydWUpO1xuICAgICAgICB9KS5iaW5kKHRoaXMpLCAxKTtcblxuICAgICAgICAvLyDmkq3mlL7omoLomoHliqjnlLtcbiAgICAgICAgdGhpcy5zdGFydF9hbnRfZm9vZF9hbmltKCk7XG4gICAgICAgIC8vIGVuZFxuICAgIH0sXG5cbiAgICBzdGFydF93YXRvcl9hbmltOiBmdW5jdGlvbiBzdGFydF93YXRvcl9hbmltKCkge1xuICAgICAgICB0aGlzLndhdGVyX2FuaW1fY29tLmNsZWFyVHJhY2tzKCk7XG4gICAgICAgIHRoaXMud2F0ZXJfYW5pbV9jb20uc2V0QW5pbWF0aW9uKDAsIFwic2h1aXpodWNodXhpYW5cIiwgZmFsc2UpO1xuICAgICAgICB0aGlzLmNhbGxfbGF0dGVyKChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLndhdGVyX2FuaW1fY29tLmNsZWFyVHJhY2tzKCk7XG4gICAgICAgICAgICB0aGlzLndhdGVyX2FuaW1fY29tLnNldEFuaW1hdGlvbigwLCBcInNodWl6aHVcIiwgdHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLndhdGVyX2RvdF9wbGF5aW5nX3N0YXRlID0gMTtcbiAgICAgICAgfSkuYmluZCh0aGlzKSwgMSk7XG4gICAgfSxcblxuICAgIG9uX2NhbGxfd2F0ZXJfZG90X2NsaWNrOiBmdW5jdGlvbiBvbl9jYWxsX3dhdGVyX2RvdF9jbGljaygpIHtcbiAgICAgICAgaWYgKHRoaXMud2F0ZXJfZG90X3BsYXlpbmdfc3RhdGUgIT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy53YXRlcl9kb3RfcGxheWluZ19zdGF0ZSA9IDI7XG4gICAgICAgIHRoaXMud2F0ZXJfYW5pbV9jb20uY2xlYXJUcmFja3MoKTtcbiAgICAgICAgdGhpcy53YXRlcl9hbmltX2NvbS5zZXRBbmltYXRpb24oMCwgXCJkcm9wbGVfc2h1aXpodWZlbmdjaGVcIiwgZmFsc2UpO1xuXG4gICAgICAgIHRoaXMubG9ja19mZW5nY2hlX2NsaWNrID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLmNhbGxfbGF0dGVyKChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmZlbmdjaGVfY29tLmNsZWFyVHJhY2tzKCk7XG4gICAgICAgICAgICB0aGlzLmZlbmdjaGVfY29tLnNldEFuaW1hdGlvbigwLCBcImZlbmdjaGV6aHVhbmRvbmdcIiwgZmFsc2UpO1xuICAgICAgICAgICAgdGhpcy5wbGF5X3NvdW5kKFwicmVzb3VyY2VzL3NvdW5kcy93YXRvcl9mZW5nemhhbmcubXAzXCIpO1xuICAgICAgICB9KS5iaW5kKHRoaXMpLCAyLjgpO1xuXG4gICAgICAgIHRoaXMuY2FsbF9sYXR0ZXIoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMubG9ja19mZW5nY2hlX2NsaWNrID0gZmFsc2U7XG4gICAgICAgIH0pLmJpbmQodGhpcyksIDIuOCArIDMpO1xuXG4gICAgICAgIHRoaXMuY2FsbF9sYXR0ZXIoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRfd2F0b3JfYW5pbSgpO1xuICAgICAgICB9KS5iaW5kKHRoaXMpLCAxMCk7XG4gICAgfSxcblxuICAgIG9uX2ZlbmdjaGVfY2xpY2s6IGZ1bmN0aW9uIG9uX2ZlbmdjaGVfY2xpY2soKSB7XG4gICAgICAgIGlmICh0aGlzLmxvY2tfZmVuZ2NoZV9jbGljazIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmxvY2tfZmVuZ2NoZV9jbGljaykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubG9ja19mZW5nY2hlX2NsaWNrMiA9IHRydWU7XG4gICAgICAgIHRoaXMuZmVuZ2NoZV9jb20uY2xlYXJUcmFja3MoKTtcbiAgICAgICAgdGhpcy5mZW5nY2hlX2NvbS5zZXRBbmltYXRpb24oMCwgXCJmZW5nY2hlemh1YW5kb25nXCIsIGZhbHNlKTtcbiAgICAgICAgdGhpcy5jYWxsX2xhdHRlcigoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5sb2NrX2ZlbmdjaGVfY2xpY2syID0gZmFsc2U7XG4gICAgICAgIH0pLmJpbmQodGhpcyksIDMpO1xuICAgIH0sXG5cbiAgICAvLyDlv4XpobvliqDplIHvvIzml7bpl7TlhbPns7vvvIzmmoLml7bkuI3liqBcbiAgICBvbl9jaGVmX2FudF9jbGljazogZnVuY3Rpb24gb25fY2hlZl9hbnRfY2xpY2soKSB7XG4gICAgICAgIHRoaXMuY2hlZl9hbnRfY29tcC5wbGF5KFwiYW50X2NoZWZfaGVsbG9cIik7XG4gICAgICAgIHRoaXMuY2FsbF9sYXR0ZXIoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuY2hlZl9hbnRfY29tcC5wbGF5KFwiYW50X2NoZWZfaWRsZVwiKTtcbiAgICAgICAgfSkuYmluZCh0aGlzKSwgMS4yKTtcblxuICAgICAgICB0aGlzLnBsYXlfc291bmQodGhpcy5hbnRfY2hlZl9zb3VuZFt0aGlzLmFudF9zb3VuZF9pbmRleF0pO1xuICAgICAgICB0aGlzLmFudF9zb3VuZF9pbmRleCsrO1xuICAgICAgICBpZiAodGhpcy5hbnRfc291bmRfaW5kZXggPj0gMykge1xuICAgICAgICAgICAgdGhpcy5hbnRfc291bmRfaW5kZXggPSAwO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc1MzRhNmJNbU1aSmxMUDZQVzhwbi9aZScsICdyYW5kb21fc2tlJyk7XG4vLyBzY3JpcHRzXFxyYW5kb21fc2tlLmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgYW5pbV9uYW1lOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogXCJcIixcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZ1xuICAgICAgICB9LFxuXG4gICAgICAgIGNsaWNrX2FuaW06IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBcIlwiLFxuICAgICAgICAgICAgdHlwZTogU3RyaW5nXG4gICAgICAgIH0sXG4gICAgICAgIGNsaWNrX2FuaW1fdGltZTogMC41XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge30sXG5cbiAgICBjYWxsX2xhdHRlcjogZnVuY3Rpb24gY2FsbF9sYXR0ZXIoY2FsbGZ1bmMsIGRlbGF5KSB7XG4gICAgICAgIHZhciBkZWxheV9hY3Rpb24gPSBjYy5kZWxheVRpbWUoZGVsYXkpO1xuICAgICAgICB2YXIgY2FsbF9hY3Rpb24gPSBjYy5jYWxsRnVuYyhjYWxsZnVuYywgdGhpcyk7XG4gICAgICAgIHZhciBzZXEgPSBjYy5zZXF1ZW5jZShbZGVsYXlfYWN0aW9uLCBjYWxsX2FjdGlvbl0pO1xuICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKHNlcSk7XG4gICAgfSxcblxuICAgIHN0YXJ0OiBmdW5jdGlvbiBzdGFydCgpIHtcbiAgICAgICAgdGhpcy5za2VfY29tID0gdGhpcy5ub2RlLmdldENvbXBvbmVudChzcC5Ta2VsZXRvbik7XG5cbiAgICAgICAgdmFyIHRpbWUgPSAwLjEgKyBNYXRoLnJhbmRvbSgpICogMC41O1xuICAgICAgICB0aGlzLmNhbGxfbGF0dGVyKChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnNrZV9jb20uY2xlYXJUcmFja3MoKTtcbiAgICAgICAgICAgIHRoaXMuc2tlX2NvbS5zZXRBbmltYXRpb24oMCwgdGhpcy5hbmltX25hbWUsIHRydWUpO1xuICAgICAgICB9KS5iaW5kKHRoaXMpLCB0aW1lKTtcbiAgICB9LFxuXG4gICAgb25fZmxvd19jbGljazogZnVuY3Rpb24gb25fZmxvd19jbGljaygpIHtcbiAgICAgICAgdGhpcy5za2VfY29tLmNsZWFyVHJhY2tzKCk7XG4gICAgICAgIHRoaXMuc2tlX2NvbS5zZXRBbmltYXRpb24oMCwgdGhpcy5jbGlja19hbmltLCBmYWxzZSk7XG4gICAgICAgIHRoaXMuY2FsbF9sYXR0ZXIoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuc2tlX2NvbS5jbGVhclRyYWNrcygpO1xuICAgICAgICAgICAgdGhpcy5za2VfY29tLnNldEFuaW1hdGlvbigwLCB0aGlzLmFuaW1fbmFtZSwgdHJ1ZSk7XG4gICAgICAgIH0pLmJpbmQodGhpcyksIHRoaXMuY2xpY2tfYW5pbV90aW1lKTtcbiAgICB9XG59KTtcbi8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4vLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4vLyB9LFxuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMDFiZmFmL3JpeE9iYkhkZlZYOEtDaCsnLCAnc3RhcnRfc2NlbmUnKTtcbi8vIHNjcmlwdHNcXHN0YXJ0X3NjZW5lLmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIC8vIGxvZ29cbiAgICAgICAgdmFyIGxvZ28gPSBjYy5maW5kKFwiVUlfUk9PVC9zdGFydF9sYXllci9sb2dvXCIpO1xuXG4gICAgICAgIGxvZ28ueSArPSA3MDA7XG4gICAgICAgIHZhciBtb3ZlMSA9IGNjLm1vdmVCeSgwLjIsIDAsIC03MTApO1xuICAgICAgICB2YXIgbW92ZTIgPSBjYy5tb3ZlQnkoMC4yLCAwLCAyMCk7XG4gICAgICAgIHZhciBtb3ZlMyA9IGNjLm1vdmVCeSgwLjEsIDAsIC0xMCk7XG5cbiAgICAgICAgdmFyIHN0YXJ0X2J1dHRvbiA9IGNjLmZpbmQoXCJVSV9ST09UL3N0YXJ0X2xheWVyL3N0YXJ0X2J1dHRvblwiKTtcbiAgICAgICAgc3RhcnRfYnV0dG9uLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB2YXIgY2FsbGZ1bmMgPSBjYy5jYWxsRnVuYygoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc3RhcnRfYnV0dG9uLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICBzdGFydF9idXR0b24uc2NhbGUgPSAzLjU7XG4gICAgICAgICAgICBzdGFydF9idXR0b24ub3BhY2l0eSA9IDA7XG4gICAgICAgICAgICB2YXIgc2NhbGUxID0gY2Muc2NhbGVUbygwLjMsIDAuOCk7XG4gICAgICAgICAgICB2YXIgc2NhbGUyID0gY2Muc2NhbGVUbygwLjIsIDEuMik7XG4gICAgICAgICAgICB2YXIgc2NhbGUzID0gY2Muc2NhbGVUbygwLjEsIDEuMCk7XG4gICAgICAgICAgICB2YXIgc2VxID0gY2Muc2VxdWVuY2UoW3NjYWxlMSwgc2NhbGUyLCBzY2FsZTNdKTtcbiAgICAgICAgICAgIHN0YXJ0X2J1dHRvbi5ydW5BY3Rpb24oc2VxKTtcbiAgICAgICAgICAgIHZhciBmaW4gPSBjYy5mYWRlSW4oMC41KTtcbiAgICAgICAgICAgIHN0YXJ0X2J1dHRvbi5ydW5BY3Rpb24oZmluKTtcbiAgICAgICAgfSkuYmluZCh0aGlzKSwgdGhpcyk7XG5cbiAgICAgICAgdmFyIGRlbGF5ID0gY2MuZGVsYXlUaW1lKDAuNCk7XG4gICAgICAgIHZhciBzZXEgPSBjYy5zZXF1ZW5jZShbbW92ZTEsIG1vdmUyLCBtb3ZlMywgY2FsbGZ1bmNdKTtcbiAgICAgICAgbG9nby5ydW5BY3Rpb24oc2VxKTtcblxuICAgICAgICAvKnZhciBmaW4gPSBjYy5mYWRlVG8oMC4zLCAxMjApO1xyXG4gICAgICAgIHZhciBiZ19tYXNrID0gY2MuZmluZChcIlVJX1JPT1Qvc3RhcnRfbGF5ZXIvYmdfbWFza1wiKTsgXHJcbiAgICAgICAgYmdfbWFzay5vcGFjaXR5ID0gMDtcclxuICAgICAgICBiZ19tYXNrLnJ1bkFjdGlvbihmaW4pOyovXG4gICAgICAgIHRoaXMubG9ja19zdGFydCA9IGZhbHNlO1xuICAgIH0sXG5cbiAgICBjYWxsX2xhdHRlcjogZnVuY3Rpb24gY2FsbF9sYXR0ZXIoY2FsbGZ1bmMsIGRlbGF5KSB7XG4gICAgICAgIHZhciBkZWxheV9hY3Rpb24gPSBjYy5kZWxheVRpbWUoZGVsYXkpO1xuICAgICAgICB2YXIgY2FsbF9hY3Rpb24gPSBjYy5jYWxsRnVuYyhjYWxsZnVuYywgdGhpcyk7XG4gICAgICAgIHZhciBzZXEgPSBjYy5zZXF1ZW5jZShbZGVsYXlfYWN0aW9uLCBjYWxsX2FjdGlvbl0pO1xuICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKHNlcSk7XG4gICAgfSxcblxuICAgIG9uX3N0YXJ0X2NsaWNrOiBmdW5jdGlvbiBvbl9zdGFydF9jbGljaygpIHtcbiAgICAgICAgaWYgKHRoaXMubG9ja19zdGFydCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubG9ja19zdGFydCA9IHRydWU7XG4gICAgICAgIC8vIGxvZ29cbiAgICAgICAgdmFyIGxvZ28gPSBjYy5maW5kKFwiVUlfUk9PVC9zdGFydF9sYXllci9sb2dvXCIpO1xuXG4gICAgICAgIC8vIGxvZ28ueSArPSA0MDA7XG4gICAgICAgIHZhciBtb3ZlMSA9IGNjLm1vdmVCeSgwLjIsIDAsIDcxMCk7XG4gICAgICAgIHZhciBtb3ZlMiA9IGNjLm1vdmVCeSgwLjIsIDAsIC0yMCk7XG4gICAgICAgIHZhciBtb3ZlMyA9IGNjLm1vdmVCeSgwLjEsIDAsIDEwKTtcblxuICAgICAgICB2YXIgc2VxID0gY2Muc2VxdWVuY2UoW21vdmUzLCBtb3ZlMiwgbW92ZTFdKTtcbiAgICAgICAgbG9nby5ydW5BY3Rpb24oc2VxKTtcblxuICAgICAgICB2YXIgc3RhcnRfYnV0dG9uID0gY2MuZmluZChcIlVJX1JPT1Qvc3RhcnRfbGF5ZXIvc3RhcnRfYnV0dG9uXCIpO1xuICAgICAgICB2YXIgY2FsbGZ1bmMgPSBjYy5jYWxsRnVuYygoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc3RhcnRfYnV0dG9uLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICBzdGFydF9idXR0b24uc2NhbGUgPSAxLjA7XG4gICAgICAgICAgICBzdGFydF9idXR0b24ub3BhY2l0eSA9IDI1NTtcbiAgICAgICAgICAgIHZhciBzY2FsZTEgPSBjYy5zY2FsZVRvKDAuMywgMC44KTtcbiAgICAgICAgICAgIHZhciBzY2FsZTMgPSBjYy5zY2FsZVRvKDAuMywgMy41KTtcbiAgICAgICAgICAgIHZhciBzZXEgPSBjYy5zZXF1ZW5jZShbc2NhbGUxLCBzY2FsZTNdKTtcbiAgICAgICAgICAgIHN0YXJ0X2J1dHRvbi5ydW5BY3Rpb24oc2VxKTtcbiAgICAgICAgICAgIHZhciBmb3V0ID0gY2MuZmFkZU91dCgwLjYpO1xuICAgICAgICAgICAgc3RhcnRfYnV0dG9uLnJ1bkFjdGlvbihmb3V0KTtcbiAgICAgICAgfSkuYmluZCh0aGlzKSwgdGhpcyk7XG4gICAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24oY2FsbGZ1bmMpO1xuXG4gICAgICAgIHZhciBmb3V0ID0gY2MuZmFkZU91dCgwLjYpO1xuICAgICAgICB2YXIgYmdfbWFzayA9IGNjLmZpbmQoXCJVSV9ST09UL3N0YXJ0X2xheWVyL2JnX21hc2tcIik7XG4gICAgICAgIGJnX21hc2sucnVuQWN0aW9uKGZvdXQpO1xuXG4gICAgICAgIHRoaXMuY2FsbF9sYXR0ZXIoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMubm9kZS5yZW1vdmVGcm9tUGFyZW50KCk7XG4gICAgICAgIH0pLmJpbmQodGhpcyksIDAuOCk7XG4gICAgfVxufSk7XG4vLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuLy8gfSxcblxuY2MuX1JGcG9wKCk7Il19
