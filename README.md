# Stock Data Visualization

A professional web application for visualizing stock market index data with interactive charts and detailed information.

![{C31DDB01-843C-4D57-AFA3-E096DEDD2B29}](https://github.com/user-attachments/assets/1c9bfc7a-443a-4bbe-99a1-cd45d9958e22)


## Features

- **Interactive Dashboard**: Clean, modern UI with responsive design
- **Real-time Data**: Connects to a Python Flask backend to fetch stock market data
- **Search Functionality**: Quickly find specific stock indices
- **Data Visualization**: 
  - Line charts showing historical price trends
  - Summary cards with key metrics
  - Detailed data tables with comprehensive information
- **Color-coded Indicators**: Visual representation of positive and negative changes

## Screenshots

### Dashboard Overview
![{C31DDB01-843C-4D57-AFA3-E096DEDD2B29}](https://github.com/user-attachments/assets/1c9bfc7a-443a-4bbe-99a1-cd45d9958e22)
![{EBB605DC-6A3D-4A0B-8EE2-7A7AC1F45698}](https://github.com/user-attachments/assets/27fe455f-b7ef-4874-9242-10e5099bcff5)




### Mobile Responsive Design
![{EF5B3B09-B67A-4570-ABBF-683860CEDA42}](https://github.com/user-attachments/assets/f254fa77-c60d-4fce-b818-f8d6e7d319e6)
![{43CA921B-5CAB-40AC-AE98-CE0DF5518C2B}](https://github.com/user-attachments/assets/18b01ea1-56a0-48d1-8b08-83ae3b7423b1)
![{2E28AC83-80A1-4D97-A08C-3AACDDD9D12C}](https://github.com/user-attachments/assets/a0a81e4d-e179-4f38-903d-272dc9222e73)



## Technology Stack

### Frontend
- HTML5, CSS3, JavaScript
- Chart.js for data visualization
- Vite for development and building

### Backend
- Python Flask
- Pandas for data processing
- Flask-CORS for cross-origin resource sharing

## Data Structure

The application visualizes the following stock market data:
- Index Name
- Date
- Open, High, Low, Close values
- Points Change and Percentage Change
- Volume
- Turnover (in Rs Cr)
- PE Ratio
- PB Ratio
- Dividend Yield

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- Python (v3.6 or higher)
- pip (Python package manager)

### Backend Setup
1. Clone the repository
2. Navigate to the backend directory
3. Install the required Python packages:
   ```
   pip install flask flask-cors pandas
   ```
4. Place your CSV data file as `dump.csv` in the backend directory
5. Start the Flask server:
   ```
   python app.py
   ```
   The server will run at http://127.0.0.1:5000

### Frontend Setup
1. Navigate to the frontend directory
2. Open the index.js using liveServer you can access on (http://127.0.0.1:5500/stock_app/frontend/index.html)


## Customization

### Changing Colors and Themes
The application uses CSS variables for theming. You can modify the colors in the `style.css` file:

```css
:root {
  --primary-color: #2c3e50;
  --secondary-color: #3498db;
  /* other color variables */
}
```

### Adding New Features
The modular structure makes it easy to add new features:
- Add new chart types in the `createStockChart` function
- Extend the data cards in the `createSummaryCards` function
- Add additional columns to the table in the `createDataTable` function

## License

[MIT License](LICENSE)

## Acknowledgements

- [Chart.js](https://www.chartjs.org/) for the interactive charts
- [Flask](https://flask.palletsprojects.com/) for the backend framework
- [Pandas](https://pandas.pydata.org/) for data processing
