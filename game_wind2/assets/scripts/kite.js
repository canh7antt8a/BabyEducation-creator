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
        G: -50,
        top_line: 140,
        vx: 50,
        add_vy: 50, 
        ground_line: -298,
        
        stop_x: -734,
        move_speed: 50,
        
        index: 0
    },

    // use this for initialization
    onLoad: function () {
        this.top_line = 360;
        this.ground_line = -298;
        this.node.x = 691;
        this.node.y = this.ground_line;
        this.vy = 0;
        this.stop_move = false;
        this.anim_ske_com = this.node.getChildByName("anim").getComponent(sp.Skeleton);
        this.is_wind_mode = false;
        this.game_scene = cc.find("UI_ROOT").getComponent("game_scene");
        
        this.line = this.node.getChildByName("line");
        this.line.active = false;
        
        this.is_on_sky = false;
        
        this.dst_node = cc.find("UI_ROOT/anchor-center/kim/point");
    },
    
    start: function() {
        if (this.anim_ske_com) {
            var anim_name = ["fz1 yundong2", "fz2 yundong2", "fz3 yundong2", "fz4 yundong2", "fz5 yundong2"];
            var ske_com = this.anim_ske_com;
            ske_com.clearTracks();
            ske_com.setAnimation(0, anim_name[this.index], true);    
        }
    },
    
    add_wind: function() {
        if (this.is_wind_mode === false) {
            var anim_name = ["fz1 yundong1", "fz2 yundong1", "fz3 yundong1", "fz4 yundong1", "fz5 yundong1"];
            this.anim_ske_com.clearTracks();
            this.anim_ske_com.setAnimation(0, anim_name[this.index], true);
            this.is_wind_mode = true;
        }
        if(this.stop_move === false) {
            this.vy += this.add_vy;    
        }
    },
    
    adjust_line: function() {
        var s_w_pos = this.node.convertToWorldSpaceAR(cc.p(0, 0));
        var d_w_pos = this.dst_node.convertToWorldSpaceAR(cc.p(0, 0));
        
        var len = cc.pDistance(s_w_pos, d_w_pos);
        this.line.width = len / this.node.scale;
        
        var dir = cc.pSub(d_w_pos, s_w_pos);
        var r = Math.atan2(dir.y, dir.x);
        r = r * 180 / 3.1415;
        r = 360 - r;
        this.line.rotation = r;
    }, 
    
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this.is_on_sky) { // 风筝到天上，调整坐标
            this.adjust_line();
            return;    
        }
        
        if(this.stop_move) {
            return;
        }
        
        var sx = this.vx * dt;
        this.node.x -= sx;
        if (this.node.x <= -700) {
            this.node.x = -700;
        }
        
        this.line.active = true;
        
        if(this.node.y >= this.top_line) { // 已经飞往天上
            this.stop_move = true;
            this.is_on_sky = true;
            var time = (this.stop_x - this.node.x) / this.move_speed;
            time = Math.abs(time); 
            this.node.runAction(cc.moveBy(time, this.stop_x - this.node.x, 0));
            
            var m1 = cc.moveBy(0.5, 0, -10);
            var m2 = cc.moveBy(0.5, 0, 10);
            var seq = cc.sequence([m1, m2]);
            var f = cc.repeatForever(seq);
            this.node.runAction(f);
            
            if (this.anim_ske_com) {
                var anim_name = ["fz1 yundong2", "fz2 yundong2", "fz3 yundong2", "fz4 yundong2", "fz5 yundong2"];
                var ske_com = this.anim_ske_com;
                ske_com.clearTracks();
                ske_com.setAnimation(0, anim_name[this.index], true);    
            }
            // 触发下一个风筝出来
            this.game_scene.gen_kite();
            // end 
            return;    
        }
        
        this.adjust_line();
        
        var up = this.vy;
        this.vy += this.G * dt;
        var down = this.vy;
        var sy = (up + down) * dt * 0.5;
        this.node.y += sy;
        if(this.node.y <= this.ground_line) {
            this.node.y = this.ground_line;
            this.vy = 0;
            // this.line.active = false;
            if (this.is_wind_mode === true) {
                var anim_name = ["fz1 yundong2", "fz2 yundong2", "fz3 yundong2", "fz4 yundong2", "fz5 yundong2"];
                this.anim_ske_com.clearTracks();
                this.anim_ske_com.setAnimation(0, anim_name[this.index], true);
                this.is_wind_mode = false;    
            }
        }
        
        var scale = 0.5 * (this.node.y - this.ground_line) / (this.top_line - this.ground_line);
        this.node.scale = 1 - scale;
        
    },
});
