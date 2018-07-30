var road_config = {
	V_START: 200,
	G: 40,
	DISTANCE: 30,
	Y_DISTANCE: 22,
	SCORE_K: 2,
};

function is_goto_road_end(v, end_point) {
	var dir = vec_sub(v, end_point);
	/*
	var x_distance = Math.abs(dir.x);
	var y_distance = Math.abs(dir.y);
	if (x_distance <= road_config.DISTANCE && y_distance <= road_config.Y_DISTANCE) {
		return true;
	}
	return false;
	*/

	if (vec_length(dir) <= road_config.DISTANCE * 2) {
		return true;
	}
	return false;
}

function filter_with_end_point(point_set, end_point) {
	var index
	for(index = point_set.length - 1; index >= 0; index --) {
		if ((vec_distance(end_point, point_set[index]) <= road_config.DISTANCE * 6)) {
			point_set.pop();
			continue;
		}
		return;
	}
}

function vec_sub(lhs, rhs) {
	var v = {};
	v.x = lhs.x - rhs.x;
	v.y = lhs.y - rhs.y;
	return v;
}

function vec_length(dir) {
	var v = dir.x * dir.x + dir.y * dir.y;
	return Math.sqrt(v);
}

function vec_distance(lhs, rhs) {
	var dir = vec_sub(lhs, rhs);
	var v = dir.x * dir.x + dir.y * dir.y;
	return Math.sqrt(v);
}

function vec_add_distance(start, dir, distance) {
	var now = clone(start);

	var sx = distance * dir.x / vec_length(dir);
	var sy = distance * dir.y / vec_length(dir);
	
	now.x += sx;
	now.y += sy;

	return now;
}

function filter_road_distance(point_set) {
	if (point_set.length <= 2) {
		return point_set;
	}

	var new_point_set = []; 
	var prev = point_set[0];
	new_point_set.push(prev);

	var i = 1;
	var prev = point_set[0];

	for(i = 1; i < point_set.length; i ++) {
		var dir = {};
		dir.x = point_set[i].x - prev.x;
		dir.y = point_set[i].y - prev.y;

		var len = vec_length(dir);
		if(len < road_config.DISTANCE) {
			if ( i == point_set.length - 1) { // 最后一个点
				var now = vec_add_distance(prev, dir, road_config.DISTANCE);
				new_point_set.push(now);
				prev = now;
			}
			continue;
		}

		while (len >= road_config.DISTANCE) {
			var now = vec_add_distance(prev, dir, road_config.DISTANCE);
			new_point_set.push(now);
			prev = now;
			len = len - road_config.DISTANCE;
		}
		if (len > 0 &&  i == point_set.length - 1) { // 最后一个点
			var now = vec_add_distance(prev, dir, road_config.DISTANCE);
			new_point_set.push(now);
		}
	}

	return new_point_set;
}

function comp_vec_degree(lhs, rhs) {
	var n = lhs.x * rhs.x + lhs.y * rhs.y;
	var m = vec_length(lhs) * vec_length(rhs);

	if (m>= -Number.EPSILON && m <= Number.EPSILON) {
		return 0;
	}
	
	var v = n / m;
	if (v < -1.0) {
		v = -1.0;
	}
	else if (v > 1.0) {
		v = 1.0;
	}
	return Math.acos(v)*(180/Math.PI);
}

function filter_near_point(new_point_set) {
	if(new_point_set.length <= 2) {
		return [];
	}

	var new_point_set2 = [];
	
	new_point_set2.push(new_point_set[0]);
	new_point_set2.push(new_point_set[1]);

	var i;

	for(i = 2; i < new_point_set.length; ) {
		var len = new_point_set2.length;

		var prev = vec_sub(new_point_set2[len - 1], new_point_set2[len - 2]);
		var now = vec_sub(new_point_set[i], new_point_set2[len - 1]);

		var angle = comp_vec_degree(prev, now);

		if (angle >= 90) {
			for (; i < new_point_set.length; ) {

				var prev_pos = new_point_set2[new_point_set2.length - 1];

				if (Math.abs(prev_pos.y - new_point_set[i].y) >= road_config.DISTANCE) {
					new_point_set2.push(new_point_set[i]);
					i++;
					break;
				}

				if (new_point_set2.length > 2) {
					new_point_set2.pop();
				}

				i++;
			}
		}
		else {
			new_point_set2.push(new_point_set[i]);
			i++;
		}
	}


	return new_point_set2;
}

// 1为左, -1 为右, 0为在直线上;
function vec_point_side(p1, p2, p) {
	var out = (p1.y - p2.y) * p.x + (p2.x - p1.x) * p.y + p1.x * p2.y - p2.x * p1.y;
	if (out > 0) {
		return 1;
	}
	else if (out < 0) {
		return -1;
	}
	return 0;
}


function get_duration_time(start, end, dir, v_start, v_end) {
	if (start.x != end.x) { // 使用v_x来计算
		var v_start_x = v_start * dir.x / vec_length(dir);
		var s = (end.x - start.x);
		return Math.abs(s / v_start_x);
	}
	else { // 使用v_y来做计算
		var v_start_y = v_start * dir.y / vec_length(dir);
		var v_end_y = v_end * dir.y / vec_length(dir);

		return Math.abs((v_start_y - v_end_y) / road_config.G);
	}
	return 0;
}

function get_s_from_passtime(start, end, dir, v_start, v_end, pass_time) {
	var now;
	var sx = 0, sy = 0;

	if (start.x != end.x) {
		v_start_x = v_start * dir.x / vec_length(dir);
		sx = v_start_x * pass_time;

		var v_start_y = v_start * dir.y / vec_length(dir);
		if (dir.y < 0) {
			sy = v_start_y * pass_time + 0.5 * road_config.G * pass_time * pass_time;
		}
		else {
			sy = v_start_y * pass_time - 0.5 * road_config.G * pass_time * pass_time;
		}
	}
	else { // 按照vy来算的时间
		var v_start_y = v_start * dir.y / vec_length(dir);
		sy = v_start_y * pass_time;
		sx = 0;
	}
	now = start;
	now.x += sx;
	now.y += sy;
	return now;
}

function comp_v(pos, HIGHT_TOP) {
	var v_n;

	v_n = 2 * road_config.G* HIGHT_TOP + road_config.V_START * road_config.V_START - 2 * road_config.G * pos.y;
	if (v_n <= 0) {
		v_n = 0;
		return v_n;
	}
	v_n = Math.sqrt(v_n);
	return v_n;
}