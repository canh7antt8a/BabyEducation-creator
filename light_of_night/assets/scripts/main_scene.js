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

    // use this for initialization
    onLoad: function () {
        this.preload_sound();
        
        this.is_locking_click = false;
        this.ske_lingdang_com1 = cc.find("UI_ROOT/anchor-center/three_lingdang/ske_lingdanghua_1").getComponent(sp.Skeleton);
        this.ske_lingdang_com2 = cc.find("UI_ROOT/anchor-center/three_lingdang/ske_lingdanghua_2").getComponent(sp.Skeleton);
        this.ske_lingdang_com3 = cc.find("UI_ROOT/anchor-center/three_lingdang/ske_lingdanghua_3").getComponent(sp.Skeleton);
        
        this.ske_mogu_com = cc.find("UI_ROOT/anchor-center/mougu_and_yinhuochong/ske_mogu").getComponent(sp.Skeleton);
        this.click_mogu_times = 0;
        
        this.ske_cap_com = cc.find("UI_ROOT/anchor-center/cap_and_yinghuochong/ske_boli").getComponent(sp.Skeleton);
        this.lock_cap = false;
        
        this.lock_second_lingdang = true;
        this.lock_three_lingdang = true;
        
        this.lock_star_click = false;
        this.lock_mogu_click = false;
        
        this.is_firefly_out = false;
    },
    preload_sound: function() {
        var url = cc.url.raw("resources/sounds/firefly01.mp3");
        cc.loader.loadRes(url, function() {});
        url = cc.url.raw("resources/sounds/firefly02.mp3");
        cc.loader.loadRes(url, function() {});
        url = cc.url.raw("resources/sounds/firefly03.mp3");
        cc.loader.loadRes(url, function() {});
        
        url = cc.url.raw("resources/sounds/star_1.mp3");
        cc.loader.loadRes(url, function() {});
        url = cc.url.raw("resources/sounds/star_2.mp3");
        cc.loader.loadRes(url, function() {});
        url = cc.url.raw("resources/sounds/star_3.mp3");
        cc.loader.loadRes(url, function() {});
        url = cc.url.raw("resources/sounds/star_4.mp3");
        cc.loader.loadRes(url, function() {});
        
        url = cc.url.raw("resources/sounds/click_cap.mp3");
        cc.loader.loadRes(url, function() {});
        
        url = cc.url.raw("resources/sounds/fly_in_flower.mp3");
        cc.loader.loadRes(url, function() {});
        
        url = cc.url.raw("resources/sounds/click_mougu.mp3");
        cc.loader.loadRes(url, function() {});
    },
    
    play_sound: function(name) {
        var url_data = cc.url.raw(name);
        cc.audioEngine.stopMusic();
        this.call_latter(function() {
            cc.audioEngine.playMusic(url_data);
        }.bind(this), 0.02)
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    
    call_latter: function(callfunc, delay) {
        var delay_action = cc.delayTime(delay);
        var call_action = cc.callFunc(callfunc, this);
        var seq = cc.sequence([delay_action, call_action]);
        this.node.runAction(seq);
    },
    
    on_moon_click: function() {
        var moon = cc.find("UI_ROOT/anchor-background/moon");
        var s1 = cc.scaleTo(0.1, 1, 0.9);
        var s2 = cc.scaleTo(0.2, 1, 1.1);
        var s3 = cc.scaleTo(0.1, 1, 1.0);
        var seq = cc.sequence([s1, s2, s3]);
        moon.runAction(seq);
    },
    
    on_first_lingdang_click: function() {
        if(this.is_locking_click === true) {
            return;
        }
        this.is_locking_click = false;
        this.ske_lingdang_com1.timeScale = 1;
        this.ske_lingdang_com1.clearTracks();
        this.ske_lingdang_com1.setAnimation(0, "lingdanghua3", false);
        
        this.play_sound("resources/sounds/firefly01.mp3");
        
        this.call_latter(function() {
            this.is_locking_click = false;
            this.ske_lingdang_com1.timeScale = 0.3;
            this.ske_lingdang_com1.setAnimation(0, "lingdanghua1", true);
        }.bind(this), 3);
    },
    
    on_second_lingdang_click: function() {
        if(this.lock_second_lingdang) {
            return;
        }
        this.play_sound("resources/sounds/firefly02.mp3");
        
        this.ske_lingdang_com2.timeScale = 1;
        this.ske_lingdang_com2.clearTracks();
        this.ske_lingdang_com2.setAnimation(0, "lingdanghua3", false);
        this.call_latter(function() {
            this.ske_lingdang_com2.timeScale = 0.3;
            this.ske_lingdang_com2.clearTracks();
            this.ske_lingdang_com2.setAnimation(0, "lingdanghua1", true);
        }.bind(this), 3);
    },
    
    on_three_lingdang_click: function() {
        if(this.lock_three_lingdang) {
            return;
        }
        this.play_sound("resources/sounds/firefly03.mp3");
        
        this.ske_lingdang_com3.timeScale = 1;
        this.ske_lingdang_com3.clearTracks();
        this.ske_lingdang_com3.setAnimation(0, "lingdanghua3", false);
        this.call_latter(function() {
            this.ske_lingdang_com3.clearTracks();
            this.ske_lingdang_com3.timeScale = 0.3;
            this.ske_lingdang_com3.setAnimation(0, "lingdanghua1", true);
        }.bind(this), 3);
    },
    
    on_mougu_click: function() {
        if(this.lock_mogu_click) {
            return;
        }
        
        if(this.click_mogu_times >= 2) {
            return;
        }
        this.lock_mogu_click = true;
        
        this.click_mogu_times = this.click_mogu_times + 1;
        this.ske_mogu_com.clearTracks();
        this.ske_mogu_com.setAnimation(0, "mogu_with_click_with_firefly", false);
        this.play_sound("resources/sounds/click_mougu.mp3");
        
        this.call_latter(function() {
            if(this.click_mogu_times < 2) {
                this.ske_mogu_com.clearTracks();
                this.ske_mogu_com.setAnimation(0, "mogu_has_firefly", true);
                this.lock_mogu_click = false;
            }
            else { // 飞出萤火虫
                cc.find("UI_ROOT/anchor-center/mougu_and_yinhuochong/mogu_click_node").removeFromParent();
                this.ske_mogu_com.setAnimation(0, "mogu_without_firefly", false); // 引火虫播放
                var yinghuo_anim = cc.find("UI_ROOT/anchor-center/mougu_and_yinhuochong/ske_yinghuochong").getComponent(cc.Animation);
                yinghuo_anim.play("mogu_yinghuocong_feizou");
                
                this.call_latter(function() {
                    this.play_sound("resources/sounds/fly_in_flower.mp3");
                    
                    var yinghuochong = cc.find("UI_ROOT/anchor-center/mougu_and_yinhuochong/ske_yinghuochong");
                    yinghuochong.removeFromParent();
                    this.ske_lingdang_com2.clearTracks();
                    this.ske_lingdang_com2.timeScale = 0.3;
                    this.ske_lingdang_com2.setAnimation(0, "lingdanghua1", true);
                    this.lock_second_lingdang = false;
                }.bind(this), 8);
            }
        }.bind(this), 2);
    },
    
    on_cap_click: function() {
        if(this.lock_cap === true) {
            return;
        }
        
        this.ske_cap_com.clearTracks();
        this.ske_cap_com.setAnimation(0, "boli2", false);
        this.play_sound("resources/sounds/click_cap.mp3");
        this.lock_cap = true;
        
        this.call_latter(function(){
            this.lock_cap = false;
        }.bind(this), 4);
        
        // 解救萤火虫
        if(this.is_firefly_out === false) {
            this.is_firefly_out = true;
            var yinghuo_anim = cc.find("UI_ROOT/anchor-center/cap_and_yinghuochong/ske_yinghuochong2").getComponent(cc.Animation);
            yinghuo_anim.play("cap_yinghuochong_fei");
            this.call_latter(function() {
                var yinghuochong = cc.find("UI_ROOT/anchor-center/cap_and_yinghuochong/ske_yinghuochong2");
                yinghuochong.removeFromParent();
                this.play_sound("resources/sounds/fly_in_flower.mp3");
                
                this.ske_lingdang_com3.clearTracks();
                this.ske_lingdang_com3.timeScale = 0.3;
                this.ske_lingdang_com3.setAnimation(0, "lingdanghua1", true);
                this.lock_three_lingdang = false;
            }.bind(this), 10);    
        }
        
    },
    
    /*
    on_star_click: function() {
        if(this.lock_star_click) {
            return;
        }
        this.play_sound("resources/sounds/star_3.mp3");
        this.lock_star_click = true;
        var ske_xingxing = cc.find("UI_ROOT/anchor-center/touch_xingxing/ske_xingxing");
        
        var move_down = cc.moveBy(0.1, 0, -60);
        var move_up = cc.moveBy(0.2, 0, 100);
        var move_down2 = cc.moveBy(0.1, 0, -40);
        var func = cc.callFunc(function() {
            this.lock_star_click = false;
        }.bind(this), this);
        var seq = cc.sequence([move_down, move_up, move_down2, func]);
        ske_xingxing.runAction(seq);
    },*/
});
