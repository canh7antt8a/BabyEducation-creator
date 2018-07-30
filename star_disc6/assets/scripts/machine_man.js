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
        /*
        this.top_man = this.node.getChildByName("top");
        this.top_man.opacity = 0;
        
        this.b1 = this.node.getChildByName("b1");
        this.b1.opacity = 0;
        
        this.b2 = this.node.getChildByName("b2");
        this.b2.opacity = 0;
        
        this.b3 = this.node.getChildByName("b3");
        this.b3.opacity = 0;
        
        this.t1 = this.node.getChildByName("t1");
        this.t1.scale = 0;
        
        this.t2 = this.node.getChildByName("t2");
        this.t2.scale = 0;
        
        this.t3 = this.node.getChildByName("t3");
        this.t3.scale = 0;
        
        this.man = this.node.getChildByName("man");
        this.man.scale = 0;
        
        this.finded_mask = [0, 0, 0, 0];*/
    },
    
    reset_manchine_man: function() {
        /*this.top_man.opacity = 0;
        this.b1.opacity = 0;
        this.b2.opacity = 0;
        this.b3.opacity = 0;
        
        this.t1.scale = 0;
        this.t2.scale = 0;
        this.t3.scale = 0;
        this.man.scale = 0;
        
        this.finded_mask = [0, 0, 0, 0];*/
    },
    
    show_fire: function() {
        /*this.t1.scale = 1;
        this.t2.scale = 1;
        this.t3.scale = 1;    
        this.man.scale = 1;
        this.man.y = 0;
        this.man.runAction(cc.moveBy(0.5, 0, 77));*/
    }, 
    
    get_daoju: function(type) {
        /*var delay = cc.delayTime(0.5);
        switch(type) {
            case 1:
                this.b1.runAction(cc.fadeIn(0.5));
                this.finded_mask[0] = 1;
            break;
            case 2:
                this.b2.runAction(cc.fadeIn(0.5));
                this.finded_mask[1] = 1;
            break;
            case 6:
                this.finded_mask[2] = 1;
                this.b3.runAction(cc.fadeIn(0.5));
            break;
            case 7:
                this.finded_mask[3] = 1;
                this.top_man.runAction(cc.fadeIn(0.5));
            break;
        }*/
    },
    
    is_all_find: function() {
        /*for(var i = 0; i < this.finded_mask.length; i ++) {
            if(this.finded_mask[i] === 0) {
                return false;
            }
        }*/
        return true;
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
