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
        degree: 0,
        v_speed: 300,
        g: -220,
        run_time: 5,
        
        play_onload: false,
    },

    // use this for initialization
    onLoad: function () {
        this.runing = false;
        this.started_time = 0;
        
        this.vy = this.v_speed * Math.sin((this.degree/180) * 3.14);
        this.vx = this.v_speed * Math.cos((this.degree/180) * 3.14);
        
        if(this.play_onload) {
            this.play(0);
        }
    },
    
    play: function(delay) {
        this.degree = 70 + Math.random() * 40;
        this.vy = this.v_speed * Math.sin((this.degree/180) * 3.14);
        this.vx = this.v_speed * Math.cos((this.degree/180) * 3.14);
        this.run_time = 3 + Math.random() * 0.4;
        
        
        this.node.opacity = 0;
        if (delay <= 0) {
            this.started_time = 0;
            this.runing = true;    
            this.node.opacity = 255;
        }
        else {
            this.scheduleOnce(function() {
                this.started_time = 0;
                this.runing = true;
                this.node.opacity = 255;
            }.bind(this), delay);    
        }
    }, 
    
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(!this.runing) {
            return;
        }
        
        var prev_y = this.vy;
        this.vy += (this.g * dt);
        
        var dy = (prev_y + this.vy) * dt * 0.5;
        var dx = this.vx * dt;
        
        this.node.x += dx;
        this.node.y += dy;
        // 
        this.started_time += dt;
        if(this.started_time >= this.run_time) {
            this.runing = false;
        }
        // 
    },
});
