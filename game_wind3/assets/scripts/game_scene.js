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
        
        shine_set: {
            default: [],
            type: cc.Node,
        },
        
        time_per_light: 2,
    },
    

    
    show_rain_card: function() {
        this.node.stopAllActions();
        this.play_sound("resources/sounds/desic.mp3");
        this.is_playing_winding_sound = false;
        
        cc.find("UI_ROOT/show_card_root").active = true;
        cc.find("UI_ROOT/anchor-center/card_button").active = true;
    },
    
    hide_rain_card: function() {
        if (this.auto_show_card) {
            this.on_checkout();
        }
        this.auto_show_card = false;
        cc.find("UI_ROOT/show_card_root").active = false;
    },

    on_checkout: function() {
        this.node.stopAllActions();
        this.play_sound("resources/sounds/end.mp3");
        this.is_playing_winding_sound = false;
        this.checkout_root.active = true;
    }, 
    
    on_start_wind: function(w_pos) {
        if(this.working_mode === false) {
            return;
        }
        
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

        this.f1_com.add_speed(this.wind_value);
        this.f2_com.add_speed(this.wind_value);
        this.f3_com.add_speed(this.wind_value);
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
        this.auto_show_card = true;
        this.checkout_root = cc.find("UI_ROOT/checkout_root");
        
        this.f1_com = cc.find("UI_ROOT/anchor-center/f1").getComponent("spinning");
        this.f2_com = cc.find("UI_ROOT/anchor-center/f2").getComponent("spinning");
        this.f3_com = cc.find("UI_ROOT/anchor-center/f3").getComponent("spinning");
        
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
        this.preload_sound();
        this.is_playing_winding_sound = false;
        this.now_shine_index = 0;
        
        this.feng = cc.find("UI_ROOT/anchor-center/feng");
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
    
    move_car_to_factory: function() {
        // -176, -249  factor pos
        // 618, -249 start_pos;
        this.working_mode = false;
        this.working_time = 0;
        this.car.x = 618;
        this.car.y = -249;
        this.car.scaleX = -1;
        
        var m = cc.moveTo(3, -176, -249);
        var func = cc.callFunc(function() {
            this.working_mode = true;
            this.working_time = 0;
            this.car.scaleX = 1;
        }.bind(this), this);
        
        var seq = cc.sequence([m, func]);
        this.car.runAction(seq);
    },
    
    
    move_car_to_home: function() {
        this.work_count ++;
        this.working_mode = false;
        this.working_time = 0;
        this.car.scaleX = 1;
        var m = cc.moveTo(3, 618, -249);
        var func = cc.callFunc(function() {
            this.move_car_to_factory();
            if (this.work_count === 3) {
                this.show_rain_card();
                cc.find("UI_ROOT/anchor-center/card_button").active = true;
            }
        }.bind(this), this);
        
        var seq = cc.sequence([m, cc.delayTime(3), func]);
        this.car.runAction(seq);
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
    
    start_game: function() {
        this.working_mode = true;
        this.working_time = 0;
        
        this.now_shine_index = 0;
        // 
        for(var i = 0; i < this.shine_set.length; i ++) {
            this.shine_set[i].setCascadeOpacityEnabled(true);
            this.shine_set[i].opacity = 0;
        }
    },
    
    play_start_anim: function() {
        var ske_com = cc.find("UI_ROOT/anchor-center/JXM").getComponent(sp.Skeleton);
        ske_com.clearTracks();
        ske_com.setAnimation(0, "in", false);
        ske_com.addAnimation(0, "idle_1", true);
        
        cc.audioEngine.stopMusic(false);
        var url = cc.url.raw("resources/sounds/start.mp3");
        cc.audioEngine.playMusic(url, false);
        
        this.scheduleOnce(function() {
            ske_com.clearTracks();
            ske_com.setAnimation(0, "out", false);
        }.bind(this), 4);
    },
    
    start: function() {
        this.play_start_anim();
        this.start_game();
    },
    
    replay_game: function() {
        this.checkout_root.active = false;
        this.close_linght();
        this.scheduleOnce(this.start_game.bind(this), 2);
    },
    
    close_linght: function() {
        for(var i = 0; i < this.shine_set.length; i ++) {
            this.shine_set[i].runAction(cc.fadeOut(this.time_per_light));
        }
    },
    
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this.working_mode === false) {
            return;
        }
        
        if(this.f1_com.get_speed() >= 432) {
            this.working_time += dt;
            if(this.working_time >= (this.now_shine_index + 1) * this.time_per_light) {
                this.shine_set[this.now_shine_index].opacity = 0;
                this.shine_set[this.now_shine_index].runAction(cc.fadeIn(this.time_per_light));
                this.now_shine_index ++;
                
                this.node.stopAllActions();
                this.scheduleOnce(function(){
                    this.play_sound("resources/sounds/deng_liang.mp3");    
                }.bind(this), this.time_per_light);
                
                this.scheduleOnce(function(){
                    this.is_playing_winding_sound = false;
                }.bind(this), this.time_per_light + 0.8);
                
                this.is_playing_winding_sound = true;
                
                
                if(this.now_shine_index >= this.shine_set.length) {
                    this.working_mode = false;
                    if(this.auto_show_card) {
                        this.scheduleOnce(this.show_rain_card.bind(this), 3);
                        // this.show_rain_card();
                    }
                    else {
                        this.scheduleOnce(this.on_checkout.bind(this), this.time_per_light + 1);
                    }
                }
            }
        } 
    },
});
