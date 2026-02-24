const email = `test-${Date.now()}@example.com`;
const password = 'TestFinal123';

// Step 1: Register
console.log('📝 STEP 1: Registering user...');
fetch('http://localhost:4000/api/auth/register-with-link', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({email, password, firstName: 'Test', lastName: 'Final'})
})
.then(r => r.json())
.then(async data => {
  console.log('✅ Registration Response:', {message: data.message, email: data.email, tokenStart: data.verificationToken?.substring(0, 20) + '...'});
  
  // Step 2: Verify Email
  console.log('\n✉️  STEP 2: Verifying email...');
  return fetch(`http://localhost:4000/api/auth/verify-email?token=${data.verificationToken}`)
    .then(r => r.json())
    .then(vdata => {
      console.log('✅ Verification Response:', {message: vdata.message, email: vdata.user.email, balance: vdata.user.balance, tokenStart: vdata.token?.substring(0, 20) + '...'});
      
      // Step 3: Login
      console.log('\n🔐 STEP 3: Logging in...');
      return fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password})
      })
      .then(r => r.json())
      .then(ldata => {
        console.log('✅ Login Response:', {message: ldata.message, email: ldata.user.email, balance: ldata.user.balance, isVerified: ldata.user.isVerified});
        console.log('\n✨ COMPLETE FLOW SUCCESS! User can now access dashboard.');
        process.exit(0);
      });
    });
})
.catch(e => {
  console.error('❌ Error:', e.message);
  process.exit(1);
});
