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
        prefab_elec_set: {
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
            "resources/sounds/tuoru.mp3",
            "resources/sounds/switch.mp3",
            "resources/sounds/dengliang.mp3",
            "resources/sounds/tongdian.mp3",
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

        this.start_x = 336; // 566
        this.start_y = 818; // 620
        
        this.step_x = 230; // 
        this.step_y = -198;
        
        
        this.hit_pos_set = [];
        
        var xpos = this.start_x;
        var ypos = this.start_y;
        
        for(var i = 0; i < 3; i ++) {
            for(var j = 0; j < 5; j ++) {
                this.hit_pos_set.push(cc.p(xpos, ypos));
                xpos += this.step_x;    
            }
            xpos = this.start_x;
            ypos += this.step_y;
        }
        
        this.elec_part_root = cc.find("UI_ROOT/anchor-center/elec_part_root");
        this.preload_sound();
        
        this.switch = cc.find("UI_ROOT/anchor-center/switch");
        this.switch.rotation = 45;
        
        this.checkout_root = cc.find("UI_ROOT/check_out_root");
        this.checkout_root.active = false;
        
        this.elec_part_new_root = cc.find("UI_ROOT/anchor-center/elec_part_new_root");
    },
    
    set_switch: function(is_off) {
        if(is_off) {
            this.switch.runAction(cc.rotateTo(0.2, 45));
        }
        else {
            this.switch.runAction(cc.rotateTo(0.2, -45));
        }
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
    
    start: function() {
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
    
    on_hit_test: function(item, elec_type, w_pos) {
        if(this.game_start === false) {
            return;
        }
        
        for(var i = 0; i < 15; i ++) {
            if(this.fix_map[i] === 1) { // 固定的
                continue;
            }
            
            if(cc.pDistance(w_pos, this.hit_pos_set[i]) < 30) {
                if(this.hit_item_set[i] !== null && this.hit_item_set[i] !== item) { // 删除掉原来的
                    this.hit_item_set[i].removeFromParent();
                    this.hit_item_set[i] = null;
                }
                
                var new_item = cc.instantiate(this.prefab_elec_set[elec_type - 1]);
                // new_item.parent = this.elec_part_root;
                new_item.parent = this.elec_part_new_root
                var pos = this.elec_part_new_root.convertToNodeSpace(w_pos);
                new_item.x = pos.x;
                new_item.y = pos.y;
                
                // 吸附
                this.play_sound("resources/sounds/tuoru.mp3");
                var m = cc.moveBy(0.05,  this.hit_pos_set[i].x - w_pos.x,  this.hit_pos_set[i].y - w_pos.y);
                new_item.runAction(m);
                this.hit_item_set[i] = new_item;
                // end 
                return true;
            }
        }
        return false;
    },
    
    on_check_out: function() {
        for(var i = 0; i < 15; i ++) {
            if(this.game_map[i] === -1 || this.game_map[i] === 9 || this.game_map[i] === 11) {
                continue;
            }
            if(this.hit_item_set[i] === null) {
                return false;
            }
            
            var com = this.hit_item_set[i].getComponent("elec_device");
            if(this.game_map[i] !== com.elec_type) { // 放的位置不等于。
                return false;
            }
        }    
        return true;
    }, 
    
    play_success_anim: function() {
        for(var i = 0; i < 15; i ++) {
            if(this.game_map[i] !== 11) {
                continue;
            }
            
            if(this.hit_item_set[i] === null) {
                return;
            }
            var com = this.hit_item_set[i].getComponent("elec_device");
            com.show_when_success();
        }
        
        this.scheduleOnce(function() {
            this.play_sound("resources/sounds/dengliang.mp3");
            this.play_part_success_anim();
        }.bind(this), 1);
        
        this.scheduleOnce(function() {
            this.play_sound("resources/sounds/end.mp3");
            this.checkout_root.active = true;
        }.bind(this), 3);
    },
    
    play_part_success_anim: function() {
        
        for(var i = 0; i < 15; i ++) {
            if(this.game_map[i] === -1 || this.game_map[i] === 11) {
                continue;
            }
            
            if(this.hit_item_set[i] === null) {
                return;
            }
            var com = this.hit_item_set[i].getComponent("elec_device");
            com.show_when_success();
        }
    },
    
    play_faild_anim: function() {
        for(var i = 0; i < 15; i ++) {
            if(this.game_map[i] !== 11) {
                continue;
            }
            
            var com = this.hit_item_set[i].getComponent("elec_device");
            com.show_anim_not_conneced();
        }
        
        this.scheduleOnce(function() {
            this.play_sound("resources/sounds/tongdian.mp3");
            this.set_switch(true);
        }.bind(this), 1);
    },
    
    on_check_click: function() {
        this.play_sound("resources/sounds/switch.mp3");
        this.set_switch(false);
        
        var ret = this.on_check_out();
        if(ret) { // 成功
            this.game_start = false;
            this.play_success_anim();
        }
        else { // 失败
            console.log("falied");
            this.play_faild_anim();
        }
    }, 
    
    on_start_game: function() {
        if(this.game_start === true) {
            return;
        }
        // this.play_sound("resources/sounds/bones_in.mp3");
        this.game_start = true;
        
        // 9电灯，11,固定的电源
        this.game_map = [
            -1, -1, 6, 1, 7,
            -1, 9, 8, -1, 2,
            -1, 5, 1, 1, 11,
        ];
        
        this.fix_map = [
            0, 0, 0, 0, 0,
            0, 1, 0, 0, 0,
            0, 0, 0, 0, 1,
        ];
        
        this.hit_item_set = [
            null, null, null, null, null,
            null, null, null, null, null,
            null, null, null, null, null,
        ];
        
        
        this.elec_part_root.removeAllChildren();
        this.elec_part_new_root.removeAllChildren();
        // place the fit part
        for(var i = 0; i < 15; i ++) {
            if(this.fix_map[i] === 0) {
                continue;
            }
            var type = this.game_map[i];
            var item = cc.instantiate(this.prefab_elec_set[type - 1]);
            item.parent = this.elec_part_root;
            var w_pos = this.hit_pos_set[i];
            var pos = this.elec_part_root.convertToNodeSpace(w_pos);
            item.x = pos.x;
            item.y = pos.y;
            item.getComponent("elec_device").invalid_touch();
            console.log(i);
            this.hit_item_set[i] = item;
        }
        // end
        
        // place two drag item
        var type_num = 6;
        var width = 1900 / type_num;
        // 
        var start_x = (0 - width * 0.5) - ((type_num * 0.5 - 1) * width);
        // end
        
        var item;
        var xpos;
        var ypos;
        xpos = start_x;
        ypos = -450;
        
        this.place_drag_type(6, xpos, ypos);
        xpos += width;
        
        this.place_drag_type(1, xpos, ypos);
        xpos += width;
        
        this.place_drag_type(7, xpos, ypos);
        xpos += width;
        
        this.place_drag_type(8, xpos, ypos);
        xpos += width;
        
        this.place_drag_type(2, xpos, ypos);
        xpos += width;
        
        this.place_drag_type(5, xpos, ypos);
        xpos += width;
        
        xpos += width;
    },
    
    place_drag_type: function(drag_type, xpos, ypos) {
        var item = cc.instantiate(this.prefab_elec_set[drag_type - 1]);
        item.parent = this.elec_part_root;
        item.x = xpos;
        item.y = ypos;
        var com = item.getComponent("elec_device");
        com.invalid_touch();
        
        item = cc.instantiate(this.prefab_elec_set[drag_type - 1]);
        item.parent = this.elec_part_root;
        item.x = xpos;
        item.y = ypos;
        com = item.getComponent("elec_device");
        com.set_start_pos(xpos, ypos);
        com.set_ui_drag(); // 它属于UI控制拖动不删除
    },
    
    checkout_game: function() {
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
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {
    
    // },
});
