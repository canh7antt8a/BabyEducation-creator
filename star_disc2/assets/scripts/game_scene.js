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
        fly_out_set: {
            default: [],
            type: cc.Node,
        }
    },
    
    hide_card: function() {
        this.checkout_all_disc();    
    },
    
    checkout_all_disc: function() {
        if(this.show_checkout === true) {
            return; 
        }
        
        for(var i = 0; i < this.searched_mask.length; i ++) {
            if(this.searched_mask[i] === 0) {
                return;
            }
        }
       
        // 播放动画
        this.show_checkout = true;
        // end 
        
        // 云移动开
        var func = cc.callFunc(function() {
            this.checkout_bt.scale = 1;
            this.check_click.active = true;
            this.go_go.active = true;
        }.bind(this));
        
        var speed = 350;
        this.fly_out_set[0].stopAllActions();
        var seq = cc.sequence([cc.moveBy(1000/speed, -1000, 0), func]);
        this.fly_out_set[0].runAction(seq);
        // end 
    },
    
    waixingren_fly_out: function() {
        // 外星人飞走
        this.checkout_bt.scale = 0;
        var speed = 350;
        var s1 = cc.moveBy(0.1, 0, 4);
        var s2 = cc.moveBy(0.1, 0, -4);
        var s3 = cc.moveBy(0.1, 0, 4);
        var s4 = cc.moveBy(0.1, 0, -4);
        var s5 = cc.moveBy(0.1, 0, 4);
        var s6 = cc.moveBy(0.1, 0, -4);
        
        var m = cc.moveBy(1000/speed, 1000 * 16 / 18, 1000 * 9 / 18);
        var seq = cc.sequence([s1, s2, s3, s4, s5, s6, m]);
        
        // var f = cc.repeatForever(seq);
        this.man_sheep.runAction(seq);
        
        
        
        this.game_started = false;
        this.go_go.active = false;
        
        this.scheduleOnce(function() {
            // var w_pos = this.camera.convertToWorldSpaceAR(this.check_click.getPosition());
            // var m_pos = this.camera.convertToNodeSpaceAR(w_pos);
            // var time = this.player.getComponent("game_player").goto_map(m_pos);
            
            /*this.scheduleOnce(function(){
                this.play_game_voice_over();
            }.bind(this), time + 0.5);*/
            this.play_game_voice_over();
            
        }.bind(this), 0.3)
    },
    
    play_end_speaker: function() {
        var kim = cc.find("UI_ROOT/kim_speak");
        var wxr = cc.find("UI_ROOT/wxr_speak");
        
        var m = cc.moveBy(0.5, 400, 0);
        var m2 = cc.moveBy(0.5, -500, 0);
        
        wxr.runAction(m2);
        
        this.lock_disc = true; 
        
        var f0 = cc.callFunc(function() { // 吉星喵
            this.play_sound("resources/sounds/duihua1.mp3");
        }.bind(this));
        
        var f1 = cc.callFunc(function() { // 外星人
            this.play_sound("resources/sounds/duihua2.mp3");
        }.bind(this));
        
        var f2 = cc.callFunc(function() { // 吉星喵
            this.play_sound("resources/sounds/duihua3.mp3");
        }.bind(this));
        
        
        
        var f_end = cc.callFunc(function() {
            this.lock_disc = false;
            kim.runAction(cc.moveBy(0.5, -400, 0));
            wxr.runAction(cc.moveBy(0.5, 500, 0));
            this.waixingren_fly_out();
        }.bind(this));
        
        var seq = cc.sequence(m, f0, cc.delayTime(4), f1, cc.delayTime(4), f2, cc.delayTime(4), f_end);
        kim.runAction(seq);
    },
    
    on_checkout_click: function() {
        if(this.game_started === false) {
            return;
        }
        var w_pos = this.camera.convertToWorldSpaceAR(this.check_click.getPosition());
        var m_pos = this.camera.convertToNodeSpaceAR(w_pos);
        var time = this.player.getComponent("game_player").goto_map(m_pos);
        
        this.scheduleOnce(function() {
            this.play_end_speaker();    
        }.bind(this), time);
        
    }, 
    
    show_checkout_anim: function() {
        // 飞船飞走
        var dx = 1000 * 16 / 18;
        var dy = 1000 * 9 / 18;
        
        this.scheduleOnce(function() {
            var m_pos = cc.p(this.player.x + dx, this.player.y + dy);
            var time = this.player.getComponent("game_player").goto_map(m_pos);
            this.scheduleOnce(function() {
                this.checkout_root.active = true;
                this.play_sound("resources/sounds/end.mp3");
            }.bind(this), time);
        }.bind(this), 0.5);
    }, 
    
    hide_knowledge_card: function() {
        this.game_card.hide_card();
        if (this.show_checkend) {
            this.show_checkout_anim();    
            this.show_checkend = false;
        }
    }, 
    
    play_game_voice_over: function() {
        // var icon = this.man_sheep.getComponent(cc.Sprite).spriteFrame;
        // this.game_card.show_card("Good!", "Aliens take you to \n the next story ! come on", icon);
        // this.show_checkend = true;
        this.show_checkout_anim();    
        this.show_checkend = false;
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
        
        this.checkout_bt = cc.find("UI_ROOT/camera_root/map_root/exit_anim");
        this.check_click = cc.find("UI_ROOT/camera_root/map_root/exit_click");
        this.man_sheep = cc.find("UI_ROOT/camera_root/map_root/exit");
         
        this.checkout_bt.scale = 0;
        this.checkout_root = cc.find("UI_ROOT/checkout_root");
        this.game_card = cc.find("UI_ROOT/card_root").getComponent("game_card");
        
        this.start_root = cc.find("UI_ROOT/start_root");
        this.go_go = cc.find("UI_ROOT/go_go");
        
        this.show_checkend = false;
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
        
        this.search_star_r = [200, 200, 200, 150, 200, 200, 200, 250];
        this.searched_mask = [0, 0, 0, 0, 0, 0, 0, 0];
        
        this.star_tital_info = [
            "Searching", "Searching", "Searching", "Searching", "Searching", "Searching", "Searching", "Searching",
        ];
        
        this.star_content_info = [
            "Uranus, \nthe planet of the aura.", "Saturn, \nwith a huge halo", "Neptune, a blue gas planet.", 
            "This is a man-made satellite", "A purple star, looks like jelly.", "Pluto, the largest \nplanet in the solar system", 
            "A golden star, \nand there are satellites", "Gas station, to provide fuel \nfor travelers voyage of the door"
        ];
        
        this.star_sound_name = ["tianwangxing.mp3", "tuxing.mp3", "haiwangxing.mp3", "renzaoweixin.mp3", "zhishexingqiu.mp3", "mingwangxing.mp3", "jinsexingqiu.mp3", "jiayouzhan.mp3"];
        
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
            if(cc.pDistance(w_pos, c_w_pos) <= DISTANCE/* && this.searched_mask[i] === 0*/) {
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
            this.searched_mask[this.hit_star_index] = 1;
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
        cc.audioEngine.stopMusic();
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
        var kim = cc.find("UI_ROOT/kim_speak");
        var m = cc.moveBy(0.5, 400, 0);
        
        var f0 = cc.callFunc(function() {
            this.play_sound("resources/sounds/start.mp3");
            /*var m1 = cc.moveBy(0.5, 0, -10);
            var m2 = cc.moveBy(0.5, 0, 10);
            var seq = cc.sequence(m1, m2);
            var f = cc.repeatForever(seq);
            kim.runAction(f);*/
        }.bind(this));
        
        var f1 = cc.callFunc(function() {
            this.lock_disc = false;
            var children = this.star_set;
            
            for(var i = 0; i < children.length; i ++) {
                var tip = children[i].getChildByName("tip");
                
                if (this.searched_mask[i] === 0) {
                    tip.active = true;    
                }
            }
            // kim.stopAllActions();
            // kim.y = -308;
            kim.runAction(cc.moveBy(0.5, -400, 0));
        }.bind(this));
        
        var seq = cc.sequence(m, f0, cc.delayTime(7), f1);
        kim.runAction(seq);
    },
    
    play_start_anim: function() {
        var speed = 300;
        /*
        var time = 1;
        var delta = 50;
       
        // 飞机
        {
            this.player.x = 0;
            this.player.y = -600;
            var func = cc.callFunc(function(){
                this.lock_disc = false;
                var children = this.star_set;
                
                for(var i = 0; i < children.length; i ++) {
                    var tip = children[i].getChildByName("tip");
                    
                    if (this.searched_mask[i] === 0) {
                        tip.active = true;    
                    }
                }
                this.star_root.active = true;
            }.bind(this));
            var seq = cc.sequence([cc.moveTo(600/speed, 0, 0), func]);
            this.player.runAction(seq);
        }
        // end
        */
        var func = cc.callFunc(function() {
           var time = this.player.getComponent("game_player").goto_map(cc.p(0, 0));
           this.scheduleOnce(function() {
                /*this.lock_disc = false;
                var children = this.star_set;
                
                for(var i = 0; i < children.length; i ++) {
                    var tip = children[i].getChildByName("tip");
                    
                    if (this.searched_mask[i] === 0) {
                        tip.active = true;    
                    }
                }*/
                this.play_start_speaking();
           }.bind(this), time);
        }.bind(this)); 
        this.star_root.active = true;
        var m = cc.moveTo((1180 - 540) / speed, 0, -540);
        var seq = cc.sequence([m, func]);
        this.player.runAction(seq);
        // 
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
                
                if (this.searched_mask[i] === 0) {
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
        this.man_sheep.setPosition(this.man_sheep_pos);
        
        var children  = this.star_root.children;
        for(var i = 0; i < children.length; i ++) {
            var pbar = children[i].getChildByName("pbar");
            pbar.active = false;
            
            var tip = children[i].getChildByName("tip");
            tip.active = false;
        }
        
        this.searched_mask = [0, 0, 0, 1, 0, 0, 0, 1];
        // this.searched_mask = [1, 1, 1, 1, 1, 1, 0, 1];
        this.player.getComponent("game_player").bind_camera(this.camera);
        
        this.fly_out_set[0].x = 2446;
    }, 
    
    start_button_click: function() {
        this.play_sound("resources/sounds/button.mp3");
        this.start_root.active = false;
        this.on_game_start();
        this.lock_disc = true;
        this.play_start_anim();
    }, 
    
    start: function() {
        this.man_sheep_pos = this.man_sheep.getPosition();
        this.go_go.active = false;
        this.star_root.active = false;
        this.start_root.active = true;
    }
    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
