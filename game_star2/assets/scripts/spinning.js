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
        random_rot: true,
        a_speed: 180,
        onload_v0: 720,  // 0, 144, 288, 432, 576, 720 
        play_onload: false, 
        max_speed: 720,
    },

    // use this for initialization
    onLoad: function () {
        if(this.random_rot) {
            this.node.rotation = Math.random() * 360;
        }
        
        this.spin_mode = false;
        this.w_speed = 0;
        if(this.play_onload) {
            this.add_speed(this.onload_v0);
        }
    },
    
    add_speed: function(speed) { // 添加初速度
        this.w_speed += speed;
        if(this.w_speed >= this.max_speed) {
            this.w_speed = this.max_speed;
        }
        
        if(this.w_speed >= 0) {
            this.spin_mode = true;
        }
    },
    
    get_speed: function() {
        return this.w_speed;
    }, 
    
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this.spin_mode === false) {
            return;
        }

        var up = this.w_speed;
        this.w_speed -= (this.a_speed * dt);
        if(this.w_speed < 0) {
            dt += (this.w_speed/this.a_speed); // 回退时间
            this.w_speed = 0;
            this.spin_mode = false;
        }
        var down = this.w_speed;
        var r = (down + up) * dt * 0.5;
        this.node.rotation += r;
        
        while(this.node.rotation > 360) {
            this.node.rotation -= 360;
        }
        // this.node.rotation += (this.w_speed * dt);
    },
});
