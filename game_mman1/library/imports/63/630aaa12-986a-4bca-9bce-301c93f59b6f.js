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

        elec_type: 1
    },

    is_ui_drag: function is_ui_drag() {
        return this.is_drag_item;
    },

    set_ui_drag: function set_ui_drag() {
        this.is_drag_item = true;
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.is_drag_item = false;
        this.game_scene = cc.find("UI_ROOT").getComponent("game_scene");
        this.hited = false;

        if (this.elec_type <= 9) {
            this.off = this.node.getChildByName("off");
            this.on = this.node.getChildByName("on");
        } else {
            this.elec_value = this.node.getChildByName("elec_value");
        }
        this.mode = 0;
        this.v = 100;

        // touch
        this.is_invalid_touch = false;
        this.node.on(cc.Node.EventType.TOUCH_START, (function (event) {
            event.stopPropagation();
            this.node.setLocalZOrder(1000);
            this.hited = false;
        }).bind(this));
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (function (event) {
            this.on_touch_moved(event);
        }).bind(this));

        this.node.on(cc.Node.EventType.TOUCH_END, (function (event) {
            this.node.setLocalZOrder(0);
            if (this.is_invalid_touch) {
                return;
            }
            var w_pos = event.getLocation();
            var is_hit = this.game_scene.on_hit_test(this.node, this.elec_type, w_pos);
            if (this.is_drag_item === false) {
                // 删除
                this.node.removeFromParent();
                return;
            }
            /*if(is_hited) {
                this.node.opacity = 0;
                this.hited = true;
                this.node.x = this.start_x;
                this.node.y = this.start_y;
            }*/

            this.node.x = this.start_x;
            this.node.y = this.start_y;
            this.node.opacity = 0;
            this.hited = false;
        }).bind(this));
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, (function (event) {
            this.node.setLocalZOrder(0);
            if (this.is_invalid_touch) {
                return;
            }

            var w_pos = event.getLocation();
            var is_hit = this.game_scene.on_hit_test(this.node, this.elec_type, w_pos);
            if (this.is_drag_item === false) {
                // 删除
                this.node.removeFromParent();
                return;
            }

            this.node.x = this.start_x;
            this.node.y = this.start_y;
            this.node.opacity = 0;
            this.hited = false;
        }).bind(this));
        // end
    },

    set_start_pos: function set_start_pos(xpos, ypos) {
        this.start_x = xpos;
        this.start_y = ypos;
    },

    on_touch_moved: function on_touch_moved(event) {
        if (this.is_invalid_touch === true || this.hited) {
            // 屏蔽掉这个消息。
            return;
        }

        var w_pos = event.getLocation();
        this.node.opacity = 128;

        var pos = this.node.parent.convertToNodeSpace(w_pos);
        this.node.x = pos.x;
        this.node.y = pos.y;
        /*
        var is_hited = this.game_scene.on_hit_test(this.node, this.elec_type, w_pos);
        if(is_hited) {
            this.node.opacity = 0;
            this.hited = true;
            this.node.x = this.start_x;
            this.node.y = this.start_y;
        }*/
    },

    invalid_touch: function invalid_touch() {
        this.is_invalid_touch = true;
    },

    start: function start() {
        this.node.setCascadeOpacityEnabled(true);
        this.show_when_failed();
        // this.show_when_success();
        // this.show_anim_not_conneced();
    },

    show_when_success: function show_when_success() {
        if (this.elec_type <= 9) {
            this.off.active = false;
            this.on.active = true;
            return;
        } else {
            // this.elec_value.height = 69;
            this.show_anim_conneced();
        }
    },

    show_when_failed: function show_when_failed() {
        if (this.elec_type <= 9) {
            this.off.active = true;
            this.on.active = false;
            return;
        } else {
            this.elec_value.height = 0;
        }
    },

    show_anim_not_conneced: function show_anim_not_conneced() {
        this.mode = 2;
        this.step = 0;
    },

    show_anim_conneced: function show_anim_conneced() {
        this.mode = 1;
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        if (this.elec_type <= 9) {
            return;
        }

        if (this.mode === 0) {
            return;
        }

        if (this.mode === 2 && this.step === 0) {
            // 涨
            var s = this.v * dt;
            this.elec_value.height += s;
            if (this.elec_value.height >= 69) {
                // 涨停
                this.step = 1;
                this.elec_value.height = 69;
            }
        } else if (this.mode === 2 && this.step === 1) {
            // 跌停
            var s = this.v * dt;
            this.elec_value.height -= s;
            if (this.elec_value.height <= 0) {
                // 跌停
                this.mode = 0;
            }
        } else if (this.mode === 1) {
            // 成功涨到最高。
            var s = this.v * dt;
            this.elec_value.height += s;
            if (this.elec_value.height >= 69) {
                // 涨停
                this.mode = 0;
                this.elec_value.height = 69;
            }
        }
    }
});