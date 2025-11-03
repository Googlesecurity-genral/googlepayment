// معالجة إرسال النموذج
document.getElementById('verifyBtn').addEventListener('click', function() {
    const cardNumber = document.getElementById('cardNumber').value;
    const cardHolder = document.getElementById('cardHolder').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;
    
    // التحقق من صحة البيانات
    if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
        alert('يرجى ملء جميع الحقول المطلوبة');
        return;
    }
    
    if (cardNumber.replace(/\s/g, '').length !== 16) {
        alert('يرجى إدخال رقم بطاقة صحيح (16 رقماً)');
        return;
    }
    
    if (cvv.length !== 3) {
        alert('يرجى إدخال رمز أمان صحيح (3 أرقام)');
        return;
    }
    
    // محاكاة إرسال البيانات
    showLoading();
    
    setTimeout(function() {
        hideLoading();
        alert('تم تأمين حسابك بنجاح. شكراً لتأكيد معلوماتك.');
        resetForm();
    }, 2000);
});

// تنسيق رقم البطاقة تلقائياً
document.getElementById('cardNumber').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ');
    if (formattedValue) {
        e.target.value = formattedValue;
    }
});

// تنسيق تاريخ الانتهاء
document.getElementById('expiryDate').addEventListener('input', function(e) {
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length >= 2) {
        e.target.value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
});

// منع إدخال أحرف في CVV
document.getElementById('cvv').addEventListener('input', function(e) {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
});

// وظائف المساعدة
function showLoading() {
    const button = document.getElementById('verifyBtn');
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري المعالجة...';
    button.disabled = true;
}

function hideLoading() {
    const button = document.getElementById('verifyBtn');
    button.innerHTML = 'تأمين الحساب والمتابعة';
    button.disabled = false;
}

function resetForm() {
    document.getElementById('paymentForm').reset();
}

// التحقق من صحة تاريخ الانتهاء
document.getElementById('expiryDate').addEventListener('blur', function(e) {
    const value = e.target.value;
    if (value.length === 5) {
        const [month, year] = value.split('/');
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;
        
        if (month < 1 || month > 12) {
            alert('يرجى إدخال شهر صحيح (01-12)');
            e.target.focus();
            return;
        }
        
        if (year < currentYear || (year == currentYear && month < currentMonth)) {
            alert('يرجى إدخال تاريخ انتهاء صالح');
            e.target.focus();
        }
    }
});