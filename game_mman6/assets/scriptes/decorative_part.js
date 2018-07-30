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
        sub_type: 0,
        main_type: 0,
        start_scale: 1.0,
        
        start_x: 0,
        start_y: 0,
    },

    // use this for initialization
    onLoad: function () {
        
        this.move_hit = false;
        this.invalid_move_hit = false;
        this.move_success = false;
        this.dst_root = cc.find("UI_ROOT/anchor-center/car_root");
        this.game_scene = cc.find("UI_ROOT").getComponent("game_scene");
        // this.node.scale = this.start_scale;
        this.node.on('touchstart', function(event) {
            // console.log("this.invalid_move_hit = " + this.invalid_move_hit)
            // console.log("this.move_hit = " + this.move_hit)
            this.start_pos = cc.p(this.node.x, this.node.y);
            if(this.invalid_move_hit === true || this.move_hit === true) {
                return;
            }
            
            this.move_hit = false;
            var bound_box = this.node.getBoundingBox(); 
            var pos = this.node.getParent().convertTouchToNodeSpace(event);
            if(bound_box.contains(pos)) {
                event.stopPropagation();
            }
        }.bind(this));
        
        this.node.on('touchmove', function(event) {
            // console.log("this.invalid_move_hit = " + this.invalid_move_hit)
            // console.log("this.move_hit = " + this.move_hit)

            if(this.invalid_move_hit === true || this.move_hit === true) {
                return;
            }
            
            var pos = this.node.getParent().convertTouchToNodeSpace(event);
            this.node.setPosition(pos);
            
            var world_pos = event.getLocation();
            this.game_scene.hit_machine_man_part(this, world_pos, this.main_type, this.sub_type);
            
        }.bind(this));
        
        this.node.on('touchend', this.on_touch_ended.bind(this));
        this.node.on('touchcancel', this.on_touch_ended.bind(this));
    },
    on_touch_ended: function() {
        if (this.invalid_move_hit === true) {
            return;
        }
        
        // this.node.opacity = 255;
        if(this.move_hit === false && this.move_success === false) {
            this.node.setPosition(this.start_pos);
            // this.node.scale = this.start_scale; 
        }
        else {
            this.move_success = false;
            this.move_hit = false;
        }
    }, 

    on_hit_item: function(delay_time, to_w_pos) {
        this.move_hit = true;
        this.move_success = true;
        var local_pos = this.node.getParent().convertToNodeSpaceAR(to_w_pos);
        var moveby = cc.moveTo(0.2, local_pos);
        var callback = cc.callFunc(function() {
            // this.move_hit = false;
            this.game_scene.enter_next_mode();
        }.bind(this), this);
                
        var seq = cc.sequence([moveby, callback]);
        this.node.runAction(seq);
    },
    
    move_back: function() {
        var m = cc.moveTo(0.2, this.start_pos);
        var func = cc.callFunc(function() {
            this.move_hit = false;    
        }.bind(this), this);
        var seq = cc.sequence([m, func]);
        this.node.runAction(seq);
        // this.node.runAction(cc.scaleTo(0.2, this.start_scale));
        return 0.2;
    },
    
    invalid_hit_move: function() {
        this.invalid_move_hit = true;    
    }, 
    
    valid_hit_move: function() {
        this.invalid_move_hit = false;    
    }, 
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
