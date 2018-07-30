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
        xpos: 0,
        ypos: 0,
    },

    // use this for initialization
    onLoad: function () {
        this.mask = this.node.getChildByName("daoju");
        this.min = this.node.getChildByName("daoju2");
    },
    
    start: function() {
        // this.save_pos = this.node.getPosition();
        this.save_pos = cc.p(this.xpos, this.ypos);
        this.node.x = 0;
        this.node.y = 0;
    },
    
    show: function() {
        var time = 1;
        var m = cc.moveTo(time, this.save_pos);
        var func = cc.callFunc(function() {
            var fin = cc.fadeIn(1);
            var fout = cc.fadeOut(1);
            var seq = cc.sequence([fin, fout]);
            var f = cc.repeatForever(seq);
            this.mask.runAction(f);
            this.min.runAction(cc.moveTo(1, 21, 25));
        }.bind(this), this);
        
        var s = cc.sequence([m, func]);
        this.node.runAction(s);
        this.mask.opacity = 0;
        this.mask.stopAllActions();
        
        this.min.setPosition(cc.p(21, 0));
    },
    
    reset: function() {
        this.node.x = 0;
        this.node.y = 0;
        this.mask.stopAllActions();
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
