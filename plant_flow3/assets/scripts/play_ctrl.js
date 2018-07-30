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
        opt_set: {
            default: [],
            type: cc.Node,
        },
        
        hit_box: {
            default: [],
            type: cc.Node,
        },
        
        flow_set: {
            default: [],
            type: cc.Node,
        }, 
    },
    
    on_hit_test: function(hit_box) {
        for(var i = 0; i < this.hit_box.length; i ++) {
            if (this.hit_mask[i] === 1) {
                continue;
            }
            
            var box = this.hit_box[i].getBoundingBox();
            if (hit_box.intersects(box)) {
                return i;
            }
        }
        return -1;
    }, 
    
    play_sound: function(name) {
        cc.audioEngine.stopMusic(false);
        var url = cc.url.raw(name);
        cc.audioEngine.playMusic(url, false);
    },
    
    play_bozhong_anim: function(index) {
        var xpos_set = [-1740, -1275, -831];
        var ypos_set = [-237, -237, -237];
        
        this.watu.active = false;
        this.shifei.active = false;
        this.sashui.active = false;
        this.bozhong.active = true;
        
        this.bozhong.x = this.opt_item.x;
        this.bozhong.y = this.opt_item.y;
        
        var action = cc.moveTo(1, xpos_set[index], ypos_set[index]);
        var func = cc.callFunc(function() {
            this.bozhong.active = false;
            var flow = this.flow_set[index].getComponent("flow");
            flow.show_stage(1);
            this.play_sound("resources/sounds/bozhong.mp3");
        }.bind(this), this);
        
        var seq = cc.sequence([action, func]);
        this.bozhong.runAction(seq);
        
        return 1;
    },
    
    play_watu_anim: function(index) {
        var xpos_set = [-1750, -1290, -846];
        var ypos_set = [-308, -308, -308];
        
        this.watu.active = true;
        this.shifei.active = false;
        this.sashui.active = false;
        this.bozhong.active = false;
        
        this.watu.x = xpos_set[index];
        this.watu.y = ypos_set[index];
        
        var sp_com = this.watu.getComponent(sp.Skeleton);
        sp_com.clearTracks();
        sp_com.setAnimation(0, "chantu", false);
        
        
        this.scheduleOnce(function(){
            var flow = this.flow_set[index].getComponent("flow");
            flow.show_tu(true);
            this.play_sound("resources/sounds/watu.mp3");
        }.bind(this), 1.4);
        
        
        this.scheduleOnce(function() {
            this.watu.active = false;
        }.bind(this), 3);
        
        return 4;
    }, 
    
    play_jiaoshui_anim: function(index, stage) {
        var xpos_set = [-1750, -1290, -846];
        var ypos_set = [-340, -340, -340];
        
        this.watu.active = false;
        this.shifei.active = false;
        this.sashui.active = true;
        this.bozhong.active = false;
        
        this.sashui.x = xpos_set[index];
        this.sashui.y = ypos_set[index];
        
        var sp_com = this.sashui.getComponent(sp.Skeleton);
        sp_com.clearTracks();
        sp_com.setAnimation(0, "jiaoshui", false);
        this.play_sound("resources/sounds/jiaoshui.mp3");
        
        this.scheduleOnce(function(){
            var flow = this.flow_set[index].getComponent("flow");
            // flow.show_stage(2); 
            flow.show_stage(stage); 
            this.play_sound("resources/sounds/upgrade.mp3");
        }.bind(this), 3);
        
        
        this.scheduleOnce(function() {
            this.sashui.active = false;
        }.bind(this), 3);
        
        return 4;
    }, 
    
    play_sifei_anim: function(index, stage) {
         var xpos_set = [-1840, -1380, -940];
        var ypos_set = [-420, -420, -420];
        
        this.watu.active = false;
        this.shifei.active = true;
        this.sashui.active = false;
        this.bozhong.active = false;
        
        this.shifei.x = xpos_set[index];
        this.shifei.y = ypos_set[index];
        
        var sp_com = this.shifei.getComponent(sp.Skeleton);
        sp_com.clearTracks();
        sp_com.setAnimation(0, "shifei", false);
        this.play_sound("resources/sounds/sifei.mp3");
        
        this.scheduleOnce(function(){
            var flow = this.flow_set[index].getComponent("flow");
            flow.show_stage(stage); 
            this.play_sound("resources/sounds/upgrade.mp3");
        }.bind(this), 3);
        
        
        this.scheduleOnce(function() {
            this.shifei.active = false;
        }.bind(this), 3);
        
        return 4;
    },
    
    is_next_step: function() {
        for(var i = 0; i < this.hit_mask.length; i ++) {
            if (this.hit_mask[i] === 0) {
                return false;
            }
        }
        
        return true;
    }, 
    
    play_stage_one_anim: function(index) {
        var time = 0;
        // 播放动画
        if(this.now_step === 0) { // 挖土
            time = this.play_watu_anim(index);
        }
        else if(this.now_step === 1) { // 播种
            time = this.play_bozhong_anim(index);
        }// end
        else if(this.now_step === 2) { // 浇水
            time = this.play_jiaoshui_anim(index, 2);
        }
        // end
        return time;
    }, 
    
    play_stage_two_anim: function(index) {
        var time = 0;
        if(this.now_step === 0) {
            time = this.play_sifei_anim(index, 3);
        }
        return time;
    }, 
    
    play_stage_three_anim: function(index) {
        var time = 0;
        if(this.now_step === 0) {
            time = this.play_jiaoshui_anim(index, 4);
        }
        return time;
    }, 
    
    play_stage_five_anim: function(index) {
        var time = 0;
        if(this.now_step === 0) {
            time = this.play_jiaoshui_anim(index, 6);
        }
        return time;
    }, 
    
    on_touch_move: function(event) {
        if(this.hit_move === false) {
            return;
        }
        var pos = this.opt_item.getParent().convertTouchToNodeSpace(event);
        this.opt_item.setPosition(pos);
        var bound_box = this.opt_item.getBoundingBox();
        var index = this.on_hit_test(bound_box); 
        if (index < 0) {
            return;
        }
        this.hit_move = false;
        var time = 3;
        if (this.now_stage === 1) {
            time = this.play_stage_one_anim(index);
        }
        else if(this.now_stage === 2) {
            time = this.play_stage_two_anim(index);
        }
        else if(this.now_stage === 3) {
            time = this.play_stage_three_anim(index);
        }
        else if(this.now_stage === 5) {
            time = this.play_stage_five_anim(index);
        }
        this.hit_mask[index] = 1; 
            
        // 猫爪移回去
        this.cat.runAction(cc.moveBy(0.5, 440, 0));
        this.opt_item.x = this.start_x;
        this.opt_item.y = this.start_y;
        // end 
        if (this.is_next_step()) {
            this.now_step ++;
            this.hit_mask = [0, 0, 0];
        }
        this.scheduleOnce(this.play_next_opt.bind(this), time);
    },
    // use this for initialization
    onLoad: function () {
        this.start_x = -53;
        this.start_y = 52;
        
        this.sun_root = cc.find("UI_ROOT/sun_root");
        this.game_scene = cc.find("UI_ROOT").getComponent("game_scene");
        var url = cc.url.raw('resources/textures/game_scene/throw_sun.png');
        this.sun_frame = new cc.SpriteFrame(url);
        
        url = cc.url.raw('resources/textures/game_scene/throw_icon.png');
        this.throw_frame = new cc.SpriteFrame(url);
        
        // this.watu = this.node.getChildByName("watu");
        this.watu = cc.find("UI_ROOT/anchor-center/ctrl_root_bottom/watu");
        this.shifei = this.node.getChildByName("shifei");
        this.sashui = this.node.getChildByName("sashui");
        this.bozhong = this.node.getChildByName("bozhong");
        
        this.cat = this.node.getChildByName("cat");
        this.opt_item = this.node.getChildByName("opt_item");
        
         this.opt_item.on('touchstart', function(event) {
            this.hit_move = true;
            var bound_box = this.opt_item.getBoundingBox(); 
            var pos = this.opt_item.getParent().convertTouchToNodeSpace(event);
            if(bound_box.contains(pos)) {
                event.stopPropagation();
            }
        }.bind(this));
        
        this.opt_item.on('touchmove', this.on_touch_move.bind(this));
        
        this.opt_item.on('touchend', function(event){
            if(this.hit_move === true) { // 继续伸手
                // this.play_next_opt();
                this.opt_item.x = this.start_x - 440;
                this.opt_item.y = this.start_y;
            }
        }.bind(this));
        
        this.opt_item.on('touchcancel', function(event){
            if(this.hit_move === true) { // 继续伸手
                this.opt_item.x = this.start_x - 440;
                this.opt_item.y = this.start_y;
            }
        }.bind(this));
    },
    
    play_throw_flow_anim: function() {
        var start_xpos_set = [-470, 0, 470];
        var start_ypos_set = [-160, -160, -160];
        var delay;
        this.hit_flow = [];
        for(var i = 0; i < 3; i ++) {
            delay = 0;
            for(var j = 0; j < 10; j ++) { // 左边的
                var throw_flow = new cc.Node();
                throw_flow.addComponent(cc.Sprite);
                
                throw_flow.parent = this.sun_root;
                var sprite_com = throw_flow.getComponent(cc.Sprite);
                sprite_com.spriteFrame = this.throw_frame.clone();
                
                throw_flow.x = start_xpos_set[i];
                throw_flow.y = start_ypos_set[i];
                this.hit_flow.push(throw_flow);
                
                var throw_com = throw_flow.addComponent("throw_action");
                throw_com.play(delay);
                delay += 0.2;
                
                // throw_flow.setContentSize(54, 54);
                
            }
        }
        this.play_sound("resources/sounds/kaihua.mp3");
        
        this.scheduleOnce(function() {
            this.now_stage ++;
            this.now_step = 0;
            this.play_next_opt();
        }.bind(this), 4);
    },
    
    get_sun: function(sun) {
        if(this.now_stage !== 4) {
            return;
        }
        var xpos_set = [-470, 0, 470];
        var ypos_set = [-315, -315, -315];
        
        var x = xpos_set[this.now_give];
        var y = ypos_set[this.now_give];
        var upgrade = 0
        var index = this.now_give;
        
        this.hit_mask[this.now_give] += 1;
        if(this.hit_mask[this.now_give] >= 3) { // 植物长大
            upgrade = 1;
        }
        
        this.now_give ++;
        if(this.now_give >= this.hit_mask.length) {
            this.now_give = 0;
        }
        
        sun.stopAllActions();
        var m = cc.moveTo(1, x, y);
        var fout = cc.fadeOut(0.1);
        
        var func = cc.callFunc(function(){
            if(upgrade) {
                var flow = this.flow_set[index].getComponent("flow");
                flow.show_stage(5); 
                this.play_sound("resources/sounds/upgrade.mp3");
            }
        }.bind(this));
        
        var func2 = cc.callFunc(function(){
            var flow = this.flow_set[index].getChildByName("getsun");
            var part_com = flow.getComponent(cc.ParticleSystem);
            part_com.stopSystem();
            part_com.resetSystem();
            this.play_sound("resources/sounds/xiyangguang.mp3");
        }.bind(this));
        
        var seq = cc.sequence([m, func2, fout, func]);
        sun.runAction(seq);
        for(var i = 0; i < this.hit_mask.length; i ++) {
            if(this.hit_mask[i] < 3) {
                return;
            }
        }
        
        // 进入下一个阶段
        this.now_stage ++;
        this.now_step = 0;
        this.hit_mask = [0, 0, 0];
        this.scheduleOnce(this.play_next_opt.bind(this), 2);
        // end
    },
    
    play_give_sun: function() {
        if(this.now_stage !== 4) {
            return;
        }
        
        var sun = new cc.Node();
        sun.addComponent(cc.Sprite);
        sun.parent = this.sun_root;
        sun.scale = 2;
        
        var sum_com = sun.getComponent(cc.Sprite);
        sum_com.spriteFrame = this.sun_frame.clone();
        
        sun.x = (Math.random() - 0.5) * 1000;
        sun.y = 700;
        
        var m = cc.moveTo(5.5, sun.x, -20);
        var fout = cc.fadeOut(0.4);
        var func = cc.callFunc(function() {
            sun.removeFromParent();
        }.bind(this), this);
        
        var seq = cc.sequence([m, fout, func]);
        sun.runAction(seq);
        
        this.scheduleOnce(function(){
            this.play_give_sun();
        }.bind(this), 2);
        
        sun.on("touchstart", function(event) {
            event.stopPropagation();
            this.get_sun(sun);
        }.bind(this));
    },
    
    play_next_opt: function() {
        
        for(var i = 0; i < this.opt_set.length; i ++) {
            this.opt_set[i].active = false;
        }
        
        if (this.now_stage === 1) { // 第一阶段
            if(this.now_step === 0) { // 挖土
                this.opt_set[0].active = true;    
                this.cat.runAction(cc.moveBy(0.5, -440, 0));
                this.opt_item.runAction(cc.moveBy(0.5, -440, 0));
            }
            else if(this.now_step === 1) { // 播种
                if(this.hit_mask[0] + this.hit_mask[1] + this.hit_mask[2] <= 0) {
                    this.play_sound("resources/sounds/step2.mp3");
                }
                
                this.opt_set[1].active = true;
                this.cat.runAction(cc.moveBy(0.5, -440, 0));
                this.opt_item.runAction(cc.moveBy(0.5, -440, 0));
            }
            else if(this.now_step === 2) { // 浇水
                if(this.hit_mask[0] + this.hit_mask[1] + this.hit_mask[2] <= 0) {
                    this.play_sound("resources/sounds/step3.mp3");
                }
                this.opt_set[2].active = true;
                this.cat.runAction(cc.moveBy(0.5, -440, 0));
                this.opt_item.runAction(cc.moveBy(0.5, -440, 0));
            }
            else {
                this.now_step = 0;
                this.now_stage = 2;
                this.play_sound("resources/sounds/step4.mp3");
            }
            
        } 
        
        if (this.now_stage === 2) { // 第二个阶段
            if(this.now_step === 0) {
                this.opt_set[3].active = true;    
                this.cat.runAction(cc.moveBy(0.5, -440, 0));
                this.opt_item.runAction(cc.moveBy(0.5, -440, 0));
            }
            else {
                this.now_step = 0;
                this.now_stage = 3;
                this.play_sound("resources/sounds/step5.mp3");
            }
        } 
        
        if (this.now_stage === 3) { // 第三个阶段
            if(this.now_step === 0) { // 浇水
                this.opt_set[2].active = true;
                
                this.cat.runAction(cc.moveBy(0.5, -440, 0));
                this.opt_item.runAction(cc.moveBy(0.5, -440, 0));
            }
            else { // 
                this.now_step = 0;
                this.now_stage = 4;
                this.play_sound("resources/sounds/step6.mp3");
            }
        }
        
        if (this.now_stage === 4) { // 丢太阳
            // this.game_scene.show_season(1);
            this.play_give_sun();
        }
        
        if(this.now_stage === 5) { // 浇水
            this.sun_root.removeAllChildren();
            
            if(this.now_step === 0) {
                this.opt_set[2].active = true;
                this.cat.runAction(cc.moveBy(0.5, -440, 0));
                this.opt_item.runAction(cc.moveBy(0.5, -440, 0));    
            }
            else {
                this.now_stage ++;
                this.now_step = 0;
            }
        }
        
        if(this.now_stage === 6) { // 拾花瓣
            // this.game_scene.show_season(2);
            this.play_throw_flow_anim();
        }
        
        if(this.now_stage === 7) { // 进入收花模式
            this.game_scene.play_recv_flow_mode(this.hit_flow); 
        }
    }, 
    
    show_opt: function(s) {
        this.sun_root.removeAllChildren();
        this.now_stage = s;
        this.now_step = 0;
        this.hit_mask = [0, 0, 0];
        this.game_scene.show_season(0);
        
        for(var index = 0; index < this.flow_set.length; index ++) {
            var flow = this.flow_set[index].getComponent("flow");    
            flow.reset_game(true); 
        }
        
        this.now_stage = 1;
        this.now_give = 0; // 给0个花
        this.play_next_opt();
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
