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
        dirty_set: {
            default:[],
            type: cc.Node,
        }
    },
    
    preload_sound: function() {
        var sound_list = [
            "resources/sounds/button.mp3",
            "resources/sounds/end.mp3",
        ];
        
        for(var i = 0; i < sound_list.length; i ++) {
            var url = cc.url.raw(sound_list[i]);
            cc.loader.loadRes(url, function() {});    
        }
    }, 
    // use this for initialization
    onLoad: function () {
        this.preload_sound();
        this.center_pos = cc.find("UI_ROOT/anchor-center/play_root").convertToWorldSpaceAR(cc.Vec2(0, 0));
        this.game_started = false;
        this.ske_player_com = cc.find("UI_ROOT/anchor-center/play_root/player").getComponent(sp.Skeleton);
        
        this.checkout_root = cc.find("UI_ROOT/checkout_root");
        this.checkout_root.active = false;
        
    },
    
    call_latter: function(callfunc, delay) {
        var delay_action = cc.delayTime(delay);
        var call_action = cc.callFunc(callfunc, this);
        var seq = cc.sequence([delay_action, call_action]);
        this.node.runAction(seq);
    },
    
    start: function() {
        this.checkout_root.active = false;
        this.on_game_start();
    },
    
    on_game_replay: function() {
        this.checkout_root.active = false;
        this.on_game_start();
    }, 
    
    on_game_start: function() {
        this.game_started = true;
        this.checkout_root.active = false;
        this.game_result = [0, 0, 0, 0, 0];
        
        for(var i = 0; i < this.dirty_set.length; i ++) {
            var com = this.dirty_set[i].getComponent("dirty_item");
            com.reset_game();
        }
        
        this.play_idle_anim();
    },
    
    play_sound: function(name) {
        console.log(name);
        cc.audioEngine.stopMusic(false);
        var url = cc.url.raw(name);
        cc.audioEngine.playMusic(url, false);
    },
    
    play_guli_anim:function(m_type) {
        this.node.stopAllActions();
        this.ske_player_com.clearTracks();
        this.ske_player_com.setAnimation(0, "shuayadaiji", true);
        /*this.call_latter(function() {
            this.ske_player_com.clearTracks();
            this.ske_player_com.setAnimation(0, "putongdaiji", true);
        }.bind(this), 2);*/
    }, 
    
    play_idle_anim: function() {
        this.node.stopAllActions();
        this.ske_player_com.clearTracks();
        this.ske_player_com.setAnimation(0, "shuayadaiji", true);
    },
    
    play_life_anim_good_film:function() {
        var name = "shuawanya liangjingjing";
        this.ske_player_com.clearTracks();
        this.ske_player_com.setAnimation(0, name, true);
        this.call_latter(function() {
            this.ske_player_com.clearTracks();
            this.ske_player_com.setAnimation(0, "shuayadaiji", true);
            this.checkout_root.active = true;
            this.play_sound("resources/sounds/end.mp3");    
        }.bind(this), 3);
    }, 
    
    is_checkout_success: function() {
        for(var i = 0; i < this.dirty_set.length; i ++) {
            var com = this.dirty_set[i].getComponent("dirty_item");
            if(com.clear_times > 0) {
                return false;    
            }
        }
        return true;
    },
    
    show_checkout: function() {
        this.game_started = false;
        
        /*this.scheduleOnce(function() {
            console.log("show_checkout");
            this.play_sound("resources/sounds/end.mp3");
            this.ske_player_com.clearTracks();
            this.ske_player_com.setAnimation(0, "shuayadaiji", true);
            this.checkout_root.active = true;
        }.bind(this), 2);*/
        
        // 播放满足动画
        this.call_latter(this.play_life_anim_good_film.bind(this), 2);
    },
    
    on_prop_hit: function(m_type) {
        if(this.game_started === false) {
            return;
        }
        
        // 播放动画
        this.play_life_anim(m_type);
        // end 
        
        // 结算
        this.game_result[m_type - 1] = 1;
        if (this.is_checkout_success()) {
            this.show_checkout();
        }
        // end
    },
    
    get_hit_dirty_set: function() {
        return this.dirty_set;
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
