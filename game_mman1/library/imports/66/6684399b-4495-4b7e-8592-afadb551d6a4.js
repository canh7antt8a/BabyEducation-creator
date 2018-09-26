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