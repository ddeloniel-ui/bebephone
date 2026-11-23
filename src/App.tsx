import { useEffect, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { RetroDeskPhone } from './components/RetroDeskPhone';
import { NokiaPhone, NokiaStage } from './components/NokiaPhone';
import { RoseStampScreen } from './components/RoseStampScreen';
import { PixelStars } from './components/PixelStars';
import { soundEngine } from './utils/soundEngine';

type AppScreen = 'incoming' | 'nokia' | 'stamp';

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('incoming');
  const [isPickedUp, setIsPickedUp] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [nokiaStage, setNokiaStage] = useState<NokiaStage>('passcode');

  const [ringMuted, setRingMuted] = useState(false);
  const [lofiOn, setLofiOn] = useState(false);

  // Manage retro telephone ringtone lifecycle on Screen 1
  useEffect(() => {
    if (screen === 'incoming' && !isPickedUp && !ringMuted) {
      soundEngine.startRingtoneLoop();
    } else {
      soundEngine.stopRingtoneLoop();
    }

    return () => {
      soundEngine.stopRingtoneLoop();
    };
  }, [screen, isPickedUp, ringMuted]);

  // Unlock browser Web Audio on first user gesture so ringtone plays smoothly
  useEffect(() => {
    const handleFirstGesture = () => {
      const unlocked = soundEngine.unlock();
      if (unlocked && screen === 'incoming' && !isPickedUp && !ringMuted) {
        soundEngine.startRingtoneLoop();
      }
    };

    window.addEventListener('pointerdown', handleFirstGesture, { once: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true });

    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
  }, [screen, isPickedUp, ringMuted]);

  const handleToggleRingMute = useCallback(() => {
    soundEngine.unlock();
    setRingMuted((prev) => {
      const next = !prev;
      soundEngine.setRingMuted(next);
      if (!next && screen === 'incoming' && !isPickedUp) {
        soundEngine.startRingtoneLoop();
      }
      return next;
    });
  }, [screen, isPickedUp]);

  const handleToggleLofi = useCallback(() => {
    soundEngine.unlock();
    const playing = soundEngine.toggleLofiMusic();
    setLofiOn(playing);
  }, []);

  // Screen 1 -> Screen 2: Pick up the baby blue retro desk phone
  const handlePickUpPhone = useCallback(() => {
    if (isPickedUp) return;
    soundEngine.unlock();
    soundEngine.stopRingtoneLoop();
    soundEngine.playHandsetLift();

    setIsPickedUp(true);
    setIsConnecting(true);

    window.setTimeout(() => {
      setNokiaStage('passcode');
      setScreen('nokia');
      setIsConnecting(false);
    }, 1250);
  }, [isPickedUp]);

  // Screen 2 -> Screen 3: Secret code 110297 accepted
  const handlePasscodeSuccess = useCallback(() => {
    setNokiaStage('granted');
    window.setTimeout(() => {
      soundEngine.playSmsAlert();
      setNokiaStage('inbox');
    }, 1500);
  }, []);

  // Screen 3A -> Screen 3B: Open 1 New Message
  const handleOpenInbox = useCallback(() => {
    setNokiaStage('reading');
  }, []);

  // Screen 3 -> Screen 4 (Special Vintage Rose Postage Stamp)
  const handleFinishMessages = useCallback(() => {
    soundEngine.playPaperFlip();
    setScreen('stamp');
  }, []);

  // Screen 4 (Stamp) -> Screen 5 (Call Ended)
  const handleContinueFromStamp = useCallback(() => {
    setNokiaStage('ended');
    setScreen('nokia');
  }, []);

  // Screen 5 -> Screen 1: Call Again
  const handleCallAgain = useCallback(() => {
    soundEngine.playHandsetLift();
    setIsPickedUp(false);
    setIsConnecting(false);
    setNokiaStage('passcode');
    setScreen('incoming');
  }, []);

  const currentStep =
    screen === 'incoming'
      ? 1
      : screen === 'stamp'
      ? 4
      : nokiaStage === 'passcode' || nokiaStage === 'granted'
      ? 2
      : nokiaStage === 'inbox' || nokiaStage === 'reading'
      ? 3
      : 5;

  const isMessageBackdrop = screen === 'nokia' && (nokiaStage === 'inbox' || nokiaStage === 'reading');
  const isStampBackdrop = screen === 'stamp';

  return (
    <div
      className={`relative min-h-screen flex flex-col justify-between transition-colors duration-700 ${
        isStampBackdrop
          ? 'bg-gradient-to-b from-[#7C889E] via-[#6B778E] to-[#566278] text-[#FAF8F2]'
          : isMessageBackdrop
          ? 'bg-[#E5E5E5] retro-grid-bg text-[#171717]'
          : 'bg-[#F5F5F5] text-[#171717]'
      }`}
    >
      {/* Subtle Vintage Film Grain Overlay */}
      <div className="pointer-events-none fixed inset-0 retro-grain z-20" aria-hidden="true" />

      {/* Occasional Twinkling Retro Pixel Stars (hidden on Royal-Blue Stamp for clean archival feel) */}
      {!isStampBackdrop && <PixelStars variant={isMessageBackdrop ? 'rich' : 'subtle'} />}

      {/* Minimalist Top Bar */}
      <header
        className={`relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between gap-4 border-b transition-colors duration-500 ${
          isStampBackdrop ? 'border-[#F7F0DF]/15' : 'border-[#171717]/8'
        }`}
      >
        <div
          className={`font-[family-name:var(--font-pixel)] text-xs sm:text-sm tracking-wide whitespace-nowrap shrink-0 ${
            isStampBackdrop ? 'text-[#F7F0DF]' : 'text-[#171717]'
          }`}
        >
          A Little Call for Bebe
        </div>

        <nav
          aria-label="Call progress"
          className={`hidden md:flex items-center gap-2.5 text-xs whitespace-nowrap ${
            isStampBackdrop ? 'text-[#F7F0DF]/75' : 'text-[#333333]'
          }`}
        >
          <span className={currentStep === 1 ? 'font-semibold opacity-100' : 'opacity-45'}>
            01 Incoming
          </span>
          <span aria-hidden="true" className="opacity-30">·</span>
          <span className={currentStep === 2 ? 'font-semibold opacity-100' : 'opacity-45'}>
            02 Access Code
          </span>
          <span aria-hidden="true" className="opacity-30">·</span>
          <span className={currentStep === 3 ? 'font-semibold opacity-100' : 'opacity-45'}>
            03 Messages
          </span>
          <span aria-hidden="true" className="opacity-30">·</span>
          <span className={currentStep === 4 ? 'font-semibold text-[#F7F0DF] opacity-100' : 'opacity-45'}>
            04 Special Stamp
          </span>
          <span aria-hidden="true" className="opacity-30">·</span>
          <span className={currentStep === 5 ? 'font-semibold opacity-100' : 'opacity-45'}>
            05 Call Ended
          </span>
        </nav>

        {/* Audio & Music Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {screen === 'incoming' && (
            <button
              type="button"
              onClick={handleToggleRingMute}
              aria-label={ringMuted ? 'Unmute telephone ringtone' : 'Mute telephone ringtone'}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#171717]/20 text-xs font-medium text-[#171717] hover:bg-[#171717]/6 transition-colors cursor-pointer whitespace-nowrap"
            >
              {ringMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{ringMuted ? 'Ring Muted' : 'Ring On'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleToggleLofi}
            aria-label={lofiOn ? 'Turn off lo-fi background music' : 'Turn on lo-fi background music'}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              isStampBackdrop
                ? lofiOn
                  ? 'bg-[#F7F0DF] text-[#122755] border-[#F7F0DF]'
                  : 'border-[#F7F0DF]/30 text-[#F7F0DF] hover:bg-[#F7F0DF]/10'
                : lofiOn
                ? 'bg-[#171717] text-[#F5F5F5] border-[#171717]'
                : 'border-[#171717]/20 text-[#171717] hover:bg-[#171717]/6'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>{lofiOn ? 'Lo-fi On' : 'Lo-fi Off'}</span>
          </button>
        </div>
      </header>

      {/* Main Centered Stage */}
      <main className="relative z-10 flex-1 flex items-center justify-center py-8 sm:py-10">
        <AnimatePresence mode="wait">
          {screen === 'incoming' && (
            <motion.section
              key="screen-incoming"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
              aria-label="Incoming call"
            >
              <RetroDeskPhone
                isPickedUp={isPickedUp}
                isConnecting={isConnecting}
                onPickUp={handlePickUpPhone}
              />
            </motion.section>
          )}

          {screen === 'nokia' && (
            <motion.section
              key="screen-nokia"
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14, scale: 0.98 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
              aria-label="Vintage mobile phone"
            >
              <NokiaPhone
                stage={nokiaStage}
                onPasscodeSuccess={handlePasscodeSuccess}
                onOpenInbox={handleOpenInbox}
                onFinishMessages={handleFinishMessages}
                onCallAgain={handleCallAgain}
              />
            </motion.section>
          )}

          {screen === 'stamp' && (
            <motion.section
              key="screen-stamp"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
              aria-label="Special rose postage stamp"
            >
              <RoseStampScreen onContinue={handleContinueFromStamp} />
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* Quiet Nostalgic Footer */}
      <footer
        className={`relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between text-xs border-t transition-colors duration-500 ${
          isStampBackdrop
            ? 'text-[#F7F0DF]/75 border-[#F7F0DF]/15'
            : 'text-[#333333]/75 border-[#171717]/8'
        }`}
      >
        <span>A Little Call Just for Bebe</span>
        <span className="font-[family-name:var(--font-pixel)] text-[10px] tracking-wider">
          {screen === 'incoming'
            ? 'LINE 01'
            : screen === 'stamp'
            ? 'SPECIAL POST'
            : nokiaStage === 'ended'
            ? 'CALL ENDED'
            : 'CONNECTED'}
        </span>
      </footer>
    </div>
  );
}
