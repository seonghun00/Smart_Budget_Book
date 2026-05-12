// Version.14 - 공백 무시, 메모 누적, 완전 자동화 & 사용자 설정 추가

// ==========================================
// [설정] 본인의 환경에 맞게 아래 값을 채워넣으시면 훨씬 안전합니다.
// ==========================================
// 1. 스프레드시트 주소(URL)에서 /d/ 와 /edit 사이의 긴 영문숫자 조합을 복사해 넣으세요.
// (비워두면 현재 연결된 스프레드시트를 자동으로 찾습니다)
var SPREADSHEET_ID = ""; 

// 2. 가계부를 기록하는 시트의 탭 이름을 적어주세요. (예: "Daily_Expense_Log")
// (비워두면 가장 첫 번째 시트에 기록합니다)
var SHEET_NAME = ""; 
// ==========================================

//  [ Google Spread Sheet → 확장 프로그램 → Apps Script ]  //

// 스프레드시트를 열 때 상단에 커스텀 메뉴를 추가합니다.
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('💾 가계부 관리')
      .addItem('수동으로 백업 및 초기화 실행', 'monthlyBackupAndClear')
      .addToUi();
}

// 공통 시트 불러오기 함수
function getTargetSheet() {
  var ss;
  if (SPREADSHEET_ID) {
    ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  } else {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  }
  
  if (SHEET_NAME) {
    return ss.getSheetByName(SHEET_NAME);
  } else {
    return ss.getSheets()[0];
  }
}

function doGet(e) {
  try {
    var sheet = getTargetSheet();
    if (!sheet) return ContentService.createTextOutput("시트를 찾을 수 없습니다.");
    
    var rawData = e.parameter.data || "";
    if (!rawData) return ContentService.createTextOutput("데이터가 없습니다.");

    // 1. 데이터 분리 (항목/금액/메모)
    var match = rawData.match(/^([^\d-]+)\s*(-?\d+)\s*(.*)$/) || rawData.match(/^([^\d-]+)(-?\d+)(.*)$/);
    if (!match) return ContentService.createTextOutput("형식 오류!");

    var category = match[1].trim();
    var amount = parseInt(match[2]);
    var memo = match[3].trim();

    // 2. 날짜 및 위치 찾기
    var today = new Date();
    var yearMonth = Utilities.formatDate(today, "GMT+9", "yy.MM"); 

    // ==========================================
    // [자동 달 넘김 로직] - A1과 비교해서 다르면 초기화
    // ==========================================
    var a1Value = sheet.getRange("A1").getValue().toString();
    if (a1Value && a1Value !== yearMonth && a1Value.indexOf(".") !== -1) {
      var recordedMonth = parseInt(a1Value.split(".")[1], 10);
      var currentMonth = parseInt(yearMonth.split(".")[1], 10);
      
      if (recordedMonth !== currentMonth && !isNaN(recordedMonth)) {
        var numCols = 11; // B~L열 총 11개
        // 1. B33:L33 합계 복사
        var monthlySummary = sheet.getRange(33, 2, 1, numCols).getValues()[0];
        
        // 2. 월별 기록 위치 (1월=36행 -> 35 + 월)
        var targetRow = 35 + recordedMonth;
        sheet.getRange(targetRow, 2, 1, numCols).setValues([monthlySummary]);
        
        // 3. B2:L32 기록 지우기
        var dataRange = sheet.getRange(2, 2, 31, numCols);
        dataRange.clearContent();
        dataRange.clearNote();
      }
    }
    
    // A1을 현재 월로 업데이트
    sheet.getRange("A1").setValue(yearMonth);

    var rowIndex = today.getDate() + 1; 
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var colIndex = headers.indexOf(category) + 1;

    // 3. 데이터 입력 및 메모 삽입
    if (colIndex > 0) {
      var cell = sheet.getRange(rowIndex, colIndex);
      
      // 금액 합산
      var currentVal = Number(cell.getValue()) || 0;
      cell.setNumberFormat("#,##0"); 
      cell.setValue(currentVal + amount);

      // [핵심] 엑셀 메모(노트) 삽입 기능
      if (memo) {
        var existingNote = cell.getNote(); // 기존에 달린 메모 가져오기
        if (existingNote) {
          cell.setNote(existingNote + ", " + memo); // 있으면 쉼표로 이어붙이기
        } else {
          cell.setNote(memo); // 없으면 새로 만들기
        }
      }
      
      var msg = "✅ " + category + " " + amount + "원 기록 완료!";
      return ContentService.createTextOutput(memo ? msg + " (메모 삽입됨)" : msg);
    } else {
      return ContentService.createTextOutput("에러: '" + category + "' 열을 찾을 수 없습니다.");
    }
  } catch (err) {
    return ContentService.createTextOutput("오류: " + err.message);
  }
}

// 수동 실행을 위한 함수 (메뉴에서 클릭 시 작동)
function monthlyBackupAndClear() {
  var sheet = getTargetSheet();
  if (!sheet) {
    SpreadsheetApp.getUi().alert("시트를 찾을 수 없습니다.");
    return;
  }
  
  // 1. A1 값 가져오기
  var a1Value = sheet.getRange("A1").getValue().toString(); // 예: "26.04"
  if (!a1Value || a1Value.indexOf(".") === -1) {
    SpreadsheetApp.getUi().alert("A1 셀의 형식이 올바르지 않습니다.");
    return;
  }
  
  var recordedMonth = parseInt(a1Value.split(".")[1], 10); // A1에 기록된 월 (예: 4)
  var today = new Date();
  var currentMonth = today.getMonth() + 1; // 실제 현재 월 (예: 5)
  
  // 2. 1달 차이가 나면 (A1 월과 현재 월이 다르면)
  if (recordedMonth !== currentMonth) {
    
    // B~L열 총 11개
    var numCols = 11;
    
    // B33:L33 합계 복사
    var monthlySummary = sheet.getRange(33, 2, 1, numCols).getValues()[0];
    
    // 1월=36행이므로, 목표 행은 '35 + 월'
    var targetRow = 35 + recordedMonth;
    
    // 목표 행(B~L)에 데이터 붙여넣기
    sheet.getRange(targetRow, 2, 1, numCols).setValues([monthlySummary]);
    
    // B2:L32 기록 및 메모 지우기
    var dataRange = sheet.getRange(2, 2, 31, numCols);
    dataRange.clearContent();
    dataRange.clearNote();
    
    // A1을 현재 월로 업데이트
    var yearMonth = Utilities.formatDate(today, "GMT+9", "yy.MM"); 
    sheet.getRange("A1").setValue(yearMonth);
    
    SpreadsheetApp.getUi().alert('✅ 백업 완료', recordedMonth + '월 합계가 ' + targetRow + '행에 저장되고 시트가 초기화되었습니다.', SpreadsheetApp.getUi().ButtonSet.OK);
  } else {
    SpreadsheetApp.getUi().alert('ℹ️ 안내', 'A1 셀이 이미 현재 월(' + currentMonth + '월)과 같아서 아무런 작업을 하지 않았습니다.', SpreadsheetApp.getUi().ButtonSet.OK);
  }
}
