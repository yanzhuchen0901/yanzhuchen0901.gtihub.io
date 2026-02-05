window.addEventListener("scroll", () => {
    const hero = document.getElementById("hero");
    const header = document.getElementById("site-header");

    const scrollY = window.scrollY;
    const fadeDistance = window.innerHeight;

    // Hero 渐隐
    let opacity = 1 - scrollY / fadeDistance;
    if (opacity < 0) opacity = 0;
    hero.style.opacity = opacity;

    // Header 在渐变一半出现
    if (scrollY > fadeDistance / 2) {
        header.classList.remove("hidden");
        header.classList.add("visible");
    } else {
        header.classList.remove("visible");
        header.classList.add("hidden");
    }
});