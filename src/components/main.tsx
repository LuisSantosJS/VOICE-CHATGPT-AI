import React, { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Configuration, OpenAIApi } from "openai";
//@ts-ignore
import Speech from "speak-tts";
const configuration = new Configuration({
  apiKey: "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",
});

const openai = new OpenAIApi(configuration);

const Dictaphone = () => {
  const speech = new Speech();
  speech.init({
    volume: 1,
    lang: "pt-BR",
    rate: 1.2,
    pitch: 1,
    voice: "Google português do Brasil",
  });
  const {
    transcript,
    listening,
    resetTranscript,
    finalTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

  const [loading, setLoading] = useState(false);
  const [init, setInit] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [history, setHistory] = useState("");

  const startListening = () => {
    if (!init) {
      setInit(true);
    }
    SpeechRecognition.startListening({
      continuous: true,
      language: "pt-BR",
    });
  };

  const generateResponse = async (text: string) => {
    SpeechRecognition.stopListening();
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `com este contexto de conversa: "${history}", me dê uma resposta sobre isso: "${text}"`,
      temperature: 1.0,
      max_tokens: 900,
      echo: false,
      top_p: 1.0,
      frequency_penalty: 0.2,
      presence_penalty: 0.0,
    });
    setHistory(history + text + "; ");
    setSpeaking(true);

    speech
      .speak({
        text: String(response.data.choices[0].text).replace("?", " "),
        queue: false,
        listeners: {
          onstart: () => {
            //    console.log("Start utterance");
          },
          onend: () => {
            // console.log("End utterance");
          },
          onresume: () => {
            //  console.log("Resume utterance");
          },
          onboundary: (event: any) => {
            // console.log(
            //   event.name +
            //     " boundary reached after " +
            //     event.elapsedTime +
            //     " milliseconds."
            // );
          },
        },
      })
      .then(() => {
        resetTranscript();
        setSpeaking(false);
        startListening();
      })
      .catch((e: any) => {
        // console.error("An error occurred :", e);
      });
  };

  useEffect(() => {
    if (transcript == finalTranscript) {
      if (finalTranscript.length > 0) {
        setLoading(true);
        generateResponse(finalTranscript);
      } else {
        setLoading(false);
      }
    }
  }, [finalTranscript]);

  if (!isMicrophoneAvailable) return <span>BrMIcrophone not Available</span>;
  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  if (!init) {
    return (
      <div onClick={startListening} className="center-main">
        <span>CLIQUE NA TELA PARA COMEÇAR</span>
      </div>
    );
  }
  return (
    <>
      <div className="center-main">
        <p>{speaking && "Estou falando..."}</p>
        <p>{!speaking && loading && "Pensando na resposta..."}</p>
        <p>{!speaking && !loading && "Estou escutando..."}</p>
      </div>
      <a
        style={{
          position: "absolute",
          top: 20,
          fontSize: 16,
          left: 20,
          zIndex: 999999,
        }}
        target="_blank"
        href="https://www.instagram.com/luissantos.ts"
      >
        Created by @luissantos.ts
      </a>
    </>
  );
};
export default Dictaphone;
