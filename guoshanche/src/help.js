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
};

function clone(myObj) {
	if(typeof(myObj) != 'object') return myObj;
	if(myObj == null) return myObj;

	var myNewObj = new Object();

	for(var i in myObj)
		myNewObj[i] = clone(myObj[i]);

	return myNewObj;
} 

function CC_RADIANS_TO_DEGREES(r) {
	var d = r * 180.0 / Math.PI;
	return d;
}

function cc_vec_getAngle(v) {
	return Math.atan2(v.y, v.x);
}

function fa_create_forever_with_file(fname_array, time_per_frame) {
	if (fname_array.length <= 0) {
		return;
	}

	var anim_params = cc.Animation.create();
	for(var i=0; i<imgAry.length; i++) {
		anim_params.addSpriteFrameWithFile(fname_array[i]);
	}
	anim_params.setDelayPerUnit(time_per_frame || 0.1);
	var animate = cc.Animate.create(anim_params);

	var forever = cc.RepeatForever.create(animate);
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

function play_sound(name, b_loop) {
	cc.audioEngine.stopAllEffects();
	cc.audioEngine.playEffect(name, b_loop);
}