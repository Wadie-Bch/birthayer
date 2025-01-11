document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('birthdaySong');
    audio.volume = 0.5;
    const playAudio = async () => {
        try {
            await audio.play();
            document.removeEventListener('click', playAudio);
            document.removeEventListener('touchstart', playAudio);
        } catch (e) {
            console.log("Audio playback failed:", e);
        }
    };

    playAudio();
    document.addEventListener('click', playAudio);
    document.addEventListener('touchstart', playAudio);

    const colors = ['#ff66b2', '#ff99cc', '#ff1a8c', '#ff80bf', '#ff4da6'];
    const balloonContainer = document.querySelector('.balloons');

    function createBalloon() {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.style.left = Math.random() * 100 + '%';
        balloon.style.background = colors[Math.floor(Math.random() * colors.length)];
        balloon.style.animationDuration = Math.random() * 10 + 5 + 's';
        balloon.style.opacity = Math.random() * 0.5 + 0.5;
        balloon.style.transform = `scale(${Math.random() * 0.5 + 0.5})`;
        balloonContainer.appendChild(balloon);
        balloon.addEventListener('animationend', () => {
            balloon.remove();
        });
    }

    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            createBalloon();
        }, i * 300);
    }

    setInterval(createBalloon, 1000);
    const birthday = document.querySelector('h1');
    const sparkles = ['✨', '⭐', '🌟'];
    setInterval(() => {
        const sparkle = document.createElement('span');
        sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
        sparkle.style.position = 'absolute';
        sparkle.style.left = Math.random() * birthday.offsetWidth + 'px';
        sparkle.style.top = Math.random() * birthday.offsetHeight + 'px';
        sparkle.style.animation = 'sparkle 1.5s linear forwards';
        birthday.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 1500);
    }, 500);
});

const style = document.createElement('style');
style.textContent = `
    @keyframes sparkle {
        0% { transform: scale(0); opacity: 0; }
        50% { transform: scale(1.2); opacity: 1; }
        100% { transform: scale(0); opacity: 0; }
    }
`;
document.head.appendChild(style);
