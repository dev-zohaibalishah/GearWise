import React, { useState } from "react";
import "./calc.css";

const machineData = {
  "Eurolaser": 4.55,
  "SEI Laser": 5.83,
  "Golden Laser": 18.55,
  "Zund M800 CV Knife Cutter 1": 5.41,
  "Knife M800 CV Cutter 2": 5.41,
  "Knife M800 Cutter 3": 5.41,
  "Knife M800 Cutter 4": 5.41,
  "Knife S3 Cutter 5": 5.59,
  "Theame + Oven": 21.42,
  "Sakurai + Oven": 27.21,
  "Svecia + Oven": 22.37,
  "Puokkari": 13.27,
  "Atma 1": 15.69,
  "Atma 2": 15.69,
  "Digital Printer JFX200-2513": 23.75,
  "Digital Printer JFX200-2513EX": 23.75,
  "Digital Printer JFX200-2513 (2nd)": 23.75,
  "Guillotine Perfecta 2": 10.45,
  "Guillotine 1 Polar Mohr": 13.19,
  "Suma Cutter": 1.04,
  "Oven": 4.73,
  "Neschen Laminator": 1.33,
  "SEAL 62 Base Metal Laminator": 1.37,
  "Pressing Machine Festo": 2.59,
  "Coring Technigraf Machine": 4.84
};

const calc = () => {
  const [materialCost, setMaterialCost] = useState(0);
  const [numUnits, setNumUnits] = useState(1);
  const [manualMinutes, setManualMinutes] = useState(0);
  const [engineeringMinutes, setEngineeringMinutes] = useState(0);
  const [machines, setMachines] = useState([]);
  const [output, setOutput] = useState(null);

  const addMachine = () => {
    setMachines([...machines, { machine: Object.keys(machineData)[0], minutes: 0 }]);
  };

  const updateMachine = (index, field, value) => {
    const updated = [...machines];
    updated[index][field] = field === "minutes" ? parseFloat(value) : value;
    setMachines(updated);
  };

  const removeMachine = (index) => {
    setMachines(machines.filter((_, i) => i !== index));
  };

  const calculate = () => {
    const laborRatePerMin = 20 / 60;
    const engineeringRatePerMin = 25 / 60;

    let totalMachineCost = 0;
    machines.forEach(({ machine, minutes }) => {
      const costPerHour = machineData[machine];
      totalMachineCost += (costPerHour / 60) * (minutes || 0);
    });

    const totalLaborCost = manualMinutes * laborRatePerMin;
    const totalEngineeringCost = engineeringMinutes * engineeringRatePerMin;
    const totalCost = materialCost + totalMachineCost + totalLaborCost + totalEngineeringCost;
    const costPerUnit = totalCost / (numUnits || 1);

    setOutput({
      totalMaterialCost: materialCost.toFixed(2),
      totalMachineCost: totalMachineCost.toFixed(2),
      totalLaborCost: totalLaborCost.toFixed(2),
      totalEngineeringCost: totalEngineeringCost.toFixed(2),
      totalCost: totalCost.toFixed(2),
      costPerUnit: costPerUnit.toFixed(2),
      materialCostPerUnit: (materialCost / numUnits).toFixed(2),
      laborCostPerUnit: (totalLaborCost / numUnits).toFixed(2),
      materialLaborSumPerUnit: ((materialCost + totalLaborCost) / numUnits).toFixed(2)
    });
  };

  const resetAll = () => {
    setMaterialCost(0);
    setNumUnits(1);
    setManualMinutes(0);
    setEngineeringMinutes(0);
    setMachines([]);
    setOutput(null);
  };

  return (
    <div className="calculator">
      <h2>Product Cost Calculator</h2>

      <label>
        Material Cost (€):
        <input
          type="number"
          step="0.01"
          value={materialCost}
          onChange={(e) => setMaterialCost(parseFloat(e.target.value) || 0)}
        />
      </label>

      <label>
        Number of Units Produced:
        <input
          type="number"
          value={numUnits}
          onChange={(e) => setNumUnits(parseInt(e.target.value) || 1)}
        />
      </label>

      <div className="machine-list">
        {machines.map((entry, index) => (
          <div className="machine-entry" key={index}>
            <select
              value={entry.machine}
              onChange={(e) => updateMachine(index, "machine", e.target.value)}
            >
              {Object.keys(machineData).map((machine) => (
                <option key={machine} value={machine}>
                  {machine}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Minutes"
              value={entry.minutes}
              onChange={(e) => updateMachine(index, "minutes", e.target.value)}
            />
            <button onClick={() => removeMachine(index)}>Remove</button>
          </div>
        ))}
        <button onClick={addMachine} className="add-button">Add Machine</button>
      </div>

      <label>
        Manual Labor Time (minutes):
        <input
          type="number"
          value={manualMinutes}
          onChange={(e) => setManualMinutes(parseFloat(e.target.value) || 0)}
        />
      </label>

      <label>
        Product Engineering Time (minutes):
        <input
          type="number"
          value={engineeringMinutes}
          onChange={(e) => setEngineeringMinutes(parseFloat(e.target.value) || 0)}
        />
      </label>

      <div className="button-group">
        <button onClick={calculate} className="calculate-button">Calculate</button>
        <button onClick={resetAll} className="reset-button">Reset</button>
      </div>

      {output && (
        <div className="output">
          <h3>Cost Breakdown</h3>
          <table className="output-table">
            <tbody>
              <tr><td>Total Material Cost</td><td>€{output.totalMaterialCost}</td></tr>
              <tr><td>Total Machine Cost</td><td>€{output.totalMachineCost}</td></tr>
              <tr><td>Total Labor Cost</td><td>€{output.totalLaborCost}</td></tr>
              <tr><td>Total Engineering Cost</td><td>€{output.totalEngineeringCost}</td></tr>
              <tr className="highlight"><td><strong>Total Cost</strong></td><td><strong>€{output.totalCost}</strong></td></tr>
              <tr className="highlight"><td><strong>Cost Per Unit</strong></td><td><strong>€{output.costPerUnit}</strong></td></tr>
              <tr><td>Material Cost Per Unit</td><td>€{output.materialCostPerUnit}</td></tr>
              <tr><td>Labor Cost Per Unit</td><td>€{output.laborCostPerUnit}</td></tr>
              <tr><td>Material + Labor Per Unit</td><td>€{output.materialLaborSumPerUnit}</td></tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default calc;
