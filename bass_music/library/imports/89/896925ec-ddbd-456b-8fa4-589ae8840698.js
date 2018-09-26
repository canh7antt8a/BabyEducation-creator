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
        rot_time: 0.4,
        rot_degree: 20,
        start_time: 0.1
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
        var rot1 = cc.rotateTo(this.rot_time, this.rot_degree);
        var rot2 = cc.rotateTo(this.rot_time, -this.rot_degree);
        var seq = cc.sequence([rot1, rot2]);
        var repeat = cc.repeatForever(seq);
        this.node.runAction(repeat);
    }
});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },