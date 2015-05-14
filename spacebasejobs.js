spacebase.JOB_WALK = {type: 1};
spacebase.JOB_WALK.work = function(job, worker){
	// Release the worker
	worker.state = spacebase.STATE_IDLE;
	// Remove myself from joblist
	job.die();
}
spacebase.JOB_WALK.legal = function(job){
	if ( spacebase.tile_map.check(job.col, job.row, "blocking", false )){
		return true;
	} else {
		return false;
	}
}

spacebase.JOB_BUILD = {type: 2};
spacebase.JOB_BUILD.work = function(job, worker){
	// Release the worker
	worker.state = spacebase.STATE_BUILDING;
	// Change image
	job.setImage( job.anim_build.next() )
}
spacebase.JOB_BUILD.legal = function(job){
	if ( spacebase.tile_map.check(job.col, job.row, "blocking", false )){
		return true;
	} else {
		return false;
	}
}

spacebase.job = function(type, target, col, row){

	var object = {};

        object = new jaws.Sprite({x:col*32, y:row*32, scale: 1})
	object.started = false;
	object.type = type;
	object.col = col;
	object.row = row;
	object.target = target;

        var anim = new jaws.Animation({sprite_sheet: "images/job_default.png", frame_size: [32,32], frame_duration: 100})
        object.anim_default = anim.slice(0,1)
        object.anim_build = anim.slice(1,9)

        object.setImage( object.anim_default.next() );

	object.add = function(){
		spacebase.jobs.push(this);
	}

	object.die = function(){
		if ( this.worker ) {
			this.worker.stop_working();
		}
		spacebase.jobs.remove(this);
	}

	object.work = function(worker){
		object.type.work(this, worker);
	}

	object.start = function() {
		var goal = {col: this.col, row: this.row }
		var worker = getAvailableWorker(goal);

		if ( worker !== undefined ) {
			var path = worker.find_path(goal);

			if ( path.length > 0 ){
				worker.set_path(path);
				worker.state = spacebase.STATE_WALKING;
				worker.job = this;
				this.worker = worker;
				this.started = true;
			}
		}
	}

	return object;
};

