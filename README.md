#Welcome to Qubit JS

Simulating qubits in JavaScript.  [Live example.](http://kevinrohling.com/qc/quantum.html)

#Usage

### Create a system of qubits

  ```js
  var qubitSystem = _qubit.systemWithNewQubits(3);

  console.log(qubitSystem.toString());
  // |000>
  ```

### Apply a Hadamard Gate

  ```js
  //This will apply a Hadamard gate to qubits 1 and 3.
  var qubits = [1, 3];
  qubitSystem.applyHadamardGate(qubits);

  console.log(qubitSystem.toString());
  // 0.500 |000> + 0.500 |001> + 0.500 |100> + 0.500 |101>
  ```

  ```js
  //This will apply a Hadamard gate to all qubits.
  qubitSystem.applyHadamardGate();

  console.log(qubitSystem.toString());
  // 0.354 |000> + 0.354 |001> + 0.354 |010> + 0.354 |011> + 0.354 |100> + 0.354 |101> + 0.354 |110> + 0.354 |111>
  ```

### Apply an X Phase Shift

  ```js
  console.log(qubitSystem.toString());
  // |000>

  //This will apply an X Phase Shift gate to qubits 1 and 3.
  var qubits = [1, 3];
  qubitSystem.applyXPhaseShiftGate(qubits);

  console.log(qubitSystem.toString());
  // |101>
  ```

  ```js
  console.log(qubitSystem.toString());
  // |000>

  //This will apply an X Phase Shift gate to all qubits.
  qubitSystem.applyXPhaseShiftGate();

  console.log(qubitSystem.toString());
  // |111>
  ```

### Apply a Z Phase Shift

  ```js
  console.log(qubitSystem.toString());
  // 0.354 |000> + 0.354 |001> + 0.354 |010> + 0.354 |011> + 0.354 |100> + 0.354 |101> + 0.354 |110> + 0.354 |111>

  //This will apply a Z Phase Shift gate to qubits 1 and 3.
  var qubits = [1, 3];
  qubitSystem.applyZPhaseShiftGate(qubits);

  console.log(qubitSystem.toString());
  // 0.354 |000> + -0.354 |001> + 0.354 |010> + -0.354 |011> + -0.354 |100> + 0.354 |101> + -0.354 |110> + 0.354 |111>
  ```

  ```js
  console.log(qubitSystem.toString());
  // 0.354 |000> + 0.354 |001> + 0.354 |010> + 0.354 |011> + 0.354 |100> + 0.354 |101> + 0.354 |110> + 0.354 |111>

  //This will apply a Z Phase Shift gate to all qubits.
  qubitSystem.applyZPhaseShiftGate();

  console.log(qubitSystem.toString());
  // 0.354 |000> + -0.354 |001> + -0.354 |010> + 0.354 |011> + -0.354 |100> + 0.354 |101> + 0.354 |110> + -0.354 |111>
  ```

### Measuring your qubits

  ```js
  console.log(qubitSystem.toString());
  // 0.354 |000> + 0.354 |001> + 0.354 |010> + 0.354 |011> + 0.354 |100> + 0.354 |101> + 0.354 |110> + 0.354 |111>

  // This will measure qubits 1 and 3.
  var qubits = [1, 3];
  qubitSystem.measure(qubits);

  console.log(qubitSystem.toString());
  // 0.707 |000> + 0.707 |010>
  ```

  ```js
  console.log(qubitSystem.toString());
  // 0.354 |000> + 0.354 |001> + 0.354 |010> + 0.354 |011> + 0.354 |100> + 0.354 |101> + 0.354 |110> + 0.354 |111>

  // This will measure all of your qubits.
  qubitSystem.measure();

  console.log(qubitSystem.toString());
  // |100>
  ```

### Running Grover's Algorithm

  ```js
  console.log(qubitSystem.toString());
  // |000>

  qubitSystem.runGroversAlgorithm("011");

  console.log(qubitSystem.toString());
  // -0.088 |000> + -0.088 |001> + -0.088 |010> + 0.972 |011> + -0.088 |100> + -0.088 |101> + -0.088 |110> + -0.088 |111>
  ```

### Credits

  Qubit JS uses the [Math.js](https://github.com/josdejong/mathjs) library.

