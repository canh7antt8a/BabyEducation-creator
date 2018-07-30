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
        elem_count: 21,
        lock_elem_time: 0.6,
        lock_music_time: 14,
        wave_anim_duration: 0.8,
        
        play_wave_music_time: {
            default: [],
            type: cc.Float,
        },
        
        click_item_box: {
            default: [],
            type: cc.Node,
        },
        
        violin_array: {
            default: [],
            type: cc.Prefab,
        },
        
        min_speed: 100,
        max_speed: 200,
        
        min_scale: 0.3,
        max_scale: 1.3
    },
    
    preload_sound: function() {
        var sound_list = [
            "resources/sounds/click.mp3",
            "resources/sounds/bass/elem_1.mp3",
            "resources/sounds/bass/elem_2.mp3",
            "resources/sounds/bass/elem_3.mp3",
            "resources/sounds/bass/elem_4.mp3",
            "resources/sounds/bass/elem_5.mp3",
            "resources/sounds/bass/elem_6.mp3",
            "resources/sounds/bass/elem_7.mp3",
            "resources/sounds/bass/elem_8.mp3",
            "resources/sounds/bass/elem_9.mp3",
            "resources/sounds/bass/mid_change.mp3",
            "resources/sounds/bass/bass.mp3",
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
    
    call_latter: function(callfunc, delay) {
        var delay_action = cc.delayTime(delay);
        var call_action = cc.callFunc(callfunc, this);
        var seq = cc.sequence([delay_action, call_action]);
        this.node.runAction(seq);
    },
    
    start_voilin: function(event) {
        if(!this.start_valid) {
            return;
        }
        this.start_valid = false;

        var end_x = event.getLocation().x;
        var end_y = event.getLocation().y;
        var center_pos = cc.p((end_x + this.start_x) * 0.5, (end_y + this.start_y) * 0.5);
            
        var dir;
        if (end_x > this.start_x) {
            dir = cc.v2((end_x - this.start_x), (end_y - this.start_y));    
            this.on_water_click(cc.p(this.start_x, this.start_y), dir.signAngle(cc.v2(1, 0)));
        }
        else {
            dir = cc.v2((this.start_x - end_x), (this.start_y - end_y));
            this.on_water_click(cc.p(end_x, end_y), dir.signAngle(cc.v2(1, 0)));
        }
        
        // var scale = 1.0 + Math.random() * 0.5;
        
    }, 
    
    // use this for initialization
    onLoad: function () {
        this.preload_sound();
        
        this.anchor_root = cc.find("UI_ROOT/anchor-center");

        
        this.lock_click = false;
        this.click_mode = 0; 

        this.music_index = 1;
        this.start_valid = false;

        
        this.node.on('touchstart', function(event) {
            if(!this.anchor_root.active) {
                return;
            }
            
            for(var i = 0; i < this.click_item_box.length; i ++) {
                var bound_box = this.click_item_box[i].getBoundingBox();
                var pos = this.click_item_box[i].getParent().convertTouchToNodeSpace(event);
                
                if(bound_box.contains(pos)) {
                    this.start_valid = true;
                    this.start_x = event.getLocation().x;
                    this.start_y = event.getLocation().y;
                    event.stopPropagation();
                }
            }
        }.bind(this));
        
        this.node.on('touchmove', function(event){
        }.bind(this));
        
        this.node.on('touchend', function(event){
           this.start_voilin(event);
        }.bind(this));
        
        this.node.on('touchcancel', function(event) {
           this.start_voilin(event); 
        }.bind(this));
        
        this.click_pos_random = [];
        
        this.light_root = cc.find("UI_ROOT/anchor-center/light_root");
        
        this.yinfu_root = cc.find("UI_ROOT/anchor-center/yinfu_root");
        
    },
    
    play_music_ske_anim: function(is_loop) {
        this.yinfu_root.active = true;
        var children = this.yinfu_root.children;
        children.sort(function() {
            return Math.random() - 0.5;
        });
        
        for(var i = 0; i < children.length; i ++) {
            children[i].active = false;
        }
        children[0].active = true;
        children[0].getComponent(sp.Skeleton).clearTracks();
        children[0].getComponent(sp.Skeleton).setAnimation(0, "animation", is_loop);
    },
    
    stop_music_ske_anim: function() {
        this.yinfu_root.active = false;
    },
    
    play_middle_music: function() {
        // this.kim_cat_com.play_loop();
        this.play_sound("resources/sounds/bass/mid_change.mp3");
        
        // this.sp_yinfu.clearTracks();
        // this.sp_yinfu.setAnimation(0, "animation", true);
        
        // this.mid_wave_anim_com1.node.active = true;
        // this.mid_wave_anim_com1.play();
        
        /*
        var func = function() {
            this.mid_wave_anim_com2.node.active = true;
            this.mid_wave_anim_com2.play();
            this.call_latter(function() {
                this.mid_wave_anim_com2.node.active = false;
            }.bind(this), 4);    
        }
        this.call_latter(func.bind(this), 0.2);
        
        func = function() {
            this.mid_wave_anim_com3.node.active = true;
            this.mid_wave_anim_com3.play();
            this.call_latter(function() {
                this.mid_wave_anim_com3.node.active = false;
            }.bind(this), 4);    
        }
        this.call_latter(func.bind(this), 0.4);*/
        
        this.call_latter(function() {
            this.play_hole_music();
        }.bind(this), 4.5);
    },
    
    on_play_next: function() {
        this.call_latter(this.play_middle_music.bind(this), this.wave_anim_duration);
    }, 
    
    start: function() {
        
    }, 
    
    play_wave_by_random: function(w_pos, angle) {
        this.play_music_ske_anim(false);
        
        var max_dir = cc.p(1920 - w_pos.x, 1000 - w_pos.y);
        var max_degree = max_dir.signAngle(cc.v2(1, 0));
        var min_dir = cc.p(1920 - w_pos.x, 80 - w_pos.y);
        var min_degree = min_dir.signAngle(cc.v2(1, 0));
        
        if (angle > max_degree) {
            angle = max_degree;
        } 
        if(angle < min_degree) {
            angle = min_degree;
        }
        
        angle = -angle * 57.3;
        
        // 播放蜗牛
        var random_num = [0, 1, 2];
        random_num.sort(function() {
            return Math.random() - 0.5;
        });
        // end
        
        var index = random_num[0];
        var prefab = cc.instantiate(this.violin_array[index]);
        this.light_root.addChild(prefab);
        prefab.active = true;
        prefab.rotation = angle;
        
        prefab.scale = 0;
        var dst_scale;
        
        if (w_pos.y <= 0) {
            dst_scale = this.max_scale;
        }
        else if (w_pos.y >= 1080){
            dst_scale = this.min_scale;
        }
        else {
            dst_scale = this.max_scale - (w_pos.y  /1080);
        } 
        
        var pos = this.light_root.convertToNodeSpace(w_pos);
        
        prefab.x = pos.x;
        prefab.y = pos.y;
         
        var frame_anim_com = prefab.getComponent("frame_anim_second");
        frame_anim_com.play_loop();
        
        // 移动
        var speed = this.min_speed + Math.random() * (this.max_speed - this.min_speed);
        var end_pos_x = 2000;
        var delta_y = (2000 - w_pos.x) * Math.tan(-angle/57.3); 
        var delta_x = (2000 - w_pos.x);
        var len = Math.sqrt(delta_x * delta_x + delta_y * delta_y);
        var time = len / speed;
        var scale_in = cc.scaleTo(0.6, dst_scale);
        var delay = cc.delayTime(0.1);
        var move = cc.moveBy(time, delta_x, delta_y);
        
        var func = cc.callFunc(function() {
            prefab.removeFromParent();
        }, prefab);
        
        var move_end_scale;
        if (delta_y + w_pos.y <= 0) {
            move_end_scale = this.max_scale;
        }
        else if (delta_y + w_pos.y >= 1080) {
            move_end_scale = this.min_scale;
        }
        else {
            move_end_scale = this.max_scale - ((delta_y + w_pos.y) /1080);
        }
        
        var func2 = cc.callFunc(function(){
            var s2 = cc.scaleTo(time, move_end_scale);
            prefab.runAction(s2);
        }.bind(this), prefab);
        
        var seq = cc.sequence([scale_in, delay, func2, move, func]);
        prefab.runAction(seq);
        
        // end 
    },
    
    on_water_click: function(w_pos, angle) {
        if(this.lock_click === true) {
            return;
        }
        
        this.click_pos_random.push([w_pos, angle]);
        
        this.play_music_ske_anim(false);
        
        var max_dir = cc.p(1920 - w_pos.x, 1000 - w_pos.y);
        var max_degree = max_dir.signAngle(cc.v2(1, 0));
        var min_dir = cc.p(1920 - w_pos.x, 80 - w_pos.y);
        var min_degree = min_dir.signAngle(cc.v2(1, 0));
        
        if (angle > max_degree) {
            angle = max_degree;
        } 
        if(angle < min_degree) {
            angle = min_degree;
        }
        
        angle = -angle * 57.3;
        
        this.lock_click = true;
        
        
        this.play_sound("resources/sounds/bass/elem_" + this.music_index + ".mp3");
        this.music_index ++;
        this.click_mode ++;
        
        if(this.music_index > this.elem_count) {
            this.call_latter(this.on_play_next.bind(this), this.lock_elem_time);
            return;
        }
        
        // 播放蜗牛
        var random_num = [0, 1, 2];
        random_num.sort(function() {
            return Math.random() - 0.5;
        });
        // end
        
        var index = random_num[0];
        var prefab = cc.instantiate(this.violin_array[index]);
        this.light_root.addChild(prefab);
        prefab.active = true;
        prefab.rotation = angle;
        
        prefab.scale = 0;
        var dst_scale;
        
        if (w_pos.y <= 0) {
            dst_scale = this.max_scale;
        }
        else if (w_pos.y >= 1080){
            dst_scale = this.min_scale;
        }
        else {
            dst_scale = this.max_scale - (w_pos.y  /1080);
        } 
        
        var pos = this.light_root.convertToNodeSpace(w_pos);
        
        prefab.x = pos.x;
        prefab.y = pos.y;
         
        var frame_anim_com = prefab.getComponent("frame_anim_second");
        frame_anim_com.play_loop();
        this.call_latter(function() {this.lock_click = false;}.bind(this), this.lock_elem_time);
        // end 
        
        // 移动
        var speed = this.min_speed + Math.random() * (this.max_speed - this.min_speed);
        var end_pos_x = 2000;
        var delta_y = (2000 - w_pos.x) * Math.tan(-angle/57.3); 
        var delta_x = (2000 - w_pos.x);
        var len = Math.sqrt(delta_x * delta_x + delta_y * delta_y);
        var time = len / speed;
        var scale_in = cc.scaleTo(0.6, dst_scale);
        var delay = cc.delayTime(0.1);
        var move = cc.moveBy(time, delta_x, delta_y);
        
        var func = cc.callFunc(function() {
            prefab.removeFromParent();
        }, prefab);
        
        var move_end_scale;
        if (delta_y + w_pos.y <= 0) {
            move_end_scale = this.max_scale;
        }
        else if (delta_y + w_pos.y >= 1080) {
            move_end_scale = this.min_scale;
        }
        else {
            move_end_scale = this.max_scale - ((delta_y + w_pos.y) /1080);
        }
        
        var func2 = cc.callFunc(function(){
            var s2 = cc.scaleTo(time, move_end_scale);
            prefab.runAction(s2);
        }.bind(this), prefab);
        
        var seq = cc.sequence([scale_in, delay, func2, move, func]);
        prefab.runAction(seq);
        
        // end 
    },
    
    play_hole_music: function() {
        // this.mid_wave_anim_com.node.active = false;
        this.click_mode ++;
        this.play_sound("resources/sounds/bass/bass.mp3");
        this.music_time = 0;
        this.music_index = 0;
        this.call_latter(this.on_play_music_ended.bind(this), this.lock_music_time);
    }, 
    
    on_play_music_ended: function() {
        this.click_mode = 0;
        this.lock_click = false;
        this.music_index = 1;
        this.click_pos_random = [];
        this.light_root.removeAllChildren();
    },
    
    update: function (dt) {
        // 播放整首歌曲
        if(this.click_mode != this.elem_count + 1) { 
            return;
        }
        
        if(this.music_index >= this.play_wave_music_time.length) { // 播放结束
            return;
        }
        
        this.music_time += dt;
        while(this.music_index < (this.play_wave_music_time.length - 1) && this.music_time >= this.play_wave_music_time[this.music_index + 1]) {
            this.music_index ++;
        }
        
        if(this.music_time >= this.play_wave_music_time[this.music_index]) {
            var index = this.music_index;
            while(index >= this.elem_count) {
                index -= this.elem_count;
            }
            this.play_wave_by_random(this.click_pos_random[index][0], this.click_pos_random[index][1]); // 播放动画
            this.music_index ++;
        }
        // end
    },
});
