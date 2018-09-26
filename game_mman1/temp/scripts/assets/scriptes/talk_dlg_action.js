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