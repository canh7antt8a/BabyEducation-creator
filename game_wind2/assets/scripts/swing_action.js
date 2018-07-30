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
    },
    
    add_win: function() {
        this.swing = true;
        if(this.doing === false) {
            this.doing = true;
            var time = 0.2 + Math.random() * 0.3;
            var r1 = cc.rotateTo(time, -this.rot);
            var r2 = cc.rotateTo(time * 2, this.rot);
            var r3 = cc.rotateTo(time, 0);
            var func = cc.callFunc(function() {
                this.doing = false;
            }.bind(this), this);
            
            var seq = cc.sequence([r1, r2, r3, func]);
            this.node.runAction(seq);
        }
    }
    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
