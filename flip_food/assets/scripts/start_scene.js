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
    
    adjust_anchor_with_design: function() {
        var anchor_point = cc.find("UI_ROOT/UI_ROOT_START/anchor-lt");
        if(anchor_point) {
            anchor_point.x = -480;
            anchor_point.y = 360;
        }
        
        anchor_point = cc.find("UI_ROOT/UI_ROOT_START/anchor-bottom");
        if(anchor_point) {
            anchor_point.x = 0;
            anchor_point.y = -360;
        }
        
        anchor_point = cc.find("UI_ROOT/UI_ROOT_START/anchor-lb");
        if(anchor_point) {
            anchor_point.x = -480;
            anchor_point.y = -360;
        }
        
        anchor_point = cc.find("UI_ROOT/UI_ROOT_START/anchor-rb");
        if(anchor_point) {
            anchor_point.x = 480;
            anchor_point.y = -360;
        }
        
        anchor_point = cc.find("UI_ROOT/UI_ROOT_START/anchor-top");
        if(anchor_point) {
            anchor_point.x = 0;
            anchor_point.y = 360;
        }
    },
    
    adjust_anchor: function() {
        var win_size = cc.director.getWinSize();
        
        var cx = win_size.width * 0.5;
        var cy = win_size.height * 0.5;
        
        var anchor_point = cc.find("UI_ROOT/UI_ROOT_START/anchor-lt");
        if(anchor_point) {
            anchor_point.x = -cx;
            anchor_point.y = cy;
        }
        
        anchor_point = cc.find("UI_ROOT/UI_ROOT_START/anchor-bottom");
        if(anchor_point) {
            anchor_point.x = 0;
            anchor_point.y = -cy;
        }
        
        
        anchor_point = cc.find("UI_ROOT/UI_ROOT_START/anchor-lb");
        if(anchor_point) {
            anchor_point.x = -cx;
            anchor_point.y = -cy;
        }
        
        anchor_point = cc.find("UI_ROOT/UI_ROOT_START/anchor-rb");
        if(anchor_point) {
            anchor_point.x = cx;
            anchor_point.y = -cy;
        }
        
        anchor_point = cc.find("UI_ROOT/UI_ROOT_START/anchor-top");
        if(anchor_point) {
            anchor_point.x = 0;
            anchor_point.y = cy;
        }
    },
    
    adjust_window: function(win_size) {
        var design_4_3 = false;
        if(1024 * win_size.height > 768 * win_size.width) {
            this.adjust_anchor_with_design();
            design_4_3 = true;
        }
        else {
            this.adjust_anchor();
        }
    },
    
    start: function() {
        var win_size = cc.director.getWinSize();
        this.prev_size = win_size;
        this.adjust_window(win_size);    
    },
    
    // use this for initialization
    onLoad: function () {
        var sounds_name = [
            "resources/sounds/button.mp3",
            "resources/sounds/right.mp3",
            "resources/sounds/wrong.mp3",
            "resources/sounds/end.mp3",
        ];
        
        for(var i = 0; i < sounds_name.length; i ++) {
            var url = cc.url.raw(sounds_name[i]);
            cc.loader.loadRes(url, function() {});    
        }  
        // end
    },
    
    on_game_start_click: function() {
        cc.audioEngine.stopMusic(false);
        var url = cc.url.raw("resources/sounds/button.mp3");
        // console.log(url);
        cc.audioEngine.playMusic(url, false);
        
        var logo = cc.find("UI_ROOT/UI_ROOT_START/anchor-top/logo_root");
        var up_canvas = cc.find("UI_ROOT/UI_ROOT_START/anchor-top/up");

        var start_button = cc.find("UI_ROOT/UI_ROOT_START/anchor-bottom/start_button");
        start_button.getComponent("swing_action").stop();
        
        var start_bk = cc.find("UI_ROOT/UI_ROOT_START/anchor-background/start_bk");
        var call0 = cc.callFunc(function() {
            /*var move_min = cc.scaleTo(0.1, 0.9);
            var move_out = cc.scaleTo(0.3, 4);
            var fout = cc.fadeOut(0.4);
            var seq = cc.sequence([move_min, move_out]);
            start_button.runAction(seq);
            start_button.runAction(fout);*/
            
        }.bind(this), this); 
        
        var home_button_com = cc.find("UI_ROOT/anchor-lt/home_button").getComponent("move_action");
        var call1 = cc.callFunc(function() {
            var action = cc.moveBy(0.6, 0, 600);
            logo.runAction(action);
            start_button.runAction(action.clone());
        }.bind(this), this);
        
        var call3 = cc.callFunc(function(){
            /*var l_move = cc.moveBy(2, -600, 0);
            var r_move = cc.moveBy(2, 600, 0);
            
            left_cavas.runAction(l_move);
            right_cavas.runAction(r_move);
            
            var scale_x = cc.scaleTo(2, 0, 1)
            left_cavas.runAction(scale_x);
            right_cavas.runAction(scale_x.clone());*/
            
            up_canvas.runAction(cc.moveBy(0.4, 0, 90));
            start_bk.runAction(cc.fadeOut(0.4));
        }.bind(this), this);
        
        var call4 = cc.callFunc(function() {
            home_button_com.play();
           this.node.removeFromParent();
        }.bind(this), this);
        var seq = cc.sequence([call1, cc.delayTime(0.5), call3, cc.delayTime(0.5), call4]);
        this.node.runAction(seq);
    },
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        var win_size = cc.director.getWinSize();
        if(win_size.width != this.prev_size.width || win_size.height != this.prev_size.height) {
            this.prev_size = win_size;
            this.adjust_window(win_size);
        }
    },
});
