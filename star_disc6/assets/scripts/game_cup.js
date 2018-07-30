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
        this.cap = this.node.getChildByName("cap");
        this.daoju = this.node.getChildByName("daoju");
        this.guang = this.node.getChildByName("guang");
        
        this.game_scene = cc.find("UI_ROOT").getComponent("game_scene");
    },
    
    start: function() {
        this.guang.scale = 0;
        var fin = cc.fadeIn(1);
        var fout = cc.fadeOut(1);
        
        var s = cc.sequence([fin, fout]);
        var f = cc.repeatForever(s);
        this.guang.runAction(f);
    },
    
    reset_cup: function() {
        this.guang.scale = 0;    
    },
    
    play_sound: function(name) {
        var url_data = cc.url.raw(name);
        cc.audioEngine.stopMusic();
        cc.audioEngine.playMusic(url_data);
    },
    
    get_daoju: function() {
        this.cap.runAction(cc.moveBy(1, 0, 50));
        var d = cc.delayTime(1.5);
        var func = cc.callFunc(function() {
            this.daoju.y = 200;    
        }.bind(this), this);
        
        var f2 = cc.callFunc(function() {
            this.guang.scale = 1;
            this.cap.runAction(cc.moveBy(1, 0, -50));
            this.play_sound("resources/sounds/baoshi_luoxia.mp3");
        }.bind(this), this);
        
        var f3 = cc.callFunc(function() {
            this.game_scene.hide_knowledge_card();
        }.bind(this), this);
        
        var s = cc.sequence([d, func, cc.moveTo(1, 0, 0), f2, cc.delayTime(1), f3]);
        this.daoju.runAction(s);
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
