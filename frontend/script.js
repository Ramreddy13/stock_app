document.addEventListener("DOMContentLoaded", function () {
    const companyList = document.getElementById("company-list");
    const searchInput = document.getElementById("search-input");
    let allCompanies = [];

    // Fetch companies from the backend
    fetchCompanies();

    // Add search functionality
    searchInput.addEventListener("input", function() {
        const searchTerm = this.value.toLowerCase();
        filterCompanies(searchTerm);
    });

    function fetchCompanies() {
        // Show loading state
        companyList.innerHTML = '<div class="loading"></div>';
        
        fetch("http://127.0.0.1:5000/companies")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(companies => {
                allCompanies = companies;
                renderCompanyList(companies);
            })
            .catch(error => {
                console.error("Error fetching company list:", error);
                companyList.innerHTML = `
                    <div class="error-message">
                        <p>Failed to load companies. Please make sure the backend server is running.</p>
                        <button id="retry-btn" class="btn">Retry</button>
                    </div>
                `;
                document.getElementById("retry-btn").addEventListener("click", fetchCompanies);
            });
    }

    function renderCompanyList(companies) {
        companyList.innerHTML = "";
        
        if (companies.length === 0) {
            companyList.innerHTML = '<p class="no-results">No companies found</p>';
            return;
        }

        companies.forEach(company => {
            const li = document.createElement("li");
            li.classList.add("list-group-item");
            li.textContent = company;
            li.addEventListener("click", () => {
                // Remove active class from all items
                document.querySelectorAll(".list-group-item").forEach(item => {
                    item.classList.remove("active");
                });
                
                // Add active class to clicked item
                li.classList.add("active");
                
                // Load chart and data for selected company
                loadCompanyData(company);
            });
            companyList.appendChild(li);
        });
    }

    function filterCompanies(searchTerm) {
        const filteredCompanies = allCompanies.filter(company => 
            company.toLowerCase().includes(searchTerm)
        );
        renderCompanyList(filteredCompanies);
    }

    function loadCompanyData(company) {
        const stockInfoDiv = document.getElementById("stock-info");
        const stockInfo1=document.getElementById("stock-info1");
        const companyTitle = document.getElementById("company-title");
        
        // Show loading state
        companyTitle.textContent = `Loading data for ${company}...`;
        stockInfoDiv.innerHTML = '<div class="loading"></div>';
        
        fetch(`http://127.0.0.1:5000/data/${company}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.length === 0) {
                    companyTitle.textContent = `No data available for ${company}`;
                    stockInfoDiv.innerHTML = '<p class="no-results">No data found for this company</p>';
                    return;
                }

                // Update title
                companyTitle.textContent = `Stock Data for ${company}`;
                
                // Clear previous data
                stockInfoDiv.innerHTML = "";
                stockInfo1.innerHTML = "";
                // Get the latest entry for the summary cards
                const latestEntry = data[data.length - 1];
                
                // Create summary cards
                createSummaryCards(stockInfo1, latestEntry);
                
                // Create and render chart
                createStockChart(company, data);
                
                // Create data table
                createDataTable(stockInfoDiv, data);
            })
            .catch(error => {
                console.error("Error fetching company data:", error);
                companyTitle.textContent = `Error Loading Data`;
                stockInfoDiv.innerHTML = `
                    <div class="error-message">
                        <p>Failed to load data for ${company}. Please try again.</p>
                    </div>
                `;
            });
    }

    function createSummaryCards(container, data) {
        const cardsContainer = document.createElement("div");
        cardsContainer.classList.add("data-cards");
        
        // Create cards for key metrics
        const metrics = [
            { label: "Latest Close", value: parseFloat(data.closing_index_value) || 0 },
            { label: "Open", value: parseFloat(data.open_index_value) || 0 },
            { label: "High", value: parseFloat(data.high_index_value) || 0 },
            { label: "Low", value: parseFloat(data.low_index_value) || 0 },
            { 
                label: "Change", 
                value: parseFloat(data.points_change) || 0,
                isChange: true 
            },
            { 
                label: "Change %", 
                value: parseFloat(data.change_percent) || 0,
                isPercentage: true,
                isChange: true 
            }
        ];
        
        metrics.forEach(metric => {
            const card = document.createElement("div");
            card.classList.add("data-card");
            
            // Add positive/negative class for change values
            if (metric.isChange) {
                if (metric.value > 0) {
                    card.classList.add("positive");
                } else if (metric.value < 0) {
                    card.classList.add("negative");
                }
            }
            
            const label = document.createElement("div");
            label.classList.add("label");
            label.textContent = metric.label;
            
            const value = document.createElement("div");
            value.classList.add("value");
            
            // Format the value
            if (metric.isPercentage) {
                value.textContent = `${metric.value.toFixed(2)}%`;
            } else if (metric.isChange && metric.value > 0) {
                value.textContent = `+${metric.value.toFixed(2)}`;
            } else {
                value.textContent = metric.value.toFixed(2);
            }
            
            card.appendChild(label);
            card.appendChild(value);
            cardsContainer.appendChild(card);
        });
        
        container.appendChild(cardsContainer);
    }

    function createStockChart(company, data) {
        const ctx = document.getElementById("stockChart").getContext("2d");
        
        // Extract data for chart
        const dates = data.map(entry => entry.index_date);
        const closingValues = data.map(entry => parseFloat(entry.closing_index_value) || 0);
        
        // Destroy previous chart instance if it exists
        if (window.stockChartInstance) {
            window.stockChartInstance.destroy();
        }
        
        // Create new chart
        window.stockChartInstance = new Chart(ctx, {
            type: "line",
            data: {
                labels: dates,
                datasets: [{
                    label: `Closing Price`,
                    data: closingValues,
                    borderColor: "#3498db",
                    backgroundColor: "rgba(52, 152, 219, 0.1)",
                    borderWidth: 2,
                    pointRadius: 3,
                    pointBackgroundColor: "#3498db",
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: `${company} Stock Price History`,
                        font: {
                            size: 16
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    },
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45
                        }
                    },
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Price'
                        }
                    }
                }
            }
        });
    }

    function createDataTable(container, data) {
        // Create table element
        const table = document.createElement("table");
        table.classList.add("table");
        
        // Create table header
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");
        
        const columnNames = [
            "Date", "Open", "High", "Low", "Close",
            "Points Change", "Change %", "Volume", "Turnover (Rs Cr)",
            "PE Ratio", "PB Ratio", "Dividend Yield"
        ];
        
        columnNames.forEach(colName => {
            const th = document.createElement("th");
            th.textContent = colName;
            headerRow.appendChild(th);
        });
        
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        // Create table body
        const tbody = document.createElement("tbody");
        
        // Sort data by date (newest first)
        data.sort((a, b) => {
            return new Date(b.index_date) - new Date(a.index_date);
        });
        
        data.forEach(entry => {
            const row = document.createElement("tr");
            
            const values = [
                entry.index_date,
                formatValue(entry.open_index_value),
                formatValue(entry.high_index_value),
                formatValue(entry.low_index_value),
                formatValue(entry.closing_index_value),
                formatValue(entry.points_change, true),
                formatValue(entry.change_percent, true) + "%",
                formatValue(entry.volume),
                formatValue(entry.turnover_rs_cr),
                formatValue(entry.pe_ratio),
                formatValue(entry.pb_ratio),
                formatValue(entry.div_yield)
            ];
            
            values.forEach((value, index) => {
                const td = document.createElement("td");
                td.textContent = value;
                
                // Add color to change values
                if (index === 5 || index === 6) { // Points Change or Change %
                    const numValue = parseFloat(entry[index === 5 ? 'points_change' : 'change_percent']);
                    if (numValue > 0) {
                        td.style.color = 'var(--success-color)';
                    } else if (numValue < 0) {
                        td.style.color = 'var(--danger-color)';
                    }
                }
                
                row.appendChild(td);
            });
            
            tbody.appendChild(row);
        });
        
        table.appendChild(tbody);
        container.appendChild(table);
    }

    function formatValue(value, isChange = false) {
        if (value === "N/A" || value === null || value === undefined) {
            return "—";
        }
        
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
            return value;
        }
        
        if (isChange && numValue > 0) {
            return "+" + numValue.toFixed(2);
        }
        
        return numValue.toFixed(2);
    }

    // If there are companies, select the first one by default
    function selectFirstCompany() {
        setTimeout(() => {
            const firstCompany = document.querySelector(".list-group-item");
            if (firstCompany) {
                firstCompany.click();
            }
        }, 500);
    }

    // Select first company after loading
    selectFirstCompany();
});