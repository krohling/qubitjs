window._circuit = {
	initialize: function (context) {
		this.context = context;
		this.drawingOptions.canvasCenterX = context.canvas.width / 2;
	},
	gateCounter: 0,
	drawingOptions: {
		canvasTopYMargin: 0,
		canvasCenterX: 0,
		circuitWidth: 300,
		circuitHeight: 50,
		circuitMargin: 15,
		gateWidth: 50,
		strokeStyle: "#000",
		strokeWidth: 1,
	},
	reset: function() {
		this.gateCounter = 0;
		this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
	},
	drawHadamardGate: function(qubitCount, qubits) {
		var image = document.getElementById("h-icon");
		this.drawGate(qubitCount, qubits, image);
	},
	drawXPhaseShiftGate: function(qubitCount, qubits) {
		var image = document.getElementById("x-icon");
		this.drawGate(qubitCount, qubits, image);
	},
	drawZPhaseShiftGate: function(qubitCount, qubits) {
		var image = document.getElementById("z-icon");
		this.drawGate(qubitCount, qubits, image);
	},
	drawMeasurement: function(qubitCount, qubits) {
		var image = document.getElementById("measurement-icon");
		this.drawGate(qubitCount, qubits, image);
	},
	drawFunctionOperation: function(qubitCount, qubits) {
		var image = document.getElementById("fx-icon");
		this.drawGate(qubitCount, qubits, image);
	},
	drawDiffusionOperation: function(qubitCount, qubits) {
		var image = document.getElementById("diff-icon");
		this.drawGate(qubitCount, qubits, image);
	},
	drawGate: function(qubitCount, qubits, image) {
		var circuitX = this.drawingOptions.canvasCenterX - (this.drawingOptions.circuitWidth / 2);
		var circuitY = this.drawingOptions.canvasTopYMargin + ((this.drawingOptions.circuitHeight + (2 * this.drawingOptions.circuitMargin)) * this.gateCounter);
		var divisor = qubitCount > 1 ? (qubitCount-1) : 1;
		var gateMargin = (this.drawingOptions.circuitWidth - (this.drawingOptions.gateWidth * qubitCount)) / divisor;
		
		for(var i = 0; i < qubitCount; i++) {
			var qubit = i+1;
			if(qubits.indexOf(qubit) != -1) {
				this.drawQubitGate(qubit, circuitX, circuitY, gateMargin, this.drawingOptions.gateWidth, image);
			}
			else {
				this.drawQubitWire(qubit, circuitX, circuitY, gateMargin, this.drawingOptions.gateWidth);
			}
		}
		
		this.gateCounter++;
	},
	drawQubitGate: function(qubit, circuitX, circuitY, gateMargin, gateSize, image) {
		var gateX = circuitX + ((gateSize + gateMargin) * (qubit-1));
		this.context.rect(gateX, circuitY, gateSize, gateSize);
		this.context.stroke();
		
		var wireX = gateX + (gateSize/2);
		this.context.beginPath();
		this.context.moveTo(wireX,circuitY - this.drawingOptions.circuitMargin);
		this.context.lineTo(wireX,circuitY);
		this.context.stroke();
		
		this.context.beginPath();
		this.context.moveTo(wireX,circuitY + gateSize);
		this.context.lineTo(wireX,circuitY + gateSize + this.drawingOptions.circuitMargin);
		this.context.stroke();
		
		this.context.drawImage(image, gateX, circuitY, gateSize, gateSize);
	},
	drawQubitWire: function(qubit, circuitX, circuitY, gateMargin, gateSize) {
		var gateX = circuitX + ((gateSize + gateMargin) * (qubit-1));
		var wireX = gateX + (gateSize/2);
		
		this.context.beginPath();
		this.context.moveTo(wireX,circuitY - this.drawingOptions.circuitMargin);
		this.context.lineTo(wireX,circuitY + gateSize + this.drawingOptions.circuitMargin);
		this.context.stroke();
	}
};