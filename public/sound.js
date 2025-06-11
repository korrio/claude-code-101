let audioContext;
        let currentWaveType = 'sine';
        
        // Initialize Audio Context
        function initAudio() {
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
        }
        
        // Basic sound function
        function playBasicSound(type, frequency, duration) {
            initAudio();
            
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.type = type;
            oscillator.frequency.value = frequency;
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + duration);
        }
        
        // Game sounds
        function playGameSound(type) {
            initAudio();
            
            switch(type) {
                case 'coin':
                    playSequence([523, 659], [0.1, 0.1], 'triangle');
                    break;
                    
                case 'jump':
                    const osc1 = audioContext.createOscillator();
                    const gain1 = audioContext.createGain();
                    osc1.connect(gain1);
                    gain1.connect(audioContext.destination);
                    
                    osc1.type = 'square';
                    osc1.frequency.setValueAtTime(200, audioContext.currentTime);
                    osc1.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.2);
                    gain1.gain.setValueAtTime(0.1, audioContext.currentTime);
                    gain1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                    
                    osc1.start();
                    osc1.stop(audioContext.currentTime + 0.2);
                    break;
                    
                case 'powerup':
                    playSequence([262, 330, 392, 523], [0.1, 0.1, 0.1, 0.3], 'triangle');
                    break;
                    
                case 'gameover':
                    playSequence([523, 494, 466, 440, 415, 392], [0.15, 0.15, 0.15, 0.15, 0.15, 0.5], 'sawtooth');
                    break;
                    
                case 'shoot':
                    const osc2 = audioContext.createOscillator();
                    const gain2 = audioContext.createGain();
                    osc2.connect(gain2);
                    gain2.connect(audioContext.destination);
                    
                    osc2.type = 'sawtooth';
                    osc2.frequency.setValueAtTime(800, audioContext.currentTime);
                    osc2.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.1);
                    gain2.gain.setValueAtTime(0.2, audioContext.currentTime);
                    gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                    
                    osc2.start();
                    osc2.stop(audioContext.currentTime + 0.1);
                    break;
                    
                case 'explosion':
                    // White noise explosion
                    const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.5, audioContext.sampleRate);
                    const data = buffer.getChannelData(0);
                    for (let i = 0; i < data.length; i++) {
                        data[i] = Math.random() * 2 - 1;
                    }
                    
                    const source = audioContext.createBufferSource();
                    const gain3 = audioContext.createGain();
                    const filter = audioContext.createBiquadFilter();
                    
                    source.buffer = buffer;
                    source.connect(filter);
                    filter.connect(gain3);
                    gain3.connect(audioContext.destination);
                    
                    filter.type = 'lowpass';
                    filter.frequency.setValueAtTime(2000, audioContext.currentTime);
                    filter.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.5);
                    
                    gain3.gain.setValueAtTime(0.3, audioContext.currentTime);
                    gain3.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                    
                    source.start();
                    break;
            }
        }
        
        // Play sequence of notes
        function playSequence(frequencies, durations, type = 'sine') {
            let time = audioContext.currentTime;
            
            frequencies.forEach((freq, index) => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                
                osc.connect(gain);
                gain.connect(audioContext.destination);
                
                osc.type = type;
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0.1, time);
                gain.gain.exponentialRampToValueAtTime(0.01, time + durations[index]);
                
                osc.start(time);
                osc.stop(time + durations[index]);
                
                time += durations[index];
            });
        }
        
        // Musical notes
        const noteFrequencies = {
            'C': [65.41, 130.81, 261.63, 523.25, 1046.50],
            'D': [73.42, 146.83, 293.66, 587.33, 1174.66],
            'E': [82.41, 164.81, 329.63, 659.25, 1318.51],
            'F': [87.31, 174.61, 349.23, 698.46, 1396.91],
            'G': [98.00, 196.00, 392.00, 783.99, 1567.98],
            'A': [110.00, 220.00, 440.00, 880.00, 1760.00],
            'B': [123.47, 246.94, 493.88, 987.77, 1975.53]
        };
        
        function playNote(note, octave) {
            initAudio();
            const frequency = noteFrequencies[note][octave - 1];
            playBasicSound('triangle', frequency, 0.5);
        }
        
        // Play melody
        function playMelody() {
            initAudio();
            
            const melody = [
                {note: 'C', octave: 4, duration: 0.5},
                {note: 'C', octave: 4, duration: 0.5},
                {note: 'G', octave: 4, duration: 0.5},
                {note: 'G', octave: 4, duration: 0.5},
                {note: 'A', octave: 4, duration: 0.5},
                {note: 'A', octave: 4, duration: 0.5},
                {note: 'G', octave: 4, duration: 1.0},
                {note: 'F', octave: 4, duration: 0.5},
                {note: 'F', octave: 4, duration: 0.5},
                {note: 'E', octave: 4, duration: 0.5},
                {note: 'E', octave: 4, duration: 0.5},
                {note: 'D', octave: 4, duration: 0.5},
                {note: 'D', octave: 4, duration: 0.5},
                {note: 'C', octave: 4, duration: 1.0}
            ];
            
            let time = audioContext.currentTime + 0.1;
            
            melody.forEach(({note, octave, duration}) => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                
                osc.connect(gain);
                gain.connect(audioContext.destination);
                
                osc.type = 'triangle';
                osc.frequency.value = noteFrequencies[note][octave - 1];
                gain.gain.setValueAtTime(0.1, time);
                gain.gain.exponentialRampToValueAtTime(0.01, time + duration);
                
                osc.start(time);
                osc.stop(time + duration);
                
                time += duration;
            });
        }
        
        // Special effects
        function playEffect(type) {
            initAudio();
            
            switch(type) {
                case 'siren':
                    for (let i = 0; i < 3; i++) {
                        setTimeout(() => {
                            const osc = audioContext.createOscillator();
                            const gain = audioContext.createGain();
                            osc.connect(gain);
                            gain.connect(audioContext.destination);
                            
                            osc.type = 'sine';
                            osc.frequency.setValueAtTime(800, audioContext.currentTime);
                            osc.frequency.linearRampToValueAtTime(400, audioContext.currentTime + 0.5);
                            osc.frequency.linearRampToValueAtTime(800, audioContext.currentTime + 1);
                            
                            gain.gain.setValueAtTime(0.1, audioContext.currentTime);
                            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
                            
                            osc.start();
                            osc.stop(audioContext.currentTime + 1);
                        }, i * 1000);
                    }
                    break;
                    
                case 'robot':
                    const frequencies = [100, 150, 120, 180, 90];
                    let time = audioContext.currentTime;
                    
                    frequencies.forEach(freq => {
                        const osc = audioContext.createOscillator();
                        const gain = audioContext.createGain();
                        osc.connect(gain);
                        gain.connect(audioContext.destination);
                        
                        osc.type = 'square';
                        osc.frequency.value = freq;
                        gain.gain.setValueAtTime(0.1, time);
                        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
                        
                        osc.start(time);
                        osc.stop(time + 0.2);
                        
                        time += 0.15;
                    });
                    break;
                    
                case 'laser':
                    const osc = audioContext.createOscillator();
                    const gain = audioContext.createGain();
                    osc.connect(gain);
                    gain.connect(audioContext.destination);
                    
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(1000, audioContext.currentTime);
                    osc.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.3);
                    
                    gain.gain.setValueAtTime(0.2, audioContext.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                    
                    osc.start();
                    osc.stop(audioContext.currentTime + 0.3);
                    break;
                    
                case 'alien':
                    for (let i = 0; i < 5; i++) {
                        setTimeout(() => {
                            const osc = audioContext.createOscillator();
                            const gain = audioContext.createGain();
                            osc.connect(gain);
                            gain.connect(audioContext.destination);
                            
                            osc.type = 'triangle';
                            const freq = 200 + Math.random() * 400;
                            osc.frequency.setValueAtTime(freq, audioContext.currentTime);
                            osc.frequency.exponentialRampToValueAtTime(freq * 0.5, audioContext.currentTime + 0.1);
                            
                            gain.gain.setValueAtTime(0.05, audioContext.currentTime);
                            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                            
                            osc.start();
                            osc.stop(audioContext.currentTime + 0.1);
                        }, i * 100);
                    }
                    break;
                    
                case 'helicopter':
                    const osc1 = audioContext.createOscillator();
                    const gain1 = audioContext.createGain();
                    osc1.connect(gain1);
                    gain1.connect(audioContext.destination);
                    
                    osc1.type = 'sawtooth';
                    osc1.frequency.setValueAtTime(80, audioContext.currentTime);
                    
                    // Modulate frequency for helicopter effect
                    const lfo = audioContext.createOscillator();
                    const lfoGain = audioContext.createGain();
                    lfo.connect(lfoGain);
                    lfoGain.connect(osc1.frequency);
                    
                    lfo.frequency.value = 10;
                    lfoGain.gain.value = 20;
                    
                    gain1.gain.setValueAtTime(0.1, audioContext.currentTime);
                    gain1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
                    
                    lfo.start();
                    osc1.start();
                    lfo.stop(audioContext.currentTime + 2);
                    osc1.stop(audioContext.currentTime + 2);
                    break;
                    
                case 'telephone':
                    for (let i = 0; i < 3; i++) {
                        setTimeout(() => {
                            playSequence([800, 600], [0.3, 0.3], 'sine');
                        }, i * 1000);
                    }
                    break;
            }
        }
        
        // Custom sound builder
        function setWaveType(type) {
            currentWaveType = type;
            document.querySelectorAll('.wave-button').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
        }
        
        function updateFreq() {
            document.getElementById('freqValue').textContent = document.getElementById('frequency').value;
        }
        
        function updateDur() {
            document.getElementById('durValue').textContent = document.getElementById('duration').value;
        }
        
        function updateVol() {
            document.getElementById('volValue').textContent = document.getElementById('volume').value;
        }
        
        function playCustomSound() {
            initAudio();
            
            const freq = parseFloat(document.getElementById('frequency').value);
            const dur = parseFloat(document.getElementById('duration').value);
            const vol = parseFloat(document.getElementById('volume').value) / 100;
            
            playBasicSound(currentWaveType, freq, dur);
        }