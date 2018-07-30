var decorative_params = cc.Class({
    name: 'decorative_params',
    properties: {
        main_type: 0,
        flip_x: 0,
        xpos: 0,
        ypos: 0,
    }
});

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
        front_items: {
            default: [],
            type: cc.Prefab,
        },
        back_items: {
            default: [],
            type: cc.Prefab,
        },
        
        dst_pos: {
            default: null,
            type: cc.Vec2,
        },
        car_part_type: 0,
        main_type: 0,
        
        decorative_item: {
            default: [],
            type: decorative_params,
        },
        start_scale: 1.0,
    },
    
    // use this for initialization
    onLoad: function () {
        this.move_hit = false;
        this.dst_root = cc.find("UI_ROOT/anchor-center/car_root");
        this.game_scene = cc.find("UI_ROOT").getComponent("game_scene");
        this.node.scale = this.start_scale;
        
        this.node.on('touchstart', function(event) {
            if(this.move_hit === true) {
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
            if(this.move_hit === true) {
                return;
            }
            
            var pos = this.node.getParent().convertTouchToNodeSpace(event);
            this.node.setPosition(pos);
            this.node.scale = 1;
            var world_dst_pos = this.dst_root.convertToWorldSpace(this.dst_pos);
            
            var world_pos = event.getLocation();
            // 绘制提示
            this.game_scene.show_game_tip_car_part(this.car_part_type, world_dst_pos);
            // end 
            if(cc.pDistance(world_pos, world_dst_pos) <= 100) { //
               this.on_hit_item(world_dst_pos);
            }
            
        }.bind(this));
        
        this.node.on('touchend', this.on_touch_ended.bind(this));
        this.node.on('touchcancel', this.on_touch_ended.bind(this));
    },
    
    on_hit_item: function(world_dst_pos) {
        var delay_time = this.game_scene.change_car_part(this.node, this.car_part_type, this.main_type);
        this.move_hit = true;
        var local_pos = this.node.getParent().convertToNodeSpaceAR(world_dst_pos);
        var moveby = cc.moveTo(0.2, local_pos);
        var callback = cc.callFunc(function() {
        }.bind(this), this);
        
        // var seq = cc.sequence([cc.delayTime(delay_time), moveby, callback]);
        var seq = cc.sequence([moveby, callback]);
        this.node.runAction(seq);
    },
    
    on_touch_ended: function() { 
        // this.node.opacity = 255;
        if(this.move_hit === false) {
            this.node.setPosition(this.start_pos);
            this.node.scale = this.start_scale;
        }
        this.game_scene.hide_game_tip_car_part();
    },
    
    set_start_pos: function(x, y) {
        this.start_pos = cc.p(x, y);
        this.node.x = x;
        this.node.y = y;
    },
    
    move_back: function() {
        var m = cc.moveTo(0.2, this.start_pos);
        var func = cc.callFunc(function() {
            this.move_hit = false;    
        }.bind(this), this);
        var seq = cc.sequence([m, func]);
        this.node.runAction(seq);
        this.node.active = true;
        this.node.scale = this.start_scale;
        return 0.2;
    },
    
    invalid_hit_move: function() {
        this.move_hit = true;    
    }, 
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
