// LocalStorage 数据管理

const RECORDS_PREFIX = 'daily_record_';
const QUICKNAV_KEY = 'quicknav_links_v1';

/**
 * 获取指定日期的记录
 */
function getRecord(dateStr) {
    const key = RECORDS_PREFIX + dateStr;
    const stored = localStorage.getItem(key);

    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error('Failed to parse record:', e);
        }
    }

    // 返回默认记录
    return {
        date: dateStr,
        keywords: [],
        today_done: '',
        tomorrow_plan: [],
        insights: '',
        todos: [],
        focus_sessions: []
    };
}

/**
 * 保存指定日期的记录
 */
function saveRecordData(dateStr, data) {
    const key = RECORDS_PREFIX + dateStr;
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error('Failed to save record:', e);
        alert('⚠️ 保存失败：浏览器存储空间不足');
    }
}

/**
 * 获取热图数据（所有有记录的日期及其记录数）
 */
function getHeatmapData() {
    const counts = {};

    // 遍历所有localStorage key
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        // 检查是否是记录key
        if (key && key.startsWith(RECORDS_PREFIX)) {
            const dateStr = key.substring(RECORDS_PREFIX.length);

            // 验证日期格式 (YYYY-MM-DD)
            if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
                try {
                    const data = JSON.parse(localStorage.getItem(key));

                    // 计算该日期有多少条数据（非空字段数）
                    let count = 0;
                    if (data.keywords && data.keywords.length > 0) count++;
                    if (data.today_done && data.today_done.trim()) count++;
                    if (data.tomorrow_plan && data.tomorrow_plan.length > 0) count++;
                    if (data.insights && data.insights.trim()) count++;
                    if (data.todos && data.todos.length > 0) count++;
                    if (data.focus_sessions && data.focus_sessions.length > 0) count++;

                    if (count > 0) {
                        counts[dateStr] = count;
                    }
                } catch (e) {
                    console.error('Failed to parse heatmap data:', e);
                }
            }
        }
    }

    return counts;
}

/**
 * 获取快速导航链接
 */
function getQuickNav() {
    const stored = localStorage.getItem(QUICKNAV_KEY);

    try {
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error('Failed to parse quicknav:', e);
        return [];
    }
}

/**
 * 保存快速导航链接
 */
function saveQuickNav(links) {
    try {
        localStorage.setItem(QUICKNAV_KEY, JSON.stringify(links));
    } catch (e) {
        console.error('Failed to save quicknav:', e);
        alert('⚠️ 保存失败：浏览器存储空间不足');
    }
}

/**
 * 导出所有记录为JSON（备份功能）
 */
function exportAllRecordsAsJSON() {
    const allRecords = {};

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        if (key && key.startsWith(RECORDS_PREFIX)) {
            const dateStr = key.substring(RECORDS_PREFIX.length);
            allRecords[dateStr] = JSON.parse(localStorage.getItem(key));
        }
    }

    const blob = new Blob([JSON.stringify(allRecords, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `all_records_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * 从JSON文件导入记录（恢复备份功能）
 */
function importRecordsFromJSON(file) {
    const reader = new FileReader();

    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            let count = 0;

            for (const [dateStr, record] of Object.entries(data)) {
                if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
                    saveRecordData(dateStr, record);
                    count++;
                }
            }

            alert(`✅ 成功导入 ${count} 条记录！`);
            window.location.reload();
        } catch (e) {
            alert('❌ 导入失败：文件格式错误或无法解析');
            console.error('Import error:', e);
        }
    };

    reader.readAsText(file);
}

/**
 * 清除所有数据（谨慎使用）
 */
function clearAllData() {
    if (confirm('⚠️ 确定要清除所有数据吗？此操作无法撤销！')) {
        const keysToDelete = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.startsWith(RECORDS_PREFIX) || key === QUICKNAV_KEY)) {
                keysToDelete.push(key);
            }
        }

        keysToDelete.forEach(key => localStorage.removeItem(key));
        alert('✅ 已清除所有数据');
        window.location.reload();
    }
}