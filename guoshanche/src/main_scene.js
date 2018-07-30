
var main_scene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = cc.Layer.create();
        this.addChild(layer);

        var mainscene = ccs.load(res.main_scene_json);
        this.addChild(mainscene.node);

        var rot = cc.RotateBy.create(3, 360);
        var repeat = cc.RepeatForever.create(rot);
        var guang = ccui.helper.seekWidgetByName(mainscene.node, "guang");
        guang.runAction(repeat);

        var game_start = ccui.helper.seekWidgetByName(mainscene.node, "game_start");
        // game_start.addTouchEventListener(this.on_game_start, this);
        game_start.addClickEventListener(this.on_game_start, this);

        // 气球移动
        var TIME = 0.7;
        var Y_POS = 60;

        var red_ball = ccui.helper.seekWidgetByName(mainscene.node, "red_ball");
        var pos = red_ball.getPosition();
        pos.y -= Y_POS;
        red_ball.setPosition(pos);
        var moveby = cc.MoveBy.create(TIME, 0, Y_POS);
        red_ball.runAction(moveby);

        var green_ball = ccui.helper.seekWidgetByName(mainscene.node, "green_ball");
        pos = green_ball.getPosition();
        pos.y -= Y_POS;
        green_ball.setPosition(pos);
        moveby = cc.MoveBy.create(TIME, 0, Y_POS);
        green_ball.runAction(moveby);
        // end

        // 标题移动
        var tital = ccui.helper.seekWidgetByName(mainscene.node, "tital_label");
        var TITAL_MOVE_BY = 80;
        var DOWN_MOVE_TIME = 0.4;
        pos = tital.getPosition();
        pos.y += TITAL_MOVE_BY;
        tital.setPosition(pos);
        moveby = cc.MoveBy.create(DOWN_MOVE_TIME, 0, -TITAL_MOVE_BY);
        
        var DEGREE = 5;
        var ROT_TIME = 0.1;
        var rotby = cc.RotateBy.create(ROT_TIME, DEGREE);
        var rot_to_down = cc.RotateBy.create(ROT_TIME * 2, -DEGREE - DEGREE * 0.5);
        var rot_bk = cc.RotateTo.create(ROT_TIME, 0);

        /*tital.runAction(moveby);
        tital.runAction(rotby);
        tital.runAction(rot_to_down);
        tital.runAction(rot_bk);*/
        var seq = cc.Sequence.create([moveby, rotby, rot_to_down, rot_bk]);
        tital.runAction(seq);
        // end

        this.center_root = ccui.helper.seekWidgetByName(mainscene.node, "center_root");
        play_sound(res.sound_main_scene_bg_mp3, true);
    },

    on_game_start: function() {
        play_sound(res.sound_click_mp3, false);
        cc.director.runScene(new game_scene());
    },

    on_resize: function() {
        this.center_root.setPosition(display.cx(), display.cy());
    },
});

