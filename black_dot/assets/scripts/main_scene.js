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
        ant_food_duration: 3.5,
        ant_food_anim_time: 10,
        move_ground_time: 1,
    },
    
    call_latter: function(callfunc, delay) {
        var delay_action = cc.delayTime(delay);
        var call_action = cc.callFunc(callfunc, this);
        var seq = cc.sequence([delay_action, call_action]);
        this.node.runAction(seq);
    },
    
    preload_sound: function() {
        var url = cc.url.raw("resources/sounds/ant_is_home.mp3");
        cc.loader.loadRes(url, function() {});
        
        url = cc.url.raw("resources/sounds/ant_is_strong.mp3");
        cc.loader.loadRes(url, function() {});
        
        url = cc.url.raw("resources/sounds/click_coff.mp3");
        cc.loader.loadRes(url, function() {});
        
        url = cc.url.raw("resources/sounds/click_lingdang.mp3");
        cc.loader.loadRes(url, function() {});
        
        url = cc.url.raw("resources/sounds/wator_fengzhang.mp3");
        cc.loader.loadRes(url, function() {});
        
        url = cc.url.raw("resources/sounds/ant01_chef_click.mp3");
        cc.loader.loadRes(url, function() {});
        
        url = cc.url.raw("resources/sounds/ant02_chef_click.mp3");
        cc.loader.loadRes(url, function() {});
        
        url = cc.url.raw("resources/sounds/ant03_chef_click.mp3");
        cc.loader.loadRes(url, function() {});
    },
    
    play_sound: function(name) {
        var url_data = cc.url.raw(name);
        cc.audioEngine.stopMusic();
        cc.audioEngine.playMusic(url_data);
    },
    
    // use this for initialization
    onLoad: function () {
        this.preload_sound();
        
        this.ant_chef_sound = ["resources/sounds/ant01_chef_click.mp3", "resources/sounds/ant02_chef_click.mp3", "resources/sounds/ant03_chef_click.mp3"];
        this.ant_sound_index = 0;
        
        this.ske_coff = cc.find("UI_ROOT/moving_root/anchor-center/coff_click_node/ske_coffcap");
        this.is_coff_clicking = false;
        
        this.is_ant_rescued = false;
        this.ske_ant = cc.find("UI_ROOT/moving_root/anchor-center/ant_root/ske_ant_coff");
        
        this.is_call_ant_qeue = false;
        
        this.water_dot_playing_state = 0;
        this.water_anim_com = cc.find("UI_ROOT/moving_root/anchor-center/castle_root/ske_dropletszfc").getComponent(sp.Skeleton);
        this.fengche_com = cc.find("UI_ROOT/moving_root/anchor-center/castle_root/ske_fengche").getComponent(sp.Skeleton);
        this.call_latter(function() {
            this.start_wator_anim();
        }.bind(this), 0.5);
        
        this.lock_fengche_click = false;
        this.lock_fengche_click2 = false;
        
        
        this.chef_ant_comp = cc.find("UI_ROOT/moving_root/anchor-center/ant_root/ant_under/ant_chef").getComponent(cc.Animation);
        
        this.lock_click_left_yezi = false;
        this.is_move_down = false;
        // 测试
        // this.move_to_ground_down();
        
        
        // this.ant_u01_comp = cc.find("UI_ROOT/moving_root/anchor-center/ant_root/ant_under/ant_u01").getComponent(cc.Animation);
        // this.ant_u02_comp = cc.find("UI_ROOT/moving_root/anchor-center/ant_root/ant_under/ant_u02").getComponent(cc.Animation);
        // this.ant_u03_comp = cc.find("UI_ROOT/moving_root/anchor-center/ant_root/ant_under/ant_u03").getComponent(cc.Animation);
        
        /*this.call_latter(function() {
            this.play_under_ground_ant1_anim();
            this.play_under_ground_ant2_anim();
            this.play_under_ground_ant3_anim();
        }.bind(this), 1);*/
    },
    
    on_click_left_shuye: function() {
        if(this.is_move_down === false  || this.lock_click_left_yezi === true) {
            return;
        }
        
        this.lock_click_left_yezi = true;
        var left_tree_comp = cc.find("UI_ROOT/moving_root/anchor-center/mask_shuye/tree_2").getComponent(cc.Animation);
        left_tree_comp.play("left_yezi_move1");
        
        var click_node = cc.find("UI_ROOT/moving_root/anchor-center/mask_shuye/tree_click")
        if (click_node) {
            click_node.removeFromParent(true);
        }
    }, 
    
    play_under_ground_ant1_anim: function() {
        
        // var r_time = 2 + 4 * Math.random();
        // r_time = Math.floor(r_time);
        var r_time = 1;
        this.call_latter(function() {
            var comp = cc.find("UI_ROOT/moving_root/anchor-center/ant_root/ant_under/ant_u01").getComponent(cc.Animation);
            comp.play("ant_under_move01");
        }.bind(this), r_time);
        
        this.call_latter(function() {
            this.play_under_ground_ant1_anim();
        }.bind(this), r_time + 8);
    },
    
    
    play_under_ground_ant2_anim: function() {
        // var r_time = 2 + 4 * Math.random();
        // r_time = Math.floor(r_time);
        var r_time = 1.7;
        this.call_latter(function() {
            var comp = cc.find("UI_ROOT/moving_root/anchor-center/ant_root/ant_under/ant_u02").getComponent(cc.Animation);
            comp.play("ant_under_move02");
        }.bind(this), r_time);
        
        this.call_latter(function() {
            this.play_under_ground_ant2_anim();
        }.bind(this), r_time + 8);
    },
    
    play_under_ground_ant3_anim: function() {
        // var r_time = 2 + 4 * Math.random();
        // r_time = Math.floor(r_time);
        var r_time = 2.4;
        this.call_latter(function() {
            var comp = cc.find("UI_ROOT/moving_root/anchor-center/ant_root/ant_under/ant_u03").getComponent(cc.Animation);
            comp.play("ant_under_move03");
        }.bind(this), r_time);
        
        this.call_latter(function() {
            this.play_under_ground_ant3_anim();
        }.bind(this), r_time + 10);
    },
    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    
    start_ant_food_anim: function() {
        var time = 0.1;
        
    
        var ant_no1 = cc.find("UI_ROOT/moving_root/anchor-center/ant_root/ant_qeque/ant_no1");
        var ant_no1_com = ant_no1.getComponent(cc.Animation);
        ant_no1_com.play("ant_food");
        
        time = this.ant_food_duration; 
        this.call_latter(function() {
            var ant_no2 = cc.find("UI_ROOT/moving_root/anchor-center/ant_root/ant_qeque/ant_no2");
            var ant_no2_com = ant_no2.getComponent(cc.Animation);
            ant_no2_com.play("ant_food");
            this.play_sound("resources/sounds/ant_is_strong.mp3");
        }.bind(this), time)
        
        time = time + this.ant_food_duration; 
        this.call_latter(function() {
            var ant_no3 = cc.find("UI_ROOT/moving_root/anchor-center/ant_root/ant_qeque/ant_no3");
            var ant_no3_com = ant_no3.getComponent(cc.Animation);
            ant_no3_com.play("ant_food");
        }.bind(this), time)
        
        time = time + this.ant_food_duration; 
        this.call_latter(function() {
            var ant_no4 = cc.find("UI_ROOT/moving_root/anchor-center/ant_root/ant_qeque/ant_no4");
            var ant_no4_com = ant_no4.getComponent(cc.Animation);
            ant_no4_com.play("ant_food");
        }.bind(this), time)
        
        time = time + this.ant_food_duration; 
        this.call_latter(function() {
            var ant_no5 = cc.find("UI_ROOT/moving_root/anchor-center/ant_root/ant_qeque/ant_no5");
            var ant_no5_com = ant_no5.getComponent(cc.Animation);
            ant_no5_com.play("ant_food");
        }.bind(this), time)
        
        time = time + this.ant_food_anim_time;
        this.call_latter(function() { // 切换到地下
            this.move_to_ground_down();
        }.bind(this), time);
    },
    
    move_to_ground_down:function() {
        var left_tree_comp = cc.find("UI_ROOT/moving_root/anchor-center/mask_shuye/tree_2").getComponent(cc.Animation);
        left_tree_comp.play("left_yezi_move0");
        
        var tree_1 = cc.find("UI_ROOT/moving_root/anchor-center/mask_shuye/tree_1").getComponent(cc.Animation);
        tree_1.play("tree_1_move");
        
        var tre_3 = cc.find("UI_ROOT/moving_root/anchor-center/mask_shuye/tree_3").getComponent(cc.Animation);
        tre_3.play("tree_3_move");
        
        var move_by = cc.moveBy(1, 0, 270 * 2);
        var moving_root = cc.find("UI_ROOT/moving_root");
        moving_root.runAction(move_by);
        this.play_sound("resources/sounds/ant_is_home.mp3");
        this.is_move_down = true;
        
    },
    
    on_coff_click:function () {
        if(this.is_coff_clicking === true) {
            return;
        }
        this.play_sound("resources/sounds/click_coff.mp3");
        this.is_coff_clicking = true;
        var ske_comp = this.ske_coff.getComponent(sp.Skeleton);
        ske_comp.clearTracks();
        ske_comp.setAnimation(0, "coffcap_open", false);
        
        this.call_latter(function() {
            ske_comp.clearTracks();
            // ske_comp.setAnimation(0, "coffcap_doudong", true);
            // ske_comp.clearTracks();
            ske_comp.setToSetupPose();
            
            this.is_coff_clicking = false;
        }.bind(this), 3);    
        
        if(this.is_ant_rescued === false) {
            this.is_ant_rescued = true;
            var anim = this.ske_ant.getComponent(cc.Animation);
            anim.play("coff_ant_move");
        }
    },
    
    on_call_ant_qeue_click: function() {
        if(this.is_call_ant_qeue === true) {
            return;
        }
        
        this.is_call_ant_qeue = true;
        this.play_sound("resources/sounds/click_lingdang.mp3");
        
        var bell_comp = cc.find("UI_ROOT/moving_root/anchor-center/ske_DflowDLHa").getComponent(sp.Skeleton);
        bell_comp.clearTracks();
        bell_comp.setAnimation(0, "dianjidoudong", false);
        this.scheduleOnce(function(){
            bell_comp.clearTracks();
            bell_comp.setAnimation(0, "Lingdanghuayaobai", true);
        }.bind(this), 1);
        
        
        // 播放蚂蚁动画
        this.start_ant_food_anim();
        // end 
    },
    
    start_wator_anim: function() {
        this.water_anim_com.clearTracks();
        this.water_anim_com.setAnimation(0, "shuizhuchuxian", false);
        this.call_latter(function() {
            this.water_anim_com.clearTracks();
            this.water_anim_com.setAnimation(0, "shuizhu", true);
            this.water_dot_playing_state = 1;
        }.bind(this), 1);
    }, 
    
    on_call_water_dot_click: function() {
        if(this.water_dot_playing_state != 1) {
            return;
        } 
        
        this.water_dot_playing_state = 2;
        this.water_anim_com.clearTracks();
        this.water_anim_com.setAnimation(0, "drople_shuizhufengche", false);
        
        this.lock_fengche_click = true;
        
        this.call_latter(function() {
            this.fengche_com.clearTracks();
            this.fengche_com.setAnimation(0, "fengchezhuandong", false);
            this.play_sound("resources/sounds/wator_fengzhang.mp3");
        }.bind(this), 2.8);
        
        this.call_latter(function() {
            this.lock_fengche_click = false;
        }.bind(this), 2.8 + 3);
        
        this.call_latter(function() {
            this.start_wator_anim();
        }.bind(this), 10);  
    },
    
    on_fengche_click:function() {
        if(this.lock_fengche_click2) {
            return;
        }
        
        if(this.lock_fengche_click) {
            return;
        }
        this.lock_fengche_click2 = true;
        this.fengche_com.clearTracks();
        this.fengche_com.setAnimation(0, "fengchezhuandong", false);
        this.call_latter(function() {
            this.lock_fengche_click2 = false;
        }.bind(this), 3);
    },
    
    // 必须加锁，时间关系，暂时不加
    on_chef_ant_click: function() {
        this.chef_ant_comp.play("ant_chef_hello");
        this.call_latter(function() {
            this.chef_ant_comp.play("ant_chef_idle");    
        }.bind(this), 1.2);
        
        this.play_sound(this.ant_chef_sound[this.ant_sound_index]);
        this.ant_sound_index ++;
        if(this.ant_sound_index >= 3) {
            this.ant_sound_index = 0;
        }
    },
});
