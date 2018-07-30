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
        play_onload: false,
        time: 0.1,
        delta_y: 100,
    },

    // use this for initialization
    onLoad: function () {
        this.shenzi1 = this.node.getChildByName("shenzi_1");
        this.shenzi2 = this.node.getChildByName("shenzi_2");
        this.evl = this.node.getChildByName("donghualun1");
        this.is_moving = false;
        
        if(this.play_onload) {
            this.move_by(this.time, this.delta_y);
        }
    },
    
    add_by: function(d_len) {
        this.shenzi1.height += d_len;
        this.shenzi2.height += d_len;
        this.evl.y -= d_len;
    },

    move_by: function(time, dy) {
        this.move_len = dy;
        this.move_time = time;
        this.is_moving = true;
        this.move_speed = dy / time;
    },
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if (!this.is_moving) {
            return;
        }
        var s = this.move_speed * dt;
        if (this.move_speed > 0) {
            
            if (s > this.move_len) {
                s = this.move_len;
            }
            this.move_len -= s;
            this.shenzi1.height += s;
            this.shenzi2.height += s;
            this.evl.y -= s;
            if(this.move_len <= 0) {
                this.is_moving = false;
            }
        }
        else {
            if (s < this.move_len) {
                s = this.move_len;
            }
            this.move_len -= s;
            this.shenzi1.height += s;
            this.shenzi2.height += s;
            this.evl.y -= s;
            if(this.move_len >= 0) {
                this.is_moving = false;
            }
        }
    },
});
