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