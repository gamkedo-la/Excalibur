/**
 *
 * EXPLOSIONS
 * made for gamkedo by mcfunkypants
 *
 */

var explosions = [];
var explosions_enabled = true;
var explosion_timestamp = (new Date()).getTime();
var explosion_w = 64;
var explosion_h = 64;
var explosion_spritesheet_framecount = 16;
var explosion_FPS = 60;
var explosion_FRAME_MS = 1000/explosion_FPS;
var FAR_AWAY = -999999;
var spritesheet_image = null;
var spritesheet_image_finished_loading = false;
const EXPLOSION_BOOM = 0;
const EXPLOSION_RING = 1;

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
