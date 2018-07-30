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
        start_delay: 0,
        start_scale: 0.3,
        end_scale: 1,
    },

    // use this for initialization
    onLoad: function () {
        this.time_scale = 2;
        this.node.scale = this.start_scale;
        this.node.opacity = 0;
        if(this.start_delay > 0) {
            this.scheduleOnce(function() {
                this.play_anim();
            }.bind(this), this.start_delay * this.time_scale);
        }
        else {
            this.play_anim();    
        }
    },

    play_anim: function() {
        this.start_scale = 0.3;
        
        var func = cc.callFunc(function() {
            this.node.scale = this.start_scale;
            this.node.opacity = 255;
        }.bind(this), this);
        
        var func2 = cc.callFunc(function() {
            var time = 1.2 * this.time_scale;
            var s = cc.scaleTo(time, this.end_scale);
            var fout = cc.fadeOut(time);
            this.node.runAction(s);
            this.node.runAction(fout);
        }.bind(this), this);
        
        var delay = cc.delayTime(2 * this.time_scale);
        
        var seq = cc.sequence([func, func2, delay]);
        var r = cc.repeatForever(seq);
        this.node.runAction(r);
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
