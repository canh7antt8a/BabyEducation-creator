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
        a_speed: 960,
    },

    // use this for initialization
    onLoad: function () {
        this.spin_mode = false;
        this.w_speed = 0;

    },
    
    add_speed: function(speed) { // 添加初速度
        this.w_speed += speed;
        if (this.w_speed >= 200) {
            this.w_speed = 200;
        }
        this.spin_mode = true;
    },
    
    get_speed: function() {
        return this.w_speed;
    }, 
    
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this.spin_mode === false) {
            return;
        }
        var a_speed = this.a_speed;
        
        if (this.w_speed <= 0) {
            a_speed = a_speed * 0.01;
        }
        
        if (this.node.y >= 760) {
            this.w_speed = -10;
        }
        
        var up = this.w_speed;
        this.w_speed -= (a_speed * dt);
        var down = this.w_speed;
        var dx = (down + up) * dt * 0.5;
        this.node.y += dx;
        if (this.node.y <= 0) {
            this.node.y = 0;
            this.spin_mode = false;
        }
    },
});
