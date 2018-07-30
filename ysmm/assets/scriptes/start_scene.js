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
        var url = cc.url.raw("resources/sounds/button_click.mp3");
        cc.loader.loadRes(url, function() {});
        url = cc.url.raw("resources/sounds/ck_error.mp3");
        cc.loader.loadRes(url, function() {});
        url = cc.url.raw("resources/sounds/ch_right.mp3");
        cc.loader.loadRes(url, function() {});
        
        // logo
        var logo = cc.find("UI_ROOT/anchor-center/game_tital");
        logo.y += 400;
        var move1 = cc.moveBy(0.2, 0, -410);
        var move2 = cc.moveBy(0.2, 0, 20);
        var move3 = cc.moveBy(0.1, 0, -10);
        var start_button = cc.find("UI_ROOT/anchor-center/game_start");
        start_button.active = false;
        var callfunc = cc.callFunc(function() {
            start_button.active = true;
            start_button.scale = 3.5;
            start_button.opacity = 0;
            var scale1 = cc.scaleTo(0.3, 0.8);
            var scale2 = cc.scaleTo(0.2, 1.2);
            var scale3 = cc.scaleTo(0.1, 1.0);
            var seq = cc.sequence([scale1, scale2, scale3]);
            start_button.runAction(seq);
            var fin = cc.fadeIn(0.5);
            start_button.runAction(fin);
        }.bind(this), this);
        
        var seq = cc.sequence([move1, move2, move3, callfunc]);
        logo.runAction(seq);
        // end
    },
    
    on_game_start_click: function() {
        cc.audioEngine.stopMusic();
        cc.audioEngine.playMusic(cc.url.raw("resources/sounds/button_click.mp3"));
        cc.director.loadScene("game_scene");
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
