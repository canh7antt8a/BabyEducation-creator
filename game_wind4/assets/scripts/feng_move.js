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
        this.swing = false;
        this.doing = false;
        this.speed = 100;
        this.is_stop_move = false;
        this.game_scene = cc.find("UI_ROOT").getComponent("game_scene");
    },
    
    reset: function() {
        this.node.y = -250;
        this.node.x = -110;
        this.is_stop_move = false;
    },
    
    add_win: function() {
        if (this.is_stop_move) {
            return;
        }
        
        this.swing = true;
        if(this.doing === false) {
            this.doing = true;
            var time = 0.2 + Math.random() * 0.3;
            var distance = -this.speed * time;
            if (this.node.x + distance < -650) {
                distance = -630 - this.node.x;
                time = distance / this.speed;
                this.is_stop_move = true;
                this.game_scene.zichuan_arrived();
            }
            var m = cc.moveBy(time, distance, 0);
            var func = cc.callFunc(function() {
                this.doing = false;
            }.bind(this), this);
            
            var seq = cc.sequence([m, func]);
            this.node.runAction(seq);
        }
    }
    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
