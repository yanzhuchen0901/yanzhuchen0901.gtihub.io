// 光影留痕 - 画廊管理系统
// 完全前端实现，使用 localStorage 存储图片和评注

const GALLERY_KEY = 'gallery_images_v1';
const MAX_IMAGES = 25; // 5x5网格
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

let currentImageId = null;

class Gallery {
    constructor() {
        this.images = this.loadImages();
        this.init();
    }

    init() {
        this.attachEventListeners();
        this.render();
    }

    // 从 localStorage 加载图片
    loadImages() {
        try {
            const stored = localStorage.getItem(GALLERY_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Failed to load images:', e);
            return [];
        }
    }

    // 保存图片到 localStorage
    saveImages() {
        try {
            localStorage.setItem(GALLERY_KEY, JSON.stringify(this.images));
        } catch (e) {
            console.error('Failed to save images:', e);
            alert('⚠️ 保存失败：浏览器存储空间不足\n建议清除部分图片或清空浏览器缓存');
        }
    }

    // 绑定事件监听器
    attachEventListeners() {
        // 上传图片
        const imageUpload = document.getElementById('imageUpload');
        imageUpload.addEventListener('change', (e) => this.handleImageUpload(e));

        // 清空所有
        const clearAllBtn = document.getElementById('clearAllBtn');
        clearAllBtn.addEventListener('click', () => this.clearAll());

        // Modal 关闭
        const modal = document.getElementById('imageModal');
        const closeBtn = document.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => this.closeModal());

        // 点击Modal背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });

        // 删除按钮
        const deleteBtn = document.getElementById('deleteBtn');
        deleteBtn.addEventListener('click', () => this.deleteImage(currentImageId));

        // 编辑评注
        const editCommentBtn = document.getElementById('editCommentBtn');
        editCommentBtn.addEventListener('click', () => this.editComment(currentImageId));
    }

    // 处理图片上传
    handleImageUpload(e) {
        const files = Array.from(e.target.files);

        if (files.length === 0) return;

        // 检查是否超过容量
        const availableSlots = MAX_IMAGES - this.images.length;
        if (availableSlots <= 0) {
            alert('❌ 画廊已满（最多 25 张），请删除部分图片后重试');
            return;
        }

        if (files.length > availableSlots) {
            alert(`⚠️ 仅可上传 ${availableSlots} 张（还有 ${availableSlots} 个位置）`);
        }

        // 处理每张图片
        files.slice(0, availableSlots).forEach(file => {
            this.processFile(file);
        });

        // 重置 input
        e.target.value = '';
    }

    // 处理单个文件
    processFile(file) {
        // 检查文件大小
        if (file.size > MAX_FILE_SIZE) {
            alert(`❌ 图片过大：${file.name}（超过 5MB 限制）`);
            return;
        }

        // 检查文件类型
        if (!file.type.startsWith('image/')) {
            alert(`❌ 非图片文件：${file.name}`);
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const id = Date.now() + Math.random();
            const imageData = {
                id,
                data: e.target.result, // Base64 编码的图片
                comment: '',
                createdAt: new Date().toISOString(),
                fileName: file.name
            };

            this.images.unshift(imageData); // 新图片放在最前
            this.saveImages();
            this.render();
        };

        reader.onerror = () => {
            alert(`❌ 读取文件失败：${file.name}`);
        };

        reader.readAsDataURL(file);
    }

    // 删除图片
    deleteImage(id) {
        if (!confirm('确定要删除这张图片吗？')) {
            return;
        }

        this.images = this.images.filter(img => img.id !== id);
        this.saveImages();
        this.closeModal();
        this.render();
    }

    // 编辑评注
    editComment(id) {
        const image = this.images.find(img => img.id === id);
        if (!image) return;

        const newComment = prompt('编辑评注（最多100字）:', image.comment || '');

        if (newComment === null) return; // 用户取消

        const trimmedComment = newComment.trim().slice(0, 100);
        image.comment = trimmedComment;
        this.saveImages();

        // 更新 Modal 中的评注显示
        document.getElementById('modalComment').textContent = trimmedComment || '暂无评注';
    }

    // 打开 Modal
    openModal(id) {
        const image = this.images.find(img => img.id === id);
        if (!image) return;

        currentImageId = id;

        const modal = document.getElementById('imageModal');
        const modalImage = document.getElementById('modalImage');
        const modalComment = document.getElementById('modalComment');

        modalImage.src = image.data;
        modalImage.alt = image.fileName;
        modalComment.textContent = image.comment || '暂无评注';

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // 关闭 Modal
    closeModal() {
        const modal = document.getElementById('imageModal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        currentImageId = null;
    }

    // 清空所有图片
    clearAll() {
        if (!confirm('确定要清空所有图片吗？(此操作不可逆)')) {
            return;
        }

        this.images = [];
        this.saveImages();
        this.render();
    }

    // 渲染画廊
    render() {
        const gallery = document.getElementById('gallery');
        const emptyMessage = document.getElementById('emptyMessage');

        // 显示/隐藏空状态提示
        if (this.images.length === 0) {
            emptyMessage.style.display = 'block';
            gallery.innerHTML = '';
            return;
        }

        emptyMessage.style.display = 'none';
        gallery.innerHTML = '';

        // 创建 5x5 网格（25 个位置）
        for (let i = 0; i < MAX_IMAGES; i++) {
            const cell = document.createElement('div');
            cell.className = 'gallery-cell';

            if (i < this.images.length) {
                const image = this.images[i];

                // 图片缩略图
                const img = document.createElement('img');
                img.src = image.data;
                img.alt = image.fileName;
                img.className = 'gallery-image';
                img.addEventListener('click', () => this.openModal(image.id));

                cell.appendChild(img);

                // 评注显示
                if (image.comment) {
                    const comment = document.createElement('div');
                    comment.className = 'gallery-comment';
                    comment.textContent = image.comment;
                    comment.title = image.comment; // 悬停显示完整文本
                    cell.appendChild(comment);
                }
            } else {
                // 空位置
                const placeholder = document.createElement('div');
                placeholder.className = 'gallery-placeholder';
                placeholder.textContent = '+';
                cell.appendChild(placeholder);
            }

            gallery.appendChild(cell);
        }
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    new Gallery();
});