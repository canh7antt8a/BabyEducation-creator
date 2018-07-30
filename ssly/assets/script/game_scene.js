var GAME_DATA = require("game_data");
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
        player: cc.Node,
        prefabs: {
            default: [],
            type: cc.Prefab,
        },
    },

    // use this for initialization
    onLoad: function () {
        this.player.on('touchstart', function(event) {
            var bound_box = this.player.getBoundingBox(); 
            var pos = this.player.getParent().convertTouchToNodeSpace(event);
            if(bound_box.contains(pos)) {
                event.stopPropagation();
            }
            
        }.bind(this));
        
        this.player.on('touchmove', function(event){
            var delta = event.getDelta();
            this.player.x += delta.x;
            var s = this.player.getComponent(cc.Sprite);
            if(delta.x < 0) {
                this.player.scaleX = 1;        
            }
            else {
                this.player.scaleX = -1;
            }
        }.bind(this));
        
        this.player.on('touchend', function(event){
        }.bind(this));
        
        this.score = 0;
        // this.game_over = false;
        
        this.scheduleOnce(this.emit_cat.bind(this), 0.5);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    
    emit_cat: function() {
        var cat = cc.instantiate(this.prefabs[0]);
        var anchor_left = this.node.getChildByName("anchor-left");
        anchor_left.addChild(cat);
        
        var time = 2.5 + Math.random();
        this.scheduleOnce(this.emit_cat.bind(this), time);
    },
    
    add_score: function() {
        this.score++;
    },
    
    
    enter_checkout_scene: function() {
        if(window.localStorage) {
            var up = 0;
            var best = window.localStorage["best"];
            if (!best|| best < this.score) {
                window.localStorage["best"] = this.score;
                up = 1;
                best = this.score;
            }
        }
        else {
            up = 0;
            best = this.score;
        }
        
        GAME_DATA.GAME_SCORE = this.score;
        GAME_DATA.GAME_BEST = best;
        GAME_DATA.IS_ADVANCE = up;
        
        cc.director.loadScene("checkout");
    }, 
    
    on_game_over: function() {
        this.unschedule(this.emit_cat);
        this.scheduleOnce(this.enter_checkout_scene.bind(this), 1);
    },
    
});

