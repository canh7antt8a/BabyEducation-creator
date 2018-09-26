require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"frame_anim_second":[function(require,module,exports){
"use strict";
cc._RFpush(module, '562c1NKARFAWb88eTWQcn8k', 'frame_anim_second');
// scripts\frame_anim_second.js

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

        frame_sprite: {
            "default": [],
            type: cc.SpriteFrame
        },
        frame_duration: 0,
        loop: false,
        play_on_load: false,
        play_on_load_with_random_time: false,
        random_time_scale: false
    },

    call_latter: function call_latter(callfunc, delay) {
        var delay_action = cc.delayTime(delay);
        var call_action = cc.callFunc(callfunc, this);
        var seq = cc.sequence([delay_action, call_action]);
        this.node.runAction(seq);
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.frames_sp = this.frame_sprite;
        this.frame_count = this.frame_sprite.length;

        /*
        for(var i = 0; i < this.frame_count; i ++) {
            var url = cc.url.raw(this.name_prefix + (this.name_begin_index + i) + ".png");
            var sp = new cc.SpriteFrame(url);
            this.frames_sp.push(sp);
        }*/

        this.sp_comp = this.node.getComponent(cc.Sprite);
        if (!this.sp_comp) {
            this.sp_comp = this.node.addComponent(cc.Sprite);
        }
        this.sp_comp.spriteFrame = this.frames_sp[0];

        this.now_index = 0;
        this.pass_time = 0;
        this.anim_ended = true;
        if (this.play_on_load) {
            if (this.play_on_load_with_random_time) {
                var time = 0.01 + Math.random();
                this.call_latter((function () {
                    this.anim_ended = false;
                }).bind(this), time);
            } else {
                this.anim_ended = false;
            }
        }

        if (this.random_time_scale) {
            var t_s = 1.0 + 0.5 * Math.random();
            this.frame_duration *= t_s;
        }
        this.anim_end_func = null;
    },

    start: function start() {
        this.pass_time = 0;
    },

    play: function play(func) {
        this.pass_time = 0;
        this.anim_ended = false;
        this.anim_end_func = func;
        this.loop = false;
    },

    play_loop: function play_loop() {
        this.loop = true;
        this.pass_time = 0;
        this.anim_ended = false;
    },

    stop_anim: function stop_anim() {
        this.anim_ended = true;
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
                    this.sp_comp.spriteFrame = this.frames_sp[0];
                    this.now_index = 0;
                } else {
                    this.sp_comp.spriteFrame = this.frames_sp[index];
                    this.now_index = index;
                }
            }
        } else {
            if (this.now_index != index) {
                if (index >= this.frame_count) {
                    this.anim_ended = true;
                    if (this.anim_end_func) {
                        this.anim_end_func();
                    }
                } else {
                    this.now_index = index;
                    this.sp_comp.spriteFrame = this.frames_sp[index];
                }
            }
        }
    }
});

cc._RFpop();
},{}],"frame_anim":[function(require,module,exports){
"use strict";
cc._RFpush(module, '6d3a2fW0WRLraDpAqdobDmd', 'frame_anim');
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
        loop: false,
        play_on_load: false
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
        this.sp_comp.spriteFrame = this.frames_sp[0];

        this.now_index = 0;
        this.pass_time = 0;
        this.anim_ended = false;
        this.anim_ended = !this.play_on_load;

        this.anim_end_func = null;
    },

    start: function start() {
        this.pass_time = 0;
    },

    play: function play(func) {
        this.pass_time = 0;
        this.anim_ended = false;
        this.anim_end_func = func;
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
                    this.sp_comp.spriteFrame = this.frames_sp[0];
                    this.now_index = 0;
                } else {
                    this.sp_comp.spriteFrame = this.frames_sp[index];
                    this.now_index = index;
                }
            }
        } else {
            if (this.now_index != index) {
                if (index >= this.frame_count) {
                    this.anim_ended = true;
                    if (this.anim_end_func) {
                        this.anim_end_func();
                    }
                } else {
                    this.now_index = index;
                    this.sp_comp.spriteFrame = this.frames_sp[index];
                }
            }
        }
    }
});

cc._RFpop();
},{}],"loop_swing_action":[function(require,module,exports){
"use strict";
cc._RFpush(module, '89692Xs3b1Fa4+kWJrohAaY', 'loop_swing_action');
// scripts\loop_swing_action.js

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
        rot_time: 0.4,
        rot_degree: 20,
        start_time: 0.1
    },

    // use this for initialization
    onLoad: function onLoad() {
        if (this.start_time >= 0) {
            this.scheduleOnce((function () {
                this.run_action();
            }).bind(this), this.start_time);
        } else {
            this.run_action();
        }
    },

    run_action: function run_action() {
        var rot1 = cc.rotateTo(this.rot_time, this.rot_degree);
        var rot2 = cc.rotateTo(this.rot_time, -this.rot_degree);
        var seq = cc.sequence([rot1, rot2]);
        var repeat = cc.repeatForever(seq);
        this.node.runAction(repeat);
    }
});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"main_scene":[function(require,module,exports){
"use strict";
cc._RFpush(module, '1809bXS835FkI3PhFnrh+Au', 'main_scene');
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
        elem_count: 24,
        lock_elem_time: 0.6,
        lock_music_time: 15,
        wave_anim_duration: 0.8,

        play_wave_music_time: {
            "default": [],
            type: cc.Float
        },

        click_item_box: {
            "default": [],
            type: cc.Node
        },

        light_array: {
            "default": [],
            type: cc.Prefab
        }
    },

    preload_sound: function preload_sound() {
        var sound_list = ["resources/sounds/click.mp3", "resources/sounds/bass/elem_1.mp3", "resources/sounds/bass/elem_2.mp3", "resources/sounds/bass/elem_3.mp3", "resources/sounds/bass/elem_4.mp3", "resources/sounds/bass/elem_5.mp3", "resources/sounds/bass/elem_6.mp3", "resources/sounds/bass/elem_7.mp3", "resources/sounds/bass/elem_8.mp3", "resources/sounds/bass/elem_9.mp3", "resources/sounds/bass/elem_10.mp3", "resources/sounds/bass/elem_11.mp3", "resources/sounds/bass/elem_12.mp3", "resources/sounds/bass/elem_13.mp3", "resources/sounds/bass/elem_14.mp3", "resources/sounds/bass/elem_15.mp3", "resources/sounds/bass/elem_16.mp3", "resources/sounds/bass/elem_17.mp3", "resources/sounds/bass/elem_18.mp3", "resources/sounds/bass/elem_19.mp3", "resources/sounds/bass/elem_20.mp3", "resources/sounds/bass/elem_21.mp3", "resources/sounds/bass/elem_22.mp3", "resources/sounds/bass/elem_23.mp3", "resources/sounds/bass/elem_24.mp3", "resources/sounds/bass/mid_change.mp3", "resources/sounds/bass/hole.mp3"];

        for (var i = 0; i < sound_list.length; i++) {
            var url = cc.url.raw(sound_list[i]);
            cc.loader.loadRes(url, function () {});
        }
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

    start_light: function start_light(event) {
        if (!this.start_valid) {
            return;
        }
        this.start_valid = false;

        var end_x = event.getLocation().x;
        var end_y = event.getLocation().y;
        var center_pos = cc.p((end_x + this.start_x) * 0.5, (end_y + this.start_y) * 0.5);
        var is_left = end_x < this.start_x;

        var dir = cc.v2(end_x - this.start_x, end_y - this.start_y);
        var scale = dir.mag() / 540;
        // var scale = 1.0 + Math.random() * 0.5;
        this.on_water_click(cc.p(this.start_x, this.start_y), dir.signAngle(cc.v2(0, -1)), scale);
    },

    is_lighting_on: function is_lighting_on(is_on) {
        if (is_on) {
            this.white_bg.active = true;
            this.blue_bg.active = true;
            this.light_mask.opacity = 255;
            this.white_bg.runAction(cc.fadeIn(0.15));
            this.light_mask.active = true;
        } else {
            this.white_bg.active = true;
            this.blue_bg.opacity = 255;
            this.blue_bg.active = true;
            this.white_bg.runAction(cc.fadeOut(0.15));
            this.light_mask.runAction(cc.fadeOut(0.15));
        }
    },
    // use this for initialization
    onLoad: function onLoad() {
        this.preload_sound();

        this.anchor_root = cc.find("UI_ROOT/anchor-center");
        this.kim_cat_com = cc.find("UI_ROOT/anchor-center/kim_cat").getComponent("frame_anim_second");
        this.kim_sprite_com = cc.find("UI_ROOT/anchor-center/kim_cat").getComponent(cc.Sprite);

        this.yinfu = cc.find("UI_ROOT/anchor-center/yinfu");
        this.sp_yinfu = this.yinfu.getComponent(sp.Skeleton);

        var url = cc.url.raw("resources/frame_anim/cat_anim/cat_1.png");
        var sp2 = new cc.SpriteFrame(url);
        this.kim_idel_sp = sp2;
        this.light_mask = cc.find("UI_ROOT/anchor-center/light_mask");
        this.light_mask.active = false;

        this.lock_click = false;
        this.click_mode = 0;

        this.music_index = 1;
        this.start_valid = false;

        this.white_bg = cc.find("UI_ROOT/anchor-background/white");
        this.blue_bg = cc.find("UI_ROOT/anchor-background/blue");
        this.white_bg.active = false;
        this.node.on('touchstart', (function (event) {
            if (!this.anchor_root.active) {
                return;
            }

            for (var i = 0; i < this.click_item_box.length; i++) {
                var bound_box = this.click_item_box[i].getBoundingBox();
                var pos = this.click_item_box[i].getParent().convertTouchToNodeSpace(event);

                if (bound_box.contains(pos)) {
                    this.start_valid = true;
                    this.start_x = event.getLocation().x;
                    this.start_y = event.getLocation().y;
                    event.stopPropagation();
                }
            }
        }).bind(this));

        this.node.on('touchmove', (function (event) {}).bind(this));

        this.node.on('touchend', (function (event) {
            this.start_light(event);
        }).bind(this));

        this.node.on('touchcancel', (function (event) {
            this.start_light(event);
        }).bind(this));

        this.light_root = cc.find("UI_ROOT/anchor-center/light_root");
        this.click_pos_random = [];
    },

    start: function start() {},

    on_play_next: function on_play_next() {
        this.call_latter(this.play_middle_music.bind(this), this.wave_anim_duration);
    },

    play_middle_music: function play_middle_music() {
        this.play_sound("resources/sounds/bass/mid_change.mp3");

        this.sp_yinfu.clearTracks();
        this.sp_yinfu.setAnimation(0, "animation", true);

        this.call_latter((function () {
            this.play_hole_music();
        }).bind(this), 4.5);
    },

    on_play_music_ended: function on_play_music_ended() {
        this.sp_yinfu.clearTracks();
        this.yinfu.active = false;

        this.click_mode = 0;
        this.lock_click = false;
        this.music_index = 1;
        this.click_pos_random = [];
        this.light_root.removeAllChildren();
    },

    play_hole_music: function play_hole_music() {
        // this.mid_wave_anim_com.node.active = false;
        this.click_mode++;
        this.play_sound("resources/sounds/bass/hole.mp3");
        this.music_time = 0;
        this.music_index = 0;
        this.call_latter(this.on_play_music_ended.bind(this), this.lock_music_time);
    },

    play_cat_idle: function play_cat_idle() {
        this.kim_sprite_com.spriteFrame = this.kim_idel_sp;
    },

    play_wave_by_random: function play_wave_by_random(w_pos, angle, scale) {

        angle = -angle * 57.3;

        if (angle > 35) {
            angle = 35;
        }
        if (angle < -35) {
            angle = -35;
        }

        this.kim_cat_com.play(this.play_cat_idle.bind(this));

        // this.yinfu.active = true;
        // this.sp_yinfu.clearTracks();
        // this.sp_yinfu.setAnimation(0, "animation", false);

        // 播放闪电
        var random_num = [0, 1, 2];
        random_num.sort(function () {
            return Math.random() - 0.5;
        });
        // end

        var index = random_num[0];
        var prefab = cc.instantiate(this.light_array[index]);
        this.light_root.addChild(prefab);
        prefab.active = true;

        var pos = this.light_root.convertToNodeSpace(w_pos);

        prefab.x = pos.x;
        prefab.y = 539;
        prefab.scale = scale;

        prefab.rotation = angle;
        var frame_anim_com = prefab.getComponent("frame_anim");
        this.is_lighting_on(true);

        frame_anim_com.play((function () {
            prefab.removeFromParent();
            this.lock_click = false;
            this.is_lighting_on(false);
        }).bind(this));
    },

    on_water_click: function on_water_click(w_pos, angle, scale) {
        if (this.lock_click === true) {
            return;
        }
        this.click_pos_random.push([w_pos, angle, scale]);

        angle = -angle * 57.3;

        if (angle > 35) {
            angle = 35;
        }
        if (angle < -35) {
            angle = -35;
        }

        this.lock_click = true;

        this.kim_cat_com.play(this.play_cat_idle.bind(this));

        this.yinfu.active = true;
        this.sp_yinfu.clearTracks();
        this.sp_yinfu.setAnimation(0, "animation", false);

        this.play_sound("resources/sounds/bass/elem_" + this.music_index + ".mp3");
        if (this.music_index > 24) {
            // this.music_index = 1;
            this.call_latter(this.on_play_next.bind(this), this.lock_elem_time);
            return;
        }

        this.music_index++;
        this.click_mode++;

        // 播放闪电
        var random_num = [0, 1, 2];
        random_num.sort(function () {
            return Math.random() - 0.5;
        });
        // end

        var index = random_num[0];
        var prefab = cc.instantiate(this.light_array[index]);
        this.light_root.addChild(prefab);
        prefab.active = true;

        var pos = this.light_root.convertToNodeSpace(w_pos);

        prefab.x = pos.x;
        prefab.y = 539;
        prefab.scale = scale;

        prefab.rotation = angle;
        var frame_anim_com = prefab.getComponent("frame_anim");
        this.is_lighting_on(true);

        frame_anim_com.play((function () {
            prefab.removeFromParent();
            this.lock_click = false;
            this.is_lighting_on(false);
        }).bind(this));
        // end
    },

    update: function update(dt) {
        // 播放整首歌曲
        if (this.click_mode != this.elem_count + 1) {
            return;
        }

        if (this.music_index >= this.play_wave_music_time.length) {
            // 播放结束
            return;
        }

        this.music_time += dt;
        while (this.music_index < this.play_wave_music_time.length - 1 && this.music_time >= this.play_wave_music_time[this.music_index + 1]) {
            this.music_index++;
        }

        if (this.music_time >= this.play_wave_music_time[this.music_index]) {
            var index = this.music_index;
            while (index >= this.elem_count) {
                index -= this.elem_count;
            }
            this.play_wave_by_random(this.click_pos_random[index][0], this.click_pos_random[index][1], this.click_pos_random[index][2]); // 播放动画
            this.music_index++;
        }
        // end
    }
});

cc._RFpop();
},{}],"start_scene":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'e3ad98htAZEvo5P/8E1pTk/', 'start_scene');
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
        // this.preload_sound();
        this.lock_start = false;
    },

    call_latter: function call_latter(callfunc, delay) {
        var delay_action = cc.delayTime(delay);
        var call_action = cc.callFunc(callfunc, this);
        var seq = cc.sequence([delay_action, call_action]);
        this.node.runAction(seq);
    },

    play_sound: function play_sound(name) {
        var url_data = cc.url.raw(name);
        cc.audioEngine.stopMusic();
        cc.audioEngine.playMusic(url_data);
    },

    on_start_click: function on_start_click() {
        if (this.lock_start === true) {
            return;
        }
        var symbol_root = cc.find("UI_ROOT/start_layer/symbol_root");
        symbol_root.active = false;

        this.play_sound("resources/sounds/click.mp3");
        this.lock_start = true;
        // logo
        var logo = cc.find("UI_ROOT/start_layer/logo");

        // logo.y += 400;
        var move1 = cc.moveBy(0.2, 0, 710);
        var move2 = cc.moveBy(0.2, 0, -20);
        var move3 = cc.moveBy(0.1, 0, 10);

        var seq = cc.sequence([move3, move2, move1]);
        logo.runAction(seq);

        var callfunc = cc.callFunc((function () {
            var start_button = cc.find("UI_ROOT/start_layer/start_button");
            start_button.active = true;
            start_button.scale = 1.0;
            start_button.opacity = 255;
            var scale1 = cc.scaleTo(0.1, 0.8);
            var scale3 = cc.scaleTo(0.2, 1.2);
            var call = cc.callFunc((function () {
                var fout = cc.fadeOut(0.2);
                start_button.runAction(fout);
            }).bind(this), this);

            var call2 = cc.callFunc((function () {
                var bg_mask = cc.find("UI_ROOT/start_layer/bg_mask");
                bg_mask.opacity = 0;
                var fin = cc.fadeIn(0.8);
                bg_mask.runAction(fin);
            }).bind(this), this);
            var seq = cc.sequence([scale1, call, scale3, call2]);
            start_button.runAction(seq);
        }).bind(this), this);
        this.node.runAction(callfunc);

        /*
        var fout = cc.fadeIn(0.6);
        var bg_mask = cc.find("UI_ROOT/start_layer/bg_mask"); 
        bg_mask.runAction(fout);*/

        this.call_latter((function () {
            this.node.removeFromParent();
            var anchor_root = cc.find("UI_ROOT/anchor-center");
            anchor_root.active = true;
        }).bind(this), 1.0);
    }
});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}]},{},["main_scene","frame_anim_second","frame_anim","loop_swing_action","start_scene"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkY6L3NvZnR3YXJlcy9Db2Nvc0NyZWF0b3JfMV8wXzEvcmVzb3VyY2VzL2FwcC5hc2FyL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvc2NyaXB0cy9mcmFtZV9hbmltX3NlY29uZC5qcyIsImFzc2V0cy9zY3JpcHRzL2ZyYW1lX2FuaW0uanMiLCJhc3NldHMvc2NyaXB0cy9sb29wX3N3aW5nX2FjdGlvbi5qcyIsImFzc2V0cy9zY3JpcHRzL21haW5fc2NlbmUuanMiLCJhc3NldHMvc2NyaXB0cy9zdGFydF9zY2VuZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzU2MmMxTktBUkZBV2I4OGVUV1FjbjhrJywgJ2ZyYW1lX2FuaW1fc2Vjb25kJyk7XG4vLyBzY3JpcHRzXFxmcmFtZV9hbmltX3NlY29uZC5qc1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG5cbiAgICAgICAgZnJhbWVfc3ByaXRlOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogW10sXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVGcmFtZVxuICAgICAgICB9LFxuICAgICAgICBmcmFtZV9kdXJhdGlvbjogMCxcbiAgICAgICAgbG9vcDogZmFsc2UsXG4gICAgICAgIHBsYXlfb25fbG9hZDogZmFsc2UsXG4gICAgICAgIHBsYXlfb25fbG9hZF93aXRoX3JhbmRvbV90aW1lOiBmYWxzZSxcbiAgICAgICAgcmFuZG9tX3RpbWVfc2NhbGU6IGZhbHNlXG4gICAgfSxcblxuICAgIGNhbGxfbGF0dGVyOiBmdW5jdGlvbiBjYWxsX2xhdHRlcihjYWxsZnVuYywgZGVsYXkpIHtcbiAgICAgICAgdmFyIGRlbGF5X2FjdGlvbiA9IGNjLmRlbGF5VGltZShkZWxheSk7XG4gICAgICAgIHZhciBjYWxsX2FjdGlvbiA9IGNjLmNhbGxGdW5jKGNhbGxmdW5jLCB0aGlzKTtcbiAgICAgICAgdmFyIHNlcSA9IGNjLnNlcXVlbmNlKFtkZWxheV9hY3Rpb24sIGNhbGxfYWN0aW9uXSk7XG4gICAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24oc2VxKTtcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuZnJhbWVzX3NwID0gdGhpcy5mcmFtZV9zcHJpdGU7XG4gICAgICAgIHRoaXMuZnJhbWVfY291bnQgPSB0aGlzLmZyYW1lX3Nwcml0ZS5sZW5ndGg7XG5cbiAgICAgICAgLypcclxuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5mcmFtZV9jb3VudDsgaSArKykge1xyXG4gICAgICAgICAgICB2YXIgdXJsID0gY2MudXJsLnJhdyh0aGlzLm5hbWVfcHJlZml4ICsgKHRoaXMubmFtZV9iZWdpbl9pbmRleCArIGkpICsgXCIucG5nXCIpO1xyXG4gICAgICAgICAgICB2YXIgc3AgPSBuZXcgY2MuU3ByaXRlRnJhbWUodXJsKTtcclxuICAgICAgICAgICAgdGhpcy5mcmFtZXNfc3AucHVzaChzcCk7XHJcbiAgICAgICAgfSovXG5cbiAgICAgICAgdGhpcy5zcF9jb21wID0gdGhpcy5ub2RlLmdldENvbXBvbmVudChjYy5TcHJpdGUpO1xuICAgICAgICBpZiAoIXRoaXMuc3BfY29tcCkge1xuICAgICAgICAgICAgdGhpcy5zcF9jb21wID0gdGhpcy5ub2RlLmFkZENvbXBvbmVudChjYy5TcHJpdGUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3BfY29tcC5zcHJpdGVGcmFtZSA9IHRoaXMuZnJhbWVzX3NwWzBdO1xuXG4gICAgICAgIHRoaXMubm93X2luZGV4ID0gMDtcbiAgICAgICAgdGhpcy5wYXNzX3RpbWUgPSAwO1xuICAgICAgICB0aGlzLmFuaW1fZW5kZWQgPSB0cnVlO1xuICAgICAgICBpZiAodGhpcy5wbGF5X29uX2xvYWQpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnBsYXlfb25fbG9hZF93aXRoX3JhbmRvbV90aW1lKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRpbWUgPSAwLjAxICsgTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbGxfbGF0dGVyKChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYW5pbV9lbmRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0pLmJpbmQodGhpcyksIHRpbWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFuaW1fZW5kZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnJhbmRvbV90aW1lX3NjYWxlKSB7XG4gICAgICAgICAgICB2YXIgdF9zID0gMS4wICsgMC41ICogTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgIHRoaXMuZnJhbWVfZHVyYXRpb24gKj0gdF9zO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYW5pbV9lbmRfZnVuYyA9IG51bGw7XG4gICAgfSxcblxuICAgIHN0YXJ0OiBmdW5jdGlvbiBzdGFydCgpIHtcbiAgICAgICAgdGhpcy5wYXNzX3RpbWUgPSAwO1xuICAgIH0sXG5cbiAgICBwbGF5OiBmdW5jdGlvbiBwbGF5KGZ1bmMpIHtcbiAgICAgICAgdGhpcy5wYXNzX3RpbWUgPSAwO1xuICAgICAgICB0aGlzLmFuaW1fZW5kZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5hbmltX2VuZF9mdW5jID0gZnVuYztcbiAgICAgICAgdGhpcy5sb29wID0gZmFsc2U7XG4gICAgfSxcblxuICAgIHBsYXlfbG9vcDogZnVuY3Rpb24gcGxheV9sb29wKCkge1xuICAgICAgICB0aGlzLmxvb3AgPSB0cnVlO1xuICAgICAgICB0aGlzLnBhc3NfdGltZSA9IDA7XG4gICAgICAgIHRoaXMuYW5pbV9lbmRlZCA9IGZhbHNlO1xuICAgIH0sXG5cbiAgICBzdG9wX2FuaW06IGZ1bmN0aW9uIHN0b3BfYW5pbSgpIHtcbiAgICAgICAgdGhpcy5hbmltX2VuZGVkID0gdHJ1ZTtcbiAgICB9LFxuXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICBpZiAodGhpcy5hbmltX2VuZGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wYXNzX3RpbWUgKz0gZHQ7XG4gICAgICAgIHZhciBpbmRleCA9IE1hdGguZmxvb3IodGhpcy5wYXNzX3RpbWUgLyB0aGlzLmZyYW1lX2R1cmF0aW9uKTtcblxuICAgICAgICBpZiAodGhpcy5sb29wKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5ub3dfaW5kZXggIT0gaW5kZXgpIHtcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPj0gdGhpcy5mcmFtZV9jb3VudCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhc3NfdGltZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3BfY29tcC5zcHJpdGVGcmFtZSA9IHRoaXMuZnJhbWVzX3NwWzBdO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vd19pbmRleCA9IDA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zcF9jb21wLnNwcml0ZUZyYW1lID0gdGhpcy5mcmFtZXNfc3BbaW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vd19pbmRleCA9IGluZGV4O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm5vd19pbmRleCAhPSBpbmRleCkge1xuICAgICAgICAgICAgICAgIGlmIChpbmRleCA+PSB0aGlzLmZyYW1lX2NvdW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYW5pbV9lbmRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmFuaW1fZW5kX2Z1bmMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYW5pbV9lbmRfZnVuYygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub3dfaW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zcF9jb21wLnNwcml0ZUZyYW1lID0gdGhpcy5mcmFtZXNfc3BbaW5kZXhdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnNmQzYTJmVzBXUkxyYURwQXFkb2JEbWQnLCAnZnJhbWVfYW5pbScpO1xuLy8gc2NyaXB0c1xcZnJhbWVfYW5pbS5qc1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG5cbiAgICAgICAgbmFtZV9wcmVmaXg6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBcIm5hbWVfcGF0aF9wcmVmaXhcIixcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZ1xuICAgICAgICB9LFxuICAgICAgICBuYW1lX2JlZ2luX2luZGV4OiAwLFxuICAgICAgICBmcmFtZV9jb3VudDogMCxcbiAgICAgICAgZnJhbWVfZHVyYXRpb246IDAsXG4gICAgICAgIGxvb3A6IGZhbHNlLFxuICAgICAgICBwbGF5X29uX2xvYWQ6IGZhbHNlXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLmZyYW1lc19zcCA9IFtdO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5mcmFtZV9jb3VudDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgdXJsID0gY2MudXJsLnJhdyh0aGlzLm5hbWVfcHJlZml4ICsgKHRoaXMubmFtZV9iZWdpbl9pbmRleCArIGkpICsgXCIucG5nXCIpO1xuICAgICAgICAgICAgdmFyIHNwID0gbmV3IGNjLlNwcml0ZUZyYW1lKHVybCk7XG4gICAgICAgICAgICB0aGlzLmZyYW1lc19zcC5wdXNoKHNwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3BfY29tcCA9IHRoaXMubm9kZS5nZXRDb21wb25lbnQoY2MuU3ByaXRlKTtcbiAgICAgICAgaWYgKCF0aGlzLnNwX2NvbXApIHtcbiAgICAgICAgICAgIHRoaXMuc3BfY29tcCA9IHRoaXMubm9kZS5hZGRDb21wb25lbnQoY2MuU3ByaXRlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNwX2NvbXAuc3ByaXRlRnJhbWUgPSB0aGlzLmZyYW1lc19zcFswXTtcblxuICAgICAgICB0aGlzLm5vd19pbmRleCA9IDA7XG4gICAgICAgIHRoaXMucGFzc190aW1lID0gMDtcbiAgICAgICAgdGhpcy5hbmltX2VuZGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuYW5pbV9lbmRlZCA9ICF0aGlzLnBsYXlfb25fbG9hZDtcblxuICAgICAgICB0aGlzLmFuaW1fZW5kX2Z1bmMgPSBudWxsO1xuICAgIH0sXG5cbiAgICBzdGFydDogZnVuY3Rpb24gc3RhcnQoKSB7XG4gICAgICAgIHRoaXMucGFzc190aW1lID0gMDtcbiAgICB9LFxuXG4gICAgcGxheTogZnVuY3Rpb24gcGxheShmdW5jKSB7XG4gICAgICAgIHRoaXMucGFzc190aW1lID0gMDtcbiAgICAgICAgdGhpcy5hbmltX2VuZGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuYW5pbV9lbmRfZnVuYyA9IGZ1bmM7XG4gICAgfSxcblxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcbiAgICAgICAgaWYgKHRoaXMuYW5pbV9lbmRlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucGFzc190aW1lICs9IGR0O1xuICAgICAgICB2YXIgaW5kZXggPSBNYXRoLmZsb29yKHRoaXMucGFzc190aW1lIC8gdGhpcy5mcmFtZV9kdXJhdGlvbik7XG5cbiAgICAgICAgaWYgKHRoaXMubG9vcCkge1xuICAgICAgICAgICAgaWYgKHRoaXMubm93X2luZGV4ICE9IGluZGV4KSB7XG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID49IHRoaXMuZnJhbWVfY291bnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXNzX3RpbWUgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNwX2NvbXAuc3ByaXRlRnJhbWUgPSB0aGlzLmZyYW1lc19zcFswXTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub3dfaW5kZXggPSAwO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3BfY29tcC5zcHJpdGVGcmFtZSA9IHRoaXMuZnJhbWVzX3NwW2luZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub3dfaW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5ub3dfaW5kZXggIT0gaW5kZXgpIHtcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPj0gdGhpcy5mcmFtZV9jb3VudCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFuaW1fZW5kZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5hbmltX2VuZF9mdW5jKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFuaW1fZW5kX2Z1bmMoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm93X2luZGV4ID0gaW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3BfY29tcC5zcHJpdGVGcmFtZSA9IHRoaXMuZnJhbWVzX3NwW2luZGV4XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzg5NjkyWHMzYjFGYTQra1dKcm9oQWFZJywgJ2xvb3Bfc3dpbmdfYWN0aW9uJyk7XG4vLyBzY3JpcHRzXFxsb29wX3N3aW5nX2FjdGlvbi5qc1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIHJvdF90aW1lOiAwLjQsXG4gICAgICAgIHJvdF9kZWdyZWU6IDIwLFxuICAgICAgICBzdGFydF90aW1lOiAwLjFcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIGlmICh0aGlzLnN0YXJ0X3RpbWUgPj0gMCkge1xuICAgICAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJ1bl9hY3Rpb24oKTtcbiAgICAgICAgICAgIH0pLmJpbmQodGhpcyksIHRoaXMuc3RhcnRfdGltZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJ1bl9hY3Rpb24oKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBydW5fYWN0aW9uOiBmdW5jdGlvbiBydW5fYWN0aW9uKCkge1xuICAgICAgICB2YXIgcm90MSA9IGNjLnJvdGF0ZVRvKHRoaXMucm90X3RpbWUsIHRoaXMucm90X2RlZ3JlZSk7XG4gICAgICAgIHZhciByb3QyID0gY2Mucm90YXRlVG8odGhpcy5yb3RfdGltZSwgLXRoaXMucm90X2RlZ3JlZSk7XG4gICAgICAgIHZhciBzZXEgPSBjYy5zZXF1ZW5jZShbcm90MSwgcm90Ml0pO1xuICAgICAgICB2YXIgcmVwZWF0ID0gY2MucmVwZWF0Rm9yZXZlcihzZXEpO1xuICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKHJlcGVhdCk7XG4gICAgfVxufSk7XG4vLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuLy8gfSxcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzE4MDliWFM4MzVGa0kzUGhGbnJoK0F1JywgJ21haW5fc2NlbmUnKTtcbi8vIHNjcmlwdHNcXG1haW5fc2NlbmUuanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBlbGVtX2NvdW50OiAyNCxcbiAgICAgICAgbG9ja19lbGVtX3RpbWU6IDAuNixcbiAgICAgICAgbG9ja19tdXNpY190aW1lOiAxNSxcbiAgICAgICAgd2F2ZV9hbmltX2R1cmF0aW9uOiAwLjgsXG5cbiAgICAgICAgcGxheV93YXZlX211c2ljX3RpbWU6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBbXSxcbiAgICAgICAgICAgIHR5cGU6IGNjLkZsb2F0XG4gICAgICAgIH0sXG5cbiAgICAgICAgY2xpY2tfaXRlbV9ib3g6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBbXSxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfSxcblxuICAgICAgICBsaWdodF9hcnJheToge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IFtdLFxuICAgICAgICAgICAgdHlwZTogY2MuUHJlZmFiXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcHJlbG9hZF9zb3VuZDogZnVuY3Rpb24gcHJlbG9hZF9zb3VuZCgpIHtcbiAgICAgICAgdmFyIHNvdW5kX2xpc3QgPSBbXCJyZXNvdXJjZXMvc291bmRzL2NsaWNrLm1wM1wiLCBcInJlc291cmNlcy9zb3VuZHMvYmFzcy9lbGVtXzEubXAzXCIsIFwicmVzb3VyY2VzL3NvdW5kcy9iYXNzL2VsZW1fMi5tcDNcIiwgXCJyZXNvdXJjZXMvc291bmRzL2Jhc3MvZWxlbV8zLm1wM1wiLCBcInJlc291cmNlcy9zb3VuZHMvYmFzcy9lbGVtXzQubXAzXCIsIFwicmVzb3VyY2VzL3NvdW5kcy9iYXNzL2VsZW1fNS5tcDNcIiwgXCJyZXNvdXJjZXMvc291bmRzL2Jhc3MvZWxlbV82Lm1wM1wiLCBcInJlc291cmNlcy9zb3VuZHMvYmFzcy9lbGVtXzcubXAzXCIsIFwicmVzb3VyY2VzL3NvdW5kcy9iYXNzL2VsZW1fOC5tcDNcIiwgXCJyZXNvdXJjZXMvc291bmRzL2Jhc3MvZWxlbV85Lm1wM1wiLCBcInJlc291cmNlcy9zb3VuZHMvYmFzcy9lbGVtXzEwLm1wM1wiLCBcInJlc291cmNlcy9zb3VuZHMvYmFzcy9lbGVtXzExLm1wM1wiLCBcInJlc291cmNlcy9zb3VuZHMvYmFzcy9lbGVtXzEyLm1wM1wiLCBcInJlc291cmNlcy9zb3VuZHMvYmFzcy9lbGVtXzEzLm1wM1wiLCBcInJlc291cmNlcy9zb3VuZHMvYmFzcy9lbGVtXzE0Lm1wM1wiLCBcInJlc291cmNlcy9zb3VuZHMvYmFzcy9lbGVtXzE1Lm1wM1wiLCBcInJlc291cmNlcy9zb3VuZHMvYmFzcy9lbGVtXzE2Lm1wM1wiLCBcInJlc291cmNlcy9zb3VuZHMvYmFzcy9lbGVtXzE3Lm1wM1wiLCBcInJlc291cmNlcy9zb3VuZHMvYmFzcy9lbGVtXzE4Lm1wM1wiLCBcInJlc291cmNlcy9zb3VuZHMvYmFzcy9lbGVtXzE5Lm1wM1wiLCBcInJlc291cmNlcy9zb3VuZHMvYmFzcy9lbGVtXzIwLm1wM1wiLCBcInJlc291cmNlcy9zb3VuZHMvYmFzcy9lbGVtXzIxLm1wM1wiLCBcInJlc291cmNlcy9zb3VuZHMvYmFzcy9lbGVtXzIyLm1wM1wiLCBcInJlc291cmNlcy9zb3VuZHMvYmFzcy9lbGVtXzIzLm1wM1wiLCBcInJlc291cmNlcy9zb3VuZHMvYmFzcy9lbGVtXzI0Lm1wM1wiLCBcInJlc291cmNlcy9zb3VuZHMvYmFzcy9taWRfY2hhbmdlLm1wM1wiLCBcInJlc291cmNlcy9zb3VuZHMvYmFzcy9ob2xlLm1wM1wiXTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNvdW5kX2xpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciB1cmwgPSBjYy51cmwucmF3KHNvdW5kX2xpc3RbaV0pO1xuICAgICAgICAgICAgY2MubG9hZGVyLmxvYWRSZXModXJsLCBmdW5jdGlvbiAoKSB7fSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcGxheV9zb3VuZDogZnVuY3Rpb24gcGxheV9zb3VuZChuYW1lKSB7XG4gICAgICAgIHZhciB1cmxfZGF0YSA9IGNjLnVybC5yYXcobmFtZSk7XG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnN0b3BNdXNpYygpO1xuICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5TXVzaWModXJsX2RhdGEpO1xuICAgIH0sXG5cbiAgICBjYWxsX2xhdHRlcjogZnVuY3Rpb24gY2FsbF9sYXR0ZXIoY2FsbGZ1bmMsIGRlbGF5KSB7XG4gICAgICAgIHZhciBkZWxheV9hY3Rpb24gPSBjYy5kZWxheVRpbWUoZGVsYXkpO1xuICAgICAgICB2YXIgY2FsbF9hY3Rpb24gPSBjYy5jYWxsRnVuYyhjYWxsZnVuYywgdGhpcyk7XG4gICAgICAgIHZhciBzZXEgPSBjYy5zZXF1ZW5jZShbZGVsYXlfYWN0aW9uLCBjYWxsX2FjdGlvbl0pO1xuICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKHNlcSk7XG4gICAgfSxcblxuICAgIHN0YXJ0X2xpZ2h0OiBmdW5jdGlvbiBzdGFydF9saWdodChldmVudCkge1xuICAgICAgICBpZiAoIXRoaXMuc3RhcnRfdmFsaWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0YXJ0X3ZhbGlkID0gZmFsc2U7XG5cbiAgICAgICAgdmFyIGVuZF94ID0gZXZlbnQuZ2V0TG9jYXRpb24oKS54O1xuICAgICAgICB2YXIgZW5kX3kgPSBldmVudC5nZXRMb2NhdGlvbigpLnk7XG4gICAgICAgIHZhciBjZW50ZXJfcG9zID0gY2MucCgoZW5kX3ggKyB0aGlzLnN0YXJ0X3gpICogMC41LCAoZW5kX3kgKyB0aGlzLnN0YXJ0X3kpICogMC41KTtcbiAgICAgICAgdmFyIGlzX2xlZnQgPSBlbmRfeCA8IHRoaXMuc3RhcnRfeDtcblxuICAgICAgICB2YXIgZGlyID0gY2MudjIoZW5kX3ggLSB0aGlzLnN0YXJ0X3gsIGVuZF95IC0gdGhpcy5zdGFydF95KTtcbiAgICAgICAgdmFyIHNjYWxlID0gZGlyLm1hZygpIC8gNTQwO1xuICAgICAgICAvLyB2YXIgc2NhbGUgPSAxLjAgKyBNYXRoLnJhbmRvbSgpICogMC41O1xuICAgICAgICB0aGlzLm9uX3dhdGVyX2NsaWNrKGNjLnAodGhpcy5zdGFydF94LCB0aGlzLnN0YXJ0X3kpLCBkaXIuc2lnbkFuZ2xlKGNjLnYyKDAsIC0xKSksIHNjYWxlKTtcbiAgICB9LFxuXG4gICAgaXNfbGlnaHRpbmdfb246IGZ1bmN0aW9uIGlzX2xpZ2h0aW5nX29uKGlzX29uKSB7XG4gICAgICAgIGlmIChpc19vbikge1xuICAgICAgICAgICAgdGhpcy53aGl0ZV9iZy5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5ibHVlX2JnLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmxpZ2h0X21hc2sub3BhY2l0eSA9IDI1NTtcbiAgICAgICAgICAgIHRoaXMud2hpdGVfYmcucnVuQWN0aW9uKGNjLmZhZGVJbigwLjE1KSk7XG4gICAgICAgICAgICB0aGlzLmxpZ2h0X21hc2suYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMud2hpdGVfYmcuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuYmx1ZV9iZy5vcGFjaXR5ID0gMjU1O1xuICAgICAgICAgICAgdGhpcy5ibHVlX2JnLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLndoaXRlX2JnLnJ1bkFjdGlvbihjYy5mYWRlT3V0KDAuMTUpKTtcbiAgICAgICAgICAgIHRoaXMubGlnaHRfbWFzay5ydW5BY3Rpb24oY2MuZmFkZU91dCgwLjE1KSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLnByZWxvYWRfc291bmQoKTtcblxuICAgICAgICB0aGlzLmFuY2hvcl9yb290ID0gY2MuZmluZChcIlVJX1JPT1QvYW5jaG9yLWNlbnRlclwiKTtcbiAgICAgICAgdGhpcy5raW1fY2F0X2NvbSA9IGNjLmZpbmQoXCJVSV9ST09UL2FuY2hvci1jZW50ZXIva2ltX2NhdFwiKS5nZXRDb21wb25lbnQoXCJmcmFtZV9hbmltX3NlY29uZFwiKTtcbiAgICAgICAgdGhpcy5raW1fc3ByaXRlX2NvbSA9IGNjLmZpbmQoXCJVSV9ST09UL2FuY2hvci1jZW50ZXIva2ltX2NhdFwiKS5nZXRDb21wb25lbnQoY2MuU3ByaXRlKTtcblxuICAgICAgICB0aGlzLnlpbmZ1ID0gY2MuZmluZChcIlVJX1JPT1QvYW5jaG9yLWNlbnRlci95aW5mdVwiKTtcbiAgICAgICAgdGhpcy5zcF95aW5mdSA9IHRoaXMueWluZnUuZ2V0Q29tcG9uZW50KHNwLlNrZWxldG9uKTtcblxuICAgICAgICB2YXIgdXJsID0gY2MudXJsLnJhdyhcInJlc291cmNlcy9mcmFtZV9hbmltL2NhdF9hbmltL2NhdF8xLnBuZ1wiKTtcbiAgICAgICAgdmFyIHNwMiA9IG5ldyBjYy5TcHJpdGVGcmFtZSh1cmwpO1xuICAgICAgICB0aGlzLmtpbV9pZGVsX3NwID0gc3AyO1xuICAgICAgICB0aGlzLmxpZ2h0X21hc2sgPSBjYy5maW5kKFwiVUlfUk9PVC9hbmNob3ItY2VudGVyL2xpZ2h0X21hc2tcIik7XG4gICAgICAgIHRoaXMubGlnaHRfbWFzay5hY3RpdmUgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLmxvY2tfY2xpY2sgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jbGlja19tb2RlID0gMDtcblxuICAgICAgICB0aGlzLm11c2ljX2luZGV4ID0gMTtcbiAgICAgICAgdGhpcy5zdGFydF92YWxpZCA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMud2hpdGVfYmcgPSBjYy5maW5kKFwiVUlfUk9PVC9hbmNob3ItYmFja2dyb3VuZC93aGl0ZVwiKTtcbiAgICAgICAgdGhpcy5ibHVlX2JnID0gY2MuZmluZChcIlVJX1JPT1QvYW5jaG9yLWJhY2tncm91bmQvYmx1ZVwiKTtcbiAgICAgICAgdGhpcy53aGl0ZV9iZy5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKCd0b3VjaHN0YXJ0JywgKGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmFuY2hvcl9yb290LmFjdGl2ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNsaWNrX2l0ZW1fYm94Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGJvdW5kX2JveCA9IHRoaXMuY2xpY2tfaXRlbV9ib3hbaV0uZ2V0Qm91bmRpbmdCb3goKTtcbiAgICAgICAgICAgICAgICB2YXIgcG9zID0gdGhpcy5jbGlja19pdGVtX2JveFtpXS5nZXRQYXJlbnQoKS5jb252ZXJ0VG91Y2hUb05vZGVTcGFjZShldmVudCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoYm91bmRfYm94LmNvbnRhaW5zKHBvcykpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGFydF92YWxpZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRfeCA9IGV2ZW50LmdldExvY2F0aW9uKCkueDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGFydF95ID0gZXZlbnQuZ2V0TG9jYXRpb24oKS55O1xuICAgICAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLmJpbmQodGhpcykpO1xuXG4gICAgICAgIHRoaXMubm9kZS5vbigndG91Y2htb3ZlJywgKGZ1bmN0aW9uIChldmVudCkge30pLmJpbmQodGhpcykpO1xuXG4gICAgICAgIHRoaXMubm9kZS5vbigndG91Y2hlbmQnLCAoZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0X2xpZ2h0KGV2ZW50KTtcbiAgICAgICAgfSkuYmluZCh0aGlzKSk7XG5cbiAgICAgICAgdGhpcy5ub2RlLm9uKCd0b3VjaGNhbmNlbCcsIChmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRfbGlnaHQoZXZlbnQpO1xuICAgICAgICB9KS5iaW5kKHRoaXMpKTtcblxuICAgICAgICB0aGlzLmxpZ2h0X3Jvb3QgPSBjYy5maW5kKFwiVUlfUk9PVC9hbmNob3ItY2VudGVyL2xpZ2h0X3Jvb3RcIik7XG4gICAgICAgIHRoaXMuY2xpY2tfcG9zX3JhbmRvbSA9IFtdO1xuICAgIH0sXG5cbiAgICBzdGFydDogZnVuY3Rpb24gc3RhcnQoKSB7fSxcblxuICAgIG9uX3BsYXlfbmV4dDogZnVuY3Rpb24gb25fcGxheV9uZXh0KCkge1xuICAgICAgICB0aGlzLmNhbGxfbGF0dGVyKHRoaXMucGxheV9taWRkbGVfbXVzaWMuYmluZCh0aGlzKSwgdGhpcy53YXZlX2FuaW1fZHVyYXRpb24pO1xuICAgIH0sXG5cbiAgICBwbGF5X21pZGRsZV9tdXNpYzogZnVuY3Rpb24gcGxheV9taWRkbGVfbXVzaWMoKSB7XG4gICAgICAgIHRoaXMucGxheV9zb3VuZChcInJlc291cmNlcy9zb3VuZHMvYmFzcy9taWRfY2hhbmdlLm1wM1wiKTtcblxuICAgICAgICB0aGlzLnNwX3lpbmZ1LmNsZWFyVHJhY2tzKCk7XG4gICAgICAgIHRoaXMuc3BfeWluZnUuc2V0QW5pbWF0aW9uKDAsIFwiYW5pbWF0aW9uXCIsIHRydWUpO1xuXG4gICAgICAgIHRoaXMuY2FsbF9sYXR0ZXIoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMucGxheV9ob2xlX211c2ljKCk7XG4gICAgICAgIH0pLmJpbmQodGhpcyksIDQuNSk7XG4gICAgfSxcblxuICAgIG9uX3BsYXlfbXVzaWNfZW5kZWQ6IGZ1bmN0aW9uIG9uX3BsYXlfbXVzaWNfZW5kZWQoKSB7XG4gICAgICAgIHRoaXMuc3BfeWluZnUuY2xlYXJUcmFja3MoKTtcbiAgICAgICAgdGhpcy55aW5mdS5hY3RpdmUgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLmNsaWNrX21vZGUgPSAwO1xuICAgICAgICB0aGlzLmxvY2tfY2xpY2sgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5tdXNpY19pbmRleCA9IDE7XG4gICAgICAgIHRoaXMuY2xpY2tfcG9zX3JhbmRvbSA9IFtdO1xuICAgICAgICB0aGlzLmxpZ2h0X3Jvb3QucmVtb3ZlQWxsQ2hpbGRyZW4oKTtcbiAgICB9LFxuXG4gICAgcGxheV9ob2xlX211c2ljOiBmdW5jdGlvbiBwbGF5X2hvbGVfbXVzaWMoKSB7XG4gICAgICAgIC8vIHRoaXMubWlkX3dhdmVfYW5pbV9jb20ubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jbGlja19tb2RlKys7XG4gICAgICAgIHRoaXMucGxheV9zb3VuZChcInJlc291cmNlcy9zb3VuZHMvYmFzcy9ob2xlLm1wM1wiKTtcbiAgICAgICAgdGhpcy5tdXNpY190aW1lID0gMDtcbiAgICAgICAgdGhpcy5tdXNpY19pbmRleCA9IDA7XG4gICAgICAgIHRoaXMuY2FsbF9sYXR0ZXIodGhpcy5vbl9wbGF5X211c2ljX2VuZGVkLmJpbmQodGhpcyksIHRoaXMubG9ja19tdXNpY190aW1lKTtcbiAgICB9LFxuXG4gICAgcGxheV9jYXRfaWRsZTogZnVuY3Rpb24gcGxheV9jYXRfaWRsZSgpIHtcbiAgICAgICAgdGhpcy5raW1fc3ByaXRlX2NvbS5zcHJpdGVGcmFtZSA9IHRoaXMua2ltX2lkZWxfc3A7XG4gICAgfSxcblxuICAgIHBsYXlfd2F2ZV9ieV9yYW5kb206IGZ1bmN0aW9uIHBsYXlfd2F2ZV9ieV9yYW5kb20od19wb3MsIGFuZ2xlLCBzY2FsZSkge1xuXG4gICAgICAgIGFuZ2xlID0gLWFuZ2xlICogNTcuMztcblxuICAgICAgICBpZiAoYW5nbGUgPiAzNSkge1xuICAgICAgICAgICAgYW5nbGUgPSAzNTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYW5nbGUgPCAtMzUpIHtcbiAgICAgICAgICAgIGFuZ2xlID0gLTM1O1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5raW1fY2F0X2NvbS5wbGF5KHRoaXMucGxheV9jYXRfaWRsZS5iaW5kKHRoaXMpKTtcblxuICAgICAgICAvLyB0aGlzLnlpbmZ1LmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIC8vIHRoaXMuc3BfeWluZnUuY2xlYXJUcmFja3MoKTtcbiAgICAgICAgLy8gdGhpcy5zcF95aW5mdS5zZXRBbmltYXRpb24oMCwgXCJhbmltYXRpb25cIiwgZmFsc2UpO1xuXG4gICAgICAgIC8vIOaSreaUvumXqueUtVxuICAgICAgICB2YXIgcmFuZG9tX251bSA9IFswLCAxLCAyXTtcbiAgICAgICAgcmFuZG9tX251bS5zb3J0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLnJhbmRvbSgpIC0gMC41O1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gZW5kXG5cbiAgICAgICAgdmFyIGluZGV4ID0gcmFuZG9tX251bVswXTtcbiAgICAgICAgdmFyIHByZWZhYiA9IGNjLmluc3RhbnRpYXRlKHRoaXMubGlnaHRfYXJyYXlbaW5kZXhdKTtcbiAgICAgICAgdGhpcy5saWdodF9yb290LmFkZENoaWxkKHByZWZhYik7XG4gICAgICAgIHByZWZhYi5hY3RpdmUgPSB0cnVlO1xuXG4gICAgICAgIHZhciBwb3MgPSB0aGlzLmxpZ2h0X3Jvb3QuY29udmVydFRvTm9kZVNwYWNlKHdfcG9zKTtcblxuICAgICAgICBwcmVmYWIueCA9IHBvcy54O1xuICAgICAgICBwcmVmYWIueSA9IDUzOTtcbiAgICAgICAgcHJlZmFiLnNjYWxlID0gc2NhbGU7XG5cbiAgICAgICAgcHJlZmFiLnJvdGF0aW9uID0gYW5nbGU7XG4gICAgICAgIHZhciBmcmFtZV9hbmltX2NvbSA9IHByZWZhYi5nZXRDb21wb25lbnQoXCJmcmFtZV9hbmltXCIpO1xuICAgICAgICB0aGlzLmlzX2xpZ2h0aW5nX29uKHRydWUpO1xuXG4gICAgICAgIGZyYW1lX2FuaW1fY29tLnBsYXkoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHByZWZhYi5yZW1vdmVGcm9tUGFyZW50KCk7XG4gICAgICAgICAgICB0aGlzLmxvY2tfY2xpY2sgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuaXNfbGlnaHRpbmdfb24oZmFsc2UpO1xuICAgICAgICB9KS5iaW5kKHRoaXMpKTtcbiAgICB9LFxuXG4gICAgb25fd2F0ZXJfY2xpY2s6IGZ1bmN0aW9uIG9uX3dhdGVyX2NsaWNrKHdfcG9zLCBhbmdsZSwgc2NhbGUpIHtcbiAgICAgICAgaWYgKHRoaXMubG9ja19jbGljayA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2xpY2tfcG9zX3JhbmRvbS5wdXNoKFt3X3BvcywgYW5nbGUsIHNjYWxlXSk7XG5cbiAgICAgICAgYW5nbGUgPSAtYW5nbGUgKiA1Ny4zO1xuXG4gICAgICAgIGlmIChhbmdsZSA+IDM1KSB7XG4gICAgICAgICAgICBhbmdsZSA9IDM1O1xuICAgICAgICB9XG4gICAgICAgIGlmIChhbmdsZSA8IC0zNSkge1xuICAgICAgICAgICAgYW5nbGUgPSAtMzU7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmxvY2tfY2xpY2sgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMua2ltX2NhdF9jb20ucGxheSh0aGlzLnBsYXlfY2F0X2lkbGUuYmluZCh0aGlzKSk7XG5cbiAgICAgICAgdGhpcy55aW5mdS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB0aGlzLnNwX3lpbmZ1LmNsZWFyVHJhY2tzKCk7XG4gICAgICAgIHRoaXMuc3BfeWluZnUuc2V0QW5pbWF0aW9uKDAsIFwiYW5pbWF0aW9uXCIsIGZhbHNlKTtcblxuICAgICAgICB0aGlzLnBsYXlfc291bmQoXCJyZXNvdXJjZXMvc291bmRzL2Jhc3MvZWxlbV9cIiArIHRoaXMubXVzaWNfaW5kZXggKyBcIi5tcDNcIik7XG4gICAgICAgIGlmICh0aGlzLm11c2ljX2luZGV4ID4gMjQpIHtcbiAgICAgICAgICAgIC8vIHRoaXMubXVzaWNfaW5kZXggPSAxO1xuICAgICAgICAgICAgdGhpcy5jYWxsX2xhdHRlcih0aGlzLm9uX3BsYXlfbmV4dC5iaW5kKHRoaXMpLCB0aGlzLmxvY2tfZWxlbV90aW1lKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubXVzaWNfaW5kZXgrKztcbiAgICAgICAgdGhpcy5jbGlja19tb2RlKys7XG5cbiAgICAgICAgLy8g5pKt5pS+6Zeq55S1XG4gICAgICAgIHZhciByYW5kb21fbnVtID0gWzAsIDEsIDJdO1xuICAgICAgICByYW5kb21fbnVtLnNvcnQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGgucmFuZG9tKCkgLSAwLjU7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBlbmRcblxuICAgICAgICB2YXIgaW5kZXggPSByYW5kb21fbnVtWzBdO1xuICAgICAgICB2YXIgcHJlZmFiID0gY2MuaW5zdGFudGlhdGUodGhpcy5saWdodF9hcnJheVtpbmRleF0pO1xuICAgICAgICB0aGlzLmxpZ2h0X3Jvb3QuYWRkQ2hpbGQocHJlZmFiKTtcbiAgICAgICAgcHJlZmFiLmFjdGl2ZSA9IHRydWU7XG5cbiAgICAgICAgdmFyIHBvcyA9IHRoaXMubGlnaHRfcm9vdC5jb252ZXJ0VG9Ob2RlU3BhY2Uod19wb3MpO1xuXG4gICAgICAgIHByZWZhYi54ID0gcG9zLng7XG4gICAgICAgIHByZWZhYi55ID0gNTM5O1xuICAgICAgICBwcmVmYWIuc2NhbGUgPSBzY2FsZTtcblxuICAgICAgICBwcmVmYWIucm90YXRpb24gPSBhbmdsZTtcbiAgICAgICAgdmFyIGZyYW1lX2FuaW1fY29tID0gcHJlZmFiLmdldENvbXBvbmVudChcImZyYW1lX2FuaW1cIik7XG4gICAgICAgIHRoaXMuaXNfbGlnaHRpbmdfb24odHJ1ZSk7XG5cbiAgICAgICAgZnJhbWVfYW5pbV9jb20ucGxheSgoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcHJlZmFiLnJlbW92ZUZyb21QYXJlbnQoKTtcbiAgICAgICAgICAgIHRoaXMubG9ja19jbGljayA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5pc19saWdodGluZ19vbihmYWxzZSk7XG4gICAgICAgIH0pLmJpbmQodGhpcykpO1xuICAgICAgICAvLyBlbmRcbiAgICB9LFxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcbiAgICAgICAgLy8g5pKt5pS+5pW06aaW5q2M5puyXG4gICAgICAgIGlmICh0aGlzLmNsaWNrX21vZGUgIT0gdGhpcy5lbGVtX2NvdW50ICsgMSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMubXVzaWNfaW5kZXggPj0gdGhpcy5wbGF5X3dhdmVfbXVzaWNfdGltZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIC8vIOaSreaUvue7k+adn1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5tdXNpY190aW1lICs9IGR0O1xuICAgICAgICB3aGlsZSAodGhpcy5tdXNpY19pbmRleCA8IHRoaXMucGxheV93YXZlX211c2ljX3RpbWUubGVuZ3RoIC0gMSAmJiB0aGlzLm11c2ljX3RpbWUgPj0gdGhpcy5wbGF5X3dhdmVfbXVzaWNfdGltZVt0aGlzLm11c2ljX2luZGV4ICsgMV0pIHtcbiAgICAgICAgICAgIHRoaXMubXVzaWNfaW5kZXgrKztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm11c2ljX3RpbWUgPj0gdGhpcy5wbGF5X3dhdmVfbXVzaWNfdGltZVt0aGlzLm11c2ljX2luZGV4XSkge1xuICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5tdXNpY19pbmRleDtcbiAgICAgICAgICAgIHdoaWxlIChpbmRleCA+PSB0aGlzLmVsZW1fY291bnQpIHtcbiAgICAgICAgICAgICAgICBpbmRleCAtPSB0aGlzLmVsZW1fY291bnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnBsYXlfd2F2ZV9ieV9yYW5kb20odGhpcy5jbGlja19wb3NfcmFuZG9tW2luZGV4XVswXSwgdGhpcy5jbGlja19wb3NfcmFuZG9tW2luZGV4XVsxXSwgdGhpcy5jbGlja19wb3NfcmFuZG9tW2luZGV4XVsyXSk7IC8vIOaSreaUvuWKqOeUu1xuICAgICAgICAgICAgdGhpcy5tdXNpY19pbmRleCsrO1xuICAgICAgICB9XG4gICAgICAgIC8vIGVuZFxuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnZTNhZDk4aHRBWkV2bzVQLzhFMXBUay8nLCAnc3RhcnRfc2NlbmUnKTtcbi8vIHNjcmlwdHNcXHN0YXJ0X3NjZW5lLmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIC8vIHRoaXMucHJlbG9hZF9zb3VuZCgpO1xuICAgICAgICB0aGlzLmxvY2tfc3RhcnQgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgY2FsbF9sYXR0ZXI6IGZ1bmN0aW9uIGNhbGxfbGF0dGVyKGNhbGxmdW5jLCBkZWxheSkge1xuICAgICAgICB2YXIgZGVsYXlfYWN0aW9uID0gY2MuZGVsYXlUaW1lKGRlbGF5KTtcbiAgICAgICAgdmFyIGNhbGxfYWN0aW9uID0gY2MuY2FsbEZ1bmMoY2FsbGZ1bmMsIHRoaXMpO1xuICAgICAgICB2YXIgc2VxID0gY2Muc2VxdWVuY2UoW2RlbGF5X2FjdGlvbiwgY2FsbF9hY3Rpb25dKTtcbiAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihzZXEpO1xuICAgIH0sXG5cbiAgICBwbGF5X3NvdW5kOiBmdW5jdGlvbiBwbGF5X3NvdW5kKG5hbWUpIHtcbiAgICAgICAgdmFyIHVybF9kYXRhID0gY2MudXJsLnJhdyhuYW1lKTtcbiAgICAgICAgY2MuYXVkaW9FbmdpbmUuc3RvcE11c2ljKCk7XG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlNdXNpYyh1cmxfZGF0YSk7XG4gICAgfSxcblxuICAgIG9uX3N0YXJ0X2NsaWNrOiBmdW5jdGlvbiBvbl9zdGFydF9jbGljaygpIHtcbiAgICAgICAgaWYgKHRoaXMubG9ja19zdGFydCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBzeW1ib2xfcm9vdCA9IGNjLmZpbmQoXCJVSV9ST09UL3N0YXJ0X2xheWVyL3N5bWJvbF9yb290XCIpO1xuICAgICAgICBzeW1ib2xfcm9vdC5hY3RpdmUgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLnBsYXlfc291bmQoXCJyZXNvdXJjZXMvc291bmRzL2NsaWNrLm1wM1wiKTtcbiAgICAgICAgdGhpcy5sb2NrX3N0YXJ0ID0gdHJ1ZTtcbiAgICAgICAgLy8gbG9nb1xuICAgICAgICB2YXIgbG9nbyA9IGNjLmZpbmQoXCJVSV9ST09UL3N0YXJ0X2xheWVyL2xvZ29cIik7XG5cbiAgICAgICAgLy8gbG9nby55ICs9IDQwMDtcbiAgICAgICAgdmFyIG1vdmUxID0gY2MubW92ZUJ5KDAuMiwgMCwgNzEwKTtcbiAgICAgICAgdmFyIG1vdmUyID0gY2MubW92ZUJ5KDAuMiwgMCwgLTIwKTtcbiAgICAgICAgdmFyIG1vdmUzID0gY2MubW92ZUJ5KDAuMSwgMCwgMTApO1xuXG4gICAgICAgIHZhciBzZXEgPSBjYy5zZXF1ZW5jZShbbW92ZTMsIG1vdmUyLCBtb3ZlMV0pO1xuICAgICAgICBsb2dvLnJ1bkFjdGlvbihzZXEpO1xuXG4gICAgICAgIHZhciBjYWxsZnVuYyA9IGNjLmNhbGxGdW5jKChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgc3RhcnRfYnV0dG9uID0gY2MuZmluZChcIlVJX1JPT1Qvc3RhcnRfbGF5ZXIvc3RhcnRfYnV0dG9uXCIpO1xuICAgICAgICAgICAgc3RhcnRfYnV0dG9uLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICBzdGFydF9idXR0b24uc2NhbGUgPSAxLjA7XG4gICAgICAgICAgICBzdGFydF9idXR0b24ub3BhY2l0eSA9IDI1NTtcbiAgICAgICAgICAgIHZhciBzY2FsZTEgPSBjYy5zY2FsZVRvKDAuMSwgMC44KTtcbiAgICAgICAgICAgIHZhciBzY2FsZTMgPSBjYy5zY2FsZVRvKDAuMiwgMS4yKTtcbiAgICAgICAgICAgIHZhciBjYWxsID0gY2MuY2FsbEZ1bmMoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgZm91dCA9IGNjLmZhZGVPdXQoMC4yKTtcbiAgICAgICAgICAgICAgICBzdGFydF9idXR0b24ucnVuQWN0aW9uKGZvdXQpO1xuICAgICAgICAgICAgfSkuYmluZCh0aGlzKSwgdGhpcyk7XG5cbiAgICAgICAgICAgIHZhciBjYWxsMiA9IGNjLmNhbGxGdW5jKChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGJnX21hc2sgPSBjYy5maW5kKFwiVUlfUk9PVC9zdGFydF9sYXllci9iZ19tYXNrXCIpO1xuICAgICAgICAgICAgICAgIGJnX21hc2sub3BhY2l0eSA9IDA7XG4gICAgICAgICAgICAgICAgdmFyIGZpbiA9IGNjLmZhZGVJbigwLjgpO1xuICAgICAgICAgICAgICAgIGJnX21hc2sucnVuQWN0aW9uKGZpbik7XG4gICAgICAgICAgICB9KS5iaW5kKHRoaXMpLCB0aGlzKTtcbiAgICAgICAgICAgIHZhciBzZXEgPSBjYy5zZXF1ZW5jZShbc2NhbGUxLCBjYWxsLCBzY2FsZTMsIGNhbGwyXSk7XG4gICAgICAgICAgICBzdGFydF9idXR0b24ucnVuQWN0aW9uKHNlcSk7XG4gICAgICAgIH0pLmJpbmQodGhpcyksIHRoaXMpO1xuICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKGNhbGxmdW5jKTtcblxuICAgICAgICAvKlxyXG4gICAgICAgIHZhciBmb3V0ID0gY2MuZmFkZUluKDAuNik7XHJcbiAgICAgICAgdmFyIGJnX21hc2sgPSBjYy5maW5kKFwiVUlfUk9PVC9zdGFydF9sYXllci9iZ19tYXNrXCIpOyBcclxuICAgICAgICBiZ19tYXNrLnJ1bkFjdGlvbihmb3V0KTsqL1xuXG4gICAgICAgIHRoaXMuY2FsbF9sYXR0ZXIoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMubm9kZS5yZW1vdmVGcm9tUGFyZW50KCk7XG4gICAgICAgICAgICB2YXIgYW5jaG9yX3Jvb3QgPSBjYy5maW5kKFwiVUlfUk9PVC9hbmNob3ItY2VudGVyXCIpO1xuICAgICAgICAgICAgYW5jaG9yX3Jvb3QuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgfSkuYmluZCh0aGlzKSwgMS4wKTtcbiAgICB9XG59KTtcbi8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4vLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4vLyB9LFxuXG5jYy5fUkZwb3AoKTsiXX0=
