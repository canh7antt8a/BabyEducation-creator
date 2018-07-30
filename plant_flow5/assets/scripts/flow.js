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
        stage: 0,
        is_pugongyin: false,
        flow: {
            default: [],
            type: cc.Node
        },
    },

    // use this for initialization
    onLoad: function () {
        
    },
    
    start: function() {
        this.show_stage(this.stage); 
    }, 
    
    show_stage: function(s) {
        for(var i = 0; i < this.flow.length; i ++) {
            this.flow[i].active = false;
        }
        
        if (this.flow.length <= 0 || s <= 0 || s > this.flow.length) {
            return;
        }
        this.flow[s - 1].active = true;
        if(s >= 2) {
            this.flow[s - 2].active = true;
            this.flow[s - 2].runAction(cc.fadeOut(1));
            
            this.flow[s - 1].opacity = 0;
            this.flow[s - 1].runAction(cc.fadeIn(1));
        }
        else {
            this.flow[s - 1].opacity = 255;
        }
    },
    
    show_tu: function(v) {
        var tu = this.node.getChildByName("tu");
        tu.active = true;
        
        var tu2 = this.node.getChildByName("tu2");
        tu2.active = false;
    }, 
    
    reset_game: function() {
        var tu = this.node.getChildByName("tu");
        tu.active = false;
        
        var tu2 = this.node.getChildByName("tu2");
        tu2.active = true;
        
        for(var i = 0; i < this.flow.length; i ++) {
            this.flow[i].active = false;
        }
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
