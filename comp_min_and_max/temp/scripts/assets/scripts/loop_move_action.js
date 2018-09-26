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