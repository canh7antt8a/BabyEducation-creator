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
    },
    
    adjust_anchor_with_design: function() {
        var anchor_point = cc.find("UI_ROOT/anchor-lt");
        if(anchor_point) {
            anchor_point.x = -480;
            anchor_point.y = 360;
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
    
    // use this for initialization
    onLoad: function () {
        var url = cc.url.raw("resources/sounds/button_click.mp3");
        cc.loader.loadRes(url, function() {});
        url = cc.url.raw("resources/sounds/ck_error.mp3");
        cc.loader.loadRes(url, function() {});
        url = cc.url.raw("resources/sounds/ch_right.mp3");
        cc.loader.loadRes(url, function() {});
        
        this.particle_win1 = cc.find("UI_ROOT/anchor-top/caidai_1").getComponent(cc.ParticleSystem);
        this.particle_win2 = cc.find("UI_ROOT/anchor-top/caidai_2").getComponent(cc.ParticleSystem);
        this.scheduleOnce(this.on_start.bind(this), 0);
        
        
        this.random_type = [0, 1, 2, 3, 4];
        this.random_type.sort(function() {
            return Math.random() - 0.5;
        });
        this.type_index = 0;
        console.log(this.random_type);
        
        
        this.random_sub_type = [0, 1, 2]
        this.random_sub_type.sort(function() {
            return Math.random() - 0.5;
        });
        this.sub_type_index = 0;
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
        
        this.scale_root.x = -55;
        this.scale_root.y = 100;
        this.scale_root.scale = 1.1;
        
        
        if(Math.abs(win_size.height * 16 - win_size.width * 9) < 5) {
            this.scale_root.x = -55;
            this.scale_root.y = 65;
            this.scale_root.scale = 1.1;
        }
        else if(design_4_3 || Math.abs(win_size.height * 4 - win_size.width * 3) < 5) {
            this.scale_root.x = -55;
            this.scale_root.y = 65;
            this.scale_root.scale = 1.5;
        }
    },
    
    start: function() {
        this.scale_root = cc.find("UI_ROOT/anchor-center/scale_node");
        this.fruits_root = cc.find("UI_ROOT/anchor-center/scale_node/fruit_node");
        var win_size = cc.director.getWinSize();
        this.prev_size = win_size;
        this.adjust_window(win_size);
        
    },
    
    on_start: function() {
        var cat_player = cc.find("UI_ROOT/anchor-rb/game_npc");
        this.cat_player = cat_player;
        
        cat_player = cat_player.getComponent(sp.Skeleton);
        
        this.cat_ske = cat_player;
        console.log(this.cat_ske);
        
        this.cat_player.active = false;
        this.cat_ske.clearTrack(0);
        this.cat_ske.clearTracks();
        
        this.scheduleOnce(this.on_play_start_anim.bind(this), 0.8);
        
        this.playing_idle = false;
        
        
        // this.fruits_root = cc.find("UI_ROOT/anchor-top/fruit_node");
        this.center_pos = this.fruits_root.convertToWorldSpaceAR(cc.Vec2(0, 0));
        
        
        this.fruits_sprite = this.fruits_root.getComponent(cc.Sprite);
        this.scheduleOnce(this.on_stat_game.bind(this), 2.5);
        
        this.game_started = false;
    },
    
    play_win_particle: function() {
        this.particle_win1.resetSystem();
        this.particle_win1.addParticle();
        
        this.particle_win2.resetSystem();
        this.particle_win2.addParticle();
    },
    
    on_play_idle_anim: function() {
        this.cat_ske.clearTrack(0);
        this.cat_ske.setAnimation(0, "idle_1", true);    
        this.playing_idle = true; 
    },
    
    on_play_anim_end:function(time) {
        var delay = cc.delayTime(time);
        var callback = cc.callFunc(this.on_play_idle_anim.bind(this), this);
        var seq = cc.sequence(delay, callback);
        this.node.runAction(seq);
    },
    
    on_play_start_anim: function() {
        this.cat_player.active = true;
        this.playing_idle = false;
        this.cat_ske.clearTrack(0);
        this.cat_ske.setAnimation(0, "in", false);
        this.on_play_anim_end(1.0);
    },
    
    on_player_error_anim: function() {
        this.playing_idle = false;
        this.cat_ske.clearTrack(0);
        this.cat_ske.setAnimation(0, "err_1", false);
        this.on_play_anim_end(1.5);
    },
    
    on_player_right_anim: function() {
        this.playing_idle = false;
        this.cat_ske.clearTrack(0);
        this.cat_ske.setAnimation(0, "ok_1", false);
        this.on_play_anim_end(2);
    },
    
    on_player_click_anim: function() {
        if(this.playing_idle === false) {
            return;
        }
        this.playing_idle = false;
        this.cat_ske.clearTrack(0);
        this.cat_ske.setAnimation(0, "clk_1", false);
        this.on_play_anim_end(2);
    },
    
    on_go_home_click: function() {
        cc.audioEngine.stopMusic();
        cc.audioEngine.playMusic(cc.url.raw("resources/sounds/button_click.mp3"));  
        cc.director.loadScene("start_scene");
    },
    
    on_stat_game: function() {
        this.fruits_type = this.random_type[this.type_index];
        this.type_index ++;
        if(this.type_index >= 5) {
            this.type_index = 0;
        } 
        // this.fruits_type = 1;
        this.sub_type = this.sub_type_index;
        this.sub_type_index ++;
        if(this.sub_type_index >= 3) {
            this.sub_type_index = 0;
        }
        // this.sub_type_index = 0;
        
        var name_type = ["red/null_red_", "yellow/null_yellow_", "green/null_green_", "org/null_org_", "purple/null_purple_"];
        var url = cc.url.raw("resources/" + name_type[this.fruits_type] + (this.sub_type + 1) + ".png");
        var sf = new cc.SpriteFrame(url);
        this.fruits_sprite.spriteFrame = sf;
        
        this.game_started = true;
    },
    
    on_checkout_failed: function() {
        this.on_player_error_anim();
        cc.audioEngine.stopMusic();
        // cc.audioEngine.playMusic(cc.url.raw("resources/sounds/ck_error.mp3"));
        this.game_started = false;
        this.scheduleOnce(function() {
            cc.audioEngine.stopMusic();
            cc.audioEngine.playMusic(cc.url.raw("resources/sounds/ck_error.mp3"));
        }.bind(this), 0);
        
        
        var rot1 = cc.rotateTo(0.05, -5);
        var rot2 = cc.rotateTo(0.1, 5);
        var rot3 = cc.rotateTo(0.05, 0);
        // var delay = cc.delayTime(1.0);
        var call_bk = cc.callFunc(function() {
            this.game_started = true;
        }.bind(this), this);
        
        var action_seq = cc.sequence([rot1, rot2, rot3, /*delay, */call_bk]);
        this.fruits_root.runAction(action_seq);
    },
    
    on_checkout_success: function() {
        this.game_started = false;
        this.on_player_right_anim();
        
        this.scheduleOnce(function() {
            cc.audioEngine.stopMusic();
            cc.audioEngine.playMusic(cc.url.raw("resources/sounds/ch_right.mp3"));
        }.bind(this), 0);
        // cc.audioEngine.playMusic(cc.url.raw("resources/sounds/ch_right.mp3"));
        
        this.play_win_particle();
        
        var name_type = ["red/red_", "yellow/yellow_", "green/green_", "org/org_", "purple/purple_"];
        var url = cc.url.raw("resources/" + name_type[this.fruits_type] + (this.sub_type + 1) + ".png");
        var sf = new cc.SpriteFrame(url);
        this.fruits_sprite.spriteFrame = sf;
        
        var scale1 = cc.scaleTo(0.2, 1.1);
        var scale2 = cc.scaleTo(0.1, 0.9);
        var scale3 = cc.scaleTo(0.2, 1.0);
        
        var action_seq = cc.sequence([scale1, scale2, scale3]);
        this.fruits_root.runAction(action_seq);
        
        this.scheduleOnce(this.on_stat_game.bind(this), 5);
    },
    
    on_checkout: function(m_type) {
        if(this.game_started === false) {
            return;
        }
        
        if(this.fruits_type == m_type) {
            this.on_checkout_success();
        }
        else {
            this.on_checkout_failed();
        }
    },
    
    update: function() {
        var win_size = cc.director.getWinSize();
        if(win_size.width != this.prev_size.width || win_size.height != this.prev_size.height) {
            this.prev_size = win_size;
            this.adjust_window(win_size);
            
            this.center_pos = this.fruits_root.convertToWorldSpaceAR(cc.Vec2(0, 0));
        }
    }
});
