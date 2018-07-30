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
        this.lock_star_click = false;
        
        var ske_com = this.node.getChildByName("ske_xingxing").getComponent(sp.Skeleton);
        ske_com.timeScale = 1.0 - Math.random() * 0.5;
    },
    
    play_sound: function(name) {
        var url_data = cc.url.raw(name);
        cc.audioEngine.rewindMusic();
        cc.audioEngine.stopMusic();
        this.call_latter(function(){
            cc.audioEngine.playMusic(url_data);
        }.bind(this), 0.01);
    },
    
    call_latter: function(callfunc, delay) {
        var delay_action = cc.delayTime(delay);
        var call_action = cc.callFunc(callfunc, this);
        var seq = cc.sequence([delay_action, call_action]);
        this.node.runAction(seq);
    },
    
    on_star_click: function() {
        if(this.lock_star_click) {
            return;
        }
        var index = Math.floor(Math.random() * 100000);
        index = index % 4;
        index = index + 1;
        
        this.play_sound("resources/sounds/star_" + index + ".mp3");
        this.lock_star_click = true;
        var ske_xingxing = this.node.getChildByName("ske_xingxing");
        
        var move_down = cc.moveBy(0.1, 0, -60);
        var move_up = cc.moveBy(0.2, 0, 100);
        var move_down2 = cc.moveBy(0.1, 0, -40);
        var func = cc.callFunc(function() {
            this.lock_star_click = false;
        }.bind(this), this);
        var seq = cc.sequence([move_down, move_up, move_down2, func]);
        ske_xingxing.runAction(seq);
    },
    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
