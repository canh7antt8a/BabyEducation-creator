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
        is_answer_line: false,
    },

    // use this for initialization
    onLoad: function () {
        
    },
    
    connect_vec: function(w_lhs, w_rhs) {
        if (this.node.parent === null) {
            console.log("this fuction must parent not null");
            return;
        }
        
        var pos = this.node.parent.convertToNodeSpaceAR(w_lhs);
        this.node.x = pos.x;
        this.node.y = pos.y;
        
        this.node.scaleX = cc.pDistance(w_lhs, w_rhs);
        var r = Math.atan2((w_rhs.y - w_lhs.y), (w_rhs.x - w_lhs.x));
        r = r * 180 / 3.14;
        r = 360 - r;
        this.node.rotation = r;
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
