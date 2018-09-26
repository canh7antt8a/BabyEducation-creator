cc.Class({
    "extends": cc.Component,

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
        index: 0
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.sprite_com = this.node.getComponent(cc.Sprite);

        this.fliped = false;

        this.game_scene_comp = cc.find("UI_ROOT").getComponent("game_scene");

        this.node.on('touchstart', (function (event) {
            var bound_box = this.node.getBoundingBox();
            var pos = this.node.getParent().convertTouchToNodeSpace(event);
            if (this.fliped === false && bound_box.contains(pos)) {
                event.stopPropagation();
                this.game_scene_comp.on_card_flip(this, this.card_value);
            }
        }).bind(this));
    },

    flip_to_back: function flip_to_back() {
        var s = cc.scaleTo(0.1, 0, 1);
        var callback = cc.callFunc((function () {
            this.sprite_com.spriteFrame = this.bk_sf.clone();
        }).bind(this), this);
        var s2 = cc.scaleTo(0.1, 1, 1);
        var callback2 = cc.callFunc((function () {
            this.fliped = false;
        }).bind(this), this);

        var seq = cc.sequence([s, callback, s2, callback2]);
        this.node.runAction(seq);
    },

    flip_to_back_with_value: function flip_to_back_with_value(card_value) {
        this.card_value = card_value;
        // this.sprite_com.spriteFrame = this.anim_sf_set[card_value].clone();
        var anim_set = this.game_scene_comp.get_anim_set();
        this.sprite_com.spriteFrame = anim_set[card_value - 1].clone();
        // this.node.scale = 0.2 * card_value;
        this.fliped = false;
    },

    flip_to_value: function flip_to_value() {
        var s = cc.scaleTo(0.1, 0, 1);

        var callback = cc.callFunc((function () {
            var url = cc.url.raw("resources/game_scene/card_" + this.card_value + ".png");
            var sf = new cc.SpriteFrame(url);
            this.sprite_com.spriteFrame = sf;
        }).bind(this), this);

        var s2 = cc.scaleTo(0.1, 1, 1);

        var callback2 = cc.callFunc((function () {
            this.fliped = true;
        }).bind(this), this);

        var seq = cc.sequence([s, callback, s2, callback2]);
        this.node.runAction(seq);
    },

    get_card_value: function get_card_value() {
        return this.card_value;
    },

    get_seat: function get_seat() {
        return this.index;
    }
});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },