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
        
        star_part: {
            default: [],
            type: cc.Node,
        }, 
        line_prefab: {
            default: null,
            type: cc.Prefab,
        }
    },
    
    show_rain_card: function() {
        cc.find("UI_ROOT/show_card_root").active = true;
        cc.find("UI_ROOT/anchor-center/card_button").active = true;
    },
    
    hide_rain_card: function() {
        cc.find("UI_ROOT/show_card_root").active = false;
    },

    on_checkout: function() {
        this.play_sound("resources/sounds/end.mp3");
        this.checkout_root.active = true;
        this.game_started = false;
        this.enable_touch = false;
    }, 
    

    preload_sound: function() {
        var sound_list = [
            "resources/sounds/kim_clk2.mp3",
            "resources/sounds/kim_clk1.mp3",
            "resources/sounds/button.mp3",
            "resources/sounds/end.mp3",
            "resources/sounds/connect.mp3",
        ];
        
        for(var i = 0; i < sound_list.length; i ++) {
            var url = cc.url.raw(sound_list[i]);
            cc.loader.loadRes(url, function() {});    
        }
    }, 
    
    scroll_to_back: function() {
        var desic_root = this.star_part[this.game_mode - 1].getChildByName("star_desic");
        desic_root.active = false;
            
        var call = cc.callFunc(function() {
            var part_root = this.star_part[this.game_mode - 1];
            part_root.runAction(cc.moveBy(0.5, 0, -140));
        }.bind(this), this);
        var m = cc.moveBy(2, 0, 1080);
        
        var seq = cc.sequence([call, cc.delayTime(0.5), m]);
        this.skr_root.runAction(seq);
        
        if(this.game_mode < 3) {
            this.call_latter(this.play_kim_magic.bind(this), 2.5);
            this.call_latter(this.enter_next_mode.bind(this), 3.5);    
        }
        else {
            this.call_latter(this.enter_next_mode.bind(this), 2.5);    
        }
    },
    
    scroll_to_sky: function() {
        var call2 = cc.callFunc(function() {
            var part_root = this.star_part[this.game_mode - 1];
            part_root.runAction(cc.moveBy(0.5, 0, 140));
        }.bind(this), this);
        var delay = cc.delayTime(0.5);
        
        var m = cc.moveBy(2, 0, -1080);
        var call = cc.callFunc(function() {
            this.tw.opacity = 0;
            this.tw.active = true;    
            this.tw.runAction(cc.fadeIn(2));
        }.bind(this), this);
        var seq = cc.sequence([m, call2, delay, call]);
        this.skr_root.runAction(seq);
        
        this.call_latter(function() {
            var sound_name = ["resources/sounds/tian_ge.mp3", "resources/sounds/tian_tu.mp3", "resources/sounds/kong_que.mp3"];
            this.play_sound(sound_name[this.game_mode - 1]);
            var part_root = this.star_part[this.game_mode - 1];
            var desic_root = part_root.getChildByName("star_desic");
            desic_root.active = true;
            desic_root.opacity = 0;
            desic_root.runAction(cc.fadeIn(0.5));
            
        }.bind(this), 4);
        
        this.call_latter(function() {
            var part_root = this.star_part[this.game_mode - 1];
            var desic_root = part_root.getChildByName("star_desic");
            part_root.runAction(cc.fadeOut(2));
        }.bind(this), 8);
        
        this.call_latter(this.scroll_to_back.bind(this), 10);
    },
    
    checkout_success: function() {
        this.enable_touch = false;
        /*
        this.tw.opacity = 0;
        this.tw.active = true;
        var call = cc.callFunc(this.scroll_to_sky.bind(this), this);
        var seq = cc.sequence([cc.fadeIn(2), call]);
        this.tw.runAction(seq);
        this.random_root.runAction(cc.fadeOut(2));
        */
        this.random_root.runAction(cc.fadeOut(2));
        this.call_latter(this.scroll_to_sky.bind(this), 2);
    },
    
    checkout_game: function() {
        if(this.connect_error) { // 连接接了错误
            return;
        }
        // console.log(this.game_map_connect);
        // console.log(this.game_map);
        for(var i = 0; i < this.game_map_connect.length; i ++) {
            if(this.game_map_connect[i] !== this.game_map[i]) {
                // console.log(i, this.game_map_connect[i], this.game_map[i]);
                return; 
            }
        }
        
        // 播放idel4
        this.play_kim_magic();
        this.call_latter(this.checkout_success.bind(this), 1);
        // end 
        return;
    },
    
    show_game_tip_anim: function() {
        if (this.enable_touch === false || this.game_tip_ended ) {
            return;
        }    
        
        var children = this.star_root.children;
        var index = 0;
        children[index].getComponent("game_tip").play_anim();
        
        this.scheduleOnce(this.show_game_tip_anim.bind(this), 3);
    }, 
    
    on_touch_move: function(event) {
        var w_pos = event.getLocation();
        var hit_elem = null;
        
        for(var i = 0; i < this.star_pos_set.length; i ++) {
            var data = this.star_pos_set[i];
            if(cc.pDistance(data[1], w_pos) <= 30) {
                hit_elem = data;
                break;
            }
        }
        
        if(this.first_point === null) {
            if (hit_elem) {
                this.first_point = hit_elem;
                this.game_tip_ended = true;
                // 以当前点位起点生成一条线
                this.cur_line = cc.instantiate(this.line_prefab);
                this.cur_line.parent = this.line_root;
                this.cur_line.getComponent("game_line").connect_vec(this.first_point[1], this.first_point[1]);
                this.play_sound("resources/sounds/connect.mp3");
                // end 
            }
            else {
                // console.log("not hit");
            }
            return;
        }
        else {
            if (hit_elem && hit_elem != this.first_point) {
                if(hit_elem[0] != -1 && this.first_point[0] != -1) {
                    if (this.cur_line) {
                        this.cur_line.getComponent("game_line").connect_vec(this.first_point[1], hit_elem[1]);
                        this.play_sound("resources/sounds/connect.mp3");
                        // first_point 行，hit_elem列联通
                        var line_index = this.first_point[0] * this.map_width;
                        this.game_map_connect[line_index + hit_elem[0]] = 1;
                        // end
                        
                        // hit_elem 行，first_point列联通
                        line_index = hit_elem[0] * this.map_width;
                        this.game_map_connect[line_index + this.first_point[0]] = 1;
                        // end    
                    }
                }
                else {
                    this.cur_line.getComponent("game_line").connect_vec(this.first_point[1], hit_elem[1]);
                    this.play_sound("resources/sounds/connect.mp3");
                    this.connect_error = true;
                }
                this.first_point = hit_elem; // 以当前点位起点生成一条线
                // 以当前点位起点生成一条线
                this.game_tip_ended = true;
                this.cur_line = cc.instantiate(this.line_prefab);
                this.cur_line.parent = this.line_root;
                this.cur_line.getComponent("game_line").connect_vec(this.first_point[1], this.first_point[1]);
                // end 
            }
            else {
                // console.log("yes it is");
                this.cur_line.getComponent("game_line").connect_vec(this.first_point[1], event.getLocation());
            }
        }
        
    },
    
    // use this for initialization
    onLoad: function () {
        this.auto_show_card = true;
        this.cur_line = null;
        
        this.ske_kim_com = cc.find("UI_ROOT/anchor-center/c_root/kim").getComponent(sp.Skeleton);
        this.preload_sound();
        this.checkout_root = cc.find("UI_ROOT/checkout_root");
        this.checkout_root.active = false;
        
        this.skr_root = cc.find("UI_ROOT/anchor-center/c_root");
        var touch_node = cc.find("UI_ROOT/anchor-center/c_root/draw_bk");
        touch_node.on(cc.Node.EventType.TOUCH_START, function(event){
            if(this.enable_touch === false) {
                return;
            }
            event.stopPropagation();
            this.first_point = null;
            this.cur_line = null;
            this.on_touch_move(event)
        }.bind(this));
        
        touch_node.on(cc.Node.EventType.TOUCH_END, function(event){
            if(this.enable_touch === false) {
                return;
            }
            
            this.first_point = null;
            if(this.cur_line !== null) {
                this.cur_line.removeFromParent();
                this.cur_line = null;
            }
            this.checkout_game();
        }.bind(this));
        
        touch_node.on(cc.Node.EventType.TOUCH_CANCEL, function(event){
            if(this.enable_touch === false) {
                return;
            }
            
            this.first_point = null;
            if(this.cur_line !== null) {
                this.cur_line.removeFromParent();
                this.cur_line = null;
            }
            this.checkout_game();
        }.bind(this));
        
        touch_node.on(cc.Node.EventType.TOUCH_MOVE, function(event){
            if(this.enable_touch === false) {
                return;
            }
            
            this.on_touch_move(event);
        }.bind(this));
    },
    
    play_sound: function(name) {
        var url_data = cc.url.raw(name);
        cc.audioEngine.stopMusic();
        cc.audioEngine.playMusic(url_data);
    },
    
    play_kim_magic: function() {
        var anim_name = "idle_4";
        var sound_name = "resources/sounds/kim_clk1.mp3";
        
        this.lock_kim_click = true;
        this.play_sound(sound_name);
        this.ske_kim_com.clearTracks();
        this.ske_kim_com.setAnimation(0, anim_name, false);
        this.ske_kim_com.addAnimation(0, "idle_1", true);
        
        this.call_latter(function() {
            this.lock_kim_click = false;
        }.bind(this), 2);
    },
    
    play_kim_clearup: function() {
        var anim_name = "idle_3";
        var sound_name = "resources/sounds/kim_clk2.mp3";
        
        this.lock_kim_click = true;
        this.play_sound(sound_name);
        this.ske_kim_com.clearTracks();
        this.ske_kim_com.setAnimation(0, anim_name, false);
        this.ske_kim_com.addAnimation(0, "idle_1", true);
        
        this.call_latter(function() {
            this.lock_kim_click = false;
        }.bind(this), 2);
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
    
    on_kim_click: function() {
        if(this.lock_kim_click === true || this.enable_touch === false ) {
            return;
        }
        
        this.call_latter(this.reset_game.bind(this), 1);
        this.play_kim_clearup();
    },
    
    show_random_star: function(random_root) {
        var child_set = random_root.children.slice(0);
        child_set.sort(function() {
            return Math.random() - 0.5;
        });
        
        // var len = Math.floor(child_set.length / 2);
        var len = 3;
        for (var i = 0; i < len; i ++) {
            child_set[i].active = true;
            var pos = cc.p(child_set[i].x, child_set[i].y);
            pos = random_root.convertToWorldSpaceAR(pos);
            var node_set = [-1, pos]; // 表示干扰点
            this.star_pos_set.push(node_set);
        }
        for (var i = len; i < child_set.length; i ++) {
            child_set[i].active = false;
        }
    },
    
    enter_next_mode: function() {
        this.game_mode ++;
        if(this.game_mode > this.star_part.length) {
            this.on_checkout();
            return;
        }
        
        var part_root = this.star_part[this.game_mode - 1];
        part_root.active = true;
        part_root.opacity = 255;
        part_root.setCascadeOpacityEnabled(true);
        this.tw = part_root.getChildByName("tw");
        this.tw.active = false;
        this.cw = part_root.getChildByName("cw");
        this.cw.active = false;
        this.star_root = part_root.getChildByName("star_root");
        this.star_root.active = true;
        this.star_root.setCascadeOpacityEnabled(true);
        this.random_root = part_root.getChildByName("random_root");
        this.random_root.active = false;
        
        this.connect_error = false;
        this.enable_touch = false;
        this.line_root = part_root.getChildByName("line_root");
        this.line_root.removeAllChildren();
        this.line_root.setCascadeOpacityEnabled(true);
        
        var children = this.star_root.children.slice(0);
        children.sort(function(lhs, rhs) {
            return (lhs.x - rhs.x);
        });
        
        this.star_pos_set = [];
        for(var i = 0; i < children.length; i ++) {
            var pos = cc.p(children[i].x, children[i].y);
            pos = this.star_root.convertToWorldSpaceAR(pos);
            var node_set = [i, pos];
            this.star_pos_set.push(node_set);
            // console.log(this.star_pos_set[i]);
            // console.log(children[i].name);
        }
        
        this.show_random_star(this.random_root);
        
        
        // 地图，注意位置是排序好的位置
        // 0, 1, 2, 3, 4 
        if(this.game_mode === 1) {
            this.map_width = 6;
            this.game_map = [
                0, 1, 0, 0, 0, 0,
                1, 0, 1, 0, 0, 0,
                0, 1, 0, 1, 1, 0,
                0, 0, 1, 0, 0, 0,
                0, 0, 1, 0, 0, 1,
                0, 0, 0, 0, 1, 0,
            ];
            this.game_map_connect = [
                0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0,
            ];    
        }
        else if(this.game_mode === 2){
            this.map_width = 7;
            this.game_map = [
                0, 1, 0, 1, 0, 0, 0, 
                1, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 1, 0, 0,
                1, 0, 0, 0, 1, 1, 0,
                0, 0, 1, 1, 0, 0, 1,
                0, 0, 0, 1, 0, 0, 0,
                0, 0, 0, 0, 1, 0, 0,
            ];
            this.game_map_connect = [
                0, 0, 0, 0, 0, 0, 0, 
                0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0,
            ];
        }
        else if(this.game_mode === 3) {
            this.map_width = 10;
            this.game_map = [
                0, 0, 1, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 1, 0, 0, 0, 0, 0, 0, 0,
                1, 1, 0, 1, 1, 0, 0, 0, 0, 0,
                0, 0, 1, 0, 0, 0, 1, 0, 0, 0,
                0, 0, 1, 0, 0, 1, 0, 0, 0, 0,
                0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 
                0, 0, 0, 1, 0, 0, 0, 0, 1, 0,
                0, 0, 0, 0, 0, 1, 0, 0, 0, 1,
                0, 0, 0, 0, 0, 0, 1, 0, 0, 1,
                0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 
            ];
            
            this.game_map_connect = [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
            ];
        }
        
        
        this.place_right_connect();
        
        this.call_latter(this.show_start_anim, 4);
    }, 
    
    show_start_anim: function() {
        var children = this.line_root.children;
        var action = cc.fadeOut(2);
        for(var i = 0; i < children.length; i ++) {
            if (children[i].getComponent("game_line").is_answer_line !== true) {
                children[i].runAction(action.clone());    
            }
        }
        
        this.call_latter(function() {
            this.random_root.active = true;
            this.random_root.opacity = 0;
            this.random_root.setCascadeOpacityEnabled(true);
            action = cc.fadeIn(1);
            this.random_root.runAction(action);
        }.bind(this), 2);
        
        this.call_latter(function() {
            this.enable_touch = true;
            this.game_tip_ended = false;
            this.show_game_tip_anim();
        }.bind(this), 3);
    },
    
    place_right_connect: function() {
        for(var i = 0; i < this.map_width; i++) {
            var start_data = this.star_pos_set[i];  
            console.log(i * this.map_width);
            for(var j = i; j < this.map_width; j ++) {
                if (this.game_map[i * this.map_width + j] !== 1) {
                    continue;
                }
                var end_data = this.star_pos_set[j];
                var line = cc.instantiate(this.line_prefab);
                line.parent = this.line_root;
                line.getComponent("game_line").connect_vec(start_data[1], end_data[1]);
                
                if(this.game_map_connect[i * this.map_width + j] === 1) { // 答案的线
                    line.getComponent("game_line").is_answer_line = true;
                }
            }
        }
    },
    
    reset_game: function() {
        if (this.enable_touch === false) {
            return;
        }
        
        this.connect_error = false;
        this.line_root.removeAllChildren();
       
        
        this.game_mode --;
        // this.random_root.active = false;
        // this.random_root.opacity = 0;
        this.play_kim_magic();
        // this.enter_next_mode();
        this.call_latter(this.enter_next_mode.bind(this), 1);
    }, 
    
    start_game: function() {
        if (this.game_started === true) {
            return;
        }
        
        for(var i = 0; i < this.star_part.length; i ++) {
            this.star_part[i].active = false;
        }
        this.checkout_root.active = false;
        this.game_started = true;
        this.game_mode = 0;
        this.connect_error = false;
        
        this.play_kim_magic();
        // this.enter_next_mode();
        this.call_latter(this.enter_next_mode.bind(this), 1);
    },
    
    start: function() {
        this.game_started = false;
        this.lock_kim_click = false;
        this.start_game();
    },
    
});
