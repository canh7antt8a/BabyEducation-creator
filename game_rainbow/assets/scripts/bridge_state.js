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
        
    },
    
    show_state: function(now) {
        var b1 = this.node.getChildByName("qiao1");
        b1.active = false;
        var b2 = this.node.getChildByName("qiao2");
        b2.active = false;
        var b3 = this.node.getChildByName("qiao3");
        b3.active = false;
        var b4 = this.node.getChildByName("qiao4");
        b4.active = false;
        var b5 = this.node.getChildByName("qiao5");
        b5.active = false;
        var b6 = this.node.getChildByName("qiao6");
        b6.active = false;
        var b7 = this.node.getChildByName("qiao7");
        b7.active = false;
        
        var now_item = this.node.getChildByName("qiao" + now);
        now_item.active = true;
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
