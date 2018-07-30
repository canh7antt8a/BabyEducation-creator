var checkout = cc.Node.extend({
	init_checkout: function() {
		var anchor_center = cc.Node.create();
		this.addChild(anchor_center);
		anchor_center.setPosition(display.cx(), display.cy());
		var bg_mask = cc.Sprite.create(res.mengban_png);
		anchor_center.addChild(bg_mask);
		bg_mask.setScale(4 * 2048, 4 * 2048);

		var cat_anim = fa_create_forever_with_file(
			[res.checkout_cat1_png, res.checkout_cat2_png, res.checkout_cat3_png, 
			res.checkout_cat4_png, res.checkout_cat3_png, res.checkout_cat2_png, res.checkout_cat1_png], 
			10 / 60); 
		anchor_center.addChild(cat_anim);


		var anchor_rd = cc.Node.create();
		this.addChild(anchor_rd);
		anchor_rd.setPosition(display.right(), display.bottom());

		var button = ccui.Button.create(res.replay_png, res.replay_png, res.replay_png, ccui.Widget.LOCAL_TEXTURE);
		anchor_rd.addChild(button);
		button.setPosition(-110, 116);

		this.replay_button = button;
		this.bg_mask = bg_mask;

		this.good_anim = this.place_good_anim(anchor_center);
		this.perfect_anim = this.place_perfect_anim(anchor_center); 
	},

	place_good_root1: function(h1_root, x, y, f, f2, res_png) {
		var h1_1 = cc.Sprite.create(res_png);
		h1_1.setPosition(x, y);
		h1_root.addChild(h1_1);
		h1_1.runAction(f.clone());
		h1_1.runAction(f2.clone());
	},

	place_good_anim: function(anchor_center) {
		var root = cc.Node.create();
		root.setPosition(-20, 0);
		anchor_center.addChild(root);

		var scale_to = cc.ScaleTo.create(0.5, 0.9);
		var scale_bk = cc.ScaleTo.create(0.5, 1.0);
		var seq = cc.Sequence.create([scale_to, scale_bk]);
		var f = cc.RepeatForever.create(seq);

		var fout = cc.FadeOut.create(0.5);
		var fin = cc.FadeIn.create(0.5);
		var seq2 = cc.Sequence.create([fout, fin]);
		var f2 = cc.RepeatForever.create(seq2);

		var h1_root = cc.Node.create();
		root.addChild(h1_root);

		var xpos = [-19.8, 223.84, -133.24, 196.6, 80.4,-147.25];
		var ypos = [174.04, 155.16,  119.06, 84.77, 218.73, 211.63];
		for(var index = 0; index < 6; index ++) {
			this.place_good_root1(h1_root, xpos[index], 
			                      ypos[index], f, f2, res.h1_png);
		}

		


		var h2_root = cc.Node.create();
		root.addChild(h2_root);

		var xpos2 = [-72, -150, 123, 104, -78, 15.7, 179, 164, 4.84];
		var ypos2 = [140, 161, 103, 172, 223, 219, 222, 41.7, 124.57];
		for(var index = 0; index < 9; index ++) {
			this.place_good_root1(h2_root, xpos2[index], 
			                      ypos2[index], f, f2, res.h2_png);
		}

		var h3_root = cc.Node.create();
		root.addChild(h3_root);

		var xpos3 = [-57, -124,151];
		var ypos3 = [92, 67.9, 158];
		for(var index = 0; index < 3; index ++) {
			this.place_good_root1(h3_root, xpos3[index], 
			                      ypos3[index], f, f2, res.h3_png);
		}

		return root
	},

	place_perfect_anim: function(anchor_center) {
		var root = cc.Node.create();
		root.setPosition(-20, 0);
		anchor_center.addChild(root);

		var scale_to = cc.ScaleTo.create(0.5, 0.9);
		var scale_bk = cc.ScaleTo.create(0.5, 1.0);
		var seq = cc.Sequence.create([scale_to, scale_bk]);
		var f = cc.RepeatForever.create(seq);

		var fout = cc.FadeOut.create(0.5);
		var fin = cc.FadeIn.create(0.5);
		var seq2 = cc.Sequence.create([fout, fin]);
		var f2 = cc.RepeatForever.create(seq2);

		var h1_root = cc.Node.create();
		root.addChild(h1_root);

		var xpos = [-19.8, 223.84, -133.24, 196.6, 80.4,-147.25, -228, -275, -205, 151, 357];
		var ypos = [174.04, 155.16,  119.06, 84.77, 218.73, 211.63, 221, 161, -34.41, -18, 136];
		for(var index = 0; index < 11; index ++) {
			this.place_good_root1(h1_root, xpos[index], 
			                      ypos[index], f, f2, res.h1_png);
		}

		var h2_root = cc.Node.create();
		root.addChild(h2_root);
		var xpos2 = [-72, -150, 123, 104, -78, 15.7, 179, 164, 4.84, -323, 243, 275, 384, 289, -323, -358, -259, -192, -170];
		var ypos2 = [140, 161, 103, 172, 223, 219, 222, 41.7, 124.57, 226, 223, 113, 94, 39, 226, 119, 81, 84, 19.64];
		for(var index = 0; index < 19; index ++) {
			this.place_good_root1(h2_root, xpos2[index], 
			                      ypos2[index], f, f2, res.h2_png);
		}

		var h3_root = cc.Node.create();
		root.addChild(h3_root);

		var xpos3 = [-57, -124,151,-225,-321,-233, 214, 319, 306, 300,387];
		var ypos3 = [92, 67.9, 158, 147, 60, 36, 38, 105, 170, 223, 217];
		for(var index = 0; index < 11; index ++) {
			this.place_good_root1(h3_root, xpos3[index], 
			                      ypos3[index], f, f2, res.h3_png);
		}

		return root
	},
});