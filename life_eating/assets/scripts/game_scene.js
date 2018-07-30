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
        this.game_started = false;
        this.ske_player_com = cc.find("UI_ROOT/anchor-center/play_root/player").getComponent(sp.Skeleton);
        
        this.checkout_root = cc.find("UI_ROOT/checkout_root");
        this.checkout_root.active = false;
        
        this.ui_card = cc.find("UI_ROOT/anchor-center/ui_card");
        this.card_root = cc.find("UI_ROOT/card_root");
        this.is_showed_card = false;
    },
    
    call_latter: function(callfunc, delay) {
        var delay_action = cc.delayTime(delay);
        var call_action = cc.callFunc(callfunc, this);
        var seq = cc.sequence([delay_action, call_action]);
        this.node.runAction(seq);
    },
    
    play_start_anim: function() {
        var ske_com = cc.find("UI_ROOT/anchor-center/JXM").getComponent(sp.Skeleton);
        ske_com.clearTracks();
        ske_com.setAnimation(0, "in", false);
        ske_com.addAnimation(0, "idle_1", true);
        this.play_sound("resources/sounds/start.mp3");
        this.scheduleOnce(function() {
            ske_com.clearTracks();
            ske_com.setAnimation(0, "out", false);
        }.bind(this), 4);
    },
    
    start: function() {
        this.center_pos = cc.find("UI_ROOT/anchor-center/play_root").convertToWorldSpaceAR(cc.p(0, 0));
        this.checkout_root.active = false;
        this.play_start_anim();
        
        this.on_game_start();
    },
    
    on_game_replay: function() {
        this.play_sound("resources/sounds/el.mp3");
        this.checkout_root.active = false;
        this.on_game_start();
    }, 
    
    on_game_start: function() {
        this.game_started = true;
        this.checkout_root.active = false;
        this.game_result = [0, 0, 0, 0, 0];
        
        this.ske_player_com.clearTracks();
        this.ske_player_com.setAnimation(0, "e duzi", true);
        // this.play_sound("resources/sounds/el.mp3");
        this.eat_food_num = 0;
    },
    
    play_sound: function(name) {
        this.node.stopAllActions();
        
        cc.audioEngine.stopMusic(false);
        var url = cc.url.raw(name);
        cc.audioEngine.playMusic(url, false);
    },
    
    play_sound_loop: function(name) {
        this.node.stopAllActions();
        
        cc.audioEngine.stopMusic(false);
        var url = cc.url.raw(name);
        cc.audioEngine.playMusic(url, true);
    },
    
    play_can_eat_anim:function(m_type) {
        this.node.stopAllActions();
        this.ske_player_com.clearTracks();
        var name = ["chizhuzi", "", "chi xiangjiao", "", "chi taozi"];
        var type_sound = ["resources/sounds/chi1.mp3", "", "resources/sounds/chi2.mp3", "", "resources/sounds/chi2.mp3"];
        this.play_sound(type_sound[m_type - 1]);
        // this.ske_player_com.setAnimation(0, "aichide", false);
        this.ske_player_com.setAnimation(0, name[m_type - 1], false);
        this.ske_player_com.addAnimation(0, "e duzi", true);
        
        this.call_latter(function(){
            this.play_sound("resources/sounds/el.mp3");
        }.bind(this), 6);
    }, 
    
    play_cannot_eat_anim:function() {
        this.play_sound("resources/sounds/no.mp3");
        this.node.stopAllActions();
        this.ske_player_com.clearTracks();
        this.ske_player_com.setAnimation(0, "jujuebuaichi", true);
        this.ske_player_com.addAnimation(0, "e duzi", true);
        this.call_latter(function(){
            this.play_sound("resources/sounds/el.mp3");
        }.bind(this), 6);
    }, 
    
    play_life_anim_good_film:function() {
        var name = "manzukaixin";
        // this.ske_player_com.clearTracks();
        this.ske_player_com.addAnimation(0, name, true);
        this.node.stopAllActions();
        
        this.scheduleOnce(function(){
            this.play_sound_loop("resources/sounds/full.mp3");
        }.bind(this), 6);
        
        this.scheduleOnce(function() {
            this.ske_player_com.clearTracks();
            this.ske_player_com.setAnimation(0, "putongdaiji", true);
            this.checkout_root.active = true;
            this.play_sound("resources/sounds/end.mp3");    
        }.bind(this), 10);
    }, 
    
    is_show_card_check: function() {
        if (this.is_showed_card) {
            return false;
        }
        if (this.eat_food_num === 3) {
            return true;
        }
        return false;
    },
    
    is_checkout_success: function() {
        if(this.eat_food_num >= 5) {
            return true;
        }
        return false;
    },
    
    show_card: function() {
        this.is_showed_card = true;
        this.ui_card.active = true;
        this.card_root.active = true;
        this.play_sound("resources/sounds/desic.mp3");
    },
    
    hide_card: function() {
        this.card_root.active = false;
    },
    
    show_checkout: function() {
        this.game_started = false;
        // 播放满足动画
        this.scheduleOnce(this.play_life_anim_good_film.bind(this), 2);
        // end
        
    },
    
    on_prop_hit: function(m_type, can_eat) {
        if(this.game_started === false) {
            return;
        }
        
        // 播放动画
        // this.play_life_anim(m_type);
        if(can_eat === 1) { // 播放能吃的动画
            this.play_can_eat_anim(m_type);
            this.eat_food_num ++;
        } 
        else { // 播放不能吃的动画
            this.play_cannot_eat_anim();
        }
        // end 
        
        // 弹知识卡
        if(this.is_show_card_check()) {
            this.show_card();
        }
        // end 
        
        // 结算
        if (this.is_checkout_success()) {
            this.show_checkout();
        }
        // end
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
