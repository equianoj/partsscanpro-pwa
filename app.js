
async function scan() {
  const fileInput = document.getElementById('photo');
  const output = document.getElementById('output');
  if (!fileInput.files.length) {
    alert('Please take a photo first');
    return;
  }

  const formData = new FormData();
  formData.append('image', fileInput.files[0]);

  output.textContent = 'Scanning...';

  try {
    const res = await fetch('/api-identify', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    output.textContent = JSON.stringify(data, null, 2);
  } catch (e) {
    output.textContent = 'Error scanning part';
  }
}
