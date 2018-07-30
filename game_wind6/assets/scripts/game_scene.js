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
        wind_value: 100,
        
        shine_set: {
            default: [],
            type: cc.Node,
        },
        
        time_per_light: 2,
        
        swator_set: {
            default: [],
            type: cc.Node,
        },
        
        tree_set: {
            default: [],
            type: cc.Node,
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
        this.checkout_root.active = true;
    }, 
    
    on_start_wind: function() {
        /*
        this.fengche_com.add_speed(400);
        for(var i = 0; i < this.flow_set.length; i ++) {
            var com = this.flow_set[i].getComponent("swing_action");
            if (!com) {
                console.log(this.flow_set[i].getName());
            }
            com.add_win();
        }*/
    },
    
    preload_sound: function() {
        var sound_list = [
            "resources/sounds/kim_clk2.mp3",
            "resources/sounds/kim_clk1.mp3",
            "resources/sounds/button.mp3",
            "resources/sounds/bg.mp3",
        ];
        
        for(var i = 0; i < sound_list.length; i ++) {
            var url = cc.url.raw(sound_list[i]);
            cc.loader.loadRes(url, function() {});    
        }
    }, 
    
    get_run_dst: function() {
        var rhs = this.touch_pos[this.touch_pos.length - 1];
        for(var i = this.touch_pos.length - 2; i >= 0; i --) {
            var lhs = this.touch_pos[i];
            var r = cc.p(rhs.x - lhs.x, rhs.y - lhs.y);
            var len = cc.pLength(r);
            if (len > 10) {
                var d_x = rhs.x + (1920 * r.x / len);
                var d_y = rhs.y + (1920 * r.y / len);        
                this.touch_pos.push(cc.p(d_x, d_y));
                return;
            }
        }
    }, 
    
    on_gen_flow_by_wind: function() {
        var delay_time = 0.1; 
        var count = 10 + Math.random() * 5;
        var time = 0.01;
        var speed = 1000;
        
        
        
        if(this.touch_pos.length <= 1) {
            return;
        }
        
        // console.log(this.test_touch_x);
        // console.log(this.test_touch_y);
     
        this.get_run_dst();
        
        
        for(var j = 0; j < count; j ++) {
            var actions = [];
            
            // var num = 1 + Math.random() * 25;
            var num = 1 + Math.random() * 15;
            num = Math.floor(num);
            if (num > 25) {
                num = 25;
            }
            
            var flow_name = "resources/textures/game_scene/tw" + num + ".png";
            
            var url = cc.url.raw(flow_name);
            var node = new cc.Node();
            var sprite_com = node.addComponent(cc.Sprite);
            sprite_com.spriteFrame = new cc.SpriteFrame(url);
            
            node.parent = this.flow_root
            node.x = this.touch_pos[0].x;
            node.y = this.touch_pos[0].y;
            node.scale = 0;
            
            actions.push(cc.delayTime(time));
            var func = cc.callFunc(function(){
                this.scale = 1;
                var f = cc.repeatForever(cc.rotateBy(3, 360));
                this.runAction(f);
            }.bind(node), node);
            actions.push(func);
            
            for(var i = 1; i < this.touch_pos.length; i ++) {
                var len = cc.pDistance(this.touch_pos[i], this.touch_pos[i - 1]);
                var per_time = len / speed;
                var m = cc.moveTo(per_time, this.touch_pos[i]);
                actions.push(m);
            }
            
            var fout = cc.fadeOut(0.5);
            actions.push(fout);
            
            var seq = cc.sequence(actions);
            node.runAction(seq);
            
            time += delay_time;
        }
        
    },
    
    // use this for initialization
    onLoad: function () {
        this.auto_show_card = true;
        this.type1 = false;
        this.type2 = false;
        this.type3 = false;
        this.type4 = false;
        
        
        this.checkout_root = cc.find("UI_ROOT/checkout_root");
        this.flow_root = cc.find("UI_ROOT/anchor-center/flow_root");
        
        this.touch_pos = []
        this.test_touch_x = [];
        this.test_touch_y = [];
        
        var touch = cc.find("UI_ROOT/anchor-center/touch_wind");
        
        touch.on('touchstart', function(event) {
            if (this.working_mode === false) {
                return;
            }
            this.has_move = false;
            this.touch_pos = [];
            
            this.test_touch_x = [];
            this.test_touch_y = [];
            this.node.stopAllActions();
            var pos = this.flow_root.convertToNodeSpaceAR(event.getLocation());
            this.touch_pos.push(pos);
            this.test_touch_x.push(pos.x);
            this.test_touch_y.push(pos.y);
        }.bind(this));
        
        touch.on('touchmove', function(event){
            if (this.working_mode === false) {
                return;
            }
            this.has_move = true;
            var pos = this.flow_root.convertToNodeSpaceAR(event.getLocation());
            this.touch_pos.push(pos);
            this.test_touch_x.push(pos.x);
            this.test_touch_y.push(pos.y);
        }.bind(this));
        
        touch.on('touchend', function(event){
            if (this.working_mode === false) {
                return;
            }
            if(this.has_move === true) {
                this.on_start_wind();
                this.has_move = false;
                var pos = this.flow_root.convertToNodeSpaceAR(event.getLocation());
                this.touch_pos.push(pos);
                this.test_touch_x.push(pos.x);
                this.test_touch_y.push(pos.y);
                this.on_gen_flow_by_wind();
            }
            this.node.stopAllActions();
            this.call_latter(function() {
                this.play_tip_anim();
            }.bind(this), 10);
            
        }.bind(this));
        
        touch.on('touchcancel', function(event){
            if (this.working_mode === false) {
                return;
            }
            
            if(this.has_move === true) {
                this.on_start_wind();
                this.has_move = false;
                var pos = this.flow_root.convertToNodeSpaceAR(event.getLocation());
                this.touch_pos.push(pos);
                this.test_touch_x.push(pos.x);
                this.test_touch_y.push(pos.y);
                this.on_gen_flow_by_wind();
                
                this.node.stopAllActions();
                this.call_latter(function() {
                    this.play_tip_anim();
                }.bind(this), 10);
            }
        }.bind(this));
        
       
        this.ske_kim_com = cc.find("UI_ROOT/anchor-center/kim").getComponent(sp.Skeleton);
        this.preload_sound();
        
        this.fengche_com = cc.find("UI_ROOT/anchor-center/fengche").getComponent("spinning");
        this.flow_set = cc.find("UI_ROOT/anchor-center/grass_root").children;
        
        
        this.start_touch_x = [826.56, 826.56, 823.6800000000001, 823.6800000000001, 823.6800000000001, 823.6800000000001, 817.9200000000001, 817.9200000000001, 815.04, 815.04, 800.6400000000001, 797.76, 794.8800000000001, 786.24, 783.3600000000001, 768.96, 754.56, 740.1600000000001, 722.8800000000001, 708.48, 696.96, 688.3199999999999, 619.2, 587.52, 544.3199999999999, 504, 486.72, 457.9200000000001, 437.76, 420.48, 394.55999999999995, 371.52, 348.48, 322.55999999999995, 296.6400000000001, 270.72, 244.79999999999995, 221.76, 195.83999999999992, 167.03999999999996, 144, 109.44000000000005, 83.51999999999998, 51.84000000000003, 28.800000000000068, -2.8799999999999955, -34.559999999999945, -60.48000000000002, -80.63999999999999, -100.79999999999995, -126.72000000000003, -152.64, -172.79999999999995, -201.60000000000002, -221.76, -241.91999999999996, -264.96000000000004, -285.12, -305.28, -325.43999999999994, -351.36, -374.4, -388.79999999999995, -403.20000000000005, -414.72, -426.24, -434.88, -443.52, -452.16, -457.92, -463.68, -469.44, -475.2, -480.96, -483.84, -489.6, -492.48, -495.36, -504, -506.88, -509.76, -512.64, -518.4, -521.28, -521.28, -524.1600000000001, -524.1600000000001, -524.1600000000001, -527.04, -527.04, -527.04, -527.04, -527.04, -527.04, -527.04, -527.04, -527.04, -527.04, -521.28, -518.4, -512.64, -504, -498.24, -489.6, -475.2, -469.44, -460.8, -449.28, -437.76, -420.48, -414.72, -394.55999999999995, -385.91999999999996, -374.4, -365.76, -354.24, -336.96000000000004, -331.20000000000005, -316.79999999999995, -299.52, -285.12, -267.84000000000003, -247.67999999999995, -230.39999999999998, -218.88, -204.48000000000002, -192.96000000000004, -175.67999999999995, -155.51999999999998, -141.12, -115.19999999999993, -95.03999999999996, -74.88, -60.48000000000002, -40.319999999999936, -25.91999999999996, -8.639999999999986, 0, 17.279999999999973, 28.800000000000068, 40.32000000000005, 57.60000000000002, 72, 83.51999999999998, 95.03999999999996, 103.68000000000006, 112.31999999999994, 129.5999999999999, 132.48000000000002, 138.24, 141.12000000000012, 149.76, 152.6400000000001, 158.4000000000001, 164.16000000000008, 167.03999999999996, 169.92000000000007, 172.79999999999995, 175.68000000000006, 178.55999999999995, 178.55999999999995, 181.44000000000005, 181.44000000000005, 181.44000000000005, 184.31999999999994, 184.31999999999994, 190.07999999999993, 190.07999999999993, 190.07999999999993, 190.07999999999993, 190.07999999999993, 190.07999999999993, 190.07999999999993, 190.07999999999993, 190.07999999999993, 190.07999999999993, 190.07999999999993, 190.07999999999993, 190.07999999999993, 190.07999999999993, 190.07999999999993, 190.07999999999993, 190.07999999999993, 190.07999999999993, 190.07999999999993, 190.07999999999993, 190.07999999999993, 190.07999999999993, 187.20000000000005, 187.20000000000005, 181.44000000000005, 178.55999999999995, 172.79999999999995, 164.16000000000008, 161.27999999999997, 158.4000000000001, 149.76, 146.8800000000001, 141.12000000000012, 135.36000000000013, 132.48000000000002, 123.83999999999992, 118.07999999999993, 112.31999999999994, 103.68000000000006, 92.16000000000008, 83.51999999999998, 77.75999999999999, 66.24000000000001, 57.60000000000002, 48.960000000000036, 31.680000000000064, 25.920000000000073, 11.519999999999982, 5.759999999999991, -2.8799999999999955, -14.399999999999977, -20.159999999999968, -37.43999999999994, -46.08000000000004, -57.60000000000002, -66.24000000000001, -77.75999999999999, -95.03999999999996, -106.55999999999995, -118.08000000000004, -126.72000000000003, -141.12, -149.76, -164.15999999999997, -172.79999999999995, -181.43999999999994, -195.84000000000003, -207.36, -216, -230.39999999999998, -247.67999999999995, -256.31999999999994, -273.6, -288, -299.52, -311.03999999999996, -316.79999999999995, -328.32000000000005, -339.84000000000003, -348.48, -360, -374.4, -383.03999999999996, -397.44000000000005, -406.08000000000004, -420.48, -432, -443.52, -455.04, -463.68, -472.32, -483.84, -501.12, -509.76, -515.52, -527.04, -538.56, -547.2, -558.72, -573.12, -587.52, -596.1600000000001, -607.6800000000001, -616.3199999999999, -627.84, -633.6, -642.24, -653.76, -665.28, -673.9200000000001, -682.56, -696.96, -702.72, -714.24, -720, -728.64, -740.16, -754.56, -763.2, -768.96, -774.72, -780.48, -789.12, -800.64, -809.28, -815.04, -820.8, -832.32, -835.2, -843.84, -855.36, -861.12, -866.88, -869.76];
        this.start_touch_y = [480.96000000000004, 478.08000000000004, 472.32000000000005, 469.44000000000005, 463.68000000000006, 457.9200000000001, 449.2800000000001, 440.64, 432, 423.36, 377.2800000000001, 365.76, 345.6, 328.32000000000005, 311.0400000000001, 285.12, 259.20000000000005, 239.04000000000008, 210.24, 198.72000000000003, 181.44000000000005, 172.80000000000007, 115.20000000000005, 86.39999999999998, 60.48000000000002, 31.680000000000064, 17.279999999999973, 0, -14.399999999999977, -23.039999999999964, -40.31999999999999, -57.599999999999966, -72, -83.51999999999998, -97.91999999999996, -109.44, -115.19999999999999, -120.95999999999998, -132.47999999999996, -138.24, -146.88, -152.64, -164.15999999999997, -172.8, -175.68, -187.2, -195.83999999999997, -201.59999999999997, -207.36, -207.36, -210.24, -213.12, -213.12, -213.12, -213.12, -213.12, -213.12, -213.12, -213.12, -213.12, -201.59999999999997, -195.83999999999997, -190.07999999999998, -184.32, -181.44, -175.68, -169.91999999999996, -164.15999999999997, -155.51999999999998, -152.64, -146.88, -135.36, -129.59999999999997, -123.83999999999997, -115.19999999999999, -106.56, -103.68, -95.03999999999996, -83.51999999999998, -74.88, -63.35999999999996, -51.839999999999975, -40.31999999999999, -28.799999999999955, -17.279999999999973, -2.8799999999999955, 14.399999999999977, 28.800000000000068, 46.08000000000004, 54.72000000000003, 66.24000000000001, 80.63999999999999, 89.27999999999997, 100.80000000000007, 115.20000000000005, 126.72000000000003, 135.36, 144, 161.27999999999997, 167.04000000000008, 172.80000000000007, 187.20000000000005, 195.84000000000003, 204.48000000000002, 216, 221.76, 230.39999999999998, 236.16000000000008, 250.56000000000006, 259.20000000000005, 264.96000000000004, 273.6, 279.36, 285.12, 290.88, 296.64, 308.1600000000001, 311.0400000000001, 313.9200000000001, 319.68000000000006, 322.56000000000006, 325.44000000000005, 336.96000000000004, 339.84000000000003, 342.72, 342.72, 345.6, 354.24, 354.24, 354.24, 354.24, 354.24, 354.24, 354.24, 354.24, 354.24, 354.24, 354.24, 351.36, 348.48, 336.96000000000004, 331.20000000000005, 316.80000000000007, 311.0400000000001, 302.4, 293.76, 288, 273.6, 273.6, 264.96000000000004, 259.20000000000005, 247.68000000000006, 244.80000000000007, 236.16000000000008, 227.51999999999998, 221.76, 207.36, 190.08000000000004, 184.32000000000005, 172.80000000000007, 164.16000000000008, 155.51999999999998, 141.12, 135.36, 129.60000000000002, 118.08000000000004, 106.56000000000006, 95.04000000000008, 86.39999999999998, 74.88, 60.48000000000002, 51.84000000000003, 43.200000000000045, 31.680000000000064, 20.159999999999968, 11.519999999999982, 0, -8.639999999999986, -20.159999999999968, -28.799999999999955, -40.31999999999999, -48.95999999999998, -51.839999999999975, -63.35999999999996, -69.12, -77.75999999999999, -80.63999999999999, -89.27999999999997, -100.80000000000001, -106.56, -120.95999999999998, -126.71999999999997, -132.47999999999996, -146.88, -149.76, -155.51999999999998, -164.15999999999997, -169.91999999999996, -178.56, -187.2, -195.83999999999997, -204.47999999999996, -210.24, -213.12, -221.76, -233.27999999999997, -236.15999999999997, -241.92000000000002, -247.68, -256.32, -262.08, -273.59999999999997, -276.48, -288, -293.76, -296.64, -302.4, -305.28, -316.79999999999995, -319.67999999999995, -328.32, -331.2, -336.96, -351.36, -351.36, -360, -362.88, -368.64, -374.4, -377.28, -380.15999999999997, -383.03999999999996, -388.79999999999995, -391.68, -397.44, -403.2, -406.08, -408.96000000000004, -411.84000000000003, -417.6, -420.48, -423.36, -426.24, -426.24, -432, -434.88, -437.76, -437.76, -440.64, -440.64, -446.4, -446.4, -449.28, -449.28, -452.15999999999997, -452.15999999999997, -452.15999999999997, -455.03999999999996, -455.03999999999996, -460.8, -460.8, -460.8, -463.68, -463.68, -466.56, -466.56, -469.44, -469.44, -475.2, -475.2, -475.2, -478.08, -478.08, -480.96, -480.96, -483.84, -483.84, -486.72, -489.6, -489.6, -489.6, -492.48, -492.48, -495.36, -495.36, -495.36, -498.24, -498.24, -498.24, -501.12, -504, -504, -504, -506.88, -506.88, -506.88, -506.88, -506.88, -506.88, -506.88];
    },
    
    play_tip_anim: function() {
        var len = this.start_touch_x.length;
        if (len > this.start_touch_y.length) {
            len = this.start_touch_y.length;
        }
        
        this.touch_pos = [];
        for(var i = len - 1; i >= 0; i --) {
            this.touch_pos.push(cc.p(this.start_touch_x[i], this.start_touch_y[i]));    
        }
        
        this.on_gen_flow_by_wind();
        
        this.call_latter(function() {
            this.play_tip_anim();
        }.bind(this), 10);
    },
    
    play_sound: function(name) {
        var url_data = cc.url.raw(name);
        cc.audioEngine.stopMusic();
        cc.audioEngine.playMusic(url_data);
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
        
        this.scheduleOnce(function() {
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
        if(this.lock_kim_click === true) {
            return;
        }
        this.play_kim_click_anim_with_random();
    },
    
    start_game: function() {
        this.working_mode = true;
        this.working_time = 0;
        this.play_tip_anim();
    },
    
    start: function() {
        this.fengche_com.add_speed(400);
         for(var i = 0; i < this.flow_set.length; i ++) {
            var com = this.flow_set[i].getComponent("swing_action");
            com.add_win();
        }
        
        this.working_mode = false;
        this.play_sound("resources/sounds/start.mp3");
        this.lock_kim_click = true;
        this.scheduleOnce(function() {
            this.ske_kim_com.clearTracks();
            this.ske_kim_com.setAnimation(0, "idle_1", true);
            this.lock_kim_click = false;
        }.bind(this), 0.9);
        //
        
        this.scheduleOnce(function(){
            var url_data = cc.url.raw("resources/sounds/bg.mp3");
            cc.audioEngine.stopMusic();
            cc.audioEngine.playMusic(url_data, true);
            this.start_game();
        }.bind(this), 5);
        
    },
    
});
