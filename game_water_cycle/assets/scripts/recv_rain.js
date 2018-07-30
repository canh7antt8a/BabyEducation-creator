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
        
        
    },
    
    reset_flow: function() {
        if(this.type === 0) {
            this.is_full = false;
            this.rain_time = 0;
            this.show_flow_full();
        }    
    }, 
    
    reset_water: function() {
        if(this.type !== 1) {
            return;
        }
        
        var w1 = this.node.getChildByName("w01");
        var w2 = this.node.getChildByName("w02");
        var w3 = this.node.getChildByName("w03");
        w1.active = false;
        w2.active = false;
        w3.active = false;    
        
        this.is_full = false;
        this.rain_time = 0;
    },
    
    start: function() {
        if(this.type === 0) {
            var time = Math.random() * 3;
            this.scheduleOnce(this.show_flow_full.bind(this), time);
        }  
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
        
        var w1 = this.node.getChildByName("w01");
        var w2 = this.node.getChildByName("w02");
        var w3 = this.node.getChildByName("w03");
        w1.active = false;
        w2.active = false;
        w3.active = false;
            
        
        if(this.rain_time >= this.full_state_time) {
            w3.active = true;
        }
        else if(this.rain_time >= this.full_state_time * 0.6) { // 0.3 
            w2.active = true;
        }
        else if(this.rain_time >= 0.3 * this.full_state_time) { // 0.6
            w1.active = true;
        }
    }, 
    
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this.node.active === false || this.is_full) {
            return;    
        }
        if(this.clound_ctrl.is_hit_rain_clound(this.w_box)) { // 算这个下雨的时间
            this.rain_time += dt;
            if(this.rain_time >= this.full_state_time) { // 水已经满了
                this.is_full = true;
                if(this.type === 0) { // 
                    this.show_flow_full();
                    this.scheduleOnce(this.reset_flow.bind(this), 15);
                } 
                this.clound_ctrl.add_recv_count();
            }
            
            if(this.type === 1) {
                this.show_water_state();
            }
            
        }
    },
});
