async function loadDynamicContent() {
    try {
        const response = await fetch('/assets/data.json');
        if (!response.ok) {
            throw new Error(`Error al cargar JSON: ${response.status} ${response.statusText}`);
        }

        const jsonData = await response.json();

        // Referencias a los contenedores
        const navbar = document.getElementById('navbar-example3').querySelector('.nav');
        const offcanvasNav = document.querySelector("#scrollspyMenu .offcanvas-body .nav");
        const content = document.querySelector('.scrollspy-example-2');

        // Limpiar contenido previo
        navbar.innerHTML = "";
        offcanvasNav.innerHTML = "";
        content.innerHTML = "";

        jsonData.forEach((item, index) => {
            let element;
            let navLink;

            switch (item.type) {
                case 'title':
                    const titleId = item.content.replace(/\s+/g, '-').toLowerCase(); // ID único

                    // Crear el enlace en el scrollspy (escritorio)
                    navLink = document.createElement('a');
                    navLink.className = 'nav-link';
                    navLink.href = `#${titleId}`;
                    navLink.textContent = item.content;
                    navbar.appendChild(navLink);

                    // Crear el enlace en el offcanvas (móvil)
                    const offcanvasLink = navLink.cloneNode(true);
                    offcanvasNav.appendChild(offcanvasLink);

                    // Crear el título en el contenido
                    element = document.createElement('h1');
                    element.className = 'mb-4 text-primary';
                    element.id = titleId;
                    element.textContent = item.content;
                    content.appendChild(element);
                    break;

                case 'paragraph':
                    element = document.createElement('p');
                    element.className = 'mb-3';
                    element.textContent = item.content;
                    content.appendChild(element);
                    break;

                case 'code':
                    element = document.createElement('pre');
                    element.className = 'code-block p-3';
                    const code = document.createElement('code');
                    code.textContent = item.content;
                    element.appendChild(code);
                    content.appendChild(element);
                    break;

                case 'list':
                    element = document.createElement('ul');
                    element.className = 'list-group mb-3';
                    item.content.forEach(listItem => {
                        const li = document.createElement('li');
                        li.className = 'list-group-item';
                        li.textContent = listItem;
                        element.appendChild(li);
                    });
                    content.appendChild(element);
                    break;

                default:
                    console.warn(`Tipo desconocido: ${item.type}`);
                    return;
            }
        });

        // Reactivar el scrollspy después de cargar contenido dinámico
        bootstrap.ScrollSpy.getInstance(document.body)?.dispose();
        new bootstrap.ScrollSpy(document.body, {
            target: '#navbar-example3',
            offset: 100
        });

        // Cerrar offcanvas al hacer clic en un enlace
        const offcanvasElement = document.getElementById('scrollspyMenu');
        const offcanvasInstance = bootstrap.Offcanvas.getOrCreateInstance(offcanvasElement);

        offcanvasNav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                offcanvasInstance.hide(); // Cierra el offcanvas al hacer clic
            });
        });

    } catch (error) {
        console.error('Error al cargar contenido dinámico:', error);
    }
}

// Cargar contenido al iniciar
loadDynamicContent();
