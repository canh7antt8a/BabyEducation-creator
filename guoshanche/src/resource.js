var welcome_res = {
	loading_scene_json: "res/loading_scene.json",
};

var welcom_resource = [];
for (var i in welcome_res) {
    welcom_resource.push(welcome_res[i]);
}

var res = {
    game_bg_png : "res/game_bg.png",
    game_car_png : "res/game_car.png",
    game_road_png : "res/road.png",
    game_hc_road_png: "res/c_road.png",
    game_c_road_png: "res/c_road_3.png",
    game_startpoint_png: "res/qidian.png",
    game_endpoint_png: "res/end_point.png",
    game_result_fnt_png: "res/shuzi.png",
    game_bomb_1_png: "res/bomb_1.png",
    game_bomb_2_png: "res/bomb_2.png",
    game_bomb_3_png: "res/bomb_3.png",
    game_bomb_4_png: "res/bomb_4.png",
    game_bomb_5_png: "res/bomb_5.png",
    baoshi_png: "res/baoshi.png",

    main_scene_json: "res/main_scene.json",
    game_scene_json: "res/game_scene.json",
    show_result_json: "res/show_result.json",
    show_lose_json: "res/show_lose.json",
    show_guide_json: "res/show_guid.json", 

    sound_bomb_mp3:"res/sounds/bomb.mp3",
    sound_car_run_mp3:"res/sounds/car_run.mp3",
    sound_click_mp3:"res/sounds/click.mp3",
    sound_lose_mp3:"res/sounds/lose.mp3",
    sound_main_scene_bg_mp3:"res/sounds/main_scene_bg.mp3",
    sound_win_mp3:"res/sounds/win.mp3",
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
