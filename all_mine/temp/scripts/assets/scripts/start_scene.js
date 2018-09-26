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