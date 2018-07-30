
function new_star_moon_anim(anchor_root) {
	var moon_bk = cc.Sprite.create(res.game_moon_guang_png)
	anchor_root.addChild(moon_bk);
	moon_bk.setPosition(-286, 200);

	var moon = cc.Sprite.create(res.game_anim_moon_png);
	anchor_root.addChild(moon);
	moon.setPosition(-286, 200);


	var rotto = cc.RotateTo.create(0.4, 15);
	var rotbk = cc.RotateTo.create(0.4, 0);
	var seq = cc.Sequence.create([rotto, rotbk]);
	var f = cc.RepeatForever.create(seq);
	moon.runAction(f);

	var star1 = cc.Sprite.create(res.game_anim_star_png);
	anchor_root.addChild(star1);
	star1.setPosition(-396, 222);
	var scaleto = cc.ScaleTo.create(0.3, 0.7);
	var scalebk = cc.ScaleTo.create(0.3, 1.0);
	var seq = cc.Sequence.create([scaleto, scalebk]);
	var f = cc.RepeatForever.create(seq);
	star1.runAction(f);

	var star2 = cc.Sprite.create(res.game_anim_star_png);
	anchor_root.addChild(star2);
	star2.setPosition(-313, 51);
	star2.runAction(f.clone());

	var star3 = cc.Sprite.create(res.game_anim_star_png);
	anchor_root.addChild(star3);
	star3.setPosition(-74, 131);
	star3.runAction(f.clone());

	var star4 = cc.Sprite.create(res.game_anim_star_png);
	anchor_root.addChild(star4);
	star4.setPosition(176, 213);
	star4.runAction(f.clone());

	var star5 = cc.Sprite.create(res.game_anim_star_png);
	anchor_root.addChild(star5);
	star5.setPosition(312, 138);
	star5.runAction(f.clone());
}
