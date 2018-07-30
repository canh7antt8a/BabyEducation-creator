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
