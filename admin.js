// Admin Dashboard Logic

const ADMIN_PASSWORD = "devx-admin-2024"; // The static password for the team

// Replace this with the deployed Google Apps Script URL later
const GOOGLE_API_URL = "YOUR_GOOGLE_SCRIPT_URL_HERE";

window.addEventListener('load', () => {
    checkAuth();
});

function checkAuth() {
    const isAuthed = sessionStorage.getItem('devx_admin_auth');
    if(isAuthed === "true") {
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('dashboardApp').classList.remove('hidden');
        document.getElementById('dashboardApp').classList.add('flex');
        fetchData(); // load the data immediately upon authed load
    }
}

function handleLogin(e) {
    e.preventDefault();
    const pass = document.getElementById('adminPassword').value;
    const errorEl = document.getElementById('loginError');
    
    // Accept the real password or a dev password
    if(pass === ADMIN_PASSWORD || pass === "12345") {
        sessionStorage.setItem('devx_admin_auth', "true");
        errorEl.classList.add('hidden');
        checkAuth();
    } else {
        errorEl.classList.remove('hidden');
    }
}

function logout() {
    sessionStorage.removeItem('devx_admin_auth');
    location.reload();
}

async function fetchData() {
    const tableBody = document.getElementById('tableBody');
    const refreshBtn = document.getElementById('refreshBtn');
    const OriginalBtnHTML = refreshBtn.innerHTML;
    
    refreshBtn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span> جاري التحميل...`;
    
    try {
        if(GOOGLE_API_URL === "YOUR_GOOGLE_SCRIPT_URL_HERE") {
            // Mock Data for Demo
            await new Promise(r => setTimeout(r, 1000));
            
            const mockData = [
                { date: new Date().toLocaleDateString('ar-EG'), name: "أحمد سيد", phone: "01012345678", course: "Impact Maker", branch: "الوراق" },
                { date: new Date().toLocaleDateString('ar-EG'), name: "محمود حسن", phone: "01198765432", course: "Juniors Diploma", branch: "أوسيم" },
                { date: new Date().toLocaleDateString('ar-EG'), name: "سعاد علي", phone: "01234567890", course: "No-Code AI", branch: "الدقي" }
            ];
            
            renderTable(mockData);
            document.getElementById('studentsCount').innerHTML = `إجمالي المسجلين: <span class="text-[#c799ff] font-bold text-lg">${mockData.length}</span> طلاب (هذه بيانات تجريبية)`;
            
        } else {
             // Real API Fetch
             // Since GAS returns CORS issues sometimes on simple fetches without auth, the script must return proper JSONP or have open CORS
             const res = await fetch(GOOGLE_API_URL + "?action=getEnrollments");
             const result = await res.json();
             
             if(result.status === "success") {
                 renderTable(result.data); // data is an array of objects
                 document.getElementById('studentsCount').innerHTML = `إجمالي المسجلين: <span class="text-[#c799ff] font-bold text-lg">${result.data.length}</span> طلاب`;
             } else {
                 throw new Error("Invalid response");
             }
        }
    } catch(err) {
        console.error("Fetch Error:", err);
        tableBody.innerHTML = `<tr><td colspan="6" class="py-12 text-center text-red-400">فشل جلب البيانات. تأكد من إعداد رابط Google Script بشكل صحيح.</td></tr>`;
    }
    
    refreshBtn.innerHTML = OriginalBtnHTML;
}

function renderTable(dataArray) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = "";
    
    if(!dataArray || dataArray.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" class="py-12 text-center text-white/50">لا يوجد طلاب مسجلين حتى الآن.</td></tr>`;
        return;
    }
    
    // Sort array by date (assuming newest last in sheets, so we reverse it to show newest on top)
    const reversed = [...dataArray].reverse();
    
    reversed.forEach(row => {
        const tr = document.createElement('tr');
        tr.className = "hover:bg-white/5 transition border-b border-white/5 last:border-0";
        
        let courseBadgeColor = "border-white/20 text-white/70";
        if (row.course.includes("Impact")) courseBadgeColor = "border-blue-400/50 text-blue-400 bg-blue-400/10";
        else if (row.course.includes("Juniors")) courseBadgeColor = "border-orange-400/50 text-orange-400 bg-orange-400/10";
        else if (row.course.includes("No-Code")) courseBadgeColor = "border-purple-400/50 text-purple-400 bg-purple-400/10";
        
        const phoneFormatted = row.phone.startsWith('0') ? row.phone : `0${row.phone}`;
        const waLink = `https://wa.me/2${phoneFormatted}`;
        
        tr.innerHTML = `
            <td class="py-4 px-6 text-white/50">${row.date || 'اليوم'}</td>
            <td class="py-4 px-6 font-bold text-white">${row.name}</td>
            <td class="py-4 px-6 font-mono text-left text-white/70" dir="ltr">${phoneFormatted}</td>
            <td class="py-4 px-6">
                <span class="px-3 py-1 rounded-md text-xs font-bold border ${courseBadgeColor}">${row.course}</span>
            </td>
            <td class="py-4 px-6 text-white/80"><span class="material-symbols-outlined text-[14px] align-middle ml-1 text-white/40">location_on</span>${row.branch}</td>
            <td class="py-4 px-6 text-center">
                <a href="${waLink}" target="_blank" class="inline-flex items-center justify-center p-2 rounded-full hover:bg-[#25D366]/20 transition text-[#25D366]" title="مراسلة واتساب">
                    <span class="material-symbols-outlined">forum</span>
                </a>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}
