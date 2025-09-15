// js/device-modal.js

import { qs } from "./utils.js";

let modal, modalContent, closeBtn;
let currentDevice = null;
let updateInterval = null;

export function initDeviceModal() {
  modal = qs("#deviceModal");
  modalContent = qs(".device-modal-content");
  closeBtn = qs(".device-modal-close");

  // Close modal events
  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // ESC key to close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.style.display === "block") {
      closeModal();
    }
  });
}

export function showDeviceModal(device) {
  currentDevice = device;
  
  // Update modal content
  qs("#modalDeviceName").textContent = device.name || "Thiết bị";
  updateModalContent();
  // Add warning banner to modal if not exists
  if (!qs("#deviceWarning")) {
    const warningEl = document.createElement("div");
    warningEl.id = "deviceWarning";
    warningEl.className = "device-warning";
    warningEl.innerHTML = `<span class="warning-icon">⚠️</span><span class="warning-text"></span>`;
    
    const modalBody = qs(".device-modal-body");
    modalBody.parentNode.insertBefore(warningEl, modalBody);
  }
  // Show modal
  modal.style.display = "block";
  
  // Start real-time updates
  startRealtimeUpdate();
}

function updateModalContent() {
  if (!currentDevice) return;

  const statusEl = qs("#modalDeviceStatus");
  const lastUpdatedEl = qs("#modalLastUpdated");
  const onTimeEl = qs("#modalOnTime");
  const offTimeEl = qs("#modalOffTime");
  const onTimeLabelEl = qs("#modalOnTimeLabel");
  const offTimeLabelEl = qs("#modalOffTimeLabel");

  // Update status
  statusEl.textContent = currentDevice.status ? "BẬT" : "TẮT";
  statusEl.className = `device-status-badge ${currentDevice.status ? "status-on" : "status-off"}`;

  // Update last action time
  if (currentDevice.lastUpdated) {
    const lastUpdatedDate = currentDevice.lastUpdated.toDate ? 
      currentDevice.lastUpdated.toDate() : 
      new Date(currentDevice.lastUpdated);
    lastUpdatedEl.textContent = formatDateTime(lastUpdatedDate);
  } else {
    lastUpdatedEl.textContent = "--";
  }

  // Calculate and update duration
  const now = new Date();
  const lastUpdated = currentDevice.lastUpdated ? 
    (currentDevice.lastUpdated.toDate ? currentDevice.lastUpdated.toDate() : new Date(currentDevice.lastUpdated)) :
    null;

  if (lastUpdated) {
    const duration = calculateDuration(lastUpdated, now);
    // Check for 8-hour warning
    const warningEl = qs("#deviceWarning");
    if (warningEl && lastUpdated && currentDevice.status) {
      const diffMs = now.getTime() - lastUpdated.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      
      if (diffHours > 8) {
        const warningText = qs("#deviceWarning .warning-text");
        warningText.textContent = `${currentDevice.name || "Thiết bị"} đã bật quá 8 giờ!`;
        warningEl.style.display = "block";
      } else {
        warningEl.style.display = "none";
      }
    } else if (warningEl) {
      warningEl.style.display = "none";
    }
    if (currentDevice.status) {
      // Device is ON
      onTimeEl.textContent = duration;
      onTimeEl.className = "device-duration active";
      offTimeEl.textContent = "--";
      offTimeEl.className = "device-duration inactive";
    } else {
      // Device is OFF
      offTimeEl.textContent = duration;
      offTimeEl.className = "device-duration active";
      onTimeEl.textContent = "--";
      onTimeEl.className = "device-duration inactive";
    }
  } else {
    onTimeEl.textContent = "--";
    offTimeEl.textContent = "--";
    onTimeEl.className = "device-duration inactive";
    offTimeEl.className = "device-duration inactive";
  }
}

function calculateDuration(startTime, endTime) {
  const diffMs = endTime.getTime() - startTime.getTime();
  
  if (diffMs < 0) return "--";
  
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
  
  if (days > 0) {
    return `${days}d ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}

function formatDateTime(date) {
  if (!date) return "--";
  
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  const timeStr = date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  if (diffDays === 0) {
    return `Hôm nay ${timeStr}`;
  } else if (diffDays === 1) {
    return `Hôm qua ${timeStr}`;
  } else if (diffDays <= 7) {
    return `${diffDays} ngày trước ${timeStr}`;
  } else {
    return date.toLocaleDateString('vi-VN') + ' ' + timeStr;
  }
}

function startRealtimeUpdate() {
  // Clear any existing interval
  if (updateInterval) {
    clearInterval(updateInterval);
  }
  
  // Update every second
  updateInterval = setInterval(() => {
    if (currentDevice && modal.style.display === "block") {
      updateModalContent();
    }
  }, 1000);
}

function closeModal() {
  modal.style.display = "none";
  currentDevice = null;
  
  // Clear update interval
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
  }
}

// Function to be called when device data updates
export function updateCurrentDevice(updatedDevice) {
  if (currentDevice && currentDevice.id === updatedDevice.id) {
    currentDevice = updatedDevice;
    updateModalContent();
  }
}

