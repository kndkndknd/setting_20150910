import {
  StreamsType,
  cmdLogType,
  cmdStateType,
  sevenSinsType,
} from "../../types/global";

export const states: cmdStateType = {
  cmd: {
    GAIN: {
      MASTER: 1.0,
      SINEWAVE: 0.4,
      FEEDBACK: 1,
      WHITENOISE: 1.0,
      CLICK: 0.9,
      BASS: 1.5,
      CHAT: 1.5,
      GLITCH: 2,
      SIMULATE: 1.0,
      METRONOME: 0.9,
    },
    FADE: {
      IN: 0,
      OUT: 0,
    },
    SINEWAVE: {},
    PORTAMENT: 0,
    VOICE: [],
    voiceLang: "en-US",
    METRONOME: {},
  },
  client: {},
  cmdClient: [],
  streamClient: [],
  sinewaveClient: [],
  current: {
    cmd: {
      FEEDBACK: [],
      WHITENOISE: [],
      CLICK: [],
      BASS: [],
      METRONOME: [],
    },
    sinewave: {},
    stream: {
      CHAT: false,
      PLAYBACK: false,
      TIMELAPSE: false,
    },
    RECORD: false,
  },
  form: {
    hls: {
      knd: "KND",
    },
    cmd: {
      ノイズ: "WHITENOISE",
      サイン波: "SINEWAVE",
      クリック: "CLICK",
      フィードバック: "FEEDBACK",
      ハウリング: "FEEDBACK",
      発振: "FEEDBACK",
      チャット: "CHAT",
      話: "CHAT",
      録: "RECORD",
      再生: "PLAYBACK",
      振り返: "TIMELAPSE",
      振返: "TIMELAPSE",
      前: "PREVIOUS",
      低音: "BASS",
      ベース: "BASS",
      止: "STOP",
      ストップ: "STOP",
      停止: "STOP",
    },
  },
  hls: [],
  previous: {
    text: "",
    cmd: {
      FEEDBACK: [],
      WHITENOISE: [],
      CLICK: [],
      BASS: [],
      METRONOME: [],
    },
    sinewave: {},
    stream: {
      CHAT: false,
      PLAYBACK: false,
      TIMELAPSE: false,
    },
    RECORD: false,
  },
  stream: {
    basisBufferSize: 8192,
    sampleRate: {
      CHAT: 44100,
      PLAYBACK: 44100,
      TIMELAPSE: 44100,
      EMPTY: 44100,
    },
    random: {
      CHAT: false,
      PLAYBACK: false,
      TIMELAPSE: false,
    },
    grid: {
      CHAT: false,
      PLAYBACK: false,
      TIMELAPSE: false,
    },
    glitch: {
      CHAT: false,
      PLAYBACK: false,
      TIMELAPSE: false,
    },
    target: {
      CHAT: [],
      PLAYBACK: [],
      TIMELAPSE: [],
    },
    glitchSampleRate: 96000,
    latency: {
      CHAT: 1000,
      PLAYBACK: 1000,
      TIMELAPSE: 1000,
    },
    randomrate: {
      CHAT: false,
      PLAYBACK: false,
      TIMELAPSE: false,
    },
    randomratemode: "random",
    randomratekey: "A",
    randomraterange: {
      CHAT: {
        min: 4300,
        max: 132300,
      },
      PLAYBACK: {
        min: 4300,
        max: 132300,
      },
      TIMELAPSE: {
        min: 4300,
        max: 132300,
      },
    },
    randomratenote: {
      CHAT: false,
      PLAYBACK: false,
      TIMELAPSE: false,
    },
    quantize: {
      flag: {
        client: {},
        stream: {},
      },
      bpm: {
        CHAT: {},
        PLAYBACK: {},
        TIMELAPSE: {},
      },
      beat: {
        CHAT: {},
        PLAYBACK: {},
        TIMELAPSE: {},
      },
    },
    loop: false,
    timelapse: false,
    floating: false,
  },
  web: {
    flag: false,
    type: "websocket",
    url: "ws://chat.knd.cloud/ws/",
  },
  bpm: {},
  clockMode: false,
  arduino: {
    host: "localhost",
    port: 5050,
    connected: false,
    relay: "off",
  },
  emoji: false,
  timer: true,
};

export const chats = [];

export const oneshots = {
  KICK: {
    audio: [],
    video: [],
    bufferSize: states.stream.basisBufferSize,
  },
  SNARE: {
    audio: [],
    video: [],
    bufferSize: states.stream.basisBufferSize,
  },
  HAT: {
    audio: [],
    video: [],
    bufferSize: states.stream.basisBufferSize,
  },
  SILENCE: {
    audio: [],
    video: [],
    bufferSize: states.stream.basisBufferSize,
  },
};

export const streams: StreamsType = {
  PLAYBACK: {
    audio: [],
    video: [],
    index: 0,
    bufferSize: states.stream.basisBufferSize,
  },
  TIMELAPSE: {
    audio: [],
    video: [],
    index: 0,
    bufferSize: states.stream.basisBufferSize,
  },
  INTERNET: {
    audio: [],
    video: [],
    index: 0,
    bufferSize: states.stream.basisBufferSize,
  },
  EMPTY: {
    audio: [],
    video: [],
    index: 0,
    bufferSize: states.stream.basisBufferSize,
  },
};

export const chat_web = true;

export const cmdList = {
  FEEDBACK: "FEEDBACK",
  FEED: "FEEDBACK",
  WHITENOISE: "WHITENOISE",
  NOISE: "WHITENOISE",
  CLICK: "CLICK",
  BASS: "BASS",
  SIMULATE: "SIMULATE",
  SIMS: "SIMULATE",
  METRONOME: "METRONOME",
  PREVIOUS: "PREVIOUS",
  PREV: "PREVIOUS",
};

export let streamList = ["PLAYBACK", "TIMELAPSE", "EMPTY"];

export const parameterList = {
  PORTAMENT: "PORTAMENT", // 引数が前提 単体は0なら5、0以外なら0
  PORT: "PORTAMENT",
  SAMPLERATE: "SAMPLERATE",
  RATE: "SAMPLERATE",
  BPM: "BPM",
  GLITCH: "GLITCH", // 単体でも使える、引数もありうる
  GRID: "GRID", // ほぼ単体使いな気がするが、STREAM指定できたらそれはそれで
  VOICE: "VOICE", // 単体。引数にするとしたら1 VOICEのような形だと思う
  RANDOM: "RANDOM",
};

export const uploadParams = {
  mediaDir: "chat_upload",
  ss: "00:00:00",
  t: "00:00:20",
};

export const helpList = {
  FEEDBACK:
    "マイクで拾った音をそのPCから再生するので、ほとんどの場合フィードバックが起こる",
  WHITENOISE: "ホワイトノイズを再生する",
  CLICK: "クリックを再生する",
  BASS: "ベースを発音する。BASSコマンドではランダムなPCからの発音で\\キーを押すと押したPCからの発音になる。音程はAのキーのランダム",
  SIMULATE: "マイクで拾った音の音程を真似してサイン波を出す",
  METRONOME: "BPMに合わせて定期的にクリックが鳴る",
  PORTAMENT:
    "サイン波の周波数の変化をなだらかにする。数字を指定するとその秒数で変化する",
  SAMPLERATE:
    "SAMPLERATEまたはRATEのあとに数字でサンプリングレートを指定する、CHATやPLAYBACKの再生速度・ピッチが変わる",
  BPM: "後ろに数字をつけてBPMを指定する。METRONOMEや、CHAT等をGRIDで再生するときにそのBPMで再生される",
  GLITCH: "カメラで拾った画像をグリッチさせる。音声はリバーブ音のみになる",
  GRID: "CHAT、PLAYBACK等をBPMのグリッドに沿って再生する（マシンパワー等によってはずれる）",
  VOICE: "キーボード入力内容を喋るモードを切り替える",
  RANDOM: "PLAYBACKやUPLOADコマンドで取得した音声・映像の順序をランダムにする",
  HELP: "このコマンド",
  PREVIOUS: "STOPする直前に再生されていた内容をまとめて再生する。PREVでも可",
  INSERT:
    "自宅のサーバのDBにPLAYBACK等を保存する INSERT (STREAM名) (場所) (日付)の形式で実行する",
};

export const streamApiUrl: string = "http://127.0.0.1:8088/getLiveStream";

export const cmdLog: cmdLogType = [];
