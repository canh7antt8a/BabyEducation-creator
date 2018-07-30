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
        clear_times: 3,
        is_clear: false,
        dirty_type: 0,
    },

    // use this for initialization
    onLoad: function () {
        this.start_clear_tims = this.clear_times;
        this.dec_delta = Math.floor(255 / this.clear_times) + 1;
        if(this.is_clear) {
            this.clear_times = 0;
            this.node.opacity = 0;
        }
    },
    
    reset_game: function() {
        if (this.is_clear) {
            this.clear_times = 0;
            this.node.opacity = 0;    
        }
        else {
            this.clear_times = this.start_clear_tims;
            this.node.opacity = 255;
        }
    }, 
    
    active_dirty: function() {
        this.clear_times = this.start_clear_tims;
        this.node.opacity = 255;
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
