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
        full_state_time: 3,
        engry_time: 5,
        type: 0, // 0花， 1水
        
    },

    // use this for initialization
    onLoad: function () {
        this.mask = this.node.getChildByName("mask");
        this.w_box = this.mask.getBoundingBoxToWorld();
        this.clound_ctrl = cc.find("UI_ROOT/anchor-center/clound_ctrl").getComponent("clound_gen");
        
        this.rain_time = 0; // 被雨淋的时间
        this.is_full = false;
        
        this.is_show_yan = false;  
        this.ske_yan = this.node.getChildByName("ske_yan");
        // this.ske_yan.active = false;
        
        this.face = this.node.getChildByName("face");
        
        this.face.active = false;
    },
    
    
    reset_flow: function() {
        if(this.type === 0) {
            this.is_full = false;
            this.rain_time = 0;
            this.show_flow_full();
        }    
    }, 
    
    show_yan: function() {
        if(this.is_show_yan === true) {
            return;
        }
        
        cc.audioEngine.stopMusic(false);
        var url = cc.url.raw("resources/sounds/pao_break.mp3");
        cc.audioEngine.playMusic(url, false);  
            
        if(this.type === 1) {
            var ske_yan_com = this.ske_yan.getComponent(sp.Skeleton);
            ske_yan_com.clearTracks();
            ske_yan_com.setAnimation(0, "shuidibianhua", false);
            
            this.is_show_yan = true;
            this.ske_yan.active = true;
            this.face.active = false;
            this.face.stopAllActions();
            
            this.rain_time += (this.full_state_time * 0.2);
            if(this.rain_time >= this.full_state_time) { // 水已经满了
                this.is_full = true;
                this.clound_ctrl.add_recv_count();
            }
            this.show_water_state();
            
            var time = Math.random() * 5 + 0.01;
            this.scheduleOnce(function() {
                this.move_face_to_sky();
            }.bind(this), time);
        }    
    },
    
    hide_yan: function() {
        this.is_show_yan = false;
        this.ske_yan.active = false;
    }, 
    
    move_face_to_sky: function() {
        if (this.is_full) {
            return;
        }
        this.is_show_yan = false;
        this.face.active = true;
        this.face.setPosition(this.save_face_pos);
        this.face.stopAllActions();
        
        var fin = cc.fadeIn(0.1);
        var m = cc.moveBy(1, 0, 140);
        var fout = cc.fadeOut(0.5);
        
        var delay = cc.delayTime(6 + Math.random() * 4);
        var func = cc.callFunc(this.move_face_to_sky.bind(this), this);
        var seq = cc.sequence([fin, m, cc.delayTime(4), fout, delay, func]);
        this.face.runAction(seq);
        this.face.scale = 0;
        this.face.runAction(cc.scaleTo(0.5, 1));
        
    },
    
    reset_water: function() {
        if(this.type !== 1) {
            return;
        }
        
        this.hide_yan();
        var w0 = this.node.getChildByName("w0");
        var w1 = this.node.getChildByName("w1");
        var w2 = this.node.getChildByName("w2");
        var w3 = this.node.getChildByName("w3");
        var w4 = this.node.getChildByName("w4");
    
        w0.active = false;
        w1.active = false;
        w2.active = false;
        w3.active = false;    
        w4.active = true;   
        
        this.is_full = false;
        this.rain_time = 0;
        this.face.active = false;
        
        var time = Math.random() * 10 + 0.01;
        this.scheduleOnce(function() {
            this.move_face_to_sky();
        }.bind(this), time);
    },
    
    start: function() {
        if(this.type === 0) {
            var time = Math.random() * 3;
            this.scheduleOnce(this.show_flow_full.bind(this), time);
        }  
        
        this.face.on(cc.Node.EventType.TOUCH_START, function(event){
            event.stopPropagation();
        }.bind(this), this.face);
        
        this.face.on(cc.Node.EventType.TOUCH_MOVE, function(event){
            
        }.bind(this), this.face);
        
        this.face.on(cc.Node.EventType.TOUCH_END, function(event){
            this.show_yan();
        }.bind(this), this.face);
        
        this.save_face_pos = this.face.getPosition();
        this.face.active = false;
    },
    
    show_flow_full: function() {
        if(this.type === 0) {
            var face1 = this.node.getChildByName("face1");
            var face2 = this.node.getChildByName("face2");
            if(this.is_full) { // 显示满足
                face2.active = true;
                face2.opacity = 255;
                face1.active = false;
                face2.scale = 0;
                
                face2.runAction(cc.scaleTo(1, 1.0));
                var seq = cc.sequence([cc.delayTime(5), cc.fadeOut(0.5)]);
                face2.runAction(seq);
            } 
            else { //  显示要喝水
                face1.active = true;
                face2.active = false;
                face1.scale = 0;
                face1.runAction(cc.scaleTo(1, 1.0));
            }
        }
    },
    
    show_water_state: function() {
        if(this.type !== 1) {
            return;
        }
        
        var w0 = this.node.getChildByName("w0");
        var w1 = this.node.getChildByName("w1");
        var w2 = this.node.getChildByName("w2");
        var w3 = this.node.getChildByName("w3");
        var w4 = this.node.getChildByName("w4");
    
        w0.active = false;
        w1.active = false;
        w2.active = false;
        w3.active = false;    
        w4.active = false;
            
        
        if(this.rain_time >= this.full_state_time) {
            w0.active = true;
        }
        else if(this.rain_time >= this.full_state_time * 0.8) { // 0.3 
            w1.active = true;
        }
        else if(this.rain_time >= this.full_state_time * 0.6) { // 0.6
            w2.active = true;
        }
        else if(this.rain_time >= this.full_state_time * 0.4) { // 0.6
            w3.active = true;
        }
        else { // 0.6
            w4.active = true;
        }
    }, 
    
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this.node.active === false || this.is_full) {
            return;    
        }
        /*if(this.clound_ctrl.is_hit_rain_clound(this.w_box)) { // 算这个下雨的时间
            this.rain_time += dt;
            if(this.rain_time >= this.full_state_time) { // 水已经满了
                this.is_full = true;
                if(this.type === 0) { // 
                    this.show_flow_full();
                    this.scheduleOnce(this.reset_flow.bind(this), 15);
                } 
                else if (this.type === 1) {
                    this.hide_yan();
                }
                this.clound_ctrl.add_recv_count();
            }
            
            if(this.type === 1) {
                this.show_water_state();
            }
            
            if(this.is_full === false) {
                this.show_yan();    
            }
        }
        else {
            this.hide_yan();
        }*/
    },
});
