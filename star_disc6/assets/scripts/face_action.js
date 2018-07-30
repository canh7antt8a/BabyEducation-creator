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
    // 360, 300
    onLoad: function () {
        var body = this.node.getChildByName("body");
        this.face = body.getChildByName("face");
        this.fire = body.getChildByName("fire");
        this.body = body;
        
        this.X_DELTA = (360 - 960) / 7;
        this.Y_DELTA = (300 - 540) / 7;
        this.now_grade = 0;
    },
    
    start: function() {
        var m1 = cc.moveBy(1, 0, 6);
        var m2 = cc.moveBy(1, 0, -6);
        var s = cc.sequence([m1, m2]);
        var f = cc.repeatForever(s);
        this.face.runAction(f);
        
        var s1 = cc.scaleTo(0.4, 0.9, 1);
        var s2 = cc.scaleTo(0.4, 1, 1);
        var seq = cc.sequence([s1, s2]);
        var f2 = cc.repeatForever(seq);
        this.fire.runAction(f2);
    },
    
    fadeout_body: function() {
        this.body.runAction(cc.fadeOut(0.5));    
    },
    
    // 800, 450 
    reset_face: function() {
        this.node.x = 960;
        this.node.y = 540;
        this.now_grade = 0;
        this.body.active = true;
        this.body.runAction(cc.fadeIn(0.1));
    }, 
    
    upgrade_game: function() {
        this.node.stopAllActions();
        this.now_grade ++;
        // this.now_grade = 7;
        this.node.runAction(cc.moveTo(5, 960 + this.now_grade * this.X_DELTA, 540 + this.now_grade * this.Y_DELTA));
    }, 
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
