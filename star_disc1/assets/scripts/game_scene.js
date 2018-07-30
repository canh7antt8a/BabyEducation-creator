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
        fly_in_set: {
            default: [],
            type: cc.Node,
        }
    },
    
    hide_card: function() {
        this.checkout_all_disc();    
    },
    
    play_end_speaking: function() {
        var kim = cc.find("UI_ROOT/kim_speak");
        var m = cc.moveBy(0.5, 400, 0);
        this.lock_disc = true; 
        
        var f0 = cc.callFunc(function() {
            this.play_sound("resources/sounds/end_search.mp3");
        }.bind(this));
        
        var f1 = cc.callFunc(function() {
            this.lock_disc = false;
            kim.runAction(cc.moveBy(0.5, -400, 0));
        }.bind(this));
        
        var seq = cc.sequence(m, f0, cc.delayTime(5), f1);
        kim.runAction(seq);
    },
    
    checkout_all_disc: function() {
        if(this.show_checkout === true) {
            return; 
        }
        
        for(var i = 0; i < this.seared_mask.length; i ++) {
            if(this.seared_mask[i] === 0) {
                return;
            }
        }
       
        // 播放动画
        this.show_checkout = true;
        this.checkout_bt.scale = 1;
        this.check_click.active = true;
        this.go_go.active = true;
        // end 
        
        this.play_end_speaking();
    },
    
    on_checkout_click: function() {
    	if(this.game_started === false) {
            return;
        }
        
        this.game_started = false;
        this.go_go.active = false;
        var w_pos = this.camera.convertToWorldSpaceAR(this.check_click.getPosition());
        var m_pos = this.camera.convertToNodeSpaceAR(w_pos);
        var time = this.player.getComponent("game_player").goto_map(m_pos);
    
        
        this.scheduleOnce(function(){
            this.checkout_root.active = true;
            this.play_sound("resources/sounds/end.mp3");
        }.bind(this), time + 0.5);
    }, 
    
    goto_to_map: function(m_pos) {
        this.player.getComponent("game_player").goto_map(m_pos);
        this.search_hit_star(m_pos);
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
    
    play_sound: function(name) {
        var url_data = cc.url.raw(name);
        cc.audioEngine.stopMusic();
        cc.audioEngine.playMusic(url_data);
    },
    
    play_sound_loop: function(name) {
        var url_data = cc.url.raw(name);
        cc.audioEngine.stopMusic();
        cc.audioEngine.playMusic(url_data, true);
    },
    
    // use this for initialization
    onLoad: function () {
        this.map_root = cc.find("UI_ROOT/camera_root/map_root");
        this.ground = cc.find("UI_ROOT/camera_root/ground");
        this.player = cc.find("UI_ROOT/camera_root/plane");
        this.cloud_root = cc.find("UI_ROOT/camera_root/cloud_root");
        this.player_up = cc.find("UI_ROOT/camera_root/plane_up");
        this.player.getComponent("game_player").bind_player(this.player_up);
        
        this.star_root = cc.find("UI_ROOT/camera_root/map_root/star_root");
        
        this.game_bg = cc.find("UI_ROOT/camera_root/map_root/game_bg");
        this.camera = cc.find("UI_ROOT/camera_root");
        
        this.checkout_bt = cc.find("UI_ROOT/camera_root/map_root/check_button");
        this.check_click = cc.find("UI_ROOT/camera_root/map_root/check_click");
        this.checkout_bt.scale = 0;
        this.checkout_root = cc.find("UI_ROOT/checkout_root");
        this.game_card = cc.find("UI_ROOT/card_root").getComponent("game_card");
        
        this.start_root = cc.find("UI_ROOT/start_root");
        this.go_go = cc.find("UI_ROOT/go_go");
        
        this.game_bg.on(cc.Node.EventType.TOUCH_START, function(event) {
            event.stopPropagation();
        }.bind(this), this.node);
        
        this.game_bg.on(cc.Node.EventType.TOUCH_END, function(event) {
            if(this.game_started === false || this.lock_disc === true) {
                return;
            }
            
            var m_pos = this.camera.convertToNodeSpaceAR(event.getLocation());
            this.goto_to_map(m_pos);
        }.bind(this), this.node);
        
        this.star_set = this.star_root.children.slice(0);
        this.star_set.sort(function(lhs, rhs) {
            return (lhs.x - rhs.x)
        });
        
        this.search_star_r = [200, 150, 150, 150, 200, 200, 200, 200];
        this.seared_mask = [0, 1, 1, 1, 0, 0, 0, 0];
        
        this.star_tital_info = [
            "Searching", "Searching", "Searching", "Searching", "Searching", "Searching", "Searching", "Searching", "Searching",
        ];
        
        this.star_content_info = [
            "Mercury, The closest planet \nto the sun", "This asteroid is full of\n rock and ice.", "This asteroid is full of \nrock and ice.", "This is a man-made satellite", "Earth, our home", "Moon, \nEarth's natural satellite", 
            "Jupiter, The largest gaseous \nplanet in the solar system", "Mars, A red planet, \nwhich is much like the earth",
        ];
        
        this.star_sound_name = ["shuixing.mp3", "xiaoxinxing.mp3", "xiaoxinxing.mp3", "renzaoweixin.mp3", "diqiu.mp3", "yueqiu.mp3", "muxing.mp3", "huoxing.mp3"];
        
        this.hit_star_index = -1;
        this.game_started = false;
        
        this.preload_sound();
    },
    
    search_hit_star: function(m_pos) {
        this.hit_star_index = -1;
        
        var w_pos = this.camera.convertToWorldSpaceAR(m_pos);
        var children = this.star_set;
        for(var i = 0; i < children.length; i ++) {
            var c_w_pos = children[i].convertToWorldSpaceAR(cc.p(0, 0));
            var DISTANCE = this.search_star_r[i];
            if(cc.pDistance(w_pos, c_w_pos) <= DISTANCE/* && this.seared_mask[i] === 0*/) {
                this.hit_star_index = i;
                return;
            }
        }
        
    }, 
    
    hit_clound_test: function(player) {
        var children = this.cloud_root.children;
        var w_pos = player.convertToWorldSpaceAR(cc.p(0, 0));
        for(var i = 0; i < children.length; i ++) {
            var w_box = children[i].getBoundingBoxToWorld();
            if (w_box.contains(w_pos)) {
                return true;
            }
        }
        
        return false;
    },
    
    on_hit_test: function(player_com) {
        if(this.hit_star_index === -1) {
            return false;
        }
        
        
        var w_pos = this.player.convertToWorldSpaceAR(cc.p(0, 0));
        var c_w_pos = this.star_set[this.hit_star_index].convertToWorldSpaceAR(cc.p(0, 0));
        var DISTANCE = this.search_star_r[this.hit_star_index];
        
        var len = cc.pDistance(w_pos, c_w_pos);
        if( len <= DISTANCE) {
            this.lock_disc = true;
            this.star_set[this.hit_star_index].getChildByName("pbar").active = true;
            player_com.enter_search_mode(this.star_set[this.hit_star_index], c_w_pos, DISTANCE, w_pos);
            this.seared_mask[this.hit_star_index] = 1;
            if(this.show_checkout) {
                this.go_go.active = false;
            }
            return true;
        }
        return false;
    }, 
    
    on_search_star_start: function(hit_star) {
        this.play_sound_loop("resources/sounds/searhing.mp3");
    },
    
    on_search_star_end: function(hit_star) {
        hit_star.getChildByName("pbar").active = false;
        this.lock_disc = true;
        var icon = hit_star.getChildByName("icon").getComponent(cc.Sprite).spriteFrame;
        var index = this.hit_star_index;
        this.scheduleOnce(function() {
            this.game_card.show_card(this.star_tital_info[index], this.star_content_info[index], icon, this.star_sound_name[index]);    
            this.lock_disc = false;
        }.bind(this), 0.016);
        
        var tip = this.star_set[this.hit_star_index].getChildByName("tip");
        tip.active = false;
        
        this.hit_star_index = -1;
        if(this.show_checkout) {
            this.go_go.active = true;
        }
        // this.checkout_all_disc();
    }, 
    
    on_search_star_progcess: function(hit_star, percent) {
        hit_star.getChildByName("pbar").getComponent(cc.ProgressBar).progress = 1 - percent;
    }, 
    
    play_start_speaking: function() {
        cc.audioEngine.stopMusic();
        
        var kim = cc.find("UI_ROOT/kim_speak");
        var m = cc.moveBy(0.5, 400, 0);
        
        var f0 = cc.callFunc(function() {
            this.play_sound("resources/sounds/start.mp3");
        }.bind(this));
        
        var f1 = cc.callFunc(function() {
            this.lock_disc = false;
            var children = this.star_set;
            
            for(var i = 0; i < children.length; i ++) {
                var tip = children[i].getChildByName("tip");
                
                if (this.seared_mask[i] === 0) {
                    tip.active = true;    
                }
            }
            kim.runAction(cc.moveBy(0.5, -400, 0));
        }.bind(this));
        
        var seq = cc.sequence(m, f0, cc.delayTime(5), f1);
        kim.runAction(seq);
    },
    
    play_start_anim: function() {
        var speed = 200;
        var time = 1;
        var delta = 50;
        // 背景
        {
            var m11 = cc.moveBy(time * 2, 0, -time * speed);
            var func_end = cc.callFunc(function(){
                this.play_start_speaking();
            }.bind(this), this);
            
            var func12 = cc.callFunc(function(){
                this.star_root.active = true;
                for(var i = 0; i < this.fly_in_set.length; i ++) {
                    this.fly_in_set[i].y -= 700;
                    this.fly_in_set[i].runAction(cc.moveBy(5, 0, 700));
                }
            }.bind(this), this);
            var m12 = cc.moveBy(time * 0.5, 0, 50);
            var m13 = cc.moveBy(time * 3, 0, time * speed - 50);
            var sm11 = cc.sequence([m11, m12, func12, m13, cc.delayTime(2.1), func_end]);
            this.map_root.runAction(sm11);    
        }
        
        // 飞机
        {
            var m21 = cc.moveBy(time, 0, time * speed * 3);
            var delay = cc.delayTime(0.5);
            var m22 = cc.moveBy(1, 0, 150);
            var m33 = cc.moveTo(time * 3, 0, 0);
            
            var sm21 = cc.sequence([m33]);
            this.player.runAction(sm21);
            this.player_up.runAction(sm21.clone());
        }
        // end 
        
        
        
        // 地面
        {
            var m = cc.moveBy(0.5, 0, -300);
            var func = cc.callFunc(function(){
                this.ground.active = false;
            }.bind(this), this);
            var seq = cc.sequence([m, func]);
            this.ground.runAction(seq);
        }
    }, 

    on_replay_game: function() {
        this.player.active = false;
        this.player.getChildByName("img").rotation = 0;
        this.player.x = 0;
        this.player.y = 0;
        this.lock_disc = true;
        this.checkout_root.active = false;
        
        var func = cc.callFunc(function() {
            this.player.active = true;
            this.on_game_start();
            this.star_root.active = true;
            
            this.lock_disc = false;
            var children = this.star_set;
            
            for(var i = 0; i < children.length; i ++) {
                var tip = children[i].getChildByName("tip");
                
                if (this.seared_mask[i] === 0) {
                    tip.active = true;    
                }
            }
            // this.lock_disc = false;
        }.bind(this));
        var seq = cc.sequence([cc.moveTo(0.5, 0, 0), func]);
        this.camera.runAction(seq);
    },
    
    on_game_start: function() {
        if(this.game_started === true) {
            return;
        }
        
        this.checkout_root.active = false;
        this.check_click.active = false;
        this.show_checkout = false;
        this.game_started = true;
        this.checkout_bt.scale = 0;
        this.star_root.active = false;
        this.lock_disc = false;
        this.go_go.active = false;
        
        
        var children  = this.star_root.children;
        for(var i = 0; i < children.length; i ++) {
            var pbar = children[i].getChildByName("pbar");
            pbar.active = false;
            
            var tip = children[i].getChildByName("tip");
            tip.active = false;
        }
        
        this.seared_mask = [0, 1, 1, 1, 0, 0, 0, 0];
        this.player.getComponent("game_player").bind_camera(this.camera);
        
    }, 
    
    start_button_click: function() {
        this.start_root.active = false;
        this.play_sound("resources/sounds/button.mp3");
        
        this.on_game_start();
        this.lock_disc = true;
        var ypos = this.player.y;
        var s1 = cc.moveBy(0.1, 0, 4);
        var s2 = cc.moveBy(0.1, 0, -4);
        var seq = cc.sequence([s1, s2]);
        var f = cc.repeatForever(seq);
        this.player.runAction(f);
        
        this.scheduleOnce(function() {
            this.play_sound("resources/sounds/huo_jian_fa_she.mp3");
        }.bind(this), 0.5);
        
        this.scheduleOnce(function() {
            this.player.stopAllActions();
            this.player.y = ypos;
            this.play_start_anim();    
        }.bind(this), 3);
        
    }, 
    
    start: function() {
        this.go_go.active = false;
        this.star_root.active = false;
        this.start_root.active = true;
        
    }
    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
