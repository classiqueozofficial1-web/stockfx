const email = 'final-test-' + Date.now() + '@example.com';
console.log('📝 Step 1: Registering...');
console.log('Email:', email);
console.log('Name: Emma Wilson');

fetch('http://localhost:4000/api/auth/register-with-link', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({email, password: 'Final123', firstName: 'Emma', lastName: 'Wilson'})
})
.then(r => r.json())
.then(data => {
  console.log('✅ Registration Response:');
  console.log('   -', data.message);
  console.log('   - Token:', data.verificationToken?.substring(0, 30) + '...');
  console.log('');
  console.log('📝 Step 2: Verifying email...');
  return fetch('http://localhost:4000/api/auth/verify-email?token=' + data.verificationToken);
})
.then(r => r.json())
.then(data => {
  console.log('✅ Verification Response:');
  console.log('   -', data.message);
  console.log('   - firstName:', data.user.firstName);
  console.log('   - lastName:', data.user.lastName);
  console.log('');
  console.log('📝 Step 3: Testing login...');
  return fetch('http://localhost:4000/api/auth/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({email, password: 'Final123'})
  });
})
.then(r => r.json())
.then(data => {
  if (data.user) {
    console.log('✅ Login Response:');
    console.log('   - firstName:', data.user.firstName);
    console.log('   - lastName:', data.user.lastName);
    console.log('   - email:', data.user.email);
    console.log('');
    console.log('✨ Dashboard will show:');
    const fullName = data.user.firstName + ' ' + (data.user.lastName || '');
    console.log('   "Welcome back, ' + fullName.trim() + '!"');
  } else {
    console.log('Response:', data);
  }
})
.catch(e => console.error('Error:', e.message));
