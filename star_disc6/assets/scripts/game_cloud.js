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
    },

    // use this for initialization
    onLoad: function () {
        var delay = Math.random() * 0.5;
        this.scheduleOnce(function() {
            var m1 = cc.moveBy(4, 100, 0);
            var m2 = cc.moveBy(4, -100, 0);
            var seq = cc.sequence([m1, m2]);
            var f = cc.repeatForever(seq);
            this.node.runAction(f);    
        }.bind(this), delay);
        
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
