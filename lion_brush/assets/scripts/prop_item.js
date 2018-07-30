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
        prop_type: 0,
    },
    
    on_hit_dirty: function(node) {
        var bound_box = this.hit_mask.getBoundingBox();
        var c_size = this.hit_mask.getContentSize();
        var w_startpos = this.hit_mask.convertToWorldSpace(cc.p(0, 0))
        bound_box = new cc.rect(w_startpos.x, w_startpos.y, c_size.width, c_size.height);
        var dirty_set = this.root_scripte_comp.get_hit_dirty_set();
        for(var i = 0; i < dirty_set.length; i ++) {
            var now = dirty_set[i];
            var now_com = now.getComponent("dirty_item");
            if (now_com.clear_times <= 0) {
                continue;
            }
        
            c_size = now.getContentSize();
            w_startpos = now.convertToWorldSpace(cc.p(0, 0))
            var hit_box = new cc.rect(w_startpos.x, w_startpos.y, c_size.width, c_size.height);
            
            if (hit_box.intersects(bound_box)) {
                // console.log("hit one:" + hit_box);
                // console.log("bound_box:" + bound_box);
                return now;
            }
            
        }
        return null;
    },

    // use this for initialization
    onLoad: function () {
        this.node.opacity = 0;
        this.hit_mask = this.node.getChildByName("mask");
        this.root_scripte_comp = (cc.find("UI_ROOT")).getComponent("game_scene");
        this.move_hit = true;
        
        this.node.on('touchstart', function(event) {
            if (!this.root_scripte_comp.game_started) {
                return;
            }
            this.hide_sound = true;
            var bound_box = this.node.getBoundingBox(); 
            var pos = this.node.getParent().convertTouchToNodeSpace(event);
            if(bound_box.contains(pos)) {
                event.stopPropagation();
                this.node.getChildByName("anim").active = true;
                this.prev_hit = false;
                this.prev_dir = 0;
                this.move_hit = true;
                this.node.opacity = 255;
                this.hit_mask.opacity = 0;
                this.start_x = event.getLocation().x;
                this.start_y = event.getLocation().y;
                // this.root_scripte_comp.play_guli_anim();
                this.root_scripte_comp.play_guli_anim(this.prop_type);
            }
        }.bind(this));
        
        this.node.on('touchmove', function(event){
            if(this.move_hit === false) {
                return;
            }
            
            var pos = this.node.getParent().convertTouchToNodeSpace(event);
            this.node.setPosition(pos);
            
            // var world_pos = event.getLocation();
            
            /*if(cc.pDistance(world_pos, this.root_scripte_comp.center_pos) < 240) { //
                this.move_hit = false;
                var local_pos = this.node.getParent().convertToNodeSpaceAR(this.root_scripte_comp.center_pos);
                
                var moveby = cc.moveTo(0.2, local_pos);
                var callback = cc.callFunc(function() {
                    this.root_scripte_comp.on_prop_hit(this.prop_type);
                    this.node.opacity = 0;
                    this.node.setPosition(this.start_pos);
                }.bind(this), this);
                
                var seq = cc.sequence([moveby, callback]);
                this.node.runAction(seq);
            }*/
            var dir = -1;
            var delta = event.getDelta().x;
            if (delta > 0) {
                dir = 1;
            }
            var now = this.on_hit_dirty()
            if (now) {
                var now_com = now.getComponent("dirty_item");
                if (now != this.prev_hit) { // 算一次
                    this.prev_hit = now;
                    now.opacity -= now_com.dec_delta;
                    
                    now_com.clear_times --;
                    if (now.opacity < 0) {
                        now.opacity = 0;
                    }
                    this.start_x = event.getLocation().x;
                    this.start_y = event.getLocation().y;
                    this.prev_dir = dir;
                    
                    
                    if (this.root_scripte_comp.is_show_card_check()) {
                        this.root_scripte_comp.show_card();
                        this.hide_sound = false;
                    }
                    
                    if (this.root_scripte_comp.is_checkout_success()) {
                        cc.audioEngine.stopMusic(false);
                        this.root_scripte_comp.show_checkout();
                        this.hide_sound = false;
                    }
                }
                else if((dir != this.prev_dir && (Math.abs(this.start_x - event.getLocation().x) >= 200) || Math.abs(this.start_x - event.getLocation().x) >= 200)) {
                    now.opacity -= now_com.dec_delta;
                    
                    now_com.clear_times --;
                    if (now.opacity < 0) {
                        now.opacity = 0;
                    }
                    this.start_x = event.getLocation().x;
                    this.start_y = event.getLocation().y;
                    this.prev_dir = dir;
                    
                    
                    if (this.root_scripte_comp.is_show_card_check()) {
                        this.root_scripte_comp.show_card();
                        this.hide_sound = false;
                    }
                    
                    if (this.root_scripte_comp.is_checkout_success()) {
                        cc.audioEngine.stopMusic(false);
                        this.root_scripte_comp.show_checkout();
                        this.hide_sound = false;
                    }
                }
                else {
                    
                }
                return;
            }
            
            this.prev_hit = now;
        }.bind(this));
        
        this.node.on('touchend', function(event){
            this.node.opacity = 0;
            this.move_hit = true;
            this.prev_hit = null;
            this.node.getChildByName("anim").active = false;
            this.node.setPosition(this.start_pos);
            
            if (this.hide_sound) {
                cc.audioEngine.stopMusic(false);
            }
            
            
            if(this.root_scripte_comp.game_started === true) {
                this.root_scripte_comp.play_idle_anim();
            }
        }.bind(this));
        
        this.node.on('touchcancel', function(event){
            this.node.opacity = 0;
            this.move_hit = true;
            this.prev_hit = null;
            this.node.getChildByName("anim").active = false;
            this.node.setPosition(this.start_pos);
            if (this.hide_sound) {
                cc.audioEngine.stopMusic(false);
            }
            
            if(this.root_scripte_comp.game_started === true) {
                this.root_scripte_comp.play_idle_anim();
            }
        }.bind(this));
        
        // 移动端有bug,所以使用schedule来做初始化;
        this.scheduleOnce(this.on_start.bind(this), 0);
    },
    
    start: function() {
        // this.node.active = false;    
        this.node.getChildByName("anim").active = false;
    }, 
    
    on_start: function() {
        this.start_pos = this.node.getPosition();
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
