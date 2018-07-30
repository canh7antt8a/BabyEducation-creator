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
            "resources/sounds/1.mp3",
            "resources/sounds/2.mp3",
            "resources/sounds/3.mp3",
            "resources/sounds/4.mp3",
            "resources/sounds/5.mp3",
            "resources/sounds/6.mp3",

            "resources/sounds/7.mp3",
            "resources/sounds/8.mp3",
            "resources/sounds/9.mp3",
            "resources/sounds/10.mp3",
            "resources/sounds/click.mp3",
            "resources/sounds/checkout.mp3",
            "resources/sounds/error.mp3",
            "resources/sounds/tip.mp3",
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
        
        this.play_sound("resources/sounds/click.mp3");
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
            var main_scene = cc.find("UI_ROOT").getComponent("main_scene");
            main_scene.on_start_game();
            this.node.removeFromParent();
        }.bind(this), 0.8);
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
