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
        play_onload: true,
        play_onload_delay: 0,
        dst_scale: 0,
        scale_time: 0.2,
    },

    // use this for initialization
    onLoad: function () {
        if(this.play_onload === true) {
            if (this.play_onload_delay <= 0) {
                this.play();    
            }
            else {
                this.scheduleOnce(function(){
                    this.play();
                }.bind(this), this.play_onload_delay);
            }
        }
    },
    
    play: function() {
        var s = cc.scaleTo(this.scale_time, this.dst_scale);
        this.node.runAction(s);
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
