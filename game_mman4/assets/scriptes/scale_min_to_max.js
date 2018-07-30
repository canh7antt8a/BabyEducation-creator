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
        max_time: 0.4,
        min_time: 0.4,
        max_scale: 1.2,
        min_scale: 0.8,
        delay_time: 0,
        is_rev: false,
        play_onload: false,
    },

    // use this for initialization
    onLoad: function () {
        if(this.play_onload) {
            this.play();    
        }
    },
    
    play: function() {
        var actions = []
        if (this.is_rev) {
            var s2 = cc.scaleTo(this.min_time, this.min_scale);
            actions.push(s2);
            if (this.delay_time > 0) {
                actions.push(cc.delayTime(this.delay_time));    
            }
            var s1 = cc.scaleTo(this.max_time, this.max_scale);
            actions.push(s1);
        }
        else {
            var s1 = cc.scaleTo(this.max_time, this.max_scale);
            actions.push(s1);
            if (this.delay_time > 0) {
                actions.push(cc.delayTime(this.delay_time));    
            }
            var s2 = cc.scaleTo(this.min_time, this.min_scale);
            actions.push(s2);    
        }
        
        var seq = cc.sequence(actions);
        var f = cc.repeatForever(seq);
        this.f = f;
        this.node.runAction(f);    
    },
    
    stop: function() {
        this.node.stopAction(this.f);    
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
