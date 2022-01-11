
function onGeneratedRow(parent, name)
{
    var new_node = {};
	new_node.text={name: name};
	// new_node.drawLineThrough = true;
	// new_node.pseudo = true;
	new_node.connectors = {			
		"style": {
			"stroke": "#50688D",
			'arrow-end': 'oval-wide-long'
		}
	};
	new_node.children = [];
	if(parent != null)
		parent.children.push(new_node)
	return new_node;
 }

var chart_config = {
	chart: {
		container: "#OrganiseChart-big-commpany",
		levelSeparation: 25,
		subTeeSeparation: 60,
		rootOrientation: "WEST",

		nodeAlign: "TOP",
		padding:30,
		connectors: {
			type: "curve",
			style: {
				"stroke-width": 1.5
			}
		},
		node: {
			HTMLclass: "big-commpany",
			collapsable: true
		}
	},

	nodeStructure: {}
};
function AppendTo(parent, each){
	var k = {};
	k = onGeneratedRow(parent, each.self);
	each.other.forEach(
		function(x){
			k = onGeneratedRow(k, x);
		}
	);
	if(each.next.var){
		var m = onGeneratedRow(k, each.next.var);
		each.next.rules.forEach(
			function(x){
				AppendTo(m, x);
			}
		);
	}
	return k;
}
chart_config.nodeStructure = AppendTo(null, link);

new Treant( chart_config );
console.log(link);