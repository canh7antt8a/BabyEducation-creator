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
        rot: 10
    },

    // use this for initialization
    onLoad: function () {
        this.swing = false;
        this.doing = false;
        
        this.wind_count = 0;
        this.xian = this.node.getChildByName("tw12");
        this.qiqiu = this.node.getChildByName("tw11");
        this.active_time = false;
        this.game_scene = cc.find("UI_ROOT").getComponent("game_scene");
        this.fly_out = false;
    },
    
    
    reset: function() {
        this.xian.opacity = 255;
        this.qiqiu.x = -146;
        this.qiqiu.y = 304;
        this.fly_out = false;
        this.active_time = false;
        this.wind_count = 0;
    },
    
    call_latter: function(callfunc, delay) {
        var delay_action = cc.delayTime(delay);
        var call_action = cc.callFunc(callfunc, this);
        var seq = cc.sequence([delay_action, call_action]);
        this.xian.runAction(seq);
    },
    
    add_win: function() {
        if (this.fly_out === true) { // 已经飞出去了
            return;
        }
    
        this.swing = true;
        if(this.doing === false) {
            this.doing = true;
            var time = 0.2 + Math.random() * 0.3;
            var r1 = cc.rotateTo(time, this.rot);
            var r2 = cc.rotateTo(time * 2, -this.rot);
            var r3 = cc.rotateTo(time, 0);
            var func = cc.callFunc(function() {
                this.doing = false;
            }.bind(this), this);
            
            var seq = cc.sequence([r1, r2, r3, func]);
            this.node.runAction(seq);
        }
        
        this.wind_count ++;
        if (this.wind_count >= 4) { // 飞出去
            this.fly_out = true;
            this.xian.stopAllActions();
            
            this.xian.runAction(cc.fadeOut(0.5));
            var m = cc.moveBy(3, 0, 400);
            var func = cc.callFunc(function(){
                this.game_scene.qiqiu_arrived();
            }.bind(this), this);
            var seq = cc.sequence([m, func]);
            this.qiqiu.runAction(seq);
            return;
        }
        
        if (this.active_time === false) {
            this.active_time = true;
            
            this.call_latter(function(){
                this.active_time = false;
                this.wind_count = 0;
            }.bind(this), 1);
        }
    }
    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
