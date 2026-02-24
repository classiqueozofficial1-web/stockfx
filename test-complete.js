const email = 'complete-' + Date.now() + '@example.com';
console.log('📝 Complete Registration Flow Test');
console.log('==================================');
console.log('Email:', email);
console.log('Name: Complete Test User');
console.log('');

fetch('http://localhost:4000/api/auth/register-with-link', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    email,
    password: 'CompleteTest123',
    firstName: 'Complete',
    lastName: 'Test'
  })
})
.then(r => r.json())
.then(data => {
  console.log('✅ Step 1: REGISTRATION');
  console.log('   Message:', data.message);
  console.log('   Token received:', !!data.verificationToken);
  console.log('');
  
  // Verify email
  return fetch('http://localhost:4000/api/auth/verify-email?token=' + data.verificationToken);
})
.then(r => r.json())
.then(data => {
  console.log('✅ Step 2: EMAIL VERIFICATION');
  console.log('   Message:', data.message);
  console.log('   firstName FROM BACKEND:', data.user.firstName);
  console.log('   lastName FROM BACKEND:', data.user.lastName);
  console.log('');
  
  // Login
  return fetch('http://localhost:4000/api/auth/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({email, password: 'CompleteTest123'})
  });
})
.then(r => r.json())
.then(data => {
  console.log('✅ Step 3: LOGIN');
  console.log('   Message:', data.message);
  console.log('   firstName FROM BACKEND:', data.user.firstName);
  console.log('   lastName FROM BACKEND:', data.user.lastName);
  console.log('');
  console.log('🎯 RESULT:');
  console.log('   Dashboard will show: "Welcome back, ' + data.user.firstName + ' ' + data.user.lastName + '!"');
})
.catch(e => console.error('❌ Error:', e.message));
