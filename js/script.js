async function adjustScrollspyBehavior() {
    const scrollspy = document.getElementById('navbar-example3');
    const footer = document.querySelector('footer');
    const footerOffsetTop = footer.offsetTop;
    const scrollspyHeight = scrollspy.offsetHeight;
    const scrollOffset = window.scrollY;

    if (scrollOffset + scrollspyHeight >= footerOffsetTop) {
        // Detener scrollspy antes del footer
        scrollspy.classList.add('sticky-stop');
        scrollspy.style.top = `${footerOffsetTop - scrollspyHeight}px`;
    } else {
        // Scrollspy fijo en su lugar
        scrollspy.classList.remove('sticky-stop');
        scrollspy.style.top = '0';
    }
}

window.addEventListener('scroll', adjustScrollspyBehavior);
window.addEventListener('resize', adjustScrollspyBehavior);
document.addEventListener('DOMContentLoaded', adjustScrollspyBehavior);