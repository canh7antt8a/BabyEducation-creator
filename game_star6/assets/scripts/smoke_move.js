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
        this.doing = false;
    },
    
    add_win: function() {
        if(this.doing === false) {
            this.doing = true;
            this.scheduleOnce(function() {
                this.node.runAction(cc.moveTo(10, -1000 - 900 * Math.random(), 0));
            }.bind(this), 0.1 + Math.random() * 0.5)
        }
    }
    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
