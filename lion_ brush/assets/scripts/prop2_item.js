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
    
    on_hit_dirty: function(dirty_type) {
        var bound_box = this.hit_mask.getBoundingBox();
        var c_size = this.hit_mask.getContentSize();
        var w_startpos = this.hit_mask.convertToWorldSpace(cc.Vec2(0, 0))
        bound_box = new cc.rect(w_startpos.x, w_startpos.y, c_size.width, c_size.height);
        var dirty_set = this.root_scripte_comp.get_hit_dirty_set();
        for(var i = 0; i < dirty_set.length; i ++) {
            var now = dirty_set[i];
            var now_com = now.getComponent("dirty_item");
            if (now_com.dirty_type != dirty_type ) {
                continue;
            }
        
            c_size = now.getContentSize();
            w_startpos = now.convertToWorldSpace(cc.Vec2(0, 0))
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
        this.play_ended = true;
        this.node.on('touchstart', function(event) {
            if (!this.root_scripte_comp.game_started) {
                return;
            }
            
            var bound_box = this.node.getBoundingBox(); 
            var pos = this.node.getParent().convertTouchToNodeSpace(event);
            if(bound_box.contains(pos)) {
                event.stopPropagation();
                // this.node.getChildByName("anim").active = true;
                this.node.getChildByName("anim").active = false;
                this.node.getChildByName("icon").active = true;
                this.prev_hit = false;
                this.prev_dir = 0;
                this.move_hit = true;
                this.node.opacity = 255;
                this.hit_mask.opacity = 0;
                this.start_x = event.getLocation().x;
                this.start_y = event.getLocation().y;
                this.root_scripte_comp.play_guli_anim();
                this.play_ended = true;
            }
        }.bind(this));
        
        this.node.on('touchmove', function(event){
            if(this.move_hit === false) {
                return;
            }
            
            
            var pos = this.node.getParent().convertTouchToNodeSpace(event);
            this.node.setPosition(pos);
            
 
            var now = this.on_hit_dirty(1)
            if (now) {
                this.move_hit = false;
                this.play_ended = false;
                // 播放挤牙膏动画
                this.node.getChildByName("anim").active = true;
                this.node.getChildByName("icon").active = false;
                var dirty_com = now.getComponent("dirty_item");
                dirty_com.reset_game();
                    
                var ske_com = this.node.getChildByName("anim").getComponent(sp.Skeleton);
                ske_com.clearTracks();
                ske_com.setAnimation(0, "jiyagao", false);
                this.node.x = -10;
                this.node.y = 410;
                
                
                this.scheduleOnce(function(){
                    this.play_ended = true;
                    this.node.opacity = 0;
                    this.move_hit = true;
                    this.prev_hit = null;
                    this.node.getChildByName("anim").active = false;
                    this.node.getChildByName("icon").active = true;
                    this.node.setPosition(this.start_pos);
                    var dirty_com = now.getComponent("dirty_item");
                    dirty_com.active_dirty();
                }.bind(this), 1.5);
                // end 
            }
            
            this.prev_hit = now;
        }.bind(this));
        
        this.node.on('touchend', function(event){
            if (this.play_ended == true) {
                this.node.opacity = 0;
                this.move_hit = true;
                this.prev_hit = null;
                this.node.getChildByName("anim").active = false;
                this.node.getChildByName("icon").active = true;
                this.node.setPosition(this.start_pos);
            }
            
        }.bind(this));
        
        this.node.on('touchcancel', function(event){
            if(this.play_ended == true) {
                this.node.opacity = 0;
                this.move_hit = true;
                this.prev_hit = null;
                this.node.getChildByName("anim").active = false;
                this.node.getChildByName("icon").active = true;
                this.node.setPosition(this.start_pos);    
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
