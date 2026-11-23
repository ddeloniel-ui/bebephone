export interface BebeMessage {
  id: string;
  label: string;
  text: string;
  subtext?: string;
}

export const SECRET_CODE = '110297';

export const BEBE_MESSAGES: BebeMessage[] = [
  {
    id: 'msg-01',
    label: 'MESSAGE 01',
    text: 'Hey, Bebe! Just checking on you. Have you been taking care of yourself?',
  },
  {
    id: 'msg-02',
    label: 'MESSAGE 02',
    text: "I know things aren't always easy, but I hope you know how strong you are.",
  },
  {
    id: 'msg-03',
    label: 'MESSAGE 03',
    text: "You don't have to figure everything out today. Take your time, okay?",
  },
  {
    id: 'msg-04',
    label: 'MESSAGE 04',
    text: "Even on your worst days, you're still someone worth being proud of.",
  },
  {
    id: 'msg-05',
    label: 'MESSAGE 05',
    text: "Don't be too hard on yourself. You're doing better than you think.",
  },
  {
    id: 'msg-06',
    label: 'MESSAGE 06',
    text: 'Remember to eat, drink enough water, and get some rest. Your health matters.',
  },
  {
    id: 'msg-07',
    label: 'MESSAGE 07',
    text: "It's okay to feel tired. You can pause, breathe, and start again tomorrow.",
  },
  {
    id: 'msg-08',
    label: 'MESSAGE 08',
    text: 'Whatever happens, I hope you never forget how precious you are.',
  },
  {
    id: 'msg-final',
    label: 'FINAL MESSAGE',
    text: 'One last thing, Bebe...',
    subtext: "YOU ARE DOING GREAT. I'M ALWAYS ROOTING FOR YOU. ♡",
  },
];
