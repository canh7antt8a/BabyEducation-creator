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
        // this.preload_sound();
        this.lock_start = false;
    },
    
    call_latter: function(callfunc, delay) {
        var delay_action = cc.delayTime(delay);
        var call_action = cc.callFunc(callfunc, this);
        var seq = cc.sequence([delay_action, call_action]);
        this.node.runAction(seq);
    },
    
    play_sound: function(name) {
        var url_data = cc.url.raw(name);
        cc.audioEngine.stopMusic();
        cc.audioEngine.playMusic(url_data);
    },
    
    on_start_click: function() {
        if(this.lock_start === true) {
            return;
        }
        var symbol_root = cc.find("UI_ROOT/start_layer/symbol_root");
        symbol_root.active = false;
        
        this.play_sound("resources/sounds/click.mp3");
        this.lock_start = true;
        // logo
        var logo = cc.find("UI_ROOT/start_layer/logo");
        
        // logo.y += 400;
        var move1 = cc.moveBy(0.2, 0, 710);
        var move2 = cc.moveBy(0.2, 0, -20);
        var move3 = cc.moveBy(0.1, 0, 10);
        
        var seq = cc.sequence([move3, move2, move1]);
        logo.runAction(seq);
        
        
        var callfunc = cc.callFunc(function() {
            var start_button = cc.find("UI_ROOT/start_layer/start_button");
            start_button.active = true;
            start_button.scale = 1.0;
            start_button.opacity = 255;
            var scale1 = cc.scaleTo(0.1, 0.8);
            var scale3 = cc.scaleTo(0.2, 1.2);
            var call = cc.callFunc(function(){
                var fout = cc.fadeOut(0.2);
                start_button.runAction(fout);    
            }.bind(this), this);
            
            var call2 = cc.callFunc(function() {
                var bg_mask = cc.find("UI_ROOT/start_layer/bg_mask");
                bg_mask.opacity = 0;
                var fin = cc.fadeIn(0.8);
                bg_mask.runAction(fin);
            }.bind(this), this);
            var seq = cc.sequence([scale1, call, scale3, call2]);
            start_button.runAction(seq);
        }.bind(this), this);
        this.node.runAction(callfunc);
        
        
        /*
        var fout = cc.fadeIn(0.6);
        var bg_mask = cc.find("UI_ROOT/start_layer/bg_mask"); 
        bg_mask.runAction(fout);*/
        
        this.call_latter(function() {
            this.node.removeFromParent();
            var anchor_root = cc.find("UI_ROOT/anchor-center");
            anchor_root.active = true;
        }.bind(this), 1.0);
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
