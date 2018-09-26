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
        this.sprite_com.spriteFrame = anim_set[0].clone();
        this.node.scale = 0.2 * card_value;
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
        this.block_levels = [this.anim_blocks_2x3];
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

    gen_anim_when_start: function gen_anim_when_start(anim_array) {
        var time = 0.1;
        var delta = 0.3;
        if (this.game_level >= 2) {
            delta = 0.1;
        }

        for (var i = 0; i < this.flip_blocks.length; i++) {
            this.flip_blocks[i].scaleX = 0;
            this.flip_blocks[i].scaleY = 0;
            var delay = cc.delayTime(time);
            var s = cc.scaleTo(delta, anim_array[i] * 0.2 + 0.1);
            var s2 = cc.scaleTo(0.1, anim_array[i] * 0.2);
            var seq = cc.sequence([delay, s, s2]);
            this.flip_blocks[i].runAction(seq);
            time = time + delta;
        }
        return time;
    },

    gen_level0_map_data: function gen_level0_map_data() {
        /*var map = [3, 2, 1];
        var anim_type = [0, 1, 2, 3];
        anim_type.sort(function() {
            return Math.random() - 0.5;
        });
        
        
        this.min_anim_type = anim_type[2];
        this.max_anim_type = anim_type[0];
        
        var anim_array = [];
        for (var i = 0; i < map.length; i ++) {
            for(var j = 0; j < map[i]; j ++) {
                anim_array.push(anim_type[i]);
            }    
        }*/

        var anim_array = [2, 3, 4, 5, 7];
        anim_array.sort(function () {
            return Math.random() - 0.5;
        });

        this.min_anim_type = 2;
        this.max_anim_type = 7;

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
        if (this.game_level >= 5) {
            return;
        }

        this.checkout_root.active = false;

        this.question_node.stopAllActions();
        this.question_node.active = false;

        this.game_start = true;

        for (var index = 0; index < this.level_root.length; index++) {
            this.level_root[index].active = false;
        }
        this.level_root[0].active = true;
        this.flip_blocks = this.block_levels[0];

        var map;
        var anim_array;

        this.anim_sf_set.sort(function () {
            return Math.random() - 0.5;
        });

        if (this.game_level === 0) {
            anim_array = this.gen_level0_map_data();
        } else if (this.game_level === 1) {
            anim_array = this.gen_level0_map_data();
        } else if (this.game_level === 2) {
            anim_array = this.gen_level0_map_data();
        } else if (this.game_level === 3) {
            anim_array = this.gen_level0_map_data();
        } else if (this.game_level === 4) {
            // anim_array = this.gen_level4_map_data();
            anim_array = this.gen_level0_map_data();
        }

        this.gen_game_data(anim_array);
        var time = this.gen_anim_when_start(anim_array);
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
        for (var index = 0; index < this.flip_blocks.length; index++) {
            var block_comp = this.flip_blocks[index].getComponent("flip_block");
            if (block_comp.card_value == card_value) {
                var s_max = cc.scaleTo(0.4, this.flip_blocks[index].scale + 0.2);
                var s_bk = cc.scaleTo(0.2, this.flip_blocks[index].scale);
                var seq = cc.sequence([s_max, s_bk]);
                this.flip_blocks[index].runAction(seq);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkY6L3NvZnR3YXJlcy9Db2Nvc0NyZWF0b3JfMV8wXzEvcmVzb3VyY2VzL2FwcC5hc2FyL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvc2NyaXB0cy9mbGlwX2Jsb2NrLmpzIiwiYXNzZXRzL3NjcmlwdHMvZnJhbWVfYW5pbV9zZWNvbmQuanMiLCJhc3NldHMvc2NyaXB0cy9mcmFtZV9hbmltLmpzIiwiYXNzZXRzL3NjcmlwdHMvZ2FtZV9zY2VuZS5qcyIsImFzc2V0cy9zY3JpcHRzL2xvb3BfbW92ZV9hY3Rpb24uanMiLCJhc3NldHMvc2NyaXB0cy9tb3ZlX2FjdGlvbi5qcyIsImFzc2V0cy9zY3JpcHRzL3BhdF9hY3Rpb24uanMiLCJhc3NldHMvc2NyaXB0cy9zdGFydF9zY2VuZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc4YmViM1ZEM2tGTlZLR0VoeUpDK2M5UicsICdmbGlwX2Jsb2NrJyk7XG4vLyBzY3JpcHRzXFxmbGlwX2Jsb2NrLmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgaW5kZXg6IDBcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuc3ByaXRlX2NvbSA9IHRoaXMubm9kZS5nZXRDb21wb25lbnQoY2MuU3ByaXRlKTtcblxuICAgICAgICB0aGlzLmZsaXBlZCA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuZ2FtZV9zY2VuZV9jb21wID0gY2MuZmluZChcIlVJX1JPT1RcIikuZ2V0Q29tcG9uZW50KFwiZ2FtZV9zY2VuZVwiKTtcblxuICAgICAgICB0aGlzLm5vZGUub24oJ3RvdWNoc3RhcnQnLCAoZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgYm91bmRfYm94ID0gdGhpcy5ub2RlLmdldEJvdW5kaW5nQm94KCk7XG4gICAgICAgICAgICB2YXIgcG9zID0gdGhpcy5ub2RlLmdldFBhcmVudCgpLmNvbnZlcnRUb3VjaFRvTm9kZVNwYWNlKGV2ZW50KTtcbiAgICAgICAgICAgIGlmICh0aGlzLmZsaXBlZCA9PT0gZmFsc2UgJiYgYm91bmRfYm94LmNvbnRhaW5zKHBvcykpIHtcbiAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWVfc2NlbmVfY29tcC5vbl9jYXJkX2ZsaXAodGhpcywgdGhpcy5jYXJkX3ZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkuYmluZCh0aGlzKSk7XG4gICAgfSxcblxuICAgIGZsaXBfdG9fYmFjazogZnVuY3Rpb24gZmxpcF90b19iYWNrKCkge1xuICAgICAgICB2YXIgcyA9IGNjLnNjYWxlVG8oMC4xLCAwLCAxKTtcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gY2MuY2FsbEZ1bmMoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuc3ByaXRlX2NvbS5zcHJpdGVGcmFtZSA9IHRoaXMuYmtfc2YuY2xvbmUoKTtcbiAgICAgICAgfSkuYmluZCh0aGlzKSwgdGhpcyk7XG4gICAgICAgIHZhciBzMiA9IGNjLnNjYWxlVG8oMC4xLCAxLCAxKTtcbiAgICAgICAgdmFyIGNhbGxiYWNrMiA9IGNjLmNhbGxGdW5jKChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmZsaXBlZCA9IGZhbHNlO1xuICAgICAgICB9KS5iaW5kKHRoaXMpLCB0aGlzKTtcblxuICAgICAgICB2YXIgc2VxID0gY2Muc2VxdWVuY2UoW3MsIGNhbGxiYWNrLCBzMiwgY2FsbGJhY2syXSk7XG4gICAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24oc2VxKTtcbiAgICB9LFxuXG4gICAgZmxpcF90b19iYWNrX3dpdGhfdmFsdWU6IGZ1bmN0aW9uIGZsaXBfdG9fYmFja193aXRoX3ZhbHVlKGNhcmRfdmFsdWUpIHtcbiAgICAgICAgdGhpcy5jYXJkX3ZhbHVlID0gY2FyZF92YWx1ZTtcbiAgICAgICAgLy8gdGhpcy5zcHJpdGVfY29tLnNwcml0ZUZyYW1lID0gdGhpcy5hbmltX3NmX3NldFtjYXJkX3ZhbHVlXS5jbG9uZSgpO1xuICAgICAgICB2YXIgYW5pbV9zZXQgPSB0aGlzLmdhbWVfc2NlbmVfY29tcC5nZXRfYW5pbV9zZXQoKTtcbiAgICAgICAgdGhpcy5zcHJpdGVfY29tLnNwcml0ZUZyYW1lID0gYW5pbV9zZXRbMF0uY2xvbmUoKTtcbiAgICAgICAgdGhpcy5ub2RlLnNjYWxlID0gMC4yICogY2FyZF92YWx1ZTtcbiAgICAgICAgdGhpcy5mbGlwZWQgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgZmxpcF90b192YWx1ZTogZnVuY3Rpb24gZmxpcF90b192YWx1ZSgpIHtcbiAgICAgICAgdmFyIHMgPSBjYy5zY2FsZVRvKDAuMSwgMCwgMSk7XG5cbiAgICAgICAgdmFyIGNhbGxiYWNrID0gY2MuY2FsbEZ1bmMoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciB1cmwgPSBjYy51cmwucmF3KFwicmVzb3VyY2VzL2dhbWVfc2NlbmUvY2FyZF9cIiArIHRoaXMuY2FyZF92YWx1ZSArIFwiLnBuZ1wiKTtcbiAgICAgICAgICAgIHZhciBzZiA9IG5ldyBjYy5TcHJpdGVGcmFtZSh1cmwpO1xuICAgICAgICAgICAgdGhpcy5zcHJpdGVfY29tLnNwcml0ZUZyYW1lID0gc2Y7XG4gICAgICAgIH0pLmJpbmQodGhpcyksIHRoaXMpO1xuXG4gICAgICAgIHZhciBzMiA9IGNjLnNjYWxlVG8oMC4xLCAxLCAxKTtcblxuICAgICAgICB2YXIgY2FsbGJhY2syID0gY2MuY2FsbEZ1bmMoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuZmxpcGVkID0gdHJ1ZTtcbiAgICAgICAgfSkuYmluZCh0aGlzKSwgdGhpcyk7XG5cbiAgICAgICAgdmFyIHNlcSA9IGNjLnNlcXVlbmNlKFtzLCBjYWxsYmFjaywgczIsIGNhbGxiYWNrMl0pO1xuICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKHNlcSk7XG4gICAgfSxcblxuICAgIGdldF9jYXJkX3ZhbHVlOiBmdW5jdGlvbiBnZXRfY2FyZF92YWx1ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FyZF92YWx1ZTtcbiAgICB9LFxuXG4gICAgZ2V0X3NlYXQ6IGZ1bmN0aW9uIGdldF9zZWF0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pbmRleDtcbiAgICB9XG59KTtcbi8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4vLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4vLyB9LFxuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnNDc5YzZyR0FDWkZCSXlMOUQ2WjVRbU0nLCAnZnJhbWVfYW5pbV9zZWNvbmQnKTtcbi8vIHNjcmlwdHNcXGZyYW1lX2FuaW1fc2Vjb25kLmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cblxuICAgICAgICBmcmFtZV9zcHJpdGU6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBbXSxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZUZyYW1lXG4gICAgICAgIH0sXG4gICAgICAgIGZyYW1lX2R1cmF0aW9uOiAwLFxuICAgICAgICBsb29wOiBmYWxzZSxcbiAgICAgICAgcGxheV9vbl9sb2FkOiBmYWxzZSxcbiAgICAgICAgcGxheV9vbl9sb2FkX3dpdGhfcmFuZG9tX3RpbWU6IGZhbHNlLFxuICAgICAgICByYW5kb21fdGltZV9zY2FsZTogZmFsc2UsXG4gICAgICAgIHJhbmRvbV9kZWxheV90b19wbGF5OiBmYWxzZVxuICAgIH0sXG5cbiAgICBjYWxsX2xhdHRlcjogZnVuY3Rpb24gY2FsbF9sYXR0ZXIoY2FsbGZ1bmMsIGRlbGF5KSB7XG4gICAgICAgIHZhciBkZWxheV9hY3Rpb24gPSBjYy5kZWxheVRpbWUoZGVsYXkpO1xuICAgICAgICB2YXIgY2FsbF9hY3Rpb24gPSBjYy5jYWxsRnVuYyhjYWxsZnVuYywgdGhpcyk7XG4gICAgICAgIHZhciBzZXEgPSBjYy5zZXF1ZW5jZShbZGVsYXlfYWN0aW9uLCBjYWxsX2FjdGlvbl0pO1xuICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKHNlcSk7XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLmZyYW1lc19zcCA9IHRoaXMuZnJhbWVfc3ByaXRlO1xuICAgICAgICB0aGlzLmZyYW1lX2NvdW50ID0gdGhpcy5mcmFtZV9zcHJpdGUubGVuZ3RoO1xuXG4gICAgICAgIC8qXHJcbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHRoaXMuZnJhbWVfY291bnQ7IGkgKyspIHtcclxuICAgICAgICAgICAgdmFyIHVybCA9IGNjLnVybC5yYXcodGhpcy5uYW1lX3ByZWZpeCArICh0aGlzLm5hbWVfYmVnaW5faW5kZXggKyBpKSArIFwiLnBuZ1wiKTtcclxuICAgICAgICAgICAgdmFyIHNwID0gbmV3IGNjLlNwcml0ZUZyYW1lKHVybCk7XHJcbiAgICAgICAgICAgIHRoaXMuZnJhbWVzX3NwLnB1c2goc3ApO1xyXG4gICAgICAgIH0qL1xuXG4gICAgICAgIHRoaXMuc3BfY29tcCA9IHRoaXMubm9kZS5nZXRDb21wb25lbnQoY2MuU3ByaXRlKTtcbiAgICAgICAgaWYgKCF0aGlzLnNwX2NvbXApIHtcbiAgICAgICAgICAgIHRoaXMuc3BfY29tcCA9IHRoaXMubm9kZS5hZGRDb21wb25lbnQoY2MuU3ByaXRlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNwX2NvbXAuc3ByaXRlRnJhbWUgPSB0aGlzLmZyYW1lc19zcFswXS5jbG9uZSgpO1xuXG4gICAgICAgIHRoaXMubm93X2luZGV4ID0gMDtcbiAgICAgICAgdGhpcy5wYXNzX3RpbWUgPSAwO1xuICAgICAgICB0aGlzLmFuaW1fZW5kZWQgPSB0cnVlO1xuICAgICAgICBpZiAodGhpcy5wbGF5X29uX2xvYWQpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnBsYXlfb25fbG9hZF93aXRoX3JhbmRvbV90aW1lKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRpbWUgPSAwLjAxICsgTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbGxfbGF0dGVyKChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYW5pbV9lbmRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0pLmJpbmQodGhpcyksIHRpbWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFuaW1fZW5kZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnJhbmRvbV90aW1lX3NjYWxlKSB7XG4gICAgICAgICAgICB2YXIgdF9zID0gMS4wICsgMC41ICogTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgIHRoaXMuZnJhbWVfZHVyYXRpb24gKj0gdF9zO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYW5pbV9lbmRfZnVuYyA9IG51bGw7XG5cbiAgICAgICAgaWYgKHRoaXMucmFuZG9tX2RlbGF5X3RvX3BsYXkpIHtcbiAgICAgICAgICAgIHRoaXMucGxheV9yYW5kb21fZGVsYXkoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBwbGF5X3JhbmRvbV9kZWxheTogZnVuY3Rpb24gcGxheV9yYW5kb21fZGVsYXkoKSB7XG4gICAgICAgIGlmICghdGhpcy5yYW5kb21fZGVsYXlfdG9fcGxheSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5wbGF5KChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgdGltZSA9IDAuMSArIE1hdGgucmFuZG9tKCkgKiAyO1xuICAgICAgICAgICAgdGhpcy5jYWxsX2xhdHRlcih0aGlzLnBsYXlfcmFuZG9tX2RlbGF5LmJpbmQodGhpcyksIHRpbWUpO1xuICAgICAgICB9KS5iaW5kKHRoaXMpKTtcbiAgICB9LFxuXG4gICAgc3RhcnQ6IGZ1bmN0aW9uIHN0YXJ0KCkge1xuICAgICAgICB0aGlzLnBhc3NfdGltZSA9IDA7XG4gICAgfSxcblxuICAgIHBsYXk6IGZ1bmN0aW9uIHBsYXkoZnVuYykge1xuICAgICAgICB0aGlzLnBhc3NfdGltZSA9IDA7XG4gICAgICAgIHRoaXMuYW5pbV9lbmRlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmFuaW1fZW5kX2Z1bmMgPSBmdW5jO1xuICAgICAgICB0aGlzLmxvb3AgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgcGxheV9sb29wOiBmdW5jdGlvbiBwbGF5X2xvb3AoKSB7XG4gICAgICAgIHRoaXMubG9vcCA9IHRydWU7XG4gICAgICAgIHRoaXMucGFzc190aW1lID0gMDtcbiAgICAgICAgdGhpcy5hbmltX2VuZGVkID0gZmFsc2U7XG4gICAgfSxcblxuICAgIHN0b3BfYW5pbTogZnVuY3Rpb24gc3RvcF9hbmltKCkge1xuICAgICAgICB0aGlzLmFuaW1fZW5kZWQgPSB0cnVlO1xuICAgIH0sXG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG4gICAgICAgIGlmICh0aGlzLmFuaW1fZW5kZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBhc3NfdGltZSArPSBkdDtcbiAgICAgICAgdmFyIGluZGV4ID0gTWF0aC5mbG9vcih0aGlzLnBhc3NfdGltZSAvIHRoaXMuZnJhbWVfZHVyYXRpb24pO1xuXG4gICAgICAgIGlmICh0aGlzLmxvb3ApIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm5vd19pbmRleCAhPSBpbmRleCkge1xuICAgICAgICAgICAgICAgIGlmIChpbmRleCA+PSB0aGlzLmZyYW1lX2NvdW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFzc190aW1lID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zcF9jb21wLnNwcml0ZUZyYW1lID0gdGhpcy5mcmFtZXNfc3BbMF0uY2xvbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub3dfaW5kZXggPSAwO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3BfY29tcC5zcHJpdGVGcmFtZSA9IHRoaXMuZnJhbWVzX3NwW2luZGV4XS5jbG9uZSgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vd19pbmRleCA9IGluZGV4O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm5vd19pbmRleCAhPSBpbmRleCkge1xuICAgICAgICAgICAgICAgIGlmIChpbmRleCA+PSB0aGlzLmZyYW1lX2NvdW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYW5pbV9lbmRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmFuaW1fZW5kX2Z1bmMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYW5pbV9lbmRfZnVuYygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub3dfaW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zcF9jb21wLnNwcml0ZUZyYW1lID0gdGhpcy5mcmFtZXNfc3BbaW5kZXhdLmNsb25lKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc5YmQxYUdvZUZWQTBJeUtIQTdiR0d0VCcsICdmcmFtZV9hbmltJyk7XG4vLyBzY3JpcHRzXFxmcmFtZV9hbmltLmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cblxuICAgICAgICBuYW1lX3ByZWZpeDoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IFwibmFtZV9wYXRoX3ByZWZpeFwiLFxuICAgICAgICAgICAgdHlwZTogU3RyaW5nXG4gICAgICAgIH0sXG4gICAgICAgIG5hbWVfYmVnaW5faW5kZXg6IDAsXG4gICAgICAgIGZyYW1lX2NvdW50OiAwLFxuICAgICAgICBmcmFtZV9kdXJhdGlvbjogMCxcbiAgICAgICAgbG9vcDogZmFsc2UsXG4gICAgICAgIHBsYXlfb25fbG9hZDogZmFsc2VcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuZnJhbWVzX3NwID0gW107XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmZyYW1lX2NvdW50OyBpKyspIHtcbiAgICAgICAgICAgIHZhciB1cmwgPSBjYy51cmwucmF3KHRoaXMubmFtZV9wcmVmaXggKyAodGhpcy5uYW1lX2JlZ2luX2luZGV4ICsgaSkgKyBcIi5wbmdcIik7XG4gICAgICAgICAgICB2YXIgc3AgPSBuZXcgY2MuU3ByaXRlRnJhbWUodXJsKTtcbiAgICAgICAgICAgIHRoaXMuZnJhbWVzX3NwLnB1c2goc3ApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zcF9jb21wID0gdGhpcy5ub2RlLmdldENvbXBvbmVudChjYy5TcHJpdGUpO1xuICAgICAgICBpZiAoIXRoaXMuc3BfY29tcCkge1xuICAgICAgICAgICAgdGhpcy5zcF9jb21wID0gdGhpcy5ub2RlLmFkZENvbXBvbmVudChjYy5TcHJpdGUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3BfY29tcC5zcHJpdGVGcmFtZSA9IHRoaXMuZnJhbWVzX3NwWzBdLmNsb25lKCk7XG5cbiAgICAgICAgdGhpcy5ub3dfaW5kZXggPSAwO1xuICAgICAgICB0aGlzLnBhc3NfdGltZSA9IDA7XG4gICAgICAgIHRoaXMuYW5pbV9lbmRlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmFuaW1fZW5kZWQgPSAhdGhpcy5wbGF5X29uX2xvYWQ7XG5cbiAgICAgICAgdGhpcy5hbmltX2VuZF9mdW5jID0gbnVsbDtcbiAgICB9LFxuXG4gICAgc3RhcnQ6IGZ1bmN0aW9uIHN0YXJ0KCkge1xuICAgICAgICB0aGlzLnBhc3NfdGltZSA9IDA7XG4gICAgfSxcblxuICAgIHBsYXk6IGZ1bmN0aW9uIHBsYXkoZnVuYykge1xuICAgICAgICB0aGlzLnBhc3NfdGltZSA9IDA7XG4gICAgICAgIHRoaXMuYW5pbV9lbmRlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmFuaW1fZW5kX2Z1bmMgPSBmdW5jO1xuICAgICAgICB0aGlzLnNwX2NvbXAuc3ByaXRlRnJhbWUgPSB0aGlzLmZyYW1lc19zcFswXS5jbG9uZSgpO1xuICAgIH0sXG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG4gICAgICAgIGlmICh0aGlzLmFuaW1fZW5kZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBhc3NfdGltZSArPSBkdDtcbiAgICAgICAgdmFyIGluZGV4ID0gTWF0aC5mbG9vcih0aGlzLnBhc3NfdGltZSAvIHRoaXMuZnJhbWVfZHVyYXRpb24pO1xuXG4gICAgICAgIGlmICh0aGlzLmxvb3ApIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm5vd19pbmRleCAhPSBpbmRleCkge1xuICAgICAgICAgICAgICAgIGlmIChpbmRleCA+PSB0aGlzLmZyYW1lX2NvdW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFzc190aW1lID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zcF9jb21wLnNwcml0ZUZyYW1lID0gdGhpcy5mcmFtZXNfc3BbMF0uY2xvbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub3dfaW5kZXggPSAwO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3BfY29tcC5zcHJpdGVGcmFtZSA9IHRoaXMuZnJhbWVzX3NwW2luZGV4XS5jbG9uZSgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vd19pbmRleCA9IGluZGV4O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm5vd19pbmRleCAhPSBpbmRleCkge1xuICAgICAgICAgICAgICAgIGlmIChpbmRleCA+PSB0aGlzLmZyYW1lX2NvdW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYW5pbV9lbmRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmFuaW1fZW5kX2Z1bmMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYW5pbV9lbmRfZnVuYygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub3dfaW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zcF9jb21wLnNwcml0ZUZyYW1lID0gdGhpcy5mcmFtZXNfc3BbaW5kZXhdLmNsb25lKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICcwNjQwMVpITGc5Qjg1bHpITGkwNk83SicsICdnYW1lX3NjZW5lJyk7XG4vLyBzY3JpcHRzXFxnYW1lX3NjZW5lLmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgbGV2ZWxfcm9vdDoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IFtdLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9LFxuXG4gICAgICAgIGFuaW1fYmxvY2tzXzJ4Mzoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IFtdLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9LFxuICAgICAgICBhbmltX2Jsb2Nrc18zeDM6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBbXSxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfSxcbiAgICAgICAgYW5pbV9ibG9ja3NfM3g0OiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogW10sXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH0sXG5cbiAgICAgICAgYW5pbV9ibG9ja3NfNHg0OiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogW10sXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH0sXG5cbiAgICAgICAgYW5pbV9ibG9ja3NfNXg0OiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogW10sXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH0sXG5cbiAgICAgICAgYW5pbV9xdWVzX3g6IDAsXG4gICAgICAgIGFuaW1fcXVlc195OiAwLFxuICAgICAgICBhbmltX3N0YXJ0X3NjYWxlOiAwLFxuICAgICAgICBhbmltX3F1ZXNfZF94OiAtNTMsXG4gICAgICAgIGFuaW1fcXVlc19kX3k6IDMwMCxcbiAgICAgICAgcXVlc3Rpb25fbW92ZV90aW1lOiAwLjEsXG4gICAgICAgIHF1ZXN0aW9uX3NjYWxlX3RpbWU6IDAuMSxcbiAgICAgICAgcXVlc3Rpb25fZmFkZW91dF90aW1lOiAwLjQsXG4gICAgICAgIHF1ZXN0aW9uX3N0YXlfdGltZTogMC41XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLmJsb2NrX2xldmVscyA9IFt0aGlzLmFuaW1fYmxvY2tzXzJ4M107XG4gICAgICAgIHRoaXMuZ2FtZV9sZXZlbCA9IDA7XG4gICAgICAgIHRoaXMuY2hlY2tvdXRfcm9vdCA9IGNjLmZpbmQoXCJVSV9ST09UL2NoZWNrb3V0X3Jvb3RcIik7XG4gICAgICAgIHRoaXMuY2tfbG9nb19yb290ID0gY2MuZmluZChcIlVJX1JPT1QvY2hlY2tvdXRfcm9vdC9sb2dvX3Jvb3RcIik7XG4gICAgICAgIHRoaXMuY2tfcmVwbGF5X2J1dHRvbiA9IGNjLmZpbmQoXCJVSV9ST09UL2NoZWNrb3V0X3Jvb3QvcmVwbGF5X2J1dHRvblwiKTtcbiAgICAgICAgdGhpcy5za2Vfa2ltX2NvbSA9IGNjLmZpbmQoXCJVSV9ST09UL2FuY2hvci1iYWNrZ3JvdW5kL2tpbVwiKS5nZXRDb21wb25lbnQoc3AuU2tlbGV0b24pO1xuICAgICAgICB0aGlzLmxvY2tfa2ltX2NsaWNrID0gdHJ1ZTtcblxuICAgICAgICB2YXIgdXJsID0gY2MudXJsLnJhdyhcInJlc291cmNlcy9nYW1lX3NjZW5lL2xlYXN0LnBuZ1wiKTtcbiAgICAgICAgdGhpcy5xdWVzdGlvbl9sZWFzdCA9IG5ldyBjYy5TcHJpdGVGcmFtZSh1cmwpO1xuICAgICAgICB1cmwgPSBjYy51cmwucmF3KFwicmVzb3VyY2VzL2dhbWVfc2NlbmUvbW9zdC5wbmdcIik7XG4gICAgICAgIHRoaXMucXVlc3Rpb25fbW9zdCA9IG5ldyBjYy5TcHJpdGVGcmFtZSh1cmwpO1xuICAgICAgICB0aGlzLnF1ZXN0aW9uX25vZGUgPSBjYy5maW5kKFwiVUlfUk9PVC9hbmNob3ItYmFja2dyb3VuZC9xdWVzdGlvblwiKTtcbiAgICAgICAgdGhpcy5xdWVzdGlvbl9ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuYW5pbV9zZl9zZXQgPSBbXTtcblxuICAgICAgICB1cmwgPSBjYy51cmwucmF3KFwicmVzb3VyY2VzL2dhbWVfc2NlbmUvYW5pbWFsXzAucG5nXCIpO1xuICAgICAgICB2YXIgc2YgPSBuZXcgY2MuU3ByaXRlRnJhbWUodXJsKTtcbiAgICAgICAgdGhpcy5hbmltX3NmX3NldC5wdXNoKHNmKTtcblxuICAgICAgICB1cmwgPSBjYy51cmwucmF3KFwicmVzb3VyY2VzL2dhbWVfc2NlbmUvYW5pbWFsXzEucG5nXCIpO1xuICAgICAgICBzZiA9IG5ldyBjYy5TcHJpdGVGcmFtZSh1cmwpO1xuICAgICAgICB0aGlzLmFuaW1fc2Zfc2V0LnB1c2goc2YpO1xuXG4gICAgICAgIHVybCA9IGNjLnVybC5yYXcoXCJyZXNvdXJjZXMvZ2FtZV9zY2VuZS9hbmltYWxfMi5wbmdcIik7XG4gICAgICAgIHNmID0gbmV3IGNjLlNwcml0ZUZyYW1lKHVybCk7XG4gICAgICAgIHRoaXMuYW5pbV9zZl9zZXQucHVzaChzZik7XG5cbiAgICAgICAgdXJsID0gY2MudXJsLnJhdyhcInJlc291cmNlcy9nYW1lX3NjZW5lL2FuaW1hbF8zLnBuZ1wiKTtcbiAgICAgICAgc2YgPSBuZXcgY2MuU3ByaXRlRnJhbWUodXJsKTtcbiAgICAgICAgdGhpcy5hbmltX3NmX3NldC5wdXNoKHNmKTtcblxuICAgICAgICB1cmwgPSBjYy51cmwucmF3KFwicmVzb3VyY2VzL2dhbWVfc2NlbmUvYW5pbWFsXzQucG5nXCIpO1xuICAgICAgICBzZiA9IG5ldyBjYy5TcHJpdGVGcmFtZSh1cmwpO1xuICAgICAgICB0aGlzLmFuaW1fc2Zfc2V0LnB1c2goc2YpO1xuXG4gICAgICAgIHVybCA9IGNjLnVybC5yYXcoXCJyZXNvdXJjZXMvZ2FtZV9zY2VuZS9hbmltYWxfNS5wbmdcIik7XG4gICAgICAgIHNmID0gbmV3IGNjLlNwcml0ZUZyYW1lKHVybCk7XG4gICAgICAgIHRoaXMuYW5pbV9zZl9zZXQucHVzaChzZik7XG5cbiAgICAgICAgdXJsID0gY2MudXJsLnJhdyhcInJlc291cmNlcy9nYW1lX3NjZW5lL2FuaW1hbF82LnBuZ1wiKTtcbiAgICAgICAgc2YgPSBuZXcgY2MuU3ByaXRlRnJhbWUodXJsKTtcbiAgICAgICAgdGhpcy5hbmltX3NmX3NldC5wdXNoKHNmKTtcblxuICAgICAgICB1cmwgPSBjYy51cmwucmF3KFwicmVzb3VyY2VzL2dhbWVfc2NlbmUvYW5pbWFsXzcucG5nXCIpO1xuICAgICAgICBzZiA9IG5ldyBjYy5TcHJpdGVGcmFtZSh1cmwpO1xuICAgICAgICB0aGlzLmFuaW1fc2Zfc2V0LnB1c2goc2YpO1xuICAgIH0sXG5cbiAgICBnZXRfYW5pbV9zZXQ6IGZ1bmN0aW9uIGdldF9hbmltX3NldCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYW5pbV9zZl9zZXQ7XG4gICAgfSxcblxuICAgIHNob3dfY2hlY2tvdXQ6IGZ1bmN0aW9uIHNob3dfY2hlY2tvdXQoKSB7XG4gICAgICAgIHRoaXMucGxheV9zb3VuZChcInJlc291cmNlcy9zb3VuZHMvZW5kLm1wM1wiKTtcbiAgICAgICAgdGhpcy5jaGVja291dF9yb290LmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIHRoaXMuY2tfbG9nb19yb290LnNjYWxlID0gMDtcbiAgICAgICAgdmFyIHMxID0gY2Muc2NhbGVUbygwLjMsIDEuMik7XG4gICAgICAgIHZhciBzMiA9IGNjLnNjYWxlVG8oMC4xLCAwLjkpO1xuICAgICAgICB2YXIgczMgPSBjYy5zY2FsZVRvKDAuMSwgMS4wKTtcblxuICAgICAgICB0aGlzLmNrX3JlcGxheV9idXR0b24uYWN0aXZlID0gZmFsc2U7XG5cbiAgICAgICAgdmFyIGNhbGxfZnVuYyA9IGNjLmNhbGxGdW5jKChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyDml4vovazlhYnnur9cbiAgICAgICAgICAgIHRoaXMuY2tfcmVwbGF5X2J1dHRvbi5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5ja19yZXBsYXlfYnV0dG9uLnNjYWxlID0gMy41O1xuICAgICAgICAgICAgdGhpcy5ja19yZXBsYXlfYnV0dG9uLm9wYWNpdHkgPSAwO1xuICAgICAgICAgICAgdmFyIHNjYWxlMSA9IGNjLnNjYWxlVG8oMC4zLCAwLjgpO1xuICAgICAgICAgICAgdmFyIHNjYWxlMiA9IGNjLnNjYWxlVG8oMC4yLCAxLjIpO1xuICAgICAgICAgICAgdmFyIHNjYWxlMyA9IGNjLnNjYWxlVG8oMC4xLCAxLjApO1xuICAgICAgICAgICAgdmFyIHNlcSA9IGNjLnNlcXVlbmNlKFtzY2FsZTEsIHNjYWxlMiwgc2NhbGUzXSk7XG4gICAgICAgICAgICB0aGlzLmNrX3JlcGxheV9idXR0b24ucnVuQWN0aW9uKHNlcSk7XG4gICAgICAgICAgICB2YXIgZmluID0gY2MuZmFkZUluKDAuNSk7XG4gICAgICAgICAgICB0aGlzLmNrX3JlcGxheV9idXR0b24ucnVuQWN0aW9uKGZpbik7XG4gICAgICAgIH0pLmJpbmQodGhpcyksIHRoaXMpO1xuXG4gICAgICAgIHZhciBzZXEgPSBjYy5zZXF1ZW5jZShbczEsIHMyLCBzMywgY2FsbF9mdW5jXSk7XG4gICAgICAgIHRoaXMuY2tfbG9nb19yb290LnJ1bkFjdGlvbihzZXEpO1xuICAgIH0sXG5cbiAgICBwbGF5X2tpbV9hbmltX3dpdGhfcmlnaHQ6IGZ1bmN0aW9uIHBsYXlfa2ltX2FuaW1fd2l0aF9yaWdodCgpIHtcbiAgICAgICAgdmFyIGluZGV4X3NldCA9IFsxLCAyLCAzLCA0XTtcbiAgICAgICAgaW5kZXhfc2V0LnNvcnQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGgucmFuZG9tKCkgLSAwLjU7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnNrZV9raW1fY29tLmNsZWFyVHJhY2tzKCk7XG4gICAgICAgIHRoaXMuc2tlX2tpbV9jb20uc2V0QW5pbWF0aW9uKDAsIFwib2tfXCIgKyBpbmRleF9zZXRbMF0sIGZhbHNlKTtcbiAgICAgICAgdGhpcy5jYWxsX2xhdHRlcigoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5za2Vfa2ltX2NvbS5jbGVhclRyYWNrcygpO1xuICAgICAgICAgICAgdGhpcy5za2Vfa2ltX2NvbS5zZXRBbmltYXRpb24oMCwgXCJpZGxlXzFcIiwgdHJ1ZSk7XG4gICAgICAgIH0pLmJpbmQodGhpcyksIDIpO1xuICAgICAgICB0aGlzLnBsYXlfc291bmQoXCJyZXNvdXJjZXMvc291bmRzL2NoX3JpZ2h0Lm1wM1wiKTtcbiAgICB9LFxuXG4gICAgcGxheV9raW1fYW5pbV93aXRoX2Vycm9yOiBmdW5jdGlvbiBwbGF5X2tpbV9hbmltX3dpdGhfZXJyb3IoKSB7XG4gICAgICAgIHZhciBpbmRleF9zZXQgPSBbMSwgMiwgMywgNF07XG4gICAgICAgIGluZGV4X3NldC5zb3J0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLnJhbmRvbSgpIC0gMC41O1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5za2Vfa2ltX2NvbS5jbGVhclRyYWNrcygpO1xuICAgICAgICB0aGlzLnNrZV9raW1fY29tLnNldEFuaW1hdGlvbigwLCBcImVycl9cIiArIGluZGV4X3NldFswXSwgZmFsc2UpO1xuICAgICAgICB0aGlzLmNhbGxfbGF0dGVyKChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnNrZV9raW1fY29tLmNsZWFyVHJhY2tzKCk7XG4gICAgICAgICAgICB0aGlzLnNrZV9raW1fY29tLnNldEFuaW1hdGlvbigwLCBcImlkbGVfMVwiLCB0cnVlKTtcbiAgICAgICAgfSkuYmluZCh0aGlzKSwgMS41KTtcbiAgICAgICAgdGhpcy5wbGF5X3NvdW5kKFwicmVzb3VyY2VzL3NvdW5kcy9ja19lcnJvci5tcDNcIik7XG4gICAgfSxcblxuICAgIHN0YXJ0OiBmdW5jdGlvbiBzdGFydCgpIHtcbiAgICAgICAgdGhpcy5nYW1lX3N0YXJ0ID0gZmFsc2U7XG4gICAgICAgIHRoaXMubG9ja2luZ19nYW1lID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UodGhpcy5vbl9nYW1lX3N0YXJ0LmJpbmQodGhpcyksIDApO1xuXG4gICAgICAgIHRoaXMuY2FsbF9sYXR0ZXIoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuc2tlX2tpbV9jb20uY2xlYXJUcmFja3MoKTtcbiAgICAgICAgICAgIHRoaXMuc2tlX2tpbV9jb20uc2V0QW5pbWF0aW9uKDAsIFwiaWRsZV8xXCIsIHRydWUpO1xuICAgICAgICAgICAgdGhpcy5sb2NrX2tpbV9jbGljayA9IGZhbHNlO1xuICAgICAgICB9KS5iaW5kKHRoaXMpLCAwLjkpO1xuICAgIH0sXG5cbiAgICByZXNldF9mbGlwX2Jsb2NrOiBmdW5jdGlvbiByZXNldF9mbGlwX2Jsb2NrKCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZmxpcF9ibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBibG9jayA9IHRoaXMuZmxpcF9ibG9ja3NbaV07XG4gICAgICAgICAgICB2YXIgYmxvY2tfY29tcCA9IGJsb2NrLmdldENvbXBvbmVudChcImZsaXBfYmxvY2tcIik7XG4gICAgICAgICAgICBibG9ja19jb21wLmZsaXBfdG9fYmFjaygpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGZsaXBfYmxvY2tfd2l0aF9hcnJheTogZnVuY3Rpb24gZmxpcF9ibG9ja193aXRoX2FycmF5KHZhbHVlX2FycmF5KSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWVfYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBibG9jayA9IHRoaXMuZmxpcF9ibG9ja3NbaV07XG4gICAgICAgICAgICB2YXIgYmxvY2tfY29tcCA9IGJsb2NrLmdldENvbXBvbmVudChcImZsaXBfYmxvY2tcIik7XG4gICAgICAgICAgICBibG9ja19jb21wLmZsaXBfdG9fYmFja193aXRoX3ZhbHVlKHZhbHVlX2FycmF5W2ldKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbl9nYW1lX3JlcGxheTogZnVuY3Rpb24gb25fZ2FtZV9yZXBsYXkoKSB7XG4gICAgICAgIHRoaXMucGxheV9zb3VuZChcInJlc291cmNlcy9zb3VuZHMvYnV0dG9uLm1wM1wiKTtcbiAgICAgICAgdGhpcy5vbl9nYW1lX3N0YXJ0KCk7XG4gICAgfSxcblxuICAgIGdlbl9hbmltX3doZW5fc3RhcnQ6IGZ1bmN0aW9uIGdlbl9hbmltX3doZW5fc3RhcnQoYW5pbV9hcnJheSkge1xuICAgICAgICB2YXIgdGltZSA9IDAuMTtcbiAgICAgICAgdmFyIGRlbHRhID0gMC4zO1xuICAgICAgICBpZiAodGhpcy5nYW1lX2xldmVsID49IDIpIHtcbiAgICAgICAgICAgIGRlbHRhID0gMC4xO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmZsaXBfYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmZsaXBfYmxvY2tzW2ldLnNjYWxlWCA9IDA7XG4gICAgICAgICAgICB0aGlzLmZsaXBfYmxvY2tzW2ldLnNjYWxlWSA9IDA7XG4gICAgICAgICAgICB2YXIgZGVsYXkgPSBjYy5kZWxheVRpbWUodGltZSk7XG4gICAgICAgICAgICB2YXIgcyA9IGNjLnNjYWxlVG8oZGVsdGEsIGFuaW1fYXJyYXlbaV0gKiAwLjIgKyAwLjEpO1xuICAgICAgICAgICAgdmFyIHMyID0gY2Muc2NhbGVUbygwLjEsIGFuaW1fYXJyYXlbaV0gKiAwLjIpO1xuICAgICAgICAgICAgdmFyIHNlcSA9IGNjLnNlcXVlbmNlKFtkZWxheSwgcywgczJdKTtcbiAgICAgICAgICAgIHRoaXMuZmxpcF9ibG9ja3NbaV0ucnVuQWN0aW9uKHNlcSk7XG4gICAgICAgICAgICB0aW1lID0gdGltZSArIGRlbHRhO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aW1lO1xuICAgIH0sXG5cbiAgICBnZW5fbGV2ZWwwX21hcF9kYXRhOiBmdW5jdGlvbiBnZW5fbGV2ZWwwX21hcF9kYXRhKCkge1xuICAgICAgICAvKnZhciBtYXAgPSBbMywgMiwgMV07XHJcbiAgICAgICAgdmFyIGFuaW1fdHlwZSA9IFswLCAxLCAyLCAzXTtcclxuICAgICAgICBhbmltX3R5cGUuc29ydChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIE1hdGgucmFuZG9tKCkgLSAwLjU7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5taW5fYW5pbV90eXBlID0gYW5pbV90eXBlWzJdO1xyXG4gICAgICAgIHRoaXMubWF4X2FuaW1fdHlwZSA9IGFuaW1fdHlwZVswXTtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgYW5pbV9hcnJheSA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWFwLmxlbmd0aDsgaSArKykge1xyXG4gICAgICAgICAgICBmb3IodmFyIGogPSAwOyBqIDwgbWFwW2ldOyBqICsrKSB7XHJcbiAgICAgICAgICAgICAgICBhbmltX2FycmF5LnB1c2goYW5pbV90eXBlW2ldKTtcclxuICAgICAgICAgICAgfSAgICBcclxuICAgICAgICB9Ki9cblxuICAgICAgICB2YXIgYW5pbV9hcnJheSA9IFsyLCAzLCA0LCA1LCA3XTtcbiAgICAgICAgYW5pbV9hcnJheS5zb3J0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLnJhbmRvbSgpIC0gMC41O1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLm1pbl9hbmltX3R5cGUgPSAyO1xuICAgICAgICB0aGlzLm1heF9hbmltX3R5cGUgPSA3O1xuXG4gICAgICAgIHRoaXMuZ2FtZV9yZXQgPSB0aGlzLm1pbl9hbmltX3R5cGU7XG4gICAgICAgIGlmIChNYXRoLnJhbmRvbSgpID49IDAuNSkge1xuICAgICAgICAgICAgdGhpcy5nYW1lX3JldCA9IHRoaXMubWF4X2FuaW1fdHlwZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYW5pbV9hcnJheTtcbiAgICB9LFxuXG4gICAgZ2VuX2xldmVsMV9tYXBfZGF0YTogZnVuY3Rpb24gZ2VuX2xldmVsMV9tYXBfZGF0YSgpIHtcbiAgICAgICAgdmFyIG1hcDAgPSBbNSwgMywgMV07XG4gICAgICAgIHZhciBtYXAxID0gWzYsIDIsIDFdO1xuICAgICAgICB2YXIgbWFwMiA9IFs0LCAzLCAyXTtcblxuICAgICAgICB2YXIgbWFwX3NldCA9IFttYXAwLCBtYXAxLCBtYXAyXTtcbiAgICAgICAgbWFwX3NldC5zb3J0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLnJhbmRvbSgpIC0gMC41O1xuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgYW5pbV90eXBlID0gWzAsIDEsIDIsIDNdO1xuICAgICAgICBhbmltX3R5cGUuc29ydChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5yYW5kb20oKSAtIDAuNTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIG1hcDtcbiAgICAgICAgbWFwID0gbWFwX3NldFswXTtcblxuICAgICAgICB0aGlzLm1pbl9hbmltX3R5cGUgPSBhbmltX3R5cGVbMl07XG4gICAgICAgIHRoaXMubWF4X2FuaW1fdHlwZSA9IGFuaW1fdHlwZVswXTtcblxuICAgICAgICB2YXIgYW5pbV9hcnJheSA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1hcC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBtYXBbaV07IGorKykge1xuICAgICAgICAgICAgICAgIGFuaW1fYXJyYXkucHVzaChhbmltX3R5cGVbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgYW5pbV9hcnJheS5zb3J0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLnJhbmRvbSgpIC0gMC41O1xuICAgICAgICB9KTtcblxuICAgICAgICBjb25zb2xlLmxvZyhhbmltX2FycmF5KTtcbiAgICAgICAgdGhpcy5nYW1lX3JldCA9IHRoaXMubWluX2FuaW1fdHlwZTtcbiAgICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPj0gMC41KSB7XG4gICAgICAgICAgICB0aGlzLmdhbWVfcmV0ID0gdGhpcy5tYXhfYW5pbV90eXBlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhbmltX2FycmF5O1xuICAgIH0sXG5cbiAgICBnZW5fbGV2ZWwyX21hcF9kYXRhOiBmdW5jdGlvbiBnZW5fbGV2ZWwyX21hcF9kYXRhKCkge1xuICAgICAgICB2YXIgbWFwMCA9IFs2LCAzLCAyLCAxXTtcbiAgICAgICAgdmFyIG1hcDEgPSBbNSwgNCwgMiwgMV07XG4gICAgICAgIHZhciBtYXAyID0gWzQsIDMsIDMsIDJdO1xuICAgICAgICB2YXIgbWFwMyA9IFs3LCAyLCAyLCAxXTtcbiAgICAgICAgdmFyIG1hcDQgPSBbNSwgMywgMywgMV07XG5cbiAgICAgICAgdmFyIG1hcF9zZXQgPSBbbWFwMCwgbWFwMSwgbWFwMiwgbWFwMywgbWFwNF07XG4gICAgICAgIG1hcF9zZXQuc29ydChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5yYW5kb20oKSAtIDAuNTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIGFuaW1fdHlwZSA9IFswLCAxLCAyLCAzXTtcbiAgICAgICAgYW5pbV90eXBlLnNvcnQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGgucmFuZG9tKCkgLSAwLjU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBtYXA7XG4gICAgICAgIG1hcCA9IG1hcF9zZXRbMF07XG5cbiAgICAgICAgdGhpcy5taW5fYW5pbV90eXBlID0gYW5pbV90eXBlWzNdO1xuICAgICAgICB0aGlzLm1heF9hbmltX3R5cGUgPSBhbmltX3R5cGVbMF07XG5cbiAgICAgICAgdmFyIGFuaW1fYXJyYXkgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtYXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgbWFwW2ldOyBqKyspIHtcbiAgICAgICAgICAgICAgICBhbmltX2FycmF5LnB1c2goYW5pbV90eXBlW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGFuaW1fYXJyYXkuc29ydChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5yYW5kb20oKSAtIDAuNTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc29sZS5sb2coYW5pbV9hcnJheSk7XG4gICAgICAgIHRoaXMuZ2FtZV9yZXQgPSB0aGlzLm1pbl9hbmltX3R5cGU7XG4gICAgICAgIGlmIChNYXRoLnJhbmRvbSgpID49IDAuNSkge1xuICAgICAgICAgICAgdGhpcy5nYW1lX3JldCA9IHRoaXMubWF4X2FuaW1fdHlwZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYW5pbV9hcnJheTtcbiAgICB9LFxuXG4gICAgLy8gNHg0XG4gICAgZ2VuX2xldmVsM19tYXBfZGF0YTogZnVuY3Rpb24gZ2VuX2xldmVsM19tYXBfZGF0YSgpIHtcbiAgICAgICAgdmFyIG1hcDAgPSBbNSwgNCwgNCwgM107XG4gICAgICAgIHZhciBtYXAxID0gWzYsIDUsIDQsIDFdO1xuICAgICAgICB2YXIgbWFwMiA9IFs2LCA0LCA0LCAyXTtcbiAgICAgICAgdmFyIG1hcDMgPSBbNiwgNSwgMywgMl07XG4gICAgICAgIHZhciBtYXA0ID0gWzcsIDQsIDMsIDJdO1xuICAgICAgICB2YXIgbWFwNSA9IFs3LCA0LCA0LCAxXTtcbiAgICAgICAgdmFyIG1hcDYgPSBbNywgNSwgMywgMV07XG4gICAgICAgIHZhciBtYXA3ID0gWzcsIDYsIDIsIDFdO1xuICAgICAgICB2YXIgbWFwOCA9IFs4LCAzLCAzLCAyXTtcbiAgICAgICAgdmFyIG1hcDkgPSBbOCwgNCwgMywgMV07XG4gICAgICAgIHZhciBtYXAxMCA9IFs4LCA1LCAyLCAxXTtcbiAgICAgICAgdmFyIG1hcDExID0gWzksIDQsIDIsIDFdO1xuICAgICAgICB2YXIgbWFwMTIgPSBbOSwgMywgMywgMV07XG5cbiAgICAgICAgdmFyIG1hcF9zZXQgPSBbbWFwMCwgbWFwMSwgbWFwMiwgbWFwMywgbWFwNCwgbWFwNSwgbWFwNiwgbWFwNywgbWFwOCwgbWFwOSwgbWFwMTAsIG1hcDExLCBtYXAxMl07XG4gICAgICAgIG1hcF9zZXQuc29ydChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5yYW5kb20oKSAtIDAuNTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIGFuaW1fdHlwZSA9IFswLCAxLCAyLCAzXTtcbiAgICAgICAgYW5pbV90eXBlLnNvcnQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGgucmFuZG9tKCkgLSAwLjU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBtYXA7XG4gICAgICAgIG1hcCA9IG1hcF9zZXRbMF07XG5cbiAgICAgICAgdGhpcy5taW5fYW5pbV90eXBlID0gYW5pbV90eXBlWzNdO1xuICAgICAgICB0aGlzLm1heF9hbmltX3R5cGUgPSBhbmltX3R5cGVbMF07XG5cbiAgICAgICAgdmFyIGFuaW1fYXJyYXkgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtYXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgbWFwW2ldOyBqKyspIHtcbiAgICAgICAgICAgICAgICBhbmltX2FycmF5LnB1c2goYW5pbV90eXBlW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGFuaW1fYXJyYXkuc29ydChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5yYW5kb20oKSAtIDAuNTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc29sZS5sb2coYW5pbV9hcnJheSk7XG4gICAgICAgIHRoaXMuZ2FtZV9yZXQgPSB0aGlzLm1pbl9hbmltX3R5cGU7XG4gICAgICAgIGlmIChNYXRoLnJhbmRvbSgpID49IDAuNSkge1xuICAgICAgICAgICAgdGhpcy5nYW1lX3JldCA9IHRoaXMubWF4X2FuaW1fdHlwZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYW5pbV9hcnJheTtcbiAgICB9LFxuXG4gICAgLy8gNXg0XG4gICAgZ2VuX2xldmVsNF9tYXBfZGF0YTogZnVuY3Rpb24gZ2VuX2xldmVsNF9tYXBfZGF0YSgpIHtcbiAgICAgICAgdmFyIG1hcF9kYXRhX2l0ZW07XG4gICAgICAgIHZhciBtYXBfc2V0ID0gW107XG4gICAgICAgIG1hcF9kYXRhX2l0ZW0gPSBbNiwgNSwgNSwgNF07XG4gICAgICAgIG1hcF9zZXQucHVzaChtYXBfZGF0YV9pdGVtKTtcbiAgICAgICAgbWFwX2RhdGFfaXRlbSA9IFs3LCA1LCA1LCAzXTtcbiAgICAgICAgbWFwX3NldC5wdXNoKG1hcF9kYXRhX2l0ZW0pO1xuICAgICAgICBtYXBfZGF0YV9pdGVtID0gWzcsIDYsIDQsIDNdO1xuICAgICAgICBtYXBfc2V0LnB1c2gobWFwX2RhdGFfaXRlbSk7XG4gICAgICAgIG1hcF9kYXRhX2l0ZW0gPSBbNywgNiwgNSwgMl07XG4gICAgICAgIG1hcF9zZXQucHVzaChtYXBfZGF0YV9pdGVtKTtcbiAgICAgICAgbWFwX2RhdGFfaXRlbSA9IFs3LCA2LCA2LCAxXTtcbiAgICAgICAgbWFwX3NldC5wdXNoKG1hcF9kYXRhX2l0ZW0pO1xuICAgICAgICBtYXBfZGF0YV9pdGVtID0gWzgsIDcsIDQsIDFdO1xuICAgICAgICBtYXBfc2V0LnB1c2gobWFwX2RhdGFfaXRlbSk7XG4gICAgICAgIG1hcF9kYXRhX2l0ZW0gPSBbOCwgNiwgNSwgMV07XG4gICAgICAgIG1hcF9zZXQucHVzaChtYXBfZGF0YV9pdGVtKTtcbiAgICAgICAgbWFwX2RhdGFfaXRlbSA9IFs4LCA2LCA0LCAyXTtcbiAgICAgICAgbWFwX3NldC5wdXNoKG1hcF9kYXRhX2l0ZW0pO1xuICAgICAgICBtYXBfZGF0YV9pdGVtID0gWzgsIDcsIDMsIDJdO1xuICAgICAgICBtYXBfc2V0LnB1c2gobWFwX2RhdGFfaXRlbSk7XG4gICAgICAgIG1hcF9kYXRhX2l0ZW0gPSBbOCwgNSwgNSwgMl07XG4gICAgICAgIG1hcF9zZXQucHVzaChtYXBfZGF0YV9pdGVtKTtcbiAgICAgICAgbWFwX2RhdGFfaXRlbSA9IFs4LCA1LCA0LCAzXTtcbiAgICAgICAgbWFwX3NldC5wdXNoKG1hcF9kYXRhX2l0ZW0pO1xuICAgICAgICBtYXBfZGF0YV9pdGVtID0gWzksIDgsIDIsIDFdO1xuICAgICAgICBtYXBfc2V0LnB1c2gobWFwX2RhdGFfaXRlbSk7XG4gICAgICAgIG1hcF9kYXRhX2l0ZW0gPSBbOSwgNywgMywgMV07XG4gICAgICAgIG1hcF9zZXQucHVzaChtYXBfZGF0YV9pdGVtKTtcbiAgICAgICAgbWFwX2RhdGFfaXRlbSA9IFs5LCA2LCA0LCAxXTtcbiAgICAgICAgbWFwX3NldC5wdXNoKG1hcF9kYXRhX2l0ZW0pO1xuICAgICAgICBtYXBfZGF0YV9pdGVtID0gWzksIDUsIDUsIDFdO1xuICAgICAgICBtYXBfc2V0LnB1c2gobWFwX2RhdGFfaXRlbSk7XG5cbiAgICAgICAgbWFwX2RhdGFfaXRlbSA9IFs5LCA2LCAzLCAyXTtcbiAgICAgICAgbWFwX3NldC5wdXNoKG1hcF9kYXRhX2l0ZW0pO1xuICAgICAgICBtYXBfZGF0YV9pdGVtID0gWzksIDUsIDQsIDJdO1xuICAgICAgICBtYXBfc2V0LnB1c2gobWFwX2RhdGFfaXRlbSk7XG4gICAgICAgIG1hcF9kYXRhX2l0ZW0gPSBbOSwgNCwgNCwgM107XG4gICAgICAgIG1hcF9zZXQucHVzaChtYXBfZGF0YV9pdGVtKTtcblxuICAgICAgICBtYXBfZGF0YV9pdGVtID0gWzEwLCA1LCAzLCAyXTtcbiAgICAgICAgbWFwX3NldC5wdXNoKG1hcF9kYXRhX2l0ZW0pO1xuICAgICAgICBtYXBfZGF0YV9pdGVtID0gWzEwLCA0LCA0LCAyXTtcbiAgICAgICAgbWFwX3NldC5wdXNoKG1hcF9kYXRhX2l0ZW0pO1xuICAgICAgICBtYXBfZGF0YV9pdGVtID0gWzEwLCA1LCA0LCAxXTtcbiAgICAgICAgbWFwX3NldC5wdXNoKG1hcF9kYXRhX2l0ZW0pO1xuICAgICAgICBtYXBfZGF0YV9pdGVtID0gWzEwLCA2LCAzLCAxXTtcbiAgICAgICAgbWFwX3NldC5wdXNoKG1hcF9kYXRhX2l0ZW0pO1xuICAgICAgICBtYXBfZGF0YV9pdGVtID0gWzEwLCA3LCAyLCAxXTtcbiAgICAgICAgbWFwX3NldC5wdXNoKG1hcF9kYXRhX2l0ZW0pO1xuICAgICAgICBtYXBfZGF0YV9pdGVtID0gWzExLCA2LCAyLCAxXTtcbiAgICAgICAgbWFwX3NldC5wdXNoKG1hcF9kYXRhX2l0ZW0pO1xuICAgICAgICBtYXBfZGF0YV9pdGVtID0gWzExLCA0LCA0LCAxXTtcbiAgICAgICAgbWFwX3NldC5wdXNoKG1hcF9kYXRhX2l0ZW0pO1xuICAgICAgICBtYXBfZGF0YV9pdGVtID0gWzExLCA1LCAzLCAxXTtcbiAgICAgICAgbWFwX3NldC5wdXNoKG1hcF9kYXRhX2l0ZW0pO1xuICAgICAgICBtYXBfZGF0YV9pdGVtID0gWzExLCA0LCAzLCAyXTtcbiAgICAgICAgbWFwX3NldC5wdXNoKG1hcF9kYXRhX2l0ZW0pO1xuICAgICAgICBtYXBfZGF0YV9pdGVtID0gWzEyLCA0LCAzLCAxXTtcbiAgICAgICAgbWFwX3NldC5wdXNoKG1hcF9kYXRhX2l0ZW0pO1xuICAgICAgICBtYXBfZGF0YV9pdGVtID0gWzEyLCA1LCAyLCAxXTtcbiAgICAgICAgbWFwX3NldC5wdXNoKG1hcF9kYXRhX2l0ZW0pO1xuICAgICAgICBtYXBfZGF0YV9pdGVtID0gWzEzLCA0LCAyLCAxXTtcbiAgICAgICAgbWFwX3NldC5wdXNoKG1hcF9kYXRhX2l0ZW0pO1xuICAgICAgICBtYXBfZGF0YV9pdGVtID0gWzEzLCAzLCAzLCAxXTtcbiAgICAgICAgbWFwX3NldC5wdXNoKG1hcF9kYXRhX2l0ZW0pO1xuICAgICAgICBtYXBfZGF0YV9pdGVtID0gWzE0LCAzLCAyLCAxXTtcbiAgICAgICAgbWFwX3NldC5wdXNoKG1hcF9kYXRhX2l0ZW0pO1xuICAgICAgICBtYXBfZGF0YV9pdGVtID0gWzE1LCAyLCAyLCAxXTtcbiAgICAgICAgbWFwX3NldC5wdXNoKG1hcF9kYXRhX2l0ZW0pO1xuXG4gICAgICAgIG1hcF9zZXQuc29ydChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5yYW5kb20oKSAtIDAuNTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIGFuaW1fdHlwZSA9IFswLCAxLCAyLCAzXTtcbiAgICAgICAgYW5pbV90eXBlLnNvcnQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGgucmFuZG9tKCkgLSAwLjU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBtYXA7XG4gICAgICAgIG1hcCA9IG1hcF9zZXRbMF07XG5cbiAgICAgICAgdGhpcy5taW5fYW5pbV90eXBlID0gYW5pbV90eXBlWzNdO1xuICAgICAgICB0aGlzLm1heF9hbmltX3R5cGUgPSBhbmltX3R5cGVbMF07XG5cbiAgICAgICAgdmFyIGFuaW1fYXJyYXkgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtYXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgbWFwW2ldOyBqKyspIHtcbiAgICAgICAgICAgICAgICBhbmltX2FycmF5LnB1c2goYW5pbV90eXBlW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGFuaW1fYXJyYXkuc29ydChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5yYW5kb20oKSAtIDAuNTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc29sZS5sb2coYW5pbV9hcnJheSk7XG4gICAgICAgIHRoaXMuZ2FtZV9yZXQgPSB0aGlzLm1pbl9hbmltX3R5cGU7XG4gICAgICAgIGlmIChNYXRoLnJhbmRvbSgpID49IDAuNSkge1xuICAgICAgICAgICAgdGhpcy5nYW1lX3JldCA9IHRoaXMubWF4X2FuaW1fdHlwZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYW5pbV9hcnJheTtcbiAgICB9LFxuXG4gICAgZ2VuX2dhbWVfZGF0YTogZnVuY3Rpb24gZ2VuX2dhbWVfZGF0YShhbmltX2RhdGEpIHtcbiAgICAgICAgdmFyIGZsaXBfYmxvY2tfY29tcDtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFuaW1fZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZmxpcF9ibG9ja19jb21wID0gdGhpcy5mbGlwX2Jsb2Nrc1tpXS5nZXRDb21wb25lbnQoXCJmbGlwX2Jsb2NrXCIpO1xuICAgICAgICAgICAgZmxpcF9ibG9ja19jb21wLmZsaXBfdG9fYmFja193aXRoX3ZhbHVlKGFuaW1fZGF0YVtpXSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25fZ2FtZV9zdGFydDogZnVuY3Rpb24gb25fZ2FtZV9zdGFydCgpIHtcbiAgICAgICAgaWYgKHRoaXMuZ2FtZV9sZXZlbCA+PSA1KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNoZWNrb3V0X3Jvb3QuYWN0aXZlID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5xdWVzdGlvbl9ub2RlLnN0b3BBbGxBY3Rpb25zKCk7XG4gICAgICAgIHRoaXMucXVlc3Rpb25fbm9kZS5hY3RpdmUgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLmdhbWVfc3RhcnQgPSB0cnVlO1xuXG4gICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLmxldmVsX3Jvb3QubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICB0aGlzLmxldmVsX3Jvb3RbaW5kZXhdLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubGV2ZWxfcm9vdFswXS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB0aGlzLmZsaXBfYmxvY2tzID0gdGhpcy5ibG9ja19sZXZlbHNbMF07XG5cbiAgICAgICAgdmFyIG1hcDtcbiAgICAgICAgdmFyIGFuaW1fYXJyYXk7XG5cbiAgICAgICAgdGhpcy5hbmltX3NmX3NldC5zb3J0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLnJhbmRvbSgpIC0gMC41O1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodGhpcy5nYW1lX2xldmVsID09PSAwKSB7XG4gICAgICAgICAgICBhbmltX2FycmF5ID0gdGhpcy5nZW5fbGV2ZWwwX21hcF9kYXRhKCk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5nYW1lX2xldmVsID09PSAxKSB7XG4gICAgICAgICAgICBhbmltX2FycmF5ID0gdGhpcy5nZW5fbGV2ZWwwX21hcF9kYXRhKCk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5nYW1lX2xldmVsID09PSAyKSB7XG4gICAgICAgICAgICBhbmltX2FycmF5ID0gdGhpcy5nZW5fbGV2ZWwwX21hcF9kYXRhKCk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5nYW1lX2xldmVsID09PSAzKSB7XG4gICAgICAgICAgICBhbmltX2FycmF5ID0gdGhpcy5nZW5fbGV2ZWwwX21hcF9kYXRhKCk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5nYW1lX2xldmVsID09PSA0KSB7XG4gICAgICAgICAgICAvLyBhbmltX2FycmF5ID0gdGhpcy5nZW5fbGV2ZWw0X21hcF9kYXRhKCk7XG4gICAgICAgICAgICBhbmltX2FycmF5ID0gdGhpcy5nZW5fbGV2ZWwwX21hcF9kYXRhKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmdlbl9nYW1lX2RhdGEoYW5pbV9hcnJheSk7XG4gICAgICAgIHZhciB0aW1lID0gdGhpcy5nZW5fYW5pbV93aGVuX3N0YXJ0KGFuaW1fYXJyYXkpO1xuICAgICAgICB0aGlzLmNhbGxfbGF0dGVyKChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnBsYXlfcXVlc3Rpb25fYWN0aW9uKCk7XG4gICAgICAgIH0pLmJpbmQodGhpcyksIHRpbWUgKyAwLjEpO1xuICAgIH0sXG5cbiAgICBwbGF5X3F1ZXN0aW9uX2FjdGlvbjogZnVuY3Rpb24gcGxheV9xdWVzdGlvbl9hY3Rpb24oKSB7XG4gICAgICAgIHRoaXMubG9ja2luZ19nYW1lID0gZmFsc2U7XG4gICAgICAgIHRoaXMucXVlc3Rpb25fbm9kZS5hY3RpdmUgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMucXVlc3Rpb25fbm9kZS54ID0gdGhpcy5hbmltX3F1ZXNfeDtcbiAgICAgICAgdGhpcy5xdWVzdGlvbl9ub2RlLnkgPSB0aGlzLmFuaW1fcXVlc195O1xuICAgICAgICB0aGlzLnF1ZXN0aW9uX25vZGUub3BhY2l0eSA9IDI1NTtcbiAgICAgICAgdGhpcy5xdWVzdGlvbl9ub2RlLnNjYWxlID0gdGhpcy5hbmltX3N0YXJ0X3NjYWxlO1xuXG4gICAgICAgIHZhciBzcHJpdGVfY29tID0gdGhpcy5xdWVzdGlvbl9ub2RlLmdldENvbXBvbmVudChjYy5TcHJpdGUpO1xuICAgICAgICBpZiAodGhpcy5nYW1lX3JldCA9PSB0aGlzLm1pbl9hbmltX3R5cGUpIHtcbiAgICAgICAgICAgIHNwcml0ZV9jb20uc3ByaXRlRnJhbWUgPSB0aGlzLnF1ZXN0aW9uX2xlYXN0LmNsb25lKCk7XG4gICAgICAgICAgICB0aGlzLnBsYXlfc291bmQoXCJyZXNvdXJjZXMvc291bmRzL2xlYXN0Lm1wM1wiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNwcml0ZV9jb20uc3ByaXRlRnJhbWUgPSB0aGlzLnF1ZXN0aW9uX21vc3QuY2xvbmUoKTtcbiAgICAgICAgICAgIHRoaXMucGxheV9zb3VuZChcInJlc291cmNlcy9zb3VuZHMvbW9zdC5tcDNcIik7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG1vdmUgPSBjYy5tb3ZlVG8odGhpcy5xdWVzdGlvbl9tb3ZlX3RpbWUsIHRoaXMuYW5pbV9xdWVzX2RfeCwgdGhpcy5hbmltX3F1ZXNfZF95KTtcbiAgICAgICAgdmFyIHNjYWxlID0gY2Muc2NhbGVUbyh0aGlzLnF1ZXN0aW9uX3NjYWxlX3RpbWUsIDEpO1xuXG4gICAgICAgIHZhciBzZXEgPSBjYy5zZXF1ZW5jZShbbW92ZSwgc2NhbGVdKTtcbiAgICAgICAgdGhpcy5xdWVzdGlvbl9ub2RlLnJ1bkFjdGlvbihzZXEpO1xuICAgIH0sXG5cbiAgICBvbl9xdWVzdGlvbl9jbGljazogZnVuY3Rpb24gb25fcXVlc3Rpb25fY2xpY2soKSB7XG4gICAgICAgIHZhciBmb3V0ID0gY2MuZmFkZU91dCh0aGlzLnF1ZXN0aW9uX2ZhZGVvdXRfdGltZSk7XG4gICAgICAgIHZhciBjYWxsZnVuYyA9IGNjLmNhbGxGdW5jKChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9uX25vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIH0pLmJpbmQodGhpcyksIHRoaXMpO1xuICAgICAgICB2YXIgc2VxID0gY2Muc2VxdWVuY2UoW2ZvdXQsIGNhbGxmdW5jXSk7XG4gICAgICAgIHRoaXMucXVlc3Rpb25fbm9kZS5ydW5BY3Rpb24oc2VxKTtcbiAgICB9LFxuXG4gICAgcGxheV9zb3VuZDogZnVuY3Rpb24gcGxheV9zb3VuZChuYW1lKSB7XG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnN0b3BNdXNpYyhmYWxzZSk7XG4gICAgICAgIHZhciB1cmwgPSBjYy51cmwucmF3KG5hbWUpO1xuICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5TXVzaWModXJsLCBmYWxzZSk7XG4gICAgfSxcblxuICAgIGNoZWNrb3V0X3N1Y2Nlc3M6IGZ1bmN0aW9uIGNoZWNrb3V0X3N1Y2Nlc3MoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuZmxpcF9ibG9ja3MubGVuZ3RoKTtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5mbGlwX21hc2spO1xuICAgICAgICB2YXIgaTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMuZmxpcF9ibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmZsaXBfbWFza1tpXSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgc2hvd19yaWdodF9hbmltOiBmdW5jdGlvbiBzaG93X3JpZ2h0X2FuaW0oKSB7XG4gICAgICAgIHZhciBzMSA9IGNjLnNjYWxlVG8oMC4zLCAxLjEpO1xuICAgICAgICB2YXIgZGVsYXkgPSBjYy5kZWxheVRpbWUoMC4yKTtcbiAgICAgICAgdmFyIHMyID0gY2Muc2NhbGVUbygwLjEsIDEuMCk7XG5cbiAgICAgICAgdmFyIHNlcSA9IGNjLnNlcXVlbmNlKFtzMSwgZGVsYXksIHMyXSk7XG5cbiAgICAgICAgdGhpcy5maXJzdF9mbGlwLm5vZGUucnVuQWN0aW9uKHNlcSk7XG4gICAgICAgIHRoaXMuc2Vjb25kX2ZsaXAubm9kZS5ydW5BY3Rpb24oc2VxLmNsb25lKCkpO1xuICAgIH0sXG5cbiAgICBjYWxsX2xhdHRlcjogZnVuY3Rpb24gY2FsbF9sYXR0ZXIoY2FsbGZ1bmMsIGRlbGF5KSB7XG4gICAgICAgIHZhciBkZWxheV9hY3Rpb24gPSBjYy5kZWxheVRpbWUoZGVsYXkpO1xuICAgICAgICB2YXIgY2FsbF9hY3Rpb24gPSBjYy5jYWxsRnVuYyhjYWxsZnVuYywgdGhpcyk7XG4gICAgICAgIHZhciBzZXEgPSBjYy5zZXF1ZW5jZShbZGVsYXlfYWN0aW9uLCBjYWxsX2FjdGlvbl0pO1xuICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKHNlcSk7XG4gICAgfSxcblxuICAgIHBsYXlfY2hvb3NlX3N1Y2Nlc19hbmltOiBmdW5jdGlvbiBwbGF5X2Nob29zZV9zdWNjZXNfYW5pbShjYXJkX3ZhbHVlKSB7XG4gICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLmZsaXBfYmxvY2tzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgdmFyIGJsb2NrX2NvbXAgPSB0aGlzLmZsaXBfYmxvY2tzW2luZGV4XS5nZXRDb21wb25lbnQoXCJmbGlwX2Jsb2NrXCIpO1xuICAgICAgICAgICAgaWYgKGJsb2NrX2NvbXAuY2FyZF92YWx1ZSA9PSBjYXJkX3ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNfbWF4ID0gY2Muc2NhbGVUbygwLjQsIHRoaXMuZmxpcF9ibG9ja3NbaW5kZXhdLnNjYWxlICsgMC4yKTtcbiAgICAgICAgICAgICAgICB2YXIgc19iayA9IGNjLnNjYWxlVG8oMC4yLCB0aGlzLmZsaXBfYmxvY2tzW2luZGV4XS5zY2FsZSk7XG4gICAgICAgICAgICAgICAgdmFyIHNlcSA9IGNjLnNlcXVlbmNlKFtzX21heCwgc19ia10pO1xuICAgICAgICAgICAgICAgIHRoaXMuZmxpcF9ibG9ja3NbaW5kZXhdLnJ1bkFjdGlvbihzZXEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIHBsYXlfY2hvb3NlX2Vycm9yX2FuaW06IGZ1bmN0aW9uIHBsYXlfY2hvb3NlX2Vycm9yX2FuaW0oYmxvY2spIHtcbiAgICAgICAgdmFyIHIxID0gY2Mucm90YXRlVG8oMC4xLCAtMTApO1xuICAgICAgICB2YXIgcjIgPSBjYy5yb3RhdGVUbygwLjIsIDEwKTtcbiAgICAgICAgdmFyIHIzID0gY2Mucm90YXRlVG8oMC4yLCAtOCk7XG4gICAgICAgIHZhciByNCA9IGNjLnJvdGF0ZVRvKDAuMiwgOCk7XG4gICAgICAgIHZhciByNSA9IGNjLnJvdGF0ZVRvKDAuMiwgLTQpO1xuICAgICAgICB2YXIgcjYgPSBjYy5yb3RhdGVUbygwLjIsIDQpO1xuICAgICAgICB2YXIgcjcgPSBjYy5yb3RhdGVUbygwLjEsIDApO1xuXG4gICAgICAgIHZhciBzZXEgPSBjYy5zZXF1ZW5jZShbcjEsIHIyLCByMywgcjQsIHI1LCByNiwgcjddKTtcbiAgICAgICAgYmxvY2subm9kZS5ydW5BY3Rpb24oc2VxKTtcbiAgICB9LFxuXG4gICAgb25fY2FyZF9mbGlwOiBmdW5jdGlvbiBvbl9jYXJkX2ZsaXAoYmxvY2ssIGNhcmRfdmFsdWUpIHtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5nYW1lX3N0YXJ0ICsgdGhpcy5sb2NraW5nX2dhbWUpO1xuICAgICAgICBpZiAodGhpcy5nYW1lX3N0YXJ0ID09PSBmYWxzZSB8fCB0aGlzLmxvY2tpbmdfZ2FtZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc29sZS5sb2coXCJjYXJkX2ZsaXAgPVwiICsgY2FyZF92YWx1ZSk7XG4gICAgICAgIHRoaXMubG9ja2luZ19nYW1lID0gdHJ1ZTtcbiAgICAgICAgaWYgKHRoaXMuZ2FtZV9yZXQgPT0gY2FyZF92YWx1ZSkge1xuICAgICAgICAgICAgLy8g6L+b5YWl5LiL5LiA5YWzXG4gICAgICAgICAgICB0aGlzLnBsYXlfa2ltX2FuaW1fd2l0aF9yaWdodCgpO1xuICAgICAgICAgICAgdGhpcy5wbGF5X2Nob29zZV9zdWNjZXNfYW5pbShjYXJkX3ZhbHVlKTtcbiAgICAgICAgICAgIHRoaXMuY2FsbF9sYXR0ZXIoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWVfbGV2ZWwrKztcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nYW1lX2xldmVsID49IDUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g5ri45oiP57uT5p2fXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZV9sZXZlbCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd19jaGVja291dCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25fZ2FtZV9zdGFydCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLmJpbmQodGhpcyksIDIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wbGF5X2tpbV9hbmltX3dpdGhfZXJyb3IoKTtcbiAgICAgICAgICAgIHRoaXMucGxheV9jaG9vc2VfZXJyb3JfYW5pbShibG9jayk7XG4gICAgICAgICAgICB0aGlzLmNhbGxfbGF0dGVyKChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbl9nYW1lX3N0YXJ0KCk7XG4gICAgICAgICAgICB9KS5iaW5kKHRoaXMpLCAyKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbl9nb3RvX2hvbWU6IGZ1bmN0aW9uIG9uX2dvdG9faG9tZSgpIHtcbiAgICAgICAgY2MuYXVkaW9FbmdpbmUuc3RvcE11c2ljKGZhbHNlKTtcbiAgICAgICAgdmFyIHVybCA9IGNjLnVybC5yYXcoXCJyZXNvdXJjZXMvc291bmRzL2J1dHRvbi5tcDNcIik7XG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlNdXNpYyh1cmwsIGZhbHNlKTtcbiAgICAgICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKFwic3RhcnRfc2NlbmVcIik7XG4gICAgfSxcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8qdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcclxuICAgICAgICB2YXIgd2luX3NpemUgPSBjYy5kaXJlY3Rvci5nZXRXaW5TaXplKCk7XHJcbiAgICAgICAgaWYod2luX3NpemUud2lkdGggIT0gdGhpcy5wcmV2X3NpemUud2lkdGggfHwgd2luX3NpemUuaGVpZ2h0ICE9IHRoaXMucHJldl9zaXplLmhlaWdodCkge1xyXG4gICAgICAgICAgICB0aGlzLnByZXZfc2l6ZSA9IHdpbl9zaXplO1xyXG4gICAgICAgICAgICB0aGlzLmFkanVzdF93aW5kb3cod2luX3NpemUpO1xyXG4gICAgICAgIH1cclxuICAgIH0sKi9cblxuICAgIG9uX2tpbV9jbGljazogZnVuY3Rpb24gb25fa2ltX2NsaWNrKCkge1xuICAgICAgICBpZiAodGhpcy5sb2NrX2tpbV9jbGljayA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucGxheV9raW1fY2xpY2tfYW5pbV93aXRoX3JhbmRvbSgpO1xuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnYTNjOGFCbk5UZE9RSWo3MUJVVk40cTEnLCAnbG9vcF9tb3ZlX2FjdGlvbicpO1xuLy8gc2NyaXB0c1xcbG9vcF9tb3ZlX2FjdGlvbi5qc1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIG1vdmVfdGltZTogMC40LFxuICAgICAgICBtb3ZlX2R4OiAwLFxuICAgICAgICBtb3ZlX2R5OiAwLFxuICAgICAgICBzdGFydF90aW1lOiAwXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICBpZiAodGhpcy5zdGFydF90aW1lID49IDApIHtcbiAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ydW5fYWN0aW9uKCk7XG4gICAgICAgICAgICB9KS5iaW5kKHRoaXMpLCB0aGlzLnN0YXJ0X3RpbWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5ydW5fYWN0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcnVuX2FjdGlvbjogZnVuY3Rpb24gcnVuX2FjdGlvbigpIHtcbiAgICAgICAgdmFyIG0xID0gY2MubW92ZUJ5KHRoaXMubW92ZV90aW1lLCB0aGlzLm1vdmVfZHgsIHRoaXMubW92ZV9keSk7XG4gICAgICAgIHZhciBtMiA9IGNjLm1vdmVCeSh0aGlzLm1vdmVfdGltZSwgLXRoaXMubW92ZV9keCwgLXRoaXMubW92ZV9keSk7XG4gICAgICAgIHZhciBzZXEgPSBjYy5zZXF1ZW5jZShbbTEsIG0yXSk7XG4gICAgICAgIHZhciByZXBlYXQgPSBjYy5yZXBlYXRGb3JldmVyKHNlcSk7XG4gICAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24ocmVwZWF0KTtcbiAgICB9XG59KTtcbi8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4vLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4vLyB9LFxuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnZjJiYTNtMGpadEdINEc4bnFmRzlwR3AnLCAnbW92ZV9hY3Rpb24nKTtcbi8vIHNjcmlwdHNcXG1vdmVfYWN0aW9uLmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgcGxheV9vbmxvYWQ6IHRydWUsXG4gICAgICAgIHBsYXlfb25sb2FkX2RlbGF5OiAwLFxuICAgICAgICBzdGFydF9hY3RpdmU6IGZhbHNlLFxuICAgICAgICBtb3ZlX2R1cmF0aW9uOiAwLFxuICAgICAgICBtb3ZlX3RpbWU6IDAuMixcbiAgICAgICAgaXNfaG9yOiBmYWxzZSxcbiAgICAgICAgaXNfanVtcDogdHJ1ZVxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5ub2RlLmFjdGl2ZSA9IHRoaXMuc3RhcnRfYWN0aXZlO1xuICAgICAgICBpZiAodGhpcy5wbGF5X29ubG9hZCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucGxheV9vbmxvYWRfZGVsYXkgPD0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMucGxheSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNjaGVkdWxlT25jZSgoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsYXkoKTtcbiAgICAgICAgICAgICAgICB9KS5iaW5kKHRoaXMpLCB0aGlzLnBsYXlfb25sb2FkX2RlbGF5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBwbGF5OiBmdW5jdGlvbiBwbGF5KCkge1xuICAgICAgICB0aGlzLm5vZGUuc3RvcEFsbEFjdGlvbnMoKTtcblxuICAgICAgICB0aGlzLm5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdmFyIGR4ID0gMDtcbiAgICAgICAgdmFyIGR5ID0gMDtcblxuICAgICAgICB2YXIganVtcF94ID0gMDtcbiAgICAgICAgdmFyIGp1bXBfeSA9IDA7XG5cbiAgICAgICAgaWYgKHRoaXMuaXNfaG9yKSB7XG4gICAgICAgICAgICBkeCA9IHRoaXMubW92ZV9kdXJhdGlvbjtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzX2p1bXApIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5tb3ZlX2R1cmF0aW9uID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAvLyDlj7NcbiAgICAgICAgICAgICAgICAgICAganVtcF94ID0gLTEwO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOW3plxuICAgICAgICAgICAgICAgICAgICBqdW1wX3ggPSAxMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkeSA9IHRoaXMubW92ZV9kdXJhdGlvbjtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzX2p1bXApIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5tb3ZlX2R1cmF0aW9uID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAvLyDkuIpcbiAgICAgICAgICAgICAgICAgICAganVtcF95ID0gLTEwO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOS4i1xuICAgICAgICAgICAgICAgICAgICBqdW1wX3kgPSAxMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pc19qdW1wKSB7XG4gICAgICAgICAgICB2YXIgbW92ZTEgPSBjYy5tb3ZlQnkodGhpcy5tb3ZlX3RpbWUsIGR4IC0ganVtcF94LCBkeSAtIGp1bXBfeSk7XG4gICAgICAgICAgICB2YXIgbW92ZTIgPSBjYy5tb3ZlQnkoMC4yLCBqdW1wX3ggKiAyLCBqdW1wX3kgKiAyKTtcbiAgICAgICAgICAgIHZhciBtb3ZlMyA9IGNjLm1vdmVCeSgwLjEsIC1qdW1wX3gsIC1qdW1wX3kpO1xuICAgICAgICAgICAgdmFyIHNlcSA9IGNjLnNlcXVlbmNlKFttb3ZlMSwgbW92ZTIsIG1vdmUzXSk7XG4gICAgICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKHNlcSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgbW92ZTEgPSBjYy5tb3ZlQnkodGhpcy5tb3ZlX3RpbWUsIGR4LCBkeSk7XG4gICAgICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKG1vdmUxKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBtb3ZlX2JhY2s6IGZ1bmN0aW9uIG1vdmVfYmFjaygpIHtcbiAgICAgICAgdGhpcy5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIHRoaXMubm9kZS5zdG9wQWxsQWN0aW9ucygpO1xuICAgICAgICB2YXIgZHggPSAwO1xuICAgICAgICB2YXIgZHkgPSAwO1xuXG4gICAgICAgIHZhciBqdW1wX3ggPSAwO1xuICAgICAgICB2YXIganVtcF95ID0gMDtcblxuICAgICAgICBpZiAodGhpcy5pc19ob3IpIHtcbiAgICAgICAgICAgIGR4ID0gdGhpcy5tb3ZlX2R1cmF0aW9uO1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNfanVtcCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm1vdmVfZHVyYXRpb24gPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOWPs1xuICAgICAgICAgICAgICAgICAgICBqdW1wX3ggPSAtMTA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g5bemXG4gICAgICAgICAgICAgICAgICAgIGp1bXBfeCA9IDEwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGR5ID0gdGhpcy5tb3ZlX2R1cmF0aW9uO1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNfanVtcCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm1vdmVfZHVyYXRpb24gPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOS4ilxuICAgICAgICAgICAgICAgICAgICBqdW1wX3kgPSAtMTA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g5LiLXG4gICAgICAgICAgICAgICAgICAgIGp1bXBfeSA9IDEwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmlzX2p1bXApIHtcbiAgICAgICAgICAgIHZhciBtb3ZlMSA9IGNjLm1vdmVCeSh0aGlzLm1vdmVfdGltZSwgLWR4ICsganVtcF94LCAtZHkgKyBqdW1wX3kpO1xuICAgICAgICAgICAgdmFyIG1vdmUyID0gY2MubW92ZUJ5KDAuMiwgLWp1bXBfeCAqIDIsIC1qdW1wX3kgKiAyKTtcbiAgICAgICAgICAgIHZhciBtb3ZlMyA9IGNjLm1vdmVCeSgwLjEsIGp1bXBfeCwganVtcF95KTtcbiAgICAgICAgICAgIHZhciBzZXEgPSBjYy5zZXF1ZW5jZShbbW92ZTEsIG1vdmUyLCBtb3ZlM10pO1xuICAgICAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihzZXEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIG1vdmUxID0gY2MubW92ZUJ5KHRoaXMubW92ZV90aW1lLCAtZHgsIC1keSk7XG4gICAgICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKG1vdmUxKTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbi8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbi8vIH0sXG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdiMWE3ZE5OTlk5T0diR2JDUktvenhXMCcsICdwYXRfYWN0aW9uJyk7XG4vLyBzY3JpcHRzXFxwYXRfYWN0aW9uLmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgcGxheV9vbmxvYWQ6IHRydWUsXG4gICAgICAgIHN0YXJ0X3NjYWxlOiAzLjUsXG4gICAgICAgIHBsYXlfb25sb2FkX2RlbGF5OiAwLFxuICAgICAgICBzdGFydF9hY3RpdmU6IGZhbHNlXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLm5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgaWYgKHRoaXMuc3RhcnRfYWN0aXZlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgdGhpcy5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLm5vZGUub3BhY2l0eSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucGxheV9vbmxvYWQgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnBsYXlfb25sb2FkX2RlbGF5IDw9IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXkoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbGF5KCk7XG4gICAgICAgICAgICAgICAgfSkuYmluZCh0aGlzKSwgdGhpcy5wbGF5X29ubG9hZF9kZWxheSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcGxheTogZnVuY3Rpb24gcGxheSgpIHtcbiAgICAgICAgdGhpcy5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIHRoaXMubm9kZS5zY2FsZSA9IHRoaXMuc3RhcnRfc2NhbGU7XG4gICAgICAgIHRoaXMubm9kZS5vcGFjaXR5ID0gMDtcbiAgICAgICAgdmFyIHNjYWxlMSA9IGNjLnNjYWxlVG8oMC4zLCAwLjgpO1xuICAgICAgICB2YXIgc2NhbGUyID0gY2Muc2NhbGVUbygwLjIsIDEuMik7XG4gICAgICAgIHZhciBzY2FsZTMgPSBjYy5zY2FsZVRvKDAuMSwgMS4wKTtcbiAgICAgICAgdmFyIHNlcSA9IGNjLnNlcXVlbmNlKFtzY2FsZTEsIHNjYWxlMiwgc2NhbGUzXSk7XG4gICAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24oc2VxKTtcbiAgICAgICAgdmFyIGZpbiA9IGNjLmZhZGVJbigwLjUpO1xuICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKGZpbik7XG4gICAgfSxcblxuICAgIG1vdmVfYmFjazogZnVuY3Rpb24gbW92ZV9iYWNrKCkge1xuICAgICAgICB0aGlzLm5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgLy8gdGhpcy5ub2RlLnNjYWxlID0gdGhpcy5zdGFydF9zY2FsZTtcbiAgICAgICAgLy8gdGhpcy5ub2RlLm9wYWNpdHkgPSAwO1xuICAgICAgICB2YXIgczIgPSBjYy5zY2FsZVRvKDAuMiwgMC44KTtcbiAgICAgICAgdmFyIHMzID0gY2Muc2NhbGVUbygwLjMsIHRoaXMuc3RhcnRfc2NhbGUpO1xuICAgICAgICB2YXIgc2VxID0gY2Muc2VxdWVuY2UoW3MyLCBzM10pO1xuICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKHNlcSk7XG4gICAgICAgIHZhciBmb3V0ID0gY2MuZmFkZU91dCgwLjUpO1xuICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKGZvdXQpO1xuICAgIH1cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc0Zjg5MllLcnJSTDFxRVY1MkhKYlpHSScsICdzdGFydF9zY2VuZScpO1xuLy8gc2NyaXB0c1xcc3RhcnRfc2NlbmUuanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgIH0sXG5cbiAgICBhZGp1c3RfYW5jaG9yX3dpdGhfZGVzaWduOiBmdW5jdGlvbiBhZGp1c3RfYW5jaG9yX3dpdGhfZGVzaWduKCkge1xuICAgICAgICB2YXIgYW5jaG9yX3BvaW50ID0gY2MuZmluZChcIlVJX1JPT1QvYW5jaG9yLWx0XCIpO1xuICAgICAgICBpZiAoYW5jaG9yX3BvaW50KSB7XG4gICAgICAgICAgICBhbmNob3JfcG9pbnQueCA9IC00ODA7XG4gICAgICAgICAgICBhbmNob3JfcG9pbnQueSA9IDM2MDtcbiAgICAgICAgfVxuXG4gICAgICAgIGFuY2hvcl9wb2ludCA9IGNjLmZpbmQoXCJVSV9ST09UL2FuY2hvci1ib3R0b21cIik7XG4gICAgICAgIGlmIChhbmNob3JfcG9pbnQpIHtcbiAgICAgICAgICAgIGFuY2hvcl9wb2ludC54ID0gMDtcbiAgICAgICAgICAgIGFuY2hvcl9wb2ludC55ID0gLTM2MDtcbiAgICAgICAgfVxuXG4gICAgICAgIGFuY2hvcl9wb2ludCA9IGNjLmZpbmQoXCJVSV9ST09UL2FuY2hvci1sYlwiKTtcbiAgICAgICAgaWYgKGFuY2hvcl9wb2ludCkge1xuICAgICAgICAgICAgYW5jaG9yX3BvaW50LnggPSAtNDgwO1xuICAgICAgICAgICAgYW5jaG9yX3BvaW50LnkgPSAtMzYwO1xuICAgICAgICB9XG5cbiAgICAgICAgYW5jaG9yX3BvaW50ID0gY2MuZmluZChcIlVJX1JPT1QvYW5jaG9yLXJiXCIpO1xuICAgICAgICBpZiAoYW5jaG9yX3BvaW50KSB7XG4gICAgICAgICAgICBhbmNob3JfcG9pbnQueCA9IDQ4MDtcbiAgICAgICAgICAgIGFuY2hvcl9wb2ludC55ID0gLTM2MDtcbiAgICAgICAgfVxuXG4gICAgICAgIGFuY2hvcl9wb2ludCA9IGNjLmZpbmQoXCJVSV9ST09UL2FuY2hvci10b3BcIik7XG4gICAgICAgIGlmIChhbmNob3JfcG9pbnQpIHtcbiAgICAgICAgICAgIGFuY2hvcl9wb2ludC54ID0gMDtcbiAgICAgICAgICAgIGFuY2hvcl9wb2ludC55ID0gMzYwO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGFkanVzdF9hbmNob3I6IGZ1bmN0aW9uIGFkanVzdF9hbmNob3IoKSB7XG4gICAgICAgIHZhciB3aW5fc2l6ZSA9IGNjLmRpcmVjdG9yLmdldFdpblNpemUoKTtcblxuICAgICAgICB2YXIgY3ggPSB3aW5fc2l6ZS53aWR0aCAqIDAuNTtcbiAgICAgICAgdmFyIGN5ID0gd2luX3NpemUuaGVpZ2h0ICogMC41O1xuXG4gICAgICAgIHZhciBhbmNob3JfcG9pbnQgPSBjYy5maW5kKFwiVUlfUk9PVC9hbmNob3ItbHRcIik7XG4gICAgICAgIGlmIChhbmNob3JfcG9pbnQpIHtcbiAgICAgICAgICAgIGFuY2hvcl9wb2ludC54ID0gLWN4O1xuICAgICAgICAgICAgYW5jaG9yX3BvaW50LnkgPSBjeTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFuY2hvcl9wb2ludCA9IGNjLmZpbmQoXCJVSV9ST09UL2FuY2hvci1ib3R0b21cIik7XG4gICAgICAgIGlmIChhbmNob3JfcG9pbnQpIHtcbiAgICAgICAgICAgIGFuY2hvcl9wb2ludC54ID0gMDtcbiAgICAgICAgICAgIGFuY2hvcl9wb2ludC55ID0gLWN5O1xuICAgICAgICB9XG5cbiAgICAgICAgYW5jaG9yX3BvaW50ID0gY2MuZmluZChcIlVJX1JPT1QvYW5jaG9yLWxiXCIpO1xuICAgICAgICBpZiAoYW5jaG9yX3BvaW50KSB7XG4gICAgICAgICAgICBhbmNob3JfcG9pbnQueCA9IC1jeDtcbiAgICAgICAgICAgIGFuY2hvcl9wb2ludC55ID0gLWN5O1xuICAgICAgICB9XG5cbiAgICAgICAgYW5jaG9yX3BvaW50ID0gY2MuZmluZChcIlVJX1JPT1QvYW5jaG9yLXJiXCIpO1xuICAgICAgICBpZiAoYW5jaG9yX3BvaW50KSB7XG4gICAgICAgICAgICBhbmNob3JfcG9pbnQueCA9IGN4O1xuICAgICAgICAgICAgYW5jaG9yX3BvaW50LnkgPSAtY3k7XG4gICAgICAgIH1cblxuICAgICAgICBhbmNob3JfcG9pbnQgPSBjYy5maW5kKFwiVUlfUk9PVC9hbmNob3ItdG9wXCIpO1xuICAgICAgICBpZiAoYW5jaG9yX3BvaW50KSB7XG4gICAgICAgICAgICBhbmNob3JfcG9pbnQueCA9IDA7XG4gICAgICAgICAgICBhbmNob3JfcG9pbnQueSA9IGN5O1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGFkanVzdF93aW5kb3c6IGZ1bmN0aW9uIGFkanVzdF93aW5kb3cod2luX3NpemUpIHtcbiAgICAgICAgdmFyIGRlc2lnbl80XzMgPSBmYWxzZTtcbiAgICAgICAgaWYgKDEwMjQgKiB3aW5fc2l6ZS5oZWlnaHQgPiA3NjggKiB3aW5fc2l6ZS53aWR0aCkge1xuICAgICAgICAgICAgdGhpcy5hZGp1c3RfYW5jaG9yX3dpdGhfZGVzaWduKCk7XG4gICAgICAgICAgICBkZXNpZ25fNF8zID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYWRqdXN0X2FuY2hvcigpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHN0YXJ0OiBmdW5jdGlvbiBzdGFydCgpIHtcbiAgICAgICAgdmFyIHdpbl9zaXplID0gY2MuZGlyZWN0b3IuZ2V0V2luU2l6ZSgpO1xuICAgICAgICB0aGlzLnByZXZfc2l6ZSA9IHdpbl9zaXplO1xuICAgICAgICB0aGlzLmFkanVzdF93aW5kb3cod2luX3NpemUpO1xuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcblxuICAgICAgICB2YXIgdXJsID0gY2MudXJsLnJhdyhcInJlc291cmNlcy9zb3VuZHMvbGVhc3QubXAzXCIpO1xuICAgICAgICBjYy5sb2FkZXIubG9hZFJlcyh1cmwsIGZ1bmN0aW9uICgpIHt9KTtcbiAgICAgICAgdXJsID0gY2MudXJsLnJhdyhcInJlc291cmNlcy9zb3VuZHMvbW9zdC5tcDNcIik7XG4gICAgICAgIGNjLmxvYWRlci5sb2FkUmVzKHVybCwgZnVuY3Rpb24gKCkge30pO1xuXG4gICAgICAgIHVybCA9IGNjLnVybC5yYXcoXCJyZXNvdXJjZXMvc291bmRzL2J1dHRvbi5tcDNcIik7XG4gICAgICAgIGNjLmxvYWRlci5sb2FkUmVzKHVybCwgZnVuY3Rpb24gKCkge30pO1xuICAgICAgICB1cmwgPSBjYy51cmwucmF3KFwicmVzb3VyY2VzL3NvdW5kcy9lbmQubXAzXCIpO1xuICAgICAgICBjYy5sb2FkZXIubG9hZFJlcyh1cmwsIGZ1bmN0aW9uICgpIHt9KTtcblxuICAgICAgICB1cmwgPSBjYy51cmwucmF3KFwicmVzb3VyY2VzL3NvdW5kcy9jaF9yaWdodC5tcDNcIik7XG4gICAgICAgIGNjLmxvYWRlci5sb2FkUmVzKHVybCwgZnVuY3Rpb24gKCkge30pO1xuXG4gICAgICAgIHVybCA9IGNjLnVybC5yYXcoXCJyZXNvdXJjZXMvc291bmRzL2NrX2Vycm9yLm1wM1wiKTtcbiAgICAgICAgY2MubG9hZGVyLmxvYWRSZXModXJsLCBmdW5jdGlvbiAoKSB7fSk7XG5cbiAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBjYXRfY29tID0gY2MuZmluZChcIlVJX1JPT1QvYW5jaG9yLWNlbnRlci9jYXRcIikuZ2V0Q29tcG9uZW50KHNwLlNrZWxldG9uKTtcbiAgICAgICAgICAgIGNhdF9jb20uY2xlYXJUcmFja3MoKTtcbiAgICAgICAgICAgIGNhdF9jb20uc2V0QW5pbWF0aW9uKDAsIFwiaWRsZV8yXCIsIHRydWUpO1xuICAgICAgICB9KS5iaW5kKHRoaXMpLCAwLjgpO1xuICAgICAgICB0aGlzLnN0YXJ0ZWQgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgb25fZ2FtZV9zdGFydF9jbGljazogZnVuY3Rpb24gb25fZ2FtZV9zdGFydF9jbGljaygpIHtcbiAgICAgICAgaWYgKHRoaXMuc3RhcnRlZCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zdGFydGVkID0gdHJ1ZTtcbiAgICAgICAgY2MuYXVkaW9FbmdpbmUuc3RvcE11c2ljKGZhbHNlKTtcbiAgICAgICAgdmFyIHVybCA9IGNjLnVybC5yYXcoXCJyZXNvdXJjZXMvc291bmRzL2J1dHRvbi5tcDNcIik7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHVybCk7XG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlNdXNpYyh1cmwsIGZhbHNlKTtcblxuICAgICAgICB2YXIgbW92ZV9jb20gPSBjYy5maW5kKFwiVUlfUk9PVC9hbmNob3ItY2VudGVyL2xvZ29cIikuZ2V0Q29tcG9uZW50KFwibW92ZV9hY3Rpb25cIik7XG4gICAgICAgIHZhciBwYXRfY29tID0gY2MuZmluZChcIlVJX1JPT1QvYW5jaG9yLWNlbnRlci9jbGlja19ub2RlXCIpLmdldENvbXBvbmVudChcInBhdF9hY3Rpb25cIik7XG5cbiAgICAgICAgbW92ZV9jb20ubW92ZV9iYWNrKCk7XG4gICAgICAgIHBhdF9jb20ubW92ZV9iYWNrKCk7XG5cbiAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKFwiZ2FtZV9zY2VuZVwiKTtcbiAgICAgICAgfSwgMC42KTtcbiAgICB9LFxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcbiAgICAgICAgdmFyIHdpbl9zaXplID0gY2MuZGlyZWN0b3IuZ2V0V2luU2l6ZSgpO1xuICAgICAgICBpZiAod2luX3NpemUud2lkdGggIT0gdGhpcy5wcmV2X3NpemUud2lkdGggfHwgd2luX3NpemUuaGVpZ2h0ICE9IHRoaXMucHJldl9zaXplLmhlaWdodCkge1xuICAgICAgICAgICAgdGhpcy5wcmV2X3NpemUgPSB3aW5fc2l6ZTtcbiAgICAgICAgICAgIHRoaXMuYWRqdXN0X3dpbmRvdyh3aW5fc2l6ZSk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7Il19
