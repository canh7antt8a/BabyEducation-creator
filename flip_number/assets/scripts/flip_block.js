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
    },

    // use this for initialization
    onLoad: function () {
        this.sprite_com = this.node.getComponent(cc.Sprite);
        var url = cc.url.raw("resources/game_scene/cardback.png");
        this.bk_sf = new cc.SpriteFrame(url);
        this.fliped = false;
        
        this.game_scene_comp = cc.find("UI_ROOT").getComponent("game_scene");
        
        this.node.on('touchstart', function(event) {
            var bound_box = this.node.getBoundingBox(); 
            var pos = this.node.getParent().convertTouchToNodeSpace(event);
            if(this.fliped === false && bound_box.contains(pos)) {
                event.stopPropagation();
                this.game_scene_comp.on_card_flip(this, this.card_value);
            }
        }.bind(this));
    },
    
    flip_to_back:function() {
        var s = cc.scaleTo(0.1, 0, 1);
        var callback = cc.callFunc(function() {
            this.sprite_com.spriteFrame = this.bk_sf.clone();    
        }.bind(this), this);
        var s2 = cc.scaleTo(0.1, 1, 1);
        var callback2 = cc.callFunc(function() {
            this.fliped = false;
        }.bind(this), this);
        
        var seq = cc.sequence([s, callback, s2, callback2]);
        this.node.runAction(seq);
    },
    
    flip_anim_back_with_value:function(card_value) {
        this.card_value = card_value; 
        var s = cc.scaleTo(0.1, 0, 1);
        var callback = cc.callFunc(function() {
            this.sprite_com.spriteFrame = this.bk_sf.clone();    
        }.bind(this), this);
        var s2 = cc.scaleTo(0.1, 1, 1);
        var callback2 = cc.callFunc(function() {
            this.fliped = false;
        }.bind(this), this);
        
        var seq = cc.sequence([s, callback, s2, callback2]);
        this.node.runAction(seq);
    },
    
    flip_to_back_with_value:function(card_value) {
        this.card_value = card_value;
        this.sprite_com.spriteFrame = this.bk_sf.clone();
        this.fliped = false;
    },
    
    flip_to_value: function() {
        var s = cc.scaleTo(0.1, 0, 1);
        
        var callback = cc.callFunc(function() {
            var url = cc.url.raw("resources/game_scene/card_" + this.card_value + ".png");
            var sf = new cc.SpriteFrame(url);
            this.sprite_com.spriteFrame = sf; 
        }.bind(this), this);
        
        var s2 = cc.scaleTo(0.1, 1, 1);
        
        var callback2 = cc.callFunc(function() {
            this.fliped = true;
        }.bind(this), this);
        
        var seq = cc.sequence([s, callback, s2, callback2]);
        this.node.runAction(seq);
    },
    
    get_card_value: function() {
        return this.card_value;
    },
    
    get_seat: function() {
        return this.index;    
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
