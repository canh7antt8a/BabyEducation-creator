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
    },
    

    
    show_rain_card: function() {
        this.play_sound("resources/sounds/desic.mp3");
        cc.find("UI_ROOT/show_card_root").active = true;
        this.is_showed_card = true;
    },
    
    hide_rain_card: function() {
        cc.find("UI_ROOT/show_card_root").active = false;
    },

    on_checkout: function() {
        this.play_sound("resources/sounds/end.mp3");
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

        
        this.f1_com.add_speed(this.wind_value);
        this.f2_com.add_speed(this.wind_value);
        this.feng_biao_com.add_speed(this.wind_value);
        this.f3_com.add_speed(this.wind_value);
        
        if (this.chengbao3_com.node.y < 700) {
            this.chengbao3_com.w_speed = 200;
            this.chengbao3_com.add_speed(this.wind_value);    
        }
        
        
        
        
        var children = this.glass_root.children;
        for(var i = 0; i < children.length; i ++) {
            var com = children[i].getComponent("spinning3");
            com.add_speed(this.wind_value);
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
        this.is_showed_card = false;
        this.checkout_root = cc.find("UI_ROOT/checkout_root");
        
        this.f1_com = cc.find("UI_ROOT/anchor-center/f1").getComponent("spinning");
        this.f2_com = cc.find("UI_ROOT/anchor-center/f2").getComponent("spinning");
        this.f3_com = cc.find("UI_ROOT/anchor-center/h3/f1").getComponent("spinning");
        
        this.car = cc.find("UI_ROOT/anchor-center/car");
        this.car_item = cc.find("UI_ROOT/anchor-center/car/goods");
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
        // this.ske_kim_com = cc.find("UI_ROOT/anchor-center/kim").getComponent(sp.Skeleton);
        this.preload_sound();
        
        
        this.feng = cc.find("UI_ROOT/anchor-center/feng");
        this.feng_biao_com = cc.find("UI_ROOT/anchor-center/feng_biao").getComponent("spinning2");
        this.chengbao3_com = cc.find("UI_ROOT/anchor-center/h3").getComponent("spinning4");
        this.is_playing_winding_sound = false;
        
        this.glass_root = cc.find("UI_ROOT/anchor-center/glass_root");
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
    
    move_car_to_factory: function() {
        // -176, -249  factor pos
        // 618, -249 start_pos;
        this.working_mode = false;
        this.working_time = 0;
        this.car.x = 618;
        this.car.y = -249;
        this.car.scaleX = -1;
        this.car_item.active = false;
        var m = cc.moveTo(6, -176, -249);
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
        this.car_item.active = true;
        this.working_time = 0;
        this.car.scaleX = 1;
        this.play_sound("resources/sounds/car_start.mp3");
        var m = cc.moveTo(6, 618, -249);
        var func = cc.callFunc(function() {
            this.move_car_to_factory();
            if (this.work_count === 3 && this.is_showed_card === false) {
                this.show_rain_card();
                cc.find("UI_ROOT/anchor-center/card_button").active = true;
            }
            
            if (this.work_count === 4) {
                this.on_checkout();
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
    
    replay_game: function() {
        this.checkout_root.active = false;
        this.working_mode = true;
        this.working_time = 0;
        this.work_count = 0;
    },
    
    start_game: function() {
        /*this.lock_kim_click = true;
        this.call_latter(function() {
            this.ske_kim_com.clearTracks();
            this.ske_kim_com.setAnimation(0, "idle_1", true);
            this.lock_kim_click = false;
        }.bind(this), 0.9);*/
        
        //
        this.checkout_root.active = false;
        this.working_mode = false;
        this.working_time = 0;
        this.move_car_to_factory();
        this.work_count = 0;
        // 
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
        this.feng.active = false;
        this.play_start_anim();
        this.start_game();
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this.working_mode === false) {
            return;
        }
        
        if(this.f1_com.get_speed() >= 432) {
            this.working_time += dt;
            if(this.working_time >= 2) {
                this.move_car_to_home();
            }
        } 
    },
});
