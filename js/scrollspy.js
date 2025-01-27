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
                    let element;

                    switch (item.type) {
                        case 'title':
                        case 'subtitle': {
                            const titleId = item.content.replace(/\s+/g, '-').toLowerCase();

                            // Crear título o subtítulo en contenido
                            element = document.createElement(item.type === 'title' ? 'h1' : 'h2');
                            element.className = item.type === 'title' ? 'mb-4 text-primary' : 'mb-3 text-secondary';
                            element.id = titleId;
                            element.textContent = item.content;
                            fragment.appendChild(element);

                            // Crear enlaces para scrollspy y offcanvas
                            const navLink = document.createElement('a');
                            navLink.className = 'nav-link';
                            navLink.href = `#${titleId}`;
                            navLink.textContent = item.content;

                            [navbar, offcanvasNav].forEach(nav => nav.appendChild(navLink.cloneNode(true)));
                            break;
                        }
                        case 'paragraph':
                            element = document.createElement('p');
                            element.className = 'mb-3';
                            element.innerHTML = item.content.replace(/\n/g, '<br><br>');
                            fragment.appendChild(element);
                            break;

                        case 'code':
                            element = document.createElement('pre');
                            element.className = 'code-block p-3';
                            const code = document.createElement('code');
                            code.textContent = item.content;
                            element.appendChild(code);
                            fragment.appendChild(element);
                            break;

                        case 'list':
                            element = document.createElement('ul');
                            item.content.forEach(listItem => {
                                const li = document.createElement('li');
                                li.innerHTML = listItem.replace(/\n/g, '<br>');
                                element.appendChild(li);
                            });
                            fragment.appendChild(element);
                            break;

                        default:
                            console.warn(`Tipo desconocido: ${item.type}`);
                            return;
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