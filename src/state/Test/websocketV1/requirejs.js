export const requirejsPromise = new Promise((resolve) => {
    if (typeof window !== 'undefined') {
        const require_src = require('requirejs/require.js');

        const script = document.createElement('script');
        script.setAttribute('type', 'application/javascript');
        script.addEventListener('load', () => {
            setTimeout(() => {
                window.requirejs.config({
                    baseUrl: '/',
                    waitSeconds : 600
                });

                resolve(requirejs);
            }, 10);
        });
        script.setAttribute('src', require_src);
        document.head.appendChild(script);
    }
});
