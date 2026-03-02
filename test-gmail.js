(async () => {
  const email = `test-${Date.now()}@example.com`;
  console.log(`📧 Testing Gmail registration with: ${email}`);
  
  try {
    const response = await fetch('http://localhost:4000/api/auth/register-with-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password: 'Password123!',
        firstName: 'Gmail',
        lastName: 'Test'
      })
    });
    
    const data = await response.json();
    console.log('\n✅ Response Status:', response.status);
    console.log('\n📨 Registration Response:');
    console.log(JSON.stringify(data, null, 2));
    
    if (data.verificationToken) {
      console.log('\n🔑 Verification Token:', data.verificationToken.substring(0, 30) + '...');
      console.log('\n📧 Email sent to:', email);
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
})();
