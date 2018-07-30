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
    
    checkout_all_disc: function() {
        if(this.show_checkout === true) {
            return; 
        }
        
        // console.log(this.searched_mask);
        
        for(var i = 0; i < this.searched_mask.length; i ++) {
            if(this.searched_mask[i] === 0) {
                return;
            }
        }
       
        // 播放动画
        this.show_checkout = true;
        // end 
        
        this.checkout_bt.scale = 1;
        this.check_click.active = true;
        this.go_go.active = true;
        
        this.play_sound("resources/sounds/xing_men_open.mp3");
        this.ship_root.getComponent("machine_man").show_fire();
        this.scheduleOnce(function() {
            this.play_sound("resources/sounds/desic.mp3");
        }.bind(this), 2);
    },
    
    on_checkout_click: function() {
        if(this.game_started === false) {
            return;
        }
        
        /*
        */
        // 外星人飞走
        this.game_started = false;
        this.go_go.active = false;
        // var w_pos = this.camera.convertToWorldSpaceAR(this.check_click.getPosition());
        // this.exit_entry.stopAllActions();
        var w_pos = this.exit_entry.convertToWorldSpaceAR(cc.p(0, 0));
        var m_pos = this.camera.convertToNodeSpaceAR(w_pos);
        var time = this.player.getComponent("game_player").goto_map(m_pos);
        
        this.scheduleOnce(function(){
            this.play_game_voice_over();
        }.bind(this), time);
    }, 
    
    show_checkout_anim: function() {
        this.checkout_bt.scale = 0;
        var s = cc.scaleTo(0.5, 0);
        this.player.runAction(s);
        
        var r = cc.rotateBy(1, 360);
        this.player.runAction(r);
        
        this.scheduleOnce(function() {
            this.player.stopAllActions();
            this.checkout_root.active = true;
            this.play_sound("resources/sounds/end.mp3"); 
        }.bind(this), 1);
    }, 
    
    hide_knowledge_card: function() {
        this.game_card.hide_card();
    }, 
    
    play_game_voice_over: function() {
        this.show_checkout_anim();
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
        
        this.scheduleOnce(function() {
            cc.audioEngine.playMusic(url_data);
        }.bind(this), 0.016);
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
        
        this.checkout_bt = cc.find("UI_ROOT/camera_root/map_root/exit_entry/exit_anim");
        this.check_click = cc.find("UI_ROOT/camera_root/map_root/exit_entry/exit_click");
        
        this.exit_entry = cc.find("UI_ROOT/camera_root/map_root/exit_entry");
        this.ship_root = cc.find("UI_ROOT/camera_root/map_root/exit_entry/ship_root");
         
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
        
        this.search_star_r = [200, 250, 150, 150, 200, 200, 200, 200, 200, 150];
        // 0, 介绍，1，解救外星人, 2 获取道具
        this.searched_task = [2, 0, 0, 0, 2, 0, 0, 2, 0, 0];
        this.searched_invalid = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        
        this.star_tital_info = [
            "Searching", "Searching", "Searching", "Searching", "Searching", "Searching", "Searching", "Searching", "Searching", "Searching",
        ];
        
        this.star_content_info = [
            "", "The whole planet is \nentangled with huge plants.", "All of this asteroid is ice.", "All of this asteroid is ice.", 
            "", "This planet is like a \nhuge red candy.", "The surface of this \nplanet flowing hot magma", "", 
            "The planet seems \nto be a huge bubble", "All of this asteroid is ice.",
        ];
        
        this.star_sound_name = ["", "star5.mp3", "star3.mp3", "star3.mp3", "", "star4.mp3", "star2.mp3",  "", "star1.mp3", "star3.mp3"];
        
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
            if(cc.pDistance(w_pos, c_w_pos) <= DISTANCE && this.searched_invalid[i] === 0) {
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
    
    do_show_knowledge_task: function(hit_star) {
        var icon = hit_star.getChildByName("icon").getComponent(cc.Sprite).spriteFrame;
        var index = this.hit_star_index;
        this.scheduleOnce(function() {
            this.game_card.show_card(this.star_tital_info[index], this.star_content_info[index], icon, this.star_sound_name[index]);    
            this.lock_disc = false;
            this.checkout_all_disc();
        }.bind(this), 0.016);
        
        var tip = this.star_set[this.hit_star_index].getChildByName("tip");
        tip.active = false;
        this.hit_star_index = -1;
    },
    
    reset_daoju_task_star: function(hit_star) {
        var daoju = hit_star.getChildByName("daoju");
        // daoju.scale = 0.5;
        daoju.getComponent("daoju_action").reset();
    }, 
    
    do_disc_daoju_task: function(hit_star) {
        var daoju = hit_star.getChildByName("daoju");
        
        var index = this.hit_star_index;
        var save_pos = daoju.getPosition();
        var tip = this.star_set[this.hit_star_index].getChildByName("tip");
        tip.active = false;
        
        this.play_sound("resources/sounds/find_part1.mp3");
        daoju.getComponent("daoju_action").show();
        
        this.scheduleOnce(function() {
            this.lock_disc = false;
            switch(index) {
                case 0:
                    this.ship_root.getComponent("machine_man").get_daoju(0);
                break;
                case 4: // 中间
                    this.ship_root.getComponent("machine_man").get_daoju(2);
                break;
                case 7:
                    this.ship_root.getComponent("machine_man").get_daoju(1);
                break;
            }
            this.checkout_all_disc();
        }.bind(this), 2);
        
        this.searched_invalid[this.hit_star_index] = 1;
        this.hit_star_index = -1;
    }, 
    
    reset_rescued_task_star: function(hit_star) {
        var out_man = hit_star.getChildByName("out_man");
        out_man.scale = 1;
        var cap = hit_star.getChildByName("cap");
        cap.opacity = 255;
    }, 
    
    do_rescued_outman_task: function(hit_star) {
        var out_man = hit_star.getChildByName("out_man");
        var icon = out_man.getComponent(cc.Sprite).spriteFrame;
        var index = this.hit_star_index;
        
        var save_pos = out_man.getPosition();
        // 去掉石门
        var cap = hit_star.getChildByName("cap");
        cap.runAction(cc.fadeOut(0.3));
        // end 
        
        // 飞碟去接人,如果飞碟看不见，那么从中心飞来，如果飞碟看的见，直接过来。
        var w_pos = hit_star.convertToWorldSpaceAR(cc.p(0, 190));
        var to_pos = this.exit_entry.parent.convertToNodeSpaceAR(w_pos);
        var dir = this.exit_entry.getPosition();
        
        dir = cc.pSub(dir, to_pos);
        var speed = 300;
        var time = dir.mag() / speed;
        var m = cc.moveTo(time, to_pos);
        var move_time = 1.2;
        var func = cc.callFunc(function() {
            var f = cc.callFunc(function() {
                // out_man.removeFromParent();
                out_man.setPosition(save_pos);
                out_man.scale = 0;
            }.bind(this)); 
            var s2 = cc.sequence([cc.moveTo(move_time, cc.p(0, 190)), f]);
            out_man.runAction(s2);    
        }.bind(this));
        
        var seq = cc.sequence([m, func, cc.delayTime(move_time), cc.moveTo(time, cc.p(0, 0))]);
        this.exit_entry.runAction(seq);
        // end 
        
        this.scheduleOnce(function() {
            this.game_card.show_card(this.star_tital_info[index], this.star_content_info[index], icon, this.star_sound_name[index]);    
            this.lock_disc = false;
            this.checkout_all_disc();
        }.bind(this), time + move_time);
        
        
        var tip = this.star_set[this.hit_star_index].getChildByName("tip");
        tip.active = false;
        this.searched_invalid[this.hit_star_index] = 1;
        this.hit_star_index = -1;
    },
    
    on_search_star_start: function(hit_star) {
        this.play_sound_loop("resources/sounds/searhing.mp3");
    },
    
    on_search_star_end: function(hit_star) {
        cc.audioEngine.stopMusic();
        
        hit_star.getChildByName("pbar").active = false;
        this.lock_disc = true;
        
        switch(this.searched_task[this.hit_star_index])  {
            case 0:
                this.do_show_knowledge_task(hit_star);
            break;
            case 1:
                this.do_rescued_outman_task(hit_star);
            break;
            case 2:
                this.do_disc_daoju_task(hit_star);
            break;
        }
        
        if(this.show_checkout) {
            this.go_go.active = true;
        }
    }, 
    
    on_search_star_progcess: function(hit_star, percent) {
        hit_star.getChildByName("pbar").getComponent(cc.ProgressBar).progress = 1 - percent;
    }, 
    
    play_start_anim: function() {
        var time = this.player.getComponent("game_player").goto_map(cc.p(0, 0));
        this.scheduleOnce(function() {
            /*this.lock_disc = false;
            var children = this.star_set;
            this.star_root.active = true;
            
            for(var i = 0; i < children.length; i ++) {
                var tip = children[i].getChildByName("tip");
                
                if (this.searched_mask[i] === 0) {
                    tip.active = true;    
                }
            }*/
            this.play_start_speaking();
       }.bind(this), time);
       
        // 飞碟
        var speed = 150;
        this.exit_entry.runAction(cc.moveTo((320) / speed, 0, 0));
         
    }, 

    on_replay_game: function() {
        this.player.active = false;
        this.player.getChildByName("img").rotation = 0;
        this.player.x = 0;
        this.player.y = 0;
        this.player.scale = 1;
        this.player.rotation = 0;
        
        // this.player.setCascadeOpacityEnabled(true);
        // this.player.opacity = 255;
        
        
        this.lock_disc = true;
        this.checkout_root.active = false;
        
        // this.exit_entry.setPosition(cc.p(1312, 0));
        // this.ship_root.setPosition(cc.p(0, 0));
        
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
        
        var children  = this.star_root.children;
        for(var i = 0; i < children.length; i ++) {
            var pbar = children[i].getChildByName("pbar");
            pbar.active = false;
            
            var tip = children[i].getChildByName("tip");
            tip.active = false;
        }
        
        this.searched_mask = [0, 0, 1, 1, 0, 0, 1, 0, 0, 1];
        // this.searched_mask = [1, 1, 1, 1, 1, 1, 1, 1, 1, 0];
        this.player.getComponent("game_player").bind_camera(this.camera);
        this.player.getChildByName("img").getChildByName("daoju_icon").active = false;
        this.ship_root.getComponent("machine_man").reset_manchine_man();
        
        // var guang = this.star_set[7].getChildByName("guang");
        // guang.active = true;
        for (var i = 0; i < this.searched_task.length; i ++) {
            switch(this.searched_task[i]) {
                case 1:
                    this.reset_rescued_task_star(this.star_set[i]);
                break;
                case 2:
                    this.reset_daoju_task_star(this.star_set[i]);
                break;
            }
            this.searched_invalid[i] = 0;
        }
        
        // this.fly_out_set[0].x = 2446;
    }, 
    
    play_start_speaking: function() {
        var kim = cc.find("UI_ROOT/kim_speak");
        var wxr = cc.find("UI_ROOT/wxr_speak");
        
        var m = cc.moveBy(0.5, 400, 0);
        var m2 = cc.moveBy(0.5, -500, 0);
        
        wxr.runAction(m2);
        
        this.lock_disc = true; 
        
        var f0 = cc.callFunc(function() { // 外星人
            this.play_sound("resources/sounds/start.mp3");
        }.bind(this));
        
        
        var f_end = cc.callFunc(function() {
            kim.runAction(cc.moveBy(0.5, -400, 0));
            wxr.runAction(cc.moveBy(0.5, 500, 0));
            
            this.lock_disc = false;
            var children = this.star_set;
            this.star_root.active = true;
            
            for(var i = 0; i < children.length; i ++) {
                var tip = children[i].getChildByName("tip");
                
                if (this.searched_mask[i] === 0) {
                    tip.active = true;    
                }
            }
        }.bind(this));
        
        var seq = cc.sequence(m, f0, cc.delayTime(7 + 1), f_end);
        kim.runAction(seq);
    },
    
    start_button_click: function() {
        this.play_sound("resources/sounds/button.mp3");
        this.start_root.active = false;
        this.on_game_start();
        this.lock_disc = true;
        this.play_start_anim();
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
