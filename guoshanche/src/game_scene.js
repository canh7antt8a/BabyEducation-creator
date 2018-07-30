
var game_scene = cc.Scene.extend({
	ctor:function() {
		this._super();
		
		var layer = cc.Layer.create();
		this.addChild(layer);
		var t = helper.add_listener_touch_one_by_one(layer, {
			onTouchBegan: this.onTouchBeganEvent.bind(this),
			onTouchMoved: this.onTouchMovedEvent.bind(this),
			onTouchEnded: this.onTouchEndedEvent.bind(this),
		});

		
		var mainscene = ccs.load(res.game_scene_json);
        layer.addChild(mainscene.node);
        
        this.road_root = ccui.helper.seekWidgetByName(mainscene.node, "path_root");
        this.up_road_root = ccui.helper.seekWidgetByName(mainscene.node, "path_up_conner_root");
        var back_button = ccui.helper.seekWidgetByName(mainscene.node, "back_button");
        back_button.addClickEventListener(function() {
        	play_sound(res.sound_click_mp3, false);
        	cc.director.runScene(new main_scene());
    	});

        var play_button = ccui.helper.seekWidgetByName(mainscene.node, "play_button");
        play_button.addClickEventListener(function() {
        	play_sound(res.sound_click_mp3, false);
        	this.run_action_for_road(this._point_set)
        }.bind(this));

        // 成功画面
        this.result_layer = cc.Layer.create();
       	this.addChild(this.result_layer);

        var show_result = ccs.load(res.show_result_json);
        this.result_layer.addChild(show_result.node);
        var rot = cc.RotateBy.create(3, 360);
        var repeat = cc.RepeatForever.create(rot);
        var guang = ccui.helper.seekWidgetByName(show_result.node, "guang");
        guang.runAction(repeat);

        var mask = ccui.helper.seekWidgetByName(show_result.node, "bg_mask");
        mask.setScale(960/4);
        this.result_mask = mask;

        var reset_button = ccui.helper.seekWidgetByName(show_result.node, "game_again");
        var self = this;
        reset_button.addClickEventListener(function() {
        	play_sound(res.sound_click_mp3, false);
        	self.on_reset_game();
        });

        var back_button = ccui.helper.seekWidgetByName(show_result.node, "back_home");
        back_button.addClickEventListener(function() {
        	play_sound(res.sound_click_mp3, false);
        	cc.director.runScene(new main_scene());
    	});

        this.label_root = ccui.helper.seekWidgetByName(show_result.node, "label_root");

        helper.add_listener_touch_one_by_one(this.result_layer, {
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
        this.result_layer.setVisible(false);
        // end


        // 得分牌
        var score_root = ccui.helper.seekWidgetByName(mainscene.node, "score_node");
        var label = cc.LabelAtlas.create("0", res.game_result_fnt_png, 50, 50, "0");
        score_root.addChild(label);
        // label.setPosition(0, -26);
        label.setAnchorPoint(cc.p(0.5, 0.5));
        this.score_label = label;
        this.score_label.setPosition(40, 0);
        // end

        if(IS_SHOW_GUIDE) {
        	this.create_guide_layer();
        	IS_SHOW_GUIDE = false;
        }
    	/* debug
    	var end_sprite = cc.Sprite.create(res.game_road_png);
    	layer.addChild(end_sprite);
    	end_sprite.setPosition(display.right() - 42, display.cy() - 153);
    	end_sprite.setAnchorPoint(cc.p(1.0, 1.0))
    	end*/ 

    	// 起点终点动画
    	var START_ROT = 35;
    	var START_DEGREE = 45;
    	var START_TIME = 0.5;

    	var start_arrow = ccui.helper.seekWidgetByName(mainscene.node, "start_arrow");
    	start_arrow.setRotation(-START_ROT);
    	var rot_down = cc.RotateBy.create(START_TIME, START_DEGREE);
    	var rot_back = cc.RotateBy.create(START_TIME, -START_DEGREE);
    	var start_seq = cc.Sequence.create([rot_down, rot_back]);
    	start_arrow.runAction(cc.RepeatForever.create(start_seq));

    	var end_arrow = ccui.helper.seekWidgetByName(mainscene.node, "end_arrow");
    	var END_ROT = 35;
    	var END_DEGREE = 45;
    	var END_TIME = 0.5;

    	end_arrow.setRotation(START_ROT);
    	rot_down = cc.RotateBy.create(START_TIME, -START_DEGREE);
    	rot_back = cc.RotateBy.create(START_TIME, START_DEGREE);
    	var end_seq = cc.Sequence.create([rot_down, rot_back]);
    	end_arrow.runAction(cc.RepeatForever.create(end_seq));
    	// end


    	// 适配
    	this.center_root = ccui.helper.seekWidgetByName(mainscene.node, "center_root");
    	this.center_root.setPosition(display.cx(), display.cy());

    	this.top_root = ccui.helper.seekWidgetByName(mainscene.node, "top_root");
    	this.top_root.setPosition(display.left(), display.top());

    	this.result_root = ccui.helper.seekWidgetByName(show_result.node, "show_root");
    	this.result_root.setPosition(display.cx(), display.cy());

    	this.diamond_root = ccui.helper.seekWidgetByName(mainscene.node, "diamond_root");
    	this.diamond_root.setPosition(display.cx(), display.cy());
    	// end


    	this.on_reset_game();
	},

	// 500 * 500
	random_pos: function() {
		var x = Math.random() * 5;
		x = Math.floor(x)
		if (x <= 0) {
			x = 0;
		}
		else if(x >= 5) {
			x = 4;
		}
		x = 100 * x;

		var y = Math.random() * 5;
		y = Math.floor(y)
		if (y <= 0) {
			y = 0;
		}
		else if(y >= 5) {
			y = 4;
		}
		y = -70 * y;

		var pos = cc.p(x - 250, y + 175);
		// return this.diamond_root.convertToNodeSpace(pos);
		return pos;
	},

	place_diamond: function() {
		this.diamond_root.removeAllChildren();
		this.diamond_set = [];
		for(var i = 0; i < 10; i ++) {
			var d = cc.Sprite.create(res.baoshi_png);
			this.diamond_root.addChild(d);
			var pos = this.random_pos();
			d.setPosition(pos);
			var w_pos = d.convertToWorldSpace({x:0, y:0});
			var diamond_item = [d, w_pos, false];
			this.diamond_set.push(diamond_item);
		}
	}, 

	create_guide_layer: function() {
		this.guide_layer = cc.Layer.create();
		this.addChild(this.guide_layer);
		
		var show_guide = ccs.load(res.show_guide_json);
		this.guide_layer.addChild(show_guide.node);

		var mask = ccui.helper.seekWidgetByName(show_guide.node, "bg_mask");
        mask.setScale(960/4);
        mask.setPosition(0, display.cy());

        helper.add_listener_touch_one_by_one(this.guide_layer, {
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

        // 引导动画
        var center = cc.p(display.cx(), display.cy() + 100)
        var start = { x: 24 + road_config.DISTANCE, y: 0 + 276.5};
        var end = {x: display.right() - 42, y: 0 + 136};

        var root = ccui.helper.seekWidgetByName(show_guide.node, "finter_root");
        root.setPosition(center);
        var f1 = root.getChildByName("finger_1");
        f1.setVisible(true);
        var f2 = root.getChildByName("finger_2");
        f2.setVisible(false);

       	var move1 = cc.MoveTo.create(1.2, start);
       	var call_func = cc.CallFunc.create(function() {
       		f1.setVisible(false);
       		f2.setVisible(true);
	    });
	    var call_func2 = cc.CallFunc.create(function() {
       		f1.setVisible(true);
       		f2.setVisible(false);
	    });
	    var call_func3 = cc.CallFunc.create(function() {
	    	root.setPosition(center);
	    	root.setVisible(true);
	    });
	    var call_func4 = cc.CallFunc.create(function() {
	    	root.setVisible(false);
	    });

       	var move2 = cc.MoveTo.create(1.2, end);
       	var move3 = cc.MoveTo.create(1.2, center);

        var seq = cc.Sequence.create([move1, call_func, cc.DelayTime.create(0.12), call_func2, 
        	cc.DelayTime.create(0.12), call_func.clone(), cc.DelayTime.create(0.12), call_func2.clone(),
        	move2,  call_func.clone(), cc.DelayTime.create(0.12), call_func2.clone(), 
        	cc.DelayTime.create(0.12), call_func.clone(), cc.DelayTime.create(0.12), call_func2.clone(),
        	cc.DelayTime.create(0.6), call_func4, cc.DelayTime.create(1.2), call_func3]);

        var fover = cc.RepeatForever.create(seq);
        root.runAction(fover);
        // end

        var skip = ccui.helper.seekWidgetByName(show_guide.node, "skip");
        
        skip.addClickEventListener(function() {
        	play_sound(res.sound_click_mp3, false);
        	this.guide_layer.removeFromParent();
        }.bind(this));
	}, 

	create_lose_layer: function() {
		// 失败画面
        this.lose_layer = cc.Layer.create();
        this.addChild(this.lose_layer);

        var show_loser = ccs.load(res.show_lose_json);
        this.lose_layer.addChild(show_loser.node);
        var mask = ccui.helper.seekWidgetByName(show_loser.node, "bg_mask");
        mask.setScale(960/4);
        this.loser_mask = mask;
        helper.add_listener_touch_one_by_one(this.lose_layer, {
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
        var reset_button = ccui.helper.seekWidgetByName(show_loser.node, "game_again");
        reset_button.addClickEventListener(function() {
        	play_sound(res.sound_click_mp3, false);
        	this.on_reset_game();
        	this.lose_layer.removeFromParent();
        	this.show_lose_root = null;
        	this.lose_layer = null;
        }.bind(this));
        var back_button = ccui.helper.seekWidgetByName(show_loser.node, "back_home");
        back_button.addClickEventListener(function() {
        	play_sound(res.sound_click_mp3, false);
        	cc.director.runScene(new main_scene());
    	});
        // end

        // 失败动画
        var rot_bg = cc.RotateBy.create(0.2, 30);
        var bg = ccui.helper.seekWidgetByName(show_loser.node, "result_bg");
        bg.runAction(rot_bg);


        var left_rot = cc.RotateBy.create(0.2, -25);
        var shi_letter = ccui.helper.seekWidgetByName(show_loser.node, "label_shi");
        // var shi_seq = cc.Delay.create(0.2)}
        var shi_seq = cc.Sequence.create([cc.DelayTime.create(0.2), left_rot]);
        shi_letter.runAction(shi_seq);

        var right_rot = cc.RotateBy.create(0.2, 25);
        var bai_seq = cc.Sequence.create([cc.DelayTime.create(0.2), right_rot]);

        var bai_letter = ccui.helper.seekWidgetByName(show_loser.node, "label_bai");
        bai_letter.runAction(bai_seq);
        // end

        // 适配
        var show_lose_root = ccui.helper.seekWidgetByName(show_loser.node, "show_lose_root");
        show_lose_root.setPosition(display.cx(), display.cy());
        this.lose_root = show_lose_root;
        // end

        play_sound(res.sound_lose_mp3, false);
	},

	hide_game_result: function() {
		this.result_layer.setVisible(false);
	}, 

	show_game_result: function() {
		this.result_layer.setVisible(true);
		// var score = (road_config.SCORE_K * this.score_time) + this.score_time;
		// var int_score = Math.floor(score);
		var int_score = this.int_score;
		cc.log(int_score);
		
		this.label_root.removeAllChildren();
		var label = cc.LabelAtlas.create(int_score + "", res.game_result_fnt_png, 50, 50, "0");
		this.label_root.addChild(label);
		label.setAnchorPoint(cc.p(0.5, 0.5));
		play_sound(res.sound_win_mp3, false);
	}, 

	on_reset_game: function() {
		if (this.road_root) {
			this.road_root.removeAllChildren();
		}
		if(this.up_road_root) {
			this.up_road_root.removeAllChildren();
		}

		if (this.diamond_root) {
			this.place_diamond(); // 放砖石
			this.score_label.setString("0");
		}

		this.icon = cc.Sprite.create(res.game_car_png);
		this.road_root.addChild(this.icon);
		this.icon.setAnchorPoint(cc.p(0.5, 0.05));
		this.icon.setPosition({x:24, y: 0 + 276.5});


		this.hide_game_result();

		this.score_time = 0;
		this.int_score = 0;
		this.exp_mode = false;
		this.unschedule(this.on_explosiong_show);
		this._point_set = [];
	},

	onTouchBeganEvent:function(t, event) {
		var target = event.getCurrentTarget();
		// var self = target.getParent();
		var self = this;
		self._point_set = [];
		self.road_root.removeAllChildren();
		self.up_road_root.removeAllChildren();

		self.icon = cc.Sprite.create(res.game_car_png);
		self.road_root.addChild(self.icon);
		self.icon.setAnchorPoint(cc.p(0.5, 0.05));
		self.icon.setPosition({x:24, y: 0 + 276.5});

		// self.on_reset_game();

		// var start = { x:20, y: display.cy() - 12.5};
		var start1 = {x:24, y: 0 + 276.5};
		var start2 = { x:24 + road_config.DISTANCE, y: 0 + 276.5};

		self.is_begin_connected = false;
		// var v = t.getLocation();
		var v = self.road_root.convertTouchToNodeSpace(t);
		if (vec_distance(v, start1) <= road_config.DISTANCE * 2) {
		// if(1) {
			self.is_begin_connected = true;
			self._point_set.push(start1);
			self._point_set.push(start2);
		}

		self._point_set.push(v);
		self.prev = v;
		
		return true;
	},

	onTouchMovedEvent:function (t, event){
		var target = event.getCurrentTarget();
		var self = target.getParent();

		// var v = t.getLocation();
		var v = self.road_root.convertTouchToNodeSpace(t);

		var dir = vec_sub(v, self.prev);		

		var distance = vec_length(dir);
		if (distance < road_config.DISTANCE) {
			return;
		}
		self.prev = v;
		self._point_set.push(v);
	},

	place_game_road: function(new_point_set) {
		var prev_dir;
		var prev_rot;

		// 蓝猫车
		this.road_root.removeAllChildren();
		this.icon = cc.Sprite.create(res.game_car_png);
		this.road_root.addChild(this.icon);
		this.icon.setAnchorPoint(cc.p(0.5, 0.05));
		this.icon.setPosition({x:24, y: 0 + 276.5});


		this.up_road_root.removeAllChildren();

		for (var i = 1; i < new_point_set.length; i++) {
			var dir = vec_sub(new_point_set[i], new_point_set[i - 1]);
			var rot = CC_RADIANS_TO_DEGREES(cc_vec_getAngle(dir));

			if (rot < 0) {
				rot += 360;
			}

			if (i > 1) { // 计算角度
				var angle = comp_vec_degree(prev_dir, dir);
				var is_left = vec_point_side(new_point_set[i - 2], new_point_set[i - 1], new_point_set[i]);
				
				if (angle >= 10 && is_left == 1) {
					
					var path = cc.Sprite.create(res.game_hc_road_png);
					this.road_root.addChild(path, -1);
					path.setPosition(new_point_set[i - 1]);
					path.setAnchorPoint(cc.p(0.5, 1.0));

					var now_rot = rot;
					if (rot < prev_rot) {
						now_rot += 360;
					}
					var rot_c = (now_rot + prev_rot) / 2.0;
					path.setRotation(360 - rot_c);
				}
				else if (angle > 90 && is_left == -1) {
					var path = cc.Sprite.create(res.game_c_road_png);
					this.up_road_root.addChild(path);
					// this->road_root->addChild(path, -1);

					path.setPosition(new_point_set[i - 1]);
					path.setAnchorPoint(cc.p(0.5, 0.3));
					
					var now_rot = rot;
					if (rot < prev_rot) {
						now_rot += 360;
					}
					var rot_c = (now_rot + prev_rot) / 2.0;
					path.setRotation(360 - rot_c);
				}
			} // end

			// if (i != 1) { // 第一个留在原图
			if (1) {
				var path = cc.Sprite.create(res.game_road_png);
				path.setAnchorPoint(cc.p(1.0, 1.0));
				this.road_root.addChild(path);
				path.setPosition(new_point_set[i]);
				path.setRotation(360 - rot);
			}

			prev_dir = dir;
			prev_rot = rot;
		}
		// end
		// 铺路结束
	}, 

	run_action_for_road: function(new_point_set) {
		this.dir_set = [];
		this.point_v_set = [];

		// if (new_point_set.length <= 2) {
		if (new_point_set.length < 2) {
			return;
		}

		var START_POS = new_point_set[0];

		for (var i = 1; i < new_point_set.length; i++) {
			var v = comp_v(new_point_set[i], START_POS.y);

			var dir = vec_sub(new_point_set[i], new_point_set[i - 1]);
			this.dir_set.push(dir);
			this.point_v_set.push(v);
		}

		if (this.icon) {
			this.icon.removeFromParent();
			this.icon = null;
		}

		

		this.icon = cc.Sprite.create(res.game_car_png);
		this.road_root.addChild(this.icon);
		this.icon.setAnchorPoint(cc.p(0.5, 0.05));
		this.icon.setPosition(START_POS);
		
		
		this.scheduleUpdateWithPriority(1);

		this.prev_p = START_POS;
		this.cur_index = 0;
		this.prev_v = road_config.V_START;
		this.passed_time = 0;
		play_sound(res.sound_car_run_mp3, true);

	}, 

	next_point:function(now, now_v) {
		this.prev_p = now;
		this.prev_v = now_v;
		this.cur_index++;
		if (this.cur_index >= this.dir_set.length) {
			return false;
		}
		return true;
	},

	hit_diamond_test:function(w_pos) {
		
		for(var i = 0; i < this.diamond_set.length; i ++) {
			if (this.diamond_set[i][2]) {
				continue;
			} 
			var d_wpos = this.diamond_set[i][1];
			if(vec_distance(d_wpos, w_pos) <= 32) {
				this.diamond_set[i][2] = true;
				var d = this.diamond_set[i][0];
				d.setVisible(false);
				this.int_score ++;
				this.score_label.setString(this.int_score + "");
				return;
			} 
			

		}
	},

	on_game_update:function(dt) {
		if (this.cur_index >= this.dir_set.length) { // 已经结束
			return;
		}

		var dir = this.dir_set[this.cur_index];
		var now_s = this._point_set[this.cur_index + 1];
		var now_v = this.point_v_set[this.cur_index];

		var prev_s = this.prev_p;
		var prev_v = this.prev_v;
		this.score_time += dt;

		this.passed_time = this.passed_time + dt;
		var total = get_duration_time(prev_s, now_s, dir, prev_v, now_v);
		if (this.passed_time >= total) {
			this.passed_time = this.passed_time - total;
			this.icon.setPosition(now_s);
			var w_pos = this.icon.convertToWorldSpaceAR({x:0, y:0});
			this.hit_diamond_test(w_pos);

			if (this.next_point(now_s, now_v) == false) {
				if (this.is_succes) {
					this.unscheduleUpdate();
					// show result
					this.show_game_result();
					
				}
				else {
					//
					this.show_ship_explosion(dir, now_v);
					// 
					this.unscheduleUpdate();	
				}
			}
		}
		else {
			var pos = get_s_from_passtime(prev_s, now_s, dir, prev_v, now_v, this.passed_time);
			this.icon.setPosition(pos);
			var w_pos = this.icon.convertToWorldSpace({x:0, y:0});
			this.hit_diamond_test(w_pos);
			var rot = CC_RADIANS_TO_DEGREES(cc_vec_getAngle(dir));
			this.icon.setRotation(360 - rot);
		}
		
	},

	on_bomb_end: function() {
		this.bomb.removeFromParent();
		this.create_lose_layer();
	}, 

	on_explosiong_show: function(dt) {
		if(!this.exp_mode || !this.icon.isVisible()) {
			return;
		}

		this.exp_run_time += dt;
		var sx = this.exp_v_x * this.exp_run_time;
		var sy = this.exp_v_y * this.exp_run_time - 16 * road_config.G * this.exp_run_time * this.exp_run_time;
		// cc.log(this.exp_v_y + ":" + this.exp_v_x);

		var pos = cc.p(this.exp_start_pos.x + sx, this.exp_start_pos.y + sy);
		if(this.icon) {
			this.icon.setPosition(pos);
		}

		if (pos.y <= 0) {
			this.unschedule(this.on_explosiong_show);
			this.icon.setVisible(false);
			// 播放爆炸效果
			var frames = [res.game_bomb_1_png, res.game_bomb_2_png, res.game_bomb_3_png, res.game_bomb_4_png, res.game_bomb_5_png];
			var parent = this.icon.getParent();
			var bomb = fa_create_at_once_with_file(frames, 0.12, function() {
				this.on_bomb_end(); // 在这里弹结算界面
			}.bind(this));

			this.bomb = bomb;
			parent.addChild(bomb);
			bomb.setPosition(pos);
			play_sound(res.sound_bomb_mp3, false);
			// end
		}
		else if(pos.x >= cc.winSize.width + 100 || pos.x <= 0 - 100 || pos.y >= cc.winSize.height + 100) {
			this.unschedule(this.on_explosiong_show);
			this.icon.setVisible(false);
			// 弹结算界面
			this.create_lose_layer();
			// end
		}
	}, 

	show_ship_explosion: function(dir, v) {
		if (v <= 0) {
			return;
		}
		var len = vec_length(dir);
		if (len <= 0) {
			return;
		}

		this.exp_start_pos = this.icon.getPosition();
		this.exp_v_x = v * dir.x / len;
		this.exp_v_y = v * dir.y / len;
		this.exp_run_time = 0;
		this.exp_mode = true;

		this.schedule(this.on_explosiong_show);
	},

	update: function(dt) {
		this.on_game_update(dt);
	},

	onTouchEndedEvent:function(t, event) {

		var target = event.getCurrentTarget();
		var self = target.getParent();
		
		// var v = t.getLocation();
		var v = self.road_root.convertTouchToNodeSpace(t);
		self._point_set.push(v);

		self.is_succes = false;

		if (self.is_begin_connected == false) { // 终点没有连接成功
			var run_road = [];
			var start1 = {x:24, y: 0 + 276.5};
			run_road.push(start1);

			var start2 = { x:24 + road_config.DISTANCE, y: 0 + 276.5};
			run_road.push(start2);

			var v = filter_road_distance(self._point_set);
			var v2 = filter_near_point(v);
			v = filter_road_distance(v2);
			self.place_game_road(v);
			
			self._point_set = run_road;

			return;
		}

		// var end_point = {x: display.right() - 42, y:display.cy() - 153};
		// var end_point = {x: DESIGN_WIDTH - 42, y: DESIGN_HEIGHT * 0.5 - 153};
		var end_point = {x: display.right() - 42, y: 0 + 136};

		if (is_goto_road_end(v, end_point)) { // 成功连接终点
			filter_with_end_point(self._point_set, end_point);
			self._point_set.push(end_point);
			end_point.x = end_point.x + road_config.DISTANCE;
			self._point_set.push(end_point);
			end_point.x = end_point.x + road_config.DISTANCE;
			self._point_set.push(end_point);
			self.is_succes = true;
			
		}
		
		var v = filter_road_distance(self._point_set);
		var v2 = filter_near_point(v);
		v = filter_road_distance(v2);
		self.place_game_road(v);
		self._point_set = v;
		// self.run_action_for_road(self._point_set)
	},

    onEnter:function() {
        this._super();
    },

    onExit:function() {
    	this._super();
    },

    on_resize: function() {
    	var size = cc.view.getFrameSize();
    	// this.map_root.setPosition(display.cx(), display.cy());
    	cc.log(size);
    	cc.log(cc.winSize);
    	this.center_root.setPosition(display.cx(), display.cy());
    	// this.top_root.setPosition(0, display.top());
    	this.result_root.setPosition(display.cx(), display.cy());
    	if(this.lose_root) {
    		this.lose_root.setPosition(display.cx(), display.cy());
    	}
    	this.top_root.setPosition(display.left(), display.top());
    },
});






