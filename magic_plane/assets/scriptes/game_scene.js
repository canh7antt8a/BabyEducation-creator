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
        bones_prefab: cc.Prefab,
        bonus_move_time: 2,
        
        main_car_prefabs: {
            default: [],
            type: cc.Prefab,
        },
        
        front_car_prefabs: {
            default: [],
            type: cc.Prefab,
        },
        
        back_car_prefabs: {
            default: [],
            type: cc.Prefab,
        },
        
        wheel_car_prefabs: {
            default: [],
            type: cc.Prefab,
        },
        
        decro_prfabs: {
            default:[],
            type: decro_prefab_set
        }
    },
    
    play_click_anim: function() {
        this.ske_com.clearTracks();
        this.ske_com.setAnimation(0, "clk", false);
        this.ske_com.addAnimation(0, "idle", true);
    }, 
    
    play_right_anim: function() {
        this.ske_com.clearTracks();
        this.ske_com.setAnimation(0, "happy", false);
        this.ske_com.addAnimation(0, "idle", true);
    },
    
    // use this for initialization
    onLoad: function () {
        this.game_start = false;
        this.factory_ok = cc.find("UI_ROOT/anchor-center/factory_ok");
        this.factory_ok.active = false;
        this.output_mode = false;
        this.factory_ok_start_pos = this.factory_ok.getPosition();
        
        this.magic_car = cc.find("UI_ROOT/anchor-center/car_root");
        this.magic_car_body = cc.find("UI_ROOT/anchor-center/car_root/car_body");
        this.magic_car_wheel = cc.find("UI_ROOT/anchor-center/car_root/car_wheel");
        this.magic_car_sub = cc.find("UI_ROOT/anchor-center/car_root/car_cb");
        this.magic_car_under = cc.find("UI_ROOT/anchor-center/car_under");
        
        this.magic_car_start_pos = this.magic_car.getPosition(); 
        this.car_parts = cc.find("UI_ROOT/anchor-center/car_parts");
        this.car_parts_start_pos = this.car_parts.getPosition();
        
        this.game_mode = 0;
        this.car_part = null;
        this.main_car_part = null;
        this.front_car_part = null;
        this.back_car_part = null;
        
        this.next_button = cc.find("UI_ROOT/anchor-bottom/next_button");
        this.on_start_game();
        
        this.now_tip_main_type = -1;
        this.tip_type_root = cc.find("UI_ROOT/anchor-center/tip_type_root");
        this.ske_com = cc.find("UI_ROOT/anchor-center/kim").getComponent(sp.Skeleton);
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
    
    on_start_game: function() {
        if(this.game_start === true) {
            return;
        }

        this.play_sound("resources/sounds/bones_in.mp3");
        
        this.game_start = true;
        this.factory_ok.active = false;
        this.magic_car_body.removeAllChildren();
        this.magic_car_wheel.removeAllChildren();
        this.magic_car_sub.removeAllChildren();
        this.car_parts.removeAllChildren();
        this.magic_car_under.removeAllChildren();
        
        this.next_button.active = false;
        
        var bones = cc.instantiate(this.bones_prefab);
        // this.magic_car.addChild(bones);
        this.magic_car_body.addChild(bones);
        bones.active = true;
        this.car_part = null;
        this.lock_enter_next_mode = true;  
        this.call_latter(this.enter_main_car_model.bind(this), this.bonus_move_time);
    },
    
    remove_decor_from_hit_set: function(decorative_com) {
        // 计算是否已经在hit_set表里面
        var index;
        for(index = 0; index < this.hit_set.length; index ++) {
            if (this.hit_set[index][3] == decorative_com.node) { // 这个零件已经在这个表里面了
                this.hit_set[index][3] = null;
                
                if(this.game_mode >= 3) {
                    this.hit_set[index][4].removeFromParent();
                    this.hit_set[index][4] = null;    
                }
                
                return;
            }
        }
        // end 
    }, 
    
    hide_game_tip_object: function(main_type, sub_type) {
        if (this.game_mode < 3) {
            return;
        } 
        
        var index;
        for(index = 0; index < this.hit_set.length; index++) {
            if(this.hit_set[index][0] == main_type && this.hit_set[index][3] !== null) { // 这里绘制提示
                this.hit_set[index][3].active = true;
                if (this.game_mode >= 3 && this.hit_set[index][4] != null) {
                    this.hit_set[index][4].active = true;
                }
            }
        }
        
        this.tip_type_root.removeAllChildren();
        this.now_tip_main_type = 0;
    }, 
    
    hide_game_tip_car_part: function() {
        this.tip_type_root.removeAllChildren();
        this.now_tip_main_type = 0;
        if (this.car_part !== null) {
            this.car_part.active = true;
        }
    },
    
    show_game_tip_car_part: function(sub_type, w_pos) {
        if(this.car_part) {
            this.car_part.active = false;
        }
        
        if(this.game_mode == 1) { // 车体
            if(sub_type != this.now_tip_main_type) {
                var main_car = cc.instantiate(this.main_car_prefabs[sub_type - 1]);
                this.tip_type_root.addChild(main_car);
                var pos = this.tip_type_root.convertToNodeSpace(w_pos);
                this.now_tip_main_type = sub_type;
                main_car.active = true;
                main_car.x = pos.x;
                main_car.y = pos.y;
                main_car.scale = 1.0;
                main_car.opacity = 128;
            }
        }
        else if(this.game_mode == 2) { // 车头
            if(sub_type != this.now_tip_main_type) {
                var front_car = cc.instantiate(this.front_car_prefabs[sub_type - 1]);
                this.tip_type_root.addChild(front_car);
                var pos = this.tip_type_root.convertToNodeSpace(w_pos);
                this.now_tip_main_type = sub_type;
                front_car.active = true;
                front_car.x = pos.x;
                front_car.y = pos.y;
                front_car.scale = 1.0;
                front_car.opacity = 128;
            }
        }
        else if(this.game_mode == 3) { // 车尾
            if(sub_type != this.now_tip_main_type) {
                var back_car = cc.instantiate(this.back_car_prefabs[sub_type - 1]);
                this.tip_type_root.addChild(back_car);
                var pos = this.tip_type_root.convertToNodeSpace(w_pos);
                this.now_tip_main_type = sub_type;
                back_car.active = true;
                back_car.x = pos.x;
                back_car.y = pos.y;
                back_car.scale = 1.0;
                back_car.opacity = 128;
            }
        }
    }, 
    
    
    hit_car_part: function(decorative_com, w_pos, main_type, sub_type) {
        var time = 0.01;
        var index;
        var enter_next_mode = true;
        var hit_test = false;
        
        // 计算是否已经在hit_set表里面
        for(index = 0; index < this.hit_set.length; index ++) {
            if (this.hit_set[index][3] == decorative_com.node) { // 这个零件已经在这个表里面了
                if(this.game_mode === 3) {
                    this.next_button.active = false;
                }
                return;
            }
        }
        // end 
        
        /*// 绘制提示
        if (this.game_mode > 3 && this.now_tip_main_type != main_type) {
            this.tip_type_root.removeAllChildren();
            this.now_tip_main_type = main_type;
            for(index = 0; index < this.hit_set.length; index++) {
                if(this.hit_set[index][0] == main_type) { // 这里绘制提示
                    var world_pos = this.hit_set[index][2];
                    var new_node = cc.instantiate(this.decro_prfabs[main_type - 1].sub_set[sub_type - 1]);
                    this.tip_type_root.addChild(new_node);
                    var pos = this.tip_type_root.convertToNodeSpace(world_pos);
                    new_node.x = pos.x;
                    new_node.y = pos.y;
                    new_node.opacity = 128;
                    new_node.active = true;
                    new_node.scale = 1.0;
                    
                    if(this.hit_set[index][3] !== null) {
                        this.hit_set[index][3].active = false;
                    }
                }
            }
        }
        // end */
        
        // 绘制提示, [main_type, sub_type, w_pos, null, null, w_pos2];
        // if (this.game_mode === 3 && this.now_tip_main_type != main_type) {
        if (this.game_mode >= 3 && this.now_tip_main_type != main_type) {
            this.tip_type_root.removeAllChildren();
            this.now_tip_main_type = main_type;
            for(index = 0; index < this.hit_set.length; index++) {
                if(this.hit_set[index][0] == main_type) { // 这里绘制提示
                    var world_pos = this.hit_set[index][2];
                    var new_node = cc.instantiate(this.decro_prfabs[main_type - 1].sub_set[sub_type - 1]);
                    this.tip_type_root.addChild(new_node);
                    var pos = this.tip_type_root.convertToNodeSpace(world_pos);
                    new_node.x = pos.x;
                    new_node.y = pos.y;
                    new_node.opacity = 128;
                    new_node.active = true;
                    new_node.scale = 1.0;
                    
                    
                    world_pos = this.hit_set[index][5];
                    new_node = cc.instantiate(this.decro_prfabs[main_type].sub_set[sub_type - 1]);
                    this.tip_type_root.addChild(new_node);
                    pos = this.tip_type_root.convertToNodeSpace(world_pos);
                    new_node.x = pos.x;
                    new_node.y = pos.y;
                    new_node.opacity = 128;
                    new_node.active = true;
                    new_node.scale = 1.0;
                    
                    if(this.hit_set[index][3] !== null) {
                        this.hit_set[index][3].active = false;
                    }
                    
                    if (this.hit_set[index][4] !== null) {
                        this.hit_set[index][4].active = false;
                    }
                }
            }
        }
        // end 
        
        for(index = 0; index < this.hit_set.length; index ++) {
            // [main_type, sub_type, w_pos, now_object];
            // var main_type = this.hit_set[index][0];
            // var sub_type = this.hit_set[index][1];
            var world_pos = this.hit_set[index][2];
            var now_obj = this.hit_set[index][3];
            var sub_obj = null;
            var sub_w_pos = null
            if(this.game_mode === 3) {
                sub_obj = this.hit_set[index][4];
                sub_w_pos = this.hit_set[index][5];
            }
            
            if (hit_test === false && this.hit_set[index][0] == main_type && cc.pDistance(w_pos, world_pos) < 30) { // hit
                if(now_obj) {
                    var comp = now_obj.getComponent("decorative_part");
                    now_obj.active = true;
                    time = comp.move_back();
                }
                this.play_sound("resources/sounds/ping_ok.mp3");
                decorative_com.on_hit_item(time, world_pos);
                
                if(sub_obj !== null) { // 删除原来在这里的
                    sub_obj.removeFromParent();
                }
                
                // 绘制另一个翅膀
                if(this.game_mode >= 3) {
                    sub_obj = cc.instantiate(this.decro_prfabs[main_type].sub_set[sub_type - 1]);
                    this.magic_car_sub.addChild(sub_obj);
                    this.hit_set[index][4] = sub_obj;
                    var sub_pos = this.magic_car_sub.convertToNodeSpaceAR(this.hit_set[index][5]);
                    sub_obj.x = sub_pos.x;
                    sub_obj.y = sub_pos.y;
                }
                // end 
                this.hit_set[index][3] = decorative_com.node;
                this.hit_set[index][1] = decorative_com.sub_type;
                
                hit_test = true;
            }
            else {
                if(now_obj === null) {
                    enter_next_mode = false;
                }
            }
        }
        
        
        if(enter_next_mode) { // 进入下一个模式
            this.lock_enter_next_mode = false;
            if(this.game_mode === 3) {
                this.next_button.active = true;
            }
        }
        else {
            if(this.game_mode === 3) {
                this.next_button.active = false;
            }
        }
    }, 
    
    change_car_part: function(car_main, sub_type, main_type) {
        var time = 0.01;
        if(this.car_part) {
            var comp = this.car_part.getComponent("car_part");
            comp.node.active = true;
            time = comp.move_back();
            this.car_part = null;
        }
        this.play_sound("resources/sounds/ping_ok.mp3");
        this.lock_enter_next_mode = false; // 可以进入下一个环节
        this.next_button.active = true;
        this.car_part = car_main;
        this.car_part_type = sub_type;
        return time;
    }, 
    // 进入组装主提模式
    enter_main_car_model: function() {
        this.game_mode = 1;
        this.lock_enter_next_mode = true;
        this.play_sound("resources/sounds/make.mp3");
        
        this.car_parts.removeAllChildren();
        
        var start_x = (this.game_mode) * 1920; 
        var num = this.main_car_prefabs.length + 1;
        var delta = 1920 / num;
        var ypos = 40;
        var xpos = start_x + delta;
        for(var i = 0; i < this.main_car_prefabs.length; i ++) {
            var main_car = cc.instantiate(this.main_car_prefabs[i]);
            this.car_parts.addChild(main_car);
            var main_car_com = main_car.getComponent("car_part");
            main_car_com.set_start_pos(xpos, ypos);
            xpos = xpos + delta;
            main_car.active = true;
        }
        var move = cc.moveBy(1.6, -1920, 0);
        this.car_parts.runAction(move);
    },
    
    get_front_car_pos_set: function(main_car) {
        this.front_pos_set = [];
        
        for(var i = 0; i < this.front_car_prefabs.length; i++ ) {
            var name = "front" + (i + 1);
            var node = main_car.getChildByName(name);
            var w_pos = node.convertToWorldSpaceAR(cc.p(0, 0));
            var pos = this.magic_car.convertToNodeSpace(w_pos);
            this.front_pos_set.push(pos);
        }
    }, 
    
    get_back_car_pos_set: function(main_car) {
        this.back_pos_set = [];
        for(var i = 0; i < this.back_car_prefabs.length; i++ ) {
            var name = "back" + (i + 1);
            var node = main_car.getChildByName(name);
            var w_pos = node.convertToWorldSpaceAR(cc.p(0, 0));
            var pos = this.magic_car.convertToNodeSpace(w_pos);
            this.back_pos_set.push(pos);
        }
    }, 
    
    // 进入组装车头模式
    enter_car_front_mode: function() {

        // 更换父亲节点
        var w_pos = this.car_parts.convertToWorldSpace(this.car_part.getPosition());
        var comp = this.car_part.getComponent("car_part");
        var main_car = cc.instantiate(this.main_car_prefabs[this.car_part_type - 1]);
        this.magic_car_body.addChild(main_car);
        var pos = this.magic_car_body.convertToNodeSpace(w_pos);
        this.car_part.removeFromParent();
        main_car.active = true;
        main_car.x = pos.x;
        main_car.y = pos.y;
        main_car.scale = 1.0;
        this.car_part = null;
        this.main_car_part = main_car;
        this.get_front_car_pos_set(main_car);
        comp = main_car.getComponent("car_part");
        comp.invalid_hit_move();
        // end
        
        this.game_mode = 2;
        this.lock_enter_next_mode = true;
        
        var start_x = (this.game_mode) * 1920; 
        var num = this.front_car_prefabs.length + 1;
        var delta = 1920 / num;
        var ypos = 40;
        var xpos = start_x + delta;
        for(var i = 0; i < this.front_car_prefabs.length; i ++) {
            var front_car = cc.instantiate(this.front_car_prefabs[i]);
            this.car_parts.addChild(front_car);
            var front_car_com = front_car.getComponent("car_part");
            front_car_com.set_start_pos(xpos, ypos);
            front_car_com.dst_pos = this.front_pos_set[i];
            front_car.active = true;
            xpos = xpos + delta;
        }
        var move = cc.moveBy(1.6, -1920, 0);
        this.car_parts.runAction(move);
    },
    // end 
    
    // [main_type, sub_type, w_pos, now_object, noter_object, w_pos2]
    computer_hit_pos_LE: function(now_main_type) {
        this.hit_set = [];
        var index;
        
        // front, this.front_car_part decorative_item
        if (this.front_car_part !== null) {
            var front_car_com = this.front_car_part.getComponent("car_part");
            for(index = 0; index < front_car_com.decorative_item.length; index ++) {
                var main_type = front_car_com.decorative_item[index].main_type;
                if (main_type > now_main_type) {
                    continue;
                }
                var sub_type = 0;
                var w_pos = this.front_car_part.convertToWorldSpaceAR(cc.p(front_car_com.decorative_item[index].xpos, front_car_com.decorative_item[index].ypos));
                var w_pos2 = this.front_car_part.convertToWorldSpaceAR(cc.p(front_car_com.decorative_item[index + 1].xpos, front_car_com.decorative_item[index + 1].ypos));
                var a_set = [main_type, sub_type, w_pos, null, null, w_pos2];
                this.hit_set.push(a_set);
            }
            
        }
        // end
        
        // back, this.back_car_part
        if (this.back_car_part !== null) {
            var back_car_com = this.back_car_part.getComponent("car_part");
            for(index = 0; index < back_car_com.decorative_item.length; index ++) {
                var main_type = back_car_com.decorative_item[index].main_type;
                if (main_type > now_main_type) {
                    continue;
                }
                var sub_type = 0;
                var w_pos = this.back_car_part.convertToWorldSpaceAR(cc.p(back_car_com.decorative_item[index].xpos, back_car_com.decorative_item[index].ypos));
                var w_pos2 = this.back_car_part.convertToWorldSpaceAR(cc.p(back_car_com.decorative_item[index + 1].xpos, back_car_com.decorative_item[index + 1].ypos));
                var a_set = [main_type, sub_type, w_pos, null, null, w_pos2];
                this.hit_set.push(a_set);
            }
            
        }
        // end
        
        
        // main, this.main_car_part
        if (this.main_car_part !== null) {
            var main_car_com = this.main_car_part.getComponent("car_part");
            for(index = 0; index < main_car_com.decorative_item.length; index ++) {
                var main_type = main_car_com.decorative_item[index].main_type;
                if (main_type > now_main_type) {
                    continue;
                }
                var sub_type = 0;
                var w_pos = this.main_car_part.convertToWorldSpaceAR(cc.p(main_car_com.decorative_item[index].xpos, main_car_com.decorative_item[index].ypos));
                var w_pos2 = this.main_car_part.convertToWorldSpaceAR(cc.p(main_car_com.decorative_item[index + 1].xpos, main_car_com.decorative_item[index + 1].ypos));
                var a_set = [main_type, sub_type, w_pos, null, null, w_pos2];
                this.hit_set.push(a_set);
            }    
        }
        // end 
        
    },
    
    computer_hit_pos_more_type: function(now_main_type) {
        this.hit_set = [];
        var index;
        
        // front, this.front_car_part decorative_item
        if (this.front_car_part !== null) {
            var front_car_com = this.front_car_part.getComponent("car_part");
            for(index = 0; index < front_car_com.decorative_item.length; index ++) {
                var main_type = front_car_com.decorative_item[index].main_type;
                if (main_type !== now_main_type) {
                    continue;
                }
                var sub_type = 0;
                var w_pos = this.front_car_part.convertToWorldSpaceAR(cc.p(front_car_com.decorative_item[index].xpos, front_car_com.decorative_item[index].ypos));
                var w_pos2 = this.front_car_part.convertToWorldSpaceAR(cc.p(front_car_com.decorative_item[index + 1].xpos, front_car_com.decorative_item[index + 1].ypos));
                var a_set = [main_type, sub_type, w_pos, null, null, w_pos2];
                this.hit_set.push(a_set);
            }    
        }
        // end
        
        // back, this.back_car_part
        if (this.back_car_part !== null) {
            var back_car_com = this.back_car_part.getComponent("car_part");
            for(index = 0; index < back_car_com.decorative_item.length; index ++) {
                var main_type = back_car_com.decorative_item[index].main_type;
                if (main_type !== now_main_type) {
                    continue;
                }
                var sub_type = 0;
                var w_pos = this.back_car_part.convertToWorldSpaceAR(cc.p(back_car_com.decorative_item[index].xpos, back_car_com.decorative_item[index].ypos));
                var w_pos2 = this.back_car_part.convertToWorldSpaceAR(cc.p(back_car_com.decorative_item[index + 1].xpos, back_car_com.decorative_item[index + 1].ypos));
                var a_set = [main_type, sub_type, w_pos, null, null, w_pos2];
                this.hit_set.push(a_set);
            }    
        }
        // end 
        
        // main, this.main_car_part
        if(this.main_car_part !== null) {
            var main_car_com = this.main_car_part.getComponent("car_part");
            for(index = 0; index < main_car_com.decorative_item.length; index ++) {
                var main_type = main_car_com.decorative_item[index].main_type;
                if (main_type !== now_main_type) {
                    continue;
                }
                var sub_type = 0;
                var w_pos = this.main_car_part.convertToWorldSpaceAR(cc.p(main_car_com.decorative_item[index].xpos, main_car_com.decorative_item[index].ypos));
                var w_pos2 = this.main_car_part.convertToWorldSpaceAR(cc.p(main_car_com.decorative_item[index + 1].xpos, main_car_com.decorative_item[index + 1].ypos));
                var a_set = [main_type, sub_type, w_pos, null, null, w_pos2];
                this.hit_set.push(a_set);
            }    
        }
        // end 
        
    },
    
    get_all_decor_parts_num_more_than: function(main_type) {
        var index, j;
        var num = 0;
        for(index = main_type; index < this.decro_prfabs.length; index ++) {
            num = num + this.decro_prfabs[index].sub_set.length;
        }
        return num;
    }, 
    
    get_all_decor_parts_num_LE: function(main_type) {
        var index, j;
        var num = 0;
        for(index = 0; index < main_type; index ++) {
            num = num + this.decro_prfabs[index].sub_set.length;
        }
        return num;
    }, 

    on_out_factory_click: function() {
        if(this.output_mode) {
            return;
        }
        this.play_right_anim();
        this.factory_ok.getComponent("frame_anim").stop();
        this.output_mode = true;
        // 改变装饰的父亲节点
        for(var index = 0; index < this.hit_set.length; index ++) {
            var main_type = this.hit_set[index][0];
            var sub_type = this.hit_set[index][1];
            var node = this.hit_set[index][3];
            if (!node) {
                continue;
            }
            
            var w_pos = node.convertToWorldSpaceAR(cc.p(0, 0));
            this.hit_set[index][3] = null;
            
            var new_node = cc.instantiate(this.decro_prfabs[main_type - 1].sub_set[sub_type - 1]);
            new_node.active = true;
            this.magic_car_body.addChild(new_node);
            var pos = this.magic_car_body.convertToNodeSpace(w_pos);
            new_node.x = pos.x;
            new_node.y = pos.y;
            new_node.scale = 1;
            
            node.removeFromParent();
        }
        // end 
        
        // 车子开出去
        // var mby = cc.moveBy(3, 1920, 0);
        // this.magic_car.runAction(mby);
        var m1 = cc.moveBy(0.1, 0, -4);
        var m2 = cc.moveBy(0.1, 0, 4);
        var body_actions = [];
        for(var i = 0; i < 8; i ++) {
            body_actions.push(m1.clone());
            body_actions.push(m2.clone());
        }
        // body_actions.push(cc.moveTo(0.05, 0, 0));
        body_actions.push(cc.moveTo(0.05, 0, 102));
        var c1 = cc.callFunc(function() {
            var mby = cc.moveBy(3, 1920, 0);
            this.magic_car.runAction(mby);
        }.bind(this), this);
        body_actions.push(c1);
        
        var seq = cc.sequence(body_actions);
        // this.magic_car_body.runAction(seq);
        this.magic_car.runAction(seq);
        
        for(var i = 0; i < this.wheel_set.length; i ++) {
            var wheel = this.wheel_set[i];
            var rot = cc.rotateBy(0.5, 360);
            var f = cc.repeatForever(rot);
            wheel.runAction(f);
        }
        // end 
        
        // 零件拖走
        var move = cc.moveBy(1.6, -1920, 0);
        this.car_parts.runAction(move);
        this.magic_car_under.runAction(move.clone());
        
        this.factory_ok.runAction(move.clone());
        // end 
        this.play_sound("resources/sounds/go_auto.mp3");
        // 游戏开始
        this.call_latter(function() {
            this.magic_car_body.removeAllChildren();
            this.magic_car_wheel.removeAllChildren();
            this.car_parts.removeAllChildren();
            
            this.magic_car.x = this.magic_car_start_pos.x;
            this.magic_car.y = this.magic_car_start_pos.y;
            
            this.car_parts.x = this.car_parts_start_pos.x;
            this.car_parts.y = this.car_parts_start_pos.y;
            
            this.magic_car_under.x = this.car_parts_start_pos.x;
            this.magic_car_under.y = this.car_parts_start_pos.y;
            
            this.factory_ok.x = this.factory_ok_start_pos.x;
            this.factory_ok.y = this.factory_ok_start_pos.y;
            
            this.output_mode = false;
            this.game_start = false;
            this.on_start_game();
            
        }.bind(this), 5);
        // end 
    }, 
    
    // 进入装饰组装模式
    enter_decor_mode: function() {
        var index;
        this.wheel_set = [];

        
         // 改变装饰的父亲节点
        for(var index = 0; index < this.hit_set.length; index ++) {
            var main_type = this.hit_set[index][0];
            var sub_type = this.hit_set[index][1];
            var node = this.hit_set[index][3];
            if (!node) {
                continue;
            }
            
            var w_pos = node.convertToWorldSpaceAR(cc.p(0, 0));
            this.hit_set[index][3] = null;
            
            var new_node = cc.instantiate(this.decro_prfabs[main_type - 1].sub_set[sub_type - 1]);
            new_node.active = true;
            this.magic_car_body.addChild(new_node);
            var pos = this.magic_car_body.convertToNodeSpace(w_pos);
            new_node.x = pos.x;
            new_node.y = pos.y;
            new_node.scale = 1;
            new_node.getComponent("decorative_part").invalid_hit_move();
            node.removeFromParent();
        }
        // end 
        
        this.computer_hit_pos_more_type(3);
        
        this.game_mode = 4;
        this.lock_enter_next_mode = true;
        
        var num = this.get_all_decor_parts_num_more_than(2);
        console.log("" + num);
        num = Math.floor(num * 0.5);
        var start_x = (this.game_mode) * 1920; 
        // var start_x = 1920;
        var delta = 1920 / (num + 1);
        var ypos = 40;
        var xpos = start_x + delta;
        
        // for (var j = 2; j < this.decro_prfabs.length; j ++) {
        for (var j = 2; j < 3; j ++) {
            for(var i = 0; i < this.decro_prfabs[j].sub_set.length; i ++) {
                var prefab = this.decro_prfabs[j].sub_set[i];
                var decor = cc.instantiate(prefab);
                decor.active = true;
                // this.magic_car_under.addChild(decor);
                this.car_parts.addChild(decor);
                var decor_com = decor.getComponent("decorative_part");
                var size = decor.getContentSize();
                var w = size.width * 0.5 * decor.scale;
                var h = size.height * 0.5 * decor.scale;
                var dx = (decor.anchorX - 0.5) * w;
                var dy = (decor.anchorY - 0.5) * h;
                decor_com.set_start_pos(xpos + dx, ypos + dy - 20);
                xpos = xpos + delta;
            }
        }
        
        var move = cc.moveBy(1.6, -1920, 0);
        this.car_parts.runAction(move);
        this.magic_car_under.runAction(move.clone());
        
        // 显示开出汽车的按钮
        this.factory_ok.active = true;
        move = cc.moveBy(0.5, 335, 0);
        var func = cc.callFunc(function(){
            this.play_sound("resources/sounds/ready.mp3");
        }.bind(this), this);
        
        var func2 = cc.callFunc(function(){
            this.factory_ok.getComponent("frame_anim").play();
        }.bind(this), this);
        var seq = cc.sequence([move, func2, cc.delayTime(1), func]);
        this.factory_ok.runAction(seq);
        // end 
    },
    
    // 进入车轮组装模式
    enter_whell_mode: function() {
        /*
        // 更换父亲节点
        var w_pos = this.car_parts.convertToWorldSpace(this.car_part.getPosition());
        var comp = this.car_part.getComponent("car_part");
        var back_car = cc.instantiate(this.back_car_prefabs[this.car_part_type - 1]);
        this.magic_car_body.addChild(back_car);
        var pos = this.magic_car_body.convertToNodeSpace(w_pos);
        back_car.active = true;
        back_car.x = pos.x;
        back_car.y = pos.y;
        back_car.scale = 1.0;
        comp = back_car.getComponent("car_part");
        comp.invalid_hit_move();
        this.back_car_part = back_car;
        this.car_part.removeFromParent();
        this.car_part = null;
        // this.get_back_car_pos_set(this.main_car_part);
        // end    
        */
        // 更换父亲节点,删除掉了back car 部分,所以这里是front_car部分
        var w_pos = this.car_parts.convertToWorldSpace(this.car_part.getPosition());
        var comp = this.car_part.getComponent("car_part");
        var front_car = cc.instantiate(this.front_car_prefabs[this.car_part_type - 1]);
        this.magic_car_body.addChild(front_car);
        var pos = this.magic_car_body.convertToNodeSpace(w_pos);
        this.car_part.removeFromParent();
        front_car.active = true;
        front_car.x = pos.x;
        front_car.y = pos.y;
        front_car.scale = 1;
        
        comp = front_car.getComponent("car_part");
        comp.invalid_hit_move();
        
        this.front_car_part = front_car;
        this.car_part = null;
        // end 
        // 遍历所有的轮胎位置
        this.computer_hit_pos_LE(1);
        console.log(this.hit_set.length);
        // end 
        
        this.game_mode = 3;
        this.lock_enter_next_mode = true;
        
        var start_x = (this.game_mode) * 1920; 
        // var num = this.wheel_car_prefabs.length + 1;
        var num = this.get_all_decor_parts_num_LE(1) + 1;
        
        var delta = 1920 / num;
        var ypos = 40;
        var xpos = start_x + delta;
        
        for (var j = 0; j < 1; j ++) {
            for(var i = 0; i < this.decro_prfabs[j].sub_set.length; i ++) {
                var prefab = this.decro_prfabs[j].sub_set[i];
                var decor = cc.instantiate(prefab);
                decor.active = true;
                this.car_parts.addChild(decor);
                var decor_com = decor.getComponent("decorative_part");
                var size = decor.getContentSize();
                var w = size.width * 0.5 * decor.scale;
                var h = size.height * 0.5 * decor.scale;
                var dx = (decor.anchorX - 0.5) * w;
                var dy = (decor.anchorY - 0.5) * h;
                decor_com.set_start_pos(xpos + dx, ypos + dy + 40);
                xpos = xpos + delta;
            }
        }
        var move = cc.moveBy(1.6, -1920, 0);
        this.car_parts.runAction(move);
    },
    // 进入车尾组装模式
    enter_car_back_mode: function() {
        // 更换父亲节点
        var w_pos = this.car_parts.convertToWorldSpace(this.car_part.getPosition());
        var comp = this.car_part.getComponent("car_part");
        var front_car = cc.instantiate(this.front_car_prefabs[this.car_part_type - 1]);
        this.magic_car_body.addChild(front_car);
        var pos = this.magic_car_body.convertToNodeSpace(w_pos);
        this.car_part.removeFromParent();
        front_car.active = true;
        front_car.x = pos.x;
        front_car.y = pos.y;
        front_car.scale = 1;
        
        comp = front_car.getComponent("car_part");
        comp.invalid_hit_move();
        
        this.front_car_part = front_car;
        this.car_part = null;
        this.get_back_car_pos_set(this.main_car_part);
        // end    
        
        this.game_mode = 3;
        this.lock_enter_next_mode = true;
        
        var start_x = (this.game_mode) * 1920; 
        var num = this.back_car_prefabs.length + 1;
        var delta = 1920 / num;
        var ypos = 40;
        var xpos = start_x + delta;
        
        for(var i = 0; i < this.back_car_prefabs.length; i ++) {
            var back_car = cc.instantiate(this.back_car_prefabs[i]);
            back_car.active = true;
            
            this.car_parts.addChild(back_car);
            var back_car_com = back_car.getComponent("car_part");
            back_car_com.set_start_pos(xpos, ypos);
            back_car_com.dst_pos = this.back_pos_set[i];
            xpos = xpos + delta;
        }
        var move = cc.moveBy(1.6, -1920, 0);
        this.car_parts.runAction(move);
    }, 
    // end
    
    on_next_game_mode: function() {
        if(this.lock_enter_next_mode === true) {
            return;
        }
        
        this.play_sound("resources/sounds/move_parts.mp3");
        this.next_button.active = false;
        this.game_mode ++;
        if(this.game_mode == 2) { // 进入车头模式
            this.enter_car_front_mode();
        }
        else if(this.game_mode == 3) { // 进入车尾巴模式
            // this.enter_car_back_mode();
            this.enter_whell_mode(); // 直接进入装车轮的模式，飞机没有车尾的概念
        }
        else if(this.game_mode == 4) { // 进入装车轮模式
            this.enter_decor_mode();
        }
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {
    
    // },
});
