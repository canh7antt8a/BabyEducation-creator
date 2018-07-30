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
        lock_music_time: 20,
        wave_anim_duration: 0.8,
        
        play_wave_music_time: {
            default: [],
            type: cc.Float,
        },
        
        click_item_box: {
            default: [],
            type: cc.Node,
        },
        
        water_wave_prefab: cc.Prefab,
    },
    
    preload_sound: function() {
        var sound_list = [
            "resources/sounds/click.mp3",
            "resources/sounds/piano/elem_1.mp3",
            "resources/sounds/piano/elem_2.mp3",
            "resources/sounds/piano/elem_3.mp3",
            "resources/sounds/piano/elem_4.mp3",
            "resources/sounds/piano/elem_5.mp3",
            "resources/sounds/piano/elem_6.mp3",
            "resources/sounds/piano/elem_7.mp3",
            "resources/sounds/piano/elem_8.mp3",
            "resources/sounds/piano/elem_9.mp3",
            "resources/sounds/piano/elem_10.mp3",
            "resources/sounds/piano/elem_11.mp3",
            "resources/sounds/piano/elem_12.mp3",
            "resources/sounds/piano/elem_13.mp3",
            "resources/sounds/piano/elem_14.mp3",
            "resources/sounds/piano/elem_15.mp3",
            
            "resources/sounds/piano/piano.mp3",
            "resources/sounds/piano/mid_change.mp3",
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
    
    // use this for initialization
    onLoad: function () {
        this.preload_sound();
        this.center_root = cc.find("UI_ROOT/anchor-center");
        
        this.water_wave = cc.find("UI_ROOT/anchor-center/wave_root/water_wave");
        this.water_wave_anim_com = this.water_wave.getComponent("frame_anim");
        
        this.kim_cat_com = cc.find("UI_ROOT/anchor-center/kim_cat").getComponent("frame_anim_second");
        var url = cc.url.raw("resources/frame_anim/cat_anim/cat_1.png");
        var sp2 = new cc.SpriteFrame(url);
        this.kim_idel_sp = sp2;
        this.kim_idel_sprite = cc.find("UI_ROOT/anchor-center/kim_cat").getComponent(cc.Sprite);
        
        
        this.yinfu = cc.find("UI_ROOT/anchor-center/yinfu");
        this.sp_yinfu = this.yinfu.getComponent(sp.Skeleton);
        
        
        this.lock_click = false;
        this.click_mode = 0; 
        this.music_time= 0;
        this.music_index = 0;
        
        this.music_xpos_set = [];
        this.music_ypos_set = [];
        
        this.node.on('touchstart', function(event) {
            if (!this.center_root.active) {
                return;
            }
            
            for(var i = 0; i < this.click_item_box.length; i ++) {
                var bound_box = this.click_item_box[i].getBoundingBox();
                var pos = this.click_item_box[i].getParent().convertTouchToNodeSpace(event);    
                if(bound_box.contains(pos)) {
                    this.music_xpos_set.push(event.getLocation().x);
                    this.music_ypos_set.push(event.getLocation().y);
                    
                    this.on_water_click(event.getLocation());
                    event.stopPropagation();
                }
            }
        }.bind(this));
        
        this.node.on('touchmove', function(event){
        }.bind(this));
        
        this.node.on('touchend', function(event){
        }.bind(this));
        
        this.water_root = cc.find("UI_ROOT/anchor-center/wave_root"); 
        this.mid_wave_anim_com1 = cc.find("UI_ROOT/anchor-center/wave_root/max_water_wave1").getComponent("frame_anim");
        this.mid_wave_anim_com1.node.active = false;
        
        this.mid_wave_anim_com2 = cc.find("UI_ROOT/anchor-center/wave_root/max_water_wave2").getComponent("frame_anim");
        this.mid_wave_anim_com2.node.active = false;
        
        this.mid_wave_anim_com3 = cc.find("UI_ROOT/anchor-center/wave_root/max_water_wave3").getComponent("frame_anim");
        this.mid_wave_anim_com3.node.active = false;
    },
    
    start: function() {
        
    }, 
    
    play_water_wave: function() {
        this.water_wave.active = true;
        this.water_wave_anim_com.play(function() {
            this.water_wave.active = false;
        }.bind(this));
    }, 
    
    play_hole_music: function() {
        // this.mid_wave_anim_com.node.active = false;
        this.click_mode ++;
        this.play_sound("resources/sounds/piano/piano.mp3");
        this.music_time = 0;
        this.music_index = 0;
        this.call_latter(this.on_play_music_ended.bind(this), this.lock_music_time);
    }, 
    
    
    play_middle_music: function() {
        this.kim_cat_com.play_loop();
        this.play_sound("resources/sounds/piano/mid_change.mp3");
        
        this.sp_yinfu.clearTracks();
        this.sp_yinfu.setAnimation(0, "animation", true);
        
        // this.mid_wave_anim_com1.node.active = true;
        // this.mid_wave_anim_com1.play();
        this.call_latter(function() {
            this.mid_wave_anim_com1.node.active = false;
        }.bind(this), 4);
        
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
        this.click_mode ++;
        if(this.click_mode < this.elem_count) {
            this.lock_click = false;    
        }
        else { // 播放整首音乐
            // 播放过度音乐
            this.call_latter(this.play_middle_music.bind(this), this.wave_anim_duration);
            // end 
        }
    }, 
    
    play_cat_idle: function() {
        this.kim_idel_sprite.spriteFrame = this.kim_idel_sp.clone();
    }, 
    
    on_play_music_ended: function() {
        this.click_mode = 0;
        this.lock_click = false;
        
        this.music_xpos_set = [];
        this.music_ypos_set = [];
        
        this.kim_cat_com.stop_anim();
        this.sp_yinfu.clearTracks();
        this.yinfu.active = false;
        
        this.play_cat_idle();
    },
    
    play_water_wave_when_click: function(w_pos) {
        var water = cc.instantiate(this.water_wave_prefab);
        var s = 1 + Math.random() * 0.5;
        water.scale = s;
        water.rotation = -45 + (Math.random() - 0.5) * 40;
        
        var frame_anim_com = water.getComponent("frame_anim_second");
        this.water_root.addChild(water);
        water.active = true;
        
        var pos = this.water_root.convertToNodeSpace((w_pos));
        water.x = pos.x;
        water.y = pos.y;
        
        frame_anim_com.play(function() {
            this.firefly_fade_out(water);
        }.bind(this));
    }, 
    
    on_water_click: function(w_pos) {
        if(this.lock_click === true) {
            return;
        }
        this.lock_click = true;
        
        this.yinfu.active = true;
        this.sp_yinfu.clearTracks();
        this.sp_yinfu.setAnimation(0, "animation", false);
            
        if(this.click_mode < this.elem_count) { // 播放当个的音符
            this.play_sound("resources/sounds/piano/elem_" + (this.click_mode + 1) + ".mp3");
            this.kim_cat_com.play(this.play_cat_idle.bind(this));
            this.play_water_wave_when_click(w_pos);
            this.call_latter(this.on_play_next.bind(this), this.lock_elem_time);
            
        }
    },
    
    firefly_fade_out: function(wave) {
        var fout = cc.fadeOut(0.1);
        var callfunc = cc.callFunc(function() {
            wave.removeFromParent();
        });
        var seq = cc.sequence([fout, callfunc]);
        wave.runAction(seq);
        
    },
    
    play_wave_by_random: function() {
        var xpos = 40 + Math.random() * 1840;
        var ypos = 100 + Math.random() * 880;
        
        var water = cc.instantiate(this.water_wave_prefab);
        var s = 1 + Math.random() * 0.5;
        water.scale = s;
        
        water.rotation = -45 + (Math.random() - 0.5) * 40;
        
        var frame_anim_com = water.getComponent("frame_anim_second");
        this.water_root.addChild(water);
        water.active = true;
        
        var pos = this.water_root.convertToNodeSpace(cc.p(xpos, ypos));
        water.x = pos.x;
        water.y = pos.y;
        
        frame_anim_com.play(function() {
            this.firefly_fade_out(water);
        }.bind(this));
    },
    
    // called every frame, uncomment this function to activate update callback
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
            this.play_wave_by_random(); // 播放动画
            this.music_index ++;
        }
        // end
    },
});
