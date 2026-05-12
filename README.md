<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=auto&height=80&section=header" width="100%" />
</p>

##### **English** | [한국어](README.ko.md)

# 📱 Automated Expense Logging System
> **iOS Shortcuts + Google Apps Script (GAS)**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"><img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black"></a>
[![Google Apps Script](https://img.shields.io/badge/Google%20Apps%20Script-4285F4?style=flat&logo=google-apps-script&logoColor=white)](https://developers.google.com/apps-script)
<a href="https://www.google.com/sheets/about/"><img src="https://img.shields.io/badge/Google_Sheets-34A853?style=flat&logo=google-sheets&logoColor=white"></a>
[![iOS Shortcuts](https://img.shields.io/badge/iOS%20Shortcuts-FF4500?style=flat&logo=shortcuts&logoColor=white)](https://support.apple.com/guide/shortcuts/welcome/ios)

An automated financial logging system that updates spending data to Google Sheets in seconds via iPhone Shortcuts and visualizes it through a real-time dashboard.

## 🚀 Key Features
- **One-Tap Logging**: Instantly input expenses via iOS Shortcuts without opening any apps.
- **Smart Parsing**: Automatically separates category and amount from natural language input (e.g., `Cafe 5000`).
- **Dynamic Dashboard**: Visualizes spending patterns with real-time Google Sheets charts.
- **Fully Automatic Rollover**: The system automatically detects a month change upon the first shortcut entry of a new month, archiving the previous month's data and resetting the board seamlessly. No time-driven triggers required.
- **Custom Settings & Menu**: Easily configure the target Spreadsheet ID and Sheet Name for robust stability, and use the built-in custom menu within Google Sheets for manual backups.
- **Error Handling**: Supports correction via negative inputs (e.g., `-5000`) and handles data format exceptions.

## 🛠 Tech Stack
- **Client**: iOS Shortcuts
- **Backend**: Google Apps Script (JavaScript-based Serverless API)
- **Database/UI**: Google Sheets

## 🏗 System Architecture
1. **Input**: User enters "Item Amount" using an iPhone Shortcut.
2. **Transfer**: The Shortcut sends a `GET` request to the Google Web App URL.
3. **Processing**: GAS receives the data, parses it, and records it in the row corresponding to today's date.
4. **Maintenance (Auto Rollover)**: When logging the first expense of a new month, GAS detects the month change, archives the previous month's totals, clears the daily log (including memos), and then records the new entry. A custom menu is also provided for manual maintenance.

## 📸 Screenshots
<img width="1710" height="681" alt="image" src="https://github.com/user-attachments/assets/50d2b0a1-e077-4c6e-bf44-7a932a3eb1df" />
<br>
<img width="1713" height="681" alt="image" src="https://github.com/user-attachments/assets/c053db7a-3ae0-49f1-81d6-fe513b103f60" />

## 💻 How to Setup
1. **Google Sheets**: Configure the sheet according to the provided template.
2. **Apps Script**: Copy the code from `src/code.gs` into your Google Sheets Apps Script editor and deploy as a Web App.
3. **iOS Shortcut**: Create a shortcut on your iPhone and connect it to your Web App URL.
4. **Action Button**: Assign the shortcut to the Action Button in iPhone settings (Available for iPhone 15 Pro and later).

## ⚙️ Customization (Recommended)
To prevent permission errors and ensure stability when running via iOS Shortcuts, configure your specific Spreadsheet ID and Sheet Name at the very top of `src/code.gs` (Lines 8 and 12):

```javascript
var SPREADSHEET_ID = "YOUR_SPREADSHEET_ID_HERE"; 
var SHEET_NAME = "YOUR_SHEET_NAME_HERE"; 
```
- **SPREADSHEET_ID**: The long string of letters and numbers in your Google Sheets URL between `/d/` and `/edit`.
- **SHEET_NAME**: The exact name of the tab where you log your daily expenses (if left blank, the first sheet is used).

<br>

> For a **detailed step-by-step guide**, please check [assets/README.md](./assets/README.md).

---
© 2026 Seong-hun Bae.
