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
        var anchor_point = cc.find("UI_ROOT/anchor-lt");
        if(anchor_point) {
            anchor_point.x = -480;
            anchor_point.y = 360;
        }
        
        anchor_point = cc.find("UI_ROOT/anchor-bottom");
        if(anchor_point) {
            anchor_point.x = 0;
            anchor_point.y = -360;
        }
        
        anchor_point = cc.find("UI_ROOT/anchor-lb");
        if(anchor_point) {
            anchor_point.x = -480;
            anchor_point.y = -360;
        }
        
        anchor_point = cc.find("UI_ROOT/anchor-rb");
        if(anchor_point) {
            anchor_point.x = 480;
            anchor_point.y = -360;
        }
        
        anchor_point = cc.find("UI_ROOT/anchor-top");
        if(anchor_point) {
            anchor_point.x = 0;
            anchor_point.y = 360;
        }
    },
    
    adjust_anchor: function() {
        var win_size = cc.director.getWinSize();
        
        var cx = win_size.width * 0.5;
        var cy = win_size.height * 0.5;
        
        var anchor_point = cc.find("UI_ROOT/anchor-lt");
        if(anchor_point) {
            anchor_point.x = -cx;
            anchor_point.y = cy;
        }
        
        anchor_point = cc.find("UI_ROOT/anchor-bottom");
        if(anchor_point) {
            anchor_point.x = 0;
            anchor_point.y = -cy;
        }
        
        
        anchor_point = cc.find("UI_ROOT/anchor-lb");
        if(anchor_point) {
            anchor_point.x = -cx;
            anchor_point.y = -cy;
        }
        
        anchor_point = cc.find("UI_ROOT/anchor-rb");
        if(anchor_point) {
            anchor_point.x = cx;
            anchor_point.y = -cy;
        }
        
        anchor_point = cc.find("UI_ROOT/anchor-top");
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
        
        var url = cc.url.raw("resources/sounds/least.mp3");
        cc.loader.loadRes(url, function() {});
        url = cc.url.raw("resources/sounds/most.mp3");
        cc.loader.loadRes(url, function() {});
        
        url = cc.url.raw("resources/sounds/button.mp3");
        cc.loader.loadRes(url, function() {});
        url = cc.url.raw("resources/sounds/end.mp3");
        cc.loader.loadRes(url, function() {});
        
        url = cc.url.raw("resources/sounds/ch_right.mp3");
        cc.loader.loadRes(url, function() {});
        
        url = cc.url.raw("resources/sounds/ck_error.mp3");
        cc.loader.loadRes(url, function() {});
        
        this.scheduleOnce(function(){
            var cat_com = cc.find("UI_ROOT/anchor-center/cat").getComponent(sp.Skeleton);
            cat_com.clearTracks();
            cat_com.setAnimation(0, "idle_2", true);
        }.bind(this), 0.8);
        this.started = false;
    },
    
    on_game_start_click: function() {
        if(this.started === true) {
            return;
        }
        
        this.started = true;
        cc.audioEngine.stopMusic(false);
        var url = cc.url.raw("resources/sounds/button.mp3");
        // console.log(url);
        cc.audioEngine.playMusic(url, false);
        
        var move_com = cc.find("UI_ROOT/anchor-center/logo").getComponent("move_action");
        var pat_com = cc.find("UI_ROOT/anchor-center/click_node").getComponent("pat_action");
        
        move_com.move_back();
        pat_com.move_back();
        
        this.scheduleOnce(function() {
            cc.director.loadScene("game_scene");
        }, 0.6)
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
