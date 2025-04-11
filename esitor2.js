.workflow-editor {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
}

.palette {
  padding: 10px;
  background: #f0f0f0;
  border: 1px solid #ccc;
  width: 150px;
}

.step {
  padding: 10px;
  background: #007bff;
  color: white;
  text-align: center;
  cursor: move;
  margin-bottom: 10px;
  user-select: none;
}

.canvas {
  flex-grow: 1;
}

.controls {
  display: flex;
  gap: 10px;
}

button {
  padding: 8px 16px;
  background: #dc3545;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background: #c82333;
}

/* Ensure JointJS elements are styled correctly */
.joint-paper {
  background-color: #f8f9fa;
}