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
        this.started = false;
        this.preload_sound();
    },
    
    preload_sound: function() {
        var sound_list = [
            "resources/sounds/button.mp3",
            "resources/sounds/end.mp3",
            "resources/sounds/bozhong.mp3",
            "resources/sounds/jiaoshui.mp3",
            "resources/sounds/kaihua.mp3",
            "resources/sounds/sifei.mp3",
            "resources/sounds/upgrade.mp3",
            "resources/sounds/watu.mp3",
            "resources/sounds/xiyangguang.mp3",
        ];
        
        for(var i = 0; i < sound_list.length; i ++) {
            var url = cc.url.raw(sound_list[i]);
            cc.loader.loadRes(url, function() {});    
        }
    }, 
    
    on_game_start: function() {
        if(this.started == true) {
            return;
        }
        
        this.started = true;
        cc.audioEngine.stopMusic(false);
        var url = cc.url.raw("resources/sounds/button.mp3");
        cc.audioEngine.playMusic(url, false);
        
        var move_com = cc.find("UI_ROOT/anchor-center/logo").getComponent("move_action");
        var pat_com = cc.find("UI_ROOT/anchor-center/play").getComponent("pat_action");
        
        move_com.move_back();
        pat_com.move_back();
        
        this.scheduleOnce(function() {
            cc.director.loadScene("game_scene");
        }, 0.6)    
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
