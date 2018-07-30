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
        cloude_prefab: {
            default: [],
            type: cc.Prefab,
        },
        black_rain_time: 8,
        
        recv_set: {
            default: [],
            type: cc.Node,
        },
    },
    
    add_recv_count: function() {
        this.succes_time ++;
        if(this.auto_show_card && this.succes_time >= 3) {
            cc.find("UI_ROOT/anchor-center/card_button").active = true;
            this.show_rain_card();
            this.auto_show_card = false;
        }
        else if(this.succes_time >= 5) {
            this.on_checkout();
        }
    },
    
    show_rain_card: function() {
        cc.find("UI_ROOT/show_card_root").active = true;
        cc.audioEngine.stopMusic(false);
        var url = cc.url.raw("resources/sounds/card_desic.mp3");
        cc.audioEngine.playMusic(url, false);
    },
    
    hide_rain_card: function() {
        cc.find("UI_ROOT/show_card_root").active = false;
    },
    
    is_hit_rain_clound: function(w_box) {
        var i;
        for(i = 0; i < this.black_clound.length; i ++) {
            if (this.black_clound[i] === null) {
                continue;
            }
            
            var box = this.black_clound[i].getChildByName("mask").getBoundingBoxToWorld();
            if (box.intersects(w_box)) {
                return true;
            }
        }
        return false;
    }, 
    
    get_touch_item: function(clound_set, pos) {
        
        for(var i = clound_set.length - 1; i >= 0; i --) {
            if(clound_set[i] === null) {
                continue;
            }
            
            var box = clound_set[i].getBoundingBox();
            if(box.contains(pos)) {
                return i;
            }
        }
        return -1;
    },
    
    on_touch_start: function(event) {
        if(this.invalid_hit_move === true) {
            return;
        }
        
        this.touch_hit = null;
        var pos = this.node.convertToNodeSpaceAR(event.getLocation());
        // 
        var index = this.get_touch_item(this.gray_clound, pos);
        
        if(index >= 0 && index < this.gray_clound.length) {
            var gray_item = this.gray_clound[index];
            this.touch_hit = gray_item;
            this.touch_hit_type = 1;
            this.touch_hit_index = index;
            return;
        }
        // end 
        
        index = this.get_touch_item(this.white_clound, pos);
        if (index >= 0 && index < this.white_clound.length) {
            var white_item = this.white_clound[index];
            this.touch_hit = white_item;
            this.touch_hit_type = 0;
            this.touch_hit_index = index;
            return;
        }
    },
    
    get_hit_item: function() {
        if(this.touch_hit === null || this.touch_hit_type < 0 || this.touch_hit_type > 1) {
            return null;
        }
        
        var i = 0;
        var rhs;
        var item;
        
        var lhs = this.touch_hit.getBoundingBox();
        if(this.touch_hit_type === 0) { // 白云
            for(i = this.white_clound.length - 1; i >= 0; i --) {
                if(this.white_clound[i] === null || i == this.touch_hit_index) {
                    continue;
                }
                
                rhs = this.white_clound[i].getBoundingBox();
                if (lhs.intersects(rhs)) {
                    item = this.white_clound[i];
                    this.white_clound[i] = null;
                    return item;
                }
            }
            return null;
        }
        else if(this.touch_hit_type === 1) { // gray 灰云
            for(i = this.gray_clound.length - 1; i >= 0; i --) {
                if(this.gray_clound[i] === null || i == this.touch_hit_index) {
                    continue;
                }
                
                rhs = this.gray_clound[i].getBoundingBox();
                if (lhs.intersects(rhs)) {
                    item = this.gray_clound[i];
                    this.gray_clound[i] = null;
                    return item;
                }
            }
            return null;
        }
    },
    
    gen_new_clound: function(type, pos) {
        var clound;
        
        if(type === 0) { // 生成灰色的云
            clound = cc.instantiate(this.cloude_prefab[1]);
            clound.parent = this.node;
            clound.x = pos.x;
            clound.y = pos.y;
            var seq = cc.sequence([cc.scaleTo(0.1, 1.2), cc.scaleTo(0.1, 1), cc.scaleTo(0.2, 1.1), cc.scaleTo(0.1, 1)]);
            clound.runAction(seq);
            this.gray_clound.push(clound);
        }
        else if (type === 1){ // 生成黑色的云 
            clound = cc.instantiate(this.cloude_prefab[2]);
            clound.parent = this.black_cloud_root;
            clound.x = pos.x;
            clound.y = pos.y;
            var index = this.black_clound.length;
            this.black_clound.push(clound);
        
            var func = cc.callFunc(function() {
                this.black_clound.splice(index,1);
                this.fadeout_black_clound(clound);
            }.bind(this), this)
            
            var seq = cc.sequence([cc.scaleTo(0.1, 1.2), cc.scaleTo(0.1, 1), cc.scaleTo(0.2, 1.1), cc.scaleTo(0.1, 1), cc.delayTime(this.black_rain_time), func]);
            clound.runAction(seq);
        }
    },
    
    fadeout_black_clound: function(clound) {
        var rain_action_com = clound.getComponent("rain_action");
        rain_action_com.stop_rain();
        clound.setCascadeOpacityEnabled(true);
        
        var func = cc.callFunc(function(){
            clound.removeFromParent(); 
            if(this.auto_show_card && this.succes_time >= 3) {
                cc.find("UI_ROOT/anchor-center/card_button").active = true;
                this.show_rain_card();
                this.auto_show_card = false;
            }
            else if(this.succes_time >= 5) {
                this.on_checkout();
            }
        }.bind(this), this);
        var seq = cc.sequence([cc.fadeOut(0.5), func]);
        clound.runAction(seq);
    },
    
    on_checkout: function() {
        this.scheduleOnce(function() {
            this.checkout_root.active = true;
            cc.audioEngine.stopMusic(false);
            var url = cc.url.raw("resources/sounds/end.mp3");
            cc.audioEngine.playMusic(url, false);    
        }.bind(this), 4);
    }, 
    
    on_touch_moved: function(event) {
        if(this.invalid_hit_move === true || this.touch_hit === null) {
            return;
        }
        
        var pos = this.node.convertToNodeSpaceAR(event.getLocation());
        this.touch_hit.x = pos.x;
        this.touch_hit.y = pos.y;
        
        var hit_item = this.get_hit_item(pos);
        if(hit_item) {
            // 两朵移动到手指的位置，然后生成新的云朵
            var lhs = this.touch_hit;
            var rhs = hit_item;
            var type = this.touch_hit_type;
            
            this.invalid_hit_move = true;
            if(this.touch_hit_type === 0) {
                this.white_clound[this.touch_hit_index] = null;
            } 
            else if(this.touch_hit_type === 1) {
                this.gray_clound[this.touch_hit_index] = null;
            }
            this.touch_hit = null;
            this.touch_hit_type = -1;
            
            pos.x = rhs.x;
            pos.y = rhs.y;
            var m1 = cc.moveTo(0.5, pos);
            var fout = cc.fadeOut(0.1);
            var func = cc.callFunc(function() {
                lhs.removeFromParent();
                rhs.removeFromParent();
                // 产生一个
                this.gen_new_clound(type, pos);
                this.invalid_hit_move = false;
                // end 
                if(type === 1) { // 重新生成白云
                    this.on_gen_white_clound();
                }
            }.bind(this), this);
            var seq = cc.sequence([m1, fout, func]);
            lhs.runAction(seq);
            // end
        }
    },
    
    // use this for initialization
    onLoad: function () {
        /*
        this.node.on(cc.Node.EventType.TOUCH_START, function(event){
            this.on_touch_start(event);
        }.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function(event){
            this.on_touch_moved(event);
        }.bind(this));
        
        this.node.on(cc.Node.EventType.TOUCH_END, function(event){
            this.touch_hit = null;
        }.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function(event){
            this.touch_hit = null;
        }.bind(this));*/
        
        
        this.touch_hit = null;
        this.touch_hit_type = -1;
        this.invalid_hit_move = false;
        
        // this.black_cloud_root = cc.find("UI_ROOT/anchor-center/black_cloud_root");
        // this.black_clound = [];
        
        this.succes_time = 0;
        this.auto_show_card = true;
        
        this.checkout_root = cc.find("UI_ROOT/checkout_root");
        
        
    },
    
    on_relpay: function() {
        this.start_game();
    }, 
    
    start_game: function() {
        for(var i = 0; i < this.recv_set.length; i ++) {
            var rev_com = this.recv_set[i].getComponent("recv_rain");
            rev_com.reset_water();
        }
        this.succes_time = 0;
        this.checkout_root.active = false;
        this.node.removeAllChildren();
        // this.black_cloud_root.removeAllChildren();
        
        this.hide_rain_card();
        this.on_gen_white_clound();
    },
    
    play_start_anim: function() {
        var ske_com = cc.find("UI_ROOT/anchor-center/JXM").getComponent(sp.Skeleton);
        ske_com.clearTracks();
        ske_com.setAnimation(0, "in", false);
        ske_com.addAnimation(0, "idle_1", true);
        
        cc.audioEngine.stopMusic(false);
        var url = cc.url.raw("resources/sounds/start.mp3");
        cc.audioEngine.playMusic(url, false);
        
        this.scheduleOnce(function() {
            ske_com.clearTracks();
            ske_com.setAnimation(0, "out", false);
        }.bind(this), 4);
    },
    
    start: function() {
        this.play_start_anim();
        this.start_game();    
    },
    
    on_gen_white_clound: function() {
        this.white_clound = [];
        this.gray_clound = [];
        
        /*
        var xpos_set = [-1445, 1445, -1263, 1263];
        var ypos_set = [430, 430, 263, 263];
        
        var xpos_dst = [-673, 552, -320, 352];
        var ypos_dst = [430, 430, 263, 263];
        
        // this.node.removeAllChildren();
        
        for(var i = 0; i < 4; i ++) {
            var clound;
            clound = cc.instantiate(this.cloude_prefab[0]);
            clound.parent = this.node;
            clound.x = xpos_set[i];
            clound.y = ypos_set[i];
            
            var m = cc.moveTo(1.5 + Math.random(), xpos_dst[i], ypos_dst[i]);
            clound.runAction(m);
            this.white_clound.push(clound);
        }
        */
        
        this.black_clound = [];
        var clound = cc.instantiate(this.cloude_prefab[2]);
        clound.getComponent("rain_action").stop_rain();
        clound.parent = this.black_cloud_root;
        clound.x = 417;
        clound.y = 387;

        this.black_clound.push(clound);
        
        /*var func = cc.callFunc(function() {
            this.black_clound.splice(index,1);
            this.fadeout_black_clound(clound);
        }.bind(this), this)*/
            
        // var seq = cc.sequence([cc.scaleTo(0.1, 1.2), cc.scaleTo(0.1, 1), cc.scaleTo(0.2, 1.1), cc.scaleTo(0.1, 1), cc.delayTime(this.black_rain_time), func]);
        
        
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
