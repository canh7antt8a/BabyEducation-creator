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
        this.exitmask = this.node.getChildByName("exitmask");
        this.stargate = this.node.getChildByName("stargate");
        
        this.q1 = this.node.getChildByName("q1");
        this.q2 = this.node.getChildByName("q2");
        this.q3 = this.node.getChildByName("q3");
        
        this.exitmask.scale = 0;
        this.stargate.scale = 0;
        
        var f = cc.repeatForever(cc.rotateBy(3, 360));
        this.exitmask.runAction(f);
    },
    
    start: function() {
        this.q1.active = false;
        this.q2.active = false;
        this.q3.active = false;
    },
    
    reset_manchine_man: function() {
        this.stargate.scale = 0;
        this.exitmask.scale = 0;
        
        this.q1.active = false;
        this.q2.active = false;
        this.q3.active = false;
    },
    
    show_fire: function() {
        this.stargate.scale = 1;
        this.exitmask.scale = 1;
    }, 
    
    get_daoju: function(type) {
        switch(type) {
            case 0:
                this.q1.active = true;
            break;
            case 1:
                this.q2.active = true;
            break;
            case 2:
                this.q3.active = true;
            break;
        }
    },
    
    is_all_find: function() {
        return false;
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
