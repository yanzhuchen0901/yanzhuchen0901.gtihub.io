// 专注计时器页面的JavaScript逻辑

let focusBtn = null;
let timerText = null;
let timerDisplay = null;

let focusTimer = null;
let focusSeconds = 0;
let isTimerRunning = false;
let isTimerActive = false;
let currentFocusTask = '';

// 初始化
function initFocusPage() {
    focusBtn = document.getElementById('focusBtn');
    timerText = document.getElementById('timerText');
    timerDisplay = document.getElementById('focusTimerDisplay');

    if (!focusBtn || !timerText || !timerDisplay) {
        console.error('Failed to get required DOM elements');
        return;
    }

    focusBtn.addEventListener('click', toggleFocusTimer);
    updateTimerDisplay();
}

// 开始/继续 计时器
function startOrResumeFocusTimer() {
    if (isTimerRunning) return;

    isTimerRunning = true;
    focusBtn.classList.add('timing');

    focusTimer = setInterval(() => {
        focusSeconds++;
        updateTimerDisplay();
    }, 1000);
}

// 暂停计时器
function pauseFocusTimer() {
    if (focusTimer) {
        clearInterval(focusTimer);
    }
    isTimerRunning = false;
    focusBtn.classList.remove('timing');
}

// 切换计时器状态
function toggleFocusTimer() {
    if (!isTimerActive) {
        // 第一次点击，激活计时器
        const taskInput = prompt('输入本次专注的任务：', '工作专注');
        if (taskInput === null) return;

        currentFocusTask = taskInput || '专注工作';
        focusSeconds = 0;
        isTimerActive = true;
        focusBtn.classList.add('active');
        timerDisplay.classList.add('active');

        startOrResumeFocusTimer();
    } else if (isTimerRunning) {
        // 计时中，停止并保存
        pauseFocusTimer();
        completeFocusSession();
    }
}

// 重置计时器
function resetFocusTimer() {
    if (focusTimer) {
        clearInterval(focusTimer);
    }

    focusSeconds = 0;
    isTimerRunning = false;
    isTimerActive = false;

    focusBtn.classList.remove('active');
    focusBtn.classList.remove('timing');
    timerDisplay.classList.remove('active');

    updateTimerDisplay();
}

// 完成一次专注会话
function completeFocusSession() {
    const duration = Math.round(focusSeconds / 60);

    // 如果时长为0，不保存
    if (duration === 0) {
        alert('最少需要专注1分钟才能记录');
        resetFocusTimer();
        return;
    }

    // 保存专注数据到localStorage
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    // 获取或创建今天的记录
    let record = getRecord(dateStr);

    // 添加本次专注时长
    if (!record.focus_sessions) {
        record.focus_sessions = [];
    }

    record.focus_sessions.push({
        task: currentFocusTask,
        duration: duration,
        timestamp: new Date().toLocaleTimeString()
    });

    // 保存记录
    saveRecordData(dateStr, record);

    // 显示完成提示
    alert(`✅ 专注完成！\n任务：${currentFocusTask}\n时长：${duration}分钟\n📊 记录已保存到今日记录`);

    // 重置
    resetFocusTimer();
}

// 更新计时器显示
function updateTimerDisplay() {
    const minutes = Math.floor(focusSeconds / 60);
    const seconds = focusSeconds % 60;
    timerText.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', initFocusPage);

// ESC 键快捷键
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isTimerActive) {
        if (confirm('确定要退出计时吗？')) {
            resetFocusTimer();
        }
    }
});