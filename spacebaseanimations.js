
spacebase.animation = function(x, y, image, start, stop, frame_size, anchor){
	var object = {};
        object = new jaws.Sprite({x:x, y:y, anchor:anchor})

	object.steps = stop - start;
	object.step = 1;

        var anim = new jaws.Animation({sprite_sheet: image, frame_size: [frame_size,frame_size], frame_duration: 50})
        object.anim_default = anim.slice(start, stop)
	object.setImage( object.anim_default.next() )

	spacebase.units.push(object);

	object.act = function(){
		//debugger
	        this.step += 1

		if ( this.anim_default.atLastFrame() ){
			this.die();
		}

		this.anim_default.update()
		this.setImage( this.anim_default.currentFrame() )
	}

	object.die = function(){
		spacebase.units.remove(this);
	}

	return object;
}



