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
            "resources/sounds/bones_in.mp3",
            "resources/sounds/go_auto.mp3",
            "resources/sounds/move_parts.mp3",
            "resources/sounds/ping_ok.mp3",
            "resources/sounds/play.mp3",
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
        this.preload_sound();
    },
    
    on_game_start: function() {
        var play_bk = cc.find("UI_ROOT/anchor-center/play_node/player_bk");
        play_bk.stopAllActions();
        var rot_by = cc.rotateBy(1, -360);
        play_bk.runAction(rot_by);
        
        
        this.play_sound("resources/sounds/play.mp3");
        var delay = cc.delayTime(1);
        var func = cc.callFunc(function() {
            // top
            cc.find("UI_ROOT/anchor-center/play_node").getComponent("pat_action").move_back();
            // end
 
            
            // cc.director.loadScene("game_scene");
        }.bind(this), this);
        
        var func2 = cc.callFunc(function() {
             cc.director.loadScene("game_scene");
        }.bind(this), this);
        
        var seq = cc.sequence([delay, func, cc.delayTime(0.8), func2]);
        this.node.runAction(seq);
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
