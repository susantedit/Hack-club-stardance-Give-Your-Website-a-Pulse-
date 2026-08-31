let audioCtx = null;
let osc1 = null;
let osc2 = null;
let gainNode = null;
let isAudioPlaying = false;

export function initAudio() {
    const audioBtn = document.getElementById('audio-synth-btn');
    const audioText = document.getElementById('audio-status-text');

    if (!audioBtn) return;

    audioBtn.addEventListener('click', () => {
        if (!audioCtx) {
            try {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();

                osc1 = audioCtx.createOscillator();
                osc2 = audioCtx.createOscillator();
                gainNode = audioCtx.createGain();
                const filter = audioCtx.createBiquadFilter();

                osc1.type = 'sine';
                osc1.frequency.setValueAtTime(55, audioCtx.currentTime); // 55Hz sub drone
                osc2.type = 'triangle';
                osc2.frequency.setValueAtTime(110, audioCtx.currentTime); // 110Hz harmonic

                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(220, audioCtx.currentTime);

                gainNode.gain.setValueAtTime(0.0001, audioCtx.currentTime);

                osc1.connect(filter);
                osc2.connect(filter);
                filter.connect(gainNode);
                gainNode.connect(audioCtx.destination);

                osc1.start();
                osc2.start();
            } catch (e) {
                console.warn('AudioContext not supported or blocked:', e);
                return;
            }
        }

        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        if (!isAudioPlaying) {
            gainNode.gain.cancelScheduledValues(audioCtx.currentTime);
            gainNode.gain.setValueAtTime(gainNode.gain.value || 0.0001, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.06, audioCtx.currentTime + 1.2);
            isAudioPlaying = true;
            if (audioText) audioText.textContent = 'AUDIO ON';
            audioBtn.classList.add('active-audio');
        } else {
            gainNode.gain.cancelScheduledValues(audioCtx.currentTime);
            gainNode.gain.setValueAtTime(gainNode.gain.value, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.0);
            isAudioPlaying = false;
            if (audioText) audioText.textContent = 'AUDIO OFF';
            audioBtn.classList.remove('active-audio');
        }
    });
}
