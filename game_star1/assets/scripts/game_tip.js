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
        star_index: -1,
    },
    // use this for initialization
    onLoad: function () {
        this.tip_node = new cc.Node();
        var s = this.tip_node.addComponent(cc.Sprite);
        var url = cc.url.raw('resources/textures/game_scene/click_tip.png');
        var frame1 = new cc.SpriteFrame(url);
        s.spriteFrame = frame1;
        this.tip_node.parent = this.node;
        this.tip_node.active = false;
        
        
        var delay = Math.random() * 0.5;
        var s1 = cc.scaleTo(0.8, 1.4);
        var s2 = cc.scaleTo(0.8, 1);
        var seq = cc.sequence([s1, s2]);
        var f = cc.repeatForever(seq);
        this.node.runAction(f);
    },
    
    play_anim: function() {
        this.tip_node.active = true;
        this.tip_node.opacity = 0;
        
        var call1 = cc.callFunc(function() {
            var fin = cc.fadeIn(0.4);
            var s1 = cc.scaleTo(0.4, 2);
            this.tip_node.runAction(fin);
            this.tip_node.runAction(s1);
        }.bind(this), this);
        
        var call2 = cc.callFunc(function() {
            var s2 = cc.scaleTo(0.4, 1);
            var fout = cc.fadeOut(0.4);
            this.tip_node.runAction(fout);
            this.tip_node.runAction(s2);
        }.bind(this), this);
        
        
        
        var seq = cc.sequence([call1, cc.delayTime(0.4), call2]);
        this.tip_node.runAction(seq);
    },
    
    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
