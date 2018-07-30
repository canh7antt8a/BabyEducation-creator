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
        run_anim: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        var aniation = this.run_anim.getComponent(cc.Animation);
        aniation.play("play_run");
        this.jump_mode = 0;
        this.G = -1000;
        this.vy = 80;
        this.vx = 150 + (Math.random() - 0.5) * 50;
        this.jump_time = 0.0;
        
        this.fish = cc.find("Canvas/anchor-center/fish");
        
        this.game_scene = cc.find("Canvas");
        this.game_scene = this.game_scene.getComponent("game_scene");
        
        this.display_width = cc.director.getWinSize().width;
    },
    
    contact_with_fish: function() {
        var r = 108;
        var pos = this.fish.convertToWorldSpaceAR(cc.Vec2(0, 0));
        var cat_pos = this.node.convertToWorldSpace(cc.Vec2(0, 0));
        
        if(this.vy > 0) {
            return;
        }
        
        if(cat_pos.y < pos.y) {
            return;
        }
        
        var v = cat_pos.sub(pos);
        var len = v.mag();
        if(len > r) {
            return;    
        }
        
        // 改变速度
        if(v.x < 0 && Math.abs(v.x) > Math.abs(v.y)) { // 反45
            this.vx = -this.vx;
            this.node.scaleX = -1;
        }
        else { // 正45度
            this.vy = -(this.vy + (Math.random() * 100 + 50));
            this.vx += ((Math.random() - 0.5) * 100);
        }
        // end
    }, 
    
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        var s;
        if(this.jump_mode === 3) {
            var action = this.run_anim.getComponent(cc.Animation);
            action.play("shuihua");
            this.jump_mode = 4;
            this.jump_time = 0;
            return;    
        }
        
        if (this.jump_mode === 4) {
            this.jump_time += dt;
            if(this.jump_time >= 0.45) {
                this.node.removeFromParent();
            }
            return;
        }
        
        if(this.jump_mode === 0) {
            s = this.vx * dt;
            this.node.x += s;
            if(this.node.x >= 120) {
                var aniation = this.run_anim.getComponent(cc.Animation);
                aniation.play("play_jump");
                this.jump_mode = 1;
                this.jump_time = 0;
            }
        }
        else {
            if(this.jump_mode == 1 && this.jump_time <= 0.2) {
                s = this.vx * dt;
                this.node.x += s;
                this.jump_time += dt;
                return;    
            }
            
            this.vy = this.vy + this.G * dt;

            this.node.y += (this.vy * dt + 0.5 * this.G * dt * dt);
            this.node.x += (this.vx * dt);
            
            if(this.jump_mode === 1) {
                this.jump_time += dt;
                if(this.jump_time >= 0.4) {
                    this.jump_mode = 2;
                    this.vy = 500;
                    this.vx = 400 - 100 * Math.random();
                }
            }
            
            // 碰撞检测
            this.contact_with_fish();
            // end 
            
            // 掉落检测
            var pos = this.node.convertToWorldSpace(cc.Vec2(0, 0));
            if (pos.y <= 80) {
                this.jump_mode = 3;
                this.game_scene.on_game_over();
                return;
            }
            // end
            
            // 结算检测
            if(pos.x > this.display_width + 20) {
                this.game_scene.add_score();
                this.node.removeFromParent();
                return;
            }
            // end 
        }
    },
});
