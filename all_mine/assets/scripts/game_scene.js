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
        level_root:{
            default:[],
            type: cc.Node,
        },
        
        flip_blocks_3x4:{
            default: [],
            type: cc.Node,
        },
        flip_blocks_2x2: {
            default:[],
            type: cc.Node,
        },
        flip_blocks_2x3: {
            default:[],
            type: cc.Node,
        },
    },

    // use this for initialization
    onLoad: function () {
        this.block_levels = [this.flip_blocks_2x2, this.flip_blocks_2x3, this.flip_blocks_3x4];
        this.game_level = 0;
        
        this.checkout_root = cc.find("UI_ROOT/checkout_root");
        this.ck_logo_root = cc.find("UI_ROOT/checkout_root/logo_root");
        this.ck_replay_button = cc.find("UI_ROOT/checkout_root/replay_button");
        
        this.ske_kim_com = cc.find("UI_ROOT/anchor-bottom/kim").getComponent(sp.Skeleton);
        
        this.lock_kim_click = true;
    },
    
    show_checkout: function() {
        this.checkout_root.active = true;
        this.ck_logo_root.scale = 0;
        var s1 = cc.scaleTo(0.3, 1.2);
        var s2 = cc.scaleTo(0.1, 0.9);
        var s3 = cc.scaleTo(0.1, 1.0);
        
        this.ck_replay_button.active = false;
        
        var call_func = cc.callFunc(function() { // 旋转光线
            this.ck_replay_button.active = true;
            this.ck_replay_button.scale = 3.5;
            this.ck_replay_button.opacity = 0;
            var scale1 = cc.scaleTo(0.3, 0.8);
            var scale2 = cc.scaleTo(0.2, 1.2);
            var scale3 = cc.scaleTo(0.1, 1.0);
            var seq = cc.sequence([scale1, scale2, scale3]);
            this.ck_replay_button.runAction(seq);
            var fin = cc.fadeIn(0.5);
            this.ck_replay_button.runAction(fin);
            
        }.bind(this), this);
        
        var seq = cc.sequence([s1, s2, s3, call_func]);
        this.ck_logo_root.runAction(seq);
        
    },
    
    adjust_anchor_with_design: function() {
        var anchor_point = cc.find("UI_ROOT/anchor-lt");
        if(anchor_point) {
            anchor_point.x = -480;
            anchor_point.y = 360;
        }
        
        anchor_point = cc.find("UI_ROOT/anchor-bottom");
        if(anchor_point) {
            anchor_point.x = 0;
            anchor_point.y = -360;
        }
        
        anchor_point = cc.find("UI_ROOT/anchor-lb");
        if(anchor_point) {
            anchor_point.x = -480;
            anchor_point.y = -360;
        }
        
        anchor_point = cc.find("UI_ROOT/anchor-rb");
        if(anchor_point) {
            anchor_point.x = 480;
            anchor_point.y = -360;
        }
        
        anchor_point = cc.find("UI_ROOT/anchor-top");
        if(anchor_point) {
            anchor_point.x = 0;
            anchor_point.y = 360;
        }
    },
    
    adjust_anchor: function() {
        var win_size = cc.director.getWinSize();
        
        var cx = win_size.width * 0.5;
        var cy = win_size.height * 0.5;
        
        var anchor_point = cc.find("UI_ROOT/anchor-lt");
        if(anchor_point) {
            anchor_point.x = -cx;
            anchor_point.y = cy;
        }
        
        anchor_point = cc.find("UI_ROOT/anchor-bottom");
        if(anchor_point) {
            anchor_point.x = 0;
            anchor_point.y = -cy;
        }
        
        
        anchor_point = cc.find("UI_ROOT/anchor-lb");
        if(anchor_point) {
            anchor_point.x = -cx;
            anchor_point.y = -cy;
        }
        
        anchor_point = cc.find("UI_ROOT/anchor-rb");
        if(anchor_point) {
            anchor_point.x = cx;
            anchor_point.y = -cy;
        }
        
        anchor_point = cc.find("UI_ROOT/anchor-top");
        if(anchor_point) {
            anchor_point.x = 0;
            anchor_point.y = cy;
        }
    },
    
    adjust_window: function(win_size) {
        var design_4_3 = false;
        if(1024 * win_size.height > 768 * win_size.width) {
            this.adjust_anchor_with_design();
            design_4_3 = true;
        }
        else {
            this.adjust_anchor();
        }
    },
    
    play_kim_anim_with_right:function() {
        this.ske_kim_com.clearTracks();
        this.ske_kim_com.setAnimation(0, "ok_1", false);
        this.call_latter(function() {
            this.ske_kim_com.clearTracks();
            this.ske_kim_com.setAnimation(0, "idle_1", true);
        }.bind(this), 2);
    }, 
    
    play_kim_anim_with_error:function() {
        this.ske_kim_com.clearTracks();
        this.ske_kim_com.setAnimation(0, "err_1", false);
        this.call_latter(function() {
            this.ske_kim_com.clearTracks();
            this.ske_kim_com.setAnimation(0, "idle_1", true);
        }.bind(this), 1.5);
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
        this.game_start = false;
        this.locking_game = false;
        this.scheduleOnce(this.on_game_start.bind(this), 0);
        
        var win_size = cc.director.getWinSize();
        this.prev_size = win_size;
        this.adjust_window(win_size);
        
        this.call_latter(function() {
            this.ske_kim_com.clearTracks();
            this.ske_kim_com.setAnimation(0, "idle_1", true);
            this.lock_kim_click = false;
        }.bind(this), 0.9);
    },
    
    reset_flip_block: function() {
        for(var i = 0; i < this.flip_blocks.length; i ++) {
            var block = this.flip_blocks[i];
            var block_comp = block.getComponent("flip_block");
            block_comp.flip_to_back();
        }
    },
    
    flip_block_with_array:function(value_array) {
        for(var i = 0; i < value_array.length; i ++) {
            var block = this.flip_blocks[i];
            var block_comp = block.getComponent("flip_block");
            block_comp.flip_to_back_with_value(value_array[i]);
        }
    },
    
    on_game_replay: function() {
        this.play_sound("resources/sounds/button.mp3");
        this.on_game_start();    
    },
    
    on_game_start: function() {
        if(this.game_level > 2) {
            return;
        }
        
        this.checkout_root.active = false;
        
        this.game_start = true;
        
        for(var index = 0; index < this.block_levels.length; index ++) {
            this.level_root[index].active = false;
        }
        this.level_root[this.game_level].active = true;
        this.flip_blocks = this.block_levels[this.game_level];
        
        if(this.game_level === 0) {
            this.value_array = [4, 4,
                                0, 0];
        }
        else if(this.game_level === 1) {
            this.value_array = [1, 2, 3, 
                                3, 2, 1];
        }
        else {
            this.value_array = [0, 1, 2, 3, 
                                3, 0, 1, 2, 
                                4, 2, 4, 2];    
        }
        this.value_array.sort(function() {
            return Math.random() - 0.5;
        });
        
        this.flip_block_with_array(this.value_array);
        this.game_stage = 0;
        this.locking_game = false;
        this.flip_mask = [0, 0, 0, 0, 
                          0, 0, 0, 0, 
                          0, 0, 0, 0];
                          
        // this.show_checkout();
    },
    
    play_sound: function(name) {
        cc.audioEngine.stopMusic(false);
        var url = cc.url.raw(name);
        cc.audioEngine.playMusic(url, false);
    }, 
    
    checkout_success:function() {
        console.log(this.flip_blocks.length);
        console.log(this.flip_mask);
        var i;
        for(i = 0; i < this.flip_blocks.length; i ++) {
            if(this.flip_mask[i] === 0) {
                return false;
            }
        }
        return true;
    },
    
    show_right_anim: function() {
        var s1 = cc.scaleTo(0.3, 1.1);
        var delay = cc.delayTime(0.2);
        var s2 = cc.scaleTo(0.1, 1.0);
        
        var seq = cc.sequence([s1, delay, s2]);
        
        this.first_flip.node.runAction(seq);
        this.second_flip.node.runAction(seq.clone());
    },
    
    call_latter: function(callfunc, delay) {
        var delay_action = cc.delayTime(delay);
        var call_action = cc.callFunc(callfunc, this);
        var seq = cc.sequence([delay_action, call_action]);
        this.node.runAction(seq);
    },
    
    on_card_flip: function(block, card_value) {
        if(this.game_start === false || this.locking_game === true) {
            return;
        }
        
        console.log("card_flip =" + card_value);
        var sounds_name = [
            "resources/sounds/car.mp3",
            "resources/sounds/plane.mp3",
            "resources/sounds/train.mp3",
            "resources/sounds/balloon.mp3",
            "resources/sounds/teddy.mp3"
        ];
        
        cc.audioEngine.stopMusic(false);
        this.scheduleOnce(function(){
            var url = cc.url.raw(sounds_name[card_value]);
            cc.audioEngine.playMusic(url, false);
        }, 0);
        
        block.flip_to_value();
        this.game_stage = this.game_stage + 1;
        
        if(this.game_stage === 1) { // 翻开一张牌
            this.first_flip = block;
            this.locking_game = true;
            this.scheduleOnce(function(){
                this.locking_game = false;
            }.bind(this), 1 * 0.7);
            return;
        }
        
        this.second_flip = block;
        
        if(this.game_stage == 2) {
            this.game_stage = 0;
            
            if(this.first_flip.get_card_value() != this.second_flip.get_card_value()) {
                this.play_kim_anim_with_error();
                this.locking_game = true;
                // 翻二张牌到背面
                this.scheduleOnce(function() {
                    this.first_flip.flip_to_back();
                    this.second_flip.flip_to_back();    
                }.bind(this), 1.0 * 0.7);
                
                this.scheduleOnce(function() {
                    this.locking_game = false;
                }.bind(this), 1.2 * 0.7);
                // end 
                return;
            }
            
            var first = this.first_flip.get_seat();
            var second = this.second_flip.get_seat();
            
            this.flip_mask[first] = 1;
            this.flip_mask[second] = 1;
            this.locking_game = true;
            
            // 播放激励动画
            this.play_kim_anim_with_right();
            this.scheduleOnce(function() {
                this.show_right_anim();
            }.bind(this), 0.2);
            
            this.scheduleOnce(function() {
                this.locking_game = false;
            }.bind(this), 1);
            // end
            
            if(this.checkout_success()) {
                this.game_start = false;
                this.game_level ++;
                
                this.call_latter(function(){
                    this.play_sound("resources/sounds/end.mp3");
                }.bind(this), 1.0);
                    
                if(this.game_level === 3) {
                    this.game_level = 0;
                    // 0.5秒后弹结算换面
                    this.scheduleOnce(this.show_checkout.bind(this), 1.2);
                    // end    
                }
                else {
                    this.call_latter(this.on_game_start.bind(this), 1.2);    
                }
            }
        }
        
    },
    
    on_goto_home: function() {
        cc.audioEngine.stopMusic(false);
        var url = cc.url.raw("resources/sounds/button.mp3");
        cc.audioEngine.playMusic(url, false);
        cc.director.loadScene("start_scene");
    },
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        var win_size = cc.director.getWinSize();
        if(win_size.width != this.prev_size.width || win_size.height != this.prev_size.height) {
            this.prev_size = win_size;
            this.adjust_window(win_size);
        }
    },
    
    on_kim_click: function() {
        if(this.lock_kim_click === true) {
            return;
        }
        this.play_kim_click_anim_with_random();
    }
});
