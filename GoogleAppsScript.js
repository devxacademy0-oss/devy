// ============================================
// كود Google Apps Script الخاص بـ Dev-X Academy
// ============================================
// 1. افتح شيت جوجل الخاص بك
// 2. اذهب إلى Extensions -> Apps Script
// 3. امسح الكود القديم والصق هذا الكود بالكامل
// 4. اضغط Save
// 5. اذهب إلى Deploy (بالأعلى على اليمين) -> New deployment
// 6. اختر النوع: Web app
// 7. اجعل Execute as = Me
// 8. اجعل Who has access = Anyone
// 9. اضغط Deploy ووافق على الصلاحيات
// 10. انسخ الرابط (Web app URL) وضعه في ملف app.js و admin.js مكان YOUR_GOOGLE_SCRIPT_URL_HERE
// ============================================

const SHEET_NAME = 'Sheet1'; // غيرها لو اسم الورقة عندك مختلف من الأسفل

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({status: "error", message: "الشيت غير موجود تأكد من اسم الورقة بالأسفل (Sheet1)"}))
                         .setMimeType(ContentService.MimeType.JSON);
  }
  
  try {
    const payload = JSON.parse(e.postData.contents);
    
    if (payload.action === 'enroll') {
      const date = new Date();
      const formattedDate = Utilities.formatDate(date, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm");
      
      // الترتيب: التاريخ، الاسم، رقم الهاتف، اسم الدبلومة، الفرع
      sheet.appendRow([formattedDate, payload.name, payload.phone, payload.course, payload.branch]);
      
      return ContentService.createTextOutput(JSON.stringify({status: "success", message: "تم التسجيل بنجاح"}))
                           .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({status: "error", message: "حدث خطأ غير معروف"}))
                         .setMimeType(ContentService.MimeType.JSON);

  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({status: "error", message: error.toString()}))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({status: "error"}))
                         .setMimeType(ContentService.MimeType.JSON);
  }
  
  const parameters = e.parameter;
  
  // دالة لجلب كل المستخدمين وعرضهم في الأدمن
  if(parameters.action === "getEnrollments") {
     const lastRow = Math.max(sheet.getLastRow(), 1); 
     if(lastRow <= 1) {
         return ContentService.createTextOutput(JSON.stringify({status: "success", data: []}))
                              .setMimeType(ContentService.MimeType.JSON);
     }
     
     // نبدأ القراءة من الصف الثاني متخطيين العناوين في الصف الأول
     const data = sheet.getRange(2, 1, lastRow - 1, 5).getValues(); 
     
     const results = [];
     for(let i=0; i<data.length; i++) {
        const row = data[i];
        if(!row[0] && !row[1]) continue; 
        
        results.push({
           date: row[0].toString(),
           name: row[1].toString(),
           phone: row[2].toString(),
           course: row[3].toString(),
           branch: row[4].toString()
        });
     }
     
     return ContentService.createTextOutput(JSON.stringify({status: "success", data: results}))
                          .setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput("Backend بتاع Dev-X شغال زي الفل يا إسلام! 🫡");
}
