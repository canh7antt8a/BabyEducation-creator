cc.Class({
    extends: cc.Component,

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
        scale_time: 1,
        scale_min: 0.8,
        scale_end: 1.0,
    },

    // use this for initialization
    onLoad: function () {
        this.node.scale = this.scale_end;
        
        var s1 = cc.scaleTo(this.scale_time, this.scale_min);
        var s2 = cc.scaleTo(this.scale_time, this.scale_end);
        
        var seq = cc.sequence([s1, s2]);
        var f = cc.repeatForever(seq);
        this.node.runAction(f);
    },  

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
