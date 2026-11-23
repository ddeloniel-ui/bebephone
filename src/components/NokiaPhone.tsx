import React, { useEffect, useState, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, Mail, Heart, Check } from 'lucide-react';
import { BEBE_MESSAGES, SECRET_CODE } from '../data/messages';
import { soundEngine } from '../utils/soundEngine';

export type NokiaStage =
  | 'passcode'
  | 'granted'
  | 'inbox'
  | 'reading'
  | 'ended';

interface NokiaPhoneProps {
  stage: NokiaStage;
  onPasscodeSuccess: () => void;
  onOpenInbox: () => void;
  onFinishMessages: () => void;
  onCallAgain: () => void;
}

const KEYPAD_KEYS: { digit: string; letters: string; tilt: string }[] = [
  { digit: '1', letters: 'oo', tilt: 'rotate-[6deg]' },
  { digit: '2', letters: 'abc', tilt: '' },
  { digit: '3', letters: 'def', tilt: '-rotate-[6deg]' },
  { digit: '4', letters: 'ghi', tilt: 'rotate-[4deg]' },
  { digit: '5', letters: 'jkl', tilt: '' },
  { digit: '6', letters: 'mno', tilt: '-rotate-[4deg]' },
  { digit: '7', letters: 'pqrs', tilt: 'rotate-[3deg]' },
  { digit: '8', letters: 'tuv', tilt: '' },
  { digit: '9', letters: 'wxyz', tilt: '-rotate-[3deg]' },
  { digit: '*', letters: '+', tilt: 'rotate-[5deg]' },
  { digit: '0', letters: '␣', tilt: '' },
  { digit: '#', letters: '⇧', tilt: '-rotate-[5deg]' },
];

export const NokiaPhone: React.FC<NokiaPhoneProps> = ({
  stage,
  onPasscodeSuccess,
  onOpenInbox,
  onFinishMessages,
  onCallAgain,
}) => {
  const [codeInput, setCodeInput] = useState('');
  const [errorMsg, setErrorMsg] = useState(false);
  const [errorPulseKey, setErrorPulseKey] = useState(0);
  const [noteRevealed, setNoteRevealed] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const [msgIndex, setMsgIndex] = useState(0);
  const [typedLength, setTypedLength] = useState(0);
  const [subTypedLength, setSubTypedLength] = useState(0);
  const [lcdFlicker, setLcdFlicker] = useState(false);
  const typingTimerRef = useRef<number | null>(null);

  const currentMessage = BEBE_MESSAGES[msgIndex];
  const isFinalMessage = msgIndex === BEBE_MESSAGES.length - 1;

  useEffect(() => {
    if (stage === 'passcode') {
      setCodeInput('');
      setErrorMsg(false);
      setMsgIndex(0);
      setTypedLength(0);
      setSubTypedLength(0);
    }
  }, [stage]);

  const triggerLcdFlicker = useCallback(() => {
    setLcdFlicker(true);
    window.setTimeout(() => setLcdFlicker(false), 140);
  }, []);

  useEffect(() => {
    if (stage !== 'reading') return;

    const fullText = currentMessage.text;
    const subText = currentMessage.subtext || '';
    setTypedLength(0);
    setSubTypedLength(0);

    if (typingTimerRef.current) {
      window.clearInterval(typingTimerRef.current);
    }

    let mainPos = 0;
    let subPos = 0;
    let tickCounter = 0;

    typingTimerRef.current = window.setInterval(() => {
      if (mainPos < fullText.length) {
        mainPos += 1;
        setTypedLength(mainPos);
        tickCounter += 1;
        if (tickCounter % 3 === 0) {
          soundEngine.playTypeTick();
        }
      } else if (subPos < subText.length) {
        subPos += 1;
        setSubTypedLength(subPos);
        tickCounter += 1;
        if (tickCounter % 3 === 0) {
          soundEngine.playTypeTick();
        }
      } else if (typingTimerRef.current) {
        window.clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }
    }, 26);

    return () => {
      if (typingTimerRef.current) {
        window.clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }
    };
  }, [stage, msgIndex, currentMessage]);

  const isTypingComplete =
    stage === 'reading' &&
    typedLength >= currentMessage.text.length &&
    subTypedLength >= (currentMessage.subtext?.length || 0);

  const completeTypingImmediately = useCallback(() => {
    if (typingTimerRef.current) {
      window.clearInterval(typingTimerRef.current);
      typingTimerRef.current = null;
    }
    setTypedLength(currentMessage.text.length);
    setSubTypedLength(currentMessage.subtext?.length || 0);
  }, [currentMessage]);

  const flashPressedKey = useCallback((key: string) => {
    setActiveKey(key);
    window.setTimeout(() => setActiveKey((prev) => (prev === key ? null : prev)), 130);
  }, []);

  const handleDigitPress = useCallback(
    (digit: string) => {
      flashPressedKey(digit);
      soundEngine.playKeypadTone(digit);

      if (stage !== 'passcode') return;

      setErrorMsg(false);
      if (digit === '*' || digit === '#') return;

      setCodeInput((prev) => {
        if (prev.length >= 6) return prev;
        return prev + digit;
      });
    },
    [flashPressedKey, stage]
  );

  const handleDeletePress = useCallback(() => {
    flashPressedKey('del');
    soundEngine.playKeypadTone('del');

    if (stage === 'passcode') {
      setErrorMsg(false);
      setCodeInput((prev) => prev.slice(0, -1));
    } else if (stage === 'reading' && msgIndex > 0) {
      triggerLcdFlicker();
      setMsgIndex((prev) => prev - 1);
    }
  }, [flashPressedKey, stage, msgIndex, triggerLcdFlicker]);

  const submitPasscode = useCallback(() => {
    if (stage !== 'passcode') return;

    if (codeInput === SECRET_CODE) {
      soundEngine.playSuccessChime();
      setErrorMsg(false);
      onPasscodeSuccess();
    } else {
      soundEngine.playErrorBeep();
      setErrorMsg(true);
      setErrorPulseKey((k) => k + 1);
      setCodeInput('');
    }
  }, [stage, codeInput, onPasscodeSuccess]);

  const handlePrevMessage = useCallback(() => {
    flashPressedKey('prev');
    soundEngine.playKeypadTone('nav');
    if (stage === 'passcode') {
      setErrorMsg(false);
      setCodeInput((prev) => prev.slice(0, -1));
      return;
    }
    if (stage === 'reading' && msgIndex > 0) {
      triggerLcdFlicker();
      setMsgIndex((prev) => prev - 1);
    }
  }, [flashPressedKey, stage, msgIndex, triggerLcdFlicker]);

  const handleNextMessage = useCallback(() => {
    flashPressedKey('next');
    soundEngine.playKeypadTone('nav');

    if (stage === 'passcode') {
      submitPasscode();
      return;
    }

    if (stage === 'inbox') {
      soundEngine.playSmsAlert();
      onOpenInbox();
      return;
    }

    if (stage === 'reading') {
      if (!isTypingComplete) {
        completeTypingImmediately();
        return;
      }
      if (msgIndex < BEBE_MESSAGES.length - 1) {
        triggerLcdFlicker();
        setMsgIndex((prev) => prev + 1);
      } else {
        onFinishMessages();
      }
    }
  }, [
    flashPressedKey,
    stage,
    submitPasscode,
    onOpenInbox,
    isTypingComplete,
    completeTypingImmediately,
    msgIndex,
    triggerLcdFlicker,
    onFinishMessages,
  ]);

  const handleNaviPress = useCallback(() => {
    flashPressedKey('ok');
    soundEngine.playKeypadTone('ok');

    if (stage === 'passcode') {
      submitPasscode();
    } else if (stage === 'inbox') {
      soundEngine.playSmsAlert();
      onOpenInbox();
    } else if (stage === 'reading') {
      if (!isTypingComplete) {
        completeTypingImmediately();
      } else if (msgIndex < BEBE_MESSAGES.length - 1) {
        triggerLcdFlicker();
        setMsgIndex((prev) => prev + 1);
      } else {
        onFinishMessages();
      }
    }
  }, [
    flashPressedKey,
    stage,
    submitPasscode,
    onOpenInbox,
    isTypingComplete,
    completeTypingImmediately,
    msgIndex,
    triggerLcdFlicker,
    onFinishMessages,
  ]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (stage === 'passcode') {
        if (/^[0-9]$/.test(e.key)) {
          e.preventDefault();
          handleDigitPress(e.key);
        } else if (e.key === 'Backspace') {
          e.preventDefault();
          handleDeletePress();
        } else if (e.key === 'Enter') {
          e.preventDefault();
          handleNaviPress();
        }
      } else if (stage === 'inbox') {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleNaviPress();
        }
      } else if (stage === 'reading') {
        if (e.key === 'ArrowRight' || e.key === 'Enter') {
          e.preventDefault();
          handleNextMessage();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          handlePrevMessage();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    stage,
    handleDigitPress,
    handleDeletePress,
    handleNaviPress,
    handleNextMessage,
    handlePrevMessage,
  ]);

  const isEnded = stage === 'ended';

  return (
    <div className="relative flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 w-full max-w-4xl mx-auto px-4">
      {/* Classic Chrome-Silver & Black Nokia 3310 Device (Photo 1 Reference) */}
      <div
        className={`relative transition-all duration-1000 ease-out ${
          isEnded ? 'brightness-75 contrast-95 scale-[0.97]' : 'brightness-100 scale-100'
        }`}
      >
        {/* Ambient Ground Shadow */}
        <div
          className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-[230px] h-7 rounded-[50%] bg-[#171717]/28 blur-lg pointer-events-none"
          aria-hidden="true"
        />

        {/* Chrome Outer Silhouette */}
        <div className="relative w-[290px] sm:w-[316px] rounded-t-[76px] rounded-b-[82px] p-[9px] nokia-chrome-outer border border-white/85">
          {/* Inner Glossy Chrome + Charcoal Faceplate */}
          <div className="rounded-t-[68px] rounded-b-[74px] px-4 pt-5 pb-6 nokia-chrome-inner flex flex-col items-center">
            {/* 5 Vertical Earpiece Speaker Holes (Photo 1) */}
            <div className="flex flex-col items-center gap-[5px] mb-3.5" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((dot) => (
                <span
                  key={dot}
                  className="w-[6px] h-[3.5px] rounded-full bg-[#1C1C1C] shadow-[inset_0_1px_1px_rgba(0,0,0,0.95),0_1px_0_rgba(255,255,255,0.6)]"
                />
              ))}
            </div>

            {/* Iconic Dark Rectangular NOKIA Crest */}
            <div className="mb-2.5 px-3 py-[2px] rounded-[3px] bg-gradient-to-b from-[#3A3A3A] to-[#171717] border border-white/30 shadow-sm">
              <span className="block font-[family-name:var(--font-sans)] text-[10px] font-extrabold tracking-[0.26em] text-[#F2F2F2] leading-tight">
                NOKIA
              </span>
            </div>

            {/* Curved Chrome LCD Bezel */}
            <div className="w-full rounded-[20px] p-[4px] bg-gradient-to-b from-[#666666] via-[#D8D8D8] to-[#3A3A3A] shadow-[inset_0_2px_4px_rgba(0,0,0,0.65),0_2px_4px_rgba(255,255,255,0.45)]">
              <div className="rounded-[16px] bg-[#141414] p-[5px]">
                {/* Warm Amber Backlit Nokia 3310 LCD (Photo 1) */}
                <div
                  key={errorPulseKey}
                  onClick={stage === 'reading' && !isTypingComplete ? completeTypingImmediately : undefined}
                  className={`nokia-lcd-surface rounded-[11px] px-2 py-2.5 min-h-[168px] sm:min-h-[178px] flex items-stretch justify-between gap-1.5 text-[#1E140B] select-none transition-all duration-700 ${
                    errorMsg ? 'animate-lcd-error' : ''
                  } ${lcdFlicker ? 'opacity-70' : 'opacity-100'} ${
                    isEnded ? 'brightness-[0.55] saturate-75' : ''
                  }`}
                >
                  {/* LEFT VERTICAL SIGNAL METER (exact Photo 1 signature) */}
                  <div
                    className="flex flex-col items-center justify-end gap-[2px] w-3 shrink-0 py-0.5"
                    aria-label="Signal strength"
                  >
                    <div className="w-[7px] h-[14px] bg-[#1E140B]" />
                    <div className="w-[6px] h-[12px] bg-[#1E140B]" />
                    <div className="w-[5px] h-[10px] bg-[#1E140B]" />
                    <div className="w-[4px] h-[10px] bg-[#1E140B]" />
                    <div className="w-[3px] h-[12px] bg-[#1E140B]" />
                    {/* Pixel Antenna Icon */}
                    <svg className="w-2.5 h-3 mt-0.5" viewBox="0 0 10 12" fill="currentColor">
                      <rect x="4" y="4" width="2" height="8" />
                      <rect x="1" y="1" width="8" height="2" />
                      <rect x="2" y="3" width="6" height="2" opacity="0.8" />
                    </svg>
                  </div>

                  {/* CENTER LCD CONTENT */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    {/* Top micro status */}
                    <div className="flex items-center justify-center border-b border-[#1E140B]/18 pb-0.5 text-[9px] font-[family-name:var(--font-pixel)] tracking-wider">
                      {stage === 'passcode' && 'LOCKED'}
                      {stage === 'granted' && 'OPEN'}
                      {stage === 'inbox' && 'SMS · 1'}
                      {stage === 'reading' && `${String(msgIndex + 1).padStart(2, '0')}/${BEBE_MESSAGES.length}`}
                      {stage === 'ended' && 'STANDBY'}
                    </div>

                    {/* Main Screen Body */}
                    <div className="flex-1 flex flex-col justify-center py-1.5">
                      {stage === 'passcode' && (
                        <div className="flex flex-col items-center text-center">
                          <p className="font-[family-name:var(--font-pixel)] text-[12px] font-bold tracking-wide">
                            HELLO, BEBE.
                          </p>
                          <p className="mt-1 font-[family-name:var(--font-lcd)] text-[15px] leading-[1.1]">
                            Before you can hear this message, you need a secret code.
                          </p>

                          <div className="mt-2 w-full rounded border border-[#1E140B]/45 bg-[#1E140B]/10 px-1.5 py-1">
                            <div className="font-[family-name:var(--font-pixel)] text-[14px] tracking-[0.2em] min-h-[20px] flex items-center justify-center">
                              {codeInput.length > 0 ? (
                                <span>
                                  {codeInput}
                                  {codeInput.length < 6 && <span className="animate-pulse">_</span>}
                                </span>
                              ) : (
                                <span className="opacity-45">______</span>
                              )}
                            </div>
                          </div>

                          <div className="mt-1 min-h-[16px] flex items-center justify-center">
                            {errorMsg ? (
                              <p className="font-[family-name:var(--font-pixel)] text-[8.5px] font-bold bg-[#1E140B] text-[#F69A38] px-1.5 py-0.5">
                                WRONG CODE! TRY AGAIN
                              </p>
                            ) : (
                              <p className="font-[family-name:var(--font-lcd)] text-[12px] opacity-80">
                                Enter code &amp; press OK
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {stage === 'granted' && (
                        <div className="flex flex-col items-center justify-center text-center py-1">
                          <div className="w-8 h-8 border-2 border-[#1E140B] flex items-center justify-center mb-1.5">
                            <Check className="w-4 h-4 stroke-[3]" />
                          </div>
                          <p className="font-[family-name:var(--font-pixel)] text-[12px] font-bold">
                            ACCESS GRANTED!
                          </p>
                          <p className="mt-1 font-[family-name:var(--font-lcd)] text-[15px] animate-pulse">
                            CONNECTING...
                          </p>
                        </div>
                      )}

                      {stage === 'inbox' && (
                        <div className="flex flex-col items-center justify-center text-center py-1">
                          <div className="mb-1.5 animate-bounce">
                            <Mail className="w-6 h-6 stroke-[2.2]" />
                          </div>
                          <p className="font-[family-name:var(--font-pixel)] text-[12px] font-bold">
                            1 NEW MESSAGE
                          </p>
                          <p className="mt-1 font-[family-name:var(--font-lcd)] text-[15px] leading-tight">
                            FROM: SOMEONE WHO CARES
                          </p>
                        </div>
                      )}

                      {stage === 'reading' && (
                        <div className="flex flex-col justify-start">
                          <div className="flex items-center justify-between border-b border-[#1E140B]/20 pb-0.5 mb-1">
                            <span className="font-[family-name:var(--font-pixel)] text-[9px] font-bold">
                              {currentMessage.label}
                            </span>
                            {isFinalMessage && <Heart className="w-3 h-3 fill-[#1E140B]" />}
                          </div>
                          <p className="font-[family-name:var(--font-lcd)] text-[16.5px] leading-[1.14] break-words">
                            {currentMessage.text.slice(0, typedLength)}
                            {typedLength < currentMessage.text.length && (
                              <span className="inline-block w-1.5 h-3 bg-[#1E140B] ml-0.5 align-middle animate-pulse" />
                            )}
                          </p>
                          {currentMessage.subtext && typedLength >= currentMessage.text.length && (
                            <p className="mt-1.5 font-[family-name:var(--font-pixel)] text-[9.5px] leading-[1.3] font-bold">
                              {currentMessage.subtext.slice(0, subTypedLength)}
                              {subTypedLength < currentMessage.subtext.length && (
                                <span className="inline-block w-1.5 h-2.5 bg-[#1E140B] ml-0.5 align-middle animate-pulse" />
                              )}
                            </p>
                          )}
                        </div>
                      )}

                      {stage === 'ended' && (
                        <div className="flex flex-col items-center justify-center text-center py-1">
                          <p className="font-[family-name:var(--font-pixel)] text-[11px] font-bold">
                            END OF MESSAGE.
                          </p>
                          <p className="mt-1.5 font-[family-name:var(--font-lcd)] text-[15px] leading-[1.12]">
                            Thank you for answering my call, Bebe.
                          </p>
                          <p className="mt-1 font-[family-name:var(--font-lcd)] text-[15px] leading-[1.12]">
                            Take care of yourself, okay?
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Bottom Softkey Label inside LCD (MENU / OK / NEXT) */}
                    <div className="flex items-center justify-center border-t border-[#1E140B]/18 pt-0.5 font-[family-name:var(--font-pixel)] text-[10px] font-bold tracking-wider">
                      {stage === 'passcode' && 'OK / CALL'}
                      {stage === 'granted' && 'WAIT...'}
                      {stage === 'inbox' && 'READ [OK]'}
                      {stage === 'reading' && (isFinalMessage ? 'FINISH >' : '< PREV · NEXT >')}
                      {stage === 'ended' && 'BYE ♡'}
                    </div>
                  </div>

                  {/* RIGHT VERTICAL BATTERY METER (exact Photo 1 signature) */}
                  <div
                    className="flex flex-col items-center justify-end gap-[2px] w-3 shrink-0 py-0.5"
                    aria-label="Battery level"
                  >
                    <div className="w-[7px] h-[14px] bg-[#1E140B]" />
                    <div className="w-[6px] h-[12px] bg-[#1E140B]" />
                    <div className="w-[5px] h-[10px] bg-[#1E140B]" />
                    <div className="w-[4px] h-[10px] bg-[#1E140B]" />
                    <div className="w-[3px] h-[12px] bg-[#1E140B]" />
                    {/* Pixel Battery Icon */}
                    <svg className="w-2.5 h-3 mt-0.5" viewBox="0 0 10 12" fill="currentColor">
                      <rect x="3" y="0" width="4" height="2" />
                      <rect x="1" y="2" width="8" height="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
                      <rect x="3" y="4" width="4" height="6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Iconic Nokia 3310 Curved Navigation Cluster (Photo 1) */}
            <div className="w-full mt-3 px-1 flex flex-col items-center">
              {/* Wide Curved Center Navi / Select Button with subtle blue bar */}
              <button
                type="button"
                onClick={handleNaviPress}
                disabled={stage === 'ended' || stage === 'granted'}
                aria-label="Navi OK button"
                className={`w-[58%] h-7 rounded-t-md rounded-b-[20px] nokia-oval-key flex items-center justify-center cursor-pointer disabled:opacity-50 ${
                  activeKey === 'ok' ? 'is-pressed' : ''
                }`}
              >
                <span className="w-9 h-[3.5px] rounded-full bg-[#77B5D9] shadow-[inset_0_1px_1px_rgba(0,0,0,0.3)]" />
              </button>

              {/* Left Curved 'C' (Clear/Delete) & Right Curved '< >' Rocker */}
              <div className="w-full flex items-center justify-between gap-4 -mt-1.5 px-1">
                {/* Left C Button (dark metallic curved) */}
                <button
                  type="button"
                  onClick={handleDeletePress}
                  disabled={stage === 'ended' || stage === 'granted'}
                  aria-label="Clear / Delete button"
                  className={`w-[36%] h-9 rounded-tl-md rounded-tr-xl rounded-bl-[24px] rounded-br-md bg-gradient-to-b from-[#666666] via-[#3B3B3B] to-[#1F1F1F] text-[#F5F5F5] border border-white/25 shadow-[0_3px_0_#0A0A0A,0_4px_7px_rgba(0,0,0,0.5)] hover:brightness-110 active:translate-y-0.5 transition-all flex items-center justify-center text-sm font-bold cursor-pointer disabled:opacity-45 ${
                    activeKey === 'del' ? 'translate-y-0.5' : ''
                  }`}
                >
                  C
                </button>

                {/* Right < / > Dual Rocker Button */}
                <div className="w-[46%] h-9 rounded-tr-md rounded-tl-xl rounded-br-[24px] rounded-bl-md nokia-oval-key flex items-center overflow-hidden">
                  <button
                    type="button"
                    onClick={handlePrevMessage}
                    disabled={stage === 'ended' || stage === 'granted' || (stage === 'reading' && msgIndex === 0)}
                    aria-label="Previous"
                    className="flex-1 h-full flex items-center justify-center text-[#171717] hover:bg-black/5 active:bg-black/15 cursor-pointer disabled:opacity-35"
                  >
                    <ChevronLeft className="w-4 h-4 stroke-[2.6]" />
                  </button>
                  <span className="w-[1px] h-5 bg-[#4B4B4B]/40" aria-hidden="true" />
                  <button
                    type="button"
                    onClick={handleNextMessage}
                    disabled={stage === 'ended' || stage === 'granted'}
                    aria-label="Next"
                    className="flex-1 h-full flex items-center justify-center text-[#171717] hover:bg-black/5 active:bg-black/15 cursor-pointer disabled:opacity-35"
                  >
                    <ChevronRight className="w-4 h-4 stroke-[2.6]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Iconic 4x3 Oval Metallic Nokia 3310 Keypad (Photo 1) */}
            <div className="w-full grid grid-cols-3 gap-x-3 gap-y-2.5 mt-4 px-1">
              {KEYPAD_KEYS.map(({ digit, letters, tilt }, idx) => (
                <React.Fragment key={digit}>
                  <button
                    type="button"
                    onClick={() => handleDigitPress(digit)}
                    disabled={stage === 'ended' || stage === 'granted'}
                    aria-label={`Key ${digit}`}
                    className={`nokia-oval-key ${tilt} h-8 sm:h-9 rounded-full flex items-baseline justify-center gap-1 px-2 cursor-pointer disabled:opacity-50 ${
                      activeKey === digit ? 'is-pressed' : ''
                    }`}
                  >
                    <span className="text-[14px] font-bold text-[#171717] leading-none">
                      {digit}
                    </span>
                    <span className="text-[8.5px] font-medium text-[#2A2A2A] leading-none lowercase">
                      {letters}
                    </span>
                  </button>
                  {/* Tiny tactile dot pair below 5 jkl */}
                  {idx === 4 && (
                    <span className="sr-only" aria-hidden="true" />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Bottom Microphone Slot */}
            <div className="mt-4 w-5 h-1 rounded-full bg-[#0A0A0A] border-b border-white/20" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Contextual Companion Controls & Retro Desk Note */}
      <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-sm w-full">
        {stage === 'passcode' && (
          <div className="w-full flex flex-col items-center lg:items-start">
            <p className="font-[family-name:var(--font-pixel)] text-xs tracking-widest text-[#333333] uppercase">
              Secret Access Required
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-[#171717] text-balance">
              Unlock Bebe&apos;s line.
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-[#333333] leading-relaxed">
              Tap the metallic keypad on the Nokia—or type with your keyboard—then press the center{' '}
              <strong className="font-semibold text-[#171717]">Navi</strong> bar (or{' '}
              <strong className="font-semibold text-[#171717]">&gt;</strong>).
            </p>

            {/* Nostalgic Desk Paper Slip Note with Secret Code */}
            <div className="mt-6 w-full max-w-[270px] bg-[#ECEAE4] border border-[#C8C5BC] shadow-[4px_6px_0_rgba(23,23,23,0.08)] p-4 text-left -rotate-1">
              <div className="flex items-center justify-between border-b border-[#171717]/12 pb-2">
                <span className="font-[family-name:var(--font-pixel)] text-[10px] text-[#333333] tracking-wider">
                  DESK NOTE
                </span>
                <button
                  type="button"
                  onClick={() => setNoteRevealed((v) => !v)}
                  className="text-xs font-medium text-[#171717] underline underline-offset-4 hover:text-[#333333] cursor-pointer"
                >
                  {noteRevealed ? 'Hide' : 'Peek code'}
                </button>
              </div>
              <p className="mt-2.5 font-[family-name:var(--font-lcd)] text-lg text-[#171717] leading-snug">
                {noteRevealed
                  ? 'Secret code for Bebe: 110297'
                  : 'Left beside the phone in case you forgot the 6-digit code...'}
              </p>
              {noteRevealed && (
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playKeypadTone('1');
                    setErrorMsg(false);
                    setCodeInput(SECRET_CODE);
                  }}
                  className="mt-2 text-xs font-semibold text-[#171717] underline underline-offset-4 hover:opacity-75 cursor-pointer"
                >
                  Fill 110297 on keypad
                </button>
              )}
            </div>
          </div>
        )}

        {stage === 'granted' && (
          <div className="w-full flex flex-col items-center lg:items-start">
            <p className="font-[family-name:var(--font-pixel)] text-xs tracking-widest text-[#333333] uppercase">
              Verified
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-[#171717]">
              ACCESS GRANTED!
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#333333]">
              CONNECTING... loading your messages now.
            </p>
          </div>
        )}

        {stage === 'inbox' && (
          <div className="w-full flex flex-col items-center lg:items-start">
            <p className="font-[family-name:var(--font-pixel)] text-xs tracking-widest text-[#333333] uppercase">
              Inbox · 1 Unread
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-[#171717] text-balance">
              1 New Message from someone who cares.
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-[#333333] leading-relaxed">
              Press the phone&apos;s <strong className="font-semibold text-[#171717]">Navi</strong> button—or tap below—to open it.
            </p>
            <button
              type="button"
              onClick={handleNaviPress}
              className="mt-6 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#171717] text-[#F5F5F5] text-sm font-semibold tracking-wider uppercase hover:bg-[#333333] active:translate-y-0.5 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#171717]"
            >
              <span>PRESS OK TO READ</span>
            </button>
          </div>
        )}

        {stage === 'reading' && (
          <div className="w-full flex flex-col items-center lg:items-start">
            <p className="font-[family-name:var(--font-pixel)] text-xs tracking-widest text-[#333333] uppercase">
              {currentMessage.label} · {msgIndex + 1} of {BEBE_MESSAGES.length}
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-[#171717] text-balance">
              A little message for Bebe.
            </h2>
            <p className="mt-2 text-sm text-[#333333] leading-relaxed">
              Read at your own pace on the glowing Nokia screen.
            </p>

            {/* Progress Hairline Bar */}
            <div className="mt-5 w-full max-w-xs h-1 bg-[#D9D9D9] overflow-hidden">
              <div
                className="h-full bg-[#171717] transition-all duration-300"
                style={{
                  width: `${((msgIndex + 1) / BEBE_MESSAGES.length) * 100}%`,
                }}
              />
            </div>

            {/* External Accessible PREVIOUS / NEXT Controls */}
            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={handlePrevMessage}
                disabled={msgIndex === 0}
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg border border-[#171717] text-[#171717] bg-transparent text-xs font-semibold tracking-wider uppercase hover:bg-[#171717]/8 active:translate-y-0.5 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>PREVIOUS</span>
              </button>

              <button
                type="button"
                onClick={handleNextMessage}
                className="inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-lg bg-[#171717] text-[#F5F5F5] text-xs font-semibold tracking-wider uppercase hover:bg-[#333333] active:translate-y-0.5 transition-all cursor-pointer whitespace-nowrap"
              >
                <span>
                  {!isTypingComplete
                    ? 'SHOW FULL'
                    : isFinalMessage
                    ? 'OPEN SPECIAL DELIVERY →'
                    : 'NEXT'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {stage === 'ended' && (
          <div className="w-full flex flex-col items-center lg:items-start">
            <p className="font-[family-name:var(--font-pixel)] text-xs tracking-widest text-[#333333] uppercase">
              END OF MESSAGE.
            </p>
            <h2 className="mt-2.5 text-2xl sm:text-3xl font-semibold tracking-tight text-[#171717] text-balance">
              Thank you for answering my call, Bebe.
            </h2>
            <p className="mt-2.5 text-base text-[#333333] leading-relaxed">
              Take care of yourself, okay?
            </p>

            <button
              type="button"
              onClick={onCallAgain}
              className="mt-7 inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-lg bg-[#171717] text-[#F5F5F5] text-sm font-semibold tracking-wider uppercase shadow-[0_10px_24px_-6px_rgba(23,23,23,0.32)] hover:bg-[#333333] active:translate-y-0.5 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#171717] whitespace-nowrap"
            >
              <span>CALL AGAIN ☎️</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
