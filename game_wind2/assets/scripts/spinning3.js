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
        a_speed: 180,
    },

    // use this for initialization
    onLoad: function () {
        this.spin_mode = false;
        this.w_speed = 0;
    },
    
    add_speed: function(speed) { // 添加初速度
        this.node.stopAllActions();
        var seq = cc.sequence([cc.rotateTo(1, -10), cc.delayTime(0.2), cc.rotateTo(0.5 + Math.random() * 0.5, 0)]);
        this.node.runAction(seq);
    },
    
    get_speed: function() {
        return this.w_speed;
    }, 
   
});
