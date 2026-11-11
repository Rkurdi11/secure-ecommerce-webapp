function sanitizeString(str) {
    if (!str) return '';

    let cleanStr = str.trim();
    cleanStr = cleanStr.replace(/'/g, "&#39;"); 
    cleanStr = cleanStr.replace(/"/g, "&quot;"); 
    cleanStr = cleanStr.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    
    return cleanStr;
}

function sanitizePhoneNumber(phone) {
    const numericOnly = phone.replace(/\D/g, '');
    
    if (numericOnly.length < 7 || numericOnly.length > 15) {
        alert("خطأ: يرجى إدخال رقم هاتف صالح (أرقام فقط).");
        return null;
    }
    return numericOnly;
}

function createSecureSession(username) {
    const sessionToken = Math.random().toString(36).substring(2, 15);
    const expirationTime = Date.now() + (30 * 60 * 1000); 
    
    localStorage.setItem('sessionToken', sessionToken);
    localStorage.setItem('sessionUser', username);
    localStorage.setItem('sessionExpires', expirationTime);

    console.log("تم تعيين جلسة جديدة بنجاح مع وقت انتهاء صلاحية.");
}

function destroySession() {
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('sessionUser');
    localStorage.removeItem('sessionExpires');
    console.log("تم تدمير الجلسة.");
}

function checkSessionValidity() {
    const token = localStorage.getItem('sessionToken');
    const expiry = localStorage.getItem('sessionExpires');
    const currentTime = Date.now();

    if (!token || currentTime > expiry) {
        destroySession(); 
        console.log("الجلسة غير صالحة أو منتهية الصلاحية. توجيه لصفحة الدخول.");
        return false;
    }
    return true; 
}
function handleRegistration() {
    const usernameInput = document.getElementById('reg-username').value;
    const passwordInput = document.getElementById('reg-password').value;
    const phoneInput = document.getElementById('phone').value;

    const safeUsername = sanitizeString(usernameInput);
    const safePassword = sanitizeString(passwordInput);
    const safePhone = sanitizePhoneNumber(phoneInput);
    
    if (safePhone && safeUsername && safePassword) {
        console.log(`تم تسجيل بيانات آمنة. الهاتف الآمن: ${safePhone}`);
        alert("تم التسجيل بنجاح! يرجى الآن تسجيل الدخول.");
    } else {
        alert("فشل التسجيل. يرجى التحقق من البيانات.");
    }
}

function handleLogin() {
    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;
    
    const safeUsername = sanitizeString(usernameInput);
    const safePassword = sanitizeString(passwordInput);
    
    if (safeUsername && safePassword) {
        createSecureSession(safeUsername);
        
        window.location.href = 'dashboard.html'; 
    } else {
        alert("يرجى إدخال اسم مستخدم وكلمة مرور.");
    }
}

function logoutUser() {
    destroySession();
    alert("تم تسجيل الخروج بنجاح.");
    window.location.href = 'index.html';
}