<template>
  <div class="toggle-container">
    <span class="toggle-label">Dark Mode</span>
    <label class="toggle-switch">
      <input type="checkbox" v-model="darkMode" class="toggle-input" />
      <span class="toggle-slider"></span>
    </label>
  </div>
</template>

<script>
export default {
  data() {
    return {
      darkMode: false,
    };
  },
  watch: {
    darkMode(value) {
      document.documentElement.style.setProperty(
        "--background-color",
        value ? "black" : "white"
      );
      document.documentElement.style.setProperty(
        "--text-color",
        value ? "white" : "black"
      );
    },
  },
};
</script>

<style scoped>
:root {
  --background-color: white;
  --text-color: black;
}

body {
  background-color: var(--background-color);
  color: var(--text-color);
  transition: background-color 0.3s, color 0.3s;
}

.toggle-container {
  display: flex;
  align-items: center;
}

.toggle-label {
  margin-right: 10px;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
}

.toggle-input {
  display: none;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #ccc;
  transition: background-color 0.3s;
}

.toggle-input:checked + .toggle-slider {
  background-color: #2196F3;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  border-radius: 50%;
  transition: 0.4s;
}

.toggle-input:checked + .toggle-slider:before {
  transform: translateX(20px);
}
</style>
