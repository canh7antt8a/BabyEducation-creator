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
    
    preload_sound: function() {
        var sound_list = [
            "resources/sounds/kousao.mp3",
            "resources/sounds/luoshi.mp3",
            "resources/sounds/plane.mp3",
            "resources/sounds/qiang.mp3",
            "resources/sounds/shuben.mp3",
            "resources/sounds/yaokong.mp3",

            "resources/sounds/zhichuang.mp3",
            "resources/sounds/zuqiu.mp3",
            "resources/sounds/start.mp3",
        ];
        
        for(var i = 0; i < sound_list.length; i ++) {
            var url = cc.url.raw(sound_list[i]);
            cc.loader.loadRes(url, function() {});    
        }
    }, 
    
    play_sound: function(name) {
        var url_data = cc.url.raw(name);
        cc.audioEngine.stopMusic();
        cc.audioEngine.playMusic(url_data);
    },
    
    onLoad: function () {
        this.started = false;
        this.preload_sound();
    },
    
    on_start_game: function() {
        if(this.started === true) {
            return;
        }
        this.play_sound("resources/sounds/start.mp3");
        var play_button_com = cc.find("UI_ROOT/start_layer/play").getComponent("pat_action");
        play_button_com.move_back();
        
        var tital_com = cc.find("UI_ROOT/start_layer/tital").getComponent("move_action");
        tital_com.move_back();
        
        var mask = cc.find("UI_ROOT/start_layer/bg_mask");
        var fout = cc.fadeOut(0.3);
        var call = cc.callFunc(function() {
            mask.removeFromParent();
        }.bind(this), this);
        var seq = cc.sequence([fout, call]);
        mask.runAction(seq);
        this.started = true;
        
        this.scheduleOnce(function() {
            this.node.removeFromParent();
        }.bind(this), 0.8);
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
