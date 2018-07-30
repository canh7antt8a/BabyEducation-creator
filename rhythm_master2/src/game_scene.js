
var game_scene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        
        var layer = cc.Layer.create();
        this.addChild(layer);
        helper.add_listener_touch_one_by_one(layer, {
            onTouchBegan: function(t, event)
            {
                var pos = t.getLocation();
                if (pos.x < display.cx() - 10) {
                    this.on_left_action();
                }
                else if(pos.x > display.cx() + 10) {
                    this.on_right_action();
                }
                return true;
            }.bind(this),
            onTouchMoved: function(t, event){}.bind(this),
            onTouchEnded: function(t, event){}.bind(this),
        });

        // 游戏
        var ccs_json = ccs.load(res.game_scene_json);
        layer.addChild(ccs_json.node);
        helper.adjust_anchor(ccs_json.node);
        this.game_scene_ccs = ccs_json;
        var back_ground = ccui.helper.seekWidgetByName(ccs_json.node, "anchor-background")
        new_star_moon_anim(back_ground)
        // var left_node = ccui.helper.seekWidgetByName(ccs_json.node, "left_node");
        // var right_node = ccui.helper.seekWidgetByName(ccs_json.node, "right_node");
       

        var left_button = ccui.helper.seekWidgetByName(ccs_json.node, "button_left");
        left_button.addClickEventListener(this.on_left_action.bind(this));
        this.left_button = left_button

        var right_button = ccui.helper.seekWidgetByName(ccs_json.node, "button_right");
		right_button.addClickEventListener(this.on_right_action.bind(this));
        this.right_button = right_button

        var again_button = ccui.helper.seekWidgetByName(ccs_json.node, "again_button");
        again_button.addClickEventListener(function() {
            cc.audioEngine.stopMusic(false);
            this.scheduleOnce(this.on_start_game.bind(this), 0.5);
            
        }.bind(this));
        this.again_button = again_button;

        this.well_done_anim = ccui.helper.seekWidgetByName(ccs_json.node, "well_done_anim");
        // this.play_well_done();

        // test
        // this.text_label = ccui.helper.seekWidgetByName(ccs_json.node, "test_action");
        // end

        this.play_action_root = ccui.helper.seekWidgetByName(ccs_json.node, "play_action")
        this.left_play_action = create_frame_action([res.play_action_png_1, res.play_action_png_2, res.play_action_png_3, res.play_action_png_3, res.play_action_png_3, res.play_action_png_1], 0.24 / 5);
        this.left_play_action.retain();

        this.right_play_action = create_frame_action([res.play_action_png_1, res.play_action_png_4, res.play_action_png_5, res.play_action_png_5, res.play_action_png_5, res.play_action_png_1], 0.24 / 5);
        this.right_play_action.retain();   

        /*
        this.left_play_action = ccs_json.action.clone();
        this.left_play_action.retain();
        this.right_play_action = ccs_json.action.clone();
        this.right_play_action.retain();
        */
        this.cat_root = ccui.helper.seekWidgetByName(ccs_json.node, "cat_root");

        this.cat_action_1 = ccui.helper.seekWidgetByName(ccs_json.node, "cat_action_1");
        this.cat_play_action_type1 = create_frame_action([res.jx_miao_1_png, res.jx_miao_5_png, res.jx_miao_6_png, res.jx_miao_6_png, res.jx_miao_6_png, res.jx_miao_6_png, res.jx_miao_5_png, res.jx_miao_1_png], 0.4 / 7);
        // this.cat_play_action_type1 = ccs_json.action.clone();
        this.cat_play_action_type1.retain();

        this.cat_action_idle = ccui.helper.seekWidgetByName(ccs_json.node, "cat_idle");
        // this.cat_play_action_idle = ccs_json.action.clone();
        this.cat_play_action_idle = create_frame_action_forever([res.jx_miao_1_png, res.jx_miao_2_png, res.jx_miao_1_png], 15 / 60);
        this.cat_play_action_idle.retain();

        this.cat_action_2 = ccui.helper.seekWidgetByName(ccs_json.node, "cat_action_2");
        // this.cat_play_action_type2 = ccs_json.action.clone();
        this.cat_play_action_type2 = create_frame_action([res.jx_miao_1_png, res.jx_miao_3_png, res.jx_miao_4_png, res.jx_miao_4_png, res.jx_miao_4_png, res.jx_miao_4_png, res.jx_miao_3_png, res.jx_miao_1_png], 0.4 / 7);
        this.cat_play_action_type2.retain();

        this.cat_action_3 = this.cat_action_2;
        this.cat_play_action_type3 = create_frame_action([res.jx_miao_1_png, res.jx_miao_2_png, res.jx_miao_7_png, 
            res.jx_miao_7_png, res.jx_miao_7_png, res.jx_miao_7_png, res.jx_miao_7_png, res.jx_miao_7_png, res.jx_miao_2_png, res.jx_miao_1_png], 0.5 / 4);
        this.cat_play_action_type3.retain();

        this.play_cat_idle();     

        /*
        this.move_monkey = ccui.helper.seekWidgetByName(ccs_json.node, "monkey_anim_1");
        this.play_monkey_anim();
        // end

        // moeky_anim right
        var s = fa_create_forever_monkey([res.right_mon_anim_1_png, res.right_mon_anim_2_png], 0.1, 2);
        var root = ccui.helper.seekWidgetByName(ccs_json.node, "anchor-right");
        s.setPosition(-64, 32);
        root.addChild(s);
        // end

        // mokey_anim left
        s = fa_create_forever_monkey([res.left_mon_3_png, res.left_mon_2_png, res.left_mon_1_png], 0.1, 3.5);
        root = ccui.helper.seekWidgetByName(ccs_json.node, "anchor-left");
        s.setPosition(0, 32);
        root.addChild(s);
        // end
        */
        
        // 开始
		var start_layer = cc.Layer.create();
        this.addChild(start_layer);

        helper.add_listener_touch_one_by_one(start_layer, {
        	onTouchBegan: function(t, event)
        	{
        		var target = event.getCurrentTarget();
        		if (target.isVisible()) {
        			return true;
        		}
        		return false;
        	},
			onTouchMoved: function(t, event){},
			onTouchEnded: function(t, event){},
        });


		var ccs_json = ccs.load(res.start_scene_json);
        start_layer.addChild(ccs_json.node);
        helper.adjust_anchor(ccs_json.node);
        this.start_layer = start_layer;
        this.start_scene_ccs = ccs_json;

        var start_button = ccui.helper.seekWidgetByName(ccs_json.node, "start_button");
		start_button.addClickEventListener(this.on_play_game.bind(this));
        // end


        // checkout
        // var ccs_json = ccs.load(res.checkout_scene_json);
        var checkout_node = new checkout();
        checkout_node.init_checkout();
        layer.addChild(checkout_node);
        this.checkout_node = checkout_node;

        var bg_mask = this.checkout_node.bg_mask;
        helper.add_listener_touch_one_by_one(bg_mask, {
            onTouchBegan: function(t, event)
            {
                if(this.checkout_node.isVisible()) {
                    return true;
                }
                return false;
            }.bind(this),
            onTouchMoved: function(t, event){}.bind(this),
            onTouchEnded: function(t, event){}.bind(this),
        });

        var replay = this.checkout_node.replay_button;
        replay.addClickEventListener(function() {
            cc.audioEngine.stopMusic(false);
            this.scheduleOnce(this.on_start_game.bind(this), 0.5);
        }.bind(this));
        var scaleto = cc.ScaleTo.create(0.2, 0.9);
        var scalebk = cc.ScaleTo.create(0.2, 1);
        var seq = cc.Sequence.create([scaleto, scalebk]);
        var repeat = cc.RepeatForever.create(seq)
        replay.runAction(repeat);
        this.checkout_node.setVisible(false);

        // var action = ccs_json.action.clone();
        // action.gotoFrameAndPlay(0, 60, true);
        // ccs_json.node.runAction(action);
        // end

        // check perfect
        // var ccs_json = ccs.load(res.perfect_anim_json);
        // this.checkout_node.addChild(ccs_json.node);
        // helper.adjust_anchor(ccs_json.node);
        this.check_perfect_anim = this.checkout_node.perfect_anim;

        // check good
        // var ccs_json = ccs.load(res.good_anim_json);
        // this.checkout_node.addChild(ccs_json.node);
        // helper.adjust_anchor(ccs_json.node);
        this.check_good_anim = this.checkout_node.good_anim;

        // var action = ccs_json.action.clone();
        // action.gotoFrameAndPlay(0, 85, true);
        // ccs_json.node.runAction(action);
        // end

        this.check_perfect_anim.setVisible(false);
        this.check_good_anim.setVisible(false);

        this.start_game = false;
        this.lock_left = false;
        this.lock_right = false;
        this.prev_action_player = "N";
        this.scheduleUpdate();

        if ('keyboard' in cc.sys.capabilities) {
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed: function (key, event) {
                    /*var strTemp = "Key down:" + key;
                    var keyStr = this.getKeyStr(key);
                    if (keyStr.length > 0)
                    {
                        strTemp += " the key name is:" + keyStr;
                    }
                    cc.log(strTemp)*/
                    if (key == 37) {
                        this.on_left_action();
                    }
                    else if(key == 39) {
                        this.on_right_action();
                    }

                }.bind(this),
                onKeyReleased: function (key, event) {
                    /*
                    var strTemp = "Key up:" + key;
                    var keyStr = this.getKeyStr(key);
                    if (keyStr.length > 0)
                    {
                        strTemp += " the key name is:" + keyStr;
                    }
                    cc.log(strTemp)
                    */
                }.bind(this)
            }, this);
        } else {
            cc.log("KEYBOARD Not supported");
        }
    },

    getKeyStr: function (keycode)
    {
        if (keycode == cc.KEY.none)
        {
            return "";
        }

        for (var keyTemp in cc.KEY)
        {
            if (cc.KEY[keyTemp] == keycode)
            {
                return keyTemp;
            }
        }
        return "";
    },

    play_monkey_anim: function() {
        // monkey 1
        this.move_monkey.setFlippedX(false);
        this.move_monkey.setRotation(-51.75);
        var action = cc.RotateTo.create(2, 48.67);
        this.move_monkey.runAction(action);

        this.scheduleOnce(function() {
            this.move_monkey.setFlippedX(true);
            this.move_monkey.setRotation(48.67);
            var action = cc.RotateTo.create(2, -51.75);
            this.move_monkey.runAction(action);
        }.bind(this), 6);
        //end

        this.scheduleOnce(function() {
            this.play_monkey_anim()
        }.bind(this), 12);
    },

    play_cat_idle: function() {
        this.cat_action_idle.setVisible(true);
        this.cat_action_1.setVisible(false);
        this.cat_action_1.stopAllActions();
        this.cat_action_2.setVisible(false);
        this.cat_action_2.stopAllActions();
        this.cat_action_3.setVisible(false);
        this.cat_action_3.stopAllActions();

        this.cat_action_idle.stopAllActions();
        this.cat_action_idle.setTexture(res.jx_miao_1_png);
        var action = this.cat_play_action_idle.clone();
        this.cat_action_idle.runAction(action);
    },

    play_cat_action: function(action_type, duration) {
        if (action_type != 1 && action_type != 2 && action_type != 10) {
            return;
        }

        this.cat_action_idle.setVisible(false);
        this.cat_action_1.stopAllActions();
        this.cat_action_1.setVisible(false);
        this.cat_action_2.stopAllActions();
        this.cat_action_2.setVisible(false);
        this.cat_action_3.stopAllActions();
        this.cat_action_3.setVisible(false);

        var callback = cc.CallFunc.create(function() {
                this.play_cat_idle();
        }.bind(this));

        if(action_type == 1) {
            this.cat_action_1.setVisible(true);
            // this.cat_action_1.stopAllActions();
            this.cat_action_1.setTexture(res.jx_miao_1_png);

            var action = this.cat_play_action_type1.clone();
            var seq = cc.Sequence.create([action, callback]);
            this.cat_action_1.runAction(seq)
        }
        else if(action_type == 2){
            this.cat_action_2.setVisible(true);
            // this.cat_action_2.stopAllActions();
            this.cat_action_2.setTexture(res.jx_miao_1_png);
            var action = this.cat_play_action_type2.clone();
            var seq = cc.Sequence.create([action, callback]);
            this.cat_action_2.runAction(seq)
        }
        else if(action_type == 10) {
            this.cat_action_3.setVisible(true);
            // this.cat_action_3.stopAllActions();
            this.cat_action_3.setTexture(res.jx_miao_1_png);
            var action = this.cat_play_action_type3.clone();
            var seq = cc.Sequence.create([action, callback]);
            this.cat_action_3.runAction(seq)
        }
    },

    on_turn_to_player: function() {
        /*
        var scaleto = cc.ScaleTo.create(0.2, 0.8);
        var scalebk = cc.ScaleTo.create(0.2, 1);
        var delay = cc.DelayTime.create(0.8);
        var seq = cc.Sequence.create([scaleto, scalebk, delay]);
        var repeat = cc.RepeatForever.create(seq)
        this.left_button.runAction(repeat);

        scaleto = cc.ScaleTo.create(0.2, 0.8);
        scalebk = cc.ScaleTo.create(0.2, 1);
        delay = cc.DelayTime.create(0.8);
        seq = cc.Sequence.create([scaleto, scalebk, delay]);
        repeat = cc.RepeatForever.create(seq)
        this.right_button.runAction(repeat)
        */
        cc.log("turn to player called");
        this.play_cat_action(10, 0);
    },

    on_turn_to_cat: function() {
        // this.text_label.setVisible(false);
        this.left_button.setScale(1.0);
        this.left_button.stopAllActions();
        this.right_button.setScale(1.0);
        this.right_button.stopAllActions();
    },

    is_player_all_right: function(end_index) {
        var i = end_index;
        var ret = 2; // Perfact
        for(i = end_index; i >= 0; i --) {
            var action = music_rhythm[i]; 
            var action_player = action.player;
            if(action_player != "P") {
                return ret;
            }

            if(this.game_result_set[i] != 2 && this.game_result_set[i] != 1) {
                return 0;
            }
            ret = this.game_result_set[i];
        }

        return ret;
    },

    on_checkout: function() {
        this.cat_root.setVisible(false);
        this.again_button.setVisible(false);
        this.checkout_node.setVisible(true)
        helper.play_music(res.checkout_mp3);

        if(this.game_result == 2) { // 完美
            // console.log("完美");
            this.check_good_anim.setVisible(true);
            this.check_perfect_anim.setVisible(true);
        }
        else if(this.game_result == 1) { // 还可以
            // console.log("还可以");
            this.check_good_anim.setVisible(true);
            this.check_perfect_anim.setVisible(false);
        }
        else { // 失败       
            // console.log("失败");
            this.check_good_anim.setVisible(true);
            this.check_perfect_anim.setVisible(false);
        }
    }, 

    play_well_done: function() {
        var action = ccs.actionTimelineCache.createAction(res.game_scene_json);
        action.gotoFrameAndPlay(180, 221, false);
        // this.game_scene_ccs.node.runAction(action);
        this.well_done_anim.runAction(action);
        
    }, 

    update: function(dt) {
        if(this.start_game == false) {
            return;
        }

        this.passed_time += dt;
        if (this.passed_time >= this.total_time) { // 歌曲结束
            this.start_game = false;
            this.left_button.stopAllActions();
            this.right_button.stopAllActions();
            this.on_checkout();
            return;
        } 

        size = music_rhythm.length;
        if (this.cur_index >= size) { // 动作完成
            return;
        }
       
        var action = music_rhythm[this.cur_index];
        var time = action.start;
        var duration = action.duration;
        var action_type = action.action; 
        var action_player = action.player;

        while (this.passed_time > time + duration) {
            this.cur_index ++;
            if (this.cur_index >= size) {
                return;
            }

            this.show_action = 0;

            action = music_rhythm[this.cur_index];
            time = action.start;
            duration = action.duration;
            action_type = action.action; 
            action_player = action.player;

            /*
            if (action_player == "P") {
                this.text_label.setString("" + action_type);
                this.text_label.setVisible(true);
            }
            else {
                this.text_label.setVisible(false);
            }*/
        }

        if(action_player != this.prev_action_player) {
            if(this.prev_action_player == "P") { // 判断玩家是否答对，播放激励动画
                var ret = this.is_player_all_right(this.cur_index - 1);
                if (ret != 0) { // 播放激励动画
                    // cc.log("good common");
                    this.play_well_done();
                }
                // this.play_well_done();

                if (ret < this.game_result) { // 取到每段最坏的结果
                    this.game_result = ret;
                }
            }

            this.prev_action_player = action_player
            
            if(action_player == "P") { // 启动提示
                this.on_turn_to_player();
            }
            else { // 停止提示
                this.on_turn_to_cat();
            }
        }

        if(this.passed_time >= time && this.passed_time <= time + duration) { // 当前的Action有效果
            if (action_player == "C" && this.show_action == 0) {
                this.show_action = 1;
                this.play_cat_action(action_type, duration);
            }
            else if (action_player == "P" && this.show_action == 0) {
                this.show_action = 1;
                // this->player_label->setVisible(true);
                // this->player_label->setString("B:" + map["action"].asString());
                // this->tip_label->setVisible(true);
                // this->tip_label->setString(map["action"].asString());
                // this->play_action(action_type, duration);
            }
        }
    },

    compute_score: function(type) {
        if(this.cur_index <= 0 || this.cur_index >= music_rhythm.length) {
            cc.log("invlaid index");
            return;
        }

        var action = music_rhythm[this.cur_index];
        var start_time = action.start;
        var duration = action.duration;
        var action_type = action.action; 
        var action_player = action.player;

        if(action_player == "C") {
            this.game_result_set[this.cur_index] = -1;
            cc.log("没有轮到你");
            return;
        }

        if (this.game_result_set[this.cur_index] != 0) { // 已经按过了
            cc.log("已经按过了");
            cc.log(this.game_result_set[this.cur_index])
            return;
        }

        this.game_result_set[this.cur_index] = -1;
        /*
        if (action_type != type) { // 玩家类型错误
            cc.log("玩家按错了类型");
            return;
        }
        */
        // PERFECT
        if (this.passed_time >= (start_time - PERFECT) && this.passed_time <= (start_time + PERFECT)) {
            this.game_result_set[this.cur_index] = 2;
            cc.log("完美");
            return;
        }

        // GREAT
        if (this.passed_time >= (start_time - GREAT) && this.passed_time <= (start_time + GREAT)) {
            this.game_result_set[this.cur_index] = 1; 
            cc.log("还好");
            return;
        }
    },

    on_left_action: function() {
        var action = this.left_play_action.clone();
        this.play_action_root.setTexture(res.play_action_png_1);
        this.play_action_root.runAction(action);
        this.compute_score(1);
    },

    on_right_action:function() {
        var action = this.right_play_action.clone();
        this.play_action_root.setTexture(res.play_action_png_1);
        this.play_action_root.runAction(action);
        this.compute_score(2);
    },

    on_start_game: function() {
        this.start_game = true;
        this.total_time = 55; // 歌曲长度
        this.passed_time = 0; // 过去的时间
        this.cur_index = 0;
        this.show_action = 0;
        
        this.game_result = 2; // 完美
        this.lock_left = false;
        this.lock_right = false;
        this.prev_action_player = "N";

        helper.play_music(res.game_music_01_mp3);
        this.cat_root.setVisible(true);
        this.again_button.setVisible(true);
        this.checkout_node.setVisible(false);
        this.check_perfect_anim.setVisible(false);
        this.check_good_anim.setVisible(false);
        this.game_result_set = new Array(music_rhythm.length);
        for(var i = 0; i < music_rhythm.length; i ++) {
            this.game_result_set[i] = 0;
        }

        // test checkout
        // this.game_result = 1;
        // this.on_checkout();
    },


    on_play_game:function() {
        var leave_action = this.start_scene_ccs.action;
        leave_action.gotoFrameAndPlay(0, 60, false);
        cc.audioEngine.stopMusic(false);
        
        var callback = cc.CallFunc.create(function() {
            this.start_layer.removeFromParent();
            this.on_start_game();
        }.bind(this));

        var delay = cc.DelayTime.create(1);
        this.start_scene_ccs.node.runAction(leave_action);

        var leave_seq = cc.Sequence.create([delay, callback]);
        this.start_scene_ccs.node.runAction(leave_seq);

    }
});

