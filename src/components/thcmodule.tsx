import React, { useState } from "react";
import "./thcmodule.css";

interface Entry {
  task: string;
  hazard: string;
  hazardRisk: number;
  control: string;
  controlRisk: number;
}
const riskColors: { [key: number]: string } = {
  1: "#00e676", // bright green
  2: "#66bb6a",
  3: "#cddc39",
  4: "#ffeb3b",
  5: "#ffc107",
  6: "#ff9800",
  7: "#ff5722",
  8: "#f44336",
  9: "#e53935",
  10: "#b71c1c", // deep red
};

const THCModule: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [task, setTask] = useState("");
  const [hazard, setHazard] = useState("");
  const [hazardRisk, setHazardRisk] = useState(10);
  const [control, setControl] = useState("");
  const [controlRisk, setControlRisk] = useState(10);

  const submitEntry = () => {
    if (task && hazard && control) {
      setEntries([
        ...entries,
        { task, hazard, hazardRisk, control, controlRisk },
      ]);
      setTask("");
      setHazard("");
      setHazardRisk(10);
      setControl("");
      setControlRisk(10);
    }
  };

  const removeEntry = (index: number) => {
    const updated = [...entries];
    updated.splice(index, 1);
    setEntries(updated);
  };

  return (
    <section className="module-box">
      <span className="module-label">Task, Hazard, Control</span>
      <table className="thc-table input-table">
        <tbody>
          <tr>
            <td>
              <input
                type="text"
                placeholder="Task"
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />
            </td>
            <td>
              <input
                type="text"
                placeholder="Hazard"
                value={hazard}
                onChange={(e) => setHazard(e.target.value)}
              />
            </td>
            <td>
              <select
                className="risk-select"
                value={hazardRisk}
                onChange={(e) => setHazardRisk(parseInt(e.target.value))}
                style={{
                  backgroundColor: riskColors[hazardRisk],
                  color: "#fff",
                }}
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </td>
            <td>
              <input
                type="text"
                placeholder="Control"
                value={control}
                onChange={(e) => setControl(e.target.value)}
              />
            </td>
            <td>
              <select
                className="risk-select"
                value={controlRisk}
                onChange={(e) => setControlRisk(parseInt(e.target.value))}
                style={{
                  backgroundColor: riskColors[controlRisk],
                  color: "#fff",
                }}
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </td>
            <td>
              <button className="submit-button" onClick={submitEntry}>
                Submit
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <table className="thc-table output-table">
        <thead>
          <tr>
            <th>Task</th>
            <th>Hazard</th>
            <th>Control</th>
            <th>Risk Level</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr key={index}>
              <td>{entry.task}</td>
              <td>{entry.hazard}</td>
              <td>{entry.control}</td>
              <td>{`${entry.hazardRisk} → ${entry.controlRisk}`}</td>
              <td>
                <button onClick={() => removeEntry(index)}>✖</button>
              </td>
            </tr>
          ))}
          {entries.length === 0 && (
            <tr>
              <td colSpan={5} style={{ height: "80px" }}></td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
};

export default THCModule;
