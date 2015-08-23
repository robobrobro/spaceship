var G_ASTEROID_MAX_TRIES = 3; // max number of times to attempt to spawn
var G_ASTEROID_HEIGHT_MAX = 100; // in pixels
var G_ASTEROID_HEIGHT_MIN = 5; // in pixels
var G_ASTEROID_WIDTH_MAX = 100; // in pixels
var G_ASTEROID_WIDTH_MIN = 5; // in pixels
var G_ASTEROID_MAX = 100; // max number of asteroids at one time
var G_ASTEROID_ROTATION_SPEED_MAX = 5; // in degrees per frame
var G_ASTEROID_ROTATION_SPEED_MIN = 0.1; // in degrees per frame
var G_ASTEROID_SPAWN_EDGE =
{
    "BOTTOM": 0,
    "BOTTOMLEFT": 1,
    "BOTTOMRIGHT": 2,
    "LEFT": 3,
    "RIGHT": 4,
    "TOP": 5,
    "TOPLEFT": 6,
    "TOPRIGHT": 7
}
var G_ASTEROID_SPAWN_EDGES = 8;
var G_ASTEROID_SPAWN_RATE = 500; // in milliseconds
var G_ASTEROID_SPEED_MAX = 1; // in pixels per frame
var G_ASTEROID_SPEED_MIN = 0.1; // in pixels per frame
var G_ASTEROID_VERTICES_MAX = 20; 
var G_ASTEROID_VERTICES_MIN = 7;

var G_BULLET_FIRE_WAIT = 100; // in milliseconds
var G_BULLET_LENGTH = 5; // in pixels
var G_BULLET_LIFE_TIME = 3000; // in milliseconds
var G_BULLET_MAX = 500; // max number of bullets at one time
var G_BULLET_SPEED = 12; // in pixels per frame
var G_BULLET_WIDTH = 2; // in pixels

var G_CANVAS_ID = "canvas";
var G_CANVAS_WIDTH = 800;
var G_CANVAS_HEIGHT = 600;

var G_KEY_A = 65;
var G_KEY_D = 68;
var G_KEY_G = 71;
var G_KEY_H = 72;
var G_KEY_P = 80;
var G_KEY_S = 83;
var G_KEY_SPACE = 32;
var G_KEY_W = 87;

var G_HUD_FONT_HEIGHT = 20;
var G_HUD_ITEM_X_OFFSET = 20;

var G_MSEC_PER_FRAME = 33;

var G_SCORE_DEATH_PENALTY = 1000;
var G_SCORE_ASTEROID_HIT = 10;

var G_SHIP_BACKWARD_SPEED = 1.2; // in pixels per frame
var G_SHIP_FILL_STYLES = 
[
    "#000000", "#110000", "#220000", "#330000", "#440000", 
    "#550000", "#660000", "#770000", "#880000", "#990000", 
    "#aa0000", "#bb0000", "#cc0000", "#dd0000", "#ee0000", 
    "#ff0000"
];
var G_SHIP_FORWARD_SPEED = 4.5; // in pixels per frame
var G_SHIP_HEIGHT = 14;
var G_SHIP_ROTATION_SPEED = 12; // in degrees per frame
var G_SHIP_SPAWN_TIME_MAX = 5000; // in milliseconds
var G_SHIP_TEXT = ">";

var g_asteroids = Array();
var g_asteroid_spawn_time = new Date();

var g_bullets = Array();
var g_bullet_fire_time = new Date();

var g_canvas;
var g_ctx;

var g_draw_grid = false;
var g_draw_hud = true;

var g_game_over = false;
var g_game_paused = false;

var g_hud_x = 8;
var g_hud_y = 5;

var g_img_starfield;

var g_ship_collision = false;
var g_ship_fill_style = "white";
var g_ship_fill_style_idx = 0;
var g_ship_fill_style_idx_addend = 1;
var g_ship_firing = false;
var g_ship_height = 0;
var g_ship_just_spawned = false;
var g_ship_lives = 3;
var g_ship_reflecting = false;
var g_ship_reflection_x = 0;
var g_ship_reflection_y = 0;
var g_ship_rotation = 0;
var g_ship_scale = 1;
var g_ship_score = 0;
var g_ship_spawn_time = new Date();
var g_ship_width = 0;
var g_ship_x = 0;
var g_ship_y = 0;

var g_starfield_x = 0;
var g_starfield_y = 0;


var g_keys = {G_KEY_S: false, G_KEY_A: false, G_KEY_G: false, G_KEY_H: false, G_KEY_D: false, G_KEY_P: false, G_KEY_SPACE: false, G_KEY_W: false};
var g_keys_first_press = {G_KEY_S: false, G_KEY_A: false, G_KEY_G: false, G_KEY_H: false, G_KEY_D: false, G_KEY_P: false, G_KEY_SPACE: false, G_KEY_W: false};

function draw()
{
    g_ctx.save();
    g_ctx.setTransform(1, 0, 0, 1, 0, 0);
    g_ctx.clearRect(0, 0, g_canvas.width, g_canvas.height);
    
    draw_starfield();
    draw_grid();
    draw_hud();
    draw_ship();
    draw_ship_reflection();
    draw_bullets();
    draw_asteroids();
    draw_game_over();
    draw_game_paused();
    
    g_ctx.restore();
}

function draw_asteroids()
{
    g_ctx.save();
    
    for (var idx = 0; idx < g_asteroids.length; ++idx)
    {
        g_ctx.save();
        
        g_ctx.strokeStyle = "white";
        
        g_ctx.setTransform(1, 0, 0, 1, 0, 0);
        g_ctx.transform(1, 0, 0, 1, g_asteroids[idx].x, g_asteroids[idx].y);
        g_ctx.rotate(g_asteroids[idx].rotation);
        g_ctx.beginPath();
        g_ctx.moveTo(g_asteroids[idx].vertices[0].x,
            g_asteroids[idx].vertices[0].y);
        for (var vertex = 1; vertex < g_asteroids[idx].vertices.length; ++vertex)
        {
            g_ctx.lineTo(g_asteroids[idx].vertices[vertex].x,
                g_asteroids[idx].vertices[vertex].y);
        }
        g_ctx.lineTo(g_asteroids[idx].vertices[0].x,
            g_asteroids[idx].vertices[0].y);
        g_ctx.stroke();
        g_ctx.closePath();  
        g_ctx.transform(1, 0, 0, 1, -g_asteroids[idx].x, -g_asteroids[idx].y);
        
        
        g_ctx.restore();
    }
    
    g_ctx.restore();
}

function draw_bullets()
{
    g_ctx.save();
    
    g_ctx.strokeStyle = "#F3F315";
    g_ctx.lineWidth = G_BULLET_WIDTH;
    
    for (var idx = 0; idx < g_bullets.length; ++idx)
    {
        g_ctx.save();
        
        g_ctx.setTransform(1, 0, 0, 1, 0, 0);
        g_ctx.transform(1, 0, 0, 1, g_bullets[idx].x, g_bullets[idx].y);
        g_ctx.rotate(g_bullets[idx].rotation);
        g_ctx.beginPath();
        g_ctx.moveTo(0, 0);
        g_ctx.lineTo(-G_BULLET_LENGTH, 0);
        g_ctx.stroke();
        g_ctx.transform(1, 0, 0, 1, -g_bullets[idx].x, -g_bullets[idx].y);
        
        g_ctx.restore();
    }
    
    g_ctx.restore();
}

function draw_game_over()
{
    if (!g_game_over) return;
    
    g_ctx.save();
    
    g_ctx.font = "bold 120px courier new";
    g_ctx.textAlign = "center";
    g_ctx.textBaseline = "middle";
    g_ctx.lineWidth = 8;
    g_ctx.strokeStyle = "white";
    g_ctx.strokeText("GAME OVER", g_canvas.width / 2, g_canvas.height / 2);
    g_ctx.fillStyle = "#bb1111";
    g_ctx.fillText("GAME OVER", g_canvas.width / 2, g_canvas.height / 2);
    
    g_ctx.restore();
}

function draw_game_paused()
{
    if (!g_game_paused) return;
    
    g_ctx.save();
    
    g_ctx.font = "bold 120px courier new";
    g_ctx.textAlign = "center";
    g_ctx.textBaseline = "middle";
    g_ctx.lineWidth = 8;
    g_ctx.strokeStyle = "white";
    g_ctx.strokeText("PAUSED", g_canvas.width / 2, g_canvas.height / 2);
    g_ctx.fillStyle = "black";
    g_ctx.fillText("PAUSED", g_canvas.width / 2, g_canvas.height / 2);
    
    g_ctx.restore();
}

function draw_grid()
{
    if (!g_draw_grid) return;
    
    g_ctx.save();
    
    g_ctx.beginPath();
    g_ctx.strokeStyle = "#330000";
    // draw verticals
    var vert_step = g_canvas.width / 20;
    for (var x = 0; x < g_canvas.width; x += vert_step)
    {
        g_ctx.moveTo(x, 0);
        g_ctx.lineTo(x, g_canvas.height);
    }
    
    // draw horizontals
    var hori_step = g_canvas.height / 15;
    for (var y = 0; y < g_canvas.height; y += hori_step)
    {
        g_ctx.moveTo(0, y);
        g_ctx.lineTo(g_canvas.width, y);
    }
    g_ctx.closePath();
    g_ctx.stroke();
    
    g_ctx.beginPath();
    g_ctx.strokeStyle = "#770000";
    g_ctx.moveTo(g_canvas.width / 2, 0);
    g_ctx.lineTo(g_canvas.width / 2, g_canvas.height);
    g_ctx.stroke();
    g_ctx.moveTo(0, g_canvas.height / 2);
    g_ctx.lineTo(g_canvas.width, g_canvas.height / 2);
    g_ctx.closePath();
    g_ctx.stroke();
    
    g_ctx.restore();
}

function draw_hud()
{
    if (!g_draw_hud) return;
    
    g_ctx.save();
    
    g_ctx.textAlign = "left";
    g_ctx.textBaseline = "top";
    g_ctx.fillStyle = "white";
    g_ctx.font = "bold " + G_HUD_FONT_HEIGHT + "px courier new";
    
    var text = "LIVES: " + g_ship_lives;
    var text_width = g_ctx.measureText(text).width;
    g_ctx.fillText(text, g_hud_x, g_hud_y);
    
    var x = g_hud_x + text_width + G_HUD_ITEM_X_OFFSET;
    text = "SCORE: " + g_ship_score;
    text_width = g_ctx.measureText(text).width;
    g_ctx.fillText(text, x, g_hud_y);
        
    // TODO Temporary - delete!!    (for testing)
    text = "ASTEROIDS: " + g_asteroids.length;
    g_ctx.fillText(text, x + text_width + G_HUD_ITEM_X_OFFSET, g_hud_y);
    
    g_ctx.restore();
}

function draw_starfield()
{
    g_ctx.save();
    
    g_ctx.drawImage(g_img_starfield, g_starfield_x, g_starfield_y);
    
    g_ctx.restore();
}

function draw_ship()
{
    g_ctx.save();
    
    g_ctx.setTransform(1, 0, 0, 1, 0, 0);
    g_ctx.transform(1, 0, 0, 1, g_ship_x, g_ship_y);
    g_ctx.rotate(g_ship_rotation);
    g_ctx.scale(g_ship_scale, g_ship_scale);
    g_ctx.transform(1, 0, 0, 1, -g_ship_x, -g_ship_y);
    
    g_ctx.textAlign = "center";
    g_ctx.textBaseline = "middle";
    g_ctx.fillStyle = g_ship_fill_style;
    g_ctx.font = g_ship_font;
    g_ctx.fillText(G_SHIP_TEXT, g_ship_x, g_ship_y);
    
    g_ctx.restore();
}

function draw_ship_reflection()
{
    if (!g_ship_reflecting) return;
    
    g_ctx.save();
    
    g_ctx.setTransform(1, 0, 0, 1, 0, 0);
    g_ctx.transform(1, 0, 0, 1, g_ship_reflection_x, g_ship_reflection_y);
    g_ctx.rotate(g_ship_rotation);
    g_ctx.scale(g_ship_scale, g_ship_scale);
    g_ctx.transform(1, 0, 0, 1, -g_ship_reflection_x, -g_ship_reflection_y);
    
    g_ctx.textAlign = "center";
    g_ctx.textBaseline = "middle";
    g_ctx.fillStyle = "white";
    g_ctx.font = g_ship_font;
    g_ctx.fillText(G_SHIP_TEXT, g_ship_reflection_x, g_ship_reflection_y);
    
    g_ctx.restore();
}

function keydown(e)
{    
    g_keys_first_press[e.keyCode] = !g_keys[e.keyCode];
    g_keys[e.keyCode] = true;
}

function keyup(e)
{
    g_keys_first_press[e.keyCode] = false;
    g_keys[e.keyCode] = false;
}

function load()
{
    g_canvas = document.getElementById(G_CANVAS_ID);
    g_canvas.height = G_CANVAS_HEIGHT;
    g_canvas.width = G_CANVAS_WIDTH;
    g_ctx = g_canvas.getContext("2d");
    
    g_img_starfield = new Image();
    g_img_starfield.src = "starfield.png"; // TODO use repeating background (all four edges) but background size should be larger than canvas for parallax

    g_last_update_time = new Date();
    
    g_ship_x = g_canvas.width / 2;
    g_ship_y = g_canvas.height / 2;
    g_ship_width = g_ctx.measureText(G_SHIP_TEXT).width;
    g_ship_height = G_SHIP_HEIGHT;
    g_ship_rotation = -90 * Math.PI / 180;
    g_ship_font = "bold " + g_ship_height + "px courier new";

    window.addEventListener("keydown", keydown);
    window.addEventListener("keyup", keyup);
    
    window.setInterval(run, G_MSEC_PER_FRAME);
}

function run()
{
    update();
    draw();
}

function update()
{
    if (!g_game_over && !g_game_paused)
    {
        update_starfield();
        update_grid();
        update_hud();
        update_ship();
        update_bullets();
        update_asteroids();
        update_game_paused();
    }
    else if (g_game_over)
    {
        update_game_over();
    }
    else if (g_game_paused)
    {
        update_game_paused();
    }
}

function update_asteroids()
{
    // spawn new asteroid
    var delta = new Date() - g_asteroid_spawn_time;
    if (g_asteroids.length == 0 || delta >= G_ASTEROID_SPAWN_RATE && g_asteroids.length < G_ASTEROID_MAX)
    {
        var height = Math.random() * (G_ASTEROID_HEIGHT_MAX - G_ASTEROID_HEIGHT_MIN) 
            + G_ASTEROID_HEIGHT_MIN;
        var width = Math.random() * (G_ASTEROID_WIDTH_MAX - G_ASTEROID_WIDTH_MIN) 
            + G_ASTEROID_WIDTH_MIN;
        var radius = Math.sqrt(height * height + width * width);
        var rotation_speed = (Math.random() * (G_ASTEROID_ROTATION_SPEED_MAX - G_ASTEROID_ROTATION_SPEED_MAX)
            + G_ASTEROID_ROTATION_SPEED_MIN) * Math.PI / 180;
        if (Math.random() < 0.5) rotation_speed *= -1;
        var speed = Math.random() * (G_ASTEROID_SPEED_MAX - G_ASTEROID_SPEED_MIN)
            + G_ASTEROID_SPEED_MIN;
            
        var x = 0, y = 0;
        var spawn_edge = Math.round(Math.random() * G_ASTEROID_SPAWN_EDGES - 1);
        switch (spawn_edge)
        {
            case G_ASTEROID_SPAWN_EDGE.TOP:
                x = Math.random() * (g_canvas.width - radius * 2) + radius;
                y = -radius * 2;
                rotation = 90 * Math.PI / 180;
                break;
            case G_ASTEROID_SPAWN_EDGE.TOPRIGHT:
                x = g_canvas.width + radius;
                y = -radius * 2;
                rotation = 135 * Math.PI / 180;
                break;
            case G_ASTEROID_SPAWN_EDGE.RIGHT:
                x = g_canvas.width + radius * 2;
                y = Math.random() * (g_canvas.height - radius * 2) + radius;
                rotation = -180 * Math.PI / 180;
                break;
            case G_ASTEROID_SPAWN_EDGE.BOTTOMRIGHT:
                x = g_canvas.width + radius * 2;
                y = g_canvas.height + radius * 2;
                rotation = -135 * Math.PI / 180;
                break;
            case G_ASTEROID_SPAWN_EDGE.BOTTOM:
                x = Math.random() * (g_canvas.width - radius * 2) + radius;
                y = g_canvas.height + radius * 2;
                rotation = -90 * Math.PI / 180;
                break;
            case G_ASTEROID_SPAWN_EDGE.BOTTOMLEFT:
                x = -radius * 2;
                y = g_canvas.height + radius * 2;
                rotation = -45 * Math.PI / 180;
                break;
            case G_ASTEROID_SPAWN_EDGE.LEFT:
                x = -radius * 2;
                y = Math.random() * (g_canvas.height - radius * 2) + radius;
                rotation = 180 * Math.PI / 180;
                break;
            case G_ASTEROID_SPAWN_EDGE.TOPLEFT:
            default:
                x = -radius * 2;
                y = -radius * 2;
                rotation = 45 * Math.PI / 180;
                break;
        }
        
        var vertices = Array();
        var num_vertices = Math.round(Math.random() * (G_ASTEROID_VERTICES_MAX - G_ASTEROID_VERTICES_MIN)
            + G_ASTEROID_VERTICES_MIN);
        // for now, regular asteroids (all vertices have same angle to center)
        var angle = 2 * Math.PI / num_vertices; // in radians (= 360 / num_vertices * Math.PI / 180)
        for (var vertex_idx = 0; vertex_idx < num_vertices; ++vertex_idx)
        {
            var vertex_x = radius * Math.cos(angle * vertex_idx);
            var vertex_y = radius * Math.sin(angle * vertex_idx);
            var vertex = {x: vertex_x, y: vertex_y}
            vertices.push(vertex);
        }
        
        var asteroid = {x: x, y: y, vertices: vertices, radius: radius, 
                        height: height, width: width, 
                        rotation: rotation, rotation_speed: rotation_speed,
                        speed: speed, just_spawned: true}
        g_asteroids.push(asteroid);
        g_asteroid_spawn_time = new Date();
    }
    
    var to_create = Array();
    var to_delete = Array();
    
    // move asteroids
    for (var idx = 0; idx < g_asteroids.length; ++idx)
    {
        //if (g_asteroids[idx].just_spawned)
        //{
            g_asteroids[idx].x += g_asteroids[idx].speed * Math.cos(g_asteroids[idx].rotation);
            g_asteroids[idx].y += g_asteroids[idx].speed * Math.sin(g_asteroids[idx].rotation);
        //}
        //else //if (!g_asteroids[idx].just_spawned)
        if (!g_asteroids[idx].just_spawned)
        {
            g_asteroids[idx].rotation += g_asteroids[idx].rotation_speed;
            if (Math.random() < 0.0025) g_asteroids[idx].rotation_speed *= -1;
        }
        
        // TODO fix this check -  it's not working! but why??
        // aha!! vertices are relative to center of asteroid, not absolute position!
        var is_out_of_bounds = true;
        for (var v_idx = 0; is_out_of_bounds && v_idx < g_asteroids[idx].vertices.length; ++v_idx)
        {
            var x = g_asteroids[idx].x + g_asteroids[idx].vertices[v_idx].x;
            var y = g_asteroids[idx].y + g_asteroids[idx].vertices[v_idx].y;
            // if any vertex is in bounds, the asteroid is is bounds
            if (x >= 0 && 
                x < g_canvas.width &&
                y >= 0 &&
                y <= g_canvas.height)
            {
                is_out_of_bounds = false;
            }
        }
            
        // if just spawned and now in bounds, just_spawned = false
        // else if not just spawned and out of bounds, delete asteroid
        if (g_asteroids[idx].just_spawned && !is_out_of_bounds)
            g_asteroids[idx].just_spawned = false;
        else if (!g_asteroids[idx].just_spawned && is_out_of_bounds)
            to_delete.push(idx);
        
        var collision = false;
        
        // TODO check asteroids colliding with each other
        // for (var a_idx = 0; a_idx < g_asteroids.length && !collision; ++a_idx)
        // {
            // if (a_idx != idx)
            // {
                // var dx = g_asteroids[idx].x - g_asteroids[a_idx].x;
                // var dy = g_asteroids[idx].y - g_asteroids[a_idx].y;
                // var distance = Math.sqrt(dx * dx + dy * dy);
                // if (distance <= g_asteroids[idx].radius + g_asteroids[a_idx].radius)
                // {
                    // //collision = true;
                    // //g_asteroids[idx].rotation += Math.PI;
                // }
            // }
        // }
        
        // check for collisions with ship
        // only check asteroids that are close enough to the ship to matter
        // TODO how to check if ship is inside asteroid?
        // for now, just check distance to asteroid radius (since regular polygons)
        var dx = g_ship_x - g_asteroids[idx].x;
        var dy = g_ship_y - g_asteroids[idx].y;
        var distance_to_ship = Math.sqrt(dx * dx + dy * dy);
        if (!g_ship_just_spawned && distance_to_ship <= g_asteroids[idx].radius)// + Math.max(g_ship_height, g_ship_width))
        {
            collision = true;
            g_ship_collision = true;
        }
        
        // check for collision against bullets
        for (var b_idx = 0; b_idx < g_bullets.length && !collision; ++b_idx)
        {
            var dx = g_bullets[b_idx].x - g_asteroids[idx].x;
            var dy = g_bullets[b_idx].y - g_asteroids[idx].y;
            var distance_to_bullet = Math.sqrt(dx * dx + dy * dy);
            if (distance_to_bullet <= g_asteroids[idx].radius) // TODO will not account for bullet moving through asteroid
            {
                collision = true;
                g_bullets[b_idx].destroy = true;
                g_ship_score += G_SCORE_ASTEROID_HIT;
            }
        }

        if (collision) // ship or bullet
        {
            to_delete.push(idx); 
            // break asteroid in two!! and add both to array (after this loop)
            var height = g_asteroids[idx].height / 2
            var width = g_asteroids[idx].width / 2
            var radius = Math.sqrt(height * height + width * width);
            var rotation_speed = g_asteroids[idx].rotation_speed;
            var rotation1 = g_asteroids[idx].rotation; // or random?
            var rotation2 = -g_asteroids[idx].rotation; // or random?
            var x1 = g_asteroids[idx].x + radius * Math.cos(rotation1);
            var y1 = g_asteroids[idx].y + radius * Math.sin(rotation1);
            var x2 = g_asteroids[idx].x + radius * Math.cos(rotation2);
            var y2 = g_asteroids[idx].y + radius * Math.sin(rotation2);
            var speed = g_asteroids[idx].speed; // or random?
            var just_spawned = true;
        
            var vertices = Array();
            var num_vertices = g_asteroids[idx].vertices.length;
            // for now, regular asteroids (all vertices have same angle to center)
            var angle = 2 * Math.PI / num_vertices; // in radians (= 360 / num_vertices * Math.PI / 180)
            for (var vertex_idx = 0; vertex_idx < num_vertices; ++vertex_idx)
            {
                var vertex_x = radius * Math.cos(angle * vertex_idx);
                var vertex_y = radius * Math.sin(angle * vertex_idx);
                var vertex = {x: vertex_x, y: vertex_y}
                vertices.push(vertex);
            }
        
            if (height >= G_ASTEROID_HEIGHT_MIN && width >= G_ASTEROID_WIDTH_MIN)
            {
                var asteroid1 = {x: x1, y: y1, vertices: vertices, radius: radius, 
                                 height: height, width: width,
                                 rotation: rotation1,
                                 rotation_speed: rotation_speed,
                                 speed: speed, 
                                 just_spawned: g_asteroids[idx].just_spawned};
                to_create.push(asteroid1);
                var asteroid2 = {x: x2, y: y2, vertices: vertices, radius: radius, 
                                 height: height, width: width,
                                 rotation: rotation2,
                                 rotation_speed: rotation_speed,
                                 speed: speed, 
                                 just_spawned: g_asteroids[idx].just_spawned};
                to_create.push(asteroid2);
            }
        }
    }
    
    // delete asteroids that have collided or are out of bounds
    for (var idx = 0; idx < to_delete.length; ++idx)
        g_asteroids.splice(to_delete[idx], 1);
        
    // create new asteroids that have come into existence
    for (var idx = 0; idx < to_create.length; ++idx)
        g_asteroids.push(to_create[idx]);
}

function update_bullets()
{
    g_ship_firing = g_keys[G_KEY_SPACE];
    
    var delta = new Date() - g_bullet_fire_time;
    var just_fired = false;
    if (!g_ship_just_spawned && g_ship_firing && (!g_bullets.length || g_bullets.length < G_BULLET_MAX && delta >= G_BULLET_FIRE_WAIT))
    {
        var x = 0, y = 0, rotation = 0;
        if (!g_ship_reflecting)
        {
            x = g_ship_x;
            y = g_ship_y;
            rotation = g_ship_rotation;
        }
        else
        {
            x = g_ship_reflection_x;
            y = g_ship_reflection_y;
            rotation = g_ship_rotation;
        }
        
        var bullet = {x: x, y: y, rotation: rotation, fire_time: new Date(), destroy: false}
        g_bullets.push(bullet);
        
        just_fired = true;
        g_bullet_fire_time = new Date();
    }
    
    var collided_idx = Array();
    var now = new Date();
    var out_of_bounds = false;

    for (var idx = 0; idx < g_bullets.length; ++idx)
    {
        if (g_bullets[idx].destroy)
        {
            collided_idx.push(idx);
            continue;
        }
        
        // check collisions with ship
        var ship_x, ship_y;
        if (g_ship_reflecting)
        {
            ship_x = g_ship_reflection_x;
            ship_y = g_ship_reflection_y;
        }
        else
        {
            ship_x = g_ship_x;
            ship_y = g_ship_y;
        }
        
        if (!g_ship_collision && !just_fired && !g_ship_just_spawned &&
            g_bullets[idx].x >= ship_x - g_ship_width / 2 &&
            g_bullets[idx].x < ship_x + g_ship_width / 2 &&
            g_bullets[idx].y >= ship_y - g_ship_height / 2 &&
            g_bullets[idx].y < ship_y + g_ship_height / 2)
        {
            g_ship_collision = true;
        }
        
        // move bullet
        g_bullets[idx].x += G_BULLET_SPEED * Math.cos(g_bullets[idx].rotation);
        g_bullets[idx].y += G_BULLET_SPEED * Math.sin(g_bullets[idx].rotation);  

        // check collision with boundaries
        if (g_bullets[idx].x < 0) 
        {
            g_bullets[idx].x += g_canvas.width;
            out_of_bounds = true;
        }
        else if (g_bullets[idx].x > g_canvas.width)
        {
            g_bullets[idx].x -= g_canvas.width;
            out_of_bounds = true;
        }
        if (g_bullets[idx].y < 0)
        {
            g_bullets[idx].y += g_canvas.height;
            out_of_bounds = true;
        }
        else if (g_bullets[idx].y > g_canvas.height)
        {
            g_bullets[idx].y -= g_canvas.height;
            out_of_bounds = true;
        }
        
        // delete bullets that have collided
        if (out_of_bounds && now - g_bullets[idx].fire_time >= G_BULLET_LIFE_TIME ||
            g_ship_collision)
        {
            collided_idx.push(idx);
        }
    }

    // delete bullets that have collided
    for (var idx = 0; idx < collided_idx.length; ++idx)
        g_bullets.splice(collided_idx[idx], 1);
}

function update_game_over()
{
}

function update_game_paused()
{
    if (g_keys_first_press[G_KEY_P])
    {
        g_game_paused = !g_game_paused;
        g_keys_first_press[G_KEY_P] = false;
    }
}

function update_grid()
{
    if (g_keys_first_press[G_KEY_G]) 
    {
        g_draw_grid = !g_draw_grid;
        g_keys_first_press[G_KEY_G] = false;
    }
}

function update_hud()
{
    if (g_keys_first_press[G_KEY_H]) 
    {
        g_draw_hud = !g_draw_hud;
        g_keys_first_press[G_KEY_H] = false;
    }
}

function update_ship()
{
    // check if just spawned
    var delta = new Date() - g_ship_spawn_time;
    if (g_ship_just_spawned && delta >= G_SHIP_SPAWN_TIME_MAX)
    {
        g_ship_just_spawned = false;
        g_ship_fill_style = "white";
        g_ship_scale = 1;
    }
    else if (g_ship_just_spawned)
    {
        g_ship_fill_style = G_SHIP_FILL_STYLES[g_ship_fill_style_idx];
        g_ship_fill_style_idx += g_ship_fill_style_idx_addend;
        if (g_ship_fill_style_idx >= G_SHIP_FILL_STYLES.length)
        {
            g_ship_fill_style_idx = G_SHIP_FILL_STYLES.length - 1;
            g_ship_fill_style_idx_addend = -1;
        }
        else if (g_ship_fill_style_idx < 0)
        {
            g_ship_fill_style_idx = 0;
            g_ship_fill_style_idx_addend = 1;
        }
        
        if (g_ship_scale > 1) g_ship_scale -= 0.2;
        else g_ship_scale = 1;
    }
    
    // move ship
    if (g_keys[G_KEY_A])
    {
        g_ship_rotation -= G_SHIP_ROTATION_SPEED * Math.PI / 180;
    }
    
    if (g_keys[G_KEY_D])
    {
        g_ship_rotation += G_SHIP_ROTATION_SPEED * Math.PI / 180;
    }
    
    if (g_keys[G_KEY_W])
    {
        g_ship_x += G_SHIP_FORWARD_SPEED * Math.cos(g_ship_rotation);
        g_ship_y += G_SHIP_FORWARD_SPEED * Math.sin(g_ship_rotation);
    }
    
    if (g_keys[G_KEY_S])
    {
        g_ship_x -= G_SHIP_BACKWARD_SPEED * Math.cos(g_ship_rotation);
        g_ship_y -= G_SHIP_BACKWARD_SPEED * Math.sin(g_ship_rotation);
    }
    
    // TODO space drift? - move ship in direction of movement to simulate inertia
        
    // update ship reflection if out of bounds
    var x_reflecting = false;
    if (g_ship_x - g_ship_width / 2 < 0) 
    {
        x_reflecting = true;
        g_ship_reflecting = true;
        g_ship_reflection_x = g_ship_x + g_canvas.width;
        g_ship_reflection_y = g_ship_y;
        if (g_ship_x < -g_ship_width / 2) 
        {
            g_ship_reflecting = false;
            g_ship_x = g_ship_reflection_x;
            g_ship_y = g_ship_reflection_y;
        }
    }
    else if (g_ship_x + g_ship_width / 2 >= g_canvas.width)
    {
        x_reflecting = true;
        g_ship_reflecting = true;
        g_ship_reflection_x = g_ship_x - g_canvas.width;
        g_ship_reflection_y = g_ship_y;
        if (g_ship_x > g_canvas.width + g_ship_width / 2) 
        {
            g_ship_reflecting = false;
            g_ship_x = g_ship_reflection_x;
            g_ship_y = g_ship_reflection_y;
        }
    }
    
    if (g_ship_y - g_ship_height / 2 < 0)
    {
        g_ship_reflecting = true;
        if (!x_reflecting) g_ship_reflection_x = g_ship_x; // to cover corner reflection
        g_ship_reflection_y = g_ship_y + g_canvas.height;
        if (g_ship_y < -g_ship_height / 2) 
        {
            g_ship_reflecting = false;
            g_ship_x = g_ship_reflection_x;
            g_ship_y = g_ship_reflection_y;
        }
    }
    else if (g_ship_y + g_ship_height / 2 >= g_canvas.height)
    {
        g_ship_reflecting = true;
        if (!x_reflecting) g_ship_reflection_x = g_ship_x; // to cover corner reflection
        g_ship_reflection_y = g_ship_y - g_canvas.height;
        if (g_ship_y > g_canvas.height + g_ship_height / 2) 
        {
            g_ship_reflecting = false;
            g_ship_x = g_ship_reflection_x;
            g_ship_y = g_ship_reflection_y;
        }
    }
    
    // TODO check for collisions with objects
    if (g_ship_collision && !g_ship_just_spawned)
    {
        // respawn in center if dead
        if (--g_ship_lives <= 0)
        {
            g_ship_lives = 0;
            g_ship_score -= G_SCORE_DEATH_PENALTY;
            g_game_over = true;
            g_game_paused = false;
        }
        else
        {
            g_ship_reflecting = false;
            g_ship_x = g_canvas.width / 2;
            g_ship_y = g_canvas.height / 2;
            g_ship_rotation = -90 * Math.PI / 180;
            g_ship_fill_style_idx = 0;
            g_ship_fill_style_idx_addend = 1;
            g_ship_scale = 20;
            g_ship_score -= G_SCORE_DEATH_PENALTY;
            g_ship_just_spawned = true; 
            g_ship_spawn_time = new Date();
        }
        
        g_ship_collision = false;
    }
}

function update_starfield()
{
    // TODO move background in parallax to ship
}

window.addEventListener("load", load);
