const REF_WIDTH = 2239;
const REF_HEIGHT = 1326;
const DEFAULT_AVATAR_COLOR = "#2B6EC0";
const DEFAULT_AVATAR_TEXT_SIZE_RATIO = 0.64;
const DEFAULT_AVATAR_TEXT_WEIGHT = 500;

function usesDefaultAvatarColor(mode) {
  return mode === "avatar" || mode === "initial";
}

const canvas = document.querySelector("#meetingCanvas");
const ctx = canvas.getContext("2d");
const participantTemplate = document.querySelector("#participantTemplate");
const participantList = document.querySelector("#participantList");

const assetSources = {
  topbarMeetingLogo: "./assets/tencent-original-icons/in_meeting_app_logo.svg",
  speakerMeetingLogo: "./assets/tencent-original-icons/in_meeting_app_logo.svg",
  topbarNetworkGreat: "./assets/tencent-original-icons/topbar_meeting_info_network_great.svg",
  topbarShare: "./assets/tencent-original-icons/topbar_meeting_info_share.svg",
  topbarVideoHdOff: "./assets/tencent-original-icons/bottombar_operation_video_hd_off_normal.svg",
  topbarCloudRecord: "./assets/tencent-original-icons/topbar_record_status_cloud_recording_normal.svg",
  topbarEyeBlind: "./assets/tencent-original-icons/eye_blind_hover.svg",
  topbarLayout: "./assets/tencent-original-icons/topbar_settings_layout.svg",
  topbarArrow: "./assets/tencent-original-icons/topbar_setting_arrow.svg",
  topbarSettings: "./assets/tencent-original-icons/topbar_settings_setting.svg",
  topbarEnterFullscreen: "./assets/tencent-original-icons/topbar_settings_enter_fullscreen.svg",
  windowMin: "./assets/tencent-original-icons/wm_sys_min.png",
  windowMax: "./assets/tencent-original-icons/wm_sys_max.png",
  windowClose: "./assets/tencent-original-icons/wm_sys_close.png",
  sampleLiuTong: "./assets/reference-tiles/liu-tong.png",
  sampleHospital: "./assets/reference-tiles/hospital.png",
  sampleYangGuowei: "./assets/reference-tiles/yang-guowei.png",
  sampleFangXiaoyu: "./assets/reference-tiles/fang-xiaoyu.png",
  sampleCaiChunlin: "./assets/reference-tiles/cai-chunlin.png",
  sampleChenRong: "./assets/reference-tiles/chen-rong.png",
  sampleLiPing: "./assets/reference-tiles/li-ping.png",
  sampleFeige: "./assets/reference-tiles/feige.png",
  sampleYuanLi: "./assets/reference-tiles/yuan-li.png",
  sampleNiFeixiang: "./assets/reference-tiles/ni-feixiang.png",
};

for (let level = 0; level <= 10; level += 1) {
  assetSources[`micLevelWhite${level}`] = `./assets/tencent-original-icons/new_mic_icon_white_small_${level}.png`;
  assetSources[`micLevelDark${level}`] = `./assets/tencent-original-icons/new_mic_icon_small_${level}.png`;
}
assetSources.micLevelWhiteOn = "./assets/tencent-original-icons/new_mic_icon_white_small_on.png";
assetSources.micLevelWhiteOff = "./assets/tencent-original-icons/new_mic_icon_white_small_off.png";
assetSources.micLevelDarkOn = "./assets/tencent-original-icons/new_mic_icon_small_on.png";
assetSources.micLevelDarkOff = "./assets/tencent-original-icons/new_mic_icon_small_off.png";

const assets = {};

const controls = {
  exportBtn: document.querySelector("#exportBtn"),
  sizeSelect: document.querySelector("#sizeSelect"),
  meetingTitleInput: document.querySelector("#meetingTitleInput"),
  elapsedInput: document.querySelector("#elapsedInput"),
  columnsInput: document.querySelector("#columnsInput"),
  speakerInput: document.querySelector("#speakerInput"),
  topBarToggle: document.querySelector("#topBarToggle"),
  speakerToggle: document.querySelector("#speakerToggle"),
  softGridToggle: document.querySelector("#softGridToggle"),
  addParticipantBtn: document.querySelector("#addParticipantBtn"),
  resetBtn: document.querySelector("#resetBtn"),
};

const defaultParticipants = [
  {
    name: "刘彤",
    mode: "camera",
    color: "#f1f4f7",
    muted: false,
    active: true,
    voiceLevel: 6,
    preset: "office",
    sampleAsset: "sampleLiuTong",
  },
  {
    name: "长沙市第一医院",
    mode: "live",
    color: "#dfe8ec",
    muted: false,
    active: false,
    voiceLevel: 2,
    preset: "meeting",
    sampleAsset: "sampleHospital",
  },
  {
    name: "杨国威",
    mode: "initial",
    color: DEFAULT_AVATAR_COLOR,
    muted: true,
    active: false,
    voiceLevel: 0,
    preset: "logo",
    sampleAsset: "sampleYangGuowei",
  },
  {
    name: "方小宇",
    mode: "live",
    color: "#083fa6",
    muted: true,
    active: false,
    voiceLevel: 0,
    preset: "slide",
    sampleAsset: "sampleFangXiaoyu",
  },
  {
    name: "蔡春林",
    mode: "avatar",
    color: DEFAULT_AVATAR_COLOR,
    muted: true,
    active: false,
    voiceLevel: 0,
    preset: "initial",
    sampleAsset: "sampleCaiChunlin",
  },
  {
    name: "陈蓉",
    mode: "avatar",
    color: DEFAULT_AVATAR_COLOR,
    muted: true,
    active: false,
    voiceLevel: 0,
    preset: "initial",
    sampleAsset: "sampleChenRong",
  },
  {
    name: "李苹",
    mode: "avatar",
    color: DEFAULT_AVATAR_COLOR,
    muted: true,
    active: false,
    voiceLevel: 0,
    preset: "initial",
    sampleAsset: "sampleLiPing",
  },
  {
    name: "飞哥传说",
    mode: "avatar",
    color: DEFAULT_AVATAR_COLOR,
    muted: true,
    active: false,
    voiceLevel: 0,
    preset: "initial",
    sampleAsset: "sampleFeige",
  },
  {
    name: "袁立",
    mode: "avatar",
    color: DEFAULT_AVATAR_COLOR,
    muted: true,
    active: false,
    voiceLevel: 0,
    preset: "initial",
    sampleAsset: "sampleYuanLi",
  },
  {
    name: "倪飞祥",
    mode: "avatar",
    color: DEFAULT_AVATAR_COLOR,
    muted: true,
    active: false,
    voiceLevel: 0,
    preset: "initial",
    sampleAsset: "sampleNiFeixiang",
  },
];

let participants = cloneDefaults();

function cloneDefaults() {
  return defaultParticipants.map((item) => ({ ...item }));
}

function scaleX(value) {
  return (value / REF_WIDTH) * canvas.width;
}

function scaleY(value) {
  return (value / REF_HEIGHT) * canvas.height;
}

function setCanvasSize(value) {
  const [width, height] = value.split("x").map(Number);
  canvas.width = width;
  canvas.height = height;
}

function loadAssetImages() {
  const loaders = Object.entries(assetSources).map(([key, src]) => {
    const image = new Image();
    assets[key] = image;

    return new Promise((resolve) => {
      image.addEventListener("load", resolve, { once: true });
      image.addEventListener("error", resolve, { once: true });
      image.src = src;
    });
  });

  return Promise.all(loaders);
}

function drawAsset(key, x, y, width, height, options = {}) {
  const image = assets[key];
  if (!image || !image.complete || !image.naturalWidth) {
    return false;
  }

  ctx.save();
  if (typeof options.alpha === "number") {
    ctx.globalAlpha = options.alpha;
  }
  if (options.filter) {
    ctx.filter = options.filter;
  }
  ctx.drawImage(image, x, y, width, height);
  ctx.restore();
  return true;
}

function drawCroppedAsset(key, x, y, width, height, crop) {
  const image = assets[key];
  if (!image || !image.complete || !image.naturalWidth) {
    return false;
  }

  const sx = crop.left || 0;
  const sy = crop.top || 0;
  const sw = image.naturalWidth - sx - (crop.right || 0);
  const sh = image.naturalHeight - sy - (crop.bottom || 0);
  if (sw <= 0 || sh <= 0) {
    return false;
  }

  ctx.drawImage(image, sx, sy, sw, sh, x, y, width, height);
  return true;
}

function renderParticipantList() {
  participantList.innerHTML = "";

  participants.forEach((participant, index) => {
    const fragment = participantTemplate.content.cloneNode(true);
    const card = fragment.querySelector(".participant-card");
    const indexLabel = fragment.querySelector(".participant-index");
    const removeBtn = fragment.querySelector(".remove-participant");
    const nameInput = fragment.querySelector(".name-input");
    const modeInput = fragment.querySelector(".mode-input");
    const imageInput = fragment.querySelector(".image-input");
    const colorInput = fragment.querySelector(".color-input");
    const voiceInput = fragment.querySelector(".voice-input");
    const mutedInput = fragment.querySelector(".muted-input");
    const activeInput = fragment.querySelector(".active-input");

    indexLabel.textContent = `参会人 ${index + 1}`;
    nameInput.value = participant.name;
    modeInput.value = participant.mode;
    colorInput.value = participant.color;
    voiceInput.value = String(normalizeVoiceLevel(participant.voiceLevel));
    mutedInput.checked = participant.muted;
    activeInput.checked = participant.active;

    nameInput.addEventListener("input", () => {
      participant.name = nameInput.value.trim() || "未命名";
      render();
    });

    modeInput.addEventListener("change", () => {
      participant.mode = modeInput.value;
      if (usesDefaultAvatarColor(participant.mode)) {
        participant.color = DEFAULT_AVATAR_COLOR;
        participant.preset = "initial";
        colorInput.value = DEFAULT_AVATAR_COLOR;
      }
      delete participant.sampleAsset;
      render();
    });

    colorInput.addEventListener("input", () => {
      participant.color = colorInput.value;
      delete participant.sampleAsset;
      render();
    });

    voiceInput.addEventListener("input", () => {
      participant.voiceLevel = normalizeVoiceLevel(voiceInput.value);
      render();
    });

    mutedInput.addEventListener("change", () => {
      participant.muted = mutedInput.checked;
      render();
    });

    activeInput.addEventListener("change", () => {
      participants.forEach((item) => {
        if (item !== participant) {
          item.active = false;
        }
      });
      participant.active = activeInput.checked;
      if (participant.active && !participant.muted && normalizeVoiceLevel(participant.voiceLevel) === 0) {
        participant.voiceLevel = 6;
      }
      renderParticipantList();
      render();
    });

    imageInput.addEventListener("change", () => {
      const [file] = imageInput.files;
      if (!file) {
        return;
      }

      const reader = new FileReader();
      reader.addEventListener("load", () => {
        const image = new Image();
        image.addEventListener("load", () => {
          participant.image = image;
          participant.imageSrc = reader.result;
          delete participant.sampleAsset;
          render();
        });
        image.src = reader.result;
      });
      reader.readAsDataURL(file);
    });

    removeBtn.addEventListener("click", () => {
      participants.splice(index, 1);
      renderParticipantList();
      render();
    });

    card.dataset.mode = participant.mode;
    participantList.appendChild(fragment);
  });
}

function render() {
  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();

  if (controls.topBarToggle.checked) {
    drawTopBar();
  }

  if (controls.speakerToggle.checked) {
    drawSpeakerToast();
  }

  drawGrid();
  ctx.restore();
}

function drawBackground() {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const topHeight = scaleY(53);
  const contentLeft = scaleX(6);
  const contentRight = scaleX(4);
  ctx.fillStyle = "#f7f7f7";
  ctx.fillRect(contentLeft, topHeight, canvas.width - contentLeft - contentRight, canvas.height - topHeight);

  ctx.fillStyle = "#fbfcfd";
  ctx.fillRect(0, 0, canvas.width, topHeight);
  ctx.fillStyle = "#eff1f3";
  ctx.fillRect(0, topHeight - scaleY(1), canvas.width, scaleY(1));
}

function drawTopBar() {
  const y = scaleY(0);
  const height = scaleY(53);
  const leftTextColor = "#d8dbe0";
  const rightTextColor = "#c9c9c9";
  const titleSize = scaleY(18);

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, y, canvas.width, height);
  ctx.fillStyle = "#eff1f3";
  ctx.fillRect(0, height - scaleY(1), canvas.width, scaleY(1));

  drawAsset("topbarMeetingLogo", scaleX(27), scaleY(13), scaleX(30), scaleY(30), { alpha: 0.3 });
  drawText(controls.meetingTitleInput.value, scaleX(63), scaleY(28), {
    size: titleSize,
    color: leftTextColor,
    weight: 500,
    baseline: "middle",
  });

  drawText(controls.elapsedInput.value, scaleX(154), scaleY(28), {
    size: titleSize,
    color: "#d7dad8",
    weight: 500,
    baseline: "middle",
  });

  drawAsset("topbarNetworkGreat", scaleX(217), scaleY(13), scaleX(30), scaleY(30), { alpha: 0.3 });
  drawAsset("topbarShare", scaleX(262), scaleY(13), scaleX(30), scaleY(30), { alpha: 0.18 });
  drawDivider(scaleX(310), scaleY(17), scaleY(20), "#f2f3f4");
  drawAsset("topbarVideoHdOff", scaleX(331), scaleY(12), scaleX(32), scaleY(32), { alpha: 1 });
  drawAsset("topbarCloudRecord", scaleX(377), scaleY(12), scaleX(32), scaleY(32), { alpha: 1 });
  drawAsset("topbarEyeBlind", scaleX(424), scaleY(12), scaleX(32), scaleY(32), { alpha: 1, filter: "brightness(0.72)" });

  drawAsset("topbarLayout", scaleX(1786), scaleY(13), scaleX(30), scaleY(30), { alpha: 0.28 });
  drawText("宫格布局", scaleX(1822), scaleY(28), {
    size: titleSize,
    color: rightTextColor,
    weight: 500,
    baseline: "middle",
  });
  drawAsset("topbarArrow", scaleX(1896), scaleY(18), scaleX(20), scaleY(20), { alpha: 0.28 });
  drawAsset("topbarSettings", scaleX(1937), scaleY(10), scaleX(30), scaleY(30), { alpha: 0.42 });
  drawStatusDot(scaleX(1960), scaleY(18), scaleX(6), "#fdcbc3");
  drawText("设置", scaleX(1973), scaleY(28), {
    size: titleSize,
    color: rightTextColor,
    weight: 500,
    baseline: "middle",
  });
  drawAsset("topbarEnterFullscreen", scaleX(2029), scaleY(13), scaleX(30), scaleY(30), { alpha: 0.28 });
  drawDivider(scaleX(2083), scaleY(15), scaleY(20), "#f2f3f4");
  drawWindowControls();
}

function drawGrid() {
  const cols = clamp(Number(controls.columnsInput.value) || 4, 2, 6);
  const gap = scaleX(3);
  const left = scaleX(6);
  const right = scaleX(4);
  const top = scaleY(211);
  const gridWidth = canvas.width - left - right;
  const tileWidth = (gridWidth - gap * (cols - 1)) / cols;
  const tileHeight = scaleY(312);
  const visibleRows = 3;
  const totalSlots = cols * visibleRows;
  const slots = layoutParticipants(participants.slice(0, totalSlots), cols, visibleRows);

  slots.forEach(({ participant, row, col }) => {
    const x = left + col * (tileWidth + gap);
    const y = top + row * (tileHeight + gap);
    drawParticipantTile(participant, x, y, tileWidth, tileHeight);
  });
}

function layoutParticipants(items, cols, maxRows) {
  const rows = [];
  for (let index = 0; index < items.length; index += cols) {
    rows.push(items.slice(index, index + cols));
  }

  return rows.slice(0, maxRows).flatMap((rowItems, rowIndex) => {
    const isLast = rowIndex === rows.length - 1 && rowItems.length < cols;
    const startCol = isLast ? Math.floor((cols - rowItems.length) / 2) : 0;
    return rowItems.map((participant, itemIndex) => ({
      participant,
      row: rowIndex,
      col: startCol + itemIndex,
    }));
  });
}

function drawEmptyTile(x, y, width, height) {
  ctx.fillStyle = controls.softGridToggle.checked ? "#ededed" : "#e8e8e8";
  ctx.fillRect(x, y, width, height);
}

function drawParticipantTile(participant, x, y, width, height) {
  drawEmptyTile(x, y, width, height);

  const usedReferenceAsset = !participant.image && participant.sampleAsset && drawReferenceTile(participant, x, y, width, height);
  if (usedReferenceAsset) {
    coverReferenceArtifacts(participant, x, y, width, height);
  } else if (participant.image) {
    if (participant.mode === "avatar" || participant.mode === "initial") {
      drawAvatarImage(participant.image, x, y, width, height);
    } else {
      drawCoverImage(participant.image, x, y, width, height);
    }
  } else if (participant.mode === "camera") {
    drawCameraPreset(participant.preset, x, y, width, height);
  } else if (participant.mode === "live") {
    drawLivePreset(participant.preset, x, y, width, height, participant);
  } else if (participant.mode === "avatar") {
    drawAvatarPreset(participant.preset, x, y, width, height, participant);
  } else {
    drawInitialAvatar(participant, x, y, width, height);
  }

  if (participant.active) {
    drawActiveBorder(x, y, width, height);
  }

  drawNamePlate(participant, x, y, width, height);
}

function drawReferenceTile(participant, x, y, width, height) {
  if (participant.sampleAsset === "sampleLiuTong") {
    return drawCroppedAsset(participant.sampleAsset, x, y, width, height, {
      top: 3,
      right: 3,
      bottom: 3,
      left: 3,
    });
  }

  return drawAsset(participant.sampleAsset, x, y, width, height);
}

function coverReferenceArtifacts(participant, x, y, width, height) {
  if (participant.sampleAsset !== "sampleLiuTong") {
    return;
  }

  smoothPatchFromEdges(
    x + width - scaleX(60),
    y + scaleY(8),
    scaleX(52),
    scaleY(46),
  );
}

function smoothPatchFromEdges(x, y, width, height) {
  const patchX = clamp(Math.round(x), 1, canvas.width - 3);
  const patchY = clamp(Math.round(y), 1, canvas.height - 3);
  const patchWidth = clamp(Math.round(width), 1, canvas.width - patchX - 2);
  const patchHeight = clamp(Math.round(height), 1, canvas.height - patchY - 2);
  const image = ctx.getImageData(patchX - 1, patchY - 1, patchWidth + 2, patchHeight + 2);
  const { data } = image;
  const rowWidth = patchWidth + 2;

  for (let row = 1; row <= patchHeight; row += 1) {
    const verticalRate = row / (patchHeight + 1);
    for (let col = 1; col <= patchWidth; col += 1) {
      const horizontalRate = col / (patchWidth + 1);
      const index = (row * rowWidth + col) * 4;
      const left = (row * rowWidth) * 4;
      const right = (row * rowWidth + patchWidth + 1) * 4;
      const top = col * 4;
      const bottom = ((patchHeight + 1) * rowWidth + col) * 4;

      for (let channel = 0; channel < 3; channel += 1) {
        const horizontal = data[left + channel] * (1 - horizontalRate) + data[right + channel] * horizontalRate;
        const vertical = data[top + channel] * (1 - verticalRate) + data[bottom + channel] * verticalRate;
        data[index + channel] = (horizontal + vertical) / 2;
      }
      data[index + 3] = 255;
    }
  }

  ctx.putImageData(image, patchX - 1, patchY - 1);
}

function drawActiveBorder(x, y, width, height) {
  const border = scaleX(3);
  ctx.fillStyle = "#27d08e";
  ctx.fillRect(x, y, width, border);
  ctx.fillRect(x, y + height - border, width, border);
  ctx.fillRect(x, y, border, height);
  ctx.fillRect(x + width - border, y, border, height);
}

function drawCameraPreset(preset, x, y, width, height) {
  if (preset === "office") {
    drawOfficeScene(x, y, width, height);
    return;
  }

  drawLivePreset("meeting", x, y, width, height);
}

function drawLivePreset(preset, x, y, width, height, participant) {
  if (preset === "slide") {
    drawBlueSlide(x, y, width, height);
    return;
  }

  if (preset === "meeting") {
    drawMeetingRoom(x, y, width, height);
    return;
  }

  drawInitialAvatar(participant, x, y, width, height);
}

function drawOfficeScene(x, y, width, height) {
  const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
  gradient.addColorStop(0, "#e7edf2");
  gradient.addColorStop(0.48, "#f4f7f9");
  gradient.addColorStop(1, "#d9e2e9");
  ctx.fillStyle = gradient;
  ctx.fillRect(x, y, width, height);

  ctx.fillStyle = "#eef5f8";
  ctx.fillRect(x + width * 0.03, y + height * 0.05, width * 0.22, height * 0.52);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(x + width * 0.05, y + height * 0.08, width * 0.16, height * 0.42);
  ctx.strokeStyle = "#c3d0dc";
  ctx.lineWidth = scaleX(2);
  ctx.strokeRect(x + width * 0.05, y + height * 0.08, width * 0.16, height * 0.42);
  ctx.beginPath();
  ctx.moveTo(x + width * 0.13, y + height * 0.08);
  ctx.lineTo(x + width * 0.13, y + height * 0.5);
  ctx.moveTo(x + width * 0.05, y + height * 0.29);
  ctx.lineTo(x + width * 0.21, y + height * 0.29);
  ctx.stroke();

  ctx.fillStyle = "#d8e4ea";
  ctx.beginPath();
  ctx.moveTo(x + width * 0.04, y + height * 0.72);
  ctx.lineTo(x + width * 0.36, y + height * 0.56);
  ctx.lineTo(x + width * 0.72, y + height * 0.92);
  ctx.lineTo(x + width * 0.06, y + height * 0.92);
  ctx.closePath();
  ctx.fill();

  for (let index = 0; index < 6; index += 1) {
    const chairX = x + width * (0.18 + index * 0.1);
    const chairY = y + height * (0.66 + (index % 2) * 0.07);
    ctx.fillStyle = "#54708c";
    roundRect(chairX, chairY, width * 0.075, height * 0.16, scaleX(12), true);
  }

  ctx.fillStyle = "#2f628f";
  roundRect(x + width * 0.73, y + height * 0.34, width * 0.18, height * 0.15, scaleX(6), true);
  ctx.fillStyle = "#2d75b7";
  roundRect(x + width * 0.73, y + height * 0.43, width * 0.24, height * 0.15, scaleX(8), true);
  ctx.fillStyle = "#e4d0be";
  ctx.fillRect(x + width * 0.68, y + height * 0.29, width * 0.03, height * 0.32);
  ctx.fillStyle = "#394f65";
  ctx.fillRect(x + width * 0.68, y + height * 0.26, width * 0.13, height * 0.02);

  drawStylizedSpeaker(x + width * 0.17, y + height * 0.22, width * 0.4, height * 0.86);
}

function drawStylizedSpeaker(x, y, width, height) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.clip();

  ctx.fillStyle = "#1b1012";
  ctx.beginPath();
  ctx.ellipse(x + width * 0.48, y + height * 0.19, width * 0.27, height * 0.2, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#e6c2b7";
  ctx.beginPath();
  ctx.ellipse(x + width * 0.52, y + height * 0.31, width * 0.22, height * 0.24, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#2d2f33";
  roundRect(x + width * 0.31, y + height * 0.31, width * 0.42, height * 0.07, scaleX(9), true);
  ctx.fillStyle = "rgba(209, 230, 238, 0.58)";
  roundRect(x + width * 0.33, y + height * 0.315, width * 0.16, height * 0.05, scaleX(7), true);
  roundRect(x + width * 0.55, y + height * 0.315, width * 0.16, height * 0.05, scaleX(7), true);

  ctx.fillStyle = "#941f23";
  ctx.beginPath();
  ctx.ellipse(x + width * 0.52, y + height * 0.48, width * 0.045, height * 0.025, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#f7f8fa";
  ctx.beginPath();
  ctx.moveTo(x + width * 0.21, y + height * 0.64);
  ctx.quadraticCurveTo(x + width * 0.5, y + height * 0.52, x + width * 0.8, y + height * 0.64);
  ctx.lineTo(x + width * 0.92, y + height * 1.04);
  ctx.lineTo(x + width * 0.12, y + height * 1.04);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function drawMeetingRoom(x, y, width, height) {
  const gradient = ctx.createLinearGradient(x, y, x, y + height);
  gradient.addColorStop(0, "#dce9e7");
  gradient.addColorStop(0.55, "#f1f5f1");
  gradient.addColorStop(1, "#d9e2df");
  ctx.fillStyle = gradient;
  ctx.fillRect(x, y, width, height);

  ctx.fillStyle = "#273f4b";
  roundRect(x + width * 0.35, y + height * 0.08, width * 0.32, height * 0.24, scaleX(7), true);
  ctx.fillStyle = "rgba(255,255,255,0.22)";
  ctx.beginPath();
  ctx.ellipse(x + width * 0.5, y + height * 0.19, width * 0.16, height * 0.08, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#b82230";
  ctx.beginPath();
  ctx.moveTo(x + width * 0.2, y + height * 0.6);
  ctx.lineTo(x + width * 0.78, y + height * 0.55);
  ctx.lineTo(x + width * 0.94, y + height * 0.85);
  ctx.lineTo(x + width * 0.1, y + height * 0.88);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#f8f8f6";
  for (let index = 0; index < 8; index += 1) {
    const cardX = x + width * (0.24 + (index % 4) * 0.12);
    const cardY = y + height * (0.62 + Math.floor(index / 4) * 0.1);
    ctx.fillRect(cardX, cardY, width * 0.08, height * 0.035);
  }

  const people = [
    [0.18, 0.5, "#80d9c6"],
    [0.32, 0.42, "#8b6e64"],
    [0.45, 0.4, "#171a1d"],
    [0.57, 0.41, "#324a61"],
    [0.71, 0.45, "#8c715f"],
    [0.82, 0.52, "#f2ece1"],
  ];

  people.forEach(([px, py, shirt]) => {
    ctx.fillStyle = "#d7ad92";
    ctx.beginPath();
    ctx.arc(x + width * px, y + height * py, width * 0.025, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = shirt;
    roundRect(x + width * (px - 0.04), y + height * (py + 0.035), width * 0.08, height * 0.08, scaleX(10), true);
  });

  ctx.fillStyle = "#a5bbc8";
  ctx.fillRect(x + width * 0.03, y + height * 0.78, width * 0.12, height * 0.14);
  ctx.fillStyle = "#b85032";
  ctx.fillRect(x + width * 0.83, y + height * 0.18, width * 0.12, height * 0.34);
}

function drawBlueSlide(x, y, width, height) {
  const gradient = ctx.createRadialGradient(
    x + width * 0.58,
    y + height * 0.72,
    width * 0.04,
    x + width * 0.56,
    y + height * 0.45,
    width * 0.75,
  );
  gradient.addColorStop(0, "#00a7ff");
  gradient.addColorStop(0.38, "#084cc2");
  gradient.addColorStop(1, "#04276f");
  ctx.fillStyle = gradient;
  ctx.fillRect(x, y, width, height);

  ctx.strokeStyle = "rgba(88, 192, 255, 0.42)";
  ctx.lineWidth = scaleX(2);
  for (let i = 0; i < 8; i += 1) {
    ctx.beginPath();
    ctx.arc(x + width * 0.58, y + height * 0.95, width * (0.3 + i * 0.05), Math.PI * 1.08, Math.PI * 1.86);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(255,255,255,0.1)";
  for (let i = 0; i < 70; i += 1) {
    const dotX = x + width * ((i * 37) % 100) / 100;
    const dotY = y + height * ((i * 19) % 100) / 100;
    ctx.fillRect(dotX, dotY, scaleX(3), scaleY(3));
  }

  drawText("药智融合 · 药学人工智能应用", x + width * 0.5, y + height * 0.34, {
    size: height * 0.1,
    color: "#ffffff",
    weight: 900,
    align: "center",
    shadow: true,
  });
  drawText("研讨交流会", x + width * 0.5, y + height * 0.48, {
    size: height * 0.1,
    color: "#ffffff",
    weight: 900,
    align: "center",
    shadow: true,
  });
  drawText("湖南乐城鸿运医疗科技创新发展研究院", x + width * 0.5, y + height * 0.92, {
    size: height * 0.04,
    color: "#ffffff",
    weight: 700,
    align: "center",
  });
}

function drawAvatarImage(image, x, y, width, height) {
  const radius = Math.min(width, height) * 0.27;
  const cx = x + width / 2;
  const cy = y + height / 2;
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();
  drawCoverImage(image, cx - radius, cy - radius, radius * 2, radius * 2);
  ctx.restore();
}

function drawCoverImage(image, x, y, width, height) {
  const imageRatio = image.width / image.height;
  const areaRatio = width / height;
  let sx = 0;
  let sy = 0;
  let sw = image.width;
  let sh = image.height;

  if (imageRatio > areaRatio) {
    sw = image.height * areaRatio;
    sx = (image.width - sw) / 2;
  } else {
    sh = image.width / areaRatio;
    sy = (image.height - sh) / 2;
  }

  ctx.drawImage(image, sx, sy, sw, sh, x, y, width, height);
}

function drawAvatarPreset(preset, x, y, width, height, participant) {
  const radius = Math.min(width, height) * 0.27;
  const cx = x + width / 2;
  const cy = y + height / 2;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();

  if (preset === "rain") {
    drawRainAvatar(cx - radius, cy - radius, radius * 2, radius * 2);
  } else if (preset === "sunset") {
    drawSunsetAvatar(cx - radius, cy - radius, radius * 2, radius * 2);
  } else if (preset === "flower") {
    drawFlowerAvatar(cx - radius, cy - radius, radius * 2, radius * 2);
  } else if (preset === "stone") {
    drawStoneAvatar(cx - radius, cy - radius, radius * 2, radius * 2);
  } else if (preset === "blossom") {
    drawBlossomAvatar(cx - radius, cy - radius, radius * 2, radius * 2);
  } else if (preset === "cartoon") {
    drawCartoonAvatar(cx - radius, cy - radius, radius * 2, radius * 2);
  } else {
    drawInitialAvatar(participant, x, y, width, height);
  }

  ctx.restore();
}

function drawRainAvatar(x, y, width, height) {
  const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
  gradient.addColorStop(0, "#d6e6f1");
  gradient.addColorStop(1, "#8ea4b9");
  ctx.fillStyle = gradient;
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = "#202b35";
  ctx.beginPath();
  ctx.ellipse(x + width * 0.48, y + height * 0.43, width * 0.12, height * 0.18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#1c2731";
  roundRect(x + width * 0.41, y + height * 0.6, width * 0.16, height * 0.28, width * 0.08, true);
  ctx.strokeStyle = "rgba(255,255,255,0.45)";
  ctx.lineWidth = width * 0.02;
  for (let index = 0; index < 8; index += 1) {
    ctx.beginPath();
    ctx.moveTo(x + width * (0.1 + index * 0.12), y + height * 0.05);
    ctx.lineTo(x + width * (0.02 + index * 0.12), y + height * 0.42);
    ctx.stroke();
  }
}

function drawSunsetAvatar(x, y, width, height) {
  const gradient = ctx.createLinearGradient(x, y, x, y + height);
  gradient.addColorStop(0, "#7c95b8");
  gradient.addColorStop(0.45, "#ff8b2c");
  gradient.addColorStop(1, "#121c2b");
  ctx.fillStyle = gradient;
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = "#ffd56a";
  ctx.beginPath();
  ctx.arc(x + width * 0.66, y + height * 0.48, width * 0.16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#171b1d";
  ctx.fillRect(x, y + height * 0.68, width, height * 0.32);
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  for (let index = 0; index < 5; index += 1) {
    ctx.fillRect(x, y + height * (0.58 + index * 0.055), width, height * 0.01);
  }
}

function drawFlowerAvatar(x, y, width, height) {
  ctx.fillStyle = "#395330";
  ctx.fillRect(x, y, width, height);
  for (let index = 0; index < 9; index += 1) {
    const px = x + width * (0.22 + ((index * 23) % 60) / 100);
    const py = y + height * (0.12 + ((index * 29) % 70) / 100);
    drawPetal(px, py, width * 0.12, "#d98aaa");
  }
  ctx.strokeStyle = "#7a4c3f";
  ctx.lineWidth = width * 0.04;
  ctx.beginPath();
  ctx.moveTo(x + width * 0.1, y + height);
  ctx.bezierCurveTo(x + width * 0.32, y + height * 0.48, x + width * 0.58, y + height * 0.43, x + width, y + height * 0.1);
  ctx.stroke();
}

function drawStoneAvatar(x, y, width, height) {
  const gradient = ctx.createLinearGradient(x, y, x, y + height);
  gradient.addColorStop(0, "#ced9ce");
  gradient.addColorStop(1, "#73806b");
  ctx.fillStyle = gradient;
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = "#8e836c";
  roundRect(x + width * 0.18, y + height * 0.38, width * 0.66, height * 0.32, width * 0.13, true);
  ctx.fillStyle = "#405448";
  ctx.fillRect(x + width * 0.32, y + height * 0.5, width * 0.36, height * 0.08);
  ctx.strokeStyle = "#3c473c";
  ctx.lineWidth = width * 0.018;
  for (let index = 0; index < 5; index += 1) {
    ctx.beginPath();
    ctx.moveTo(x + width * (0.08 + index * 0.19), y + height * 0.12);
    ctx.lineTo(x + width * (0.16 + index * 0.17), y + height * 0.5);
    ctx.stroke();
  }
}

function drawBlossomAvatar(x, y, width, height) {
  ctx.fillStyle = "#313332";
  ctx.fillRect(x, y, width, height);
  ctx.strokeStyle = "#693429";
  ctx.lineWidth = width * 0.045;
  ctx.beginPath();
  ctx.moveTo(x, y + height * 0.7);
  ctx.bezierCurveTo(x + width * 0.25, y + height * 0.35, x + width * 0.65, y + height * 0.26, x + width, y + height * 0.04);
  ctx.stroke();
  for (let index = 0; index < 18; index += 1) {
    const px = x + width * (((index * 31) % 100) / 100);
    const py = y + height * (((index * 47) % 90) / 100);
    drawPetal(px, py, width * 0.075, "#dc5f87");
  }
}

function drawCartoonAvatar(x, y, width, height) {
  ctx.fillStyle = "#fff3bd";
  ctx.fillRect(x, y, width, height);
  drawCartoonFace(x + width * 0.36, y + height * 0.55, width * 0.23, "#f6b36f");
  drawCartoonFace(x + width * 0.62, y + height * 0.55, width * 0.23, "#f2b5c0");
  ctx.fillStyle = "#ee6274";
  ctx.beginPath();
  ctx.moveTo(x + width * 0.5, y + height * 0.18);
  ctx.bezierCurveTo(x + width * 0.43, y + height * 0.09, x + width * 0.35, y + height * 0.21, x + width * 0.5, y + height * 0.31);
  ctx.bezierCurveTo(x + width * 0.65, y + height * 0.21, x + width * 0.57, y + height * 0.09, x + width * 0.5, y + height * 0.18);
  ctx.fill();
}

function drawPetal(x, y, radius, color) {
  ctx.fillStyle = color;
  for (let index = 0; index < 5; index += 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((Math.PI * 2 * index) / 5);
    ctx.beginPath();
    ctx.ellipse(radius * 0.45, 0, radius * 0.45, radius * 0.22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.fillStyle = "#e7bf5a";
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.17, 0, Math.PI * 2);
  ctx.fill();
}

function drawCartoonFace(cx, cy, radius, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx - radius * 0.48, cy - radius * 0.7, radius * 0.38, 0, Math.PI * 2);
  ctx.arc(cx + radius * 0.48, cy - radius * 0.7, radius * 0.38, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#6a3f35";
  ctx.beginPath();
  ctx.arc(cx - radius * 0.35, cy - radius * 0.05, radius * 0.08, 0, Math.PI * 2);
  ctx.arc(cx + radius * 0.35, cy - radius * 0.05, radius * 0.08, 0, Math.PI * 2);
  ctx.fill();
}

function drawInitialAvatar(participant, x, y, width, height) {
  const radius = Math.min(width, height) * 0.27;
  const cx = x + width / 2;
  const cy = y + height / 2;
  ctx.fillStyle = participant.color || DEFAULT_AVATAR_COLOR;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  if (participant.preset === "logo") {
    drawText("国威", cx, cy + radius * 0.07, {
      size: radius * 0.52,
      color: "#ffffff",
      weight: 500,
      align: "center",
      baseline: "middle",
    });
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(cx + radius * 0.62, cy + radius * 0.42, radius * 0.29, 0, Math.PI * 2);
    ctx.fill();
    drawText("SynthAsia", cx + radius * 0.62, cy + radius * 0.38, {
      size: radius * 0.085,
      color: "#52606b",
      weight: 700,
      align: "center",
      baseline: "middle",
    });
    drawText("世 亚 药 鑫", cx + radius * 0.62, cy + radius * 0.52, {
      size: radius * 0.075,
      color: "#52606b",
      weight: 700,
      align: "center",
      baseline: "middle",
    });
    return;
  }

  const chars = getAvatarText(participant.name);
  drawCenteredAvatarText(chars, cx, cy, {
    size: radius * DEFAULT_AVATAR_TEXT_SIZE_RATIO,
    color: "#ffffff",
    weight: DEFAULT_AVATAR_TEXT_WEIGHT,
  });
}

function drawNamePlate(participant, x, y, width, height) {
  const plateHeight = scaleY(30);
  const plateMinWidth = scaleX(62);
  const textSize = scaleY(18);
  ctx.font = `500 ${textSize}px ${fontFamily()}`;
  const textWidth = ctx.measureText(participant.name).width;
  const plateWidth = Math.ceil(Math.max(plateMinWidth, textWidth + scaleX(42)));
  const plateX = Math.round(x + scaleX(4));
  const plateY = Math.round(y + height - plateHeight - scaleY(4));
  const alignedPlateHeight = Math.round(plateHeight);
  const isLiveSurface = participant.mode === "live" || participant.mode === "camera";
  const plateAlpha = isLiveSurface ? 0.8 : 0.82;

  ctx.save();
  ctx.globalAlpha = plateAlpha;
  ctx.fillStyle = "#222222";
  ctx.fillRect(plateX, plateY, plateWidth, alignedPlateHeight);
  ctx.restore();

  drawNamePlateMic(participant, plateX + scaleX(5), plateY + scaleY(4));
  drawText(participant.name, plateX + scaleX(31), plateY + alignedPlateHeight / 2 + scaleY(1), {
    size: textSize,
    color: "#ffffff",
    weight: 500,
    baseline: "middle",
  });
}

function drawSpeakerToast() {
  const x = scaleX(1830);
  const y = scaleY(96);
  const width = scaleX(364);
  const height = scaleY(54);
  const textX = x + scaleX(67);
  const textRight = x + width - scaleX(16);

  ctx.save();
  ctx.fillStyle = "#2d3033";
  ctx.fillRect(x, y, width, height);
  ctx.strokeStyle = "rgba(0,0,0,0.45)";
  ctx.strokeRect(x, y, width, height);
  ctx.restore();

  const activeParticipant = participants.find((participant) => participant.active);
  drawSpeakerToastMic(activeParticipant || { muted: false, active: true, voiceLevel: 6 }, x + scaleX(12), y + scaleY(12));

  drawDivider(x + scaleX(55), y + scaleY(12), scaleY(30), "rgba(86, 91, 96, 0.7)");

  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.clip();
  drawAsset("speakerMeetingLogo", x + width - scaleX(62), y - scaleY(6), scaleX(66), scaleY(66), { alpha: 1 });
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.rect(textX, y, Math.max(scaleX(1), textRight - textX), height);
  ctx.clip();
  drawText(controls.speakerInput.value, textX, y + height / 2 + scaleY(1), {
    size: scaleY(18),
    color: "#f4f4f2",
    weight: 400,
    baseline: "middle",
  });
  ctx.restore();
}

function drawNamePlateMic(participant, x, y) {
  const iconSize = scaleX(22);
  if (participant.muted) {
    drawAsset("micLevelWhiteOff", x, y, iconSize, iconSize);
    return;
  }

  const voiceLevel = normalizeVoiceLevel(participant.voiceLevel);
  const assetKey = participant.active ? `micLevelWhite${voiceLevel}` : "micLevelWhiteOn";
  drawAsset(assetKey, x, y, iconSize, iconSize) || drawAsset("micLevelWhiteOn", x, y, iconSize, iconSize);
}

function drawSpeakerToastMic(participant, x, y) {
  const voiceLevel = normalizeVoiceLevel(participant.voiceLevel);
  const assetKey = participant.muted ? "micLevelWhiteOff" : `micLevelWhite${voiceLevel}`;
  const iconSize = scaleX(28);
  drawAsset(assetKey, x, y, iconSize, iconSize) || drawAsset("micLevelWhiteOn", x, y, iconSize, iconSize);
}

function drawWindowControls() {
  drawAsset("windowMin", scaleX(2094), scaleY(7), scaleX(48), scaleY(36), { alpha: 0.5 });
  drawAsset("windowMax", scaleX(2132), scaleY(4), scaleX(55), scaleY(41), { alpha: 0.5 });
  drawAsset("windowClose", scaleX(2178), scaleY(7), scaleX(48), scaleY(36), { alpha: 0.5 });
}

function drawStatusDot(x, y, radius, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawMicIcon(x, y, muted, iconScale = 1) {
  const size = scaleX(24 * iconScale);
  const assetKey = muted ? "micLevelWhiteOff" : "micLevelWhiteOn";
  drawAsset(assetKey, x, y, size, size);
}

function drawDivider(x, y, height, color = "#edf0f2") {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, scaleX(1), height);
}

function drawText(text, x, y, options = {}) {
  ctx.save();
  ctx.font = `${options.weight || 400} ${options.size || scaleY(16)}px ${fontFamily()}`;
  ctx.fillStyle = options.color || "#1c2430";
  ctx.textAlign = options.align || "left";
  ctx.textBaseline = options.baseline || "alphabetic";

  if (options.shadow) {
    ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
    ctx.shadowBlur = scaleX(4);
    ctx.shadowOffsetY = scaleY(2);
  }

  ctx.fillText(text, x, y);
  ctx.restore();
}

function drawCenteredAvatarText(text, x, y, options = {}) {
  ctx.save();
  ctx.font = `${options.weight || 400} ${options.size || scaleY(16)}px ${fontFamily()}`;
  ctx.fillStyle = options.color || "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  const metrics = ctx.measureText(text);
  const hasActualBounds = Number.isFinite(metrics.actualBoundingBoxAscent) && Number.isFinite(metrics.actualBoundingBoxDescent);
  if (hasActualBounds) {
    const left = metrics.actualBoundingBoxLeft || 0;
    const right = metrics.actualBoundingBoxRight || 0;
    const ascent = metrics.actualBoundingBoxAscent || 0;
    const descent = metrics.actualBoundingBoxDescent || 0;
    ctx.fillText(text, x + (left - right) / 2, y + (ascent - descent) / 2);
  } else {
    ctx.textBaseline = "middle";
    ctx.fillText(text, x, y);
  }

  ctx.restore();
}

function getAvatarText(name) {
  const chars = Array.from(String(name || "").trim());
  if (chars.length === 3) {
    return chars.slice(1).join("");
  }
  return chars.slice(0, 2).join("");
}

function roundRect(x, y, width, height, radius, fill) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  if (fill) {
    ctx.fill();
  } else {
    ctx.stroke();
  }
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function normalizeVoiceLevel(value) {
  return clamp(Math.round(Number(value) || 0), 0, 10);
}

function fontFamily() {
  return '"Microsoft YaHei UI", "Microsoft YaHei", "PingFang SC", "Helvetica Neue", Arial, sans-serif';
}

function exportPng() {
  render();
  canvas.toBlob((blob) => {
    if (!blob) {
      return;
    }

    const link = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, "");
    link.href = URL.createObjectURL(blob);
    link.download = `meeting-screenshot-${stamp}.png`;
    link.click();
    URL.revokeObjectURL(link.href);
  }, "image/png");
}

function bindControls() {
  controls.sizeSelect.addEventListener("change", () => {
    setCanvasSize(controls.sizeSelect.value);
    render();
  });

  [
    controls.meetingTitleInput,
    controls.elapsedInput,
    controls.columnsInput,
    controls.speakerInput,
    controls.topBarToggle,
    controls.speakerToggle,
    controls.softGridToggle,
  ].forEach((control) => {
    control.addEventListener("input", render);
    control.addEventListener("change", render);
  });

  controls.addParticipantBtn.addEventListener("click", () => {
    participants.push({
      name: `参会人${participants.length + 1}`,
      mode: "initial",
      color: DEFAULT_AVATAR_COLOR,
      muted: true,
      active: false,
      voiceLevel: 0,
      preset: "initial",
    });
    renderParticipantList();
    render();
  });

  controls.resetBtn.addEventListener("click", () => {
    participants = cloneDefaults();
    renderParticipantList();
    render();
  });

  controls.exportBtn.addEventListener("click", exportPng);
}

setCanvasSize(controls.sizeSelect.value);
bindControls();
renderParticipantList();
loadAssetImages().then(render);
