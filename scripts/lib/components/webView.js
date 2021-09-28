
module.exports = {
	
	process : function(c) {
		c.comp = {type:'web', layout:$layout.fill,views:[]};
		c.comp.props = {};
        c.comp.props.html = c.src;

	}
}