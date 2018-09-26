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