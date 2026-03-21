document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('shorten-form');
    const urlInput = document.getElementById('long-url');
    const submitBtn = document.getElementById('submit-btn');
    const resultContainer = document.getElementById('result-container');
    const shortUrlEl = document.getElementById('short-url');
    const copyBtn = document.getElementById('copy-btn');
    const copySuccess = document.getElementById('copy-success');
    const errorMessage = document.getElementById('error-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const longUrl = urlInput.value.trim();
        if (!longUrl) return;

        // Reset UI
        errorMessage.classList.add('hidden');
        resultContainer.classList.add('hidden');
        copySuccess.classList.add('hidden');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        try {
            const response = await fetch('/api/shorten', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url: longUrl })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to shorten URL');
            }

            // Show result
            shortUrlEl.href = data.short_url;
            shortUrlEl.textContent = data.short_url;
            resultContainer.classList.remove('hidden');
            
            // Clear input nicely
            urlInput.value = '';

        } catch (err) {
            errorMessage.textContent = err.message;
            errorMessage.classList.remove('hidden');
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });

    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(shortUrlEl.href);
            copySuccess.classList.remove('hidden');
            
            // Hide success message after 2 seconds
            setTimeout(() => {
                copySuccess.classList.add('hidden');
            }, 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    });

    // Add some dynamic interactive feel to the background blobs on mouse move
    const blobs = document.querySelectorAll('.blob');
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        blobs[0].style.transform = `translate(${x * 20}px, ${y * -20}px)`;
        blobs[1].style.transform = `translate(${x * -30}px, ${y * 30}px) scale(1.1)`;
        blobs[2].style.transform = `translate(${x * 10}px, ${y * 10}px)`;
    });
});
