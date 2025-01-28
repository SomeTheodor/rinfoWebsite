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

function createElementByType(subItem) {
    let element;

    switch (subItem.type) {
        case 'paragraph':
            element = document.createElement('p');
            element.className = 'mb-3';
            element.innerHTML = subItem.content.replace(/\n/g, '<br><br>');
            break;

        case 'code':
            element = document.createElement('pre');
            element.className = 'code-block p-3';
            const code = document.createElement('code');
            code.textContent = subItem.content;
            element.appendChild(code);
            break;

        case 'list':
            element = document.createElement('ul');
            subItem.content.forEach(listItem => {
                const li = document.createElement('li');
                li.innerHTML = listItem.replace(/\n/g, '<br>');
                element.appendChild(li);
            });
            break;

        case 'table':
            element = document.createElement('table');
            element.className = 'table table-striped mb-4';
            const tableBody = document.createElement('tbody');

            subItem.content.forEach(row => {
                const tr = document.createElement('tr');
                row.forEach(cell => {
                    const td = document.createElement('td');
                    td.innerHTML = cell;
                    tr.appendChild(td);
                });
                tableBody.appendChild(tr);
            });

            element.appendChild(tableBody);
            break;

        case 'secondarySubtitle':
            const secondarySubtitleId = subItem.content.replace(/\s+/g, '-').toLowerCase();
            element = document.createElement('h3');
            element.className = 'mb-3 text-secondary';
            element.id = secondarySubtitleId;
            element.textContent = subItem.content;
            break;

        default:
            console.warn(`Tipo desconocido: ${subItem.type}`);
            return null;
    }

    return element;
}

async function loadDynamicContent() {
    try {
        const response = await fetch('/assets/data.json');
        if (!response.ok) throw new Error(`Error al cargar JSON: ${response.status} ${response.statusText}`);

        const jsonData = await response.json();

        // Referencias a los contenedores
        const navbar = document.querySelector('#navbar-example3 .nav');
        const offcanvasNav = document.querySelector("#scrollspyMenu .offcanvas-body .nav");
        const content = document.querySelector('.scrollspy-example-2');

        // Limpiar contenido previo
        [navbar, offcanvasNav, content].forEach(el => el.innerHTML = "");

        const fragment = document.createDocumentFragment();

        jsonData.forEach(item => {
            if (item.type === 'title') {
                const titleId = item.content.replace(/\s+/g, '-').toLowerCase();

                // Crear título en el contenido
                const titleElement = document.createElement('h1');
                titleElement.className = 'mb-4 text-primary';
                titleElement.id = titleId;
                titleElement.textContent = item.content;
                fragment.appendChild(titleElement);

                // Procesar elementos del título
                if (item.elements) {
                    item.elements.forEach(subItem => {
                        const element = createElementByType(subItem);
                        if (element) fragment.appendChild(element);
                    });
                }

                // Crear enlace del título en el scrollspy
                const navItem = document.createElement('li');
                navItem.className = 'nav-item';

                const navLink = document.createElement('a');
                navLink.className = 'nav-link';
                navLink.href = `#${titleId}`;
                navLink.textContent = item.content;
                navItem.appendChild(navLink);

                // Crear lista de subtítulos (si existen)
                if (item.subtitles && item.subtitles.length > 0) {
                    const subtitleList = document.createElement('ul');
                    subtitleList.className = 'nav flex-column ms-3';

                    item.subtitles.forEach(subtitle => {
                        const subtitleId = subtitle.content.replace(/\s+/g, '-').toLowerCase();

                        // Crear subtítulo en el contenido
                        const subtitleElement = document.createElement('h2');
                        subtitleElement.className = 'mb-3 text-secondary';
                        subtitleElement.id = subtitleId;
                        subtitleElement.textContent = subtitle.content;
                        fragment.appendChild(subtitleElement);

                        // Procesar elementos del subtítulo
                        if (subtitle.elements) {
                            subtitle.elements.forEach(subItem => {
                                const element = createElementByType(subItem);
                                if (element) {
                                    // Renderizar el contenido normalmente
                                    fragment.appendChild(element);

                                    // Si el elemento es un secondarySubtitle, no lo agregamos al scrollspy
                                    if (subItem.type === 'secondarySubtitle') {
                                        return;
                                    }
                                }
                            });
                        }

                        // Crear enlace del subtítulo en el scrollspy
                        const subtitleNavItem = document.createElement('li');
                        subtitleNavItem.className = 'nav-item';

                        const subtitleNavLink = document.createElement('a');
                        subtitleNavLink.className = 'nav-link';
                        subtitleNavLink.href = `#${subtitleId}`;
                        subtitleNavLink.textContent = subtitle.content;
                        subtitleNavItem.appendChild(subtitleNavLink);

                        subtitleList.appendChild(subtitleNavItem);
                    });

                    // Anidar la lista de subtítulos al elemento del título en el scrollspy
                    navItem.appendChild(subtitleList);
                }

                // Agregar el elemento del título al scrollspy
                navbar.appendChild(navItem);
                offcanvasNav.appendChild(navItem.cloneNode(true));
            }
        });

        content.appendChild(fragment);

        // Reactivar el scrollspy después de cargar contenido dinámico
        bootstrap.ScrollSpy.getInstance(document.body)?.dispose();
        new bootstrap.ScrollSpy(document.body, { target: '#navbar-example3', offset: 100 });

        // Cerrar offcanvas al hacer clic en un enlace
        const offcanvasElement = document.getElementById('scrollspyMenu');
        const offcanvasInstance = bootstrap.Offcanvas.getOrCreateInstance(offcanvasElement);

        offcanvasNav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => offcanvasInstance.hide());
        });

    } catch (error) {
        console.error('Error al cargar contenido dinámico:', error);
    }
}

// Cargar contenido al iniciar
loadDynamicContent();