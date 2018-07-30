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
        }, 
        
        zhipian_set: {
            default: [],
            type: cc.Prefab,
        },
    },
    
    show_rain_card: function() {
        this.node.stopAllActions();
        this.is_playing_winding_sound = false;
        cc.find("UI_ROOT/show_card_root").active = true;
        cc.find("UI_ROOT/card_button").active = true;
        this.play_sound("resources/sounds/desic.mp3");
        
    },
    
    hide_rain_card: function() {
        cc.find("UI_ROOT/show_card_root").active = false;
    },

    on_checkout: function() {
        this.node.stopAllActions();
        this.is_playing_winding_sound = false;
        
        this.play_sound("resources/sounds/end.mp3");
        this.checkout_root.active = true;
    }, 
    
    get_check_num: function() {
        var num = 0;
        if(this.type1) {
            num ++;
        }
        
        if(this.type2) {
            num ++;
        }
        
        if(this.type3) {
            num ++;
        }
        
        if(this.type4) {
            num ++;
        }
        
        if(this.type5) {
            num ++;
        }
        return num;
    },
    
    zichuan_arrived: function() {
        this.type2 = true;
    },
    
    qiqiu_arrived: function() {
        this.type5 = true;
    },
    
    on_start_wind: function(type, w_pos) {
        if (this.active_wind === false) {
            return;    
        }
        
        if (this.is_playing_winding_sound === false) {
            this.is_playing_winding_sound = true;
            this.play_sound_loop("resources/sounds/feng.mp3");
        }
        this.node.stopAllActions();
        this.call_latter(function() {
            this.is_playing_winding_sound = false;
            cc.audioEngine.stopMusic();
        }.bind(this), 4);
        
        var pos = this.feng.parent.convertToNodeSpaceAR(w_pos);
        this.feng.setPosition(pos);
        this.feng.active = true;
        this.feng.getComponent("frame_anim").play(function(){
            this.feng.active = false;
        }.bind(this));
        
        if(type === 1) { // 风车
            this.f1_com.add_speed(this.wind_value);    
            this.type1 = true;
        }
        else if(type === 2) { // 纸船
            for(var i = 0; i < this.tree_set.length; i ++) {
                var com = this.tree_set[i].getComponent("swing_action");
                com.add_win();
                
                com = this.tree_set[i].getComponent("feng_move");
                com.add_win();
            }
            // this.type2 = true;
        }
        else if(type === 3) { // 稻草人
            for(var i = 0; i < this.swator_set.length; i ++) {
                var com = this.swator_set[i].getComponent("swing_action");
                com.add_win();
            }    
            for(var i = 0; i < this.juhua_set.length; i ++) {
                var com = this.juhua_set[i].getComponent("spinning3");
                com.add_wind();
            }
            this.type3 = true;
        }
        else if(type === 4) { // 炊烟
            this.smoke_com.add_win();    
            this.type4 = true;
        }
        else if(type === 5) { // 气球
            var qiqiu = cc.find("UI_ROOT/anchor-center/tw8/tw11"); 
            var com = qiqiu.getComponent("swing_action");
            com.add_win();
            
            qiqiu = cc.find("UI_ROOT/anchor-center/tw8"); 
            com = qiqiu.getComponent("swing_qiqiu");
            com.add_win();
        }
        else if(type === 6) { // 衣服
            for(var i = 0; i < this.yifu_set.length; i ++) {
                var com = this.yifu_set[i].getComponent("swing_action");
                com.add_win();
            }
            this.type6 = true;
        }
        else if(type === 7 && this.zhipian_set.length > 0) { // 纸片
            console.log("yes called ######");
            var index = Math.random() * this.zhipian_set.length;
            index = Math.floor(index);
            if (index >= this.zhipian_set.length) {
                index = 0;
            }
            var zhi = cc.instantiate(this.zhipian_set[index]);
            zhi.parent = this.zhi_root;
            zhi.scale = 0;
            var com = zhi.getComponent("goods_ctrl");
            com.add_wind();
            this.type7 = true;
        }
        else if(type === 8) { // 铃铛
            var com = this.lingdang.getComponent("swing_action");
            com.add_win();
            this.type8 = true;
        }
        
        if (type < 6) { // 远景,摇动草
            for(var i = 0; i < this.grass_set.length; i ++) {
                var com = this.grass_set[i].getComponent("spinning3");
                com.add_wind();
            }    
        }
        
        // 由近景，切换为远景
        if (this.type6 === true && this.type7 === true && this.type8 === true ) {
            this.active_wind = false;
            this.type6 = false;
            this.type7 = false;
            this.type8 = false;
            
            this.scheduleOnce(function() {
                this.far_root.active = true;
                this.near_root.active = true;
                var fout = cc.fadeOut(0.5);
                var func = cc.callFunc(function() {
                    this.active_wind = true;
                    this.near_root.active = false;
                    
                    this.is_playing_winding_sound = false;
                    cc.audioEngine.stopMusic();
                }.bind(this));
                var seq = cc.sequence([fout, func]);
                this.near_root.runAction(seq); 
            }.bind(this), 3);
            
            return;
        }
        
        var num = this.get_check_num();
        if(this.auto_show_card && num === 4) {
            this.auto_show_card = false;
            this.scheduleOnce(this.show_rain_card.bind(this), 2);
        }
        
        if(num === 5) {
            this.active_wind = false;
            this.scheduleOnce(this.on_checkout.bind(this), 2);
        }
    },
    
    preload_sound: function() {
        var sound_list = [
            "resources/sounds/kim_clk2.mp3",
            "resources/sounds/kim_clk1.mp3",
            "resources/sounds/button.mp3",
        ];
        
        for(var i = 0; i < sound_list.length; i ++) {
            var url = cc.url.raw(sound_list[i]);
            cc.loader.loadRes(url, function() {});    
        }
    }, 
    
    replay_game: function() {
        
        this.start_game();
    },
    
    // use this for initialization
    onLoad: function () {
        this.auto_show_card = true;
        this.type1 = false;
        this.type2 = false;
        this.type3 = false;
        this.type4 = false;
        this.type5 = false;
        this.type6 = false;
        this.type7 = false;
        this.type8 = false;
        this.active_wind = false;
        
        this.checkout_root = cc.find("UI_ROOT/checkout_root");
        this.f1_com = cc.find("UI_ROOT/anchor-center/f1").getComponent("spinning");
        this.smoke_com = cc.find("UI_ROOT/anchor-center/tri_yan").getComponent("smoke_action");
        
        this.far_root = cc.find("UI_ROOT/anchor-center");
        this.near_root = cc.find("UI_ROOT/near_root");
        
        var touch = cc.find("UI_ROOT/anchor-center/t1");
        
        touch.on('touchstart', function(event) {
            this.has_move = false;
            this.start_pos = event.getLocation();
        }.bind(this));
        
        touch.on('touchmove', function(event){
            this.has_move = true;
        }.bind(this));
        
        touch.on('touchend', function(event){
            if(this.has_move === true) {
                var c_pos = event.getLocation();
                c_pos.x = (this.start_pos.x + c_pos.x) / 2;
                c_pos.y = (this.start_pos.y + c_pos.y) / 2;
                this.on_start_wind(1, c_pos);
                this.has_move = false;
            }
        }.bind(this));
        
        touch.on('touchcancel', function(event){
            if(this.has_move === true) {
                var c_pos = event.getLocation();
                c_pos.x = (this.start_pos.x + c_pos.x) / 2;
                c_pos.y = (this.start_pos.y + c_pos.y) / 2;
                
                this.on_start_wind(1, c_pos);
                this.has_move = false;
            }
        }.bind(this));
        
        touch = cc.find("UI_ROOT/anchor-center/t2");
        
        touch.on('touchstart', function(event) {
            this.has_move = false;
            this.start_pos = event.getLocation();
        }.bind(this));
        
        touch.on('touchmove', function(event){
            this.has_move = true;
        }.bind(this));
        
        touch.on('touchend', function(event){
            if(this.has_move === true) {
                var c_pos = event.getLocation();
                c_pos.x = (this.start_pos.x + c_pos.x) / 2;
                c_pos.y = (this.start_pos.y + c_pos.y) / 2;
                this.on_start_wind(2, c_pos);
                this.has_move = false;
            }
        }.bind(this));
        
        touch.on('touchcancel', function(event){
            if(this.has_move === true) {
                var c_pos = event.getLocation();
                c_pos.x = (this.start_pos.x + c_pos.x) / 2;
                c_pos.y = (this.start_pos.y + c_pos.y) / 2;
                this.on_start_wind(2, c_pos);
                this.has_move = false;
            }
        }.bind(this));
        
        touch = cc.find("UI_ROOT/anchor-center/t3");
        
        touch.on('touchstart', function(event) {
            this.has_move = false;
            this.start_pos = event.getLocation();
        }.bind(this));
        
        touch.on('touchmove', function(event){
            this.has_move = true;
        }.bind(this));
        
        touch.on('touchend', function(event){
            if(this.has_move === true) {
                var c_pos = event.getLocation();
                c_pos.x = (this.start_pos.x + c_pos.x) / 2;
                c_pos.y = (this.start_pos.y + c_pos.y) / 2;
                this.on_start_wind(3, c_pos);
                this.has_move = false;
            }
        }.bind(this));
        
        touch.on('touchcancel', function(event){
            if(this.has_move === true) {
                var c_pos = event.getLocation();
                c_pos.x = (this.start_pos.x + c_pos.x) / 2;
                c_pos.y = (this.start_pos.y + c_pos.y) / 2;
                this.on_start_wind(3, c_pos);
                this.has_move = false;
            }
        }.bind(this));
        
        touch = cc.find("UI_ROOT/anchor-center/t4");
        
        touch.on('touchstart', function(event) {
            this.has_move = false;
            this.start_pos = event.getLocation();
        }.bind(this));
        
        touch.on('touchmove', function(event){
            this.has_move = true;
        }.bind(this));
        
        touch.on('touchend', function(event){
            if(this.has_move === true) {
                var c_pos = event.getLocation();
                c_pos.x = (this.start_pos.x + c_pos.x) / 2;
                c_pos.y = (this.start_pos.y + c_pos.y) / 2;
                this.on_start_wind(4, c_pos);
                this.has_move = false;
            }
        }.bind(this));
        
        touch.on('touchcancel', function(event){
            if(this.has_move === true) {
                var c_pos = event.getLocation();
                c_pos.x = (this.start_pos.x + c_pos.x) / 2;
                c_pos.y = (this.start_pos.y + c_pos.y) / 2;
                this.on_start_wind(4, c_pos);
                this.has_move = false;
            }
        }.bind(this));
        
        touch = cc.find("UI_ROOT/anchor-center/t5");
        touch.on('touchstart', function(event) {
            this.has_move = false;
            this.start_pos = event.getLocation();
        }.bind(this));
        
        touch.on('touchmove', function(event){
            this.has_move = true;
        }.bind(this));
        
        touch.on('touchend', function(event){
            if(this.has_move === true) {
                var c_pos = event.getLocation();
                c_pos.x = (this.start_pos.x + c_pos.x) / 2;
                c_pos.y = (this.start_pos.y + c_pos.y) / 2;
                this.on_start_wind(5, c_pos);
                this.has_move = false;
            }
        }.bind(this));
        
        touch.on('touchcancel', function(event){
            if(this.has_move === true) {
                var c_pos = event.getLocation();
                c_pos.x = (this.start_pos.x + c_pos.x) / 2;
                c_pos.y = (this.start_pos.y + c_pos.y) / 2;
                this.on_start_wind(5, c_pos);
                this.has_move = false;
            }
        }.bind(this));
        
        touch = cc.find("UI_ROOT/near_root/t1");
        touch.on('touchstart', function(event) {
            this.has_move = false;
            this.start_pos = event.getLocation();
        }.bind(this));
        
        touch.on('touchmove', function(event){
            this.has_move = true;
        }.bind(this));
        
        touch.on('touchend', function(event){
            if(this.has_move === true) {
                var c_pos = event.getLocation();
                c_pos.x = (this.start_pos.x + c_pos.x) / 2;
                c_pos.y = (this.start_pos.y + c_pos.y) / 2;
                this.on_start_wind(6, c_pos);
                this.has_move = false;
            }
        }.bind(this));
        
        touch.on('touchcancel', function(event){
            if(this.has_move === true) {
                var c_pos = event.getLocation();
                c_pos.x = (this.start_pos.x + c_pos.x) / 2;
                c_pos.y = (this.start_pos.y + c_pos.y) / 2;
                this.on_start_wind(6, c_pos);
                this.has_move = false;
            }
        }.bind(this));
        
        touch = cc.find("UI_ROOT/near_root/t2");
        touch.on('touchstart', function(event) {
            this.has_move = false;
            this.start_pos = event.getLocation();
        }.bind(this));
        
        touch.on('touchmove', function(event){
            this.has_move = true;
        }.bind(this));
        
        touch.on('touchend', function(event){
            if(this.has_move === true) {
                var c_pos = event.getLocation();
                c_pos.x = (this.start_pos.x + c_pos.x) / 2;
                c_pos.y = (this.start_pos.y + c_pos.y) / 2;
                this.on_start_wind(7, c_pos);
                this.has_move = false;
            }
        }.bind(this));
        
        touch.on('touchcancel', function(event){
            if(this.has_move === true) {
                var c_pos = event.getLocation();
                c_pos.x = (this.start_pos.x + c_pos.x) / 2;
                c_pos.y = (this.start_pos.y + c_pos.y) / 2;
                this.on_start_wind(7, c_pos);
                this.has_move = false;
            }
        }.bind(this));
        
        touch = cc.find("UI_ROOT/near_root/t3");
        touch.on('touchstart', function(event) {
            this.has_move = false;
            this.start_pos = event.getLocation();
        }.bind(this));
        
        touch.on('touchmove', function(event){
            this.has_move = true;
        }.bind(this));
        
        touch.on('touchend', function(event){
            if(this.has_move === true) {
                var c_pos = event.getLocation();
                c_pos.x = (this.start_pos.x + c_pos.x) / 2;
                c_pos.y = (this.start_pos.y + c_pos.y) / 2;
                this.on_start_wind(8, c_pos);
                this.has_move = false;
            }
        }.bind(this));
        
        touch.on('touchcancel', function(event){
            if(this.has_move === true) {
                var c_pos = event.getLocation();
                c_pos.x = (this.start_pos.x + c_pos.x) / 2;
                c_pos.y = (this.start_pos.y + c_pos.y) / 2;
                this.on_start_wind(8, c_pos);
                this.has_move = false;
            }
        }.bind(this));
        
        
        this.work_count = 0;
        this.preload_sound();
        this.now_shine_index = 0;
        this.is_playing_winding_sound = false;
        this.feng = cc.find("UI_ROOT/feng");
        
        this.grass_set = cc.find("UI_ROOT/anchor-center/grass_root").children;
        this.juhua_set = cc.find("UI_ROOT/anchor-center/juhua_root").children;
        this.yifu_set = cc.find("UI_ROOT/near_root/yifu").children;
        this.lingdang = cc.find("UI_ROOT/near_root/twn4");
        // this.zhipian_set = cc.find("UI_ROOT/near_root/zhi_root").children;
        this.zhi_root = cc.find("UI_ROOT/near_root/zhi_root");
    },
    
    play_sound: function(name) {
        var url_data = cc.url.raw(name);
        cc.audioEngine.stopMusic();
        this.scheduleOnce(function(){
            cc.audioEngine.playMusic(url_data);
        }, 0.016);
    },
    
    play_sound_loop: function(name) {
        var url_data = cc.url.raw(name);
        cc.audioEngine.stopMusic();
        cc.audioEngine.playMusic(url_data, true);
    },
    
    call_latter: function(callfunc, delay) {
        var delay_action = cc.delayTime(delay);
        var call_action = cc.callFunc(callfunc, this);
        var seq = cc.sequence([delay_action, call_action]);
        this.node.runAction(seq);
    },
    
    start_game: function() {
        for(var i = 0; i < this.tree_set.length; i ++) {
            var com = this.tree_set[i].getComponent("feng_move");
            com.reset();
        }
            
        this.type1 = false;
        this.type2 = false;
        this.type3 = false;
        this.type4 = false;
        this.type5 = false;
        this.type6 = false;
        this.type7 = false;
        this.type8 = false;
        
        this.far_root.active = false;
        this.near_root.active = true;
        this.near_root.opacity = 255;
        
        this.active_wind = true;
        this.working_mode = true;
        this.working_time = 0;
        this.zhi_root.removeAllChildren();
        
        var qiqiu = cc.find("UI_ROOT/anchor-center/tw8"); 
        com = qiqiu.getComponent("swing_qiqiu");
        com.reset();
            
        this.checkout_root.active = false;
    },
    
    play_start_anim: function() {
        var JXM = cc.find("UI_ROOT/JXM");
        JXM.active = true;
        
        var ske_com = JXM.getComponent(sp.Skeleton);
        ske_com.clearTracks();
        ske_com.setAnimation(0, "in", false);
        ske_com.addAnimation(0, "idle_1", true);
        
        cc.audioEngine.stopMusic(false);
        var url = cc.url.raw("resources/sounds/start.mp3");
        cc.audioEngine.playMusic(url, false);
        
        this.scheduleOnce(function() {
            ske_com.clearTracks();
            ske_com.setAnimation(0, "out", false);
        }.bind(this), 4);
    },
    
    start: function() {
        this.feng.active = false;
        this.play_start_anim();
        this.start_game();
    },
    
});
