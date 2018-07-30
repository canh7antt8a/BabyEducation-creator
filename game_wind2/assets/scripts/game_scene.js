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
        wind_value: 100,
        kite_prefab: {
            default: [],
            type: cc.Prefab,
        },
    },
    

    
    show_rain_card: function() {
        this.play_sound("resources/sounds/desic.mp3");
        this.node.stopAllActions();
        this.is_playing_winding_sound = false;
        cc.find("UI_ROOT/show_card_root").active = true;
        cc.find("UI_ROOT/anchor-center/card_button").active = true;
    },
    
    hide_rain_card: function() {
        cc.find("UI_ROOT/show_card_root").active = false;
    },

    on_checkout: function() {
        this.play_sound("resources/sounds/end.mp3");
        this.node.stopAllActions();
        this.is_playing_winding_sound = false;
        this.checkout_root.active = true;
    }, 
    
    on_start_wind: function(w_pos) {
        if (this.is_playing_winding_sound === false) {
            this.is_playing_winding_sound = true;
            this.play_sound_loop("resources/sounds/feng.mp3");
        }
        
        this.node.stopAllActions();
        this.call_latter(function() {
            this.is_playing_winding_sound = false;
            cc.audioEngine.stopMusic();
        }.bind(this), 4);
        
        var pos = this.feng.parent.convertToNodeSpaceAR(w_pos);
        this.feng.setPosition(pos);
        this.feng.active = true;
        this.feng.getComponent("frame_anim").play(function(){
            this.feng.active = false;
        }.bind(this));
        
        
        this.fengche_com.add_speed(this.wind_value);
        this.kite_com.add_wind();   
        
        for(var i = 0; i < this.grass_set.length; i ++) {
            // var com = this.grass_set[i].getComponent("spinning3");
            var com = this.grass_set[i].getComponent("swing_action");
            com.add_win();
        }
    },
    
    preload_sound: function() {
        var sound_list = [
            "resources/sounds/kim_clk2.mp3",
            "resources/sounds/kim_clk1.mp3",
            "resources/sounds/button.mp3",
        ];
        
        for(var i = 0; i < sound_list.length; i ++) {
            var url = cc.url.raw(sound_list[i]);
            cc.loader.loadRes(url, function() {});    
        }
    }, 
    
    // use this for initialization
    onLoad: function () {
        this.is_playing_winding_sound = false;
        this.auto_show_card = true;
        this.checkout_root = cc.find("UI_ROOT/checkout_root");
        
       
        var touch = cc.find("UI_ROOT/anchor-center/touch_wind");
        
        touch.on('touchstart', function(event) {
            this.has_move = false;
            this.start_pos = event.getLocation();
        }.bind(this));
        
        touch.on('touchmove', function(event){
            this.has_move = true;
        }.bind(this));
        
        touch.on('touchend', function(event){
            if(this.has_move === true) {
                var c_pos = event.getLocation();
                c_pos.x = (this.start_pos.x + c_pos.x) / 2;
                c_pos.y = (this.start_pos.y + c_pos.y) / 2;
                this.on_start_wind(c_pos);
                this.has_move = false;
            }
        }.bind(this));
        
        touch.on('touchcancel', function(event){
            if(this.has_move === true) {
                var c_pos = event.getLocation();
                c_pos.x = (this.start_pos.x + c_pos.x) / 2;
                c_pos.y = (this.start_pos.y + c_pos.y) / 2;
                this.on_start_wind(c_pos);
                this.has_move = false;
            }
        }.bind(this));
        
        this.work_count = 0;
        this.ske_kim_com = cc.find("UI_ROOT/anchor-center/kim").getComponent(sp.Skeleton);
        this.preload_sound();
        
        // this.kite_com = cc.find("UI_ROOT/anchor-center/tw1").getComponent("kite");    
        this.kite_root = cc.find("UI_ROOT/anchor-center/kite_root");
        this.feng = cc.find("UI_ROOT/anchor-center/feng");
        
        this.fengche_com = cc.find("UI_ROOT/anchor-center/fengche").getComponent("spinning");
        
        this.grass_set = cc.find("UI_ROOT/anchor-center/grass_root").children;
    },
    
    play_sound: function(name) {
        var url_data = cc.url.raw(name);
        cc.audioEngine.stopMusic();
        this.scheduleOnce(function(){
            cc.audioEngine.playMusic(url_data);
        }, 0.016);
    },
    
    play_sound_loop: function(name) {
        var url_data = cc.url.raw(name);
        cc.audioEngine.stopMusic();
        cc.audioEngine.playMusic(url_data, true);
    },
    
    play_kim_click_anim_with_random:function() {
        var v = Math.random();
        var anim_name = "clk_1";
        var sound_name = "resources/sounds/kim_clk1.mp3";
        if (v < 0.5) {
            anim_name = "clk_2";
            sound_name = "resources/sounds/kim_clk2.mp3";
        }
        this.lock_kim_click = true;
        this.play_sound(sound_name);
        this.ske_kim_com.clearTracks();
        this.ske_kim_com.setAnimation(0, anim_name, false);
        this.ske_kim_com.addAnimation(0, "idle_1", true);
        
        this.scheduleOnce(function() {
            this.lock_kim_click = false;
        }.bind(this), 2);
    }, 
    
    call_latter: function(callfunc, delay) {
        var delay_action = cc.delayTime(delay);
        var call_action = cc.callFunc(callfunc, this);
        var seq = cc.sequence([delay_action, call_action]);
        this.node.runAction(seq);
    },
    
    on_kim_click: function() {
        if(this.lock_kim_click === true) {
            return;
        }
        this.play_kim_click_anim_with_random();
    },
    
    gen_kite: function() {
        // 切换风筝动画
        if (this.kite_com) {
            var anim_name = ["fz1 yundong2", "fz2 yundong2", "fz3 yundong2", "fz4 yundong2", "fz5 yundong2"];
            var ske_com = this.kite_com.node.getChildByName("anim").getComponent(sp.Skeleton);
            ske_com.clearTracks();
            ske_com.setAnimation(0, anim_name[this.now_index], true);    
        }
        
        // end 
        this.now_index ++;
        if (this.auto_show_card && this.now_index === 1) {
            this.auto_show_card = false;
            this.show_rain_card();
        }
        else if (this.now_index >= 1){
            this.play_sound("resources/sounds/fengzheng_ok.mp3");
            this.node.stopAllActions();
            this.is_playing_winding_sound = false;
        }
        
        if(this.now_index >= this.kite_prefab.length) { // 游戏结束
            this.scheduleOnce(this.on_checkout.bind(this), 8);
            return;    
        }
        
        var kite = cc.instantiate(this.kite_prefab[this.now_index]);
        kite.parent = this.kite_root;
        this.kite_com = kite.getComponent("kite");
    }, 
    
    start_game: function() {
        this.checkout_root.active = false;
        this.hide_rain_card();
        this.kite_root.removeAllChildren();
        this.now_index = -1;
        this.kite_com = null;
        this.gen_kite();
    },
    
    play_start_anim: function() {
        var ske_com = cc.find("UI_ROOT/anchor-center/kim").getComponent(sp.Skeleton);
        ske_com.clearTracks();
        ske_com.setAnimation(0, "in", false);
        ske_com.addAnimation(0, "idle_1", true);
        
        cc.audioEngine.stopMusic(false);
        var url = cc.url.raw("resources/sounds/start.mp3");
        cc.audioEngine.playMusic(url, false);
        
        /*this.scheduleOnce(function() {
            ske_com.clearTracks();
            ske_com.setAnimation(0, "out", false);
        }.bind(this), 4);*/
    },
    
    
    start: function() {
        this.feng.active = false;
        this.lock_kim_click = true;
        this.play_start_anim();
        this.kite_root.removeAllChildren();
        
        this.scheduleOnce(this.start_game.bind(this), 1);
        // this.start_game();
    },

    // called every frame, uncomment this function to activate update callback
});
