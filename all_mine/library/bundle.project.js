require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"flip_block":[function(require,module,exports){
"use strict";
cc._RFpush(module, '8beb3VD3kFNVKGEhyJC+c9R', 'flip_block');
// scripts\flip_block.js

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
        index: 0
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.sprite_com = this.node.getComponent(cc.Sprite);
        var url = cc.url.raw("resources/game_scene/cardback.png");

        this.bk_sf = new cc.SpriteFrame(url);
        this.fliped = false;

        this.game_scene_comp = cc.find("UI_ROOT").getComponent("game_scene");

        this.node.on('touchstart', (function (event) {
            var bound_box = this.node.getBoundingBox();
            var pos = this.node.getParent().convertTouchToNodeSpace(event);
            if (this.fliped === false && bound_box.contains(pos)) {
                event.stopPropagation();
                this.game_scene_comp.on_card_flip(this, this.card_value);
            }
        }).bind(this));
    },

    flip_to_back: function flip_to_back() {
        var s = cc.scaleTo(0.1, 0, 1);
        var callback = cc.callFunc((function () {
            this.sprite_com.spriteFrame = this.bk_sf.clone();
        }).bind(this), this);
        var s2 = cc.scaleTo(0.1, 1, 1);
        var callback2 = cc.callFunc((function () {
            this.fliped = false;
        }).bind(this), this);

        var seq = cc.sequence([s, callback, s2, callback2]);
        this.node.runAction(seq);
    },

    flip_to_back_with_value: function flip_to_back_with_value(card_value) {
        this.card_value = card_value;
        this.sprite_com.spriteFrame = this.bk_sf.clone();
        this.fliped = false;
    },

    flip_to_value: function flip_to_value() {
        var s = cc.scaleTo(0.1, 0, 1);

        var callback = cc.callFunc((function () {
            var url = cc.url.raw("resources/game_scene/card_" + this.card_value + ".png");
            var sf = new cc.SpriteFrame(url);
            this.sprite_com.spriteFrame = sf;
        }).bind(this), this);

        var s2 = cc.scaleTo(0.1, 1, 1);

        var callback2 = cc.callFunc((function () {
            this.fliped = true;
        }).bind(this), this);

        var seq = cc.sequence([s, callback, s2, callback2]);
        this.node.runAction(seq);
    },

    get_card_value: function get_card_value() {
        return this.card_value;
    },

    get_seat: function get_seat() {
        return this.index;
    }
});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"frame_anim":[function(require,module,exports){
"use strict";
cc._RFpush(module, '9bd1aGoeFVA0IyKHA7bGGtT', 'frame_anim');
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
},{}],"game_scene":[function(require,module,exports){
"use strict";
cc._RFpush(module, '06401ZHLg9B85lzHLi06O7J', 'game_scene');
// scripts\game_scene.js

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
        level_root: {
            "default": [],
            type: cc.Node
        },

        flip_blocks_3x4: {
            "default": [],
            type: cc.Node
        },
        flip_blocks_2x2: {
            "default": [],
            type: cc.Node
        },
        flip_blocks_2x3: {
            "default": [],
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.block_levels = [this.flip_blocks_2x2, this.flip_blocks_2x3, this.flip_blocks_3x4];
        this.game_level = 0;

        this.checkout_root = cc.find("UI_ROOT/checkout_root");
        this.ck_logo_root = cc.find("UI_ROOT/checkout_root/logo_root");
        this.ck_replay_button = cc.find("UI_ROOT/checkout_root/replay_button");

        this.ske_kim_com = cc.find("UI_ROOT/anchor-bottom/kim").getComponent(sp.Skeleton);

        this.lock_kim_click = true;
    },

    show_checkout: function show_checkout() {
        this.checkout_root.active = true;
        this.ck_logo_root.scale = 0;
        var s1 = cc.scaleTo(0.3, 1.2);
        var s2 = cc.scaleTo(0.1, 0.9);
        var s3 = cc.scaleTo(0.1, 1.0);

        this.ck_replay_button.active = false;

        var call_func = cc.callFunc((function () {
            // 旋转光线
            this.ck_replay_button.active = true;
            this.ck_replay_button.scale = 3.5;
            this.ck_replay_button.opacity = 0;
            var scale1 = cc.scaleTo(0.3, 0.8);
            var scale2 = cc.scaleTo(0.2, 1.2);
            var scale3 = cc.scaleTo(0.1, 1.0);
            var seq = cc.sequence([scale1, scale2, scale3]);
            this.ck_replay_button.runAction(seq);
            var fin = cc.fadeIn(0.5);
            this.ck_replay_button.runAction(fin);
        }).bind(this), this);

        var seq = cc.sequence([s1, s2, s3, call_func]);
        this.ck_logo_root.runAction(seq);
    },

    adjust_anchor_with_design: function adjust_anchor_with_design() {
        var anchor_point = cc.find("UI_ROOT/anchor-lt");
        if (anchor_point) {
            anchor_point.x = -480;
            anchor_point.y = 360;
        }

        anchor_point = cc.find("UI_ROOT/anchor-bottom");
        if (anchor_point) {
            anchor_point.x = 0;
            anchor_point.y = -360;
        }

        anchor_point = cc.find("UI_ROOT/anchor-lb");
        if (anchor_point) {
            anchor_point.x = -480;
            anchor_point.y = -360;
        }

        anchor_point = cc.find("UI_ROOT/anchor-rb");
        if (anchor_point) {
            anchor_point.x = 480;
            anchor_point.y = -360;
        }

        anchor_point = cc.find("UI_ROOT/anchor-top");
        if (anchor_point) {
            anchor_point.x = 0;
            anchor_point.y = 360;
        }
    },

    adjust_anchor: function adjust_anchor() {
        var win_size = cc.director.getWinSize();

        var cx = win_size.width * 0.5;
        var cy = win_size.height * 0.5;

        var anchor_point = cc.find("UI_ROOT/anchor-lt");
        if (anchor_point) {
            anchor_point.x = -cx;
            anchor_point.y = cy;
        }

        anchor_point = cc.find("UI_ROOT/anchor-bottom");
        if (anchor_point) {
            anchor_point.x = 0;
            anchor_point.y = -cy;
        }

        anchor_point = cc.find("UI_ROOT/anchor-lb");
        if (anchor_point) {
            anchor_point.x = -cx;
            anchor_point.y = -cy;
        }

        anchor_point = cc.find("UI_ROOT/anchor-rb");
        if (anchor_point) {
            anchor_point.x = cx;
            anchor_point.y = -cy;
        }

        anchor_point = cc.find("UI_ROOT/anchor-top");
        if (anchor_point) {
            anchor_point.x = 0;
            anchor_point.y = cy;
        }
    },

    adjust_window: function adjust_window(win_size) {
        var design_4_3 = false;
        if (1024 * win_size.height > 768 * win_size.width) {
            this.adjust_anchor_with_design();
            design_4_3 = true;
        } else {
            this.adjust_anchor();
        }
    },

    play_kim_anim_with_right: function play_kim_anim_with_right() {
        this.ske_kim_com.clearTracks();
        this.ske_kim_com.setAnimation(0, "ok_1", false);
        this.call_latter((function () {
            this.ske_kim_com.clearTracks();
            this.ske_kim_com.setAnimation(0, "idle_1", true);
        }).bind(this), 2);
    },

    play_kim_anim_with_error: function play_kim_anim_with_error() {
        this.ske_kim_com.clearTracks();
        this.ske_kim_com.setAnimation(0, "err_1", false);
        this.call_latter((function () {
            this.ske_kim_com.clearTracks();
            this.ske_kim_com.setAnimation(0, "idle_1", true);
        }).bind(this), 1.5);
    },

    play_kim_click_anim_with_random: function play_kim_click_anim_with_random() {
        var v = Math.random();
        var anim_name = "clk_1";
        var sound_name = "resources/sounds/kim_clk1.mp3";
        if (v < 0.5) {
            anim_name = "clk_2";
            sound_name = "resources/sounds/kim_clk2.mp3";
        }
        this.lock_kim_click = true;
        this.play_sound(sound_name);
        this.ske_kim_com.clearTracks();
        this.ske_kim_com.setAnimation(0, anim_name, false);

        this.call_latter((function () {
            this.ske_kim_com.clearTracks();
            this.ske_kim_com.setAnimation(0, "idle_1", true);
            this.lock_kim_click = false;
        }).bind(this), 2);
    },

    start: function start() {
        this.game_start = false;
        this.locking_game = false;
        this.scheduleOnce(this.on_game_start.bind(this), 0);

        var win_size = cc.director.getWinSize();
        this.prev_size = win_size;
        this.adjust_window(win_size);

        this.call_latter((function () {
            this.ske_kim_com.clearTracks();
            this.ske_kim_com.setAnimation(0, "idle_1", true);
            this.lock_kim_click = false;
        }).bind(this), 0.9);
    },

    reset_flip_block: function reset_flip_block() {
        for (var i = 0; i < this.flip_blocks.length; i++) {
            var block = this.flip_blocks[i];
            var block_comp = block.getComponent("flip_block");
            block_comp.flip_to_back();
        }
    },

    flip_block_with_array: function flip_block_with_array(value_array) {
        for (var i = 0; i < value_array.length; i++) {
            var block = this.flip_blocks[i];
            var block_comp = block.getComponent("flip_block");
            block_comp.flip_to_back_with_value(value_array[i]);
        }
    },

    on_game_replay: function on_game_replay() {
        this.play_sound("resources/sounds/button.mp3");
        this.on_game_start();
    },

    on_game_start: function on_game_start() {
        if (this.game_level > 2) {
            return;
        }

        this.checkout_root.active = false;

        this.game_start = true;

        for (var index = 0; index < this.block_levels.length; index++) {
            this.level_root[index].active = false;
        }
        this.level_root[this.game_level].active = true;
        this.flip_blocks = this.block_levels[this.game_level];

        if (this.game_level === 0) {
            this.value_array = [4, 4, 0, 0];
        } else if (this.game_level === 1) {
            this.value_array = [1, 2, 3, 3, 2, 1];
        } else {
            this.value_array = [0, 1, 2, 3, 3, 0, 1, 2, 4, 2, 4, 2];
        }
        this.value_array.sort(function () {
            return Math.random() - 0.5;
        });

        this.flip_block_with_array(this.value_array);
        this.game_stage = 0;
        this.locking_game = false;
        this.flip_mask = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        // this.show_checkout();
    },

    play_sound: function play_sound(name) {
        cc.audioEngine.stopMusic(false);
        var url = cc.url.raw(name);
        cc.audioEngine.playMusic(url, false);
    },

    checkout_success: function checkout_success() {
        console.log(this.flip_blocks.length);
        console.log(this.flip_mask);
        var i;
        for (i = 0; i < this.flip_blocks.length; i++) {
            if (this.flip_mask[i] === 0) {
                return false;
            }
        }
        return true;
    },

    show_right_anim: function show_right_anim() {
        var s1 = cc.scaleTo(0.3, 1.1);
        var delay = cc.delayTime(0.2);
        var s2 = cc.scaleTo(0.1, 1.0);

        var seq = cc.sequence([s1, delay, s2]);

        this.first_flip.node.runAction(seq);
        this.second_flip.node.runAction(seq.clone());
    },

    call_latter: function call_latter(callfunc, delay) {
        var delay_action = cc.delayTime(delay);
        var call_action = cc.callFunc(callfunc, this);
        var seq = cc.sequence([delay_action, call_action]);
        this.node.runAction(seq);
    },

    on_card_flip: function on_card_flip(block, card_value) {
        if (this.game_start === false || this.locking_game === true) {
            return;
        }

        console.log("card_flip =" + card_value);
        var sounds_name = ["resources/sounds/car.mp3", "resources/sounds/plane.mp3", "resources/sounds/train.mp3", "resources/sounds/balloon.mp3", "resources/sounds/teddy.mp3"];

        cc.audioEngine.stopMusic(false);
        this.scheduleOnce(function () {
            var url = cc.url.raw(sounds_name[card_value]);
            cc.audioEngine.playMusic(url, false);
        }, 0);

        block.flip_to_value();
        this.game_stage = this.game_stage + 1;

        if (this.game_stage === 1) {
            // 翻开一张牌
            this.first_flip = block;
            this.locking_game = true;
            this.scheduleOnce((function () {
                this.locking_game = false;
            }).bind(this), 1 * 0.7);
            return;
        }

        this.second_flip = block;

        if (this.game_stage == 2) {
            this.game_stage = 0;

            if (this.first_flip.get_card_value() != this.second_flip.get_card_value()) {
                this.play_kim_anim_with_error();
                this.locking_game = true;
                // 翻二张牌到背面
                this.scheduleOnce((function () {
                    this.first_flip.flip_to_back();
                    this.second_flip.flip_to_back();
                }).bind(this), 1.0 * 0.7);

                this.scheduleOnce((function () {
                    this.locking_game = false;
                }).bind(this), 1.2 * 0.7);
                // end
                return;
            }

            var first = this.first_flip.get_seat();
            var second = this.second_flip.get_seat();

            this.flip_mask[first] = 1;
            this.flip_mask[second] = 1;
            this.locking_game = true;

            // 播放激励动画
            this.play_kim_anim_with_right();
            this.scheduleOnce((function () {
                this.show_right_anim();
            }).bind(this), 0.2);

            this.scheduleOnce((function () {
                this.locking_game = false;
            }).bind(this), 1);
            // end

            if (this.checkout_success()) {
                this.game_start = false;
                this.game_level++;

                this.call_latter((function () {
                    this.play_sound("resources/sounds/end.mp3");
                }).bind(this), 1.0);

                if (this.game_level === 3) {
                    this.game_level = 0;
                    // 0.5秒后弹结算换面
                    this.scheduleOnce(this.show_checkout.bind(this), 1.2);
                    // end  
                } else {
                        this.call_latter(this.on_game_start.bind(this), 1.2);
                    }
            }
        }
    },

    on_goto_home: function on_goto_home() {
        cc.audioEngine.stopMusic(false);
        var url = cc.url.raw("resources/sounds/button.mp3");
        cc.audioEngine.playMusic(url, false);
        cc.director.loadScene("start_scene");
    },
    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        var win_size = cc.director.getWinSize();
        if (win_size.width != this.prev_size.width || win_size.height != this.prev_size.height) {
            this.prev_size = win_size;
            this.adjust_window(win_size);
        }
    },

    on_kim_click: function on_kim_click() {
        if (this.lock_kim_click === true) {
            return;
        }
        this.play_kim_click_anim_with_random();
    }
});

cc._RFpop();
},{}],"start_scene":[function(require,module,exports){
"use strict";
cc._RFpush(module, '4f892YKrrRL1qEV52HJbZGI', 'start_scene');
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

    adjust_anchor_with_design: function adjust_anchor_with_design() {
        var anchor_point = cc.find("UI_ROOT/anchor-lt");
        if (anchor_point) {
            anchor_point.x = -480;
            anchor_point.y = 360;
        }

        anchor_point = cc.find("UI_ROOT/anchor-bottom");
        if (anchor_point) {
            anchor_point.x = 0;
            anchor_point.y = -360;
        }

        anchor_point = cc.find("UI_ROOT/anchor-lb");
        if (anchor_point) {
            anchor_point.x = -480;
            anchor_point.y = -360;
        }

        anchor_point = cc.find("UI_ROOT/anchor-rb");
        if (anchor_point) {
            anchor_point.x = 480;
            anchor_point.y = -360;
        }

        anchor_point = cc.find("UI_ROOT/anchor-top");
        if (anchor_point) {
            anchor_point.x = 0;
            anchor_point.y = 360;
        }
    },

    adjust_anchor: function adjust_anchor() {
        var win_size = cc.director.getWinSize();

        var cx = win_size.width * 0.5;
        var cy = win_size.height * 0.5;

        var anchor_point = cc.find("UI_ROOT/anchor-lt");
        if (anchor_point) {
            anchor_point.x = -cx;
            anchor_point.y = cy;
        }

        anchor_point = cc.find("UI_ROOT/anchor-bottom");
        if (anchor_point) {
            anchor_point.x = 0;
            anchor_point.y = -cy;
        }

        anchor_point = cc.find("UI_ROOT/anchor-lb");
        if (anchor_point) {
            anchor_point.x = -cx;
            anchor_point.y = -cy;
        }

        anchor_point = cc.find("UI_ROOT/anchor-rb");
        if (anchor_point) {
            anchor_point.x = cx;
            anchor_point.y = -cy;
        }

        anchor_point = cc.find("UI_ROOT/anchor-top");
        if (anchor_point) {
            anchor_point.x = 0;
            anchor_point.y = cy;
        }
    },

    adjust_window: function adjust_window(win_size) {
        var design_4_3 = false;
        if (1024 * win_size.height > 768 * win_size.width) {
            this.adjust_anchor_with_design();
            design_4_3 = true;
        } else {
            this.adjust_anchor();
        }
    },

    start: function start() {
        var win_size = cc.director.getWinSize();
        this.prev_size = win_size;
        this.adjust_window(win_size);
    },

    preload_sounds: function preload_sounds() {
        var sound_list = ["resources/sounds/balloon.mp3", "resources/sounds/button.mp3", "resources/sounds/car.mp3", "resources/sounds/end.mp3", "resources/sounds/kim_clk1.mp3", "resources/sounds/kim_clk2.mp3", "resources/sounds/plane.mp3", "resources/sounds/teddy.mp3", "resources/sounds/train.mp3"];

        for (var i = 0; i < sound_list.length; i++) {
            var url = cc.url.raw(sound_list[i]);
            cc.loader.loadRes(url, function () {});
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.preload_sounds();
        // logo
        var logo = cc.find("UI_ROOT/anchor-center/logo_root");

        logo.y += 400;
        var move1 = cc.moveBy(0.2, 0, -410);
        var move2 = cc.moveBy(0.2, 0, 20);
        var move3 = cc.moveBy(0.1, 0, -10);

        var start_button = cc.find("UI_ROOT/anchor-center/start_button");
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

        var butt = cc.find("UI_ROOT/anchor-center/logo_root/logo_butterfly");
        butt.scale = 0;
        butt.opacity = 0;

        var call_func2 = cc.callFunc((function () {
            var s = cc.scaleTo(0.2, 1.0);
            var fin = cc.fadeIn(0.1);
            var m_up = cc.moveBy(0.4, 0, 5);
            var m_down = cc.moveBy(0.4, 0, -5);
            var f = cc.repeatForever(cc.sequence([m_up, m_down]));
            var seq2 = cc.sequence([s, f]);

            butt.runAction(s);
            butt.runAction(fin);
            butt.runAction(f);
        }).bind(this), this);

        var bee = cc.find("UI_ROOT/anchor-center/logo_root/logo_bee");
        bee.scale = 0;
        bee.opacity = 0;
        var call_func3 = cc.callFunc((function () {
            var s = cc.scaleTo(0.2, 1.0);
            var fin = cc.fadeIn(0.1);
            var m_up = cc.moveBy(0.4, 0, 5);
            var m_down = cc.moveBy(0.4, 0, -5);
            var f = cc.repeatForever(cc.sequence([m_up, m_down]));
            var seq2 = cc.sequence([s, f]);

            bee.runAction(s);
            bee.runAction(fin);
            bee.runAction(f);
        }).bind(this), this);

        /*
        var ant = cc.find("UI_ROOT/anchor-center/logo_root/logo_ant");
        ant.scale = 0;
        ant.opacity = 0;
         var call_func4 = cc.callFunc(function() {
            var s = cc.scaleTo(0.2, 1.0);
            var fin = cc.fadeIn(0.1);
            var m_up = cc.moveBy(0.4, 0, 5);
            var m_down = cc.moveBy(0.4, 0, -5);
            var f = cc.repeatForever(cc.sequence([m_up, m_down]));
            var seq2 = cc.sequence([s, f]);
            
            ant.runAction(s);
            ant.runAction(fin);
            ant.runAction(f);
        }.bind(this), this)*/

        var delay = cc.delayTime(0.4);
        var seq = cc.sequence([move1, move2, move3, callfunc, call_func2, delay, call_func3 /*, delay.clone(), call_func4*/]);
        logo.runAction(seq);
        // end
    },

    on_game_start_click: function on_game_start_click() {
        cc.audioEngine.stopMusic(false);
        var url = cc.url.raw("resources/sounds/button.mp3");
        // console.log(url);
        cc.audioEngine.playMusic(url, false);

        cc.director.loadScene("game_scene");
    },
    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        var win_size = cc.director.getWinSize();
        if (win_size.width != this.prev_size.width || win_size.height != this.prev_size.height) {
            this.prev_size = win_size;
            this.adjust_window(win_size);
        }
    }
});

cc._RFpop();
},{}]},{},["game_scene","start_scene","flip_block","frame_anim"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkY6L3NvZnR3YXJlcy9Db2Nvc0NyZWF0b3JfMV8wXzEvcmVzb3VyY2VzL2FwcC5hc2FyL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvc2NyaXB0cy9mbGlwX2Jsb2NrLmpzIiwiYXNzZXRzL3NjcmlwdHMvZnJhbWVfYW5pbS5qcyIsImFzc2V0cy9zY3JpcHRzL2dhbWVfc2NlbmUuanMiLCJhc3NldHMvc2NyaXB0cy9zdGFydF9zY2VuZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzhiZWIzVkQza0ZOVktHRWh5SkMrYzlSJywgJ2ZsaXBfYmxvY2snKTtcbi8vIHNjcmlwdHNcXGZsaXBfYmxvY2suanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBpbmRleDogMFxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5zcHJpdGVfY29tID0gdGhpcy5ub2RlLmdldENvbXBvbmVudChjYy5TcHJpdGUpO1xuICAgICAgICB2YXIgdXJsID0gY2MudXJsLnJhdyhcInJlc291cmNlcy9nYW1lX3NjZW5lL2NhcmRiYWNrLnBuZ1wiKTtcblxuICAgICAgICB0aGlzLmJrX3NmID0gbmV3IGNjLlNwcml0ZUZyYW1lKHVybCk7XG4gICAgICAgIHRoaXMuZmxpcGVkID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5nYW1lX3NjZW5lX2NvbXAgPSBjYy5maW5kKFwiVUlfUk9PVFwiKS5nZXRDb21wb25lbnQoXCJnYW1lX3NjZW5lXCIpO1xuXG4gICAgICAgIHRoaXMubm9kZS5vbigndG91Y2hzdGFydCcsIChmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBib3VuZF9ib3ggPSB0aGlzLm5vZGUuZ2V0Qm91bmRpbmdCb3goKTtcbiAgICAgICAgICAgIHZhciBwb3MgPSB0aGlzLm5vZGUuZ2V0UGFyZW50KCkuY29udmVydFRvdWNoVG9Ob2RlU3BhY2UoZXZlbnQpO1xuICAgICAgICAgICAgaWYgKHRoaXMuZmxpcGVkID09PSBmYWxzZSAmJiBib3VuZF9ib3guY29udGFpbnMocG9zKSkge1xuICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZV9zY2VuZV9jb21wLm9uX2NhcmRfZmxpcCh0aGlzLCB0aGlzLmNhcmRfdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KS5iaW5kKHRoaXMpKTtcbiAgICB9LFxuXG4gICAgZmxpcF90b19iYWNrOiBmdW5jdGlvbiBmbGlwX3RvX2JhY2soKSB7XG4gICAgICAgIHZhciBzID0gY2Muc2NhbGVUbygwLjEsIDAsIDEpO1xuICAgICAgICB2YXIgY2FsbGJhY2sgPSBjYy5jYWxsRnVuYygoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5zcHJpdGVfY29tLnNwcml0ZUZyYW1lID0gdGhpcy5ia19zZi5jbG9uZSgpO1xuICAgICAgICB9KS5iaW5kKHRoaXMpLCB0aGlzKTtcbiAgICAgICAgdmFyIHMyID0gY2Muc2NhbGVUbygwLjEsIDEsIDEpO1xuICAgICAgICB2YXIgY2FsbGJhY2syID0gY2MuY2FsbEZ1bmMoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuZmxpcGVkID0gZmFsc2U7XG4gICAgICAgIH0pLmJpbmQodGhpcyksIHRoaXMpO1xuXG4gICAgICAgIHZhciBzZXEgPSBjYy5zZXF1ZW5jZShbcywgY2FsbGJhY2ssIHMyLCBjYWxsYmFjazJdKTtcbiAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihzZXEpO1xuICAgIH0sXG5cbiAgICBmbGlwX3RvX2JhY2tfd2l0aF92YWx1ZTogZnVuY3Rpb24gZmxpcF90b19iYWNrX3dpdGhfdmFsdWUoY2FyZF92YWx1ZSkge1xuICAgICAgICB0aGlzLmNhcmRfdmFsdWUgPSBjYXJkX3ZhbHVlO1xuICAgICAgICB0aGlzLnNwcml0ZV9jb20uc3ByaXRlRnJhbWUgPSB0aGlzLmJrX3NmLmNsb25lKCk7XG4gICAgICAgIHRoaXMuZmxpcGVkID0gZmFsc2U7XG4gICAgfSxcblxuICAgIGZsaXBfdG9fdmFsdWU6IGZ1bmN0aW9uIGZsaXBfdG9fdmFsdWUoKSB7XG4gICAgICAgIHZhciBzID0gY2Muc2NhbGVUbygwLjEsIDAsIDEpO1xuXG4gICAgICAgIHZhciBjYWxsYmFjayA9IGNjLmNhbGxGdW5jKChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgdXJsID0gY2MudXJsLnJhdyhcInJlc291cmNlcy9nYW1lX3NjZW5lL2NhcmRfXCIgKyB0aGlzLmNhcmRfdmFsdWUgKyBcIi5wbmdcIik7XG4gICAgICAgICAgICB2YXIgc2YgPSBuZXcgY2MuU3ByaXRlRnJhbWUodXJsKTtcbiAgICAgICAgICAgIHRoaXMuc3ByaXRlX2NvbS5zcHJpdGVGcmFtZSA9IHNmO1xuICAgICAgICB9KS5iaW5kKHRoaXMpLCB0aGlzKTtcblxuICAgICAgICB2YXIgczIgPSBjYy5zY2FsZVRvKDAuMSwgMSwgMSk7XG5cbiAgICAgICAgdmFyIGNhbGxiYWNrMiA9IGNjLmNhbGxGdW5jKChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmZsaXBlZCA9IHRydWU7XG4gICAgICAgIH0pLmJpbmQodGhpcyksIHRoaXMpO1xuXG4gICAgICAgIHZhciBzZXEgPSBjYy5zZXF1ZW5jZShbcywgY2FsbGJhY2ssIHMyLCBjYWxsYmFjazJdKTtcbiAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihzZXEpO1xuICAgIH0sXG5cbiAgICBnZXRfY2FyZF92YWx1ZTogZnVuY3Rpb24gZ2V0X2NhcmRfdmFsdWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhcmRfdmFsdWU7XG4gICAgfSxcblxuICAgIGdldF9zZWF0OiBmdW5jdGlvbiBnZXRfc2VhdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5kZXg7XG4gICAgfVxufSk7XG4vLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuLy8gfSxcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzliZDFhR29lRlZBMEl5S0hBN2JHR3RUJywgJ2ZyYW1lX2FuaW0nKTtcbi8vIHNjcmlwdHNcXGZyYW1lX2FuaW0uanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuXG4gICAgICAgIG5hbWVfcHJlZml4OiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogXCJuYW1lX3BhdGhfcHJlZml4XCIsXG4gICAgICAgICAgICB0eXBlOiBTdHJpbmdcbiAgICAgICAgfSxcbiAgICAgICAgbmFtZV9iZWdpbl9pbmRleDogMCxcbiAgICAgICAgZnJhbWVfY291bnQ6IDAsXG4gICAgICAgIGZyYW1lX2R1cmF0aW9uOiAwLFxuICAgICAgICBsb29wOiBmYWxzZVxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5mcmFtZXNfc3AgPSBbXTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZnJhbWVfY291bnQ7IGkrKykge1xuICAgICAgICAgICAgdmFyIHVybCA9IGNjLnVybC5yYXcodGhpcy5uYW1lX3ByZWZpeCArICh0aGlzLm5hbWVfYmVnaW5faW5kZXggKyBpKSArIFwiLnBuZ1wiKTtcbiAgICAgICAgICAgIHZhciBzcCA9IG5ldyBjYy5TcHJpdGVGcmFtZSh1cmwpO1xuICAgICAgICAgICAgdGhpcy5mcmFtZXNfc3AucHVzaChzcCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNwX2NvbXAgPSB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KGNjLlNwcml0ZSk7XG4gICAgICAgIGlmICghdGhpcy5zcF9jb21wKSB7XG4gICAgICAgICAgICB0aGlzLnNwX2NvbXAgPSB0aGlzLm5vZGUuYWRkQ29tcG9uZW50KGNjLlNwcml0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zcF9jb21wLnNwcml0ZUZyYW1lID0gdGhpcy5mcmFtZXNfc3BbMF0uY2xvbmUoKTtcblxuICAgICAgICB0aGlzLm5vd19pbmRleCA9IDA7XG4gICAgICAgIHRoaXMucGFzc190aW1lID0gMDtcbiAgICAgICAgdGhpcy5hbmltX2VuZGVkID0gZmFsc2U7XG4gICAgfSxcblxuICAgIHN0YXJ0OiBmdW5jdGlvbiBzdGFydCgpIHtcbiAgICAgICAgdGhpcy5wYXNzX3RpbWUgPSAwO1xuICAgIH0sXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICBpZiAodGhpcy5hbmltX2VuZGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wYXNzX3RpbWUgKz0gZHQ7XG4gICAgICAgIHZhciBpbmRleCA9IE1hdGguZmxvb3IodGhpcy5wYXNzX3RpbWUgLyB0aGlzLmZyYW1lX2R1cmF0aW9uKTtcblxuICAgICAgICBpZiAodGhpcy5sb29wKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5ub3dfaW5kZXggIT0gaW5kZXgpIHtcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPj0gdGhpcy5mcmFtZV9jb3VudCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhc3NfdGltZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3BfY29tcC5zcHJpdGVGcmFtZSA9IHRoaXMuZnJhbWVzX3NwWzBdLmNsb25lKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm93X2luZGV4ID0gMDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNwX2NvbXAuc3ByaXRlRnJhbWUgPSB0aGlzLmZyYW1lc19zcFtpbmRleF0uY2xvbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub3dfaW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5ub3dfaW5kZXggIT0gaW5kZXgpIHtcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPj0gdGhpcy5mcmFtZV9jb3VudCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFuaW1fZW5kZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm93X2luZGV4ID0gaW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3BfY29tcC5zcHJpdGVGcmFtZSA9IHRoaXMuZnJhbWVzX3NwW2luZGV4XS5jbG9uZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMDY0MDFaSExnOUI4NWx6SExpMDZPN0onLCAnZ2FtZV9zY2VuZScpO1xuLy8gc2NyaXB0c1xcZ2FtZV9zY2VuZS5qc1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIGxldmVsX3Jvb3Q6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBbXSxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfSxcblxuICAgICAgICBmbGlwX2Jsb2Nrc18zeDQ6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBbXSxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfSxcbiAgICAgICAgZmxpcF9ibG9ja3NfMngyOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogW10sXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH0sXG4gICAgICAgIGZsaXBfYmxvY2tzXzJ4Mzoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IFtdLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLmJsb2NrX2xldmVscyA9IFt0aGlzLmZsaXBfYmxvY2tzXzJ4MiwgdGhpcy5mbGlwX2Jsb2Nrc18yeDMsIHRoaXMuZmxpcF9ibG9ja3NfM3g0XTtcbiAgICAgICAgdGhpcy5nYW1lX2xldmVsID0gMDtcblxuICAgICAgICB0aGlzLmNoZWNrb3V0X3Jvb3QgPSBjYy5maW5kKFwiVUlfUk9PVC9jaGVja291dF9yb290XCIpO1xuICAgICAgICB0aGlzLmNrX2xvZ29fcm9vdCA9IGNjLmZpbmQoXCJVSV9ST09UL2NoZWNrb3V0X3Jvb3QvbG9nb19yb290XCIpO1xuICAgICAgICB0aGlzLmNrX3JlcGxheV9idXR0b24gPSBjYy5maW5kKFwiVUlfUk9PVC9jaGVja291dF9yb290L3JlcGxheV9idXR0b25cIik7XG5cbiAgICAgICAgdGhpcy5za2Vfa2ltX2NvbSA9IGNjLmZpbmQoXCJVSV9ST09UL2FuY2hvci1ib3R0b20va2ltXCIpLmdldENvbXBvbmVudChzcC5Ta2VsZXRvbik7XG5cbiAgICAgICAgdGhpcy5sb2NrX2tpbV9jbGljayA9IHRydWU7XG4gICAgfSxcblxuICAgIHNob3dfY2hlY2tvdXQ6IGZ1bmN0aW9uIHNob3dfY2hlY2tvdXQoKSB7XG4gICAgICAgIHRoaXMuY2hlY2tvdXRfcm9vdC5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB0aGlzLmNrX2xvZ29fcm9vdC5zY2FsZSA9IDA7XG4gICAgICAgIHZhciBzMSA9IGNjLnNjYWxlVG8oMC4zLCAxLjIpO1xuICAgICAgICB2YXIgczIgPSBjYy5zY2FsZVRvKDAuMSwgMC45KTtcbiAgICAgICAgdmFyIHMzID0gY2Muc2NhbGVUbygwLjEsIDEuMCk7XG5cbiAgICAgICAgdGhpcy5ja19yZXBsYXlfYnV0dG9uLmFjdGl2ZSA9IGZhbHNlO1xuXG4gICAgICAgIHZhciBjYWxsX2Z1bmMgPSBjYy5jYWxsRnVuYygoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8g5peL6L2s5YWJ57q/XG4gICAgICAgICAgICB0aGlzLmNrX3JlcGxheV9idXR0b24uYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuY2tfcmVwbGF5X2J1dHRvbi5zY2FsZSA9IDMuNTtcbiAgICAgICAgICAgIHRoaXMuY2tfcmVwbGF5X2J1dHRvbi5vcGFjaXR5ID0gMDtcbiAgICAgICAgICAgIHZhciBzY2FsZTEgPSBjYy5zY2FsZVRvKDAuMywgMC44KTtcbiAgICAgICAgICAgIHZhciBzY2FsZTIgPSBjYy5zY2FsZVRvKDAuMiwgMS4yKTtcbiAgICAgICAgICAgIHZhciBzY2FsZTMgPSBjYy5zY2FsZVRvKDAuMSwgMS4wKTtcbiAgICAgICAgICAgIHZhciBzZXEgPSBjYy5zZXF1ZW5jZShbc2NhbGUxLCBzY2FsZTIsIHNjYWxlM10pO1xuICAgICAgICAgICAgdGhpcy5ja19yZXBsYXlfYnV0dG9uLnJ1bkFjdGlvbihzZXEpO1xuICAgICAgICAgICAgdmFyIGZpbiA9IGNjLmZhZGVJbigwLjUpO1xuICAgICAgICAgICAgdGhpcy5ja19yZXBsYXlfYnV0dG9uLnJ1bkFjdGlvbihmaW4pO1xuICAgICAgICB9KS5iaW5kKHRoaXMpLCB0aGlzKTtcblxuICAgICAgICB2YXIgc2VxID0gY2Muc2VxdWVuY2UoW3MxLCBzMiwgczMsIGNhbGxfZnVuY10pO1xuICAgICAgICB0aGlzLmNrX2xvZ29fcm9vdC5ydW5BY3Rpb24oc2VxKTtcbiAgICB9LFxuXG4gICAgYWRqdXN0X2FuY2hvcl93aXRoX2Rlc2lnbjogZnVuY3Rpb24gYWRqdXN0X2FuY2hvcl93aXRoX2Rlc2lnbigpIHtcbiAgICAgICAgdmFyIGFuY2hvcl9wb2ludCA9IGNjLmZpbmQoXCJVSV9ST09UL2FuY2hvci1sdFwiKTtcbiAgICAgICAgaWYgKGFuY2hvcl9wb2ludCkge1xuICAgICAgICAgICAgYW5jaG9yX3BvaW50LnggPSAtNDgwO1xuICAgICAgICAgICAgYW5jaG9yX3BvaW50LnkgPSAzNjA7XG4gICAgICAgIH1cblxuICAgICAgICBhbmNob3JfcG9pbnQgPSBjYy5maW5kKFwiVUlfUk9PVC9hbmNob3ItYm90dG9tXCIpO1xuICAgICAgICBpZiAoYW5jaG9yX3BvaW50KSB7XG4gICAgICAgICAgICBhbmNob3JfcG9pbnQueCA9IDA7XG4gICAgICAgICAgICBhbmNob3JfcG9pbnQueSA9IC0zNjA7XG4gICAgICAgIH1cblxuICAgICAgICBhbmNob3JfcG9pbnQgPSBjYy5maW5kKFwiVUlfUk9PVC9hbmNob3ItbGJcIik7XG4gICAgICAgIGlmIChhbmNob3JfcG9pbnQpIHtcbiAgICAgICAgICAgIGFuY2hvcl9wb2ludC54ID0gLTQ4MDtcbiAgICAgICAgICAgIGFuY2hvcl9wb2ludC55ID0gLTM2MDtcbiAgICAgICAgfVxuXG4gICAgICAgIGFuY2hvcl9wb2ludCA9IGNjLmZpbmQoXCJVSV9ST09UL2FuY2hvci1yYlwiKTtcbiAgICAgICAgaWYgKGFuY2hvcl9wb2ludCkge1xuICAgICAgICAgICAgYW5jaG9yX3BvaW50LnggPSA0ODA7XG4gICAgICAgICAgICBhbmNob3JfcG9pbnQueSA9IC0zNjA7XG4gICAgICAgIH1cblxuICAgICAgICBhbmNob3JfcG9pbnQgPSBjYy5maW5kKFwiVUlfUk9PVC9hbmNob3ItdG9wXCIpO1xuICAgICAgICBpZiAoYW5jaG9yX3BvaW50KSB7XG4gICAgICAgICAgICBhbmNob3JfcG9pbnQueCA9IDA7XG4gICAgICAgICAgICBhbmNob3JfcG9pbnQueSA9IDM2MDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBhZGp1c3RfYW5jaG9yOiBmdW5jdGlvbiBhZGp1c3RfYW5jaG9yKCkge1xuICAgICAgICB2YXIgd2luX3NpemUgPSBjYy5kaXJlY3Rvci5nZXRXaW5TaXplKCk7XG5cbiAgICAgICAgdmFyIGN4ID0gd2luX3NpemUud2lkdGggKiAwLjU7XG4gICAgICAgIHZhciBjeSA9IHdpbl9zaXplLmhlaWdodCAqIDAuNTtcblxuICAgICAgICB2YXIgYW5jaG9yX3BvaW50ID0gY2MuZmluZChcIlVJX1JPT1QvYW5jaG9yLWx0XCIpO1xuICAgICAgICBpZiAoYW5jaG9yX3BvaW50KSB7XG4gICAgICAgICAgICBhbmNob3JfcG9pbnQueCA9IC1jeDtcbiAgICAgICAgICAgIGFuY2hvcl9wb2ludC55ID0gY3k7XG4gICAgICAgIH1cblxuICAgICAgICBhbmNob3JfcG9pbnQgPSBjYy5maW5kKFwiVUlfUk9PVC9hbmNob3ItYm90dG9tXCIpO1xuICAgICAgICBpZiAoYW5jaG9yX3BvaW50KSB7XG4gICAgICAgICAgICBhbmNob3JfcG9pbnQueCA9IDA7XG4gICAgICAgICAgICBhbmNob3JfcG9pbnQueSA9IC1jeTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFuY2hvcl9wb2ludCA9IGNjLmZpbmQoXCJVSV9ST09UL2FuY2hvci1sYlwiKTtcbiAgICAgICAgaWYgKGFuY2hvcl9wb2ludCkge1xuICAgICAgICAgICAgYW5jaG9yX3BvaW50LnggPSAtY3g7XG4gICAgICAgICAgICBhbmNob3JfcG9pbnQueSA9IC1jeTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFuY2hvcl9wb2ludCA9IGNjLmZpbmQoXCJVSV9ST09UL2FuY2hvci1yYlwiKTtcbiAgICAgICAgaWYgKGFuY2hvcl9wb2ludCkge1xuICAgICAgICAgICAgYW5jaG9yX3BvaW50LnggPSBjeDtcbiAgICAgICAgICAgIGFuY2hvcl9wb2ludC55ID0gLWN5O1xuICAgICAgICB9XG5cbiAgICAgICAgYW5jaG9yX3BvaW50ID0gY2MuZmluZChcIlVJX1JPT1QvYW5jaG9yLXRvcFwiKTtcbiAgICAgICAgaWYgKGFuY2hvcl9wb2ludCkge1xuICAgICAgICAgICAgYW5jaG9yX3BvaW50LnggPSAwO1xuICAgICAgICAgICAgYW5jaG9yX3BvaW50LnkgPSBjeTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBhZGp1c3Rfd2luZG93OiBmdW5jdGlvbiBhZGp1c3Rfd2luZG93KHdpbl9zaXplKSB7XG4gICAgICAgIHZhciBkZXNpZ25fNF8zID0gZmFsc2U7XG4gICAgICAgIGlmICgxMDI0ICogd2luX3NpemUuaGVpZ2h0ID4gNzY4ICogd2luX3NpemUud2lkdGgpIHtcbiAgICAgICAgICAgIHRoaXMuYWRqdXN0X2FuY2hvcl93aXRoX2Rlc2lnbigpO1xuICAgICAgICAgICAgZGVzaWduXzRfMyA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmFkanVzdF9hbmNob3IoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBwbGF5X2tpbV9hbmltX3dpdGhfcmlnaHQ6IGZ1bmN0aW9uIHBsYXlfa2ltX2FuaW1fd2l0aF9yaWdodCgpIHtcbiAgICAgICAgdGhpcy5za2Vfa2ltX2NvbS5jbGVhclRyYWNrcygpO1xuICAgICAgICB0aGlzLnNrZV9raW1fY29tLnNldEFuaW1hdGlvbigwLCBcIm9rXzFcIiwgZmFsc2UpO1xuICAgICAgICB0aGlzLmNhbGxfbGF0dGVyKChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnNrZV9raW1fY29tLmNsZWFyVHJhY2tzKCk7XG4gICAgICAgICAgICB0aGlzLnNrZV9raW1fY29tLnNldEFuaW1hdGlvbigwLCBcImlkbGVfMVwiLCB0cnVlKTtcbiAgICAgICAgfSkuYmluZCh0aGlzKSwgMik7XG4gICAgfSxcblxuICAgIHBsYXlfa2ltX2FuaW1fd2l0aF9lcnJvcjogZnVuY3Rpb24gcGxheV9raW1fYW5pbV93aXRoX2Vycm9yKCkge1xuICAgICAgICB0aGlzLnNrZV9raW1fY29tLmNsZWFyVHJhY2tzKCk7XG4gICAgICAgIHRoaXMuc2tlX2tpbV9jb20uc2V0QW5pbWF0aW9uKDAsIFwiZXJyXzFcIiwgZmFsc2UpO1xuICAgICAgICB0aGlzLmNhbGxfbGF0dGVyKChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnNrZV9raW1fY29tLmNsZWFyVHJhY2tzKCk7XG4gICAgICAgICAgICB0aGlzLnNrZV9raW1fY29tLnNldEFuaW1hdGlvbigwLCBcImlkbGVfMVwiLCB0cnVlKTtcbiAgICAgICAgfSkuYmluZCh0aGlzKSwgMS41KTtcbiAgICB9LFxuXG4gICAgcGxheV9raW1fY2xpY2tfYW5pbV93aXRoX3JhbmRvbTogZnVuY3Rpb24gcGxheV9raW1fY2xpY2tfYW5pbV93aXRoX3JhbmRvbSgpIHtcbiAgICAgICAgdmFyIHYgPSBNYXRoLnJhbmRvbSgpO1xuICAgICAgICB2YXIgYW5pbV9uYW1lID0gXCJjbGtfMVwiO1xuICAgICAgICB2YXIgc291bmRfbmFtZSA9IFwicmVzb3VyY2VzL3NvdW5kcy9raW1fY2xrMS5tcDNcIjtcbiAgICAgICAgaWYgKHYgPCAwLjUpIHtcbiAgICAgICAgICAgIGFuaW1fbmFtZSA9IFwiY2xrXzJcIjtcbiAgICAgICAgICAgIHNvdW5kX25hbWUgPSBcInJlc291cmNlcy9zb3VuZHMva2ltX2NsazIubXAzXCI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sb2NrX2tpbV9jbGljayA9IHRydWU7XG4gICAgICAgIHRoaXMucGxheV9zb3VuZChzb3VuZF9uYW1lKTtcbiAgICAgICAgdGhpcy5za2Vfa2ltX2NvbS5jbGVhclRyYWNrcygpO1xuICAgICAgICB0aGlzLnNrZV9raW1fY29tLnNldEFuaW1hdGlvbigwLCBhbmltX25hbWUsIGZhbHNlKTtcblxuICAgICAgICB0aGlzLmNhbGxfbGF0dGVyKChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnNrZV9raW1fY29tLmNsZWFyVHJhY2tzKCk7XG4gICAgICAgICAgICB0aGlzLnNrZV9raW1fY29tLnNldEFuaW1hdGlvbigwLCBcImlkbGVfMVwiLCB0cnVlKTtcbiAgICAgICAgICAgIHRoaXMubG9ja19raW1fY2xpY2sgPSBmYWxzZTtcbiAgICAgICAgfSkuYmluZCh0aGlzKSwgMik7XG4gICAgfSxcblxuICAgIHN0YXJ0OiBmdW5jdGlvbiBzdGFydCgpIHtcbiAgICAgICAgdGhpcy5nYW1lX3N0YXJ0ID0gZmFsc2U7XG4gICAgICAgIHRoaXMubG9ja2luZ19nYW1lID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKHRoaXMub25fZ2FtZV9zdGFydC5iaW5kKHRoaXMpLCAwKTtcblxuICAgICAgICB2YXIgd2luX3NpemUgPSBjYy5kaXJlY3Rvci5nZXRXaW5TaXplKCk7XG4gICAgICAgIHRoaXMucHJldl9zaXplID0gd2luX3NpemU7XG4gICAgICAgIHRoaXMuYWRqdXN0X3dpbmRvdyh3aW5fc2l6ZSk7XG5cbiAgICAgICAgdGhpcy5jYWxsX2xhdHRlcigoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5za2Vfa2ltX2NvbS5jbGVhclRyYWNrcygpO1xuICAgICAgICAgICAgdGhpcy5za2Vfa2ltX2NvbS5zZXRBbmltYXRpb24oMCwgXCJpZGxlXzFcIiwgdHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLmxvY2tfa2ltX2NsaWNrID0gZmFsc2U7XG4gICAgICAgIH0pLmJpbmQodGhpcyksIDAuOSk7XG4gICAgfSxcblxuICAgIHJlc2V0X2ZsaXBfYmxvY2s6IGZ1bmN0aW9uIHJlc2V0X2ZsaXBfYmxvY2soKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5mbGlwX2Jsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGJsb2NrID0gdGhpcy5mbGlwX2Jsb2Nrc1tpXTtcbiAgICAgICAgICAgIHZhciBibG9ja19jb21wID0gYmxvY2suZ2V0Q29tcG9uZW50KFwiZmxpcF9ibG9ja1wiKTtcbiAgICAgICAgICAgIGJsb2NrX2NvbXAuZmxpcF90b19iYWNrKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZmxpcF9ibG9ja193aXRoX2FycmF5OiBmdW5jdGlvbiBmbGlwX2Jsb2NrX3dpdGhfYXJyYXkodmFsdWVfYXJyYXkpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZV9hcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGJsb2NrID0gdGhpcy5mbGlwX2Jsb2Nrc1tpXTtcbiAgICAgICAgICAgIHZhciBibG9ja19jb21wID0gYmxvY2suZ2V0Q29tcG9uZW50KFwiZmxpcF9ibG9ja1wiKTtcbiAgICAgICAgICAgIGJsb2NrX2NvbXAuZmxpcF90b19iYWNrX3dpdGhfdmFsdWUodmFsdWVfYXJyYXlbaV0pO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uX2dhbWVfcmVwbGF5OiBmdW5jdGlvbiBvbl9nYW1lX3JlcGxheSgpIHtcbiAgICAgICAgdGhpcy5wbGF5X3NvdW5kKFwicmVzb3VyY2VzL3NvdW5kcy9idXR0b24ubXAzXCIpO1xuICAgICAgICB0aGlzLm9uX2dhbWVfc3RhcnQoKTtcbiAgICB9LFxuXG4gICAgb25fZ2FtZV9zdGFydDogZnVuY3Rpb24gb25fZ2FtZV9zdGFydCgpIHtcbiAgICAgICAgaWYgKHRoaXMuZ2FtZV9sZXZlbCA+IDIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2hlY2tvdXRfcm9vdC5hY3RpdmUgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLmdhbWVfc3RhcnQgPSB0cnVlO1xuXG4gICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLmJsb2NrX2xldmVscy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgIHRoaXMubGV2ZWxfcm9vdFtpbmRleF0uYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sZXZlbF9yb290W3RoaXMuZ2FtZV9sZXZlbF0uYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5mbGlwX2Jsb2NrcyA9IHRoaXMuYmxvY2tfbGV2ZWxzW3RoaXMuZ2FtZV9sZXZlbF07XG5cbiAgICAgICAgaWYgKHRoaXMuZ2FtZV9sZXZlbCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy52YWx1ZV9hcnJheSA9IFs0LCA0LCAwLCAwXTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmdhbWVfbGV2ZWwgPT09IDEpIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWVfYXJyYXkgPSBbMSwgMiwgMywgMywgMiwgMV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnZhbHVlX2FycmF5ID0gWzAsIDEsIDIsIDMsIDMsIDAsIDEsIDIsIDQsIDIsIDQsIDJdO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudmFsdWVfYXJyYXkuc29ydChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5yYW5kb20oKSAtIDAuNTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5mbGlwX2Jsb2NrX3dpdGhfYXJyYXkodGhpcy52YWx1ZV9hcnJheSk7XG4gICAgICAgIHRoaXMuZ2FtZV9zdGFnZSA9IDA7XG4gICAgICAgIHRoaXMubG9ja2luZ19nYW1lID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZmxpcF9tYXNrID0gWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdO1xuXG4gICAgICAgIC8vIHRoaXMuc2hvd19jaGVja291dCgpO1xuICAgIH0sXG5cbiAgICBwbGF5X3NvdW5kOiBmdW5jdGlvbiBwbGF5X3NvdW5kKG5hbWUpIHtcbiAgICAgICAgY2MuYXVkaW9FbmdpbmUuc3RvcE11c2ljKGZhbHNlKTtcbiAgICAgICAgdmFyIHVybCA9IGNjLnVybC5yYXcobmFtZSk7XG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlNdXNpYyh1cmwsIGZhbHNlKTtcbiAgICB9LFxuXG4gICAgY2hlY2tvdXRfc3VjY2VzczogZnVuY3Rpb24gY2hlY2tvdXRfc3VjY2VzcygpIHtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5mbGlwX2Jsb2Nrcy5sZW5ndGgpO1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmZsaXBfbWFzayk7XG4gICAgICAgIHZhciBpO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5mbGlwX2Jsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuZmxpcF9tYXNrW2ldID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG5cbiAgICBzaG93X3JpZ2h0X2FuaW06IGZ1bmN0aW9uIHNob3dfcmlnaHRfYW5pbSgpIHtcbiAgICAgICAgdmFyIHMxID0gY2Muc2NhbGVUbygwLjMsIDEuMSk7XG4gICAgICAgIHZhciBkZWxheSA9IGNjLmRlbGF5VGltZSgwLjIpO1xuICAgICAgICB2YXIgczIgPSBjYy5zY2FsZVRvKDAuMSwgMS4wKTtcblxuICAgICAgICB2YXIgc2VxID0gY2Muc2VxdWVuY2UoW3MxLCBkZWxheSwgczJdKTtcblxuICAgICAgICB0aGlzLmZpcnN0X2ZsaXAubm9kZS5ydW5BY3Rpb24oc2VxKTtcbiAgICAgICAgdGhpcy5zZWNvbmRfZmxpcC5ub2RlLnJ1bkFjdGlvbihzZXEuY2xvbmUoKSk7XG4gICAgfSxcblxuICAgIGNhbGxfbGF0dGVyOiBmdW5jdGlvbiBjYWxsX2xhdHRlcihjYWxsZnVuYywgZGVsYXkpIHtcbiAgICAgICAgdmFyIGRlbGF5X2FjdGlvbiA9IGNjLmRlbGF5VGltZShkZWxheSk7XG4gICAgICAgIHZhciBjYWxsX2FjdGlvbiA9IGNjLmNhbGxGdW5jKGNhbGxmdW5jLCB0aGlzKTtcbiAgICAgICAgdmFyIHNlcSA9IGNjLnNlcXVlbmNlKFtkZWxheV9hY3Rpb24sIGNhbGxfYWN0aW9uXSk7XG4gICAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24oc2VxKTtcbiAgICB9LFxuXG4gICAgb25fY2FyZF9mbGlwOiBmdW5jdGlvbiBvbl9jYXJkX2ZsaXAoYmxvY2ssIGNhcmRfdmFsdWUpIHtcbiAgICAgICAgaWYgKHRoaXMuZ2FtZV9zdGFydCA9PT0gZmFsc2UgfHwgdGhpcy5sb2NraW5nX2dhbWUgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUubG9nKFwiY2FyZF9mbGlwID1cIiArIGNhcmRfdmFsdWUpO1xuICAgICAgICB2YXIgc291bmRzX25hbWUgPSBbXCJyZXNvdXJjZXMvc291bmRzL2Nhci5tcDNcIiwgXCJyZXNvdXJjZXMvc291bmRzL3BsYW5lLm1wM1wiLCBcInJlc291cmNlcy9zb3VuZHMvdHJhaW4ubXAzXCIsIFwicmVzb3VyY2VzL3NvdW5kcy9iYWxsb29uLm1wM1wiLCBcInJlc291cmNlcy9zb3VuZHMvdGVkZHkubXAzXCJdO1xuXG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnN0b3BNdXNpYyhmYWxzZSk7XG4gICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciB1cmwgPSBjYy51cmwucmF3KHNvdW5kc19uYW1lW2NhcmRfdmFsdWVdKTtcbiAgICAgICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlNdXNpYyh1cmwsIGZhbHNlKTtcbiAgICAgICAgfSwgMCk7XG5cbiAgICAgICAgYmxvY2suZmxpcF90b192YWx1ZSgpO1xuICAgICAgICB0aGlzLmdhbWVfc3RhZ2UgPSB0aGlzLmdhbWVfc3RhZ2UgKyAxO1xuXG4gICAgICAgIGlmICh0aGlzLmdhbWVfc3RhZ2UgPT09IDEpIHtcbiAgICAgICAgICAgIC8vIOe/u+W8gOS4gOW8oOeJjFxuICAgICAgICAgICAgdGhpcy5maXJzdF9mbGlwID0gYmxvY2s7XG4gICAgICAgICAgICB0aGlzLmxvY2tpbmdfZ2FtZSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnNjaGVkdWxlT25jZSgoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHRoaXMubG9ja2luZ19nYW1lID0gZmFsc2U7XG4gICAgICAgICAgICB9KS5iaW5kKHRoaXMpLCAxICogMC43KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2Vjb25kX2ZsaXAgPSBibG9jaztcblxuICAgICAgICBpZiAodGhpcy5nYW1lX3N0YWdlID09IDIpIHtcbiAgICAgICAgICAgIHRoaXMuZ2FtZV9zdGFnZSA9IDA7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmZpcnN0X2ZsaXAuZ2V0X2NhcmRfdmFsdWUoKSAhPSB0aGlzLnNlY29uZF9mbGlwLmdldF9jYXJkX3ZhbHVlKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXlfa2ltX2FuaW1fd2l0aF9lcnJvcigpO1xuICAgICAgICAgICAgICAgIHRoaXMubG9ja2luZ19nYW1lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAvLyDnv7vkuozlvKDniYzliLDog4zpnaJcbiAgICAgICAgICAgICAgICB0aGlzLnNjaGVkdWxlT25jZSgoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmZpcnN0X2ZsaXAuZmxpcF90b19iYWNrKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2Vjb25kX2ZsaXAuZmxpcF90b19iYWNrKCk7XG4gICAgICAgICAgICAgICAgfSkuYmluZCh0aGlzKSwgMS4wICogMC43KTtcblxuICAgICAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9ja2luZ19nYW1lID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSkuYmluZCh0aGlzKSwgMS4yICogMC43KTtcbiAgICAgICAgICAgICAgICAvLyBlbmRcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBmaXJzdCA9IHRoaXMuZmlyc3RfZmxpcC5nZXRfc2VhdCgpO1xuICAgICAgICAgICAgdmFyIHNlY29uZCA9IHRoaXMuc2Vjb25kX2ZsaXAuZ2V0X3NlYXQoKTtcblxuICAgICAgICAgICAgdGhpcy5mbGlwX21hc2tbZmlyc3RdID0gMTtcbiAgICAgICAgICAgIHRoaXMuZmxpcF9tYXNrW3NlY29uZF0gPSAxO1xuICAgICAgICAgICAgdGhpcy5sb2NraW5nX2dhbWUgPSB0cnVlO1xuXG4gICAgICAgICAgICAvLyDmkq3mlL7mv4DlirHliqjnlLtcbiAgICAgICAgICAgIHRoaXMucGxheV9raW1fYW5pbV93aXRoX3JpZ2h0KCk7XG4gICAgICAgICAgICB0aGlzLnNjaGVkdWxlT25jZSgoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvd19yaWdodF9hbmltKCk7XG4gICAgICAgICAgICB9KS5iaW5kKHRoaXMpLCAwLjIpO1xuXG4gICAgICAgICAgICB0aGlzLnNjaGVkdWxlT25jZSgoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHRoaXMubG9ja2luZ19nYW1lID0gZmFsc2U7XG4gICAgICAgICAgICB9KS5iaW5kKHRoaXMpLCAxKTtcbiAgICAgICAgICAgIC8vIGVuZFxuXG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja291dF9zdWNjZXNzKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWVfc3RhcnQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWVfbGV2ZWwrKztcblxuICAgICAgICAgICAgICAgIHRoaXMuY2FsbF9sYXR0ZXIoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbGF5X3NvdW5kKFwicmVzb3VyY2VzL3NvdW5kcy9lbmQubXAzXCIpO1xuICAgICAgICAgICAgICAgIH0pLmJpbmQodGhpcyksIDEuMCk7XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nYW1lX2xldmVsID09PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZV9sZXZlbCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIC8vIDAuNeenkuWQjuW8uee7k+eul+aNoumdolxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjaGVkdWxlT25jZSh0aGlzLnNob3dfY2hlY2tvdXQuYmluZCh0aGlzKSwgMS4yKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gZW5kICBcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jYWxsX2xhdHRlcih0aGlzLm9uX2dhbWVfc3RhcnQuYmluZCh0aGlzKSwgMS4yKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uX2dvdG9faG9tZTogZnVuY3Rpb24gb25fZ290b19ob21lKCkge1xuICAgICAgICBjYy5hdWRpb0VuZ2luZS5zdG9wTXVzaWMoZmFsc2UpO1xuICAgICAgICB2YXIgdXJsID0gY2MudXJsLnJhdyhcInJlc291cmNlcy9zb3VuZHMvYnV0dG9uLm1wM1wiKTtcbiAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheU11c2ljKHVybCwgZmFsc2UpO1xuICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJzdGFydF9zY2VuZVwiKTtcbiAgICB9LFxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcbiAgICAgICAgdmFyIHdpbl9zaXplID0gY2MuZGlyZWN0b3IuZ2V0V2luU2l6ZSgpO1xuICAgICAgICBpZiAod2luX3NpemUud2lkdGggIT0gdGhpcy5wcmV2X3NpemUud2lkdGggfHwgd2luX3NpemUuaGVpZ2h0ICE9IHRoaXMucHJldl9zaXplLmhlaWdodCkge1xuICAgICAgICAgICAgdGhpcy5wcmV2X3NpemUgPSB3aW5fc2l6ZTtcbiAgICAgICAgICAgIHRoaXMuYWRqdXN0X3dpbmRvdyh3aW5fc2l6ZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25fa2ltX2NsaWNrOiBmdW5jdGlvbiBvbl9raW1fY2xpY2soKSB7XG4gICAgICAgIGlmICh0aGlzLmxvY2tfa2ltX2NsaWNrID09PSB0cnVlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wbGF5X2tpbV9jbGlja19hbmltX3dpdGhfcmFuZG9tKCk7XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc0Zjg5MllLcnJSTDFxRVY1MkhKYlpHSScsICdzdGFydF9zY2VuZScpO1xuLy8gc2NyaXB0c1xcc3RhcnRfc2NlbmUuanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgIH0sXG5cbiAgICBhZGp1c3RfYW5jaG9yX3dpdGhfZGVzaWduOiBmdW5jdGlvbiBhZGp1c3RfYW5jaG9yX3dpdGhfZGVzaWduKCkge1xuICAgICAgICB2YXIgYW5jaG9yX3BvaW50ID0gY2MuZmluZChcIlVJX1JPT1QvYW5jaG9yLWx0XCIpO1xuICAgICAgICBpZiAoYW5jaG9yX3BvaW50KSB7XG4gICAgICAgICAgICBhbmNob3JfcG9pbnQueCA9IC00ODA7XG4gICAgICAgICAgICBhbmNob3JfcG9pbnQueSA9IDM2MDtcbiAgICAgICAgfVxuXG4gICAgICAgIGFuY2hvcl9wb2ludCA9IGNjLmZpbmQoXCJVSV9ST09UL2FuY2hvci1ib3R0b21cIik7XG4gICAgICAgIGlmIChhbmNob3JfcG9pbnQpIHtcbiAgICAgICAgICAgIGFuY2hvcl9wb2ludC54ID0gMDtcbiAgICAgICAgICAgIGFuY2hvcl9wb2ludC55ID0gLTM2MDtcbiAgICAgICAgfVxuXG4gICAgICAgIGFuY2hvcl9wb2ludCA9IGNjLmZpbmQoXCJVSV9ST09UL2FuY2hvci1sYlwiKTtcbiAgICAgICAgaWYgKGFuY2hvcl9wb2ludCkge1xuICAgICAgICAgICAgYW5jaG9yX3BvaW50LnggPSAtNDgwO1xuICAgICAgICAgICAgYW5jaG9yX3BvaW50LnkgPSAtMzYwO1xuICAgICAgICB9XG5cbiAgICAgICAgYW5jaG9yX3BvaW50ID0gY2MuZmluZChcIlVJX1JPT1QvYW5jaG9yLXJiXCIpO1xuICAgICAgICBpZiAoYW5jaG9yX3BvaW50KSB7XG4gICAgICAgICAgICBhbmNob3JfcG9pbnQueCA9IDQ4MDtcbiAgICAgICAgICAgIGFuY2hvcl9wb2ludC55ID0gLTM2MDtcbiAgICAgICAgfVxuXG4gICAgICAgIGFuY2hvcl9wb2ludCA9IGNjLmZpbmQoXCJVSV9ST09UL2FuY2hvci10b3BcIik7XG4gICAgICAgIGlmIChhbmNob3JfcG9pbnQpIHtcbiAgICAgICAgICAgIGFuY2hvcl9wb2ludC54ID0gMDtcbiAgICAgICAgICAgIGFuY2hvcl9wb2ludC55ID0gMzYwO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGFkanVzdF9hbmNob3I6IGZ1bmN0aW9uIGFkanVzdF9hbmNob3IoKSB7XG4gICAgICAgIHZhciB3aW5fc2l6ZSA9IGNjLmRpcmVjdG9yLmdldFdpblNpemUoKTtcblxuICAgICAgICB2YXIgY3ggPSB3aW5fc2l6ZS53aWR0aCAqIDAuNTtcbiAgICAgICAgdmFyIGN5ID0gd2luX3NpemUuaGVpZ2h0ICogMC41O1xuXG4gICAgICAgIHZhciBhbmNob3JfcG9pbnQgPSBjYy5maW5kKFwiVUlfUk9PVC9hbmNob3ItbHRcIik7XG4gICAgICAgIGlmIChhbmNob3JfcG9pbnQpIHtcbiAgICAgICAgICAgIGFuY2hvcl9wb2ludC54ID0gLWN4O1xuICAgICAgICAgICAgYW5jaG9yX3BvaW50LnkgPSBjeTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFuY2hvcl9wb2ludCA9IGNjLmZpbmQoXCJVSV9ST09UL2FuY2hvci1ib3R0b21cIik7XG4gICAgICAgIGlmIChhbmNob3JfcG9pbnQpIHtcbiAgICAgICAgICAgIGFuY2hvcl9wb2ludC54ID0gMDtcbiAgICAgICAgICAgIGFuY2hvcl9wb2ludC55ID0gLWN5O1xuICAgICAgICB9XG5cbiAgICAgICAgYW5jaG9yX3BvaW50ID0gY2MuZmluZChcIlVJX1JPT1QvYW5jaG9yLWxiXCIpO1xuICAgICAgICBpZiAoYW5jaG9yX3BvaW50KSB7XG4gICAgICAgICAgICBhbmNob3JfcG9pbnQueCA9IC1jeDtcbiAgICAgICAgICAgIGFuY2hvcl9wb2ludC55ID0gLWN5O1xuICAgICAgICB9XG5cbiAgICAgICAgYW5jaG9yX3BvaW50ID0gY2MuZmluZChcIlVJX1JPT1QvYW5jaG9yLXJiXCIpO1xuICAgICAgICBpZiAoYW5jaG9yX3BvaW50KSB7XG4gICAgICAgICAgICBhbmNob3JfcG9pbnQueCA9IGN4O1xuICAgICAgICAgICAgYW5jaG9yX3BvaW50LnkgPSAtY3k7XG4gICAgICAgIH1cblxuICAgICAgICBhbmNob3JfcG9pbnQgPSBjYy5maW5kKFwiVUlfUk9PVC9hbmNob3ItdG9wXCIpO1xuICAgICAgICBpZiAoYW5jaG9yX3BvaW50KSB7XG4gICAgICAgICAgICBhbmNob3JfcG9pbnQueCA9IDA7XG4gICAgICAgICAgICBhbmNob3JfcG9pbnQueSA9IGN5O1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGFkanVzdF93aW5kb3c6IGZ1bmN0aW9uIGFkanVzdF93aW5kb3cod2luX3NpemUpIHtcbiAgICAgICAgdmFyIGRlc2lnbl80XzMgPSBmYWxzZTtcbiAgICAgICAgaWYgKDEwMjQgKiB3aW5fc2l6ZS5oZWlnaHQgPiA3NjggKiB3aW5fc2l6ZS53aWR0aCkge1xuICAgICAgICAgICAgdGhpcy5hZGp1c3RfYW5jaG9yX3dpdGhfZGVzaWduKCk7XG4gICAgICAgICAgICBkZXNpZ25fNF8zID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYWRqdXN0X2FuY2hvcigpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHN0YXJ0OiBmdW5jdGlvbiBzdGFydCgpIHtcbiAgICAgICAgdmFyIHdpbl9zaXplID0gY2MuZGlyZWN0b3IuZ2V0V2luU2l6ZSgpO1xuICAgICAgICB0aGlzLnByZXZfc2l6ZSA9IHdpbl9zaXplO1xuICAgICAgICB0aGlzLmFkanVzdF93aW5kb3cod2luX3NpemUpO1xuICAgIH0sXG5cbiAgICBwcmVsb2FkX3NvdW5kczogZnVuY3Rpb24gcHJlbG9hZF9zb3VuZHMoKSB7XG4gICAgICAgIHZhciBzb3VuZF9saXN0ID0gW1wicmVzb3VyY2VzL3NvdW5kcy9iYWxsb29uLm1wM1wiLCBcInJlc291cmNlcy9zb3VuZHMvYnV0dG9uLm1wM1wiLCBcInJlc291cmNlcy9zb3VuZHMvY2FyLm1wM1wiLCBcInJlc291cmNlcy9zb3VuZHMvZW5kLm1wM1wiLCBcInJlc291cmNlcy9zb3VuZHMva2ltX2NsazEubXAzXCIsIFwicmVzb3VyY2VzL3NvdW5kcy9raW1fY2xrMi5tcDNcIiwgXCJyZXNvdXJjZXMvc291bmRzL3BsYW5lLm1wM1wiLCBcInJlc291cmNlcy9zb3VuZHMvdGVkZHkubXAzXCIsIFwicmVzb3VyY2VzL3NvdW5kcy90cmFpbi5tcDNcIl07XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzb3VuZF9saXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgdXJsID0gY2MudXJsLnJhdyhzb3VuZF9saXN0W2ldKTtcbiAgICAgICAgICAgIGNjLmxvYWRlci5sb2FkUmVzKHVybCwgZnVuY3Rpb24gKCkge30pO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLnByZWxvYWRfc291bmRzKCk7XG4gICAgICAgIC8vIGxvZ29cbiAgICAgICAgdmFyIGxvZ28gPSBjYy5maW5kKFwiVUlfUk9PVC9hbmNob3ItY2VudGVyL2xvZ29fcm9vdFwiKTtcblxuICAgICAgICBsb2dvLnkgKz0gNDAwO1xuICAgICAgICB2YXIgbW92ZTEgPSBjYy5tb3ZlQnkoMC4yLCAwLCAtNDEwKTtcbiAgICAgICAgdmFyIG1vdmUyID0gY2MubW92ZUJ5KDAuMiwgMCwgMjApO1xuICAgICAgICB2YXIgbW92ZTMgPSBjYy5tb3ZlQnkoMC4xLCAwLCAtMTApO1xuXG4gICAgICAgIHZhciBzdGFydF9idXR0b24gPSBjYy5maW5kKFwiVUlfUk9PVC9hbmNob3ItY2VudGVyL3N0YXJ0X2J1dHRvblwiKTtcbiAgICAgICAgc3RhcnRfYnV0dG9uLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB2YXIgY2FsbGZ1bmMgPSBjYy5jYWxsRnVuYygoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc3RhcnRfYnV0dG9uLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICBzdGFydF9idXR0b24uc2NhbGUgPSAzLjU7XG4gICAgICAgICAgICBzdGFydF9idXR0b24ub3BhY2l0eSA9IDA7XG4gICAgICAgICAgICB2YXIgc2NhbGUxID0gY2Muc2NhbGVUbygwLjMsIDAuOCk7XG4gICAgICAgICAgICB2YXIgc2NhbGUyID0gY2Muc2NhbGVUbygwLjIsIDEuMik7XG4gICAgICAgICAgICB2YXIgc2NhbGUzID0gY2Muc2NhbGVUbygwLjEsIDEuMCk7XG4gICAgICAgICAgICB2YXIgc2VxID0gY2Muc2VxdWVuY2UoW3NjYWxlMSwgc2NhbGUyLCBzY2FsZTNdKTtcbiAgICAgICAgICAgIHN0YXJ0X2J1dHRvbi5ydW5BY3Rpb24oc2VxKTtcbiAgICAgICAgICAgIHZhciBmaW4gPSBjYy5mYWRlSW4oMC41KTtcbiAgICAgICAgICAgIHN0YXJ0X2J1dHRvbi5ydW5BY3Rpb24oZmluKTtcbiAgICAgICAgfSkuYmluZCh0aGlzKSwgdGhpcyk7XG5cbiAgICAgICAgdmFyIGJ1dHQgPSBjYy5maW5kKFwiVUlfUk9PVC9hbmNob3ItY2VudGVyL2xvZ29fcm9vdC9sb2dvX2J1dHRlcmZseVwiKTtcbiAgICAgICAgYnV0dC5zY2FsZSA9IDA7XG4gICAgICAgIGJ1dHQub3BhY2l0eSA9IDA7XG5cbiAgICAgICAgdmFyIGNhbGxfZnVuYzIgPSBjYy5jYWxsRnVuYygoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHMgPSBjYy5zY2FsZVRvKDAuMiwgMS4wKTtcbiAgICAgICAgICAgIHZhciBmaW4gPSBjYy5mYWRlSW4oMC4xKTtcbiAgICAgICAgICAgIHZhciBtX3VwID0gY2MubW92ZUJ5KDAuNCwgMCwgNSk7XG4gICAgICAgICAgICB2YXIgbV9kb3duID0gY2MubW92ZUJ5KDAuNCwgMCwgLTUpO1xuICAgICAgICAgICAgdmFyIGYgPSBjYy5yZXBlYXRGb3JldmVyKGNjLnNlcXVlbmNlKFttX3VwLCBtX2Rvd25dKSk7XG4gICAgICAgICAgICB2YXIgc2VxMiA9IGNjLnNlcXVlbmNlKFtzLCBmXSk7XG5cbiAgICAgICAgICAgIGJ1dHQucnVuQWN0aW9uKHMpO1xuICAgICAgICAgICAgYnV0dC5ydW5BY3Rpb24oZmluKTtcbiAgICAgICAgICAgIGJ1dHQucnVuQWN0aW9uKGYpO1xuICAgICAgICB9KS5iaW5kKHRoaXMpLCB0aGlzKTtcblxuICAgICAgICB2YXIgYmVlID0gY2MuZmluZChcIlVJX1JPT1QvYW5jaG9yLWNlbnRlci9sb2dvX3Jvb3QvbG9nb19iZWVcIik7XG4gICAgICAgIGJlZS5zY2FsZSA9IDA7XG4gICAgICAgIGJlZS5vcGFjaXR5ID0gMDtcbiAgICAgICAgdmFyIGNhbGxfZnVuYzMgPSBjYy5jYWxsRnVuYygoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHMgPSBjYy5zY2FsZVRvKDAuMiwgMS4wKTtcbiAgICAgICAgICAgIHZhciBmaW4gPSBjYy5mYWRlSW4oMC4xKTtcbiAgICAgICAgICAgIHZhciBtX3VwID0gY2MubW92ZUJ5KDAuNCwgMCwgNSk7XG4gICAgICAgICAgICB2YXIgbV9kb3duID0gY2MubW92ZUJ5KDAuNCwgMCwgLTUpO1xuICAgICAgICAgICAgdmFyIGYgPSBjYy5yZXBlYXRGb3JldmVyKGNjLnNlcXVlbmNlKFttX3VwLCBtX2Rvd25dKSk7XG4gICAgICAgICAgICB2YXIgc2VxMiA9IGNjLnNlcXVlbmNlKFtzLCBmXSk7XG5cbiAgICAgICAgICAgIGJlZS5ydW5BY3Rpb24ocyk7XG4gICAgICAgICAgICBiZWUucnVuQWN0aW9uKGZpbik7XG4gICAgICAgICAgICBiZWUucnVuQWN0aW9uKGYpO1xuICAgICAgICB9KS5iaW5kKHRoaXMpLCB0aGlzKTtcblxuICAgICAgICAvKlxyXG4gICAgICAgIHZhciBhbnQgPSBjYy5maW5kKFwiVUlfUk9PVC9hbmNob3ItY2VudGVyL2xvZ29fcm9vdC9sb2dvX2FudFwiKTtcclxuICAgICAgICBhbnQuc2NhbGUgPSAwO1xyXG4gICAgICAgIGFudC5vcGFjaXR5ID0gMDtcclxuICAgICAgICAgdmFyIGNhbGxfZnVuYzQgPSBjYy5jYWxsRnVuYyhmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIHMgPSBjYy5zY2FsZVRvKDAuMiwgMS4wKTtcclxuICAgICAgICAgICAgdmFyIGZpbiA9IGNjLmZhZGVJbigwLjEpO1xyXG4gICAgICAgICAgICB2YXIgbV91cCA9IGNjLm1vdmVCeSgwLjQsIDAsIDUpO1xyXG4gICAgICAgICAgICB2YXIgbV9kb3duID0gY2MubW92ZUJ5KDAuNCwgMCwgLTUpO1xyXG4gICAgICAgICAgICB2YXIgZiA9IGNjLnJlcGVhdEZvcmV2ZXIoY2Muc2VxdWVuY2UoW21fdXAsIG1fZG93bl0pKTtcclxuICAgICAgICAgICAgdmFyIHNlcTIgPSBjYy5zZXF1ZW5jZShbcywgZl0pO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgYW50LnJ1bkFjdGlvbihzKTtcclxuICAgICAgICAgICAgYW50LnJ1bkFjdGlvbihmaW4pO1xyXG4gICAgICAgICAgICBhbnQucnVuQWN0aW9uKGYpO1xyXG4gICAgICAgIH0uYmluZCh0aGlzKSwgdGhpcykqL1xuXG4gICAgICAgIHZhciBkZWxheSA9IGNjLmRlbGF5VGltZSgwLjQpO1xuICAgICAgICB2YXIgc2VxID0gY2Muc2VxdWVuY2UoW21vdmUxLCBtb3ZlMiwgbW92ZTMsIGNhbGxmdW5jLCBjYWxsX2Z1bmMyLCBkZWxheSwgY2FsbF9mdW5jMyAvKiwgZGVsYXkuY2xvbmUoKSwgY2FsbF9mdW5jNCovXSk7XG4gICAgICAgIGxvZ28ucnVuQWN0aW9uKHNlcSk7XG4gICAgICAgIC8vIGVuZFxuICAgIH0sXG5cbiAgICBvbl9nYW1lX3N0YXJ0X2NsaWNrOiBmdW5jdGlvbiBvbl9nYW1lX3N0YXJ0X2NsaWNrKCkge1xuICAgICAgICBjYy5hdWRpb0VuZ2luZS5zdG9wTXVzaWMoZmFsc2UpO1xuICAgICAgICB2YXIgdXJsID0gY2MudXJsLnJhdyhcInJlc291cmNlcy9zb3VuZHMvYnV0dG9uLm1wM1wiKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2codXJsKTtcbiAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheU11c2ljKHVybCwgZmFsc2UpO1xuXG4gICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcImdhbWVfc2NlbmVcIik7XG4gICAgfSxcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG4gICAgICAgIHZhciB3aW5fc2l6ZSA9IGNjLmRpcmVjdG9yLmdldFdpblNpemUoKTtcbiAgICAgICAgaWYgKHdpbl9zaXplLndpZHRoICE9IHRoaXMucHJldl9zaXplLndpZHRoIHx8IHdpbl9zaXplLmhlaWdodCAhPSB0aGlzLnByZXZfc2l6ZS5oZWlnaHQpIHtcbiAgICAgICAgICAgIHRoaXMucHJldl9zaXplID0gd2luX3NpemU7XG4gICAgICAgICAgICB0aGlzLmFkanVzdF93aW5kb3cod2luX3NpemUpO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyJdfQ==
