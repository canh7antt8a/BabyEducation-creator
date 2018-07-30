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

    // use this for initialization
    onLoad: function () {
        this.node.opacity = 0;
        
        this.root_scripte_comp = (cc.find("UI_ROOT")).getComponent("game_scene");
        this.move_hit = true;
        
        this.node.on('touchstart', function(event) {
            this.move_hit = true;
            this.node.opacity = 128;
            var bound_box = this.node.getBoundingBox(); 
            var pos = this.node.getParent().convertTouchToNodeSpace(event);
            if(bound_box.contains(pos)) {
                event.stopPropagation();
            }
            
        }.bind(this));
        
        this.node.on('touchmove', function(event){
            if(this.move_hit === false) {
                return;
            }
            
            var pos = this.node.getParent().convertTouchToNodeSpace(event);
            this.node.setPosition(pos);
            
            var world_pos = event.getLocation();
            
            if(cc.pDistance(world_pos, this.root_scripte_comp.center_pos) < 240) { //
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
            }
            
        }.bind(this));
        
        this.node.on('touchend', function(event){
            this.node.opacity = 0;
            this.move_hit = true;
            this.node.setPosition(this.start_pos);
        }.bind(this));
        
        // 移动端有bug,所以使用schedule来做初始化;
        // this.scheduleOnce(this.on_start.bind(this), 0);
    },
    
    start: function() {
        this.start_pos = this.node.getPosition();
    }, 
    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
