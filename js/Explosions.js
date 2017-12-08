/**
 *
 * EXPLOSIONS v2
 * 
 * made for gamkedo by mcfunkypants
 
 * I made the explosions.png sprites by
 * capturing a realtime engine to video
 * then turning into a spritesheet 
 * they are CC0 public domain - enjoy
 *
 */

var explosions = [];
var explosions_enabled = true;
var explosion_timestamp = (new Date()).getTime();
var explosion_w = 64;
var explosion_h = 64;
var explosion_spritesheet_framecount = 32;
var explosion_FPS = 60;
var explosion_FRAME_MS = 1000/explosion_FPS;
var FAR_AWAY = -999999;
var spritesheet_image = null;
var spritesheet_image_finished_loading = false;
const EXPLOSION_BOOM = 0;
const EXPLOSION_RING = 1;
const EXPLOSION_SMOKE = 2;
const EXPLOSION_SPARKS = 3;

function clearAllExplosions() {
    explosions = [];
}

/**
 * spawns a spritesheet-based explosion animation at these coordinates
 * implements a reuse POOL and only makes new objects when required
 */
function explode(x, y, explosionType, destX, destY, delayFrames, startScale, endScale) {

    //console.log('explode ' + x + ',' + y);

    if (!explosions_enabled) return;
    if (!spritesheet_image_finished_loading) return;
    if (!delayFrames) delayFrames = 0; // deal with undefined
    if (startScale==undefined) startScale = 1;
    if (endScale==undefined) endScale = 1;
    if (!explosionType) explosionType = 0;
    
    var exp, pnum, pcount;
    for (pnum = 0, pcount = explosions.length; pnum < pcount; pnum++)
    {
        exp = explosions[pnum];
        if (exp && exp.inactive) {
            break;
        }
    }

    // we need a new explosion!
    if (!exp || !exp.inactive)
    {
        //console.log('No inactive explosions. Adding explosion #' + pcount);
        var explosion = { x : FAR_AWAY, y : FAR_AWAY, inactive : true };
        // remember this new explosion in our system and reuse
        explosions.push(explosion);
        exp = explosion;
    }

    if (exp && exp.inactive) {
        exp.x = x;// + explosion_offsetx; // FIXME: account for scale (eg x4)
        exp.y = y;// + explosion_offsety;
        exp.explosion_type = explosionType;
        exp.delayFrames = delayFrames; // MS3 - can be delayed by a number of frames
        exp.inactive = false;
        exp.anim_frame = 0;
        exp.anim_start_frame = 0;
        exp.anim_end_frame = explosion_spritesheet_framecount;
        exp.anim_last_tick = explosion_timestamp;
        exp.next_frame_timestamp = explosion_timestamp + explosion_FRAME_MS;
        exp.anim_sum_tick = 0;
        exp.scale = startScale;
        exp.endscale = endScale;
        exp.scaleSpeed = (endScale - startScale) / explosion_spritesheet_framecount;

        // optionally moving explosions
        if (destX && destY) {
            exp.moving = true;
            exp.destX = destX;
            exp.destY = destY;
            // rotate: lookAt(p, destX, destY);
            exp.speedX = (destX - x) / explosion_spritesheet_framecount;
            exp.speedY = (destY - y) / explosion_spritesheet_framecount;
        } else {
            exp.moving = false;
        }

    }

}

function clearExplosions() {
    console.log('clearexplosions');
    explosions.forEach(function (exp) {
        exp.x = exp.y = FAR_AWAY; // throw offscreen
        exp.inactive = true;
    });
}

/**
 * steps the explosion effects simulation
 */
var active_explosion_count = 0; // how many we updated last frame

function updateExplosions()
{
    if (!explosions_enabled) return;

    // get the current time
    explosion_timestamp = (new Date()).getTime();

    active_explosion_count = 0;

    // animate the explosions
    explosions.forEach(
        function (exp) {
        if (!exp.inactive) {

            active_explosion_count++;

            if (exp.delayFrames>0)
            {
                //log('delaying explosion: ' + p.delayFrames)
                exp.delayFrames--;
            }
            else // non-delayed explosions:
            {
                //p.anim_last_tick = explosion_timestamp; // not actually used OPTI

                exp.scale += exp.scaleSpeed;

                // moving explosions
                if (exp.moving) {
                    exp.x += exp.speedX;
                    exp.y += exp.speedY;
                }

                if (exp.anim_frame >= exp.anim_end_frame) {
                    //console.log('explosion anim ended');
                    exp.x = exp.y = FAR_AWAY; // throw offscreen
                    exp.inactive = true;
                } else {

                    if (explosion_timestamp >= exp.next_frame_timestamp)
                    {
                        exp.next_frame_timestamp = explosion_timestamp + explosion_FRAME_MS;
                        exp.anim_frame++; // TODO: ping pong anims?
                    }

                }
            }
        }
    });

    if ((active_explosion_count >0)
        && (prev_active_explosion_count != active_explosion_count))
    {
        // console.log('Active explosions: ' + active_explosion_count);
        prev_active_explosion_count = active_explosion_count;
    }

}
var prev_active_explosion_count = 0;

function drawExplosions(camerax,cameray)
{
    //console.log('draw_explosions');
    if (!camerax) camerax = 0;
    if (!cameray) cameray = 0;

    explosions.forEach(
        function (p) {
            if (!p.inactive) // and visible in screen bbox
            {
                if (window.canvasContext) // sanity check
                {
                    canvasContext.drawImage(spritesheet_image,
                    p.anim_frame * explosion_w,
                    p.explosion_type * explosion_h,
                    explosion_w, explosion_h,
                    p.x - camerax + (-1 * Math.round(explosion_w/2) * p.scale), p.y - cameray + (-1 * Math.round(explosion_h/2) * p.scale),
                    explosion_w * p.scale, explosion_h * p.scale);
                }
            }
        }
    );
}

function initExplosions()
{
    console.log('init_explosions...');
    spritesheet_image = new Image();
    spritesheet_image.src = 'images/explosions.png';
    spritesheet_image.onload = function()   {
        console.log('explosions.png loaded.');
        spritesheet_image_finished_loading = true;
    }
    spritesheet_image.onerror = function() {
        console.log('ERROR: Failed to download explosions.png.');
    }
}

// helper function (inclusive: eg 1,10 may include 1 or 10)
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    
/**
 * custom effect types for game-specfic animations!
 * 
*/
function playerHitExplosion(x,y) // player got hurt!
{
    for (var multi=8; multi<8; multi++)
    {
        explode(x+randomInt(-64,64),y+randomInt(-32,32),EXPLOSION_SMOKE,null,null,null,1,Math.random()*4);
        explode(x+randomInt(-32,32),y+randomInt(-32,32),EXPLOSION_BOOM,null,null,null,1,Math.random()*4);
    }
}

function powerupExplosion(x,y) // bonus item hit
{
    explode(x,y,EXPLOSION_RING,null,null,null,0,2);
    for (var multi=0; multi<6; multi++)
    {
        explode(x+randomInt(-16,16),y+randomInt(-16,16),EXPLOSION_SPARKS,null,null,null,1,1);
    }
}

function alienHitExplosion(x,y) // paratrooper hit
{
    for (var multi=0; multi<6; multi++)
    {
        explode(x,y,EXPLOSION_SMOKE,null,null,null,0,1);
    }
}

function shipHitExplosion(x,y) // enemy hit
{
    for (multi=0; multi<6; multi++)
        explode(x+randomInt(-16,16),y+randomInt(-16,16),EXPLOSION_BOOM,null,null,null,1,Math.random()*1);

    explode(x,y,EXPLOSION_SMOKE,null,null,null,0,2);

    explode(x,y,EXPLOSION_RING,null,null,null,0,2);
}

function gunfireExplosion(x,y)
{
    //explode(x,y,EXPLOSION_SMOKE,null,null,null,0,1);
    explode(x,y,EXPLOSION_SPARKS,null,null,null,0,1);
}

function secondaryGunfireExplosion(x,y)
{
    explode(x,y,EXPLOSION_SMOKE,null,null,null,0,1);
    explode(x,y,EXPLOSION_SPARKS,null,null,null,0,1);
}

function damageSmokeExplosion(x,y)
{
    if (Math.random()>0.2) // lots of small smoke
        explode(x+randomInt(-8,8),y+randomInt(-8,8),EXPLOSION_SMOKE,null,null,null,0,Math.random() * 0.5);

    if (Math.random()>0.9)  // rare big sparks
        explode(x+randomInt(-8,8),y+randomInt(-8,8),EXPLOSION_SPARKS,null,null,null,0,1);

    if (Math.random()>0.8) // rare randomly sized explosions
        explode(x+randomInt(-8,8),y+randomInt(-8,8),EXPLOSION_BOOM,null,null,null,0,Math.random());
}
