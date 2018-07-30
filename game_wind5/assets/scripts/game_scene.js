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
        
        min_ground: -510,
        max_ground: -420,
    },
    
    show_rain_card: function() {
        cc.find("UI_ROOT/show_card_root").active = true;
        cc.find("UI_ROOT/anchor-center/card_button").active = true;
        this.play_sound("resources/sounds/desic.mp3");
    },
    
    hide_rain_card: function() {
        this.is_playing_winding_sound = false;
        cc.audioEngine.stopMusic();
        cc.find("UI_ROOT/show_card_root").active = false;
        if (this.auto_show_card) {
            this.auto_show_card = false;
            
            this.scheduleOnce(function() {
                this.on_checkout();
            }.bind(this), 1);
        }
    },

    on_checkout: function() {
        this.feng_che_com.stop_longjuanfeng_mode();
        
        this.is_playing_winding_sound = false;
        this.node.stopAllActions();
        this.play_sound("resources/sounds/end.mp3");
        this.checkout_root.active = true;
    }, 
    
    on_start_wind: function(w_pos) {
        if(this.game_mode > 1) {
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
        
        // this.goods_now_com.add_wind();
        this.feng_che_com.add_speed(this.wind_value);
        
        if (this.game_mode === 0) {
            if(this.goods_now_com) {
                this.goods_now_com.add_wind();    
            }
        }
        else {
            if(this.is_active_car_time === false) {
                this.is_active_car_time = true;
                this.car_timer(function() { // 时间到重置wind_count
                    this.is_active_car_time = false;
                    this.wind_count = 0;
                }.bind(this), 1.1);
            }
            this.wind_count ++;
            if (this.wind_count < 5) { // car 上下抖动
                this.show_car_anim_by_wind();
            }
            else { // 进入龙卷风模式
                this.enter_longjuanfeng_mode();
            }
        }
    },
    
    enter_longjuanfeng_mode: function() {
        this.game_mode = 2;
        this.wind_count = 0;
        
        this.is_playing_winding_sound = false;
        this.node.stopAllActions();
        this.play_sound_loop("resources/sounds/longjuanfeng.mp3");
            
        this.longjuanfeng.active = true;
        this.longjuanfeng.setPosition(0, 740);
        this.feng_che_com.show_inlongjuanfeng_mode();
        
        var time = 1;
        this.scheduleOnce(function() {
            var car = cc.find("UI_ROOT/anchor-center/car");
            this.longjuangfeng_move_goods(car);
        }.bind(this), time);
        
        time += Math.random();
        this.scheduleOnce(function() {    
            var point = cc.find("UI_ROOT/anchor-center/point");
            this.longjuangfeng_move_goods(point);
        }.bind(this), time);
        
        time += Math.random();
        this.scheduleOnce(function() {
            var box = cc.find("UI_ROOT/anchor-center/box");
            this.longjuangfeng_move_goods(box);
        }.bind(this), time);
        
        time += Math.random();
        this.scheduleOnce(function() {
            var t1 = cc.find("UI_ROOT/anchor-center/t1");
            this.longjuangfeng_move_goods(t1);
        }.bind(this), time);
        
        time += Math.random();
        this.scheduleOnce(function() {
            var t2 = cc.find("UI_ROOT/anchor-center/t2");
            this.longjuangfeng_move_goods(t2);
        }.bind(this), time);
        
        time += Math.random();
        this.scheduleOnce(function() {
            var t3 = cc.find("UI_ROOT/anchor-center/t3");
            this.longjuangfeng_move_goods(t3);
        }.bind(this), time);
        
        time += Math.random();
        this.scheduleOnce(function() {
            var house = cc.find("UI_ROOT/anchor-center/house");
            this.longjuangfeng_move_goods(house);
        }.bind(this), time);    
        
        time += Math.random();
        this.scheduleOnce(function() {
            var fengzhen = cc.find("UI_ROOT/anchor-center/fengzhen");
            this.longjuangfeng_move_goods(fengzhen);
        }.bind(this), time);
        
        this.scheduleOnce(function() {
            // this.play_sound_loop("resources/sounds/feng.mp3");
            this.longjuanfeng.runAction(cc.moveBy(6, -1600, 0));
        }.bind(this), time + 1);
        
        this.scheduleOnce(function() {
            // this.play_sound_loop("resources/sounds/feng.mp3");
            if (this.auto_show_card) {
                this.show_rain_card();
            }
            else {
                this.on_checkout();    
            }
            
            this.longjuanfeng.active = false;
        }.bind(this), time + 6 + 1);
    },
    
    
    longjuangfeng_move_goods: function(node) {
        var r = node.getBoundingBox();

        var s_to = 100 / r.size.width;
        
        var d_pos = this.longjuanfeng.convertToWorldSpaceAR(cc.p(0, -300));
        var w_pos = node.convertToWorldSpaceAR(cc.p(0, 0));
        var len = cc.pDistance(d_pos, w_pos);
        var speed = 1000;
        var time = len / speed;
        
        d_pos = node.parent.convertToNodeSpaceAR(d_pos);
        
        var m1 = cc.moveTo(time, d_pos);
        var m2 = cc.moveBy(1080 / speed, 0, 1080);
        
        var seq = cc.sequence([m1, m2]);
        node.runAction(seq);
        node.runAction(cc.scaleTo(time, s_to));
        
        var r = cc.rotateBy(3, 360);
        var f = cc.repeatForever(r);
        node.runAction(f);
    },
    
    show_car_anim_by_wind: function() {
        if (this.car_moving === true) {
            return;
        }
        this.car_moving = true;
        var m1 = cc.moveBy(0.2, 0, 10);
        var m2 = cc.moveBy(0.2, 0, -10);
        var m3 = cc.moveBy(0.2, 0, 10);
        var m4 = cc.moveBy(0.2, 0, -10);
        var func = cc.callFunc(function() {
            this.car_moving = false;
        }.bind(this));
        this.started = false;
        var seq = cc.sequence([m1, m2, m3, m4, func]);
        this.car.runAction(seq);
    }, 
    
    on_gen_goods: function() {
        if(this.gen_index >= this.goods_set.length) {
            return;
        }
        
        if(this.gen_index !== 0/* || this.gen_index !== 2*/) {
            this.is_playing_winding_sound = false;
            this.node.stopAllActions();
            this.play_sound("resources/sounds/goods_in.mp3");    
        }
        
        var goods = this.goods_set[this.gen_index];
        this.gen_index ++;
        
        
        var goods_com = goods.getComponent("goods_ctrl");
        this.goods_now_com = goods_com;
        this.goods_now_com.show_good();
    },
    
    enter_car_mode: function() {
        this.car.x = 1303;
        this.car.y = -169;
        this.wind_count = 0; 
        this.game_mode = 1;
        this.is_active_car_time = false;
        this.car_moving = false;
        
        var f = cc.repeatForever(cc.rotateBy(2, -360));
        this.car.getChildByName("wheel1").runAction(f);
        this.car.getChildByName("wheel2").runAction(f.clone());
        
        var func = cc.callFunc(function() {
            this.car.getChildByName("wheel1").stopAllActions();
            this.car.getChildByName("wheel2").stopAllActions();
        }.bind(this))
        
        var seq = cc.sequence([cc.moveTo(3, 0, this.car.y), func]);
        this.car.runAction(seq);
        this.play_sound("resources/sounds/car_in.mp3");
    }, 
    
    gen_next_goods: function(is_in) {
        if (is_in) {
            this.play_sound("resources/sounds/jinru.mp3");
        }
        
        if(this.gen_index >= this.goods_set.length) { // 进入汽车模式
            // this.on_checkout();
            this.goods_now_com = null;
            this.is_playing_winding_sound = false;
            this.node.stopAllActions();
            
            this.scheduleOnce(this.enter_car_mode.bind(this), 1.5);
            return;    
        }
        
        this.scheduleOnce(this.on_gen_goods.bind(this), 1.5);
    }, 
    
    preload_sound: function() {
        var sound_list = [
            "resources/sounds/kim_clk2.mp3",
            "resources/sounds/kim_clk1.mp3",
            "resources/sounds/button.mp3",
            "resources/sounds/end.mp3",
        ];
        
        for(var i = 0; i < sound_list.length; i ++) {
            var url = cc.url.raw(sound_list[i]);
            cc.loader.loadRes(url, function() {});    
        }
    }, 
    
    add_listener_wind_touch: function() {
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
    },
    // use this for initialization
    onLoad: function () {
        this.auto_show_card = true;
        this.checkout_root = cc.find("UI_ROOT/checkout_root");
        
        
        this.gen_index = 0;
        // this.ske_kim_com = cc.find("UI_ROOT/anchor-center/kim").getComponent(sp.Skeleton);
        this.preload_sound();
        
        this.feng_che_com = cc.find("UI_ROOT/anchor-center/fengzhen/h2").getComponent("spinning");
        this.goods_root = cc.find("UI_ROOT/anchor-center/goods_root");
        this.goods_set = this.goods_root.children.slice(0);
        
        this.feng = cc.find("UI_ROOT/anchor-center/feng");
        this.is_playing_winding_sound = false;
        this.car = cc.find("UI_ROOT/anchor-center/car");
        
        this.goods_now_com = null;
        this.wind_count = 0;
        this.is_active_car_time = false;
        this.car_moving = false;
        
        this.longjuanfeng = cc.find("UI_ROOT/anchor-center/longjuanfeng");
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
        
        this.call_latter(function() {
            this.lock_kim_click = false;
        }.bind(this), 2);
    }, 

    
    call_latter: function(callfunc, delay) {
        var delay_action = cc.delayTime(delay);
        var call_action = cc.callFunc(callfunc, this);
        var seq = cc.sequence([delay_action, call_action]);
        this.node.runAction(seq);
    },
    
    car_timer: function(callfunc, delay) {
        var delay_action = cc.delayTime(delay);
        var call_action = cc.callFunc(callfunc, this);
        var seq = cc.sequence([delay_action, call_action]);
        this.car.runAction(seq);
    },
    
    cancel_car_time: function() {
        this.car.stopAllActions();
    }, 
    
    on_kim_click: function() {
        if(this.lock_kim_click === true) {
            return;
        }
        this.play_kim_click_anim_with_random();
    },
    
    start_game: function() {
        
        var car = cc.find("UI_ROOT/anchor-center/car");
        car.stopAllActions();
        car.setPosition(1303, -169);
        car.scale = 1;
        car.rotation = 0;
        
        var house = cc.find("UI_ROOT/anchor-center/house");
        house.setPosition(-666, 231);
        house.stopAllActions();
        house.scale = 1;
        house.rotation = 0;
        
        var point = cc.find("UI_ROOT/anchor-center/point");
        point.setPosition(330, -28);
        point.stopAllActions();
        point.scale = 1;
        point.rotation = 0;
        
        var fengzhen = cc.find("UI_ROOT/anchor-center/fengzhen");
        fengzhen.setPosition(629, 326);
        fengzhen.stopAllActions();
        fengzhen.scale = 1;
        fengzhen.rotation = 0;
        
        var box = cc.find("UI_ROOT/anchor-center/box");
        box.setPosition(-569, -83);
        box.stopAllActions();
        box.scale = 1;
        box.rotation = 0;
        
        var t1 = cc.find("UI_ROOT/anchor-center/t1");
        t1.setPosition(-320, 68);
        t1.stopAllActions();
        t1.scale = 1;
        t1.rotation = 0;
        
        var t2 = cc.find("UI_ROOT/anchor-center/t2");
        t2.setPosition(41, 68);
        t2.stopAllActions();
        t2.scale = 1;
        t2.rotation = 0;
        
        var t3 = cc.find("UI_ROOT/anchor-center/t3");
        t3.setPosition(440, 68);
        t3.stopAllActions();
        t3.scale = 1;
        t3.rotation = 0;
        
        this.checkout_root.active = false;
        this.game_mode = 0;
        this.is_active_car_time = false;
        
        this.gen_index = 0;
        this.goods_set.sort(function(lhs, rhs) {
            if(lhs.name < rhs.name) {
                return -1;
            }
            else {
                return 1;
            }
        });
        
        /*this.wind_goods.sort(function(){
            return Math.random() - 0.5;    
        });
        this.gen_index = 0;*/
        for(var i = 0; i < this.goods_set.length; i ++) {
            this.goods_set[i].active = false;
        }
        
        this.scheduleOnce(this.on_gen_goods.bind(this), 1);
    },
    
    play_start_anim: function() {
        var ske_com = cc.find("UI_ROOT/anchor-center/JXM").getComponent(sp.Skeleton);
        ske_com.clearTracks();
        ske_com.setAnimation(0, "in", false);
        ske_com.addAnimation(0, "idle_1", true);
        
        this.scheduleOnce(function(){
            cc.audioEngine.stopMusic(false);
            var url = cc.url.raw("resources/sounds/start.mp3");
            cc.audioEngine.playMusic(url, false);
        }.bind(this), 0.8)
        
        this.scheduleOnce(function() {
            ske_com.clearTracks();
            ske_com.setAnimation(0, "out", false);
        }.bind(this), 4);
    },
    
    
    start: function() {
        this.checkout_root.active = false;
        this.longjuanfeng.active = false;
        cc.find("UI_ROOT/show_card_root").active = false;
        this.add_listener_wind_touch();
        
        this.feng.active = false;
        this.play_start_anim();
        /*this.lock_kim_click = true;
        this.call_latter(function() {
            this.ske_kim_com.clearTracks();
            this.ske_kim_com.setAnimation(0, "idle_1", true);
            this.lock_kim_click = false;
        }.bind(this), 0.9);*/
        this.start_game();
    },
});
