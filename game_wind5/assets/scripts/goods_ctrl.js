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
        level: 4,
    },

    // use this for initialization
    onLoad: function () {
        this.started = false;
        this.wind_count = 0;
        this.active_time = false;
        this.throw_mode = false;
        this.is_in = false;
        this.GX = 0;
        this.GY = 10;
        
        this.game_scene = cc.find("UI_ROOT").getComponent("game_scene");
    },
    
    on_show_wind_result: function() {
        this.active_time = false;
        
        if(this.wind_count <= 0) {
            return;
        }
        if(this.wind_count < this.level) { // 微风
            this.is_in = false;
            var m1 = cc.moveBy(0.2, 0, 10);
            var m2 = cc.moveBy(0.2, 0, -10);
            var m3 = cc.moveBy(0.2, 0, 10);
            var m4 = cc.moveBy(0.2, 0, -10);
            var func = cc.callFunc(function() {
                this.started = true;
            }.bind(this));
            this.started = false;
            var seq = cc.sequence([m1, m2, m3, m4, func]);
            this.node.runAction(seq);
        }
        else if (this.wind_count <= this.level){ // 将物体放入到箱子
            this.is_in = true;
            this.started = false;
            this.throw_mode = true;
            
            this.vx = 300;
            this.vy = 340;
            
            this.GX = 0;
            this.GY = -300;
            this.throw_time = 2;
            
            var f = cc.repeatForever(cc.rotateBy(3, 360));
            this.node.runAction(f);
            // this.node.runAction(cc.rotateBy(3, 360));
            
            /*this.scheduleOnce(function() {
                this.node.runAction(cc.scaleTo(1, 0.5));
            }.bind(this), this.throw_time - 1);*/
        }
        else {
            this.is_in = false;
            this.started = false;
            this.throw_mode = true;
            
            this.vx = 400;
            this.vy = 360;
            
            this.GX = 0;
            this.GY = 100;
            this.throw_time = 2;
            
            this.scheduleOnce(function() {
                this.node.runAction(cc.scaleTo(1, 0.5));
            }.bind(this), this.throw_time - 1);
            
            
            var f = cc.repeatForever(cc.rotateBy(3, 360));
            this.node.runAction(f);
            // this.node.runAction(cc.rotateBy(3, 360));
        }
        this.wind_count = 0;
    },
    
    add_wind: function() {
        if(this.started === false) {
            return;
        }
        this.wind_count ++;
        if (this.active_time === false) {
            this.cancel_time();
            this.active_time = true;
            this.call_latter(this.on_show_wind_result.bind(this), 1);    
        }
    }, 
    
    cancel_time: function() {
        this.node.stopAllActions();
    }, 
    
    call_latter: function(callfunc, delay) {
        var delay_action = cc.delayTime(delay);
        var call_action = cc.callFunc(callfunc, this);
        var seq = cc.sequence([delay_action, call_action]);
        this.node.runAction(seq);
    },
    
    show_good: function() {
        this.node.anchorY = 0;
        this.node.stopAllActions();
        this.node.rotation = 0;
        this.node.opacity = 255;
        this.node.active = true;
        this.wind_count = 0;
        this.node.x = 0;
        this.node.y = 0;
        this.started = false;
        this.active_time = false;
        this.node.scale = 0;
        var h = this.node.getContentSize();
        
        var s1 = cc.scaleTo(0.8, 1.1);
        var delay = cc.delayTime(0.2);
        var s2 = cc.scaleTo(0.5, 1.0);
        var func = cc.callFunc(function() {
            this.started = true;
            this.node.anchorY = 0.5;
            this.node.y = (h.height * 0.5);
        }.bind(this), this);
        var seq = cc.sequence([s1, s2, func]);
        this.node.runAction(seq);
    }, 
    
    update: function(dt) {
        if(this.throw_mode === false) {
            return;
        }
        
        this.throw_time -= dt;
        
        var up = this.vy;
        this.vy = this.vy + this.GY * dt;
        var down = this.vy;
        var sy = (up + down) * dt * 0.5;
        this.node.y += sy;
        
        if(this.vx <= 0) { // 没有水平的速度
            return;
        }
        
    
        up = this.vx;
        this.vx = this.vx - this.GX * dt;
        down = this.vx;
        var sx = (up + down) * dt * 0.5;
        this.node.x -= sx;
        
        if(this.throw_time <= 0) {
            this.throw_time = 0;
            this.throw_mode = false;
            // this.started = true;
            this.node.runAction(cc.fadeOut(0.1));
            this.game_scene.gen_next_goods(this.is_in);
        }
    }, 
});
