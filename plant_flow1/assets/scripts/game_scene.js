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
        season_type: 0,
        season_set: {
            default: [],
            type: cc.Node
        },
    },

    // use this for initialization
    onLoad: function () {
        this.hit_set = [];
        this.play_ctrl_com = cc.find("UI_ROOT/anchor-center/ctrl_root").getComponent("play_ctrl");
        this.touch_root = cc.find("UI_ROOT/touch_root");
        this.checkout = cc.find("UI_ROOT/checkout_root");
        this.preload_sound();
        this.game_started = false;
        this.touch_root.on('touchstart', function(event) {
            this.hit_test(event);
        }.bind(this));
        
        this.touch_root.on('touchmove', function(event){
            this.hit_test(event);
        }.bind(this));
        
        this.touch_root.on('touchend', function(event){
        }.bind(this));
        
        this.touch_root.on('touchcancel', function(event){
        }.bind(this));
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
    
    play_sound: function(name) {
        cc.audioEngine.stopMusic(false);
        var url = cc.url.raw(name);
        cc.audioEngine.playMusic(url, false);
    },
    
    hit_test: function(event) {
        if(this.game_started === false) {
            return;
        }
        
        var end = true;
        var hit_item = false;
        for(var i = 0; i < this.hit_set.length; i ++) {
            
            if(this.hit_set[i] === null) {
                continue;
            }
            
            var pos = this.touch_root.convertToNodeSpaceAR(event.getLocation());
            var b_pos = this.hit_set[i].getPosition();
            
            if(cc.pDistance(b_pos, pos) <= 54) {
                this.hit_set[i].runAction(cc.fadeOut(0.1));
                this.hit_set[i] = null;
                hit_item = true;
            }
            else {
                end = false;    
            }
        }
        
        if(end) {
            this.play_sound("resources/sounds/end.mp3");
            this.game_started = false;
            this.scheduleOnce(function(){
                this.checkout.active = true;
            }.bind(this), 1);
        }
        else if(hit_item) {
            this.play_sound("resources/sounds/click_item.mp3");
        }
    },
    
    play_start_anim: function() {
        var ske_com = cc.find("UI_ROOT/anchor-center/JXM").getComponent(sp.Skeleton);
        ske_com.clearTracks();
        ske_com.setAnimation(0, "in", false);
        ske_com.addAnimation(0, "idle_1", true);
        this.play_sound("resources/sounds/step1.mp3");
        this.scheduleOnce(function() {
            ske_com.clearTracks();
            ske_com.setAnimation(0, "out", false);
        }.bind(this), 4);
    },
    
    start: function() {
        this.play_start_anim();
        this.on_start_game();
    }, 
    
    show_season: function(s) {
        if(s < 0 || s >= this.season_set.length) {
            return;
        }
        
        /*for(var i = 0; i < this.season_set.length; i ++) {
            this.season_set[i].active = false;
        }*/
        this.season_type = s;
        this.season_set[this.season_type].active = true;
        this.season_set[this.season_type].opacity = 0;
        this.season_set[this.season_type].setCascadeOpacityEnabled(true);
        this.season_set[this.season_type].runAction(cc.fadeIn(0.5));
    },
    
    on_replay_game: function() {
        this.on_start_game();
    }, 
    
    on_start_game: function() {
        this.game_started = true;
        for(var i = 0; i < this.season_set.length; i ++) {
            this.season_set[i].active = false;
        }
        this.show_season(0);
        this.checkout.active = false;
        this.touch_root.active = false;
        this.play_ctrl_com.show_opt(1);
    }, 
    
    play_recv_flow_mode: function(hit_set) {
        this.hit_set = hit_set;
        this.touch_root.active = true;
    }, 
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
