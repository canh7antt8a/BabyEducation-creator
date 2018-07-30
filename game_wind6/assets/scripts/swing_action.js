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
        rot: 10
    },

    // use this for initialization
    onLoad: function () {
        this.swing = false;
        this.doing = false;
        this.rot = 3;
    },
    
    add_win: function() {
        var time = 0.2 + Math.random() * 0.3;
        var r1 = cc.rotateTo(time, -this.rot);
        var r2 = cc.rotateTo(time * 2, this.rot);
        var r3 = cc.rotateTo(time, 0);
           
        var seq = cc.sequence([r1, r2, r3]);
        this.node.runAction(cc.repeatForever(seq));
            
    }
    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
