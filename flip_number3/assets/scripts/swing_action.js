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
        loop_time: 1,
        degree: 30,
        is_rev: false,
        play_onload: false,
    },

    // use this for initialization
    onLoad: function () {
        this.time_slice = this.loop_time * 0.25;
        if(this.play_onload) {
            this.play();    
        }
    },
    
    play: function() {
        var actions = [];
        var seq;
        if (this.is_rev) {
            this.node.rotation = -this.degree;   
            var r1 = cc.rotateBy(this.time_slice, this.degree * 0.5);
            var r2 = cc.rotateBy(this.time_slice, this.degree * 0.5);
            var r3 = cc.rotateBy(this.time_slice, this.degree * 0.5);
            var r4 = cc.rotateBy(this.time_slice, -this.degree * 0.5);
            
            var r5 = cc.rotateBy(this.time_slice, -this.degree * 0.5);
            var r6 = cc.rotateBy(this.time_slice, -this.degree * 0.5);
            var r7 = cc.rotateBy(this.time_slice, -this.degree * 0.5);
            var r8 = cc.rotateBy(this.time_slice, -this.degree * 0.5);
            seq = cc.sequence([r1, r2, r3, r4, r5, r6, r7, r8]);
            
        }
        else {
            this.node.rotation = this.degree;   
            var r1 = cc.rotateBy(this.time_slice, -this.degree * 0.5);
            var r2 = cc.rotateBy(this.time_slice, -this.degree * 0.5);
            var r3 = cc.rotateBy(this.time_slice, -this.degree * 0.5);
            var r4 = cc.rotateBy(this.time_slice, -this.degree * 0.5);
            
            var r5 = cc.rotateBy(this.time_slice, this.degree * 0.5);
            var r6 = cc.rotateBy(this.time_slice, this.degree * 0.5);
            var r7 = cc.rotateBy(this.time_slice, this.degree * 0.5);
            var r8 = cc.rotateBy(this.time_slice, this.degree * 0.5);
            seq = cc.sequence([r1, r2, r3, r4, r5, r6, r7, r8]);
            
        }
        
        var f = cc.repeatForever(seq);
        this.f = f;
        this.node.runAction(f);    
    },
    
    stop: function() {
        this.node.rotation = 0;
        this.node.stopAction(this.f);    
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
