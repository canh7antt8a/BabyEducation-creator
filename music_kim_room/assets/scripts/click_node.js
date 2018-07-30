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
        index: 0,
        play_time: 3,
    },

    // use this for initialization
    onLoad: function () {
        this.playing = false;
        this.node.on('touchstart', function(event) {
            if(this.playing === true) {
                return;
            }
            var bound_box = this.node.getBoundingBox(); 
            var pos = this.node.getParent().convertTouchToNodeSpace(event);
            if(bound_box.contains(pos)) {
                event.stopPropagation();
                this.on_click();
                
            }
        }.bind(this));
    },
    
    on_click: function() {
        var main_scene = cc.find("UI_ROOT").getComponent("main_scene");    
        main_scene.on_click_node_index(this.node, this.index, this.play_time);
        this.playing = true;
        this.scheduleOnce(function(){
            this.playing = false;
        }.bind(this), this.play_time);
    }, 
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
