async function loadContent() {
    try {
        // Cargar JSON desde un archivo externo
        const response = await fetch('/assets/data.json');
        const jsonData = await response.json();

        const contentContainer = document.getElementById('content');

        // Generar HTML dinámico
        jsonData.forEach(item => {
            let element;
            switch (item.type) {
                case "title":
                    element = document.createElement('h1');
                    element.className = 'title ';
                    element.textContent = item.content;
                    break;
                case "paragraph":
                    element = document.createElement('p');
                    element.className = 'text-secondary fs-5';
                    element.textContent = item.content;
                    break;
                case "code":
                    element = document.createElement('pre');
                    element.className = 'code-block';
                    element.textContent = item.content;
                    break;
                case "list":
                    element = document.createElement('ul');
                    element.className = 'list-group';
                    item.content.forEach(listItem => {
                        const li = document.createElement('li');
                        li.className = 'list-group-item';
                        li.textContent = listItem;
                        element.appendChild(li);
                    });
                    break;
                default:
                    console.warn(`Unknown type: ${item.type}`);
            }
            if (element) {
                contentContainer.appendChild(element);
            }
        });
    } catch (error) {
        console.error('Error loading JSON:', error);
    }
}

// Llamar a la función para cargar contenido
loadContent();