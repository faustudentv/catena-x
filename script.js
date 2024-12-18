let selectedCompanies = [];
let isDataRoomActive = false;

// Navigation zwischen Räumen
function navigateTo(screenId) {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    if (screenId === 'room2') generateCompanies();
    if (screenId === 'room3') console.log("Raum 3 geladen");
}

// Unternehmens- und Tool-Daten
const nodes = [];
const links = [];

// 40 Unternehmen generieren
for (let i = 1; i <= 40; i++) {
    const companyId = `Unternehmen-${i}`;
    nodes.push({ id: companyId, group: 2, x: Math.random() * 1000, y: Math.random() * 600 });

    const edcId = `${companyId}-EDC`;

    nodes.push({ id: edcId, group: 5 });

    links.push({ source: companyId, target: edcId, length: 80 });
}

// Begrenzung der Bewegung innerhalb des Rahmens
function constrainNode(node, width, height) {
    const padding = 20; // Abstand zum Rand
    node.x = Math.max(padding, Math.min(width - padding, node.x));
    node.y = Math.max(padding, Math.min(height - padding, node.y));
}

// Generiere das Netzwerk
function generateCompanies() {
    d3.select("#network-container").select("svg").remove();

    const width = document.getElementById("network-container").offsetWidth;
    const height = document.getElementById("network-container").offsetHeight;

    const svg = d3.select("#network-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    svg.append("rect")
        .attr("x", 10)
        .attr("y", 10)
        .attr("width", width - 20)
        .attr("height", height - 20)
        .attr("fill", "none")
        .attr("stroke", "#ccc")
        .attr("stroke-width", 2);

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(d => d.length || 150))
        .force("charge", d3.forceManyBody().strength(-100))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide().radius(30));

    const link = svg.append("g")
        .selectAll("line")
        .data(links)
        .enter().append("line")
        .attr("stroke", d => d.color || "#999")
        .attr("stroke-width", 1.5);

    const node = svg.append("g")
        .selectAll("g")
        .data(nodes)
        .enter().append("g")
        .attr("class", "node")
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    node.append("circle")
        .attr("r", d => (d.group === 2 ? 20 : 10))
        .attr("fill", d => {
            if (d.group === 2) return "#28a745";
            if (d.group === 5) return "#999";
        })
        .on("dblclick", (event, d) => {
            if (d.group === 2) handleCompanySelection(d);
            if (d.group === 5) showEDCPopup(d); // EDC-Node Popup anzeigen
        });

    node.append("text")
        .attr("x", 0)
        .attr("y", 35)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "#000")
        .text(d => d.id);

    simulation.on("tick", () => {
        link.attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node.attr("transform", d => {
            constrainNode(d, width, height); // Begrenzung anwenden
            return `translate(${d.x}, ${d.y})`;
        });
    });

    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
}

// Unternehmen auswählen und Links erstellen
function handleCompanySelection(company) {
    if (selectedCompanies.includes(company)) return;

    selectedCompanies.push(company);

    if (selectedCompanies.length === 2) {
        positionSelectedCompanies(selectedCompanies[0], selectedCompanies[1]);
        createEDCLink(selectedCompanies[0], selectedCompanies[1]); // Verbindung über EDC erstellen
        showEDCPopup(selectedCompanies[0]);
        selectedCompanies = [];
    }
}

// Positioniert die zwei ausgewählten Unternehmen
function positionSelectedCompanies(company1, company2) {
    const width = document.getElementById("network-container").offsetWidth;
    const height = document.getElementById("network-container").offsetHeight;

    company1.fx = width / 2 - 200;
    company1.fy = height / 2;

    company2.fx = width / 2 + 200;
    company2.fy = height / 2;

    // Positioniere die EDC-Nodes vertikal
    const edc1 = nodes.find(n => n.id === `${company1.id}-EDC`);
    const edc2 = nodes.find(n => n.id === `${company2.id}-EDC`);

    if (edc1) {
        edc1.fx = width / 2 - 200;
        edc1.fy = height / 2 + 100;
    }
    if (edc2) {
        edc2.fx = width / 2 + 200;
        edc2.fy = height / 2 + 100;
    }

    generateCompanies(); // Aktualisiere das Netzwerk
}

// Erstellt eine Verbindung zwischen den EDC-Knoten der ausgewählten Unternehmen
function createEDCLink(company1, company2) {
    const edc1 = `${company1.id}-EDC`;
    const edc2 = `${company2.id}-EDC`;

    // Prüfen, ob die Verbindung bereits existiert
    const existingLink = links.find(link =>
        (link.source === edc1 && link.target === edc2) ||
        (link.source === edc2 && link.target === edc1)
    );

    if (!existingLink) {
        links.push({ source: edc1, target: edc2, length: 100, color: "red" }); // Verbindung in Rot hinzufügen
    }

    generateCompanies(); // Netzwerk aktualisieren
}

// Popup für EDC anzeigen
function showEDCPopup(edcNode) {
    let popup = document.getElementById('edc-popup');
    if (!popup) {
        popup = document.createElement('div');
        popup.id = 'edc-popup';
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.right = '20px';
        popup.style.transform = 'translateY(-50%)';
        popup.style.width = '300px';
        popup.style.padding = '20px';
        popup.style.backgroundColor = '#fff';
        popup.style.border = '1px solid #ccc';
        popup.style.borderRadius = '8px';
        popup.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        popup.style.zIndex = '1000';
        document.body.appendChild(popup);
    }

    popup.innerHTML = `
        <h3>EDC Information</h3>
        <p>Der EDC (Eclipse Data Connector) ist verantwortlich für den sicheren Datenaustausch innerhalb des Catena-X Netzwerks.</p>
        <p>Die Datenhoheit bleibt bei den jeweiligen Unternehmen, und der Austausch erfolgt unter klaren Sicherheits- und Zugriffsvorgaben.</p>
        <button onclick="closeEDCPopup()">Schließen</button>
    `;
}

function closeEDCPopup() {
    const popup = document.getElementById('edc-popup');
    if (popup) popup.remove();
}

// Raum 3 Drag-and-Drop Funktionen
function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
    event.preventDefault();
    const kitId = event.dataTransfer.getData("text");
    const kitName = document.getElementById(kitId).textContent;

    const dropArea = document.getElementById("drop-area");
    dropArea.innerHTML = `<div style="font-weight: bold; color: #333;">${kitName}</div>`;

    showKitPopup(kitId);
}

// Pop-up anzeigen
function showKitPopup(kitId) {
    const popup = document.getElementById("kit-popup");
    const title = document.getElementById("kit-popup-title");
    const content = document.getElementById("kit-popup-content");

    const descriptions = {
        "kit-traceability": "Das Traceability KIT ermöglicht Rückverfolgbarkeit entlang der Lieferkette.",
        "kit-pcf": "Das Product Carbon Footprint KIT optimiert die Nachvollziehbarkeit und Berechnung der CO₂-Emissionen.",
        "kit-dcm": "Das Demand and Capacity Management KIT optimiert die Nachfrage- und Kapazitätsplanung.",
        "kit-ecopass": "Das EcoPass KIT unterstützt bei Zertifizierungen."
    };

    title.textContent = `${kitId.replace("kit-", "").toUpperCase()} KIT`;
    content.textContent = descriptions[kitId] || "Informationen nicht verfügbar.";

    popup.classList.remove("hidden");
}

// Pop-up schließen
function closeKitPopup() {
    document.getElementById("kit-popup").classList.add("hidden");
}

// Verbindungslinie zwischen EDC A und EDC B dynamisch positionieren
function updateConnectionLine() {
    const edcA = document.getElementById("edc-left").getBoundingClientRect();
    const edcB = document.getElementById("edc-right").getBoundingClientRect();

    const line = document.getElementById("edc-connection");
    line.setAttribute("x1", edcA.left + edcA.width / 2);
    line.setAttribute("y1", edcA.top + edcA.height / 2);
    line.setAttribute("x2", edcB.left + edcB.width / 2);
    line.setAttribute("y2", edcB.top + edcB.height / 2);
}

// Linie beim Laden und beim Fenster-Resize aktualisieren
window.addEventListener("load", updateConnectionLine);
window.addEventListener("resize", updateConnectionLine);


// Raum 5: Antworten überprüfen
function submitAnswers() {
    const question1 = document.querySelector('input[name="question1"]:checked');
    const question2 = document.querySelector('input[name="question2"]:checked');
    const result = document.getElementById('result');

    if (!question1 || !question2) {
        result.textContent = "Bitte beantworten Sie beide Fragen!";
        result.style.color = "red";
        result.classList.remove("hidden");
        return;
    }

    // Richtige Antworten
    const correctAnswers = {
        question1: "a", // Erhöhte Transparenz und Nachverfolgbarkeit
        question2: "b"  // Die einzelnen Unternehmen
    };

    let score = 0;
    if (question1.value === correctAnswers.question1) score++;
    if (question2.value === correctAnswers.question2) score++;

    // Ergebnis anzeigen
    result.classList.remove("hidden");
    if (score === 2) {
        result.textContent = "Sehr gut! Beide Antworten sind korrekt! 🎉";
        result.style.color = "green";
    } else if (score === 1) {
        result.textContent = "Fast richtig! Eine Antwort ist korrekt.";
        result.style.color = "orange";
    } else {
        result.textContent = "Leider falsch. Bitte versuchen Sie es noch einmal.";
        result.style.color = "red";
    }
}
