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
        flip_blocks:{
            default: [],
            type: cc.Node,
        }
    },

    // use this for initialization
    onLoad: function () {
        this.checkout_root = cc.find("UI_ROOT/checkout_root");
        this.ck_logo_root = cc.find("UI_ROOT/checkout_root/logo_root");
        this.ck_replay_button = cc.find("UI_ROOT/checkout_root/replay_button");
        
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
    
    start: function() {
        this.game_start = false;
        this.locking_game = false;
        this.scheduleOnce(this.on_game_start.bind(this), 0);
        
        var win_size = cc.director.getWinSize();
        this.prev_size = win_size;
        this.adjust_window(win_size);   
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
        cc.audioEngine.stopMusic(false);
        var url = cc.url.raw("resources/sounds/button.mp3");
        this.scheduleOnce(function(){
            cc.audioEngine.playMusic(url, false);    
        }.bind(this), 0);
        
        this.on_game_start();    
    },
    
    on_game_start: function() {
        this.checkout_root.active = false;
        
        this.game_start = true;
        this.value_array = [0, 1, 2, 3, 
                            3, 0, 1, 2, 
                            0, 2, 3, 1, 
                            1, 3, 2, 0];
                            
        this.value_array.sort(function() {
            return Math.random() - 0.5;
        });
        
        console.log(this.value_array[0] + " " + this.value_array[1] + " "  + this.value_array[2] + " "  + this.value_array[3]);
        console.log(this.value_array[4] + " " + this.value_array[5] + " "  + this.value_array[6] + " "  + this.value_array[7]);
        
        console.log(this.value_array[8] + " " + this.value_array[9] + " "  + this.value_array[10] + " "  + this.value_array[11]);
        console.log(this.value_array[12] + " " + this.value_array[13] + " "  + this.value_array[14] + " "  + this.value_array[15]);
        
        this.flip_block_with_array(this.value_array);
        
        this.game_stage = 0;
        this.locking_game = false;
        
        this.flip_mask = [0, 0, 0, 0, 
                          0, 0, 0, 0, 
                          0, 0, 0, 0,
                          0, 0, 0, 0];
                          
        // this.show_checkout();
    },
    
    checkout_success:function() {
        var i;
        for(i = 0; i < 16; i ++) {
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
    
    on_card_flip: function(block, card_value) {
        if(this.game_start === false || this.locking_game === true) {
            return;
        }
        
        console.log("card_flip =" + card_value);
        var sounds_name = [
            "resources/sounds/ant.mp3",
            "resources/sounds/butterfly.mp3",
            "resources/sounds/firefly.mp3",
            "resources/sounds/bee.mp3",
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
            }.bind(this), 1);
            return;
        }
        
        this.second_flip = block;
        
        if(this.game_stage == 2) {
            this.game_stage = 0;
            
            if(this.first_flip.get_card_value() != this.second_flip.get_card_value()) {
                this.locking_game = true;
                // 翻二张牌到背面
                this.scheduleOnce(function() {
                    this.first_flip.flip_to_back();
                    this.second_flip.flip_to_back();    
                }.bind(this), 1.0);
                
                this.scheduleOnce(function() {
                    this.locking_game = false;
                }.bind(this), 1.0 + 0.2);
                // end 
                return;
            }
            
            var first = this.first_flip.get_seat();
            var second = this.second_flip.get_seat();
            
            this.flip_mask[first] = 1;
            this.flip_mask[second] = 1;
            
            // 播放激励动画
            this.locking_game = true;
            this.scheduleOnce(function() {
                this.show_right_anim();
            }.bind(this), 0.2);
            
            this.scheduleOnce(function() {
                this.locking_game = false;
            }.bind(this), 1);
            // end
            
            if(this.checkout_success()) {
                this.game_start = false;
                cc.audioEngine.stopMusic(false);
                this.scheduleOnce(function(){
                    var url = cc.url.raw("resources/sounds/end.mp3");
                    cc.audioEngine.playMusic(url, false);
                }, 0);
                
                // 0.5秒后弹结算换面
                this.scheduleOnce(this.show_checkout.bind(this), 0.5);
                // end
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
});
