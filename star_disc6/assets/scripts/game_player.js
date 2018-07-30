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
    },

    // use this for initialization
    onLoad: function () {
        this.speed = 300;
        this.image = this.node.getChildByName("img");
        this.camera = null;
        this.walking_mode = false;
        this.search_mode = false;
        this.is_hit_clound = false;
        
        this.game_scene = cc.find("UI_ROOT").getComponent("game_scene");
        
        this.daoju_sprite = this.image.getChildByName("daoju_icon").getComponent(cc.Sprite);
        this.daoju_siban = this.image.getChildByName("daoju_icon2");
    },
    
    bind_camera: function(camera) {
        this.camera = camera;
        this.bind_y = true;
        this.bind_x = true;
    },
    
    bind_player: function(bind_obj) {
        this.bind_obj = bind_obj;
        this.bind_obj.x = this.node.x;
        this.bind_obj.y = this.node.y;
        this.bind_obj.setCascadeOpacityEnabled(true);
        // this.bind_obj.scale = 0;
        this.bind_obj.opacity = 0;
        
    }, 
    
    goto_map: function(m_pos) {
        var delta = this.node.getPosition();
        delta.x = m_pos.x - delta.x; 
        delta.y = m_pos.y - delta.y; 
        
        var r = Math.atan2(delta.y, delta.x);
        r = r * 180 / 3.14159;
        r = 360 - r + 90;
        while(r >= 360) {
            r -= 360;
        }
        
        while(r < 0) {
            r += 360;
        }
        
        var now_r = this.image.rotation;
        while(now_r < 0) {
            now_r += 360;
        }
        while(now_r > 360) {
            now_r -= 360;
        }
        this.image.rotation = now_r;
        // var delta = r - now_r;
        this.image.runAction(cc.rotateTo(0.3, r));
        
        // 在原地没有动
        if (Math.abs(delta.x) < 1 && Math.abs(delta.y) < 1) {
            return;
        }
        
        this.walking_mode = true;
        var mag = delta.mag();
        this.walking_time = mag / this.speed;
        this.time = 0;
        this.vx = this.speed * delta.x / mag;
        this.vy = this.speed * delta.y / mag;
        return this.walking_time;
    }, 
    
    update_pos: function(sx, sy) {
        if(this.camera !== null && this.bind_x === false) {
            if (sx > 0) {
                if (this.node.x <= (-this.camera.x) && (this.node.x + sx) >= (-this.camera.x)) {
                    sx = this.node.x + sx - (-this.camera.x);
                    this.node.x = (-this.camera.x);
                    this.bind_x = true;
                } 
            }
            else if (sx < 0) {
                if (this.node.x >= (-this.camera.x) && (this.node.x + sx) <= (-this.camera.x)) {
                    sx = this.node.x + sx - (-this.camera.x);
                    this.node.x = (-this.camera.x);
                    console.log(this.node.x, this.camera.x);
                    this.bind_x = true;
                } 
            }
        }
        if(this.camera !== null && this.bind_y === false) {
             if (sy > 0) {
                if (this.node.y <= (-this.camera.y) && (this.node.y + sy) >= (-this.camera.y)) {
                    sy = this.node.y + sy - (-this.camera.y);
                    this.node.y = (-this.camera.y);
                    this.bind_y = true;
                } 
            }
            else if (sy < 0) {
                if (this.node.y >= (-this.camera.y) && (this.node.y + sy) <= (-this.camera.y)) {
                    sy = this.node.y + sy - (-this.camera.y);
                    this.node.y = (-this.camera.y);
                    this.bind_y = true;
                } 
            }
        }
        
        this.node.x += sx;
        this.node.y += sy;
        if(this.bind_obj !== null) {
            this.bind_obj.x = this.node.x;
            this.bind_obj.y = this.node.y;
            
            if(this.game_scene.hit_clound_test(this.node)) {
                // this.bind_obj.scale = 1;
                if (this.is_hit_clound === false) {
                    this.bind_obj.opacity = 0;
                    this.bind_obj.runAction(cc.fadeIn(0.3)); 
                    this.is_hit_clound = true;
                }
                // 
            }
            else {
                // this.bind_obj.scale = 0;
                if(this.is_hit_clound === true) {
                    this.is_hit_clound = false;
                    this.bind_obj.opacity = 255;
                    this.bind_obj.runAction(cc.fadeOut(0.3));
                } 
                // this.bind_obj.opacity = 255;
                // this.bind_obj.runAction(cc.fadeOut(0.1));
            }
        }
        // end 
        
        if (this.camera !== null) {
            if (this.bind_x === true) {
                this.camera.x -= sx;
                if (this.camera.x <= -960) {
                    this.camera.x = -960;
                    this.bind_x = false;
                }
                else if(this.camera.x >= 960) {
                    this.camera.x = 960;
                    this.bind_x = false;
                }    
            }
            
            if (this.bind_y === true) {
                this.camera.y -= sy;
                if (this.camera.y <= -540) {
                    this.camera.y = -540;
                    this.bind_y = false;
                }
                else if(this.camera.y >= 540) {
                    this.camera.y = 540;
                    this.bind_y = false;
                }    
            }
        }
        
        var w_pos = this.node.convertToWorldSpaceAR(cc.p(0, 0));
        if (Math.abs(w_pos.x - 960) > 10) {
            this.bind_x = false;
        }
        if (Math.abs(w_pos.y - 540) > 10) {
            this.bind_y = false;
        }
    }, 
    
    walk_update: function(dt) {
        if(this.walking_mode === false) {
            return;
        }
        
        this.time += dt;
        if (this.time > this.walking_time) {
            dt -= (this.time - this.walking_time);
        }
        
        // sx, sy
        var sx = this.vx * dt;
        var sy = this.vy * dt;
        this.update_pos(sx, sy);
        
        if (this.game_scene.on_hit_test(this)) {
            this.walking_mode = false;
        }
        
        if(this.time >= this.walking_time) {
            this.walking_mode = false;
        }
    }, 
    
    search_update: function(dt) {
        if(!this.search_mode) {
            return;
        }   
        
        var deg = this.w_speed * dt;
        this.degree += deg;
        var x = this.circle_center.x + this.search_R * Math.cos(this.degree); 
        var y = this.circle_center.y + this.search_R * Math.sin(this.degree); 
        
        var prev = this.node.getPosition();
        
        var sx = x - this.node.x;
        var sy = y - this.node.y;
        
        this.update_pos(sx, sy);
        
        var r = (this.degree * 180)/3.14159 + 90;
        r = 360 - r + 90;
        this.image.rotation = r; 
        
        if (this.time >= this.search_time) {
            this.search_mode = false;
            this.game_scene.on_search_star_end(this.hit_star);
            
            // 惯性的飞出
            var dir = cc.p(sx, sy);
            var distance = 200;
            var x = (distance * sx / dir.mag()) + this.node.x;
            var y = (distance * sy / dir.mag()) + this.node.y;
            // end 
            this.goto_map(cc.p(x, y));
            
        }
        else {
            this.time += dt;
            this.game_scene.on_search_star_progcess(this.hit_star, this.time / this.search_time);    
        }
    },
    
    enter_search_mode: function(hit_star, star_w_pos, DISTANCE, now_wpos) {
        this.search_mode = true;
        this.walking_mode = false;
        this.game_scene.on_search_star_start(this.hit_star);
        /*
        var v = cc.pSub(now_wpos, star_w_pos);
        v.x = (DISTANCE * v.x / v.mag()) + star_w_pos.x;
        v.y = (DISTANCE * v.y / v.mag()) + star_w_pos.y;
        
        var pos = this.node.parent.convertToNodeSpaceAR(v);
        // this.node.x = pos.x;
        // this.node.y = pos.y;
        var sx = pos.x - this.node.x;
        var sy = pos.y - this.node.y;
        console.log(pos.x, pos.y, this.node.x, this.node.y);
        // this.update_pos(sx, sy);*/
        
        var v = cc.pSub(now_wpos, star_w_pos);
        this.degree = Math.atan2(v.y, v.x);
        this.circle_center = this.node.parent.convertToNodeSpaceAR(star_w_pos);
        this.search_R = DISTANCE;
        this.hit_star = hit_star;
        this.search_time = (3.14159 * 2 * this.search_R) / this.speed;
        this.w_speed = (3.14159 * 2) / this.search_time; 
        this.search_time = this.search_time * 2;
        this.time = 0;
    }, 
    
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        this.walk_update(dt);
        this.search_update(dt);
    },
    
    set_daoju_type: function(type) {
        var url = "";
        switch(type) {
            case 0:
               url = cc.url.raw("resources/daoju0.png");
            break;
            case 5:
                url = cc.url.raw("resources/daoju1.png");
            break;
            case 6:
                url = cc.url.raw("resources/daoju2.png");
            break;
            default:
                return;
            break;
        }
        
        this.daoju_sprite.spriteFrame = new cc.SpriteFrame(url);
    },
    
    show_shiban: function() {
        this.daoju_siban.active = true;
    }, 
    
    hide_shiban: function() {
        this.daoju_siban.active = false;
    },
    
    hide_daoju: function() {
        var icon = this.image.getChildByName("daoju_icon");
        icon.runAction(cc.fadeOut(0.5));
    },
});
