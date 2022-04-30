let maShit = {
    start: null
}

function IsStart(cell) {
    let style = window.hello.editor.graph.getStylesheet().getCellStyle(cell.style)
    return ((typeof cell.value === 'string' && cell.value === 'התחלה') || (typeof cell.value === 'object' && cell.value.getAttribute('label') === 'התחלה') && cell.value.getAttribute("makey") === 'start') && style.shape === "ellipse" && style.fillColor === '#d5e8d4';
}

function IsNode(cell) {
    return typeof cell.value === 'object' && cell.value.getAttribute('makey') === 'node';
}

function IsNodeMessage(cell) {
    return window.hello.editor.graph.getStylesheet().getCellStyle(cell.style).fillColor == '#ffe6cc'
			//&& evt.properties.cells[0].parent !== null
			//&&window.hello.editor.graph.getStylesheet().getCellStyle(evt.properties.cells[0].parent.style).fillColor == '#d5e8d4'
			//&&window.hello.editor.graph.getStylesheet().getCellStyle(evt.properties.cells[0].parent.style).shape == "swimlane"
			&& typeof cell.value === 'object'
			&& cell.value.getAttribute('makey') === 'node_message'
}

function getDestinationNodes(cell) {
    if(!IsStart(cell) && !IsNode(cell)) {
        //throw new Error("oh no there you go making me a liar")
        return null;
    }

    let filteredChildren = cell.children.filter((child) => {
        return !IsNodeMessage(child) && child.edges.length === 1 && child.edges[0].source !== null && child.edges[0].target !== null && child.edges[0].source.id === child.id && IsNode(child.edges[0].target);
    })

    let mappedChildren = filteredChildren.map((child) => {



        return {
            optionID: child.id,
            optionValue: typeof child.value === 'string' : child.value,
            nextNodeID: "Node id the edge is pointing at"
        }
    })
}

function initiator() {
	// Look for the starting sphere:
	for(let cellIndex in window.hello.editor.graph.model.cells){
		let cell = window.hello.editor.graph.model.cells[cellIndex]

		if(IsStart(cell)){
			console.log("Found starting cell!", cell)
			maShit.start = cell;
			break;
		}
	}

	let lastPopupScreenCoords = {x: -1, y: -1}

	// Points to the showMenu function in the prototype.
	let defshowmenu = mxPopupMenu.prototype.showMenu

	// Override the showMenu function (to add additional features to the menu).
	mxPopupMenu.prototype.showMenu = function() {
		debugger;
		let bgCoords = document.querySelector(".geBackgroundPage").getBoundingClientRect();
		if(!(this.screenX >= bgCoords.left && this.screenX <= bgCoords.right && this.screenY >= bgCoords.top && this.screenY <= bgCoords.bottom + 105)){
				defshowmenu.apply(this, arguments);
				return;
		}
		lastPopupScreenCoords.x = this.screenX;
		lastPopupScreenCoords.y = this.screenY;
		if(this.graph.isSelectionEmpty()) {
			if(maShit.start === null) {
				this.addItem("יצירת רצף חוליות חדש", undefined, function(event){
					// Ahmed is a new cell that has an elipse style.
					
					// Gets the canvas location, so relativeness can be acheived.
					let bgCoords = document.querySelector(".geBackgroundPage").getBoundingClientRect();

					let objecto = document.createElement('object')
					objecto.setAttribute('label', 'התחלה')
					objecto.setAttribute('makey', 'start')
					
					let ahmed = new mxCell("התחלה", new mxGeometry(lastPopupScreenCoords.x - bgCoords.left, lastPopupScreenCoords.y - bgCoords.top - 105, 120, 80), "ellipse;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;")
					// Has to have vertex as true to show up.
					ahmed.vertex = true;
					
					ahmed.value = objecto;

					// Adding the cell to the graph
					window.hello.editor.graph.addCell(ahmed, window.hello.editor.graph.defaultParent)

					maShit.start = ahmed;
				});
			}else{
				this.addItem("יצירת חוליה חדשה", undefined, function(event){
					// Ahmed is a new cell that has an elipse style.
					
					// Gets the canvas location, so relativeness can be acheived.
					let bgCoords = document.querySelector(".geBackgroundPage").getBoundingClientRect();
					
					let ahmed = new mxCell("חוליה", new mxGeometry(lastPopupScreenCoords.x - bgCoords.left, lastPopupScreenCoords.y - bgCoords.top - 105, 120, 80), "swimlane;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=30;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;fillColor=#d5e8d4;strokeColor=#82b366;")
					// Has to have vertex as true to show up.
					ahmed.vertex = true;
					let objecto = document.createElement('object')
					objecto.setAttribute('label', 'חוליה')
					objecto.setAttribute('makey', 'node')
					ahmed.value = objecto;
					
					let option1 = new mxCell("אופציה 1", new mxGeometry(0, 60, ahmed.geometry.width, 30), "text;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;spacingLeft=4;spacingRight=4;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;metaEdit=0;textDirection=rtl;labelPosition=center;verticalLabelPosition=middle;whiteSpace=wrap;");
					option1.vertex = true;
					
					let option2 = new mxCell("אופציה 2", new mxGeometry(0, 90, ahmed.geometry.width, 30), "text;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;spacingLeft=4;spacingRight=4;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;metaEdit=0;textDirection=rtl;labelPosition=center;verticalLabelPosition=middle;whiteSpace=wrap;");
					option2.vertex = true;
					
					// Adding the cell to the graph
					window.hello.editor.graph.addCell(ahmed, window.hello.editor.graph.defaultParent);

					let tibi = new mxCell("*הודעה*", new mxGeometry(0, 30, ahmed.geometry.width, 30), "text;strokeColor=#d79b00;fillColor=#ffe6cc;align=left;verticalAlign=middle;spacingLeft=4;spacingRight=4;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;metaEdit=0;textDirection=rtl;labelPosition=center;verticalLabelPosition=middle;whiteSpace=wrap;");
					tibi.vertex = true;
					objecto = document.createElement('object')
					objecto.setAttribute('label', '*הודעה*')
					objecto.setAttribute('makey', 'node_message')
					objecto.setAttribute('myparent', ahmed.id)
					tibi.value = objecto;

					window.hello.editor.graph.addCell(tibi, ahmed);
					window.hello.editor.graph.addCell(option1, ahmed);
					window.hello.editor.graph.addCell(option2, ahmed);
				});
			}
		}
		defshowmenu.apply(this, arguments);
	}

    /*window.hello.editor.graph.addListener(null, function(sender, evt) {
		if(evt.name === 'fireMouseEvent') {
            return;
        }
        console.log(evt.name)
	})*/

    window.hello.editor.graph.addListener(mxEvent.MOVE_CELLS, function(sender, evt) {
		if(evt.properties.cells.length > 0) {
            if(IsNode(evt.properties.cells[0])) {
                for(let cell of evt.properties.cells[0].children) {
                    if(typeof cell.value === 'object' && cell.value.getAttribute("makey") === 'node_message') {
                        cell.value.setAttribute('myparent', evt.properties.cells[0].id)
                        return;
                    }
                }
            }
        }
	})

	window.hello.editor.graph.addListener(mxEvent.REMOVE_CELLS, function(sender, evt) {
		debugger;
		if(evt.properties.cells.length > 0) {
			if(maShit.start !== null && evt.properties.cells[0].id === maShit.start.id){
				console.log("Removed start object")
				maShit.start = null;
				return;
			}
			
			// Don't allow the removal of the message section in the node.
			if(IsNodeMessage(evt.properties.cells[0])) {
                let parent = window.hello.editor.graph.model.cells[evt.properties.cells[0].value.getAttribute('myparent')];
                let tempRemovedCells = [];
                for(let i in parent.children){
                    tempRemovedCells.push(parent.children[i]);

                }
                window.hello.editor.graph.removeCells(tempRemovedCells);
				window.hello.editor.graph.addCell(evt.properties.cells[0], parent)
                window.hello.editor.graph.addCells(tempRemovedCells, parent)
                /*for(let cell of tempRemovedCells){
                    window.hello.editor.graph.addCell(cell, parent)
                }*/
				console.log("OH NO! RE-ADDING!")
				return;
			}
		}
		debugger;
	})
}

/*window.hello.editor.graph.addListener(mxEvent.CELLS_REMOVED, function(sender, evt) {
    debugger;
})*/



let CREATION_EVENT_FLOW = ["defaultParentChanged", "root", "size", "defaultParentChanged", "root", "defaultParentChanged", "root", "size", "enabledChanged", "enabledChanged", "defaultParentChanged"]
let flows = [];
let lookForFlow = true;

App.main(function(ui){
    window.hello = ui; 
    window.hello.editor.graph.addListener(null, function(sender, evt) {
        if(lookForFlow === false) {
            return;
        }
        if(evt.name === 'fireMouseEvent') {
            return;
        }
        debugger;
        for(let i in flows) {
            if(CREATION_EVENT_FLOW[flows[i].length] === evt.name) {
                flows[i].push(evt.name);
                console.log("pushed ", evt.name, " to clone ", i)
                if(flows[i].length === CREATION_EVENT_FLOW.length){
                    //OH WOW! init everything!
                    initiator();
                    console.log("Initiation successful! clone ", i);
                    lookForFlow = false;
                    return;
                }
            }else{
                flows = flows.filter((value,index) => {return index !== i ? true : false;})
                console.log("removed clone ", i, " due to ", evt.name)
            }
        }
        if(evt.name === CREATION_EVENT_FLOW[0]) {
            console.log("Created a clone! ", flows.length)
            flows.push([CREATION_EVENT_FLOW[0]]);
        }
    })
})