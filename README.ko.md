<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=auto&height=80&section=header" width="100%" />
</p>

##### [English](README.md) | **한국어**

# 📱 자동 가계부 기록 시스템
> **아이폰 단축어 + Google Apps Script (GAS)**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"><img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black"></a>
[![Google Apps Script](https://img.shields.io/badge/Google%20Apps%20Script-4285F4?style=flat&logo=google-apps-script&logoColor=white)](https://developers.google.com/apps-script)
<a href="https://www.google.com/sheets/about/"><img src="https://img.shields.io/badge/Google_Sheets-34A853?style=flat&logo=google-sheets&logoColor=white"></a>
[![iOS Shortcuts](https://img.shields.io/badge/iOS%20Shortcuts-FF4500?style=flat&logo=shortcuts&logoColor=white)](https://support.apple.com/guide/shortcuts/welcome/ios)

아이폰 단축어를 활용하여 단 몇 초 만에 소비 내역을 구글 스프레드시트에 업데이트하고, 실시간 대시보드로 시각화하는 자동화 시스템입니다.

## 🚀 Key Features
- **One-Tap Logging**: 아이폰 단축어 통해 앱 실행 없이 즉시 지출 입력.
- **Smart Parsing**: 자연어 입력(`카페 5000`)을 분석하여 카테고리와 금액을 자동 분리.
- **Dynamic Dashboard**: 실시간 구글 시트 차트를 통해 지출 비중 시각화.
- **Fully Automatic Rollover**: 새 달의 첫 지출을 단축어로 기록할 때, 시스템이 스스로 달력 변경을 감지하여 이전 달 데이터를 백업하고 일별 보드를 백지화하는 완전 자동화 기능 탑재. (번거로운 트리거 설정 불필요)
- **Custom Settings & Menu**: 시트 ID 및 탭 이름 설정을 통해 권한 오류를 방지하며, 스프레드시트 내에 추가된 커스텀 메뉴로 수동 백업 및 초기화도 손쉽게 가능.
- **Error Handling**: 마이너스 입력(`-5000`)을 통한 오기입 수정 기능 및 데이터 형식 예외 처리.

## 🛠 Tech Stack
- **Client**: iOS Shortcuts (iOS 단축어)
- **Backend**: Google Apps Script (JavaScript 기반 서버리스 API)
- **Database/UI**: Google Sheets

## 🏗 System Architecture
1. **Input**: 사용자가 아이폰 단축어 버튼을 눌러 "항목 금액" 입력.
2. **Transfer**: 단축어가 구글 웹 앱 URL로 `GET` 요청 전송.
3. **Processing**: GAS가 데이터를 받아 파싱 후, 오늘 날짜와 일치하는 행(Row)에 데이터 기록.
4. **Maintenance (Auto Rollover)**: 새 달이 시작되고 첫 단축어 요청이 들어오면, GAS가 이를 즉시 감지하여 지난달 합계를 DB로 이동하고 입력칸과 메모를 모두 초기화한 뒤 새 지출을 기록. 수동 관리를 위한 전용 메뉴도 지원.

## 📸 Screen Shots
<img width="1710" height="681" alt="image" src="https://github.com/user-attachments/assets/50d2b0a1-e077-4c6e-bf44-7a932a3eb1df" />
<br>
<img width="1713" height="681" alt="image" src="https://github.com/user-attachments/assets/c053db7a-3ae0-49f1-81d6-fe513b103f60" />


## 💻 How to Setup
1. **Google Sheets**: 제공된 템플릿 형식으로 시트를 구성합니다.
2. **Apps Script**: `src/code.gs`의 코드를 복사하여 구글 시트 내 앱스 스크립트에 배포합니다.
3. **iOS Shortcut**: 아이폰 단축어를 생성하고 웹 앱 URL을 연결합니다.
4. **Action Button**: 아이폰 설정에서 해당 단축어를 액션 버튼으로 지정합니다. (아이폰 15 이상 가능)

## ⚙️ Customization (사용자 설정)
단축어와 같은 외부 웹 앱 연동 시 발생할 수 있는 권한 에러를 완벽하게 방지하고 안정성을 높이기 위해, `src/code.gs` 최상단(8번째 및 12번째 줄)에 본인의 시트 정보를 입력하는 것을 강력히 권장합니다.

```javascript
var SPREADSHEET_ID = "여기에_스프레드시트_ID_입력"; 
var SHEET_NAME = "여기에_시트이름_입력"; 
```
- **SPREADSHEET_ID**: 구글 시트 주소(URL)에서 `/d/`와 `/edit` 사이에 있는 긴 영문/숫자 조합입니다.
- **SHEET_NAME**: 가계부가 기록될 탭의 정확한 이름입니다. (비워둘 경우 첫 번째 시트가 기본으로 사용됩니다)

<br>

> **더 상세한 가이드**가 필요하다면 [assets/README.md](./assets/README.md)에서 확인하실 수 있습니다.

---
© 2026 Seong-hun Bae.
