window._qubit = {
	systemWithNewQubits: function (qubitCount) {
		return QubitSystem.withNewQubits(qubitCount);
	},
};

var mathParser = math.parser();
var QuantumGates = {
	buildHadamardMatrix: function(targetQubits) {
		return this.buildMatrix(this.hMatrix, targetQubits);
	},
	buildXPhaseShiftMatrix: function(targetQubits) {
		return this.buildMatrix(this.xMatrix, targetQubits);
	},
	buildZPhaseShiftMatrix: function(targetQubits) {
		return this.buildMatrix(this.zMatrix, targetQubits);
	},
	buildIdentityMatrix: function(qubitCount) {
		var targetQubits = [];
		for(var i = 0; i < qubitCount; i++) {
			targetQubits.push(true);
		}
		
		return this.buildMatrix(this.iMatrix, targetQubits);
	},
	buildCNOTMatrix: function(qubitCount, controlQubit, targetQubit) {
		var componentCount = Math.pow(2, qubitCount);
		
		var truthTable = [];
		for(var i = 0; i < componentCount; i++) {
			var input = this.toBinaryString(i, qubitCount);
			
			if(input[controlQubit] == "1") {
				var targetQubitValue = "1";
				if(input[targetQubit] == "1") {
					targetQubitValue = "0";
				}
				
				output = input.substring(0, targetQubit) + targetQubitValue + input.substring(targetQubit+1, input.length);
			}
			else {
				output = input;
			}
			
			truthTable.push([input, output]);
		}
		
		return this.buildMatrixFromTruthTable(truthTable);
	},
	buildDiffusionMatrix: function(qubitCount) {
		var matrix = [];
		var n = Math.pow(2, qubitCount);
		var v1 = 2/n;
		var v2 = v1-1;
		
		for(var i = 0; i < n; i++) {
			matrix.push([]);
		}
		
		for(var i = 0; i < n; i++) {
			for(var j = 0; j < n; j++) {
				if(i == j) {
					matrix[i].push(v2);
				}
				else {
					matrix[i].push(v1);
				}
			}
		}
		
		return matrix;
	},
	buildGroverOracleMatrix: function(qubitCount, targetState) {
		var matrix = this.buildIdentityMatrix(qubitCount);
		var targetValue = this.fromBinaryString(targetState);
		matrix[targetValue][targetValue] = -1;
		
		return matrix;
	},
	buildMatrix: function (baseMatrix, targetQubits) {
		var resultMatrix;
		
		if(targetQubits[0]) {
			resultMatrix = baseMatrix;
		}
		else {
			resultMatrix = this.iMatrix;
		}
		
		for(var i = 1; i < targetQubits.length; i++) {
			if(targetQubits[i]) {
				resultMatrix = this.tensor(resultMatrix, baseMatrix);
			}
			else {
				resultMatrix = this.tensor(resultMatrix, this.iMatrix);
			}
		}
		
		return resultMatrix;
	},
	buildMatrixFromTruthTable: function(truthTable) {
		var length = truthTable.length;
		var componentNames = [];
		
		for(var i = 0; i < truthTable.length; i++) {
			componentNames.push(truthTable[i][0]);
		}
		
		var result = [];
		for(var outputVal = 0; outputVal < length; outputVal++) {
			
			var row = [];
			var indices = [];
			var outputStr = this.toBinaryString(outputVal, qubitCount);
			
			truthTable.forEach(function(e, i) { 
				if(e[1] == outputStr) { 
					indices.push(i); 
				} 
			});
			
			var cellValue = indices.length > 0 ? 1/Math.sqrt(indices.length) : 0;
			for(var inputVal = 0; inputVal < length; inputVal++) {
				if(indices.indexOf(inputVal) != -1){
					
					row.push(cellValue);
				}
				else {
					row.push(0);
				}
			}
			
			result.push(row);
		}
		
		return result;
	},
	fromBinaryString: function(str) {
		var result = 0;
		for(var i = 0; i < str.length; i++) {
			if(str[str.length-(i+1)] == "1") {
				result += Math.pow(2, i);
			}
		}
		
		return result;
	},
	toBinaryString: function (num, length) {
		var str = "";
		
		while(num != 0) {
			mod = num % 2;
			num = Math.floor(num / 2);
			str = mod + str;
		}
		
		for(var i = 0; str.length < length; i++) {
			str = "0" + str;
		}
		
		return str;
	},
	tensor: function(m1, m2) {
		height = m1.length * m2.length;
		width= m1[0].length * m2[0].length;

		result = [];
		for (var i = 0; i < height; i++) {
			result[i] = [];
		}
		
		for(var m1i = 0; m1i < m1.length; m1i++) {
			i_basis = m1i * m2.length;
			
			for(var m1j = 0; m1j < m1[m1i].length; m1j++) {
				j_basis = m1j * m2[0].length;
				a = m1[m1i][m1j];
				
				for(var m2i = 0; m2i < m2.length; m2i++) {
					for(var m2j = 0; m2j < m2[m2i].length; m2j++) {
						b = m2[m2i][m2j]
				        result[i_basis+m2i][j_basis+m2j] = a*b
					}
				}
			}
		}
		
		return result;
	},
	printMatrix: function(matrix) {
		for(var i = 0; i < matrix.length; i++) {
			var line = "";
			for(var j = 0; j < matrix[i].length; j++) {
				line += matrix[i][j] + ", ";
			}
			console.log(line);
		}
	},
	hMatrix: [
		[mathParser.eval("1/sqrt(2)"), mathParser.eval("1/sqrt(2)")],
		[mathParser.eval("1/sqrt(2)"), mathParser.eval("-1/sqrt(2)")]
	],
	xMatrix: [
		[0, 1],
		[1, 0]
	],
	zMatrix: [
		[1, 0],
		[0, -1]
	],
	iMatrix: [
		[1, 0],
		[0, 1]
	],
};

var QubitSystem = {
	withNewQubits: function(qubitCount) {
		var qubits = [];
		for(var i = 0; i < qubitCount; i ++) {
			qubits.push(Qubit.withNewComponents());
		}
		return QubitSystem.withQubits(qubits);
	},

	withQubits: function(qubits) {
		var computedComponents = [qubits[0].component1, qubits[0].component2 ];

		for(var i = 1; i < qubits.length; i++) {
			var qubit = qubits[i];
			var newComponents = [];

			for(var j = 0; j < computedComponents.length; j++) {
				var newComponent;
				var computedComponent = computedComponents[j];

				newComponent = computedComponent.multiply(qubit.component1);
				newComponents.push(newComponent);

				newComponent = computedComponent.multiply(qubit.component2);
				newComponents.push(newComponent);
			}

			computedComponents = newComponents;
		}

		return QubitSystem.withComponents(qubits.length, computedComponents);
	},
	
	withComponents: function(qubitCount, components) {
		return QubitSystem.init(qubitCount, components);
	},
	
	init: function (qubitCount, components) {
		var system = {
			qubitCount: qubitCount,
			components: components,
			
			applyHadamardGate: function(qubits) {
				var target = this.buildQubitTargetArray(this.qubitCount, qubits);
				var matrix = QuantumGates.buildHadamardMatrix(target);
				QuantumGates.printMatrix(matrix);
				this.applyMatrix(matrix);
			},
			applyXPhaseShiftGate: function(qubits) {
				var target = this.buildQubitTargetArray(this.qubitCount, qubits);
				var matrix = QuantumGates.buildXPhaseShiftMatrix(target);
				this.applyMatrix(matrix);
			},
			applyZPhaseShiftGate: function(qubits) {
				var target = this.buildQubitTargetArray(this.qubitCount, qubits);
				var matrix = QuantumGates.buildZPhaseShiftMatrix(target);
				this.applyMatrix(matrix);
			},
			applyCNOTGate: function() {
				var matrix = QuantumGates.buildCNOTMatrix(qubitCount);
				this.applyMatrix(matrix);
			},
			applyIdentityGate: function() {
				var matrix = QuantumGates.buildIdentityMatrix(qubitCount);
				this.applyMatrix(matrix);
			},
			runGroversAlgorithm: function(targetComponent) {
				var oracleMatrix = QuantumGates.buildGroverOracleMatrix(this.qubitCount, targetComponent);
				var diffusionMatrix = QuantumGates.buildDiffusionMatrix(this.qubitCount);
				var iterations = Math.floor((Math.PI/4) * Math.sqrt(Math.pow(2, this.qubitCount)));
				
				this.applyHadamardGate();
				
				for(var i = 0; i < iterations; i++) {
					this.applyMatrix(oracleMatrix);
				    this.applyMatrix(diffusionMatrix);
				}
			},
			measure: function(qubits) {
				console.log(qubits);
				if(qubits) {
					for(var i = 0; i < qubits.length; i++) {
						this.measureQubit(qubits[i]);
					}
				}
				else {
					var measuredComponent = this.sample();
					for(var i = 0; i < this.components.length; i++) {
						this.components[i].amplitude = 0;
					}
					measuredComponent.amplitude = 1;
				}
				
				this.normalize();
				console.log(this.toString());
			},
			sample: function () {
				this.normalize();

				var selector = Math.random();
				var selectorSum = 0;
				var measuredComponent = null;

				for(var i = 0; i < this.components.length; i++) {
					var component = this.components[i];
					selectorSum += Math.abs(math.select(component.amplitude).multiply(component.amplitude));
					if(selectorSum > selector) {
						measuredComponent = component;
						break;
					}
				}

				return measuredComponent;
			},
			measureQubit: function(qubit) {
				var index = qubit-1;
				var measuredComponent = this.sample();
				measuredComponent = Component.withNameAndAmplitude(measuredComponent.name[index], 1);

				this.components = this.collapseComponents(index, measuredComponent);
				this.normalize();

				return measuredComponent;
			},
			toString: function() {
				var str = "";

				for(var i = 0; i < this.components.length; i++) {
					var component = this.components[i];
					if(component.amplitude != 0) {
						if(str != "") {
							str += " + ";
						}

						str += component.toString();
					}
				}

				return str;
			},


			/*****************PRIVATE****************/
			buildQubitTargetArray: function(qubitCount, targetQubits) {
				var arr = [];
				for(var i = 0; i < qubitCount; i++) {
					if(!targetQubits || (targetQubits.indexOf(i+1)+1) != 0) {
						arr.push(true);
					}
					else {
						arr.push(false);
					}
				}
				
				return arr;
			},
			
			applyMatrix: function(matrix) {
				var newComponents = [];

				for(var i = 0; i < matrix.length; i++) {
					var row = matrix[i];
					var sum = 0;

					for(var j = 0; j < row.length; j++) {
						var product = math.select(row[j]).multiply(this.components[j].amplitude).value;
						sum = math.select(sum).add(product).value;
					}
					
					
					var newComponent = Component.withNameAndAmplitude(this.components[i].name, sum);
					newComponents.push(newComponent);
				}
				
				this.components = newComponents;
				this.normalize();
				console.log(this.toString());
			},

			normalize: function() {
				this.components = Component.normalizeComponents(this.components);
			},

			collapseComponents: function(index, component) {
				var newComponents = [];

				for(var i = 0; i < this.components.length; i++) {
					var systemComponent = this.components[i].clone();
					newComponents.push(systemComponent);
					if(systemComponent.name[index] != component.name) {
						systemComponent.amplitude = 0;
					}
				}

				return newComponents;
			}

			/*****************PRIVATE****************/
		};
		
		system.normalize();
		return system;
	},
	
	
}

var Qubit = {
	withNewComponents: function() {
		var component1 = Component.withNameAndAmplitude("0", .5);
		var component2 = Component.withNameAndAmplitude("1", 0);
		return Qubit.withComponents(component1, component2);
	},
	
	withComponents: function(component1, component2) {
		return Qubit.init(component1, component2);
	},
	
	init: function (component1, component2) {
	    var newQubit = {
			component1: component1,
		    component2: component2,

			toString: function() {
				var str = "";
				if(this.component1.amplitude != 0) {
					str += this.component1.toString();
				}

				if(this.component2.amplitude != 0) {
					if(str != "") {
						str += " + ";
					}

					str += this.component2.toString();
				}

				return str;
			},

			normalize: function () {
				normalized = Component.normalizeComponents([this.component1, this.component2]);

				this.component1 = normalized[0];
				this.component2 = normalized[1];
		    }
		};
		
		newQubit.normalize();
		return newQubit;
	}
}

var Component = {
	
	withNameAndAmplitude: function(name, amplitude) {
		//This is a hack to defend against floating point precision errors.
		if (Math.abs(amplitude) > 0 && Math.abs(amplitude) < .00001) {
			amplitude = 0;
		}
		
		return Component.init(name, amplitude);
	},
	
	init: function (name, amplitude) {
		return {
			name: name,
			amplitude:  amplitude,
			multiply: function(component) {
				var newName = this.name + component.name;
				var newAmplitude = math.select(this.amplitude).multiply(component.amplitude).value;

				return Component.withNameAndAmplitude(newName, newAmplitude);
			},

			clone: function() {
				return Component.withNameAndAmplitude(this.name, this.amplitude);
			},

			toString: function() {
				var str = "";

				if (this.amplitude != 1) {
					var amplitudeStr;
					if(this.amplitude != -1) {
						amplitudeStr = this.amplitude.toFixed(3).toString();
					}
					else {
						amplitudeStr = "-";
					}

					str += amplitudeStr + " ";
				}

				str += "|" + this.name + ">";

				return str;
			}
		};
	},
	
	normalizeComponents: function(components) {
		var squaredSum = 0;
		for(var i = 0; i < components.length; i++) {
			var component = components[i];
			var squaredValue = math.select(component.amplitude).multiply(component.amplitude).value;
			squaredSum = math.select(squaredSum).add(squaredValue).value;
		}
		
		var normalizedComponents = [];
		var norm = math.sqrt(squaredSum);
		for(var i = 0; i < components.length; i++) {
			var component = components[i];
			var normalizedValue = math.select(component.amplitude).divide(norm).value;
			var newComponent = Component.withNameAndAmplitude(component.name, normalizedValue);
			normalizedComponents.push(newComponent);
		}
		
		return normalizedComponents;
	}
};