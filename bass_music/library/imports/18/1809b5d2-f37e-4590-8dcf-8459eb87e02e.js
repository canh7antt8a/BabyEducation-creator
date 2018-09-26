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