// Unternehmens- und Tool-Daten mit angepassten Attributen und Beschreibungen
const nodes = [
    { id: "Catena-X", group: 1, attributes: { 
        Beschreibung: "Catena-X dient als zentrale Plattform für Datenintegration und Kollaboration in der Automobilindustrie.",
        Datenverarbeitung: "Eingehende Daten werden semantisch standardisiert, verschlüsselt und sicher über Datenräume weitergeleitet. Dabei werden Werkzeuge wie der Eclipse Dataspace Connector genutzt, um den sicheren Austausch zu garantieren." 
    }},
    { id: "BASF", group: 2, attributes: { Bedarf: "10000 Einheiten", Standort: "Deutschland", Branche: "Chemie" } },
    { id: "BASF-Fabrik", group: 3, attributes: { CO2: "12 t", Produktionskapazität: "20000 Einheiten", Zertifizierungen: "ISO 9001", Ausfallquote: "1%" } },
    { id: "Volkswagen", group: 2, attributes: { Bedarf: "20000 Einheiten", Standort: "USA", Branche: "Automobil" } },
    { id: "Volkswagen-Fabrik", group: 3, attributes: { CO2: "15 t", Produktionskapazität: "30000 Einheiten", Zertifizierungen: "ISO 14001", Ausfallquote: "2%" } },
    { id: "Schaeffler", group: 2, attributes: { Bedarf: "15000 Einheiten", Standort: "China", Branche: "Zulieferer" } },
    { id: "Schaeffler-Fabrik", group: 3, attributes: { CO2: "10 t", Produktionskapazität: "25000 Einheiten", Zertifizierungen: "ISO 45001", Ausfallquote: "0.5%" } },
    { id: "Siemens", group: 2, attributes: { Bedarf: "5000 Einheiten", Standort: "Indien", Branche: "Technologie" } },
    { id: "Siemens-Fabrik", group: 3, attributes: { CO2: "8 t", Produktionskapazität: "10000 Einheiten", Zertifizierungen: "ISO 27001", Ausfallquote: "0.8%" } },
    { id: "Daimler", group: 2, attributes: { Bedarf: "25000 Einheiten", Standort: "Brasilien", Branche: "Automobil" } },
    { id: "Daimler-Fabrik", group: 3, attributes: { CO2: "20 t", Produktionskapazität: "40000 Einheiten", Zertifizierungen: "ISO 50001", Ausfallquote: "1.2%" } },
    { id: "Tools", group: 4, attributes: { Funktion: "Zentrale Sammlung von Werkzeugen zur Unterstützung von Catena-X." } },
    { id: "Eclipse Dataspace Connector", group: 4, attributes: { 
        Beschreibung: "Der Eclipse Dataspace Connector ermöglicht den sicheren, standardisierten Austausch von Daten zwischen Partnern. Dies ist essenziell, um sensible Informationen wie CO2-Daten oder Produktionskapazitäten sicher zu teilen."
    }},
    { id: "Semantic Hub", group: 4, attributes: { 
        Beschreibung: "Der Semantic Hub sorgt dafür, dass alle Teilnehmer standardisierte Begriffe und Datenmodelle verwenden. Dies fördert die Interoperabilität zwischen verschiedenen Systemen."
    }},
    { id: "Digital Twin Registry", group: 4, attributes: { 
        Beschreibung: "Das Digital Twin Registry ermöglicht die Rückverfolgbarkeit von Produkten entlang der Lieferkette. Jeder digitale Zwilling repräsentiert ein reales Objekt mit all seinen Daten."
    }},
    { id: "BPDM", group: 4, attributes: { 
        Beschreibung: "BPDM (Business Partner Data Management) hilft dabei, korrekte Stammdaten zu verwalten. Dies reduziert Fehler in der Kommunikation und optimiert die Zusammenarbeit zwischen Partnern."
    }}
];

// Links zwischen den Icons
const links = [
    { source: "Catena-X", target: "BASF" },
    { source: "Catena-X", target: "Volkswagen" },
    { source: "Catena-X", target: "Schaeffler" },
    { source: "Catena-X", target: "Siemens" },
    { source: "Catena-X", target: "Daimler" },
    { source: "BASF", target: "BASF-Fabrik" },
    { source: "Volkswagen", target: "Volkswagen-Fabrik" },
    { source: "Schaeffler", target: "Schaeffler-Fabrik" },
    { source: "Siemens", target: "Siemens-Fabrik" },
    { source: "Daimler", target: "Daimler-Fabrik" },
    { source: "Catena-X", target: "Tools" },
    { source: "Tools", target: "Eclipse Dataspace Connector" },
    { source: "Tools", target: "Semantic Hub" },
    { source: "Tools", target: "Digital Twin Registry" },
    { source: "Tools", target: "BPDM" }
];

// SVG-Setup
const svg = d3.select("svg");
const width = +svg.attr("width");
const height = +svg.attr("height");

// Tooltip erstellen
const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background-color", "lightgray")
    .style("padding", "10px")
    .style("border-radius", "5px")
    .style("box-shadow", "0px 4px 6px rgba(0, 0, 0, 0.1)")
    .style("visibility", "hidden");

// Info-Box erstellen
const infoBox = d3.select("body").append("div")
    .attr("id", "info-box")
    .style("position", "absolute")
    .style("background-color", "white")
    .style("border", "1px solid #ccc")
    .style("box-shadow", "0 4px 6px rgba(0, 0, 0, 0.1)")
    .style("padding", "10px")
    .style("visibility", "hidden");

// Simulation für Nodes
const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(150))
    .force("charge", d3.forceManyBody().strength(-300))
    .force("center", d3.forceCenter(width / 2, height / 2));

// Links zeichnen
const link = svg.append("g")
    .selectAll("line")
    .data(links)
    .enter().append("line")
    .attr("stroke", "#999")
    .attr("stroke-width", 2);

// Nodes zeichnen
const nodeGroup = svg.append("g")
    .selectAll("g")
    .data(nodes)
    .enter().append("g")
    .attr("class", "node");

// Kreise für Nodes
nodeGroup.append("circle")
    .attr("r", d => d.group === 3 ? 15 : 20)
    .attr("fill", d => {
        if (d.group === 1) return "#007bff"; // Catena-X
        if (d.group === 2) return "#28a745"; // Unternehmen
        if (d.group === 3) return "#ffa500"; // Fabriken
        return "#ff7f0e"; // Tools
    })
    // Tooltip-Interaktivität hinzufügen
    .on("mouseover", (event, d) => {
        const attributes = d.attributes || {};
        const attributeContent = Object.entries(attributes)
            .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
            .join("");

        tooltip.html(`<strong>${d.id}</strong>${attributeContent ? `<div>${attributeContent}</div>` : ''}`)
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 20}px`)
            .style("visibility", "visible");
    })
    .on("mouseout", () => {
        tooltip.style("visibility", "hidden");
    });

// Permanente Labels der Nodes
nodeGroup.append("text")
    .attr("x", 0)
    .attr("y", 35)
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("fill", "#000")
    .text(d => d.id);

// Funktion: Auswahl mit Doppelklick
let selectedCompany = null;
let selectedFactory = null;
let activeFlow = null;

nodeGroup.on("dblclick", (event, d) => {
    if (d.group === 2) { // Unternehmen
        if (selectedCompany) {
            d3.select(`[data-id="${selectedCompany.id}"]`).select("circle").attr("stroke", null).attr("stroke-width", null);
        }
        selectedCompany = d;
        d3.select(event.target).select("circle").attr("stroke", "red").attr("stroke-width", 3);
    } else if (d.group === 3) { // Fabrik
        if (selectedFactory) {
            d3.select(`[data-id="${selectedFactory.id}"]`).select("circle").attr("stroke", null).attr("stroke-width", null);
        }
        selectedFactory = d;
        d3.select(event.target).select("circle").attr("stroke", "red").attr("stroke-width", 3);
    }

    if (selectedCompany && selectedFactory) {
        if (selectedCompany.id.replace("-Fabrik", "") === selectedFactory.id.replace("-Fabrik", "")) {
            alert("Ein Unternehmen kann nicht von seiner eigenen Fabrik einkaufen!");
            resetSelection();
        } else {
            startDataFlow(selectedCompany, selectedFactory);
        }
    }
});

// Funktion: Datenfluss starten
function startDataFlow(company, factory) {
    if (activeFlow) {
        clearInterval(activeFlow);
        svg.selectAll(".data-point").remove();
        svg.selectAll(".data-point-rosane").remove();
    }

    const pathRed = [
        { x: company.x, y: company.y },
        { x: nodes.find(n => n.id === "Catena-X").x, y: nodes.find(n => n.id === "Catena-X").y },
        { x: nodes.find(n => n.id === "Tools").x, y: nodes.find(n => n.id === "Tools").y },
        { x: factory.x, y: factory.y }
    ];

    const pathRosane = [
        { x: factory.x, y: factory.y },
        { x: nodes.find(n => n.id === "Catena-X").x, y: nodes.find(n => n.id === "Catena-X").y },
        { x: nodes.find(n => n.id === "Tools").x, y: nodes.find(n => n.id === "Tools").y },
        { x: company.x, y: company.y }
    ];

    activeFlow = setInterval(() => {
        pathRed.forEach((point, i) => {
            if (i < pathRed.length - 1) {
                const nextPoint = pathRed[i + 1];
                svg.append("circle")
                    .attr("class", "data-point")
                    .attr("r", 5)
                    .attr("fill", "red")
                    .attr("cx", point.x)
                    .attr("cy", point.y)
                    .transition()
                    .duration(1000)
                    .attr("cx", nextPoint.x)
                    .attr("cy", nextPoint.y)
                    .on("end", function () {
                        d3.select(this).remove();
                    });
            }
        });

        pathRosane.forEach((point, i) => {
            if (i < pathRosane.length - 1) {
                const nextPoint = pathRosane[i + 1];
                svg.append("circle")
                    .attr("class", "data-point-rosane")
                    .attr("r", 5)
                    .attr("fill", "pink")
                    .attr("cx", point.x)
                    .attr("cy", point.y)
                    .transition()
                    .duration(1000)
                    .attr("cx", nextPoint.x)
                    .attr("cy", nextPoint.y)
                    .on("end", function () {
                        d3.select(this).remove();
                    });
            }
        });
    }, 1000);

    showExplanation(company, factory);
}

// Funktion: Erklärung anzeigen
function showExplanation(company, factory) {
    const tools = ["Eclipse Dataspace Connector", "Semantic Hub", "Digital Twin Registry", "BPDM"];
    const toolDescriptions = tools.map(toolId => {
        const tool = nodes.find(n => n.id === toolId);
        return `<strong>${tool.id}:</strong> ${tool.attributes.Beschreibung}`;
    }).join("<br>");

    const explanation = `
        <p><strong>Unternehmen:</strong> ${company.id}</p>
        <p><strong>Fabrik:</strong> ${factory.id}</p>
        <p>Das Unternehmen kauft Produkte von der Fabrik über Catena-X. Die folgenden Daten werden verarbeitet:</p>
        <ul>
            <li><strong>Bedarf:</strong> ${company.attributes.Bedarf}</li>
            <li><strong>CO₂ der Fabrik:</strong> ${factory.attributes.CO2}</li>
            <li><strong>Produktionskapazität:</strong> ${factory.attributes.Produktionskapazität}</li>
        </ul>
        <p>Tools, die den Datenfluss unterstützen:</p>
        <p>${toolDescriptions}</p>
    `;

    infoBox.html(explanation)
        .style("left", `${width / 2}px`)
        .style("top", `${height - 100}px`)
        .style("visibility", "visible");
}

// Funktion: Auswahl zurücksetzen
function resetSelection() {
    selectedCompany = null;
    selectedFactory = null;
    d3.selectAll("circle").attr("stroke", null).attr("stroke-width", null);
    if (activeFlow) {
        clearInterval(activeFlow);
        svg.selectAll(".data-point").remove();
        svg.selectAll(".data-point-rosane").remove();
    }
}

// Drag-Funktionalität
nodeGroup.call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended));

// Simulation aktualisieren
simulation.on("tick", () => {
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    nodeGroup.attr("transform", d => `translate(${d.x}, ${d.y})`);
});

// Drag-Events
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
