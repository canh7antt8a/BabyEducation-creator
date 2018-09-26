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