var decro_prefab_set = cc.Class({
    name: 'decro_prefab_set',
    properties: {
        sub_set: {
            default: [],
            type: cc.Prefab    
        }
    }
});

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
        
        header_set: {
            default: [],
            type: cc.Prefab,
        },
        
        body_set: {
            default: [],
            type: cc.Prefab,
        },
        
        foot_set: {
            default: [],
            type: cc.Prefab,
        },
        
        left_hand_set: {
            default: [],
            type: cc.Prefab,
        }, 
        
        right_hand_set: {
            default: [],
            type: cc.Prefab,
        }, 
    },
    
    // use this for initialization
    preload_sound: function() {
        var sound_list = [
            "resources/sounds/bones_in.mp3",
            "resources/sounds/go_auto.mp3",
            "resources/sounds/move_parts.mp3",
            "resources/sounds/ping_ok.mp3",
            "resources/sounds/play.mp3",
            "resources/sounds/kim_clk2.mp3",
            "resources/sounds/kim_clk1.mp3",
            "resources/sounds/end.mp3",
            "resources/sounds/hanjie.mp3",
            "resources/sounds/man_voice.mp3",
        ];
        
        for(var i = 0; i < sound_list.length; i ++) {
            var url = cc.url.raw(sound_list[i]);
            cc.loader.loadRes(url, function() {});    
        }
    }, 
    
    // use this for initialization
    onLoad: function () {
        this.game_start = false;
    

        this.ske_kim_com = cc.find("UI_ROOT/anchor-center/kim").getComponent(sp.Skeleton);
        this.game_mode = 0;
        this.lock_kim_click = false;

     
        
        this.checkout_root = cc.find("UI_ROOT/check_out_root");
        this.checkout_root.active = false;
        
        this.game_mode_tip = cc.find("UI_ROOT/anchor-center/mask");
        this.parts = cc.find("UI_ROOT/anchor-center/parts");
        this.man_root = cc.find("UI_ROOT/anchor-center/man_body_root");
        
        this.left_worker = cc.find("UI_ROOT/anchor-center/left_worker");
        
        this.right_worker = cc.find("UI_ROOT/anchor-center/right_worker");
        this.top_worker = cc.find("UI_ROOT/anchor-center/top_worker");
    },
    
    show_game_stage_tip: function(game_mode) {
        var i;
        for(i = 1; i <= 5; i ++) {
            var node = this.game_mode_tip.getChildByName("" + i);
            node.active = false;
        }
        
        var now = this.game_mode_tip.getChildByName("" + game_mode);
        now.active = true;
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
        
        this.call_latter(function() {
            this.ske_kim_com.clearTracks();
            this.ske_kim_com.setAnimation(0, "idle_1", true);
            this.lock_kim_click = false;
        }.bind(this), 2);
    }, 
    
    save_manchine_part_pos: function() {
        this.part_pos = [];
        for(var i = 1; i <= 5; i ++) {
            var name = "tw" + i + "1";
            var node = this.man_root.getChildByName(name);
            this.part_pos.push(cc.p(node.x, node.y));
        }
        this.face_y = this.man_root.getChildByName("face").y;
    },
    
    start: function() {
        this.left_worker.x = -815;
        this.left_worker.y = 510;
        
        // 
        this.save_manchine_part_pos();
        // 
        this.lock_kim_click = true;
        this.call_latter(function() {
            this.ske_kim_com.clearTracks();
            this.ske_kim_com.setAnimation(0, "idle_1", true);
            this.lock_kim_click = false;
        }.bind(this), 0.9);
        this.on_start_game();
    }, 
    
    play_sound: function(name) {
        var url_data = cc.url.raw(name);
        cc.audioEngine.stopMusic();
        cc.audioEngine.playMusic(url_data);
    },
    play_sound_loop: function(name) {
        var url_data = cc.url.raw(name);
        cc.audioEngine.stopMusic();
        cc.audioEngine.playMusic(url_data);
    },
    call_latter: function(callfunc, delay) {
        var delay_action = cc.delayTime(delay);
        var call_action = cc.callFunc(callfunc, this);
        var seq = cc.sequence([delay_action, call_action]);
        this.node.runAction(seq);
    },
    
    play_kim_anim_with_right:function() {
        this.ske_kim_com.clearTracks();
        this.ske_kim_com.setAnimation(0, "ok_1", false);
        this.call_latter(function() {
            this.ske_kim_com.clearTracks();
            this.ske_kim_com.setAnimation(0, "idle_1", true);
        }.bind(this), 2);
        // this.play_sound("resources/sounds/ch_right.mp3");
    }, 
    
    play_kim_anim_with_error:function() {
        this.ske_kim_com.clearTracks();
        this.ske_kim_com.setAnimation(0, "err_1", false);
        this.call_latter(function() {
            this.ske_kim_com.clearTracks();
            this.ske_kim_com.setAnimation(0, "idle_1", true);
        }.bind(this), 1.5);
        // this.play_sound("resources/sounds/ck_error.mp3");
    }, 
    
    on_start_game: function() {
        if(this.game_start === true) {
            return;
        }
        this.man_root.removeAllChildren();
        this.play_sound("resources/sounds/5start.mp3");
        this.game_start = true;
        this.lock_move_back = false;
        this.lock_destroy = false;
        this.game_mode = 1;
        
        this.scheduleOnce(function() {
            this.enter_first_mode();
        }.bind(this), 3);
    },
    
    new_part_set: function(step_parts) {
        this.parts.removeAllChildren();
        this.part_set = [];
        for(var i = 0; i < step_parts.length; i ++) {
            var item = cc.instantiate(step_parts[i]);
            var com = item.getComponent("decorative_part");
            item.active = true;
            item.parent = this.parts;
            item.x = com.start_x;
            item.y = com.start_y;
            item.active = true;
            this.part_set.push(item);
            com.invalid_hit_move();
        }
        // 
        this.part_set.sort(function() {
            return Math.random() - 0.5;
        });
        this.part_now_index = 0;
    },
    
    select_part: function() {
        // -815, 510,  -815, 728, -1252, 728, -1252, 449
        var time = 0.5 * 1.5;
        var m1 = cc.moveBy(time, 0, 218);
        var m2 = cc.moveBy(time, -437, 0);
        var m3 = cc.moveBy(time, 0, -279);
        var m4 = cc.moveBy(time, 0, 279);
        var m5 = cc.moveBy(time, 437, 0);
        var m6 = cc.moveBy(time, 0, -218);
        
        var now_part = this.part_set[this.part_now_index];
        var com = now_part.getComponent("decorative_part");
        com.invalid_hit_move();
        this.select_item = now_part;
        this.lock_move_back = true;
        this.play_sound("resources/sounds/bones_in.mp3");
        
        var func = cc.callFunc(function() {
            this.play_sound("resources/sounds/bones_in.mp3");
            // var com = now_part.getComponent("decorative_part");
            // now_part.runAction(cc.moveTo(time, com.dst_x, com.dst_y));
            var mm1 = cc.moveBy(time, 0, 279);
            var mm2 = cc.moveBy(time, 437, 0);
            var mm3 = cc.moveBy(time, 0, -218);
            var seq2 = cc.sequence([mm1, mm2, mm3]); 
            now_part.runAction(seq2);
        }.bind(this), this);
        
        var end_func = cc.callFunc(function(){
            this.lock_move_back = false;
            var com = now_part.getComponent("decorative_part");
            com.valid_hit_move();
        }.bind(this), this);
        
        var seq = cc.sequence([m1, m2, m3, func, m4, m5, m6, end_func]);
        this.left_worker.runAction(seq);
    }, 
    
    move_part_back_when_destroy: function() {
        if(this.lock_move_back === true && this.game_mode < 6) {
            return;
        }
        
        
        // var prev_part = this.part_set[this.part_now_index];
        var prev_part = this.select_item;
        
        
        this.lock_move_back = true;
        var time = 0.5 * 1.5;
        
        
        var func = cc.callFunc(function() {
            var mmm1 = cc.moveBy(time, 0, 218);
            var mmm2 = cc.moveBy(time, -437, 0);
            var mmm3 = cc.moveBy(time, 0, -279);
            var seq_mmm = cc.sequence([mmm1, mmm2, mmm3]);
            if (prev_part) {
                var com = prev_part.getComponent("decorative_part");
                com.invalid_hit_move();
                prev_part.runAction(seq_mmm);
            }
            
        }.bind(this), this);
    
        var func2 = cc.callFunc(function() {
            this.game_mode = 1;
            this.new_part_set(this.header_set);
            this.part_now_index = 0;
            var now_part = this.part_set[this.part_now_index];    
            
            var mm1 = cc.moveBy(time, 0, 279);
            var mm2 = cc.moveBy(time, 437, 0);
            var mm3 = cc.moveBy(time, 0, -218);
            var seq2 = cc.sequence([mm1, mm2, mm3]); 
            var com = now_part.getComponent("decorative_part");
            com.invalid_hit_move();
            now_part.runAction(seq2);
            this.select_item = now_part;
            
        }.bind(this), this);
        
        var end_func = cc.callFunc(function(){
            this.lock_move_back = false;
            var com = this.select_item.getComponent("decorative_part");
            com.valid_hit_move();
        }.bind(this), this);
        
        var m1 = cc.moveBy(time, 0, 218);
        var m2 = cc.moveBy(time, -437, 0);
        var m3 = cc.moveBy(time, 0, -279);
        var m4 = cc.moveBy(time, 0, 279);
        var m5 = cc.moveBy(time, 437, 0);
        var m6 = cc.moveBy(time, 0, -218);
        
        var seq = cc.sequence([func, m1, m2, m3, func2, m4, m5, m6, end_func]);
        this.left_worker.runAction(seq);
    },
    
    move_part_back: function() {
        if(this.lock_move_back === true) {
            return;
        }
        
        var time = 0.5 * 1.5;
        // var prev_part = this.part_set[this.part_now_index];
        var prev_part = this.select_item;
        
        this.part_now_index ++;
        this.lock_move_back = true;
        if(this.part_now_index >= this.part_set.length) {
            this.part_now_index = 0;
        }
        var now_part = this.part_set[this.part_now_index];
        
        this.play_sound("resources/sounds/bones_in.mp3");
        var func = cc.callFunc(function() {
            var mmm1 = cc.moveBy(time, 0, 218);
            var mmm2 = cc.moveBy(time, -437, 0);
            var mmm3 = cc.moveBy(time, 0, -279);
            var seq_mmm = cc.sequence([mmm1, mmm2, mmm3]); 
            if(prev_part) {
                var com = prev_part.getComponent("decorative_part");
                com.invalid_hit_move();
                prev_part.runAction(seq_mmm);    
            }
        }.bind(this), this);
        
        var func2 = cc.callFunc(function() {
            this.play_sound("resources/sounds/bones_in.mp3");
            var mm1 = cc.moveBy(time, 0, 279);
            var mm2 = cc.moveBy(time, 437, 0);
            var mm3 = cc.moveBy(time, 0, -218);
            var seq2 = cc.sequence([mm1, mm2, mm3]); 
            var com = now_part.getComponent("decorative_part");
            com.invalid_hit_move();
            now_part.runAction(seq2);
        }.bind(this), this);
        
        var end_func = cc.callFunc(function(){
            this.lock_move_back = false;
            var com = now_part.getComponent("decorative_part");
            com.valid_hit_move();
            this.select_item = now_part;
        }.bind(this), this);
        
        var m1 = cc.moveBy(time, 0, 218);
        var m2 = cc.moveBy(time, -437, 0);
        var m3 = cc.moveBy(time, 0, -279);
        var m4 = cc.moveBy(time, 0, 279);
        var m5 = cc.moveBy(time, 437, 0);
        var m6 = cc.moveBy(time, 0, -218);
        
        var seq = cc.sequence([func, m1, m2, m3, func2, m4, m5, m6, end_func]);
        this.left_worker.runAction(seq);
    },
    
    enter_first_mode: function() {
        this.show_game_stage_tip(this.game_mode);
        // 将零件new出来
        this.new_part_set(this.header_set);
        // end
        this.select_part();
    },
    
    replace_item: function() {
        var item;
        if(this.hit_main_type === 1) { // 头
            item = cc.instantiate(this.header_set[this.hit_sub_type]);
            item.active = true;
            item.parent = this.man_root;
            item.x = this.part_pos[this.game_mode - 1].x;
            item.y = this.part_pos[this.game_mode - 1].y;    
            var com = item.getComponent("decorative_part");
            com.invalid_hit_move();
        }
        else if(this.hit_main_type === 2) {
            item = cc.instantiate(this.body_set[this.hit_sub_type]);
            item.active = true;
            item.parent = this.man_root;
            item.x = this.part_pos[this.game_mode - 1].x;
            item.y = this.part_pos[this.game_mode - 1].y;
            var com = item.getComponent("decorative_part");
            com.invalid_hit_move();
        }
        else if(this.hit_main_type === 3) {
            item = cc.instantiate(this.foot_set[this.hit_sub_type]);
            item.active = true;
            item.parent = this.man_root;
            item.x = this.part_pos[this.game_mode - 1].x;
            item.y = this.part_pos[this.game_mode - 1].y;
            var com = item.getComponent("decorative_part");
            com.invalid_hit_move();
        }
        else if(this.hit_main_type === 4) {
            item = cc.instantiate(this.left_hand_set[this.hit_sub_type]);
            item.active = true;
            item.parent = this.man_root;
            item.x = this.part_pos[this.game_mode - 1].x;
            item.y = this.part_pos[this.game_mode - 1].y;
            var com = item.getComponent("decorative_part");
            com.invalid_hit_move();
        }
        else if(this.hit_main_type === 5) {
            item = cc.instantiate(this.right_hand_set[this.hit_sub_type]);
            item.active = true;
            item.parent = this.man_root;
            item.x = this.part_pos[this.game_mode - 1].x;
            item.y = this.part_pos[this.game_mode - 1].y;
            var com = item.getComponent("decorative_part");
            com.invalid_hit_move();
        }
    },
    
    destroy_machine_man: function() { // 0, 880, 0, 340
        console.log(this.lock_move_back);
        console.log(this.lock_destroy);
        console.log(this.game_mode);
        
        if((this.lock_move_back && this.game_mode < 6) || this.lock_destroy || this.game_mode <= 1) {
            return;
        }
        
        this.lock_destroy = true;
        if(this.select_item) {
            this.select_item.getComponent("decorative_part").invalid_hit_move();    
        }
        this.top_worker.y = 1180;
        
        var m = cc.moveBy(1, 0, -840);
        var m2 = cc.moveBy(1, 0, 840);
        
        var func = cc.callFunc(function(){
            var mm = cc.moveBy(1, 0, 840);
            this.man_root.runAction(mm);
        }.bind(this), this);
        
        var end_func = cc.callFunc(function() {
            this.man_root.x = 0;
            this.man_root.y = 0;
            this.man_root.removeAllChildren();
            this.top_worker.y = 1180;
            this.lock_destroy = false; 
            // this.game_start = false;
            // this.on_start_game();
            // this.game_mode = 0;
            // this.goto_next_part();
            // this.move_part_back();
            this.move_part_back_when_destroy();
        }.bind(this), this);
        var seq = cc.sequence([m, func, m2, end_func]);
        this.top_worker.runAction(seq);
    },
    
    goto_next_part: function() {
        this.parts.removeAllChildren();
        this.game_mode ++;
        if(this.game_mode > 5) { // 跳表情
            var index = 1 + Math.random() * 9;
            index = Math.floor(index);
            if(index > 9) {
                index = 9;
            }
            this.play_sound_loop("resources/sounds/man_voice.mp3");
            var item = new cc.Node();
            var url = cc.url.raw("resources/texture/game_scene/face" + index + ".png");
            var s = item.addComponent(cc.Sprite);
            s.spriteFrame = new cc.SpriteFrame(url);
            
            item.parent = this.man_root;
            item.x = 0;
            item.y = this.face_y;
            
            item.opacity = 0;
            item.runAction(cc.fadeIn(0.5));
            
            return;
        }
        
        this.show_game_stage_tip(this.game_mode);
        if(this.game_mode === 1) {
            this.new_part_set(this.header_set);
        }
        else if(this.game_mode === 2) {
            this.new_part_set(this.body_set);
        }
        else if(this.game_mode === 3) {
            this.new_part_set(this.foot_set);
        }
        else if(this.game_mode === 4) {
            this.new_part_set(this.left_hand_set);
        }
        else if(this.game_mode === 5) {
            this.new_part_set(this.right_hand_set);
        }
        this.select_part();
    },
    
    enter_next_mode: function() {
        if(this.hit_item != null) {
            this.replace_item();
            this.select_item = null;
        }
        
        if(this.game_mode === 1) { // 不用播放焊接动画
            this.play_sound("resources/sounds/3head.mp3");
            this.scheduleOnce(function() {
                this.goto_next_part();
            }.bind(this), 3);
            return;
        }
        
        
        // play 动画
        var old_pos = cc.p(this.right_worker.x, this.right_worker.y);
        var pos = this.part_pos[this.game_mode - 1];
        if (this.game_mode === 2) {
            pos = this.part_pos[0];
        }
        
        var w_pos = this.man_root.convertToWorldSpaceAR(pos);
        pos = this.node.convertToNodeSpaceAR(w_pos);
        var m1 = cc.moveTo(1, pos);
        
        var func2 = cc.callFunc(function() {
            this.play_sound("resources/sounds/hanjie.mp3");
            var part = this.right_worker.getChildByName("hanjie").getComponent(cc.ParticleSystem);
            part.stopSystem();
            part.resetSystem();
        }.bind(this), this);
        
        var m2 = cc.moveTo(1, old_pos);
        var func = cc.callFunc(function() {
            this.goto_next_part();
        }.bind(this), this);
        // end 
        
        var func3 = cc.callFunc(function() {
            switch(this.game_mode) {
                case 1:
                    this.play_sound("resources/sounds/3head.mp3");
                break;
                case 2:
                    this.play_sound("resources/sounds/2body.mp3");    
                break;
                case 3:
                    this.play_sound("resources/sounds/6tui.mp3");
                break;
                case 4:
                    this.play_sound("resources/sounds/1arm.mp3");
                break;
                case 5:
                    this.play_sound("resources/sounds/1arm.mp3");
                break;
            }
        }.bind(this), this);
        var seq = cc.sequence([m1, func2, cc.delayTime(1), m2, func3, cc.delayTime(3), func]);
        this.right_worker.runAction(seq);
    },
    
    hit_machine_man_part: function(item, w_pos, main_type, sub_type) {
        var dst_pos = this.part_pos[this.game_mode - 1];
        var w_dst_pos = this.man_root.convertToWorldSpaceAR(dst_pos);
        
        if (cc.pDistance(w_pos, w_dst_pos) <= 120) {
            this.lock_move_back = true;
            item.on_hit_item(0.2, w_dst_pos);
            item.invalid_hit_move();
            this.hit_item = item;
            this.hit_main_type = main_type;
            this.hit_sub_type = sub_type;
        }
    }, 
    
    checkout_game: function() {
        if(this.game_start === false || this.game_mode <= 5) {
            return;
        }
        
        this.play_sound("resources/sounds/end.mp3");
        var check_root = cc.find("UI_ROOT/check_out_root");
        check_root.active = true;
        this.game_start = false;
    },
    
    
    on_replay_game: function() {
        var check_root = cc.find("UI_ROOT/check_out_root");
        check_root.active = false;
        this.on_start_game();
    }, 
    
    on_kim_click: function() {
        if(this.lock_kim_click === true) {
            return;
        }
        this.play_kim_click_anim_with_random();
    }
});
