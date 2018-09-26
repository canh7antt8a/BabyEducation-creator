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