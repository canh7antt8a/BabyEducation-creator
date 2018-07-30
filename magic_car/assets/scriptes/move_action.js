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
        play_onload: true,
        play_onload_delay: 0,
        start_active: false,
        move_duration: 0,
        move_time: 0.2,
        is_hor: false,
        is_jump: true,
    },

    // use this for initialization
    onLoad: function () {
        // this.node.active = this.start_active;
        if (!this.start_active) {
            this.node.scale = 0;
        }
        if(this.play_onload === true) {
            if (this.play_onload_delay <= 0) {
                this.play();    
            }
            else {
                this.scheduleOnce(function(){
                    this.play();
                }.bind(this), this.play_onload_delay);
            }
        }
    },
    
    play: function() {
        this.node.stopAllActions();
        
        this.node.active = true;
        this.node.scale = 1;
        var dx = 0;
        var dy = 0;
        
        var jump_x = 0
        var jump_y = 0
        
        if (this.is_hor) {
            dx = this.move_duration;
            if (this.is_jump) {
                if(this.move_duration > 0) { // 右
                    jump_x = -10;
                }
                else { // 左
                    jump_x = 10;
                }    
            }
        }
        else {
            dy = this.move_duration;
            if (this.is_jump) {
                if (this.move_duration > 0) { // 上
                    jump_y = -10;
                }
                else { // 下
                    jump_y = 10;
                }    
            }
        }
        
        if (this.is_jump) {
            var move1 = cc.moveBy(this.move_time, dx - jump_x, dy - jump_y);
            var move2 = cc.moveBy(0.2, jump_x * 2, jump_y * 2);
            var move3 = cc.moveBy(0.1, -jump_x, -jump_y);
            var seq = cc.sequence([move1, move2, move3]);
            this.node.runAction(seq);    
        }
        else {
            var move1 = cc.moveBy(this.move_time, dx, dy);
            this.node.runAction(move1);
        }
        
    },
    
    move_back: function() {
        this.node.active = true;
        this.node.stopAllActions();
        var dx = 0;
        var dy = 0;
        
        var jump_x = 0
        var jump_y = 0
        
        if (this.is_hor) {
            dx = this.move_duration;
            if (this.is_jump) {
                if(this.move_duration > 0) { // 右
                    jump_x = -10;
                }
                else { // 左
                    jump_x = 10;
                }    
            }
        }
        else {
            dy = this.move_duration;
            if (this.is_jump) {
                if (this.move_duration > 0) { // 上
                    jump_y = -10;
                }
                else { // 下
                    jump_y = 10;
                }    
            }
        }
        
        if (this.is_jump) {
            var move1 = cc.moveBy(this.move_time, -dx + jump_x, -dy + jump_y);
            var move2 = cc.moveBy(0.2, -jump_x * 2, -jump_y * 2);
            var move3 = cc.moveBy(0.1, jump_x, jump_y);
            var seq = cc.sequence([move1, move2, move3]);
            this.node.runAction(seq);    
        }
        else {
            var move1 = cc.moveBy(this.move_time, -dx, -dy);
            this.node.runAction(move1);
        }
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
