require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"car_part":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'd94447VWi9KMKeD75xapymM', 'car_part');
// scriptes\car_part.js

var decorative_params = cc.Class({
    name: 'decorative_params',
    properties: {
        main_type: 0,
        sub_type: 0,
        xpos: 0,
        ypos: 0
    }
});

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
        front_items: {
            "default": [],
            type: cc.Prefab
        },
        back_items: {
            "default": [],
            type: cc.Prefab
        },

        dst_pos: {
            "default": null,
            type: cc.Vec2
        },
        car_part_type: 0,
        main_type: 0,

        decorative_item: {
            "default": [],
            type: decorative_params
        },
        start_scale: 1.0
    },

    // use this for initialization
    onLoad: function onLoad() {
        console.log("car part onload");
        this.move_hit = false;
        this.dst_root = cc.find("UI_ROOT/anchor-center/car_root");
        this.game_scene = cc.find("UI_ROOT").getComponent("game_scene");
        this.node.scale = this.start_scale;

        this.node.on('touchstart', (function (event) {
            if (this.move_hit === true) {
                return;
            }

            this.move_hit = false;
            var bound_box = this.node.getBoundingBox();
            var pos = this.node.getParent().convertTouchToNodeSpace(event);
            if (bound_box.contains(pos)) {
                event.stopPropagation();
            }
        }).bind(this));

        this.node.on('touchmove', (function (event) {
            if (this.move_hit === true) {
                return;
            }

            var pos = this.node.getParent().convertTouchToNodeSpace(event);
            this.node.setPosition(pos);
            this.node.scale = 1;
            var world_dst_pos = this.dst_root.convertToWorldSpace(this.dst_pos);

            var world_pos = event.getLocation();
            // 绘制提示
            this.game_scene.show_game_tip_car_part(this.car_part_type, world_dst_pos);
            // end
            if (cc.pDistance(world_pos, world_dst_pos) <= 200) {
                //
                this.on_hit_item(world_dst_pos);
            }
        }).bind(this));

        this.node.on('touchend', this.on_touch_ended.bind(this));
        this.node.on('touchcancel', this.on_touch_ended.bind(this));
    },

    on_hit_item: function on_hit_item(world_dst_pos) {
        var delay_time = this.game_scene.change_car_part(this.node, this.car_part_type, this.main_type);
        this.move_hit = true;
        var local_pos = this.node.getParent().convertToNodeSpaceAR(world_dst_pos);
        var moveby = cc.moveTo(0.2, local_pos);
        var callback = cc.callFunc((function () {}).bind(this), this);

        var seq = cc.sequence([moveby, callback]);
        this.node.runAction(seq);
    },

    on_touch_ended: function on_touch_ended() {
        // this.node.opacity = 255;
        if (this.move_hit === false) {
            this.node.setPosition(this.start_pos);
            this.node.scale = this.start_scale;
        }
        this.game_scene.hide_game_tip_car_part();
    },

    set_start_pos: function set_start_pos(x, y) {
        this.start_pos = cc.p(x, y);
        this.node.x = x;
        this.node.y = y;
    },

    move_back: function move_back() {
        var m = cc.moveTo(0.2, this.start_pos);
        var func = cc.callFunc((function () {
            this.move_hit = false;
        }).bind(this), this);
        var seq = cc.sequence([m, func]);
        this.node.runAction(seq);
        this.node.active = true;
        this.node.scale = this.start_scale;
        return 0.2;
    },

    invalid_hit_move: function invalid_hit_move() {
        console.log("invalid_hit_move");
        this.move_hit = true;
    }
});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"decorative_part":[function(require,module,exports){
"use strict";
cc._RFpush(module, '23fa48O809MH5nq2xoISYfl', 'decorative_part');
// scriptes\decorative_part.js

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
        sub_type: 0,
        main_type: 0,
        start_scale: 1.0,

        start_x: 0,
        start_y: 0
    },

    // use this for initialization
    onLoad: function onLoad() {

        this.move_hit = false;
        this.invalid_move_hit = false;
        this.move_success = false;
        this.dst_root = cc.find("UI_ROOT/anchor-center/car_root");
        this.game_scene = cc.find("UI_ROOT").getComponent("game_scene");
        // this.node.scale = this.start_scale;
        this.node.on('touchstart', (function (event) {
            // console.log("this.invalid_move_hit = " + this.invalid_move_hit)
            // console.log("this.move_hit = " + this.move_hit)
            this.start_pos = cc.p(this.node.x, this.node.y);
            if (this.invalid_move_hit === true || this.move_hit === true) {
                return;
            }

            this.move_hit = false;
            var bound_box = this.node.getBoundingBox();
            var pos = this.node.getParent().convertTouchToNodeSpace(event);
            if (bound_box.contains(pos)) {
                event.stopPropagation();
            }
        }).bind(this));

        this.node.on('touchmove', (function (event) {
            // console.log("this.invalid_move_hit = " + this.invalid_move_hit)
            // console.log("this.move_hit = " + this.move_hit)

            if (this.invalid_move_hit === true || this.move_hit === true) {
                return;
            }

            var pos = this.node.getParent().convertTouchToNodeSpace(event);
            this.node.setPosition(pos);

            var world_pos = event.getLocation();
            this.game_scene.hit_machine_man_part(this, world_pos, this.main_type, this.sub_type);
        }).bind(this));

        this.node.on('touchend', this.on_touch_ended.bind(this));
        this.node.on('touchcancel', this.on_touch_ended.bind(this));
    },
    on_touch_ended: function on_touch_ended() {
        if (this.invalid_move_hit === true) {
            return;
        }

        // this.node.opacity = 255;
        if (this.move_hit === false && this.move_success === false) {
            this.node.setPosition(this.start_pos);
            // this.node.scale = this.start_scale;
        } else {
                this.move_success = false;
                this.move_hit = false;
            }
    },

    on_hit_item: function on_hit_item(delay_time, to_w_pos) {
        this.move_hit = true;
        this.move_success = true;
        var local_pos = this.node.getParent().convertToNodeSpaceAR(to_w_pos);
        var moveby = cc.moveTo(0.2, local_pos);
        var callback = cc.callFunc((function () {
            // this.move_hit = false;
            this.game_scene.enter_next_mode();
        }).bind(this), this);

        var seq = cc.sequence([moveby, callback]);
        this.node.runAction(seq);
    },

    move_back: function move_back() {
        var m = cc.moveTo(0.2, this.start_pos);
        var func = cc.callFunc((function () {
            this.move_hit = false;
        }).bind(this), this);
        var seq = cc.sequence([m, func]);
        this.node.runAction(seq);
        // this.node.runAction(cc.scaleTo(0.2, this.start_scale));
        return 0.2;
    },

    invalid_hit_move: function invalid_hit_move() {
        this.invalid_move_hit = true;
    },

    valid_hit_move: function valid_hit_move() {
        this.invalid_move_hit = false;
    }
});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"elec_device":[function(require,module,exports){
"use strict";
cc._RFpush(module, '630aaoSmGpLypvOMByT9Ztv', 'elec_device');
// scriptes\elec_device.js

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

        elec_type: 1
    },

    is_ui_drag: function is_ui_drag() {
        return this.is_drag_item;
    },

    set_ui_drag: function set_ui_drag() {
        this.is_drag_item = true;
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.is_drag_item = false;
        this.game_scene = cc.find("UI_ROOT").getComponent("game_scene");
        this.hited = false;

        if (this.elec_type <= 9) {
            this.off = this.node.getChildByName("off");
            this.on = this.node.getChildByName("on");
        } else {
            this.elec_value = this.node.getChildByName("elec_value");
        }
        this.mode = 0;
        this.v = 100;

        // touch
        this.is_invalid_touch = false;
        this.node.on(cc.Node.EventType.TOUCH_START, (function (event) {
            event.stopPropagation();
            this.node.setLocalZOrder(1000);
            this.hited = false;
        }).bind(this));
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (function (event) {
            this.on_touch_moved(event);
        }).bind(this));

        this.node.on(cc.Node.EventType.TOUCH_END, (function (event) {
            this.node.setLocalZOrder(0);
            if (this.is_invalid_touch) {
                return;
            }
            var w_pos = event.getLocation();
            var is_hit = this.game_scene.on_hit_test(this.node, this.elec_type, w_pos);
            if (this.is_drag_item === false) {
                // 删除
                this.node.removeFromParent();
                return;
            }
            /*if(is_hited) {
                this.node.opacity = 0;
                this.hited = true;
                this.node.x = this.start_x;
                this.node.y = this.start_y;
            }*/

            this.node.x = this.start_x;
            this.node.y = this.start_y;
            this.node.opacity = 0;
            this.hited = false;
        }).bind(this));
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, (function (event) {
            this.node.setLocalZOrder(0);
            if (this.is_invalid_touch) {
                return;
            }

            var w_pos = event.getLocation();
            var is_hit = this.game_scene.on_hit_test(this.node, this.elec_type, w_pos);
            if (this.is_drag_item === false) {
                // 删除
                this.node.removeFromParent();
                return;
            }

            this.node.x = this.start_x;
            this.node.y = this.start_y;
            this.node.opacity = 0;
            this.hited = false;
        }).bind(this));
        // end
    },

    set_start_pos: function set_start_pos(xpos, ypos) {
        this.start_x = xpos;
        this.start_y = ypos;
    },

    on_touch_moved: function on_touch_moved(event) {
        if (this.is_invalid_touch === true || this.hited) {
            // 屏蔽掉这个消息。
            return;
        }

        var w_pos = event.getLocation();
        this.node.opacity = 128;

        var pos = this.node.parent.convertToNodeSpace(w_pos);
        this.node.x = pos.x;
        this.node.y = pos.y;
        /*
        var is_hited = this.game_scene.on_hit_test(this.node, this.elec_type, w_pos);
        if(is_hited) {
            this.node.opacity = 0;
            this.hited = true;
            this.node.x = this.start_x;
            this.node.y = this.start_y;
        }*/
    },

    invalid_touch: function invalid_touch() {
        this.is_invalid_touch = true;
    },

    start: function start() {
        this.node.setCascadeOpacityEnabled(true);
        this.show_when_failed();
        // this.show_when_success();
        // this.show_anim_not_conneced();
    },

    show_when_success: function show_when_success() {
        if (this.elec_type <= 9) {
            this.off.active = false;
            this.on.active = true;
            return;
        } else {
            // this.elec_value.height = 69;
            this.show_anim_conneced();
        }
    },

    show_when_failed: function show_when_failed() {
        if (this.elec_type <= 9) {
            this.off.active = true;
            this.on.active = false;
            return;
        } else {
            this.elec_value.height = 0;
        }
    },

    show_anim_not_conneced: function show_anim_not_conneced() {
        this.mode = 2;
        this.step = 0;
    },

    show_anim_conneced: function show_anim_conneced() {
        this.mode = 1;
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        if (this.elec_type <= 9) {
            return;
        }

        if (this.mode === 0) {
            return;
        }

        if (this.mode === 2 && this.step === 0) {
            // 涨
            var s = this.v * dt;
            this.elec_value.height += s;
            if (this.elec_value.height >= 69) {
                // 涨停
                this.step = 1;
                this.elec_value.height = 69;
            }
        } else if (this.mode === 2 && this.step === 1) {
            // 跌停
            var s = this.v * dt;
            this.elec_value.height -= s;
            if (this.elec_value.height <= 0) {
                // 跌停
                this.mode = 0;
            }
        } else if (this.mode === 1) {
            // 成功涨到最高。
            var s = this.v * dt;
            this.elec_value.height += s;
            if (this.elec_value.height >= 69) {
                // 涨停
                this.mode = 0;
                this.elec_value.height = 69;
            }
        }
    }
});

cc._RFpop();
},{}],"game_scene":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'da7e14XrzRHt4f9XgBparwM', 'game_scene');
// scriptes\game_scene.js

var decro_prefab_set = cc.Class({
    name: 'decro_prefab_set',
    properties: {
        sub_set: {
            "default": [],
            type: cc.Prefab
        }
    }
});

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

        header_set: {
            "default": [],
            type: cc.Prefab
        },

        body_set: {
            "default": [],
            type: cc.Prefab
        },

        foot_set: {
            "default": [],
            type: cc.Prefab
        },

        left_hand_set: {
            "default": [],
            type: cc.Prefab
        },

        right_hand_set: {
            "default": [],
            type: cc.Prefab
        }
    },

    // use this for initialization
    preload_sound: function preload_sound() {
        var sound_list = ["resources/sounds/bones_in.mp3", "resources/sounds/go_auto.mp3", "resources/sounds/move_parts.mp3", "resources/sounds/ping_ok.mp3", "resources/sounds/play.mp3", "resources/sounds/kim_clk2.mp3", "resources/sounds/kim_clk1.mp3", "resources/sounds/end.mp3", "resources/sounds/hanjie.mp3", "resources/sounds/man_voice.mp3"];

        for (var i = 0; i < sound_list.length; i++) {
            var url = cc.url.raw(sound_list[i]);
            cc.loader.loadRes(url, function () {});
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.game_start = false;

        this.ske_kim_com = cc.find("UI_ROOT/anchor-center/kim").getComponent(sp.Skeleton);
        this.game_mode = 0;
        this.lock_kim_click = false;

        this.checkout_root = cc.find("UI_ROOT/check_out_root");
        this.checkout_root.active = false;

        this.game_mode_tip = cc.find("UI_ROOT/anchor-center/mask");
        this.parts = cc.find("UI_ROOT/anchor-center/parts");
        this.man_root = cc.find("UI_ROOT/anchor-center/man_body_root");

        this.left_worker = cc.find("UI_ROOT/anchor-center/left_worker");

        this.right_worker = cc.find("UI_ROOT/anchor-center/right_worker");
        this.top_worker = cc.find("UI_ROOT/anchor-center/top_worker");
    },

    show_game_stage_tip: function show_game_stage_tip(game_mode) {
        var i;
        for (i = 1; i <= 5; i++) {
            var node = this.game_mode_tip.getChildByName("" + i);
            node.active = false;
        }

        var now = this.game_mode_tip.getChildByName("" + game_mode);
        now.active = true;
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

    save_manchine_part_pos: function save_manchine_part_pos() {
        this.part_pos = [];
        for (var i = 1; i <= 5; i++) {
            var name = "tw" + i + "1";
            var node = this.man_root.getChildByName(name);
            this.part_pos.push(cc.p(node.x, node.y));
        }
        this.face_y = this.man_root.getChildByName("face").y;
    },

    start: function start() {
        this.left_worker.x = -815;
        this.left_worker.y = 510;

        //
        this.save_manchine_part_pos();
        //
        this.lock_kim_click = true;
        this.call_latter((function () {
            this.ske_kim_com.clearTracks();
            this.ske_kim_com.setAnimation(0, "idle_1", true);
            this.lock_kim_click = false;
        }).bind(this), 0.9);
        this.on_start_game();
    },

    play_sound: function play_sound(name) {
        var url_data = cc.url.raw(name);
        cc.audioEngine.stopMusic();
        cc.audioEngine.playMusic(url_data);
    },

    play_sound_loop: function play_sound_loop(name) {
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

    play_kim_anim_with_right: function play_kim_anim_with_right() {
        this.ske_kim_com.clearTracks();
        this.ske_kim_com.setAnimation(0, "ok_1", false);
        this.call_latter((function () {
            this.ske_kim_com.clearTracks();
            this.ske_kim_com.setAnimation(0, "idle_1", true);
        }).bind(this), 2);
        // this.play_sound("resources/sounds/ch_right.mp3");
    },

    play_kim_anim_with_error: function play_kim_anim_with_error() {
        this.ske_kim_com.clearTracks();
        this.ske_kim_com.setAnimation(0, "err_1", false);
        this.call_latter((function () {
            this.ske_kim_com.clearTracks();
            this.ske_kim_com.setAnimation(0, "idle_1", true);
        }).bind(this), 1.5);
        // this.play_sound("resources/sounds/ck_error.mp3");
    },

    on_start_game: function on_start_game() {
        if (this.game_start === true) {
            return;
        }
        this.man_root.removeAllChildren();
        this.play_sound("resources/sounds/5start.mp3");
        this.game_start = true;
        this.lock_move_back = false;
        this.lock_destroy = false;
        this.game_mode = 1;

        this.scheduleOnce((function () {
            this.enter_first_mode();
        }).bind(this), 3);
    },

    new_part_set: function new_part_set(step_parts) {
        this.parts.removeAllChildren();
        this.part_set = [];
        for (var i = 0; i < step_parts.length; i++) {
            var item = cc.instantiate(step_parts[i]);
            var com = item.getComponent("decorative_part");
            item.active = true;
            item.parent = this.parts;
            item.x = com.start_x;
            item.y = com.start_y;
            item.active = true;
            this.part_set.push(item);
            com.invalid_hit_move();
        }
        //
        this.part_set.sort(function () {
            return Math.random() - 0.5;
        });
        this.part_now_index = 0;
    },

    select_part: function select_part() {
        // -815, 510,  -815, 728, -1252, 728, -1252, 449
        var time = 0.5 * 1.5;
        var m1 = cc.moveBy(time, 0, 218);
        var m2 = cc.moveBy(time, -437, 0);
        var m3 = cc.moveBy(time, 0, -279);
        var m4 = cc.moveBy(time, 0, 279);
        var m5 = cc.moveBy(time, 437, 0);
        var m6 = cc.moveBy(time, 0, -218);

        var now_part = this.part_set[this.part_now_index];
        var com = now_part.getComponent("decorative_part");
        com.invalid_hit_move();
        this.select_item = now_part;
        this.lock_move_back = true;
        this.play_sound("resources/sounds/bones_in.mp3");

        var func = cc.callFunc((function () {
            // var com = now_part.getComponent("decorative_part");
            // now_part.runAction(cc.moveTo(time, com.dst_x, com.dst_y));
            this.play_sound("resources/sounds/bones_in.mp3");
            var mm1 = cc.moveBy(time, 0, 279);
            var mm2 = cc.moveBy(time, 437, 0);
            var mm3 = cc.moveBy(time, 0, -218);
            var seq2 = cc.sequence([mm1, mm2, mm3]);
            now_part.runAction(seq2);
        }).bind(this), this);

        var end_func = cc.callFunc((function () {
            this.lock_move_back = false;
            var com = now_part.getComponent("decorative_part");
            com.valid_hit_move();
        }).bind(this), this);

        var seq = cc.sequence([m1, m2, m3, func, m4, m5, m6, end_func]);
        this.left_worker.runAction(seq);
    },

    move_part_back_when_destroy: function move_part_back_when_destroy() {
        if (this.lock_move_back === true && this.game_mode < 6) {
            return;
        }

        // var prev_part = this.part_set[this.part_now_index];
        var prev_part = this.select_item;

        this.lock_move_back = true;
        var time = 0.5 * 1.5;

        var func = cc.callFunc((function () {
            var mmm1 = cc.moveBy(time, 0, 218);
            var mmm2 = cc.moveBy(time, -437, 0);
            var mmm3 = cc.moveBy(time, 0, -279);
            var seq_mmm = cc.sequence([mmm1, mmm2, mmm3]);
            if (prev_part) {
                var com = prev_part.getComponent("decorative_part");
                com.invalid_hit_move();
                prev_part.runAction(seq_mmm);
            }
        }).bind(this), this);

        var func2 = cc.callFunc((function () {
            this.game_mode = 1;
            this.new_part_set(this.header_set);
            this.part_now_index = 0;
            var now_part = this.part_set[this.part_now_index];

            var mm1 = cc.moveBy(time, 0, 279);
            var mm2 = cc.moveBy(time, 437, 0);
            var mm3 = cc.moveBy(time, 0, -218);
            var seq2 = cc.sequence([mm1, mm2, mm3]);
            var com = now_part.getComponent("decorative_part");
            com.invalid_hit_move();
            now_part.runAction(seq2);
            this.select_item = now_part;
        }).bind(this), this);

        var end_func = cc.callFunc((function () {
            this.lock_move_back = false;
            var com = this.select_item.getComponent("decorative_part");
            com.valid_hit_move();
        }).bind(this), this);

        var m1 = cc.moveBy(time, 0, 218);
        var m2 = cc.moveBy(time, -437, 0);
        var m3 = cc.moveBy(time, 0, -279);
        var m4 = cc.moveBy(time, 0, 279);
        var m5 = cc.moveBy(time, 437, 0);
        var m6 = cc.moveBy(time, 0, -218);

        var seq = cc.sequence([func, m1, m2, m3, func2, m4, m5, m6, end_func]);
        this.left_worker.runAction(seq);
    },

    move_part_back: function move_part_back() {
        if (this.lock_move_back === true) {
            return;
        }

        var time = 0.5 * 1.5;
        // var prev_part = this.part_set[this.part_now_index];
        var prev_part = this.select_item;

        this.part_now_index++;
        this.lock_move_back = true;
        if (this.part_now_index >= this.part_set.length) {
            this.part_now_index = 0;
        }
        var now_part = this.part_set[this.part_now_index];

        this.play_sound("resources/sounds/bones_in.mp3");
        var func = cc.callFunc((function () {
            var mmm1 = cc.moveBy(time, 0, 218);
            var mmm2 = cc.moveBy(time, -437, 0);
            var mmm3 = cc.moveBy(time, 0, -279);
            var seq_mmm = cc.sequence([mmm1, mmm2, mmm3]);
            if (prev_part) {
                var com = prev_part.getComponent("decorative_part");
                com.invalid_hit_move();
                prev_part.runAction(seq_mmm);
            }
        }).bind(this), this);

        var func2 = cc.callFunc((function () {
            this.play_sound("resources/sounds/bones_in.mp3");
            var mm1 = cc.moveBy(time, 0, 279);
            var mm2 = cc.moveBy(time, 437, 0);
            var mm3 = cc.moveBy(time, 0, -218);
            var seq2 = cc.sequence([mm1, mm2, mm3]);
            var com = now_part.getComponent("decorative_part");
            com.invalid_hit_move();
            now_part.runAction(seq2);
        }).bind(this), this);

        var end_func = cc.callFunc((function () {
            this.lock_move_back = false;
            var com = now_part.getComponent("decorative_part");
            com.valid_hit_move();
            this.select_item = now_part;
        }).bind(this), this);

        var m1 = cc.moveBy(time, 0, 218);
        var m2 = cc.moveBy(time, -437, 0);
        var m3 = cc.moveBy(time, 0, -279);
        var m4 = cc.moveBy(time, 0, 279);
        var m5 = cc.moveBy(time, 437, 0);
        var m6 = cc.moveBy(time, 0, -218);

        var seq = cc.sequence([func, m1, m2, m3, func2, m4, m5, m6, end_func]);
        this.left_worker.runAction(seq);
    },

    enter_first_mode: function enter_first_mode() {
        this.show_game_stage_tip(this.game_mode);
        // 将零件new出来
        this.new_part_set(this.header_set);
        // end
        this.select_part();
    },

    replace_item: function replace_item() {
        var item;
        if (this.hit_main_type === 1) {
            // 头
            item = cc.instantiate(this.header_set[this.hit_sub_type]);
            item.active = true;
            item.parent = this.man_root;
            item.x = this.part_pos[this.game_mode - 1].x;
            item.y = this.part_pos[this.game_mode - 1].y;
            var com = item.getComponent("decorative_part");
            com.invalid_hit_move();
        } else if (this.hit_main_type === 2) {
            item = cc.instantiate(this.body_set[this.hit_sub_type]);
            item.active = true;
            item.parent = this.man_root;
            item.x = this.part_pos[this.game_mode - 1].x;
            item.y = this.part_pos[this.game_mode - 1].y;
            var com = item.getComponent("decorative_part");
            com.invalid_hit_move();
        } else if (this.hit_main_type === 3) {
            item = cc.instantiate(this.foot_set[this.hit_sub_type]);
            item.active = true;
            item.parent = this.man_root;
            item.x = this.part_pos[this.game_mode - 1].x;
            item.y = this.part_pos[this.game_mode - 1].y;
            var com = item.getComponent("decorative_part");
            com.invalid_hit_move();
        } else if (this.hit_main_type === 4) {
            item = cc.instantiate(this.left_hand_set[this.hit_sub_type]);
            item.active = true;
            item.parent = this.man_root;
            item.x = this.part_pos[this.game_mode - 1].x;
            item.y = this.part_pos[this.game_mode - 1].y;
            var com = item.getComponent("decorative_part");
            com.invalid_hit_move();
        } else if (this.hit_main_type === 5) {
            item = cc.instantiate(this.right_hand_set[this.hit_sub_type]);
            item.active = true;
            item.parent = this.man_root;
            item.x = this.part_pos[this.game_mode - 1].x;
            item.y = this.part_pos[this.game_mode - 1].y;
            var com = item.getComponent("decorative_part");
            com.invalid_hit_move();
        }
    },

    destroy_machine_man: function destroy_machine_man() {
        // 0, 880, 0, 340
        console.log(this.lock_move_back);
        console.log(this.lock_destroy);
        console.log(this.game_mode);

        if (this.lock_move_back && this.game_mode < 6 || this.lock_destroy || this.game_mode <= 1) {
            return;
        }

        this.lock_destroy = true;
        if (this.select_item) {
            this.select_item.getComponent("decorative_part").invalid_hit_move();
        }
        this.top_worker.y = 1180;

        var m = cc.moveBy(1, 0, -840);
        var m2 = cc.moveBy(1, 0, 840);

        var func = cc.callFunc((function () {
            var mm = cc.moveBy(1, 0, 840);
            this.man_root.runAction(mm);
        }).bind(this), this);

        var end_func = cc.callFunc((function () {
            this.man_root.x = 0;
            this.man_root.y = 0;
            this.man_root.removeAllChildren();
            this.top_worker.y = 1180;
            this.lock_destroy = false;
            // this.game_start = false;
            // this.on_start_game();
            // this.game_mode = 0;
            // this.goto_next_part();
            // this.move_part_back();
            this.move_part_back_when_destroy();
        }).bind(this), this);
        var seq = cc.sequence([m, func, m2, end_func]);
        this.top_worker.runAction(seq);
    },

    goto_next_part: function goto_next_part() {
        this.parts.removeAllChildren();
        this.game_mode++;
        if (this.game_mode > 5) {
            // 跳表情
            var index = 1 + Math.random() * 9;
            index = Math.floor(index);
            if (index > 9) {
                index = 9;
            }

            this.play_sound_loop("resources/sounds/man_voice.mp3");
            var item = new cc.Node();
            var url = cc.url.raw("resources/texture/game_scene/face" + index + ".png");
            var s = item.addComponent(cc.Sprite);
            s.spriteFrame = new cc.SpriteFrame(url);

            item.parent = this.man_root;
            item.x = 0;
            item.y = this.face_y;

            item.opacity = 0;
            item.runAction(cc.fadeIn(0.5));

            return;
        }

        this.show_game_stage_tip(this.game_mode);
        if (this.game_mode === 1) {
            this.new_part_set(this.header_set);
        } else if (this.game_mode === 2) {
            this.new_part_set(this.body_set);
        } else if (this.game_mode === 3) {
            this.new_part_set(this.foot_set);
        } else if (this.game_mode === 4) {
            this.new_part_set(this.left_hand_set);
        } else if (this.game_mode === 5) {
            this.new_part_set(this.right_hand_set);
        }
        this.select_part();
    },

    enter_next_mode: function enter_next_mode() {
        if (this.hit_item != null) {
            this.replace_item();
            this.select_item = null;
        }

        if (this.game_mode === 1) {
            // 不用播放焊接动画
            this.play_sound("resources/sounds/3head.mp3");
            this.scheduleOnce((function () {
                this.goto_next_part();
            }).bind(this), 3);
            return;
        }

        // play 动画
        var old_pos = cc.p(this.right_worker.x, this.right_worker.y);
        var pos = this.part_pos[this.game_mode - 1];
        if (this.game_mode === 2) {
            pos = this.part_pos[0];
        }

        var w_pos = this.man_root.convertToWorldSpaceAR(pos);
        pos = this.node.convertToNodeSpaceAR(w_pos);
        var m1 = cc.moveTo(1, pos);

        var func2 = cc.callFunc((function () {
            this.play_sound("resources/sounds/hanjie.mp3");
            var part = this.right_worker.getChildByName("hanjie").getComponent(cc.ParticleSystem);
            part.stopSystem();
            part.resetSystem();
        }).bind(this), this);

        var m2 = cc.moveTo(1, old_pos);
        var func = cc.callFunc((function () {
            this.goto_next_part();
        }).bind(this), this);
        // end

        var func3 = cc.callFunc((function () {
            switch (this.game_mode) {
                case 1:
                    this.play_sound("resources/sounds/3head.mp3");
                    break;
                case 2:
                    this.play_sound("resources/sounds/2body.mp3");
                    break;
                case 3:
                    this.play_sound("resources/sounds/6tui.mp3");
                    break;
                case 4:
                    this.play_sound("resources/sounds/1arm.mp3");
                    break;
                case 5:
                    this.play_sound("resources/sounds/1arm.mp3");
                    break;
            }
        }).bind(this), this);
        var seq = cc.sequence([m1, func2, cc.delayTime(1), m2, func3, cc.delayTime(3), func]);
        this.right_worker.runAction(seq);
    },

    hit_machine_man_part: function hit_machine_man_part(item, w_pos, main_type, sub_type) {
        var dst_pos = this.part_pos[this.game_mode - 1];
        var w_dst_pos = this.man_root.convertToWorldSpaceAR(dst_pos);

        if (cc.pDistance(w_pos, w_dst_pos) <= 120) {
            this.lock_move_back = true;
            item.on_hit_item(0.2, w_dst_pos);
            item.invalid_hit_move();
            this.hit_item = item;
            this.hit_main_type = main_type;
            this.hit_sub_type = sub_type;
        }
    },

    checkout_game: function checkout_game() {
        if (this.game_start === false || this.game_mode <= 5) {
            return;
        }

        this.play_sound("resources/sounds/end.mp3");
        var check_root = cc.find("UI_ROOT/check_out_root");
        check_root.active = true;
        this.game_start = false;
    },

    on_replay_game: function on_replay_game() {
        var check_root = cc.find("UI_ROOT/check_out_root");
        check_root.active = false;
        this.on_start_game();
    },

    on_kim_click: function on_kim_click() {
        if (this.lock_kim_click === true) {
            return;
        }
        this.play_kim_click_anim_with_random();
    }
});

cc._RFpop();
},{}],"move_action":[function(require,module,exports){
"use strict";
cc._RFpush(module, '1b8946T+rhAyLVMDteHhEWy', 'move_action');
// scriptes\move_action.js

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
cc._RFpush(module, '90b0cTThOtChpjwo5pDs3yv', 'pat_action');
// scriptes\pat_action.js

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
},{}],"rot_action":[function(require,module,exports){
"use strict";
cc._RFpush(module, '66843mbRJVLfoWSr621Udak', 'rot_action');
// scriptes\rot_action.js

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
        rot_time: 0,
        rot_by: 360,
        is_loop: true,
        play_onload: true,
        play_onload_delay: 0
    },

    // use this for initialization
    onLoad: function onLoad() {
        if (this.play_onload) {
            if (this.play_onload_delay > 0) {
                this.scheduleOnce(this.play.bind(this), this.play_onload_delay);
            } else {
                this.play();
            }
        }
    },

    play: function play() {
        var r = cc.rotateBy(this.rot_time, this.rot_by);
        var action_set = [];
        var r_action;
        action_set.push(r);

        var seq = cc.sequence(action_set);
        if (this.is_loop) {
            var f = cc.repeatForever(seq);
            r_action = f;
        } else {
            r_action = seq;
        }

        this.node.runAction(r_action);
    }

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"scale_action":[function(require,module,exports){
"use strict";
cc._RFpush(module, '19c02Sq5I9MsrnE5szijNvf', 'scale_action');
// scriptes\scale_action.js

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
        dst_scale: 0,
        scale_time: 0.2
    },

    // use this for initialization
    onLoad: function onLoad() {
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
        var s = cc.scaleTo(this.scale_time, this.dst_scale);
        this.node.runAction(s);
    }
});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"scale_min_to_max":[function(require,module,exports){
"use strict";
cc._RFpush(module, '42f3dCTu/5GD6xNQVEZpMbe', 'scale_min_to_max');
// scriptes\scale_min_to_max.js

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
        max_time: 0.4,
        min_time: 0.4,
        max_scale: 1.2,
        min_scale: 0.8,
        delay_time: 0,
        is_rev: false,
        play_onload: false
    },

    // use this for initialization
    onLoad: function onLoad() {
        if (this.play_onload) {
            this.play();
        }
    },

    play: function play() {
        var actions = [];
        if (this.is_rev) {
            var s2 = cc.scaleTo(this.min_time, this.min_scale);
            actions.push(s2);
            if (this.delay_time > 0) {
                actions.push(cc.delayTime(this.delay_time));
            }
            var s1 = cc.scaleTo(this.max_time, this.max_scale);
            actions.push(s1);
        } else {
            var s1 = cc.scaleTo(this.max_time, this.max_scale);
            actions.push(s1);
            if (this.delay_time > 0) {
                actions.push(cc.delayTime(this.delay_time));
            }
            var s2 = cc.scaleTo(this.min_time, this.min_scale);
            actions.push(s2);
        }

        var seq = cc.sequence(actions);
        var f = cc.repeatForever(seq);
        this.f = f;
        this.node.runAction(f);
    },

    stop: function stop() {
        this.node.stopAction(this.f);
    }
});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"start_scene":[function(require,module,exports){
"use strict";
cc._RFpush(module, '876c2TYxfVHOq/oOwk6m3SZ', 'start_scene');
// scriptes\start_scene.js

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
    preload_sound: function preload_sound() {
        var sound_list = ["resources/sounds/bones_in.mp3", "resources/sounds/go_auto.mp3", "resources/sounds/move_parts.mp3", "resources/sounds/ping_ok.mp3", "resources/sounds/play.mp3"];

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
    onLoad: function onLoad() {
        this.preload_sound();
    },

    on_game_start: function on_game_start() {
        var play_bk = cc.find("UI_ROOT/anchor-center/play_node/player_bk");
        play_bk.stopAllActions();
        var rot_by = cc.rotateBy(1, -360);
        play_bk.runAction(rot_by);

        this.play_sound("resources/sounds/play.mp3");
        var delay = cc.delayTime(1);
        var func = cc.callFunc((function () {
            // top
            cc.find("UI_ROOT/anchor-center/play_node").getComponent("pat_action").move_back();
            // end

            // cc.director.loadScene("game_scene");
        }).bind(this), this);

        var func2 = cc.callFunc((function () {
            cc.director.loadScene("game_scene");
        }).bind(this), this);

        var seq = cc.sequence([delay, func, cc.delayTime(0.8), func2]);
        this.node.runAction(seq);
    }
});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"talk_dlg_action":[function(require,module,exports){
"use strict";
cc._RFpush(module, '0715fxDulFJnLziJrXMgR5T', 'talk_dlg_action');
// scriptes\talk_dlg_action.js

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
        start_s: 0,
        start_x: 0,
        start_y: 0,

        scale_dx: 0,
        scale_dy: 0,
        move_dx: 0,
        move_dy: 0,

        action_time: 2,
        play_onload: true,

        fade_out_delay: 3,
        fade_action_time: 0.3,
        start_visible: false,

        play_onload_delay: 0
    },

    // use this for initialization
    onLoad: function onLoad() {
        if (this.start_visible == false) {
            this.node.scale = 0;
        }
        if (this.play_onload) {
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
        var s = cc.scaleTo(this.action_time, this.start_s + this.scale_dx, this.start_s + this.scale_dy);
        var m = cc.moveBy(this.action_time, this.move_dx, this.move_dy);

        this.node.stopAllActions();
        this.unscheduleAllCallbacks();

        this.node.scale = this.start_s;
        this.node.x = this.start_x;
        this.node.y = this.start_y;

        this.node.runAction(s);
        this.node.runAction(m);
        this.node.opacity = 255;

        this.scheduleOnce((function () {
            var f = cc.fadeOut(this.fade_action_time);
            this.node.runAction(f);
        }).bind(this), this.fade_out_delay);
    }
});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}]},{},["talk_dlg_action","scale_action","move_action","decorative_part","scale_min_to_max","elec_device","rot_action","start_scene","pat_action","car_part","game_scene"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkY6L3NvZnR3YXJlcy9Db2Nvc0NyZWF0b3JfMV8wXzEvcmVzb3VyY2VzL2FwcC5hc2FyL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvc2NyaXB0ZXMvY2FyX3BhcnQuanMiLCJhc3NldHMvc2NyaXB0ZXMvZGVjb3JhdGl2ZV9wYXJ0LmpzIiwiYXNzZXRzL3NjcmlwdGVzL2VsZWNfZGV2aWNlLmpzIiwiYXNzZXRzL3NjcmlwdGVzL2dhbWVfc2NlbmUuanMiLCJhc3NldHMvc2NyaXB0ZXMvbW92ZV9hY3Rpb24uanMiLCJhc3NldHMvc2NyaXB0ZXMvcGF0X2FjdGlvbi5qcyIsImFzc2V0cy9zY3JpcHRlcy9yb3RfYWN0aW9uLmpzIiwiYXNzZXRzL3NjcmlwdGVzL3NjYWxlX2FjdGlvbi5qcyIsImFzc2V0cy9zY3JpcHRlcy9zY2FsZV9taW5fdG9fbWF4LmpzIiwiYXNzZXRzL3NjcmlwdGVzL3N0YXJ0X3NjZW5lLmpzIiwiYXNzZXRzL3NjcmlwdGVzL3RhbGtfZGxnX2FjdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaG1CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2Q5NDQ0N1ZXaTlLTUtlRDc1eGFweW1NJywgJ2Nhcl9wYXJ0Jyk7XG4vLyBzY3JpcHRlc1xcY2FyX3BhcnQuanNcblxudmFyIGRlY29yYXRpdmVfcGFyYW1zID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdkZWNvcmF0aXZlX3BhcmFtcycsXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBtYWluX3R5cGU6IDAsXG4gICAgICAgIHN1Yl90eXBlOiAwLFxuICAgICAgICB4cG9zOiAwLFxuICAgICAgICB5cG9zOiAwXG4gICAgfVxufSk7XG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgZnJvbnRfaXRlbXM6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBbXSxcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYlxuICAgICAgICB9LFxuICAgICAgICBiYWNrX2l0ZW1zOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogW10sXG4gICAgICAgICAgICB0eXBlOiBjYy5QcmVmYWJcbiAgICAgICAgfSxcblxuICAgICAgICBkc3RfcG9zOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlZlYzJcbiAgICAgICAgfSxcbiAgICAgICAgY2FyX3BhcnRfdHlwZTogMCxcbiAgICAgICAgbWFpbl90eXBlOiAwLFxuXG4gICAgICAgIGRlY29yYXRpdmVfaXRlbToge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IFtdLFxuICAgICAgICAgICAgdHlwZTogZGVjb3JhdGl2ZV9wYXJhbXNcbiAgICAgICAgfSxcbiAgICAgICAgc3RhcnRfc2NhbGU6IDEuMFxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJjYXIgcGFydCBvbmxvYWRcIik7XG4gICAgICAgIHRoaXMubW92ZV9oaXQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5kc3Rfcm9vdCA9IGNjLmZpbmQoXCJVSV9ST09UL2FuY2hvci1jZW50ZXIvY2FyX3Jvb3RcIik7XG4gICAgICAgIHRoaXMuZ2FtZV9zY2VuZSA9IGNjLmZpbmQoXCJVSV9ST09UXCIpLmdldENvbXBvbmVudChcImdhbWVfc2NlbmVcIik7XG4gICAgICAgIHRoaXMubm9kZS5zY2FsZSA9IHRoaXMuc3RhcnRfc2NhbGU7XG5cbiAgICAgICAgdGhpcy5ub2RlLm9uKCd0b3VjaHN0YXJ0JywgKGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgaWYgKHRoaXMubW92ZV9oaXQgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMubW92ZV9oaXQgPSBmYWxzZTtcbiAgICAgICAgICAgIHZhciBib3VuZF9ib3ggPSB0aGlzLm5vZGUuZ2V0Qm91bmRpbmdCb3goKTtcbiAgICAgICAgICAgIHZhciBwb3MgPSB0aGlzLm5vZGUuZ2V0UGFyZW50KCkuY29udmVydFRvdWNoVG9Ob2RlU3BhY2UoZXZlbnQpO1xuICAgICAgICAgICAgaWYgKGJvdW5kX2JveC5jb250YWlucyhwb3MpKSB7XG4gICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLmJpbmQodGhpcykpO1xuXG4gICAgICAgIHRoaXMubm9kZS5vbigndG91Y2htb3ZlJywgKGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgaWYgKHRoaXMubW92ZV9oaXQgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBwb3MgPSB0aGlzLm5vZGUuZ2V0UGFyZW50KCkuY29udmVydFRvdWNoVG9Ob2RlU3BhY2UoZXZlbnQpO1xuICAgICAgICAgICAgdGhpcy5ub2RlLnNldFBvc2l0aW9uKHBvcyk7XG4gICAgICAgICAgICB0aGlzLm5vZGUuc2NhbGUgPSAxO1xuICAgICAgICAgICAgdmFyIHdvcmxkX2RzdF9wb3MgPSB0aGlzLmRzdF9yb290LmNvbnZlcnRUb1dvcmxkU3BhY2UodGhpcy5kc3RfcG9zKTtcblxuICAgICAgICAgICAgdmFyIHdvcmxkX3BvcyA9IGV2ZW50LmdldExvY2F0aW9uKCk7XG4gICAgICAgICAgICAvLyDnu5jliLbmj5DnpLpcbiAgICAgICAgICAgIHRoaXMuZ2FtZV9zY2VuZS5zaG93X2dhbWVfdGlwX2Nhcl9wYXJ0KHRoaXMuY2FyX3BhcnRfdHlwZSwgd29ybGRfZHN0X3Bvcyk7XG4gICAgICAgICAgICAvLyBlbmRcbiAgICAgICAgICAgIGlmIChjYy5wRGlzdGFuY2Uod29ybGRfcG9zLCB3b3JsZF9kc3RfcG9zKSA8PSAyMDApIHtcbiAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAgIHRoaXMub25faGl0X2l0ZW0od29ybGRfZHN0X3Bvcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLmJpbmQodGhpcykpO1xuXG4gICAgICAgIHRoaXMubm9kZS5vbigndG91Y2hlbmQnLCB0aGlzLm9uX3RvdWNoX2VuZGVkLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLm5vZGUub24oJ3RvdWNoY2FuY2VsJywgdGhpcy5vbl90b3VjaF9lbmRlZC5iaW5kKHRoaXMpKTtcbiAgICB9LFxuXG4gICAgb25faGl0X2l0ZW06IGZ1bmN0aW9uIG9uX2hpdF9pdGVtKHdvcmxkX2RzdF9wb3MpIHtcbiAgICAgICAgdmFyIGRlbGF5X3RpbWUgPSB0aGlzLmdhbWVfc2NlbmUuY2hhbmdlX2Nhcl9wYXJ0KHRoaXMubm9kZSwgdGhpcy5jYXJfcGFydF90eXBlLCB0aGlzLm1haW5fdHlwZSk7XG4gICAgICAgIHRoaXMubW92ZV9oaXQgPSB0cnVlO1xuICAgICAgICB2YXIgbG9jYWxfcG9zID0gdGhpcy5ub2RlLmdldFBhcmVudCgpLmNvbnZlcnRUb05vZGVTcGFjZUFSKHdvcmxkX2RzdF9wb3MpO1xuICAgICAgICB2YXIgbW92ZWJ5ID0gY2MubW92ZVRvKDAuMiwgbG9jYWxfcG9zKTtcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gY2MuY2FsbEZ1bmMoKGZ1bmN0aW9uICgpIHt9KS5iaW5kKHRoaXMpLCB0aGlzKTtcblxuICAgICAgICB2YXIgc2VxID0gY2Muc2VxdWVuY2UoW21vdmVieSwgY2FsbGJhY2tdKTtcbiAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihzZXEpO1xuICAgIH0sXG5cbiAgICBvbl90b3VjaF9lbmRlZDogZnVuY3Rpb24gb25fdG91Y2hfZW5kZWQoKSB7XG4gICAgICAgIC8vIHRoaXMubm9kZS5vcGFjaXR5ID0gMjU1O1xuICAgICAgICBpZiAodGhpcy5tb3ZlX2hpdCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHRoaXMubm9kZS5zZXRQb3NpdGlvbih0aGlzLnN0YXJ0X3Bvcyk7XG4gICAgICAgICAgICB0aGlzLm5vZGUuc2NhbGUgPSB0aGlzLnN0YXJ0X3NjYWxlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ2FtZV9zY2VuZS5oaWRlX2dhbWVfdGlwX2Nhcl9wYXJ0KCk7XG4gICAgfSxcblxuICAgIHNldF9zdGFydF9wb3M6IGZ1bmN0aW9uIHNldF9zdGFydF9wb3MoeCwgeSkge1xuICAgICAgICB0aGlzLnN0YXJ0X3BvcyA9IGNjLnAoeCwgeSk7XG4gICAgICAgIHRoaXMubm9kZS54ID0geDtcbiAgICAgICAgdGhpcy5ub2RlLnkgPSB5O1xuICAgIH0sXG5cbiAgICBtb3ZlX2JhY2s6IGZ1bmN0aW9uIG1vdmVfYmFjaygpIHtcbiAgICAgICAgdmFyIG0gPSBjYy5tb3ZlVG8oMC4yLCB0aGlzLnN0YXJ0X3Bvcyk7XG4gICAgICAgIHZhciBmdW5jID0gY2MuY2FsbEZ1bmMoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMubW92ZV9oaXQgPSBmYWxzZTtcbiAgICAgICAgfSkuYmluZCh0aGlzKSwgdGhpcyk7XG4gICAgICAgIHZhciBzZXEgPSBjYy5zZXF1ZW5jZShbbSwgZnVuY10pO1xuICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKHNlcSk7XG4gICAgICAgIHRoaXMubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB0aGlzLm5vZGUuc2NhbGUgPSB0aGlzLnN0YXJ0X3NjYWxlO1xuICAgICAgICByZXR1cm4gMC4yO1xuICAgIH0sXG5cbiAgICBpbnZhbGlkX2hpdF9tb3ZlOiBmdW5jdGlvbiBpbnZhbGlkX2hpdF9tb3ZlKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcImludmFsaWRfaGl0X21vdmVcIik7XG4gICAgICAgIHRoaXMubW92ZV9oaXQgPSB0cnVlO1xuICAgIH1cbn0pO1xuLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbi8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbi8vIH0sXG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICcyM2ZhNDhPODA5TUg1bnEyeG9JU1lmbCcsICdkZWNvcmF0aXZlX3BhcnQnKTtcbi8vIHNjcmlwdGVzXFxkZWNvcmF0aXZlX3BhcnQuanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBzdWJfdHlwZTogMCxcbiAgICAgICAgbWFpbl90eXBlOiAwLFxuICAgICAgICBzdGFydF9zY2FsZTogMS4wLFxuXG4gICAgICAgIHN0YXJ0X3g6IDAsXG4gICAgICAgIHN0YXJ0X3k6IDBcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG5cbiAgICAgICAgdGhpcy5tb3ZlX2hpdCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmludmFsaWRfbW92ZV9oaXQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5tb3ZlX3N1Y2Nlc3MgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5kc3Rfcm9vdCA9IGNjLmZpbmQoXCJVSV9ST09UL2FuY2hvci1jZW50ZXIvY2FyX3Jvb3RcIik7XG4gICAgICAgIHRoaXMuZ2FtZV9zY2VuZSA9IGNjLmZpbmQoXCJVSV9ST09UXCIpLmdldENvbXBvbmVudChcImdhbWVfc2NlbmVcIik7XG4gICAgICAgIC8vIHRoaXMubm9kZS5zY2FsZSA9IHRoaXMuc3RhcnRfc2NhbGU7XG4gICAgICAgIHRoaXMubm9kZS5vbigndG91Y2hzdGFydCcsIChmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwidGhpcy5pbnZhbGlkX21vdmVfaGl0ID0gXCIgKyB0aGlzLmludmFsaWRfbW92ZV9oaXQpXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInRoaXMubW92ZV9oaXQgPSBcIiArIHRoaXMubW92ZV9oaXQpXG4gICAgICAgICAgICB0aGlzLnN0YXJ0X3BvcyA9IGNjLnAodGhpcy5ub2RlLngsIHRoaXMubm9kZS55KTtcbiAgICAgICAgICAgIGlmICh0aGlzLmludmFsaWRfbW92ZV9oaXQgPT09IHRydWUgfHwgdGhpcy5tb3ZlX2hpdCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5tb3ZlX2hpdCA9IGZhbHNlO1xuICAgICAgICAgICAgdmFyIGJvdW5kX2JveCA9IHRoaXMubm9kZS5nZXRCb3VuZGluZ0JveCgpO1xuICAgICAgICAgICAgdmFyIHBvcyA9IHRoaXMubm9kZS5nZXRQYXJlbnQoKS5jb252ZXJ0VG91Y2hUb05vZGVTcGFjZShldmVudCk7XG4gICAgICAgICAgICBpZiAoYm91bmRfYm94LmNvbnRhaW5zKHBvcykpIHtcbiAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkuYmluZCh0aGlzKSk7XG5cbiAgICAgICAgdGhpcy5ub2RlLm9uKCd0b3VjaG1vdmUnLCAoZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInRoaXMuaW52YWxpZF9tb3ZlX2hpdCA9IFwiICsgdGhpcy5pbnZhbGlkX21vdmVfaGl0KVxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJ0aGlzLm1vdmVfaGl0ID0gXCIgKyB0aGlzLm1vdmVfaGl0KVxuXG4gICAgICAgICAgICBpZiAodGhpcy5pbnZhbGlkX21vdmVfaGl0ID09PSB0cnVlIHx8IHRoaXMubW92ZV9oaXQgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBwb3MgPSB0aGlzLm5vZGUuZ2V0UGFyZW50KCkuY29udmVydFRvdWNoVG9Ob2RlU3BhY2UoZXZlbnQpO1xuICAgICAgICAgICAgdGhpcy5ub2RlLnNldFBvc2l0aW9uKHBvcyk7XG5cbiAgICAgICAgICAgIHZhciB3b3JsZF9wb3MgPSBldmVudC5nZXRMb2NhdGlvbigpO1xuICAgICAgICAgICAgdGhpcy5nYW1lX3NjZW5lLmhpdF9tYWNoaW5lX21hbl9wYXJ0KHRoaXMsIHdvcmxkX3BvcywgdGhpcy5tYWluX3R5cGUsIHRoaXMuc3ViX3R5cGUpO1xuICAgICAgICB9KS5iaW5kKHRoaXMpKTtcblxuICAgICAgICB0aGlzLm5vZGUub24oJ3RvdWNoZW5kJywgdGhpcy5vbl90b3VjaF9lbmRlZC5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKCd0b3VjaGNhbmNlbCcsIHRoaXMub25fdG91Y2hfZW5kZWQuYmluZCh0aGlzKSk7XG4gICAgfSxcbiAgICBvbl90b3VjaF9lbmRlZDogZnVuY3Rpb24gb25fdG91Y2hfZW5kZWQoKSB7XG4gICAgICAgIGlmICh0aGlzLmludmFsaWRfbW92ZV9oaXQgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHRoaXMubm9kZS5vcGFjaXR5ID0gMjU1O1xuICAgICAgICBpZiAodGhpcy5tb3ZlX2hpdCA9PT0gZmFsc2UgJiYgdGhpcy5tb3ZlX3N1Y2Nlc3MgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICB0aGlzLm5vZGUuc2V0UG9zaXRpb24odGhpcy5zdGFydF9wb3MpO1xuICAgICAgICAgICAgLy8gdGhpcy5ub2RlLnNjYWxlID0gdGhpcy5zdGFydF9zY2FsZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1vdmVfc3VjY2VzcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMubW92ZV9oaXQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25faGl0X2l0ZW06IGZ1bmN0aW9uIG9uX2hpdF9pdGVtKGRlbGF5X3RpbWUsIHRvX3dfcG9zKSB7XG4gICAgICAgIHRoaXMubW92ZV9oaXQgPSB0cnVlO1xuICAgICAgICB0aGlzLm1vdmVfc3VjY2VzcyA9IHRydWU7XG4gICAgICAgIHZhciBsb2NhbF9wb3MgPSB0aGlzLm5vZGUuZ2V0UGFyZW50KCkuY29udmVydFRvTm9kZVNwYWNlQVIodG9fd19wb3MpO1xuICAgICAgICB2YXIgbW92ZWJ5ID0gY2MubW92ZVRvKDAuMiwgbG9jYWxfcG9zKTtcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gY2MuY2FsbEZ1bmMoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIHRoaXMubW92ZV9oaXQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZV9zY2VuZS5lbnRlcl9uZXh0X21vZGUoKTtcbiAgICAgICAgfSkuYmluZCh0aGlzKSwgdGhpcyk7XG5cbiAgICAgICAgdmFyIHNlcSA9IGNjLnNlcXVlbmNlKFttb3ZlYnksIGNhbGxiYWNrXSk7XG4gICAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24oc2VxKTtcbiAgICB9LFxuXG4gICAgbW92ZV9iYWNrOiBmdW5jdGlvbiBtb3ZlX2JhY2soKSB7XG4gICAgICAgIHZhciBtID0gY2MubW92ZVRvKDAuMiwgdGhpcy5zdGFydF9wb3MpO1xuICAgICAgICB2YXIgZnVuYyA9IGNjLmNhbGxGdW5jKChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLm1vdmVfaGl0ID0gZmFsc2U7XG4gICAgICAgIH0pLmJpbmQodGhpcyksIHRoaXMpO1xuICAgICAgICB2YXIgc2VxID0gY2Muc2VxdWVuY2UoW20sIGZ1bmNdKTtcbiAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihzZXEpO1xuICAgICAgICAvLyB0aGlzLm5vZGUucnVuQWN0aW9uKGNjLnNjYWxlVG8oMC4yLCB0aGlzLnN0YXJ0X3NjYWxlKSk7XG4gICAgICAgIHJldHVybiAwLjI7XG4gICAgfSxcblxuICAgIGludmFsaWRfaGl0X21vdmU6IGZ1bmN0aW9uIGludmFsaWRfaGl0X21vdmUoKSB7XG4gICAgICAgIHRoaXMuaW52YWxpZF9tb3ZlX2hpdCA9IHRydWU7XG4gICAgfSxcblxuICAgIHZhbGlkX2hpdF9tb3ZlOiBmdW5jdGlvbiB2YWxpZF9oaXRfbW92ZSgpIHtcbiAgICAgICAgdGhpcy5pbnZhbGlkX21vdmVfaGl0ID0gZmFsc2U7XG4gICAgfVxufSk7XG4vLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuLy8gfSxcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzYzMGFhb1NtR3BMeXB2T01CeVQ5WnR2JywgJ2VsZWNfZGV2aWNlJyk7XG4vLyBzY3JpcHRlc1xcZWxlY19kZXZpY2UuanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuXG4gICAgICAgIGVsZWNfdHlwZTogMVxuICAgIH0sXG5cbiAgICBpc191aV9kcmFnOiBmdW5jdGlvbiBpc191aV9kcmFnKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc19kcmFnX2l0ZW07XG4gICAgfSxcblxuICAgIHNldF91aV9kcmFnOiBmdW5jdGlvbiBzZXRfdWlfZHJhZygpIHtcbiAgICAgICAgdGhpcy5pc19kcmFnX2l0ZW0gPSB0cnVlO1xuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5pc19kcmFnX2l0ZW0gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5nYW1lX3NjZW5lID0gY2MuZmluZChcIlVJX1JPT1RcIikuZ2V0Q29tcG9uZW50KFwiZ2FtZV9zY2VuZVwiKTtcbiAgICAgICAgdGhpcy5oaXRlZCA9IGZhbHNlO1xuXG4gICAgICAgIGlmICh0aGlzLmVsZWNfdHlwZSA8PSA5KSB7XG4gICAgICAgICAgICB0aGlzLm9mZiA9IHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZShcIm9mZlwiKTtcbiAgICAgICAgICAgIHRoaXMub24gPSB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoXCJvblwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZWxlY192YWx1ZSA9IHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZShcImVsZWNfdmFsdWVcIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5tb2RlID0gMDtcbiAgICAgICAgdGhpcy52ID0gMTAwO1xuXG4gICAgICAgIC8vIHRvdWNoXG4gICAgICAgIHRoaXMuaXNfaW52YWxpZF90b3VjaCA9IGZhbHNlO1xuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIChmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgdGhpcy5ub2RlLnNldExvY2FsWk9yZGVyKDEwMDApO1xuICAgICAgICAgICAgdGhpcy5oaXRlZCA9IGZhbHNlO1xuICAgICAgICB9KS5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX01PVkUsIChmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMub25fdG91Y2hfbW92ZWQoZXZlbnQpO1xuICAgICAgICB9KS5iaW5kKHRoaXMpKTtcblxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfRU5ELCAoZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB0aGlzLm5vZGUuc2V0TG9jYWxaT3JkZXIoMCk7XG4gICAgICAgICAgICBpZiAodGhpcy5pc19pbnZhbGlkX3RvdWNoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHdfcG9zID0gZXZlbnQuZ2V0TG9jYXRpb24oKTtcbiAgICAgICAgICAgIHZhciBpc19oaXQgPSB0aGlzLmdhbWVfc2NlbmUub25faGl0X3Rlc3QodGhpcy5ub2RlLCB0aGlzLmVsZWNfdHlwZSwgd19wb3MpO1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNfZHJhZ19pdGVtID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIC8vIOWIoOmZpFxuICAgICAgICAgICAgICAgIHRoaXMubm9kZS5yZW1vdmVGcm9tUGFyZW50KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyppZihpc19oaXRlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLm9wYWNpdHkgPSAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oaXRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUueCA9IHRoaXMuc3RhcnRfeDtcclxuICAgICAgICAgICAgICAgIHRoaXMubm9kZS55ID0gdGhpcy5zdGFydF95O1xyXG4gICAgICAgICAgICB9Ki9cblxuICAgICAgICAgICAgdGhpcy5ub2RlLnggPSB0aGlzLnN0YXJ0X3g7XG4gICAgICAgICAgICB0aGlzLm5vZGUueSA9IHRoaXMuc3RhcnRfeTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5vcGFjaXR5ID0gMDtcbiAgICAgICAgICAgIHRoaXMuaGl0ZWQgPSBmYWxzZTtcbiAgICAgICAgfSkuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9DQU5DRUwsIChmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMubm9kZS5zZXRMb2NhbFpPcmRlcigwKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzX2ludmFsaWRfdG91Y2gpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciB3X3BvcyA9IGV2ZW50LmdldExvY2F0aW9uKCk7XG4gICAgICAgICAgICB2YXIgaXNfaGl0ID0gdGhpcy5nYW1lX3NjZW5lLm9uX2hpdF90ZXN0KHRoaXMubm9kZSwgdGhpcy5lbGVjX3R5cGUsIHdfcG9zKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzX2RyYWdfaXRlbSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAvLyDliKDpmaRcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUucmVtb3ZlRnJvbVBhcmVudCgpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5ub2RlLnggPSB0aGlzLnN0YXJ0X3g7XG4gICAgICAgICAgICB0aGlzLm5vZGUueSA9IHRoaXMuc3RhcnRfeTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5vcGFjaXR5ID0gMDtcbiAgICAgICAgICAgIHRoaXMuaGl0ZWQgPSBmYWxzZTtcbiAgICAgICAgfSkuYmluZCh0aGlzKSk7XG4gICAgICAgIC8vIGVuZFxuICAgIH0sXG5cbiAgICBzZXRfc3RhcnRfcG9zOiBmdW5jdGlvbiBzZXRfc3RhcnRfcG9zKHhwb3MsIHlwb3MpIHtcbiAgICAgICAgdGhpcy5zdGFydF94ID0geHBvcztcbiAgICAgICAgdGhpcy5zdGFydF95ID0geXBvcztcbiAgICB9LFxuXG4gICAgb25fdG91Y2hfbW92ZWQ6IGZ1bmN0aW9uIG9uX3RvdWNoX21vdmVkKGV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLmlzX2ludmFsaWRfdG91Y2ggPT09IHRydWUgfHwgdGhpcy5oaXRlZCkge1xuICAgICAgICAgICAgLy8g5bGP6JS95o6J6L+Z5Liq5raI5oGv44CCXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgd19wb3MgPSBldmVudC5nZXRMb2NhdGlvbigpO1xuICAgICAgICB0aGlzLm5vZGUub3BhY2l0eSA9IDEyODtcblxuICAgICAgICB2YXIgcG9zID0gdGhpcy5ub2RlLnBhcmVudC5jb252ZXJ0VG9Ob2RlU3BhY2Uod19wb3MpO1xuICAgICAgICB0aGlzLm5vZGUueCA9IHBvcy54O1xuICAgICAgICB0aGlzLm5vZGUueSA9IHBvcy55O1xuICAgICAgICAvKlxyXG4gICAgICAgIHZhciBpc19oaXRlZCA9IHRoaXMuZ2FtZV9zY2VuZS5vbl9oaXRfdGVzdCh0aGlzLm5vZGUsIHRoaXMuZWxlY190eXBlLCB3X3Bvcyk7XHJcbiAgICAgICAgaWYoaXNfaGl0ZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5ub2RlLm9wYWNpdHkgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLmhpdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5ub2RlLnggPSB0aGlzLnN0YXJ0X3g7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZS55ID0gdGhpcy5zdGFydF95O1xyXG4gICAgICAgIH0qL1xuICAgIH0sXG5cbiAgICBpbnZhbGlkX3RvdWNoOiBmdW5jdGlvbiBpbnZhbGlkX3RvdWNoKCkge1xuICAgICAgICB0aGlzLmlzX2ludmFsaWRfdG91Y2ggPSB0cnVlO1xuICAgIH0sXG5cbiAgICBzdGFydDogZnVuY3Rpb24gc3RhcnQoKSB7XG4gICAgICAgIHRoaXMubm9kZS5zZXRDYXNjYWRlT3BhY2l0eUVuYWJsZWQodHJ1ZSk7XG4gICAgICAgIHRoaXMuc2hvd193aGVuX2ZhaWxlZCgpO1xuICAgICAgICAvLyB0aGlzLnNob3dfd2hlbl9zdWNjZXNzKCk7XG4gICAgICAgIC8vIHRoaXMuc2hvd19hbmltX25vdF9jb25uZWNlZCgpO1xuICAgIH0sXG5cbiAgICBzaG93X3doZW5fc3VjY2VzczogZnVuY3Rpb24gc2hvd193aGVuX3N1Y2Nlc3MoKSB7XG4gICAgICAgIGlmICh0aGlzLmVsZWNfdHlwZSA8PSA5KSB7XG4gICAgICAgICAgICB0aGlzLm9mZi5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMub24uYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHRoaXMuZWxlY192YWx1ZS5oZWlnaHQgPSA2OTtcbiAgICAgICAgICAgIHRoaXMuc2hvd19hbmltX2Nvbm5lY2VkKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc2hvd193aGVuX2ZhaWxlZDogZnVuY3Rpb24gc2hvd193aGVuX2ZhaWxlZCgpIHtcbiAgICAgICAgaWYgKHRoaXMuZWxlY190eXBlIDw9IDkpIHtcbiAgICAgICAgICAgIHRoaXMub2ZmLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLm9uLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5lbGVjX3ZhbHVlLmhlaWdodCA9IDA7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc2hvd19hbmltX25vdF9jb25uZWNlZDogZnVuY3Rpb24gc2hvd19hbmltX25vdF9jb25uZWNlZCgpIHtcbiAgICAgICAgdGhpcy5tb2RlID0gMjtcbiAgICAgICAgdGhpcy5zdGVwID0gMDtcbiAgICB9LFxuXG4gICAgc2hvd19hbmltX2Nvbm5lY2VkOiBmdW5jdGlvbiBzaG93X2FuaW1fY29ubmVjZWQoKSB7XG4gICAgICAgIHRoaXMubW9kZSA9IDE7XG4gICAgfSxcblxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcbiAgICAgICAgaWYgKHRoaXMuZWxlY190eXBlIDw9IDkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm1vZGUgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm1vZGUgPT09IDIgJiYgdGhpcy5zdGVwID09PSAwKSB7XG4gICAgICAgICAgICAvLyDmtqhcbiAgICAgICAgICAgIHZhciBzID0gdGhpcy52ICogZHQ7XG4gICAgICAgICAgICB0aGlzLmVsZWNfdmFsdWUuaGVpZ2h0ICs9IHM7XG4gICAgICAgICAgICBpZiAodGhpcy5lbGVjX3ZhbHVlLmhlaWdodCA+PSA2OSkge1xuICAgICAgICAgICAgICAgIC8vIOa2qOWBnFxuICAgICAgICAgICAgICAgIHRoaXMuc3RlcCA9IDE7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVjX3ZhbHVlLmhlaWdodCA9IDY5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMubW9kZSA9PT0gMiAmJiB0aGlzLnN0ZXAgPT09IDEpIHtcbiAgICAgICAgICAgIC8vIOi3jOWBnFxuICAgICAgICAgICAgdmFyIHMgPSB0aGlzLnYgKiBkdDtcbiAgICAgICAgICAgIHRoaXMuZWxlY192YWx1ZS5oZWlnaHQgLT0gcztcbiAgICAgICAgICAgIGlmICh0aGlzLmVsZWNfdmFsdWUuaGVpZ2h0IDw9IDApIHtcbiAgICAgICAgICAgICAgICAvLyDot4zlgZxcbiAgICAgICAgICAgICAgICB0aGlzLm1vZGUgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMubW9kZSA9PT0gMSkge1xuICAgICAgICAgICAgLy8g5oiQ5Yqf5rao5Yiw5pyA6auY44CCXG4gICAgICAgICAgICB2YXIgcyA9IHRoaXMudiAqIGR0O1xuICAgICAgICAgICAgdGhpcy5lbGVjX3ZhbHVlLmhlaWdodCArPSBzO1xuICAgICAgICAgICAgaWYgKHRoaXMuZWxlY192YWx1ZS5oZWlnaHQgPj0gNjkpIHtcbiAgICAgICAgICAgICAgICAvLyDmtqjlgZxcbiAgICAgICAgICAgICAgICB0aGlzLm1vZGUgPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlY192YWx1ZS5oZWlnaHQgPSA2OTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnZGE3ZTE0WHJ6Ukh0NGY5WGdCcGFyd00nLCAnZ2FtZV9zY2VuZScpO1xuLy8gc2NyaXB0ZXNcXGdhbWVfc2NlbmUuanNcblxudmFyIGRlY3JvX3ByZWZhYl9zZXQgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2RlY3JvX3ByZWZhYl9zZXQnLFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgc3ViX3NldDoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IFtdLFxuICAgICAgICAgICAgdHlwZTogY2MuUHJlZmFiXG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuXG4gICAgICAgIGhlYWRlcl9zZXQ6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBbXSxcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYlxuICAgICAgICB9LFxuXG4gICAgICAgIGJvZHlfc2V0OiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogW10sXG4gICAgICAgICAgICB0eXBlOiBjYy5QcmVmYWJcbiAgICAgICAgfSxcblxuICAgICAgICBmb290X3NldDoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IFtdLFxuICAgICAgICAgICAgdHlwZTogY2MuUHJlZmFiXG4gICAgICAgIH0sXG5cbiAgICAgICAgbGVmdF9oYW5kX3NldDoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IFtdLFxuICAgICAgICAgICAgdHlwZTogY2MuUHJlZmFiXG4gICAgICAgIH0sXG5cbiAgICAgICAgcmlnaHRfaGFuZF9zZXQ6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBbXSxcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYlxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIHByZWxvYWRfc291bmQ6IGZ1bmN0aW9uIHByZWxvYWRfc291bmQoKSB7XG4gICAgICAgIHZhciBzb3VuZF9saXN0ID0gW1wicmVzb3VyY2VzL3NvdW5kcy9ib25lc19pbi5tcDNcIiwgXCJyZXNvdXJjZXMvc291bmRzL2dvX2F1dG8ubXAzXCIsIFwicmVzb3VyY2VzL3NvdW5kcy9tb3ZlX3BhcnRzLm1wM1wiLCBcInJlc291cmNlcy9zb3VuZHMvcGluZ19vay5tcDNcIiwgXCJyZXNvdXJjZXMvc291bmRzL3BsYXkubXAzXCIsIFwicmVzb3VyY2VzL3NvdW5kcy9raW1fY2xrMi5tcDNcIiwgXCJyZXNvdXJjZXMvc291bmRzL2tpbV9jbGsxLm1wM1wiLCBcInJlc291cmNlcy9zb3VuZHMvZW5kLm1wM1wiLCBcInJlc291cmNlcy9zb3VuZHMvaGFuamllLm1wM1wiLCBcInJlc291cmNlcy9zb3VuZHMvbWFuX3ZvaWNlLm1wM1wiXTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNvdW5kX2xpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciB1cmwgPSBjYy51cmwucmF3KHNvdW5kX2xpc3RbaV0pO1xuICAgICAgICAgICAgY2MubG9hZGVyLmxvYWRSZXModXJsLCBmdW5jdGlvbiAoKSB7fSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuZ2FtZV9zdGFydCA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuc2tlX2tpbV9jb20gPSBjYy5maW5kKFwiVUlfUk9PVC9hbmNob3ItY2VudGVyL2tpbVwiKS5nZXRDb21wb25lbnQoc3AuU2tlbGV0b24pO1xuICAgICAgICB0aGlzLmdhbWVfbW9kZSA9IDA7XG4gICAgICAgIHRoaXMubG9ja19raW1fY2xpY2sgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLmNoZWNrb3V0X3Jvb3QgPSBjYy5maW5kKFwiVUlfUk9PVC9jaGVja19vdXRfcm9vdFwiKTtcbiAgICAgICAgdGhpcy5jaGVja291dF9yb290LmFjdGl2ZSA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuZ2FtZV9tb2RlX3RpcCA9IGNjLmZpbmQoXCJVSV9ST09UL2FuY2hvci1jZW50ZXIvbWFza1wiKTtcbiAgICAgICAgdGhpcy5wYXJ0cyA9IGNjLmZpbmQoXCJVSV9ST09UL2FuY2hvci1jZW50ZXIvcGFydHNcIik7XG4gICAgICAgIHRoaXMubWFuX3Jvb3QgPSBjYy5maW5kKFwiVUlfUk9PVC9hbmNob3ItY2VudGVyL21hbl9ib2R5X3Jvb3RcIik7XG5cbiAgICAgICAgdGhpcy5sZWZ0X3dvcmtlciA9IGNjLmZpbmQoXCJVSV9ST09UL2FuY2hvci1jZW50ZXIvbGVmdF93b3JrZXJcIik7XG5cbiAgICAgICAgdGhpcy5yaWdodF93b3JrZXIgPSBjYy5maW5kKFwiVUlfUk9PVC9hbmNob3ItY2VudGVyL3JpZ2h0X3dvcmtlclwiKTtcbiAgICAgICAgdGhpcy50b3Bfd29ya2VyID0gY2MuZmluZChcIlVJX1JPT1QvYW5jaG9yLWNlbnRlci90b3Bfd29ya2VyXCIpO1xuICAgIH0sXG5cbiAgICBzaG93X2dhbWVfc3RhZ2VfdGlwOiBmdW5jdGlvbiBzaG93X2dhbWVfc3RhZ2VfdGlwKGdhbWVfbW9kZSkge1xuICAgICAgICB2YXIgaTtcbiAgICAgICAgZm9yIChpID0gMTsgaSA8PSA1OyBpKyspIHtcbiAgICAgICAgICAgIHZhciBub2RlID0gdGhpcy5nYW1lX21vZGVfdGlwLmdldENoaWxkQnlOYW1lKFwiXCIgKyBpKTtcbiAgICAgICAgICAgIG5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbm93ID0gdGhpcy5nYW1lX21vZGVfdGlwLmdldENoaWxkQnlOYW1lKFwiXCIgKyBnYW1lX21vZGUpO1xuICAgICAgICBub3cuYWN0aXZlID0gdHJ1ZTtcbiAgICB9LFxuXG4gICAgcGxheV9raW1fY2xpY2tfYW5pbV93aXRoX3JhbmRvbTogZnVuY3Rpb24gcGxheV9raW1fY2xpY2tfYW5pbV93aXRoX3JhbmRvbSgpIHtcbiAgICAgICAgdmFyIHYgPSBNYXRoLnJhbmRvbSgpO1xuICAgICAgICB2YXIgYW5pbV9uYW1lID0gXCJjbGtfMVwiO1xuICAgICAgICB2YXIgc291bmRfbmFtZSA9IFwicmVzb3VyY2VzL3NvdW5kcy9raW1fY2xrMS5tcDNcIjtcbiAgICAgICAgaWYgKHYgPCAwLjUpIHtcbiAgICAgICAgICAgIGFuaW1fbmFtZSA9IFwiY2xrXzJcIjtcbiAgICAgICAgICAgIHNvdW5kX25hbWUgPSBcInJlc291cmNlcy9zb3VuZHMva2ltX2NsazIubXAzXCI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sb2NrX2tpbV9jbGljayA9IHRydWU7XG4gICAgICAgIHRoaXMucGxheV9zb3VuZChzb3VuZF9uYW1lKTtcbiAgICAgICAgdGhpcy5za2Vfa2ltX2NvbS5jbGVhclRyYWNrcygpO1xuICAgICAgICB0aGlzLnNrZV9raW1fY29tLnNldEFuaW1hdGlvbigwLCBhbmltX25hbWUsIGZhbHNlKTtcblxuICAgICAgICB0aGlzLmNhbGxfbGF0dGVyKChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnNrZV9raW1fY29tLmNsZWFyVHJhY2tzKCk7XG4gICAgICAgICAgICB0aGlzLnNrZV9raW1fY29tLnNldEFuaW1hdGlvbigwLCBcImlkbGVfMVwiLCB0cnVlKTtcbiAgICAgICAgICAgIHRoaXMubG9ja19raW1fY2xpY2sgPSBmYWxzZTtcbiAgICAgICAgfSkuYmluZCh0aGlzKSwgMik7XG4gICAgfSxcblxuICAgIHNhdmVfbWFuY2hpbmVfcGFydF9wb3M6IGZ1bmN0aW9uIHNhdmVfbWFuY2hpbmVfcGFydF9wb3MoKSB7XG4gICAgICAgIHRoaXMucGFydF9wb3MgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPD0gNTsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgbmFtZSA9IFwidHdcIiArIGkgKyBcIjFcIjtcbiAgICAgICAgICAgIHZhciBub2RlID0gdGhpcy5tYW5fcm9vdC5nZXRDaGlsZEJ5TmFtZShuYW1lKTtcbiAgICAgICAgICAgIHRoaXMucGFydF9wb3MucHVzaChjYy5wKG5vZGUueCwgbm9kZS55KSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5mYWNlX3kgPSB0aGlzLm1hbl9yb290LmdldENoaWxkQnlOYW1lKFwiZmFjZVwiKS55O1xuICAgIH0sXG5cbiAgICBzdGFydDogZnVuY3Rpb24gc3RhcnQoKSB7XG4gICAgICAgIHRoaXMubGVmdF93b3JrZXIueCA9IC04MTU7XG4gICAgICAgIHRoaXMubGVmdF93b3JrZXIueSA9IDUxMDtcblxuICAgICAgICAvL1xuICAgICAgICB0aGlzLnNhdmVfbWFuY2hpbmVfcGFydF9wb3MoKTtcbiAgICAgICAgLy9cbiAgICAgICAgdGhpcy5sb2NrX2tpbV9jbGljayA9IHRydWU7XG4gICAgICAgIHRoaXMuY2FsbF9sYXR0ZXIoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuc2tlX2tpbV9jb20uY2xlYXJUcmFja3MoKTtcbiAgICAgICAgICAgIHRoaXMuc2tlX2tpbV9jb20uc2V0QW5pbWF0aW9uKDAsIFwiaWRsZV8xXCIsIHRydWUpO1xuICAgICAgICAgICAgdGhpcy5sb2NrX2tpbV9jbGljayA9IGZhbHNlO1xuICAgICAgICB9KS5iaW5kKHRoaXMpLCAwLjkpO1xuICAgICAgICB0aGlzLm9uX3N0YXJ0X2dhbWUoKTtcbiAgICB9LFxuXG4gICAgcGxheV9zb3VuZDogZnVuY3Rpb24gcGxheV9zb3VuZChuYW1lKSB7XG4gICAgICAgIHZhciB1cmxfZGF0YSA9IGNjLnVybC5yYXcobmFtZSk7XG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnN0b3BNdXNpYygpO1xuICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5TXVzaWModXJsX2RhdGEpO1xuICAgIH0sXG5cbiAgICBwbGF5X3NvdW5kX2xvb3A6IGZ1bmN0aW9uIHBsYXlfc291bmRfbG9vcChuYW1lKSB7XG4gICAgICAgIHZhciB1cmxfZGF0YSA9IGNjLnVybC5yYXcobmFtZSk7XG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnN0b3BNdXNpYygpO1xuICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5TXVzaWModXJsX2RhdGEpO1xuICAgIH0sXG5cbiAgICBjYWxsX2xhdHRlcjogZnVuY3Rpb24gY2FsbF9sYXR0ZXIoY2FsbGZ1bmMsIGRlbGF5KSB7XG4gICAgICAgIHZhciBkZWxheV9hY3Rpb24gPSBjYy5kZWxheVRpbWUoZGVsYXkpO1xuICAgICAgICB2YXIgY2FsbF9hY3Rpb24gPSBjYy5jYWxsRnVuYyhjYWxsZnVuYywgdGhpcyk7XG4gICAgICAgIHZhciBzZXEgPSBjYy5zZXF1ZW5jZShbZGVsYXlfYWN0aW9uLCBjYWxsX2FjdGlvbl0pO1xuICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKHNlcSk7XG4gICAgfSxcblxuICAgIHBsYXlfa2ltX2FuaW1fd2l0aF9yaWdodDogZnVuY3Rpb24gcGxheV9raW1fYW5pbV93aXRoX3JpZ2h0KCkge1xuICAgICAgICB0aGlzLnNrZV9raW1fY29tLmNsZWFyVHJhY2tzKCk7XG4gICAgICAgIHRoaXMuc2tlX2tpbV9jb20uc2V0QW5pbWF0aW9uKDAsIFwib2tfMVwiLCBmYWxzZSk7XG4gICAgICAgIHRoaXMuY2FsbF9sYXR0ZXIoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuc2tlX2tpbV9jb20uY2xlYXJUcmFja3MoKTtcbiAgICAgICAgICAgIHRoaXMuc2tlX2tpbV9jb20uc2V0QW5pbWF0aW9uKDAsIFwiaWRsZV8xXCIsIHRydWUpO1xuICAgICAgICB9KS5iaW5kKHRoaXMpLCAyKTtcbiAgICAgICAgLy8gdGhpcy5wbGF5X3NvdW5kKFwicmVzb3VyY2VzL3NvdW5kcy9jaF9yaWdodC5tcDNcIik7XG4gICAgfSxcblxuICAgIHBsYXlfa2ltX2FuaW1fd2l0aF9lcnJvcjogZnVuY3Rpb24gcGxheV9raW1fYW5pbV93aXRoX2Vycm9yKCkge1xuICAgICAgICB0aGlzLnNrZV9raW1fY29tLmNsZWFyVHJhY2tzKCk7XG4gICAgICAgIHRoaXMuc2tlX2tpbV9jb20uc2V0QW5pbWF0aW9uKDAsIFwiZXJyXzFcIiwgZmFsc2UpO1xuICAgICAgICB0aGlzLmNhbGxfbGF0dGVyKChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnNrZV9raW1fY29tLmNsZWFyVHJhY2tzKCk7XG4gICAgICAgICAgICB0aGlzLnNrZV9raW1fY29tLnNldEFuaW1hdGlvbigwLCBcImlkbGVfMVwiLCB0cnVlKTtcbiAgICAgICAgfSkuYmluZCh0aGlzKSwgMS41KTtcbiAgICAgICAgLy8gdGhpcy5wbGF5X3NvdW5kKFwicmVzb3VyY2VzL3NvdW5kcy9ja19lcnJvci5tcDNcIik7XG4gICAgfSxcblxuICAgIG9uX3N0YXJ0X2dhbWU6IGZ1bmN0aW9uIG9uX3N0YXJ0X2dhbWUoKSB7XG4gICAgICAgIGlmICh0aGlzLmdhbWVfc3RhcnQgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1hbl9yb290LnJlbW92ZUFsbENoaWxkcmVuKCk7XG4gICAgICAgIHRoaXMucGxheV9zb3VuZChcInJlc291cmNlcy9zb3VuZHMvNXN0YXJ0Lm1wM1wiKTtcbiAgICAgICAgdGhpcy5nYW1lX3N0YXJ0ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5sb2NrX21vdmVfYmFjayA9IGZhbHNlO1xuICAgICAgICB0aGlzLmxvY2tfZGVzdHJveSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmdhbWVfbW9kZSA9IDE7XG5cbiAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuZW50ZXJfZmlyc3RfbW9kZSgpO1xuICAgICAgICB9KS5iaW5kKHRoaXMpLCAzKTtcbiAgICB9LFxuXG4gICAgbmV3X3BhcnRfc2V0OiBmdW5jdGlvbiBuZXdfcGFydF9zZXQoc3RlcF9wYXJ0cykge1xuICAgICAgICB0aGlzLnBhcnRzLnJlbW92ZUFsbENoaWxkcmVuKCk7XG4gICAgICAgIHRoaXMucGFydF9zZXQgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdGVwX3BhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IGNjLmluc3RhbnRpYXRlKHN0ZXBfcGFydHNbaV0pO1xuICAgICAgICAgICAgdmFyIGNvbSA9IGl0ZW0uZ2V0Q29tcG9uZW50KFwiZGVjb3JhdGl2ZV9wYXJ0XCIpO1xuICAgICAgICAgICAgaXRlbS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgaXRlbS5wYXJlbnQgPSB0aGlzLnBhcnRzO1xuICAgICAgICAgICAgaXRlbS54ID0gY29tLnN0YXJ0X3g7XG4gICAgICAgICAgICBpdGVtLnkgPSBjb20uc3RhcnRfeTtcbiAgICAgICAgICAgIGl0ZW0uYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMucGFydF9zZXQucHVzaChpdGVtKTtcbiAgICAgICAgICAgIGNvbS5pbnZhbGlkX2hpdF9tb3ZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy9cbiAgICAgICAgdGhpcy5wYXJ0X3NldC5zb3J0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLnJhbmRvbSgpIC0gMC41O1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5wYXJ0X25vd19pbmRleCA9IDA7XG4gICAgfSxcblxuICAgIHNlbGVjdF9wYXJ0OiBmdW5jdGlvbiBzZWxlY3RfcGFydCgpIHtcbiAgICAgICAgLy8gLTgxNSwgNTEwLCAgLTgxNSwgNzI4LCAtMTI1MiwgNzI4LCAtMTI1MiwgNDQ5XG4gICAgICAgIHZhciB0aW1lID0gMC41ICogMS41O1xuICAgICAgICB2YXIgbTEgPSBjYy5tb3ZlQnkodGltZSwgMCwgMjE4KTtcbiAgICAgICAgdmFyIG0yID0gY2MubW92ZUJ5KHRpbWUsIC00MzcsIDApO1xuICAgICAgICB2YXIgbTMgPSBjYy5tb3ZlQnkodGltZSwgMCwgLTI3OSk7XG4gICAgICAgIHZhciBtNCA9IGNjLm1vdmVCeSh0aW1lLCAwLCAyNzkpO1xuICAgICAgICB2YXIgbTUgPSBjYy5tb3ZlQnkodGltZSwgNDM3LCAwKTtcbiAgICAgICAgdmFyIG02ID0gY2MubW92ZUJ5KHRpbWUsIDAsIC0yMTgpO1xuXG4gICAgICAgIHZhciBub3dfcGFydCA9IHRoaXMucGFydF9zZXRbdGhpcy5wYXJ0X25vd19pbmRleF07XG4gICAgICAgIHZhciBjb20gPSBub3dfcGFydC5nZXRDb21wb25lbnQoXCJkZWNvcmF0aXZlX3BhcnRcIik7XG4gICAgICAgIGNvbS5pbnZhbGlkX2hpdF9tb3ZlKCk7XG4gICAgICAgIHRoaXMuc2VsZWN0X2l0ZW0gPSBub3dfcGFydDtcbiAgICAgICAgdGhpcy5sb2NrX21vdmVfYmFjayA9IHRydWU7XG4gICAgICAgIHRoaXMucGxheV9zb3VuZChcInJlc291cmNlcy9zb3VuZHMvYm9uZXNfaW4ubXAzXCIpO1xuXG4gICAgICAgIHZhciBmdW5jID0gY2MuY2FsbEZ1bmMoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIHZhciBjb20gPSBub3dfcGFydC5nZXRDb21wb25lbnQoXCJkZWNvcmF0aXZlX3BhcnRcIik7XG4gICAgICAgICAgICAvLyBub3dfcGFydC5ydW5BY3Rpb24oY2MubW92ZVRvKHRpbWUsIGNvbS5kc3RfeCwgY29tLmRzdF95KSk7XG4gICAgICAgICAgICB0aGlzLnBsYXlfc291bmQoXCJyZXNvdXJjZXMvc291bmRzL2JvbmVzX2luLm1wM1wiKTtcbiAgICAgICAgICAgIHZhciBtbTEgPSBjYy5tb3ZlQnkodGltZSwgMCwgMjc5KTtcbiAgICAgICAgICAgIHZhciBtbTIgPSBjYy5tb3ZlQnkodGltZSwgNDM3LCAwKTtcbiAgICAgICAgICAgIHZhciBtbTMgPSBjYy5tb3ZlQnkodGltZSwgMCwgLTIxOCk7XG4gICAgICAgICAgICB2YXIgc2VxMiA9IGNjLnNlcXVlbmNlKFttbTEsIG1tMiwgbW0zXSk7XG4gICAgICAgICAgICBub3dfcGFydC5ydW5BY3Rpb24oc2VxMik7XG4gICAgICAgIH0pLmJpbmQodGhpcyksIHRoaXMpO1xuXG4gICAgICAgIHZhciBlbmRfZnVuYyA9IGNjLmNhbGxGdW5jKChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmxvY2tfbW92ZV9iYWNrID0gZmFsc2U7XG4gICAgICAgICAgICB2YXIgY29tID0gbm93X3BhcnQuZ2V0Q29tcG9uZW50KFwiZGVjb3JhdGl2ZV9wYXJ0XCIpO1xuICAgICAgICAgICAgY29tLnZhbGlkX2hpdF9tb3ZlKCk7XG4gICAgICAgIH0pLmJpbmQodGhpcyksIHRoaXMpO1xuXG4gICAgICAgIHZhciBzZXEgPSBjYy5zZXF1ZW5jZShbbTEsIG0yLCBtMywgZnVuYywgbTQsIG01LCBtNiwgZW5kX2Z1bmNdKTtcbiAgICAgICAgdGhpcy5sZWZ0X3dvcmtlci5ydW5BY3Rpb24oc2VxKTtcbiAgICB9LFxuXG4gICAgbW92ZV9wYXJ0X2JhY2tfd2hlbl9kZXN0cm95OiBmdW5jdGlvbiBtb3ZlX3BhcnRfYmFja193aGVuX2Rlc3Ryb3koKSB7XG4gICAgICAgIGlmICh0aGlzLmxvY2tfbW92ZV9iYWNrID09PSB0cnVlICYmIHRoaXMuZ2FtZV9tb2RlIDwgNikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdmFyIHByZXZfcGFydCA9IHRoaXMucGFydF9zZXRbdGhpcy5wYXJ0X25vd19pbmRleF07XG4gICAgICAgIHZhciBwcmV2X3BhcnQgPSB0aGlzLnNlbGVjdF9pdGVtO1xuXG4gICAgICAgIHRoaXMubG9ja19tb3ZlX2JhY2sgPSB0cnVlO1xuICAgICAgICB2YXIgdGltZSA9IDAuNSAqIDEuNTtcblxuICAgICAgICB2YXIgZnVuYyA9IGNjLmNhbGxGdW5jKChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbW1tMSA9IGNjLm1vdmVCeSh0aW1lLCAwLCAyMTgpO1xuICAgICAgICAgICAgdmFyIG1tbTIgPSBjYy5tb3ZlQnkodGltZSwgLTQzNywgMCk7XG4gICAgICAgICAgICB2YXIgbW1tMyA9IGNjLm1vdmVCeSh0aW1lLCAwLCAtMjc5KTtcbiAgICAgICAgICAgIHZhciBzZXFfbW1tID0gY2Muc2VxdWVuY2UoW21tbTEsIG1tbTIsIG1tbTNdKTtcbiAgICAgICAgICAgIGlmIChwcmV2X3BhcnQpIHtcbiAgICAgICAgICAgICAgICB2YXIgY29tID0gcHJldl9wYXJ0LmdldENvbXBvbmVudChcImRlY29yYXRpdmVfcGFydFwiKTtcbiAgICAgICAgICAgICAgICBjb20uaW52YWxpZF9oaXRfbW92ZSgpO1xuICAgICAgICAgICAgICAgIHByZXZfcGFydC5ydW5BY3Rpb24oc2VxX21tbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLmJpbmQodGhpcyksIHRoaXMpO1xuXG4gICAgICAgIHZhciBmdW5jMiA9IGNjLmNhbGxGdW5jKChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmdhbWVfbW9kZSA9IDE7XG4gICAgICAgICAgICB0aGlzLm5ld19wYXJ0X3NldCh0aGlzLmhlYWRlcl9zZXQpO1xuICAgICAgICAgICAgdGhpcy5wYXJ0X25vd19pbmRleCA9IDA7XG4gICAgICAgICAgICB2YXIgbm93X3BhcnQgPSB0aGlzLnBhcnRfc2V0W3RoaXMucGFydF9ub3dfaW5kZXhdO1xuXG4gICAgICAgICAgICB2YXIgbW0xID0gY2MubW92ZUJ5KHRpbWUsIDAsIDI3OSk7XG4gICAgICAgICAgICB2YXIgbW0yID0gY2MubW92ZUJ5KHRpbWUsIDQzNywgMCk7XG4gICAgICAgICAgICB2YXIgbW0zID0gY2MubW92ZUJ5KHRpbWUsIDAsIC0yMTgpO1xuICAgICAgICAgICAgdmFyIHNlcTIgPSBjYy5zZXF1ZW5jZShbbW0xLCBtbTIsIG1tM10pO1xuICAgICAgICAgICAgdmFyIGNvbSA9IG5vd19wYXJ0LmdldENvbXBvbmVudChcImRlY29yYXRpdmVfcGFydFwiKTtcbiAgICAgICAgICAgIGNvbS5pbnZhbGlkX2hpdF9tb3ZlKCk7XG4gICAgICAgICAgICBub3dfcGFydC5ydW5BY3Rpb24oc2VxMik7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdF9pdGVtID0gbm93X3BhcnQ7XG4gICAgICAgIH0pLmJpbmQodGhpcyksIHRoaXMpO1xuXG4gICAgICAgIHZhciBlbmRfZnVuYyA9IGNjLmNhbGxGdW5jKChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmxvY2tfbW92ZV9iYWNrID0gZmFsc2U7XG4gICAgICAgICAgICB2YXIgY29tID0gdGhpcy5zZWxlY3RfaXRlbS5nZXRDb21wb25lbnQoXCJkZWNvcmF0aXZlX3BhcnRcIik7XG4gICAgICAgICAgICBjb20udmFsaWRfaGl0X21vdmUoKTtcbiAgICAgICAgfSkuYmluZCh0aGlzKSwgdGhpcyk7XG5cbiAgICAgICAgdmFyIG0xID0gY2MubW92ZUJ5KHRpbWUsIDAsIDIxOCk7XG4gICAgICAgIHZhciBtMiA9IGNjLm1vdmVCeSh0aW1lLCAtNDM3LCAwKTtcbiAgICAgICAgdmFyIG0zID0gY2MubW92ZUJ5KHRpbWUsIDAsIC0yNzkpO1xuICAgICAgICB2YXIgbTQgPSBjYy5tb3ZlQnkodGltZSwgMCwgMjc5KTtcbiAgICAgICAgdmFyIG01ID0gY2MubW92ZUJ5KHRpbWUsIDQzNywgMCk7XG4gICAgICAgIHZhciBtNiA9IGNjLm1vdmVCeSh0aW1lLCAwLCAtMjE4KTtcblxuICAgICAgICB2YXIgc2VxID0gY2Muc2VxdWVuY2UoW2Z1bmMsIG0xLCBtMiwgbTMsIGZ1bmMyLCBtNCwgbTUsIG02LCBlbmRfZnVuY10pO1xuICAgICAgICB0aGlzLmxlZnRfd29ya2VyLnJ1bkFjdGlvbihzZXEpO1xuICAgIH0sXG5cbiAgICBtb3ZlX3BhcnRfYmFjazogZnVuY3Rpb24gbW92ZV9wYXJ0X2JhY2soKSB7XG4gICAgICAgIGlmICh0aGlzLmxvY2tfbW92ZV9iYWNrID09PSB0cnVlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdGltZSA9IDAuNSAqIDEuNTtcbiAgICAgICAgLy8gdmFyIHByZXZfcGFydCA9IHRoaXMucGFydF9zZXRbdGhpcy5wYXJ0X25vd19pbmRleF07XG4gICAgICAgIHZhciBwcmV2X3BhcnQgPSB0aGlzLnNlbGVjdF9pdGVtO1xuXG4gICAgICAgIHRoaXMucGFydF9ub3dfaW5kZXgrKztcbiAgICAgICAgdGhpcy5sb2NrX21vdmVfYmFjayA9IHRydWU7XG4gICAgICAgIGlmICh0aGlzLnBhcnRfbm93X2luZGV4ID49IHRoaXMucGFydF9zZXQubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLnBhcnRfbm93X2luZGV4ID0gMDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbm93X3BhcnQgPSB0aGlzLnBhcnRfc2V0W3RoaXMucGFydF9ub3dfaW5kZXhdO1xuXG4gICAgICAgIHRoaXMucGxheV9zb3VuZChcInJlc291cmNlcy9zb3VuZHMvYm9uZXNfaW4ubXAzXCIpO1xuICAgICAgICB2YXIgZnVuYyA9IGNjLmNhbGxGdW5jKChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbW1tMSA9IGNjLm1vdmVCeSh0aW1lLCAwLCAyMTgpO1xuICAgICAgICAgICAgdmFyIG1tbTIgPSBjYy5tb3ZlQnkodGltZSwgLTQzNywgMCk7XG4gICAgICAgICAgICB2YXIgbW1tMyA9IGNjLm1vdmVCeSh0aW1lLCAwLCAtMjc5KTtcbiAgICAgICAgICAgIHZhciBzZXFfbW1tID0gY2Muc2VxdWVuY2UoW21tbTEsIG1tbTIsIG1tbTNdKTtcbiAgICAgICAgICAgIGlmIChwcmV2X3BhcnQpIHtcbiAgICAgICAgICAgICAgICB2YXIgY29tID0gcHJldl9wYXJ0LmdldENvbXBvbmVudChcImRlY29yYXRpdmVfcGFydFwiKTtcbiAgICAgICAgICAgICAgICBjb20uaW52YWxpZF9oaXRfbW92ZSgpO1xuICAgICAgICAgICAgICAgIHByZXZfcGFydC5ydW5BY3Rpb24oc2VxX21tbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLmJpbmQodGhpcyksIHRoaXMpO1xuXG4gICAgICAgIHZhciBmdW5jMiA9IGNjLmNhbGxGdW5jKChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnBsYXlfc291bmQoXCJyZXNvdXJjZXMvc291bmRzL2JvbmVzX2luLm1wM1wiKTtcbiAgICAgICAgICAgIHZhciBtbTEgPSBjYy5tb3ZlQnkodGltZSwgMCwgMjc5KTtcbiAgICAgICAgICAgIHZhciBtbTIgPSBjYy5tb3ZlQnkodGltZSwgNDM3LCAwKTtcbiAgICAgICAgICAgIHZhciBtbTMgPSBjYy5tb3ZlQnkodGltZSwgMCwgLTIxOCk7XG4gICAgICAgICAgICB2YXIgc2VxMiA9IGNjLnNlcXVlbmNlKFttbTEsIG1tMiwgbW0zXSk7XG4gICAgICAgICAgICB2YXIgY29tID0gbm93X3BhcnQuZ2V0Q29tcG9uZW50KFwiZGVjb3JhdGl2ZV9wYXJ0XCIpO1xuICAgICAgICAgICAgY29tLmludmFsaWRfaGl0X21vdmUoKTtcbiAgICAgICAgICAgIG5vd19wYXJ0LnJ1bkFjdGlvbihzZXEyKTtcbiAgICAgICAgfSkuYmluZCh0aGlzKSwgdGhpcyk7XG5cbiAgICAgICAgdmFyIGVuZF9mdW5jID0gY2MuY2FsbEZ1bmMoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMubG9ja19tb3ZlX2JhY2sgPSBmYWxzZTtcbiAgICAgICAgICAgIHZhciBjb20gPSBub3dfcGFydC5nZXRDb21wb25lbnQoXCJkZWNvcmF0aXZlX3BhcnRcIik7XG4gICAgICAgICAgICBjb20udmFsaWRfaGl0X21vdmUoKTtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0X2l0ZW0gPSBub3dfcGFydDtcbiAgICAgICAgfSkuYmluZCh0aGlzKSwgdGhpcyk7XG5cbiAgICAgICAgdmFyIG0xID0gY2MubW92ZUJ5KHRpbWUsIDAsIDIxOCk7XG4gICAgICAgIHZhciBtMiA9IGNjLm1vdmVCeSh0aW1lLCAtNDM3LCAwKTtcbiAgICAgICAgdmFyIG0zID0gY2MubW92ZUJ5KHRpbWUsIDAsIC0yNzkpO1xuICAgICAgICB2YXIgbTQgPSBjYy5tb3ZlQnkodGltZSwgMCwgMjc5KTtcbiAgICAgICAgdmFyIG01ID0gY2MubW92ZUJ5KHRpbWUsIDQzNywgMCk7XG4gICAgICAgIHZhciBtNiA9IGNjLm1vdmVCeSh0aW1lLCAwLCAtMjE4KTtcblxuICAgICAgICB2YXIgc2VxID0gY2Muc2VxdWVuY2UoW2Z1bmMsIG0xLCBtMiwgbTMsIGZ1bmMyLCBtNCwgbTUsIG02LCBlbmRfZnVuY10pO1xuICAgICAgICB0aGlzLmxlZnRfd29ya2VyLnJ1bkFjdGlvbihzZXEpO1xuICAgIH0sXG5cbiAgICBlbnRlcl9maXJzdF9tb2RlOiBmdW5jdGlvbiBlbnRlcl9maXJzdF9tb2RlKCkge1xuICAgICAgICB0aGlzLnNob3dfZ2FtZV9zdGFnZV90aXAodGhpcy5nYW1lX21vZGUpO1xuICAgICAgICAvLyDlsIbpm7bku7ZuZXflh7rmnaVcbiAgICAgICAgdGhpcy5uZXdfcGFydF9zZXQodGhpcy5oZWFkZXJfc2V0KTtcbiAgICAgICAgLy8gZW5kXG4gICAgICAgIHRoaXMuc2VsZWN0X3BhcnQoKTtcbiAgICB9LFxuXG4gICAgcmVwbGFjZV9pdGVtOiBmdW5jdGlvbiByZXBsYWNlX2l0ZW0oKSB7XG4gICAgICAgIHZhciBpdGVtO1xuICAgICAgICBpZiAodGhpcy5oaXRfbWFpbl90eXBlID09PSAxKSB7XG4gICAgICAgICAgICAvLyDlpLRcbiAgICAgICAgICAgIGl0ZW0gPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmhlYWRlcl9zZXRbdGhpcy5oaXRfc3ViX3R5cGVdKTtcbiAgICAgICAgICAgIGl0ZW0uYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIGl0ZW0ucGFyZW50ID0gdGhpcy5tYW5fcm9vdDtcbiAgICAgICAgICAgIGl0ZW0ueCA9IHRoaXMucGFydF9wb3NbdGhpcy5nYW1lX21vZGUgLSAxXS54O1xuICAgICAgICAgICAgaXRlbS55ID0gdGhpcy5wYXJ0X3Bvc1t0aGlzLmdhbWVfbW9kZSAtIDFdLnk7XG4gICAgICAgICAgICB2YXIgY29tID0gaXRlbS5nZXRDb21wb25lbnQoXCJkZWNvcmF0aXZlX3BhcnRcIik7XG4gICAgICAgICAgICBjb20uaW52YWxpZF9oaXRfbW92ZSgpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaGl0X21haW5fdHlwZSA9PT0gMikge1xuICAgICAgICAgICAgaXRlbSA9IGNjLmluc3RhbnRpYXRlKHRoaXMuYm9keV9zZXRbdGhpcy5oaXRfc3ViX3R5cGVdKTtcbiAgICAgICAgICAgIGl0ZW0uYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIGl0ZW0ucGFyZW50ID0gdGhpcy5tYW5fcm9vdDtcbiAgICAgICAgICAgIGl0ZW0ueCA9IHRoaXMucGFydF9wb3NbdGhpcy5nYW1lX21vZGUgLSAxXS54O1xuICAgICAgICAgICAgaXRlbS55ID0gdGhpcy5wYXJ0X3Bvc1t0aGlzLmdhbWVfbW9kZSAtIDFdLnk7XG4gICAgICAgICAgICB2YXIgY29tID0gaXRlbS5nZXRDb21wb25lbnQoXCJkZWNvcmF0aXZlX3BhcnRcIik7XG4gICAgICAgICAgICBjb20uaW52YWxpZF9oaXRfbW92ZSgpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaGl0X21haW5fdHlwZSA9PT0gMykge1xuICAgICAgICAgICAgaXRlbSA9IGNjLmluc3RhbnRpYXRlKHRoaXMuZm9vdF9zZXRbdGhpcy5oaXRfc3ViX3R5cGVdKTtcbiAgICAgICAgICAgIGl0ZW0uYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIGl0ZW0ucGFyZW50ID0gdGhpcy5tYW5fcm9vdDtcbiAgICAgICAgICAgIGl0ZW0ueCA9IHRoaXMucGFydF9wb3NbdGhpcy5nYW1lX21vZGUgLSAxXS54O1xuICAgICAgICAgICAgaXRlbS55ID0gdGhpcy5wYXJ0X3Bvc1t0aGlzLmdhbWVfbW9kZSAtIDFdLnk7XG4gICAgICAgICAgICB2YXIgY29tID0gaXRlbS5nZXRDb21wb25lbnQoXCJkZWNvcmF0aXZlX3BhcnRcIik7XG4gICAgICAgICAgICBjb20uaW52YWxpZF9oaXRfbW92ZSgpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaGl0X21haW5fdHlwZSA9PT0gNCkge1xuICAgICAgICAgICAgaXRlbSA9IGNjLmluc3RhbnRpYXRlKHRoaXMubGVmdF9oYW5kX3NldFt0aGlzLmhpdF9zdWJfdHlwZV0pO1xuICAgICAgICAgICAgaXRlbS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgaXRlbS5wYXJlbnQgPSB0aGlzLm1hbl9yb290O1xuICAgICAgICAgICAgaXRlbS54ID0gdGhpcy5wYXJ0X3Bvc1t0aGlzLmdhbWVfbW9kZSAtIDFdLng7XG4gICAgICAgICAgICBpdGVtLnkgPSB0aGlzLnBhcnRfcG9zW3RoaXMuZ2FtZV9tb2RlIC0gMV0ueTtcbiAgICAgICAgICAgIHZhciBjb20gPSBpdGVtLmdldENvbXBvbmVudChcImRlY29yYXRpdmVfcGFydFwiKTtcbiAgICAgICAgICAgIGNvbS5pbnZhbGlkX2hpdF9tb3ZlKCk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5oaXRfbWFpbl90eXBlID09PSA1KSB7XG4gICAgICAgICAgICBpdGVtID0gY2MuaW5zdGFudGlhdGUodGhpcy5yaWdodF9oYW5kX3NldFt0aGlzLmhpdF9zdWJfdHlwZV0pO1xuICAgICAgICAgICAgaXRlbS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgaXRlbS5wYXJlbnQgPSB0aGlzLm1hbl9yb290O1xuICAgICAgICAgICAgaXRlbS54ID0gdGhpcy5wYXJ0X3Bvc1t0aGlzLmdhbWVfbW9kZSAtIDFdLng7XG4gICAgICAgICAgICBpdGVtLnkgPSB0aGlzLnBhcnRfcG9zW3RoaXMuZ2FtZV9tb2RlIC0gMV0ueTtcbiAgICAgICAgICAgIHZhciBjb20gPSBpdGVtLmdldENvbXBvbmVudChcImRlY29yYXRpdmVfcGFydFwiKTtcbiAgICAgICAgICAgIGNvbS5pbnZhbGlkX2hpdF9tb3ZlKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZGVzdHJveV9tYWNoaW5lX21hbjogZnVuY3Rpb24gZGVzdHJveV9tYWNoaW5lX21hbigpIHtcbiAgICAgICAgLy8gMCwgODgwLCAwLCAzNDBcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5sb2NrX21vdmVfYmFjayk7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMubG9ja19kZXN0cm95KTtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5nYW1lX21vZGUpO1xuXG4gICAgICAgIGlmICh0aGlzLmxvY2tfbW92ZV9iYWNrICYmIHRoaXMuZ2FtZV9tb2RlIDwgNiB8fCB0aGlzLmxvY2tfZGVzdHJveSB8fCB0aGlzLmdhbWVfbW9kZSA8PSAxKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmxvY2tfZGVzdHJveSA9IHRydWU7XG4gICAgICAgIGlmICh0aGlzLnNlbGVjdF9pdGVtKSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdF9pdGVtLmdldENvbXBvbmVudChcImRlY29yYXRpdmVfcGFydFwiKS5pbnZhbGlkX2hpdF9tb3ZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50b3Bfd29ya2VyLnkgPSAxMTgwO1xuXG4gICAgICAgIHZhciBtID0gY2MubW92ZUJ5KDEsIDAsIC04NDApO1xuICAgICAgICB2YXIgbTIgPSBjYy5tb3ZlQnkoMSwgMCwgODQwKTtcblxuICAgICAgICB2YXIgZnVuYyA9IGNjLmNhbGxGdW5jKChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbW0gPSBjYy5tb3ZlQnkoMSwgMCwgODQwKTtcbiAgICAgICAgICAgIHRoaXMubWFuX3Jvb3QucnVuQWN0aW9uKG1tKTtcbiAgICAgICAgfSkuYmluZCh0aGlzKSwgdGhpcyk7XG5cbiAgICAgICAgdmFyIGVuZF9mdW5jID0gY2MuY2FsbEZ1bmMoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMubWFuX3Jvb3QueCA9IDA7XG4gICAgICAgICAgICB0aGlzLm1hbl9yb290LnkgPSAwO1xuICAgICAgICAgICAgdGhpcy5tYW5fcm9vdC5yZW1vdmVBbGxDaGlsZHJlbigpO1xuICAgICAgICAgICAgdGhpcy50b3Bfd29ya2VyLnkgPSAxMTgwO1xuICAgICAgICAgICAgdGhpcy5sb2NrX2Rlc3Ryb3kgPSBmYWxzZTtcbiAgICAgICAgICAgIC8vIHRoaXMuZ2FtZV9zdGFydCA9IGZhbHNlO1xuICAgICAgICAgICAgLy8gdGhpcy5vbl9zdGFydF9nYW1lKCk7XG4gICAgICAgICAgICAvLyB0aGlzLmdhbWVfbW9kZSA9IDA7XG4gICAgICAgICAgICAvLyB0aGlzLmdvdG9fbmV4dF9wYXJ0KCk7XG4gICAgICAgICAgICAvLyB0aGlzLm1vdmVfcGFydF9iYWNrKCk7XG4gICAgICAgICAgICB0aGlzLm1vdmVfcGFydF9iYWNrX3doZW5fZGVzdHJveSgpO1xuICAgICAgICB9KS5iaW5kKHRoaXMpLCB0aGlzKTtcbiAgICAgICAgdmFyIHNlcSA9IGNjLnNlcXVlbmNlKFttLCBmdW5jLCBtMiwgZW5kX2Z1bmNdKTtcbiAgICAgICAgdGhpcy50b3Bfd29ya2VyLnJ1bkFjdGlvbihzZXEpO1xuICAgIH0sXG5cbiAgICBnb3RvX25leHRfcGFydDogZnVuY3Rpb24gZ290b19uZXh0X3BhcnQoKSB7XG4gICAgICAgIHRoaXMucGFydHMucmVtb3ZlQWxsQ2hpbGRyZW4oKTtcbiAgICAgICAgdGhpcy5nYW1lX21vZGUrKztcbiAgICAgICAgaWYgKHRoaXMuZ2FtZV9tb2RlID4gNSkge1xuICAgICAgICAgICAgLy8g6Lez6KGo5oOFXG4gICAgICAgICAgICB2YXIgaW5kZXggPSAxICsgTWF0aC5yYW5kb20oKSAqIDk7XG4gICAgICAgICAgICBpbmRleCA9IE1hdGguZmxvb3IoaW5kZXgpO1xuICAgICAgICAgICAgaWYgKGluZGV4ID4gOSkge1xuICAgICAgICAgICAgICAgIGluZGV4ID0gOTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5wbGF5X3NvdW5kX2xvb3AoXCJyZXNvdXJjZXMvc291bmRzL21hbl92b2ljZS5tcDNcIik7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IG5ldyBjYy5Ob2RlKCk7XG4gICAgICAgICAgICB2YXIgdXJsID0gY2MudXJsLnJhdyhcInJlc291cmNlcy90ZXh0dXJlL2dhbWVfc2NlbmUvZmFjZVwiICsgaW5kZXggKyBcIi5wbmdcIik7XG4gICAgICAgICAgICB2YXIgcyA9IGl0ZW0uYWRkQ29tcG9uZW50KGNjLlNwcml0ZSk7XG4gICAgICAgICAgICBzLnNwcml0ZUZyYW1lID0gbmV3IGNjLlNwcml0ZUZyYW1lKHVybCk7XG5cbiAgICAgICAgICAgIGl0ZW0ucGFyZW50ID0gdGhpcy5tYW5fcm9vdDtcbiAgICAgICAgICAgIGl0ZW0ueCA9IDA7XG4gICAgICAgICAgICBpdGVtLnkgPSB0aGlzLmZhY2VfeTtcblxuICAgICAgICAgICAgaXRlbS5vcGFjaXR5ID0gMDtcbiAgICAgICAgICAgIGl0ZW0ucnVuQWN0aW9uKGNjLmZhZGVJbigwLjUpKTtcblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zaG93X2dhbWVfc3RhZ2VfdGlwKHRoaXMuZ2FtZV9tb2RlKTtcbiAgICAgICAgaWYgKHRoaXMuZ2FtZV9tb2RlID09PSAxKSB7XG4gICAgICAgICAgICB0aGlzLm5ld19wYXJ0X3NldCh0aGlzLmhlYWRlcl9zZXQpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZ2FtZV9tb2RlID09PSAyKSB7XG4gICAgICAgICAgICB0aGlzLm5ld19wYXJ0X3NldCh0aGlzLmJvZHlfc2V0KTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmdhbWVfbW9kZSA9PT0gMykge1xuICAgICAgICAgICAgdGhpcy5uZXdfcGFydF9zZXQodGhpcy5mb290X3NldCk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5nYW1lX21vZGUgPT09IDQpIHtcbiAgICAgICAgICAgIHRoaXMubmV3X3BhcnRfc2V0KHRoaXMubGVmdF9oYW5kX3NldCk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5nYW1lX21vZGUgPT09IDUpIHtcbiAgICAgICAgICAgIHRoaXMubmV3X3BhcnRfc2V0KHRoaXMucmlnaHRfaGFuZF9zZXQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2VsZWN0X3BhcnQoKTtcbiAgICB9LFxuXG4gICAgZW50ZXJfbmV4dF9tb2RlOiBmdW5jdGlvbiBlbnRlcl9uZXh0X21vZGUoKSB7XG4gICAgICAgIGlmICh0aGlzLmhpdF9pdGVtICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMucmVwbGFjZV9pdGVtKCk7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdF9pdGVtID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmdhbWVfbW9kZSA9PT0gMSkge1xuICAgICAgICAgICAgLy8g5LiN55So5pKt5pS+54SK5o6l5Yqo55S7XG4gICAgICAgICAgICB0aGlzLnBsYXlfc291bmQoXCJyZXNvdXJjZXMvc291bmRzLzNoZWFkLm1wM1wiKTtcbiAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nb3RvX25leHRfcGFydCgpO1xuICAgICAgICAgICAgfSkuYmluZCh0aGlzKSwgMyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBwbGF5IOWKqOeUu1xuICAgICAgICB2YXIgb2xkX3BvcyA9IGNjLnAodGhpcy5yaWdodF93b3JrZXIueCwgdGhpcy5yaWdodF93b3JrZXIueSk7XG4gICAgICAgIHZhciBwb3MgPSB0aGlzLnBhcnRfcG9zW3RoaXMuZ2FtZV9tb2RlIC0gMV07XG4gICAgICAgIGlmICh0aGlzLmdhbWVfbW9kZSA9PT0gMikge1xuICAgICAgICAgICAgcG9zID0gdGhpcy5wYXJ0X3Bvc1swXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB3X3BvcyA9IHRoaXMubWFuX3Jvb3QuY29udmVydFRvV29ybGRTcGFjZUFSKHBvcyk7XG4gICAgICAgIHBvcyA9IHRoaXMubm9kZS5jb252ZXJ0VG9Ob2RlU3BhY2VBUih3X3Bvcyk7XG4gICAgICAgIHZhciBtMSA9IGNjLm1vdmVUbygxLCBwb3MpO1xuXG4gICAgICAgIHZhciBmdW5jMiA9IGNjLmNhbGxGdW5jKChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnBsYXlfc291bmQoXCJyZXNvdXJjZXMvc291bmRzL2hhbmppZS5tcDNcIik7XG4gICAgICAgICAgICB2YXIgcGFydCA9IHRoaXMucmlnaHRfd29ya2VyLmdldENoaWxkQnlOYW1lKFwiaGFuamllXCIpLmdldENvbXBvbmVudChjYy5QYXJ0aWNsZVN5c3RlbSk7XG4gICAgICAgICAgICBwYXJ0LnN0b3BTeXN0ZW0oKTtcbiAgICAgICAgICAgIHBhcnQucmVzZXRTeXN0ZW0oKTtcbiAgICAgICAgfSkuYmluZCh0aGlzKSwgdGhpcyk7XG5cbiAgICAgICAgdmFyIG0yID0gY2MubW92ZVRvKDEsIG9sZF9wb3MpO1xuICAgICAgICB2YXIgZnVuYyA9IGNjLmNhbGxGdW5jKChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmdvdG9fbmV4dF9wYXJ0KCk7XG4gICAgICAgIH0pLmJpbmQodGhpcyksIHRoaXMpO1xuICAgICAgICAvLyBlbmRcblxuICAgICAgICB2YXIgZnVuYzMgPSBjYy5jYWxsRnVuYygoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc3dpdGNoICh0aGlzLmdhbWVfbW9kZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbGF5X3NvdW5kKFwicmVzb3VyY2VzL3NvdW5kcy8zaGVhZC5tcDNcIik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbGF5X3NvdW5kKFwicmVzb3VyY2VzL3NvdW5kcy8yYm9keS5tcDNcIik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbGF5X3NvdW5kKFwicmVzb3VyY2VzL3NvdW5kcy82dHVpLm1wM1wiKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsYXlfc291bmQoXCJyZXNvdXJjZXMvc291bmRzLzFhcm0ubXAzXCIpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGxheV9zb3VuZChcInJlc291cmNlcy9zb3VuZHMvMWFybS5tcDNcIik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KS5iaW5kKHRoaXMpLCB0aGlzKTtcbiAgICAgICAgdmFyIHNlcSA9IGNjLnNlcXVlbmNlKFttMSwgZnVuYzIsIGNjLmRlbGF5VGltZSgxKSwgbTIsIGZ1bmMzLCBjYy5kZWxheVRpbWUoMyksIGZ1bmNdKTtcbiAgICAgICAgdGhpcy5yaWdodF93b3JrZXIucnVuQWN0aW9uKHNlcSk7XG4gICAgfSxcblxuICAgIGhpdF9tYWNoaW5lX21hbl9wYXJ0OiBmdW5jdGlvbiBoaXRfbWFjaGluZV9tYW5fcGFydChpdGVtLCB3X3BvcywgbWFpbl90eXBlLCBzdWJfdHlwZSkge1xuICAgICAgICB2YXIgZHN0X3BvcyA9IHRoaXMucGFydF9wb3NbdGhpcy5nYW1lX21vZGUgLSAxXTtcbiAgICAgICAgdmFyIHdfZHN0X3BvcyA9IHRoaXMubWFuX3Jvb3QuY29udmVydFRvV29ybGRTcGFjZUFSKGRzdF9wb3MpO1xuXG4gICAgICAgIGlmIChjYy5wRGlzdGFuY2Uod19wb3MsIHdfZHN0X3BvcykgPD0gMTIwKSB7XG4gICAgICAgICAgICB0aGlzLmxvY2tfbW92ZV9iYWNrID0gdHJ1ZTtcbiAgICAgICAgICAgIGl0ZW0ub25faGl0X2l0ZW0oMC4yLCB3X2RzdF9wb3MpO1xuICAgICAgICAgICAgaXRlbS5pbnZhbGlkX2hpdF9tb3ZlKCk7XG4gICAgICAgICAgICB0aGlzLmhpdF9pdGVtID0gaXRlbTtcbiAgICAgICAgICAgIHRoaXMuaGl0X21haW5fdHlwZSA9IG1haW5fdHlwZTtcbiAgICAgICAgICAgIHRoaXMuaGl0X3N1Yl90eXBlID0gc3ViX3R5cGU7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgY2hlY2tvdXRfZ2FtZTogZnVuY3Rpb24gY2hlY2tvdXRfZ2FtZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuZ2FtZV9zdGFydCA9PT0gZmFsc2UgfHwgdGhpcy5nYW1lX21vZGUgPD0gNSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5wbGF5X3NvdW5kKFwicmVzb3VyY2VzL3NvdW5kcy9lbmQubXAzXCIpO1xuICAgICAgICB2YXIgY2hlY2tfcm9vdCA9IGNjLmZpbmQoXCJVSV9ST09UL2NoZWNrX291dF9yb290XCIpO1xuICAgICAgICBjaGVja19yb290LmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIHRoaXMuZ2FtZV9zdGFydCA9IGZhbHNlO1xuICAgIH0sXG5cbiAgICBvbl9yZXBsYXlfZ2FtZTogZnVuY3Rpb24gb25fcmVwbGF5X2dhbWUoKSB7XG4gICAgICAgIHZhciBjaGVja19yb290ID0gY2MuZmluZChcIlVJX1JPT1QvY2hlY2tfb3V0X3Jvb3RcIik7XG4gICAgICAgIGNoZWNrX3Jvb3QuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMub25fc3RhcnRfZ2FtZSgpO1xuICAgIH0sXG5cbiAgICBvbl9raW1fY2xpY2s6IGZ1bmN0aW9uIG9uX2tpbV9jbGljaygpIHtcbiAgICAgICAgaWYgKHRoaXMubG9ja19raW1fY2xpY2sgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBsYXlfa2ltX2NsaWNrX2FuaW1fd2l0aF9yYW5kb20oKTtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzFiODk0NlQrcmhBeUxWTUR0ZUhoRVd5JywgJ21vdmVfYWN0aW9uJyk7XG4vLyBzY3JpcHRlc1xcbW92ZV9hY3Rpb24uanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBwbGF5X29ubG9hZDogdHJ1ZSxcbiAgICAgICAgcGxheV9vbmxvYWRfZGVsYXk6IDAsXG4gICAgICAgIHN0YXJ0X2FjdGl2ZTogZmFsc2UsXG4gICAgICAgIG1vdmVfZHVyYXRpb246IDAsXG4gICAgICAgIG1vdmVfdGltZTogMC4yLFxuICAgICAgICBpc19ob3I6IGZhbHNlLFxuICAgICAgICBpc19qdW1wOiB0cnVlXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLm5vZGUuYWN0aXZlID0gdGhpcy5zdGFydF9hY3RpdmU7XG4gICAgICAgIGlmICh0aGlzLnBsYXlfb25sb2FkID09PSB0cnVlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wbGF5X29ubG9hZF9kZWxheSA8PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGxheSgpO1xuICAgICAgICAgICAgICAgIH0pLmJpbmQodGhpcyksIHRoaXMucGxheV9vbmxvYWRfZGVsYXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIHBsYXk6IGZ1bmN0aW9uIHBsYXkoKSB7XG4gICAgICAgIHRoaXMubm9kZS5zdG9wQWxsQWN0aW9ucygpO1xuXG4gICAgICAgIHRoaXMubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB2YXIgZHggPSAwO1xuICAgICAgICB2YXIgZHkgPSAwO1xuXG4gICAgICAgIHZhciBqdW1wX3ggPSAwO1xuICAgICAgICB2YXIganVtcF95ID0gMDtcblxuICAgICAgICBpZiAodGhpcy5pc19ob3IpIHtcbiAgICAgICAgICAgIGR4ID0gdGhpcy5tb3ZlX2R1cmF0aW9uO1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNfanVtcCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm1vdmVfZHVyYXRpb24gPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOWPs1xuICAgICAgICAgICAgICAgICAgICBqdW1wX3ggPSAtMTA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g5bemXG4gICAgICAgICAgICAgICAgICAgIGp1bXBfeCA9IDEwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGR5ID0gdGhpcy5tb3ZlX2R1cmF0aW9uO1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNfanVtcCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm1vdmVfZHVyYXRpb24gPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOS4ilxuICAgICAgICAgICAgICAgICAgICBqdW1wX3kgPSAtMTA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g5LiLXG4gICAgICAgICAgICAgICAgICAgIGp1bXBfeSA9IDEwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmlzX2p1bXApIHtcbiAgICAgICAgICAgIHZhciBtb3ZlMSA9IGNjLm1vdmVCeSh0aGlzLm1vdmVfdGltZSwgZHggLSBqdW1wX3gsIGR5IC0ganVtcF95KTtcbiAgICAgICAgICAgIHZhciBtb3ZlMiA9IGNjLm1vdmVCeSgwLjIsIGp1bXBfeCAqIDIsIGp1bXBfeSAqIDIpO1xuICAgICAgICAgICAgdmFyIG1vdmUzID0gY2MubW92ZUJ5KDAuMSwgLWp1bXBfeCwgLWp1bXBfeSk7XG4gICAgICAgICAgICB2YXIgc2VxID0gY2Muc2VxdWVuY2UoW21vdmUxLCBtb3ZlMiwgbW92ZTNdKTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24oc2VxKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBtb3ZlMSA9IGNjLm1vdmVCeSh0aGlzLm1vdmVfdGltZSwgZHgsIGR5KTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24obW92ZTEpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG1vdmVfYmFjazogZnVuY3Rpb24gbW92ZV9iYWNrKCkge1xuICAgICAgICB0aGlzLm5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5ub2RlLnN0b3BBbGxBY3Rpb25zKCk7XG4gICAgICAgIHZhciBkeCA9IDA7XG4gICAgICAgIHZhciBkeSA9IDA7XG5cbiAgICAgICAgdmFyIGp1bXBfeCA9IDA7XG4gICAgICAgIHZhciBqdW1wX3kgPSAwO1xuXG4gICAgICAgIGlmICh0aGlzLmlzX2hvcikge1xuICAgICAgICAgICAgZHggPSB0aGlzLm1vdmVfZHVyYXRpb247XG4gICAgICAgICAgICBpZiAodGhpcy5pc19qdW1wKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubW92ZV9kdXJhdGlvbiA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g5Y+zXG4gICAgICAgICAgICAgICAgICAgIGp1bXBfeCA9IC0xMDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyDlt6ZcbiAgICAgICAgICAgICAgICAgICAganVtcF94ID0gMTA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZHkgPSB0aGlzLm1vdmVfZHVyYXRpb247XG4gICAgICAgICAgICBpZiAodGhpcy5pc19qdW1wKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubW92ZV9kdXJhdGlvbiA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g5LiKXG4gICAgICAgICAgICAgICAgICAgIGp1bXBfeSA9IC0xMDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyDkuItcbiAgICAgICAgICAgICAgICAgICAganVtcF95ID0gMTA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaXNfanVtcCkge1xuICAgICAgICAgICAgdmFyIG1vdmUxID0gY2MubW92ZUJ5KHRoaXMubW92ZV90aW1lLCAtZHggKyBqdW1wX3gsIC1keSArIGp1bXBfeSk7XG4gICAgICAgICAgICB2YXIgbW92ZTIgPSBjYy5tb3ZlQnkoMC4yLCAtanVtcF94ICogMiwgLWp1bXBfeSAqIDIpO1xuICAgICAgICAgICAgdmFyIG1vdmUzID0gY2MubW92ZUJ5KDAuMSwganVtcF94LCBqdW1wX3kpO1xuICAgICAgICAgICAgdmFyIHNlcSA9IGNjLnNlcXVlbmNlKFttb3ZlMSwgbW92ZTIsIG1vdmUzXSk7XG4gICAgICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKHNlcSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgbW92ZTEgPSBjYy5tb3ZlQnkodGhpcy5tb3ZlX3RpbWUsIC1keCwgLWR5KTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24obW92ZTEpO1xuICAgICAgICB9XG4gICAgfVxufSk7XG4vLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuLy8gfSxcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzkwYjBjVFRoT3RDaHBqd281cERzM3l2JywgJ3BhdF9hY3Rpb24nKTtcbi8vIHNjcmlwdGVzXFxwYXRfYWN0aW9uLmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgcGxheV9vbmxvYWQ6IHRydWUsXG4gICAgICAgIHN0YXJ0X3NjYWxlOiAzLjUsXG4gICAgICAgIHBsYXlfb25sb2FkX2RlbGF5OiAwLFxuICAgICAgICBzdGFydF9hY3RpdmU6IGZhbHNlXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLm5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgaWYgKHRoaXMuc3RhcnRfYWN0aXZlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgdGhpcy5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLm5vZGUub3BhY2l0eSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucGxheV9vbmxvYWQgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnBsYXlfb25sb2FkX2RlbGF5IDw9IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXkoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbGF5KCk7XG4gICAgICAgICAgICAgICAgfSkuYmluZCh0aGlzKSwgdGhpcy5wbGF5X29ubG9hZF9kZWxheSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcGxheTogZnVuY3Rpb24gcGxheSgpIHtcbiAgICAgICAgdGhpcy5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIHRoaXMubm9kZS5zY2FsZSA9IHRoaXMuc3RhcnRfc2NhbGU7XG4gICAgICAgIHRoaXMubm9kZS5vcGFjaXR5ID0gMDtcbiAgICAgICAgdmFyIHNjYWxlMSA9IGNjLnNjYWxlVG8oMC4zLCAwLjgpO1xuICAgICAgICB2YXIgc2NhbGUyID0gY2Muc2NhbGVUbygwLjIsIDEuMik7XG4gICAgICAgIHZhciBzY2FsZTMgPSBjYy5zY2FsZVRvKDAuMSwgMS4wKTtcbiAgICAgICAgdmFyIHNlcSA9IGNjLnNlcXVlbmNlKFtzY2FsZTEsIHNjYWxlMiwgc2NhbGUzXSk7XG4gICAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24oc2VxKTtcbiAgICAgICAgdmFyIGZpbiA9IGNjLmZhZGVJbigwLjUpO1xuICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKGZpbik7XG4gICAgfSxcblxuICAgIG1vdmVfYmFjazogZnVuY3Rpb24gbW92ZV9iYWNrKCkge1xuICAgICAgICB0aGlzLm5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgLy8gdGhpcy5ub2RlLnNjYWxlID0gdGhpcy5zdGFydF9zY2FsZTtcbiAgICAgICAgLy8gdGhpcy5ub2RlLm9wYWNpdHkgPSAwO1xuICAgICAgICB2YXIgczIgPSBjYy5zY2FsZVRvKDAuMiwgMC44KTtcbiAgICAgICAgdmFyIHMzID0gY2Muc2NhbGVUbygwLjMsIHRoaXMuc3RhcnRfc2NhbGUpO1xuICAgICAgICB2YXIgc2VxID0gY2Muc2VxdWVuY2UoW3MyLCBzM10pO1xuICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKHNlcSk7XG4gICAgICAgIHZhciBmb3V0ID0gY2MuZmFkZU91dCgwLjUpO1xuICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKGZvdXQpO1xuICAgIH1cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc2Njg0M21iUkpWTGZvV1NyNjIxVWRhaycsICdyb3RfYWN0aW9uJyk7XG4vLyBzY3JpcHRlc1xccm90X2FjdGlvbi5qc1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIHJvdF90aW1lOiAwLFxuICAgICAgICByb3RfYnk6IDM2MCxcbiAgICAgICAgaXNfbG9vcDogdHJ1ZSxcbiAgICAgICAgcGxheV9vbmxvYWQ6IHRydWUsXG4gICAgICAgIHBsYXlfb25sb2FkX2RlbGF5OiAwXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICBpZiAodGhpcy5wbGF5X29ubG9hZCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucGxheV9vbmxvYWRfZGVsYXkgPiAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UodGhpcy5wbGF5LmJpbmQodGhpcyksIHRoaXMucGxheV9vbmxvYWRfZGVsYXkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXkoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBwbGF5OiBmdW5jdGlvbiBwbGF5KCkge1xuICAgICAgICB2YXIgciA9IGNjLnJvdGF0ZUJ5KHRoaXMucm90X3RpbWUsIHRoaXMucm90X2J5KTtcbiAgICAgICAgdmFyIGFjdGlvbl9zZXQgPSBbXTtcbiAgICAgICAgdmFyIHJfYWN0aW9uO1xuICAgICAgICBhY3Rpb25fc2V0LnB1c2gocik7XG5cbiAgICAgICAgdmFyIHNlcSA9IGNjLnNlcXVlbmNlKGFjdGlvbl9zZXQpO1xuICAgICAgICBpZiAodGhpcy5pc19sb29wKSB7XG4gICAgICAgICAgICB2YXIgZiA9IGNjLnJlcGVhdEZvcmV2ZXIoc2VxKTtcbiAgICAgICAgICAgIHJfYWN0aW9uID0gZjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJfYWN0aW9uID0gc2VxO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihyX2FjdGlvbik7XG4gICAgfVxuXG59KTtcbi8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4vLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4vLyB9LFxuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMTljMDJTcTVJOU1zcm5FNXN6aWpOdmYnLCAnc2NhbGVfYWN0aW9uJyk7XG4vLyBzY3JpcHRlc1xcc2NhbGVfYWN0aW9uLmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgcGxheV9vbmxvYWQ6IHRydWUsXG4gICAgICAgIHBsYXlfb25sb2FkX2RlbGF5OiAwLFxuICAgICAgICBkc3Rfc2NhbGU6IDAsXG4gICAgICAgIHNjYWxlX3RpbWU6IDAuMlxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgaWYgKHRoaXMucGxheV9vbmxvYWQgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnBsYXlfb25sb2FkX2RlbGF5IDw9IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXkoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbGF5KCk7XG4gICAgICAgICAgICAgICAgfSkuYmluZCh0aGlzKSwgdGhpcy5wbGF5X29ubG9hZF9kZWxheSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcGxheTogZnVuY3Rpb24gcGxheSgpIHtcbiAgICAgICAgdmFyIHMgPSBjYy5zY2FsZVRvKHRoaXMuc2NhbGVfdGltZSwgdGhpcy5kc3Rfc2NhbGUpO1xuICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKHMpO1xuICAgIH1cbn0pO1xuLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbi8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbi8vIH0sXG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc0MmYzZENUdS81R0Q2eE5RVkVacE1iZScsICdzY2FsZV9taW5fdG9fbWF4Jyk7XG4vLyBzY3JpcHRlc1xcc2NhbGVfbWluX3RvX21heC5qc1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIG1heF90aW1lOiAwLjQsXG4gICAgICAgIG1pbl90aW1lOiAwLjQsXG4gICAgICAgIG1heF9zY2FsZTogMS4yLFxuICAgICAgICBtaW5fc2NhbGU6IDAuOCxcbiAgICAgICAgZGVsYXlfdGltZTogMCxcbiAgICAgICAgaXNfcmV2OiBmYWxzZSxcbiAgICAgICAgcGxheV9vbmxvYWQ6IGZhbHNlXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICBpZiAodGhpcy5wbGF5X29ubG9hZCkge1xuICAgICAgICAgICAgdGhpcy5wbGF5KCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcGxheTogZnVuY3Rpb24gcGxheSgpIHtcbiAgICAgICAgdmFyIGFjdGlvbnMgPSBbXTtcbiAgICAgICAgaWYgKHRoaXMuaXNfcmV2KSB7XG4gICAgICAgICAgICB2YXIgczIgPSBjYy5zY2FsZVRvKHRoaXMubWluX3RpbWUsIHRoaXMubWluX3NjYWxlKTtcbiAgICAgICAgICAgIGFjdGlvbnMucHVzaChzMik7XG4gICAgICAgICAgICBpZiAodGhpcy5kZWxheV90aW1lID4gMCkge1xuICAgICAgICAgICAgICAgIGFjdGlvbnMucHVzaChjYy5kZWxheVRpbWUodGhpcy5kZWxheV90aW1lKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgczEgPSBjYy5zY2FsZVRvKHRoaXMubWF4X3RpbWUsIHRoaXMubWF4X3NjYWxlKTtcbiAgICAgICAgICAgIGFjdGlvbnMucHVzaChzMSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgczEgPSBjYy5zY2FsZVRvKHRoaXMubWF4X3RpbWUsIHRoaXMubWF4X3NjYWxlKTtcbiAgICAgICAgICAgIGFjdGlvbnMucHVzaChzMSk7XG4gICAgICAgICAgICBpZiAodGhpcy5kZWxheV90aW1lID4gMCkge1xuICAgICAgICAgICAgICAgIGFjdGlvbnMucHVzaChjYy5kZWxheVRpbWUodGhpcy5kZWxheV90aW1lKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgczIgPSBjYy5zY2FsZVRvKHRoaXMubWluX3RpbWUsIHRoaXMubWluX3NjYWxlKTtcbiAgICAgICAgICAgIGFjdGlvbnMucHVzaChzMik7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc2VxID0gY2Muc2VxdWVuY2UoYWN0aW9ucyk7XG4gICAgICAgIHZhciBmID0gY2MucmVwZWF0Rm9yZXZlcihzZXEpO1xuICAgICAgICB0aGlzLmYgPSBmO1xuICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKGYpO1xuICAgIH0sXG5cbiAgICBzdG9wOiBmdW5jdGlvbiBzdG9wKCkge1xuICAgICAgICB0aGlzLm5vZGUuc3RvcEFjdGlvbih0aGlzLmYpO1xuICAgIH1cbn0pO1xuLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbi8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbi8vIH0sXG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc4NzZjMlRZeGZWSE9xL29Pd2s2bTNTWicsICdzdGFydF9zY2VuZScpO1xuLy8gc2NyaXB0ZXNcXHN0YXJ0X3NjZW5lLmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgcHJlbG9hZF9zb3VuZDogZnVuY3Rpb24gcHJlbG9hZF9zb3VuZCgpIHtcbiAgICAgICAgdmFyIHNvdW5kX2xpc3QgPSBbXCJyZXNvdXJjZXMvc291bmRzL2JvbmVzX2luLm1wM1wiLCBcInJlc291cmNlcy9zb3VuZHMvZ29fYXV0by5tcDNcIiwgXCJyZXNvdXJjZXMvc291bmRzL21vdmVfcGFydHMubXAzXCIsIFwicmVzb3VyY2VzL3NvdW5kcy9waW5nX29rLm1wM1wiLCBcInJlc291cmNlcy9zb3VuZHMvcGxheS5tcDNcIl07XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzb3VuZF9saXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgdXJsID0gY2MudXJsLnJhdyhzb3VuZF9saXN0W2ldKTtcbiAgICAgICAgICAgIGNjLmxvYWRlci5sb2FkUmVzKHVybCwgZnVuY3Rpb24gKCkge30pO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHBsYXlfc291bmQ6IGZ1bmN0aW9uIHBsYXlfc291bmQobmFtZSkge1xuICAgICAgICB2YXIgdXJsX2RhdGEgPSBjYy51cmwucmF3KG5hbWUpO1xuICAgICAgICBjYy5hdWRpb0VuZ2luZS5zdG9wTXVzaWMoKTtcbiAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheU11c2ljKHVybF9kYXRhKTtcbiAgICB9LFxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLnByZWxvYWRfc291bmQoKTtcbiAgICB9LFxuXG4gICAgb25fZ2FtZV9zdGFydDogZnVuY3Rpb24gb25fZ2FtZV9zdGFydCgpIHtcbiAgICAgICAgdmFyIHBsYXlfYmsgPSBjYy5maW5kKFwiVUlfUk9PVC9hbmNob3ItY2VudGVyL3BsYXlfbm9kZS9wbGF5ZXJfYmtcIik7XG4gICAgICAgIHBsYXlfYmsuc3RvcEFsbEFjdGlvbnMoKTtcbiAgICAgICAgdmFyIHJvdF9ieSA9IGNjLnJvdGF0ZUJ5KDEsIC0zNjApO1xuICAgICAgICBwbGF5X2JrLnJ1bkFjdGlvbihyb3RfYnkpO1xuXG4gICAgICAgIHRoaXMucGxheV9zb3VuZChcInJlc291cmNlcy9zb3VuZHMvcGxheS5tcDNcIik7XG4gICAgICAgIHZhciBkZWxheSA9IGNjLmRlbGF5VGltZSgxKTtcbiAgICAgICAgdmFyIGZ1bmMgPSBjYy5jYWxsRnVuYygoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gdG9wXG4gICAgICAgICAgICBjYy5maW5kKFwiVUlfUk9PVC9hbmNob3ItY2VudGVyL3BsYXlfbm9kZVwiKS5nZXRDb21wb25lbnQoXCJwYXRfYWN0aW9uXCIpLm1vdmVfYmFjaygpO1xuICAgICAgICAgICAgLy8gZW5kXG5cbiAgICAgICAgICAgIC8vIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcImdhbWVfc2NlbmVcIik7XG4gICAgICAgIH0pLmJpbmQodGhpcyksIHRoaXMpO1xuXG4gICAgICAgIHZhciBmdW5jMiA9IGNjLmNhbGxGdW5jKChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJnYW1lX3NjZW5lXCIpO1xuICAgICAgICB9KS5iaW5kKHRoaXMpLCB0aGlzKTtcblxuICAgICAgICB2YXIgc2VxID0gY2Muc2VxdWVuY2UoW2RlbGF5LCBmdW5jLCBjYy5kZWxheVRpbWUoMC44KSwgZnVuYzJdKTtcbiAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihzZXEpO1xuICAgIH1cbn0pO1xuLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbi8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbi8vIH0sXG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICcwNzE1ZnhEdWxGSm5MemlKclhNZ1I1VCcsICd0YWxrX2RsZ19hY3Rpb24nKTtcbi8vIHNjcmlwdGVzXFx0YWxrX2RsZ19hY3Rpb24uanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBzdGFydF9zOiAwLFxuICAgICAgICBzdGFydF94OiAwLFxuICAgICAgICBzdGFydF95OiAwLFxuXG4gICAgICAgIHNjYWxlX2R4OiAwLFxuICAgICAgICBzY2FsZV9keTogMCxcbiAgICAgICAgbW92ZV9keDogMCxcbiAgICAgICAgbW92ZV9keTogMCxcblxuICAgICAgICBhY3Rpb25fdGltZTogMixcbiAgICAgICAgcGxheV9vbmxvYWQ6IHRydWUsXG5cbiAgICAgICAgZmFkZV9vdXRfZGVsYXk6IDMsXG4gICAgICAgIGZhZGVfYWN0aW9uX3RpbWU6IDAuMyxcbiAgICAgICAgc3RhcnRfdmlzaWJsZTogZmFsc2UsXG5cbiAgICAgICAgcGxheV9vbmxvYWRfZGVsYXk6IDBcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIGlmICh0aGlzLnN0YXJ0X3Zpc2libGUgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHRoaXMubm9kZS5zY2FsZSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucGxheV9vbmxvYWQpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnBsYXlfb25sb2FkX2RlbGF5IDw9IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXkoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbGF5KCk7XG4gICAgICAgICAgICAgICAgfSkuYmluZCh0aGlzKSwgdGhpcy5wbGF5X29ubG9hZF9kZWxheSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcGxheTogZnVuY3Rpb24gcGxheSgpIHtcbiAgICAgICAgdmFyIHMgPSBjYy5zY2FsZVRvKHRoaXMuYWN0aW9uX3RpbWUsIHRoaXMuc3RhcnRfcyArIHRoaXMuc2NhbGVfZHgsIHRoaXMuc3RhcnRfcyArIHRoaXMuc2NhbGVfZHkpO1xuICAgICAgICB2YXIgbSA9IGNjLm1vdmVCeSh0aGlzLmFjdGlvbl90aW1lLCB0aGlzLm1vdmVfZHgsIHRoaXMubW92ZV9keSk7XG5cbiAgICAgICAgdGhpcy5ub2RlLnN0b3BBbGxBY3Rpb25zKCk7XG4gICAgICAgIHRoaXMudW5zY2hlZHVsZUFsbENhbGxiYWNrcygpO1xuXG4gICAgICAgIHRoaXMubm9kZS5zY2FsZSA9IHRoaXMuc3RhcnRfcztcbiAgICAgICAgdGhpcy5ub2RlLnggPSB0aGlzLnN0YXJ0X3g7XG4gICAgICAgIHRoaXMubm9kZS55ID0gdGhpcy5zdGFydF95O1xuXG4gICAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24ocyk7XG4gICAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24obSk7XG4gICAgICAgIHRoaXMubm9kZS5vcGFjaXR5ID0gMjU1O1xuXG4gICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZiA9IGNjLmZhZGVPdXQodGhpcy5mYWRlX2FjdGlvbl90aW1lKTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24oZik7XG4gICAgICAgIH0pLmJpbmQodGhpcyksIHRoaXMuZmFkZV9vdXRfZGVsYXkpO1xuICAgIH1cbn0pO1xuLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbi8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbi8vIH0sXG5cbmNjLl9SRnBvcCgpOyJdfQ==
