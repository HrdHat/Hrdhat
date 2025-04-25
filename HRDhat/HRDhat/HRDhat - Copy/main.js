function updateRiskColor(selectEl) {
  const colorMap = {
    1: "#00e676",
    2: "#66bb6a",
    3: "#cddc39",
    4: "#ffeb3b",
    5: "#ffc107",
    6: "#ff9800",
    7: "#ff5722",
    8: "#f44336",
    9: "#e53935",
    10: "#b71c1c",
  };

  const selectedValue = selectEl.value;
  const color = colorMap[selectedValue] || "#ccc";

  // Set background color dynamically using inline CSS variable
  selectEl.style.setProperty("--risk-color", color);
  selectEl.setAttribute("data-color", color);
}

// Automatically apply color on load and on change
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".risk-select").forEach((select) => {
    updateRiskColor(select);
    select.addEventListener("change", () => updateRiskColor(select));
  });
});

function getRiskColor(value) {
  const colors = [
    "#00e676",
    "#66bb6a",
    "#cddc39",
    "#ffeb3b",
    "#ffc107",
    "#ff9800",
    "#ff5722",
    "#f44336",
    "#e53935",
    "#b71c1c",
  ];
  return colors[Math.max(0, Math.min(9, value - 1))];
}

function submitTHC() {
  const task = document.getElementById("taskInput").value.trim();
  const hazard = document.getElementById("hazardInput").value.trim();
  const control = document.getElementById("controlInput").value.trim();
  const hazardRisk = parseInt(document.getElementById("hazardRiskInput").value);
  const controlRisk = parseInt(
    document.getElementById("controlRiskInput").value
  );

  if (!task || !hazard || !control) return;

  // Remove placeholder on first real submission
  const placeholderRow = document.getElementById("placeholderRow");
  if (placeholderRow) placeholderRow.remove();

  const row = document.createElement("tr");
  row.innerHTML = `
      <td>${task}</td>
      <td>${hazard}</td>
      <td>${control}</td>
      <td>
        <div class="risk-gradient-cell" style="background: linear-gradient(to right, ${getRiskColor(
          hazardRisk
        )}, ${getRiskColor(controlRisk)});">
          ${hazardRisk} → ${controlRisk}
        </div>
      </td>
      <td>
  <button class="remove-btn" onclick="this.parentElement.parentElement.remove()">×</button>
</td>
`;

  document.getElementById("pillTableBody").appendChild(row);

  // Reset form
  document.getElementById("taskInput").value = "";
  document.getElementById("hazardInput").value = "";
  document.getElementById("controlInput").value = "";
  document.getElementById("hazardRiskInput").value = "10";
  document.getElementById("controlRiskInput").value = "10";
  updateRiskColor(document.getElementById("hazardRiskInput"));
  updateRiskColor(document.getElementById("controlRiskInput"));
}
function addWorker() {
  const container = document.getElementById("workerSignatures");

  const wrapper = document.createElement("div");
  wrapper.className = "worker-entry";

  wrapper.innerHTML = `
    <div class="signature-block">
      <div class="signature-label">✍️ <span>Signature</span></div>
      <canvas class="signature-pad" width="200" height="50"></canvas>
    </div>
    <input type="text" name="workerName[]" class="name-input" placeholder="Print Name" />
  `;

  container.appendChild(wrapper);

  const canvas = wrapper.querySelector("canvas");
  const pad = new SignaturePad(canvas, {
    minWidth: 1,
    maxWidth: 2,
    penColor: "black",
  });
}
const supervisorCanvas = document.getElementById("supervisorCanvas");
const supervisorPad = new SignaturePad(supervisorCanvas);
