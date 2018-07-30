

var display = {
	width:function() {
		return cc.winSize.width;
	},

	height:function() {
		return cc.winSize.height;
	},

	cx:function() {
		return cc.winSize.width * 0.5;
	},

	cy:function() {
		return cc.winSize.height * 0.5;
	},

	left:function() {
		return 0
	},
	right:function() {
		return display.width();
	},
	bottom:function() {
		return 0;
	},
	top: function() {
		return display.height();
	},

	bg_scale: function() {
		var w_s = cc.winSize.width / DESIGN_WIDTH;
		var h_s = cc.winSize.height / DESIGN_HEIGHT; 

		if (w_s > h_s) {
			return w_s;
		}
		else {
			return h_s;	
		} 
	}
};

var helper = {
	adjust_anchor : function (widget) {
		var item = ccui.helper.seekWidgetByName(widget, "anchor-background");
		item.setPosition(display.cx(), display.cy());

		item = ccui.helper.seekWidgetByName(widget, "anchor-center");
		item.setPosition(display.cx(), display.cy());


		item = ccui.helper.seekWidgetByName(widget, "anchor-lt");
		item.setPosition(display.left(), display.top());

		item = ccui.helper.seekWidgetByName(widget, "anchor-rt");
		item.setPosition(display.right(), display.top());

		item = ccui.helper.seekWidgetByName(widget, "anchor-ld");
		item.setPosition(display.left(), display.bottom());

		item = ccui.helper.seekWidgetByName(widget, "anchor-rd");
		item.setPosition(display.right(), display.bottom());


		item = ccui.helper.seekWidgetByName(widget, "anchor-top");
		item.setPosition(display.cx(), display.top());

		item = ccui.helper.seekWidgetByName(widget, "anchor-bottom");
		item.setPosition(display.cx(), display.bottom());

		item = ccui.helper.seekWidgetByName(widget, "anchor-left");
		item.setPosition(display.left(), display.cy());

		item = ccui.helper.seekWidgetByName(widget, "anchor-right");
		item.setPosition(display.right(), display.cy());
	},

	add_listener_touch_one_by_one:function(node, param) {
		var touch = cc.EventListener.create({
    		event: cc.EventListener.TOUCH_ONE_BY_ONE, 
    		swallowTouches: true,
    		onTouchBegan : param.onTouchBegan,
    		onTouchMoved : param.onTouchMoved,
    		onTouchEnded : param.onTouchEnded,
    	});
    	cc.eventManager.addListener(touch, node);

    	return touch
	},

	play_music: function (name, b_loop) {
		// cc.audioEngine.pauseMusic();
		cc.audioEngine.stopMusic(false);
		cc.audioEngine.playMusic(name, b_loop);
	},
};


function fa_create_forever_with_file(fname_array, time_per_frame) {
	if (fname_array.length <= 0) {
		return;
	}

	var anim_params = cc.Animation.create();
	for(var i=0; i<fname_array.length; i++) {
		anim_params.addSpriteFrameWithFile(fname_array[i]);
	}
	anim_params.setDelayPerUnit(time_per_frame || 0.1);
	var animate = cc.Animate.create(anim_params);

	var forever = cc.RepeatForever.create(animate);
	var s = cc.Sprite.create(fname_array[0]);
	s.runAction(forever);


	return s;
}

function fa_create_forever_monkey(fname_array, time_per_frame, delay) {
	if (fname_array.length <= 0) {
		return;
	}

	var anim_params = cc.Animation.create();
	for(var i=0; i<fname_array.length; i++) {
		anim_params.addSpriteFrameWithFile(fname_array[i]);
	}
	anim_params.setDelayPerUnit(time_per_frame || 0.1);
	var animate = cc.Animate.create(anim_params);

	var seq = cc.Sequence.create([animate, animate.clone(), animate.clone(), cc.DelayTime.create(delay)]);
	var forever = cc.RepeatForever.create(seq);
	var s = cc.Sprite.create(fname_array[0]);
	s.runAction(forever);


	return s;
}

function fa_create_at_once_with_file(fname_array, time_per_frame, callback) {
	if (fname_array.length <= 0) {
		return;
	}

	var anim_params = cc.Animation.create();
	for(var i=0; i<fname_array.length; i++) {
		anim_params.addSpriteFrameWithFile(fname_array[i]);
	}
	anim_params.setDelayPerUnit(time_per_frame || 0.1);
	var animate = cc.Animate.create(anim_params);
	
	var run_action = animate;
	if (callback) {
		var func = cc.CallFunc.create(callback);
		run_action = cc.Sequence.create([animate, func]);
	
	}
	
	var s = cc.Sprite.create(fname_array[0]);
	s.runAction(run_action);

	return s;
}

function run_forever_with_file(s, fname_array, time_per_frame) {
	if (fname_array.length <= 0) {
		return;
	}

	var anim_params = cc.Animation.create();
	for(var i=0; i<fname_array.length; i++) {
		anim_params.addSpriteFrameWithFile(fname_array[i]);
	}
	anim_params.setDelayPerUnit(time_per_frame || 0.1);
	var animate = cc.Animate.create(anim_params);

	var forever = cc.RepeatForever.create(animate);
	s.setTexture(fname_array[0]);
	s.runAction(forever);
}

function create_frame_action(fname_array, time_per_frame) {
	if (fname_array.length <= 0) {
		return;
	}

	var anim_params = cc.Animation.create();
	for(var i=0; i<fname_array.length; i++) {
		anim_params.addSpriteFrameWithFile(fname_array[i]);
	}
	anim_params.setDelayPerUnit(time_per_frame || 0.1);
	var animate = cc.Animate.create(anim_params);
	return animate;
}

function create_frame_action_forever(fname_array, time_per_frame) {
	if (fname_array.length <= 0) {
		return;
	}

	var anim_params = cc.Animation.create();
	for(var i=0; i<fname_array.length; i++) {
		anim_params.addSpriteFrameWithFile(fname_array[i]);
	}
	anim_params.setDelayPerUnit(time_per_frame || 0.1);
	var animate = cc.Animate.create(anim_params);

	var forever = cc.RepeatForever.create(animate);
	return forever;
}



