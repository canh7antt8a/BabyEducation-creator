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
        // this.sprite_com.spriteFrame = this.anim_sf_set[card_value].clone();
        var anim_set = this.game_scene_comp.get_anim_set();
        this.sprite_com.spriteFrame = anim_set[card_value].clone();
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
},{}],"frame_anim_second":[function(require,module,exports){
"use strict";
cc._RFpush(module, '479c6rGACZFBIyL9D6Z5QmM', 'frame_anim_second');
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
        random_time_scale: false,
        random_delay_to_play: false
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
        this.sp_comp.spriteFrame = this.frames_sp[0].clone();

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

        if (this.random_delay_to_play) {
            this.play_random_delay();
        }
    },

    play_random_delay: function play_random_delay() {
        if (!this.random_delay_to_play) {
            return;
        }

        this.play((function () {
            var time = 0.1 + Math.random() * 2;
            this.call_latter(this.play_random_delay.bind(this), time);
        }).bind(this));
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
                    if (this.anim_end_func) {
                        this.anim_end_func();
                    }
                } else {
                    this.now_index = index;
                    this.sp_comp.spriteFrame = this.frames_sp[index].clone();
                }
            }
        }
    }
});

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
        this.sp_comp.spriteFrame = this.frames_sp[0].clone();

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
        this.sp_comp.spriteFrame = this.frames_sp[0].clone();
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
                    if (this.anim_end_func) {
                        this.anim_end_func();
                    }
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

        anim_blocks_2x3: {
            "default": [],
            type: cc.Node
        },
        anim_blocks_3x3: {
            "default": [],
            type: cc.Node
        },
        anim_blocks_3x4: {
            "default": [],
            type: cc.Node
        },

        anim_blocks_4x4: {
            "default": [],
            type: cc.Node
        },

        anim_blocks_5x4: {
            "default": [],
            type: cc.Node
        },

        anim_ques_x: 0,
        anim_ques_y: 0,
        anim_start_scale: 0,
        anim_ques_d_x: -53,
        anim_ques_d_y: 300,
        question_move_time: 0.1,
        question_scale_time: 0.1,
        question_fadeout_time: 0.4,
        question_stay_time: 0.5
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.block_levels = [this.anim_blocks_2x3, this.anim_blocks_3x3, this.anim_blocks_3x4, this.anim_blocks_4x4, this.anim_blocks_5x4];
        this.game_level = 0;
        this.checkout_root = cc.find("UI_ROOT/checkout_root");
        this.ck_logo_root = cc.find("UI_ROOT/checkout_root/logo_root");
        this.ck_replay_button = cc.find("UI_ROOT/checkout_root/replay_button");
        this.ske_kim_com = cc.find("UI_ROOT/anchor-background/kim").getComponent(sp.Skeleton);
        this.lock_kim_click = true;

        var url = cc.url.raw("resources/game_scene/least.png");
        this.question_least = new cc.SpriteFrame(url);
        url = cc.url.raw("resources/game_scene/most.png");
        this.question_most = new cc.SpriteFrame(url);
        this.question_node = cc.find("UI_ROOT/anchor-background/question");
        this.question_node.active = false;

        this.anim_sf_set = [];

        url = cc.url.raw("resources/game_scene/animal_0.png");
        var sf = new cc.SpriteFrame(url);
        this.anim_sf_set.push(sf);

        url = cc.url.raw("resources/game_scene/animal_1.png");
        sf = new cc.SpriteFrame(url);
        this.anim_sf_set.push(sf);

        url = cc.url.raw("resources/game_scene/animal_2.png");
        sf = new cc.SpriteFrame(url);
        this.anim_sf_set.push(sf);

        url = cc.url.raw("resources/game_scene/animal_3.png");
        sf = new cc.SpriteFrame(url);
        this.anim_sf_set.push(sf);

        url = cc.url.raw("resources/game_scene/animal_4.png");
        sf = new cc.SpriteFrame(url);
        this.anim_sf_set.push(sf);

        url = cc.url.raw("resources/game_scene/animal_5.png");
        sf = new cc.SpriteFrame(url);
        this.anim_sf_set.push(sf);

        url = cc.url.raw("resources/game_scene/animal_6.png");
        sf = new cc.SpriteFrame(url);
        this.anim_sf_set.push(sf);

        url = cc.url.raw("resources/game_scene/animal_7.png");
        sf = new cc.SpriteFrame(url);
        this.anim_sf_set.push(sf);

        url = cc.url.raw("resources/game_scene/animal_8.png");
        sf = new cc.SpriteFrame(url);
        this.anim_sf_set.push(sf);
    },

    get_anim_set: function get_anim_set() {
        return this.anim_sf_set;
    },

    show_checkout: function show_checkout() {
        this.play_sound("resources/sounds/end.mp3");
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

    play_kim_anim_with_right: function play_kim_anim_with_right() {
        var index_set = [1, 2, 3, 4];
        index_set.sort(function () {
            return Math.random() - 0.5;
        });
        this.ske_kim_com.clearTracks();
        this.ske_kim_com.setAnimation(0, "ok_" + index_set[0], false);
        this.call_latter((function () {
            this.ske_kim_com.clearTracks();
            this.ske_kim_com.setAnimation(0, "idle_1", true);
        }).bind(this), 2);
        this.play_sound("resources/sounds/ch_right.mp3");
    },

    play_kim_anim_with_error: function play_kim_anim_with_error() {
        var index_set = [1, 2, 3, 4];
        index_set.sort(function () {
            return Math.random() - 0.5;
        });
        this.ske_kim_com.clearTracks();
        this.ske_kim_com.setAnimation(0, "err_" + index_set[0], false);
        this.call_latter((function () {
            this.ske_kim_com.clearTracks();
            this.ske_kim_com.setAnimation(0, "idle_1", true);
        }).bind(this), 1.5);
        this.play_sound("resources/sounds/ck_error.mp3");
    },

    start: function start() {
        this.game_start = false;
        this.locking_game = true;
        this.scheduleOnce(this.on_game_start.bind(this), 0);

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

    gen_anim_when_start: function gen_anim_when_start() {
        var time = 0.1;
        var delta = 0.3;
        if (this.game_level >= 2) {
            delta = 0.1;
        }

        for (var i = 0; i < this.flip_blocks.length; i++) {
            this.flip_blocks[i].scaleX = 0;
            this.flip_blocks[i].scaleY = 0;
            var delay = cc.delayTime(time);
            var s = cc.scaleTo(delta, 1.1);
            var s2 = cc.scaleTo(0.1, 1.0);
            var seq = cc.sequence([delay, s, s2]);
            this.flip_blocks[i].runAction(seq);
            time = time + delta;
        }
        return time;
    },

    gen_level0_map_data: function gen_level0_map_data() {
        var map = [3, 2, 1];
        var anim_type = [0, 1, 2, 3];
        anim_type.sort(function () {
            return Math.random() - 0.5;
        });

        this.min_anim_type = anim_type[2];
        this.max_anim_type = anim_type[0];

        var anim_array = [];
        for (var i = 0; i < map.length; i++) {
            for (var j = 0; j < map[i]; j++) {
                anim_array.push(anim_type[i]);
            }
        }

        anim_array.sort(function () {
            return Math.random() - 0.5;
        });

        console.log(anim_array);
        this.game_ret = this.min_anim_type;
        if (Math.random() >= 0.5) {
            this.game_ret = this.max_anim_type;
        }
        return anim_array;
    },

    gen_level1_map_data: function gen_level1_map_data() {
        var map0 = [5, 3, 1];
        var map1 = [6, 2, 1];
        var map2 = [4, 3, 2];

        var map_set = [map0, map1, map2];
        map_set.sort(function () {
            return Math.random() - 0.5;
        });

        var anim_type = [0, 1, 2, 3];
        anim_type.sort(function () {
            return Math.random() - 0.5;
        });

        var map;
        map = map_set[0];

        this.min_anim_type = anim_type[2];
        this.max_anim_type = anim_type[0];

        var anim_array = [];
        for (var i = 0; i < map.length; i++) {
            for (var j = 0; j < map[i]; j++) {
                anim_array.push(anim_type[i]);
            }
        }

        anim_array.sort(function () {
            return Math.random() - 0.5;
        });

        console.log(anim_array);
        this.game_ret = this.min_anim_type;
        if (Math.random() >= 0.5) {
            this.game_ret = this.max_anim_type;
        }
        return anim_array;
    },

    gen_level2_map_data: function gen_level2_map_data() {
        var map0 = [6, 3, 2, 1];
        var map1 = [5, 4, 2, 1];
        var map2 = [4, 3, 3, 2];
        var map3 = [7, 2, 2, 1];
        var map4 = [5, 3, 3, 1];

        var map_set = [map0, map1, map2, map3, map4];
        map_set.sort(function () {
            return Math.random() - 0.5;
        });

        var anim_type = [0, 1, 2, 3];
        anim_type.sort(function () {
            return Math.random() - 0.5;
        });

        var map;
        map = map_set[0];

        this.min_anim_type = anim_type[3];
        this.max_anim_type = anim_type[0];

        var anim_array = [];
        for (var i = 0; i < map.length; i++) {
            for (var j = 0; j < map[i]; j++) {
                anim_array.push(anim_type[i]);
            }
        }

        anim_array.sort(function () {
            return Math.random() - 0.5;
        });

        console.log(anim_array);
        this.game_ret = this.min_anim_type;
        if (Math.random() >= 0.5) {
            this.game_ret = this.max_anim_type;
        }
        return anim_array;
    },

    // 4x4
    gen_level3_map_data: function gen_level3_map_data() {
        var map0 = [5, 4, 4, 3];
        var map1 = [6, 5, 4, 1];
        var map2 = [6, 4, 4, 2];
        var map3 = [6, 5, 3, 2];
        var map4 = [7, 4, 3, 2];
        var map5 = [7, 4, 4, 1];
        var map6 = [7, 5, 3, 1];
        var map7 = [7, 6, 2, 1];
        var map8 = [8, 3, 3, 2];
        var map9 = [8, 4, 3, 1];
        var map10 = [8, 5, 2, 1];
        var map11 = [9, 4, 2, 1];
        var map12 = [9, 3, 3, 1];

        var map_set = [map0, map1, map2, map3, map4, map5, map6, map7, map8, map9, map10, map11, map12];
        map_set.sort(function () {
            return Math.random() - 0.5;
        });

        var anim_type = [0, 1, 2, 3];
        anim_type.sort(function () {
            return Math.random() - 0.5;
        });

        var map;
        map = map_set[0];

        this.min_anim_type = anim_type[3];
        this.max_anim_type = anim_type[0];

        var anim_array = [];
        for (var i = 0; i < map.length; i++) {
            for (var j = 0; j < map[i]; j++) {
                anim_array.push(anim_type[i]);
            }
        }

        anim_array.sort(function () {
            return Math.random() - 0.5;
        });

        console.log(anim_array);
        this.game_ret = this.min_anim_type;
        if (Math.random() >= 0.5) {
            this.game_ret = this.max_anim_type;
        }
        return anim_array;
    },

    // 5x4
    gen_level4_map_data: function gen_level4_map_data() {
        var map_data_item;
        var map_set = [];
        map_data_item = [6, 5, 5, 4];
        map_set.push(map_data_item);
        map_data_item = [7, 5, 5, 3];
        map_set.push(map_data_item);
        map_data_item = [7, 6, 4, 3];
        map_set.push(map_data_item);
        map_data_item = [7, 6, 5, 2];
        map_set.push(map_data_item);
        map_data_item = [7, 6, 6, 1];
        map_set.push(map_data_item);
        map_data_item = [8, 7, 4, 1];
        map_set.push(map_data_item);
        map_data_item = [8, 6, 5, 1];
        map_set.push(map_data_item);
        map_data_item = [8, 6, 4, 2];
        map_set.push(map_data_item);
        map_data_item = [8, 7, 3, 2];
        map_set.push(map_data_item);
        map_data_item = [8, 5, 5, 2];
        map_set.push(map_data_item);
        map_data_item = [8, 5, 4, 3];
        map_set.push(map_data_item);
        map_data_item = [9, 8, 2, 1];
        map_set.push(map_data_item);
        map_data_item = [9, 7, 3, 1];
        map_set.push(map_data_item);
        map_data_item = [9, 6, 4, 1];
        map_set.push(map_data_item);
        map_data_item = [9, 5, 5, 1];
        map_set.push(map_data_item);

        map_data_item = [9, 6, 3, 2];
        map_set.push(map_data_item);
        map_data_item = [9, 5, 4, 2];
        map_set.push(map_data_item);
        map_data_item = [9, 4, 4, 3];
        map_set.push(map_data_item);

        map_data_item = [10, 5, 3, 2];
        map_set.push(map_data_item);
        map_data_item = [10, 4, 4, 2];
        map_set.push(map_data_item);
        map_data_item = [10, 5, 4, 1];
        map_set.push(map_data_item);
        map_data_item = [10, 6, 3, 1];
        map_set.push(map_data_item);
        map_data_item = [10, 7, 2, 1];
        map_set.push(map_data_item);
        map_data_item = [11, 6, 2, 1];
        map_set.push(map_data_item);
        map_data_item = [11, 4, 4, 1];
        map_set.push(map_data_item);
        map_data_item = [11, 5, 3, 1];
        map_set.push(map_data_item);
        map_data_item = [11, 4, 3, 2];
        map_set.push(map_data_item);
        map_data_item = [12, 4, 3, 1];
        map_set.push(map_data_item);
        map_data_item = [12, 5, 2, 1];
        map_set.push(map_data_item);
        map_data_item = [13, 4, 2, 1];
        map_set.push(map_data_item);
        map_data_item = [13, 3, 3, 1];
        map_set.push(map_data_item);
        map_data_item = [14, 3, 2, 1];
        map_set.push(map_data_item);
        map_data_item = [15, 2, 2, 1];
        map_set.push(map_data_item);

        map_set.sort(function () {
            return Math.random() - 0.5;
        });

        var anim_type = [0, 1, 2, 3];
        anim_type.sort(function () {
            return Math.random() - 0.5;
        });

        var map;
        map = map_set[0];

        this.min_anim_type = anim_type[3];
        this.max_anim_type = anim_type[0];

        var anim_array = [];
        for (var i = 0; i < map.length; i++) {
            for (var j = 0; j < map[i]; j++) {
                anim_array.push(anim_type[i]);
            }
        }

        anim_array.sort(function () {
            return Math.random() - 0.5;
        });

        console.log(anim_array);
        this.game_ret = this.min_anim_type;
        if (Math.random() >= 0.5) {
            this.game_ret = this.max_anim_type;
        }
        return anim_array;
    },

    gen_game_data: function gen_game_data(anim_data) {
        var flip_block_comp;

        for (var i = 0; i < anim_data.length; i++) {
            flip_block_comp = this.flip_blocks[i].getComponent("flip_block");
            flip_block_comp.flip_to_back_with_value(anim_data[i]);
        }
    },

    on_game_start: function on_game_start() {
        if (this.game_level >= this.level_root.length) {
            return;
        }

        this.checkout_root.active = false;

        this.question_node.stopAllActions();
        this.question_node.active = false;

        this.game_start = true;

        for (var index = 0; index < this.level_root.length; index++) {
            this.level_root[index].active = false;
        }
        this.level_root[this.game_level].active = true;
        this.flip_blocks = this.block_levels[this.game_level];

        var map;
        var anim_array;

        this.anim_sf_set.sort(function () {
            return Math.random() - 0.5;
        });

        if (this.game_level === 0) {
            anim_array = this.gen_level0_map_data();
        } else if (this.game_level === 1) {
            anim_array = this.gen_level1_map_data();
        } else if (this.game_level === 2) {
            anim_array = this.gen_level2_map_data();
        } else if (this.game_level === 3) {
            anim_array = this.gen_level3_map_data();
        } else if (this.game_level === 4) {
            // anim_array = this.gen_level4_map_data();
            anim_array = this.gen_level3_map_data();
            this.level_root[3].active = true;
            this.flip_blocks = this.block_levels[3];

            this.level_root[this.game_level].active = false;
        }
        this.gen_game_data(anim_array);
        var time = this.gen_anim_when_start();
        this.call_latter((function () {
            this.play_question_action();
        }).bind(this), time + 0.1);
    },

    play_question_action: function play_question_action() {
        this.locking_game = false;
        this.question_node.active = true;

        this.question_node.x = this.anim_ques_x;
        this.question_node.y = this.anim_ques_y;
        this.question_node.opacity = 255;
        this.question_node.scale = this.anim_start_scale;

        var sprite_com = this.question_node.getComponent(cc.Sprite);
        if (this.game_ret == this.min_anim_type) {
            sprite_com.spriteFrame = this.question_least.clone();
            this.play_sound("resources/sounds/least.mp3");
        } else {
            sprite_com.spriteFrame = this.question_most.clone();
            this.play_sound("resources/sounds/most.mp3");
        }
        var move = cc.moveTo(this.question_move_time, this.anim_ques_d_x, this.anim_ques_d_y);
        var scale = cc.scaleTo(this.question_scale_time, 1);

        var seq = cc.sequence([move, scale]);
        this.question_node.runAction(seq);
    },

    on_question_click: function on_question_click() {
        var fout = cc.fadeOut(this.question_fadeout_time);
        var callfunc = cc.callFunc((function () {
            this.question_node.active = false;
        }).bind(this), this);
        var seq = cc.sequence([fout, callfunc]);
        this.question_node.runAction(seq);
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

    play_choose_succes_anim: function play_choose_succes_anim(card_value) {
        var s_max = cc.scaleTo(0.4, 1.2);
        var s_bk = cc.scaleTo(0.2, 1);
        var seq = cc.sequence([s_max, s_bk]);
        for (var index = 0; index < this.flip_blocks.length; index++) {
            var block_comp = this.flip_blocks[index].getComponent("flip_block");
            if (block_comp.card_value == card_value) {
                this.flip_blocks[index].runAction(seq.clone());
            }
        }
    },

    play_choose_error_anim: function play_choose_error_anim(block) {
        var r1 = cc.rotateTo(0.1, -10);
        var r2 = cc.rotateTo(0.2, 10);
        var r3 = cc.rotateTo(0.2, -8);
        var r4 = cc.rotateTo(0.2, 8);
        var r5 = cc.rotateTo(0.2, -4);
        var r6 = cc.rotateTo(0.2, 4);
        var r7 = cc.rotateTo(0.1, 0);

        var seq = cc.sequence([r1, r2, r3, r4, r5, r6, r7]);
        block.node.runAction(seq);
    },

    on_card_flip: function on_card_flip(block, card_value) {
        console.log(this.game_start + this.locking_game);
        if (this.game_start === false || this.locking_game === true) {
            return;
        }

        console.log("card_flip =" + card_value);
        this.locking_game = true;
        if (this.game_ret == card_value) {
            // 进入下一关
            this.play_kim_anim_with_right();
            this.play_choose_succes_anim(card_value);
            this.call_latter((function () {
                this.game_level++;
                if (this.game_level >= 5) {
                    // 游戏结束
                    this.game_level = 0;
                    this.show_checkout();
                } else {
                    this.on_game_start();
                }
            }).bind(this), 2);
        } else {
            this.play_kim_anim_with_error();
            this.play_choose_error_anim(block);
            this.call_latter((function () {
                this.on_game_start();
            }).bind(this), 2);
        }
    },

    on_goto_home: function on_goto_home() {
        cc.audioEngine.stopMusic(false);
        var url = cc.url.raw("resources/sounds/button.mp3");
        cc.audioEngine.playMusic(url, false);
        cc.director.loadScene("start_scene");
    },
    // called every frame, uncomment this function to activate update callback
    /*update: function (dt) {
        var win_size = cc.director.getWinSize();
        if(win_size.width != this.prev_size.width || win_size.height != this.prev_size.height) {
            this.prev_size = win_size;
            this.adjust_window(win_size);
        }
    },*/

    on_kim_click: function on_kim_click() {
        if (this.lock_kim_click === true) {
            return;
        }
        this.play_kim_click_anim_with_random();
    }
});

cc._RFpop();
},{}],"loop_move_action":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'a3c8aBnNTdOQIj71BUVN4q1', 'loop_move_action');
// scripts\loop_move_action.js

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
        move_time: 0.4,
        move_dx: 0,
        move_dy: 0,
        start_time: 0
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
        var m1 = cc.moveBy(this.move_time, this.move_dx, this.move_dy);
        var m2 = cc.moveBy(this.move_time, -this.move_dx, -this.move_dy);
        var seq = cc.sequence([m1, m2]);
        var repeat = cc.repeatForever(seq);
        this.node.runAction(repeat);
    }
});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"move_action":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'f2ba3m0jZtGH4G8nqfG9pGp', 'move_action');
// scripts\move_action.js

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
        play_onload: true,
        play_onload_delay: 0,
        start_active: false,
        move_duration: 0,
        move_time: 0.2,
        is_hor: false,
        is_jump: true
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.node.active = this.start_active;
        if (this.play_onload === true) {
            if (this.play_onload_delay <= 0) {
                this.play();
            } else {
                this.scheduleOnce((function () {
                    this.play();
                }).bind(this), this.play_onload_delay);
            }
        }
    },

    play: function play() {
        this.node.stopAllActions();

        this.node.active = true;
        var dx = 0;
        var dy = 0;

        var jump_x = 0;
        var jump_y = 0;

        if (this.is_hor) {
            dx = this.move_duration;
            if (this.is_jump) {
                if (this.move_duration > 0) {
                    // 右
                    jump_x = -10;
                } else {
                    // 左
                    jump_x = 10;
                }
            }
        } else {
            dy = this.move_duration;
            if (this.is_jump) {
                if (this.move_duration > 0) {
                    // 上
                    jump_y = -10;
                } else {
                    // 下
                    jump_y = 10;
                }
            }
        }

        if (this.is_jump) {
            var move1 = cc.moveBy(this.move_time, dx - jump_x, dy - jump_y);
            var move2 = cc.moveBy(0.2, jump_x * 2, jump_y * 2);
            var move3 = cc.moveBy(0.1, -jump_x, -jump_y);
            var seq = cc.sequence([move1, move2, move3]);
            this.node.runAction(seq);
        } else {
            var move1 = cc.moveBy(this.move_time, dx, dy);
            this.node.runAction(move1);
        }
    },

    move_back: function move_back() {
        this.node.active = true;
        this.node.stopAllActions();
        var dx = 0;
        var dy = 0;

        var jump_x = 0;
        var jump_y = 0;

        if (this.is_hor) {
            dx = this.move_duration;
            if (this.is_jump) {
                if (this.move_duration > 0) {
                    // 右
                    jump_x = -10;
                } else {
                    // 左
                    jump_x = 10;
                }
            }
        } else {
            dy = this.move_duration;
            if (this.is_jump) {
                if (this.move_duration > 0) {
                    // 上
                    jump_y = -10;
                } else {
                    // 下
                    jump_y = 10;
                }
            }
        }

        if (this.is_jump) {
            var move1 = cc.moveBy(this.move_time, -dx + jump_x, -dy + jump_y);
            var move2 = cc.moveBy(0.2, -jump_x * 2, -jump_y * 2);
            var move3 = cc.moveBy(0.1, jump_x, jump_y);
            var seq = cc.sequence([move1, move2, move3]);
            this.node.runAction(seq);
        } else {
            var move1 = cc.moveBy(this.move_time, -dx, -dy);
            this.node.runAction(move1);
        }
    }
});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"pat_action":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'b1a7dNNNY9OGbGbCRKozxW0', 'pat_action');
// scripts\pat_action.js

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
        play_onload: true,
        start_scale: 3.5,
        play_onload_delay: 0,
        start_active: false
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.node.active = true;
        if (this.start_active === false) {
            this.node.active = true;
            this.node.opacity = 0;
        }
        if (this.play_onload === true) {
            if (this.play_onload_delay <= 0) {
                this.play();
            } else {
                this.scheduleOnce((function () {
                    this.play();
                }).bind(this), this.play_onload_delay);
            }
        }
    },

    play: function play() {
        this.node.active = true;
        this.node.scale = this.start_scale;
        this.node.opacity = 0;
        var scale1 = cc.scaleTo(0.3, 0.8);
        var scale2 = cc.scaleTo(0.2, 1.2);
        var scale3 = cc.scaleTo(0.1, 1.0);
        var seq = cc.sequence([scale1, scale2, scale3]);
        this.node.runAction(seq);
        var fin = cc.fadeIn(0.5);
        this.node.runAction(fin);
    },

    move_back: function move_back() {
        this.node.active = true;
        // this.node.scale = this.start_scale;
        // this.node.opacity = 0;
        var s2 = cc.scaleTo(0.2, 0.8);
        var s3 = cc.scaleTo(0.3, this.start_scale);
        var seq = cc.sequence([s2, s3]);
        this.node.runAction(seq);
        var fout = cc.fadeOut(0.5);
        this.node.runAction(fout);
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
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

    // use this for initialization
    onLoad: function onLoad() {

        var url = cc.url.raw("resources/sounds/least.mp3");
        cc.loader.loadRes(url, function () {});
        url = cc.url.raw("resources/sounds/most.mp3");
        cc.loader.loadRes(url, function () {});

        url = cc.url.raw("resources/sounds/button.mp3");
        cc.loader.loadRes(url, function () {});
        url = cc.url.raw("resources/sounds/end.mp3");
        cc.loader.loadRes(url, function () {});

        url = cc.url.raw("resources/sounds/ch_right.mp3");
        cc.loader.loadRes(url, function () {});

        url = cc.url.raw("resources/sounds/ck_error.mp3");
        cc.loader.loadRes(url, function () {});

        this.scheduleOnce((function () {
            var cat_com = cc.find("UI_ROOT/anchor-center/cat").getComponent(sp.Skeleton);
            cat_com.clearTracks();
            cat_com.setAnimation(0, "idle_2", true);
        }).bind(this), 0.8);
        this.started = false;
    },

    on_game_start_click: function on_game_start_click() {
        if (this.started === true) {
            return;
        }

        this.started = true;
        cc.audioEngine.stopMusic(false);
        var url = cc.url.raw("resources/sounds/button.mp3");
        // console.log(url);
        cc.audioEngine.playMusic(url, false);

        var move_com = cc.find("UI_ROOT/anchor-center/logo").getComponent("move_action");
        var pat_com = cc.find("UI_ROOT/anchor-center/click_node").getComponent("pat_action");

        move_com.move_back();
        pat_com.move_back();

        this.scheduleOnce(function () {
            cc.director.loadScene("game_scene");
        }, 0.6);
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
},{}]},{},["game_scene","frame_anim_second","start_scene","flip_block","frame_anim","loop_move_action","pat_action","move_action"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkY6L3NvZnR3YXJlcy9Db2Nvc0NyZWF0b3JfMV8wXzEvcmVzb3VyY2VzL2FwcC5hc2FyL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvc2NyaXB0cy9mbGlwX2Jsb2NrLmpzIiwiYXNzZXRzL3NjcmlwdHMvZnJhbWVfYW5pbV9zZWNvbmQuanMiLCJhc3NldHMvc2NyaXB0cy9mcmFtZV9hbmltLmpzIiwiYXNzZXRzL3NjcmlwdHMvZ2FtZV9zY2VuZS5qcyIsImFzc2V0cy9zY3JpcHRzL2xvb3BfbW92ZV9hY3Rpb24uanMiLCJhc3NldHMvc2NyaXB0cy9tb3ZlX2FjdGlvbi5qcyIsImFzc2V0cy9zY3JpcHRzL3BhdF9hY3Rpb24uanMiLCJhc3NldHMvc2NyaXB0cy9zdGFydF9zY2VuZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnOGJlYjNWRDNrRk5WS0dFaHlKQytjOVInLCAnZmxpcF9ibG9jaycpO1xuLy8gc2NyaXB0c1xcZmxpcF9ibG9jay5qc1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIGluZGV4OiAwXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLnNwcml0ZV9jb20gPSB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KGNjLlNwcml0ZSk7XG5cbiAgICAgICAgdGhpcy5mbGlwZWQgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLmdhbWVfc2NlbmVfY29tcCA9IGNjLmZpbmQoXCJVSV9ST09UXCIpLmdldENvbXBvbmVudChcImdhbWVfc2NlbmVcIik7XG5cbiAgICAgICAgdGhpcy5ub2RlLm9uKCd0b3VjaHN0YXJ0JywgKGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdmFyIGJvdW5kX2JveCA9IHRoaXMubm9kZS5nZXRCb3VuZGluZ0JveCgpO1xuICAgICAgICAgICAgdmFyIHBvcyA9IHRoaXMubm9kZS5nZXRQYXJlbnQoKS5jb252ZXJ0VG91Y2hUb05vZGVTcGFjZShldmVudCk7XG4gICAgICAgICAgICBpZiAodGhpcy5mbGlwZWQgPT09IGZhbHNlICYmIGJvdW5kX2JveC5jb250YWlucyhwb3MpKSB7XG4gICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lX3NjZW5lX2NvbXAub25fY2FyZF9mbGlwKHRoaXMsIHRoaXMuY2FyZF92YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLmJpbmQodGhpcykpO1xuICAgIH0sXG5cbiAgICBmbGlwX3RvX2JhY2s6IGZ1bmN0aW9uIGZsaXBfdG9fYmFjaygpIHtcbiAgICAgICAgdmFyIHMgPSBjYy5zY2FsZVRvKDAuMSwgMCwgMSk7XG4gICAgICAgIHZhciBjYWxsYmFjayA9IGNjLmNhbGxGdW5jKChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnNwcml0ZV9jb20uc3ByaXRlRnJhbWUgPSB0aGlzLmJrX3NmLmNsb25lKCk7XG4gICAgICAgIH0pLmJpbmQodGhpcyksIHRoaXMpO1xuICAgICAgICB2YXIgczIgPSBjYy5zY2FsZVRvKDAuMSwgMSwgMSk7XG4gICAgICAgIHZhciBjYWxsYmFjazIgPSBjYy5jYWxsRnVuYygoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5mbGlwZWQgPSBmYWxzZTtcbiAgICAgICAgfSkuYmluZCh0aGlzKSwgdGhpcyk7XG5cbiAgICAgICAgdmFyIHNlcSA9IGNjLnNlcXVlbmNlKFtzLCBjYWxsYmFjaywgczIsIGNhbGxiYWNrMl0pO1xuICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKHNlcSk7XG4gICAgfSxcblxuICAgIGZsaXBfdG9fYmFja193aXRoX3ZhbHVlOiBmdW5jdGlvbiBmbGlwX3RvX2JhY2tfd2l0aF92YWx1ZShjYXJkX3ZhbHVlKSB7XG4gICAgICAgIHRoaXMuY2FyZF92YWx1ZSA9IGNhcmRfdmFsdWU7XG4gICAgICAgIC8vIHRoaXMuc3ByaXRlX2NvbS5zcHJpdGVGcmFtZSA9IHRoaXMuYW5pbV9zZl9zZXRbY2FyZF92YWx1ZV0uY2xvbmUoKTtcbiAgICAgICAgdmFyIGFuaW1fc2V0ID0gdGhpcy5nYW1lX3NjZW5lX2NvbXAuZ2V0X2FuaW1fc2V0KCk7XG4gICAgICAgIHRoaXMuc3ByaXRlX2NvbS5zcHJpdGVGcmFtZSA9IGFuaW1fc2V0W2NhcmRfdmFsdWVdLmNsb25lKCk7XG4gICAgICAgIHRoaXMuZmxpcGVkID0gZmFsc2U7XG4gICAgfSxcblxuICAgIGZsaXBfdG9fdmFsdWU6IGZ1bmN0aW9uIGZsaXBfdG9fdmFsdWUoKSB7XG4gICAgICAgIHZhciBzID0gY2Muc2NhbGVUbygwLjEsIDAsIDEpO1xuXG4gICAgICAgIHZhciBjYWxsYmFjayA9IGNjLmNhbGxGdW5jKChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgdXJsID0gY2MudXJsLnJhdyhcInJlc291cmNlcy9nYW1lX3NjZW5lL2NhcmRfXCIgKyB0aGlzLmNhcmRfdmFsdWUgKyBcIi5wbmdcIik7XG4gICAgICAgICAgICB2YXIgc2YgPSBuZXcgY2MuU3ByaXRlRnJhbWUodXJsKTtcbiAgICAgICAgICAgIHRoaXMuc3ByaXRlX2NvbS5zcHJpdGVGcmFtZSA9IHNmO1xuICAgICAgICB9KS5iaW5kKHRoaXMpLCB0aGlzKTtcblxuICAgICAgICB2YXIgczIgPSBjYy5zY2FsZVRvKDAuMSwgMSwgMSk7XG5cbiAgICAgICAgdmFyIGNhbGxiYWNrMiA9IGNjLmNhbGxGdW5jKChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmZsaXBlZCA9IHRydWU7XG4gICAgICAgIH0pLmJpbmQodGhpcyksIHRoaXMpO1xuXG4gICAgICAgIHZhciBzZXEgPSBjYy5zZXF1ZW5jZShbcywgY2FsbGJhY2ssIHMyLCBjYWxsYmFjazJdKTtcbiAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihzZXEpO1xuICAgIH0sXG5cbiAgICBnZXRfY2FyZF92YWx1ZTogZnVuY3Rpb24gZ2V0X2NhcmRfdmFsdWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhcmRfdmFsdWU7XG4gICAgfSxcblxuICAgIGdldF9zZWF0OiBmdW5jdGlvbiBnZXRfc2VhdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5kZXg7XG4gICAgfVxufSk7XG4vLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuLy8gfSxcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzQ3OWM2ckdBQ1pGQkl5TDlENlo1UW1NJywgJ2ZyYW1lX2FuaW1fc2Vjb25kJyk7XG4vLyBzY3JpcHRzXFxmcmFtZV9hbmltX3NlY29uZC5qc1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG5cbiAgICAgICAgZnJhbWVfc3ByaXRlOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogW10sXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVGcmFtZVxuICAgICAgICB9LFxuICAgICAgICBmcmFtZV9kdXJhdGlvbjogMCxcbiAgICAgICAgbG9vcDogZmFsc2UsXG4gICAgICAgIHBsYXlfb25fbG9hZDogZmFsc2UsXG4gICAgICAgIHBsYXlfb25fbG9hZF93aXRoX3JhbmRvbV90aW1lOiBmYWxzZSxcbiAgICAgICAgcmFuZG9tX3RpbWVfc2NhbGU6IGZhbHNlLFxuICAgICAgICByYW5kb21fZGVsYXlfdG9fcGxheTogZmFsc2VcbiAgICB9LFxuXG4gICAgY2FsbF9sYXR0ZXI6IGZ1bmN0aW9uIGNhbGxfbGF0dGVyKGNhbGxmdW5jLCBkZWxheSkge1xuICAgICAgICB2YXIgZGVsYXlfYWN0aW9uID0gY2MuZGVsYXlUaW1lKGRlbGF5KTtcbiAgICAgICAgdmFyIGNhbGxfYWN0aW9uID0gY2MuY2FsbEZ1bmMoY2FsbGZ1bmMsIHRoaXMpO1xuICAgICAgICB2YXIgc2VxID0gY2Muc2VxdWVuY2UoW2RlbGF5X2FjdGlvbiwgY2FsbF9hY3Rpb25dKTtcbiAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihzZXEpO1xuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5mcmFtZXNfc3AgPSB0aGlzLmZyYW1lX3Nwcml0ZTtcbiAgICAgICAgdGhpcy5mcmFtZV9jb3VudCA9IHRoaXMuZnJhbWVfc3ByaXRlLmxlbmd0aDtcblxuICAgICAgICAvKlxyXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmZyYW1lX2NvdW50OyBpICsrKSB7XHJcbiAgICAgICAgICAgIHZhciB1cmwgPSBjYy51cmwucmF3KHRoaXMubmFtZV9wcmVmaXggKyAodGhpcy5uYW1lX2JlZ2luX2luZGV4ICsgaSkgKyBcIi5wbmdcIik7XHJcbiAgICAgICAgICAgIHZhciBzcCA9IG5ldyBjYy5TcHJpdGVGcmFtZSh1cmwpO1xyXG4gICAgICAgICAgICB0aGlzLmZyYW1lc19zcC5wdXNoKHNwKTtcclxuICAgICAgICB9Ki9cblxuICAgICAgICB0aGlzLnNwX2NvbXAgPSB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KGNjLlNwcml0ZSk7XG4gICAgICAgIGlmICghdGhpcy5zcF9jb21wKSB7XG4gICAgICAgICAgICB0aGlzLnNwX2NvbXAgPSB0aGlzLm5vZGUuYWRkQ29tcG9uZW50KGNjLlNwcml0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zcF9jb21wLnNwcml0ZUZyYW1lID0gdGhpcy5mcmFtZXNfc3BbMF0uY2xvbmUoKTtcblxuICAgICAgICB0aGlzLm5vd19pbmRleCA9IDA7XG4gICAgICAgIHRoaXMucGFzc190aW1lID0gMDtcbiAgICAgICAgdGhpcy5hbmltX2VuZGVkID0gdHJ1ZTtcbiAgICAgICAgaWYgKHRoaXMucGxheV9vbl9sb2FkKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wbGF5X29uX2xvYWRfd2l0aF9yYW5kb21fdGltZSkge1xuICAgICAgICAgICAgICAgIHZhciB0aW1lID0gMC4wMSArIE1hdGgucmFuZG9tKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jYWxsX2xhdHRlcigoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFuaW1fZW5kZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9KS5iaW5kKHRoaXMpLCB0aW1lKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hbmltX2VuZGVkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5yYW5kb21fdGltZV9zY2FsZSkge1xuICAgICAgICAgICAgdmFyIHRfcyA9IDEuMCArIDAuNSAqIE1hdGgucmFuZG9tKCk7XG4gICAgICAgICAgICB0aGlzLmZyYW1lX2R1cmF0aW9uICo9IHRfcztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFuaW1fZW5kX2Z1bmMgPSBudWxsO1xuXG4gICAgICAgIGlmICh0aGlzLnJhbmRvbV9kZWxheV90b19wbGF5KSB7XG4gICAgICAgICAgICB0aGlzLnBsYXlfcmFuZG9tX2RlbGF5KCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcGxheV9yYW5kb21fZGVsYXk6IGZ1bmN0aW9uIHBsYXlfcmFuZG9tX2RlbGF5KCkge1xuICAgICAgICBpZiAoIXRoaXMucmFuZG9tX2RlbGF5X3RvX3BsYXkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucGxheSgoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHRpbWUgPSAwLjEgKyBNYXRoLnJhbmRvbSgpICogMjtcbiAgICAgICAgICAgIHRoaXMuY2FsbF9sYXR0ZXIodGhpcy5wbGF5X3JhbmRvbV9kZWxheS5iaW5kKHRoaXMpLCB0aW1lKTtcbiAgICAgICAgfSkuYmluZCh0aGlzKSk7XG4gICAgfSxcblxuICAgIHN0YXJ0OiBmdW5jdGlvbiBzdGFydCgpIHtcbiAgICAgICAgdGhpcy5wYXNzX3RpbWUgPSAwO1xuICAgIH0sXG5cbiAgICBwbGF5OiBmdW5jdGlvbiBwbGF5KGZ1bmMpIHtcbiAgICAgICAgdGhpcy5wYXNzX3RpbWUgPSAwO1xuICAgICAgICB0aGlzLmFuaW1fZW5kZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5hbmltX2VuZF9mdW5jID0gZnVuYztcbiAgICAgICAgdGhpcy5sb29wID0gZmFsc2U7XG4gICAgfSxcblxuICAgIHBsYXlfbG9vcDogZnVuY3Rpb24gcGxheV9sb29wKCkge1xuICAgICAgICB0aGlzLmxvb3AgPSB0cnVlO1xuICAgICAgICB0aGlzLnBhc3NfdGltZSA9IDA7XG4gICAgICAgIHRoaXMuYW5pbV9lbmRlZCA9IGZhbHNlO1xuICAgIH0sXG5cbiAgICBzdG9wX2FuaW06IGZ1bmN0aW9uIHN0b3BfYW5pbSgpIHtcbiAgICAgICAgdGhpcy5hbmltX2VuZGVkID0gdHJ1ZTtcbiAgICB9LFxuXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICBpZiAodGhpcy5hbmltX2VuZGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wYXNzX3RpbWUgKz0gZHQ7XG4gICAgICAgIHZhciBpbmRleCA9IE1hdGguZmxvb3IodGhpcy5wYXNzX3RpbWUgLyB0aGlzLmZyYW1lX2R1cmF0aW9uKTtcblxuICAgICAgICBpZiAodGhpcy5sb29wKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5ub3dfaW5kZXggIT0gaW5kZXgpIHtcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPj0gdGhpcy5mcmFtZV9jb3VudCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhc3NfdGltZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3BfY29tcC5zcHJpdGVGcmFtZSA9IHRoaXMuZnJhbWVzX3NwWzBdLmNsb25lKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm93X2luZGV4ID0gMDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNwX2NvbXAuc3ByaXRlRnJhbWUgPSB0aGlzLmZyYW1lc19zcFtpbmRleF0uY2xvbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub3dfaW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5ub3dfaW5kZXggIT0gaW5kZXgpIHtcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPj0gdGhpcy5mcmFtZV9jb3VudCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFuaW1fZW5kZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5hbmltX2VuZF9mdW5jKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFuaW1fZW5kX2Z1bmMoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm93X2luZGV4ID0gaW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3BfY29tcC5zcHJpdGVGcmFtZSA9IHRoaXMuZnJhbWVzX3NwW2luZGV4XS5jbG9uZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnOWJkMWFHb2VGVkEwSXlLSEE3YkdHdFQnLCAnZnJhbWVfYW5pbScpO1xuLy8gc2NyaXB0c1xcZnJhbWVfYW5pbS5qc1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG5cbiAgICAgICAgbmFtZV9wcmVmaXg6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBcIm5hbWVfcGF0aF9wcmVmaXhcIixcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZ1xuICAgICAgICB9LFxuICAgICAgICBuYW1lX2JlZ2luX2luZGV4OiAwLFxuICAgICAgICBmcmFtZV9jb3VudDogMCxcbiAgICAgICAgZnJhbWVfZHVyYXRpb246IDAsXG4gICAgICAgIGxvb3A6IGZhbHNlLFxuICAgICAgICBwbGF5X29uX2xvYWQ6IGZhbHNlXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLmZyYW1lc19zcCA9IFtdO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5mcmFtZV9jb3VudDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgdXJsID0gY2MudXJsLnJhdyh0aGlzLm5hbWVfcHJlZml4ICsgKHRoaXMubmFtZV9iZWdpbl9pbmRleCArIGkpICsgXCIucG5nXCIpO1xuICAgICAgICAgICAgdmFyIHNwID0gbmV3IGNjLlNwcml0ZUZyYW1lKHVybCk7XG4gICAgICAgICAgICB0aGlzLmZyYW1lc19zcC5wdXNoKHNwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3BfY29tcCA9IHRoaXMubm9kZS5nZXRDb21wb25lbnQoY2MuU3ByaXRlKTtcbiAgICAgICAgaWYgKCF0aGlzLnNwX2NvbXApIHtcbiAgICAgICAgICAgIHRoaXMuc3BfY29tcCA9IHRoaXMubm9kZS5hZGRDb21wb25lbnQoY2MuU3ByaXRlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNwX2NvbXAuc3ByaXRlRnJhbWUgPSB0aGlzLmZyYW1lc19zcFswXS5jbG9uZSgpO1xuXG4gICAgICAgIHRoaXMubm93X2luZGV4ID0gMDtcbiAgICAgICAgdGhpcy5wYXNzX3RpbWUgPSAwO1xuICAgICAgICB0aGlzLmFuaW1fZW5kZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5hbmltX2VuZGVkID0gIXRoaXMucGxheV9vbl9sb2FkO1xuXG4gICAgICAgIHRoaXMuYW5pbV9lbmRfZnVuYyA9IG51bGw7XG4gICAgfSxcblxuICAgIHN0YXJ0OiBmdW5jdGlvbiBzdGFydCgpIHtcbiAgICAgICAgdGhpcy5wYXNzX3RpbWUgPSAwO1xuICAgIH0sXG5cbiAgICBwbGF5OiBmdW5jdGlvbiBwbGF5KGZ1bmMpIHtcbiAgICAgICAgdGhpcy5wYXNzX3RpbWUgPSAwO1xuICAgICAgICB0aGlzLmFuaW1fZW5kZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5hbmltX2VuZF9mdW5jID0gZnVuYztcbiAgICAgICAgdGhpcy5zcF9jb21wLnNwcml0ZUZyYW1lID0gdGhpcy5mcmFtZXNfc3BbMF0uY2xvbmUoKTtcbiAgICB9LFxuXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICBpZiAodGhpcy5hbmltX2VuZGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wYXNzX3RpbWUgKz0gZHQ7XG4gICAgICAgIHZhciBpbmRleCA9IE1hdGguZmxvb3IodGhpcy5wYXNzX3RpbWUgLyB0aGlzLmZyYW1lX2R1cmF0aW9uKTtcblxuICAgICAgICBpZiAodGhpcy5sb29wKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5ub3dfaW5kZXggIT0gaW5kZXgpIHtcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPj0gdGhpcy5mcmFtZV9jb3VudCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhc3NfdGltZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3BfY29tcC5zcHJpdGVGcmFtZSA9IHRoaXMuZnJhbWVzX3NwWzBdLmNsb25lKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm93X2luZGV4ID0gMDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNwX2NvbXAuc3ByaXRlRnJhbWUgPSB0aGlzLmZyYW1lc19zcFtpbmRleF0uY2xvbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub3dfaW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5ub3dfaW5kZXggIT0gaW5kZXgpIHtcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPj0gdGhpcy5mcmFtZV9jb3VudCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFuaW1fZW5kZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5hbmltX2VuZF9mdW5jKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFuaW1fZW5kX2Z1bmMoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm93X2luZGV4ID0gaW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3BfY29tcC5zcHJpdGVGcmFtZSA9IHRoaXMuZnJhbWVzX3NwW2luZGV4XS5jbG9uZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMDY0MDFaSExnOUI4NWx6SExpMDZPN0onLCAnZ2FtZV9zY2VuZScpO1xuLy8gc2NyaXB0c1xcZ2FtZV9zY2VuZS5qc1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIGxldmVsX3Jvb3Q6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBbXSxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfSxcblxuICAgICAgICBhbmltX2Jsb2Nrc18yeDM6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBbXSxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfSxcbiAgICAgICAgYW5pbV9ibG9ja3NfM3gzOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogW10sXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH0sXG4gICAgICAgIGFuaW1fYmxvY2tzXzN4NDoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IFtdLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9LFxuXG4gICAgICAgIGFuaW1fYmxvY2tzXzR4NDoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IFtdLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9LFxuXG4gICAgICAgIGFuaW1fYmxvY2tzXzV4NDoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IFtdLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9LFxuXG4gICAgICAgIGFuaW1fcXVlc194OiAwLFxuICAgICAgICBhbmltX3F1ZXNfeTogMCxcbiAgICAgICAgYW5pbV9zdGFydF9zY2FsZTogMCxcbiAgICAgICAgYW5pbV9xdWVzX2RfeDogLTUzLFxuICAgICAgICBhbmltX3F1ZXNfZF95OiAzMDAsXG4gICAgICAgIHF1ZXN0aW9uX21vdmVfdGltZTogMC4xLFxuICAgICAgICBxdWVzdGlvbl9zY2FsZV90aW1lOiAwLjEsXG4gICAgICAgIHF1ZXN0aW9uX2ZhZGVvdXRfdGltZTogMC40LFxuICAgICAgICBxdWVzdGlvbl9zdGF5X3RpbWU6IDAuNVxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5ibG9ja19sZXZlbHMgPSBbdGhpcy5hbmltX2Jsb2Nrc18yeDMsIHRoaXMuYW5pbV9ibG9ja3NfM3gzLCB0aGlzLmFuaW1fYmxvY2tzXzN4NCwgdGhpcy5hbmltX2Jsb2Nrc180eDQsIHRoaXMuYW5pbV9ibG9ja3NfNXg0XTtcbiAgICAgICAgdGhpcy5nYW1lX2xldmVsID0gMDtcbiAgICAgICAgdGhpcy5jaGVja291dF9yb290ID0gY2MuZmluZChcIlVJX1JPT1QvY2hlY2tvdXRfcm9vdFwiKTtcbiAgICAgICAgdGhpcy5ja19sb2dvX3Jvb3QgPSBjYy5maW5kKFwiVUlfUk9PVC9jaGVja291dF9yb290L2xvZ29fcm9vdFwiKTtcbiAgICAgICAgdGhpcy5ja19yZXBsYXlfYnV0dG9uID0gY2MuZmluZChcIlVJX1JPT1QvY2hlY2tvdXRfcm9vdC9yZXBsYXlfYnV0dG9uXCIpO1xuICAgICAgICB0aGlzLnNrZV9raW1fY29tID0gY2MuZmluZChcIlVJX1JPT1QvYW5jaG9yLWJhY2tncm91bmQva2ltXCIpLmdldENvbXBvbmVudChzcC5Ta2VsZXRvbik7XG4gICAgICAgIHRoaXMubG9ja19raW1fY2xpY2sgPSB0cnVlO1xuXG4gICAgICAgIHZhciB1cmwgPSBjYy51cmwucmF3KFwicmVzb3VyY2VzL2dhbWVfc2NlbmUvbGVhc3QucG5nXCIpO1xuICAgICAgICB0aGlzLnF1ZXN0aW9uX2xlYXN0ID0gbmV3IGNjLlNwcml0ZUZyYW1lKHVybCk7XG4gICAgICAgIHVybCA9IGNjLnVybC5yYXcoXCJyZXNvdXJjZXMvZ2FtZV9zY2VuZS9tb3N0LnBuZ1wiKTtcbiAgICAgICAgdGhpcy5xdWVzdGlvbl9tb3N0ID0gbmV3IGNjLlNwcml0ZUZyYW1lKHVybCk7XG4gICAgICAgIHRoaXMucXVlc3Rpb25fbm9kZSA9IGNjLmZpbmQoXCJVSV9ST09UL2FuY2hvci1iYWNrZ3JvdW5kL3F1ZXN0aW9uXCIpO1xuICAgICAgICB0aGlzLnF1ZXN0aW9uX25vZGUuYWN0aXZlID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5hbmltX3NmX3NldCA9IFtdO1xuXG4gICAgICAgIHVybCA9IGNjLnVybC5yYXcoXCJyZXNvdXJjZXMvZ2FtZV9zY2VuZS9hbmltYWxfMC5wbmdcIik7XG4gICAgICAgIHZhciBzZiA9IG5ldyBjYy5TcHJpdGVGcmFtZSh1cmwpO1xuICAgICAgICB0aGlzLmFuaW1fc2Zfc2V0LnB1c2goc2YpO1xuXG4gICAgICAgIHVybCA9IGNjLnVybC5yYXcoXCJyZXNvdXJjZXMvZ2FtZV9zY2VuZS9hbmltYWxfMS5wbmdcIik7XG4gICAgICAgIHNmID0gbmV3IGNjLlNwcml0ZUZyYW1lKHVybCk7XG4gICAgICAgIHRoaXMuYW5pbV9zZl9zZXQucHVzaChzZik7XG5cbiAgICAgICAgdXJsID0gY2MudXJsLnJhdyhcInJlc291cmNlcy9nYW1lX3NjZW5lL2FuaW1hbF8yLnBuZ1wiKTtcbiAgICAgICAgc2YgPSBuZXcgY2MuU3ByaXRlRnJhbWUodXJsKTtcbiAgICAgICAgdGhpcy5hbmltX3NmX3NldC5wdXNoKHNmKTtcblxuICAgICAgICB1cmwgPSBjYy51cmwucmF3KFwicmVzb3VyY2VzL2dhbWVfc2NlbmUvYW5pbWFsXzMucG5nXCIpO1xuICAgICAgICBzZiA9IG5ldyBjYy5TcHJpdGVGcmFtZSh1cmwpO1xuICAgICAgICB0aGlzLmFuaW1fc2Zfc2V0LnB1c2goc2YpO1xuXG4gICAgICAgIHVybCA9IGNjLnVybC5yYXcoXCJyZXNvdXJjZXMvZ2FtZV9zY2VuZS9hbmltYWxfNC5wbmdcIik7XG4gICAgICAgIHNmID0gbmV3IGNjLlNwcml0ZUZyYW1lKHVybCk7XG4gICAgICAgIHRoaXMuYW5pbV9zZl9zZXQucHVzaChzZik7XG5cbiAgICAgICAgdXJsID0gY2MudXJsLnJhdyhcInJlc291cmNlcy9nYW1lX3NjZW5lL2FuaW1hbF81LnBuZ1wiKTtcbiAgICAgICAgc2YgPSBuZXcgY2MuU3ByaXRlRnJhbWUodXJsKTtcbiAgICAgICAgdGhpcy5hbmltX3NmX3NldC5wdXNoKHNmKTtcblxuICAgICAgICB1cmwgPSBjYy51cmwucmF3KFwicmVzb3VyY2VzL2dhbWVfc2NlbmUvYW5pbWFsXzYucG5nXCIpO1xuICAgICAgICBzZiA9IG5ldyBjYy5TcHJpdGVGcmFtZSh1cmwpO1xuICAgICAgICB0aGlzLmFuaW1fc2Zfc2V0LnB1c2goc2YpO1xuXG4gICAgICAgIHVybCA9IGNjLnVybC5yYXcoXCJyZXNvdXJjZXMvZ2FtZV9zY2VuZS9hbmltYWxfNy5wbmdcIik7XG4gICAgICAgIHNmID0gbmV3IGNjLlNwcml0ZUZyYW1lKHVybCk7XG4gICAgICAgIHRoaXMuYW5pbV9zZl9zZXQucHVzaChzZik7XG5cbiAgICAgICAgdXJsID0gY2MudXJsLnJhdyhcInJlc291cmNlcy9nYW1lX3NjZW5lL2FuaW1hbF84LnBuZ1wiKTtcbiAgICAgICAgc2YgPSBuZXcgY2MuU3ByaXRlRnJhbWUodXJsKTtcbiAgICAgICAgdGhpcy5hbmltX3NmX3NldC5wdXNoKHNmKTtcbiAgICB9LFxuXG4gICAgZ2V0X2FuaW1fc2V0OiBmdW5jdGlvbiBnZXRfYW5pbV9zZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFuaW1fc2Zfc2V0O1xuICAgIH0sXG5cbiAgICBzaG93X2NoZWNrb3V0OiBmdW5jdGlvbiBzaG93X2NoZWNrb3V0KCkge1xuICAgICAgICB0aGlzLnBsYXlfc291bmQoXCJyZXNvdXJjZXMvc291bmRzL2VuZC5tcDNcIik7XG4gICAgICAgIHRoaXMuY2hlY2tvdXRfcm9vdC5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB0aGlzLmNrX2xvZ29fcm9vdC5zY2FsZSA9IDA7XG4gICAgICAgIHZhciBzMSA9IGNjLnNjYWxlVG8oMC4zLCAxLjIpO1xuICAgICAgICB2YXIgczIgPSBjYy5zY2FsZVRvKDAuMSwgMC45KTtcbiAgICAgICAgdmFyIHMzID0gY2Muc2NhbGVUbygwLjEsIDEuMCk7XG5cbiAgICAgICAgdGhpcy5ja19yZXBsYXlfYnV0dG9uLmFjdGl2ZSA9IGZhbHNlO1xuXG4gICAgICAgIHZhciBjYWxsX2Z1bmMgPSBjYy5jYWxsRnVuYygoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8g5peL6L2s5YWJ57q/XG4gICAgICAgICAgICB0aGlzLmNrX3JlcGxheV9idXR0b24uYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuY2tfcmVwbGF5X2J1dHRvbi5zY2FsZSA9IDMuNTtcbiAgICAgICAgICAgIHRoaXMuY2tfcmVwbGF5X2J1dHRvbi5vcGFjaXR5ID0gMDtcbiAgICAgICAgICAgIHZhciBzY2FsZTEgPSBjYy5zY2FsZVRvKDAuMywgMC44KTtcbiAgICAgICAgICAgIHZhciBzY2FsZTIgPSBjYy5zY2FsZVRvKDAuMiwgMS4yKTtcbiAgICAgICAgICAgIHZhciBzY2FsZTMgPSBjYy5zY2FsZVRvKDAuMSwgMS4wKTtcbiAgICAgICAgICAgIHZhciBzZXEgPSBjYy5zZXF1ZW5jZShbc2NhbGUxLCBzY2FsZTIsIHNjYWxlM10pO1xuICAgICAgICAgICAgdGhpcy5ja19yZXBsYXlfYnV0dG9uLnJ1bkFjdGlvbihzZXEpO1xuICAgICAgICAgICAgdmFyIGZpbiA9IGNjLmZhZGVJbigwLjUpO1xuICAgICAgICAgICAgdGhpcy5ja19yZXBsYXlfYnV0dG9uLnJ1bkFjdGlvbihmaW4pO1xuICAgICAgICB9KS5iaW5kKHRoaXMpLCB0aGlzKTtcblxuICAgICAgICB2YXIgc2VxID0gY2Muc2VxdWVuY2UoW3MxLCBzMiwgczMsIGNhbGxfZnVuY10pO1xuICAgICAgICB0aGlzLmNrX2xvZ29fcm9vdC5ydW5BY3Rpb24oc2VxKTtcbiAgICB9LFxuXG4gICAgcGxheV9raW1fYW5pbV93aXRoX3JpZ2h0OiBmdW5jdGlvbiBwbGF5X2tpbV9hbmltX3dpdGhfcmlnaHQoKSB7XG4gICAgICAgIHZhciBpbmRleF9zZXQgPSBbMSwgMiwgMywgNF07XG4gICAgICAgIGluZGV4X3NldC5zb3J0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLnJhbmRvbSgpIC0gMC41O1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5za2Vfa2ltX2NvbS5jbGVhclRyYWNrcygpO1xuICAgICAgICB0aGlzLnNrZV9raW1fY29tLnNldEFuaW1hdGlvbigwLCBcIm9rX1wiICsgaW5kZXhfc2V0WzBdLCBmYWxzZSk7XG4gICAgICAgIHRoaXMuY2FsbF9sYXR0ZXIoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuc2tlX2tpbV9jb20uY2xlYXJUcmFja3MoKTtcbiAgICAgICAgICAgIHRoaXMuc2tlX2tpbV9jb20uc2V0QW5pbWF0aW9uKDAsIFwiaWRsZV8xXCIsIHRydWUpO1xuICAgICAgICB9KS5iaW5kKHRoaXMpLCAyKTtcbiAgICAgICAgdGhpcy5wbGF5X3NvdW5kKFwicmVzb3VyY2VzL3NvdW5kcy9jaF9yaWdodC5tcDNcIik7XG4gICAgfSxcblxuICAgIHBsYXlfa2ltX2FuaW1fd2l0aF9lcnJvcjogZnVuY3Rpb24gcGxheV9raW1fYW5pbV93aXRoX2Vycm9yKCkge1xuICAgICAgICB2YXIgaW5kZXhfc2V0ID0gWzEsIDIsIDMsIDRdO1xuICAgICAgICBpbmRleF9zZXQuc29ydChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5yYW5kb20oKSAtIDAuNTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc2tlX2tpbV9jb20uY2xlYXJUcmFja3MoKTtcbiAgICAgICAgdGhpcy5za2Vfa2ltX2NvbS5zZXRBbmltYXRpb24oMCwgXCJlcnJfXCIgKyBpbmRleF9zZXRbMF0sIGZhbHNlKTtcbiAgICAgICAgdGhpcy5jYWxsX2xhdHRlcigoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5za2Vfa2ltX2NvbS5jbGVhclRyYWNrcygpO1xuICAgICAgICAgICAgdGhpcy5za2Vfa2ltX2NvbS5zZXRBbmltYXRpb24oMCwgXCJpZGxlXzFcIiwgdHJ1ZSk7XG4gICAgICAgIH0pLmJpbmQodGhpcyksIDEuNSk7XG4gICAgICAgIHRoaXMucGxheV9zb3VuZChcInJlc291cmNlcy9zb3VuZHMvY2tfZXJyb3IubXAzXCIpO1xuICAgIH0sXG5cbiAgICBzdGFydDogZnVuY3Rpb24gc3RhcnQoKSB7XG4gICAgICAgIHRoaXMuZ2FtZV9zdGFydCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmxvY2tpbmdfZ2FtZSA9IHRydWU7XG4gICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKHRoaXMub25fZ2FtZV9zdGFydC5iaW5kKHRoaXMpLCAwKTtcblxuICAgICAgICB0aGlzLmNhbGxfbGF0dGVyKChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnNrZV9raW1fY29tLmNsZWFyVHJhY2tzKCk7XG4gICAgICAgICAgICB0aGlzLnNrZV9raW1fY29tLnNldEFuaW1hdGlvbigwLCBcImlkbGVfMVwiLCB0cnVlKTtcbiAgICAgICAgICAgIHRoaXMubG9ja19raW1fY2xpY2sgPSBmYWxzZTtcbiAgICAgICAgfSkuYmluZCh0aGlzKSwgMC45KTtcbiAgICB9LFxuXG4gICAgcmVzZXRfZmxpcF9ibG9jazogZnVuY3Rpb24gcmVzZXRfZmxpcF9ibG9jaygpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmZsaXBfYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgYmxvY2sgPSB0aGlzLmZsaXBfYmxvY2tzW2ldO1xuICAgICAgICAgICAgdmFyIGJsb2NrX2NvbXAgPSBibG9jay5nZXRDb21wb25lbnQoXCJmbGlwX2Jsb2NrXCIpO1xuICAgICAgICAgICAgYmxvY2tfY29tcC5mbGlwX3RvX2JhY2soKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBmbGlwX2Jsb2NrX3dpdGhfYXJyYXk6IGZ1bmN0aW9uIGZsaXBfYmxvY2tfd2l0aF9hcnJheSh2YWx1ZV9hcnJheSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbHVlX2FycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgYmxvY2sgPSB0aGlzLmZsaXBfYmxvY2tzW2ldO1xuICAgICAgICAgICAgdmFyIGJsb2NrX2NvbXAgPSBibG9jay5nZXRDb21wb25lbnQoXCJmbGlwX2Jsb2NrXCIpO1xuICAgICAgICAgICAgYmxvY2tfY29tcC5mbGlwX3RvX2JhY2tfd2l0aF92YWx1ZSh2YWx1ZV9hcnJheVtpXSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25fZ2FtZV9yZXBsYXk6IGZ1bmN0aW9uIG9uX2dhbWVfcmVwbGF5KCkge1xuICAgICAgICB0aGlzLnBsYXlfc291bmQoXCJyZXNvdXJjZXMvc291bmRzL2J1dHRvbi5tcDNcIik7XG4gICAgICAgIHRoaXMub25fZ2FtZV9zdGFydCgpO1xuICAgIH0sXG5cbiAgICBnZW5fYW5pbV93aGVuX3N0YXJ0OiBmdW5jdGlvbiBnZW5fYW5pbV93aGVuX3N0YXJ0KCkge1xuICAgICAgICB2YXIgdGltZSA9IDAuMTtcbiAgICAgICAgdmFyIGRlbHRhID0gMC4zO1xuICAgICAgICBpZiAodGhpcy5nYW1lX2xldmVsID49IDIpIHtcbiAgICAgICAgICAgIGRlbHRhID0gMC4xO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmZsaXBfYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmZsaXBfYmxvY2tzW2ldLnNjYWxlWCA9IDA7XG4gICAgICAgICAgICB0aGlzLmZsaXBfYmxvY2tzW2ldLnNjYWxlWSA9IDA7XG4gICAgICAgICAgICB2YXIgZGVsYXkgPSBjYy5kZWxheVRpbWUodGltZSk7XG4gICAgICAgICAgICB2YXIgcyA9IGNjLnNjYWxlVG8oZGVsdGEsIDEuMSk7XG4gICAgICAgICAgICB2YXIgczIgPSBjYy5zY2FsZVRvKDAuMSwgMS4wKTtcbiAgICAgICAgICAgIHZhciBzZXEgPSBjYy5zZXF1ZW5jZShbZGVsYXksIHMsIHMyXSk7XG4gICAgICAgICAgICB0aGlzLmZsaXBfYmxvY2tzW2ldLnJ1bkFjdGlvbihzZXEpO1xuICAgICAgICAgICAgdGltZSA9IHRpbWUgKyBkZWx0YTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGltZTtcbiAgICB9LFxuXG4gICAgZ2VuX2xldmVsMF9tYXBfZGF0YTogZnVuY3Rpb24gZ2VuX2xldmVsMF9tYXBfZGF0YSgpIHtcbiAgICAgICAgdmFyIG1hcCA9IFszLCAyLCAxXTtcbiAgICAgICAgdmFyIGFuaW1fdHlwZSA9IFswLCAxLCAyLCAzXTtcbiAgICAgICAgYW5pbV90eXBlLnNvcnQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGgucmFuZG9tKCkgLSAwLjU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMubWluX2FuaW1fdHlwZSA9IGFuaW1fdHlwZVsyXTtcbiAgICAgICAgdGhpcy5tYXhfYW5pbV90eXBlID0gYW5pbV90eXBlWzBdO1xuXG4gICAgICAgIHZhciBhbmltX2FycmF5ID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWFwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IG1hcFtpXTsgaisrKSB7XG4gICAgICAgICAgICAgICAgYW5pbV9hcnJheS5wdXNoKGFuaW1fdHlwZVtpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBhbmltX2FycmF5LnNvcnQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGgucmFuZG9tKCkgLSAwLjU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKGFuaW1fYXJyYXkpO1xuICAgICAgICB0aGlzLmdhbWVfcmV0ID0gdGhpcy5taW5fYW5pbV90eXBlO1xuICAgICAgICBpZiAoTWF0aC5yYW5kb20oKSA+PSAwLjUpIHtcbiAgICAgICAgICAgIHRoaXMuZ2FtZV9yZXQgPSB0aGlzLm1heF9hbmltX3R5cGU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFuaW1fYXJyYXk7XG4gICAgfSxcblxuICAgIGdlbl9sZXZlbDFfbWFwX2RhdGE6IGZ1bmN0aW9uIGdlbl9sZXZlbDFfbWFwX2RhdGEoKSB7XG4gICAgICAgIHZhciBtYXAwID0gWzUsIDMsIDFdO1xuICAgICAgICB2YXIgbWFwMSA9IFs2LCAyLCAxXTtcbiAgICAgICAgdmFyIG1hcDIgPSBbNCwgMywgMl07XG5cbiAgICAgICAgdmFyIG1hcF9zZXQgPSBbbWFwMCwgbWFwMSwgbWFwMl07XG4gICAgICAgIG1hcF9zZXQuc29ydChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5yYW5kb20oKSAtIDAuNTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIGFuaW1fdHlwZSA9IFswLCAxLCAyLCAzXTtcbiAgICAgICAgYW5pbV90eXBlLnNvcnQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGgucmFuZG9tKCkgLSAwLjU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBtYXA7XG4gICAgICAgIG1hcCA9IG1hcF9zZXRbMF07XG5cbiAgICAgICAgdGhpcy5taW5fYW5pbV90eXBlID0gYW5pbV90eXBlWzJdO1xuICAgICAgICB0aGlzLm1heF9hbmltX3R5cGUgPSBhbmltX3R5cGVbMF07XG5cbiAgICAgICAgdmFyIGFuaW1fYXJyYXkgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtYXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgbWFwW2ldOyBqKyspIHtcbiAgICAgICAgICAgICAgICBhbmltX2FycmF5LnB1c2goYW5pbV90eXBlW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGFuaW1fYXJyYXkuc29ydChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5yYW5kb20oKSAtIDAuNTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc29sZS5sb2coYW5pbV9hcnJheSk7XG4gICAgICAgIHRoaXMuZ2FtZV9yZXQgPSB0aGlzLm1pbl9hbmltX3R5cGU7XG4gICAgICAgIGlmIChNYXRoLnJhbmRvbSgpID49IDAuNSkge1xuICAgICAgICAgICAgdGhpcy5nYW1lX3JldCA9IHRoaXMubWF4X2FuaW1fdHlwZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYW5pbV9hcnJheTtcbiAgICB9LFxuXG4gICAgZ2VuX2xldmVsMl9tYXBfZGF0YTogZnVuY3Rpb24gZ2VuX2xldmVsMl9tYXBfZGF0YSgpIHtcbiAgICAgICAgdmFyIG1hcDAgPSBbNiwgMywgMiwgMV07XG4gICAgICAgIHZhciBtYXAxID0gWzUsIDQsIDIsIDFdO1xuICAgICAgICB2YXIgbWFwMiA9IFs0LCAzLCAzLCAyXTtcbiAgICAgICAgdmFyIG1hcDMgPSBbNywgMiwgMiwgMV07XG4gICAgICAgIHZhciBtYXA0ID0gWzUsIDMsIDMsIDFdO1xuXG4gICAgICAgIHZhciBtYXBfc2V0ID0gW21hcDAsIG1hcDEsIG1hcDIsIG1hcDMsIG1hcDRdO1xuICAgICAgICBtYXBfc2V0LnNvcnQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGgucmFuZG9tKCkgLSAwLjU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBhbmltX3R5cGUgPSBbMCwgMSwgMiwgM107XG4gICAgICAgIGFuaW1fdHlwZS5zb3J0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLnJhbmRvbSgpIC0gMC41O1xuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgbWFwO1xuICAgICAgICBtYXAgPSBtYXBfc2V0WzBdO1xuXG4gICAgICAgIHRoaXMubWluX2FuaW1fdHlwZSA9IGFuaW1fdHlwZVszXTtcbiAgICAgICAgdGhpcy5tYXhfYW5pbV90eXBlID0gYW5pbV90eXBlWzBdO1xuXG4gICAgICAgIHZhciBhbmltX2FycmF5ID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWFwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IG1hcFtpXTsgaisrKSB7XG4gICAgICAgICAgICAgICAgYW5pbV9hcnJheS5wdXNoKGFuaW1fdHlwZVtpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBhbmltX2FycmF5LnNvcnQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGgucmFuZG9tKCkgLSAwLjU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKGFuaW1fYXJyYXkpO1xuICAgICAgICB0aGlzLmdhbWVfcmV0ID0gdGhpcy5taW5fYW5pbV90eXBlO1xuICAgICAgICBpZiAoTWF0aC5yYW5kb20oKSA+PSAwLjUpIHtcbiAgICAgICAgICAgIHRoaXMuZ2FtZV9yZXQgPSB0aGlzLm1heF9hbmltX3R5cGU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFuaW1fYXJyYXk7XG4gICAgfSxcblxuICAgIC8vIDR4NFxuICAgIGdlbl9sZXZlbDNfbWFwX2RhdGE6IGZ1bmN0aW9uIGdlbl9sZXZlbDNfbWFwX2RhdGEoKSB7XG4gICAgICAgIHZhciBtYXAwID0gWzUsIDQsIDQsIDNdO1xuICAgICAgICB2YXIgbWFwMSA9IFs2LCA1LCA0LCAxXTtcbiAgICAgICAgdmFyIG1hcDIgPSBbNiwgNCwgNCwgMl07XG4gICAgICAgIHZhciBtYXAzID0gWzYsIDUsIDMsIDJdO1xuICAgICAgICB2YXIgbWFwNCA9IFs3LCA0LCAzLCAyXTtcbiAgICAgICAgdmFyIG1hcDUgPSBbNywgNCwgNCwgMV07XG4gICAgICAgIHZhciBtYXA2ID0gWzcsIDUsIDMsIDFdO1xuICAgICAgICB2YXIgbWFwNyA9IFs3LCA2LCAyLCAxXTtcbiAgICAgICAgdmFyIG1hcDggPSBbOCwgMywgMywgMl07XG4gICAgICAgIHZhciBtYXA5ID0gWzgsIDQsIDMsIDFdO1xuICAgICAgICB2YXIgbWFwMTAgPSBbOCwgNSwgMiwgMV07XG4gICAgICAgIHZhciBtYXAxMSA9IFs5LCA0LCAyLCAxXTtcbiAgICAgICAgdmFyIG1hcDEyID0gWzksIDMsIDMsIDFdO1xuXG4gICAgICAgIHZhciBtYXBfc2V0ID0gW21hcDAsIG1hcDEsIG1hcDIsIG1hcDMsIG1hcDQsIG1hcDUsIG1hcDYsIG1hcDcsIG1hcDgsIG1hcDksIG1hcDEwLCBtYXAxMSwgbWFwMTJdO1xuICAgICAgICBtYXBfc2V0LnNvcnQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGgucmFuZG9tKCkgLSAwLjU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBhbmltX3R5cGUgPSBbMCwgMSwgMiwgM107XG4gICAgICAgIGFuaW1fdHlwZS5zb3J0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLnJhbmRvbSgpIC0gMC41O1xuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgbWFwO1xuICAgICAgICBtYXAgPSBtYXBfc2V0WzBdO1xuXG4gICAgICAgIHRoaXMubWluX2FuaW1fdHlwZSA9IGFuaW1fdHlwZVszXTtcbiAgICAgICAgdGhpcy5tYXhfYW5pbV90eXBlID0gYW5pbV90eXBlWzBdO1xuXG4gICAgICAgIHZhciBhbmltX2FycmF5ID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWFwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IG1hcFtpXTsgaisrKSB7XG4gICAgICAgICAgICAgICAgYW5pbV9hcnJheS5wdXNoKGFuaW1fdHlwZVtpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBhbmltX2FycmF5LnNvcnQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGgucmFuZG9tKCkgLSAwLjU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKGFuaW1fYXJyYXkpO1xuICAgICAgICB0aGlzLmdhbWVfcmV0ID0gdGhpcy5taW5fYW5pbV90eXBlO1xuICAgICAgICBpZiAoTWF0aC5yYW5kb20oKSA+PSAwLjUpIHtcbiAgICAgICAgICAgIHRoaXMuZ2FtZV9yZXQgPSB0aGlzLm1heF9hbmltX3R5cGU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFuaW1fYXJyYXk7XG4gICAgfSxcblxuICAgIC8vIDV4NFxuICAgIGdlbl9sZXZlbDRfbWFwX2RhdGE6IGZ1bmN0aW9uIGdlbl9sZXZlbDRfbWFwX2RhdGEoKSB7XG4gICAgICAgIHZhciBtYXBfZGF0YV9pdGVtO1xuICAgICAgICB2YXIgbWFwX3NldCA9IFtdO1xuICAgICAgICBtYXBfZGF0YV9pdGVtID0gWzYsIDUsIDUsIDRdO1xuICAgICAgICBtYXBfc2V0LnB1c2gobWFwX2RhdGFfaXRlbSk7XG4gICAgICAgIG1hcF9kYXRhX2l0ZW0gPSBbNywgNSwgNSwgM107XG4gICAgICAgIG1hcF9zZXQucHVzaChtYXBfZGF0YV9pdGVtKTtcbiAgICAgICAgbWFwX2RhdGFfaXRlbSA9IFs3LCA2LCA0LCAzXTtcbiAgICAgICAgbWFwX3NldC5wdXNoKG1hcF9kYXRhX2l0ZW0pO1xuICAgICAgICBtYXBfZGF0YV9pdGVtID0gWzcsIDYsIDUsIDJdO1xuICAgICAgICBtYXBfc2V0LnB1c2gobWFwX2RhdGFfaXRlbSk7XG4gICAgICAgIG1hcF9kYXRhX2l0ZW0gPSBbNywgNiwgNiwgMV07XG4gICAgICAgIG1hcF9zZXQucHVzaChtYXBfZGF0YV9pdGVtKTtcbiAgICAgICAgbWFwX2RhdGFfaXRlbSA9IFs4LCA3LCA0LCAxXTtcbiAgICAgICAgbWFwX3NldC5wdXNoKG1hcF9kYXRhX2l0ZW0pO1xuICAgICAgICBtYXBfZGF0YV9pdGVtID0gWzgsIDYsIDUsIDFdO1xuICAgICAgICBtYXBfc2V0LnB1c2gobWFwX2RhdGFfaXRlbSk7XG4gICAgICAgIG1hcF9kYXRhX2l0ZW0gPSBbOCwgNiwgNCwgMl07XG4gICAgICAgIG1hcF9zZXQucHVzaChtYXBfZGF0YV9pdGVtKTtcbiAgICAgICAgbWFwX2RhdGFfaXRlbSA9IFs4LCA3LCAzLCAyXTtcbiAgICAgICAgbWFwX3NldC5wdXNoKG1hcF9kYXRhX2l0ZW0pO1xuICAgICAgICBtYXBfZGF0YV9pdGVtID0gWzgsIDUsIDUsIDJdO1xuICAgICAgICBtYXBfc2V0LnB1c2gobWFwX2RhdGFfaXRlbSk7XG4gICAgICAgIG1hcF9kYXRhX2l0ZW0gPSBbOCwgNSwgNCwgM107XG4gICAgICAgIG1hcF9zZXQucHVzaChtYXBfZGF0YV9pdGVtKTtcbiAgICAgICAgbWFwX2RhdGFfaXRlbSA9IFs5LCA4LCAyLCAxXTtcbiAgICAgICAgbWFwX3NldC5wdXNoKG1hcF9kYXRhX2l0ZW0pO1xuICAgICAgICBtYXBfZGF0YV9pdGVtID0gWzksIDcsIDMsIDFdO1xuICAgICAgICBtYXBfc2V0LnB1c2gobWFwX2RhdGFfaXRlbSk7XG4gICAgICAgIG1hcF9kYXRhX2l0ZW0gPSBbOSwgNiwgNCwgMV07XG4gICAgICAgIG1hcF9zZXQucHVzaChtYXBfZGF0YV9pdGVtKTtcbiAgICAgICAgbWFwX2RhdGFfaXRlbSA9IFs5LCA1LCA1LCAxXTtcbiAgICAgICAgbWFwX3NldC5wdXNoKG1hcF9kYXRhX2l0ZW0pO1xuXG4gICAgICAgIG1hcF9kYXRhX2l0ZW0gPSBbOSwgNiwgMywgMl07XG4gICAgICAgIG1hcF9zZXQucHVzaChtYXBfZGF0YV9pdGVtKTtcbiAgICAgICAgbWFwX2RhdGFfaXRlbSA9IFs5LCA1LCA0LCAyXTtcbiAgICAgICAgbWFwX3NldC5wdXNoKG1hcF9kYXRhX2l0ZW0pO1xuICAgICAgICBtYXBfZGF0YV9pdGVtID0gWzksIDQsIDQsIDNdO1xuICAgICAgICBtYXBfc2V0LnB1c2gobWFwX2RhdGFfaXRlbSk7XG5cbiAgICAgICAgbWFwX2RhdGFfaXRlbSA9IFsxMCwgNSwgMywgMl07XG4gICAgICAgIG1hcF9zZXQucHVzaChtYXBfZGF0YV9pdGVtKTtcbiAgICAgICAgbWFwX2RhdGFfaXRlbSA9IFsxMCwgNCwgNCwgMl07XG4gICAgICAgIG1hcF9zZXQucHVzaChtYXBfZGF0YV9pdGVtKTtcbiAgICAgICAgbWFwX2RhdGFfaXRlbSA9IFsxMCwgNSwgNCwgMV07XG4gICAgICAgIG1hcF9zZXQucHVzaChtYXBfZGF0YV9pdGVtKTtcbiAgICAgICAgbWFwX2RhdGFfaXRlbSA9IFsxMCwgNiwgMywgMV07XG4gICAgICAgIG1hcF9zZXQucHVzaChtYXBfZGF0YV9pdGVtKTtcbiAgICAgICAgbWFwX2RhdGFfaXRlbSA9IFsxMCwgNywgMiwgMV07XG4gICAgICAgIG1hcF9zZXQucHVzaChtYXBfZGF0YV9pdGVtKTtcbiAgICAgICAgbWFwX2RhdGFfaXRlbSA9IFsxMSwgNiwgMiwgMV07XG4gICAgICAgIG1hcF9zZXQucHVzaChtYXBfZGF0YV9pdGVtKTtcbiAgICAgICAgbWFwX2RhdGFfaXRlbSA9IFsxMSwgNCwgNCwgMV07XG4gICAgICAgIG1hcF9zZXQucHVzaChtYXBfZGF0YV9pdGVtKTtcbiAgICAgICAgbWFwX2RhdGFfaXRlbSA9IFsxMSwgNSwgMywgMV07XG4gICAgICAgIG1hcF9zZXQucHVzaChtYXBfZGF0YV9pdGVtKTtcbiAgICAgICAgbWFwX2RhdGFfaXRlbSA9IFsxMSwgNCwgMywgMl07XG4gICAgICAgIG1hcF9zZXQucHVzaChtYXBfZGF0YV9pdGVtKTtcbiAgICAgICAgbWFwX2RhdGFfaXRlbSA9IFsxMiwgNCwgMywgMV07XG4gICAgICAgIG1hcF9zZXQucHVzaChtYXBfZGF0YV9pdGVtKTtcbiAgICAgICAgbWFwX2RhdGFfaXRlbSA9IFsxMiwgNSwgMiwgMV07XG4gICAgICAgIG1hcF9zZXQucHVzaChtYXBfZGF0YV9pdGVtKTtcbiAgICAgICAgbWFwX2RhdGFfaXRlbSA9IFsxMywgNCwgMiwgMV07XG4gICAgICAgIG1hcF9zZXQucHVzaChtYXBfZGF0YV9pdGVtKTtcbiAgICAgICAgbWFwX2RhdGFfaXRlbSA9IFsxMywgMywgMywgMV07XG4gICAgICAgIG1hcF9zZXQucHVzaChtYXBfZGF0YV9pdGVtKTtcbiAgICAgICAgbWFwX2RhdGFfaXRlbSA9IFsxNCwgMywgMiwgMV07XG4gICAgICAgIG1hcF9zZXQucHVzaChtYXBfZGF0YV9pdGVtKTtcbiAgICAgICAgbWFwX2RhdGFfaXRlbSA9IFsxNSwgMiwgMiwgMV07XG4gICAgICAgIG1hcF9zZXQucHVzaChtYXBfZGF0YV9pdGVtKTtcblxuICAgICAgICBtYXBfc2V0LnNvcnQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGgucmFuZG9tKCkgLSAwLjU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBhbmltX3R5cGUgPSBbMCwgMSwgMiwgM107XG4gICAgICAgIGFuaW1fdHlwZS5zb3J0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLnJhbmRvbSgpIC0gMC41O1xuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgbWFwO1xuICAgICAgICBtYXAgPSBtYXBfc2V0WzBdO1xuXG4gICAgICAgIHRoaXMubWluX2FuaW1fdHlwZSA9IGFuaW1fdHlwZVszXTtcbiAgICAgICAgdGhpcy5tYXhfYW5pbV90eXBlID0gYW5pbV90eXBlWzBdO1xuXG4gICAgICAgIHZhciBhbmltX2FycmF5ID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWFwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IG1hcFtpXTsgaisrKSB7XG4gICAgICAgICAgICAgICAgYW5pbV9hcnJheS5wdXNoKGFuaW1fdHlwZVtpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBhbmltX2FycmF5LnNvcnQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGgucmFuZG9tKCkgLSAwLjU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKGFuaW1fYXJyYXkpO1xuICAgICAgICB0aGlzLmdhbWVfcmV0ID0gdGhpcy5taW5fYW5pbV90eXBlO1xuICAgICAgICBpZiAoTWF0aC5yYW5kb20oKSA+PSAwLjUpIHtcbiAgICAgICAgICAgIHRoaXMuZ2FtZV9yZXQgPSB0aGlzLm1heF9hbmltX3R5cGU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFuaW1fYXJyYXk7XG4gICAgfSxcblxuICAgIGdlbl9nYW1lX2RhdGE6IGZ1bmN0aW9uIGdlbl9nYW1lX2RhdGEoYW5pbV9kYXRhKSB7XG4gICAgICAgIHZhciBmbGlwX2Jsb2NrX2NvbXA7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbmltX2RhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGZsaXBfYmxvY2tfY29tcCA9IHRoaXMuZmxpcF9ibG9ja3NbaV0uZ2V0Q29tcG9uZW50KFwiZmxpcF9ibG9ja1wiKTtcbiAgICAgICAgICAgIGZsaXBfYmxvY2tfY29tcC5mbGlwX3RvX2JhY2tfd2l0aF92YWx1ZShhbmltX2RhdGFbaV0pO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uX2dhbWVfc3RhcnQ6IGZ1bmN0aW9uIG9uX2dhbWVfc3RhcnQoKSB7XG4gICAgICAgIGlmICh0aGlzLmdhbWVfbGV2ZWwgPj0gdGhpcy5sZXZlbF9yb290Lmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jaGVja291dF9yb290LmFjdGl2ZSA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMucXVlc3Rpb25fbm9kZS5zdG9wQWxsQWN0aW9ucygpO1xuICAgICAgICB0aGlzLnF1ZXN0aW9uX25vZGUuYWN0aXZlID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5nYW1lX3N0YXJ0ID0gdHJ1ZTtcblxuICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5sZXZlbF9yb290Lmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgdGhpcy5sZXZlbF9yb290W2luZGV4XS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxldmVsX3Jvb3RbdGhpcy5nYW1lX2xldmVsXS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB0aGlzLmZsaXBfYmxvY2tzID0gdGhpcy5ibG9ja19sZXZlbHNbdGhpcy5nYW1lX2xldmVsXTtcblxuICAgICAgICB2YXIgbWFwO1xuICAgICAgICB2YXIgYW5pbV9hcnJheTtcblxuICAgICAgICB0aGlzLmFuaW1fc2Zfc2V0LnNvcnQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGgucmFuZG9tKCkgLSAwLjU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aGlzLmdhbWVfbGV2ZWwgPT09IDApIHtcbiAgICAgICAgICAgIGFuaW1fYXJyYXkgPSB0aGlzLmdlbl9sZXZlbDBfbWFwX2RhdGEoKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmdhbWVfbGV2ZWwgPT09IDEpIHtcbiAgICAgICAgICAgIGFuaW1fYXJyYXkgPSB0aGlzLmdlbl9sZXZlbDFfbWFwX2RhdGEoKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmdhbWVfbGV2ZWwgPT09IDIpIHtcbiAgICAgICAgICAgIGFuaW1fYXJyYXkgPSB0aGlzLmdlbl9sZXZlbDJfbWFwX2RhdGEoKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmdhbWVfbGV2ZWwgPT09IDMpIHtcbiAgICAgICAgICAgIGFuaW1fYXJyYXkgPSB0aGlzLmdlbl9sZXZlbDNfbWFwX2RhdGEoKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmdhbWVfbGV2ZWwgPT09IDQpIHtcbiAgICAgICAgICAgIC8vIGFuaW1fYXJyYXkgPSB0aGlzLmdlbl9sZXZlbDRfbWFwX2RhdGEoKTtcbiAgICAgICAgICAgIGFuaW1fYXJyYXkgPSB0aGlzLmdlbl9sZXZlbDNfbWFwX2RhdGEoKTtcbiAgICAgICAgICAgIHRoaXMubGV2ZWxfcm9vdFszXS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5mbGlwX2Jsb2NrcyA9IHRoaXMuYmxvY2tfbGV2ZWxzWzNdO1xuXG4gICAgICAgICAgICB0aGlzLmxldmVsX3Jvb3RbdGhpcy5nYW1lX2xldmVsXS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmdlbl9nYW1lX2RhdGEoYW5pbV9hcnJheSk7XG4gICAgICAgIHZhciB0aW1lID0gdGhpcy5nZW5fYW5pbV93aGVuX3N0YXJ0KCk7XG4gICAgICAgIHRoaXMuY2FsbF9sYXR0ZXIoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMucGxheV9xdWVzdGlvbl9hY3Rpb24oKTtcbiAgICAgICAgfSkuYmluZCh0aGlzKSwgdGltZSArIDAuMSk7XG4gICAgfSxcblxuICAgIHBsYXlfcXVlc3Rpb25fYWN0aW9uOiBmdW5jdGlvbiBwbGF5X3F1ZXN0aW9uX2FjdGlvbigpIHtcbiAgICAgICAgdGhpcy5sb2NraW5nX2dhbWUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5xdWVzdGlvbl9ub2RlLmFjdGl2ZSA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5xdWVzdGlvbl9ub2RlLnggPSB0aGlzLmFuaW1fcXVlc194O1xuICAgICAgICB0aGlzLnF1ZXN0aW9uX25vZGUueSA9IHRoaXMuYW5pbV9xdWVzX3k7XG4gICAgICAgIHRoaXMucXVlc3Rpb25fbm9kZS5vcGFjaXR5ID0gMjU1O1xuICAgICAgICB0aGlzLnF1ZXN0aW9uX25vZGUuc2NhbGUgPSB0aGlzLmFuaW1fc3RhcnRfc2NhbGU7XG5cbiAgICAgICAgdmFyIHNwcml0ZV9jb20gPSB0aGlzLnF1ZXN0aW9uX25vZGUuZ2V0Q29tcG9uZW50KGNjLlNwcml0ZSk7XG4gICAgICAgIGlmICh0aGlzLmdhbWVfcmV0ID09IHRoaXMubWluX2FuaW1fdHlwZSkge1xuICAgICAgICAgICAgc3ByaXRlX2NvbS5zcHJpdGVGcmFtZSA9IHRoaXMucXVlc3Rpb25fbGVhc3QuY2xvbmUoKTtcbiAgICAgICAgICAgIHRoaXMucGxheV9zb3VuZChcInJlc291cmNlcy9zb3VuZHMvbGVhc3QubXAzXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3ByaXRlX2NvbS5zcHJpdGVGcmFtZSA9IHRoaXMucXVlc3Rpb25fbW9zdC5jbG9uZSgpO1xuICAgICAgICAgICAgdGhpcy5wbGF5X3NvdW5kKFwicmVzb3VyY2VzL3NvdW5kcy9tb3N0Lm1wM1wiKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbW92ZSA9IGNjLm1vdmVUbyh0aGlzLnF1ZXN0aW9uX21vdmVfdGltZSwgdGhpcy5hbmltX3F1ZXNfZF94LCB0aGlzLmFuaW1fcXVlc19kX3kpO1xuICAgICAgICB2YXIgc2NhbGUgPSBjYy5zY2FsZVRvKHRoaXMucXVlc3Rpb25fc2NhbGVfdGltZSwgMSk7XG5cbiAgICAgICAgdmFyIHNlcSA9IGNjLnNlcXVlbmNlKFttb3ZlLCBzY2FsZV0pO1xuICAgICAgICB0aGlzLnF1ZXN0aW9uX25vZGUucnVuQWN0aW9uKHNlcSk7XG4gICAgfSxcblxuICAgIG9uX3F1ZXN0aW9uX2NsaWNrOiBmdW5jdGlvbiBvbl9xdWVzdGlvbl9jbGljaygpIHtcbiAgICAgICAgdmFyIGZvdXQgPSBjYy5mYWRlT3V0KHRoaXMucXVlc3Rpb25fZmFkZW91dF90aW1lKTtcbiAgICAgICAgdmFyIGNhbGxmdW5jID0gY2MuY2FsbEZ1bmMoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb25fbm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgfSkuYmluZCh0aGlzKSwgdGhpcyk7XG4gICAgICAgIHZhciBzZXEgPSBjYy5zZXF1ZW5jZShbZm91dCwgY2FsbGZ1bmNdKTtcbiAgICAgICAgdGhpcy5xdWVzdGlvbl9ub2RlLnJ1bkFjdGlvbihzZXEpO1xuICAgIH0sXG5cbiAgICBwbGF5X3NvdW5kOiBmdW5jdGlvbiBwbGF5X3NvdW5kKG5hbWUpIHtcbiAgICAgICAgY2MuYXVkaW9FbmdpbmUuc3RvcE11c2ljKGZhbHNlKTtcbiAgICAgICAgdmFyIHVybCA9IGNjLnVybC5yYXcobmFtZSk7XG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlNdXNpYyh1cmwsIGZhbHNlKTtcbiAgICB9LFxuXG4gICAgY2hlY2tvdXRfc3VjY2VzczogZnVuY3Rpb24gY2hlY2tvdXRfc3VjY2VzcygpIHtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5mbGlwX2Jsb2Nrcy5sZW5ndGgpO1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmZsaXBfbWFzayk7XG4gICAgICAgIHZhciBpO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5mbGlwX2Jsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuZmxpcF9tYXNrW2ldID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG5cbiAgICBzaG93X3JpZ2h0X2FuaW06IGZ1bmN0aW9uIHNob3dfcmlnaHRfYW5pbSgpIHtcbiAgICAgICAgdmFyIHMxID0gY2Muc2NhbGVUbygwLjMsIDEuMSk7XG4gICAgICAgIHZhciBkZWxheSA9IGNjLmRlbGF5VGltZSgwLjIpO1xuICAgICAgICB2YXIgczIgPSBjYy5zY2FsZVRvKDAuMSwgMS4wKTtcblxuICAgICAgICB2YXIgc2VxID0gY2Muc2VxdWVuY2UoW3MxLCBkZWxheSwgczJdKTtcblxuICAgICAgICB0aGlzLmZpcnN0X2ZsaXAubm9kZS5ydW5BY3Rpb24oc2VxKTtcbiAgICAgICAgdGhpcy5zZWNvbmRfZmxpcC5ub2RlLnJ1bkFjdGlvbihzZXEuY2xvbmUoKSk7XG4gICAgfSxcblxuICAgIGNhbGxfbGF0dGVyOiBmdW5jdGlvbiBjYWxsX2xhdHRlcihjYWxsZnVuYywgZGVsYXkpIHtcbiAgICAgICAgdmFyIGRlbGF5X2FjdGlvbiA9IGNjLmRlbGF5VGltZShkZWxheSk7XG4gICAgICAgIHZhciBjYWxsX2FjdGlvbiA9IGNjLmNhbGxGdW5jKGNhbGxmdW5jLCB0aGlzKTtcbiAgICAgICAgdmFyIHNlcSA9IGNjLnNlcXVlbmNlKFtkZWxheV9hY3Rpb24sIGNhbGxfYWN0aW9uXSk7XG4gICAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24oc2VxKTtcbiAgICB9LFxuXG4gICAgcGxheV9jaG9vc2Vfc3VjY2VzX2FuaW06IGZ1bmN0aW9uIHBsYXlfY2hvb3NlX3N1Y2Nlc19hbmltKGNhcmRfdmFsdWUpIHtcbiAgICAgICAgdmFyIHNfbWF4ID0gY2Muc2NhbGVUbygwLjQsIDEuMik7XG4gICAgICAgIHZhciBzX2JrID0gY2Muc2NhbGVUbygwLjIsIDEpO1xuICAgICAgICB2YXIgc2VxID0gY2Muc2VxdWVuY2UoW3NfbWF4LCBzX2JrXSk7XG4gICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLmZsaXBfYmxvY2tzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgdmFyIGJsb2NrX2NvbXAgPSB0aGlzLmZsaXBfYmxvY2tzW2luZGV4XS5nZXRDb21wb25lbnQoXCJmbGlwX2Jsb2NrXCIpO1xuICAgICAgICAgICAgaWYgKGJsb2NrX2NvbXAuY2FyZF92YWx1ZSA9PSBjYXJkX3ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5mbGlwX2Jsb2Nrc1tpbmRleF0ucnVuQWN0aW9uKHNlcS5jbG9uZSgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBwbGF5X2Nob29zZV9lcnJvcl9hbmltOiBmdW5jdGlvbiBwbGF5X2Nob29zZV9lcnJvcl9hbmltKGJsb2NrKSB7XG4gICAgICAgIHZhciByMSA9IGNjLnJvdGF0ZVRvKDAuMSwgLTEwKTtcbiAgICAgICAgdmFyIHIyID0gY2Mucm90YXRlVG8oMC4yLCAxMCk7XG4gICAgICAgIHZhciByMyA9IGNjLnJvdGF0ZVRvKDAuMiwgLTgpO1xuICAgICAgICB2YXIgcjQgPSBjYy5yb3RhdGVUbygwLjIsIDgpO1xuICAgICAgICB2YXIgcjUgPSBjYy5yb3RhdGVUbygwLjIsIC00KTtcbiAgICAgICAgdmFyIHI2ID0gY2Mucm90YXRlVG8oMC4yLCA0KTtcbiAgICAgICAgdmFyIHI3ID0gY2Mucm90YXRlVG8oMC4xLCAwKTtcblxuICAgICAgICB2YXIgc2VxID0gY2Muc2VxdWVuY2UoW3IxLCByMiwgcjMsIHI0LCByNSwgcjYsIHI3XSk7XG4gICAgICAgIGJsb2NrLm5vZGUucnVuQWN0aW9uKHNlcSk7XG4gICAgfSxcblxuICAgIG9uX2NhcmRfZmxpcDogZnVuY3Rpb24gb25fY2FyZF9mbGlwKGJsb2NrLCBjYXJkX3ZhbHVlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuZ2FtZV9zdGFydCArIHRoaXMubG9ja2luZ19nYW1lKTtcbiAgICAgICAgaWYgKHRoaXMuZ2FtZV9zdGFydCA9PT0gZmFsc2UgfHwgdGhpcy5sb2NraW5nX2dhbWUgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUubG9nKFwiY2FyZF9mbGlwID1cIiArIGNhcmRfdmFsdWUpO1xuICAgICAgICB0aGlzLmxvY2tpbmdfZ2FtZSA9IHRydWU7XG4gICAgICAgIGlmICh0aGlzLmdhbWVfcmV0ID09IGNhcmRfdmFsdWUpIHtcbiAgICAgICAgICAgIC8vIOi/m+WFpeS4i+S4gOWFs1xuICAgICAgICAgICAgdGhpcy5wbGF5X2tpbV9hbmltX3dpdGhfcmlnaHQoKTtcbiAgICAgICAgICAgIHRoaXMucGxheV9jaG9vc2Vfc3VjY2VzX2FuaW0oY2FyZF92YWx1ZSk7XG4gICAgICAgICAgICB0aGlzLmNhbGxfbGF0dGVyKChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lX2xldmVsKys7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2FtZV9sZXZlbCA+PSA1KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOa4uOaIj+e7k+adn1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWVfbGV2ZWwgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3dfY2hlY2tvdXQoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uX2dhbWVfc3RhcnQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5iaW5kKHRoaXMpLCAyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucGxheV9raW1fYW5pbV93aXRoX2Vycm9yKCk7XG4gICAgICAgICAgICB0aGlzLnBsYXlfY2hvb3NlX2Vycm9yX2FuaW0oYmxvY2spO1xuICAgICAgICAgICAgdGhpcy5jYWxsX2xhdHRlcigoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHRoaXMub25fZ2FtZV9zdGFydCgpO1xuICAgICAgICAgICAgfSkuYmluZCh0aGlzKSwgMik7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25fZ290b19ob21lOiBmdW5jdGlvbiBvbl9nb3RvX2hvbWUoKSB7XG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnN0b3BNdXNpYyhmYWxzZSk7XG4gICAgICAgIHZhciB1cmwgPSBjYy51cmwucmF3KFwicmVzb3VyY2VzL3NvdW5kcy9idXR0b24ubXAzXCIpO1xuICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5TXVzaWModXJsLCBmYWxzZSk7XG4gICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcInN0YXJ0X3NjZW5lXCIpO1xuICAgIH0sXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvKnVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XHJcbiAgICAgICAgdmFyIHdpbl9zaXplID0gY2MuZGlyZWN0b3IuZ2V0V2luU2l6ZSgpO1xyXG4gICAgICAgIGlmKHdpbl9zaXplLndpZHRoICE9IHRoaXMucHJldl9zaXplLndpZHRoIHx8IHdpbl9zaXplLmhlaWdodCAhPSB0aGlzLnByZXZfc2l6ZS5oZWlnaHQpIHtcclxuICAgICAgICAgICAgdGhpcy5wcmV2X3NpemUgPSB3aW5fc2l6ZTtcclxuICAgICAgICAgICAgdGhpcy5hZGp1c3Rfd2luZG93KHdpbl9zaXplKTtcclxuICAgICAgICB9XHJcbiAgICB9LCovXG5cbiAgICBvbl9raW1fY2xpY2s6IGZ1bmN0aW9uIG9uX2tpbV9jbGljaygpIHtcbiAgICAgICAgaWYgKHRoaXMubG9ja19raW1fY2xpY2sgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBsYXlfa2ltX2NsaWNrX2FuaW1fd2l0aF9yYW5kb20oKTtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2EzYzhhQm5OVGRPUUlqNzFCVVZONHExJywgJ2xvb3BfbW92ZV9hY3Rpb24nKTtcbi8vIHNjcmlwdHNcXGxvb3BfbW92ZV9hY3Rpb24uanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBtb3ZlX3RpbWU6IDAuNCxcbiAgICAgICAgbW92ZV9keDogMCxcbiAgICAgICAgbW92ZV9keTogMCxcbiAgICAgICAgc3RhcnRfdGltZTogMFxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgaWYgKHRoaXMuc3RhcnRfdGltZSA+PSAwKSB7XG4gICAgICAgICAgICB0aGlzLnNjaGVkdWxlT25jZSgoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHRoaXMucnVuX2FjdGlvbigpO1xuICAgICAgICAgICAgfSkuYmluZCh0aGlzKSwgdGhpcy5zdGFydF90aW1lKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucnVuX2FjdGlvbigpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHJ1bl9hY3Rpb246IGZ1bmN0aW9uIHJ1bl9hY3Rpb24oKSB7XG4gICAgICAgIHZhciBtMSA9IGNjLm1vdmVCeSh0aGlzLm1vdmVfdGltZSwgdGhpcy5tb3ZlX2R4LCB0aGlzLm1vdmVfZHkpO1xuICAgICAgICB2YXIgbTIgPSBjYy5tb3ZlQnkodGhpcy5tb3ZlX3RpbWUsIC10aGlzLm1vdmVfZHgsIC10aGlzLm1vdmVfZHkpO1xuICAgICAgICB2YXIgc2VxID0gY2Muc2VxdWVuY2UoW20xLCBtMl0pO1xuICAgICAgICB2YXIgcmVwZWF0ID0gY2MucmVwZWF0Rm9yZXZlcihzZXEpO1xuICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKHJlcGVhdCk7XG4gICAgfVxufSk7XG4vLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuLy8gfSxcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2YyYmEzbTBqWnRHSDRHOG5xZkc5cEdwJywgJ21vdmVfYWN0aW9uJyk7XG4vLyBzY3JpcHRzXFxtb3ZlX2FjdGlvbi5qc1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIHBsYXlfb25sb2FkOiB0cnVlLFxuICAgICAgICBwbGF5X29ubG9hZF9kZWxheTogMCxcbiAgICAgICAgc3RhcnRfYWN0aXZlOiBmYWxzZSxcbiAgICAgICAgbW92ZV9kdXJhdGlvbjogMCxcbiAgICAgICAgbW92ZV90aW1lOiAwLjIsXG4gICAgICAgIGlzX2hvcjogZmFsc2UsXG4gICAgICAgIGlzX2p1bXA6IHRydWVcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMubm9kZS5hY3RpdmUgPSB0aGlzLnN0YXJ0X2FjdGl2ZTtcbiAgICAgICAgaWYgKHRoaXMucGxheV9vbmxvYWQgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnBsYXlfb25sb2FkX2RlbGF5IDw9IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXkoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbGF5KCk7XG4gICAgICAgICAgICAgICAgfSkuYmluZCh0aGlzKSwgdGhpcy5wbGF5X29ubG9hZF9kZWxheSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcGxheTogZnVuY3Rpb24gcGxheSgpIHtcbiAgICAgICAgdGhpcy5ub2RlLnN0b3BBbGxBY3Rpb25zKCk7XG5cbiAgICAgICAgdGhpcy5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIHZhciBkeCA9IDA7XG4gICAgICAgIHZhciBkeSA9IDA7XG5cbiAgICAgICAgdmFyIGp1bXBfeCA9IDA7XG4gICAgICAgIHZhciBqdW1wX3kgPSAwO1xuXG4gICAgICAgIGlmICh0aGlzLmlzX2hvcikge1xuICAgICAgICAgICAgZHggPSB0aGlzLm1vdmVfZHVyYXRpb247XG4gICAgICAgICAgICBpZiAodGhpcy5pc19qdW1wKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubW92ZV9kdXJhdGlvbiA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g5Y+zXG4gICAgICAgICAgICAgICAgICAgIGp1bXBfeCA9IC0xMDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyDlt6ZcbiAgICAgICAgICAgICAgICAgICAganVtcF94ID0gMTA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZHkgPSB0aGlzLm1vdmVfZHVyYXRpb247XG4gICAgICAgICAgICBpZiAodGhpcy5pc19qdW1wKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubW92ZV9kdXJhdGlvbiA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g5LiKXG4gICAgICAgICAgICAgICAgICAgIGp1bXBfeSA9IC0xMDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyDkuItcbiAgICAgICAgICAgICAgICAgICAganVtcF95ID0gMTA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaXNfanVtcCkge1xuICAgICAgICAgICAgdmFyIG1vdmUxID0gY2MubW92ZUJ5KHRoaXMubW92ZV90aW1lLCBkeCAtIGp1bXBfeCwgZHkgLSBqdW1wX3kpO1xuICAgICAgICAgICAgdmFyIG1vdmUyID0gY2MubW92ZUJ5KDAuMiwganVtcF94ICogMiwganVtcF95ICogMik7XG4gICAgICAgICAgICB2YXIgbW92ZTMgPSBjYy5tb3ZlQnkoMC4xLCAtanVtcF94LCAtanVtcF95KTtcbiAgICAgICAgICAgIHZhciBzZXEgPSBjYy5zZXF1ZW5jZShbbW92ZTEsIG1vdmUyLCBtb3ZlM10pO1xuICAgICAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihzZXEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIG1vdmUxID0gY2MubW92ZUJ5KHRoaXMubW92ZV90aW1lLCBkeCwgZHkpO1xuICAgICAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihtb3ZlMSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgbW92ZV9iYWNrOiBmdW5jdGlvbiBtb3ZlX2JhY2soKSB7XG4gICAgICAgIHRoaXMubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB0aGlzLm5vZGUuc3RvcEFsbEFjdGlvbnMoKTtcbiAgICAgICAgdmFyIGR4ID0gMDtcbiAgICAgICAgdmFyIGR5ID0gMDtcblxuICAgICAgICB2YXIganVtcF94ID0gMDtcbiAgICAgICAgdmFyIGp1bXBfeSA9IDA7XG5cbiAgICAgICAgaWYgKHRoaXMuaXNfaG9yKSB7XG4gICAgICAgICAgICBkeCA9IHRoaXMubW92ZV9kdXJhdGlvbjtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzX2p1bXApIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5tb3ZlX2R1cmF0aW9uID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAvLyDlj7NcbiAgICAgICAgICAgICAgICAgICAganVtcF94ID0gLTEwO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOW3plxuICAgICAgICAgICAgICAgICAgICBqdW1wX3ggPSAxMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkeSA9IHRoaXMubW92ZV9kdXJhdGlvbjtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzX2p1bXApIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5tb3ZlX2R1cmF0aW9uID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAvLyDkuIpcbiAgICAgICAgICAgICAgICAgICAganVtcF95ID0gLTEwO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOS4i1xuICAgICAgICAgICAgICAgICAgICBqdW1wX3kgPSAxMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pc19qdW1wKSB7XG4gICAgICAgICAgICB2YXIgbW92ZTEgPSBjYy5tb3ZlQnkodGhpcy5tb3ZlX3RpbWUsIC1keCArIGp1bXBfeCwgLWR5ICsganVtcF95KTtcbiAgICAgICAgICAgIHZhciBtb3ZlMiA9IGNjLm1vdmVCeSgwLjIsIC1qdW1wX3ggKiAyLCAtanVtcF95ICogMik7XG4gICAgICAgICAgICB2YXIgbW92ZTMgPSBjYy5tb3ZlQnkoMC4xLCBqdW1wX3gsIGp1bXBfeSk7XG4gICAgICAgICAgICB2YXIgc2VxID0gY2Muc2VxdWVuY2UoW21vdmUxLCBtb3ZlMiwgbW92ZTNdKTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24oc2VxKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBtb3ZlMSA9IGNjLm1vdmVCeSh0aGlzLm1vdmVfdGltZSwgLWR4LCAtZHkpO1xuICAgICAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihtb3ZlMSk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcbi8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4vLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4vLyB9LFxuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnYjFhN2ROTk5ZOU9HYkdiQ1JLb3p4VzAnLCAncGF0X2FjdGlvbicpO1xuLy8gc2NyaXB0c1xccGF0X2FjdGlvbi5qc1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIHBsYXlfb25sb2FkOiB0cnVlLFxuICAgICAgICBzdGFydF9zY2FsZTogMy41LFxuICAgICAgICBwbGF5X29ubG9hZF9kZWxheTogMCxcbiAgICAgICAgc3RhcnRfYWN0aXZlOiBmYWxzZVxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIGlmICh0aGlzLnN0YXJ0X2FjdGl2ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHRoaXMubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5ub2RlLm9wYWNpdHkgPSAwO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnBsYXlfb25sb2FkID09PSB0cnVlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wbGF5X29ubG9hZF9kZWxheSA8PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGxheSgpO1xuICAgICAgICAgICAgICAgIH0pLmJpbmQodGhpcyksIHRoaXMucGxheV9vbmxvYWRfZGVsYXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIHBsYXk6IGZ1bmN0aW9uIHBsYXkoKSB7XG4gICAgICAgIHRoaXMubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB0aGlzLm5vZGUuc2NhbGUgPSB0aGlzLnN0YXJ0X3NjYWxlO1xuICAgICAgICB0aGlzLm5vZGUub3BhY2l0eSA9IDA7XG4gICAgICAgIHZhciBzY2FsZTEgPSBjYy5zY2FsZVRvKDAuMywgMC44KTtcbiAgICAgICAgdmFyIHNjYWxlMiA9IGNjLnNjYWxlVG8oMC4yLCAxLjIpO1xuICAgICAgICB2YXIgc2NhbGUzID0gY2Muc2NhbGVUbygwLjEsIDEuMCk7XG4gICAgICAgIHZhciBzZXEgPSBjYy5zZXF1ZW5jZShbc2NhbGUxLCBzY2FsZTIsIHNjYWxlM10pO1xuICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKHNlcSk7XG4gICAgICAgIHZhciBmaW4gPSBjYy5mYWRlSW4oMC41KTtcbiAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihmaW4pO1xuICAgIH0sXG5cbiAgICBtb3ZlX2JhY2s6IGZ1bmN0aW9uIG1vdmVfYmFjaygpIHtcbiAgICAgICAgdGhpcy5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIC8vIHRoaXMubm9kZS5zY2FsZSA9IHRoaXMuc3RhcnRfc2NhbGU7XG4gICAgICAgIC8vIHRoaXMubm9kZS5vcGFjaXR5ID0gMDtcbiAgICAgICAgdmFyIHMyID0gY2Muc2NhbGVUbygwLjIsIDAuOCk7XG4gICAgICAgIHZhciBzMyA9IGNjLnNjYWxlVG8oMC4zLCB0aGlzLnN0YXJ0X3NjYWxlKTtcbiAgICAgICAgdmFyIHNlcSA9IGNjLnNlcXVlbmNlKFtzMiwgczNdKTtcbiAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihzZXEpO1xuICAgICAgICB2YXIgZm91dCA9IGNjLmZhZGVPdXQoMC41KTtcbiAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihmb3V0KTtcbiAgICB9XG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnNGY4OTJZS3JyUkwxcUVWNTJISmJaR0knLCAnc3RhcnRfc2NlbmUnKTtcbi8vIHNjcmlwdHNcXHN0YXJ0X3NjZW5lLmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICB9LFxuXG4gICAgYWRqdXN0X2FuY2hvcl93aXRoX2Rlc2lnbjogZnVuY3Rpb24gYWRqdXN0X2FuY2hvcl93aXRoX2Rlc2lnbigpIHtcbiAgICAgICAgdmFyIGFuY2hvcl9wb2ludCA9IGNjLmZpbmQoXCJVSV9ST09UL2FuY2hvci1sdFwiKTtcbiAgICAgICAgaWYgKGFuY2hvcl9wb2ludCkge1xuICAgICAgICAgICAgYW5jaG9yX3BvaW50LnggPSAtNDgwO1xuICAgICAgICAgICAgYW5jaG9yX3BvaW50LnkgPSAzNjA7XG4gICAgICAgIH1cblxuICAgICAgICBhbmNob3JfcG9pbnQgPSBjYy5maW5kKFwiVUlfUk9PVC9hbmNob3ItYm90dG9tXCIpO1xuICAgICAgICBpZiAoYW5jaG9yX3BvaW50KSB7XG4gICAgICAgICAgICBhbmNob3JfcG9pbnQueCA9IDA7XG4gICAgICAgICAgICBhbmNob3JfcG9pbnQueSA9IC0zNjA7XG4gICAgICAgIH1cblxuICAgICAgICBhbmNob3JfcG9pbnQgPSBjYy5maW5kKFwiVUlfUk9PVC9hbmNob3ItbGJcIik7XG4gICAgICAgIGlmIChhbmNob3JfcG9pbnQpIHtcbiAgICAgICAgICAgIGFuY2hvcl9wb2ludC54ID0gLTQ4MDtcbiAgICAgICAgICAgIGFuY2hvcl9wb2ludC55ID0gLTM2MDtcbiAgICAgICAgfVxuXG4gICAgICAgIGFuY2hvcl9wb2ludCA9IGNjLmZpbmQoXCJVSV9ST09UL2FuY2hvci1yYlwiKTtcbiAgICAgICAgaWYgKGFuY2hvcl9wb2ludCkge1xuICAgICAgICAgICAgYW5jaG9yX3BvaW50LnggPSA0ODA7XG4gICAgICAgICAgICBhbmNob3JfcG9pbnQueSA9IC0zNjA7XG4gICAgICAgIH1cblxuICAgICAgICBhbmNob3JfcG9pbnQgPSBjYy5maW5kKFwiVUlfUk9PVC9hbmNob3ItdG9wXCIpO1xuICAgICAgICBpZiAoYW5jaG9yX3BvaW50KSB7XG4gICAgICAgICAgICBhbmNob3JfcG9pbnQueCA9IDA7XG4gICAgICAgICAgICBhbmNob3JfcG9pbnQueSA9IDM2MDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBhZGp1c3RfYW5jaG9yOiBmdW5jdGlvbiBhZGp1c3RfYW5jaG9yKCkge1xuICAgICAgICB2YXIgd2luX3NpemUgPSBjYy5kaXJlY3Rvci5nZXRXaW5TaXplKCk7XG5cbiAgICAgICAgdmFyIGN4ID0gd2luX3NpemUud2lkdGggKiAwLjU7XG4gICAgICAgIHZhciBjeSA9IHdpbl9zaXplLmhlaWdodCAqIDAuNTtcblxuICAgICAgICB2YXIgYW5jaG9yX3BvaW50ID0gY2MuZmluZChcIlVJX1JPT1QvYW5jaG9yLWx0XCIpO1xuICAgICAgICBpZiAoYW5jaG9yX3BvaW50KSB7XG4gICAgICAgICAgICBhbmNob3JfcG9pbnQueCA9IC1jeDtcbiAgICAgICAgICAgIGFuY2hvcl9wb2ludC55ID0gY3k7XG4gICAgICAgIH1cblxuICAgICAgICBhbmNob3JfcG9pbnQgPSBjYy5maW5kKFwiVUlfUk9PVC9hbmNob3ItYm90dG9tXCIpO1xuICAgICAgICBpZiAoYW5jaG9yX3BvaW50KSB7XG4gICAgICAgICAgICBhbmNob3JfcG9pbnQueCA9IDA7XG4gICAgICAgICAgICBhbmNob3JfcG9pbnQueSA9IC1jeTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFuY2hvcl9wb2ludCA9IGNjLmZpbmQoXCJVSV9ST09UL2FuY2hvci1sYlwiKTtcbiAgICAgICAgaWYgKGFuY2hvcl9wb2ludCkge1xuICAgICAgICAgICAgYW5jaG9yX3BvaW50LnggPSAtY3g7XG4gICAgICAgICAgICBhbmNob3JfcG9pbnQueSA9IC1jeTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFuY2hvcl9wb2ludCA9IGNjLmZpbmQoXCJVSV9ST09UL2FuY2hvci1yYlwiKTtcbiAgICAgICAgaWYgKGFuY2hvcl9wb2ludCkge1xuICAgICAgICAgICAgYW5jaG9yX3BvaW50LnggPSBjeDtcbiAgICAgICAgICAgIGFuY2hvcl9wb2ludC55ID0gLWN5O1xuICAgICAgICB9XG5cbiAgICAgICAgYW5jaG9yX3BvaW50ID0gY2MuZmluZChcIlVJX1JPT1QvYW5jaG9yLXRvcFwiKTtcbiAgICAgICAgaWYgKGFuY2hvcl9wb2ludCkge1xuICAgICAgICAgICAgYW5jaG9yX3BvaW50LnggPSAwO1xuICAgICAgICAgICAgYW5jaG9yX3BvaW50LnkgPSBjeTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBhZGp1c3Rfd2luZG93OiBmdW5jdGlvbiBhZGp1c3Rfd2luZG93KHdpbl9zaXplKSB7XG4gICAgICAgIHZhciBkZXNpZ25fNF8zID0gZmFsc2U7XG4gICAgICAgIGlmICgxMDI0ICogd2luX3NpemUuaGVpZ2h0ID4gNzY4ICogd2luX3NpemUud2lkdGgpIHtcbiAgICAgICAgICAgIHRoaXMuYWRqdXN0X2FuY2hvcl93aXRoX2Rlc2lnbigpO1xuICAgICAgICAgICAgZGVzaWduXzRfMyA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmFkanVzdF9hbmNob3IoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBzdGFydDogZnVuY3Rpb24gc3RhcnQoKSB7XG4gICAgICAgIHZhciB3aW5fc2l6ZSA9IGNjLmRpcmVjdG9yLmdldFdpblNpemUoKTtcbiAgICAgICAgdGhpcy5wcmV2X3NpemUgPSB3aW5fc2l6ZTtcbiAgICAgICAgdGhpcy5hZGp1c3Rfd2luZG93KHdpbl9zaXplKTtcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG5cbiAgICAgICAgdmFyIHVybCA9IGNjLnVybC5yYXcoXCJyZXNvdXJjZXMvc291bmRzL2xlYXN0Lm1wM1wiKTtcbiAgICAgICAgY2MubG9hZGVyLmxvYWRSZXModXJsLCBmdW5jdGlvbiAoKSB7fSk7XG4gICAgICAgIHVybCA9IGNjLnVybC5yYXcoXCJyZXNvdXJjZXMvc291bmRzL21vc3QubXAzXCIpO1xuICAgICAgICBjYy5sb2FkZXIubG9hZFJlcyh1cmwsIGZ1bmN0aW9uICgpIHt9KTtcblxuICAgICAgICB1cmwgPSBjYy51cmwucmF3KFwicmVzb3VyY2VzL3NvdW5kcy9idXR0b24ubXAzXCIpO1xuICAgICAgICBjYy5sb2FkZXIubG9hZFJlcyh1cmwsIGZ1bmN0aW9uICgpIHt9KTtcbiAgICAgICAgdXJsID0gY2MudXJsLnJhdyhcInJlc291cmNlcy9zb3VuZHMvZW5kLm1wM1wiKTtcbiAgICAgICAgY2MubG9hZGVyLmxvYWRSZXModXJsLCBmdW5jdGlvbiAoKSB7fSk7XG5cbiAgICAgICAgdXJsID0gY2MudXJsLnJhdyhcInJlc291cmNlcy9zb3VuZHMvY2hfcmlnaHQubXAzXCIpO1xuICAgICAgICBjYy5sb2FkZXIubG9hZFJlcyh1cmwsIGZ1bmN0aW9uICgpIHt9KTtcblxuICAgICAgICB1cmwgPSBjYy51cmwucmF3KFwicmVzb3VyY2VzL3NvdW5kcy9ja19lcnJvci5tcDNcIik7XG4gICAgICAgIGNjLmxvYWRlci5sb2FkUmVzKHVybCwgZnVuY3Rpb24gKCkge30pO1xuXG4gICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgY2F0X2NvbSA9IGNjLmZpbmQoXCJVSV9ST09UL2FuY2hvci1jZW50ZXIvY2F0XCIpLmdldENvbXBvbmVudChzcC5Ta2VsZXRvbik7XG4gICAgICAgICAgICBjYXRfY29tLmNsZWFyVHJhY2tzKCk7XG4gICAgICAgICAgICBjYXRfY29tLnNldEFuaW1hdGlvbigwLCBcImlkbGVfMlwiLCB0cnVlKTtcbiAgICAgICAgfSkuYmluZCh0aGlzKSwgMC44KTtcbiAgICAgICAgdGhpcy5zdGFydGVkID0gZmFsc2U7XG4gICAgfSxcblxuICAgIG9uX2dhbWVfc3RhcnRfY2xpY2s6IGZ1bmN0aW9uIG9uX2dhbWVfc3RhcnRfY2xpY2soKSB7XG4gICAgICAgIGlmICh0aGlzLnN0YXJ0ZWQgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3RhcnRlZCA9IHRydWU7XG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnN0b3BNdXNpYyhmYWxzZSk7XG4gICAgICAgIHZhciB1cmwgPSBjYy51cmwucmF3KFwicmVzb3VyY2VzL3NvdW5kcy9idXR0b24ubXAzXCIpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyh1cmwpO1xuICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5TXVzaWModXJsLCBmYWxzZSk7XG5cbiAgICAgICAgdmFyIG1vdmVfY29tID0gY2MuZmluZChcIlVJX1JPT1QvYW5jaG9yLWNlbnRlci9sb2dvXCIpLmdldENvbXBvbmVudChcIm1vdmVfYWN0aW9uXCIpO1xuICAgICAgICB2YXIgcGF0X2NvbSA9IGNjLmZpbmQoXCJVSV9ST09UL2FuY2hvci1jZW50ZXIvY2xpY2tfbm9kZVwiKS5nZXRDb21wb25lbnQoXCJwYXRfYWN0aW9uXCIpO1xuXG4gICAgICAgIG1vdmVfY29tLm1vdmVfYmFjaygpO1xuICAgICAgICBwYXRfY29tLm1vdmVfYmFjaygpO1xuXG4gICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcImdhbWVfc2NlbmVcIik7XG4gICAgICAgIH0sIDAuNik7XG4gICAgfSxcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG4gICAgICAgIHZhciB3aW5fc2l6ZSA9IGNjLmRpcmVjdG9yLmdldFdpblNpemUoKTtcbiAgICAgICAgaWYgKHdpbl9zaXplLndpZHRoICE9IHRoaXMucHJldl9zaXplLndpZHRoIHx8IHdpbl9zaXplLmhlaWdodCAhPSB0aGlzLnByZXZfc2l6ZS5oZWlnaHQpIHtcbiAgICAgICAgICAgIHRoaXMucHJldl9zaXplID0gd2luX3NpemU7XG4gICAgICAgICAgICB0aGlzLmFkanVzdF93aW5kb3cod2luX3NpemUpO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyJdfQ==
